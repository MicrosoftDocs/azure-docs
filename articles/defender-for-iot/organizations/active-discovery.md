---
title: Run active discovery scans from your OT sensor - Microsoft Defender for IoT
description: Learn how to run active discovery scans from your OT sensor interface to detect more device data and new devices in your network.
ms.date: 04/06/2022
ms.topic: how-to
---

# Run active discovery scans from your OT sensor

Run active discovery scans from your OT sensors to dive deeper into your device data and detect more devices on your network. For example, OT engineers might want to enrich existing device visibility, and SOC teams might want to collect more data, identifying more CVEs and assist in investigations for alerts and possible penetration paths.

For example, we recommend running active discovery scans in the following scenarios:

- **Non-optimal port monitoring locations**, such as in remote locations with only one or two PLCs and legacy network wiring
- **Data that doesn't pass over the wire**, such as patches installed on Windows machines, USB-enabled or disabled properties, MAC address tables in routers, and more
- **Lower-level traffic** that can't otherwise be captured
- **Switches that don't support SPAN/mirror ports**, where you'll need other methods to capture device data
- **Highly segmented networks**, where costs would be prohibitive to put sensors on each segment
- **Local programs that prevent ping access**, such as dormant assets that don't communicate over the network

> [!IMPORTANT]
> Active discovery scans run detection activity directly in your network. Take care when configuring your active discovery scan so that you only scan necessary resources.


## Supported protocols

Active discovery scans are supported for the following protocols:

- WMI
- DNS lookup
- Rockwell (public preview)
- Siemens (public preview)
- Cisco (public preview)
- Hirshman switches (public preview
- Ping sweep (public preview)
- Bacnet (public preview)

## Configure an active discovery scan

Configure an active discovery scan to run as a one-time scan, or to run periodically on the specified resources. 

**To configure an active discovery scan**:

1. On your sensor console, select the **Active discovery (Preview)** page, and then select **Create scan**.

1. In the pane that opens on the right, define the following values:

    |Name  |Description  |
    |---------|---------|
    |**Name**     | Enter a meaningful name for your scan        |
    |**Use case****     | Select one of the following, depending on the type of resource you want to scan:     <br><br>- **PLC discovery and enrichment scan** <br>- **Switch discovery scan**    |
    |**Target**     |Define one or more IP address ranges to scan         |
    |**Schedule scan**     |  Select either **One-time event** or **Periodically**, depending on how often you want your scan to run. <br>Then, define when exactly you want your scans to start running.       |

    Scans are scheduled according to the time and time zone configured on the sensor machine.

1. When you're done, select **Save**. Your active discovery scan will start running as configured.

## View scanning results

TBD

## Filter device inventory for your active discovery data

TBD

## Next steps

For more information, see:

TBD