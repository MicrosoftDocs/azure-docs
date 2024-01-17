---
title: Deploy and manage updates using Updates view (preview).
description: This article describes how to view the updates pending for your environment and then deploy and manage them using the Updates (preview) option in Azure Update Manager.
ms.service: azure-update-manager
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 01/14/2024
ms.topic: how-to
---

# Deploy and manage updates using the Update view (preview)


**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

This article describes how to view the updates pending in your environment and how to deploy and manage the updates using the Updates (preview).


The Updates blade (preview) allow you to manage machines from an updates point of view. It implies that you can see how many Linux and Windows updates are pending and the update applies to which machines.

number and type of updates pending on your Windows and Linux machines and there by decide on each of the pending updates. To view the latest pending updates on each of the machines, we recommend that you enable periodic assessment on all your machines. For more information, see [enable periodic assessment at scale using Policy](periodic-assessment-at-scale.md) or [enable using update settings](manage-update-settings.md).


## Use case: Identify a threat and apply an update on all pending machines

The **Updates (preview)** enables you to discover a vulnerability and allows you to apply a specific update on all the machines that are pending for an update. For example, if there was a threat discovered in a software, which could eventually expose the customer's environment to a risk such as remote code extension then the central IT team, can secure the entire enterprise environment by applying an update to mitigate the vulnerability. By using the **Updates (preview)**, they can apply an update on all the impacted machines.

## Summarized view

You can view the updates on the Azure Update Manager home page, **Overview** blade. It provides a summary of the pending updates. Select the individual updates to see a detailed view of each of the pending category of updates for Windows and Linux machines.

  :::image type="content" source="./media/deploy-manage-updates-using-updates-view/overview-pending-updates.png" alt-text="Screenshot that shows number of updates and the type of updates pending on your Windows and Linux machines." lightbox="./media/deploy-manage-updates-using-updates-view/overview-pending-updates.png":::

## Updates list view

You can use either the **Overview** or **Updates (preview)** blade that provides a list view of the updates pending in your environment. 
- Using the options at the top you can edit columns, export data to CSV, or see the query powering this view.
- Using the ribbon on the top you can view the number of machines that don't have periodic assessment enabled on them and the suggestions to enable the periodic assessment.
- Using the filter options at the top of **Resource group**, **Location**,  **Resource type**, **Workloads**, **Update Classifications** you can filter the updates.  Alternatively, select the cards to filter the Windows and Linux updates. 

  > [!NOTE]
  > We recommend you to enable periodic assessment to see the latest pending updates on the machines.

   :::image type="content" source="./media/deploy-manage-updates-using-updates-view/updates-view.png" alt-text="Screenshot that shows the pending updates and various filter options from Updates." lightbox="./media/deploy-manage-updates-using-updates-view/updates-view.png":::

- Select any row of the Machine(s) column to view the list of all the machines on which the updates are applicable and pending. You can trigger **One-time update** to install the update on demand or use the **Schedule updates** option to schedule update installation on a later date.

  :::image type="content" source="./media/deploy-manage-updates-using-updates-view/schedule-updates-applicable-machines.png" alt-text="Screenshot that shows the machines for which updates are applicable and pending." lightbox="./media/deploy-manage-updates-using-updates-view/schedule-updates-applicable-machines.png":::

You can also multi-select updates from the **Updates** list view and perform **One-time updates** or **Schedule updates**.

  :::image type="content" source="./media/deploy-manage-updates-using-updates-view/multi-updates-selection.png" alt-text="Screenshot that shows multi selection from list view." lightbox="./media/deploy-manage-updates-using-updates-view/multi-updates-selection.png":::

### One-time update

 You can install update(s) on the applicable machines on demand and can take instant action about the pending update(s). For more information on how to use One-time update, see [how to deploy on demand updates](deploy-updates.md#).

  :::image type="content" source="./media/deploy-manage-updates-using-updates-view/install-one-time-updates.png" alt-text="Screenshot that shows how to install one-time updates." lightbox="./media/deploy-manage-updates-using-updates-view/install-one-time-updates.png":::


### Schedule updates
 To install updates later, you must select a future date on when you would like to install the update(s) and specify an end date when the schedule must end. For more information on scheduled updates, see [how to schedule updates](scheduled-patching.md).

  :::image type="content" source="./media/deploy-manage-updates-using-updates-view/schedule-updates.png" alt-text="Screenshot that shows how to schedule updates." lightbox="./media/deploy-manage-updates-using-updates-view/schedule-updates.png":::


## Next steps

* [View updates for single machine](view-updates.md)
* [Deploy updates now (on-demand) for single machine](deploy-updates.md)
* [Schedule recurring updates](scheduled-patching.md)
* [Manage update settings via Portal](manage-update-settings.md)
* [Manage multiple machines using update Manager](manage-multiple-machines.md)