---
title: Deploy updates and track results in Azure Update Manager
description: This article details how to use Azure Update Manager in the Azure portal to deploy updates and view results for supported machines.
ms.service: azure-update-manager
ms.date: 11/20/2023
ms.topic: conceptual
author: SnehaSudhirG
ms.author: sudhirsneha
ms.custom: references_regions
---

# Deploy updates now and track results with Azure Update Manager

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

This article describes how to perform an on-demand update on a single virtual machine (VM) or multiple VMs by using Azure Update Manager.

See the following sections for more information:

- [Install updates on a single VM](#install-updates-on-a-single-vm)
- [Install updates at scale](#install-updates-at-scale)

## Supported regions

Update Manager is available in all [Azure public regions](support-matrix.md#supported-regions). 

## Configure reboot settings

The registry keys listed in [Configure automatic updates by editing the registry](/windows/deployment/update/waas-wu-settings#configuring-automatic-updates-by-editing-the-registry) and [Registry keys used to manage restart](/windows/deployment/update/waas-restart#registry-keys-used-to-manage-restart) can cause your machines to reboot. A reboot can happen even if you specify **Never Reboot** in the **Schedule** settings. Configure these registry keys to best suit your environment.

## Install updates on a single VM

You can install updates from **Overview** or **Machines** on the **Update Manager** page or from the selected VM.

# [From Overview pane](#tab/install-single-overview)

To install one-time updates on a single VM:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On **Update Manager** > **Overview**, select your subscription and select **One-time update** to install updates.

   :::image type="content" source="./media/deploy-updates/install-updates-now-inline.png" alt-text="Screenshot that shows an example of installing one-time updates." lightbox="./media/deploy-updates/install-updates-now-expanded.png":::

1. Select **Install now** to proceed with the one-time updates:

   - **Install one-time updates**: Select **Add machine** to add the machine for deploying one time.
   - **Select resources**: Choose the machine and select **Add**.

1. On the **Updates** pane, specify the updates to include in the deployment. For each product, select or clear all supported update classifications and specify the ones to include in your update deployment.

   If your deployment is meant to apply only for a select set of updates, it's necessary to clear all the preselected update classifications when you configure the **Inclusion/exclusion** updates described in the following steps. This action ensures only the updates you've specified to include in this deployment are installed on the target machine.

   > [!NOTE]
   > - **Selected Updates** shows a preview of OS updates that you can install based on the last OS update assessment information available. If the OS update assessment information in Update Manager is obsolete, the actual updates installed would vary. Especially if you've chosen to install a specific update category, where the OS updates applicable might vary as new packages or KB IDs might be available for the category.
   > - Update Manager doesn't support driver updates.

   - Select **Include update classification**. Select the appropriate classifications that must be installed on your machines.
   
      :::image type="content" source="./media/deploy-updates/include-update-classification-inline.png" alt-text="Screenshot that shows update classification." lightbox="./media/deploy-updates/include-update-classification-expanded.png":::
   
   - Select **Include KB ID/package** to include in the updates. Enter a comma separated list of Knowledge Base article ID numbers to include or exclude for Windows updates. For example, use `3103696` or `3134815`. For Windows, you can refer to the [MSRC webpage](https://msrc.microsoft.com/update-guide/deployments) to get the details of the latest Knowledge Base release. For supported Linux distros, you specify a comma separated list of packages by the package name, and you can include wildcards. For example, use `kernel*`, `glibc`, or `libc=1.0.1`. Based on the options specified, Update Manager shows a preview of OS updates under the **Selected Updates** section.
       - Here, you can add multiple KB IDs and package names. When you add KB ID/package name, the next row is appears. The package can have both name and version.
   - To exclude updates that you don't want to install, select **Exclude KB ID/package**. We recommend selecting this option because updates that aren't displayed here might be installed, as newer updates might be available.
   - To ensure that the updates published are on or before a specific date, select **Include by maximum patch publish date**. Select the date and select **Add** > **Next**.
   
      :::image type="content" source="./media/deploy-updates/include-patch-publish-date-inline.png" alt-text="Screenshot that shows the patch publish date." lightbox="./media/deploy-updates/include-patch-publish-date-expanded.png":::

1. On the **Properties** pane, specify the reboot and maintenance window:
   - Use the **Reboot** option to specify the way to handle reboots during deployment. The following options are available:
      * Reboot if required
      * Never reboot
      * Always reboot
   - Use **Maximum duration (in minutes)** to specify the amount of time allowed for updates to install. The maximum limit supported is 235 minutes. Consider the following details when you specify the window:
       * It controls the number of updates that must be installed.
       * New updates continue to install if the maintenance window limit is approaching.
       * In-progress updates aren't terminated if the maintenance window limit is exceeded.
       * Any remaining updates that aren't yet installed aren't attempted. We recommend that you reevaluate the maintenance window if this issue is consistently encountered.
       * If the limit is exceeded on Windows, it's often because of a service pack update that's taking a long time to install.

1. After you're finished configuring the deployment, verify the summary in **Review + install** and select **Install**.

# [From Machines pane](#tab/install-single-machine)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On **Update Manager** > **Machine**, select your subscription, select your machine, and select **One-time update** to install updates.

1. Select **Install now** to proceed with installing updates.

1. On the **Install one-time updates** page, the selected machine appears. Choose the machine, select **Next**, and follow the procedure from step 4 listed in **From Overview pane** of [Install updates on a single VM](#install-updates-on-a-single-vm).

   A notification informs you when the activity starts, and another tells you when it's finished. After it's successfully finished, you can view the installation operation results in **History**. You can view the status of the operation at any time from the [Azure activity log](../azure-monitor/essentials/activity-log.md).

# [From a selected VM](#tab/singlevm-deploy-home)

1. Select your virtual machine and the **virtual machines | Updates** page opens.
1. Under **Operations**, select **Updates**.
1. In **Updates**, select **Go to Updates using Azure Update Manager**.
1. In **Updates**, select **One-time update** to install the updates.
1. In **Install one-time updates** page, the selected machine appears. Choose the machine, select **Next** and follow the procedure from step 4 listed in **From Overview blade** of [Install updates on single VM](#install-updates-on-a-single-vm).
 
---

## Install updates at scale

Follow these steps to create a new update deployment for multiple machines.

> [!NOTE]
> You can check the updates from **Overview** or **Machines**.

You can schedule updates.

# [From Overview pane](#tab/install-scale-overview)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On **Update Manager** > **Overview**, select your subscription and select **One-time update** > **Install now** to install updates.

   :::image type="content" source="./media/deploy-updates/install-updates-now-inline.png" alt-text="Screenshot that shows installing one-time updates." lightbox="./media/deploy-updates/install-updates-now-expanded.png":::

1. On the **Install one-time updates** pane, you can select the resources and machines to install the updates.

1. On the **Machines** page, you can view all the machines available in your subscription. You can also use **Add machine** to add the machines for deploying one-time updates. You can add up to 20 machines. Choose **Select all** and select **Add**.

**Machines** displays a list of machines for which you can deploy a one-time update. Select **Next** and follow the procedure from step 6 listed in **From Overview pane** of [Install updates on a single VM](#install-updates-on-a-single-vm).

# [From Machines pane](#tab/install-scale-machines)

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.

1. Go to **Machines**, select your subscription, and choose your machines. You can choose **Select all** to select all the machines.

1. Select **One-time update** > **Install now** to deploy one-time updates.

1. On the **Install one-time updates** pane, you can select the resources and machines to install the updates.

1. On the **Machines** page, you can view all the machines available in your subscription. You can also select by using **Add machine** to add the machines for deploying one-time updates. You can add up to 20 machines. Choose **Select all** and select **Add**.

**Machines** displays a list of machines for which you want to deploy a one-time update. Select **Next** and follow the procedure from step 6 listed in **From Overview pane** of [Install updates on a single VM](#install-updates-on-a-single-vm).

----

A notification informs you when the activity starts, and another tells you when it's finished. After it's successfully finished, you can view the installation operation results in **History**. You can view the status of the operation at any time from the [Azure activity log](../azure-monitor/essentials/activity-log.md).

## View update history for a single VM

You can browse information about your Azure VMs and Azure Arc-enabled servers across your Azure subscriptions. For more information, see [Update deployment history](manage-multiple-machines.md#update-deployment-history).

After your scheduled deployment starts, you can see its status on the **History** tab. It displays the total number of deployments, including the successful and failed deployments.

:::image type="content" source="./media/deploy-updates/updates-history-inline.png" alt-text="Screenshot that shows update history." lightbox="./media/deploy-updates/updates-history-expanded.png":::

**Windows update history** currently doesn't show the updates that are installed from Azure Update Management. To view a summary of the updates applied on your machines, go to **Update Manager** > **Manage** > **History**.

> [!NOTE]
> The **Windows update history** currently doesn't show the updates summary that are installed from Azure Update Management. To view a summary of the updates applied on your machines, go to **Update manager** > **Manage** > **History**. 
 
A list of the deployments created are shown in the update deployment grid and include relevant information about the deployment. Every update deployment has a unique GUID, represented as **Operation ID**, which is listed along with **Status**, **Updates Installed** and **Time** details. You can filter the results listed in the grid.

Select any one of the update deployments from the list to open the **Update deployment run** page. Here, you can see a detailed breakdown of the updates and the installation results for the Azure VM or Azure Arc-enabled server.

:::image type="content" source="./media/deploy-updates/update-deployment-run.png" alt-text="Screenshot that shows the Update deployment run page.":::

 The available values are:

- **Not attempted**: The update wasn't installed because insufficient time was available, based on the defined maintenance window duration.
- **Not selected**: The update wasn't selected for deployment.
- **Succeeded**: The update succeeded.
- **Failed**: The update failed.

## Next steps

* To view update assessment and deployment logs generated by Update Manager, see [Query logs](query-logs.md).
* To troubleshoot issues, see [Troubleshoot issues with Azure Update Manager](troubleshoot.md).
