---
title: Azure SQL Database Managed Instance Auditing | Microsoft Docs
description: Learn how to get started with Azure SQL Database Managed Instance Auditing using T-SQL
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.custom: 
ms.devlang: 
ms.topic: conceptual
f1_keywords: 
  - "mi.azure.sqlaudit.general.f1"
author: ronitr
ms.author: ronitr
ms.reviewer: vanto
manager: craigg
ms.date: 09/20/2018
---
# Get started with Azure SQL Database Managed Instance Auditing

[Azure SQL Database Managed Instance](sql-database-managed-instance.md) Auditing tracks database events and writes them to an audit log in your Azure storage account. Auditing also:
- Helps you maintain regulatory compliance, understand database activity, and gain insight into discrepancies and anomalies that could indicate business concerns or suspected security violations.
- Enables and facilitates adherence to compliance standards, although it doesn't guarantee compliance. For more information about Azure programs that support standards compliance, see the [Azure Trust Center](https://azure.microsoft.com/support/trust-center/compliance/).


## Set up auditing for your server

The following section describes the configuration of auditing on your Managed Instance.
1. Go to the [Azure portal](https://portal.azure.com).
2. The following steps create an Azure Storage **container** where audit logs are stored.

   - Navigate to the Azure Storage where you would like to store your audit logs.

     > [!IMPORTANT]
     > Use a storage account in the same region as the Managed Instance server to avoid cross-region reads/writes.

   - In the storage account, go to **Overview** and click **Blobs**.

     ![Navigation pane][1]

   - In the top menu, click **+ Container** to create a new container.

     ![Navigation pane][2]

   - Provide a container **Name**, set Public access level to **Private**, and then click **OK**.

     ![Navigation pane][3]

   - In the containers list, click the newly created container and then click **Container properties**.

     ![Navigation pane][4]

   - Copy the container URL by clicking the copy icon and save the URL (for example, in Notepad) for future use. The container URL format should be `https://<StorageName>.blob.core.windows.net/<ContainerName>`

     ![Navigation pane][5]

3. The following steps generate an Azure Storage **SAS Token** used to grant Managed Instance Auditing access rights to the storage account.

   - Navigate to the Azure Storage account where you created the container in the previous step.

   - Click on **Shared access signature** in the Storage Settings menu.

     ![Navigation pane][6]

   - Configure the SAS as follows:
     - **Allowed services**: Blob
     - **Start date**: to avoid time zone-related issues, it is recommended to use yesterday’s date.
     - **End date**: choose the date on which this SAS Token expires. 

       > [!NOTE]
       > Renew the token upon expiry to avoid audit failures.

     - Click **Generate SAS**.

       ![Navigation pane][7]

   - After clicking on Generate SAS, the SAS Token appears at the bottom. Copy the token by clicking on the copy icon, and save it (for example, in Notepad) for future use.

     > [!IMPORTANT]
     > Remove the question mark (“?”) character from the beginning of the token.

     ![Navigation pane][8]

4. Connect to your Managed Instance via SQL Server Management Studio (SSMS).

5. Execute the following T-SQL statement to **create a new Credential** using the Container URL and SAS Token that you created in the previous steps:

    ```SQL
    CREATE CREDENTIAL [<container_url>]
    WITH IDENTITY='SHARED ACCESS SIGNATURE',
    SECRET = '<SAS KEY>'
    GO
    ```

6. Execute the following T-SQL statement to create a new Server Audit (choose your own audit name, use the Container URL that you created in the previous steps):

    ```SQL
    CREATE SERVER AUDIT [<your_audit_name>]
    TO URL ( PATH ='<container_url>' [, RETENTION_DAYS =  integer ])
    GO
    ```

    If not specified, `RETENTION_DAYS` default is 0 (unlimited retention).

    For additional information:
    - [Auditing differences between Managed Instance, Azure SQL DB and SQL Server](#auditing-differences-between-managed-instance-azure-sql-database-and-sql-server)
    - [CREATE SERVER AUDIT](https://docs.microsoft.com/sql/t-sql/statements/create-server-audit-transact-sql)
    - [ALTER SERVER AUDIT](https://docs.microsoft.com/sql/t-sql/statements/alter-server-audit-transact-sql)

7. Create a Server Audit Specification or Database Audit Specification as you would for SQL Server:
    - [Create Server audit specification T-SQL guide](https://docs.microsoft.com/sql/t-sql/statements/create-server-audit-specification-transact-sql)
    - [Create Database audit specification T-SQL guide](https://docs.microsoft.com/sql/t-sql/statements/create-database-audit-specification-transact-sql)

8. Enable the server audit that you created in step 6:

    ```SQL
    ALTER SERVER AUDIT [<your_audit_name>]
    WITH (STATE=ON);
    GO
    ```

## Analyze audit logs
There are several methods you can use to view blob auditing logs.

- Use the system function `sys.fn_get_audit_file` (T-SQL) to return the audit log data in tabular format. For more information on using this function, see the [sys.fn_get_audit_file documentation](https://docs.microsoft.com/sql/relational-databases/system-functions/sys-fn-get-audit-file-transact-sql).

- For a full list of audit log consumption methods, refer to the [Get started with SQL database auditing](https://docs.microsoft.com/ azure/sql-database/sql-database-auditing).

> [!IMPORTANT]
> The method for viewing audit records from the Azure portal (‘Audit records’ pane) is currently unavailable for Managed Instance.

## Auditing differences between Managed Instance, Azure SQL Database, and SQL Server

The key differences between SQL Audit in Managed Instance, Azure SQL Database, and SQL Server on-premises are:

- In Managed Instance, SQL Audit works at the server level and stores `.xel` log files on Azure blob storage account.
- In Azure SQL Database, SQL Audit works at the database level.
- In SQL Server on-premises / virtual machines, SQL Audit works at the server level, but stores events on files system/windows event logs.

XEvent auditing in Managed Instance supports Azure blob storage targets. File and windows logs are **not supported**.

The key differences in the `CREATE AUDIT` syntax for Auditing to Azure blob storage are:
- A new syntax `TO URL` is provided and enables you to specify URL of the Azure blob Storage container where the `.xel` files are placed.
- The syntax `TO FILE` is **not supported** because Managed Instance cannot access Windows file shares.
- Shutdown option is **not supported**.
- `queue_delay` of 0 is **not supported**.


## Next steps

- For a full list of audit log consumption methods, refer to the [Get started with SQL database auditing](https://docs.microsoft.com/ azure/sql-database/sql-database-auditing).
- For more information about Azure programs that support standards compliance, see the [Azure Trust Center](https://azure.microsoft.com/support/trust-center/compliance/).


<!--Anchors-->
[Set up auditing for your server]: #subheading-1
[Analyze audit logs]: #subheading-2
[Auditing differences between Managed Instance, Azure SQL DB and SQL Server]: #subheading-3

<!--Image references-->
[1]: ./media/sql-managed-instance-auditing/1_blobs_widget.png
[2]: ./media/sql-managed-instance-auditing/2_create_container_button.png
[3]: ./media/sql-managed-instance-auditing/3_create_container_config.png
[4]: ./media/sql-managed-instance-auditing/4_container_properties_button.png
[5]: ./media/sql-managed-instance-auditing/5_container_copy_name.png
[6]: ./media/sql-managed-instance-auditing/6_storage_settings_menu.png
[7]: ./media/sql-managed-instance-auditing/7_sas_configure.png
[8]: ./media/sql-managed-instance-auditing/8_sas_copy.png
