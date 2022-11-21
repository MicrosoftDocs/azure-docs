---
title: Move an Azure Site Recovery vault to another region
description: Describes how to move a Recovery Services vault (Azure Site Recovery) to another Azure region
services: site-recovery
author: ankitaduttaMSFT
ms.service: site-recovery
ms.topic: tutorial
ms.date: 07/31/2019
ms.author: ankitadutta
ms.custom: MVC
---

# Move a Recovery Services vault and Azure Site Recovery configuration to another Azure region

There are various scenarios in which you might want to move your existing Azure resources from one region to another. Examples are for manageability, governance reasons, or because of company mergers and acquisitions. One of the related resources you might want to move when you move your Azure VMs is the disaster recovery configuration. 

There's no first-class way to move an existing disaster recovery configuration from one region to another. This is because you configured your target region based on your source VM region. When you decide to change the source region, the previously existing configurations of the target region can't be reused and must be reset. This article defines the step-by-step process to reconfigure the disaster recovery setup and move it to a different region.

In this document, you will:

> [!div class="checklist"]
> * Verify prerequisites for the move.
> * Identify the resources that were used by Azure Site Recovery.
> * Disable replication.
> * Delete the resources.
> * Set up Site Recovery based on the new source region for the VMs.

> [!IMPORTANT]
> Currently, there's no first-class way to move a Recovery Services vault and the disaster recovery configuration as is to a different region. This article guides you through the process of disabling replication and setting it up in the new region.

## Prerequisites

- Make sure that you remove and delete the disaster recovery configuration before you try to move the Azure VMs to a different region. 

  > [!NOTE]
  > If your new target region for the Azure VM is the same as the disaster recovery target region, you can use your existing replication configuration and move it. Follow the steps in [Move Azure IaaS VMs to another Azure region](azure-to-azure-tutorial-migrate.md).

- Ensure that you're making an informed decision and that stakeholders are informed. Your VM won't be protected against disasters until the move of the VM is complete.

## Identify the resources that were used by Azure Site Recovery
We recommend that you do this step before you proceed to the next one. It's easier to identify the relevant resources while the VMs are being replicated.

For each Azure VM that's being replicated, go to **Protected Items** > **Replicated Items** > **Properties** and identify the following resources:

- Target resource group
- Cache storage account
- Target storage account (in case of an unmanaged disk-based Azure VM) 
- Target network


## Disable the existing disaster recovery configuration

1. Go to the Recovery Services vault.
2. In **Protected Items** > **Replicated Items**, right-click the machine and select **Disable replication**.
3. Repeat this step for all the VMs that you want to move.

> [!NOTE]
> The mobility service won't be uninstalled from the protected servers. You must uninstall it manually. If you plan to protect the server again, you can skip uninstalling the mobility service.

## Delete the resources

1. Go to the Recovery Services vault.
2. Select **Delete**.
3. Delete all the other resources you [previously identified](#identify-the-resources-that-were-used-by-azure-site-recovery).
 
## Move Azure VMs to the new target region

Follow the steps in these articles based on your requirement to move Azure VMs to the target region:

- [Move Azure VMs to another region](azure-to-azure-tutorial-migrate.md)
- [Move Azure VMs into Availability Zones](move-azure-VMs-AVset-Azone.md)

## Set up Site Recovery based on the new source region for the VMs

Configure disaster recovery for the Azure VMs that were moved to the new region by following the steps in [Set up disaster recovery for Azure VMs](azure-to-azure-tutorial-enable-replication.md).
