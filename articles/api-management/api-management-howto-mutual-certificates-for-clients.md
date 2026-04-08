---
title: Secure APIs using client certificate authentication in API Management
titleSuffix: Azure API Management
description: Learn how to secure access to APIs by using client certificates. You can use policy expressions to validate incoming certificates.
services: api-management
author: dlepow
ms.service: azure-api-management
ms.topic: how-to
ms.date: 01/29/2026
ms.author: danlep
ms.custom:
  - engagement-fy23
  - sfi-image-nochange
#customer intent: As a developer using API Management, I want to use client certificates for authentication, including working with Azure Key Vault.
---

# How to secure APIs using client certificate authentication in API Management

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

API Management provides the capability to secure access to APIs (that is, client to API Management) using client certificates and mutual TLS authentication. You can validate certificates presented by the connecting client and check certificate properties against desired values using policy expressions.

For information about securing access to the backend service of an API using client certificates or API Management to backend, see [Secure backend services](./api-management-howto-mutual-certificates.md).

For a conceptual overview of API authorization, see [Authentication and authorization](authentication-authorization-overview.md). 

## Certificate options

For certificate validation, API Management can check against certificates managed in your API Management instance. If you choose to use API Management to manage client certificates, you have the following options:

- Reference a certificate managed in [Azure Key Vault](/azure/key-vault/general/overview) 
- Add a certificate file directly in API Management

[!INCLUDE [api-management-workspace-key-vault-availability](../../includes/api-management-workspace-key-vault-availability.md)]

We recommend using key vault certificates because the approach helps improve API Management security:

