<properties 
	pageTitle="Get started with SQL database auditing | Azure" 
	description="Get started with SQL database auditing" 
	services="sql-database" 
	documentationCenter="" 
	authors="jeffgoll" 
	manager="jeffreyg" 
	editor=""/>

<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/23/2015" 
	ms.author="jeffreyg"/>
 
# Get started with SQL database auditing 
<p> Azure SQL Database Auditing tracks database events and writes audited events to an audit log in your Azure Storage account. Auditing is generally available for Basic, Standard, and Premium service tiers.

Auditing can help you maintain regulatory compliance, understand  database activity, and gain insight into discrepancies and anomalies that could indicate business concerns or suspected security violations. 

Auditing tools enable and facilitate adherence to compliance standards but don't guarantee compliance. For more information about Azure programs that support standards compliance, see the <a href="http://azure.microsoft.com/support/trust-center/compliance/" target="_blank">Azure Trust Center</a>.

+ [Azure SQL Database Auditing basics] 
+ [Set up auditing for your database]
+ [Analyze audit logs and reports]

##<a id="subheading-1"></a>Azure SQL Database Auditing basics

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

For further detail about the activities and events logged, see the <a href="http://go.microsoft.com/fwlink/?LinkId=506733" target="_blank">Audit Log Format Reference (doc file download)</a>. 

You also choose the storage account where audit logs will be saved.

###Security-enabled access
There are two methods to get auditing for your connection:

1. For clients which are using TDS version 7.4 and above switch the **SECURITY ENABLED ACCESS** to **REQUIRED**.

2. For "Downlevel clients" which are using TDS version 7.3 and below there is a need to configure a security enabled connection string:

Traditional connection string format: <*server name*>.database.windows.net

Security-enabled connection string: <*server name*>.database.**secure**.windows.net

**Remark:** a partial list of "Downlevel clients" includes: .NET 4.0 and below, and ODBC 10.0 and below. Regarding JDBC: While 4.0 does support TDS version 7.4, please use JDBC 4.1 and above due to a bug in JDBC 4.0.


##<a id="subheading-2"></a>Set up auditing for your database

1. Launch the <a href="https://portal.azure.com" target="_blank">Azure Preview Portal</a> at https://portal.azure.com. Alternatively, you can also launch the <a href= "https://manage.windowsazure.com/" target="_bank">Classic Azure Portal</a> at https://manage.windowsazure.com/. Refer to detials below.
2. Navigate to the configuration blade of the database you want to audit. Scroll down to the **Operations** section, and then click **Auditing** to enable the auditing and launch the auditing configuration blade.

	![][1]

3. In the auditing configuration blade, select the Azure storage account where logs will be saved. **Tip:** Use the same storage account for all audited databases to get the most out of the preconfigured reports templates.

	![][2]

4. Under **Auditing Options**, click **All** to log all events, or choose individual event types.

	![][3]

5. Check **Save these settings as server default** if you want these settings to apply to all future databases on the server, and any that don't already have auditing set up. You can override the settings later for each database by following these same steps. 

6. Click **Show database connection strings** and then copy or make a note of the appropriate security enabled connection string for your application. Use this string for any client applications whose activity you want to audit.

	![][5]

7. Click **OK**.



##<a id="subheading-3">Analyze audit logs and reports</a>

Audit logs are aggregated in a single Azure Store Table named **AuditLogs** in the Azure storage account you chose during setup. You can view log files using a tool such as <a href="http://azurestorageexplorer.codeplex.com/" target="_blank">Azure Storage Explorer</a>.

A preconfigured dashboard report template is available as a <a href="http://go.microsoft.com/fwlink/?LinkId=403540" target="_blank">downloadable Excel spreadsheet</a> to help you quickly analyze log data. To use the template on your audit logs, you need Excel 2013 or later and Power Query, which you can download <a href="http://www.microsoft.com/download/details.aspx?id=39379">here</a>. 

The template has fictional sample data in it, and you can set up Power Query to import your audit log directly from your Azure storage account. 

For more detailed instructions on working with the report template, read the <a href="http://go.microsoft.com/fwlink/?LinkId=506731">How To (doc download)</a>.

