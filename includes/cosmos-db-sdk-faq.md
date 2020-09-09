---
author: SnehaGunda
ms.service: cosmos-db
ms.topic: include
ms.date: 8/12/2020
ms.author: sngun
---
**1. How will customers be notified of the retiring SDK?**

Microsoft will provide 12-month advance notification to the end of support of the retiring SDK in order to facilitate a smooth transition to a supported SDK. Further, customers will be notified through various communication channels – Azure portal, Azure Updates, and direct communication to assigned service administrators.

**2. Can customers author applications using a "to-be" retired Azure Cosmos DB SDK during the 12-month period?** 

Yes, customers will have full access to author, deploy, and modify applications using the "to-be" retired Azure Cosmos DB SDK during the 12-month notice period. During the 12-month notice period, customers are advised to migrate to a newer supported version of Azure Cosmos DB SDK as appropriate. 

**3. After the retirement date, what happens to applications that are using the unsupported Azure Cosmos DB SDK?** 

After the retirement date, Azure Cosmos DB will no longer make bug fixes, add new features, and provide support to the retired SDK versions. If you prefer not to upgrade, requests sent from the retired versions of the SDK will continue to be served by the Azure Cosmos DB service. 

**4. Which SDK versions will have the latest features and updates?**

New features and updates will only be added to the latest minor version of the latest supported major SDK version. It is recommended to always use the latest version to take advantage of new features, performance improvements, and bug fixes. If you are using an old, non-retired, version of the SDK your requests to Azure Cosmos DB will still function, but you will not have access to any new capabilities.  

**5. What should I do if I cannot update my application before a cut-off date?**

We recommend that you upgrade to the latest SDK as early as possible. Once an SDK has been tagged for retirement, you will have 12 months to update your application. If you are not able to update by the retirement date, requests sent from the retired versions of the SDK will continue to be served by Azure Cosmos DB, so your running applications will continue to function. However, Azure Cosmos DB will no longer make bug fixes, add new features, and provide support to the retired SDK versions. 

If you have a support plan and require technical support, please [contact us](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview) by filing a support ticket.
    


