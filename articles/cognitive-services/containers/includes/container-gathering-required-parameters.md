---
title: Gathering required parameters
services: cognitive-services
author: aahill
manager: nitinme
description: The parameters for all Cognitive Services' containers
ms.service: cognitive-services
ms.topic: include 
ms.date: 04/01/2020
ms.author: aahi
---

## Gathering required parameters

There are three primary parameters for all Cognitive Services' containers that are required. The end-user license agreement (EULA) must be present with a value of `accept`. Additionally, both an Endpoint URL and API Key are needed.

### Endpoint URI `{ENDPOINT_URI}`

The **Endpoint** URI value is available on the Azure portal *Overview* page of the corresponding Cognitive Service resource. Navigate to the *Overview* page, hover over the Endpoint, and a `Copy to clipboard` <span class="docon docon-edit-copy x-hidden-focus"></span> icon will appear. Copy and use where needed.

![Gather the endpoint uri for later use](../media/overview-endpoint-uri.png)

### Keys `{API_KEY}`

This key is used to start the container, and is available on the Azure portal's Keys page of the corresponding Cognitive Service resource. Navigate to the *Keys* page, and click on the `Copy to clipboard` <span class="docon docon-edit-copy x-hidden-focus"></span> icon.

![Get one of the two keys for later use](../media/keys-copy-api-key.png)

> [!IMPORTANT]
> These subscription keys are used to access your Cognitive Service API. Do not share your keys. Store them securely, for example, using Azure Key Vault. We also recommend regenerating these keys regularly. Only one key is necessary to make an API call. When regenerating the first key, you can use the second key for continued access to the service.