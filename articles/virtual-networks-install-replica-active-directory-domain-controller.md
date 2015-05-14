<properties 
	pageTitle="Install a replica domain controller in Azure" 
	description="A tutorial that explains how to install a domain controller from an on-premises Active Directory forest on an Azure virtual machine." 
	services="virtual-network" 
	documentationCenter="" 
	authors="Justinha" 
	manager="TerryLan" 
	editor="LisaToft"
	tags="azure-classic-portal"/>

<tags 
	ms.service="virtual-network" 
	ms.workload="infrastructure-services" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/27/2015" 
	ms.author="Justinha"/>


# Install a replica Active Directory domain controller in an Azure virtual network

This topic shows how to install additional domain controllers (also known as replica DCs) for an on-premises Active Directory domain on Azure virtual machines (VMs) in an Azure virtual network. 

You might also be interested in these related topics:

- You can optionally install a new Active Directory forest on an Azure virtual network. For those steps, see [Install a new Active Directory forest on an Azure virtual network](active-directory-new-forest-virtual-machine.md).
-  For conceptual guidance about installing Active Directory Domain Services (AD DS) on an Azure virtual network, see [Guidelines for Deploying Windows Server Active Directory on Azure Virtual Machines](https://msdn.microsoft.com/library/azure/jj156090.aspx).


## Scenario Diagram

In this scenario, external users need to access applications that run on domain-joined servers. The VMs that run the application servers and the replica DCs are installed in an Azure virtual network. The virtual network can be connected to the on-premises network by a [site-to-site VPN](https://msdn.microsoft.com/library/azure/dn133795.aspx) connection, as shown in the following diagram, or you can use [ExpressRoute](../../services/expressroute/) for a faster connection. 

The application servers and the DCs are deployed within separate [cloud services](cloud-services-what-is.md) to distribute compute processing and within [availability sets](virtual-machines-manage-availability.md) for improved fault tolerance. 
The DCs replicate with each other and with on-premises DCs by using Active Directory replication. No synchronization tools are needed.

![][1]

## Create an Active Directory site for the Azure virtual network

It’s a good idea to create a site in Active Directory that represents the network region corresponding to the virtual network. That helps optimize authentication, replication, and other DC location operations. The following steps explain how to create a site, and for more background, see [Adding a New Site](https://technet.microsoft.com/library/cc781496.aspx).

1. Open Active Directory Sites and Services: **Server Manager** > **Tools** > **Active Directory Sites and Services**.
2. Create a site to represent the region where you created an Azure virtual network: click **Sites** > **Action** > **New site** > type the name of the new site, such as Azure US West > select a site link > **OK**.
3. Create a subnet and associate with the new site: double-click **Sites** > right-click **Subnets** > **New subnet** > type the IP address range of the virtual network (such as 10.1.0.0/16 in the scenario diagram) > select the new Azure site > **OK**.

## Create an Azure virtual network

1. In the Azure classic portal, click **New** > **Network Services** > **Virtual Network** > **Custom Create** and use the following values to complete the wizard.

    On this wizard page…  | Specify these values
	------------- | -------------
	**Virtual Network Details**  | <p>Name: Type a name for the virtual network, such as WestUSVNet.</p><p>Region: Choose the closest region.</p>
	**DNS and VPN connectivity**  | <p>DNS Servers: Specify the name and IP address of one or more on-premises DNS servers.</p><p>Connectivity: Select **Configure a site-to-site VPN**.</p><p>Local network: Specify a new local network.</p><p>If you are using ExpressRoute instead of a VPN, see [Configure an ExpressRoute Connection through an Exchange Provider](https://msdn.microsoft.com/library/azure/dn606306.aspx).</p>
	**Site-to-site connectivity**  | <p>Name: Type a name for the on-premises network.</p><p>VPN Device IP address: Specify the public IP address of the device that will connect to the virtual network. The VPN device cannot be located behind a NAT.</p><p>Address: Specify the address ranges for your on-premises network (such as 192.168.0.0/16 in the scenario diagram).</p>
	**Virtual network address spaces**  | <p>Address Space: Specify the IP address range for VMs that you want to run in the Azure virtual network (such as 10.1.0.0/16 in the scenario diagram). This address range cannot overlap with the address ranges of the on-premises network.</p><p>Subnets: Specify a name and address for a subnet for the application servers (such as Frontend, 10.1.1.0/24) and for the DCs (such as Backend, 10.1.2.0/24).</p><p>Click **add gateway subnet**.</p>

2. Next, you'll configure the virtual network gateway to create a secure site-to-site VPN connection. See [Configure a Virtual Network Gateway](https://msdn.microsoft.com/library/azure/jj156210.aspx) for the instructions.
3. Create the site-to-site VPN connection between the new virtual network and an on-premises VPN device. See [Configure a Virtual Network Gateway](https://msdn.microsoft.com/library/azure/jj156210.aspx) for the instructions.



## Create Azure VMs for the DC roles

Repeat the following steps to create VMs to host the DC role as needed. You should deploy at least two virtual DCs to provide fault tolerance and redundancy. If the Azure virtual network includes at least two DCs that are similarly configured (that is, they are both GCs, run DNS server, and neither holds any FSMO role, and so on) then place the VMs that run those DCs in an availability set for improved fault tolerance.
To create the VMs by using Windows PowerShell instead of the UI, see [Use Azure PowerShell to create and preconfigure Windows-based Virtual Machines](virtual-machines-ps-create-preconfigure-windows-vms.md).

1. In the Azure classic portal, click **New** > **Compute** > **Virtual Machine** > **From Gallery**. Use the following values to complete the wizard. Accept the default value for a setting unless another value is suggested or required.

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

## Install AD DS on Azure VMs

Sign in to a VM and verify that you have connectivity across the site-to-site VPN or ExpressRoute connection to resources on your on-premises network. Then install AD DS on the Azure VMs. You can use same process that you use to install an additional DC on your on-premises network (UI, Windows PowerShell, or an answer file). As you install AD DS, make sure you specify the new volume for the location of the AD database, logs and SYSVOL. If you need a refresher on AD DS installation, see  [Install Active Directory Domain Services (Level 100)](https://technet.microsoft.com/library/hh472162.aspx) or [Install a Replica Windows Server 2012 Domain Controller in an Existing Domain (Level 200)](https://technet.microsoft.com/library/jj574134.aspx).

## Reconfigure DNS server for the virtual network

1. In the Azure classic portal, click the name of the virtual network, and then click the **Configure** tab to [reconfigure the DNS server IP addresses for your virtual network](https://msdn.microsoft.com/library/azure/dn275925.aspx) to use the static IP addresses assigned to the replica DCs instead of the IP addresses of an on-premises DNS servers.
 
2. To ensure that all the replica DC VMs on the virtual network are configured with to use DNS servers on the virtual network, click **Virtual Machines**, click the status column for each VM, and then click **Restart**. Wait until the VM shows **Running** state before you try to sign into it. 

## Create VMs for application servers

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

## Additional Resources

-  [Guidelines for Deploying Windows Server Active Directory on Azure Virtual Machines](https://msdn.microsoft.com/library/azure/jj156090.aspx)
-  [How to upload existing on-premises Hyper-V domain controllers to Azure by using Azure PowerShell](http://support.microsoft.com/kb/2904015)
-  [Install a new Active Directory forest on an Azure virtual network](active-directory-new-forest-virtual-machine.md)
-  [Azure Virtual Network](https://msdn.microsoft.com/library/azure/jj156007.aspx)
-  [Microsoft Azure IT Pro IaaS: (01) Virtual Machine Fundamentals](http://channel9.msdn.com/Series/Windows-Azure-IT-Pro-IaaS/01)
-  [Microsoft Azure IT Pro IaaS: (05) Creating Virtual Networks and Cross-Premises Connectivity](http://channel9.msdn.com/Series/Windows-Azure-IT-Pro-IaaS/05)
-  [Azure PowerShell](https://msdn.microsoft.com/library/azure/jj156055.aspx)
-  [Azure Management Cmdlets](https://msdn.microsoft.com/library/azure/jj152841)

<!--Image references-->
[1]: ./media/virtual-networks-install-replica-active-directory-domain-controller/ReplicaDCsOnAzureVNet.png
