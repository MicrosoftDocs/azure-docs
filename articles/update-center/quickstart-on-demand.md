---
title: Quickstart - deploy updates in using update management center in the Azure portal
description: This quickstart helps you to deploy updates immediately and view results for supported machines in update management center (preview) using the Azure portal.
ms.service: update-management-center
ms.date: 04/21/2022
author: SnehaSudhirG
ms.author: sudhirsneha
ms.topic: quickstart
---

# Quickstart: Check and install on-demand updates

Using the Update management center (preview) you can update automatically at scale with the help of built-in policies and schedule updates on a recurring basis or you can also take control by checking and installing updates manually. 

This quickstart details you how to perform manual assessment and apply updates on a selected Azure virtual machine(s) or Arc-enabled server on-premises or in cloud environments.

## Prerequisites

- An Azure account with an active subscription. If you don't have one yet, sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Your role must be either an [Owner](../role-based-access-control/built-in-roles.md#owner) or [Contributor](../role-based-access-control/built-in-roles.md#contributor) for Azure VM and resource administrator for Arc enabled servers.
- Ensure that the target machines meet the specific operating system requirements of the Windows Server and Linux. For more information, see [Overview](overview.md).


## Check updates

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to Update management center (preview).

1. Select **Getting started**, **On-demand assessment and updates**, select **Check for updates**.

    In the **Select resources and check for updates**, a table lists all the machines in the specific Azure subscription.

1. Select one or more machines from the list and select **Check for updates** to initiate a compliance scan.
    
    When the assessment is complete, a confirmation message appears on the top right corner of the page.


## Configure settings

For the assessed machines that are reporting updates, you can configure [hotpatching](updates-maintenance-schedules.md#hotpatching), [patch orchestration](manage-multiple-machines.md#summary-of-machine-status) and [periodic assessment](assessment-options.md#periodic-assessment) either immediately or schedule the updates by defining the maintenance window.

To configure the settings on your machines, follow these steps:

1. In **Update management center (Preview)|Getting started**, in **On-demand assessment and updates**, select **Update settings**.

    In the **Change update settings** page, by default **Properties** is selected. 
1. Select from the list of update settings to apply them to the selected machines.

1. In **Update setting(s) to change**, select any option —*Periodic assessment*, *Hotpatch* and *Patch orchestration* to configure and select **Next**. For more information, see [Configure settings on virtual machines](manage-update-settings.md#configure-settings-on-single-vm).

1. In **Machines**, verify the machines for which you can apply the updates. You can also add or remove machines from the list and select **Next**.

1. In **Review and change**, verify the resource selection and update settings and select **Review and change**.
    A notification appears to confirm that the update settings have been successfully applied.


## Install updates

As per the last assessment performed on the selected machines, you can now select resources and machines to install the updates

1. In the **Update management center(Preview)|Getting started** page, in **On-demand assessment and updates**, select **Install updates by machines**.

1. In the **Install one-time updates** page, select one or more machines from the list in the **Machines** tab and click **Next**.

1. In **Updates**, specify the updates to include in the deployment and click **Next**:

    - Include update classification 
    - Include KB ID/package - by specific KB IDs or package. For Windows, see [MSRC](https://msrc.microsoft.com/update-guide/deployments) for the latest KBs.
    - Exclude KB ID/package that you don't want to install as part of the process. Updates not shown in the list can be installed based on the time between last assessment and release of new updates.
    - Include by maximum patch publish date includes the updates published on or before a specific date.

1. In **Properties**, select the **Reboot option** and **Maintenance window** (in minutes) and click **Next**.

1. In **Review + install**, verify the update deployment options and select **Install**.

A notification confirms that the installation of updates is in progress and after completion, you can view the results in the **Update management center**, **History** page.

## Next steps

  Learn about [managing multiple machines](manage-multiple-machines.md).