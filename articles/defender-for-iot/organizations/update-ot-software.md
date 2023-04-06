---
title: Update Defender for IoT OT monitoring software versions
description: Learn how to update (upgrade) Defender for IoT software on OT sensors and on-premises management servers.
ms.date: 02/14/2023
ms.topic: upgrade-and-migration-article
---

# Update Defender for IoT OT monitoring software

This article describes how to update Defender for IoT software versions on OT sensor and on-premises management console appliances.

You can purchase pre-configured appliances for your sensors and on-premises management consoles, or install software on your own hardware machines. In either case, you'll need to update software versions to use new features for OT sensors and on-premises management consoles.

For more information, see [Which appliances do I need?](ot-appliance-sizing.md), [Pre-configured physical appliances for OT monitoring](ot-pre-configured-appliances.md), and [OT monitoring software release notes](release-notes.md).

> [!NOTE]
> Update files are available for [currently supported versions](release-notes.md) only. If you have OT network sensors with legacy software versions that are no longer supported, open a support ticket to access the relevant files for your update.

## Prerequisites

To perform the procedures described in this article, make sure that you have:

- **A list of the OT sensors you'll want to update**, and the update methods you want to use. Each sensor that you want to update must be both [onboarded](onboard-sensors.md) to Defender for IoT and activated.

    |Update scenario  |Method details  |
    |---------|---------|
    |**On-premises management console**     |  If the OT sensors you want to update are connected to an on-premises management console, plan to [update your on-premises management console](#update-the-on-premises-management-console) *before* updating your sensors.|
    |**Cloud-connected sensors**     |  Cloud connected sensors can be updated remotely, directly from the Azure portal, or manually using a downloaded update package.  <br><br>[Remote updates](#update-ot-sensors) require that your OT sensor has version [22.2.3](release-notes.md#2223) or later already installed.       |
    |**Locally-managed sensors**     |  Locally-managed sensors can be updated using a downloaded update package, either via a connected on-premises management console, or directly on an OT sensor console. |

- **Required access permissions**:

    - **To download update packages or push updates from the Azure portal**, you'll need access to the Azure portal as a [Security Admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../role-based-access-control/built-in-roles.md#owner) user.

    - **To run updates on an OT sensor or on-premises management console**, you'll need access as an **Admin** user.

    - **To update an OT sensor via CLI**, you'll need access to the sensor as a [privileged user](roles-on-premises.md#default-privileged-on-premises-users).

    For more information, see [Azure user roles and permissions for Defender for IoT](roles-azure.md) and [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

## Verify network requirements

- Make sure that your sensors can reach the Azure data center address ranges and set up any extra resources required for the connectivity method your organization is using.

    For more information, see [OT sensor cloud connection methods](architecture-connections.md) and [Connect your OT sensors to the cloud](connect-sensors.md).

- Make sure that your firewall rules are configured as needed for the new version you're updating to.

    For example, the new version may require a new or modified firewall rule to support sensor access to the Azure portal. From the **Sites and sensors** page, select **More actions > Download sensor endpoint details** for the full list of endpoints required to access the Azure portal.

    For more information, see [Networking requirements](how-to-set-up-your-network.md#networking-requirements) and [Sensor management options from the Azure portal](how-to-manage-sensors-on-the-cloud.md#sensor-management-options-from-the-azure-portal).

## Update OT sensors

This section describes how to update Defender for IoT OT sensors using any of the supported methods.

**Sending or downloading an update package** and **running the update** are two separate steps. Each step can be done one right after the other or at different times.

For example, you might want to first send the update to your sensor or download an update package, and then have an administrator run the update later on, during a planned maintenance window.

If you're using an on-premises management console, make sure that you've [updated the on-premises management console](#update-the-on-premises-management-console) *before* updating any connected sensors.

On-premises management software is backwards compatible, and can connect to sensors with earlier versions installed, but not later versions. If you update your sensor software before updating your on-premises management console, the updated sensor will be disconnected from the on-premises management console.

Select the update method you want to use:

# [Azure portal (Public preview)](#tab/portal)

This procedure describes how to send a software version update to one or more OT sensors, and then run the updates remotely from the Azure portal. Bulk updates are supported for up to 10 sensors at a time.

> [!IMPORTANT]
> If you're using an on-premises management console, make sure that you've [updated the on-premises management console](#update-the-on-premises-management-console) *before* updating any connected sensors.
>

### Send the software update to your OT sensor

1. In [Defender for IoT](https://ms.portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started) in the Azure portal, select **Sites and sensors** and then locate the OT sensors with legacy, but [supported versions](#prerequisites) installed.

    If you know your site and sensor name, you can browse or search for it directly. Alternately, filter the sensors listed to show only cloud-connected, OT sensors that have *Remote updates supported*, and have legacy software version installed. For example:

    :::image type="content" source="media/update-ot-software/filter-remote-update.png" alt-text="Screenshot of how to filter for OT sensors that are ready for remote update." lightbox="media/update-ot-software/filter-remote-update.png":::

1. Select one or more sensors to update, and then select **Sensor update (Preview)** > **Remote update** > **Step one: Send package to sensor**.

    For an individual sensor, the **Step one: Send package to sensor** option is also available from the **...** options menu to the right of the sensor row. For example:

    :::image type="content" source="media/update-ot-software/remote-update-step-1.png" alt-text="Screenshot of the Send package option." lightbox="media/update-ot-software/remote-update-step-1.png":::

1. In the **Send package** pane that appears, check to make sure that you're sending the correct software to the sensor you want to update. To jump to the release notes for the new version, select **Learn more** at the top of the pane.

1. When you're ready, select **Send package**. The software transfer to your sensor machine is started, and you can see the progress in the **Sensor version** column.

    When the transfer is complete, the **Sensor version** column changes to :::image type="icon" source="media/update-ot-software/ready-to-update.png" border="false"::: **Ready to update**.

    Hover over the **Sensor version** value to see the source and target version for your update.

### Run your sensor update from the Azure portal

Run the sensor update only when you see the :::image type="icon" source="media/update-ot-software/ready-to-update.png" border="false"::: **Ready to update** icon in the **Sensor version** column.

1. Select one or more sensors to update, and then select **Sensor update (Preview)** > **Remote update** > **Step 2: Update sensor** from the toolbar.

    For an individual sensor, the **Step 2: Update sensor** option is also available from the **...** options menu. For example:

    :::image type="content" source="media/update-ot-software/remote-update-step-2.png" alt-text="Screenshot of the Update sensor option." lightbox="media/update-ot-software/remote-update-step-2.png":::

1. In the **Update sensor (Preview)** pane that appears, verify your update details.

    When you're ready, select **Update now** > **Confirm update**. In the grid, the **Sensor version** value changes to :::image type="icon" source="media/update-ot-software/installing.png" border="false"::: **Installing** until the update is complete, when the value switches to the new sensor version number instead.

If a sensor fails to update for any reason, the software reverts back to the previous version installed, and a sensor health alert is triggered. For more information, see [Understand sensor health](how-to-manage-sensors-on-the-cloud.md#understand-sensor-health) and [Sensor health message reference](sensor-health-messages.md).

# [OT sensor UI](#tab/sensor)

This procedure describes how to manually download the new sensor software version and then run your update directly on the sensor console's UI.

> [!IMPORTANT]
> If your OT sensor is connected to an on-premises management console, make sure to update the on-premises management console before updating any connected sensors.

### Download the update package from the Azure portal

1. In [Defender for IoT](https://ms.portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started) on the Azure portal, select **Sites and sensors** > **Sensor update (Preview)**.

1. In the **Local update** pane, select the software version that's currently installed on your sensors.

1. In the **Available versions** area of the **Local update** pane, select the version you want to download for your software update.

    The **Available versions** area lists all update packages available for your specific update scenario. You may have multiple options, but there will always be one specific version marked as **Recommended** for you. For example:

    :::image type="content" source="media/update-ot-software/recommended-version.png" alt-text="Screenshot highlighting the recommended update version for the selected update scenario." lightbox="media/update-ot-software/recommended-version.png":::

1. Scroll down further in the **Local update** pane and select **Download** to download the update package.

    The update package is downloaded with a file syntax name of `sensor-secured-patcher-<Version number>.tar`, where `version number` is the version you're updating to.

    [!INCLUDE [root-of-trust](includes/root-of-trust.md)]

### Update the OT sensor software from the sensor UI

1. Sign into your OT sensor and select **System Settings** > **Sensor management** > **Software Update**.

1. On the **Software Update** pane on the right, select **Upload file**, and then navigate to and select your downloaded update package.

    :::image type="content" source="media/update-ot-software/sensor-upload-file.png" alt-text="Screenshot of the Software update pane on the OT sensor." lightbox="media/update-ot-software/sensor-upload-file.png":::

    The update process starts, and may take about 30 minutes and include one or two reboots. If your machine reboots, make sure to sign in again as prompted.

# [On-premises management console](#tab/onprem)

This procedure describes how to update several OT sensors simultaneously from an on-premises management console.

> [!IMPORTANT]
> If you're updating multiple, locally-managed OT sensors, make sure to [update the on-premises management console](#update-an-on-premises-management-console) *before* you update any connected sensors.
>
>
The software version on your on-premises management console must be equal to that of your most up-to-date sensor version. Each on-premises management console version is backwards compatible to older, supported sensor versions, but can't connect to newer sensor versions.
>
### Download the update packages from the Azure portal

1. In [Defender for IoT](https://ms.portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started) on the Azure portal, select **Sites and sensors** > **Sensor update (Preview)**.

1. In the **Local update** pane, select the software version that's currently installed on your sensors.

1. Select the **Are you updating through a local manager** option, and then select the software version that's currently installed on your on-premises management console.

1. In the **Available versions** area of the **Local update** pane, select the version you want to download for your software update.

    The **Available versions** area lists all update packages available for your specific update scenario. You may have multiple options, but there will always be one specific version marked as **Recommended** for you. For example:

    :::image type="content" source="media/update-ot-software/recommended-version.png" alt-text="Screenshot highlighting the recommended update version for the selected update scenario." lightbox="media/update-ot-software/recommended-version.png":::

1. Scroll down further in the **Local update** pane and select **Download** to download the software file.

    If you'd selected the **Are you updating through a local manager** option, files will be listed for both the on-premises management console and the sensor. For example:

    :::image type="content" source="media/update-ot-software/download-update-package.png" alt-text="Screenshot of the Local update pane with two download files showing, for an on-premises management console and a sensor." lightbox="media/update-ot-software/download-update-package.png":::

    The update packages are downloaded with the following file syntax names:

    - `sensor-secured-patcher-<Version number>.tar` for the OT sensor update
    - `management-secured-patcher-<Version number>.tar` for the on-premises management console update

    Where `<version number>` is the software version number you're updating to.

[!INCLUDE [root-of-trust](includes/root-of-trust.md)]

### Update an on-premises management console

1. Sign into your on-premises management console and select **System Settings** > **Version Update**.

1. In the **Upload File** dialog, select **BROWSE FILE** and then browse to and select the update package you'd downloaded from the Azure portal.

    The update process starts, and may take about 30 minutes. During your upgrade, the system is rebooted twice.

    Sign in when prompted and check the version number listed in the bottom-left corner to confirm that the new version is listed.

### Update your OT sensors from the on-premises management console

1. Sign into your on-premises management console, select **System Settings**, and identify the sensors that you want to update.

1. For any sensors you want to update, make sure that the **Automatic Version Updates** option is selected.

    Also make sure that sensors you *don't* want to update are *not* selected.

    Save your changes when you're finished selecting sensors to update. For example:

   :::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/automatic-updates.png" alt-text="Screenshot of on-premises management console with Automatic Version Updates selected." lightbox="media/how-to-manage-sensors-from-the-on-premises-management-console/automatic-updates.png":::

    > [!IMPORTANT]
    > If your **Automatic Version Updates** option is red, you have an update conflict. An update conflict might occur if you have multiple sensors marked for automatic updates but the sensors currently have different software versions installed. Select the **Automatic Version Updates** option to resolve the conflict.
    >

1. Scroll down and on the right, select the **+** in the **Sensor version update** box. Browse to and select the update file you'd downloaded from the Azure portal.

    Updates start running on each sensor selected for automatic updates.

1. Go to the **Site Management** page to view the update status and progress for each sensor.

    If updates fail, a retry option appears with an option to download the failure log. Retry the update process or open a support ticket with the downloaded log files for assistance.

# [OT sensor CLI](#tab/cli)

This procedure describes how to update OT sensor software via the CLI, directly on the OT sensor.

> [!IMPORTANT]
> If you're using an on-premises management console, make sure that you've [updated the on-premises management console](#update-the-on-premises-management-console) *before* updating any connected sensors.
>

### Download the update package from the Azure portal

1. In [Defender for IoT](https://ms.portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started) on the Azure portal, select **Sites and sensors** > **Sensor update (Preview)**.

1. In the **Local update** pane, select the software version that's currently installed on your sensors.

1. In the **Available versions** area of the **Local update** pane, select the version you want to download for your software update.

    The **Available versions** area lists all update packages available for your specific update scenario. You may have multiple options, but there will always be one specific version marked as **Recommended** for you. For example:

    :::image type="content" source="media/update-ot-software/recommended-version.png" alt-text="Screenshot highlighting the recommended update version for the selected update scenario." lightbox="media/update-ot-software/recommended-version.png":::

1. Scroll down further in the **Local update** pane and select **Download** to download the software file.

    The update package is downloaded with a file syntax name of `sensor-secured-patcher-<Version number>.tar`, where `version number` is the version you're updating to.

[!INCLUDE [root-of-trust](includes/root-of-trust.md)]

### Update sensor software directly from the sensor via CLI

1. Use SFTP or SCP to copy the update package you'd downloaded from the Azure portal to the OT sensor machine.

1. Sign in to the sensor as the `cyberx_host` user and copy the update file to the `/opt/sensor/logs/` directory.

1. Sign in to the sensor as the `cyberx` user and copy the file to a location accessible for the update process. For example:

    ```bash
    cd /var/host-logs/ 
    mv <filename> /var/cyberx/media/device-info/update_agent.tar
    ```

1. Start running the software update. Run:

    ```bash
    curl -X POST http://127.0.0.1:9090/core/api/v1/configuration/agent
    ```

1. Verify that the update process has started by checking the `upgrade.log` file. Run:

    ```bash
    tail -f /var/cyberx/logs/upgrade.log
    ```

    Output similar to the following appears:

    ```bash
    2022-05-23 15:39:00,632 [http-nio-0.0.0.0-9090-exec-2] INFO  com.cyberx.infrastructure.common.utils.UpgradeUtils- [32200] Extracting upgrade package from /var/cyberx/media/device-info/update_agent.tar to /var/cyberx/media/device-info/update

    2022-05-23 15:39:33,180 [http-nio-0.0.0.0-9090-exec-2] INFO  com.cyberx.infrastructure.common.utils.UpgradeUtils- [32200] Prepared upgrade, scheduling in 30 seconds

    2022-05-23 15:40:03,181 [pool-34-thread-1] INFO  com.cyberx.infrastructure.common.utils.UpgradeUtils- [32200] Send upgrade request to os-manager. file location: /var/cyberx/media/device-info/update
    ```

    At some point during the update process, your SSH connection will disconnect. This is a good indication that your update is running.

1. Continue to monitor the update process by checking the `install.log` file.

    Sign into the sensor as the `cyberx_host` user and run:

    ```bash
    tail -f /opt/sensor/logs/install.log
    ```

---

### Confirm that your update succeeded

To confirm that the update process completed successfully, check the sensor version in the following locations for the new version number:

- In the Azure portal, on the **Sites and sensors** page, in the **Sensor version** column

- On the OT sensor console:

    - In the title bar
    - On the **Overview** page > **General Settings** area
    - In the **System settings** > **Sensor management** > **Software update** pane

- On a connected on-premises management console, on the **Site Management** page

Upgrade log files are located on the OT sensor machine at `/opt/sensor/logs/legacy-upgrade.log`, and are accessible to the *[cyberx_host](roles-on-premises.md#default-privileged-on-premises-users)* user via SSH.

## Update the on-premises management console

This procedure describes how to update on-premises management console software. You might need these steps before [updating OT sensors remotely from the Azure portal](#update-ot-sensors) or as a standalone update process.

Updating an on-premises management console takes about 30 minutes.

> [!IMPORTANT]
> If you're updating the on-premises management console as part of an OT sensor process, you must update your on-premises management console *before* updating your OT sensors.
>
> The software version on your on-premises management console must be equal to or greater than that of your most up-to-date sensor version. Each on-premises management console version is backwards compatible to older, supported sensor versions, but cannot connect to newer sensor versions.
>

### Download the update package from the Azure portal

This procedure describes how to download an update package for a standalone update. If you're updating your on-premises management console together with connected sensors, we recommend using the **[Update sensors (Preview)](#update-ot-sensors)** menu from on the **Sites and sensors** page instead.

1. In [Defender for IoT](https://ms.portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started) on the Azure portal, select **Getting started** > **On-premises management console**.

1. In the **On-premises management console** area, select the download scenario that best describes your update, and then select **Download**.

    The update package is downloaded with a file syntax name of `management-secured-patcher-<version number>.tar`, where `<version number>` is the software version number you're updating to.

[!INCLUDE [root-of-trust](includes/root-of-trust.md)]

### Update the on-premises management console software version

1. Sign into your on-premises management console and select **System Settings** > **Version Update**.

1. In the **Upload File** dialog, select **BROWSE FILE** and then browse to and select the update file you'd downloaded from the Azure portal.

    The update process starts, and may take about 30 minutes. During your upgrade, the system is rebooted twice.

1. Sign in when prompted and check the version number listed in the bottom-left corner to confirm that the new version is listed.

## Next steps

For more information, see:

- [Manage sensors with Defender for IoT in the Azure portal](how-to-manage-sensors-on-the-cloud.md)
- [Manage individual OT sensors](how-to-manage-individual-sensors.md)
- [Manage the on-premises management console](how-to-manage-the-on-premises-management-console.md)
- [Troubleshoot the sensor](how-to-troubleshoot-sensor.md)
- [Troubleshoot the on-premises management console](how-to-troubleshoot-on-premises-management-console.md)
