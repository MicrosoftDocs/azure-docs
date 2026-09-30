---
title: Changes to the managed TLS feature
description: Learn about Azure managed TLS changes, certificate authority updates, domain control validation changes, and potential customer impact.
services: security
ms.service: security
ms.subservice: security-fundamentals
ms.topic: concept-article
ms.date: 07/20/2026

author: msmbaldwin
ms.author: mbaldwin
ai-usage: ai-assisted
manager: femila
ms.reviewer: quentinb
---

# Changes to the managed TLS feature

Microsoft Azure offers a comprehensive managed TLS solution integrated with several Microsoft services. This capability includes managed TLS server certificates for customer-specific domains, provided by DigiCert.

As a result of evolving industry compliance standards, security requirements, and PKI lifecycle changes, this offering is undergoing several major updates in 2025 and 2026 that affect you if you use managed TLS.

## PKI updates

Starting in late 2025, Azure began updating its managed TLS solution to align with new browser requirements. These changes affect all managed TLS certificates issued for the following Azure services:

- Azure Front Door (AFD) and CDN Classic
- Azure Front Door Standard or Premium SKU
- Azure API Management
- Azure App Service
- Azure Container Apps
- Azure Static Web Apps
- Azure Storage (Azure Blobs, Azure Files, Azure Tables, Azure Queues, Static Website, and Azure Data Lake Storage)

## Key changes

This update includes two key changes:

- **New root and subordinate certificate authorities (CAs)**:
        - All managed TLS certificates migrate from certificate authorities (CAs) under *DigiCert Global Root CA* to CAs under *DigiCert Global Root G2* and *DigiCert Global Root G3*.
    This transition ensures compliance with browser trusted root program requirements.

- **Removal of Client Authentication EKU**:
        - These new CAs don't support client authentication in accordance with browser trusted root program requirements.
    All managed TLS certificates under the new CAs include only the Server Authentication Extended Key Usage (EKU).

## Potential customer impact

To prepare for the change, review how the changes could affect you.

- **Certificate pinning**:
    - If you pin certificates or public keys, you must update your pin sets to include the new roots and intermediates.
    - Static pinning is strongly discouraged due to operational risk.

- **Client authentication**:
    - If your application relies on the Client Authentication EKU in public certificates, you must update your configuration to use certificates from other CAs.
    - Managed TLS certificates support only the Server Authentication EKU.

## Domain validation

Starting in late 2025, DigiCert is transitioning to a new open-source software (OSS) domain control validation (DCV) platform designed to improve transparency and accountability in domain validation processes. DigiCert no longer supports the legacy CNAME Delegation DCV workflow for domain control validation in the specified Azure services.

Consequently, these Azure services are introducing an enhanced domain control validation process to speed up domain validation and address key vulnerabilities in the user experience.

This change doesn't impact the standard CNAME DCV process for DigiCert customers. Validation uses a random value in the CNAME record. Microsoft is retiring only this one workflow for validation.

> [!WARNING]
> If you don't update your configurations to comply with the managed TLS changes, you have a service outage.
>
> - An outage is *guaranteed* to occur when the current certificate expires.
> - An outage *could* occur if DigiCert revokes the certificate.
>
> In the event of a revocation, certificate authorities must revoke certificates within 24 hours, as mandated by the [CA/Browser Forum Baseline Requirements](https://cabforum.org/), leaving little time to respond. Update your configurations quickly to avoid disruption.

## Frequently asked questions

### Q: Is support for custom domains retiring?

No. Azure supports the feature and is adding several key updates that improve the overall user experience.

> [!NOTE]
> AFD classic and CDN Classic SKUs, which are on the path to deprecation, are retiring support for adding new custom domains. For migration guidance, see [Migrate Azure Front Door (classic) to Standard or Premium tier](/azure/frontdoor/migrate-tier) and [Migrate from Azure CDN from Microsoft (classic) to Azure Front Door](/azure/cdn/migrate-tier). Use managed TLS certificates with AFD Standard and Premium SKUs for new custom domains.

### Q: What is domain control validation?

Domain control validation (DCV) is a critical process used to verify that an entity requesting a TLS/SSL certificate has legitimate control over the domains listed in the certificate.

### Q: Is DigiCert retiring CNAME domain control validation?

No. Azure is retiring only this specific CNAME validation method unique to Azure services. The CNAME DCV method used by DigiCert customers, such as the one described for DigiCert [OV/EV certificates](https://docs.digicert.com/en/certcentral/manage-certificates/supported-dcv-methods-for-validating-the-domains-on-ov-ev-tls-ssl-certificate-orders/use-the-dns-cname-validation-method-to-verify-domain-control.html) and [DV certificates](https://docs.digicert.com/en/certcentral/manage-certificates/dv-certificate-enrollment/domain-control-validation--dcv--methods/use-the-dns-cname-dcv-method.html) isn't affected.

This change affects only Azure.

### Q: Why is Microsoft migrating to the DigiCert Global Root G2 and G3 roots?

This change aligns with industry standards and new browser requirements. On April 15, 2026, Mozilla and Chrome will distrust the *DigiCert Global Root CA*. To maintain trust, all managed TLS certificates move to *DigiCert Global Root G2* and *DigiCert Global Root G3* before this date. For more information, see [DigiCert root and intermediate CA certificate updates 2023](https://knowledge.digicert.com/general-information/digicert-root-and-intermediate-ca-certificate-updates-2023).

### Q: Why is the Client Authentication EKU being removed?

The Chrome Trusted Root Program drives this industry-wide change. Chrome is restricting TLS certificates to server authentication to improve security and compliance. For more information, see [Sunsetting the client authentication EKU from DigiCert public TLS certificates](https://knowledge.digicert.com/alerts/sunsetting-client-authentication-eku-from-digicert-public-tls-certificates).


