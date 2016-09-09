<properties
   pageTitle="Auditing in Azure SQL Data Warehouse  | Microsoft Azure"
   description="Get started with auditing in Azure SQL Data Warehouse"
   services="sql-data-warehouse"
   documentationCenter=""
   authors="ronortloff"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.workload="data-management"
   ms.tgt_pltfrm="na"
   ms.devlang="na"
   ms.topic="article"
   ms.date="05/31/2016" 
   ms.author="rortloff;barbkess;sonyama"/>

# Auditing in Azure SQL Data Warehouse

> [AZURE.SELECTOR]
- [Security Overview](sql-data-warehouse-overview-manage-security.md)
- [Threat detection](sql-data-warehouse-security-threat-detection.md)
- [Encryption (Portal)](sql-data-warehouse-encryption-tde.md)
- [Encryption (T-SQL)](sql-data-warehouse-encryption-tde-tsql.md)
- [Auditing Overview](sql-data-warehouse-auditing-overview.md)
- [Auditing downlevel clients](sql-data-warehouse-auditing-downlevel-clients.md)


Azure SQL Data Warehouse auditing tracks database events and writes audited events to an audit log in your Azure Storage account.

Auditing can help you maintain regulatory compliance, understand  database activity, and gain insight into discrepancies and anomalies that could indicate business concerns or suspected security violations.

Auditing tools enable and facilitate adherence to compliance standards but don't guarantee compliance. For more information about Azure programs that support standards compliance, see the <a href="http://azure.microsoft.com/support/trust-center/compliance/" target="_blank">Azure Trust Center</a>.

+ [Database Auditing basics]
+ [Set up auditing for your database]
+ [Analyze audit logs and reports]

##<a id="subheading-1"></a>Azure SQL Data Warehouse Database Auditing basics


SQL Data Warehouse database auditing allows you to:

- **Retain** an audit trail of selected events. You can define categories of database actions  to be audited.
- **Report** on database activity. You can use preconfigured reports and a dashboard to get started quickly with activity and event reporting.
- **Analyze** reports. You can find suspicious events, unusual activity, and trends.

You can configure auditing for the following event categories:

**Plain SQL** and **Parameterized SQL** for which the collected audit logs are classified as  

- **Access to data**
- **Schema changes (DDL)**
- **Data changes (DML)**
- **Accounts, roles, and permissions (DCL)**
- **Stored Procedure**, **Login** and, **Transaction Management**.

For each Event Category, Auditing of **Success** and **Failure** operations are configured separately.

For further details about the activities and events audited, see the <a href="http://go.microsoft.com/fwlink/?LinkId=506733" target="_blank">Audit Log Format Reference (doc file download)</a>.

Audit logs are stored in your Azure storage account. You can define an audit log retention period.

An auditing policy can be defined for a specific database or as a default server policy. A default server auditing policy will apply to all databases on a server which do not have a specific overriding database auditing policy defined.

Before setting up audit auditing check if you are using a ["Downlevel Client"](sql-data-warehouse-auditing-downlevel-clients.md).


##<a id="subheading-2"></a>Set up auditing for your database

1. Launch the <a href="https://portal.azure.com" target="_blank">Azure Portal</a>.

2. navigate to the configuration blade of the SQL Data Warehouse database / SQL Server you want to audit. Click the **Settings** button on top and then, in the Setting blade, and select **Auditing**.

	![][1]

3. In the auditing configuration blade, first unselect the **Inherit Auditing Settings from Server** checkbox. This allows you to specify the settings for a particular database.

	![][2]

4. Next, enable auditing by clicking the **ON** button.

	![][3]

5. In the auditing configuration blade, select **STORAGE DETAILS** to open the Audit Logs Storage Blade. Select the Azure storage account where logs will be saved and, the retention period. **Tip:** Use the same storage account for all audited databases to get the most out of the preconfigured reports templates.

	![][4]

6. Click the **OK** button to save the storage details configuration.


7. Under **LOGGING BY EVENT**, click **SUCCESS** and **FAILURE** to log all events, or choose individual event categories.


8. If you are configuring Auditing for a database, you may need to alter the connection string of your client to ensure data auditing is correctly captured. Check the [Modify Server FDQN in the connection string](sql-data-warehouse-auditing-downlevel-clients.md) topic for downlevel client connections.

9. Click **OK**.


##<a id="subheading-3">Analyze audit logs and reports</a>

Audit logs are aggregated in a collection of Store Tables with a **SQLDBAuditLogs** prefix in the Azure storage account you chose during setup. You can view log files using a tool such as <a href="http://azurestorageexplorer.codeplex.com/" target="_blank">Azure Storage Explorer</a>.

A preconfigured dashboard report template is available as a <a href="http://go.microsoft.com/fwlink/?LinkId=403540" target="_blank">downloadable Excel spreadsheet</a> to help you quickly analyze log data. To use the template on your audit logs, you need Excel 2013 or later and Power Query, which you can download <a href="http://www.microsoft.com/download/details.aspx?id=39379">here</a>.

The template has fictional sample data in it, and you can set up Power Query to import your audit log directly from your Azure storage account.

For more detailed instructions on working with the report template, read the <a href="http://go.microsoft.com/fwlink/?LinkId=506731">How To (doc download)</a>.

![][5]


##<a id="subheading-4">Practices for usage in production</a>
The description in this section refers to screen captures above. Either <a href="https://portal.azure.com" target="_blank">Azure Portal</a> or <a href= "https://manage.windowsazure.com/" target="_bank">Classic Azure Classic Portal</a> may be used.


##<a id="subheading-5"></a>Storage Key Regeneration

In production you are likely to refresh your storage keys periodically. When refresh your keys you need to re-save the policy. The process is as follows:.


1. In the auditing configuration blade (described above in the set up auditing section) switch the **Storage Access Key** from *Primary* to *Secondary* and **SAVE**.
![][4]
2. Go to the storage configuration blade and **regenerate** the *Primary Access Key*.

3. Go back to the auditing configuration blade, switch the **Storage Access Key** from *Secondary* to *Primary* and press **SAVE**.

4. Go back to the storage UI and **regenerate** the *Secondary Access Key* (as preparation for the next keys refresh cycle.

##<a id="subheading-6"></a>Automation
There are several PowerShell cmdlets you can use to configure auditing in Azure SQL Database. To access the auditing cmdlets you must be running PowerShell in Azure Resource Manager mode.

> [AZURE.NOTE] The  [Azure Resource Manager](https://msdn.microsoft.com/library/dn654592.aspx) module is currently in preview. It might not provide the same management capabilities as the Azure module.

When you are in Azure Resource Manager mode, run `Get-Command *AzureSql*` to list the available cmdlets.


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


<!--Link references-->
