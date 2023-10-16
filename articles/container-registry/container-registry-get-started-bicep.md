---
title: Quickstart - Create registry - Bicep
description: Learn how to create an Azure container registry by using a Bicep file.
services: azure-resource-manager
author: mumian
ms.author: jgao
ms.date: 10/11/2022
ms.topic: quickstart
ms.service: container-registry
tags: azure-resource-manager, bicep
ms.custom: mode-api, devx-track-bicep
---

# Quickstart: Create a container registry by using a Bicep file

This quickstart shows how to create an Azure Container Registry instance by using a Bicep file.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Review the Bicep file

Use Visual Studio Code or your favorite editor to create a file with the following content and name it **main.bicep**:

```bicep
@minLength(5)
@maxLength(50)
@description('Provide a globally unique name of your Azure Container Registry')
param acrName string = 'acr${uniqueString(resourceGroup().id)}'

@description('Provide a location for the registry.')
param location string = resourceGroup().location

@description('Provide a tier of your Azure Container Registry.')
param acrSku string = 'Basic'

resource acrResource 'Microsoft.ContainerRegistry/registries@2023-01-01-preview' = {
  name: acrName
  location: location
  sku: {
    name: acrSku
  }
  properties: {
    adminUserEnabled: false
  }
}

@description('Output the login server property for later use')
output loginServer string = acrResource.properties.loginServer

```

The following resource is defined in the Bicep file:

* **[Microsoft.ContainerRegistry/registries](/azure/templates/microsoft.containerregistry/registries)**: create an Azure container registry

More Azure Container Registry template samples can be found in the [quickstart template gallery](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Containerregistry&pageNumber=1&sort=Popular).

## Deploy the Bicep file

To deploy the file you've created, open PowerShell or Azure CLI. If you want to use the integrated Visual Studio Code terminal, select the `ctrl` + ```` ` ```` key combination. Change the current directory to where the Bicep file is located.

# [CLI](#tab/CLI)

```azurecli
az group create --name myContainerRegRG --location centralus

az deployment group create --resource-group myContainerRegRG --template-file main.bicep --parameters acrName={your-unique-name}
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
New-AzResourceGroup -Name myContainerRegRG -Location centralus

New-AzResourceGroupDeployment -ResourceGroupName myContainerRegRG -TemplateFile ./main.bicep -acrName "{your-unique-name}"
```

---

> [!NOTE]
> Replace **{your-unique-name}**, including the curly braces, with a unique container registry name.

When the deployment finishes, you should see a message indicating the deployment succeeded.

## Review deployed resources

Use the Azure portal or a tool such as the Azure CLI to review the properties of the container registry.

1. In the portal, search for **Container Registries**, and select the container registry you created.

1. On the **Overview** page, note the **Login server** of the registry. Use this URI when you use Docker to tag and push images to your registry. For information, see [Push your first image using the Docker CLI](container-registry-get-started-docker-cli.md).

    :::image type="content" source="media/container-registry-get-started-bicep/registry-overview.png" alt-text="Registry overview":::

## Clean up resources

When you no longer need the resource, delete the resource group, and the registry. To do so, go to the Azure portal, select the resource group that contains the registry, and then select **Delete resource group**.

:::image type="content" source="media/container-registry-get-started-bicep/delete-resource-group.png" alt-text="Delete resource group":::

## Next steps

In this quickstart, you created an Azure Container Registry with a Bicep file. Continue to the Azure Container Registry tutorials for a deeper look at ACR.

> [!div class="nextstepaction"]
> [Azure Container Registry tutorials](container-registry-tutorial-prepare-registry.md)

For a step-by-step tutorial that guides you through the process of creating a Bicep file, see:

> [!div class="nextstepaction"]
> [Quickstart: Create Bicep files with Visual Studio Code](../azure-resource-manager/bicep/quickstart-create-bicep-use-visual-studio-code.md)
