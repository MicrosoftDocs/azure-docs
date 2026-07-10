---
title: Encode, Decode, or Generate Schemas for Flat Files
description: Encode, decode, or generate schemas to exchange XML using flat files in workflows for Azure Logic Apps.
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 06/22/2026
ms.update-lifecycle: 365-days
ms.custom: sfi-image-nochange
#Customer intent: As an integration developer who works with Azure Logic Apps, I want to encode, decode, or generate schemas so I can exchange XML between partners using flat files in workflows.
---

# Encode, decode, or generate schemas for flat files in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

For business-to-business (B2B) integration workflows, you often need to convert data between XML and flat file formats before you can exchange this data with trading partners.

This guide shows how to use **Flat File** built-in connector actions to encode or decode XML and to generate BizTalk-compatible flat file schemas from sample data.

## Connector technical reference

The **Flat File** connector includes the following encoding, decoding, and schema generation actions:

| Action | Consumption | Standard |
|--------|-------------|----------|
| **Flat File Encoding** | Yes | Yes |
| **Flat File Decoding** | Yes | Yes |
| **Flat File Schema Generation** | No | Yes|

| Logic app | Environment |
|-----------|-------------|
| Consumption | Multitenant Azure Logic Apps |
| Standard | Single-tenant Azure Logic Apps, App Service Environment v3 (Windows plans only), and hybrid deployment |

