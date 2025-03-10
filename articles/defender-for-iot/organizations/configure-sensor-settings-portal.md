---
title: Configure OT sensor settings from the Azure portal - Microsoft Defender for IoT
description: Learn how to configure settings for OT network sensors from Microsoft Defender for IoT on the Azure portal.
ms.date: 12/27/2022
ms.topic: how-to
---

# Configure OT sensor settings from the Azure portal (Public preview)

After [onboarding](onboard-sensors.md) a new OT network sensor to Microsoft Defender for IoT, you might want to define several settings directly on the OT sensor console, such as [adding local users](manage-users-sensor.md).

The OT sensor settings listed in this article are also available directly from the Azure portal. Use the Azure portal to apply these settings in bulk across multiple cloud-connected OT sensors at a time, or across all cloud-connected OT sensors in a specific site or zone. This article describes how to view and configure view OT network sensor settings from the Azure portal.

> [!NOTE]
> The **Sensor settings** page in Defender for IoT is in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include other legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
>

## Prerequisites

To define OT sensor settings, make sure that you have the following:

- **An Azure subscription onboarded to Defender for IoT**. If you need to, [sign up for a free account](https://azure.microsoft.com/free/), and then use the [Quickstart: Get started with Defender for IoT](getting-started.md) to start a free trial.

- **Permissions**:

    - To view settings that others have defined, sign in with a [Security Reader](../../role-based-access-control/built-in-roles.md#security-reader), [Security admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../role-based-access-control/built-in-roles.md#owner) role for the subscription.

    - To define or update settings, sign in with [Security admin](../../role-based-access-control/built-in-roles.md#security-admin), [Contributor](../../role-based-access-control/built-in-roles.md#contributor), or [Owner](../../role-based-access-control/built-in-roles.md#owner) role.

    For more information, see [Azure user roles and permissions for Defender for IoT](roles-azure.md).

- **One or more cloud-connected OT network sensors**. For more information, see [Onboard OT sensors to Defender for IoT](onboard-sensors.md).

## Define a new sensor setting

Define a new setting whenever you want to define a specific configuration for one or more OT network sensors. For example, if you want to define bandwidth caps for all OT sensors in a specific site or zone, or define them for a single OT sensor at a specific location in your network.

**To define a new setting**:

1. In [Defender for IoT](https://portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started) on the Azure portal, select **Sites and sensors** > **Sensor settings (Preview)**.

1. On the **Sensor settings (Preview)** page, select **+ Add**, and then use the wizard to define the following values for your setting. Select **Next** when you're done with each tab in the wizard to move to the next step.

    |Tab name  |Description  |
    |---------|---------|
    |**Basics**     | Select the subscription where you want to apply your setting, and your [setting type](#add-sensor-settings). <br><br>Enter a meaningful name and an optional description for your setting.        |
    |**Setting**     | Define the values for your selected setting type.<br>For details about the options available for each setting type, find your selected setting type in the [Sensor setting reference](#add-sensor-settings) below.     |
    |**Apply**     | Use the **Select sites**, **Select zones**, and **Select sensors** dropdown menus to define where you want to apply your setting.   <br><br>**Important**:  Selecting a site or zone applies the setting to all connected OT sensors, including any OT sensors added to the site or zone later on. <br>If you select to apply your settings to an entire site, you don't also need to select its zones or sensors. |
    |**Review and create**     | Check the selections made for your setting. <br><br>If your new setting replaces an existing setting, a :::image type="icon" source="media/how-to-manage-individual-sensors/warning-icon.png" border="false"::: warning is shown to indicate the existing setting.<br><br>When you're satisfied with the setting's configuration, select **Create**.     |

Your new setting is now listed on the **Sensor settings (Preview)** page under its setting type, and on the sensor details page for any related OT sensor. Sensor settings are shown as read-only on the sensor details page. For example:

:::image type="content" source="media/configure-sensor-settings-portal/sensor-details-setting.png" alt-text="Screenshot of a sensor details page showing a setting applied.":::

> [!TIP]
> You may want to configure exceptions to your settings for a specific OT sensor or zone. In such cases, create an extra setting for the exception. 
>
> Settings override each other in a hierarchical manner, so that if your setting is applied to a specific OT sensor, it overrides any related settings that are applied to the entire zone or site. To create an exception for an entire zone, add a setting for that zone to override any related settings applied to the entire site.
>

## View and edit current OT sensor settings

**To view the current settings already defined for your subscription**:

1. In [Defender for IoT](https://portal.azure.com/#view/Microsoft_Azure_IoT_Defender/IoTDefenderDashboard/~/Getting_started) on the Azure portal, select **Sites and sensors** > **Sensor settings (Preview)**

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

By default, if you configure any settings from the Azure portal, all settings that are configurable from both the Azure portal and the OT sensor are set to read-only on the OT sensor itself. For example, if you configure a VLAN from the Azure portal, then bandwidth cap, subnet, and VLAN settings are *all* set to read-only, and blocked from modifications on the OT sensor.

If you're in a situation where the OT sensor is disconnected from Azure, and you need to modify one of these settings, you must first gain write access to those settings.

**To gain write access to blocked OT sensor settings**:

1. On the Azure portal, in the **Sensor settings (Preview)** page, locate the setting you want to edit and open it for editing. For more information, see [View and edit current OT sensor settings](#view-and-edit-current-ot-sensor-settings) above.

    Edit the scope of the setting so that it no longer includes the OT sensor, and any changes you make while the OT sensor is disconnected aren't overwritten when you connect it back to Azure.

    > [!IMPORTANT]
    > Settings defined on the Azure portal always override settings defined on the OT sensor.

1. Sign into the affected OT sensor console, and select **Settings > Advanced configurations** > **Azure Remote Config**.

1. In the code box, modify the `block_local_config` value from `1` to `0`, and select **Close**. For example:

    :::image type="content" source="media/how-to-manage-individual-sensors/remote-config-sensor.png" alt-text="Screenshot of the Azure Remote Config option." lightbox="media/how-to-manage-individual-sensors/remote-config-sensor.png":::

Continue by updating the relevant setting directly on the OT network sensor. For more information, see [Manage individual sensors](how-to-manage-individual-sensors.md).

## Add sensor settings

Use the following sections to learn more about the individual OT sensor settings available from the Azure portal.

The **Type** settings are:

- [Active Directory](#active-directory)
- [Bandwidth cap](#bandwidth-cap)
- [NTP](#ntp)
- [Local subnets](#local-subnets)
- [VLAN naming](#vlan-naming)
- [Public addresses](#public-addresses)
- [Single sign-on](#single-sign-on)
- [DHCP ranges](#dhcp-ranges)

To add a new setting **Type**, select **Sites and sensors** > **Sensor settings**. Select the setting from the **Type** drop down, for example:

:::image type="content" source="media/configure-sensor-settings-portal/sensor-settings-type.png" alt-text="The screenshot shows the sensor settings page with the type dropdown list options.":::

### Active Directory

To configure Active Directory settings from the Azure portal, define values for the following options:

|Name  |Description  |
|---------|---------|
|**Domain Controller FQDN**     | The fully qualified domain name (FQDN), exactly as it appears on your LDAP server. For example, enter `host1.subdomain.contoso.com`. <br><br> If you encounter an issue with the integration using the FQDN, check your DNS configuration. You can also enter the explicit IP of the LDAP server instead of the FQDN when setting up the integration.        |
|**Domain Controller Port**     | The port where your LDAP is configured. For example, use port 636 for LDAPS (SSL) connections.        |
|**Primary Domain**     | The domain name, such as `subdomain.contoso.com`, and then select the connection type for your LDAP configuration. <br><br>Supported connection types include: **LDAPS/NTLMv3** (recommended), **LDAP/NTLMv3**, or **LDAP/SASL-MD5**        |
|**Active Directory Groups**     | Select **+ Add** to add an Active Directory group to each permission level listed, as needed. <br><br>        When you enter a group name, make sure that you enter the group name exactly as defined in your Active Directory configuration on the LDAP server. You use these group names when adding new sensor users with Active Directory.<br><br>        Supported permission levels include **Read-only**, **Security Analyst**, **Admin**, and **Trusted Domains**.        |

> [!IMPORTANT]
> When entering LDAP parameters:
>
> - Define values exactly as they appear in Active Directory, except for the case.
> - User lowercase characters only, even if the configuration in Active Directory uses uppercase.
> - LDAP and LDAPS can't be configured for the same domain. However, you can configure each in different domains and then use them at the same time.
>

To add another Active Directory server, select **+ Add Server** and define those server values.

### Bandwidth cap

For a bandwidth cap, define the maximum bandwidth you want the sensor to use for outgoing communication from the sensor to the cloud, either in Kbps or Mbps.

**Default**: 1500 Kbps

**Minimum required for a stable connection to Azure**: 350 Kbps. At this minimum setting, connections to the sensor console might be slower than usual.

### NTP

To configure an NTP server for your sensor from the Azure portal, define an IP/Domain address of a valid IPv4 NTP server using port 123.

### Local subnets

To focus the Azure device inventory on devices that are in your OT scope, you need to manually edit the subnet list to include only the locally monitored subnets that are in your OT scope.

Subnets in the subnet list are automatically configured as ICS subnets, which means that Defender for IoT recognizes these subnets as OT networks. You can edit this setting when you [configure the subnets](#configure-subnets-in-the-azure-portal).

Once the subnets are configured, the network location of the devices is shown in the *Network location* (Public preview) column in the Azure device inventory. All of the devices associated with the listed subnets are displayed as *local*, while devices associated with detected subnets not included in the list are displayed as *routed*.

#### Configure subnets in the Azure portal

1. Under **Local subnets**, review the configured subnets. To focus the device inventory and view local devices in the inventory, delete any subnets that are not in your IoT/OT scope by selecting the options menu (...) on any subnet you want to delete.

1. To modify additional settings, select any subnet and then select **Edit** for the following options:

    - Select **Import subnets** to import a comma-separated list of subnet IP addresses and masks. Select **Export subnets** to export a list of currently configured data, or **Clear all** to start from scratch.

    - Enter values in the **IP Address**, **Mask**, and **Name** fields to add subnet details manually. Select **Add subnet** to add additional subnets as needed.

    - **ICS Subnet** is on by default, which means that Defender for IoT recognizes the subnet as an OT network. To mark a subnet as non-ICS, toggle off **ICS Subnet**.

### VLAN naming

To define a VLAN for your OT sensor, enter the VLAN ID and a meaningful name.

Select **Add VLAN** to add more VLANs as needed.

### Public addresses

Add the public addresses of internal devices into this configuration to ensure that the sensor includes them in the inventory and doesn't treat them as internet communication.

1. In the **Settings** tab, type the **IP address** and **Mask** address.

    :::image type="content" source="media/configure-sensor-settings-portal/sensor-settings-ip-addresses.png" alt-text="The screenshot shows the Settings tab for adding public addresses to the sensor settings.":::

1. Select **Next**
1. In the **Apply** tab, select sites, and toggle the **Add selection by specific zone/sensor** to optionally apply the IP addresses to specific zones and sensors.
1. Select **Next**.
1. Review the details and select **Create** to add the address to the public addresses list.

### Single sign-on

With Single sign-on (SSO), users simply sign into the sensor console and don't need multiple login credentials across different sensors and sites. For more information, see [create SSO configuration](set-up-sso.md#create-sso-configuration).

### DHCP ranges

Add the range of IP addresses to configure the DHCP settings that can apply to a device that might have multiple IP addresses associated with it.

1. In the **Settings** tab, type the **From** and **To** IP addresses, and optionally enter a **Name**.

    :::image type="content" source="media/configure-sensor-settings-portal/dhcp-ranges.png" alt-text="The screenshot shows the Settings tab for adding DHCP IP addresses to the sensor settings.":::

1. To add additional ranges, select **Add range**.
1. Select **Next: Selection**.
1. In the **Apply to** tab, select the sites, and toggle the **Add selection by specific zone/sensor** to optionally apply the IP addresses to specific zones and sensors.
1. Select **Next: Review**.
1. Review the details and select **Save and assign** to add the range of addresses to the DHCP range list.

## Next steps

> [!div class="nextstepaction"]
> [Manage sensors from the Azure portal](how-to-manage-sensors-on-the-cloud.md)

> [!div class="nextstepaction"]
> [Manage OT sensors from the sensor console](how-to-manage-individual-sensors.md)
