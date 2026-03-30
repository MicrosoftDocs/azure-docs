---
title: View quality checks and insights for a Virtual Instance for SAP solutions
description: Learn how to use quality checks and insights for a Virtual Instance for SAP solutions (VIS) resource in Azure Center for SAP solutions.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: how-to
ms.date: 03/19/2026
author: sagarkeswani
ms.author: sagarkeswani
# Customer intent: As an SAP system administrator, I want to use the quality checks feature to gather insights on my Virtual Instance for SAP solutions, so that I can ensure optimal performance and adherence to best practices for my SAP environment on Azure.
---

# View quality checks and insights for a Virtual Instance for SAP solutions

[Azure Center for SAP solutions](overview.md) includes a Quality Insights workbook that runs more than 100 quality checks on your Virtual Instance for SAP solutions (VIS) resources. These checks validate that your SAP system follows Azure and SAP best practices for reliability and performance.

In this article, you use the Quality Insights workbook to review recommendations, virtual machine (VM) information, and configuration checks for your SAP system.

## Prerequisites

- An SAP system that you [created with Azure Center for SAP solutions](deploy-s4hana.md) or [registered with Azure Center for SAP solutions](register-existing-system.md).

## Open the Quality Insights workbook

To open the workbook:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **Azure Center for SAP solutions** in the Azure portal search bar.
1. On the **Azure Center for SAP solutions** page, in the sidebar menu, select **Virtual Instances for SAP solutions**.
1. On the **Virtual Instances for SAP solutions** page, select the VIS that you want to get insights about.

    :::image type="content" source="media/get-quality-checks-insights/select-vis.png" lightbox="media/get-quality-checks-insights/select-vis.png" alt-text="Screenshot of Azure portal, showing the list of available Virtual Instances for SAP solutions in a subscription.":::

1. On the sidebar menu for the VIS under **Monitoring**, select **Quality Insights**.

    :::image type="content" source="media/get-quality-checks-insights/quality-insights.png" lightbox="media/get-quality-checks-insights/quality-insights.png" alt-text="Screenshot of Azure portal, showing the Quality Insights workbook page selected in the sidebar menu for a Virtual Instance for SAP solutions.":::

The workbook has multiple sections:

