---
title: Quickstart - Create a network security perimeter - Bicep
description: Learn how to create a network security perimeter for an Azure resource using the Bicep. This example demonstrates the creation of a network security perimeter for an Azure Key Vault.
author: mbender-ms
ms.author: mbender
ms.service: azure-private-link
ms.topic: quickstart
ms.date: 03/05/2024
ms.custom: subject-armqs, mode-arm, template-concept, devx-track-bicep
#CustomerIntent: As a network administrator, I want to create a network security perimeter for an Azure resource in the Bicep, so that I can control the network traffic to and from the resource.
---

# Quickstart - Create a network security perimeter - Bicep

In this quickstart, you'll use a Bicep template to create a network security perimeter for an Azure resource. This example demonstrates the creation of a network security perimeter for an Azure Key Vault.

[!INCLUDE [About Bicep](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-bicep-introduction.md)]

You can also create a network security perimeter by using the [Azure portal](create-network-security-perimeter-portal.md), [Azure PowerShell](create-network-security-perimeter-powershell.md), or the [Azure CLI](create-network-security-perimeter-cli.md).

## Prerequisites

You need an Azure account with an active subscription. If you don't already have an Azure account, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Review the Bicep file

This Bicep file creates a network security perimeter for an instance of Azure Key Vault.

The Bicep file that this quickstart uses is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/network-security-perimeter-create/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.sql/network-secuirty-perimeter-create/main.bicep":::


The Bicep file defines multiple Azure resources:
- [**Microsoft.KeyVault/vaults**](/azure/templates/microsoft.keyvault/vaults): The instance of Key Vault with the sample database.
- [**Microsoft.Network/networkSecurityPerimeters**](/azure/templates/microsoft.network/networksecurityperimeters): The network security perimeter that you use to access the instance of Key Vault.
- [**Microsoft.Network/networkSecurityPerimeters/profiles**](/azure/templates/microsoft.network/networksecurityperimeters/profiles): The network security perimeter profile that you use to access the instance of Key Vault.
- [**Microsoft.Network/networkSecurityPerimeters/profiles/accessRules**](/azure/templates/microsoft.network/networksecurityperimeters/profiles/accessrules): The access rules that you use to access the instance of Key Vault.
- [**Microsoft.Network/networkSecurityPerimeters/resourceAssociations**](/azure/templates/microsoft.network/networksecurityperimeters/resourceassociations): The resource associations that you use to access the instance of Key Vault.

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name resource-group --location eastus
    az deployment group create --resource-group resource-group --template-file main.bicep --parameters
    networkSecurityPerimeterName=<network-security-perimeter-name>
    ```
    # [PowerShell](#tab/PowerShell)

    ```powershell
    New-AzResourceGroup -Name resource-group -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName resource-group -TemplateFile main.bicep -keyVaultName <key-vault-name> -networkSecurityPerimeterName <network-security-perimeter-name>
    ```

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Validate the deployment

> [!NOTE]
> The Bicep file generates a unique name for the virtual machine myVm<b>{uniqueid}</b> resource, and for the SQL Database sqlserver<b>{uniqueid}</b> resource. Substitute your generated value for **{uniqueid}**.

## Clean up resources

When you no longer need the resources that you created with the private link service, delete the resource group. This removes the private link service and all the related resources.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name resource-group
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name resource-group
```
---
