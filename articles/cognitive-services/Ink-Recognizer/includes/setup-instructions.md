---
author: aahill
ms.author: aahi
ms.service: cognitive-services
ms.topic: include
ms.date: 06/20/2019
---

>[!NOTE]
> Endpoints for resources created after July 1, 2019 use the custom subdomain format shown below. For more information and a complete list of regional endpoints, see [Custom subdomain names for Cognitive Services](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-custom-subdomains). 

Azure Cognitive Services are represented by Azure resources that you subscribe to. Create a resource for Ink Recognizer using the [Azure portal](../../cognitive-services-apis-create-account.md).

After creating a resource, get your endpoint and key by opening your resource on the [Azure portal](https://ms.portal.azure.com#blade/HubsExtension/BrowseResourceGroupBlade), and clicking **Quick start**.

Create two [environment variables](../../cognitive-services-apis-create-account.md#get-the-keys-for-your-resource):

* `INK_RECOGNITION_SUBSCRIPTION_KEY` - The endpoint for your resource. It will look like this: <br> `https://<your-custom-subdomain>.api.cognitive.microsoft.com` 

* `INK_RECOGNITION_ENDPOINT` - The subscription key for authenticating your requests.   
