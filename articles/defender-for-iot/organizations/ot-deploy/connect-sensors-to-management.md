---
title: Connect OT network sensors to an on-premises management console - Microsoft Defender for IoT 
description: Learn how to connect your OT network sensors to an on-premises management console.
ms.date: 01/16/2023
ms.topic: install-set-up-deploy
---

# Connect OT network sensors to the on-premises management console

This article is one in a series of articles describing the [deployment path](air-gapped-deploy.md) for a Microsoft Defender for IoT on-premises management console for air-gapped OT sensors.

:::image type="content" source="../media/deployment-paths/management-connect.png" alt-text="Diagram of a progress bar with Connect OT sensors highlighted." border="false":::

After you've installed and configured your OT network sensors, you can connect them to your on-premises management console for central management and network monitoring.

## Prerequisites

To perform the procedures in this article, make sure that you have:

- An on-premises management console [installed](install-software-on-premises-management-console.md), [activated, and configured](activate-deploy-management.md)

- One or more OT sensors [installed](install-software-ot-sensor.md), [configured, and activated](activate-deploy-sensor.md). To assign your OT sensor to a site and zone, make sure that you have at least one site and zone configured.

- Access to both your on-premises management console and OT sensors as an **Admin** user. For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](../roles-on-premises.md).

- To configure access to your OT sensors via proxy tunneling, make sure that you have access to the on-premises management console's CLI as a [privileged user](../references-work-with-defender-for-iot-cli-commands.md#privileged-user-access-for-ot-monitoring).

## Connect OT sensors to the on-premises management console

To connect OT sensors to the on-premises management console, copy a connection string from the on-premises management console and paste it as needed in your OT sensor console.

**On your on-premises management console**:

1. Sign into your on-premises management console and select **System Settings** and scroll down to see the **Sensor Setup - Connection String** area. For example:

   :::image type="content" source="../media/how-to-manage-sensors-from-the-on-premises-management-console/connection-string.png" alt-text="Screenshot that shows copying the connection string for the sensor.":::

1. Copy the string in the **Copy Connection String** box to the clipboard.

**On your OT sensor**:

1. Sign into your OT sensor and select **System settings > Basic > Sensor Setup > Connection to management console**.

1. In the **Connection String** field, paste the connection string you'd copied from the on-premises management console, and select **Connect**.

After you've connected your OT sensors to your on-premises management console, you'll see those sensors listed on the on-premises management console's **Site Management** page as **Unassigned sensors**.

> [!TIP]
> When you [create sites and zones](sites-and-zones-on-premises.md), assign each sensor to a zone to [monitor detected data segmented separately](../monitor-zero-trust.md).
>

## Configure OT sensor access via tunneling

You might want to enhance your system security by preventing the on-premises management console to access OT sensors directly.

In such cases, configure [proxy tunneling](air-gapped-deploy.md#access-ot-network-sensors-via-proxy-tunneling) on your on-premises management console to allow users to connect to OT sensors via the on-premises management console. No configuration is needed on the sensor.

While the default port used to access OT sensors via proxy tunneling is `9000`, modify this value to a different port as needed.

**To configure OT sensor access via tunneling**:

1. Sign into the on-premises management console's CLI via Telnet or SSH using a [privileged user](../references-work-with-defender-for-iot-cli-commands.md#privileged-user-access-for-ot-monitoring).

1. Run:

   ```bash
   sudo cyberx-management-tunnel-enable 
   ```

1. Allow a few minutes for the connection to start.

When tunneling access is configured, the following URL syntax is used to access the sensor consoles: `https://<on-premises management console address>/<sensor address>/<page URL>`

**To customize the port used with proxy tunneling**:

1. Sign into the on-premises management console's CLI via Telnet or SSH using a [privileged user](../references-work-with-defender-for-iot-cli-commands.md#privileged-user-access-for-ot-monitoring).

1. Run:

    ```bash
    sudo cyberx-management-tunnel-enable --port <port>
    ```

    Where `<port>` is the value of the port you want to use for proxy tunneling.

**To remove the proxy tunneling configuration**:

1. Sign into the on-premises management console's CLI via Telnet or SSH using a [privileged user](../references-work-with-defender-for-iot-cli-commands.md#privileged-user-access-for-ot-monitoring).

1. Run:

    ```bash
    cyberx-management-tunnel-disable
    ```

**To access proxy tunneling log files**:

Proxy tunneling log files are located in the following locations:

- **On the on-premises management console**: */var/log/apache2.log*
- **On the OT sensors**: */var/cyberx/logs/tunnel.log*

## Next steps

> [!div class="step-by-step"]
> [« Activate and set up an on-premises management console](activate-deploy-management.md)

> [!div class="step-by-step"]
> [Create OT sites and zones on an on-premises management console »](sites-and-zones-on-premises.md)
