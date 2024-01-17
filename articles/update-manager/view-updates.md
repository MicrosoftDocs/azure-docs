---
title: Check update compliance in Azure Update Manager
description: This article explains how to use Azure Update Manager in the Azure portal to assess update compliance for supported machines.
ms.service: azure-update-manager
ms.date: 11/20/2023
ms.topic: conceptual
author: SnehaSudhir 
ms.author: sudhirsneha
---

# Check update compliance with Azure Update Manager

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

This article explains how to check the status of available updates on a single VM or multiple VMs by using Azure Update Manager.

## Check updates on a single VM

You can check the updates from the **Overview** or **Machines** pane on the **Update Manager** page or from the selected VM.

# [From the Overview pane](#tab/singlevm-overview)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the **Azure Update Manager** | **Overview** page, select your subscription to view all your machines, and then select **Check for updates**.

1. On the **Select resources and check for updates** pane, choose the machine that you want to check for updates, and then select **Check for updates**.

    An assessment is performed and a notification appears as a confirmation.

    :::image type="content" source="./media/view-updates/check-updates-overview-inline.png" alt-text="Screenshot that shows checking updates from Overview." lightbox="./media/view-updates/check-updates-overview-expanded.png":::
    
    The **Update status of machines**, **Patch orchestration configuration** of Azure VMs, and **Total installation runs** tiles are refreshed and display the results.

# [From the Machines pane](#tab/singlevm-machines)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the **Azure Update Manager** | **Machines** page, select your subscription to view all your machines.

1. Select the checkbox for your machine, and then select **Check for updates** > **Assess now**. Alternatively, you can select your machine and in **Updates**, select **Assess updates**. In **Trigger assess now**, select **OK**.

    An assessment is performed and a notification appears first that says **Assessment is in progress**. After a successful assessment, you see **Assessment successful**. Otherwise, you see the notification **Assessment Failed**. For more information, see [Update assessment scan](assessment-options.md#update-assessment-scan).

# [From a selected VM](#tab/singlevm-home)

1. Select your virtual machine to open the **Virtual machines | Updates** page.
1. Under **Operations**, select **Updates**.
1. On the **Updates** pane, select **Go to Updates using Update Manager**.

      :::image type="content" source="./media/view-updates/resources-check-updates.png" alt-text="Screenshot that shows selection of updates from the home page.":::

1. On the **Updates** page, select **Check for updates**. In **Trigger assess now**, select **OK**.

   An assessment is performed and a notification says **Assessment is in progress**. After the assessment, you see **Assessment successful** or **Assessment failed**.

    :::image type="content" source="./media/view-updates/check-updates-home-inline.png" alt-text="Screenshot that shows the status after checking updates." lightbox="./media/view-updates/check-updates-home-expanded.png":::

  For more information, see [Update assessment scan](assessment-options.md#update-assessment-scan).

---

## Check updates at scale

To check the updates on your machines at scale, follow these steps.

You can check the updates from the **Overview** or **Machines** pane.

# [From the Overview pane](#tab/at-scale-overview)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the **Azure Update Manager** | **Overview** page, select your subscription to view all your machines and select **Check for updates**.

1. On the **Select resources and check for updates** pane, choose the machines that you want to check for updates and select **Check for updates**.

    An assessment is performed and a notification appears as a confirmation.
    
    The **Update status of machines**, **Patch orchestration configuration** of Azure virtual machines, and **Total installation runs** tiles are refreshed and display the results.

# [From the Machines pane](#tab/at-scale-machines)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the **Azure Update Manager** | **Machines** page, select your subscription to view all your machines.

1. Choose **Select all** to select all your machines, and then select **Check for updates**.

1. Select **Assess now** to perform the assessment.

   A notification appears when the operation is initiated and finished. After a successful scan, the **Update Manager | Machines** page is refreshed to display the updates.

---

> [!NOTE]
> In Update Manager, you can initiate a software updates compliance scan on the machine to get the current list of operating system (guest) updates, including the security and critical updates. On Windows, the Windows Update Agent performs the software update scan. On Linux, the software update scan is performed using the package manager that returns the missing updates as per the configured repositories which are retrieved from a local or remote repository.

## Next steps

* To learn how to deploy updates on your machines to maintain security compliance, see [Deploy updates](deploy-updates.md).
* To view the update assessment and deployment logs generated by Update Manager, see [Query logs](query-logs.md).
* To troubleshoot issues, see [Troubleshoot Update Manager](troubleshoot.md).
