<properties 
	pageTitle="Install a replica domain controller in Azure" 
	description="A tutorial that explains how to install a domain controller from an on-premises Active Directory forest on an Azure virtual machine." 
	services="virtual-network" 
	documentationCenter="" 
	authors="Justinha" 
	writer="Justinha" 
	manager="TerryLan" 
	editor="LisaToft"/>

<tags 
	ms.service="virtual-network" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="12/12/2014" 
	ms.author="Justinha"/>


#Install a Replica Active Directory Domain Controller in Azure Virtual Networks

This topic shows how to install additional domain controllers (also known as replica DCs) for an on-premises Active Directory domain on Azure virtual machines (VMs) in an Azure virtual network. 

You might also be interested in these related topics:

- You can optionally install a new Active Directory forest on an Azure virtual network. For those steps, see [Install a new Active Directory forest on an Azure virtual network](http://azure.microsoft.com/documentation/articles/active-directory-new-forest-virtual-machine/).
-  For conceptual guidance about installing Active Directory Domain Services (AD DS) on an Azure virtual network, see [Guidelines for Deploying Windows Server Active Directory on Azure Virtual Machines](http://msdn.microsoft.com/library/windowsazure/jj156090.aspx).
-  For step-by-step guidance to create a test lab environment on Azure that includes AD DS, see [Test Lab Guide: Base Configuration in Azure](http://www.microsoft.com/en-us/download/details.aspx?id=41684).


##Table of Contents##

* [Scenario Diagram](#diagram)
* [Step 1: Create an Active Directory site for the Azure virtual network](#createadsite)
* [Step 2: Create an Azure virtual network](#createvnet)
* [Step 3: Create Azure VMs for the DC roles](#createdcvms)
* [Step 4: Install AD DS on Azure VMs](#installadds)
* [Step 5: Create VMs for application servers](#createappvms)
* [Additional Resources](#resources)

<h2><a id="diagram"></a>Scenario Diagram</h2>

In this scenario, external users need to access applications that run on domain-joined servers. The VMs that run the application servers and the replica DCs are installed in an Azure virtual network. The virtual network can be connected to the on-premises network by a [site-to-site VPN](http://msdn.microsoft.com/library/azure/dn133795.aspx) connection, as shown in the following diagram, or you can use [ExpressRoute](http://azure.microsoft.com/services/expressroute/) for a faster connection. 

The application servers and the DCs are deployed within separate [cloud services](http://azure.microsoft.com/documentation/articles/cloud-services-what-is/) to distribute compute processing and within [availability sets](http://azure.microsoft.com/documentation/articles/virtual-machines-manage-availability/) for improved fault tolerance. 
The DCs replicate with each other and with on-premises DCs by using Active Directory replication. No synchronization tools are needed.

![][1]

<h2><a id="createadsite"></a>Step 1: Create an Active Directory site for the Azure virtual network</h2>

It’s a good idea to create a site in Active Directory that represents the network region corresponding to the virtual network. That helps optimize authentication, replication, and other DC location operations. The following steps explain how to create a site, and for more background, see [Adding a New Site](http://technet.microsoft.com/library/cc781496.aspx).

1. Open Active Directory Sites and Services: **Server Manager** > **Tools** > **Active Directory Sites and Services**.
2. Create a site to represent the region where you created an Azure virtual network: click **Sites** > **Action** > **New site** > type the name of the new site, such as Azure US West > select a site link > **OK**.
3. Create a subnet and associate with the new site: double-click **Sites** > right-click **Subnets** > **New subnet** > type the IP address range of the virtual network (such as 10.1.0.0/16 in the scenario diagram) > select the new Azure site > **OK**.

<h2><a id="createvnet"></a>Step 2: Create an Azure virtual network</h2>

<ol><li><p>In the Azure Management Portal, click <b>New</b> > <b>Network Services</b> > <b>Virtual Network</b> > <b>Custom Create</b> and use the following values to complete the wizard.</p>

<table style="width:100%">
<tr>
<td>On this wizard page</td>
<td>Specify these values</td>
</tr>
<tr>
<td><b>Virtual Network Details</b></td>
<td><ul><li>Name: Type a name for the virtual network, such as WestUSVNet.</li><li>Region: This is the Azure location where the virtual network will be located, such as West US. This location can’t be changed after the virtual network is created.</li></ul>
</td>
</tr>
<tr>
<td><b>DNS servers and VPN connectivity</b></td>
<td><ul><li>DNS Servers: Specify the name and IP address of one or more on-premises DNS servers.</li><li>Connectivity: Select <b>Configure a site-to-site VPN</b>.</li><li>Local network: Specify a new local network.</li></ul>If you are using ExpressRoute instead of a VPN, see <a href="http://msdn.microsoft.com/library/azure/dn606306.aspx">Configure an ExpressRoute Connection through an Exchange Provider</a>.</td>
</tr>
<tr>
<td><b>Site-to-site connectivity</b></td>
<td><ul><li>Name: Type a name for the on-premises network.</li><li>VPN Device IP address: Specify the public IP address of the device that will connect to the virtual network. The VPN device cannot be located behind a NAT.</li><li>Address: Specify the address ranges for your on-premises network (such as 192.168.0.0/16 in the scenario diagram).</li></ul></td>
</tr>
<tr>
<td><b>Virtual network address spaces</b></td>
<td><ul><li>Address Space: Specify the IP address range for VMs that you want to run in the Azure virtual network (such as 10.1.0.0/16 in the scenario diagram). This address range cannot overlap with the address ranges of the on-premises network.</li><li>Subnets: Specify a name and address for a subnet for the application servers (such as Frontend, 10.1.1.0/24) and for the DCs (such as Backend, 10.1.2.0/24).</li><li>Click <b>add gateway subnet</b>.</li></ul></td>
</tr>
</table>
</li>
<li><p>Next, you'll configure the virtual network gateway to create a secure site-to-site VPN connection. See <a href = "http://msdn.microsoft.com/library/azure/jj156210.aspx">Configure a Virtual Network Gateway in the Management Portal</a> for the instructions.</p>
</li>
<li><p>Create the site-to-site VPN connection between the new virtual network and an on-premises VPN device. See <a href = "http://msdn.microsoft.com/library/azure/jj156210.aspx">Configure a Virtual Network Gateway in the Management Portal</a> for the instructions.</p>
</li>
</ol>

<h2><a id="createdcvms"></a>Step 3: Create Azure VMs for the DC roles</h2>

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
<td><ul><li>Virtual Machine Name: Type a single label name (such as AzureDC2).</li><li>New User Name: Type the name of a user. This user will be a member of the local Administrators group on the VM. You will need this name to sign in to the VM for the first time. The built-in account named Administrator will not work.</li><li>New Password/Confirm: Type a password</li></ul></td>
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
<li><p>In the Azure Management portal, click the name of the virtual network, and then click the <b>Configure</b> tab to <a href = "http://msdn.microsoft.com/library/azure/dn275925.aspx">reconfigure the DNS server IP addresses for your virtual network</a> to use the static IP addresses assigned to the replica DCs instead of the IP addresses of an on-premises DNS servers. </p>
</li>
<li><p>To ensure that all the replica DC VMs on the virtual network are configured with to use DNS servers on the virtual network, click <b>Virtual Machines</b>, click the status column for each VM, and then click <b>Restart</b>. Wait until the VM shows <b>Running</b> state before you try to sign into it. 
</p>
</li>
</ol>

<h2><a id="installadds"></a>Step 4: Install AD DS on Azure VMs</h2>

Sign in to a VM and verify that you have connectivity across the site-to-site VPN or ExpressRoute connection to resources on your on-premises network. Then install AD DS on the Azure VMs. You can use same process that you use to install an additional DC on your on-premises network (UI, Windows PowerShell, or an answer file). As you install AD DS, make sure you specify the new volume for the location of the AD database, logs and SYSVOL. If you need a refresher on AD DS installation, see  [Install Active Directory Domain Services (Level 100)](http://technet.microsoft.com/library/hh472162.aspx) or [Install a Replica Windows Server 2012 Domain Controller in an Existing Domain (Level 200)](http://technet.microsoft.com/library/jj574134.aspx).

<h2><a id="x=createappvms"></a>Step 5: Create VMs for application servers</h2>

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
<td><ul><li>Virtual Machine Name: Type a single label name (such as TreyAppServer1).</li><li>New User Name: Type the name of a user. This user will be a member of the local Administrators group on the VM. You will need this name to sign in to the VM for the first time. The built-in account named Administrator will not work.</li><li>New Password/Confirm:  Type a password</li></ul></td>
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


<h2><a id="resources"></a>Additional Resources</h2>

-  [Guidelines for Deploying Windows Server Active Directory on Azure Virtual Machines](http://msdn.microsoft.com/library/azure/jj156090.aspx)

-  [How to upload existing on-premises Hyper-V domain controllers to Azure by using Azure PowerShell](http://support.microsoft.com/kb/2904015)

-  [Install a new Active Directory forest on an Azure virtual network](http://azure.microsoft.com/documentation/articles/active-directory-new-forest-virtual-machine/)

-  [Azure Virtual Network](http://msdn.microsoft.com/library/windowsazure/jj156007.aspx)

-  [Windows Azure IT Pro IaaS: (01) Virtual Machine Fundamentals](http://channel9.msdn.com/Series/Windows-Azure-IT-Pro-IaaS/01)

-  [Windows Azure IT Pro IaaS: (05) Creating Virtual Networks and Cross-Premises Connectivity](http://channel9.msdn.com/Series/Windows-Azure-IT-Pro-IaaS/05)

-  [Azure PowerShell](http://msdn.microsoft.com/library/windowsazure/jj156055.aspx)

-  [Azure Management Cmdlets](http://msdn.microsoft.com/library/windowsazure/jj152841)

<!--Image references-->
[1]: ./media/virtual-networks-install-replica-active-directory-domain-controller/ReplicaDCsOnAzureVNet.png
