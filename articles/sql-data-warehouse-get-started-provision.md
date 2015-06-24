<properties
   pageTitle="get-started-provision"
   description="Article description that will be displayed on landing pages and in some search results"
   services="sql-data-warehouse"
   documentationCenter="dev-center-name"
   authors="jrowlandjones"
   manager="barbkess"
   editor="barbkess"/>

<tags
   ms.service="required"
   ms.devlang="may be required"
   ms.topic="article"
   ms.tgt_pltfrm="may be required"
   ms.workload="required"
   ms.date="mm/dd/yyyy"
   ms.author="JRJ@BigBangData.co.uk"/>

# Get Started: Provisioning a SQL Data Warehouse #

This article is an accelerated guide to help you provision a SQL Data Warehouse (SQLDW) in Azure.

When complete you will have completed the following tasks:
1. Created a new SQL Data Warehouse database
2. Configured a new logical server
3. Installed the AdventureWorksDW data model into the database
4. Set an Azure firewall rule to enable external client access

## Azure Free Trial ##
You will need to have an Azure subscription to complete the tasks below. If you do not already have access to an Azure subscription then resolving this is actually your first step!

You can get access to a <a href="http://azure.microsoft.com/en-us/pricing/free-trial/" target="\_blank">free trial</a> that allows you to try any of the services in Azure, including SQLDW.

Come back as soon as you have signed up and we can get on with the business of creating your first SQLDW in Azure.

## Login to the Azure Portal ##

Your SQLDW journey begins when you <a href="https://portal.axure.com/" target="\_blank">login to the portal</a>.

Go ahead and sign in now.

After you have successfully logged in your screen should look like the one below.

![][1]

In this next series of steps we will quickly spin up a brand new logical server and create a new SQL Data Warehouse database with the AdventureWorksDW data model pre-installed and pre-populated with data.

## Locate the SQLDW Service ##

The first thing we have to do is locate the SQLDW service in the Azure Portal.

In the bottom left hand corner of the Azure Portal is the new button.

![][2]

The new button is the starting point for creating any new service within Azure.

Click on the new button now.

### Data + Storage ###

Clicking on the new button has opened up all the service categories within Azure.

![][3]

SQLDW lives in the "Data + Storage" category.

Click on "Data + Storage" to drill in and see the services offered by Azure for this category.

### SQL Data Warehouse ###

As you can see Azure offers lots of data and storage engines.

![][4]

However, this getting started guide is for SQLDW.

Go ahead and select SQL Data Warehouse.

## Configure SQL Data Warehouse ##

To complete the provisioning process all that is left to do is configure SQLDW

![][5]

### Database Name ###

The first configuration is to name the SQLDW database.

For this quick start name the database "AdventureWorksDW".
![][6]

> [AZURE.NOTE] When you create your own database you can of course name it as you wish. It does need to conform to the basic naming requirements of Azure however. Learn more about Azure [naming conventions and requirements].

### Performance ###

The performance option is an **important** one. SQLDW provides its scalable power via this slider. You can increase or decrease your performance at any time - not just when you configure the cluster. The further you slide to the right the greater the resources at your disposal. If those resources are no longer needed then you can immediately move the slider back; saving on cost. SQLDW lets you change your performance profile on demand without having to re-create the cluster or move data.

![][7]

Use the slider now to see how the data warehouse units increase as you slide to the right and decrease as you move back to the left.

Before leaving this step make sure you have returned the slider back to the left. AdventureWorksDW is just a small data warehouse so we don't need too much; save your resources for the rest of your trial!

### Select Source ###

This option gives the choice of starting with an empty database or pre-populated with AdventureWorksDW.

![][8]

Choose AdventureworksDW as the starting point. This gives you a schema and some sample data to play with as a starting point.

> [AZURE.NOTE] A third option is also available. It is also permissible to create the database from a pre-existing restore point; a restore option. Learn more about restore points in the management article on [backup and restore].

### Logical Server ###

Your SQLDW database resides on a logical server. The logical server brings consistency of configuration at an instance level for a number of databases and locates the service to an Azure data center.

![][9]

The options that need to be set are:
1. Server Name
2. Server Admin Name
3. Password
4. Data Center Location
5. Permission for Azure services to access the server

