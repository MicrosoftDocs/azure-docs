---
title: Sovereign cloud feature variations
description: List of feature variations and usage limitations for Advisor in sovereign clouds.
ms.topic: article
ms.custom: ignite-2022
ms.date: 09/19/2022
---

# Azure Advisor in sovereign clouds

Azure sovereign clouds enable you to build and digitally transform workloads in the cloud while meeting your security, compliance, and policy requirements.

## Azure Government (United States)

The following Azure Advisor recommendation **features aren't currently available** in Azure Government:

### Cost

- (Preview) Consider App Service stamp fee reserved capacity to save over your on-demand costs.
- (Preview) Consider Azure Data Explorer reserved capacity to save over your pay-as-you-go costs.
- (Preview) Consider Azure Synapse Analytics (formerly SQL DW) reserved capacity to save over your pay-as-you-go costs.
- (Preview) Consider Blob storage reserved capacity to save on Blob v2 and Data Lake Storage Gen2 costs.
- (Preview) Consider Blob storage reserved instance to save on Blob v2 and Data Lake Storage Gen2 costs.
- (Preview) Consider Cache for Redis reserved capacity to save over your pay-as-you-go costs.
- (Preview) Consider Azure Cosmos DB reserved capacity to save over your pay-as-you-go costs.
- (Preview) Consider Database for MariaDB reserved capacity to save over your pay-as-you-go costs.
- (Preview) Consider Database for MySQL reserved capacity to save over your pay-as-you-go costs.
- (Preview) Consider Database for PostgreSQL reserved capacity to save over your pay-as-you-go costs.
- (Preview) Consider SQL DB reserved capacity to save over your pay-as-you-go costs.
- (Preview) Consider SQL PaaS DB reserved capacity to save over your pay-as-you-go costs.
- Consider App Service stamp fee reserved instance to save over your on-demand costs.
- Consider Azure Synapse Analytics (formerly SQL DW) reserved instance to save over your pay-as-you-go costs.
- Consider Cache for Redis reserved instance to save over your pay-as-you-go costs.
- Consider Azure Cosmos DB reserved instance to save over your pay-as-you-go costs.
- Consider Database for MariaDB reserved instance to save over your pay-as-you-go costs.
- Consider Database for MySQL reserved instance to save over your pay-as-you-go costs.
- Consider Database for PostgreSQL reserved instance to save over your pay-as-you-go costs.
- Consider SQL PaaS DB reserved instance to save over your pay-as-you-go costs.

### Operational

- Add Azure Monitor to your virtual machine (VM) labeled as production.
- Delete and recreate your pool using a VM size that will soon be retired.
- Enable Traffic Analytics to view insights into traffic patterns across Azure resources.
- Enforce 'Add or replace a tag on resources' using Azure Policy.
- Enforce 'Allowed locations' using Azure Policy.
- Enforce 'Allowed virtual machine SKUs' using Azure Policy.
- Enforce 'Audit VMs that don't use managed disks' using Azure Policy.
- Enforce 'Inherit a tag from the resource group' using Azure Policy.
- Update Azure Spring Cloud API Version.
- Update your outdated Azure Spring Cloud SDK to the latest version.
- Upgrade to the latest version of the Immersive Reader SDK.

### Performance

- Accelerated Networking may require stopping and starting the VM.
- Arista Networks vEOS Router may experience high CPU utilization, reduced throughput and high latency.
- Barracuda Networks NextGen Firewall may experience high CPU utilization, reduced throughput and high latency.
- Cisco Cloud Services Router 1000V may experience high CPU utilization, reduced throughput and high latency.
- Consider increasing the size of your NVA to address persistent high CPU.
- Distribute data in server group to distribute workload among nodes.
- More than 75% of your queries are full scan queries.
- NetApp Cloud Volumes ONTAP may experience high CPU utilization, reduced throughput and high latency.
- Palo Alto Networks VM-Series Firewall may experience high CPU utilization, reduced throughput and high latency.
- Reads happen on most recent data.
- Rebalance data in Hyperscale (Citus) server group to distribute workload among worker nodes more evenly.
- Update Attestation API Version.
- Update Key Vault SDK Version.
- Update to the latest version of your Arista VEOS product for Accelerated Networking support.
- Update to the latest version of your Barracuda NG Firewall product for Accelerated Networking support.
- Update to the latest version of your Check Point product for Accelerated Networking support.
- Update to the latest version of your Cisco Cloud Services Router 1000V product for Accelerated Networking support.
- Update to the latest version of your F5 BigIp product for Accelerated Networking support.
- Update to the latest version of your NetApp product for Accelerated Networking support.
- Update to the latest version of your Palo Alto Firewall product for Accelerated Networking support.
- Upgrade your ExpressRoute circuit bandwidth to accommodate your bandwidth needs.
- Use SSD Disks for your production workloads.
- vSAN capacity utilization has crossed critical threshold.

### Reliability

- Avoid hostname override to ensure site integrity.
- Check Point Virtual Machine may lose Network Connectivity.
- Drop and recreate your HDInsight clusters to apply critical updates.
- Upgrade device client SDK to a supported version for IotHub.
- Upgrade to the latest version of the Azure Connected Machine agent.

## Right size calculations

The calculation for recommending that you should right-size or shut down underutilized virtual machines in Azure Government is as follows:

- Advisor monitors your virtual machine usage for seven days and identifies low-utilization virtual machines.
- Virtual machines are considered low utilization if their CPU utilization is 5% or less and their network utilization is less than 2%, or if the current workload can be accommodated by a smaller virtual machine size.

If you want to be more aggressive at identifying underutilized virtual machines, you can adjust the CPU utilization rule on a per subscription basis.

## Next steps

For more information about Advisor recommendations, see:

- [Introduction to Azure Advisor](./advisor-overview.md)
- [Reliability recommendations](./advisor-high-availability-recommendations.md)
- [Performance recommendations](./advisor-reference-performance-recommendations.md)
- [Cost recommendations](./advisor-reference-cost-recommendations.md)
- [Operational excellence recommendations](./advisor-reference-operational-excellence-recommendations.md)
