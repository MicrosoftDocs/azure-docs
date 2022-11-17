---
title: Install OT network monitoring software - Microsoft Defender for IoT
description: Learn how to install agentless monitoring software for an OT sensor and an on-premises management console for Microsoft Defender for IoT. Use this article if you're reinstalling software on a preconfigured appliance, or if you've chosen to install software on your own appliances.
ms.date: 07/13/2022
ms.topic: how-to
---

# Install OT agentless monitoring software

This article describes how to install agentless monitoring software for OT sensors and on-premises management consoles. You might need the procedures in this article if you're reinstalling software on a preconfigured appliance, or if you've chosen to install software on your own appliances.


## Download software files from the Azure portal

Download OT sensor and on-premises management console software from the Azure portal.

On the Defender for IoT > **Getting started** page, select the **Sensor**, **On-premises management console**, or **Updates** tab and locate the software you need.

If you're updating from a previous version, check the options carefully to ensure that you have the correct update path for your situation.

Mount the ISO file onto your hardware appliance or VM using one of the following options:

- **Physical media** – burn the ISO file to your external storage, and then boot from the media.

    -	DVDs: First burn the software to the DVD as an image
    -	USB drive: First make sure that you’ve created a bootable USB drive with software such as [Rufus](https://rufus.ie/en/), and then save the software to the USB drive. USB drives must have USB version 3.0 or later.

    Your physical media must have a minimum of 4 GB storage.

- **Virtual mount** – use iLO for HPE appliances, or iDRAC for Dell appliances to boot the ISO file.

## Pre-installation configuration

Each appliance type comes with its own set of instructions that are required before installing Defender for IoT software.

Make sure that you've completed any specific procedures required for your appliance before installing Defender for IoT software. For more information, see the [OT monitoring appliance catalog](appliance-catalog/appliance-catalog-overview.md).

For more information, see:

- [Which appliances do I need?](ot-appliance-sizing.md)
- [Pre-configured physical appliances for OT monitoring](ot-pre-configured-appliances.md), including the catalog of available appliances
- [OT monitoring with virtual appliances](ot-virtual-appliances.md)


## Install OT monitoring software

This section provides generic procedures for installing OT monitoring software on sensors or an on-premises management console.

Select one of the following tabs, depending on which type of software you're installing.

# [OT sensor](#tab/sensor)

This procedure describes how to install OT sensor software on a physical or virtual appliance after you've booted the ISO file on your appliance.

> [!Note]
> Towards the end of this process you will be presented with the usernames and passwords for your device. Make sure to copy these down as these passwords will not be presented again.

**To install the sensor's software**:

1. When the installation boots, you're first prompted to select the hardware profile you want to install.

    :::image type="content" source="media/tutorial-install-components/sensor-architecture.png" alt-text="Screenshot of the sensor's hardware profile options." lightbox="media/tutorial-install-components/sensor-architecture.png":::

    For more information, see [Which appliances do I need?](ot-appliance-sizing.md).

    System files are installed, the sensor reboots, and then sensor files are installed. This process can take a few minutes.

    When the installation steps are complete, the Ubuntu **Package configuration** screen is displayed, with the `Configuring iot-sensor` wizard, showing a prompt to  select your monitor interfaces.

    In this wizard, use the up or down arrows to navigate, and the SPACE bar to select an option. Press ENTER to advance to the next screen.

1. In the `Select monitor interfaces` screen, select the interfaces you want to monitor.

    > [!IMPORTANT] 
    > Make sure that you select only interfaces that are connected. 
    > If you select interfaces that are enabled but not connected, the sensor will show a *No traffic monitored* health notification in the Azure portal. If you connect more traffic sources after installation and want to monitor them with Defender for IoT, you can add them via the CLI.    

    By default, eno1 is reserved for the management interface and we recommend that you leave this option unselected.

    For example:

    :::image type="content" source="media/tutorial-install-components/monitor-interface.png" alt-text="Screenshot of the select monitor interface screen.":::

1. In the `Select erspan monitor interfaces` screen, select any ERSPAN monitoring ports that you have. The wizard lists available interfaces, even if you don't have any ERSPAN monitoring ports in your system. If you have no ERSPAN monitoring ports, leave all options unselected.

    For example:

    :::image type="content" source="media/tutorial-install-components/erspan-monitor.png" alt-text="Screenshot of the select erspan monitor screen.":::

1. In the `Select management interface` screen, we recommend keeping the default `eno1` value selected as the management interface.

    For example:

    :::image type="content" source="media/tutorial-install-components/management-interface.png" alt-text="Screenshot of the management interface select screen.":::

1. In the `Enter sensor IP address` screen, enter the IP address for the sensor appliance you're installing.

    :::image type="content" source="media/tutorial-install-components/sensor-ip-address.png" alt-text="Screenshot of the sensor IP address screen.":::

1. In the `Enter path to the mounted backups folder` screen, enter the path to the sensor's mounted backups. We recommend using the default path of `/opt/sensor/persist/backups`. For example:

    :::image type="content" source="media/tutorial-install-components/mounted-backups-path.png" alt-text="Screenshot of the mounted backup path screen.":::

1. In the `Enter Subnet Mask` screen, enter the IP address for the sensor's subnet mask. For example:

    :::image type="content" source="media/tutorial-install-components/sensor-subnet-ip.png" alt-text="Screenshot of the Enter Subnet Mask screen.":::

1. In the `Enter Gateway` screen, enter the sensor's default gateway IP address. For example:

    :::image type="content" source="media/tutorial-install-components/sensor-gateway-ip.png" alt-text="Screenshot of the Enter Gateway screen.":::

1. In the `Enter DNS server` screen, enter the sensor's DNS server IP address. For example:

    :::image type="content" source="media/tutorial-install-components/sensor-dns-ip.png" alt-text="Screenshot of the Enter DNS server screen.":::

1. In the `Enter hostname` screen, enter the sensor hostname. For example:

    :::image type="content" source="media/tutorial-install-components/sensor-hostname.png" alt-text="Screenshot of the Enter hostname screen.":::

1. In the `Run this sensor as a proxy server (Preview)` screen, select `<Yes>` only if you want to configure a proxy, and then enter the proxy credentials as prompted.

    The default configuration is without a proxy.

    For more information, see [Connect Microsoft Defender for IoT sensors without direct internet access by using a proxy (legacy)](how-to-connect-sensor-by-proxy.md).


1. <a name=credentials></a>The installation process starts running and then shows the credentials screen. For example:

    :::image type="content" source="media/tutorial-install-components/login-information.png" alt-text="Screenshot of the final screen of the installation with usernames, and passwords.":::

    Save the usernames and passwords listed, as the passwords are unique and this is the only time that the credentials are listed. Copy the credentials to a safe place so that you can use them when signing into the sensor for the first time.

    Select `<Ok>` when you're ready to continue.

    The installation continues running again, and then reboots when the installation is complete. Upon reboot, you're prompted to enter credentials to sign in. For example:

    :::image type="content" source="media/tutorial-install-components/sensor-sign-in.png" alt-text="Screenshot of a sensor sign-in screen after installation.":::

1. Enter the credentials for one of the users that you'd copied down in the [previous step](#credentials).

    - If the `iot-sensor login:` prompt disappears, press **ENTER** to have it shown again.
    - When you enter your password, the password characters don't display on the screen. Make sure you enter them carefully.

    When you've successfully signed in, the following confirmation screen appears:

    :::image type="content" source="media/tutorial-install-components/install-complete.png" alt-text="Screenshot of the sign-in confirmation.":::

Make sure that your sensor is connected to your network, and then you can sign in to your sensor via a network-connected browser. For more information, see [Activate and set up your sensor](how-to-activate-and-set-up-your-sensor.md#activate-and-set-up-your-sensor).

# [On-premises management console](#tab/on-prem)


This procedure describes how to install on-premises management console software on a physical or virtual appliance.

The installation process takes about 20 minutes. After the installation, the system is restarted several times.

During the installation process, you can add a secondary NIC. If you choose not to install the secondary Network Interface Card (NIC) during installation, you can [add a secondary NIC](#add-a-secondary-nic-optional) at a later time.

**To install the software**:

1. Select your preferred language for the installation process.

   :::image type="content" source="media/tutorial-install-components/on-prem-language-select.png" alt-text="Select your preferred language for the installation process.":::

1. Select your location. For example:

1. Detect keyboard layout?  default no, then select a keyboard layout 

1. Configure the network - your system has detected multiple interfaces. 

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

You can enhance security to your on-premises management console by adding a secondary NIC dedicated for attached sensors within an IP address range. When you use a secondary NIC, the first is dedicated for end-users, and the secondary supports the configuration of a gateway for routed networks.

:::image type="content" source="media/tutorial-install-components/secondary-nic.png" alt-text="Diagram that shows the overall architecture of the secondary NIC." border="false":::

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

If you're having trouble locating the physical port on your device, you can use the following command to find your port:

```bash
sudo ethtool -p <port value> <time-in-seconds>
```

This command will cause the light on the port to flash for the specified time period. For example, entering `sudo ethtool -p eno1 120`, will have port eno1 flash for 2 minutes, allowing you to find the port on the back of your appliance.

---

## Post-installation validation

After you've finished installing OT monitoring software on your appliance, test your system to make sure that processes are running correctly. The same validation process applies to all appliance types.

System health validations are supported via the sensor or on-premises management console UI or CLI, and are available for both the **Support** and **CyberX** users.

After installing OT monitoring software, make sure to run the following tests:

- **Sanity test**: Verify that the system is running.

- **Version**: Verify that the version is correct.

- **ifconfig**: Verify that all the input interfaces configured during the installation process are running.

For more information, see [Check system health](how-to-troubleshoot-the-sensor-and-on-premises-management-console.md#check-system-health) in our sensor and on-premises management console troubleshooting article.

## Configure tunneling access for sensors through the on-premises management console

Enhance system security by preventing direct user access to the sensor.

Instead of direct access, use proxy tunneling to let users access the sensor from the on-premises management console with a single firewall rule. This technique narrows the possibility of unauthorized access to the network environment beyond the sensor. The user's experience when signing in to the sensor remains the same.

When tunneling access is configured, users use the following URL syntax to access their sensor consoles: `https://<on-premises management console address>/<sensor address>/<page URL>`

For example, the following image shows a sample architecture where users access the sensor consoles via the on-premises management console.

:::image type="content" source="media/tutorial-install-components/sensor-system-graph.png" alt-text="Screenshot that shows access to the sensor." border="false":::

The interface between the IT firewall, on-premises management console, and the OT firewall is done using a reverse proxy with URL rewrites. The interface between the OT firewall and the sensors is done using reverse SSH tunnels.

**To enable tunneling access for sensors**:

1. Sign in to the on-premises management console's CLI with the **CyberX** or the **Support** user credentials.

1. Enter `sudo cyberx-management-tunnel-enable`.

1. Select **Enter**.

1. Enter `--port 10000`.

## Next steps

For more information, see:

- [Prepare your OT network for Microsoft Defender for IoT](how-to-set-up-your-network.md)
- [Troubleshoot the sensor and on-premises management console](how-to-troubleshoot-the-sensor-and-on-premises-management-console.md)
