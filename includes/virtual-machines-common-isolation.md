---
 title: include file
 description: include file
 services: virtual-machines
 author: styli365
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 11/05/2020
 ms.author: sttsinar
 ms.custom: include file
---

Azure Compute offers virtual machine sizes that are Isolated to a specific hardware type and dedicated to a single customer. The Isolated sizes live and operate on specific hardware generation and will be deprecated when the hardware generation is retired.

Isolated virtual machine sizes are best suited for workloads that require a high degree of isolation from other customers’ workloads for reasons that include meeting compliance and regulatory requirements.  Utilizing an isolated size guarantees that your virtual machine will be the only one running on that specific server instance. 


Additionally, as the Isolated size VMs are large, customers may choose to subdivide the resources of these VMs by using [Azure support for nested virtual machines](https://azure.microsoft.com/blog/nested-virtualization-in-azure/).

The current Isolated virtual machine offerings include:
* Standard_E64is_v3
* Standard_E64i_v3
* Standard_M128ms
* Standard_GS5
* Standard_G5
* Standard_F72s_v2

> [!NOTE]
> Isolated VM Sizes have a hardware limited lifespan. Please see below for details

## Deprecation of Isolated VM Sizes

As Isolated VM sizes are hardware bound sizes, Azure will provide reminders 12 months in advance of the official deprecation of the sizes.  Azure will also offer an updated isolated size on our next hardware version that the customer could consider moving their workload onto.

| Size | Isolation Retirement Date | 
| --- | --- |
| Standard_DS15_v2<sup>1</sup> | May 15, 2020 |
| Standard_D15_v2<sup>1</sup>  | May 15, 2020 |

<sup>1</sup>  For details on Standard_DS15_v2 and Standard_D15_v2 isolation retirement program see FAQs


## FAQ
### Q: Is the size going to get retired or only "isolation" feature is?
**A**: If the virtual machine size does not have the "i" subscript, then only "isolation" feature will be retired. If isolation is not needed, there is no action to be taken and the VM will continue to work as expected. Examples include Standard_DS15_v2, Standard_D15_v2, Standard_M128ms etc. 
If the virtual machine size includes "i" subscript, then the size is going to get retired.

### Q: Is there a downtime when my vm lands on a non-isolated hardware?
**A**: If there is no need of isolation, no action is needed and there will be no downtime.

### Q: Is there any cost delta for moving to a non-isolated virtual machine?
**A**: No

### Q: When are the other isolated sizes going to retire?
**A**: We will provide reminders 12 months in advance of the official deprecation of the isolated size.

### Q: I'm an Azure Service Fabric Customer relying on the Silver or Gold Durability Tiers. Does this change impact me?
**A**: No. The guarantees provided by Service Fabric's [Durability Tiers](../service-fabric/service-fabric-cluster-capacity.md#durability-characteristics-of-the-cluster) will continue to function even after this change. If you require physical hardware isolation for other reasons, you may still need to take one of the actions described above. 
 
### Q: What are the milestones for D15_v2 or DS15_v2 isolation retirement? 
**A**: 
 
| Date | Action |
|---|---| 
| November 18, 2019 | Availability of D/DS15i_v2 (PAYG, 1-year RI) | 
| May 14, 2020 | Last day to buy D/DS15i_v2 1-year RI | 
| May 15, 2020 | D/DS15_v2 isolation guarantee removed | 
| May 15, 2021 | Retire D/DS15i_v2 (all customers except who bought 3-year RI of D/DS15_v2 before November 18, 2019)| 
| November 17, 2022 | Retire D/DS15i_v2 when 3-year RIs done (for customers who bought 3-year RI of D/DS15_v2 before November 18, 2019) |

## Next steps

Customers can also choose to further subdivide the resources of these Isolated virtual machines by using [Azure support for nested virtual machines](https://azure.microsoft.com/blog/nested-virtualization-in-azure/).
