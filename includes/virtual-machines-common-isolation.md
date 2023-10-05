---
 title: include file
 description: include file
 services: virtual-machines
 author: rishabv90
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 04/20/2023
 ms.author: risverma
 ms.reviewer: mattmcinnes
 ms.custom: include file
---

Azure Compute offers virtual machine sizes that are Isolated to a specific hardware type and dedicated to a single customer. The Isolated sizes live and operate on specific hardware generation and will be deprecated when the hardware generation is retired or new hardware generation is available.

Isolated virtual machine sizes are best suited for workloads that require a high degree of isolation from other customers’ workloads. This is sometimes required to meet compliance and regulatory requirements.  Utilizing an isolated size guarantees that your virtual machine is the only one running on that specific server instance. 


Additionally, as the Isolated size VMs are large, customers may choose to subdivide the resources of these VMs by using [Azure support for nested virtual machines](https://azure.microsoft.com/blog/nested-virtualization-in-azure/).

The current Isolated virtual machine offerings include:
* Standard_E80ids_v4
* Standard_E80is_v4
* Standard_E104i_v5
* Standard_E104is_v5
* Standard_E104id_v5
* Standard_E104ids_v5
* Standard_M192is_v2
* Standard_M192ims_v2
* Standard_M192ids_v2
* Standard_M192idms_v2
* Standard_F72s_v2
* Standard_M128ms


> [!NOTE]
> Isolated VM Sizes have a limited lifespan due to hardware deprecation.

## Deprecation of Isolated VM Sizes

Isolated VM sizes have a hardware limited lifespan. Azure issues reminders 12 months in advance of the official deprecation date of the sizes and provides an updated isolated offering for your consideration. The following sizes have retirement announced.

| Size | Isolation Retirement Date | 
| --- | --- |
| Standard_DS15_v2  | May 15, 2021      |
| Standard_D15_v2   | May 15, 2021      |
| Standard_G5       | February 15, 2022 |
| Standard_GS5      | February 15, 2022 |
| Standard_E64i_v3  | February 15, 2022 |
| Standard_E64is_v3 | February 15, 2022 |


## FAQ
### Q: Is the size going to get retired or only its "isolation" feature?
**A**: Any size that is published as isolated but have no "i" in the name, the isolation feature of the VM sizes is being retired unless communicated differently. Sizes with "i" in the name will be deprecated. 

### Q: Is there a downtime when my vm lands on a nonisolated hardware?
**A**: For VM sizes, where only isolation is deprecating but not the size, no action is needed and there will be no downtime. 
On contrary if isolation is required, announcement includes the recommended replacement size. Selecting the replacement size requires customers to resize their VMs.  

### Q: Is there any cost delta for moving to a nonisolated virtual machine?
**A**: No

### Q: When are the other isolated sizes going to retire?
**A**: We provide reminders 12 months in advance of the official deprecation of the isolated size. Our latest announcement includes isolation feature retirement of Standard_G5, Standard_GS5, Standard_E64i_v3 and Standard_E64i_v3.  

### Q: I'm an Azure Service Fabric Customer relying on the Silver or Gold Durability Tiers. Does this change impact me?
**A**: No. The guarantees provided by Service Fabric's [Durability Tiers](../articles/service-fabric/service-fabric-cluster-capacity.md#durability-characteristics-of-the-cluster) will continue to function even after this change. If you require physical hardware isolation for other reasons, you may still need to take one of the actions described above. 
 
### Q: What are the milestones for D15_v2 or DS15_v2 isolation retirement? 
**A**: 
 
| Date | Action |
|---|---| 
| May 15, 2020<sup>1</sup> | D/DS15_v2 isolation retirement announcement| 
| May 15, 2021 | D/DS15_v2 isolation guarantee removed| 

<sup>1</sup> Existing customer using these sizes will receive an announcement email with detailed instructions on the next steps.  

### Q: What are the milestones for G5, Gs5, E64i_v3 and E64is_v3 isolation retirement? 
**A**: 
 
| Date | Action |
|---|---|
| Feb 15, 2021<sup>1</sup> | G5/GS5/E64i_v3/E64is_v3 isolation retirement announcement |
| Feb 28, 2022 | G5/GS5/E64i_v3/E64is_v3 isolation guarantee removed |

<sup>1</sup> Existing customer using these sizes will receive an announcement email with detailed instructions on the next steps.  

## Next steps

Customers can also choose to further subdivide the resources of these Isolated virtual machines by using [Azure support for nested virtual machines](https://azure.microsoft.com/blog/nested-virtualization-in-azure/).
