---
title: Auditing in Azure SQL Data Warehouse  | Microsoft Docs
description: Learn about auditing, and how to set up auditing in Azure SQL Data Warehouse.
services: sql-data-warehouse
author: kavithaj
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: manage
ms.date: 04/11/2018
ms.author: kavithaj
ms.reviewer: igorstan
---

# Auditing in Azure SQL Data Warehouse

Learn about auditing, and how to set up auditing in Azure SQL Data Warehouse.

## What is auditing?
SQL Data Warehouse auditing allows you to record events in your database to an audit log in your Azure Storage account. Auditing can help you maintain regulatory compliance, understand  database activity, and gain insight into discrepancies and anomalies that could indicate business concerns or suspected security violations.

Auditing tools enable and facilitate adherence to compliance standards but don't guarantee compliance. For more information about Azure programs that support standards compliance, see the [Azure Trust Center](https://azure.microsoft.com/support/trust-center/compliance/).

## <a id="subheading-1"></a>Auditing basics
SQL Data Warehouse database auditing allows you to:

* **Retain** an audit trail of selected events. You can define categories of database actions  to be audited.
* **Report** on database activity. You can use preconfigured reports and a dashboard to get started quickly with activity and event reporting.
* **Analyze** reports. You can find suspicious events, unusual activity, and trends.

Audit logs are stored in your Azure storage account. You can define an audit log retention period.


## <a id="subheading-4"></a>Define server-level vs. database-level auditing policy

An auditing policy can be defined for a specific database or as a default server policy:

* A server policy **applies to all existing and newly created databases** on the server.

* If *server blob auditing is enabled*, it *always applies to the database*. The database will be audited, regardless of the database auditing settings.

* Enabling auditing on the database, in addition to enabling it on the server, does *not* override or change any of the settings of the server blob auditing. Both audits will exist side by side. In other words, the database is audited twice in parallel; once by the server policy and once by the database policy.

> [!NOTE]
> We recommended that you enable **only server-level blob auditing** and leave the database-level auditing disabled for all databases.
> You should avoid enabling both server auditing and database auditing together, unless:
> * You want to use a different *storage account* or *retention period* for a specific database.
> * You want to audit event types or categories for a specific database that differ from the rest of the databases on the server. For example, you might have table inserts that need to be audited only for a specific database.
> * You want to use Threat Detection, which is currently only supported with database-level auditing.

> [!IMPORTANT]
>Enabling auditing on an Azure SQL Data Warehouse, or on a server that has an Azure SQL Data Warehouse on it, **will result in the Data Warehouse being resumed**, even in the case where it was previously paused. **Please make sure to pause the Data Warehouse again after enabling auditing**.

## <a id="subheading-5"></a>Set up server-level auditing for all databases

A server auditing policy applies to **all existing and newly created databases** on the server.

The following section describes the configuration of auditing using the Azure portal.

