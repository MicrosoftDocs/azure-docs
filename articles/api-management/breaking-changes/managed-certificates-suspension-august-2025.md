---
title: Azure API Management - Managed certificates suspension for custom domains (August 2025)
description: Azure API Management is temporarily suspending creation of managed certificates for custom domains from August 15, 2025 to March 15, 2026 due to industry-wide changes in domain validation.
services: api-management
author: dlepow
ms.service: azure-api-management
ms.topic: reference
ai-usage: ai-assisted
ms.date: 02/06/2026
ms.author: danlep
---

# Creation of managed certificates temporarily suspended for custom domains (August 2025 - March 2026)

[!INCLUDE [premium-dev-standard-basic.md](../../../includes/api-management-availability-premium-dev-standard-basic.md)]

Creation of Azure-managed certificates for custom domains in API Management will be temporarily turned off from August 15, 2025 to March 15, 2026. Existing managed certificates will be autorenewed as long as your API Management service allows inbound traffic from DigiCert IP addresses on port 80 and DNS is properly configured.

In the classic service tiers, Azure API Management offers [free, managed TLS certificates for custom domains](../configure-custom-domain.md#domain-certificate-options) (preview), allowing customers to secure their endpoints without purchasing and managing their own certificates. Because of an industry-wide deprecation of CNAME-based Domain Control Validation (DCV), our Certificate Authority (CA), DigiCert, is moving to a new open-source software (OSS) domain control validation (DCV) platform that provides transparency and accountability increasing the trustworthiness of domain validation. As part of this transition, DigiCert will deprecate support for the legacy CNAME Delegation DCV workflow. This migration requires us to temporarily suspend the creation of managed certificates for custom domains.

Note that this does not impact the standard CNAME DCV workflow (where DigiCert validates a random value in the CNAME record) which is still supported in the OSS validation system. This change affects several Azure services that currently rely on the soon-to-be deprecated CNAME for automated certificate issuance and renewal.

## Is my service affected by this?

You're affected if you plan to create new managed certificates for custom domains in Azure API Management between August 15, 2025 and March 15, 2026. 

As part of this change, starting January 2026, for Azure API Management to be able to renew (rotate) your existing managed certificate, inbound access is required on port 80 to allow [specific DigiCert IP addresses](https://knowledge.digicert.com/alerts/ip-address-domain-validation?utm_medium=organic&utm_source=docs-digicert&referrer=https://docs.digicert.com/en/certcentral/manage-certificates/domain-control-validation-methods/automatic-domain-control-validation-check.html). 

## What is the deadline for the change?

The suspension of managed certificates for custom domains will be enforced from August 15, 2025 to March 15, 2026. The capability to create managed certificates will resume after the migration to the new validation platform is complete.

## What do I need to do?

If you need to add new managed certificates, plan to do so before August 15, 2025 or after March 15, 2026. During the suspension period, you can still configure custom domains with certificates you manage from other sources.

If you already have managed certificates for your custom domains, do the following to ensure continued access:

1. Ensure that your API Management service [allows inbound traffic from DigiCert IP addresses on port 80](#step-1-allow-access-to-digicert-ip-addresses). This access is now required for the certificate autorenewal process.
1. [Configure DNS records](#step-2-configure-dns-records) to resolve your custom domain name.
1. [Allow API Management service access to port 80](#step-3-allow-api-management-service-access-to-port-80) if you have inbound network restrictions in place.

### Step 1: Allow access to DigiCert IP addresses

[!INCLUDE [api-management-managed-certificate-ip-access.md](../../../includes/api-management-managed-certificate-ip-access.md)]

### Step 2: Configure DNS records

Configure DNS records for your custom domain to point to your API Management gateway. The type of DNS record you need to add depends on your API Management tier.

#### DNS records for Developer, Basic, Standard, or Premium tier

1. Add either a [CNAME](/azure/api-management/configure-custom-domain?tabs=custom#cname-record) or A-record with your DNS provider. 

1. Add DigiCert as an authorized certificate authority (CA) in Azure DNS. For this, create a specific CAA record set within your domain's DNS zone using the Azure portal or other management tools.

#### DNS records for Consumption tier

1. Add either a [CNAME](/azure/api-management/configure-custom-domain?tabs=custom#cname-record) or [TXT](/azure/api-management/configure-custom-domain?tabs=managed#txt-record) record with your DNS provider. If you configure both, the TXT record takes precedence.
1. Add DigiCert as an authorized certificate authority (CA) in Azure DNS. For this, you need to create a specific CAA record set within your domain's DNS zone using the Azure portal or other management tools

### Step 3: Allow API Management service access to port 80

If you have inbound network restrictions configured for your API Management service, allow the Azure API Management resource provider access on port 80. This is required to allow inbound traffic to support certificate revocation list (CRL) checks, certificate renewal, and management communication. 

1. In the Azure portal, go to **Network security groups**.
1. Select the network security group associated with your API Management subnet.
1. Under **Settings** > **Inbound security rules**, add a new rule allowing traffic on port 80 from the **ApiManagement** service tag to the API Management instance.

## Help and support

If you have questions, get answers from community experts in [Microsoft Q&A](https://aka.ms/apim/azureqa/change/captcha-2022). If you have a support plan and need technical help, create a [support request](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/~/overview).

## Related content

See all [upcoming breaking changes and feature retirements](overview.md).
