---
title: Azure API Management - Managed certificates suspension for new custom domains (August 2025)
description: Azure API Management is temporarily suspending managed certificates for new custom domains from August 15, 2025 to March 15, 2026 due to industry-wide changes in domain validation.
services: api-management
author: dlepow
ms.service: azure-api-management
ms.topic: reference
ai-usage: ai-assisted
ms.date: 07/18/2025
ms.author: danlep
---

# Managed certificates suspension for new custom domains (August 2025)

[!INCLUDE [premium-dev-standard-basic.md](../../../includes/api-management-availability-premium-dev-standard-basic.md)]

Azure managed certificates for new custom domains in API Management will be temporarily turned off from August 15, 2025 to March 15, 2026. Existing managed certificates will be autorenewed and remain unaffected.

In the classic service tiers, Azure API Management offers [free, managed TLS certificates for custom domains](../configure-custom-domain.md#domain-certificate-options), allowing customers to secure their endpoints without purchasing and managing their own certificates. Because of an industry-wide deprecation of CNAME-based Domain Control Validation (DCV), our Certificate Authority (CA), DigiCert, will migrate to a new validation platform to meet Multi-Perspective Issuance Corroboration (MPIC) requirements. This migration requires a temporary suspension of managed certificates for new custom domains.

## Is my service affected by this?

You're affected if you plan to create new managed certificates for new custom domains in Azure API Management between August 15, 2025 and March 15, 2026. Existing managed certificates will be autorenewed before August 15, 2025 and will continue to function normally. There's no impact to existing managed certificates or custom domains already using them.

## What is the deadline for the change?

The suspension of managed certificates for new custom domains will be enforced from August 15, 2025 to March 15, 2026. The capability to create managed certificates will resume after the migration to the new validation platform is complete.

## What do I need to do?

No action is required if you already have managed certificates for your custom domains. If you need to add new managed certificates, plan to do so before August 15, 2025 or after March 15, 2026. During the suspension period, you can still configure custom domains with certificates you manage from other sources.

## Help and support

If you have questions, get answers from community experts in [Microsoft Q&A](https://aka.ms/apim/azureqa/change/captcha-2022). If you have a support plan and need technical help, create a [support request](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview).

## Related content

See all [upcoming breaking changes and feature retirements](overview.md).
