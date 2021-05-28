---
title: Azure Percept Devkit Software Release Note
description: Release note of the Azure Percept Devkit OS/Firmware updates 
author: hschang
ms.author: hschang
ms.service: azure-percept
ms.topic: how-to
ms.date: 05/28/2021
ms.custom: template-how-to
---

# Azure Percept Devkit Software Release Note

**May (2105) release:**
- May security updates to CBL-Mariner OS

**April (2104) release:**
- Fixed log rotation issue that may cause Azure Percept DK storage to get full
- Enabled TPM based provisioning to Azure in Out-Of-The-Box experience (OOBE)
- Added automatic timeout to OOBE and SoftAP after 30 minutes or after OOBE completion
- SoftAP name changed from scz_[xxx] to apd_[xxx]

## Next steps
Update your dev kits via the methods and update packages determined in the previous section.
- [Update your Azure Percept DK over-the-air](https://docs.microsoft.com/azure/azure-percept/how-to-update-over-the-air)
- [Update your Azure Percept DK via USB](https://docs.microsoft.com/azure/azure-percept/how-to-update-via-usb)
