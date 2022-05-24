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

After you've finished installing OT monitoring software on your appliance, test your system to make sure that processes are running correctly. The same validation process applies to all appliance types.

System health validations are supported via the sensor or on-premises management console UI or CLI, and is available for both the **Support** and **CyberX** users.

After installing OT monitoring software, make sure to run the following tests:

- **Sanity test**: Verify that the system is running.

- **Version**: Verify that the version is correct.

- **ifconfig**: Verify that all the input interfaces configured during the installation process are running.

For more information, see [Check system health](how-to-troubleshoot-the-sensor-and-on-premises-management-console.md#check-system-health) in our sensor and on-premises management console troubleshooting article.

## Access sensors from the on-premises management console

You can enhance system security by preventing direct user access to the sensor. Instead, use proxy tunneling to let users access the sensor from the on-premises management console with a single firewall rule. This technique narrows the possibility of unauthorized access to the network environment beyond the sensor. The user's experience when signing in to the sensor remains the same.

:::image type="content" source="media/tutorial-install-components/sensor-system-graph.png" alt-text="Screenshot that shows access to the sensor.":::

**To enable tunneling**:

1. Sign in to the on-premises management console's CLI with the **CyberX** or the **Support** user credentials.

1. Enter `sudo cyberx-management-tunnel-enable`.

1. Select **Enter**.

1. Enter `--port 10000`.

## Next steps

For more information, see:

- [Prepare your OT network for Microsoft Defender for IoT](how-to-set-up-your-network.md)
- [Troubleshoot the sensor and on-premises management console](how-to-troubleshoot-the-sensor-and-on-premises-management-console.md)
