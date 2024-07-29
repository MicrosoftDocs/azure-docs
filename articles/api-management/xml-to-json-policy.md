---
title: Azure API Management policy reference - xml-to-json | Microsoft Docs
description: Reference for the xml-to-json policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 03/18/2024
ms.author: danlep
---

# Convert XML to JSON

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

The `xml-to-json` policy converts a request or response body from XML to JSON. This policy can be used to modernize APIs based on XML-only backend web services.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml
<xml-to-json kind="javascript-friendly | direct" apply="always | content-type-xml" consider-accept-header="true | false"/>
```


## Attributes

| Attribute         | Description                                            | Required | Default |
| ----------------- | ------------------------------------------------------ | -------- | ------- |
|kind|The attribute must be set to one of the following values.<br /><br /> -   `javascript-friendly` - the converted JSON has a form friendly to JavaScript developers.<br />-   `direct` - the converted JSON reflects the original XML document's structure.<br/><br/>Policy expressions are allowed.|Yes|N/A|
|apply|The attribute must be set to one of the following values.<br /><br /> -   `always` - convert always.<br />-   `content-type-xml` - convert only if response Content-Type header indicates presence of XML.<br/><br/>Policy expressions are allowed.|Yes|N/A|
|consider-accept-header|The attribute must be set to one of the following values.<br /><br /> -   `true` - apply conversion if JSON is requested in request Accept header.<br />-   `false` -always apply conversion.<br/><br/>Policy expressions are allowed.|No|`true`|

## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound, outbound, on-error
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) classic, v2, consumption, self-hosted

## Example

```xml
<policies>
    <inbound>
        <base />
    </inbound>
    <outbound>
        <base />
        <xml-to-json kind="direct" apply="always" consider-accept-header="false" />
    </outbound>
</policies>
```

## Related policies

* [Transformation](api-management-policies.md#transformation)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]