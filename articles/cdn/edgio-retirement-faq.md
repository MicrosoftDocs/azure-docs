---
title: Azure CDN from Edgio retirement FAQ
titleSuffix: Azure Content Delivery Network
description: Common questions about the retirement of Azure CDN Standard from Edgio.
services: cdn
author: duongau
ms.service: azure-cdn
ms.topic: how-to
ms.date: 1/3/2025
ms.author: duau
---

# Azure CDN from Edgio retirement FAQ

Azure CDN from Edgio is shutting down on January 15, 2025. You must migrate your workload to Azure Front Door before January 7, 2025 to avoid service disruption. This article provides answers to common questions about the retirement of Azure CDN from Edgio.

## Frequently asked questions

### Why was the retirement date of Azure CDN from Edgio changed from November 4, 2025, to January 15, 2025?

[Akamai acquired select assets](https://www.prnewswire.com/news-releases/akamai-completes-acquisition-of-select-assets-of-edgio-302331398.html) from Edgio in December of 2024, and Microsoft was informed that the Edgio platform is ending service on January 15, 2025. All Azure CDN from Edgio users must migrate their workloads to Azure Front Door or other CDN services before this date.

### I see Edgio filed for Chapter 11 bankruptcy. Can Microsoft guarantee that Azure CDN from Edgio’s availability and services until November 4, 2025?

Edgio informed us that their services are remaining operational until at least January 15, 2025. However, we can't guarantee that Edgio won't unexpectedly cease operations before this date due to circumstances beyond our control. Therefore, we'll automatically migrate your workload if you haven't taken action by January 7, 2025. Automatic migration isn't possible for endpoints with `*.vo.msecnd.net` domains.

### How can I see my impacted Azure CDN from Edgio resources?

You can see them in the [Migrate away from Azure CDN from Edgio](https://portal.azure.com/#view/Microsoft_Azure_Expert/RecommendationList.ReactView/recommendationTypeId/2c9e3f2a-7373-45e1-ab8b-f361e5f0c37f) dashboard.

### What options do I have with migrating my workloads out of Azure CDN from Edgio?

The following process is a recap of the migration options we sent to all users:

- Validate if your workloads on Azure CDN from Edgio are compatible with Azure Front Door and migrate as soon as possible using these instructions before January 7, 2025. For more information, see [Comparison between Azure Front Door and Azure CDN services](../frontdoor/front-door-cdn-comparison.md) and [Frequently asked questions for Azure Front Door](../frontdoor/front-door-faq.yml).
    - If you already use custom domains, follow steps in [Migrate Azure CDN from Edgio to Azure Front Door](../frontdoor/migrate-cdn-to-front-door.md).
    - If you want to migrate while retaining your existing *.azureedge.net domain, follow steps in [Migrate to Azure Front Door while retaining *.azureedge.net domain](migrate-cdn-to-front-door-retain-edge-domain.md).

- If Azure Front Door isn't compatible with your workloads, determine if Akamai could be compatible via Azure Marketplace or work with another CDN provider. If you chose to work with Akamai, feel free to contact Microsoft Support, and we can put you in touch with the Akamai team dedicated to performing migrations to their platform.

    > [!IMPORTANT]
    > - If you plan a migration to Akamai or another CDN provider, you [must set the Feature Flag](../azure-resource-manager/management/preview-features.md) `DoNotForceMigrateEdgioCDNProfiles` before January 7, 2025. Doing so prevents Microsoft from migrating you to Azure Front Door (see the following comments). You have until January 14, 2025 to complete your migration to another CDN, but again Microsoft can't guarantee your services to be available on the Edgio platform before this date.
    > - Be advised we need to halt all configuration changes to Azure CDN by Edgio profiles starting on January 3, 2025. This means you can't update your CDN profile configuration, but your services on Azure CDN from Edgio can still operate until you're migrated or the Edgio platform is shut down on January 15, 2025. If you apply the `DoNotForceMigrateEdgioCDNProfiles` feature flag before January 3, your configuration won't be frozen for changes.

- If you have any services running on Azure CDN from Edgio on January 7, 2025 and haven't informed us of your plans (see the previous comments), we'll attempt to migrate your services to Azure Front Door between January 7th and 14th, 2025. We're performing this migration to Azure Front Door on a "best effort" basis, and doing so might cause issues related to the billing, features, availability, and/or performance you're currently consuming with Azure CDN from Edgio. If Microsoft attempts to migrate your workloads to Azure Front Door, we'll send you a follow-up email to advise you of the status of the migration, and provide potential actions or guidance.

### Can you provide more insights into the automatic migration to Azure Front Door Standard?

If Azure CDN from Edgio customers don't [set the Feature Flag](../azure-resource-manager/management/preview-features.md) `DoNotForceMigrateEdgioCDNProfiles` before 7 January 2025, Microsoft will migrate existing Azure CDN from Edgio profiles to Azure Front Door Standard profiles. Migration is happening between January 7th and 14th, 2025. These migrations to Azure Front Door are performed on a "best effort" basis, and doing so might cause issues related to the billing, features, availability, and/or performance you're currently consuming with Azure CDN from Edgio. Hence, as noted previously, customers should migrate themselves and not rely on this automatic migration.
Important notes regarding these "best effort" automatic migrations to Azure Front Door Standard:
-	Between January 7th and 14th, 2025 you'll receive an email notification confirming if your workloads have been successfully migrated to Azure Front Door Standard or if the migration was unsuccessful. If the migration was successful and you encounter issues with availability, performance, or feature functionality, contact Microsoft support for assistance. For customers whom the migration unsuccessful should reach out to Azure support for assistance and move to Akamai/another CDN provider if AFD is not suitable for their traffic.
-	We're migrating customers to Azure Front Door Standard as it may be more cost-effective. If you need the extra features of Azure Front Door Premium, you can [upgrade your service](../frontdoor/tier-upgrade.md).
-	Existing Azure CDN from Edgio domains (custom domains and/or *.azureedge.net domains) will be added as custom domains on the new Front Door endpoints and we'll switch the traffic from Edgio platform to Front Door platform.
-	We are not able to roll back the automatic migration.
-	Microsoft can't always maintain feature level parity in the new Front Door configuration.
-	Automatic migration isn't possible for endpoints with `*.vo.msecnd.net` domains.

### What are the most common issues seen with automatic migration and how to mitigate them?

| Issue              | Mitigation                                                                                                                     |
|-------------------|---------------------------------------------------------------------------------------------------------------------------|
| Custom domain couldn't be migrated as domain validation could not be performed due to missing CNAME | [Manually perform domain validation](../frontdoor/standard-premium/how-to-add-custom-domain.md) |
| Customer was using APEX domain | [Use Alias record on Azure DNS to use APEX domain](../frontdoor/front-door-how-to-onboard-apex-domain.md)|
| Customer was using SAS token through rule engine to access their Azure Storage backend which has public access disabled | [Upgrade](../frontdoor/tier-upgrade.md) to Front Door Premium and use [private link](../frontdoor/standard-premium/how-to-enable-private-link-storage-account.md). If you are facing any errors in setting up private link, raise a support ticket. |
| Customer was using geo-filtering rules which were not migrated | [Configure geo-filtering using WAF](../web-application-firewall/afds/waf-front-door-tutorial-geo-filtering.md)|

### What is the recap of the key dates?

| Date              | Event                                                                                                                     |
|-------------------|---------------------------------------------------------------------------------------------------------------------------|
| December 13, 2024 | No new Azure CDN from Edgio profiles can be created. |
| January 3, 2025   | No more profile changes are allowed on Azure CDN from Edgio. |
| January 6, 2025   | Last date for customers to set a Feature Flag to advise Microsoft not to migrate your workloads to Azure Front Door. |
| January 7-14, 2025 | All remaining Azure CDN from Edgio profiles are migrated to Azure Front Door if the said Feature Flag isn't set. |
| January 7-14, 2025 | Azure CDN from Edgio customers who did not act are notified via email of their migration status to Azure Front Door. |
| January 14, 2025  | Last day of service on Azure CDN from Edgio. |
| January 15, 2025  | Shutdown of the Edgio platform. |

### Can I retain my existing *.azureedge.net domain when I move to Azure Front Door?

You can temporarily retain your *.azureedge.net domain by following the instructions provided in [Migrate to Azure Front Door while retaining *.azureedge.net domain](migrate-cdn-to-front-door-retain-edge-domain.md). However, this is only a short-term solution due to the urgent retirement of Azure CDN from Edgio. Relying on domains like *.azureedge.net and *.azurefd.net isn't recommended as it poses availability risks. To ensure greater flexibility and avoid a single point of failure, it's advisable to adopt a custom domain as soon as possible.

### What are some key things I should do to verify my workloads are working properly on AFD?

- Look at [metrics and logs](../frontdoor/front-door-diagnostics.md) for Azure Front Door resources to observe for 4xx/5xx errors, cache/byte hit ratios, and origin health.
- See the following troubleshooting guides for any other issues:
    - [Troubleshoot Azure Front Door common issues](../frontdoor/troubleshoot-issues.md)
    - [Troubleshoot general performance problems](../frontdoor/troubleshoot-performance-issues.md)
    - [Frequently asked questions](../frontdoor/front-door-faq.yml)

### How does Azure Front Door billing work?

Depending on your workloads, Azure Front Door can be more cost-effective than Azure CDN from Edgio. The Azure Front Door billing model differs from Azure CDN from Edgio and includes different billing components. Specifically, Azure Front Door charges a base fee for each profile deployed. Additionally, charges are incurred for requests and data transfer based on usage. See the following for details:

- [Understand Azure Front Door billing](../frontdoor/billing.md)
- [Azure Content Delivery Network (CDN) pricing](https://azure.microsoft.com/pricing/details/cdn/?msockid=2995caa685d66a223dbede5b847b6b36#pricing)
- [Azure Front Door pricing](https://azure.microsoft.com/pricing/details/frontdoor/?msockid=2995caa685d66a223dbede5b847b6b36)
- [Pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=frontdoor-standard-premium)

For any questions regarding billing changes, reach out to our support team or your account team.

### Does Microsoft validate my workloads work on Azure Front Door?

No, you need to determine if Azure Front Door suits your workloads. We recommend setting up a test environment to validate that your services are compatible with Azure Front Door.

### What happens after Microsoft migrates my workloads to Azure Front Door on January 7, 2025?

After the migration, you'll receive an email notification confirming whether your workloads have been successfully migrated to Azure Front Door Standard or if the migration was unsuccessful. We're migrating you to Azure Front Door Standard as it may be more cost-effective. If you need the extra features of Azure Front Door Premium, you can [upgrade your service](../frontdoor/tier-upgrade.md).

If the migration was unsuccessful or if you encounter issues with availability, performance, or feature functionality after a successful migration, contact Microsoft support for assistance.

### How is Microsoft communicating the retirement of Azure CDN from Edgio, and how often are reminders sent?

We communicate the retirement of Azure CDN from Edgio through multiple channels, including email notifications and in-portal messages. Reminders are currently sent at least weekly to all users with active Edgio profiles to ensure they're aware of the upcoming changes and necessary actions.

### Can I request an extension for the retirement/shutdown of the Azure CDN from Edgio service?

No, extensions aren't possible. Edgio confirmed that their platform will shut down by January 15, 2025.

### Can I request an extension for the automatic migration of the Azure CDN from Edgio profiles on January 7th?

No, extensions aren't possible. If you don't want us to automatically migrate your profiles, you must set the Feature Flag `DoNotForceMigrateEdgioCDNProfiles` before January 7, 2025. More details above.

### Can I set the feature flag at resource/profile level instead of subscription level?

No.

### Can I be informed regarding the exact date and time when my Edgio profile is automatically migrated?

No. We're doing this migration on a "best effort" basis between January 7th and 14th, 2025 for customers who did not take action prior. Therefore we can't inform each customer regarding exact migration timings, but as noted previously after the migration we'll inform you as to whether it was successful.

### I am not able to stop my Azure CDN from Edgio anymore. What is happening?

For profiles that didn't apply the feature flag, configuration was frozen on January 3rd. These profiles will no longer be allowed to stop their endpoints. You can delete the profile instead. Do note that for Azure CDN from Edgio, stopping an endpoint has always meant as a configuration deletion. When an endpoint is disabled or stopped for any reason, all resources configured through the Edgio supplemental portal will be cleaned up. These configurations can't be restored automatically by restarting the endpoint. 

## Next steps

[Set up preview features](../azure-resource-manager/management/preview-features.md)
