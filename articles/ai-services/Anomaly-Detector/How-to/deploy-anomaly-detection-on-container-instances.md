---
title: Run Anomaly Detector Container in Azure Container Instances
titleSuffix: Azure AI services
description: Deploy the Anomaly Detector container to an Azure Container Instance, and test it in a web browser.
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: azure-ai-anomaly-detector
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 04/01/2020
ms.author: mbullwin
---

# Deploy an Anomaly Detector univariate container to Azure Container Instances

Learn how to deploy the Azure AI services [Anomaly Detector](../anomaly-detector-container-howto.md) container to Azure [Container Instances](../../../container-instances/index.yml). This procedure demonstrates the creation of an Anomaly Detector resource. Then we discuss pulling the associated container image. Finally, we highlight the ability to exercise the orchestration of the two from a browser. Using containers can shift the developers' attention away from managing infrastructure to instead focusing on application development.

[!INCLUDE [Prerequisites](../../containers/includes/container-preview-prerequisites.md)]

[!INCLUDE [Create an Azure AI Anomaly Detector resource](../includes/create-anomaly-detector-resource.md)]

[!INCLUDE [Create an Anomaly Detector container on Azure Container Instances](../../containers/includes/create-container-instances-resource-from-azure-cli.md)]

[!INCLUDE [API documentation](../../../../includes/cognitive-services-containers-api-documentation.md)]

## Next steps

* Review [Install and run containers](../anomaly-detector-container-configuration.md) for pulling the container image and run the container
* Review [Configure containers](../anomaly-detector-container-configuration.md) for configuration settings
* [Learn more about Anomaly Detector API service](https://go.microsoft.com/fwlink/?linkid=2080698&clcid=0x409)
