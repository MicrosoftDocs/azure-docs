---
ROBOTS: NOINDEX
title: Azure CDN Standard from Microsoft (classic) retirement FAQ
titleSuffix:  Azure CDN Standard from Microsoft
description: Common questions about the retirement of Azure CDN Standard from Microsoft (classic).
services: front-door
author: halkazwini
ms.author: halkazwini
ms.service: azure-content-delivery-network
ms.topic: faq
ms.date: 03/31/2026
ms.custom: ai-usage
# Customer intent: As a cloud service user, I want to transition from Azure CDN Standard (classic) to Azure Front Door Standard or Premium, so that I can take advantage of improved features, enhanced security, and maintain support before the retirement of the legacy service on September 30, 2027.
---

# Azure CDN Standard from Microsoft (classic) retirement FAQ

**Applies to:** :heavy_check_mark: CDN Standard from Microsoft (classic)

On March 29, 2022, Azure Front Door introduced two new tiers named Standard and Premium. These tiers offer improvements over the current product offerings of Azure CDN Standard from Microsoft (classic). They incorporate capabilities such as Azure Private Link integration, bot management, advanced Web Application Firewall (WAF) enhancements with DRS 2.1, anomaly scoring-based detection and bot management, out-of-the-box reports and enhanced diagnostic logs, a simplified pricing model, and much more.

[!INCLUDE [Azure Front Door (classic) retirement notice](../../includes/cdn-classic-retirement.md)]

