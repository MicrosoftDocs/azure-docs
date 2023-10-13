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

Whether your organization has separate tenants for each business unit, due to mergers and acquisitions, or for management of critical resources, cross-tenant synchronization provides a flexible, out of the box solution to provision accounts across tenants and enable seamless collaboration. Each cross-tenant synchronization configuration provides one-way synchronization between two Microsoft Entra tenants, which enables configuration of the following topologies.

> [!div class="checklist"]
> - Mergers and acquisitions
> - Conglomerates
> - Multi-national companies 
> - Organizations with multiple business units 
 

## Production and test tenant (1:1)

The simplest example of a multi-tenant organization is one with a production tenant and a test tenant. With cross-tenant synchronization, you can provision accounts from your production tenant into a test tenant. Within the test tenant, you can now assign those users the necessary roles and resources needed to try new features that may be in public preview, test new conditional access policies, governance capabilities, etc. By using cross-tenant synchronization, the lifecycle of these users is managed for you. When users change their name, change departments, or leave the company, those changes are reflected in the hub tenant. The following example shows the simplest topology where users in the production tenant are provisioned into the test tenant. 

:::image type="content" source="./media/cross-tenant-synchronization-topology/topology-single-source-single-target.png" alt-text="Diagram that shows a single source tenant synchronizing with a single target tenant.":::

## Collaborate after an acquisition (N:1)

In cases where organizations undergo mergers and acquisitions, quickly enabling collaboration allows the business to operate while more complex IT decisions are made. For example, employees from a newly acquired company many need access to a central ShrePoint site or applications such as DropBox that may be integrated in the parent company. With cross-tenant synchronization, users from the acquired company can be provisioned from day one and get access to SaaS apps, on-prem apps, and other clouds on day one. The following example shows recently acquired tenants where users in multiple tenants need access to applications in the parent tenant.

:::image type="content" source="./media/cross-tenant-synchronization-topology/hub1.png" alt-text="Diagram that shows multiple source tenants synchronizing with a single target tenant.":::

## Collaborate within a portfolio company (N:N)

Your organization might be more complex that is similar to a mesh. The following example shows a topology where users flow across tenants in their organization. This topology is often used to enable people search scenarios where every user needs to be in every tenant to have a unified gallery.

:::image type="content" source="./media/cross-tenant-synchronization-topology/mesh.png" alt-text="Diagram that shows a hybrid topology synchronizing with multiple tenants.":::

Cross-tenant synchronization is one way. An internal member user can be synchronized into multiple tenants as an external user. When the topology shows a synchronization going in both directions, it's a distinct set of users in each direction and each arrow is a separate configuration.


## Separate collaboration and resource tenants (1:N)

The following example shows a central user hub tenant where users need access to applications in smaller resource tenants across your organization.

Customers commonly rely on this pattern when they have their organization in a single tenant, but parts of the organization need more control and autonomy to manage things like Azure resources. This topology allows you to create a single tenant for things like user onboarding, M365, etc. and have resource tenants that are used to provide access to applications such as Azure resources. 

:::image type="content" source="./media/cross-tenant-synchronization-topology/hub2.png" alt-text="Diagram that shows a source tenant synchronizing with multiple target tenants.":::


## Collaborate across organizations 

The following example shows a central user hub tenant where users need access to applications in smaller resource tenants across your organization.

Customers commonly rely on this pattern when they have their organization in a single tenant, but parts of the organization need more control and autonomy to manage things like Azure resources. This topology allows you to create a single tenant for things like user onboarding, M365, etc. and have resource tenants that are used to provide access to applications such as Azure resources. 

:::image type="content" source="./media/cross-tenant-synchronization-topology/topology-single-source-multiple-targets.png" alt-text="Diagram that shows a source tenant synchronizing with multiple target tenants.":::

## Next steps

- [What is cross-tenant synchronization?](cross-tenant-synchronization-overview.md)
- [Configure cross-tenant synchronization](cross-tenant-synchronization-configure.md)
