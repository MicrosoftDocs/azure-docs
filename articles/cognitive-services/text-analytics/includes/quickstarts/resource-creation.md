---
author: aahill
ms.service: cognitive-services
ms.topic: include
ms.date: 10/28/2019
ms.author: aahi
---

Begin using the Text Analytics service by creating an Azure resource. Choose the resource type below that's right for you:

* A [trial resource](https://azure.microsoft.com/try/cognitive-services/#lang) (no Azure subscription needed): 
    * Valid for seven days, for free. After signing up, a trial key and endpoint will be available on the [Azure website](https://azure.microsoft.com/try/cognitive-services/my-apis/). 
    * This is a great option if you want to try Text Analytics, but don’t have an Azure subscription.

* A [Text Analytics resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics):
    * Available through the [Azure portal](https://ms.portal.azure.com#blade/HubsExtension/BrowseResourceGroupBlade) until you delete the resource.
    * Use the free pricing tier to try the service, and upgrade later to a paid tier for production.

* A [Multi-Service resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne):
    * Available through the [Azure portal](https://ms.portal.azure.com#blade/HubsExtension/BrowseResourceGroupBlade) until you delete the resource.  
    * Use the same key and endpoint for your applications, across multiple Cognitive Services.

To get your key and endpoint: 
1. Find your resource group on the [Azure portal](https://ms.portal.azure.com#blade/HubsExtension/BrowseResourceGroupBlade), and click on your resource. 
2. Your key and endpoint are in the **Quick start** section, located under **Resource Management**.

### Create an environment variable

>[!NOTE]
> The endpoints for non-trial resources created after July 1, 2019 use the custom subdomain format shown below. For more information and a complete list of regional endpoints, see [Custom subdomain names for Cognitive Services](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-custom-subdomains). 

Using your key and endpoint from the resource you created, create two environment variables for authentication:

* `TEXT_ANALYTICS_SUBSCRIPTION_KEY` - The resource key for authenticating your requests.
* `TEXT_ANALYTICS_ENDPOINT` - The resource endpoint for sending API requests. It will look like this: 
  * `https://<your-custom-subdomain>.api.cognitive.microsoft.com` 

Use the instructions for your operating system.

#### [Windows](#tab/windows)

```console
setx TEXT_ANALYTICS_SUBSCRIPTION_KEY <your-text-analytics-key>
setx TEXT_ANALYTICS_ENDPOINT <your-text-analytics-endpoint>
```

After you add the environment variable, restart the console window.

#### [Linux](#tab/linux)

```bash
export TEXT_ANALYTICS_SUBSCRIPTION_KEY=<your-text-analytics-key>
export TEXT_ANALYTICS_ENDPOINT=your-anomaly-detector-endpoint
```

After you add the environment variable, run `source ~/.bashrc` from your console window to make the changes effective.

#### [macOS](#tab/unix)

Edit your `.bash_profile`, and add the environment variable:

```bash
export TEXT_ANALYTICS_SUBSCRIPTION_KEY=<your-text-analytics-key>
export TEXT_ANALYTICS_ENDPOINT=your-anomaly-detector-endpoint
```

After you add the environment variable, run `source .bash_profile` from your console window to make the changes effective.
***