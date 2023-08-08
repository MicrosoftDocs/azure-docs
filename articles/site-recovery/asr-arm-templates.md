---
title: Azure Resource Manager Templates
description: Azure Resource Manager templates for using Azure Site Recovery features.
services: site-recovery
author: ankitaduttaMSFT
manager: gaggupta
ms.service: site-recovery
ms.topic: article
ms.date: 02/18/2021
ms.author: ankitadutta
ms.custom: engagement-fy23, devx-track-arm-template
---

# Azure Resource Manager templates for Azure Site Recovery

The following table includes links to Azure Resource Manager templates for using Azure Site Recovery features.

| Template | Description |
|---|---|
|**Azure to Azure** | |
| [Create a Recovery Services vault](./quickstart-create-vault-template.md)| Create a Recovery Services vault. The vault can be used for Azure Backup and Azure Site Recovery. |
| [Enable Replication for Azure VMs](https://aka.ms/asr-arm-enable-replication) | Enable replication for Azure VMs using the existing Vault and custom Target Settings.|
| [Trigger Failover and Reprotect](https://aka.ms/asr-arm-failover-reprotect) | Trigger a Failover and Reprotect operation for a set of Azure VMs. |
| [Run an End to End DR Flow for Azure VMs](https://aka.ms/asr-arm-e2e-flow) | Start a complete End to End Disaster Recovery Flow (Enable Replication + Failover and Reprotect + Failback and Reprotect) for Azure VMs, also called as 540° flow.|
|   |   |
