---
title: What's new in Azure Defender for IoT 
description: This article lets you know what's new in the latest release of Defender for IoT.
 
services: defender-for-iot
ms.service: defender-for-iot
documentationcenter: na
author: shhazam-ms
manager: rkarlin
editor: ''

ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/03/2021
ms.author: shhazam
---

# What's new

Defender for IoT 10.0 provides feature enhancements that improve security, management, and usability.

## Security

Certificate and password recovery enhancements were made for this release.

### Certificates
  
This version lets you:

- Upload SSL certificates directly to the sensors and on-premises management consoles.
- Perform validation between the on-premises management console and connected sensors, and between a management console and a High Availability management console. Validation is based on expiration dates, root CA authenticity and Certificate Revocation Lists.  If validation fails, the session will not continue.

For upgrades:

- There is no change in SSL certificate or validation functionality during the upgrade.
- After upgrading, sensor and on-premises management console administrative users can replace SSL certificates, or activate SSL certificate validation from the System Settings, SSL Certificate window.  

For Fresh Installations:

- During first-time login, users are required to either use an SSL Certificate (recommended) or a locally generated self-signed certificate (not recommended)
- Certificate validation is turned on by default for fresh installations.

### Password recovery
  
Sensor and on-premises management console Administrative users can now recover passwords from the Azure Defender for IoT portal. Previously password recovery required intervention by the support team.

## Onboarding

### On-premises management console - committed devices

Following initial sign-in to the on-premises management console, users are now required to upload an activation file. The file contains the aggregate number of devices to be monitored on the organizational  network. This number is referred to as the number of committed devices.
Committed devices are defined during the onboarding process on the Azure Defender for IoT portal, where the activation file is generated.
First-time users and users upgrading are required to upload the activation file.
After initial activation, the number of devices detected on the network might exceed the number of committed devices. This event might happen, for example, if you connect more sensors to the management console. If there is a discrepancy between the number of detected devices and the number of committed devices, a warning appears in the management console. If this event occurs, you should upload a new activation file.

### Pricing page options

Pricing page lets you onboard new subscriptions to Azure Defender for IoT and define committed devices in your network.  
Additionally, the Pricing page now lets you manage existing subscriptions associated with a sensor and update device commitment.

### View and manage onboarded sensors

A new Site and Sensors portal page lets you:

- Add descriptive information about the sensor. For example, a zone associated with the sensor, or free-text tags.
- View and filter sensor information. For example, view details about sensors that are cloud connected or locally managed or view information about sensors in a specific zone.  

## Usability

### Azure Sentinel new connector page

The Azure Defender for IoT data connector page in Azure Sentinel has been redesigned. The data connector is now based on subscriptions rather than IoT Hubs; allowing customers to better manage their configuration connection to Azure Sentinel.

### Azure portal permission updates  

Security Reader and Security Administrator support has been added.

## Other updates

### Access group - zone permissions
  
The on-premises management console Access Group rules will not include the option to grant access to a specific zone. There is no change in defining rules that use sites, regions, and business units.   Following upgrade, Access Groups that contained rules allowing access to specific zones will be modified to allow access to its parent site, including all its zones.

### Terminology changes

The term asset has been renamed device in the sensor and on-premises management console, reports and other solution interfaces.
In sensor and on-premises management console Alerts,  the term Manage this Event has been named Remediation Steps.

## Next steps

[Getting started with Defender for IoT](getting-started.md)
