---
title: Windows Virtual Desktop diagnostics log analytics - Azure
description: How to use log analytics with the Windows Virtual Desktop diagnostics feature.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 12/16/2019
ms.author: helohr
---
# Use diagnostics with Log Analytics

Windows Virtual Desktop offers a diagnostics feature that allows the administrator to identify issues through a single interface. The Windows Virtual Desktop roles log a diagnostic activity whenever a user interacts with the system. Each log contains relevant information such as the Windows Virtual Desktop roles involved in the transaction, error messages, tenant information, and user information. Diagnostic activities are created by both end-user and administrative actions, and can be categorized into three main buckets: 

- Feed subscription activities: the end-user triggers these activities whenever they try to connect to their feed through Microsoft Remote Desktop applications. 
- Connection activities: the end-user triggers these activities whenever they try to connect to a desktop or RemoteApp through Microsoft Remote Desktop applications. 
- Management activities: the administrator triggers these activities whenever they perform management operations on the system, such as creating host pools, assigning users to app groups, and creating role assignments. 

Connections that don’t reach Windows Virtual Desktop won't show up in diagnostics results because the diagnostics role service itself is part of Windows Virtual Desktop. Windows Virtual Desktop connection issues can happen when the end-user is experiencing network connectivity issues.

## Why you should use Log Analytics

We recommend you use Log Analytics to analyze diagnostics data in the Azure client that goes beyond single-user troubleshooting. As you can pull in VM performance counters into Log Analytics you have one tool to gather information for your deployment. 

## Before you get started

Before you can use Log Analytics with the diagnostics feature, you'll need to [create a workspace](../azure-monitor/learn/quick-collect-windows-computer.md#create-a-workspace).

After you've created your workspace, follow the instructions in [Connect Windows computers to Azure Monitor](../azure-monitor/platform/agent-windows.md#obtain-workspace-id-and-key) to get the following info: 

- Workspace ID
- Primary Key 

## Push diagnostics data to your workspace 

You can push diagnostics data from your Windows Virtual Desktop tenant into your Log Analytics workspace. You can either set up this feature by linking your workspace to your tenant when you first create your tenant, or you can set it up later.

To link your tenant to your Log Analytics workspace, run the following cmdlet to sign in to Windows Virtual Desktop with your TenantCreator user account: 

```powershell
Add-RdsAccount -DeploymentUrl https://rdbroker.wvd.microsoft.com 
```

If you're going to link an existing tenant instead of a new tenant, run the following cmdlet: 

```powershell
Set-RdsTenant -Name <TenantName> -AzureSubscriptionId <SubscriptionID> -LogAnalyticsWorkspaceId <String> -LogAnalyticsPrimaryKey <String> 
```

You'll need to run these cmdlets for every tenant you want to link to Log Analytics. 

>[!NOTE]
>If you want to not link the Log Analytics workspace when you create a tenant, run the `New-RdsTenant` cmdlet. 

## Cadence for sending diagnostic events

Diagnostic events are sent to Log Analytics when completed.  

## Example queries

The following example queries demonstrate how to generate a report for the most frequent activities in your system:

- The first example shows connection activities initiated by users with supported remote desktop clients. 
- The second example shows management activities administrators perform on tenants. 

```powershell
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
 
## Stop Sending Data to Log Analytics 

To stop sending data from an existing tenant to Log Analytics, run the following cmdlet and set empty strings:

```powershell
Set-RdsTenant -Name <TenantName> -AzureSubscriptionId <SubscriptionID> -LogAnalyticsWorkspaceId <String> -LogAnalyticsPrimaryKey <String> 
```

You'll need to run this cmdlet for every tenant you want to stop sending data from. 

## Next steps 

Check out [Identify and diagnoise issues](diagnostics-role-service.md#common-error-scenarios) to review common error scenarios that the diagnostics feature can identify.
