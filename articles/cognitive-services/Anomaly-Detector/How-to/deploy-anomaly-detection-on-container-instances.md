---
title: Run Azure Container Instances
titleSuffix: Azure Cognitive Services
description: Deploy the Anomaly Detector container to an Azure Container Instance, and test it in a web browser.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.subservice: anomaly-detection
ms.topic: conceptual
ms.date: 7/5/2019
ms.author: dapine
---

# Deploy an Anomaly Detector container to Azure Container Instances

Learn how to deploy the Cognitive Services [Anomaly Detector](../anomaly-detector-container-howto.md) container to Azure [Container Instances](https://docs.microsoft.com/azure/container-instances/). This procedure demonstrates the creation of an Anomaly Detector resource. Then we discuss pulling the associated container image. Finally, we highlight the ability to exercise the orchestration of the two from a browser. Using containers can shift the developers' attention away from managing infrastructure to instead focusing on application development.

[!INCLUDE [Prerequisites](../../containers/includes/container-preview-prerequisites.md)]

## Request access to the private container registry

You must first complete and submit the [Anomaly Detector Container request form](https://aka.ms/adcontainer) to request access to the container.

[!INCLUDE [Request access](../../../../includes/cognitive-services-containers-request-access-only.md)]

[!INCLUDE [Create a Cognitive Services Anomaly Detector resource](../includes/create-anomaly-detector-resource.md)]

[!INCLUDE [Create an Anomaly Detector container on Azure Container Instances](../../containers/includes/create-container-instances-resource-from-azure-cli.md)]

[!INCLUDE [API documentation](../../../../includes/cognitive-services-containers-api-documentation.md)]

[!INCLUDE [Containers Next Steps](../../containers/includes/containers-next-steps.md)]