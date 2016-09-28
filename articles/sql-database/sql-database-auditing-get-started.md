<properties
	pageTitle="Get started with SQL database auditing | Microsoft Azure"
	description="Get started with SQL database auditing"
	services="sql-database"
	documentationCenter=""
	authors="ronitr"
	manager="jhubbard"
	editor=""/>

<tags
	ms.service="sql-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/10/2016"
	ms.author="CarlRabeler; ronitr"/>

# Get started with SQL database auditing
Azure SQL Database Auditing tracks database events and writes audited events to an audit log in your Azure Storage account. Auditing is generally available for Basic, Standard, and Premium service tiers.

Auditing can help you maintain regulatory compliance, understand  database activity, and gain insight into discrepancies and anomalies that could indicate business concerns or suspected security violations.

Auditing tools enable and facilitate adherence to compliance standards but don't guarantee compliance. For more information about Azure programs that support standards compliance, see the [Azure Trust Center](https://azure.microsoft.com/support/trust-center/compliance/).

+ [Azure SQL Database Auditing basics]
+ [Set up auditing for your database]
+ [Analyze audit logs and reports]

##<a id="subheading-1"></a>Azure SQL Database Auditing basics

The following section describes the configuration of auditing using the Azure Portal. You may also [set up auditing for your database using the Azure Classic Portal].

SQL Database Auditing allows you to:

- **Retain** an audit trail of selected events. You can define categories of database actions to be audited.
- **Report** on database activity. You can use preconfigured reports and a dashboard to get started quickly with activity and event reporting.
- **Analyze** reports. You can find suspicious events, unusual activity, and trends.

> [AZURE.NOTE] You can now receive proactive alerts on anomalous database activities that may indicate potential security threats using the new **Threat Detection** feature, now in preview. Threat Detection can be turned on and configured from within the auditing configuration blade. See [Getting Started with Threat Detection](sql-database-threat-detection-get-started.md) for more details.

You can configure auditing for the following event categories:

**Plain SQL** and **Parameterized SQL** for which the collected audit logs are classified as  

- **Access to data**
- **Schema changes (DDL)**
- **Data changes (DML)**
- **Accounts, roles, and permissions (DCL)**
- **Stored Procedure**, **Login** and, **Transaction Management**.

For each Event Category, auditing of **Success** and **Failure** operations are configured separately.

