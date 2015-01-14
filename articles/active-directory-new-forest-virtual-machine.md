<properties urlDisplayName="Active Directory forest" pageTitle="Install an Active Directory forest on an Azure virtual network" metaKeywords="" description="A tutorial that explains how to create a new Active Directory forest on a virtual machine (VM) on an Azure Virtual Network." metaCanonical="" services="active-directory, virtual-network" documentationCenter="" title="" authors="Justinha" solutions="" writer="Justinha" manager="TerryLan" editor="LisaToft"/>

<tags ms.service="active-directory" ms.workload="identity" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="12/12/2014" ms.author="Justinha" />




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
**IP address for the domain controller**  | Assign static IP address on the network adapter properties   | Run the Set-AzureStaticVNetIP cmdlet to assign a static IP address
**DNS client resolver**  | Set Preferred and Alternate DNS server address on the network adapter properties of domain members   | Set DNS server address on the the virtual network properties
**Active Directory database storage**  | Optionally change the default storage location from C:\  | You need to change default storage location from C:\



<h2><a id="createvnet"></a>Step 1: Create an Azure virtual network</h2>
1. Sign in to the [Azure Management Portal](https://manage.windowsazure.com).
2. Create a virtual network. Click <b>Networks</b> > <b>Create a virtual network</b>. Use the values in the following table to complete the wizard. 

	On this wizard page…  | Specify these values
	------------- | -------------
	**Virtual Network Details**  | <p>Name: Enter a name for your virtual network</p><p>Region: Choose the closest region</p>
	**DNS and VPN**  | <p>Leave DNS server blank</p><p>Don't select either VPN option</p>
	**Virtual network address spaces**  | <p>Subnet name: Enter a name for your subnet</p><p>Starting IP: <b>10.0.0.0</b></p><p>CIDR: <b>/24 (256)</b></p>



<h2><a id="createvm"></a>Step 2: Create VMs to run the domain controller and DNS server roles</h2>
 
<p>Repeat the following steps to create VMs to host the DC role as needed. You should deploy at least two virtual DCs to provide fault tolerance and redundancy. If the Azure virtual network includes at least two DCs that are similarly configured (that is, they are both GCs, run DNS server, and neither holds any FSMO role, and so on) then place the VMs that run those DCs in an availability set for improved fault tolerance.</p>


<ol><li><p>In the Azure Management portal, click <b>New</b> > <b>Compute</b> > <b>Virtual Machine</b> > <b>From Gallery</b>. Use the following values to complete the wizard. Accept the default value for a setting unless another value is suggested or required.</p>
<table style="width:100%">
<tr>
<td><b>On this wizard page</b></td>
<td><b>Specify these values</b></td>
</tr>
<tr>
<td><b>Choose an Image</b></td>
<td>Windows Server 2012 R2 Datacenter</td>
</tr>
<tr>
<td><b>Virtual Machine Configuration</b></td>
<td><ul><li>Virtual Machine Name: Type a single label name (such as AzureDC1).</li><li>New User Name: Type the name of a user. This user will be a member of the local Administrators group on the VM. You will need this name to sign in to the VM for the first time. The built-in account named Administrator will not work.</li><li>New Password/Confirm: Type a password</li></ul></td>
</tr>
<tr>
<td><b>Virtual machine configuration</b></td>
<td><ul><li>Cloud Service: Choose <b>Create a new cloud service</b> for the first VM and select that same cloud service name when you create more VMs that will host the DC role.</li><li>Cloud Service DNS Name: Specify a globally unique name</li><li>Region/Affinity Group/Virtual Network: Specify the virtual network name (such as WestUSVNet).</li><li>Storage Account: Choose <b>Use an automatically generated storage account</b> for the first VM and then select that same storage account name when you create more VMs that will host the DC role.</li><li>Availability Set: Choose <b>Create an availability set</b>.</li><li>Availability set name: Type a name for the availability set when you create the first VM and then select that same name when you create more VMs.</li></ul></td>
</tr>
<tr>
<td><b>Virtual machine configuration</b></td>
<td>Select <b>Install the VM Agent</b> and any other extensions you need.</td>
</tr>
</table>
</li>
<li><p>Attach a disk to each VM that will run the DC server role. The additional disk is needed to store the AD database, logs, and SYSVOL. Specify a size for the disk (such as 10 GB) and leave the <b>Host Cache Preference</b> set to <b>None</b>. After you first sign in to the VM, open <b>Server Manager</b> > <b>File and Storage Services</b> to create a volume on this disk using NTFS.</p></li>
<li><p>Reserve a static IP address for VMs that will run the DC role. To reserve a static IP address, download the Microsoft Web Platform Installer and <a href = "http://azure.microsoft.com/documentation/articles/install-configure-powershell/">install Azure PowerShell</a> and run the <a href = "http://msdn.microsoft.com/library/azure/dn630228.aspx">Set-AzureStaticVNetIP</a> cmdlet.</p></li>

<h2><a id="installad"></a>Step 3: Install Windows Server Active Directory</h2>
[Install AD DS](http://technet.microsoft.com/library/jj574166.aspx) by using the same routine that you use on-premises (that is, you can use the UI, an answer file, or Windows PowerShell). You need to provide Administrator credentials to install a new forest. To specify the location for the Active Directory database, logs, and SYSVOL, change the default storage location from the operating system drive to the additional data disk that you attached to the VM. 
<p>After the DC installation finishes, connect to the VM again and log on to the DC. Remember to specify domain credentials.</p>

<h2><a id="dns"></a>Step 4: Set the DNS server for the Azure virtual network</h2>
1. Click <b>Virtual Networks</b>, double-click the virtual network you created and click <b>Configure</b>. 
2. Under <b>DNS servers</b>, type the name and the DIP of one of the VMs that runs the DC/DNS server role and click <b>Save</B>. 
3. Select the VM and click <b>Restart</b> to trigger the VM to configure DNS resolver settings with the IP address of the new DNS server. 


<h2><a id="domainmembers"></a>Step 5: Create VMs for domain members</h2>
<ol><li><p>Repeat the following steps to create VMs to run as application servers. Accept the default value for a setting unless another value is suggested or required.</p>

<table style="width:100%">
<tr>
<td><b>On this wizard page</b></td>
<td><b>Specify these values</b></td>
</tr>
<tr>
<td><b>Choose an Image</b></td>
<td>Windows Server 2012 R2 Datacenter</td>
</tr>
<tr>
<td><b>Virtual Machine Configuration</b></td>
<td><ul><li>Virtual Machine Name: Type a single label name (such as AppServer1).</li><li>New User Name: Type the name of a user. This user will be a member of the local Administrators group on the VM. You will need this name to sign in to the VM for the first time. The built-in account named Administrator will not work.</li><li>New Password/Confirm:  Type a password</li></ul></td>
</tr>
<tr>
<td><b>Virtual machine configuration</b></td>
<td><ul><li>Cloud Service: Choose Create a new cloud service for the first VM and select that same cloud service name when you create more VMs that will host the application.</li><li>Cloud Service DNS Name: Specify a globally unique name</li><li>Region/Affinity Group/Virtual Network: Specify the virtual network name (such as WestUSVNet).</li><li>Storage Account: Choose <b>Use an automatically generated storage account</b> for the first VM and then select that same storage account name when you create more VMs that will host the DC role.</li><li>Availability Set: Choose <b>Create an availability set</b>.</li><li>Availability set name: Type a name for the availability set when you create the first VM and then select that same name when you create more VMs.</li></ul></td>
</tr>
<tr>
<td><b>Virtual machine configuration</b></td>
<td>Select <b>Install the VM Agent</b> and any other extensions you need.</td>
</tr>
</table>


</li>
<li><p>After each VM is provisioned, sign in and join it to the domain. In <b>Server Manager</b>, click <b>Local Server</b> > <b>WORKGROUP</b> > <b>Change…</b> and then select <b>Domain</b> and type the name of your on-premises domain. Provide credentials of a domain user, and then restart the VM to complete the domain join.
</p>
</li>
</ol>
<p>
As an alternative to using the management portal to provision VMs, you can use Windows PowerShell for Microsoft Azure. Use <a href = "http://msdn.microsoft.com/library/azure/dn495159.aspx">New-AzureVMConfig</a> and <a href = "http://msdn.microsoft.com/library/azure/dn495299.aspx">Add-AzureProvisioningConfig</a> to provision a VM as a domain-joined machine when it first boots and use <a href = "http://msdn.microsoft.com/library/azure/dn495254.aspx">New-AzureVM</a> to create the VM itself. 
</p>

For more information about using Windows PowerShell, see [Getting Started with Azure PowerShell](http://msdn.microsoft.com/en-us/library/windowsazure/jj156055.aspx) and [Azure Management Cmdlets](http://msdn.microsoft.com/en-us/library/windowsazure/jj152841).


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

