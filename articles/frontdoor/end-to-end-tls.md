---
title: TLS encryption
titleSuffix: Azure Front Door
description: Learn about end-to-end TLS encryption, supported TLS versions, and supported cipher suites with Azure Front Door.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 07/31/2026
zone_pivot_groups: front-door-tiers
---

# TLS encryption with Azure Front Door

Transport Layer Security (TLS), previously known as Secure Sockets Layer (SSL), is the standard security technology for establishing an encrypted link between a web server and a client, like a web browser. This link ensures that all data passed between the server and the client remains private and encrypted.

To meet your security or compliance requirements, Azure Front Door supports end-to-end TLS encryption. Front Door TLS/SSL offload terminates the TLS connection, decrypts the traffic at the Azure Front Door, and re-encrypts the traffic before forwarding it to the origin. When connections to the origin use the origin's public IP address, it's a good security practice to configure HTTPS as the forwarding protocol on your Azure Front Door. By using HTTPS as the forwarding protocol, you can enforce end-to-end TLS encryption for the entire processing of the request from the client to the origin. TLS/SSL offload is also supported if you deploy a private origin with Azure Front Door Premium using the [Private Link](private-link.md) feature.

::: zone pivot="front-door-standard-premium"

This article explains how Azure Front Door works with TLS connections. For more information about how to use TLS certificates with your own custom domains, see [HTTPS for custom domains](domain.md#https-for-custom-domains). To learn how to configure a TLS certificate on your own custom domain, see [Configure a custom domain on Azure Front Door using the Azure portal](standard-premium/how-to-add-custom-domain.md).

::: zone-end

## End-to-end TLS encryption

End-to-end TLS encryption secures sensitive data while in transit to the origin and enables you to benefit from Azure Front Door features like global load balancing and caching. Some of the features also include URL-based routing, TCP split, caching on edge location closest to the clients, and customizing HTTP requests at the edge.

Azure Front Door offloads the TLS sessions at the edge and decrypts client requests. It then applies the configured routing rules to route the requests to the appropriate origin in the origin group. Azure Front Door then starts a new TLS connection to the origin and re-encrypts all data using the origin's certificate before transmitting the request to the origin. Any response from the origin is encrypted through the same process back to the end user. You can configure your Azure Front Door to use HTTPS as the forwarding protocol to enable end-to-end TLS.

## Supported TLS versions

Azure Front Door supports two versions of the TLS protocol: TLS versions 1.2 and 1.3. All Azure Front Door profiles created after September 2019 use TLS 1.2 as the default minimum with TLS 1.3 enabled. Currently, Azure Front Door doesn't support client/mutual authentication (mTLS).

> [!IMPORTANT]
> TLS 1.0 and 1.1 aren't supported. 

For Azure Front Door Standard and Premium, you can configure a predefined TLS policy or choose the TLS cipher suite based on your organization's security needs. For more information, see [Configure an Azure Front Door TLS policy](/azure/frontdoor/tls-policy).

For Azure Front Door classic and Microsoft CDN classic, you can configure the minimum TLS version in Azure Front Door in the custom domain HTTPS settings by using the Azure portal or the [Azure REST API](/rest/api/frontdoorservice/frontdoor/frontdoors/createorupdate#minimumtlsversion). For a minimum TLS version 1.2, the negotiation process attempts to establish TLS 1.3 and then TLS 1.2. When Azure Front Door initiates TLS traffic to the origin, it attempts to negotiate the best TLS version that the origin can reliably and consistently accept. Supported TLS versions for origin connections are TLS 1.2 and TLS 1.3. If you want to customize the cipher suite, [migrate Front Door classic](/azure/frontdoor/tier-migration) and [Microsoft CDN classic](/azure/cdn/tier-migration?toc=/azure/frontdoor/TOC.json) to Azure Front Door standard and premium.

> [!NOTE]
> - Clients with TLS 1.3 enabled must support one of the Microsoft SDL compliant EC Curves, including Secp384r1, Secp256r1, and Secp521, to successfully make requests with Azure Front Door using TLS 1.3.
> - Use one of these curves as the preferred curve during requests to avoid increased TLS handshake latency, which might result from multiple round trips to negotiate the supported EC curve.

## Supported certificates

When you create your TLS/SSL certificate, you must create a complete certificate chain with an allowed Certificate Authority (CA) that is part of the [Microsoft Trusted CA List](https://ccadb.my.salesforce-sites.com/microsoft/IncludedCACertificateReportForMSFT). If you use a non-allowed CA, Azure Front Door rejects your request.

Certificates from internal CAs or self-signed certificates aren't allowed.

## Online Certificate Status Protocol (OCSP) stapling

Azure Front Door supports OCSP stapling by default and requires no configuration.

## <a name="backend-tls-connection-azure-front-door-to-origin"></a> Origin TLS connection (Azure Front Door to origin)

For HTTPS connections, Azure Front Door expects your origin to present a certificate from a valid certificate authority (CA) with a subject name that matches the origin *hostname*. For example, if you set your origin hostname to `myapp-centralus.contoso.net` but the certificate your origin presents during the TLS handshake doesn't include `myapp-centralus.contoso.net` or `*.contoso.net` in the subject name, Azure Front Door refuses the connection and the client sees an error.

> [!NOTE]
> The certificate must include a complete certificate chain with leaf and intermediate certificates. The root CA must be part of the [Microsoft Trusted CA List](https://ccadb.my.salesforce-sites.com/microsoft/IncludedCACertificateReportForMSFT). If you present a certificate without a complete chain, requests that involve that certificate might not work as expected.

In certain use cases, such as testing, you can disable certificate subject name checks for your Azure Front Door as a workaround to resolve failing HTTPS connections. The origin must still present a certificate with a valid, trusted chain, but it doesn't need to match the origin hostname.

::: zone pivot="front-door-standard-premium"

In Azure Front Door Standard and Premium, you can configure an origin to disable the certificate subject name check.

::: zone-end

::: zone pivot="front-door-classic"

In Azure Front Door (classic), you can disable the certificate subject name check by changing the Azure Front Door settings in the Azure portal. You can also configure the check by using the backend pool's settings in the Azure Front Door APIs.

::: zone-end

> [!NOTE]
> From a security standpoint, don't disable the certificate subject name check.

## Frontend TLS connection (client to Azure Front Door)

To enable the HTTPS protocol for secure delivery of content on an Azure Front Door custom domain, use either a certificate that Azure Front Door manages or your own certificate.

::: zone pivot="front-door-standard-premium"

For more information, see [HTTPS for custom domains](domain.md#https-for-custom-domains).

::: zone-end

::: zone pivot="front-door-classic"

Azure Front Door's managed certificate provides a standard TLS/SSL certificate through DigiCert and is stored in Azure Front Door's Key Vault.   

If you choose to use your own certificate, you can onboard a certificate from a supported CA that can be a standard TLS, extended validation certificate, or even a wildcard certificate. Self-signed certificates aren't supported. Learn [how to enable HTTPS for a custom domain](front-door-custom-domain-https.md).

::: zone-end

### Certificate autorotation

For the Azure Front Door Standard/Premium managed certificate option, Azure Front Door manages the certificates and automatically rotates them within 45 days of expiry. For the Azure Front Door Classic and Azure CDN Classic managed certificate option, Azure Front Door manages the certificates and automatically rotates them within 90 days of expiry. If you're using classic tiers managed certificate and see that the certificate expiry date is less than 60 days away or 30 days for the Standard/Premium tier, file a support ticket. 

> [!IMPORTANT]
> - For Azure Front Door Classic and Azure CDN Classic, managed certificates aren't supported starting August 15, 2025. To avoid service disruption, either switch to **Bring Your Own Certificate (BYOC)** or migrate to Azure Front Door Standard/Premium before this date. Existing managed certificates continue to autorenew until August 15, 2025, and remain valid until April 14, 2026. However, switch to **BYOC** or migrate to Front Door Standard/Premium before August 15, 2025, to avoid unexpected certificate revocation.
> - Azure Front Door Standard and Premium use DigiCert‑issued managed TLS certificates, and DigiCert is retiring the G1 root certificate that expires on April 14, 2026, replacing it with the G2 root certificate. Azure Front Door automatically rotates Azure Front Door-managed certificates before expiration for custom domains that directly CNAME to the Azure Front Door endpoint, and no customer action is required. Customers whose domains don't directly CNAME to Azure Front Door must manually rotate their certificates to use the DigiCert G2 root certificate before April 14, 2026 to avoid TLS connectivity issues.

For your own custom TLS/SSL certificate:

1. Set the secret version to **Latest** for the certificate to automatically rotate to the latest version when a newer version of the certificate is available in your key vault. For custom certificates, the certificate autrotates within 3-4 days with a newer version of certificate, no matter what the certificate expired time is.

1. If you select a specific version, autorotation isn't supported. You must reselect the new version manually to rotate certificate. It takes up to 24 hours for the new version of the certificate or secret to be deployed.

    > [!NOTE]
    > Azure Front Door Standard and Premium automatically rotate managed certificates only when the custom domain CNAME points directly to the Azure Front Door endpoint. For indirect CNAME configurations, use a bring‑your‑own certificate, as Azure Front Door attempts domain validation via file‑based token validation when traffic reaches Azure Front Door but successful validation isn't guaranteed.
 
    The service principal for Front Door must have access to the key vault. The updated certificate rollout operation by Azure Front Door doesn't cause any production downtime, as long as the subject name or subject alternate name (SAN) for the certificate hasn't changed.

## Supported cipher suites

For TLS 1.2 and 1.3, Azure Front Door supports the following cipher suites:

- TLS_AES_256_GCM_SHA384 (TLS 1.3 only)
- TLS_AES_128_GCM_SHA256 (TLS 1.3 only)
- TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
- TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
- TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384
- TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256

> [!NOTE]
> Azure Front Door no longer supports older TLS versions and weak ciphers.
> Support for DHE cipher suites retired on April 1, 2026. For more information, see [TLS_DHE cipher suites on Azure Front Door](diffie-hellman-ciphers.md).

Use *TLS policy* to configure specific cipher suites. Azure Front Door Standard and Premium offer two mechanisms for controlling TLS policy: you can use either a predefined policy or a custom policy per your own needs. For more information, see [Configure an Azure Front Door TLS policy](tls-policy.md).

> [!NOTE]
> For Windows 10 and later versions, enable one or both of the ECDHE_GCM cipher suites for better security. Windows 8.1, 8, and 7 aren't compatible with these ECDHE_GCM cipher suites. The ECDHE_CBC cipher suites are provided for compatibility with those operating systems. 

## Related content

::: zone pivot="front-door-standard-premium"

- [Azure Front Door TLS policy](tls-policy.md)
- [Domains in Azure Front Door](domain.md)
- [Configure a custom domain on Azure Front Door](standard-premium/how-to-add-custom-domain.md)

::: zone-end

::: zone pivot="front-door-classic"

- [Configure a custom domain for Azure Front Door (classic)](front-door-custom-domain.md) 
- [Configure HTTPS on an Azure Front Door (classic) custom domain](front-door-custom-domain-https.md)

::: zone-end
