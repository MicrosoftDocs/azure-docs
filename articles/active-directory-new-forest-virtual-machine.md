<properties 
	pageTitle="Install an Active Directory forest on an Azure virtual network" 
	description="A tutorial that explains how to create a new Active Directory forest on a virtual machine (VM) on an Azure Virtual Network." 
	services="active-directory, virtual-network" 
	documentationCenter="" 
	authors="Justinha" 
	manager="TerryLan" 
	editor="LisaToft"
	tags="azure-classic-portal"/>

<tags 
	ms.service="active-directory" 
	ms.devlang="na" 
	ms.topic="article" 
    ms.tgt_pltfrm="na" 
    ms.workload="identity" 
	ms.date="04/27/2015" 
	ms.author="Justinha"/>


# Install a new Active Directory forest on an Azure virtual network

This topic shows how to create a new Windows Server Active Directory environment on an Azure virtual network on a virtual machine (VM) on an [Azure virtual network](https://msdn.microsoft.com/library/azure/jj156007.aspx). In this case, the Azure virtual network is not connected to an on-premises network. 

You might also be interested in these related topics:

- For a video that shows these steps, see [How to install a new Active Directory forest on an Azure virtual network](http://channel9.msdn.com/Series/Microsoft-Azure-Tutorials/How-to-install-a-new-Active-Directory-forest-on-an-Azure-virtual-network)
- You can optionally [configure a site-to-site VPN](https://msdn.microsoft.com/library/azure/dn133795.aspx) and then either install a new forest or extend an on-premises forest to an Azure virtual network. For those steps, see [Install a Replica Active Directory Domain Controller in an Azure Virtual Network](virtual-networks-install-replica-active-directory-domain-controller.md).
-  For conceptual guidance about installing Active Directory Domain Services (AD DS) on an Azure virtual network, see [Guidelines for Deploying Windows Server Active Directory on Azure Virtual Machines](https://msdn.microsoft.com/library/azure/jj156090.aspx).

## Scenario Diagram

In this scenario, external users need to access applications that run on domain-joined servers. The VMs that run the application servers and the VMs that run domain controllers are installed installed in their own cloud service in an Azure virtual network. They are also included within an availability set for improved fault tolerance.

![][1]

## How does this differ from on-premises?

There is not much difference between installing a domain controller on Azure versus on-premises. The main differences are listed in the following table. 

To configure...  | On-premises  | Azure virtual network	
------------- | -------------  | ------------
**IP address for the domain controller**  | Assign static IP address on the network adapter properties   | Run the Set-AzureStaticVNetIP cmdlet to assign a static IP address
**DNS client resolver**  | Set Preferred and Alternate DNS server address on the network adapter properties of domain members   | Set DNS server address on the the virtual network properties
**Active Directory database storage**  | Optionally change the default storage location from C:\  | You need to change default storage location from C:\



## Create an Azure virtual network

1. Sign in to the Azure classic portal.
2. Create a virtual network. Click **Networks** > **Create a virtual network**. Use the values in the following table to complete the wizard. 

	On this wizard page…  | Specify these values
	------------- | -------------
	**Virtual Network Details**  | <p>Name: Enter a name for your virtual network</p><p>Region: Choose the closest region</p>
	**DNS and VPN**  | <p>Leave DNS server blank</p><p>Don't select either VPN option</p>
	**Virtual network address spaces**  | <p>Subnet name: Enter a name for your subnet</p><p>Starting IP: <b>10.0.0.0</b></p><p>CIDR: <b>/24 (256)</b></p>



## Create VMs to run the domain controller and DNS server roles
 
Repeat the following steps to create VMs to host the DC role as needed. You should deploy at least two virtual DCs to provide fault tolerance and redundancy. If the Azure virtual network includes at least two DCs that are similarly configured (that is, they are both GCs, run DNS server, and neither holds any FSMO role, and so on) then place the VMs that run those DCs in an availability set for improved fault tolerance.

To create the VMs by using Windows PowerShell instead of the UI, see [Use Azure PowerShell to create and preconfigure Windows-based Virtual Machines](virtual-machines-ps-create-preconfigure-windows-vms.md).

1. In the classic portal, click **New** > **Compute** > **Virtual Machine** > **From Gallery**. Use the following values to complete the wizard. Accept the default value for a setting unless another value is suggested or required.

    On this wizard page…  | Specify these values
	------------- | -------------
	**Choose an Image**  | Windows Server 2012 R2 Datacenter
	**Virtual Machine Configuration**  | <p>Virtual Machine Name: Type a single label name (such as AzureDC1).</p><p>New User Name: Type the name of a user. This user will be a member of the local Administrators group on the VM. You will need this name to sign in to the VM for the first time. The built-in account named Administrator will not work.</p><p>New Password/Confirm: Type a password</p>
	**Virtual Machine Configuration**  | <p>Cloud Service: Choose <b>Create a new cloud service</b> for the first VM and select that same cloud service name when you create more VMs that will host the DC role.</p><p>Cloud Service DNS Name: Specify a globally unique name</p><p>Region/Affinity Group/Virtual Network: Specify the virtual network name (such as WestUSVNet).</p><p>Storage Account: Choose <b>Use an automatically generated storage account</b> for the first VM and then select that same storage account name when you create more VMs that will host the DC role.</p><p>Availability Set: Choose <b>Create an availability set</b>.</p><p>Availability set name: Type a name for the availability set when you create the first VM and then select that same name when you create more VMs.</p>
	**Virtual Machine Configuration**  | <p>Select <b>Install the VM Agent</b> and any other extensions you need.</p>
2. Attach a disk to each VM that will run the DC server role. The additional disk is needed to store the AD database, logs, and SYSVOL. Specify a size for the disk (such as 10 GB) and leave the **Host Cache Preference** set to **None**. For the steps, see [How to Attach a Data Disk to a Windows Virtual Machine](storage-windows-attach-disk.md).
3. After you first sign in to the VM, open **Server Manager** > **File and Storage Services** to create a volume on this disk using NTFS.
4. Reserve a static IP address for VMs that will run the DC role. To reserve a static IP address, download the Microsoft Web Platform Installer and [install Azure PowerShell](powershell-install-configure.md) and run the Set-AzureStaticVNetIP cmdlet. For example:

    'Get-AzureVM -ServiceName AzureDC1 -Name AzureDC1 | Set-AzureStaticVNetIP -IPAddress 10.0.0.4 | Update-AzureVM

For more information about setting a static IP address, see [Configure a Static Internal IP Address for a VM](https://msdn.microsoft.com/library/azure/dn630228.aspx).

## Install Windows Server Active Directory

Use the same routine to [install AD DS](https://technet.microsoft.com/library/jj574166.aspx) that you use on-premises (that is, you can use the UI, an answer file, or Windows PowerShell). You need to provide Administrator credentials to install a new forest. To specify the location for the Active Directory database, logs, and SYSVOL, change the default storage location from the operating system drive to the additional data disk that you attached to the VM. 

After the DC installation finishes, connect to the VM again and log on to the DC. Remember to specify domain credentials.

## Reset the DNS server for the Azure virtual network

1. Reset the DNS forwarder setting on the new DC/DNS server. 
  1. In Server Manager, click **Tools** > **DNS**. 
  2. In **DNS Manager**, right-click the name of the DNS server and click **Properties**. 
  3. On the **Forwarders** tab, click the IP address of the forwarder and click **Edit**.  Select the IP address and click **Delete**. 
  4. Click **OK** to close the editor and **Ok** again to close the DNS server properties. 
2. Update the DNS server setting for the virtual network. 
  1. Click **Virtual Networks** > double-click the virtual network you created > **Configure** > **DNS servers**, type the name and the DIP of one of the VMs that runs the DC/DNS server role and click **Save**. 
  2. Select the VM and click **Restart** to trigger the VM to configure DNS resolver settings with the IP address of the new DNS server. 


## Create VMs for domain members

1. Repeat the following steps to create VMs to run as application servers. Accept the default value for a setting unless another value is suggested or required.

	On this wizard page…  | Specify these values
	------------- | -------------
	**Choose an Image**  | Windows Server 2012 R2 Datacenter
	**Virtual Machine Configuration**  | <p>Virtual Machine Name: Type a single label name (such as  AppServer1).</p><p>New User Name: Type the name of a user. This user will be a member of the local Administrators group on the VM. You will need this name to sign in to the VM for the first time. The built-in account named Administrator will not work.</p><p>New Password/Confirm: Type a password</p>
	**Virtual Machine Configuration**  | <p>Cloud Service: Choose **Create a new cloud service** for the first VM and select that same cloud service name when you create more VMs that will host the application.</p><p>Cloud Service DNS Name: Specify a globally unique name</p><p>Region/Affinity Group/Virtual Network: Specify the virtual network name (such as WestUSVNet).</p><p>Storage Account: Choose **Use an automatically generated storage account** for the first VM and then select that same storage account name when you create more VMs that will host the application.</p><p>Availability Set: Choose **Create an availability set**.</p><p>Availability set name: Type a name for the availability set when you create the first VM and then select that same name when you create more VMs.</p>
	**Virtual Machine Configuration**  | <p>Select <b>Install the VM Agent</b> and any other extensions you need.</p>
2. After each VM is provisioned, sign in and join it to the domain. In **Server Manager**, click **Local Server** > **WORKGROUP** > **Change…** and then select **Domain** and type the name of your on-premises domain. Provide credentials of a domain user, and then restart the VM to complete the domain join.

To create the VMs by using Windows PowerShell instead of the UI, see [Use Azure PowerShell to create and preconfigure Windows-based Virtual Machines](virtual-machines-ps-create-preconfigure-windows-vms.md).

For more information about using Windows PowerShell, see [Get Started with Azure Cmdlets](https://msdn.microsoft.com/library/azure/jj554332.aspx) and [Azure Cmdlet Reference](https://msdn.microsoft.com/library/azure/jj554330.aspx).


## See Also

-  [How to install a new Active Directory forest on an Azure virtual network](http://channel9.msdn.com/Series/Microsoft-Azure-Tutorials/How-to-install-a-new-Active-Directory-forest-on-an-Azure-virtual-network)
-  [Guidelines for Deploying Windows Server Active Directory on Azure Virtual Machines](https://msdn.microsoft.com/library/azure/jj156090.aspx)
-  [Configure a Cloud-Only Virtual Network](https://msdn.microsoft.com/library/dn631643.aspx)
-  [Configure a Site-to-Site VPN](https://msdn.microsoft.com/library/dn133795.aspx)
-  [Install a Replica Active Directory Domain Controller in an Azure virtual network](virtual-networks-install-replica-active-directory-domain-controller.md)
-  [Microsoft Azure IT Pro IaaS: (01) Virtual Machine Fundamentals](http://channel9.msdn.com/Series/Windows-Azure-IT-Pro-IaaS/01)
-  [Microsoft Azure IT Pro IaaS: (05) Creating Virtual Networks and Cross-Premises Connectivity](http://channel9.msdn.com/Series/Windows-Azure-IT-Pro-IaaS/05)
-  [Virtual Network Overview](https://msdn.microsoft.com/library/azure/jj156007.aspx)
-  [How to install and configure Azure PowerShell](powershell-install-configure.md)
-  [Azure PowerShell](https://msdn.microsoft.com/library/azure/jj156055.aspx)
-  [Azure Cmdlet Reference](https://msdn.microsoft.com/library/azure/jj554330.aspx)
-  [Set Azure VM Static IP Address](http://windowsitpro.com/windows-azure/set-azure-vm-static-ip-address)
-  [How to assign Static IP to Azure VM](http://www.bhargavs.com/index.php/2014/03/13/how-to-assign-static-ip-to-azure-vm/)
-  [Install a New Active Directory Forest](https://technet.microsoft.com/library/jj574166.aspx)
-  [Introduction to Active Directory Domain Services (AD DS) Virtualization (Level 100)](https://technet.microsoft.com/library/hh831734.aspx)

<!--Image references-->
[1]: ./media/active-directory-new-forest-virtual-machine/AD_Forest.png

