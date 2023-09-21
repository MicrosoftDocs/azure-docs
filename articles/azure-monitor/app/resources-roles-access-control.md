---
title: Resources, roles, and access control in Application Insights | Microsoft Docs
description: Owners, contributors and readers of your organization's insights.
ms.topic: conceptual
ms.date: 04/13/2023
ms.custom:
ms.reviewer: cogoodson
---

# Resources, roles, and access control in Application Insights

You can control who has read and update access to your data in [Application Insights][start] by using [Azure role-based access control (Azure RBAC)](../../role-based-access-control/role-assignments-portal.md).

> [!IMPORTANT]
> Assign access to users in the resource group or subscription to which your application resource belongs, not in the resource itself. Assign the Application Insights Component Contributor role. This role ensures uniform control of access to web tests and alerts along with your application resource. [Learn more](#access).

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Resources, groups, and subscriptions

First, let's define some terms:

* **Resource**: An instance of an Azure service. Your Application Insights resource collects, analyzes, and displays the telemetry data sent from your application. Other types of Azure resources include web apps, databases, and VMs.

    To see your resources, open the [Azure portal](https://portal.azure.com), sign in, and select **All resources**. To find a resource, enter part of its name in the filter field.

    :::image type="content" source="./media/resources-roles-access-control/10-browse.png" lightbox="./media/resources-roles-access-control/10-browse.png" alt-text="Screenshot that shows a list of Azure resources.":::

<a name="resource-group"></a>

* [Resource group][group]: Every resource belongs to one group. A group is a convenient way to manage related resources, particularly for access control. For example, in one resource group you could put a web app, an Application Insights resource to monitor the app, and an Azure Storage resource to keep exported data.
* [Subscription](https://portal.azure.com): To use Application Insights or other Azure resources, you sign in to an Azure subscription. Every resource group belongs to one Azure subscription, where you choose your price package. If it's an organization subscription, the owner can choose the members and their access permissions.
* [Microsoft account][account]: The username and password that you use to sign in to Azure subscriptions, Xbox Live, Outlook.com, and other Microsoft services.

## <a name="access"></a> Control access in the resource group

Along with the resource you created for your application, there are also separate hidden resources for alerts and web tests. They're attached to the same [resource group](#resource-group) as your Application Insights resource. You might also have put other Azure services in there, such as websites or storage.

## Provide access to another user

You must have Owner rights to the subscription or the resource group.

The user must have a [Microsoft account][account] or access to their [organizational Microsoft account](../../active-directory/fundamentals/sign-up-organization.md). You can provide access to individuals and also to user groups defined in Azure Active Directory.

#### Go to a resource group or directly to the resource itself

Assign the Contributor role to Azure RBAC.

For detailed steps, see [Assign Azure roles by using the Azure portal](../../role-based-access-control/role-assignments-portal.md).

#### Select a role

Where applicable, the link connects to the associated official reference documentation.

| Role | In the resource group |
| --- | --- |
| [Owner](../../role-based-access-control/built-in-roles.md#owner) |Can change anything, including user access. |
| [Contributor](../../role-based-access-control/built-in-roles.md#contributor) |Can edit anything, including all resources. |
| [Application Insights Component Contributor](../../role-based-access-control/built-in-roles.md#application-insights-component-contributor) |Can edit Application Insights resources. |
| [Reader](../../role-based-access-control/built-in-roles.md#reader) |Can view but not change anything. |
| [Application Insights Snapshot Debugger](../../role-based-access-control/built-in-roles.md#application-insights-snapshot-debugger) | Gives the user permission to use Application Insights Snapshot Debugger features. This role isn't included in the Owner or Contributor roles. |
| Azure Service Deploy Release Management Contributor | Contributor role for services deploying through Azure Service Deploy. |
| [Data Purger](../../role-based-access-control/built-in-roles.md#data-purger) | Special role for purging personal data. For more information, see [Manage personal data in Log Analytics and Application Insights](../logs/personal-data-mgmt.md).   |
| Azure ExpressRoute administrator | Can create, delete, and manage express routes.|
| [Log Analytics Contributor](../../role-based-access-control/built-in-roles.md#log-analytics-contributor) | Log Analytics Contributor can read all monitoring data and edit monitoring settings. Editing monitoring settings includes adding the VM extension to VMs, reading storage account keys to be able to configure collection of logs from Azure Storage, creating and configuring Automation accounts, adding solutions, and configuring Azure diagnostics on all Azure resources. If you're having trouble setting up your Azure diagnostics, see [Azure diagnostics](../agents/diagnostics-extension-to-application-insights.md).  |
| [Log Analytics Reader](../../role-based-access-control/built-in-roles.md#log-analytics-reader) | Log Analytics Reader can view and search all monitoring data and view monitoring settings, including viewing the configuration of Azure diagnostics on all Azure resources. If you're having trouble setting up your Azure diagnostics, see [Azure diagnostics](../agents/diagnostics-extension-to-application-insights.md). |
| masterreader | Allows a user to view everything but not make changes. |
| [Monitoring Contributor](../../role-based-access-control/built-in-roles.md#monitoring-contributor) | Can read all monitoring data and update monitoring settings.|
| [Monitoring Metrics Publisher](../../role-based-access-control/built-in-roles.md#monitoring-metrics-publisher) | Enables publishing metrics against Azure resources. |
| [Monitoring Reader](../../role-based-access-control/built-in-roles.md#monitoring-reader) | Can read all monitoring data. |
| Resource Policy Contributor (preview) | Backfilled users from Enterprise Agreements, with rights to create/modify resource policy, create support tickets, and read resource/hierarchy.  |
| [User Access administrator](../../role-based-access-control/built-in-roles.md#user-access-administrator) | Allows a user to manage access for other users to Azure resources.|
| [Website Contributor](../../role-based-access-control/built-in-roles.md#website-contributor) | Lets you manage websites (not web plans) but not access to them.|

Editing includes creating, deleting, and updating:

* Resources
* Web tests
* Alerts
* Continuous export

#### Select the user

If the user you want isn't in the directory, you can invite anyone with a Microsoft account. If they use services like Outlook.com, OneDrive, Windows Phone, or Xbox Live, they have a Microsoft account.

## Related content

See the article [Azure role-based access control (Azure RBAC)](../../role-based-access-control/role-assignments-portal.md).

## PowerShell query to determine role membership

Because certain roles can be linked to notifications and email alerts, it can be helpful to be able to generate a list of users who belong to a given role. To help with generating these types of lists, the following sample queries can be adjusted to fit your specific needs.

### Query entire subscription for Admin roles + Contributor roles

```powershell
(Get-AzRoleAssignment -IncludeClassicAdministrators | Where-Object {$_.RoleDefinitionName -in @('ServiceAdministrator', 'CoAdministrator', 'Owner', 'Contributor') } | Select -ExpandProperty SignInName | Sort-Object -Unique) -Join ", "
```

### Query within the context of a specific Application Insights resource for owners and contributors

```powershell
$resourceGroup = "RGNAME"
$resourceName = "AppInsightsName"
$resourceType = "microsoft.insights/components"
(Get-AzRoleAssignment -ResourceGroup $resourceGroup -ResourceType $resourceType -ResourceName $resourceName | Where-Object {$_.RoleDefinitionName -in @('Owner', 'Contributor') } | Select -ExpandProperty SignInName | Sort-Object -Unique) -Join ", "
```

### Query within the context of a specific resource group for owners and contributors

```powershell
$resourceGroup = "RGNAME"
(Get-AzRoleAssignment -ResourceGroup $resourceGroup | Where-Object {$_.RoleDefinitionName -in @('Owner', 'Contributor') } | Select -ExpandProperty SignInName | Sort-Object -Unique) -Join ", "
```

<!--Link references-->

[account]: https://account.microsoft.com
[group]: ../../azure-resource-manager/management/overview.md
[start]: ./app-insights-overview.md
