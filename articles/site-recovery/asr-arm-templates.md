---
title: Azure Resource Manager Templates
description: Azure Resource Manager templates for using Azure Site Recovery features.
services: site-recovery
author: Jeronika-MS
ms.service: azure-site-recovery
ms.topic: sample
ms.date: 02/11/2026
ms.author: v-gajeronika
ms.reviewer: v-gajeronika
ms.custom: engagement-fy23, devx-track-arm-template
# Customer intent: "As a cloud administrator, I want to utilize Azure Resource Manager templates for configuring Azure Site Recovery, so that I can efficiently manage disaster recovery processes for my Azure virtual machines."
---

# Azure Resource Manager templates for Azure Site Recovery

The following table includes links to Azure Resource Manager templates for using Azure Site Recovery features.

| Template | Description |
|---|---|
|**Azure to Azure** | |
| [Create a Recovery Services vault](./quickstart-create-vault-template.md)| Create a Recovery Services vault. Use the vault for Azure Backup and Azure Site Recovery. |
| [Enable Replication for Azure VMs](https://aka.ms/asr-arm-enable-replication) | Enable replication for Azure VMs by using the existing vault and custom target settings.|
| [Trigger Failover and Reprotect](https://aka.ms/asr-arm-failover-reprotect) | Trigger a failover and reprotect operation for a set of Azure VMs. |
| [Run an End to End DR Flow for Azure VMs](https://aka.ms/asr-arm-e2e-flow) | Start a complete end-to-end disaster recovery flow (Enable Replication + Failover and Reprotect + Failback and Reprotect) for Azure VMs, also called as 540° flow.|
|   |   |
