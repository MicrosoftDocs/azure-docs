---
title: Azure Firewall preview features
description: Learn about Azure Firewall preview features that are currently publicly available.
services: firewall
author: vhorne
ms.service: firewall
ms.topic: conceptual
ms.date: 01/24/2022
ms.author: victorh
---

# Azure Firewall preview features

The following Azure Firewall preview features are available publicly for you to deploy and test. Some of the preview features are available on the Azure portal, and some are only visible using a feature flag.

> [!IMPORTANT]
> These features are currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Feature flags

As new features are released to preview, some of them will be behind a feature flag. To enable the functionality in your environment, you must enable the feature flag on your subscription. These features are applied at the subscription level for all firewalls (VNet firewalls and SecureHub firewalls).  

This article will be updated to reflect the features that are currently in preview with instructions to enable them. When the features move to General Availability (GA), they'll be available to all customers without the need to enable a feature flag. 

Commands are run in Azure PowerShell to enable the features. For the feature to immediately take effect, an operation needs to be run on the firewall. This can be a rule change (least intrusive), a setting change, or a stop/start operation. Otherwise, the firewall/s is updated with the feature within several days.

## Preview features

The following features are available in preview.

### Network rule name logging (preview)

Currently, a network rule hit event shows the following attributes in the logs: 

   - Source and destination IP/port
   - Action (allow, or deny)

 With this new feature, the event logs for network rules also show the following attributes:
   - Policy name
   - Rule collection group
   - Rule collection
   - Rule name 

Run the following Azure PowerShell commands to configure Azure Firewall network rule name logging:

```azurepowershell
Connect-AzAccount 
Select-AzSubscription -Subscription "subscription_id or subscription_name" 
Register-AzProviderFeature -FeatureName AFWEnableNetworkRuleNameLogging -ProviderNamespace Microsoft.Network 
```

Run the following Azure PowerShell command to turn off this feature:

```azurepowershell
Unregister-AzProviderFeature -FeatureName AFWEnableNetworkRuleNameLogging -ProviderNamespace Microsoft.Network 
```

### Azure Firewall Premium performance boost (preview)

As more applications move to the cloud, the performance of the network elements can become a bottleneck. As the central piece of any network design, the firewall needs to support all the workloads. The Azure Firewall Premium performance boost feature allows more scalability for these deployments.

This feature significantly increases the throughput of Azure Firewall Premium. For more details, see [Azure Firewall performance](firewall-performance.md).

Currently, the performance boost feature isn't recommended for SecureHub Firewalls. Refer back to this article for the latest updates as we work to change this recommendation. Also, this setting has no effect on Standard Firewalls.

Run the following Azure PowerShell commands to configure the Azure Firewall Premium performance boost:

```azurepowershell
Connect-AzAccount
Select-AzSubscription -Subscription "subscription_id or subscription_name"
Register-AzProviderFeature -FeatureName AFWEnableAccelnet -ProviderNamespace Microsoft.Network
```

Run the following Azure PowerShell command to turn off this feature:

```azurepowershell
Unregister-AzProviderFeature -FeatureName AFWEnableAccelnet -ProviderNamespace Microsoft.Network
```

## Next steps

To learn more about Azure Firewall, see [What is Azure Firewall?](overview.md).