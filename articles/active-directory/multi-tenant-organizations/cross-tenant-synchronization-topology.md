---
title: Topologies for cross-tenant synchronization
description: Learn about topologies for cross-tenant synchronization in Microsoft Entra ID.
services: active-directory
author: rolyon
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.subservice: multi-tenant-organizations
ms.topic: conceptual
ms.date: 10/10/2023
ms.author: rolyon
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to
---

# Topologies for cross-tenant synchronization

Cross-tenant synchronization provides a flexible solution to enable collaboration, but every organization is different. Each cross-tenant synchronization configuration provides one-way synchronization between two Microsoft Entra tenants, which enables configuration of the following topologies.

## Single source with a single target

The following example shows the simplest topology where users in a single tenant need access to applications in the parent tenant.

:::image type="content" source="./media/cross-tenant-synchronization-topology/topology-single-source-single-target.png" alt-text="Diagram that shows a single source tenant synchronizing with a single target tenant.":::

## Single source with multiple targets

The following example shows a central user hub tenant where users need access to applications in smaller resource tenants across your organization.

Customers commonly rely on this pattern when they have their organization in a single tenant, but parts of the organization need more control and autonomy to manage things like Azure resources. This topology allows you to create a single tenant for things like user onboarding, M365, etc. and have resource tenants that are used to provide access to applications such as Azure resources. 

:::image type="content" source="./media/cross-tenant-synchronization-topology/topology-single-source-multiple-targets.png" alt-text="Diagram that shows a source tenant synchronizing with multiple target tenants.":::

## Multiple sources with a single target

The following example shows recently acquired tenants where users in multiple tenants need access to applications in the parent tenant.

:::image type="content" source="./media/cross-tenant-synchronization-topology/topology-multiple-source-single-target.png" alt-text="Diagram that shows multiple source tenants synchronizing with a single target tenant.":::

## Mesh peer-to-peer

Your organization might be more complex that is similar to a mesh. The following example shows a topology where users flow across tenants in their organization. This topology is often used to enable people search scenarios where every user needs to be in every tenant to have a unified gallery.

:::image type="content" source="./media/cross-tenant-synchronization-topology/topology-mesh-peer-peer.png" alt-text="Diagram that shows a hybrid topology synchronizing with multiple tenants.":::

Cross-tenant synchronization is one way. An internal member user can be synchronized into multiple tenants as an external user. When the topology shows a synchronization going in both directions, it's a distinct set of users in each direction and each arrow is a separate configuration.

## Next steps

- [What is cross-tenant synchronization?](cross-tenant-synchronization-overview.md)
- [Configure cross-tenant synchronization](cross-tenant-synchronization-configure.md)