For further details about the activities and events audited, see the [Audit Log Format Reference (doc file download)](http://go.microsoft.com/fwlink/?LinkId=506733).

Audit logs are stored in your Azure storage account. You can define an audit log retention period, after which the old logs will be deleted.

An auditing policy can be defined for a specific database or as a default server policy. A default server auditing policy will apply to all databases on a server which do not have a specific overriding database auditing policy defined.

Before setting up auditing check if you are using a ["Downlevel Client"](sql-database-auditing-and-dynamic-data-masking-downlevel-clients.md). Also, if you have strict firewall settings, please note that the [IP endpoint of your database will change](sql-database-auditing-and-dynamic-data-masking-downlevel-clients.md) when enabling Auditing.


##<a id="subheading-2"></a>Set up auditing for your database

1. Launch the [Azure Portal](https://portal.azure.com) at https://portal.azure.com. Alternatively, you can also launch the [Azure Classic Portal](https://manage.windowsazure.com/) at https://manage.windowsazure.com/. Refer to details below.

2. Navigate to the settings blade of the SQL Database / SQL Server you want to audit. In the Settings blade select **Auditing & Threat detection**.

	![Navigation pane][1]

3. In the auditing configuration blade, turn **ON** Auditing.

4. Select **Storage Details** to open the Audit Logs Storage Blade. Select the Azure storage account where logs will be saved, and the retention period. **Tip:** Use the same storage account for all audited databases to get the most out of the auditing reports templates.

	![Navigation pane][2]

5. Click on **Audited Events** to customize which events to audit. In the **Logging by event** blade, click **Success** and **Failure** to log all events, or choose individual event categories.


6. You can check the **Inherit Auditing settings from server** checkbox to designate that this database will be audited according to its server's settings. Once you check this option, you will see a link that allows you to view or modify the server auditing settings from this context.

	![Navigation pane][3]

7. Once you've configured your auditing settings, you can turn **ON** Threat Detection and configure the emails to receive security alerts. See the [Threat Detection Getting Started](sql-database-threat-detection-get-started.md) page for more details.

8. Click **Save**.



##<a id="subheading-3"></a>Analyze audit logs and reports

Audit logs are aggregated in a collection of Store Tables with a **SQLDBAuditLogs** prefix in the Azure storage account you chose during setup. You can view log files using a tool such as [Azure Storage Explorer](http://azurestorageexplorer.codeplex.com/).

A preconfigured report template is available as a [downloadable Excel spreadsheet](http://go.microsoft.com/fwlink/?LinkId=403540) to help you quickly analyze log data. To use the template on your audit logs, you need Excel 2013 or later and Power Query, which you can download [here](http://www.microsoft.com/download/details.aspx?id=39379).

You can import your audit logs into the Excel template directly from your Azure storage account using Power Query. You can then explore your audit records and create dashboards and reports on top of the log data.


![Navigation Pane][4]


##<a id="subheading-4"></a>Set up auditing for your database using the Azure Classic Portal

1. Launch the [Azure Classic Portal](https://manage.windowsazure.com/) at https://manage.windowsazure.com/.

2. Click the SQL Database / SQL Server you want to audit, and then click the **AUDITING & SECURITY** tab.

3. Set Auditing to **ENABLED**.

	![Navigation pane][5]

4. Edit the **LOGGING BY EVENT** as needed, to customize which events to audit.

	![Navigation pane][6]

5. Select a **STORAGE ACCOUNT** and configure **RETENTION**.

	![Navigation pane][7]

6. Click **SAVE**.




##<a id="subheading-5">Practices for usage in production</a>
The description in this section refers to screen captures above. Either [Azure Portal](https://portal.azure.com) or [Azure Classic Portal](https://manage.windowsazure.com/) may be used.


##<a id="subheading-6"></a>Storage Key Regeneration

In production you are likely to refresh your storage keys periodically. When refreshing your keys you need to re-save the auditing policy. The process is as follows:.


1. In the auditing configuration blade switch the **Storage Access Key** from *Primary* to *Secondary* and click **SAVE**.

	![][8]

2. Go to the storage configuration blade and **regenerate** the *Primary Access Key*.

3. Go back to the auditing configuration blade, switch the **Storage Access Key** from *Secondary* to *Primary* and click **SAVE**.

4. Go back to the storage UI and **regenerate** the *Secondary Access Key* (in preparation for the next keys refresh cycle).

##<a id="subheading-7"></a>Automation
There are several PowerShell cmdlets you can use to configure auditing in Azure SQL Database:

- [Get-AzureRMSqlDatabaseAuditingPolicy](https://msdn.microsoft.com/library/azure/mt603731.aspx)
- [Get-AzureRMSqlServerAuditingPolicy](https://msdn.microsoft.com/library/azure/mt619329.aspx)
- [Remove-AzureRMSqlDatabaseAuditing](https://msdn.microsoft.com/library/azure/mt603796.aspx)
- [Remove-AzureRMSqlServerAuditing](https://msdn.microsoft.com/library/azure/mt603574.aspx)
- [Set-AzureRMSqlDatabaseAuditingPolicy](https://msdn.microsoft.com/library/azure/mt603531.aspx)
- [Set-AzureRMSqlServerAuditingPolicy](https://msdn.microsoft.com/library/azure/mt603794.aspx)
- [Use-AzureRMSqlServerAuditingPolicy](https://msdn.microsoft.com/library/azure/mt619353.aspx)




<!--Anchors-->
[Azure SQL Database Auditing basics]: #subheading-1
[Set up auditing for your database]: #subheading-2
[Analyze audit logs and reports]: #subheading-3
[Set up auditing for your database using the Azure Classic Portal]: #subheading-4
[Practices for usage in production]: #subheading-5
[Storage Key Regeneration]: #subheading-6
[Automation]: #subheading-7


<!--Image references-->
[1]: ./media/sql-database-auditing-get-started/1_auditing_get_started_settings.png
[2]: ./media/sql-database-auditing-get-started/2_auditing_get_started_storage_account.png
[3]: ./media/sql-database-auditing-get-started/3_auditing_get_started_inherit_from_server.png
[4]: ./media/sql-database-auditing-get-started/4_auditing_get_started_report_template.png
[5]: ./media/sql-database-auditing-get-started/5_auditing_get_started_classic_portal_enable.png
[6]: ./media/sql-database-auditing-get-started/6_auditing_get_started_classic_portal_events.png
[7]: ./media/sql-database-auditing-get-started/7_auditing_get_started_classic_portal_storage.png
[8]: ./media/sql-database-auditing-get-started/8_auditing_get_started_storage_key_rotation.png
