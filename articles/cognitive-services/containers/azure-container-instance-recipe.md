---
title: Azure Container Instance recipe
titleSuffix: Azure Cognitive Services
description: Learn how to deploy Cognitive Services Containers on Azure Container Instance
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.topic: article 
ms.date: 06/12/2019
ms.author: dapine
#As a potential customer, I want to know more about how Cognitive Services provides and supports Docker containers for each service.

# https://github.com/Azure/cognitiveservices-aci
---

# Deploy and run container on Azure Container Instance (ACI)

With the following steps, scale Azure Cognitive Services applications in the cloud easily with Azure [Container Instance](https://docs.microsoft.com/azure/container-instances/) (ACI). This helps you focus on building your applications instead of managing the infrastructure.

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

## Step 2: Launch your container on Azure Container Instances (ACI)

**Creating the Azure Container Instance (ACI) resource.**

1. Go to the [Create](https://ms.portal.azure.com/#create/Microsoft.ContainerInstances) page for Container Instances.

1. On the **Basics** tab, enter the following details:

    |Page|Setting|Value|
    |--|--|--|
    |Basics|Subscription|Select your subscription.|
    |Basics|Resource group|Select the available resource group or create a new one such as `cognitive-services`.|
    |Basics|Container name|Enter a name such as `cognitive-container-instance`. This name must be in lower caps.|
    |Basics|Location|Select a region for deployment.|
    |Basics|Image type|`Public`|
    |Basics|Image name|Enter the Cognitive Services Container location. This can be the same location you used in the `docker pull` command, _for example_: <br>`mcr.microsoft.com/azure-cognitive-services/sentiment`|
    |Basics|OS type|`Linux`|
    |Basics|Size|Change size to the suggested recommendations for your specific Cognitive Service container.:<br>2 cores<br>4 GB
    ||||
  
1. On the **Networking** tab, enter the following details:

    |Page|Setting|Value|
    |--|--|--|
    |Networking|Ports|Edit the existing port for TCP from `80` to `5000`. This means you are exposing the container on port 5000.|
    ||||

1. On the **Advanced** tab, enter the following details to pass through the container required billing settings to the Container Instance resource:

    |Advanced page key|Advanced page value|
    |--|--|
    |`apikey`|Copied from the **Keys** page of the resource. You need only one of the two keys. It is a 32 alphanumeric-character string with no spaces or dashes, `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`.|
    |`billing`|Copied from the **Overview** page of the resource. |
    |`eula`|`accept`|

    If your container has other configuration settings such as input mounts, output mounts, or logging, those settings also need to be added.

1. Select **Review and Create**.
1. After validation passes, select **Create** to finish the creation process.
1. Select the bell icon in the top navigation. This is the notification window. It will display a blue **Go to resource** button when the resource is created. Select that button to go the new resource.

## Use the Container Instance

1. Select the **Overview** and copy the IP address. It will be a numeric IP address such as `55.55.55.55`.
1. Open a new browser tab and use the IP address, for example, `http://<IP-address>:5000 (http://55.55.55.55:5000`). You will see the container's home page, letting you know the container is running.

1. Select **Service API Description** to view the swagger page for the container.

1. Select any of the **POST** APIs and select **Try it out**.  The parameters are displayed including the input. Fill in the parameters.

1. Select **Execute** to send the request to your Container Instance.

    You have successfully created and used Cognitive Services containers in Azure Container Instance.
