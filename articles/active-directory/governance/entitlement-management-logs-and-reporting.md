---
title: Archive & report with Azure Monitor - entitlement management
description: Learn how to archive logs and create reports with Azure Monitor in entitlement management.
services: active-directory
documentationCenter: ''
author: owinfreyatl
manager: amycolannino
editor: 
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: how-to
ms.subservice: compliance
ms.date: 05/31/2023
ms.author: owinfrey
ms.reviewer: 
ms.collection: M365-identity-device-management 
ms.custom: devx-track-azurepowershell


#Customer intent: As an administrator, I want to extend data retention in entitlement management past the default period by using Azure Monitor.

---
# Archive logs and reporting on entitlement management in Azure Monitor

Microsoft Entra ID stores audit events for up to 30 days in the audit log. However, you can keep the audit data for longer than the default retention period, outlined in [How long does Microsoft Entra ID store reporting data?](../reports-monitoring/reference-reports-data-retention.md), by routing it to an Azure Storage account or using Azure Monitor. You can then use workbooks and custom queries and reports on this data.


<a name='configure-azure-ad-to-use-azure-monitor'></a>

## Configure Microsoft Entra ID to use Azure Monitor

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

Before you use the Azure Monitor workbooks, you must configure Microsoft Entra ID to send a copy of its audit logs to Azure Monitor.

Archiving Microsoft Entra audit logs requires you to have Azure Monitor in an Azure subscription. You can read more about the prerequisites and estimated costs of using Azure Monitor in [Microsoft Entra activity logs in Azure Monitor](../reports-monitoring/concept-activity-logs-azure-monitor.md).

**Prerequisite role**: Global Administrator

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as a Global Administrator. Make sure you have access to the resource group containing the Azure Monitor workspace.
 
1. Browse to **Identity** > **Monitoring & health** > **Diagnostic settings**.

1. Check if there's already a setting to send the audit logs to that workspace.

1. If there isn't already a setting, select **Add diagnostic setting**. Use the instructions in [Integrate Microsoft Entra logs with Azure Monitor logs](../reports-monitoring/howto-integrate-activity-logs-with-log-analytics.md) to send the Microsoft Entra audit log to the Azure Monitor workspace.

    ![Diagnostics settings pane](./media/entitlement-management-logs-and-reporting/audit-log-diagnostics-settings.png)

1. After the log is sent to Azure Monitor, select **Log Analytics workspaces**, and select the workspace that contains the Microsoft Entra audit logs.

1. Select **Usage and estimated costs** and select **Data Retention**. Change the slider to the number of days you want to keep the data to meet your auditing requirements.

    ![Log Analytics workspaces pane](./media/entitlement-management-logs-and-reporting/log-analytics-workspaces.png)

1. Later, to see the range of dates held in your workspace, you can use the *Archived Log Date Range* workbook:  
    
    1. Browse to **Identity** > **Monitoring & health** > **Workbooks**.
    
    1. Expand the section **Microsoft Entra Troubleshooting**, and select on **Archived Log Date Range**. 

## View events for an access package  

