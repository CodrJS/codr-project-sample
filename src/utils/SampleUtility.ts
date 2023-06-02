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
        message: "Something went wrong when fetching sample",
        details: {
          sampleId: id,
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
        message: "Something went wrong when fetching sample",
        details: {
          userId,
          error: err,
        },
      });
    }
  }

  async get(token: JwtPayload, id: string) {
    // get desired sample document
    const sample = await this._getDocument<SampleDocument>(id);

    // if sample and read the document, send it, else throw error
    if (SampleAbility(token).can("read", subject("Sample", sample))) {
      return new Response({
        message: "OK",
        details: {
          sample: new Sample(sample),
        },
      });
    } else {
      throw new Error({
        status: 403,
        message: "User is forbidden from reading this sample.",
      });
    }
  }

  async getByUIserId(token: JwtPayload, userId: Types.ObjectId) {
    // get desired user document
    const sample = await this._getDocumentByUserId<SampleDocument>(userId);

    // if user and read the document, send it, else throw error
    if (SampleAbility(token).can("read", subject("Sample", sample))) {
      return new Response({
        message: "OK",
        details: {
          sample: new Sample(sample),
        },
      });
    } else {
      throw new Error({
        status: 403,
        message: "User is forbidden from reading this sample.",
      });
    }
  }

  async create(token: JwtPayload, obj: ISample) {
    // if sample can create samples
    if (SampleAbility(token).can("create", "Sample")) {
      try {
        // create sample
        const sample = await MongoSample.create(obj);
        return new Response({
          message: "OK",
          details: {
            sample: new Sample(sample),
          },
        });
      } catch (e) {
        throw new Error({
          status: 500,
          message:
            "An unexpected error occurred when trying to create a sample.",
          details: e,
        });
      }
    } else {
      throw new Error({
        status: 403,
        message: "User is forbidden from creating samples.",
      });
    }
  }

  async update(token: JwtPayload, id: string, obj: Partial<ISample>) {
    // get desired sample document
    const sample = await this._getDocument<SampleDocument>(id);

    // check permissions
    if (SampleAbility(token).can("update", subject("Sample", sample))) {
      try {
        // update sample.
        const sample = (await MongoSample.findByIdAndUpdate(id, obj, {
          returnDocument: "after",
        })) as SampleDocument;

        // return true if succeeded, else throw error
        return new Response({
          message: "OK",
          details: {
            sample: new Sample(sample),
          },
        });
      } catch (e) {
        throw new Error({
          status: 500,
          message:
            "An unexpected error occurred when trying to update a sample.",
          details: e,
        });
      }
    } else {
      throw new Error({
        status: 403,
        message: "User is forbidden from updating this sample.",
      });
    }
  }

  /**
   * @todo Hard or soft delete samples?
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
        sample: undefined,
      },
    });
  }
}
