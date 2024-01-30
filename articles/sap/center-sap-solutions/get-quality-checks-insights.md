---
title: Get quality checks and insights for a Virtual Instance for SAP solutions
description: Learn how to get quality checks and insights for a Virtual Instance for SAP solutions (VIS) resource in Azure Center for SAP solutions through the Azure portal.
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.topic: how-to
ms.date: 10/19/2022
author: sagarkeswani
ms.author: sagarkeswani
#Customer intent: As a developer, I want to use the quality checks feature so that I can learn more insights about virtual machines within my Virtual Instance for SAP resource.
---

# Get quality checks and insights for a Virtual Instance for SAP solutions



The *Quality Insights* Azure workbook in *Azure Center for SAP solutions* provides insights about the SAP system resources as a result of running *more than 100 quality checks on the VIS*. The feature is part of the monitoring capabilities built in to the *Virtual Instance for SAP solutions (VIS)*. These quality checks make sure that your SAP system uses Azure and SAP best practices for reliability and performance. 

In this how-to guide, you'll learn how to use quality checks and insights to get more information about various configurations within your SAP system.

## Prerequisites

- An SAP system that you've [created with Azure Center for SAP solutions](deploy-s4hana.md) or [registered with Azure Center for SAP solutions](register-existing-system.md). 

## Open Quality Insights workbook

To open the workbook:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for and select **Azure Center for SAP solutions** in the Azure portal search bar.
1. On the **Azure Center for SAP solutions** page's sidebar menu, select **Virtual Instances for SAP solutions**.
1. On the **Virtual Instances for SAP solutions** page, select the VIS that you want to get insights about.

    :::image type="content" source="media/get-quality-checks-insights/select-vis.png" lightbox="media/get-quality-checks-insights/select-vis.png" alt-text="Screenshot of Azure portal, showing the list of available virtual instances for SAP in a subscription.":::

1. On the sidebar menu for the VIS, under **Monitoring** select **Quality Insights**. 

    :::image type="content" source="media/get-quality-checks-insights/quality-insights.png" lightbox="media/get-quality-checks-insights/quality-insights.png" alt-text="Screenshot of Azure portal, showing the Quality Insights workbook page selected in the sidebar menu for a virtual Instance for SAP solutions.":::

