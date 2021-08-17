---
title: Verify a ledger table to detect tampering
description: This article discusses how to verify if an Azure SQL Database table was tampered with.
ms.service: sql-database
ms.subservice: security
ms.devlang:
ms.topic: how-to
author: JasonMAnderson
ms.author: janders
ms.reviewer: vanto
ms.date: "07/23/2021"
ms.custom: references_regions
---

# Verify a ledger table to detect tampering

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

> [!NOTE]
> Azure SQL Database ledger is currently in public preview and available in West Europe, Brazil South, and West Central US.

In this article, you'll verify the integrity of the data in your Azure SQL Database ledger tables. If you selected **Enable automatic digest storage** when you [created your database in SQL Database](ledger-create-a-single-database-with-ledger-enabled.md), follow the Azure portal instructions to automatically generate the Transact-SQL (T-SQL) script needed to verify the database ledger in the [query editor](connect-query-portal.md). Otherwise, follow the T-SQL instructions by using [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms) or [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio).

## Prerequisites

- Have an active Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- [Create a database in SQL Database with ledger enabled](ledger-create-a-single-database-with-ledger-enabled.md).
- [Create and use updatable ledger tables](ledger-how-to-updatable-ledger-tables.md) or [create and use append-only ledger tables](ledger-how-to-append-only-ledger-tables.md).

## Run ledger verification for SQL Database

# [Portal](#tab/azure-portal)

