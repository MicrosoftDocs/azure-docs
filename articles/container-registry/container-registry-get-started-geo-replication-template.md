---
title: Quickstart - Create geo-replicated registry - Resource Manager template
description: Learn how to create a geo-replicated Azure container registry by using an Azure Resource Manager template.
services: azure-resource-manager
author: dlepow
ms.service: azure-resource-manager
ms.topic: quickstart
ms.custom: subject-armqs
ms.author: danlep
ms.date: 04/23/2020
---

# Quickstart: Create a geo-replicated Azure container registry by using a Resource Manager template

Azure Container Registry is a managed Docker container registry service used for storing private Docker container images and related artifacts. This quickstart shows how to create an Azure Container Registry instance using an Azure Resource Manager template. The template sets up a [geo-replicated](container-registry-geo-replication.md) registry, which automatically synchronizes registry content across more than one Azure region. Geo-replication is a feature of the [Premium](container-registry-skus.md) registry service tier and enables network-close access to imanges from regional deployments, while providing a single management experience.

<!-- The second paragraph must be the following include file. You might need to change the file path of the include file depending on your content structure. This include is a paragraph that consistently introduces ARM concepts before doing a deployment and includes all our desired links to ARM content.-->

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Prerequisites

None.

## Create a geo-replicated registry

### Review the template

<!-- The first sentence must be the following sentence. The link is the quickstart template from GitHub. The link must begin with https://github.com/Azure/azure-quickstart-templates/. -->

The template used in this quickstart is from [Azure Quickstart templates](https://github.com/Azure/azure-quickstart-templates/tree/master/101-container-registry-geo-replication).

<!-- After the first sentence, add a JSON codefence that links to the quickstart template. Customers have provided feedback that they prefer to see the whole template; therefore, we recommend you include the whole template in your article. If your template is too long to show in the quickstart, you can instead add a sentence that says "The template for this article is too long to show here. To view the template, see ..."

The syntax for the codefence is: -->

:::code language="json" source="~/quickstart-templates/101-container-registry-geo-replication/azuredeploy.json" range="000-000" highlight="000-000":::

<!-- After the JSON codefence, a list of each resourceType from the JSON must exist with a link to the template reference starting with /azure/templates. For example:

* [**Microsoft.KeyVault/vaults**](/azure/templates/microsoft.keyvault/vaults): create an Azure key vault.
* [**Microsoft.KeyVault/vaults/secrets**](/azure/templates/microsoft.keyvault/vaults/secrets): create an key vault secret.

The URL usually appears as, for example, https://docs.microsoft.com/en-us/azure/templates/Microsoft.Network/2019-11-01/loadBalancers for loadbalancer of Microsoft.Network. Remove the API version from the URL, the URL redirects the users to the latest version.
-->

The following resources are defined in the template:

* **[Microsoft.ContainerRegistry/registries](/azure/templates/microsoft.containerregistry/registries)**: create an Azure container registry
* **[Microsoft.ContainerRegistry/registries/replications](/azure/templates/microsoft.containerregistry/registries/replications)**: create a container registry replica

<!-- List additional quickstart templates. For example: [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Keyvault&pageNumber=1&sort=Popular).
Notice the resourceType and sort elements in the URL.
-->


More Azure Container Registry template samples can be found in the [quickstart template gallery](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Containerregistry&pageNumber=1&sort=Popular).
### Deploy the template

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
 1. Select the following image to sign in to Azure and open a template. The template creates a registry and a replica in another location.

   [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-container-registry-geo-replication%2Fazuredeploy.json

 2. Select or enter the following values:
   Unless it is specified, use the default values to create the Azure Container Registry resources.

    * **Subscription**: select an Azure subscription.
    * **Resource group**: select **Create new**, enter a unique name for the resource group, and then click **OK**.
    * **Location**: select a location for the resource group and registry home replica. For example, **Central US**.
    * **Acr Name**: accept the generated name, or enter a name for the registry. It must be globally unique.
    * **Acr Replica Location**: enter a location for the registry replica. It must be different from the home registry location. Enter the location using the short Azure region name, for example, **westus**.
    * **I agree to the terms and conditions stated above**: Select.
[TODO: Add Replication page screenshot]
 3. If you accept the terms and conditions, select **Purchase**. After the registry has been created successfully, you get a notification:

[tO DO: Add screenshot - need to use consistent names throughout]

 The Azure portal is used to deploy the template. In addition to the Azure portal, you can also use the Azure PowerShell, Azure CLI, and REST API. To learn other deployment methods, see [Deploy templates](../azure-resource-manager/templates/deploy-cli.md).

## Review deployed resources

You can use the Azure portal to check the container registry.

1. In the portal, search for Container Registries, and select the container registry you created.
1. On the **Overview** page, note the **Login server** of the registry. Use this URI with Docker to tag and push images to your registry. For information, see [Push your first image using the Docker CLI](container-registry-get-started-docker-cli.md).
[TODO: Add Overview page screenshot]
1. On the **Replications** page, confirm the locations of the home replica and the replica added through the template. If desired, add more replicas on this page.
[TODO: Add Replication page screenshot]


## Clean up resources

When you no longer need them, delete the resource group, the registry, and the related replication. To do so, go to the Azure portal, select the resource group that contains the registry, and then select **Delete resource group**.

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
In this quickstart, you created an Azure Container Registry with a Resource Manager template, and configured a registry replica in another location. Continue to the Azure Container Registry tutorials for a deeper look at ACR.

> [!div class="nextstepaction"]
> [Azure Container Registry tutorials](container-registry-tutorial-prepare-registry.md)

For a step-by-step tutorial that guides you through the process of creating a template, see:

> [!div class="nextstepaction"]
> [ Tutorial: Create and deploy your first Azure Resource Manager template](/azure/azure-resource-manager/templates/template-tutorial-create-first-template.md)