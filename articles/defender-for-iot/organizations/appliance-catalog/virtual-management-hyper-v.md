---
title: On-premises management console (Microsoft Hyper-V) - Microsoft Defender for IoT
description: Learn about deploying a Microsoft Defender for IoT on-premises management console as a virtual appliance using  Microsoft Hyper-V.
ms.date: 04/24/2022
ms.topic: reference
---

# On-premises management console as a virtual appliance with Microsoft Hyper-V

This article describes an on-premises management console deployment on a virtual appliance using Microsoft Hyper-V.

# On-premises management console (Microsoft Hyper-V hypervisor)

This article describes an on-premises management console deployment on a virtual appliance using the Microsoft Hyper-V hypervisor (Windows 10 Pro or Enterprise)

| Appliance characteristic |Details |
|---------|---------|
|**Hardware profile** | As required, refer to [Which appliances do I need?](../ot-appliance-sizing.md) |
|**Performance** | 	As required, refer to [Which appliances do I need?](../ot-appliance-sizing.md) |
|**Physical specifications** | Virtual Machine |
|**Status** | Supported |

### Prerequisites

The on-premises management console supports both VMware and Hyper-V deployment options. Before you begin the installation, make sure you have the following items:

- Microsoft Hyper-V hypervisor (Windows 10 Pro or Enterprise) installed and operational

- Available hardware resources for the virtual machine

- ISO installation file for the Microsoft Defender for IoT sensor

Make sure the hypervisor is running.

### Create the virtual machine (Hyper-V)

To create a virtual machine by using Hyper-V:

1. Create a virtual disk in Hyper-V Manager.

1. Select the format **VHDX**.

1. Select **Next**.

1. Select the type **Dynamic expanding**.

1. Select **Next**.

1. Enter the name and location for the VHD.

1. Select **Next**.

1. Enter the required size (according to the architecture).

1. Select **Next**.

1. Review the summary and select **Finish**.

1. On the **Actions** menu, create a new virtual machine.

1. Select **Next**.

1. Enter a name for the virtual machine.

1. Select **Next**.

1. Select **Generation** and set it to **Generation 1**.

1. Select **Next**.

1. Specify the memory allocation (according to the architecture) and select the check box for dynamic memory.

1. Select **Next**.

1. Configure the network adaptor according to your server network topology.

1. Select **Next**.

1. Connect the VHDX created previously to the virtual machine.

1. Select **Next**.

1. Review the summary and select **Finish**.

1. Right-click the new virtual machine, and then select **Settings**.

1. Select **Add Hardware** and add a new adapter for **Network Adapter**.

1. For **Virtual Switch**, select the switch that will connect to the sensor management network.

1. Allocate CPU resources (according to the architecture).

1. Connect the management console's ISO image to a virtual DVD drive.

1. Start the virtual machine.

1. On the **Actions** menu, select **Connect** to continue the software installation.

### Software installation 

This section describes the ESXi software installation.

To install:

1. Open the virtual machine console.

1. The VM will start from the ISO image, and the language selection screen will appear.

