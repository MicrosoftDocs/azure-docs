---
title: Quick-start guide to MySQL Database on Azure | Azure
description: Use this quickstart guide to quickly create, connect, migrate, monitor, and manage your MySQL Database on Azure. By following the steps in this introduction, you will be able to create and use your own MySQL database instance.
services: mysql
author: v-chenyh
manager: qisong
ms.service: mysql-database-mc
ms.topic: article
ms.date: 12/12/2017
ms.author: v-chenyh
ms.openlocfilehash: 161ae9927ebd1ce2565c1d0bb81463848c325b8f
ms.sourcegitcommit: 69f753b9ab870e84f2d9cd09db16462019e5e674
ms.translationtype: HT
ms.contentlocale: en-US
ms.lasthandoff: 12/15/2017
---
# <a name="mysql-database-on-azure"></a>Quickstart guide to MySQL Database on Azure

> [!div class="op_single_selector"]
> * [Chinese](https://docs.azure.cn/zh-cn/mysql/mysql-database-get-started)
> * [English](https://docs.azure.cn/en-us/mysql/mysql-database-get-started)

This article will help you understand how to use the Azure portal to quickly create, connect, and configure databases by using MySQL Database on Azure. After you finish, you will have a sample MySQL database server on Azure and will understand how to use the Azure portal to perform basic management tasks.

## <a id="step1"></a>Step 1: Sign in to the Azure portal and create a MySQL server instance
1. In the Azure portal, in the left pane, select **New** > **Database > MySQL Databases on Azure**, then select **Create**.

    ![Create MySQL server](./media/mysql-database-get-started/1-1-create-server-ibiza.png)

2. Enter the **server name**, select the appropriate **subscriptions**, and select the **resource groups**. 

    ![Select the performance version](./media/mysql-database-get-started/1-2-create-server-ibiza.png)

3. Create an **administrator account**, select the **location** of the server, select the appropriate **MySQL version**, and then configure the performance.

    > [!NOTE]
    > * Your administrator account name is in the format *server name%username*. Ensure that you enter the complete username when you connect to the database.
    > * If other services on Azure need to access the database, select **Allow Azure Services to access the database**.
    > * We recommend that you select **Fix to Dashboard** to make management more convenient.
    > * We strongly recommend that you put the Azure Services in the same region and select the location closest to you.

## <a id="step2"></a>Step 2: Configure the firewall
Before you connect to MySQL Database on Azure from your client for the first time, configure the firewall. Add the client’s public network IP address (or IP address range) to the whitelist. In the Azure portal, select your MySQL server, and then select **Connection security**.

![MySQL servers configuration](./media/mysql-database-get-started/2-config-firewall-ibiza.png) 

>[!NOTE]
> * The Azure portal has an *Add client IP* function that makes it easy to quickly add the IP address of the current client.
> * If you selected **Allow Azure Services to access the server** when you created the database, your other services on Azure (including VMs on Azure) are allowed to access your MySQL database instance by default, so you don’t need to manually add other IP addresses. You can also ban access for other Azure services by selecting **Deny** in the **Allow Azure Services to access the server** section of this page.

## <a id="step3"></a>Step 3: Set the scheduled backup time
MySQL Database on Azure provides daily backups at a set time. To set the scheduled time for daily backups, select your MySQL server instance and then select **Backup**. In the drop-down list, select the daily backup time.

![Backup settings](./media/mysql-database-get-started/3-config-backup-window-ibiza.png)

## <a id="step4"></a>Step 4: Create databases
You can create multiple databases within a MySQL server instance. There’s no limit to the number of databases that you can create, but multiple databases share server resources. To create the database, select the MySQL server instance, select **Databases**, and then select **New database**.

![Database creation](./media/mysql-database-get-started/4-create-mysql-db-ibiza.png)

## <a id="step5"></a>Step 5: Connect to a database
Get the connection details by viewing the **Overview** for the server within the Azure portal, and then connect to the MySQL Database on Azure database instance through the app.

![View connection details](./media/mysql-database-get-started/5-review-connection-info-ibiza.png)

> [!NOTE]
> MySQL Database on Azure supports SSL connections. If your app isn’t in the same Azure datacenter as the MySQL database instance, we recommend that you use SSL connections to increase security.

## <a id="step6"></a>Step 6: Migrate data (optional)
To migrate a large database from another location to MySQL Database on Azure, do the following:
1. Export the data from the existing database to a file (for example, by using the mysqldump tool).
2. Send the file that you exported from the database to your specific VM on Azure. To do so, use any data transfer tool that you are familiar with (such as FTP) or by using the [AzCopy](https://docs.azure.cn/zh-cn/storage/storage-use-azcopy) tool. If you use the AzCopy tool, send the file to a storage blob before you send it to the VM.
3. Import the data from your Azure VM to your MySQL Database on Azure.  
    This action can reduce the chance of experiencing migration failures resulting from connection dropouts.

## <a id="nextstep"></a>Next steps
After you have completed the preceding steps, you will have created a MySQL Database on Azure database instance and gained an understanding of how to use the portal. Next, you can try out other features, such as checking database usage, backups, and recovery, as well as version upgrades and downgrades.

If you encounter any problems during the operation, you can look at the Azure portal guide, contact technical support, or post your issue on one of the [MSDN forums](https://social.msdn.microsoft.com/Forums/zh-cn/home?forum=AzureMySQLRDS).