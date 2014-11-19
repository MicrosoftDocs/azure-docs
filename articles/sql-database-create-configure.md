<properties urlDisplayName="How to create and configure an Azure SQL DB" pageTitle="How to Create and Configure an Azure SQL Database - Azure tutorial" metaKeywords="Create Azure SQL Database, Configure Azure SQL Database" description="How to create and configure an Azure SQL Database." metaCanonical="" services="sql-database" documentationCenter="" title="How to Create and Configure an Azure SQL Database" authors="sidneyh" solutions="" manager="jhubbard" editor="" />

<tags ms.service="sql-database" ms.workload="data-management" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="11/19/2014" ms.author="sidneyh" />

<h1><a id="configLogical"></a>How to Create and Configure an Azure SQL Database</h1>

In this topic, you'll create and configure an Azure SQL database using the Azure Management Portal. In this workflow, you'll create the server first. You might prefer this approach if you have existing SQL Server databases that you want to upload.

##Table of Contents##
* [How to: Create a logical server](#createLogical)
* [How to: Configure the firewall for the logical server](#configFWLogical)

<h2><a id="createLogical"></a>How to: Create a logical server</h2>

1. Sign in to the [Management Portal](http://manage.windowsazure.com).

2. At the bottom of the page, click **NEW**.

	![Click SQL Databases][1]

3. Click **Data Services**, and **SQL Database**, then **Quick Create**.

	![Click New, Data Services, and Quick Create][2]
	 
5. In **SQL database server settings**, select a subscription.

	![Select a subscription][3]

6. In **SQL database server settings**, enter a login name as one word with no spaces. 

	SQL Database uses SQL Authentication over an encrypted connection. A new SQL Server authentication login assigned to the sysadmin fixed server role will be created using the name you provide. 

	The login cannot be an email address, Windows user account, or a Windows Live ID. Neither Claims nor Windows authentication is supported on SQL Database.
	
7. Provide a strong password that is over eight characters, using a combination of upper and lower case values, and a number or symbol.

7. Choose a region. Region determines the geographical location of the server. Regions cannot be easily switched, so choose one that makes sense for this server. Choose a location that is closest to you. Keeping your Azure application and database in the same region saves you on egress bandwidth cost and data latency.

8. Be sure to keep the **Allow Windows Azure Services to access the server** option selected so that you can connect to this database using the Management Portal, storage services, and other services on Azure. 

9. Click the checkmark at the bottom of the page when you are finished.

###Server Name Auto-generated

Notice that you did not specify a server name. SQL Database auto-generates the server name to ensure there are no duplicate DNS entries. The server name is a ten-character alphanumeric string. You cannot change the name of your SQL Database server.

In the next step, you will configure the firewall so that connections from applications running on your network are allowed access.

##How to: Configure the firewall for the logical server

1. In the [Management Portal](http://manage.windowsazure.com), click **SQL Databases**, then click **Servers**

	![Click Servers][4]
2. From the list, click on the server you just created.

2. Click **Configure**.

	![Click Configure][5]

3. In the **allowed ip addresses** section click **ADD TO THE ALLOWED IP ADDRESSES**. This is the IP address that your  router or proxy server is currently listening on. SQL Database detects the IP address used by the current connection and creates a firewall rule to accept connection requests from this device. 
	![Click Add to the allowed IP addresses][6]

	A default name for the rule is generated. Edit the name as you please. 
	

4. When you connect to the database from another computer, you must create a new rule to allow its IP address to connect. Use the Start and End boxes to create a range of IP addresses.

	If client computers use dynamically assigned IP addresses, you can specify a range that is broad enough to include IP addresses assigned to computers in your network. Start with a narrow range, and then expand it only if you need to.

7. Click **Save** at the bottom of the page to complete the step. 

You now have a logical server, a firewall rule that allows inbound connections from your IP address, and an administrator login. 

**Note:** The logical server you just created is virtual and will be dynamically hosted on physical servers in a data center. Deletion of the server is a non-recoverable action. Be sure to backup any databases that you subsequently upload to the server. 


<!--Image references-->
[1]: ./media/sql-database-create-configure/click-new.png
[2]: ./media/sql-database-create-configure/new-data-services-sql-storage-quick-create.png
[3]: ./media/sql-database-create-configure/server-settings.png
[4]: ./media/sql-database-create-configure/click-servers.png
[5]: ./media/sql-database-create-configure/click-configure.png
[6]: ./media/sql-database-create-configure/allowed-ip-addresses.png


