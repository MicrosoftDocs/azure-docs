---
title: Understand billing transactions
description: Understand billing transactions. 
author: stevemunk
ms.author: v-stevenmunk
ms.date: 01/10/2024
ms.topic: include
ms.service: azure-maps
services: azure-maps
---

Azure Maps doesn't count billing transactions for:

- 5xx HTTP Status Codes
- 401 (Unauthorized)
- 403 (Forbidden)
- 408 (Timeout)
- 429 (TooManyRequests)
- CORS preflight requests

For more information on billing transactions and other Azure Maps pricing information, see [Azure Maps pricing](https://azure.microsoft.com/pricing/details/azure-maps/).
