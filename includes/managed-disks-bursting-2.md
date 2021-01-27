---
 title: include file
 description: include file
 services: virtual-machines
 author: albecker1
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 04/27/2020
 ms.author: albecker1
 ms.custom: include file
---
## Common scenarios
The following scenarios can benefit greatly from bursting:
- **Improving boot times**  – With bursting, your instance will boot at a significantly faster rate. For example, the default OS disk for premium enabled VMs is the P4 disk, which is a provisioned performance of up to 120 IOPS and 25 MB/s. With bursting, the P4 can go up to 3500 IOPS and 170 MB/s allowing for a boot time to accelerate by 6X.
- **Handling batch jobs** – Some application’s workloads are cyclical in nature and require a baseline performance for most of the time and require higher performance for a short period of time. An example of this is an accounting program that process transactions daily that require a small amount of disk traffic. Then at the end of the month, does reconciling reports that need a much higher amount of disk traffic.
- **Preparedness for traffic spikes** – Web servers and their applications can experience traffic surges at any time. If your web server is backed by VMs or disks using bursting, the servers are better equipped to handle traffic spikes. 

## Bursting flow
The bursting credit system applies in the same manner at both the virtual machine level and disk level. Your resource, either a VM or disk, will start with fully stocked credits. These credits will allow you to burst for 30 minutes at the maximum burst rate. Bursting credits accumulate when your resource is running under their performance disk storage limits. For all IOPS and MB/s that your resource is using below the performance limit you begin to accumulate credits. If your resource has accrued credits to use for bursting and your workload needs the extra performance, your resource can use those credits to go above your performance limit to give it the disk IO performance it needs to meet the demand.



![Bursting bucket Diagram](media/managed-disks-bursting/bucket-diagram.jpg)

It's completely up to you on how you want to use the 30 minutes of bursting. You can use it for 30 minutes consecutively or sporadically throughout the day. When the product is deployed it comes ready with full credits and when it depletes the credits it takes less than a day to get fully stocked full of credits again. You can accumulate and spend their bursting credits at your discretion and the 30 minute bucket does not need to be full again to burst. One thing to note about burst accumulation is that it is different for each resource since it is based on the unused IOPS and MB/s below their performance amounts. This means that higher baseline performance products can accrue their bursting amounts faster than lower baseline performing products. For example, a P1 disk idling with no activity will accrue 120 IOPS per second whereas a P20 disk accrues 2,300 IOPS per second while idling with no activity.

## Bursting states
There are three states your resource can be in with bursting enabled:
- **Accruing** – The resource’s IO traffic is using less than the performance target. Accumulating bursting credits for IOPS and MB/s are done separate from one another. Your resource can be accruing IOPS credits and spending MB/s credits or vice versa.
- **Bursting** – The resource’s traffic is using more than the performance target. The burst traffic will independently consume credits from IOPS or bandwidth.
- **Constant** – The resource’s traffic is exactly at the performance target.