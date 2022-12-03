---
title: Azure Percept DK software release notes
description: Information about changes made to the Azure Percept DK software.
author: yvonne-dq
ms.author: hschang
ms.service: azure-percept
ms.topic: conceptual
ms.date: 10/04/2022
ms.custom: template-concept
---

# Azure Percept DK software release notes

[!INCLUDE [Retirement note](./includes/retire.md)]

This page provides information of changes and fixes for each Azure Percept DK OS and firmware release.

To download the update images, refer to [Azure Percept DK software releases for USB cable update](./software-releases-usb-cable-updates.md) or [Azure Percept DK software releases for OTA update](./software-releases-over-the-air-updates.md).

## June (2206) Release

- Operating System
  - Latest security updates on OpenSSL, cifs-utils, zlib, cpio, Nginx, and Lua packages.
  
## May (2205) Release

- Operating System
  - Latest security updates on BIND, Node.js, Cyrus SASL, libxml2, and OpenSSL packages.
  
## March (2203) Release

- Operating System
  - Latest security fixes.
  
## February (2202) Release

- Operating System
  - Latest security updates on vim and expat packages.

## January (2201) Release

- Setup Experience
  - Fixed the compatibility issue with Windows 11 PC during OOBE setup.
- Operating System
  - Latest security updates on vim package.

## November (2111) Release

- Operating System
  - Latest security fixes.
  - Disabled automatic package update.
  - Setup user permission for Azure Percept container to access USB device node.

## September (2109) Release

- Wi-Fi:
  - Use a fixed channel instead of automatic-channel selecting to avoid hostapd.service to constantly retry and restart.
- Setup experience:
  - OOBE server system errors are localized.
  - Enable IPv6 multiple routing tables.
- Operating System
  - Latest security fixes.
  - Nginx service run as a non-root user.


## July (2107) Release

> [!IMPORTANT]
> Due to a code signing change OTA (Over-The-Air) package for this release is only compatible with Azure Percept DK running the 2106 release. For Azure Percept DK users who are currently running older SW release version, Microsoft recommends to perform an update over USB cable or perform an OTA update first to release 2106 before updating to 2107.

- Wi-Fi:
  - Security hardening to ensure the Wi-Fi access point is shut down after setup completes.
  - Fixed an issue where pushing the **Setup** button on the dev kit could cause the dev kit's Wi-Fi access point to be out of sync with the setup experience web service.
  - Enhanced the Wi-Fi access point iptables rules to be more resilient and removed unnecessary rules.
  - Fixed an issue where multiple connected Wi-Fi networks wouldn't be properly prioritized.
- Setup experience:
  - Added localization for supported regions and updated the text for better readability.
  - Fixed an issue where the setup experience would sometimes get stuck on a loading page.
- General networking:
  - Resolved issues with IPv6 not obtaining a valid DHCP lease.
- Operating system:
  - Security fixes.

## June (2106) Release

- Updated image verification mechanism for OTA agent.
- UI improvements and bug fixes to the setup experience.

## May (2105) Release

- Security updates to CBL-Mariner OS.

## April (2104) Release

- Fixed log rotation issue that may cause Azure Percept DK storage to get full.
- Enabled TPM based provisioning to Azure in the setup experience.
- Added an automatic timeout to the setup experience and Wi-Fi access point. After 30 minutes or after the setup experience completion.
- Wi-Fi access point SSID changed from "**scz-[xxx]**" to "**apd-[xxx]**".

## Next steps

- [How to determine your update strategy](./how-to-determine-your-update-strategy.md)
