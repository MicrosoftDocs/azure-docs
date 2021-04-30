---
title: Integrate with Azure Monitor logs
description: This article tells how to send Desired State Configuration reporting data from Azure Automation State Configuration to Azure Monitor logs.
services: automation
ms.service: automation
ms.subservice: dsc
author: mgoedtel
ms.author: magoedte
ms.date: 11/06/2018
ms.topic: conceptual 
ms.custom: devx-track-azurepowershell
manager: carmonm
---
# Integrate with Azure Monitor logs

Azure Automation State Configuration retains node status data for 30 days. You can send node status data to your Log Analytics workspace if you prefer to retain this data for a longer period. Compliance status is visible in the Azure portal or with PowerShell, for nodes and for individual DSC resources in node configurations. 

Azure Monitor logs provides greater operational visibility to your Automation State Configuration data and can help address incidents more quickly. With Azure Monitor logs you can:

- Get compliance information for managed nodes and individual resources.
- Trigger an email or alert based on compliance status.
- Write advanced queries across your managed nodes.
- Correlate compliance status across Automation accounts.
- Use custom views and search queries to visualize your runbook results, runbook job status, and other related key indicators or metrics.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../includes/azure-monitor-log-analytics-rebrand.md)]

## Prerequisites

To start sending your Automation State Configuration reports to Azure Monitor logs, you need:

