---
title: Control the OT traffic monitored by Microsoft Defender for IoT
description: Learn how to control the OT network traffic monitored by Microsoft Defender for IoT.
ms.date: 01/24/2023
ms.topic: how-to
---

# Control the OT traffic monitored by Microsoft Defender for IoT

This article is one in a series of articles describing the [deployment path](ot-deploy/ot-deploy-path.md) for OT monitoring with Microsoft Defender for IoT.

:::image type="content" source="media/deployment-paths/progress-fine-tuning-ot-monitoring.png" alt-text="Diagram of a progress bar with Fine-tune OT monitoring highlighted." border="false" lightbox="media/deployment-paths/progress-fine-tuning-ot-monitoring.png":::

Microsoft Defender for IoT OT network sensors automatically run deep packet detection for IT and OT traffic, resolving network device data, such as device attributes and behavior.

After installing, activating, and configuring your OT network sensor, use the tools described in this article to control the type of traffic detected by each OT sensor, how it's identified, and what's included in Defender for IoT alerts.

## Prerequisites

Before performing the procedures in this article, you must have:

- An OT network sensor [installed](ot-deploy/install-software-ot-sensor.md), [activated, and configured](ot-deploy/activate-deploy-sensor.md)

- Access to your OT network sensor and on-premises management console as an **Admin** user.  For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

This step is performed by your deployment teams.

## Define OT and IoT subnets

Subnet configurations affect how devices are displayed in the sensor's [device maps](how-to-work-with-the-sensor-device-map.md). In the device maps, IT devices are automatically aggregated by subnet, where you can expand and collapse each subnet view to drill down as needed.

While the OT network sensor automatically learns the subnets in your network, we recommend confirming the learned settings and updating them as needed to optimize your map views.

Any subnets not listed as subnets are treated as external networks.

> [!NOTE]
> For cloud-connected sensors, you may eventually start configuring OT sensor settings from the Azure portal. Once you start configuring settings from the Azure portal, the **Subnets** pane on the OT sensor is read-only. For more information, see [Configure OT sensor settings from the Azure portal](configure-sensor-settings-portal.md).

**To define subnets**:

1. Sign into your OT sensor as an **Admin** user and select **System settings > Basic > Subnets**.

1. Confirm the current subnets listed and modify settings as needed.

    We recommend giving each subnet a meaningful name to differentiate between IT and OT networks. Subnet names can have up to 60 characters.

1. Use any of the following options to help you optimize your subnet settings:

    |Name  |Description  |
    |---------|---------|
    |**Import subnets**     | Import a .CSV file of subnet definitions        |
    |**Export subnets**     |  Export the currently listed subnets to a .CSV file.       |
    |**Clear all**     |  Clear all currently defined subnets        |
    |**Auto subnet learning**     |  Selected by default. Clear this option to define your subnets manually instead of having them be automatically detected by your OT sensor as new devices are detected.     |
    |**Resolve all Internet traffic as internal/private**     | Select to consider all public IP addresses as private, local addresses. If selected, public IP addresses are treated as local addresses, and alerts aren't sent about unauthorized internet activity.  <br><br>This option reduces notifications and alerts received about external addresses.      |
    |**ICS Subnet**     | Select to define a specific subnet as a separate OT subnet. Selecting this option helps you collapse device maps to a minimum of IT network elements.     |
    |**Segregated**     |   Select to show this subnet separately when displaying the device map according to Purdue level.  |

1. When you're done, select **Save** to save your updates.

## Customize port and VLAN names

Use the following procedures to enrich the device data shown in Defender for IoT by customizing port and VLAN names on your OT network sensors.

For example, you might want to assign a name to a non-reserved port that shows unusually high activity in order to call it out, or to assign a name to a VLAN number in order to identify it quicker.

> [!NOTE]
> For cloud-connected sensors, you may eventually start configuring OT sensor settings from the Azure portal. Once you start configuring settings from the Azure portal, the **VLANs** and **Port naming** panes on the OT sensors are read-only. For more information, see [Configure OT sensor settings from the Azure portal](configure-sensor-settings-portal.md).

