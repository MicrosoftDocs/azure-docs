---
title: Container support
titleSuffix: Azure Cognitive Services
description: Learn how to create an azure container instance (ACI) resource.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.topic: include 
ms.date: 06/26/2019
ms.author: dapine
---

## Create an Azure Container Instance (ACI) resource

1. Go to the [Create](https://ms.portal.azure.com/#create/Microsoft.ContainerInstances) page for Container Instances.

2. On the **Basics** tab, enter the following details:

    |Setting|Value|
    |--|--|
    |Subscription|Select your subscription.|
    |Resource group|Select the available resource group or create a new one such as `cognitive-services`.|
    |Container name|Enter a name such as `cognitive-container-instance`. This name must be in lower caps.|
    |Location|Select a region for deployment.|
    |Image type|`Public`|
    |Image name|Enter the Cognitive Services Container location. This can be the same location you used in the `docker pull` command, _for example_: <br>`mcr.microsoft.com/azure-cognitive-services/sentiment`|
    |OS type|`Linux`|
    |Size|Change size to the suggested recommendations for your specific Cognitive Service container.:<br>2 cores<br>4 GB

3. On the **Networking** tab, enter the following details:

    |Setting|Value|
    |--|--|
    |Ports|Set the TCP port to `5000`. Exposes the container on port 5000.|

4. On the **Advanced** tab, enter the following details to pass through the container [required billing settings](https://docs.microsoft.com/azure/cognitive-services/text-analytics/how-tos/text-analytics-how-to-install-containers#billing-arguments) to the ACI resource:

    |Advanced page key|Advanced page value|
    |--|--|
    |`apikey`|Copied from the **Keys** page of the Text Analytics resource. It is a 32 alphanumeric-character string with no spaces or dashes, `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`.|
    |`billing`|Copied from the **Overview** page of the Text Analytics resource. Example: `https://northeurope.api.cognitive.microsoft.com/text/analytics/v2.0`|
    |`eula`|`accept`|

1. Click **Review and Create**
1. After validation passes, click **Create** to finish the creation process
1. When the resource is successfully deployed, it is ready for use