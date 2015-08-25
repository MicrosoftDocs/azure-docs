<properties
   pageTitle="Get started: Provision a SQL Data Warehouse | Microsoft Azure"
   description="Provision a SQL Data Warehouse by following these steps and guidelines."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="jrowlandjones"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="hero-article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/23/2015"
   ms.author="JRJ@BigBangData.co.uk;barbkess"/>

# Get started: Provision a SQL Data Warehouse #

This article is an accelerated guide to help you provision a SQL Data Warehouse in Azure. By following this guide, you will perform these tasks:

1. Create a new SQL Data Warehouse database.
2. Configure a new logical server.
3. Set an Azure firewall rule to enable external client access.

## Azure free trial ##
You will need to have an Azure subscription to complete the following tasks. If you do not already have access to an Azure subscription then resolving this is actually your first step!

You can get access to a [free trial][] that allows you to try any of the services in Azure, including SQL Data Warehouse.


## Log in to the Azure portal ##

Once you have a subscription you can log in to the [Azure portal][]. Go ahead and sign in now.

In this next series of steps we will quickly spin up a brand new logical server and create a new SQL Data Warehouse database.

## Locate the SQL Data Warehouse service

The first thing we have to do is locate the SQL Data Warehouse service in the Azure portal.

In the bottom left corner of the Azure Portal is the new button. The new button is the starting point for creating any new service within Azure.

- Click the new button now.

### Data + Storage

Clicking the new button has opened up all the service categories within Azure. SQL Data Warehouse lives in the "Data + Storage" category.

- Click **Data + Storage** to drill in and see the services offered by Azure for this category.

### SQL Data Warehouse

As you can see Azure offers lots of data and storage engines. However, this getting started guide is for SQL Data Warehouse.

- Go ahead and select **SQL Data Warehouse**.

## Configure SQL Data Warehouse

To complete the provisioning process simply configure SQL Data Warehouse.


### Database name

The first configuration is to name the database.



- For this quick start, name the database "MySQLDW".


> [AZURE.NOTE] When you create your own database you can of course name it as you wish. However, it does need to conform to the basic naming requirements of Azure.

### Performance

The performance option is an *important* one. SQL Data Warehouse provides scalable power via this slider. You can increase or decrease your performance at any time - not just when you configure the data warehouse. The further you slide to the right the greater the resources at your disposal. If those resources are no longer needed then you can immediately move the slider back; saving on cost. SQL Data Warehouse lets you change your performance profile on demand without having to re-create the data warehouse or move data.

- Use the slider now to see how the data warehouse units increase as you slide to the right and decrease as you move back to the left.

- Before leaving this step make sure you have returned the slider back to the left. Your new data warehouse is small,  so we don't need too much; save your resources for the rest of your trial!

### Select source

This option gives the choice of starting with an empty database. Choose your new database as the starting point.

> [AZURE.NOTE] A second option is also available. It is also permissible to create the database from a pre-existing restore point; a restore option.

### Logical server

Your new SQL Data Warehouse database resides on a logical server. The logical server brings consistency of configuration for a number of databases and locates the service to an Azure data center.

The options that need to be set are:
1. Server Name
2. Server Admin Name
3. Password
4. Data Center Location
5. Permission for Azure services to access the server

Feel free to set these values as you see fit. The Server name has to be unique. It's a good idea to pick a data center that is close to you to reduce network latency. SQL Data Warehouse also contains powerful features that leverage Azure's other services. It is therefore a good idea to leave the check box enabled for Azure services access.

> [AZURE.NOTE] SQL Data Warehouse must use a V12 Server. Ensure that this option is set to YES. The logical server can also be shared by Azure SQL Databases and SQL Data Warehouse databases. However, it must be a V12 Server.

> [AZURE.NOTE] Record the server name, server admin name and password somewhere and keep them safe. You will need this information to connect to the SQL Data Warehouse database.

### Resource group
Resource groups are containers designed to help you manage a collection of Azure resources.

For this quick start it is ok to leave resource group configured on its default values.

Learn more about [resource groups](../azure-portal/resource-group-portal.md).

### Subscription
A single user could have one or more Azure subscriptions. If you have more than one subscription associated with your login then you can choose which subscription to use.

However, for the purposes of this guide, the default should be fine.

Let's go and create the SQL Data Warehouse!

## Create your data warehouse ##
All that is left for creating your data warehouse is to click the create button.

Congratulations! You have created your first SQL Data Warehouse database.

You should now be returned to the [Azure portal][]. Notice that your SQL Data Warehouse database has been added to the page.


At this point no-one can access the SQL Data Warehouse database. To keep everything secure by default the database has not yet been configured for clients to access it.

Therefore the last step in the provisioning process is to configure the service for external access.

## Configure the Azure firewall ##

To configure the Azure firewall for the first time:

1. Click **Browse** in the left navigation blade.

2. Choose **SQL Servers**.

3. Select your logical SQL Server.

4. Choose settings.

5. Click **Firewall**.

6. Set your firewall rule.

    There are a couple of things for you to do here. They are:
    - Name your firewall rule.
    - Provide an IP range if you do not have a static IP address.

    > [AZURE.NOTE] The client IP address range you need to include is your external or publicly facing IP address.To find your external IP address you can use a number of websites such as <a href="http://www.whatismyip.com" target="\_blank">www.whatismyip.com</a>

7. Save your firewall rule.


Now that you have configured the firewall you will be able to make connections from your desktop to the Azure SQL Data Warehouse you just created.

## Next steps

Now the SQL Data Warehouse service has been successfully provisioned we can move on to learn how to use it.

The next steps are therefore to learn how to:

1. [Connect and query][] the data warehouse.
2. Load [sample data].

<!--Image references-->


<!-- Articles -->
[Connect and query]: sql-data-warehouse-get-started-connect-query.md
[sample data]: ./sql-data-warehouse-get-started-load-samples.md  

<!--External links-->
[free trial]: https://azure.microsoft.com/en-us/pricing/free-trial/
[Azure portal]: https://portal.azure.com/
