---
title: Maintain threat intelligence packages on OT network sensors - Microsoft Defender for IoT
description: Learn how to maintain threat intelligence packages on OT network sensors.
ms.date: 02/09/2023
ms.topic: how-to
---


# Maintain threat intelligence packages on OT network sensors

Microsoft security teams continually run proprietary ICS threat intelligence and vulnerability research. Security research provides security detection, analytics, and response to Microsoft's cloud infrastructure and services, traditional products and devices, and internal corporate resources.

Microsoft Defender for IoT regularly delivers threat intelligence package updates for OT network sensors, providing increased protection from known and relevant threats and insights that can help your teams triage and prioritize alerts.

Threat intelligence packages contain signatures, such as malware signatures, CVEs, and other security content.

> [!TIP]
> We recommend ensuring that your OT network sensors always have the latest threat intelligence package installed so that you always have the full context of a threat before an environment is affected, and increased relevancy, accuracy, and actionable recommendations.
>
> Announcements about new packages are available from our [TechCommunity blog](https://techcommunity.microsoft.com/t5/azure-defender-for-iot/bd-p/AzureDefenderIoT).

## Permissions

To perform the procedures in this article, make sure that you have:

- One or more OT sensors [onboarded](onboard-sensors.md) to Azure.

- Relevant permissions on the Azure portal and any OT network sensors or on-premises management console you want to update.

  - **To download threat intelligence packages from the Azure portal**, you need access to the Azure portal as a [Security Reader](../../role-based-access-control/built-in-roles.md#security-reader), [Security Admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../role-based-access-control/built-in-roles.md#owner) role.

  - **To push threat intelligence updates to cloud-connected OT sensors from the Azure portal**, you need access to the Azure portal as a [Security Admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../role-based-access-control/built-in-roles.md#owner) role.

  - **To manually upload threat intelligence packages to OT sensors or on-premises management consoles**, you need access to the OT sensor or on-premises management console as an **Admin** user.

For more information, see [Azure user roles and permissions for Defender for IoT](roles-azure.md) and [On-premises users and roles for OT monitoring with Defender for IoT](roles-on-premises.md).

## View the most recent threat intelligence package

**To view the most recent package available from Defender for IoT**: 

In the Azure portal, select **Sites and sensors** > **Threat intelligence update (Preview)** > **Local update**. Details about the most recent package available are shown in the **Sensor TI update** pane. For example:

:::image type="content" source="media/how-to-work-with-threat-intelligence-packages/ti-local-update.png" alt-text="Screenshot of the Sensor TI update pane with the most recent threat intelligence package." lightbox="media/how-to-work-with-threat-intelligence-packages/ti-local-update.png":::

## Update threat intelligence packages

Update threat intelligence packages on your OT sensors using any of the following methods:

- [Have updates pushed](#automatically-push-updates-to-cloud-connected-sensors) to cloud-connected OT sensors automatically as they're released.
- [Manually push](#manually-push-updates-to-cloud-connected-sensors) updates to cloud-connected OT sensors.
- [Download an update package](#manually-update-locally-managed-sensors) and manually upload it to your OT sensor. Alternately, upload the package to an on-premises management console and push the updates from there to any connected OT sensors.

### Automatically push updates to cloud-connected sensors

Threat intelligence packages can be automatically updated to cloud-connected sensors as they're released by Defender for IoT.

Ensure automatic package update by onboarding your cloud-connected sensor with the **Automatic Threat Intelligence Updates** option enabled. For more information, see [Onboard a sensor](tutorial-onboarding.md#onboard-and-activate-the-virtual-sensor).

**To change the update mode after you've onboarded your OT sensor**:

1. In [Defender for IoT](https://ms.portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started) on the Azure portal, select **Sites and sensors**, and then locate the sensor you want to change.
1. Select the options (**...**) menu for the selected OT sensor > **Edit**.
1. Toggle on or toggle off the **Automatic Threat Intelligence Updates** option as needed.

### Manually push updates to cloud-connected sensors

Your cloud-connected sensors can be automatically updated with threat intelligence packages. However, if you would like to take a more conservative approach, you can push packages from Defender for IoT to sensors only when you feel it's required. Pushing updates manually gives you the ability to control when a package is installed, without the need to download and then upload it to your sensors.

**To manually push updates to a single OT sensor**:

1. In [Defender for IoT](https://ms.portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started) on the Azure portal, select **Sites and sensors**, and locate the OT sensor you want to update.
1. Select the options (**...**) menu for the selected sensor and then select **Push Threat Intelligence update**.

The **Threat Intelligence update status** field displays the update progress.

**To manually push updates to multiple OT sensors**:

1. In [Defender for IoT](https://ms.portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started) on the Azure portal, select **Sites and sensors**. Locate and select the OT sensors you want to update.
1. Select **Threat intelligence updates (Preview)** > **Remote update**.

The **Threat Intelligence update status** field displays the update progress for each selected sensor.

### Manually update locally managed sensors

If you're working with locally managed OT sensors, you need to download the updated threat intelligence packages and upload them manually on your sensors.

If you're also working with an on-premises management console, we recommend that you upload the threat intelligence package to the on-premises management console and push the update from there.

> [!TIP]
> This option can also be used for cloud-connected sensors if you don't want to push the updates from the Azure portal.
>

**To download threat intelligence packages**:

1. In [Defender for IoT](https://ms.portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started) on the Azure portal, select **Sites and sensors** > **Threat intelligence update (Preview)** > **Local update**.

1. In the **Sensor TI update** pane, select **Download** to download the latest threat intelligence file.

[!INCLUDE [root-of-trust](includes/root-of-trust.md)]

**To update a single sensor:**

1. Sign into your OT sensor and then select **System settings** > **Threat intelligence**.

1. In the **Threat intelligence** pane, select **Upload file**. For example:

    :::image type="content" source="media/how-to-work-with-threat-intelligence-packages/update-threat-intelligence-single-sensor.png" alt-text="Screenshot of where you can upload Threat Intelligence package to a single sensor." lightbox="media/how-to-work-with-threat-intelligence-packages/update-threat-intelligence-single-sensor.png":::

1. Browse to and select the package you'd downloaded from the Azure portal and upload it to the sensor.

**To update multiple sensors simultaneously:**

1. Sign in to your on-premises management console and select **System settings**.

1. In the **Sensor Engine Configuration** area, select the sensors that you want to receive the updated packages. For example:

    :::image type="content" source="media/how-to-work-with-threat-intelligence-packages/update-threat-intelligence-multiple-sensors.png" alt-text="Screenshot of where you can select which sensors you want to make changes to." lightbox="media/how-to-work-with-threat-intelligence-packages/update-threat-intelligence-multiple-sensors.png":::

1. In the **Sensor Threat Intelligence Data** section, select the plus sign (**+**).

1. In the **Upload File** dialog, select **BROWSE FILE...** to browse to and select the update package. For example:

    :::image type="content" source="media/how-to-work-with-threat-intelligence-packages/upload-threat-intelligence-to-management-console.png" alt-text="Screenshot of where you can upload a Threat Intelligence package to multiple sensors." lightbox="media/how-to-work-with-threat-intelligence-packages/upload-threat-intelligence-to-management-console.png":::

1. Select **CLOSE** and then **SAVE CHANGES** to push the threat intelligence update to all selected sensors.

    :::image type="content" source="media/how-to-work-with-threat-intelligence-packages/save-changes-management-console.png" alt-text="Screenshot of where you can save changes made to selected sensors on the management console." lightbox="media/how-to-work-with-threat-intelligence-packages/save-changes-management-console.png":::

## Review threat intelligence update statuses

On each OT sensor, the threat intelligence update status and version information are shown in the sensor's **System settings > Threat intelligence** settings.

For cloud-connected OT sensors, threat intelligence data is also shown in the **Sites and sensors** page. To view threat intelligence statues from the Azure portal:

1. In [Defender for IoT](https://ms.portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started) on the Azure portal, select **Site and sensors**.

1. Locate the OT sensors where you want to check the threat intelligence statues.

1. Note the values of the following columns for your OT sensors:

    |Column name  |Description  |
    |---------|---------|
    |**Threat Intelligence version**     |    Version naming is based on the day the package was built by Defender for IoT.     |
    |**Threat Intelligence mode**     |  *Automatic* indicates that newly available  packages will be automatically installed on sensors as they're released by Defender for IoT. <br><br>*Manual* indicates that you can push newly available packages directly to sensors as needed.       |
    |**Threat Intelligence update status**     | Shows one of the following statuses: <br>    - **Failed**<br>    - **In Progress**<br>    - **Update Available**<br>    - **Ok** |

> [!TIP]
> If a cloud-connected OT sensor shows that a threat intelligence update has failed, we recommend that your check your sensor connection details. On the **Sites and sensors** page, check the **Sensor status** and **Last connected UTC** columns.

## Next steps

For more information, see:

- [Onboard a sensor](tutorial-onboarding.md#onboard-and-activate-the-virtual-sensor)

- [Manage sensors from the management console](how-to-manage-sensors-from-the-on-premises-management-console.md)
