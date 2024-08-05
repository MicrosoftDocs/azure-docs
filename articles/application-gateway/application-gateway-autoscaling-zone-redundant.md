---
title: Scaling and Zone-redundant Application Gateway v2
description: This article introduces the Azure Application Standard_v2 and WAF_v2 SKU Autoscaling and Zone-redundant features.
services: application-gateway
author: greg-lindsay
ms.service: azure-application-gateway
ms.topic: conceptual
ms.date: 11/02/2023
ms.author: greglin
ms.custom: fasttrack-edit, references_regions
---

# Scaling Application Gateway v2 and WAF v2

Application Gateway and WAF can be configured to scale in two modes:

- **Autoscaling** - With autoscaling enabled, the Application Gateway and WAF v2 SKUs scale out or in based on application traffic requirements. This mode offers better elasticity to your application and eliminates the need to guess the application gateway size or instance count. This mode also allows you to save cost by not requiring the gateway to run at peak-provisioned capacity for expected maximum traffic load. You must specify a minimum and optionally maximum instance count. Minimum capacity ensures that Application Gateway and WAF v2 don't fall below the minimum instance count specified, even without traffic. Each instance is roughly equivalent to 10 more reserved Capacity Units. Zero signifies no reserved capacity and is purely autoscaling in nature. You can also optionally specify a maximum instance count, which ensures that the Application Gateway doesn't scale beyond the specified number of instances. You are only billed for the amount of traffic served by the Gateway. The instance counts can range from 0 to 125. The default value for maximum instance count is 10 if not specified.


> [!NOTE]
> If the maximum instance count is updated to a value less than the current instance count, the new setting will not take immediate effect. The newly updated maximum will only be enforced after a scale-in operation brings  the  current count below newly updated maximum count. If the scale-in operation does not occur because the autoscaling  scale in thresholds are not met, the new maximum setting will not be applied.

- **Manual** - You can also choose Manual mode where the gateway doesn't autoscale. In this mode, if there's more traffic than what Application Gateway or WAF can handle, it could result in traffic loss. With manual mode, specifying instance count is mandatory. Instance count can vary from 1 to 125 instances.

> [!NOTE]
> These scaling modes don’t apply for Application Gateway Basic. Application Gateway Basic automatically scales up to an estimated 200 connections per second, based on an RSA 2048-bit key TLS certificate.

## Autoscaling and High Availability

Azure Application Gateways are always deployed in a highly available fashion. The service is made up of multiple instances that are created as configured if autoscaling is disabled, or required by the application load if autoscaling is enabled. From the user's perspective, you don't necessarily have visibility into the individual instances, but just into the Application Gateway service as a whole. If a certain instance has a problem and stops being functional, Azure Application Gateway transparently creates a new instance.

Even if you configure autoscaling with zero minimum instances the service is still highly available, which is always included with the fixed price.

However, it’s important to note that provisioning a new instance may take approximately six to seven minutes. Understanding the scaling behavior of Application Gateway instances is key to maintaining performance under varying loads. These instances scale out in groups, and the group size is increased proactively when the current instance count is higher. This strategy allows the system to manage workload surges efficiently, preventing potential service disruptions or slowdowns. Each Azure Application Gateway instance can handle up to 10 Capacity Units. To optimize your autoscaling settings, consider your typical traffic patterns and set the minimum instances accordingly to ensure smooth operation.

For scale-in events, Application Gateway drains existing connections for 5 minutes on the instance that is subject for removal. After 5 minutes, existing connections are closed and the instance removed. Any new connections during or after the 5 minute scale-in time is established to other existing instances on the same gateway.

## Next steps

- Learn how to [Schedule autoscaling for Application Gateway](application-gateway-externally-managed-scheduled-autoscaling.md)
- Learn more about [Application Gateway v2](overview-v2.md)
- [Create an autoscaling, zone redundant application gateway with a reserved virtual IP address using Azure PowerShell](tutorial-autoscale-ps.md)

