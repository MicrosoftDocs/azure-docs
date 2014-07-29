<<<<<<< HEAD
<!--<properties title="Get Started with Azure SQL Database Auditing" pageTitle="Get Started with Azure SQL Database Auditing" description="Step by step instructions for setting up and using the auditing features of Azure SQL Database, Microsoft's relational database-as-a-service in the cloud." metaKeywords="cloud, SQL, auditing" services="SQL Database" solutions="Data and Analytics" documentationCenter="" authors="Jeff Gollnick, Ronit Reger" videoId="" scriptId="" />-->

#Get Started with Azure SQL Database Auditing

<p> Azure SQL Database Auditing tracks database events and writes audited events to an audit log in your Azure Storage account. Auditing is available in preview for Basic, Standard, and Premium service tiers. 

Use auditing to help maintain regulatory compliance, understand  database activity, and gain insight into discrepancies and anomalies that could indicate business concerns or suspected security violations. 

Auditing tools enable and facilitate adherence to compliance standards but do not guarantee compliance. For more information about Azure programs that support standards compliance, see the <a href="http://azure.microsoft.com/en-us/support/trust-center/compliance/" target="_blank">Azure Trust Center</a>.

##Azure SQL Database Auditing basics

SQL Database auditing enables you to:

- **Retain** an audit trail of selected events. Define categories of database actions and events to be logged.
- **Report** on database activity. Use preconfigured reports and a dashboard to get started quickly with activity and event reporting.
- **Analyze** reports. Find suspicious events, unusual activity, and trends.

You can audit the following activities and events:

- **Access to schema data**
- **Schema changes (DDL)**
- **Data changes (DML)**
- **Accounts, roles, and permissions (DCL)**
- **Security exceptions**

You also choose the storage account where audit logs will be saved.

###Security-enabled connection string
When you set up auditing, Azure provides you with a security-enabled connection string for the database. Only client applications that use this connection string will have their activity and events logged, so you will need to update existing client applications to use the new string format.

Traditional connection string format: <*server name*>.database.windows.net

Security-enabled connection string: <*server name*>.**secure**.database.windows.net


## Set up auditing for your database

1. Launch the <a href="https://portal.azure.com" target="_blank">Azure Preview Portal</a> at https://portal.azure.com. 
2. Click the database you want to audit, and then click **Auditing Preview** to enable the auditing preview and launch the auditing configuration blade.
3. In the auditing configuration blade, select the Azure storage account where logs will be saved. **Tip:** Use the same storage account for all audited databases to get the most out of the preconfigured reports templates.
4. Under **Auditing Options**, click **All** to log all events, or choose individual event types.
5. Check **Save this Configuration as Default** if you want these settings to apply to all new databases created on the server. You can override the settings later for each database by following these same steps.
6. Click **Show database connection strings** and then copy or make a note of the appropriate security enabled connection string for your application. Use this string for any client applications whose activity you want to audit. 


## Analyze audit logs and reports

Audit logs are aggregated in a single Azure Store Table named AuditLogs in the Azure storage account you chose during setup. You can view log files using a tool such as <a href="http://azurestorageexplorer.codeplex.com/Azure Storage Explorer" target="_blank">Azure Storage Explorer</a>.

A preconfigured dashboard report template is available as a <a href="http://go.microsoft.com/fwlink/?LinkId=403540" target="_blank">downloadable Excel spreadsheet</a> to help you quickly analyze log data. To use the template on your audit logs, you need Excel 2013 or later and Power Query, which you can download <a href="http://www.microsoft.com/en-us/download/details.aspx?id=39379">here</a>. 

The template has fictional sample data in it, and you can set up Power Query to import your audit log directly from your Azure storage account. For more details, open the Excel file and click the **How To** worksheet tab.


<!--Anchors-->
[Subheading 1]: #subheading-1
[Subheading 2]: #subheading-2
[Subheading 3]: #subheading-3


<!--Image references-->
[1]: ./media/sql-database-auditing-get-started-auditingpreview.png
[2]: ./media/sql-database-auditing-get-started-storageaccount.png
[3]: ./media/sql-database-auditing-get-started-eventtype.png
[4]: ./media/sql-database-auditing-get-started-saveconfigasdefault.png
[5]: ./media/sql-database-auditing-get-started-connectionstring.png
[6]: ./media/sql-database-auditing-get-started-dashboard.png


<!--Link references-->
[Link 1 to another azure.microsoft.com documentation topic]: ../virtual-machines-windows-tutorial/
[Link 2 to another azure.microsoft.com documentation topic]: ../web-sites-custom-domain-name/
[Link 3 to another azure.microsoft.com documentation topic]: ../storage-whatis-account/
=======
<properties title="Get started with SQL database auditing" pageTitle="Get started with SQL database auditing | Azure" description="Get started with SQL database auditing" metaKeywords="" services="sql-database" solutions="data-management" documentationCenter="" authors="jeffreyg" videoId="" scriptId=""  />
 
# Get started with SQL database auditing 

>>>>>>> 411e1759a3555385f460cb977a1b3fee7db266e5
