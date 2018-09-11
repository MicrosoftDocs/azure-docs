---
title: Classic subscription administrator roles, Azure RBAC roles, and Azure AD administrator roles | Microsoft Docs
description: Describes the different roles in Azure - Classic subscription administrator roles, Azure role-based access control (RBAC) roles, and Azure Active Directory (Azure AD) administrator roles 
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman

ms.assetid: 174f1706-b959-4230-9a75-bf651227ebf6
ms.service: role-based-access-control
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: overview
ms.date: 08/07/2018
ms.author: rolyon
ms.reviewer: bagovind
ms.custom: it-pro;
---

# Classic subscription administrator roles, Azure RBAC roles, and Azure AD administrator roles

If you are new to Azure, you may find it a little challenging to understand all the different roles in Azure. This article helps explain the following roles and when you would use each:
- Classic subscription administrator roles
- Azure role-based access control (RBAC) roles
- Azure Active Directory (Azure AD) administrator roles

## How the roles are related

To better understand roles in Azure, it helps to know some of the history. When Azure was initially released, access to resources was managed with just three administrator roles: Account Administrator, Service Administrator, and Co-Administrator. Later, role-based access control (RBAC) for Azure resources was added. Azure RBAC is a newer authorization system that provides fine-grained access management to Azure resources. RBAC includes many built-in roles, can be assigned at different scopes, and allows you to create your own custom roles. To manage resources in Azure AD, such as users, groups, and domains, there are several Azure AD administrator roles.

The following diagram is a high-level view of how the classic subscription administrator roles, Azure RBAC roles, and Azure AD administrator roles are related.

![The different roles in Azure](./media/rbac-and-directory-admin-roles/rbac-admin-roles.png)


## Classic subscription administrator roles

Account Administrator, Service Administrator, and Co-Administrator are the three classic subscription administrator roles in Azure. Classic subscription administrators have full access to the Azure subscription. They can manage resources using the Azure portal, Azure Resource Manager APIs, and the classic deployment model APIs. The account that is used to sign up for Azure is automatically set as both the Account Administrator and Service Administrator. Then, additional Co-Administrators can be added. The Service Administrator and the Co-Administrators have the equivalent access of users who have been assigned the Owner role (an Azure RBAC role) at the subscription scope. The following table describes the differences between these three classic subscription administrative roles.

