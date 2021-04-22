---
title: Concepts - Private clouds and clusters
description: Learn about the key capabilities of Azure VMware Solution software-defined data centers and vSphere clusters. 
ms.topic: conceptual
ms.date: 03/13/2021
---

#  Azure VMware Solution private cloud and cluster concepts

The Azure VMware Solution delivers VMware-based private clouds in Azure. Private clouds contain clusters built with dedicated, bare-metal Azure hosts. They're deployed and managed through the Azure portal, CLI, or PowerShell.  Clusters provisioned in private clouds include VMware vSphere, vCenter, vSAN, and NSX software. Azure VMware Solution private cloud hardware and software deployments are fully integrated and automated in Azure.

There's a logical relationship between Azure subscriptions, Azure VMware Solution private clouds, vSAN clusters, and hosts. The diagram shows a single Azure subscription with two private clouds that represent the development and production environment.  In each of those private clouds are two clusters. 

This article describes all of these concepts.

![Image of two private clouds in a customer subscription](./media/hosts-clusters-private-clouds-final.png)


## Private clouds

Private clouds contain vSAN clusters built with dedicated, bare-metal Azure hosts. Each private cloud can have multiple clusters managed by the same vCenter server and NSX-T Manager. You can deploy and manage private clouds in the portal, CLI, or PowerShell. 

As with other resources, private clouds are installed and managed from within an Azure subscription. The number of private clouds within a subscription is scalable. Initially, there's a limit of one private cloud per subscription.

## Clusters
For each private cloud created, there's one vSAN cluster by default. You can add, delete, and scale clusters using the Azure portal or through the API.  All clusters have a default size of three hosts and can scale up to 16 hosts. You can have up to four clusters per private cloud.

Trial clusters are available for evaluation and limited to three hosts. There's a single trial cluster per private cloud. You can scale a trial cluster by a single host during the evaluation period.

You use vSphere and NSX-T Manager to manage most other aspects of cluster configuration or operation. All local storage of each host in a cluster is under the control of vSAN.

## Hosts

Azure VMware Solution clusters are based on hyper-converged, bare-metal infrastructure. The following table shows the RAM, CPU, and disk capacities of the host.

| Host Type              |             CPU             |   RAM (GB)   |  vSAN NVMe cache Tier (TB, raw)  |  vSAN SSD capacity tier (TB, raw)  |
| :---                   |            :---:            |    :---:     |               :---:              |                :---:               |
| AV36          |  dual Intel 18 core 2.3 GHz  |     576      |                3.2               |                15.20               |

Hosts used to build or scale clusters come from an isolated pool of hosts. Those hosts have passed hardware tests and have had all data securely deleted. 

## VMware software versions

[!INCLUDE [vmware-software-versions](includes/vmware-software-versions.md)]

## Update frequency

[!INCLUDE [vmware-software-update-frequency](includes/vmware-software-update-frequency.md)]

## Host maintenance and lifecycle management

Host maintenance and lifecycle management have no impact on the private cloud clusters' capacity or performance.  Examples of automated host maintenance include firmware upgrades and hardware repair or replacement.

Microsoft is responsible for the lifecycle management of NSX-T appliances, such as NSX-T Manager and NSX-T Edge. Microsoft is responsible for bootstrapping network configuration, such as creating the Tier-0 gateway and enabling North-South routing. You're responsible for NSX-T SDN configuration. For example, network segments, distributed firewall rules, Tier 1 gateways, and load balancers.

## Backup and restoration

Private cloud vCenter and NSX-T configurations are on an hourly backup schedule.  Backups are kept for three days. If you need to restore from a backup, open a [support request](https://rc.portal.azure.com/#create/Microsoft.Support) in the Azure portal to request restoration.

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

