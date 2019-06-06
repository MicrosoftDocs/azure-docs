---
title: Secure APIs using client certificate authentication in API Management - Azure API Management | Microsoft Docs
description: Learn how to secure access to APIs using client certificates
services: api-management
documentationcenter: ''
author: vladvino
manager: erikre
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/29/2019
ms.author: apimpm
---

# How to secure APIs using client certificate authentication in API Management

API Management provides the capability to secure access to APIs (i.e., client to API Management) using client certificates. Currently, you can check the thumbprint of a client certificate against a desired value. You can also check the thumbprint against existing certificates uploaded to API Management.  

For information about securing access to the back-end service of an API using client certificates (i.e., API Management to back-end), see [How to secure back-end services using client certificate authentication](https://docs.microsoft.com/azure/api-management/api-management-howto-mutual-certificates)

## Checking the expiration date

Below policies can be configured to check if the certificate is expired:

```xml
<choose>
    <when condition="@(context.Request.Certificate == null || context.Request.Certificate.NotAfter < DateTime.Now)" >
        <return-response>
            <set-status code="403" reason="Invalid client certificate" />
        </return-response>
    </when>
</choose>
```

## Checking the issuer and subject

Below policies can be configured to check the issuer and subject of a client certificate:

```xml
<choose>
    <when condition="@(context.Request.Certificate == null || context.Request.Certificate.Issuer != "trusted-issuer" || context.Request.Certificate.SubjectName.Name != "expected-subject-name")" >
        <return-response>
            <set-status code="403" reason="Invalid client certificate" />
        </return-response>
    </when>
</choose>
```

## Checking the thumbprint

Below policies can be configured to check the thumbprint of a client certificate:

```xml
<choose>
    <when condition="@(context.Request.Certificate == null || context.Request.Certificate.Thumbprint != "desired-thumbprint")" >
        <return-response>
            <set-status code="403" reason="Invalid client certificate" />
        </return-response>
    </when>
</choose>
```

## Checking a thumbprint against certificates uploaded to API Management

The following example shows how to check the thumbprint of a client certificate against certificates uploaded to API Management: 

```xml
<choose>
    <when condition="@(context.Request.Certificate == null || !context.Deployment.Certificates.Any(c => c.Value.Thumbprint == context.Request.Certificate.Thumbprint))" >
        <return-response>
            <set-status code="403" reason="Invalid client certificate" />
        </return-response>
    </when>
</choose>

```

## Next step

*  [How to secure back-end services using client certificate authentication](https://docs.microsoft.com/azure/api-management/api-management-howto-mutual-certificates)
*  [How to upload certificates](https://docs.microsoft.com/azure/api-management/api-management-howto-mutual-certificates)

