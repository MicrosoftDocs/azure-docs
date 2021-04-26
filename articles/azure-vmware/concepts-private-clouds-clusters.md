---
title: Concepts - Private clouds and clusters
description: Learn about the key capabilities of Azure VMware Solution software-defined data centers and vSphere clusters. 
ms.topic: conceptual
ms.date: 04/23/2021
---

#  Azure VMware Solution private cloud and cluster concepts

Azure VMware Solution delivers VMware-based private clouds in Azure. The private cloud hardware and software deployments are fully integrated and automated in Azure. You deploy and manage the private cloud through the Azure portal, CLI, or PowerShell.  

A private cloud includes clusters with:

- Dedicated bare-metal server nodes provisioned with VMware ESXi hypervisor 
- vCenter Server for managing ESXi and vSAN 
- VMware NSX-T software-defined networking for vSphere workload VMs  
- VMware vSAN datastore for vSphere workload VMs  
- VMware HCX for workload mobility  
- Resources in the Azure underlay (required for connectivity and to operate the private cloud)

As with other resources, private clouds are installed and managed from within an Azure subscription. The number of private clouds within a subscription is scalable. Initially, there's a limit of one private cloud per subscription.  There's a logical relationship between Azure subscriptions, Azure VMware Solution private clouds, vSAN clusters, and hosts. 

The diagram shows a single Azure subscription with two private clouds that represent a development and production environment. In each of those private clouds are two clusters. 

:::image type="content" source="media/hosts-clusters-private-clouds-final.png" alt-text="Image that shows two private clouds in a customer subscription.":::

## Hosts

[!INCLUDE [disk-capabilities-of-the-host](includes/disk-capabilities-of-the-host.md)]

## Clusters

[!INCLUDE [hosts-minimum-initial-deployment-statement](includes/hosts-minimum-initial-deployment-statement.md)]

## VMware software versions

[!INCLUDE [vmware-software-versions](includes/vmware-software-versions.md)]

## Host maintenance and lifecycle management

One benefit of Azure VMware Solution private clouds is the platform is maintained for you.  Microsoft is responsible for the lifecycle management of VMware software (ESXi, vCenter, and vSAN). Microsoft is also responsible for the lifecycle management of NSX-T appliances, bootstrapping the network configuration, such as creating the Tier-0 gateway and enabling North-South routing. You're responsible for NSX-T SDN configuration: network segments, distributed firewall rules, Tier 1 gateways, and load balancers. 

[!INCLUDE [vmware-software-update-frequency](includes/vmware-software-update-frequency.md)]

## Host monitoring and remediation

Azure VMware Solution continuously monitors the health of both the underlay and the VMware components. When Azure VMware Solution detects a failure, it takes action to repair the failed components. When Azure VMware Solution detects a degradation or failure on an Azure VMware Solution node, it triggers the host remediation process. 

Host remediation involves replacing the faulty node with a new healthy node in the cluster. Then, when possible, the faulty host is placed in VMware vSphere maintenance mode. VMware vMotion moves the VMs off the faulty host to other available servers in the cluster, potentially allowing zero downtime for live migration of workloads. If the faulty host can't be placed in maintenance mode, the host is removed from the cluster.

Azure VMware Solution monitors the following conditions on the host:  

- Processor status 
- Memory status 
- Connection and power state 
- Hardware fan status 
- Network connectivity loss 
- Hardware system board status 
- Errors occurred on the disk(s) of a vSAN host 
- Hardware voltage 
- Hardware temperature status 
- Hardware power status 
- Storage status 
- Connection failure 

> [!NOTE]
> Azure VMware Solution tenant admins must not edit or delete the above defined VMware vCenter alarms, as these are managed by the Azure VMware Solution control plane on vCenter. These alarms are used by Azure VMware Solution monitoring to trigger the Azure VMware Solution host remediation process.

## Backup and restoration

Private cloud vCenter and NSX-T configurations are on an hourly backup schedule.  Backups are kept for three days. If you need to restore from a backup, open a [support request](https://rc.portal.azure.com/#create/Microsoft.Support) in the Azure portal to request restoration.

Azure VMware Solution continuously monitors the health of both the underlay and the VMware components. When Azure VMware Solution detects a failure, it takes action to repair the failed components.

## Next steps

Now that you've covered Azure VMware Solution private cloud concepts, you may want to learn about: 

- [Azure VMware Solution networking and interconnectivity concepts](concepts-networking.md)
- [Azure VMware Solution storage concepts](concepts-storage.md)
- [How to enable Azure VMware Solution resource](enable-azure-vmware-solution.md)

<!-- LINKS - internal -->
[concepts-networking]: ./concepts-networking.md

<!-- LINKS - external-->
[VCSA versions]: https://kb.vmware.com/s/article/2143838
[ESXi versions]: https://kb.vmware.com/s/article/2143832
[vSAN versions]: https://kb.vmware.com/s/article/2150753

