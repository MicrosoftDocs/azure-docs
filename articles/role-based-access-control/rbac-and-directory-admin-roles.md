---
title: Understand Azure Active Directory administrator roles and Azure RBAC roles | Microsoft Docs
description: Explains the different roles in Azure - Classic subscription administrator roles, Azure Active Directory (Azure AD) administrator roles, and Azure role-based access control (RBAC) roles
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman

ms.assetid: 174f1706-b959-4230-9a75-bf651227ebf6
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/30/2018
ms.author: rolyon
ms.custom: it-pro;
---

# Understand Azure Active Directory administrator roles and Azure RBAC roles

If you are new to Azure, you may find it challenging to understand all the different roles in Azure. This article will help explain the following roles and when you would use each:
- Classic subscription administrator roles
- Azure Active Directory (Azure AD) administrator roles
- Azure role-based access control (RBAC) roles

## What is the difference between administrator roles and RBAC roles?

When Azure was initially released, access to resources was managed with just three administrator roles: Account administrator, Service administrator, and Co-administrator. Later these administrator roles were expanded to include several more administrator roles. These administrator roles provide basic access management.

Azure role-based access control (RBAC) is a newer system built on Azure Resource Manager that provides fine-grained access management with many built-in roles, flexibility of scope, and custom roles.

## Classic subscription administrators

Account administrator, Service administrator, and Co-administrator are the three classic subscription administrator roles in Azure. Classic subscription administrators have full access to the Azure subscription. They can manage resources using the Azure portal, Azure Resource Manager APIs, and the classic deployment model APIs. The account that is used to sign up for Azure is automatically set as both the Account administrator and Service administrator. Then, additional Co-administrators can be added. In the RBAC model, the Service administrator and the Co-administrators are assigned the Owner role at the subscription scope. The following table describes the differences between these three administrative roles.

> [!div class="mx-tableFixed"]
> | Classic subscription administrator | Limit | Permissions | Notes |
> | --- | --- | --- | --- |
> | Account administrator | 1 per Azure account | Access the Account Center<br>Create new subscriptions<br>Cancel subscriptions<br>Change the billing for a subscription<br>Change the Service administrator | Conceptually, the billing owner of the subscription.<br>In RBAC, the Account administrator isn't assigned a role.<br>|
> | Service administrator | 1 per Azure subscription | Manage services in the Azure portal | By default, for a new subscription, the Account administrator is also the Service administrator.<br>In RBAC, the Service administrator is assigned the Owner role at the subscription scope. |
> | Co-administrator | 200 per subscription | Same access privileges as the Service administrator but can’t change the association of subscriptions to Azure directories. | In RBAC, the Co-administrator is assigned the Owner role at the subscription scope. |

In the Azure portal, you can see who is assigned to the Account administrator and Service administrator by viewing the properties of your subscription.

![Account administrator and Service administrator in the Azure portal](./media/rbac-and-directory-admin-roles/account-admin-service-admin.png)

For more information about classic subscription administrators, see Add or change Azure subscription administrators in the [Azure Billing documentation](/azure/billing/billing-add-change-azure-subscription-administrator).

## Azure AD administrator roles

Azure AD administrator roles control permissions to manage Azure AD resources such as create or edit users, assign administrative roles to others, reset user passwords, manage user licenses, and manage domains. The following table describes a few of the more important Azure AD administrator roles.

> [!div class="mx-tableFixed"]
> | Azure AD administrator role | Permissions | Notes |
> | --- | --- | --- |
> | Global administrator | Access to all administrative features in Azure Active Directory, as well as services that federate to Azure Active Directory.<br>Assign other administrator roles.<br>Reset the password for any user and all other administrators. | The person who signs up for the Azure Active Directory tenant becomes a Global administrator. |
> | User administrator | Create and manage all aspects of users and groups.<br>Manage support tickets.<br>Monitor service health.<br>Change passwords for users, Helpdesk administrators, and other User administrators. |  |
> | Password administrator | Change passwords for users and other Helpdesk administrators.<br>Manage service requests.<br>Monitor service health. |  |
> | Billing administrator | Make purchases.<br>Manage subscriptions.<br>Manage support tickets.<br>Monitors service health. |  |

