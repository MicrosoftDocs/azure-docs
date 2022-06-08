---
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: include
ms.date: 06/02/2022
---

1. If you haven't already, sign in to the Azure CLI using the [``az login``](/cli/azure/reference-index#az-login) command.

1. Use the [``az group create``](/cli/azure/group#az-group-create) command to create a new resource group in your subscription.

    ```azurecli-interactive
    az group create \
        --name $resourceGroupName \
        --location $location
    ```

1. Create a new ``.bicep`` file with the deployment template in the Bicep syntax.

    :::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.documentdb/cosmosdb-sql/main.bicep":::

1. Deploy the Azure Resource Manager (ARM) template with [``az deployment group create``](/cli/azure/deployment/group#az-deployment-group-create)
specifying the filename using the **template-file** parameter and the name ``initial-bicep-deploy`` using the **name** parameter.

    ```azurecli-interactive
    az deployment group create \
        --resource-group $resourceGroupName \
        --name initial-bicep-deploy \
        --template-file main.bicep \
        --parameters accountName=$accountName
    ```

    > [!NOTE]
    > In this example, we assume that the name of the Bicep file is **main.bicep**.

1. Validate the deployment by showing metadata from the newly created account using [``az cosmosdb show``](/cli/azure/cosmosdb#az-cosmosdb-show).

    ```azurecli-interactive
    az cosmosdb show \
        --resource-group $resourceGroupName \
        --name $accountName
    ```
