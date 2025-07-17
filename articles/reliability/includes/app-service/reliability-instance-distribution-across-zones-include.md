---
 title: include file
 description: include file
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/17/2025
 ms.author: anaharris
 ms.custom: include file
---

When you create a zone-redundant App Service plan on **Premium v2-v4 tier**, the instances of your App Service plan are distributed across the availability zones in the region. The distribution is done automatically by Azure to ensure that your apps remain available even if one zone experiences an outage.

Instance distribution in a zone-redundant deployment follows specific rules. These rules remain applicable as the app scales in and scales out:

- **Minimum instances:** Your App Service plan must have a minimum of two instances for zone redundancy.

- **Maximum availability zones supported by your plan:** Azure determines the number of availability zones that your plan can use, which is referred to as *maximumNumberOfZones*. To view the number of availability zones that your specific plan is able to use, see [Zone redundancy support for an App Service plan](/azure/app-service/configure-zone-redundancy#check-for-zone-redundancy-support-for-an-app-service-plan).

- **Instance distribution:** When zone redundancy is enabled, plan instances are distributed across multiple availability zones automatically. The distribution is based on the following rules:

    - The instances distribute evenly if you specify a capacity (number of instances) greater than *maximumNumberOfZones* and the number of instances is divisible by *maximumNumberOfZones*.
    - Any remaining instances are distributed across the remaining zones.
    - When the App Service platform allocates instances for a zone-redundant App Service plan, it uses best-effort zone balancing that the underlying Azure virtual machine scale sets provide. An App Service plan is balanced if each zone has the same number of VMs or differs by plus one VM or minus one VM from all other zones. For more information, see [Zone balancing](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones#zone-balancing).

- **Physical zone placement:** You can view the [physical availability zone](availability-zones-overview.md#physical-and-logical-availability-zones) that's used for each of your App Service plan instances. For more information, see [View physical zones for an App Service plan](/azure/app-service/configure-zone-redundancy#view-physical-zones-for-an-app-service-plan).