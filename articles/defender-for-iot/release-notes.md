---
title: What's new in Azure Defender for IoT 
description: This article lets you know what's new in the latest release of Defender for IoT.
ms.topic: overview
ms.date: 04/19/2021
---

# What's new in Azure Defender for IoT?

This article lists new features and feature enhancements for Defender for IoT.

Noted features are in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## April 2021

### Work with automatic threat Intelligence updates (Public Preview)

New threat intelligence packages can now be automatically pushed to cloud connected sensors as they are released by Microsoft Defender for IoT. This is in addition to downloading threat intelligence packages and then uploading them to sensors.

Working with automatic updates helps reduce operational efforts and ensure greater security. 
Enable automatic updating by onboarding your cloud connected sensor on the Defender for IoT portal with the **Automatic Threat Intelligence Updates** toggle turned on.

If you would like to take a more conservative approach to updating your threat intelligence data, you can manually push packages from the Azure Defender for IoT portal to cloud connected sensors only when you feel it is required.
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

The following features were previously available for Public Preview, and are now Generally Available (GA)features:

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

You can now enhance the security of your deployment by adding a second network interface to your on-premises management console. This feature allows your on-premises management to have it’s connected sensors on one secure network, while allowing your users to access the on-premises management console through a second separate network interface.

This feature is available on the on-premises management console with the release of version 10.2.

### Add second network interface to On-premises management console (Public preview)

You can now enhance the security of your deployment by adding a second network interface to your on-premises management console. This feature allows your on-premises management to have it’s connected sensors on one secure network, while allowing your users to access the on-premises management console through a second separate network interface.

This feature is available on the on-premises management console with the release of version 10.2.
### Device builder - new micro agent (Public preview)

A new device builder module is available. The module, referred to as a micro-agent, allows:

- **Integration with Azure IoT Hub and Azure Defender for IoT** - build stronger endpoint security directly into your IoT devices by integrating it with the monitoring option provided by both the Azure IoT Hub and Azure Defender for IoT.
- **Flexible deployment options with support for standard IoT operating systems** - can be deployed either as a binary package or as modifiable source code, with support for standard IoT operating systems like Linux and Azure RTOS.
- **Minimal resource requirements with no OS kernel dependencies** - small footprint, low CPU consumption, and no OS kernel dependencies.
- **Security posture management** – proactively monitor the security posture of your IoT devices.
- **Continuous, real-time IoT/OT threat detection** - detect threats such as botnets, brute force attempts, crypto miners, and suspicious network activity

The deprecated Defender-IoT-micro-agent documentation will be moved to the *Agent-based solution for device builders>Classic* folder.

This feature set is available with the current public preview cloud release.

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
- Perform validation between the on-premises management console and connected sensors, and between a management console and a High Availability management console. Validation is based on expiration dates, root CA authenticity and Certificate Revocation Lists.  If validation fails, the session will not continue.

For upgrades:

- There is no change in SSL certificate or validation functionality during the upgrade.
- After upgrading, sensor and on-premises management console administrative users can replace SSL certificates, or activate SSL certificate validation from the System Settings, SSL Certificate window.  

For Fresh Installations:

- During first-time login, users are required to either use an SSL Certificate (recommended) or a locally generated self-signed certificate (not recommended)
- Certificate validation is turned on by default for fresh installations.

#### Password recovery
  
Sensor and on-premises management console Administrative users can now recover passwords from the Azure Defender for IoT portal. Previously password recovery required intervention by the support team.

### Onboarding

#### On-premises management console - committed devices

Following initial sign-in to the on-premises management console, users are now required to upload an activation file. The file contains the aggregate number of devices to be monitored on the organizational  network. This number is referred to as the number of committed devices.
Committed devices are defined during the onboarding process on the Azure Defender for IoT portal, where the activation file is generated.
First-time users and users upgrading are required to upload the activation file.
After initial activation, the number of devices detected on the network might exceed the number of committed devices. This event might happen, for example, if you connect more sensors to the management console. If there is a discrepancy between the number of detected devices and the number of committed devices, a warning appears in the management console. If this event occurs, you should upload a new activation file.

#### Pricing page options

Pricing page lets you onboard new subscriptions to Azure Defender for IoT and define committed devices in your network.  
Additionally, the Pricing page now lets you manage existing subscriptions associated with a sensor and update device commitment.

#### View and manage onboarded sensors

A new Site and Sensors portal page lets you:

- Add descriptive information about the sensor. For example, a zone associated with the sensor, or free-text tags.
- View and filter sensor information. For example, view details about sensors that are cloud connected or locally managed or view information about sensors in a specific zone.  

### Usability

#### Azure Sentinel new connector page

The Azure Defender for IoT data connector page in Azure Sentinel has been redesigned. The data connector is now based on subscriptions rather than IoT Hubs; allowing customers to better manage their configuration connection to Azure Sentinel.

#### Azure portal permission updates  

Security Reader and Security Administrator support has been added.

### Other updates

#### Access group - zone permissions
  
The on-premises management console Access Group rules will not include the option to grant access to a specific zone. There is no change in defining rules that use sites, regions, and business units.   Following upgrade, Access Groups that contained rules allowing access to specific zones will be modified to allow access to its parent site, including all its zones.

#### Terminology changes

The term asset has been renamed device in the sensor and on-premises management console, reports, and other solution interfaces.
In sensor and on-premises management console Alerts,  the term Manage this Event has been named Remediation Steps.

## Next steps

[Getting started with Defender for IoT](getting-started.md)
