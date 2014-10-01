<properties title="Get started with SQL database auditing" pageTitle="Get started with SQL database auditing | Azure" description="Get started with SQL database auditing" metaKeywords="" services="sql-database" solutions="data-management" documentationCenter="" authors="jeffreyg" videoId="" scriptId="" manager="jeffreyg" />

<tags ms.service="sql-database" ms.workload="data-management" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="jeffreyg" />
 
# Get started with SQL database auditing 
<p> Azure SQL Database Auditing tracks database events and writes audited events to an audit log in your Azure Storage account. Auditing is available in preview for Basic, Standard, and Premium service tiers. To use auditing, <a href="http://go.microsoft.com/fwlink/?LinkId=404163" target="_blank">sign up for the preview</a>.

Auditing can help you maintain regulatory compliance, understand  database activity, and gain insight into discrepancies and anomalies that could indicate business concerns or suspected security violations. 

Auditing tools enable and facilitate adherence to compliance standards but don't guarantee compliance. For more information about Azure programs that support standards compliance, see the <a href="http://azure.microsoft.com/en-us/support/trust-center/compliance/" target="_blank">Azure Trust Center</a>.

+ [Azure SQL Database Auditing basics] 
+ [Set up auditing for your database]
+ [Analyze audit logs and reports]

##<a id="subheading-1">Azure SQL Database Auditing basics</a>

You set up auditing in the Azure Preview Portal, but it makes no difference whether you created the database using the Azure Portal or the Azure Preview Portal. SQL Database auditing enables you to:

- **Retain** an audit trail of selected events. Define categories of database actions and events to be logged.
- **Report** on database activity. Use preconfigured reports and a dashboard to get started quickly with activity and event reporting.
- **Analyze** reports. Find suspicious events, unusual activity, and trends.

You can audit the following activities and events:

- **Access to data**
- **Schema changes (DDL)**
- **Data changes (DML)**
- **Accounts, roles, and permissions (DCL)**
- **Security exceptions**

For further detail about the the activities and events logged, see the <a href="http://go.microsoft.com/fwlink/?LinkId=506733" target="_blank">Audit Log Format Reference (doc file download)</a>. 

You also choose the storage account where audit logs will be saved.

###Security-enabled connection string
When you set up auditing, Azure provides you with a security-enabled connection string for the database. Only client applications that use this connection string will have their activity and events logged, so you need to update existing client applications to use the new string format.

Traditional connection string format: <*server name*>.database.windows.net

Security-enabled connection string: <*server name*>.database.**secure**.windows.net


##<a id="subheading-2"></a>Set up auditing for your database

1. <a href="http://go.microsoft.com/fwlink/?LinkId=404163" target="_blank">Sign up for the Auditing preview</a>.
2. Launch the <a href="https://portal.azure.com" target="_blank">Azure Preview Portal</a> at https://portal.azure.com.
3. Click the database you want to audit, and then click **Auditing Preview** to enable the auditing preview and launch the auditing configuration blade.

	![][1]

5. In the auditing configuration blade, select the Azure storage account where logs will be saved. **Tip:** Use the same storage account for all audited databases to get the most out of the preconfigured reports templates.

	![][2]

6. Under **Auditing Options**, click **All** to log all events, or choose individual event types.

	![][3]

7. Check **Save this Configuration as Default** if you want these settings to apply to all future databases on the server, and any that don't already have auditing set up. You can override the settings later for each database by following these same steps.

	![][4]

8. Click **Show database connection strings** and then copy or make a note of the appropriate security enabled connection string for your application. Use this string for any client applications whose activity you want to audit.

	![][5]

9. Click **OK**.



##<a id="subheading-3">Analyze audit logs and reports</a>

Audit logs are aggregated in a single Azure Store Table named **AuditLogs** in the Azure storage account you chose during setup. You can view log files using a tool such as <a href="http://azurestorageexplorer.codeplex.com/" target="_blank">Azure Storage Explorer</a>.

A preconfigured dashboard report template is available as a <a href="http://go.microsoft.com/fwlink/?LinkId=403540" target="_blank">downloadable Excel spreadsheet</a> to help you quickly analyze log data. To use the template on your audit logs, you need Excel 2013 or later and Power Query, which you can download <a href="http://www.microsoft.com/en-us/download/details.aspx?id=39379">here</a>. 

The template has fictional sample data in it, and you can set up Power Query to import your audit log directly from your Azure storage account. 

For more detailed instructions on working with the report template, read the <a href="http://go.microsoft.com/fwlink/?LinkId=506731">How To (doc download)</a>.

![][6]


<!--Anchors-->
[Azure SQL Database Auditing basics]: #subheading-1
[Set up auditing for your database]: #subheading-2
[Analyze audit logs and reports]: #subheading-3


<!--Image references-->
[1]: ./media/sql-database-auditing-get-started/sql-database-get-started-auditingpreview.png
[2]: ./media/sql-database-auditing-get-started/sql-database-get-started-storageaccount.png
[3]: ./media/sql-database-auditing-get-started/sql-database-auditing-eventtype.png
[4]: ./media/sql-database-auditing-get-started/sql-database-get-started-saveconfigasdefault.png
[5]: ./media/sql-database-auditing-get-started/sql-database-get-started-connectionstring.png
[6]: ./media/sql-database-auditing-get-started/sql-database-auditing-dashboard.png



<!--Link references-->
[Link 1 to another azure.microsoft.com documentation topic]: ../virtual-machines-windows-tutorial/
[Link 2 to another azure.microsoft.com documentation topic]: ../web-sites-custom-domain-name/
[Link 3 to another azure.microsoft.com documentation topic]: ../storage-whatis-account/

