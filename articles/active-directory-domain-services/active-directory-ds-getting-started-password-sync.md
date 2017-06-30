---
title: 'Azure Active Directory Domain Services: Enable password synchronization | Microsoft Docs'
description: Getting started with Azure Active Directory Domain Services
services: active-directory-ds
documentationcenter: ''
author: mahesh-unnikrishnan
manager: stevenpo
editor: curtand

ms.assetid: 5a32a0df-a3ca-4ebe-b980-91f58f8030fc
ms.service: active-directory-ds
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 06/30/2017
ms.author: maheshu

---
# Enable password synchronization with Azure Active Directory Domain Services
In the preceding tasks, you enabled Azure Active Directory Domain Services (AD DS) for your Azure Active Directory (Azure AD) tenant. The next task is to enable credential hashes, which are required for NT LAN Manager (NTLM) and Kerberos authentication to sync with Azure Active Directory Domain Services. After you've set up credential synchronization, users can sign in to the managed domain with their corporate credentials.

The procedures vary depending on whether your organization has a cloud-only Azure AD tenant or is set to sync with your on-premises directory by using Azure AD Connect. If your Azure AD tenant has a combination of cloud only users and users from your on-premises AD, you need to perform both steps.


> [!div class="op_single_selector"]
> * **Cloud-only user accounts**: [Synchronize passwords for cloud-only user accounts to your managed domain](active-directory-ds-getting-started-password-sync.md)
> * **On-premises user accounts**: [Synchronize passwords for user accounts synced from your on-premises AD to your managed domain](active-directory-ds-getting-started-password-sync-synced-tenant.md)
>
>

## Task 5: enable password synchronization to your managed domain for cloud-only user accounts
To authenticate users on the managed domain, Azure Active Directory Domain Services needs credential hashes in a format that's suitable for NTLM and Kerberos authentication. Unless you enable Azure Active Directory Domain Services for your tenant, Azure AD does not generate or store credential hashes in the format that's required for NTLM or Kerberos authentication. For obvious security reasons, Azure AD also does not store any password credentials in clear-text form. Therefore, Azure AD does not have a way to automatically generate these NTLM or Kerberos credential hashes based on users' existing credentials.

> [!NOTE]
> If your organization has cloud-only user accounts, users who need to use Azure Active Directory Domain Services must change their passwords. A cloud-only user account is an account that was created in your Azure AD directory using either the Azure portal or Azure AD PowerShell cmdlets. Such user accounts aren't synchronized from an on-premises directory.
>
>

This password change process causes the credential hashes that are required by Azure Active Directory Domain Services for Kerberos and NTLM authentication to be generated in Azure AD. You can either expire the passwords for all users in the tenant who need to use Azure Active Directory Domain Services or instruct them to change their passwords.

### Enable NTLM and Kerberos credential hash generation for a cloud-only user account
Here are the instructions you need to provide users, so they can change their passwords:

1. Go to the [Azure AD Access Panel](http://myapps.microsoft.com) page for your organization.

    ![Launch the Azure AD access panel](./media/active-directory-domain-services-getting-started/access-panel.png)

2. In the top right corner, click on your name and select **Profile** from the menu.

    ![Select profile](./media/active-directory-domain-services-getting-started/select-profile.png)

3. On the **Profile** page, click on **Change password**.

    ![Click on "Change password"](./media/active-directory-domain-services-getting-started/user-change-password.png)

   > [!NOTE]
   > If the **Change password** option is not displayed in the Access Panel window, ensure that your organization has configured [password management in Azure AD](../active-directory/active-directory-passwords-getting-started.md).
   >
   >
4. On the **change password** page, type your existing (old) password, type a new password, and then confirm it.

    ![Create a virtual network for Azure AD Domain Services.](./media/active-directory-domain-services-getting-started/user-change-password2.png)

5. Click **submit**.

A few minutes after you have changed your password, the new password is usable in Azure Active Directory Domain Services. After a few more minutes (typically, about 20 minutes), you can sign in to computers that are joined to the managed domain by using the newly changed password.

## Next steps
* [How to update your own password](../active-directory/active-directory-passwords-update-your-own-password.md)
* [Getting started with Password Management in Azure AD](../active-directory/active-directory-passwords-getting-started.md)
* [Enable password synchronization to Azure Active Directory Domain Services for a synced Azure AD tenant](active-directory-ds-getting-started-password-sync-synced-tenant.md)
* [Administer an Azure Active Directory Domain Services-managed domain](active-directory-ds-admin-guide-administer-domain.md)
* [Join a Windows virtual machine to an Azure Active Directory Domain Services-managed domain](active-directory-ds-admin-guide-join-windows-vm.md)
* [Join a Red Hat Enterprise Linux virtual machine to an Azure Active Directory Domain Services-managed domain](active-directory-ds-admin-guide-join-rhel-linux-vm.md)
