---
author: aahill
ms.author: aahi
ms.service: cognitive-services
ms.topic: include
ms.date: 06/20/2019
---

The following Azure CLI commands will provision an Anomaly Detector resource on the free pricing tier. Click on the **Try It** button, paste the code, and press enter to run it in the Azure cloud shell. It will print your keys for authenticating your application. After it completes, [create an environment variable](../articles/cognitive-services/cognitive-services-apis-create-account.md#configure-an-environment-variable-for-authentication) for your either of your keys, named `ANOMALY_DETECTOR_KEY`.

> [!NOTE]
> * You can optionally:
>    * create a resource using the [Azure portal](../articles/cognitive-services/cognitive-services-apis-create-account.md), or [Azure CLI](../articles/cognitive-services/cognitive-services-apis-create-account.md) on your local machine.
>    * get a [trial key](https://azure.microsoft.com/try/cognitive-services/#decision) valid for 7 days for free. After signing up it will be available on the [Azure website](https://azure.microsoft.com/try/cognitive-services/my-apis/).
>    * view this resource on the [Azure portal](https://portal.azure.com/). 

Cognitive Services are represented by Azure resources that you provision. Every Cognitive Services account (and its associated Azure resource) must belong to an Azure resource group.

1. Create an Azure resource group

    ```azurecli-interactive
    az group create \
        --name example-anomaly-detector-resource-group \
        --location westus2
    ```

2. Create an Anomaly Detector resource on the free tier

    ```azurecli-interactive
    az cognitiveservices account create \
        --name example-anomaly-detector-resource \
        --resource-group example-anomaly-detector-resource-group \
        --kind AnomalyDetector \
        --sku F0 \
        --location westus2 \
        --yes
    ```

3. List the keys for your resource

    ```azurecli-interactive
    az cognitiveservices account keys list \
        --name example-anomaly-detector-resource \
        --resource-group example-anomaly-detector-resource-group
    ```