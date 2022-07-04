# **Microsoft SQL Server Provider**

## Prerequisites

### Port

The Windows port the SQL Server is using for connections (default is 1433) should be opened in the local firewall of the SQL Server machine and the Azure network security group (NSG) for the Azure network the SQL Server and the "Azure Monitor for SAP Solutions" are placed in.

### SQL Server

The SQL Server must be configured with mixed authentication mode, means it must accept the login from Windows Logins as well as SQL Server logins. You can find this option in the SQL Server Management Studio -> Server Properties -> Security -> Authentication -> SQL Server and Windows authentication mode. A SQL Server restart is required after changing this option.

### SQL Server Login and User

A SQL Server Login and User should be created, using the following script. Please ensure to replace \<Database to monitor\> with your SAP database name and \<password\> with the real password of the login. The example login and user AMFSS can be used or replaced with any other SQL login and username of your choice:

```sql
USE [<Database to monitor>]
DROP USER [AMFSS]
GO
USE [master]
DROP USER [AMFSS]
DROP LOGIN [AMFSS]
GO
CREATE LOGIN [AMFSS] WITH 
    PASSWORD=N'<password>', 
    DEFAULT_DATABASE=[<Database to monitor>], 
    DEFAULT_LANGUAGE=[us_english], 
    CHECK_EXPIRATION=OFF, 
    CHECK_POLICY=OFF
CREATE USER AMFSS FOR LOGIN AMFSS
ALTER ROLE [db_datareader] ADD MEMBER [AMFSS]
ALTER ROLE [db_denydatawriter] ADD MEMBER [AMFSS]
GRANT CONNECT TO AMFSS
GRANT VIEW SERVER STATE TO AMFSS
GRANT VIEW ANY DEFINITION TO AMFSS
GRANT EXEC ON xp_readerrorlog TO AMFSS
GO
USE [<Database to monitor>]
CREATE USER [AMFSS] FOR LOGIN [AMFSS]
ALTER ROLE [db_datareader] ADD MEMBER [AMFSS]
ALTER ROLE [db_denydatawriter] ADD MEMBER [AMFSS]
GO
```

## Provider installation

Select Add provider from Azure Monitor for SAP solutions resource, and then:

!["SQL1"](./media/SQL-Server-Provider-Details.png)

For Type, select Microsoft SQL Server.

!["SQL2"](./media/SQL-Server-Provider.png)

Configure providers for each instance of database by entering all required information.
Enter the IP address of the hostname and the port the SQL Server is listening on (default is 1433).
For the database user please specify a SQL Server user and the password for this user. As SID please specify your SAP System ID (SID).



