---
title: Introducing the new diagnostics role service
description: Describes the new Windows Virtual Desktop diagnostics role service and how to use it.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 10/25/2018
ms.author: helohr
---
# Introducing the new diagnostics role service

We are introducing the first capabilities of the diagnostics role service in your tenant environment. This role service is designed to help you identify issues faster. Use the documented PowerShell cmdlets to review connection activities triggered by users connecting to your resources. The diagnostics role service will cover the following scenarios:

* Connection activities: A connection activity is triggered from the end user using one of our apps that support Windows Virtual Desktop (see client guidance for more information). If the connection is interrupted, the user UPN will identify which component interrupted the connection.
* Management activities: A management activity is triggered by the infrastructure administrator configuring the system. If there are any issues, use the UPN to identify the cause.

The following scenarios are on the roadmap to be covered before full release:

* Feed subscription activities: These are triggered by the end user who is subscribing to published apps or desktop made available by the tenant admin. If an activity deosn't complete, the user UPN will identify why the resource download was disrupted.

## Diagnostics validation and issue reporting guidance

Prerequisites:

```PowerShell
Import-module .\Microsoft.RdInfra.RdPowershell.dll
```

```PowerShell
Set-RdsContext -DeploymentUrl <Windows Virtual Desktop Broker URL>  # you will be prompted for credentials
```

Validate the following scenarios after your users confirm that they attempted to connect to your tenant environment.

* Use **Get-RdsDiagnosticsActivities** to identify activities on your deployment.
* Use **Get-RdsDiagnosticsActivities** parameters to query failed management or connection activities reported by users who own these roles.
* Use the details parameter to get additional information on the selected activity.

You should report any failed connection and management activities you encounter.

>[!IMPORTANT]
>When reporting an issue, retrieve the Correlation ID for management and connection failures with the documented diagnostics cmdlets. Retrieving the Correlation ID will allow you to automatically send review logs from your test deployment to Azure and the diagnostics team. The automatic log-upload is enabled by default in TP1. The following is an example of the diagnostics output.
> ```PowerShell
> CorrelationId: 45536553-ea09-452d-a1b3-97de463ec119
> ScenarioType: ManagementScenario
> StartTime: 10/20/2017 5:00:12 PM
> EndTime: 10/20/2017 5:00:14 PM
> UserIdentity: adam@contoso.com
> RoleInstances: RD00155D4B5BAA;
> ScenariosOutcomeMajorClass: Failure
> ScenarioOutcomeMinorClass: Unknown
> ```

Connections that didn't reach the infrastructure won't show up in the diagnostics results, as no diagnostic information from the remote desktop appas is shared in this release.

## PowerShell cmdlet

You can query all activities for a specific user by running the following PowerShell cmdlet. This cmdlet comes with additional filtering options to narrow down the search and identify issues. Here is the cmdlet's syntax:

```PowerShell
Get-RdsDiagnosticsActivities [-StartTime <datetime>] [-EndTime <datetime>] [-ScenarioType {Connection | Management | Feed}] [-ByUser <string>] [-Outcome {Ongoing | Success | Failure}] [-ActivityId <string>] [-Details]
```

The following table defines each property of the cmdlet's syntax and explains what they do.

|Property|Description|
|---|---|
|StartTime|Defines the start time of the activity querying period. If you don't set an EndTime, all activities until the most recent one will be printed. Setting both StartTime and EndTime will set up a defined interval for the query. Example of valid formats: "01/08/2017 14:50:50.42," "01/08/2017."|
|EndTime|If no StartTime is set, setting an EndTime queries all activities from up to one hour before the specified time. Setting both a StartTime and an EndTime will set up a specific timeframe for the query. Examples for valid formats: "01/08/2017 14:50:50.42," "01/08/2017."|
|ScenarioType|Query activities for a specific scenario only.|
|ByUser|Query activities by a specified user UPN.|
|Outcome|Query actiivities by outcome.|
|ActivitiyId|Query results for a specified Activity ID. To retrieve the ActivityId you want to filter the results with, you must first run Get-RdsDiagnosticsActivities.|
|Details|Outputs a detailed activity view with more information about user operation, including more detailed parameters for the management cmdlet.|