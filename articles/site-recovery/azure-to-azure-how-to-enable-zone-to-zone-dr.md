---
title: Enable Zone to Zone Disaster Recovery for Azure Virtual Machines
description: This article describes when and how to use Zone to Zone Disaster Recovery for Azure virtual machines.
author: sideeksh
manager: gaggupta
ms.service: site-recovery
ms.topic: article
ms.date: 04/28/2020
ms.author: sideeksh

---

# Enable Zone to Zone Disaster Recovery for Azure Virtual Machines

This article describes how to replicate, failover, and failback Azure virtual machines from one Availability Zone to another within the same Azure region.

>[!NOTE]
>
> 1. Site Recovery currently does not support Recovery Plans for Zone to Zone Disaster Recovery. This support is coming soon.
> 2. Support for Zone to Zone disaster recovery is currently limited to two regions: Southeast Asia and UK South. Support for other regions that have zones is coming soon. 

Site Recovery service contributes to your business continuity and disaster recovery (BCDR) strategy by keeping your business apps up and running, during planned and unplanned outages. Site Recovery manages and orchestrates disaster recovery of on-premises machines and Azure virtual machines, including replication, failover, and failback. In the case of Azure virtual machines, Site Recovery helps with replication, failover, and failback between two Azure regions. It is the recommended Disaster Recovery option to keep your applications up and running in the event of regional outages. It also helps address the compliance needs of your organization when it comes to resiliency against different types of failures.

Availability Zones are unique physical locations within an Azure region. Each zone is made up of one or more datacenters equipped with independent power, cooling, and networking. To ensure resiliency, there’s a minimum of three separate zones in all enabled regions. Each zone has one or more datacenters. If you deploy two or more virtual machines in a single tier of your application into two or more Availability Zones, it ensures that during either a planned or unplanned maintenance event, at least one virtual machine is available and meets the 99.99% Azure SLA.

Availability Zones are a strong High Availability solution. They may be too close to each other to serve as a Disaster Recovery solution in case of natural disaster.

However, in some cases of a datacenter or zonal outage, Availability Zones may be leveraged for Disaster Recovery as well:

1. Many customers who had a metro Disaster Recovery strategy while hosting applications on premise sometimes look to mimic this strategy once they migrate applications over to Azure. These customers are aware of and acknowledge the fact that metro Disaster Recovery strategy may not work in case of a large-scale physical disaster and accept this risk. For such customers, Zone to Zone Disaster Recovery can be used as a Disaster Recovery option.

2. Many other customers have complicated networking infrastructure and do not wish to recreate it in a secondary region due to the associated cost and complexity. Zone to Zone Disaster Recovery reduces complexity as it leverages redundant networking concepts across Availability Zones making configuration much simpler. Such customers prefer simplicity and can also use Availability Zones for Disaster Recovery.

3. In some regions that do not have a paired region within the same legal jurisdiction (e.g. Southeast Asia), Zone to Zone Disaster Recovery can serve as the de-facto Disaster Recovery solution as it helps ensure legal compliance, since your applications and data do not cross national boundaries. 

4. If you deployed applications in a region before Availability Zones were GA in that region, you may have all your resources concentrated in one Zone (e.g. Zone 1). If the cost of re-architecting these applications is too high and you are unable to spread out virtual machines across zones to achieve High Availability, you may in some cases use Zone to Zone Disaster Recovery to add to your application resilience. Please note that this may not be the case if these applications are already protected using Site Recovery Azure to Azure.

5. Zone to Zone Disaster Recovery implies replication of data across shorter distances when compared to Azure to Azure Disaster Recovery and therefore, you may see lower latency and consequently lower RPO.

While these are strong advantages, there is a possibility that Zone to Zone Disaster Recovery may fall short of resilience requirements in the event of a regional outage due to a natural disaster or otherwise, as all zones within a region may suffer from an outage.

## Networking for Zone to Zone Disaster Recovery

As mentioned above, Zone to Zone Disaster Recovery reduces complexity as it leverages redundant networking concepts across Availability Zones making configuration much simpler. The behavior of networking components in the Zone to Zone Disaster Recovery scenario is outlined below:

1. Virtual Network: You may use the same virtual network as the source network for actual failovers. You must use a different virtual network to the source virtual network for test failovers.

