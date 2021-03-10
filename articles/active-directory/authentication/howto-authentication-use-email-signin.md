---
title: Sign in with email as an alternate login ID for Azure Active Directory
description: Learn how to configure and enable users to sign in to Azure Active Directory using their email address as an alternate login ID (preview)

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 10/01/2020

ms.author: justinha
author: justinha
manager: daveba
ms.reviewer: calui

---
# Sign-in to Azure Active Directory using email as an alternate login ID (preview)

> [!NOTE]
> Sign in to Azure AD with email as an alternate login ID is a public preview feature of Azure Active Directory. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Many organizations want to let users sign in to Azure Active Directory (Azure AD) using the same credentials as their on-premises directory environment. With this approach, known as hybrid authentication, users only need to remember one set of credentials.

Some organizations haven't moved to hybrid authentication for the following reasons:

* By default, the Azure AD user principal name (UPN) is set to the same UPN as the on-premises directory.
* Changing the Azure AD UPN creates a mis-match between on-prem and Azure AD environments that could cause problems with certain applications and services.
* Due to business or compliance reasons, the organization doesn't want to use the on-premises UPN to sign in to Azure AD.

To help with the move to hybrid authentication, you can now configure Azure AD to let users sign in with an email in your verified domain as an alternate login ID. For example, if *Contoso* rebranded to *Fabrikam*, rather than continuing to sign in with the legacy `balas@contoso.com` UPN, email as an alternate login ID can now be used. To access an application or services, users would sign in to Azure AD using their assigned email, such as `balas@fabrikam.com`.

This article shows you how to enable and use email as an alternate login ID. This feature is available in the Azure AD Free edition and higher.

> [!NOTE]
> This feature is for cloud-authenticated Azure AD users only.

> [!NOTE]
> Currently, this feature is not supported on Azure AD joined Windows 10 devices for tenants with cloud authentication. This feature is not applicable to Hybrid Azure AD joined devices.

## Overview of Azure AD sign-in approaches

To sign in to Azure AD, users enter a name that uniquely identifies their account. Historically, you could only use the Azure AD UPN as the sign-in name.

For organizations where the on-premises UPN is the user's preferred sign-in email, this approach was great. Those organizations would set the Azure AD UPN to the exact same value as the on-premises UPN, and users would have a consistent sign-in experience.

However, in some organizations the on-premises UPN isn't used as a sign-in name. In the on-premises environments, you would configure the local AD DS to allow sign in with an alternate login ID. Setting the Azure AD UPN to the same value as the on-premises UPN isn't an option as Azure AD would then require users sign in with that value.

The typical workaround to this issue was to set the Azure AD UPN to the email address the user expects to sign in with. This approach works, though results in different UPNs between the on-premises AD and in Azure AD, and this configuration isn't compatible with all Microsoft 365 workloads.

A different approach is to synchronize the Azure AD and on-premises UPNs to the same value and then configure Azure AD to allow users to sign in to Azure AD with a verified email. To provide this ability, you define one or more email addresses in the user's *ProxyAddresses* attribute in the on-premises directory. *ProxyAddresses* are then synchronized to Azure AD automatically using Azure AD Connect.

## Preview limitations

Sign in to Azure AD with email as an alternate login ID is available in the Azure AD Free edition and higher.

In the current preview state, the following limitations apply when a user signs in with a non-UPN email as an alternate login ID:

