---
title: Azure Virtual Desktop (classic) diagnostics log analytics - Azure
description: How to use log analytics with the Azure Virtual Desktop (classic) diagnostics feature.
author: Heidilohr
ms.topic: how-to
ms.date: 03/30/2020
ms.author: helohr
manager: femila
---
# Use Log Analytics for the diagnostics feature in Azure Virtual Desktop (classic)

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop (classic), which doesn't support Azure Resource Manager Azure Virtual Desktop objects. If you're trying to manage Azure Resource Manager Azure Virtual Desktop objects, see [this article](../diagnostics-log-analytics.md).

Azure Virtual Desktop offers a diagnostics feature that allows the administrator to identify issues through a single interface. This feature logs diagnostics information whenever someone assigned Azure Virtual Desktop role uses the service. Each log contains information about which Azure Virtual Desktop role was involved in the activity, any error messages that appear during the session, tenant information, and user information. The diagnostics feature creates activity logs for both user and administrative actions. Each activity log falls under three main categories:

- Feed subscription activities: when a user tries to connect to their feed through Microsoft Remote Desktop applications.
- Connection activities: when a user tries to connect to a desktop or RemoteApp through Microsoft Remote Desktop applications.
- Management activities: when an administrator performs management operations on the system, such as creating host pools, assigning users to application groups, and creating role assignments.

Connections that don't reach Azure Virtual Desktop won't show up in diagnostics results because the diagnostics role service itself is part of Azure Virtual Desktop. Azure Virtual Desktop connection issues can happen when the user is experiencing network connectivity issues.

## Why you should use Log Analytics

We recommend you use Log Analytics to analyze diagnostics data in the Azure client that goes beyond single-user troubleshooting. As you can pull in VM performance counters into Log Analytics you have one tool to gather information for your deployment.

## Before you get started

Before you can use Log Analytics with the diagnostics feature, you'll need to [create a workspace](../../azure-monitor/logs/quick-create-workspace.md).

After you've created your workspace, follow the instructions in [Connect Windows computers to Azure Monitor](../../azure-monitor/agents/agent-windows.md#workspace-id-and-key) to get the following information:

- The workspace ID
- The primary key of your workspace

You'll need this information later in the setup process.

## Push diagnostics data to your workspace

You can push diagnostics data from your Azure Virtual Desktop tenant into the Log Analytics for your workspace. You can set up this feature right away when you first create your tenant by linking your workspace to your tenant, or you can set it up later with an existing tenant.

To link your tenant to your Log Analytics workspace while you're setting up your new tenant, run the following cmdlet to sign in to Azure Virtual Desktop with your TenantCreator user account:

```powershell
Add-RdsAccount -DeploymentUrl https://rdbroker.wvd.microsoft.com
```

If you're going to link an existing tenant instead of a new tenant, run this cmdlet instead:

```powershell
Set-RdsTenant -Name <TenantName> -AzureSubscriptionId <SubscriptionID> -LogAnalyticsWorkspaceId <String> -LogAnalyticsPrimaryKey <String>
```

You'll need to run these cmdlets for every tenant you want to link to Log Analytics.

>[!NOTE]
>If you don't want to link the Log Analytics workspace when you create a tenant, run the `New-RdsTenant` cmdlet instead.

## Cadence for sending diagnostic events

Diagnostic events are sent to Log Analytics when completed.

## Example queries

The following example queries show how the diagnostics feature generates a report for the most frequent activities in your system:

This first example shows connection activities initiated by users with supported remote desktop clients:

```kusto
WVDActivityV1_CL
| where Type_s == "Connection"
| join kind=leftouter (
    WVDErrorV1_CL
    | summarize Errors = makelist(pack('Time', Time_t, 'Code', ErrorCode_s , 'CodeSymbolic', ErrorCodeSymbolic_s, 'Message', ErrorMessage_s, 'ReportedBy', ReportedBy_s , 'Internal', ErrorInternal_s )) by ActivityId_g
    ) on $left.Id_g  == $right.ActivityId_g 
| join  kind=leftouter (
    WVDCheckpointV1_CL
    | summarize Checkpoints = makelist(pack('Time', Time_t, 'ReportedBy', ReportedBy_s, 'Name', Name_s, 'Parameters', Parameters_s) ) by ActivityId_g
    ) on $left.Id_g  == $right.ActivityId_g
|project-away ActivityId_g, ActivityId_g1
```

This next example query shows management activities by admins on tenants:

```kusto
WVDActivityV1_CL
| where Type_s == "Management"
| join kind=leftouter (
    WVDErrorV1_CL
    | summarize Errors = makelist(pack('Time', Time_t, 'Code', ErrorCode_s , 'CodeSymbolic', ErrorCodeSymbolic_s, 'Message', ErrorMessage_s, 'ReportedBy', ReportedBy_s , 'Internal', ErrorInternal_s )) by ActivityId_g
    ) on $left.Id_g  == $right.ActivityId_g 
| join  kind=leftouter (
    WVDCheckpointV1_CL
    | summarize Checkpoints = makelist(pack('Time', Time_t, 'ReportedBy', ReportedBy_s, 'Name', Name_s, 'Parameters', Parameters_s) ) by ActivityId_g
    ) on $left.Id_g  == $right.ActivityId_g
|project-away ActivityId_g, ActivityId_g1
```

## Stop sending data to Log Analytics

To stop sending data from an existing tenant to Log Analytics, run the following cmdlet and set empty strings:

```powershell
Set-RdsTenant -Name <TenantName> -AzureSubscriptionId <SubscriptionID> -LogAnalyticsWorkspaceId <String> -LogAnalyticsPrimaryKey <String>
```

You'll need to run this cmdlet for every tenant you want to stop sending data from.

## Next steps

To review common error scenarios that the diagnostics feature can identify for you, see [Identify and diagnose issues](diagnostics-role-service-2019.md#common-error-scenarios).
