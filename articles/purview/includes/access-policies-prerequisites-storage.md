---
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: include
ms.date: 03/16/2023
ms.custom: references_regions
---

#### Configure the subscription where the Azure Storage account resides for policies from Microsoft Purview
To enable Microsoft Purview to manage policies for one or more Azure Storage accounts, execute the following PowerShell commands in the subscription where you'll deploy your Azure Storage account. These PowerShell commands will enable Microsoft Purview to manage policies on all **newly created** Azure Storage accounts in that subscription.

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
If the output is *Registering*, wait at least 10 minutes, and then retry the command. **Do not continue unless the RegistrationState shows as *Registered***.

#### Region support
- All [Microsoft Purview regions](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=purview) are supported.
- Microsoft Purview access policies can only be enforced in the following Azure Storage regions:
    - East US
    - East US2
    - South Central US
    - West US
    - West US2
    - Canada Central
    - North Europe
    - West Europe
    - France Central
    - UK South
    - East Asia
    - Southeast Asia
    - Japan East
    - Japan West
    - Australia East
- The following regions support only **new** Azure Storage accounts. That is, Storage accounts created in the subscription **after** the feature *AllowPurviewPolicyEnforcement* is *Registered*.
    - West US
    - East Asia
    - Japan East
    - Japan West
- Only **new** Storage accounts with zone-redundant storage (ZRS) are supported. That is, Storage accounts created in the subscription **after** the feature *AllowPurviewPolicyEnforcement* is *Registered*. Note, ZRS Storage accounts will start enforcing policies from Microsoft Purview within 2 hours.

If needed, you can also create a new Storage account by [following this guide](../../storage/common/storage-account-create.md).
