---
title: Tutorial - Manage your resiliency estate efficiently using Resiliency in Azure Copilot
description: In this tutorial, learn how to manage your resiliency estate efficiently using Resiliency Copilot
ms.topic: how-to
ms.date: 11/19/2025
ms.service: resiliency
ms.custom:
  - ignite-2024
author: AbhishekMallick-MS
ms.author: v-mallicka
---

# Tutorial: Manage the resiliency estate using Copilot

This article describes how to use Resiliency in Azure Copilot to make your resiliency journey seamless. 

[!INCLUDE [Resiliency rebranding announcement updates.](../../includes/resiliency-announcement.md)]

>[!Note]
>Current service URLs in Copilot interactions still reference Business Continuity Center. These URLs will migrate soon to Resiliency.

## What is Resiliency Copilot? 

The Resiliency Copilot feature assists you to protect and recover your resources. The key use cases for the Resiliency Copilot are prioritized by the four resiliency pillars:

- Protection management 
- Ransomware protection 
- Monitoring and reporting 
- Learn and get help on capabilities

With Resiliency Copilot, you can check for the protection status of your Azure resources in the Azure portal using natural language directly. The Copilot retrieves information about your resources and their protection status and guides you through the relevant processes.

## Sample prompts 

The following table lists the supported prompts:

| Category | Prompts |
| --- | --- |
| **Security** | - How many vaults are in poor security level? <br> - Show security level of all the vaults. <br> - How can I increase the security level of a vault?  |
| **Management** | - Show the resiliency real estate across all the subscriptions. <br> - Show the datasources that aren't protected in `XXX` regions. <br> - Show me a list of all datasources that are protected using Azure Site Recovery only. |
| **Monitoring** | - Which data sources don't have Recovery Points (RP) in the last seven days? <br> - How many backup jobs failed in the last 12 hours? <br> - Retrigger backup for all failed backup jobs in the last 24 hours. |

## View the resiliency real estate across all the subscriptions

Ask Copilot for Resiliency in Azure to get information on your resource protection with prompts such as **Show the resiliency real estate across all the subscriptions.**

Copilot provides a summary of resources based on the protection status and generates an Azure Resource Graph (ARG) query that you can run directly to fetch granular information. Additionally, you can export the data as a CSV file from the ARG Query Explorer page.

:::image type="content" source="./media/tutorial-manage-data-using-copilot/show-business-continuity-disaster-recovery-real-estate-prompt.png" alt-text="Screenshot shows the Copilot prompt." lightbox="./media/tutorial-manage-data-using-copilot/show-business-continuity-disaster-recovery-real-estate-prompt.png":::

:::image type="content" source="./media/tutorial-manage-data-using-copilot/show-business-continuity-disaster-recovery-real-estate-result.png" alt-text="Screenshot shows the Copilot resiliency estate result." lightbox="./media/tutorial-manage-data-using-copilot/show-business-continuity-disaster-recovery-real-estate-result.png":::

## Enhance protection for the resources

Copilot also helps you to improve resilience by enhancing the protection of existing resources. With this feature, you can enable protection using multiple available solutions.

>[!Note]
> This feature is available for Azure VMs only.

To enhance protection of your resources, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), select **Copilot**, and then use the prompt **Show the running Virtual Machines**.

2. On **Select resources**, choose your virtual machine, and then click **Select**.

   :::image type="content" source="./media/tutorial-manage-data-using-copilot/enhance-protection-select-item.png" alt-text="Screenshot shows how to enhance protection using the Copilot." lightbox="./media/tutorial-manage-data-using-copilot/enhance-protection-select-item.png":::

3. On the selected *VM* blade, Copilot shows the current solution with which the Virtual Machine (VM) is protected. Select **Enhance Protection** to proceed with protection enhancement. 

    Copilot redirects to the blade from where you can configure protection with other solutions.

   :::image type="content" source="./media/tutorial-manage-data-using-copilot/enhance-protection-select-solution.png" alt-text="Screenshot shows the current protection details." lightbox="./media/tutorial-manage-data-using-copilot/enhance-protection-select-solution.png":::

   The specific solution blade appears where you can configure backup or disaster recovery.

   :::image type="content" source="./media/tutorial-manage-data-using-copilot/enhance-protection-configure-solution.png" alt-text="Screenshot shows how to configure solution." lightbox="./media/tutorial-manage-data-using-copilot/enhance-protection-configure-solution.png":::

