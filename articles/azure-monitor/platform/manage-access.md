---
title: Manage Log Analytics workspaces in Azure Monitor | Microsoft Docs
description: You can manage access to data stored in a Log Analytics workspace in Azure Monitor using resource, workspace, or table-level permissions. This article details how to complete.
ms.service:  azure-monitor
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 10/22/2019

---

# Manage access to log data and workspaces in Azure Monitor

Azure Monitor stores [log](data-platform-logs.md) data in a Log Analytics workspace. A workspace is a container that includes data and configuration information. To manage access to log data, you perform various administrative tasks related to your workspace.

This article explains how to manage access to logs and to administer the workspaces that contain them, including how to grant access to: 

* The workspace using workspace permissions.
* Users who need access to log data from specific resources using Azure role-based access control (RBAC).
* Users who need access to log data in a specific table in the workspace using Azure RBAC.

## Configure access control mode

You can view the access control mode configured on a workspace from the Azure portal or with Azure PowerShell.  You can change this setting using one of the following supported methods:

* Azure portal

* Azure PowerShell

* Azure Resource Manager template

### From the Azure portal

You can view the current workspace access control mode on the **Overview** page for the workspace in the **Log Analytics workspace** menu.

![View workspace access control mode](media/manage-access/view-access-control-mode.png)

1. Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).
1. In the Azure portal, select Log Analytics workspaces > your workspace.

You can change this setting from the **Properties** page of the workspace. Changing the setting will be disabled if you don't have permissions to configure the workspace.

![Change workspace access mode](media/manage-access/change-access-control-mode.png)

### Using PowerShell

Use the following command to examine the access control mode for all workspaces in the subscription:

```powershell
Get-AzResource -ResourceType Microsoft.OperationalInsights/workspaces -ExpandProperties | foreach {$_.Name + ": " + $_.Properties.features.enableLogAccessUsingOnlyResourcePermissions}
```

The output should resemble the following:

```
DefaultWorkspace38917: True
DefaultWorkspace21532: False
```

A value of `False` means the workspace is configured with the workspace-context access mode.  A value of `True` means the workspace is configured with the resource-context access mode.

> [!NOTE]
> If a workspace is returned without a boolean value and is blank, this also matches the results of a `False` value.
>

Use the following script to set the access control mode for a specific workspace to the resource-context permission:

```powershell
$WSName = "my-workspace"
$Workspace = Get-AzResource -Name $WSName -ExpandProperties
if ($Workspace.Properties.features.enableLogAccessUsingOnlyResourcePermissions -eq $null)
    { $Workspace.Properties.features | Add-Member enableLogAccessUsingOnlyResourcePermissions $true -Force }
else
    { $Workspace.Properties.features.enableLogAccessUsingOnlyResourcePermissions = $true }
Set-AzResource -ResourceId $Workspace.ResourceId -Properties $Workspace.Properties -Force
```

Use the following script to set the access control mode for all workspaces in the subscription to the resource-context permission:

```powershell
Get-AzResource -ResourceType Microsoft.OperationalInsights/workspaces -ExpandProperties | foreach {
if ($_.Properties.features.enableLogAccessUsingOnlyResourcePermissions -eq $null)
    { $_.Properties.features | Add-Member enableLogAccessUsingOnlyResourcePermissions $true -Force }
else
    { $_.Properties.features.enableLogAccessUsingOnlyResourcePermissions = $true }
Set-AzResource -ResourceId $_.ResourceId -Properties $_.Properties -Force
```

### Using a Resource Manager template

To configure the access mode in an Azure Resource Manager template, set the **enableLogAccessUsingOnlyResourcePermissions** feature flag on the workspace to one of the following values.

* **false**: Set the workspace to workspace-context permissions. This is the default setting if the flag isn't set.
* **true**: Set the workspace to resource-context permissions.

## Manage access using workspace permissions

Each workspace can have multiple accounts associated with it, and each account can have access to multiple workspaces. Access is managed using [Azure role-based access](../../role-based-access-control/role-assignments-portal.md).

The following activities also require Azure permissions:

