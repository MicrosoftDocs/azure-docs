---
title: Azure Front Door (classic) retirement FAQ
titleSuffix:  Azure Front Door
description: Common questions about the retirement of Azure Front Door (classic).
services: front-door
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.date: 03/27/2024
ms.author: duau
ms.custom: ai-usage
---

# Azure Front Door (classic) retirement FAQ

Azure Front Door introduced two new tiers named Standard and Premium on March 29, 2022. These tiers offer improvements over the current product offerings of Azure Front Door (Classic), incorporating capabilities such as Azure Private Link integration, Bot management, advanced Web Application Firewall (WAF) enhancements with DRS 2.1, anomaly scoring-based detection and bot management, out-of-the-box reports and enhanced diagnostic logs, a simplified pricing model, and much more.

In our ongoing efforts to provide the best product experience and streamline our portfolio of products and tiers, we're announcing the retirement of the Azure Front Door (Classic) tier. This retirement will affect the public cloud and the Azure Government regions of Arizona and Texas, effective March 31, 2027. We'll communicate retirement plan of Azure Front Door classic in Azure Government regions US DoD Central and US DoD East in a future announcement. We strongly recommend all users of Azure Front Door (classic) to transition to Azure Front Door Standard and Premium.  

## Frequently asked questions

### When is the retirement for Azure Front Door (classic)?

Azure Front Door (classic) will be retired on March 31, 2027. 

### Why is Azure Front Door (classic) being retired?

Azure Front Door (classic) is a legacy service that provides dynamic site acceleration and global load balancing capabilities. In March 2022, we announced the general availability of Azure Front Door Standard and Premium. These new tiers serve as a modern Content Delivery Network platform that supports both dynamic and static scenarios with enhanced Web Application Firewall capabilities, Private Link integration, simplified pricing model and many more enhancements. As part of our plans to offer the best product experience and simplify our product portfolio, we're announcing the retirement of Azure Front Door (classic) tier.

### What advantages does migrating to Azure Front Door Standard or Premium tier offer?

Azure Front Door Standard and Premium tiers represent the enhanced versions of Azure Front Door (classic). They maintain the same Service Level Agreement (SLA) and offer more benefits, including:

* A unified static and dynamic delivery platform, with simplified cost model. 
* Enhanced security features, such as[Private Link integration](private-link.md), advanced WAF enhancements with DRS 2.1, anomaly scoring based detection and bot management, and many more to come. 
* Deep integration with Azure services to deliver secure, accelerated, and user friendly end-to-end cloud solutions. These integrations include:
    * DNS deterministic name library integrations to prevent subdomain take over
    * [Prevalidated domain integration with PaaS service with  one-time domain validation](./standard-premium/how-to-add-custom-domain.md#associate-the-custom-domain-with-your-azure-front-door-endpoint).
    * [One-click enablement on Static Web Apps](../static-web-apps/front-door-manual.md)
    * Use [managed identities](managed-identity.md) to access Azure Key Vault certificates
    * Azure Advisor integration to provide best practice recommendations
* Improved capabilities such as simplified, more flexible [rules engine](front-door-rules-engine.md) with regular expressions and server variables, enhanced and richer [analytics](./standard-premium/how-to-reports.md) and [logging](front-door-diagnostics.md) capabilities, and more. 
* The ability to update separate resources without updating the whole Azure Front Door instance through DevOps tools.
* Access to all future features and updates on Azure Front Door Standard and Premium tier.

For more information supported features, see [comparison between Azure Front Door and Azure CDN services](front-door-cdn-comparison.md).

### How does the performance of the Azure Front Door Standard or Premium tier compare to that of Azure Front Door (classic)?

The Azure Front Door Standard and Premium tier have the same Service Level Agreement (SLA). Our goal is to ensure Azure Front Door Standard and Premium delivers optimal performance and reliability.

### What will happen after March 31, 2027 when the service is retired?

After the service is retired, you'll lose the ability to:
* Create or manage Azure Front Door (classic) resources.
* Access the data through the Azure portal or the APIs/SDKs/client tools.
* Receive service updates to Azure Front Door (classic) or APIs/SDKs/Client tools.
* Receive support for issues on Azure Front Door (classic) through phone, email, or web.

### How can the migration be completed without causing downtime to my applications? Where can I learn more about the migration to Azure Front Door Standard or Premium?

We offer a zero-downtime migration tool. The following resources are available to assist you in understand and perform the migration process:

* Familiarize yourself with the [zero-downtime migration tool](tier-migration.md). It's important to pay attention to the section of **Breaking changes when migrating to Standard or Premium tier**.
* Gain understanding of the [settings mapping](tier-mapping.md) between the different Azure Front Door tiers.
* Learn the process of migrating from Azure Front Door (classic) to Standard or Premium tier using the [Azure portal](migrate-tier.md) or [Azure PowerShell](migrate-tier-powershell.md). 

### How will migrating to Azure Front Door Standard or Premium affect the Total Cost Ownership (TCO)?

For more information, see the [pricing comparison](understanding-pricing.md) between Azure Front Door tier.

### Which clouds does Azure Front Door (classic) retirement apply to?

Currently, Azure Front Door (classic) retirement affects the public cloud and Azure Government in the regions of Arizona and Texas.

### Can I make updates to Azure Front Door (classic) resources?

You can still update your existing Azure Front Door (classic) resources using the Azure portal, Terraform, and all command line tools until March 31, 2027. However, you won't be able to create new Azure Front Door (classic) resources starting April 1, 2025. We strongly recommend you migrate to Azure Front Door Standard or Premium tier as soon as possible. 

### Can I roll back to Azure Front Door (classic) after migration?

No, once migration is completed successfully, it can't be rolled back to classic. If you encounter any issues, you can raise a support ticket for assistance.

### How will the Azure Front Door (classic) resources be handled after migration?

We recommend you delete the Azure Front Door (classic) resource once migration successfully completes. Azure Front Door sends notification through Azure Advisor to remind users to delete the migrated classic resources.

### What are the available resources for support and feedback?

If you have a support plan and you need technical assistance, you can create a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) with the following information:

* *Issue type*, select **Technical**. 
* *Subscription*, select the subscription you need assistance with. 
* *Service*, select **My services**, then select **Front Door Service**. 
* *Resource*, select the **Azure Front Door resource**.
* *Summary*, describe the problem you’re experiencing with the migration.
* *Problem type*, select **Migrating Front Door Classic to Front Door Standard or Premium**

:::image type="content" source="./media/classic-retirement-faq/support-request.png" alt-text="Screenshot of a new support request for Azure Front Door (classic) migration issue.":::

## Next steps

- Migrate from Azure Front Door (classic) to Standard or Premium tier using the [Azure portal](migrate-tier.md) or [Azure PowerShell](migrate-tier-powershell.md) 
