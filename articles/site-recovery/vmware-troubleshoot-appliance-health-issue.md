---
title: Troubleshoot VMware replication appliance health issues in Azure Site Recovery
description: This article describes troubleshooting replication appliance health issues in Azure Site Recovery.
author: Jeronika-MS
ms.service: azure-site-recovery
ms.topic: concept-article
ms.author: v-gajeronika
ms.reviewer: v-gajeronika
ms.date: 02/12/2026

# Customer intent: As an IT administrator managing VMware environments, I want to troubleshoot replication appliance health issues in my Azure Site Recovery setup so that I can ensure reliable disaster recovery and smooth data replication.
---
# Troubleshoot replication appliance health issues
 

In Azure Site Recovery, an on-premises replication appliance handles disaster recovery for VMware virtual machines. This appliance coordinates communication between your on-premises VMware setup and Azure, ensuring smooth data replication and recovery. 

This article describes how to troubleshoot a replication appliance health issue.

## Before you start

Before you start troubleshooting, make sure that you:

- Understand how to [deploy Azure Site Recovery replication appliance - Modernized](./deploy-vmware-azure-replication-appliance-modernized.md).
- Review the [support requirements for Azure Site Recovery replication appliance](./replication-appliance-support-matrix.md).

## Troubleshoot process

If you see the following error in the appliance health status:

### Troubleshoot certificate renewal

This article describes how to troubleshoot replication appliance health issues in Azure Site Recovery for the following critical replication appliance issues:

| Issue | Error ID |
|-------|----------|
| Process Server | 549009 |
| Proxy server | 549003 |
| Replication service | 549005 |
| Recovery services agent | 549011 |
| Site Recovery provider | 305 |
| Reprotection server | 549007 |

To troubleshoot these issues, follow these steps:

1. Go to the [replication appliance](./deploy-vmware-azure-replication-appliance-modernized.md) and sign in.
1. Open the Microsoft Appliance configuration manager and upgrade all the appliance components to the latest version. Find the latest versions [here](./site-recovery-whats-new.md#supported-updates) and follow the upgrade steps [here](./upgrade-mobility-service-modernized.md#upgrade-appliance).
1. Go to the **Certificate renewal** section and select **Renew certificate**. This action starts the certificate renewal process. Wait for it to finish.

:::image type="content" source="./media/vmware-troubleshoot-appliance-health-issue/certificate.png" alt-text="Screenshot of appliance health error.":::

### Troubleshoot other errors

**If you see the following error for your web app in replication appliance:**

:::image type="content" source="./media/vmware-troubleshoot-appliance-health-issue/appliance-health.png" alt-text="Screenshot of appliance health error excel.":::
    
Follow these steps:

1. Open PowerShell.
1. Enter `cd "C:\Program Files\Microsoft Azure Appliance Configuration Manager\Scripts\PowerShell"`.
1. Enter `.\WebBinding.ps1` to complete the process.

## Next steps

If you're still facing issues, contact Microsoft Support for further assistance.