---
title: Resource isolation in a single tenant to secure with Microsoft Entra ID 
description: Introduction to resource isolation in a single tenant in Microsoft Entra ID.
services: active-directory
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.workload: identity
ms.subservice: fundamentals
ms.topic: conceptual
ms.date: 7/5/2022
ms.author: gasinh
ms.reviewer: ajburnle
ms.custom: it-pro, ignite-2022
ms.collection: M365-identity-device-management
---

# Resource isolation in a single tenant

Many separation scenarios can be achieved within a single tenant. If possible, we recommend that you delegate administration to separate environments within a single tenant to provide the best productivity and collaboration experience for your organization.

## Outcomes

**Resource separation** - With Microsoft Entra directory roles, security groups, Conditional Access policies, Azure resource groups, Azure management groups, administrative units (AU's), and other controls, you can restrict resource access to specific users, groups, and service principals. Resources can be managed by separate administrators, and have separate users, permissions, and access requirements.

If a set of resources require unique tenant-wide settings, or there's minimal risk tolerance for unauthorized access by tenant members, or critical impact could be caused by configuration changes, you must achieve isolation in multiple tenants.

**Configuration separation** - In some cases, resources such as applications have dependencies on tenant-wide configurations like authentication methods or [named locations](../conditional-access/location-condition.md#named-locations). You should consider these dependencies when isolating resources. Global administrators can configure the resource settings and tenant-wide settings that affect resources.

If a set of resources require unique tenant-wide settings, or the tenant's settings must be administered by a different entity, you must achieve isolation with multiple tenants.

**Administrative separation** - With Microsoft Entra ID delegated administration, you can segregate the administration of resources such as applications and APIs, users and groups, resource groups, and Conditional Access policies.

Global administrators can discover and obtain full access to any trusting resources. You can set up auditing and alerts to know when an administrator changes a resource if they're authenticated.

You can also use administrative units (AU) in Microsoft Entra ID to provide some level of administrative separation. Administrative units restrict permissions in a role to any portion of your organization that you define. You could, for example, use administrative units to delegate the [Helpdesk Administrator](../roles/permissions-reference.md) role to regional support specialists, so they can manage users only in the region that they support.

![Diagram that shows administrative units.](media/secure-single-tenant/administrative-units.png)

Administrative Units can be used to separate [user, groups and device objects](../roles/administrative-units.md). Assignments of those units can be managed by [dynamic membership rules](../roles/admin-units-members-dynamic.md).

By using Privileged Identity Management (PIM) you can define who in your organization is the best person to approve the request for highly privileged roles. For example, admins requiring global administrator access to make tenant-wide changes.

>[!NOTE]
>Using PIM requires and Microsoft Entra ID P2 license per human.

If you must ensure that global administrators are unable to manage a specific resource, you must isolate that resource in a separate tenant with separate global administrators. This can be especially important for backups, see [multi-user authorization guidance](/azure/backup/multi-user-authorization) for examples of this.

## Common usage

One of the most common uses for multiple environments in a single tenant is to segregate production from nonproduction resources. Within a single tenant, development teams and application owners can create and manage a separate environment with test apps, test users and groups, and test policies for those objects; similarly, they can create nonproduction instances of Azure resources and trusted apps.

The following diagram illustrates the nonproduction environments and the production environment.

![Diagram that shows Microsoft Entra tenant boundary.](media/secure-single-tenant/tenant-boundary.png)

In this diagram, there are nonproduction Azure resources and nonproduction instances Microsoft Entra integrated applications with equivalent nonproduction directory objects. In this example, the nonproduction resources in the directory are used for testing purposes.

>[!NOTE]
>You cannot have more than one Microsoft 365 environment in a single Microsoft Entra tenant. However, you can have multiple Dynamics 365 environments in a single Microsoft Entra tenant.

Another scenario for isolation within a single tenant could be separation between locations, subsidiary or implementation of tiered administration (according to the "[Enterprise Access Model](/security/compass/privileged-access-access-model)").

Azure RBAC role assignments allow scoped administration of Azure resources. Similarly, Microsoft Entra ID allows granular management of Microsoft Entra ID trusting applications through multiple capabilities such as Conditional Access, user and group filtering, administrative unit assignments and application assignments.

If you must ensure full isolation (including staging of organization-level configuration) of Microsoft 365 services, you need to choose a [multiple tenant isolation](/azure/backup/multi-user-authorization).

## Scoped management in a single tenant

### Scoped management for Azure resources

Azure RBAC allows you to design an administration model with granular scopes and surface area. Consider the management hierarchy in the following example:

>[!NOTE]
>There are multiple ways to define the management hierarchy based on an organization's individual requirements, constraints, and goals. For more information, consult the Cloud Adoption Framework guidance on how to [Organize Azure Resources](/azure/cloud-adoption-framework/ready/azure-setup-guide/organize-resources)).

![Diagram that shows resource isolation in a single tenant.](media/secure-single-tenant/resource-hierarchy.png)

* **Management group** - You can assign roles to specific management groups so that they don't impact any other management groups. In the scenario above, the HR team can define an Azure Policy to audit the regions where resources are deployed across all HR subscriptions.

* **Subscription** - You can assign roles to a specific subscription to prevent it from impacting any other resource groups. In the example above, the HR team can assign the Reader role for the Benefits subscription, without reading any other HR subscription, or a subscription from any other team.

* **Resource group** - You can assign roles to specific resource groups so that they don't impact any other resource groups. In the example above, the Benefits engineering team can assign the Contributor role to the test lead so they can manage the test DB and the test web app, or to add more resources.

* **Individual resources** - You can assign roles to specific resources so that they don't impact any other resources. In the example above, the Benefits engineering team can assign a data analyst the Cosmos DB Account Reader role just for the test instance of the Azure Cosmos DB database, without interfering with the test web app or any production resource.

For more information, see [Azure built-in roles](/azure/role-based-access-control/built-in-roles) and [What is Azure role-based access control (Azure RBAC)?](/azure/role-based-access-control/overview).

This is a hierarchical structure, so the higher up in the hierarchy, the more scope, visibility, and impact there's to lower levels. Top-level scopes affect all Azure resources in the Microsoft Entra tenant boundary. This also means that permissions can be applied at multiple levels. The risk this introduces is that assigning roles higher up the hierarchy could provide more access lower down the scope than intended. [Microsoft Entra](https://www.microsoft.com/security/business/identity-access/microsoft-entra-permissions-management) (formally CloudKnox) is a Microsoft product that provides visibility and remediation to help reduce the risk. A few details are as follows:

* The root management group defines Azure Policies and RBAC role assignments that will be applied to all subscriptions and resources.

* Global Administrators can [elevate access](https://aka.ms/AzureADSecuredAzure/12a) to all subscriptions and management groups.

Both top-level scopes should be strictly monitored. It's important to plan for other dimensions of resource isolation such as networking. For general guidance on Azure networking, see [Azure best practices for network security](/azure/security/fundamentals/network-best-practices). Infrastructure as a Service (IaaS) workloads have special scenarios where both identity and resource isolation need to be part of the overall design and strategy.

Consider isolating sensitive or test resources according to [Azure landing zone conceptual architecture](/azure/cloud-adoption-framework/ready/landing-zone/). For example, Identity subscription should be assigned to separated management group and all subscriptions for development purposes could be separated in "Sandbox" management group. More details can be found in the [Enterprise-Scale documentation](/azure/cloud-adoption-framework/ready/enterprise-scale/faq). Separation for testing purposes within a single tenant is also considered in the [management group hierarchy of the reference architecture](/azure/cloud-adoption-framework/ready/enterprise-scale/testing-approach).

<a name='scoped-management-for-azure-ad-trusting-applications'></a>

### Scoped management for Microsoft Entra ID trusting applications

The pattern to scope management of Microsoft Entra ID trusting applications is outlined in the following section. 

Microsoft Entra ID supports configuring multiple instances of custom and SaaS apps, but not most Microsoft services, against the same directory with [independent user assignments](../manage-apps/assign-user-or-group-access-portal.md). The above example contains both a production and a test version of the travel app. You can deploy preproduction versions against the corporate tenant to achieve app-specific configuration and policy separation that enables workload owners to perform testing with their corporate credentials. Nonproduction directory objects such as test users and test groups are associated to the nonproduction application with separate [ownership](https://aka.ms/AzureADSecuredAzure/14a) of those objects.

There are tenant-wide aspects that affect all trusting applications in the Microsoft Entra tenant boundary including:

* Global Administrators can manage all tenant-wide settings.

* Other [directory roles](https://aka.ms/AzureADSecuredAzure/14b) such as User Administrator, Administrator, and Conditional Access Administrators can manage tenant-wide configuration within the scope of the role.

Configuration settings such authentication methods allowed, hybrid configurations, B2B collaboration allow-listing of domains, and named locations are tenant wide.

>[!Note]
>Microsoft Graph API Permissions and consent permissions cannot be scoped to a group or members of Administrative Units. Those permissions will be assigned on directory-level, only resource-specific consent allows scope on resource-level (currently limited to [Microsoft Teams Chat permissions](/microsoftteams/platform/graph-api/rsc/resource-specific-consent))

>[!IMPORTANT]
>The lifecycle of Microsoft SaaS services such as Office 365, Microsoft Dynamics, and Microsoft Exchange are bound to the Microsoft Entra tenant. As a result, multiple instances of these services necessarily require multiple Microsoft Entra tenants. Check the documentation for individual services to learn more about specific management scoping capabilities.

## Next steps

* [Introduction to delegated administration and isolated environments](secure-introduction.md)

* [Microsoft Entra fundamentals](./secure-fundamentals.md)

* [Azure resource management fundamentals](secure-resource-management.md)

* [Resource isolation with multiple tenants](secure-multiple-tenants.md)

* [Best practices](secure-best-practices.md)
