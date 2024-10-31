---
title: Azure CDN from Edgio retirement FAQ
titleSuffix: Azure Content Delivery Network
description: Common questions about the retirement of Azure CDN Standard from Edgio.
services: cdn
author: duongau
ms.service: azure-cdn
ms.topic: how-to
ms.date: 10/30/2024
ms.author: duau
---

# Azure CDN from Edgio retirement FAQ

Azure CDN from Edgio will be retired on November 4, 2025. You must migrate your workload to Azure Front Door before this date to avoid service disruption. This article provides answers to common questions about the retirement of Azure CDN from Edgio.

## Frequently asked questions

### I see Edgio filed for Chapter 11 bankruptcy. Can Microsoft guarantee that Azure CDN from Edgio’s availability and services until November 4, 2025?

Edgio informed us that their services remain operational until at least November 4, 2025. However, we can't guarantee that Edgio doesn't unexpectedly cease operations before this date due to circumstances beyond our control.

### What options do I have with migrating my workloads from Azure CDN from Edgio?

You're encouraged to migrate your workloads to Microsoft's flagship CDN product called Azure Front Door Standard or Premium. Next steps:
1. Review [Azure Front Door and Azure CDN features](../frontdoor/front-door-cdn-comparison.md) to determine if Azure Front Door is compatible with your workload(s).
2. Understand [Azure Front Door Pricing](https://azure.microsoft.com/en-us/pricing/details/frontdoor/).
3. Follow the [Azure CDN to Azure Front Door migration guide](../frontdoor/migrate-cdn-to-front-door.md). This guide provides detailed instructions on how to set up an Azure Front Door profile, test functionality, and migrate your compatible workloads from Azure CDN from Edgio to Azure Front Door with the help of Azure Traffic Manager.

### If I determined my workload isn't a match for Azure Front Door, what are my options?

If you find that Azure Front Door isn't suitable for your workload, we offer an alternative service called [Routing Preference Unmetered](../virtual-network/ip-services/routing-preference-unmetered.md), also known as "CDN Interconnect." This service might allow free data transfer for traffic egressing from your Azure resources to another CDN of your choice.

Additionally, you can choose to continue working directly with Edgio to minimize interruptions, keeping your origins on Azure while utilizing Edgio's services. For further information, contact Microsoft Support or reach out to [Edgio](https://edg.io/contact-us/).

### Does Microsoft validate my workloads work on Azure Front Door?

You need to determine if Azure Front Door suits your workloads. We recommend setting up a test environment to validate that your services are compatible with Azure Front Door.

### What will happen if I don't take action before November 4, 2025?

If no action is taken before November 4, 2025, Azure CDN from Edgio profiles and associated data will be removed from Edgio systems. It's imperative that users migrate their workloads before this date to avoid any service disruptions and data loss.

### How is Microsoft communicating the retirement of Azure CDN from Edgio, and how often are reminders sent?

We communicate the retirement of Azure CDN from Edgio through multiple channels, including email notifications and in-portal messages. Reminders are sent at least monthly to all users with active Edgio profiles to ensure they're aware of the upcoming changes and necessary actions.
