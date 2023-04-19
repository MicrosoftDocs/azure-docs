---
title: Azure API Management policy reference - set-body | Microsoft Docs
description: Reference for the set-body policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 01/13/2023
ms.author: danlep
---

# Set body

Use the `set-body` policy to set the message body for incoming and outgoing requests. To access the message body you can use the `context.Request.Body` property or the `context.Response.Body`, depending on whether the policy is in the inbound or outbound section.

> [!IMPORTANT]
>  By default when you access the message body using `context.Request.Body` or `context.Response.Body`, the original message body is lost and must be set by returning the body back in the expression. To preserve the body content, set the `preserveContent` parameter to `true` when accessing the message. If `preserveContent` is set to `true` and a different body is returned by the expression, the returned body is used.
>

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml
<set-body template="liquid" xsi-nil="blank | null">
    new body value as text
</set-body>
```

## Attributes

| Attribute         | Description                                            | Required | Default |
| ----------------- | ------------------------------------------------------ | -------- | ------- |
|template|Used to change the templating mode that the `set-body` policy runs in. Currently the only supported value is:<br /><br />- `liquid` - the `set-body` policy will use the liquid templating engine |No| N/A|
|xsi-nil| Used to control how elements marked with `xsi:nil="true"` are represented in XML payloads. Set to one of the following values:<br /><br />- `blank` - `nil` is represented with an empty string.<br />- `null` - `nil` is represented with a null value.<br/></br>Policy expressions aren't allowed. |No | `blank` |

For accessing information about the request and response, the Liquid template can bind to a context object with the following properties: <br />
<pre>context.
    Request.
        Url
        Method
        OriginalMethod
        OriginalUrl
        IpAddress
        MatchedParameters
        HasBody
        ClientCertificates
        Headers

    Response.
        StatusCode
        Method
        Headers
Url.
    Scheme
    Host
    Port
    Path
    Query
    QueryString
    ToUri
    ToString

OriginalUrl.
    Scheme
    Host
    Port
    Path
    Query
    QueryString
    ToUri
    ToString
</pre>


## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound, outbound, backend
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

### Usage notes

 - If you're using the `set-body` policy to return a new or updated body, you don't need to set `preserveContent` to `true` because you're explicitly supplying the new body contents.
 -   Preserving the content of a response in the inbound pipeline doesn't make sense because there's no response yet.
 -   Preserving the content of a request in the outbound pipeline doesn't make sense because the request has already been sent to the backend at this point.
 -   If this policy is used when there's no message body, for example in an inbound `GET`, an exception is thrown.

For more information, see the `context.Request.Body`, `context.Response.Body`, and the `IMessageBody` sections in the [Context variable](api-management-policy-expressions.md#ContextVariables) table.

## Using Liquid templates with set-body
The `set-body` policy can be configured to use the [Liquid](https://shopify.github.io/liquid/basics/introduction/) templating language to transform the body of a request or response. This can be effective if you need to completely reshape the format of your message.

> [!IMPORTANT]
> The implementation of Liquid used in the `set-body` policy is configured in 'C# mode'. This is particularly important when doing things such as filtering. As an example, using a date filter requires the use of Pascal casing and C# date formatting e.g.:
>
> {{body.foo.startDateTime| Date:"yyyyMMddTHH:mm:ssZ"}}

> [!IMPORTANT]
> In order to correctly bind to an XML body using the Liquid template, use a `set-header` policy to set Content-Type to either application/xml, text/xml (or any type ending with +xml); for a JSON body, it must be application/json, text/json (or any type ending with +json).

### Supported Liquid filters

The following Liquid filters are supported in the `set-body` policy. For filter examples, see the [Liquid documentation](https://shopify.github.io/liquid/). 

> [!NOTE]
> The policy requires Pascal casing for Liquid filter names (for example, "AtLeast" instead of "at_least").
> 
* Abs
* Append
* AtLeast
* AtMost
* Capitalize
* Compact
* Currency
* Date
* Default
* DividedBy
* Downcase
* Escape
* First
* H
* Join
* Last
* Lstrip
* Map
* Minus
* Modulo
* NewlineToBr
* Plus
* Prepend
* Remove
* RemoveFirst
* Replace
* ReplaceFirst
* Round
* Rstrip
* Size
* Slice
* Sort
* Split
* Strip
* StripHtml
* StripNewlines
* Times
* Truncate
* TruncateWords
* Uniq
* Upcase
* UrlDecode
* UrlEncode


## Examples

### Literal text

```xml
<set-body>Hello world!</set-body>
```

### Accessing the body as a string

We're preserving the original request body so that we can access it later in the pipeline.

```xml
<set-body>
@{ 
    string inBody = context.Request.Body.As<string>(preserveContent: true); 
    if (inBody[0] =='c') { 
        inBody[0] = 'm'; 
    } 
    return inBody; 
}
</set-body>
```

### Accessing the body as a JObject

Since we're not reserving the original request body, accessing it later in the pipeline will result in an exception.

```xml
<set-body> 
@{ 
    JObject inBody = context.Request.Body.As<JObject>(); 
    if (inBody.attribute == <tag>) { 
        inBody[0] = 'm'; 
    } 
    return inBody.ToString(); 
} 
</set-body>

```

### Filter response based on product

This example shows how to perform content filtering by removing data elements from the response received from a backend service when using the `Starter` product. The example backend response includes root-level properties similar to the [OpenWeather One Call API](https://openweathermap.org/api/one-call-api). 

```xml
<!-- Copy this snippet into the outbound section to remove a number of data elements from the response received from the backend service based on the name of the product -->
<choose>
  <when condition="@(context.Response.StatusCode == 200 && context.Product.Name.Equals("Starter"))">
    <set-body>@{
        var response = context.Response.Body.As<JObject>();
        foreach (var key in new [] {"current", "minutely", "hourly", "daily", "alerts"}) {
          response.Property (key).Remove ();
        }
        return response.ToString();
      }
    </set-body>
  </when>
</choose>
```

### Convert JSON to SOAP using a Liquid template
```xml
<set-body template="liquid">
    <soap:Envelope xmlns="http://tempuri.org/" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
            <GetOpenOrders>
                <cust>{{body.getOpenOrders.cust}}</cust>
            </GetOpenOrders>
        </soap:Body>
    </soap:Envelope>
</set-body>
```

### Transform JSON using a Liquid template
```xml
<set-body template="liquid">
{
"order": {
    "id": "{{body.customer.purchase.identifier}}",
    "summary": "{{body.customer.purchase.orderShortDesc}}"
    }
}
</set-body>
```

### Access the body as URL-encoded form data
The following example uses the `AsFormUrlEncodedContent()` expression to access the request body as URL-encoded form data (content type `application/x-www-form-urlencoded`), and then converts it to JSON. Since we're not reserving the original request body, accessing it later in the pipeline will result in an exception.

```xml
<set-body> 
@{ 
    var inBody = context.Request.Body.AsFormUrlEncodedContent();
    return JsonConvert.SerializeObject(inBody); 
} 
</set-body>
```

### Access and return body as URL-encoded form data
The following example uses the `AsFormUrlEncodedContent()` expression to access the request body as URL-encoded form data (content type `application/x-www-form-urlencoded`), adds data to the payload, and returns URL-encoded form data. Since we're not reserving the original request body, accessing it later in the pipeline will result in an exception.

```xml
<set-body> 
@{ 
    var body = context.Request.Body.AsFormUrlEncodedContent();
    body["newKey"].Add("newValue");
    return body.ToFormUrlEncodedContent(); 
} 
</set-body>
```


## Related policies

* [API Management transformation policies](api-management-transformation-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]