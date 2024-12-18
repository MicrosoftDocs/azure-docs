---
title: Troubleshoot monitoring issues for Azure Backup
description: Learn how to troubleshoot monitoring issues for Azure Backup.
ms.topic: troubleshooting
ms.date: 12/30/2024
ms.service: azure-backup
ms.custom: engagement-fy24
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Troubleshoot monitoring issues for Azure Backup

This article provides troubleshooting steps that help you resolve error massages caused during monitor protection operations for Azure Backup.

## Jobs and/or alerts from the Azure Backup agent don't appear in the Azure portal

**Issue**: Jobs and/or alerts from the Azure Backup agent don't appear in the Azure portal.

**Cause**: The process, ```OBRecoveryServicesManagementAgent```, sends the job and alert data to the Azure Backup service. Occasionally this process can become stuck or shutdown.

**Recommended action**: Open **Task Manager**, and check if the ```OBRecoveryServicesManagementAgent``` process is running. If the process isn't running, open **Control Panel**, and browse the list of services. Start or restart **Microsoft Azure Recovery Services Management Agent**.

For further information, browse the logs at:

```PATH
 <AzureBackup_agent_install_folder>\Microsoft Azure Recovery Services Agent\Temp\GatewayProvider*
```

For example:

```EXAMPLE
 C:\Program Files\Microsoft Azure Recovery Services Agent\Temp\GatewayProvider0.errlog
```

## Best practices for Azure Monitor alerts

Learn [about the best practices for Azure Monitor alerts](/azure/azure-monitor/best-practices-alerts).

## Next steps

[Common questions about backup monitoring alert](backup-azure-monitor-alert-faq.yml)