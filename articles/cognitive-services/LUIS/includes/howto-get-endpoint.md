---
title: include file
description: include file
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.date: 05/06/2020
ms.subservice: language-understanding
ms.topic: include
ms.custom: include file
ms.author: diberry
---

In the **Manage** section (top-right menu), on the **Azure Resources** page (left menu), copy the **Example Query** URL then paste into a new browser tab.

The endpoint URL looks like the following format, with your own custom subdomain, app ID, and endpoint key replacing APP-ID, and KEY-ID:

```console
https://YOUR-CUSTOM-SUBDMAIN.api.cognitive.microsoft.com/luis/prediction/v3.0/apps/APP-ID/slots/production/predict?subscription-key=KEY-ID&verbose=true&show-all-intents=true&log=true&query=YOUR_QUERY_HERE
```