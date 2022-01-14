---
author: ePpnqeqR
ms.author: vlrodrig
ms.service: purview
ms.subservice: purview-data-policies
ms.topic: include
ms.date: 11/23/2021
ms.custom:
---

### Enable access policy enforcement for the Azure Storage account
Execute the following PowerShell commands in the subscription where the Azure Storage account resides. It will cover all Azure Storage accounts in that subscription.

```powershell
# Install the Az module
Install-Module -Name Az -Scope CurrentUser -Repository PSGallery -Force
# Login into the subscription
Connect-AzAccount -Subscription <SubscriptionID>
# Register the feature
Register-AzProviderFeature -FeatureName AllowPurviewPolicyEnforcement -ProviderNamespace Microsoft.Storage
```
If the output of the last command shows value of *RegistrationState* as *Registered*, then your subscription is enabled for this functionality. In case the output is *Registering*, retry the last command after waiting at least 10 minutes.

> [!Warning]
> Only **new** Storage accounts, created in the subscription  after the feature *AllowPurviewPolicyEnforcement* is registered, will comply with access policies published from Azure Purview. 