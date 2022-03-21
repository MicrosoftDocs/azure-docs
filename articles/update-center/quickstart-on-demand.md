---
title: Quickstart - deploy updates in using update management center in the Azure portal
description: This quickstart helps you to deploy updates immediately and view results for supported machines using the Azure portal
ms.service: update-management-center
ms.date: 03/19/2021
author: SGSneha
ms.author: v-ssudhir
ms.topic: quickstart
---

# Quickstart: Assess and install updates on demand using the Azure portal

This quickstart details you how to assess and install updates on demand on a selected Azure virtual machine or Arc-enabled server in an on-premise or other cloud environments. 

## Prerequisites

- Have an Azure account with an active subscription. If you don't have one yet, sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Your role must be either an [Owner](/azure/role-based-access-control/built-in-roles#owner) or [Contributor](/azure/role-based-access-control/built-in-roles#contributor) for Azure VM and resource administrator for Arc enabled servers.
- Ensure that the target machines meet the specific operating system requirements of the Windows Server and Linux. For more information, see [Overview](overview.md).


## Assess updates

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to Update management center (preview.)

1. Under **Manage**, select **Machines**.
    A table lists all the machines in the specified Azure subscription.

1. Select one or more machines from the list and select **Assess updates**.

1. A compliance scan is initiated.
    When the assessment is complete, a confirmation message appears on the page.


## Install updates 

For the assessed machines that are reporting updates, you can initiate an update deployment that starts immediately or you can schedule the updates by defining the maintenance window. To do a one time update, perform the below steps:

1. Select one or more machines from the list.
1. In **Manage updates** select **One time update** option from the drop-down menu
1. Select **Install Now** to proceed with installing updates.
1. In **Machines**, verify the list of machines. You can further add or remove machines from the list and click **Next**.
1. In **Updates**, from the following criteria, specify the updates that must be included:
    - Include update classification
    - Include KB ID/package
    - Exclude KB ID/package
    - Include by maximum patch publish date
1. In **Properties**, specify the following:
    - Reboot option
    - Maintenance window (in minutes)
1. In **Review + install**, verify your update deployment options and then select **Install**.

## Change update settings

To configure update settings on the machines, perform the below steps:

1. In **Machines** page, select one or more machines from the list and click **Manage updates**, **Update settings**.
1. Select **Update Settings** to confirm that you want to change the update settings to - patch orchestration, hotpatch or periodic assessment for the selected machines.
1. In **Properties**, select the option to modify the current settings for the machines and select **Next**.
1. In **Machines**, select the machine(s) from the list. You can also add or remove machines and select **Next**.
1. In **Review and change**, confirm the updates and select **Review and change**.
    A confirmation appears once the update settings are successfully applied.
  
## Next steps

  Learn on [managing multiple machines](manage-multiple-machines.md).
