---
title: Upgrade the Azure Backup Agent
description: This information explains why you should upgrade the Azure Backup Agent, and where to download the upgrade.
author: v-amallick
ms.service: azure-backup
ms.topic: include
ms.date: 03/03/2020
ms.author: v-amallick
---

## Upgrade the MARS Agent

Versions of the Microsoft Azure Recovery Services (MARS) Agent below 2.0.9083.0 have a dependency on the Azure Access Control service. The MARS Agent is also referred to as the Azure Backup Agent.

In 2018, Microsoft [deprecated the Azure Access Control service](/azure/active-directory/azuread-dev/active-directory-acs-migration). Beginning March 19, 2018, all versions of the MARS Agent below 2.0.9083.0 will experience backup failures. To avoid or resolve backup failures, [upgrade your MARS Agent to the latest version](https://support.microsoft.com/help/4538314/update-for-azure-backup-for-microsoft-azure-recovery-services-agent). To identify servers that require a MARS Agent upgrade, follow the steps in [Upgrade the Microsoft Azure Recovery Services (MARS) agent](../articles/backup/upgrade-mars-agent.md).

The MARS Agent is used to back up files and folders and system state data to Azure. System Center DPM and Azure Backup Server use the MARS Agent to back up data to Azure.
