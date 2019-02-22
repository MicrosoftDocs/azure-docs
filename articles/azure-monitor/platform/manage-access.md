---
title: Manage Log Analytics workspaces in Azure Monitor | Microsoft Docs
description: You can manage Log Analytics workspaces in Azure Monitor using a variety of administrative tasks on users, accounts, workspaces, and Azure accounts.
services: log-analytics
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: ''
ms.assetid: d0e5162d-584b-428c-8e8b-4dcaa746e783
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 02/07/2019
ms.author: magoedte
---

# Manage Log Analytics workspaces in Azure Monitor
Azure Monitor stores log data in a Log Analytics workspace, which is essentially a container that includes data and configuration information. To manage access to log data, you perform various administrative tasks related to workspaces. You or other members of your organization might use multiple workspaces to manage different sets of data that is collected from all or portions of your IT infrastructure.

This article explains how to manage access to logs and to administer the workspaces that contains them. 



## Access mode
Log Analytics workspaces have two access models:

**Workspace centric**: This is the traditional model of workspaces where the access control permissions are managed by the workspace. A user can view the logs if they have read access to the workspace. This model is relevant for both log queries and administration of the qorkspace. When queries are used in this mode, they are scoped to all logs in the workspace.

**Resource centric**: This is a new model that is available for querying logs of a specific resource. This allows users of particular Azure resources to access their logs regardless of the workspace that stores them. It also provides granular role-based access control (RBAC) in these scenarios consistent with [Azure RBAC](../role-based-access-control/overview.md).  

The following table summarizes the access modes:

| | Workspace centric | Resource centric |
|:---|:---|
| Who is each model intended for? | Administrators who need to configure of data collection and users who need access to wide variety of resources. Also currently required for users who have to access logs for resources outside of Azure. | Administrators of Azure resources being monitored. |
| What does a user require to view logs? | Permissions to the workspace. | Read access to the resource. Permissions can be inherited (such as from the containing resource group) or directly assigned to the resource. Permission to the logs for the resource will be automatically assigned. |
| What is the scope of permissions? | Workspace. Users with access to the workspace can query all logs in that workspace. | Azure resource. User can query logs for resources they have access to from any workspace but can't query logs for other resources. |
| How can user access logs? | Start **Logs** from **Azure Monitor** menu or **Log Analytics workspaces** menu in the Azure portal. Most insights currently use workspace centric. | Start **Logs** from the menu for the Azure resource. |


## Define access mode

### Azure portal
You can view the current workspace access setting on the **Overview** page for the workspace in the **Log Analytics workspace** menu. 

![View workspace access mode](media/manage-access/view-access-mode.md)

You can change this setting on the **Properties** page for the workspace. Changing the setting will be disabled if you don't have permissions to configure the workspace.

![Change workspace access mode](media/manage-access/change-access-mode.md)

### Resource Manager template
To configure the access mode in an Azure Resource Manager template, set the **enableLogAccessUsingOnlyResourcePermissions** feature flag on the workspace to one of the following values.

- **false**: Set the workspace to workspace-centric permissions. This is the default setting if the flag isn't set.
- **true**: Set the workspace to resource-centric permissions.

## Determine the number of workspaces you need
A Log Analytics workspace is an Azure resource and is a container where data is collected, aggregated, analyzed, and presented in Azure Monitor.

You can have multiple workspaces per Azure subscription, and you can have access to more than one workspace, with the ability to easily query across them. This section describes when it can be helpful to create more than one workspace.

A Log Analytics workspace provides:

