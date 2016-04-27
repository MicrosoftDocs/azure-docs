## Create new database user using SSMS

The steps below assume that you are using SSMS and connected to SQL Database in Object Explorer and are connected to your SQL Database logical server as a server-level principal administrator or with a user account with permissions to grant user permissions. Furthermore, the steps below assume that a user exists in the database to which you wish to grant dbo permissions.

1. In Object Explorer, expand the Databases node and select the database with the user to which you wish to grant dbo permissions.

     ![SQL Server Management Studio: Connect to SQL Database server](./media/sql-database-create-new-database-user/sql-database-create-new-database-user-1.png)

2. Right-click the selected database and then click **Query**.

     ![SQL Server Management Studio: Connect to SQL Database server](./media/sql-database-create-new-database-user/sql-database-create-new-database-user-2.png)

3. In the query window, edit and use the following Transact-SQL statement to grant dbo permissions to a specified user. 

    '''ALTER ROLE db_owner ADD MEMBER user1;

     ![SQL Server Management Studio: Connect to SQL Database server](./media/sql-database-grant-database-user-dbo-permissions/sql-database-grant-database-user-dbo-permissions-1.png)
