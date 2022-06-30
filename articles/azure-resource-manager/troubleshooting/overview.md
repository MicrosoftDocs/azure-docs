---
title: Overview of ARM template and Bicep file troubleshooting
description: Describes troubleshooting for Azure resource deployment with Azure Resource Manager templates (ARM templates) and Bicep files.
ms.topic: overview
ms.date: 10/26/2021
ms.custom: troubleshooting-overview
---

# What is deployment troubleshooting?

When you deploy Bicep files or Azure Resource Manager templates (ARM templates), you may get an error. This documentation helps you find possible solutions for the error.

## Error types

There are two types of errors you can get - **validation errors** and **deployment errors**.

Validation errors happen before the deployment is started. These errors can be determined without interacting with your current Azure environment. For example, validation makes you aware of syntax errors or missing arguments for a function before your deployment starts.

Deployment errors can only be determined by attempting the deployment and interacting with your Azure environment. For example, a virtual machine (VM) requires a network interface card (NIC). If the NIC doesn't exist when the VM is deployed, you get a deployment error.

## Troubleshooting tools

To help identify syntax errors before a deployment, use the latest version of [Visual Studio Code](https://code.visualstudio.com). Install the latest version of either:

* [Bicep extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep)
* [Azure Resource Manager Tools extension](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools)

To troubleshoot deployments, it's helpful to learn about a resource provider's properties or API versions. For more information, see [Define resources with Bicep and ARM templates](/azure/templates).

To follow best practices for developing your templates, use either:

* [Bicep linter](../bicep/linter.md)
* [ARM template test toolkit](../templates/test-toolkit.md)

When you deploy, you can find the cause of errors from the Azure portal in a resource group's **Deployments** or **Activity log**. If you're using Azure PowerShell, use commands like [Get-AzResourceGroupDeploymentOperation](/powershell/module/az.resources/get-azresourcegroupdeploymentoperation) and [Get-AzActivityLog](/powershell/module/az.monitor/get-azactivitylog). For Azure CLI, use commands like [az deployment operation group](/cli/azure/deployment/operation/group) and [az monitor activity-log list](/cli/azure/monitor/activity-log#az-monitor-activity-log-list).

## Next steps

- For solutions based on the error code, see [Troubleshoot common Azure deployment errors](common-deployment-errors.md).
- For an introduction to finding the error code, see [Quickstart: Troubleshoot ARM template deployments](quickstart-troubleshoot-arm-deployment.md) or [Quickstart: Troubleshoot Bicep file deployments](quickstart-troubleshoot-bicep-deployment.md).
