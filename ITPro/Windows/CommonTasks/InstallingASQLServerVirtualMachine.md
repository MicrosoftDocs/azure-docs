<properties linkid="manage-windows-commontask-install-sql-server" urlDisplayName="Install SQL Server" pageTitle="Create a virtual machine with SQL Server in Windows Azure " metaKeywords="Azure tutorial creating SQL Server, SQL Server vm, configuring SQL Server" metaDescription="A tutorial that teaches you how to create and configure a SQL Server virtual machine on Windows Azure." metaCanonical="" disqusComments="1" umbracoNaviHide="0" writer="selcint" editor="tyson" manager="clairt"/>

<div chunk="../chunks/windows-left-nav.md" />

# Provisioning a SQL Server Virtual Machine on Windows Azure #

<div chunk="../../Shared/Chunks/disclaimer.md" />

The Windows Azure virtual machine gallery provides Windows Azure virtual machine images of Microsoft Windows Server 2008 R2, Service Pack 1 (64-bit) with a complete 64-bit installation of SQL Server. You can select one of the virtual machine images from the gallery and with a few clicks you can provision the virtual machine to your Windows Azure environment.

In this tutorial you will:

- [Connect to the Windows Azure management portal and provision a virtual machine from the gallery](#Provision)
- [Open the virtual machine using Remote Desktop and complete setup](#RemoteDesktop)
- [Complete configuration steps to connect to the virtual machine using SQL Server Management Studio on another computer](#SSMS)
- [Next steps](#Optional)

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
- In the **DNS NAME** box, provide the first portion of a DNS name of your choice, so that it completes a name in the format **TESTNAME.cloudapp.net** 
- In the **REGION/AFFINITY GROUP/VIRTUAL NETWORK** box, select a region where this virtual image will be hosted.

   Click the next arrow to continue.

	![VM Mode] [Image5]

6. On the **VM Options** page:
- In the **AVAILABILITY SET** box, select **(none)**. 
- Read and accept the legal terms.

	![VM Options] [Image6]

7. Click the check mark in the bottom right corner to continue.

8. Wait while Windows Azure prepares your virtual machine. Expect the virtual machine status to proceed through:

- Starting (Provisioning)
- Stopped
- Starting (Provisioning)
- Running (Provisioning)
- Running

	![VM Options] [Image7]

<h2 id="RemoteDesktop">Open the virtual machine using Remote Desktop and complete setup</h2>

1. When provisioning completes, click on the name of your virtual machine to go to the DASHBOARD page. At the bottom of the page, click **Connect**.

	![Select Dashboard Page] [Image5b]
2. Choose to open the rpd file using the Windows Remote Desktop program (`%windir%\system32\mstsc.exe`).

	![Click Open] [Image8]
3. At the **Windows Security** dialog box, provide the password for the **Administrator** account that you specified in an earlier step. (You might be asked to verify the credentials of the virtual machine.)

4. The first time you log on to this virtual machine, several processes may need to complete, including setup of your desktop, Windows updates, and completion of the Windows initial configuration tasks (sysprep). After Windows sysprep completes, SQL Server setup  completes configuration tasks. These tasks make cause a short delay while they complete. `SELECT @@SERVERNAME` may not return the correct name until SQL Server setup completes.

Once you are connected to the virtual machine with Windows Remote Desktop, the virtual machine works much like any other computer. Connect to the default instance of SQL Server with SQL Server Management Studio (running on the virtual machine) in the normal way. 

<h2 id="SSMS">Complete Configuration steps to connect to the virtual machine Using SQL Server Management Studio on another computer</h2>

Before you can connect to the instance of SQL Server from the internet, you must complete the following tasks as described in the sections that follow:

- [Create a TCP endpoint for the virtual machine](#Endpoint)
- [Open TCP ports in the Windows firewall](#FW)
- [Configure SQL Server to listen on the TCP protocol](#TCP)
- [Configure SQL Server for mixed mode authentication](#Mixed)
- [Create SQL Server authentication logins](#Logins)
- [Determine the DNS name of the virtual machine](#DNS)
- [Connect to the Database Engine from another computer](#Connect)

The connection path is summarized by the following diagram:

![Connecting to a SQL Server virtual machine][Image8b]

<h3 id="Endpoint">Create a TCP endpoint for the virtual machine</h3>

The virtual machine must have an endpoint to listen for incoming TCP communication. This Windows Azure configuration step, directs incoming TCP port traffic to a TCP port that is accessible to the virtual machine.

1. On the Windows Azure Management Portal, click on **VIRTUAL MACHINES**.

	![Select VM] [Image26]

2. Click on your newly created virtual machine. Information about your virtual machine is presented.

	![Click the VM] [Image27]

3. Near the top of the page, select the **ENDPOINTS** page, and then at the bottom of the page, click **ADD ENDPOINT**.

	![Click ADD ENDPOINT] [Image28]

4. On the **Add Endpoint to Virtual Machine** page, click **Add Endpoint**, and then click the Next arrow to continue.

	![Click Add endpoint] [Image29]

5. On the **New Endpoint Details** page, provide the following information.

- In the **NAME** box, provide a name for the endpoint.
- In the **PROTOCOL** box, select **TCP**.
- In the **PUBLIC PORT** box, type **1433** or a number of your choice. This is the TCP port receiving incoming TCP traffic. SQL Server typically uses TCP port 1433 which is the default port used by Management Studio. Since it is often a target for malicious users, many organizations select a different port number.
- In the **PRIVATE PORT** box, type **1433**. You may select another number if you wish. 

	![Endpoint screen] [Image30]

6. Click the check mark to continue. The endpoint is created.

	![VM with Endpoint] [Image31]

<h3 id="FW">Open TCP ports in the Windows firewall for the default instance of the Database Engine</h3>

1. On the Start menu, click **Run**, type **WF.msc**, and then click **OK**.


    ![Start the Firewall Program] [Image12]
2. In the **Windows Firewall with Advanced Security**, in the left pane, right-click **Inbound Rules**, and then click **New Rule** in the action pane.

    ![New Rule] [Image13]

3. In the **Rule Type** dialog box, select **Port**, and then click **Next**.

4. In the **Protocol and Ports** dialog box, select **TCP**. Select **Specific local ports**, and then type the port number of the instance of the Database Engine (**1433** for the default instance or your choice for the private port in the endpoint step). 

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


<h3 id="TCP">Configure SQL Server to listen on the TCP protocol</h3>

This step might already be complete.

1. While connected to the virtual machine by using Remote Desktop, on the Start menu, click **All Programs**, click **Microsoft SQL Server** *version*, click **Configuration Tools**, and then click **SQL Server Configuration Manager**.

    ![Open SSCM] [Image9]

2. In SQL Server Configuration Manager, in the console pane, expand **SQL Server Network Configuration**.

3. In the console pane, click **Protocols for _instance name_**. (The default instance is **Protocols for MSSQLSERVER**.)

4. In the details pane, right-click TCP, and then click **Enable** .

    ![Enable TCP] [Image10]

5. In the console pane, click **SQL Server Services**. (Restarting the Database Engine can be postponed until completion of the next step.)

6. In the details pane, right-click **SQL Server (_instance name_)** (the default instance is **SQL Server (MSSQLSERVER)**), and then click **Restart**, to stop and restart the instance of SQL Server. 

    ![Restart Database Engine] [Image11]

7. Close SQL Server Configuration Manager.

For more information about enabling protocols for the SQL Server Database Engine, see [Enable or Disable a Server Network Protocol](http://msdn.microsoft.com/en-us/library/ms191294.aspx).

<h3 id="Mixed">Configure SQL Server for mixed mode authentication</h3>

The SQL Server Database Engine cannot use Windows Authentication without domain environment. To connect to the Database Engine from another computer, configure SQL Server for mixed mode authentication. Mixed mode authentication allows both SQL Server Authentication and Windows Authentication. (Configuring mixed mode authentication might not be necessary if you have configured a Windows Azure Virtual Network. For more information about Windows Azure Virtual Network, see [Overview of Windows Azure Virtual Network](http://go.microsoft.com/fwlink/?LinkId=251117).)

1. While connected to the virtual machine by using Remote Desktop, on the Start menu, click **All Programs**, click **Microsoft SQL Server _version_**, and then click **SQL Server Management Studio**. 

    ![Start SSMS] [Image18]

The first time you open Management Studio it must create the users Management Studio environment. This may take a few moments.

2. When opening, Management Studio presents the **Connect to Server** dialog box. In the **Server name** box, type the name of the virtual machine to connect to the Database Engine  with the Object Explorer. (Instead of the virtual machine name you can also use **(local)** or a single period as the **Server name**. Select **Windows Authentication**, and leave **_your_VM_name_\Administrator** in the **User name** box. Click **Connect**.

    ![Connect to Server] [Image19]

3. In SQL Server Management Studio Object Explorer, right-click the name of the instance of SQL Server (the virtual machine name), and then click **Properties**.

    ![Server Properties] [Image20]

4. On the **Security** page, under **Server authentication**, select **SQL Server and Windows Authentication mode**, and then click **OK**.

    ![Select Authentication Mode] [Image21]

5. In the SQL Server Management Studio dialog box, click **OK** to acknowledge the requirement to restart SQL Server.

6. In Object Explorer, right-click your server, and then click **Restart**. (If SQL Server Agent is running, it must also be restarted.)

    ![Restart] [Image22]

7. In the SQL Server Management Studio dialog box, click **Yes** to agree that you want to restart SQL Server.

<h3 id="Logins">Create SQL Server authentication logins</h3>

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



<h3 id="DNS">Determine the DNS name of the virtual machine</h3>

To connect to the SQL Server Database Engine from another computer you must know the Domain Name System (DNS) name of the virtual machine. (This is the name the internet uses to identify the virtual machine. You can use the IP address, but the ip address might change when Windows Azure moves resources for redundancy or maintenance. The DNS name will be stable because it can be redirected to a new IP address.)  

1. In the Windows Azure Management Portal (or from the previous step), select **VIRTUAL MACHINES**. 

2. On the **VM INSTANCES** page, in the **DNS NAME** column, find and copy the DNS name for the virtual machine which appears preceded by **http://**. (The user interface might not display the entire name, but you can right-click on it, and select copy.)

    ![DNS Name] [Image32]

### Connect to the Database Engine from another computer ###
 
1. On a computer connected to the internet, open SQL Server Management Studio.

2. In the **Connect to Server** or **Connect to Database Engine** dialog box, in the **Server name** box, enter the DNS name of the virtual machine (determined in the previous task). The format is probably similar to **TESTVM.windowsazure.net**. (Do not include http://) If you selected a port number other than 1433 as the public port number for the endpoint, include a comma and the endpoint after the DNS name, in the format *DNSName,portnumber* such as **TESTVM.windowsazure.net,55124** )

3. In the **Authentication** box, select **SQL Server Authentication**.

4. In the **Login** box, type the name of a login that you created in an earlier task.

5. In the **Password** box, type the password of the login that you create in an earlier task.

6. Click **Connect**.

    ![Connect using SSMS] [Image33]

### Connecting to the Database Engine from your application ###

If you can connect to an instance of SQL Server running on a Windows Azure virtual machine by using Management Studio, you should be able to connect by using a connection string similar to the following.

	connectionString="Server=<DNS_Name>;Integrated Security=false;User ID=<login_name>;Password=<your_password>;"providerName="System.Data.SqlClient"

For more information, see [How to Troubleshoot Connecting to the SQL Server Database Engine](http://social.technet.microsoft.com/wiki/contents/articles/how-to-troubleshoot-connecting-to-the-sql-server-database-engine.aspx).

<h2 id="Optional">Next Steps</h2>
You've seen how to create and configure a SQL Server on a Windows Azure virtual machine using the platform image. When using SQL Server in Windows Azure Virtual Machines, we recommend that you keep all your business files, database files, log files, and backup files in the attached disks. In addition, make sure to reference your data, backup, and log files in the attached disks by following the steps described in this topic: [View or Change the Default Locations for Data and Log Files](http://msdn.microsoft.com/library/dd206993.aspx). We recommend that you do not store any persistent data in the temporary storage drive (D:\) as the temporary storage drive is not persistent. For more information on attaching disks in Windows Azure, see [How to Attach a Data Disk to a Virtual Machine](http://www.windowsazure.com/en-us/manage/windows/how-to-guides/attach-a-disk/).

**Turn off write caching**

By default, disk cache setting is enabled for Read and Write operations on the operating system disk. On the data disk, both read and write caching is disabled by default. We recommend that you use data disks instead of the operating system disk to store your database files. If you need to store the database files on the operating system disk, we recommend that you disable write caching once the virtual machine has been provisioned. For instructions on configuring disk caching, see the following topics: [Set-AzureOSDisk](http://msdn.microsoft.com/en-us/library/windowsazure/jj152847.aspx), [Set-AzureDataDisk](http://msdn.microsoft.com/en-us/library/windowsazure/jj152851.aspx), and [Managing Virtual Machines with the Windows Azure PowerShell Cmdlets](http://www.windowsazure.com/en-us/develop/training-kit/hol-automatingvmmanagementps/).

**Create database users**

To have access to a user database, logins that are not members of the sysadmin fixed server role must be mapped to database user. To do this you must create a database user. For more information about database users, see [Create a Database User](http://msdn.microsoft.com/en-us/library/aa337562.aspx).

**Adding additional instances of the Database Engine**

If you create a virtual machine by using the platform-provided SQL Server image, you can find the SQL Server setup media as saved on the virtual machine in the C:\SqlServer_11.0_Full directory. You can run setup from this directory to perform any setup actions including add or remove features, add a new instance, or repair the instance if the disk space permits. If you bring your own SQL Server image to Windows Azure and then need to install additional SQL Server features, make sure to have sufficient disk space in your virtual machine. 

### Guide for SQL Server in Windows Azure Virtual Machines ###

The [SQL Server in Windows Azure Virtual Machines](http://msdn.microsoft.com/en-us/library/windowsazure/jj823132.aspx) documentation in the MSDN library include a series of articles and tutorials that provide detailed guidance. The series includes the following sections:

[Connectivity Tutorials for SQL Server in Windows Azure Virtual Machines](http://msdn.microsoft.com/en-us/library/windowsazure/jj823133.aspx)

- Tutorial: Connect to SQL Server in the same cloud service 
- Tutorial: Connect to SQL Server in a different cloud service 
- Tutorial: Connect ASP.NET application to SQL Server in Windows Azure via Virtual Network 
 
[SQL Server High Availability and Disaster Recovery in Windows Azure Virtual Machines](http://msdn.microsoft.com/en-us/library/windowsazure/jj870962.aspx)

- Tutorial: AlwaysOn Availability Groups in Windows Azure 
- Tutorial: AlwaysOn Availability Groups in Hybird IT
- Tutorial: Database Mirroring for High Availability in Windows Azure
- Tutorial: Database Mirroring for Disaster Recovery in Windows Azure
- Tutorial: Database Mirroring for Disaster Recovery in Hybrid IT 
- Tutorial: Log Shipping for Disaster Recovery in Hybrid IT 

[SQL Server Business Intelligence in Windows Azure Virtual Machines](http://msdn.microsoft.com/en-us/library/windowsazure/jj992719.aspx)

[How to migrate SQL Server database files and schema between virtual machines in Windows Azure](http://msdn.microsoft.com/en-us/library/windowsazure/jj898505.aspx)

###See Also###

* [Getting started with SQL Server on a Windows Azure virtual machine](http://go.microsoft.com/fwlink/p/?LinkID=242213) 
* [Migrating to SQL Server in a Windows Azure Virtual Machine](http://msdn.microsoft.com/en-us/library/jj156165.aspx)
* [SQL Server in Windows Azure Virtual Machines](http://msdn.microsoft.com/en-us/library/jj823132.aspx)
* [Overview of Windows Azure Virtual Machines](http://msdn.microsoft.com/en-us/library/jj156143.aspx)
* [Migrating with Windows Azure Virtual Machines](http://msdn.microsoft.com/en-us/library/windowsazure/jj156159)
* [Migrating Data-Centric Applications to Windows Azure](http://msdn.microsoft.com/en-us/library/windowsazure/jj156154)
* [Support policy for Microsoft SQL Server products that are running in a hardware virtualization environment](http://support.microsoft.com/kb/956893)
* [How to guides for Windows virtual machines](http://www.windowsazure.com/en-us/manage/windows/how-to-guides/)

[Image1]: ../media/1Login.png
[Image2]: ../media/2select-gallery.png
[Image3]: ../media/3Select-Image.png
[Image4]: ../media/4VM-Config.png
[Image5]: ../media/5VM-Mode.png
[Image5b]: ../media/5VM-Connect.png
[Image6]: ../media/6VM-Options.png
[Image7]: ../media/7VM-Provisioning.png
[Image8]: ../media/8VM-Connect.png
[Image8b]: ../media/SQLVMConnectionsOnAzure.GIF
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
