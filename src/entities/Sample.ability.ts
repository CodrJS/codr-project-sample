import { Types } from "@codrjs/models";
import { SampleDocument } from "./Sample";

const permissions: Types.Permissions<SampleDocument, "Sample"> = {
  "codr:system": (_user, { can, cannot }) => {
    can("manage", "Sample");
    cannot("update", "Sample", { username: { $eq: "System" } });
    cannot("delete", "Sample", { username: { $eq: "System" } });
  },
  "codr:admin": (_user, { can, cannot }) => {
    can("manage", "Sample");
    cannot("update", "Sample", { username: { $eq: "System" } });
    cannot("delete", "Sample", { username: { $eq: "System" } });
  },
  "codr:researcher": (user, { can }) => {
    // can read all profiles and update it's own
    can("read", "Sample");
    can("update", "Sample", { userId: user._id });
  },
  "codr:annotator": (_user, { can }) => {
    // can only read profiles
    can("read", "Sample");
  },
};

const SampleAbility = (user: Types.JwtPayload) => Types.DefineAbility(user, permissions);
export default SampleAbility;
