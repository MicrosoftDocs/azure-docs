---
title: What's new in Microsoft Defender for IoT
description: This article lets you know what's new in the latest release of Defender for IoT.
ms.topic: overview
ms.date: 02/15/2022
---

# What's new in Microsoft Defender for IoT?

[!INCLUDE [Banner for top of topics](../includes/banner.md)]

This article lists new features and feature enhancements for Defender for IoT in February 2022.

Noted features listed below are in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include other legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Versioning and support for Defender for IoT

Listed below are the support, breaking change policies for Microsoft Defender for IoT, and the versions of Microsoft Defender for IoT that are currently available.

### Servicing information and timelines

Each General Availability (GA) version of the Defender for IoT sensor and on-premises management console is supported for nine months after release. Fixes and new functionality will be applied to the current GA version that is currently supported and won't be applied to older GA versions.

The Defender for IoT sensor and on-premises management console update packages includes new functionality and security patches. Urgent, high-risk security updates will be applied to minor releases occurring during the quarter.

*Making changes to packages manually might have detrimental effects on the sensor and on-premises management console. In such cases, Microsoft is unable to provide support for your deployment.*

### Versions and support dates

| Version | Date released | End support date |
|--|--|--|
| 22.1 | 02/2022 | 10/2022 |
| 10.0 | 01/2021 | 10/2021 |
| 10.3 | 04/2021 | 01/2022 |
| 10.5.2 | 10/2021 | 07/2022 |
| 10.5.3 | 10/2021 | 07/2022 |
| 10.5.4 | 12/2021 | 09/2022 |

## February 2022

