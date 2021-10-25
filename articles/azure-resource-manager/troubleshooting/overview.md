---
title: Overview of ARM template and Bicep file troubleshooting
description: Describes troubleshooting for Azure resource deployment with Azure Resource Manager templates (ARM templates) and Bicep files.
ms.topic: overview
ms.date: 11/01/2021
ms.custom: troubleshooting-overview
---

# What is deployment troubleshooting?

Azure Resource Manager templates (ARM templates) and Bicep files are used to automate deployment of Azure resources. Errors can occur and the documentation helps you troubleshoot problems and find solutions. The errors must be resolved so that you can deploy the Azure resources you need.

## Deployment errors

Deployment errors are caused by various reasons and can occur during validation before deployment begins or during the deployment.

Validation errors are caused by incorrect syntax, like missing arguments in a function or an invalid element name such as misspelling `apiVersion`.

Deployment errors occur when an invalid value is used, like an API version that doesn't exist for a resource provider. Another example is a resource that wasn't created but is referenced by another resource. For example, a virtual machine (VM) deployment requires a network interface card (NIC). During deployment, if the VM deploys before the NIC, a deployment error occurs. One way to ensure a resource exists before another resource tries to use it during deployment, is to use the `dependsOn` element. Conditional deployments are another option.

## Troubleshooting tools

To help identify syntax errors before a deployment, use the latest versions of [Visual Studio Code](https://code.visualstudio.com) and the [Azure Resource Manager Tools extension](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools) or [Bicep extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep).

To troubleshoot ARM templates and Bicep files it's helpful to learn about a resource provider's properties or API versions. For more information, see [Define resources with Bicep and ARM templates](/azure/templates).

You can also use the [ARM template test toolkit](../templates/test-toolkit.md) to validate syntax. For Bicep files, use the [Bicep linter](../bicep/linter.md). The toolkit and linter find common errors without doing a deployment.

When you deploy, you can find the cause of errors from the Azure portal in a resource group's **Deployments** or **Activity log**. If you're using Azure PowerShell, use commands like [Get-AzResourceGroupDeploymentOperation](/powershell/module/az.resources/get-azresourcegroupdeploymentoperation) and [Get-AzActivityLog](/powershell/module/az.monitor/get-azactivitylog). For Azure CLI, use commands like [az deployment operation group](/cli/azure/deployment/operation/group) and [az monitor activity-log list](/cli/azure/monitor/activity-log#az_monitor_activity_log_list).

## Next steps

- To learn more about ARM templates, see the [ARM template documentation](/azure/azure-resource-manager/templates).
- To learn more about Bicep, see the [Bicep documentation](/azure/azure-resource-manager/bicep).