![][6]


##<a id="subheading-4"></a>Set up auditing for your database using the classic azure portal

1. Launch the <a href= "https://manage.windowsazure.com/" target="_bank">Classic Azure Portal</a> at https://manage.windowsazure.com/. 
2. Click the database you want to audit, and then click the **Auditing & Secuirity Preview** tab.
3. At the auditing section click "Enable".

![][7]

4. Edit the **EVENT TYPE** as needed.

![][8]

5. Select a **STORAGE ACCOUNT**.
6. Click **SAVE**.
7. Click **Show secured connection string** for the connection string.


##<a id="subheading-3">Practices for usage in production</a>
The description in this section refers to screen captures above. Either <a href="https://portal.azure.com" target="_blank">Azure Preview Portal</a> or <a href= "https://manage.windowsazure.com/" target="_bank">Classic Azure Portal</a> may be used.
 

##<a id="subheading-4"></a>Security Enabled Access

In production you are likely to require that all traffic to the database from all applications and tools is audited. For that modify **Security Enabled Access** from *Optional* to *Required* and save the policy. Once *Required* is configured there is no option to access the Database through the original connection string but only through the security enabled connection string.


![][9]


##<a id="subheading-4"></a>Storage Key Regeneration

In production you are likely to refresh your storage keys periodically. The Auditing Service does not persist your storage account keys. Upon Save, a write only Shared Access Signature (SAS) key is produced for the auditing table (Only the customer can read the audit logs). For this purpose When refresh your keys you need to re-save the policy. The process is as follows:.


1. In the auditing configuration blade (described above in the set up auditing section) switch the **Storage Access Key** from *Primary* to *Secondary* and **SAVE**.
![][10]
2. Go to the storage configuration blade and **regenerate** the *Primary Access Key*.

3. Go back to the auditing configuration blade, switch the **Storage Access Key** from *Secondary* to *Primary* and pres **SAVE**.

4. Go back to the storage UI and **regenerate** the *Secondary Access Key* (as preparation for the next keys refresh cycle.
  
##<a id="subheading-4"></a>Automation
There are several PowerShell cmdlets you can use to configure auditing in Azure SQL Database. To access the auditing cmdlets you must be running PowerShell in Azure Resource Manager mode.

> [AZURE.NOTE] The AzureResourceManager module is currently in preview. It might not provide the same management capabilities as the Azure module.

 [Azure Resource Manager](https://msdn.microsoft.com/library/dn654592.aspx) mode is accessed by running the Switch-AzureMode cmdlet (`Switch-AzureMode AzureResourceManager`). When you are in Azure Resource Manager mode, run `Get-Command *AzureSql*` to list the available cmdlets.







<!--Anchors-->
[Azure SQL Database Auditing basics]: #subheading-1
[Set up auditing for your database]: #subheading-2
[Analyze audit logs and reports]: #subheading-3
[Set up auditing for your database using the classic azure portal]: #subheading-4


<!--Image references-->
[1]: ./media/sql-database-auditing-get-started/sql-database-get-started-auditingpreview.png
[2]: ./media/sql-database-auditing-get-started/sql-database-get-started-storageaccount.png
[3]: ./media/sql-database-auditing-get-started/sql-database-auditing-eventtype.png
[5]: ./media/sql-database-auditing-get-started/sql-database-get-started-connectionstring.png
[6]: ./media/sql-database-auditing-get-started/sql-database-auditing-dashboard.png
[7]: ./media/sql-database-auditing-get-started/sql-database-auditing-classic-portal-enable.png
[8]: ./media/sql-database-auditing-get-started/sql-database-auditing-classic-portal-configure.png
[9]: ./media/sql-database-auditing-get-started/sql-database-auditing-security-enabled-access.png
[10]: ./media/sql-database-auditing-get-started/sql-database-auditing-storage-account.png






<!--Link references-->
[Link 1 to another azure.microsoft.com documentation topic]: virtual-machines-windows-tutorial.md
[Link 2 to another azure.microsoft.com documentation topic]: web-sites-custom-domain-name.md
[Link 3 to another azure.microsoft.com documentation topic]: storage-whatis-account.md

