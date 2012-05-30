
<properties umbracoNaviHide="0" pageTitle="Install a Replica Active Directory Domain Controller in Windows Azure Virtual Network" metaKeywords="Windows Azure, virtual network, domain controller, active directory, AD, tutorial" metaDescription="Learn how to install a replica AD domain control in a Windows Azure virtual network." linkid="manage-windows-how-to-guide-storage-accounts" urlDisplayName="How to: storage accounts" headerExpose="" footerExpose="" disqusComments="1" />


<h1 id="ADdomaincontrollertutorial">Install a Replica Active Directory Domain Controller in Windows Azure Virtual Network</h1>

This tutorial walks you through the steps to install an additional domain controller from your Corp Active Directory forest on a virtual machine (VM) on Windows Azure Virtual Network. In this tutorial, the virtual network for the VM is connected to the network at your company.

##Table of Contents##

* [Prerequisites](#Prerequisites)
* [Step 1: Verify static IP address for YourPrimaryDC](#verifystaticip)
* [Step 2: Install Corp forest](#installforest)
* [Step 3: Create subnets and sites](#subnets)
* [Step 4: Install an additional domain controller in the CloudSite](#cloudsite)
* [Step 5: Validate the installation](#validate)
* [Step 6: Provisioning a Virtual Machine that is Domain Joined on Boot](#provisionvm)
* [Step 7: Backup the domain controller](#backup)
* [Step 8: Test authentication and authorization](#test)


<h2 id="Prerequisites">Prerequisites</h2>

-	Cloud service deployed
-	Affinity service deployed, and Affinity group created
-	A Virtual Network created on Windows Azure that hosts two VMs (YourVMachine and YourVMachine2). One VM must be size L or greater in order to attach two data disks to it. The data disks are needed to store:
>-	The Active Directory database, logs, and SYSVOL.
>-	System state backups.

-	A Corp network with two VMs (YourPrimaryDC and FileServer). 
-	Virtual Network for cross-premises connectivity configured between Windows Azure Virtual network and Corp network.
-	Domain Name System (DNS) infrastructure deployed if you need to have external users resolve names for accounts in Active Directory. In this case, you should create a DNS zone delegation before you install DNS server on the domain controller, or allow the Active Directory Domain Services Installation Wizard create the delegation. For more information about creating a DNS zone delegation, see [Create a Zone Delegation](http://technet.microsoft.com/en-us/library/cc753500.aspx).

**Note**
>You need to provide your own DNS infrastructure to support AD DS on Windows Azure Virtual Network. The Windows Azure-provided DNS infrastructure for this release does not support some features that AD DS requires, such as SRV resource record registration or dynamic DNS. 

**Note**
>If you already completed the steps in [Install a new Active Directory forest in Windows Azure](), you might need to remove AD DS from the domain controller on the Windows Azure virtual network before you begin this tutorial. For more information about how to remove AD DS, see [Removing a Domain Controller from a Domain]().



<h2 id="verifystaticip">Step 1: Verify static IP address for YourPrimaryDC</h2>

1.	Log on to YourPrimaryDC on the Corp network.

2.	In Server Manager, click View Network Connections.

3.	Right-click the local area network connection and click Properties.

4.	Click Internet Protocol Version 4 (TCP/IPv4) and click Properties.

5.	Verify that the server is assigned a static IP address. 

	![VerifystaticIPaddressyourPrimaryDC1] (../media/VerifystaticIP.png)


<h2 id="installforest">Step 2: Install Corp forest</h2>

1.	In the RDP session for the VM, click **Start**, type **dcpromo**, and press ENTER.

	![InstallCorpForest1] (../media/InstallCorpForest1.png)


2.	On the Welcome page, click **Next**.

	![InstallCorpForest2](../media/InstallCorpForest2.png)



3.	On the Operating System Compatibility page, click **Next**.

	![InstallCorpForest3](../media/InstallCorpForest3.png)

4.	On the Choose a Deployment Configuration page, click **Create a new domain in a new forest**, and click **Next**. 

	![InstallCorpForest4](../media/InstallCorpForest4.png)


5.	On the Name the Forest Root Domain page, type **corp.contoso.com** the fully qualified domain name (FQDN) of the forest root domain and click **Next**. 

	![InstallCorpForest5](../media/InstallCorpForest5.png)


6.	On the Set Forest Functional level page, click **Windows Server 2008 R2** and then click **Next**.

	![InstallCorpForest6](../media/InstallCorpForest6.png)

7.	On the Additional Domain Controller Options page, click **DNS server** and click **Next**.

	![InstallCorpForest7](../media/InstallCorpForest7.png)

8.	If the following DNS delegation warning appears, click **Yes**.

	![InstallCorpForest8](../media/InstallCorpForest8.png)


9.	On the Location for Active Directory database, log files and SYSVOL page, type or select the location for the files and click **Next**.

	![InstallCorpForest9](../media/InstallCorpForest9.png)


10.	On the Directory Services Restore Administrator page, type and confirm the DSRM password and click **Next**.

	![InstallCorpForest10](../media/InstallCorpForest10.png)


11.	On the Summary page, confirm your selections and click **Next**. 

	![InstallCorpForest11](../media/InstallCorpForest11.png)

12.	After the Active Directory Installation Wizard finishes, click **Finish** and then click **Restart Now** to complete the installation. 

	![InstallCorpForest12](../media/InstallCorpForest12.png)



<h2 id="subnets">Step 3: Create subnets and sites</h2>

1.	On YourPrimaryDC, click Start, click Administrative Tools and then click Active Directory Sites and Services.
2.	Click **Sites**, right-click **Subnets**, and then click **New Subnet**.

	![CreateSubnetsandSites1](../media/CreateSubnetsandSites1.png)

3.	In **Prefix::**, type **10.1.0.0/24**, select the **Default-First-Site-Name** site object and click **OK**.

	![CreateSubnetsandSites2](../media/CreateSubnetsandSites2.png)


4.	Right-click **Sites** and click **New Site**.

	![CreateSubnetsandSites3](../media/CreateSubnetsandSites3.png)


5.	In Name:, type **CloudSite**, select **DEFAULTIPSITELINK** and click **OK**. 

	![CreateSubnetsandSites4](../media/CreateSubnetsandSites4.png)


6.	Click **OK** to confirm the site was created. 

	![CreateSubnetsandSites5](../media/CreateSubnetsandSites5.png)

7.	Right-click **Subnets**, and then click **New Subnet**.

	![CreateSubnetsandSites6](../media/CreateSubnetsandSites6.png)

8.	In **Prefix::**, type **10.4.2.0/24**, select the **CloudSite** site object and click **OK**.

	![CreateSubnetsandSites7](../media/CreateSubnetsandSites7.png)


<h2 id="cloudsite">Step 4: Install an additional domain controller in the CloudSite</h2>

1.	Log on to YourVMachine, click **Start**, type **dcpromo**, and press ENTER.

	![AddDC1](../media/AddDC1.png)

2.	On the Welcome page, click **Next**.

	![AddDC2](../media/AddDC2.png)


3.	On the Operating System Compatibility page, click **Next**.

	![AddDC3](../media/AddDC3.png)

4.	On Choose a Deployment Configuration page, click **Existing forest**, click **Add a domain controller to an existing domain**, and click **Next**.

	![AddDC4](../media/AddDC4.png)


5.	On the Network Credentials page, make sure you are installing the domain controller in **corp.contoso.com** domain and type credentials of a member of the Domain Admins group (or use corp\administrator credentials). 

	![AddDC5](../media/AddDC5.png)


6.	On the Select a Domain page, click **Next**. 

	![AddDC6](../media/AddDC6.png)


7.	On the Select a Site page, make sure that CloudSite is selected and click **Next**.

	![AddDC7](../media/AddDC7.png)

8.	On the Additional Domain Controller Options page, click **Next**. 

	![AddDC8](../media/AddDC8.png)


9.	On the Static IP assignment warning, click **Yes, the computer will use an IP address automatically assigned by a DHCP server (not recommended)**

	**Important** 

 Although the IP address on the Windows Azure Virtual Network is dynamic, its lease lasts for the duration of the VM. Therefore, you do not need to set a static IP address on the domain controller that you install on the virtual network. Setting a static IP address in the VM will cause communication failures.

	![AddDC9](../media/AddDC9.png)

10.	When prompted about the DNS delegation warning, click **Yes**.

	![AddDC10](../media/AddDC10.png)


11.	On the Location for Active Directory database, log files and SYSVOL page, click Browse and type or select a location on the data disk for the Active Directory files and click **Next**. 

	![AddDC11](../media/AddDC11.png)

12.	On the Directory Services Restore Administrator page, type and confirm the DSRM password and click **Next**.

	![AddDC12](../media/AddDC12.png)

13.	On the Summary page, click **Next**.

	![AddDC13](../media/AddDC13.png)

14.	After the Active Directory Installation Wizard finishes, click **Finish** and then click **Restart Now** to complete the installation. 

	![AddDC14](../media/AddDC14.png)


<h2 id="validate">Step 5: Validate the installation</h2>

1.	Reconnect to the VM.

2.	Click **Start**, right-click **Command Prompt** and click **Run as Administrator**. 

3.	Type the following command and press ENTER:  'Dcdiag /c /v'

4.	Verify that the tests ran successfully. 

To provision virtual machines and have them automatically join the domain when they are provisioned, create a new cloud service as the container for the new virtual machines. The DNS servers for the VMs can be automatically configured by specifying DNS settings during the initial deployment of the cloud service. 

The example below demonstrates how you can automatically provision new virtual machines that are joined to the Active Directory domain at boot. 


<h2 id="provisionvm">Step 6: Provisioning a Virtual Machine that is Domain Joined on Boot</h2>

1.	The Add-AzureProvisioningConfig also takes a -MachineObjectOU parameter which if specified (requires the full distinguished name in Active Directory) allows for setting group policy settings on all of the virtual machines in that container. Ensure that you replace storageaccountname with your storage account name.

		# # Point to IP Address of Domain Controller Created Earlier  
		$dns1 = New-AzureDns -Name 'dc-name' -IPAddress 'IP ADDRESS'
		
		# Configuring VM to Automatically Join Domain 
		$advm1 = New-AzureVMConfig -Name 'advm1' -InstanceSize Small -ImageName $imgname | Add-AzureProvisioningConfig -WindowsDomain -Password '[YOUR-PASSWORD]' ` -Domain 'contoso' -DomainPassword '[YOUR-PASSWORD]' ` -DomainUserName 'administrator' -JoinDomain 'contoso.com' | Set-AzureSubnet -SubnetNames 'AppSubnet' 
		
		# New Cloud Service with VNET and DNS settings
		New-AzureVM –ServiceName 'someuniqueappname' -AffinityGroup 'adag' ` -VMs $advm1 -DnsSettings $dns1 -VNetName 'ADVNET'
		

<h2 id="backup">Step 7: Backup the domain controller</h2>


1.	Connect to YourVMachine.

2.	Click **Start**, Click **Server Manager**, click **Add Features**, and then select **Windows Server Backup Features**. Follow the instructions to install Windows Server Backup.

3.	Click **Start**, Click **Windows Server Backup**, click **Backup once**.
 
4.	Click **Different options** and click **Next**.

5.	Click **Full Server** and click **Next**.

6.	Click **Local drives** and click **Next**.

7.	Select the destination drive that does not host the operating system files or the Active Directory database, and click Next.

	![BackupDC](../media/BackupDC.png)


8.	Click OK if necessary to confirm if the destination volume is included in the backup and then click Backup.



<h2 id="test">Step 8: Test authentication and authorization</h2>

1.	In order to test authentication and authorization, create a domain user account in Active Directory. 
Log on to the client VM in each site and create a shared folder on the VM

2.	Test access to the shared folder using different accounts and groups and permissions. 
