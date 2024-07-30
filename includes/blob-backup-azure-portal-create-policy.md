---
author: AbhishekMallick-MS
ms.service: backup
ms.topic: include
ms.date: 05/30/2024
ms.author: v-abhmallick
---

## Create a backup policy

A backup policy defines the schedule and frequency of the recovery points creation, and its retention duration in the Backup vault. You can use a single backup policy for your vaulted backup, operational backup, or both. You can use the same backup policy to configure backup for multiple storage accounts to a vault.

To create a backup policy, follow these steps:

1. Go to **Backup center** > **Overview**, and then select **+ Policy**.

   :::image type="content" source="./media/blob-backup-azure-portal-create-policy/add-policy.png" alt-text="Screenshot shows how to initiate adding backup policy for vaulted blob backup." lightbox="./media/blob-backup-azure-portal-create-policy/add-policy.png":::

2. On the **Start: Create Policy** page, select the **Datasource type** as **Azure Blobs (Azure Storage)**, and then select **Continue**.

   :::image type="content" source="./media/blob-backup-azure-portal-create-policy/datasource-type-selection-for-vaulted-blob-backup.png" alt-text="Screenshot shows how to select datasource type for vaulted blob backup.":::

3. On the **Create Backup Policy** page, on the **Basics** tab, enter a **Policy name**, and then from **Select vault**, choose a vault you want this policy to be associated.

   :::image type="content" source="./media/blob-backup-azure-portal-create-policy/add-vaulted-backup-policy-name.png" alt-text="Screenshot shows how to add vaulted blob backup policy name.":::

   Review the details of the selected vault in this tab, and then select **Next**.
 
4. On the **Schedule + retention** tab, enter the *backup details* of the data store, schedule, and retention for these data stores, as applicable.

   1. To use the backup policy for vaulted backups, operational backups, or both, select the corresponding checkboxes.
   1. For each data store you selected, add or edit the schedule and retention settings:
      - **Vaulted backups**: Choose the frequency of backups between *daily* and *weekly*, specify the schedule when the backup recovery points need to be created, and then edit the default retention rule (selecting **Edit**) or add new rules to specify the retention of recovery points using a *grandparent-parent-child* notation.
      - **Operational backups**: These are continuous and don't require a schedule. Edit the default rule for operational backups to specify the required retention.

   :::image type="content" source="./media/blob-backup-azure-portal-create-policy/define-vaulted-backup-schedule-and-retention.png" alt-text="Screenshot shows how to configure vaulted blob backup schedule and retention." lightbox="./media/blob-backup-azure-portal-create-policy/define-vaulted-backup-schedule-and-retention.png":::

5. Select **Review + create**.
6. Once the review is successful, select **Create**.