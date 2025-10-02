---
title: Understand and work with Cost Management scopes
titleSuffix: Microsoft Cost Management
description: This article helps you understand billing and resource management scopes available in Azure and how to use the scopes in Cost Management and APIs.
author: vikramdesai01
ms.author: vikdesai
ms.date: 07/22/2025
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: vikdesai
ms.custom:
---

# Understand and work with scopes

Understanding scopes is essential to effectively manage and analyze costs in Azure. A _scope_ is a type of boundary—like a subscription, resource group, or billing account—within which users can view, manage, and analyze cost data based on their assigned roles and permissions. This guide explains the types of scopes available in Microsoft Cost Management, how they relate to roles and permissions, and how they apply to Cost Management experiences in the Azure portal and to its APIs.

## Scope types

Cost Management allows users to view and manage costs at any scope level they have access to. Each scope provides visibility into cost data and supports budgeting, exporting, and cost optimization features. There are two types of scopes used in Cost Management:

- **Azure RBAC Scopes:** These scopes are part of the Azure resource hierarchy where Microsoft Entra’s users’ access and manage services and include the Subscription, resource group, resource and management group scopes.
- **Billing scopes:** These scopes are higher-level containers than Azure subscriptions. They help organize and manage billing—like payments and invoices—as well as cloud services such as cost tracking and policy management. These scopes include the Enrollment Agreement (EA), EA Department and EA Account, Microsoft Customer Agreement (MCA), Billing Profile and Invoice Section.

