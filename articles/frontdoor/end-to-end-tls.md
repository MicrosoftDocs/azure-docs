---
title: 'End-to-end TLS with Azure Front Door'
description: Learn about end-to-end TLS encryption when using Azure Front Door.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: article
ms.workload: infrastructure-services
ms.date: 03/14/2022
ms.author: duau
---

# End-to-end TLS with Azure Front Door

Transport Layer Security (TLS), previously known as Secure Sockets Layer (SSL), is the standard security technology for establishing an encrypted link between a web server and a browser. This link ensures that all data passed between the web server and the web browser remain private and encrypted.

To meet your security or compliance requirements, Azure Front Door (AFD) supports end-to-end TLS encryption. Front Door TLS/SSL offload terminates the TLS connection, decrypts the traffic at the Azure Front Door, and re-encrypts the traffic before forwarding it to the backend. Since connections to the backend happen over the public IP, it is highly recommended you configure HTTPS as the forwarding protocol on your Azure Front Door to enforce end-to-end TLS encryption from the client to the backend. TLS/SSL offload is also supported if you deploy a private backend with AFD Premium using the [PrivateLink](private-link.md) feature.

## End-to-end TLS encryption

End-to-end TLS allows you to secure sensitive data while in transit to the backend while benefiting from Azure Front Door features like global load balancing and caching. Some of the features also include URL-based routing, TCP split, caching on edge location closest to the clients, and customizing HTTP requests at the edge.

Azure Front Door offloads the TLS sessions at the edge and decrypts client requests. It then applies the configured routing rules to route the requests to the appropriate backend in the backend pool. Azure Front Door then starts a new TLS connection to the backend and re-encrypts all data using the backend’s certificate before transmitting the request to the backend. Any response from the backend is encrypted through the same process back to the end user. You can configure your Azure Front Door to use HTTPS as the forwarding protocol to enable end-to-end TLS.

## Supported TLS versions

Azure Front Door supports three versions of the TLS protocol: TLS versions 1.0, 1.1, and 1.2. All Azure Front Door profiles created after September 2019 use TLS 1.2 as the default minimum, but TLS 1.0 and TLS 1.1 are still supported for backward compatibility.

Although Azure Front Door supports TLS 1.2, which introduced client/mutual authentication in RFC 5246, currently, Azure Front Door doesn't support client/mutual authentication.

