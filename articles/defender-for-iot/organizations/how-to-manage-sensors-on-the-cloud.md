---
title: Manage sensors with Defender for IoT in the Azure portal
description: Learn how to onboard, view, and manage sensors with Defender for IoT in the Azure portal.
ms.date: 05/08/2022
ms.topic: how-to
---

# Manage sensors with Defender for IoT in the Azure portal

This article describes how to onboard, view, and manage sensors with [Defender for IoT in the Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/Getting_Started).

## Purchase sensors or download software for sensors

This procedure describes how to use the Azure portal to contact vendors for pre-configured appliances, or how to download software for you to install on your own appliances. 

1. In the Azure portal, go to **Defender for IoT** > **Getting started** > **Sensor**.

1. Do one of the following:

    - To buy a pre-configured appliance, select **Contact** under **Buy preconfigured appliance**. This opens an email to [hardware.sales@arrow.com](mailto:hardware.sales@arrow.com) with a template request for Defender for IoT appliances. For more information, see [Pre-configured physical appliances for OT monitoring](ot-pre-configured-appliances.md).

    - To install software on your own appliances, do the following:

        1. Make sure that you have a supported appliance available.

        1. Under *Select version**, select the software version you want to install. We recommend that you always select the most recent version.

        1. Select **Download**. Download the sensor software and save it in a location that you can access from your selected appliance.

        1. Install your software. For more information, see [Defender for IoT installation](how-to-install-software.md).

## Onboard OT sensors

Onboard an OT sensor by registering it with Microsoft Defender for IoT and downloading a sensor activation file.

> [!NOTE]
> Enterprise IoT sensors also require onboarding and activation, with slightly different steps. For more information, see [Tutorial: Get started with Enterprise IoT](tutorial-getting-started-eiot-sensor.md).
>

**Prerequisites**: Make sure that you've set up your sensor and configured your SPAN port or TAP. For more information, see [Defender for IoT installation](how-to-install-software.md).

**To onboard your sensor to Defender for IoT**:

1. In the Azure portal, navigate to **Defender for IoT** > **Getting started** and select **Set up OT/ICS Security**. Alternately, from the Defender for IoT **Sites and sensors** page, select **Onboard OT sensor**.

1. By default, on the **Set up OT/ICS Security** page, **Step 1: Did you set up a sensor?** and **Step 2: Configure SPAN port or TAP​** of the wizard are collapsed. If you haven't completed these steps, do so before continuing.

1. In **Step 3: Register this sensor with Microsoft Defender for IoT** enter or select the following values for your sensor:

    1. In the **Sensor name** field, enter a meaningful name for your sensor.  We recommend including your sensor's IP address as part of the name, or using another easily identifiable name, that can help you keep track between the registration name in the Azure portal and the IP address of the sensor shown in the sensor console.

    1. In the **Subscription** field, select your Azure subscription.

    1. Toggle on the **Cloud connected** option to have your sensor connected to other Azure services, such as Microsoft Sentinel, and to push [threat intelligence packages](how-to-work-with-threat-intelligence-packages.md) from Defender for IoT to your sensors.

    1. In the **Sensor version** field, select which software version is installed on your sensor machine. We recommend that you select **22.X and above** to get all of the latest features and enhancements.

        If you haven't yet upgraded to version 22.x, see [Update a standalone sensor version](how-to-manage-individual-sensors.md#update-a-standalone-sensor-version) and [Reactivate a sensor for upgrades to version 22.x](#reactivate-a-sensor-for-upgrades-to-version-22x-from-a-legacy-version).

    1. In the **Site** section, select the **Resource name** and enter the **Display name** for your site. Add any tags as needed to help you identify your sensor.

    1. In the **Zone** field, select a zone from the menu, or select **Create Zone** to create a new one.

1. Select **Register**.

A success message appears and your activation file is automatically downloaded, and your sensor is now shown under the configured site on the Defender for IoT **Sites and sensors** page.

However, until you activate your sensor, the sensor's status will show as **Pending Activation**.

