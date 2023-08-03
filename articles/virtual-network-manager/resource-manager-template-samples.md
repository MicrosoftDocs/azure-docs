---
title: Azure Resource Manager templates
titleSuffix: Azure Virtual Network Manager
description: This article has links to Azure Resource Manager template examples so you can quickly deploy Azure Virtual Network Manager in various scenarios.
services: virtual-network-manager
author: mbender-ms
ms.service: virtual-network-manager
ms.custom: devx-track-arm-template
ms.topic: sample
ms.date: 03/28/2023
ms.author: mbender
---

# Azure Resource Manager templates for Azure Virtual Network Manager

The following table includes links to Azure Resource Manager template samples for Azure Virtual Network Manager. You can deploy templates using the Azure [portal](../azure-resource-manager/templates/deploy-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json), Azure [CLI](../azure-resource-manager/templates/deploy-cli.md?toc=%2fazure%2fvirtual-network%2ftoc.json), or Azure [PowerShell](../azure-resource-manager/templates/deploy-powershell.md?toc=%2fazure%2fvirtual-network%2ftoc.json). 

To learn how to author your own templates, see [Create your first template](../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) and [Understand the structure and syntax of Azure Resource Manager templates](../azure-resource-manager/templates/syntax.md?toc=%2fazure%2fvirtual-network%2ftoc.json).

For the JSON syntax and properties to use in templates, see [Microsoft.Network resource types](/azure/templates/microsoft.network/allversions).

> [!IMPORTANT]
> In cases where a template is deploying connectivity or security configurations, the template requires a custom deployment script to deploy the configuration. The script is located at the end of the ARM template, and it uses the `Microsoft.Resources/deploymentScripts` resource type. For more information on deployment scripts, review [Use deployment scripts in ARM templates](../azure-resource-manager/templates/deployment-script-template.md).

## Samples
| Example | Description |
|-------- | ----------- |
| [Hub-spoke network topology in Azure](/samples/mspnp/samples/hub-and-spoke-deployment-with-connected-groups/) | Creates a hub-spoke network pattern with customer-managed hub infrastructure components. |
