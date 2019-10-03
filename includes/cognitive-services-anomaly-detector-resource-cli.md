---
author: aahill
ms.author: aahi
ms.service: cognitive-services
ms.topic: include
ms.date: 06/20/2019
---

>[!NOTE]
> Endpoints for resources created after July 1, 2019 use the custom subdomain format shown below. For more information and a complete list of regional endpoints., see [Custom subdomain names for Cognitive Services](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-custom-subdomains) 

Azure Cognitive Services are represented by Azure resources that you subscribe to. Create a resource for Anomaly Detector using the [Azure portal](../articles/cognitive-services/cognitive-services-apis-create-account.md). You can also:

* Get a [trial key](https://azure.microsoft.com/try/cognitive-services/#decision) valid for seven days for free. After signing up, it will be available on the [Azure website](https://azure.microsoft.com/try/cognitive-services/my-apis/).
* View your resource in the [Azure portal](https://ms.portal.azure.com#blade/HubsExtension/BrowseResourceGroupBlade).

After creating a resource: 

1. Get your endpoint and key by finding your resource on the [Azure portal](https://ms.portal.azure.com#blade/HubsExtension/BrowseResourceGroupBlade), and clicking **Quick start**. 

2. Create two [environment variables]():

    * `ANOMALY_DETECTOR_ENDPOINT` - The endpoint for your resource. It will look like this: 

            `https://<your-custom-subdomain>.api.cognitive.microsoft.com` 

    * `ANOMALY_DETECTOR_SUBSCRIPTION_KEY` - The subscription key for authenticating your requests.   
