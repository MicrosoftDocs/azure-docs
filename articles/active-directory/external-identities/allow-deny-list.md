---

title: Allow or block invites to specific organizations
description: Shows how an administrator can use the Microsoft Entra admin center or PowerShell to set an access or blocklist to allow or block B2B users from certain domains.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: how-to
ms.date: 08/04/2023

ms.author: mimart
author: msmimart
manager: celestedg
ms.custom: "it-pro, seo-update-azuread-jan"
ms.collection: M365-identity-device-management
---

# Allow or block invitations to B2B users from specific organizations

You can use an allowlist or a blocklist to allow or block invitations to B2B collaboration users from specific organizations. For example, if you want to block personal email address domains, you can set up a blocklist that contains domains like Gmail.com and Outlook.com. Or, if your business has a partnership with other businesses like Contoso.com, Fabrikam.com, and Litware.com, and you want to restrict invitations to only these organizations, you can add Contoso.com, Fabrikam.com, and Litware.com to your allowlist. 

This article discusses two ways to configure an allow or blocklist for B2B collaboration:

- In the portal by configuring collaboration restrictions in your organization's [External collaboration settings](external-collaboration-settings-configure.md)
- Through PowerShell
  
## Important considerations

- You can create either an allowlist or a blocklist. You can't set up both types of lists. By default, whatever domains aren't in the allowlist are on the blocklist, and vice versa. 
- You can create only one policy per organization. You can update the policy to include more domains, or you can delete the policy to create a new one. 
- The number of domains you can add to an allowlist or blocklist is limited only by the size of the policy. This limit applies to the number of characters, so you can have a greater number of shorter domains or fewer longer domains. The maximum size of the entire policy is 25 KB (25,000 characters), which includes the allowlist or blocklist and any other parameters configured for other features.
- This list works independently from OneDrive for Business and SharePoint Online allow/block lists. If you want to restrict individual file sharing in SharePoint Online, you need to set up an allow or blocklist for OneDrive for Business and SharePoint Online. For more information, see [Restricted domains sharing in SharePoint Online and OneDrive for Business](https://support.office.com/article/restricted-domains-sharing-in-sharepoint-online-and-onedrive-for-business-5d7589cd-0997-4a00-a2ba-2320ec49c4e9).
- The list doesn't apply to external users who have already redeemed the invitation. The list will be enforced after the list is set up. If a user invitation is in a pending state, and you set a policy that blocks their domain, the user's attempt to redeem the invitation will fail.
- Both allow/block list and cross-tenant access settings are checked at the time of invitation.

## Set the allow or blocklist policy in the portal

By default, the **Allow invitations to be sent to any domain (most inclusive)** setting is enabled. In this case, you can invite B2B users from any organization.

### Add a blocklist

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

This is the most typical scenario, where your organization wants to work with almost any organization, but wants to prevent users from specific domains to be invited as B2B users.

To add a blocklist:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [User administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **Users** > **User settings**.
3. Under **External users**, select **Manage external collaboration settings**.
4. Under **Collaboration restrictions**, select **Deny invitations to the specified domains**.
5. Under **Target domains**, enter the name of one of the domains that you want to block. For multiple domains, enter each domain on a new line. For example:

    :::image type="content" source="media/allow-deny-list/DenyListSettings.PNG" alt-text="Screenshot showing the deny option with added domains.":::
 
6. When you're done, select **Save**.

After you set the policy, if you try to invite a user from a blocked domain, you receive a message saying that the domain of the user is currently blocked by your invitation policy.
 
### Add an allowlist

This is a more restrictive configuration, where you can set specific domains in the allowlist and restrict invitations to any other organizations or domains that aren't mentioned.

If you want to use an allowlist, make sure that you spend time to fully evaluate what your business needs are. If you make this policy too restrictive, your users may choose to send documents over email, or find other non-IT sanctioned ways of collaborating.


To add an allowlist:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [User administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **Users** > **User settings**.
3. Under **External users**, select **Manage external collaboration settings**.
4. Under **Collaboration restrictions**, select **Allow invitations only to the specified domains (most restrictive)**.
5. Under **Target domains**, enter the name of one of the domains that you want to allow. For multiple domains, enter each domain on a new line. For example:

    :::image type="content" source="media/allow-deny-list/AllowlistSettings.PNG" alt-text="Screenshot showing the allow option with added domains.":::
 
6. When you're done, select **Save**.

After you set the policy, if you try to invite a user from a domain that's not on the allowlist, you receive a message saying that the domain of the user is currently blocked by your invitation policy.

### Switch from allowlist to blocklist and vice versa 

If you switch from one policy to the other, this discards the existing policy configuration. Make sure to back up details of your configuration before you perform the switch. 

## Set the allow or blocklist policy using PowerShell

### Prerequisite

> [!Note]
> The AzureADPreview Module is not a fully supported module as it is in preview. 

To set the allow or blocklist by using PowerShell, you must install the preview version of the Azure AD PowerShell module. Specifically, install the AzureADPreview module version 2.0.0.98 or later.

To check the version of the module (and see if it's installed):
 
1. Open Windows PowerShell as an elevated user (Run as Administrator). 
2. Run the following command to see if you have any versions of the Azure AD PowerShell module installed on your computer:

   ```powershell  
   Get-Module -ListAvailable AzureAD*
   ```

If the module is not installed, or you don't have a required version, do one of the following:

- If no results are returned, run the following command to install the latest version of the `AzureADPreview` module:
  
   ```powershell
   Install-Module AzureADPreview
   ```
- If only the `AzureAD` module is shown in the results, run the following commands to install the `AzureADPreview` module:

   ```powershell
   Uninstall-Module AzureAD
   Install-Module AzureADPreview
   ```
- If only the `AzureADPreview` module is shown in the results, but the version is less than `2.0.0.98`, run the following commands to update it: 

   ```powershell 
   Uninstall-Module AzureADPreview 
   Install-Module AzureADPreview 
   ```

- If both the `AzureAD` and `AzureADPreview` modules are shown in the results, but the version of the `AzureADPreview` module is less than `2.0.0.98`, run the following commands to update it: 

   ```powershell 
   Uninstall-Module AzureAD 
   Uninstall-Module AzureADPreview 
   Install-Module AzureADPreview 
    ```

### Use the AzureADPolicy cmdlets to configure the policy

To create an allow or blocklist, use the [New-AzureADPolicy](/powershell/module/azuread/new-azureadpolicy?view=azureadps-2.0-preview&preserve-view=true) cmdlet. The following example shows how to set a blocklist that blocks the "live.com" domain.

```powershell 
$policyValue = @("{`"B2BManagementPolicy`":{`"InvitationsAllowedAndBlockedDomainsPolicy`":{`"AllowedDomains`": [],`"BlockedDomains`": [`"live.com`"]}}}")

New-AzureADPolicy -Definition $policyValue -DisplayName B2BManagementPolicy -Type B2BManagementPolicy -IsOrganizationDefault $true 
```

The following shows the same example, but with the policy definition inline.

```powershell
New-AzureADPolicy -Definition @("{`"B2BManagementPolicy`":{`"InvitationsAllowedAndBlockedDomainsPolicy`":{`"AllowedDomains`": [],`"BlockedDomains`": [`"live.com`"]}}}") -DisplayName B2BManagementPolicy -Type B2BManagementPolicy -IsOrganizationDefault $true 
```

To set the allow or blocklist policy, use the [Set-AzureADPolicy](/powershell/module/azuread/set-azureadpolicy?view=azureadps-2.0-preview&preserve-view=true) cmdlet. For example:

```powershell
Set-AzureADPolicy -Definition $policyValue -Id $currentpolicy.Id 
```

To get the policy, use the [Get-AzureADPolicy](/powershell/module/azuread/get-azureadpolicy?view=azureadps-2.0-preview&preserve-view=true) cmdlet. For example:

```powershell
$currentpolicy = Get-AzureADPolicy -All $true | ?{$_.Type -eq 'B2BManagementPolicy'} | select -First 1 
```

To remove the policy, use the [Remove-AzureADPolicy](/powershell/module/azuread/remove-azureadpolicy?view=azureadps-2.0-preview&preserve-view=true) cmdlet. For example:

```powershell
Remove-AzureADPolicy -Id $currentpolicy.Id 
```

## Next steps

- [Cross-tenant access settings](cross-tenant-access-settings-b2b-collaboration.md)
- [External collaboration settings](external-collaboration-settings-configure.md).