There are multiple sections in the workbook:
- Select the default **Advisor Recommendations** tab to [see the list of recommendations made by Azure Center for SAP solutions for the different instances in your VIS](#get-advisor-recommendations)
- Select the **Virtual Machine** tab to [find information about the VMs in your VIS](#get-vm-information)
- Select the **Configuration Checks** tab to [see configuration checks for your VIS](#run-configuration-checks)

## Get Advisor Recommendations

The **Quality checks** feature in Azure Center for SAP solutions runs validation checks for all VIS resources. These quality checks validate the SAP system configurations follow the best practices recommended for SAP on Azure. If a VIS doesn't follow these best practices, you receive a recommendation from Azure Advisor.
Azure Center for SAP solutions runs more than 100 quality checks on all VIS resources. These checks span across the following categories: 

- Azure Infrastructure checks
- OS parameter checks.
- High availability (HA) Load Balancer checks
- HANA DB file system checks.
- OS parameter checks for ANF file system.
- Pacemaker configuration checks for HANA DB and ASCS Instance for SUSE and Redhat 
- OS Configuration checks for Application Instances

The table in the **Advisor Recommendations** tab shows all the recommendations for ASCS, Application and Database instances in the VIS.

:::image type="content" source="media/get-quality-checks-insights/advisor-recommendation.png" lightbox="media/get-quality-checks-insights/advisor-recommendation.png" alt-text="Screenshot of the Advisor Recommendations tab, showing overview of recommendations for all instances in the VIS.":::

Select an instance name to see all recommendations, including which action to take to resolve an issue.

:::image type="content" source="media/get-quality-checks-insights/recommendation-detail.png" lightbox="media/get-quality-checks-insights/recommendation-detail.png" alt-text="Screenshot of detailed advisor recommendations for an instance and which actions to take to resolve each issue.":::

### Set Alerts for Quality check recommendations
As the Quality checks recommendations in Azure Center for SAP solutions are integrated with *Azure Advisor*, you can set alerts for the recommendations. See how to [Configure alerts for recommendations](/azure/advisor/advisor-alerts-portal)

> [!NOTE]
> These quality checks run on all VIS instances at a regular frequency of once every 1 hour. The corresponding recommendations in Azure Advisor also refresh at the same 1-hour frequency.If you take action on one or more recommendations from Azure Center for SAP solutions, wait for the next refresh to see any new recommendations from Azure Advisor.

> [!IMPORTANT]
> Azure Advisor filters out recommendations for Deleted Azure resources for 7 days. Therefore, if you delete a VIS and then re-register it, you will be able to see Advisor recommendations after 7 days of re-registration. 



## Get VM information

The **Virtual Machine** tab provides insights about the VMs in your VIS. There are multiple subsections:

- [Azure Compute](#azure-compute)
- [Compute List](#compute-list)
- [Compute Extensions](#compute-extensions)
- [Compute + OS Disk](#compute--os-disk)
- [Compute + Data Disks](#compute--data-disks)

### Azure Compute

The **Azure Compute** tab shows a summary graph of the VMs inside the VIS. 

:::image type="content" source="media/get-quality-checks-insights/azure-compute.png" lightbox="media/get-quality-checks-insights/azure-compute.png" alt-text="Screenshot of Azure Compute tab, showing a pie chart of running virtual machines.":::

### Compute List

The **Compute List** tab shows a table of information about the VMs inside the VIS. This information includes the VM's name and state, SKU, OS, publisher, image version and SKU, offer, Azure region, resource group, tags, and more.

You can toggle **Show Help** to see more information about the table data. 

Select a VM name to see its overview page, and change settings like **Boot Diagnostic**.

:::image type="content" source="media/get-quality-checks-insights/vm-compute-list.png" lightbox="media/get-quality-checks-insights/vm-compute-list.png" alt-text="Screenshot of Compute List tab, showing a table of details about the virtual machines inside of a virtual Instance for SAP solutions.":::

### Compute Extensions

The **Compute Extensions** tab shows information about your VM extensions. There are three tabs within this section:

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

The **Configuration Checks** tab provides configuration checks for the VMs in your VIS. There are four subsections:

- [Accelerated Networking](#accelerated-networking)
- [Public IP](#public-ip)
- [Backup](#backup)
- [Load Balancer](#load-balancer)

### Accelerated Networking

The **Accelerated Networking** tab shows if **Accelerated Networking State** is enabled for each NIC in the VIS. It's recommended to enable this setting for reliability and performance.

:::image type="content" source="media/get-quality-checks-insights/configuration-accelerated-networking.png" lightbox="media/get-quality-checks-insights/configuration-accelerated-networking.png" alt-text="Screenshot of the Accelerated Networking tab, showing a table of virtual machines with their accelerated networking statuses.":::

### Public IP

The **Public IP** tab shows any public IP addresses that are associated with the NICs linked to the VMs in the VIS.

:::image type="content" source="media/get-quality-checks-insights/configuration-public-ip.png" lightbox="media/get-quality-checks-insights/configuration-public-ip.png" alt-text="Screenshot of the Public I P tab, showing a notice that there are no public I P addresses associated with the virtual machines in the system.":::

### Backup

The **Backup** tab shows a table of VMs that don't have Azure Backup configured. It's recommended to use Azure Backup with your VMs.

:::image type="content" source="media/get-quality-checks-insights/configuration-azure-backup.png" lightbox="media/get-quality-checks-insights/configuration-azure-backup.png" alt-text="Screenshot of the Backup tab, showing a table of which virtual machines in the system don't have Azure Backup enabled.":::

### Load Balancer

The **Load Balancer** tab shows information about load balancers connected to the resource group(s) for the VIS. There are two subsections: [Load Balancer Overview](#load-balancer-overview) and [Load Balancer Monitor](#load-balancer-monitor).

#### Load Balancer Overview

The **Load Balancer Overview** tab shows rules and details for the load balancers in the VIS. You can review:

- If the HA ports are defined for the load balancers.
- If the load balancers have floating IP addresses enabled.
- If the keep-alive functionality is enabled, with a maximum timeout of 30 minutes.

:::image type="content" source="media/get-quality-checks-insights/configuration-load-balancer.png" lightbox="media/get-quality-checks-insights/configuration-load-balancer.png" alt-text="Screenshot of the Load Balancer tab, showing a table with an overview of information for the standard load balancers in the system.":::

#### Load Balancer Monitor

The **Load Balancer Monitor** tab shows monitoring information for the load balancers. You can filter the information by load balancer and time range.

**Load Balancer Key Metrics**, which is a table that shows important information about the load balancers in the subscription where the VIS exists.

:::image type="content" source="media/get-quality-checks-insights/configuration-load-balancer-monitor.png" lightbox="media/get-quality-checks-insights/configuration-load-balancer-monitor.png" alt-text="Screenshot of the Load Balancer Key Metrics section, showing a table of basic visualized information about load balancers in the system. ":::

**Backend health probe by Backend IP**, which is a chart that shows the health probe status for each load balancer over time. 

:::image type="content" source="media/get-quality-checks-insights/configuration-load-balancer-health-probe.png" lightbox="media/get-quality-checks-insights/configuration-load-balancer-health-probe.png" alt-text="Screenshot of the Backend health probe section, showing a graph of load balancer statuses over the selected time range.":::

## Next steps

- [Manage a VIS](manage-virtual-instance.md)
- [Monitor SAP system from the Azure portal](monitor-portal.md)
