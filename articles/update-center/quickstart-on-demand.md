---
title: Quickstart - deploy updates in using update management center in the Azure portal
description: This quickstart helps you to deploy updates and view results for supported machines.using the Azure portal
ms.service: update-management-center-(preview)
ms.date: 03/19/2021
author: SGSneha
ms.author: v-ssudhir
ms.topic: quickstart
---

# Quickstart: Assess and install updates on your machines using the Azure portal

This quickstart shows you how to assess and install updates on selected Azure virtual machine or a selected Arc-enabled server in on-premise and other cloud environments. 

## Prerequisites

- Azure subscription. If you don't have one yet, you can [activate your MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Your account must be a member of the Azure [Owner](/azure/role-based-access-control/built-in-roles#owner) or [Contributor](/azure/role-based-access-control/built-in-roles#contributor) role in the subscription.
- One or more [Azure virtual machines](/azure/virtual-machines), or physical or virtual machines managed by [Arc-enabled servers](/azure/azure-arc/servers/overview).
- Ensure that you meet all [prerequisites for update management center](https://github.com/Azure/update-center-docs/Docs/overview.md#prerequisites)

## Assess updates

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to Update management center (preview.)

1. Under **Manage**, select **Machines**.
    A table lists all the machines in the specified Azure subscription.

1. Select one or more machines from the list and select **Assess updates**
    A compliance scan is initiated and When the assessment is complete, a confirmation message appears on the page.


## Install updates 

For the assessed machines that are reporting updates, you can initiate an update deployment that starts immediately.

1. Select one or more machines from the list.
1. In **Manage updates** select **One time update** option from the drop-down.
1. Select **Install Now** to proceed with installing updates.
1. In **Machines** tab, verify the list of machines. You can further add or remove machines from the list and click **Next**.
1. In **Updates** tab, specify the updates that must be included for the following criteria:
    - Include update classification
    - Include KB ID/package
    - Exclude KB ID/package
    - Include by maximum patch publish date
1. In **Properties** tab, specify the following:
    - Reboot option
    - Maintenance window (in minutes)
1. In **Review + install** tab, verify your update deployment options and then select **Install**.

## Change update settings

To configure update settings on the machines, perform the below steps:

1. In **Machines** page, select one or more machines from the list and click **Manage updates**, **Update settings** option.
1. Click **Update Settings** to confirm that you want to change the update settings like patch orchestration, hotpath or periodic assessment for the selected machines.
1. In **Properties** tab, select the option to enable the settings for the machines and click **Next**.
1. In **Machines** tab, select the machine(s) from the list. You can also add or remove machines and select **Next**.
1. In **Review and change**, confirm the updates and select **Review and change**.
    A confirmation appears that update settings have been successfully applied.
  
## Next steps

  Learn on [managing multiple machines](manage-multiple-machines.md).
