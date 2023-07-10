---
title: 'End-to-end TLS with Azure Front Door'
description: Learn about end-to-end TLS encryption when using Azure Front Door.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 02/07/2023
ms.author: duau
zone_pivot_groups: front-door-tiers
---

# End-to-end TLS with Azure Front Door

Transport Layer Security (TLS), previously known as Secure Sockets Layer (SSL), is the standard security technology for establishing an encrypted link between a web server and a client, like a web browser. This link ensures that all data passed between the server and the client remain private and encrypted.

To meet your security or compliance requirements, Azure Front Door supports end-to-end TLS encryption. Front Door TLS/SSL offload terminates the TLS connection, decrypts the traffic at the Azure Front Door, and re-encrypts the traffic before forwarding it to the origin. When connections to the origin use the origin's public IP address, it's a good security practice to configure HTTPS as the forwarding protocol on your Azure Front Door. By using HTTPS as the forwarding protocol, you can enforce end-to-end TLS encryption for the entire processing of the request from the client to the origin. TLS/SSL offload is also supported if you deploy a private origin with Azure Front Door Premium using the [Private Link](private-link.md) feature.

::: zone pivot="front-door-standard-premium"

This article explains how Azure Front Door works with TLS connections. For more information about how to use TLS certificates with your own custom domains, see [HTTPS for custom domains](domain.md#https-for-custom-domains). To learn how to configure a TLS certificate on your own custom domain, see [Configure a custom domain on Azure Front Door using the Azure portal](standard-premium/how-to-add-custom-domain.md).

::: zone-end

## End-to-end TLS encryption

End-to-end TLS allows you to secure sensitive data while in transit to the origin while benefiting from Azure Front Door features like global load balancing and caching. Some of the features also include URL-based routing, TCP split, caching on edge location closest to the clients, and customizing HTTP requests at the edge.

Azure Front Door offloads the TLS sessions at the edge and decrypts client requests. It then applies the configured routing rules to route the requests to the appropriate origin in the origin group. Azure Front Door then starts a new TLS connection to the origin and re-encrypts all data using the origin's certificate before transmitting the request to the origin. Any response from the origin is encrypted through the same process back to the end user. You can configure your Azure Front Door to use HTTPS as the forwarding protocol to enable end-to-end TLS.

## Supported TLS versions

Azure Front Door supports three versions of the TLS protocol: TLS versions 1.0, 1.1, and 1.2. All Azure Front Door profiles created after September 2019 use TLS 1.2 as the default minimum, but TLS 1.0 and TLS 1.1 are still supported for backward compatibility.

Although Azure Front Door supports TLS 1.2, which introduced client/mutual authentication in RFC 5246, currently, Azure Front Door doesn't support client/mutual authentication.

You can configure the minimum TLS version in Azure Front Door in the custom domain HTTPS settings using the Azure portal or the [Azure REST API](/rest/api/frontdoorservice/frontdoor/frontdoors/createorupdate#minimumtlsversion). Currently, you can choose between 1.0 and 1.2. As such, specifying TLS 1.2 as the minimum version controls the minimum acceptable TLS version Azure Front Door will accept from a client. When Azure Front Door initiates TLS traffic to the origin, it will attempt to negotiate the best TLS version that the origin can reliably and consistently accept.

## Supported certificates

When you create your TLS/SSL certificate, you must create a complete certificate chain with an allowed Certificate Authority (CA) that is part of the [Microsoft Trusted CA List](https://ccadb-public.secure.force.com/microsoft/IncludedCACertificateReportForMSFT). If you use a non-allowed CA, your request will be rejected.

Certificates from internal CAs or self-signed certificates aren't allowed.

## Online Certificate Status Protocol (OCSP) stapling

OCSP stapling is supported by default in Azure Front Door and no configuration is required.

## <a name="backend-tls-connection-azure-front-door-to-origin"></a> Origin TLS connection (Azure Front Door to origin)

For HTTPS connections, Azure Front Door expects that your origin presents a certificate from a valid certificate authority (CA) with a subject name matching the origin *hostname*. As an example, if your origin hostname is set to `myapp-centralus.contosonews.net` and the certificate that your origin presents during the TLS handshake doesn't have `myapp-centralus.contosonews.net` or `*.contosonews.net` in the subject name, then Azure Front Door refuses the connection and the client sees an error.

> [!NOTE]
> The certificate must have a complete certificate chain with leaf and intermediate certificates. The root CA must be part of the [Microsoft Trusted CA List](https://ccadb-public.secure.force.com/microsoft/IncludedCACertificateReportForMSFT). If a certificate without complete chain is presented, the requests which involve that certificate are not guaranteed to work as expected.

In certain use cases such as for testing, as a workaround to resolve failing HTTPS connection, you can disable certificate subject name check for your Azure Front Door. Note that the origin still needs to present a certificate with a valid trusted chain, but doesn't have to match the origin host name.

::: zone pivot="front-door-standard-premium"

In Azure Front Door Standard and Premium, you can configure an origin to disable the certificate subject name check.

::: zone-end

::: zone pivot="front-door-classic"

In Azure Front Door (classic), you can disable the certificate subject name check by changing the Azure Front Door settings in the Azure portal. You can also configure the check by using the backend pool's settings in the Azure Front Door APIs.

::: zone-end

> [!NOTE]
> From a security standpoint, Microsoft doesn't recommend disabling the certificate subject name check.

## Frontend TLS connection (client to Azure Front Door)

To enable the HTTPS protocol for secure delivery of contents on an Azure Front Door custom domain, you can choose to use a certificate that is managed by Azure Front Door or use your own certificate.

::: zone pivot="front-door-standard-premium"

For more information, see [HTTPS for custom domains](domain.md#https-for-custom-domains).

::: zone-end

::: zone pivot="front-door-classic"

Azure Front Door's managed certificate provides a standard TLS/SSL certificate via DigiCert and is stored in Azure Front Door's Key Vault.   

If you choose to use your own certificate, you can onboard a certificate from a supported CA that can be a standard TLS, extended validation certificate, or even a wildcard certificate. Self-signed certificates aren't supported. Learn [how to enable HTTPS for a custom domain](front-door-custom-domain-https.md).

::: zone-end

### Certificate autorotation

For the Azure Front Door managed certificate option, the certificates are managed and auto-rotates within 90 days of expiry time by Azure Front Door. For the Azure Front Door Standard/Premium managed certificate option, the certificates are managed and auto-rotates within 45 days of expiry time by Azure Front Door. If you're using an Azure Front Door managed certificate and see that the certificate expiry date is less than 60 days away or 30 days for the Standard/Premium SKU, file a support ticket. 

For your own custom TLS/SSL certificate:

1. You set the secret version to 'Latest' for the certificate to be automatically rotated to the latest version when a newer version of the certificate is available in your key vault. For custom certificates, the certificate gets auto-rotated within 3-4 days with a newer version of certificate, no matter what the certificate expired time is.

1. If a specific version is selected, autorotation isn’t supported. You've will have to reselect the new version manually to rotate certificate. It takes up to 24 hours for the new version of the certificate/secret to be deployed.

    You'll need to ensure that the service principal for Front Door has access to the key vault. Refer to how to grant access to your key vault. The updated certificate rollout operation by Azure Front Door won't cause any production downtime, as long as the subject name or subject alternate name (SAN) for the certificate hasn't changed.

## Supported cipher suites

For TLS 1.2 the following cipher suites are supported:

* TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
* TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
* TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384
* TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256
* TLS_DHE_RSA_WITH_AES_256_GCM_SHA384 
* TLS_DHE_RSA_WITH_AES_128_GCM_SHA256

> [!NOTE]
> For Windows 10 and later versions, we recommend enabling one or both of the ECDHE_GCM cipher suites for better security. Windows 8.1, 8, and 7 aren't compatible with these ECDHE_GCM cipher suites. The ECDHE_CBC and DHE cipher suites have been provided for compatibility with those operating systems. 

When using custom domains with TLS 1.0 and 1.1 enabled, the following cipher suites are supported:

* TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
* TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
* TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256
* TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384
* TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA
* TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA
* TLS_RSA_WITH_AES_256_GCM_SHA384
* TLS_RSA_WITH_AES_128_GCM_SHA256
* TLS_RSA_WITH_AES_256_CBC_SHA256
* TLS_RSA_WITH_AES_128_CBC_SHA256
* TLS_RSA_WITH_AES_256_CBC_SHA
* TLS_RSA_WITH_AES_128_CBC_SHA
* TLS_DHE_RSA_WITH_AES_128_GCM_SHA256
* TLS_DHE_RSA_WITH_AES_256_GCM_SHA384

Azure Front Door doesn’t support disabling or configuring specific cipher suites for your profile.

## Next steps

::: zone pivot="front-door-standard-premium"

* [Understand custom domains](domain.md) on Azure Front Door.
* [Configure a custom domain on Azure Front Door using the Azure portal](standard-premium/how-to-add-custom-domain.md).

::: zone-end

::: zone pivot="front-door-classic"

* [Configure a custom domain](front-door-custom-domain.md) for Azure Front Door.
* [Enable HTTPS for a custom domain](front-door-custom-domain-https.md).

::: zone-end
