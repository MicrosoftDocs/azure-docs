---
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/17/2025
 ms.author: anaharris
 ms.custom: include file
---

When you create a zone-redundant App Service plan, Azure distributes the plan's instances across availability zones in the region. This distribution ensures that your apps remain available even if one zone experiences an outage.

Instance distribution in a zone-redundant deployment follows specific rules. These rules apply as the app scales in and out:

- **Minimum instances:** Your App Service plan must have a minimum of two instances for zone redundancy.

- **Maximum availability zones supported by your plan:** Azure determines the number of availability zones that your plan can use, which is referred to as *maximumNumberOfZones*. To view the number of availability zones that your specific plan can use, see [Check zone redundancy support for an App Service plan](../../../app-service/configure-zone-redundancy.md#check-for-zone-redundancy-support-on-an-app-service-plan).

- **Instance distribution:** When zone redundancy is enabled, Azure distributes plan instances across multiple availability zones automatically. The distribution is based on the following rules:

    - If the number of instances exceeds *maximumNumberOfZones* and divides evenly, Azure distributes the instances evenly across zones.

    - If the number of instances doesn't divide evenly, Azure distributes the remaining instances across the remaining zones.
    - When the App Service platform allocates instances for a zone-redundant App Service plan, it uses best-effort zone balancing that the underlying Azure virtual machine scale sets provide. A plan is balanced if each zone has the same number of VMs or differs by one instance from all other zones. For more information, see [Zone balancing](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones#zone-balancing).

- **Physical zone placement:** You can view the [physical availability zone](/azure/reliability/availability-zones-overview#physical-and-logical-availability-zones) used for each of your App Service plan instances. For more information, see [View physical zones for an App Service plan](../../../app-service/configure-zone-redundancy.md#check-for-zone-redundancy-support-on-an-app-service-plan).
