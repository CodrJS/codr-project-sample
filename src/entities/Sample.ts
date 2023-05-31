import { ISample } from "@codrjs/models";
import { model, Schema, SchemaTypes } from "mongoose";
import {
  AccessibleFieldsModel,
  accessibleFieldsPlugin,
  AccessibleModel,
  accessibleRecordsPlugin,
} from "@casl/mongoose";

export type SampleDocument = ISample & AccessibleFieldsModel<ISample>;
const SampleSchema = new Schema<ISample>(
  {
    avatarUrl: String,
    userId: {
      type: SchemaTypes.ObjectId,
      required: true,
      unique: true,
      index: true,
      ref: "User",
    },
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: {
        first: String,
        last: String,
        preferred: String,
      },
      required: true,
    },
    createdAt: { type: String },
    updatedAt: { type: String },
  },
  {
    timestamps: true,
  }
);

// exports Sample model.
SampleSchema.plugin(accessibleFieldsPlugin);
SampleSchema.plugin(accessibleRecordsPlugin);
const Sample = model<ISample, AccessibleModel<SampleDocument>>(
  "Sample",
  SampleSchema
);
export default Sample;
