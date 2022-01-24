---
author: ePpnqeqR
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: include
ms.date: 01/24/2022
ms.custom: references_regions
---

### Enable access policy enforcement for the Azure Storage account
To enable Azure Purview to manage policies for one or more Storage accounts, execute the following PowerShell commands in the subscription where the Azure Storage account resides. It will cover all Azure Storage accounts in that subscription.

```powershell
# Install the Az module
Install-Module -Name Az -Scope CurrentUser -Repository PSGallery -Force
# Login into the subscription
Connect-AzAccount -Subscription <SubscriptionID>
# Register the feature
Register-AzProviderFeature -FeatureName AllowPurviewPolicyEnforcement -ProviderNamespace Microsoft.Storage
```
If the output of the last command shows value of *RegistrationState* as *Registered*, then your subscription is enabled for this functionality. In case the output is *Registering*, retry the last command after waiting at least 10 minutes.

>[!IMPORTANT]
> The access policy feature is only available on **new** Azure Storage accounts. Only Storage accounts meeting all the requirements below will enforce access policies published from Azure Purview.
> - Storage account versions >= 81.x.x.
> - Created in the subscription after the feature *AllowPurviewPolicyEnforcement* is registered

### Create a new Azure Storage account
- Create new Azure Storage account(s) in one of the regions listed below. You can [follow this guide to create one](../storage/common/storage-account-create.md)

### Supported regions

#### Azure Purview (management side)
The Azure Purview access policies capability is available in all Azure Purview [regions](https://azure.microsoft.com/global-infrastructure/services/?products=purview&regions=all)

#### Azure Storage (enforcement side)
Azure Purview access policies can only be enforced in the following Azure Storage regions
-   France Central
-   Canada Central
