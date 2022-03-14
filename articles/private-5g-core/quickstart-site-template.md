---
title: Create a site by using an Azure Resource Manager template (ARM template)
titlesuffix: Azure Private 5G Core Preview
description: Learn how to create a site using an Azure Resource Manager template (ARM template).
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: quickstart
ms.custom: subject-armqs
ms.date: 03/14/2022
---

# Quickstart: Create a site by using an ARM template

Azure Private 5G Core Preview private mobile networks include one or more *sites*. Each site represents a physical enterprise location (for example, Contoso Corporation's Chicago factory) containing an Azure Stack Edge device that hosts a packet core instance. In this article, you use an Azure Resource Manager (ARM template) to create a site in an existing private mobile network.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure.](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/<template's URI>)

## Prerequisites

<!-- 
Need to confirm whether we can have this sentence, as the subscription must meet specific requirements
-->

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Ensure you can sign in to the Azure portal using an account with access to the active subscription you used to create your private mobile network. This account must have the built-in Contributor or Owner role at the subscription scope.
- Complete the steps in [Allocate subnets and IP addresses](complete-private-mobile-network-prerequisites.md#allocate-subnets-and-ip-addresses) and [Order and set up your Azure Stack Edge Pro device(s)](complete-private-mobile-network-prerequisites.md#order-and-set-up-your-azure-stack-edge-pro-devices) for your new site.
- Collect all of the information in [Collect the required information for a site](collect-required-information-for-a-site.md).

## Review the template

<!--
Need to confirm whether the following link is correct.
-->

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/mobilenetwork-create-new-site).

:::code language="json" source="~/quickstart-templates/mobilenetwork-create-new-site/azuredeploy.json":::

<!--
After the JSON code fence, a list of each resourceType from the JSON must exist with a link to the template reference starting with /azure/templates. List the resourceType links in the same order as in the template.

For example:

* [**Microsoft.KeyVault/vaults**](/azure/templates/microsoft.keyvault/vaults): create an Azure key vault.
* [**Microsoft.KeyVault/vaults/secrets**](/azure/templates/microsoft.keyvault/vaults/secrets): create an key vault secret.

The URL usually appears as, for example, https://docs.microsoft.com/azure/templates/Microsoft.Network/2019-11-01/loadBalancers for loadbalancer of Microsoft.Network. Remove the API version from the URL so that the URL redirects to the latest version.
-->

Four Azure resources are defined in the template.

- [**Microsoft.MobileNetwork/mobileNetworks/sites**](https://docs.microsoft.com/azure/templates/microsoft.mobilenetwork/sites): create a site.
- [**Microsoft.MobileNetwork/packetCoreControlPlanes/packetCoreDataPlanes/attachedDataNetworks**](https://docs.microsoft.com/azure/templates/microsoft.mobilenetwork/packetcorecontrolplanes/packetcoredataplanes/attacheddatanetworks): create an attached data network.
- [**Microsoft.MobileNetwork/packetCoreControlPlanes/packetCoreDataPlanes**](https://docs.microsoft.com/azure/templates/microsoft.mobilenetwork/packetcorecontrolplanes/packetcoredataplanes): create a packet core data plane.
- [**Microsoft.MobileNetwork/packetCoreControlPlanes**](https://docs.microsoft.com/azure/templates/microsoft.mobilenetwork/packetcorecontrolplanes): create a packet core control plane.

## Deploy the template

1. Select the following link to sign in to Azure and open a template.

    [![Deploy to Azure.](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.mobilenetwork%2Fmobilenetwork-create-new-site%2Fazuredeploy.json)


<!-- Still need to confirm the correct URL using the guidance below

  - **Portal**: Use a button with description **Deploy to Azure**, and the shared image ../media/template-deployments/deploy-to-azure.svg. The template link starts with https://portal.azure.com/#create/Microsoft.Template/uri/.
  
    ```markdown
    [![Deploy to Azure.](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-key-vault-create%2Fazuredeploy.json)
    ```

    To find more information about this deployment option, see [Use a deployment button to deploy templates from GitHub repository](https://docs.microsoft.com/azure/azure-resource-manager/templates/deploy-to-azure-button).

    The shared button image is in [GitHub](https://github.com/MicrosoftDocs/azure-docs-pr/blob/main/articles/media/template-deployments/deploy-to-azure.svg).
 -->

## Review deployed resources

<!-- This heading must be titled "Review deployed resources" or "Validate the deployment". -->

<!--
Include at least one method that displays the deployed resources. Use a portal screenshot of the resources, or interactive code fences for Azure CLI (`azurecli-interactive`) or Azure PowerShell (`azurepowershell-interactive`).
-->

You can either use the Azure portal to check the deployed resources, or use Azure CLI or Azure PowerShell script to list the deployed resources.

## Clean up resources

<!-- 
The Clean up resources section includes a paragraph that explains how to delete unneeded resources. Include at least one method that shows how to clean up resources. Use a portal screenshot, or interactive code fences for Azure CLI (`azurecli-interactive`) or Azure PowerShell (`azurepowershell-interactive`).
-->

When no longer needed, delete the resource group, which deletes the resources in the resource group.

<!--

Choose Azure CLI, Azure PowerShell, or Azure portal to delete the resource group.

Here are the samples for Azure CLI and Azure PowerShell:

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
Remove-AzResourceGroup -Name $resourceGroupName
Write-Host "Press [ENTER] to continue..."
```

-->

## Next steps

For a step-by-step tutorial that guides you through the process of creating a template, see:

> [!div class="nextstepaction"]
> [Tutorial: Create and deploy your first ARM template](/azure/azure-resource-manager/templates/template-tutorial-create-first-template)