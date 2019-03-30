---
author: SnehaGunda
ms.service: cosmos-db
ms.topic: include
ms.date: 11/09/2018
ms.author: sngun
---
**1. How will customers be notified of the retiring SDK?**

Microsoft will provide 12 month advance notification to the end of support of the retiring SDK in order to facilitate a smooth transition to a supported SDK. Further, customers will be notified through various communication channels – Azure Management Portal, Developer Center, blog post, and direct communication to assigned service administrators.

**2. Can customers author applications using a "to-be" retired Azure Cosmos DB SDK during the 12 month period?** 

Yes, customers will have full access to author, deploy and modify applications using the "to-be" retired Azure Cosmos DB SDK during the 12 month grace period. During the 12 month grace period, customers are advised to migrate to a newer supported version of Azure Cosmos DB SDK as appropriate.

**3. Can customers author and modify applications using a retired Azure Cosmos DB SDK after the 12 month notification period?**

After the 12 month notification period, the SDK will be retired. Any access to Azure Cosmos DB by an applications using a retired SDK will not be permitted by the Azure Cosmos DB platform. Further, Microsoft will not provide customer support on the retired SDK.

**4. What happens to Customer’s running applications that are using unsupported Azure Cosmos DB SDK version?**

Any attempts made to connect to the Azure Cosmos DB service with a retired SDK version will be rejected. 

**5. Will new features and functionality be applied to all non-retired SDKs?**

New features and functionality will only be added to new versions. If you are using an old, non-retired, version of the SDK your requests to Azure Cosmos DB will still function as previous but you will not have access to any new capabilities.  

**6. What should I do if I cannot update my application before a cut-off date?**

We recommend that you upgrade to the latest SDK as early as possible. Once an SDK has been tagged for retirement you will have 12 months to update your application. If, for whatever reason, you cannot complete your application update within this timeframe then please contact the [Cosmos DB Team](mailto:askcosmosdb@microsoft.com) and request their assistance before the cutoff date.

