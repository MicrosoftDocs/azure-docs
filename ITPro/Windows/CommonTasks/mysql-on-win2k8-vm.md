<properties linkid="manage-windows-common-tasks-install-mysql" urlDisplayName="Install MySQL" pageTitle="Create a virtual machine running MySQL in Windows Azure " metaKeywords="Azure virtual machines, Azure Windows Server, Azure installing MySQL, Azure configuring MySQL, Azure databases" metaDescription="Create a Windows Azure virtual machine running Windows Server 2008 R2, and then install and configure a MySQL database on the virtual machine." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />


#Install MySQL on a virtual machine running Windows Server 2008 R2 in Windows Azure

<div chunk="../../Shared/Chunks/disclaimer.md" />

[MySQL](http://www.mysql.com) is a popular open source, SQL database. Using the [Windows Azure (Preview) Management Portal][AzurePreviewPortal], you can create a virtual machine running Windows Server 2008 R2 from the Image Gallery.  You can then install and configure a MySQL database on the virtual machine.

In this tutorial, you will learn:

- How to use the Preview Management Portal to create a virtual machine running Windows Server 2008 R2.

- How to install and run MySQL Community Server on the virtual machine.

## Sign up for the Virtual Machines preview feature

You will need to sign up for the Windows Azure Virtual Machines preview feature in order to create a virtual machine. You can also sign up for a free trial account if you do not have a Windows Azure account.

<div chunk="../../../DevCenter/Shared/Chunks/antares-iaas-signup-iaas.md"/>

##Create a virtual machine running Windows Server 2008 R2

<div chunk="../../../Shared/Chunks/create-and-configure-windows-server-2008-vm-in-portal.md" />

##Attach a data disk

<div chunk="../../../shared/chunks/attach-data-disk-windows-server-2008-vm-in-portal.md" />

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

	![MySQL Setup][MySQLInstall1]

9. Accept the license agreement and click **Next**.

	![MySQL Setup][MySQLInstall2]

10. Click **Typical** to install common features.

	![MySQL Setup][MySQLInstall3]

11. Click **Install**.

	![MySQL Setup][MySQLInstall4]

12. Start the MySQL Configuration Wizard and click **Next**.

	![Configure MySQL][MySQLConfig1]

13. Select **Detailed Configuration** and click Next.

	![Configure MySQL][MySQLConfig2]

14. Select **Server Machine** if you plan to run MySQL along with other applications on the server, or the select option that best fits your needs.  Click **Next**.

	![Configure MySQL][MySQLConfig3]

15. Select **Multifunctional Database**, or the select option that best fits your needs.  Click **Next**.

	![Configure MySQL][MySQLConfig4]

16. Select the data drive you attached in the steps above.

	![Configure MySQL][MySQLConfig5]

17. Select **Decision Support (DSS)/OLAP**, or the select option that best fits your needs.  Click **Next**.

	![Configure MySQL][MySQLConfig6]

18. Select **Enable TCP/IP Networking** and **Add firewall exception for this port** (this will create an inbound rule in Windows Firewall named **MySQL Server**).

	![Configure MySQL][MySQLConfig7]

19. Select **Best Support For Multilingualism** if you need to store text in many different languages, or the select option that best fits your needs.  Click **Next**.

	![Configure MySQL][MySQLConfig8]

20. Select **Install As Windows Service** and **Launch the MySQL Server automatically**.  Also select **Include Bin Directory in Windows PATH**. Click **Next**.

	![Configure MySQL][MySQLConfig9]

21. Enter the root password. Do not check **Enable root access from remote machines** or **Create An Anonymous Account**.  Click **Next**.

	![Configure MySQL][MySQLConfig10]

22. Click **Execute** and wait for configuration to complete.

	![Configure MySQL][MySQLConfig11]

23. Click **Finish**.

	![Configure MySQL][MySQLConfig12]

24. Click **Start** and select **MySQL 5.x Command Line Client** to start the command line client.

25.  Enter the root password at the prompt (which you set in a previous step) and you'll be presented with a prompt where you can issue SQL statements to interact with the database.

26. To create a new MySQL user, run the following at the **mysql>** prompt:

		mysql> CREATE USER 'mysqluser'@'localhost' IDENTIFIED BY 'password';

	Note, the semi-colons (;) at the end of the lines are crucial for ending the commands.

27. To create a database and grant the `mysqluser` user permissions on it, issue the following commands:

		mysql> CREATE DATABASE testdatabase;
		mysql> GRANT ALL ON testdatabase.* TO 'mysqluser'@'localhost' IDENTIFIED BY 'password';

	Note that database user names and passwords are only used by scripts connecting to the database.  Database user account names do not necessarily represent actual user accounts on the computer.

28. To login from another computer, execute the following:

		mysql> GRANT ALL ON testdatabase.* TO 'mysqluser'@'<ip-address>' IDENTIFIED BY 'password';

	where `ip-address` is the IP address of the computer from which you will connect to MySQL.
	
29. To exit the MySQL command line client, issue the following command:

		quit

30. Once MySQL is installed you must configure an endpoint so that MySQL can be accessed remotely. Log in to the [Windows Azure Management Portal][AzurePreviewPortal]. In the Windows Azure portal, click **Virtual Machines**, then the name of your new VM, then **Endpoints**, and then  **Add Endpoint**.

	![Endpoints][AddEndPoint]

31. Select **Add Endpoint** and click arrow to continue.
	![Endpoints][AddEndPoint2]

32. Add an endpoint with name "MySQL", protocol **TCP**, and both **Public** and **Private** ports set to "3306". Click the check mark. This will allow MySQL to be accessed remotely.
	![Endpoints][AddEndPoint3]

33. You can remotely connect to MySQL running on your virtual machine in Windows Azure.  From a local computer running MySQL, run the following command to log in as the **mysqluser** user you created in the steps above:

		mysql -u mysqluser -p -h <yourservicename>.cloudapp.net

	For example, using the virtual machine created in this tutorial, the command would be:

		mysql -u mysqluser -p -h testwinvm.cloudapp.net

##Summary

In this tutorial you learned how to create a Windows 2008 R2 virtual machine and remotely connect to it. You also learned how to install and configure MySQL on the virtual machine, create a database and a new MySQL user. For more information on MySQL, see the [MySQL Documentation](http://dev.mysql.com/doc/).

[AzurePreviewPortal]: http://manage.windowsazure.com
[MySQLDownloads]: http://www.mysql.com/downloads/mysql/
[MySQLDocs]: http://dev.mysql.com/doc/

[MySQLInstall1]: ../media/MySQLInstall1.png
[MySQLInstall2]: ../media/MySQLInstall2.png
[MySQLInstall3]: ../media/MySQLInstall3.png
[MySQLInstall4]: ../media/MySQLInstall4.png
[MySQLConfig1]: ../media/MySQLConfig1.png
[MySQLConfig2]: ../media/MySQLConfig2.png
[MySQLConfig3]: ../media/MySQLConfig3.png
[MySQLConfig4]: ../media/MySQLConfig4.png
[MySQLConfig5]: ../media/MySQLConfig5.png
[MySQLConfig6]: ../media/MySQLConfig6.png
[MySQLConfig7]: ../media/MySQLConfig7.png
[MySQLConfig8]: ../media/MySQLConfig8.png
[MySQLConfig9]: ../media/MySQLConfig9.png
[MySQLConfig10]: ../media/MySQLConfig10.png
[MySQLConfig11]: ../media/MySQLConfig11.png
[MySQLConfig12]: ../media/MySQLConfig12.png
[AddEndPoint]: ../media/WinVMAddEndpointMySQL0.png
[AddEndPoint2]: ../media/WinVMAddEndpointMySQL1.png
[AddEndPoint3]: ../media/WinVMAddEndpointMySQL.png