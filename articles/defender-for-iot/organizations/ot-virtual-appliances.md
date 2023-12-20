---
title: OT monitoring with virtual appliances - Microsoft Defender for IoT
description: Learn about system requirements for virtual appliances used for the Microsoft Defender for IoT OT sensors and on-premises management console.
ms.date: 05/03/2022
ms.topic: limits-and-quotas
---

# OT monitoring with virtual appliances

This article is one in a series of articles describing the [deployment path](ot-deploy/ot-deploy-path.md) for OT monitoring with Microsoft Defender for IoT, and lists the specifications required if you want to install Microsoft Defender for IoT software on your own virtual appliances.

:::image type="content" source="media/deployment-paths/progress-plan-and-prepare.png" alt-text="Diagram of a progress bar with Plan and prepare highlighted." border="false" lightbox="media/deployment-paths/progress-plan-and-prepare.png":::

> [!NOTE]
> This article also includes information relevant for on-premises management consoles. For more information, see the [Air-gapped OT sensor management deployment path](ot-deploy/air-gapped-deploy.md).
>

## About hypervisors

The virtualized hardware used to run guest operating systems is supplied by virtual machine hosts, also known as *hypervisors*. Defender for IoT supports the following hypervisor software:

- **VMware ESXi** (version 5.0 and later)
- **Microsoft Hyper-V** (VM configuration version 8.0 and later)

Learn more:

- [OT sensor as a virtual appliance with VMware ESXi](appliance-catalog/virtual-sensor-vmware.md)
- [OT sensor as a virtual appliance with Microsoft Hyper-V](appliance-catalog/virtual-sensor-hyper-v.md)
- [On-premises management console as a virtual appliance with VMware ESXi](appliance-catalog/virtual-management-vmware.md)
- [On-premises management console as a virtual appliance with Microsoft Hyper-V](appliance-catalog/virtual-management-hyper-v.md)

> [!IMPORTANT]
> Other types of hypervisors, such as hosted hypervisors, may also run Defender for IoT. However, due to their lack of exclusive hardware control and resource reservation, other types of hypervisors are not supported for production environments. For example: Parallels, Oracle VirtualBox, and VMware Workstation or Fusion
>

## Virtual appliance design considerations

This section outlines considerations for virtual appliance components, for both OT sensors and on-premises monitoring consoles.

|Specification  |Considerations  |
|---------|---------|
|**CPU**     |   Assign dedicated CPU cores (also known as pinning) with at least 2.4 GHz, which are not dynamically allocated. <br><br>CPU usage will be high since the appliance continuously records and analyzes network traffic.<br> CPU performance is critical to capturing and analyzing network traffic, and any slowdown could lead to packet drops and performance degradation.   |
|**Memory**     | RAM should be allocated statically for the required capacity, not dynamically. <br><br>Expect high RAM utilization due to the sensor's constant network traffic recording and analytics,        |
|**Network interfaces**     |  Physical mapping provides best performance, lowest latency and efficient CPU usage. Our recommendation is to physically map NICs to the virtual machines with SR-IOV or a dedicated NIC. <br><br>  As a result of high traffic monitoring levels, expect high network utilization. <br><br> Set the promiscuous mode on your vSwitch to **Accept**, which allows all traffic to reach the VM. Some vSwitch implementations may block certain protocols if it isn't configured correctly.|
|**Storage**     | Make sure to allocate enough read and write IOPs and throughput to match the performance of the appliances listed in this article. <br><br>You should expect high storage usage due to the large traffic monitoring volumes.      |


## OT network sensor VM requirements

The following tables list system requirements for OT network sensors on virtual appliances, and performance measured in our qualification labs.

For all deployments, bandwidth results for virtual machines may vary, depending on the distribution of protocols and the actual hardware resources that are available, including the CPU model, memory bandwidth, and IOPS.

|Hardware profile  |Performance / Monitoring  |Physical specifications  |
|---------|---------|---------|
|**C5600**     |   **Max bandwidth**: 2.5 Gb/sec <br>**Max monitored assets**: 12,000      | **vCPU**: 32 <br>**Memory**: 32 GB <br>**Storage**: 5.6 TB (600 IOPS)        |
|**E1800**     |    **Max bandwidth**: 800 Mb/sec <br>**Max monitored assets**: 10,000      | **vCPU**: 8 <br>**Memory**: 32 GB <br>**Storage**: 1.8 TB (300 IOPS)        |
|**E1000**     |    **Max bandwidth**: 800 Mb/sec <br>**Max monitored assets**: 10,000      | **vCPU**: 8 <br>**Memory**: 32 GB <br>**Storage**: 1 TB (300 IOPS)        |
|**E500**     |    **Max bandwidth**: 800 Mb/sec <br>**Max monitored assets**: 10,000      | **vCPU**: 8 <br>**Memory**: 32 GB <br>**Storage**: 500 GB (300 IOPS)        |
|**L500**     |   **Max bandwidth**: 160 Mb/sec <br>**Max monitored assets**: 1,000      | **vCPU**: 4 <br>**Memory**: 8 GB <br>**Storage**: 500 GB (150 IOPS)        |
|**L100**     |    **Max bandwidth**: 100 Mb/sec <br>**Max monitored assets**: 800      | **vCPU**: 4 <br>**Memory**: 8 GB <br>**Storage**: 100 GB (150 IOPS)        |
|**L60** [*](ot-appliance-sizing.md#l60) |     **Max bandwidth**: 10 Mb/sec <br>**Max monitored assets**: 100      | **vCPU**: 4 <br>**Memory**: 8 GB <br>**Storage**: 60 GB (150 IOPS)        |

> [!NOTE]
> There is no need to pre-install an operating system on the VM, the sensor installation includes the operating system image.

## On-premises management console VM requirements

An on-premises management console on a virtual appliance is supported for enterprise deployments with the following requirements:

| Specification               | Requirements |
| ------------------ | ---------- |
| Hardware profile               | E1800          |
| vCPU               | 8          |
| Memory             | 32 GB       |
| Storage            | 1.8 TB      |
| Monitored sensors | Up to 300  |

## Next steps

> [!div class="step-by-step"]
> [« Prepare an OT site deployment](best-practices/plan-prepare-deploy.md)