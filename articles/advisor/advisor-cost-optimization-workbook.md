---
title: Understand and optimize your Azure costs with the new Azure Cost Optimization workbook.
description: Understand and optimize your Azure costs with the new Azure Cost Optimization workbook.
ms.topic: article
ms.date: 12/28/2023
author: pedrocsousa 
ms.author: pesousa 

---

# Understand and optimize your Azure costs using the Cost Optimization workbook
The Azure Cost Optimization workbook is designed to provide an overview and help you optimize costs of your Azure environment. It offers a set of cost-relevant insights and recommendations aligned with the Well-Architected Framework Cost Optimization pillar.

## Overview
The Azure Cost Optimization workbook serves as a centralized hub for some of the most commonly used tools that can help you drive utilization and efficiency goals. It offers a range of recommendations, including Azure Advisor cost recommendations, identification of idle resources, and management of improperly deallocated Virtual Machines. Additionally, it provides recommendations for applying Azure Reservations and Savings Plan for Compute and insights into using Azure Hybrid Benefit options. The workbook template is available in Azure Advisor gallery.

Here’s how to get started:

1. Navigate to [Workbooks gallery](https://aka.ms/advisorworkbooks) in Azure Advisor.
1. Open **Cost Optimization (Preview)** workbook template.

The workbook is organized into different tabs and subtabs, each focusing on a specific area to help you reduce the cost of your Azure environment.

* Overview
* Rate Optimization

    * Azure Hybrid Benefit
    * Azure Reservations
    * Azure Savings Plan for Compute

* Usage Optimization

    * Compute
    * Storage
    * Networking
    * Other popular Azure services

Each tab supports the following capabilities:
*	**Filters** - use subscription, resource group, and tag filters to focus on a specific workload.
*	**Export** - export the recommendations to share the insights and collaborate with your team more effectively.
*	**Quick Fix** - apply the recommended optimization directly from the workbook page, streamlining the optimization process.

:::image type="content" source="./media/advisor-cost-optimization-workbook-overview.png" alt-text="Screenshot of Sample Advisor Workbook showing the different available tabs on the main screen and highlighting the goal of the workbook." lightbox="./media/advisor-cost-optimization-workbook-overview.png"::: 

> [!NOTE]
> The workbook serves as guidance and doesn't guarantee cost reduction.


### Welcome
The home page of the workbook highlights the goal and prerequisites. It also provides a way to submit feedback and raise issues.

### Resource overview
This image shows the resources distribution per region. Here, you should review where most of the resources are located and understand if there's data being transferred to other regions and if this behavior is expected, since data transfer costs might apply. It's important to notice that the cost of an Azure service can vary between locations based on on-demand and local infrastructure costs and replication costs.

### Security Recommendations

The Security Recommendations query focuses on reviewing the Azure Advisor security recommendations.
Potentially, you could enhance the security of your workloads by reinvesting some of the cost savings identified from the workbook assessment.

### Reliability recommendations

The Reliability Recommendations query focuses on reviewing the Azure Advisor reliability recommendations.
Potentially, you could enhance the reliability of your workloads by reinvesting some of the cost savings identified from the workbook assessment.

## Rate Optimization

The Rate Optimization tab focuses on reviewing potential savings related to the rate optimization of your Azure services.

:::image type="content" source="./media/advisor-cost-optimization-workbook-rate-optimization.png" alt-text="Screenshot of Advisor Cost Optimization Workbook with the Rate Optimization tab selected." lightbox="./media/advisor-cost-optimization-workbook-rate-optimization.png" :::

### Azure Hybrid Benefit

Azure Hybrid Benefit represents an excellent opportunity to save on Virtual Machines (VMs) operating system costs. Using the workbook, you can identify the opportunities to use the Azure Hybrid Benefit for VM/VMSS (Windows and Linux), SQL (SQL Server VMs, SQL DB and SQL MI), and Azure Stack HCI (VMs and AKS).

> [!NOTE]
> If you select a Dev/Test subscription in the scope of the workbook, then you should already have discounts on Windows and SQL licenses. So, any recommendations shown on the page don’t apply to the subscription.

#### Windows VM/VMSS

Azure Hybrid Benefit represents an excellent opportunity to save on Virtual Machines OS costs.
If you have Software Assurance, you can enable the [Azure Hybrid Benefit](../virtual-machines/windows/hybrid-use-benefit-licensing.md). You can see potential savings using [Azure Hybrid Benefit Calculator](https://azure.microsoft.com/pricing/hybrid-benefit/#calculator).

> [!NOTE]
> The query has a Quick Fix column that helps you to apply Azure Hybrid Benefit to Windows VMs.

#### Linux VM/VMSS

[Azure Hybrid Benefit for Linux](../virtual-machines/linux/azure-hybrid-benefit-linux.md) is a licensing benefit that helps you to significantly reduce the costs of running your Red Hat Enterprise Linux (RHEL) and SUSE Linux Enterprise Server (SLES) virtual machines (VMs) in the cloud.

#### SQL

Azure Hybrid Benefit represents an excellent opportunity to save costs on SQL instances.
If you have Software Assurance, you can enable [SQL Hybrid Benefit](/azure/azure-sql/azure-hybrid-benefit).
You can see potential savings using [Azure Hybrid Benefit Calculator](https://azure.microsoft.com/pricing/hybrid-benefit/#calculator).

#### Azure Stack HCI

Azure Hybrid Benefit represents an excellent opportunity to save costs on Azure Stack HCI. If you have Software Assurance, you can enable [Azure Stack HCI Hybrid Benefit](/azure-stack/hci/concepts/azure-hybrid-benefit-hci).

### Azure Reservations

Review Azure Reservations cost saving opportunities. Use filters for subscriptions, a look back period (7, 30 or 60 days), a term (1 year or 3 years), and a resource type. Learn more about [What are Azure Reservations?](../cost-management-billing/reservations/save-compute-costs-reservations.md) and how much you can [save with Reservations](https://azure.microsoft.com/pricing/reservations).

### Azure savings plan for compute

Review Azure savings plan for compute cost saving opportunities. Use filters for subscriptions, a look back period (7, 30 or 60 days), and a term (1 year or 3 years). Learn more about [What is Azure savings plans for compute?](https://azure.microsoft.com/pricing/offers/savings-plan-compute) and how much you can [save with Savings Plan for Compute](https://azure.microsoft.com/pricing/offers/savings-plan-compute).

## Usage Optimization

The Usage Optimization tab focuses on reviewing potential savings related to usage optimization of your Azure services.

:::image type="content" source="./media/advisor-cost-optimization-workbook-usage-optimization.png" alt-text="Screenshot of Advisor Cost Optimization Workbook with the Usage Optimization tab selected." lightbox="./media/advisor-cost-optimization-workbook-usage-optimization.png" :::

### Compute

The following queries show compute resources that you can optimize to save money.

#### Virtual Machines in a Stopped State

This query identifies Virtual Machines that aren't properly deallocated. If a virtual machine’s status is Stopped rather than Stopped (Deallocated), you're still billed for the resource as the hardware remains allocated for you. Learn more about [States and billing status of Azure Virtual Machines](../virtual-machines/states-billing.md).

#### Deallocated virtual machines

A virtual machine in a deallocated state is not only powered off, but the underlying host infrastructure is also released, resulting in no charges for the allocated resources while the VM is in this state. However, some Azure resources such as disks and networking continue to incur charges.

#### Virtual Machine Scale Sets

This query focuses on cost optimization opportunities specific to Virtual Machine Scale Sets. It provides recommendations such as:

* Consider using Azure Spot VMs for workloads that can handle interruptions, early terminations, or evictions. For example, workloads such as batch processing jobs, development and testing environments, and large compute workloads may be good candidates for scheduling on a spot node pool.
* Spot priority mix: Azure provides the flexibility of running a mix of uninterruptible standard VMs and interruptible Spot VMs for Virtual Machine Scale Set deployments. You can use the Spot Priority Mix using Flexible orchestration to easily balance between high-capacity availability and lower infrastructure costs according to workload requirements.

#### Advisor Recommendations
Review the Advisor recommendations for Compute. Some of the recommendations available in this tile could be "Optimize virtual machine spend by resizing or shutting down underutilized instances", or "Buy reserved virtual machine instances to save money over pay-as-you-go costs."

### Storage

The following queries show storage resources that you can optimize to save money.

#### Storage accounts which are not v2

The Storage accounts which are not v2 query focuses on identifying the storage accounts which are configured as v1. There are several reasons to justify upgrading to v2, such as:

* Ability to enable Storage Lifecycle Management;
* Storage Reserved Instances;
* Access tiers - you can transition data from a hotter access tier to a cooler access tier if there's no access for a period.

Upgrading a v1 storage account to a general-purpose v2 account is free. You can specify the desired account tier during the upgrade process. If an account tier isn't specified on the upgrade, the default account tier of the upgraded account will be Hot. However, changing the storage access tier after the upgrade may result in changes to your bill, so we recommend that you specify the new account tier during an upgrade.

#### Unattached Managed Disks

The Unattached Managed Disks query helps you to identify unattached managed disks. Unattached disks represent a cost in the subscription. The query automatically ignores disks used by Azure Site Recovery. Use the information to identify and remove any unattached disks that are no longer needed.

> [!NOTE]
> The query has a Quick Fix column that helps you to remove the disk if not needed.

#### Disk Snapshots with + 30 Days

The Disk Snapshots with + 30 Days query identifies snapshots that are older than 30 days. Identifying and managing outdated snapshots can help you optimize storage costs and ensure efficient use of your Azure environment.

#### Snapshots using premium storage

To save 60% of cost, we recommend storing your snapshots in Standard Storage, regardless of the storage type of the parent disk. It's the default option for Managed Disks snapshots. Migrate your snapshot from Premium to Standard Storage.

#### Snapshots with deleted source disk

The Snapshots with deleted source disk query identifies snapshots where the source disk has been deleted.

#### Idle Backup

Review protected items backup activity to determine if there are items not backed up in the last 90 days. This could either mean that the underlying resource that's being backed up doesn't exist anymore or there's some issue with the resource that's preventing backups from being taken reliably.

#### Backup storage redundancy settings

By default, when you configure backup for resources, geo-redundant storage (GRS) replication is applied to these backups. While this is the recommended storage replication option as it creates more redundancy for your critical data, you can choose to protect items using locally-redundant storage (LRS) if that meets your backup availability needs for dev-test workloads. Using LRS instead of GRS halves the cost of your backup storage.

#### Advisor Recommendations

Review the Advisor recommendations for Storage. Some of the recommendations available in this tile could be "Blob storage reserved capacity", or "Use lifecycle management".

### Networking

The following queries show networking resources that you can optimize to save money.

#### Azure Firewall Premium

The Azure Firewall Premium query identifies Azure Firewalls with Premium SKU and evaluates whether the associated policy incorporates premium-only features or not. If a Premium SKU Firewall lacks a policy with premium features, such as TLS or intrusion detection, it is shown on the page. For more information about Azure Firewall SKUs, see [SKU comparison table](../firewall/choose-firewall-sku.md).

#### Azure Firewall instances per region

Optimize the use of Azure Firewall by having a central instance of Azure Firewall in the hub virtual network or Virtual WAN secure hub. Share the same firewall across many spoke virtual networks that are connected to the same hub from the same region. Ensure there's no unexpected cross-region traffic as part of the hub-spoke topology, nor multiple Azure firewall instances deployed to the same region. To learn more about Azure Firewall design principles, check [Azure Well-Architected Framework review - Azure Firewall](/azure/well-architected/service-guides/azure-firewall#cost-optimization).

#### Application Gateway with empty backend pool

Review the Application Gateways with empty backend pools.
App gateways are considered idle if there isn't any backend pool with targets.

#### Load Balancer with empty backend pool

Review the Standard Load Balancers with empty backend pools. Load Balancers are considered idle if there isn’t any backend pool with targets.

#### Unattached Public IPs

Review the orphan Public IP Addresses. The query also shows Public IP addresses attached to idle network interface cards (NIC).

#### Virtual Network Gateways

Review idle Virtual Network Gateways that have no connections defined, as they may represent additional cost.

#### Advisor Recommendations

Review the Advisor recommendations for Networking. Some of the recommendations available in this tile could be "Reduce costs by deleting or reconfiguring idle virtual network gateways", or "Reduce costs by eliminating unprovisioned ExpressRoute circuits."

### Top 10 services

The following queries show other popular Azure resources that you can optimize to save money.

#### Web Apps

Review the App Service list.

* Review the Stopped App Services as they will be charged.

* Consider upgrading from the V2 SKU to the V3 SKU. The V3 SKU is cheaper than similar V2 SKU and allows [Reserved Instances and Savings plan for compute](https://azure.microsoft.com/pricing/details/app-service/windows/).

* Determine the right reserved instance size before you buy - Before you buy a reservation, you should determine the size of the Premium v3 reserved instance that you need. The following sections help you determine the right Premium v3 reserved instance size.

* Use Autoscale appropriately - Autoscale can be used to provision resources for when they're needed or on demand, which allows you to minimize costs when your environment is idle.

#### Azure Kubernetes Clusters (AKS)

Review the AKS list. Some of the cost optimization opportunities are:

* Enable cluster autoscaler to automatically adjust the number of agent nodes in response to resource constraints.
* Consider using Azure Spot VMs for workloads that can handle interruptions, early terminations, or evictions. For example, workloads such as batch processing jobs, development and testing environments, and large compute workloads may be good candidates for scheduling on a spot node pool.
* Utilize the Horizontal pod autoscaler to adjust the number of pods in a deployment depending on CPU utilization or other select metrics.
* Use the Start/Stop feature in Azure Kubernetes Services (AKS).
* Use appropriate VM SKU per node pool and reserved instances where long-term capacity is expected.

#### Azure Synapse

Review the Azure Synapse workspaces that don't have any SQL pools attached to them.

#### Monitoring

Review [Azure Monitor - Best Practices](../azure-monitor/best-practices-cost.md) for design checklists and configuration recommendations related to Azure Monitor Logs, Azure resources, Alerts, Virtual machines, Containers, and Application Insights.

**Log Analytics**

Review costs related to data ingestion on Log Analytics. The following advice could be of help in cost optimization:

* Adopt commitment tiers where applicable.
* Adopt Azure Monitor Logs dedicated cluster if a single workspace does not ingest enough data as per the minimum commitment tier (100 GB/day) or if it is possible to aggregate ingestion costs from more than one workspace in the same region.
* Convert the free tier based workspace to Pay-as-you-go model and add them to an Azure Monitor Logs dedicated cluster where possible.

🖱️ Select one or more Log Analytics workspaces to review the daily ingestion trend for the past 30 days and understand its usage.

**Azure Advisor Cost recommendations**

Review the Advisor recommendations for Log Analytics. Some of the recommendations available in this tile could be *Consider removing unused restored tables* or *Consider configuring the low-cost Basic logs plan on selected tables*.

For more information, see: 
* [Well-Architected cost optimization design principles](/azure/well-architected/cost/principles)
* [Cloud Adoption Framework manage cloud costs](/azure/cloud-adoption-framework/get-started/manage-costs)
* [Azure FinOps principles](/azure/cost-management-billing/finops/overview-finops)
* [Azure Advisor cost recommendations](advisor-reference-cost-recommendations.md)
