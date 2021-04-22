---
title: Secure Azure AD Domain Services | Microsoft Docs
description: Learn how to disable weak ciphers, old protocols, and NTLM password hash synchronization for an Azure Active Directory Domain Services managed domain.
services: active-directory-ds
author: justinha
manager: daveba

ms.assetid: 6b4665b5-4324-42ab-82c5-d36c01192c2a
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: how-to
ms.date: 03/08/2021
ms.author: justinha

---
# Disable weak ciphers and password hash synchronization to secure an Azure Active Directory Domain Services managed domain

By default, Azure Active Directory Domain Services (Azure AD DS) enables the use of ciphers such as NTLM v1 and TLS v1. These ciphers may be required for some legacy applications, but are considered weak and can be disabled if you don't need them. If you have on-premises hybrid connectivity using Azure AD Connect, you can also disable the synchronization of NTLM password hashes.

This article shows you how to disable NTLM v1 and TLS v1 ciphers and disable NTLM password hash synchronization.

## Prerequisites

To complete this article, you need the following resources:

* An active Azure subscription.
    * If you don't have an Azure subscription, [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An Azure Active Directory tenant associated with your subscription, either synchronized with an on-premises directory or a cloud-only directory.
    * If needed, [create an Azure Active Directory tenant][create-azure-ad-tenant] or [associate an Azure subscription with your account][associate-azure-ad-tenant].
* An Azure Active Directory Domain Services managed domain enabled and configured in your Azure AD tenant.
    * If needed, [create and configure an Azure Active Directory Domain Services managed domain][create-azure-ad-ds-instance].

## Use Security settings to disable weak ciphers and NTLM password hash sync

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **Azure AD Domain Services**.
1. Choose your managed domain, such as *aaddscontoso.com*.
1. On the left-hand side, select **Security settings**.
1. Click **Disable** for the following settings:
   - **TLS 1.2 only mode**
   - **NTLM authentication**
   - **NTLM password synchronization from on-premises**

   ![Screenshot of Security settings to disable weak ciphers and NTLM password hash sync](media/secure-your-domain/security-settings.png)

## Use PowerShell to disable weak ciphers and NTLM password hash sync

If needed, [install and configure Azure PowerShell](/powershell/azure/install-az-ps). Make sure that you sign in to your Azure subscription using the [Connect-AzAccount][Connect-AzAccount] cmdlet. 

Also if needed, [install and configure Azure AD PowerShell](/powershell/azure/active-directory/install-adv2). Make sure that you sign in to your Azure AD tenant using the [Connect-AzureAD][Connect-AzureAD] cmdlet.

To disable weak cipher suites and NTLM credential hash synchronization, sign in to your Azure account, then get the Azure AD DS resource using the [Get-AzResource][Get-AzResource] cmdlet:

> [!TIP]
> If you receive an error using the [Get-AzResource][Get-AzResource] command that the *Microsoft.AAD/DomainServices* resource doesn't exist, [elevate your access to manage all Azure subscriptions and management groups][global-admin].

```powershell
Login-AzAccount

$DomainServicesResource = Get-AzResource -ResourceType "Microsoft.AAD/DomainServices"
```

Next, define *DomainSecuritySettings* to configure the following security options:

1. Disable NTLM v1 support.
2. Disable the synchronization of NTLM password hashes from your on-premises AD.
3. Disable TLS v1.

> [!IMPORTANT]
> Users and service accounts can't perform LDAP simple binds if you disable NTLM password hash synchronization in the Azure AD DS managed domain. If you need to perform LDAP simple binds, don't set the *"SyncNtlmPasswords"="Disabled";* security configuration option in the following command.

```powershell
$securitySettings = @{"DomainSecuritySettings"=@{"NtlmV1"="Disabled";"SyncNtlmPasswords"="Disabled";"TlsV1"="Disabled"}}
```

Finally, apply the defined security settings to the managed domain using the [Set-AzResource][Set-AzResource] cmdlet. Specify the Azure AD DS resource from the first step, and the security settings from the previous step.

```powershell
Set-AzResource -Id $DomainServicesResource.ResourceId -Properties $securitySettings -Verbose -Force
```

It takes a few moments for the security settings to be applied to the managed domain.

> [!IMPORTANT]
> After you disable NTLM, perform a full password hash synchronization in Azure AD Connect to remove all the password hashes from the managed domain. If you disable NTLM but don't force a password hash sync, NTLM password hashes for a user account are only removed on the next password change. This behavior could allow a user to continue to sign in if they have cached credentials on a system where NTLM is used as the authentication method.
>
> Once the NTLM password hash is different from the Kerberos password hash, fallback to NTLM won't work. Cached credentials also no longer work if the VM has connectivity to the managed domain controller.  

## Next steps

To learn more about the synchronization process, see [How objects and credentials are synchronized in a managed domain][synchronization].

<!-- INTERNAL LINKS -->
[create-azure-ad-tenant]: ../active-directory/fundamentals/sign-up-organization.md
[associate-azure-ad-tenant]: ../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md
[create-azure-ad-ds-instance]: tutorial-create-instance.md
[global-admin]: ../role-based-access-control/elevate-access-global-admin.md
[synchronization]: synchronization.md

<!-- EXTERNAL LINKS -->
[Get-AzResource]: /powershell/module/az.resources/Get-AzResource
[Set-AzResource]: /powershell/module/Az.Resources/Set-AzResource
[Connect-AzAccount]: /powershell/module/Az.Accounts/Connect-AzAccount
[Connect-AzureAD]: /powershell/module/AzureAD/Connect-AzureAD
