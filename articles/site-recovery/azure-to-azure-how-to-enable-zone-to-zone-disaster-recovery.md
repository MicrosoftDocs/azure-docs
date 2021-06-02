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

# Enable Azure VM disaster recovery between availability zones

This article describes how to replicate, failover, and failback Azure virtual machines from one Availability Zone to another, within the same Azure region.

>[!NOTE]
>
>- Support for Zone to Zone disaster recovery is currently limited to the following regions: Southeast Asia, Japan East, Australia East, JIO India West, UK South, West Europe, North Europe, Central US, East US, East US 2 and West US 2.  
>- Site Recovery does not move or store customer data out of the region in which it is deployed when the customer is using Zone to Zone Disaster Recovery. Customers may select a Recovery Services Vault from a different region if they so choose. The Recovery Services Vault contains metadata but no actual customer data.

Site Recovery service contributes to your business continuity and disaster recovery strategy by keeping your business apps up and running, during planned and unplanned outages. It is the recommended Disaster Recovery option to keep your applications up and running if there are regional outages.

Availability Zones are unique physical locations within an Azure region. Each zone has one or more datacenters. 

If you want to move VMs to an availability zone in a different region, [review this article](../resource-mover/move-region-availability-zone.md).

## Using Availability Zones for Disaster Recovery 

Typically, Availability Zones are used to deploy VMs in a High Availability configuration. They may be too close to each other to serve as a Disaster Recovery solution in case of natural disaster.

However, in some scenarios, Availability Zones can be leveraged for Disaster Recovery:

- Many customers who had a metro Disaster Recovery strategy while hosting applications on premise sometimes look to mimic this strategy once they migrate applications over to Azure. These customers acknowledge the fact that metro Disaster Recovery strategy may not work in case of a large-scale physical disaster and accept this risk. For such customers, Zone to Zone Disaster Recovery can be used as a Disaster Recovery option.

- Many other customers have complicated networking infrastructure and do not wish to recreate it in a secondary region due to the associated cost and complexity. Zone to Zone Disaster Recovery reduces complexity as it leverages redundant networking concepts across Availability Zones making configuration much simpler. Such customers prefer simplicity and can also use Availability Zones for Disaster Recovery.

- In some regions that do not have a paired region within the same legal jurisdiction (for example, Southeast Asia), Zone to Zone Disaster Recovery can serve as the de-facto Disaster Recovery solution as it helps ensure legal compliance, since your applications and data do not move across national boundaries. 

- Zone to Zone Disaster Recovery implies replication of data across shorter distances when compared with Azure to Azure Disaster Recovery and therefore, you may see lower latency and consequently lower RPO.

While these are strong advantages, there is a possibility that Zone to Zone Disaster Recovery may fall short of resilience requirements in the event of a region-wide natural disaster.

## Networking for Zone to Zone Disaster Recovery

As mentioned above, Zone to Zone Disaster Recovery reduces complexity as it leverages redundant networking concepts across Availability Zones making configuration much simpler. The behavior of networking components in the Zone to Zone Disaster Recovery scenario is outlined below: 

- Virtual Network: You may use the same virtual network as the source network for actual failovers. Use a different virtual network to the source virtual network for test failovers.

- Subnet: Failover into the same subnet is supported.

- Private IP address: If you are using static IP addresses, you can use the same IPs in the target zone if you choose to configure them in such a manner.

- Accelerated Networking: Similar to Azure to Azure Disaster Recovery, you may enable Accelerated Networking if the VM SKU supports it.

- Public IP address: You can attach a previously created standard public IP address in the same region to the target VM. Basic public IP addresses do not support Availability Zone related scenarios.

- Load balancer: Standard load balancer is a regional resource and therefore the target VM can be attached to the backend pool of the same load balancer. A new load balancer is not required.

- Network Security Group: You may use the same network security groups as applied to the source VM.

## Pre-requisites

Before deploying Zone to Zone Disaster Recovery for your VMs, it is important to ensure that other features enabled on the VM are interoperable with zone to zone disaster recovery.

