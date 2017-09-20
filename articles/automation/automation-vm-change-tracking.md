---
title: Track changes in your virtual machines | Microsoft Docs
description: Use Change tracking to track changes in files and registry on your virtual machines 
services: automation
documentationcenter: automation
author: eslesar
manager: carmonm
editor: tysonn
tags: azure-service-management

ms.assetid: 
ms.service: automation
ms.devlang: 
ms.topic: article
ms.tgt_pltfrm: 
ms.workload: infrastructure
ms.date: 09/25/2017
ms.author: eslesar
ms.custom:  
---

# Track changes in your virtual machines

By enabling change tracking, you can track changes to files and Windows registry keys on your virtual machines. . Identifying configuration changes can help you pinpoint operational issues.

You can enable change tracking directly from your Azure virtual machine.

If you do not have an Azure virtual machine, you can create one using the [Windows quickstart](../virtual-machines/windows/quick-create-portal.md)
or the [Linux quickstart](../virtual-machines/linux/quick-create-portal.md)

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Enable change tracking for an Azure virtual machine

1. On the left-hand side of the screen, select **Virtual machines**.
1. From the list, select a virtual machine.
1. On the virtual machine screen, in the **Operations** section, click **Change tracking**. The **Enable Update Management** screen opens.

   ![Change tracking onboard vm](./media/automation-vm-change-tracking/change-onboard-vm-blade.png)

Validation is performed to determine if change tracking is enabled for this virtual machine. If change tracking is not enabled,
a banner appears that gives you the option to enable the solution.

   ![Change tracking onboard configuration banner](./media/automation-vm-change-tracking/change-onboard-banner.png)

Click the banner to enable the solution. If you do not have the following, they are added automatically:

* [Log Analytics](../log-analytics/log-analytics-overview.md) workspace
* [Automation](../automation/automation-offering-get-started.md) account

Select a Log Analytics work space to store data logs from change tracking and an Automation account to track changes, and click **Enable**.

A status bar notifies you that the solution is being enabled. This process can take up to 15 minutes.

## Configure change tracking

After change tracking is enabled, the **Change tacking** screen appears. Choose which files and registry keys to track by clicking **Edit settings**.

    ![Change tracking edit settings](./media/automation-vm-change-tracking/change-edit-settings.png)

The **Workspace Configuration** screen opens. Click **Add** on the appropriate tab to add Windows registry keys, Windows files, or Linux files to be tracked.

## Add a Windows registry key

1. On the **Windows Registry** tab of the **Workspace Configuration** screen, click **Add**. The **Add Windows Registry for Change Tracking** screen opens.

   ![Change tracking add registry](./media/automation-vm-change-tracking/change-add-registry.png)

1. Under **Enabled**, select **True**.
1. Add a friendly name in the **Item Name** field.
1. In the **Group** field, enter a group name (optional).
1. In the **Windows Registry Key** field, add the name of the registry key you want to track.
1. Click **Save**.

## Add a Windows file

1. On the **Windows Files** tab of the **Workspace Configuration** screen, click **Add** The **Add Windows File for Change Tracking** screen opens.

   ![Change tracking add Windows file](./media/automation-vm-change-tracking/change-add-win-file.png)

1. Under **Enabled**, select **True**.
1. Add a friendly name in the **Item Name** field.
1. In the **Group** field, enter a group name (optional).
1. In the **Enter Path** field, add the full path and filename of the file you want to track.
1. Click **Save**.

## Add a Linux file

1. On the **Linux Files** tab of the **Workspace Configuration** screen, click **Add** The **Add Linux File for Change Tracking** screen opens.

   ![Change tracking add Linux file](./media/automation-vm-change-tracking/change-add-linux-file.png)

1. Under **Enabled**, select **True**.
1. Add a friendly name in the **Item Name** field.
1. In the **Group** field, enter a group name (optional).
1. In the **Enter Path** field, add the full path and filename of the file you want to track.
1. In the **Path Type** field, select either **File** or **Directory**.
1. Under **Recursion**, select **On** to track changes for the specified path and all files and paths under it. To track only the selected path or file, select **Off**.
1. Under **Sudo**, select **On** to track files that require the `sudo` command to access. Otherwise, select **Off**.
1. Click **Save**.

## View changes

On the **Change tracking** screen, you can see changes in each of the various categories for your virtual machine over time.

   ![Change tracking add view changes](./media/automation-vm-change-tracking/change-view-changes.png)

You can select the categories and the time range of changes to view. On the top of the screen, you see a graphical view of changes over time.
On the bottom of the screen, you see a list of recent changes.

## View change tracking log data

Change tracking generates log data that is sent to Log Analytics. To search the logs by running queries, click **Log Analytics** at the top
of the **Change tracking** screen.

   ![Change tracking log analytics](./media/automation-vm-change-tracking/change-log-analytics.png)

To learn more about running searching log files in Log Analytics, see [Log Analytics](../log-analytics/log-analytics-overview.md).

## Next steps

* To learn more about change tracking, see [Change Tracking](../log-analytics/log-analytics-change-tracking.md)
* To learn more about managing updates for your virtual machines, see [Update Management](../operations-management-suite/oms-solution-update-management.md).
