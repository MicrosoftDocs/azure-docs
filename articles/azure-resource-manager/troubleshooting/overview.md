---
title: Overview of deployment troubleshooting for Bicep files and ARM templates
description: Describes deployment troubleshooting when you use Bicep files or Azure Resource Manager templates (ARM templates) to deploy Azure resources.
ms.topic: overview
ms.custom: troubleshooting-overview, devx-track-arm-template, devx-track-bicep
ms.date: 04/05/2023
---

# What is deployment troubleshooting?

When you deploy Azure resources with Bicep files or Azure Resource Manager templates (ARM templates), you may get an error. There are troubleshooting tools available to help you resolve syntax errors before deployment. You can get more information about error codes and deployment errors from the Azure portal, Azure PowerShell, and Azure CLI. This documentation helps you find solutions to troubleshoot errors.

## Error types

Validation errors occur before a deployment begins and are caused by incorrect syntax that can be identified by a code editor like Visual Studio Code. For example, a misspelled property name or a function that's missing an argument.

Preflight validation errors occur when a deployment command is run but resources aren't deployed in Azure. For example, if an incorrect parameter value is used, the deployment command returns an error message.

Deployment errors can only be determined by attempting the deployment and interacting with your Azure environment. For example, a virtual machine (VM) requires a network interface card (NIC). If the NIC doesn't exist when the VM is deployed, you get a deployment error.

## Troubleshooting tools

There are several troubleshooting tools available to resolve errors.

### Syntax errors

To help identify syntax errors before a deployment, use the latest version of [Visual Studio Code](https://code.visualstudio.com). Install the latest version of the extension for Bicep or ARM templates.

- [Bicep](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep)
- [Azure Resource Manager Tools](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools)

To follow best practices for developing your deployment templates, use the following tools:

- [Bicep linter](../bicep/linter.md)
- [ARM template test toolkit](../templates/test-toolkit.md)

### Resource provider and API version

To troubleshoot deployments, it's helpful to learn about a resource provider's properties or API versions. For more information, see [Define resources with Bicep and ARM templates](/azure/templates).

### Error details

When you deploy, you can find the cause of errors from the Azure portal in a resource group's **Deployments** or **Activity log**. If you're using Azure PowerShell, use commands like [Get-AzResourceGroupDeploymentOperation](/powershell/module/az.resources/get-azresourcegroupdeploymentoperation) and [Get-AzActivityLog](/powershell/module/az.monitor/get-azactivitylog). For Azure CLI, use commands like [az deployment operation group](/cli/azure/deployment/operation/group) and [az monitor activity-log list](/cli/azure/monitor/activity-log#az-monitor-activity-log-list).

## Next steps

- To learn more about how to find deployment error codes and troubleshoot deployment problems, see [Find error codes](find-error-code.md).
- For solutions based on the error code, see [Troubleshoot common Azure deployment errors](common-deployment-errors.md).
- For an introduction to finding the error code, see [Quickstart: Troubleshoot ARM template JSON deployments](quickstart-troubleshoot-arm-deployment.md) or [Quickstart: Troubleshoot Bicep file deployments](quickstart-troubleshoot-bicep-deployment.md).
