---
title: Introduction
description: Learn the features and benefits of Azure VMware Solution to deploy and manage VMware-based workloads in Azure.
ms.topic: overview
ms.service: azure-vmware
ms.date: 10/16/2023
ms.custom: engagement-fy23
---

# What is Azure VMware Solution?

Azure VMware Solution provides private clouds that contain VMware vSphere clusters built from dedicated bare-metal Azure infrastructure. Azure VMware Solution is available in Azure Commercial and Azure Government. The minimum initial deployment is three hosts, with the option to add more hosts, up to a maximum of 16 hosts per cluster. All provisioned private clouds have VMware vCenter Server, VMware vSAN, VMware vSphere, and VMware NSX-T Data Center. As a result, you can migrate workloads from your on-premises environments, deploy new virtual machines (VMs), and consume Azure services from your private clouds. For information about the SLA, see the [Azure service-level agreements](https://azure.microsoft.com/support/legal/sla/azure-vmware/v1_1/) page.

Azure VMware Solution is a VMware validated solution with ongoing validation and testing of enhancements and upgrades. Microsoft manages and maintains the private cloud infrastructure and software, allowing you to focus on developing and running workloads in your private clouds to deliver business value.

The diagram shows the adjacency between private clouds and VNets in Azure, Azure services, and on-premises environments. Network access from private clouds to Azure services or VNets provides SLA-driven integration of Azure service endpoints. ExpressRoute Global Reach connects your on-premises environment to your Azure VMware Solution private cloud.

:::image type="content" source="media/introduction/adjacency-overview-drawing-final.png" alt-text="Diagram showing Azure VMware Solution private cloud adjacency to Azure services and on-premises environments." border="false":::

## AV36P and AV52 node sizes available in Azure VMware Solution

The new node sizes increase memory and storage options to optimize your workloads. The gains in performance enable you to do more per server, break storage bottlenecks, and lower transaction costs of latency-sensitive workloads. The availability of the new nodes allows for large latency-sensitive services to be hosted efficiently on the Azure VMware Solution infrastructure.

**AV36P key highlights for Memory and Storage optimized Workloads:**

- Runs on Intel® Xeon® Gold 6240 Processor with 36 cores and a base frequency of 2.6 GHz and turbo of 3.9 GHz.
- 768 GB of DRAM memory
- 19.2-TB storage capacity with all NVMe based SSDs
- 1.5 TB of NVMe cache

**AV52 key highlights for Memory and Storage optimized Workloads:**

- Runs on Intel® Xeon® Platinum 8270 with 52 cores and a base frequency of 2.7 GHz and turbo of 4.0 GHz.
- 1.5 TB of DRAM memory.
- 38.4-TB storage capacity with all NVMe based SSDs.
- 1.5 TB of NVMe cache.

For pricing and region availability, see the [Azure VMware Solution pricing page](https://azure.microsoft.com/pricing/details/azure-vmware/) and see the [Products available by region page](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=azure-vmware&regions=all).

## Hosts, clusters, and private clouds

[!INCLUDE [host-sku-sizes](includes/disk-capabilities-of-the-host.md)]

You can deploy new or scale existing private clouds through the Azure portal or Azure CLI.

## Azure VMware Solution private cloud extension with AV64 node size 

The AV64 is a new Azure VMware Solution host SKU, which is available to expand (not to create) the Azure VMware Solution private cloud built with the existing AV36, AV36P, or AV52 SKU. Use the [Microsoft documentation](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=azure-vmware) to check for availability of the AV64 SKU in the region. 

### Prerequisite for AV64 usage 

See the following prerequisites for AV64 cluster deployment. 

- An Azure VMware solution private cloud is created using AV36, AV36P, or AV52 in AV64 supported [region/AZ](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=azure-vmware). 

- You need one /23 or three (contiguous or noncontiguous) /25 address blocks for AV64 cluster management. 


### Supportability for customer scenarios

**Customer with existing Azure VMware Solution private cloud**:
When a customer has a deployed Azure VMware Solution private cloud, they can scale the private cloud by adding a separate AV64 vCenter node cluster to that private cloud. In this scenario, customers should use the following steps: 

1. Get an AV64 [quota approval from Microsoft](/azure/azure-vmware/request-host-quota-azure-vmware-solution) with the minimum of three nodes. Add other details on the Azure VMware Solution private cloud that you plan to extend using AV64.
2. Use an existing Azure VMware Solution add-cluster workflow with AV64 hosts to expand. 

**Customer plans to create a new Azure VMware Solution private cloud**: When a customer wants a new Azure VMware Solution private cloud that can use AV64 SKU but only for expansion. In this case, the customer meets the prerequisite of having an Azure VMware Solution private cloud built with AV36, AV36P, or AV52 SKU. The customer needs to buy a minimum of three nodes of AV36, AV36P, or AV52 SKU before expanding using AV64. For this scenario, use the following steps:

1. Get AV36, AV36P, AV52 and AV64 [quota approval from Microsoft](/azure/azure-vmware/request-host-quota-azure-vmware-solution) with a minimum of three nodes each. 
2. Create an Azure VMware Solution private cloud using AV36, AV36P, or AV52 SKU. 
3. Use an existing Azure VMware Solution add-cluster workflow with AV64 hosts to expand. 

**Azure VMware Solution stretched cluster private cloud**: The AV64 SKU isn't supported with Azure VMware Solution stretched cluster private cloud. This means that an AV64-based expansion isn't possible for an Azure VMware Solution stretched cluster private cloud. 

### AV64 Cluster vSAN fault domain (FD) design and recommendations 

The traditional Azure VMware Solution host clusters don't have explicit vSAN FD configuration. The reasoning is the host allocation logic ensures, within clusters, that no two hosts reside in the same physical fault domain within an Azure region. This feature inherently brings resilience and high availability for storage, which the vSAN FD configuration is supposed to bring. More information on vSAN FD can be found in the [VMware documentation](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.vsan.doc/GUID-8491C4B0-6F94-4023-8C7A-FD7B40D0368D.html). 

The Azure VMware Solution AV64 host clusters have an explicit vSAN fault domain (FD) configuration. Azure VMware Solution control plane configures five vSAN fault domains for AV64 clusters, and hosts are balanced evenly across these five FDs, as users scale up the hosts in a cluster from three nodes to 16 nodes. 

### Cluster size recommendation

The Azure VMware Solution minimum vSphere node cluster size supported is three. The vSAN data redundancy is handled by ensuring the minimum cluster size of three hosts are in different vSAN FDs. In a vSAN cluster with three hosts, each in a different FD, Should an FD fail (for example, the top of rack switch fails), the vSAN data would be protected. Operations such as object creation (new VM, VMDK, and others) would fail. The same is true of any maintenance activities where an ESXi host is placed into maintenance mode and/or rebooted. To avoid scenarios such as these, it's recommended to deploy vSAN clusters with a minimum of four ESXi hosts. 

### AV64 host removal workflow and best practices

Because of the AV64 cluster vSAN fault domain (FD) configuration and need for hosts balanced across all FDs, the host removal from AV64 cluster differs from traditional Azure VMware Solution host clusters with other SKUs.

Currently, a user can select one or more hosts to be removed from the cluster using portal or API. One condition is that a cluster should have a minimum of three hosts. However, an AV64 cluster behaves differently in certain scenarios when AV64 uses vSAN FDs. Any host removal request is checked against potential vSAN FD imbalance. If a host removal request creates an imbalance, the request is rejected with the http 409-Conflict response. The http 409-Conflict response status code indicates a request conflict with the current state of the target resource (hosts).

The following three scenarios show examples of instances that would normally error out and demonstrate different methods that can be used to remove hosts without creating a vSAN fault domain (FD) imbalance.

- When removing a host creates a vSAN FD imbalance with a difference of hosts between most and least populated FD to be more than one.
	In the following example users, need to remove one of the hosts from FD 1 before removing hosts from other FDs.

	 :::image type="content" source="media/introduction/remove-host-scenario-1.png" alt-text="Diagram showing how users need to remove one of the hosts from FD 1 before removing hosts from other FDs." border="false":::

- When multiple host removal requests are made at the same time and certain host removals create an imbalance. In this scenario, the Azure VMware Solution control plane removes only hosts, which don't create imbalance.
	In the following example users can't take both of the hosts from the same FDs unless they're reducing the cluster size to four or lower. 

     :::image type="content" source="media/introduction/remove-host-scenario-2.png" alt-text="Diagram showing how users can't take both of the hosts from the same FDs unless they're reducing the cluster size to four or lower." border="false":::

- When a selected host removal causes less than three active vSAN FDs. This scenario isn't expected to occur given that all AV64 regions have five FDs and, while adding hosts, the Azure VMware Solution control plane takes care of adding hosts from all five FDs evenly.
	In the following example users can remove one of the hosts from FD 1, but not from FD 2 or 3.

	 :::image type="content" source="media/introduction/remove-host-scenario-3.png" alt-text="Diagram showing how users can remove one of the hosts from FD 1, but not from FD 2 or 3." border="false":::

**How to identify the host that can be removed without causing a vSAN FD imbalance**: A user can go to the vSphere user interface to get the current state of vSAN FDs and hosts associated with each of them. This helps to identify hosts (based on the previous examples) that can be removed without affecting the vSAN FD balance and avoid any errors in the removal operation. 

### AV64 supported RAID configuration 

This table provides the list of RAID configuration supported and host requirements in AV64 cluster. The RAID6/FTT2 and RAID1/FTT3 policies will be supported in future on AV64 SKU. Microsoft allows customers to use the RAID-5 FTT1 vSAN storage policy for AV64 clusters with six or more nodes to meet the service level agreement.  

|RAID configuration 	|Failures to tolerate (FTT) |	Minimum hosts required |
|-------------------|--------------------------|------------------------|
|RAID-1 (Mirroring) Default setting.| 	1 |	3 |
|RAID-5 (Erasure Coding) |	1 |	4 |
|RAID-1 (Mirroring) |	2 |	5 |
 
## Networking

[!INCLUDE [avs-networking-description](includes/azure-vmware-solution-networking-description.md)]

For more information, see [Networking concepts](concepts-networking.md).

## Access and security

Azure VMware Solution private clouds use vSphere role-based access control for enhanced security. You can integrate vSphere SSO LDAP capabilities with Microsoft Entra ID. For more information, see the [Access and Identity concepts](concepts-identity.md) page.  

vSAN data-at-rest encryption, by default, is enabled and is used to provide vSAN datastore security. For more information, see [Storage concepts](concepts-storage.md).

## Data residency and customer data

Azure VMware Solution doesn't store customer data.

## VMware software versions

[!INCLUDE [vmware-software-versions](includes/vmware-software-versions.md)]

## Host and software lifecycle maintenance

Regular upgrades of the Azure VMware Solution private cloud and VMware software ensure the latest security, stability, and feature sets are running in your private clouds. For more information, see [Host maintenance and lifecycle management](concepts-private-clouds-clusters.md#host-maintenance-and-lifecycle-management).

## Monitoring your private cloud

Once you've deployed Azure VMware Solution into your subscription, [Azure Monitor logs](../azure-monitor/overview.md) are generated automatically.

In your private cloud, you can:

- Collect logs on each of your VMs.
- [Download and install the MMA agent](../azure-monitor/agents/log-analytics-agent.md#installation-options) on Linux and Windows VMs.
- Enable the [Azure diagnostics extension](../azure-monitor/agents/diagnostics-extension-overview.md).
- [Create and run new queries](../azure-monitor/logs/data-platform-logs.md#log-queries).
- Run the same queries you usually run on your VMs.

Monitoring patterns inside the Azure VMware Solution are similar to Azure VMs within the IaaS platform. For more information and how-tos, see [Monitoring Azure VMs with Azure Monitor](../azure-monitor/vm/monitor-vm-azure.md).

## Customer communication

[!INCLUDE [customer-communications](includes/customer-communications.md)]

## Azure VMware Solution responsibility matrix - Microsoft vs customer

Azure VMware Solution implements a shared responsibility model that defines distinct roles and responsibilities of the two parties involved in the offering: customer and Microsoft. The shared role responsibilities are illustrated in more detail in the following two tables.

The shared responsibility matrix table outlines the main tasks that customers and Microsoft each handle in deploying and managing both the private cloud and customer application workloads.

:::image type="content" source="media/introduction/azure-introduction-shared-responsibility-matrix.png" alt-text="Screenshot of the high-level shared responsibility matrix for Azure VMware Solution." lightbox="media/introduction/azure-introduction-shared-responsibility-matrix.png":::

The following table provides a detailed list of roles and responsibilities between the customer and Microsoft, which encompasses the most frequent tasks and definitions. For further questions, contact Microsoft.

| **Role** | **Task/details** |
| -------- | ---------------- |
| Microsoft - Azure VMware Solution | Physical infrastructure<ul><li>Azure regions</li><li>Azure availability zones</li><li>Express Route/Global Reach</ul></li>Compute/Network/Storage<ul><li>Rack and power Bare Metal hosts</li><li>Rack and power network equipment</ul></li>Software defined Data Center (SDDC) deploy/lifecycle<ul><li>VMware ESXi deploy, patch, and upgrade</li><li>VMware vCenter Servers deploy, patch, and upgrade</li><li>VMware NSX-T Data Centers deploy, patch, and upgrade</li><li>VMware vSAN deploy, patch, and upgrade</ul></li>SDDC Networking - VMware NSX-T Data Center provider config<ul><li>Microsoft Edge node/cluster, VMware NSX-T Data Center host preparation</li><li>Provider Tier-0 and Tenant Tier-1 Gateway</li><li>Connectivity from Tier-0 (using BGP) to Azure Network via Express Route</ul></li>SDDC Compute - VMware vCenter Server provider config<ul><li>Create default cluster</li><li>Configure virtual networking for vMotion, Management, vSAN, and others</ul></li>SDDC backup/restore<ul><li>Back up and restore VMware vCenter Server</li><li>Back up and restore VMware NSX-T Data Center NSX-T Manager</ul></li>SDDC health monitoring and corrective actions, for example: replace failed hosts</br><br>(optional) VMware HCX deploys with fully configured compute profile on cloud side as add-on</br><br>(optional) SRM deploys, upgrade, and scale up/down</br><br>Support - SDDC platforms and VMware HCX      |
| Customer | Request Azure VMware Solution host quote with Microsoft<br>Plan and create a request for SDDCs on Azure portal with:<ul><li>Host count</li><li>Management network range</li><li>Other information</ul></li>Configure SDDC network and security (VMware NSX-T Data Center)<ul><li>Network segments to host applications</li><li>More Tier -1 routers</li><li>Firewall</li><li>VMware NSX-T Data Center LB</li><li>IPsec VPN</li><li>NAT</li><li>Public IP addresses</li><li>Distributed firewall/gateway firewall</li><li>Network extension using VMware HCX or VMware NSX-T Data Center</li><li>AD/LDAP config for RBAC</ul></li>Configure SDDC - VMware vCenter Server<ul><li>AD/LDAP config for RBAC</li><li>Deploy and lifecycle management of Virtual Machines (VMs) and application<ul><li>Install operating systems</li><li>Patch operating systems</li><li>Install antivirus software</li><li>Install backup software</li><li>Install configuration management software</li><li>Install application components</li><li>VM networking using VMware NSX-T Data Center segments</ul></li><li>Migrate Virtual Machines (VMs)<ul><li>VMware HCX configuration</li><li>Live vMotion</li><li>Cold migration</li><li>Content library sync</ul></li></ul></li>Configure SDDC - vSAN<ul><li>Define and maintain vSAN VM policies</li><li>Add hosts to maintain adequate 'slack space'</ul></li>Configure VMware HCX<ul><li>Download and deploy HCA connector OVA in on-premises</li><li>Pairing on-premises VMware HCX connector</li><li>Configure the network profile, compute profile, and service mesh</li><li>Configure VMware HCX network extension/MON</li><li>Upgrade/updates</ul></li>Network configuration to connect to on-premises, virtual network, or internet</br><br>Add or delete hosts requests to cluster from Portal</br><br>Deploy/lifecycle management of partner (third party) solutions      |
| Partner ecosystem | Support for their product/solution. For reference, the following are some of the supported Azure VMware Solution partner solution/product:<ul><li>BCDR - SRM, JetStream, Zerto, and others</li><li>Backup - Veeam, Commvault, Rubrik, and others</li><li>VDI - Horizon/Citrix</li><li>Multitenancy - VMware Cloud director service (CDs), VMware Cloud director availability(VCDA)</li><li>Security solutions - BitDefender, TrendMicro, Checkpoint</li><li>Other VMware products - vRA, vROps, AVI     |


## Next steps

The next step is to learn key [private cloud and cluster concepts](concepts-private-clouds-clusters.md).

<!-- LINKS - external -->

[concepts-private-clouds-clusters]: ./concepts-private-clouds-clusters.md

