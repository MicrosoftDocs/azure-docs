---
title: Quickstart - Create a network security perimeter - Bicep
titleSuffix: Azure Private Link
description: Learn how to create a network security perimeter for an Azure resource using Bicep. This example demonstrates the creation of a network security perimeter for an Azure Key Vault.
author: mbender-ms
ms.author: mbender
ms.service: azure-private-link
ms.topic: quickstart
ms.date: 03/25/2025   
ms.custom: subject-armqs, mode-arm, template-concept, devx-track-bicep
#CustomerIntent: As a network administrator, I want to create a network security perimeter for an Azure resource in the Bicep, so that I can control the network traffic to and from the resource.
# Customer intent: As a network administrator, I want to create a network security perimeter for an Azure Key Vault using Bicep, so that I can manage network traffic securely within a defined boundary.
---

# Quickstart - Create a network security perimeter - Bicep

Get started with network security perimeter by creating a network security perimeter for an Azure Key Vault using Bicep. A [network security perimeter](network-security-perimeter-concepts.md) allows [Azure Platform as a Service (PaaS)](./network-security-perimeter-concepts.md#onboarded-private-link-resources) resources to communicate within an explicit trusted boundary. You create and update a PaaS resource's association in a network security perimeter profile. Then you create and update network security perimeter access rules. When you're finished, you delete all resources created in this quickstart.

[!INCLUDE [About Bicep](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-bicep-introduction.md)]

You can also create a network security perimeter by using the [Azure portal](create-network-security-perimeter-portal.md), [Azure PowerShell](create-network-security-perimeter-powershell.md), or the [Azure CLI](create-network-security-perimeter-cli.md).

[!INCLUDE [network-security-perimeter-preview-message](../../includes/network-security-perimeter-preview-message.md)]

## Prerequisites

- An Azure account with an active subscription. If you don't already have an Azure account, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Review the Bicep file

This Bicep file creates a network security perimeter for an instance of Azure Key Vault.

The Bicep file that this quickstart uses is from [Azure Quickstart Templates](https://github.com/azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.network/network-security-perimeter-create).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.network/network-security-perimeter-create/main.bicep":::


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
    New-AzResourceGroupDeployment -ResourceGroupName resource-group -TemplateFile main.bicep
    ```

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Validate the deployment

1. Sign into the Azure portal.
1. Enter **Network security perimeter** in the search box at the top of the portal. Select **Network security perimeters** in the search results.
1. Select the **networkPerimeter** resource from the list of network security perimeters.
1. Verify that the **networkPerimeter** resource is created successfully. The **Overview** page shows the details of the network security perimeter, including the profiles and associated resources.

## Clean up resources

When you no longer need the resources that you created with the network security perimeter service, delete the resource group. This removes the network security perimeter service and all the related resources.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name resource-group
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name resource-group
```
---

[!INCLUDE [network-security-perimeter-delete-resources](../../includes/network-security-perimeter-delete-resources.md)]

## Next steps

> [!div class="nextstepaction"]
> [Diagnostic logging for Azure Network Security Perimeter](./network-security-perimeter-diagnostic-logs.md)