For more information, see [Integration account built-in connectors](../connectors/built-in.md#b2b-built-in-operations).

## Prerequisites

- An Azure account and subscription. [Get a free Azure account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

- The logic app resource and workflow where you want to use the **Flat File** operations.

  **Flat File** operations don't include any triggers. Your workflow can start with any trigger or use any action to bring in the source XML.
  
  The examples in this article use the **Request** trigger named **When an HTTP request is received**.

  For more information, see:

  - [Create a Consumption logic app workflow using the Azure portal](quickstart-create-example-consumption-workflow.md)

  - [Create a Standard logic app workflow using the Azure portal](create-single-tenant-workflows-azure-portal.md)

- An [integration account resource](enterprise-integration/create-integration-account.md) to define and store artifacts for enterprise integration and B2B workflows.

  - Both your integration account and logic app resource must exist in the same Azure subscription and Azure region.

  - Before you start working with **Flat File** operations, you must [link your Consumption logic app](enterprise-integration/create-integration-account.md?tabs=consumption#link-account) or [link your Standard logic app](enterprise-integration/create-integration-account.md?tabs=standard#link-account) to the integration account for working with artifacts such as trading partners and agreements. You can link an integration account to multiple Consumption or Standard logic app resources to share the same artifacts.

  > [!TIP]
  >
  > If you're not working with B2B artifacts such as trading partners and agreements in Standard workflows, you might not need an integration account. Instead, you can upload schemas directly to your Standard logic app resource. Either way, you can use the same schema across all child workflows in the same logic app resource. To use the same schema across multiple logic app resources, you must use and link an integration account.

- A flat file schema that specifies how to encode or decode XML content.

  In Standard workflows, **Flat File** operations let you select a schema from a linked integration account or that you previously uploaded to your logic app, but not both.

  For more information, see [Add schemas to integration accounts](logic-apps-enterprise-integration-schemas.md).

[!INCLUDE [api-test-http-request-tools-bullet](../../includes/api-test-http-request-tools-bullet.md)]

## Limitations

- XML content that you want to decode must be encoded in UTF-8 format.

- In your flat file schema, make sure the contained XML groups don't have excessive numbers of the `max count` property set to a value *greater than 1*. Avoid nesting an XML group with a `max count` property value greater than 1 inside another XML group with a `max count` property greater than 1.

- When Azure Logic Apps parses the flat file schema, and when the schema allows the choice of the next fragment, Azure Logic Apps generates a *symbol* and a *prediction* for that fragment. If the schema allows too many constructs, for example, more than 100,000, the schema expansion becomes very large, which consumes too many resources and too much time.

## Upload schema

After you create your schema, upload the schema based on your workflow:

- Consumption: [Add schemas to integration accounts for Consumption workflows](logic-apps-enterprise-integration-schemas.md?tabs=consumption#add-schema)

- Standard: [Add schemas to integration accounts for Standard workflows](logic-apps-enterprise-integration-schemas.md?tabs=standard#add-schema)

## Add a flat file encoding action

1. In the [Azure portal](https://portal.azure.com), open your logic app resource.

1. In the designer, open your workflow.

   If your workflow doesn't have a trigger or any other actions that your workflow needs, add those operations first.

   This example uses the **Request** trigger named **When an HTTP request is received**. To add a trigger, see [Add a trigger to start your workflow](add-trigger-action-workflow.md#add-trigger).

1. In the designer, follow these [general steps](add-trigger-action-workflow.md#add-action) to add the built-in action named **Flat File Encoding**.

   The action information pane opens with the **Parameters** tab selected.

1. In the action's **Content** parameter, provide the XML content to encode, which is either output from the trigger or from a previous action, by following these steps:

   1. Select inside the **Content** box, and then select the lightning icon to open the dynamic content list.

   1. From the dynamic content list, select the XML content to encode.
   
   The following example shows the opened dynamic content list, the output from the **When an HTTP request is received** trigger, and the selected **Body** content from the trigger output.

   :::image type="content" source="./media/logic-apps-enterprise-integration-flatfile/select-content-to-encode.png" alt-text="Screenshot shows the Azure portal, workflow designer, Flat File Encoding action, and Content parameter with dynamic content list and content selected for encoding." lightbox="./media/logic-apps-enterprise-integration-flatfile/select-content-to-encode.png":::

   > [!NOTE]
   >
   > If **Body** doesn't appear in the dynamic content list, next to the **When an HTTP request is received** section label, select **See more**. You can also directly enter the content to encode in the **Content** box.

1. From the **Schema Name** list, select your schema.

   :::image type="content" source="./media/logic-apps-enterprise-integration-flatfile/select-encoding-schema.png" alt-text="Screenshot shows the designer and opened Schema Name list with selected schema for encoding." lightbox="./media/logic-apps-enterprise-integration-flatfile/select-encoding-schema.png":::

   > [!NOTE]
   >
   > If the schema list is empty, the cause might be:
   >
   > - The logic app resource isn't linked to an integration account.
   > - The linked integration account doesn't contain any schema files.
   > - The logic app resource doesn't contain any schema files. This reason applies only to Standard logic apps.

1. To add other optional parameters to the action, select those parameters from the **Advanced parameters** list.

   | Parameter | Value | Description |
   |-----------|-------|-------------|
   | **Mode of empty node generation** | **ForcedDisabled** or **HonorSchemaNodeProperty** or **ForcedEnabled** | The mode to use for empty node generation with flat file encoding. <br><br>For BizTalk, the flat file schema has a property that controls empty node generation. You can follow the empty node generation property behavior for your flat file schema. Alternatively, you can use this setting to have Azure Logic Apps generate or omit empty nodes. For more information, see [Tags for empty elements](https://www.w3.org/TR/xml/#dt-empty). |
   | **XML Normalization** | **Yes** or **No** | The setting to enable or disable XML normalization in flat file encoding. For more information, see [XmlTextReader.Normalization](/dotnet/api/system.xml.xmltextreader.normalization). |

1. Save your workflow. On the designer toolbar, select **Save**.

## Add a flat file decoding action

1. In the [Azure portal](https://portal.azure.com), open your logic app resource.

1. In the designer, open your workflow.

   If your workflow doesn't have a trigger or any other actions that your workflow needs, add those operations first.

   This example uses the **Request** trigger named **When an HTTP request is received**. To add a trigger, see [Add a trigger to start your workflow](add-trigger-action-workflow.md#add-trigger).

1. In the designer, follow these [general steps](add-trigger-action-workflow.md#add-action) to add the built-in action named **Flat File Decoding**.

1. In the action's **Content** parameter, provide the XML content to decode, either as output from the trigger or from a previous action by following these steps:

   1. Select inside the **Content** box, and then select the lightning icon to open the dynamic content list.

   1. From the dynamic content list, select the XML content to decode.
   
   The following example shows the opened dynamic content list, the output from the **When an HTTP request is received** trigger, and the selected **Body** content from the trigger output.

   :::image type="content" source="./media/logic-apps-enterprise-integration-flatfile/select-content-to-decode.png" alt-text="Screenshot shows the Azure portal, workflow designer, Flat File Decoding action, and Content parameter with dynamic content list and content selected for decoding." lightbox="./media/logic-apps-enterprise-integration-flatfile/select-content-to-decode.png":::

   > [!NOTE]
   >
   > If **Body** doesn't appear in the dynamic content list, select **See more** next to the **When an HTTP request is received** section label. You can also directly enter the content to decode in the **Content** box.

1. From the **Schema Name** list, select your schema.

   :::image type="content" source="./media/logic-apps-enterprise-integration-flatfile/select-decoding-schema.png" alt-text="Screenshot shows the designer and opened Schema Name list with selected schema for decoding." lightbox="./media/logic-apps-enterprise-integration-flatfile/select-decoding-schema.png":::

   > [!NOTE]
   >
   > If the schema list is empty, the cause might be:
   >
   > - The logic app resource isn't linked to an integration account.
   > - The linked integration account doesn't contain any schema files.
   > - The logic app resource doesn't contain any schema files. This reason applies only to Standard logic apps.

1. Save your workflow. On the designer toolbar, select **Save**.

You're now done with setting up your flat file decoding action. In a real world app, you might want to store the decoded data in a line-of-business (LOB) app, such as Salesforce. Or, you can send the decoded data to a trading partner. To send the output from the decoding action to Salesforce or to your trading partner, use the other connectors available in Azure Logic Apps:

- [Managed connectors in Azure Logic Apps](../connectors/managed.md)
- [Built-in connectors in Azure Logic Apps](../connectors/built-in.md)

## Add a flat file schema generation action

The **Flat File Schema Generation** action generates an XSD flat file schema at runtime from sample flat file content that you provide as input. The generated schema is compatible with BizTalk flat file annotations, such as `b:schemaInfo`, `b:recordInfo`, and `b:fieldInfo`.

1. In the [Azure portal](https://portal.azure.com), open your logic app resource.

1. In the designer, open your workflow.

   If your workflow doesn't have a trigger or any other actions that your workflow needs, add those operations first.

   This example uses the **Request** trigger named **When an HTTP request is received**. To add a trigger, see [Add a trigger to start your workflow](add-trigger-action-workflow.md#add-trigger).

1. In the designer, follow these [general steps](add-trigger-action-workflow.md#add-action) to add the built-in action named **Flat File Schema Generation**.

1. In the action's **Content** parameter, provide the flat file sample content.

   You can use content from the trigger output or a previous action:

   1. Select inside the **Content** box, then select the lightning icon to open the dynamic content list.

   1. From the dynamic content list, select the sample flat file content.

1. Set the **Record structure** parameter to either **Delimited** or **Positional**.

   The designer uses dynamic parameters (`getFlatFileSchemaGenerationParameters`) to show the correct parameter set, based on the selected `recordStructure` value.

   The following example shows the configuration parameters for **Delimited** record structure:

   :::image type="content" source="./media/logic-apps-enterprise-integration-flatfile/flatfile-delimited.png" alt-text="Screenshot shows the Azure portal, workflow designer, Flat File schema generation action, and Content parameter with delimited record structure." lightbox="./media/logic-apps-enterprise-integration-flatfile/flatfile-delimited.png":::

   The following example shows the configuration parameters for **Positional** record structure:

   :::image type="content" source="./media/logic-apps-enterprise-integration-flatfile/flatfile-positional.png" alt-text="Screenshot shows the Azure portal, workflow designer, Flat File schema generation action, and Content parameter with Positional record structure." lightbox="./media/logic-apps-enterprise-integration-flatfile/flatfile-positional.png":::

1. For your selected record structure, set the required and optional parameters.

   **Common parameters (Delimited and Positional)**

   | Parameter | Type | Required | Description |
   |---|---|---|---|
   | `content` | Any | Yes | Flat file sample data content (string or binary). |
   | `recordStructure` | String | Yes | Either `Delimited` or `Positional`. |
   | `hasHeader` | Boolean | Yes | If `true`, treats the first record line as the header and uses those values as the generated field names. |
   | `recordDelimiter` | String | No | Record (line) delimiter. Parsing uses this value literally (no hex decoding). Use actual characters, such as `\r\n` or `\n`. To use default line splitting, omit this value. The generated XSD can emit a hex value (`0x0D0A`) in schema annotations. |
   | `recordDelimiterOrder` | String | No | Delimiter placement: `Infix` (default), `Prefix`, or `Postfix`. |
   | `rootElementName` | String | No | Root element name for the XSD. Default: `Root`. |
   | `targetNamespace` | String | No | Target namespace for the schema. Default: `http://schemas.microsoft.com/FlatFile/{RootElementName}` |
   | `recordName` | String | No | Name for the repeating child record element. Default: `{RootElementName}_Record` |

   **Delimited-specific parameters**

   | Parameter | Type | Required | Description |
   |---|---|---|---|
   | `fieldDelimiter` | String | Yes | Field delimiter characters, such as comma, semicolon, tab, Provide actual characters, such as `,`, `;`, or `\t`. Parsing uses literal string comparison (no hex decoding). |
   | `fieldDelimiterOrder` | String | Yes | Delimiter placement: `Infix` (default), `Prefix`, or `Postfix`. |
   | `escapeCharacter` | String | No | Escape character for embedded delimiters in field values. Provide the actual character, such as `\` or `"`. Parsing uses literal matching (no hex decoding). |

   **Positional-specific parameters**

   | Parameter | Type | Required | Description |
   |---|---|---|---|
   | `countPositionsByByte` | Boolean | Yes | Measures field lengths in bytes (`true`) or characters (`false`). Relevant for multibyte encodings. |
   | `fieldPositions` | Array | Yes | Array of field position objects, each with `length` and `justification`. |
   | `fieldPositions[].length` | Integer | Yes | Fixed width of the field. |
   | `fieldPositions[].justification` | String | Yes | Controls padding alignment. Manually enter the value `Left` or `Right` (case-insensitive). <br><br>**Note**: The current designer doesn't provide a list for you to select a value. |

1. Before you run the workflow, review the delimiter and escape character behavior:

   **Record delimiter behavior**

   | Aspect | Behavior |
   |---|---|
   | Parsing (splitting lines) | `options.RecordDelimiter` (raw user value) passes directly to `String.Split()`. No hex decoding. |
   | XSD output | `GetRecordDelimiterForSchema()` converts as follows: <br><br>- If `0x`-prefixed, pass through. <br>- If empty, default to `0x0D0A`. <br>- Otherwise, convert literal chars to hex bytes. |
   | Hex input | No for parsing. If you provide `0x0D0A`, parsing tries to split on the literal text `0x0D0A`. |
   | What to provide | Use the literal characters: `\r\n`, `\n`, or omit entirely, which defaults to splitting on `\r\n`/`\n`/`\r`. |

   **Field delimiter behavior**

   | Aspect | Behavior |
   |---|---|
   | Parsing (splitting fields) | `options.FieldDelimiter` passes directly to `SplitDelimitedRecord()` as a literal string comparison. No hex decoding. |
   | XSD output | If the value starts with `0x`, emits `child_delimiter_type="hex"`; otherwise, `"char"`. |
   | Hex input | No for parsing. `0x09` matches literal text `0x09`, not tab. |
   | What to provide | Use actual character(s): `,`, `;`, `\t`, `|`, and so on. |

   **Escape character behavior**

   | Aspect | Behavior |
   |---|---|
   | Parsing (escaping) | `options.EscapeCharacter` is compared literally. When matched, the next character is consumed as-is. No hex decoding. |
   | XSD output | If value starts with `0x`, emits `escape_char_type="hex"`; otherwise, `"char"`. |
   | Hex input | No for parsing. Same literal-match behavior. |
   | What to provide | Use the actual character, for example, `\` or `"`. |

1. Save your workflow. On the designer toolbar, select **Save**.

1. To use the generated schema output for decode or encode actions, manually save this output as an `.xsd` file.

1. Upload the `.xsd` file to your integration account. Or, for Standard workflows, upload the file to the logic app resource **Artifacts** folder. You can also use the REST API to upload the schema artifact.

   The generated schema is returned in the action outputs body as a string:

   ```text
   @body('Flat_File_Schema_Generation')
   ```

1. Optionally, use the following definition examples:

   **Delimited example**

   ```json
   {
      "Flat_File_Schema_Generation": {
         "type": "FlatFileSchemaGeneration",
         "runAfter": {},
         "inputs": {
            "content": "@triggerBody()",
            "recordStructure": "Delimited",
            "fieldDelimiter": ";",
            "fieldDelimiterOrder": "Infix",
            "recordDelimiter": "\\r\\n",
            "hasHeader": true,
            "rootElementName": "MerchantOrders",
            "targetNamespace": "http://schemas.contoso.com/FlatFile/MerchantOrders",
            "recordName": "MerchantOrder",
            "escapeCharacter": "\\"
         }
      }
   }
   ```

   **Positional example**

   ```json
   {
      "Flat_File_Schema_Generation": {
         "type": "FlatFileSchemaGeneration",
         "runAfter": {},
         "inputs": {
            "content": "@triggerBody()",
            "recordStructure": "Positional",
            "fieldPositions": [
               { "length": 6, "justification": "Left" },
               { "length": 5, "justification": "Left" },
               { "length": 3, "justification": "Left" }
            ],
            "countPositionsByByte": false,
            "hasHeader": false,
            "rootElementName": "Ledger",
            "targetNamespace": "http://schemas.contoso.com/FlatFile/Ledger"
         }
      }
   }
   ```

   Pass the generated schema to the next action:

   ```json
   {
      "Next_Action": {
         "inputs": {
            "schema": "@body('Flat_File_Schema_Generation')"
         },
         "runAfter": {
            "Flat_File_Schema_Generation": [ "Succeeded" ]
         }
      }
   }
   ```

1. Review the output, inference rules, and known issues:

   Output:

   | Property | Type | Description |
   |---|---|---|
   | `body` | String | Generated BizTalk-compatible XSD schema as an XML string. |

   High-level generated XSD contents:

   - `b:schemaInfo` annotation with `standard="Flat File"`, `root_reference`, and `codepage="65001"` (UTF-8)
   - `b:recordInfo` annotations per record with `structure`, `child_delimiter`, `child_delimiter_type`, `child_order`, and optional `escape_char` and `escape_char_type`
   - `b:fieldInfo` annotations per field with `justification` and, for positional schemas, `pos_offset` and `pos_length`
   - Data type inference from sample data: `xs:string`, `xs:integer`, `xs:decimal`, `xs:boolean`, `xs:date`, `xs:dateTime`

   Data type inference from first non-empty data record:

   | Sample value | Inferred XSD type |
   |---|---|
   | `true` or `false` | `xs:boolean` |
   | `12345` | `xs:integer` |
   | `19.99` | `xs:decimal` |
   | `2025-01-15` | `xs:date` |
   | `2025-01-15T10:30:00` | `xs:dateTime` |
   | Any other value | `xs:string` |

   Child order (delimiter placement):

   | Order | Meaning | Example (`;`) |
   |---|---|---|
   | `Infix` | Delimiter between fields | `A;B;C` |
   | `Prefix` | Delimiter before each field | `;A;B;C` |
   | `Postfix` | Delimiter after each field | `A;B;C;` |

   Header handling:

   - When `hasHeader` is `true`, the first line is treated as field names, not data.
   - Header values are sanitized to valid XML element names. Special characters become `_`, and leading digits get an `_` prefix.
   - If only a header line exists and no data records exist, fields default to `xs:string`.
   - If a header field is blank, the generated field name falls back to `Field{N}`.
   - When `hasHeader` is `false`, fields are auto-named `Field1`, `Field2`, `Field3`, and so on.

### Limitations and known issues

| Limitation | Description |
|---|---|
| Type inference uses a single record. | The first non-empty data record determines column types. |
| Single record type only | The action generates one repeating record structure and doesn't support heterogeneous record layouts. |
| No nested or hierarchical records | The generated schema is flat, meaning you have a root element with one repeating child record and fields. |
| Positional boundaries aren't automatically detected. | You must provide exact field lengths in `fieldPositions`. |
| UTF-8 code page only | Generated schema sets `codepage="65001"` and doesn't expose encoding selection. |
| Escape-character behavior is literal. | Escape handling matches literal value and skips only the next single character. |
| `recordName` default | If unspecified, defaults to `{RootElementName}_Record`. |
| Designer justification input | `fieldPositions[].justification` supports only `Left` and `Right`. |

| Issue | Resolution |
|---|---|
| Wrong field count | Verify that `fieldDelimiterOrder` matches your data format (`Infix`, `Prefix`, `Postfix`). |
| Hex values are output-only | Although generated XSD might show delimiters as hex values (for example, `0x0D0A`) and pass through `0x`-prefixed values in annotations, parsing doesn't decode hex input. For parsing, always provide actual delimiter characters (`\r\n`, `\n`, `\t`, `,`, `;`). |
| Header field names look unexpected | Header values are sanitized to valid XML names. For example, `1st Qty` becomes `_1st_Qty`. |
| Record delimiter behavior | If `recordDelimiter` is omitted, parsing splits on actual newline characters (`\r\n`, `\n`, `\r`). In generated XSD annotations, record delimiter defaults to `0x0D0A`. |

### Troubleshoot problems

| Error | Cause | Resolution |
|---|---|---|
| `The flat file sample data content is required.` | `content` is null or empty. | Ensure the trigger or preceding action provides non-empty flat file content. |
| `The schema generation options are required.` | Internal error: options object is null. | Verify that the workflow definition contains valid inputs. |
| `Failed to generate flat file schema: '{details}'.` | Unexpected runtime error, for example, encoding or malformed data. | Inspect the details or inner error message for root cause. |
| `The field delimiter is required for delimited record structure.` | `recordStructure` is `Delimited` but `fieldDelimiter` is missing or empty. | Provide `fieldDelimiter`, for example comma, semicolon, or tab. Don't provide hex text such as `0x09`; provide actual characters such as `\t`. |
| `The field positions array is required for positional record structure.` | `recordStructure` is `Positional` but `fieldPositions` is missing or empty. | Provide `fieldPositions` with `length` and `justification` for each field. |
| `The flat file sample data contains no data records.` | No non-empty data lines exist (or only header when `hasHeader=true`). | Provide at least one non-empty data record in sample content. |
| `Positional field '{N}' exceeds the record length. Record length: '{len}', position: '{pos}', field length: '{fieldLen}'.` | Total field lengths exceed record length. | Adjust `fieldPositions` lengths, or verify whether `countPositionsByByte` should be changed. |

## Test your workflow

To trigger your workflow, follow these steps:

1. In the **Request** trigger, find the **HTTP POST URL** parameter, and copy the URL.

1. Open your HTTP request tool and use its instructions to send an HTTP request to the copied URL, including the method that the **Request** trigger expects.

   This example uses the `POST` method with the URL.

1. Include the XML content that you want to encode or decode in the request body.

1. After your workflow finishes running, go to the workflow's run history, and examine the **Flat File** action's inputs and outputs.

## Related content

- [Process XML messages and flat files in Azure Logic Apps](logic-apps-enterprise-integration-xml.md)