1. Go to the [Azure portal](https://portal.azure.com).
2. Go to the **SQL server** that you want to audit (important, make sure that you are viewing the SQL server, not a specific database/DW). In the **Security** menu, select **Auditing & Threat detection**.

    ![Navigation pane][6]
4. In the *Auditing & Threat detection* blade, for **Auditing** select **ON**. This auditing policy will apply to all existing and newly created databases on this server.

    ![Navigation pane][7]
5. To open the **Audit Logs Storage** blade, select **Storage Details**. Select or create the Azure storage account where logs will be saved, and then select the retention period (old logs will be deleted). Then click **OK**.

    ![Navigation pane][8]

    > [!IMPORTANT]
    > Server-level audit logs are written to **Append Blobs** in an Azure Blob storage on your Azure subscription.
    >
    > * **Premium Storage** is currently **not supported** by Append Blobs.
    > * **Storage in VNet** is currently **not supported**.

8. Click **Save**.



## <a id="subheading-2"></a>Set up database-level auditing for a single database

You can define an auditing policy for a specific database or as a default server policy.

It is strongly recommended to use server-level auditing and not database-level auditing, as described in [Define server-level vs. database-level auditing policy](#subheading-4)

Before setting up audit auditing check if you are using a ["Downlevel Client"](sql-data-warehouse-auditing-downlevel-clients.md).


1. Launch the [Azure portal](https://portal.azure.com).
2. Go to **Settings** for the SQL Data Warehouse you want to audit. Select **Auditing & Threat detection**.

    ![][1]
3. Next, enable auditing by clicking the **ON** button.

    ![][3]
4. In the auditing configuration panel, select **STORAGE DETAILS** to open the Audit Logs Storage panel. Select the Azure storage account for the logs, and the retention period.
    >[!TIP]
    >Use the same storage account for all audited databases to get the most out of the pre-configured reports templates.

    ![][4]

5. Click the **OK** button to save the storage details configuration.
6. Under **LOGGING BY EVENT**, click **SUCCESS** and **FAILURE** to log all events, or choose individual event categories.
7. If you are configuring Auditing for a database, you may need to alter the connection string of your client to ensure data auditing is correctly captured. Check the [Modify Server FDQN in the connection string](sql-data-warehouse-auditing-downlevel-clients.md) topic for downlevel client connections.
8. Click **OK**.

## <a id="subheading-3"></a>Analyze audit logs and reports

### Server-level policy audit logs
Server-level audit logs are written to **Append Blobs** in an Azure Blob storage on your Azure subscription. They are saved as a collection of blob files within a container named **sqldbauditlogs**.

For further details about the hierarchy of the storage folder, naming conventions, and log format, see the [Blob Audit Log Format Reference](https://go.microsoft.com/fwlink/?linkid=829599).

There are several methods you can use to view blob auditing logs:

* Use **Merge Audit Files** in SQL Server Management Studio (starting with SSMS 17):
    1. From the SSMS menu, select **File** > **Open** > **Merge Audit Files**.

    2. The **Add Audit Files** dialog box opens. Select one of the **Add** options to
     choose whether to merge audit files from a local disk or import them from Azure Storage. You are required to provide your Azure Storage details and account key.

    3. After all files to merge have been added, click **OK** to complete the merge operation.

    4. The merged file opens in SSMS, where you can view and analyze it, as well as export it to an XEL or CSV file or to a table.

* Use the [sync application](https://github.com/Microsoft/Azure-SQL-DB-auditing-OMS-integration) that we have created. It runs in Azure and utilizes Log Analytics public APIs to push SQL audit logs into Log Analytics. The sync application pushes SQL audit logs into Log Analytics for consumption via the Log Analytics dashboard.

* Use Power BI. You can view and analyze audit log data in Power BI. Learn more about [Power BI, and access a downloadable template](https://blogs.msdn.microsoft.com/azuresqldbsupport/2017/05/26/sql-azure-blob-auditing-basic-power-bi-dashboard/).

* Download log files from your Azure Storage blob container via the portal or by using a tool such as [Azure Storage Explorer](http://storageexplorer.com/).
    * After you have downloaded a log file locally, you can double-click the file to open, view, and analyze the logs in SSMS.
    * You can also download multiple files simultaneously via Azure Storage Explorer. Right-click a specific subfolder and select **Save as** to save in a local folder.

* Additional methods:
   * After downloading several files or a subfolder that contains log files, you can merge them locally as described in the SSMS Merge Audit Files instructions described earlier.

   * View blob auditing logs programmatically:

     * Use the [Extended Events Reader](https://blogs.msdn.microsoft.com/extended_events/2011/07/20/introducing-the-extended-events-reader/) C# library.
     * [Query Extended Events Files](https://sqlscope.wordpress.com/2014/11/15/reading-extended-event-files-using-client-side-tools-only/) by using PowerShell.



<br>
### Database-level policy audit logs
Database-level audit logs are aggregated in a collection of Store Tables with a **SQLDBAuditLogs** prefix in the Azure storage account you chose during setup. You can view log files using a tool such as [Azure Storage Explorer](http://azurestorageexplorer.codeplex.com).

A preconfigured dashboard report template is available as a [downloadable Excel spreadsheet](http://go.microsoft.com/fwlink/?LinkId=403540) to help you quickly analyze log data. To use the template on your audit logs, you need Excel 2013 or later and Power Query, which you can [download here](http://www.microsoft.com/download/details.aspx?id=39379).

The template has fictional sample data in it, and you can set up Power Query to import your audit log directly from your Azure storage account.

## <a id="subheading-4"></a>Storage key regeneration
In production, you are likely to refresh your storage keys periodically. When refreshing your keys, you need to save the policy. The process is as follows:

1. In auditing configuration panel, which is described in the preceding setup auditing section, change the **Storage Access Key** from *Primary* to *Secondary* and **SAVE**.

   ![][4]
2. Go to the storage configuration panel and **regenerate** the *Primary Access Key*.
3. Go back to the auditing configuration panel,
4. switch the **Storage Access Key** from *Secondary* to *Primary* and press **SAVE**.
4. Go back to the storage UI and **regenerate** the *Secondary Access Key* (as preparation for the next keys refresh cycle.

## <a id="subheading-5"></a>Automation (PowerShell/REST API)
You can also configure auditing in Azure SQL Data Warehouse by using the following automation tools:

* **PowerShell cmdlets**:

   * [Get-AzureRMSqlDatabaseAuditingPolicy](/powershell/module/azurerm.sql/get-azurermsqldatabaseauditingpolicy)
   * [Get-AzureRMSqlServerAuditingPolicy](/powershell/module/azurerm.sql/Get-AzureRMSqlServerAuditingPolicy)
   * [Remove-AzureRMSqlDatabaseAuditing](/powershell/module/azurerm.sql/Remove-AzureRMSqlDatabaseAuditing)
   * [Remove-AzureRMSqlServerAuditing](/powershell/module/azurerm.sql/Remove-AzureRMSqlServerAuditing)
   * [Set-AzureRMSqlDatabaseAuditingPolicy](/powershell/module/azurerm.sql/Set-AzureRMSqlDatabaseAuditingPolicy)
   * [Set-AzureRMSqlServerAuditingPolicy](/powershell/module/azurerm.sql/Set-AzureRMSqlServerAuditingPolicy)
   * [Use-AzureRMSqlServerAuditingPolicy](/powershell/module/azurerm.sql/Use-AzureRMSqlServerAuditingPolicy)


## Downlevel clients support for auditing and dynamic data masking
Auditing works with SQL clients that support TDS redirection.

Any client that implements TDS 7.4 should also support redirection. Exceptions to this include JDBC 4.0 in which the redirection feature is not fully supported and Tedious for Node.JS in which redirection was not implemented.

For "Downlevel clients" that support TDS version 7.3 and below, modify the server FQDN in the connection string as follows:

- Original server FQDN in the connection string: <*server name*>.database.windows.net
- Modified server FQDN in the connection string: <*server name*>.database.**secure**.windows.net

A partial list of "Downlevel clients" includes:

* .NET 4.0 and below,
* ODBC 10.0 and below.
* JDBC (while JDBC does support TDS 7.4, the TDS redirection feature is not fully supported)
* Tedious (for Node.JS)

**Remark:** The preceding server FDQN modification may be useful also for applying a SQL Server Level Auditing policy without a need for a configuration step in each database (Temporary mitigation).     




<!--Anchors-->
[Database Auditing basics]: #subheading-1
[Set up auditing for your database]: #subheading-2
[Analyze audit logs and reports]: #subheading-3
[Define server-level vs. database-level auditing policy]: #subheading-4
[Set up server-level auditing for all databases]: #subheading-5

<!--Image references-->
[1]: ./media/sql-data-warehouse-auditing-overview/sql-data-warehouse-auditing.png
[2]: ./media/sql-data-warehouse-auditing-overview/sql-data-warehouse-auditing-inherit.png
[3]: ./media/sql-data-warehouse-auditing-overview/sql-data-warehouse-auditing-enable.png
[4]: ./media/sql-data-warehouse-auditing-overview/sql-data-warehouse-auditing-storage-account.png
[5]: ./media/sql-data-warehouse-auditing-overview/sql-data-warehouse-auditing-dashboard.png
[6]: ./media/sql-data-warehouse-auditing-overview/sql-data-warehouse-auditing-server_1_overview.png
[7]: ./media/sql-data-warehouse-auditing-overview/sql-data-warehouse-auditing-server_2_enable.png
[8]: ./media/sql-data-warehouse-auditing-overview/sql-data-warehouse-auditing-server_3_storage.png
