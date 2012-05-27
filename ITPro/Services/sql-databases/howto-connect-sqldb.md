# How to: Connect to SQL Database in Windows Azure using Management Studio

Management Studio is an administrative tool that lets you manage multiple SQL Server instances and servers in a single workspace. If you already have an on-premises SQL Server instance, you can open a connection to both the on-premises instance and a logical server on Windows Azure to perform tasks side by side.

Management Studio includes features that are not currently available in the management portal, such as a syntax checker and the ability to save scripts and named queries for reuse. SQL Database is just a tabular data stream (TDS) endpoint. Any tools that work with TDS, including Management Studio, are valid for SQL Database operations. Scripts that you develop for on-premises server will run on a SQL Database logical server. 

In the following step, you'll use Management Studio to connect to a logical server on Windows Azure. This step requires you to have SQL Server Management Studio version 2008 R2 or 2012. If you need help downloading or connecting to  Management Studio, see [Managing SQL Database using Management Studio][] on this site.

Before you can connect, it is sometimes necessary to create a firewall exception that allows outbound requests on port 1433 on your local system. Computers that are secure by default typically do not have port 1433 open. 

##Configure the firewall for an on-premises server

1. In Windows Firewall with Advanced Security, create a new outbound rule.

2. Choose **Port**, specify TCP 1433, specify **Allow the connection**, and be sure that the **Public** profile is selected.

3. Provide a meaningful name, such as *WindowsAzureSQLDatabase (tcp-out) port 1433*. 


##Connect to a logical server

1. In Management Studio, in Connect to Server, make sure that Database Engine is selected, then enter the logical server name in this format: *servername*.database.widnows.net

   You can also get the fully qualified server name in the management portal, on the server dashboard, in MANAGE URL.

2. In Authentication, choose **SQL Server Authentication** and then enter the administrator login that you created when you configured the logical server.

3. Click **Options**. 

4. In Connect to database, specify **master**.


##Connect to an on-premises server

1. In Management Studio, in Connect to Server, make sure that Database Engine is selected, then enter the name of a local instance in this format: *servername*\\*instancename*. If the server is local and a default instance, enter *localhost*.

2. In Authentication, choose **Windows Authentication** and then enter a Windows account that is a member of the sysadmin role.

[Managing SQL Database using Management Studio]: http://www.windowsazure.com/en-us/develop/net/common-tasks/sql-azure-management/