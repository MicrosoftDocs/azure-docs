---
title: Update Defender for IoT OT monitoring software versions
description: Learn how to update (upgrade) Defender for IoT software on OT sensors and legacy on-premises management servers.
ms.date: 12/17/2023
ms.topic: upgrade-and-migration-article
---

# Update Defender for IoT OT monitoring software

This article describes how to update Defender for IoT software versions on OT sensor and legacy on-premises management console appliances.

You can purchase pre-configured appliances for your sensors and legacy on-premises management consoles, or install software on your own hardware machines. In either case, you'll need to update software versions to use new features for OT sensors and on-premises management consoles.

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
    |**Locally managed sensors**     |  Locally managed sensors can be updated using a downloaded update package, either via a connected on-premises management console, or directly on an OT sensor console. |

- **Required access permissions**:

    - **To download update packages or push updates from the Azure portal**, you need access to the Azure portal as a [Security Admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../role-based-access-control/built-in-roles.md#owner) user.

    - **To run updates on an OT sensor or on-premises management console**, you need access as an **Admin** user.

    - **To update an OT sensor via CLI**, you need access to the sensor as a [privileged user](roles-on-premises.md#default-privileged-on-premises-users).

    For more information, see [Azure user roles and permissions for Defender for IoT](roles-azure.md) and [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

> [!IMPORTANT]
> We recommend verifying that you have sensor backups running regularly, and especially before updating sensor software.
>
> For more information, see [Back up and restore OT network sensors from the sensor console](back-up-restore-sensor.md).

## Verify network requirements

- Make sure that your sensors can reach the Azure data center address ranges and set up any extra resources required for the connectivity method your organization is using.

    For more information, see [OT sensor cloud connection methods](architecture-connections.md) and [Connect your OT sensors to the cloud](connect-sensors.md).

- Make sure that your firewall rules are configured as needed for the new version you're updating to.

    For example, the new version might require a new or modified firewall rule to support sensor access to the Azure portal. From the **Sites and sensors** page, select **More actions > Download sensor endpoint details** for the full list of endpoints required to access the Azure portal.

    For more information, see [Networking requirements](networking-requirements.md) and [Sensor management options from the Azure portal](how-to-manage-sensors-on-the-cloud.md#sensor-management-options-from-the-azure-portal).

## Update OT sensors

This section describes how to update Defender for IoT OT sensors using any of the supported methods.

**Sending or downloading an update package** and **running the update** are two separate steps. Each step can be done one right after the other or at different times.

For example, you might want to first send the update to your sensor or download an update package, and then have an administrator run the update later on, during a planned maintenance window.

If you're using a legacy on-premises management console, make sure that you [update the on-premises management console](#update-the-on-premises-management-console) *before* updating any connected sensors.

On-premises management software is backwards compatible, and can connect to sensors with earlier versions installed, but not later versions. If you update your sensor software before updating your on-premises management console, the updated sensor will be disconnected from the on-premises management console.

Select the update method you want to use:

## [Azure portal (Preview)](#tab/portal)

This procedure describes how to send a software version update to OT sensors at one or more sites, and run the updates remotely using the Azure portal. We recommend that you update the sensor by selecting sites and not individual sensors.

### Send the software update to your OT sensor

1. In [Defender for IoT](https://portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started) in the Azure portal, select **Sites and sensors**.

    If you know your site and sensor name, you can browse or search for it directly, or apply a filter to help locate the site you need.

1. Select one or more sites to update, and then select **Sensor update** > **Remote update** > **Step one: Send package to sensor**.
    :::image type="content" source="media/update-ot-software/sensor-updates-1.png" alt-text="Screenshot of the Send package option." lightbox="media/update-ot-software/sensor-updates-1.png":::

    For one or more individual sensors, select **Step one: Send package to sensor**. This option is also available from the **...** options menu to the right of the sensor row.

1. In the **Send package** pane that appears, under **Available versions**, select the software version from the list. If the version you need doesn't appear, select **Show more** to list all available versions.

    To jump to the release notes for the new version, select **Learn more** at the top of the pane.

    The lower half of the page shows the sensors you selected and their status. Verify the status of the sensors. A sensor might not be available for update for various reasons, for example, the sensor is already updated to the version you want to send, or there's a problem with the sensor, such as it's disconnected.

    :::image type="content" source="media/update-ot-software/send-package-pane-400.png" alt-text="Screenshot of sensor update pane with option to choose sensor update version." lightbox="media/update-ot-software/send-package-pane.png" border="true":::

1. Once you've checked the list of sensors to be updated, select **Send package**, and the software transfer to your sensor machine is started. You can see the transfer progress in the **Sensor version** column, with the percentage completed automatically updating in the progress bar, so you can see that the process has started and letting you track its progress until the transfer is complete. For example:

    :::image type="content" source="media/update-ot-software/sensor-version-update-bar.png" alt-text="Screenshot of the update bar in the Sensor version column." lightbox="media/update-ot-software/sensor-version-update-bar.png":::

    When the transfer is complete, the **Sensor version** column changes to :::image type="icon" source="media/update-ot-software/ready-to-update.png" border="true" ::: **Ready to update**.

    Hover over the **Sensor version** value to see the source and target version for your update.

### Install your sensor from the Azure portal

To install the sensor software update, ensure that you see the :::image type="icon" source="media/update-ot-software/ready-to-update.png" border="false"::: **Ready to update** icon in the **Sensor version** column.

1. Select one or more sites to update, and then select **Sensor update** > **Remote update** > **Step 2: Update sensor** from the toolbar. The **Update sensor** pane opens in the right side of the screen.

    :::image type="content" source="media/update-ot-software/sensor-updates-2.png" alt-text="Screenshot of the package update option." lightbox="media/update-ot-software/sensor-updates-2.png":::

    For an individual sensor, the **Step 2: Update sensor** option is also available from the **...** options menu.

1. In the **Update sensor** pane that appears, verify your update details.

    When you're ready, select **Update now** > **Confirm update** to install the update on the sensor. In the grid, the **Sensor version** value changes to :::image type="icon" source="media/update-ot-software/installing.png" border="false"::: **Installing**, and an update progress bar appears showing you the percentage complete. The bar automatically updates, so that you can track the progress until the installation is complete.

    :::image type="content" source="media/update-ot-software/sensor-version-install-bar.png" alt-text="Screenshot of the install bar in the Sensor version column." lightbox="media/update-ot-software/sensor-version-install-bar.png":::

    When completed, the sensor value switches to the newly installed sensor version number.

If a sensor update fails to install for any reason, the software reverts back to the previous version installed, and a sensor health alert is triggered. For more information, see [Understand sensor health](how-to-manage-sensors-on-the-cloud.md#understand-sensor-health) and [Sensor health message reference](sensor-health-messages.md).

## [OT sensor UI](#tab/sensor)

This procedure describes how to manually download the new sensor software version and then run your update directly on the sensor console's UI.

### Download the update package from the Azure portal

1. In [Defender for IoT](https://portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started) on the Azure portal, select **Sites and sensors** > **Sensor update (Preview)**.

1. In the **Local update** pane, select the software version that's currently installed on your sensors.

1. In the **Available versions** area of the **Local update** pane, select the version you want to download for your software update.

    The **Available versions** area lists all update packages available for your specific update scenario. You might have multiple options, but one specific version is marked as **Recommended** for you. For example:

    :::image type="content" source="media/update-ot-software/recommended-version.png" alt-text="Screenshot highlighting the recommended update version for the selected update scenario." lightbox="media/update-ot-software/recommended-version.png":::

1. Scroll down further in the **Local update** pane and select **Download** to download the update package.

    The update package is downloaded with a file syntax name of `sensor-secured-patcher-<Version number>.tar`, where `version number` is the version you're updating to.

    [!INCLUDE [root-of-trust](includes/root-of-trust.md)]

### Update the OT sensor software from the sensor UI

1. Sign into your OT sensor and select **System Settings** > **Sensor management** > **Software Update**.

1. On the **Software Update** pane on the right, select **Upload file**, and then navigate to and select your downloaded update package.

    :::image type="content" source="media/update-ot-software/sensor-upload-file.png" alt-text="Screenshot of the Software update pane on the OT sensor." lightbox="media/update-ot-software/sensor-upload-file.png":::

    The update process starts, and might take about 30 minutes and include one or two reboots. If your machine reboots, make sure to sign in again as prompted.

## [OT sensor CLI](#tab/cli)

This procedure describes how to update OT sensor software via the CLI, directly on the OT sensor.

> [!IMPORTANT]
> If you're using an on-premises management console, make sure that you've [updated the on-premises management console](#update-the-on-premises-management-console) *before* updating any connected sensors.
>

### Download the update package from the Azure portal

1. In [Defender for IoT](https://portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started) on the Azure portal, select **Sites and sensors** > **Sensor update (Preview)**.

1. In the **Local update** pane, select the software version that's currently installed on your sensors.

1. In the **Available versions** area of the **Local update** pane, select the version you want to download for your software update.

    The **Available versions** area lists all update packages available for your specific update scenario. You may have multiple options, but there will always be one specific version marked as **Recommended** for you. For example:

    :::image type="content" source="media/update-ot-software/recommended-version.png" alt-text="Screenshot highlighting the recommended update version for the selected update scenario." lightbox="media/update-ot-software/recommended-version.png":::

1. Scroll down further in the **Local update** pane and select **Download** to download the software file.

    The update package is downloaded with a file syntax name of `sensor-secured-patcher-<Version number>.tar`, where `version number` is the version you're updating to.

[!INCLUDE [root-of-trust](includes/root-of-trust.md)]

### Update sensor software directly from the sensor via CLI

1. Use SFTP or SCP to copy the update package you'd downloaded from the Azure portal to the OT sensor machine.

1. Sign in to the sensor as the `support` user, access the system shell and copy the update file to a location accessible for the update process. For example:

    ```bash
    cd /var/host-logs/ 
    mv <filename> /var/cyberx/media/device-info/update_agent.tar
    ```

1. Start running the software update. Run:

    ```bash
    curl -H "X-Auth-Token: $(python3 -c 'from cyberx.credentials.credentials_wrapper import CredentialsWrapper;creds_wrapper = CredentialsWrapper();print(creds_wrapper.get("api.token"))')" -X POST http://127.0.0.1:9090/core/api/v1/configuration/agent
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

1. In [Defender for IoT](https://portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started) on the Azure portal, select **Getting started** > **On-premises management console**.

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
- [Manage the on-premises management console](legacy-central-management/how-to-manage-the-on-premises-management-console.md)
- [Troubleshoot the sensor](how-to-troubleshoot-sensor.md)
- [Troubleshoot the on-premises management console](legacy-central-management/how-to-troubleshoot-on-premises-management-console.md)