|Action |Azure Permissions Needed |Notes |
|-------|-------------------------|------|
| Adding and removing monitoring solutions | `Microsoft.Resources/deployments/*` <br> `Microsoft.OperationalInsights/*` <br> `Microsoft.OperationsManagement/*` <br> `Microsoft.Automation/*` <br> `Microsoft.Resources/deployments/*/write` | These permissions need to be granted at resource group or subscription level. |
| Changing the pricing tier | `Microsoft.OperationalInsights/workspaces/*/write` | |
| Viewing data in the *Backup* and *Site Recovery* solution tiles | Administrator / Co-administrator | Accesses resources deployed using the classic deployment model |
| Creating a workspace in the Azure portal | `Microsoft.Resources/deployments/*` <br> `Microsoft.OperationalInsights/workspaces/*` ||
| View workspace basic properties and enter the workspace blade in the portal | `Microsoft.OperationalInsights/workspaces/read` ||
| Query logs using any interface | `Microsoft.OperationalInsights/workspaces/query/read` ||
| Access all log types using queries | `Microsoft.OperationalInsights/workspaces/query/*/read` ||
| Access a specific log table | `Microsoft.OperationalInsights/workspaces/query/<table_name>/read` ||
| Read the workspace keys to allow sending logs to this workspace | `Microsoft.OperationalInsights/workspaces/sharedKeys/action` ||

## Manage access using Azure permissions

