<properties linkid="manage-services-networking-active-directory-forest" urlDisplayName="Active Directory forest" pageTitle="Install an Active Directory forest on an Azure virtual network" metaKeywords="" description="A tutorial that explains how to create a new Active Directory forest on a virtual machine (VM) on an Azure Virtual Network." metaCanonical="" services="active-directory,virtual-network" documentationCenter="" title="Install a new Active Directory forest in Azure" authors="Justinha"  solutions="" writer="Justinha" manager="TerryLan" editor="LisaToft"  />

<tags ms.service="active-directory" ms.workload="identity" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="Justinha" />




#Install a new Active Directory forest on an Azure virtual network

This topic shows how to create a new Windows Server Active Directory environment on an Azure virtual network on a virtual machine (VM) on an [Azure virtual network](http://msdn.microsoft.com/en-us/library/windowsazure/jj156007.aspx). In this case, the Azure virtual network is not connected to an on-premises network. 

You might also be interested in these related topics:

- You can optionally [configure a site-to-site VPN using the Management Portal Wizard](http://msdn.microsoft.com/en-us/library/windowsazure/dn133795.aspx) and then either install a new forest or extend an on-premises forest to an Azure virtual network. For those steps, see [Install a Replica Active Directory Domain Controller in an Azure Virtual Network](http://www.windowsazure.com/en-us/documentation/articles/virtual-networks-install-replica-active-directory-domain-controller/).
-  For conceptual guidance about installing Active Directory Domain Services (AD DS) on an Azure virtual network, see [Guidelines for Deploying Windows Server Active Directory on Azure Virtual Machines](http://msdn.microsoft.com/en-us/library/windowsazure/jj156090.aspx).
-  For step-by-step guidance to create a test lab environment on Azure that includes AD DS, see [Test Lab Guide: Windows Server 2012 R2 Base Configuration in Azure](http://www.microsoft.com/en-us/download/details.aspx?id=41684).



##Table of Contents##

* [How does this differ from on-premises?](#differ)
* [Step 1. Create an Azure virtual network](#createvnet)
* [Step 2: Create a VM to run the domain controller and DNS server roles](#createvm)
* [Step 3: Install Windows Server Active Directory](#installad)
* [Step 4: Set the DNS server for the Azure virtual network](#dns)
* [Step 5: Create VMs for domain members and join the domain](#domainmembers)


<h2><a id="differ"></a>How does this differ from on-premises?</h2>
There is not much difference between installing a domain controller on Azure versus on-premises. The main differences are listed in the following table. 

To configure...  | On-premises  | Azure virtual network	
------------- | -------------  | ------------
**IP address for the domain controller**  | Assign static IP address on the network adapter properties   | Obtain IP address via DHCP and optionally run the Set-AzureStaticVNetIP cmdlet to make it static
**DNS client resolver**  | Set Preferred and Alternate DNS server address on the network adapter properties of domain members   | Set DNS server address on the the virtual network properties
**Active Directory database storage**  | Optionally change the default storage location from C:\  | You need to change default storage location from C:\



<h2><a id="createvnet"></a>Step 1: Create an Azure virtual network</h2>
1. Sign in to the [Azure Management Portal](https://manage.windowsazure.com).
2. Create a virtual network. Click <b>Networks</b> > <b>Create a virtual network</b>. Use the values in the following table to complete the wizard. 

	On this wizard page…  | Specify these values
	------------- | -------------
	**Virtual Network Details**  | <p>Name: Enter a name for your virtual network</p><p>Region: Choose the closest region</p><p>Affinity Group: <b>Create a new affinity group</b></p><p>Affinity Group Name: Enter a name for your affinity group</p>
	**DNS and VPN**  | <p>Leave DNS server blank</p><p>Don't select either VPN option</p>
	**Virtual network address spaces**  | <p>Subnet name: Enter a name for your subnet</p><p>Starting IP: <b>10.0.0.0</b></p><p>CIDR: <b>/24 (256)</b></p>



<h2><a id="createvm"></a>Step 2: Create a VM to run the domain controller and DNS server roles</h2>
 
1. Click <b>New</b> > <b>Compute</b> > <b>Virtual Machine</b> > <b>From Gallery</b>. 
2. Use the values in the following table to complete the wizard.

	On this wizard page…  | Specify these values
	------------- | -------------
	**Operating system**  | Select **Windows Server 2012 R2 Datacenter**
	**Virtual machine configuration**  | <p>Release date: Today's date</p><p>Machine name: Specify a unique value</p><p>Tier: Standard</p><p>Size: Select any size</p><p>User name: Enter a name. This user account will be a member of the built-in Administrators group. </p><p>Password: Must be at least 8 characters, and include 3 of the following types of characters:</p><ul><li>an uppercase letter</li><li>a lowercase letter</li><li>a number</li><li>a special character</li></ul>
	**Cloud service**  | <p>Cloud service: <b>Create a new cloud service</b></p><p>Cloud service name: Accept default value</p><p>Region/AffinityGroup/VirtualNetwork: Select the virtual network you created</p><p>Virtual network subnet: Select the subnet you created. </p><p>Storage account: <b>Use an automatically generated storage account</b></p><p>Availability set: <b>None</b></p><p>Endpoints: Accept default values</p>
	**VM Agent**  | Select **Install the VM Agent**

1. The dynamic IP address that the VM is assigned by default is valid for the duration of the cloud service. But it will change if the VM is shut down. You can assign a static IP address by [running the Set-AzureStaticVNetIP Azure PowerShell cmdlet](http://msdn.microsoft.com/en-us/library/windowsazure/dn630228.aspx) so the IP address will persist if you ever do need to shut down the VM. 
2. Attach an additional disk to the VM to store the Active Directory database, logs, and SYSVOL. 
  3. Click the <b>VM</b> > <b>Attach</b> > <b>Attach empty disk</b>. 
  4. Specify a size (for example, 10 GB) and accept all other default values.
3. Log on to the VM and format the additional disk. 
  4. Click <b>Connect</b> to log on to the VM, click <b>Open</b> to create an RDP session, and click <b>Connect</b> again.
  4. Change the credentials to the new user name and password you specified.
  5. In Server Manager, click <b>Tools</b> > <b>Computer Management</b>. 
  6. Click <b>Disk Management</b> and click <b>Ok</b> to initialize the new disk. 
  6. Right-click the disk name and click <b>New Simple Volume</b>. Complete wizard to format the new drive. 

<h2><a id="installad"></a>Step 3: Install Windows Server Active Directory</h2>
[Install AD DS](http://technet.microsoft.com/library/jj574166.aspx) by using the same routine that you use on-premises (that is, you can use the UI, an answer file, or Windows PowerShell). You need to provide Administrator credentials to install a new forest. To specify the location for the Active Directory database, logs, and SYSVOL, change the default storage location from the operating system drive to the additional data disk that you attached to the VM. 
<p>After the DC installation finishes, connect to the VM again and log on to the DC. Remember to specify domain credentials.</p>

<h2><a id="dns"></a>Step 4: Set the DNS server for the Azure virtual network</h2>
1. Click <b>Virtual Networks</b>, double-click the virtual network you created and click <b>Configure</b>. 
2. Under <b>DNS servers</b>, type the name and the DIP of the DC and click <b>Save</B>. 
3. Select the VM and click <b>Restart</b> to trigger the VM to configure DNS resolver settings with the IP address of the new DNS server. 


<h2><a id="domainmembers"></a>Step 5: Create VMs for domain members and join the domain</h2>
<p>Create additional VMs to provision domain member computers. You can use the UI or Azure PowerShell. If you use the UI, just follow the same steps that you used to create the first VM. Then join the VMs to the domain just as you would on-premises. If you use Azure PowerShell, you can provision VMs and have them domain-joined when they first start. </p><p>This example will create a domain-joined VM named DC2 that runs Windows Server 2012 R2 Datacenter. After DC2 is provisioned, log on to it as a Domain Admin and promote it to be a replica DC. </p><p>You can run Get-AzureVMImage to get image names. For example, to return a list of images for Windows Server 2012 R2, run Get-AzureVMImage | where-object {$_.ImageFamily -eq "Windows Server 2012 R2 Datacenter"}.</p>
	'

	cls

	Set-AzureSubscription -SubscriptionName "Free Trial" -currentstorageaccountname 'constorageaccount'
	Select-AzureSubscription -SubscriptionName "Free Trial"

	#Deploy a new VM and join it to the domain
	#-------------------------------------------
	#Specify my DC's DNS IP (10.0.0.4)
	$myDNS = New-AzureDNS -Name 'DC1' -IPAddress '10.0.0.4'
	
	# OS Image to Use
	$image = 'a699494373c04fc0bc8f2bb1389d6106__Windows-Server-2012-R2-201404.01-en.us-127GB.vhd'
	$service = 'DC2'
	$AG = 'YourAffinityGroup'
	$vnet = 'YourVirtualNetwork'
	$pwd = 'P@ssw0rd'
	$size = 'Small'

	#VM Configuration
	$vmname = 'DC2'
	$MyVM3 = New-AzureVMConfig -name $vmname -InstanceSize $size -ImageName $image |
    Add-AzureProvisioningConfig -AdminUserName 'PierreSettles' -WindowsDomain -Password $pwd -Domain 'Contoso' -DomainPassword 'P@ssw0rd' -DomainUserName 'PierreSettles' -JoinDomain 'contoso.com'|
    Set-AzureSubnet -SubnetNames 'FrontEnd' 

	New-AzureVM -ServiceName $service -AffinityGroup $AG -VMs $MyVM3 -DnsSettings $myDNS -VNetName $vnet   

If you rerun the script, you need to supply a unique value for $service. You can run Test-AzureName -Service <i>service name</i>, which returns if the name is already taken. 	

## See Also

-  [Guidelines for Deploying Windows Server Active Directory on Azure Virtual Machines](http://msdn.microsoft.com/library/azure/jj156090.aspx)

-  [Configure a Cloud-Only Virtual Network in the Management Portal](http://msdn.microsoft.com/en-us/library/dn631643.aspx)

-  [Configure a Site-to-Site VPN in the Management Portal](http://msdn.microsoft.com/en-us/library/dn133795.aspx)

-  [Install a Replica Active Directory Domain Controller in an Azure virtual network](http://azure.microsoft.com/en-us/documentation/articles/virtual-networks-install-replica-active-directory-domain-controller/)

-  [Windows Azure IT Pro IaaS: (01) Virtual Machine Fundamentals](http://channel9.msdn.com/Series/Windows-Azure-IT-Pro-IaaS/01)

-  [Windows Azure IT Pro IaaS: (05) Creating Virtual Networks and Cross-Premises Connectivity](http://channel9.msdn.com/Series/Windows-Azure-IT-Pro-IaaS/05)

-  [Azure Virtual Network](http://msdn.microsoft.com/en-us/library/windowsazure/jj156007.aspx)

-  [How to install and configure Azure PowerShell](http://www.windowsazure.com/en-us/documentation/articles/install-configure-powershell/)

-  [Azure PowerShell](http://msdn.microsoft.com/en-us/library/windowsazure/jj156055.aspx)

-  [Azure Management Cmdlets](http://msdn.microsoft.com/en-us/library/windowsazure/jj152841)

-  [Set Azure VM Static IP Address](http://windowsitpro.com/windows-azure/set-azure-vm-static-ip-address)

-  [How to assign Static IP to Azure VM](http://www.bhargavs.com/index.php/2014/03/13/how-to-assign-static-ip-to-azure-vm/)

-  [Install a New Active Directory Forest](http://technet.microsoft.com/library/jj574166.aspx)

-  [Introduction to Active Directory Domain Services (AD DS) Virtualization (Level 100)](http://technet.microsoft.com/en-us/library/hh831734.aspx)

-  [Test Lab Guide: Windows Server 2012 R2 Base Configuration in Azure](http://www.microsoft.com/en-us/download/details.aspx?id=41684)

