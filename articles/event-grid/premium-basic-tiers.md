---
title: Azure Event Grid Premium and Basic tiers
description: This article describes the difference between Azure Event Grid Premium and Basic tiers and when to use each
services: event-grid
author: banisadr

ms.service: event-grid
ms.topic: overview
ms.date: 03/11/2020
ms.author: babanisa
---

# Azure Event Grid premium and basic tiers
Azure Event Grid has two tiers: **Premium** and **Basic**. The basic tier uses consumption, or pay-as-you-go pricing. It gives you all of the basic pub/sub tools you need to use Event Grid for event-driven programming models. The premium tier takes this one step further with security features aimed at the enterprise. The premium tier is in early **public preview** with many of its features still under development.

## Overview
All custom topics and event domains in Event Grid are either Basic tier or Premium tier. All topics and domains created with API versions before `03-13-2020-preview` default to basic tier. The premium tier has all the features of the basic tier and more such as virtual network (VNet) integration via private endpoints. It's priced on an hourly basis as opposed to consumption pricing of the basic tier.

## Capabilities and features

The following table describes the security, performance, and SLA differences between the tiers:

|       &nbsp;                                           | Basic           | Premium        |
| ------------------------------------------------------ | --------------- | -------------- |
| IP firewall rules for ingress                          | Public preview  | Public preview |
| Service tags for egress                                | Public preview  | Public preview |
| Private endpoint VNet integration on ingress          | Not available   | Public preview |

## Availability
During initial preview, premium tier topics and domains with private endpoint integration is available in the following regions:

- East US
- West US 2
- South Central US
- US Gov


## Pricing and quotas
See [Event Grid pricing](https://azure.microsoft.com/pricing/details/event-grid/) for the pricing details of using the basic tier. The Premium tier pricing isn't yet announced and is free until pricing is available.

The existing quotas on topic and domain count, and throughput apply to both premium and basic tier resources until premium tier pricing is announced.

## Next steps
You can configure IP firewall for your Event Grid resource to restrict access over the public internet from only a select set of IP Addresses or IP Address ranges. For step-by-step instructions, see [Configure firewall](configure-firewall.md).

You can configure private endpoints to restrict access from only from selected virtual networks. For step-by-step instructions, see [Configure private endpoints](configure-private-endpoints.md).