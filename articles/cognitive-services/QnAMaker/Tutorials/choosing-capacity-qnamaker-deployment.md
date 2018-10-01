---
title: Resource capacity for deployment - QnA Maker
titleSuffix: Azure Cognitive Services 
description: A guide to choosing capacity for your QnA Maker deployment
services: cognitive-services
author: tulasim88
manager: cgronlun
ms.service: cognitive-services
ms.component: qna-maker
ms.topic: article
ms.date: 09/12/2018
ms.author: tulasim
---

# Choosing capacity for your QnA Maker deployment

The QnA Maker service, takes a dependency on three Azure resources:
1.	App Service (for the runtime)
2.	Azure Search (for storing QnAs)
3.	App Insights (optional, for storing chat logs and telemetry)

Before you create your QnA Maker service, you should decide which tier of the above services is appropriate for you. 

Typically there are three parameters you need to consider:
1. **The throughput you need from the service**: Select the appropriate [App Plan](https://azure.microsoft.com/en-in/pricing/details/app-service/plans/) for your App service based on your needs. You can [scale up](https://docs.microsoft.com/azure/app-service/web-sites-scale) or down the App. This should also influence your Azure Search SKU selection, see more details [here](https://docs.microsoft.com/azure/search/search-sku-tier).

2. **Size and the number of knowledge bases**: Choose the appropriate [Azure search SKU](https://azure.microsoft.com/en-in/pricing/details/search/) for your scenario. You can publish N-1 knowledge bases in a particular tier, where N is the maximum indexes allowed in the tier. Also check the maximum size and the number of documents allowed per tier.

3. **Number of documents as sources**: The free SKU of the QnA Maker management service limits the number of documents you can manage via the portal and the APIs to 3 (of 1 MB size each). The standard SKU has no limits to the number of documents you can manage. See more details [here](https://aka.ms/qnamaker-pricing).

The following table gives you some high-level guidelines.

|                        | QnA Maker Management | App Service | Azure Search | Limitations                      |
| ---------------------- | -------------------- | ----------- | ------------ | -------------------------------- |
| Experimentation        | Free SKU             | Free Tier   | Free Tier    | Publish Up to 2 KBs, 50 MB size  |
| Dev/Test Environment   | Standard SKU         | Shared      | Basic        | Publish Up to 14 KBs, 2 GB size    |
| Production Environment | Standard SKU         | Basic       | Standard     | Publish Up to 49 KBs, 25 GB size |

For upgrading your QnA Maker stack, see [Upgrade your QnA Maker service](../How-To/upgrade-qnamaker-service.md).

## Next steps

> [!div class="nextstepaction"]
> [Upgrade your QnA Maker service](../How-To/upgrade-qnamaker-service.md)
