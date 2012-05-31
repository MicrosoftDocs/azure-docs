
<properties umbracoNaviHide="0" pageTitle="Install a new Active Directory forest in Windows Azure" metaKeywords="Windows Azure, virtual network, domain controller, active directory, AD, tutorial" metaDescription="Learn how to install a replica AD domain control in a Windows Azure virtual network." linkid="manage-windows-how-to-guide-storage-accounts" urlDisplayName="How to: storage accounts" headerExpose="" footerExpose="" disqusComments="1" />


<h1 id="ADtutorial2">Install a new Active Directory forest in Windows Azure</h1>

<div chunk="../../../Shared/Chunks/disclaimer.md" />

This tutorial walks you through the steps to create a new Active Directory forest on a virtual machine (VM) on Windows Azure Virtual Network. In this tutorial, the virtual network for the VM is not connected to the network at your company.

##Table of Contents##

* [Prerequisites](#Prerequisites)
* [Step 1: Sign on to Windows Azure, attach data disks, and connect to the VM](#Step1)
* [Step 2: Install Active Directory Domain Services](#Step2)
* [Step 3: Validate the installation](#Step3)
* [Step 5: Backup the domain controller](#Step5)
* [Step 6: Provisioning a Virtual Machine that is Domain Joined on Boot](#Step6)


<h2 id="Prerequisites">Prerequisites</h2>

Before you begin, make sure the following prerequisites are complete:

- Create Affinity Group

- Create Virtual Network

- Create Cloud Service in the virtual network

- Two virtual machines (YourVMachine and YourVMachine2) deployed on Virtual Network. One virtual machine must be size L or greater in order to attach two data disks to it. The data disks are needed to store:

	
>- The Active Directory database, logs, and SYSVOL.
	
>- System state backups.

- Domain Name System (DNS) infrastructure deployed if you need to have external users resolve names for accounts in Active Directory. In this case, you should create a DNS zone delegation before you install DNS server on the domain controller, or allow the Active Directory Domain Services Installation Wizard create the delegation. For more information about creating a DNS zone delegation, see [Create a Zone Delegation](http://technet.microsoft.com/en-us/library/cc753500.aspx).

**Note**
>You need to provide your own DNS infrastructure to support AD DS on Windows Azure Virtual Network. The DNS infrastructure provided by Windows Azure for this release does not support some features that AD DS requires, such as SRV resource record registration or dynamic DNS. 

**Note**
>If you already completed the steps in [Install a replica Active Directory domain controller in Windows Azure Virtual Network](tutorial-AD-1), you might need to remove AD DS from the domain controller on the Windows Azure virtual network before you begin this tutorial. For more information about how to remove AD DS, see [Removing a Domain Controller from a Domain](http://technet.microsoft.com/en-us/library/cc771844(v=WS.10).aspx).


<h2 id="Step1">Step 1: Sign on to Windows Azure, attach data disks, and connect to the VM</h2>

**Sign on to Windows Azure, attach data disks, and connect to the VM**

1.	Sign on to Windows Azure.

	![Sign1] (../media/Sign1.png)


2.	Click **YourVMachine**.

	![Sign2] (../media/Sign2.png)


3.	Click **Attach** and then click **Attach Data Disk**.

	![Sign3] (../media/Sign3.png)


4. Select the disk and click **OK**. 

	![Sign4] (../media/Sign4.png)


5.	Repeat steps 3 and 4 to attach a second data disk.

6.	Click **Connect**.

	![Sign5] (../media/Sign5.png)


7.	Click **Open**.

	![Sign6] (../media/Sign6.png)

8.	In RDP connection dialog, click **Don’t ask me again for connections to this computer**, and click **Connect**.

	![Sign7] (../media/Sign7.png)

9.	Type your credentials.

	![Sign8] (../media/Sign8.png)


10. In Remote Desktop Connection, click **Yes**.

	![Sign9] (../media/Sign9.png)



<h2 id="Step2">Step 2: Install Active Directory Domain Services</h2>

1.	In the RDP session for YourVMachine, Click **Start**, right-click **Computer** and click **Manage**. 

	![InstallDC1] (../media/InstallDC1.png)

2.	In the console tree, click Computer Management (Local), click **Storage**, and then click **Disk Management**.
 
3.	Right-click the disk you want to initialize, and then click **Initialize Disk**.

4.	After initialization is finished, right-click the disk again and click **Format**.

5.	Click **Start**, type **dcpromo**, and press ENTER.

	![InstallDC2] (../media/InstallDC2.png)


6.	On the Welcome page, click **Next**.

	![InstallDC3] (../media/InstallDC3.png)


7.	On the Operating System Compatibility page, click **Next**.

	![InstallDC4] (../media/InstallDC4.png)


8.	On the Choose a Deployment Configuration page, click **Create a new domain in a new forest**, and click **Next**.

	![InstallDC5] (../media/InstallDC5.png)

9.	On the Name the Forest Root Domain page, type the fully qualified domain name (FQDN) of the forest root domain (for example, hq.liwareinc.com) and click **Next**.  

	![InstallDC6] (../media/InstallDC6.png)


10.	On the Set Forest Functional level page, click **Windows Server 2008 R2** and then click **Next**.

	![InstallDC7] (../media/InstallDC7.png)


**Note** 
If you choose a different value, you also need to select a value for the domain functional level. 

11.	On the Additional Domain Controller Options page, make sure **DNS server** is selected and click **Next**.

	![InstallDC8] (../media/InstallDC8.png)


12.	On the Static IP assignment warning, click **Yes, the computer will use an IP address automatically assigned by a DHCP server (not recommended)** 

	**Important**

	Although the IP address on the Windows Azure Virtual Network is dynamic, its lease lasts for the duration of the VM. Therefore, you do not need to set a static IP address on the domain controller that you install on the virtual network. Setting a static IP address in the VM will cause communication failures. 

	![InstallDC9] (../media/InstallDC9.png)


13.	When prompted about the DNS delegation warning, click **Yes**.

	![InstallDC10] (../media/InstallDC10.png)


14.	On the Location for Active Directory database, log files and SYSVOL page, click Browse and type or select a location on the data disk for the Active Directory files and click **Next**. 

	![InstallDC11] (../media/InstallDC11.png)


15.	On the Directory Services Restore Administrator page, type and confirm the DSRM password and click **Next**. 

	![InstallDC12] (../media/InstallDC12.png)


16.	 On the Summary page, confirm your selections and click **Next**.

	![InstallDC13] (../media/InstallDC13.png)


17.	 After the Active Directory Installation Wizard finishes, click **Finish** and then click **Restart Now** to complete the installation. 

	![InstallDC14] (../media/InstallDC14.png)


<h2 id="Step3">Step 3: Validate the installation</h2>

1.	 Reconnect to the VM.

2.	Click **Start**, right-click **Command Prompt** and click **Run as Administrator**. 

3.	Type the following command and press ENTER:

	'Dcdiag /c /v'

4.	Verify that the tests ran successfully. 


<h2 id="Step5">Step 5: Backup the domain controller</h2>

1.	Connect to YourVMachine.

2.	Click **Start**, Click **Server Manager**, click **Add Features**, and then select **Windows Server Backup Features**. Follow the instructions to install Windows Server Backup.

3.	Click **Start**, Click **Windows Server Backup**, click **Backup once**.
 
4.	Click **Different options** and click **Next**.

5.	Click **Full Server** and click **Next**.

6.	Click **Local drives** and click **Next**.

7.	Select the destination drive that does not host the operating system files or the Active Directory database, and click Next.


	![BackupDC] (../media/BackupDC.png)

8.	Click OK if necessary to confirm if the destination volume is included in the backup and then click Backup. 

To provision virtual machines and have them automatically join the domain when they are provisioned, create a new cloud service as the container for the new virtual machines. The DNS servers for the VMs can be automatically configured by specifying DNS settings during the initial deployment of the cloud service. 

The next step explains how you can automatically provision new virtual machines that are joined to the Active Directory domain at boot. 


<h2 id="Step6">Step 6: Provisioning a Virtual Machine that is Domain Joined on Boot</h2>

1.	The Add-AzureProvisioningConfig also takes a -MachineObjectOU parameter which if specified (requires the full distinguished name in Active Directory) allows for setting group policy settings on all of the virtual machines in that container. Ensure that you replace storageaccountname with your storage account name.

		# # Point to IP Address of Domain Controller Created Earlier  
		$dns1 = New-AzureDns -Name 'dc-name' -IPAddress 'IP ADDRESS'
		
		# Configuring VM to Automatically Join Domain 
		$advm1 = New-AzureVMConfig -Name 'advm1' -InstanceSize Small -ImageName $imgname | Add-AzureProvisioningConfig -WindowsDomain -Password '[YOUR-PASSWORD]' ` -Domain 'contoso' -DomainPassword '[YOUR-PASSWORD]' ` -DomainUserName 'administrator' -JoinDomain 'contoso.com' | Set-AzureSubnet -SubnetNames 'AppSubnet' 
		
		# New Cloud Service with VNET and DNS settings
		New-AzureVM –ServiceName 'someuniqueappname' -AffinityGroup 'adag' ` -VMs $advm1 -DnsSettings $dns1 -VNetName 'ADVNET'
		
