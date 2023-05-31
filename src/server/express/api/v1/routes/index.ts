import { Error } from "@codrjs/models";
import { Operation } from "@dylanbulmer/openapi/types/Route";
import verifyJWT from "../../../middlewares/verifyJWT";
import { R201, R401, R403, R500 } from "@dylanbulmer/openapi/classes/responses";

const EntityName = "Unknown";
const EntityType = "Unknown";

export const POST: Operation = [
  /* business middleware not expressible by OpenAPI documentation goes here */
  verifyJWT,
  (req, res) => {
    // const util = new Utility();
    // util
    //   .create(req.user, req.body)
    //   .then(resp => res.status(200).json(resp))
    //   .catch((err: Error) => res.status(err.status).json(err));
    res
      .status(500)
      .json(new Error({ status: 500, message: "Method not implemented." }));
  },
];

// 3.0 specification
POST.apiDoc = {
  description: `Create a(n) ${EntityName} in the database.`,
  tags: [`${EntityName} Management`],
  responses: {
    "201": {
      description: R201.description,
      content: {
        "application/json": {
          schema: {
            properties: {
              details: {
                type: "object",
                properties: {
                  [EntityType.charAt(0).toLocaleLowerCase() +
                  EntityType.slice(1)]: {
                    $ref: `#/components/schemas/${EntityType}EntitySchema`,
                  },
                },
              },
              message: {
                type: "string",
                examples: ["OK"],
              },
            },
          },
        },
      },
    },
    "401": {
      description: R401.description,
      content: {
        "application/json": {
          schema: {
            properties: {
              status: {
                type: "number",
                examples: [401],
              },
              message: {
                type: "string",
                examples: ["User is unauthorized."],
              },
              details: {
                type: "object",
                properties: {},
              },
            },
          },
        },
      },
    },
    "403": {
      description: R403.description,
      content: {
        "application/json": {
          schema: {
            properties: {
              status: {
                type: "number",
                examples: [403],
              },
              message: {
                type: "string",
                examples: [
                  `User is forbidden from reading this ${EntityName}.`,
                ],
              },
              details: {
                type: "object",
                properties: {},
              },
            },
          },
        },
      },
    },
    "500": {
      description: R500.description,
      content: {
        "application/json": {
          schema: {
            properties: {
              status: {
                type: "number",
                examples: [500],
              },
              message: {
                type: "string",
                examples: [
                  `An unexpected error occurred when trying to create a ${EntityName}.`,
                ],
              },
              details: {
                type: "object",
                properties: {},
              },
            },
          },
        },
      },
    },
  },
  security: [
    {
      Bearer: [],
    },
  ],
};
