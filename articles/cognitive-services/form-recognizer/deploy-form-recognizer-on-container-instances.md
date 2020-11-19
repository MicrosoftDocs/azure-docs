---
title: Run Form Recognizer container in Azure Container Instances
titleSuffix: Azure Cognitive Services
description: Deploy the Form Recognizer container to an Azure Container Instance, and test it in a web browser.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 07/14/2020
ms.author: aahi
---

# Deploy the Form Recognizer container to Azure Container Instances

[!INCLUDE [Form Recognizer containers limit](includes/container-limit.md)]

Learn how to deploy the Cognitive Services [Form Recognizer](form-recognizer-container-howto.md) container to Azure [Container Instances](../../container-instances/index.yml). This procedure demonstrates the creation of an Azure Form Recognizer resource. Then we discuss pulling the associated container image. Finally, we highlight the ability to exercise the orchestration of the two from a browser. Using containers can shift the developers' attention away from managing infrastructure to instead focusing on application development.

[!INCLUDE [Prerequisites](../containers/includes/container-preview-prerequisites.md)]

[!INCLUDE [Create a Cognitive Services Form Recognizer resource](includes/create-resource.md)]

[!INCLUDE [Create an Form Recognizer container on Azure Container Instances](../containers/includes/create-container-instances-resource-from-azure-cli.md)]

[!INCLUDE [API documentation](../../../includes/cognitive-services-containers-api-documentation.md)]

[!INCLUDE [Containers Next Steps](../containers/includes/containers-next-steps.md)]