---
title: Defender for IoT installation
description: Learn how to install a sensor and the on-premises management console for Microsoft Defender for IoT.
ms.date: 01/06/2022
ms.topic: how-to
---

# Defender for IoT installation

This article describes how to install the following Microsoft Defender for IoT components:

- **Sensor**: Defender for IoT sensors collects ICS network traffic by using passive (agentless) monitoring. Passive and nonintrusive, the sensors have zero impact on OT and IoT networks and devices. The sensor connects to a SPAN port or network TAP and immediately begins monitoring your network. Detections appear in the sensor console. There, you can view, investigate, and analyze them in a network map, device inventory, and an extensive range of reports. Examples include risk assessment reports, data mining queries, and attack vectors.

- **On-premises management console**: The on-premises management console lets you carry out device management, risk management, and vulnerability management. You can also use it to carry out threat monitoring and incident response across your enterprise. It provides a unified view of all network devices, key IoT, and OT risk indicators and alerts detected in facilities where sensors are deployed. Use the on-premises management console to view and manage sensors in air-gapped networks.


### Find your port

If you are having trouble locating the physical port on your device, you can use the following command to:

```bash
sudo ethtool -p <port value> <time-in-seconds>
```

This command will cause the light on the port to flash for the specified time period. For example, entering `sudo ethtool -p eno1 120`, will have port eno1 flash for 2 minutes allowing you to find the port on the back of your appliance.


## Post-installation validation

To validate the installation of a physical appliance, you need to perform many tests. The same validation process applies to all the appliance types.

Perform the validation by using the GUI or the CLI. The validation is available to the user **Support** and the user **CyberX**.

Post-installation validation must include the following tests:

- **Sanity test**: Verify that the system is running.

- **Version**: Verify that the version is correct.

- **ifconfig**: Verify that all the input interfaces configured during the installation process are running.

### Check system health by using the GUI

:::image type="content" source="media/tutorial-install-components/system-health-check-screen.png" alt-text="Screenshot that shows the system health check.":::

#### Sanity

- **Appliance**: Runs the appliance sanity check. You can perform the same check by using the CLI command `system-sanity`.

- **Version**: Displays the appliance version.

- **Network Properties**: Displays the sensor network parameters.

#### Redis

- **Memory**: Provides the overall picture of memory usage, such as how much memory was used and how much remained.

- **Longest Key**: Displays the longest keys that might cause extensive memory usage.

#### System

- **Core Log**: Provides the last 500 rows of the core log, enabling you to view the recent log rows without exporting the entire system log.

- **Task Manager**: Translates the tasks that appear in the table of processes to the following layers:
  
  - Persistent layer (Redis)

  - Cash layer (SQL)

- **Network Statistics**: Displays your network statistics.

- **TOP**: Shows the table of processes. It's a Linux command that provides a dynamic real-time view of the running system.

- **Backup Memory Check**: Provides the status of the backup memory, checking the following:

  - The location of the backup folder

  - The size of the backup folder

  - The limitations of the backup folder

  - When the last backup happened

  - How much space there are for the extra backup files

- **ifconfig**: Displays the parameters for the appliance's physical interfaces.

- **CyberX nload**: Displays network traffic and bandwidth by using the six-second tests.

- **Errors from Core, log**: Displays errors from the core log file.

**To access the tool**:

1. Sign in to the sensor with the **Support** user credentials.

1. Select **System Statistics** from the **System Settings** window.

    :::image type="icon" source="media/tutorial-install-components/system-statistics-icon.png" border="false":::

### Check system health by using the CLI

Verify that the system is up, and running prior to testing the system's sanity.

**To test the system's sanity**:

1. Connect to the CLI with the Linux terminal (for example, PuTTY) and the user **Support**.

1. Enter `system sanity`.

1. Check that all the services are green (running).

    :::image type="content" source="media/tutorial-install-components/support-screen.png" alt-text="Screenshot that shows running services.":::

1. Verify that **System is UP! (prod)** appears at the bottom.

Verify that the correct version is used:

**To check the system's version**:

1. Connect to the CLI with the Linux terminal (for example, PuTTY) and the user **Support**.

1. Enter `system version`.

1. Check that the correct version appears.

Verify that all the input interfaces configured during the installation process are running:

**To validate the system's network status**:

