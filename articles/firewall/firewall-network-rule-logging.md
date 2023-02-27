---
title: Azure Firewall network rule name logging (preview)
description: Learn about Azure Firewall network rule name logging (preview)
services: firewall
author: vhorne
ms.service: firewall
ms.topic: conceptual
ms.date: 01/25/2023
ms.author: victorh
---

# Azure Firewall network rule name logging (preview)


> [!IMPORTANT]
> This feature is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Currently, a network rule hit event shows the following attributes in the logs: 

   - Source and destination IP/port
   - Action (allow, or deny)

 With this new feature, the event logs for network rules also show the following attributes:
   - Policy name
   - Rule collection group
   - Rule collection
   - Rule name 

## Enable/disable network rule name logging

To enable the Network Rule name Logging feature, the following commands need to be run in Azure PowerShell. For the feature to immediately take effect, an operation needs to be run on the firewall. This operation can be a rule change (least intrusive), a setting change, or a stop/start operation. Otherwise, the firewall/s is updated with the feature within several days.

Run the following Azure PowerShell commands to configure Azure Firewall network rule name logging:

```azurepowershell
Connect-AzAccount 
Select-AzSubscription -Subscription "subscription_id or subscription_name" 
Register-AzProviderFeature -FeatureName AFWEnableNetworkRuleNameLogging -ProviderNamespace Microsoft.Network
Register-AzResourceProvider -ProviderNamespace Microsoft.Network 
```

Run the following Azure PowerShell command to turn off this feature:

```azurepowershell
Unregister-AzProviderFeature -FeatureName AFWEnableNetworkRuleNameLogging -ProviderNamespace Microsoft.Network 
```

## Next steps


- To learn more about Azure Firewall logs and metrics, see [Azure Firewall logs and metrics](logs-and-metrics.md)