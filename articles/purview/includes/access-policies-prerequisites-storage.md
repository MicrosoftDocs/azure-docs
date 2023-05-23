---
author: inward-eye
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: include
ms.date: 05/23/2023
ms.custom: references_regions
---

#### Configure the subscription where the Azure Storage account resides for policies from Microsoft Purview
To enable Microsoft Purview to manage policies for one or more Azure Storage accounts, execute the following PowerShell commands in the subscription where you'll deploy your Azure Storage account. These PowerShell commands will enable Microsoft Purview to manage policies on all **newly created** Azure Storage accounts in that subscription. Accounts that were created before running the commands are also supported, depending on their region (see region support section).

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
- Storage accounts in the following regions require the feature *AllowPurviewPolicyEnforcement* to be set as described earlier. In those regions, all Storage accounts created after the feature is set are supported. In addition, all Storage accounts created before the feature is set are supported as well, unless they are configured for zone-redundant storage (ZRS).  
    - East US
    - East US2
    - South Central US
    - West US2
    - Canada Central
    - North Europe
    - West Europe
    - France Central
    - UK South
    - Southeast Asia
    - Australia East
- Storage accounts in other regions in Public Cloud are supported without the need to set the feature *AllowPurviewPolicyEnforcement*.

If needed, you can also create a new Storage account by [following this guide](../../storage/common/storage-account-create.md).
