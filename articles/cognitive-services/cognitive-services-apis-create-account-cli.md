---
title: Create a Cognitive Services resource using the Azure CLI
titleSuffix: Azure Cognitive Services
description: Get started with Azure Cognitive Services by creating and subscribing to a resource using the Azure command-line interface.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
keywords: cognitive services, cognitive intelligence, cognitive solutions, ai services
ms.topic: quickstart
ms.date: 3/22/2021
ms.author: aahi
---

# Quickstart: Create a Cognitive Services resource using the Azure Command-Line Interface(CLI)

Use this quickstart to get started with Azure Cognitive Services using the [Azure Command Line Interface(CLI)](/cli/azure/install-azure-cli).

Azure Cognitive Services are cloud-base services with REST APIs, and client library SDKs available to help developers build cognitive intelligence into applications without having direct artificial intelligence (AI) or data science skills or knowledge. Azure Cognitive Services enables developers to easily add cognitive features into their applications with cognitive solutions that can see, hear, speak, understand, and even begin to reason.

Cognitive Services are represented by Azure [resources](../azure-resource-manager/management/manage-resources-portal.md) that you create in your Azure subscription. After creating the resource, Use the keys and endpoint generated for you to authenticate your applications.

In this quickstart, you'll learn how to sign up for Azure Cognitive Services and create an account that has a single-service or multi-service subscription, Using the [Azure Command Line Interface(CLI)](/cli/azure/install-azure-cli). These services are represented by Azure [resources](../azure-resource-manager/management/manage-resources-portal.md), which enable you to connect to one or more of the Azure Cognitive Services APIs.

[!INCLUDE [cognitive-services-subscription-types](../../includes/cognitive-services-subscription-types.md)]

## Prerequisites

* A valid Azure subscription - [Create one](https://azure.microsoft.com/free/cognitive-services) for free.
* The [Azure Command Line Interface(CLI)](/cli/azure/install-azure-cli)

## Install the Azure CLI and sign in

Install the [Azure CLI](/cli/azure/install-azure-cli). To sign into your local installation of the CLI, run the [az login](/cli/azure/reference-index#az_login) command:

```azurecli-interactive
az login
```

You can also use the green **Try It** button to run these commands in your browser.

## Create a new Azure Cognitive Services resource group

Before creating a Cognitive Services resource, you must have an Azure resource group to contain the resource. When you create a new resource, you have the option to either create a new resource group, or use an existing one. This article shows how to create a new resource group.

### Choose your resource group location

To create a resource, you'll need one of the Azure locations available for your subscription. You can retrieve a list of available locations with the [az account list-locations](/cli/azure/account#az_account_list_locations) command. Most Cognitive Services can be accessed from several locations. Choose the one closest to you, or see which locations are available for the service.

> [!IMPORTANT]
> * Remember your Azure location, as you will need it when calling the Azure Cognitive Services.
> * The availability of some Cognitive Services can vary by region. For more information, see [Azure products by region](https://azure.microsoft.com/global-infrastructure/services/?products=cognitive-services).

```azurecli-interactive
az account list-locations \
    --query "[].{Region:name}" \
    --out table
```

After you have your Azure location, create a new resource group in the Azure CLI using the [az group create](/cli/azure/group#az_group_create) command.

In the example below, replace the Azure location `westus2` with one of the Azure locations available for your subscription.

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

You can find a list of available Cognitive Service "kinds" with the [az cognitiveservices account list-kinds](/cli/azure/cognitiveservices/account#az_cognitiveservices_account_list_kinds) command:

```azurecli-interactive
az cognitiveservices account list-kinds
```

### Add a new resource to your resource group

To create and subscribe to a new Cognitive Services resource, use the [az cognitiveservices account create](/cli/azure/cognitiveservices/account#az_cognitiveservices_account_create) command. This command adds a new billable resource to the resource group created earlier. When creating your new resource, you will need to know the "kind" of service you want to use, along with its pricing tier (or sku) and an Azure location:

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

[!INCLUDE [Register Azure resource for subscription](./includes/register-resource-subscription.md)]

## Get the keys for your resource

To log into your local installation of the Command-Line Interface(CLI), use the [az login](/cli/azure/reference-index#az_login) command.

```azurecli-interactive
az login
```

Use the [az cognitiveservices account keys list](/cli/azure/cognitiveservices/account/keys#az_cognitiveservices_account_keys_list) command to get the keys for your Cognitive Service resource.

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
* The cost for a predefined number of transactions. Going above this amount will cause an extra charge as specified in the [pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/custom-vision-service/) for your service.

## Get current quota usage for your resource

Use the [az cognitiveservices account list-usage](/cli/azure/cognitiveservices/account#az_cognitiveservices_account_list_usage) command to get the usage for your Cognitive Service resource.

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
az group delete --name cognitive-services-resource-group
```

## See also

* See **[Authenticate requests to Azure Cognitive Services](authentication.md)** on how to securely work with Cognitive Services.
* See **[What are Azure Cognitive Services?](./what-are-cognitive-services.md)** to get a list of different categories within Cognitive Services.
* See **[Natural language support](language-support.md)** to see the list of natural languages that Cognitive Services supports.
* See **[Use Cognitive Services as containers](cognitive-services-container-support.md)** to understand how to use Cognitive Services on-prem.
* See **[Plan and manage costs for Cognitive Services](plan-manage-costs.md)** to estimate cost of using Cognitive Services.
