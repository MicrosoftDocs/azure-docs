---
title: Check update compliance in Update management center (preview)
description: The article details how to use Azure Update management center (preview) in the Azure portal to assess update compliance for supported machines.
ms.service: update-management-center
ms.date: 04/21/2022
ms.topic: conceptual
author: SnehaSudhir 
ms.author: sudhirsneha
---

# Check update compliance with update management center (preview)

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

This article details how to check the status of available updates on a single VM or multiple machines using update management center (preview).


## Check updates on single VM

>[!NOTE]
> You can check the updates from the Overview or Machines blade in update management center (preview) page or from the selected VM.

# [From Overview blade](#tab/singlevm-overview)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In Update management center (Preview), **Overview**, select your **Subscription** to view all your machines and select **Check for updates**.

1. In **Select resources and check for updates**, choose the machine for which you want to check the updates and select **Check for updates**.

    An assessment is performed and a notification appears as a confirmation.

    :::image type="content" source="./media/view-updates/check-updates-overview-inline.png" alt-text="Screenshot of checking updates from Overview." lightbox="./media/view-updates/check-updates-overview-expanded.png":::
    
    The **Update status of machines**, **Patch orchestration configuration** of Azure virtual machines, and **Total installation runs** tiles are refreshed and display the results.


# [From Machines blade](#tab/singlevm-machines)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In Update management center (preview), **Machines**, select your **Subscription** to view all your machines.

1. Select your machine from the checkbox and select **Check for updates**, **Assess now** or alternatively, you can select your machine, in **Updates Preview**, select **Assess updates**, and in **Trigger assess now**, select **OK**.

    An assessment is performed and a notification appears first that the *Assessment is in progress* and after a successful assessment, you will see *Assessment successful* else, you will see the notification *Assessment Failed*. For more information, see [update assessment scan](assessment-options.md#update-assessment-scan).


# [From a selected VM](#tab/singlevm-home)

1. Select your virtual machine and the **virtual machines | Updates** page opens.
1. Under **Operations**, select **Updates**.
1. In **Updates**, select **Go to Updates using Update Center**. 

      :::image type="content" source="./media/view-updates/resources-check-updates.png" alt-text="Screenshot showing selection of updates from Home page.":::

1. In **Updates (Preview)**, select **Assess updates**, in **Trigger assess now**, select **OK**.

   An assessment is performed and a notification appears first that the *Assessment is in progress* and after a successful assessment, you will see *Assessment successful* else, you will see the notification *Assessment Failed*.

    :::image type="content" source="./media/view-updates/check-updates-home-inline.png" alt-text="Screenshot of status after checking updates." lightbox="./media/view-updates/check-updates-home-expanded.png":::

  For more information, see [update assessment scan](assessment-options.md#update-assessment-scan).
 
---  

## Check updates at scale

To check the updates on your machines at scale, follow these steps:

>[!NOTE]
> You can check the updates from the **Overview** or **Machines** blade.

# [From Overview blade](#tab/at-scale-overview)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In Update management center (preview), **Overview**, select your **Subscription** to view all your machines and select **Check for updates**.

1. In **Select resources and check for updates**, choose your machines for which you want to check the updates and select **Check for updates**.

    An assessment is performed and a notification appears as a confirmation. 
    
    The **Update status of machines**, **Patch orchestration configuration** of Azure virtual machines, and **Total installation runs** tiles are refreshed and display the results.


# [From Machines blade](#tab/at-scale-machines)

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In Update management center (preview), **Machines**, select your **Subscription** to view all your machines.

1. Select the **Select all** to choose all your machines and select **Check for updates**.

1. Select **Assess now** to perform the assessment.

   A notification appears when the operation is initiated and completed. After a successful scan,  the **Update management center (Preview) | Machines** page is refreshed to display the updates.

---

> [!NOTE]
> In update management center (preview), you can initiate a software updates compliance scan on the machine to get the current list of operating system (guest) updates including the security and critical updates. On Windows, the software update scan is performed by the Windows Update Agent. On Linux, the software update scan is performed using OVAL-compatible tools to test for the presence of vulnerabilities based on the OVAL Definitions for that platform, which is retrieved from a local or remote repository. 

 
## Next steps

* Learn about deploying updates to your machines to maintain security compliance by reading [deploy updates](deploy-updates.md).
* To view update assessment and deployment logs generated by update management center (preview), see [query logs](query-logs.md).
* To troubleshoot issues, see [Troubleshoot](troubleshoot.md) Azure Update management center (preview).
