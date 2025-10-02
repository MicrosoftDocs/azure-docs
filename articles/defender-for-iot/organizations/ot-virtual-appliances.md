---
title: OT monitoring with virtual appliances - Microsoft Defender for IoT
description: Learn about system requirements for virtual appliances used for the Microsoft Defender for IoT OT sensors.
ms.date: 05/03/2022
ms.topic: limits-and-quotas
---

# OT monitoring with virtual appliances

This article is one in a series of articles that describe the [deployment path](ot-deploy/ot-deploy-path.md) for operational technology (OT) monitoring with Microsoft Defender for IoT. The article lists the specifications that are required if you want to install Microsoft Defender for IoT software on your own virtual appliances.

:::image type="content" source="media/deployment-paths/progress-plan-and-prepare.png" alt-text="Diagram of a progress bar with Plan and prepare highlighted." border="false" lightbox="media/deployment-paths/progress-plan-and-prepare.png":::

## About hypervisors

The virtualized hardware used to run guest operating systems is supplied by virtual machine hosts, also known as *hypervisors*. Defender for IoT supports the following hypervisor software:

- **VMware ESXi** (version 5.0 and later)
- **Microsoft Hyper-V** (VM configuration version 8.0 and later)

Learn more:

- [OT sensor as a virtual appliance with VMware ESXi](appliance-catalog/virtual-sensor-vmware.md)
- [OT sensor as a virtual appliance with Microsoft Hyper-V](appliance-catalog/virtual-sensor-hyper-v.md)

> [!IMPORTANT]
> Other types of hypervisors, such as hosted hypervisors, may also run Defender for IoT. However, due to their lack of exclusive hardware control and resource reservation, other types of hypervisors aren't supported for production environments. For example: Parallels, Oracle VirtualBox, and VMware Workstation or Fusion
>

## Virtual appliance design considerations

This section outlines considerations for virtual appliance components, for both OT sensors and on-premises monitoring consoles.

|Specification  |Considerations  |
|---------|---------|
|**CPU**     |   Assign dedicated CPU cores (also known as pinning) with at least 2.4 GHz, which aren't dynamically allocated. <br><br>CPU usage is high because the appliance continuously records and analyzes network traffic.<br> CPU performance is critical to capturing and analyzing network traffic, and any slowdown could lead to packet drops and performance degradation.   |
|**Memory**     | RAM should be allocated statically for the required capacity, not dynamically. <br><br>Expect high RAM utilization due to the sensor's constant network traffic recording and analytics,        |
|**Network interfaces**     |  Physical mapping provides best performance, lowest latency, and efficient CPU usage. Our recommendation is to physically map network interface cards (NICs) to the virtual machines with SR-IOV or a dedicated NIC. <br><br>  As a result of high traffic monitoring levels, expect high network utilization. <br><br> Set the promiscuous mode on your vSwitch to **Accept**, which allows all traffic to reach the VM. Some vSwitch implementations may block certain protocols if it isn't configured correctly.|
|**Storage**     | Make sure to allocate enough read and write Input-Output Processors (IOPs) and throughput to match the performance of the appliances listed in this article. <br><br>You should expect high storage usage due to the large traffic monitoring volumes.      |


## OT network sensor VM requirements

For all deployments, bandwidth results for virtual machines may vary, depending on the distribution of protocols and the actual hardware resources that are available, including the CPU model, memory bandwidth, and IOPS.

To review system requirements and performance details for OT network sensors on specific virtual appliances, see the [appliance catalog](appliance-catalog/index.yml).

> [!NOTE]
> You don't need to preinstall an operating system on the VM, the sensor installation includes the operating system image.

## Next steps

> [!div class="step-by-step"]
> [« Prepare an OT site deployment](best-practices/plan-prepare-deploy.md)