- The November 2016 or later release of [Azure PowerShell](/powershell/azure/) (v2.3.0).
- An Azure Automation account. For more information, see [An introduction to Azure Automation](automation-intro.md).
- A Log Analytics workspace with an Automation & Control service offering. For more information, see [Get started with Log Analytics in Azure Monitor](../azure-monitor/logs/log-analytics-tutorial.md).
- At least one Azure Automation State Configuration node. For more information, see [Onboarding machines for management by Azure Automation State Configuration](automation-dsc-onboarding.md).
- The [xDscDiagnostics](https://www.powershellgallery.com/packages/xDscDiagnostics/2.7.0.0) module, version 2.7.0.0 or greater. For installation steps, see [Troubleshoot Azure Automation Desired State Configuration](./troubleshoot/desired-state-configuration.md).

## Set up integration with Azure Monitor logs

To begin importing data from Azure Automation State Configuration into Azure Monitor logs, complete the following steps:

1. Log in to your Azure account in PowerShell. See [Sign in with Azure PowerShell](/powershell/azure/authenticate-azureps).
1. Get the resource ID of your Automation account by running the following PowerShell cmdlet. If you have more than one automation account, choose the resource ID for the account that you want to configure.

   ```powershell
   # Find the ResourceId for the Automation account
   Get-AzResource -ResourceType 'Microsoft.Automation/automationAccounts'
   ```

1. Get the resource ID of your Log Analytics workspace by running the following PowerShell cmdlet. If you have more than one workspace, choose the resource ID for the workspace that you want to configure.

   ```powershell
   # Find the ResourceId for the Log Analytics workspace
   Get-AzResource -ResourceType 'Microsoft.OperationalInsights/workspaces'
   ```

1. Run the following PowerShell cmdlet, replacing `<AutomationResourceId>` and `<WorkspaceResourceId>` with the `ResourceId` values from each of the previous steps.

   ```powershell
   Set-AzDiagnosticSetting -ResourceId <AutomationResourceId> -WorkspaceId <WorkspaceResourceId> -Enabled $true -Category 'DscNodeStatus'
   ```

1. If you want to stop importing data from Azure Automation State Configuration into Azure Monitor logs, run the following PowerShell cmdlet.

   ```powershell
   Set-AzDiagnosticSetting -ResourceId <AutomationResourceId> -WorkspaceId <WorkspaceResourceId> -Enabled $false -Category 'DscNodeStatus'
   ```

## View the State Configuration logs

After you set up integration with Azure Monitor logs for your Automation State Configuration data, you can view them by selecting **Logs** in the **Monitoring** section in the left pane of the State configuration (DSC) page.

![Logs](media/automation-dsc-diagnostics/automation-dsc-logs-toc-item.png)

The Log Search pane opens with a query region scoped to your Automation account resource. You can search the State Configuration logs for DSC operations by searching in Azure Monitor logs. The records for DSC operations are stored in the `AzureDiagnostics` table. For example, to find nodes that are not compliant, type the following query.

```AzureDiagnostics
| where Category == 'DscNodeStatus' 
| where OperationName contains 'DSCNodeStatusData'
| where ResultType != 'Compliant'
```

Filtering details:

* Filter on `DscNodeStatusData` to return operations for each State Configuration node.
* Filter on `DscResourceStatusData` to return operations for each DSC resource called in the node configuration applied to that resource. 
* Filter on `DscResourceStatusData` to return error information for any DSC resources that fail.

To learn more about constructing log queries to find data, see [Overview of log queries in Azure Monitor](../azure-monitor/logs/log-query-overview.md).

### Send an email when a State Configuration compliance check fails

One of our top customer requests is for the ability to send an email or a text when something goes wrong with a DSC configuration.

To create an alert rule, start by creating a log search for the State Configuration report records that should invoke the alert. Click the **New Alert Rule** button to create and configure
the alert rule.

1. From the Log Analytics workspace Overview page, click **Logs**.
1. Create a log search query for your alert by typing the following search in the query field:  `Type=AzureDiagnostics Category='DscNodeStatus' NodeName_s='DSCTEST1' OperationName='DscNodeStatusData' ResultType='Failed'`

   If you have set up logs from more than one Automation account or subscription to your workspace, you can group your alerts by subscription and Automation account. Derive the Automation account name from the `Resource` field in the search of the `DscNodeStatusData` records.
1. To open the **Create rule** screen, click **New Alert Rule** at the top of the page. 

For more information on the options to configure the alert, see [Create an alert rule](../azure-monitor/alerts/alerts-metric.md).

### Find failed DSC resources across all nodes

One advantage of using Azure Monitor logs is that you can search for failed checks across nodes. To find all instances of DSC resources that have failed:

1. On the Log Analytics workspace Overview page, click **Logs**.
1. Create a log search query for your alert by typing the following search into the query field:  `Type=AzureDiagnostics Category='DscNodeStatus' OperationName='DscResourceStatusData' ResultType='Failed'`

### View historical DSC node status

To visualize your DSC node status history over time, you can use this query:

`Type=AzureDiagnostics ResourceProvider="MICROSOFT.AUTOMATION" Category=DscNodeStatus NOT(ResultType="started") | measure Count() by ResultType interval 1hour`

This query displays a chart of the node status over time.

## Azure Monitor logs records

Azure Automation diagnostics create two categories of records in Azure Monitor logs:

* Node status data (`DscNodeStatusData`)
* Resource status data (`DscResourceStatusData`)

### DscNodeStatusData

| Property | Description |
| --- | --- |
| TimeGenerated |Date and time when the compliance check ran. |
| OperationName |`DscNodeStatusData`. |
| ResultType |Value that indicates if the node is compliant. |
| NodeName_s |The name of the managed node. |
| NodeComplianceStatus_s |Status value that specifies if the node is compliant. |
| DscReportStatus |Status value indicating if the compliance check ran successfully. |
| ConfigurationMode | The mode used to apply the configuration to the node. Possible values are: <ul><li>`ApplyOnly`: DSC applies the configuration and does nothing further unless a new configuration is pushed to the target node or when a new configuration is pulled from a server. After initial application of a new configuration, DSC does not check for drift from a previously configured state. DSC attempts to apply the configuration until it is successful before the `ApplyOnly` value takes effect. </li><li>`ApplyAndMonitor`: This is the default value. The LCM applies any new configurations. After initial application of a new configuration, if the target node drifts from the desired state, DSC reports the discrepancy in logs. DSC attempts to apply the configuration until it is successful before the `ApplyAndMonitor` value takes effect.</li><li>`ApplyAndAutoCorrect`: DSC applies any new configurations. After initial application of a new configuration, if the target node drifts from the desired state, DSC reports the discrepancy in logs, and then reapplies the current configuration.</li></ul> |
| HostName_s | The name of the managed node. |
| IPAddress | The IPv4 address of the managed node. |
| Category | `DscNodeStatus`. |
| Resource | The name of the Azure Automation account. |
| Tenant_g | GUID that identifies the tenant for the caller. |
| NodeId_g | GUID that identifies the managed node. |
| DscReportId_g | GUID that identifies the report. |
| LastSeenTime_t | Date and time when the report was last viewed. |
| ReportStartTime_t | Date and time when the report was started. |
| ReportEndTime_t | Date and time when the report completed. |
| NumberOfResources_d | The number of DSC resources called in the configuration applied to the node. |
| SourceSystem | The source system identifying how Azure Monitor logs has collected the data. Always `Azure` for Azure diagnostics. |
| ResourceId |The resource identifier of the Azure Automation account. |
| ResultDescription | The resource description for this operation. |
| SubscriptionId | The Azure subscription ID (GUID) for the Automation account. |
| ResourceGroup | The name of the resource group for the Automation account. |
| ResourceProvider | MICROSOFT.AUTOMATION. |
| ResourceType | AUTOMATIONACCOUNTS. |
| CorrelationId | A GUID that is the correlation identifier of the compliance report. |

### DscResourceStatusData

| Property | Description |
| --- | --- |
| TimeGenerated |Date and time when the compliance check ran. |
| OperationName |`DscResourceStatusData`.|
| ResultType |Whether the resource is compliant. |
| NodeName_s |The name of the managed node. |
| Category | DscNodeStatus. |
| Resource | The name of the Azure Automation account. |
| Tenant_g | GUID that identifies the tenant for the caller. |
| NodeId_g |GUID that identifies the managed node. |
| DscReportId_g |GUID that identifies the report. |
| DscResourceId_s |The name of the DSC resource instance. |
| DscResourceName_s |The name of the DSC resource. |
| DscResourceStatus_s |Whether the DSC resource is in compliance. |
| DscModuleName_s |The name of the PowerShell module that contains the DSC resource. |
| DscModuleVersion_s |The version of the PowerShell module that contains the DSC resource. |
| DscConfigurationName_s |The name of the configuration applied to the node. |
| ErrorCode_s | The error code if the resource failed. |
| ErrorMessage_s |The error message if the resource failed. |
| DscResourceDuration_d |The time, in seconds, that the DSC resource ran. |
| SourceSystem | How Azure Monitor logs collected the data. Always `Azure` for Azure diagnostics. |
| ResourceId |The identifier of the Azure Automation account. |
| ResultDescription | The description for this operation. |
| SubscriptionId | The Azure subscription ID (GUID) for the Automation account. |
| ResourceGroup | The name of the resource group for the Automation account. |
| ResourceProvider | MICROSOFT.AUTOMATION. |
| ResourceType | AUTOMATIONACCOUNTS. |
| CorrelationId |GUID that is the correlation ID of the compliance report. |

## Next steps

- For an overview, see [Azure Automation State Configuration overview](automation-dsc-overview.md).
- To get started, see [Get started with Azure Automation State Configuration](automation-dsc-getting-started.md).
- To learn about compiling DSC configurations so that you can assign them to target nodes, see [Compile DSC configurations in Azure Automation State Configuration](automation-dsc-compile.md).
- For a PowerShell cmdlet reference, see [Az.Automation](/powershell/module/az.automation).
- For pricing information, see [Azure Automation State Configuration pricing](https://azure.microsoft.com/pricing/details/automation/).
- To see an example of using Azure Automation State Configuration in a continuous deployment pipeline, see [Set up continuous deployment with Chocolatey](automation-dsc-cd-chocolatey.md).
- To learn more about how to construct different search queries and review the Automation State Configuration logs with Azure Monitor logs, see [Log searches in Azure Monitor logs](../azure-monitor/logs/log-query-overview.md).
- To learn more about Azure Monitor logs and data collection sources, see [Collecting Azure storage data in Azure Monitor logs overview](../azure-monitor/essentials/resource-logs.md#send-to-log-analytics-workspace).
