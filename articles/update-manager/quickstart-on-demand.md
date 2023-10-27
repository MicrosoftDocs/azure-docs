---
title: 'Quickstart: Deploy updates by using Update Manager in the Azure portal'
description: This quickstart helps you to deploy updates immediately and view results for supported machines in Azure Update Manager by using the Azure portal.
ms.service: update-management-center
ms.date: 09/18/2023
author: SnehaSudhirG
ms.author: sudhirsneha
ms.topic: quickstart
---

# Quickstart: Check and install on-demand updates

By using Azure Update Manager, you can update automatically at scale with the help of built-in policies and schedule updates on a recurring basis. You can also take control by checking and installing updates manually.

This quickstart explains how to perform manual assessment and apply updates on selected Azure virtual machines (VMs) or an Azure Arc-enabled server on-premises or in cloud environments.

## Prerequisites

- An Azure account with an active subscription. If you don't have one yet, sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Your role must be either an [Owner](../role-based-access-control/built-in-roles.md#owner) or [Contributor](../role-based-access-control/built-in-roles.md#contributor) for an Azure VM and resource administrator for Azure Arc-enabled servers.
- Ensure that the target machines meet the specific operating system requirements of the Windows Server and Linux. For more information, see [Overview](overview.md).

## Check updates

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.

1. Select **Get started** > **On-demand assessment and updates** > **Check for updates**.

   :::image type="content" source="./media/quickstart-on-demand/quickstart-check-updates.png" alt-text="Screenshot that shows accessing check for updates.":::

    On the **Select resources and check for updates** pane, a table lists all the machines in the specific Azure subscription.

1. Select one or more machines from the list and select **Check for updates** to initiate a compliance scan.
    
After the assessment is finished, a confirmation message appears in the upper-right corner of the page.

## Configure settings

For the assessed machines that are reporting updates, you can configure [periodic assessment](assessment-options.md#periodic-assessment), [hotpatching](updates-maintenance-schedules.md#hotpatching),and [patch orchestration](manage-multiple-machines.md#summary-of-machine-status) either immediately or schedule the updates by defining the maintenance window.

To configure the settings on your machines:

1. On the **Azure Update Manager | Get started** page, in **On-demand assessment and updates**, select **Update settings**.

    :::image type="content" source="./media/quickstart-on-demand/quickstart-update-settings.png" alt-text="Screenshot that shows how to access the Update settings option to configure updates for virtual machines.":::

1. On the **Update settings to change** page, select **Periodic assessment**, **Hotpatch**, or **Patch orchestration** to configure. Select **Next**. For more information, see [Configure settings on virtual machines](manage-update-settings.md#configure-settings-on-a-single-vm).

1. On the **Review and change** tab, verify the resource selection and update settings and select **Review and change**.

A notification confirms that the update settings were successfully applied.

## Install updates

Based on the last assessment performed on the selected machines, you can now select resources and machines to install the updates.

1. On the **Azure Update Manager | Get started** page, in **On-demand assessment and updates**, select **Install updates by machines**.

   :::image type="content" source="./media/quickstart-on-demand/quickstart-install-updates.png" alt-text="Screenshot that shows how to access the Install update settings option to install the updates for virtual machines.":::

1. On the **Install one-time updates** pane, select one or more machines from the list on the **Machines** tab. Select **Next**.

1. On the **Updates** tab, specify the updates to include in the deployment and select **Next**:

    - Include update classification.
    - Include the Knowledge Base (KB) ID/package, by specific KB IDs or package. For Windows, see the [Microsoft Security Response Center (MSRC)](https://msrc.microsoft.com/update-guide/deployments) for the latest information.
    - Exclude the KB ID/package that you don't want to install as part of the process. Updates not shown in the list can be installed based on the time between last assessment and release of new updates.
    - Include by maximum patch publish date includes the updates published on or before a specific date.

1. On the **Properties** tab, select **Reboot** and **Maintenance window** (in minutes). Select **Next**.

1. On the **Review + install** tab, verify the update deployment options and select **Install**.

A notification confirms that the installation of updates is in progress. After the update is finished, you can view the results on the **Update Manager | History** page.

## Next steps

Learn about [managing multiple machines](manage-multiple-machines.md).