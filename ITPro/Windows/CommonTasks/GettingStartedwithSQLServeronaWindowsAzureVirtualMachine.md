# Getting Started with SQL Server on a Windows Azure Virtual Machine

The Windows Azure virtual machine gallery provides Windows Azure virtual machine images of Microsoft Windows Server 2008 R2, Service Pack 1 (64-bit) with  a complete 64-bit installation of SQL Server. A version of this virtual machine is available with SQL Server 2012 Evaluation (64-bit).

<div class="dev-callout"> 
<strong>Note</strong> 
<p>The evaluation edition is available for testing but cannot be upgraded to a per-hour  paid edition.</p> 
</div>

## About this Virtual Machine Image

###Windows Server 2008 R2

- Remote Desktop is enabled for the Administrator account.
- Windows Update is enabled.
- The Windows local Administrator account is the only user on the virtual machine is the only member of the local **Administrators** group.
- The virtual machine is a member of a workgroup named WORKGROUP.
- The **Guest** account is not enabled.
- The **Windows Firewall with Advanced Security** (c:\Windows\System32\WF.msc) is turned on.
- .NET Framework version 4 is installed.
- The size of the virtual machine is specified during provisioning.
    - Medium is the smallest size recommended for normal workloads. 
    - Select Large or Extra Large when using SQL Server Enterprise Edition. 
    - The size selected limits the number of disks you can configure. (Extra Small &lt;= 1, Small &lt;= 2, Medium &lt;= 4, Large &lt;= 8, Extra Large &lt;= 16) 


###SQL Server

This SQL Server installation contains the following components.

* Database Engine
* Analysis Services
* Integration Services
* Reporting Services (configured in Native mode)
* AlwaysOn Availability Groups are available in SQL Server 2012 but need additional configuration before they can be used.
* Replication
* Full-Text and Semantic Extractions for Search (Semantic Extractions in SQL Server 2012 only)
* Data Quality Services (SQL Server 2012 only)
* Master Data Services (SQL Server 2012 only), but requires additional configuration and components (including IIS).
* PowerPivot for SharePoint is available (SQL Server 2012 only), but requires additional configuration and components (including SharePoint).
* Distributed Replay Client is available (SQL Server 2012 only), but not installed. To run setup, see **Adding Additional Instances of the Database Engine** later in this topic.
* All tools, including SQL Server Management Studio, SQL Server Configuration Manager, and the Business Intelligence Development Studio.
* Client Tools Connectivity, Client Tools SDK, and SQL Client Connectivity SDK.
* SQL Server Books Online (SQL Server 2008 R2 only)

### Database Engine Configuration

- Contains a default (unnamed) instance of the SQL Server Database Engine, listening only on the shared memory protocol.
- The Database Engine is configured to use Windows Authentication only. 
- The Windows Azure user who installed the virtual machine is initially the only member of the SQL Server **sysadmin** fixed server role.
- The Database Engine memory is set to dynamic memory configuration. Contained database authentication is off. The default language is English. Cross-database ownership chaining is off. For more settings, examine the instance of SQL Server.
- Additional installations of SQL Server can be installed on the virtual machine, but they might require a PID (Product ID code).

## How to Connect To this Instance of SQL Server

### Connecting from Management Studio running on this VM

In the Management Studio **Connect to server** dialog box, enter the of the virtual computer in the **Server name** box. For more information, see [Tutorial: Getting Started with the Database Engine](http://msdn.microsoft.com/en-us/library/ms345318.aspx).

### Connecting from the Internet by using Management Studio

Additional configuration of SQL Server, the virtual machine, and Windows Azure is required to connect to SQL Server over the internet. For more information, see [Deploying a SQL Server Virtual Machine on Windows Azure](http://go.microsoft.com/fwlink/?LinkId=251117).
 
### Connecting from Management Studio running on another computer using Windows Azure Virtual Network

Windows Azure Virtual Network allows a virtual machine hosted on Windows Azure to interact more easily with your private network. There are multiple steps to properly configure the Windows Azure Virtual Network settings. Some configurations create optimal performance. Others are optimized for cost. For more information about Windows Azure Virtual Network, see [Overview of Windows Azure Virtual Network](http://go.microsoft.com/fwlink/?LinkId=251117).

- Configure a Windows Azure Virtual Network.

- Enable remote access by using SQL Server Configuration Manager to enable either the TCP or named pipes protocol and restart the Database Engine.

- Open TCP port 1433 in the Windows firewall for the default instance of the Database Engine. Open additional ports for other components as needed. For more information, see [Configuring the Windows Firewall to Allow SQL Server Access](http://msdn.microsoft.com/en-us/library/cc646023.aspx). 

Additional links to be determined.
 
### Connecting from your application running on another computer

Provide a connection string similar to
	
	&lt;add name ="connection" connectionString ="Data Source=VM_Name;Integrated Security=true;" providerName ="System.Data.SqlClient"/&gt;

where VM_Name is the name you provided for this virtual machine during setup.

## Next Steps

### Migrating an Existing Database
Your existing database can be moved to this new instance of the Database Engine by using any of the following methods.

- Restore a database backup.
- Copy the mdf, ldf, and ndf files to a folder on this virtual machine, and then attach the database.
- Create scripts of the source database, and execute the scripts on this new instance of SQL Server.
- By using Copy Database Wizard in Management Studio.

For more information about migrating a database to SQL Server on a Windows Azure virtual machine, see [Guide to Migrating Existing applications and Databases to Windows Azure Platform](http://go.microsoft.com/fwlink/?LinkId=249158) and migration steps near the end of [Deploying a SQL Server Virtual Machine on Windows Azure](http://go.microsoft.com/fwlink/?LinkId=251117).

### Turn Off Write Caching

For best performance, the Database Engine requires write caching to be OFF for both data and operating system disks. OFF is the default setting for data disks, for both read and write operations. However, ON is the default write caching setting for the operating system disk. New users who are evaluating performance on a simple single disk system should configure write caching to be OFF for the operating system disk. For instructions on configuring write caching, see How to Use PowerShell for Windows Azure.

### Create New Logins and Users

Create new Windows users, SQL Server Windows Authentication logins, and database users as you would any on-premises database. If you intend to use SQL Server Authentication you must configure the Database Engine for mixed mode authentication. The sa account is currently disabled. For information about how to change the authentication mode and enable the sa account, see [Change Server Authentication Mode](http://msdn.microsoft.com/en-us/library/ms188670.aspx).

### Adding Additional Instances of the Database Engine

The SQL Server setup media is saved on the virtual machine in the **C:\SQLServer\_&lt;version&gt;\_Full** directory. Run setup from this directory to perform any setup actions including add or remove features, add a new instance, repair the instance, etc.

## Additional Information

* For a tutorial on installing a virtual machine and connecting to SQL Server, see [Deploying a SQL Server Virtual Machine](http://go.microsoft.com/fwlink/?LinkId=248281).