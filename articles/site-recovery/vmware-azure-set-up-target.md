---

title: Prepare the VMware VM replication target in Azure Site Recovery 
description: This article describes how to prepare your target Azure environment for VMware VM replication to Azure.
services: site-recovery
author: mayurigupta13
manager: rochakm
ms.service: site-recovery
ms.topic: article
ms.date: 03/03/2019
ms.author: mayg

---

# Prepare the target environment for disaster recovery of VMware VMs or physical servers to Azure

This article describes how to prepare your target Azure environment to start replicating VMware virtual machines or physical servers to Azure.

## Prerequisites

The article assumes:
- You have created a Recovery Services Vault on [Azure portal](https://portal.azure.com "Azure portal") to protect your source machines
- You have setup your on-premises environment to replicate the source [VMware virtual machines](vmware-azure-set-up-source.md) or [physical servers](physical-azure-set-up-source.md) to 
Azure.

## Prepare target

After completing the **Step 1: Select Protection goal** and **Step 2: Prepare Source**, you are taken to **Step 3: Target**

![Prepare target](./media/vmware-azure-set-up-target/prepare-target-vmware-to-azure.png)

1. **Subscription:** From the drop-down menu, select the Subscription that you want to replicate your virtual machines or physical servers to.
2. **Deployment Model:** Select the deployment model (Classic or Resource Manager)

Based on the chosen deployment model, a validation is run to ensure that you have at least one virtual network in the target subscription to replicate and failover your virtual machine or physical server to.

Once the validations complete successfully, click OK to go to the next step.

If you don't have a virtual network, you can create one by clicking the **+ Network** button at the top of the page.

## Next steps
[Configure replication settings](vmware-azure-set-up-replication.md).
