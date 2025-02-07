---
title: Azure Operator Nexus - Cross-subscription deployments and required permissions for Network Fabric
description: Cross-subscription deployments and required permissions for Network Fabric
author: sushantjrao
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 09/17/2024
ms.custom: template-concept
---

# Cross-subscription deployments and required permissions for Network Fabric

This article outlines the requirements and behaviors associated with managing Nexus Network Fabric (NNF) resources in Azure across multiple subscriptions, along with the implementation of the linked access check. This check ensures that the necessary permissions and access controls are in place when managing resources across different subscriptions.

## Subscription context and user permissions

Consider two Azure subscriptions, **Subscription A** and **Subscription B**, where users interact with NNF resources. The permissions assigned to users in each subscription determine their ability to manage these resources effectively.

**Subscription A:** This subscription hosts the primary NNF resources. Depending on the user’s permissions, access levels can vary from read-only to full control.

**Subscription B:** This subscription is used for creating and managing NNF resources that may reference resources from **Subscription A**.

## Scenarios

### Limited access in subscription

In this scenario, the user has access to two subscriptions: **Subscription A** and **Subscription B**. In **Subscription A**, the user has only `Read` access to the Network Fabric (NNF) resources.

**Outcome:** When the user tries to create or manage any NNF resource in **Subscription B** by referencing the NNF resource from **Subscription A**, the operation fails with a `LinkedAuthorizationFailed` error. This failure occurs because the user does not have the necessary `Join` access to the NNF resource.

### Sufficient access in both subscriptions

In this scenario, the user has access to both **Subscription A** and **Subscription B**, with either `Contributor` or `Owner` permissions in both subscriptions.

**Outcome:** When the user tries to create or manage Network Fabric (NNF) resources in **Subscription B** by referencing NNF resources in **Subscription A**, the operation succeeds. This confirms that sufficient permissions enable successful resource management across subscriptions.

### No access to subscription

In this scenario, the user has no access to **Subscription A**, where the Network Fabric (NNF) resources are deployed, but has Contributor or Owner rights in **Subscription B**.

**Outcome:** When the user tries to create or manage NNF resources in **Subscription B** by referencing NNF resources in **Subscription A**, the operation fails with an AuthorizationFailed error. This occurs because the user lacks either the required Read access to **Subscription A** along with Join access to the referenced resource, or Write access to **Subscription A** along with Join access to the referenced resource.

>[!NOTE]
>Network Fabric cannot be created in a different subscription than the referenced Network Fabric Controller (NFC).

## Key considerations

To effectively manage NNF resources across Azure subscriptions, users must have the appropriate permissions. The following permissions are essential:

### Permission management 

#### Subscription-level permissions

- **Read access:** Users must have read access to view NNF resources within the subscription.

- **Contributor access:** Users can create and manage resources, including configuring settings and deleting resources.

- **Owner access:** Users have full control over the subscription, including the ability to manage permissions for other users.

#### Resource-level permissions

- **Join access:** Users must have Join access to the specific NNF resources they wish to reference. For example, when a user tries to create an L2 or L3 isolation domain in **Subscription B** while referencing an NNF resource in **Subscription A**, the user must have Join access on the NNF resource.

### Resource management

#### Resource creation

- Ensure that users have the necessary subscription-level permissions before attempting to create NNF resources.

- When referencing resources from another subscription, confirm that the user has both read access to that subscription and Join access to the specific NNF resource.

#### Resource configuration

- Users with 'Contributor` or `Owner` access can configure NNF resources. However, they must have the appropriate permissions for each specific configuration action.

#### Resource deletion

- Deleting NNF resources typically requires `Contributor`, `Owner` or `Delete` access on the resource. Users should be aware of any dependencies that may prevent deletion.

### Cross-Subscription management

- When managing NNF resources across multiple subscriptions, it’s crucial to maintain a clear understanding of the permissions structure to avoid `AuthorizationFailed` and `LinkedAuthorizationFailed` errors.