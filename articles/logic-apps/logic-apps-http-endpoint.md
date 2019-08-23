---
title: Call, trigger, or nest workflows with HTTP endpoints - Azure Logic Apps
description: Set up HTTP endpoints to call, trigger, or nest workflows for Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.workload: integration
author: ecfan
ms.author: klam
ms.reviewer: jehollan, klam, LADocs
manager: carmonm
ms.assetid: 73ba2a70-03e9-4982-bfc8-ebfaad798bc2
ms.topic: article
ms.custom: H1Hack27Feb2017
ms.date: 03/31/2017
---

# Call, trigger, or nest workflows with HTTP endpoints in Azure Logic Apps

You can natively expose synchronous HTTP endpoints as triggers on logic apps so that you can trigger or call your logic apps through a URL. You can also nest workflows in your logic apps by using a pattern of callable endpoints.

To create HTTP endpoints, you can add these triggers so that your logic apps can receive incoming requests:

* [Request](../connectors/connectors-native-reqres.md)

* [API Connection Webhook](../logic-apps/logic-apps-workflow-actions-triggers.md#apiconnection-trigger)

* [HTTP Webhook](../connectors/connectors-native-webhook.md)

   > [!NOTE]
   > Although these examples use the **Request** trigger, 
   > you can use any of the listed HTTP triggers, 
   > and all principles identically apply to the other trigger types.

## Set up an HTTP endpoint for your logic app

To create an HTTP endpoint, add a trigger that can receive incoming requests.

1. Sign in to the [Azure portal](https://portal.azure.com "Azure portal"). 
Go to your logic app, and open Logic App Designer.

2. Add a trigger that lets your logic app receive incoming requests. 
For example, add the **Request** trigger to your logic app.

3.  Under **Request Body JSON Schema**, 
you can optionally enter a JSON schema for the payload (data) 
that you expect the trigger to receive.

    The designer uses this schema for generating tokens 
    that your logic app can use to consume, parse, 
    and pass data from the trigger through your workflow. 
    More about [tokens generated from JSON schemas](#generated-tokens).

    For this example, enter the schema shown in the designer:

    ```json
    {
      "type": "object",
      "properties": {
        "address": {
          "type": "string"
        }
      },
      "required": [
        "address"
      ]
    }
    ```

    ![Add the Request action][1]

    > [!TIP]
    > 
    > You can generate a schema for a sample JSON payload 
    > from a tool like [jsonschema.net](https://jsonschema.net/), 
    > or in the **Request** trigger by choosing **Use sample payload to generate schema**. 
    > Enter your sample payload, and choose **Done**.

    For example, this sample payload:

    ```json
    {
       "address": "21 2nd Street, New York, New York"
    }
    ```

    generates this schema:

    ```json
    {
       "type": "object",
       "properties": {
          "address": {
             "type": "string" 
          }
       }
    }
    ```

4.  Save your logic app. Under **HTTP POST to this URL**, 
you should now find a generated callback URL, like this example:

    ![Generated callback URL for endpoint](./media/logic-apps-http-endpoint/generated-endpoint-url.png)

    This URL contains a Shared Access Signature (SAS) key 
    in the query parameters that are used for authentication. 
    You can also get the HTTP endpoint URL from your logic app overview 
    in the Azure portal. Under **Trigger History**, 
    select your trigger:

    ![Get HTTP endpoint URL from Azure portal][2]

    Or you can get the URL by making this call:

    ```
    POST https://management.azure.com/{logic-app-resourceID}/triggers/{myendpointtrigger}/listCallbackURL?api-version=2016-06-01
    ```

## Change the HTTP method for your trigger

By default, the **Request** trigger expects an HTTP POST request, 
but you can use a different HTTP method. 

> [!NOTE]
> You can specify only one method type.

1. On your **Request** trigger, choose **Show advanced options**.

2. Open the **Method** list. For this example, select **GET** 
so that you can test your HTTP endpoint's URL later.

    > [!NOTE]
    > You can select any other HTTP method, or specify a custom method 
    > for your own logic app.

    ![Change HTTP method](./media/logic-apps-http-endpoint/change-method.png)

## Accept parameters through your HTTP endpoint URL

When you want your HTTP endpoint URL to accept parameters, 
customize your trigger's relative path.

1. On your **Request** trigger, choose **Show advanced options**. 

2. Under **Method**, specify the HTTP method that you want your request to use. 
For this example, select the **GET** method, if you haven't already, 
so that you can test your HTTP endpoint's URL.

      > [!NOTE]
      > When you specify a relative path for your trigger, 
      > you must also explicitly specify an HTTP method for your trigger.

3. Under **Relative path**, specify the relative path for the parameter 
that your URL should accept, for example, `customers/{customerID}`.

    ![Specify the HTTP method and relative path for parameter](./media/logic-apps-http-endpoint/relativeurl.png)

4. To use the parameter, add a **Response** action to your logic app. 
(Under your trigger, choose **New step** > **Add an action** > **Response**) 

5. In your response's **Body**, include the token for the parameter 
that you specified in your trigger's relative path.

    For example, to return `Hello {customerID}`, 
    update your response's **Body** with `Hello {customerID token}`. 
    The dynamic content list should appear and show the `customerID` 
    token for you to select.

    ![Add parameter to response body](./media/logic-apps-http-endpoint/relativeurlresponse.png)

    Your **Body** should look like this example:

    ![Response body with parameter](./media/logic-apps-http-endpoint/relative-url-with-parameter.png)

6. Save your logic app. 

    Your HTTP endpoint URL now includes the relative path, for example: 

    https&#58;//prod-00.southcentralus.logic.azure.com/workflows/f90cb66c52ea4e9cabe0abf4e197deff/triggers/manual/paths/invoke/customers/{customerID}...

7. To test your HTTP endpoint, 
copy and paste the updated URL into another browser window, 
but replace `{customerID}` with `123456`, and press Enter.

    Your browser should show this text: 

    `Hello 123456`

<a name="generated-tokens"></a>

### Tokens generated from JSON schemas for your logic app

When you provide a JSON schema in your **Request** trigger, 
the Logic App Designer generates tokens for properties in that schema. 
You can then use those tokens for passing data through your logic app workflow.

For this example, if you add the `title` and `name` 
properties to your JSON schema, their tokens are 
now available to use in later workflow steps. 

Here is the complete JSON schema:

```json
{
   "type": "object",
   "properties": {
      "address": {
         "type": "string"
      },
      "title": {
         "type": "string"
      },
      "name": {
         "type": "string"
      }
   },
   "required": [
      "address",
      "title",
      "name"
   ]
}
```

## Create nested workflows for logic apps

You can nest workflows in your logic app by adding 
other logic apps that can receive requests. 
To include these logic apps, add the 
**Azure Logic Apps - Choose a Logic Apps workflow** action 
to your trigger. You can then select from eligible logic apps.

![Add another logic app](./media/logic-apps-http-endpoint/choose-logic-apps-workflow.png)

## Call or trigger logic apps through HTTP endpoints

After you create your HTTP endpoint, 
you can trigger your logic app through a `POST` method to the full URL. 
Logic apps have built-in support for direct-access endpoints.

> [!NOTE] 
> To manually run a logic app at any time, 
> on the Logic App Designer or Logic App Code View toolbar, choose **Run**.

## Reference content from an incoming request

If the content's type is `application/json`, 
you can reference properties from the incoming request. 
Otherwise, content is treated as a single binary unit that you can pass to other APIs. 
To reference this content inside the workflow, you must convert that content. 
For example, if you pass `application/xml` content, you can use `@xpath()` 
for an XPath extraction, or `@json()` for converting XML to JSON. 
Learn about [working with content types](../logic-apps/logic-apps-content-type.md).

To get the output from an incoming request, 
you can use the `@triggerOutputs()` function. 
The output might look like this example:

```json
{
    "headers": {
        "content-type" : "application/json"
    },
    "body": {
        "myProperty" : "property value"
    }
}
```

To access the `body` property specifically, 
you can use the `@triggerBody()` shortcut. 

## Respond to requests

You might want to respond to certain requests that start a logic app 
by returning content to the caller. To construct the status code, 
header, and body for your response, you can use the **Response** action. 
This action can appear anywhere in your logic app, not just at the end 
of your workflow.

> [!NOTE] 
> If your logic app doesn't include a **Response**, 
> the HTTP endpoint responds *immediately* with a **202 Accepted** status. 
> Also, for the original request to get the response, 
> all steps required for the response must finish 
> within the [request timeout limit](./logic-apps-limits-and-config.md) 
> unless you call the workflow as a nested logic app. 
> If no response happens within this limit, 
> the incoming request times out and receives the HTTP response **408 Client timeout**. 
> For nested logic apps, the parent logic app continues to wait for a 
> response until completed, regardless of how much time is required.

### Construct the response

You can include more than one header and any type of content in the response body. 
In the example response, the header specifies 
that the response has content type `application/json`. 
and the body contains `title` and `name`, based on 
the JSON schema updated previously for the **Request** trigger.

![HTTP Response action][3]

Responses have these properties:

| Property | Description |
| --- | --- |
| statusCode |Specifies the HTTP status code for responding to the incoming request. This code can be any valid status code that starts with 2xx, 4xx, or 5xx. However, 3xx status codes are not permitted. |
| headers |Defines any number of headers to include in the response. |
| body |Specifies a body object that can be a string, a JSON object, or even binary content referenced from a previous step. |

Here's what the JSON schema looks like now for the **Response** action:

``` json
"Response": {
   "inputs": {
      "body": {
         "title": "@{triggerBody()?['title']}",
         "name": "@{triggerBody()?['name']}"
      },
      "headers": {
		   "content-type": "application/json"
      },
      "statusCode": 200
   },
   "runAfter": {},
   "type": "Response"
}
```

> [!TIP]
> To view the complete JSON definition for your logic app, 
> on the Logic App Designer, choose **Code view**.

## Q & A

#### Q: What about URL security?

A: Azure securely generates logic app callback URLs using a Shared Access Signature (SAS). 
This signature passes through as a query parameter 
and must be validated before your logic app can fire. 
Azure generates the signature using a unique 
combination of a secret key per logic app, 
the trigger name, and the operation that's performed. 
So unless someone has access to the secret logic app key, 
they cannot generate a valid signature.

   > [!IMPORTANT]
   > For production and secure systems, we strongly recommend against 
   > calling your logic app directly from the browser because:
   > 
   > * The shared access key appears in the URL.
   > * You can't manage secure content policies 
   > due to shared domains across Logic App customers.

#### Q: Can I configure HTTP endpoints further?

A: Yes, HTTP endpoints support more advanced configuration 
through [**API Management**](../api-management/api-management-key-concepts.md). 
This service also offers the capability for you to consistently manage all your APIs, 
including logic apps, set up custom domain names, 
use more authentication methods, and more, for example:

* [Change the request method](https://docs.microsoft.com/azure/api-management/api-management-advanced-policies#SetRequestMethod)
* [Change the URL segments of the request](https://docs.microsoft.com/azure/api-management/api-management-transformation-policies#RewriteURL)
* Set up your API Management domains in the [Azure portal](https://portal.azure.com/ "Azure portal")
* Set up policy to check for Basic authentication

#### Q: What changed when the schema migrated from the December 1, 2014 preview?

A: Here's a summary about these changes:

| December 1, 2014 preview | June 1, 2016 |
| --- | --- |
| Click **HTTP Listener** API App |Click **Manual trigger** (no API App required) |
| HTTP Listener setting "*Sends response automatically*" |Either include a **Response** action or not in the workflow definition |
| Configure Basic or OAuth authentication |via API Management |
| Configure HTTP method |Under **Show advanced options**, choose an HTTP method |
| Configure relative path |Under **Show advanced options**, add a relative path |
| Reference the incoming body through `@triggerOutputs().body.Content` |Reference through `@triggerOutputs().body` |
| **Send HTTP response** action on the HTTP Listener |Click **Respond to HTTP request** (no API App required) |

## Get help

To ask questions, answer questions, and learn what other Azure Logic Apps users are doing, 
visit the [Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).

To help improve Azure Logic Apps and connectors, vote on or submit ideas at the 
[Azure Logic Apps user feedback site](https://aka.ms/logicapps-wish).

## Next steps

* [Author logic app definitions](./logic-apps-author-definitions.md)
* [Handle errors and exceptions](./logic-apps-exception-handling.md)

[1]: ./media/logic-apps-http-endpoint/manualtrigger.png
[2]: ./media/logic-apps-http-endpoint/manualtriggerurl.png
[3]: ./media/logic-apps-http-endpoint/response.png