
<!--
includes/sql-database-creatie-new-database.md

Latest Freshness check:  2016-04-11 , carlrab.

As of circa 2016-04-11, the following topics might include this include:
articles/sql-database/sql-database-get-started-tutorial.md

-->
## Creating a new Aure SQL database

Use the following steps to create a new Azure SQL database on a new or existing Azure SQL Database logical server.

1. Click **New** , type **SQL Database** and then click **SQL Database (new database)**

   ![new database][1]

2. Click SQL Database (new database).

   ![new database][2]
   
3. Click **Create** to create a new database in the SQL Database service.

   ![new database][3]

4. Provide the values for the following server properties:

 - Databaswe name
 - Subscription (only if you have multiple subscriptions)
 - Resource group (if just getting started, use the resource group of the logical server)
 - Select source (you can choose a blank database, sample data or a database backup)
 - Server (a new or existing logical server)
 - Server admin password
 - Password
 - Pricing tier (if just getting started, use the default value S0)
 - Collation (only if blank database chosen)

   ![new database][4]

5.  Click **Create** and in the notification area, you can see that deployment has started.

   ![new database][5]

6. Wait for deployment to finish before continuing to the next step.

   ![new database][6]
 
<!-- Image references. -->
[1]: ./media/sql-database-create-new-database/sql-database-new-database-1.png
[2]: ./media/sql-database-create-new-database/sql-database-new-database-2.png
[3]: ./media/sql-database-create-new-database/sql-database-new-database-3.png
[4]: ./media/sql-database-create-new-database/sql-database-new-database-4.png
[5]: ./media/sql-database-create-new-database/sql-database-new-database-5.png
[6]: ./media/sql-database-create-new-database/sql-database-new-database-6.png

<!--
-->
