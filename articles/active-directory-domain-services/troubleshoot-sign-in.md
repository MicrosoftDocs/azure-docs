---
title: Troubleshoot sign in problems in Azure AD Domain Services | Microsoft Docs
description: Learn how to troubleshoot common user sign in problems and errors in Azure Active Directory Domain Services.
services: active-directory-ds
author: iainfoulds
manager: daveba

ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: troubleshooting
ms.date: 10/02/2019
ms.author: iainfou

#Customer intent: As a directory administrator, I want to troubleshoot user account sign in problems in an Azure Active Directory Domain Services managed domain.
---

# Troubleshoot account sign-in problems with an Azure Active Directory Domain Services managed domain

The most common reasons for a user account that can't sign in to an Azure Active Directory Domain Services (Azure AD DS) managed domain include the following scenarios:

* [The account isn't synchronized into Azure AD DS yet.](#account-isnt-synchronized-into-azure-ad-ds-yet)
* [Azure AD DS doesn't have the password hashes to let the account sign in.](#azure-ad-ds-doesnt-have-the-password-hashes)
* [The account is locked out.](#the-account-is-locked-out)

> [!TIP]
> Azure AD DS can't synchronize in credentials for accounts that are external to the Azure AD tenant. External users can't sign in to the Azure AD DS managed domain.

## Account isn't synchronized into Azure AD DS yet

Depending on the size of your directory, it may take a while for user accounts and credential hashes to be available in Azure AD DS. For large directories, this initial one-way sync from Azure AD can take few hours, and up to a day or two. Make sure that you wait long enough before retrying authentication.

For hybrid environments that user Azure AD Connect to synchronize on-premises directory data into Azure AD, make sure that you run the latest version of Azure AD Connect and have [configured Azure AD Connect to perform a full synchronization after enabling Azure AD DS][azure-ad-connect-phs]. If you disable Azure AD DS and then re-enable, you have to follow these steps again.

If you continue to have issues with accounts not synchronizing through Azure AD Connect, restart the Azure AD Sync Service. From the computer with Azure AD Connect installed, open a command prompt window and run the following commands:

```console
net stop 'Microsoft Azure AD Sync'
net start 'Microsoft Azure AD Sync'
```

## Azure AD DS doesn't have the password hashes

Azure AD doesn't generate or store password hashes in the format that's required for NTLM or Kerberos authentication until you enable Azure AD DS for your tenant. For security reasons, Azure AD also doesn't store any password credentials in clear-text form. Therefore, Azure AD can't automatically generate these NTLM or Kerberos password hashes based on users' existing credentials.

### Hybrid environments with on-premises synchronization

For hybrid environments using Azure AD Connect to synchronize from an on-premises AD DS environment, you can locally generate and synchronize the required NTLM or Kerberos password hashes into Azure AD. After you create your managed domain, [enable password hash synchronization to Azure Active Directory Domain Services][azure-ad-connect-phs]. Without completing this password hash synchronization step, you can't sign in to an account using Azure AD DS. If you disable Azure AD DS and then re-enable, you have to follow those steps again.

For more information, see [How password hash synchronization works for Azure AD DS][phs-process].

### Cloud-only environments with no on-premises synchronization

Managed domains with no on-premises synchronization, only accounts in Azure AD, also need to generate the required NTLM or Kerberos password hashes. If a cloud-only account can't sign in, has a password change process successfully completed for the account after enabling Azure AD DS?

* **No, the password has not been changed.**
    * [Change the password for the account][enable-user-accounts] to generate the required password hashes, then wait for 15 minutes before you try to sign in again.
    * If you disable Azure AD DS and then re-enable, each account must follow the steps again to change their password and generate the required password hashes.
* **Yes, the password has been changed.**
    * Try to sign in using the *UPN* format, such as `driley@aaddscontoso.com`, instead of the *SAMAccountName* format like `AADDSCONTOSO\deeriley`.
    * The *SAMAccountName* may be automatically generated for users whose UPN prefix is overly long or is the same as another user on the managed domain. The *UPN* format is guaranteed to be unique within an Azure AD tenant.

## The account is locked out

A user account in Azure AD DS is locked out when a defined threshold for unsuccessful sign-in attempts has been met. This account lockout behavior is designed to protect you from repeated brute-force sign-in attempts that may indicate an automated digital attack.

By default, if there are 5 bad password attempts in 2 minutes, the account is locked out for 30 minutes.

For more information and how to resolve account lockout issues, see [Troubleshoot account lockout problems in Azure AD DS][troubleshoot-account-lockout].

## Next steps

If you still have problems joining your VM to the managed domain, [find help and open a support ticket for Azure Active Directory][azure-ad-support].

<!-- INTERNAL LINKS -->
[troubleshoot-account-lockout]: troubleshoot-account-lockout.md
[azure-ad-connect-phs]: active-directory-ds-getting-started-password-sync-synced-tenant.md
[enable-user-accounts]:  tutorial-create-instance.md#enable-user-accounts-for-azure-ad-ds
[phs-process]: ../active-directory/hybrid/how-to-connect-password-hash-synchronization.md#password-hash-sync-process-for-azure-ad-domain-services
[azure-ad-support]: ../active-directory/fundamentals/active-directory-troubleshooting-support-howto.md
