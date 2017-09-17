---
title: Using databases provided by the SQL Adapter RP on Azure Stack | Microsoft Docs
description: How to create and manage SQL databases provisioned using the SQL Adapter Resource Provider
services: azure-stack
documentationCenter: ''
author: JeffGoldner
manager: bradleyb
editor: ''

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/25/2017
ms.author: JeffGo

---
## Create SQL databases

Self-service databases are provided through the tenant portal experience. A tenant will need a subscription that has an offer which contains the database service.

1. Sign in to the Azure Stack tenant portal (service admins can also use the admin portal).

2. Click **+ New** &gt;**Data + Storage"** &gt; **SQL Server Database (preview)** &gt; **Add**.

3. Fill in the form with database details, including a **Database Name**, **Maximum Size**, and change the other parameters as necessary. You are asked to pick a SKU for your database. As hosting servers are added, they are assigned a SKU and databases are created in that pool of hosting servers that make up the SKU.

	![New database](./media/azure-stack-sql-rp-deploy/newsqldb.png)

>[!NOTE]
> The database size must be at least 64MB. It can be increased using settings.

4. Fill in the Login Settings: **Database login**, and **Password**. This is a SQL Authentication credential that is created for your access to this database only. The login user name must be globally unique. Either create a new login setting or select an existing one. You can reuse login settings for other databases using the same SKU.

    ![Create a new database login](./media/azure-stack-sql-rp-deploy/create-new-login.png)


5. Submit the form and wait for the deployment to complete.

    In the resulting blade, notice the “Connection string” field. You can use that string in any application that requires SQL Server access (for example, a web app) in your Azure Stack.

    ![Retrieve the connection string](./media/azure-stack-sql-rp-deploy/sql-db-settings.png)

## Delete SQL databases
From the portal,

>[!NOTE]
>
>When a SQL AlwaysOn database is deleted from the RP, it is successfully deleted from primary and AlwaysOn availability Group but by Design SQL AG places the database in restoring state in every replica and does not drop the database unless triggered. If a database is not dropped the secondary replicas goes to Not synchronizing state. Re-adding a new database to the AG with the same via RP still works. See
![Removing a secondary database](https://docs.microsoft.com/sql/database-engine/availability-groups/windows/remove-a-secondary-database-from-an-availability-group-sql-server)

## Manage database credentials
You can update database credentials (login settings).

## Verify SQL AlwaysOn databases
AlwaysOn databases should show as synchronized and available on all instances and in the Availability group. After failover the database should seamlessly connect. You can use SQL Server Management Studio to verify that a database is synchronizing:

![Verify AlwaysOn](./media/azure-stack-sql-rp-deploy/verifyalwayson.png)


