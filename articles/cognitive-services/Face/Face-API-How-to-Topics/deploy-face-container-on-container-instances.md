---
title: Run Face container in Azure Container Instances
titleSuffix: Azure Cognitive Services
description: Deploy the Face container to an Azure Container Instance, and test it in a web browser.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: face-api
ms.topic: conceptual
ms.date: 07/16/2020
ms.author: aahi
---

# Deploy the Face container to Azure Container Instances

> [!IMPORTANT]
> The limit for Face container users has been reached. We are not currently accepting new applications for the Face container.

Learn how to deploy the Cognitive Services [Face](../face-how-to-install-containers.md) container to Azure [Container Instances](../../../container-instances/index.yml). This procedure demonstrates the creation of an Azure Face resource. Then we discuss pulling the associated container image. Finally, we highlight the ability to exercise the orchestration of the two from a browser. Using containers can shift the developers' attention away from managing infrastructure to instead focusing on application development.

[!INCLUDE [Prerequisites](../../containers/includes/container-preview-prerequisites.md)]

[!INCLUDE [Create a Cognitive Services Face resource](../includes/create-face-resource.md)]

[!INCLUDE [Create an Face container on Azure Container Instances](../../containers/includes/create-container-instances-resource-from-azure-cli.md)]

[!INCLUDE [API documentation](../../../../includes/cognitive-services-containers-api-documentation.md)]

[!INCLUDE [Containers Next Steps](../../containers/includes/containers-next-steps.md)]