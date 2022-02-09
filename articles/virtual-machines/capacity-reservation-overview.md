---
title: On-demand Capacity Reservation in Azure (preview)
description: Learn how to reserve compute capacity in an Azure region or an Availability Zone with Capacity Reservation.
author: bdeforeest
ms.author: bidefore
ms.service: virtual-machines #Required
ms.topic: how-to
ms.date: 08/09/2021
ms.reviewer: cynthn, jushiman
ms.custom: template-how-to
---

# On-demand Capacity Reservation (preview)

On-demand Capacity Reservation enables you to reserve Compute capacity in an Azure region or an Availability Zone for any duration of time. Unlike [Reserved Instances](https://azure.microsoft.com/pricing/reserved-vm-instances/), you do not have to sign up for a 1-year or a 3-year term commitment. Create and delete reservations at any time and have full control over how you want to manage your reservations.  

Once the Capacity Reservation is created, the capacity is available immediately and is exclusively reserved for your use until the reservation is deleted.  


> [!IMPORTANT]
> Capacity Reservation is currently in public preview.
> This preview version is provided without a service-level agreement, and we do not recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


Capacity Reservation has some basic properties that are always defined at the time of creation: 
- **VM size** - Each reservation is for one VM size. For example, `Standard_D2s_v3`. 
- **Location** - Each reservation is for one location (region). If that location has availability zones, then the reservation can also specify one of the zones. 
- **Quantity** - Each reservation has a quantity of instances to be reserved. 

To create a Capacity Reservation, these parameters are passed to Azure as a capacity request. If the subscription lacks the required quota or Azure does not have capacity available that meets the specification, the reservation will fail to deploy. To avoid deployment failure, request more quota or try a different VM size, location, or zone combination. 

Once Azure accepts a reservation request, it is available to be consumed by VMs of matching configurations. To consume Capacity Reservation, the VM will have to specify the reservation as one of its properties. Otherwise, the Capacity Reservation will remain unused. One benefit of this design is that you can target only critical workloads to reservations and other non-critical workloads can run without reserved capacity.   

> [!NOTE]
> Capacity Reservation also comes with Azure availability SLA for use with virtual machines. The SLA won't be enforced during public preview and will be defined when Capacity Reservation is generally available.

## Benefits of Capacity Reservation 

- Once deployed, capacity is reserved for your use and always available within the scope of applicable SLAs  
- Can be deployed and deleted at any time with no term commitment 
- Can be combined automatically with Reserved Instances to avail term commitments discounts  

## SLA for Capacity Reservation 

The SLA for Capacity Reservation will be defined later when the feature is generally available.  


## Limitations and restrictions 

- Creating capacity reservations requires quota in the same manner as creating virtual machines. 
- Spot VMs and Azure Dedicated Host Nodes are not supported with Capacity Reservation. 
- Some deployment constraints are not supported: 
    - Proximity Placement Group 
    - Update domains 
    - UltraSSD storage  
- Only Av2, B, D, E, & F VM series are supported during public preview. 
- For the supported VM series during public preview, up to 3 Fault Domains (FDs) will be supported. A deployment with more than 3 FDs will fail to deploy against Capacity Reservation. 
- Availability Sets are not supported with Capacity Reservation. 
- During this preview, only the subscription that created the reservation can use it. 
- Reservations are only available to paid Azure customers. Sponsored accounts such as Free Trial and Azure for Students are not eligible to use this feature. 


## Pricing and billing 

Capacity Reservations are priced at the same rate as the underlying VM size. For example, if you create a reservation for ten quantities of D2s_v3 VM, as soon as the reservation is created, you will start getting billed for ten D2s_v3 VMs, even if the reservation is not being used.  

If you then deploy a D2s_v3 VM and specify reservation as its property, the Capacity Reservation gets used. Once in use, you will only pay for the VM and nothing extra for the Capacity Reservation. Let’s say you deploy five D2s_v3 VMs against the previously mentioned Capacity Reservation. You will see a bill for five D2s_v3 VMs and five unused Capacity Reservation, both charged at the same rate as a D2s_v3 VM.    

Both used and unused Capacity Reservation are eligible for Reserved Instances term commitment discounts. In the previous example, if you have Reserved Instances for two D2s_v3 VMs in the same Azure region, the billing for two resources (either VM or unused Capacity Reservation) will be zeroed out and you will only pay for the rest of the eight resources. Those eight resources are the five unused capacity reservations and three D2s_v3 VMs. In this case, the term commitment discounts could be applied on either the VM or the unused Capacity Reservation, both of which are charged at the same PAYG rate. 

## Difference between On-demand Capacity Reservation and Reserved Instances 


| Differences | On-demand Capacity Reservation | Reserved Instances|
|---|---|---|
| Term | No term commitment required. Can be created and deleted as per the customer requirement | Fixed term commitment of either one-year or three-years|
| Billing discount | Charged at pay-as-you-go rates for the underlying VM size* | Significant cost savings over pay-as-you-go rates |
| Capacity SLA | Provides capacity guarantee in the specified location (region or availability zone) | Does not provide a capacity guarantee. Customers can choose “capacity priority” to gain better access, but that option does not carry an SLA |
| Region vs Availability Zones | Can be deployed per region or per availability zone | Only available at regional level |

*Eligible for Reserved Instances discount if purchased separately


## Work with Capacity Reservation 

Capacity Reservation can be created for a specific VM size in an Azure region or an Availability Zone. All reservations are created and managed as part of a Capacity Reservation group, which allows creation of a group to manage different VM sizes in a single multi-tier application. Each reservation is for one VM size and a group can have only one reservation per VM size.  

To consume Capacity Reservation, specify Capacity Reservation group as one of the VM properties. If the group doesn’t have a matching reservation, Azure will return an error message. 

The quantity reserved for reservation can be adjusted after initial deployment by changing the capacity property. Other changes to Capacity Reservation, such as VM size or location, are not permitted. The recommended approach is to delete the existing reservation and create a new one with the new requirements. 

Capacity Reservation doesn’t create limits on the number of VM deployments. Azure supports allocating as many VMs as desired against the reservation. As the reservation itself requires quota, the quota checks are omitted for VM deployment up to the reserved quantity. Allocating more VMs against the reservation is subject to quota checks and Azure fulfilling the extra capacity. Once deployed, these extra VM instances can cause the quantity of VMs allocated against the reservation to exceed the reserved quantity. This state is called overallocating. To learn more, go to [Overallocating Capacity Reservation](capacity-reservation-overallocate.md). 


## Capacity Reservation lifecycle

When a reservation is created, Azure sets aside the requested number of capacity instances in the specified location: 

![Capacity Reservation image 1.](./media/capacity-reservation-overview/capacity-reservation-1.jpg) 

Track the state of the overall reservation through the following properties:  
- `capacity` = Total quantity of instances reserved by the customer. 
- `virtualMachinesAllocated` = List of VMs allocated against the Capacity Reservation and count towards consuming the capacity. These VMs are either *Running*, *Stopped* (*Allocated*), or in a transitional state such as *Starting* or *Stopping*. This list doesn’t include the VMs that are in deallocated state, referred to as *Stopped* (*deallocated*). 
- `virtualMachinesAssociated` = List of VMs associated with the Capacity Reservation. This list has all the VMs that have been configured to use the reservation, including the ones that are in deallocated state.  

The previous example will start with `capacity` as 2 and length of `virutalMachinesAllocated` and `virtualMachinesAssociated` as 0.  

When a VM is then allocated against the Capacity Reservation, it will logically consume one of the reserved capacity instances: 

![Capacity Reservation image 2.](./media/capacity-reservation-overview/capacity-reservation-2.jpg) 

The status of the Capacity Reservation will now show `capacity` as 2 and length of `virutalMachinesAllocated` and `virtualMachinesAssociated` as 1.  

Allocations against the Capacity Reservation will succeed as along as the VMs have matching properties and there is at least one empty capacity instance.  

Using our example, when a third VM is allocated against the Capacity Reservation, the reservation enters the [overallocated](capacity-reservation-overallocate.md) state. This third VM will require unused quota and extra capacity fulfillment from Azure. Once the third VM is allocated, the Capacity Reservation now looks like this: 

![Capacity Reservation image 3.](./media/capacity-reservation-overview/capacity-reservation-3.jpg) 

The `capacity` is 2 and the length of `virutalMachinesAllocated` and `virtualMachinesAssociated` is 3. 

Now suppose the application scales down to the minimum of two VMs. Since VM 0 needs an update, it is chosen for deallocation. The reservation automatically shifts to this state: 

![Capacity Reservation image 4.](./media/capacity-reservation-overview/capacity-reservation-4.jpg) 

The `capacity` and the length of `virtualMachinesAllocated` are both 2. However, the length for `virtualMachinesAssociated` is still 3 as VM 0, though deallocated, is still associated with the Capacity Reservation.  

The Capacity Reservation will exist until explicitly deleted. To delete a Capacity Reservation, the first step is to dissociate all the VMs in the `virtualMachinesAssociated` property. Once disassociation is complete, the Capacity Reservation should look like this: 

![Capacity Reservation image 5.](./media/capacity-reservation-overview/capacity-reservation-5.jpg) 

The status of the Capacity Reservation will now show `capacity` as 2 and length of `virtualMachinesAssociated` and `virtualMachinesAllocated` as 0. From this state, the Capacity Reservation can be deleted. Once deleted, you will not pay for the reservation anymore.  

![Capacity Reservation image 6.](./media/capacity-reservation-overview/capacity-reservation-6.jpg)


## Usage and billing 

When a Capacity Reservation is empty, VM usage will be reported for the corresponding VM size and the location. [VM Reserved Instances](https://azure.microsoft.com/pricing/reserved-vm-instances/) can cover some or all of the Capacity Reservation usage even when VMs are not deployed. 

### Example

For example, lets say a Capacity Reservation with quantity reserved 2 has been created. The subscription has access to one matching Reserved VM Instance of the same size. The result is two usage streams for the Capacity Reservation, one of which is covered by the Reserved Instance: 

![Capacity Reservation image 7.](./media/capacity-reservation-overview/capacity-reservation-7.jpg)

In the previous image, a Reserved VM Instance discount is applied to one of the unused instances and the cost for that instance will be zeroed out. For the other instance, PAYG rate will be charged for the VM size reserved.  

When a VM is allocated against the Capacity Reservation, the other VM components such as disks, network, extensions, and any other requested components must also be allocated. In this state, the VM usage will reflect one allocated VM and one unused capacity instance. The Reserved VM Instance will zero out the cost of either the VM or the unused capacity instance. The other charges for disks, networking, and other components associated with the allocated VM will also appear on the bill. 

![Capacity Reservation image 8.](./media/capacity-reservation-overview/capacity-reservation-8.jpg)

In the previous image, the VM Reserved Instance discount is applied to VM 0, which will only be charged for other components such as disk and networking. The other unused instance is being charged at PAYG rate for the VM size reserved.


## Frequently asked questions 

- **What’s the price of on-demand Capacity Reservation?**

    The price of your on-demand Capacity Reservation is same as the price of underlying VM size associated with the reservation. When using Capacity Reservation, you will be charged for the VM size you selected at pay-as-you-go rates, whether the VM has been provisioned or not.  Visit the [Windows](https://azure.microsoft.com/pricing/details/virtual-machines/windows/) and [Linux](https://azure.microsoft.com/pricing/details/virtual-machines/linux/) VM pricing pages for more details.

- **Will I get charged twice, for the cost of on-demand Capacity Reservation and for the actual VM when I finally provision it?**

    No, you will only get charged once for on-demand Capacity Reservation.   

- **Can I apply Reserved Virtual Machine Instance (RI) to on-demand Capacity Reservation to lower my costs?**

    Yes, you can apply existing or future RIs to on-demand capacity reservations and receive RI discounts. Available RIs are applied automatically to Capacity Reservation the same way they are applied to VMs.

- **What is the difference between Reserved Virtual Machine Instance (RI) and on-demand Capacity Reservation?**

    Both RIs and on-demand capacity reservations are applicable to Azure VMs. However, RIs provide discounted reservation rates for your VMs compared to pay-as-you-go rates as a result of a 1-year or 3-year term commitment. Conversely, on-demand capacity reservations do not require a commitment. You can create or cancel a Capacity Reservation at any time. However, no discounts are applied, and you will incur charges at pay-as-you-go rates after your Capacity Reservation has been successfully provisioned. Unlike RIs, which prioritize capacity but do not guarantee it, when you purchase an on-demand Capacity Reservation, Azure sets aside compute capacity for your VM and provides an SLA guarantee.  

- **Which scenarios would benefit the most from on-demand capacity reservations?**

    Typical scenarios include business continuity, disaster recovery, and scale-out of mission-critical applications.  


## Next steps

Create a Capacity Reservation and start reserving Compute capacity in an Azure region or an Availability Zone. 

> [!div class="nextstepaction"]
> [Create a Capacity Reservation](capacity-reservation-create.md)
