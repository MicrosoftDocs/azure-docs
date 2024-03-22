---
title: Create protection policy for resources
description: In this article, you'll learn how to create backup and replication policies to protect your resources.
ms.topic: how-to
ms.date: 11/15/2023
ms.service: azure-business-continuity-center
ms.custom:
  - ignite-2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Create backup and replication policies for your resources (preview)

This article describes how to create a backup and replication policy that can be used for backups with Azure Backup and replication with Azure Site Recovery. 

A backup policy defines when backups are taken, and how long they're retained. [Learn more](../backup/guidance-best-practices.md#backup-policy-considerations) on the guidelines when creating a backup policy. 

Replication policy defines the settings for recovery point retention history and app-consistent snapshot frequency. By default, [Site Recovery](../site-recovery/site-recovery-overview.md) creates a new replication policy with default settings of 24 hours for recovery point retention.  

## Prerequisites

- [Review](../backup/guidance-best-practices.md#backup-policy-considerations) the guidelines for creating a backup policy. 

## Create policy

Follow these steps to create a policy: 

1. In the Azure Business Continuity center, select **Protection Policies** under **Manage**.
    :::image type="content" source="./media/backup-protection-policy/protection-policies.png" alt-text="Screenshot showing **Protection Policies** page." lightbox="./media/backup-protection-policy/protection-policies.png":::

1. On the **Protection polices** pane, select **+Create policy**.  
    :::image type="content" source="./media/backup-protection-policy/create-policy.png" alt-text="Screenshot showing **+Create policy** option." lightbox="./media/backup-protection-policy/create-policy.png":::

1. Select the type of policy you want to create. 
    :::image type="content" source="./media/backup-protection-policy/select-policy.png" alt-text="Screenshot showing policy options." lightbox="./media/backup-protection-policy/select-policy.png":::

    >[!NOTE]
    > Based on the selected policy step, specific configuration page opens. For example, if you choose *backup policy* opens **Start: Create Policy** page for Azure Backup. Choosing *replication policy* opens the **Start: Create Policy** page for Azure Site Recovery.
1. Select **Continue** and navigate to the specific configuration page based on the selected policy type and complete the workflow.
    >[!NOTE]
    > It can take a while to create the vault. Monitor the status notifications in the **Notifications** pane at the top of the page.
1. After the vault is created, it appears in the list of vaults in the ABC center. If the vault doesn't appear, select **Refresh**.


## Next steps 

- [Manage protection policies](./manage-protection-policy.md).
- [Configure protection](tutorial-configure-protection-datasource.md).  
