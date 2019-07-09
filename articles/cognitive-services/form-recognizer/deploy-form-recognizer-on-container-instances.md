---
title: Run Azure Container Instances
titleSuffix: Azure Cognitive Services
description: Deploy the Form Recognizer container to an Azure Container Instance, and test it in a web browser.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.subservice: form-recognizer
ms.topic: conceptual
ms.date: 7/5/2019
ms.author: dapine
---

# Deploy the Form Recognizer container to Azure Container Instances

Learn how to deploy the Cognitive Services [Form Recognizer](form-recognizer-container-howto.md) container to Azure [Container Instances](https://docs.microsoft.com/azure/container-instances/). This procedure demonstrates the creation of an Azure Form Recognizer resource. Then we discuss pulling the associated container image. Finally, we highlight the ability to exercise the orchestration of the two from a browser. Using containers can shift the developers' attention away from managing infrastructure to instead focusing on application development.

[!INCLUDE [Prerequisites](../containers/includes/container-preview-prerequisites.md)]

## Request access to the container registry

You must first complete and submit the [Cognitive Services Form Recognizer Containers access request form](https://aka.ms/FormRecognizerRequestAccess) to request access to the container. Doing so also signs you up for Computer Vision. You don't need to sign up for the Computer Vision request form separately. 

[!INCLUDE [Request access](../../../includes/cognitive-services-containers-request-access-only.md)]

[!INCLUDE [Create a Cognitive Services Form Recognizer resource](includes/create-resource.md)]

[!INCLUDE [Create an Form Recognizer container on Azure Container Instances](../containers/includes/create-container-instances-resource-from-azure-cli.md)]

[!INCLUDE [API documentation](../../../includes/cognitive-services-containers-api-documentation.md)]

[!INCLUDE [Containers Next Steps](../containers/includes/containers-next-steps.md)]
