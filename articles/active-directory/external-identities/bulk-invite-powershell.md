---

title: Tutorial for bulk inviting B2B collaboration users
description: In this tutorial, you learn how to use PowerShell and a CSV file to send bulk invitations to external Azure AD B2B collaboration guest users.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: tutorial
ms.date: 07/31/2023

ms.author: cmulligan
author: csmulligan
manager: CelesteDG
ms.custom: engagement-fy23

# Customer intent: As a tenant administrator, I want to send B2B invitations to multiple external users at the same time so that I can avoid having to send individual invitations to each user.

ms.collection: M365-identity-device-management
---

# Tutorial: Use PowerShell to bulk invite Azure AD B2B collaboration users

If you use Azure Active Directory (Azure AD) B2B collaboration to work with external partners, you can invite multiple guest users to your organization at the same time via the portal or via PowerShell. In this tutorial, you learn how to use PowerShell to send bulk invitations to external users. Specifically, you do the following:

> [!div class="checklist"]
> * Prepare a comma-separated value (.csv) file with the user information
> * Run a PowerShell script to send invitations
> * Verify the users were added to the directory

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 

## Prerequisites

### Install the latest AzureADPreview module

Make sure that you install the latest version of the Azure AD PowerShell for Graph module (AzureADPreview).

First, check which modules you've' installed. Open Windows PowerShell as an elevated user (Run as administrator), and run the following command:

```powershell
Get-Module -ListAvailable AzureAD*
```

Based on the output, do one of the following:

- If no results are returned, run the following command to install the AzureADPreview module:
  
   ```powershell
   Install-Module AzureADPreview
   ```

- If only the AzureAD module shows up in the results, run the following commands to install the AzureADPreview module: 

   ```powershell
   Uninstall-Module AzureAD
   Install-Module AzureADPreview
   ```

- If only the AzureADPreview module shows up in the results, but you receive a message that indicates there's a later version, run the following commands to update the module:

   ```powershell
   Uninstall-Module AzureADPreview
   Install-Module AzureADPreview
   ```

You may receive a prompt that you're installing the module from an untrusted repository. This occurs if you haven't previously set the PSGallery repository as a trusted repository. Press **Y** to install the module.

### Get test email accounts

You need two or more test email accounts that you can send the invitations to. The accounts must be from outside your organization. You can use any type of account, including social accounts such as gmail.com or outlook.com addresses.

## Prepare the CSV file

In Microsoft Excel, create a CSV file with the list of invitee user names and email addresses. Make sure to include the **Name** and **InvitedUserEmailAddress** column headings.

For example, create a worksheet in the following format:

:::image type="content" source="media/tutorial-bulk-invite/AddUsersExcel.PNG" alt-text="Screenshot that shows the csv file columns of Name and InvitedUserEmailAddress.":::

Save the file as **C:\BulkInvite\Invitations.csv**. 

If you don't have Excel, you can create a CSV file in any text editor, such as Notepad. Separate each value with a comma, and each row with a new line. 

## Sign in to your tenant

Run the following command to connect to the tenant domain:

```powershell
Connect-AzureAD -TenantDomain "<Tenant_Domain_Name>"
```

For example, `Connect-AzureAD -TenantDomain "contoso.onmicrosoft.com"`.

When prompted, enter your credentials.

## Send bulk invitations

To send the invitations, run the following PowerShell script (where **c:\bulkinvite\invitations.csv** is the path of the CSV file):

```powershell
$invitations = import-csv c:\bulkinvite\invitations.csv

$messageInfo = New-Object Microsoft.Open.MSGraph.Model.InvitedUserMessageInfo

$messageInfo.customizedMessageBody = "Hello. You are invited to the Contoso organization."

foreach ($email in $invitations)
   {New-AzureADMSInvitation `
      -InvitedUserEmailAddress $email.InvitedUserEmailAddress `
      -InvitedUserDisplayName $email.Name `
      -InviteRedirectUrl https://myapps.microsoft.com `
      -InvitedUserMessageInfo $messageInfo `
      -SendInvitationMessage $true
   }
```

The script sends an invitation to the email addresses in the Invitations.csv file. You should see output similar to the following for each user:

![Screenshot that shows PowerShell output that includes pending user acceptance.](media/tutorial-bulk-invite/B2BBulkImport.png)

## Verify users exist in the directory

To verify that the invited users were added to Azure AD, run the following command:

```powershell
 Get-AzureADUser -Filter "UserType eq 'Guest'"
```

You should see the users that you invited listed, with a user principal name (UPN) in the format *emailaddress*#EXT#\@*domain*. For example, *msullivan_fabrikam.com#EXT#\@contoso.onmicrosoft.com*, where contoso.onmicrosoft.com is the organization from which you sent the invitations.

## Clean up resources

When no longer needed, you can delete the test user accounts in the directory. Run the following command to delete a user account:

```powershell
 Remove-AzureADUser -ObjectId "<UPN>"
```

For example: `Remove-AzureADUser -ObjectId "msullivan_fabrikam.com#EXT#@contoso.onmicrosoft.com"`

## Next steps

In this tutorial, you sent bulk invitations to guest users outside of your organization. Next, learn how to bulk invite guest users on the portal and how to enforce MFA for them.

- [Bulk invite guest users via the portal](tutorial-bulk-invite.md)
- [Enforce multi-factor authentication for B2B guest users](b2b-tutorial-require-mfa.md)
