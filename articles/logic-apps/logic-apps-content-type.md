---
title: Handle Content Types in Workflows
description: Learn to work with various content types in workflows during development and at run time in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewers: estfan, azla
ms.topic: how-to
ms.date: 10/15/2025
#Customer intent: As an integration developer who works with Azure Logic Apps, I want to understand how to handle the available content types in workflows.
---

# Handle content types in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

Azure Logic Apps supports all content types like JSON, XML, flat files, and binary data. While some content types have native support, meaning they don't need casting or conversion, other content types need some work to give you the required format.

To help determine the best way to handle content or data in workflows, Azure Logic Apps uses the `Content-Type` header value in the HTTP requests that workflows get from external callers.

The following list includes some example `Content-Type` values that a workflow can encounter:

- [application/json (native type)](#application-json)
- [text/plain (native type)](#text-plain)
- [application/xml and application/octet-stream](#application-xml-octet-stream)
- [Other content types](#other-content-types)

This guide describes how Azure Logic Apps handles different content types and shows how to correctly cast or convert these types when necessary. 

<a name="application-json"></a>

## application/json

For an HTTP request where the `Content-Type` header value is *application/json*, Azure Logic Apps stores and handles the content as a JavaScript Object Notation (JSON) object. By default, you can parse JSON content without any casting or conversion. You can also parse this content by using an *expression*.

For example, the following expression uses the `body()` function with `My_action`, which is the JSON name for a predecessor action in the workflow:

`body('My_action')['client']['animal-type'][0]`

The following steps describe how the expression works without casting or conversion:

1. The `body()` function gets the `body` output object from the `My_action` action.

1. From the returned `body` object, the function accesses the `client` object.

   The `client` object contains the `animal-type` property, which is set to an array.

1.	The function accesses the first item in the array and directly returns the value dog without casting or conversion.

If you work with JSON data that doesn't use a `Content-Type` header, you can manually convert that data to JSON by using the [json() function](workflow-definition-language-functions-reference.md#json), for example:
  
`json(triggerBody())['client']['animal-type']`

1. The `triggerBody()` function gets the `body` object from the workflow's trigger output. This object is typically a JSON object.

   The source for the `body` object originates from the inbound HTTP request or event received by the workflow trigger.

1. The `json()` function explicitly parses the `body` object returned from the `triggerBody()` function as a JSON object.

   This behavior is useful, for example, when the trigger body is a string that requires handling as JSON.

The remaining expression behavior is similar to the previous example.

### Create tokens for JSON properties

In Azure Logic Apps, you can generate user-friendly tokens that represent the properties in JSON content. You can then use these tokens so you can more easily reference these properties and their values in your workflow.

The following list describes common workflow operations and the corresponding ways that you can generate tokens for properties in JSON content:

- **Request** trigger named **When a HTTP request is received**

  When you work in the designer with the **Request** trigger, you can optionally provide a JSON schema that defines the JSON objects, properties, and the expected data types for each property value. If you don't have a JSON schema, you can provide an example payload to generate a JSON schema that you can use.

  The trigger uses the schema to parse JSON content from incoming HTTP requests and generate tokens that represent the properties in the JSON content. You can then easily reference and use these properties and their values in subsequent actions in your workflow.

  The following steps describe how you can provide an example payload to generate a JSON schema:
  
  1. On the designer, select the **Request** trigger to open the information pane.

  1. On the **Parameters** tab, under the **Request Body JSON Schema** box, select **Use sample payload to generate schema**.  
  
  1. In the **Enter or paste a sample JSON payload** box, enter a sample payload, then select **Done**.

     :::image type="content" source="./media/logic-apps-content-type/request-trigger.png" alt-text="Screenshot shows the Request trigger named When a HTTP request is received plus a sample JSON payload." lightbox="./media/logic-apps-content-type/request-trigger.png":::

     The generated schema now appears in your trigger.

     :::image type="content" source="./media/logic-apps-content-type/generated-schema.png" alt-text="Screenshot shows the JSON schema generated from the sample JSON payload.":::

     In the code view editor, you can review the underlying JSON definition for the **Request** trigger:

     ```json
     "triggers": { 
        "When_an_HTTP_request_is_received": {
           "type": "Request",
           "kind": "Http",
           "inputs": { 
              "schema": {
                 "type": "object",
                 "properties": {
                    "client": {
                       "type": "object",
                       "properties": {
                          "animal-type": {
                             "type": "array",
                             "items": {
                                "type": "string"
                             },
                          },
                          "name": {
                             "type": "string"
                          }
                       }
                    }
                 }
              }
           }
        }
     }
     ```

  1. To trigger your workflow, get the **Workflow URL** or the trigger's **HTTP URL**, which is generated after you save the workflow for the first time.

  1. To test the workflow, use a client tool or app from where you can send an HTTP request to the workflow URL or trigger URL. Make sure that the request includes a header named **Content-Type** and the header value is set to **application/json**.

- **Parse JSON action**

  When you use this action in the designer, you can parse JSON output and generate user-friendly tokens that represent the properties in your JSON content. You can then easily reference and use those properties throughout your logic app's workflow.

  Similar to the Request trigger, you can provide or generate a JSON schema that describes the JSON content you want to parse. That way, you can more easily consume data from Azure Service Bus, Azure Cosmos DB, and so on.

  :::image type="content" source="./media/logic-apps-content-type/parse-json.png" alt-text="Screenshot shows a Parse JSON action with schema generated from a sample." lightbox="./media/logic-apps-content-type/parse-json.png":::

<a name="text-plain"></a>

## text/plain

If your workflow receives HTTP requests where the `Content-Type` header value is *text/plain*. Azure Logic Apps stores and handles the content in raw form. If you reference or use this content in subsequent workflow actions without casting or conversion, outbound requests also have the `Content-Type` header value set to `text/plain`. 

For example, suppose you're working with a flat file, and the inbound HTTP request has the `Content-Type` header value set to `text/plain`:

`Date,Name,Address`</br>
`Oct-1,Frank,123 Ave`

If you send this request to a subsequent action that uses the request body to send another request, the second request also has the `Content-Type` header value set to `text/plain`. If you work with data in plain text but didn't specify a header, you can manually cast this data to text by using the [`string()` function](workflow-definition-language-functions-reference.md#string), for example:

`string(triggerBody())`

<a name="application-xml-octet-stream"></a>

## application/xml and application/octet-stream

Azure Logic Apps always preserves the `Content-Type` header value in an inbound HTTP request or response. If your workflow receives content with `Content-Type` set to *application/octet-stream*, and you include that content in a subsequent action without casting, the outbound request also sets `Content-Type` to `application/octet-stream`. This approach makes sure that data doesn't get lost while moving through the workflow. In stateful workflows, the subsequent action's state, inputs, and outputs are stored in a JSON object while the state moves through the workflow.

## Converter functions

To preserve some data types, Azure Logic Apps converts content to a binary base64-encoded string. This string has the appropriate metadata that preserves both the `$content` payload and the `$content-type`, which are automatically converted. 

The following list describes how Azure Logic Apps converts content when you use specific [functions](workflow-definition-language-functions-reference.md):

- `json()`: Casts data to `application/json`.
- `xml()`: Casts data to `application/xml`.
- `binary()`: Casts data to `application/octet-stream`.
- `string()`: Casts data to `text/plain`.
- `base64()`: Converts content to a base64-encoded string.
- `base64toString()`: Converts a base64-encoded string to `text/plain`.
- `base64toBinary()`: Converts a base64-encoded string to `application/octet-stream`.
- `dataUri()`: Converts a string to a data URI.
- `dataUriToBinary()`: Converts a data URI to a binary string.
- `dataUriToString()`: Converts a data URI to a string.

For example, suppose your workflow trigger receives an HTTP request where `Content-Type` set to `application/xml` where the content looks like the following sample:

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<CustomerName>Frank</CustomerName>
```

You can cast this content by using the following expression, which uses the `xml()` and `triggerBody()` functions:

`xml(triggerBody())`

You can then use the resulting content with subsequent actions in the workflow. Or, you might use the following expression that uses the `xpath()` and `xml()` functions instead:

`xpath(xml(triggerBody()), '/CustomerName')`


## Other content types

Azure Logic Apps supports other content types but might require that you manually get the message body from an HTTP request by decoding the `$content` variable.

For example, suppose your workflow receives an HTTP request where `Content-Type` is set to `application/x-www-url-formencoded`. To preserve all the data, the request body includes the `$content` variable where the payload is encoded as a base64 string:

`CustomerName=Frank&Address=123+Avenue`

This content type isn't in plain text or JSON format, so Azure Logic Apps stores `CustomerName=Frank&Address=123+Avenue` using the following `$content-type` and `$content` variables:

```json
"body": {
   "$content-type": "application/x-www-url-formencoded",
   "$content": "AAB1241BACDFA=="
}
```

Azure Logic Apps also includes native functions to handle form data, for example:

- [triggerFormDataValue()](workflow-definition-language-functions-reference.md#triggerFormDataValue)
- [triggerFormDataMultiValues()](workflow-definition-language-functions-reference.md#triggerFormDataMultiValues)
- [formDataValue()](workflow-definition-language-functions-reference.md#formDataValue) 
- [formDataMultiValues()](workflow-definition-language-functions-reference.md#formDataMultiValues)

Or, you can manually access the data by using an expression such as the following example:

`string(body('formdataAction'))` 

To make an outbound request use `application/x-www-url-formencoded` as the `Content-Type` header value, add the request content to the action body without any casting by using an expression such as `body('formdataAction')`. This method works only if the action body is the only parameter in the `body` inputs object. If you use the `body('formdataAction')` expression in a request where the content type is `application/json`, you get a runtime error because the body is sent encoded.