* Users may see their UPN, even when the signed in with their non-UPN email. The following example behavior may be seen:
    * User is prompted to sign in with UPN when directed to Azure AD sign-in with `login_hint=<non-UPN email>`.
    * When a user signs in with a non-UPN email and enters an incorrect password, the *"Enter your password"* page changes to display the UPN.
    * On some Microsoft sites and apps, such as [https://portal.azure.com](https://portal.azure.com) and Microsoft Office, the **Account Manager** control typically displayed in the upper right may display the user's UPN instead of the non-UPN email used to sign in.

* Some flows are currently not compatible with the non-UPN email, such as the following:
    * Identity protection currently doesn't match email alternate login IDs with *Leaked Credentials* risk detection. This risk detection uses the UPN to match credentials that have been leaked. For more information, see [Azure AD Identity Protection risk detection and remediation][identity-protection].
    * B2B invites sent to an alternate login ID email aren't fully supported. After accepting an invite sent to an email as an alternate login ID, sign in with the alternate email may not work for the user on the tenanted endpoint.

## Synchronize sign-in email addresses to Azure AD

Traditional Active Directory Domain Services (AD DS) or Active Directory Federation Services (AD FS) authentication happens directly on your network and is handled by your AD DS infrastructure. With hybrid authentication, users can instead sign in directly to Azure AD.

To support this hybrid authentication approach, you synchronize your on-premises AD DS environment to Azure AD using [Azure AD Connect][azure-ad-connect] and configure it to use Password Hash Sync (PHS) or Pass-Through Authentication (PTA).

In both configuration options, the user submits their username and password to Azure AD, which validates the credentials and issues a ticket. When users sign in to Azure AD, it removes the need for your organization to host and manage an AD FS infrastructure.

![Diagram of Azure AD hybrid identity with password hash synchronization](media/howto-authentication-use-email-signin/hybrid-password-hash-sync.png)

![Diagram of Azure AD hybrid identity with pass-through authentication](media/howto-authentication-use-email-signin/hybrid-pass-through-authentication.png)

One of the user attributes that's automatically synchronized by Azure AD Connect is *ProxyAddresses*. If users have an email address defined in the on-prem AD DS environment as part of the *ProxyAddresses* attribute, it's automatically synchronized to Azure AD. This email address can then be used directly in the Azure AD sign-in process as an alternate login ID.

> [!IMPORTANT]
> Only emails in verified domains for the tenant are synchronized to Azure AD. Each Azure AD tenant has one or more verified domains, for which you have proven ownership, and are uniquely bound to you tenant.
>
> For more information, see [Add and verify a custom domain name in Azure AD][verify-domain].

For more information, see [Choose the right authentication method for your Azure AD hybrid identity solution][hybrid-auth-methods].

## Enable user sign-in with an email address

Once users with the *ProxyAddresses* attribute applied are synchronized to Azure AD using Azure AD Connect, you need to enable the feature for users to sign in with email as an alternate login ID for your tenant. This feature tells the Azure AD login servers to not only check the sign-in name against UPN values, but also against *ProxyAddresses* values for the email address.

During preview, you can currently only enable the sign-in with email as an alternate login ID feature using PowerShell. You need *tenant administrator* permissions to complete the following steps:

1. Open an PowerShell session as an administrator, then install the *AzureADPreview* module using the [Install-Module][Install-Module] cmdlet:

    ```powershell
    Install-Module AzureADPreview
    ```

    If prompted, select **Y** to install NuGet or to install from an untrusted repository.

1. Sign in to your Azure AD tenant as a *tenant administrator* using the [Connect-AzureAD][Connect-AzureAD] cmdlet:

    ```powershell
    Connect-AzureAD
    ```

    The command returns information about your account, environment, and tenant ID.

1. Check if the *HomeRealmDiscoveryPolicy* policy already exists in your tenant using the [Get-AzureADPolicy][Get-AzureADPolicy] cmdlet as follows:

    ```powershell
    Get-AzureADPolicy | Where-Object Type -eq "HomeRealmDiscoveryPolicy" | Format-List *
    ```

1. If there's no policy currently configured, the command returns nothing. If a policy is returned, skip this step and move on to the next step to update an existing policy.

    To add the *HomeRealmDiscoveryPolicy* policy to the tenant, use the [New-AzureADPolicy][New-AzureADPolicy] cmdlet and set the *AlternateIdLogin* attribute to *"Enabled": true* as shown in the following example:

    ```powershell
    $AzureADPolicyDefinition = @(
      @{
         "HomeRealmDiscoveryPolicy" = @{
            "AlternateIdLogin" = @{
               "Enabled" = $true
            }
         }
      } | ConvertTo-JSON -Compress
    )
    $AzureADPolicyParameters = @{
      Definition            = $AzureADPolicyDefinition
      DisplayName           = "BasicAutoAccelerationPolicy"
      IsOrganizationDefault = $true
      Type                  = "HomeRealmDiscoveryPolicy"
    }
    New-AzureADPolicy @AzureADPolicyParameters
    ```

    When the policy has been successfully created, the command returns the policy ID, as shown in the following example output:

    ```powershell
    Id                                   DisplayName                 Type                     IsOrganizationDefault
    --                                   -----------                 ----                     ---------------------
    5de3afbe-4b7a-4b33-86b0-7bbe308db7f7 BasicAutoAccelerationPolicy HomeRealmDiscoveryPolicy True
    ```

1. If there's already a configured policy, check if the *AlternateIdLogin* attribute is enabled, as shown in the following example policy output:

    ```powershell
    Id : 5de3afbe-4b7a-4b33-86b0-7bbe308db7f7
    OdataType :
    AlternativeIdentifier :
    Definition : {{"HomeRealmDiscoveryPolicy" :{"AlternateIdLogin":{"Enabled": true}}}}
    DisplayName : BasicAutoAccelerationPolicy
    IsOrganizationDefault : True
    KeyCredentials : {}
    Type : HomeRealmDiscoveryPolicy
    ```

    If the policy exists but the *AlternateIdLogin* attribute that isn't present or enabled, or if other attributes exist on the policy you wish to preserve, update the existing policy using the [Set-AzureADPolicy][Set-AzureADPolicy] cmdlet.

    > [!IMPORTANT]
    > When you update the policy, make sure you include any old settings and the new *AlternateIdLogin* attribute.

    The following example adds the *AlternateIdLogin* attribute and preserves the *AllowCloudPasswordValidation* attribute that may have already been set:

    ```powershell
    $AzureADPolicyDefinition = @(
      @{
         "HomeRealmDiscoveryPolicy" = @{
            "AllowCloudPasswordValidation" = $true
            "AlternateIdLogin" = @{
               "Enabled" = $true
            }
         }
      } | ConvertTo-JSON -Compress
    )
    $AzureADPolicyParameters = @{
      ID                    = "b581c39c-8fe3-4bb5-b53d-ea3de05abb4b"
      Definition            = $AzureADPolicyDefinition
      DisplayName           = "BasicAutoAccelerationPolicy"
      IsOrganizationDefault = $true
      Type                  = "HomeRealmDiscoveryPolicy"
    }
    
    Set-AzureADPolicy @AzureADPolicyParameters
    ```

    Confirm that the updated policy shows your changes and that the *AlternateIdLogin* attribute is now enabled:

    ```powershell
    Get-AzureADPolicy | Where-Object Type -eq "HomeRealmDiscoveryPolicy" | Format-List *
    ```

With the policy applied, it can take up to an hour to propagate and for users to be able to sign in using their alternate login ID.

## Test user sign-in with email

To test that users can sign in with email, browse to [https://myprofile.microsoft.com][my-profile] and sign in with a user account based on their email address, such as `balas@fabrikam.com`, not their UPN, such as `balas@contoso.com`. The sign-in experience should look and feel the same as with a UPN-based sign-in event.

## Enable staged rollout to test user sign-in with an email address  

[Staged rollout][staged-rollout] allows tenant administrators to enable features for specific groups. It is recommended that tenant administrators use staged rollout to test user sign-in with an email address. When administrators are ready to deploy this feature to their entire tenant, they should use a Home Realm Discovery policy.  


You need *tenant administrator* permissions to complete the following steps:

1. Open a PowerShell session as an administrator, then install the *AzureADPreview* module using the [Install-Module][Install-Module] cmdlet:

    ```powershell
    Install-Module AzureADPreview
    ```

    If prompted, select **Y** to install NuGet or to install from an untrusted repository.

2. Sign in to your Azure AD tenant as a *tenant administrator* using the [Connect-AzureAD][Connect-AzureAD] cmdlet:

    ```powershell
    Connect-AzureAD
    ```

    The command returns information about your account, environment, and tenant ID.

3. List all existing staged rollout policies using the following cmdlet:
   
   ```powershell
   Get-AzureADMSFeatureRolloutPolicy
   ``` 

4. If there are no existing staged rollout policies for this feature, create a new staged rollout policy and take note of the policy ID:

   ```powershell
   $AzureADMSFeatureRolloutPolicy = @{
      Feature    = "EmailAsAlternateId"
      DisplayName = "EmailAsAlternateId Rollout Policy"
      IsEnabled   = $true
   }
   New-AzureADMSFeatureRolloutPolicy @AzureADMSFeatureRolloutPolicy
   ```

5. Find the directoryObject ID for the group to be added to the staged rollout policy. Note the value returned for the *Id* parameter, because it will be used in the next step.
   
   ```powershell
   Get-AzureADMSGroup -SearchString "Name of group to be added to the staged rollout policy"
   ```

6. Add the group to the staged rollout policy as shown in the following example. Replace the value in the *-Id* parameter with the value returned for the policy ID in step 4 and replace the value in the *-RefObjectId* parameter with the *Id* noted in step 5. It may take up to 1 hour before users in the group can use their proxy addresses to sign-in.

   ```powershell
   Add-AzureADMSFeatureRolloutPolicyDirectoryObject -Id "ROLLOUT_POLICY_ID" -RefObjectId "GROUP_OBJECT_ID"
   ```
   
For new members added to the group, it may take up to 24 hours before they can use their proxy addresses to sign-in.

### Removing groups

To remove a group from a staged rollout policy, run the following command:

```powershell
Remove-AzureADMSFeatureRolloutPolicyDirectoryObject -Id "ROLLOUT_POLICY_ID" -ObjectId "GROUP_OBJECT_ID" 
```

### Removing policies

To remove a staged rollout policy, first disable the policy then remove it from the system:

```powershell
Set-AzureADMSFeatureRolloutPolicy -Id "ROLLOUT_POLICY_ID" -IsEnabled $false 
Remove-AzureADMSFeatureRolloutPolicy -Id "ROLLOUT_POLICY_ID"
```

## Troubleshoot

If users have trouble with sign-in events using their email address, review the following troubleshooting steps:

1. Make sure the user account has their email address set for the *ProxyAddresses* attribute in the on-prem AD DS environment.
1. Verify that Azure AD Connect is configured and successfully synchronizes user accounts from the on-prem AD DS environment into Azure AD.
1. Confirm that the Azure AD *HomeRealmDiscoveryPolicy* policy has the *AlternateIdLogin* attribute set to *"Enabled": true*:

    ```powershell
    Get-AzureADPolicy | Where-Object Type -eq "HomeRealmDiscoveryPolicy" | Format-List *
    ```

## Next steps

To learn more about hybrid identity, such as Azure AD App Proxy or Azure AD Domain Services, see [Azure AD hybrid identity for access and management of on-prem workloads][hybrid-overview].

For more information on hybrid identity operations, see [how password hash sync][phs-overview] or [pass-through authentication][pta-overview] synchronization work.

<!-- INTERNAL LINKS -->
[verify-domain]: ../fundamentals/add-custom-domain.md
[hybrid-auth-methods]: ../hybrid/choose-ad-authn.md
[azure-ad-connect]: ../hybrid/whatis-azure-ad-connect.md
[hybrid-overview]: ../hybrid/cloud-governed-management-for-on-premises.md
[phs-overview]: ../hybrid/how-to-connect-password-hash-synchronization.md
[pta-overview]: ../hybrid/how-to-connect-pta-how-it-works.md
[identity-protection]: ../identity-protection/overview-identity-protection.md#risk-detection-and-remediation

<!-- EXTERNAL LINKS -->
[Install-Module]: /powershell/module/powershellget/install-module
[Connect-AzureAD]: /powershell/module/azuread/connect-azuread
[Get-AzureADPolicy]: /powershell/module/azuread/get-azureadpolicy
[New-AzureADPolicy]: /powershell/module/azuread/new-azureadpolicy
[Set-AzureADPolicy]: /powershell/module/azuread/set-azureadpolicy
[staged-rollout]: /powershell/module/azuread/?view=azureadps-2.0-preview&preserve-view=true#staged-rollout
[my-profile]: https://myprofile.microsoft.com
