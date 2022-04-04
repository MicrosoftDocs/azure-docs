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

- **Type 1**, bare-metal hypervisors.

    Type 1 hypervisors run directly on the host server's hardware. Hardware resources are directly allocated to guest virtual machines, and the hardware is managed directly. This type of hypervisor provides specific resources for specific virtual machines; in some instances, hardware can be passed directly to a guest. Microsoft Hyper-V Server and VMware vSphere/ESXi are examples of Type 1 hypervisors.

- **Type 2**, hosted hypervisors.

    Type 2 hypervisors run within the host operating system. In contrast to Type 1 hypervisors, they don't have exclusive hardware control and don't reserve dedicated resources for their guest virtual machines. Type 2 hypervisors include Microsoft Hyper-V (when running on Windows), Parallels, Oracle VirtualBox, and VMware Workstation or Fusion.

We recommend Type 1 hypervisors for Defender for IoT virtual machines. They provide deterministic performance and the ability to dedicate resources.

Defender for IoT supports the following hypervisor software:

- VMware ESXi (version 5.0 and later)
- Microsoft Hyper-V (VM configuration version 8.0 and later)


## Virtual appliance design considerations

This section outlines considerations for virtual appliance components, for both OT sensors and on-premises monitoring consoles.

|Specification  |Considerations  |
|---------|---------|
|**CPU**     |   Depending on capacity, we recommend dedicating non-dynamically allocated CPU cores, with at least 2.4 Ghz. <br><br>Expect a high CPU usage as the appliance constantly records network traffic and performs analytics. The CPU performance for OT sensors is critical in capturing and analyzing network traffic, and any slowdown is likely to result in packet drops and degraded performance. We recommend that you dedicate (pin) any physical cores, based on your required appliance capacity.      |
|**Memory**     | We recommend that you allocate non-dynamic RAM, based on required capacity. <br><br>Expect high RAM usage as the appliance is constantly records network traffic and performs analytics.        |
|**Network interfaces**     | We recommend that you physically map your virtual machines using SR-IOV or an NIC dedicated to the virtual machine. Physical mapping provides maximum performance, lowest latency and efficient CPU utilization. <br><br>When using a vSwitch, set the promiscuous mode to **Accept**, which allows all traffic to reach the VM. <br><br>Expect a high network usage as traffic monitoring volumes are high. vSwitch may block certain protocols if it isn't configured correctly.|
|**Storage**     | We recommend that you provision enough resources to ensure that there is enough read and write IOPs and throughput to match the performance of the appliances listed in this article. <br><br> Expect a high storage usage as traffic monitoring volumes, for both IOPs and throughput, are high. on this page.      |


## OT network sensor requirements

The following tables list system requirements for OT network sensors on virtual appliances.

For all deployments, bandwidth results for virtual machines may vary, depending on the distribution of protocols and the actual hardware resources that are available, including the CPU model, memory bandwidth, and IOPS.

# [Corporate deployments](#tab/corporate)


|Specification  |Requirements  |
|---------|---------|
|**Maximum bandwidth**     |   2.5 Gb/sec      |
|**Maximum monitored assets**     |   12,000      |
|**vCPU**     |   32      |
|**Memory**     |   32 GB      |
|**Storage**     |   5.6 TB - 500 IOPSm      |

# [Enterprise deployments](#tab/enterprise)

|Specification  |Requirements  |
|---------|---------|
|**Maximum bandwidth**     |   800 Mb/sec     |
|**Maximum monitored assets**     |  10,000     |
|**vCPU**     |   8      |
|**Memory**     |   32 GB      |
|**Storage**     |  1.8 TB - 300 IOPS     |

# [SBM and SMB rugged deployments](#tab/smb-smb-rugged)

|Specification  |Requirements  |
|---------|---------|
|**Maximum bandwidth**     |   160 Mb/sec     |
|**Maximum monitored assets**     |  800     |
|**vCPU**     |   4      |
|**Memory**     |   8 GB      |
|**Storage**     |  500 GB:<br> -200 IOPS 100 GB <br>- ~150 IOPS     |

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
