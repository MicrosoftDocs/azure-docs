<properties linkid="manage-services-networking-active-directory-forest" urlDisplayName="Active Directory forest" pageTitle="Install Active Directory forest in a Windows Azure network" metaKeywords="" description="A tutorial that explains how to create a new Active Directory forest on a virtual machine (VM) on Windows Azure Virtual Network." metaCanonical="" services="active-directory,virtual-network" documentationCenter="" title="Install a new Active Directory forest in Windows Azure" authors=""  solutions="" writer="" manager="" editor=""  />




#Install a new Active Directory forest in Windows Azure

This tutorial walks you through the steps to create a new Active Directory forest on a virtual machine (VM) on [Windows Azure Virtual Network](http://msdn.microsoft.com/en-us/library/windowsazure/jj156007.aspx). In this tutorial, the virtual network for the VM is not connected to the network at your company. For conceptual guidance about installing Active Directory Domain Services (AD DS) on Windows Azure Virtual Network, see [Guidelines for Deploying Windows Server Active Directory on Windows Azure Virtual Machines](http://msdn.microsoft.com/en-us/library/windowsazure/jj156090.aspx).

##Table of Contents##

* [Prerequisites](#Prerequisites)
* [Step 1: Create the first Virtual Machine (VM)](#Step1)
* [Step 2: Attach additional disks to the VM](#Step2)
* [Step 3: Install Active Directory Domain Services](#Step3)
* [Step 4: Validate the installation](#Step4)
* [Step 5: Backup the domain controller](#Step5)
* [Step 6: Provisioning a Virtual Machine that is Domain Joined on Boot](#Step6)


<h2><a id="Prerequisites"></a>Prerequisites</h2>

Before you install Active Directory Domain Services (AD DS) on a Windows Azure virtual machine, you need to create a virtual network using one of the following options:

-	**Create a virtual network *without* connectivity to another network** by doing the following in the order listed: 
1.  First, [Create a virtual network in Windows Azure](http://www.windowsazure.com/en-us/manage/services/networking/create-a-virtual-network/). 
2.  Then install AD DS using the steps in the tutorial below. 
	
-	**Create a virtual network *with* connectivity to another network**, such as an Active Directory environment on premises by doing the following in the order listed: 
1.	First, [Create a Virtual Network for Cross-Premises Connectivity](../cross-premises-connectivity/). 
2.	Next, [Add a Virtual Machine to a Virtual Network](../add-a-vm-to-a-virtual-network/). 
3.	Finally, install AD DS by following the steps in [Install a Replica Active Directory Domain Controller in Windows Azure Virtual Networks](../replica-domain-controller/).

<h2><a id="Step1"></a>Step 1: Create the first Virtual Machine (VM)</h2>

You can create the first VM either by using the Windows Azure management portal or by using Windows Azure PowerShell.

<h3>To create a VM by using Windows Azure management portal</h3>
1.	Click **New**, click **Compute**, click **Virtual Machine**, and click **From Gallery**. 

	![Create VM From Gallery][create-vm]

2.	Select the image.

	![VM Image][vm-image]

3.	Type the name of the new VM, a user name and password, and select a version release date and size.

	![VM Configuration][vm-configuration]

4.	Select the virtual network and subnet and accept other default values.

	![VM Subnet][vm-subnet]

5.	Accept default endpoints and click the check mark to complete the wizard.

	![VM Ports][vm-ports]

<h3>To create a VM by using Windows Azure PowerShell</h3>

1.	Create a storage account that is in the same region as the affinity group. To check the region of the affinity group, click **Networks**, and click **Affinity Groups**. To create a storage account: 

	a.  Click **Data Services **, click **Storage**, and then click **Quick Create**. 

	b.  Under URL: type the name of the storage account, and for **Region/Affinity Group**, select the region of the affinity group, such as West US. By selecting a region for the storage account, it can be used with any affinity group in the virtual network.

2.	Install [Windows Azure PowerShell](http://msdn.microsoft.com/en-us/library/windowsazure/jj156055.aspx). The VM where you plan to install AD DS must be created using Windows Azure PowerShell in order for the DNS client settings of the domain controller to persist after service healing. The installation of Windows Azure PowerShell requires the installation of Microsoft .NET Framework 4.5 and Windows Management Framework 3.0. If they are not already installed, your computer will need to restart to complete their installation. 

	a.  Go to [https://www.windowsazure.com/en-us/](https://www.windowsazure.com/en-us/).

	b.  Click **Downloads**, click **Command-line tools**, then click **Windows Azure PowerShell**.

	c.  Click **Run**. Click **Yes** if prompted by the **User Account Control** dialog. 

	d.  Click **Install** to go through installation wizard, click **I accept**, and when the wizard is done, click **Finish**. 

	e.	Click **Exit** to close the Web Platform Installer 4.0.

3.	If you are running Windows 7, click **Start**, click **All Programs**, click **Windows Azure**, right-click **Windows Azure PowerShell**, and click **Run as Administrator**. Click **Yes** if prompted by the **User Account Control** dialog. If you are running Windows 8, click **Start**, and in the **Search** field, type Windows Azure PowerShell and press ENTER. 

4.	In Windows Azure PowerShell, run the following cmdlet, and then type **Y** to finish the command:

		Set-ExecutionPolicy RemoteSigned

5.	Run the following cmdlet:

		Import-Module 'C:\Program Files (x86)\Microsoft SDKs\Windows Azure\PowerShell\Azure\Azure.psd1'

6.	Run the following cmdlet:

		Get-AzurePublishSettingsFile

	You will be prompted to sign on to the Windows Azure portal and then prompted to save a .publishsettings file. Save the file in a directory, for example, E:\PowerShell\MyAccount.publishsettings. To subsequently run any other Windows Azure PowerShell cmdlets, steps 4 through 6 do not need to be repeated because they only need to be completed once. 


7.	Run the following cmdlet to open Windows Azure PowerShell ISE:

		powershell ise

8.	Paste the following script into Windows Azure PowerShell ISE, replacing the placeholders (such as *subscriptionname*) with your own values, and the run the script. If necessary, click **Networks** in the Management Portal to obtain the subscription name. The storage account name is the name you specified in step 1. The image name used in following script installs Windows Server 2012, but the image names are updated periodically. To get a list of currently available images, run <a href="http://msdn.microsoft.com/en-us/library/windowsazure/jj152878.aspx">Get-AzureVMImage</a>. Windows Azure Virtual Networks support the virtualized domain controller safeguards that are present beginning with Windows Server 2012. For more information about virtualized domain controller safeguards, see <a href="http://technet.microsoft.com/en-us/library/hh831734.aspx">Introduction to Active Directory Domain Services (AD DS) Virtualization (Level 100)</a>. 

		cls
		
	    Import-Module "C:\Program Files (x86)\Microsoft SDKs\Windows Azure\PowerShell\Azure\Azure.psd1"
	    Import-AzurePublishSettingsFile 'C:\PowerShell\Justinha001.publishsettings'
	    Set-AzureSubscription -SubscriptionName 'Networking Demo Subscription' -CurrentStorageAccount 'yourstorageaccount'
	    Select-AzureSubscription -SubscriptionName 'Networking Demo Subscription'
	
	    #Deploy the Domain Controller in a virtual network
	    #-------------------------------------------------
	
		#Specify my DC's DNS IP (127.0.0.1)
		$myDNS = New-AzureDNS -Name 'myDNS' -IPAddress '127.0.0.1'
		$vmname = 'ContosoDC1'
		# OS Image to Use
		$image = 'a699494373c04fc0bc8f2bb1389d6106__Windows-Server-2012-Datacenter-201306.01-en.us-127GB.vhd'
		$service = 'ConDC1demosvc'
        $AG = 'YourAffinityGroup'
		$vnet = 'YourVirtualNetwork'
	
		#VM Configuration
		$MyDC = New-AzureVMConfig -name $vmname -InstanceSize 'Small' -ImageName $image |
			Add-AzureProvisioningConfig -Windows -Password P@$$w0rd |
				Set-AzureSubnet -SubnetNames 'BackEndSubnet'

		New-AzureVM -ServiceName $service -VMs $MyDC -AffinityGroup $AG -DnsSettings $myDNS -VNetName $vnet

	If you rerun the script, you need to supply a unique value for $service. You can run Test-AzureName -Service <i>service name</i>, which returns if the name is already taken. After the Windows Azure PowerShell cmdlet successfully completes, the VM will initially appear in the UI in the management portal in a stopped state, followed by a provisioning process. After the VM is provisioned, continue with the next steps.

<h2><a id="Step2"></a>Step 2: Attach additional disks to the VM</h2>

1.	In the management portal, click the name of the VM you created, and on the bottom of the screen, click **Attach**, and click **Attach Empty Disk**.


2. Type the size of hard disk (in GB) you want, such as 30. 

	![Specify disk size][specify-disk-size]

3.	Repeat steps 9 and 10 to attach a second disk.


4.	Click the name of the VM and click **Connect**.

	![Connect][connect]


5.	Click **Open**.

	![Open][open]

6.	In RDP connection dialog, click **Don't ask me again for connections to this computer**, and click **Connect**.

	![Connect with RDP][connect-rdp]

7.	Type your credentials using the format <i>VM Name</i>\<i>AdminUserName</i>. If you provisioned the VM by using Windows Azure PowerShell, type <i>VM Name</i>\Administrator.

	![Credentials][credentials]


8. In Remote Desktop Connection, click **Yes**.

	![Remote Desktop][remote-desktop]



<h2><a id="Step3"></a>Step 3: Install Active Directory Domain Services</h2>

1.	Initialize the disk you attached to the VM and create a new volume to store Active Directory files. 

	a. 	In Server Manager, click **File and Storage Services**. 

	b.	Click **Disks**, right-click the disk you attached, click **Initialize**, and click **Yes** to confirm the operation.

	c.	After initialization is complete, right-click the disk, click **New Volume**. Accept the default values in the New Volume Wizard and finish creating the volume, and then create a new folder named **NTDS** in order to store the Active Directory database and log files.

2.	In Server Manager, click **Manage** and click **Add Roles and Features** to start the Add Roles Wizard. For more information about installing AD DS on Windows Server 2012, see [Install Active Directory Domain Services (Level 100)](http://technet.microsoft.com/en-us/library/hh472162.aspx).


	![Add Role][add-role]


3.	On the Before you begin page, click **Next**.


4.	On the Select installation type page, click **Role-based or feature-based installation** and then click **Next**.

	![Select Installation type][select-installation]


5.	On the Select destination server page, click **Select a server from the server pool**, click the name of the server and then click **Next**.

	![Select server][select-server]

6.	On the Select server roles page, click **Active Directory Domain Services**, then on the Add Roles and Features Wizard dialog box, click **Add Features**, and then click **Next**.  

	![Select Server Role][select-server-role]

	![Add tools][add-tools]


7.	On the Select features page, select any additional features you want to install and click **Next**. 

	![Select features][select-features]


8.	On the Active Directory Domain Services page, review the information and then click **Next**.

9.	On the Confirm installation selections page, click **Install**.

	![Confirm Server Role][confirm-server-role]

10.	On the Results page, verify that the installation succeeded, and click **Promote this server to a domain controller** to start the Active Directory Domain Services Configuration Wizard.

	![Promote][promote]
	
	Note: If you close Add Roles Wizard at this point without starting the Active Directory Domain Services Configuration Wizard, you can restart it by clicking Tasks in Server Manager.

11.	On the Deployment Configuration page, click **Add a new forest** and then type the name of the root domain (for example, fabrikam.com) and click **Next**.

	![New forest][new-forest]

12.	On the Domain Controller Options page, type and confirm the Directory Services Restore Mode password, accept other default values and click **Next**.

	![DC Options][dc-options]

13.	On the DNS Options page (which appears only if you install a DNS server), click **Create DNS delegation** as needed and then click **Next**. If you do, provide credentials that have permission to create DNS delegation records in the parent DNS zone. If a DNS server that hosts the parent zone cannot be contacted, the **Create DNS delegation** option is not available.

14.	On the Additional Options page, type a new NetBIOS name or verify the default NetBIOS name of the domain, and then click **Next**.

	![Additional Options][additional-options]

15.	On the Paths page, type or browse to the locations for the Active Directory database, log files, and SYSVOL folder, and click **Next**. 	
	
	![Paths][paths]

16.	On the Review Options page, confirm your selections, review the selections, and then click **Next**. 

	![Review options][review-options]

17.	On the Prerequisites Check page, confirm that prerequisite validation completed and then click **Install**. 

	![Prerequisite check][prereq-check]

18.	On the Results page, verify that the server was successfully configured as a domain controller. The server will be restarted automatically to complete the AD DS installation. 

<h2><a id="Step4"></a>Step 4: Validate the installation</h2>

1.	Reconnect to the VM.

2.	Click **Start**, type **Command Prompt**, click the Command Prompt icon, and click **Run as Administrator**. 

3.	Type the following command and press ENTER:

		Dcdiag /c /v

4.	Verify that the tests ran successfully. Some tests related to validating IP addresses may not pass. To prevent validation errors related to Time Server, [configure the Windows Time Service](http://technet.microsoft.com/en-us/library/cc731191.aspx) on the new DC.


<h2><a id="Step5"></a>Step 5: Backup the domain controller</h2>

1.	Connect to the VM.

2.	In Server Manager, click **Add Roles and Features**, and on the Select Features page, select **Windows Server Backup**. Follow the instructions to install Windows Server Backup.

3.	Click **Start**, click **Administrative Tools**, click **Windows Server Backup**, then click **Backup once**.
 
4.	Click **Different options**, then click **Next**.

5.	Click **Full Server**, then click **Next**.

6.	Click **Local drives**, then click **Next**.

7.	Select the destination drive that does not host the operating system files or the Active Directory database, then click **Next**.
    ![Backup the DC][backup-dc]

8.	Confirm the settings you selected and then click **Backup**. 


<h2><a id="Step6"></a>Step 6: Provisioning a Virtual Machine that is Domain Joined on Boot</h2>
After the DC is configured, you can either create VMs using the management portal or you can run the following Windows PowerShell script to provision additional virtual machines and have them automatically join the domain when they are provisioned. The DNS client resolver settings for the VMs can be configured when the VMs are provisioned.  

If you create VMs using the management portal, specify the Internal IP address of the domain controller as the Preferred DNS server in the the DNS client resolver settings. To determine the Internal IP address of the domain controller, click the name of virtual machine where it is running.

For more information about using Windows PowerShell, see [Getting Started with Windows Azure PowerShell](http://msdn.microsoft.com/en-us/library/windowsazure/jj156055.aspx) and [Windows Azure Management Cmdlets](http://msdn.microsoft.com/en-us/library/windowsazure/jj152841).

1.	To use Windows Azure PowerShell to create an additional virtual machine that is domain-joined when it first boots, open Windows Azure PowerShell ISE, paste the following script, replace the placeholders (such as *ContosoDC13*) with your own values and run it. Specify the name of the domain controller for the -Name parameter for the New-AzureDNS cmdlet. 

	In the following example, the Internal IP address of the domain controller is 10.4.3.1. The Add-AzureProvisioningConfig also takes a -MachineObjectOU parameter which if specified (requires the full distinguished name in Active Directory) allows for setting Group Policy settings on all of the virtual machines in that container.

	After the virtual machines are provisioned, log on by specifying a domain account using User Principal Name (UPN) format, such as administrator@corp.contoso.com. 

		cls
		
	    Import-Module "C:\Program Files (x86)\Microsoft SDKs\Windows Azure\PowerShell\Azure\Azure.psd1"
	    Import-AzurePublishSettingsFile '*E:\PowerShell\MyAccount.publishsettings*'
	    Set-AzureSubscription -SubscriptionName *subscriptionname* -CurrentStorageAccount *storageaccountname*
	    Select-AzureSubscription -SubscriptionName *subscriptionname*
		
		#Deploy a new VM and join it to the domain
		#-------------------------------------------
		#Specify my DC's DNS IP (10.4.3.1)
		$myDNS = New-AzureDNS -Name '*ContosoDC13*' -IPAddress '*10.4.3.1*'
		
		# OS Image to Use
		$image = 'fb83b3509582419d99629ce476bcb5c8__SQL-Server-2012SP1-CU5-11.0.3373.0-Enterprise-ENU-Win2012'
		$service = '*myazuresvcindomainM1*'
		$AG = '*YourAffinityGroup*'
		$vnet = '*YourVirtualNetwork*'
		$pwd = '*p@$$w0rd*'
		$size = 'Small'
		
		#VM Configuration
		$vmname = 'MyTestVM1'
		$MyVM1 = New-AzureVMConfig -name $vmname -InstanceSize $size -ImageName $image |
		    Add-AzureProvisioningConfig -WindowsDomain -Password $pwd -Domain '*corp*' -DomainPassword '*p@$$w0rd*' -DomainUserName 'Administrator' -JoinDomain '*corp.contoso.com*'|
		    Set-AzureSubnet -SubnetNames '*BackEnd*'
		
		New-AzureVM -ServiceName $service -AffinityGroup $AG -VMs $MyVM1 -DnsSettings $myDNS -VNetName $vnet

If you rerun the script, you need to supply a unique value for $service. You can run Test-AzureName -Service <i>service name</i>, which returns if the name is already taken. After the Windows Azure PowerShell cmdlet successfully completes, the VMs will initially appear in the UI in the management portal in a stopped state, followed by a provisioning process. After the VMs are provisioned, you can log on to them.		

## See Also

-  [Windows Azure Virtual Network](http://msdn.microsoft.com/en-us/library/windowsazure/jj156007.aspx)

-  [Windows Azure PowerShell](http://msdn.microsoft.com/en-us/library/windowsazure/jj156055.aspx)

-  [Windows Azure Management Cmdlets](http://msdn.microsoft.com/en-us/library/windowsazure/jj152841)

-  [Introduction to Active Directory Domain Services (AD DS) Virtualization (Level 100)](http://technet.microsoft.com/en-us/library/hh831734.aspx)

[create-vm]: ./media/active-directory-new-forest-virtual-machine/ADDS_VNetCreateVMFromGallery.png
[vm-image]: ./media/active-directory-new-forest-virtual-machine/ADDS_VNetCreateVMImageSelection.png
[vm-configuration]: ./media/active-directory-new-forest-virtual-machine/ADDS_VNetCreateVMConfig.png
[vm-subnet]: ./media/active-directory-new-forest-virtual-machine/ADDS_VNetCreateVMConfigSubnet.png
[vm-ports]: ./media/active-directory-new-forest-virtual-machine/ADDS_VNetCreateVMConfigPorts.png
[specify-disk-size]: ./media/active-directory-new-forest-virtual-machine/ADDS_VNetCreateVMAttachDisk.png
[connect]: ./media/active-directory-new-forest-virtual-machine/ADDS_VNetCreateVMConnect.png
[open]: ./media/active-directory-new-forest-virtual-machine/ADDS_VNetCreateVMOpenRDP.png
[connect-rdp]: ./media/active-directory-new-forest-virtual-machine/ADDS_VNetCreateVMConnectRDP.png
[credentials]: ./media/active-directory-new-forest-virtual-machine/ADDS_VNetCreateVMCreds.png
[remote-desktop]: ./media/active-directory-new-forest-virtual-machine/ADDS_VNetCreateVMRDPCert.png
[add-role]: ./media/active-directory-new-forest-virtual-machine/ADDS_VNetDCAddRole.png
[select-installation]: ./media/active-directory-new-forest-virtual-machine/ADDS_VNetDCSelectInstallationType.png
[select-server]: ./media/active-directory-new-forest-virtual-machine/ADDS_VNetDCSelectDestinationServer.png
[select-server-role]: ./media/active-directory-new-forest-virtual-machine/ADDS_VNetDCSelectServerRole.png
[add-tools]: ./media/active-directory-new-forest-virtual-machine/ADDS_VNetDCAddTools.png
[select-features]: ./media/active-directory-new-forest-virtual-machine/ADDS_VNetDCSelectFeatures.png
[confirm-server-role]: ./media/active-directory-new-forest-virtual-machine/ADDS_VNetDCConfirmRole.png
[promote]: ./media/active-directory-new-forest-virtual-machine/ADDS_VNetDCPromote.png
[new-forest]: ./media/active-directory-new-forest-virtual-machine/ADDS_VNetDCNewForest.png
[dc-options]: ./media/active-directory-new-forest-virtual-machine/ADDS_VNetDCOptions.png
[additional-options]: ./media/active-directory-new-forest-virtual-machine/ADDS_VNetDCAdditionalOptions.png
[paths]: ./media/active-directory-new-forest-virtual-machine/ADDS_VNetDCPaths.png
[review-options]: ./media/active-directory-new-forest-virtual-machine/ADDS_VNetDCReviewOptions.png
[prereq-check]: ./media/active-directory-new-forest-virtual-machine/ADDS_VNetDCPrereqCheck.png
[backup-dc]: ./media/active-directory-new-forest-virtual-machine/BackupDC.png