---
title: Manage workspaces in Azure Log Analytics and the OMS portal | Microsoft Docs
description: You can manage workspaces in Azure Log Analytics and the OMS portal using a variety of administrative tasks on users, accounts, workspaces, and Azure accounts.
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
ms.date: 11/13/2018
ms.author: magoedte
---

# Manage workspaces

To manage access to Log Analytics, you perform various administrative tasks related to workspaces. This article provides advice and procedures to manage workspaces. A workspace is essentially a container that includes account information and simple configuration information for the account. You or other members of your organization might use multiple workspaces to manage different sets of data that is collected from all or portions of your IT infrastructure.

To create a workspace, you need to:

1. Have an Azure subscription.
2. Choose a workspace name.
3. Associate the workspace with one of your subscriptions and resource groups.
4. Choose a geographical location.

## Determine the number of workspaces you need
A workspace is an Azure resource and is a container where data is collected, aggregated, analyzed, and presented in the Azure portal.

You can have multiple workspaces per Azure subscription and you can have access to more than one workspace, with the ability to easily query across them. This section describes when it can be helpful to create more than one workspace.

Today, a workspace provides:

* A geographic location for data storage
* Data isolation to define different user access rights
* Scope for configuration of settings like [pricing tier](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/manage-cost-storage#changing-pricing-tier), [retention](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/manage-cost-storage#change-the-data-retention-period) and [data capping](https://docs.microsoft.com/en-us/azure/azure-monitor/platform/manage-cost-storage#daily-cap) 

From consumption point of view, we recommend you create as few workspaces as possible. It makes administration and query experience easier and quicker. But, based on the preceding characteristics, you may want to create multiple workspaces if:

* You are a global company and you need data stored in specific regions for data sovereignty or compliance reasons.
* You are using Azure and you want to avoid outbound data transfer charges by having a workspace in the same region as the Azure resources it manages.
* You want to allocate charges to different departments or business groups based on their usage by creating a workspace for each department or business group in its own Azure subscription.
* You are a managed service provider and need to keep the Log Analytics data for each customer you manage isolated from other customer’s data.
* You manage multiple customers and you want each customer / department / business group to see their own data, but not data from others.

When using Windows agents to collect data, you can [configure each agent to report to one or more workspaces](../../azure-monitor/platform/agent-windows.md).

If you are using System Center Operations Manager, each Operations Manager management group can be connected with only one workspace. You can install the Microsoft Monitoring Agent on computers managed by Operations Manager and have the agent report to both Operations Manager and a different Log Analytics workspace.

## Workspace information

You can view details about your workspace in the Azure portal. 

1. If you haven't already done so, sign in to the [Azure portal](https://portal.azure.com).

2. In the Azure portal, click **All services**. In the list of resources, type **Log Analytics**. As you begin typing, the list filters based on your input. Select **Log Analytics**.  

    ![Azure portal](media/manage-access/azure-portal-01.png)  

3. On the Log Analytics subscriptions pane, select a workspace.

4. The workspace page displays details about the getting started, configuration, and links for additional information.  

    ![Workspace details](./media/manage-access/workspace-overview-page.png)  

## Manage accounts and users
Each workspace can have multiple accounts associated with it, and each account can have access to multiple workspaces. Access is managed via [Azure role-based access](../../role-based-access-control/role-assignments-portal.md). These access rights applies both on the Azure portal and on the API access.


The following activities also require Azure permissions:

| Action                                                          | Azure Permissions Needed | Notes |
|-----------------------------------------------------------------|--------------------------|-------|
| Adding and removing management solutions                        | `Microsoft.Resources/deployments/*` <br> `Microsoft.OperationalInsights/*` <br> `Microsoft.OperationsManagement/*` <br> `Microsoft.Automation/*` <br> `Microsoft.Resources/deployments/*/write` | These permissions need to be granted at resource group or subscription level. |
| Changing the pricing tier                                       | `Microsoft.OperationalInsights/workspaces/*/write` | |
| Viewing data in the *Backup* and *Site Recovery* solution tiles | Administrator / Co-administrator | Accesses resources deployed using the classic deployment model |
| Creating a workspace in the Azure portal                        | `Microsoft.Resources/deployments/*` <br> `Microsoft.OperationalInsights/workspaces/*` ||


### Managing access to Log Analytics using Azure permissions
To grant access to the Log Analytics workspace using Azure permissions, follow the steps in [use role assignments to manage access to your Azure subscription resources](../../role-based-access-control/role-assignments-portal.md).

Azure has two built-in user roles for Log Analytics:
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

## Next steps
* See [Log Analytics agent overview](../../azure-monitor/platform/log-analytics-agent.md) to gather data from computers in your datacenter or other cloud environment.
* See [Collect data about Azure Virtual Machines](../../azure-monitor/learn/quick-collect-azurevm.md) to configure data collection from Azure VMs.  
* [Add Log Analytics solutions from the Solutions Gallery](../../azure-monitor/insights/solutions.md) to add functionality and gather data.