To grant access to the Log Analytics workspace using Azure permissions, follow the steps in [use role assignments to manage access to your Azure subscription resources](../../role-based-access-control/role-assignments-portal.md). For example custom roles, see [Example custom roles](#custom-role-examples)

Azure has two built-in user roles for Log Analytics workspaces:

* Log Analytics Reader
* Log Analytics Contributor

Members of the *Log Analytics Reader* role can:

* View and search all monitoring data
* View monitoring settings, including viewing the configuration of Azure diagnostics on all Azure resources.

The Log Analytics Reader role includes the following Azure actions:

| Type    | Permission | Description |
| ------- | ---------- | ----------- |
| Action | `*/read`   | Ability to view all Azure resources and resource configuration. Includes viewing: <br> Virtual machine extension status <br> Configuration of Azure diagnostics on resources <br> All properties and settings of all resources. <br> For workspaces, it allows full unrestricted permissions to read the workspace settings and perform query on the data. See more granular options above. |
| Action | `Microsoft.OperationalInsights/workspaces/analytics/query/action` | Deprecated, no need to assign them to users. |
| Action | `Microsoft.OperationalInsights/workspaces/search/action` | Deprecated, no need to assign them to users. |
| Action | `Microsoft.Support/*` | Ability to open support cases |
|Not Action | `Microsoft.OperationalInsights/workspaces/sharedKeys/read` | Prevents reading of workspace key required to use the data collection API and to install agents. This prevents the user from adding new resources to the workspace |

Members of the *Log Analytics Contributor* role can:

* Includes all the privileges of the *Log Analytics Reader role*, allowing the user to read all monitoring data
* Create and configure Automation accounts
* Add and remove management solutions

    > [!NOTE]
    > In order to successfully perform the last two actions, this permission needs to be granted at the resource group or subscription level.

* Read storage account keys
* Configure the collection of logs from Azure Storage
* Edit monitoring settings for Azure resources, including
  * Adding the VM extension to VMs
  * Configuring Azure diagnostics on all Azure resources

> [!NOTE]
> You can use the ability to add a virtual machine extension to a virtual machine to gain full control over a virtual machine.

The Log Analytics Contributor role includes the following Azure actions:

| Permission | Description |
| ---------- | ----------- |
| `*/read`     | Ability to view all resources and resource configuration. Includes viewing: <br> Virtual machine extension status <br> Configuration of Azure diagnostics on resources <br> All properties and settings of all resources. <br> For workspaces, it allows full unrestricted permissions to read the workspace setting and perform query on the data. See more granular options above. |
| `Microsoft.Automation/automationAccounts/*` | Ability to create and configure Azure Automation accounts, including adding and editing runbooks |
| `Microsoft.ClassicCompute/virtualMachines/extensions/*` <br> `Microsoft.Compute/virtualMachines/extensions/*` | Add, update and remove virtual machine extensions, including the Microsoft Monitoring Agent extension and the OMS Agent for Linux extension |
| `Microsoft.ClassicStorage/storageAccounts/listKeys/action` <br> `Microsoft.Storage/storageAccounts/listKeys/action` | View the storage account key. Required to configure Log Analytics to read logs from Azure storage accounts |
| `Microsoft.Insights/alertRules/*` | Add, update, and remove alert rules |
| `Microsoft.Insights/diagnosticSettings/*` | Add, update, and remove diagnostics settings on Azure resources |
| `Microsoft.OperationalInsights/*` | Add, update, and remove configuration for Log Analytics workspaces. To edit workspace advanced settings, user needs `Microsoft.OperationalInsights/workspaces/write`. |
| `Microsoft.OperationsManagement/*` | Add and remove management solutions |
| `Microsoft.Resources/deployments/*` | Create and delete deployments. Required for adding and removing solutions, workspaces, and automation accounts |
| `Microsoft.Resources/subscriptions/resourcegroups/deployments/*` | Create and delete deployments. Required for adding and removing solutions, workspaces, and automation accounts |

To add and remove users to a user role, it is necessary to have `Microsoft.Authorization/*/Delete` and `Microsoft.Authorization/*/Write` permission.

Use these roles to give users access at different scopes:

* Subscription - Access to all workspaces in the subscription
* Resource Group - Access to all workspace in the resource group
* Resource - Access to only the specified workspace

We recommend performing assignments at the resource level (workspace) to assure accurate access control. Use [custom roles](../../role-based-access-control/custom-roles.md) to create roles with the specific permissions needed.

### Resource permissions

When users query logs from a workspace using resource-context access, they'll have the following permissions on the resource:

| Permission | Description |
| ---------- | ----------- |
| `Microsoft.Insights/logs/<tableName>/read`<br><br>Examples:<br>`Microsoft.Insights/logs/*/read`<br>`Microsoft.Insights/logs/Heartbeat/read` | Ability to view all log data for the resource.  |
| `Microsoft.Insights/diagnosticSettings/write` | Ability to configure diagnostics setting to allow setting up logs for this resource. |

`/read` permission is usually granted from a role that includes _\*/read or_ _\*_ permissions such as the built-in [Reader](../../role-based-access-control/built-in-roles.md#reader) and [Contributor](../../role-based-access-control/built-in-roles.md#contributor) roles. Custom roles that include specific actions or dedicated built-in roles might not include this permission.

See [Defining per-table access control](#table-level-rbac) below if you want to create different access control for different tables.

## Custom role examples

1. To grant a user access to log data from their resources, perform the following:

    * Configure the workspace access control mode to **use workspace or resource permissions**

    * Grant users `*/read` or `Microsoft.Insights/logs/*/read` permissions to their resources. If they are already assigned the [Log Analytics Reader](../../role-based-access-control/built-in-roles.md#reader) role on the workspace, it is sufficient.

2. To grant a user access to log data from their resources and configure their resources to send logs to the workspace, perform the following:

    * Configure the workspace access control mode to **use workspace or resource permissions**

    * Grant users the following permissions on the workspace: `Microsoft.OperationalInsights/workspaces/read` and `Microsoft.OperationalInsights/workspaces/sharedKeys/action`. With these permissions, users cannot perform any workspace-level queries. They can only enumerate the workspace and use it as a destination for diagnostic settings or agent configuration.

    * Grant users the following permissions to their resources: `Microsoft.Insights/logs/*/read` and `Microsoft.Insights/diagnosticSettings/write`. If they are already assigned the [Log Analytics Contributor](../../role-based-access-control/built-in-roles.md#contributor) role, assigned the Reader role, or granted `*/read` permissions on this resource, it is sufficient.

3. To grant a user access to log data from their resources without being able to read security events and send data, perform the following:

    * Configure the workspace access control mode to **use workspace or resource permissions**

    * Grant users the following permissions to their resources: `Microsoft.Insights/logs/*/read`.

    * Add the following NonAction to block users from reading the SecurityEvent type: `Microsoft.Insights/logs/SecurityEvent/read`. The NonAction shall be in the same custom role as the action that provides the read permission (`Microsoft.Insights/logs/*/read`). If the user inherent the read action from another role that is assigned to this resource or to the subscription or resource group, they would be able to read all log types. This is also true if they inherit `*/read`, that exist for example, with the Reader or Contributor role.

4. To grant a user access to log data from their resources and read all Azure AD sign-in and read Update Management solution log data from the workspace, perform the following:

    * Configure the workspace access control mode to **use workspace or resource permissions**

    * Grant users the following permissions on the workspace: 

        * `Microsoft.OperationalInsights/workspaces/read` – required so the use can enumerate the workspace and open the workspace blade in the Azure portal
        * `Microsoft.OperationalInsights/workspaces/query/read` – required for every user that can execute queries
        * `Microsoft.OperationalInsights/workspaces/query/SigninLogs/read` – to be able to read Azure AD sign-in logs
        * `Microsoft.OperationalInsights/workspaces/query/Update/read` – to be able to read Update Management solution logs
        * `Microsoft.OperationalInsights/workspaces/query/UpdateRunProgress/read` – to be able to read Update Management solution logs
        * `Microsoft.OperationalInsights/workspaces/query/UpdateSummary/read` – to be able to read Update management logs
        * `Microsoft.OperationalInsights/workspaces/query/Heartbeat/read` – required to be able to use Update Management solution
        * `Microsoft.OperationalInsights/workspaces/query/ComputerGroup/read` – required to be able to use Update Management solution

    * Grant users the following permissions to their resources: `*/read`, assigned to the Reader role, or `Microsoft.Insights/logs/*/read`. 

## Table level RBAC

**Table level RBAC** allows you to define more granular control to data in a Log Analytics workspace in addition to the other permissions. This control allows you to define specific data types that are accessible only to a specific set of users.

You implement table access control with [Azure custom roles](../../role-based-access-control/custom-roles.md) to either grant access to specific [tables](../log-query/logs-structure.md) in the workspace. These roles are applied to workspaces with either workspace-context or resource-context [access control modes](design-logs-deployment.md#access-control-mode) regardless of the user's [access mode](design-logs-deployment.md#access-mode).

Create a [custom role](../../role-based-access-control/custom-roles.md) with the following actions to define access to table access control.

* To grant access to a table, include it in the **Actions** section of the role definition. To subtract access from the allowed **Actions**, include it in the **NotActions** section.
* Use Microsoft.OperationalInsights/workspaces/query/* to specify all tables.

For example, to create a role with access to the _Heartbeat_ and _AzureActivity_ tables, create a custom role using the following actions:

```
"Actions":  [
    "Microsoft.OperationalInsights/workspaces/read",
    "Microsoft.OperationalInsights/workspaces/query/read",
    "Microsoft.OperationalInsights/workspaces/query/Heartbeat/read",
    "Microsoft.OperationalInsights/workspaces/query/AzureActivity/read"
  ],
```

To create a role with access to only the _SecurityBaseline_ table, create a custom role using the following actions:

```
"Actions":  [
    "Microsoft.OperationalInsights/workspaces/read",
    "Microsoft.OperationalInsights/workspaces/query/read",
    "Microsoft.OperationalInsights/workspaces/query/SecurityBaseline/read"
],
```

### Custom logs

 Custom logs are created from data sources such as custom logs and HTTP Data Collector API. The easiest way to identify the type of log is by checking the tables listed under [Custom Logs in the log schema](../log-query/get-started-portal.md#understand-the-schema).

 You can't currently grant access to individual custom logs, but you can grant access to all custom logs. To create a role with access to all custom logs, create a custom role using the following actions:

```
"Actions":  [
    "Microsoft.OperationalInsights/workspaces/read",
    "Microsoft.OperationalInsights/workspaces/query/read",
    "Microsoft.OperationalInsights/workspaces/query/Tables.Custom/read"
],
```

### Considerations

* If a user is granted global read permission with the standard Reader or Contributor roles that include the _\*/read_ action, it will override the per-table access control and give them access to all log data.
* If a user is granted per-table access but no other permissions, they would be able to access log data from the API but not from the Azure portal. To provide access from the Azure portal, use Log Analytics Reader as its base role.
* Administrators of the subscription will have access to all data types regardless of any other permission settings.
* Workspace owners are treated like any other user for per-table access control.
* We recommend assigning roles to security groups instead of individual users to reduce the number of assignments. This will also help you use existing group management tools to configure and verify access.

## Next steps

* See [Log Analytics agent overview](../../azure-monitor/platform/log-analytics-agent.md) to gather data from computers in your datacenter or other cloud environment.

* See [Collect data about Azure virtual machines](../../azure-monitor/learn/quick-collect-azurevm.md) to configure data collection from Azure VMs.
