---
title: Email address user sign-in for Azure Active Directory
description: Learn how to configure and enable users to sign in to Azure Active Directory using their email address (preview)

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 05/21/2020

ms.author: iainfou
author: iainfoulds
manager: daveba
ms.reviewer: scottsta

---
# Sign-in to Azure with an email address instead of the UPN (preview)

Many organizations want to let users sign in to Azure Active Directory (Azure AD) using the same credentials as their on-premises directory environment. With this approach, hybrid authentication, users only need to remember one set of credentials - their user principle name (UPN), such as `contoso\balas`.

Some organizations haven't moved to hybrid authentication for the following reasons:

* For the best compatibility across applications and services, by default the Azure AD UPN is set to the same UPN value used in your on-premises directory.
* Due to business or compliance reasons, your organization doesn't use the on-premises UPN to sign in.

Azure AD previously required all users to sign in with their UPN. To help customers simplify their approach to hybrid authentication, you can now configure Azure AD to let users sign in using their email address. To sign in, users would only need to know their email address, not their UPN.

|     |
| --- |
| Sign in to Azure AD with an email address is a public preview feature of Azure Active Directory. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).|
|     |

## Overview of Azure AD sign-in approaches

User Principal Names (UPNs) are unique identifiers for a user account in both your on-premises directory, and in Azure AD. Each user account in a directory is represented by a UPN, such as `contoso\balas`.

In many organizations, users sign in to Azure AD applications and services with their UPN. However, some organizations can't use the UPN for sign-in due to business policies or user experience issues.

Organizations that can't use the UPN for user sign-in with Azure AD have a few options:

* One approach is to set the Azure AD UPN to the value of the user's email address, such as `balas@contoso.com`. For the user, it looks like they sign in to Azure using their email address.
    * However, not all applications and services are compatible with using a different value for the on-premises UPN and the Azure AD UPN.
* A better approach is to ensure the cloud and on-premises UPNs are set to the same value, and configure Azure to accept the user's email as a sign-in ID.
    * In this configuration, users can still sign in by entering their UPN, but can also sign in by entering any email defined in their *ProxyAddresses* attribute. This *ProxyAddress* attribute supports one or more email addresses.

## Synchronize sign-in email addresses to Azure AD

Traditional Active Directory Domain Services (AD DS) or Active Directory Federation Services (AD FS) authentication happens directly on your network and is handled by your AD DS infrastructure. With hybrid authentication, users can instead sign in directly to Azure AD.

To support this hybrid authentication approach, you synchronize your on-premises AD DS environment to Azure AD using [Azure AD Connect][azure-ad-connect] and configure it to use Password Hash Sync (PHS) or Pass-Through Authentication (PTA).

In both configuration options, the user submits their username and password to Azure AD, which validates the credentials and issues a ticket. When users sign in to Azure AD, it removes the need for your organization to host and manage an AD FS infrastructure.

![Diagram of Azure AD hybrid identity with password hash synchronization](media/howto-authentication-use-email-signin/hybrid-password-hash-sync.png)

![Diagram of Azure AD hybrid identity with pass-through authentication](media/howto-authentication-use-email-signin/hybrid-pass-through-authentication.png)

One of the user attributes that's automatically synchronized by Azure AD Connect is *ProxyAddresses*. If users have a sign-in email address set in the on-prem AD DS environment as part of the *ProxyAddresses* attribute, it's automatically synchronized to Azure AD. This email address can then be used directly in the Azure AD sign-in process.

> [!IMPORTANT]
> Only emails in verified domains for the tenant are synchronized to the cloud. Each Azure AD tenant has one or more verified domains, for which you have proven ownership, and are uniquely bound to you tenant.
>
> For more information, see [Add and verify a custom domain name in Azure AD][verify-domain].

For more information, see [Choose the right authentication method for your Azure AD hybrid identity solution][hybrid-auth-methods].

## Enable user sign-in with an email address

Once users with the *ProxyAddresses* attribute applied are synchronized to Azure AD using Azure AD Connect, you need to enable the feature for users to sign in with an email address for your tenant. This feature tells the Azure AD login servers to not only check the sign-in name against UPN values, but also against *ProxyAddresses* values for the email address.

During preview, you can currently only enable the email address user sign-in feature using PowerShell. You need *tenant administrator* permissions to complete the following steps:

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

To test email address sign-in works for a user, browse to [https://myprofile.microsoft.com][my-profile] and sign in with a user account based on their email address, such as `balas@contoso.com`, not their UPN, such as `contoso\balas`. The sign-in experience should look and feel the same as with a UPN-based sign-in event.

## Troubleshoot

If users have trouble with sign-in events using their email address, review the following troubleshooting steps:

1. Make sure the user account has their email address set for the *ProxyAddresses* attribute in the on-prem AD DS environment.
1. Verify that Azure AD Connect is configured and successfully synchronizes user accounts frm the on-prem AD DS environment into Azure AD.
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
