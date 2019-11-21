---
author: aahill
ms.author: aahi
ms.service: cognitive-services
ms.topic: include
ms.date: 10/08/2019
---

Start using the Anomaly Detector service by creating one of the Azure resources below.

* A [trial resource](https://azure.microsoft.com/try/cognitive-services/#decision) (no Azure subscription needed): 
    * Valid for seven days, for free. After signing up, a trial key and endpoint will be available on the [Azure website](https://azure.microsoft.com/try/cognitive-services/my-apis/). 
    * This is a great option if you want to try Anomaly Detector, but don’t have an Azure subscription.

* An [Anomaly Detector resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAnomalyDetector):
    * Available through the [Azure portal](https://ms.portal.azure.com#blade/HubsExtension/BrowseResourceGroupBlade) until you delete the resource.
    * Use the free pricing tier to try the service, and upgrade later to a paid tier for production.

### Create an environment variable

>[!NOTE]
> The endpoints for non-trial resources created after July 1, 2019 use the custom subdomain format shown below. For more information and a complete list of regional endpoints, see [Custom subdomain names for Cognitive Services](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-custom-subdomains). 

Using your key and endpoint from the resource you created, create two environment variables for authentication:

* `ANOMALY_DETECTOR_KEY` - The resource key for authenticating your requests.
* `ANOMALY_DETECTOR_ENDPOINT` - The resource endpoint for sending API requests. It will look like this: 
  * `https://<your-custom-subdomain>.api.cognitive.microsoft.com` 

Use the instructions for your operating system.

#### [Windows](#tab/windows)

```console
setx ANOMALY_DETECTOR_KEY your-anomaly-detector-key
setx ANOMALY_DETECTOR_ENDPOINT your-anomaly-detector-endpoint
```

After you add the environment variable, restart the console window.

#### [Linux](#tab/linux)

```bash
export ANOMALY_DETECTOR_KEY=your-anomaly-detector-key
export ANOMALY_DETECTOR_ENDPOINT=your-anomaly-detector-endpoint
```

After you add the environment variable, run `source ~/.bashrc` from your console window to make the changes effective.

#### [macOS](#tab/unix)

Edit your `.bash_profile`, and add the environment variable:

```bash
export ANOMALY_DETECTOR_KEY=your-anomaly-detector-key
export ANOMALY_DETECTOR_ENDPOINT=your-anomaly-detector-endpoint
```

After you add the environment variable, run `source .bash_profile` from your console window to make the changes effective.

***