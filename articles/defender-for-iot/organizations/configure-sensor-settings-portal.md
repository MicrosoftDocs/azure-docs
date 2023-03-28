---
title: Configure OT sensor settings from the Azure portal - Microsoft Defender for IoT
description: Learn how to configure settings for OT network sensors from Microsoft Defender for IoT on the Azure portal.
ms.date: 12/27/2022
ms.topic: how-to
---

# Configure OT sensor settings from the Azure portal (Public preview)

After [onboarding](onboard-sensors.md) a new OT network sensor to Microsoft Defender for IoT, you may want to define several settings directly on the OT sensor console, such as [adding local users](manage-users-sensor.md) or [connecting to an on-premises management console](ot-deploy/connect-sensors-to-management.md).

Selected OT sensor settings, listed below, are also available directly from the Azure portal, and can be applied in bulk across multiple cloud-connected OT sensors at a time, or across all OT sensors in a specific site or zone. This article describes how to view and configure view OT network sensor settings from the Azure portal.

> [!NOTE]
> The **Sensor settings** page in Defender for IoT is in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include other legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Prerequisites

To define OT sensor settings, make sure that you have the following:

- **An Azure subscription onboarded to Defender for IoT**. If you need to, [sign up for a free account](https://azure.microsoft.com/free/), and then use the [Quickstart: Get started with Defender for IoT](getting-started.md) to onboard.

- **Permissions**:

    - To view settings that others have defined, sign in with a [Security Reader](../../role-based-access-control/built-in-roles.md#security-reader), [Security admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../role-based-access-control/built-in-roles.md#owner) role for the subscription.

    - To define or update settings, sign in with [Security admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../role-based-access-control/built-in-roles.md#owner) role.

    For more information, see [Azure user roles and permissions for Defender for IoT](roles-azure.md).

- **One or more cloud-connected OT network sensors**. For more information, see [Onboard OT sensors to Defender for IoT](onboard-sensors.md).

## Define a new sensor setting

Define a new setting whenever you want to define a specific configuration for one or more OT network sensors. For example, you might want to define bandwidth caps for all OT sensors in a specific site or zone, or for a single OT sensor at a specific location in your network.

**To define a new setting**:

1. In [Defender for IoT](https://ms.portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started) on the Azure portal, select **Sites and sensors** > **Sensor settings (Preview)**.

1. On the **Sensor settings (Preview)** page, select **+ Add**, and then use the wizard to define the following values for your setting. Select **Next** when you're done with each tab in the wizard to move to the next step.

    |Tab name  |Description  |
    |---------|---------|
    |**Basics**     | Select the subscription where you want to apply your setting, and your [setting type](#sensor-setting-reference). <br><br>Enter a meaningful name and an optional description for your setting.        |
    |**Setting**     |    Define the values for your selected setting type.<br>For details about the options available for each setting type, find your selected setting type in the [Sensor setting reference](#sensor-setting-reference) below.     |
    |**Apply**     | Use the **Select sites**, **Select zones**, and **Select sensors** dropdown menus to define where you want to apply your setting.   <br><br>**Important**:  Selecting a site or zone applies the setting to all connected OT sensors, including any OT sensors added to the site or zone later on. <br>If you select to apply your settings to an entire site, you don't also need to select its zones or sensors. |
    |**Review and create**     | Check the selections you've made for your setting. <br><br>If your new setting replaces an existing setting, a :::image type="icon" source="media/how-to-manage-individual-sensors/warning-icon.png" border="false"::: warning is shown to indicate the existing setting.<br><br>When you're satisfied with the setting's configuration, select **Create**.     |

Your new setting is now listed on the **Sensor settings (Preview)** page under its setting type, and on the sensor details page for any related OT sensor. Sensor settings are shown as read-only on the sensor details page. For example:

:::image type="content" source="media/configure-sensor-settings-portal/sensor-details-setting.png" alt-text="Screenshot of a sensor details page showing a setting applied.":::

> [!TIP]
> You may want to configure exceptions to your settings for a specific OT sensor or zone. In such cases, create an extra setting for the exception. 
> 
> Settings override each other in a hierarchical manner, so that if your setting is applied to a specific OT sensor, it overrides any related settings that are applied to the entire zone or site. To create an exception for an entire zone, add a setting for that zone to override any related settings applied to the entire site.
>

## View and edit current OT sensor settings

**To view the current settings already defined for your subscription**:

1. In [Defender for IoT](https://ms.portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started) on the Azure portal, select **Sites and sensors** > **Sensor settings (Preview)**

    The **Sensor settings (Preview)** page shows any settings already defined for your subscriptions, listed by setting type. Expand or collapse each type to view detailed configurations. For example:

    :::image type="content" source="media/configure-sensor-settings-portal/view-settings.png" alt-text="Screenshot of OT sensor settings on the Azure portal.":::

1. Select a specific setting to view its exact configuration and the site, zones, or individual sensors where the setting is applied.

1. To edit the setting's configuration, select **Edit** and then use the same wizard you used to create the setting to make the updates you need. When you're done, select **Apply** to save your changes.

### Delete an existing OT sensor setting

To delete an OT sensor setting altogether:

1. On the **Sensor settings (Preview)** page, locate the setting you want to delete.
1. Select the **...** options menu at the top-right corner of the setting's card and then select **Delete**.

For example:

:::image type="content" source="media/configure-sensor-settings-portal/delete-setting.png" alt-text="Screenshot of the Delete setting option.":::

## Edit settings for disconnected OT sensors

This procedure describes how to edit OT sensor settings if your OT sensor is currently disconnected from Azure, such as during an ongoing security incident.

By default, if you've configured any settings from the Azure portal, all settings that are configurable from both the Azure portal and the OT sensor are set to read-only on the OT sensor itself. For example, if you've configured a VLAN from the Azure portal, then bandwidth cap, subnet, and VLAN settings are *all* set to read-only, and blocked from modifications on the OT sensor.

If you're in a situation where the OT sensor is disconnected from Azure, and you need to modify one of these settings, you'll first need to gain write access to those settings.

**To gain write access to blocked OT sensor settings**:

1. On the Azure portal, in the **Sensor settings (Preview)** page, locate the setting you want to edit and open it for editing. For more information, see [View and edit current OT sensor settings](#view-and-edit-current-ot-sensor-settings) above.

    Edit the scope of the setting so that it no longer includes the OT sensor, and any changes you make while the OT sensor is disconnected aren't overwritten when you connect it back to Azure.

    > [!IMPORTANT]
    > Settings defined on the Azure portal always override settings defined on the OT sensor.

1. Sign into the affected OT sensor console, and select **Settings > Advanced configurations** > **Azure Remote Config**.

1. In the code box, modify the `block_local_config` value from `1` to `0`, and select **Close**. For example:

    :::image type="content" source="media/how-to-manage-individual-sensors/remote-config-sensor.png" alt-text="Screenshot of the Azure Remote Config option." lightbox="media/how-to-manage-individual-sensors/remote-config-sensor.png":::

Continue by updating the relevant setting directly on the OT network sensor. For more information, see [Manage individual sensors](how-to-manage-individual-sensors.md).

## Sensor setting reference

Use the following sections to learn more about the individual OT sensor settings available from the Azure portal:

### Bandwidth cap

For a bandwidth cap, define the maximum bandwidth you want the sensor to use for outgoing communication from the sensor to the cloud, either in Kbps or Mbps.

**Default**: 1500 Kbps

**Minimum required for a stable connection to Azure**: 350 Kbps. At this minimum setting, connections to the sensor console may be slower than usual.

### Subnet

To define your sensor's subnets, do any of the following:

- Select **Import subnets** to import a comma-separated list of subnet IP addresses and masks. Select **Export subnets** to export a list of currently configured data, or **Clear all** to start from scratch.

- Enter values in the **IP Address**, **Mask**, and **Name** fields to add subnet details manually. Select **Add subnet** to add more subnets as needed.

### VLAN naming

To define a VLAN for your OT sensor, enter the VLAN ID and a meaningful name.

Select **Add VLAN** to add more VLANs as needed.

## Next steps

> [!div class="nextstepaction"]
> [Manage sensors from the Azure portal](how-to-manage-sensors-on-the-cloud.md)

> [!div class="nextstepaction"]
> [Manage OT sensors from the sensor console](how-to-manage-individual-sensors.md)
