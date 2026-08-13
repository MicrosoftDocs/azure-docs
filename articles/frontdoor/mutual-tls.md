---
title: Mutual TLS authentication (Preview)
titleSuffix: Azure Front Door
description: Learn how to implement and configure mutual TLS authentication in Azure Front Door Premium to verify client identity, validate certificates, and secure bidirectional communication between clients and origins.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 08/11/2026
---

# Mutual TLS authentication in Azure Front Door (preview)

**Applies to:** :heavy_check_mark: Front Door Premium

> [!IMPORTANT]
> Mutual TLS in Azure Front Door is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Mutual TLS authentication, or client authentication, ensures that the traffic is secure and trusted in both directions between a client and server. By using mutual TLS, you can configure Azure Front Door to verify client identity by presenting a valid client certificate. Mutual TLS authentication is useful for scenarios where you need to securely identify and manage the clients to target resources, such as business-to-business (B2B) applications, Internet of Things (IoT) applications, banking apps, VPNs, enterprise networks, and more.

You can use mutual TLS along with other authorizations and authentication methods supported by Azure Front Door.

> [!NOTE]
> Azure Front Door Premium supports mutual TLS.

## Mutual TLS validation modes

- **Disable mTLS**: client certificate and validations aren't required. This option is the default.

- **Enable mTLS:**

  - **Client certificate required and validated:** Client certificate is mandatory. Azure Front Door does the full validation, including checking client certificate presence, validity, and check against revocation and Root CA chain, and SAN/CN list. Azure Front Door forwards the request with header `X-Azure-ClientCertificate` to the origin. This option is the default scenario when mTLS is enabled.

  - **Client certificate required but not validated:** Client certificate is mandatory. Azure Front Door doesn't perform any other validations. Azure Front Door drops requests that don't contain certificates. The origin must perform all validations. By default, Azure Front Door passes through the certificate to the backend via headers in this mode.

    - **Client certificate validation if presented:** Client certificate isn't mandatory. Azure Front Door conducts full validation when a client certificate is present and forwards the client certificate to the origin via `X-Azure-ClientCertificate` header. If the client doesn't present a client certificate, Azure Front Door passes through the request to the origin for further validation.

  - **mTLS passthrough to origin:** Client certificate isn't required. Azure Front Door doesn't perform any validations. The origin must perform all validations.

## Client authentication validation

When you configure Azure Front Door to validate the client certificate, it checks the following information:

- Current date is less than certificate `Not After` date.

- Current date is greater than or equal to certificate `Not Before` date.

- Certificate Extended Key Usage isn't present, or if present, contains the client authentication OID.

- Validity and integrity that the certificate hasn't been altered the format of the certificate.

- Check the certificate chain, if the client certificate is issued by a trusted issuer for the specified domain, CN (certificate name) of the certifications form an unbroken chain.

You can also configure optional validations, such as:

- Validate SAN/CN extension of the client certificate against the Allowed SAN list uploaded to Azure Front Door. Azure Front Door custom domain hostname must be explicitly included in this list to be considered valid for mutual TLS validation. SAN is validated first, if no match or SAN is empty, then CN is validated. If one of SAN or CN matches the allowed SAN list configured on Azure Front Door, the validation succeeds.

- Check revocation status of the client certificate by using OCSP (Online Certificate Status Protocol).

> [!NOTE]
> Wildcard domain isn't supported on Azure Front Door Allowed Domain list. If the client certificate has wildcard domain in their SAN/CN, one level of subdomain in the Azure Front Door allowed list is a match, the validation succeeds.

## Certificate revocation check

Azure Front Door supports validation against the certificate revocation status. By default, it's enabled. During validation, Azure Front Door looks up the certificate presented by the client by using the defined OCSP responder in its Authority Information Access (AIA) extension. If the client certificate is revoked, Azure Front Door responds to the client with an HTTP 403 status code and reason. If the certificate is valid, Azure Front Door continues to process the request.

## Does mTLS support public and private certificates?

Azure Front Door currently supports certificates issued by both well-known public certificate authorities and privately established certificate authorities.

- **CA certificates issued from well-known certificate authorities:** Trusted certificate stores commonly include intermediate and root certificates, which enable trusted connections with little to no extra configuration on the device.

