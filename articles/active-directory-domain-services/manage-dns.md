---
title: 'Manage DNS for Azure AD Domain Services | Microsoft Docs'
description: Manage DNS for Azure AD Domain Services
services: active-directory-ds
documentationcenter: ''
author: iainfoulds
manager: daveba
editor: curtand

ms.assetid: 938a5fbc-2dd1-4759-bcce-628a6e19ab9d
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 05/10/2019
ms.author: iainfou

---
# Administer DNS on an Azure AD Domain Services managed domain
Azure Active Directory Domain Services includes a DNS (Domain Name Resolution) server that provides DNS resolution for the managed domain. Occasionally, you may need to configure DNS on the managed domain. You may need to create DNS records for machines that are not joined to the domain, configure virtual IP addresses for load-balancers or setup external DNS forwarders. For this reason, users who belong to the 'AAD DC Administrators' group are granted DNS administration privileges on the managed domain.

[!INCLUDE [active-directory-ds-prerequisites.md](../../includes/active-directory-ds-prerequisites.md)]

## Before you begin
To complete the tasks listed in this article, you need:

1. A valid **Azure subscription**.
2. An **Azure AD directory** - either synchronized with an on-premises directory or a cloud-only directory.
3. **Azure AD Domain Services** must be enabled for the Azure AD directory. If you haven't done so, follow all the tasks outlined in the [Getting Started guide](create-instance.md).
4. A **domain-joined virtual machine** from which you administer the Azure AD Domain Services managed domain. If you don't have such a virtual machine, follow all the tasks outlined in the article titled [Join a Windows virtual machine to a managed domain](active-directory-ds-admin-guide-join-windows-vm.md).
5. You need the credentials of a **user account belonging to the 'AAD DC Administrators' group** in your directory, to administer DNS for your managed domain.

<br>

## Task 1 - Create a domain-joined virtual machine to remotely administer DNS for the managed domain
Azure AD Domain Services managed domains can be managed remotely using familiar Active Directory administrative tools such as the Active Directory Administrative Center (ADAC) or AD PowerShell. Similarly, DNS for the managed domain can be administered remotely using the DNS Server administration tools.

Administrators in your Azure AD directory do not have privileges to connect to domain controllers on the managed domain via Remote Desktop. Members of the 'AAD DC Administrators' group can administer DNS for managed domains remotely using DNS Server tools from a Windows Server/client computer that is joined to the managed domain. DNS Server tools are part of the Remote Server Administration Tools (RSAT) optional feature.

The first task is to create a Windows Server virtual machine that is joined to the managed domain. For instructions, refer to the article titled [join a Windows Server virtual machine to an Azure AD Domain Services managed domain](active-directory-ds-admin-guide-join-windows-vm.md).

## Task 2 - Install DNS Server tools on the virtual machine
Complete the following steps to install the DNS Administration tools on the domain joined virtual machine. For more information on [installing and using Remote Server Administration Tools](https://technet.microsoft.com/library/hh831501.aspx), see Technet.

1. Navigate to the Azure portal. Click **All resources** on the left-hand panel. Locate and click the virtual machine you created in Task 1.
2. Click the **Connect** button on the Overview tab. A Remote Desktop Protocol (.rdp) file is created and downloaded.

    ![Connect to Windows virtual machine](./media/active-directory-domain-services-admin-guide/connect-windows-vm.png)
3. To connect to your VM, open the downloaded RDP file. If prompted, click **Connect**. Use the credentials of a user belonging to the 'AAD DC Administrators' group. For example,  'bob@domainservicespreview.onmicrosoft.com'. You may receive a certificate warning during the sign-in process. Click Yes or Continue to connect.

4. From the Start screen, open **Server Manager**. Click **Add Roles and Features** in the central pane of the Server Manager window.

    ![Launch Server Manager on virtual machine](./media/active-directory-domain-services-admin-guide/install-rsat-server-manager.png)
5. On the **Before You Begin** page of the **Add Roles and Features Wizard**, click **Next**.

    ![Before You Begin page](./media/active-directory-domain-services-admin-guide/install-rsat-server-manager-add-roles-begin.png)
6. On the **Installation Type** page, leave the **Role-based or feature-based installation** option checked and click **Next**.

    ![Installation Type page](./media/active-directory-domain-services-admin-guide/install-rsat-server-manager-add-roles-type.png)
7. On the **Server Selection** page, select the current virtual machine from the server pool, and click **Next**.

    ![Server Selection page](./media/active-directory-domain-services-admin-guide/install-rsat-server-manager-add-roles-server.png)
8. On the **Server Roles** page, click **Next**.
9. On the **Features** page, click to expand the **Remote Server Administration Tools** node and then click to expand the **Role Administration Tools** node. Select **DNS Server Tools** feature from the list of role administration tools.

    ![Features page](./media/active-directory-domain-services-admin-guide/install-rsat-server-manager-add-roles-dns-tools.png)
10. On the **Confirmation** page, click **Install** to install the DNS Server tools feature on the virtual machine. When feature installation completes successfully, click **Close** to exit the **Add Roles and Features** wizard.

    ![Confirmation page](./media/active-directory-domain-services-admin-guide/install-rsat-server-manager-add-roles-dns-confirmation.png)

## Task 3 - Launch the DNS management console to administer DNS
Now, you can use Windows Server DNS tools to administer DNS on the managed domain.

> [!NOTE]
> You need to be a member of the 'AAD DC Administrators' group, to administer DNS on the managed domain.
>
>

1. From the Start screen, click **Administrative Tools**. You should see the **DNS** console installed on the virtual machine.

    ![Administrative tools - DNS Console](./media/active-directory-domain-services-admin-guide/install-rsat-dns-tools-installed.png)
2. Click **DNS** to launch the DNS Management console.
3. In the **Connect to DNS Server** dialog, click **The following computer**, and enter the DNS domain name of the managed domain (for example, 'contoso100.com').

    ![DNS Console - connect to domain](./media/active-directory-domain-services-admin-guide/dns-console-connect-to-domain.png)
4. The DNS Console connects to the managed domain.

    ![DNS Console - administer domain](./media/active-directory-domain-services-admin-guide/dns-console-managed-domain.png)
5. You can now use the DNS console to add DNS entries for computers within the virtual network in which you've enabled AAD Domain Services.

> [!WARNING]
> Be careful when administering DNS for the managed domain using DNS administration tools. Ensure that you **do not delete or modify the built-in DNS records that are used by Domain Services in the domain**. Built-in DNS records include domain DNS records, name server records, and other records used for DC location. If you modify these records, domain services are disrupted on the virtual network.
>
>

For more information about managing DNS, see the [DNS tools article on Technet](https://technet.microsoft.com/library/cc753579.aspx).

## Related Content
* [Azure AD Domain Services - Getting Started guide](create-instance.md)
* [Join a Windows Server virtual machine to an Azure AD Domain Services managed domain](active-directory-ds-admin-guide-join-windows-vm.md)
* [Manage an Azure AD Domain Services domain](manage-domain.md)
* [DNS administration tools](https://technet.microsoft.com/library/cc753579.aspx)
