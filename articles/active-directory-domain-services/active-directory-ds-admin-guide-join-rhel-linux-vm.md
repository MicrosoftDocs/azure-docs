<properties
	pageTitle="Azure Active Directory Domain Services preview: Administration Guide | Microsoft Azure"
	description="Join a Red Hat Enterprise Linux virtual machine to Azure AD Domain Services"
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

# Join a Red Hat Enterprise Linux 7 virtual machine to a managed domain
This article shows you how to join a Red Hat Enterprise Linux (RHEL) 7 virtual machine to an Azure AD Domain Services managed domain.

## Provision a Red Hat Enterprise Linux virtual machine
Perform the following steps in order to provision a RHEL 7 virtual machine using the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).

    ![Azure portal dashboard](./media/active-directory-domain-services-admin-guide/rhel-join-azure-portal-dashboard.png)

2. Click **New** on the left hand pane and type **Red Hat** into the search bar as shown in the below screenshot. You should notice entries for Red Hat Enterprise Linux in the search results. Click on **Red Hat Enterprise Linux 7.2**.

    ![Select RHEL in results](./media/active-directory-domain-services-admin-guide/rhel-join-azure-portal-find-rhel-image.png)

3. The search results in the **Everything** pane should list the Red Hat Enterprise Linux 7.2 image. Click on **Red Hat Enterprise Linux 7.2** to view more information about the virtual machine image.

    ![Select RHEL in results](./media/active-directory-domain-services-admin-guide/rhel-join-azure-portal-select-rhel-image.png)

4. In the **Red Hat Enterprise Linux 7.2** pane you should see more information about the virtual machine image. In the **Select a deployment model** dropdown, select **Classic**. Then click the **Create** button.

    ![View image details](./media/active-directory-domain-services-admin-guide/rhel-join-azure-portal-create-clicked.png)

5. In the **Create VM** pane, enter the **Host Name** for the new virtual machine. Also specify a local administrator user name in the **User name** field and a **Password**. You may also chose to use an SSH key for authenticating the local administrator user. Also select a **Pricing Tier** for the virtual machine.

    ![Create VM - basic details](./media/active-directory-domain-services-admin-guide/rhel-join-azure-portal-create-vm-basic-details.png)

6. Click on **Optional Configuration**. This should open up a pane titled **Optional config**. In the **Optional config** pane, click on **Network** as shown in the screenshot below.

    ![Create VM - configure virtual network](./media/active-directory-domain-services-admin-guide/rhel-join-azure-portal-create-vm-configure-vnet.png)

7. This should bring up a pane titled **Network**. In the **Network** pane, click on **Virtual Network** in order to select the virtual network to which the Linux VM should be deployed. This should open the **Virtual Network** pane. In the **Virtual Network** pane, choose the **Use an existing virtual network** option. Then select the virtual network in which Azure AD Domain Services is available. In this example, we pick the 'MyPreviewVNet' virtual network.

    ![Create VM - select virtual network](./media/active-directory-domain-services-admin-guide/rhel-join-azure-portal-create-vm-select-vnet.png)

8. On the **Optional config** pane, click the **OK** button.

    ![Create VM - virtual network selected](./media/active-directory-domain-services-admin-guide/rhel-join-azure-portal-create-vm-vnet-selected.png)

9. You are now ready to create the virtual machine. On the **Create VM** pane, click the **Create** button.

    ![Create VM - ready](./media/active-directory-domain-services-admin-guide/rhel-join-azure-portal-create-vm.png)

10. Deployment of the new virtual machine based on the RHEL 7.2 image should start.

  ![Create VM - deployment started](./media/active-directory-domain-services-admin-guide/rhel-join-azure-portal-create-vm-deployment-started.png)

11. After a few minutes, the virtual machine should be deployed successfully and ready for use.

  ![Create VM - deployed](./media/active-directory-domain-services-admin-guide/rhel-join-azure-portal-create-vm-deployed.png)



## Connect remotely to the newly provisioned Linux virtual machine
The RHEL 7.2 virtual machine has been provisioned in Azure. The next task is to connect remotely to the virtual machine.

**Connect to the RHEL 7.2 virtual machine**
Follow the instructions in the article [How to log on to a virtual machine running Linux](../virtual-machines/virtual-machines-linux-classic-log-on.md).

The rest of the steps below assume you are using PuTTY as the SSH client to connect to the RHEL virtual machine. For more information, see the [PuTTY Download page](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html).

1. Open the PuTTY program.

2. Enter the **Host Name** for the newly created RHEL virtual machine. In this example, our virtual machine has the host name 'contoso-rhel.cloudapp.net'. If you are not sure of the host name of your VM, refer to the VM dashboard on the Azure portal.

    ![PuTTY connect](./media/active-directory-domain-services-admin-guide/rhel-join-azure-portal-putty-connect.png)