- **CA certificates issued from organization established certificate authorities:** Your organization typically issues these certificates privately, and other entities don't trust them. You must import intermediate and root certificates into trusted certificate stores for clients to establish chain trust.

However, Azure Front Door performs Extended Key Usage (EKU) checks on client certificates to ensure they're intended for client authentication. Due to industry changes, public certificate authorities (CAs) soon stop issuing client authentication certificates with the required EKU.

Transition to using private CAs, which can continue to issue certificates with the correct EKU, for mTLS scenarios on Azure Front Door. This transition ensures uninterrupted and secure client authentication.

## Important design considerations before implementing mTLS on Front Door domains

- Enable mTLS on new domains and new endpoints to avoid unnecessary downtime.

- When you enable mTLS, you can't enable caching on routes or rules engine route overrides with caching. This restriction prevents returning cached content to unauthenticated clients.

- mTLS works on domain functionally. However, to ensure security where malicious users can't bypass mTLS to reach your origin, there's an mTLS control on Azure Front Door endpoint. Before enabling mTLS on a custom domain, first enable mTLS on the Azure Front Door endpoint to which the custom domain will be associated. All domains with mTLS can only be associated with routes under such endpoints. You can't associate domains with mixed state of mutual authentication to the same endpoint.

- You can't associate the Azure Front Door endpoint domain with routes when mTLS is enabled on the Front Door endpoint. Vice versa, you need to disassociate the endpoint domain from all the routes under the endpoint before enabling mTLS on the endpoint.

- There's downtime if you turn on mTLS on an existing Azure Front Door domain as you need to make the following changes. *Enable mTLS to new custom domains.*

1. Create a new endpoint with mTLS enabled or use any existing Azure Front Door endpoint with mTLS enabled.

1. Disassociate the custom domain from the existing routes and endpoint that doesn't have mTLS enabled.

1. Then reassociate the custom domain to the endpoint.

- Once mutual authentication is enabled on a domain, disabling it also causes downtime.

  1. Disassociate the custom domain from all routes under the existing mTLS enabled endpoint.

  1. Disable mTLS on the domain.

  1. Reassociate the domain to another endpoint without mTLS enabled.

- Add access control to your origin to validate the request is coming from a valid Front Door. For more information, see [Secure traffic to Azure Front Door origins](origin-security.md?pivots=front-door-standard-premium).

- CA Certificate Management: Upload a root and up to three intermediates (PEM, <25 KB) through Azure Key Vault. No autorotation, but dual CA support enables seamless rollover.

- Azure Front Door performs Extended Key Usage (EKU) checks on client certificates to ensure they're intended for client authentication, which is an important security measure. However, due to industry changes, public Certificate Authorities (CAs) will soon stop issuing client authentication certificates with the required EKU. Transition to using private CAs, which can continue to issue certificates with the correct EKU for mTLS scenarios on Azure Front Door, ensuring uninterrupted and secure client authentication.

- Customers are moving away from OCSP. During Front Door certificate revocation check, Azure Front Door currently only checks OCSP.

- If the client sends requests with the following headers, Azure Front Door drops the headers and forwards the request to origin.

  - `X-Azure-ClientCertEndDate`
  - `X-Azure-ClientCertFingerprint`
  - `X-Azure-ClientCertIssuer`
  - `X-Azure-ClientCertSerial`
  - `X-Azure-ClientCertStartDate`
  - `X-Azure-ClientCertSubject`
  - `X-Azure-ClientCertVerify`
  - `X-Azure-ClientCertificate`

## What metrics and log fields does the solution expose?

The solution exposes the following metrics:

- Number of mTLS requests.

- Failed mTLS requests.

- mTLS error requests, broken down by error types, SNI hostnames, and TLS protocols.


## Configuration quota limit

- The client CA certificate chain can include a root and up to three intermediates.

- CA certificates must be PEM-encoded and under 25 KB.

- Auto-rotation isn't supported.

- You can attach two CA certificates for seamless rollover during expiry or revocation. Azure Front Door uses the valid CA certificate for validation during runtime.

### Configuration steps

