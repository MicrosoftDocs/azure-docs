---
title: Quickstart - Create geo-replicated registry - Azure Resource Manager template
description: Learn how to create a geo-replicated Azure container registry by using an Azure Resource Manager template.
services: azure-resource-manager
author: dlepow
ms.author: danlep
ms.date: 10/06/2020
ms.topic: quickstart
ms.service: azure-resource-manager
ms.custom:
  - subject-armqs
  - mode-arm
---

# Quickstart: Create a geo-replicated container registry by using an ARM template

This quickstart shows how to create an Azure Container Registry instance by using an Azure Resource Manager template (ARM template). The template sets up a [geo-replicated](container-registry-geo-replication.md) registry, which automatically synchronizes registry content across more than one Azure region. Geo-replication enables network-close access to images from regional deployments, while providing a single management experience. It's a feature of the [Premium](container-registry-skus.md) registry service tier.

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)]

If your environment meets the prerequisites and you're familiar with using ARM templates, select the **Deploy to Azure** button. The template will open in the Azure portal.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-container-registry-geo-replication%2Fazuredeploy.json)

## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Review the template

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/101-container-registry-geo-replication/). The template sets up a registry and an additional regional replica.

:::code language="json" source="~/quickstart-templates/101-container-registry-geo-replication/azuredeploy.json":::

The following resources are defined in the template:

* **[Microsoft.ContainerRegistry/registries](/azure/templates/microsoft.containerregistry/registries)**: create an Azure container registry
* **[Microsoft.ContainerRegistry/registries/replications](/azure/templates/microsoft.containerregistry/registries/replications)**: create a container registry replica

More Azure Container Registry template samples can be found in the [quickstart template gallery](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Containerregistry&pageNumber=1&sort=Popular).

## Deploy the template

 1. Select the following image to sign in to Azure and open a template.

    [![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-container-registry-geo-replication%2Fazuredeploy.json)

 1. Select or enter the following values.

    * **Subscription**: select an Azure subscription.
    * **Resource group**: select **Create new**, enter a unique name for the resource group, and then select **OK**.
    * **Region**: select a location for the resource group. Example: **Central US**.
    * **Acr Name**: accept the generated name for the registry, or enter a name. It must be globally unique.
    * **Acr Admin User Enabled**: accept the default value.
    * **Location**: accept the generated location for the registry's home replica, or enter a location such as **Central US**. 
    * **Acr Sku**: accept the default value.
    * **Acr Replica Location**: enter a location for the registry replica, using the region's short name. It must be different from the home registry location. Example: **westeurope**.

        :::image type="content" source="media/container-registry-get-started-geo-replication-template/template-properties.png" alt-text="Template properties":::

1. Select **Review + Create**, then review the terms and conditions. If you agree, select **Create**.

1. After the registry has been created successfully, you get a notification:

     :::image type="content" source="media/container-registry-get-started-geo-replication-template/deployment-notification.png" alt-text="Portal notification":::

 The Azure portal is used to deploy the template. In addition to the Azure portal, you can use the Azure PowerShell, Azure CLI, and REST API. To learn other deployment methods, see [Deploy templates](../azure-resource-manager/templates/deploy-cli.md).

## Review deployed resources

Use the Azure portal or a tool such as the Azure CLI to review the properties of the container registry.

1. In the portal, search for Container Registries, and select the container registry you created.

1. On the **Overview** page, note the **Login server** of the registry. Use this URI when you use Docker to tag and push images to your registry. For information, see [Push your first image using the Docker CLI](container-registry-get-started-docker-cli.md).

    :::image type="content" source="media/container-registry-get-started-geo-replication-template/registry-overview.png" alt-text="Registry overview":::

1. On the **Replications** page, confirm the locations of the home replica and the replica added through the template. If desired, add more replicas on this page.

    :::image type="content" source="media/container-registry-get-started-geo-replication-template/registry-replications.png" alt-text="Registry replications":::

## Clean up resources

When you no longer need them, delete the resource group, the registry, and the registry replica. To do so, go to the Azure portal, select the resource group that contains the registry, and then select **Delete resource group**.

:::image type="content" source="media/container-registry-get-started-geo-replication-template/delete-resource-group.png" alt-text="Delete resource group":::

## Next steps

In this quickstart, you created an Azure Container Registry with an ARM template, and configured a registry replica in another location. Continue to the Azure Container Registry tutorials for a deeper look at ACR.

> [!div class="nextstepaction"]
> [Azure Container Registry tutorials](container-registry-tutorial-prepare-registry.md)

For a step-by-step tutorial that guides you through the process of creating a template, see:

> [!div class="nextstepaction"]
> [Tutorial: Create and deploy your first ARM template](../azure-resource-manager/templates/template-tutorial-create-first-template.md)
