---
title: Windows Virtual Desktop diagnose issues - Azure
description: How to use the Windows Virtual Desktop diagnostics feature to diagnose issues.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 05/13/2020
ms.author: helohr
manager: lizross
---
# Identify and diagnose issues

>[!IMPORTANT]
>This content applies to the Fall 2019 release that doesn't support Azure Resource Manager Windows Virtual Desktop objects. If you're trying to manage Azure Resource Manager Windows Virtual Desktop objects introduced in the Spring 2020 update, see [this article](../diagnostics-role-service.md).

Windows Virtual Desktop offers a diagnostics feature that allows the administrator to identify issues through a single interface. The Windows Virtual Desktop roles log a diagnostic activity whenever a user interacts with the system. Each log contains relevant information such as the Windows Virtual Desktop roles involved in the transaction, error messages, tenant information, and user information. Diagnostic activities are created by both end-user and administrative actions, and can be categorized into three main buckets:

* Feed subscription activities: the end-user triggers these activities whenever they try to connect to their feed through Microsoft Remote Desktop applications.
* Connection activities: the end-user triggers these activities whenever they try to connect to a desktop or RemoteApp through Microsoft Remote Desktop applications.
* Management activities: the administrator triggers these activities whenever they perform management operations on the system, such as creating host pools, assigning users to app groups, and creating role assignments.
  
Connections that don't reach Windows Virtual Desktop won't show up in diagnostics results because the diagnostics role service itself is part of Windows Virtual Desktop. Windows Virtual Desktop connection issues can happen when the end-user is experiencing network connectivity issues.

To get started, [download and import the Windows Virtual Desktop PowerShell module](/powershell/windows-virtual-desktop/overview/) to use in your PowerShell session if you haven't already. After that, run the following cmdlet to sign in to your account:

```powershell
Add-RdsAccount -DeploymentUrl "https://rdbroker.wvd.microsoft.com"
```

## Diagnose issues with PowerShell

Windows Virtual Desktop Diagnostics uses just one PowerShell cmdlet but contains many optional parameters to help narrow down and isolate issues. The following sections list the cmdlets you can run to diagnose issues. Most filters can be applied together. Values listed in brackets, such as `<tenantName>`, should be replaced with the values that apply to your situation.

>[!IMPORTANT]
>The diagnostics feature is for single-user troubleshooting. All queries using PowerShell must include either the *-UserName* or *-ActivityID* parameters. For monitoring capabilities, use Log Analytics. See [Use Log Analytics for the diagnostics feature](diagnostics-log-analytics-2019.md) for more information about how to send diagnostics data to your workspace. 

### Filter diagnostic activities by user

The **-UserName** parameter returns a list of diagnostic activities initiated by the specified user, as shown in the following example cmdlet.

```powershell
Get-RdsDiagnosticActivities -TenantName <tenantName> -UserName <UserUPN>
```

The **-UserName** parameter can also be combined with other optional filtering parameters.

### Filter diagnostic activities by time

You can filter the returned diagnostic activity list with the **-StartTime** and **-EndTime** parameters. The **-StartTime** parameter will return a diagnostic activity list starting from a specific date, as shown in the following example.

```powershell
Get-RdsDiagnosticActivities -TenantName <tenantName> -UserName <UserUPN> -StartTime "08/01/2018"
```

The **-EndTime** parameter can be added to a cmdlet with the **-StartTime** parameter to specify a specific period of time you want to receive results for. The following example cmdlet will return a list of diagnostic activities from between August 1 and August 10.

```powershell
Get-RdsDiagnosticActivities -TenantName <tenantName> -UserName <UserUPN> -StartTime "08/01/2018" -EndTime "08/10/2018"
```

The **-StartTime** and **-EndTime** parameters can also be combined with other optional filtering parameters.

### Filter diagnostic activities by activity type

You can also filter diagnostic activities by activity type with the **-ActivityType** parameter. The following cmdlet will return a list of end-user connections:

```powershell
Get-RdsDiagnosticActivities -TenantName <tenantName> -UserName <UserUPN> -ActivityType Connection
```

The following cmdlet will return a list of administrator management tasks:

```powershell
Get-RdsDiagnosticActivities -TenantName <tenantName> -ActivityType Management
```

The **Get-RdsDiagnosticActivities** cmdlet doesn't currently support specifying Feed as the ActivityType.

### Filter diagnostic activities by outcome

You can filter the returned diagnostic activity list by outcome with the **-Outcome** parameter. The following example cmdlet will return a list of successful diagnostic activities.

```powershell
Get-RdsDiagnosticActivities -TenantName <tenantName> -UserName <UserUPN> -Outcome Success
```

The following example cmdlet will return a list of failed diagnostic activities.

```powershell
Get-RdsDiagnosticActivities -TenantName <tenantName> -Outcome Failure
```

The **-Outcome** parameter can also be combined with other optional filtering parameters.

### Retrieve a specific diagnostic activity by activity ID

The **-ActivityId** parameter returns a specific diagnostic activity if it exists, as shown in the following example cmdlet.

```powershell
Get-RdsDiagnosticActivities -TenantName <tenantName> -ActivityId <ActivityIdGuid>
```

### View error messages for a failed activity by activity ID

To view the error messages for a failed activity, you must run the cmdlet with the **-Detailed** parameter. You can view the list of errors by running the **Select-Object** cmdlet.

```powershell
Get-RdsDiagnosticActivities -TenantName <tenantname> -ActivityId <ActivityGuid> -Detailed | Select-Object -ExpandProperty Errors
```

### Retrieve detailed diagnostic activities

