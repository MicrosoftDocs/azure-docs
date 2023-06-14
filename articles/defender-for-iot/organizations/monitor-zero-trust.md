---
title: Monitor OT networks with Zero Trust principles - Microsoft Defender for IoT
description: Learn how to use Microsoft Defender for IoT to monitor your operational technology (OT) networks with Zero Trust principles.
ms.date: 02/15/2023
ms.topic: tutorial
ms.collection:
  -       zerotrust-services
---

# Tutorial: Monitor your OT networks with Zero Trust principles

[!INCLUDE [zero-trust-principles](../../../includes/security/zero-trust-principles.md)]

Defender for IoT uses site and zone definitions across your OT network to ensure that you're maintaining network hygiene and keeping each subsystem separate and secure.

This tutorial describes how to monitor your OT network with Defender for IoT and Zero Trust principles.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * [Look for alerts on unknown devices](#look-for-alerts-on-unknown-devices)
> * [Look for vulnerable systems](#look-for-vulnerable-systems)
> * [Look for alerts on cross-subnet traffic](#look-for-alerts-on-cross-subnet-traffic)
> * [Simulate malicious traffic to test your network](#simulate-malicious-traffic-to-test-your-network)

> [!IMPORTANT]
> The **Recommendations** page in the Azure portal is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

To perform the tasks in this tutorial, you need:

- A [Defender for IoT OT plan](how-to-manage-subscriptions.md) on your Azure subscription

- Multiple cloud-connected, [OT sensors deployed](onboard-sensors.md), streaming traffic data to Defender for IoT. Each sensor should be assigned to a different site and zone, keeping each of your network segments separate and secure.

    For more information, see [Onboard OT sensors to Defender for IoT](onboard-sensors.md) or [Create OT sites and zones on an on-premises management console](ot-deploy/sites-and-zones-on-premises.md).

- The following permissions:

    - Access to the Azure portal as a [Security admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../role-based-access-control/built-in-roles.md#owner) user. For more information, see [Azure user roles and permissions for Defender for IoT](roles-azure.md).

    - Access to your sensors as an **Admin** or **Security Analyst** user. For more information, see [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).


## Look for alerts on cross-subnet traffic

Cross-subnet traffic is traffic that moves between sites and zones.

Cross-subnet traffic might be legitimate, such as when an internal system sends notification messages to other systems. However, if an internal system is sending communications to external servers, you want to verify that the communication is all legitimate. If there are messages going out, do they include information that can be shared? If there's traffic coming in, is it coming from secure sources?

You've separated your network in to sites and zones to keep each subsystem separate and secure, and may expect most traffic in a specific site or zone to stay internal to that site or zone. If you see cross-subnet traffic, it might indicate that your network is at risk.

**To search for cross-subnet traffic**:

1. Sign into an OT network sensor that you want to investigate and select **Device map** on the left.

1. Expand the **Groups** pane on the left of the map, and then select **Filter** > **Cross Subnet Connection**.

1. On the map, zoom in far enough so that you're able to view the connections between devices. Select specific devices to show a device details pane on the right where you can investigate the device further.

    For example, in the device details pane, select **Activity Report** to create an activity report and learn more about specific traffic patterns.


## Look for alerts on unknown devices

Do you know what devices are on your network, and who they're communicating with? Defender for IoT triggers alerts for any new, unknown device detected in OT subnets so that you can identify it and ensure both the device security and your network security.

Unknown devices might include *transient* devices, which move between networks. For example, transient devices might include a technician's laptop, which they connect to the network when maintaining servers, or a visitor's smartphone, which connects to a guest network at your office.

> [!IMPORTANT]
> Once you've identified unknown devices, make sure to investigate any further alerts being triggered by those devices, as any suspicious traffic on unknown devices creates an added risk. 
> 

**To check for unauthorized/unknown devices and risky sites and zones**:

1. In Defender for IoT on the Azure portal, select **Alerts** to view the alerts triggered by all of your cloud-connected sensors. To find alerts for unknown devices, filter for alerts with the following names:

    - **New Asset Detected**
    - **Field Device Discovered Unexpectedly**

    Perform each filter action separately. For each filter action, do the following to identify risky sites and zones in your network, which  may require refreshed security policies:

    1. Group your alerts by **Site** to see if you have a specific site that's generating many alerts for unknown devices.

    1. Add the **Zone** filter to the alerts displayed to narrow your alerts down to specific zones.

Specific sites or zones that generate many alerts for unknown devices are at risk. We recommend that you refresh your security policies to prevent so many unknown devices from connecting to your network.

**To investigate a specific alert for unknown devices**:

1. On the **Alerts** page, select an alert to view more details in the pane on the right and in the alert details page.

1. If you aren't yet sure whether the device is legitimate, investigate further on the related OT network sensor.

    - Sign into the OT network sensor that triggered the alert, and then locate your alert and open its alert details page.
    - Use the **Map view** and **Event Timeline** tabs to locate where in the network the device was detected, and any other events that might be related.

1. Mitigate the risk as needed by taking one of the following actions:

    - Learn the alert if the device is legitimate so that the alert isn't triggered again for the same device. On the alert details page, select **Learn**.
    - Block the device if it's not legitimate.

## Look for unauthorized devices

We recommend that you proactively watch for new, unauthorized devices detected on your network. Regularly checking for unauthorized devices can help prevent threats of rogue or potentially malicious devices that might infiltrate your network.

For example, use the **Review unauthorized devices** recommendation to identify all unauthorized devices.

**To review unauthorized devices**:

1. In Defender for IoT on the Azure portal, select **Recommendations (Preview)** and search for the **Review unauthorized devices** recommendation.
1. View the devices listed in the **Unhealthy devices** tab. Each of these devices in unauthorized and might be a risk to your network.

Follow the remediation steps, such as to mark the device as authorized if the device is known to you, or disconnect the device from your network if the device remains unknown after investigation.

For more information, see [Enhance security posture with security recommendations](recommendations.md).

> [!TIP]
> You can also review unauthorized devices by [filtering the device inventory](how-to-manage-device-inventory-for-organizations.md#view-the-device-inventory) by the **Authorization** field, showing only devices marked as **Unauthorized**.


## Look for vulnerable systems

If you have devices on your network with outdated software or firmware, they might be vulnerable to attack. Devices that are end-of-life, and have no more security updates are especially vulnerable.

**To search for vulnerable systems**:

1. In  Defender for IoT on the Azure portal, select **Workbooks** > **Vulnerabilities** to open the **Vulnerabilities** workbook.

1. In the **Subscription** selector at the top of the page, select the Azure subscription where your OT sensors are onboarded.

    The workbook is populated with data from across your entire network.

1. Scroll down to view the lists of **Vulnerable devices** and **Vulnerable components**. These devices and components in your network require attention, such as a firmware or software update, or replacement if no more updates are available.

1. In the **SiteName** select at the top of the page, select one or more sites to filter the data by site. Filtering data by site can help you identify concerns at specific sites, which may require site-wide updates or device replacements.

## Simulate malicious traffic to test your network

To verify the security posture of a specific device, run an **Attack vector** report to simulate traffic to that device. Use the simulated traffic to locate and mitigate vulnerabilities before they're exploited.

**To run an Attack vector report**:

1. Sign into an OT network sensor that detects the device you want to investigate, and select **Attack vector** on the left.

1. Select **+ Add simulation**, and then enter the following details in the **Add attack vector simulation** pane:
    
    |Field / Option  |Description  |
    |---------|---------|
    |**Name**     | Enter a meaningful name for your simulation, such as **Zero Trust** and the date.        |
    |**Maximum Vectors**     | Select **20** to include the maximum supported number of connections between devices.        |
    |**Show in Device Map**  | Optional. Select to show the simulation in the sensor's device map, which allows you to investigate further afterwards.        |
    |**Show All Source Devices**  / **Show all Target Devices**   | Select both to show all of the sensor's detected devices in your simulation as possible source devices and destination devices.        |

    Leave the **Exclude Devices** and **Exclude Subnets** blank to include all detected traffic in your simulation.

1. Select **Save** and wait for the simulation to finish running. The time it takes depends on the amount of traffic detected by your sensor.

1. Expand the new simulation and select any of the detected items to view more details on the right. For example:

    :::image type="content" source="media/monitor-zero-trust/attack-vector.png" alt-text="Screenshot of a sample attack vector simulation." lightbox="media/monitor-zero-trust/attack-vector.png":::

1. Look especially for any of the following vulnerabilities:
    
    |Vulnerability  |Description  |
    |---------|---------|
    |**Devices exposed to the internet**     |  For example, these vulnerabilities might be shown with a message of **Exposed to external threats due to internet connectivity**.       |
    |**Devices with open ports**     |   Open ports might legitimately be used for remote access, but can also be a risk. <br><br>For example, these vulnerabilities might be shown with a message similar to **Allowed remote access using TeamViewer Allowed remote access using Remote Desktop**      |
    |**Connections between devices that cross subnets**     |  For example, you might see a message of **Direct connection between devices**, which might be acceptable on its own, but risky in the context of crossing subnets.       |

## Monitor detected data per site or zone

In the Azure portal, view Defender for IoT data by site and zone from the following locations:

- **Device inventory**: [Group or filter the device inventory](how-to-manage-device-inventory-for-organizations.md#view-the-device-inventory) by site or zone.

- **Alerts**: Group or filter alerts by site only. Add the **Site** or **Zone** column to your grid to sort your data within your group.

- **Workbooks**: Open the Defender for IoT [**Vulnerabilities** workbook](workbooks.md#view-workbooks) to view detected vulnerabilities per site. You may also want to [create custom workbooks](workbooks.md#create-custom-workbooks) for your own organization to view more data by site and zone.

- **Sites and sensors**: [Filter the sensors](how-to-manage-sensors-on-the-cloud.md#site-management-options-from-the-azure-portal) listed by site or zone.

### View data in air-gapped environments

Use the following procedure to view more data for each site and zone on an on-premises management console. We recommend using an on-premises management console in air-gapped environments to centrally manage and monitor OT devices across your network.

1. Sign into your on-premises management console and select **Site Management**.

1. Locate the site and zone you want to view, using the filtering options at the top as needed:

    - **Connectivity**: Select to view only all OT sensors, or only connected / disconnected sensors only.
    - **Upgrade Status**: Select to view all OT sensors, or only those with a specific [software update status](update-ot-software.md#update-an-on-premises-management-console).
    - **Business Unit**: Select to view all OT sensors, or only those from a [specific business unit](ot-deploy/sites-and-zones-on-premises.md#create-business-units).
    - **Region**: Select to view all OT sensors, or only those from a [specific region](ot-deploy/sites-and-zones-on-premises.md#create-regions).

Each site and zone lists operational details about the sensor, such as details about its last software update, as well as the number of devices, alerts, and sensors aggregated for each zone.

Select **View device inventory**, **View zone map**, the :::image type="icon" source="media/sites-and-zones/sensor-icon.png" border="false"::: sensor icon, or the :::image type="icon" source="media/how-to-work-with-alerts-on-premises-management-console/alerts-icon.png" border="false"::: alerts button to jump to more specific data.


## Sample alerts to watch for

When monitoring for Zero Trust, the following list is an example of important Defender for IoT alerts to watch for:

:::row:::
    :::column:::
    - Unauthorized device connected to the network, especially any malicious IP/Domain name requests 
    - Known malware detected
    - Unauthorized connection to the internet
    - Unauthorized remote access
    - Network scanning operation detected
    - Unauthorized PLC programming
    - Changes to firmware versions        
    :::column-end:::
    :::column:::
    - “PLC Stop” and other potentially malicious commands
    - Device is suspected of being disconnected
    - Ethernet/IP CIP service request failure
    - BACnet operation failed
    - Illegal DNP3 operation
    - Unauthorized SMB login        
    :::column-end:::
:::row-end:::


## Next steps

You may need to make changes in your network segmentation based on the results of your monitoring, or as people and systems in your organization change over time.

Modify the structure of your sites and zones, and reassign site-based access policies to ensure that they always match your current network realities.

In addition to using the built-in Defender for IoT **Vulnerabilities** workbook, create more, custom workbooks to optimize your continuous monitoring.

For more information, see:

- [Manage sensors with Defender for IoT in the Azure portal](how-to-manage-sensors-on-the-cloud.md)
- [Manage on-premises sites and zones](ot-deploy/sites-and-zones-on-premises.md#manage-sites-and-zones)
- [Manage site-based access control (Public preview)](manage-users-portal.md#manage-site-based-access-control-public-preview)
- [Visualize Microsoft Defender for IoT data with Azure Monitor workbooks](workbooks.md)
