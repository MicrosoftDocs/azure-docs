---
title: Concepts - Private clouds and clusters
description: Learn about the key capabilities of Azure VMware Solution software-defined data centers and VMware vSphere clusters. 
ms.topic: conceptual
ms.service: azure-vmware
ms.date: 6/27/2023
ms.custom: engagement-fy23
---

# Azure VMware Solution private cloud and cluster concepts

Azure VMware Solution delivers VMware-based private clouds in Azure. The private cloud hardware and software deployments are fully integrated and automated in Azure. You deploy and manage the private cloud through the Azure portal, CLI, or PowerShell.  

A private cloud includes clusters with:

- Dedicated bare-metal server hosts provisioned with VMware ESXi hypervisor
- VMware vCenter Server for managing ESXi and vSAN
- VMware NSX-T Data Center software-defined networking for vSphere workload VMs  
- VMware vSAN datastore for vSphere workload VMs  
- VMware HCX for workload mobility  
- Resources in the Azure underlay (required for connectivity and to operate the private cloud)

As with other resources, private clouds are installed and managed from within an Azure subscription. The number of private clouds within a subscription is scalable. Initially, there's a limit of one private cloud per subscription.  There's a logical relationship between Azure subscriptions, Azure VMware Solution private clouds, vSAN clusters, and hosts.

The diagram below describes the architectural components of the Azure VMware Solution.

:::image type="content" source="media/concepts/hosts-clusters-private-clouds-final.png" alt-text="Diagram that shows a single Azure subscription with two private clouds that represent a development and production environment." border="false"  lightbox="media/concepts/hosts-clusters-private-clouds-final.png":::

Each Azure VMware Solution architectural component has the following function:

- Azure Subscription: Used to provide controlled access, budget, and quota management for the Azure VMware Solution.
- Azure Region: Physical locations around the world where we group data centers into Availability Zones (AZs) and then group AZs into regions.
- Azure Resource Group: Container used to place Azure services and resources into logical groups.
- Azure VMware Solution Private Cloud: Uses VMware software, including vCenter Server, NSX-T Data Center software-defined networking, vSAN software-defined storage, and Azure bare-metal ESXi hosts to provide compute, networking, and storage resources.
- Azure VMware Solution Resource Cluster: Uses VMware software, including vSAN software-defined storage, and Azure bare-metal ESXi hosts to provide compute, networking, and storage resources for customer workloads by scaling out the Azure VMware Solution private cloud.
- VMware HCX: Provides mobility, migration, and network extension services.
- VMware Site Recovery: Provides Disaster Recovery automation and storage replication services with VMware vSphere Replication. Third party Disaster Recovery solutions Zerto Disaster Recovery and JetStream Software Disaster Recovery are also supported.
- Dedicated Microsoft Enterprise Edge (D-MSEE): Router that provides connectivity between Azure cloud and the Azure VMware Solution private cloud instance.
- Azure Virtual Network (VNet): Private network used to connect Azure services and resources together.
- Azure Route Server: Enables network appliances to exchange dynamic route information with Azure networks.
- Azure Virtual Network Gateway: Cross premises gateway for connecting Azure services and resources to other private networks using IPSec VPN, ExpressRoute, and VNet to VNet.
- Azure ExpressRoute: Provides high-speed private connections between Azure data centers and on-premises or colocation infrastructure.
- Azure Virtual WAN (vWAN): Aggregates networking, security, and routing functions together into a single unified Wide Area Network (WAN).

## Hosts

[!INCLUDE [disk-capabilities-of-the-host](includes/disk-capabilities-of-the-host.md)]

## Clusters

[!INCLUDE [hosts-minimum-initial-deployment-statement](includes/hosts-minimum-initial-deployment-statement.md)]

[!INCLUDE [azure-vmware-solutions-limits](includes/azure-vmware-solutions-limits.md)]

## VMware software versions

[!INCLUDE [vmware-software-versions](includes/vmware-software-versions.md)]

## Host maintenance and lifecycle management

[!INCLUDE [vmware-software-update-frequency](includes/vmware-software-update-frequency.md)]

## Host monitoring and remediation

Azure VMware Solution continuously monitors the health of both the VMware components and underlay. When Azure VMware Solution detects a failure, it takes action to repair the failed components. When Azure VMware Solution detects a degradation or failure on an Azure VMware Solution node, it triggers the host remediation process.

Host remediation involves replacing the faulty node with a new healthy node in the cluster. Then, when possible, the faulty host is placed in VMware vSphere maintenance mode. VMware vMotion moves the VMs off the faulty host to other available servers in the cluster, potentially allowing zero downtime for live migration of workloads. If the faulty host can't be placed in maintenance mode, the host is removed from the cluster. Before the faulty host is removed, the customer workloads will be migrated to a newly added host.

> [!TIP]
> **Customer communication:** An email is sent to the customer's email address before the replacement is initiated and again after the replacement is successful. 
> 
> To receive emails related to host replacement, you need to be added to any of the following Azure RBAC roles in the subscription: 'ServiceAdmin', 'CoAdmin', 'Owner', 'Contributor'.

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
> Azure VMware Solution tenant admins must not edit or delete the previously defined VMware vCenter Server alarms because they are managed by the Azure VMware Solution control plane on vCenter Server. These alarms are used by Azure VMware Solution monitoring to trigger the Azure VMware Solution host remediation process.

## Backup and restoration

Private cloud vCenter Server and NSX-T Data Center configurations are on an hourly backup schedule.  Backups are kept for three days. If you need to restore from a backup, open a [support request](https://rc.portal.azure.com/#create/Microsoft.Support) in the Azure portal to request restoration.

Azure VMware Solution continuously monitors the health of both the physical underlay and the VMware Solution components. When Azure VMware Solution detects a failure, it takes action to repair the failed components.

## Next steps

Now that you've covered Azure VMware Solution private cloud concepts, you may want to learn about: 

- [Azure VMware Solution networking and interconnectivity concepts](concepts-networking.md)
- [Azure VMware Solution storage concepts](concepts-storage.md)
- [How to enable Azure VMware Solution resource](deploy-azure-vmware-solution.md#register-the-microsoftavs-resource-provider)

<!-- LINKS - internal -->
[concepts-networking]: ./concepts-networking.md

<!-- LINKS - external-->
[vCSA versions]: https://kb.vmware.com/s/article/2143838
[ESXi versions]: https://kb.vmware.com/s/article/2143832
[vSAN versions]: https://kb.vmware.com/s/article/2150753