|Feature  | Support statement  |
|---------|---------|
|Classic VMs   |     Not supported    |
|ARM VMs    |    Supported    |
|Azure Disk Encryption v1 (dual pass, with Azure Active Directory (Azure AD))     |     Supported	|
|Azure Disk Encryption v2 (single pass, without Azure AD)    |    Supported    |
|Unmanaged disks    |    Not supported    |
|Managed disks    |    Supported    |
|Customer-managed keys    |    Supported    |
|Proximity placement groups    |    Supported    |
|Backup interoperability    |    File level backup and restore are supported. Disk and VM level backup and restore and not supported.    |
|Hot add/remove    |    Disks can be added after enabling zone to zone replication. Removal of disks after enabling zone to zone replication is not supported.    |	

## Set up Site Recovery Zone to Zone Disaster Recovery

### Log in

Log in to the Azure portal.

### Enable replication for the zonal Azure virtual machine

1. On the Azure portal menu, select Virtual machines, or search for and select Virtual machines on any page. Select the VM you want to replicate. For zone to zone disaster recovery, this VM must already be in an availability zone.

2. In Operations, select Disaster recovery.

3. As shown below, in the Basics tab, select ‘Yes’ for ‘Disaster Recovery between Availability Zones?’

    ![Basic Settings page](./media/azure-to-azure-how-to-enable-zone-to-zone-disaster-recovery/zonal-disaster-recovery-basic-settings-blade.png)

4. If you accept all defaults, click ‘Review + Start replication’ followed by ‘Start replication’.

5. If you want to make changes to the replication settings, click on ‘Next: Advanced settings’.

6. Change the settings away from default wherever appropriate. For users of Azure to Azure Disaster Recovery, this page might seem familiar. More details on the options presented on this blade can be found [here](./azure-to-azure-tutorial-enable-replication.md)

    ![Advanced Settings page](./media/azure-to-azure-how-to-enable-zone-to-zone-disaster-recovery/zonal-disaster-recovery-advanced-settings-blade.png)

7. Click on ‘Next: Review + Start replication’ and then ‘Start replication’.

## FAQs

**1. How does pricing work for Zone to Zone Disaster Recovery?**
Pricing for Zone to Zone Disaster Recovery is identical to the pricing of Azure to Azure Disaster Recovery. You can find more details on the pricing page [here](https://azure.microsoft.com/pricing/details/site-recovery/) and [here](https://azure.microsoft.com/blog/know-exactly-how-much-it-will-cost-for-enabling-dr-to-your-azure-vm/). Note that the egress charges that you would see in zone to zone disaster recovery would be lower than region to region disaster recovery.

**2. What is the SLA for RTO and RPO?**
The RTO SLA is the same as that for Site Recovery overall. We promise RTO of up to 2 hours. There is no defined SLA for RPO.

**3. Is capacity guaranteed in the secondary zone?**
The Site Recovery team and Azure capacity management team plan for sufficient infrastructure capacity. When you start a failover, the teams also help ensure VM instances that are protected by Site Recovery will deploy to the target zone.

**4. Which operating systems are supported?**
Zone to Zone Disaster Recovery supports the same operating systems as Azure to Azure Disaster Recovery. Refer to the support matrix [here](./azure-to-azure-support-matrix.md).

**5. Can the source and target resource groups be the same?**
No, you must fail over to a different resource group.

## Next steps

The steps that need to be followed to run a Disaster Recovery drill, fail over, re-protect, and failback are the same as the steps in Azure to Azure Disaster Recovery scenario.

To perform a Disaster Recovery drill, please follow the steps outlined [here](./azure-to-azure-tutorial-dr-drill.md).

To perform a failover and reprotect VMs in the secondary zone, follow the steps outlined [here](./azure-to-azure-tutorial-failover-failback.md).

To failback to the primary zone, follow the steps outlined [here](./azure-to-azure-tutorial-failback.md).
