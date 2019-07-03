---
title: Run Azure Container Instances
titleSuffix: Anomaly Detector - Azure Cognitive Services
description: Deploy the Anomaly Detector container to an Azure Container Instance, and test it in a web browser.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.subservice: anomaly-detection
ms.topic: conceptual
ms.date: 7/3/2019
ms.author: dapine
---

# Deploy an Anomaly Detector container to Azure Container Instances (ACI)

Learn how to deploy the Cognitive Services [Anomaly Detector](../anomaly-detector-container-howto.md) container to Azure [Container Instances](https://docs.microsoft.com/azure/container-instances/) (ACI). This procedure exemplifies the creation of an Anomaly Detector resource, the creation of an associated container image and the ability to exercise the orchestration of the two from a browser. Using containers can shift the developers' attention away from managing infrastructure to instead focusing on application development.

## Prerequisites

* Use an Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

[!INCLUDE [Create a Cognitive Services Anomaly Detector resource](../includes/create-anomaly-detector-resource.md)]

[!INCLUDE [Create an Anomaly Detector container on Azure Container Instances (ACI)](../../containers/includes/create-aci-resource.md)]

Verify the Sentiment Analysis container instance

## Next steps 

* Use more [Cognitive Services Containers](../../cognitive-services-container-support.md)