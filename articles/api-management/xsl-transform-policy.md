---
title: Azure API Management policy reference - xsl-transform | Microsoft Docs
description: Reference for the xsl-transform policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 03/28/2023
ms.author: danlep
---

# Transform XML using an XSLT

The `xsl-transform` policy applies an XSL transformation to XML in the request or response body.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml
<xsl-transform>
    <parameter parameter-name="...">...</parameter>
    <xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
        <xsl:.../>
        <xsl:.../>
    </xsl:stylesheet>
  </xsl-transform>
```

## Elements

|Name|Description|Required|
|----------|-----------------|--------------|
|parameter|Used to define variables used in the transform|No|
|xsl:stylesheet|Root stylesheet element. All elements and attributes defined within follow the standard [XSLT specification](https://www.w3.org/TR/xslt)|Yes|


## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) inbound, outbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) dedicated, consumption, self-hosted

### Usage notes

- This policy can only be used once in a policy section.

## Examples

### Transform request body

```xml
<inbound>
    <base />
    <xsl-transform>
        <parameter name="User-Agent">@(context.Request.Headers.GetValueOrDefault("User-Agent","non-specified"))</parameter>
        <xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
            <xsl:output method="xml" indent="yes" />
            <xsl:param name="User-Agent" />
            <xsl:template match="* | @* | node()">
                <xsl:copy>
                    <xsl:if test="self::* and not(parent::*)">
                        <xsl:attribute name="User-Agent">
                            <xsl:value-of select="$User-Agent" />
                        </xsl:attribute>
                    </xsl:if>
                    <xsl:apply-templates select="* | @* | node()" />
                </xsl:copy>
            </xsl:template>
        </xsl:stylesheet>
      </xsl-transform>
</inbound>
```

### Transform response body

```xml
<policies>
  <inbound>
      <base />
  </inbound>
  <outbound>
      <base />
      <xsl-transform>
          <xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
            <xsl:output omit-xml-declaration="yes" method="xml" indent="yes" />
            <!-- Copy all nodes directly-->
            <xsl:template match="node()| @*|*">
                <xsl:copy>
                    <xsl:apply-templates select="@* | node()|*" />
                </xsl:copy>
            </xsl:template>
          </xsl:stylesheet>
    </xsl-transform>
  </outbound>
</policies>
```

## Related policies

- [API Management transformation policies](api-management-transformation-policies.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]