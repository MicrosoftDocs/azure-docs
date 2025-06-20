---
title: Quickstart - Create a network security perimeter - ARM Template
description: Learn how to create a network security perimeter for an Azure resource using the Azure Resource Manager template. This example demonstrates the creation of a network security perimeter for an Azure Key Vault.
author: mbender-ms
ms.author: mbender
ms.service: azure-private-link
ms.topic: quickstart
ms.date: 03/25/2025
ms.custom: subject-armqs, mode-arm, template-quickstart, devx-track-arm-template
#CustomerIntent: As a network administrator, I want to create a network security perimeter for an Azure resource in the Azure Resource Manager template, so that I can control the network traffic to and from the resource.
# Customer intent: As a network administrator, I want to create a network security perimeter for an Azure Key Vault using an ARM template, so that I can control and secure the network traffic to and from the resource effectively.
---

# Quickstart - Create a network security perimeter - ARM Template

Get started with network security perimeter by creating a network security perimeter for an Azure key vault using Azure Resource Manager (ARM) template. A [network security perimeter](network-security-perimeter-concepts.md) allows [Azure Platform as a Service (PaaS)](./network-security-perimeter-concepts.md#onboarded-private-link-resources) resources to communicate within an explicit trusted boundary. You create and update a PaaS resource's association in a network security perimeter profile. Then you create and update network security perimeter access rules. When you're finished, you delete all resources created in this quickstart.

[!INCLUDE [About Azure Resource Manager](~/reusable-content/ce-skilling/azure/includes/resource-manager-quickstart-introduction.md)]

You can also create a network security perimeter by using the [Azure portal](create-network-security-perimeter-portal.md), [Azure PowerShell](create-network-security-perimeter-powershell.md), or the [Azure CLI](create-network-security-perimeter-cli.md).

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button here. The ARM template will open in the Azure portal.

:::image type="content" source="~/reusable-content/ce-skilling/azure/media/template-deployments/deploy-to-azure-button.svg" alt-text="Button to deploy the Resource Manager template to Azure." border="false" link="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.network%2Fnetwork-security-perimeter-create%2Fazuredeploy.json":::

## Prerequisites

- An Azure account with an active subscription. If you don't already have an Azure account, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Review the template

This template creates a private endpoint for an instance of Azure SQL Database.

The template that this quickstart uses is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/network-security-perimeter-create/).

:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.network/network-security-perimeter-create/azuredeploy.json":::

The template defines multiple Azure resources:

- [**Microsoft.KeyVault/vaults**](/azure/templates/microsoft.keyvault/vaults): The instance of Key Vault with the sample database.
- [**Microsoft.Network/networkSecurityPerimeters**](/azure/templates/microsoft.network/networksecurityperimeters): The network security perimeter that you use to access the instance of Key Vault.
- [**Microsoft.Network/networkSecurityPerimeters/profiles**](/azure/templates/microsoft.network/networksecurityperimeters/profiles): The network security perimeter profile that you use to access the instance of Key Vault.
- [**Microsoft.Network/networkSecurityPerimeters/profiles/accessRules**](/azure/templates/microsoft.network/networksecurityperimeters/profiles/accessrules): The access rules that you use to access the instance of Key Vault.
- [**Microsoft.Network/networkSecurityPerimeters/resourceAssociations**](/azure/templates/microsoft.network/networksecurityperimeters/resourceassociations): The resource associations that you use to access the instance of Key Vault.

## Deploy the template

Deploy the ARM template to Azure by doing the following:

1. Sign in to Azure and open the ARM template by selecting the **Deploy to Azure** button here. The template creates the network security perimeter and an Azure Key Vault instance.



1. Select your resource group or create a new one.
1. Enter the SQL administrator sign-in name and password.
1. Enter the virtual machine administrator username and password.
1. Read the terms and conditions statement. If you agree, select **I agree to the terms and conditions stated above**, and then select **Purchase**. The deployment can take 20 minutes or longer to complete.

## Validate the deployment




### Clean up resources

When you no longer need the resources that you created with the private endpoint, delete the resource group. Doing so removes the private endpoint and all the related resources.

To delete the resource group, run the `Remove-AzResourceGroup` cmdlet:

```azurepowershell-interactive
Remove-AzResourceGroup -Name <your resource group name>
```

## Next steps

For more information about the services that support private endpoints, see:
> [!div class="nextstepaction"]
> [What is Azure Private Link?](private-link-overview.md#availability)