To learn more about scopes, watch the [Cost Management setting up hierarchies](https://www.youtube.com/watch?v=n3TLRaYJ1NY) video. To watch other videos, visit the [Cost Management YouTube channel](https://www.youtube.com/c/AzureCostManagement).

>[!VIDEO https://www.youtube.com/embed/n3TLRaYJ1NY]

## Azure RBAC scopes

Azure RBAC scopes are used to manage access and governance of Azure resources including, but not limited to, Cost Management. These include:

- **Subscriptions** - Containers for Azure resources.
  
    Resource type: [Microsoft.Resources/subscriptions](/rest/api/resources/subscriptions)

- **[Resource groups](../../azure-resource-manager/management/overview.md#resource-groups)** - Logical groupings of related resources for an Azure solution, that share the same lifecycle. For example resources that are deployed and deleted together. Resource groups are nested within a subscription.

    Resource type: [Microsoft.Resources/subscriptions/resourceGroups](/rest/api/resources/resourcegroups)

- [**Management groups**](../../governance/management-groups/overview.md) - Organize subscriptions into a hierarchy. A management group tree can support up to six levels of depth. The limit doesn't include the root level or the subscription level. For example, you might create a logical organization hierarchy using management groups, and then give teams subscriptions for production and dev/test workloads. After that you can create resource groups in the subscriptions to manage each subsystem or component.

    Resource type: [Microsoft.Management/managementGroups](/rest/api/managementgroups/)

> [!NOTE]
> Management groups aren't currently supported in Cost Management features for Microsoft Customer Agreement subscriptions. The [Cost Details API](/rest/api/cost-management/generate-cost-details-report/create-operation) also doesn't support management groups for either EA or MCA customers.

### Roles used in Cost Management on RBAC scopes

Within scopes, roles can be given to grant Microsoft Entra users and groups access to do a predefined set of actions. Different roles enable different sets of actions. In the context of Cost Management, roles enable access to view cost data and configure actions, such as managing budgets and exports.
Roles are defined and controlled through Azure Role-Based Access Control (RBAC). Roles defined at a specific scope automatically apply to its child scopes. For instance, a role assigned to a management group scope also grants the same permissions to nested subscriptions and resource groups.

Cost Management supports the following built-in roles:

- [**Owner**](../../role-based-access-control/built-in-roles.md#owner) – Full access to cost data, including cost configuration.
- [**Contributor**](../../role-based-access-control/built-in-roles.md#contributor) – Full access to cost data and cost configuration, excluding access control.
- [**Reader**](../../role-based-access-control/built-in-roles.md#reader) – View-only access.
- [**Cost Management Contributor**](../../role-based-access-control/built-in-roles.md#cost-management-contributor) – Full access to cost data, including cost configuration and view recommendations.
- [**Cost Management Reader**](../../role-based-access-control/built-in-roles.md#cost-management-reader) – View-only access to cost data and recommendations.

| **Capability** | **Cost Management Reader** | **Cost Management Contributor** |
| --- | --- | --- |
| View cost data (Cost Analysis, Forecast, etc.) | ✅ Yes | ✅ Yes |
| View cost configuration (budgets, exports) | ✅ Yes | ✅ Yes |
| Create and manage budgets | ❌ No | ✅ Yes |
| Create and manage exports | ❌ No | ✅ Yes |
| View cost-saving recommendations | ✅ Yes | ✅ Yes |
| Act on cost-saving recommendations | ❌ No (needs resource access) | ❌ No (needs resource access) |
| Create shared views | ❌ No | ✅ Yes |
| Manage alerts (for example, budget threshold alerts) | ❌ No | ✅ Yes |

Cost Management Contributor is the recommended least privilege role. This role allows people to create and manage budgets and exports to more effectively monitor and report on costs. However, Cost Management Contributors might also require more roles to support complex cost management scenarios. Consider the following scenarios and the suggested added roles:

- **Report on resource usage** – Cost Management provides detailed charges that help uncover patterns in how resources are consumed. This level of granularity supports deep analysis at the resource level. If even more detailed metrics are needed—such as performance counters or logs—consider assigning the [Monitoring Reader](../../role-based-access-control/built-in-roles.md#monitoring-reader) role at the same billing or RBAC scope. This grants access to Azure Monitor for enhanced visibility.
- **React to exceeded budgets** – To automatically respond when a budget threshold is exceeded, the user needs more than just the **Cost Management Contributor** role. They must also have permission to create and manage **action groups**, which are used to trigger alerts or automation. Assign the [Monitoring Contributor](../../role-based-access-control/built-in-roles.md#monitoring-contributor) role at the resource group level that contains the action group. Additionally, if automated actions are required—such as running scripts or workflows—grant roles for the specific service actions are needed for, such as Automation or Azure Functions.
- **Schedule cost data export** – To enable Cost Management to export data to a storage account, the user needs more than the **Cost Management Contributor** role. They must also have permission to manage the target storage account. Assign the [Storage Account Contributor](../../role-based-access-control/built-in-roles.md#storage-account-contributor) role at the resource group level that contains the storage account where the cost data is exported.
- **Act on cost-saving recommendations** – By default both Cost Management Readers and Cost Management Contributors can _view_ cost recommendations. However, to act on those recommendations, such as resizing or shutting down resources – the user must also have access to the specific resources involved. To enable this access, assign the appropriate [service-specific role](../../role-based-access-control/built-in-roles.md) (for example, Virtual Machine Contributor, SQL DB Contributor) at the relevant scope.

### Feature behavior for each role in RBAC scopes

This table outlines the permissions assigned to each role within the Azure RBAC scopes (Subscription/Resource Group/Management Group), for various Cost Management features. For example, as a subscription owner you can only view reports (“views”) in Cost Analysis, but you can create shared views and budgets.

| **Feature/Role** | **Owner** | **Contributor** | **Reader** | **Cost Management Reader** | **Cost Management Contributor** |
| --- | --- | --- | --- | --- | --- |
| **Cost Analysis / Forecast / Query / Cost Details API** | Read only | Read only | Read only | Read only | Read only |
| **Shared views** | Create, Read, Update, Delete | Create, Read, Update, Delete | Read only | Read only |  Create, Read, Update, Delete|
| **Budgets** | Create, Read, Update, Delete | Create, Read, Update, Delete | Read only | Read only | Create, Read, Update, Delete |
| **Alerts** | Read, Update | Read, Update | Read only | Read only | Read, Update |
| **Exports** | Create, Read, Update, Delete | Create, Read, Update, Delete | Read only | Read only | Create, Read, Update, Delete |
| **Cost Allocation rules** | Feature not available for Azure RBAC scopes | Feature not available for Azure RBAC scopes | Feature not available for Azure RBAC scopes | Feature not available for Azure RBAC scopes | Feature not available for Azure RBAC scopes |
| **Tag Inheritance** | View only - Available at subscription scope only | View only - Available at subscription scope only | View only - Available at subscription scope only| View only - Available at subscription scope only| View only - Available at subscription scope only |

Keep in mind that Cost Management Reader and Cost Management Contributor roles don't provide access to invoices. For more information, see [How to grant access to invoices](../manage/manage-billing-access.md#give-read-only-access-to-billing).

## Billing scopes

Billing scopes differ based on your Microsoft agreement type:

- **Enterprise Agreement (EA):** Includes Billing Account, Department, and Enrollment Account.
- **Microsoft Customer Agreement (MCA):** Includes Billing Account, Billing Profile, and Invoice Section.
- **Cloud Solution Provider (CSP):** Includes Billing Account, Billing Profile, and Customer.

### Enterprise Agreement billing scopes

Enterprise Agreement (EA), also called enrollments, has the following billing scopes:

- [**Billing account**](../manage/view-all-accounts.md) - Represents an EA enrollment and is the scope at which invoices are generated. All purchase and usage charges are visible in this scope in both the Actual and Amortized Cost datasets, with some important distinctions.
  
  The Actual Cost dataset includes all meter-emitted usage charges from Azure, Marketplace and Microsoft 365 offers. It also includes purchases from Marketplace and Microsoft 365, as well as commitment-based benefits (reservations and savings plans). The benefit offsets the charges, so usage records covered by a commitment appear with zero costs.  
  
  The Amortized Cost data set, also includes all usage records, Marketplace and Microsoft 365 purchases. However, the commitment-based purchases do not appear directly because their costs are amortized and applied to the usage where the benefit is consumed. As a result, the same usage that appears with zero costs in Actual Cost, shows charges in the Amortized Cost dataset. The Amortized Cost data set doesn't match your invoice, since it reflects amortized allocations rather than billed amounts.
  
  Learn more about amortized costs here [View amortized benefit costs](/azure/cost-management-billing/reservations/view-amortized-costs).
  
  Resource type: `Microsoft.Billing/billingAccounts (accountType = Enrollment)`

- **Department** - Optional grouping of enrollment accounts within a billing account. Usage charges are available on this scope. Purchases, such as Marketplace and commitment-based benefits like reservations, are not available at this scope.

    Resource type: `Billing/billingAccounts/departments`

- **Enrollment account** - Represents a single account and has one account owner. Doesn't support granting access to multiple users to serve as account owners. Usage charges are available on this scope. Purchases, such as Marketplace and reservations, are not available on this scope.

    Resource type: `Microsoft.Billing/billingAccounts/enrollmentAccounts`

Although RBAC scopes are bound to a single directory, EA billing scopes aren't. An EA billing account may have subscriptions across any number of Microsoft Entra directories.

#### Roles used in Cost Management on Enterprise Agreement scopes

##### Billing Account roles

- **Enterprise admin** – Can view all cost data. Can manage billing account settings and control who can see cost details, like enabling account owner (AO) or department admins (DA) to view charges. Users with this role automatically have the same permissions at the Department and Account scopes within the same enrollment.
- **Enterprise read-only user** – Can view billing account settings, cost data, and cost configuration, but cannot modify them. Can manage budgets and exports. Users with this role automatically have the same permissions at the Department and Account scopes within the same enrollment.

##### Feature behavior per role in Enrollment Agreement scope

| **Feature/Role** | **Enterprise Admin** | **Enterprise Read-Only** |
| --- | --- | --- |
| **Cost Analysis / Forecast / Query / Cost Details API** | Read only | Read only |
| **Shared Views** | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **Budgets/Reservation utilization alerts** | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **Alerts** | Read, Update | Read, Update |
| **Exports** | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **Cost Allocation Rules** | Create, Read, Update, Delete | Read |

##### Department roles

- **Department admin** – Can view all costs when “DA view charges” is enabled by the Enterprise admin in the billing account. Can manage department settings, such as cost center and name. Can manage budgets and exports. Can view and manage the same also at Account scopes.
- **Department read-only user** – Can view department settings, cost data, and cost configuration. Can manage budgets and exports. Can view the same also at Account scopes.
  
The billing account **DA view charges** setting must be enabled for department admins and read-only users to see costs. If **DA view charges** option is disabled, department users can't see costs at any level, even if they're an account or subscription owner.

##### Feature behavior per role in enrollment Department scope

| **Feature/Role** | **Enterprise Admin** | **Enterprise Read Only** | **Department Admin (only if "DA view charges" setting is on)** | **Department Read Only (only if "DA view charges" setting is on)** |
| --- | --- | --- | --- | --- |
| **Cost Analysis / Forecast / Query / Cost Details API** | Read only | Read only | Read only | Read only |
| **Shared Views** | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **Budgets** | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **Alerts** | Read, Update | Read, Update | Read, Update | Read, Update |
| **Exports** | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **Cost Allocation Rules** | N/A – only applicable to Billing Account scope | N/A – only applicable to Billing Account scope | N/A – only applicable to Billing Account scope | N/A – only applicable to Billing Account scope |

##### Account roles

- **Account owner** – Can manage enrollment account settings (such as cost center), view all costs, and manage cost configuration (such as budgets and exports) for the enrollment account. The billing account AO view charges setting must be enabled for account owners and Azure RBAC users to see costs.
  
Azure subscriptions are nested under enrollment accounts. Users with roles assigned at billing scopes have access to cost data for the subscriptions and the resource groups that are under their respective scopes. However, they don't have access to see or manage the actual resources in the Azure portal. Users can view costs by navigating to the **Cost Management + Billing** service in the Azure portal. Then, they can filter costs to the specific subscriptions and resource groups they need to analyze or report on.

Users with billing scopes roles don't have access to management groups because they don't fall under a specific billing account. Access must be explicitly granted to management groups. Management groups roll up usage-based costs from all nested subscriptions. However, they don't include purchases such as reservations and third-party Marketplace offerings. To view these costs, the EA billing account scope should be used.

##### Feature behavior per role in enrollment Account scope

| **Feature/Role** | **Enterprise Admin** | **Enterprise Read Only** | **Department Admin (only if "DA view charges" is on)** | **Department Read Only (only if "DA view charges" setting is on)** | **Account Owner (only if "AO view charges" setting is on)** |
| --- | --- | --- | --- | --- | --- |
| **Cost Analysis / Forecast / Query / Cost Details API** | Read only | Read only | Read only | Read only | Read only |
| **Shared Views** | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **Budgets** | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **Alerts** | Read, Update | Read, Update | Read, Update | Read, Update | Read, Update |
| **Exports** | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **Cost Allocation Rules** | N/A – only applicable to Billing Account scope | N/A – only applicable to Billing Account scope | N/A – only applicable to Billing Account scope | N/A – only applicable to Billing Account scope | N/A – only applicable to Billing Account scope |

### Microsoft Customer Agreement scopes

Microsoft Customer Agreement (MCA) billing accounts have the following scopes:

- **Billing account** - Represents a customer agreement for multiple Microsoft products and services. Customer Agreement billing accounts aren't functionally the same as EA enrollments. EA enrollments are more closely aligned to billing profiles.

    Resource type: `Microsoft.Billing/billingAccounts (accountType = Organization)`

- **Billing profile** - Groups all the subscriptions that are included in an invoice. Billing profiles are the functional equivalent of an EA enrollment, since that's the scope that invoices are generated at. Similarly, purchases that aren't usage-based (such as Marketplace and reservations) are only available at this scope. They aren't included in invoice sections.

    Resource type: `Microsoft.Billing/billingAccounts/billingProfiles`

- **Invoice section** - Enables grouping of subscriptions within a billing profile into individual sections in one invoice. Invoice sections are like departments—multiple people can have access to an invoice section.

    Resource type: `Microsoft.Billing/billingAccounts/invoiceSections`

- **Customer** - Represents a group of subscriptions that are associated with a specific customer that is onboarded to an MCA by a partner. This scope is specific to Cloud Solution Providers (CSP).

A single Microsoft Entra directory manages MCA billing accounts, unlike EA billing scopes. However, MCA billing accounts can have _**linked**_ subscriptions that could be in different directories.

MCA billing scopes don't apply to partners. Partner roles and permissions are documented at [Assign users roles and permissions](/partner-center/permissions-overview).

#### Roles used in Cost Management in Microsoft Customer Agreement scopes

MCA billing scopes support the following roles:

- **Owner** – Can manage billing settings and access, view all costs, and manage cost configuration. For example, budgets and exports. In function, in the context of Cost Management, this role is the same as the [Cost Management Contributor Azure role](../../role-based-access-control/built-in-roles.md#cost-management-contributor).
- **Contributor** – Can manage billing settings except access, view all costs, and manage cost configuration. For example, budgets and exports. In function, in the context of Cost Management, this role is the same as the [Cost Management Contributor Azure role](../../role-based-access-control/built-in-roles.md#cost-management-contributor).
- **Reader** – Can view billing settings, cost data, and cost configuration. Can manage budgets and exports.
- **Invoice manager** – Can view and pay invoices and can view cost data and configuration. Can manage budgets and exports.
- **Azure subscription creator** – Can create Azure subscriptions, view costs, and manage cost configuration. For example, budgets and exports. In function, this MCA role is the same as the EA enrollment account owner role.

Azure subscriptions are nested under invoice sections, like how they are under EA enrollment accounts. Billing users have access to cost data for the subscriptions and resource groups that are under their respective scopes. However, they don't have access to see or manage resources in the Azure portal. Billing users can view costs by navigating to **Cost Management + Billing** in the Azure portal list of services. Then, filter costs to the specific subscriptions and resource groups they need to report on.

> [!NOTE]
> Management group scopes aren't currently supported for Microsoft Customer Agreement accounts.

Billing users don't have access to management groups because they don't explicitly fall under the billing account. However, when management groups are enabled for the organization, all subscription costs are rolled up to the billing account and to the root management group because they're both constrained to a single directory. Management groups only include usage-based charges. Purchases like reservations and third-party Marketplace offerings aren't included in management groups. So, the billing account and root management group may report different totals. To view the costs, including purchases, use the billing account or respective billing profile scopes.

#### Feature behavior per role in MCA billing account scope

| **Feature/Role** | **Owner** | **Contributor** | **Reader** |
| --- | --- | --- | --- |
| **Cost Analysis / Forecast / Query / Cost Details API** | Read only | Read only | Read only |
| **Shared Views** | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **Budgets** | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **Alerts** | Read, Update | Read, Update | Read, Update |
| **Exports** | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **Cost Allocation Rules** | Create, Read, Update, Delete | Create, Read, Update, Delete | Read only |

#### Feature behavior per role in MCA Billing profile scope

| **Feature/Role** | **Owner** | **Contributor** | **Reader** | **Invoice Manager** |
| --- | --- | --- | --- | --- |
| **Cost Analysis / Forecast / Query / Cost Details API** | Read only | Read only | Read only | Read only |
| **Shared Views** | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **Budgets/Reservation utilization alerts** | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **Alerts** | Read, Update | Read, Update | Read, Update | Create, Read, Update, Delete |
| **Exports** | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete | Read, Update |
| **Cost Allocation Rules** | N/A – only applicable to Billing Account | N/A – only applicable to Billing Account | N/A – only applicable to Billing Account | N/A – only applicable to Billing Account |

#### Feature behavior per role in MCA Invoice section scope

| **Feature/Role** | **Owner** | **Contributor** | **Reader** | **Azure Subscription Creator** |
| --- | --- | --- | --- | --- |
| **Cost Analysis / Forecast / Query / Cost Details API** | Read only | Read only | Read only | Read only |
| **Shared Views** | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **Budgets** | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **Alerts** | Read, Update | Read, Update | Read, Update | Read, Update |
| **Exports** | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete | Create, Read, Update, Delete |
| **Cost Allocation Rules** | N/A – only applicable to Billing Account | N/A – only applicable to Billing Account | N/A – only applicable to Billing Account | N/A – only applicable to Billing Account |

### Cloud Solution Provider (CSP) scopes

The following scopes are supported for CSPs with customers on a Microsoft Customer Agreement:

- **Billing account** - Represents the partner’s relationship with Microsoft under the Microsoft Partner Agreement. It includes billing profiles for each currency and enables management of invoices, payments, and customer charges. While similar in purpose, billing accounts under a Customer Agreement differ structurally from EA enrollments, which are more closely aligned with billing profiles and enterprise-level hierarchies

    Resource type: `Microsoft.Billing/billingAccounts (accountType = Organization)`

- **Billing profile** - Groups the subscriptions that are included in an invoice. Billing profiles are the functional equivalent of an EA enrollment, since that's the scope that invoices are generated at. Similarly, purchases (such as Marketplace and reservations) are only available at this scope.

    Resource type: `Microsoft.Billing/billingAccounts/billingProfiles`

- **Customer** - Represents a group of subscriptions that are associated to a specific customer that is onboarded to an MCA by a partner.

#### Roles used in CSP scopes

Only the users with _*Admin agent*_ and [billing admin](/partner-center/account-settings/permissions-overview#billing-admin-role) roles can manage and view costs for billing accounts, billing profiles, and customers directly in the partner's Azure tenant. For more information about partner center roles, see [Assign users roles and permissions](/partner-center/permissions-overview).

Cost Management only supports customers of CSP partners if the customers have an MCA. For CSP supported customers who aren't yet on an MCA, see [Partner Center](/azure/cloud-solution-provider/overview/partner-center-overview).

Cost Management doesn't support Management groups in CSP scopes. If you have a CSP subscription and you try to set the scope to a management group in Cost Analysis, an error like the following one is shown:

`Management group <ManagementGroupName> does not have any valid subscriptions`

Learn more about Cost Management for CSP [here] (/cost-management-billing/understand/mpa-overview).

This diagram illustrates the hierarchical relationship between different Azure scope types and their associated roles for cost management and billing.

:::image type="content" source="./media/understand-work-scopes/cost-management-understand-scopes.svg" alt-text="Diagram showing scopes and the roles associated to them." border="false" lightbox="./media/understand-work-scopes/cost-management-understand-scopes.svg":::

### Individual agreement scopes

Azure subscriptions created from individual offers like pay-as-you-go and related types like Free Trial and dev/test offers, don't have an explicit billing account scope. Instead, each subscription has an account owner or account admin, like the EA account owner.

- [**Billing account**](../manage/view-all-accounts.md) -
Represents a single account owner for one or more Azure subscriptions. It doesn't currently support granting access to multiple people or access to aggregated cost views across multiple subscriptions.

    Resource type: Not applicable

Individual Azure subscription account admins can view and manage billing data, such as invoices and payments, from the [Azure portal](https://portal.azure.com) > **Subscriptions** > select a subscription.

## Switch between scopes in Cost Management

All Cost Management views in the Azure portal include a **Scope** selection pill at the top-left of the view. Use it to quickly change scope. Select the **Scope** pill to open the scope picker. It shows billing accounts, the root management group, and any subscriptions that aren't nested under the root management group. To select a scope, select the background to highlight it, and then select **Select** at the bottom. To drill-in to nested scopes, like resource groups in a subscription, select the scope name link. To select the parent scope at any nested level, select **Select this &lt;scope&gt;** at the top of the scope picker.

## View historical charges after migration or contract change by using scope picker

If you migrated from an EA agreement to an MCA, you still have access to your old billing scope.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Search for and then select **Cost Management + Billing**.
3. Select **Billing Scope** to view the list of your new and previous billing accounts.
4. Select the Billing account you wish to view costs for

## Using scopes with Cost Management APIs

When you work with Cost Management APIs, knowing the scope is critical. Use the following information to build the proper scope URI for Cost Management APIs.

### Billing accounts

1. Open the Azure portal and then navigate to **Cost Management + Billing** in the list of services.
2. Select **Properties** in the billing account menu.
3. Copy the billing account ID.
4. Your scope is: `"/providers/Microsoft.Billing/billingAccounts/{billingAccountId}"`

### Billing profiles

1. Open the Azure portal and then navigate to **Cost Management + Billing** in the list of services.
2. Select **Billing profiles** in the billing account menu.
3. Select the name of the billing profile.
4. Select **Properties** in the billing profile menu.
5. Copy the billing account and billing profile IDs.
6. Your scope is: `"/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/billingProfiles/{billingProfileId}"`

### Invoice sections

1. Open the Azure portal and then navigate to **Cost Management + Billing** in the list of services.
2. Select **Invoice sections** in the billing account menu.
3. Select the name of the invoice section.
4. Select **Properties** in the invoice section menu.
5. Copy the billing account and invoice section IDs.
6. Your scope is: `"/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/invoiceSections/{invoiceSectionId}"`

### EA departments

1. Open the Azure portal and then navigate to **Cost Management + Billing** in the list of services.
2. Select **Departments** in the billing account menu.
3. Select the name of the department.
4. Select **Properties** in the department menu.
5. Copy the billing account and department IDs.
6. Your scope is: `"/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/departments/{departmentId}"`

### EA enrollment account

1. Open the Azure portal and navigate to **Cost Management + Billing** in the list of services.
2. Select **Enrollment accounts** in the billing account menu.
3. Select the name of the enrollment account.
4. Select **Properties** in the enrollment account menu.
5. Copy the billing account and enrollment account IDs.
6. Your scope is: `"/providers/Microsoft.Billing/billingAccounts/{billingAccountId}/enrollmentAccounts/{enrollmentAccountId}"`

### Management group

1. Open the Azure portal and navigate to **Management groups** in the list of services.
2. Navigate to the management group.
3. Copy the management group ID from the table.
4. Your scope is: `"/providers/Microsoft.Management/managementGroups/{id}"`

### Subscription

1. Open the Azure portal and navigate to **Subscriptions** in the list of services.
2. Copy the subscription ID from the table.
3. Your scope is: `"/subscriptions/{id}"`

### Resource groups

1. Open the Azure portal and navigate to **Resource groups** in the list of services.
2. Select the name of the resource group.
3. Select **Properties** in the resource group menu.
4. Copy the resource ID field value.
5. Your scope is: `"/subscriptions/{id}/resourceGroups/{name}"`

Cost Management is currently supported in Azure Global with `https://management.azure.com` and Azure Government with `https://management.usgovcloudapi.net`. For more information about Azure Government, see [Azure Global and Government API endpoints](../../azure-government/documentation-government-developer-guide.md#endpoint-mapping).

## Related content

- If you didn’t complete the first quickstart for Cost Management, read it at [Start analyzing costs](quick-acm-cost-analysis.md).
  
