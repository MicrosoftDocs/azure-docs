<properties 
	pageTitle="Set up an Azure SQL Server virtual machine for data science | Azure" 
	description="Set up a Data Science Virtual Machine with SQL Server and IPython Server." 
	services="machine-learning" 
	solutions="" documentationCenter="" 
	authors="msolhab,xibingaomsft" 
	manager="paulettm" 
	editor="cgronlun" />

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/18/2015" 
	ms.author="mohabib;xibingao" />

# Set up an Azure SQL Server virtual machine for data science

This topic shows how to provision and configure an SQL Server virtual machine to be used as part of a cloud-based data science environment. The Windows virtual machine is configured with supporting tools such as IPython Notebook, Azure Storage Explorer and AzCopy, as well as other utilities that are useful for data science projects. Azure Storage Explorer and AzCopy, for example, provide convenient ways to upload data to Azure blob storage from your local machine or to download it to your local machine from blob storage.

The Azure virtual machine gallery includes several images that contain Microsoft SQL Server. Select an SQL Server VM image that is suitable for your data needs. Recommended images are:

- SQL Server 2012 SP2 Enterprise for small to medium data sizes
- SQL Server 2012 SP2 Enterprise Optimized for DataWarehousing Workloads for large to very large data sizes

 > [AZURE.NOTE] SQL Server 2012 SP2 Enterprise image **does not include a data disk**. You will need to add and/or attach one or more virtual hard disks to store your data. When you create an Azure virtual machine, it has a disk for the operating system mapped to the C drive and a temporary disk mapped to the D drive. Do not use the D drive to store data. As the name implies, it provides temporary storage only. It offers no redundancy or backup because it doesn't reside in Azure storage.


##<a name="Provision"></a>Connect to the Azure management portal and provision an SQL Server virtual machine

