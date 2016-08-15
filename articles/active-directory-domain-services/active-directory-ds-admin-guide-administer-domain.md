<properties
	pageTitle="Azure Active Directory Domain Services preview: Administer a managed domain | Microsoft Azure"
	description="Administer Azure Active Directory Domain Services managed domains"
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
	ms.topic="article"
	ms.date="07/06/2016"
	ms.author="maheshu"/>

# Administer an Azure Active Directory Domain Services managed domain
This article shows you how to administer an Azure Active Directory (AD) Domain Services managed domain.


## Before you begin
To perform the tasks listed in this article, you will need:

1. A valid **Azure subscription**.

2. An **Azure AD directory** - either synchronized with an on-premises directory or a cloud-only directory.

3. **Azure AD Domain Services** must be enabled for the Azure AD directory. If you haven't done so, follow all the tasks outlined in the [Getting Started guide](./active-directory-ds-getting-started.md).

4. A **domain-joined virtual machine** from which you will administer the Azure AD Domain Services managed domain. If you don't have such a virtual machine, follow all the tasks outlined in the article titled [Join a Windows virtual machine to a managed domain](./active-directory-ds-admin-guide-join-windows-vm.md).

5. You will need the credentials of a **user account belonging to the 'AAD DC Administrators' group** in your directory, in order to administer your managed domain.

<br>


## Administrative tasks you can perform on a managed domain
To start with, let's take a look at administrative tasks that you can perform on a managed domain. Members of the 'AAD DC Administrators' group are granted privileges on the managed domain that enable them to perform tasks such as:

- Join machines to the managed domain.

- Configure the built-in GPO for the 'AADDC Computers' and 'AADDC Users' containers in the managed domain.

- Administer DNS on the managed domain.

- Create and administer custom Organizational Units (OUs) on the managed domain.

- Gain administrative access to computers joined to the managed domain.


## Administrative privileges you do not have on a managed domain
The domain is managed by Microsoft, including activities such as patching, monitoring, performing backups etc. Therefore, the domain is locked down and you do not have privileges to perform certain administrative tasks on the domain. Some examples of tasks you cannot perform are below.

- You are not granted Domain Administrator or Enterprise Administrator privileges for the managed domain.

- You cannot extend the schema of the managed domain.

- You cannot connect to domain controllers for the managed domain using Remote Desktop.

- You cannot add domain controllers to the managed domain.


## Task 1 - Provision a domain-joined Windows Server virtual machine to remotely administer the managed domain
Azure AD Domain Services managed domains can be managed using familiar Active Directory administrative tools such as the Active Directory Administrative Center (ADAC) or AD PowerShell. Tenant administrators do not have privileges to connect to domain controllers on the managed domain via Remote Desktop. Therefore, members of the 'AAD DC Administrators' group can administer managed domains remotely using AD administrative tools from a Windows Server/client computer that is joined to the managed domain. AD administrative tools can be installed as part of the Remote Server Administration Tools (RSAT) optional feature on Windows Server and client machines joined to the managed domain.

The first step is to set up a Windows Server virtual machine that is joined to the managed domain. For instructions to do this, refer to the article titled [join a Windows Server virtual machine to an Azure AD Domain Services managed domain](active-directory-ds-admin-guide-join-windows-vm.md).

### Remotely administer the managed domain from a client computer (eg. Windows 10)
Note that the instructions in this article use a Windows Server virtual machine in order to administer the AAD-DS managed domain. However, you can also chose to use a Windows client (eg. Windows 10) virtual machine to do so.

You can [install Remote Server Administration Tools (RSAT)](http://social.technet.microsoft.com/wiki/contents/articles/2202.remote-server-administration-tools-rsat-for-windows-client-and-windows-server-dsforum2wiki.aspx) on a Windows client virtual machine by following the instructions on TechNet.


## Task 2 - Install Active Directory administration tools on the virtual machine
Perform the following steps in order to install the Active Directory Administration tools on the domain joined virtual machine. For more [details on installing and using Remote Server Administration Tools](https://technet.microsoft.com/library/hh831501.aspx), refer to TechNet.

1. Navigate to **Virtual Machines** node in the Azure classic portal. Select the virtual machine you just created and click **Connect** on the command bar at the bottom of the window.

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


## Task 3 - Connect to and explore the managed domain
Now that the AD Administrative Tools are installed on the domain joined virtual machine, we can use these tools to explore and administer the managed domain.

> [AZURE.NOTE] You will need to be a member of the 'AAD DC Administrators' group, in order to administer the managed domain.

1. From the Start screen, click on **Administrative Tools**. You should see the AD administrative tools installed on the virtual machine.

	![Administrative Tools installed on server](./media/active-directory-domain-services-admin-guide/install-rsat-admin-tools-installed.png)

2. Click on **Active Directory Administrative Center**.

	![Active Directory Administrative Center](./media/active-directory-domain-services-admin-guide/adac-overview.png)

3. Click on the domain name in the left pane (eg. 'contoso100.com') to explore the domain. Notice two containers called 'AADDC Computers' and 'AADDC Users' respectively.

    ![ADAC - view domain](./media/active-directory-domain-services-admin-guide/adac-domain-view.png)

4. Click on the container called **AADDC Users** to see all users and groups belonging to the managed domain. You should see user accounts and groups from your Azure AD tenant show up in this container. Notice in this example, a user account for the user 'bob' and a group called 'AAD DC Administrators' are available in this container.

    ![ADAC - domain users](./media/active-directory-domain-services-admin-guide/adac-aaddc-users.png)

5. Click on the container called **AADDC Computers** to see the computers joined to this managed domain. You should see an entry for the current virtual machine, which is joined to the domain. Computer accounts for all computers that are joined to the Azure AD Domain Services managed domain will appear in this 'AADDC Computers' container.

    ![ADAC - domain joined computers](./media/active-directory-domain-services-admin-guide/adac-aaddc-computers.png)

<br>

## Related Content

- [Azure AD Domain Services - Getting Started guide](./active-directory-ds-getting-started.md)

- [Join a Windows Server virtual machine to an Azure AD Domain Services managed domain](active-directory-ds-admin-guide-join-windows-vm.md)

- [Deploy Remote Server Administration Tools](https://technet.microsoft.com/library/hh831501.aspx)
