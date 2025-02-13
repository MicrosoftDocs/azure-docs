---
title: Introduction
description: Learn the features and benefits of Azure VMware Solution to deploy and manage VMware-based workloads in Azure.
ms.topic: overview
ms.service: azure-vmware
ms.date: 9/16/2024
ms.custom: engagement-fy23
---

# What is Azure VMware Solution?

Azure VMware Solution provides private clouds that contain VMware vSphere clusters built from dedicated bare-metal Azure infrastructure. Azure VMware Solution is available in Azure Commercial and Azure Government. The minimum initial deployment is three hosts, with the option to add more hosts, up to a maximum of 16 hosts per cluster. All provisioned private clouds have VMware vCenter Server, VMware vSAN, VMware vSphere, and VMware NSX. As a result, you can migrate workloads from your on-premises environments, deploy new virtual machines (VMs), and consume Azure services from your private clouds. For information about the SLA, see the [Azure service-level agreements](https://azure.microsoft.com/support/legal/sla/azure-vmware/v1_1/) page.

Azure VMware Solution is a VMware validated solution with ongoing validation and testing of enhancements and upgrades. Microsoft manages and maintains the private cloud infrastructure and software, allowing you to focus on developing and running workloads in your private clouds to deliver business value.

The diagram shows the adjacency between private clouds and VNets in Azure, Azure services, and on-premises environments. Network access from private clouds to Azure services or VNets provides SLA-driven integration of Azure service endpoints. ExpressRoute Global Reach connects your on-premises environment to your Azure VMware Solution private cloud.

:::image type="content" source="media/introduction/adjacency-overview-drawing-final.png" alt-text="Diagram showing Azure VMware Solution private cloud adjacency to Azure services and on-premises environments." border="false" lightbox="media/introduction/adjacency-overview-drawing-final.png":::

## Hosts, clusters, and private clouds

[!INCLUDE [host-sku-sizes](includes/disk-capabilities-of-the-host.md)]

You can deploy new or scale existing private clouds through the Azure portal or Azure CLI.

## Azure VMware Solution private cloud extension with AV64 node size

The AV64 is a new Azure VMware Solution host SKU, which is available to expand (not to create) the Azure VMware Solution private cloud built with the existing AV36, AV36P, or AV52 SKU. Use the [Microsoft documentation](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=azure-vmware) to check for availability of the AV64 SKU in the region. 

:::image type="content" source="media/introduction/av64-mixed-sku-topology.png" alt-text="Diagram showing Azure VMware Solution private cloud with AV64 SKU in mixed SKU configuration." border="false" lightbox="media/introduction/av64-mixed-sku-topology.png":::

### Prerequisite for AV64 usage 

See the following prerequisites for AV64 cluster deployment. 

- An Azure VMware solution private cloud is created using AV36, AV36P, or AV52 in AV64 supported [region/AZ](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=azure-vmware). 

- You need one /23 or three (contiguous or noncontiguous) /25 address blocks for AV64 cluster management. 

### Supportability for customer scenarios

**Customer with existing Azure VMware Solution private cloud**:
When a customer has a deployed Azure VMware Solution private cloud, they can scale the private cloud by adding a separate AV64 vCenter node cluster to that private cloud. In this scenario, customers should use the following steps: 

1. Get an AV64 [quota approval from Microsoft](/azure/azure-vmware/request-host-quota-azure-vmware-solution) with the minimum of three nodes. Add other details on the Azure VMware Solution private cloud that you plan to extend using AV64.
3. Use an existing Azure VMware Solution add-cluster workflow with AV64 hosts to expand. 

**Customer plans to create a new Azure VMware Solution private cloud**: When a customer wants a new Azure VMware Solution private cloud that can use AV64 SKU but only for expansion. In this case, the customer meets the prerequisite of having an Azure VMware Solution private cloud built with AV36, AV36P, or AV52 SKU. The customer needs to buy a minimum of three nodes of AV36, AV36P, or AV52 SKU before expanding using AV64. For this scenario, use the following steps:

1. Get AV36, AV36P, or AV52, and AV64 [quota approval from Microsoft](/azure/azure-vmware/request-host-quota-azure-vmware-solution) with a minimum of three nodes each.
1. Create an Azure VMware Solution private cloud using AV36, AV36P, or AV52 SKU.
4. Use an existing Azure VMware Solution add-cluster workflow with AV64 hosts to expand.

**Azure VMware Solution stretched clusters private cloud**: The AV64 SKU isn't supported with Azure VMware Solution stretched clusters private cloud. This means that an AV64-based expansion isn't possible for an Azure VMware Solution stretched clusters private cloud. 

[!NOTE]

All traffic from an AV64 host towards a customer network will utilize the IP address of the VMKernel Network Interface 1.

### AV64 Cluster vSAN fault domain (FD) design and recommendations

The traditional Azure VMware Solution host clusters don't have explicit vSAN FD configuration. The reasoning is the host allocation logic ensures, within clusters, that no two hosts reside in the same physical fault domain within an Azure region. This feature inherently brings resilience and high availability for storage, which the vSAN FD configuration is supposed to bring. More information on vSAN FD can be found in the [VMware documentation](https://techdocs.broadcom.com/us/en/vmware-cis/vsan/vsan/8-0/vsan-administration/expanding-and-managing-a-vsan-cluster/managing-fault-domains-in-vsan-clusters.html). 

The Azure VMware Solution AV64 host clusters have an explicit vSAN fault domain (FD) configuration. Azure VMware Solution control plane configures seven vSAN fault domains (FDs) for AV64 clusters. Hosts are balanced evenly across the seven FDs as users scale up the hosts in a cluster from three nodes to 16 nodes. Some Azure regions still support a maximum of five FDs as part of the initial release of the AV64 SKU. Refer to the [Azure Region Availability Zone (AZ) to SKU mapping table](architecture-private-clouds.md#azure-region-availability-zone-az-to-sku-mapping-table) for more information.

### Cluster size recommendation

The Azure VMware Solution minimum vSphere node cluster size supported is three. The vSAN data redundancy is handled by ensuring the minimum cluster size of three hosts are in different vSAN FDs. In a vSAN cluster with three hosts, each in a different FD, should an FD fail (for example, the top of rack switch fails), the vSAN data would be protected. Operations such as object creation (new VM, VMDK, and others) would fail. The same is true of any maintenance activities where an ESXi host is placed into maintenance mode and/or rebooted. To avoid scenarios such as these, the recommendation is to deploy vSAN clusters with a minimum of four ESXi hosts. 

### AV64 host removal workflow and best practices

Because of the AV64 cluster vSAN fault domain (FD) configuration and need for hosts balanced across all FDs, the host removal from AV64 cluster differs from traditional Azure VMware Solution host clusters with other SKUs.

Currently, a user can select one or more hosts to be removed from the cluster using portal or API. One condition is that a cluster should have a minimum of three hosts. However, an AV64 cluster behaves differently in certain scenarios when AV64 uses vSAN FDs. Any host removal request is checked against potential vSAN FD imbalance. If a host removal request creates an imbalance, the request is rejected with the http 409-Conflict response. The http 409-Conflict response status code indicates a request conflict with the current state of the target resource (hosts).

The following three scenarios show examples of instances that normally error out and demonstrate different methods that can be used to remove hosts without creating a vSAN fault domain (FD) imbalance.

-  Removing a host creates a vSAN FD imbalance with a difference of hosts between most and least populated FD to be more than one.
	In the following example users, need to remove one of the hosts from FD 1 before removing hosts from other FDs.

	 :::image type="content" source="media/introduction/remove-host-scenario-1.png" alt-text="Diagram showing how users need to remove one of the hosts from FD 1 before removing hosts from other FDs." border="false" lightbox="media/introduction/remove-host-scenario-1.png":::

- Multiple host removal requests are made at the same time and certain host removals create an imbalance. In this scenario, the Azure VMware Solution control plane removes only hosts, which don't create imbalance.
	In the following example users can't take both of the hosts from the same FDs unless they're reducing the cluster size to four or lower. 

     :::image type="content" source="media/introduction/remove-host-scenario-2.png" alt-text="Diagram showing how users can't take both of the hosts from the same FDs unless they're reducing the cluster size to four or lower." border="false" lightbox="media/introduction/remove-host-scenario-2.png":::

- A selected host removal causes less than three active vSAN FDs. This scenario isn't expected to occur given that all AV64 regions have five or seven FDs. While adding hosts, the Azure VMware Solution control plane takes care of adding hosts from all seven FDs evenly.
	In the following example, users can remove one of the hosts from FD 1, but not from FD 2 or 3.

	 :::image type="content" source="media/introduction/remove-host-scenario-3.png" alt-text="Diagram showing how users can remove one of the hosts from FD 1, but not from FD 2 or 3." border="false" lightbox="media/introduction/remove-host-scenario-3.png":::

**How to identify the host that can be removed without causing a vSAN FD imbalance**: A user can go to the vSphere Client interface to get the current state of vSAN FDs and hosts associated with each of them. This helps to identify hosts (based on the previous examples) that can be removed without affecting the vSAN FD balance and avoid any errors in the removal operation. 

### AV64 supported RAID configuration 

This table provides the list of RAID configuration supported and host requirements in AV64 clusters. The RAID-6 FTT2 and RAID-1 FTT3 policies are supported with the AV64 SKU in some regions. In Azure regions that are currently constrained to five FDs, Microsoft allows customers to use the RAID-5 FTT1 vSAN storage policy for AV64 clusters with six or more nodes to meet the service level agreement (SLA). Refer to the [Azure Region Availability Zone (AZ) to SKU mapping table](architecture-private-clouds.md#azure-region-availability-zone-az-to-sku-mapping-table) for more information. 

| RAID configuration 	| Failures to tolerate (FTT) |	Minimum hosts required |
|-------------------|--------------------------|------------------------|
| RAID-1 (Mirroring) Default setting. | 1 | 3 |
| RAID-5 (Erasure Coding)             | 1 | 4 |
| RAID-1 (Mirroring)                  | 2 | 5 |
| RAID-6 (Erasure Coding)             | 2 | 6 |
| RAID-1 (Mirroring)                  | 3 | 7 |

## Storage 

Azure VMware Solution supports the expansion of datastore capacity beyond what is included with vSAN using Azure storage services, enabling you to expand datastore capacity without scaling the clusters. For more information, see [Datastore capacity expansion options](architecture-storage.md#datastore-capacity-expansion-options).
 
## Networking

[!INCLUDE [avs-networking-description](includes/azure-vmware-solution-networking-description.md)]

For more information, see [Networking architecture](architecture-networking.md).

## Access and security

Azure VMware Solution private clouds use vSphere role-based access control for enhanced security. You can integrate vSphere SSO LDAP capabilities with Microsoft Entra ID. For more information, see the [Access and identity architecture](architecture-identity.md) page.  

vSAN data-at-rest encryption, by default, is enabled and is used to provide vSAN datastore security. For more information, see [Storage architecture](architecture-storage.md).

## Data residency and customer data

Azure VMware Solution doesn't store customer data.

## VMware software versions

[!INCLUDE [vmware-software-versions](includes/vmware-software-versions.md)]

## Host and software lifecycle maintenance

Regular upgrades of the Azure VMware Solution private cloud and VMware software ensure the latest security, stability, and feature sets are running in your private clouds. For more information, see [Host maintenance and lifecycle management](architecture-private-clouds.md#host-maintenance-and-lifecycle-management).

## Monitoring your private cloud

Once you deployed Azure VMware Solution into your subscription, [Azure Monitor logs](/azure/azure-monitor/overview) are generated automatically.

In your private cloud, you can:

- Collect logs on each of your VMs.
- [Download and install the MMA agent](/azure/azure-monitor/agents/log-analytics-agent#installation-options) on Linux and Windows VMs.
- Enable the [Azure diagnostics extension](/azure/azure-monitor/agents/diagnostics-extension-overview).
- [Create and run new queries](/azure/azure-monitor/logs/data-platform-logs#kusto-query-language-kql-and-log-analytics).
- Run the same queries you usually run on your VMs.

Monitoring patterns inside the Azure VMware Solution are similar to Azure VMs within the IaaS platform. For more information and how-tos, see [Monitoring Azure VMs with Azure Monitor](/azure/azure-monitor/vm/monitor-vm-azure).

## Customer communication

[!INCLUDE [customer-communications](includes/customer-communications.md)]

## Azure VMware Solution responsibility matrix - Microsoft vs customer

Azure VMware Solution implements a shared responsibility model that defines distinct roles and responsibilities of the two parties involved in the offering: customer and Microsoft. The shared role responsibilities are illustrated in more detail in the following two tables.

The shared responsibility matrix table outlines the main tasks that customers and Microsoft each handle in deploying and managing both the private cloud and customer application workloads.

:::image type="content" source="media/introduction/azure-introduction-shared-responsibility-matrix.png" alt-text="Diagram of the high-level shared responsibility matrix for Azure VMware Solution." border="false" lightbox="media/introduction/azure-introduction-shared-responsibility-matrix.png":::

The following table provides a detailed list of roles and responsibilities between the customer and Microsoft, which encompasses the most frequent tasks and definitions. For further questions, contact Microsoft.

| **Role** | **Task/details** |
| -------- | ---------------- |
| Microsoft - Azure VMware Solution | Physical infrastructure<ul><li>Azure regions</li><li>Azure availability zones</li><li>Express Route/Global Reach</ul></li>Compute/Network/Storage<ul><li>Rack and power Bare Metal hosts</li><li>Rack and power network equipment</ul></li>Private cloud deploy/lifecycle<ul><li>VMware ESXi deploy, patch, and upgrade</li><li>VMware vCenter Servers deploy, patch, and upgrade</li><li>VMware NSX deploy, patch, and upgrade</li><li>VMware vSAN deploy, patch, and upgrade</ul></li>Private cloud Networking - VMware NSX provider config<ul><li>Microsoft Edge node/cluster, VMware NSX host preparation</li><li>Provider Tier-0 and Tenant Tier-1 Gateway</li><li>Connectivity from Tier-0 (using BGP) to Azure Network via ExpressRoute</ul></li>Private cloud compute - VMware vCenter Server provider config<ul><li>Create default cluster</li><li>Configure virtual networking for vMotion, Management, vSAN, and others</ul></li>Private cloud backup/restore<ul><li>Back up and restore VMware vCenter Server</li><li>Back up and restore VMware NSX Manager</ul></li>Private cloud health monitoring and corrective actions, for example: replace failed hosts</br><br>(optional) VMware HCX deploys with fully configured compute profile on cloud side as add-on</br><br>(optional) VMware SRM deploys, upgrade, and scale up/down</br><br>Support - Private cloud platforms and VMware HCX      |
| Customer | Request Azure VMware Solution host quote with Microsoft<br>Plan and create a request for private clouds on Azure portal with:<ul><li>Host count</li><li>Management network range</li><li>Other information</ul></li>Configure private cloud network and security (VMware NSX)<ul><li>Network segments to host applications</li><li>More Tier -1 routers</li><li>Firewall</li><li>VMware NSX LB</li><li>IPsec VPN</li><li>NAT</li><li>Public IP addresses</li><li>Distributed firewall/gateway firewall</li><li>Network extension using VMware HCX or VMware NSX</li><li>AD/LDAP config for RBAC</ul></li>Configure private cloud - VMware vCenter Server<ul><li>AD/LDAP config for RBAC</li><li>Deploy and lifecycle management of Virtual Machines (VMs) and application<ul><li>Install operating systems</li><li>Patch operating systems</li><li>Install antivirus software</li><li>Install backup software</li><li>Install configuration management software</li><li>Install application components</li><li>VM networking using VMware NSX segments</ul></li><li>Migrate Virtual Machines (VMs)<ul><li>VMware HCX configuration</li><li>Live vMotion</li><li>Cold migration</li><li>Content library sync</ul></li></ul></li>Configure private cloud - vSAN<ul><li>Define and maintain vSAN VM policies</li><li>Add hosts to maintain adequate 'slack space'</ul></li>Configure VMware HCX<ul><li>Download and deploy HCA connector OVA in on-premises</li><li>Pairing on-premises VMware HCX connector</li><li>Configure the network profile, compute profile, and service mesh</li><li>Configure VMware HCX network extension/MON</li><li>Upgrade/updates</ul></li>Network configuration to connect to on-premises, virtual network, or internet</br><br>Add or delete hosts requests to cluster from Portal</br><br>Deploy/lifecycle management of partner (third party) solutions      |
| Partner ecosystem | Support for their product/solution. For reference, the following are some of the supported Azure VMware Solution partner solution/product:<ul><li>BCDR - VMware SRM, JetStream, Zerto, and others</li><li>Backup - Veeam, Commvault, Rubrik, and others</li><li>VDI - Horizon, Citrix</li><li>Multitenancy for enterprises - VMware Cloud Director Service (CDS), VMware vCloud Director Availability (VCDA)</li><li>Security solutions - BitDefender, TrendMicro, Checkpoint</li><li>Other VMware products - Aria Suite, NSX Advanced Load Balancer     |


## Next steps

The next step is to learn key [private cloud architecture concepts](architecture-private-clouds.md).

<!-- LINKS - external -->

[architecture-private-clouds]: ./architecture-private-clouds.md
