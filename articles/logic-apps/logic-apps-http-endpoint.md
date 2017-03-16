---
title: Call, trigger, or nest workflows with HTTP endpoints - Azure Logic Apps | Microsoft Docs
description: Add HTTP endpoints to call, trigger, or nest logic app workflows in Azure
services: logic-apps
documentationcenter: .net,nodejs,java
author: jeffhollan
manager: anneta
editor: ''

ms.assetid: 73ba2a70-03e9-4982-bfc8-ebfaad798bc2
ms.service: logic-apps
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: integration
ms.custom: H1Hack27Feb2017
ms.date: 10/18/2016
ms.author: jehollan
---

# Call, trigger, or nest workflows for logic apps by adding HTTP endpoints

Logic apps can natively expose synchronous HTTP endpoints as triggers 
so that you can trigger or manually call your logic apps. 
You can also nest workflows in your logic apps by using a pattern of callable endpoints 
and adding the **Choose a Logic Apps workflow** actions to your logic apps.

To receive requests, you can add these triggers to your logic apps:

* [Request](../connectors/connectors-native-reqres.md)
* [API Connection webhook](logic-apps-workflow-actions-triggers.md#api-connection)
* [HTTP Webhook](../connectors/connectors-native-http.md)

We'll use the **Request** trigger in our examples, 
but all principles identically apply to the other trigger types.

## Add a trigger to your logic app definition

1. Sign in to the [Azure portal](https://portal.azure.com "Azure portal").

2. Go to your logic app, and open the Logic App Designer.
Add a trigger that can receive incoming requests for your logic app definition. 
For example, add the **Request** trigger to your logic app.

3.	Under **Request Body JSON Schema**, 
enter the JSON schema for the payload that you expect to receive. 

	> [!TIP]
	> If you don't have a schema ready, you can generate the schema 
	> for your JSON from a tool like [jsonschema.net](http://jsonschema.net/), 
	> or from a sample JSON payload. On your **Request** trigger, 
	> choose **Use sample payload to generate schema**, enter your JSON payload, 
	> and choose **Done**.

	The designer uses this schema for generating tokens 
	that help you consume, parse, and pass data 
	from the manual trigger through your workflow.

	![Add the Request action][1]

2.	Save your logic app definition. Under **HTTP POST to this URL**, 
you'll get a generated callback URL, like in this example:

	``` text
	https://prod-00.southcentralus.logic.azure.com:443/workflows/f90cb66c52ea4e9cabe0abf4e197deff/triggers/myendpointtrigger?*signature*...
	```

	This URL contains a Shared Access Signature (SAS) key 
	in the query parameters that are used for authentication. 
	You can also get this endpoint from your logic app overview 
	in the Azure portal:

	![URL endpoint][2]

	Or by calling:

	``` text
	POST https://management.azure.com/{resourceID of your logic app}/triggers/myendpointtrigger/listCallbackURL?api-version=2015-08-01-preview
	```

### Change the HTTP method for your trigger

By default, the Request trigger expects an HTTP POST request. 
To configure a different HTTP method, choose **Show advanced options**.

> [!NOTE]
> Only one type of method is allowed.

### Customize the relative trigger URL

You can also customize the relative path for the request URL to accept parameters.

1. On the **Request** trigger, choose **Show advanced options**. 
Under **Relative path**, enter `customer/{customerId}`.

	![Relative URL trigger](./media/logic-apps-http-endpoint/relativeurl.png)

2.	To use the parameter, update the **Response** action.

	*	You should see `customerId` appear in the token picker.
	*	To return `Hello {customerId}`, update the body of the **Response** action.

	![Relative URL Response](./media/logic-apps-http-endpoint/relativeurlresponse.png)

3. Save your logic app. The request URL is updated with the relative path.

4. Copy and paste the new request URL into a new browser window. 
Substitute `{customerId}` with `123`, and press Enter.

	This text should be returned: `Your customer Id is 123`

### Security for the trigger URL

Logic app callback URLs are securely generated using a Shared Access Signature (SAS). 
The signature passes through as a query parameter and must be validated before your logic app can fire. 
The signature is generated through a unique combination of a secret key per logic app, 
the trigger name, and the operation that's performed. Unless someone has access to the secret logic app key, 
they cannot generate a valid signature.

## Call your logic app trigger's endpoint

After you create the endpoint for your trigger, you can trigger your logic app 
through a `POST` to the full URL. You can include more headers and any content in the body. 
If the content's type is `application/json`, you can reference properties from inside the request. 
Otherwise, the content is treated as a single binary unit that can be passed to other APIs, 
but can't be referenced inside the workflow unless the content is converted. 
For example, if you pass `application/xml` content, you can use `@xpath()` 
for an XPath extraction, or `@json()` to convert from XML to JSON. 
Learn about [working with content types](../logic-apps/logic-apps-content-type.md).

Also, you can specify a JSON schema in the definition. 
This schema causes the designer to generate tokens that you can pass into steps. 
The following example makes a `title` and `name` token available in the designer:

```
{
    "properties":{
        "title": {
            "type": "string"
        },
        "name": {
            "type": "string"
        }
    },
    "required": [
        "title",
        "name"
    ],
    "type": "object"
}
```

## Reference the content from the incoming request

The `@triggerOutputs()` function outputs the contents of the incoming request. 
The output looks like this example:

```
{
    "headers" : {
        "content-type" : "application/json"
    },
    "body" : {
        "myprop" : "a value"
    }
}
```

To access the `body` property specifically, 
you can use the `@triggerBody()` shortcut. 

## Respond to the request

For some requests that start a logic app, 
you might want to respond with some content to the caller. 
To construct the status code, body, and headers for your response, 
you can use an action type called a **Response**. 
However, if no **Response** is included, 
the logic app endpoint *immediately* responds with **202 Accepted**.

![HTTP Response Action][3]

``` json
"Response": {
		"conditions": [],
		"inputs": {
			"body": {
				"name": "@{triggerBody()['name']}", 
					"title": "@{triggerBody()['title']}"
			},
			"headers": {
				"content-type": "application/json"
			},
			"statusCode": 200
		},
		"type": "Response"
}
```

Responses have these properties:

| Property | Description |
| --- | --- |
| statusCode |The HTTP status code for responding to the incoming request. This code can be any valid status code that starts with 2xx, 4xx, or 5xx. However, 3xx status codes are not permitted. |
| body |A body object that can be a string, a JSON object, or even binary content referenced from a previous step. |
| headers |You can define any number of headers to include in the response. |

In your logic app, all steps required for the response must finish 
within *60 seconds* for the original request to get the response, 
*unless you call the workflow as a nested logic app*. 
If no response happens within 60 seconds, 
the incoming request times out and receives a **408 Client timeout** HTTP response. 
For nested logic apps, the parent logic app continues to wait for a 
response until completed, regardless of how much time is required.

## Advanced endpoint configuration

Logic apps have built-in support for the direct-access endpoint 
and always use the `POST` method to start running the logic app. 
Previously, the **HTTP Listener** API App also supported changing 
the URL segments and the HTTP method. You can even set up additional security 
or a custom domain by adding these items to the API App host (the web app that hosted the API App). 

This functionality is available through **API Management**:

* [Change the request method](https://msdn.microsoft.com/library/azure/dn894085.aspx#SetRequestMethod)
* [Change the URL segments of the request](https://msdn.microsoft.com/library/azure/7406a8ce-5f9c-4fae-9b0f-e574befb2ee9#RewriteURL)
* Set up your API Management domains on the **Configure** tab in the classic Azure portal.
* Set up policy to check for Basic authentication.

## Summary of migration from 2014-12-01-preview

| 2014-12-01-preview | 2016-06-01 |
| --- | --- |
| Click **HTTP Listener** API App |Click **Manual trigger** (no API App required) |
| HTTP Listener setting "*Sends response automatically*" |Either include a **Response** action or not in the workflow definition. |
| Configure basic or OAuth authentication |via API Management |
| Configure HTTP method |via API Management |
| Configure relative path |via API Management |
| Reference the incoming body via `@triggerOutputs().body.Content` |Reference via `@triggerOutputs().body` |
| **Send HTTP response** action on the HTTP Listener |Click **Respond to HTTP request** (no API App required) |

[1]: ./media/logic-apps-http-endpoint/manualtrigger.png
[2]: ./media/logic-apps-http-endpoint/manualtriggerurl.png
[3]: ./media/logic-apps-http-endpoint/response.png
