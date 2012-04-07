# Getting Started with SQL Server on a Windows Azure Virtual Machine

The Windows Azure virtual machine gallery provides Windows Azure virtual machine images of Microsoft Windows Server 2008 R2, Service Pack 1 (64-bit) with  a complete 64-bit installation of SQL Server. Versions of this virtual machine are available in the following five configurations.

- SQL Server 2012 Evaluation (64-bit)
- SQL Server 2012 Standard (64-bit)
- SQL Server 2012 Enterprise (64-bit)
- SQL Server 2008 R2 Standard, Service Pack 1 (64-bit)
- SQL Server 2008 R2 Enterprise, Service Pack 1 (64-bit)

# About this Virtual Machine Image
##Windows Server 2008 R2
- Remote Desktop is enabled for the Administrator account.
- The size of the virtual machine can be configured from extra small (20 GB, 768 MB of memory, 1 CPU), up to extra large (1,890 GB, 14 GB of memory, 8 CPU's).
- Windows Update is enabled.
- The Windows local Administrator account is the only user on the virtual machine is the only member of the local Administrators group.
- The virtual machine is a member of a workgroup named WORKGROUP.
- The Guest account is not enabled.
- The Windows Firewall with Advanced Security is turned on.
- No TSQL endpoints are initially configured.
- .NET Framework version 4 is installed.

##SQL Server
This SQL Server installation contains the following components.

* Database Engine
* Analysis Services
* Integration Services
* Reporting Services (configured in Native mode)
* AlwaysOn Availability Groups are available in SQL Server 2012 but need additional configuration before they can be used.
* Replication
* Full-Text and Semantic Extractions for Search (Semantic Extractions in SQL Server 2012 only)
* Data Quality Services (SQL Server 2012 only)
* PowerPivot for SharePoint is available (SQL Server 2012 only), but requires additional configuration and components (including SharePoint).
* Distributed Replay Client is available (SQL Server 2012 only), but not installed. To run setup, see Adding Additional Instances of the Database Engine [#Setup] later in this topic.
* All tools, including SQL Server Management Studio, SQL Server Configuration Manager, and the Business Intelligence Development Studio.
* Client Tools Connectivity, Client Tools SDK, and SQL Client Connectivity SDK.
* SQL Server Books Online (SQL Server 2008 R2 only)

## Database Engine Configuration

- Contains a default (unnamed) instance of the SQL Server Database Engine, listening only on the shared memory protocol.
- The Database Engine is configured to use Windows Authentication only. 
- The Windows Azure user who installed the virtual machine is initially the only member of the SQL Server sysadmin fixed server role.
- The Database Engine memory is set to dynamic memory configuration. 
- Contained database authentication is off. 
- The default language is English. 
- Cross-database ownership chaining is off. 
- For more settings, examine the instance of SQL Server.
- Additional installations of SQL Server can be installed on the virtual machine, but they might require a PID (Product ID code).

# How to Connect To this Instance of SQL Server
## Connecting from Management Studio running on this VM
In the Management Studio **Connect to server** dialog box, enter the computer name of the virtual machine (or enter **(local)**  ) in the **Server name** box. For more information, see [Tutorial: Installing a SQL Server Virtual Machine]( http://go.microsoft.com/fwlink/?LinkId=248281)  and [Tutorial: Getting Started with the Database Engine](http://msdn.microsoft.com/en-us/library/ms345318.aspx).

## Virtual machine steps for connecting to SQL Server from an application running on another computer ##
Before you can connect directly to the instance of SQL Server from the internet, they following tasks must be completed.

- Determines the DNS name of the virtual machine.
- Create a TCP endpoint in for the virtual machine.
- Configure SQL Server to listen on the TCP protocol and restart the Database Engine.
- Open TCP port 1433 in the Windows firewall for the default instance of the Database Engine. Open additional ports for other components as needed. For more information, see [Configuring the Windows Firewall to Allow SQL Server Access](http://msdn.microsoft.com/en-us/library/cc646023.aspx).
- Configure SQL Server for mixed mode authentication.
- Create a SQL Server authentication login.

For step instruction for completing these steps, see  [Tutorial: Installing a SQL Server Virtual Machine]( http://go.microsoft.com/fwlink/?LinkId=248281).

### Client steps for connecting to SQL Server from an application running on another computer ###

When the server configuration steps are complete, you can connect to the SQL Server by using SQL Server Configuration Manager on another computer, by providing the DNS name of the virtual machine as the **Server name** and by providing the SQL Server authentication login name and password, in the **Connect to server** dialog box

When connecting by specifying a connection string, provide a connection string similar to
`<add name ="connection" connectionString ="Data Source=<DNS_Name>;Integrated Security=false;User="login_name";Password="passprase" " providerName ="System.Data.SqlClient"/>`
 

where `<DNS_Name>` is the DNS name of this virtual machine.

## Connecting from a hosted service
To be completed.

# Next Steps #
## Configuring the Virtual Machine ##
Additional links to be determined.

## Migrating an Existing Database ##
Your existing database can be moved to this new instance of the Database Engine by using any of the following methods.

- Restore a database backup.
- Copy the mdf, ldf, and ndf files to a folder on this virtual machine, and then attach the database.
- Create scripts of the source database, and execute the scripts on this new instance of SQL Server.
- By using Copy Database Wizard in Management Studio.

For more information about migrating a database to SQL Server on a Windows Azure virtual machine, see Guide to Migrating Existing applications and Databases to Windows Azure Platform and Step-by-step guide to database migration.

## Create New Logins and Users ##
Create new Windows users, SQL Server Windows Authentication logins, and database users as you would any on-premises database. If you intend to use SQL Server Authentication you must configure the Database Engine for mixed mode authentication. The sa account is currently disabled. For information about how to change the authentication mode and enable the sa account, see [Change Server Authentication Mode](http://msdn.microsoft.com/en-us/library/ms188670.aspx).

## Adding Additional Instances of the Database Engine ##
The SQL Server setup media is saved on the virtual machine in the **C:\SQLServer*__**version***__Full** directory. Run setup from this directory to perform any setup actions including add or remove features, add a new instance, repair the instance, etc.

# Additional Information #

* For a short tutorial on installing a virtual machine and connecting to SQL Server:  [Tutorial: Installing a SQL Server Virtual Machine]( http://go.microsoft.com/fwlink/?LinkId=248281)