To view events for an access package, you must have access to the underlying Azure monitor workspace (see [Manage access to log data and workspaces in Azure Monitor](../../azure-monitor/logs/manage-access.md#azure-rbac) for information) and in one of the following roles: 

- Global administrator  
- Security administrator  
- Security reader  
- Reports reader  
- Application administrator  

Use the following procedure to view events: 

1. In the Microsoft Entra admin center, select **Identity** then select **Workbooks**. If you only have one subscription, move on to step 3. 

1. If you have multiple subscriptions, select the subscription that contains the workspace.  

1. Select the workbook named *Access Package Activity*. 

1. In that workbook, select a time range (change to **All** if not sure), and select an access package ID from the drop-down list of all access packages that had activity during that time range. The events related to the access package that occurred during the selected time range will be displayed.

    ![View access package events](./media/entitlement-management-logs-and-reporting/view-events-access-package.png) 

    Each row includes the time, access package ID, the name of the operation, the object ID, UPN, and the display name of the user who started the operation.  Additional details are included in JSON.

1. If you would like to see if there have been changes to application role assignments for an application that weren't due to access package assignments, such as by a global administrator directly assigning a user to an application role, then you can select the workbook named *Application role assignment activity*.

    ![View app role assignments](./media/entitlement-management-access-package-incompatible/workbook-ara.png)

## Create custom Azure Monitor queries using the Microsoft Entra admin center
You can create your own queries on Microsoft Entra audit events, including entitlement management events.  

1. In Identity of the Microsoft Entra admin center, select **Logs** under the Monitoring section in the left navigation menu to create a new query page.

1. Your workspace should be shown in the upper left of the query page. If you have multiple Azure Monitor workspaces, and the workspace you're using to store Microsoft Entra audit events isn't shown, select **Select Scope**. Then, select the correct subscription and workspace.

1. Next, in the query text area, delete the string "search *" and replace it with the following query:

    ```
    AuditLogs | where Category == "EntitlementManagement"
    ```

1. Then select **Run**. 

    ![Click Run to start query](./media/entitlement-management-logs-and-reporting/run-query.png)

The table shows the Audit log events for entitlement management from the last hour by default. You can change the "Time range" setting to view older events. However, changing this setting will only show events that occurred after Microsoft Entra ID was configured to send events to Azure Monitor.

If you would like to know the oldest and newest audit events held in Azure Monitor, use the following query:

```
AuditLogs | where TimeGenerated > ago(3653d) | summarize OldestAuditEvent=min(TimeGenerated), NewestAuditEvent=max(TimeGenerated) by Type
```

For more information on the columns that are stored for audit events in Azure Monitor, see [Interpret the Microsoft Entra audit logs schema in Azure Monitor](../reports-monitoring/overview-reports.md).

## Create custom Azure Monitor queries using Azure PowerShell

You can access logs through PowerShell after you've configured Microsoft Entra ID to send logs to Azure Monitor. Then, send queries from scripts or the PowerShell command line, without needing to be a Global Administrator in the tenant. 

### Ensure the user or service principal has the correct role assignment

Make sure you, the user or service principal that will authenticate to Microsoft Entra ID, are in the appropriate Azure role in the Log Analytics workspace. The role options are either Log Analytics Reader or the Log Analytics Contributor. If you're already in one of those roles, then skip to [Retrieve Log Analytics ID with one Azure subscription](#retrieve-log-analytics-id-with-one-azure-subscription).

To set the role assignment and create a query, do the following steps:

1. In the Microsoft Entra admin center, locate the [Log Analytics workspace](https://entra.microsoft.com/#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.OperationalInsights%2Fworkspaces).

1. Select **Access Control (IAM)**.

1. Then select **Add** to add a role assignment.

    ![Add a role assignment](./media/entitlement-management-logs-and-reporting/workspace-set-role-assignment.png)

### Install Azure PowerShell module

Once you have the appropriate role assignment, launch PowerShell, and [install the Azure PowerShell module](/powershell/azure/install-azure-powershell) (if you haven't already), by typing:

```azurepowershell
install-module -Name az -allowClobber -Scope CurrentUser
```
    
Now you're ready to authenticate to Microsoft Entra ID, and retrieve the ID of the Log Analytics workspace you're querying.

### Retrieve Log Analytics ID with one Azure subscription
If you have only a single Azure subscription, and a single Log Analytics workspace, then type the following to authenticate to Microsoft Entra ID, connect to that subscription, and retrieve that workspace:
 
```azurepowershell
Connect-AzAccount
$wks = Get-AzOperationalInsightsWorkspace
```
 
### Retrieve Log Analytics ID with multiple Azure subscriptions

 [Get-AzOperationalInsightsWorkspace](/powershell/module/Az.OperationalInsights/Get-AzOperationalInsightsWorkspace) operates in one subscription at a time. So, if you have multiple Azure subscriptions, you want to make sure you connect to the one that has the Log Analytics workspace with the Microsoft Entra logs. 
 
 The following cmdlets display a list of subscriptions, and find the ID of the subscription that has the Log Analytics workspace:
 
```azurepowershell
Connect-AzAccount
$subs = Get-AzSubscription
$subs | ft
```
 
You can reauthenticate and associate your PowerShell session to that subscription using a command such as `Connect-AzAccount –Subscription $subs[0].id`. To learn more about how to authenticate to Azure from PowerShell, including non-interactively, see [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).

If you have multiple Log Analytics workspaces in that subscription, then the cmdlet [Get-AzOperationalInsightsWorkspace](/powershell/module/Az.OperationalInsights/Get-AzOperationalInsightsWorkspace) returns the list of workspaces. Then you can find the one that has the Microsoft Entra logs. The `CustomerId` field returned by this cmdlet is the same as the value of the "Workspace ID" displayed in the Microsoft Entra admin center in the Log Analytics workspace overview.
 
```powershell
$wks = Get-AzOperationalInsightsWorkspace
$wks | ft CustomerId, Name
```

### Send the query to the Log Analytics workspace
Finally, once you have a workspace identified, you can use [Invoke-AzOperationalInsightsQuery](/powershell/module/az.operationalinsights/Invoke-AzOperationalInsightsQuery) to send a Kusto query to that workspace. These queries are written in [Kusto query language](/azure/kusto/query/).
 
For example, you can retrieve the date range of the audit event records from the Log Analytics workspace, with PowerShell cmdlets to send a query like:
 
```powershell
$aQuery = "AuditLogs | where TimeGenerated > ago(3653d) | summarize OldestAuditEvent=min(TimeGenerated), NewestAuditEvent=max(TimeGenerated) by Type"
$aResponse = Invoke-AzOperationalInsightsQuery -WorkspaceId $wks[0].CustomerId -Query $aQuery
$aResponse.Results |ft
```

You can also retrieve entitlement management events using a query like:

```azurepowershell
$bQuery = 'AuditLogs | where Category == "EntitlementManagement"'
$bResponse = Invoke-AzOperationalInsightsQuery -WorkspaceId $wks[0].CustomerId -Query $Query
$bResponse.Results |ft 
```

### Using query filters

You can include the `TimeGenerated` field to scope a query to a particular time range. For example, to retrieve the audit log events for entitlement management access package assignment policies being created or updated in the last 90 days, you can supply a query that includes this field as well the category and operation type.

```
AuditLogs | 
where TimeGenerated > ago(90d) and Category == "EntitlementManagement" and Result == "success" and (AADOperationType == "CreateEntitlementGrantPolicy" or AADOperationType == "UpdateEntitlementGrantPolicy") | 
project ActivityDateTime,OperationName, InitiatedBy, AdditionalDetails, TargetResources
```

For audit events of some services such as entitlement management, you can also expand and filter on the affected properties of the resources being changed.  For example, you can view just those audit log records for access package assignment policies being created or updated, that do not require approval for users to have an assignment added.

```
AuditLogs | 
where TimeGenerated > ago(90d) and Category == "EntitlementManagement" and Result == "success" and (AADOperationType == "CreateEntitlementGrantPolicy" or AADOperationType == "UpdateEntitlementGrantPolicy") | 
mv-expand TargetResources | 
where TargetResources.type == "AccessPackageAssignmentPolicy" | 
project ActivityDateTime,OperationName,InitiatedBy,PolicyId=TargetResources.id,PolicyDisplayName=TargetResources.displayName,MP1=TargetResources.modifiedProperties | 
mv-expand MP1 | 
where (MP1.displayName == "IsApprovalRequiredForAdd" and MP1.newValue == "\"False\"") |
order by ActivityDateTime desc 
```

## Next steps
- [Create interactive reports with Azure Monitor workbooks](../../azure-monitor/visualize/workbooks-overview.md)
