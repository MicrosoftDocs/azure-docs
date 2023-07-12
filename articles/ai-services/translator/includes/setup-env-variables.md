---
author: laujan
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: include
ms.date: 07/18/2023
ms.author: lajanuar
---
## Set up

### Create a Translator resource

Azure AI services are represented by Azure resources that you subscribe to. Create a resource for Translator using the [Azure portal](../../multi-service-resource.md?pivots=azportald) or [Azure CLI](../../multi-service-resource.md?pivots=azcli) on your local machine. You can also:

* View an existing resource in the [Azure portal](https://portal.azure.com/).

After you get a key from your trial subscription or resource, create two [environment variables](../../multi-service-resource.md?pivots=azportal#configure-an-environment-variable-for-authentication):

* `TRANSLATOR_TEXT_KEY` - The key for your Translator resource.
* `TRANSLATOR_TEXT_ENDPOINT` - The global endpoint for Translator. Use `https://api.cognitive.microsofttranslator.com/`.
