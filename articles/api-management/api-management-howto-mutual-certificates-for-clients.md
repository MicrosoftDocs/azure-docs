---
title: Secure APIs using client certificate authentication in API Management
titleSuffix: Azure API Management
description: Learn how to secure access to APIs using client certificates
services: api-management
documentationcenter: ''
author: vladvino
manager: erikre
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 01/13/2020
ms.author: apimpm
---

# How to secure APIs using client certificate authentication in API Management

API Management provides the capability to secure access to APIs (i.e., client to API Management) using client certificates. You can validate incoming certificate and check certificate properties against desired values using policy expressions.

For information about securing access to the back-end service of an API using client certificates (i.e., API Management to backend), see [How to secure back-end services using client certificate authentication](https://docs.microsoft.com/azure/api-management/api-management-howto-mutual-certificates)

> [!IMPORTANT]
> To receive and verify client certificates over HTTP/2 in the Developer, Basic, Standard, or Premium tiers you must turn on the "Negotiate client certificate" setting on the "Custom domains" blade as shown below.

![Negotiate client certificate](./media/api-management-howto-mutual-certificates-for-clients/negotiate-client-certificate.png)

> [!IMPORTANT]
> To receive and verify client certificates in the Consumption tier you must turn on the "Request client certificate" setting on the "Custom domains" blade as shown below.

![Request client certificate](./media/api-management-howto-mutual-certificates-for-clients/request-client-certificate.png)

## Checking the issuer and subject

Below policies can be configured to check the issuer and subject of a client certificate:

```xml
<choose>
    <when condition="@(context.Request.Certificate == null || !context.Request.Certificate.Verify() || context.Request.Certificate.Issuer != "trusted-issuer" || context.Request.Certificate.SubjectName.Name != "expected-subject-name")" >
        <return-response>
            <set-status code="403" reason="Invalid client certificate" />
        </return-response>
    </when>
</choose>
```

> [!NOTE]
> To disable checking certificate revocation list use `context.Request.Certificate.VerifyNoRevocation()` instead of `context.Request.Certificate.Verify()`.
> If client certificate is self-signed, root (or intermediate) CA certificate(s) must be [uploaded](api-management-howto-ca-certificates.md) to API Management for `context.Request.Certificate.Verify()` and `context.Request.Certificate.VerifyNoRevocation()` to work.

## Checking the thumbprint

Below policies can be configured to check the thumbprint of a client certificate:

```xml
<choose>
    <when condition="@(context.Request.Certificate == null || !context.Request.Certificate.Verify() || context.Request.Certificate.Thumbprint != "DESIRED-THUMBPRINT-IN-UPPER-CASE")" >
        <return-response>
            <set-status code="403" reason="Invalid client certificate" />
        </return-response>
    </when>
</choose>
```

> [!NOTE]
> To disable checking certificate revocation list use `context.Request.Certificate.VerifyNoRevocation()` instead of `context.Request.Certificate.Verify()`.
> If client certificate is self-signed, root (or intermediate) CA certificate(s) must be [uploaded](api-management-howto-ca-certificates.md) to API Management for `context.Request.Certificate.Verify()` and `context.Request.Certificate.VerifyNoRevocation()` to work.

## Checking a thumbprint against certificates uploaded to API Management

The following example shows how to check the thumbprint of a client certificate against certificates uploaded to API Management:

```xml
<choose>
    <when condition="@(context.Request.Certificate == null || !context.Request.Certificate.Verify()  || !context.Deployment.Certificates.Any(c => c.Value.Thumbprint == context.Request.Certificate.Thumbprint))" >
        <return-response>
            <set-status code="403" reason="Invalid client certificate" />
        </return-response>
    </when>
</choose>

```

> [!NOTE]
> To disable checking certificate revocation list use `context.Request.Certificate.VerifyNoRevocation()` instead of `context.Request.Certificate.Verify()`.
> If client certificate is self-signed, root (or intermediate) CA certificate(s) must be [uploaded](api-management-howto-ca-certificates.md) to API Management for `context.Request.Certificate.Verify()` and `context.Request.Certificate.VerifyNoRevocation()` to work.

> [!TIP]
> Client certificate deadlock issue described in this [article](https://techcommunity.microsoft.com/t5/Networking-Blog/HTTPS-Client-Certificate-Request-freezes-when-the-Server-is/ba-p/339672) can manifest itself in several ways, e.g. requests freeze, requests result in `403 Forbidden` status code after timing out, `context.Request.Certificate` is `null`. This problem usually affects `POST` and `PUT` requests with content length of approximately 60KB or larger.
> To prevent this issue from occurring turn on "Negotiate client certificate" setting for desired hostnames on the "Custom domains" blade as shown below. This feature is not available in the Consumption tier.

![Negotiate client certificate](./media/api-management-howto-mutual-certificates-for-clients/negotiate-client-certificate.png)

## Next steps

-   [How to secure back-end services using client certificate authentication](https://docs.microsoft.com/azure/api-management/api-management-howto-mutual-certificates)
-   [How to upload certificates](https://docs.microsoft.com/azure/api-management/api-management-howto-mutual-certificates)
