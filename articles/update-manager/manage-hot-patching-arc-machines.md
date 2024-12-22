---
title: Hotpatching (preview) on Azure Arc-enabled machines
description: This article details how to manage hotpatching (preview) on Azure Arc-enabled machines.
ms.service: azure-update-manager
ms.date: 11/01/2024
ms.topic: how-to
author: SnehaSudhirG
ms.author: sudhirsneha
---

# Manage hotpatches (preview) on Arc-enabled machines

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

Azure Update Manager enables you to install hotpatches (preview) on Windows Server Azure Editions and Arc-enabled machines. For more information, see [Hotpatch for virtual machines](/windows-server/get-started/hotpatch).

This article explains how to install hotpatches (preview) on compatible Arc-enabled machines. For hotpatches (preview) being non-intrusive on availability, you can create faster schedules and update your services immediately after release, with less planning to maintain reliability of your machines at-scale.  

## Supported operating systems

- Windows Server 2025 Standard Edition 
- Windows Server 2025 Datacenter Edition 


## Prerequisites

- Verify that the machine has a supported OS SKU. [Learn more](#supported-operating-systems).
- Ensure that Virtualization Based Security (VBS) is enabled. [Learn more](https://techcommunity.microsoft.com/t5/windows-server-news-and-best/how-to-preview-azure-arc-connected-hotpatching-for-windows/ba-p/4246895).
- Ensure the machine is Arc-enabled. 

## Manage Hotpatches (preview)

### Enroll hotpatch (preview) license

To enroll hotpatch (preview) license, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.
1. Under **Resources**, select **Machines** and then select the specific *Arc-enabled server*.
1. Under the **Recommended updates** section, in **Hotpatch**, select **Change**.
1. In the Hotpatch (preview), select **I want to license this Windows Server to receive monthly patches** option.
1. Select **Enable Hotpatching** and then select **Confirm**.
       
   :::image type="content" source="./media/manage-hot-patching-arc-machines/enroll-hot-patch-license.png" alt-text="Screenshot showing how to enroll hotpatch license." lightbox="./media/manage-hot-patching-arc-machines/enroll-hot-patch-license.png"::: 
       
### Manage hotpatch (preview) updates

After you enroll to hotpatch (preview) license, your machine automatically receives hotpatch updates.

#### [At scale](#tab/manage-scale)

To enable or disable hotpatching at scale, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.
1. Under **Resources**, select **Machines** and in the **Azure Update Manager | Machines** page, under **Settings**, select **Update settings**.
1. In **Change update settings** page, select **+Add machine**, to select the machine to which you want to change the update settings.
1. In **Select resources** page, select the machines and then select **Add** to view the machines in **Change update settings** page.
1. In the **Hotpatch (preview)** dropdown, select **Enable (current)** and then select **Save**.

   :::image type="content" source="./media/manage-hot-patching-arc-machines/manage-hot-patch-updates.png" alt-text="Screenshot showing how to manage hotpatch updates." lightbox="./media/manage-hot-patching-arc-machines/manage-hot-patch-updates.png"::: 

#### [On single VM](#tab/manage-single)

To re-enable or disable updates on a single VM, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.
1. Under **Resources**, select **Machines** and then select the specific Arc-enabled machine.
1. In the **Arc-enabled machine | Updates** page, 
under the **Recommended updates** section, in **Hotpatch**, select **Change**.
1. In the Hotpatch (preview), select **Enable hotpatching** and then select **Confirm**.

   :::image type="content" source="./media/manage-hot-patching-arc-machines/manage-hot-patch-single-vm.png" alt-text="Screenshot showing how to manage hotpatch updates on a single vm." lightbox="./media/manage-hot-patching-arc-machines/manage-hot-patch-single-vm.png":::
---

### View hotpatch (preview) status 

#### [At scale](#tab/hotpatch-scale)

To view the hotpatch (preview) status at scale on your machines, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.
1. Under **Resources**, select **Machines** and then select **Edit columns**.
1. In **Choose columns** pane, select **Hotpatch status** and then select **Save**.
   
   The **Hotpatch status** column appears in the machines grid and displays the status for all Azure machines and Arc-enabled machines. To view only Arc related details, you can filter Resource Type as **Arc-enabled server**. 

    :::image type="content" source="./media/manage-hot-patching-arc-machines/view-status-at-scale.png" alt-text="Screenshot showing how to view hotpatching status at scale." lightbox="./media/manage-hot-patching-arc-machines/view-status-at-scale.png":::

#### [On single VM](#tab/hotpatch-single)

To view the hotpatch (preview) status on a single machine, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.
1. Under **Resources**, select **Machines** and then select the specific Arc-enabled machine.
1. In the **Arc-enabled machine | Updates** page, under the **Recommended updates** section, you can view the Hotpatch status for your VM.

   :::image type="content" source="./media/manage-hot-patching-arc-machines/view-status-single-machine.png" alt-text="Screenshot showing how to view hotpatching status on single virtual machine." lightbox="./media/manage-hot-patching-arc-machines/view-status-single-machine.png":::

---

### Hotpatch (preview) statuses

| Status |  Meaning    |
|------|-----|
| Not enrolled| License is available but not enrolled on this machine. |
| Enabled     | License is enrolled and machine is enabled for receiving hotpatch updates.|
| Canceled | License has been canceled on the machine.   |
| Disabled | License is enrolled but the machine is disabled for receiving hotpatch updates. |
| Pending | Interim status while enrollment is in progress. |

### Check hotpatch (preview) updates

For latest hotpatch updates, enable either [periodic assessment](assessment-options.md#periodic-assessment) or a [one-time update](assessment-options.md#check-for-updates-nowon-demand-assessment).

Periodic assessment automatically assesses for available updates and ensures that available patches are detected. You can view the results of the assessment on the **Recommended updates** tab, including the time of the last assessment. 

You can also choose to trigger an *on-demand patch assessment* for your VM at any time using the **Check for updates** option and review the results after assessment completes. In this assessment result, you can view the reboot status of the given update under **Reboot required** column. 

:::image type="content" source="./media/manage-hot-patching-arc-machines/check-hot-patch-updates.png" alt-text="Screenshot showing how to check hotpatching updates." lightbox="./media/manage-hot-patching-arc-machines/check-hot-patch-updates.png":::


### Install hotpatch (preview) updates

To install, you can create a [user-defined schedule](scheduled-patching.md#schedule-recurring-updates-on-a-single-vm) or [one-time update](quickstart-on-demand.md#install-updates). You can install it immediately after it's available, allowing your machine to get secure faster. 

Using either of these options you can choose to install all available update classifications or only security updates. You can also specify updates to include or exclude by providing the individual hotpatch (preview) knowledge base IDs. You can enter more than one knowledge base ID in this flow.

:::image type="content" source="./media/manage-hot-patching-arc-machines/include-knowledge-base-id.png" alt-text="Screenshot showing how to include knowledge base ID." lightbox="./media/manage-hot-patching-arc-machines/include-knowledge-base-id.png":::

This ensures that the hotpatch (preview) update which doesn't require reboots is installed in the same schedule or one-time update schedule, making patch installation window predictable. 

### View history

You can view the history of update deployments on your VM through the [history](deploy-updates.md#view-update-history-for-a-single-vm) option. 

**Update history** displays the history for the past 30 days, along with patch installation details such as reboot status. 

:::image type="content" source="./media/manage-hot-patching-arc-machines/history-update-deployments.png" alt-text="Screenshot showing how to view the history of update deployments on your VM." lightbox="./media/manage-hot-patching-arc-machines/history-update-deployments.png":::
 

## Next steps

* Learn more about [hotpatching on Azure VMs](updates-maintenance-schedules.md#hotpatching).
* Learn more about [configure update settings](manage-update-settings.md) on your machines.
* Learn more on how to perform an [on-demand update](deploy-updates.md).


