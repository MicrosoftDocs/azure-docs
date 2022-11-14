---
title: Manage sensors with Defender for IoT in the Azure portal
description: Learn how to onboard, view, and manage sensors with Defender for IoT in the Azure portal.
ms.date: 09/08/2022
ms.topic: how-to
---

# Manage sensors with Defender for IoT in the Azure portal

This article describes how to view and manage sensors with [Defender for IoT in the Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/Getting_Started).

## Purchase sensors or download software for sensors

This procedure describes how to use the Azure portal to contact vendors for pre-configured appliances, or how to download software for you to install on your own appliances.

1. In the Azure portal, go to **Defender for IoT** > **Getting started** > **Sensor**.

1. Do one of the following:

    - To buy a pre-configured appliance, select **Contact** under **Buy preconfigured appliance**. This opens an email to [hardware.sales@arrow.com](mailto:hardware.sales@arrow.com?cc=DIoTHardwarePurchase@microsoft.com&subject=Information%20about%20MD4IoT%20pre-configured%20appliances) with a template request for Defender for IoT appliances. For more information, see [Pre-configured physical appliances for OT monitoring](ot-pre-configured-appliances.md).

    - To install software on your own appliances, do the following:

        1. Make sure that you have a supported appliance available.

        1. Under *Select version**, select the software version you want to install. We recommend that you always select the most recent version.

        1. Select **Download**. Download the sensor software and save it in a location that you can access from your selected appliance.

        1. Install your software. For more information, see [Defender for IoT installation](how-to-install-software.md).

## Onboard sensors

Onboard a sensor by registering it with Microsoft Defender for IoT. For OT sensors, you'll also need to download a sensor activation file.

Select one of the following tabs, depending on the type of network you're working with.

# [OT sensors](#tab/ot)

**Prerequisites**: Make sure that you've set up your sensor and configured your SPAN port or TAP.

For more information, see [Activate and set up your sensor](how-to-activate-and-set-up-your-sensor.md) and [Defender for IoT installation](how-to-install-software.md), or our [Tutorial: Get started with Microsoft Defender for IoT for OT security](tutorial-onboarding.md).

**To onboard your OT sensor to Defender for IoT**:

1. In the Azure portal, navigate to **Defender for IoT** > **Getting started** and select **Set up OT/ICS Security**.

    :::image type="content" source="media/tutorial-onboarding/onboard-a-sensor.png" alt-text="Screenshot of the Set up O T/I C S Security button on the Get started page.":::

    Alternately, from the Defender for IoT **Sites and sensors** page, select **Onboard OT sensor**.

1. By default, on the **Set up OT/ICS Security** page, **Step 1: Did you set up a sensor?** and **Step 2: Configure SPAN port or TAP​** of the wizard are collapsed. If you haven't completed these steps, do so before continuing.

1. In **Step 3: Register this sensor with Microsoft Defender for IoT** enter or select the following values for your sensor:

    1. In the **Sensor name** field, enter a meaningful name for your sensor.  We recommend including your sensor's IP address as part of the name, or using another easily identifiable name that can help you keep track between the registration name in the Azure portal and the IP address of the sensor shown in the sensor console.

    1. In the **Subscription** field, select your Azure subscription.

    1. Toggle on the **Cloud connected** option to have your sensor connected to other Azure services, such as Microsoft Sentinel, and to push [threat intelligence packages](how-to-work-with-threat-intelligence-packages.md) from Defender for IoT to your sensors.

    1. In the **Sensor version** field, select which software version is installed on your sensor machine. We recommend that you select **22.X and above** to get all of the latest features and enhancements.

        If you haven't yet upgraded to version 22.x, see [Update Defender for IoT OT monitoring software](update-ot-software.md).

    1. In the **Site** section, select the **Resource name** and enter the **Display name** for your site. Add any tags as needed to help you identify your sensor.

    1. In the **Zone** field, select a zone from the menu, or select **Create Zone** to create a new one.

