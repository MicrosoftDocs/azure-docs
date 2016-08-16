

## Connect to Azure SQL Database using a server-level principal login

Use the following steps to connect to Azure SQL Database with SSMS using a server-level principal login.

1. Type "Microsoft SQL Server Management Studio" in the Windows search box, and then click the desktop app to start SSMS.

2. In the Connect to Server window, enter the following information:

 - **Server type**: The default is database engine; do not change this value.
 - **Server name**: Enter the name of the server that hosts your SQL database in the following format: *&lt;servername>*.**database.windows.net**
 - **Authentication type**: If you are just getting started, select SQL Authentication. If you have enabled Active Directory for your SQL Database logical server, you can select either Active Directory Password Authentication or Active Directory Integrated Authentication.
 - **User name**: If you selected either SQL Authentication or Active Directory Password Authentication, enter the name of a user with access to a database on the server.
 - **Password**: If you selected either SQL Authentication or Active Directory Password Authentication, enter the password for the specified user.
   
       ![SQL Server Management Studio: Connect to SQL Database server](./media/sql-database-sql-server-management-studio-connect-server-principal/connect-server-principal-1.png)

3. Click **Connect**.
 
4. If your client's IP address does not have access to the SQL Database logical server, you will be prompted to sign in to an Azure account and create a server-level firewall rule. If you are an Azure subscription administrator, click **Sign in** to create a server-level firewall rule. If not, have an Azure administrator create a server-level firewall rule.
 
      ![SQL Server Management Studio: Connect to SQL Database server](./media/sql-database-sql-server-management-studio-connect-server-principal/connect-server-principal-2.png)
 
1. If you are an Azure subscription administrator and need to sign in, when the sign in page appears, provide the credentials for your subscription and sign in.

      ![sign in](./media/sql-database-sql-server-management-studio-connect-server-principal/connect-server-principal-3.png)
 
1. After your sign in to Azure is successful, review the proposed server-level firewall rule (you can modify it to allow a range of IP addresses) and then click **OK** to create the firewall rule and complete the connection to SQL Database.
 
      ![new server-level firewall](./media/sql-database-sql-server-management-studio-connect-server-principal/connect-server-principal-4.png)
 
5. If your credentials grant you access, Object Explorer opens and you can now perform administrative tasks or query data. 
 
     ![new server-level firewall](./media/sql-database-sql-server-management-studio-connect-server-principal/connect-server-principal-5.png)
 
     
## Troubleshoot connection failures

The most common reason for connection failures are mistakes in the server name (remember, <*servername*> is the name of the logical server, not the database), the user name, or the password, as well as the server not allowing connections for security reasons. 


