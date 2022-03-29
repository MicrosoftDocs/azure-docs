---
title: Microsoft Defender for IoT OT system hardware and virtual appliance requirements
description: Learn about system requirements for hardware and virtual appliances used for the Microsoft Defender for IoT OT sensors and on-premises management console.
ms.date: 03/28/2022
ms.topic: conceptual
---

# OT system hardware and virtual appliance requirements

## This article lists the hardware and virtual appliance requirements for Microsoft Defender for IoT OT sensors and on-premises management consoles. You can use either physical or virtual appliances as needed for your organization.

Applies to OT Hardware Requirements for the installation of Defender for IoT sensors and on-premises management appliances. The Defender for IoT appliances may either be physical or virtual, based on the user's preference.

This article covers the following topics:

**- Supported Hardware configurations** for the Sensors and On-Premises Management appliances.

**- Requirements and design considerations for virtual appliances**- sensors and On-Premises Management appliances.

**- How to onboard, view, and manage sensors** with Defender for IoT in the Azure portal.

**- Manage the On-premises management console** with Defender for IoT

**- Directly procure certified pre-installed appliances** which have been evaluated in our labs and are delivered ready to deploy.

## Deployment options

The following tables describe supported deployment options for your OT sensors and on-premises management console. When setting up your system, choose the deployment option that meets your needs best.

### Corporate IT/OT hybrid networks

|Name  |Max Throughput (OT Traffic) |Max Monitored Assets  |Deployment |
|---------|---------|---------|---------|
|C5600 (Corporate)    | 3 Gbps        | 12K        |Physical / Virtual         |

### Enterprise monitoring at the site level

|Name  |Max Throughput (OT Traffic)  |Max Monitored Assets  |Deployment  |
|---------|---------|---------|---------|
|E1800 (Enterprise)     |1 Gbps         |10K         |Physical / Virtual         |

### Securing production lines

|Name  |Max Throughput (OT Traffic  |Max Monitored Assets  |Deployment  |
|---------|---------|---------|---------|
|L500 (Line)    | 200 Mbps        |   1,000      |Physical / Virtual         |
|L100 (Line)    | 60 Mbps        |   800      | Physical / Virtual        |
|L60 (Line)     | 10 Mbps        |   100      |Physical / Virtual|

### On Premises Management Console

|Name  |Max Monitored Sensors  |Deployment  |
|---------|---------|---------|
|E1800 (Enterprise)     |Up to 300         |Physical / Virtual         |

## Hardware Compatibility List

Microsoft engineers have evaluated physical appliances in the certified appliances list and recommend them for deployments that require significant scale and support.

We can't guarantee functionality of hardware components not certified by our lab.

### Prerequisites

Due to our software being built on **Ubuntu 18.04**, all hardware components should be compatible with this OS.

### Central Processing Unit (CPU)

|  | |
|---------|---------|
|C5600 (Corporate)     |-  Intel Xeon Silver 4215 R 3.2 GHz, 11M cache, 8c/16T, 130 W       |
|E1800 (Enterprise)| - Intel Xeon E-2234, 3.6 GHz, 4C/8T, 71 W using Intel C242<br>-Intel Xeon E-2224, 3.4 GHz, 4C, 71 W using Intel C242<br>-Intel Xeon E-2144G 3.6GHz, 8M cache, 4C/8T, turbo (71W) with Intel C246|
|L500 (Line) <br> L100 (Line)<br> L60 (Line)|-Intel Core i7-8650U (1.9GHz/4-core/15W) using Intel Q170<br>-Intel Core i5-6500TE (6M Cache, up to 3.30 GHz) S1151Intel Atom® x7-E3950 Processor
         |

### Network Cards (Ethernet/SFP)

|Name  |Supported models and versions |
|---------|---------|
|C5600 (Corporate)     | -Intel X710        |
|E1800 (Enterprise)    | -Intel I350        |
|L500 (Line)           | -Intel I219        |
|L100 (Line)           |-Broadcom BCM5720   |
|L60 (Line)            |-Broadcom BCM5719   |

### Storage Arrays

|Name  |Supported models and versions |
|---------|---------|
|C5600 (Corporate)     |- 6 x 1.2-TB SAS 12G Enterprise 10K SFF (2.5 in) in Hot-Plug Hard Drive - RAID 5 with HPE Smart Array P408i-a SR Gen10 Controller <br>-3 x 1-TB SATA 6G Midline 7.2 K SFF (2.5 in) – RAID 5 with HPE Smart Array P408i-a SR Controller       |
|E1800 (Enterprise)    | -2 x 1-TB SATA 6G Midline 7.2 K SFF (2.5 in) – RAID 1 with HPE Smart Array P208i-a <br> -3 X 2TB 7.2K RPM SATA 6Gbps 512n 3.5in Hot-plug Hard Drive - RAID 5 with HPE Smart Array P208i-a <br> -3 X 2TB 7.2K RPM SATA 6Gbps 512n 3.5in Hot-plug Hard Drive - RAID 5 with Dell PERC H330      |
|L500 (Line) <br> L100 (Line) <br> L60 (Line)     | -128GB M.2 M-key 2260* 2242 (SATA 3 6 Gbps) PLP<br> -HPE Edgeline 256GB SATA 6G Read Intensive M.2 2242 3yr Wty Wide Temp SSD <br>-128GB 3ME3 Wide Temperature mSATA SSD

## Supported physical appliances

The following appliances have been evaluated in the Defender for IoT labs, and have the following advantages:

- **Performance Benchmark** - Total assets monitored
- **Compatibility** – New releases are tested in our labs on multiple appliances to ensure successful upgrade and driver support
- **Stability** – Products undergo long-term traffic monitoring and packet loss tests.
- **Upgradeability** – New releases are validated on multiple appliances in our labs.
- **In-lab experience** - Microsoft support teams have been trained and have a working knowledge of this hardware.
- **Availability** - Hardware on the list is readily available worldwide and components typically have long-term availability.

Microsoft has partnered with [Arrow Electronics](www.arrow.com) to provide preconfigured sensors. To purchase a preconfigured sensor, contact Arrow at the following address: hardware.sales@arrow.com.

Vendors interested in certifying more configurations, please contact email.

### OT Network Sensors
