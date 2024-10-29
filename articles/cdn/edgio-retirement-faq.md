---
title: Azure CDN from Edgio retirement FAQ
titleSuffix: Azure Content Delivery Network
description: Common questions about the retirement of Azure CDN Standard from Edgio.
services: cdn
author: duongau
ms.service: azure-cdn
ms.topic: how-to
ms.date: 10/28/2024
ms.author: duau
---

# Azure CDN from Edgio retirement FAQ

Azure CDN from Edgio will be retired on November 4, 2025. You must migrate your workload to Azure Front Door before this date to avoid service disruption. This article provides answers to common questions about the retirement of Azure CDN from Edgio.

## Frequently asked questions

### I see Edgio filed for Chapter 11 bankruptcy. Can Microsoft guarantee that Azure CDN from Edgio’s availability and services until November 4, 2025?

Edgio informs Microsoft that their services remain operational until at least November 4, 2025. Microsoft and Edgio collaborate closely during this transition. However, Microsoft can't guarantee that Edgio doesn't unexpectedly cease operations before this date due to circumstances beyond Microsoft's control.

### How does Microsoft assist me with migrating my workloads from Azure CDN from Edgio?

Azure CDN from Edgio users is encouraged to migrate their workloads to Microsoft's flagship CDN product, Azure Front Door Standard, or Premium. For a feature comparison between Azure Front Door and Azure CDN from Edgio, see [Azure CDN Features](cdn-features.md). 

Users need to determine if Azure Front Door is suitable for their workloads and set up a test environment to validate compatibility. If Azure Front Door isn't compatible, Microsoft offers a service called [Routing Preference Unmetered](../virtual-network/ip-services/routing-preference-unmetered.md) (also known as "CDN Interconnect"). This service can allow free data transfer for traffic egressing from Azure resources to another CDN of choice.

Microsoft is exploring the release of a self-service migration tool to facilitate the automatic transfer of compatible workloads from Azure CDN from Edgio to Azure Front Door. In the meantime, users can manually set up an Azure Front Door profile, test functionality, and seamlessly migrate their workloads. For assistance, contact Microsoft Support or your Microsoft Account team.

### Does Microsoft validate my workloads work on Azure Front Door?

Users of Azure CDN from Edgio need to determine if Azure Front Door suits their workloads. It's recommended to set up a test environment to validate that services are compatible with Azure Front Door.

### What alternative solutions does Microsoft offer?

Users of Azure CDN from Edgio are encouraged to consider migrating their workloads to Microsoft's flagship CDN product, Azure Front Door Standard, or Premium. For a feature comparison between Azure Front Door and Azure CDN from Edgio, see [Azure CDN Features](cdn-features.md). For a pricing comparison, visit [Azure CDN Pricing](https://azure.microsoft.com/en-us/pricing/details/cdn/).

### If I determined my workload isn't a match for Azure Front Door, what are my options?

If you find that Azure Front Door isn't suitable for your workload, Microsoft offers an alternative service called [Routing Preference Unmetered](../virtual-network/ip-services/routing-preference-unmetered.md), also known as "CDN Interconnect." This service might allow free data transfer for traffic egressing from your Azure resources to another CDN of your choice.

Additionally, you may choose to continue working directly with Edgio to minimize interruptions, keeping your origins on Azure while utilizing Edgio's services. For further information, contact Microsoft Support or reach out to [Edgio](https://edg.io/contact-us/).

### If I find Azure Front Door isn't compatible with my workload, can I transfer my services to Edgio and have them bill me directly?

Edgio informed Microsoft that they strive to facilitate seamless transitions for users who contact them directly. However, Microsoft can't guarantee the success of these transitions.

### What are Azure Front Door and Microsoft's media delivery capabilities?

Azure Front Door supports live and on-demand video streaming for small to medium-sized businesses. Edgio enabled Microsoft to deliver large-scale streaming workloads, such as major live events and over-the-top (OTT) services. While A Azure Front Door is exploring the capability to deliver streaming services for large-scale enterprises, there's currently no estimated time of arrival (ETA) for this feature.

### What will happen if I don't take action before November 4, 2025?

If no action is taken before November 4, 2025, Azure CDN from Edgio profiles and associated data will be removed from Edgio systems. It's imperative that users migrate their workloads before this date to avoid any service disruptions and data loss.

### Is Microsoft publishing a self-service guide to manually migrate my Azure Front Door-compatible workloads from Azure CDN from Edgio to Azure Front Door?

Yes, you can migrate your workloads manually by following the steps in the [migration guide](cdn-migration-guide.md). This guide provides detailed instructions on how to set up an Azure Front Door profile, test functionality, and migrate your workloads from Azure CDN from Edgio to Azure Front Door.

### Does Microsoft offer a tool to seamlessly migrate my Azure Front Door-compatible workloads from Azure CDN from Edgio to Azure Front Door?

Microsoft is actively exploring the development of a self-service migration tool to facilitate the automatic transfer of compatible workloads from Azure CDN from Edgio to Azure Front Door. Stay tuned for further updates and details.

### How is Microsoft communicating the retirement of Azure CDN from Edgio, and how often are reminders sent?

Microsoft communicates the retirement of Azure CDN from Edgio through multiple channels, including email notifications and in-portal messages. Reminders are sent at least monthly to all users with active Edgio profiles to ensure they're aware of the upcoming changes and necessary actions.

## Next steps

- Create an [Azure Front Door](../frontdoor/create-front-door-portal.md) profile.
- Create an [Azure CDN from Edgio](cdn-create-endpoint-how-to.md) profile.
