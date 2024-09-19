---
title: Azure Update Manager Troubleshooter
description: Identify common issues using the Troubleshooter in Azure Update Manager.
ms.service: azure-update-manager
ms.date: 09/17/2024
ms.topic: troubleshooting
ms.author: sudhirsneha
author: SnehaSudhirG
---

# Troubleshoot issues in Azure Update Manager

This article describes how to use the Troubleshooter in Azure Update Manager to identify common issues and how to resolve them. 

The Troubleshooter option is enabled when checking for history of only **Failed** operations in Azure Update Manager. 

:::image type="content" source="./media/troubleshooter-known-issues/history-failed-operations.png" alt-text="Screenshot that shows the history of failed operations. " lightbox="./media/troubleshooter-known-issues/history-failed-operations.png":::

The Troubleshooter can also be seen when checking history of **Failed** operations in the machine’s updates history tab. 


:::image type="content" source="./media/troubleshooter-known-issues/history-failed-operations-updates.png" alt-text="Screenshot that shows the history of failed operations in machine’s updates history tab. " lightbox="./media/troubleshooter-known-issues/history-failed-operations-updates.png":::

## Prerequisites 

- For Azure Machines, ensure that the guest agent version on the VM is 2.4.0.2 or higher and agent status is **Ready**. 

- For Arc Machines, ensure that the arc agent version on the machine is 1.39 or higher and agent status is **Connected**. 

- The Troubleshooter isn't applicable if the operation type is Azure Managed Safe Deployment, that is, Auto Patching. 

- Ensure that the machine is present and running. 

- For executing RUN commands, you must have the following permissions:

   - Microsoft.Compute/virtualMachines/runCommand/write permission (for Azure) - The [Virtual Machine Contributor](/azure/role-based-access-control/built-in-roles#virtual-machine-contributor) role and higher levels have this permission. 
   - Microsoft.HybridCompute/machines/runCommands/write permission (for Arc) - The [Azure Connected Machine Resource Administrator](/azure/role-based-access-control/built-in-roles) role and higher levels have this permission.

- Ensure the machine can access [user content](https://raw.githubusercontent.com/) as it needs to retrieve the [scripts](https://github.com/Azure/AzureUpdateManager) during the execution of the Troubleshooter.


## What does the Troubleshooter do? 

The troubleshooter performs two types of checks for both Azure and Arc machines. 

- For the machine under troubleshooting, the Troubleshooter runs Resource Graph Queries to obtain details about the machine's current state, assessment mode settings, patch mode settings, and the status of various services running on it. For example, for Azure machines, it gets details about the guest agent while for Arc machines it gets details about arc agent and its status. 
- The troubleshooter executes Managed RUN Commands on the machine to execute scripts that fetch information about the update related service and configurations for the machines. *The script doesn't make any modifications to your machine.* 

You can find the [scripts](https://github.com/Azure/AzureUpdateManager/tree/main/Troubleshooter) here. 

Post performing the checks, the troubleshooter suggests possible mitigations to test for checks that failed. Follow the mitigation links and take appropriate actions. 


:::image type="content" source="./media/troubleshooter-known-issues/check-updates-run.png" alt-text="Screenshot that shows possible mitigations to test for checks that failed. " lightbox="./media/troubleshooter-known-issues/check-updates-run.png":::

## What are Managed RUN Commands? 

- Managed RUN commands use the Guest agent for Azure machines and Arc Agent for Arc machines to remotely and securely executed commands or scripts inside your machine.  

- Managed RUN commands don't require any additional extension to be installed on your machines. 

- Managed RUN commands are generally available for Azure while it is in preview for Arc.

- Learn more about [Managed RUN command for Azure](/azure/virtual-machines/run-command-overview) and [Managed RUN command for Arc](/azure/azure-arc/servers/run-command).

## Next steps
* To learn more about Update Manager, see the [Overview](overview.md).
* To view logged results from all your machines, see [Querying logs and results from Update Manager](query-logs.md).
 
