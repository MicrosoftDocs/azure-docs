---
title: Run Anomaly Detector Container in Azure Container Instances
titleSuffix: Azure Cognitive Services
description: Deploy the Anomaly Detector container to an Azure Container Instance, and test it in a web browser.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: anomaly-detector
ms.topic: conceptual
ms.date: 04/01/2020
ms.author: aahi
---

# Deploy an Anomaly Detector container to Azure Container Instances

Learn how to deploy the Cognitive Services [Anomaly Detector](../anomaly-detector-container-howto.md) container to Azure [Container Instances](https://docs.microsoft.com/azure/container-instances/). This procedure demonstrates the creation of an Anomaly Detector resource. Then we discuss pulling the associated container image. Finally, we highlight the ability to exercise the orchestration of the two from a browser. Using containers can shift the developers' attention away from managing infrastructure to instead focusing on application development.

[!INCLUDE [Prerequisites](../../containers/includes/container-preview-prerequisites.md)]

[!INCLUDE [Create a Cognitive Services Anomaly Detector resource](../includes/create-anomaly-detector-resource.md)]

[!INCLUDE [Create an Anomaly Detector container on Azure Container Instances](../../containers/includes/create-container-instances-resource-from-azure-cli.md)]

[!INCLUDE [API documentation](../../../../includes/cognitive-services-containers-api-documentation.md)]

## Next steps

* Review [Install and run containers](../anomaly-detector-container-configuration.md) for pulling the container image and run the container
* Review [Configure containers](../anomaly-detector-container-configuration.md) for configuration settings
* [Learn more about Anomaly Detector API service](https://go.microsoft.com/fwlink/?linkid=2080698&clcid=0x409)
