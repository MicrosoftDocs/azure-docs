---
title: Enable Azure Automation Update Management from the Azure portal
description: This article tells how to enable Update Management from the Azure portal.
services: automation
ms.date: 04/11/2019
ms.topic: article
ms.custom: mvc
---
# Enable Update Management from the Azure portal

This article describes how you can enable the [Update Management](automation-update-management.md) feature for VMs by browsing the Azure portal. To enable Azure VMs at scale, you must enable an existing VM using Update Management. 

The number of resource groups that you can use for managing your VMs is limited by the [Resource Manager deployment limits](../azure-resource-manager/templates/cross-resource-group-deployment.md). Resource Manager deployments, not to be confused with Update deployments, are limited to five resource groups per deployment. Two of these resource groups are reserved to configure the Log Analytics workspace, Automation account, and related resources. This leaves you with three resource groups to select for management by Update Management. This limit only applies to simultaneous setup, not the number of resource groups that can be managed by an Automation feature.

> [!NOTE]
> When enabling Update Management, only certain regions are supported for linking a Log Analytics workspace and an Automation Account. For a list of the supported mapping pairs, see [Region mapping for Automation Account and Log Analytics workspace](how-to/region-mappings.md).

## Prerequisites

* Azure subscription. If you don't have one yet, you can [activate your MSDN subscriber benefits](https://azure.microsoft.com/pricing/member-offers/msdn-benefits-details/) or sign up for a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* [Automation account](automation-offering-get-started.md) to manage machines.
* A [virtual machine](../virtual-machines/windows/quick-create-portal.md).

## Sign in to Azure

Sign in to Azure at https://portal.azure.com.

## Enable Update Management

1. In the Azure portal, navigate to **Virtual machines**.

2. Use the checkboxes to choose the VMs to add to Update Management. You can add machines for up to three different resource groups at a time. Azure VMs can exist in any region, no matter the location of your Automation account.

    ![List of VMs](media/automation-onboard-solutions-from-browse/vmlist.png)

    > [!TIP]
    > Use the filter controls to select VMs from different subscriptions, locations, and resource groups. You can click the top checkbox to select all virtual machines in a list.

    ![Enable Update Management](media/automation-onboard-solutions-from-browse/onboardsolutions.png)

3. Click **Services** and select **Update Management** for the Update Management feature. 

4. The list of virtual machines is filtered to show only the virtual machines that are in the same subscription and location. If your virtual machines are in more than three resource groups, the first three resource groups are selected.

5. An existing Log Analytics workspace and Automation account are selected by default. If you want to use a different Log Analytics workspace and Automation account, click **CUSTOM** to select them from the Custom Configuration page. When you choose a Log Analytics workspace, a check is made to determine if it is linked with an Automation account. If a linked Automation account is found, you see the following screen. When done, click **OK**.

    ![Select workspace and account](media/automation-onboard-solutions-from-browse/selectworkspaceandaccount.png)

6. If the workspace selected is not linked to an Automation account, you see the following screen. Select an Automation account and click **OK** when finished.

    ![No workspace](media/automation-onboard-solutions-from-browse/no-workspace.png)

7. Deselect the checkbox next to any virtual machine that you don't want to enable. VMs that can't be enabled are already deselected.

8. Click **Enable** to enable the feature you've selected. The setup takes up to 15 minutes to complete.

## Next steps

* To use Update Management for VMs, see [Manage updates and patches for your Azure VMs](automation-tutorial-update-management.md).
* To troubleshoot general Update Management errors, see [Troubleshoot Update Management issues](troubleshoot/update-management.md).
* To troubleshoot problems with the Windows update agent, see [Troubleshoot Windows update agent issues](troubleshoot/update-agent-issues.md).
* To troubleshoot problems with the Linux update agent, see [Troubleshoot Linux update agent issues](troubleshoot/update-agent-issues-linux.md).