1. Continue by installing OT sensor or on-premises management software. For more information, see [Install the software](#install-defender-for-iot-software).

The installation process takes about 20 minutes. After the installation, the system is restarted several times.

During the installation process, you can add a secondary NIC. If you choose not to install the secondary NIC during installation, you can [add a secondary NIC](#add-a-secondary-nic) at a later time.

To install the software:

1. Select your preferred language for the installation process.

   :::image type="content" source="media/tutorial-install-components/on-prem-language-select.png" alt-text="Select your preferred language for the installation process.":::

1. Select **MANAGEMENT-RELEASE-\<version\>\<deployment type\>**.

   :::image type="content" source="media/tutorial-install-components/on-prem-install-screen.png" alt-text="Select your version.":::

1. In the Installation Wizard, define the network properties:

   :::image type="content" source="media/tutorial-install-components/on-prem-first-steps-install.png" alt-text="Screenshot that shows the appliance profile.":::

   | Parameter | Configuration |
   |--|--|
   | **configure management network interface** | For Dell: **eth0, eth1** <br /> For HP: **enu1, enu2** <br>  Or <br />**possible value** |
   | **configure management network IP address:** | **IP address provided by the customer** |
   | **configure subnet mask:** | **IP address provided by the customer** |
   | **configure DNS:** | **IP address provided by the customer** |
   | **configure default gateway IP address:** | **IP address provided by the customer** |

1. **(Optional)** If you would like to install a secondary Network Interface Card (NIC), define the following appliance profile, and network properties:

    :::image type="content" source="media/tutorial-install-components/on-prem-secondary-nic-install.png" alt-text="Screenshot that shows the Secondary NIC install questions.":::

   | Parameter | Configuration |
   |--|--|
   | **configure sensor monitoring interface (Optional):** | **eth1**, or **possible value** |
   | **configure an IP address for the sensor monitoring interface:** | **IP address provided by the customer** |
   | **configure a subnet mask for the sensor monitoring interface:** | **IP address provided by the customer** |

1. Accept the settlings and continue by typing `Y`.

1. After about 10 minutes, the two sets of credentials appear. One is for a **CyberX** user, and one is for a **Support** user.

   :::image type="content" source="media/tutorial-install-components/credentials-screen.png" alt-text="Copy these credentials as they will not be presented again.":::  

   Save the usernames, and passwords, you'll need these credentials to access the platform the first time you use it.

1. Select **Enter** to continue.

For information on how to find the physical port on your appliance, see [Find your port](#find-your-port).

### Add a secondary NIC

You can enhance security to your on-premises management console by adding a secondary NIC. By adding a secondary NIC you will have one dedicated for your users, and the other will support the configuration of a gateway for routed networks. The second NIC is dedicated to all attached sensors within an IP address range.

:::image type="content" source="media/tutorial-install-components/secondary-nic.png" alt-text="The overall architecture of the secondary NIC.":::

Both NICs will support the user interface (UI). If you choose not to deploy a secondary NIC, all of the features will be available through the primary NIC.

If you have already configured your on-premises management console, and would like to add a secondary NIC to your on-premises management console, use the following steps:

1. Use the network reconfigure command:

    ```bash
    sudo cyberx-management-network-reconfigure
    ```

1. Enter the following responses to the following questions:

    :::image type="content" source="media/tutorial-install-components/network-reconfig-command.png" alt-text="Enter the following answers to configure your appliance.":::

    | Parameters | Response to enter |
    |--|--|
    | **Management Network IP address** | `N` |
    | **Subnet mask** | `N` |
    | **DNS** | `N` |
    | **Default gateway IP Address** | `N` |
    | **Sensor monitoring interface (Optional. Applicable when sensors are on a different network segment. For more information, see the Installation instructions)**| `Y`, **select a possible value** |
    | **An IP address for the sensor monitoring interface (accessible by the sensors)** | `Y`, **IP address provided by the customer**|
    | **A subnet mask for the sensor monitoring interface (accessible by the sensors)** | `Y`, **IP address provided by the customer** |
    | **Hostname** | **provided by the customer** |

1. Review all choices, and enter `Y` to accept the changes. The system reboots.

## Next steps

Continue understanding system requirements for physical or virtual appliances. For more information, see [Which appliances do I need?](../ot-appliance-sizing.md) and [OT monitoring with virtual appliances](../ot-virtual-appliances.md).

Then, use any of the following procedures to continue:

- [Purchase sensors or download software for sensors](../how-to-manage-sensors-on-the-cloud.md#purchase-sensors-or-download-software-for-sensors)
- [Download software for an on-premises management console](../how-to-manage-the-on-premises-management-console.md#download-software-for-the-on-premises-management-console)
- [Install software](../how-to-install-software.md)
