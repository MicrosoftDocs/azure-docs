---
author: tfitzmac
ms.service: azure-app-configuration
ms.topic: include
ms.date: 08/19/2021    
ms.author: tomfitz
---
| Resource | Limit | Comment |
| --- | --- | ---|
| Configuration stores for Free tier | 1 store per subscription |
| Configuration stores for Standard tier | Unlimited stores per subscription | 
| Configuration store requests for Free tier | 1,000 requests per day  | Once the quota is exhausted, HTTP status code 429 will be returned for all requests until the end of the day |
| Configuration store requests for Standard tier | 30,000 per hour  |Once the quota is exhausted, requests may return HTTP status code 429 indicating Too Many Requests - until the end of the hour|  
| Storage for Free tier | 10 MB |
| Storage for Standard tier | 1 GB |
| Keys and Values | 10 KB  | For a single key-value item, including all metadata
