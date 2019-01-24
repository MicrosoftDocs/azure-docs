---

title: One-time passcode authentication for B2B guest users - Azure Active Directory | Microsoft Docs
description: How to use Email one-time passcode to authenticate B2B guest users without the need for a Microsoft account.

services: active-directory
ms.service: active-directory
ms.component: B2B
ms.topic: conceptual
ms.date: 1/23/2019

ms.author: mimart
author: msmimart
manager: mtillman
ms.reviewer: mal

---

# Email one-time passcode authentication (preview)

|     |
| --- |
| Email one-time passcode is a public preview feature of Azure Active Directory. For more information about previews, see  [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)|
|     |

The Email one-time passcode feature authenticates B2B guest users when they can't be authenticated through other means like Azure AD, a Microsoft account (MSA), or Google federation. With one-time passcode authentication, there's no need to create a Microsoft account. When the guest user redeems an invitation or accesses a shared resource, they can request a temporary code, which is sent to their email address. Then they enter this code to continue signing in.

This feature is currently available for preview (see [Opting in to the preview](#opting-in-to-the-preview) below). After preview, this feature will be turned on by default for all tenants.

> [!NOTE]
> One-time passcode users must sign in using a link that includes the tenant context, for example `https://myapps.microsoft.com/<tenant id>`. Direct links to applications and resources also work as long as they include the tenant context. Guest users are currently unable to sign in using endpoints that have no tenant context. For example, using `https://myapps.microsoft.com`, `https://portal.azure.com`, or the Teams common endpoint will result in an error. 

## User experience for the invited B2B user using a one-time passcode 
With one-time passcode authentication, the guest user can redeem your invitation by clicking a direct link or by using the invitation email. In either case, a message in the browser indicates that a code will be sent to the guest user's email address. The guest user selects **Send code**:
 
   ![Access Panels manage app](media/one-time-passcode/otp-send-code.png)
 
A passcode is sent to the user’s email address. The user retrieves the passcode from the email and enters it in the browser window:
 
   ![Access Panels manage app](media/one-time-passcode/otp-enter-code.png)
 
The guest user is now authenticated, and they can see the shared resource or continue signing in. 

> [!NOTE]
> One-time passcodes are valid for 30 minutes. After 30 minutes, that specific one-time passcode is no longer valid, and the user must request a new one. User sessions expire after 24 hours. After that time, the guest user receives a new passcode when they access the resource. Session expiration provides added security, especially after a guest user no longer needs access.

## When does a guest user get a one-time passcode?

When a guest user redeems an invitation or uses a link to a resource that has been shared with them, they’ll receive a one-time passcode if:
- They do not have an Azure AD account 
- They do not have a Microsoft account 
- The inviting tenant did not set up Google federation for @gmail.com and @googlemail.com users 

At the time of invitation, there's no indication that the user you're inviting will use one-time passcode authentication. But when the guest user signs in, one-time passcode authentication will be the fallback method if no other authentication methods can be used. 

> [!NOTE]
> When a user redeems a one-time passcode and later obtains an MSA, Azure AD account, or other federated account, they'll continue to be authenticated using a one-time passcode. If you want to update their authentication method, you can delete their guest user account and reinvite them.

### Example
Guest user alexdoe@gmail.com is invited to Fabrikam, which does not have Google federation set up. Alex does not have a Microsoft account. He'll receive a one-time passcode for authentication.

## Opting in to the preview 
It might take a few minutes for the opt-in action to take effect. After that, only newly invited users who meet the conditions above will use one-time passcode authentication. Guest users who previously redeemed an invitation will continue to use their same authentication method.

### To opt in using the Azure AD portal
1.	Sign in to the [Azure portal](https://portal.azure.com/) as an Azure AD global administrator.
2.	In the navigation pane, select **Azure Active Directory**.
3.	Under **Manage**, select **Organizational Relationships**.
4.	Select **Settings**.
5.	Under **Enable Email One-Time Passcode for guests (Preview)**, select **Yes**.
 
### To opt in using PowerShell
Install the latest AzureADPreview module if you don’t have it already by running the following command:

````powershell 
Install-module AzureADPreview
````
Run the following command to connect to the tenant domain:

````powershell 
Connect-AzureAD 
````
When prompted for your credentials, sign in with the Global Administrator account.
Depending on whether you currently have B2B policies set up, choose one of the following sets of commands.

#### If B2B policies don't currently exist

````powershell 
// Get current policy
$currentpolicy =  Get-AzureADPolicy | ?{$_.Type -eq 'B2BManagementPolicy' -and $_.IsOrganizationDefault -eq $true} | select -First 1

// Check if policy is null
$currentpolicy -eq $null

// If policy is null then define new policy value with OneTimePasscode
$policyValue=@("{`"B2BManagementPolicy`":{`"PreviewPolicy`":{`"Features`":[`"OneTimePasscode`"]}}}")

// Create new policy
New-AzureADPolicy -Definition $policyValue -DisplayName B2BManagementPolicy -Type B2BManagementPolicy -IsOrganizationDefault $true`
````

#### If B2B policies already exist

````powershell 
// Get current policy
$currentpolicy =  Get-AzureADPolicy | ?{$_.Type -eq 'B2BManagementPolicy' -and $_.IsOrganizationDefault -eq $true} | select -First 1
 
// Check policy is not null
$currentPolicy -ne $null
 
// If policy is not null, then get policy details
$policy = $currentpolicy.Definition | ConvertFrom-Json

// Add preview policy - inline
$features=[PSCustomObject]@{'Features'=@('OneTimePasscode')}; $policy.B2BManagementPolicy | Add-Member 'PreviewPolicy' $features; $policy.B2BManagementPolicy
 
// Finally update the policy
$updatedPolicy = $policy | ConvertTo-Json -Depth 3
Set-AzureADPolicy -Definition $updatedPolicy -Id $currentpolicy.Id

````

## Opting out of the preview after opting in
It may take a few minutes for the opt-out action to take effect. If you turn off the preview, any guest users who have redeemed a one-time passcode will not be able to sign in. You can delete the guest user and reinvite the user to enable them to sign in again.

### To turn off preview using the Azure AD portal
1.	Sign in to the [Azure portal](https://portal.azure.com/) as an Azure AD global administrator.
2.	In the navigation pane, select **Azure Active Directory**.
3.	Under **Manage**, select **Organizational Relationships**.
4.	Select **Settings**.
5.	Under **Enable Email One-Time Passcode for guests (Preview)**, select **No**.

### To turn off preview using PowerShell
Install the latest AzureADPreview module if you don’t have it already by running the following command:

````powershell 
Install-module AzureADPreview
````
Run the following command to connect to the tenant domain:

````powershell 
Connect-AzureAD 
````
When prompted for your credentials, sign in with the Global Administrator account.
Run the following commands:

````powershell 
// Get current policy
$currentpolicy = Get-AzureADPolicy | ?{$_.Type -eq 'B2BManagementPolicy' -and $_.IsOrganizationDefault -eq $true} | select -First 1
 
// Check if policy not null and has OneTimePasscode enabled
($currentPolicy -ne $null) -and ($currentPolicy.Definition -like "*OneTimePasscode*")
 
// If policy is not null and has OneTimePasscode enabled, then get policy details
$policy = $currentpolicy.Definition | ConvertFrom-Json
 
// Remove OneTimePasscode from preview features
$policy.B2BManagementPolicy.PreviewPolicy.Features = $policy.B2BManagementPolicy.PreviewPolicy.Features.Where({$_ -ne "OneTimePasscode"})
 
// Finally update the policy
$updatedPolicy = $policy | ConvertTo-Json -Depth 3
Set-AzureADPolicy -Definition $updatedPolicy -Id $currentpolicy.Id
````

