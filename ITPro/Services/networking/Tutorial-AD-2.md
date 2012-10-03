<properties umbracoNaviHide="0" pageTitle="Install a new Active Directory forest in Windows Azure" metaKeywords="Windows Azure, virtual network, domain controller, active directory, AD, tutorial" metaDescription="Learn how to install a replica AD domain control in a Windows Azure virtual network." linkid="manage-windows-how-to-guide-storage-accounts" urlDisplayName="How to: storage accounts" headerExpose="" footerExpose="" disqusComments="1" />
#Install a new Active Directory forest in Windows Azure

<div chunk="../../Shared/Chunks/disclaimer.md" />

This tutorial walks you through the steps to create a new Active Directory forest on a virtual machine (VM) on [Windows Azure Virtual Network](http://msdn.microsoft.com/en-us/library/windowsazure/jj156007.aspx). In this tutorial, the virtual network for the VM is not connected to the network at your company. For conceptual guidance about installing Active Directory Domain Services (AD DS) on Windows Azure Virtual Network, see [Guidelines for Deploying Windows Server Active Directory on Windows Azure Virtual Machines](http://msdn.microsoft.com/en-us/library/windowsazure/jj156090.aspx).

##Table of Contents##

* [Prerequisites](#Prerequisites)
* [Step 1: Create the first Virtual Machine (VM)](#Step1)
* [Step 2: Install Active Directory Domain Services](#Step2)
* [Step 3: Validate the installation](#Step3)
* [Step 4: Backup the domain controller](#Step4)
* [Step 5: Provisioning a Virtual Machine that is Domain Joined on Boot](#Step5)


<h2 id="Prerequisites">Prerequisites</h2>

Before you install Active Directory Domain Services (AD DS) on a Windows Azure virtual machine, you need to create a virtual network using one of the following options:

-	**Create a virtual network *without* connectivity to another network** by doing the following in the order listed: 
1.  First, [Create a virtual network in Windows Azure](../Tutorial1_CreateVirtualNetwork/). 
2.  Then install AD DS using the steps in the tutorial below.
	<div class="dev-callout"> 
	<b>Important</b>
	<p>It's important that you create your virtual machine using the Windows Azure PowerShell procedure in the tutorial below instead of creating the virtual machine via the Management Portal.</p>
	</div>
-	**Create a virtual network *with* connectivity to another network**, such as an Active Directory environment on premises by doing the following in the order listed: 
1.	First, [Create a Virtual Network for Cross-Premises Connectivity](../cross-premises-connectivity/). 
2.	Next, [Add a Virtual Machine to a Virtual Network](../add-a-vm-to-a-virtual-network/). 
3.	Finally, install AD DS by following the steps in [Install a Replica Active Directory Domain Controller in Windows Azure Virtual Networks](../replica-domain-controller/).

<h2 id="Step1">Step 1: Create the first Virtual Machine (VM)</h2>

1.	Create a storage account that is in the same region as the affinity group. To check the region of the affinity group, click **Networks**, and click **Affinity Groups**. To create a storage account: 

	a.  Click **New**, click **Storage**, and then click **Quick Create**. 

	b.  Type the name of the storage account, and for **Region/Affinity Group**, select the region of the affinity group. By selecting a location for the storage account, it can be used with any affinity group in the virtual network.

2.	Install [Windows Azure PowerShell](http://msdn.microsoft.com/en-us/library/windowsazure/jj156055.aspx). The VM where you plan to install AD DS must be created using Windows Azure PowerShell in order for the DNS client settings of the domain controller to persist after service healing. 

	a.  Go to [https://www.windowsazure.com/en-us/](https://www.windowsazure.com/en-us/)

	b.  Click **Manage**, then click **Downloads**.

	c.  Under **Windows**, click **Install**, then click **Run**. Click **Yes** if prompted by the **User Account Control** dialog. 

	d.  Click **Install** to go through installation wizard, click **I accept**, and when the wizard is done, click **Finish**. 

	e.	Click **Exit** to close the Web Platform Installer 4.0.

3.	Click **Start**, click **All Programs**, click **Windows Azure**, right-click **Windows Azure PowerShell**, and click **Run as Administrator**. Click **Yes** if prompted by the **User Account Control** dialog.

4.	In Windows Azure PowerShell, run the following cmdlet, and then type **Y** to finish the command:

		Set-ExecutionPolicy RemoteSigned

5.	Run the following cmdlet:

		Import-Module 'C:\Program Files (x86)\Microsoft SDKs\Windows Azure\PowerShell\Azure\Azure.psd1'

6.	Run the following cmdlet:

		Get-AzurePublishSettingsFile

	You will be prompted to sign on to the Windows Azure portal and then prompted to save a .publishsettings file. Save the file in a directory, for example, E:\PowerShell\MyAccount.publishsettings.

	<div class="dev-callout"> 
	<b>Note</b> 
	To subsequently run any other Windows Azure PowerShell cmdlets, steps 4 through 6 do not need to be repeated because they only need to be completed once. 
	</div>

7.	Run the following cmdlet to open Windows Azure PowerShell ISE:

		powershell ise

8.	Paste the following script into Windows Azure PowerShell ISE, replacing the placeholders with your own values, and the run the script. If necessary, click **Networks** in the Management Portal to obtain the subscription name. The storage account name is the name you specified in step 1.

	<div class="dev-callout"> 
	<b>Note</b> 
	The following script installs Windows Server 2008 R2 with Service Pack 1 (SP1). You can install Windows Server 2012 instead, but be aware that the virtualized domain controller safeguards that are built into Windows Server 2012 are not available on Windows Azure Virtual Networks. The virtualized domain controller safeguards require support for VM-GenerationID, which Windows Azure Virtual Networks do not provide at the present time. For more information about virtualized domain controller safeguards, see <a href="http://technet.microsoft.com/en-us/library/hh831734.aspx">Introduction to Active Directory Domain Services (AD DS) Virtualization (Level 100)</a>. To get a list of available images, run <a href="http://msdn.microsoft.com/en-us/library/windowsazure/jj152878.aspx">Get-AzureVMImage</a>.
	</div>


	    cls
		
	    Import-Module "C:\Program Files (x86)\Microsoft SDKs\Windows Azure\PowerShell\Azure\Azure.psd1"
	    Import-AzurePublishSettingsFile 'E:\PowerShell\ MyAccount.publishsettings'
	    Set-AzureSubscription -SubscriptionName subscriptionname -CurrentStorageAccount storageaccountname
	    Select-AzureSubscription -SubscriptionName subscriptionname
	
	    #Deploy the Domain Controller in a virtual network
	    #-------------------------------------------------
	
		#Specify my DC's DNS IP (127.0.0.1)
		$myDNS = New-AzureDNS -Name 'myDNS' -IPAddress '127.0.0.1'
		$vmname = 'ContosoDC1'
		# OS Image to Use
		$image = 'MSFT__Win2K8R2SP1-Datacenter-201207.01-en.us-30GB.vhd'
		$service = 'myazuredemodcsvc'
		$AG = 'YourAffinityGroup'
		$vnet = 'YourVirtualNetwork'
	
		#VM Configuration
		$MyDC = New-AzureVMConfig -name $vmname -InstanceSize 'Small' -ImageName $image |
			Add-AzureProvisioningConfig -Windows -Password 'p@$$w0rd' |
				Set-AzureSubnet -SubnetNames 'BackEnd'

		New-AzureVM -ServiceName $service -AffinityGroup $AG -VMs $MyDC -DnsSettings $myDNS -VNetName $vnet


	<div class="dev-callout"> 
	<b>Note</b> 
	<p>If you rerun the script, you need to supply a unique value for $service.</p>
	</div>

9.	Sign on to Windows Azure.

	![Sign1] (../media/Sign1.png)


10.	Click the name of the VM you created.

	![Sign2] (../media/Sign2.png)


11.	On the bottom of the screen, click **Attach**, and click **Attach Empty Disk**.


12. Type the size of hard disk (in GB) you want, such as 30, and click the **Check** button. 

	![Sign4] (../media/ADDS_SpecifyDiskSize.png)


13.	Repeat steps 11 and 12 to attach a second disk.

14.	Click **Connect**.

	![Sign5] (../media/Sign5.png)


15.	Click **Open**.

	![Sign6] (../media/Sign6.png)

16.	In RDP connection dialog, click **Don’t ask me again for connections to this computer**, and click **Connect**.

	![Sign7] (../media/Sign7.png)

17.	Type your credentials.

	![Sign8] (../media/Sign8.png)


18. In Remote Desktop Connection, click **Yes**.

	![Sign9] (../media/Sign9.png)



<h2 id="Step2">Step 2: Install Active Directory Domain Services</h2>

1.	In the RDP session, Click **Start**, right-click **Computer** and click **Manage**. 

	![InstallDC1] (../media/InstallDC1.png)

2.	In the console tree, click Computer Management (Local), click **Storage**, and then click **Disk Management**.
 
3.	When you are prompted to initialize the disks, click **OK**.

	![] (../media/ADDS_InitializeDisks.png)

4.	Right-click the remaining disk that is not formatted, and click **New Simple Volume**. Accept the default values in the wizard and finish creating the volume, and then create a new folder named **NTDS** on the volume in order to store the Active Directory database and logg files.

5.	Click **Start**, type **dcpromo**, and press ENTER.

	![InstallDC2] (../media/InstallDC2.png)


6.	On the **Welcome** page, click **Next**.

	![InstallDC3] (../media/InstallDC3.png)


7.	On the **Operating System Compatibility** page, click **Next**.

	![InstallDC4] (../media/InstallDC4.png)


8.	On the **Choose a Deployment Configuration** page, click **Create a new domain in a new forest**, and click **Next**.

	![InstallDC5] (../media/InstallDC5.png)

9.	On the **Name the Forest Root Domain** page, type the fully qualified domain name (FQDN) of the forest root domain (for example, hq.litwareinc.com) and click **Next**.  

	![InstallDC6] (../media/InstallDC6.png)


10.	On the **Set Forest Functional level** page, click **Windows Server 2008 R2** and then click **Next**.

	![InstallDC7] (../media/InstallDC7.png)

	<div class="dev-callout"> 
	<b>Note</b> 
	If you choose a different value, you also need to select a value for the domain functional level. 
	</DIV>

11.	On the **Additional Domain Controller Options** page, make sure **DNS server** is selected and click **Next**.

	![InstallDC8] (../media/InstallDC8.png)


12.	On the Static IP assignment warning, click **Yes, the computer will use an IP address automatically assigned by a DHCP server (not recommended)** 
	<div class="dev-callout"> 
	<b>Important</b>
	Although the IP address on the Windows Azure Virtual Network is dynamic, its lease lasts for the duration of the VM. Therefore, you do not need to set a static IP address on the domain controller that you install on the virtual network. Setting a static IP address in the VM will cause communication failures. 
	</div>
	
	![InstallDC9] (../media/InstallDC9.png)


13.	When prompted about the DNS delegation warning, click **Yes**.

	![InstallDC10] (../media/InstallDC10.png)


14.	On the **Location for Active Directory database, log files and SYSVOL** page, click **Browse** and type or select a location on the data disk for the Active Directory files, and click **Next**. 

	![InstallDC11] (../media/InstallDC11.png)


15.	On the **Directory Services Restore Administrator** page, type and confirm the DSRM password, and click **Next**. 

	![InstallDC12] (../media/InstallDC12.png)


16.	 On the **Summary** page, confirm your selections, and click **Next**.

	![InstallDC13] (../media/InstallDC13.png)


17.	 After the Active Directory Installation Wizard finishes, click **Finish**, and then click **Restart Now** to complete the installation. 

	![InstallDC14] (../media/InstallDC14.png)


<h2 id="Step3">Step 3: Validate the installation</h2>

1.	 Reconnect to the VM.

2.	Click **Start**, right-click **Command Prompt**, and click **Run as Administrator**. 

3.	Type the following command and press ENTER:

		'Dcdiag /c /v'

4.	Verify that the tests ran successfully. 


<h2 id="Step4">Step 4: Backup the domain controller</h2>

1.	Connect to the VM.

2.	Click **Start**, Click **Server Manager**, click **Add Features**, and then select **Windows Server Backup Features**. Follow the instructions to install Windows Server Backup.

3.	Click **Start**, click **Windows Server Backup**, then click **Backup once**.
 
4.	Click **Different options**, then click **Next**.

5.	Click **Full Server**, then click **Next**.

6.	Click **Local drives**, then click **Next**.

7.	Select the destination drive that does not host the operating system files or the Active Directory database, then click **Next**.

	![BackupDC] (../media/BackupDC.png)

8.	Click **OK**, if necessary, to confirm if the destination volume is included in the backup, and then click **Backup**. 

After the DC is configured, run the following Windows PowerShell cmdlet to provision additional virtual machines and have them automatically join the domain when they are provisioned. The DNS client resolver settings for the VMs must be configured when the VMs are provisioned. Substitute the correct names for your domain, VM name, and so on. 

For more information about using Windows PowerShell, see [Getting Started with Windows Azure PowerShell](http://msdn.microsoft.com/en-us/library/windowsazure/jj156055.aspx) and [Windows Azure Management Cmdlets](http://msdn.microsoft.com/en-us/library/windowsazure/jj152841).


<h2 id="Step5">Step 5: Provisioning a Virtual Machine that is Domain Joined on Boot</h2>

1.	To create an additional virtual machine that is domain-joined when it first boots, open Windows Azure PowerShell ISE, paste the following script, replace the placeholders with your own values and run it. 

	To determine the Internal IP address of the domain controller, click the name of virtual network where it is running. 

	In the following example, the Internal IP address of the domain controller is 10.4.3.1.The Add-AzureProvisioningConfig also takes a -MachineObjectOU parameter which if specified (requires the full distinguished name in Active Directory) allows for setting Group Policy settings on all of the virtual machines in that container.

	After the virtual machines are provisioned, log on by specifying a domain account using User Principal Name (UPN) format, such as administrator@corp.contoso.com. 

		#Deploy a new VM and join it to the domain
		#-------------------------------------------
		#Specify my DC's DNS IP (10.4.3.1)
		$myDNS = New-AzureDNS -Name 'ContosoDC13' -IPAddress '10.4.3.1'
		
		# OS Image to Use
		$image = 'MSFT__Sql-Server-11EVAL-11.0.2215.0-08022012-en-us-30GB.vhd'
		$service = 'myazuresvcindomainM1'
		$AG = 'YourAffinityGroup'
		$vnet = 'YourVirtualNetwork'
		$pwd = 'p@$$w0rd'
		$size = 'Small'
		
		#VM Configuration
		$vmname = 'MyTestVM1'
		$MyVM1 = New-AzureVMConfig -name $vmname -InstanceSize $size -ImageName $image |
		    Add-AzureProvisioningConfig -WindowsDomain -Password $pwd -Domain 'corp' -DomainPassword 'p@$$w0rd' -DomainUserName 'Administrator' -JoinDomain 'corp.contoso.com'|
		    Set-AzureSubnet -SubnetNames 'BackEnd'
		
		New-AzureVM -ServiceName $service -AffinityGroup $AG -VMs $MyVM1 -DnsSettings $myDNS -VNetName $vnet

		
## See Also

-  [Windows Azure Virtual Network](http://msdn.microsoft.com/en-us/library/windowsazure/jj156007.aspx)

-  [Windows Azure PowerShell](http://msdn.microsoft.com/en-us/library/windowsazure/jj156055.aspx)

-  [Windows Azure Management Cmdlets](http://msdn.microsoft.com/en-us/library/windowsazure/jj152841)

-  [Introduction to Active Directory Domain Services (AD DS) Virtualization (Level 100)](http://technet.microsoft.com/en-us/library/hh831734.aspx)