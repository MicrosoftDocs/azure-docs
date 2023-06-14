---
title: Configure active monitoring for OT networks - Microsoft Defender for IoT
description: Describes the available methods for configuring active monitoring on your OT network with Microsoft Defender for IoT.
ms.date: 06/02/2022
ms.topic: how-to
---

# Configure active monitoring for OT networks

This article describes how to configure active monitoring on OT networks with Microsoft Defender for IoT, including methods for Windows Event monitoring and reverse DNS lookup.

## Plan your active monitoring

> [!IMPORTANT]
> Active monitoring runs detection activity directly in your network and may cause some downtime. Take care when configuring active monitoring so that you only scan necessary resources.

When planning active monitoring:

- **Verify the following questions**:

    - Can the devices you want to scan be discovered by the default Defender for IoT monitoring? If so, active monitoring may be unnecessary.
    - Are you able to run active queries on your network and on the devices you want to scan? To make sure, try running an active query on a staging environment.

    Use the answers to these questions to determine exactly which sites and address ranges you want to monitor.

- **Identify maintenance windows** where you can schedule active monitoring intervals safely.

- **Identify active monitoring owners**, which are personnel who can supervise the active monitoring activity and stop the monitoring process if needed.

- **Determine which active monitoring method to use**:

    - Use [Windows Endpoint Monitoring](configure-windows-endpoint-monitoring.md) to monitor WMI events
    - Use [DNS lookup](configure-reverse-dns-lookup.md) for device data enrichment

## Configure network access

Before you can configure active monitoring, you must also configure your network to allow the sensor's management port IP address access to the OT network where your devices reside.

For example, the following image highlights in grey the extra network access you must configure from the management interface to the OT network.

:::image type="content" source="media/configure-active-monitoring/architecture.png" alt-text="Diagram highlighting the extra management network configuration required for active monitoring.":::


## Next steps

For more information, see:

- [Configure Windows Endpoint monitoring](configure-windows-endpoint-monitoring.md)
- [Configure DNS servers for reverse lookup resolution for OT monitoring](configure-reverse-dns-lookup.md)
