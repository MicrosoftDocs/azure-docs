---
title: Differences and considerations for virtual machines in Azure Stack | Microsoft Docs
description: Learn about differences and considerations when working with virtual machines in Azure Stack.
services: azure-stack
documentationcenter: ''
author: SnehaGunda
manager: byronr
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: na
pms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/27/2017
ms.author: sngun

---

# Considerations for Virtual Machines in Azure Stack

Virtual machines are an on-demand, scalable computing resources offered by Azure Stack. When you use Virtual Machines, you must understand that there are differences between the features that are available in Azure and Azure Stack. This article provides an overview of the unique considerations for Virtual Machines and its features in Azure Stack. To learn about high-level differences between Azure Stack and Azure, see the [Key considerations](azure-stack-considerations.md) topic.

## Virtual machine images

By default, there aren’t any virtual machine images available in the Azure Stack marketplace. The Azure Stack administrator **must publish or syndicate the virtual machine images to the marketplace** before users can use them. Users should notify their Azure Stack administrator if they want to use an image, which is currently not available in the Azure Stack marketplace. 

## Virtual machine sizes 

Azure Stack supports a subset of the virtual machine sizes that are available in Azure. The Azure Stack TP3 refresh release supports the following virtual machine sizes: 

| Type | Size | Range of supported sizes |
| --- | --- | --- |
|General purpose |Basic A|A0-A4|
|General purpose |Standard A|A0-A7|
|General purpose |Standard D|D1-D4|
|General purpose |Standard Dv2|D1v2-D5v2|
|Memory optimized|D-series|D11-D14|
|Memory optimized |Dv2-series|D11v2-D14v2|

Virtual machine sizes in Azure Stack and Azure are consistent in terms of the memory, CPU cores, network bandwidth, disk performance, and other factors that define the size. For example, the Standard D size virtual machine in Azure and Azure Stack is consistent. 

## Virtual machine extensions 

Azure Stack supports a subset of virtual machine extensions that are available in Azure. The Azure Stack administrator can choose which extensions can be made available to their tenants. Use the following PowerShell script to get the list of virtual machine extensions that are available in your Azure Stack environment:

```powershell 
Get-AzureRmVmImagePublisher -Location local | `
  Get-AzureRmVMExtensionImageType | `
  Get-AzureRmVMExtensionImage | `
  Select Type, Version | `
  Format-Table -Property * -AutoSize 
```

The Azure Stack TP3 refresh supports the following virtual machine extension versions:

![VM Extensions](media/azure-stack-vm-considerations/vm-extensions.png)
 

## Availability sets 

In Azure Stack, the fault domain and the update domain are scoped to the Azure Stack POC environment. The Azure Stack TP3 refresh supports **one fault domain and one update domain** for virtual machine availability sets.

## Virtual machine quota limits

Quota limits for Azure Virtual Machines are set by Microsoft whereas in Azure Stack, the administrator must assign quotas before they offer virtual machines to their users. 

## Virtual machine network  

Azure Stack virtual machines use network resources like network interfaces, IP addresses, virtual networks (VNet), and DNS names to set up network connectivity. Azure Stack has the following unique considerations for the network resources:

**Public IP addresses**

In Azure Stack, the public IP addresses assigned to a virtual machines are accessible from the Azure Stack POC environment only, they are not accessible over the Internet. So, a user must have access to the POC environment via [RDP](azure-stack-connect-azure-stack.md#connect-with-remote-desktop) or [VPN](azure-stack-connect-azure-stack.md#connect-with-vpn) to connect to a virtual machine. It’s the responsibility of the Azure Stack administrator to configure which users can access the Azure Stack POC environment.  

**DNS names**

Azure has a fixed DNS name whereas in Azure Stack, the administrator configures the DNS name for an Azure Stack instance. So, all the virtual machines created in a specific Azure Stack instance have a DNS name based on the value that is configured by the administrator.

## Virtual machine storage

Azure Stack virtual machines use storage accounts to store the operating system and data disk images that are associated with the virtual machine. Azure Stack has the following unique considerations for storage that is associated with virtual machines:

**Premium and Standard Storage**

Azure Stack has two performance tiers for storage that you can choose from when creating disks, they are Standard Storage and Premium Storage. Azure Stack, doesn’t differentiate between Premium and Standard storage. Both performance tiers are backed by Storage Spaces Direct with a combination of storage types such as SSDs, non-volatile memory express (NVMe) or hard disk drive (HDDs). 

Currently, there is no limitation on the input/output operations per second (IOPS) value for the storage account. You can either use the standard or premium storage account types when deploying a virtual machine with Resource Manager templates or PowerShell. 

**Supports unmanaged disks only**

Azure Stack currently supports **unmanaged or traditional disk types only**. Managed disks are not yet supported in Azure Stack. So, users should manage the storage accounts associated with the virtual machine disks. The storage account properties and the disk URI should be specified when you create a virtual machine by using PowerShell or an Azure Resource Manager template. See [Create a virtual machine with PowerShell in Azure Stack](azure-stack-quick-create-vm-powershell.md) for an example.

## API versions 

Azure Stack supports specific Azure services and specific API versions for these services. You can use the following PowerShell script to get the API versions for the virtual machine features that are available in your Azure Stack environment:

```powershell 
Get-AzureRmResourceProvider | `
  Select ProviderNamespace -Expand ResourceTypes | `
  Select * -Expand ApiVersions | `
  Select ProviderNamespace, ResourceTypeName, @{Name="ApiVersion"; Expression={$_}} | `
  where-Object {$_.ProviderNamespace -like “Microsoft.compute”}
```

In the Azure Stack TP3 refresh release, the following API versions are available:

![VM resource types](media/azure-stack-vm-considerations/vm-resoource-types.png)
 
The list of supported resource types and API versions may vary if the administrator updates your Azure Stack environment to a newer version.


## Next steps

[Create a Windows virtual machine with PowerShell in Azure Stack](azure-stack-quick-create-vm-powershell.md)
