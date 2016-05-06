<properties
	pageTitle="Get started by running the Enable Database for Stretch Wizard | Microsoft Azure"
	description="Learn how to configure a database for Stretch Database by running the Enable Database for Stretch Wizard."
	services="sql-server-stretch-database"
	documentationCenter=""
	authors="douglaslMS"
	manager=""
	editor=""/>

<tags
	ms.service="sql-server-stretch-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="hero-article"
	ms.date="02/26/2016"
	ms.author="douglasl"/>

# Get started by running the Enable Database for Stretch Wizard

To configure a database for Stretch Database, run the Enable Database for Stretch Wizard.  This topic describes the info that you have to enter and the choices that you have to make in the wizard.

To learn more about Stretch Database, see [Stretch Database](sql-server-stretch-database-overview.md).

## Launch the wizard

1.  In SQL Server Management Studio, in Object Explorer, select the database on which you want to enable Stretch.

2.  Right\-click and select **Tasks**, and then select **Stretch**, and then select **Enable** to launch the wizard.

## <a name="Intro"></a>Introduction
Review the purpose of the wizard and the prerequisites.

![Introduction page of the Stretch Database wizard][StretchWizardImage1]

## <a name="Tables"></a>Select tables
Select the tables that you want to enable for Stretch.

![Select tables page of the Stretch Database wizard][StretchWizardImage2]

|Column|Description|
|----------|---------------|
|(no title)|Check the check box in this column to enable the selected table for Stretch.|
|**Name**|Specifies the name of the column in the table.|
|(no title)|A symbol in this column typically indicates that you can't enable the selected table for Stretch because of a blocking issue. This may be because the table uses an unsupported data type. Hover over the symbol to display more info in a tooltip. For more info, see [Surface area limitations and blocking issues for Stretch Database](sql-server-stretch-database-limitations.md).|
|**Stretched**|Indicates whether the table is already enabled.|
|**Rows**|Specifies the number of rows in the table.|
|**Size (KB)**|Specifies the size of the table in KB.|
|**Migrate**|In CTP 3.1 through RC2, you can only migrate an entire table by using the wizard. If you want to specify  a predicate to select rows to migrate from a table that contains both historical and current data, run the ALTER TABLE statement to specify a predicate after you exit the wizard. For more info, see [Enable Stretch Database for a table](sql-server-stretch-database-enable-table.md) or [ALTER TABLE (Transact-SQL)](https://msdn.microsoft.com/library/ms190273.aspx).|

## <a name="Configure"></a>Configure Azure deployment

1.  Sign in to Microsoft Azure with a Microsoft account.

    ![Sign in to Azure - Stretch Database wizard][StretchWizardImage3]

2.  Select the Azure subscription to use for Stretch Database.

3.  Select an Azure region. If you create a new server, the server is created in this region.

    To minimize latency, pick the Azure region in which your SQL Server is located. For more info about regions, see [Azure Regions](https://azure.microsoft.com/regions/).

4.  Specify whether you want to use an existing server or create a new Azure server.

    If the Active Directory on your SQL Server is federated with Azure Active Directory, you can optionally use a federated service account for SQL Server to communicate with the remote Azure server. For more info about the requirements for this option, see [ALTER DATABASE SET Options (Transact-SQL)](https://msdn.microsoft.com/library/bb522682.aspx).

	-   **Create new server**

        1.  Create a login and password for the server administrator.

        2.  Optionally, use a federated service account for SQL Server to communicate with the remote Azure server.

		![Create new Azure server - Stretch Database wizard][StretchWizardImage4]

    -   **Existing server**

        1.  Select or enter the name of the existing Azure server.

        2.  Select the authentication method.

            -   If you select **SQL Server Authentication**, create a new login and password.

            -   Select **Active Directory Integrated Authentication** to use a federated service account for SQL Server to communicate with the remote Azure server.

		![Select existing Azure server - Stretch Database wizard][StretchWizardImage5]

## <a name="Credentials"></a>Secure credentials
Enter a strong password to create a database master key, or if a database master key already exists, enter the password for it.

You have to have a database master key to secure the credentials that Stretch Database uses to connect to the remote database.

![Secure credentials page of the Stretch Database wizard][StretchWizardImage6]

For more info about the database master key, see [CREATE MASTER KEY (Transact-SQL)](https://msdn.microsoft.com/library/ms174382.aspx) and [Create a Database Master Key](https://msdn.microsoft.com/library/aa337551.aspx). For more info about the credential that the wizard creates,  see [CREATE DATABASE SCOPED CREDENTIAL (Transact-SQL)](https://msdn.microsoft.com/library/mt270260.aspx).

## <a name="Network"></a>Select IP address
Use the public IP address of your SQL Server, or enter a range of IP addresses, to create a firewall rule on Azure that lets SQL Server communicate with the remote Azure server.

The IP address or addresses that you provide on this page tell the Azure server to allow incoming data, queries, and management operations initiated by SQL Server to pass through the Azure firewall. The wizard doesn't change anything in the firewall settings on the SQL Server.

![Select IP address page of the Stretch Database wizard][StretchWizardImage7]

## <a name="Summary"></a>Summary
Review the values that you entered and the options that you selected in the wizard. Then select **Finish** to enable Stretch.

![Summary page of the Stretch Database wizard][StretchWizardImage8]

## <a name="Results"></a>Results
Review the results.

Optionally select **Monitor** to launch monitor the status of data migration in Stretch Database Monitor. For more info, see [Monitor and troubleshoot data migration (Stretch Database)](sql-server-stretch-database-monitor.md).

## <a name="KnownIssues"></a>Troubleshooting the wizard
**The Stretch Database wizard failed.**
If Stretch Database is not yet enabled at the server level, and you run the wizard without the system administrator permissions to enable it, the wizard fails. Ask the  system administrator to enable Stretch Database on the local server instance, and then run the wizard again. For more info, see [Prerequisite: Permission to enable Stretch Database on the server](sql-server-stretch-database-enable-database.md#EnableTSQLServer).

## Next steps
Enable additional tables for Stretch Database. Monitor data migration and manage Stretch\-enabled databases and tables.

-   [Enable Stretch Database for a table](sql-server-stretch-database-enable-table.md) to enable additional tables.

-   [Monitor Stretch Database](sql-server-stretch-database-monitor.md) to see the status of data migration.

-   [Pause and resume Stretch Database](sql-server-stretch-database-pause.md)

-   [Manage and troubleshoot Stretch Database](sql-server-stretch-database-manage.md)

-   [Backup and restore Stretch-enabled databases](sql-server-stretch-database-backup.md)

## See also

[Enable Stretch Database for a database](sql-server-stretch-database-enable-database.md)

[Enable Stretch Database for a table](sql-server-stretch-database-enable-table.md)

[StretchWizardImage1]: ./media/sql-server-stretch-database-wizard/stretchwiz1.png
[StretchWizardImage2]: ./media/sql-server-stretch-database-wizard/stretchwiz2.png
[StretchWizardImage3]: ./media/sql-server-stretch-database-wizard/stretchwiz3.png
[StretchWizardImage4]: ./media/sql-server-stretch-database-wizard/stretchwiz4.png
[StretchWizardImage5]: ./media/sql-server-stretch-database-wizard/stretchwiz5.png
[StretchWizardImage6]: ./media/sql-server-stretch-database-wizard/stretchwiz6.png
[StretchWizardImage7]: ./media/sql-server-stretch-database-wizard/stretchwiz7.png
[StretchWizardImage8]: ./media/sql-server-stretch-database-wizard/stretchwiz8.png
