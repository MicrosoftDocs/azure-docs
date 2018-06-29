---
# required metadata
title: Handle content types - Azure Logic Apps | Microsoft Docs
description: Learn how Logic Apps handles content types at design time and run time
services: logic-apps
ms.service: logic-apps
author: kevinlam1
ms.author: klam
manager: jeconnoc
ms.topic: article
ms.date: 10/18/2016

# optional metadata
ms.reviewer: klam, LADocs
ms.suite: integration
---

# Handle content types in Azure Logic Apps

A logic app can have many content types flow through 
Many different types of content can flow through a logic app, including JSON, XML, flat files, and binary data. 
While the Logic Apps Engine supports all content types, some are natively understood by the Logic Apps Engine. 
Others might require casting or conversions as necessary. 
This article describes how the engine handles different content types and how to correctly handle these types when necessary.

## Content-Type header

To start basically, let's look at the two `Content-Types` that don't require conversion or casting 
that you can use in a logic app: `application/json` and `text/plain`.

## "application/json" content type

The workflow engine relies on the `Content-Type` header from HTTP calls to determine the appropriate handling. 
Any request with the content type `application/json` is stored and handled as a JSON Object. 
Also, JSON content can be parsed by default without needing any casting. 

For example, you could parse a request that has the content type header `application/json ` in a workflow 
by using an expression like `@body('myAction')['foo'][0]` to get the value `bar` in this case:

```
{
    "data": "a",
    "foo": [
        "bar"
    ]
}
```

No additional casting is needed. If you are working with data that is JSON but didn't have a header specified, 
you can manually cast it to JSON using the `@json()` function, for example: `@json(triggerBody())['foo']`.

### Schema and schema generator

The **Request** trigger lets you to enter a JSON schema for the payload you expect to receive. 
This schema lets the designer generate tokens so you can consume the content of the request. 
If you don't have a schema ready, select **Use sample payload to generate schema**, 
so you can generate a JSON schema from a sample payload.

![Schema](./media/logic-apps-http-endpoint/manualtrigger.png)

### Parse JSON action

The **Parse JSON** action lets you parse JSON content into friendly tokens 
for logic app consumption. Similar to the Request trigger, this action 
lets you enter or generate a JSON schema for the content you want to parse. 
This tool makes consuming data from Service Bus, Azure Cosmos DB, and so on, much easier.

![Parse JSON](./media/logic-apps-content-type/ParseJSON.png)

## text/plain content type

Similar to `application/json`, HTTP messages received with the `Content-Type` header 
of `text/plain` are stored in raw form. Also, if those messages are included in subsequent actions without casting, 
those requests go out with  `Content-Type`: `text/plain` header. 
For example, when working with a flat file, you might get this HTTP content as `text/plain`:

`
Date,Name,Address
Oct-1,Frank,123 Ave.
`

If in the next action, you send the request as the body of another request (`@body('flatfile')`), 
the request would have a `text/plain` Content-Type header. 
If you are working with data that is plain text but didn't have a header specified, 
you can manually cast the data to text using the `@string()` function, for example: `@string(triggerBody())`.

## application/xml, application/octet-stream, and converter functions

Logic Apps always preserves the `Content-Type` in the received HTTP request or response. 
So if your logic app receives content with `Content-Type` set to `application/octet-stream`, 
and you include that content in a later action without casting, 
the outgoing request also has `Content-Type` set to `application/octet-stream`. 
That way, Logic Apps can guarantee that data doesn't get lost while moving through the workflow. 
However, the action state, or inputs and outputs, is stored in a JSON object 
while the state moves through the workflow. 

To preserve some data types, Logic Apps converts the content to a binary 
base64-encoded string with the appropriate metadata that preserves both 
the `$content` payload and the `$content-type`, which are automatically converted. 

* `@json()` - casts data to `application/json`
* `@xml()` - casts data to `application/xml`
* `@binary()` - casts data to `application/octet-stream`
* `@string()` - casts data to `text/plain`
* `@base64()` - converts content to a base64 string
* `@base64toString()` - converts a base64 encoded string to `text/plain`
* `@base64toBinary()` - converts a base64 encoded string to `application/octet-stream`
* `@encodeDataUri()` - encodes a string as a dataUri byte array
* `@decodeDataUri()` - decodes a dataUri into a byte array

For example, if you received an HTTP request 
where `Content-Type` set to `application/xml`:

```html
<?xml version="1.0" encoding="UTF-8" ?>
<CustomerName>Frank</CustomerName>
```

You could cast this content by the `@xml(triggerBody())` expression, 
which uses the `xml()` and triggerBody() functions and then use the content later, 
or by using an expression such as `@xpath(xml(triggerBody()), '/CustomerName')`, 
which uses both the `xpath()` and `xml()` functions.

## Other content types

Logic Apps works with and supports other content types, 
but might require that you manually get the message body 
body by decoding the `$content` variable.

For example, suppose your logic app gets triggered by a request 
with the `application/x-www-url-formencoded` content type. 
To preserve all the data, the `$content` variable in the 
request body has a payload that's encoded as a base64 string:

`CustomerName=Frank&Address=123+Avenue`

Because the request isn't plain text or JSON, 
the request is stored in the action as follows:

```json
"body": {
   "$content-type": "application/x-www-url-formencoded",
   "$content": "AAB1241BACDFA=="
}
```

Logic Apps provides native functions for handling form data, for example: 

* [triggerFormDataValue()](../logic-apps/workflow-definition-language-functions-reference.md#triggerFormDataValue)
* [triggerFormDataMultiValues()](../logic-apps/workflow-definition-language-functions-reference.md#triggerFormDataMultiValues)
* [formDataValue()](../logic-apps/workflow-definition-language-functions-reference.md#formDataValue) 
* [formDataMultiValues()](../logic-apps/workflow-definition-language-functions-reference.md#formDataMultiValues)

Or, you could manually access the data by using an expression such as this example:

`@string(body('formdataAction'))` 

If you wanted the outgoing request to have the same 
`application/x-www-url-formencoded` content type header, 
you could add the request to the action's body without 
any casting by using an expression such as `@body('formdataAction')`. 
However, this method only works when the body is the only 
parameter in the `body` input. If you try to use the 
`@body('formdataAction')` expression in an `application/json` request, 
you get a runtime error because the body is sent encoded.
