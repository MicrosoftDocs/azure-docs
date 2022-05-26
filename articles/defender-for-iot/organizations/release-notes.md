---
title: What's new in Microsoft Defender for IoT
description: This article lets you know what's new in the latest release of Defender for IoT.
ms.topic: overview
ms.date: 05/25/2022
---

# What's new in Microsoft Defender for IoT?

[!INCLUDE [Banner for top of topics](../includes/banner.md)]

This article lists Microsoft Defender for IoT's new features and enhancements for end-user organizations from the last nine months.

Features released earlier than nine months ago are listed in [What's new archive for Microsoft Defender for IoT for organizations](release-notes-archive.md).

Noted features listed below are in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include other legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Versioning and support for on-premises software versions

The Defender for IoT architecture uses on-premises sensors and management servers. This section describes the servicing information and timelines for the available on-premises software versions.

- Each General Availability (GA) version of the Defender for IoT sensor and on-premises management console software is supported for nine months after release. Fixes and new functionality are applied to each new version and aren't applied to older versions.

- Software update packages include new functionality and security patches. Urgent, high-risk security updates are applied in minor versions that may be released throughout the quarter.

- Features available from the Azure portal that are dependent on a specific sensor version are only available for sensors that have the required version installed, or higher.

For more information, see the [Microsoft Security Development Lifecycle practices](https://www.microsoft.com/en-us/securityengineering/sdl/), which describes Microsoft's SDK practices, including training, compliance, threat modeling, design requirements, tools such as Microsoft Component Governance, pen testing, and more.

> [!IMPORTANT]
> Manual changes to software packages may have detrimental effects on the sensor and on-premises management console. Microsoft is unable to support deployments with manual changes made to packages.
>

**Current versions of the sensor and on-premises management console software include**:

| Version | Date released | End support date |
|--|--|--|
| 22.2.3 | 06/2022 | 1/2023 |
| 22.2.1 | 05/2022 | 1/2023 |
| 22.1.4 | 04/2022 | 12/2022 |
| 22.1.3 | 03/2022 | 11/2022 |
| 22.1.1 | 02/2022 | 10/2022 |
| 10.5.5 | 12/2021 | 09/2022 |
| 10.5.4 | 12/2021 | 09/2022 |
| 10.5.3 | 10/2021 | 07/2022 |
| 10.5.2 | 10/2021 | 07/2022 |

## June 2022

**Sensor version**: 22.2.3

- [Release note tracking per version](#release-note-tracking-per-version)
- [Active discovery scans](#active-discovery-scans-public-preview)
- [Sensor management from the Azure portal](#sensor-management-from-the-azure-portal-public-preview)
- [Bi-directional alert synch between sensors and the Azure portal](#bi-directional-alert-synch-between-sensors-and-the-azure-portal-public-preview)
- [PCAP access from the Azure portal](#pcap-access-from-the-azure-portal-public-preview)
- [Support diagnostic log enhancements](#support-diagnostic-log-enhancements-public-preview)
- [Improved security for uploading protocol plugins](#improved-security-for-uploading-protocol-plugins)

### Release note tracking per version

Starting in June 2022, we're tracking our release notes per software version for the sensor and on-premises management console, including major and minor versions.

Going forward, find the sensor software versions released in a given month, and their features, at the top of the release notes for that month. For example, in June, we released version **22.2.3**. Features that are cloud-only and unrelated to sensor or on-premises management console software will also be listed separately from the software releases.

> [!IMPORTANT]
> Version numbers are listed only in this article, and not in detailed descriptions elsewhere in the documentation.
> To understand whether a feature is supported in your sensor version, check the listed features for that sensor version on this page.

For more information, see [Versioning and support for on-premises software versions](#versioning-and-support-for-on-premises-software-versions).

### Active discovery scans (Public preview)

Starting in version 22.2.3, you can configure active discovery scans from your sensor to dive deeper into your device data or discover new devices in your network.

Active discovery scans allow for faster deployments, enriching your existing device data with more details. They also help you discover more devices across your network, including older network switches where you can't create a SPAN port or put in a network TAP device.

**Supported protocols currently include**:

- **Switch discovery scans**: SNMPv1, SNMPv2, SNMPv3, HTTP
- **PLC discovery and enrichment scans**: S7 (Siemens), CIP (Rockwell)

> [!IMPORTANT]
> Active discovery scans run detection activity directly in your network and may cause some downtime. Take care when configuring your active discovery scan so that you only scan necessary resources.

View scanning data from active discovery scans from your sensor console only. For more information, see [Configure active discovery scans](configure-active-discovery-scans.md) and [Active and passive OT monitoring in Defender for IoT](best-practices/passive-active-monitoring.md).

### Sensor management from the Azure portal (public preview)

For sensor versions 22.2.x and higher, you can configure sensor settings, upgrade your sensor software, and monitor sensor health directly from the **Sites and sensors** page on the Azure portal.

On the **Sites and sensors** page:

- **To create and apply settings** across one or more cloud-connected sensors in your network, select **Sensor settings (Preview)**.

- **To monitor sensor health**, use the new sensor health widgets and table column data

- **To update sensor software**, select a connected sensor with an older software version, and then select **Update (Preview)**. Updates from the Azure portal are supported only when you are upgrading *from* version 22.2.0 or higher.

The following image highlights the new sensor management options now available from the **Sites and sensors** page in the Azure portal:

:::image type="content" source="media/release-notes/cloud-management.png" alt-text="Screenshot highlighting the new cloud management features in the Azure portal.":::

We've also added a sensor details page, where you drill down to a specific sensor from the Azure portal. On the **Sites and sensors** page, select a specific sensor name. The sensor details page lists basic sensor data, sensor health, and any sensor settings applied. For example:

:::image type="content" source="media/release-notes/sensor-overview.png" alt-text="Screenshot of a sensor Overview page.":::

For more information, see:

- [Define and view OT sensor settings (Public preview)](how-to-manage-sensors-on-the-cloud.md#define-and-view-ot-sensor-settings-public-preview)
- [Understand sensor health (Public preview)](how-to-manage-sensors-on-the-cloud.md#understand-sensor-health-public-preview)
- [Update your sensors from the Azure portal](update-ot-software.md#update-your-sensors)

> [!NOTE]
> When updating to version 22.2.x, make sure to update your firewall rules to support remote sensor upgrades from the Azure portal. For more information, see [Sensor access to Azure portal](how-to-set-up-your-network.md#sensor-access-to-azure-portal).

### Bi-directional alert synch between sensors and the Azure portal (Public preview)

For sensors updated to version 22.2.1, alert statuses and learn statuses are now fully synchronized between the sensor console and the Azure portal. For example, this means that you can close an alert on the Azure portal or the sensor console, and the alert status is updated in both locations.

*Learn* an alert from either the Azure portal or the sensor console to ensure that it's not triggered again the next time the same network traffic is detected.

The sensor console is also synchronized with an on-premises management console, so that alert statuses and learn statuses remain up-to-date across your management interfaces.

For more information, see:

- [View and manage alerts from the Azure portal](how-to-manage-cloud-alerts.md)
- [View alerts on your sensor](how-to-view-alerts.md)
- [Manage alerts from the sensor console](how-to-manage-the-alert-event.md)
- [Work with alerts on the on-premises management console](how-to-work-with-alerts-on-premises-management-console.md)

### PCAP access from the Azure portal (Public preview)

Now you can access the raw traffic files, known as packet capture files or PCAP files, directly from the Azure portal. This feature supports SOC or OT security engineers who want to investigate alerts from Defender for IoT or Microsoft Sentinel, without having to access each sensor separately.

:::image type="content" source="media/release-notes/pcap-request.png" alt-text="Screenshot of the Download PCAP button" lightbox="media/release-notes/pcap-request.png":::

PCAP files are downloaded to your Azure storage.

For more information, see [View and manage alerts from the Azure portal](how-to-manage-cloud-alerts.md).


### Support diagnostic log enhancements (Public preview)

Starting in sensor version [22.1.1](#new-support-diagnostics-log), you've been able to download a diagnostic log from the sensor console to send to support when you open a ticket.

Now, for locally-managed sensors, you can upload that diagnostic log directly on the Azure portal.

:::image type="content" source="media/how-to-manage-sensors-on-the-cloud/upload-diagnostics-log.png" alt-text="Screenshot of the Send diagnostic files to support option." lightbox="media/how-to-manage-sensors-on-the-cloud/upload-diagnostics-log.png":::

> [!TIP]
> For cloud-connected sensors, starting from sensor version [22.1.3](#march-2022), the diagnostic log is automatically available to support when you open the ticket.
>

For more information, see:

- [Download a diagnostics log for support](how-to-manage-individual-sensors.md#download-a-diagnostics-log-for-support)
- [Upload a diagnostics log for support](how-to-manage-sensors-on-the-cloud.md#upload-a-diagnostics-log-for-support-public-preview)


### Improved security for uploading protocol plugins

This version of the sensor provides a improved security for uploading proprietary plugins you've created using the Horizon SDK.

:::image type="content" source="media/release-notes/horizon.png" alt-text="Screenshot of the new Protocols DPI (Horizon Plugins) page.":::

For more information, see [Manage proprietary protocols with Horizon plugins](resources-manage-proprietary-protocols.md).

## May 2022

We've recently optimized and enhanced our documentation as follows:

- [Updated appliance catalog for OT environments](#updated-appliance-catalog-for-ot-environments)
- [Documentation reorganization for end-user organizations](#documentation-reorganization-for-end-user-organizations)

### Updated appliance catalog for OT environments

We've refreshed and revamped the catalog of supported appliances for monitoring OT environments. These appliances support flexible deployment options for environments of all sizes and can be used to host both the OT monitoring sensor and on-premises management consoles.

Use the new pages as follows:

1. **Understand which hardware model best fits your organization's needs.** For more information, see [Which appliances do I need?](ot-appliance-sizing.md)

1. **Learn about the preconfigured hardware appliances that are available to purchase, or system requirements for virtual machines.** For more information, see [Pre-configured physical appliances for OT monitoring](ot-pre-configured-appliances.md) and [OT monitoring with virtual appliances](ot-virtual-appliances.md).

    For more information about each appliance type, use the linked reference page, or browse through our new **Reference > OT monitoring appliances** section.

    :::image type="content" source="media/release-notes/appliance-catalog.png" alt-text="Screenshot of the new appliance catalog reference section." lightbox="media/release-notes/appliance-catalog.png":::

    Reference articles for each appliance type, including virtual appliances, include specific steps to configure the appliance for OT monitoring with Defender for IoT. Generic software installation and troubleshooting procedures are still documented in [Defender for IoT software installation](how-to-install-software.md).

### Documentation reorganization for end-user organizations

We recently reorganized our Defender for IoT documentation for end-user organizations, highlighting a clearer path for onboarding and getting started.

Check out our new structure to follow through viewing devices and assets, managing alerts, vulnerabilities and threats, integrating with other services, and deploying and maintaining your Defender for IoT system.

**New and updated articles include**:

- [Welcome to Microsoft Defender for IoT for organizations](overview.md)
- [Microsoft Defender for IoT architecture](architecture.md)
- [Quickstart: Get started with Defender for IoT](getting-started.md)
- [Tutorial: Microsoft Defender for IoT trial setup](tutorial-onboarding.md)
- [Tutorial: Get started with Enterprise IoT](tutorial-getting-started-eiot-sensor.md)
- [Plan your sensor connections for OT monitoring](plan-network-monitoring.md)
- [About Microsoft Defender for IoT network setup](how-to-set-up-your-network.md)

> [!NOTE]
> To send feedback on docs via GitHub, scroll to the bottom of the page and select the **Feedback** option for **This page**. We'd be glad to hear from you!
>

## April 2022

- [Extended device property data in the Device inventory](#extended-device-property-data-in-the-device-inventory)

### Extended device property data in the Device inventory

**Sensor software version**: 22.1.4

Starting for sensors updated to version 22.1.4, the **Device inventory** page on the Azure portal shows extended data for the following fields:

- **Description**
- **Tags**
- **Protocols**
- **Scanner**
- **Last Activity**

For more information, see [Manage your device inventory from the Azure portal](how-to-manage-device-inventory-for-organizations.md).

## March 2022

**Sensor version**: 22.1.3

- [Sensor health from the Azure portal](#sensor-health-from-the-azure-portal)
- [Use Azure Monitor workbooks with Microsoft Defender for IoT](#use-azure-monitor-workbooks-with-microsoft-defender-for-iot-public-preview)
- [IoT OT Threat Monitoring with Defender for IoT solution GA](#iot-ot-threat-monitoring-with-defender-for-iot-solution-ga)
- [Edit and delete devices from the Azure portal](#edit-and-delete-devices-from-the-azure-portal-public-preview)
- [Key state alert updates](#key-state-alert-updates-public-preview)
- [Sign out of a CLI session](#sign-out-of-a-cli-session)

### Sensor health from the Azure portal

Sensor health features in the Azure portal are supported started with sensor version 22.1.3.

For more information, see [Sensor management from the Azure portal (public preview)](#sensor-management-from-the-azure-portal-public-preview).

### Use Azure Monitor workbooks with Microsoft Defender for IoT (Public preview)

[Azure Monitor workbooks](../../azure-monitor/visualize/workbooks-overview.md) provide graphs and dashboards that visually reflect your data, and are now available directly in Microsoft Defender for IoT with data from [Azure Resource Graph](../../governance/resource-graph/index.yml).

In the Azure portal, use the new Defender for IoT **Workbooks** page to view workbooks created by Microsoft and provided out-of-the-box, or create custom workbooks of your own.

:::image type="content" source="media/release-notes/workbooks.png" alt-text="Screenshot of the new Workbooks page." lightbox="media/release-notes/workbooks.png":::

For more information, see [Use Azure Monitor workbooks in Microsoft Defender for IoT](workbooks.md).

### IoT OT Threat Monitoring with Defender for IoT solution GA

The IoT OT Threat Monitoring with Defender for IoT solution in Microsoft Sentinel is now GA. In the Azure portal, use this solution to help secure your entire OT environment, whether you need to protect existing OT devices or build security into new OT innovations.

For more information, see [OT threat monitoring in enterprise SOCs](concept-sentinel-integration.md) and [Tutorial: Integrate Defender for IoT and Sentinel](../../sentinel/iot-solution.md?tabs=use-out-of-the-box-analytics-rules-recommended).

### Edit and delete devices from the Azure portal (Public preview)

The **Device inventory** page in the Azure portal now supports the ability to edit device details, such as security, classification, location, and more:

:::image type="content" source="media/release-notes/edit-device-details.png" alt-text="Screenshot of the Device inventory page showing the Edit pane." lightbox="media/release-notes/edit-device-details.png":::

For more information, see [Edit device details](how-to-manage-device-inventory-for-organizations.md#edit-device-details).

You can only delete devices from Defender for IoT if they've been inactive for more than 14 days.  For more information, see [Delete a device](how-to-manage-device-inventory-for-organizations.md#delete-a-device).

### Key state alert updates (Public preview)

Defender for IoT now supports the Rockwell protocol for PLC operating mode detections.

For the Rockwell protocol, the **Device inventory** pages in both the Azure portal and the sensor console now indicate the PLC operating mode key and run state, and whether the device is currently in a secure mode.

If the device's PLC operating mode is ever switched to an unsecured mode, such as *Program* or *Remote*, a **PLC Operating Mode Changed** alert is generated.

For more information, see [Manage your IoT devices with the device inventory for organizations](how-to-manage-device-inventory-for-organizations.md).

### Sign out of a CLI session

Starting in this version, CLI users are automatically signed out of their session after 300 inactive seconds. To sign out manually, use the new `logout` CLI command.

For more information, see [Work with Defender for IoT CLI commands](references-work-with-defender-for-iot-cli-commands.md).


## February 2022

- [New sensor installation wizard](#new-sensor-installation-wizard)
- [Sensor redesign and unified Microsoft product experience](#sensor-redesign-and-unified-microsoft-product-experience)
- [Enhanced sensor Overview page](#enhanced-sensor-overview-page)
- [New support diagnostics log](#new-support-diagnostics-log)
- [Alert updates](#alert-updates)
- [Custom alert updates](#custom-alert-updates)
- [CLI command updates](#cli-command-updates)
- [Update to version 22.1.x](#update-to-version-221x)
- [New connectivity model and firewall requirements](#new-connectivity-model-and-firewall-requirements)
- [Protocol improvements](#protocol-improvements)
- [Modified, replaced, or removed options and configurations](#modified-replaced-or-removed-options-and-configurations)

### New sensor installation wizard

Previously, you needed to use separate dialogs to upload a sensor activation file, verify your sensor network configuration, and configure your SSL/TLS certificates.

Now, when installing a new sensor or a new sensor version, our installation wizard provides a streamlined interface to do all these tasks from a single location. 

For more information, see [Defender for IoT installation](how-to-install-software.md).

### Sensor redesign and unified Microsoft product experience

The Defender for IoT sensor console has been redesigned to create a unified Microsoft Azure experience and enhance and simplify workflows.

These features are now Generally Available (GA). Updates include the general look and feel, drill-down panes, search and action options, and more. For example:

**Simplified workflows include**:

- The **Device inventory** page now includes detailed device pages. Select a device in the table and then select **View full details** on the right.

    :::image type="content" source="media/release-notes/device-inventory-details.png" alt-text="Screenshot of the View full details button." lightbox="media/release-notes/device-inventory-details.png":::

- Properties updated from the sensor's inventory are now automatically updated in the cloud device inventory.

- The device details pages, accessed either from the **Device map** or **Device inventory** pages, is shown as read only. To modify device properties, select **Edit properties** on the bottom-left.

- The **Data mining** page now includes reporting functionality. While the **Reports** page was removed, users with read-only access can view updates on the **Data mining page** without the ability to modify reports or settings.

    For admin users creating new reports, you can now toggle on a **Send to CM** option to send the report to a central management console as well. For more information, see [Create a report](how-to-create-data-mining-queries.md#create-a-report).

- The **System settings** area has been reorganized in to sections for *Basic* settings, settings for *Network monitoring*, *Sensor management*, *Integrations*, and *Import settings*.

- The sensor online help now links to key articles in the Microsoft Defender for IoT documentation.

**Defender for IoT maps now include**:

- A new **Map View** is now shown for alerts and on the device details pages, showing where in your environment the alert or device is found.

- Right-click a device on the map to view contextual information about the device, including related alerts, event timeline data, and connected devices.

- To enable the ability to collapse IT networks, ensure that the **Toggle IT Networks Grouping** option is enabled. This option is now only available from the map.

- The **Simplified Map View** option has been removed.

We've also implemented global readiness and accessibility features to comply with Microsoft standards. In the on-premises sensor console, these updates include both high contrast and regular screen display themes and localization for over 15 languages. 

For example:

:::image type="content" source="media/release-notes/dark-mode.png" alt-text="Screenshot of the sensor console in dark mode." lightbox="media/release-notes/dark-mode.png":::

Access global readiness and accessibility options from the **Settings** icon at the top-right corner of your screen:

:::image type="content" source="media/release-notes/settings-icon.png" alt-text="Screenshot that shows localization options." lightbox="media/release-notes/settings-icon.png":::

### Enhanced sensor Overview page

The Defender for IoT sensor portal's **Dashboard** page has been renamed as **Overview**, and now includes data that better highlights system deployment details, critical network monitoring health, top alerts, and important trends and statistics.

:::image type="content" source="media/release-notes/new-interface.png" alt-text="Screenshot that shows the updated interface." lightbox="media/release-notes/new-interface.png":::

The Overview page also now serves as a *black box* to view your overall sensor status in case your outbound connections, such as to the Azure portal, go down.

Create more dashboards using the **Trends & Statistics** page, located under the **Analyze** menu on the left.

### New support diagnostics log

Now you can get a summary of the log and system information that gets added to your support tickets. In the **Backup and Restore** dialog, select **Support Ticket Diagnostics**.

:::image type="content" source="media/release-notes/support-ticket-diagnostics.png" alt-text="Screenshot of the Backup and Restore dialog showing the Support Ticket Diagnostics option." lightbox="media/release-notes/support-ticket-diagnostics.png":::

### Alert updates

**In the Azure portal**:

Alerts are now available in Defender for IoT in the Azure portal. Work with alerts to enhance the security and operation of your IoT/OT network.

The new **Alerts** page is currently in Public Preview, and provides:

- An aggregated, real-time view of threats detected by network sensors.
- Remediation steps for devices and network processes.
- Streaming alerts to Microsoft Sentinel and empower your SOC team.
- Alert storage for 90 days from the time they're first detected.
- Tools to investigate source and destination activity, alert severity and status, MITRE ATT&CK information, and contextual information about the alert.

For example:

:::image type="content" source="media/release-notes/mitre.png" alt-text="Screenshot of the Alerts page showing MITRE information." lightbox="media/release-notes/mitre.png":::

**On the sensor console**:

On the sensor console, the **Alerts** page now shows details for alerts detected by sensors that are configured with a cloud-connection to Defender for IoT on Azure. Users working with alerts in both Azure and on-premises should understand how alerts are managed between the Azure portal and the on-premises components.

:::image type="content" source="media/release-notes/alerts-in-console.png" alt-text="Screenshot of the new Alerts page on the sensor console." lightbox="media/release-notes/alerts-in-console.png":::

Other alert updates include:

- **Access contextual data** for each alert, such as events that occurred around the same time, or a map of connected devices. Maps of connected devices are available for sensor console alerts only.

- **Alert statuses** are updated, and, for example,  now include a *Closed* status instead of *Acknowledged*.

- **Alert storage** for 90 days from the time that they're first detected.

- The **Backup Activity with Antivirus Signatures Alert**. This new alert warning is triggered for traffic detected between a source device and destination backup server, which is often legitimate backup activity. Critical or major malware alerts are no longer triggered for such activity.

- **During upgrades**, sensor console alerts that are currently archived are deleted. Pinned alerts are no longer supported, so pins are removed for sensor console alerts as relevant.

### Custom alert updates

The sensor console's **Custom alert rules** page now provides:

- Hit count information in the **Custom alert rules** table, with at-a-glance details about the number of alerts triggered in the last week for each rule you've created.

- The ability to schedule custom alert rules to run outside of regular working hours.

- The ability to alert on any field that can be extracted from a protocol using the DPI engine.

- Complete protocol support when creating custom rules, and support for an extensive range of related protocol variables.

    :::image type="content" source="media/how-to-manage-sensors-on-the-cloud/protocol-support-custom-alerts.png" alt-text="Screenshot of the updated Custom alerts dialog. "lightbox="media/how-to-manage-sensors-on-the-cloud/protocol-support-custom-alerts.png":::

For more information and the updated custom alert procedure, see [Customize alert rules](how-to-accelerate-alert-incident-response.md#customize-alert-rules).

### CLI command updates

The Defender for Iot sensor software installation is now containerized. With the now-containerized sensor, you can use the *cyberx_host* user to investigate issues with other containers or the operating system, or to send files via FTP.

This *cyberx_host* user is available by default and connects to the host machine. If you need to, recover the password for the *cyberx_host* user from the **Sites and sensors** page in Defender for IoT.

As part of the containerized sensor, the following CLI commands have been modified:

|Legacy name  |Replacement  |
|---------|---------|
|`cyberx-xsense-reconfigure-interfaces`    |`sudo dpkg-reconfigure iot-sensor`         |
|`cyberx-xsense-reload-interfaces`     |  `sudo dpkg-reconfigure iot-sensor`      |
|`cyberx-xsense-reconfigure-hostname`     | `sudo dpkg-reconfigure iot-sensor`       |
| `cyberx-xsense-system-remount-disks` |`sudo dpkg-reconfigure iot-sensor` |

The `sudo cyberx-xsense-limit-interface-I eth0 -l value` CLI command was removed. This command was used to limit the interface bandwidth that the sensor uses for day-to-day procedures, and is no longer supported.

For more information, see [Defender for IoT installation](how-to-install-software.md) and [Work with Defender for IoT CLI commands](references-work-with-defender-for-iot-cli-commands.md).

### Update to version 22.1.x

To use all of Defender for IoT's latest features, make sure to update your sensor software versions to 22.1.x.

If you're on a legacy version, you may need to run a series of updates in order to get to the latest version. You'll also need to update your firewall rules and re-activate your sensor with a new activation file.

After you've upgraded to version 22.1.x, the new upgrade log can be found at the following path, accessed via SSH and the *cyberx_host* user: `/opt/sensor/logs/legacy-upgrade.log`.

For more information, see [Update OT system software](update-ot-software.md).

> [!NOTE]
> Upgrading to version 22.1.x is a large update, and you should expect the update process to require more time than previous updates.
>

### New connectivity model and firewall requirements

Defender for IoT version 22.1.x supports a new set of sensor connection methods that provide simplified deployment, improved security, scalability, and flexible connectivity.

In addition to [migration steps](connect-sensors.md#migration-for-existing-customers), this new connectivity model requires that you open a new firewall rule. For more information, see:

- **New firewall requirements**: [Sensor access to Azure portal](how-to-set-up-your-network.md#sensor-access-to-azure-portal).
- **Architecture**: [Sensor connection methods](architecture-connections.md)
- **Connection procedures**: [Connect your sensors to Microsoft Defender for IoT](connect-sensors.md)

### Protocol improvements

This version of Defender for IoT provides improved support for:

- Profinet DCP
- Honeywell
- Windows endpoint detection

### Modified, replaced, or removed options and configurations

The following Defender for IoT options and configurations have been moved, removed, and/or replaced:

- Reports previously found on the **Reports** page are now shown on the **Data Mining** page instead. You can also continue to view data mining information directly from the on-premises management console.

- Changing a locally managed sensor name is now supported only by onboarding the sensor to the Azure portal again with the new name. Sensor names can no longer be changed directly from the sensor. For more information, see [Change the name of a sensor](how-to-manage-individual-sensors.md#change-the-name-of-a-sensor).


## December 2021

- [Enhanced integration with Microsoft Sentinel (Preview)](#enhanced-integration-with-microsoft-sentinel-preview)
- [Apache Log4j vulnerability](#apache-log4j-vulnerability)
- [Alerting](#alerting)

### Enhanced integration with Microsoft Sentinel (Preview)

The new **IoT OT Threat Monitoring with Defender for IoT solution** is available and provides enhanced capabilities for Microsoft Defender for IoT integration with Microsoft Sentinel. The **IoT OT Threat Monitoring with Defender for IoT solution** is a set of bundled content, including analytics rules, workbooks, and playbooks, configured specifically for Defender for IoT data. This solution currently supports only Operational Networks (OT/ICS). 

For information on integrating with Microsoft Sentinel, see [Tutorial: Integrate Defender for Iot and Sentinel](../../sentinel/iot-solution.md?tabs=use-out-of-the-box-analytics-rules-recommended)

### Apache Log4j vulnerability

Version 10.5.4 of Microsoft Defender for IoT mitigates the Apache Log4j vulnerability. For details, see [the security advisory update](https://techcommunity.microsoft.com/t5/microsoft-defender-for-iot/updated-15-dec-defender-for-iot-security-advisory-apache-log4j/m-p/3036844).

### Alerting

Version 10.5.4 of Microsoft Defender for IoT delivers important alert enhancements:

- Alerts for certain minor events or edge-cases are now disabled.
- For certain scenarios, similar alerts are minimized in a single alert message.

These changes reduce alert volume and enable more efficient targeting and analysis of security and operational events.

#### Alerts permanently disabled

The alerts listed below are permanently disabled with version 10.5.4. Detection and monitoring are still supported for traffic associated with the alerts.

**Policy engine alerts**

- RPC Procedure Invocations
- Unauthorized HTTP Server
- Abnormal usage of MAC Addresses

#### Alerts disabled by default

The alerts listed below are disabled by default with version 10.5.4. You can re-enable the alerts from the Support page of the sensor console, if necessary.

**Anomaly engine alert**
- Abnormal Number of Parameters in HTTP Header
- Abnormal HTTP Header Length
- Illegal HTTP Header Content

**Operational engine alerts**
- HTTP Client Error
- RPC Operation Failed

**Policy engine alerts**

Disabling these alerts also disables monitoring of related traffic. Specifically, this traffic won't be reported in Data Mining reports.

- Illegal HTTP Communication alert and HTTP Connections Data Mining traffic
- Unauthorized HTTP User Agent alert and HTTP User Agents Data Mining traffic
- Unauthorized HTTP SOAP Action and HTTP SOAP Actions Data Mining traffic

#### Updated alert functionality

**Unauthorized Database Operation alert**
Previously, this alert covered DDL and DML alerting and Data Mining reporting. Now:
- DDL traffic: alerting and monitoring are supported. 
- DML traffic: Monitoring is supported.  Alerting isn't supported.

**New Asset Detected alert**
This alert is disabled for new devices detected in IT subnets. The New Asset Detected alert is still triggered for new devices discovered in OT subnets. OT subnets are detected automatically and can be updated by users if necessary.

### Minimized alerting

Alert triggering for specific scenarios has been minimized to help reduce alert volume and simplify alert investigation. In these scenarios, if a device performs repeated activity on targets, an alert is triggered once.  Previously, a new alert was triggered each time the same activity was carried out.

This new functionality is available on the following alerts:

- Port Scan Detected alerts, based on activity of the source device (generated by the Anomaly engine)
- Malware alerts, based on activity of the source device. (generated by the Malware engine). 
- Suspicion of Denial of Service Attack alerts, based on activity of the destination device (generated by the Malware engine)

## November 2021

The following feature enhancements are available with version 10.5.3 of Microsoft Defender for IoT.

- The on-premises management console, has a new [ServiceNow Integration API - “/external/v3/integration/ (Preview)](references-work-with-defender-for-iot-apis.md#servicenow-integration-api---externalv3integration-preview).

- Enhancements have been made to the network traffic analysis of multiple OT and ICS protocol dissectors.

- As part of our automated maintenance, archived alerts that are over 90 days old will now be automatically deleted.

- Many enhancements have been made to the exporting of alert metadata based on customer feedback.

## October 2021

The following feature enhancements are available with version 10.5.2 of Microsoft Defender for IoT.

- [PLC operating mode detections (Public Preview)](#plc-operating-mode-detections-public-preview)

- [PCAP API](#pcap-api)

- [On-premises Management Console Audit](#on-premises-management-console-audit)

- [Webhook Extended](#webhook-extended)

- [Unicode support for certificate passphrases](#unicode-support-for-certificate-passphrases)

### PLC operating mode detections (Public Preview)

Users can now view PLC operating mode states, changes, and risks. The PLC Operating mode consists of the PLC logical Run state and the physical Key state, if a physical key switch exists on the PLC.

This new capability helps improve security by detecting *unsecure* PLCs, and as a result prevents malicious attacks such as PLC Program Downloads. The 2017 Triton attack on a petrochemical plant illustrates the effects of such risks.
This information also provides operational engineers with critical visibility into the operational mode of enterprise PLCs.

#### What is an unsecure mode?

If the Key state is detected as Program or the Run state is detected as either Remote or Program the PLC is defined by Defender for IoT as *unsecure*.

#### Visibility and risk assessment

- Use the Device Inventory to view the PLC state of organizational PLCs, and contextual device information. Use the Device Inventory Settings dialog box to add this column to the Inventory.

    :::image type="content" source="media/release-notes/device-inventory-plc.png" alt-text="Device inventory showing PLC operating mode.":::

- View PLC secure status and last change information per PLC in the Attributes section of the Device Properties screen. If the Key state is detected as Program or the Run state is detected as either Remote or Program the PLC is defined by Defender for IoT as *unsecure*. The Device Properties PLC Secured option will read false.

    :::image type="content" source="media/release-notes/attributes-plc.png" alt-text="Attributes screen showing PLC information.":::

- View all network PLC Run and Key State statuses by creating a Data Mining with PLC operating mode information.

    :::image type="content" source="media/release-notes/data-mining-plc.png" alt-text="Data inventory screen showing PLC option.":::

- Use the Risk Assessment Report to review the number of network PLCs in the unsecure mode, and additional information you can use to mitigate unsecure PLC risks.

### PCAP API

The new PCAP API lets the user retrieve PCAP files from the sensor via the on-premises management console with, or without direct access to the sensor itself.

### On-premises Management Console audit

Audit logs for the on-premises management console can now be exported to facilitate investigations into what changes were made, and by who.

### Webhook extended

Webhook extended can be used to send extra data to the endpoint. The extended feature includes all of the information in the Webhook alert and adds the following information to the report:

- sensorID
- sensorName
- zoneID
- zoneName
- siteID
- siteName
- sourceDeviceAddress
- destinationDeviceAddress
- remediationSteps
- handled
- additionalInformation

### Unicode support for certificate passphrases

Unicode characters are now supported when working with sensor certificate passphrases. For more information, see [About certificates](how-to-deploy-certificates.md#about-certificates)

## Next steps

[Getting started with Defender for IoT](getting-started.md)
