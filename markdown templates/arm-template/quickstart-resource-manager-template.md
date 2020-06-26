---
title: Create a .... by using Azure Resource Manager template
description: Learn how to create an Azure ... by using Azure Resource Manager template.
services: azure-resource-manager
author: your-github-account-name
ms.service: azure-resource-manager
ms.topic: quickstart
ms.custom: subject-armqs
ms.author: your-msft-alias
ms.date: 03/17/22
---

<!-- ms.topic and ms.custom in the metadata section are required -->

<!-- 
Remove all the comments from this template before your article is pushed to GitHub and published.
-->

<!-- The H1 must begin with Quickstart: and include the words ARM template. -->

# Quickstart: The H1 heading must include the words ARM template

<!--
The second paragraph must be the following include file. You might need to change the file path of the include file depending on your content structure. This include is a paragraph that consistently introduces ARM concepts before doing a deployment and includes all our desired links to ARM content.-->

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

<!-- 
The final paragraph explains that readers who are experienced with ARM templates can continue to the deployment.

For information about the button image and how to create the template's URI, see the section "Deploy the template" for Portal.
-->

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/<template's URI>)

## Prerequisites

<!-- 
This section must begin with a sentence that includes a link to create a free Azure account. If your service has other prerequisites, list them after the free account sentence.
-->

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the template

<!--
The first sentence must be the following sentence. Use a link to the quickstart gallery that begins with https://azure.microsoft.com/resources/templates/.
-->

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/<templateName>).

<!-- 
After the first sentence, add a JSON code fence that links to the quickstart template. Customers have provided feedback that they prefer to see the whole template. We recommend you include the entire template in your article. If your template is too long to show in the quickstart (more than 250 lines), you can instead add a sentence that says - The template for this article is too long to show here. To view the template, see [azuredeploy.json](link to template's raw output).

The syntax for the code fence is:
-->

:::code language="json" source="~/quickstart-templates/<TEMPLATE NAME>/azuredeploy.json" range="000-000" highlight="000-000":::

<!-- For visibility, use highlight for the template's "resources": section. -->

<!--
After the JSON code fence, a list of each resourceType from the JSON must exist with a link to the template reference starting with /azure/templates. List the resourceType links in the same order as in the template.

For example:

* [**Microsoft.KeyVault/vaults**](/azure/templates/microsoft.keyvault/vaults): create an Azure key vault.
* [**Microsoft.KeyVault/vaults/secrets**](/azure/templates/microsoft.keyvault/vaults/secrets): create an key vault secret.

The URL usually appears as, for example, https://docs.microsoft.com/en-us/azure/templates/Microsoft.Network/2019-11-01/loadBalancers for loadbalancer of Microsoft.Network. Remove the API version from the URL so that the URL redirects to the latest version.
-->

- [Azure resource type](link to the template reference)
- [Azure resource type](link to the template reference)

<!--
List additional quickstart templates. For example: [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Keyvault&pageNumber=1&sort=Popular).
Notice the resourceType and sort elements in the URL.
-->

## Deploy the template

<!--
 One of the following options must be included:

  - **CLI**: In an Azure CLI interactive code fence must contain **az deployment group create**.
  - Use Azure CLI version 2.6 or later. To display the version: az --version
  
   For example:

    ```azurecli-interactive
    read -p "Enter a project name that is used for generating resource names:" projectName &&
    read -p "Enter the location (i.e. centralus):" location &&
    templateUri="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.json" &&
    resourceGroupName="${projectName}rg" &&
    az group create --name $resourceGroupName --location "$location" &&
    az deployment group create --resource-group $resourceGroupName --template-uri  $templateUri &&
    echo "Press [ENTER] to continue ..." &&
    read
    ```

  - **PowerShell**: In an Azure PowerShell interactive code fence must contain **New-AzResourceGroupDeployment**. For example:

    ```azurepowershell-interactive
    $projectName = Read-Host -Prompt "Enter a project name that is used for generating resource names"
    $location = Read-Host -Prompt "Enter the location (i.e. centralus)"
    $templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.json"

    $resourceGroupName = "${projectName}rg"

    New-AzResourceGroup -Name $resourceGroupName -Location "$location"
    New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri

    Read-Host -Prompt "Press [ENTER] to continue ..."
    ```

  - **Portal**: Use a button with description **Deploy to Azure**, and the shared image ../media/template-deployments/deploy-to-azure.svg. The template link starts with https://portal.azure.com/#create/Microsoft.Template/uri/.
  
    ```markdown
    [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-key-vault-create%2Fazuredeploy.json)
    ```

    To find more information about this deployment option, see [Use a deployment button to deploy templates from GitHub repository](https://docs.microsoft.com/azure/azure-resource-manager/templates/deploy-to-azure-button).

    The shared button image is in [GitHub](https://github.com/MicrosoftDocs/azure-docs-pr/blob/master/articles/media/template-deployments/deploy-to-azure.svg).
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

<!-- 
Make the next steps similar to other quickstarts and use a blue button to link to the next article for your service. Or direct readers to the article: "Tutorial: Create and deploy your first ARM template" to follow the process of creating a template.

To include additional links for more information about the service, it's acceptable to use a paragraph and bullet points.
-->

For a step-by-step tutorial that guides you through the process of creating a template, see:

> [!div class="nextstepaction"]
> [Tutorial: Create and deploy your first ARM template](/azure/azure-resource-manager/templates/template-tutorial-create-first-template)