You can configure the minimum TLS version in Azure Front Door in the custom domain HTTPS settings using the Azure portal or the [Azure REST API](/rest/api/frontdoorservice/frontdoor/frontdoors/createorupdate#minimumtlsversion). Currently, you can choose between 1.0 and 1.2. As such, specifying TLS 1.2 as the minimum version controls the minimum acceptable TLS version Azure Front Door will accept from a client. When Azure Front Door initiates TLS traffic to the backend, it will attempt to negotiate the best TLS version that the backend can reliably and consistently accept.

## Supported certificates

When you create your TLS/SSL certificate, you must create a complete certificate chain with an allowed Certificate Authority (CA) that is part of the [Microsoft Trusted CA List](https://ccadb-public.secure.force.com/microsoft/IncludedCACertificateReportForMSFT). If you use a non-allowed CA, your request will be rejected.

Certificates from internal CAs or self-signed certificates aren't allowed.

## Online Certificate Status Protocol (OCSP) stapling

OCSP stapling is supported by default in Azure Front Door and no configuration is required.

## Backend TLS connection (Azure Front Door to backend)

For HTTPS connections, Azure Front Door expects that your backend presents a certificate from a valid Certificate Authority (CA) with subject name(s) matching the backend *hostname*. As an example, if your backend hostname is set to `myapp-centralus.contosonews.net` and the certificate that your backend presents during the TLS handshake doesn't have `myapp-centralus.contosonews.net` or `*.contosonews.net` in the subject name, then Azure Front Door will refuse the connection and as a result an error.

> [!NOTE]
> The certificate must have a complete certificate chain with leaf and intermediate certificates. The root CA must be part of the [Microsoft Trusted CA List](https://ccadb-public.secure.force.com/microsoft/IncludedCACertificateReportForMSFT). If a certificate without complete chain is presented, the requests which involve that certificate are not guaranteed to work as expected.

From a security standpoint, Microsoft doesn't recommend disabling certificate subject name check. In certain use cases such as for testing, as a work-around to resolve failing HTTPS connection, you can disable certificate subject name check for your Azure Front Door. Note that the origin still needs to present a certificate with a valid trusted chain, but doesn't have to match the origin host name. The option to disable this feature is different for each Azure Front Door tier:

* Azure Front Door Standard and Premium - it is present in the origin settings.
* Azure Front Door (classic) - it is present under the Azure Front Door settings in the Azure portal and in the Backend PoolsSettings in the Azure Front Door API.

## Frontend TLS connection (Client to Front Door)

To enable the HTTPS protocol for secure delivery of contents on an Azure Front Door custom domain, you can choose to use a certificate that is managed by Azure Front Door or use your own certificate.  

* Azure Front Door managed certificate provides a standard TLS/SSL certificate via DigiCert and is stored in Azure Front Door's Key Vault.   

* If you choose to use your own certificate, you can onboard a certificate from a supported CA that can be a standard TLS, extended validation certificate, or even a wildcard certificate.  

* Self-signed certificates aren't supported. Learn [how to enable HTTPS for a custom domain](front-door-custom-domain-https.md).

### Certificate autorotation

For the Azure Front Door managed certificate option, the certificates are managed and auto-rotates within 90 days of expiry time by Azure Front Door. For the Azure Front Door Standard/Premium managed certificate option, the certificates are managed and auto-rotates within 45 days of expiry time by Azure Front Door. If you're using an Azure Front Door managed certificate and see that the certificate expiry date is less than 60 days away or 30 days for the Standard/Premium SKU, file a support ticket. 

For your own custom TLS/SSL certificate:

1. You set the secret version to 'Latest' for the certificate to be automatically rotated to the latest version when a newer version of the certificate is available in your key vault. For custom certificates, the certificate gets auto-rotated within 1-2 days with a newer version of certificate, no matter what the certificate expired time is.

1. If a specific version is selected, autorotation isn’t supported. You've will have to reselect the new version manually to rotate certificate. It takes up to 24 hours for the new version of the certificate/secret to be deployed.

    You'll need to ensure that the service principal for Front Door has access to the key vault. Refer to how to grant access to your key vault. The updated certificate rollout operation by Azure Front Door won't cause any production down time provided the subject name or subject alternate name (SAN) for the certificate didn't changed.

## Supported cipher suites

For TLS1.2 the following cipher suites are supported:

* TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
* TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
* TLS_DHE_RSA_WITH_AES_256_GCM_SHA384
* TLS_DHE_RSA_WITH_AES_128_GCM_SHA256

> [!NOTE]
> For Windows 10 and later versions, we recommend enabling one or both of the ECDHE cipher suites for better security. Windows 8.1, 8, and 7 aren't compatible with these ECDHE cipher suites. The DHE cipher suites have been provided for compatibility with those operating systems.

Using custom domains with TLS1.0/1.1 enabled the following cipher suites are supported:

* TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
* TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
* TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
* TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
* TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256
* TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384
* TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256
* TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384
* TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA
* TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA
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

Azure Front Door doesn’t support configuring specific cipher suites. You can get your own custom TLS/SSL certificate from your Certificate Authority (For example: Verisign, Entrust, or DigiCert). Then have specific cipher suites marked on the certificate when you generate it. 

## Next steps

* [Configure a custom domain](front-door-custom-domain.md) for Azure Front Door.
* [Enable HTTPS for a custom domain](front-door-custom-domain-https.md).
