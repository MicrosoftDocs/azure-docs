---

title: Include file
description: Include file
services: api-center
author: dlepow

ms.service: azure-api-center
ms.topic: include
ms.date: 10/18/2024
ms.author: danlep
ms.custom: Include file
---

| Resource | Free plan<sup>1</sup> | Standard plan<sup>2</sup> |
| ---------------------------------------------------------------------- | -------------------------- |-------------|
| Maximum number of APIs | 200<sup>3</sup> |  10,000 |
| Maximum number of versions per API | 5 | 100 |
| Maximum number of definitions per version | 5  | 5 |
| Maximum number of deployments per API | 10 | 10 |
| Maximum number of environments | 20 | 20 |
| Maximum number of workspaces  | 1 (Default) | 1 (Default) |
| Maximum number of custom metadata properties per entity<sup>4</sup> | 10 | 20 |
| Maximum number of child properties in custom metadata property of type "object" | 10 |10 | 
| Maximum requests per minute (data plane) | 3,000 | 6,000  |
| Maximum number of API definitions [linted](../enable-managed-api-analysis-linting.md) | 10 | 200 per 24 hours  |
| Maximum number of linked API sources<sup>5</sup> | 1  |  3 |

<sup>1</sup> Free plan provided for 90 days, then service is soft-deleted.<br/>
<sup>2</sup> To increase a limit in the Standard plan, contact [support](https://azure.microsoft.com/support/options/).<br/>
<sup>3</sup> In the Free plan, use of full service features including API analysis and access through the data plane API is limited to 5 APIs.<br/>
<sup>4</sup> Custom metadata properties assigned to APIs, deployments, and environments.<br/>
<sup>5</sup> Sources such as linked API Management instances. In the Free plan, synchronization from a linked API source is limited to 200 APIs and 5 API definitions.
