---
title: Remove VMs from Azure Automation Update Management
description: This article tells how to remove VMs from Update Management.
services: automation
ms.topic: conceptual
ms.date: 05/10/2018
ms.custom: mvc
---
# Remove VMs from Update Management

## Sign in to Azure

Sign in to the Azure portal at https://portal.azure.com.

When you're finished deploying updates to VMs in your environment, you can remove them from the [Update Management](automation-update-management.md) feature.

1. From your Automation account, select **Update management** under **Update management**.

2. Use the following command to identify the UUID of a VM that you want to remove from management.

    ```azurecli
    az vm show -g MyResourceGroup -n MyVm -d
    ```

3. In your Log Analytics workspace under **General**, access the saved searches.

4. For the saved search `MicrosoftDefaultComputerGroup`, click the ellipsis to the right and select **Edit**. 

5. Remove the UUID for the VM.

6. Repeat the steps for any other VMs to remove.

7. Save the saved search when you're finished editing it. 

## Next steps

* [Manage updates and patches for your Azure VMs](automation-tutorial-update-management.md)
* [Unlink workspace from Automation account for Update Management](automation-unlink-workspace-update-management.md)
* [Enable Update Management from an Automation account](automation-onboard-solutions-from-automation-account.md)
* [Enable Update Management from the Azure portal](automation-onboard-solutions-from-browse.md)
* [Enable Update Management from a runbook](automation-onboard-solutions.md)
* [Enable Update Management from an Azure VM](automation-onboard-solutions-from-vm.md)
* [Troubleshoot Update Management issues](troubleshoot/update-management.md)
* [Troubleshoot Windows update agent issues](troubleshoot/update-agent-issues.md)
* [Troubleshoot Linux update agent issues](troubleshoot/update-agent-issues-linux.md)
