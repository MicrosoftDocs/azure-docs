---
title: 'Quickstart: Add a guest user with PowerShell'
description: In this quickstart, you learn how to use PowerShell to send an invitation to an external Azure AD B2B collaboration user. You'll use the Microsoft Graph Identity Sign-ins and the Microsoft Graph Users PowerShell modules.
services: active-directory
ms.author: cmulligan
author: csmulligan
manager: CelesteDG
ms.date: 07/31/2023
ms.topic: quickstart
ms.service: active-directory
ms.subservice: B2B
ms.custom: it-pro, seo-update-azuread-jan, mode-api
ms.collection: engagement-fy23, M365-identity-device-management
#Customer intent: As a tenant admin, I want to walk through the B2B invitation workflow so that I can understand how to add a user through PowerShell.
---

# Quickstart: Add a guest user with PowerShell

There are many ways you can invite external partners to your apps and services with Azure Active Directory B2B collaboration. In the previous quickstart, you saw how to add guest users directly in the Azure portal. You can also use PowerShell to add guest users, either one at a time or in bulk. In this quickstart, you’ll use the New-MgInvitation command to add one guest user to your Azure tenant.

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

### PowerShell Module
Install the [Microsoft Graph Identity Sign-ins module](/powershell/module/microsoft.graph.identity.signins/?view=graph-powershell-beta&preserve-view=true) (Microsoft.Graph.Identity.SignIns) and the [Microsoft Graph Users module](/powershell/module/microsoft.graph.users/?view=graph-powershell-beta&preserve-view=true) (Microsoft.Graph.Users). You can use the `#Requires` statement to prevent running a script unless the required PowerShell modules are met.

```powershell
#Requires -Modules Microsoft.Graph.Identity.SignIns, Microsoft.Graph.Users
```

### Get a test email account

You need a test email account that you can send the invitation to. The account must be from outside your organization. You can use any type of account, including a social account such as a gmail.com or outlook.com address.

## Sign in to your tenant

Run the following command to connect to the tenant domain:

```powershell
Connect-MgGraph -Scopes 'User.ReadWrite.All'
```

When prompted, enter your credentials.

## Send an invitation

1. To send an invitation to your test email account, run the following PowerShell command (replace **"John Doe"** and **john\@contoso.com** with your test email account name and email address):

   ```powershell
   New-MgInvitation -InvitedUserDisplayName "John Doe" -InvitedUserEmailAddress John@contoso.com -InviteRedirectUrl "https://myapplications.microsoft.com" -SendInvitationMessage:$true
   ```
1. The command sends an invitation to the email address specified. Check the output, which should look similar to the following example:

   ![PowerShell output of the invitation command](media/quickstart-invite-powershell/powershell-mginvitation-result.png)

## Verify the user exists in the directory

1. To verify that the invited user was added to Azure AD, run the following command (replace **john\@contoso.com** with your invited email):
 
   ```powershell
   Get-MgUser -Filter "Mail eq 'John@contoso.com'"
   ```
1. Check the output to make sure the user you invited is listed, with a user principal name (UPN) in the format *emailaddress*#EXT#\@*domain*. For example, *john_contoso.com#EXT#\@fabrikam.onmicrosoft.com*, where fabrikam.onmicrosoft.com is the organization from which you sent the invitations.

   ![PowerShell output showing guest user added](media/quickstart-invite-powershell/powershell-mginvitation-guest-user-add.png)

## Clean up resources

When no longer needed, you can delete the test user account in the directory. Run the following command to delete a user account:

```powershell
 Remove-MgUser -UserId '<String>'
```
For example: 
```powershell 
Remove-MgUser -UserId 'john_contoso.com#EXT#@fabrikam.onmicrosoft.com'
``` 
or 
```powershell 
Remove-MgUser -UserId '3f80a75e-750b-49aa-a6b0-d9bf6df7b4c6'
```


## Next steps
In this quickstart, you invited and added a single guest user to your directory using PowerShell. You can also invite a guest user using the [Azure portal](b2b-quickstart-add-guest-users-portal.md). Additionally you can [invite guest users in bulk using PowerShell](tutorial-bulk-invite.md). 

