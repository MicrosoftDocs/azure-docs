<properties
   pageTitle="Logic apps content type handling | Microsoft Azure"
   description="Understand how Logic Apps deals with content-types at design and runtime"
   services="logic-apps"
   documentationCenter=".net,nodejs,java"
   authors="jeffhollan"
   manager="dwrede"
   editor=""/>

<tags
   ms.service="logic-apps"
   ms.devlang="multiple"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="integration"
   ms.date="05/03/2016"
   ms.author="jehollan"/>

# Logic Apps Content Type Handling

There are many different types of content that can flow through a Logic App - including JSON, XML, flat files, and binary data.  While all content-types are supported, some are natively understood by the Logic Apps Engine, and others may require casting or conversions as needed.  The following article will describe how the engine handles different content-types and how they can be correctly handled as needed.

## Content-Type Header

To start simple, let's look at the two `Content-Types` that don't require any conversion or casting to use within a Logic App - `application/json` and `text/plain`.

### Application/json

The workflow engine relies on the `Content-Type` header from HTTP calls to determine the appropriate handling.  Any request with the content type `application/json` will be stored and handled as a JSON Object.  In addition, JSON content can be parsed by default without needing any casting.  So a request that has the content-type header `application/json ` like this:

```
{
    "data": "a",
    "foo": [
        "bar"
    ]
}
```

could be parsed in a workflow with an expression like `@body('myAction')['foo'][0]` to get a value (in this case, `bar`).  No additional casting is needed.  If you are working with data that is JSON but didn't have a header specified, you can manually cast it to JSON using the `@json()` function (for example: `@json(triggerBody())['foo']`).

### Text/plain

Similar to `application/json`, HTTP messages recieved with the `Content-Type` header of `text/plain` will be stored in it's raw form.  In addition, if included in a subsequent actions without any casting the request will go out with a `Content-Type`: `text/plain` header.  For example, if working with a flat file you may recieve the following HTTP content:

```
Date,Name,Address
Oct-1,Frank,123 Ave.
```

as `text/plain`.  If in the next action you sent it as the body of another request (`@body('flatfile')`), the request would have a `text/plain` Content-Type header.  If you are working with data that is plain text but didn't have a header specified, you can manually cast it to text using the `@string()` function (for example: `@string(triggerBody())`)

### Application/xml and Application/octet-stream and Converter Functions

The Logic App Engine will always preserve the `Content-Type` that was recieved on the HTTP request or response.  What this means is if a content is recieved with `Content-Type` of `application/octet-stream`, including that in a subsequent action with no casting will result in an outgoing request with `Content-Type`: `application/octet-stream`.  In this way the engine can guaruntee data will not be lost as it moves throughout the workflow.  However, the action state (inputs and outputs) are stored in a JSON object as it flows throughout the workflow.  This means in order to preserve some data-types, the engine will convert the content to a binary base64 encoded string with appropriate metadata that preserves both `$content` and `$content-type` - which will automatically be converted.  You can also manually convert between content-types using built in converter functions:

* `@json()` - casts data to `application/json`
* `@xml()` - casts data to `application/xml`
* `@binary()` - casts data to `application/octet-stream`
* `@string()` - casts data to `text/plain`
* `@base64()` - converts content to a base64 string
* `@base64toString()` - converts a base64 encoded string to `text/plain`
* `@base64toBinary()` - converts a base64 encoded string to `application/octet-stream`
* `@encodeDataUri()` - encodes a string as a dataUri byte array
* `@decodeDataUri()` - decodes a dataUri into a byte array

For example, if you recieved an HTTP request with `Content-Type`: `application/xml` of:

```
<?xml version="1.0" encoding="UTF-8" ?>
<CustomerName>Frank</CustomerName>
```

I could cast and use later with something like `@xml(triggerBody())`, or within a function like `@xpath(xml(triggerBody()), '/CustomerName')`.

### Other-Content Types

Other content types are supported and will work with a Logic App, but may require manually retrieving the message body by decoding the `$content`.  For example, if I were triggering off of a `application/x-www-url-formencoded` request that looked like the following:

```
CustomerName=Frank&Address=123+Avenue
```

since this a not plain text or JSON it will be stored in the action as:

```
...
"body": {
    "$content-type": "application/x-www-url-formencoded",
    "$content": "AAB1241BACDFA=="
}
```

Where `$content` is the payload encoded as a base64 string to preserve all data.  Since there currently isn't a native function for form-data, I could still use this data within a workflow by manually accessing the data with a function like `@string(body('formdataAction'))`.  If I wanted my outgoing request to also have the `application/x-www-url-formencoded` content-type header, I could just add it to the action body without any casting like `@body('formdataAction')`.  However, this will only work if body is the only parameter in the `body` input.  If you try to do `@body('formdataAction')` inside of an `application/json` request you will get a runtime error as it will send the encoded body.