### View the security level

You can ask Copilot for a summary of your security posture and get guidance to enhance the security. 

To view the security level of resources on **Copilot**, use the prompt **Show security level for all datasources.** Copilot provides a summary of the number of datasources based on their security levels.

You can also run an ARG query to fetch more details or download the data as a CSV file.

:::image type="content" source="./media/tutorial-manage-data-using-copilot/view-security-level.png" alt-text="Screenshot shows the security levels for datasource." lightbox="./media/tutorial-manage-data-using-copilot/view-security-level.png":::

### Increase the security configuration

You can also ask Copilot to help enhance your security posture. 

To increase the security configuration, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), on **Copilot**, use the prompt **Increase security level for vault.** Copilot provides a series of steps to enable various security features.

2. On **Select resources**, choose a vault, either a **Recovery Services vault** or a **Backup vault**, and then click **Select**.

   :::image type="content" source="./media/tutorial-manage-data-using-copilot/change-security-level-select-vault.png" alt-text="Screenshot shows how to select a vault." lightbox="./media/tutorial-manage-data-using-copilot/change-security-level-select-vault.png":::

3. Review the current security level, and then use Copilot to choose the required target level.

   :::image type="content" source="./media/tutorial-manage-data-using-copilot/change-security-level-view-vault-security-level.png" alt-text="Screenshot shows the vault security level." lightbox="./media/tutorial-manage-data-using-copilot/change-security-level-view-vault-security-level.png":::

4. Choose the way you want to proceed, through the Azure portal or CLI tools.

   If you select **Command tools (PowerShell/CLI)**, Copilot provides the script for download from the Azure portal  to modify the security levels.

   :::image type="content" source="./media/tutorial-manage-data-using-copilot/change-security-level-select-tool.png" alt-text="Screenshot shows the tools available to change security level." lightbox="./media/tutorial-manage-data-using-copilot/change-security-level-select-tool.png":::

   Copilot lists through each security feature and tries to update it so that the desired security level is reached. Select the required options to increase the security levels.

   :::image type="content" source="./media/tutorial-manage-data-using-copilot/change-security-level-soft-delete-immutability.png" alt-text="Screenshot shows the soft-delete and immutability changes." lightbox="./media/tutorial-manage-data-using-copilot/change-security-level-soft-delete-immutability.png":::

   :::image type="content" source="./media/tutorial-manage-data-using-copilot/change-security-level-multi-user-authorization.png" alt-text="Screenshot shows the Multi-user Authorization changes." lightbox="./media/tutorial-manage-data-using-copilot/change-security-level-multi-user-authorization.png":::

   Some security features, such as **Multi-user authorization**, require more manual intervention. Copilot provides the process to modify the security settings.

   :::image type="content" source="./media/tutorial-manage-data-using-copilot/change-security-level-soft-delete-multi-user-authorization.png" alt-text="Screenshot shows the soft delete and Multi-user Authorization changes." lightbox="./media/tutorial-manage-data-using-copilot/change-security-level-soft-delete-multi-user-authorization.png":::

## Trigger backup for resources

Copilot can help you get a list of datasources that don’t have any Recovery Point in a specified duration. This feature helps to monitor any backup failures and maintain service level agreement (SLA) for recovery.

To trigger an on-demand backup for resources, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), on **Copilot**, trigger a query to check for resources that don't have Recovery Point by using the prompt **How many datasources don’t have Recovery Point in the last 7 days.** 

   Copilot shows a list of such resources and the ARG query to fetch more details.

     :::image type="content" source="./media/tutorial-manage-data-using-copilot/view-recovery-point.png" alt-text="Screenshot shows the items with no recovery points." lightbox="./media/tutorial-manage-data-using-copilot/view-recovery-point.png":::

