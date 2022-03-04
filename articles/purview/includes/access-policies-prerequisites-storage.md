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
To enable Azure Purview to manage policies for one or more Azure Storage accounts, execute the following PowerShell commands in the subscription where you'll deploy your Azure Storage account. These PowerShell commands will enable Azure Purview to manage policies on all newly created Azure Storage accounts in that subscription.

If you’re executing these commands locally, be sure to run PowerShell as an administrator.
Alternatively, you can use the [Azure Cloud Shell](../../cloud-shell/overview.md) in the Azure portal: [https://shell.azure.com](https://shell.azure.com).

```powershell
# Install the Az module
Install-Module -Name Az -Scope CurrentUser -Repository PSGallery -Force
# Login into the subscription
Connect-AzAccount -Subscription <SubscriptionID>
# Register the feature
Register-AzProviderFeature -FeatureName AllowPurviewPolicyEnforcement -ProviderNamespace Microsoft.Storage
```

If the output of the last command shows *RegistrationState* as *Registered*, then your subscription is enabled for access policies.
If the output is *Registering*, wait at least 10 minutes before retrying the command.

>[!IMPORTANT]
> The access policy feature is only available on **new** Azure Storage accounts. Storage accounts must meet the following requirements to enforce access policies published from Azure Purview.
> - Storage account versions >= 81.x.x.
> - Created in the subscription **after** the feature *AllowPurviewPolicyEnforcement* is registered

### Create a new Azure Storage account
After you’ve enabled the access policy above, create new Azure Storage account(s) in one of the regions listed below:

[!INCLUDE [Azure Storage specific pre-requisites](access-policies-storage-regions.md)]

You can [follow this guide to create one](../../storage/common/storage-account-create.md).
