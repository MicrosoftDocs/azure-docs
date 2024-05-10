---
title: License SQL Server, Windows Server, and Linux in Azure VMware Solution 
description: This article provides licensing considerations for running SQL Server, Windows Server, and Linux in VMs in Azure VMware Solution. It provides details around utilizing Azure Hybrid Benefits and steps on how to register your SQL Server licenses in the tooling.
author: MikeWeiner-Microsoft
ms.author: michwe
ms.service: azure-vmware
ms.topic: how-to  
ms.date: 04/29/2024
---

# License SQL Server, Windows Server, and Linux in Azure VMware Solution 

This article provides licensing considerations and tooling integration for running SQL Server, Windows Server and Linux within Azure VMware Solution. 

Included in the pricing of Azure VMware Solution is infrastructure, hosts, and storage along with many VMware licensing components including NSX-T, vSphere, vSAN, and HCX Advanced. There's no extra cost in Azure VMware Solution added based on the software running in any of your virtual machines(VMs). You do, however need to license products running in the VMs. For SQL Server, Windows Server, and Linux subscriptions you can use your existing licensing investment to apply them in Azure VMware Solution.

In addition, with [Software Assurance](https://www.microsoft.com/Licensing/licensing-programs/software-assurance-by-benefits) or an active Linux subscription you can take advantage of [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/) not only allowing for you to use any existing licenses, but including another benefits around migration and unlimited virtualization.

> [!NOTE]
> If you do not have Software Assurance you need to apply the terms around licensing provided in: [Updated Microsoft licensing terms for dedicated hosted cloud services](https://www.microsoft.com/en-us/licensing/news/updated-licensing-rights-for-dedicated-cloud). This will limit the licenses which can be applied based on terms applied after October 1st, 2019 along with additional migration and virtualization benefits.

The rest of this article discusses SQL Server and Windows Server licensing considerations in Azure VMware Solution with Software Assurance and Azure Hybrid Benefit applied. 

> [!IMPORTANT] 
> The Microsoft Product Terms for specific programs and software take precedent over this article and may contain more detailed content specific to that product. For more information, select your specific program under: 
>
>-[SQL Server Product Terms](https://www.microsoft.com/licensing/terms/productoffering/SQLServer/EAEAS)
>
> -[Windows Server Product Terms](https://www.microsoft.com/licensing/terms/productoffering/WindowsServerStandardDatacenterEssentials/EAEAS)  
>
>-[Azure Product Terms](https://www.microsoft.com/licensing/terms/productoffering/MicrosoftAzure/EAEAS) 

## Type of licenses 
You can use the following licenses for SQL Server and Windows Server to apply to software running in Azure VMware Solution.

- ****Windows Server**** - Standard or Datacenter core licenses OR Standard/Datacenter processor licenses, where each processor license is equivalent to 16 core licenses.

- ****SQL Server**** - Standard or Enterprise core licenses.

## Dual Use Rights for Azure Migration
Migration to Azure VMware Solution is usually executed over an extended timeframe instead of at a single point-in-time. To give you flexibility around your migration timelines you can continue to use your licenses outside of Azure, for 180 days, from when the licenses are allocated within Azure VMware Solution. This dual use rights benefit applies to SQL Server and Windows Server.

For more information and other considerations for dual use rights outside of migration, see [Azure Product Terms](https://www.microsoft.com/licensing/terms/productoffering/MicrosoftAzure/EAEAS). 

## License the host physical cores - Unlimited Virtualization Rights
Unlimited virtualization allows you to license the physical cores on the host and run as many VMs with Windows Server and/or SQL Server as you can, limited only by host capacity. It can provide licensing cost optimization for environments with scenarios such as:  
- The host contains a high density of VMs 
- The host contains dynamic provisioning or deprovisioning of VMs  
- The workloads in the VMs aren't performance sensitive or can function even if impacted by another VM workload using the host resources. 

By applying existing SQL Server Enterprise and/or Windows Server Datacenter licenses to cover the physical cores of any host you can achieve unlimited virtualization of that host. Each host is required to have licenses applied to all the physical cores.  

While Standard SQL Server and Windows licenses can't be used for unlimited virtualization, they can be applied to license an individual VM discussed in the next section.

## License a Virtual Machine virtual cores
You need to license each machine individually applying licenses based on the number of virtual cores (v-Core) associated with the VM. 

Either Enterprise or Standard licenses can be applied for SQL Server and either Standard and Datacenter licenses for Windows. 

Applying licenses at the VM scope could fit your needs for scenarios such as 
- The hosts aren't densely packed with VMs running the respective software. The overall licensing cost in this case could be more cost effective than licensing an entire host.
- You are running Standard editions of SQL Server and/or Windows Server and therefore have these existing licenses to apply.

Each VM does require a minimum number of licenses to be applied:

- ****Windows Server**** - You need a minimum of 8 core licenses (Datacenter or Standard) per VM. For example, 8 core licenses are still required if you run a 4-core VM. You may also run VMs larger than 8 cores by allocating licenses equal to the core size of the VM. For example, 12 core licenses are required for a 12-core VM. For customers with processor licenses, each 2-core processor license is equivalent to 16 core licenses.

- ****SQL Server**** - A minimum of 4 core licenses (Enterprise or Standard) per VM.

### How to register licenses in Azure VMware Solution
#### SQL Server
##### License the host - Unlimited Virtualization
You can enable Azure Hybrid Benefit for SQL Server and achieve unlimited virtualization through an Azure VMware Solution placement policy. The details on how to create the VM-Host placement policy are located here: [Enable Unlimited Virtualization with Azure Hybrid Benefit for SQL Server in Azure VMware Solution.](https://learn.microsoft.com/azure/azure-vmware/enable-sql-azure-hybrid-benefit)

##### License a virtual machine
SQL Server licenses can be registered and applied to VMs running SQL Server in Azure VMware Solution by registering through Azure Arc, through these steps: 
1.	Azure VMware Solution must be Arc-enabled: [Deploy Arc-enabled VMware vSphere for Azure VMware Solution](https://learn.microsoft.com/azure/azure-vmware/deploy-arc-for-azure-vmware-solution?tabs=windows). You can Arc-enable the virtual machines and get the Azure Extension for SQL Server applied to that VM by following the steps provided in the section titled *Enable guest management and extension installation*. 
2.	When Guest Management is configured, the Azure Extension for SQL Server should be installed on that VM. This allows for setting the License Type for the SQL Server instance running in the VM. 
3. Once enabled you can configure the License Type and other SQL Server configuration settings from the Azure portal, PowerShell or CLI for a specific Arc-enabled server. To configure from the Azure portal, VMware vSphere in Azure VMware Solution experience, follow the steps:  
 
1. In the Azure VMware Solution portal, go to **vCenter Server Inventory** and **Virtual Machines** clicking through one of the Arc-enabled VMs. Here you see the Machine-Azure Arc (AVS) page.
2. In the left pane, expand Operations and you should see the SQL Server Configuration 
3. You can now apply and save your License Type for the VM along with other server configurations

You can also configure these setting within the Azure Arc portal experience and from PowerShell or CLI. The Azure Arc portal experience and code to update the configuration values is provided here: [Configure SQL Server enabled by Azure Arc.](https://learn.microsoft.com/sql/sql-server/azure-arc/manage-configuration?view=sql-server-ver16&tabs=azure) 

> [!NOTE]
>At this time Azure VMware Solution does not integrate with the **SQLServerLicense** resource type.

##### Managing the environment
Once the Azure Extension for SQL Server is installed, you can query the SQL Server configuration settings and track your SQL Server license inventory for each VM. Sample queries are provided here: [Query SQL Server configuration](https://learn.microsoft.com/sql/sql-server/azure-arc/manage-configuration?view=sql-server-ver16&tabs=azure#query-sql-server-configuration)

#### Windows Server
Currently there is no way to register your Windows licenses in Azure VMware Solution.
    
### Other cost savings for SQL Server and Windows Server
In addition to taking advantage of Azure Hybrid Benefit for SQL Server, Windows Server and Linux subscription more cost savings can be realized in Azure VMware Solution through:
- [Extended Security Updates (ESU) for Windows Server and SQL Server - Azure VMware Solution](https://learn.microsoft.com/azure/azure-vmware/extended-security-updates-windows-sql-server)
- [Save costs with a reserved instance](https://learn.microsoft.com/azure/azure-vmware/reserved-instance)

## More Information
[Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/)

[Azure VMware Solution pricing](https://azure.microsoft.com/en-us/pricing/details/azure-vmware/) 
