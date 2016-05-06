
<!--
includes/sql-database-include-connection-string-30-compare.md

Latest Freshness check:  2015-09-03 , GeneMi.

## Connection string
-->


### Compare the connection string


The following table compares the connection strings that your C# program needs to connect to your on-premises SQL Server versus your Azure SQL Database in the cloud. The differences are in bold.


| Connection string for<br/>Azure SQL Database | Connection string for<br/>Microsoft SQL Server |
| :-- | :-- |
| Server=**tcp:**{your_serverName_here}**.database.windows.net,1433**;<br/>User ID={your_loginName_here}**@{your_serverName_here}**;<br/>Password={your_password_here};<br/>**Database={your_databaseName_here};**<br/>**Connection Timeout=30**;<br/>**Encrypt=True**;<br/>**TrustServerCertificate=False**; | Server={your_serverName_here};<br/>User ID={your_loginName_here};<br/>Password={your_password_here}; |


The **Database=** is optional for SQL Server, but is required for SQL Database.


[.NET ADO SqlConnectionStringBuilder Properties](https://msdn.microsoft.com/library/system.data.sqlclient.sqlconnectionstringbuilder_properties.aspx) - discusses all the parameters in detail.


<!--
These three includes/ files are a sequenced set, but you can pick and choose:

includes/sql-database-include-connection-string-20-portalshots.md
includes/sql-database-include-connection-string-30-compare.md
includes/sql-database-include-connection-string-40-config.md
-->
