<properties
   pageTitle="Manage infrastructure capacity"
   description="Learn about using the Capacity Planning solution in Operational Insights to help you understand the capacity of your server infrastructure"
   services="operational-insights"
   documentationCenter=""
   authors="bandersmsft"
   manager="jwhit"
   editor="" />
<tags
   ms.service="operational-insights"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="08/05/2015"
   ms.author="banders" />

# Manage infrastructure capacity

[AZURE.INCLUDE [operational-insights-note-moms](../../includes/operational-insights-note-moms.md)]

You can use the Capacity Planning solution in Microsoft Azure Operational Insights to help you understand the capacity of your server infrastructure. You install the solution to update the Operations Manager agent and the base configuration module in Operational Insights. The solution reads performance counters on the monitored server and sends usage data to the Operational Insights service in the cloud for processing. Logic is applied to the usage data, and the cloud service records the data. Over time, usage patterns are identified and capacity is projected, based on current consumption.

For example, a projection might identify when additional processor cores or additional memory will be needed for an individual server. In this example, the projection might indicate that in 30 days the server will need additional memory. This can help you plan for a memory upgrade during the server’s next maintenance window, which might occur once every two weeks.

## Capacity Management dashboard

Before you can use the Capacity Management dashboard in Microsoft Azure Operational Insights, you must have the solution installed. To read more about installing solutions, see [Use the Solution Gallery to add or remove solutions](operational-insights-setup-workspace.md). After the Capacity Planning solution is installed, you can view the capacity of your monitored servers by using the **Capacity Planning** tile on the **Overview** page in Operational Insights.

![image of Capacity Planning tile](./media/operational-insights-capacity/overview-cap-plan.png)

The tile opens the **Capacity Management** dashboard where you can view a summary of your server capacity. The page displays the following tiles that you can click:

- *Virtual machine count*: Shows the number of days remaining for the capacity of virtual machines

- *Compute*: Shows processor cores and available memory

- *Storage*: Shows the disk space used and average disk latency

- *Search*: The data explorer that you can use to Search for any data in the Operational Insights system

>[AZURE.NOTE] To view capacity management data, you must enable Operations Manager connectivity with Virtual Machine Manager (VMM). For additional information about connecting the systems, see How to connect VMM with Operations Manager.

![image of Capacity Management dashboard](./media/operational-insights-capacity/gallery-capacity-01.png)

### To view a capacity page

- On the **Overview** page, click **Capacity Management**, and then click **Compute** or **Storage**.

## Compute page

You can use the **Compute** dashboard in Microsoft Azure Operational Insights to view capacity information about utilization, projected days of capacity, and efficiency related to your infrastructure. You use the **Utilization** area to view CPU core and memory utilization in your virtual machine hosts. You can use the projection tool to estimate how much capacity is expected to be available for a given date range. You can use the **Efficiency** area to see how efficient your virtual machine hosts are. You can view details about linked items by clicking them.

You can generate an Excel workbook for the following categories:

- Top hosts with highest core utilization

- Top hosts with highest memory utilization

- Top hosts with inefficient virtual machines

- Top hosts by utilization

- Bottom hosts by utilization

![image of Capacity Management Compute page](./media/operational-insights-capacity/gallery-capacity-02.png)


The following areas are shown on the **Compute** dashboard:

**Utilization**: View CPU core and memory utilization in your virtual machine hosts.

- *Used Cores*: Sum for all hosts (% of the CPU utilized multiplied by the number of physical cores on host).

- *Free Cores*: Total physical cores minus used cores.

- *Percentage Cores Available*: Free physical cores divided by total number of physical cores.

- *Virtual Cores per VM*: Total virtual cores in the system divided by the total number of virtual machines in the system.

- *Virtual Cores to Physical Cores Ratio*: Ratio of total physical cores to physical cores that are used by virtual machines in the system.

- *Number of virtual Cores Available*: Virtual core to physical cores ratio multiplied by the available physical cores.

- *Used Memory*: Sum of memory that is utilized by all hosts.

- *Free Memory*: Total physical memory minus used memory.

- *Percentage Memory Available*: Free physical memory divided by total physical memory.

- *Virtual Memory per VM*: Total virtual memory in the system divided by the total number of virtual machines in the system.

- *Virtual Memory to Physical Memory Ratio*: Total virtual memory in the system divided by the total physical memory in the system.

- *Virtual Memory Available*: Virtual memory to physical memory ratio multiplied by the available physical memory.

**Projection tool**

By using the projection tool, you can view historical trends for your resource utilization. This includes the usage trends for virtual machines, memory, core, and storage. The projection capability uses a projection algorithm to help you know when you are running out of each of the resources. This helps you calculate proper capacity planning so that you can know when you need to purchase more capacity (such as memory, cores, or storage).

**Efficiency**

- *Idle VM*: Using less than 10% of the CPU and 10% memory for the specified time period.

- *Overutilized VM*: Using more than 90% of the CPU and 90% memory for the specified time period.

- *Idle Host*: Using less than 10% of the CPU and 10% memory for the specified time period.

- *Overutilized Host*: Using more than 90% of the CPU and 90% memory for the specified time period.

### To work with items on the Compute page

1. On the **Compute** dashboard, in the **Utilization** area, view capacity information about the CPU cores and memory in use.

2. Click an item to open it in the **Search** page and view detailed information about it.

3. In the **Projection** tool, move the date slider to display a projection of the capacity that will be used on the date you choose.

3. In the **Efficiency** area, view capacity efficiency information about virtual machines and virtual machine hosts.

##Direct Attached Storage page

You can use the **Direct Attached Storage** dashboard in Microsoft Azure Operational Insights to view capacity information about storage utilization, disk performance, and projected days of disk capacity. You use the **Utilization** area to view disk space usage in your virtual machine hosts. You can use the **Disk Performance** area to view disk throughput and latency in your virtual machine hosts. You can also use the projection tool to estimate how much capacity is expected to be available for a given date range. You can view details about linked items by clicking them.

You can generate an Excel workbook from this capacity information for the following categories:

- Top disk space usage by host

- Top average latency by host

The following areas are shown on the **Storage** page:

- *Utilization*: View disk space usage in your virtual machine hosts.

- *Total Disk Space*: Sum (logical disk space) for all hosts

- *Used Disk Space*: Sum (used logical disk space) for all hosts

- *Available Disk Space*: Total disk space minus used disk space

- *Percentage Disk Used*: Used disk space divided by total disk space

- *Percentage Disk Available*: Available disk space divided by total disk space

![image of Capacity Management Direct Attached Storage page](./media/operational-insights-capacity/gallery-capacity-03.png)

**Disk Performance**

By using Operational Insights, you can view the historical usage trend of your disk space. The projection capability uses an algorithm to project future usage. For space usage in particular, the projection capability enables you to project when you might run out of disk space. This will help you plan proper storage and know when you need to purchase more storage.

**Projection tool**

By using the projection tool, you can view historical trends for your disk space utilization. The projection capability also lets you project when you are running out of disk space. This will help you plan proper capacity and know when you need to purchase more storage capacity.

### To work with items on the Direct Attached Storage page

1. On the **Direct Attached Storage** dashboard, in the **Utilization** area, you can view the disk utilization information.

2. Click a linked item to open it in the **Search** page and view detailed information about it.

3. In the **Disk Performance** area, you can view disk throughput and latency information.

4. In the **Projection tool**, move the date slider to display a projection of the capacity that will be used on the date you choose.

[AZURE.INCLUDE [operational-insights-export](../../includes/operational-insights-export.md)]
