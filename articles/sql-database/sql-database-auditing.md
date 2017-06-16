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
Azure SQL database auditing tracks database events and writes them to an audit log in your Azure storage account. Auditing also:

* Helps you maintain regulatory compliance, understand database activity, and gain insight into discrepancies and anomalies that could indicate business concerns or suspected security violations.

* Enables and facilitates adherence to compliance standards, although it doesn't guarantee compliance. For more information about Azure programs that support standards compliance, see the [Azure Trust Center](https://azure.microsoft.com/support/trust-center/compliance/).


## <a id="subheading-1"></a>Azure SQL database auditing overview
SQL database auditing allows you to:


* **Retain** an audit trail of selected events. You can define categories of database actions to be audited.
* **Report** on database activity. You can use preconfigured reports and a dashboard to get started quickly with activity and event reporting.
* **Analyze** reports. You can find suspicious events, unusual activity, and trends.

You can configure auditing for different types of event categories, as explained in the [Set up auditing for your database](#subheading-2) section.

Audit logs are written to Azure Blob storage on your Azure subscription.


## <a id="subheading-8"></a>Define server-level vs. database-level auditing policy

An auditing policy can be defined for a specific database or as a default server policy:

* A server policy applies to all existing and newly created databases on the server.

* If *server blob auditing is enabled*, it *always applies to the database* (that is, the database will be audited), regardless of the database auditing settings.

* Enabling blob auditing on the database, in addition to enabling it on the server, will *not* override or change any of the settings of the server blob auditing. Both audits will exist side by side. In other words, the database will be audited twice in parallel (once by the server policy and once by the database policy).

   > [!NOTE]
   > You should avoid enabling both server blob auditing and database blob auditing together, unless:
    > * You want to use a different *storage account* or *retention period* for a specific database.
    > * You want to audit event types or categories for a specific database that differ from event types or categories that are being audited for the rest of the databases on the server. For example, you might have table inserts that need to be audited only for a specific database.
   > 
   > Otherwise, we recommended that you enable only server-level blob auditing and leave the database-level auditing disabled for all databases.


## <a id="subheading-2"></a>Set up auditing for your database
The following section describes the configuration of auditing using the Azure portal.

1. Launch the [Azure portal](https://portal.azure.com).
2. Go to the **Settings** blade of the SQL database/SQL server you want to audit. In the **Settings** blade, select **Auditing & Threat detection**.

    <a id="auditing-screenshot"></a>
    ![Navigation pane][1]
3. If you prefer to set up a server auditing policy (which will apply to all existing and newly created databases on this server), you can select the **View server settings** link in the database auditing blade, which allows you to view or modify the server auditing settings.

    ![Navigation pane][2]
4. If you prefer to enable blob auditing on the database level (in addition to or instead of server-level auditing), for **Auditing**, select **ON**, and for **Auditing type**, select  **Blob**.

    If server blob auditing is enabled, the database-configured audit will exist side by side with the server blob audit.  

    ![Navigation pane][3]
5. To open the **Audit Logs Storage** blade, select **Storage Details**. Select the Azure storage account where logs will be saved, and then select the retention period, after which the old logs will be deleted. Then click **OK**. 
   >[!TIP] 
   >To get the most out of the auditing reports templates, use the same storage account for all audited databases. 

    <a id="storage-screenshot"></a>
    ![Navigation pane][4]
6. If you want to customize the audited events, you can do this via PowerShell or the REST API. For more details, see the [Automation (PowerShell/REST API)](#subheading-7) section.
7. Once you've configured your auditing settings, you can turn on the new threat detection feature and configure emails to receive security alerts. Threat detection allows you to receive proactive alerts on anomalous database activities that can indicate potential security threats. For more details, see [Getting Started with Threat Detection](sql-database-threat-detection-get-started.md).
8. Click **Save**.





## <a id="subheading-3"></a>Analyze audit logs and reports
Audit logs are aggregated in the Azure storage account you chose during setup. You can explore audit logs by using a tool such as [Azure Storage Explorer](http://storageexplorer.com/).

Blob auditing logs are saved as a collection of blob files within a container named **sqldbauditlogs**.

For further details about the hierarchy of the blob audit logs storage folder, blob naming conventions, and log format, see the [Blob Audit Log Format Reference (.docx file download)](https://go.microsoft.com/fwlink/?linkid=829599).

There are several methods you can use to view blob auditing logs:

* Use the [Azure portal](https://portal.azure.com).  Open the relevant database. At the top of the database's **Auditing & Threat detection** blade, click **View audit logs**.

    ![Navigation Pane][7]

    An **Audit records** blade opens, from which you'll be able to view the logs.

    - You can view specific dates by clicking **Filter** at the top of the **Audit records** blade.
    - You can switch between audit records that were created by a server policy or database policy audit.

       ![Navigation Pane][8]

* Use the system function **sys.fn_get_audit_file** (T-SQL) to return the audit log data in tabular format. For more information on using this function, see the [sys.fn_get_audit_file documentation](https://docs.microsoft.com/sql/relational-databases/system-functions/sys-fn-get-audit-file-transact-sql).


* Use **Merge Audit Files** in SSMS (starting with SSMS 17):  
    1. From the SSMS menu, select **File** > **Open** > **Merge Audit Files**.

        ![Navigation Pane][9]
    2. The **Add Audit Files** dialog box opens. Select one of the **Add** options to
     choose whether to merge audit files from a local disk or import them from Azure Storage (you will be required to provide your Azure Storage details and account key).

    3. Once all files to merge have been added, click **OK** to complete the merge operation.

    4. The merged file opens in SSMS, where you can view and analyze it, as well as export it to an XEL or CSV file or to a table.

* Use the [sync application](https://github.com/Microsoft/Azure-SQL-DB-auditing-OMS-integration) that we have created. It runs in Azure and utilizes OMS Log Analytics public APIs to push SQL audit logs into OMS. The sync application pushes SQL audit logs into OMS Log Analytics for consumption via the OMS Log Analytics dashboard. 

* Use Power BI. You can view and analyze audit log data in Power BI. Learn more about [Power BI, and access a downloadable template](https://blogs.msdn.microsoft.com/azuresqldbsupport/2017/05/26/sql-azure-blob-auditing-basic-power-bi-dashboard/).

* Download log files from your Azure Storage blob container via the portal or by using a tool such as [Azure Storage Explorer](http://storageexplorer.com/).
    * Once you have downloaded a log file locally, you can double-click the file to open, view, and analyze the logs in SSMS.
    * You can also download multiple files simultaneously via Azure Storage Explorer. Right-click a specific subfolder (for example, a subfolder that includes all log files for a specific date) and select **Save as** to save in a local folder.

* Additional methods:
   * After downloading several files (or a subfolder that includes log files for an entire day, as described in the previous item in this list), you can merge them locally as described in the SSMS Merge Audit Files instructions described earlier.

   * View blob auditing logs programmatically:

     * Use the [Extended Events Reader](https://blogs.msdn.microsoft.com/extended_events/2011/07/20/introducing-the-extended-events-reader/) C# library.
     * [Query Extended Events Files](https://sqlscope.wordpress.com/2014/11/15/reading-extended-event-files-using-client-side-tools-only/) by using PowerShell.




## <a id="subheading-5"></a>Production practices
<!--The description in this section refers to preceding screen captures.-->

### <a id="subheading-6">Auditing geo-replicated databases</a>
When you use geo-replicated databases, it is possible to set up auditing on either the primary database, the secondary database, or both, depending on the audit type.

Follow these instructions (remember that blob auditing can be turned on or off only from the primary database auditing settings):

* **Primary database**. Turn on blob auditing, either on the server or on the database itself, as described in the [Set up auditing for your database](#subheading-2-1) section.
* **Secondary database**. Turn on blob auditing on the primary database, as described in the [Set up auditing for your database](#subheading-2-1) section. 
   * Blob auditing must be enabled on the *primary database itself*, not the server.
   * Once blob auditing is enabled on the primary database, it will also become enabled on the secondary database.

     >[!IMPORTANT]
     >By default, the storage settings for the secondary database will be identical to those of the primary database, causing cross-regional traffic. You can avoid this by enabling blob auditing on the secondary server and configuring local storage in the secondary server storage settings. This will override the storage location for the secondary database and result in each database saving its audit logs to local storage.  
<br>

### <a id="subheading-6">Storage key regeneration</a>
In production, you are likely to refresh your storage keys periodically. When refreshing your keys, you need to resave the auditing policy. The process is as follows:

1. Open the **Storage Details** blade. In the **Storage Access Key** box, select **Secondary**, and click **OK**. Then click **Save** at the top of the auditing configuration blade.

    ![Navigation Pane][5]
2. Go to the storage configuration blade and regenerate the primary access key.

    ![Navigation Pane][6]
3. Go back to the auditing configuration blade, switch the storage access key from secondary to primary, and then click **OK**. Then click **Save** at the top of the auditing configuration blade.
4. Go back to the storage configuration blade and regenerate the secondary access key (in preparation for the next key's refresh cycle).

## <a id="subheading-7"></a>Automation (PowerShell/REST API)
You can also configure auditing in Azure SQL Database using the following automation tools:

* **PowerShell cmdlets**:

   * [Get-AzureRMSqlDatabaseAuditingPolicy][101]
   * [Get-AzureRMSqlServerAuditingPolicy][102]
   * [Remove-AzureRMSqlDatabaseAuditing][103]
   * [Remove-AzureRMSqlServerAuditing][104]
   * [Set-AzureRMSqlDatabaseAuditingPolicy][105]
   * [Set-AzureRMSqlServerAuditingPolicy][106]
   * [Use-AzureRMSqlServerAuditingPolicy][107]

   For a script example, see [Configure auditing and threat detection using PowerShell](scripts/sql-database-auditing-and-threat-detection-powershell.md).

* **REST API - Blob auditing**:

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
