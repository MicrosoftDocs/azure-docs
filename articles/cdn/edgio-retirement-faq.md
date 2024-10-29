---
title: Azure CDN from Edgio retirement FAQ
titleSuffix: Azure Content Delivery Network
description: Common questions about the retirement of Azure CDN Standard from Edgio.
services: cdn
author: duongau
ms.service: azure-cdn
ms.topic: how-to
ms.date: 10/29/2024
ms.author: duau
---

# Azure CDN from Edgio retirement FAQ

Azure CDN from Edgio will be retired on November 4, 2025. You must migrate your workload to Azure Front Door before this date to avoid service disruption. This article provides answers to common questions about the retirement of Azure CDN from Edgio.

## Frequently asked questions

### I see Edgio filed for Chapter 11 bankruptcy. Can Microsoft guarantee that Azure CDN from Edgio’s availability and services until November 4, 2025?

Edgio informed us that their services remain operational until at least November 4, 2025. We're collaborating with Edgio closely during this transition. However, we can't guarantee that Edgio doesn't unexpectedly cease operations before this date due to circumstances beyond our control.

### How does Microsoft assist me with migrating my workloads from Azure CDN from Edgio?

You're encouraged to migrate their workloads to Azure Front Door. You need to determine if Azure Front Door is suitable for their workloads and set up a test environment to validate compatibility. For a feature comparison, see [Azure Front Door and Azure CDN features](../frontdoor/front-door-cdn-comparison.md).

If Azure Front Door isn't compatible with your workload, we offer a service called [Routing Preference Unmetered](../virtual-network/ip-services/routing-preference-unmetered.md) also known as *CDN Interconnect*. This service routes traffic from your Azure resources to another CDN. You can choose to continue working with Edgio directly to minimize interruptions and keep your origins on Azure. For further information, you can contact Microsoft support or reach out to [Edgio](https://edg.io/contact-us/).

### Does Microsoft validate my workloads work on Azure Front Door?

You need to determine if Azure Front Door suits your workloads. We recommend setting up a test environment to validate that your services are compatible with Azure Front Door.

### What alternative solutions does Microsoft offer?

We encourage you to consider migrating your workloads to Azure Front Door. For a feature comparison between Azure Front Door and Azure CDN from Edgio, see [Azure CDN Features](cdn-features.md). For a pricing comparison, visit [Azure CDN Pricing](https://azure.microsoft.com/en-us/pricing/details/cdn/).

### If I determined my workload isn't a match for Azure Front Door, what are my options?

If you find that Azure Front Door isn't suitable for your workload, we offer an alternative service called [Routing Preference Unmetered](../virtual-network/ip-services/routing-preference-unmetered.md), also known as "CDN Interconnect." This service might allow free data transfer for traffic egressing from your Azure resources to another CDN of your choice.

Additionally, you can choose to continue working directly with Edgio to minimize interruptions, keeping your origins on Azure while utilizing Edgio's services. For further information, contact Microsoft Support or reach out to [Edgio](https://edg.io/contact-us/).

### If I find Azure Front Door isn't compatible with my workload, can I transfer my services to Edgio and have them bill me directly?

Edgio informed Microsoft that they strive to facilitate seamless transitions for users who contact them directly. However, Microsoft can't guarantee the success of these transitions.

### What are Azure Front Door and Microsoft's media delivery capabilities?

Azure Front Door supports live and on-demand video streaming for small to medium-sized businesses. Edgio enabled Microsoft to deliver large-scale streaming workloads, such as major live events and over-the-top (OTT) services. While A Azure Front Door is exploring the capability to deliver streaming services for large-scale enterprises, there's currently no estimated time of arrival (ETA) for this feature.

### What will happen if I don't take action before November 4, 2025?

If no action is taken before November 4, 2025, Azure CDN from Edgio profiles and associated data will be removed from Edgio systems. It's imperative that users migrate their workloads before this date to avoid any service disruptions and data loss.

### Is Microsoft publishing a self-service guide to manually migrate my Azure Front Door-compatible workloads from Azure CDN from Edgio to Azure Front Door?

Yes, you can migrate your workloads manually by following the steps in the [Azure CDN to Azure Front Door migration guide](../frontdoor/migrate-cdn-to-front-door.md). This guide provides detailed instructions on how to set up an Azure Front Door profile, test functionality, and migrate your workloads from Azure CDN from Edgio to Azure Front Door with the help of Azure Traffic Manager.

### How is Microsoft communicating the retirement of Azure CDN from Edgio, and how often are reminders sent?

We communicate the retirement of Azure CDN from Edgio through multiple channels, including email notifications and in-portal messages. Reminders are sent at least monthly to all users with active Edgio profiles to ensure they're aware of the upcoming changes and necessary actions.

## Next steps

- Create an [Azure Front Door](../frontdoor/create-front-door-portal.md) profile.
- Create an [Azure CDN from Edgio](cdn-create-endpoint-how-to.md) profile.
