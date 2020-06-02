---
title: Enable Azure Automation Update Management from Automation account
description: This article tells how to enable Update Management from an Automation account.
services: automation
ms.date: 4/11/2019
ms.topic: conceptual
ms.custom: mvc
---
# Enable Update Management from an Automation account

This article describes how you can use your Automation account to enable the [Update Management](automation-update-management.md) feature for VMs in your environment. To enable Azure VMs at scale, you must enable an existing VM using Update Management. 

> [!NOTE]
> When enabling Update Management, only certain regions are supported for linking a Log Analytics workspace and an Automation account. For a list of the supported mapping pairs, see [Region mapping for Automation account and Log Analytics workspace](how-to/region-mappings.md).

## Prerequisites

* Azure subscription. If you don't have one yet, you can [activate your MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* [Automation account](automation-offering-get-started.md) to manage machines.
* A [virtual machine](../virtual-machines/windows/quick-create-portal.md).

## Sign in to Azure

Sign in to Azure at https://portal.azure.com.

## Enable Update Management

1. In your Automation account, select **Update management** under **Update management**.

2. Choose the Log Analytics workspace and Automation account and click **Enable** to enable Update Management. The setup takes up to 15 minutes to complete.

    ![Enable Update Management](media/automation-onboard-solutions-from-automation-account/onboardsolutions2.png)

## Enable Azure VMs

1. From your Automation account select **Update management** under **Update management**.

2. Click **+ Add Azure VMs** and select one or more VMs from the list. Virtual machines that can't be enabled are grayed out and unable to be selected. Azure VMs can exist in any region no matter the location of your Automation account. 

3. Click **Enable** to add the selected VMs to the computer group saved search for the feature.

    ![Enable Azure VMs](media/automation-onboard-solutions-from-automation-account/enable-azure-vms.png)

## Enable non-Azure VMs

Machines not in Azure need to be added manually. 

1. From your Automation account, select **Update management** under **Update management**.

2. Click **Add non-Azure machine**. This action opens up a new browser window with [instructions to install and configure the Log Analytics agent for Windows](../azure-monitor/platform/log-analytics-agent.md) so that the machine can begin reporting Update Management operations. If you're enabling a machine that's currently managed by Operations Manager, a new agent isn't required and the workspace information is entered into the existing agent.

## Enable machines in the workspace

Manually installed machines or machines already reporting to your workspace must to be added to Azure Automation for Update Management to be enabled. 

1. From your Automation account, select **Update management** under **Update management**.

2. Select **Manage machines**. The **Manage machines** button might be grayed out if you previously chose the option **Enable on all available and future machines**

    ![Saved searches](media/automation-onboard-solutions-from-automation-account/managemachines.png)

4. To enable Update Management for all available machines, select **Enable on all available machines** on the Manage Machines page. This action disables the control to add machines individually. This task adds all the names of the machines reporting to the workspace to the computer group saved search query. When selected, this action disables the **Manage Machines** button.

5. To enable the feature for all available machines and future machines, select **Enable on all available and future machines**. This option deletes the saved searches and scope configurations from the workspace and opens the feature for all Azure and non-Azure machines that are reporting to the workspace. When selected, this action disables the **Manage Machines** button permanently, as there's no scope configuration left.

6. If necessary, you can add the scope configurations back by re-adding the initial saved searches. For more information, see [Limit Update Management deployment scope](automation-scope-configurations-update-management.md).

7. To enable the feature for one or more machines, select **Enable on selected machines** and click **Add** next to each machine to enable for the feature. This task adds the selected machine names to the computer group saved search query for the feature.

## Next steps

* To use Update Management for VMs, see [Manage updates and patches for your Azure VMs](automation-tutorial-update-management.md).
* To troubleshoot general Update Management errors, see [Troubleshoot Update Management issues](troubleshoot/update-management.md).
* To troubleshoot problems with the Windows update agent, see [Troubleshoot Windows update agent issues](troubleshoot/update-agent-issues.md).
* To troubleshoot problems with the Linux update agent, see [Troubleshoot Linux update agent issues](troubleshoot/update-agent-issues-linux.md).
