---
title: Understand and optimize your Azure costs with the new Azure Cost Optimization workbook.
description: Understand and optimize your Azure costs with the new Azure Cost Optimization workbook.
ms.topic: article
ms.date: 07/17/2023

---

# Understand and optimize your Azure costs using the Cost Optimization workbook
The Azure Cost Optimization workbook is designed to provide an overview and help you optimize costs of your Azure environment. It offers a set of cost-relevant insights and recommendations aligned with the WAF Cost Optimization pillar.

## Overview
The Azure Cost Optimization workbook serves as a centralized hub for some of the most commonly used tools that can help you drive utilization and efficiency goals. It offers a range of recommendations, including Azure Advisor cost recommendations, identification of idle resources, and management of improperly deallocated Virtual Machines. Additionally, it provides insights into using Azure Hybrid benefit options for Windows, Linux, and SQL databases. The workbook template is available in Azure Advisor gallery.

Here’s how to get started:

1.	Navigate to [Workbooks gallery](https://aka.ms/advisorworkbooks) in Azure Advisor 
1.	Open **Cost Optimization (Preview)** workbook template.

The workbook is organized into different tabs, each focusing on a specific area to help you reduce the cost of your Azure environment. 
* Compute
* Azure Hybrid Benefit
* Storage
* Networking

Each tab supports the following capabilities:
*	**Filters** - use subscription, resource group and tag filters to focus on a specific workload.
*	**Export** - export the recommendations to share the insights and collaborate with your team more effectively.
*	**Quick Fix** - apply the recommended optimization directly from the workbook page, streamlining the optimization process.

:::image type="content" source="media/advisor-cost-optimization-workbook-overview.png" alt-text="Screenshot of the Azure Advisor cost optimization workbook template." lightbox="media/advisor-cost-optimization-workbook-overview.png":::

> [!NOTE]
> The workbook serves as guidance and does not guarantee cost reduction.

## Compute

### Advisor recommendations

This query focuses on reviewing the Advisor recommendations related to compute. Some of the recommendations available in this query could be *Optimize virtual machine spend by resizing or shutting down underutilized instances* or *Buy reserved virtual machine instances to save money over pay-as-you-go costs*.

### Virtual machines in Stopped State

This query identifies Virtual Machines that are not properly deallocated. If a virtual machine’s status is *Stopped* rather than *Stopped (Deallocated)*, you are still billed for the resource as the hardware remains allocated for you.

### Web Apps
This query helps identify Azure App Services with and without Auto Scale, and App Services where the actual app might be stopped.

### Azure Kubernetes Clusters (AKS)

This query focuses on cost optimization opportunities specific to Azure Kubernetes Clusters (AKS). It provides recommendations such as:
*	Enabling cluster autoscaler to automatically adjust the number of agent nodes in response to resource constraints.
*	Considering the use of Azure Spot VMs for workloads that can handle interruptions, early terminations, or evictions.
*	Utilizing the Horizontal Pod Autoscaler to adjust the number of pods in a deployment based on CPU utilization or other selected metrics.
*	Using the Start/Stop feature in Azure Kubernetes Services (AKS) to optimize cost during off-peak hours.
*	Using appropriate VM SKUs per node pool and considering reserved instances where long-term capacity is expected.

### Azure Hybrid Benefit

Windows VMs and VMSS not using Hybrid Benefit

Azure Hybrid Benefit represents an excellent opportunity to save on Virtual Machines OS costs. You can see potential savings using Azure Hybrid Benefit Calculator Check this link to learn more about the Azure Hybrid Benefit.

> [!NOTE]
> If you have selected Dev/Test subscription(s) within the scope of this Workbook then they should already have discounts on Windows licenses so recommendations here don’t apply to this subscription(s)

### Linux VM not using Hybrid Benefit

Similar to Windows VMs, Azure Hybrid Benefit provides an excellent opportunity to save on Virtual Machine OS costs. The Azure Hybrid Benefit for Linux is a licensing benefit that significantly reduces the costs of running Red Hat Enterprise Linux (RHEL) and SUSE Linux Enterprise Server (SLES) virtual machines (VMs) in the cloud.

### SQL HUB Licenses

Azure Hybrid Benefit can also be applied to SQL services, such as SQL server on VMs, SQL Database or SQL Managed Instance.

## Storage

### Advisor recommendations

Review the Advisor recommendations for Storage. This section provides insights into various recommendations such as “Blob storage reserved capacity” or “Use lifecycle management.” These recommendations can help optimize your storage costs and improve efficiency.
Unattached Managed Disks
This query focuses on the list of managed unattached disks. It automatically ignores disks used by Azure Site Recovery. Use this information to identify and remove any unattached disks that are no longer needed.

> [!NOTE]
> This query has a Quick Fix column that helps you to remove the disk if not needed.

### Disk snapshots older than 30 days
This query identifies snapshots that are older than 30 days. Identifying and managing outdated snapshots can help you optimize storage costs and ensure efficient use of your Azure environment.

## Networking

### Advisor recommendations
Review the Advisor recommendations for Networking. This section provides insights into various recommendations, such as “Reduce costs by deleting or reconfiguring idle virtual network gateways” or “Reduce costs by eliminating unprovisioned ExpressRoute circuits.”

### Application Gateway with empty backend pool

Review the Application Gateways with empty backend pools. App gateways are considered idle if there isn’t any backend pool with targets.

### Load Balancer with empty backend pool

Review the Load Balancers with empty backend pools. Load Balancers are considered idle if there isn’t any backend pool with targets.

### Unattached Public IPs

Review the list of idle Public IP Addresses. This query also shows Public IP addresses attached to idle Network Interface Cards (NICs)

### Idle Virtual Network Gateways

Review the Idle Virtual Network Gateways. This query shows VPN Gateways without any active connection.

For more information, see: 
* [Well-Architected cost optimization design principles](/azure/well-architected/cost/principles)
* [Cloud Adoption Framework manage cloud costs](/azure/cloud-adoption-framework/get-started/manage-costs)
* [Azure FinOps principles](/azure/cost-management-billing/finops/overview-finops)
* [Azure Advisor cost recommendations](advisor-reference-cost-recommendations.md)

