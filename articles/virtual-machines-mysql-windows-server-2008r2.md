<properties 
	pageTitle="Create a virtual machine running MySQL in Azure" 
	description="Create an Azure virtual machine running Windows Server 2012 R2, and then install and configure the MySQL database on it." 
	services="virtual-machines" 
	documentationCenter="" 
	authors="KBDAzure" 
	manager="timlt" 
	editor="tysonn"/>

<tags 
	ms.service="virtual-machines" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="vm-windows" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/20/2015" 
	ms.author="kathydav"/>


# Install MySQL on a virtual machine running Windows Server 2012 R2 in Azure


[MySQL](http://www.mysql.com) is a popular open source, SQL database. Using the [Azure Management Portal](http://manage.windowsazure.com), you can create a virtual machine running Windows Server 2012 R2 from the Image Gallery. You can then install and configure it as a MySQL Server.


This tutorial shows you how to:

- Use the Management Portal to create a virtual machine running Windows Server 2012 R2.

- Install and run the community version of MySQL 5.6.23 as a MySQL Server on the virtual machine.


## Create a virtual machine running Windows Server

[AZURE.INCLUDE [virtual-machines-create-WindowsVM](../includes/virtual-machines-create-WindowsVM.md)]

## Attach a data disk

After the virtual machine is created, you can optionally attach an additional data disk. This is recommended for production workloads and to avoid running out of space on the OS drive (C:), which is currently limited to 127 GB and includes the operating system.

See [How to Attach a Data Disk to a Windows Virtual Machine](storage-windows-attach-disk.md) and follow the instructions for attaching an empty disk. Set the host cache setting to **None** or **Read-only**.

## Log on to the virtual machine

Next, you'll log on to the virtual machine so you can install MySQL.

[AZURE.INCLUDE [virtual-machines-log-on-win-server](../includes/virtual-machines-log-on-win-server.md)]
 
##Install and run MySQL Community Server on the virtual machine

Follow these steps to install, configure, and run the Community version of MySQL Server:

> [AZURE.NOTE] These steps are for the 5.6.23.0 Community version of MySQL and Windows Server 2012 R2. Your experience might be different for different versions of MySQL or Windows Server.

1.	After you've connected to the virtual machine using Remote Desktop, click **Internet Explorer** from the start screen.
2.	Select the **Tools** button in the upper right corner (the cogged wheel icon), and then click **Internet Options**. Click the **Security** tab, click the **Trusted Sites** icon, and then click the **Sites** button. Add **http://*.mysql.com** to the list of trusted sites. Click **Close**, and then click **OK**.
3.	In the address bar of Internet Explorer, type **http://dev.mysql.com/downloads/mysql/**.
4.	Use the MySQL site to locate and download the latest version of the MySQL Installer for Windows. When choosing the MySQL Installer, download the version that has the complete file set (for example, the mysql-installer-community-5.6.23.0.msi with a file size of 282.4 MB), and save the installer file to the Windows desktop.
5.	From the desktop, double-click the installer file to begin installation.
6.	On the **License Agreement** page, accept the license agreement and click **Next**.
7.	On the **Choosing a Setup Type** page, click the setup type that you want, and then click **Next**. The following steps assume the selection of the **Server only** setup type.
8.	On the **Installation** page, click **Execute**. When installation is complete, click **Next**.
9.	On the **Product Configuration** page, click **Next**.
10.	On the **Type and Networking** page, specify your desired configuration type and connectivity options, including the TCP port if needed. Click **Show Advanced Options**, and then click **Next**.

	![](./media/virtual-machines-mysql-windows-server-2008r2/MySQL_TypeNetworking.png)
 
11.	On the **Accounts and Roles** page, specify a strong MySQL root password. Add additional MySQL user accounts as needed, and then click **Next**.

	![](./media/virtual-machines-mysql-windows-server-2008r2/MySQL_AccountsRoles_Filled.png)
 
12.	On the **Windows Service** page, specify changes to the default settings for running the MySQL Server as a Windows service as needed, and then click **Next**.

	![](./media/virtual-machines-mysql-windows-server-2008r2/MySQL_WindowsService.png)
 
13.	On the **Advanced Options** page, specify changes to logging options as needed, and then click **Next**.

	![](./media/virtual-machines-mysql-windows-server-2008r2/MySQL_AdvOptions.png)
 
14.	On the **Apply Server Configuration** page, click **Execute**. When the configuration steps are complete, click **Finish**.
15.	On the **Product Configuration** page, click **Next**.
16.	On the **Installation Complete** page, click **Copy Log to Clipboard** if you want to examine it later, and then click **Finish**.
17.	From the start screen, type **mysql**, and then click **MySQL 5.6 Command Line Client**.
18.	Enter the root password that you specified in step 11 and you'll be presented with a prompt where you can issue commands to configure MySQL. For the details of commands and syntax, see [MySQL Reference Manuals](http://dev.mysql.com/doc/refman/5.6/en/server-configuration-defaults.html).

	![](./media/virtual-machines-mysql-windows-server-2008r2/MySQL_CommandPrompt.png)
 
19.	You can also configure server configuration default settings, such as the base and data directories and drives, with entries in the **C:\Program Files (x86)\MySQL\MySQL Server 5.6\my-default.ini** file. For more information, see [5.1.2 Server Configuration Defaults](http://dev.mysql.com/doc/refman/5.6/en/server-configuration-defaults.html).


If you want the MySQL Server service to be available to MySQL client computers on the Internet, you must configure an endpoint for the TCP port on which the MySQL Server service is listening and create an additional Windows Firewall rule. This is TCP port 3306 unless you specified a different port on the Type and Networking page (step 10 of the previous procedure). 


> [AZURE.NOTE] You should carefully consider the security implications of doing this, because this will make the MySQL Server service available to all computers on the Internet. You can define the set of source IP addresses that are allowed to use the endpoint with an Access Control List (ACL). For more information, see [How to Set Up Endpoints to a Virtual Machine](virtual-machines-set-up-endpoints.md).


To configure an endpoint for the MySQL Server service:

1.	In the Azure Management Portal, click **Virtual Machines**, click the name of your MySQL virtual machine, and then click **Endpoints**.
2.	In the command bar, click **Add**.
3.	On the **Add an endpoint to a virtual machine** page, click the right arrow.
4.	If you are using the default MySQL TCP port of 3306, click **MySQL** in **Name**, and then click the check mark.
5.	If you are using a different TCP port, type a unique name in **Name**. Select **TCP** in protocol, type the port number in both **Public Port** and **Private Port**, and then click the check mark.

To add a Windows Firewall rule that allows MySQL traffic from the Internet, run this command at an administrator-level Windows PowerShell command prompt on the MySQL server computer.

	New-NetFirewallRule -DisplayName "MySQL56" -Direction Inbound –Protocol TCP –LocalPort 3306 -Action Allow -Profile Public

To test your remote connection to the MySQL Server service running on the Azure virtual machine, you must first determine the DNS name corresponding to the cloud service that contains the virtual machine running MySQL Server. 

1.	In the Azure Management Portal, click **Virtual Machines**, click the name of your MySQL server virtual machine, and then click **Dashboard**.
2.	From the virtual machine dashboard, note the **DNS Name** value under the **Quick Glance** section. Here is an example: 

	![](./media/virtual-machines-mysql-windows-server-2008r2/MySQL_DNSName.png)
 
3.	From a local computer running MySQL or the MySQL client, run this command to log in as a MySQL user:

		mysql -u <yourMysqlUsername> -p -h <yourDNSname>
	
	For example, for the MySQL user name **dbadmin3** and the **testmysql.cloudapp.net** DNS name for the virtual machine, this is the command:

		mysql -u dbadmin3 -p -h testmysql.cloudapp.net


## Resources

For information on MySQL, see the [MySQL Documentation](http://dev.mysql.com/doc/).


