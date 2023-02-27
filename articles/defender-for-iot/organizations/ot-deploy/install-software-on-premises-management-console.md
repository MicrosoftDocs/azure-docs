---
title: Install Microsoft Defender for IoT on-premises management console software - Microsoft Defender for IoT
description: Learn how to install Microsoft Defender for IoT on-premises management console software. Use this article if you're reinstalling software on a pre-configured appliance, or if you've chosen to install software on your own appliances.
ms.date: 12/13/2022
ms.topic: install-set-up-deploy
---

# Install Microsoft Defender for IoT on-premises management console software

Use the procedures in this article when installing Microsoft Defender for IoT software on an on-premises management console. You might be reinstalling software on a [pre-configured appliance](../ot-pre-configured-appliances.md), or you may be installing software on your own appliance.

## Prerequisites

Before installing Microsoft Defender for IoT, make sure that you have:

- [Traffic mirroring configured in your network](../best-practices/traffic-mirroring-methods.md)
- An [OT plan in Defender for IoT](../how-to-manage-subscriptions.md) on your Azure subscription
- An OT sensor [onboarded to Defender for IoT](../onboard-sensors.md) in the Azure portal
- [OT monitoring software installed on an OT network sensor](install-software-ot-sensor.md)

Each appliance type also comes with its own set of instructions that are required before installing Defender for IoT software. Make sure that you've completed any specific procedures required for your appliance before installing Defender for IoT software.

For more information, see:

- The [OT monitoring appliance catalog](../appliance-catalog/index.yml)
- [Which appliances do I need?](../ot-appliance-sizing.md)
- [OT monitoring with virtual appliances](../ot-virtual-appliances.md)

## Download software files from the Azure portal

Download on-premises management console software from Defender for IoT in the Azure portal.

Select **Getting started** > **On-premises management console** and select the software version you want to download.

> [!IMPORTANT]
> If you're updating software from a previous version, alternately use the options from the **Sites and sensors** > **Sensor update (Preview)** menu. Use this option especially when you're updating your on-premises management console together with connected OT sensors. For more information, see [Update Defender for IoT OT monitoring software](../update-ot-software.md).

## Install on-premises management console software

This procedure describes how to install OT management software on an on-premises management console, for a physical or virtual appliance.

The installation process takes about 20 minutes. After the installation, the system is restarted several times.

**To install the software**:

1. Mount the ISO file onto your hardware appliance or VM using one of the following options:

    - **Physical media** – burn the ISO file to your external storage, and then boot from the media.

        -	DVDs: First burn the software to the DVD as an image
        -	USB drive: First make sure that you’ve created a bootable USB drive with software such as [Rufus](https://rufus.ie/en/), and then save the software to the USB drive. USB drives must have USB version 3.0 or later.

        Your physical media must have a minimum of 4-GB storage.

    - **Virtual mount** – use iLO for HPE appliances, or iDRAC for Dell appliances to boot the ISO file.

1. Select your preferred language for the installation process.

   :::image type="content" source="../media/tutorial-install-components/on-prem-language-select.png" alt-text="Screenshot of selecting your preferred language for the installation process.":::

1. Select **MANAGEMENT-RELEASE-\<version\>\<deployment type\>**.

   :::image type="content" source="../media/tutorial-install-components/on-prem-install-screen.png" alt-text="Screenshot of selecting your management release version.":::

1. In the Installation Wizard, define the network properties:

   :::image type="content" source="../media/tutorial-install-components/on-prem-first-steps-install.png" alt-text="Screenshot that shows the appliance profile.":::

   | Parameter | Configuration |
   |--|--|
   | **configure management network interface** | For Dell: **eth0, eth1** <br /> For HP: **enu1, enu2** <br>  Or <br />**possible value** |
   | **configure management network IP address** | Enter an IP address |
   | **configure subnet mask** | Enter an IP address|
   | **configure DNS** | Enter an IP address |
   | **configure default gateway IP address** | Enter an IP address|

1. **(Optional)** If you would like to install a secondary Network Interface Card (NIC), define the following appliance profile, and network properties:

   | Parameter | Configuration |
   |--|--|
   | **configure sensor monitoring interface** (Optional) | **eth1** or **possible value** |
   | **configure an IP address for the sensor monitoring interface** | Enter an IP address |
   | **configure a subnet mask for the sensor monitoring interface** | Enter an IP address |

    For example:
    
    :::image type="content" source="../media/tutorial-install-components/on-prem-secondary-nic-install.png" alt-text="Screenshot that shows the Secondary NIC install questions.":::

    If you choose not to install the secondary NIC now, you can [do so at a later time](#add-a-secondary-nic-after-installation-optional).

1. Accept the settings and continue by typing `Y`.

1. After about 10 minutes, the two sets of credentials appear. For example:

   :::image type="content" source="../media/tutorial-install-components/credentials-screen.png" alt-text="Screenshot of the credentials that appear that must be copied as they won't be presented again.":::

   Save the usernames and passwords, you'll need these credentials to access the platform the first time you use it.

    For more information, see [Default privileged on-premises users](../roles-on-premises.md#default-privileged-on-premises-users).

1. Select **Enter** to continue.

### Add a secondary NIC after installation (optional)

You can enhance security to your on-premises management console by adding a secondary NIC dedicated for attached sensors within an IP address range. When you use a secondary NIC, the first is dedicated for end-users, and the secondary supports the configuration of a gateway for routed networks.

:::image type="content" source="../media/tutorial-install-components/secondary-nic.png" alt-text="Diagram that shows the overall architecture of the secondary NIC." border="false":::

Both NICs will support the user interface (UI). If you choose not to deploy a secondary NIC, all of the features will be available through the primary NIC.

This procedure describes how to add a secondary NIC if you've already installed your on-premises management console.

**To add a secondary NIC**:

1. Use the network reconfigure command:

    ```bash
    sudo cyberx-management-network-reconfigure
    ```

1. Enter the following responses to the following questions:

    :::image type="content" source="../media/tutorial-install-components/network-reconfig-command.png" alt-text="Screenshot of the required answers to configure your appliance. ":::

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

### Find a port on your appliance

If you're having trouble locating the physical port on your appliance, you can use the following command to find your port:

```bash
sudo ethtool -p <port value> <time-in-seconds>
```

This command will cause the light on the port to flash for the specified time period. For example, entering `sudo ethtool -p eno1 120`, will have port eno1 flash for 2 minutes, allowing you to find the port on the back of your appliance.

[!INCLUDE [caution do not use manual configurations](../includes/caution-manual-configurations.md)]

## Next steps

> [!div class="nextstepaction"]
> [Validate after installing software](post-install-validation-ot-software.md)

> [!div class="nextstepaction"]
> [Troubleshooting](../how-to-troubleshoot-the-sensor-and-on-premises-management-console.md)
