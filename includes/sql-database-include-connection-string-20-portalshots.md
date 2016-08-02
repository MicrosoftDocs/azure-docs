
<!--
includes/sql-database-include-connection-string-20-portalshots.md

Latest Freshness check:  2015-09-02 , GeneMi.

## Connection string
-->


### Obtain the connection string from the Azure portal


Use the [Azure portal](https://portal.azure.com/) to obtain the connection string necessary for your client program to interact with Azure SQL Database: 


1. Click **BROWSE** > **SQL databases**.

2. Enter the name of your database into the filter text box near the upper-left of the **SQL databases** blade.

3. Click the row for your database.

4. After the blade appears for your database, for visual convenience you can click the standard minimize controls to collapse the blades  you used for browsing and database filtering. 
 
	![Filter to isolate your database][10-FilterDatabase]

5. On the blade for your database, click **Show database connection strings**.

6. If you intend to use the ADO.NET connection library, copy the string labeled **ADO**. 
 
	![Copy the ADO connection string for your database][20-CopyAdoConnectionString]
 
7. In one format or another, paste the connection string information into your client program code.



For more information, see:<br/>[Connection Strings and Configuration Files](http://msdn.microsoft.com/library/ms254494.aspx).



<!-- Image references. -->

[10-FilterDatabase]: ./media/sql-database-include-connection-string-20-portalshots/connqry-connstr-a.png

[20-CopyAdoConnectionString]: ./media/sql-database-include-connection-string-20-portalshots/connqry-connstr-b.png


<!--
These three includes/ files are a sequenced set, but you can pick and choose:

includes/sql-database-include-connection-string-20-portalshots.md
includes/sql-database-include-connection-string-30-compare.md
includes/sql-database-include-connection-string-40-config.md
-->
