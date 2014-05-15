<properties linkid="mobile-services-sql-scale-guidance" urlDisplayName="Scale mobile services backed by Azure SQL Database" pageTitle="Scale mobile services backed by Azure SQL Database - Azure Mobile Services" metaKeywords="" description="Learn how to diagnose and fix scalability issues in your mobile services backed by SQL Database" metaCanonical="" services="" documentationCenter="Mobile" title="Scale mobile services backed by Azure SQL Database" authors="yavorg" solutions="" manager="" editor="mollybos" />
  
# Scale mobile services backed by Azure SQL Database

Azure Mobile Services makes it very easy to get started and build an app that connects to a cloud-hosted backend that stores data in a SQL database. As your app grows, scaling your service instances is as simple as adjusting scale settings in the portal to add more computational and networking capacity. However, scaling the SQL database backing your service requires some proactive planning and monitoring as the service receives more load. This document will walk you through a set of best practices to ensure continued great performance of your SQL-backed mobile services.

This topic walks you through these basic sections:

1. [Prerequisites](#Prerequisites)
2. [Indexing](#Indexing)
3. [Schema Design](#Schema)
4. [Query Design](#Query)
5. [Monitoring](#Monitoring)
6. [Choosing the Right SQL Database Tier](#SQLTiers)

<a name="Prerequisites"></a>
## Prerequisites
To perform some of the diagnostic tasks in this topic, you need access to a management tool for SQL databases such as **SQL Server Management Studio** or the management functionality built into the **Azure Management Portal**.

SQL Server Management Studio is a free Windows application, which offers the most advanced capabilities. If you do not have access to a Windows machine, consider provisioning a Virtual Machine in Azure as shown in [Create a Virtual Machine Running Windows Server](http://azure.microsoft.com/en-us/documentation/articles/virtual-machines-windows-tutorial/). If you intend to use the VM primarily for the purpose of running SQL Server Management Studio, a **Basic A0** (formerly "Extra Small") instance should be sufficient. 

The Azure Management Portal offers a built-in management experience, which is more limited, but is available without a local install.

The the following steps walk you through obtaining the connection information for the SQL database backing your mobile service and then using either of the two tools to connect to it. You may pick whichever tool you prefer.

## Obtain SQL Connection Information 
1. Launch the [Azure Management Portal](http://manage.windowsazure.com).
2. On the Mobile Services tab, select the service you want to work with.
3. Select the **Configure** tab.
4. Select the **SQL Database** name in the **Database Settings** section. This will navigate to the Azure SQL Database tab in the portal.
5. Select **Set up Windows Azure firewall rules for this IP address**/
6. Make a note of the server address in the **Connect to your database** section, for example: *mcml4otbb9.database.windows.net*.

### SQL Server Management Studio
1. Navigate to [SQL Server Editions - Express](http://www.microsoft.com/en-us/server-cloud/products/sql-server-editions/sql-server-express.aspx)
2. Find the **SQL Server Management Studio** section and select the **Download** button underneath. 
3. Complete the setup steps until you can successfully run the application:

    ![SQL Server Management Studio][SSMS]

4. In the **Connect to Server** dialog enter the following values
    - Server name: *server address you obtained earlier*
    - Authentication: *SQL Server Authentication*
    - Login: *login you picked when creating server*
    - Password: *password you picked when creating server*
5. You should now be connected.

### Azure Management Portal
1. On Azure SQL Database tab for your database, select the **Manage** button 
2. Configure the connection with the following values
    - Server: *should be pre-set to the right value*
    - Database: *leave blank*
    - Username: *login you picked when creating server*
    - Password: *password you picked when creating server*
3. You should now be connected.

    ![Azure Management Portal - SQL Database][PortalSqlManagement]

<a name="Indexing"></a>
## Indexing

<a name="Schema"></a>
## Schema Design

<a name="Query"></a>
## Query Design

<a name="Monitoring"></a>
## Monitoring 

<a name="SQLTiers"></a>
## Choosing the Right SQL Database Tier 

##See Also##
 
Write me

<!-- IMAGES -->
 
[SSMS]: ./media/mobile-services-sql-scale-guidance/1.png
[PortalSqlManagement]: ./media/mobile-services-sql-scale-guidance/2.png

