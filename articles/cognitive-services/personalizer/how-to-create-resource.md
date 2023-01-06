---
title: Create Personalizer resource
description: In this article, learn how to create a personalizer resource in the Azure portal for each feedback loop. 
author: jcodella
ms.author: jacodel
ms.manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: how-to
ms.date: 03/26/2020 
ms.custom: devx-track-azurecli
---

# Create a Personalizer resource

A Personalizer resource is the same thing as a Personalizer learning loop. A single resource, or learning loop, is created for each subject domain or content area you have. Do not use multiple content areas in the same loop because this will confuse the learning loop and provide poor predictions.

If you want Personalizer to select the best content for more than one content area of a web page, use a different learning loop for each.


## Create a resource in the Azure portal

Create a Personalizer resource for each feedback loop.

1. Sign in to [Azure portal](https://portal.azure.com/#create/Microsoft.CognitiveServicesPersonalizer). The previous link takes you to the **Create** page for the Personalizer service.
1. Enter your service name, select a subscription, location, pricing tier, and resource group.

    > [!div class="mx-imgBorder"]
    > ![Use Azure portal to create Personalizer resource, also called a learning loop.](./media/how-to-create-resource/how-to-create-personalizer-resource-learning-loop.png)

1. Select **Create** to create the resource.

1. After your resource has deployed, select the **Go to Resource** button to go to your Personalizer resource.

1. Select the **Quick start** page for your resource, then copy the values for your endpoint and key. You need both the resource endpoint and key to use the Rank and Reward APIs.

1. Select the **Configuration** page for the new resource to [configure the learning loop](how-to-settings.md).

## Create a resource with the Azure CLI

1. Sign in to the Azure CLI with the following command:

    ```azurecli-interactive
    az login
    ```

1. Create a resource group, a logical grouping to manage all Azure resources you intend to use with the Personalizer resource.


    ```azurecli-interactive
    az group create \
        --name your-personalizer-resource-group \
        --location westus2
    ```

1. Create a new Personalizer resource, _learning loop_, with the following command for an existing resource group.

    ```azurecli-interactive
    az cognitiveservices account create \
        --name your-personalizer-learning-loop \
        --resource-group your-personalizer-resource-group \
        --kind Personalizer \
        --sku F0 \
        --location westus2 \
        --yes
    ```

    This returns a JSON object, which includes your **resource endpoint**.

1. Use the following Azure CLI command to get your **resource key**.

    ```azurecli-interactive
        az cognitiveservices account keys list \
        --name your-personalizer-learning-loop \
        --resource-group your-personalizer-resource-group
    ```

    You need both the resource endpoint and key to use the Rank and Reward APIs.

## Next steps

* [Configure](how-to-settings.md) Personalizer learning loop
