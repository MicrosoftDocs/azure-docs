---
title: Enable Secure LDAP (LDAPS) in Azure AD Domain Services | Microsoft Docs
description: Enable Secure LDAP (LDAPS) for an Azure AD Domain Services managed domain
services: active-directory-ds
documentationcenter: ''
author: mahesh-unnikrishnan
manager: mtillman
editor: curtand

ms.assetid: c6da94b6-4328-4230-801a-4b646055d4d7
ms.service: active-directory
ms.component: domain-services
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 08/01/2018
ms.author: maheshu

---
# Enable secure LDAP (LDAPS) for an Azure AD Domain Services managed domain

## Before you begin
Complete [Task 2 - export the secure LDAP certificate to a .PFX file](active-directory-ds-admin-guide-configure-secure-ldap-export-pfx.md).


## Task 3: Enable secure LDAP for the managed domain using the Azure portal
To enable secure LDAP, perform the following configuration steps:

1. Navigate to the **[Azure portal](https://portal.azure.com)**.

2. Search for 'domain services' in the **Search resources** search box. Select **Azure AD Domain Services** from the search result. The **Azure AD Domain Services** page lists your managed domain.

    ![Find managed domain being provisioned](./media/getting-started/domain-services-provisioning-state-find-resource.png)

2. Click the name of the managed domain (for example, 'contoso100.com') to see more details about the domain.

    ![Domain Services - provisioning state](./media/getting-started/domain-services-provisioning-state.png)

3. Click **Secure LDAP** on the navigation pane.

    ![Domain Services - Secure LDAP page](./media/active-directory-domain-services-admin-guide/secure-ldap-blade.png)

4. By default, secure LDAP access to your managed domain is disabled. Toggle **Secure LDAP** to **Enable**.

    ![Enable secure LDAP](./media/active-directory-domain-services-admin-guide/secure-ldap-blade-configure.png)
5. By default, secure LDAP access to your managed domain over the internet is disabled. Toggle **Allow secure LDAP access over the internet** to **Enable**, if you need to.

    > [!WARNING]
    > When you enable secure LDAP access over the internet, your domain is susceptible to password brute force attacks over the internet. Therefore, we recommend setting up an NSG to lock down access to required source IP address ranges. See the instructions to [lock down LDAPS access to your managed domain over the internet](#task-5---lock-down-secure-ldap-access-to-your-managed-domain-over-the-internet).
    >

6. Click the folder icon following **.PFX file with secure LDAP certificate**. Specify the path to the PFX file with the certificate for secure LDAP access to the managed domain.

7. Specify the **Password to decrypt .PFX file**. Provide the same password you used when exporting the certificate to the PFX file.

8. When you're done, click the **Save** button.

9. You see a notification that informs you secure LDAP is being configured for the managed domain. Until this operation is complete, you can't modify other settings for the domain.

    ![Configuring secure LDAP for the managed domain](./media/active-directory-domain-services-admin-guide/secure-ldap-blade-configuring.png)

> [!NOTE]
> It takes about 10 to 15 minutes to enable secure LDAP for your managed domain. If the provided secure LDAP certificate does not match the required criteria, secure LDAP is not enabled for your directory and you see a failure. For example, the domain name is incorrect, the certificate has already expired or expires soon. In this case, retry with a valid certificate.
>
>

## Next step
[Task 4: configure DNS to access the managed domain from the internet](active-directory-ds-ldaps-configure-dns.md)
