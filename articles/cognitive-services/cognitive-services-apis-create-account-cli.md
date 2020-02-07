---
title: Create a Cognitive Services resource using the Azure CLI
titleSuffix: Azure Cognitive Services
description: Get started with Azure Cognitive Services by creating and subscribing to a resource using the Azure command line interface.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: conceptual
ms.date: 10/04/2019
ms.author: aahi
---

# Create a Cognitive Services resource using the Azure Command-Line Interface(CLI)

Use this quickstart to get started with Azure Cognitive Services using the [Azure Command Line Interface(CLI)](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest). Cognitive Services are represented by Azure [resources](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-portal) that you create in your Azure subscription. After creating the resource, Use the keys and endpoint generated for you to authenticate your applications. 


In this quickstart, you'll learn how to sign up for Azure Cognitive Services and create an account that has a single-service or multi-service subscription, Using the [Azure Command Line Interface(CLI)](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest). These services are represented by Azure [resources](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-portal), which enable you to connect to one or more of the Azure Cognitive Services APIs.

[!INCLUDE [cognitive-services-subscription-types](../../includes/cognitive-services-subscription-types.md)]

## Prerequisites

* A valid Azure subscription - [Create one](https://azure.microsoft.com/free/) for free.
* The [Azure Command Line Interface(CLI)](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest)

## Install the Azure CLI and sign in 

Install the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest). To sign into your local installation of the CLI, run the [az login](https://docs.microsoft.com/cli/azure/reference-index#az-login) command:

```console
az login
```

You can also use the green **Try It** button to run these commands in your browser.
 
## Create a new Azure Cognitive Services resource group

Before creating a Cognitive Services resource, you must have an Azure resource group to contain the resource. When you create a new resource, you have the option to either create a new resource group, or use an existing one. This article shows how to create a new resource group.

### Choose your resource group location

To create a resource, you'll need one of the Azure locations available for your subscription. You can retrieve a list of available locations with the [az account list-locations](/cli/azure/account#az-account-list-locations) command. Most Cognitive Services can be accessed from several locations. Choose the one closest to you, or see which locations are available for the service.

> [!IMPORTANT]
> * Remember your Azure location, as you will need it when calling the Azure Cognitive Services.
> * The availability of some Cognitive Services can vary by region. For more information, see [Azure products by region](https://azure.microsoft.com/global-infrastructure/services/?products=cognitive-services).  

```azurecli-interactive
az account list-locations \
    --query "[].{Region:name}" \
    --out table
```

After you have your azure location, create a new resource group in the Azure CLI using the [az group create](/cli/azure/group#az-group-create) command.

In the example below, replace the azure location `westus2` with one of the Azure locations available for your subscription.

```azurecli-interactive
az group create \
    --name cognitive-services-resource-group \
    --location westus2
```

## Create a Cognitive Services resource

### Choose a cognitive service and pricing tier

When creating a new resource, you will need to know the "kind" of service you want to use, along with the [pricing tier](https://azure.microsoft.com/pricing/details/cognitive-services/) (or sku) you want. You will use this and other information as parameters when creating the resource.

### Multi-service

| Service                    | Kind                      |
|----------------------------|---------------------------|
| Multiple services. See the [pricing](https://azure.microsoft.com/pricing/details/cognitive-services/) page for more details.            | `CognitiveServices`     |


> [!NOTE]
> Many of the Cognitive Services below have a free tier you can use to try the service. To use the free tier, use `F0` as the sku for your resource.

### Vision

| Service                    | Kind                      |
|----------------------------|---------------------------|
| Computer Vision            | `ComputerVision`          |
| Custom Vision - Prediction | `CustomVision.Prediction` |
| Custom Vision - Training   | `CustomVision.Training`   |
| Face                       | `Face`                    |
| Form Recognizer            | `FormRecognizer`          |
| Ink Recognizer             | `InkRecognizer`           |

### Search

| Service            | Kind                  |
|--------------------|-----------------------|
| Bing Autosuggest   | `Bing.Autosuggest.v7` |
| Bing Custom Search | `Bing.CustomSearch`   |
| Bing Entity Search | `Bing.EntitySearch`   |
| Bing Search        | `Bing.Search.v7`      |
| Bing Spell Check   | `Bing.SpellCheck.v7`  |

### Speech

| Service            | Kind                 |
|--------------------|----------------------|
| Speech Services    | `SpeechServices`     |
| Speech Recognition | `SpeakerRecognition` |

### Language

| Service            | Kind                |
|--------------------|---------------------|
| Form Understanding | `FormUnderstanding` |
| LUIS               | `LUIS`              |
| QnA Maker          | `QnAMaker`          |
| Text Analytics     | `TextAnalytics`     |
| Text Translation   | `TextTranslation`   |

### Decision

| Service           | Kind               |
|-------------------|--------------------|
| Anomaly Detector  | `AnomalyDetector`  |
| Content Moderator | `ContentModerator` |
| Personalizer      | `Personalizer`     |

You can find a list of available Cognitive Service "kinds" with the [az cognitiveservices account list-kinds](https://docs.microsoft.com/cli/azure/cognitiveservices/account?view=azure-cli-latest#az-cognitiveservices-account-list-kinds) command:

```azurecli-interactive
az cognitiveservices account list-kinds
```

### Add a new resource to your resource group

To create and subscribe to a new Cognitive Services resource, use the [az cognitiveservices account create](https://docs.microsoft.com/cli/azure/cognitiveservices/account?view=azure-cli-latest#az-cognitiveservices-account-create) command. This command adds a new billable resource to the resource group created earlier. When creating your new resource, you will need to know the "kind" of service you want to use, along with its pricing tier (or sku) and an Azure location:

You can create an F0 (free) resource for Anomaly Detector, named `anomaly-detector-resource` with the command below.

```azurecli-interactive
az cognitiveservices account create \
    --name anomaly-detector-resource \
    --resource-group cognitive-services-resource-group \
    --kind AnomalyDetector \
    --sku F0 \
    --location westus2 \
    --yes
```

## Get the keys for your resource

To log into your local installation of the Command-Line Interface(CLI), use the [az login](https://docs.microsoft.com/cli/azure/reference-index?view=azure-cli-latest#az-login) command.

```console
az login
```

Use the [az cognitiveservices account keys list](https://docs.microsoft.com/cli/azure/cognitiveservices/account/keys?view=azure-cli-latest#az-cognitiveservices-account-keys-list) command to get the keys for your Cognitive Service resource.

```azurecli-interactive
    az cognitiveservices account keys list \
    --name anomaly-detector-resource \
    --resource-group cognitive-services-resource-group
```

[!INCLUDE [cognitive-services-environment-variables](../../includes/cognitive-services-environment-variables.md)]

## Pricing tiers and billing

Pricing tiers (and the amount you get billed) are based on the number of transactions you send using your authentication information. Each pricing tier specifies the:
* maximum number of allowed transactions per second (TPS).
* service features enabled within the pricing tier.
* The cost for a predefined amount of transactions. Going above this amount will cause an extra charge as specified in the [pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/custom-vision-service/) for your service.

## Get current quota usage for your resource

Use the [az cognitiveservices account list-usage](https://docs.microsoft.com/cli/azure/cognitiveservices/account?view=azure-cli-latest#az-cognitiveservices-account-list-usage) command to get the usage for your Cognitive Service resource.

```azurecli-interactive
az cognitiveservices account list-usage \
    --name anomaly-detector-resource \
    --resource-group cognitive-services-resource-group \
    --subscription subscription-name
```

## Clean up resources

If you want to clean up and remove a Cognitive Services resource, you can delete it or the resource group. Deleting the resource group also deletes any other resources contained in the group.

To remove the resource group and its associated resources, use the az group delete command.

```azurecli-interactive
az group delete --name storage-resource-group
```

## See also

* [Authenticate requests to Azure Cognitive Services](authentication.md)
* [What is Azure Cognitive Services?](Welcome.md)
* [Natural language support](language-support.md)
* [Docker container support](cognitive-services-container-support.md)
