---
title: Tutorial - Create a management VM for Azure Active Directory Domain Services | Microsoft Docs
description: In this tutorial, you learn how to create and configure a Windows virtual machine that you use to administer Azure Active Directory Domain Services instance.
author: iainfoulds
manager: daveba

ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: tutorial
ms.date: 07/16/2019
ms.author: iainfou

#Customer intent: As an identity administrator, I want to create a management VM and install the required tools to connect to and manage an Azure Active Directory Domain Services instance.
---

# Tutorial: Create a management VM to configure and administer an Azure Active Directory Domain Services managed domain

This tutorial shows you how to create a Windows VM in Azure and install the required tools to administer an Azure AD DS managed domain.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * 

If you don’t have an Azure subscription, [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

To complete this tutorial, you need the following resources and privileges:

* An active Azure subscription.
    * If you don’t have an Azure subscription, [create an account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* An Azure Active Directory tenant associated with your subscription, either synchronized with an on-premises directory or a cloud-only directory.
    * If needed, [create an Azure Active Directory tenant][create-azure-ad-tenant] or [associate an Azure subscription with your account][associate-azure-ad-tenant].
* An Azure Active Directory Domain Services managed domain enabled and configured in your Azure AD tenant.
    * If needed, [create and configure an Azure Active Directory Domain Services instance][create-azure-ad-ds-instance].
* A user account that's a member of the *Azure AD DC administrators* group in your Azure AD tenant.

## Sign in to the Azure portal

In this tutorial, you create and configure a management VM using the Azure portal. To get started, first sign in to the [Azure portal](https://portal.azure.com).

## Available administrative tasks in Azure AD DS

Azure Active Directory Domain Services (Azure AD DS) provides managed domain services such as domain join, group policy, LDAP, Kerberos/NTLM authentication that is fully compatible with Windows Server Active Directory. You consume these domain services without deploying, managing, and patching domain controllers yourself. This approach changes some of the available management tasks you can do, and what privileges you have within the managed domain. These tasks and permissions may be different than what you experience with a regular on-premises Active Directory Domain Services environment. You also can't connect to domain controllers on the Azure AD DS managed domain using Remote Desktop.

### Administrative tasks you can perform on an Azure AD DS managed domain

Members of the *AAD DC Administrators* group are granted privileges on the Azure AD DS managed domain that enable them to do tasks such as:

* Join machines to the managed domain.
* Configure the built-in group policy object (GPO) for the *AADDC Computers* and *AADDC Users* containers in the managed domain.
* Administer DNS on the managed domain.
* Create and administer custom organizational units (OUs) on the managed domain.
* Gain administrative access to computers joined to the managed domain.

### Administrative privileges you don't have on an Azure AD DS managed domain

As Azure AD DS is managed service that provides activities such as patching, monitoring, and taking backups. The Azure AD DS managed domain is locked down and you don't have privileges to do certain administrative tasks on the domain. Some examples of tasks you can't do include the following:

* You don't have *Domain Administrator* or *Enterprise Administrator* privileges for the managed domain.
* You can't extend the schema of the managed domain.
* You can't connect to domain controllers for the managed domain using Remote Desktop.
* You can't add domain controllers to the managed domain.

## Sign in to the Windows Server VM

Let's use the Windows Server VM that was created and joined to the Azure AD DS managed domain in the previous tutorial. If needed, [follow the steps in the tutorial to join a Windows Server VM to a managed domain][create-join-windows-vm].

> [!NOTE]
> In this tutorial, you use a Windows Server VM in Azure that is joined to the Azure AD DS managed domain. You can also use a Windows client, such as Windows 10, that is joined to the managed domain.
>
> For more information on how to install the administrative tools on a Windows client, see [install Remote Server Administration Tools (RSAT)](https://social.technet.microsoft.com/wiki/contents/articles/2202.remote-server-administration-tools-rsat-for-windows-client-and-windows-server-dsforum2wiki.aspx)

To get started, connect to the Windows Server VM as follows:

1. In the Azure portal, select **Resource groups** on the left-hand side. Choose the resource group where your VM was created, such as *myResourceGroup*, then select the VM, such your VM, such as *VM*.
1. In the **Overview** pane of the VM, select **Connect**.

    ![Connect to Windows virtual machine in the Azure portal](./media/join-windows-vm/connect-to-vm.png)

1. Select the option to *Download RDP File*. Save this RDP file in your web browser.
1. To connect to your VM, open the downloaded RDP file. If prompted, select **Connect**.
1. Enter the credentials of a user that's part of the *Azure AD DC administrators* group, such as *dee@contoso100.com*
1. If you see a certificate warning during the sign in process, select **Yes** or **Continue** to connect.

## Install Active Directory administration tools

Azure AD DS managed domains are managed using the administrative tools as on-premises AD DS environments, such as the Active Directory Administrative Center (ADAC) or AD PowerShell. These tools can be installed as part of the Remote Server Administration Tools (RSAT) optional feature on Windows Server and client computers. Members of the *AAD DC Administrators* group can then administer Azure AD DS managed domains remotely using these AD administrative tools from a computer that is joined to the managed domain.

To install the Active Directory Administration tools on a domain-joined VM, complete the following steps:

1. **Server Manager** should open by default when you sign in to the VM. If not, on the **Start** menu, select **Server Manager**.
1. In the *Dashboard* pane of the **Server Manager** window, select **Add Roles and Features**.
1. On the **Before You Begin** page of the *Add Roles and Features Wizard*, select **Next**.
1. For the *Installation Type*, leave the **Role-based or feature-based installation** option checked and select **Next**.
1. On the **Server Selection** page, choose the current VM from the server pool, such as *myvm.contoso100.com*, then select **Next**.
1. On the **Server Roles** page, click **Next**.
1. On the **Features** page, expand the **Remote Server Administration Tools** node, then expand the **Role Administration Tools** node. Choose **AD DS and AD LDS Tools** feature from the list of role administration tools, then select **Next**.

    ![Features page](./media/active-directory-domain-services-admin-guide/install-rsat-server-manager-add-roles-ad-tools.png)

1. On the **Confirmation** page, select **Install** to install the AD and AD LDS tools feature on the virtual machine. It may take a minute or two to install the administrative tools.
1. When feature installation is complete, select **Close** to exit the **Add Roles and Features** wizard.



## Connect to and explore the managed domain

Now, you can use Windows Server AD administrative tools to explore and administer the managed domain. Make sure that you're signed in with a user account that's a member of the *AAD DC Administrators* group.

1. From the Start screen, click **Administrative Tools**. You should see the AD administrative tools installed on the virtual machine.

    ![Administrative Tools installed on server](./media/active-directory-domain-services-admin-guide/install-rsat-admin-tools-installed.png)
2. Click **Active Directory Administrative Center**.

    ![Active Directory Administrative Center](./media/active-directory-domain-services-admin-guide/adac-overview.png)
3. To explore the domain, click the domain name in the left pane (for example, 'contoso100.com'). Notice two containers called 'AADDC Computers' and 'AADDC Users' respectively.

    ![ADAC - view domain](./media/active-directory-domain-services-admin-guide/adac-domain-view.png)
4. Click the container called **AADDC Users** to see all users and groups belonging to the managed domain. You should see user accounts and groups from your Azure AD tenant show up in this container. Notice in this example, a user account for the user called 'bob' and a group called 'AAD DC Administrators' are available in this container.

    ![ADAC - domain users](./media/active-directory-domain-services-admin-guide/adac-aaddc-users.png)
5. Click the container called **AADDC Computers** to see the computers joined to this managed domain. You should see an entry for the current virtual machine, which is joined to the domain. Computer accounts for all computers that are joined to the Azure AD Domain Services managed domain are stored in this 'AADDC Computers' container.

    ![ADAC - domain joined computers](./media/active-directory-domain-services-admin-guide/adac-aaddc-computers.png)

<br>

## Related Content
* [Azure AD Domain Services - Getting Started guide](tutorial-create-instance.md)
* [Join a Windows Server virtual machine to an Azure AD Domain Services managed domain](active-directory-ds-admin-guide-join-windows-vm.md)
* [Deploy Remote Server Administration Tools](https://technet.microsoft.com/library/hh831501.aspx)




## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * 

To safely interact with your Azure AD DS managed domain, enable secure Lightweight Directory Access Protocol (LDAPS).

> [!div class="nextstepaction"]
> [Configure secure LDAP for your managed domain](tutorial-configure-ldaps.md)

<!-- INTERNAL LINKS -->
[create-azure-ad-ds-instance]: tutorial-create-instance.md
[create-join-windows-vm]: join-windows-vm.md
