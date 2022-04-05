---
title: Microsoft Defender for IoT OT system virtual appliance requirements
description: Learn about system requirements for virtual appliances used for the Microsoft Defender for IoT OT sensors and on-premises management console.
ms.date: 04/04/2022
ms.topic: conceptual
---

# OT virtual system requirements for your own installations

This article lists the virtual appliance requirements for Microsoft Defender for IoT OT sensors and on-premises management consoles.

## About hypervisors

The virtualized hardware used to run guest operating systems is supplied by virtual machine hosts, also known as *hypervisors*.
There are generally two distinct categories of virtual machine hypervisors:

- **Type 1**, bare-metal hypervisors - run directly on the host server's hardware with resources directly allocated to guest virtual machines (eg. VMWare ESXi, Microsoft Hyper-V).
- **Type 2**, hosted hypervisors - run within the host operating system, and don't have exclusive hardware control or reserve resources (eg. Parallels, Oracle VirtualBox, and VMware Workstation or Fusion).

We recommend Type 1 hypervisors for Defender for IoT virtual machines. They provide deterministic performance and the ability to dedicate resources.

Defender for IoT supports the following hypervisor software:

- VMware ESXi (version 5.0 and later)
- Microsoft Hyper-V (VM configuration version 8.0 and later)


## Virtual appliance design considerations

This section outlines considerations for virtual appliance components, for both OT sensors and on-premises monitoring consoles.

|Specification  |Considerations  |
|---------|---------|
|**CPU**     |   We recommend CPU cores with at least 2.4 GHz, which are not dynamically allocated. <br><br>CPU usage will be high since the appliance continuously records and analyzes network traffic. For OT sensors, CPU performance is critical to capturing and analyzing network traffic, and any slowdown could lead to packet drops and performance degradation. We recommend that you dedicate (pinning) all physical cores necessary for your appliance.      |
|**Memory**     | RAM should be allocated based on required capacity, not dynamically. <br><br>Due to its constant network traffic recording and analytics, expect high RAM usage.       |
|**Network interfaces**     | Our recommendation is to physically map virtual machines with SR-IOV or a dedicated NIC. Physical mapping provides best performance, lowest latency and efficient CPU usage. <br><br>  As a result of high traffic monitoring levels, expect high network usage. <br><br> Set the promiscuous mode on your vSwitch to **Accept**, which allows all traffic to reach the VM. vSwitch may block certain protocols if it isn't configured correctly.|
|**Storage**     | Make sure to allocate enough read and write IOPs and throughput to match the performance of the appliances listed in this article. You should expect high storage usage due to the large traffic monitoring volumes.      |


## OT network sensor requirements

The following tables list system requirements for OT network sensors on virtual appliances.

For all deployments, bandwidth results for virtual machines may vary, depending on the distribution of protocols and the actual hardware resources that are available, including the CPU model, memory bandwidth, and IOPS.

# [Corporate](#tab/corporate)


|Specification  |Requirements  |
|---------|---------|
|**Maximum bandwidth**     |   2.5 Gb/sec      |
|**Maximum monitored assets**     |   12,000      |
|**vCPU**     |   32      |
|**Memory**     |   32 GB      |
|**Storage**     |   5.6 TB (600 IOPS)      |

# [Enterprise](#tab/enterprise)

|Specification  |Requirements  |
|---------|---------|
|**Maximum bandwidth**     |   800 Mb/sec     |
|**Maximum monitored assets**     |  10,000     |
|**vCPU**     |   8      |
|**Memory**     |   32 GB      |
|**Storage**     |  1.8 TB  (300 IOPS)     |

# [SMB](#tab/smb)

|Specification  |Requirements  |
|---------|---------|
|**Maximum bandwidth**     |   160 Mb/sec     |
|**Maximum monitored assets**     |  1000     |
|**vCPU**     |   4      |
|**Memory**     |   8 GB      |
|**Storage**     |  500 GB:<br> (150 IOPS)     |

# [Office](#tab/office)

|Specification  |Requirements  |
|---------|---------|
|**Maximum bandwidth**     |   100 Mb/sec     |
|**Maximum monitored assets**     |  800     |
|**vCPU**     |   4      |
|**Memory**     |   8 GB      |
|**Storage**     |  100 GB:<br> (150 IOPS)     |

# [Rugged](#tab/office)

|Specification  |Requirements  |
|---------|---------|
|**Maximum bandwidth**     |   10 Mb/sec     |
|**Maximum monitored assets**     |  100     |
|**vCPU**     |   4      |
|**Memory**     |   8 GB      |
|**Storage**     |  60 GB:<br> (150 IOPS)     |

---

### On-premises management console

An on-premises management console on a virtual appliance is supported for enterprise deployments with the following requirements:

| Specification               | Requirements |
| ------------------ | ---------- |
| vCPU               | 8          |
| Memory             | 32 GB       |
| Storage            | 1.8 TB      |
| Monitored sensors | Up to 300  |

## Next steps

Continue understanding system requirements for physical or virtual appliances. For more information, see:

- [OT system deployment options](ot-deployment-options.md)
- [Pre-configured physical appliances for OT systems](ot-preconfigured-appliances.md)
- [OT system physical appliance requirements](ot-physical-appliances.md)

Then, use any of the following procedures to continue:

- [Purchase sensors or download software for sensors](how-to-manage-sensors-on-the-cloud.md#purchase-sensors-or-download-software-for-sensors)
- [Download software for an on-premises management console](how-to-manage-the-on-premises-management-console.md#download-software-for-the-on-premises-management-console)
- [Install software](how-to-install-software.md)
