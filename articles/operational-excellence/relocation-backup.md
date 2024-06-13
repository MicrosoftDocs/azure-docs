---
title: Relocate Azure Recovery Vault to another region
description: This article offers guidance on relocating Azure Recovery Vault to another region.
author: anaharris-ms
ms.service: backup
ms.topic:  how-to
ms.date: 06/13/2024
ms.author:  naharris
ms.custom: subject-relocation
# Customer intent: As ant administrator, I want to relocate Azure Backup to another region.
---

# Relocate Azure Recovery Vault (ARV) to another region

This article covers relocation guidance for [Azure Recovery Vault](../backup/backup-overview.md) across regions.

Redeploy of Recovery Service vault and reconfigure the backup for resources to another region Recovery Service vault using below mechanism:

The Azure Recovery Vault platform includes the following services:

- [Backup Services](../backup/backup-overview.md)
- [Site Recovery Services](../site-recovery/site-recovery-overview.md)

While Azure Backup doesn’t support the movement of backup data from one Recovery Services vault to another across regions, you can redeploy ecovery Service vault and reconfigure the backup for resources to another region.


If you want to move an Azure Recovery Service Vault that doesn't have any client specific data/backup and the instance itself can be moved alone, simply redeploy the Storage Account using [IAC - Microsoft.RecoveryServices vaults](/azure/templates/microsoft.recoveryservices/vaults?tabs=json&pivots=deployment-language-arm-template).

Otherwise, continue to follow the guidelines in this article.

## Prerequisites

- Copy the following list of internal resources or settings of ARV.
    - Network firewall reconfiguration
    - Alert Notification.
    - Move workbook if configured
    - Diagnostic settings reconfiguration
- List all Recovery Service Vault dependent resources.
- Whether the VM is moved with the vault or not, you can always restore the VM from the retained backup history in the vault.
- Copy the backup VM configuration metadata to validate once the relocation complete.
- Confirm that all services and features that are in use by source RSV are supported in the target region.


## Prepare



