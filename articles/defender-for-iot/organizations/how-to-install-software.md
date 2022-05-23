---
title: Defender for IoT installation
description: Learn how to install a sensor and the on-premises management console for Microsoft Defender for IoT.
ms.date: 01/06/2022
ms.topic: how-to
---

# Defender for IoT software installation

This article describes how to install software for OT sensors and on-premises management consoles. You might need the procedures in this article if you're reinstalling software on a preconfigured appliance, or if you've chosen to install software on your own appliances.


## Pre-installation configuration

Each appliance type comes with its own set of instructions that are required before installing Defender for IoT software.

Make sure that you've completed the procedures as instructed in the **Reference > OT monitoring appliance** section of our documentation before installing Defender for IoT software.

For more information, see:

- [Which appliances do I need?](ot-appliance-sizing.md)
- [Pre-configured physical appliances for OT monitoring](ot-pre-configured-appliances.md), including the catalog of available appliances
- [OT monitoring with virtual appliances](ot-virtual-appliances.md)

## Download software files from the Azure portal

Make sure that you've downloaded the relevant software file for the sensor or on-premises management console.

You can obtain the latest versions of our OT sensor and on-premises management console software from the Azure portal, on the Defender for IoT > **Getting started** page. Select the **Sensor**, **On-premises management console**, or **Updates** tab and locate the software you need.

Mount the ISO file using one of the following options:

- **Physical media** – burn the ISO file to a DVD or USB, and boot from the media.

- **Virtual mount** – use iLO for HPE appliances, or iDRAC for Dell appliances to boot the ISO file.

## Install OT monitoring software

This section provides generic procedures for installing OT monitoring software on sensors or an on-premises management console.

Select one of the following tabs, depending on which type of software you're installing.

# [OT sensor](#tab/sensor)

This procedure describes how to install OT sensor software on a physical or virtual appliance.

> [!Note]
> At the end of this process you will be presented with the usernames and passwords for your device. Make sure to copy these down as these passwords will not be presented again.

**To install the sensor's software**:

1. Select the installation language.

    :::image type="content" source="media/tutorial-install-components/language-select.png" alt-text="Screenshot of the sensor's language select screen.":::

1. Select the sensor's architecture. For example:

    :::image type="content" source="media/tutorial-install-components/sensor-architecture.png" alt-text="Screenshot of the sensor's architecture select screen.":::

1. The sensor will reboot, and the **Package configuration** screen will appear. Press the up or down arrows to navigate, and the SPACE bar to select an option. Press ENTER to advance to the next screen.

1. Select the monitor interface and press the **ENTER** key.

    :::image type="content" source="media/tutorial-install-components/monitor-interface.png" alt-text="Screenshot of the select monitor interface screen.":::

1. If one of the monitoring ports is for ERSPAN, select it, and press the **ENTER** key.

    :::image type="content" source="media/tutorial-install-components/erspan-monitor.png" alt-text="Screenshot of the select erspan monitor screen.":::

1. Select the interface to be used as the management interface, and press the **ENTER** key.

    :::image type="content" source="media/tutorial-install-components/management-interface.png" alt-text="Screenshot of the management interface select screen.":::

1. Enter the sensor's IP address, and press the **ENTER** key.

    :::image type="content" source="media/tutorial-install-components/sensor-ip-address.png" alt-text="Screenshot of the sensor IP address screen.":::

1. Enter the path of the mounted logs folder. We recommend using the default path, and press the **ENTER** key.

    :::image type="content" source="media/tutorial-install-components/mounted-backups-path.png" alt-text="Screenshot of the mounted backup path screen.":::

1. Enter the Subnet Mask IP address, and press the **ENTER** key.

1. Enter the default gateway IP address, and press the **ENTER** key.

1. Enter the DNS Server IP address, and press the **ENTER** key.

1. Enter the sensor hostname and press the **ENTER** key.

    :::image type="content" source="media/tutorial-install-components/sensor-hostname.png" alt-text="Screenshot of the screen where you enter a hostname for your sensor.":::

    The installation process runs.

1. When the installation process completes, save the appliance ID, and passwords. Copy these credentials to a safe place as you'll need them to access the platform the first time you use it.

    :::image type="content" source="media/tutorial-install-components/login-information.png" alt-text="Screenshot of the final screen of the installation with usernames, and passwords.":::

# [On-premises management console](#tab/on-prem)


This procedure describes how to install on-premises management console software on a physical or virtual appliance.

The installation process takes about 20 minutes. After the installation, the system is restarted several times.

