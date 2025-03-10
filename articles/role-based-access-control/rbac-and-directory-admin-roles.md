---
title: "Azure roles, Microsoft Entra roles, and classic subscription administrator roles"
description: Describes the different roles in Azure - Azure roles, and Microsoft Entra roles, and classic subscription administrator roles
author: rolyon
manager: amycolannino
ms.assetid: 174f1706-b959-4230-9a75-bf651227ebf6
ms.service: role-based-access-control
ms.topic: overview
ms.date: 03/15/2024
ms.author: rolyon
ms.custom: it-pro;
---

# Azure roles, Microsoft Entra roles, and classic subscription administrator roles

If you're new to Azure, you may find it a little challenging to understand all the different roles in Azure. This article helps explain the following roles and when you would use each:
- Azure roles
- Microsoft Entra roles
- Classic subscription administrator roles

## How the roles are related

To better understand roles in Azure, it helps to know some of the history. When Azure was initially released, access to resources was managed with just three administrator roles: Account Administrator, Service Administrator, and Co-Administrator. Later, Azure role-based access control (Azure RBAC) was added. Azure RBAC is a newer authorization system that provides fine-grained access management to Azure resources. Azure RBAC includes many built-in roles, can be assigned at different scopes, and allows you to create your own custom roles. To manage resources in Microsoft Entra ID, such as users, groups, and domains, there are several Microsoft Entra roles.

The following diagram is a high-level view of how the Azure roles, Microsoft Entra roles, and classic subscription administrator roles are related.

:::image type="content" source="./media/rbac-and-directory-admin-roles/rbac-admin-roles.png" alt-text="Diagram of the different roles in Azure." lightbox="./media/rbac-and-directory-admin-roles/rbac-admin-roles.png":::

## Azure roles

[Azure RBAC](overview.md) is an authorization system built on [Azure Resource Manager](../azure-resource-manager/management/overview.md) that provides fine-grained access management to Azure resources, such as compute and storage. Azure RBAC includes over 100 built-in roles. There are five fundamental Azure roles. The first three apply to all resource types:

