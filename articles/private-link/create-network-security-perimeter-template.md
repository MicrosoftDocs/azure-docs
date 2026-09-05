---
title: Quickstart - Create a network security perimeter - ARM template
titleSuffix: Azure Private Link
description: Learn how to create a network security perimeter for an Azure resource using the Azure Resource Manager template. This example demonstrates the creation of a network security perimeter for an Azure Key Vault.
author: mbender-ms
ms.author: mbender
ms.service: azure-private-link
ms.topic: quickstart
ms.date: 08/05/2026
ms.custom: subject-armqs, mode-arm, template-quickstart, devx-track-arm-template
#CustomerIntent: As a network administrator, I want to create a network security perimeter for an Azure resource in the Azure Resource Manager template, so that I can control the network traffic to and from the resource.
# Customer intent: As a network administrator, I want to create a network security perimeter for an Azure Key Vault using an ARM template, so that I can control and secure the network traffic to and from the resource effectively.
---

# Quickstart - Create a network security perimeter - ARM template

Get started with network security perimeter by creating a network security perimeter for an Azure Key Vault using an Azure Resource Manager template. A [network security perimeter](network-security-perimeter-concepts.md) allows [Azure Platform as a Service (PaaS)](./network-security-perimeter-concepts.md#onboarded-private-link-resources) resources to communicate within an explicit trusted boundary. You create and update a PaaS resource's association in a network security perimeter profile. Then you create and update network security perimeter access rules. When you're finished, you delete all resources created in this quickstart.

[!INCLUDE [About Azure Resource Manager](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-introduction.md)]

You can also create a network security perimeter by using the [Azure portal](create-network-security-perimeter-portal.md), [Azure PowerShell](create-network-security-perimeter-powershell.md), the [Azure CLI](create-network-security-perimeter-cli.md), or [Bicep](create-network-security-perimeter-bicep.md).

[!INCLUDE [network-security-perimeter-preview-message](../../includes/network-security-perimeter-preview-message.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The ARM template opens in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Fnetwork-security-perimeter-create%2Fazuredeploy.json":::

## Prerequisites

- An Azure account with an active subscription. If you don't already have an Azure account, [create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

## Review the template

This template creates a network security perimeter for an instance of Azure Key Vault.

The template that this quickstart uses is from [Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.network/network-security-perimeter-create).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.network/network-security-perimeter-create/azuredeploy.json":::

The template defines multiple Azure resources:

- [**Microsoft.KeyVault/vaults**](/azure/templates/microsoft.keyvault/vaults): The instance of Key Vault that the network security perimeter protects.
- [**Microsoft.Network/networkSecurityPerimeters**](/azure/templates/microsoft.network/networksecurityperimeters): The network security perimeter that you use to access the instance of Key Vault.
- [**Microsoft.Network/networkSecurityPerimeters/profiles**](/azure/templates/microsoft.network/networksecurityperimeters/profiles): The network security perimeter profile that you use to access the instance of Key Vault.
- [**Microsoft.Network/networkSecurityPerimeters/profiles/accessRules**](/azure/templates/microsoft.network/networksecurityperimeters/profiles/accessrules): The access rules that you use to access the instance of Key Vault.
- [**Microsoft.Network/networkSecurityPerimeters/resourceAssociations**](/azure/templates/microsoft.network/networksecurityperimeters/resourceassociations): The resource associations that you use to access the instance of Key Vault.

## Deploy the template

Deploy the ARM template to Azure by doing the following:

1. Sign in to Azure and open the ARM template by selecting the **Deploy to Azure** button at the top of this article. The template creates the network security perimeter and an Azure Key Vault instance.
1. Select your subscription, and then select an existing resource group or create a new one.
1. Accept the default values for the key vault, network security perimeter, profile, access rule, and resource association names, or enter your own values.
1. Select **Review + create**, and then select **Create**. The deployment takes a few minutes to complete.

## Validate the deployment

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Enter **Network security perimeter** in the search box at the top of the portal. Select **Network security perimeters** in the search results.
1. Select the **networkSecurityPerimeter** resource from the list of network security perimeters.
1. Verify that the **networkSecurityPerimeter** resource is created successfully. The **Overview** page shows the details of the network security perimeter, including the profiles and associated resources.

## Clean up resources

When you no longer need the resources that you created with the network security perimeter, delete the resource group. This action removes the network security perimeter and all the related resources.

1. In the Azure portal, search for and select **Resource groups**.
1. Select the resource group that you deployed the template to.
1. Select **Delete resource group**, enter the resource group name to confirm, and then select **Delete**.

[!INCLUDE [network-security-perimeter-delete-resources](../../includes/network-security-perimeter-delete-resources.md)]

## Next step

> [!div class="nextstepaction"]
> [Diagnostic logging for Azure Network Security Perimeter](./network-security-perimeter-diagnostic-logs.md)
