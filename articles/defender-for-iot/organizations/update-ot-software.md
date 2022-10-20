---
title: Update Defender for IoT OT monitoring software versions
description: Learn how to update (upgrade) Defender for IoT software on OT sensors and on-premises management servers.
ms.date: 06/02/2022
ms.topic: how-to
---

# Update Defender for IoT OT monitoring software

This article describes how to update Defender for IoT software versions on OT sensor and on-premises management console appliances.

You can purchase preconfigured appliances for your sensors and on-premises management consoles, or install software on your own hardware machines. In either case, you'll need to update software versions to use new features for OT sensors and on-premises management consoles.

For more information, see [Which appliances do I need?](ot-appliance-sizing.md), [Pre-configured physical appliances for OT monitoring](ot-pre-configured-appliances.md), and [What's new in Microsoft Defender for IoT?](release-notes.md).

## Legacy version updates vs. recent version updates

When downloading your update files from the Azure portal, you’ll see the option to download different files for different types of updates. Update files differ depending on the version you’re updating from and updating to.

Make sure to select the file that matches your upgrade scenario.

Updates from legacy versions may require a series of software updates: If you still have a sensor version 3.1.1 installed, you'll need to first upgrade to version 10.5.5, and then to a 22.x version. For example:

:::image type="content" source="media/update-ot-software/legacy.png" alt-text="Screenshot of the multiple download options displayed.":::

## Verify network requirements

- Make sure that your sensors can reach the Azure data center address ranges and set up any extra resources required for the connectivity method your organization is using.

    For more information, see [OT sensor cloud connection methods](architecture-connections.md) and [Connect your OT sensors to the cloud](connect-sensors.md).

- Make sure that your firewall rules are configured as needed for the new version you're updating to. For example, the new version may require a new or modified firewall rule to support sensor access to the Azure portal. From the **Sites and sensors** page, select **More actions > Download sensor endpoint details** for the full list of endpoints required to access the Azure portal.

    For more information, see [Networking requirements](how-to-set-up-your-network.md#networking-requirements) and [Sensor management options from the Azure portal](how-to-manage-sensors-on-the-cloud.md#sensor-management-options-from-the-azure-portal).

## Update an on-premises management console

This procedure describes how to update Defender for IoT software on an on-premises management console, and is only relevant if your organization is using an on-premises management console to manage multiple sensors simultaneously.

In such cases, make sure to update your on-premises management consoles *before* you update software on your sensors. This process takes about 30 minutes.

> [!IMPORTANT]
> The software version on your on-premises management console must be equal to that of your most up-to-date sensor version. Each on-premises management console version is backwards compatible to older, supported sensor versions, but cannot connect to newer sensor versions.
>

**To update on-premises management console software**:

1. In the Azure portal, go to **Defender for IoT** > **Getting started** > **Updates**.

1. Scroll down to the **On-premises management console** section, and select **Download** for the software update. Save your `management-secured-patcher-<version>.tar` file locally. For example:

    :::image type="content" source="media/update-ot-software/on-premises-download.png" alt-text="Screenshot of the Download option for the on-premises management console." lightbox="media/update-ot-software/on-premises-download.png":::

    Make sure to select the version for the update you're performing. For more information, see [Legacy version updates vs. recent version updates](#legacy-version-updates-vs-recent-version-updates).

    [!INCLUDE [root-of-trust](includes/root-of-trust.md)]

1. On your on-premises management console, select **System Settings** > **Version Update**.

1. In the **Upload File** dialog, select **BROWSE FILE** and then browse to and select the update file you'd downloaded from the Azure portal.

    The update process starts, and may take about 30 minutes. During your upgrade, the system is rebooted twice.

    Sign in when prompted and check the version number listed in the bottom-left corner to confirm that the new version is listed.

## Update your sensors

You can update software on your sensors individually, directly from each sensor console, or in bulk from the on-premises management console. Select one of the following tabs for the steps required in each method.

> [!NOTE]
> If you are updating from software versions earlier than [22.1.x](release-notes.md#update-to-version-221x), note that this version has a large update with more complicated background processes. Expect this update to take more time than earlier updates have required.
>

> [!IMPORTANT]
> If you're using an on-premises management console to manage your sensors, make sure to update your on-premises management console software *before* you update your sensor software.
>
> On-premises management software is backwards compatible, and can connect to sensors with earlier versions installed, but not later versions. If you update your sensor software before updating your on-premises management console, the updated sensor will be disconnected from the on-premises management console.
>
> For more information, see [Update an on-premises management console](#update-an-on-premises-management-console).
>

# [From each sensor](#tab/sensor)

This procedure describes how to manually download the new sensor software version and then run your update directly on the sensor console.

**To update sensor software directly from the sensor console**:

1. In the Azure portal, go to **Defender for IoT** > **Getting started** > **Updates**.

1. From the **Sensors** section, select **Download** for the sensor update, and save your `<legacy/upstream>-sensor-secured-patcher-<version number>.tar` file locally. For example:

   :::image type="content" source="media/how-to-manage-individual-sensors/updates-page.png" alt-text="Screenshot of the Updates page of Defender for IoT." lightbox="media/how-to-manage-individual-sensors/updates-page.png":::

    Make sure you're downloading the correct file for the update you're performing. For more information, see [Legacy version updates vs. recent version updates](#legacy-version-updates-vs-recent-version-updates).

    [!INCLUDE [root-of-trust](includes/root-of-trust.md)]

1. On your sensor console, select **System Settings** > **Sensor management** > **Software Update**.

1. On the **Software Update** pane on the right, select **Upload file**, and then navigate to and select your downloaded `legacy-sensor-secured-patcher-<Version number>.tar` file. For example:

    :::image type="content" source="media/how-to-manage-individual-sensors/upgrade-pane-v2.png" alt-text="Screenshot of the Software Update pane on the sensor." lightbox="media/how-to-manage-individual-sensors/upgrade-pane-v2.png":::

    The update process starts, and may take about 30 minutes. During your upgrade, the system is rebooted twice.

    Sign in when prompted, and then return to the **System Settings** > **Sensor management** > **Software Update** pane to confirm that the new version is listed. For example:

    :::image type="content" source="media/how-to-manage-individual-sensors/defender-for-iot-version.png" alt-text="Screenshot of the upgrade version that appears after you sign in." lightbox="media/how-to-manage-individual-sensors/defender-for-iot-version.png":::

# [From an on-premises management console](#tab/onprem)

This procedure describes how to update several sensors simultaneously from an on-premises management console.

**Prerequisites**:

If you're upgrading an on-premises management console and managed sensors, [first update the management console](#update-an-on-premises-management-console), and then update the sensors.

The sensor update process won't succeed if you don't update the on-premises management console first.

**To update several sensors**:

1. On the Azure portal, go to **Defender for IoT** > **Updates**. Under **Sensors**, select **Download** and save the file. For example:

   :::image type="content" source="media/how-to-manage-individual-sensors/updates-page.png" alt-text="Screenshot of the Updates page of Defender for IoT." lightbox="media/how-to-manage-individual-sensors/updates-page.png":::

    Make sure you're downloading the correct file for the update you're performing. For more information, see [Legacy version updates vs. recent version updates](#legacy-version-updates-vs-recent-version-updates).

    [!INCLUDE [root-of-trust](includes/root-of-trust.md)]

1. On your on-premises management console, select **System Settings**, and identify the sensors that you want to update.

1. For any sensors you want to update, make sure that the **Automatic Version Updates** option is selected.

    Also make sure that sensors you *don't* want to update are *not* selected.

    Save your changes when you're finished selecting sensors to update. For example:

   :::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/automatic-updates.png" alt-text="Screenshot of on-premises management console with Automatic Version Updates selected." lightbox="media/how-to-manage-sensors-from-the-on-premises-management-console/automatic-updates.png":::

    > [!IMPORTANT]
    > If your **Automatic Version Updates** option is red, you have a update conflict. For example, an update conflict might occur if you have multiple sensors marked for automatic updates but the sensors currently have different software versions installed. Select the option to resolve the conflict.
    >

1. Scroll down and on the right, select the **+** in the **Sensor version update** box. Browse to and select the update file you'd downloaded from the Azure portal.

    Updates start running on each sensor selected for automatic updates.

1. Go to the **Site Management** page to view the update status and progress for each sensor.

    If updates fail, a retry option appears with an option to download the failure log. Retry the update process or open a support ticket with the downloaded log files for assistance.

---

> [!NOTE]
> After upgrading to version 22.1.x, the new upgrade log can be found at the following path, accessed via SSH and the *cyberx_host* user: `/opt/sensor/logs/legacy-upgrade.log`.
>


## Download and apply a new activation file

**Relevant only when updating from a legacy version to version 22.x or higher**

This procedure is relevant only if you're updating sensors from software versions earlier than 22.1.x. Such updates require a new activation file for each sensor, which you'll use to activate the sensor before you [update the software](#update-your-sensors).

**To prepare your sensor for update**:

1. In Defender for IoT on the Azure portal, select **Sites and sensors** on the left.

1. Select the site where you want to update your sensor, and then browse to the sensor you want to update.

1. Expand the row for your sensor, select the options **...** menu on the right of the row, and then select **Prepare to update to 22.x**. For example:

    :::image type="content" source="media/how-to-manage-sensors-on-the-cloud/prepare-to-update.png" alt-text="Screenshot of the Prepare to update option." lightbox="media/how-to-manage-sensors-on-the-cloud/prepare-to-update.png":::

1. <a name="activation-file"></a>In the **Prepare to update sensor to version 22.X** message, select **Let's go**.

    A new row in the grid is added for sensor you're upgrading. In that added row, select to download the activation file.

1. Verify that the status showing in the new sensor row has switched to **Pending activation**.

[!INCLUDE [root-of-trust](includes/root-of-trust.md)]

> [!NOTE]
> The previous sensor is not automatically deleted after your update. After you've updated the sensor software, make sure to [remove the previous sensor from Defender for IoT](#remove-your-previous-sensor).

**To apply your activation file**:

If you're upgrading from a legacy version to version 22.x or higher, make sure to apply the new activation file to your sensor.

1. On your sensor, select **System settings > Sensor management > Subscription & Mode Activation**.

1. In the **Subscription & Mode Activation** pane that appears on the right, select **Select file**, and then browse to and select the activation file you'd downloaded [earlier](#activation-file).

1. In Defender for IoT on the Azure portal, monitor your sensor's activation status. When the sensor is fully activated:

    - The sensor's **Overview** page shows an activation status of **Valid**.
    - In the Azure portal, on the **Sites and sensors** page, the sensor is listed as **OT cloud connected** and with the updated sensor version.


## Remove your previous sensor

Your previous sensors continue to appear in the **Sites and sensors** page until you delete them. After you've applied your new activation file and updated sensor software, make sure to delete any remaining, previous sensors from Defender for IoT.

Delete a sensor from the **Sites and sensors** page in the Azure portal. For more information, see [Sensor management options from the Azure portal](how-to-manage-sensors-on-the-cloud.md#sensor-management-options-from-the-azure-portal).

## Remove private IoT Hubs

If you've updated from a version earlier than 22.1.x, you may no longer need the private IoT Hubs you'd previously used to connect sensors to Defender for IoT.

In such cases:

1. Review your IoT hubs to ensure that it's not being used by other services.

1. Verify that your sensors are connected successfully.

1. Delete any private IoT Hubs that are no longer needed. For more information, see the [IoT Hub documentation](../../iot-hub/iot-hub-create-through-portal.md).

## Next steps

For more information, see:

- [Install OT system software](how-to-install-software.md)
- [Manage individual sensors](how-to-manage-individual-sensors.md)
- [Manage sensors from the management console](how-to-manage-sensors-from-the-on-premises-management-console.md)
- [Manage sensors with Defender for IoT in the Azure portal](how-to-manage-sensors-on-the-cloud.md)
- [Manage the on-premises management console](how-to-manage-the-on-premises-management-console.md)
- [Troubleshoot the sensor and on-premises management console](how-to-troubleshoot-the-sensor-and-on-premises-management-console.md)