In the Azure portal, you can assign the Azure AD administrator roles in the **Azure Active Directory** pane.

![Azure AD administrator roles in the Azure portal](./media/rbac-and-directory-admin-roles/directory-admin-roles.png)

For more information about the Azure AD administrator roles, see [Assigning administrator roles in Azure Active Directory](/azure/active-directory/active-directory-assign-admin-roles-azure-portal).

## Azure RBAC roles

Azure RBAC includes several built-in roles that control permissions to manage Azure resources such as compute and storage. There are four fundamental RBAC roles. The first three apply to all resource types:

> [!div class="mx-tableFixed"]
> | RBAC role | Permissions | Notes |
> | --- | --- | --- |
> | Owner | Full access to all resources<br>Delegate access to others | The Service administrator and Co-administrators are assigned the Owner role at the subscription scope.<br>Applies to all resource types. |
> | Contributor | Create and manage all of types of Azure resources<br>Cannot grant access to others | Applies to all resource types. |
> | Reader | View Azure resources | Applies to all resource types. |
> | User Access Administrator | Manage user access to Azure resources |  |

The rest of the built-in roles allow management of specific Azure resources. For example, the [Virtual Machine Contributor](built-in-roles.md#virtual-machine-contributor) role allows the user to create and manage virtual machines. For a complete list of built-in roles, see [Built-in roles](built-in-roles.md).

In the Azure portal, role assignment using RBAC appears in the **Access control (IAM)** pane. This pane can found throughout the portal, such as subscriptions, resource groups, and various resources.

![Access control (IAM) pane in the Azure portal](./media/rbac-and-directory-admin-roles/access-control.png)

![Built-in roles in the Azure portal](./media/rbac-and-directory-admin-roles/built-in-roles.png)

For a tour of role-based access control in the portal, see Quickstart: Tour of role-based access control in the Azure portal.

## What is the difference between Azure RBAC roles and Azure AD administrator roles?

At a high level, Azure RBAC roles control permissions to manage Azure resources, while Azure AD administrator roles control permissions to manage Azure Active Directory resources. By default, RBAC roles and Azure AD administrator roles do not span Azure and Azure AD.

> [!div class="mx-tableFixed"]
> | Azure RBAC roles | Azure AD administrator roles |
> | --- | --- |
> | Access management to Azure resources | Access management to Azure AD resources |
> | Several built-in roles | Limited number of roles |
> | Supports custom roles | Cannot create your own roles |
> | Scope can be specified at multiple levels (subscription, resource group, resource) | Scope is typically at the tenant level |
> | Cannot be used for classic Azure deployments | Can manage classic Azure deployments |
> | Role information can be accessed in Azure portal, Azure PowerShell, REST API | Role information can be accessed in Azure admin portal, Office 365 admin portal, Microsoft Graph, AzureAD PowerShell |

![Azure RBAC versus Azure AD administrator roles](./media/rbac-and-directory-admin-roles/rbac-admin-roles.png)

## What are the different types of roles?

Roles are always evolving, but here is a list of roles to help you understand the different types.

> [!div class="mx-tableFixed"]
> | Role | Classic subscription administrator | Azure AD administrator | Azure RBAC |
> | --- | :---: | :---: | :---: |
> | Account administrator | X |  |  |
> | Service administrator | X |  |  |
> | Co-administrator | X |  |  |
> | Global administrator |  | X |  |
> | Billing administrator |  | X |  |
> | Compliance administrator |  | X |  |
> | Conditional Access administrator |  | X |  |
> | Exchange administrator |  | X |  |
> | Guest inviter |  | X |  |
> | Password administrator |  | X |  |
> | Information Protection administrator |  | X |  |
> | Intune Service administrator |  | X |  |
> | Skype for Business administrator |  | X |  |
> | Privileged role administrator |  | X |  |
> | Reports reader |  | X |  |
> | Security administrator |  | X |  |
> | Security reader |  | X |  |
> | Service administrator |  | X |  |
> | SharePoint administrator |  | X |  |
> | User administrator |  | X |  |
> | [Owner](built-in-roles.md#owner) |  |  | X |
> | [Contributor](built-in-roles.md#contributor) |  |  | X |
> | [Reader](built-in-roles.md#reader) |  |  | X |
> | [AcrImageSigner](built-in-roles.md#acrimagesigner) |  |  | X |
> | [AcrQuarantineReader](built-in-roles.md#acrquarantinereader) |  |  | X |
> | [AcrQuarantineWriter](built-in-roles.md#acrquarantinewriter) |  |  | X |
> | [API Management Service Contributor](built-in-roles.md#api-management-service-contributor) |  |  | X |
> | [API Management Service Operator Role](built-in-roles.md#api-management-service-operator-role) |  |  | X |
> | [API Management Service Reader Role](built-in-roles.md#api-management-service-reader-role) |  |  | X |
> | [Application Insights Component Contributor](built-in-roles.md#application-insights-component-contributor) |  |  | X |
> | [Application Insights Snapshot Debugger](built-in-roles.md#application-insights-snapshot-debugger) |  |  | X |
> | [Automation Job Operator](built-in-roles.md#automation-job-operator) |  |  | X |
> | [Automation Operator](built-in-roles.md#automation-operator) |  |  | X |
> | [Automation Runbook Operator](built-in-roles.md#automation-runbook-operator) |  |  | X |
> | [Azure Stack Registration Owner](built-in-roles.md#azure-stack-registration-owner) |  |  | X |
> | [Backup Contributor](built-in-roles.md#backup-contributor) |  |  | X |
> | [Backup Operator](built-in-roles.md#backup-operator) |  |  | X |
> | [Backup Reader](built-in-roles.md#backup-reader) |  |  | X |
> | [Billing Reader](built-in-roles.md#billing-reader) |  |  | X |
> | [BizTalk Contributor](built-in-roles.md#biztalk-contributor) |  |  | X |
> | [CDN Endpoint Contributor](built-in-roles.md#cdn-endpoint-contributor) |  |  | X |
> | [CDN Endpoint Reader](built-in-roles.md#cdn-endpoint-reader) |  |  | X |
> | [CDN Profile Contributor](built-in-roles.md#cdn-profile-contributor) |  |  | X |
> | [CDN Profile Reader](built-in-roles.md#cdn-profile-reader) |  |  | X |
> | [Classic Network Contributor](built-in-roles.md#classic-network-contributor) |  |  | X |
> | [Classic Storage Account Contributor](built-in-roles.md#classic-storage-account-contributor) |  |  | X |
> | [Classic Storage Account Key Operator Service Role](built-in-roles.md#classic-storage-account-key-operator-service-role) |  |  | X |
> | [Classic Virtual Machine Contributor](built-in-roles.md#classic-virtual-machine-contributor) |  |  | X |
> | [ClearDB MySQL DB Contributor](built-in-roles.md#cleardb-mysql-db-contributor) |  |  | X |
> | [Cosmos DB Account Reader Role](built-in-roles.md#cosmos-db-account-reader-role) |  |  | X |
> | [Data Factory Contributor](built-in-roles.md#data-factory-contributor) |  |  | X |
> | [Data Lake Analytics Developer](built-in-roles.md#data-lake-analytics-developer) |  |  | X |
> | [DevTest Labs User](built-in-roles.md#devtest-labs-user) |  |  | X |
> | [DNS Zone Contributor](built-in-roles.md#dns-zone-contributor) |  |  | X |
> | [DocumentDB Account Contributor](built-in-roles.md#documentdb-account-contributor) |  |  | X |
> | [Intelligent Systems Account Contributor](built-in-roles.md#intelligent-systems-account-contributor) |  |  | X |
> | [Key Vault Contributor](built-in-roles.md#key-vault-contributor) |  |  | X |
> | [Lab Creator](built-in-roles.md#lab-creator) |  |  | X |
> | [Log Analytics Contributor](built-in-roles.md#log-analytics-contributor) |  |  | X |
> | [Log Analytics Reader](built-in-roles.md#log-analytics-reader) |  |  | X |
> | [Logic App Contributor](built-in-roles.md#logic-app-contributor) |  |  | X |
> | [Logic App Operator](built-in-roles.md#logic-app-operator) |  |  | X |
> | [Managed Identity Contributor](built-in-roles.md#managed-identity-contributor) |  |  | X |
> | [Managed Identity Operator](built-in-roles.md#managed-identity-operator) |  |  | X |
> | [Monitoring Contributor](built-in-roles.md#monitoring-contributor) |  |  | X |
> | [Monitoring Reader](built-in-roles.md#monitoring-reader) |  |  | X |
> | [Network Contributor](built-in-roles.md#network-contributor) |  |  | X |
> | [New Relic APM Account Contributor](built-in-roles.md#new-relic-apm-account-contributor) |  |  | X |
> | [Reader and Data Access](built-in-roles.md#reader-and-data-access) |  |  | X |
> | [Redis Cache Contributor](built-in-roles.md#redis-cache-contributor) |  |  | X |
> | [Resource Policy Contributor (Preview)](built-in-roles.md#resource-policy-contributor-preview) |  |  | X |
> | [Scheduler Job Collections Contributor](built-in-roles.md#scheduler-job-collections-contributor) |  |  | X |
> | [Search Service Contributor](built-in-roles.md#search-service-contributor) |  |  | X |
> | [Security Admin](built-in-roles.md#security-admin) |  |  | X |
> | [Security Manager (Legacy)](built-in-roles.md#security-manager-legacy) |  |  | X |
> | [Security Reader](built-in-roles.md#security-reader) |  |  | X |
> | [Site Recovery Contributor](built-in-roles.md#site-recovery-contributor) |  |  | X |
> | [Site Recovery Operator](built-in-roles.md#site-recovery-operator) |  |  | X |
> | [Site Recovery Reader](built-in-roles.md#site-recovery-reader) |  |  | X |
> | [SQL DB Contributor](built-in-roles.md#sql-db-contributor) |  |  | X |
> | [SQL Security Manager](built-in-roles.md#sql-security-manager) |  |  | X |
> | [SQL Server Contributor](built-in-roles.md#sql-server-contributor) |  |  | X |
> | [Storage Account Contributor](built-in-roles.md#storage-account-contributor) |  |  | X |
> | [Storage Account Key Operator Service Role](built-in-roles.md#storage-account-key-operator-service-role) |  |  | X |
> | [Storage Blob Data Contributor (Preview)](built-in-roles.md#storage-blob-data-contributor-preview) |  |  | X |
> | [Storage Queue Data Contributor (Preview)](built-in-roles.md#storage-queue-data-contributor-preview) |  |  | X |
> | [Storage Queue Data Reader (Preview)](built-in-roles.md#storage-queue-data-reader-preview) |  |  | X |
> | [Support Request Contributor](built-in-roles.md#support-request-contributor) |  |  | X |
> | [Traffic Manager Contributor](built-in-roles.md#traffic-manager-contributor) |  |  | X |
> | [User Access Administrator](built-in-roles.md#user-access-administrator) |  |  | X |
> | [Virtual Machine Administrator Login](built-in-roles.md#virtual-machine-administrator-login) |  |  | X |
> | [Virtual Machine Contributor](built-in-roles.md#virtual-machine-contributor) |  |  | X |
> | [Virtual Machine User Login](built-in-roles.md#virtual-machine-user-login) |  |  | X |
> | [Web Plan Contributor](built-in-roles.md#web-plan-contributor) |  |  | X |
> | [Website Contributor](built-in-roles.md#website-contributor) |  |  | X |

## Next Steps

- [Add or change Azure subscription administrators](/azure/billing/billing-add-change-azure-subscription-administrator#types-of-classic-subscription-admins)
- [Assigning administrator roles in Azure Active Directory](/azure/active-directory/active-directory-assign-admin-roles-azure-portal)
- [Role-based access control overview](overview.md)
