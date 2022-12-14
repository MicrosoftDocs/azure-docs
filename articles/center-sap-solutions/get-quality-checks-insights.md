---
title: Get quality checks and insights for a Virtual Instance for SAP solutions (preview)
description: Learn how to get quality checks and insights for a Virtual Instance for SAP solutions (VIS) resource in Azure Center for SAP solutions through the Azure portal.
ms.service: azure-center-sap-solutions
ms.topic: how-to
ms.date: 10/19/2022
author: lauradolan
ms.author: ladolan
#Customer intent: As a developer, I want to use the quality checks feature so that I can learn more insights about virtual machines within my Virtual Instance for SAP resource.
---

# Get quality checks and insights for a Virtual Instance for SAP solutions (preview)

[!INCLUDE [Preview content notice](./includes/preview.md)]

The *Quality Insights* Azure workbook in *Azure Center for SAP solutions* provides insights about the SAP system resources. The feature is part of the monitoring capabilities built in to the *Virtual Instance for SAP solutions (VIS)*. These quality checks make sure that your SAP system uses Azure and SAP best practices for reliability and performance. 

In this how-to guide, you'll learn how to use quality checks and insights to get more information about virtual machine (VM) configurations within your SAP system.

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

The **Quality checks** feature in Azure Center for SAP solutions runs validation checks for all VIS resources. These quality checks validate the SAP system configurations follow the best practices recommended by SAP and Azure. If a VIS doesn't follow these best practices, you receive a recommendation from Azure Advisor.

The table in the **Advisor Recommendations** tab shows all the recommendations for ASCS, Application and Database instances in the VIS.

:::image type="content" source="media/get-quality-checks-insights/advisor-recommendation.png" lightbox="media/get-quality-checks-insights/advisor-recommendation.png" alt-text="Screenshot of the Advisor Recommendations tab, showing overview of recommendations for all instances in the VIS.":::

Select an instance name to see all recommendations, including which action to take to resolve an issue.

:::image type="content" source="media/get-quality-checks-insights/recommendation-detail.png" lightbox="media/get-quality-checks-insights/recommendation-detail.png" alt-text="Screenshot of detailed advisor recommendations for an instance and which actions to take to resolve each issue.":::

The following checks are run for each VIS:

- Checks that the VMs used for different instances in the VIS are certified by SAP. For better performance and support, make sure that a VM is certified for SAP on Azure. For more details, see [SAP note 1928533] (https://launchpad.support.sap.com/#/notes/1928533).
- Checks that accelerated networking is enabled for the NICs attached to the different VMs. Network latency between Application VMs and Database VMs for SAP workloads must be 0.7 ms or less. If accelerated networking isn't enabled, network latency can increase beyond the threshold of 0.7 ms. For more details, see the [planning and deployment checklist for SAP workloads on Azure](../virtual-machines/workloads/sap/sap-deployment-checklist.md).
- Checks that the network configuration is optimized for HANA and the OS. Makes sure that as many client ports as possible are available for HANA internal communication. You must explicitly exclude the ports used by processes and applications which bind to specific ports by adjusting the parameter `net.ipv4.ip_local_reserved_ports` to a range of 9000-64999. For more details, see [SAP note 2382421](https://launchpad.support.sap.com/#/notes/2382421).
- Checks that swap space is set to 2 GB in HANA systems. For SLES and RHEL, configure a small swap space of 2 GB to avoid performance regressions at times of high memory utilization in the OS. Typically, it's recommended that activities terminate with "out of memory" errors. This setting makes sure that the overall system is still usable and only certain requests are terminated. For more details, see [SAP note 1999997](https://launchpad.support.sap.com/#/notes/1999997).
- Checks that **fstrim** is disabled in SAP systems that run on SUSE OS. **fstrim** scans the filesystem and sends `UNMAP` commands for each unused block found. This setting is useful in a thin-provisioned system, if the system is over-provisioned. It's not recommended to run SAP HANA on an over-provisioned storage array. Active **fstrim** can cause XFS metadata corruption. For more information, see [SAP note 2205917](https://launchpad.support.sap.com/#/notes/2205917) and [Disabling fstrim - under which conditions?](https://www.suse.com/support/kb/doc/?id=000019447).


> [!NOTE]
> These quality checks run on all VIS instances at a regular frequency of 12 hours. The corresponding recommendations in Azure Advisor also refresh at the same 12-hour frequency.

If you take action on one or more recommendations from Azure Center for SAP solutions, wait for the next refresh to see any new recommendations from Azure Advisor.

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
