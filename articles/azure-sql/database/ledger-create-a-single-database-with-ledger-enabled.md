---
title: Create a single database with ledger enabled
description: Create a single database in Azure SQL Database with ledger enabled using the Azure portal.
ms.service: sql-database
ms.subservice: security
ms.devlang:
ms.topic: quickstart
author: JasonMAnderson
ms.author: janders
ms.reviewer: vanto
ms.date: 05/25/2021
---

# Quickstart: Create an Azure SQL Database with ledger enabled

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

> [!NOTE]
> Azure SQL Database ledger is currently in **public preview**.

In this quickstart, you create a [ledger database](ledger-overview.md#ledger-database) in Azure SQL Database and configure [automatic digest storage with Azure Blob storage](ledger-digest-management-and-database-verification.md#automatic-generation-and-storage-of-database-digests) using the Azure portal. For more information about ledger, see [Azure SQL Database ledger](ledger-overview.md).

## Prerequisite

- An active Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).

## Create a ledger database and configure digest storage

Create a single ledger database in the [serverless compute tier](serverless-tier-overview.md) and configure uploading ledger digests to an Azure Storage account.

### Using the Azure portal

To create a single database in the Azure portal, this quickstart starts at the Azure SQL page.

1. Browse to the [Select SQL Deployment option](https://portal.azure.com/#create/Microsoft.AzureSQL) page.

1. Under **SQL databases**, leave **Resource type** set to **Single database**, and select **Create**.

   ![Add to Azure SQL](./media/single-database-create-quickstart/select-deployment.png)

1. On the **Basics** tab of the **Create SQL Database** form, under **Project details**, select the desired Azure **Subscription**.

1. For **Resource group**, select **Create new**, enter *myResourceGroup*, and select **OK**.

1. For **Database name**, enter *demo*.

1. For **Server**, select **Create new**, and fill out the **New server** form with the following values:
   - **Server name**: Enter *mysqlserver*, and add some characters for uniqueness. We can't provide an exact server name to use because server names must be globally unique for all servers in Azure, not just unique within a subscription. So enter something like mysqlserver12345, and the portal lets you know if it's available or not.
   - **Server admin login**: Enter *azureuser*.
   - **Password**: Enter a password that meets requirements, and enter it again in the **Confirm password** field.
   - **Location**: Select a location from the dropdown list.
   - Select **Allow Azure services to access this server** option to enable access to digest storage.
   
   Select **OK**.
   
1. Leave **Want to use SQL elastic pool** set to **No**.

1. Under **Compute + storage**, select **Configure database**.

1. This quickstart uses a serverless database, so select **Serverless**, and then select **Apply**. 

      ![configure serverless database](./media/single-database-create-quickstart/configure-database.png)

1. On the **Networking** tab, for **Connectivity method**, select **Public endpoint**.
1. For **Firewall rules**, set **Add current client IP address** to **Yes**. Leave **Allow Azure services and resources to access this server** set to **No**.
1. Select **Next: Security** at the bottom of the page.

   :::image type="content" source="media/ledger/ledger-create-database-networking-tab.png" alt-text="Networking tab of Create Database in Azure portal":::

1. On the **Security** tab, in the **Ledger** section, select the **Configure ledger** option.

    :::image type="content" source="media/ledger/ledger-configure-ledger-security-tab.png" alt-text="Configure ledger in Security tab of Azure portal":::

1. On the **Configure ledger** pane, in the **Ledger** section, select the **Enable for all future tables in this database** checkbox. This setting ensures that all future tables in the database will be ledger tables, which means that all data in the database will be tamper evident. By default, new tables will be created as updatable ledger tables, even if you don't specify `LEDGER = ON` in [CREATE TABLE](/sql/t-sql/statements/create-table-transact-sql). Alternatively, you can leave this unselected, requiring you to enable ledger functionality on a per-table basis when creating new tables using Transact-SQL.

1. In the **Digest storage** section, **Enable automatic digest storage** will be automatically selected, subsequently creating a new Azure Storage account and container where your digests will be stored.

1. Click the **Apply** button.

    :::image type="content" source="media/ledger/ledger-configure-ledger-pane.png" alt-text="Configure ledger pane in Azure portal":::

1. Select **Review + create** at the bottom of the page:

    :::image type="content" source="media/ledger/ledger-review-security-tab.png" alt-text="Review and create ledger database in Security tab of Azure portal":::

1. On the **Review + create** page, after reviewing, select **Create**.

## Clean up resources

Keep the resource group, server, and single database to go on to the next steps, and learn how to use the ledger feature of your database with different methods.

When you're finished using these resources, you can delete the resource group you created, which will also delete the server and single database within it.

### Using the Azure portal

To delete **myResourceGroup** and all its resources using the Azure portal:

1. In the portal, search for and select **Resource groups**, and then select **myResourceGroup** from the list.
1. On the resource group page, select **Delete resource group**.
1. Under **Type the resource group name**, enter *myResourceGroup*, and then select **Delete**.

## Next steps

Connect and query your database using different tools and languages:

- [Create and use updatable ledger tables](ledger-how-to-updatable-ledger-tables.md)
- [Create and use append-only ledger tables](ledger-how-to-append-only-ledger-tables.md) 
