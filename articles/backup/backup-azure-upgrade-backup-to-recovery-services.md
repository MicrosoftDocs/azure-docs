---
title: Upgrade a Backup vault to a Recovery Services vault (Preview) | Microsoft Docs
description: Commands and support information to upgrade an Azure Backup vault to a Recovery Services vault.
services: backup
documentationcenter: dev-center-name
author: markgalioto
manager: carmonm

ms.assetid: 228fef19-2f6b-4067-acc3-fb6e501afb88
ms.service: required
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 05/22/2017
ms.author: markgal;arunak

---
# Upgrade a Backup vault to a Recovery Services vault

This article explains how to upgrade a Backup vault to a Recovery Services vault. The upgrade process doesn't impact any running backup jobs, and no backup data is lost. The primary reasons to upgrade a Backup vault to a Recovery Services vault:
- All features of a Backup vault are retained in a Recovery Services vault.
- Recovery Services vaults have more features than Backup vaults, including better security, integrated monitoring, faster restores and item-level restores, manage backup items from an improved, simplified portal.
-  New features will only be released for Recovery Services vaults.

## How to upgrade?

There is significant demand for upgrading Backup vaults to Recovery Services vaults. To streamline this process, we are releasing customers into the upgrade queue in batches. To sign up for entry in the upgrade queue, use the appropriate link:
- [upgrade Backup vaults](https://www.surveymonkey.com/r/Y57BJQX)
- [upgrade Site Recovery vaults](https://www.surveymonkey.com/r/5HHPZQN)

## What happens after I sign up?
Once your subscription is whitelisted for upgrade, Microsoft contacts you to proceed with the upgrade. For more information about the upgrade process, see the Azure Backup [blog](http://azure.microsoft.com/blog/upgrade-classic-backup-and-siterecovery-vault-to-arm-recovery-services-vault).
