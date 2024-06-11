---
author: tfitzmac
ms.service: azure-app-configuration
ms.topic: include
ms.date: 12/05/2023
ms.author: tomfitz
---
| Resource | Limit | Comment |
| --- | --- | ---|
| Configuration stores for Free tier | One store per region per subscription. |
| Configuration stores for Standard tier | Unlimited stores per subscription. |
| Configuration store requests for Free tier | 1,000 requests per day  | Once the quota is exhausted, HTTP status code 429 is returned for all requests until the end of the day. |
| Configuration store requests for Standard tier | 30,000 per hour  |Once the quota is exhausted, requests may return HTTP status code 429 indicating Too Many Requests - until the end of the hour.|
| Storage for Free tier | 10 MB | There is no limit on the number of keys and labels as long as their total size is below the storage limit. |
| Storage for Standard tier | 1 GB | There is no limit on the number of keys and labels as long as their total size is below the storage limit. |
| Keys and values | 10 KB  | For a single key-value item, including all metadata. |
| Snapshots storage for Free tier | 10 MB | Snapshots storage is extra and in addition to "Storage for Free Tier". Storage for both archived and active snapshots is counted towards this limit. |
| Snapshots storage for Standard tier | 1 GB | Snapshots storage is extra and in addition to "Storage for Standard Tier". Storage for both archived and active snapshots is counted towards this limit. |
| Snapshot size | 1 MB | |
