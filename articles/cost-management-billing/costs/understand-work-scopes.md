---
title: Understand and work with Azure Cost Management scopes
description: This article helps you understand billing and resource management scopes available in Azure and how to use the scopes in Cost Management and APIs.
services: cost-management
keywords:
author: bandersmsft
ms.author: banders
ms.date: 10/17/2019
ms.topic: conceptual
ms.service: cost-management-billing
manager: micflan
ms.custom:
---

# Understand and work with scopes

This article helps you understand billing and resource management scopes available in Azure and how to use the scopes in Cost Management and APIs.

## Scopes

A _scope_ is a node in the Azure resource hierarchy where Azure AD users access and manage services. Most Azure resources are created and deployed into resource groups, which are part of subscriptions. Microsoft also offers two hierarchies above Azure subscriptions that have specialized roles to manage billing data:
- Billing data, such as payments and invoices
- Cloud services, such as cost and policy governance

Scopes are where you manage billing data, have roles specific to payments, view invoices, and conduct general account management. Billing and account roles are managed separately from those used for resource management, which use [Azure RBAC](../../role-based-access-control/overview.md). To clearly distinguish the intent of the separate scopes, including the access control differences, these are referred to as _billing scopes_ and _RBAC scopes_, respectively.

## How Cost Management uses scopes

Cost Management works at all scopes above resources to allow organizations to manage costs at the level at which they have access, whether that's the entire billing account or a single resource group. Although billing scopes differ based on your Microsoft agreement (subscription type), the RBAC scopes do not.

## Azure RBAC scopes

Azure supports three scopes for resource management. Each scope supports managing access and governance, including but not limited to, cost management.

- [**Management groups**](../../governance/management-groups/overview.md) - Hierarchical containers, up to eight levels, to organize Azure subscriptions.

    Resource type: [Microsoft.Management/managementGroups](/rest/api/resources/managementgroups)

- **Subscriptions** - Primary containers for Azure resources.

    Resource type: [Microsoft.Resources/subscriptions](/rest/api/resources/subscriptions)

