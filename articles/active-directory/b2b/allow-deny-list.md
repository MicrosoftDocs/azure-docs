---

title: Allow or block invites to specific organizations - Azure AD
description: Shows how an administrator can use the Azure portal or PowerShell to set an access or deny list to allow or block B2B users from certain domains.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: conceptual
ms.date: 07/15/2018

ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: sasubram
ms.custom: "it-pro, seo-update-azuread-jan"
ms.collection: M365-identity-device-management
---

# Allow or block invitations to B2B users from specific organizations

You can use an allow list or a deny list to allow or block invitations to B2B users from specific organizations. For example, if you want to block personal email address domains, you can set up a deny list that contains domains like Gmail.com and Outlook.com. Or, if your business has a partnership with other businesses like Contoso.com, Fabrikam.com, and Litware.com, and you want to restrict invitations to only these organizations, you can add Contoso.com, Fabrikam.com, and Litware.com to your allow list.
  
## Important considerations

- You can create either an allow list or a deny list. You can't set up both types of lists. By default, whatever domains are not in the allow list are on the deny list, and vice versa. 
- You can create only one policy per organization. You can update the policy to include more domains, or you can delete the policy to create a new one. 
- The number of domains you can add to an allow list or deny list is limited only by the size of the policy. The maximum size of the entire policy is 25 KB (25,000 characters), which includes the allow list or deny list and any other parameters configured for other features.
- This list works independently from OneDrive for Business and SharePoint Online allow/block lists. If you want to restrict individual file sharing in SharePoint Online, you need to set up an allow or deny list for OneDrive for Business and SharePoint Online. For more information, see [Restricted domains sharing in SharePoint Online and OneDrive for Business](https://support.office.com/article/restricted-domains-sharing-in-sharepoint-online-and-onedrive-for-business-5d7589cd-0997-4a00-a2ba-2320ec49c4e9).
- The list does not apply to external users who have already redeemed the invitation. The list will be enforced after the list is set up. If a user invitation is in a pending state, and you set a policy that blocks their domain, the user's attempt to redeem the invitation will fail.

## Set the allow or deny list policy in the portal

By default, the **Allow invitations to be sent to any domain (most inclusive)** setting is enabled. In this case, you can invite B2B users from any organization.

### Add a deny list

This is the most typical scenario, where your organization wants to work with almost any organization, but wants to prevent users from specific domains to be invited as B2B users.

To add a deny list:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **Azure Active Directory** > **Users** > **User settings**.
3. Under **External users**, select **Manage external collaboration settings**.
4. Under **Collaboration restrictions**, select **Deny invitations to the specified domains**.
5. Under **TARGET DOMAINS**, enter the name of one of the domains that you want to block. For multiple domains, enter each domain on a new line. For example:

   ![Shows the deny option with added domains](./media/allow-deny-list/DenyListSettings.png)
 
6. When you're done, click **Save**.

After you set the policy, if you try to invite a user from a blocked domain, you receive a message saying that the domain of the user is currently blocked by your invitation policy.
 
### Add an allow list

This is a more restrictive configuration, where you can set specific domains in the allow list and restrict invitations to any other organizations or domains that aren't mentioned. 

If you want to use an allow list, make sure that you spend time to fully evaluate what your business needs are. If you make this policy too restrictive, your users may choose to send documents over email, or find other non-IT sanctioned ways of collaborating.


To add an allow list:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Select **Azure Active Directory** > **Users** > **User settings**.
3. Under **External users**, select **Manage external collaboration settings**.
4. Under **Collaboration restrictions**, select **Allow invitations only to the specified domains (most restrictive)**.
5. Under **TARGET DOMAINS**, enter the name of one of the domains that you want to allow. For multiple domains, enter each domain on a new line. For example:

   ![Shows the allow option with added domains](./media/allow-deny-list/AllowListSettings.png)
 
6. When you're done, click **Save**.

After you set the policy, if you try to invite a user from a domain that's not on the allow list, you receive a message saying that the domain of the user is currently blocked by your invitation policy.

### Switch from allow to deny list and vice versa 

If you switch from one policy to the other, this discards the existing policy configuration. Make sure to back up details of your configuration before you perform the switch. 

## Set the allow or deny list policy using PowerShell

### Prerequisite

> [!Note]
> The AzureADPreview Module is not a fully supported module as it is in preview. 

To set the allow or deny list by using PowerShell, you must install the preview version of the Azure Active Directory Module for Windows PowerShell. Specifically, install the AzureADPreview module version 2.0.0.98 or later.

To check the version of the module (and see if it's installed):
 
1. Open Windows PowerShell as an elevated user (Run as Administrator). 
2. Run the following command to see if you have any versions of the Azure Active Directory Module for Windows PowerShell installed on your computer:

   ```powershell  
   Get-Module -ListAvailable AzureAD*
   ```

If the module is not installed, or you don't have a required version, do one of the following:

- If no results are returned, run the following command to install the latest version of the AzureADPreview module:
  
   ```powershell  
   Install-Module AzureADPreview
   ```
- If only the AzureAD module is shown in the results, run the following commands to install the AzureADPreview module: 

   ```powershell 
   Uninstall-Module AzureAD 
   Install-Module AzureADPreview 
   ```
- If only the AzureADPreview module is shown in the results, but the version is less than 2.0.0.98, run the following commands to update it: 

   ```powershell 
   Uninstall-Module AzureADPreview 
   Install-Module AzureADPreview 
   ```

- If both the AzureAD and AzureADPreview modules are shown in the results, but the version of the AzureADPreview module is less than 2.0.0.98, run the following commands to update it: 

   ```powershell 
   Uninstall-Module AzureAD 
   Uninstall-Module AzureADPreview 
   Install-Module AzureADPreview 
    ```

### Use the AzureADPolicy cmdlets to configure the policy

To create an allow or deny list, use the [New-AzureADPolicy](https://docs.microsoft.com/powershell/module/azuread/new-azureadpolicy?view=azureadps-2.0-preview) cmdlet. The following example shows how to set a deny list that blocks the "live.com" domain.

```powershell 
$policyValue = @("{`"B2BManagementPolicy`":{`"InvitationsAllowedAndBlockedDomainsPolicy`":{`"AllowedDomains`": [],`"BlockedDomains`": [`"live.com`"]}}}")

New-AzureADPolicy -Definition $policyValue -DisplayName B2BManagementPolicy -Type B2BManagementPolicy -IsOrganizationDefault $true 
```

The following shows the same example, but with the policy definition inline.

```powershell  
New-AzureADPolicy -Definition @("{`"B2BManagementPolicy`":{`"InvitationsAllowedAndBlockedDomainsPolicy`":{`"AllowedDomains`": [],`"BlockedDomains`": [`"live.com`"]}}}") -DisplayName B2BManagementPolicy -Type B2BManagementPolicy -IsOrganizationDefault $true 
```

To set the allow or deny list policy, use the [Set-AzureADPolicy](https://docs.microsoft.com/powershell/module/azuread/set-azureadpolicy?view=azureadps-2.0-preview) cmdlet. For example:

```powershell   
Set-AzureADPolicy -Definition $policyValue -Id $currentpolicy.Id 
```

To get the policy, use the [Get-AzureADPolicy](https://docs.microsoft.com/powershell/module/azuread/get-azureadpolicy?view=azureadps-2.0-preview) cmdlet. For example:

```powershell
$currentpolicy = Get-AzureADPolicy | ?{$_.Type -eq 'B2BManagementPolicy'} | select -First 1 
```

To remove the policy, use the [Remove-AzureADPolicy](https://docs.microsoft.com/powershell/module/azuread/remove-azureadpolicy?view=azureadps-2.0-preview) cmdlet. For example:

```powershell
Remove-AzureADPolicy -Id $currentpolicy.Id 
```

## Next steps

- For an overview of Azure AD B2B, see [What is Azure AD B2B collaboration?](what-is-b2b.md)
- For information about Conditional Access and B2B collaboration, see [Conditional Access for B2B collaboration users](conditional-access.md).