| Azure role | Permissions | Notes |
| --- | --- | --- |
| [Owner](built-in-roles.md#owner) | <ul><li>Grants full access to manage all resources</li><li>Assign roles in Azure RBAC</li></ul> | The Service Administrator and Co-Administrators are assigned the Owner role at the subscription scope<br>Applies to all resource types. |
| [Contributor](built-in-roles.md#contributor) | <ul><li>Grants full access to manage all resources</li><li>Can't assign roles in Azure RBAC</li><li>Can't manage assignments in Azure Blueprints or share image galleries</li></ul> | Applies to all resource types. |
| [Reader](built-in-roles.md#reader) | <ul><li>View Azure resources</li></ul> | Applies to all resource types. |
| [Role Based Access Control Administrator](built-in-roles.md#role-based-access-control-administrator) | <ul><li>Manage user access to Azure resources</li><li>Assign roles in Azure RBAC</li><li>Assign themselves or others the Owner role</li><li>Can't manage access using other ways, such as Azure Policy</li></ul> |
| [User Access Administrator](built-in-roles.md#user-access-administrator) | <ul><li>Manage user access to Azure resources</li><li>Assign roles in Azure RBAC</li><li>Assign themselves or others the Owner role</li></ul> |  |

The rest of the built-in roles allow management of specific Azure resources. For example, the [Virtual Machine Contributor](built-in-roles.md#virtual-machine-contributor) role allows the user to create and manage virtual machines. For a list of all the built-in roles, see [Azure built-in roles](built-in-roles.md).

Only the Azure portal and the Azure Resource Manager APIs support Azure RBAC. Users, groups, and applications that are assigned Azure roles can't use the [Azure classic deployment model APIs](../azure-resource-manager/management/deployment-models.md).

In the Azure portal, role assignments using Azure RBAC appear on the **Access control (IAM)** page. This page can be found throughout the portal, such as management groups, subscriptions, resource groups, and various resources.

:::image type="content" source="./media/shared/sub-role-assignments.png" alt-text="Screenshot of Access control (IAM) page in the Azure portal." lightbox="./media/shared/sub-role-assignments.png":::

When you click the **Roles** tab, you'll see the list of built-in and custom roles.

:::image type="content" source="./media/shared/roles-list.png" alt-text="Screenshot of built-in roles in the Azure portal." lightbox="./media/shared/roles-list.png":::

For more information, see [Assign Azure roles using the Azure portal](role-assignments-portal.yml).

<a name='azure-ad-roles'></a>

## Microsoft Entra roles

[Microsoft Entra roles](../active-directory/roles/custom-overview.md) are used to manage Microsoft Entra resources in a directory such as create or edit users, assign administrative roles to others, reset user passwords, manage user licenses, and manage domains. The following table describes a few of the more important Microsoft Entra roles.

| Microsoft Entra role | Permissions | Notes |
| --- | --- | --- |
| [Global Administrator](../active-directory/roles/permissions-reference.md#global-administrator) | <ul><li>Manage access to all administrative features in Microsoft Entra ID, as well as services that federate to Microsoft Entra ID</li><li>Assign administrator roles to others</li><li>Reset the password for any user and all other administrators</li></ul> | The person who signs up for the Microsoft Entra tenant becomes a Global Administrator. |
| [User Administrator](../active-directory/roles/permissions-reference.md#user-administrator) | <ul><li>Create and manage all aspects of users and groups</li><li>Manage support tickets</li><li>Monitor service health</li><li>Change passwords for users, Helpdesk administrators, and other User Administrators</li></ul> |  |
| [Billing Administrator](../active-directory/roles/permissions-reference.md#billing-administrator) | <ul><li>Make purchases</li><li>Manage subscriptions</li><li>Manage support tickets</li><li>Monitors service health</li></ul> |  |

In the Azure portal, you can see the list of Microsoft Entra roles on the **Roles and administrators** page. For a list of all the Microsoft Entra roles, see [Administrator role permissions in Microsoft Entra ID](../active-directory/roles/permissions-reference.md).

:::image type="content" source="./media/rbac-and-directory-admin-roles/directory-admin-roles.png" alt-text="Screenshot of Microsoft Entra roles in the Azure portal." lightbox="./media/rbac-and-directory-admin-roles/directory-admin-roles.png":::

<a name='differences-between-azure-roles-and-azure-ad-roles'></a>

## Differences between Azure roles and Microsoft Entra roles

At a high level, Azure roles control permissions to manage Azure resources, while Microsoft Entra roles control permissions to manage Microsoft Entra resources. The following table compares some of the differences.

| Azure roles | Microsoft Entra roles |
| --- | --- |
| Manage access to Azure resources | Manage access to Microsoft Entra resources |
| Supports custom roles | Supports custom roles |
| Scope can be specified at multiple levels (management group, subscription, resource group, resource) | [Scope](../active-directory/roles/custom-overview.md#scope) can be specified at the tenant level (organization-wide), administrative unit, or on an individual object (for example, a specific application) |
| Role information can be accessed in Azure portal, Azure CLI, Azure PowerShell, Azure Resource Manager templates, REST API | Role information can be accessed in the Azure portal, Microsoft Entra admin center, Microsoft 365 admin center, Microsoft Graph, Microsoft Graph PowerShell |

<a name='do-azure-roles-and-azure-ad-roles-overlap'></a>

### Do Azure roles and Microsoft Entra roles overlap?

By default, Azure roles and Microsoft Entra roles don't span Azure and Microsoft Entra ID. However, if a Global Administrator elevates their access by choosing the **Access management for Azure resources** switch in the Azure portal, the Global Administrator will be granted the [User Access Administrator](built-in-roles.md#user-access-administrator) role (an Azure role) on all subscriptions for a particular tenant. The User Access Administrator role enables the user to grant other users access to Azure resources. This switch can be helpful to regain access to a subscription. For more information, see [Elevate access to manage all Azure subscriptions and management groups](elevate-access-global-admin.md).

Several Microsoft Entra roles span Microsoft Entra ID and Microsoft 365, such as the Global Administrator and User Administrator roles. For example, if you're a member of the Global Administrator role, you have global administrator capabilities in Microsoft Entra ID and Microsoft 365, such as making changes to Microsoft Exchange and Microsoft SharePoint. However, by default, the Global Administrator doesn't have access to Azure resources.

:::image type="content" source="./media/rbac-and-directory-admin-roles/azure-roles-entra-roles.png" alt-text="Diagram that shows Azure RBAC versus Microsoft Entra roles." lightbox="./media/rbac-and-directory-admin-roles/azure-roles-entra-roles.png":::

## Classic subscription administrator roles

> [!IMPORTANT]
> As of **August 31, 2024**, Azure classic administrator roles (along with Azure classic resources and Azure Service Manager) are retired and no longer supported. If you still have active Co-Administrator or Service Administrator role assignments, convert these role assignments to Azure RBAC immediately.
>
> For more information, see [Azure classic subscription administrators](classic-administrators.md).

Account Administrator, Service Administrator, and Co-Administrator are the three classic subscription administrator roles in Azure. Classic subscription administrators have full access to the Azure subscription. They can manage resources using the Azure portal, Azure Resource Manager APIs, and the classic deployment model APIs. The account that is used to sign up for Azure is automatically set as both the Account Administrator and Service Administrator. Then, additional Co-Administrators can be added. The Service Administrator and the Co-Administrators have the equivalent access of users who have been assigned the Owner role (an Azure role) at the subscription scope. The following table describes the differences between these three classic subscription administrative roles.

| Classic subscription administrator | Limit | Permissions | Notes |
| --- | --- | --- | --- |
| Account Administrator | 1 per Azure account | <ul><li>Can access the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) and manage billing</li><li>Manage billing for all subscriptions in the account</li><li>Create new subscriptions</li><li>Cancel subscriptions</li><li>Change the billing for a subscription</li><li>Change the Service Administrator</li><li>Can't cancel subscriptions unless they have the Service Administrator or subscription Owner role</li></ul> | Conceptually, the billing owner of the subscription. |
| Service Administrator | 1 per Azure subscription | <ul><li>Manage services in the [Azure portal](https://portal.azure.com)</li><li>Cancel the subscription</li><li>Assign users to the Co-Administrator role</li></ul> | By default, for a new subscription, the Account Administrator is also the Service Administrator.<br>The Service Administrator has the equivalent access of a user who is assigned the Owner role at the subscription scope.<br>The Service Administrator has full access to the Azure portal. |
| Co-Administrator | 200 per subscription | <ul><li>Same access privileges as the Service Administrator, but can’t change the association of subscriptions to Microsoft Entra directories</li><li>Assign users to the Co-Administrator role, but can't change the Service Administrator</li></ul> | The Co-Administrator has the equivalent access of a user who is assigned the Owner role at the subscription scope. |

In the Azure portal, you can manage Co-Administrators or view the Service Administrator by using the **Classic administrators** tab.

:::image type="content" source="./media/shared/classic-administrators.png" alt-text="Screenshot of Azure classic subscription administrators in the Azure portal." lightbox="./media/shared/classic-administrators.png":::

For more information, see [Azure classic subscription administrators](classic-administrators.md).

### Azure account and Azure subscriptions

An Azure account is used to establish a billing relationship. An Azure account is a user identity, one or more Azure subscriptions, and an associated set of Azure resources. The person who creates the account is the Account Administrator for all subscriptions created in that account. That person is also the default Service Administrator for the subscription.

Azure subscriptions help you organize access to Azure resources. They also help you control how resource usage is reported, billed, and paid for. Each subscription can have a different billing and payment setup, so you can have different subscriptions and different plans by office, department, project, and so on. Most services belong to a subscription, and the subscription ID may be required for programmatic operations.

Each subscription is associated with a Microsoft Entra directory. To find the directory the subscription is associated with, open **Subscriptions** in the Azure portal and then select a subscription to see the directory.

Accounts and subscriptions are managed in the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade).

## Next steps

- [Assign Azure roles using the Azure portal](role-assignments-portal.yml)
- [Assign Microsoft Entra roles to users](../active-directory/roles/manage-roles-portal.md)
- [Roles for Microsoft 365 services in Microsoft Entra ID](../active-directory/roles/m365-workload-docs.md)
