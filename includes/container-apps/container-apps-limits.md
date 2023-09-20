---
author: craigshoemaker
ms.service: container-apps
ms.topic:  include
ms.date: 09/05/2023
ms.author: cshoe
---

The amount of disk space available to your application varies based on the associated workload profile. Available disk space determines the image size limit you can deploy to your container apps.

For dedicated workload profiles, the image size limit is per instance.

| Display name | Name | Image Size Limit (GB) |
|---|---|---|
| Consumption | consumption | 8\* |
| Dedicated-D4 | D4 |  90 |
| Dedicated-D8 | D8 |  210 |
| Dedicated-D16 | D16 |  460 |
| Dedicated-D32 | D32 |  940 |
| Dedicated-E4 | E4 |  90 |
| Dedicated-E8 | E8 |  210 |
| Dedicated-E16 | E16 |  460 |
| Dedicated-E32 | E32 |  940 |

\* The image size limit for a consumption workload profile is a shared among both image and app. For example, logs used by your app are subject to this size limit.