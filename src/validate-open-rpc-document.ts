import metaSchema, { OpenRPC } from "@open-rpc/meta-schema";
import JsonSchemaDraft07 from "../lib/json-schema-draft-07.json";
import Ajv, { ErrorObject } from "ajv";

/**
 * @ignore
 */
const ajv = new Ajv();
ajv.addMetaSchema(JsonSchemaDraft07, "https://json-schema.org/draft-07/schema#");

/**
 * Provides an error interface for OpenRPC Document validation
 *
 * @category Errors
 *
 */
export class OpenRPCDocumentValidationError implements Error {
  public name = "OpenRPCDocumentDereferencingError";
  public message: string;

  /**
   * @param errors The errors received by ajv.errors.
   */
  constructor(private errors: ErrorObject[]) {
    this.message = [
      "Error validating OpenRPC Document against @open-rpc/meta-schema.",
      "The errors found are as follows:",
      JSON.stringify(errors, undefined, "  "),
    ].join("\n");
  }
}

/**
 * Returns any JSON Schema validation errors that are found with the OpenRPC document passed in.
 *
 * @param document OpenRPC Document to validate.
 *
 * @returns Either true if everything checks out, or a well formatted error.
 *
 * @example
 * ```typescript
 *
 * const { types } from "@open-rpc/meta-schema"
 * const { validateOpenRPCDocument } from "@open-rpc/schema-utils-js";
 * const badOpenRPCDocument = {};
 * const errors = validateOpenRPCDocument({});
 * if (errors) {
 *   // handle errors
 * }
 * ```
 *
 */
export default function validateOpenRPCDocument(
  document: OpenRPC,
): OpenRPCDocumentValidationError | true {
  const result = ajv.validate(metaSchema, document);

  if (ajv.errors) {
    return new OpenRPCDocumentValidationError(ajv.errors);
  } else {
    return true;
  }
}
