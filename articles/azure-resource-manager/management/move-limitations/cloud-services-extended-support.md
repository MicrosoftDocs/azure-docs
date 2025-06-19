---
title: Move Azure Cloud Services (extended support) deployment resources
description: Use Azure Resource Manager to move Cloud Services (extended support) deployment resources to a new resource group or subscription.
ms.topic: conceptual
ms.date: 02/11/2025
ms.custom: hirshah, devx-track-arm-template
---

# Move guidance for Cloud Services (extended support) deployment model resources

The steps to move resources deployed through the Cloud Services (extended support) model differ based on whether you're moving the resources within a subscription or to a new subscription.

## Move in the same subscription

When you move Cloud Services (extended support) resources from one resource group to another resource group within the same subscription, the following restrictions apply:

- Cloud Service must not be in manual mode.
- Cloud Service must not be VIP Swappable.
- Cloud Service must not have any pending operations.
- Cloud Service must not be in migration.
- Cloud Service must not be in failed state.
- Ensure the Cloud Service has an unexpired SAS blob URI pointing to the cloud service package.

> [!NOTE]
> You can move Cloud Services and associated networking resources (for example, PublicIPs and network security groups) independently. However, load balancers must always exist in the same resource group.

To move classic resources to a new resource group within the same subscription, use the [standard move operations](../move-resource-group-and-subscription.md) through the portal, Azure PowerShell, Azure CLI, or REST API. Use the same operations for moving Resource Manager resources.

## Move across subscriptions

When you move Cloud Services (extended support) deployments to a new subscription, the following restrictions apply:

- You must move together all associated cloud service resources, such as key vault and network resources, for cross-subscription moves.
- You must create a ticket to resolve an error that states the cloud service can't be moved because of a prior failed operation, create a ticket. 
- Cloud Service must not have any cross-subscription references.
