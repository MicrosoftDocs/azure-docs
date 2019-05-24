---
title: Set up the target environment for disaster recovery of on-premises physical servers to Azure | Microsoft Docs'
description: This article describes how to set up the target Azure environment for disaster recovery of physical servers using Azure Site Recovery.
author: Rajeswari-Mamilla
manager: rochakm
ms.service: site-recovery
ms.topic: conceptual
ms.date: 11/27/2018
ms.author: ramamill
---

# Prepare target (VMware to Azure)

This article describes how to prepare your Azure environment to start replicating physical servers (x64) running Windows or Linux into Azure.

## Prerequisites

The article assumes:
- You have created a Recovery Services Vault to protect your physical servers. You can create a Recovery Services Vault from the [Azure portal](https://portal.azure.com "Azure portal").
- You have [setup your on-premises environment](physical-azure-disaster-recovery.md) to replicate physical servers to Azure.

## Prepare target

After completing the **Step 1:Select Protection goal** and **Step 2:Prepare Source**, you are taken to **Step 3: Target**

![Prepare target](./media/physical-azure-set-up-target/prepare-target-physical-to-azure.png)

1. **Subscription:** From the drop-down menu, select the Subscription that you want to replicate your physical servers to.
2. **Deployment Model:** Select the deployment model (Classic or Resource Manager)

Based on the chosen deployment model, a validation is run to ensure that you have at least one compatible storage account and virtual network in the target subscription to replicate and failover your physical servers to.

Once the validations complete successfully, click OK to go to the next step.

If you don't have a compatible Resource Manager storage account or virtual network, you can create one by clicking the **+ Storage Account** or **+ Network** buttons at the top of the page.

## Next steps
[Configure replication settings](vmware-azure-set-up-replication.md).
