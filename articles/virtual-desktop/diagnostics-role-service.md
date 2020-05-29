---
title: Windows Virtual Desktop diagnose issues - Azure
description: How to use the Windows Virtual Desktop diagnostics feature to diagnose issues.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 04/30/2020
ms.author: helohr
manager: lizross
---
# Identify and diagnose issues

>[!IMPORTANT]
>This content applies to the Spring 2020 update with Azure Resource Manager Windows Virtual Desktop objects. If you're using the Windows Virtual Desktop Fall 2019 release without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/diagnostics-role-service-2019.md).
>
> The Windows Virtual Desktop Spring 2020 update is currently in public preview. This preview version is provided without a service level agreement, and we don't recommend using it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Windows Virtual Desktop offers a diagnostics feature that allows the administrator to identify issues through a single interface. To learn more about the diagnostic capabilities of Windows Virtual Desktop, see [Use Log Analytics for the diagnostics feature](diagnostics-log-analytics.md).
  
Connections that don't reach Windows Virtual Desktop won't show up in diagnostics results because the diagnostics role service itself is part of Windows Virtual Desktop. Windows Virtual Desktop connection issues can happen when the end-user is experiencing network connectivity issues.

## Common error scenarios

Error scenarios are categorized in internal to the service and external to Windows Virtual Desktop.

* Internal Issue: specifies scenarios that can't be mitigated by the customer and need to be resolved as a support issue. When providing feedback through the [Windows Virtual Desktop Tech Community](https://techcommunity.microsoft.com/t5/Windows-Virtual-Desktop/bd-p/WindowsVirtualDesktop), include the correlation ID and approximate time frame of when the issue occurred.
* External Issue: relate to scenarios that can be mitigated by the customer. These are external to Windows Virtual Desktop.

The following table lists common errors your admins might run into.

>[!NOTE]
>This list includes most common errors and is updated on a regular cadence. To ensure you have the most up-to-date information, be sure to check back on this article at least once a month.

## Management errors

|Error message|Suggested solution|
|---|---|
|Failed to create registration key |Registration token couldn't be created. Try creating it again with a shorter expiry time (between 1 hour and 1 month). |
|Failed to delete registration key|Registration token couldn't be deleted. Try deleting it again. If it still doesn't work, use PowerShell to check if the token is still there. If it's there, delete it with PowerShell.|
|Failed to change session host drain mode |Couldn't change drain mode on the VM. Check the VM status. If the VM's unavailable, drain mode can't be changed.|
|Failed to disconnect user sessions |Couldn't disconnect the user from the VM. Check the VM status. If the VM's unavailable, the user session can't be disconnected. If the VM is available, check the user session status to see if it's disconnected. |
|Failed to log off all user(s) within the session host |Could not sign users out of the VM. Check the VM status. If unavailable, users can't be signed out. Check user session status to see if they're already signed out. You can force sign out with PowerShell. |
|Failed to unassign user from application group|Could not unpublish an app group for a user. Check to see if user is available on Azure AD. Check to see if the user is part of a user group that the app group is published to. |
|There was an error retrieving the available locations |Check location of VM used in the create host pool wizard. If image is not available in that location, add image in that location or choose a different VM location. |

### External connection error codes

|Numeric code|Error code|Suggested solution|
|---|---|---|
|-2147467259|ConnectionFailedAdTrustedRelationshipFailure|The session host is not correctly joined to the Active Directory.|
|-2146233088|ConnectionFailedUserHasValidSessionButRdshIsUnhealthy|The connections failed because the session host is unavailable. Check the session host's health.|
|-2146233088|ConnectionFailedClientDisconnect|If you see this error frequently, make sure the user's computer is connected to the network.|
|-2146233088|ConnectionFailedNoHealthyRdshAvailable|The session the host user tried to connect to isn't healthy. Debug the virtual machine.|
|-2146233088|ConnectionFailedUserNotAuthorized|The user doesn't have permission to access the published app or desktop. The error might appear after the admin removed published resources. Ask the user to refresh the feed in the Remote Desktop application.|
|2|FileNotFound|The application the user tried to access is either incorrectly installed or set to an incorrect path.<br><br>When publishing new apps while the user has an active session, the user won’t be able to access this app. The session must be shut down and restarted before the user can access the app. |
|3|InvalidCredentials|The username or password the user entered doesn't match any existing usernames or passwords. Review the credentials for typos and try again.|
|8|ConnectionBroken|The connection between Client and Gateway or Server dropped. No action needed unless it happens unexpectedly.|
|14|UnexpectedNetworkDisconnect|The connection to the network dropped. Ask the user to connect again.|
|24|ReverseConnectFailed|The host virtual machine has no direct line of sight to RD Gateway. Ensure the Gateway IP address can be resolved.|

## Next steps

To learn more about roles within Windows Virtual Desktop, see [Windows Virtual Desktop environment](environment-setup.md).

To see a list of available PowerShell cmdlets for Windows Virtual Desktop, see the [PowerShell reference](/powershell/windows-virtual-desktop/overview).
