---
title: Get started with Azure SQL database auditing | Microsoft Docs
description: Get started with Azure SQL database auditing
services: sql-database
documentationcenter: ''
author: giladm
manager: jhubbard
editor: giladm

ms.assetid: 89c2a155-c2fb-4b67-bc19-9b4e03c6d3bc
ms.service: sql-database
ms.custom: security
ms.workload: data-management
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 6/7/2017
ms.author: giladm

---
# Get started with SQL database auditing
Azure SQL Database Auditing tracks database events and writes them to an audit log in your Azure Storage account.

Auditing can help you maintain regulatory compliance, understand database activity, and gain insight into discrepancies and anomalies that could indicate business concerns or suspected security violations.

Auditing enables and facilitates adherence to compliance standards but doesn't guarantee compliance. For more information about Azure programs that support standards compliance, see the [Azure Trust Center](https://azure.microsoft.com/support/trust-center/compliance/).

## <a id="subheading-1"></a>Azure SQL Database auditing overview
SQL Database Auditing allows you to:

* **Retain** an audit trail of selected events. You can define categories of database actions to be audited.
* **Report** on database activity. You can use preconfigured reports and a dashboard to get started quickly with activity and event reporting.
* **Analyze** reports. You can find suspicious events, unusual activity, and trends.

