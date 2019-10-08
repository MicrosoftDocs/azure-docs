---
author: aahill
ms.author: aahi
ms.service: cognitive-services
ms.topic: include
ms.date: 10/08/2019
---

>[!NOTE]
> Endpoints for resources created after July 1, 2019 use the custom subdomain format shown below. For more information and a complete list of regional endpoints, see [Custom subdomain names for Cognitive Services](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-custom-subdomains). 

Azure Cognitive Services are represented by Azure resources that you subscribe to. Create an Anomaly Detector resource [using the Azure portal](../articles/cognitive-services/cognitive-services-apis-create-account.md), and continue continue below. 

* You can also get a [trial key](https://azure.microsoft.com/try/cognitive-services/#decision) valid for seven days for free. After signing up, it and an endpoint will be available on the [Azure website](https://azure.microsoft.com/try/cognitive-services/my-apis/).

After creating a resource, get your endpoint and key by finding [your resource](https://ms.portal.azure.com#blade/HubsExtension/BrowseResourceGroupBlade) on the Azure portal, and clicking **Quick start**. 

Create two environment variables:

* `ANOMALY_DETECTOR_ENDPOINT` - The endpoint for your resource. It will look like this: <br> `https://<your-custom-subdomain>.api.cognitive.microsoft.com` 

* `ANOMALY_DETECTOR_KEY` - The subscription key for authenticating your requests.   
