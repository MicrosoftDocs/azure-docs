---
 title: include file
 description: include file
 services: virtual-machines
 author: ayshakeen
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 09/18/2019
 ms.author: azcspmt;ayshak;cynthn
 ms.custom: include file
---

Azure Compute offers virtual machine sizes that are Isolated to a specific hardware type and dedicated to a single customer.  These virtual machine sizes are best suited for workloads that require a high degree of isolation from other customers for workloads involving elements like compliance and regulatory requirements.  Customers can also choose to further subdivide the resources of these Isolated virtual machines by using [Azure support for nested virtual machines](https://azure.microsoft.com/blog/nested-virtualization-in-azure/).

Utilizing an isolated size guarantees that your virtual machine will be the only one running on that specific server instance.  The current Isolated virtual machine offerings include:
* Standard_E64is_v3
* Standard_E64i_v3
* Standard_M128ms
* Standard_GS5
* Standard_G5
* Standard_F72s_v2

> [!NOTE]
> Isolated VM Sizes has a shelf life. Please see below for details

## Decommissioning of Isolated VM Sizes
Isolated VM sizes are hardware bound sizes. They live and operate on specific hardware generation only and will retire with the hardware generation. We will provide reminders 12 months in advance of the official decommissioning of the sizes and offer an updated isolated size on our next hardware version. 

| Size | Isolation Retirement Date | 
| --- | --- |
| Standard_DS15_v2<sup>1</sup> | May 15, 2020 |
| Standard_D15_v2<sup>1</sup>  | May 15, 2020 |
| Standard_E64is_v3	| Dec 31, 2021  |
| Standard_E64i_v3	| Dec 31, 2021 | 
| Standard_M128ms	 | Dec 31, 2022 | 
| Standard_GS5	| Dec 31, 2021 | 
| Standard_G5	 | Dec 31, 2021 | 
| Standard_F72s_v2 | Dec 31, 2021 |

<sup>1</sup>  For details on Standard_DS15_v2 and Standard_D15_v2 isolation retirment program please see FAQs


## FAQ
### Q: Is the size going to get retired or only "isolation" feature is?
**A**: If the virtual machine size does not have the "i" subscript than only "isolation" feature will be retired. If isolation is not needed, there is no action to be taken and the VM will continue to work as expected. Examples include Standard_DS15_v2, Standard_D15_v2, Standard_M128ms etc. 
If the virtual machine size includes "i" subscript than the size is going to get retired. There will always be a similar non-isolated size with same price and performace. e.g. for Standard_E64is_v3 the non-isolated size is Standard_E64s_v3.

### Q: Is there a downtime when my vm lands on a non-isolated hardware?
**A**: If there is no need of isolation, no action is needed and there will be no downtime.

### Q: Is there any cost delta for moving to a non-isolated virtual machine?
**A**: No

### Q: When are the other isolated sizes going to retire?
**A**: We will provide reminders 12 months in advance of the official decommissioning of the isolted size.

### Q: I'm an Azure Service Fabric Customer relying on the Silver or Gold Durability Tiers. Does this change impact me?
**A**: No. The guarantees provided by Service Fabric's [Durability Tiers](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-capacity#the-durability-characteristics-of-the-cluster) will continue to function even after this change. If you require physical hardware isolation for other reasons, you may still need to take one of the actions described above. 
 
### Q: What are the milestones for D15_v2 or DS15_v2 isolation retirement? 
**A**: 
| Date | Action | 
| --- | --- |
| November 18, 2019	| Availability of D/DS15i_v2 (PAYG, 1-year RI) |
| May 14, 2020	| Last day to buy D/DS15i_v2 1-year RI | 
| May 15, 2020	 | D/DS15_v2 isolation guarantee removed | 
| May 15, 2021	| Retire D/DS15i_v2 (all customers except who bought 3-year RI of D/DS15_v2 before November 18, 2019)| 
| November 17, 2022	 | Retire D/DS15i_v2 when 3-year RIs done (for customers who bought 3-year RI of D/DS15_v2 before November 18, 2019) | 
