<properties linkid="manage-services-networking-active-directory-forest" urlDisplayName="Active Directory forest" pageTitle="Install Active Directory forest in a Windows Azure network" metaKeywords="" description="A tutorial that explains how to create a new Active Directory forest on a virtual machine (VM) on Windows Azure Virtual Network." metaCanonical="" services="active-directory,virtual-network" documentationCenter="" title="Install a new Active Directory forest in Windows Azure" authors="Justinha" solutions="" manager="TerryLan" editor="LisaToft" />




#Install a new Active Directory forest in Windows Azure

This topic shows how to create a new Windows Server Active Directory environment on Windows Azure. The steps cover how to install a new AD DS forest on a virtual machine (VM) on a [Windows Azure virtual network](http://msdn.microsoft.com/en-us/library/windowsazure/jj156007.aspx). In this case, the Windows Azure virtual network is not connected to an on-premises network. 
You can optionally [configure a site-to-site VPN using the Management Portal Wizard](http://msdn.microsoft.com/en-us/library/windowsazure/dn133795.aspx) and then either install a new forest or extend an on-premises forest to Windows Azure Virtual network. For those steps, see [Install a Replica Active Directory Domain Controller in Windows Azure Virtual Networks](http://www.windowsazure.com/en-us/documentation/articles/virtual-networks-install-replica-active-directory-domain-controller/). 
For conceptual guidance about installing Active Directory Domain Services (AD DS) on Windows Azure Virtual Network, see [Guidelines for Deploying Windows Server Active Directory on Windows Azure Virtual Machines](http://msdn.microsoft.com/en-us/library/windowsazure/jj156090.aspx). For step-by-step guidance to create a test lab environment on Windows Azure that includes AD DS, see [Test Lab Guide: Windows Server 2012 R2 Base Configuration in Windows Azure](http://www.microsoft.com/en-us/download/details.aspx?id=41684).

##Table of Contents##

* [How does this differ from on-premises?](#differ)
* [Step 1. Create a Windows Azure virtual network](#createvnet)
* [Step 2: Create a VM to run the domain controller role](#createvm)
* [Step 3: Install Windows Server Active Directory](#installad)
* [Step 4: Set the DNS server for the Windows Azure virtual network](#dns)
* [Step 5: Create VMs for domain members and join the domain](#domainmembers)


<h2><a id="differ"></a>How does this differ from on-premises?</h2>
There is not much difference between installing a domain controller on Windows Azure versus on-premises. The main differences are listed in the following table. 

<table border="1">
	<tr>
	<th>To configure...</th>
	<th>On-premises</th>
	<th>Windows Azure virtual network</th>
	</tr>
	
	<tr>
	<td><b>IP address for the domain controller</b></td>
	<td>Assign static IP address on the network adapter properties</td>
	<td>Obtain IP address via DHCP and run the Set-AzureStaticVNetIP cmdlet to make it static. </td>
	</tr>
	
	<tr>
	<td><b>DNS client resolver</b></td>
	<td>Set Preferred and Alternate DNS server address on the network adapter properties of domain members</td>
	<td>Set DNS server address on the the virtual network properties</td>
	</tr>

	<tr>
	<td><b>Active Directory database storage</b></td>
	<td>Optionally change the default storage location from C:\</td>
	<td>You need to change default storage location from C:\ </td>
	</tr>
	</table>

<h2><a id="createvnet"></a>Step 1: Create a Windows Azure virtual network</h2>
<ol>
<li>Sign in to the Windows Azure Management Portal at https://manage.windowsazure.com/. 
</li>
<li>Create a virtual network. Click <b>Networks</b> > <b>Create a virtual network</b>. Use the values in the following table to complete the wizard.
<table border="1">
	<tr>
	<th>On this wizard page…</th>
	<th>Specify these values</th>
	</tr>
	
	<tr>
	<td><b>Virtual Network Details</b></td>
	<td><p>Name: Enter a name for your virtual network</p><p>Region: Choose the closest region</p><p>Affinity Group: <b>Create a new affinity group</b></p><p>Affinity Group Name: Enter a name for your affinity group</p></td>
	</tr>
	
	<tr>
	<td><b>DNS and VPN</b></td>
	<td><p>Leave DNS server blank</p><p>Don't select either VPN option</p></td>
	
	</tr>

	<tr>
	<td><b>Virtual network address spaces</b></td>
	<td><p>Subnet name: Enter a name for your subnet</p><p>Starting IP: <b>10.0.0.0</b></p><p>CIDR: <b>/24 (256)</b></p></td>
	
	</tr>
	</table>

</li>
</ol>


<h2><a id="createvm"></a> Step 2: Create a VM to run the domain controller role</h2>
Create a VM to run the domain controller and DNS server roles. 

<ol>
<li>Click <b>Compute</b> > <b>Virtual Machine</b> > <b>From Gallery</b>. Use the values in the following table to complete the wizard.
<table border="1">
	<tr>
	<th>On this wizard page…</th>
	<th>Specify these values</th>
	</tr>
	
	<tr>
	<td><b>Operating system</b></td>
	<td>Select <b>Windows Server 2012 R2 Datacenter</b></td>
	</tr>
	
	<tr>
	<td><b>Virtual machine configuration</b></td>
	<td><p>Release date: Today's date</p><p>Machine name: Specify a unique value</p><p>Size: Select any size</p><p>User name: Enter a name. This user account will be a member of the built-in Administrators group. </p><p>Password: Must be at least 8 characters, and include 3 of the following types of characters:</p><ul><li>an uppercase letter</li><li>a lowercase letter</li><li>a number</li><li>a special character</li></ul></td>
	
	</tr>

	<tr>
	<td><b>Cloud service</b></td>
	<td><p>Cloud service: <b>Create a new cloud service</b></p><p>Cloud service name: Accept default value</p><p>Region/AffinityGroup/VirtualNetwork: Select the virtual network you created</p><p>Virtual network subnet: Select the subnet you created. </p><p>Storage account: <b>Use an automatically generated storage account</b></p><p>Availability set: <b>None</b></p></td>
	
	<tr>
	<td><b>Endpoints</b></td>
	<td><p>Accept default values</p></td>

	</tr>
	</table>
</li>
<li><p>The dynamic IP address that the VM is assigned by default is valid for the duration of the cloud service. But it will change if the VM is shut down. You can assign a static IP address by running the Set-AzureStaticVNetIP Windows Azure PowerShell cmdlet so the IP address will persist if you ever do need to shut down the VM. </p>



</li>
<li>Attach an additional disk to the VM to store the Active Directory database, logs, and SYSVOL. Click the <b>VM</b> > <b>Attach</b> > <b>Attach empty disk</b>. Specify a size (for example, 10 GB) and accept all other default values.
</li>
<li><p>Log on to the VM and format the additional disk. Click <b>Connect</b> to log on to the VM, click <b>Open</b> to create an RDP session, and click <b>Connect</b> again.</p>
<p>Change the credentials to the new user name and password you specified.</p>
<p>In Server Manager, click <b>Tools</b> > <b>Computer Management</b>. Click <b>Disk Management</b> and click <b>Ok</b> to initialize the new disk. Right-click the disk name and click <b>New Simple Volume</b>. Complete wizard to format the new drive. </p>
</li>
</ol>


<h2><a id="installad"></a>Step 3: Install Windows Server Active Directory</h2>
Install AD DS by using the same routine that you use on-premises (that is, you can use the UI, an answer file, or Windows PowerShell). You need to provide Administrator credentials to install a new forest. To specify the location for the Active Directory database, logs, and SYSVOL, change the default storage location from the operating system drive to the additional data disk that you attached to the VM. 
<p>After the DC installation finishes, connect to the VM again and log on to the DC. Remember to specify domain credentials.</p>

<h2><a id="dns"></a>Step 4: Set the DNS server for the Windows Azure virtual network</h2>
To configure DNS server for the network, click <b>Virtual Networks</b>, double-click the virtual network you created and click <b>Configure</b>. Under <b>DNS servers</b>, type the name and the DIP of the DC and click <b>Save</B>. Then select the VM and click <b>Restart</b> to trigger the VM to configure DNS resolver settings with the IP address of the new DNS server. 

<h2><a id="domainmembers"></a>Step 5: Create VMs for domain members and join the domain</h2>
Provision domain member computers. You can create additional VMs either by using the UI or by using Windows Azure PowerShell. If you use the UI, just follow the same steps that you used to create the first VM. Then join the VMs to the domain just as you would on-premises. If you use Windows Azure PowerShell, you can provision VMs and have them domain-joined when they first start, as in the following example.
	'

	cls

	Set-AzureSubscription -SubscriptionName "Free Trial" -currentstorageaccountname 'constorageaccount'
	Select-AzureSubscription -SubscriptionName "Free Trial"

	#Deploy a new VM and join it to the domain
	#-------------------------------------------
	#Specify my DC's DNS IP (10.0.0.4)
	$myDNS = New-AzureDNS -Name 'DC-1' -IPAddress '10.0.0.4'
	
	# OS Image to Use
	$image = 'a699494373c04fc0bc8f2bb1389d6106__Win2K8R2SP1-Datacenter-201310.01-en.us-127GB.vhd'
	$service = 'ConApp1'
	$AG = 'YourAffinityGroup'
	$vnet = 'YourVirtualNetwork'
	$pwd = 'P@ssw0rd'
	$size = 'Small'

	#VM Configuration
	$vmname = 'ConApp1'
	$MyVM3 = New-AzureVMConfig -name $vmname -InstanceSize $size -ImageName $image |
    Add-AzureProvisioningConfig -AdminUserName 'PierreSettles' -WindowsDomain -Password $pwd -Domain 'Contoso' -DomainPassword 'P@ssw0rd' -DomainUserName 'PierreSettles' -JoinDomain 'contoso.com'|
    Set-AzureSubnet -SubnetNames 'FrontEnd' 

	New-AzureVM -ServiceName $service -AffinityGroup $AG -VMs $MyVM3 -DnsSettings $myDNS -VNetName $vnet   

If you rerun the script, you need to supply a unique value for $service. You can run Test-AzureName -Service <i>service name</i>, which returns if the name is already taken. 	

## See Also

-  [Guidelines for Deploying Windows Server Active Directory on Windows Azure Virtual Machines](http://msdn.microsoft.com/en-us/library/windowsazure/jj156090.aspx)

-  [Create a virtual network in Windows Azure](http://www.windowsazure.com/en-us/manage/services/networking/create-a-virtual-network/)

-  [Create a Virtual Network for Site-to-Site Cross-Premises Connectivity](http://www.windowsazure.com/en-us/documentation/articles/virtual-networks-create-site-to-site-cross-premises-connectivity/)

-  [Install a Replica Active Directory Domain Controller in Windows Azure Virtual Networks](http://www.windowsazure.com/en-us/documentation/articles/virtual-networks-install-replica-active-directory-domain-controller/)

-  [Windows Azure Virtual Network](http://msdn.microsoft.com/en-us/library/windowsazure/jj156007.aspx)

-  [How to install and configure Windows Azure PowerShell](http://www.windowsazure.com/en-us/documentation/articles/install-configure-powershell/)

-  [Windows Azure PowerShell](http://msdn.microsoft.com/en-us/library/windowsazure/jj156055.aspx)

-  [Windows Azure Management Cmdlets](http://msdn.microsoft.com/en-us/library/windowsazure/jj152841)

-  [Set Azure VM Static IP Address](http://windowsitpro.com/windows-azure/set-azure-vm-static-ip-address)

-  [Install a New Active Directory Forest](http://technet.microsoft.com/library/jj574166.aspx)

-  [Introduction to Active Directory Domain Services (AD DS) Virtualization (Level 100)](http://technet.microsoft.com/en-us/library/hh831734.aspx)

-  [Test Lab Guide: Windows Server 2012 R2 Base Configuration in Windows Azure](http://www.microsoft.com/en-us/download/details.aspx?id=41684)