1.  Log in to the [Azure Management Portal](http://manage.windowsazure.com/) using your account. 
	If you do not have an Azure account, visit [Azure free
    trial](http://www.windowsazure.com/pricing/free-trial/).

2.  On the Azure Management Portal, at the bottom left of the web page,
    click **+NEW**, click **COMPUTE**, click **VIRTUAL MACHINE**, and
    then click **FROM GALLERY**.

3.  On the **Create a Virtual Machine** page, select a virtual machine
    image containing SQL Server based on your data needs, and then click the next arrow at the
    bottom right of the page. For the most up-to-date information on the supported SQL Server images on Azure, 
    see [Getting Started with SQL Server in Azure Virtual Machines](http://go.microsoft.com/fwlink/p/?LinkId=294720) topic in the [SQL Server in Azure Virtual Machines](http://go.microsoft.com/fwlink/p/?LinkId=294719) documentation set.

	![Select SQL Server VM][1]

4.  On the first **Virtual Machine Configuration** page, provide the
    following information:

    -   Provide a **VIRTUAL MACHINE NAME**.
    -   In the **NEW USER NAME** box, type unique user name for the VM
        local administrator account.
    -   In the **NEW PASSWORD** box, type a strong password. For more
        information, see [Strong Passwords](http://msdn.microsoft.com/library/ms161962.aspx).
    -   In the **CONFIRM PASSWORD** box, retype the password.
    -   Select the appropriate **SIZE** from the drop down list.

     > [AZURE.NOTE] The size of the virtual machine is specified during provisioning: A2
    is the smallest size recommended for production workloads. The
    minimum recommended size for a virtual machine is A3 when using SQL
    Server Enterprise Edition. Select A3 or higher when using SQL Server
    Enterprise Edition. Select A4 when using SQL Server 2012 or 2014
    Enterprise Optimized for Transactional Workloads images.
     Select A7 when using SQL Server 2012 or 2014 Enterprise Optimized
    for Data Warehousing Workloads images. The size selected limits the
    number of data disks you can configure. For most up-to-date
    information on available virtual machine sizes and the number of
    data disks that you can attach to a virtual machine, see [Virtual
    Machine Sizes for
    Azure](http://msdn.microsoft.com/library/azure/dn197896.aspx). For pricing information, see [VIrtual Macines Pricing](http://azure.microsoft.com/pricing/details/virtual-machines/).

    Click the next arrow on the bottom right to continue.

    ![VM Configuration][2]

5.  On the second **Virtual machine configuration** page, configure
    resources for networking, storage, and availability:

    -   In the **Cloud Service** box, choose **Create a new cloud
        service**.
    -   In the **Cloud Service DNS Name** box, provide the first portion
        of a DNS name of your choice, so that it completes a name in the
        format **TESTNAME.cloudapp.net**
    -   In the **REGION/AFFINITY GROUP/VIRTUAL NETWORK** box, select a
        region where this virtual image will be hosted.
    -   In the **Storage Account**, select an existing storage account
        or select an automatically generated one.
    -   In the **AVAILABILITY SET** box, select **(none)**.
    -   Read and accept the pricing information.

6.	In the **ENDPOINTS** section, click in the empty dropdown under **NAME**, and
	select **MSSQL**  then type the port number of the
    instance of the Database Engine (**1433** for the default instance).

7.  Your SQL Server VM can also serve as an IPython Notebook Server, which will be configured in a later step. 
	Add a new endpoint to specify the port to use for your IPython Notebook server. Enter a name in the **NAME** column,	select a port number of your choice for the public port, and 9999 for the private port.

	Click the next arrow on the bottom right to continue.

	![Select MSSQL and IPython ports][3]

8.  Accept the default **Install VM agent** option checked and click the the check mark in the bottom right
	corner of the wizard to complete the VM provisioning process.

	`![VM Final Options][4]

9.  Wait while Azure prepares your virtual machine. Expect the virtual
    machine status to proceed through:

    -   Starting (Provisioning)
    -   Stopped
    -   Starting (Provisioning)
    -   Running (Provisioning)
    -   Running

##<a name="RemoteDesktop"></a>Open the virtual machine using Remote Desktop and complete setup

1.  When provisioning completes, click on the name of your virtual
    machine to go to the DASHBOARD page. At the bottom of the page,
    click **Connect**.

2.  Choose to open the rpd file using the Windows Remote Desktop program
    (`%windir%\system32\mstsc.exe`).

3.  At the **Windows Security** dialog box, provide the password for the
    local administrator account that you specified in an earlier step.
    (You might be asked to verify the credentials of the virtual
    machine.)

4.  The first time you log on to this virtual machine, several processes
    may need to complete, including setup of your desktop, Windows
    updates, and completion of the Windows initial configuration tasks
    (sysprep). After Windows sysprep completes, SQL Server setup
    completes configuration tasks. These tasks may cause a delay of a
    few minutes while they complete. `SELECT @@SERVERNAME` may not
    return the correct name until SQL Server setup completes, and SQL
    Server Management Studio may not be visable on the start page.

Once you are connected to the virtual machine with Windows Remote
Desktop, the virtual machine works much like any other computer. Connect
to the default instance of SQL Server with SQL Server Management Studio
(running on the virtual machine) in the normal way.

##<a name="InstallIPython"></a>Install IPython Notebook and other supporting tools

To configure your new SQL Server VM to serve as an IPython Notebook server, and install additional
supporting tools such AzCopy, Azure Storage Explorer, useful Data Science Python packages, and others, 
a special customization script is provided to you. To install:

- Right-click the Windows Start icon and click **Command Prompt (Admin)**
- Copy the following commands and paste at the command prompt. 

    	set script='https://raw.githubusercontent.com/Azure/Azure-MachineLearning-DataScience/master/Misc/MachineSetup/Azure_VM_Setup_Windows.ps1'
    	@powershell -NoProfile -ExecutionPolicy unrestricted -Command "iex ((new-object net.webclient).DownloadString(%script%))"

- When prompted, enter a password of your choice for the IPython Notebook server.
- The customization script automates several post-install procedures, which include:
	+ Installation and setup of IPython Notebook server
	+ Opening TCP ports in the Windows firewall for the endpoints created earlier:
	+ For SQL Server remote connectivity
	+ For IPython Notebook server remote connectivity
	+ Fetching sample IPython notebooks and SQL scripts
	+ Downloading and installing useful Data Science Python packages
	+ Downloading and installing Azure tools such as AzCopy and Azure Storage Explorer  
<br>
- You may access and run IPython Notebook from any local or remote browser using a URL of the form `https://<virtual_machine_DNS_name>:<port>`, where port is the IPython public port you selected while provisioning the virtual machine.
- IPython Notebook server is running as a background service and will be restarted automatically when you restart the virtual machine.

##<a name="Optional"></a>Attach data disk as needed

If your VM image does not include data disks, i.e., disks other than C drive (OS disk) and D drive (temporary disk), you need to add one or more data disks to store your data. The VM image for SQL Server 2012 SP2 Enterprise Optimized for DataWarehousing Workloads comes pre-configured with additional disks for SQL Server data and log files.

 > [AZURE.NOTE] Do not use the D drive to store data. As the name implies, it provides temporary storage only. It offers no redundancy or backup because it doesn't reside in Azure storage.

To attach additional data disks, follow the steps described in [How to Attach a Data Disk to a Windows Virtual Machine](storage-windows-attach-disk.md), which will guide you through:

1. Attaching empty disk(s) to the virtual machine provisioned in earlier steps
2. Initialization of the new disk(s) in the virtual machine


##<a name="SSMS"></a>Connect to SQL Server Management Studio and enable mixed mode authentication

The SQL Server Database Engine cannot use Windows Authentication without
domain environment. To connect to the Database Engine from another
computer, configure SQL Server for mixed mode authentication. Mixed mode
authentication allows both SQL Server Authentication and Windows
Authentication. SQL authentication mode is required in order to ingest data 
directly from your SQL Server VM databases in the 
[Azure Machine Learning Studio](https://studio.azureml.net) using the Reader module.

1.  While connected to the virtual machine by using Remote Desktop, use the Windows **Search** pane and type **SQL Server Management Studio** (SMSS). Click to start the SQL Server Management Studio (SSMS). You may want to add a shortcut to SSMS on your Desktop for future use.

    ![Start SSMS][5]

    The first time you open Management Studio it must create the users
    Management Studio environment. This may take a few moments.

2.  When opening, Management Studio presents the **Connect to Server**
    dialog box. In the **Server name** box, type the name of the virtual
    machine to connect to the Database Engine with the Object Explorer.
    (Instead of the virtual machine name you can also use **(local)** or
    a single period as the **Server name**. Select **Windows
    Authentication**, and leave
    ***your\_VM\_name*\\your\_local\_administrator** in the **User
    name** box. Click **Connect**.

    ![Connect to Server][6]

	<br>

	 > [AZURE.TIP] You may change the SQL Server authentication mode using a Windows registry key change or using the SQL Server Management Studio. To change authentication mode using the registry key change, start a **New Query** and execute the following script:
	
		USE master
    	go
    	
    	EXEC xp_instance_regwrite N'HKEY_LOCAL_MACHINE', N'Software\Microsoft\MSSQLServer\MSSQLServer', N'LoginMode', REG_DWORD, 2
    	go


	To change the authentication mode using SQL Server management Studio:

3.  In SQL Server Management Studio Object Explorer, right-click the
    name of the instance of SQL Server (the virtual machine name), and
    then click **Properties**.

    ![Server Properties][7]

4.  On the **Security** page, under **Server authentication**, select
    **SQL Server and Windows Authentication mode**, and then click
    **OK**.

    ![Select Authentication Mode][8]

5.  In the SQL Server Management Studio dialog box, click **OK** to
    acknowledge the requirement to restart SQL Server.

6.  In Object Explorer, right-click your server, and then click
    **Restart**. (If SQL Server Agent is running, it must also be
    restarted.)

    ![Restart][9]

7.  In the SQL Server Management Studio dialog box, click **Yes** to
    agree that you want to restart SQL Server.

##<a name="Logins"></a>Create SQL Server authentication logins

To connect to the Database Engine from another computer, you must create
at least one SQL Server authentication login.  

> [AZURE.TIP] You may create new SQL Server logins programmatically or using the SQL Server Management Studio. To create a new sysadmin user with SQL authentication programatically, start a **New Query** and execute the following script. Replace <new user name\> and <new password\> with your choice of user name and password. Adjust the password policy as needed (the sample code turns off policy checking and password expiration). For more information about SQL Server logins, see [Create a Login](http://msdn.microsoft.com/library/aa337562.aspx).  
	
    USE master
    go
    
    CREATE LOGIN <new user name> WITH PASSWORD = N'<new password>',
    	CHECK_POLICY = OFF,
    	CHECK_EXPIRATION = OFF;
    
    EXEC sp_addsrvrolemember @loginame = N'<new user name>', @rolename = N'sysadmin';

To create new SQL Server logins using the SQL Server Management Studio:

1.  In SQL Server Management Studio Object Explorer, expand the folder
    of the server instance in which you want to create the new login.

2.  Right-click the **Security** folder, point to **New**, and select
    **Login…**.

    ![New Login][10]

3.  In the **Login - New** dialog box, on the **General** page, enter
    the name of the new user in the **Login name** box.

4.  Select **SQL Server authentication**.

5.  In the **Password** box, enter a password for the new user. Enter
    that password again into the **Confirm Password** box.

6.  To enforce password policy options for complexity and enforcement,
    select **Enforce password policy** (recommended). This is a default
    option when SQL Server authentication is selected.

7.  To enforce password policy options for expiration, select **Enforce
    password expiration** (recommended). Enforce password policy must be
    selected to enable this checkbox. This is a default option when SQL
    Server authentication is selected.

8.  To force the user to create a new password after the first time the
    login is used, select **User must change password at next login**
    (Recommended if this login is for someone else to use. If the login
    is for your own use, do not select this option.) Enforce password
    expiration must be selected to enable this checkbox. This is a
    default option when SQL Server authentication is selected.

9.  From the **Default database** list, select a default database for
    the login. **master** is the default for this option. If you have
    not yet created a user database, leave this set to **master**.

10. In the **Default language** list, leave **default** as the value.

    ![Login Properties][11]

11. If this is the first login you are creating, you may want to
    designate this login as a SQL Server administrator. If so, on the
    **Server Roles** page, check **sysadmin**.

    **Security Note:** Members of the sysadmin fixed server role have
    complete control of the Database Engine. You should carefully
    restrict membership in this role.

    ![sysadmin][12]

12. Click OK.

##<a name="DNS"></a>Determine the DNS name of the virtual machine

To connect to the SQL Server Database Engine from another computer, you
must know the Domain Name System (DNS) name of the virtual machine.
(This is the name the internet uses to identify the virtual machine. You
can use the IP address, but the IP address might change when Azure moves
resources for redundancy or maintenance. The DNS name will be stable
because it can be redirected to a new IP address.)

1.  In the Azure Management Portal (or from the previous step), select
    **VIRTUAL MACHINES**.

2.  On the **VIRTUAL MACHINE INSTANCES** page, in the **DNS NAME**
    column, find and copy the DNS name for the virtual machine which
    appears preceded by **http://**. (The user interface might not
    display the entire name, but you can right-click on it, and select
    copy.)

##<a name="cde"></a>Connect to the Database Engine from another computer

1.  On a computer connected to the internet, open SQL Server Management Studio.

2.  In the **Connect to Server** or **Connect to Database Engine**
    dialog box, in the **Server name** box, enter the DNS name of the
    virtual machine (determined in the previous task) and a public
    endpoint port number in the format of *DNSName,portnumber* such as
    **tutorialtestVM.cloudapp.net,57500**.

3.  In the **Authentication** box, select **SQL Server Authentication**.

4.  In the **Login** box, type the name of a login that you created in
    an earlier task.

5.  In the **Password** box, type the password of the login that you
    create in an earlier task.

6.  Click **Connect**.

##<a name="amlconnect"></a>Connect to the Database Engine from Azure Machine Learning

In later stages of the Cloud Data Science Process, you will use the [Azure Machine Learning Studio](https://studio.azureml.net) to build and deploy machine learning models. To ingest data from your SQL Server VM databases directly into Azure Machine Learning for training or scoring, use the Reader module in a new [Azure Machine Learning Studio](https://studio.azureml.net) experiment. This topic is covered in more details through the Cloud Data Science Process map links. For an introduction, see [What is Azure Machine Learning Studio?](machine-learning-what-is-ml-studio.md).

2.	In the **Properties** pane of the [Reader module](https://msdn.microsoft.com/library/azure/dn905997.aspx), select **Azure SQL Database** from the **Data Source** 	dropdown list.

3.	In the **Database server name** text box, enter `tcp:<DNS name of your virtual machine>,1433`

4.	Enter the SQL user name in the **Server user account name** text box.

5.	Enter the sql user's password in the **Server user account password** text box.

	![Azure ML Reader][13]

##<a name="shutdown"></a>Shutdown and deallocate virtual machine when not in use

Azure Virtual Machines are priced as **pay only for what you use**. To ensure that you are not being billed when not using your virtual machine, it has to be in the **Stopped (Deallocated)** state.

> [AZURE.NOTE] Shutting down the virtual machine from inside (using Windows power options), the VM is stopped but remains allocated. To ensure you’re not being billed, always stop virtual machines from the [Azure Management Portal](http://manage.windowsazure.com/). You can also stop the VM through Powershell by calling ShutdownRoleOperation with "PostShutdownAction" equal to "StoppedDeallocated".

To shutdown and deallocate the virtual machine:

1. Log in to the [Azure Management Portal](http://manage.windowsazure.com/) using your account.  

2. Select **VIRTUAL MACHINES** from the left navigation bar.

3. In the list of virtual machines, click on the name of your virtual
   machine then go to the **DASHBOARD** page.

4. At the bottom of the page, click **SHUTDOWN**. 

![VM Shutdown][15]

The virtual machine will be deallocated but not deleted. You may restart your virtual machine at any time from the Azure Management Portal.

## Your Azure SQL Server VM is ready to use: what's next?

Your virtual machine is now ready to use in your data science exercises. The virtual machine is also ready for use as an IPython Notebook server for the exploration and processing of data, and other tasks in conjunction with Azure Machine Learning and the Cloud Data Science Process. 

The next steps in the data science process are mapped in the [Learning Guide: Advanced data processing in Azure](machine-learning-data-science-advanced-data-processing.md) and may include steps that move data into HDInsight, process and sample it there in preparation for learning from the data with Azure Machine Learning.


[1]: ./media/machine-learning-data-science-setup-sql-server-virtual-machine/selectsqlvmimg.png
[2]: ./media/machine-learning-data-science-setup-sql-server-virtual-machine/4vm-config.png
[3]: ./media/machine-learning-data-science-setup-sql-server-virtual-machine/sqlvmports.png
[4]: ./media/machine-learning-data-science-setup-sql-server-virtual-machine/vmpostopts.png
[5]:./media/machine-learning-data-science-setup-sql-server-virtual-machine/searchssms.png
[6]: ./media/machine-learning-data-science-setup-sql-server-virtual-machine/19connect-to-server.png
[7]: ./media/machine-learning-data-science-setup-sql-server-virtual-machine/20server-properties.png
[8]: ./media/machine-learning-data-science-setup-sql-server-virtual-machine/21mixed-mode.png
[9]: ./media/machine-learning-data-science-setup-sql-server-virtual-machine/22restart2.png
[10]: ./media/machine-learning-data-science-setup-sql-server-virtual-machine/23new-login.png
[11]: ./media/machine-learning-data-science-setup-sql-server-virtual-machine/24test-login.png
[12]: ./media/machine-learning-data-science-setup-sql-server-virtual-machine/25sysadmin.png
[13]: ./media/machine-learning-data-science-setup-sql-server-virtual-machine/amlreader.png
[15]: ./media/machine-learning-data-science-setup-sql-server-virtual-machine/vmshutdown.png

