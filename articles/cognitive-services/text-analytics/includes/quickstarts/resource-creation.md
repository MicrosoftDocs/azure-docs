---
author: aahill
ms.service: cognitive-services
ms.topic: include
ms.date: 10/28/2019
ms.author: aahi
---

Start using the Text Analytics API by creating one of the Azure resources below.

* A [trial resource](https://azure.microsoft.com/try/cognitive-services/#lang) (no Azure subscription needed): 
    * Valid for seven days, for free. After signing up, a trial key and endpoint will be available on the [Azure website](https://azure.microsoft.com/try/cognitive-services/my-apis/). 
    * This is a great option if you want to try the Text Analytics API, but don’t have an Azure subscription.

* A [Text Analytics resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics):
    * Available through the Azure portal until you delete the resource.
    * Use the free pricing tier to try the service, and upgrade later to a paid tier for production.

* A [Multi-Service resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne):
    * Available through the [Azure portal](https://ms.portal.azure.com#blade/HubsExtension/BrowseResourceGroupBlade) until you delete the resource.  
    * Use the same key and endpoint for your applications, across multiple Cognitive Services.

>[!NOTE]
> The endpoints for non-trial resources created after July 1, 2019 use the custom subdomain format shown below. For more information and a complete list of regional endpoints, see [Custom subdomain names for Cognitive Services](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-custom-subdomains). 

Using your key and endpoint from the resource you created, create two environment variables for authentication:

* `TEXT_ANALYTICS_SUBSCRIPTION_KEY` - The resource key for authenticating your requests.
* `TEXT_ANALYTICS_ENDPOINT` - The resource endpoint for sending API requests. It will look like this: 
  * `https://<your-custom-subdomain>.api.cognitive.microsoft.com` 

Use the instructions for your operating system.