### Customize names of detected ports

Defender for IoT automatically assigns names to most universally reserved ports, such as DHCP or HTTP. However, you might want to customize the name of a specific port to highlight it, such as when you're watching a port with unusually high detected activity.

Port names are shown in Defender for IoT when viewing device groups from the OT sensor's [device map](how-to-work-with-the-sensor-device-map.md), or when you create OT sensor reports that include port information.

**To customize a port name:**

1. Sign into your OT sensor as an **Admin** user.

1. Select **System settings** and then, under **Network monitoring**, select **Port Naming**.

1. In the **Port naming** pane that appears, enter the port number you want to name, the port's protocol, and a meaningful name. Supported protocol values include: **TCP**, **UDP**, and **BOTH**.

1. Select **+ Add port** to customize another port, and **Save** when you're done.

### Customize a VLAN name

VLANs are either discovered automatically by the OT network sensor or added manually. Automatically discovered VLANs can't be edited or deleted, but manually added VLANs require a unique name. If a VLAN isn't explicitly named, the VLAN's number is shown instead.

VLAN's support is based on 802.1q (up to VLAN ID 4094).

> [!NOTE]
> VLAN names aren't synchronized between the OT network sensor and the on-premises management console. If you want to view customized VLAN names on the on-premises management console, [define the VLAN names](../how-to-manage-the-on-premises-management-console.md#define-vlan-names) there as well.

**To configure VLAN names on an OT network sensor:**

1. Sign in to your OT sensor as an **Admin** user.

1. Select **System Settings** and then, under **Network monitoring**, select **VLAN Naming**.

1. In the **VLAN naming** pane that appears, enter a VLAN ID and unique VLAN name. VLAN names can contain up to 50 ASCII characters.

1. Select **+ Add VLAN** to customize another VLAN, and **Save** when you're done.

1. **For Cisco switches**: Add the `monitor session 1 destination interface XX/XX encapsulation dot1q` command to the SPAN port configuration, where *XX/XX* is the name and number of the port.

## Configure DHCP address ranges

Your OT network might consist of both static and dynamic IP addresses.

- **Static addresses** are typically found on OT networks through historians, controllers, and network infrastructure devices such as switches and routers.
- **Dynamic IP allocation** is typically implemented on guest networks with laptops, PCs, smartphones, and other portable equipment, using Wi-Fi or LAN physical connections in different locations.

If you're working with dynamic networks, you'll need to handle IP addresses changes as they occur, by defining DHCP address ranges on each OT network sensor. When an IP address is defined as a DHCP address, Defender for IoT identifies any activity happening on the same device, regardless of IP address changes.

**To define DHCP address ranges**:

1. Sign into your OT sensor and select **System settings** > **Network monitoring** > **DHCP Ranges**.

1. Do one of the following:

    - To add a single range, select **+ Add range** and enter the IP address range and an optional name for your range.
    - To add multiple ranges, create a .CSV file with columns for the *From*, *To*, and *Name* data for each of your ranges. Select **Import** to import the file to your OT sensor.     Range values imported from a .CSV file overwrite any range data currently configured for your sensor.
    - To export currently configured ranges to a .CSV file, select **Export**.
    - To clear all currently configured ranges, select **Clear all**.
  
    Range names can have up to 256 characters.

1. Select **Save** to save your changes.

## Configure traffic filters (advanced)

To reduce alert fatigue and focus your network monitoring on high priority traffic, you may decide to filter the traffic that streams into Defender for IoT at the source. Capture filters are configured via the OT sensor CLI, and allow you to block high-bandwidth traffic at the hardware layer, optimizing both appliance performance and resource usage.

For more information, see:

- [Defender for IoT CLI users and access](references-work-with-defender-for-iot-cli-commands.md)
- [Traffic capture filters](cli-ot-sensor.md#traffic-capture-filters)

## Next steps

> [!div class="step-by-step"]
> [« Configure proxy settings on an OT sensor](connect-sensors.md)

> [!div class="step-by-step"]
> [Verify and update your detected device inventory »](ot-deploy/update-device-inventory.md)