2. Subnet: Failover into the same subnet is supported.

3. Private IP address: If you are using static IP addresses, you can use the same IPs in the target zone if you choose to configure them in such a manner.

4. Accelerated Networking: Similar to Azure to Azure Disaster Recovery, you may enable Accelerated Networking if the VM SKU supports it.

5. Public IP address: You can attach a previously created standard public IP address in the same region to the target VM. Basic public IP addresses do not support Availability Zone related scenarios.

6. Load balancer: Standard load balancer is a regional resource and therefore the target VM can be attached to the backend pool of the same load balancer. No new load balancer needs to be created. You can learn more here.

7. Network Security Group: You may use the same network security groups as those applied to the source VM.

## Interoperability with Azure platform features

• IaaS V1/V2: Classic VMs are not supported. ARM VMs are supported.

• ADE V1/V2: Both ADE v1 (dual pass, with AAD) and ADE v2 (single pass, without AAD) are supported.

• Managed/Unmanaged Disk: Both are supported.

• Customer Managed Keys: Supported.

• Proximity Placement Groups: Not yet supported.

• Backup Interoperability: File level backup and restore is supported. Disk and VM level backup and restores are not supported.

• Hot Add / Remove: Disks can be added after enabling Zone to Zone replication. Removal of disks after enabling Zone to Zone replication is not supported.

## Setup Site Recovery Zone to Zone Disaster Recovery

### Login

Login to the Azure portal.

### Enable replication for the zonal Azure virtual machine

1. On the Azure portal menu, select Virtual machines, or search for and select Virtual machines on any page. Select the VM you want to replicate. For zone to zone disaster recovery, this VM must already be in an availability zone.

2. In Operations, select Disaster recovery.

3. As shown below, in the Basics tab, select ‘Yes’ for ‘Disaster Recovery between Availability Zones?’

4. If you accept all defaults, click ‘Review + Start replication’ followed by ‘Start replication’.

5. If you want to make changes to the replication settings, click on ‘Next : Advanced settings’.

6. Change the settings away from default wherever appropriate. For users of Azure to Azure DR, this is a familiar portal blade. More details on the options presented on this blade can be found [here](https://docs.microsoft.com/en-us/azure/site-recovery/azure-to-azure-tutorial-enable-replication)

    ![Advanced Settings page](./media/azure-to-azure-how-to-enable-zone-to-zone-dr/zone-to-zone-advanced-settings-blade.png)

7. Click on ‘Next: Review + Start replication’ and then ‘Start replication’.

## FAQs

1. How does pricing work for Zone to Zone Disaster Recovery?
Pricing for Zone to Zone Disaster Recovery is the same as that for Azure to Azure Disaster Recovery. You can find more details on the pricing page [here](https://azure.microsoft.com/en-in/pricing/details/site-recovery/) and [here](https://azure.microsoft.com/en-in/blog/know-exactly-how-much-it-will-cost-for-enabling-dr-to-your-azure-vm/).

2. What is the SLA for RTO and RPO?
The RTO SLA is the same as that for Site Recovery overall. We promise RTO <= 2 hours. There is no defined SLA for RPO.

3. Is capacity guaranteed in the secondary zone?
The Site Recovery team and Azure capacity management team plan for sufficient infrastructure capacity. When you start a failover, the teams also help ensure VM instances that are protected by Site Recovery will deploy to the target zone.

4. Which operating systems are supported?
Zone to Zone DR supports the same operating systems as Azure to Azure DR. Please refer to the support matrix [here](https://docs.microsoft.com/en-us/azure/site-recovery/azure-to-azure-support-matrix).

## Next steps

The steps that need to be followed to run a DR drill, fail over, re-protect, and failback are the same as those to be followed in the Azure to Azure DR scenario.

To perform a DR drill, please follow the steps outlined [here](https://docs.microsoft.com/en-us/azure/site-recovery/azure-to-azure-tutorial-dr-drill).

To perform a fail over and re-protect VMs in the secondary zone, please follow the steps outlined [here](https://docs.microsoft.com/en-us/azure/site-recovery/azure-to-azure-tutorial-failover-failback).

To failback to the primary zone, please follow the steps outlined [here](https://docs.microsoft.com/en-us/azure/site-recovery/azure-to-azure-tutorial-failback).