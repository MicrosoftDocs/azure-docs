---
title: Capacity Reservation in Azure (preview)
description: Learn how to reserve compute capacity in an Azure region or an Availability Zone with Capacity Reservation.
author: ju-shim
ms.author: vargupt
ms.service: virtual-machines #Required
ms.topic: how-to
ms.date: 07/30/2021
ms.reviewer: cynthn
ms.custom: template-how-to

#This template is for a how-to article. For a published example see xxx.md

---

<!--

Remove all the comments in this template before you sign-off or merge to the 
main branch.
-->

<!-- Heading 1
Required. Use a single #. Start with a verb. Clearly convey the task the user will complete. Should be similar to the title metadata value, but can be up to 100 characters.
-->

# Capacity Reservation in Azure (preview)

On-demand Capacity Reservation enables customers to reserve compute capacity in an Azure region or an Availability Zone for any duration of time. Unlike [Reserved Instances](https://azure.microsoft.com/pricing/reserved-vm-instances/), customers don't have to sign-up for a 1-year or a 3-year term commitment. They can create and delete reservations at any time and have full control over how they want to manage their reservations.  

Once the capacity reservation is created, the capacity is available immediately and is exclusively reserved for the customer until the reservation is deleted.  


> [!IMPORTANT]
> Capacity Reservation is currently in public preview.
> This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


Capacity Reservation has some basic properties that are always defined at the time of creation: 
- **VM size** - Each reservation is for one VM size. For example, `Standard_D2s_v3`. 
- **Location** - Each reservation is for one location (region). If that location has Availability Zones, then the reservation can also specify one of the zones. 
- **Quantity** - Each reservation has a quantity of instances to be reserved. 

To create a Capacity Reservation, these parameters are passed to Azure as a capacity request. If the subscription lacks the required quota or Azure does not have capacity available that meets the specification, the reservation will fail to deploy. Either request more quota or try a different VM size, location, or zone combination. 

Once Azure accepts a reservation request, it is available to be consumed by VMs of matching configurations. In order to consume capacity reservation, the VM will have to specify the reservation as one of its properties. Otherwise, the capacity reservation will remain unused. One benefit of this design is that customers can target only the mission critical workloads to reservations and other non-critical workloads can run without reserved capacity.  

Capacity Reservation also comes with Azure availability SLA for use with virtual machines. The SLA will not be enforced during public preview and will be defined when the feature is generally available. 

### Benefits of Capacity Reservation 

- Once deployed, capacity is reserved for the customer and always available within the scope of applicable SLAs  
- Can be deployed and deleted at any time with no term commitment 
- Can be combined automatically with Reserved Instances to avail term commitments discounts  

### SLA for Capacity Reservation 

The SLA for Capacity Reservation will be defined later when the feature is generally available.  


## Limitations and Restrictions 

- Restricted by quota: Creating capacity reservations requires quota in the same manner as creating like they do for creating virtual machines. 
- Spot VMs and Azure Dedicated Host Nodes are not supported with Capacity Reservation. 
- Some deployment constraints are not supported: 
    - Proximity Placement Group 
    - Update domains 
    - UltraSSD storage  
- Only Av2, B, D, E, & F VM series are supported during public preview. Support for other VM series is in progress and will be announced when available. 
- For the supported VM series during public preview, up to 3 Fault Domains (FDs) will be supported. A deployment with more than 3 FDs will fail to deploy against capacity reservation. 
- Availability Sets are not supported with capacity reservation. 
- The scope for capacity reservation is subscription i.e., only the subscription that created the reservation can use it. This is a temporary limitation and support for sharing reservations across subscriptions will be added later. 
- Reservations are only available to paid Azure customers. Sponsored accounts such as Free Trial and Azure for Students are not eligible to use this feature. 


## Pricing and billing 

Capacity Reservations are priced at the same rate as the underlying VM size. For example, if a customer creates a reservation for 10 quantities of D2s_v3 VM, as soon as the reservation is created, they start getting billed for 10 D2s_v3 VMs irrespective of whether the reservation is being used or not.  

If the customer then deploys a D2s_v3 VM and specifies reservation as its property, the capacity reservation gets used. Once in use, customer pays only for the VM and nothing extra for the capacity reservation. For instance, let’s say a customer deploys 5 D2s_v3 VMs against the aforementioned capacity reservation. In this case, they will see a bill for 5 D2s_v3 VMs and 5 unused capacity reservation, both charged at the same rate as a D2s_v3 VM.    

Both used and unused capacity reservation are eligible for Reserved Instances term commitment discounts. In the above example, if the customer has Reserved Instances for 2 D2s_v3 VM in the same Azure region, the billing for 2 resources (either VM or unused capacity reservation), will be zeroed out and the customer will only pay for rest of the 8 resources i.e., 5 unused capacity reservations and 3 D2s_v3 VMs. In this case, the term commitment discounts could be applied on either the VM or the unused capacity reservation. It shouldn’t matter as both are charged at the same PAYG rate. 


## Working with Capacity Reservation 

Capacity reservation can be created for a specific VM size in an Azure region or an Availability Zone. All reservations are created and managed as part of a Capacity Reservation Group. This allows creation of a group to manage disparate VM sizes in a single multi-tier application. Each reservation is for one VM size and a group can have only one reservation per VM size.  

In order to consume capacity reservation, specify capacity reservation group as one of the VM properties. If the group doesn’t have a matching reservation, Azure will return an error message. 

The quantity reserved for reservation can be adjusted after initial deployment by changing the capacity property. Other changes to capacity reservation, such as VM size or location, are not permitted. The recommended approach is to delete the existing reservation and create a new one with the new requirements. 

Capacity Reservation doesn’t create limits on VM deployments. Azure supports allocating as many VMs as desired against a reservation. Up to the reserved quantity, quota checks are omitted, and the capacity SLA is in effect. Allocating more VMs against the reservation is subject to quota checks and Azure fulfilling the additional capacity. Once deployed, these additional VM instances can cause the quantity of VMs allocated against the reservation to exceed the reserved quantity. This state is called overallocating. Please click here for more details on overallocating. 

### Capacity Reservation lifecycle

When a reservation is created, Azure sets aside the requested number of capacity instances in the specified location: 

<!-- image here --> 

Track the state of the overall reservation through the following properties:  
- `capacity` = Total quantity of instances reserved by the customer 
- `virtualMachinesAllocated` = List of VMs allocated against the capacity reservation and therefore count towards consuming the capacity. These VMs are either *Running* or *Stopped* (*Allocated*), or may be in a transitional state such as *Starting* or *Stopping*. This list doesn’t include the VMs that are in deallocated state, referred to as *Stopped* (*deallocated*). 
- `virtualMachinesAssociated` = List of VMs associated with the capacity reservation. This list has all the VMs that have been configured to use the reservation, including the ones that are in deallocated state.  

The above example will start with `capacity` as 2 and length of `virutalMachinesAllocated` and `virtualMachinesAssociated` as 0.  

When a VM is subsequently allocated against the Capacity Reservation, it will logically consume one of the reserved capacity instances: 

<!-- image here --> 

The status of the Capacity Reservation will now show `capacity` as 2 and length of `virutalMachinesAllocated` and `virtualMachinesAssociated` as 1.  

Allocations against the Capacity Reservation will succeed as along as the VMs have matching properties and there is at least one empty `capacity` instance.  

Using our example, when a third VM is allocated against the Capacity Reservation, the reservation enters the [overallocated]() state. This third VM will require unused quota and additional capacity fulfillment from Azure. Once the third VM is allocated, the Capacity Reservation now looks like this: 

<!-- image here --> 

The `capacity` is 2 and the length of `virutalMachinesAllocated` and `virtualMachinesAssociated` is 3. 

Now suppose the application scales down to the minimum of two VMs. Since VM 0 needs an update, that VM is chosen for deallocation. The reservation automatically shifts to this state: 

<!-- image here --> 

The `capacity` and the length of `virtualMachinesAllocated` are both 2. However, the length for `virtualMachinesAssociated` is still 3 as VM 0, though deallocated, is still associated with the capacity reservation.  

The Capacity Reservation will exist until explicitly deleted. To delete Capacity Reservation, the first step is to dissociate all the VMs in the `virtualMachinesAssociated` property. Once this is done, the Capacity Reservation should look like this: 

<!-- image here --> 

The status of the Capacity Reservation will now show `capacity` as 2 and length of `virtualMachinesAssociated` and `virtualMachinesAllocated` as 0. From this state, the Capacity Reservation can be deleted. Once deleted, customers will not pay for the reservation anymore.  

### Usage and Billing 

When a Capacity Reservation is empty, VM usage will be reported for the corresponding VM size and the location. [VM Reserved Instances](https://azure.microsoft.com/pricing/reserved-vm-instances/) can cover some or all of the Capacity Reservation usage even when VMs are not deployed.  

> [!IMPORTANT]
> Capacity Reservations are created and managed using the Capacity Reservation APIs on Microsoft.Compute provider. Capacity Reservations are the only way to obtain an availability SLA for VM capacity. Like Virtual Machines, these objects can be created and deleted as needed; no minimum term is required. By default, they will incur charges equivalent to the VM size reserved. 
> VM Reserved Instances are different; they primarily offer the benefit of a commitment-based discount that can be applied for both Virtual Machines and Capacity Reservations. The VM Reserved Instances are created and managed on Microsoft.Capacity provider. 
> Depending on the configuration choice, VM Reserved Instances can offer “capacity priority” for failed allocations. This can be useful when Azure encounters a constrained capacity situation. However, the VM Reserved Instance “capacity priority” option does not carry any availability SLA. 
> When used with Capacity Reservations, Microsoft recommends using the “Size Flexible” configuration for VM Reserved Instances so that they can cover any of the sizes within the VM series for which the Reserved Instances are bought. 

Continuing with our example, a Capacity Reservation with quantity reserved 2 has been created. The subscription has access to one matching Reserved VM Instance of the same size. The result is two usage streams for the Capacity Reservation, one of which is covered by the Reserved Instance: 

<!-- image here -->

In the above picture, VM Reserved Instance discount is applied to one of the unused instances and the cost for that instance will be zeroed out. For the other instance, PAYG rate will be charged for the VM size reserved.  

When a VM is allocated against the Capacity Reservation, the additional VM components (disks, network, extensions, and any other requested components) must also be allocated. In this state, the VM usage will reflect one allocated VM and one unused capacity instance. The Reserved VM Instance will zero out the cost of either the VM or the unused capacity instance. The other charges for disks, networking etc. associated with the allocated VM will also appear on the bill. Here is an example: 

<!-- image here -->

As show in the picture above, VM Reserved Instance discount is applied to VM 0 and for that VM, the customer is only being charged for other components such as disk, networking etc. The other unused instance is being charged at PAYG rate for the VM size reserved.


## Prerequisites

<!--Optional. If you need prerequisites, make them your first H2 in a how-to guide. 
Use clear and unambiguous language and use a list format.
-->
 
Before you get started, make sure you have the following:

- Prereq 
- Prereq

## Create a Capacity Reservation

Capacity reservations are always created as part of a Capacity Reservation Group. Therefore, the first step is to create a group, if a suitable one doesn’t exist already, and then create reservations. Once successfully created, reservations are immediately available for use with virtual machines. The capacity is reserved for the customers as long as the reservation is not deleted.     

A well-formed request for capacity reservation group should always succeed as it does not reserve any capacity. It just acts as a container for reservations. However, request for reservation could fail if the customer doesn’t have the required quota for the VM series and/or if Azure doesn’t have enough capacity to fulfill the request. Either request more quota or try a different VM size/location/zone combination. 

A Capacity Reservation creation succeeds or fails in its entirety. For a request to reserve 10 instances, success is returned only if all 10 could be allocated. Otherwise, the capacity reservation creation will fail. 

The Capacity Reservation must meet the following rules: 
- The location parameter must match the location property for the parent Capacity Reservation Group. A mismatch will result in an error. 
- The VM size must be available in the target region. Otherwise, the reservation creation will fail. 
- The subscription must have sufficient approved quota equal or more than the quantity of VMs being reserved for the VM series and for the region overall. If needed, request additional quota as described [here]().

> [!IMPORTANT]
> Each Capacity Reservation Group can have exactly one reservation for a given VM size. For example, only one Capacity Reservation can be created for the VM size Standard_D2s_v3. Attempt to create a second reservation for Standard_D2s_v3 in the same Capacity Reservation Group will result into an error. However, another reservation can be created in the same group for other VM sizes such Standard_D4s_v3, Standard_D8s_v3 and so on. 
> For a Group that supports zones, each Reservation type is defined by the combination of VM size and Zone. Thus, one Capacity Reservation for Standard_D2s_v3 in Zone 1, another Capacity Reservation for Standard_D2s_v3 in Zone 2, and a third in Zone 3 is supported. 

### [API](#tab/api)

1. Create a Capacity Reservation Group 

    To create a capacity reservation group, construct the following PUT request on Microsoft.Compute provider: 
    
    ```rest
    PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroups/{CapacityReservationGroupName}&api-version=2021-07-01
    ``` 
    
    In the request body, include the following: 
    
    ```json
    { 
      "location":"eastus",
    } 
    ```
    
    This group is created to contain reservations for the US East location. 
    
    In this example, the Group will support only regional reservations because zones were not specified at the time of creation. In order to create a zonal group, pass an additional parameter *zones* in the request body as shown below: 
    
    ```json
    { 
      "location":"eastus",
      "zones": ["1", "2", "3"] 
    } 
    ```
 
1. Create a Capacity Reservation 

    To create a reservation, construct the following PUT request on Microsoft.Compute provider: 
    
    ```rest
    PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroups/{CapacityReservationGroupName}/CapacityReservations/{CapacityReservationName}?api-version=2021-07-01 
    ```
    
    In the request body, include the following: 
    
    ```json
    { 
      "location": "eastus", 
      "sku": { 
        "name": "Standard_D2s_v3” 
        "capacity": 5, 
      }, 
     "tags": { 
            "environment": "testing" 
    } 
    ```
    
    The above request creates a reservation in the East US location for 5 quantities of D2s_v3 VM size. 

--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->

### [Portal](#tab/portal)

<!-- insert portal steps here, no pictures if it's straightforward --> 

1. Open the [portal](https://portal.azure.com).
1. In the search bar, type **<name_of_feature>**.
1. Select **<name_of_feature>**.
1. In the left menu under **Settings**, select **<something>**.
1. In the **<something>** page, select **<something>**.

--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->

### [ARM template](#tab/arm)

An ARM template is a JavaScript Object Notation (JSON) file that defines the infrastructure and configuration for your project. The template uses declarative syntax. In declarative syntax, you describe your intended deployment without writing the sequence of programming commands to create the deployment. 

ARM templates let you deploy groups of related resources. In a single template, you can create capacity reservation group and capacity reservations. Customers can deploy templates through the Azure portal, Azure CLI, or Azure PowerShell, or from continuous integration / continuous delivery (CI/CD) pipelines. 

If your environment meets the prerequisites and you're familiar with using ARM templates, select the Deploy to Azure button. The template will open in the Azure portal. 

<!-- add “Deploy to Azure” button (image) here that links to template -->

--- 
<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->

## Check on your Capacity Reservation 

Once successfully created, the Capacity Reservation is immediately available for use with Virtual Machines: 

```rest
GET  
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroups/{CapacityReservationGroupName}/capacityReservations/{capacityReservationName}?api-version=2021-07-01 
```
 
```json
{ 
    "name": "<CapacityReservationName>", 
    "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/{CapacityReservationGroupName}/capacityReservations/{CapacityReservationName}", 
    "type": "Microsoft.Compute/capacityReservationGroups/capacityReservations", 
    "location": "eastus", 
    "tags": { 
        "environment": "testing" 
    }, 
    "sku": { 
        "name": "Standard_D2s_v3", 
        "capacity": 5 
    }, 
    "properties": { 
        "reservationId": "<reservationId>", 
         "provisioningTime": "<provisioningTime>", 
         "provisioningState": "Updating" 
    } 
} 
```


## Overallocating Capacity Reservation

Azure permits association of additional VMs beyond the reserved count of a Capacity Reservation in order to facilitate burst and other scale out scenarios, without the overhead of managing around the limits of reserved capacity. The only difference is that the count of VMs beyond the quantity reserved does not receive the capacity availability SLA benefit. As long as Azure has available capacity that meets the virtual machine requirements, the additional allocations will succeed. 

The Instance View of a Capacity Reservation Group provides a snapshot of utilization for each member Capacity Reservation. We can use the Instance View to see how overallocation works. 

Assume we created a Capacity Reservation Group (`myCapacityReservationGroup`), a member Capacity Reservation (`myCapacityReservation`), and a virtual machine (*myVM1*) that is associated to the group. Please click [here]() for details on how to create a group and a member capacity reservation and [here]() for details on how to create a virtual machine and associate it to a group.

The Instance View for Capacity Reservation Group will look like this: 

```rest
GET 
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/CapacityReservationGroups/myCapacityReservationGroup? $expand=instanceview&api-version=2021-07-01
```

```json
{ 
    "name": "myCapacityReservationGroup", 
    "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/myCapacityReservationGroup", 
    "type": "Microsoft.Compute/capacityReservationGroups", 
    "location": "eastus", 
    "properties": { 
        "capacityReservations": [ 
            { 
                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/MYCAPACITYRESERVATIONGROUP/capacityReservations/MYCAPACITYRESERVATION" 
            } 
        ], 
        "virtualMachinesAssociated": [ 
            { 
                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/myVM1" 
            } 
        ], 
        "instanceView": { 
            "capacityReservations": [ 
                { 
                    "name": "myCapacityReservation", 
"utilizationInfo": { 
                        "virtualMachinesAllocated": [ 
                            { 
                                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/myVM1" 
                            } 
                        ] 
                    }, 
                    "statuses": [ 
                        { 
                            "code": "ProvisioningState/succeeded", 
                            "level": "Info", 
                            "displayStatus": "Provisioning succeeded", 
                            "time": "<time>" 
                        } 
                    ] 
                } 
            ] 
        } 
    } 
} 
```

Now let’s say we create another virtual machine (*myVM2*) and associate it with the above Capacity Reservation Group. 

The Instance View for Capacity Reservation Group will now look like this: 

```json
{ 
    "name": "myCapacityReservationGroup", 
    "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/myCapacityReservationGroup", 
    "type": "Microsoft.Compute/capacityReservationGroups", 
    "location": "eastus", 
    "properties": { 
        "capacityReservations": [ 
            { 
                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/MYCAPACITYRESERVATIONGROUP/capacityReservations/MYCAPACITYRESERVATION" 
            } 
        ], 
        "virtualMachinesAssociated": [ 
            { 
                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/myVM1" 
            }, 
 { 
                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/myVM2" 
            } 
        ], 
        "instanceView": { 
            "capacityReservations": [ 
                { 
                    "name": "myCapacityReservation", 
"utilizationInfo": { 
                        "virtualMachinesAllocated": [ 
                            { 
                                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/myVM1" 
                            }, 
{ 
                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/myVM2" 
            } 
                        ] 
                    }, 
                    "statuses": [ 
                        { 
                            "code": "ProvisioningState/succeeded", 
                            "level": "Info", 
                            "displayStatus": "Provisioning succeeded", 
                            "time": "<time>" 
                        } 
                    ] 
                } 
            ] 
        } 
    } 
} 
``` 

Notice that the length of `virtualMachinesAllocated` (2) is greater than `capacity` (1). This valid state is referred to as *overallocated*. Azure will not stop allocations just because a Capacity Reservation is fully consumed. Auto-scale rules, temporary scale out, and related requirements will simply work even beyond the quantity of reserved capacity so long as Azure has additional available capacity.  

There are three valid states for a given Capacity Reservations: 

| State  | Status  | Considerations  |
|---|---|---|
| Reserved capacity available  | Length of `virtualMachinesAllocated` < `capacity`  | Is all the reserved capacity needed? Optionally reduce the capacity to reduce costs.  |
| Reservation consumed  | Length of `virtualMachinesAllocated` == `capacity`  | Additional VMs will not receive the capacity SLA unless some existing VMs are deallocated. Optionally try to increase the capacity so additional planned VMs will receive an SLA.  |
| Reservation overallocated  | Length of `virtualMachinesAllocated` > `capacity`  | Additional VMs will not receive the capacity SLA. Also, the quantity of VMs (Length of `virtualMachinesAllocated` – `capacity`) will not receive a capacity SLA if deallocated. Optionally increase the capacity to add capacity SLA to more of the existing VMs.  |

Another important property of Capacity Reservation is that all VMs are treated equally. Resuming our example, *myVM1* was created first and *myVM2* was added second. At some point later, we decide *myVM1* is no longer needed. We simply delete *myVM1*: 

```rest
DELETE 
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/myVM1?api-version=2021-07-01
```

The `myCapacityReservation` object state will automatically change to reflect the new state of consumption. The `myCapacityReservationGroup` Instance View will now return this state: 

```json
{ 
    "name": "myCapacityReservationGroup", 
    "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/myCapacityReservationGroup", 
    "type": "Microsoft.Compute/capacityReservationGroups", 
    "location": "eastus", 
    "properties": { 
        "capacityReservations": [ 
            { 
                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/capacityReservationGroups/MYCAPACITYRESERVATIONGROUP/capacityReservations/MYCAPACITYRESERVATION" 
            } 
        ], 
        "virtualMachinesAssociated": [ 
            { 
                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/myVM2" 
            } 
        ], 
        "instanceView": { 
            "capacityReservations": [ 
                { 
                    "name": "myCapacityReservation", 
"utilizationInfo": { 
                        "virtualMachinesAllocated": [ 
                            { 
                                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/myVM2" 
                            } 
                        ] 
                    }, 
                    "statuses": [ 
                        { 
                            "code": "ProvisioningState/succeeded", 
                            "level": "Info", 
                            "displayStatus": "Provisioning succeeded", 
                            "time": "<time>" 
                        } 
                    ] 
                } 
            ] 
        } 
    } 
}
```

Customers do not have to manage which VMs are “in” or “out” of the reserved space. All allocated Standard_D2s_v3 VMs with the `capacityReservationGroup` property set to `myCapacityReservationGroup` count towards the `virtualMachinesAllocated` property of `myCapacityReservation`. The virtual machines can be created and deleted in any order and Azure will manage the Capacity Reservation state automatically. 

There is no support within a reservation for designating a set of VMs that are protected and a set that are not. To segment VMs in that manner, allocate the less important VMs outside the reservation or to a different reservation group. 


## Modifying Capacity Reservation 

1. Updating the number of instances reserved 

<!-- API, Portal tabs -->

1. Resizing Virtual Machine associated with a Capacity Reservation Group

<!-- API, Portal tabs -->

1. Deleting Capacity Reservation Group and Capacity Reservation 

<!-- API, Portal tabs -->


## Associate a new VM to a Capacity Reservation Group

To associate a new VM to the Capacity Reservation Group, the group must be explicitly referenced as a property of the virtual machine. This protects the matching reservation in the group from accidental consumption by less critical applications and/or workloads that are not intended to use it.

<!-- API, Portal, ARM tabs -->


## Associate an existing VM to Capacity Reservation Group 

<!-- WORK IN PROGRESS, ASK VARUN FOR AN UPDATE -->

## Remove association of a VM to Capacity Reservation Group

<!-- intro -->

### Option 1

<!-- tabs -->

### Option 2

<!-- tabs --> 

## Associate a new VMSS in Uniform Orchestration Mode to Capacity Reservation Group

<!-- This feels like it should be its own sub-article and should not include explanations on what orch mode is, just link to the right article with that information... -->

**NOTE:** Move all VMSS instructions into its own article. This is too much info for an overview. 


## Next steps

> [!div class="nextstepaction"]
> [Learn about adding code to articles](availability.md)