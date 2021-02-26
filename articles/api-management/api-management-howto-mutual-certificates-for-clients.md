---
title: Secure APIs using client certificate authentication in API Management
titleSuffix: Azure API Management
description: Learn how to secure access to APIs by using client certificates. You can use policy expressions to validate incoming certificates.
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

For information about securing access to the back-end service of an API using client certificates (i.e., API Management to backend), see [How to secure back-end services using client certificate authentication](./api-management-howto-mutual-certificates.md)

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
> To prevent this issue from occurring turn on "Negotiate client certificate" setting for desired hostnames on the "Custom domains" blade as shown in the first image of this document. This feature is not available in the Consumption tier.

## Certificate validation in self-hosted gateway

The default API Management [self-hosted gateway](self-hosted-gateway-overview.md) image doesn't support validating server and client certificates using [CA root certificates](api-management-howto-ca-certificates.md) uploaded to an API Management instance. Clients presenting a custom certificate to the self-hosted gateway may experience slow responses, because certificate revocation list (CRL) validation can take a long time to time out on the gateway. 

As a workaround when running the gateway, you may configure the PKI IP address to point to the localhost address (127.0.0.1) instead of the API Management instance. This causes the CRL validation to fail quickly when the gateway attempts to validate the client certificate. To configure the gateway, add a DNS entry for the API Management instance to resolve to the localhost in the `/etc/hosts` file in the container. You can add this entry during gateway deployment:
 
* For Docker deployment - add the `--add-host <hostname>:127.0.0.1` parameter to the `docker run` command. For more information, see [Add entries to container hosts file](https://docs.docker.com/engine/reference/commandline/run/#add-entries-to-container-hosts-file---add-host)
 
* For Kubernetes deployment - Add a `hostAliases` specification to the `myGateway.yaml` configuration file. For more information, see [Adding entries to Pod /etc/hosts with Host Aliases](https://kubernetes.io/docs/concepts/services-networking/add-entries-to-pod-etc-hosts-with-host-aliases/).




## Next steps

-   [How to secure back-end services using client certificate authentication](./api-management-howto-mutual-certificates.md)
-   [How to upload certificates](./api-management-howto-mutual-certificates.md)
