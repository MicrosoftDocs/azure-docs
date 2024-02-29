---
title: Azure API Management policy reference - json-to-xml | Microsoft Docs
description: Reference for the json-to-xml policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 12/08/2022
ms.author: danlep
---

# Convert JSON to XML
The `json-to-xml` policy converts a request or response body from JSON to XML.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml
<json-to-xml 
    apply="always | content-type-json" 
    consider-accept-header="true | false" 
    parse-date="true | false" 
    namespace-separator="separator character"
    namespace-prefix="namespace prefix"
    attribute-block-name="name" />
```

## Attributes

| Attribute         | Description                                            | Required | Default |
| ----------------- | ------------------------------------------------------ | -------- | ------- |
|apply|The attribute must be set to one of the following values.<br /><br /> -   `always` - always apply conversion.<br />-   `content-type-json` - convert only if response Content-Type header indicates presence of JSON.<br/><br/>Policy expressions are allowed.|Yes|N/A|
|consider-accept-header|The attribute must be set to one of the following values.<br /><br /> -   `true` - apply conversion if XML is requested in request Accept header.<br />-   `false` - always apply conversion.<br/><br/>Policy expressions are allowed.|No|`true`|
|parse-date|When set to `false` date values are simply copied during transformation. Policy expressions aren't allowed.|No|`true`|
|namespace-separator|The character to use as a namespace separator. Policy expressions are allowed.|No|Underscore|
|namespace-prefix|The string that identifies property as namespace attribute, usually "xmlns". Properties with names beginning with specified prefix will be added to current element as namespace declarations. Policy expressions are allowed.|No|N/A|
|attribute-block-name|When set, properties inside the named object will be added to the element as attributes. Policy expressions are allowed.|No|Not set|

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound, outbound, on-error
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

## Example

Consider the following policy:

```xml
<policies>
    <inbound>
        <base />
    </inbound>
    <outbound>
        <base />
        <json-to-xml apply="always" consider-accept-header="false" parse-date="false" namespace-separator=":" namespace-prefix="xmlns" attribute-block-name="#attrs" />
    </outbound>
</policies>
```

If the backend returns the following JSON:

``` json
{
  "soapenv:Envelope": {
    "xmlns:soapenv": "http://schemas.xmlsoap.org/soap/envelope/",
    "xmlns:v1": "http://localdomain.com/core/v1",
    "soapenv:Header": {},
    "soapenv:Body": {
      "v1:QueryList": {
        "#attrs": {
          "queryName": "test"
        },
        "v1:QueryItem": {
          "name": "dummy text"
        }
      }
    }
  }
}
```

The XML response to the client will be:

``` xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:v1="http://localdomain.com/core/v1">
  <soapenv:Header />
  <soapenv:Body>
    <v1:QueryList queryName="test">
      <name>dummy text</name>
    </v1:QueryList>
  </soapenv:Body>
</soapenv:Envelope>
```



## Related policies

* [API Management transformation policies](api-management-transformation-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]