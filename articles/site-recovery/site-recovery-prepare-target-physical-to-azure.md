---
title: 'Prepare target (Physical to Azure) | Microsoft Docs'
description: This article describes how to prepare your Azure environment to start replicating physical servers running Windows or Linux to Azure.
services: site-recovery
documentationcenter: ''
author: bsiva
manager: abhemraj
editor: ''

ms.assetid:
ms.service: site-recovery
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: backup-recovery
ms.date: 5/31/2017
ms.author: bsiva
---

# Prepare target (VMware to Azure)
> [!div class="op_single_selector"]
> * [VMware to Azure](./site-recovery-prepare-target-vmware-to-azure.md)
> * [Physical to Azure](./site-recovery-prepare-target-physical-to-azure.md)

This article describes how to prepare your Azure environment to start replicating physical servers (x64) running Windows or Linux into Azure.

## Prerequisites

The article assumes the following:
- You have created a Recovery Services Vault to protect your physical servers. You can create a Recovery Services Vault from the [Azure portal](http://portal.azure.com "Azure portal").
- You have [setup your on-premises environment](./site-recovery-set-up-physical-to-azure.md) to replicate physical servers to Azure.

## Prepare target

After completing the **Step 1:Select Protection goal** and **Step 2:Prepare Source**, you are taken to **Step 3: Target**

![Prepare target](./media/site-recovery-prepare-target-physical-to-azure/prepare-target-physical-to-azure.png)

1. **Subscription:** From the drop down menu, select the Subscription that you want to replicate your physical servers to.
2. **Deployment Model:** Select the deployment model (Classic or Resource Manager)

Based on the chosen deployment model, a validation is run to ensure that you have at least one compatible storage account and virtual network in the target subscription to replicate and failover your physical servers to.

Once the validations complete successfully, click OK to go to the next step.

If you don't have a compatible Resource Manager storage account or virtual network, or would like to add more, you can do so by clicking the **+ Storage Account** or **+ Network** buttons on the top of the blade.

## Next steps
[Configure replication settings](./site-recovery-setup-replication-settings-vmware.md).
