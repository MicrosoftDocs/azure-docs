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
	ms.date="07/06/2016"
	ms.author="maheshu"/>

# Azure AD Domain Services *(Preview)* - Enable password synchronization to Azure AD Domain Services

## Task 5: Enable password synchronization to AAD Domain Services for a cloud-only Azure AD directory
Once you have enabled Azure AD Domain Services for your Azure AD tenant, the next task is to enable credentials to synchronize to Azure AD Domain Services. This enables users to sign in to the managed domain using their corporate credentials.

The steps involved are different based on whether your organization has a cloud-only Azure AD directory or is set to synchronize with your on-premises directory using Azure AD Connect.

<br>

> [AZURE.SELECTOR]
- [Cloud-only Azure AD directory](active-directory-ds-getting-started-password-sync.md)
- [Synced Azure AD directory](active-directory-ds-getting-started-password-sync-synced-tenant.md)

<br>

### Enable NTLM and Kerberos credential hash generation for a cloud-only Azure AD directory
If your organization has a cloud-only Azure AD directory, users that need to use Azure AD Domain Services will need to change their passwords. This password change process causes the credential hashes required by Azure AD Domain Services for Kerberos and NTLM authentication to be generated in Azure AD. You can either expire passwords for all users in the tenant that need to use Azure AD Domain Services or instruct these users to change their passwords.

Here are instructions you need to provide end-users, in order to change their passwords:

1. Navigate to the Azure AD Access Panel page for your organization. This is typically available at [http://myapps.microsoft.com](http://myapps.microsoft.com).

2. Select the **profile** tab on this page.

3. Click on the **Change password** tile on this page to initiate a password change.

    ![Create a virtual network for Azure AD Domain Services.](./media/active-directory-domain-services-getting-started/user-change-password.png)

4. This brings up the **change password** page. Users can enter their existing (old) password and proceed to change their password.

    ![Create a virtual network for Azure AD Domain Services.](./media/active-directory-domain-services-getting-started/user-change-password2.png)

After users have changed their password, the new password will be usable in Azure AD Domain Services shortly. After a few minutes, users can sign in to computers joined to the managed domain using their newly changed password.


<br>

## Related Content

- [Enable password synchronization to AAD Domain Services for a synced Azure AD directory](active-directory-ds-getting-started-password-sync-synced-tenant.md)

- [Administer an Azure AD Domain Services managed domain](active-directory-ds-admin-guide-administer-domain.md)

- [Join a Windows virtual machine to an Azure AD Domain Services managed domain](active-directory-ds-admin-guide-join-windows-vm.md)

- [Join a Red Hat Enterprise Linux virtual machine to an Azure AD Domain Services managed domain](active-directory-ds-admin-guide-join-rhel-linux-vm.md)
