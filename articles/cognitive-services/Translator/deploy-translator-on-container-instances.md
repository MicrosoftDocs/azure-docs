---
title: Run Azure Container Instances - Translator Text
titleSuffix: Azure Cognitive Services
description: Deploy the Translator Text container to an Azure Container Instance, and test it in a web browser.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 09/17/2019
ms.author: dapine
---

# Deploy the Translator Text container to Azure Container Instances

Learn how to deploy the Cognitive Services [Translator Text](how-to-install-containers.md) container to Azure [Container Instances](https://docs.microsoft.com/azure/container-instances/). This procedure demonstrates the creation of an Azure Translator Text resource. Then we discuss pulling the associated container image. Finally, we highlight the ability to exercise the orchestration of the two from a browser. Using containers can shift the developers' attention away from managing infrastructure to instead focusing on application development.

[!INCLUDE [Prerequisites](../containers/includes/container-preview-prerequisites.md)]

## Request access to the container registry

You must first complete and submit the [Cognitive Services Speech Containers Request form](https://aka.ms/translatorcontainerform) to request access to the container. 

[!INCLUDE [Request access to the container registry](../../../includes/cognitive-services-containers-request-access-only.md)]

[!INCLUDE [Create a Cognitive Services Translator Text resource](includes/create-translator-text-resource.md)]

[!INCLUDE [Create an Translator Text container on Azure Container Instances](../containers/includes/create-container-instances-resource-from-azure-cli.md)]

[!INCLUDE [API documentation](../../../includes/cognitive-services-containers-api-documentation.md)]

[!INCLUDE [Containers Next Steps](../containers/includes/containers-next-steps.md)]
