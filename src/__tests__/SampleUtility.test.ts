import { Error, ISample, Types as CodrTypes } from "@codrjs/models";
import { SampleUtility } from "@/utils/SampleUtility";
import { Types } from "mongoose";
import Sample from "@/entities/Sample";
import { randomUUID } from "crypto";
const Utility = new SampleUtility();

type JwtPayload = CodrTypes.JwtPayload;

const testSystemUser: JwtPayload = {
  _id: new Types.ObjectId(0),
  type: "member",
  email: "system@codrjs.com",
  role: "codr:system",
  flags: {
    isDeleted: false,
    isDisabled: false,
    isAnonymous: false,
  },
  iss: "test-issuer.com",
  sub: new Types.ObjectId(0).toString(),
  jti: randomUUID(),
};

const testAdminUser: JwtPayload = {
  _id: new Types.ObjectId(1),
  type: "member",
  email: "admin@codrjs.com",
  role: "codr:admin",
  flags: {
    isDeleted: false,
    isDisabled: false,
    isAnonymous: false,
  },
  iss: "test-issuer.com",
  sub: new Types.ObjectId(1).toString(),
  jti: randomUUID(),
};

const testResearchUser: JwtPayload = {
  _id: new Types.ObjectId(2),
  type: "member",
  email: "researcher@codrjs.com",
  role: "codr:researcher",
  flags: {
    isDeleted: false,
    isDisabled: false,
    isAnonymous: false,
  },
  iss: "test-issuer.com",
  sub: new Types.ObjectId(2).toString(),
  jti: randomUUID(),
};

const testAnnotatorUser: JwtPayload = {
  _id: new Types.ObjectId(3),
  type: "member",
  email: "annotator@codrjs.com",
  role: "codr:annotator",
  flags: {
    isDeleted: false,
    isDisabled: false,
    isAnonymous: false,
  },
  iss: "test-issuer.com",
  sub: new Types.ObjectId(3).toString(),
  jti: randomUUID(),
};

const demoSample: Omit<ISample, "annotatedBy"> = {
  _id: new Types.ObjectId(4),
  // projectId: new Types.ObjectId(0),
  datasetId: new Types.ObjectId(0),
  payload: { hello: "world" },
};

describe("Sample Utility: Create", () => {
  test("System can add sample", async () => {
    // mock function returns once
    Sample.create = jest.fn().mockResolvedValueOnce({
      ...demoSample,
      createdBy: testSystemUser.sub,
    });

    // run tests
    const sample = await Utility.create(testSystemUser, demoSample);
    expect(sample.details.sample.datasetId).toBe(demoSample.datasetId);
  });

  test("Admin can add sample", async () => {
    // mock function returns once
    Sample.create = jest.fn().mockResolvedValueOnce({
      ...demoSample,
      createdBy: testAdminUser.sub,
    });

    // run tests
    const sample = await Utility.create(testAdminUser, demoSample);
    expect(sample.details.sample.datasetId).toBe(demoSample.datasetId);
  });

  test("Researcher can add sample", async () => {
    // mock function returns once
    Sample.create = jest.fn().mockResolvedValueOnce({
      ...demoSample,
      createdBy: testResearchUser.sub,
    });

    // run tests
    const sample = await Utility.create(testResearchUser, demoSample);
    expect(sample.details.sample.datasetId).toBe(demoSample.datasetId);
  });

  test("Annotator cannot add sample", () => {
    // mock function returns once
    Sample.create = jest.fn().mockResolvedValueOnce(demoSample);

    // run tests
    expect(Utility.create(testAnnotatorUser, demoSample)).rejects.toEqual(
      new Error({
        status: 403,
        message: "User is forbidden from creating samples.",
      })
    );
  });
});

// describe("Sample Utility: Read", () => {
//   test("System can read another sample", async () => {
//     // mock function returns once
//     Sample.findById = jest.fn().mockResolvedValueOnce(demoSample);

//     // run tests
//     const sample = await Utility.get(
//       testSystemUser,
//       demoNewUser._id as unknown as string
//     );
//     expect(sample.details.sample.email).toBe("addsample@codrjs.com");
//   });

//   test("Admin can read another sample", async () => {
//     // mock function returns once
//     Sample.findById = jest.fn().mockResolvedValueOnce(demoSample);

//     // run tests
//     const sample = await Utility.get(
//       testAdminUser,
//       demoNewUser._id as unknown as string
//     );
//     expect(sample.details.sample.email).toBe("addsample@codrjs.com");
//   });

