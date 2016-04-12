## Connect to Azure SQL Database using the newest version of SQL Server Management Studio

1. Type "Microsoft SQL Server Management Studio" in the Windows search box, and then click the desktop app to start SSMS.

2. In the Connect to Server window, enter the following information:

 - **Server type**: default is database engine - do not change
 - **Server name**: etner the name of the server that hosts your SQL database in the format *&lt;servername>*.**database.windows.net**
 - **Authentication type**: If you are just getting started, select SQL Authentication. If you have enabled Active Directory for your SQL Database logical server, you can select either Active Directory Password Authentication or Active Directory Integrated Authentication.
 - **User name**: If you selected either SQL Authentication or Active Directory Password Authentication, enter the name of a user with access to a database on the server
 - **Password**: If you selected either SQL Authentication or Active Directory Password Authentication, enter the password for the specified user 
   
       ![SQL Server Management Studio: Connect to SQL Database server](./media/sql-database-sql-server-management-studio-connect/1-connect.png)

3. If you are connecting with a user account that only has permissions in a one or more user databases (has no permissions in the master database), click **Options**.

      ![SQL Server Management Studio: Connect to SQL Database server](./media/sql-database-sql-server-management-studio-connect/2-connect.png)
 
4. In the **Connect to Database**, select the database to which you wish to connect.

     ![SQL Server Management Studio: Connect to SQL Database server](./media/sql-database-sql-server-management-studio-connect/3-connect.png)

5. Click **Connect**.
 
6. If your client's IP address does not have access to the SQL Database logical server, you will be prompted to sign in to an Azure account and create a server-level firewall rule. If you are an Azure subscription administrator, Click **Sign in** to create a server-level firewall rule. If not, have an administrator create either a server-level firewall rule or a database-level firewall rule in the database to which you are trying to connect.
 
      ![SQL Server Management Studio: Connect to SQL Database server](./media/sql-database-sql-server-management-studio-connect/4-connect.png)
 
7. When the sign in page appear, provide the credentials for your subscription and sign in.

   ![sign in](./media/sql-database-sql-server-management-studio-connect/sign in.png)
 
8. After your sign in to Azure is successful, review the proposed server-level firewall rule (you can modify it to allow a range of IP addresses) and then click **OK** to create the firewall rule and complete the connection to SQL Database.
 
      ![SQL Server Management Studio: Connect to SQL Database server](./media/sql-database-sql-server-management-studio-connect/5-connect.png)
 
 9. Object Explorer opens and you can now perform administrative tasks or query data. 
 
 ## Troubleshoot connection failures

The most common reason for connection failures are mistakes in the server name (remember, <*servername*> is the name of the logical server, not the database), the user name, or the password, as well as the server not allowing connections for security reasons. 

For information about firewall rules, see [How to: Configure Firewall Settings (Azure SQL Database)](sql-database-configure-firewall-settings.md).