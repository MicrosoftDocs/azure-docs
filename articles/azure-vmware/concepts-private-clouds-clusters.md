---
title: Concepts - Private clouds and clusters
description: Learn about the key capabilities of Azure VMware Solution software-defined data centers and vSphere clusters. 
ms.topic: conceptual
ms.date: 10/27/2020
---

#  Azure VMware Solution private cloud and cluster concepts

The Azure VMware Solution delivers VMware-based private clouds in Azure. Private clouds contain clusters built with dedicated, bare-metal Azure hosts. They're deployed and managed through the Azure portal, CLI, or PowerShell.  Clusters provisioned in private clouds include VMware vSphere, vCenter, vSAN, and NSX software. Azure VMware Solution private cloud hardware and software deployments are fully integrated and automated in Azure.

There's a logical relationship between Azure subscriptions, Azure VMware Solution private clouds, vSAN clusters, and hosts. The diagram shows a single Azure subscription with two private clouds that represent the development and production environment.  In each of those private clouds are two clusters. 

This article describes all of these concepts.

![Image of two private clouds in a customer subscription](./media/hosts-clusters-private-clouds-final.png)

>[!NOTE]
>Because of the lower potential needs of a development environment, use smaller clusters with lower capacity hosts. 

## Private clouds

Private clouds contain vSAN clusters built with dedicated, bare-metal Azure hosts. Each private cloud can have multiple clusters managed by the same vCenter server and NSX-T manager. You can deploy and manage private clouds in the portal, CLI, or PowerShell. 

As with other resources, private clouds are installed and managed from within an Azure subscription. The number of private clouds within a subscription is scalable. Initially, there's a limit of one private cloud per subscription.

## Clusters
For each private cloud created, there's one vSAN cluster by default. You can add, delete, and scale clusters using the Azure portal or through the API.  All clusters have a default size of three hosts and can scale up to 16 hosts.  The hosts used in a cluster must be the same host type.

Trial clusters are available for evaluation and limited to three hosts. There's a single trial cluster per private cloud. You can scale a trial cluster by a single host during the evaluation period.

You use vSphere and NSX-T Manager to manage most other aspects of cluster configuration or operation. All local storage of each host in a cluster is under the control of vSAN.

## Hosts

Azure VMware Solution private cloud clusters use hyper-converged, bare-metal infrastructure nodes. The following table shows the RAM, CPU, and disk capacities of the host. 

| Host Type              |             CPU             |   RAM (GB)   |  vSAN NVMe cache Tier (TB, raw)  |  vSAN SSD capacity tier (TB, raw)  |
| :---                   |            :---:            |    :---:     |               :---:              |                :---:               |
| High-End (HE)          |  dual Intel 18 core 2.3 GHz  |     576      |                3.2               |                15.20               |

Hosts used to build or scale clusters come from an isolated pool of hosts. Those hosts have passed hardware tests and have had all data securely deleted. 

## VMware software versions

The current software versions of the VMware software used in Azure VMware Solution private cloud clusters are:

| Software              |    Version   |
| :---                  |     :---:    |
| VCSA / vSphere / ESXi |    6.7 U3    | 
| ESXi                  |    6.7 U3    | 
| vSAN                  |    6.7 U3    |
| NSX-T                 |      2.5     |

For any new cluster in a private cloud, the software version matches what's currently running. For any new private cloud in a subscription, the software stack's latest version gets installed.

You can find the general upgrade policies and processes for the Azure VMware Solution platform software described in the [Upgrades Concepts](concepts-upgrades.md) article.

## Host maintenance and lifecycle management

Host maintenance and lifecycle management have no impact on the private cloud clusters' capacity or performance.  Examples of automated host maintenance include firmware upgrades and hardware repair or replacement.

Microsoft is responsible for the lifecycle management of NSX-T appliances, such as NSX-T Manager and NSX-T Edge. They are also responsible for bootstrapping network configuration, such as creating the Tier-0 gateway and enabling North-South routing. You're responsible for NSX-T SDN configuration. For example, network segments, distributed firewall rules, Tier 1 gateways, and load balancers.

> [!IMPORTANT]
> Do not modify the configuration of NSX-T Edge or Tier-0 Gateway, as this may result in a loss of service.

## Backup and restoration

Private cloud vCenter and NSX-T configurations are on an hourly backup schedule.  Backups are kept for three days. If you need to restore from a backup, open a [support request](https://rc.portal.azure.com/#create/Microsoft.Support) in the Azure portal to request restoration.

## Next steps

The next step is to learn [networking and interconnectivity concepts](concepts-networking.md).

<!-- LINKS - internal -->

<!-- LINKS - external-->
[VCSA versions]: https://kb.vmware.com/s/article/2143838
[ESXi versions]: https://kb.vmware.com/s/article/2143832
[vSAN versions]: https://kb.vmware.com/s/article/2150753