- Certificates stored in key vaults can be reused across services
- You can apply granular [access policies](/azure/key-vault/general/security-features#privileged-access) to certificates stored in key vaults
- Certificates updated in the key vault are automatically rotated in API Management. After update in the key vault, a certificate in API Management is updated within 4 hours. You can also manually refresh the certificate using the Azure portal or by using the management REST API.

## Prerequisites

- If you haven't created an API Management service instance yet, see [Create an API Management service instance](get-started-create-service-instance.md).
- You need access to the certificate and the password for management in an Azure key vault or upload to the API Management service. The certificate must be in either CER or PFX format. Self-signed certificates are allowed. 

   If you use a self-signed certificate, also install trusted root and intermediate [CA certificates](api-management-howto-ca-certificates.md) in your API Management instance.
    
   > [!NOTE]
   >
   > CA certificates for certificate validation aren't supported in the Consumption tier.

[!INCLUDE [api-management-client-certificate-key-vault](../../includes/api-management-client-certificate-key-vault.md)]

   > [!NOTE]
   >
   > If you only want to use the certificate to authenticate the client with API Management, you can upload a CER file.

## Enable API Management instance to receive and verify client certificates

### Developer, Basic, Standard, or Premium tier

To receive and verify client certificates over HTTP/2 in the Developer, Basic, Standard, or Premium tiers, you must enable **Negotiate client certificate**.

1. Select **Deployment + infrastructure**, then **Custom domains**. 
1. Select the gateway hostname.
1. In the **Gateway** page, select **Negotiate client certificate**, then **Update**.

   :::image type="content" source="./media/api-management-howto-mutual-certificates-for-clients/negotiate-client-certificate.png" alt-text="Screenshot shows the negotiate client certificate option for a custom domain.":::

### Consumption, Basic v2, Standard v2, or Premium v2 tier

To receive and verify client certificates in the Consumption, Basic v2, Standard v2, or Premium v2 tier, you must enable **Request client certificate**. 

1. Select **Deployment + infrastructure**, then **Custom domains**. 
1. Under **Client certificates**, enable **Request client certificate**.

   :::image type="content" source="./media/api-management-howto-mutual-certificates-for-clients/request-client-certificate.png" alt-text="Screenshot shows the option to request client certificate for custom domains.":::

## Policy to validate client certificates

Use the [validate-client-certificate](validate-client-certificate-policy.md) policy to validate one or more attributes of a client certificate used to access APIs hosted in your API Management instance.

Configure the policy to validate one or more attributes including certificate issuer, subject, thumbprint, whether the certificate is validated against online revocation list, and others.

## Certificate validation with context variables

You can also create policy expressions with the [`context` variable](api-management-policy-expressions.md#ContextVariables) to check client certificates. Examples in the following sections show expressions using the `context.Request.Certificate` property and other `context` properties.

> [!NOTE]
>
> Mutual certificate authentication might not function correctly when the API Management gateway endpoint is exposed through the Application Gateway. The Application Gateway functions as a Layer 7 load balancer, establishing a distinct TLS connection with the backend API Management service. The certificate attached by the client in the initial HTTP request isn't forwarded to APIM.
>
> As a workaround, you can transmit the certificate using the server variables option. For more information, see [Mutual Authentication Server Variables](../application-gateway/rewrite-http-headers-url.md#mutual-authentication-server-variables).

> [!IMPORTANT]
>
> - Starting May 2021, the `context.Request.Certificate` property only requests the certificate when the API Management instance's [`hostnameConfiguration`](/rest/api/apimanagement/current-ga/api-management-service/create-or-update#hostnameconfiguration) sets the `negotiateClientCertificate` property to True. By default, `negotiateClientCertificate` is set to False.
> - If TLS renegotiation is disabled in your client, you might see TLS errors when requesting the certificate using the `context.Request.Certificate` property. If the errors appear, enable TLS renegotiation settings in the client. 
> - Certificate renegotiation isn't supported in the API Management v2 tiers.

### Checking the issuer and subject

The following policies can be configured to check the issuer and subject of a client certificate:

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
>
> To disable checking certificate revocation list, use `context.Request.Certificate.VerifyNoRevocation()` instead of `context.Request.Certificate.Verify()`.
>
> If client certificate is self-signed, root (or intermediate) CA certificates must be [uploaded](api-management-howto-ca-certificates.md) to API Management for `context.Request.Certificate.Verify()` and `context.Request.Certificate.VerifyNoRevocation()` to work.

### Checking the thumbprint

The following policies can be configured to check the thumbprint of a client certificate:

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
>
> To disable checking certificate revocation list, use `context.Request.Certificate.VerifyNoRevocation()` instead of `context.Request.Certificate.Verify()`.
>
> If client certificate is self-signed, root (or intermediate) CA certificates must be [uploaded](api-management-howto-ca-certificates.md) to API Management for `context.Request.Certificate.Verify()` and `context.Request.Certificate.VerifyNoRevocation()` to work.

### Checking a thumbprint against certificates uploaded to API Management

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
> To disable checking certificate revocation list, use `context.Request.Certificate.VerifyNoRevocation()` instead of `context.Request.Certificate.Verify()`.
>
> If client certificate is self-signed, root (or intermediate) CA certificates must be [uploaded](api-management-howto-ca-certificates.md) to API Management for `context.Request.Certificate.Verify()` and `context.Request.Certificate.VerifyNoRevocation()` to work.

> [!TIP]
>
> Client certificate deadlock issue described in this [article](https://techcommunity.microsoft.com/t5/Networking-Blog/HTTPS-Client-Certificate-Request-freezes-when-the-Server-is/ba-p/339672) can manifest itself in several ways. For example, you might see requests freeze, requests result in `403 Forbidden` status code after timing out, or `context.Request.Certificate` is `null`. This problem usually affects `POST` and `PUT` requests with content length of approximately 60KB or larger.
>
> To prevent this issue from occurring, turn on **Negotiate client certificate** setting for desired hostnames for **Custom domains** as shown previously in this article. This feature isn't available in the Consumption tier.

## Related content

- [Secure backend services in Azure API Management](./api-management-howto-mutual-certificates.md)
- [How to add a custom CA certificate in Azure API Management](./api-management-howto-ca-certificates.md)
- [Policies in Azure API Management](api-management-howto-policies.md)
