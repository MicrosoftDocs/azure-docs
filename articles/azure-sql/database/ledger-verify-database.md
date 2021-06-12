---
title: How to verify a ledger table to detect tampering
description: This article discusses how to verify if an Azure SQL Database table has been tampered with
ms.service: sql-database
ms.subservice: security
ms.devlang:
ms.topic: how-to
author: JasonMAnderson
ms.author: janders
ms.reviewer: vanto
ms.date: 05/25/2021
---

# How to verify a ledger table to detect tampering

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

> [!NOTE]
> Azure SQL Database ledger is currently in **public preview**.

In this article, you'll verify the integrity of the data in your Azure SQL Database ledger tables. If you've checked **Enable automatic digest storage** when [creating your Azure SQL Database](ledger-create-a-single-database-with-ledger-enabled.md), follow the Azure portal instructions to automatically generate the Transact-SQL (T-SQL) script needed to verify the database ledger in [Query Editor](connect-query-portal.md). Otherwise, follow the T-SQL instructions using either [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms) or [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio).

## Prerequisite

- An active Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- [Create an Azure SQL Database with ledger enabled.](ledger-create-a-single-database-with-ledger-enabled.md)
- [Create and use updatable ledger tables](ledger-how-to-updatable-ledger-tables.md) or [Create and use append-only ledger tables](ledger-how-to-append-only-ledger-tables.md)

## Run ledger verification for Azure SQL Database

# [Portal](#tab/azure-portal)

1. Open the [Azure portal](https://portal.azure.com/), select **All resources** and locate the database you want to verify. Select that SQL database.

	 :::image type="content" source="media/ledger/ledger-portal-all-resources.png" alt-text="Azure portal showing with All resources tab":::

1. In **Security**, select the **Ledger** option.

   :::image type="content" source="media/ledger/ledger-portal-manage-ledger.png" alt-text="Azure portal ledger security tab":::

1. In the **Ledger** pane, select the **</> Verify database** button, and select the **copy** icon in the pre-populated text in the window.

	 :::image type="content" source="media/ledger/ledger-portal-verify.png" alt-text="Azure portal verify database button":::

1. Open **Query Editor** in the left menu.

	 :::image type="content" source="media/ledger/ledger-portal-open-query-editor.png" alt-text="Azure portal query editor button":::

1. In **Query editor**, paste the T-SQL script you copied in Step 3, and select **Run**.

   :::image type="content" source="media/ledger/ledger-portal-run-query-editor.png" alt-text="Azure portal run query editor to verify the database":::

1. Successful verification will return the following in the **Results** window.

   - If there was no tampering in your database, the message will be as follows:

   ```output
   Ledger verification successful
   ```

   - If there was tampering in your database, the following error will be in the **Messages** window.
  
   ```output
   Failed to execute query. Error: The hash of block xxxx in the database ledger does not match the hash provided in the digest for this block.
   ```

# [T-SQL](#tab/t-sql)

1. Connect to your database using either [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms) or [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio).
1. Create a new query with the following T-SQL statement.

   ```sql
   /****** This will retrieve the latest digest file  ******/
   EXECUTE sp_generate_database_ledger_digest
   ```

1. Execute the query. The results contain the latest database digest, and represent the hash of the database at the current point in time. Copy the contents of the results to be used in the next step.

   :::image type="content" source="media/ledger/ledger-retrieve-digest.png" alt-text="Retrieve digest results using Azure Data Studio":::

1. Create a new query with the following T-SQL statement. Replace `<YOUR DATABASE DIGEST>` with the digest you copied in the previous step.

   ```
   /****** Verifies the integrity of the ledger using the referenced digest  ******/
   EXECUTE sp_verify_database_ledger N'
   <YOUR DATABASE DIGEST>
   '
   ```

1. Execute the query. The **Messages** will contain the success message below.  

   :::image type="content" source="media/ledger/ledger-verify-message.png" alt-text="Message after running T-SQL query for ledger verification using Azure Data Studio":::

   > [!TIP]
   > Running ledger verification with the latest digest will only verify the database from the time the digest was generated until the time the verification was run. To verify that the historical data in your database was not tampered with, run verification using multiple database digest files. Start with the point in time which you want to verify the database. An example of a verification passing multiple digests would look similar to the below query:

   ```
   EXECUTE sp_verify_database_ledger N'
   [
       {
           "database_name":  "ledgerdb",
           "block_id":  0,
           "hash":  "0xDC160697D823C51377F97020796486A59047EBDBF77C3E8F94EEE0FFF7B38A6A",
           "last_transaction_commit_time":  "2020-11-12T18:01:56.6200000",
           "digest_time":  "2020-11-12T18:39:27.7385724"
       },
       {
           "database_name":  "ledgerdb",
           "block_id":  1,
           "hash":  "0xE5BE97FDFFA4A16ADF7301C8B2BEBC4BAE5895CD76785D699B815ED2653D9EF8",
           "last_transaction_commit_time":  "2020-11-12T18:39:35.6633333",
           "digest_time":  "2020-11-12T18:43:30.4701575"
       }
   ]
   ```

---

## Next steps

- [Azure SQL Database ledger Overview](ledger-overview.md)
- [Database ledger](ledger-database-ledger.md)
- [Digest management and database verification](ledger-digest-management-and-database-verification.md)
- [Append-only ledger tables](ledger-append-only-ledger-tables.md)
- [Updatable ledger tables](ledger-updatable-ledger-tables.md)
- [How to access the digests stored in Azure Confidential Ledger (ACL)](ledger-how-to-access-acl-digest.md)
