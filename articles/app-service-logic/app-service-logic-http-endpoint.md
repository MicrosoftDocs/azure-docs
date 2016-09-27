<properties
   pageTitle="Logic apps as callable endpoints"
   description="How to create and configure trigger endpoints and use them in a Logic app in Azure App Service"
   services="logic-apps"
   documentationCenter=".net,nodejs,java"
   authors="jeffhollan"
   manager="erikre"
   editor=""/>

<tags
   ms.service="logic-apps"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration"
   ms.date="08/10/2016"
   ms.author="jehollan"/>


# Logic apps as callable endpoints

Logic Apps natively can expose a synchronous HTTP endpoint as a trigger.  You can also use the pattern of callable endpoints to invoke Logic Apps as a nested workflow through the "workflow" action in a Logic App.

There are 3 types of triggers that can receive requests:

* Request
* ApiConnectionWebhook
* HttpWebhook

For the remainder of the article, we will use **request** as the example, but all of the principles apply identically to the other 2 types of triggers.

## Adding a trigger to your definition
The first step is to add a trigger to your Logic app definition that can receive incoming requests.  You can search in the designer for "HTTP Request" to add the trigger card. You can define a request body JSON Schema and the designer will generate tokens to help you parse and pass data from the manual trigger through the workflow.  I recommend using a tool like [jsonschema.net](http://jsonschema.net) to generate a JSON schema from a sample body payload.

![Request Trigger Card][2]

After you save your Logic App definition, a callback URL will be generated similar to this one:
 
``` text
https://prod-03.eastus.logic.azure.com:443/workflows/080cb66c52ea4e9cabe0abf4e197deff/triggers/myendpointtrigger?...
```

This URL contains a SAS key in the query parameters used for authentication.

You can also get this endpoint in the Azure portal:

![][1]

Or, by calling:

``` text
POST https://management.azure.com/{resourceID of your logic app}/triggers/myendpointtrigger/listCallbackURL?api-version=2015-08-01-preview
```

## Calling the Logic app trigger's endpoint

Once you have created the endpoint for your trigger, you can trigger it via a `POST` to the full URL. You can include additional headers, and any content in the body.

If the content-type is `application/json` then you will be able to reference properties from inside the request. Otherwise, it will be treated as a single binary unit that can be passed to other APIs but cannot be referenced inside the workflow without converting the content.  For example, if you pass `application/xml` content you could use `@xpath()` to do an xpath extraction, or `@json()` to convert from XML to JSON.  More information on working with content types [can be found here](app-service-logic-content-type.md)

In addition, you can specify a JSON schema in the definition. This causes the designer to generate tokens that you can then pass into steps.  For example the following will make a `title` and `name` token available in the designer:

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

## Referencing the content of the incoming request

The `@triggerOutputs()` function will output the contents of the incoming request. For example, it would look like:

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

You can use the `@triggerBody()` shortcut to access the `body` property specifically. 

## Responding to the request

For some requests that start a Logic app, you may want to respond with some content to the caller. There is a new action type called **response** that can be used to construct the status code, body and headers for your response. Note that if no **response** shape is present, the Logic app endpoint will *immediately* respond with **202 Accepted**.

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

Responses have the following:

| Property | Description |
| -------- | ----------- |
| statusCode | The HTTP status code to respond to the incoming request. It can be any valid status code that starts with 2xx, 4xx, or 5xx. 3xx status codes are not permitted. | 
| body | A body object that can be a string, a JSON object, or even binary content referenced from a previous step. | 
| headers | You can define any number of headers to be included in the response | 

All of the steps in the Logic app that are required for the response must complete within *60 seconds* for the original request to receive the response **unless the workflow is being called as a nested Logic App**. If no response action is reached within 60 seconds then the incoming request will time out and receive a **408 Client timeout** HTTP response.  For nested Logic Apps, the parent Logic App will continue to wait for a response until completed, regardless of the amount of time it takes.

## Advanced endpoint configuration

Logic apps have built in support for the direct access endpoint and always use the `POST` method to start a run of the Logic app. The **HTTP Listener** API app previously also supported changing the URL segments and the HTTP method. You could even set up additional security or a custom domain by adding it to the API app host (the Web app that hosted the API app). 

This functionality is available through **API management**:
* [Change the method of the request](https://msdn.microsoft.com/library/azure/dn894085.aspx#SetRequestMethod)
* [Change the URL segments of the request](https://msdn.microsoft.com/library/azure/7406a8ce-5f9c-4fae-9b0f-e574befb2ee9#RewriteURL)
* Set up your API management domains on the **Configure** tab in the classic Azure portal
* Set up policy to check for Basic authentication (**link needed**)

## Summary of migration from 2014-12-01-preview

|  2014-12-01-preview | 2016-06-01 |
|---------------------|--------------------|
| Click on **HTTP Listener** API app | Click on **Manual trigger** (no API app required) |
| HTTP Listener setting "*Sends response automatically*" | Either include a **response** action or not in the workflow definition |
| Configure basic or OAuth authentication | via API management |
| Configure HTTP method | via API management |
| Configure relative path | via API management |
| Reference the incoming body via  `@triggerOutputs().body.Content` | Reference via `@triggerOutputs().body` |
| **Send HTTP response** action on the HTTP Listener | Click on **Respond to HTTP request** (no API app required)


[1]: ./media/app-service-logic-http-endpoint/manualtriggerurl.png
[2]: ./media/app-service-logic-http-endpoint/manualtrigger.png
[3]: ./media/app-service-logic-http-endpoint/response.png
