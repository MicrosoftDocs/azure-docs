---
title: SQL Managed Instance auditing
description: Learn how to get started with Azure SQL Managed Instance auditing using T-SQL
services: sql-database
ms.service: sql-managed-instance
ms.subservice: security
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
f1_keywords: 
  - "mi.azure.sqlaudit.general.f1"
author: DavidTrigano
ms.author: datrigan
ms.reviewer: vanto
ms.date: 05/26/2020
---
# Get started with Azure SQL Managed Instance auditing
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

[Azure SQL Managed Instance](sql-managed-instance-paas-overview.md) auditing tracks database events and writes them to an audit log in your Azure storage account. Auditing also:

- Helps you maintain regulatory compliance, understand database activity, and gain insight into discrepancies and anomalies that could indicate business concerns or suspected security violations.
- Enables and facilitates adherence to compliance standards, although it doesn't guarantee compliance. For more information about Azure programs that support standards compliance, see the [Azure Trust Center](https://gallery.technet.microsoft.com/Overview-of-Azure-c1be3942), where you can find the most current list of compliance certifications.

## Set up auditing for your server to Azure Storage

The following section describes the configuration of auditing on your managed instance.

1. Go to the [Azure portal](https://portal.azure.com).
2. Create an Azure Storage **container** where audit logs are stored.

   1. Navigate to the Azure storage account where you would like to store your audit logs.

      > [!IMPORTANT]
      > - Use a storage account in the same region as the managed instance to avoid cross-region reads/writes. 
      > - If your storage account is behind a Virtual Network or a Firewall, please see [Grant access from a virtual network](https://docs.microsoft.com/azure/storage/common/storage-network-security#grant-access-from-a-virtual-network).
      > - If you change retention period from 0 (unlimited retention) to any other value, please note that retention will only apply to logs written after retention value was changed (logs written during the period when retention was set to unlimited are preserved, even after retention is enabled).

   1. In the storage account, go to **Overview** and click **Blobs**.

      ![Azure Blobs widget](./media/auditing-configure/1_blobs_widget.png)

   1. In the top menu, click **+ Container** to create a new container.

      ![Create blob container icon](./media/auditing-configure/2_create_container_button.png)

   1. Provide a container **Name**, set **Public access level** to **Private**, and then click **OK**.

      ![Create blob container configuration](./media/auditing-configure/3_create_container_config.png)

    > [!IMPORTANT]
    > Customers wishing to configure an immutable log store for their server- or database-level audit events should follow the [instructions provided by Azure Storage](https://docs.microsoft.com/azure/storage/blobs/storage-blob-immutability-policies-manage#enabling-allow-protected-append-blobs-writes). (Please ensure you have selected **Allow additional appends** when you configure the immutable blob storage.)
  
3. After you create the container for the audit logs, there are two ways to configure it as the target for the audit logs: [using T-SQL](#blobtsql) or [using the SQL Server Management Studio (SSMS) UI](#blobssms):

   - <a id="blobtsql"></a>Configure blob storage for audit logs using T-SQL:

     1. In the containers list, click the newly created container and then click **Container properties**.

        ![Blob container properties button](./media/auditing-configure/4_container_properties_button.png)

     1. Copy the container URL by clicking the copy icon and save the URL (for example, in Notepad) for future use. The container URL format should be `https://<StorageName>.blob.core.windows.net/<ContainerName>`

        ![Blob container copy URL](./media/auditing-configure/5_container_copy_name.png)

     1. Generate an Azure Storage **SAS token** to grant managed instance auditing access rights to the storage account:

        - Navigate to the Azure storage account where you created the container in the previous step.

        - Click on **Shared access signature** in the **Storage Settings** menu.

          ![Shared access signature icon in storage settings menu](./media/auditing-configure/6_storage_settings_menu.png)

        - Configure the SAS as follows:

          - **Allowed services**: Blob

          - **Start date**: to avoid time zone-related issues, use yesterday’s date

          - **End date**: choose the date on which this SAS token expires

            > [!NOTE]
            > Renew the token upon expiry to avoid audit failures.

          - Click **Generate SAS**.

            ![SAS configuration](./media/auditing-configure/7_sas_configure.png)

        - The SAS token appears at the bottom. Copy the token by clicking on the copy icon, and save it (for example, in Notepad) for future use.

          ![Copy SAS token](./media/auditing-configure/8_sas_copy.png)

          > [!IMPORTANT]
          > Remove the question mark (“?”) character from the beginning of the token.

     1. Connect to your managed instance via SQL Server Management Studio or any other supported tool.

     1. Execute the following T-SQL statement to **create a new credential** using the container URL and SAS token that you created in the previous steps:

        ```SQL
        CREATE CREDENTIAL [<container_url>]
        WITH IDENTITY='SHARED ACCESS SIGNATURE',
        SECRET = '<SAS KEY>'
        GO
        ```

     1. Execute the following T-SQL statement to create a new server audit (choose your own audit name, and use the container URL that you created in the previous steps). If not specified, the `RETENTION_DAYS` default is 0 (unlimited retention):

        ```SQL
        CREATE SERVER AUDIT [<your_audit_name>]
        TO URL ( PATH ='<container_url>' [, RETENTION_DAYS =  integer ])
        GO
        ```

        Continue by [creating a server audit specification or database audit specification](#createspec).

   - <a id="blobssms"></a>Configure blob storage for audit logs using  SQL Server Management Studio 18 (Preview):

     1. Connect to the managed instance using the SQL Server Management Studio UI.

     1. Expand the root note of Object Explorer.

     1. Expand the **Security** node, right-click on the **Audits** node, and click on **New Audit**:

        ![Expand security and audit node](./media/auditing-configure/10_mi_SSMS_new_audit.png)

     1. Make sure **URL** is selected in **Audit destination** and click on **Browse**:

        ![Browse Azure Storage](./media/auditing-configure/11_mi_SSMS_audit_browse.png)

     1. (Optional) Sign in to your Azure account:

        ![Sign in to Azure](./media/auditing-configure/12_mi_SSMS_sign_in_to_azure.png)

     1. Select a subscription, storage account, and blob container from the dropdowns, or create your own container by clicking on **Create**. Once you have finished, click **OK**:

        ![Select Azure subscription, storage account, and blob container](./media/auditing-configure/13_mi_SSMS_select_subscription_account_container.png)

     1. Click **OK** in the **Create Audit** dialog.

4. <a id="createspec"></a>After you configure the blob container as target for the audit logs, create and enable a server audit specification or database audit specification as you would for SQL Server:

   - [Create server audit specification T-SQL guide](https://docs.microsoft.com/sql/t-sql/statements/create-server-audit-specification-transact-sql)
   - [Create database audit specification T-SQL guide](https://docs.microsoft.com/sql/t-sql/statements/create-database-audit-specification-transact-sql)

5. Enable the server audit that you created in step 3:

    ```SQL
    ALTER SERVER AUDIT [<your_audit_name>]
    WITH (STATE=ON);
    GO
    ```

For additional information:

- [Auditing differences between Azure SQL Managed Instance and a database in SQL Server](#auditing-differences-between-databases-in-azure-sql-managed-instance-and-databases-in-sql-server)
- [CREATE SERVER AUDIT](https://docs.microsoft.com/sql/t-sql/statements/create-server-audit-transact-sql)
- [ALTER SERVER AUDIT](https://docs.microsoft.com/sql/t-sql/statements/alter-server-audit-transact-sql)

## Set up auditing for your server to Event Hubs or Azure Monitor logs

Audit logs from a managed instance can be  sent to Azure Event Hubs or Azure Monitor logs. This section describes how to configure this:

1. Navigate in the [Azure portal](https://portal.azure.com/) to the managed instance.

2. Click on **Diagnostic settings**.

3. Click on **Turn on diagnostics**. If diagnostics is already enabled, **+Add diagnostic setting** will show instead.

4. Select **SQLSecurityAuditEvents** in the list of logs.

5. Select a destination for the audit events: Event Hubs, Azure Monitor logs, or  both. Configure for each target the required parameters (e.g. Log Analytics workspace).

6. Click **Save**.

    ![Configure diagnostic settings](./media/auditing-configure/9_mi_configure_diagnostics.png)

7. Connect to the managed instance using **SQL Server Management Studio (SSMS)** or any other supported client.

8. Execute the following T-SQL statement to create a server audit:

    ```SQL
    CREATE SERVER AUDIT [<your_audit_name>] TO EXTERNAL_MONITOR;
    GO
    ```

9. Create and enable a server audit specification or database audit specification as you would for SQL Server:

   - [Create Server audit specification T-SQL guide](https://docs.microsoft.com/sql/t-sql/statements/create-server-audit-specification-transact-sql)
   - [Create Database audit specification T-SQL guide](https://docs.microsoft.com/sql/t-sql/statements/create-database-audit-specification-transact-sql)

10. Enable the server audit created in step 8:

    ```SQL
    ALTER SERVER AUDIT [<your_audit_name>]
    WITH (STATE=ON);
    GO
    ```

## Consume audit logs

### Consume logs stored in Azure Storage

There are several methods you can use to view blob auditing logs.

- Use the system function `sys.fn_get_audit_file` (T-SQL) to return the audit log data in tabular format. For more information on using this function, see the [sys.fn_get_audit_file documentation](https://docs.microsoft.com/sql/relational-databases/system-functions/sys-fn-get-audit-file-transact-sql).

- You can explore audit logs by using a tool such as [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/). In Azure Storage, auditing logs are saved as a collection of blob files within a container that was defined to store the audit logs. For further details about the hierarchy of the storage folder, naming conventions, and log format, see the [Blob Audit Log Format Reference](https://go.microsoft.com/fwlink/?linkid=829599).

- For a full list of audit log consumption methods, refer to [Get started with Azure SQL Database auditing](../../azure-sql/database/auditing-overview.md).

### Consume logs stored in Event Hubs

To consume audit logs data from Event Hubs, you will need to set up a stream to consume events and write them to a target. For more information, see the Azure Event Hubs documentation.

### Consume and analyze logs stored in Azure Monitor logs

If audit logs are written to Azure Monitor logs, they are available in the Log Analytics workspace, where you can run advanced searches on the audit data. As a starting point, navigate to the Log Analytics workspace. Under the **General** section, click **Logs** and enter a simple query, such as: `search "SQLSecurityAuditEvents"` to view the audit logs.  

Azure Monitor logs gives you real-time operational insights using integrated search and custom dashboards to readily analyze millions of records across all your workloads and servers. For additional useful information about Azure Monitor logs search language and commands, see [Azure Monitor logs search reference](https://docs.microsoft.com/azure/azure-monitor/log-query/log-query-overview).

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../../includes/azure-monitor-log-analytics-rebrand.md)]

## Auditing differences between databases in Azure SQL Managed Instance and databases in SQL Server

The key differences between auditing in databases in Azure SQL Managed Instance and databases in SQL Server are:

- With Azure SQL Managed Instance, auditing works at the server level and stores `.xel` log files in Azure Blob storage.
- In SQL Server, audit works at the server level, but stores events on files system/windows event logs.

XEvent auditing in managed instances supports Azure Blob storage targets. File and windows logs are **not supported**.

The key differences in the `CREATE AUDIT` syntax for auditing to Azure Blob storage are:

- A new syntax `TO URL` is provided and enables you to specify the URL of the Azure Blob storage container where the `.xel` files are placed.
- A new syntax `TO EXTERNAL MONITOR` is provided to enable Event Hubs and Azure Monitor log targets.
- The syntax `TO FILE` is **not supported** because Azure SQL Managed Instance cannot access Windows file shares.
- Shutdown option is **not supported**.
- `queue_delay` of 0 is **not supported**.

## Next steps

- For a full list of audit log consumption methods, refer to [Get started with Azure SQL Database auditing](../../azure-sql/database/auditing-overview.md).
- For more information about Azure programs that support standards compliance, see the [Azure Trust Center](https://gallery.technet.microsoft.com/Overview-of-Azure-c1be3942), where you can find the most current list of compliance certifications.

<!--Image references-->