* A geographic location for data storage.
* Data isolation to define different user access rights in workspace-centric access. Not relevant when working in resource-centric mode.
* Scope for configuration of settings like [pricing tier](https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#changing-pricing-tier), [retention](https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period) and [data capping](https://docs.microsoft.com/azure/azure-monitor/platform/manage-cost-storage#daily-cap).
* Charges related to data ingestion and retention are made on the workspace resource.

From consumption point of view, we recommend you create as few workspaces as possible. It makes administration and query experience easier and quicker. But, based on the preceding characteristics, you may want to create multiple workspaces if:

* You are a global company and you need log data stored in specific regions for data sovereignty or compliance reasons.
* You are using Azure and you want to avoid outbound data transfer charges by having a workspace in the same region as the Azure resources it manages.
* You want to allocate charges to different departments or business groups based on their usage by creating a workspace for each department or business group in its own Azure subscription.
* You are a managed service provider and need to keep the Log Analytics data for each customer you manage isolated from other customer’s data.
* You manage multiple customers and you want each customer / department / business group to see their own data, but not data from others.

When using Windows agents to collect data, you can [configure each agent to report to one or more workspaces](../../azure-monitor/platform/agent-windows.md).

If you are using System Center Operations Manager, each Operations Manager management group can be connected with only one workspace. You can install the Microsoft Monitoring Agent on computers managed by Operations Manager and have the agent report to both Operations Manager and a different Log Analytics workspace.

Once the workspace architecture is defined, you should enforce this policy on Azure resources with [Azure Policy](../governance/policy/overview.md). This can provide a built-in definition that would automatically apply to all Azure resources. For example, you could set a policy to ensure that all your Azure resources in a particular region sent all their diagnostic logs to a particular workspace.

## Workspace information
While you analyze data in the Log Analytics workspace in the **Azure Monitor** menu in the Azure portal, you create and manage workspaces in the **Log Analytics workspaces** menu.
 

1. Sign in to the [Azure portal](https://portal.azure.com) and click **All services**. In the list of resources, type **Log Analytics**. As you begin typing, the list filters based on your input. Select **Log Analytics**  workspaces.  

    ![Azure portal](media/manage-access/azure-portal-01.png)  

3. Select your workspace from the list.

4. The workspace page displays details about the getting started, configuration, and links for additional information.  

    ![Workspace details](./media/manage-access/workspace-overview-page.png)  



## Create a workspace

To create a workspace, you need to:

1. Have an Azure subscription.
2. Choose a workspace name.
3. Associate the workspace with one of your subscriptions and resource groups.
4. Choose a geographical location.


## Manage accounts and users

### Resource-centric permissions 
When users query logs from a workspace using resource-centric access, they'll have the following permissions on the resource 

```
microsoft.insights/logs/<tableName>/read
```
This permission is usually granted from a role that includes _\*/read or_ _\*_ permissions such as the built-in [Reader](../role-based-access-control/built-in-roles.md#reader) and [Contributor](../role-based-access-control/built-in-roles.md#contributor) roles. Note that custom roles that includes specific actions or dedicated built-in roles might not include this permission.

See [Defining per-table access control](#defining-per-table-access-control) below if you want to create different access control for different tables or data types.

If you like to create access control that is different for different tables or data types, note the section below on creating per-table access control.


### Workpace-centric permissions
Each workspace can have multiple accounts associated with it, and each account can have access to multiple workspaces. Access is managed via [Azure role-based access](../../role-based-access-control/role-assignments-portal.md). These access rights applies both on the Azure portal and on the API access.


The following activities also require Azure permissions:

| Action                                                          | Azure Permissions Needed | Notes |
|-----------------------------------------------------------------|--------------------------|-------|
| Adding and removing management solutions                        | `Microsoft.Resources/deployments/*` <br> `Microsoft.OperationalInsights/*` <br> `Microsoft.OperationsManagement/*` <br> `Microsoft.Automation/*` <br> `Microsoft.Resources/deployments/*/write` | These permissions need to be granted at resource group or subscription level. |
| Changing the pricing tier                                       | `Microsoft.OperationalInsights/workspaces/*/write` | |
| Viewing data in the *Backup* and *Site Recovery* solution tiles | Administrator / Co-administrator | Accesses resources deployed using the classic deployment model |
| Creating a workspace in the Azure portal                        | `Microsoft.Resources/deployments/*` <br> `Microsoft.OperationalInsights/workspaces/*` ||


### Managing access to Log Analytics Workspace using Azure permissions 
To grant access to the Log Analytics workspace using Azure permissions, follow the steps in [use role assignments to manage access to your Azure subscription resources](../../role-based-access-control/role-assignments-portal.md).

Azure has two built-in user roles for Log Analytics workspaces:
- Log Analytics Reader
- Log Analytics Contributor

Members of the *Log Analytics Reader* role can:
- View and search all monitoring data 
- View monitoring settings, including viewing the configuration of Azure diagnostics on all Azure resources.

The Log Analytics Reader role includes the following Azure actions:

| Type    | Permission | Description |
| ------- | ---------- | ----------- |
| Action | `*/read`   | Ability to view all Azure resources and resource configuration. Includes viewing: <br> Virtual machine extension status <br> Configuration of Azure diagnostics on resources <br> All properties and settings of all resources |
| Action | `Microsoft.OperationalInsights/workspaces/analytics/query/action` | Ability to perform Log Search v2 queries |
| Action | `Microsoft.OperationalInsights/workspaces/search/action` | Ability to perform Log Search v1 queries |
| Action | `Microsoft.Support/*` | Ability to open support cases |
|Not Action | `Microsoft.OperationalInsights/workspaces/sharedKeys/read` | Prevents reading of workspace key required to use the data collection API and to install agents. This prevents the user from adding new resources to the workspace |


Members of the *Log Analytics Contributor* role can:
- Read all monitoring data as Log Analytics Reader can  
- Creating and configuring Automation accounts  
- Adding and removing management solutions    
    > [!NOTE] 
    > In order to successfully perform the last two actions, this permission needs to be granted at the resource group or subscription level.  

- Reading storage account keys   
- Configure collection of logs from Azure Storage  
- Edit monitoring settings for Azure resources, including
  - Adding the VM extension to VMs
  - Configuring Azure diagnostics on all Azure resources

> [!NOTE] 
> You can use the ability to add a virtual machine extension to a virtual machine to gain full control over a virtual machine.

The Log Analytics Contributor role includes the following Azure actions:

| Permission | Description |
| ---------- | ----------- |
| `*/read`     | Ability to view all resources and resource configuration. Includes viewing: <br> Virtual machine extension status <br> Configuration of Azure diagnostics on resources <br> All properties and settings of all resources |
| `Microsoft.Automation/automationAccounts/*` | Ability to create and configure Azure Automation accounts, including adding and editing runbooks |
| `Microsoft.ClassicCompute/virtualMachines/extensions/*` <br> `Microsoft.Compute/virtualMachines/extensions/*` | Add, update and remove virtual machine extensions, including the Microsoft Monitoring Agent extension and the OMS Agent for Linux extension |
| `Microsoft.ClassicStorage/storageAccounts/listKeys/action` <br> `Microsoft.Storage/storageAccounts/listKeys/action` | View the storage account key. Required to configure Log Analytics to read logs from Azure storage accounts |
| `Microsoft.Insights/alertRules/*` | Add, update, and remove alert rules |
| `Microsoft.Insights/diagnosticSettings/*` | Add, update, and remove diagnostics settings on Azure resources |
| `Microsoft.OperationalInsights/*` | Add, update, and remove configuration for Log Analytics workspaces |
| `Microsoft.OperationsManagement/*` | Add and remove management solutions |
| `Microsoft.Resources/deployments/*` | Create and delete deployments. Required for adding and removing solutions, workspaces, and automation accounts |
| `Microsoft.Resources/subscriptions/resourcegroups/deployments/*` | Create and delete deployments. Required for adding and removing solutions, workspaces, and automation accounts |

To add and remove users to a user role, it is necessary to have `Microsoft.Authorization/*/Delete` and `Microsoft.Authorization/*/Write` permission.

Use these roles to give users access at different scopes:
- Subscription - Access to all workspaces in the subscription
- Resource Group - Access to all workspace in the resource group
- Resource - Access to only the specified workspace

We recommend you perform assignments at the resource level (workspace) to assure accurate access control.  Use [custom roles](../../role-based-access-control/custom-roles.md) to create roles with the specific permissions needed.

## Defining per-table access control 
Your organization may require more granular control than workspace and resource. You can create [Azure custom roles](../../role-based-access-control/custom-roles.md) to give users access to specific [tables](../log-query/log-query-overview.md#how-azure-monitor-log-data-is-organized). These roles can be applied to workspaces with both workspace-centric and resource-centric access. They allow you to define specific data types that are accessible only to a specific set of users.

### Standard logs
Standard logs are tables in the workspace that support core features and data sources. The easiest way to identify these tables is under the [LogManagement category in the log schema](../log-query/get-started-portal.md#understand-the-schema). Tables outside of this category are considered custom logs.

- To give access to a table, include it in the **Actions** section of the role definition.
- To deny access to a table, include it in the **NotActions** section of the role definition.
- Use * to specify all tables.

For example, to create a role with access to the _Heartbeat_ and _AzureActivity_ tables, create a custom role using the following actions:

```
"Actions":  [
              "Microsoft.OperationalInsights/workspaces/query/Heartbeat/read",
              "Microsoft.OperationalInsights/workspaces/query/AzureActivity/read"
  ],
```

To create a role with access to only _SecurityBaseline_ and no other tables, create a custom role using the following actions:

```
    "Actions":  [
        "Microsoft.OperationalInsights/workspaces/query/*/read"
    ],
    "NotActions":  [
        "Microsoft.OperationalInsights/workspaces/query/SecurityBaseline/read"
    ],
```

### Custom logs
Custom logs are created by different monitoring solutions and other data sources such as custom logs and HTTP Data Collector API. You can't currently grant or deny access to individual custom logs, but you can grant or deny access to all custom logs.

To create a role with access to all custom logs, create a custom role using the following actions:

```
    "Actions":  [
        "Microsoft.OperationalInsights/workspaces/query/Tables.Custom/read"
    ],
```

### Considerations

- If a user is granted global read permission with the standard Reader or Contributor roles that include the _\*/read_ action, it will override the per-table access control and give them access to all log data.
- If a user is granted per-table access but no other permissions, they would be able to access log data from the API but from the Azure portal. To provide access to the Azure portal, use Log Analytics Reader as its base role.
- Administrators for the subscription will have access to all data types regardless of any other permission settings.
- Workspace owners are treated like any other user for per-table access control.
- You should assign roles to security groups instead of individual users to reduce the number of assignments. This will also help you use existing group management tools to configure and verify access.

## Next steps
* See [Log Analytics agent overview](../../azure-monitor/platform/log-analytics-agent.md) to gather data from computers in your datacenter or other cloud environment.
* See [Collect data about Azure Virtual Machines](../../azure-monitor/learn/quick-collect-azurevm.md) to configure data collection from Azure VMs.  

