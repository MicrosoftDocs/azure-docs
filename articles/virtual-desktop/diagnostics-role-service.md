---
title: Azure Virtual Desktop diagnose issues - Azure
description: How to use the Azure Virtual Desktop diagnostics feature to diagnose issues.
author: Heidilohr
ms.topic: troubleshooting
ms.date: 06/19/2021
ms.author: helohr
manager: femila
---
# Identify and diagnose Azure Virtual Desktop issues

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects. If you're using Azure Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/diagnostics-role-service-2019.md).

Azure Virtual Desktop offers a diagnostics feature that allows the administrator to identify issues through a single interface. To learn more about the diagnostic capabilities of Azure Virtual Desktop, see [Use Log Analytics for the diagnostics feature](diagnostics-log-analytics.md).

Connections that don't reach Azure Virtual Desktop won't show up in diagnostics results because the diagnostics role service itself is part of Azure Virtual Desktop. Azure Virtual Desktop connection issues can happen when the end-user is experiencing network connectivity issues.

## Common error scenarios

The WVDErrors table tracks errors across all activity types. The column called "ServiceError" provides an additional flag marked either "True" or "False." This flag will tell you whether the error is related to the service.

* If the value is "True," the service team may have already investigated this issue. If this impacts user experience and appears a high number of times, we recommend you submit a support ticket for Azure Virtual Desktop.
* If the value is "False," this may be a misconfiguration that you can fix yourself. The error message can give you a clue about where to start.

The following table lists common errors your admins might run into.

>[!NOTE]
>This list includes most common errors and is updated on a regular cadence. To ensure you have the most up-to-date information, be sure to check back on this article at least once a month.

### Connection error codes

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

To learn more about roles within Azure Virtual Desktop, see [Azure Virtual Desktop environment](environment-setup.md).

To see a list of available PowerShell cmdlets for Azure Virtual Desktop, see the [PowerShell reference](/powershell/windows-virtual-desktop/overview).