1. Select **Register**.

A success message appears and your activation file is automatically downloaded. Your sensor is now shown under the configured site on the Defender for IoT **Sites and sensors** page.

Until you activate your sensor, the sensor's status will show as **Pending Activation**.

Make the downloaded activation file accessible to the sensor console admin so that they can activate the sensor. For more information, see [Upload new activation files](how-to-manage-individual-sensors.md#upload-new-activation-files).

# [Enterprise IoT sensors](#tab/eiot)

**To set up an Enterprise IoT sensor**:

1. Navigate to the [Azure portal](https://portal.azure.com#home).

1. Select **Set up Enterprise IoT Security**.

    :::image type="content" source="media/tutorial-get-started-eiot/onboard-sensor.png" alt-text="Screenshot of the Set up Enterprise I O T Security button on the Get started page.":::

1. In the **Sensor name** field, enter a meaningful name for your sensor.

1. From the **Subscription** drop-down menu, select the subscription where you want to add your sensor.

1. Select **Register**. A **Sensor registration successful** screen shows your next steps and the command you'll need to start the sensor installation.

    For example:

    :::image type="content" source="media/tutorial-get-started-eiot/successful-registration.png" alt-text="Screenshot of the successful registration of an Enterprise I O T sensor.":::

1. Copy the command to a safe location, and continue with installing the sensor. For more information, see [Tutorial: Get started with Enterprise IoT monitoring](tutorial-getting-started-eiot-sensor.md#install-the-sensor-software).

> [!NOTE]
> As opposed to OT sensors, where you define your sensor's site, all Enterprise IoT sensors are automatically added to the **Enterprise network** site.

---

## Site management options from the Azure portal

When onboarding a new OT sensor to the Defender for IoT, you can add it to a new or existing site. When working with OT networks, organizing your sensors into sites allows you to manage your sensors more efficiently. Enterprise IoT sensors are all automatically added to the same site, named **Enterprise network**.

To edit a site's details, select the site's name on the **Sites and sensors** page. In the **Edit site** pane that opens on the right, modify any of the following values:

- **Display name**: Enter a meaningful name for your site.

- **Tags**: (Optional) Enter values for the **Key** and **Value** fields for each new tag you want to add to your site. Select **+ Add** to add a new tag.

- **Owner**: For sites with OT sensors only. Enter one or more email addresses for the user you want to designate as the owner of the devices at this site. The site owner is inherited by all devices at the site, and is shown on the IoT device entity pages and in incident details in Microsoft Sentinel. 

    In Microsoft Sentinel, use the **AD4IoT-SendEmailtoIoTOwner** and **AD4IoT-CVEAutoWorkflow** playbooks to automatically notify device owners about important alerts or incidents. For more information, see [Investigate and detect threats for IoT devices](../../sentinel/iot-advanced-threat-monitoring.md).

When you're done, select **Save** to save your changes.

## Sensor management options from the Azure portal

Sensors that you've on-boarded to Defender for IoT are listed on the Defender for IoT **Sites and sensors** page. Select a specific sensor name to drill down to more details for that sensor.

Use the options on the **Sites and sensor** page and a sensor details page to do any of the following tasks. If you're on the **Sites and sensors** page, select multiple sensors to apply your actions in bulk using toolbar options. For individual sensors, use the **Sites and sensors** toolbar options, the **...** options menu at the right of a sensor row, or the options on a sensor details page. 

|Task |Description  |
|---------|---------|
|:::image type="icon" source="media/how-to-manage-sensors-on-the-cloud/icon-threat-intelligence.png" border="false"::: **Push threat intelligence updates**     | OT sensors only. <br><br>Available for bulk actions from the **Sites and sensors** toolbar, for individual sensors from the **...** options menu, or from a sensor details page.     <br><br>For more information, see [Threat intelligence research and packages](how-to-work-with-threat-intelligence-packages.md).   |
|:::image type="icon" source="media/how-to-manage-sensors-on-the-cloud/icon-prepare-to-update.png" border="false"::: **Prepare an OT sensor to update to software version 22.x or higher**     |   Individual, OT sensors only. <br><br>Available from the **Sites and sensors** toolbar, the **...** options menu, or a sensor details page. <br><br>For more information, see: <br>- [Reactivate a sensor for upgrades to version 22.x from a legacy version](how-to-manage-sensors-on-the-cloud.md#reactivate-an-ot-sensor-for-upgrades-to-version-22x-from-a-legacy-version)<br>-  [Update Defender for IoT OT monitoring software](update-ot-software.md#download-and-apply-a-new-activation-file)   |
|:::image type="icon" source="media/how-to-manage-sensors-on-the-cloud/icon-recover.png" border="false"::: **Recover a password**     | Individual, OT sensors only. <br><br>Available from the **...** options menu or a sensor details page. Enter the secret identifier obtained on the sensor's sign-in screen.      |
|:::image type="icon" source="media/how-to-manage-sensors-on-the-cloud/icon-export.png" border="false"::: **Export sensor data**     |  Available from the **Sites and sensors** toolbar only, to download a CSV file with details about all the sensors listed.       |
|:::image type="icon" source="media/how-to-manage-sensors-on-the-cloud/icon-export.png" border="false"::: **Download an activation file**     |   Individual, OT sensors only. <br><br>Available from the **...** options menu or a sensor details page.      |
|:::image type="icon" source="media/how-to-manage-sensors-on-the-cloud/icon-edit.png" border="false"::: **Edit a sensor zone**     |    For individual sensors only, from the **...** options menu or a sensor details page.  <br><br>Select **Edit**, and then select a new zone from the **Zone** menu or select **Create new zone**. Select **Submit** to save your changes.    |
|:::image type="icon" source="media/how-to-manage-sensors-on-the-cloud/icon-edit.png" border="false":::  **Create an activation command**     | Individual, Enterprise IoT sensors only. <br><br>Available from the **...** options menu or a sensor details page.  Select **Edit** and   then select **Create activation command**. <br><br>For more information, see [Install an Enterprise IoT sensor](tutorial-getting-started-eiot-sensor.md#install-the-sensor-software).        |
|:::image type="icon" source="media/how-to-manage-sensors-on-the-cloud/icon-edit.png" border="false":::  **Edit automatic threat intelligence updates**     | Individual, OT sensors only. <br><br>Available from the **...** options menu or a sensor details page.  <br><br>Select **Edit** and then toggle the **Automatic Threat Intelligence Updates (Preview)** option on or off as needed. Select **Submit** to save your changes. |
|:::image type="icon" source="media/how-to-manage-sensors-on-the-cloud/icon-delete.png" border="false"::: **Delete a sensor**    |   For individual sensors only, from the **...** options menu or a sensor details page.      |
| :::image type="icon" source="media/how-to-manage-sensors-on-the-cloud/icon-diagnostics.png" border="false"::: **Send diagnostic files to support** | Individual, locally managed OT sensors only. <br><br>Available from the **...** options menu. <br><br>For more information, see [Upload a diagnostics log for support (Public preview)](#upload-a-diagnostics-log-for-support-public-preview).|
| **Download SNMP MIB file** | Available from the **Sites and sensors** toolbar **More actions** menu. <br><br>For more information, see [Set up SNMP MIB monitoring](how-to-set-up-snmp-mib-monitoring.md).|
| **Recover an on-premises management console password** | Available from the **Sites and sensors** toolbar **More actions** menu. <br><br>For more information, see [Manage the on-premises management console](how-to-manage-the-on-premises-management-console.md). |
| **Download endpoint details** (Public preview) | Available from the **Sites and sensors** toolbar **More actions** menu, for OT sensor versions 22.x only. <br><br>Download the list of endpoints that must be enabled as secure endpoints from OT network sensors. Make sure that HTTPS traffic is enabled over port 443 to the listed endpoints for your sensor to connect to Azure. Outbound allow rules are defined once for all OT sensors onboarded to the same subscription.<br><br>To enable this option, select a sensor with a supported software version, or a site with one or more sensors with supported versions. |

## Reactivate an OT sensor

You may need to reactivate an OT sensor because you want to:

- **Work in cloud-connected mode instead of locally managed mode**: After reactivation, existing sensor detections are displayed in the sensor console, and newly detected alert information is delivered through Defender for IoT in the Azure portal. This information can be shared with other Azure services, such as Microsoft Sentinel.

- **Work in locally managed mode instead of cloud-connected mode**: After reactivation, sensor detection information is displayed only in the sensor console.

- **Associate the sensor to a new site**:  To do this, re-register the sensor with new site definitions and use the new activation file to activate.

In such cases, do the following:

1. [Delete your existing sensor](#sensor-management-options-from-the-azure-portal).
1. [Onboard the sensor again](onboard-sensors.md#onboard-ot-sensors), registering it with any new settings.
1. [Upload your new activation file](how-to-manage-individual-sensors.md#upload-new-activation-files).

### Reactivate an OT sensor for upgrades to version 22.x from a legacy version

If you're updating your OT sensor version from a legacy version to 22.1.x or higher, you'll need a different activation procedure than for earlier releases.

Make sure that you've started with the relevant updates steps for this update. For more information, see [Update OT system software](update-ot-software.md).

> [!NOTE]
> After upgrading to version 22.1.x, the new upgrade log can be found at the following path, accessed via SSH and the *cyberx_host* user: `/opt/sensor/logs/legacy-upgrade.log`.
>

## Understand sensor health (Public preview)

This procedure describes how to view sensor health data from the Azure portal. Sensor health includes data such as whether traffic is stable, the sensor is overloaded, notifications about sensor software versions, and more.

**To view overall sensor health**:

1. From Defender for IoT in the Azure portal, select **Sites and sensors** and then check the overall health score in the widget above the grid. For example:

    :::image type="content" source="media/how-to-manage-sensors-on-the-cloud/sensor-widgets.png" alt-text="Screenshot showing the sensor health widgets." lightbox="media/how-to-manage-sensors-on-the-cloud/sensor-widgets.png":::

    - **Unhealthy** indicates one of the following scenarios:

        - Sensor traffic to Azure isn't stable
        - Sensor fails regular sanity tests
        - No traffic detected by the sensor
        - Sensor software version is no longer supported
        - A [remote sensor upgrade from the Azure portal](update-ot-software.md#update-your-sensors) fails

        For more information, see our [Sensor health message reference](sensor-health-messages.md).

    - **Updatable** means that the sensor has an older version, and there are software updates available to install
    - **Unsupported** means that the sensor has a software version install that is no longer supported.

1. To check on specific sensor issues, filter the grid by sensor health, and select one or more issues to verify. For example:

    :::image type="content" source="media/how-to-manage-sensors-on-the-cloud/sensor-health-filter.png" alt-text="Screenshot of the sensor health filter." lightbox="media/how-to-manage-sensors-on-the-cloud/sensor-health-filter.png":::

1. Expand the filtered sites and sensors now displayed in the grid, and use the **Sensor health** column to learn more at a high level.

1. To drill down further and understand recommended actions, select a sensor name to open the sensor details page.

    For example:

    :::image type="content" source="media/how-to-manage-sensors-on-the-cloud/sensor-details-health.png" alt-text="Screenshot of the sensor details page showing health information." lightbox="media/how-to-manage-sensors-on-the-cloud/sensor-details-health.png":::

    On the sensor details **Overview** page, expand the **Health** section and any messages listed there to learn more. The **Recommendation** column on the right lists recommended actions for handling the health issue.

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
