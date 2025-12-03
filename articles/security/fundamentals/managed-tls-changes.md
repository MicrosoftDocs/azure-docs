---
title: Changes to the Managed TLS Feature
description: Learn about changes to the Azure managed TLS solution and domain control validation process.
services: security
ms.service: security
ms.subservice: security-fundamentals
ms.topic: concept-article
ms.date: 08/26/2025

ms.author: sarahlipsey
author: shlipsey3
manager: pmwongera
ms.reviewer: quentinb
---

# Changes to the managed TLS feature

Microsoft Azure offers a comprehensive managed TLS solution integrated with several Microsoft services. This capability includes managed TLS server certificates for customer vanity domains, provided by DigiCert.

As a result of evolving industry compliance standards, security requirements, and PKI lifecycle changes, this offering will undergo several major updates in 2025 and 2026 that will impact customers utilizing this feature.

## PKI updates

Starting in late 2025, Azure began updating its managed TLS solution to align with upcoming browser requirements. These changes affect all managed TLS certificates issued for the following Azure services:

- Azure Front Door (AFD) and CDN Classic
- Azure Front Door Standard/Premium SKU
- Azure API Management
- Azure App Service
- Azure Container Apps
- Azure Static Web Apps

## Key Changes

This update includes two key changes:

- **New Root and Subordinate Certificate Authorities (CAs)**:
    - All managed TLS certificates will migrate from Certificate Authorities (CAs) under *DigiCert Global Root CA* to CAs under *DigiCert Global Root G2* and *DigiCert Global Root G3*.
    This transition ensures compliance with browser trusted root program requirements.

- **Removal of Client Authentication EKU**
    - These new CAs will not support client authentication in accordance with browser trusted root program requirements.
    All managed TLS certificates under the new CAs will only include the Server Authentication Extended Key Usage (EKU).

## Potential Customer impact

To prepare for the change, it's important to know how the changes could potentially affect customers.

- **Certificate Pinning**
    - If you pin certificates or public keys, you must update your pin sets to include the new roots and intermediates.
    - Static pinning is strongly discouraged due to operational risk.

- **Client Authentication**
    - If your application relies on the Client Authentication EKU in public certificates, you must update your configuration to use certificates from other CAs.
    - Managed TLS certificates will only support the Server Authentication EKU.

## Domain validation

Starting in late 2025, DigiCert is transitioning to a new open-source software (OSS) domain control validation (DCV) platform designed to enhance transparency and accountability in domain validation processes. DigiCert will no longer support the legacy CNAME Delegation DCV workflow for domain control validation in the specified Azure services.

Consequently, these Azure services will be introducing an enhanced domain control validation process, aiming to significantly expedite domain validation and address key vulnerabilities in the user experience.

This change doesn't impact the standard CNAME DCV process for DigiCert customers, where validation uses a random value in the CNAME record. Only this one workflow for validation previously used by Microsoft is being retired.

> [!WARNING]
> Customers who haven't updated their configurations to comply with the managed TLS changes will have a service outage if they don't update the configuration.
>
> - An outage is *guaranteed* to occur when the current certificate expires.
> - An outage *could* occur if the certificate is revoked.
>
> In the event of a revocation, certificates must be revoked within 24 hours, as mandated by the [CA/Browser Forum Baseline Requirements](https://cabforum.org/), leaving very little time to respond. Customers should update their configurations with urgency to avoid disruption.

## Frequently asked questions

### Q: Is support for custom domains being retired?

No. The feature is very much supported and in fact is receiving several key updates that improve the overall user experience.

> [!NOTE]
> AFD classic and CDN Classic SKUs, which are on the path to deprecation, are retiring support for adding new custom domains. For more information, see [Azure Front Door (classic) and Azure CDN from Microsoft Classic SKU ending CNAME based domain validation and new domain/profile creations by August 15, 2025](https://azure.microsoft.com/updates?id=498522). Customers are recommended to use managed TLS certificates with AFD Standard and Premium SKUs for new custom domains.

### Q: What is domain control validation?

Domain Control Validation (DCV) is a critical process used to verify that an entity requesting a TLS/SSL certificate has legitimate control over the domain(s) listed in the certificate.

### Q: Is DigiCert retiring CNAME domain control validation?

No. Only this specific CNAME validation method unique to Azure services is being retired. The CNAME DCV method used by DigiCert customers, such as the one described for DigiCert [OV/EV certificates](https://docs.digicert.com/en/certcentral/manage-certificates/supported-dcv-methods-for-validating-the-domains-on-ov-ev-tls-ssl-certificate-orders/use-the-dns-cname-validation-method-to-verify-domain-control.html) and [DV certificates](https://docs.digicert.com/en/certcentral/manage-certificates/dv-certificate-enrollment/domain-control-validation--dcv--methods/use-the-dns-cname-dcv-method.html) isn't impacted. 

Only Azure is impacted by this change.

### Q: Why is Microsoft migrating to the DigiCert Global Root G2 and G3 roots?

This change aligns with industry standards and upcoming browser requirements. On April 15, 2026, Mozilla and Chrome will distrust the *DigiCert Global Root CA*. To maintain trust, all managed TLS certificates will move to *DigiCert Global Root G2* and *DigiCert Global Root G3* before this date. For more information, see [DigiCert root and intermediate CA certificate updates 2023](https://knowledge.digicert.com/general-information/digicert-root-and-intermediate-ca-certificate-updates-2023).

### Q: Why is the Client Authentication EKU being removed?

This is an industry-wide change driven by the Chrome Trusted Root Program. Chrome is restricting TLS certificates to server authentication to improve security and compliance. For more information, see [Sunsetting the client authentication EKU from DigiCert public TLS certificates](https://knowledge.digicert.com/alerts/sunsetting-client-authentication-eku-from-digicert-public-tls-certificates).
