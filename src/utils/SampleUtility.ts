import { subject } from "@casl/ability";
import {
  Sample,
  ISample,
  Utility,
  Error,
  Response,
  Types as CodrTypes,
} from "@codrjs/models";
import MongoSample, { SampleDocument } from "@/entities/Sample";
import SampleAbility from "@/entities/Sample.ability";
import { Types } from "mongoose";

type JwtPayload = CodrTypes.JwtPayload;

export class SampleUtility extends Utility {
  // an internal method for getting the desired document to check against permissions
  protected async _getDocument<T>(id: string) {
    try {
      return (await MongoSample.findById(id)) as T;
    } catch (err) {
      throw new Error({
        status: 500,
        message: "Something went wrong when fetching profile",
        details: {
          profileId: id,
          error: err,
        },
      });
    }
  }

  private async _getDocumentByUserId<T>(userId: Types.ObjectId) {
    try {
      return (await MongoSample.findOne({ userId })) as T;
    } catch (err) {
      throw new Error({
        status: 500,
        message: "Something went wrong when fetching profile",
        details: {
          userId,
          error: err,
        },
      });
    }
  }

  async get(token: JwtPayload, id: string) {
    // get desired profile document
    const profile = await this._getDocument<SampleDocument>(id);

    // if profile and read the document, send it, else throw error
    if (SampleAbility(token).can("read", subject("Sample", profile))) {
      return new Response({
        message: "OK",
        details: {
          profile: new Sample(profile),
        },
      });
    } else {
      throw new Error({
        status: 403,
        message: "User is forbidden from reading this profile.",
      });
    }
  }

  async getByUIserId(token: JwtPayload, userId: Types.ObjectId) {
    // get desired user document
    const profile = await this._getDocumentByUserId<SampleDocument>(userId);

    // if user and read the document, send it, else throw error
    if (SampleAbility(token).can("read", subject("Sample", profile))) {
      return new Response({
        message: "OK",
        details: {
          profile: new Sample(profile),
        },
      });
    } else {
      throw new Error({
        status: 403,
        message: "User is forbidden from reading this profile.",
      });
    }
  }

  async create(token: JwtPayload, obj: ISample) {
    // if profile can create profiles
    if (SampleAbility(token).can("create", "Sample")) {
      try {
        // create profile
        const profile = await MongoSample.create(obj);
        return new Response({
          message: "OK",
          details: {
            profile: new Sample(profile),
          },
        });
      } catch (e) {
        throw new Error({
          status: 500,
          message:
            "An unexpected error occurred when trying to create a profile.",
          details: e,
        });
      }
    } else {
      throw new Error({
        status: 403,
        message: "User is forbidden from creating profiles.",
      });
    }
  }

  async update(token: JwtPayload, id: string, obj: Partial<ISample>) {
    // get desired profile document
    const profile = await this._getDocument<SampleDocument>(id);

    // check permissions
    if (SampleAbility(token).can("update", subject("Sample", profile))) {
      try {
        // update profile.
        const profile = (await MongoSample.findByIdAndUpdate(id, obj, {
          returnDocument: "after",
        })) as SampleDocument;

        // return true if succeeded, else throw error
        return new Response({
          message: "OK",
          details: {
            profile: new Sample(profile),
          },
        });
      } catch (e) {
        throw new Error({
          status: 500,
          message:
            "An unexpected error occurred when trying to update a profile.",
          details: e,
        });
      }
    } else {
      throw new Error({
        status: 403,
        message: "User is forbidden from updating this profile.",
      });
    }
  }

  /**
   * @todo Hard or soft delete profiles?
   */
  async delete(token: JwtPayload, id: string) {
    throw new Error({
      status: 500,
      message: "Method not implemented.",
    });

    // expected return???
    return new Response({
      message: "OK",
      details: {
        profile: undefined,
      },
    });
  }
}
