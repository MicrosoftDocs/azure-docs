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

<br>
Choose whether to use the preview Azure portal experience or the Azure classic portal to complete this task.
> [!div class="op_single_selector"]
> * **Azure portal (Preview)**: [Enable secure LDAP using the Azure portal](active-directory-ds-admin-guide-configure-secure-ldap-enable-ldaps.md)
> * **Azure classic portal**: [Enable secure LDAP using the classic Azure portal](active-directory-ds-admin-guide-configure-secure-ldap-enable-ldaps-classic.md)
>
>

<br>

## Task 3 - enable secure LDAP for the managed domain using the classic Azure portal
To enable secure LDAP, perform the following configuration steps:

1. Navigate to the **[Azure classic portal](https://manage.windowsazure.com)**.
2. Select the **Active Directory** node on the left pane.
3. Select the Azure AD directory (also referred to as 'tenant'), for which you have enabled Azure AD Domain Services.

    ![Select Azure AD Directory](./media/active-directory-domain-services-getting-started/select-aad-directory.png)
4. Click the **Configure** tab.

    ![Configure tab of directory](./media/active-directory-domain-services-getting-started/configure-tab.png)
5. Scroll down to the section titled **domain services**. You should see an option titled **Secure LDAP (LDAPS)** as shown in the following screenshot:

    ![Domain Services configuration section](./media/active-directory-domain-services-admin-guide/secure-ldap-start.png)
6. Click the **Configure certificate ...** button to bring up the **Configure Certificate for Secure LDAP** dialog.

    ![Configure certificate for secure LDAP](./media/active-directory-domain-services-admin-guide/secure-ldap-configure-cert-page.png)
7. Click the folder icon following **PFX FILE WITH CERTIFICATE** to specify the PFX file, which contains the certificate you wish to use for secure LDAP access to the managed domain. Also enter the password you specified when exporting the certificate to the PFX file. Then, click the done button on the bottom.

    ![Specify secure LDAP PFX file and password](./media/active-directory-domain-services-admin-guide/secure-ldap-specify-pfx.png)
8. The **domain services** section of the **Configure** tab should get grayed out and is in the **Pending...** state for a few minutes. During this period, the LDAPS certificate is verified for accuracy and secure LDAP is configured for your managed domain.

    ![Secure LDAP - pending state](./media/active-directory-domain-services-admin-guide/secure-ldap-pending-state.png)

   > [!NOTE]
   > It takes about 10 to 15 minutes to enable secure LDAP for your managed domain. If the provided secure LDAP certificate does not match the required criteria, secure LDAP is not enabled for your directory and you see a failure. For example, the domain name is incorrect, the certificate has already expired or expires soon.
   >
   >

9. When secure LDAP is successfully enabled for your managed domain, the **Pending...** message should disappear. You should see the thumbprint of the certificate displayed.

    ![Secure LDAP enabled](./media/active-directory-domain-services-admin-guide/secure-ldap-enabled.png)

<br>

## Task 4 - enable secure LDAP access over the internet
**Optional task** - If you do not plan to access the managed domain using LDAPS over the internet, skip this configuration task.

Before you begin this task, ensure you have completed the steps outlined in [Task 3](#task-3---enable-secure-ldap-for-the-managed-domain).

1. You should see an option to **ENABLE SECURE LDAP ACCESS OVER THE INTERNET** in the **domain services** section of the **Configure** page. This option is set to **NO** by default since internet access to the managed domain over secure LDAP is disabled by default.

    ![Secure LDAP enabled](./media/active-directory-domain-services-admin-guide/secure-ldap-enabled2.png)
2. Toggle **ENABLE SECURE LDAP ACCESS OVER THE INTERNET** to **YES**. Click the **SAVE** button on the bottom panel.
    ![Secure LDAP enabled](./media/active-directory-domain-services-admin-guide/secure-ldap-enable-internet-access.png)
3. The **domain services** section of the **Configure** tab should get grayed out and is in the **Pending...** state for a few minutes. After some time, internet access to your managed domain over secure LDAP is enabled.

    ![Secure LDAP - pending state](./media/active-directory-domain-services-admin-guide/secure-ldap-enable-internet-access-pending-state.png)

   > [!NOTE]
   > It takes about 10 minutes to enable internet access over secure LDAP for your managed domain.
   >
   >
4. When secure LDAP access to your managed domain over the internet is successfully enabled, the **Pending...** message should disappear. You should see the external IP address that can be used to access your directory over LDAPS in the field **EXTERNAL IP ADDRESS FOR LDAPS ACCESS**.

    ![Secure LDAP enabled](./media/active-directory-domain-services-admin-guide/secure-ldap-internet-access-enabled.png)

<br>

## Task 5 - configure DNS to access the managed domain from the internet
**Optional task** - If you do not plan to access the managed domain using LDAPS over the internet, skip this configuration task.

Before you begin this task, ensure you have completed the steps outlined in [Task 4](#task-4---enable-secure-ldap-access-over-the-internet).

Once you have enabled secure LDAP access over the internet for your managed domain, you need to update DNS so that client computers can find this managed domain. At the end of task 4, an external IP address is displayed on the **Configure** tab in **EXTERNAL IP ADDRESS FOR LDAPS ACCESS**.

Configure your external DNS provider so that the DNS name of the managed domain (for example, 'ldaps.contoso100.com') points to this external IP address. In our example, we need to create the following DNS entry:

    ldaps.contoso100.com  -> 52.165.38.113

That's it - you are now ready to connect to the managed domain using secure LDAP over the internet.

> [!WARNING]
> Remember that client computers must trust the issuer of the LDAPS certificate to be able to connect successfully to the managed domain using LDAPS. If you are using an enterprise certification authority or a publicly trusted certification authority, you do not need to do anything since client computers trust these certificate issuers. If you are using a self-signed certificate, you need to install the public part of the self-signed certificate into the trusted certificate store on the client computer.
>
>


## Secure access to your managed domain via LDAPS over the internet
**Optional task** - If you have not enabled access to the managed domain using LDAPS over the internet, skip this configuration task.

Before you begin this task, ensure you have completed the steps outlined in [Task 4](#task-4---enable-secure-ldap-access-over-the-internet).

Exposing your managed domain for LDAPS access over the internet represents a security threat. Therefore, you can choose to restrict access to the managed domain to specific known IP addresses. [Create a Network Security Group](../virtual-network/virtual-networks-create-nsg-arm-pportal.md) to specify the external IP addresses that should be allowed to connect via secure LDAP over the internet. 

<br>

## Related content
* [Azure AD Domain Services - Getting Started guide](active-directory-ds-getting-started.md)
* [Administer an Azure AD Domain Services managed domain](active-directory-ds-admin-guide-administer-domain.md)
* [Administer Group Policy on an Azure AD Domain Services managed domain](active-directory-ds-admin-guide-administer-group-policy.md)
