---
title: Run Azure Kubernetes Service - Text Analytics
titleSuffix: Azure Cognitive Services
description: Deploy the Text Analytics container image to Azure Kubernetes Service, and test it in a web browser.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 04/01/2020
ms.author: aahi
---

# Deploy a Text Analytics container to Azure Kubernetes Service

Learn how to deploy the Azure Cognitive Services [Text Analytics](https://docs.microsoft.com/azure/cognitive-services/text-analytics/how-tos/text-analytics-how-to-install-containers) container image to Azure Kubernetes Service (AKS). This procedure shows how to create a Text Analytics resource, how to create an associated sentiment analysis image, and how to exercise this orchestration of the two from a browser. Using containers can shift your attention away from managing infrastructure to instead focusing on application development.

## Prerequisites

This procedure requires several tools that must be installed and run locally. Don't use Azure Cloud Shell. You need the following:

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
* A text editor, for example, [Visual Studio Code](https://code.visualstudio.com/download).
* The [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) installed.
* The [Kubernetes CLI](https://kubernetes.io/docs/tasks/tools/install-kubectl/) installed.
* An Azure resource with the correct pricing tier. Not all pricing tiers work with this container:
    * **Azure Text Analytics** resource with F0 or standard pricing tiers only.
    * **Azure Cognitive Services** resource with the S0 pricing tier.

[!INCLUDE [Create a Cognitive Services Text Analytics resource](../includes/create-text-analytics-resource.md)]

[!INCLUDE [Create a Text Analytics container on Azure Kubernetes Service (AKS)](../../containers/includes/create-aks-resource.md)]

#### [Key Phrase Extraction](#tab/keyphrase)

[!INCLUDE [Key Phrase Extraction Kubernetes config and deploy steps](../includes/key-phrase-extraction-kubernetes-config-deploy.md)]

[!INCLUDE [Verify the Key Phrase Extraction container instance](../includes/verify-key-phrase-extraction-container.md)]

#### [Language Detection](#tab/language)

[!INCLUDE [Language Detection Kubernetes config and deploy steps](../includes/language-detection-kubernetes-config-deploy.md)]

[!INCLUDE [Verify the Language Detection container instance](../includes/verify-language-detection-container.md)]

#### [Sentiment Analysis](#tab/sentiment)

[!INCLUDE [Sentiment Analysis Kubernetes config and deploy steps](../includes/sentiment-analysis-kubernetes-config-deploy.md)]

[!INCLUDE [Verify the Sentiment Analysis container instance](../includes/verify-sentiment-analysis-container.md)]

***

## Next steps

* Use more [Cognitive Services containers](../../cognitive-services-container-support.md)
* Use the [Text Analytics Connected Service](../vs-text-connected-service.md)