- Select the **Advisor Recommendations** tab to [see the list of recommendations](#get-advisor-recommendations).
- Select the **Virtual Machine** tab to [find information about the VMs in your VIS](#get-vm-information).
- Select the **Configuration Checks** tab to [see configuration checks for your VIS](#run-configuration-checks).

## Get Advisor recommendations

The quality checks feature in Azure Center for SAP solutions runs validation checks for all VIS resources. These quality checks validate that SAP system configurations follow best practices for SAP on Azure. If a VIS doesn't follow these best practices, you receive a recommendation from Azure Advisor.

Azure Center for SAP solutions runs more than 100 quality checks on all VIS resources across the following categories:

- Azure infrastructure checks
- OS parameter checks
- High availability (HA) load balancer checks
- HANA database file system checks
- OS parameter checks for Azure NetApp Files (ANF) file system
- Pacemaker configuration checks for HANA database and ASCS instance for SUSE and Red Hat
- OS configuration checks for application instances

The table in the **Advisor Recommendations** tab shows all the recommendations for ASCS, Application, and Database instances in the VIS.

:::image type="content" source="media/get-quality-checks-insights/advisor-recommendation.png" lightbox="media/get-quality-checks-insights/advisor-recommendation.png" alt-text="Screenshot of the Advisor Recommendations tab, showing overview of recommendations for all instances in the VIS.":::

Select an instance name to see all recommendations, including which action to take to resolve an issue.

:::image type="content" source="media/get-quality-checks-insights/recommendation-detail.png" lightbox="media/get-quality-checks-insights/recommendation-detail.png" alt-text="Screenshot of detailed advisor recommendations for an instance and which actions to take to resolve each issue.":::

### Set alerts for quality check recommendations

Because the quality check recommendations in Azure Center for SAP solutions are integrated with Azure Advisor, you can set alerts for the recommendations. For more information, see [Configure alerts for recommendations](/azure/advisor/advisor-alerts-portal).

> [!NOTE]
> The quality checks run on all VIS instances hourly. The corresponding Azure Advisor recommendations also refresh hourly. If you take action on one or more recommendations, wait for the next refresh to see any new recommendations from Azure Advisor.

> [!IMPORTANT]
> Azure Advisor filters out recommendations for deleted Azure resources for seven days. If you delete a VIS and then re-register it, Advisor recommendations appear after seven days.

## Get VM information

The **Virtual Machine** tab provides insights about the VMs in your VIS. It includes the following subsections:

- [Azure Compute](#azure-compute)
- [Compute List](#compute-list)
- [Compute Extensions](#compute-extensions)
- [Compute + OS Disk](#compute--os-disk)
- [Compute + Data Disks](#compute--data-disks)

### Azure Compute

The **Azure Compute** tab shows summary information about the VMs in the VIS. A visual shows the running status of all VMs.

:::image type="content" source="media/get-quality-checks-insights/azure-compute-metrics.png" lightbox="media/get-quality-checks-insights/azure-compute-metrics.png" alt-text="Screenshot of Azure Compute tab, showing a pie chart of running virtual machines and key metrics.":::

Below the visual, key monitoring metrics at the VM level show 24-hour trends for VM Availability, CPU, Disk, and Network usage.

:::image type="content" source="media/get-quality-checks-insights/azure-compute-health.png" lightbox="media/get-quality-checks-insights/azure-compute-health.png" alt-text="Screenshot of Azure Compute tab, showing a pie chart of running virtual machines.":::

The tab also shows the current availability state of VMs and the reasons for unavailability. It also lists key health events from the last 14 days for VMs in the VIS.

### Compute List

The **Compute List** tab shows a table of information about the VMs in the VIS. This information includes:

- VM names and state
- SKU
- Operating system
- Publisher
- Image version and SKU
- Offer
- Azure region
- Resource group
- Tags and more

You can toggle **Show Help** to see more information about the table data.

Select a VM name to see its overview page, and change settings like **Boot Diagnostic**.

:::image type="content" source="media/get-quality-checks-insights/vm-compute-list.png" lightbox="media/get-quality-checks-insights/vm-compute-list.png" alt-text="Screenshot of Compute List tab, showing a table of details about the virtual machines in a Virtual Instance for SAP solutions.":::

### Compute Extensions

The **Compute Extensions** tab shows information about your VM extensions. This section has three tabs:

- [VM+Extensions](#vm--extensions)
- [VM Extensions Status](#vm-extensions-status)
- [Failed VM Extensions](#failed-vm-extensions)

#### VM + Extensions

**VM+Extensions** shows a summary of any VM extensions installed on the VMs in your VIS.

:::image type="content" source="media/get-quality-checks-insights/vm-plus-extensions.png" lightbox="media/get-quality-checks-insights/vm-plus-extensions.png" alt-text="Screenshot of the VM plus Extensions tab, showing a table of virtual machines with the names of virtual machine extensions installed on each resource.":::

#### VM Extensions Status

**VM Extensions Status** shows details about the VM extensions in each VM. You can see each extension's state, version, and if **AutoUpgrade** is enabled.

:::image type="content" source="media/get-quality-checks-insights/vm-extensions-status.png" lightbox="media/get-quality-checks-insights/vm-extensions-status.png" alt-text="Screenshot of the VM extensions status tab, showing the states of each virtual machine extension per virtual machine.":::

#### Failed VM Extensions

**Failed VM Extensions** shows which VM extensions are failing in the selected VIS.

:::image type="content" source="media/get-quality-checks-insights/failed-vm-extensions.png" lightbox="media/get-quality-checks-insights/failed-vm-extensions.png" alt-text="Screenshot of the Failed VM Extensions tab, showing no failed extensions for the selected VIS.":::

### Compute + OS Disk

The **Compute+OS Disk** tab shows a table with OS disk configurations in the SAP system.

:::image type="content" source="media/get-quality-checks-insights/vm-compute-os-disk.png" lightbox="media/get-quality-checks-insights/vm-compute-os-disk.png" alt-text="Screenshot of the Compute plus O S Disk tab, showing a table with operating system disk configurations within the system.":::

### Compute + Data Disks

The **Compute+Data Disks** tab shows a table with data disk configurations in the SAP system.

:::image type="content" source="media/get-quality-checks-insights/vm-compute-data-disks.png" lightbox="media/get-quality-checks-insights/vm-compute-data-disks.png" alt-text="Screenshot of the Compute plus Data Disks tab, showing a table with data disk configurations within the system.":::

## Run configuration checks

The **Configuration Checks** tab provides configuration checks for the VMs in your VIS. It includes the following subsections:

- [Accelerated Networking](#accelerated-networking)
- [Public IP](#public-ip)
- [Backup](#backup)
- [Load Balancer](#load-balancer)

### Accelerated Networking

The **Accelerated Networking** tab shows whether **Accelerated Networking State** is enabled for each network interface card (NIC) in the VIS. Enable this setting for reliability and performance.

:::image type="content" source="media/get-quality-checks-insights/configuration-accelerated-networking.png" lightbox="media/get-quality-checks-insights/configuration-accelerated-networking.png" alt-text="Screenshot of the Accelerated Networking tab, showing a table of virtual machines with their accelerated networking statuses.":::

### Public IP

The **Public IP** tab shows any public IP addresses that are associated with the NICs linked to the VMs in the VIS.

:::image type="content" source="media/get-quality-checks-insights/configuration-public-ip.png" lightbox="media/get-quality-checks-insights/configuration-public-ip.png" alt-text="Screenshot of the Public I P tab, showing a notice that there are no public I P addresses associated with the virtual machines in the system.":::

### Backup

The **Backup** tab shows a table of VMs that don't have Azure Backup configured. Use Azure Backup with your VMs to protect your data.

:::image type="content" source="media/get-quality-checks-insights/configuration-azure-backup.png" lightbox="media/get-quality-checks-insights/configuration-azure-backup.png" alt-text="Screenshot of the Backup tab, showing a table of which virtual machines in the system don't have Azure Backup enabled.":::

### Load Balancer

The **Load Balancer** tab shows information about load balancers connected to the resource groups for the VIS. It has two subsections: [Load Balancer Overview](#load-balancer-overview) and [Load Balancer Monitor](#load-balancer-monitor).

#### Load Balancer Overview

The **Load Balancer Overview** tab shows rules and details for the load balancers in the VIS. You can review:

- Whether HA ports are defined for the load balancers
- Whether the load balancers have floating IP addresses enabled
- Whether keep-alive functionality is enabled (maximum timeout of 30 minutes)

:::image type="content" source="media/get-quality-checks-insights/configuration-load-balancer.png" lightbox="media/get-quality-checks-insights/configuration-load-balancer.png" alt-text="Screenshot of the Load Balancer tab, showing a table with an overview of information for the standard load balancers in the system.":::

#### Load Balancer Monitor

The **Load Balancer Monitor** tab shows monitoring information for the load balancers. You can filter the information by load balancer and time range.

**Load Balancer Key Metrics**, a table that shows important information about the load balancers in the subscription where the VIS exists.

:::image type="content" source="media/get-quality-checks-insights/configuration-load-balancer-monitor.png" lightbox="media/get-quality-checks-insights/configuration-load-balancer-monitor.png" alt-text="Screenshot of the Load Balancer Key Metrics section, showing a table of basic visualized information about load balancers in the system.":::

**Backend health probe by Backend IP**, a chart that shows the health probe status for each load balancer over time.

:::image type="content" source="media/get-quality-checks-insights/configuration-load-balancer-health-probe.png" lightbox="media/get-quality-checks-insights/configuration-load-balancer-health-probe.png" alt-text="Screenshot of the Backend health probe section, showing a graph of load balancer statuses over the selected time range.":::

## Related content

- [Monitor SAP system in the Azure portal](monitor-portal.md)
- [Manage a Virtual Instance for SAP solutions](manage-virtual-instance.md)
- [View cost analysis for an SAP system](view-cost-analysis.md)
