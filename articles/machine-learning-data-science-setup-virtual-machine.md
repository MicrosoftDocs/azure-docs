<properties 
	title="Set up a Virtual Machine in Azure for Data Science" 
	pageTitle="Set up a Data Science Virtual Machine" 
	description="Set up a Data Science Virtual Machinee" 
	metaKeywords="" 
	services="machine-learning" 
	solutions="" 
	documentationCenter="" 
	authors="msolhab" 
	manager="jacob.spoelstra" 
	editor="cgronlun"  />

<tags 
	ms.service="machine-learning" 
	ms.workload="data-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/17/2015" 
	ms.author="mohabib;xibingao;bradsev" />

# Set up a Virtual Machine in Azure for Data Science

In this tutorial, you learn how to provision and configure several types of Azure Virtual Machines that are to be used as part of a cloud-based data science environment. The virtual machines are also set up as IPython Notebook servers. The virtual machines run on Windows and are configured with supporting tools, including Azure Storage Explorer and AzCopy, and other packages which are useful for data science projects. Azure Storage Explorer and AzCopy provide convenient ways to download/upload data from/to Azure blob storage.

This tutorial has two parts. The first part shows how to provision a general purpose Azure virtual machine step by step. The second part  describes the steps for the provisioning of a SQL Server virtual machine for cases in which SQL Server is required to satisfy your data needs. 


##<a name="general"></a>Set Up a General Purpose Azure Virtual Machine with IPython Notebook Server