- [Sensor redesign and unified Microsoft product experience](#sensor-redesign-and-unified-microsoft-product-experience)
- [Enhanced sensor Overview page](#enhanced-sensor-overview-page)
- [New support diagnostics log](#new-support-diagnostics-log)
- [Alert updates](#alert-updates)
- [New sensor installation wizard](#new-sensor-installation-wizard)
- [Containerized sensor installation](#containerized-sensor-installation)
- [Upgrade to version 22.1](#upgrade-to-version-221)
- [New connectivity model and firewall requirements](#new-connectivity-model-and-firewall-requirements)
- [Protocol improvements](#protocol-improvements)
- [Modified, replaced, or removed options and configurations](#modified-replaced-or-removed-options-and-configurations)

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

- **Alert statuses** are updated, and for example now include a *Closed* status instead of *Acknowledged*.

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

### New sensor installation wizard

Previously, you needed to use separate dialogs to upload a sensor activation file, verify your sensor network configuration, and configure your SSL/TLS certificates.

Now, when installing a new sensor or a new sensor version, our installation wizard provides a streamlined interface to do all these tasks from a single location. 

For more information, see [Defender for IoT installation](how-to-install-software.md).

### Containerized sensor installation

The Defender for Iot sensor software installation is now containerized. With the now-containerized sensor, you can use the *cyberx_host* user to investigate issues with other containers or the operating system, or to send files via FTP.

This *cyberx_host* user is available by default and connects to the host machine. If you need to, recover the password for the *cyberx_host* user from the **Sites and sensors** page in Defender for IoT.

As part of the containerized sensor, the following CLI commands have been modified:

|Legacy name  |Replacement  |
|---------|---------|
|`cyberx-xsense-reconfigure-interfaces`    |`sudo dpkg-reconfigure iot-sensor`         |
|`cyberx-xsense-reload-interfaces`     |  `sudo dpkg-reconfigure iot-sensor`      |
|`cyberx-xsense-reconfigure-hostname`     | `sudo dpkg-reconfigure iot-sensor`       |
| `cyberx-xsense-system-remount-disks` |`sudo dpkg-reconfigure iot-sensor` |
| | |

The `sudo cyberx-xsense-limit-interface-I eth0 -l value` CLI command was removed. This command was used to limit the interface bandwidth that the sensor uses for day-to-day procedures, and is no longer supported.

For more information, see [Defender for IoT installation](how-to-install-software.md) and [Work with Defender for IoT CLI commands](references-work-with-defender-for-iot-cli-commands.md).

### Upgrade to version 22.1

Upgrade your sensor versions directly to 22.1. Make sure that you've downloaded and upgraded your sensor machine, and then reactivated your sensor from the Azure portal using the new activation file.

For more information, see:

- [Update a standalone sensor version](how-to-manage-individual-sensors.md#update-a-standalone-sensor-version)
- [Reactivate a sensor for upgrades to version 22.x from a legacy version](how-to-manage-sensors-on-the-cloud.md#reactivate-a-sensor-for-upgrades-to-version-22x-from-a-legacy-version)

After you've upgraded to version 22.1.x, the new upgrade log can be found at the following path, accessed via SSH and the *cyberx_host* user: `/opt/sensor/logs/legacy-upgrade.log`.

### New connectivity model and firewall requirements

With this version, users are only required to install sensors and connect to Defender for IoT on the Azure portal. Defender for IoT no longer requires you to install, pay for, or manage an IoT Hub.

This new connectivity model requires that you open a new firewall rule. For more information, see [Sensor access to Azure portal](how-to-set-up-your-network.md#sensor-access-to-azure-portal).

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

## April 2021

### Work with automatic threat Intelligence updates (Public Preview)

New threat intelligence packages can now be automatically pushed to cloud connected sensors as they're released by Microsoft Defender for IoT. This is in addition to downloading threat intelligence packages and then uploading them to sensors.

Working with automatic updates helps reduce operational efforts and ensure greater security.
Enable automatic updating by onboarding your cloud connected sensor on the Defender for IoT portal with the **Automatic Threat Intelligence Updates** toggle turned on.

If you would like to take a more conservative approach to updating your threat intelligence data, you can manually push packages from the Microsoft Defender for IoT portal to cloud connected sensors only when you feel it's required.
This gives you the ability to control when a package is installed, without the need to download and then upload it to your sensors. Manually push updates to sensors from the Defender for IoT **Sites and Sensors** page.

You can also review the following information about threat intelligence packages:

- Package version installed
- Threat intelligence update mode
- Threat intelligence update status

### View cloud connected sensor information (Public Preview)

View important operational information about cloud connected sensors on the **Sites and Sensors** page.

- The sensor version installed
- The sensor connection status to the cloud.
- The last time the sensor was detected connecting to the cloud.

### Alert API enhancements

New fields are available for users working with alert APIs.

**On-premises management console**

- Source and destination address
- Remediation steps
- The name of sensor defined by the user
- The name of zone associated with the sensor
- The name of site associated with the sensor

**Sensor**

- Source and destination address
- Remediation steps

API version 2 is required when working with the new fields.

### Features delivered as Generally Available (GA)

The following features were previously available for Public Preview, and are now Generally Available (GA) features:

- Sensor - enhanced custom alert rules
- On-premises management console - export alerts
- Add second network interface to On-premises management console
- Device builder - new micro agent

## March 2021

### Sensor - enhanced custom alert rules (Public Preview)

You can now create custom alert rules based on the day, group of days and time-period network activity was detected.  Working with day and time rule conditions is useful, for example in cases where alert severity is derived by the time the alert event takes place. For example, create a custom rule that triggers a high severity alert when network activity is detected on a weekend or in the evening.

This feature is available on the sensor with the release of version 10.2.

### On-premises management console - export alerts (Public Preview)

Alert information can now be exported to a .csv file from the on-premises management console. You can export information of all alerts detected or export information based on the filtered view.

This feature is available on the on-premises management console with the release of version 10.2.

### Add second network interface to On-premises management console (Public Preview)

You can now enhance the security of your deployment by adding a second network interface to your on-premises management console. This feature allows your on-premises management to have its connected sensors on one secure network, while allowing your users to access the on-premises management console through a second separate network interface.

This feature is available on the on-premises management console with the release of version 10.2.

## January 2021

- [Security](#security)
- [Onboarding](#onboarding)
- [Usability](#usability)
- [Other updates](#other-updates)

### Security

Certificate and password recovery enhancements were made for this release.

#### Certificates

This version lets you:

- Upload SSL certificates directly to the sensors and on-premises management consoles.
- Perform validation between the on-premises management console and connected sensors, and between a management console and a High Availability management console. Validation is based on expiration dates, root CA authenticity, and Certificate Revocation Lists.  If validation fails, the session won't continue.

For upgrades:

- There's no change in SSL certificate or validation functionality during the upgrade.
- After upgrading, sensor and on-premises management console administrative users can replace SSL certificates, or activate SSL certificate validation from the System Settings, SSL Certificate window.  

For Fresh Installations:

- During first-time sign-in, users are required to either use an SSL Certificate (recommended) or a locally generated self-signed certificate (not recommended)
- Certificate validation is turned on by default for fresh installations.

#### Password recovery
  
Sensor and on-premises management console Administrative users can now recover passwords from the Microsoft Defender for IoT portal. Previously password recovery required intervention by the support team.

### Onboarding

#### On-premises management console - committed devices

Following initial sign-in to the on-premises management console, users are now required to upload an activation file. The file contains the aggregate number of devices to be monitored on the organizational  network. This number is referred to as the number of committed devices.
Committed devices are defined during the onboarding process on the Microsoft Defender for IoT portal, where the activation file is generated.
First-time users and users upgrading are required to upload the activation file.
After initial activation, the number of devices detected on the network might exceed the number of committed devices. This event might happen, for example, if you connect more sensors to the management console. If there's a discrepancy between the number of detected devices and the number of committed devices, a warning appears in the management console. If this event occurs, you should upload a new activation file.

#### Pricing page options

Pricing page lets you onboard new subscriptions to Microsoft Defender for IoT and define committed devices in your network.  
Additionally, the Pricing page now lets you manage existing subscriptions associated with a sensor and update device commitment.

#### View and manage onboarded sensors

A new Site and Sensors portal page lets you:

- Add descriptive information about the sensor. For example, a zone associated with the sensor, or free-text tags.
- View and filter sensor information. For example, view details about sensors that are cloud connected or locally managed or view information about sensors in a specific zone.  

### Usability

#### Azure Sentinel new connector page

The Microsoft Defender for IoT data connector page in Azure Sentinel has been redesigned. The data connector is now based on subscriptions rather than IoT Hubs; allowing customers to better manage their configuration connection to Azure Sentinel.

#### Azure portal permission updates  

Security Reader and Security Administrator support has been added.

### Other updates

#### Access group - zone permissions

The on-premises management console Access Group rules won't include the option to grant access to a specific zone. There's no change in defining rules that use sites, regions, and business units.   Following upgrade, Access Groups that contained rules allowing access to specific zones will be modified to allow access to its parent site, including all its zones.

#### Terminology changes

The term asset has been renamed device in the sensor and on-premises management console, reports, and other solution interfaces.
In sensor and on-premises management console Alerts,  the term Manage this Event has been named Remediation Steps.

## Next steps

[Getting started with Defender for IoT](getting-started.md)