---
title: Run Azure Container Instances
titleSuffix: Azure Cognitive Services
description: Deploy the Computer Vision container to an Azure Container Instance, and test it in a web browser.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 7/5/2019
ms.author: dapine
---

# Deploy the Computer Vision container to Azure Container Instances

Learn how to deploy the Cognitive Services [Computer Vision](computer-vision-how-to-install-containers.md) container to Azure [Container Instances](https://docs.microsoft.com/azure/container-instances/). This procedure demonstrates the creation of the Computer Vision resource. Then we discuss pulling the associated container image. Finally, we highlight the ability to exercise the orchestration of the two from a browser. Using containers can shift the developers' attention away from managing infrastructure to instead focusing on application development.

[!INCLUDE [Prerequisites](../containers/includes/container-preview-prerequisites.md)]

## Request access to the private container registry

[!INCLUDE [Request access](../../../includes/cognitive-services-containers-request-access.md)]

[!INCLUDE [Create a Cognitive Services Computer Vision resource](includes/create-computer-vision-resource.md)]

[!INCLUDE [Create the Computer Vision on Azure Container Instances](../containers/includes/create-container-instances-resource-from-azure-cli.md)]

[!INCLUDE [API documentation](../../../includes/cognitive-services-containers-api-documentation.md)]

[!INCLUDE [Containers Next Steps](../containers/includes/containers-next-steps.md)]