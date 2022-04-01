---
title: How to deploy updates and track results in Update management center (Preview).
description: The article details how to use Update management center (Preview) in the Azure portal to deploy updates and view results for supported machines.
ms.service: update-management-center
ms.date: 09/02/2021
ms.topic: conceptual
author: SGSneha
ms.author: v-ssudhir
ms.custom: references_regions
---

# Deploy updates and track results with update management center (Preview)

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

The article describes how to perform an update deployment and review the results after the deployment is complete with update management center (preview) in Azure.  

## Supported regions

Update management center (preview) is available in all [Azure public regions](support-matrix.md#supported-regions). 

## Install updates

To create a new update deployment, perform the following steps.

1. Sign in to the [Azure portal](https://portal.azure.com)
1. In **Update management center (Preview)**, **Overview**, choose your **Subscription** and select **One-time update** to install updates.
   :::image type="content" source="./media/deploy-updates/install-updates-now-inline.png" alt-text="Example on installing one-time updates." lightbox="./media/deploy-updates/install-updates-now-expanded.png":::

    Alternatively, you can go to **Machines**, choose your machine(s) and select **One-time update** to perform the same update.

   :::image type="content" source="./media/deploy-updates/one-time-updates-machines-tab-inline.png" alt-text="Example on installing one-time updates from Machines tab." lightbox="./media/deploy-updates/one-time-updates-machines-tab-expanded.png":::

1. In **Install one-time updates**, select the resources and machines to install the updates.
1. In **Machines**, select **+Add machine** to add machines that were previously not selected and click **Add**.
1. In **Updates**, specify the updates to include in the deployment. For each product, select or deselect all supported update classifications and specify the ones to include in your update deployment. If your deployment is meant to apply only for a select set of updates, it's necessary to deselect all the pre-selected update classifications when configuring the **Inclusion/exclusion** updates described below. This ensures only the updates you've specified to include in this deployment are installed on the target machine.

> [!NOTE]
> Selected Updates shows a preview of OS updates which may be installed based on the last OS update assessment information available. If the OS update assessment information in update Center Management (Preview) is obsolete, the actual updates installed would vary. Especially if you have chosen to install specific update category, where the OS updates applicable may vary as new packages or KB Ids may be available for the category.

   - Select **+Include update classification**, in the **Include update classification** select the appropriate classification(s) that must be installed on your machines.
   
    :::image type="content" source="./media/deploy-updates/include-update-classification-inline.png" alt-text="Screenshot on including update classification." lightbox="./media/deploy-updates/include-update-classification-expanded.png":::
   
   - Select **Include KB ID/package** to include in the updates. enter a comma separated list of Knowledge Base article ID numbers to include or exclude for Windows updates. For example,  `3103696, 3134815`. For Windows, you can refer to [MSRC link](https://msrc.microsoft.com/update-guide/deployments) to get the details of latest Knowledge Base released. For supported Linux distros, you specify a comma separated list of packages by the package name, and you can include wildcards. For example, `kernel*, glibc, libc=1.0.1`. Based on the options specified, update management center (preview) shows a preview of OS updates under the **Selected Updates** section.

   - To exclude updates that you don't want to install, select **Exclude KB ID/package**. We recommend to check this option because updates that are not displayed here might be installed as newer updates might be available.
   
   - To ensure that the updates published are on or before a specific date, choose the date and select**Add** and **Next**.

1. In **Properties**, specify the reboot and maintenance window.
   - Use the **Reboot** to specify the way to handle reboots during deployment. The following options are available:
      * Reboot if required
      * Never reboot
      * Always reboot
   - Use the **Maximum duration (in minutes)** to specify the amount of time allowed for updates to install. The maximum limit supported is 235 minutes. Consider the following details when specifying the window:
       * It controls the number of updates that must be installed.
       * New updates will continue to install if the maintenance window limit is approaching.
       * In-progress updates aren't terminated if the maintenance window limit is exceeded
       * Any remaining updates that are not yet installed aren't attempted. We recommend that you reevaluate the maintenance window if this is consistently encountered.
      * If the limit is exceeded on Windows, it's often because of a service pack update that is taking a long time to install.

      :::image type="content" source="./media/deploy-updates/install-updates-now-basics-inline.png" alt-text="Screenshot showing the reboot and maintenance window options." lightbox="./media/deploy-updates/install-updates-now-basics-expanded.png":::

1. When you're finished configuring the deployment, verify the summary in **Review + install** and select **Install**. 
A notification appears to inform you the activity has started and another is created when it's completed. When it is successfully completed, you can view the installation operation results in the **History** The status of the operation can be viewed at any time from the [Azure Activity log](/azure/azure-monitor/essentials/activity-log).  

## View update history

After your scheduled deployment starts, you can see it's status on the **History** tab. It displays the total number of deployments including the successful and failed.

:::image type="content" source="./media/deploy-updates/updates-history-inline.png" alt-text="Screenshot showing updates historys." lightbox="./media/deploy-updates/updates-history-expanded.png":::

A list of the deployments created are show in the update deployment grid and include relevant information about the deployment. Every update deployment has a unique GUID, represented as **Operation ID**, which is listed along with **Status**, **Updates Installed** and **Time** details. You can filter the results listed in the grid.

Select any one of the update deployments from the list to open the **Update deployment run** page. Here, it shows a detailed breakdown of the updates and the installation results for the Azure VM or Arc-enabled server. 

:::image type="content" source="./media/deploy-updates/update-deployment-run.png" alt-text="Example showing update deployment run.":::

 The available values are:
- **Not attempted** - The update wasn't installed because there was insufficient time available, based on the defined maintenance window duration.
- **Not selected** - The update wasn't selected for deployment.
- **Succeeded**  - The update succeeded.
- **Failed** - The update failed.

## Next steps

* To view update assessment and deployment logs generated by update management center (preview), see [query logs](query-logs.md).
* To troubleshoot issues, see the [Troubleshoot](troubleshoot.md) update management center (preview).