3. Log on to the virtual machine using the local administrator credentials you had specified when the virtual machine was created. In this example, we were using the local administrator account 'mahesh'.

    ![PuTTY login](./media/active-directory-domain-services-admin-guide/rhel-join-azure-portal-putty-login.png)


## Install required packages on the Linux virtual machine
After connecting to the virtual machine, the next task is to install packages required for domain join on the virtual machine. Perform the following steps:

1. **Install realmd:** The realmd package is used for domain join. In your PuTTY terminal, type the following command.

    sudo yum install realmd

    ![Install realmd](./media/active-directory-domain-services-admin-guide/rhel-join-azure-portal-putty-install-realmd.png)

    After a few minutes, the realmd package should get installed on the virtual machine.

    ![realmd installed](./media/active-directory-domain-services-admin-guide/rhel-join-azure-portal-putty-realmd-installed.png)

3. **Install sssd:** The realmd package depends on sssd in order to perform domain join operations. In your PuTTY terminal, type the following command.

    sudo yum install sssd

	![Install sssd](./media/active-directory-domain-services-admin-guide/rhel-join-azure-portal-putty-install-sssd.png)

    After a few minutes, the sssd package should get installed on the virtual machine.

    ![realmd installed](./media/active-directory-domain-services-admin-guide/rhel-join-azure-portal-putty-sssd-installed.png)

4. **Install kerberos:** In your PuTTY terminal, type the following command.

    sudo yum install krb5-workstation krb5-libs

	![Install kerberos](./media/active-directory-domain-services-admin-guide/rhel-join-azure-portal-putty-install-kerberos.png)

	After a few minutes, the realmd package should get installed on the virtual machine.

	![Kerberos installed](./media/active-directory-domain-services-admin-guide/rhel-join-azure-portal-putty-kerberos-installed.png)


## Join the Linux virtual machine to the managed domain
Now that the required packages are installed on the Linux virtual machine, the next task is to join the virtual machine to the managed domain.

1. Discover the AAD Domain Services managed domain. In your PuTTY terminal, type the following command.

    sudo realm discover CONTOSO100.COM

	![Realm discover](./media/active-directory-domain-services-admin-guide/rhel-join-azure-portal-putty-realmd-discover.png)

	If **realm discover** is unable to find your managed domain, ensure that the domain is reachable from the virtual machine (try ping). Also ensure that the virtual machine has indeed been deployed to the same virtual network in which the managed domain is available.

2. Initialize kerberos. In your PuTTY terminal, type the following command. Ensure that you specify a user who belongs to the 'AAD DC Administrators' group. Only these users can join computers to the managed domain.

    kinit bob@CONTOSO100.COM

    ![Kinit](./media/active-directory-domain-services-admin-guide/rhel-join-azure-portal-putty-kinit.png)

    Ensure that you specify the domain name in capital letters, else kinit will fail.

3. Join the machine to the domain. In your PuTTY terminal, type the following command. Ensure that you specify the same user as that specified in the step above ('kinit').

    sudo realm join --verbose CONTOSO100.COM -U 'bob@CONTOSO100.COM'

	![Realm join](./media/active-directory-domain-services-admin-guide/rhel-join-azure-portal-putty-realmd-join.png)

You should get a message ("Successfully enrolled machine in realm") when the machine is successfully joined to the managed domain.


## Verify domain join
You can quickly verify whether the machine has been successfully joined to the managed domain. This can be done by connecting to the newly domain joined RHEL VM using ssh and a domain user account and then checking to see if the user account is being resolved correctly.

1. In your PuTTY terminal, type the following command to connect to the newly domain joined RHEL virtual machine using SSH. Use a domain account that belongs to the managed account (eg. 'bob@CONTOSO100.COM' in this case.)

    ssh -l bob@CONTOSO100.COM contoso-rhel.cloudapp.net

2. In your PuTTY terminal, type the following command to see if the user's home directory was initialized correctly.

	pwd

3. In your PuTTY terminal, type the following command to see if the group members of the user are being resolved correctly.

    id

A sample output of these commands is shown below.

![Verify domain join](./media/active-directory-domain-services-admin-guide/rhel-join-azure-portal-putty-verify-domain-join.png)


## Troubleshooting domain join
Refer to the [Troubleshooting domain join](active-directory-ds-admin-guide-join-windows-vm.md#troubleshooting-domain-join) article.


## More information
- [How to Log on to a Virtual Machine Running Linux](../virtual-machines/virtual-machines-linux-classic-log-on.md).
- [Installing Kerberos](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/6/html/Managing_Smart_Cards/installing-kerberos.html)
- [Red Hat Enterprise Linux 7 - Windows Integration Guide](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html/Windows_Integration_Guide/index.html)
