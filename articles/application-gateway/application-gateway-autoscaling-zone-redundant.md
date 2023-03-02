---
title: Scaling and Zone-redundant Application Gateway v2
description: This article introduces the Azure Application Standard_v2 and WAF_v2 SKU Autoscaling and Zone-redundant features.
services: application-gateway
author: greg-lindsay
ms.service: application-gateway
ms.topic: conceptual
ms.date: 03/01/2022
ms.author: greglin
ms.custom: fasttrack-edit, references_regions
---

# Scaling Application Gateway v2 and WAF v2

Application Gateway and WAF can be configured to scale in two modes:

- **Autoscaling** - With autoscaling enabled, the Application Gateway and WAF v2 SKUs scale out or in based on application traffic requirements. This mode offers better elasticity to your application and eliminates the need to guess the application gateway size or instance count. This mode also allows you to save cost by not requiring the gateway to run at peak-provisioned capacity for expected maximum traffic load. You must specify a minimum and optionally maximum instance count. Minimum capacity ensures that Application Gateway and WAF v2 don't fall below the minimum instance count specified, even without traffic. Each instance is roughly equivalent to 10 more reserved Capacity Units. Zero signifies no reserved capacity and is purely autoscaling in nature. You can also optionally specify a maximum instance count, which ensures that the Application Gateway doesn't scale beyond the specified number of instances. You'll only be billed for the amount of traffic served by the Gateway. The instance counts can range from 0 to 125. The default value for maximum instance count is 10 if not specified.
- **Manual** - You can also choose Manual mode where the gateway won't autoscale. In this mode, if there's more traffic than what Application Gateway or WAF can handle, it could result in traffic loss. With manual mode, specifying instance count is mandatory. Instance count can vary from 1 to 125 instances.

## Autoscaling and High Availability

Azure Application Gateways are always deployed in a highly available fashion. The service is made out of multiple instances that are created as configured (if autoscaling is disabled) or required by the application load (if autoscaling is enabled). Note that from the user's perspective you don't necessarily have visibility into the individual instances, but just into the Application Gateway service as a whole. If a certain instance has a problem and stops being functional, Azure Application Gateway will transparently create a new instance.

Even if you configure autoscaling with zero minimum instances the service will still be highly available, which is always included with the fixed price.

However, creating a new instance can take some time (around six or seven minutes). If you don't want to have this downtime, you can configure a minimum instance count of two, ideally with Availability Zone support. This way you'll have at least two instances in your Azure Application Gateway under normal circumstances. So if one of them had a problem the other will try to handle the traffic while a new instance is being created. An Azure Application Gateway instance can support around 10 Capacity Units, so depending on how much traffic you typically have you might want to configure your minimum instance autoscaling setting to a value higher than two.

For scale-in events, Application Gateway will drain existing connections for 5 minutes on the instance that is subject for removal. After 5 minutes, existing connections will be closed and the instance removed. Any new connections during or after the 5 minute scale-in time will be established to other existing instances on the same gateway.


## Next steps

- Learn more about [Application Gateway v2](overview-v2.md)
- [Create an autoscaling, zone redundant application gateway with a reserved virtual IP address using Azure PowerShell](tutorial-autoscale-ps.md)

