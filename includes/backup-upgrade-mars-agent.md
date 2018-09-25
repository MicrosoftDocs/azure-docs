---
title: Upgrade the Azure Backup agent
description: This information explains why you should upgrade the Azure Backup agent, and where to download the upgrade.
services: backup
cloud: 
suite: 
author: markgalioto
manager: carmonm

ms.service: backup
ms.tgt_pltfrm: <optional>
ms.devlang: <optional>
ms.topic: article
ms.date: 8/29/2018
ms.author: markgal
---

## Upgrade the MARS agent

Versions of the Microsoft Azure Recovery Service (MARS) agent below 2.0.9083.0 have a dependency on the Azure Access Control service (ACS). The MARS agent is also referred to as the Azure Backup agent. In 2018, Azure [deprecated the Azure Access Control service (ACS)](../articles/active-directory/develop/active-directory-acs-migration.md). Beginning March 19, 2018, all versions of the MARS agent below 2.0.9083.0 will experience backup failures. To avoid or resolve backup failures, [upgrade your MARS agent to the latest version](https://go.microsoft.com/fwlink/?linkid=229525). To identify servers that require a MARS agent upgrade, follow the steps in the [Backup blog for upgrading MARS agents](https://blogs.technet.microsoft.com/srinathv/2018/01/17/updating-azure-backup-agents/). The MARS agent is used to back up files and folders, and system state data to Azure. System Center DPM and Azure Backup Server use the MARS agent to back up data to Azure.
