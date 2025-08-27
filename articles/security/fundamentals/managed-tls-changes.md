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

Azure offers a comprehensive managed TLS solution integrated with services such as Azure Front Door (AFD) and CDN Classic, Azure Front Door Standard/Premium SKU, Azure API Management, Azure App Service, Azure Container Apps, and Azure Static Web Apps. This capability includes managed TLS server certificates for customer vanity domains, provided by DigiCert.

DigiCert is transitioning to a new open-source software (OSS) domain control validation (DCV) platform designed to enhance transparency and accountability in domain validation processes. DigiCert will no longer support the legacy CNAME Delegation DCV workflow for domain control validation in the specified Azure services.

Consequently, these Azure services will be introducing an enhanced domain control validation process, aiming to significantly expedite domain validation and address key vulnerabilities in the user experience.

This change doesn't impact the standard CNAME DCV process for DigiCert customers, where validation uses a random value in the CNAME record. Only this one workflow for validation previously used by Microsoft is being retired.

> [!Warning]
> Customers who haven't updated their configurations to comply with the managed TLS changes will have a service outage if they don't update the configuration.
> - An outage is *guaranteed* to occur when the current certificate expires.
> - An outage *could* occur if the certificate is revoked.
>
> In the event of a revocation, certificates must be revoked within 24 hours, as mandated by the CA/Browser Forum Baseline Requirements, leaving very little time to respond. Customers should update their configurations with urgency to avoid disruption.

## Frequently asked questions

**Q: What is domain control validation?**

A: Domain Control Validation (DCV) is a critical process used to verify that an entity requesting a TLS/SSL certificate has legitimate control over the domain(s) listed in the certificate.

**Q: Is support for vanity domains being retired?**

A: No. The feature is very much supported and in fact is receiving several key updates that improve the overall user experience.

> [!NOTE]
> AFD classic and CDN Classic SKUs, which are on the path to deprecation, are retiring support for adding new vanity domains. For more information, see [Azure Front Door (classic) and Azure CDN from Microsoft Classic SKU ending CNAME based domain validation and new domain/profile creations by August 15, 2025](https://azure.microsoft.com/updates?id=498522). Customers are recommended to use managed certificates with AFD Standard and Premium SKUs for new vanity domains.

**Q: Is DigiCert retiring CNAME domain control validation?**

A: No. Only this specific CNAME validation method unique to Azure services is being retired. The CNAME DCV method used by DigiCert customers, such as the one described for DigiCert [OV/EV certificates](https://docs.digicert.com/en/certcentral/manage-certificates/supported-dcv-methods-for-validating-the-domains-on-ov-ev-tls-ssl-certificate-orders/use-the-dns-cname-validation-method-to-verify-domain-control.html) and [DV certificates](https://docs.digicert.com/en/certcentral/manage-certificates/dv-certificate-enrollment/domain-control-validation--dcv--methods/use-the-dns-cname-dcv-method.html) isn't impacted. Only Azure is impacted by this change.


