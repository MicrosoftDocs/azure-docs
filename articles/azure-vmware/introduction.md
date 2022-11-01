---
title: Introduction
description: Learn the features and benefits of Azure VMware Solution to deploy and manage VMware-based workloads in Azure. Azure VMware Solution SLA guarantees that Azure VMware management tools (vCenter Server and NSX Manager) will be available at least 99.9% of the time.
ms.topic: overview
ms.service: azure-vmware
ms.date: 10/28/2022
ms.custom: engagement-fy23
---

# What is Azure VMware Solution?

Azure VMware Solution provides you with private clouds that contain VMware vSphere clusters built from dedicated bare-metal Azure infrastructure. The minimum initial deployment is three hosts, but additional hosts can be added one at a time, up to a maximum of 16 hosts per cluster. All provisioned private clouds have VMware vCenter Server, VMware vSAN, VMware vSphere, and VMware NSX-T Data Center. As a result, you can migrate workloads from your on-premises environments, deploy new virtual machines (VMs), and consume Azure services from your private clouds. In addition, Azure VMware Solution management tools (vCenter Server and NSX Manager) are available at least 99.9% of the time. For more information, see [Azure VMware Solution SLA](https://azure.microsoft.com/support/legal/sla/azure-vmware/v1_1/).

Azure VMware Solution is a VMware validated solution with ongoing validation and testing of enhancements and upgrades. Microsoft manages and maintains the private cloud infrastructure and software. It allows you to focus on developing and running workloads in your private clouds to deliver business value.

The diagram shows the adjacency between private clouds and VNets in Azure, Azure services, and on-premises environments. Network access from private clouds to Azure services or VNets provides SLA-driven integration of Azure service endpoints. ExpressRoute Global Reach connects your on-premises environment to your Azure VMware Solution private cloud.

:::image type="content" source="media/adjacency-overview-drawing-final.png" alt-text="Diagram of Azure VMware Solution private cloud adjacency to Azure and on-premises." border="false":::

## Hosts, clusters, and private clouds

[!INCLUDE [host-sku-sizes](includes/disk-capabilities-of-the-host.md)]

You can deploy new or scale existing private clouds through the Azure portal or Azure CLI.

## Networking

[!INCLUDE [avs-networking-description](includes/azure-vmware-solution-networking-description.md)]

For more information, see [Networking concepts](concepts-networking.md).

## Access and security

Azure VMware Solution private clouds use vSphere role-based access control for enhanced security. You can integrate vSphere SSO LDAP capabilities with Azure Active Directory. For more information, see the [Access and Identity concepts](concepts-identity.md).  

vSAN data-at-rest encryption, by default, is enabled and is used to provide vSAN datastore security. For more information, see [Storage concepts](concepts-storage.md).

## Data Residency and Customer Data

Azure VMware Solution does not store customer data.

## VMware software versions

[!INCLUDE [vmware-software-versions](includes/vmware-software-versions.md)]

## Host and software lifecycle maintenance

Regular upgrades of the Azure VMware Solution private cloud and VMware software ensure the latest security, stability, and feature sets are running in your private clouds. For more information, see [Host maintenance and lifecycle management](concepts-private-clouds-clusters.md#host-maintenance-and-lifecycle-management).

## Monitoring your private cloud

Once you’ve deployed Azure VMware Solution into your subscription, [Azure Monitor logs](../azure-monitor/overview.md) are generated automatically.

In your private cloud, you can:
- Collect logs on each of your VMs.
- [Download and install the MMA agent](../azure-monitor/agents/log-analytics-agent.md#installation-options) on Linux and Windows VMs.
- Enable the [Azure diagnostics extension](../azure-monitor/agents/diagnostics-extension-overview.md).
- [Create and run new queries](../azure-monitor/logs/data-platform-logs.md#log-queries).
- Run the same queries you usually run on your VMs.

Monitoring patterns inside the Azure VMware Solution are similar to Azure VMs within the IaaS platform. For more information and how-tos, see [Monitoring Azure VMs with Azure Monitor](../azure-monitor/vm/monitor-vm-azure.md).

## Customer communication
[!INCLUDE [customer-communications](includes/customer-communications.md)]

## Azure VMware Solution Responsibility Matrix - Microsoft vs Customer

Azure VMware Solution implements a shared responsibility model that defines distinct roles and responsibilities of the two parties involved in the offering: Customer and Microsoft. This is illustrated in more details in following two tables.

The following table shows the high-level responsibilities between a customer and Microsoft for different aspects of the deployment/management of the private cloud and the customer application workloads.

:::image type="content" source="media/azure-introduction-shared-responsibility-matrix.png" alt-text="screenshot shows the high-level shared responsibility matrix." lightbox="media/azure-introduction-shared-responsibility-matrix.png":::

The following table provides a detailed list of roles and responsibilities between the customer and Microsoft which encompasses the most frequent tasks and definitions. For further questions, please contact Microsoft.

| **Role** | **Task/details** |
| -------- | ---------------- |
| Microsoft - Azure VMware Solution | Physical infrastructure<ul><li>Azure regions</li><li>Azure availability zones</li><li>Express Route/Global reach</ul></li>Compute/Network/Storage<ul><li>Rack and power Bare Metal hosts</li><li>Rack and power network equipment</ul></li>Software defined Data Center (SDDC) deploy/lifecycle<ul><li>ESXi deploy, patch, and upgrade</li><li>VMware vCenter Server deploy, patch, and upgrade</li><li>VMware NSX-T Data Center deploy, patch, and upgrade</li><li>vSAN deploy, patch, and upgrade</ul></li>SDDC Networking - VMware NSX-T Data Center provider config<ul><li>Edge node/cluster, VMware NSX-T Data Center host preparation</li><li>Provider Tier-0 and Tenant Tier-1 Gateway</li><li>Connectivity from Tier-0 (using BGP) to Azure Network via Express Route</ul></li>SDDC Compute - VMware vCenter Server provider config<ul><li>Create default cluster</li><li>Configure virtual networking for vMotion, Management, vSAN, and others</ul></li>SDDC backup/restore<ul><li>Backup and restore VMware vCenter Server</li><li>Backup and restore VMware NSX-T Data Center NSX-T Manager</ul></li>SDDC health monitoring and corrective actions, for example: replace failed hosts</br><br>(optional) HCX deploy with fully configured compute profile on cloud side as add on</br><br>(optional) SRM deploy, upgrade, and scale up/down</br><br>Support - SDDC platforms and HCX      |
| Customer | Request Azure VMware Solution host quote with Microsoft<br>Plan and create a request for SDDCs on Azure Portal with:<ul><li>Host count</li><li>Management network range</li><li>Other information</ul></li>Configure SDDC network and security (VMware NSX-T Data Center)<ul><li>Network segments to host applications</li><li>Additional Tier -1 routers</li><li>Firewall</li><li>VMware NSX-T Data Center LB</li><li>IPsec VPN</li><li>NAT</li><li>Public IP addresses</li><li>Distributed firewall/gateway firewall</li><li>Network extension using HCX or LB</li><li>AD/LDAP config for RBAC</ul></li>Configure SDDC - VMware vCenter Server<ul><li>AD/LDAP config for RBAC</li><li>Deploy and lifecycle management of Virtual Machines (VMs) and application<ul><li>Install operating systems</li><li>Patch operating systems</li><li>Install antivirus software</li><li>Install backup software</li><li>Install confiuration management software</li><li>Install application components</li><li>VM networking using VMware NSX-T Data Center segments</ul></li><li>Migrate Virtual Machines (VMs)<ul><li>HCX configuration</li><li>Live vMotion</li><li>Cold migration</li><li>Content library sync</ul></li></ul></li>Configure SDDC - vSAN<ul><li>Define and maintain vSAN VM policies</li><li>Add hosts to maintain adequate 'slack space'</ul></li>Configure HCX<ul><li>Download and deploy HCA connector OVA in On-prem</li><li>Pairing On-prem HCX connector</li><li>Configure the network profile, compute profile, and service mesh</li><li>Configure HCX network extension/MON</li><li>Upgrade/updates</ul></li>Network configuration to connect to On-prem, VNET, or internet</br><br>Add or delete hosts requests to cluster from Portal</br><br>Deploy/lifecycle management of partner (3rd party) solutions      |
| Partner ecosystem | Support for their product/solution. For reference, the following are some of the supported Azure VMware Solution partner solution/product:<ul><li>BCDR - SRM, JetStream, RiverMeadow, and others</li><li>Backup - Veeam, Commvault, Rubrik, and others</li><li>VDI - Horizon/Citrix</li><li>Security solutions - BitDefender, TrendMicro, Checkpoint</li><li>Other VMware prroducts - vRA, VRops, AVI     |


## Next steps

The next step is to learn key [private cloud and cluster concepts](concepts-private-clouds-clusters.md).

<!-- LINKS - external -->

<!-- LINKS - internal -->
[concepts-private-clouds-clusters]: ./concepts-private-clouds-clusters.md
