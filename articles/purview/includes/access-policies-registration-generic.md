---
author: ePpnqeqR
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: include
ms.date: 01/24/2022
ms.custom:
---

>[!Important]
> Make sure you write down the **Name** you use when registering in Azure Purview. You will need it when you publish a policy. The recommended practice is to make the registered name exactly the same as the endpoint name.

>[!Note]
> - To disable a source for *Data use Governance*, remove it first from being bound (i.e. published) in any policy.
> - While user needs to have both data source *Owner* and Azure Purview *Data source admin* to enable a source for *Data use governance*, any of those roles can independently disable it.
> - Disabling *Data use governance* for a subscription will disable it also for all assets registered in that subscription.

> [!WARNING]
> **Known issues** related to source registration
> - Moving data sources to a different resource group or subscription is not yet supported. If want to do that, de-register the data source in Azure Purview before moving it and then register it again after that happens.
> - Once a subscription gets disabled for *Data use governance* any underlying assets that are enabled for *Data use governance* will be disabled, which is the right behavior. However, policy statements based on those assets will still be allowed after that.

### Data use governance best practices
- We highly encourage registering data sources for *Data use governance* and managing all associated access policies in a single Azure Purview account.
- Should you have multiple Azure Purview accounts, be aware that **all** data sources belonging to a subscription must be registered for *Data use governance* in a single Azure Purview account. That Azure Purview account can be in any subscription in the tenant. The *Data use governance* toggle will become greyed out when there are invalid configurations. Some examples of valid and invalid configurations follow in the diagram below:
    - **Case 1** shows a valid configuration where a Storage account is registered in an Azure Purview account in the same subscription.
    - **Case 2** shows a valid configuration where a Storage account is registered in an Azure Purview account in a different subscription. 
    - **Case 3** shows an invalid configuration arising because Storage accounts S3SA1 and S3SA2 both belong to Subscription 3, but are registered to different Azure Purview accounts. In that case, the *Data use governance* toggle will only work in the Azure Purview account that wins and registers a data source in that subscription first. The toggle will then be greyed out for the other data source.

![Diagram shows valid and invalid configurations when using multiple Azure Purview accounts to manage policies.](../media/access-policies-common/valid-and-invalid-configurations.png)
