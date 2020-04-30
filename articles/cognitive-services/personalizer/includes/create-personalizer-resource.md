---
title: include file
description: include file
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: include
ms.custom: include file
ms.date: 01/15/2020
ms.author: diberry
---
## Create a Personalizer Azure resource

Create a resource for Personalizer using the [Azure portal](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) or [Azure CLI](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account-cli) on your local machine. You can also:

* Get a [trial key](https://azure.microsoft.com/try/cognitive-services) valid for 7 days for free. After signing up, it will be available on the [Azure website](https://azure.microsoft.com/try/cognitive-services/my-apis/).
* View your resource on the [Azure portal](https://portal.azure.com/).

After you get a key from your trial subscription or resource, create two [environment variable](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account#configure-an-environment-variable-for-authentication):

* `PERSONALIZER_RESOURCE_KEY` for the resource key.
* `PERSONALIZER_RESOURCE_ENDPOINT` for the resource endpoint.

In the Azure portal, both the key and endpoint values are available from the **quickstart** page.
