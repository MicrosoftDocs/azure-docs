---
author: seesharprun
ms.service: cosmos-db
ms.topic: include
ms.date: 8/12/2020
ms.author: sidandrews
ms.reviewer: mjbrown
---
**How will I be notified of the retiring SDK?**

Microsoft will provide 12 month's advance notice before the end of support of the retiring SDK to facilitate a smooth transition to a supported SDK. We'll notify you through various communication channels: the Azure portal, Azure updates, and direct communication to assigned service administrators.

**Can I author applications by using a to-be-retired Azure Cosmos DB SDK during the 12-month period?** 

Yes, you'll be able to author, deploy, and modify applications by using the to-be-retired Azure Cosmos DB SDK during the 12-month notice period. We recommend that you migrate to a newer supported version of the Azure Cosmos DB SDK during the 12-month notice period, as appropriate. 

**After the retirement date, what happens to applications that use the unsupported Azure Cosmos DB SDK?** 

After the retirement date, Azure Cosmos DB will no longer make bug fixes, add new features, or provide support to the retired SDK versions. If you prefer not to upgrade, requests sent from the retired versions of the SDK will continue to be served by the Azure Cosmos DB service. 

**Which SDK versions will have the latest features and updates?**

New features and updates will be added only to the latest minor version of the latest supported major SDK version. We recommend that you always use the latest version to take advantage of new features, performance improvements, and bug fixes. If you're using an old, non-retired version of the SDK, your requests to Azure Cosmos DB will still function, but you won't have access to any new capabilities.  

**What should I do if I can't update my application before a cutoff date?**

We recommend that you upgrade to the latest SDK as early as possible. After an SDK is tagged for retirement, you'll have 12 months to update your application. If you're not able to update by the retirement date, requests sent from the retired versions of the SDK will continue to be served by Azure Cosmos DB, so your running applications will continue to function. But Azure Cosmos DB will no longer make bug fixes, add new features, or provide support to the retired SDK versions. 

If you have a support plan and require technical support, [contact us](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) by filing a support ticket.

**How can I request features be added to an SDK or connector?**

New features are not always added to every SDK or connector immediately. If there is a feature not supported that you would like added, please add feedback to our [community forum](https://feedback.azure.com/d365community/forum/3002b3be-0d25-ec11-b6e6-000d3a4f0858).
