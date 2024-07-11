---
title: Troubleshoot VMware replication appliance health issues in Azure Site Recovery 
description: This article describes troubleshooting replication appliance health issues in Azure Site Recovery. 
author: ankitaduttaMSFT
ms.service: site-recovery
ms.topic: conceptual
ms.author: ankitadutta
ms.date: 07/11/2024

---
# Troubleshoot replication appliance health issues
 

In Azure Site Recovery, an on-premises replication appliance handles disaster recovery for VMware virtual machines. This appliance coordinates communication between your on-premises VMware setup and Azure, ensuring smooth data replication and recovery. 

This article describes how to troubleshoot a replication appliance health issue.

## Before you start

Before you start troubleshooting, ensure that:

- You understand how to [deploy Azure Site Recovery replication appliance - Modernized](./deploy-vmware-azure-replication-appliance-modernized.md).
- Review the [support requirements for Azure Site Recovery replication appliance](./replication-appliance-support-matrix.md).

## Troubleshoot process

If you see replication appliance health as critical, follow these recommendations:

1. Navigate to the [replication appliance](./deploy-vmware-azure-replication-appliance-modernized.md) and log in.
2. Open the Microsoft Appliance configuration manager and ensure to upgrade all the appliance components to the latest version. Find the latest versions [here](./site-recovery-whats-new.md#supported-updates) and follow the upgrade steps [here](./upgrade-mobility-service-modernized.md#upgrade-appliance).
3. Navigate to the **Certificate renewal** section and select **Renew certificate**. This triggers the certificate renewal operation. Wait for it to complete.
   
#### Error

**If you see the following for your web app in replication appliance:**

:::image type="content" source="./media/vmware-troubleshoot-appliance-health-issue/appliance-health.png" alt-text="Screenshot of aplliance health error."lightbox="./media/vmware-troubleshoot-appliance-health-issue/appliance-health.png":::
    
Follow these steps:

1. Open PowerShell.
2. Enter `cd "C:\Program Files\Microsoft Azure Appliance Configuration Manager\Scripts\PowerShell"`.
3. Enter `.\WebBinding.ps1` to complete the process.

## Next steps

If you are still facing issues, contact Microsoft Support for further assistance.