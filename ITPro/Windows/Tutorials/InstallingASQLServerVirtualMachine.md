# Deploying a SQL Server Virtual Machine

The Windows Azure virtual machine gallery provides Windows Azure virtual machine images of Microsoft Windows Server 2008 R2, Service Pack 1 (64-bit) with  a complete 64-bit installation of SQL Server. You can select one of the virtual machine images from the Windows Azure gallery and with a few clicks you can deploy the virtual machine to your Windows Azure environment.

You will learn:

- How to use the Windows Azure Management Portal to select and install a virtual machine from the gallery.
- How to connect to the virtual machine using Remote Desktop.
- How to connect to SQL Server on the virtual machine using SQL Server Management Studio or your application.

## Connect to the Windows Azure Management Portal and Provision a Virtual Machine Image ##

1. Login to the Windows Azure Management Portal [http://windows.azure.com](http://windows.azure.com) using your account. If you do not have a Windows Azure account visit [Windows Azure 3 Month free trial](http://www.windowsazure.com/en-us/pricing/free-trial/).
2. On the Windows Azure Management Portal, at the bottom left of the web page, click **+NEW**, click **VIRTUAL MACHINE**, and then click **FROM GALLERY**.

	![Open the gallery] [Image1]

3. Select a virtual machine image containing SQL Server, and then click the next arrow at the bottom right of the page.

4. On the **VM Configuration** page, provide the following information:
- Provide a **VIRTUAL MACHINE NAME**.
- Leave the **CHOOSE USER NAME** box as Administrator.
- In the **CHOOSE PASSWORD** box, type a strong password. [Strong Passwords](http://msdn.microsoft.com/en-us/library/ms161962.aspx)
- In the **CONFIRM PASSWORD** box, retype the password.
- Select the appropriate **SIZE** from the drop down list.

   Click the next arrow to continue.

	![VM Configuration] [Image2]
5. On **VM Mode** page, provide the following information:
- Select **Standalone Virtual Machine**.
- In the **DNS NAME** box, type a valid DNS in the format **TESTNAME.cloudapp.net**
- In the **REGION/AFFINITY GROUP/VIRTUAL NETWORK** box, select a region where this virtual image will be hosted.
- Leave the **SUBSCRIPTION** box, validate your account selection.

   Click the next arrow to continue.

	![VM Configuration] [Image3]
6. In the **VM Options** box, select **(none)**.
7. Click the check mark to continue.
8. Wait while Windows Azure prepares your virtual machine.

## Open the Virtual Machine Using Remote Desktop and Complete Setup ##

1. After the virtual machine is provisioned, on the Windows Azure Management Portal, click on **VIRTUAL MACHINES**, and the click on your new virtual machine. Information about your virtual machine is presented.

	![Select VM] [Image4]
2. At the bottom of the page, click **Connect**. Choose to open the rpd file using the Windows Remote Desktop program (`%windir%\system32\mstsc.exe`).
	![Click Connect] [Image5]
3. At the **Windows Security** dialog box, provide the password for the **Administrator** account. (You might be asked to verify the credentials of the virtual machine.)
4. The first time you log on to this virtual machine, several processes may need to complete, including setup of your desktop, Windows updates, and completion of the Windows initial configuration tasks. `SELECT @@SERVERNAME` may not return the correct name until SQL Server setup completes.

Once you are connected to the virtual machine with Windows Remote Desktop, the virtual machine works like any other computer. Connect to the default instance of SQL Server with SQL Server Management Studio in the normal way. If you need additional training on connecting to the Database Engine, see [Tutorial: Getting Started with the Database Engine](http://msdn.microsoft.com/en-us/library/ms345318.aspx).

## Connecting to the Virtual Machine Using SQL Server Management Studio or Your Application ##

Before you can connect to the instance of SQL Server from the internet, the following tasks must be completed:

- Create a TCP endpoint for the virtual machine.
- Configure SQL Server to listen on the TCP protocol and restart the Database Engine.
- Open TCP ports in the Windows firewall.
- Configure SQL Server for mixed mode authentication.
- Create a SQL Server authentication login.
- Determine the DNS name and IP address of the virtual machine.

### Configure SQL Server to listen on the TCP protocol and restart the Database Engine. ###

1. While connected to the virtual machine by using Remote Desktop, on the Start menu, click **All Programs**, click **Microsoft SQL Server** *version*, click **Configuration Tools**, and then click **SQL Server Configuration Manager**.

    ![Open SSCM] [Image6]

2. In SQL Server Configuration Manager, in the console pane, expand **SQL Server Network Configuration**.

3. In the console pane, click **Protocols for** *instance name*. (The default instance is **Protocols for MSSQLSERVER**.)

4. In the details pane, right-click TCP, and then click **Enable** .

    ![Enable TCP] [Image7]

5. In the console pane, click **SQL Server Services**.

6. In the details pane, right-click **SQL Server (***instance name***)** (the default instance is **SQL Server (MSSQLSERVER)**), and then click **Restart**, to stop and restart the instance of SQL Server. 

    ![Restart Database Engine] [Image8]

7. Close SQL Server Configuration Manager.

For more information about enabling protocols for the SQL Server Database Engine, see [Enable or Disable a Server Network Protocol](http://msdn.microsoft.com/en-us/library/ms191294.aspx).

### Open TCP ports in the Windows firewall for the default instance of the Database Engine ###

1. On the Start menu, click **Run**, type **WF.msc**, and then click **OK**.

2. In the **Windows Firewall with Advanced Security**, in the left pane, right-click **Inbound Rules**, and then click **New Rule** in the action pane.

    ![New Rule] [Image9]

3. In the **Rule Type** dialog box, select **Port**, and then click **Next**.

4. In the **Protocol and Ports** dialog box, select **TCP**. Select **Specific local ports**, and then type the port number of the instance of the Database Engine (**1433** for the default instance). 

    ![TCP Port 1433] [Image10]

5. Click **Next**.

6. In the **Action** dialog box, select **Allow the connection**, and then click **Next**.

    **Security Note:** Selecting **Allow the connection if it is secure** can provide additional security. Select this option if you want to configure additional security options in your environment.

    ![Allow Connections] [Image11]

7. In the **Profile** dialog box, select **Public**, and then click **Next**. 

    **Security Note:**  Selecting **Public** allows access over the internet. Whenever possible, select a more restrictive profile.

    ![Public Profile] [Image12]

8. In the **Name** dialog box, type a name and description for this rule, and then click **Finish**.

Open additional ports for other components as needed. For more information, see [Configuring the Windows Firewall to Allow SQL Server Access](http://msdn.microsoft.com/en-us/library/cc646023.aspx).

### Configure SQL Server for mixed mode authentication. ###

The SQL Server Database Engine cannot use Windows Authentication without domain environment. To connect to the Database Engine from a computer outside of the domain, configure SQL Server for mixed mode authentication. Mixed mode authentication allows both SQL Server Authentication and Windows Authentication.

1. While connected to the virtual machine by using Remote Desktop, on the Start menu, click **All Programs**, click **Microsoft SQL Server** *version*, and then click **SQL Server Management Studio**. 

    ![Start SSMS] [Image13]

2. When opening, Management Studio presents the **Connect to Server** dialog box. In the **Server name** box, type the name of the virtual machine to connect to SQL Server with the Object Explorer. (Instead of the virtual machine name you can also use **(local)** or a single period as the **Server name**. Select **Windows Authentication**, and leave *your_VM_name***\Administrator** in the User name box. Click **Connect**.

    ![Connect to Server] [Image14]

3. In SQL Server Management Studio Object Explorer, right-click the server, and then click **Properties**.

    ![Server Properties] [Image15]

4. On the **Security** page, under **Server authentication**, select **SQL Server and Windows Authentication mode**, and then click **OK**.

    ![Select Authentication Mode] [Image16]

5. In the SQL Server Management Studio dialog box, click **OK** to acknowledge the requirement to restart SQL Server.

6. In Object Explorer, right-click your server, and then click **Restart**. (If SQL Server Agent is running, it must also be restarted.)

    ![Restart] [Image17]

7. In the SQL Server Management Studio dialog box, click **Yes** to agree that you want to restart SQL Server.

### Create SQL Server authentication logins ###

To connect to the Database Engine from another computer you must create at least one SQL Server authentication login.

1. In SQL Server Management Studio Object Explorer, expand the folder of the server instance in which you want to create the new login.

2. Right-click the **Security** folder, point to **New**, and select **Login…**.

    ![New Login] [Image18]

3. In the **Login – New** dialog box, on the **General** page, enter the name of the new user in the **Login name** box.

4. Select **SQL Server authentication**.

5. In the **Password** box, enter a password for the new user. Enter that password again into the **Confirm Password** box.

6. To enforce password policy options for complexity and enforcement, select **Enforce password policy** (recommended). This is a default option when SQL Server authentication is selected.

7. To enforce password policy options for expiration, select **Enforce password expiration** (recommended). Enforce password policy must be selected to enable this checkbox. This is a default option when SQL Server authentication is selected.

8. To force the user to create a new password after the first time the login is used, select **User must change password at next login** (recommended). Enforce password expiration must be selected to enable this checkbox. This is a default option when SQL Server authentication is selected.

9. From the **Default database** list, select a default database for the login. **master** is the default for this option. If you have not yet created a user database, leave this set to **master**.

10. In the **Default language** list, leave **default** as the value.
    
    ![Login Properties] [Image19]

11. If this is the first login you are creating, you may want to designate this login as a SQL Server administrator. If so, on the **Server Roles** page, check **sysadmin**. 

    **Security Note:** Members of the sysadmin fixed server role have complete control of the Database Engine. You should carefully restrict membership in this role.

    ![sysadmin] [Image20]

12. Click OK.

For more information about SQL Server logins, see [Create a Login](http://msdn.microsoft.com/en-us/library/aa337562.aspx).

### Determine the DNS name of the virtual machine ###

To connect to the SQL Server Database Engine from another computer you must know the DNS name of the virtual machine.

1. In the Windows Azure Management Portal, select **VIRTUAL MACHINES**. 

2. On the **VM INSTANCES** page, in the **DNS NAME** column, find and copy the DNS name for the virtual machine which appears preceded by **http://**.

    ![DNS Name] [Image21]

### Connect to the Database Engine from another computer ###
 
1. On a computer connected to the internet, open SQL Server Management Studio.

2. In the **Connect to Server** or **Connect to Database Engine** dialog box, in the Server name box, enter the DNS name of the virtual machine (determined in the previous task). The format is probably similar to **TESTVM.windowsazure.net**.

3. In the **Authentication** box, select **SQL Server Authentication**.

4. In the **Login** box, type the name of a login that you created in an earlier task.

5. In the **Password** box, type the password of the login that you create in an earlier task.

6. Click **Connect**.

    ![Connect using SSMS] [Image22]

### Connecting to the Database Engine from your application ###

If you can connect to an instance of SQL Server running on a Windows Azure virtual machine by using Management Studio, you should be able to connect by using a connection string similar to the following.

`connectionString="Server=<DNS_Name>;Integrated Security=false;User ID=<login_name>;Password=<your_password>;"providerName="System.Data.SqlClient"`


#### Additional Resources ####

- [How to Troubleshoot Connecting to the SQL Server Database Engine](http://social.technet.microsoft.com/wiki/contents/articles/how-to-troubleshoot-connecting-to-the-sql-server-database-engine.aspx)

## Optional Next Steps ##

### Migrating an Existing Database ###

Your existing database can be moved to this new instance of the Database Engine by using any of the following methods.

- Restore a database backup.
- Copy the **mdf**, **ndf**, and **ldf** files to a folder on this virtual machine, and then attach the database.
- Create scripts of the source database, and execute the scripts on this new instance of SQL Server.
- By using [Copy Database Wizard](http://msdn.microsoft.com/en-us/library/ms188664.aspx) in Management Studio.
- By using DAC Import/Export

For more information about migrating a database to SQL Server on a Windows Azure virtual machine, see Guide to Migrating Existing applications and Databases to Windows Azure Platform and Step-by-step guide to database migration.

### Creating Database Users ###

To have access to a user database, logins that are not members of the sysadmin fixed server role must be mapped to database user. To do this you must create a database user. For more information about database users, see [Create a Database User](http://msdn.microsoft.com/en-us/library/aa337562.aspx).

### Adding Additional Instances of the Database Engine ###

The SQL Server setup media is saved on the virtual machine in the C:\SqlServer_11.0_Full directory. Run setup from this directory to perform any setup actions including add or remove features, add a new instance, repair the instance, etc.


[Image1]: media/1select-gallery-screenshot.png
[Image2]: media/2VM-Config.png
[Image3]: media/3VM-Mode.png
[Image4]: media/4Select-your-VM.png
[Image5]: media/5VM-Connect.png
[Image6]: media/6Click-SSCM.png
[Image7]: media/7Enable-TCP.png
[Image8]: media/8Restart.png
[Image9]: media/9New-FW-Rule.png
[Image10]: media/10Port-1433.png
[Image11]: media/11Allow-Connection.png
[Image12]: media/12Public-Profile.png
[Image13]: media/13Start-SSMS.png
[Image14]: media/14Connect-to-Server.png
[Image15]: media/15Server-Properties.png
[Image16]: media/16Mixed-Mode.png
[Image17]: media/17Restart.png
[Image18]: media/18New-Login.png
[Image19]: media/19Test-Login.png
[Image20]: media/20sysadmin.png
[Image21]: media/21DNS-Name.png
[Image22]: media/22Connect-SSMS.png