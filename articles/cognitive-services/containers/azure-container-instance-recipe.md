---
title: Azure Container Instance recipe
titleSuffix: Azure Cognitive Services
description: Learn how to deploy Cognitive Services Containers on Azure Container Instance
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.topic: conceptual 
ms.date: 06/26/2019
ms.author: dapine
#As a potential customer, I want to know more about how Cognitive Services provides and supports Docker containers for each service.

# https://github.com/Azure/cognitiveservices-aci
---

# Deploy and run container on Azure Container Instance

With the following steps, scale Azure Cognitive Services applications in the cloud easily with Azure [Container Instance](https://docs.microsoft.com/azure/container-instances/). This helps you focus on building your applications instead of managing the infrastructure.

## Prerequisites

This solution works with any Cognitive Services container. The Cognitive Service resource must be created in the Azure portal before using this recipe. Each Cognitive Service that supports containers has a "How to install" document specifically for installing and configuring the service for a container. Because some services require a file or set of files as input for the container, it is important that you understand and have used the container successfully before using this solution.

* A Cognitive Service resource, created in Azure portal.
* Cognitive Service **endpoint URL** - review your specific service's "How to install" for the container, to find where the endpoint URL is from within the Azure portal, and what a correct example of the URL looks like. The exact format can change from service to service.
* Cognitive Service **key** - the keys are on the **Keys** page for the Azure resource. You only need one of the two keys. The key is a string of 32 alpha-numeric characters.
* A single Cognitive Services Container on your local host (your computer). Make sure you can:
  * Pull down the image with a `docker pull` command.
  * Run the local container successfully with all required configuration settings with a `docker run` command.
  * Call the container's endpoint, getting a response of 2xx and a JSON response back.

All variables in angle brackets, `<>`, need to be replaced with your own values. This replacement includes the angle brackets.

[!INCLUDE [Create a Text Analytics Containers on Azure Container Instances](includes/create-container-instances-resource.md)]

## Use the Container Instance

1. Select the **Overview** and copy the IP address. It will be a numeric IP address such as `55.55.55.55`.
1. Open a new browser tab and use the IP address, for example, `http://<IP-address>:5000 (http://55.55.55.55:5000`). You will see the container's home page, letting you know the container is running.

1. Select **Service API Description** to view the swagger page for the container.

1. Select any of the **POST** APIs and select **Try it out**.  The parameters are displayed including the input. Fill in the parameters.

1. Select **Execute** to send the request to your Container Instance.

    You have successfully created and used Cognitive Services containers in Azure Container Instance.