//   test("Researcher can read own sample", async () => {
//     // mock function returns once
//     User.findById = jest.fn().mockResolvedValueOnce(testResearchUser);

//     // run tests
//     const sample = await Utility.get(
//       testResearchUser,
//       testResearchUser._id as unknown as string
//     );
//     expect(sample.details.sample.email).toBe("researcher@codrjs.com");
//   });

//   test("Annotator can read own sample", async () => {
//     // mock function returns once
//     User.findById = jest.fn().mockResolvedValue(testAnnotatorUser);

//     // run tests
//     const sample = await Utility.get(
//       testAnnotatorUser,
//       testAnnotatorUser._id as unknown as string
//     );
//     expect(sample.details.sample.email).toBe("annotator@codrjs.com");
//   });

//   test("Researcher cannot read another sample", () => {
//     // mock function returns once
//     Sample.findById = jest.fn().mockResolvedValueOnce(demoSample);

//     // run tests
//     expect(
//       Utility.get(testResearchUser, demoNewUser._id as unknown as string)
//     ).rejects.toEqual(
//       new Error({
//         status: 403,
//         message: "User is forbidden from reading this sample.",
//       })
//     );
//   });

//   test("Annotator cannot read another sample", () => {
//     // mock function returns once
//     Sample.findById = jest.fn().mockResolvedValueOnce(demoSample);

//     // run tests
//     expect(
//       Utility.get(testAnnotatorUser, demoNewUser._id as unknown as string)
//     ).rejects.toEqual(
//       new Error({
//         status: 403,
//         message: "User is forbidden from reading this sample.",
//       })
//     );
//   });
// });

// describe("Sample Utility: Update", () => {
//   test("System can update another sample", async () => {
//     // mock function returns once
//     Sample.findById = jest.fn().mockResolvedValueOnce(demoSample);
//     User.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(demoNewUser);

//     // run tests
//     const sample = await Utility.update(
//       testSystemUser,
//       demoNewUser._id as unknown as string,
//       demoNewUser
//     );
//     expect(sample.details.sample.email).toBe("addsample@codrjs.com");
//   });

//   test("System cannot update system sample", async () => {
//     // mock function returns once
//     User.findById = jest.fn().mockResolvedValueOnce(testSystemUser);

//     // run tests
//     expect(
//       Utility.update(
//         testSystemUser,
//         testSystemUser._id as unknown as string,
//         testSystemUser
//       )
//     ).rejects.toEqual(
//       new Error({
//         status: 403,
//         message: "User is forbidden from updating this sample.",
//       })
//     );
//   });

//   test("Admin can update another sample", async () => {
//     // mock function returns once
//     User.findById = jest.fn().mockResolvedValueOnce(testAdminUser);
//     User.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(demoNewUser);

//     // run tests
//     const sample = await Utility.update(
//       testAdminUser,
//       demoNewUser._id as unknown as string,
//       demoNewUser
//     );
//     expect(sample.details.sample.email).toBe("addsample@codrjs.com");
//   });

//   test("Admin cannot update system sample", async () => {
//     // mock function returns once
//     User.findById = jest.fn().mockResolvedValueOnce(testSystemUser);

//     // run tests
//     expect(
//       Utility.update(
//         testResearchUser,
//         testSystemUser._id as unknown as string,
//         testSystemUser
//       )
//     ).rejects.toEqual(
//       new Error({
//         status: 403,
//         message: "User is forbidden from updating this sample.",
//       })
//     );
//   });

//   test("Researcher cannot update samples", async () => {
//     // mock function returns once
//     Sample.findById = jest.fn().mockResolvedValueOnce(demoSample);

//     // run tests
//     expect(
//       Utility.update(
//         testResearchUser,
//         demoNewUser._id as unknown as string,
//         demoNewUser
//       )
//     ).rejects.toEqual(
//       new Error({
//         status: 403,
//         message: "User is forbidden from updating this sample.",
//       })
//     );
//   });

//   test("Annotator cannot update samples", async () => {
//     // mock function returns once
//     Sample.findById = jest.fn().mockResolvedValueOnce(demoSample);

//     // run tests
//     expect(
//       Utility.update(
//         testAnnotatorUser,
//         demoNewUser._id as unknown as string,
//         demoNewUser
//       )
//     ).rejects.toEqual(
//       new Error({
//         status: 403,
//         message: "User is forbidden from updating this sample.",
//       })
//     );
//   });
// });

/**
 * @TODO Add test cases for (soft) deleting a sample.
 */