2. Resiliency Copilot also provides a PowerShell script for download from the Azure portal to trigger backups on all such resources.

   To trigger an on-demand backup, select **Yes** on the further prompt.

   :::image type="content" source="./media/tutorial-manage-data-using-copilot/trigger-backup-for-recovery-point.png" alt-text="Screenshot shows the Copilot prompts to trigger backup." lightbox="./media/tutorial-manage-data-using-copilot/trigger-backup-for-recovery-point.png":::

   The following screenshots show, the scripts to fetch the list of failed backup jobs and to trigger backups for them.

     :::image type="content" source="./media/tutorial-manage-data-using-copilot/trigger-backup-script.png" alt-text="Screenshot shows the script to trigger backup." lightbox="./media/tutorial-manage-data-using-copilot/trigger-backup-script.png":::

     :::image type="content" source="./media/tutorial-manage-data-using-copilot/trigger-backup-script-for-failed-jobs.png" alt-text="Screenshot shows the script to trigger backup on failed jobs." lightbox="./media/tutorial-manage-data-using-copilot/trigger-backup-script-for-failed-jobs.png":::

   You can also fetch a list of failed backup jobs in a given time period.

     :::image type="content" source="./media/tutorial-manage-data-using-copilot/view-failed-jobs-script.png" alt-text="Screenshot shows the script to view failed jobs." lightbox="./media/tutorial-manage-data-using-copilot/view-failed-jobs-script.png":::

## Increase security level of Recovery Service vault and Backup vault

Resiliency in Azure Copilot provides the option to enhance the security level of the vault. You can find this option on the vault pane.

To increase the vault's security level, follow these steps:

1. Go to the vault for which you want to increase the security level, and then select **Increase security level of this vault**.

   The **Copilot** pane opens on which you can interact with Copilot to do the required security enhancements.

   In the following screenshot, Copilot shows the vault's current security level and suggests the next level (Poor to Fair, Fair to Good, or Good to Excellent) along with recommended steps to upgrade it.

   :::image type="content" source="./media/tutorial-manage-data-using-copilot/increase-security-level.png" alt-text="Screenshot shows the Copilot option to increase security level of the vault." lightbox="./media/tutorial-manage-data-using-copilot/increase-security-level.png":::

1. After you select the required security level (for example, **Good**), copilot asks to choose the preferred execution option - **Portal** or **Command tools (PowerShell/CLI)**.

   :::image type="content" source="./media/tutorial-manage-data-using-copilot/execution-options.png" alt-text="Screenshot shows the execution options in the Copilot pane." lightbox="./media/tutorial-manage-data-using-copilot/execution-options.png":::

1. To use the Azure portal for security enhancement, select **Portal**. This selection guides you with the options to enhance [Soft delete](../backup/backup-azure-security-feature-cloud.md), [Immutability](../backup/backup-azure-immutable-vault-concept.md), and [Multi-user authorization (MUA)](../backup/multi-user-authorization-concept.md) settings.

   The **Command tools (PowerShell/CLI)** allows you to enable vault security features via command lines, with Copilot offering sample commands for activation.

1. After you update the vault security level using Copilot, select **View properties** to check the updated values.

   :::image type="content" source="./media/tutorial-manage-data-using-copilot/view-properties.png" alt-text="Screenshot shows the option to view the updated security enhancement for the vault." lightbox="./media/tutorial-manage-data-using-copilot/view-properties.png":::

## Analyze job failures for Recovery Service vault and Backup vault

The vault page also provides the Resiliency in Azure Copilot feature to analyze the job failures for the selected vault. 

To check the failed jobs, follow these steps:

1. Go to the vault for which you want to review the failed jobs, and then select **Show job failures for this vault**.

   The **Copilot** pane opens with the prompt to view the impacted resources.

   :::image type="content" source="./media/tutorial-manage-data-using-copilot/view-impacted-resources.png" alt-text="Screenshot shows how to view the impacted resources using Copilot." lightbox="./media/tutorial-manage-data-using-copilot/view-impacted-resources.png":::

1. Select **Yes**.

   The **Select resources** pane opens with a summary of the top failed jobs from the last **24 hours** for the backup items, and then prompts to select the impacted resource to further analyze the error and check for recommended actions from Copilot.

1. Choose the affected resource from the list, and then click **Select**.

   :::image type="content" source="./media/tutorial-manage-data-using-copilot/impacted-resources.png" alt-text="Screenshot shows the impacted resources that you can fix." lightbox="./media/tutorial-manage-data-using-copilot/impacted-resources.png":::

1. On the **Copilot** pane, select **Open Backup Item** to view the error code descriptions and recommendations with guided steps to fix issues.

   :::image type="content" source="./media/tutorial-manage-data-using-copilot/view-backup-item.png" alt-text="Screenshot shows the option to view the backup item of the selected resource." lightbox="./media/tutorial-manage-data-using-copilot/view-backup-item.png":::

   :::image type="content" source="./media/tutorial-manage-data-using-copilot/view-error-code.png" alt-text="Screenshot shows the error code and recommended action for resolution." lightbox="./media/tutorial-manage-data-using-copilot/view-error-code.png":::

