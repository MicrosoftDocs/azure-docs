<properties urlDisplayName="Install MySQL" pageTitle="Create a virtual machine running MySQL in Azure" metaKeywords="Azure virtual machines, Azure Windows Server, Azure installing MySQL, Azure configuring MySQL, Azure databases" description="Create an Azure virtual machine running Windows Server 2008 R2, and then install and configure a MySQL database on the virtual machine." metaCanonical="" services="virtual-machines" documentationCenter="" title="" authors="KBDAzure" solutions="" manager="timlt" editor="tysonn"/>

<tags ms.service="virtual-machines" ms.workload="infrastructure-services" ms.tgt_pltfrm="vm-windows" ms.devlang="na" ms.topic="article" ms.date="10/23/2014" ms.author="kathydav" />


#Install MySQL on a virtual machine running Windows Server 2008 R2 in Azure

[MySQL](http://www.mysql.com) is a popular open source, SQL database. Using the [Azure Management Portal][AzurePreviewPortal], you can create a virtual machine running Windows Server 2008 R2 from the Image Gallery. You can then install and configure a MySQL database on the virtual machine.

This tutorial shows you how to:

- Use the Management Portal to create a virtual machine running Windows Server 2008 R2.

- Install and run MySQL Community Server on the virtual machine.

##Create a virtual machine running Windows Server

[AZURE.INCLUDE [virtual-machines-create-WindowsVM](../includes/virtual-machines-create-WindowsVM.md)]

##Attach a data disk

After the virtual machine is created, attach a data disk. This disk provides data storage you'll need when you install MySQL. See [How to Attach a Data Disk to a Windows Virtual Machine](http://azure.microsoft.com/en-us/documentation/articles/storage-windows-attach-disk/) and follow the instructions for attaching an empty disk.

##Log on to the virtual machine
Next, you'll log on to the virtual machine so you can install MySQL.

[AZURE.INCLUDE [virtual-machines-log-on-win-server](../includes/virtual-machines-log-on-win-server.md)]

##Install and run MySQL Community Server on the virtual machine
Follow these steps to install, configure, and run MySQL Community Server:

1. After you've connected to the virtual machine using Remote Desktop, open **Internet Explorer** from the **Start** menu. 

2. Select the **Tools** button in the upper right corner. In **Internet Options**, select the **Security** tab, and then select the **Trusted Sites** icon, and finally click the **Sites** button. Add *http://\*.mysql.com* to the list of trusted sites.

3. Go to [Download MySQL Community Server][MySQLDownloads].

4. Select **Microsoft Windows** in the **Platform** drop down menu and click **Select**.

5. Find the most recent release of **Windows (x86, 64-bit), MSI Installer** and click **Download**. 

6. Select **No thanks, just start my download!** (or, register for an account).  If prompted, select a mirror site to download the MySQL installer and save the installer to the desktop.

7. Double-click the installer file on the desktop to begin installation.

8. Click **Next**.

9. Accept the license agreement and click **Next**.

10. Click **Typical** to install common features.

11. Click **Install**.

12. Start the MySQL Configuration Wizard and click **Next**.

13. Select **Detailed Configuration** and click Next.

14. Select **Server Machine** if you plan to run MySQL along with other applications on the server, or the select option that best fits your needs.  Click **Next**.

15. Select **Multifunctional Database**, or the select option that best fits your needs.  Click **Next**.

16. Select the data drive you attached in the previous section.

	![Configure MySQL][MySQLConfig5]

17. Select **Decision Support (DSS)/OLAP**, or the select option that best fits your needs.  Click **Next**.

18. Select **Enable TCP/IP Networking** and **Add firewall exception for this port** (this will create an inbound rule in Windows Firewall named **MySQL Server**).

	![Configure MySQL][MySQLConfig7]

19. If you need to store text in many different language, select **Best Support For Multilingualism**. Otherwise, choose one of the other options.  Click **Next**.

	![Configure MySQL][MySQLConfig8]

20. Select **Install As Windows Service** and **Launch the MySQL Server automatically**.  Also select **Include Bin Directory in Windows PATH**. Click **Next**.

	![Configure MySQL][MySQLConfig9]

21. Enter the root password. Do not check **Enable root access from remote machines** or **Create An Anonymous Account**.  Click **Next**.

	![Configure MySQL][MySQLConfig10]

22. Click **Execute** and wait for configuration to complete.

23. Click **Finish**.

24. Click **Start** and select **MySQL 5.x Command Line Client** to start the command line client.

25.  Enter the root password at the prompt (which you set in a previous step) and you'll be presented with a prompt where you can issue SQL statements to interact with the database.

26. To create a new MySQL user, run the following at the **mysql>** prompt:

		mysql> CREATE USER 'mysqluser'@'localhost' IDENTIFIED BY 'password';

	The semi-colons (;) at the end of the lines are required for ending the commands.

27. To create a database and grant the `mysqluser` user permissions on it, run the following commands:

		mysql> CREATE DATABASE testdatabase;
		mysql> GRANT ALL ON testdatabase.* TO 'mysqluser'@'localhost' IDENTIFIED BY 'password';

	Note that database user names and passwords are only used by scripts connecting to the database.  Database user account names do not necessarily represent actual user accounts on the computer.

28. To log in from another computer, run the following command:

		mysql> GRANT ALL ON testdatabase.* TO 'mysqluser'@'<ip-address>' IDENTIFIED BY 'password';

	where `ip-address` is the IP address of the computer from which you will connect to MySQL.
	
29. To exit the MySQL command line client, run the following command:

		quit

30. After MySQL is installed, configure an endpoint so that MySQL can be accessed remotely. Log in to the [Azure Management Portal][AzurePreviewPortal]. In the Azure portal, click **Virtual Machines**, then the name of your new virtual machine, then **Endpoints**, and then  **Add Endpoint**.

31. Select **Add Endpoint** and click arrow to continue.
	

32. Add an endpoint with name "MySQL", protocol **TCP**, and both **Public** and **Private** ports set to "3306". Click the check mark. This allows you to access MySQL remotely.
	

33. Test your remote connection to MySQL.  From a local computer running MySQL, run a command similar to the following to log in as the **mysqluser** user:

		mysql -u mysqluser -p -h <yourservicename>.cloudapp.net

	For example, if you named the virtual machine "testwinvm", run this command:

		mysql -u mysqluser -p -h testwinvm.cloudapp.net

##Resources
For information on MySQL, see the [MySQL Documentation](http://dev.mysql.com/doc/).

[AzurePortal]: http://manage.windowsazure.com
[MySQLDownloads]: http://www.mysql.com/downloads/mysql/


[MySQLConfig5]: ./media/virtual-machines-mysql-windows-server-2008r2/MySQLConfig5.png
[MySQLConfig7]: ./media/virtual-machines-mysql-windows-server-2008r2/MySQLConfig7.png
[MySQLConfig8]: ./media/virtual-machines-mysql-windows-server-2008r2/MySQLConfig8.png
[MySQLConfig9]: ./media/virtual-machines-mysql-windows-server-2008r2/MySQLConfig9.png
[MySQLConfig10]: ./media/virtual-machines-mysql-windows-server-2008r2/MySQLConfig10.png

