---
title: Install OT network monitoring software on an on-premises management console - Microsoft Defender for IoT
description: Learn how to install agentless monitoring software for an on-premises management console for Microsoft Defender for IoT. Use this article if you're reinstalling software on a pre-configured appliance, or if you've chosen to install software on your own appliances.
ms.date: 12/13/2022
ms.topic: how-to
---

## Install OT monitoring software on an on-premises management console

This section provides generic procedures for installing OT monitoring software on an on-premises management console.

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

1. After about 10 minutes, the two sets of credentials appear. For example:

   :::image type="content" source="media/tutorial-install-components/credentials-screen.png" alt-text="Copy these credentials as they won't be presented again.":::

   Save the usernames and passwords, you'll need these credentials to access the platform the first time you use it.

    For more information, see [Default privileged on-premises users](roles-on-premises.md#default-privileged-on-premises-users).

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

## Next steps

- [Post-installation validation](how-to-validate-post-install-ot-software.md)
- [Install OT monitoring software on OT sensors](how-to-install-software.md)
- [Troubleshoot the sensor and on-premises management console](how-to-troubleshoot-the-sensor-and-on-premises-management-console.md)