During the installation process, you can add a secondary NIC. If you choose not to install the secondary Network Interface Card (NIC) during installation, you can [add a secondary NIC](#add-a-secondary-nic-optional) at a later time.

**To install the software**:

1. Select your preferred language for the installation process.

   :::image type="content" source="media/tutorial-install-components/on-prem-language-select.png" alt-text="Select your preferred language for the installation process.":::

1. Select **MANAGEMENT-RELEASE-\<version\>\<deployment type\>**.

   :::image type="content" source="media/tutorial-install-components/on-prem-install-screen.png" alt-text="Select your version.":::

1. In the Installation Wizard, define the network properties:

   :::image type="content" source="media/tutorial-install-components/on-prem-first-steps-install.png" alt-text="Screenshot that shows the appliance profile.":::

   | Parameter | Configuration |
   |--|--|
   | **configure management network interface** | For Dell: **eth0, eth1** <br /> For HP: **enu1, enu2** <br>  Or <br />**possible value** |
   | **configure management network IP address** | Enter an IP address |
   | **configure subnet mask** | Enter an IP address|
   | **configure DNS** | Enter an IP address |
   | **configure default gateway IP address** | Enter an IP address|

1. **(Optional)** If you would like to install a secondary NIC, define the following appliance profile, and network properties:

    :::image type="content" source="media/tutorial-install-components/on-prem-secondary-nic-install.png" alt-text="Screenshot that shows the Secondary NIC install questions.":::

   | Parameter | Configuration |
   |--|--|
   | **configure sensor monitoring interface** (Optional) | **eth1** or **possible value** |
   | **configure an IP address for the sensor monitoring interface** | Enter an IP address |
   | **configure a subnet mask for the sensor monitoring interface** | Enter an IP address |

1. Accept the settings and continue by typing `Y`.

1. After about 10 minutes, the two sets of credentials appear. One is for a **CyberX** user, and one is for a **Support** user.

   :::image type="content" source="media/tutorial-install-components/credentials-screen.png" alt-text="Copy these credentials as they won't be presented again.":::

   Save the usernames and passwords, you'll need these credentials to access the platform the first time you use it.

1. Select **Enter** to continue.

For information on how to find the physical port on your appliance, see [Find your port](#find-your-port).

### Add a secondary NIC (optional)

You can enhance security to your on-premises management console by adding a secondary NIC dedicated for attached sensors within an IP address range. By adding a secondary NIC, the first will be dedicated for end-users, and the secondary will support the configuration of a gateway for routed networks.

:::image type="content" source="media/tutorial-install-components/secondary-nic.png" alt-text="The overall architecture of the secondary NIC.":::

Both NICs will support the user interface (UI). If you choose not to deploy a secondary NIC, all of the features will be available through the primary NIC.

This procedure describes how to add a secondary NIC if you've already installed your on-premises management console.

**To add a secondary NIC**:

1. Use the network reconfigure command:

    ```bash
    sudo cyberx-management-network-reconfigure
    ```

1. Enter the following responses to the following questions:

    :::image type="content" source="media/tutorial-install-components/network-reconfig-command.png" alt-text="Screenshot of the required answers to configure your appliance. ":::

    | Parameters | Response to enter |
    |--|--|
    | **Management Network IP address** | `N` |
    | **Subnet mask** | `N` |
    | **DNS** | `N` |
    | **Default gateway IP Address** | `N` |
    | **Sensor monitoring interface** <br>Optional. Relevant when sensors are on a different network segment.| `Y`, and select a possible value |
    | **An IP address for the sensor monitoring interface** | `Y`, and enter an IP address that's  accessible by the sensors|
    | **A subnet mask for the sensor monitoring interface** | `Y`, and enter an IP address that's  accessible by the sensors|
    | **Hostname** | Enter the hostname |

1. Review all choices and enter `Y` to accept the changes. The system reboots.

### Find your port

If you are having trouble locating the physical port on your device, you can use the following command to find your port:

```bash
sudo ethtool -p <port value> <time-in-seconds>
```

This command will cause the light on the port to flash for the specified time period. For example, entering `sudo ethtool -p eno1 120`, will have port eno1 flash for 2 minutes, allowing you to find the port on the back of your appliance.

---

## Post-installation validation

To validate the installation of a physical appliance, you need to perform many tests. The same validation process applies to all the appliance types.

Perform the validation by using the GUI or the CLI. The validation is available to both the **Support** and **CyberX** users.

Post-installation validation must include the following tests:

- **Sanity test**: Verify that the system is running.

- **Version**: Verify that the version is correct.

- **ifconfig**: Verify that all the input interfaces configured during the installation process are running.

### Check system health

Check your system health from the sensor or on-premises management console. For example:

:::image type="content" source="media/tutorial-install-components/system-health-check-screen.png" alt-text="Screenshot that shows the system health check.":::

#### Sanity

- **Appliance**: Runs the appliance sanity check. You can perform the same check by using the CLI command `system-sanity`.

- **Version**: Displays the appliance version.

- **Network Properties**: Displays the sensor network parameters.

#### Redis

- **Memory**: Provides the overall picture of memory usage, such as how much memory was used and how much remained.

- **Longest Key**: Displays the longest keys that might cause extensive memory usage.

#### System

- **Core Log**: Provides the last 500 rows of the core log, so that you can view the recent log rows without exporting the entire system log.

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

Verify that the system is up and running prior to testing the system's sanity.

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

1. Connect to the CLI with the Linux terminal (for example, PuTTY) and the **Support** user.

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

1. After restart, connect with the **Support** user credentials and use the `network list` command to verify that the parameters were changed.

1. Try to ping and connect from the GUI again.

### The appliance isn't responding

1. Connect a monitor and keyboard to the appliance, or use PuTTY to connect remotely to the CLI.

1. Use the **Support** user credentials to sign in.

1. Use the `system sanity` command and check that all processes are running.

    :::image type="content" source="media/tutorial-install-components/system-sanity-screen.png" alt-text="Screenshot that shows the system sanity command.":::

For any other issues, contact [Microsoft Support](https://support.microsoft.com/en-us/supportforbusiness/productselection?sapId=82c88f35-1b8e-f274-ec11-c6efdd6dd099).


## Access sensors from the on-premises management console

You can enhance system security by preventing direct user access to the sensor. Instead, use proxy tunneling to let users access the sensor from the on-premises management console with a single firewall rule. This technique narrows the possibility of unauthorized access to the network environment beyond the sensor. The user's experience when signing in to the sensor remains the same.

:::image type="content" source="media/tutorial-install-components/sensor-system-graph.png" alt-text="Screenshot that shows access to the sensor.":::

**To enable tunneling**:

1. Sign in to the on-premises management console's CLI with the **CyberX** or the **Support** user credentials.

1. Enter `sudo cyberx-management-tunnel-enable`.

1. Select **Enter**.

1. Enter `--port 10000`.

## Next steps

For more information, see [Set up your network](how-to-set-up-your-network.md).
