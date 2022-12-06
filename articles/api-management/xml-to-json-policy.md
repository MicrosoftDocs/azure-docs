---
title: Azure API Management policy reference - xml-to-json | Microsoft Docs
description: Reference for the xml-to-json policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: reference
ms.date: 12/02/2022
ms.author: danlep
---

# Convert XML to JSON
The `xml-to-json` policy converts a request or response body from XML to JSON. This policy can be used to modernize APIs based on XML-only backend web services.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

### Policy statement

```xml
<xml-to-json kind="javascript-friendly | direct" apply="always | content-type-xml" consider-accept-header="true | false"/>
```


## Attributes

| Attribute         | Description                                            | Required | Default |
| ----------------- | ------------------------------------------------------ | -------- | ------- |
|kind|The attribute must be set to one of the following values.<br /><br /> -   javascript-friendly - the converted JSON has a form friendly to JavaScript developers.<br />-   direct - the converted JSON reflects the original XML document's structure.|Yes|N/A|
|apply|The attribute must be set to one of the following values.<br /><br /> -   always - convert always.<br />-   content-type-xml - convert only if response Content-Type header indicates presence of XML.|Yes|N/A|
|consider-accept-header|The attribute must be set to one of the following values.<br /><br /> -   true - apply conversion if JSON is requested in request Accept header.<br />-   false -always apply conversion.|No|true|

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound, outbound, on-error
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, product, API, operation
- [**Policy expressions:**](api-management-policy-expressions.md) supported
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted
- **Multiple statements per policy document:** supported

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