- [**Resource groups**](../../azure-resource-manager/management/overview.md#resource-groups) - Logical groupings of related resources for an Azure solution that share the same lifecycle. For example resources that are deployed and deleted together.

    Resource type: [Microsoft.Resources/subscriptions/resourceGroups](/rest/api/resources/resourcegroups)

Management groups allow you to organize subscriptions into a hierarchy. For example, you might create a logical organization hierarchy using management groups. Then, give teams subscriptions for production and dev/test workloads. And then create resource groups in the subscriptions to manage each sub-system or component.

Creating an organizational hierarchy allows cost and policy compliance roll-up organizationally. Then, each leader can view and analyze their current costs. And then they can create budgets to curb bad spending patterns and optimize costs with Advisor recommendations at the lowest level.

Granting access to view costs and optionally manage cost configuration, such as budgets and exports, is performed on governance scopes using Azure RBAC. You use Azure RBAC to grant Azure AD users and groups access to perform a predefined set of actions that are defined in a role on a specific scope and below. For instance, a role assigned to a management group scope also grants the same permissions to nested subscriptions and resource groups.

Cost Management supports the following built-in roles for each of the following scopes:

- [**Owner**](../../role-based-access-control/built-in-roles.md#owner) – Can view costs and manage everything, including cost configuration.
- [**Contributor**](../../role-based-access-control/built-in-roles.md#contributor) – Can view costs and manage everything, including cost configuration, but excluding access control.
- [**Reader**](../../role-based-access-control/built-in-roles.md#reader) – Can view everything, including cost data and configuration, but cannot make any changes.
- [**Cost Management Contributor**](../../role-based-access-control/built-in-roles.md#cost-management-contributor) – Can view costs, manage cost configuration, and view recommendations.
- [**Cost Management Reader**](../../role-based-access-control/built-in-roles.md#cost-management-reader) – Can view cost data, cost configuration, and view recommendations.

Cost Management Contributor is the recommended least-privilege role. It allows people access to create and manage budgets and exports to more effectively monitor and report on costs. Cost Management Contributors might also require additional roles to support end-to-end cost management scenarios. Consider the following scenarios:

- **Act when budgets are exceeded** – Cost Management Contributors also need access to create and/or manage action groups to automatically react to overages. Consider granting [Monitoring Contributor](../../role-based-access-control/built-in-roles.md#monitoring-contributor) to a resource group that contains the action group to use when budget thresholds are exceeded. Automating specific actions requires additional roles for the specific services used, such as Automation and Azure Functions.
- **Schedule cost data export** – Cost Management Contributors also need access to manage storage accounts to schedule an export to copy data into a storage account. Consider granting [Storage Account Contributor](../../role-based-access-control/built-in-roles.md#storage-account-contributor) to a resource group that contains the storage account where cost data is exported.
- **Viewing cost-saving recommendations** – Cost Management Readers and Cost Management Contributors have access to *view* cost recommendations by default. However, access to act on the cost recommendations requires access to individual resources. Consider granting a [service-specific role](../../role-based-access-control/built-in-roles.md#built-in-role-descriptions) if you want to act on a cost-based recommendation.

## Enterprise Agreement scopes

Enterprise Agreement (EA) billing accounts, also called enrollments, have the following scopes:

- [**Billing account**](../manage/view-all-accounts.md) - Represents an EA enrollment. Invoices are generated at this scope. Purchases that aren't usage-based, such as Marketplace and reservations, are only available at this scope. They aren't represented in departments or enrollment accounts.

    Resource type: `Microsoft.Billing/billingAccounts (accountType = Enrollment)`
- **Department** - Optional grouping of enrollment accounts.

    Resource type: `Billing/billingAccounts/departments`

- **Enrollment account** - Represents a single account owner. Doesn't support granting access to multiple people.

    Resource type: `Microsoft.Billing/billingAccounts/enrollmentAccounts`

Although governance scopes are bound to a single directory, EA billing scopes aren't. An EA billing account may have subscriptions across any number of Azure AD directories.

EA billing scopes support the following roles:

- **Enterprise admin** – Can manage billing account settings and access, can view all costs, and can manage cost configuration. For example, budgets and exports. In function, the EA billing scope is the same as [Cost Management Contributor Azure RBAC role](../../role-based-access-control/built-in-roles.md#cost-management-contributor).
- **Enterprise read-only user** – Can view billing account settings, cost data, and cost configuration. For example, budgets and exports. In function, the EA billing scope is the same as the [Cost Management Reader Azure RBAC role](../../role-based-access-control/built-in-roles.md#cost-management-reader).
- **Department admin** – Can manage department settings, such as cost center, and can access, view all costs, and manage cost configuration. For example, budgets and exports.  The **DA view charges** billing account setting must be enabled for department admins and read-only users to see costs. If **DA view charges** is disabled, department users can't see costs at any level, even if they are an account or subscription owner.
- **Department read-only user** – Can view department settings, cost data, and cost configuration. For example, budgets and exports. If **DA view charges** is disabled, department users can't see costs at any level, even if they are an account or subscription owner.
- **Account owner** – Can manage enrollment account settings (such as cost center), view all costs, and manage cost configuration (such as budgets and exports) for the enrollment account. The **AO view charges** billing account setting must be enabled for account owners and RBAC users to see costs.

EA billing account users don't have direct access to invoices. Invoices are available from an external volume licensing system.

Azure subscriptions are nested under enrollment accounts. Billing users have access to cost data for the subscriptions and resource groups which are under their respective scopes. They don't have access to see or manage resources in the Azure portal. Billing users can view costs by navigating to **Cost Management + Billing** in the Azure portal list of services. Then, they can filter costs to the specific subscriptions and resource groups they need to report on.

Billing users don't have access to management groups because they don't fall explicitly under a specific billing account. Access must be granted to management groups explicitly. Management groups roll-up costs from all nested subscriptions. However, they only include usage-based purchases. They don't include purchases such as reservations and third-party Marketplace offerings. To view these costs, use the EA billing account.

## Individual agreement scopes

Azure subscriptions created from individual offers like pay-as-you-go and related types like Free Trial and dev/test offers, don't have an explicit billing account scope. Instead, each subscription has an account owner or account admin, like the EA account owner.

- [**Billing account**](../manage/view-all-accounts.md) -
Represents a single account owner for one or more Azure subscriptions. It doesn't currently support granting access to multiple people or access to aggregated cost views.

    Resource type: Not applicable

Individual Azure subscription account admins can view and manage billing data, such as invoices and payments, from the [Azure Account Center](https://account.azure.com/subscriptions). However, they can't view cost data or manage resources in the Azure portal. To grant access to the account admin, use the Cost Management roles mentioned previously.

Unlike EA, individual Azure subscription account admins can see their invoices in the Azure portal. Keep in mind that Cost Management Reader and Cost Management Contributor roles don't provide access to invoices. For more information, see [How to grant access to invoices](../manage/manage-billing-access.md#give-read-only-access-to-billing).

## Microsoft Customer Agreement scopes

Microsoft Customer Agreement billing accounts have the following scopes:

- **Billing account** - Represents a customer agreement for multiple Microsoft products and services. Customer Agreement billing accounts aren't functionally the same as EA enrollments. EA enrollments are more closely aligned to billing profiles.

    Resource type: `Microsoft.Billing/billingAccounts (accountType = Organization)`

- **Billing profile** - Defines the subscriptions that are included in an invoice. Billing profiles are the functional equivalent of an EA enrollment, since that's the scope that invoices are generated at. Similarly, purchases that aren't usage-based (such as Marketplace and reservations) are only available at this scope. They aren't included in invoice sections.

    Resource type: `Microsoft.Billing/billingAccounts/billingProfiles`

- **Invoice section** - Represents a group of subscriptions in an invoice or billing profile. Invoice sections are like departments—multiple people can have access to an invoice section.

    Resource type: `Microsoft.Billing/billingAccounts/invoiceSections`

- **Customer** - Represents a group of subscriptions that are associated to a specific customer that is onboarded to a Microsoft Customer Agreement by partner. This scope is specific to CSP.

Unlike EA billing scopes, Customer Agreement billing accounts _are_ bound to a single directory and can't have subscriptions across multiple Azure AD directories.

Customer Agreement billing scopes don't apply to partners. Partner roles and permissions are documented at [Assign users roles and permissions](/partner-center/permissions-overview).

Customer Agreement billing scopes support the following roles:

- **Owner** – Can manage billing settings and access, view all costs, and manage cost configuration. For example, budgets and exports. In function, this Customer Agreement billing scope is the same as the [Cost Management Contributor Azure RBAC role](../../role-based-access-control/built-in-roles.md#cost-management-contributor).
- **Contributor** – Can manage billing settings except access, view all costs, and manage cost configuration. For example, budgets and exports. In function, this Customer Agreement billing scope is the same as the [Cost Management Contributor Azure RBAC role](../../role-based-access-control/built-in-roles.md#cost-management-contributor).
- **Reader** – Can view billing settings, cost data, and cost configuration. For example, budgets and exports. In function, this Customer Agreement billing scope is the same as the [Cost Management Reader Azure RBAC role](../../role-based-access-control/built-in-roles.md#cost-management-reader).
- **Invoice manager** – Can view and pay invoices and can view cost data and configuration. For example, budgets and exports. In function, this Customer Agreement billing scope is the same as the [Cost Management Reader Azure RBAC role](../../role-based-access-control/built-in-roles.md#cost-management-reader).
- **Azure subscription creator** – Can create Azure subscriptions, view costs, and manage cost configuration. For example, budgets and exports. In function, this Customer Agreement billing scope is the same as the EA enrollment account owner role.

Azure subscriptions are nested under invoice sections, like how they are under EA enrollment accounts. Billing users have access to cost data for the subscriptions and resource groups that are under their respective scopes. However, they don't have access to see or manage resources in the Azure portal. Billing users can view costs by navigating to **Cost Management + Billing** in the Azure portal list of services. Then, filter costs to the specific subscriptions and resource groups they need to report on.

Billing users don't have access to management groups because they don't explicitly fall under the billing account. However, when management groups are enabled for the organization, all subscription costs are rolled-up to the billing account and to the root management group because they are both constrained to a single directory. Management groups only include purchases that are usage-based. Purchases like reservations and third-party Marketplace offerings aren't included in management groups. So, the billing account and root management group may report different totals. To view these costs, use the billing account or respective billing profile.

## AWS scopes

After AWS integration is complete, see [setup and configure AWS integration](aws-integration-set-up-configure.md). The following scopes are available:

- **External Billing account** - Represents a customer agreement with a third-party vendor. This is similar to the EA billing account.

    Resource type: `Microsoft.CostManagement/externalBillingAccounts`

- **External subscription** - Represents a customer operational account with a third-party vendor. This is similar to an Azure subscription.

    Resource type: `Microsoft.CostManagement/externalSubscriptions`

## Cloud Solution Provider (CSP) scopes

The following scopes are supported for CSPs with customers on a Microsoft Customer Agreement:

- **Billing account** - Represents a customer agreement for multiple Microsoft products and services. Customer Agreement billing accounts aren't functionally the same as EA enrollments. EA enrollments are more closely aligned to billing profiles.

    Resource type: `Microsoft.Billing/billingAccounts (accountType = Organization)`

- **Billing profile** - Defines the subscriptions that are included in an invoice. Billing profiles are the functional equivalent of an EA enrollment, since that's the scope that invoices are generated at. Similarly, purchases that aren't usage-based (such as Marketplace and reservations) are only available at this scope.

    Resource type: `Microsoft.Billing/billingAccounts/billingProfiles`

- **Customer** - Represents a group of subscriptions that are associated to a specific customer that is onboarded to a Microsoft Customer Agreement by a partner.

Only the users with *Global admin* and *Admin agent* roles can manage and view costs for billing accounts, billing profiles, and customers directly in the partner's Azure tenant. For more information about partner center roles, see [Assign users roles and permissions](/partner-center/permissions-overview).

Azure Cost Management only supports CSP partner customers if the customers have a Microsoft Customer Agreement. For CSP supported customers who are not yet on a Microsoft Customer Agreement, see [Partner Center](https://docs.microsoft.com/azure/cloud-solution-provider/overview/partner-center-overview).

## Switch between scopes in Cost Management

All Cost Management views in the Azure portal include a **Scope** selection pill at the top-left of the view. Use it to quickly change scope. Click the **Scope** pill to open the scope picker. It shows billing accounts, the root management group, and any subscriptions that aren't nested under the root management group. To select a scope, click the background to highlight it and then click **Select** at the bottom. To drill-in to nested scopes, like resource groups in a subscription, click the scope name link. To select the parent scope at any nested level, click **Select this &lt;scope&gt;** at the top of the scope picker.

## Identify the resource ID for a scope

When working with Cost Management APIs, knowing the scope is critical. Use the following information to build the proper scope URI for Cost Management APIs.

### Billing accounts

1. Open the Azure portal and then navigate to **Cost Management + Billing** in the list of services.
2. Select **Properties** in the billing account menu.
3. Copy the billing account ID.
4. Your scope is: `"/providers/Microsoft.Billing/billingAccounts/{billingAccountId}"`

### Billing profiles

1. Open the Azure portal and then navigate to **Cost Management + Billing** in the list of services.
2. Select **Billing profiles** in the billing account menu.
3. Click the name of the desired billing profile.
4. Select **Properties** in the billing profile menu.
5. Copy the billing account and billing profile IDs.
6. Your scope is: `"/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/billingProfiles/{billingProfileId}"`

### Invoice sections

1. Open the Azure portal and then navigate to **Cost Management + Billing** in the list of services.
2. Select **Invoice sections** in the billing account menu.
3. Click the name of the desired invoice section.
4. Select **Properties** in the invoice section menu.
5. Copy the billing account and invoice section IDs.
6. Your scope is: `"/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/invoiceSections/{invoiceSectionId}"`

### EA departments

1. Open the Azure portal and then navigate to **Cost Management + Billing** in the list of services.
2. Select **Departments** in the billing account menu.
3. Click the name of the desired department.
4. Select **Properties** in the department menu.
5. Copy the billing account and department IDs.
6. Your scope is: `"/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/departments/{departmentId}"`

### EA enrollment account

1. Open the Azure portal and navigate to **Cost Management + Billing** in the list of services.
2. Select **Enrollment accounts** in the billing account menu.
3. Click the name of the desired enrollment account.
4. Select **Properties** in the enrollment account menu.
5. Copy the billing account and enrollment account IDs.
6. Your scope is: `"/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/enrollmentAccounts/{enrollmentAccountId}"`

### Management group

1. Open the Azure portal and navigate to **Management groups** in the list of services.
2. Navigate to the desired management group.
3. Copy the management group ID from the table.
4. Your scope is: `"/providers/Microsoft.Management/managementGroups/{id}"`

### Subscription

1. Open the Azure portal and navigate to **Subscriptions** in the list of services.
2. Copy the subscription ID from the table.
3. Your scope is: `"/subscriptions/{id}"`

### Resource groups

1. Open the Azure portal and navigate to **Resource groups** in the list of services.
2. Click the name of the desired resource group.
3. Select **Properties** in the resource group menu.
4. Copy the resource ID field value.
5. Your scope is: `"/subscriptions/{id}/resourceGroups/{name}"`

Cost Management is currently supported in [Azure Global](https://management.azure.com) and [Azure Government](https://management.usgovcloudapi.net). For more information about Azure Government, see [Azure Global and Government API endpoints](../../azure-government/documentation-government-developer-guide.md#endpoint-mapping).

## Next steps

- If you haven't already completed the first quickstart for Cost Management, read it at [Start analyzing costs](quick-acm-cost-analysis.md).