> [!NOTE]
> If you migrate to Azure Front Door Standard or Premium after your managed certificates expire, the certificates change to *Pending Revalidation* state or start to rotate after one to two days. Alternatively, rotate the Front Door Standard and Premium managed certificates by refreshing the validation token using either **[PowerShell](/powershell/module/az.cdn/update-azfrontdoorcdncustomdomainvalidationtoken)** or **[CLI](/cli/azure/afd/custom-domain#az-afd-custom-domain-regenerate-validation-token)**. After adding the new TXT record token to your DNS zone, the custom domain is revalidated and a new certificate is deployed.

## Frequently asked questions

### When is the retirement date for Azure CDN Standard from Microsoft (classic)?

Azure CDN Standard from Microsoft (classic) retires on September 30, 2027. 

### Why is Azure CDN Standard from Microsoft (classic) being retired?

Azure CDN Standard from Microsoft (classic) is a legacy Content Delivery Network service that provides static caching capabilities. In March 2022, Microsoft announced the general availability of Azure Front Door Standard and Premium. These new tiers serve as a modern Content Delivery Network platform that supports both dynamic and static scenarios with enhanced Web Application Firewall capabilities, Private Link integration, simplified pricing model, and many more enhancements. As part of Microsoft's plans to offer the best product experience and simplify the product portfolio, Microsoft is retiring the Azure CDN Standard from Microsoft (classic) tier.

### What advantages does migrating to Azure Front Door Standard or Premium tier offer?

Azure Front Door Standard and Premium tiers are enhanced versions of Azure CDN Standard from Microsoft (classic). They maintain the same service level agreement (SLA) and offer more benefits, including:

* A unified static and dynamic delivery platform, with a simplified cost model. 
* Enhanced security features, such as [Private Link integration](../frontdoor/private-link.md), advanced WAF enhancements with DRS 2.1, anomaly scoring based detection and bot management, and many more to come. 
* Deep integration with Azure services to deliver secure, accelerated, and user friendly end-to-end cloud solutions. These integrations include:
    * DNS deterministic name library integrations to prevent subdomain take over
    * [Prevalidated domain integration with PaaS service with  one-time domain validation](../frontdoor/standard-premium/how-to-add-custom-domain.md#associate-the-custom-domain-with-your-azure-front-door-endpoint).
    * [One-click enablement on Static Web Apps](../static-web-apps/front-door-manual.md)
    * Use [managed identities](../frontdoor/managed-identity.md) to access Azure Key Vault certificates
    * Azure Advisor integration to provide best practice recommendations
* Improved capabilities such as simplified, more flexible [rules engine](../frontdoor/front-door-rules-engine.md) with regular expressions and server variables, enhanced and richer [analytics](../frontdoor/standard-premium/how-to-reports.md) and [logging](../frontdoor/front-door-diagnostics.md) capabilities, and more. 
* The ability to update separate resources without updating the whole Azure Front Door instance through DevOps tools.
* Access to all future features and updates on Azure Front Door Standard and Premium tier.

For more information about supported features, see [comparison between Azure Front Door and Azure CDN services](../frontdoor/front-door-cdn-comparison.md).

### How does the performance of the Azure Front Door Standard or Premium tier compare to that of Azure CDN Standard from Microsoft (classic)?

Azure Front Door Standard and Premium tiers have the same service level agreement (SLA). Microsoft aims to ensure Azure Front Door Standard and Premium delivers optimal performance and reliability.

### What happens after September 30, 2027 when the service is retired?

After the service is retired, you lose the ability to:
* Create or manage Azure CDN Standard from Microsoft (classic) resources.
* Access the data through the Azure portal or the APIs/SDKs/client tools.
* Receive service updates to Azure CDN Standard from Microsoft (classic) or APIs/SDKs/Client tools.
* Receive support for issues on Azure CDN Standard from Microsoft (classic) through phone, email, or web.

### How can I complete the migration without causing downtime to my applications? Where can I learn more about the migration to Azure Front Door Standard or Premium?

Microsoft offers a zero-downtime migration tool. The following resources can help you understand and perform the migration process:

* Familiarize yourself with the [zero-downtime migration tool](tier-migration.md). Pay attention to the **Breaking changes when migrating to Standard or Premium tier** and **resource mapping** sections.
* Learn the process of migrating from Azure CDN Standard from Microsoft (classic) to Standard or Premium tier by using the [Azure portal](migrate-tier.md).

### How does migrating to Azure Front Door Standard or Premium affect the total cost of ownership (TCO)?

For more information, see the [pricing comparison](../frontdoor/compare-cdn-front-door-price.md) between Azure Front Door tiers.

### Which clouds does Azure CDN Standard from Microsoft (classic) retirement apply to?

Currently, Azure CDN Standard from Microsoft (classic) retirement affects the public cloud and Azure Government in the regions of Arizona and Texas.

### Can I make updates to Azure CDN Standard from Microsoft (classic) resources?

You can still update your existing Azure CDN Standard from Microsoft (classic) resources by using the Azure portal, Terraform, and all command line tools until September 30, 2027. Starting August 15, 2025, Azure CDN from Microsoft (classic) no longer supports new resource creation, new domain onboarding, or managed certificates. Migrate to Azure Front Door Standard or Premium tier as soon as possible. 

### Can I roll back to Azure CDN Standard from Microsoft (classic) after migration?

No, once migration is completed successfully, you can't roll back to classic. If you encounter any problems, raise a support ticket for assistance.

### How are Azure CDN Standard from Microsoft (classic) resources handled after migration?

Delete the Azure CDN Standard from Microsoft (classic) resource once migration successfully completes. Azure Front Door sends notification through Azure Advisor to remind users to delete the migrated classic resources.

### What resources are available for support and feedback?

If you have a support plan and need technical assistance, create a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) with the following information:

* *Issue type*, select **Technical**. 
* *Subscription*, select the subscription you need assistance with. 
* *Service*, select **My services**, and then select **Azure CDN**. 
* *Resource*, select the **Azure CDN resource**.
* *Summary*, describe the problem you're experiencing with the migration.
* *Problem type*, select **Migrating Microsoft CDN to Front Door Standard or Premium**.

## Next steps

- Migrate from Azure CDN Standard from Microsoft (classic) to Standard or Premium tier by using the [Azure portal](migrate-tier.md).