## Configure protection for resources in Recovery Services vault and Backup vault

Resiliency in Azure Copilot allows you to seamlessly configure protection for unprotected resources in a supported Backup or Recovery Services vault.

To configure protection for resources in a vault, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to the specific vault, and then select **Copilot**.
1. On the **Copilot** pane, use the prompt **Show me the resources that can be protected in this vault**.

   :::image type="content" source="./media/tutorial-manage-data-using-copilot/find-resources-for-protection.png" alt-text="Screenshot shows how to search for resources to protect in a vault using Copilot." lightbox="./media/tutorial-manage-data-using-copilot/find-resources-for-protection.png":::

1. From the list of unprotected resources, select the resource for configuring protection, and then select **Configure backup**.
1. On the **Configure Backup** pane, on the **Backup policy** tab, under **Backup policy**, select the policy you want to use for data retention.
1. On the **Datasources** tab, select **Add**.
1. On the **Select resources to backup** pane, select the resource that needs to be backed up.

   >[!Note]
   >You can select only one resource at a time backup configuration.

1. On the **Datasources** tab, select the **Snapshot resource group**, and then select **validate**.
1. On the **Review + configure** tab, review the configuration details, and then select **Configure Backup**.

## Create a  backup vault using Resiliency Copilot

Resiliency Copilot enables you to make informed decisions when setting up backup vaults. During vault creation, Copilot recommends enabling Cross Region Restore and Immutability, the essential features for ensuring resiliency and protecting against ransomware threats. The “Create Backup Vault” prompt provides intelligent defaults based on your most-used subscriptions and regions, helping maintain backup availability across regions while safeguarding data from deletion or modification. Additionally, Copilot simplifies vault configuration by suggesting frequently used values for subscription, resource group, and region, which you can easily adjust to meet your requirements.

To create a Backup vault using Resiliency Copilot, follow these steps:

1. Go to **Resiliency** > **Manage** > **Vaults**.

1. On the **Vaults** pane, select **+ Vault**.

1. On the **Start: Create Vault** pane, Select **Backup vault** as the **Vault Type**, and then select **Continue**.

1. On the **Create Backup Vault** pane, select **Help me create a vault**.

   :::image type="content" source="./media/tutorial-manage-data-using-copilot/select-vault-subscription.png" alt-text="Screenshot shows how to start creating vault using Copilot." lightbox="./media/tutorial-manage-data-using-copilot/select-vault-subscription.png":::

1. On the **Copilot** pane, the frequently used subscription appears. To use the suggested subscription, select **Continue**.

   For choosing a different subscription, click **Select Subscription**, select a subscription from the dropdown, and then select **Submit**.

1. After the subscription applies, apply the suggested resource group by selecting **Continue**.

    To select a different resource group, click **Select Resource Group**, select a resource group from the dropdown, and then select **Submit**.

   :::image type="content" source="./media/tutorial-manage-data-using-copilot/select-vault-resource-group.png" alt-text="Screenshot shows how to apply resource group using Copilot for vault creation." lightbox="./media/tutorial-manage-data-using-copilot/select-vault-resource-group.png":::


1. After the resource group applies successfully, apply the suggested vault name, and then select **Submit.

   To modify the suggested vault name, on the **Create Backup Vault** pane, on the **Basics** tab, enter a **Backup vault name**.

1. On the **Copilot** pane,  apply the suggested region by selecting **Continue**.

   To select a different region, click **Select Region** to choose a region from the dropdown, and then select **Submit**.

1. To set the redundancy type, on the **Copilot** pane, select an appropriate redundancy option from the list, and then select **Submit**.

   :::image type="content" source="./media/tutorial-manage-data-using-copilot/select-vault-redundancy-type.png" alt-text="Screenshot shows how to apply vault redundancy type using Copilot for vault creation." lightbox="./media/tutorial-manage-data-using-copilot/select-vault-redundancy-type.png":::

1. Select **Continue to Vault Properties tab** to configure the required security, managed identity, encryption, and restore settings.

   :::image type="content" source="./media/tutorial-manage-data-using-copilot/set-vault-properties.png" alt-text="Screenshot shows how to apply vault properties using Copilot for vault creation." lightbox="./media/tutorial-manage-data-using-copilot/set-vault-properties.png":::

