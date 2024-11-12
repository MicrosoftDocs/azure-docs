---

title: Include file
description: Include file
services: api-center
author: dlepow

ms.service: azure-api-center
ms.topic: include
ms.date: 11/07/2024
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
| Maximum number of custom metadata properties per entity<sup>3</sup> | 10 | 20 |
| Maximum number of child properties in custom metadata property of type "object" | 10 |10 | 
| Maximum requests per minute (data plane) | 3,000 | 6,000  |
| Maximum number of APIs accessed through data plane API | 5 | 10,000 |
| Maximum number of API definitions [analyzed](../enable-managed-api-analysis-linting.md) | 10 | 2,000<sup>4</sup>  |
| Maximum number of linked API sources<sup>5</sup> | 1  |  3 |
| Maximum number of APIs synchronized from a linked API source | 200 | 2,000<sup>4</sup>  |

<sup>1</sup> Free plan provided for 90 days, then service is soft-deleted. Use of full service features including API analysis and access through the data plane API is limited.<br/>
<sup>2</sup> To increase a limit in the Standard plan, contact [support](https://azure.microsoft.com/support/options/).<br/>
<sup>3</sup> Custom metadata properties assigned to APIs, deployments, and environments.<br/>
<sup>4</sup> Process can take a few minutes to up to 24 hours to complete.<br/> 
<sup>5</sup> Sources such as linked API Management instances. 
