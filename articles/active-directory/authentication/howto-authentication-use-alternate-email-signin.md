---
title: Alternate email user sign in for Azure Active Directory
description: Learn how to configure and enable users to sign in to Azure Active Directory using alternate email address (preview)

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: how-to
ms.date: 05/04/2020

ms.author: iainfou
author: iainfoulds
manager: daveba
ms.reviewer: scottsta

---

# Configure user sign-in with an alternate email address in Azure Active Directory (preview)

Many organizations want to use hybrid authentication to allow their users to sign in directly to Azure Active Directory (Azure AD). With hybrid authentication, users have the same sign-in credentials in an on-premises environment and in the cloud. However, hybrid authentication may currently be blocked in your environment because of the following reasons:

* The unique principal name (UPN) for a user must be identical in the on-premises directory and in Azure AD.
    * Azure AD requires users to sign in with their Azure AD UPN.
* Your users can't sign in with their UPN because they don't know, can't remember, or just don't associate with their UPN.
    * Especially for large organizations with multiple subsidiaries or acquired companies, users may not be allowed to use an account with the parent company as part of their UPN.

If this situation describes your organization, you can now use the preview for Azure AD user sign-in with an alternate email address. With this approach, you enable your users to sign in with their well-known email address in the cloud, just like they do in your on-premises network. Users only need to know their email address, not their UPN.

|     |
| --- |
| Alternate email authentication for users is a public preview feature of Azure Active Directory. For more information about previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)|
|     |

## Overview of Unique Principal Names (UPNs)

Unique Principal Names (UPNs) act as a unique identifier for a user account. Each user account must be represented in a directory by this UPN, and is typically used during sign-in events.

For some scenarios, the UPN isn't employee-friendly and an organization may want to enable sign in with an alternate ID. The following examples outline some of these scenarios:

* The UPN username is constructed from elements such as initials and employee numbers.
    * For example: `pk42566@contoso.com`

* The UPN domain is constructed from multiple values or is otherwise awkward.
    * For example: `pat@store434.eastregion.contoso.com`

* Your organization has multiple subsidiaries or acquired companies and users may not even know their domain or associate strongly with the parent company.
    * For example: `pat@fabrikam.contoso.com`

One alternative to these scenarios is for users to sign in with their email address. With this approach, users sign in to Azure AD with their email address, and makes sure that the UPN for that user is identical in the on-premises AD DS and in Azure AD.

## Synchronize users sign-in email to Azure AD

Traditional Active Directory Domain Services (AD DS) or Active Directory Federation Services (AD FS) authentication happens directly on your network and is handled by your AD DS infrastructure. With hybrid authentication, users to sign in directly to Azure AD.

You can synchronize your on-premises AD DS to Azure AD using [Azure AD Connect][azure-ad-connect] and configure it to use Password Hash Sync or Pass-Through Authentication. In both cases, the user submits their username and password to Azure AD, which validate the credentials and issues a ticket. This validation directly in Azure AD removes the need for your organization to host and manage an AD FS infrastructure.

![Diagram of Azure AD hybrid identity with password hash synchronization](media/howto-authentication-use-alternate-email-signin/hybrid-password-hash-sync.png)

![Diagram of Azure AD hybrid identity with pass-through authentication](media/howto-authentication-use-alternate-email-signin/hybrid-pass-through-authentication.png)

For more information, see [Choose the right authentication method for your Azure AD hybrid identity solution][hybrid-auth-methods].

One of the user attributes that's automatically synchronized by Azure AD Connect is *ProxyAddresses*. If your users have their preferred sign-in email address in AD DS set in the *ProxyAddresses* attribute, it's automatically synchronized to the cloud.

> [!IMPORTANT]
> Only emails in verified domains for the tenant are synchronized to the cloud. Each Azure AD tenant has one or more verified domains, for which you have proven ownership, and are uniquely bound to you tenant.
>
> For more information, see [Add and verify a custom domain name in Azure AD][verify-domain].

## Enable sign-in with alternate email

Once your users with the *ProxyAddresses* attribute set are synchronized to Azure AD using Azure AD Connect, you need to enable sign in with an alternate email for your tenant. This feature tells the Azure AD login servers to not only check the sign-in name against your UPN values, but also against your ProxyAddresses values for the alternate email address

During preview, you can currently only enable this alternate email user sign-in feature using PowerShell. You need *tenant administrator* permissions to complete the following steps:

1. Launch PowerShell and install the *AzureADPreview* module using [Install-Module][Install-Module] cmdlet:

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

1. If there's no policy currently configured, the command returns nothing.

    To add the *HomeRealmDiscoveryPolicy* policy to the tenant, use the [New-AzureADPolicy][New-AzureADPolicy] cmdlet and set the *AlternateIdLogin* attribute as shown in the following example:

    ```powershell
    New-AzureADPolicy -Definition @('{"HomeRealmDiscoveryPolicy" :{"AlternateIdLogin":{"Enabled": true}}}') `
        -DisplayName "BasicAutoAccelerationPolicy" `
        -IsOrganizationDefault $true `
        -Type "HomeRealmDiscoveryPolicy"
    ```

    On successful completion, the command returns the policy ID, as shown in the following example output:

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

    The following example adds the *AlternateIdLogin* attribute and preserves the *AllowCloudPasswordValidation* attribute:

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
  
## Next steps

<!-- INTERNAL LINKS -->
[verify-domain]: ../fundamentals/add-custom-domain.md
[hybrid-auth-methods]: ../hybrid/choose-ad-authn.md
[azure-ad-connect]: ../hybrid/whatis-azure-ad-connect.md

<!-- EXTERNAL LINKS -->
[Install-Module]: /powershell/module/powershellget/install-module
[Connect-AzureAD]: /powershell/module/azuread/connect-azuread
[Get-AzureADPolicy]: /powershell/module/azuread/get-azureadpolicy
[New-AzureADPolicy]: /powershell/module/azuread/new-azureadpolicy
[Set-AzureADPolicy]: /powershell/module/azuread/set-azureadpolicy
