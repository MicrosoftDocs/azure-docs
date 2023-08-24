---
title: Deploy updates and track results in update management center (preview).
description: The article details how to use update management center (preview) in the Azure portal to deploy updates and view results for supported machines.
ms.service: update-management-center
ms.date: 05/31/2023
ms.topic: conceptual
author: SnehaSudhirG
ms.author: sudhirsneha
ms.custom: references_regions
---

# Deploy updates now and track results with update management center (preview)

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

The article describes how to perform an on-demand update on a single VM or multiple VMs using update management center (preview).

See the following sections for detailed information:
- [Install updates on a single VM](#install-updates-on-single-vm)
- [Install updates at scale](#install-updates-at-scale)

## Supported regions

Update management center (preview) is available in all [Azure public regions](support-matrix.md#supported-regions). 


## Install updates on single VM

>[!NOTE]
> You can install the updates from the Overview or Machines blade in update management center (preview) page or from the selected VM.

# [From Overview blade](#tab/install-single-overview) 

To install one time updates on a single VM, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In **Update management center (preview)**, **Overview**, choose your **Subscription** and select **One-time update** to install updates.

   :::image type="content" source="./media/deploy-updates/install-updates-now-inline.png" alt-text="Example of installing one-time updates." lightbox="./media/deploy-updates/install-updates-now-expanded.png":::

1. Select **Install now** to proceed with the one-time updates.

   - In **Install one-time updates**, select **+Add machine** to add the machine for deploying one-time.

   - In **Select resources**, choose the machine and select **Add**. 

1. In **Updates**, specify the updates to include in the deployment. For each product, select or deselect all supported update classifications and specify the ones to include in your update deployment. If your deployment is meant to apply only for a select set of updates, its necessary to deselect all the pre-selected update classifications when configuring the **Inclusion/exclusion** updates described below. This ensures only the updates you've specified to include in this deployment are installed on the target machine.

   > [!NOTE]
   > - Selected Updates shows a preview of OS updates which may be installed based on the last OS update assessment information available. If the OS update assessment information in update center management (preview) is obsolete, the actual updates installed would vary. Especially if you have chosen to install a specific update category, where the OS updates applicable may vary as new packages or KB Ids may be available for the category.
   > - Update management center (preview) doesn't support driver updates. 


   - Select **+Include update classification**, in the **Include update classification** select the appropriate classification(s) that must be installed on your machines.
   
      :::image type="content" source="./media/deploy-updates/include-update-classification-inline.png" alt-text="Screenshot on including update classification." lightbox="./media/deploy-updates/include-update-classification-expanded.png":::
   
   - Select **Include KB ID/package** to include in the updates. Enter a comma-separated list of Knowledge Base article ID numbers to include or exclude for Windows updates. For example,  `3103696, 3134815`. For Windows, you can refer to the [MSRC link](https://msrc.microsoft.com/update-guide/deployments) to get the details of the latest Knowledge Base released. For supported Linux distros, you specify a comma separated list of packages by the package name, and you can include wildcards. For example, `kernel*, glibc, libc=1.0.1`. Based on the options specified, update management center (preview) shows a preview of OS updates under the **Selected Updates** section.

   - To exclude updates that you don't want to install, select **Exclude KB ID/package**. We recommend checking this option because updates that are not displayed here might be installed, as newer updates might be available.
   
   - To ensure that the updates published are on or before a specific date, select **Include by maximum patch publish date** and in the Include by maximum patch publish date , choose the date and select **Add** and **Next**.
   
      :::image type="content" source="./media/deploy-updates/include-patch-publish-date-inline.png" alt-text="Screenshot on including patch publish date." lightbox="./media/deploy-updates/include-patch-publish-date-expanded.png":::

1. In **Properties**, specify the reboot and maintenance window.
   - Use the **Reboot** option to specify the way to handle reboots during deployment. The following options are available:
      * Reboot if required
      * Never reboot
      * Always reboot
   - Use the **Maximum duration (in minutes)** to specify the amount of time allowed for updates to install. The maximum limit supported is 235 minutes. Consider the following details when specifying the window:
       * It controls the number of updates that must be installed.
       * New updates will continue to install if the maintenance window limit is approaching.
       * In-progress updates aren't terminated if the maintenance window limit is exceeded
       * Any remaining updates that are not yet installed aren't attempted. We recommend that you reevaluate the maintenance window if this is consistently encountered.
       * If the limit is exceeded on Windows, it's often because of a service pack update that is taking a long time to install.

1. When you're finished configuring the deployment, verify the summary in **Review + install** and select **Install**. 

 
# [From Machines blade](#tab/install-single-machine) 

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In **Update management center (Preview)**, **Machine**, choose your **Subscription**, choose your machine and select **One-time update** to install updates.

1. Select to **Install now** to proceed with installing updates.

1. In **Install one-time updates** page, the selected machine appears. Choose the machine, select **Next** and follow the procedure from step 4 listed in **From Overview blade** of [Install updates on single VM](#install-updates-on-single-vm).

   A notification appears to inform you the activity has started and another is created when it's completed. When it is successfully completed, you can view the installation operation results in **History**. The status of the operation can be viewed at any time from the [Azure Activity log](../azure-monitor/essentials/activity-log.md).

# [From a selected VM](#tab/singlevm-deploy-home)

1. Select your virtual machine and the **virtual machines | Updates** page opens.
1. Under **Operations**, select **Updates**.
1. In **Updates**, select **Go to Updates using Update Center**.
1. In **Updates (Preview)**, select **One-time update** to install the updates.
1. In **Install one-time updates** page, the selected machine appears. Choose the machine, select **Next** and follow the procedure from step 4 listed in **From Overview blade** of [Install updates on single VM](#install-updates-on-single-vm).
 
---

## Install updates at scale

To create a new update deployment for multiple machines, follow these steps:

>[!NOTE]
> You can check the updates from **Overview** or **Machines** blade.

You can schedule updates 

# [From Overview blade](#tab/install-scale-overview) 


1. Sign in to the [Azure portal](https://portal.azure.com).

1. In **Update management center (Preview)**, **Overview**, choose your **Subscription**, select **One-time update**, and **Install now** to install updates.

   :::image type="content" source="./media/deploy-updates/install-updates-now-inline.png" alt-text="Example of installing one-time updates." lightbox="./media/deploy-updates/install-updates-now-expanded.png":::
   
1. In **Install one-time updates**, you can select the resources and machines to install the updates.

1. In **Machines**, you can view all the machines available in your subscription. You can also use the **+Add machine** to add the machines for deploying one-time updates. You can add up to 20 machines. Choose **Select all** and select **Add**.

The **Machines** displays a list of machines for which you can deploy one-time update. Select **Next** and follow the procedure from step 6 listed in **From Overview blade** of [Install updates on single VM](#install-updates-on-single-vm).


# [From Machines blade](#tab/install-scale-machines) 

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to **Machines**, select your subscription and choose your machines. You can choose **Select all** to select  all the machines. 

1. Select **One-time update**, **Install now** to deploy one-time updates.
  
1.  In **Install one-time updates**, you can select the resources and machines to install the updates.

1.  In **Machines**, you can view all the machines available in your subscription. You can also select using the **+Add machine** to add the machines for deploying one-time updates. You can add up to 20 machines. Choose the **Select all** and select **Add**.

The **Machines** displays a list of machines for which you want to deploy one-time update, select **Next** and follow the procedure from step 6 listed in **From Overview blade** of [Install updates on single VM](#install-updates-on-single-vm).

----

A notification appears to inform you the activity has started and another is created when it's completed. When it is successfully completed, you can view the installation operation results in **History**. The status of the operation can be viewed at any time from the [Azure Activity log](../azure-monitor/essentials/activity-log.md). 


## View update history for single VM

You can browse information about your Azure VMs and Arc-enabled servers across your Azure subscriptions. For more information, see [Update deployment history](manage-multiple-machines.md#update-deployment-history).

After your scheduled deployment starts, you can see it's status on the **History** tab. It displays the total number of deployments including the successful and failed deployments.

:::image type="content" source="./media/deploy-updates/updates-history-inline.png" alt-text="Screenshot showing updates history." lightbox="./media/deploy-updates/updates-history-expanded.png":::

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