The **-Detailed** parameter provides additional details for each diagnostic activity returned. The format for each activity varies depending on its activity type. The **-Detailed** parameter can be added to any **Get-RdsDiagnosticActivities** query, as shown in the following example.

```powershell
Get-RdsDiagnosticActivities -TenantName <tenantName> -ActivityId <ActivityGuid> -Detailed
```

## Common error scenarios

Error scenarios are categorized in internal to the service and external to Windows Virtual Desktop.

* Internal Issue: specifies scenarios that can't be mitigated by the tenant administrator and need to be resolved as a support issue. When providing feedback through the [Windows Virtual Desktop Tech Community](https://techcommunity.microsoft.com/t5/Windows-Virtual-Desktop/bd-p/WindowsVirtualDesktop), include the activity ID and approximate time frame of when the issue occurred.
* External Issue: relate to scenarios which can be mitigated by the system administrator. These are external to Windows Virtual Desktop.

The following table lists common errors your admins might run into.

>[!NOTE]
>This list includes most common errors and is updated on a regular cadence. To ensure you have the most up-to-date information, be sure to check back on this article at least once a month.

### External management error codes

|Numeric code|Error code|Suggested solution|
|---|---|---|
|1322|ConnectionFailedNoMappingOfSIDinAD|The user isn't a member of Azure Active Directory. Follow the instructions in [Active Directory Administrative Center](/windows-server/identity/ad-ds/get-started/adac/active-directory-administrative-center) to add them.|
|3|UnauthorizedAccess|The user who tried to run the administrative PowerShell cmdlet either doesn't have permissions to do so or mistyped their username.|
|1000|TenantNotFound|The tenant name you entered doesn't match any existing tenants. Review the tenant name for typos and try again.|
|1006|TenantCannotBeRemovedHasSessionHostPools|You can't delete a tenant as long it contains objects. Delete the session host pools first, then try again.|
|2000|HostPoolNotFound|The host pool name you entered doesn't match any existing host pools. Review the host pool name for typos and try again.|
|2005|HostPoolCannotBeRemovedHasApplicationGroups|You can't delete a host pool as long as it contains objects. Remove all app groups in the host pool first.|
|2004|HostPoolCannotBeRemovedHasSessionHosts|Remove all sessions hosts first before deleting the session host pool.|
|5001|SessionHostNotFound|The session host you queried might be offline. Check the host pool's status.|
|5008|SessionHostUserSessionsExist |You must sign out all users on the session host before executing your intended management activity.|
|6000|AppGroupNotFound|The app group name you entered doesn't match any existing app groups. Review the app group name for typos and try again.|
|6022|RemoteAppNotFound|The RemoteApp name you entered doesn't match any RemoteApps. Review RemoteApp name for typos and try again.|
|6010|PublishedItemsExist|The name of the resource you're trying to publish is the same as a resource that already exists. Change the resource name and try again.|
|7002|NameNotValidWhiteSpace|Don't use white space in the name.|
|8000|InvalidAuthorizationRoleScope|The role name you entered doesn't match any existing role names. Review the role name for typos and try again. |
|8001|UserNotFound |The user name you entered doesn't match any existing user names. Review the name for typos and try again.|
|8005|UserNotFoundInAAD |The user name you entered doesn't match any existing user names. Review the name for typos and try again.|
|8008|TenantConsentRequired|Follow the instructions [here](tenant-setup-azure-active-directory.md#grant-permissions-to-windows-virtual-desktop) to provide consent for your tenant.|

### External connection error codes

|Numeric code|Error code|Suggested solution|
|---|---|---|
|-2147467259|ConnectionFailedAdErrorNoSuchMember|The user isn't a member of Active Directory. Follow the instructions in [Active Directory Administrative Center](/windows-server/identity/ad-ds/get-started/adac/active-directory-administrative-center) to add them.|
|-2147467259|ConnectionFailedAdTrustedRelationshipFailure|The session host is not correctly joined to the Active Directory.|
|-2146233088|ConnectionFailedUserHasValidSessionButRdshIsUnhealthy|The connections failed because the session host is unavailable. Check the session host's health.|
|-2146233088|ConnectionFailedClientDisconnect|If you see this error frequently, make sure the user's computer is connected to the network.|
|-2146233088|ConnectionFailedNoHealthyRdshAvailable|The session the host user tried to connect to isn't healthy. Debug the virtual machine.|
|-2146233088|ConnectionFailedUserNotAuthorized|The user doesn't have permission to access the published app or desktop. The error might appear after the admin removed published resources. Ask the user to refresh the feed in the Remote Desktop application.|
|2|FileNotFound|The application the user tried to access is either incorrectly installed or set to an incorrect path.|
|3|InvalidCredentials|The username or password the user entered doesn't match any existing usernames or passwords. Review the credentials for typos and try again.|
|8|ConnectionBroken|The connection between Client and Gateway or Server dropped. No action needed unless it happens unexpectedly.|
|14|UnexpectedNetworkDisconnect|The connection to the network dropped. Ask the user to connect again.|
|24|ReverseConnectFailed|The host virtual machine has no direct line of sight to RD Gateway. Ensure the Gateway IP address can be resolved.|
|1322|ConnectionFailedNoMappingOfSIDinAD|The user isn't a member of Active Directory. Follow the instructions in [Active Directory Administrative Center](/windows-server/identity/ad-ds/get-started/adac/active-directory-administrative-center) to add them.|

## Next steps

To learn more about roles within Windows Virtual Desktop, see [Windows Virtual Desktop environment](environment-setup-2019.md).

To see a list of available PowerShell cmdlets for Windows Virtual Desktop, see the [PowerShell reference](/powershell/windows-virtual-desktop/overview).
