---
title: Moving Azure Site Recovery configuration to another Azure region | Microsoft Docs
description: Guidance for moving Site Recovery configuration to another Azure region
services: site-recovery
author: rajani-janaki-ram
ms.service: site-recovery
ms.topic: tutorial
ms.date: 07/31/2019
ms.author: rajanaki
ms.custom: MVC
---

# Moving Recovery Services vault and  Azure Site Recovery configuration to another Azure region

There are various scenarios in which you'd want to move your existing Azure resources from one region to another - manageability,  governance reasons, or to due to company mergers/ acquisitions etc. One of the related resources you might want to move when you move you Azure VMs is the disaster recovery configuration for the same. There is no first-class way to move an existing disaster recovery configuration from one region to another. This is essentially because you would have configured your target region based on your source VM region, and when you decide to change that, the previously existing configurations of target region cannot be re-used and has to be reset. This article defines the step-by-step process to reconfigure the disaster recovery set-up and move to a different region.

In this document, you will:

> [!div class="checklist"]
> * Verify prerequisites for the move
> * Identify the resources that were used by Azure Site Recovery 
> * Disable replication
> * Delete the resources 
> * Re-set up site recovery based on the new source region for the VMs.

> [!IMPORTANT]
> Currently there is no first class way to move a Recovery Services vault and the DR configuration as is to a different region, this document guides the customer through the process of disabling replication, and resetting it up in the new region.

## Prerequisites

- Make sure that you remove and delete the disaster recovery configuration before you try to move the Azure VMs to a different region. 

> [!NOTE]
> If your new target region for the Azure VM is the same as the  disaster recovery target region, you can use your existing replication configuration and move based on steps mentioned [here](azure-to-azure-tutorial-migrate.md) 

- Ensure that you are making an informed decision and that the stakeholders are informed as your VM will not be protected against disasters till the move of the VM is complete. 

## Identify the resources that were used by Azure Site Recovery
We recommend doing this step before proceeding to the next one since it will be easier to identify the relevant resources while the VMs are still being replicated

For each of the Azure VM that is being replicated, navigate to  **Protected Items** > **Replicated Items**>**Properties** and identify the following resources

- Target resource group
- Cache storage account
- Target storage account  (in case of unmanaged disk-based Azure VM) 
- Target network


## Disable existing disaster recovery configuration

1. Navigate to the **Recovery Services Vault** 
2.  In **Protected Items** > **Replicated Items**, right-click the machine > **Disable replication**.
3. Repeat this for all the VMs that you want to move.
> [!NOTE]
> mobility service will not be uninstalled from the protected servers, you need to uninstall it manually. If you plan to protect the server again, you can skip uninstalling the mobility service.

## Delete the resources

1. Go Navigate to the **Recovery Services Vault**
2. Click on **Delete**
3. Proceed to deleting all the other resources identified under the[ previous step](#identify-the-resources-that-were-used-by-azure-site-recovery)
 
## Move Azure VMs to the new target region

Follow the steps mentioned below based on your requirement to move Azure VMs to the target region.

- [Move Azure VMs to another region](azure-to-azure-tutorial-migrate.md)
- [Move Azure VMs into Availability Zones](move-azure-VMs-AVset-Azone.md)

## Re-set up Site Recovery based on the new source region for the VMs

Configure disaster recovery for the Azure VMs that have been moved to the new region using steps mentioned [here](azure-to-azure-tutorial-enable-replication.md)
