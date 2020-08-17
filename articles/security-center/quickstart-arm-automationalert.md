---
title: Create a security automation for specific security alerts by using an Azure Resource Manager (ARM) template
description: Learn how to create an Azure Security Center automation to trigger an empty logic app, which will be triggered by specific Security Center alerts by using an Azure Resource Manager (ARM) template
services: azure-resource-manager
author: your-github-account-name
ms.service: azure-resource-manager
ms.topic: quickstart
ms.custom: subject-armqs
ms.author: memildin
ms.date: 08/17/2020
---

# Quickstart: Create an automatic response to a specific security alert using an Azure Resource Manager template (ARM template)

This quickstart page describes how to use an Azure Resource Manager template (ARM template) to create a workflow automation to triggers an empty logic app when specific security alerts are received by Azure Security Center.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3a%2f%2fraw.githubusercontent.com%2fAzure%2fazure-quickstart-templates%2fmaster%2f101-securitycenter-create-automation-for-alertnamecontains%2fazuredeploy.json)


## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

For a list of the roles and permissions required to work with Azure Security Center's workflow automation feature, see [workflow automation](workflow-automation.md).


## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-securitycenter-create-automation-for-alertnamecontains/).

<!-- 
After the first sentence, add a JSON code fence that links to the quickstart template. Customers have provided feedback that they prefer to see the whole template. We recommend you include the entire template in your article. If your template is too long to show in the quickstart (more than 250 lines), you can instead add a sentence that says - The template for this article is too long to show here. To view the template, see [azuredeploy.json](link to template's raw output).

The syntax for the code fence is:
-->

:::code language="json" source="~/azure-quickstart-templates/101-securitycenter-create-automation-for-alertnamecontains/azuredeploy.json":::

<!--
After the JSON code fence, a list of each resourceType from the JSON must exist with a link to the template reference starting with /azure/templates. List the resourceType links in the same order as in the template.

For example:

* [**Microsoft.KeyVault/vaults**](/azure/templates/microsoft.keyvault/vaults): create an Azure key vault.
* [**Microsoft.KeyVault/vaults/secrets**](/azure/templates/microsoft.keyvault/vaults/secrets): create an key vault secret.

The URL usually appears as, for example, https://docs.microsoft.com/azure/templates/Microsoft.Network/2019-11-01/loadBalancers for loadbalancer of Microsoft.Network. Remove the API version from the URL so that the URL redirects to the latest version.
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