1. After configuring the **Vault Properties**, select **Go to Review + create tab**.

1. On the **Review + create** tab, select **Create** to start creating the vault.

## Copy a Backup vault to another region using Resiliency Copilot

Resiliency in Azure now enables you to easily copy vault configurations across regions. With the integrated Copilot solution, this process is streamlined and automated, providing greater simplicity, consistency, and reliability when managing Backup vaults; thus eliminates the need for manual reconfiguration in the target region.

To copy a Backup vault to another region, follow these steps:

1. Go to **Resiliency** > **Manage** > **Vaults**.

1. On the **Vaults** pane, select **+ Vault**.

1. On the **Start: Create Vault** pane, Select **Backup vault** as the **Vault Type**, and then select **Continue**.

1. On the**Create Backup Vault** pane, select **Help me copy an existing vault settings**.

   :::image type="content" source="./media/tutorial-manage-data-using-copilot/copy-vault-settings.png" alt-text="Screenshot shows how to start copying vault using Copilot." lightbox="./media/tutorial-manage-data-using-copilot/copy-vault-settings.png":::

1. On the **Copilot** pane, a vault from the frequently used region appears. To use the suggested vault to copy the settings, select **Continue**.

   For choosing a vault from a different region, click **Select Region**, select a region from the dropdown, and then select **Confirm**.

1. After the vault settings copy successfully, on the **Copilot** pane, enter a **Backup vault name**, and then select **Submit**.
1. On the**Create Backup Vault** pane, on the **Basics** tab, select an alternate **Region** from the dropdown.

   :::image type="content" source="./media/tutorial-manage-data-using-copilot/select-alternate-region.png" alt-text="Screenshot shows how to select an alternate region for the vault creation." lightbox="./media/tutorial-manage-data-using-copilot/select-alternate-region.png":::

   A few vault properties, such as monitoring settings and Multi-user authorization, don't get copied during vault creation. You can configure these **Vault Properties** after the vault creation is complete.

1. On the **Copilot** pane, select **Go to create Vault**.
1. On the **Review + create** tab, select **Create** to start copying the vault to alternate region.

   :::image type="content" source="./media/tutorial-manage-data-using-copilot/create-copy-vault.png" alt-text="Screenshot shows how to start copying vault to an alternate region." lightbox="./media/tutorial-manage-data-using-copilot/create-copy-vault.png":::

## Delete Recovery Services vault and Backup vault using Copilot 

Resiliency Copilot allows you to initiate and automate vault deletion operation from the **delete vault** page.

To delete a vault using Copilot, follow these steps:

1. In the [Azure portal](https://portal.azure.com/), go to the specific vault, and then select **Copilot**.
1. On the **Copilot** pane, use the prompt **Help me delete this vault**.

   Copilot then performs the following actions:

   - Identifies all backup and replicated items linked to the vault, removing the need for manual dependency checks.
   - Reviews the vault properties (such as private endpoint status) to offer tailored recommendations.
   - Checks for the Soft Delete state. If enabled, Copilot provides the option to disable the security feature.

     >[!Note]
     >If Soft Delete is set to **Enabled with always on**, vault deletion can't proceed.

   After all the conditions suggested by Copilot are addressed, Copilot provides the PowerShell script for download to delete the vault. 
1. Select **Yes** to download, and then run the script to delete the vault.

   :::image type="content" source="./media/tutorial-manage-data-using-copilot/download-delete-vault-script.png" alt-text="Screenshot shows the option to download the vault deletion script from Copilot.":::

## Troubleshoot error codes for Recovery service vaults and Backup vaults 

You can use Copilot to troubleshoot the job failures associated with a Recovery Services vault or a Backup vault.

To troubleshoot the error codes, follow these steps:

1. Go to the vault > **Backup jobs**.

   The **Backup jobs** pane opens with the list of jobs and their status. You can further analyze the job failures for the vault.

1. Filter by resource type, and then select the failed job to open the job details or properties pane for troubleshooting steps based on the error code.

   In the following screenshot, the job details show the cause of the error and Copilot provides the options to troubleshoot the error.

   :::image type="content" source="./media/tutorial-manage-data-using-copilot/troubleshoot-error.png" alt-text="Screenshot shows the cause of the error and the options to troubleshoot." lightbox="./media/tutorial-manage-data-using-copilot/troubleshoot-error.png":::




