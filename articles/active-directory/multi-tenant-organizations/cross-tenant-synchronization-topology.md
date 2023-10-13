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
ms.date: 10/18/2023
ms.author: rolyon
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to
---

# Topologies for cross-tenant collaboration

Whether your organization has multiple tenants due to mergers and acquisitions, for each business unit, or for management of critical resources, Microsoft Entra provides a flexible, out of the box solution to provision accounts across tenants and enable seamless collaboration. Microsoft Entra supports all three models below and adapts to meet your needs: 

> [!div class="checklist"]
> - Hub and spoke
> - Mesh
> - Just-in-time

## Hub and Spoke
There are two common patterns for a hub and spoke. Firstly, you can define a hub tenant where critical applications are integrated. Administrators of the spoke tenants can choose which users they want to provision into the hub for application access. Secondly, you can define a central user hub where all users originate, and then provision those users into the spoke tenants. Let's look at a few example scenarios and how they fit into each model. 

### Mergers and acquisitions (N:1)

In cases where organizations undergo mergers and acquisitions, quickly enabling collaboration allows the business to operate while more complex IT decisions are made. For example, employees from a newly acquired company many need access to a central ShrePoint site or applications such as DropBox that may be integrated in the parent company. With cross-tenant synchronization, users from the acquired company can be provisioned from day one and get access to SaaS apps, on-prem apps, and other clouds on day one. The following example shows recently acquired tenants where users in multiple tenants need access to applications in the parent tenant.

:::image type="content" source="./media/cross-tenant-synchronization-topology/Hub1.png" alt-text="Diagram that shows multiple source tenants synchronizing with a single target tenant.":::

## Separate collaboration and resource tenants (1:N)

As organizations scale their Azure usage, they frequently centralize users in a hub tenant, sourced from their HR system, and provision accounts into spoke tenants used for management of Azure Resources. This enables administrators of the hub tenant to define central security and governance policies, while providing development teams greater autonomy to deploy the necessary Azure resources. 

:::image type="content" source="./media/cross-tenant-synchronization-topology/Hub2.png" alt-text="Diagram that shows a source tenant synchronizing with multiple target tenants.":::

## Mesh
While some companies have central IT teams and are able to manage  users in a single tenant, others have need a more decentralized structure with apps, HR systems, and AD domains integrated with each tenant. With cross-tenant synchronization, you have the flexibility to choose which users are provisioned into each tenant and ... 

### Collaborate within a portfolio company (N:N)
In the example below, each tenant represents a different company that is part of the same parent organization. Administrators of each tenant choose which users to provision. The tenants that collaborate closely, particularly in Microsoft Teams, provision all their users across tenants to enable a more seamless experience. However, tenant 4

:::image type="content" source="./media/cross-tenant-synchronization-topology/Mesh.png" alt-text="Diagram that shows a hybrid topology synchronizing with multiple tenants.":::

Cross-tenant synchronization is one way. An internal member user can be synchronized into multiple tenants as an external user. When the topology shows a synchronization going in both directions, it's a distinct set of users in each direction and each arrow is a separate configuration.

## Just-in-time 
While the scenarios above cover collaboration within an organization, there are many cases where collaboration across organizations is critical. This could be for joint ventures, organizations of independent legal entities, etc. By using connected organizations and entitlement management, you can define policies for who can access resources across connected organizations and enable users to request access to the resources that they need. 

### Joint ventures
Contoso and Litware are separate organizations, part of a multi-year joint venture and they need to collaborate closely. Administrators at Contoso have defined access packages with the resources that Litware users need. When a new employee at Litware needs access to resources in Contoso, they can request access to the access package and upon approval are provisioned access to the resources that they need. The access can be timelimited and reviewed pereodically to ensure that Contoso's governance requirements are met. 

:::image type="content" source="./media/cross-tenant-synchronization-topology/ConnectedOrganization.png" alt-text="Diagram that shows a source tenant synchronizing with multiple target tenants.":::

## Next steps

- [What is cross-tenant synchronization?](cross-tenant-synchronization-overview.md)
- [Configure cross-tenant synchronization](cross-tenant-synchronization-configure.md)


### Production and test tenant (1:1)

The simplest example of a multi-tenant organization is one with a production tenant and a test tenant. With cross-tenant synchronization, you can provision accounts from your production tenant into a test tenant. Within the test tenant, you can now assign those users the necessary roles and resources needed to try new features that may be in public preview, test new conditional access policies, governance capabilities, etc. By using cross-tenant synchronization, the lifecycle of these users is managed for you. When users change their name, change departments, or leave the company, those changes are reflected in the hub tenant. The following example shows the simplest topology where users in the production tenant are provisioned into the test tenant. 

:::image type="content" source="./media/cross-tenant-synchronization-topology/topology-single-source-single-target.png" alt-text="Diagram that shows a single source tenant synchronizing with a single target tenant.":::
