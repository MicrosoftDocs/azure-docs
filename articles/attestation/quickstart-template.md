---
title: Create an Azure Attestation certificate by using Azure Resource Manager template
description: Learn how to create an Azure Attestation certificate by using Azure Resource Manager template.
services: azure-resource-manager
author: msmbaldwin
ms.service: azure-resource-manager
ms.topic: quickstart
ms.custom: subject-armqs, devx-track-azurepowershell
ms.author: mbaldwin
ms.date: 10/16/2020
---

# Quickstart: Create an Azure Attestation provider with an ARM template

[Microsoft Azure Attestation](overview.md) is a solution for attesting Trusted Execution Environments (TEEs). This quickstart focuses on the process of deploying an Azure Resource Manager template (ARM template) to create a Microsoft Azure Attestation policy.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy To Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-attestation-provider-create%2Fazuredeploy.json)

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-attestation-provider-create).

:::code language="json" source="~/quickstart-templates/101-attestation-provider-create/azuredeploy.json":::

Azure resources defined in the template:

- Microsoft.Attestation/attestationProviders

## Deploy the template

1. Select the following image to sign in to Azure and open the template.

    [![Deploy To Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-attestation-provider-create%2Fazuredeploy.json)

1. Select or enter the following values.

    Unless it's specified, use the default value to create the attestation provider.

    - **Attestation Provider Name**: Select a name for your Azure Attestation provider.
    - **Location**: Select a location. For example, **Central US**.
    - **Tags**: Select a location. For example, **Central US**.

1. Select **Purchase**. After the attestation resource has been deployed successfully, you get a notification.

The Azure portal is used to deploy the template. In addition to the Azure portal, you can also use the Azure PowerShell, Azure CLI, and REST API. To learn other deployment methods, see [Deploy templates](../azure-resource-manager/templates/deploy-powershell.md).

## Review deployed resources

You can use the Azure portal to check the attestation resource.

## Clean up resources

Other Azure Attestation build upon this quickstart. If you plan to continue on to work with subsequent quickstarts and tutorials, you may wish to leave these resources in place.

When no longer needed, delete the resource group, which deletes the Attestation resource. To delete the resource group by using Azure CLI or Azure PowerShell:

# [CLI](#tab/CLI)

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
Remove-AzResourceGroup -Name $resourceGroupName
Write-Host "Press [ENTER] to continue..."
```

---

## Next steps

In this quickstart, you created an attestation resource using an ARM template, and validated the deployment. To learn more about Azure Attestation, see [Overview of Azure Attestation](overview.md).
