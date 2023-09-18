---
title: Check update compliance in Azure Update Manager (preview)
description: This article shows how to use Azure Update Manager (preview) in the Azure portal to assess update compliance for supported machines.
ms.service: azure-update-manager
ms.date: 05/31/2023
ms.topic: conceptual
author: SnehaSudhir 
ms.author: sudhirsneha
---

# Check update compliance with Azure Update Manager (preview)

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

This article shows how to check the status of available updates on a single virtual machine (VM) or multiple VMs by using Azure Update Manager (preview).

## Check updates on a single VM

You can check the updates from the **Overview** or **Machines** pane on the **Update Manager (preview)** page or from the selected VM.

# [From Overview pane](#tab/singlevm-overview)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the **Update Manager (preview)** page, on the **Overview** tab, select your subscription to view all your machines and select **Check for updates**.

1. On the **Select resources and check for updates** pane, choose the machine that you want to check for updates and select **Check for updates**.

    An assessment is performed and a notification appears as a confirmation.

    :::image type="content" source="./media/view-updates/check-updates-overview-inline.png" alt-text="Screenshot that shows checking updates from Overview." lightbox="./media/view-updates/check-updates-overview-expanded.png":::
    
    The **Update status of machines**, **Patch orchestration configuration** of Azure VMs, and **Total installation runs** tiles are refreshed and display the results.

# [From Machines pane](#tab/singlevm-machines)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the **Update Manager (preview)** page, on the **Machines** tab, select your subscription to view all your machines.

1. Select the checkbox for your machine and select **Check for updates** > **Assess now**. Alternatively, you can select your machine, and in **Updates Preview**, select **Assess updates**. In **Trigger assess now**, select **OK**.

    An assessment is performed and a notification says **Assessment is in progress**. After the assessment, you see **Assessment successful** or **Assessment failed**. For more information, see [Update assessment scan](assessment-options.md#update-assessment-scan).

# [From a selected VM](#tab/singlevm-home)

1. Select your virtual machine to open the **Virtual machines | Updates** page.
1. Under **Operations**, select **Updates**.
1. On the **Updates** pane, select **Go to Updates using Update Manager**.

      :::image type="content" source="./media/view-updates/resources-check-updates.png" alt-text="Screenshot that shows selection of updates from the home page.":::

1. On the **Updates (Preview)** page, select **Check for updates**. In **Trigger assess now**, select **OK**.

   An assessment is performed and a notification says **Assessment is in progress**. After the assessment, you see **Assessment successful** or **Assessment failed**.

    :::image type="content" source="./media/view-updates/check-updates-home-inline.png" alt-text="Screenshot that shows the status after checking updates." lightbox="./media/view-updates/check-updates-home-expanded.png":::

  For more information, see [Update assessment scan](assessment-options.md#update-assessment-scan).

---  

## Check updates at scale

To check the updates on your machines at scale, follow these steps.

You can check the updates from the **Overview** or **Machines** pane.

# [From Overview pane](#tab/at-scale-overview)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the **Update Manager (preview)** page, on the **Overview** tab, select your subscription to view all your machines and select **Check for updates**.

1. On the **Select resources and check for updates** pane, choose the machines that you want to check for updates and select **Check for updates**.

    An assessment is performed and a notification appears as a confirmation.
    
    The **Update status of machines**, **Patch orchestration configuration** of Azure virtual machines, and **Total installation runs** tiles are refreshed and display the results.

# [From Machines pane](#tab/at-scale-machines)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. On the **Update Manager (preview)** page, on the **Machines** tab, select your subscription to view all your machines.

1. Choose **Select all** to select all your machines and select **Check for updates**.

1. Select **Assess now** to perform the assessment.

   A notification appears when the operation is initiated and finished. After a successful scan, the **Update Manager (preview) | Machines** page is refreshed to display the updates.

---

> [!NOTE]
> In Update Manager (preview), you can initiate a software updates compliance scan on the machine to get the current list of operating system (guest) updates, including the security and critical updates. On Windows, the Windows Update Agent performs the software update scan. On Linux, the software update scan is performed by using OVAL-compatible tools to test for the presence of vulnerabilities based on the OVAL Definitions for that platform, which is retrieved from a local or remote repository.

## Next steps

* To learn how to deploy updates on your machines to maintain security compliance, see [Deploy updates](deploy-updates.md).
* To view the update assessment and deployment logs generated by Update Manager (preview), see [Query logs](query-logs.md).
* To troubleshoot issues, see [Troubleshoot issues with Azure Update Manager (preview)](troubleshoot.md).
