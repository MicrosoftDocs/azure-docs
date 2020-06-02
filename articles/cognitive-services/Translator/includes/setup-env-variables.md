---
author: erhopf
ms.service: cognitive-services
ms.topic: include
ms.date: 08/06/2019
ms.author: erhopf
---
## Set up

### Create a Translator resource

Azure Cognitive Services are represented by Azure resources that you subscribe to. Create a resource for Translator using the [Azure portal](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) or [Azure CLI](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account-cli) on your local machine. You can also:

* Get a [trial key](https://azure.microsoft.com/try/cognitive-services) valid for 7 days for free. After signing up, it will be available on the Azure website.
* View an existing resource in the [Azure portal](https://portal.azure.com/).

After you get a key from your trial subscription or resource, create two [environment variables](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication):

* `TRANSLATOR_TEXT_SUBSCRIPTION_KEY` - The subscription key for your Translator resource.
* `TRANSLATOR_TEXT_ENDPOINT` - The global endpoint for Translator. Use `https://api.cognitive.microsofttranslator.com/`.
