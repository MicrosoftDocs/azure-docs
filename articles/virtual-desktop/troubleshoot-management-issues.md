---
title: Azure Virtual Desktop management issues - Azure
description: Common management issues in Azure Virtual Desktop and how to solve them.
author: Heidilohr
ms.topic: troubleshooting
ms.date: 06/19/2021
ms.author: helohr
manager: femila
---
# Management issues

This article describes common management errors and gives suggestions for how to solve them.

## Common management errors

The following table lists error messages that appear due to management-related issues and suggestions for how to solve them.

|Error message|Suggested solution|
|---|---|
|Failed to create registration key |Registration token couldn't be created. Try creating it again with a shorter expiry time (between 1 hour and 1 month). |
|Failed to delete registration key|Registration token couldn't be deleted. Try deleting it again. If it still doesn't work, use PowerShell to check if the token is still there. If it's there, delete it with PowerShell.|
|Failed to change session host drain mode |Couldn't change drain mode on the VM. Check the VM status. If the VM isn't available, you can't change drain mode.|
|Failed to disconnect user sessions |Couldn't disconnect the user from the VM. Check the VM status. If the VM isn't available, you can't disconnect the user session. If the VM is available, check the user session status to see if it's disconnected. |
|Failed to log off all user(s) within the session host |Could not sign users out of the VM. Check the VM status. If unavailable, users can't be signed out. Check user session status to see if they're already signed out. You can force sign out with PowerShell. |
|Failed to unassign user from application group|Could not unpublish an application group for a user. Check to see if user is available on Microsoft Entra ID. Check to see if the user is part of a user group that the application group is published to. |
|There was an error retrieving the available locations |Check location of VM used in the create host pool wizard. If image is not available in that location, add image in that location or choose a different VM location. |

## Error: Can't add user assignments to an application group

After assigning a user to an application group, the Azure portal displays a warning that says "Session Ending" or "Experiencing Authentication Issues - Extension Microsoft_Azure_WVD." The assignment page then doesn't load, and after that, pages stop loading throughout the Azure portal (for example, Azure Monitor, Log Analytics, Service Health, and so on).

This issue usually appears because there's a problem with the conditional access policy. The Azure portal is trying to obtain a token for Microsoft Graph, which is dependent on SharePoint Online. The customer has a conditional access policy called "Microsoft Office 365 Data Storage Terms of Use" that requires users to accept the terms of use to access data storage. However, they haven't signed in yet, so the Azure portal can't get the token.

To solve this issue, before signing in to the Azure portal, the admin first needs to sign in to SharePoint and accept the Terms of Use. After that, they should be able to sign in to the Azure portal like normal.

## Next steps

To review common error scenarios that the diagnostics feature can identify for you, see [Identify and diagnose issues](./troubleshoot-set-up-overview.md).
