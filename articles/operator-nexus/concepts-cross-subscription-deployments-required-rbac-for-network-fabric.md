---
title: Azure Operator Nexus - Cross-subscription deployments and required permissions for Network Fabric
description: Operator Nexus platform and tenant resource types
author: sushantjrao
ms.author: sushrao
ms.service: azure-operator-nexus
ms.topic: conceptual
ms.date: 09/17/2024
ms.custom: template-concept
---

# Managing Azure Network Fabric Resources Across Subscriptions

## Overview

This document outlines the requirements and behaviors associated with managing Nexus Network Fabric (NNF) resources in Azure when dealing with multiple subscriptions. It describes various scenarios involving different levels of access permissions that can affect operations across subscriptions. This document also covers the linked access check implementation, which ensures that proper permissions and access controls are enforced when managing Network Fabric (NNF) resources across multiple subscriptions, verifying that the required cross-subscription links have the necessary authorizations in place.

## Scenarios

### Limited access in Subscription A

In this scenario, the user has access to two subscriptions: **Subscription A** and **Subscription B**. In **Subscription A**, the user has only `read` access to the Network Fabric (NNF) resources.

**Outcome:** When the user tries to create or manage any NNF resource in **Subscription B** by referencing the NNF resource from **Subscription A**, the operation fails with a `LinkedAuthorizationFailed` error. This failure occurs because the user does not have the necessary `Join` access to the NNF resource.

### Sufficient Access in Both Subscriptions

In this scenario, the user has access to both **Subscription A** and **Subscription B**, with either `Contributor` or `Owner` permissions in both subscriptions.

**Outcome**: When the user tries to create or manage Network Fabric (NNF) resources in **Subscription B** by referencing NNF resources in **Subscription A**, the operation succeeds. This confirms that sufficient permissions enable successful resource management across subscriptions.

### No Access to Subscription A

In this scenario, the user has no access to **Subscription A**, where the Network Fabric (NNF) resources are deployed, but has Contributor or Owner rights in **Subscription B**.

Outcome:
When the user tries to create or manage NNF resources in **Subscription B** by referencing NNF resources in **Subscription A**, the operation fails with an AuthorizationFailed error. This occurs because the user lacks either the required Read access to **Subscription A** along with Join access to the referenced resource, or Write access to **Subscription A** along with Join access to the referenced resource.

>[!NOTE]
>Network Fabric cannot be created in a different subscription than the referenced Network Fabric Controller (NFC).

## Permissions Overview

To effectively manage NNF resources across Azure subscriptions, users must have the appropriate permissions. The following permissions are essential:

### Subscription-level permissions

- **Read access:** Users must have read access to view NNF resources within the subscription.
- **Contributor access:** Users can create and manage resources, including configuring settings and deleting resources.
- **Owner access:** Users have full control over the subscription, including the ability to manage permissions for other users.

### Resource-level permissions

- **Join access:** Users must have Join access to the specific NNF resources they wish to reference. For example, when a user tries to create an L2 or L3 isolation domain in **Subscription B** while referencing an NNF resource in **Subscription A**, the user must have Join access on the NNF resource.

## Resource Management Considerations

### Resource Creation

- Ensure that users have the necessary subscription-level permissions before attempting to create NNF resources.

- When referencing resources from another subscription, confirm that the user has both read access to that subscription and Join access to the specific NNF resource.

### Resource Configuration

- Users with 'Contributor` or `Owner` access can configure NNF resources. However, they must have the appropriate permissions for each specific configuration action.

### Resource Deletion

- Deleting NNF resources typically requires `Contributor`, `Owner` or `Delete` access on the resource. Users should be aware of any dependencies that may prevent deletion.

### Cross-Subscription Management

- When managing NNF resources across multiple subscriptions, it’s crucial to maintain a clear understanding of the permissions structure to avoid `AuthorizationFailed` and `LinkedAuthorizationFailed` errors.