You can configure auditing for different types of event categories, as explained in the [Set up auditing for your database](#subheading-2) section.

Audit logs are written to Azure Blob Storage on your Azure subscription.


## <a id="subheading-8"></a>Server-level vs. Database-level auditing policy

An auditing policy can be defined for a specific database or as a default server policy.

1. A server policy will apply to all existing and newly created databases on the server.

2. If **Server Blob auditing is enabled**, it **always applies to the database** (i.e. the database will be audited), regardless of the database auditing settings.

3. Enabling Blob auditing on the database, in addition to enabling it on the server, will **not** override or change any of the settings of the server Blob auditing - both audits will exist side by side. In other words, the database will be audited twice in parallel (once by the Server policy and once by the Database policy).

    > [!NOTE]
    > You should avoid enabling both server Blob auditing and database Blob auditing together, unless:
    > * You want to use a different *storage account* or *retention period* for a specific database.
    > * You want to audit different event types or categories for a specific database than are being audited for the rest of the databases on this server (e.g. if table inserts need to be audited only for a specific database).
    > <br><br>
    > Otherwise, it is **recommended to only enable server-level Blob Auditing** and leave the database-level auditing disabled for all databases.


## <a id="subheading-2"></a>Set up auditing for your database
The following section describes the configuration of auditing using the Azure portal.

1. Launch the [Azure portal](https://portal.azure.com) at https://portal.azure.com.
2. Navigate to the settings blade of the SQL Database / SQL Server you want to audit. In the Settings blade, select **Auditing & Threat detection**.

    <a id="auditing-screenshot"></a>
    ![Navigation pane][1]
3. If you prefer to set up a server auditing policy (which will apply to all existing and newly created databases on this server), you can click on the **View server settings** link in the database auditing blade, which allows you to view or modify the server auditing settings from this context.

    ![Navigation pane][2]
4. If you prefer to enable Blob Auditing on the database-level (in addition or instead of server-level auditing), turn Auditing **ON**, and choose the **Blob** Auditing Type.

   > If server Blob auditing is enabled, the database configured audit will exist side by side with the server Blob audit.  

    ![Navigation pane][3]
5. Select **Storage Details** to open the Audit Logs Storage Blade. Select the Azure storage account where logs will be saved, and the retention period, after which the old logs will be deleted, then click **OK** at the bottom. **Tip:** Use the same storage account for all audited databases to get the most out of the auditing reports templates.

    <a id="storage-screenshot"></a>
    ![Navigation pane][4]
6. If you want to customize the audited events, you can do this via PowerShell or REST API - see the [Automation (PowerShell / REST API)](#subheading-7) section for more details.
7. Once you've configured your auditing settings, you can turn on the new **Threat Detection** feature, and configure the emails to receive security alerts. Threat Detection allows you to receive proactive alerts on anomalous database activities that may indicate potential security threats. See [Getting Started with Threat Detection](sql-database-threat-detection-get-started.md) for more details.
8. Click **Save**.





## <a id="subheading-3"></a>Analyze audit logs and reports
Audit logs are aggregated in the Azure storage account you chose during setup.

You can explore audit logs using a tool such as [Azure Storage Explorer](http://storageexplorer.com/).

Blob Auditing logs are saved as a collection of blob files within a container named "**sqldbauditlogs**".

For further details about the Blob audit logs storage folder hierarchy, blob naming convention, and log format, see the [Blob Audit Log Format Reference (doc file download)](https://go.microsoft.com/fwlink/?linkid=829599).

There are several methods to view Blob Auditing logs:

1. Through the [Azure portal](https://portal.azure.com) - open the relevant database. At the top of the database's **Auditing & Threat detection** blade, click on **View audit logs**.

    ![Navigation Pane][7]

    An **Audit records** blade will open, where you'll be able to view the logs.

    - You can choose to view specific dates by clicking on **Filter** at the top area of the Audit records blade
    - You can toggle between audit records that were created by server policy or database policy audit

    ![Navigation Pane][8]

2. Using the system function sys.fn_get_audit_file (T-SQL), you can return the audit log data in tabular format. More info on using the function can be found in the [sys.fn_get_audit_file documentation](https://docs.microsoft.com/sql/relational-databases/system-functions/sys-fn-get-audit-file-transact-sql).


3. Using the **Merge Audit Files** feature in SSMS (starting with SSMS 17):  
    - In the SSMS top menu, click on **File** --> **Open** --> **Merge Audit Files...**

        ![Navigation Pane][9]
    - A dialog window will open, click on **Add...**
    - In the following page, choose whether to merge audit files from local disk or import from Azure Storage (you will be required to provide your Azure Storage details and account key).

        ![Navigation Pane][10]
    - Once all files to merge have been added, click **OK** to complete the merge operation.
    - The merged file will open in SSMS, where you'll be able to view and analyze it, as well as export to XEL/CSV files or to a table.

4. We have created a **sync application** that runs in Azure and utilizes OMS Log Analytics public APIs to push SQL audit logs into OMS Log Analytics for consumption via the OMS Log Analytics dashboard ([more info here](https://github.com/Microsoft/Azure-SQL-DB-auditing-OMS-integration)).

5. Power BI - you can view & analyze audit log data in Power BI ([additional info and downloadable template can be found here](https://blogs.msdn.microsoft.com/azuresqldbsupport/2017/05/26/sql-azure-blob-auditing-basic-power-bi-dashboard/))

6. Download log files from your Azure Storage Blob container via the portal or by using a tool such as [Azure Storage Explorer](http://storageexplorer.com/).

    Once you have downloaded the log file locally, you can double-click the file to open, view and analyze the logs in SSMS.

    You can also **download multiple files simultaneously** via Azure Storage Explorer - right-click on a specific subfolder (e.g. a         subfolder that includes all log files for a specific date) and choose "Save as" to save in a local folder.

    Additional methods:

   * After downloading several files (or an entire day, as described above), you can merge them locally as described in the SSMS **Merge Audit Files** instructions above.

   * Programmatically:

     * Extended Events Reader **C# library** ([more info here](https://blogs.msdn.microsoft.com/extended_events/2011/07/20/introducing-the-extended-events-reader/))
     * Querying Extended Events Files Using **PowerShell** ([more info here](https://sqlscope.wordpress.com/2014/11/15/reading-extended-event-files-using-client-side-tools-only/))




## <a id="subheading-5"></a>Practices for usage in production
<!--The description in this section refers to screen captures above.-->

### <a id="subheading-6">Auditing geo-replicated databases</a>
When using Geo-replicated databases, it is possible to set up Auditing on either the Primary database, the Secondary database, or both, depending on the Audit type.

Follow these instructions:

1. **Primary database** - turn on **Blob Auditing** either on the server or the database itself, as described in [Set up auditing for your database](#subheading-2-1) section.
2. **Secondary database** - Blob Auditing can only be turned on/off from the Primary database auditing settings.

   * Turn on **Blob Auditing** on the **Primary database**, as described in [Set up auditing for your database](#subheading-2-1) section. Blob Auditing must be enabled on the *primary database itself*, not the server.
   * Once Blob Auditing is enabled on the Primary database, it will also become enabled on the Secondary database.

    > [!IMPORTANT]
    > By default, the **storage settings** for the Secondary database will be identical to those of the Primary database, causing **cross-regional traffic**. You can avoid this by enabling Blob Auditing on the **Secondary server** and configuring a **local storage** in the Secondary server storage settings (this will override the storage location for the Secondary database and result in each database saving the Audit logs to a local storage).  

<br>

### <a id="subheading-6">Storage key regeneration</a>
In production, you are likely to refresh your storage keys periodically. When refreshing your keys, you need to re-save the auditing policy. The process is as follows:

1. In the storage details blade switch the **Storage Access Key** from *Primary* to *Secondary*, and then click **OK** at the bottom. Then click **SAVE** at the top of the auditing configuration blade.

    ![Navigation Pane][5]
2. Go to the storage configuration blade and **regenerate** the *Primary Access Key*.

    ![Navigation Pane][6]
3. Go back to the auditing configuration blade, switch the **Storage Access Key** from *Secondary* to *Primary*, and then click **OK** at the bottom. Then click **SAVE** at the top of the auditing configuration blade.
4. Go back to the storage configuration blade and **regenerate** the *Secondary Access Key* (in preparation for the next keys refresh cycle).

## <a id="subheading-7"></a>Automation (PowerShell / REST API)
You can also configure Auditing in Azure SQL Database using the following automation tools:

1. **PowerShell cmdlets**

   * [Get-AzureRMSqlDatabaseAuditingPolicy][101]
   * [Get-AzureRMSqlServerAuditingPolicy][102]
   * [Remove-AzureRMSqlDatabaseAuditing][103]
   * [Remove-AzureRMSqlServerAuditing][104]
   * [Set-AzureRMSqlDatabaseAuditingPolicy][105]
   * [Set-AzureRMSqlServerAuditingPolicy][106]
   * [Use-AzureRMSqlServerAuditingPolicy][107]

   For a script example, see [Configure auditing and threat detection using PowerShell](scripts/sql-database-auditing-and-threat-detection-powershell.md).

2. **REST API - Blob Auditing**

   * [Create or Update Database Blob Auditing Policy](https://msdn.microsoft.com/library/azure/mt695939.aspx)
   * [Create or Update Server Blob Auditing Policy](https://msdn.microsoft.com/library/azure/mt771861.aspx)
   * [Get Database Blob Auditing Policy](https://msdn.microsoft.com/library/azure/mt695938.aspx)
   * [Get Server Blob Auditing Policy](https://msdn.microsoft.com/library/azure/mt771860.aspx)
   * [Get Server Blob Auditing Operation Result](https://msdn.microsoft.com/library/azure/mt771862.aspx)


<!--Anchors-->
[Azure SQL Database Auditing overview]: #subheading-1
[Set up auditing for your database]: #subheading-2
[Analyze audit logs and reports]: #subheading-3
[Practices for usage in production]: #subheading-5
[Storage Key Regeneration]: #subheading-6
[Automation (PowerShell / REST API)]: #subheading-7
[Blob/Table differences in Server auditing policy inheritance]: (#subheading-8)  

<!--Image references-->
[1]: ./media/sql-database-auditing-get-started/1_auditing_get_started_settings.png
[2]: ./media/sql-database-auditing-get-started/2_auditing_get_started_server_inherit.png
[3]: ./media/sql-database-auditing-get-started/3_auditing_get_started_turn_on.png
[4]: ./media/sql-database-auditing-get-started/4_auditing_get_started_storage_details.png
[5]: ./media/sql-database-auditing-get-started/5_auditing_get_started_storage_key_regeneration.png
[6]: ./media/sql-database-auditing-get-started/6_auditing_get_started_regenerate_key.png
[7]: ./media/sql-database-auditing-get-started/7_auditing_get_started_blob_view_audit_logs.png
[8]: ./media/sql-database-auditing-get-started/8_auditing_get_started_blob_audit_records.png
[9]: ./media/sql-database-auditing-get-started/9_auditing_get_started_ssms_1.png
[10]: ./media/sql-database-auditing-get-started/10_auditing_get_started_ssms_2.png

[101]: https://docs.microsoft.com/powershell/module/azurerm.sql/get-azurermsqldatabaseauditingpolicy
[102]: https://docs.microsoft.com/powershell/module/azurerm.sql/Get-AzureRMSqlServerAuditingPolicy
[103]: https://docs.microsoft.com/powershell/module/azurerm.sql/Remove-AzureRMSqlDatabaseAuditing
[104]: https://docs.microsoft.com/powershell/module/azurerm.sql/Remove-AzureRMSqlServerAuditing
[105]: https://docs.microsoft.com/powershell/module/azurerm.sql/Set-AzureRMSqlDatabaseAuditingPolicy
[106]: https://docs.microsoft.com/powershell/module/azurerm.sql/Set-AzureRMSqlServerAuditingPolicy
[107]: https://docs.microsoft.com/powershell/module/azurerm.sql/Use-AzureRMSqlServerAuditingPolicy