Feel free to set these values as you see fit. The Server name has to be unique. It's a good idea to pick a datacenter that is close to you to reduce network latency. SQLDW also contains powerful features that leverage Azure's other services. It is therefore a good idea to leave the checkbox enabled for Azure services access.

> [AZURE.NOTE] SQLDW must use a V12 Server. Ensure that this option is set to YES. The logical server can also be shared by Azure SQL Databases (SQLDB) and SQLDW databases. However, it must be a V12 Server.

> [AZURE.NOTE] Record the server name, server admin name and password somewhere and keep them safe. You will need this information to connect to the SQLDW database.

### Resource Group ###
Resource groups are containers; designed to help you manage a collection of Azure resources.

![][10]

For this quick start it is ok to leave Resource Group configured on its default values.

Learn more about [resource groups]

### Subscription ###
A single user could have one or more Azure subscriptions. If you have more than one subscription associated with your login then you can choose which subscription to use.

![][11]

However, for the purposes of this guide, the default should be fine.

Let's go and create the SQL Data Warehouse!

## Create your Data Warehouse ##
All that is left to do to create the warehouse is to click on the create button below:

![][12]

Congratulations! You have created your first SQL Data Warehouse database.

You should now be returned to the Azure portal home page. Notice that the SQLDW database has been added to the page

![][13]

At this point no-one can access the SQLDW database. To keep everything secure by default the database has not yet been configured for clients to access it.

Therefore the last step in the provisioning process is to configure the service for external access.

## Configure the Azure firewall ##

To configure the Azure firewall for the first time take the following steps:

1. Click on Browse in the left hand navigation

    ![][14]

2. Choose SQL Servers

    ![][15]
3. Select your logical SQL Server

    ![][16]
4. Pick settings

    ![][17]
5. Click on firewall

    ![][18]
6. Set your firewall Rule

    There are a couple of things for you to do here. They are:
    - Name your firewall rule
    - Provide an IP range if you do not have a static IP address

    ![][19]

    > [AZURE.NOTE] The client IP address range you need to include is your external or publicly facing IP address.To find your external IP address you can use a number of websites such as <a href="http://www.whatismyip.com" target="\_blank">www.whatismyip.com</a>

7. Save your firewall rule

    ![][20]

Now that you have configured the firewall you will be able to make connections from your desktop to the Azure SQL Data Warehouse you just created.

## Next steps

Now the SQLDW Service has been successfully provisioned we can move on to learn how to use it.

The next steps are therefore to learn how to:
1. [Connect and query] the SQLDW database
2. Export data from the SQLDW database to Azure Blob Storage
3. Load more data into the SQLDW database

<!--Image references-->
[1]: /media/sql-dw-get-started-provision/Azure.Portal.Home.png
[2]: /media/sql-dw-get-started-provision/Azure.Portal.Home.New.Focus.png
[3]: /media/sql-dw-get-started-provision/Azure.Portal.Create.Data.Storage.Focus.png
[4]: /media/sql-dw-get-started-provision/Azure.Portal.DataStorage.SQLDW.png
[5]: /media/sql-dw-get-started-provision/Azure.Portal.SQLDW.Config.png
[6]: /media/sql-dw-get-started-provision/Azure.Portal.SQLDW.Config.DBName.png
[7]: /media/sql-dw-get-started-provision/Azure.Portal.SQLDW.Config.DWU.png
[8]: /media/sql-dw-get-started-provision/.png
[9]: /media/sql-dw-get-started-provision/.png
[10]: /media/sql-dw-get-started-provision/.png
[11]: /media/sql-dw-get-started-provision/.png
[12]: /media/sql-dw-get-started-provision/.png
[13]: /media/sql-dw-get-started-provision/.png
[14]: /media/sql-dw-get-started-provision/.png
[15]: /media/sql-dw-get-started-provision/.png
[16]: /media/sql-dw-get-started-provision/.png
[17]: /media/sql-dw-get-started-provision/.png
[18]: /media/sql-dw-get-started-provision/.png
[19]: /media/sql-dw-get-started-provision/.png
[20]: /media/sql-dw-get-started-provision/.png

<!--External links-->
[backup and restore]: (..\sql-dw-manage-backup-restore)
[connect and query]: (..\sql-dw-get-started-connect-query)
[resource groups]: (.\azure-preview-portal-using-resource-groups\)
