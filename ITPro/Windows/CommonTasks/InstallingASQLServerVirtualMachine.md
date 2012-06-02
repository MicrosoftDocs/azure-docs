<properties umbracoNaviHide="0" pageTitle="Provisioning a SQL Server Virtual Machine on Windows Azure" metaKeywords="Windows Azure cloud services, cloud service, configure cloud service" metaDescription="Windows Tutorials." linkid="manage-windows-how-to-guide-storage-accounts" urlDisplayName="How to: storage accounts" headerExpose="" footerExpose="" disqusComments="1" />

# Provisioning a SQL Server Virtual Machine on Windows Azure #

<div chunk="../../Shared/Chunks/disclaimer.md" />

The Windows Azure virtual machine gallery provides Windows Azure virtual machine images of Microsoft Windows Server 2008 R2, Service Pack 1 (64-bit) with a complete 64-bit installation of SQL Server. You can select one of the virtual machine images from the gallery and with a few clicks you can provision the virtual machine to your Windows Azure environment.

To upload your own virtual machine image instead of using an image from the gallery, see [Creating and Uploading a Virtual Hard Drive that Contains the Windows Server Operating System](./upload-a-vhd/).

In this tutorial you will:

- [Connect to the Windows Azure Management Portal and Provision a Virtual Machine from the Gallery](#Provision)
- [Open the Virtual Machine Using Remote Desktop and Complete Setup](#RemoteDesktop)
- [Complete Configuration Steps to Connect to the Virtual Machine Using SQL Server Management Studio on Another Computer](#SSMS)
- [Optional Next Steps](#Optional)

<h2 id="Provision">Connect to the Windows Azure management portal and provision a virtual machine from the gallery</h2>

1. Log in to the [Windows Azure (Preview) Management Portal](http://manage.windowsazure.com) using your account. If you do not have a Windows Azure account, visit [Windows Azure 3 Month free trial](http://www.windowsazure.com/en-us/pricing/free-trial/).
	![Connect to Portal] [Image1]
2. On the Windows Azure Management Portal, at the bottom left of the web page, click **+NEW**, click **VIRTUAL MACHINE**, and then click **FROM GALLERY**.

	![Open the gallery] [Image2]

3. Select a virtual machine image containing SQL Server, and then click the next arrow at the bottom right of the page. For information about licensing, see [License Mobility Through Software Assurance](http://www.microsoft.com/licensing/software-assurance/license-mobility.aspx).

    <div class="dev-callout"> 
    <b>Note</b> 
    <p>The evaluation edition is available for testing but cannot be upgraded to a per-hour paid edition.</p> 
    </div>

	![Open the gallery] [Image3]


4. On the **VM Configuration** page, provide the following information:
- Provide a **VIRTUAL MACHINE NAME**.
- Leave the **NEW USER NAME** box as Administrator.
- In the **NEW PASSWORD** box, type a strong password. [Strong Passwords](http://msdn.microsoft.com/en-us/library/ms161962.aspx)
- In the **CONFIRM PASSWORD** box, retype the password.
- Select the appropriate **SIZE** from the drop down list. 

    <div class="dev-callout"> 
    <b>Note</b> 
    <p>Considerations related to size:
	<ul>
		<li>Medium is the smallest size recommended for production workloads.</li> 
		<li>Select Large or Extra Large when using SQL Server Enterprise Edition.</li>
		<li>The size selected limits the number of disks you can configure. (Extra Small &lt;= 1, Small &lt;= 2, Medium &lt;= 4, Large &lt;= 8, Extra Large &lt;= 16)</li></ul>
    </p> 
    </div>

   Click the next arrow in the bottom left (->) to continue.

	![VM Configuration] [Image4]



5. On **VM Mode** page, provide the following information:
- Select **Standalone Virtual Machine**.
- In the **DNS NAME** box, provide the first portion of the DNS name, so that it completes a name in the format **TESTNAME.cloudapp.net**
- In the **REGION/AFFINITY GROUP/VIRTUAL NETWORK** box, select a region where this virtual image will be hosted.

   Click the next arrow to continue.

	![VM Mode] [Image5]

6. On the **VM Options** page:
- In the **AVAILABILITY SET** box, select **(none)**. 
- Read and accept the legal terms.

	![VM Options] [Image6]

7. Click the check mark in the bottom right corner to continue.

8. Wait while Windows Azure prepares your virtual machine.

	![VM Options] [Image7]

<h2 id="RemoteDesktop">Open the virtual machine using Remote Desktop and complete setup</h2>

1. On the Windows Azure Management Portal, select your virtual machine, and select the DASHBOARD page.

	![Select Dashboard Page] [Image31]
2. At the bottom of the page, click **Connect**.

3. Choose to open the rpd file using the Windows Remote Desktop program (`%windir%\system32\mstsc.exe`).

	![Click Open] [Image8]
3. At the **Windows Security** dialog box, provide the password for the **Administrator** account that you specified in an earlier step. (You might be asked to verify the credentials of the virtual machine.)

4. The first time you log on to this virtual machine, several processes may need to complete, including setup of your desktop, Windows updates, and completion of the Windows initial configuration tasks (sysprep). After Windows sysprep completes, SQL Server setup  completes configuration tasks. These tasks make cause a short delay while they complete. `SELECT @@SERVERNAME` may not return the correct name until SQL Server setup completes.

Once you are connected to the virtual machine with Windows Remote Desktop, the virtual machine works much like any other computer. Connect to the default instance of SQL Server with SQL Server Management Studio (running on the virtual machine) in the normal way. 

<h2 id="SSMS">Complete Configuration steps to connect to the virtual machine Using SQL Server Management Studio on another computer</h2>

Before you can connect to the instance of SQL Server from the internet, the following tasks must be completed:

- Configure SQL Server to listen on the TCP protocol and restart the Database Engine.
- Open TCP ports in the Windows firewall.
- Configure SQL Server for mixed mode authentication.
- Create a SQL Server authentication login.
- Create a TCP endpoint for the virtual machine.
- Determine the DNS name of the virtual machine.

### Configure SQL Server to listen on the TCP protocol and restart the Database Engine. ###

1. While connected to the virtual machine by using Remote Desktop, on the Start menu, click **All Programs**, click **Microsoft SQL Server** *version*, click **Configuration Tools**, and then click **SQL Server Configuration Manager**.

    ![Open SSCM] [Image9]

2. In SQL Server Configuration Manager, in the console pane, expand **SQL Server Network Configuration**.

3. In the console pane, click **Protocols for _instance name_**. (The default instance is **Protocols for MSSQLSERVER**.)

4. In the details pane, right-click TCP, and then click **Enable** .

    ![Enable TCP] [Image10]

5. In the console pane, click **SQL Server Services**.

6. In the details pane, right-click **SQL Server (_instance name_)** (the default instance is **SQL Server (MSSQLSERVER)**), and then click **Restart**, to stop and restart the instance of SQL Server. 

    ![Restart Database Engine] [Image11]

7. Close SQL Server Configuration Manager.

For more information about enabling protocols for the SQL Server Database Engine, see [Enable or Disable a Server Network Protocol](http://msdn.microsoft.com/en-us/library/ms191294.aspx).

### Open TCP ports in the Windows firewall for the default instance of the Database Engine ###

1. On the Start menu, click **Run**, type **WF.msc**, and then click **OK**.


    ![Start the Firewall Program] [Image12]
2. In the **Windows Firewall with Advanced Security**, in the left pane, right-click **Inbound Rules**, and then click **New Rule** in the action pane.

    ![New Rule] [Image13]

3. In the **Rule Type** dialog box, select **Port**, and then click **Next**.

4. In the **Protocol and Ports** dialog box, select **TCP**. Select **Specific local ports**, and then type the port number of the instance of the Database Engine (**1433** for the default instance). 

    ![TCP Port 1433] [Image14]

5. Click **Next**.

6. In the **Action** dialog box, select **Allow the connection**, and then click **Next**.

    **Security Note:** Selecting **Allow the connection if it is secure** can provide additional security. Select this option if you want to configure additional security options in your environment.

    ![Allow Connections] [Image15]

7. In the **Profile** dialog box, select **Public**, and then click **Next**. 

    **Security Note:**  Selecting **Public** allows access over the internet. Whenever possible, select a more restrictive profile.

    ![Public Profile] [Image16]

8. In the **Name** dialog box, type a name and description for this rule, and then click **Finish**.

    ![Rule Name] [Image17]

Open additional ports for other components as needed. For more information, see [Configuring the Windows Firewall to Allow SQL Server Access](http://msdn.microsoft.com/en-us/library/cc646023.aspx).

### Configure SQL Server for mixed mode authentication ###

The SQL Server Database Engine cannot use Windows Authentication without domain environment. To connect to the Database Engine from a computer outside of the domain, configure SQL Server for mixed mode authentication. Mixed mode authentication allows both SQL Server Authentication and Windows Authentication. (Configuring mixed mode authentication might not be necessary if you have configured a Windows Azure Virtual Network. For more information about Windows Azure Virtual Network, see [Overview of Windows Azure Virtual Network](http://go.microsoft.com/fwlink/?LinkId=251117).)

1. While connected to the virtual machine by using Remote Desktop, on the Start menu, click **All Programs**, click **Microsoft SQL Server _version_**, and then click **SQL Server Management Studio**. 

    ![Start SSMS] [Image18]

2. When opening, Management Studio presents the **Connect to Server** dialog box. In the **Server name** box, type the name of the virtual machine to connect to the Database Engine  with the Object Explorer. (Instead of the virtual machine name you can also use **(local)** or a single period as the **Server name**. Select **Windows Authentication**, and leave **_your_VM_name_\Administrator** in the **User name** box. Click **Connect**.

    ![Connect to Server] [Image19]

3. In SQL Server Management Studio Object Explorer, right-click the server, and then click **Properties**.

    ![Server Properties] [Image20]

4. On the **Security** page, under **Server authentication**, select **SQL Server and Windows Authentication mode**, and then click **OK**.

    ![Select Authentication Mode] [Image21]

5. In the SQL Server Management Studio dialog box, click **OK** to acknowledge the requirement to restart SQL Server.

6. In Object Explorer, right-click your server, and then click **Restart**. (If SQL Server Agent is running, it must also be restarted.)

    ![Restart] [Image22]

7. In the SQL Server Management Studio dialog box, click **Yes** to agree that you want to restart SQL Server.

### Create SQL Server authentication logins ###

To connect to the Database Engine from another computer you must create at least one SQL Server authentication login.

1. In SQL Server Management Studio Object Explorer, expand the folder of the server instance in which you want to create the new login.

2. Right-click the **Security** folder, point to **New**, and select **Login…**.

    ![New Login] [Image23]

3. In the **Login – New** dialog box, on the **General** page, enter the name of the new user in the **Login name** box.

4. Select **SQL Server authentication**.

5. In the **Password** box, enter a password for the new user. Enter that password again into the **Confirm Password** box.

6. To enforce password policy options for complexity and enforcement, select **Enforce password policy** (recommended). This is a default option when SQL Server authentication is selected.

7. To enforce password policy options for expiration, select **Enforce password expiration** (recommended). Enforce password policy must be selected to enable this checkbox. This is a default option when SQL Server authentication is selected.

8. To force the user to create a new password after the first time the login is used, select **User must change password at next login** (Recommended if this login is for someone else to use. If the login is for your own use, do not select this option.) Enforce password expiration must be selected to enable this checkbox. This is a default option when SQL Server authentication is selected. 

9. From the **Default database** list, select a default database for the login. **master** is the default for this option. If you have not yet created a user database, leave this set to **master**.

10. In the **Default language** list, leave **default** as the value.
    
    ![Login Properties] [Image24]

11. If this is the first login you are creating, you may want to designate this login as a SQL Server administrator. If so, on the **Server Roles** page, check **sysadmin**. 

    **Security Note:** Members of the sysadmin fixed server role have complete control of the Database Engine. You should carefully restrict membership in this role.

    ![sysadmin] [Image25]

12. Click OK.

For more information about SQL Server logins, see [Create a Login](http://msdn.microsoft.com/en-us/library/aa337562.aspx).

### Create a TCP endpoint for the virtual machine ###

1. The virtual machine must have an endpoint to listen for incoming TCP requests. On the Windows Azure Management Portal, click on **VIRTUAL MACHINES**.

	![Select VM] [Image26]

2. Click on your newly created virtual machine. Information about your virtual machine is presented.

	![Click the VM] [Image27]

3. Near the top of the page, select the **ENDPOINTS** page, and then click **ADD ENDPOINT**.

	![Click ADD ENDPOINT] [Image28]

4. On the **Add endpoint to virtual machine** page, click **Add Endpoint**, and then click the Next arrow to continue.

	![Click Add endpoint] [Image29]

5. On the **New Endpoint Details** page, provide the following information.

- In the **NAME** box, provide a name for the endpoint.
- In the **PROTOCOL** box, select **TCP**.
- In the **PUBLIC PORT** box, type **1433**.
- In the **PRIVATE PORT** box, type **1433**.

	![Endpoint screen] [Image30]

7. Click the check mark to continue. The endpoint is created.

	![VM with Endpoint] [Image31]

**### Determine the DNS name of the virtual machine ###

To connect to the SQL Server Database Engine from another computer you must know the DNS name of the virtual machine.

1. In the Windows Azure Management Portal, select **VIRTUAL MACHINES**. 

2. On the **VM INSTANCES** page, in the **DNS NAME** column, find and copy the DNS name for the virtual machine which appears preceded by **http://**.

    ![DNS Name] [Image32]

### Connect to the Database Engine from another computer ###
 
1. On a computer connected to the internet, open SQL Server Management Studio.

2. In the **Connect to Server** or **Connect to Database Engine** dialog box, in the **Server name** box, enter the DNS name of the virtual machine (determined in the previous task). The format is probably similar to **TESTVM.windowsazure.net**.

3. In the **Authentication** box, select **SQL Server Authentication**.

4. In the **Login** box, type the name of a login that you created in an earlier task.

5. In the **Password** box, type the password of the login that you create in an earlier task.

6. Click **Connect**.

    ![Connect using SSMS] [Image33]

### Connecting to the Database Engine from your application ###

If you can connect to an instance of SQL Server running on a Windows Azure virtual machine by using Management Studio, you should be able to connect by using a connection string similar to the following.

	connectionString="Server=<DNS_Name>;Integrated Security=false;User ID=<login_name>;Password=<your_password>;"providerName="System.Data.SqlClient"


#### Additional Resources ####

- [How to Troubleshoot Connecting to the SQL Server Database Engine](http://social.technet.microsoft.com/wiki/contents/articles/how-to-troubleshoot-connecting-to-the-sql-server-database-engine.aspx)

<h2 id="Optional">Optional Next Steps</h2>

### Migrate an existing database ###

Your existing database can be moved to this new instance of the Database Engine by using any of the following methods.

- Copy a database backup file to the virtual machine and then restore the database. For more information, see [Back Up and Restore of SQL Server Databases](http://msdn.microsoft.com/en-us/library/ms187048(SQL.90).aspx).
- By using a data-tier application (DAC). Either deploy a data-tier application with just the database schema or import a database along with the database data by using a BACPAC file. For more information, see [Deploy a Data-tier Application](http://msdn.microsoft.com/en-us/library/ee210569.aspx), [Import a BACPAC File to Create a New User Database](http://msdn.microsoft.com/en-us/library/hh710052.aspx), and [How to Use Data-Tier Application Import and Export with SQL Azure (en-US)](http://social.technet.microsoft.com/wiki/contents/articles/2639.how-to-use-data-tier-application-import-and-export-with-sql-azure-en-us.aspx).
- Copy the **mdf**, **ndf**, and **ldf** files to a folder on the virtual machine, and then attach the database. For more information, see [Attach a Database](http://msdn.microsoft.com/en-us/library/ms190209.aspx).
- Create scripts of the source database, and execute the scripts on this new instance of SQL Server. For more information, see [Generate and Publish Scripts Wizard](http://msdn.microsoft.com/en-us/library/bb895179.aspx).
- By using [Copy Database Wizard](http://msdn.microsoft.com/en-us/library/ms188664.aspx) in Management Studio.

**Copy files to a virtual machine**

Small files (database backups or DACPAC files) can be copied to the virtual machine using copy/paste while connected using remote desktop. To transfer large files select one of the following options.

- Upload the file to BLOB storage in the same datacenter as the virtual machine, and then RDP to the virtual machine and download the file from BLOB storage. For more information, see [Windows Azure Storage](../fundamentals/cloud-storage/).

- Transfer files to a file system share after configuring a Windows Azure Virtual Network. For more information, see [Overview of Windows Azure Virtual Network](http://go.microsoft.com/fwlink/?LinkId=251117). 

- Transfer the file using FTP. There are multiple steps to using FTP, including configuring IIS, configuring an account in FTP, configuring a certificate for SSL, etc. For more information about FTP, see the Windows documentation for the [FTP Publishing Service](http://www.iis.net/download/FTP).

- Use a web browser to download a database from the Internet, such as downloading Adventure Works from codeplex [Download an AdventureWorks database](http://msftdbprodsamples.codeplex.com/).

For more information about migrating a database to Windows Azure, see [Guide to Migrating Existing applications and Databases to Windows Azure](http://go.microsoft.com/fwlink/?LinkId=249158).

### Turn off write caching ###

For best performance, the Database Engine requires write caching to be OFF for both data and operating system disks. OFF is the default setting for data disks, for both read and write operations. However, ON is the default write caching setting for the operating system disk. New users who are evaluating performance on a simple single disk system should configure write caching to be OFF for the operating system disk. For instructions on configuring write caching, see [How to Use PowerShell for Windows Azure](http://go.microsoft.com/fwlink/?LinkId=254236).

### Create database users ###

To have access to a user database, logins that are not members of the sysadmin fixed server role must be mapped to database user. To do this you must create a database user. For more information about database users, see [Create a Database User](http://msdn.microsoft.com/en-us/library/aa337562.aspx).

### Adding additional instances of the Database Engine ###

The SQL Server setup media is saved on the virtual machine in the C:\SqlServer_11.0_Full directory. Run setup from this directory to perform any setup actions including add or remove features, add a new instance, repair the instance, etc.


[Image1]: ../media/1Login.png
[Image2]: ../media/2select-gallery.png
[Image3]: ../media/3Select-Image.png
[Image4]: ../media/4VM-Config.png
[Image5]: ../media/5VM-Mode.png
[Image6]: ../media/6VM-Options.png
[Image7]: ../media/7VM-Provisioning.png
[Image8]: ../media/8VM-Connect.png
[Image9]: ../media/9Click-SSCM.png
[Image10]: ../media/10Enable-TCP.png
[Image11]: ../media/11Restart.png
[Image12]: ../media/12Open-WF.png
[Image13]: ../media/13New-FW-Rule.png
[Image14]: ../media/14Port-1433.png
[Image15]: ../media/15Allow-Connection.png
[Image16]: ../media/16Public-Profile.png
[Image17]: ../media/17Rule-Name.png
[Image18]: ../media/18Start-SSMS.png
[Image19]: ../media/19Connect-to-Server.png
[Image20]: ../media/20Server-Properties.png
[Image21]: ../media/21Mixed-Mode.png
[Image22]: ../media/22Restart2.png
[Image23]: ../media/23New-Login.png
[Image24]: ../media/24Test-Login.png
[Image25]: ../media/25sysadmin.png

[Image26]: ../media/26Select-your-VM.png
[Image27]: ../media/27VM-Connect.png
[Image28]: ../media/28Add-Endpoint.png
[Image29]: ../media/29Add-Endpoint-to-VM.png
[Image30]: ../media/30Endpoint-Details.png
[Image31]: ../media/31VM-Connect.png

[Image32]: ../media/32DNS-Name.png
[Image33]: ../media/33Connect-SSMS.png
