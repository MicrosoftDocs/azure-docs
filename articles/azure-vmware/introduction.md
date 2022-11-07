---
title: Introduction
description: Learn the features and benefits of Azure VMware Solution to deploy and manage VMware-based workloads in Azure. Azure VMware Solution SLA guarantees that Azure VMware management tools (vCenter Server and NSX Manager) will be available at least 99.9% of the time.
ms.topic: overview
ms.service: azure-vmware
ms.date: 06/15/2022
---

# What is Azure VMware Solution?

Azure VMware Solution provides you with private clouds that contain VMware vSphere clusters built from dedicated bare-metal Azure infrastructure. The minimum initial deployment is three hosts, but additional hosts can be added one at a time, up to a maximum of 16 hosts per cluster. All provisioned private clouds have VMware vCenter Server, VMware vSAN, VMware vSphere, and VMware NSX-T Data Center. As a result, you can migrate workloads from your on-premises environments, deploy new virtual machines (VMs), and consume Azure services from your private clouds. In addition, Azure VMware Solution management tools (vCenter Server and NSX Manager) are available at least 99.9% of the time. For more information, see [Azure VMware Solution SLA](https://azure.microsoft.com/support/legal/sla/azure-vmware/v1_1/).

Azure VMware Solution is a VMware validated solution with ongoing validation and testing of enhancements and upgrades. Microsoft manages and maintains the private cloud infrastructure and software. It allows you to focus on developing and running workloads in your private clouds to deliver business value.

The diagram shows the adjacency between private clouds and VNets in Azure, Azure services, and on-premises environments. Network access from private clouds to Azure services or VNets provides SLA-driven integration of Azure service endpoints. ExpressRoute Global Reach connects your on-premises environment to your Azure VMware Solution private cloud.
 

:::image type="content" source="media/adjacency-overview-drawing-final.png" alt-text="Diagram of Azure VMware Solution private cloud adjacency to Azure and on-premises." border="false":::

## AV36P and AV52 node sizes generally available in Azure VMware Solution

 The new node sizes increase memory and storage options to optimize your workloads. These gains in performance enable you to do more per server, break storage bottlenecks, and lower transaction costs of latency-sensitive workloads. The availability of these new nodes allows large latency-sensitive services to be hosted efficiently on the Azure VMware Solution infrastructure.

**AV36P key highlights for Memory and Storage optimized Workloads:**

- Runs on Intel® Xeon® Gold 6240 Processor with 36 Cores and a Base Frequency of 2.6Ghz and Turbo of 3.9Ghz.
- 768 GB of DRAM Memory
- 19.2 TB Storage Capacity with all NVMe based SSDs (With Random Read of 636500 IOPS and Random Write of 223300 IOPS)
- 1.5TB of NVMe Cache

**AV52 key highlights for Memory and Storage optimized Workloads:**

- Runs on Intel® Xeon® Platinum 8270 with 52 Cores and a Base
Frequency of 2.7Ghz and Turbo of 4.0Ghz.
- 1.5 TB of DRAM Memory
- 38.4TB storage capacity with all NVMe based SSDs (With Random Read of 636500 IOPS and Random Write of 223300 IOPS)
- 1.5TB of NVMe Cache

For pricing and region availability, see the [Azure VMware Solution pricing page](https://azure.microsoft.com/pricing/details/azure-vmware/) and see the [Products available by region page](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/).

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

## Next steps

The next step is to learn key [private cloud and cluster concepts](concepts-private-clouds-clusters.md).

<!-- LINKS - external -->

<!-- LINKS - internal -->
[concepts-private-clouds-clusters]: ./concepts-private-clouds-clusters.md