1. To learn more about the limitations, see the [important design considerations](#important-design-considerations-before-implementing-mtls-on-front-door-domains) section. It's recommended to enable mTLS on new endpoint and domains.

1. Sign in to the [Azure portal](https://portal.azure.com) and search for your Front Door profile.

1. Under **Security**, select **Mutual TLS CA certificates**. You see a list of your existing mTLS certificate chains if you uploaded any in the past.

1. Select **+ Add**. You see Key Vault and Secret objects you have access to. Select the ones you want to use as public key part of mTLS handshake.  

1. Under **Settings**, select **Front Door manager**. You see the list of your endpoints.

1. Select the **+ Add an endpoint**, and check **Enforce mutual TLS**.

    > [!NOTE]
    > You can't add the Azure Front Door default domain (for example, `.z01.azurefd.net`) as a domain to the routes on this endpoint when **Enforce mutual TLS** is enabled. Go to the next step to create custom domains with mTLS enabled before creating routes.

1. Under **Settings**, select **Domains**. You see the list of your existing custom domains.

1. Select **+ Add**.

1. In **Add a domain** page, configure your domain and then scroll down to **Advanced settings** and select **Enable mutual TLS** to configure mutual TLS for the domain.

1. Select **Add** to create the domain.

    1. Mutual TLS mode: choose from the four options

       - Client certificate required and validated
       - Client certificate required but not validated
       - Client certificate validation if presented
       - mTLS passthrough to origin

    1. Select CA cert when populated for Azure Front Door to validate client certificate against.

    1. Enable Certificate Revocation Check.

    1. Add the SAN/CN list to be checked against. Azure Front Door custom domain hostname must be explicitly included in this list to be considered valid for mutual TLS validation.

1. After successful domain creation, go to the previously created endpoint under Front Door Manager, and add a route to associate this domain with the proper origin group.

1. Verify if mTLS is working as expected. You can check this condition by binding local host IP to one of the Azure Front Door IPs.

1. After successful validation, update custom domain CNMAE record in DNS to point to Azure Front Door endpoint.

    Restrict backend/origin access to only accept traffic from Azure Front Door, which prevents bypassing mTLS by accessing the origin directly. For more information, see [Secure traffic to Azure Front Door origins](origin-security.md?pivots=front-door-standard-premium).

To edit existing mTLS configuration on a domain, in the **Domains** page, select the domain name. The **Edit a domain** page appears with the current mTLS configuration.

> [!NOTE]
> Disabling mTLS on custom domain could cause downtime, as you need to disassociate the custom domain from route and endpoint, then disable mTLS on the domain. One way to mitigate the downtime is, you can route traffic back to origin while making the changes on Azure Front Door.

## Unexpected 403 (Forbidden) from Azure Front Door for mTLS request

For more diagnostic information, pass the header `X-Azure-DebugInfo:1` with the request to Azure Front Door. For the response, Front Door returns the debug header, `X-Azure-Externalerror`, with a value that suggests what the error could be. The following table lists error values and their meanings.

| Error | Description |
| --- | --- |
| ClientCertExpired | Client certificate presented for validation is expired. |
| ClientCertSelfSigned | The client certificate is self-signed, with the issuer and leaf being the same certificate. |
| ClientCertIssuerNotFound | The client certificate's issuer can't be found. |
| ClientCertTooLongChain | Client certificate chain contains more than five certificates, including leaf certificate. |
| ClientCertIncorrectPurpose | Certificate isn't intended for client authentication in EKU. |
| ClientCertRootCAUntrusted | The certificate’s root Certificate Authority isn't trusted. |
| ClientCertIssuerSubjectMismatch | The certificate was rejected because its subject name didn't match the issuer name. |
| ClientCertCNSANMismatch | CN SAN list of client certificate didn't match allowed FQDNs, specified during mTLS configuring in Azure portal. |
| ClientCertMissing | Client certificate isn't presented to Azure Front Door. |
| ClientCertRevoked | Client certificate or issuer certificate is revoked. |
| ClientHeaderTooLong | Client sent too long header with request. |
| ClientCertInvalid | Generic client certificate error. |

## Related content

- [TLS encryption with Azure Front Door](end-to-end-tls.md?pivots=front-door-standard-premium)
- [Azure Front Door TLS policy](./standard-premium/tls-policy.md)