- [Step 1: Create an Azure virtual machine and add an endpoint for IPython Notebooks](#create-vm)
- [Step 2: Add an endpoint for IPython Notebooks to an existing virtual machine](#add-endpoint)
- [Step 3: Run shell commands on virtual machines to set up an IPython Notebook server](#run-commands)
- [Step 4: Access IPython Notebooks from a web browser](#access)
- [Step 5: Upload an existing IPython Notebook from a local machine to the IPython Notebook server](#upload)

### <a name="create-vm"></a>Step 1: Create an Azure virtual machine and add an endpoint for IPython Notebooks

If a user already has an Azure virtual machine and just wants to set up an IPython Notebook server on it, this step can be skipped. Such users can proceed to [Step 2: Add an endpoint for IPython Notebooks to an existing virtual machine](#add-endpoint). 
 
Before starting the process of creating a virtual machine on Azure, users need to determine the size of the machine that is needed to process the data for their project. Smaller machines have less memory and fewer CPU cores than larger machines, but they are also less costly. 

1. Log in to https://manage.windowsazure.com, and click **New** in the bottom left corner. A window will be popped up. Then select **COMPUTE** -> **VIRTUAL MACHINE** -> **FROM GALLERY**.

	![Create workspace][24]

2. Choose an image. Since the shell scripts for setting up the IPython Notebook server only work on **Windows Server 2012**, user can only choose images that are running on Windows Server 2012. These includes Windows Server 2012 R2 Datacenter, Windows Server Essentials Experience (Windows Server 2012 R2), and SQL Server 2012 xxx (Windows Server 2012 R2). Then, click the arrow pointing right at the lower right to go the next configuration page.
	
	![Create workspace][25]

3. Input the name of the virtual machine you want to create, select the size of the machine based on the size of the data the machine is going to handle and how powerful you want the machine to be (memory size and the number of cores), the user name and the password of the machine. Then, click the arrow pointing right to go to the next configuration page.

	![Create workspace][26]

4. Select the **REGION/AFFINITY GROUP/VIRTUAL NETWORK** that contains the **STORAGE ACCOUNT** that you are planning to use for this virtual machine, and then select that storage account. Add an endpoint at the bottom in the **ENDPOINTS**  field by inputting the name of the endpoint ("IPython" here). You can choose any string as the **NAME** of the end point, and any integer between 0 and 65536 that is **available** as the **PUBLIC PORT**. The **PRIVATE PORT** has to be **9999**. Users should **avoid** using any public port that has already been assigned for internet services. [Ports for Internet Services](http://www.chebucto.ns.ca/~rakerman/port-table.html) provides a complete list of ports that have been assigned and you cannot use. 

	![Create workspace][27]

	>[AZURE.NOTE] If the endpoint is added at this step,[Step 2: Add an endpoint for IPython Notebooks to an existing virtual machine](#add-endpoint) can be skipped.

5. Click the check mark to start the virtual machine provisioning process. 

	![Create workspace][28]


It may take 15-25 minutes to complete the virtual machine provisioning process. After the virtual machine has been created, the status of this machine should show as **Running**.

![Create workspace][29]
	
### <a name="add-endpoint"></a>Step 2: Add an endpoint for IPython Notebooks to an existing virtual machine

If you create the virtual machine by following the instructions above, then the endpoint for IPython Notebook has already been added and this step can be skipped. 

If the virtual machine had already been created, and and you need to add an endpoint for IPython Notebooks, first log into Azure management portal, click the virtual machine, and then add the endpoint for IPython Notebook server. The following figure contains a screen shot of the portal after the endpoint for IPython Notebook has been added to a Windows virtual machine. 

![Create workspace][17]

### <a name="run-commands"></a>Step 3: Install IPython Notebook and other supporting tools

After the virtual machine is created, use RDP to log on to the virtual machine. For instructions, see [How to Log on to a Virtual Machine Running Windows Server](virtual-machines-log-on-windows-server.md). Open the **Command Prompt** (**Not the Powershell command window**) as an Administrator and run the following command. Users must run this command in the **Administrator** role. 
 
    set script='https://raw.githubusercontent.com/Azure/Azure-MachineLearning-DataScience/master/Misc/MachineSetup/Azure_VM_Setup_Windows.ps1'

	@powershell -NoProfile -ExecutionPolicy unrestricted -Command "iex ((new-object net.webclient).DownloadString(%script%))"

When the installation completes, the IPython Notebook server is launched automatically in the *C:\Users\&#60;user name>\Documents\IPython Notebooks* directory.

The installation process will require the password of the IPython Notebooks and the password of the machine. Providing them enables the IPython Notebook to run as a service on the machine. 

### <a name="access"></a>Step 4: Access IPython Notebooks from a web browser
To access the IPython Notebook server, open a web browser, and input *https://&#60;virtual machine DNS name>:&#60;public port number>* in the URL text box. Here, the *&#60;public port number>* should  be the port number users specify when the IPython Notebook endpoint is added, unless 443 is used. This option exists as 443 is the default port number for HTTPS. So if users choose *443* as the public port number, the IPython Notebook can be accessed without explicitly claiming the port number in the URL text box. Otherwise, the **&#60;public port number>* is required. 

The *&#60;virtual machine DNS name>* can be found at the management portal of Azure. After logging in to the management portal, click the **VIRTUAL MACHINES**, select the machine you created, and then select **DASHBOARD**, the DNS name will be shown as follows:

![Create workspace][19]

Users will encounter the warning that _There is a problem with this website's security certificate_ (Internet Explorer) or _Your connection is not private_ (Chrome), as shown in the following figures. Users need to click **Continue to this website (not recommended)** (Internet Explorer) or **Advanced** and then **Proceed to &#60;*DNS Name*> (unsafe)** (Chrome) to continue. Then, users will be asked to input a password to access the IPython Notebooks.

Internet Explorer:
![Create workspace][20]

Chrome:
![Create workspace][21]

After users log on to the IPython Notebooks, a directory *DataScienceSamples* will show on the browser. This directory contains the sample IPython Notebooks that are shared by Microsoft to help users conduct cloud data science tasks on Azure. These sample IPython Notebooks have been checked out from [**Github repository**](https://github.com/Azure/Azure-MachineLearning-DataScience/tree/master/Misc/DataScienceProcess/iPythonNotebooks) to the virtual machines during the IPython Notebook server set up process. Microsoft is maintaining and updating this repository frequently. Users can always visit this Github repository to get the most recently updated sample IPython Notebooks. 
![Create workspace][18]

### <a name="upload"></a>Step 5: Upload an existing IPython Notebook from a local machine to the IPython Notebook server
IPython Notebooks provide an easy way for users to upload an existing IPython Notebook on their local machines to the IPython Notebook server on the virtual machines. After users log on to the IPython Notebook in a web browser, click into the **directory** that the IPython Notebook will be uploaded to. Then, select the IPython Notebook .ipynb file to upload from the local machine in the **File Explorer**, and drag and drop it to the IPython Notebook directory on the web browser. Click the **Upload** button, to upload the .ipynb file to the IPython Notebook server. Other users can then start using it in from their web browsers.

![Create workspace][22]

![Create workspace][23]

## <a name="sqlserver"></a>Set Up a SQL Server Virtual Machine with IPython Notebook Server

The Azure virtual machine gallery includes several images that contain Microsoft SQL Server. Select a SQL Server VM image that is suitable for your data needs. Recommended images are:

- SQL Server 2012 SP2 Enterprise for small to medium data sizes
- SQL Server 2012 SP2 Enterprise Optimized for DataWarehousing Workloads for large to very large data sizes

 > [AZURE.NOTE] SQL Server 2012 SP2 Enterprise image **does not include a data disk**. You will need to add and/or attach one or  create additional virtual hard disks to store your data. When you create an Azure virtual machine, it has a disk for the operating system mapped to the C drive and a temporary disk mapped to the D drive. Do not use the D drive to store data. As the name implies, it provides temporary storage only. It offers no redundancy or backup because it doesn't reside in Azure storage.

In the following steps, you will:

-   [Connect to the Azure management portal and provision an SQL Server virtual machine](#Provision)
-   [Open the virtual machine using Remote Desktop and complete setup](#RemoteDesktop)
-   [Install IPython Notebook and other supporting tools](#InstallIPython)
-   [Attach data disks as needed](#Optional)
-   [Connect to SQL Server Management Studio and enable mixed mode authentication](#SSMS)
-   [Create SQL Server authentication logins](#Logins)
-   [Determine the DNS name of the virtual machine](#DNS)
-   [Connect to the Database Engine from another computer](#cde)
-   [Connect to the Database Engine from Azure Machine Learning](#amlconnect)
-   [Shutdown and deallocate virtual machine when not in use](#shutdown)

##<a name="Provision"></a>Connect to the Azure management portal and provision an SQL Server virtual machine

1.  Log in to the [Azure Management Portal](http://manage.windowsazure.com/) using your account. If you do not have an Azure account, visit the [Azure Free one-month](http://azure.microsoft.com/pricing/free-trial/) page to sign up for a free trial.

2.  On the Azure Management Portal, at the bottom left of the web page, select **+NEW** -> **COMPUTE** -> **VIRTUAL MACHINE** -> **FROM GALLERY**.

3.  On the **Create a Virtual Machine** page, select a virtual machine image containing the SQL Server that best satisfies your data needs, and then click the next arrow at the bottom right of the page. For the most up-to-date information on the supported SQL Server images on Azure, see [Getting Started with SQL Server in Azure Virtual Machines](http://go.microsoft.com/fwlink/p/?LinkId=294720) topic in the [SQL Server in Azure Virtual Machines](http://go.microsoft.com/fwlink/p/?LinkId=294719) documentation.

	![Select SQL Server VM][1]

4.  On the first **Virtual Machine Configuration** page, provide the following information and then click the next arrow on the bottom right to continue:

    -   a **VIRTUAL MACHINE NAME**.
    -   a unique user name for the local administrator of the VM account in the **NEW USER NAME** box.
    -   a strong password in the **NEW PASSWORD** box. For more information on strong passwords, see [Strong Passwords](http://msdn.microsoft.com/library/ms161962.aspx).
    -   a retyped password in the **CONFIRM PASSWORD** box.
    -   an appropriate VM **SIZE** from the drop-down list.

  	> [AZURE.NOTE] The size of the virtual machine is specified during provisioning. The following general guidance may be offered. A2 is the smallest size recommended for production workloads. The minimum recommended size for a virtual machine is A3 when using SQL Server Enterprise Edition. Select A3 or higher when using SQL Server Enterprise Edition. Select A4 when using SQL Server 2012 or 2014 Enterprise Optimized for Transactional Workloads images. Select A7 when using SQL Server 2012 or 2014 Enterprise Optimized for Data Warehousing Workloads images. The size selected also limits the number of data disks you can configure. For most up-to-date information on available virtual machine sizes and the number of data disks that you can attach to them, see [Virtual Machine Sizes for Azure](http://msdn.microsoft.com/library/azure/dn197896.aspx). For pricing information, see [Virtual Machines Pricing](http://azure.microsoft.com/pricing/details/virtual-machines/).

    ![VM Configuration][2]

5.  On the second **Virtual machine configuration** page, configure the resources for networking, storage, and availability:   

  * In the **CLOUD SERVICE** box, choose **Create a new cloud service**.
  * In the **CLOUD SERVICE DNS NAME** box, provide the first portion of a DNS name of your choice, so that it completes a name in the format **TESTNAME.cloudapp.net**
  * In the **REGION/AFFINITY GROUP/VIRTUAL NETWORK** box, select a region where this virtual image will be hosted.
  * In the **STORAGE ACCOUNT**, select an existing storage account or select an automatically generated one.
  * In the **AVAILABILITY SET** box, select **(none)**.
  * Read and accept the pricing information.

6.	In the **ENDPOINTS** section, click in the empty drop-down under **NAME**, and select **MSSQL**  then type the port number of the instance of the Database Engine (**1433** for the default instance).

7.  Your SQL Server VM can also serve as an IPython Notebook Server (TO be configured in a later step). Add a new endpoint to specify the port to use for your IPython Notebook server. Enter a name in the **NAME** column, then select a port number of your choice for the public port, and 9999 for the private port. Click the next arrow on the bottom right to continue.

	![Select MSSQL and IPython ports][3]

8.  Accept the default **Install VM Agent** option checked and click the check mark on the bottom right corner of the wizard to complete the VM provisioning process.

	![VM Final Options][4]

9.  Wait while Azure prepares your virtual machine. Expect the virtual machine status to proceed through the following stages:

    -   Starting (Provisioning)
    -   Stopped
    -   Starting (Provisioning)
    -   Running (Provisioning)
    -   Running

##<a name="RemoteDesktop"></a>Open the virtual machine using Remote Desktop and complete setup

1.  When provisioning completes, click on the name of your virtual machine to go to the DASHBOARD page. At the bottom of the page, click **Connect**.

2.  Choose to open the rpd file using the Windows Remote Desktop program (`%windir%\system32\mstsc.exe`).

3.  At the **Windows Security** dialog box, provide the password for the local administrator account that you specified in an earlier step. (You might also be asked to verify the credentials of the virtual machine.)

4.  The first time you log on to this virtual machine, several processes may need to complete, including setup of your desktop, Windows updates, and completion of the Windows initial configuration tasks (sysprep). After Windows sysprep completes, SQL Server setup completes configuration tasks. These tasks may cause a delay of a few minutes while they complete. `SELECT @@SERVERNAME` may not return the correct name until SQL Server setup completes, and SQL Server Management Studio may not be visible on the start page.

Once you are connected to the virtual machine with Windows Remote
Desktop, the virtual machine works much like any other computer. Connect to the default instance of SQL Server with SQL Server Management Studio (running on the virtual machine) in the normal way.

##<a name="InstallIPython"></a>Install IPython Notebook and other supporting tools

A customization script has been provided that configures a SQL Server VM to serve as an IPython Notebook server. It also installs additional Azure support tools, such AzCopy and Azure Storage Explorer, and other useful Data Science Python packages. To run the script:

* Right-click the Windows Start icon and click **Command Prompt (Admin)**
* Copy the following commands and paste them in at the command prompt. 

    	set script='https://raw.githubusercontent.com/Azure/Azure-MachineLearning-DataScience/master/Misc/MachineSetup/Azure_VM_Setup_Windows.ps1'
    	@powershell -NoProfile -ExecutionPolicy unrestricted -Command "iex ((new-object net.webclient).DownloadString(%script%))"

* When prompted, enter a password of your choice for the IPython Notebook server.

The customization script automates several post-install procedures, which include:

* installs and configures the IPython Notebook server
* opens TCP ports in the Windows firewall for the endpoints created earlier:
* configures remote connectivity for SQL Server 
* fetches sample IPython notebooks and SQL scripts
* downloads and installs useful Data Science Python packages
* downloads and installs Azure tools such as AzCopy and Azure Storage Explorer  

Once the script has completed, you may access and run IPython Notebook from any local or remote browser using a URL of the form *https://&#60;virtual_machine_DNS_name>:&#60;port>*, where *port* is the IPython public port that you selected while provisioning the virtual machine. Note that the IPython Notebook server runs as a background service and it will be restarted automatically when you restart the virtual machine.

##<a name="Optional"></a>Attach data disk as needed

If your VM image does not include data disks, other than C drive (OS disk) and D drive (temporary disk), you need to add one or more data disks to store your data. 

> [AZURE.NOTE] Do not use the D drive to store data as it provides temporary storage only. It offers no redundancy or backup because it does not reside in Azure storage.

Some VM images do come with data disks configured. The SQL Server 2012 SP2 Enterprise Optimized for DataWarehousing Workloads, for example, comes pre-configured with additional disks for SQL Server data and log files. But other VM images do not and require additional disks for data storage to be attached.

To attach additional data disks, follow the steps described in [How to Attach a Data Disk to a Windows Virtual Machine](storage-windows-attach-disk.md), which guides you through:

1. How to attach an empty disk to the virtual machine provisioned previously
2. How to initialize the new disk in the virtual machine


##<a name="SSMS"></a>Connect to SQL Server Management Studio and enable mixed mode authentication

The SQL Server Database Engine cannot use Windows Authentication without domain environment. To connect to the Database Engine from another computer, SQL Server must be configured for mixed mode authentication. Mixed mode authentication allows both SQL Server Authentication and Windows Authentication. SQL authentication mode is required in order to ingest data directly from your SQL Server VM databases in the 
[Azure Machine Learning Studio](https://studio.azureml.net) using the Reader module. The following procedure outlines how to configure mixed mode authentication in SQL Server Management Studio (SSMS). 

1. Connect to the virtual machine that you have installed SQL Server on using **Remote Desktop Connection** and type *SQL Server Management Studio* into the Windows **Search** pane. Click on **SQL Server Management Studio** icon to start the SSMS application. You may want to add a shortcut to SSMS on your Desktop for future use.

    ![Start SSMS][5]

    The first time you open Management Studio it must create the usersManagement Studio environment. This may take a few moments.

2. Management Studio presents the **Connect to Server** dialog box when opening. In the **Server name** box, type the name of the virtual machine to connect to the Database Engine with the Object Explorer. (Note that instead of the virtual machine name you can also use either **(local)** or a single period **.** as the value.) Select **Windows Authentication**, and leave *your_VM_name\your_local_administrator* in the **Username** box. Click **Connect**.

    ![Connect to Server][6]

	<br>

	> [AZURE.TIP] You may change the SQL Server authentication mode using a Windows registry key change or using the SQL Server Management Studio. Step 3 immediately below shows how to use the registery key. Steps 4 and 5 describe how to use SQL Server Management Studio. Do one of these


3. To change the authentication mode using a registry key change, start a **New Query** and execute the following script:
	
		USE master
    	go
    	
    	EXEC xp_instance_regwrite N'HKEY_LOCAL_MACHINE', N'Software\Microsoft\MSSQLServer\MSSQLServer', N'LoginMode', REG_DWORD, 2
    	go


4. To change the authentication mode using SQL Server management Studio, go to the SQL Server Management Studio Object Explorer, right-click the name of the instance of SQL Server (the virtual machine name), and click **Properties**.

    ![Server Properties][7]

5. On the **Security** page, under **Server authentication**, select **SQL Server and Windows Authentication mode**, and then click **OK**.

    ![Select Authentication Mode][8]

6. In the SQL Server Management Studio dialog box, click **OK** to acknowledge the requirement to restart SQL Server.

7. In Object Explorer, right-click your server, and then click **Restart**. (If SQL Server Agent is running, it must also be restarted.)

    ![Restart][9]

8. In the **SQL Server Management Studio** dialog box, click **Yes** to agree that you want to restart SQL Server.

##<a name="Logins"></a>Create SQL Server authentication logins

To connect to the Database Engine from another computer, you must create at least one SQL Server authentication login.  

> [AZURE.TIP] You may create new SQL Server logins programmatically or by using the SQL Server Management Studio. Both of these procedures are outlined below.

To create a new sysadmin user with SQL authentication programmatically, start a **New Query** and execute the following script.   
	
    USE master
    go
    
    CREATE LOGIN <new user name> WITH PASSWORD = N'<new password>',
    	CHECK_POLICY = OFF,
    	CHECK_EXPIRATION = OFF;
    
    EXEC sp_addsrvrolemember @loginame = N'<new user name>', @rolename = N'sysadmin';

Replace `<new user name\>` and `<new password\>` with your choice of user name and password. Adjust the password policy as needed (the sample code turns off policy checking and password expiration). For more information about SQL Server logins, see [Create a Login](http://msdn.microsoft.com/library/aa337562.aspx).

To create new SQL Server logins using the SQL Server Management Studio:

1. In SQL Server Management Studio Object Explorer, expand the folder of the server instance in which you want to create the new login.

2. Right-click the **Security** folder, point to **New**, and select**Login…**.

    ![New Login][10]

3. In the **Login - New** dialog box, on the **General** page, enter the name of the new user in the **Login name** box.

4. Select **SQL Server authentication**.

5. In the **Password** box, enter a password for the new user. Enter that password again into the **Confirm Password** box.

6. To enforce password policy options for complexity and enforcement, select **Enforce password policy** (recommended). This is a default option when SQL Server authentication is selected.

7. To enforce password policy options for expiration, select **Enforce password expiration** (recommended). Note that the **Enforce password policy** box must be checked to enable this checkbox. This is the default option when SQL Server authentication is selected.

8. To force the user to create a new password after the first time the login is used, select **User must change password at next login** (This option is recommended if this login is for someone else to use. If the login is for your own use, this option is not necessary.) Enforce password expiration must be selected to enable this checkbox. This is a default option when SQL Server authentication is selected.

9. From the **Default database** list, select a default database for the login. **master** is the default for this option. If you have not yet created a user database, leave this set to **master**.

10. In the **Default language** list, leave **default** as the value.

    ![Login Properties][11]

11. If this is the first login you are creating, you may want to designate this login as a SQL Server administrator. To do this, check **sysadmin** on the **Server Roles** page. 

	> [AZURE.NOTE] **Security Note:** Members of the sysadmin fixed server role have complete control of the Database Engine. You should carefully restrict membership in this role.

    ![sysadmin][12]

12. Click OK.

##<a name="DNS"></a>Determine the DNS name of the virtual machine

To connect to the SQL Server Database Engine from another computer, you must know the Domain Name System (DNS) name of the virtual machine. This is the name that the internet uses to identify the virtual machine. You could use the IP address, but the IP address might change when Azure moves resources for redundancy or maintenance. But the DNS name remains stable because it can be redirected to a new IP address and so should be used to connect teh the SQL Server Database Engine.

1. In the Azure Management Portal, select **VIRTUAL MACHINES**.

2. On the **VIRTUAL MACHINE INSTANCES** page, in the **DNS NAME**
column, find and copy the DNS name for the virtual machine which appears preceded by *http://* (The user interface might not display the entire name, but you can right-click on it, and select copy.).

##<a name="cde"></a>Connect to the Database Engine from another computer

1. Open SQL Server Management Studio on a computer that is connected to the internet.

2. In the **Connect to Server** or **Connect to Database Engine** dialog box, enter the DNS name of the virtual machine (determined in the previous task) and a public endpoint port number in the format of ***DNSName,portnumber*** (for example, *tutorialtestVM.cloudapp.net,57500*) in the **Server name** box.

3. In the **Authentication** box, select **SQL Server Authentication**.

4. In the **Login** box, type the name of a login that you created in an earlier task.

5. In the **Password** box, type the password of the login that you create in an earlier task.

6. Click **Connect**.

##<a name="amlconnect"></a>Connect to the Database Engine from Azure Machine Learning

In later stages of the Cloud Data Science Process, you will use the [Azure Machine Learning Studio](https://studio.azureml.net) to build and deploy machine learning models. To ingest data from your SQL Server VM databases directly into Azure Machine Learning for training or scoring, use the **Reader** module in a new [Azure Machine Learning Studio](https://studio.azureml.net) experiment. Links provided in the Cloud Data Science Process map cover this workflow in detail . For an introduction, see [What is Azure Machine Learning Studio?](machine-learning-what-is-ml-studio.md).

1. In the **Properties** pane of the [Reader module](http://help.azureml.net/Content/html/4e1b0fe6-aded-4b3f-a36f-39b8862b9004.htm), select **Azure SQL Database** from the **Data Source** dropdown list.

2. In the **Database server name** text box, enter: *tcp:&#60;DNS name of your virtual machine>,1433*

3. Enter the SQL user name in the **Server user account name** text box.

4. Enter the password of the SQL user in the **Server user account password** text box.

	![Azure ML Reader][13]

##<a name="shutdown"></a>Shutdown and deallocate virtual machine when not in use

Azure Virtual Machines are priced as **pay only for what you use**. To ensure that you are not being billed when not using your virtual machine, it has to be in the **Stopped (Deallocated)** state when not in use.

> [AZURE.NOTE] If you shut down the virtual machine from inside (using Windows power options), the VM is stopped but remains allocated. To ensure you are not going to continue to be billed, always stop virtual machines from the [Azure Management Portal](http://manage.windowsazure.com/). You can also stop the VM through Powershell by calling **ShutdownRoleOperation** with "PostShutdownAction" equal to "StoppedDeallocated".

To shutdown and deallocate the virtual machine:

1. Log in to the [Azure Management Portal](http://manage.windowsazure.com/) using your account.  

2. Select **VIRTUAL MACHINES** from the left navigation bar.

3. In the list of virtual machines, click on the name of your virtual machine then go to the **DASHBOARD** page.

4. At the bottom of the page, click **SHUTDOWN**. 

![VM Shutdown][15]

The virtual machine will be deallocated but not deleted. You may restart your virtual machine at any time from this Azure Management Portal.

## Your SQL Server VM is ready to use

Your SQL Server virtual machine is now ready for creating and loading new databases to use as part of your data science exercises. The virtual machine is also ready for use as an IPython Notebook server for data exploration, data processing, and other tasks in conjunction with Azure Machine Learning and the Cloud Data Science Process.



[1]: ./media/machine-learning-data-science-setup-virtual-machine/selectsqlvmimg.png
[2]: ./media/machine-learning-data-science-setup-virtual-machine/4vm-config.png
[3]: ./media/machine-learning-data-science-setup-virtual-machine/sqlvmports.png
[4]: ./media/machine-learning-data-science-setup-virtual-machine/vmpostopts.png
[5]:./media/machine-learning-data-science-setup-virtual-machine/searchssms.png
[6]: ./media/machine-learning-data-science-setup-virtual-machine/19connect-to-server.png
[7]: ./media/machine-learning-data-science-setup-virtual-machine/20server-properties.png
[8]: ./media/machine-learning-data-science-setup-virtual-machine/21mixed-mode.png
[9]: ./media/machine-learning-data-science-setup-virtual-machine/22restart2.png
[10]: ./media/machine-learning-data-science-setup-virtual-machine/23new-login.png
[11]: ./media/machine-learning-data-science-setup-virtual-machine/24test-login.png
[12]: ./media/machine-learning-data-science-setup-virtual-machine/25sysadmin.png
[13]: ./media/machine-learning-data-science-setup-virtual-machine/amlreader.png
[14]: ./media/machine-learning-data-science-setup-virtual-machine/custom-script.png
[15]: ./media/machine-learning-data-science-setup-virtual-machine/vmshutdown.png
[Connect using SSMS]: ./media/machine-learning-data-science-setup-virtual-machine/33connect-ssms.png
[Connecting to a SQL Server virtual machine]: ./media/machine-learning-data-science-setup-virtual-machine/sqlserverinvmconnectionmap.png
[New Rule]: ./media/machine-learning-data-science-setup-virtual-machine/13new-fw-rule.png
[Start the Firewall Program]: ./media/machine-learning-data-science-setup-virtual-machine/12open-wf.png
[TCP Port 1433]: ./media/machine-learning-data-science-setup-virtual-machine/14port-1433.png
[Allow Connections]: ./media/machine-learning-data-science-setup-virtual-machine/15allow-connection.png
[Public Profile]: ./media/machine-learning-data-science-setup-virtual-machine/16public-profile.png
[Rule Name]: ./media/machine-learning-data-science-setup-virtual-machine/17rule-name.png
[Open SSCM]: ./media/machine-learning-data-science-setup-virtual-machine/9click-sscm.png
[Enable TCP]: ./media/machine-learning-data-science-setup-virtual-machine/10enable-tcp.png
[Restart Database Engine]: ./media/machine-learning-data-science-setup-virtual-machine/11restart.png
[17]: ./media/machine-learning-data-science-setup-virtual-machine/add-endpoints-after-creation.png
[18]: ./media/machine-learning-data-science-setup-virtual-machine/sample-ipnbs.png
[19]: ./media/machine-learning-data-science-setup-virtual-machine/dns-name-and-host-name.png
[20]: ./media/machine-learning-data-science-setup-virtual-machine/browser-warning-ie.png
[21]: ./media/machine-learning-data-science-setup-virtual-machine/browser-warning.png
[22]: ./media/machine-learning-data-science-setup-virtual-machine/upload-ipnb-1.png
[23]: ./media/machine-learning-data-science-setup-virtual-machine/upload-ipnb-2.png
[24]: ./media/machine-learning-data-science-setup-virtual-machine/create-virtual-machine-1.png
[25]: ./media/machine-learning-data-science-setup-virtual-machine/create-virtual-machine-2.png
[26]: ./media/machine-learning-data-science-setup-virtual-machine/create-virtual-machine-3.png
[27]: ./media/machine-learning-data-science-setup-virtual-machine/create-virtual-machine-4.png
[28]: ./media/machine-learning-data-science-setup-virtual-machine/create-virtual-machine-5.png
[29]: ./media/machine-learning-data-science-setup-virtual-machine/create-virtual-machine-6.png



