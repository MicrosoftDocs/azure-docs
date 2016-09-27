<properties
	pageTitle="Azure AD Domain Services: Enable password synchronization | Microsoft Azure"
	description="Getting started with Azure Active Directory Domain Services"
	services="active-directory-ds"
	documentationCenter=""
	authors="mahesh-unnikrishnan"
	manager="stevenpo"
	editor="curtand"/>

<tags
	ms.service="active-directory-ds"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="09/08/2016"
	ms.author="maheshu"/>

# Azure AD Domain Services *(Preview)* - Enable password synchronization to Azure AD Domain Services
In preceding tasks, you enabled Azure AD Domain Services for your Azure AD tenant. The next task is to enable credential hashes required for NTLM and Kerberos authentication to synchronize to Azure AD Domain Services. Once credential synchronization is set up, users can sign in to the managed domain using their corporate credentials.

The steps involved are different based on whether your organization has a cloud-only Azure AD tenant or is set to synchronize with your on-premises directory using Azure AD Connect.

<br>

> [AZURE.SELECTOR]
- [Cloud-only Azure AD tenant](active-directory-ds-getting-started-password-sync.md)
- [Synced Azure AD tenant](active-directory-ds-getting-started-password-sync-synced-tenant.md)

<br>


## Task 5: Enable password synchronization to AAD Domain Services for a cloud-only Azure AD tenant
Azure AD Domain Services needs credential hashes in a format suitable for NTLM and Kerberos authentication, to authenticate users on the managed domain. Unless you enable AAD Domain Services for your tenant, Azure AD does not generate or store credential hashes in the format required for NTLM or Kerberos authentication. For obvious security reasons, Azure AD also does not store any credentials in clear-text form. Therefore, Azure AD does not have a way to generate these NTLM or Kerberos credential hashes based on users' existing credentials.

> [AZURE.NOTE] If your organization has a cloud-only Azure AD tenant, users that need to use Azure AD Domain Services must change their passwords.

This password change process causes the credential hashes required by Azure AD Domain Services for Kerberos and NTLM authentication to be generated in Azure AD. You can either expire passwords for all users in the tenant that need to use Azure AD Domain Services or instruct these users to change their passwords.


### Enable NTLM and Kerberos credential hash generation for a cloud-only Azure AD tenant
Here are instructions you need to provide end users, so they can change their passwords:

1. Navigate to the Azure AD Access Panel page for your organization at [http://myapps.microsoft.com](http://myapps.microsoft.com).

2. Select the **profile** tab on this page.

3. Click on the **Change password** tile on this page.

    ![Create a virtual network for Azure AD Domain Services.](./media/active-directory-domain-services-getting-started/user-change-password.png)

    > [AZURE.NOTE] If you do not see the **Change password** option on the Access Panel page, ensure that your organization has configured [password management in Azure AD](../active-directory/active-directory-passwords-getting-started.md).

4. On the **change password** page, type your existing (old) password and then type a new password and confirm it. Click **submit**.

    ![Create a virtual network for Azure AD Domain Services.](./media/active-directory-domain-services-getting-started/user-change-password2.png)

After you have changed your password, the new password will be usable in Azure AD Domain Services shortly. After a few minutes (typically, about 20 minutes), you can sign in to computers joined to the managed domain using the newly changed password.

<br>

## Related Content

- [Enable password synchronization to AAD Domain Services for a synced Azure AD tenant](active-directory-ds-getting-started-password-sync-synced-tenant.md)

- [How to update your own password](../active-directory/active-directory-passwords-update-your-own-password.md)

- [Getting started with Password Management in Azure AD](../active-directory/active-directory-passwords-getting-started.md).

- [Administer an Azure AD Domain Services managed domain](active-directory-ds-admin-guide-administer-domain.md)

- [Join a Windows virtual machine to an Azure AD Domain Services managed domain](active-directory-ds-admin-guide-join-windows-vm.md)

- [Join a Red Hat Enterprise Linux virtual machine to an Azure AD Domain Services managed domain](active-directory-ds-admin-guide-join-rhel-linux-vm.md)
