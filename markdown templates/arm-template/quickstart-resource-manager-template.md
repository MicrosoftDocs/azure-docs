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

# The H1 heading must include words "Resource Manager template"

<!-- The second paragraph must be the following include file. You might need to change the file path of the include file depending on your content structure. This include is a paragraph that consistently introduces ARM concepts before doing a deployment and includes all our desired links to ARM content.-->

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Prerequisites

<!-- If there aren't any prerequisites, just place "None" in the section. -->

## Create a ...

<!-- The second H2 must start with "Create a". For example,  'Create a Key Vault', 'Create a virtual machine', etc. -->

### Review the template

<!-- The first sentence must be the following sentence. The link is the quickstart template from GitHub. The link must begin with https://github.com/Azure/azure-quickstart-templates/. -->

The template used in this quickstart is from [Azure Quickstart templates]().

<!-- After the first sentence, add a JSON codefence that links to the quickstart template. Customers have provided feedback that they prefer to see the whole template; therefore, we recommend you include the whole template in your article. If your template is too long to show in the quickstart, you can instead add a sentence that says "The template for this article is too long to show here. To view the template, see ..."

The syntax for the codefence is: -->

:::code language="json" source="~/quickstart-templates/<TEMPLATE NAME>/azuredeploy.json" range="000-000" highlight="000-000":::

<!-- After the JSON codefence, a list of each resourceType from the JSON must exist with a link to the template reference starting with /azure/templates. For example:

* [**Microsoft.KeyVault/vaults**](/azure/templates/microsoft.keyvault/vaults): create an Azure key vault.
* [**Microsoft.KeyVault/vaults/secrets**](/azure/templates/microsoft.keyvault/vaults/secrets): create an key vault secret.

The URL usually appears as, for example, https://docs.microsoft.com/en-us/azure/templates/Microsoft.Network/2019-11-01/loadBalancers for loadbalancer of Microsoft.Network. Remove the API version from the URL, the URL redirects the users to the latest version.
-->

* [Azure resource type](link to the template reference)
* [Azure resource type](link to the template reference)

<!-- List additional quickstart templates. For example: [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Keyvault&pageNumber=1&sort=Popular).
Notice the resourceType and sort elements in the URL.
-->

## Deploy the template

<!--
 One of the following options must be included:

  - **CLI**: In an Azure CLI Interactive codefence must contain **az group deployment create**. For example:

    ```azurecli-interactive
    read -p "Enter a project name that is used for generating resource names:" projectName &&
    read -p "Enter the location (i.e. centralus):" location &&
    templateUri="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.json" &&
    resourceGroupName="${projectName}rg" &&
    az group create --name $resourceGroupName --location "$location" &&
    az group deployment create --resource-group $resourceGroupName --template-uri  $templateUri
    echo "Press [ENTER] to continue ..." &&
    read
    ```

  - **PowerShell**: In an Azure PowerShell Interactive codefence must contain **New-AzResourceGroupDeployment**. For example:

    ```azurepowershell-interactive
    $projectName = Read-Host -Prompt "Enter a project name that is used for generating resource names"
    $location = Read-Host -Prompt "Enter the location (i.e. centralus)"
    $templateUri = "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.json"

    $resourceGroupName = "${projectName}rg"

    New-AzResourceGroup -Name $resourceGroupName -Location "$location"
    New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri $templateUri

    Read-Host -Prompt "Press [ENTER] to continue ..."

    For an example, see Add a description. Press tab when you are done.
    ```

  - **Portal**: A button with description **Deploy Resource Manager template to Azure**, with image **/media/<QUICKSTART FILE NAME>/deploy-to-azure.png*, must exist and have a link that starts with **https://portal.azure.com/#create/Microsoft.Template/uri/**:

    ```markdown
    [![Deploy to Azure](./media/quick-create-template/deploy-to-azure.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-key-vault-create%2Fazuredeploy.json)
    ```

    To get the standard button image and find more information about this deployment option, see [Use a deployment button to deploy templates from GitHub repository](/azure/azure-resource-manager/templates/deploy-to-azure-button.md).
 -->

## Review deployed resources

<!-- You can also use the title "Validate the deployment"-->

## Clean up resources

When no longer needed, delete the resource group, which deletes the resources in the resource group.

<!--

Choose Azure CLI, Azure PowerShell, or Azure portal to delete the resource group. Use [Zone pivots](https://review.docs.microsoft.com/help/contribute/zone-pivots?branch=master) if you want to use multiple options.  Here are the samples for Azure CLI and Azure PowerShell:

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

<!-- You can either make the next steps similar to the next steps in your other quickstarts, or point users to the following tutorial.-->

For a step-by-step tutorial that guides you through the process of creating a template, see:

> [!div class="nextstepaction"]
> [ Tutorial: Create and deploy your first Azure Resource Manager template](/azure/azure-resource-manager/templates/template-tutorial-create-first-template.md)
