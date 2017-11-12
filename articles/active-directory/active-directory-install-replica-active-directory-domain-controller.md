---
title: Install replica domain controllers for on-premises Active Directory domain on Azure virtual machines  | Microsoft Docs
description: How to install replica DCs for an on-premises Active Directory domain on Azure virtual machines (VMs) in an Azure virtual network.
services: active-directory
documentationcenter: ''
author: curtand
manager: femila
editor: ''

ms.assetid: 8c9ebf1b-289a-4dd6-9567-a946450005c0
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/12/2017
ms.author: curtand
ms.reviewer: jeffsta

ms.custom: oldportal;it-pro;

---
# Install a replica Active Directory domain controller in an Azure virtual network
This article discusses how to install additional domain controllers (DCs) to be used as replica DCs for an on-premises Active Directory domain on Azure virtual machines (VMs) in an Azure virtual network. You can also [install a Windows Server Active Directory forest on an Azure virtual network](active-directory-new-forest-virtual-machine.md). For how to install Active Directory Domain Services (AD DS) on an Azure virtual network, see [Guidelines for Deploying Windows Server Active Directory on Azure Virtual Machines](https://msdn.microsoft.com/library/azure/jj156090.aspx).

## Scenario diagram
In this scenario, external users need to access applications that run on domain-joined servers. The VMs that run the application servers and the replica DCs are installed in an Azure virtual network. The virtual network can be connected to the on-premises network by [ExpressRoute](../expressroute/expressroute-locations-providers.md), or you can use a [site-to-site VPN](../vpn-gateway/vpn-gateway-site-to-site-create.md) connection, as shown in the following diagram. 


![Diagram pf replica Active Directory domain controller an Azure vnet][1]

The application servers and the DCs are deployed within separate cloud services to distribute compute processing and within availability sets for improved fault tolerance.
The DCs replicate with each other and with on-premises DCs by using Active Directory replication. No synchronization tools are needed.

## Create an Active Directory site for the Azure virtual network
It’s a good idea to create a site in Active Directory that represents the network region corresponding to the virtual network. That helps optimize authentication, replication, and other DC location operations. The following steps explain how to create a site, and for more background, see [Adding a New Site](https://technet.microsoft.com/library/cc781496.aspx).

1. Open Active Directory Sites and Services: **Server Manager** > **Tools** > **Active Directory Sites and Services**.
2. Create a site to represent the region where you created an Azure virtual network: click **Sites** > **Action** > **New site** > type the name of the new site, such as Azure US West > select a site link > **OK**.
3. Create a subnet and associate with the new site: double-click **Sites** > right-click **Subnets** > **New subnet** > type the IP address range of the virtual network (such as 10.1.0.0/16 in the scenario diagram) > select the new Azure site > **OK**.

## Create an Azure virtual network
To create an Azure virtual network and set up site-to-site VPN, follow the steps included in the article [Create a Site-to-Site connection](../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal.md). 

## Create Azure VMs for the DC roles
To create VMs to host the DC role, repeat the steps in [Create a Windows virtual machine with the Azure portal](../virtual-machines/windows/quick-create-portal.md) as needed. Deploy at least two virtual DCs to provide fault tolerance and redundancy. If the Azure virtual network has at least two DCs that are similarly configured, you can place the VMs that run those DCs in an availability set for improved fault tolerance.

To create the VMs by using Windows PowerShell instead of the Azure portal, see [Use Azure PowerShell to create and preconfigure Windows-based Virtual Machines](../virtual-machines/windows/classic/create-powershell.md?toc=%2fazure%2fvirtual-machines%2fwindows%2fclassic%2ftoc.json).

Reserve a static IP address for VMs that will run the DC role. To reserve a static IP address, download the Microsoft Web Platform Installer and [install Azure PowerShell](/powershell/azure/overview) and run the Set-AzureStaticVNetIP cmdlet. For example:

    'Get-AzureVM -ServiceName AzureDC1 -Name AzureDC1 | Set-AzureStaticVNetIP -IPAddress 10.0.0.4 | Update-AzureVM

For more information about setting a static IP address, see [Configure a Static Internal IP Address for a VM](../virtual-network/virtual-networks-reserved-private-ip.md).

## Install AD DS on Azure VMs
Sign in to a VM and verify that you have connectivity across the site-to-site VPN or ExpressRoute connection to resources on your on-premises network. Then install AD DS on the Azure VMs. You can use same process that you use to install an additional DC on your on-premises network (UI, Windows PowerShell, or an answer file). As you install AD DS, make sure you specify the new volume for the location of the AD database, logs and SYSVOL. If you need a refresher on AD DS installation, see  [Install Active Directory Domain Services (Level 100)](https://technet.microsoft.com/library/hh472162.aspx) or [Install a Replica Windows Server 2012 Domain Controller in an Existing Domain (Level 200)](https://technet.microsoft.com/library/jj574134.aspx).

## Reconfigure DNS server for the virtual network
1. In the [Azure portal](https://portal.azure.com), in the **Search resources** box, enter *Virtual networks*, then click **Virtual networks (classic)** in the search results. Click the name of the virtual network, and then [reconfigure the DNS server IP addresses for your virtual network](../virtual-network/virtual-network-manage-network.md#dns-servers) to use the static IP addresses assigned to the replica DCs instead of the IP addresses of an on-premises DNS servers.
2. To ensure that all the replica DC VMs on the virtual network are configured with to use DNS servers on the virtual network, click **Virtual Machines**, click the status column for each VM, and then click **Restart**. Wait until the VM shows **Running** state before you try to sign into it.

## Create VMs for application servers
1. Repeat the following steps to create VMs to run as application servers. Accept the default value for a setting unless another value is suggested or required.

   | On this wizard page… | Specify these values |
   | --- | --- |
   |  **Choose an Image** |Windows Server 2012 R2 Datacenter |
   |  **Virtual Machine Configuration** |<p>Virtual Machine Name: Type a single label name (such as  AppServer1).</p><p>New User Name: Type the name of a user. This user will be a member of the local Administrators group on the VM. You will need this name to sign in to the VM for the first time. The built-in account named Administrator will not work.</p><p>New Password/Confirm: Type a password</p> |
   |  **Virtual Machine Configuration** |<p>Cloud Service: Choose **Create a new cloud service** for the first VM and select that same cloud service name when you create more VMs that will host the application.</p><p>Cloud Service DNS Name: Specify a globally unique name</p><p>Region/Affinity Group/Virtual Network: Specify the virtual network name (such as WestUSVNet).</p><p>Storage Account: Choose **Use an automatically generated storage account** for the first VM and then select that same storage account name when you create more VMs that will host the application.</p><p>Availability Set: Choose **Create an availability set**.</p><p>Availability set name: Type a name for the availability set when you create the first VM and then select that same name when you create more VMs.</p> |
   |  **Virtual Machine Configuration** |<p>Select <b>Install the VM Agent</b> and any other extensions you need.</p> |
2. After each VM is provisioned, sign in and join it to the domain. In **Server Manager**, click **Local Server** > **WORKGROUP** > **Change…** and then select **Domain** and type the name of your on-premises domain. Provide credentials of a domain user, and then restart the VM to complete the domain join.

For more information about using Windows PowerShell, see [Get Started with Azure Cmdlets](/powershell/azure/overview) and [Azure Cmdlet Reference](/powershell/azure/get-started-azureps).

## Additional resources
* [Guidelines for Deploying Windows Server Active Directory on Azure Virtual Machines](https://msdn.microsoft.com/library/azure/jj156090.aspx)
* [How to upload existing on-premises Hyper-V domain controllers to Azure by using Azure PowerShell](http://support.microsoft.com/kb/2904015)
* [Install a new Active Directory forest on an Azure virtual network](active-directory-new-forest-virtual-machine.md)
* [Azure Virtual Network](../virtual-network/virtual-networks-overview.md)
* [Microsoft Azure IT Pro IaaS: (01) Virtual Machine Fundamentals](http://channel9.msdn.com/Series/Windows-Azure-IT-Pro-IaaS/01)
* [Microsoft Azure IT Pro IaaS: (05) Creating Virtual Networks and Cross-Premises Connectivity](http://channel9.msdn.com/Series/Windows-Azure-IT-Pro-IaaS/05)
* [Azure PowerShell](/powershell/azure/overview)
* [Azure Management Cmdlets](/powershell/module/azurerm.compute/#virtual_machines)

<!--Image references-->
[1]: ./media/active-directory-install-replica-active-directory-domain-controller/ReplicaDCsOnAzureVNet.png
