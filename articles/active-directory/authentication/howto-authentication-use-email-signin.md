---
title: Sign in with email as an alternate login ID for Azure Active Directory
description: Learn how to configure and enable users to sign in to Azure Active Directory using their email address as an alternate login ID (preview)

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 05/22/2020

ms.author: iainfou
author: iainfoulds
manager: daveba
ms.reviewer: scottsta

---
# Sign-in to Azure Active Directory using email as an alternate login ID (preview)

Many organizations want to let users sign in to Azure Active Directory (Azure AD) using the same credentials as their on-premises directory environment. With this approach, known as hybrid authentication, users only need to remember one set of credentials.

Some organizations haven't moved to hybrid authentication for the following reasons:

* By default, the Azure AD user principal name (UPN) is set to the same UPN as the on-premises directory.
* Changing the Azure AD UPN creates a mis-match between on-prem and Azure AD environments that could cause problems with certain applications and services.
* Due to business or compliance reasons, the organization doesn't want to use the on-premises UPN to sign in to Azure AD.

To help with the move to hybrid authentication, you can now configure Azure AD to let users sign in with an email in your verified domain as an alternate login ID. For example, if *Contoso* rebranded to *Fabrikam*, rather than continuing to sign in with the legacy `balas@contoso.com` UPN, email as an alternate login ID can now be used. To access an application or services, users would sign in to Azure AD using their assigned email, such as `balas@fabrikam.com`.

|     |
| --- |
| Sign in to Azure AD with email as an alternate login ID is a public preview feature of Azure Active Directory. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).|
|     |

## Overview of Azure AD sign-in approaches

To sign in to Azure AD, users enter a name that uniquely identifies their account. Historically, you could only use the Azure AD UPN as the sign-in name.

For organizations where the on-premises UPN is the user's preferred sign-in email, this approach was great. Those organizations would set the Azure AD UPN to the exact same value as the on-premises UPN, and users would have a consistent sign-in experience.

However, in some organizations the on-premises UPN isn't used as a sign-in name. In the on-premise environments, you would configure the local AD DS to allow sign in with an alternate login ID. Setting the Azure AD UPN to the same value as the on-premises UPN isn't an option as Azure AD would then require users sign in with that value.

The typical workaround to this issue was to set the Azure AD UPN to the email address the user expects to sign in with. This approach works, though results in different UPNs between the on-premise AD and in Azure AD, and this configuration isn't compatible with all Microsoft 365 workloads.

A different approach is to synchronize the Azure AD and on-premises UPNs to the same value and then configure Azure AD to allow users to sign in to Azure AD with a verified email. To provide this ability, you define one or more email addresses in the user's *ProxyAddresses* attribute in the on-premises directory. *ProxyAddresses* are then synchronized to Azure AD automatically using Azure AD Connect.

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
    Get-AzureADPolicy | where-object {$_.Type -eq "HomeRealmDiscoveryPolicy"} | fl *
    ```

1. If there's no policy currently configured, the command returns nothing. If a policy is returned, skip this step and move on to the next step to update an existing policy.

    To add the *HomeRealmDiscoveryPolicy* policy to the tenant, use the [New-AzureADPolicy][New-AzureADPolicy] cmdlet and set the *AlternateIdLogin* attribute to *"Enabled": true* as shown in the following example:

    ```powershell
    New-AzureADPolicy -Definition @('{"HomeRealmDiscoveryPolicy" :{"AlternateIdLogin":{"Enabled": true}}}') `
        -DisplayName "BasicAutoAccelerationPolicy" `
        -IsOrganizationDefault $true `
        -Type "HomeRealmDiscoveryPolicy"
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
    Set-AzureADPolicy -id b581c39c-8fe3-4bb5-b53d-ea3de05abb4b `
        -Definition @('{"HomeRealmDiscoveryPolicy" :{"AllowCloudPasswordValidation":true,"AlternateIdLogin":{"Enabled": true}}}') `
        -DisplayName "BasicAutoAccelerationPolicy" `
        -IsOrganizationDefault $true `
        -Type "HomeRealmDiscoveryPolicy"
    ```

    Confirm that the updated policy shows your changes and that the *AlternateIdLogin* attribute is now enabled:

    ```powershell
    Get-AzureADPolicy | where-object {$_.Type -eq "HomeRealmDiscoveryPolicy"} | fl *
    ```

## Test user sign-in with email

To test that users can sign in with email, browse to [https://myprofile.microsoft.com][my-profile] and sign in with a user account based on their email address, such as `balas@fabrikam.com`, not their UPN, such as `balas@contoso.com`. The sign-in experience should look and feel the same as with a UPN-based sign-in event.

## Troubleshoot

If users have trouble with sign-in events using their email address, review the following troubleshooting steps:

1. Make sure the user account has their email address set for the *ProxyAddresses* attribute in the on-prem AD DS environment.
1. Verify that Azure AD Connect is configured and successfully synchronizes user accounts from the on-prem AD DS environment into Azure AD.
1. Confirm that the Azure AD *HomeRealmDiscoveryPolicy* policy has the *AlternateIdLogin* attribute set to *"Enabled": true*:

    ```powershell
    Get-AzureADPolicy | where-object {$_.Type -eq "HomeRealmDiscoveryPolicy"} | fl *
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

<!-- EXTERNAL LINKS -->
[Install-Module]: /powershell/module/powershellget/install-module
[Connect-AzureAD]: /powershell/module/azuread/connect-azuread
[Get-AzureADPolicy]: /powershell/module/azuread/get-azureadpolicy
[New-AzureADPolicy]: /powershell/module/azuread/new-azureadpolicy
[Set-AzureADPolicy]: /powershell/module/azuread/set-azureadpolicy
[my-profile]: https://myprofile.microsoft.com