1. Connect to the CLI with the Linux terminal (for example, PuTTY) and the user **Support**.

1. Enter `network list` (the equivalent of the Linux command `ifconfig`).

1. Validate that the required input interfaces appear. For example, if two quad Copper NICs are installed, there should be 10 interfaces in the list.

    :::image type="content" source="media/tutorial-install-components/interface-list-screen.png" alt-text="Screenshot that shows the list of interfaces.":::

Verify that you can access the console web GUI:

**To check that management has access to the UI**:

1. Connect a laptop with an Ethernet cable to the management port (**Gb1**).

1. Define the laptop NIC address to be in the same range as the appliance.

    :::image type="content" source="media/tutorial-install-components/access-to-ui.png" alt-text="Screenshot that shows management access to the UI.":::

1. Ping the appliance's IP address from the laptop to verify connectivity (default: 10.100.10.1).

1. Open the Chrome browser in the laptop and enter the appliance's IP address.

1. In the **Your connection is not private** window, select **Advanced** and proceed.

1. The test is successful when the Defender for IoT sign-in screen appears.

   :::image type="content" source="media/tutorial-install-components/defender-for-iot-sign-in-screen.png" alt-text="Screenshot that shows access to management console.":::

## Troubleshooting

### You can't connect by using a web interface

1. Verify that the computer that you're trying to connect is on the same network as the appliance.

1. Verify that the GUI network is connected to the management port.

1. Ping the appliance's IP address. If there is no ping:

   1. Connect a monitor and a keyboard to the appliance.

   1. Use the **Support** user and password to sign in.

   1. Use the command `network list` to see the current IP address.

      :::image type="content" source="media/tutorial-install-components/network-list.png" alt-text="Screenshot that shows the network list.":::

1. If the network parameters are misconfigured, use the following procedure to change them:

   1. Use the command `network edit-settings`.

   1. To change the management network IP address, select **Y**.

   1. To change the subnet mask, select **Y**.

   1. To change the DNS, select **Y**.

   1. To change the default gateway IP address, select **Y**.

   1. For the input interface change (sensor only), select **N**.

   1. To apply the settings, select **Y**.

1. After restart, connect with the support user credentials and use the `network list` command to verify that the parameters were changed.

1. Try to ping and connect from the GUI again.

### The appliance isn't responding

1. Connect a monitor and keyboard to the appliance, or use PuTTY to connect remotely to the CLI.

1. Use the **Support** user's credentials to sign in.

1. Use the `system sanity` command and check that all processes are running.

    :::image type="content" source="media/tutorial-install-components/system-sanity-screen.png" alt-text="Screenshot that shows the system sanity command.":::

For any other issues, contact [Microsoft Support](https://support.microsoft.com/en-us/supportforbusiness/productselection?sapId=82c88f35-1b8e-f274-ec11-c6efdd6dd099).

## Configure a SPAN port

A virtual switch does not have mirroring capabilities. However, you can use promiscuous mode in a virtual switch environment. Promiscuous mode  is a mode of operation, and a security, monitoring and administration technique, that is defined at the virtual switch, or portgroup level. By default, Promiscuous mode is disabled. When Promiscuous mode is enabled the virtual machine’s network interfaces that are in the same portgroup will use the Promiscuous mode to view all network traffic that goes through that virtual switch. You can implement a workaround with either ESXi, or Hyper-V.

:::image type="content" source="media/tutorial-install-components/purdue-model.png" alt-text="A screenshot of where in your architecture the sensor should be placed.":::


## Access sensors from the on-premises management console

You can enhance system security by preventing direct user access to the sensor. Instead, use proxy tunneling to let users access the sensor from the on-premises management console with a single firewall rule. This technique narrows the possibility of unauthorized access to the network environment beyond the sensor. The user's experience when signing in to the sensor remains the same.

:::image type="content" source="media/tutorial-install-components/sensor-system-graph.png" alt-text="Screenshot that shows access to the sensor.":::

**To enable tunneling**:

1. Sign in to the on-premises management console's CLI with the **CyberX**, or the **Support** user credentials.

1. Enter `sudo cyberx-management-tunnel-enable`.

1. Select **Enter**.

1. Enter `--port 10000`.

## Next steps

For more information, see [Set up your network](how-to-set-up-your-network.md).
