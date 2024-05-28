---
title: License SQL Server, Windows Server, and Linux in Azure VMware Solution 
description: Learn about licensing considerations for running SQL Server, Windows Server, and Linux in VMs in Azure VMware Solution and how to utilize Azure Hybrid Benefits and register your SQL Server licenses.
author: MikeWeiner-Microsoft
ms.author: michwe
ms.service: azure-vmware
ms.topic: how-to  
ms.date: 05/24/2024
---

# License SQL Server, Windows Server, and Linux in Azure VMware Solution

This article provides licensing considerations and tooling integration for running SQL Server, Windows Server, and Linux within Azure VMware Solution.

Included in the pricing of Azure VMware Solution is infrastructure, hosts, storage, and many VMware licensing components. These components include NSX-T, vSphere, vSAN, and HCX Advanced. There's no added charge in the pricing for any software running in your guest virtual machines (VMs).

To remain compliant, you need to license the software running in the VMs. For SQL Server, Windows Server, and Linux subscriptions, you can use your existing licenses and apply them in Azure VMware Solution.

With [Software Assurance](https://www.microsoft.com/Licensing/licensing-programs/software-assurance-by-benefits) or an active Linux subscription, you can also take advantage of [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/) for other benefits around migration and unlimited virtualization.

> [!NOTE]
> If you don't have Software Assurance, you need to apply the terms for licensing that are provided in [Updated Microsoft licensing terms for dedicated hosted cloud services](https://www.microsoft.com/en-us/licensing/news/updated-licensing-rights-for-dedicated-cloud). These terms limit the licenses that can be applied based on terms applied after October 1, 2019, and other migration and virtualization benefits.

The remainder of this article discusses SQL Server and Windows Server licensing considerations in Azure VMware Solution with Software Assurance and Azure Hybrid Benefit applied.

> [!IMPORTANT] 
> The Microsoft Product Terms for specific programs and software take precedence over this article and might contain more content specific to that product. For more information, select your specific program under:
>
>-[SQL Server Product Terms](https://www.microsoft.com/licensing/terms/productoffering/SQLServer/EAEAS)
>
> -[Windows Server Product Terms](https://www.microsoft.com/licensing/terms/productoffering/WindowsServerStandardDatacenterEssentials/EAEAS)  
>
>-[Azure Product Terms](https://www.microsoft.com/licensing/terms/productoffering/MicrosoftAzure/EAEAS) 

## Type of licenses 
You can use the following licenses for SQL Server and Windows Server to apply to software running in Azure VMware Solution:

- **Windows Server**: Standard or Datacenter core licenses or Standard/Datacenter processor licenses, where each processor license is equivalent to 16 core licenses.
- **SQL Server**: Standard or Enterprise core licenses.

## Dual-use rights for Azure Migration
Migration to Azure VMware Solution is usually executed over an extended time-frame instead of at a single point in time. To give you flexibility around your migration timelines, you can continue to use your licenses outside of Azure for 180 days from the time when the licenses are allocated within Azure VMware Solution. This dual-use rights benefit applies to SQL Server and Windows Server.

For more information and other considerations for dual-use rights outside of migration, see [Azure Product Terms](https://www.microsoft.com/licensing/terms/productoffering/MicrosoftAzure/EAEAS).

## License the host physical cores by using unlimited virtualization rights
Unlimited virtualization allows you to license the physical cores on the host and run as many VMs with Windows Server or SQL Server as you can. You're limited only by host capacity. Unlimited virtualization can provide licensing cost optimization for the following scenarios:

- The host contains a high density of VMs.
- The host contains dynamic provisioning or deprovisioning of VMs.

By applying existing SQL Server Enterprise or Windows Server Datacenter licenses to cover the physical cores of any host, you can achieve unlimited virtualization of that host. Each host is required to have licenses applied to all the physical cores.

Standard licenses for SQL Server and Windows Server can't be used for unlimited virtualization, but they can be applied to license an individual VM. This use is discussed in the next section.

## License a virtual machine based on virtual cores
You need to license each machine individually by applying licenses based on the number of virtual cores associated with the VM.

Either Enterprise or Standard licenses can be applied for SQL Server. Standard and Datacenter licenses can be applied for Windows.

Applying licenses at the VM scope could meet your needs for the following scenarios:

- The hosts aren't densely packed with VMs running the respective software. The overall licensing cost in this case could be more cost effective than licensing an entire host.
- You're running Standard editions of SQL Server or Windows Server, so you have these existing licenses to apply.

Each VM requires a minimum number of licenses to be applied:

- **Windows Server**: You need a minimum of 8 core licenses (Datacenter or Standard) per VM. For example, 8 core licenses are still required if you run a 4-core VM. You might also run VMs larger than 8 cores by allocating licenses equal to the core size of the VM. For example, 12 core licenses are required for a 12-core VM. 
- **SQL Server**: A minimum of 4 core licenses (Enterprise or Standard) per VM.

### Register licenses in Azure VMware Solution
Register your licenses in Azure VMware Solution.

#### SQL Server
You can register and manage your licenses with SQL Server.

##### License the host by using unlimited virtualization
You can enable Azure Hybrid Benefit for SQL Server and achieve unlimited virtualization through an Azure VMware Solution placement policy. For information on how to create the VM-Host placement policy, see [Enable unlimited virtualization with Azure Hybrid Benefit for SQL Server in Azure VMware Solution](https://learn.microsoft.com/azure/azure-vmware/enable-sql-azure-hybrid-benefit).

##### License a virtual machine
You can register SQL Server licenses and apply them to VMs running SQL Server in Azure VMware Solution by registering through Azure Arc:
1.	Azure VMware Solution must be Azure Arc-enabled. For more information, see [Deploy Azure Arc-enabled VMware vSphere for Azure VMware Solution](https://learn.microsoft.com/azure/azure-vmware/deploy-arc-for-azure-vmware-solution?tabs=windows). You can Azure Arc-enable the VMs and install extensions to that VM by following the steps provided in the section titled "Enable guest management and extension installation."
1.	When **Guest Management** is configured, the Azure Extension for SQL Server should be installed on that VM. The extension installation enables you to configure the license type for the SQL Server instance running in the VM.
1. Now you can configure the license type and other SQL Server configuration settings by using the Azure portal, PowerShell, or the Azure CLI for a specific Azure Arc-enabled server. To configure from the Azure portal with VMware vSphere in the Azure VMware Solution experience, follow these steps:
 
   1. In the Azure VMware Solution portal, go to **vCenter Server Inventory** and **Virtual Machines** by clicking through one of the Azure Arc-enabled VMs. The **Machine-Azure Arc (AVS)** page appears.
   1. On the left pane, under **Operations**, select **SQL Server Configuration**.
   1. You can now apply and save your license type for the VM along with other server configurations.

You can also configure these settings within the Azure Arc portal experience and by using PowerShell or the Azure CLI. To access the Azure Arc portal experience and code to update the configuration values, see [Configure SQL Server enabled by Azure Arc](https://learn.microsoft.com/sql/sql-server/azure-arc/manage-configuration?view=sql-server-ver16&tabs=azure).

For available license types, see [License types](https://learn.microsoft.com/sql/sql-server/azure-arc/manage-license-billing?view=sql-server-ver16#license-types).

> [!NOTE]
> At this time, Azure VMware Solution doesn't have support for the new `SQLServerLicense` resource type.

##### Manage the environment
After the Azure Extension for SQL Server is installed, you can query the SQL Server configuration settings and track your SQL Server license inventory for each VM. For sample queries, see [Query SQL Server configuration](https://learn.microsoft.com/sql/sql-server/azure-arc/manage-configuration?view=sql-server-ver16&tabs=azure#query-sql-server-configuration).

#### Windows Server
Currently, there's no way to register your Windows licenses in Azure VMware Solution.
    
### Other cost savings for SQL Server and Windows Server
For more cost savings with Azure VMware Solution, see:

- [Extended Security Updates (ESUs) for Windows Server and SQL Server - Azure VMware Solution](https://learn.microsoft.com/azure/azure-vmware/extended-security-updates-windows-sql-server)
- [Save costs with a reserved instance](https://learn.microsoft.com/azure/azure-vmware/reserved-instance)

## Related content
- [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/)
- [Azure VMware Solution pricing](https://azure.microsoft.com/pricing/details/azure-vmware/)
