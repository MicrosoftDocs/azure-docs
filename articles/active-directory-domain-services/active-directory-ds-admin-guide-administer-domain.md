<properties
	pageTitle="Azure Active Directory Domain Services preview: Administration Guide | Microsoft Azure"
	description="Administer Azure Active Directory Domain Services managed domains"
	services="active-directory-ds"
	documentationCenter=""
	authors="mahesh-unnikrishnan"
	manager="stevenpo
	editor="curtand"/>

<tags
	ms.service="active-directory-ds"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/07/2016"
	ms.author="maheshu"/>

# Administer an Azure AD Domain Services managed domain
This article shows you how to administer an Azure Active Directory Domain Services managed domain.

In a managed domain, tenant administrators are not granted Domain Administrator or Enterprise Administrator privileges. The domain itself is managed by Microsoft, including activities such as patching, monitoring, performing backups etc. Members of the 'AAD DC Administrators' group are granted privileges on the managed domain that enable them to perform tasks such as:
- Join machines to the domain.
- Configure the built-in GPO for the Computers and Users containers in the domain.
- Administer DNS on the domain.
- Create custom OUs on the domain.

Azure AD Domain Services managed domains can be managed using familiar Active Directory administrative tools such as the Active Directory Administrative Center (ADAC) or AD PowerShell. Tenant administrators do not have privileges to connect to domain controllers on the managed domain via Remote Desktop. Therefore, members of the 'AAD DC Administrators' group can administer managed domains remotely using AD administrative tools from a Windows Server/client computer that is joined to the managed domain. AD administrative tools can be installed as part of the Remote Server Administration Tools (RSAT) optional feature on Windows Server and client machines joined to the managed domain.

The first step is to set up a Windows Server virtual machine that is joined to the managed domain. For instructions to do this, refer to the article titled [join a virtual machine running Windows Server to an AAD-DS managed domain using the Azure classic portal](active-directory-domain-services-admin-guide-join-windows-vm.md). Note that these instructions use a Windows Server virtual machine in order to administer the AAD-DS managed domain. You can also chose to use a Windows client (eg. Windows 10) virtual machine to do so. In this case, you can install the Remote Server Administration Tools optional feature on the virtual machine.


## Install Active Directory administration tools
Perform the following steps in order to install the Active Directory Administration tools on the domain joined virtual machine. For more [details on installing and using Remote Server Administration Tools](https://technet.microsoft.com/library/hh831501.aspx), refer to TechNet.

1. Navigate to **Virtual Machines** node in the classic portal. Select the virtual machine you just created and click **Connect** on the command bar at the bottom of the window.

    ![Connect to Windows virtual machine](./media/active-directory-domain-services-admin-guide/connect-windows-vm.png)

2. The classic portal will prompt you to open or save a .rdp file, which is used to connect to the virtual machine. Click on the .rdp file when it has finished downloading.

3. At the login prompt, use the credentials of a user belonging to the 'AAD DC Administrators' group. For example 'bob@domainservicespreview.onmicrosoft.com' in our case.

4. From the Start screen, open **Server Manager**. Click on **Add Roles and Features** in the central pane of the Server Manager window.

    ![Launch Server Manager on virtual machine](./media/active-directory-domain-services-admin-guide/install-rsat-server-manager.png)

5. On the **Before You Begin** page of the **Add Roles and Features Wizard**, click **Next**.

    ![Before You Begin page](./media/active-directory-domain-services-admin-guide/install-rsat-server-manager-add-roles-begin.png)

6. On the **Installation Type** page, leave the **Role-based or feature-based installation** option checked and click **Next**.

	![Installation Type page](./media/active-directory-domain-services-admin-guide/install-rsat-server-manager-add-roles-type.png)

7. On the **Server Selection** page, select the current virtual machine from the server pool, and click **Next**.

	![Server Selection page](./media/active-directory-domain-services-admin-guide/install-rsat-server-manager-add-roles-server.png)

8. On the **Server Roles** page, click **Next**. We will skip this page since we are not installing any roles on the server.

9. On the **Features** page, click to expand the **Remote Server Administration Tools** node and then click to expand the **Role Administration Tools** node. Select **AD DS and AD LDS Tools** feature from the list of role administration tools as shown below.

	![Features page](./media/active-directory-domain-services-admin-guide/install-rsat-server-manager-add-roles-ad-tools.png)

10. On the **Confirmation** page, click **Install** in order to install the AD and AD LDS tools feature on the virtual machine. When feature installation completes successfully, click **Close** to exit the **Add Roles and Features** wizard.

	![Confirmation page](./media/active-directory-domain-services-admin-guide/install-rsat-server-manager-add-roles-confirmation.png)


From the Start screen, click on **Administrative Tools**. You should see the AD administrative tools installed on the virtual machine.
	![Administrative Tools installed on server](./media/active-directory-domain-services-admin-guide/install-rsat-admin-tools-installed.png)