1. Open the [Azure portal](https://portal.azure.com/), select **All resources**, and locate the database you want to verify. Select that database in SQL Database.

	 :::image type="content" source="media/ledger/ledger-portal-all-resources.png" alt-text="Screenshot that shows the Azure portal with the All resources tab selected.":::

1. In **Security**, select the **Ledger** option.

   :::image type="content" source="media/ledger/ledger-portal-manage-ledger.png" alt-text="Screenshot that shows the Azure portal with the Security Ledger tab selected.":::

1. In the **Ledger** pane, select **</> Verify database**, and select the **copy** icon in the pre-populated text in the window.

	 :::image type="content" source="media/ledger/ledger-portal-verify.png" alt-text="Azure portal verify database button":::

   > > [!IMPORTANT]
   > If you haven't configured automatic digest storage for your database digests and are instead manually managing digests, don't copy this script. Continue to step 6.

1. Open **Query editor** in the left menu.

	 :::image type="content" source="media/ledger/ledger-portal-open-query-editor.png" alt-text="Screenshot that shows the Azure portal Query editor menu option.":::

1. In the query editor, paste the T-SQL script you copied in step 3, and select **Run**. Continue to step 8.

   :::image type="content" source="media/ledger/ledger-portal-run-query-editor.png" alt-text="Screenshot that shows the Azure portal Run query editor to verify the database.":::

1. If you're using manual digest storage, enter the following T-SQL into the query editor to retrieve your latest database digest. Copy the digest from the results returned for the next step.

   ```sql
   EXECUTE sp_generate_database_ledger_digest
   ```
   
1. In the query editor, paste the following T-SQL, replacing `<database_digest>` with the digest you copied in step 6, and select **Run**.

   ```sql
   EXECUTE sp_verify_database_ledger N'<database_digest>'
   ```

1. Verification returns the following messages in the **Results** window.

   - If there was no tampering in your database, the message is:

       ```output
       Ledger verification successful
       ```

   - If there was tampering in your database, the following error appears in the **Messages** window.
  
       ```output
       Failed to execute query. Error: The hash of block xxxx in the database ledger does not match the hash provided in the digest for this block.
       ```

# [T-SQL using automatic digest storage](#tab/t-sql-automatic)

1. Connect to your database by using [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms) or [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio).

1. Create a new query with the following T-SQL statement:

   ```sql
   DECLARE @digest_locations NVARCHAR(MAX) = (SELECT * FROM sys.database_ledger_digest_locations FOR JSON AUTO, INCLUDE_NULL_VALUES);SELECT @digest_locations as digest_locations;
   BEGIN TRY
       EXEC sys.sp_verify_database_ledger_from_digest_storage @digest_locations;
       SELECT 'Ledger verification succeeded.' AS Result;
   END TRY
   BEGIN CATCH
       THROW;
   END CATCH
   ```

1. Execute the query. You'll see that **digest_locations** returns the current location of where your database digests are stored and any previous locations. **Result** returns the success or failure of ledger verification.

   :::image type="content" source="media/ledger/verification_script_exectution.png" alt-text="Screenshot of running ledger verification by using Azure Data Studio.":::

1. Open the **digest_locations** result set to view the locations of your digests. The following example shows two digest storage locations for this database: 

   - **path** indicates the location of the digests.
   - **last_digest_block_id** indicates the block ID of the last digest stored in the **path** location.
   - **is_current** indicates whether the location in **path** is the current (true) or previous (false) one.

       ```json
       [
        {
            "path": "https:\/\/digest1.blob.core.windows.net\/sqldbledgerdigests\/janderstestportal2server\/jandersnewdb\/2021-05-20T04:39:47.6570000",
            "last_digest_block_id": 10016,
            "is_current": true
        },
        {
            "path": "https:\/\/jandersneweracl.confidential-ledger.azure.com\/sqldbledgerdigests\/janderstestportal2server\/jandersnewdb\/2021-05-20T04:39:47.6570000",
            "last_digest_block_id": 1704,
            "is_current": false
        }
       ]
       ```

   > [!IMPORTANT]
   > When you run ledger verification, inspect the location of **digest_locations** to ensure digests used in verification are retrieved from the locations you expect. You want to make sure that a privileged user hasn't changed locations of digest storage to an unprotected storage location, such as Azure Storage, without a configured and locked immutability policy.

1. Verification returns the following message in the **Results** window.

   - If there was no tampering in your database, the message is:

       ```output
       Ledger verification successful
       ```

   - If there was tampering in your database, the following error appears in the **Messages** window:
  
       ```output
       Failed to execute query. Error: The hash of block xxxx in the database ledger doesn't match the hash provided in the digest for this block.
       ```

# [T-SQL using manual digest storage](#tab/t-sql-manual)

1. Connect to your database by using [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms) or [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio).
1. Create a new query with the following T-SQL statement:

   ```sql
   /****** This will retrieve the latest digest file  ******/
   EXECUTE sp_generate_database_ledger_digest
   ```

1. Execute the query. The results contain the latest database digest and represent the hash of the database at the current point in time. Copy the contents of the results to be used in the next step.

   :::image type="content" source="media/ledger/ledger-retrieve-digest.png" alt-text="Screenshot that shows retrieving digest results by using Azure Data Studio.":::

1. Create a new query with the following T-SQL statement. Replace `<YOUR DATABASE DIGEST>` with the digest you copied in the previous step.

   ```
   /****** Verifies the integrity of the ledger using the referenced digest  ******/
   EXECUTE sp_verify_database_ledger N'
   <YOUR DATABASE DIGEST>
   '
   ```

1. Execute the query. The **Messages** window contains the following success message.

   :::image type="content" source="media/ledger/ledger-verify-message.png" alt-text="Screenshot that shows the message after running T-SQL query for ledger verification by using Azure Data Studio.":::

   > [!TIP]
   > Running ledger verification with the latest digest will only verify the database from the time the digest was generated until the time the verification was run. To verify that the historical data in your database wasn't tampered with, run verification by using multiple database digest files. Start with the point in time for which you want to verify the database. An example of a verification passing multiple digests would look similar to the following query.

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

- [Azure SQL Database ledger overview](ledger-overview.md)
- [SQL Database ledger](ledger-database-ledger.md)
- [Digest management and database verification](ledger-digest-management-and-database-verification.md)
- [Append-only ledger tables](ledger-append-only-ledger-tables.md)
- [Updatable ledger tables](ledger-updatable-ledger-tables.md)
- [Access the digests stored in Azure Confidential Ledger](ledger-how-to-access-acl-digest.md)
