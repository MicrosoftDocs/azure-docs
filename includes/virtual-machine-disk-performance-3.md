---
 title: include file
 description: include file
 services: virtual-machines
 author: albecker1
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 10/12/2020
 ms.author: albecker1
 ms.custom: include file
---
![Screenshot of f i o output showing r=22.8k highlighted.](media/vm-disk-performance/utilization-metrics-example/fio-output.jpg)

The Standard_D8s_v3 can achieve a total of 28,600 IOPS. Using the metrics, let's investigate what's going on and identify our storage IO bottleneck. On the left side pane, select **Metrics**:

![Screenshot showing Metrics highlighted on the left side pane.](media/vm-disk-performance/utilization-metrics-example/metrics-menu.jpg)

Let's first take a look at our **VM Cached IOPS Consumed Percentage** metric:

![Screenshot showing V M Cached I O P S Consumed Percentage.](media/vm-disk-performance/utilization-metrics-example/vm-cached.jpg)

This metric tells us that 61% of the 16,000 IOPS allotted to the cached IOPS on the VM is being used. This percentage means that the storage IO bottleneck isn't with the disks that are cached because it isn't at 100%. Now let's look at our **VM Uncached IOPS Consumed Percentage** metric:

![Screenshot showing V M Uncached I O P S Consumed Percentage.](media/vm-disk-performance/utilization-metrics-example/vm-uncached.jpg)

This metric is at 100%. It tells us that all of the 12,800 IOPS allotted to the uncached IOPS on the VM are being used. One way we can remediate this issue is to change the size of our VM to a larger size that can handle the additional IO. But before we do that, let's look at the attached disk to find out how many IOPS they are seeing. Check the OS Disk by looking at the **OS Disk IOPS Consumed Percentage**:

![Screenshot showing O S Disk I O P S Consumed Percentage.](media/vm-disk-performance/utilization-metrics-example/os-disk.jpg)

This metric tells us that around 90% of the 5,000 IOPS provisioned for this P30 OS disk is being used. This percentage means there's no bottleneck at the OS Disk. Now let's check the data disks that are attached to the VM by looking at the **Data Disk IOPS Consumed Percentage**:

![Screenshot showing Data Disk I O P S Consumed Percentage.](media/vm-disk-performance/utilization-metrics-example/data-disks-no-splitting.jpg)

This metric tells us that the average IOPS consumed percentage across all the disks attached is around 42%. This percentage is calculated based on the IOPS that are used by the disks, and that aren't being served from the host cache. Let's drill deeper into this metric by applying *splitting* on these metrics and splitting by the LUN value:

![Screenshot showing Data Disk I O P S Consumed Percentage with splitting.](media/vm-disk-performance/utilization-metrics-example/data-disks-splitting.jpg)

This metric tells us the data disks attached on LUN 3 and 2 are using around 85% of their provisioned IOPS. Here is a diagram of what the IO looks like from the VM and Disks architecture:

![Diagram of Storage I O metrics example.](media/vm-disk-performance/utilization-metrics-example/metrics-diagram.jpg)
