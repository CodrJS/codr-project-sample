import type { OpenAPIV3_1 } from "openapi-types";

const SampleEntitySchema: OpenAPIV3_1.SchemaObject = {
  title: "Sample Entity Schema",
  allOf: [{ $ref: "#/components/schemas/BaseEntitySchema" }],
  required: ["datasetId", "payload"],
  properties: {
    datasetId: {
      type: "object",
      properties: {
        $oid: { type: "string" },
      },
    },
    payload: {
      type: "object",
    },
  },
};

export default SampleEntitySchema;
