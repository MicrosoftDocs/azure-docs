---
title: Enable Azure Automation Update Management from an Azure VM
description: This article tells how to enable Update Management from an Azure VM.
services: automation
ms.date: 03/04/2020
ms.topic: conceptual
ms.custom: mvc
---

# Enable Update Management from an Azure VM

This article describes how you can use an Azure VM to enable the [Update Management](automation-update-management.md) feature on other machines. To enable Azure VMs at scale, you must enable an existing VM using Update Management. 

> [!NOTE]
> When enabling Update Management, only certain regions are supported for linking a Log Analytics workspace and an Automation account. For a list of the supported mapping pairs, see [Region mapping for Automation account and Log Analytics workspace](how-to/region-mappings.md).

## Prerequisites

* Azure subscription. If you don't have one yet, you can [activate your MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* [Automation account](automation-offering-get-started.md) to manage machines.
* A [virtual machine](../virtual-machines/windows/quick-create-portal.md).

## Sign in to Azure

Sign in to the Azure portal at https://portal.azure.com.

## Enable the feature for deployment

1. In the [Azure portal](https://portal.azure.com), select **Virtual machines** or search for and select **Virtual machines** from the Home page.

2. Select the VM for which you want to enable Update Management. VMs can exist in any region, no matter the location of your Automation account. You

3. On the VM page, under **Operations**, select **Update Management**.

4. You must have the `Microsoft.OperationalInsights/workspaces/read` permission to determine if the VM is enabled for a workspace. To learn about additional permissions that are required, see [Permissions needed to enable machines](automation-role-based-access-control.md#feature-setup-permissions). To learn how to enable multiple machines at once, see [Enable Update Management from an Automation account](automation-onboard-solutions-from-automation-account.md).

5. Choose the Log Analytics workspace and Automation account and click **Enable** to enable Update Management. The setup takes up to 15 minutes to complete. 

    ![Enable Update Management](media/automation-tutorial-update-management/manageupdates-update-enable.png)

## Next steps

* To use Update Management for VMs, see [Manage updates and patches for your Azure VMs](automation-tutorial-update-management.md).
* To troubleshoot general Update Management errors, see [Troubleshoot Update Management issues](troubleshoot/update-management.md).
* To troubleshoot problems with the Windows update agent, see [Troubleshoot Windows update agent issues](troubleshoot/update-agent-issues.md).
* To troubleshoot problems with the Linux update agent, see [Troubleshoot Linux update agent issues](troubleshoot/update-agent-issues-linux.md).
