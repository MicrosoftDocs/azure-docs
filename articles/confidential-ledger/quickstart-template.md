---
title: Create an Microsoft Azure confidential ledger by using Azure Resource Manager template
description: Learn how to create an Microsoft Azure confidential ledger by using Azure Resource Manager template.
services: azure-resource-manager
author: msmbaldwin
ms.service: confidential-ledger
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
ms.author: mbaldwin
ms.date: 11/14/2022
---

# Quickstart: Create an Microsoft Azure confidential ledger with an ARM template

[Microsoft Azure confidential ledger](overview.md) is a new and highly secure service for managing sensitive data records. This quickstart describes how to use an Azure Resource Manager template (ARM template) to create a new ledger.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy To Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.confidentialledger%2Fconfidential-ledger-create%2Fazuredeploy.json)

## Prerequisites

### Azure subscription

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

### Register the resource provider

[!INCLUDE [Register the microsoft.ConfidentialLedger resource provider](../../includes/confidential-ledger-register-rp.md)]

### Obtain your principal ID

The template requires a principal ID. You can obtain your principal ID my running the Azure CLI [az ad sp list](/cli/azure/ad/sp#az-ad-sp-list) command, with the `--show-mine` flag:

```azurecli-interactive
az ad sp list --show-mine -o table
```

Your principal ID is shown in the "ObjectId" column.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.confidentialledger/confidential-ledger-create/azuredeploy.json":::

Azure resources defined in the template:

- Microsoft.ConfidentialLedger/ledgers

## Deploy the template

1. Select the following image to sign in to Azure and open the template.

    [![Deploy To Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.confidentialledger%2Fconfidential-ledger-create%2Fazuredeploy.json)

1. Select or enter the following values.

    Unless it's specified, use the default value to create the confidential ledger.

    - **Ledger name**: Select a name for your ledger. Ledger names must be globally unique.
    - **Location**: Select a location. For example, **East US**.
    - **PrincipalId**: Provide the Principal ID you noted in the [Prerequisites](#obtain-your-principal-id) section above.

1. Select **Purchase**. After the confidential ledger resource has been deployed successfully, you will receive a notification.

The Azure portal is used to deploy the template. In addition to the Azure portal, you can also use the Azure PowerShell, Azure CLI, and REST API. To learn other deployment methods, see [Deploy templates](../azure-resource-manager/templates/deploy-powershell.md).

## Review deployed resources

You can use the Azure portal to check the ledger resource.

## Clean up resources

Other Azure confidential ledger articles can build upon this quickstart. If you plan to continue on to work with subsequent quickstarts and tutorials, you may wish to leave these resources in place.

When no longer needed, delete the resource group, which deletes the ledger resource. To delete the resource group by using Azure CLI or Azure PowerShell:

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

In this quickstart, you created an confidential ledger resource using an ARM template and validated the deployment. To learn more about the service, see [Overview of Microsoft Azure confidential ledger](overview.md).
