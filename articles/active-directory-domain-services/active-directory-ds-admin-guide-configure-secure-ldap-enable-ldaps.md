---
title: Configure Secure LDAP (LDAPS) in Azure AD Domain Services | Microsoft Docs
description: Configure Secure LDAP (LDAPS) for an Azure AD Domain Services managed domain
services: active-directory-ds
documentationcenter: ''
author: mahesh-unnikrishnan
manager: stevenpo
editor: curtand

ms.assetid: c6da94b6-4328-4230-801a-4b646055d4d7
ms.service: active-directory-ds
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/30/2017
ms.author: maheshu

---
# Configure secure LDAP (LDAPS) for an Azure AD Domain Services managed domain

## Before you begin
Ensure you've completed [Task 2 - export the secure LDAP certificate to a .PFX file](active-directory-ds-admin-guide-configure-secure-ldap-export-pfx.md).


## Task 3 - enable secure LDAP for the managed domain using the Azure portal (Preview)
To enable secure LDAP, perform the following configuration steps:

1. Navigate to the **[Azure portal](https://portal.azure.com)**.

2. Search for 'domain services' in the **Search resources** search box. Select **Azure AD Domain Services** from the search result. The **Azure AD Domain Services** blade lists your managed domain.

    ![Find managed domain being provisioned](./media/getting-started/domain-services-provisioning-state-find-resource.png)

2. Click the name of the managed domain (for example, 'contoso100.com') to see more details about the domain.

    ![Domain Services - provisioning state](./media/getting-started/domain-services-provisioning-state.png)

3. Click **Secure LDAP** on the navigation pane.

    ![Domain Services - Secure LDAP blade](./media/active-directory-domain-services-admin-guide/secure-ldap-blade.png)

4. By default, secure LDAP access to your managed domain is disabled. Toggle **Secure LDAP** to **Enable**.

    ![Enable secure LDAP](./media/active-directory-domain-services-admin-guide/secure-ldap-blade-configure.png)
5. Toggle **Allow secure LDAP access over the internet** to **Enable**, if desired.

6. Click the folder icon below **.PFX file with secure LDAP certificate** to specify the PFX file, which contains the certificate you wish to use for secure LDAP access to the managed domain.

7. Specify the **Password to decrypt .PFX file**. This is the same password you specified when exporting the certificate to the PFX file.

8. When you are done, click the **Save** button.

9. You see a notification that informs you secure LDAP is being configured for the managed domain. Until this operation is complete, you cannot modify other settings for the domain.

    ![Configuring secure LDAP for the managed domain](./media/active-directory-domain-services-admin-guide/secure-ldap-blade-configuring.png)

> [!NOTE]
> It takes about 10 to 15 minutes to enable secure LDAP for your managed domain. If the provided secure LDAP certificate does not match the required criteria, secure LDAP is not enabled for your directory and you see a failure. For example, the domain name is incorrect, the certificate has already expired or expires soon. In this case, retry with a valid certificate.
>
>

<br>

## Task 4 - configure DNS to access the managed domain from the internet
**Optional task** - If you do not plan to access the managed domain using LDAPS over the internet, skip this configuration task.

Before you begin this task, ensure you have completed the steps outlined in [Task 3](#task-3---enable-secure-ldap-for-the-managed-domain).

Once you have enabled secure LDAP access over the internet for your managed domain, you need to update DNS so that client computers can find this managed domain. At the end of task 3, an external IP address is displayed on the **Properties** blade in **EXTERNAL IP ADDRESS FOR LDAPS ACCESS**.

Configure your external DNS provider so that the DNS name of the managed domain (for example, 'ldaps.contoso100.com') points to this external IP address. In our example, we need to create the following DNS entry:

    ldaps.contoso100.com  -> 52.165.38.113

That's it - you are now ready to connect to the managed domain using secure LDAP over the internet.

> [!WARNING]
> Remember that client computers must trust the issuer of the LDAPS certificate to be able to connect successfully to the managed domain using LDAPS. If you are using an enterprise certification authority or a publicly trusted certification authority, you do not need to do anything since client computers trust these certificate issuers. If you are using a self-signed certificate, you need to install the public part of the self-signed certificate into the trusted certificate store on the client computer.
>
>

<br>

## Related content
* [Azure AD Domain Services - Getting Started guide](active-directory-ds-getting-started.md)
* [Administer an Azure AD Domain Services managed domain](active-directory-ds-admin-guide-administer-domain.md)
* [Administer Group Policy on an Azure AD Domain Services managed domain](active-directory-ds-admin-guide-administer-group-policy.md)
