---
title: Update OT system software
description: Learn how to update (upgrade) Defender for IoT software on OT sensors and on-premises management servers.
ms.date: 05/02/2022
ms.topic: how-to
---

# Update OT system software

This article describes how to update Defender for IoT software versions on OT sensor and on-premises management console appliances.

You can purchase preconfigured appliances for your sensors and on-premises management consoles, or install software on your own hardware machines. In either case, you'll need to update software versions to leverage new features for OT sensors and on-premises management consoles.

For more information, see [Which appliances do I need?](ot-appliance-sizing.md), [Pre-configured physical appliances for OT monitoring](ot-pre-configured-appliances.md), and [What's new in Microsoft Defender for IoT?](release-notes.md).

> [!NOTE]
> Updates from legacy versions may require a series of software updates. For example, if you still have a sensor version 3.1.1 installed, you'll need to first upgrade to version 10.5.5, and then to a 22.x version.
>

## Verify firewall rules

Make sure that your firewall rules are configured as needed for the new version you're updating to. For example, the new version may require a new or modified firewall rule to support [sensor access to the Azure portal](how-to-set-up-your-network.md#sensor-access-to-azure-portal).

For more information, see [Networking requirements](how-to-set-up-your-network.md#networking-requirements).


## Update an on-premises management console

<!-- what are the procedures that are still unique to the management console? aside from security/airgapped reasons, when does a customer *need* an on-prem mc?-->

This procedure describes how to update Defender for IoT software on an on-premises management console, and is only relevant if your organization is using an on-premises management console to manage multiple sensors simultaneously. In such cases, make sure to update your on-premises management consoles before you update software on your sensors.

This process takes about 30 minutes.

**To update on-premises management console software**:

1. In the Azure portal, go to Defender for IoT > Updates
1. Go to the [Azure portal](https://portal.azure.com/).

1. Go to Defender for IoT.

1. Go to the **Updates** page.

1. Select a version from the on-premises management console section.

1. Select **Download** and save the file.

1. Log into on-premises management console and select **System Settings** from the side menu.

1. On the **Version Update** pane, select **Update**.

1. Select the file that you downloaded from the Defender for IoT **Updates** page.


## Prepare for upgrade from the Azure portal

D.	New row created for the sensor, Download activation file 


Version [22.1.x ](release-notes.md#update-to-version-221x) is a large upgrade with more complicated background processes. You should expect this upgrade to take more time than earlier upgrades have required.


1. In Defender for IoT, select **Sites and sensors** on the left.

1. Select the site where you want to update your sensor, and then navigate to the sensor you want to update.

1. Expand the row for your sensor, select the options **...** menu on the right of the row, and then select **Prepare to update to 22.x**.

    :::image type="content" source="media/how-to-manage-sensors-on-the-cloud/prepare-to-update.png" alt-text="Screenshot of the Prepare to update option." lightbox="media/how-to-manage-sensors-on-the-cloud/prepare-to-update.png":::

1. In the **Prepare to update sensor to version 22.X** message, select **Let's go**.

1. When the new activation file is ready, download it and verify that the sensor status has switched to **Pending activation**.

## Update your sensors

### Manually


1. In the Azure portal, go to **Defender for IoT** > **Getting started** > **Updates**.

1. From the **Sensors** section, select **Download** for the sensor update, and save your `<legacy/upstream>-sensor-secured-patcher-<version number>.tar` file locally. For example:

   :::image type="content" source="media/how-to-manage-individual-sensors/updates-page.png" alt-text="Screenshot of the Updates page of Defender for IoT.":::

1. On your sensor console, select **System Settings** > **Sensor management** > **Software Update**.

1. On the **Software Update** pane on the right, select **Upload file**, and then navigate to and select your downloaded `legacy-sensor-secured-patcher-<Version number>.tar` file.

    :::image type="content" source="media/how-to-manage-individual-sensors/upgrade-pane-v2.png" alt-text="Screenshot of the update pane.":::

    The update process starts, and may take about 30 minutes. During your upgrade, the system is rebooted twice.

    Sign in when prompted, and then return to the **System Settings** > **Sensor management** > **Software Update** pane to confirm that the new version is listed.

    :::image type="content" source="media/how-to-manage-individual-sensors/defender-for-iot-version.png" alt-text="Screenshot of the upgrade version that appears after you sign in.":::


### From the management console

You can update several sensors simultaneously from the on-premises management console.

If you're upgrading an on-premises management console and managed sensors, first update the management console, and then update the sensors. The sensor update process won't succeed if you don't update the on-premises management console first.

**To update several sensors**:

1. Verify that you've already updated the on-premises management console to the version that you're updating the sensors. For more information, see [Update the software version](how-to-manage-the-on-premises-management-console.md#update-the-software-version).

1. On the Azure portal, go to **Defender for IoT** > **Updates**. Under **Sensors**, select **Download** and save the file.

   :::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/update-screen.png" alt-text="Screenshot of the Updates page.":::

1. Sign in to the on-premises management console, and select **System Settings**.

1. Under **Sensor Engine Configuration**, select any sensor you want to update, and then select **Automatic Version Updates** > **Save Changes**. For example:

   :::image type="content" source="media/how-to-manage-sensors-from-the-on-premises-management-console/automatic-updates.png" alt-text="Screenshot of on-premises management console with Automatic Version Updates selected." lightbox="media/how-to-manage-sensors-from-the-on-premises-management-console/automatic-updates.png":::

1. On the right, select **Version** update, and then browse to and select the update file you'd downloaded from the Azure portal.

Monitor the update status of each sensor connected to your on-premises management console in the **Site Management** page. For any update that failed, reattempt the update or open a support ticket for assistance.

FROM ADI

1.	There seems to be a bug that causes the old sensor record not to be deleted from azure when new site and sensor are created. so user needs to delete it manually (step G) .Ral Rubin is checking. Since no documentation it wasn’t clear if bug or missing documentation.
2.	The docs are not clear well when it comes to: upgrade sensors from on premise manager. 
The GUI expiriance of selecting which sensors to upgrade is not clear to users and we need the docs to cover for it ( Or @Ariel Saghiv will consider to improve this upgrade user experience via CM). 
In the docs, to my view:  Its important to explain , that before saving changes and uploading the upgrade file, user need to make sure to remove automatic updates for sensors not planned for upgrade. Current experience is confusing and causes users to upgrade all sensors while they plan to upgrade in bulks. That happens because they understand that only the selected sensor is upgraded. But in fact all are according to the automatic updates flag. 

I documented the long process, and I suggest adding these details (after @Batami Gold edit it) in our docs site: Upgrade sensors via on premise manager  if not clear I can explain over a quick call

https://microsofteur-my.sharepoint.com/:w:/g/personal/adiw_microsoft_com/ERI9TLBrO-VJr6ur6fyA1CUBQS45gukYAyw2ER882N7FGA?e=HHb0Ug&CID=0B0AD019-09F8-444C-8D19-FF87727ACF68

Via system settings Select 1 or more sensors for automatic updates, save changes. make sure that automatic updates are marked only for the sensors you wish to upgrade  

First sensor "automatic version updates" are on  

 

Second sensor "automatic version updates" are off: 

 

  

Save changes , upload sensor upgrade file  

 

  

Verify and monitor upgrade progress via Site management - Only the selected sensor is upgraded  

 

  

  

Troubleshooting Note! Conflict is marked red in case user choose 2 sensors with 2 different automatic update / learning statuses. To align all to same status click the conflict to resolve it .     



## Reactivate your sensor

**Relevant only when updating from a legacy version to version 22.x or higher**

If you're upgrading from a legacy version to version 22.x or higher, make sure to reactivate your sensor using the activation file you downloaded earlier.

1. On your sensor, select **System settings > Sensor management > Subscription & Mode Activation**.

1. In the **Subscription & Mode Activation** pane that appears on the right, select **Select file**, and then browse to and select your new activation file.

1. In Defender for IoT on the Azure portal, monitor your sensor's activation status. When the sensor is fully activated:

    - The sensor's **Overview** page shows an activation status of **Valid**.
    - In the Azure portal, on the **Sites and sensors** page, the sensor is listed as **OT cloud connected** and with the updated sensor version.

Your legacy sensors will continue to appear in the **Sites and sensors** page until you delete them. For more information, see [Manage on-boarded sensors](how-to-manage-sensors-on-the-cloud.md#manage-on-boarded-sensors).

> [!NOTE]
> After upgrading to version 22.1.x, the new upgrade log can be found at the following path, accessed via SSH and the *cyberx_host* user: `/opt/sensor/logs/legacy-upgrade.log`.
>

## Remove your previous sensor

## Next steps

For more information, see:





## Update a standalone sensor version


### Download a new activation file for version 22.1.x or higher


### Update your sensor software version