Make the downloaded activation file accessible to the sensor console admin so that they can activate the sensor. For more information, see [Upload new activation files](how-to-manage-individual-sensors.md#upload-new-activation-files).

## Manage on-boarded sensors

Sensors that you've on-boarded to Defender for IoT are listed on the Defender for IoT **Sites and sensors** page. Select a sensor in the grid to drill down to more options and details on the sensor details page, or do any of the following:

|Task  |Steps  |
|---------|---------|
| **Define OT sensor settings** | Select **Sensor settings (Preview**). For more information, see [Define and view OT sensor settings (Public preview)](#define-and-view-ot-sensor-settings-public-preview). |
| **Push threat intelligence updates** | Select your sensor in the grid > **Push Threat Intelligence update**. For more information, see [Threat intelligence research and packages](how-to-work-with-threat-intelligence-packages.md). |
|**Prepare an OT sensor to update to software version 22.x or higher**     | Select your sensor in the grid > **Prepare to update to 22.X**. For more information, see: <br><br>-[Reactivate a sensor for upgrades to version 22.x from a legacy version](#reactivate-a-sensor-for-upgrades-to-version-22x-from-a-legacy-version)<br>-  [Update a standalone sensor version](how-to-manage-individual-sensors.md#update-a-standalone-sensor-version)     |
| **Update an OT sensor** | Select an cloud-connected, active OT sensor with a legacy software version installed > **Update (Preview)** > **Download package**. For more information, see [Update your sensor software version](how-to-manage-individual-sensors.md#update-your-sensor-software-version). |
|**Export sensor data**     |Select **Export** at the top of the page.  A CSV file is downloaded with details about all sensors listed.       |
|**Download an activation file**     |   Either from the **...** options menu at the right of a sensor row, or from a sensor details page, select **Download activation file**. For more information, see [Reactivate a sensor](#reactivate-a-sensor).      |
|**Edit a sensor zone**    | Either from the **...** options menu at the right of a sensor row, or from a sensor details page, select **Edit**.  From the **Zone** menu, select a zone, or **Create new zone**. Select **Submit** to save your changes.     |
|**Edit automatic threat intelligence updates**     | Either from the **...** options menu at the right of a sensor row, or from a sensor details page, select **Edit**. Toggle the **Automatic Threat Intelligence Updates (Preview)** option on or off as needed. Select **Submit** to save your changes.       |
|**Delete a sensor**     |  Delete sensors only if you're no longer working with them. Either from the **...** options menu at the right of a sensor row, or from a sensor details page, select **Delete sensor**.      |
|**Monitor sensor health**     | Use the health widget above the grid to understand your overall system health, and the **Sensor health** column data to view health messages for specific sensors. Select a sensor to view more sensor health details on the sensor details **Overview** page.        |

A sensor details page provides basic information about the sensor, sensor health, and sensor settings, and also provides options for sensor management, such as downloading activation files, or deleting a sensor. For example:

:::image type="content" source="media/release-notes/sensor-overview.png" alt-text="Screenshot of a sensor overview page.":::

## Define and view OT sensor settings (Public preview)

This procedure describes how to define sensor settings from the Azure portal and apply them across your OT sensor network.

> [!TIP]
> Current settings available from the Azure portal include bandwidth caps, subnets, and VLAN naming.
>
> You can manage other sensor settings directly from the sensor console. For more information, see [Manage individual sensors](how-to-manage-individual-sensors.md).
>

**To configure and apply a sensor setting**:

1. In Defender for IoT on the Azure portal, select **Sites and sensors**. To apply settings to multiple sensors, select **Sensor settings (Preview)**. To start from a single sensor, navigate to and select your sensor. Then, on the sensor details page, select **Sensor settings (Preview)**.

1. Select **Add** and use the wizard to define values for your setting.

1. On the **Basics** tab, select your subscription and setting type. Then, define a meaningful name and an optional description for your setting.

1. On the **Setting** tab, define the value for your selected setting type, and then select **Next**. For more information, see [Sensor setting reference](#sensor-setting-reference) below.

1. On the **Apply** tab, select the sites, zones, and sensors where you want to apply your setting.

    > [!IMPORTANT]
    > Selecting a site or zone applies the setting to all connected sensors. Sensors added to a site later inherit settings applied to a site or zone.
    >
    > If you select to apply your settings to a site, you don't also need to select its zones or sensors.

1. When you're finished, select **Review and create** to create your setting and apply it as configured. If your new setting replaces an existing setting, a :::image type="icon" source="media/how-to-manage-individual-sensors/warning-icon.png" border="false"::: warning is shown to indicate the existing setting.

After you've created sensor settings, they're listed on the **Sites and sensors** > **Sensor settings** page, by setting type. Each setting shows a card with the setting name and value, and any sites, zones and sensors where the setting is applied.

Settings applied to specific sensors are also listed on the sensor details page. Select the link to the setting name to modify any values or applied sensors.

:::image type="content" source="media/how-to-manage-sensors-on-the-cloud/sensor-settings-details.png" alt-text="Screenshot of a sensor setting on a sensor details page.":::

### Sensor setting reference

Use the following tabs to learn more about individual OT sensor settings:

# [Bandwidth cap](#tab/bandwidth)

For a bandwidth cap, define the maximum bandwidth you want the sensor to use for outgoing communication from the sensor to the cloud, either in Kbps or Mbps.
**Default**: 1500 Kbps
**Minimum required for a stable connection to Azure** 350 Kbps. At this minimum setting, connections to the sensor console may be slower than usual.
# [Subnet](#tab/subnet)

To define your sensor's subnets do any of the following:
- Select **Import subnets** to import a comma-separated list of subnet IP addresses and masks. Select **Export subnets** to export a list of currently configured data, or **Clear all** to start from scratch.
- Select **Auto subnet learning** to have Defender for IoT automatically learn subnets from existing network data.
- Select **Resolve all Internet traffic as internal/private** to treat all public IPs as local addresses. If you select this option, your sensor will not send any alerts about unauthorized internet activity.
- Select **Add subnet** to add subnet details manually, including each IP address, mask, and subnet name.

For example:

:::image type="content" source="media/how-to-manage-sensors-on-the-cloud/sensor-settings-subnet-setting.png" alt-text="Screenshot of a sensor setting to define subnets.":::
# [VLAN naming](#tab/vlan)
To define a VLAN for your sensor, enter the VLAN ID and a meaningful name.

---

### In case of Internet outage

When a sensor setting is configured from the Azure portal, some settings on the sensor itself are blocked from modifications. However, if you're experiencing an Internet outage, you may need to unblock those settings in order to modify them from the sensor.

> [!IMPORTANT]
> As soon as your sensor's connection to the Azure portal is resumed, any settings you configured from the sensor are overwritten by the settings defined in the Azure portal.
>
> If you modify settings on the sensor during an internet outage, make sure to change the scope of the relevant setting in the Azure portal so that it no longer includes the affected sensor. Do this before you reconnect the sensor to the internet so that the Azure setting doesn't overwrite your changes.

**To unblock local sensor configurations**:

1. On the sensor console, go to **Settings > Advanced configurations** and select **Azure Remote Config**.

1. In the code box, modify the `block_local_config` value from `1` to `0`, and select **Close**.

    :::image type="content" source="media/how-to-manage-individual-sensors/remote-config-sensor.png" alt-text="Screenshot of the Azure Remote Config option.":::

1. Before reconnecting your sensor to the Internet, in Defender for IoT, navigate to any setting you've applied to your sensor from the Azure cloud.

    Remove the setting from your sensor before reconnecting your sensor to the Internet to prevent your local settings from being overwritten.

## Reactivate a sensor

You may need to reactivate your sensor because you want to:

- **Work in cloud-connected mode instead of locally managed mode**: After reactivation, existing sensor detections are displayed in the sensor console, and newly detected alert information is delivered through Defender for IoT in the Azure portal. This information can be shared with other Azure services, such as Microsoft Sentinel.

- **Work in locally managed mode instead of cloud-connected mode**: After reactivation, sensor detection information is displayed only in the sensor console.

- **Associate the sensor to a new site**:  To do this, re-register the sensor with new site definitions and use the new activation file to activate.

In such cases, do the following:

1. [Delete your existing sensor](#manage-on-boarded-sensors).
1. [Onboard your sensor](#onboard-ot-sensors), registering it again with any new settings.
1. [Upload your new activation file](how-to-manage-individual-sensors.md#upload-new-activation-files).

### Reactivate a sensor for upgrades to version 22.x from a legacy version

If you're updating your sensor version from a legacy version to 22.1.x or higher, you'll need a different activation procedure than for earlier releases.

Make sure that you've started with the relevant updates steps for this update. For more information, see [Update a standalone sensor version](how-to-manage-individual-sensors.md#update-a-standalone-sensor-version).

> [!NOTE]
> After upgrading to version 22.1.x, the new upgrade log can be found at the following path, accessed via SSH and the *cyberx_host* user: `/opt/sensor/logs/legacy-upgrade.log`.
>

## Understand sensor health (Public preview)

This procedure describes how to view sensor health data from the Azure portal. Sensor health includes data such as whether traffic is stable, the sensor is overloaded, notifications about sensor software versions, and more.

**To view overall sensor health**:

1. From Defender for IoT in the Azure portal, select **Sites and sensors** and then check the overall health score in the widget above the grid. For example:

    :::image type="content" source="media/how-to-manage-sensors-on-the-cloud/sensor-health-widget.png" alt-text="Screenshot of the sensor health widget.":::

1. To check on specific sensors, filter the sensors shown by sensor health, and select one or more sensor health issues to verify.

1. Expand the filtered sites and sensors now displayed in the grid, and use the **Sensor health** column to learn more at a high level.

1. To drill down further and understand recommended actions, select a sensor name to open the sensor details page.

1. On the sensor details **Overview** page, expand the **Health** section and any messages listed there to learn more. The **Recommendation** column on the right lists recommended actions for handling the health issue.

    :::image type="content" source="media/how-to-manage-sensors-on-the-cloud/sensor-health-recommendation.png" alt-text="Screenshot of a sensor health recommendation.":::

### Sensor health issues

Defender for IoT will indicate a sensor health issue for any of the following scenarios:

- Sensor traffic to Azure isn't stable
- Sensor fails regular sanity tests
- Sensor is overloaded and is dropping packets
- No traffic detected by the sensor
- Sensor software version is out of date and cannot connect
- A [remote sensor upgrade from the Azure portal](how-to-manage-individual-sensors.md?tabs=portal#update-your-sensor-software-version) fails

For more information, see our [Sensor health message reference](sensor-health-messages.md).

## Upload a diagnostics log for support (Public preview)

If you need to open a support ticket for a locally managed sensor, upload a diagnostics log to the Azure portal for the support team.

> [!TIP]
> For cloud-connected sensors, the diagnostics log is automatically available to your support team when you open a support ticket.
>

**To upload a diagnostics report**:

1. Make sure you have the diagnostics report available for upload. For more information, see [Download a diagnostics log for support](how-to-manage-individual-sensors.md#download-a-diagnostics-log-for-support).

1. In Defender for IoT in the Azure portal, go to the **Sites and sensors** page and select the locally-managed sensor that's related to your support ticket.

1. For your selected sensor, select the **...** options menu on the right > **Send diagnostic files to support (Preview)**. For example:

    :::image type="content" source="media/how-to-manage-sensors-on-the-cloud/upload-diagnostics-log.png" alt-text="Screenshot of the send diagnostic files to support option." lightbox="media/how-to-manage-sensors-on-the-cloud/upload-diagnostics-log.png":::


## Next steps

[View and manage alerts on the Defender for IoT portal (Preview)](how-to-manage-cloud-alerts.md)