| Classic subscription administrator | Limit | Permissions | Notes |
| --- | --- | --- | --- |
| Account Administrator | 1 per Azure account | <ul><li>Access the [Azure Account Center](https://account.azure.com/Subscriptions)</li><li>Manage all subscriptions in an account</li><li>Create new subscriptions</li><li>Cancel subscriptions</li><li>Change the billing for a subscription</li><li>Change the Service Administrator</li></ul> | Conceptually, the billing owner of the subscription.<br>The Account Administrator has no access to the Azure portal. |
| Service Administrator | 1 per Azure subscription | <ul><li>Manage services in the [Azure portal](https://portal.azure.com)</li><li>Assign users to the Co-Administrator role</li></ul> | By default, for a new subscription, the Account Administrator is also the Service Administrator.<br>The Service Administrator has the equivalent access of a user who is assigned the Owner role at the subscription scope.<br>The Service Administrator has full access to the Azure portal. |
| Co-Administrator | 200 per subscription | <ul><li>Same access privileges as the Service Administrator, but can’t change the association of subscriptions to Azure directories</li><li>Assign users to the Co-Administrator role, but cannot change the Service Administrator</li></ul> | The Co-Administrator has the equivalent access of a user who is assigned the Owner role at the subscription scope. |

In the Azure portal, you can see who is assigned to the Account Administrator and Service Administrator by viewing the properties of your subscription.

![Account Administrator and Service Administrator in the Azure portal](./media/rbac-and-directory-admin-roles/account-admin-service-admin.png)

For information about how to add or change classic subscription administrators, see [Add or change Azure subscription administrators](../billing/billing-add-change-azure-subscription-administrator.md) in the Azure Billing documentation.

### Azure account and Azure subscriptions

An Azure account represents a billing relationship. An Azure account is a user identity, one or more Azure subscriptions, and an associated set of Azure resources. The person who creates the account is the Account Administrator for all subscriptions created in that account. That person is also the default Service Administrator for the subscription.

Azure subscriptions help you organize access to Azure resources. They also help you control how resource usage is reported, billed, and paid for. Each subscription can have a different billing and payment setup, so you can have different subscriptions and different plans by office, department, project, and so on. Every service belongs to a subscription, and the subscription ID may be required for programmatic operations.

Accounts and subscriptions are managed in the [Azure Account Center](https://account.azure.com/Subscriptions).
## Azure RBAC roles

Azure RBAC is an authorization system built on [Azure Resource Manager](../azure-resource-manager/resource-group-overview.md) that provides fine-grained access management to Azure resources, such as compute and storage. Azure RBAC includes over 70 built-in roles. There are four fundamental RBAC roles. The first three apply to all resource types:

| Azure RBAC role | Permissions | Notes |
| --- | --- | --- |
| [Owner](built-in-roles.md#owner) | <ul><li>Full access to all resources</li><li>Delegate access to others</li></ul> | The Service Administrator and Co-Administrators are assigned the Owner role at the subscription scope<br>Applies to all resource types. |
| [Contributor](built-in-roles.md#contributor) | <ul><li>Create and manage all of types of Azure resources</li><li>Cannot grant access to others</li></ul> | Applies to all resource types. |
| [Reader](built-in-roles.md#reader) | <ul><li>View Azure resources</li></ul> | Applies to all resource types. |
| [User Access Administrator](built-in-roles.md#user-access-administrator) | <ul><li>Manage user access to Azure resources</li></ul> |  |

The rest of the built-in roles allow management of specific Azure resources. For example, the [Virtual Machine Contributor](built-in-roles.md#virtual-machine-contributor) role allows the user to create and manage virtual machines. For a list of all the built-in roles, see [Built-in roles](built-in-roles.md).

Only the Azure portal and the Azure Resource Manager APIs support RBAC. Users, groups, and applications that are assigned RBAC roles cannot use the [Azure classic deployment model APIs](../azure-resource-manager/resource-manager-deployment-model.md).

In the Azure portal, role assignments using RBAC appear on the **Access control (IAM)** blade. This blade can found throughout the portal, such as subscriptions, resource groups, and various resources.

![Access control (IAM) blade in the Azure portal](./media/rbac-and-directory-admin-roles/access-control.png)

When you click the **Roles** option, you will see the list of built-in and custom roles.

![Built-in roles in the Azure portal](./media/rbac-and-directory-admin-roles/built-in-roles.png)

## Azure AD administrator roles

Azure AD administrator roles are used to manage Azure AD resources in a directory such as create or edit users, assign administrative roles to others, reset user passwords, manage user licenses, and manage domains. The following table describes a few of the more important Azure AD administrator roles.

| Azure AD administrator role | Permissions | Notes |
| --- | --- | --- |
| [Global Administrator](../active-directory/users-groups-roles/directory-assign-admin-roles.md#company-administrator) | <ul><li>Manage access to all administrative features in Azure Active Directory, as well as services that federate to Azure Active Directory</li><li>Assign administrator roles to others</li><li>Reset the password for any user and all other administrators</li></ul> | The person who signs up for the Azure Active Directory tenant becomes a Global Administrator. |
| [User Administrator](../active-directory/users-groups-roles/directory-assign-admin-roles.md#user-account-administrator) | <ul><li>Create and manage all aspects of users and groups</li><li>Manage support tickets</li><li>Monitor service health</li><li>Change passwords for users, Helpdesk administrators, and other User Administrators</li></ul> |  |
| [Billing Administrator](../active-directory/users-groups-roles/directory-assign-admin-roles.md#billing-administrator) | <ul><li>Make purchases</li><li>Manage subscriptions</li><li>Manage support tickets</li><li>Monitors service health</li></ul> |  |

For a list of all the Azure AD administrator roles, see [Assigning administrator roles in Azure Active Directory](/azure/active-directory/active-directory-assign-admin-roles-azure-portal).

In the Azure portal, you can see the list of Azure AD administrator roles on the **Roles and administrators** blade.

![Azure AD administrator roles in the Azure portal](./media/rbac-and-directory-admin-roles/directory-admin-roles.png)

## Differences between Azure RBAC roles and Azure AD administrator roles

At a high level, Azure RBAC roles control permissions to manage Azure resources, while Azure AD administrator roles control permissions to manage Azure Active Directory resources. The following table compares some of the differences.

| Azure RBAC roles | Azure AD administrator roles |
| --- | --- |
| Manage access to Azure resources | Manage access to Azure Active Directory resources |
| Supports custom roles | Cannot create your own roles |
| Scope can be specified at multiple levels (management group, subscription, resource group, resource) | Scope is at the tenant level |
| Role information can be accessed in Azure portal, Azure CLI, Azure PowerShell, Azure Resource Manager templates, REST API | Role information can be accessed in Azure admin portal, Office 365 admin portal, Microsoft Graph, AzureAD PowerShell |

### Do Azure RBAC roles and  Azure AD administrator roles overlap?

By default, Azure RBAC roles and Azure AD administrator roles do not span Azure and Azure AD. However, if a Global Administrator elevates their access by choosing the **Global admin can manage Azure Subscriptions and Management Groups** switch in the Azure portal, the Global Administrator will be granted the [User Access Administrator](built-in-roles.md#user-access-administrator) role (an RBAC role) on all subscriptions for a particular tenant. The User Access Administrator role enables the user to grant other users access to Azure resources. This switch can be helpful to regain access to a subscription. For more information, see [Elevate access as an Azure AD administrator](elevate-access-global-admin.md).

Several Azure AD administrator roles span Azure AD and Microsoft Office 365, such as the Global Administrator and User Administrator roles. For example, if you are a member of the Global Administrator role, you have global administrator capabilities in Azure AD and Office 365, such as making changes to Microsoft Exchange and Microsoft SharePoint. However, by default, the Global Administrator doesn't have access to Azure resources.

![Azure RBAC versus Azure AD administrator roles](./media/rbac-and-directory-admin-roles/azure-office-roles.png)

## Next steps

- [What is role-based access control (RBAC)?](overview.md)
- [Assigning administrator roles in Azure Active Directory](/azure/active-directory/active-directory-assign-admin-roles-azure-portal)
- [Add or change Azure subscription administrators](/azure/billing/billing-add-change-azure-subscription-administrator)
