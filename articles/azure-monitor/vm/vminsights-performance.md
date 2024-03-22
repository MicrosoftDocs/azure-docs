---
title: Chart performance with VM insights
description: This article discusses the VM insights Performance feature that discovers application components on Windows and Linux systems and maps the communication between services.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 09/28/2023
---

# Chart performance with VM insights

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

VM insights includes a set of performance charts that target several key [performance indicators](vminsights-log-query.md#performance-records) to help you determine how well a virtual machine is performing. The charts show resource utilization over a period of time. You can use them to identify bottlenecks and anomalies. You can also switch to a perspective that lists each machine to view resource utilization based on the metric selected.

VM insights monitors key operating system performance indicators related to processor, memory, network adapter, and disk utilization. Performance helps to:

- Expose issues that indicate a possible system component failure.
- Support tuning and optimization to achieve efficiency.
- Support capacity planning.

> [!NOTE]
> The network chart on the Performance tab looks different from the network chart on the Azure VM overview page because the overview page displays charts based on the host's measurement of activity in the guest VM. The network chart on the Azure VM overview only displays network traffic that will be billed. Inter-virtual network traffic isn't included. The data and charts shown for VM insights are based on data from the guest VM. The network chart displays all TCP/IP traffic that's inbound and outbound to that VM, including inter-virtual network traffic.


## Limitations
Limitations in performance collection with VM insights:

- Available memory isn't available in all Linux versions, including Red Hat Linux (RHEL) 6 and CentOS 6. It will be available in Linux versions that use [kernel version 3.14](http://www.man7.org/linux/man-pages/man1/free.1.html) or higher. It might be available in some kernel versions between 3.0 and 3.14.
- Metrics are only available for data disks on Linux virtual machines that use XFS filesystem or EXT filesystem family (EXT2, EXT3, EXT4).
- Collecting performance metrics from network shared drives is unsupported.

## Multi-VM perspective from Azure Monitor

From Azure Monitor, the Performance feature provides a view of all monitored VMs deployed across work groups in your subscriptions or in your environment.

To access from Azure Monitor:

1. In the Azure portal, select **Monitor**.
1. In the **Solutions** section, select **Virtual Machines**.
1. Select the **Performance** tab.
<!-- convertborder later -->
:::image type="content" source="media/vminsights-performance/vminsights-performance-aggview-01.png" lightbox="media/vminsights-performance/vminsights-performance-aggview-01.png" alt-text="Screenshot that shows a VM insights Performance Top N List view." border="false":::

On the **Top N Charts** tab, if you have more than one Log Analytics workspace, select the workspace enabled with the solution from the **Workspace** selector at the top of the page. The **Group** selector returns subscriptions, resource groups, [computer groups](../logs/computer-groups.md), and virtual machine scale sets of computers related to the selected workspace that you can use to further filter results presented in the charts on this page and across the other pages. Your selection only applies to the Performance feature and doesn't carry over to Map.

By default, the charts show performance counters for the last hour. By using the **TimeRange** selector, you can query for historical time ranges of up to 30 days to show how performance looked in the past.

Five capacity utilization charts are shown on the page:

* **CPU Utilization %**: Shows the top five machines with the highest average processor utilization.
* **Available Memory**: Shows the top five machines with the lowest average amount of available memory.
* **Logical Disk Space Used %**: Shows the top five machines with the highest average disk space used percent across all disk volumes.
* **Bytes Sent Rate**: Shows the top five machines with the highest average of bytes sent.
* **Bytes Receive Rate**: Shows the top five machines with the highest average of bytes received.

>[!NOTE]
>Each chart described above only shows the top 5 machines.  
>

Selecting the pushpin icon in the upper-right corner of a chart pins it to the last Azure dashboard you viewed. From the dashboard, you can resize and reposition the chart. Selecting the chart from the dashboard redirects you to VM insights and loads the correct scope and view.

Select the icon to the left of the pushpin icon on a chart to open the **Top N List** view. This list view shows the resource utilization for a performance metric by individual VM. It also shows which machine is trending the highest.
<!-- convertborder later -->
:::image type="content" source="media/vminsights-performance/vminsights-performance-topnlist-01.png" lightbox="media/vminsights-performance/vminsights-performance-topnlist-01.png" alt-text="Screenshot that shows a Top N List view for a selected performance metric." border="false":::

When you select the virtual machine, the **Properties** pane opens on the right side. It shows properties like system information reported by the operating system and the properties of the Azure VM. Selecting an option under the **Quick Links** section redirects you to that feature directly from the selected VM.
<!-- convertborder later -->
:::image type="content" source="./media/vminsights-performance/vminsights-properties-pane-01.png" lightbox="./media/vminsights-performance/vminsights-properties-pane-01.png" alt-text="Screenshot that shows a virtual machine Properties pane." border="false":::

You can switch to the **Aggregated Charts** tab to view the performance metrics filtered by average or percentiles measured.
<!-- convertborder later -->
:::image type="content" source="./media/vminsights-performance/vminsights-performance-aggview-02.png" lightbox="./media/vminsights-performance/vminsights-performance-aggview-02.png" alt-text="Screenshot that shows a VM insights Performance Aggregate view." border="false":::

The following capacity utilization charts are provided:

* **CPU Utilization %**: Defaults show the average and top 95th percentile.
* **Available Memory**: Defaults show the average, top 5th, and 10th percentile.
* **Logical Disk Space Used %**: Defaults show the average and 95th percentile.
* **Bytes Sent Rate**: Defaults show the average bytes sent.
* **Bytes Receive Rate**: Defaults show the average bytes received.

You can also change the granularity of the charts within the time range by selecting **Avg**, **Min**, **Max**, **50th**, **90th**, and **95th** in the percentile selector.

To view the resource utilization by individual VM and see which machine is trending with highest utilization, select the **Top N List** tab. The **Top N List** page shows the top 20 machines sorted by the most utilized by 95th percentile for the metric *CPU Utilization %*. To see more machines, select **Load More**. The results expand to show the top 500 machines.

>[!NOTE]
>The list can't show more than 500 machines at a time.  
>
<!-- convertborder later -->
:::image type="content" source="./media/vminsights-performance/vminsights-performance-topnlist-01.png" lightbox="./media/vminsights-performance/vminsights-performance-topnlist-01.png" alt-text="Screenshot that shows a Top N List page example." border="false":::

To filter the results on a specific virtual machine in the list, enter its computer name in the **Search by name** text box.

If you want to view utilization from a different performance metric, from the **Metric** dropdown list, select **Available Memory**, **Logical Disk Space Used %**, **Network Received Byte/s**, or **Network Sent Byte/s**. The list updates to show utilization scoped to that metric.

Selecting a virtual machine from the list opens the **Properties** pane on the right side of the page. From here, you can select **Performance detail**. The **Virtual Machine Detail** page opens and is scoped to that VM. The experience is similar to accessing VM Insights Performance directly from the Azure VM.

## View performance directly from an Azure VM

To access directly from a virtual machine:

1. In the Azure portal, select **Virtual Machines**.
1. From the list, select a VM. In the **Monitoring** section, select **Insights**.
1. Select the **Performance** tab.

This page shows performance utilization charts. It also shows a table for each logical disk discovered with its capacity, utilization, and total average by each measure.

The following capacity utilization charts are provided:

* **CPU Utilization %**: Defaults show the average and top 95th percentile.
* **Available Memory**: Defaults show the average, top 5th, and 10th percentile.
* **Logical Disk Space Used %**: Defaults show the average and 95th percentile.
* **Logical Disk IOPS**: Defaults show the average and 95th percentile.
* **Logical Disk MB/s**: Defaults show the average and 95th percentile.
* **Max Logical Disk Used %**: Defaults show the average and 95th percentile.
* **Bytes Sent Rate**: Defaults show the average bytes sent.
* **Bytes Receive Rate**: Defaults show the average bytes received.

Selecting the pushpin icon in the upper-right corner of a chart pins it to the last Azure dashboard you viewed. From the dashboard, you can resize and reposition the chart. Selecting the chart from the dashboard redirects you to VM insights and loads the performance detail view for the VM.

:::image type="content" source="./media/vminsights-performance/vminsights-performance-direct-vm.png" lightbox="./media/vminsights-performance/vminsights-performance-direct-vm.png" alt-text="Screenshot that shows VM insights Performance directly from the VM view.":::

## Troubleshoot VM performance issues with Performance Diagnostics

[The Performance Diagnostics tool](/troubleshoot/azure/virtual-machines/performance-diagnostics?toc=/azure/azure-monitor/toc.json) helps troubleshoot performance issues on Windows or Linux virtual machines by quickly diagnosing and providing insights on issues it currently finds on your machines. The tool does not analyze historical monitoring data you collect, but rather checks the current state of the machine for known issues, implementation of best practices, and complex problems that involve slow VM performance or high usage of CPU, disk space, or memory. 

To install and run the Performance Diagnostics tool, select the **Performance Diagnostics** button from the VM Insights Performance screen > **Install performance diagnostics** and [select an analysis scenario](/troubleshoot/azure/virtual-machines/performance-diagnostics#select-an-analysis-scenario-to-run?toc=/azure/azure-monitor/toc.json)

:::image type="content" source="./media/vminsights-performance/vminsights-performance-diagnostics.png" lightbox="./media/vminsights-performance/vminsights-performance-diagnostics.png" alt-text="Screenshot that shows the Performance Diagnostics button, which enables the Performance Diagnostics tool from the VM Insights Performance screen.":::


## View performance directly from an Azure virtual machine scale set

To access directly from an Azure virtual machine scale set:

1. In the Azure portal, select **Virtual machine scale sets**.
1. From the list, select a VM.
1. In the **Monitoring** section, select **Insights** to view the **Performance** tab.

This page loads the Azure Monitor performance view scoped to the selected scale set. This view enables you to see the Top N instances in the scale set across the set of monitored metrics. You can also view the aggregate performance across the scale set. And you can see the trends for selected metrics across the individual instances in the scale set. Selecting an instance from the list view lets you load its map or move into a detailed performance view for that instance.

Selecting the pushpin icon in the upper-right corner of a chart pins it to the last Azure dashboard you viewed. From the dashboard, you can resize and reposition the chart. Selecting the chart from the dashboard redirects you to VM insights and loads the performance detail view for the VM.

:::image type="content" source="./media/vminsights-performance/vminsights-performance-direct-vmss.png" lightbox="./media/vminsights-performance/vminsights-performance-direct-vmss.png" alt-text="Screenshot that shows VM insights Performance directly from the virtual machine scale set view.":::

>[!NOTE]
>You can also access a detailed performance view for a specific instance from the **Instances** view for your scale set. Under the **Settings** section, go to **Instances** and select **Insights**.

## Next steps

- Learn how to use [workbooks](vminsights-workbooks.md) that are included with VM insights to further analyze performance and network metrics.
- To learn about discovered application dependencies, see [View VM insights Map](vminsights-maps.md).


