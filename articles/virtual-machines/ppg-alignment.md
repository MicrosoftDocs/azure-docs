---
 title: Planned maintenance and placement group alignment
 description: Learn more about how planned maintenance can affect the alignment of resources in a proximity placement group.
 services: virtual-machines
 author: cynthn
 ms.service: virtual-machines
 ms.topic: conceptual
 ms.date: 09/17/2020
 ms.author: zivr
 ms.custom: 
---

# Planned maintenance and Proximity Placement Groups

Planned maintenance events, like hardware decommissioning at an Azure datacenter, could potentially affect the alignment of resources in proximity placement groups. Resources may be moved to a different data center, disrupting the collocation and latency expectations associated with the proximity placement group.

## Check the alignment status

You can do the following to check the alignment status of your proximity placement groups.


- Proximity placement group colocation status can be viewed using the portal, CLI, and PowerShell.

    -   When using PowerShell, colocation status can be obtained using Get-AzProximityPlacementGroup cmdlet by including the optional parameter ‘-ColocationStatus`.

    -   When using CLI, colocation status can be obtained using `az ppg show` by including the optional parameter ‘--include-colocation-status`.

- For each proximity placement group, a **colocation status** property
    provides the current alignment status summary of the grouped resources. 

    - **Aligned**: Resource is within the same latency envelop of the proximity placement group.

    - **Unknown**: at least one of the VM resources are deallocated. Once starting them back successfully, the status should go back to **Aligned**.

    - **Not aligned**: at least one VM resource is not aligned with the proximity placement group. The specific resources which are not aligned will also be called out separately in the membership section

- For Availability Sets, you can see information about alignment of individual VMs in the the Availability Set Overview page.

- For scale sets, information about alignment of individual instances can be seen in the **Instances** tab of the **Overview** page for the scale set. 


## Re-align resources 

If a proximity placement group is `Not Aligned`, you can stop\deallocate and then restart the affected resources. If the VM is in an availability set or a scale set, all VMs in the availability set or scale set must be stopped\deallocated first before restarting them.

If there is an allocation failure due to deployment constraints, you may have to stop\deallocate all resources in the affected proximity placement group (including the aligned resources) first and then restart them to restore alignment.


## Next steps

For a general overview, see the [proximity placement group](co-location.md#proximity-placement-groups) overview.
