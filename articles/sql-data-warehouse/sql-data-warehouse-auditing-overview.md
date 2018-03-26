---
title: Auditing in Azure SQL Data Warehouse  | Microsoft Docs
description: Get started with auditing in Azure SQL Data Warehouse
services: sql-data-warehouse
documentationcenter: ''
author: ronortloff
manager: jhubbard
editor: ''

ms.assetid: 0e6af148-b218-4b43-bb5f-907917d20330
ms.service: sql-data-warehouse
ms.workload: data-management
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.custom: security
ms.date: 01/16/2018
ms.author: rortloff;barbkess

---
# Auditing in Azure SQL Data Warehouse

SQL Data Warehouse auditing allows you to record events in your database to an audit log in your Azure Storage account. Auditing can help you maintain regulatory compliance, understand  database activity, and gain insight into discrepancies and anomalies that could indicate business concerns or suspected security violations. SQL Data Warehouse auditing also integrates with Microsoft Power BI for reporting and analysis.

Auditing tools enable and facilitate adherence to compliance standards but don't guarantee compliance. For more information about Azure programs that support standards compliance, see the <a href="http://azure.microsoft.com/support/trust-center/compliance/" target="_blank">Azure Trust Center</a>.

## <a id="subheading-1"></a>Auditing basics
SQL Data Warehouse database auditing allows you to:

* **Retain** an audit trail of selected events. You can define categories of database actions  to be audited.
* **Report** on database activity. You can use preconfigured reports and a dashboard to get started quickly with activity and event reporting.
* **Analyze** reports. You can find suspicious events, unusual activity, and trends.

You can configure auditing for the following event categories:

**Plain SQL** and **Parameterized SQL** for which the collected audit logs are classified as  

* **Access to data**
* **Schema changes (DDL)**
* **Data changes (DML)**
* **Accounts, roles, and permissions (DCL)**
* **Stored Procedure**, **Login** and, **Transaction Management**.

For each Event Category, Auditing of **Success** and **Failure** operations are configured separately.

For more information about the activities and events audited, see the <a href="http://go.microsoft.com/fwlink/?LinkId=506733" target="_blank">Audit Log Format Reference (doc file download)</a>.

Audit logs are stored in your Azure storage account. You can define an audit log retention period.

You can define an auditing policy for a specific database or as a default server policy. A default server auditing policy applies to all databases on a server that do not have a specific overriding database auditing policy defined.

Before setting up audit auditing check if you are using a ["Downlevel Client."](sql-data-warehouse-auditing-downlevel-clients.md)

## <a id="subheading-2"></a>Set up auditing for your database
1. Launch the <a href="https://portal.azure.com" target="_blank">Azure portal</a>.
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
Audit logs are aggregated in a collection of Store Tables with a **SQLDBAuditLogs** prefix in the Azure storage account you chose during setup. You can view log files using a tool such as <a href="http://azurestorageexplorer.codeplex.com/" target="_blank">Azure Storage Explorer</a>.

A preconfigured dashboard report template is available as a <a href="http://go.microsoft.com/fwlink/?LinkId=403540" target="_blank">downloadable Excel spreadsheet</a> to help you quickly analyze log data. To use the template on your audit logs, you need Excel 2013 or later and Power Query, which you can download <a href="http://www.microsoft.com/download/details.aspx?id=39379">here</a>.

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


<!--Image references-->
[1]: ./media/sql-data-warehouse-auditing-overview/sql-data-warehouse-auditing.png
[2]: ./media/sql-data-warehouse-auditing-overview/sql-data-warehouse-auditing-inherit.png
[3]: ./media/sql-data-warehouse-auditing-overview/sql-data-warehouse-auditing-enable.png
[4]: ./media/sql-data-warehouse-auditing-overview/sql-data-warehouse-auditing-storage-account.png
[5]: ./media/sql-data-warehouse-auditing-overview/sql-data-warehouse-auditing-dashboard.png


