---
title: Receive inbound or incoming HTTPS calls
description: Receive and respond to HTTPS requests sent to workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewers: estfan, azla
ms.topic: how-to
ms.date: 07/31/2023
tags: connectors
---

# Receive incoming or inbound HTTPS calls or requests to workflows in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

This how-to guide shows how to run your logic app workflow after receiving an HTTPS call or request from another service by using the Request built-in trigger. When your workflow uses this trigger, you can then respond to the HTTPS request by using the Response built-in action.

> [!NOTE]
>
> The Response action works only when you use the Request trigger.

For example, this list describes some tasks that your workflow can perform when you use the Request trigger and Response action:

* Receive and respond to an HTTPS request for data in an on-premises database.

* Receive and respond to an HTTPS request sent from another logic app workflow.

* Trigger a workflow run when an external webhook event happens.

To run your workflow by sending an outgoing or outbound request instead, use the [HTTP built-in trigger or HTTP built-in action](connectors-native-http.md).

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, you can [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* The logic app workflow where you want to receive the inbound HTTPS request. To start your workflow with a Request trigger, you have to start with a blank workflow. To use the Response action, your workflow must start with the Request trigger.

<a name="add-request-trigger"></a>

## Add a Request trigger

The Request trigger creates a manually callable endpoint that handles *only* inbound requests over HTTPS. When the caller sends a request to this endpoint, the Request trigger fires and runs the workflow. For information about how to call this trigger, review [Call, trigger, or nest workflows with HTTPS endpoints in Azure Logic Apps](../logic-apps/logic-apps-http-endpoint.md).

## [Consumption](#tab/consumption)

1. In the [Azure portal](https://portal.azure.com), open your Consumption logic app and blank workflow in the designer.

1. On the designer, [follow these general steps to find and add the Request built-in trigger named **When a HTTP request is received**](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=consumption#add-trigger).

1. After the trigger information box appears, provide the following information as required:

   | Property name | JSON property name | Required | Description |
   |---------------|--------------------|----------|-------------|
   | **HTTP POST URL** | {none} | Yes | The endpoint URL that's generated after you save your workflow and is used for sending a request that triggers your workflow. |
   | **Request Body JSON Schema** | `schema` | No | The JSON schema that describes the properties and values in the incoming request body. The designer uses this schema to generate tokens for the properties in the request. That way, your workflow can parse, consume, and pass along outputs from the Request trigger into your workflow. <br><br>If you don't have a JSON schema, you can generate the schema from a sample payload by using the **Use sample payload to generate schema** capability. |

   The following example shows a sample JSON schema:

   ![Screenshot showing Consumption workflow and Request trigger with example JSON schema.](./media/connectors-native-reqres/provide-json-schema-consumption.png)

   The following example shows the complete sample JSON schema:

   ```json
   {
      "type": "object",
      "properties": {
         "account": {
            "type": "object",
            "properties": {
               "name": {
                  "type": "string"
               },
               "ID": {
                  "type": "string"
               },
               "address": {
                  "type": "object",
                  "properties": {
                     "number": {
                        "type": "string"
                     },
                     "street": {
                        "type": "string"
                     },
                     "city": {
                        "type": "string"
                     },
                     "state": {
                        "type": "string"
                     },
                     "country": {
                        "type": "string"
                     },
                     "postalCode": {
                        "type": "string"
                     }
                  }
               }
            }
         }
      }
   }
   ```

   When you enter a JSON schema, the designer shows a reminder to include the **Content-Type** header in your request and set that header value to **application/json**. For more information, see [Handle content types](../logic-apps/logic-apps-content-type.md).

   ![Screenshot showing Consumption workflow, Request trigger, and reminder to include "Content-Type" header.](./media/connectors-native-reqres/include-content-type-consumption.png)

   The following example shows how the **Content-Type** header appears in JSON format:

   ```json
   {
      "Content-Type": "application/json"
   }
   ```

   To generate a JSON schema that's based on the expected payload (data), you can use a tool such as [JSONSchema.net](https://jsonschema.net), or you can follow these steps:

   1. In the Request trigger, select **Use sample payload to generate schema**.

      ![Screenshot showing Consumption workflow, Request trigger, and "Use sample payload to generate schema" selected.](./media/connectors-native-reqres/generate-from-sample-payload-consumption.png)

   1. Enter the sample payload, and select **Done**.

      ![Screenshot showing Consumption workflow, Request trigger, and sample payload entered to generate schema.](./media/connectors-native-reqres/enter-payload-consumption.png)

      The following example shows the sample payload:

      ```json
      {
         "account": {
            "name": "Contoso",
            "ID": "12345",
            "address": {
               "number": "1234",
               "street": "Anywhere Street",
               "city": "AnyTown",
               "state": "AnyState",
               "country": "USA",
               "postalCode": "11111"
            }
         }
      }
      ```

1. To check that the inbound call has a request body that matches your specified schema, follow these steps:

   1. To enforce the inbound message to have the same exact fields that your schema describes, in your schema, add the **`required`** property and specify the required fields. Add the **`addtionalProperties`** property, and set the value to **`false`**.

      For example, the following schema specifies that the inbound message must have the **`msg`** field and not any other fields:

      ```json
      {
         "properties": {
           "msg": {
              "type": "string"
           }
         },
         "type": "object",
         "required": ["msg"],
         "additionalProperties": false
      }
      ```

   1. In the Request trigger's title bar, select the ellipses button (**...**).

   1. In the trigger's settings, turn on **Schema Validation**, and select **Done**.

      If the inbound call's request body doesn't match your schema, the trigger returns an **HTTP 400 Bad Request** error.

1. To add other properties or parameters to the trigger, open the **Add new parameter** list, and select the parameters that you want to add.

   | Property name | JSON property name | Required | Description |
   |---------------|--------------------|----------|-------------|
   | **Method** | `method` | No | The method that the incoming request must use to call the logic app |
   | **Relative path** | `relativePath` | No | The relative path for the parameter that the logic app's endpoint URL can accept |

   The following example adds the **Method** property:

   ![Screenshot showing Consumption workflow, Request trigger, and adding the "Method" parameter.](./media/connectors-native-reqres/add-parameters-consumption.png)

   The **Method** property appears in the trigger so that you can select a method from the list.

   ![Screenshot showing Consumption workflow, Request trigger, and the "Method" list opened with a method selected.](./media/connectors-native-reqres/select-method-consumption.png)

1. When you're ready, save your workflow. On the designer toolbar, select **Save**.

   This step generates the URL that you can use to send a request that triggers the workflow.

1. To copy the generated URL, select the copy icon next to the URL.

   ![Screenshot showing Consumption workflow, Request trigger, and URL copy button selected.](./media/connectors-native-reqres/generated-url-consumption.png)

   > [!NOTE]
   >
   > If you want to include the hash or pound symbol (**#**) in the URI
   > when making a call to the Request trigger, use this encoded version instead: `%25%23`

## [Standard](#tab/standard)

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource and blank workflow in the designer.

1. On the designer, [follow these general steps to find and add the Request built-in trigger named **When a HTTP request is received**](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=standard#add-trigger).

1. After the trigger information box appears, provide the following information as required:

   | Property name | JSON property name | Required | Description |
   |---------------|--------------------|----------|-------------|
   | **HTTP POST URL** | {none} | Yes | The endpoint URL that's generated after you save your workflow and is used for sending a request that triggers your workflow. |
   | **Request Body JSON Schema** | `schema` | No | The JSON schema that describes the properties and values in the incoming request body. The designer uses this schema to generate tokens for the properties in the request. That way, your workflow can parse, consume, and pass along outputs from the Request trigger into your workflow. <br><br>If you don't have a JSON schema, you can generate the schema from a sample payload by using the **Use sample payload to generate schema** capability. |

   The following example shows a sample JSON schema:

   ![Screenshot showing Standard workflow and Request trigger with example JSON schema.](./media/connectors-native-reqres/provide-json-schema-standard.png)

   The following example shows the complete sample JSON schema:

   ```json
   {
      "type": "object",
      "properties": {
         "account": {
            "type": "object",
            "properties": {
               "name": {
                  "type": "string"
               },
               "ID": {
                  "type": "string"
               },
               "address": {
                  "type": "object",
                  "properties": {
                     "number": {
                        "type": "string"
                     },
                     "street": {
                        "type": "string"
                     },
                     "city": {
                        "type": "string"
                     },
                     "state": {
                        "type": "string"
                     },
                     "country": {
                        "type": "string"
                     },
                     "postalCode": {
                        "type": "string"
                     }
                  }
               }
            }
         }
      }
   }
   ```

   When you enter a JSON schema, the designer shows a reminder to include the **Content-Type** header in your request and set that header value to **application/json**. For more information, see [Handle content types](../logic-apps/logic-apps-content-type.md).

   ![Screenshot showing Standard workflow, Request trigger, and reminder to include "Content-Type" header.](./media/connectors-native-reqres/include-content-type-standard.png)

   The following example shows how the **Content-Type** header appears in JSON format:

   ```json
   {
      "Content-Type": "application/json"
   }
   ```

   To generate a JSON schema that's based on the expected payload (data), you can use a tool such as [JSONSchema.net](https://jsonschema.net), or you can follow these steps:

   1. In the Request trigger, select **Use sample payload to generate schema**.

      ![Screenshot showing Standard workflow, Request trigger, and "Use sample payload to generate schema" selected.](./media/connectors-native-reqres/generate-from-sample-payload-standard.png)

   1. Enter the sample payload, and select **Done**.

      ![Screenshot showing Standard workflow, Request trigger, and sample payload entered to generate schema.](./media/connectors-native-reqres/enter-payload-standard.png)

      The following example shows the sample payload:

      ```json
      {
         "account": {
            "name": "Contoso",
            "ID": "12345",
            "address": {
               "number": "1234",
               "street": "Anywhere Street",
               "city": "AnyTown",
               "state": "AnyState",
               "country": "USA",
               "postalCode": "11111"
            }
         }
      }
      ```

1. To check that the inbound call has a request body that matches your specified schema, follow these steps:

   1. To enforce the inbound message to have the same exact fields that your schema describes, in your schema, add the **`required`** property and specify the required fields. Add the **`addtionalProperties`** property, and set the value to **`false`**.

      For example, the following schema specifies that the inbound message must have the **`msg`** field and not any other fields:

      ```json
      {
         "properties": {
           "msg": {
              "type": "string"
           }
         },
         "type": "object",
         "required": ["msg"],
         "additionalProperties": false
      }
      ```

   1. On the designer, select the Request trigger. On the information pane that opens, select the **Settings** tab.

   1. Expand **Data Handling**, and set **Schema Validation** to **On**.

      If the inbound call's request body doesn't match your schema, the trigger returns an **HTTP 400 Bad Request** error.

1. To add other properties or parameters to the trigger, select the **Parameters** tab, open the **Add new parameter** list, and select the parameters that you want to add.

   | Property name | JSON property name | Required | Description |
   |---------------|--------------------|----------|-------------|
   | **Method** | `method` | No | The method that the incoming request must use to call the logic app |
   | **Relative path** | `relativePath` | No | The relative path for the parameter that the logic app's endpoint URL can accept |

   The following example adds the **Method** property:

   ![Screenshot showing Standard workflow, Request trigger, and adding the "Method" parameter.](./media/connectors-native-reqres/add-parameters-standard.png)

   The **Method** property appears in the trigger so that you can select a method from the list.

   ![Screenshot showing Standard workflow, Request trigger, and the "Method" list opened with a method selected.](./media/connectors-native-reqres/select-method-standard.png)

1. When you're ready, save your workflow. On the designer toolbar, select **Save**.

   This step generates the URL that you can use to send a request that triggers the workflow.

1. To copy the generated URL, select the copy icon next to the URL.

   ![Screenshot showing Standard workflow, Request trigger, and URL copy button selected.](./media/connectors-native-reqres/generated-url-standard.png)

   > [!NOTE]
   >
   > If you want to include the hash or pound symbol (**#**) in the URI
   > when making a call to the Request trigger, use this encoded version instead: `%25%23`
   >
   > The URL for the Request trigger is associated with your workflow's storage account. This URL 
   > changes if the storage account changes. For example, with Standard logic apps, if you manually 
   > change your storage account and copy your workflow to the new storage account, the URL for 
   > the Request trigger also changes to reflect the new storage account. The same workflow has a different URL.

---

Now, continue building your workflow by adding another action as the next step. For example, you can respond to the request by [adding a Response action](#add-response), which you can use to return a customized response and is described later in this article.

> [!NOTE]
>
> Your workflow keeps an inbound request open only for a [limited time](../logic-apps/logic-apps-limits-and-config.md#http-limits). 
> Assuming that your workflow also includes a Response action, if your workflow doesn't return a response to the caller 
> after this time expires, your workflow returns the **504 GATEWAY TIMEOUT** status to the caller. If your workflow 
> doesn't include a Response action, your workflow immediately returns the **202 ACCEPTED** status to the caller.

For information about security, authorization, and encryption for inbound calls to your workflow, such as [Transport Layer Security (TLS)](https://en.wikipedia.org/wiki/Transport_Layer_Security), previously known as Secure Sockets Layer (SSL), [Azure Active Directory Open Authentication (Azure AD OAuth)](../active-directory/develop/index.yml), exposing your logic app resource with Azure API Management, or restricting the IP addresses that originate inbound calls, see [Secure access and data - Access for inbound calls to request-based triggers](../logic-apps/logic-apps-securing-a-logic-app.md#secure-inbound-requests).

## Trigger outputs

The following table lists the outputs from the Request trigger:

| JSON property name | Data type | Description |
|--------------------|-----------|-------------|
| **headers** | Object | A JSON object that describes the headers from the request |
| **body** | Object | A JSON object that describes the body content from the request |

<a name="add-response"></a>

## Add a Response action

When you use the Request trigger to receive inbound requests, you can model the response and send the payload results back to the caller by using the Response built-in action, which works *only* with the Request trigger. This combination with the Request trigger and Response action creates the [request-response pattern](https://en.wikipedia.org/wiki/Request%E2%80%93response). Except for inside Foreach loops and Until loops, and parallel branches, you can add the Response action anywhere in your workflow.

> [!IMPORTANT]
>
> * If your Response action includes the following headers, Azure Logic Apps automatically 
> removes these headers from the generated response message without showing any warning 
> or error. Azure Logic Apps won't include these headers, although the service won't 
> stop you from saving workflows that have a Response action with these headers.
>
>   * `Allow`
>   * `Content-*` headers except for `Content-Disposition`, `Content-Encoding`, and `Content-Type` when you use POST and PUT operations, but are not included for GET operations
>   * `Cookie`
>   * `Expires`
>   * `Last-Modified`
>   * `Set-Cookie`
>   * `Transfer-Encoding`
>
> * If you have one or more Response actions in a complex workflow with branches, make sure that the workflow 
> processes at least one Response action during runtime. Otherwise, if all Response actions are skipped, 
> the caller receives a **502 Bad Gateway** error, even if the workflow finishes successfully.
>
> * In a Standard logic app *stateless* workflow, the Response action must appear last in your workflow. If the action appears 
> anywhere else, Azure Logic Apps still won't run the action until all other actions finish running.

## [Consumption](#tab/consumption)

1. On the workflow designer, [follow these general steps to find and add the Response built-in action named **Response**](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=consumption#add-action).

   For simplicity, the following examples show a collapsed Request trigger.

1. In the action information box, add the required values for the response message.

   | Property name | JSON property name | Required | Description |
   |---------------|--------------------|----------|-------------|
   | **Status Code** | `statusCode` | Yes | The status code to return in the response |
   | **Headers** | `headers` | No | A JSON object that describes one or more headers to include in the response |
   | **Body** | `body` | No | The response body |

   When you select inside any text fields, the dynamic content list automatically opens. You can then select tokens that represent any available outputs from previous steps in the workflow. The properties from the schema that you specify also appear in this dynamic content list. You can select these properties to use in your workflow.

   For example, in the **Headers** field, include **Content-Type** as the key name, and set the key value to **application/json** as mentioned earlier in this article. For the **Body** box, you can select the trigger body output from the dynamic content list.

   ![Screenshot showing Azure portal, Consumption workflow, and Response action information.](./media/connectors-native-reqres/response-details-consumption.png)

   To view the headers in JSON format, select **Switch to text view**.

   ![Screenshot showing Azure portal, Consumption workflow, and Response action headers in "Switch to text" view.](./media/connectors-native-reqres/switch-to-text-view-consumption.png)

1. To add more properties for the action, such as a JSON schema for the response body, from the **Add new parameter** list, select the parameters that you want to add.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

## [Standard](#tab/standard)

1. On the workflow designer, [follow these general steps to find and add the Response built-in action named **Response**](../logic-apps/create-workflow-with-trigger-or-action.md?tabs=standard#add-action).

1. In the action information box, add the required values for the response message:

   | Property name | JSON property name | Required | Description |
   |---------------|--------------------|----------|-------------|
   | **Status Code** | `statusCode` | Yes | The status code to return in the response |
   | **Headers** | `headers` | No | A JSON object that describes one or more headers to include in the response |
   | **Body** | `body` | No | The response body |

   When you select inside any text fields, you get the option to open the dynamic content list (lightning icon). You can then select tokens that represent any available outputs from previous steps in the workflow. The properties from the schema that you specify also appear in this dynamic content list. You can select these properties to use in your workflow.

   For example, for the **Headers** box, enter **Content-Type** as the key name, and set the key value to **application/json** as mentioned earlier in this article. For the **Body** box, you can select the trigger body output from the dynamic content list.

   ![Screenshot showing Azure portal, Standard workflow, and Response action information.](./media/connectors-native-reqres/response-details-standard.png)

   To view the headers in JSON format, select **Switch to text view**.

   ![Screenshot showing Azure portal, Standard workflow, and Response action headers in "Switch to text" view.](./media/connectors-native-reqres/switch-to-text-view-standard.png)

1. To add more properties for the action, such as a JSON schema for the response body, open the **Add new parameter** list, and select the parameters that you want to add.

1. When you're done, save your workflow. On the designer toolbar, select **Save**.

---

## Test your workflow

To test your workflow, send an HTTP request to the generated URL. For example, you can use a tool such as [Postman](https://www.getpostman.com/) to send the HTTP request. For more information about the trigger's underlying JSON definition and how to call this trigger, see these topics, [Request trigger type](../logic-apps/logic-apps-workflow-actions-triggers.md#request-trigger) and [Call, trigger, or nest workflows with HTTP endpoints in Azure Logic Apps](../logic-apps/logic-apps-http-endpoint.md).

## Security and authentication

In a Standard logic app workflow that starts with the Request trigger (but not a webhook trigger), you can use the Azure Functions provision for authenticating inbound calls sent to the endpoint created by that trigger by using a managed identity. This provision is also known as "**Easy Auth**". For more information, review [Trigger workflows in Standard logic apps with Easy Auth](https://techcommunity.microsoft.com/t5/integrations-on-azure-blog/trigger-workflows-in-standard-logic-apps-with-easy-auth/ba-p/3207378).

For more information about security, authorization, and encryption for inbound calls to your logic app workflow, such as [Transport Layer Security (TLS)](https://en.wikipedia.org/wiki/Transport_Layer_Security), previously known as Secure Sockets Layer (SSL), [Azure Active Directory Open Authentication (Azure AD OAuth)](../active-directory/develop/index.yml), exposing your logic app with Azure API Management, or restricting the IP addresses that originate inbound calls, see [Secure access and data - Access for inbound calls to request-based triggers](../logic-apps/logic-apps-securing-a-logic-app.md#secure-inbound-requests).

## Next steps

* [Secure access and data - Access for inbound calls to request-based triggers](../logic-apps/logic-apps-securing-a-logic-app.md#secure-inbound-requests)
* [Managed or Azure-hosted connectors in Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
