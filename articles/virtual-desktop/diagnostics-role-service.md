---
title: The Windows Virtual Desktop diagnostics role service - Azure
description: Describes the Windows Virtual Desktop diagnostics role service and how to use it.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 10/25/2018
ms.author: helohr
---
# The Windows Virtual Desktop diagnostics role service (Preview)

The Windows Virtual Desktop diagnostics role service is a Remote Desktop role that allows the administrator to identify issues through a single interface. The Windows Virtual Desktop roles log a diagnostic activity any time a user interacts with the system. Each log contains relevant information such as the Windows Virtual Desktop roles involved in the transaction, error messages, tenant information, and user information. Diagnostic activities are created by both end user and administrative actions, and can be categorized into three main buckets:

* Feed subscription activities: the end user triggers these activities whenever they try to connect to their feed through Microsoft Remote Desktop applications.
* Connection activities: the end user triggers these activities whenever they try to connect to a desktop or RemoteApp through Microsoft Remote Desktop applications.
* Management activities: the administrator triggers these activities whenever they perform management operations on the system, such as creating host pools, assigning users to app groups, and creating role assignments.
  
Connections that don’t reach Windows Virtual Desktop won't show up in diagnostics results because the diagnostics role service itself is part of Windows Virtual Desktop. Windows Virtual Desktop connection issues can happen when the end user is experiencing network connectivity issues.

## Diagnose issues with PowerShell

Windows Virtual Desktop Diagnostics uses just one PowerShell cmdlet but contains many optional parameters to help narrow down and isolate issues. The following sections list the cmdlets you can run to diagnose issues. Most filters can be applied together. Values listed in brackets, such as `<tenantName>`, should be replaced with the values that apply to your situation.

### Retrieve diagnostic activities in your tenant

You can retrieve diagnostic activites by entering the **Get-RdsDiagnosticsActivities** cmdlet. The following example cmdlet will return a list of diagnostic activities, sorted from most to least recent.

```PowerShell
Get-RdsDiagnosticsActivities -TenantName <tenantName>
```

Like other Windows Virtual Desktop PowerShell cmdlets, you must use the *-TenantName* parameter to specify the name of the tenant you want to use for your query. The tenant name is applicable for almost all diagnostic activity queries.

### Retrieve detailed diagnostic activities

The *-Detailed* parameter provides additional details for each diagnostic activity returned. The format for each activity varies depending on its activity type. The *-Detailed parameter* can be added to any **Get-RdsDiagnosticsActivities** query, as shown in the following example.

```PowerShell
Get-RdsDiagnosticsActivities -TenantName <tenantName> -Detailed
```

### Retrieve a specific diagnostic activity by activity ID

The *-ActivityId* parameter returns a specific diagnostic activity if it exists, as shown int he following example cmdlet.

```PowerShell
Get-RdsDiagnosticActivities -TenantName <tenantName> -ActivityId <ActivityIdGuid>
```

### Filter diagnostic activities by user

The *-UserName* parameter returns a list of diagnostic activities initiated by the specified user, as shown in the following example cmdlet.

```PowerShell
Get-RdsDiagnosticActivities -TenantName <tenantName> -UserName <UserUPN>
```

The *-UserName* parameter can also be combined with other optional filtering parameters.

### Filter diagnostic activities by time

You can filter the returned diagnostic activity list with the *-StartTime* and *-EndTime* parameters. The *-StartTime* parameter will return a diagnostic activity list starting from a specific date, as shown in the following example.

```PowerShell
Get-RdsDiagnosticActivities -TenantName <tenantName> -StartTime “08/01/2018”
```

The *-EndTime* parameter can be added to a cmdlet with the *-StartTime* parameter to specify a specific period of time you want to receive results for. The following example cmdlet will return a list of diagnostic activities from between August 1st and August 10th.

```PowerShell
Get-RdsDiagnosticActivities -TenantName <tenantName> -StartTime “08/01/2018” -EndTime “08/10/2018”
```

The *-StartTime* and *-EndTime* parameters can also be combined with other optional filtering parameters.

### Filter diagnostic activities by activity type

You can also filter diagnostic activities by activity type with the *-ActivityType* parameter. The following cmdlet will return a list of end user connections:

```PowerShell
Get-RdsDiagnosticActivities -TenantName <tenantName> -ActivityType Connection
```

The following cmdlet will return a list of administrator management tasks:

```PowerShell
Get-RdsDiagnosticActivities -TenantName <tenantName> -ActivityType Management
```

The **Get-RdsDiagnosticActivities** cmdlet doesn’t currently support specifying Feed as the ActivityType.

### Filter diagnostic activities by outcome

You can filter the returned diagnostic activity list by outcome with the *-Outcome* parameter. The following example cmdlet will return a list of successful diagnostic activities.

```PowerShell
Get-RdsDiagnosticActivities -TenantName <tenantName> -Outcome Success
```

The following example cmdlet will return a list of failed diagnostic activities.

```PowerShell
Get-RdsDiagnosticActivities -TenantName <tenantName> -Outcome Failure
```

The *-Outcome* parameter can also be combined with other optional filtering parameters.

## Next steps

To learn more about roles within Windows Virtual Desktop, see [Windows Virtual Desktop environment](environment-setup.md).

To see a list of available PowerShell cmdlets for Windows Virtual Desktop, see the [PowerShell cmdlets](powershell-cmdlet-table.md) reference.