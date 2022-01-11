---
title: Azure Firewall performance 
description: Compare Azure Firewall performance for Azure Firewall Standard and Premium
services: firewall
author: vhorne
ms.service: firewall
ms.topic: conceptual
ms.date: 01/11/2022
ms.author: victorh
---

# Azure Firewall performance

Reliable firewall performance is essential to operate and protect your virtual networks in Azure. More advanced features (like those found in Azure Firewall Premium) require more processing complexity. This will affect firewall performance and impact the overall network performance.

Azure Firewall has two versions: Standard and Premium.

- Azure Firewall Standard

   Azure Firewall Standard has been generally available since September 2018. It's cloud native, highly available, with built-in auto scaling firewall-as-a-service. You can centrally govern and log all your traffic flows using a DevOps approach. The service supports both application and network level-filtering rules, and is integrated with the Microsoft Threat Intelligence feed for filtering known malicious IP addresses and domains. 
- Azure Firewall Premium

   Azure Firewall Premium is a next generation firewall with capabilities that are required for highly sensitive and regulated environments. The features that might affect the performance of the Firewall are TLS inspection and IDPS (Intrusion Detection and Prevention).

For more information about Azure Firewall, see [What is Azure Firewall?](overview.md)

## Performance testing

Before deploying Azure Firewall, the performance needs to be tested and evaluated to ensure it meets your expectations. Not only should Azure Firewall handle the current traffic on a network, but it should also be ready for potential traffic growth. It's recommended to evaluate on a test network and not in a production environment. The testing should attempt to replicate the production environment as close as possible. This includes the network topology, and emulating the actual characteristics of the expected traffic through the firewall.

## Performance data

The following set of performance results demonstrates the maximal Azure Firewall throughput in various use cases. All use cases were measured while Threat intelligence mode was set to alert/deny.


|Firewall type and use case  |TCP/UDP bandwidth (Gbps)  |HTTP/S bandwidth (Gbps)  |
|---------|---------|---------|
|Standard     |30|30|
|Premium (no TLS/IDPS)     |30|30|
|Premium with TLS     |-|30|
|Premium with IDS     |30|30|
|Premium with IPS      |10|10|

> [!NOTE]
> IPS (Intrusion Prevention System) takes place when one or more signatures are configured to *Alert and Deny* mode.

Azure Firewall Premium’s new performance boost functionality is now in public preview and provides you with enhancements to the overall firewall performance as shown below:


|Firewall use case  |Without performance boost (Gbps)  |With performance boost (Gbps)  |
|---------|---------|---------|
|Standard<br>Max bandwidth for single TCP connection     |1.3|-|
|Premium<br>Max bandwidth for single TCP connection     |2.6|9.5|
|Premium max bandwidth with TLS/IDS|30|100|

Performance values are calculated with Azure Firewall at full scale and with Premium performance boost enabled. Actual performance may vary depending on your rule complexity and network configuration. These metrics are updated periodically as performance continuously evolves with each release.

## How to configure Premium performance boost (preview)

As more applications are moved to the cloud, the network element performance becomes a bottleneck. As a result, Premium performance boost (preview) for Azure Firewall Premium is available to allow more scalability for those deployments.

To enable the Azure Firewall Premium performance boost, run the following Azure PowerShell commands. This feature is applied at the **subscription** level for all Firewalls (VNet Firewalls and SecureHub Firewalls). Currently, Azure Firewall Premium Performance boost is not recommended SecureHub Firewalls. Check back here for the latest updates as we work to change this recommendation. Also, this setting does not have any effect on standard Firewalls.

After you run the Azure PowerShell commands, an update operation needs to be run on the Azure Firewall for the feature to immediately take effect. This update operation can be a rule change (least intrusive), a setting configuration, or a Stop/Start operation. Otherwise, the firewall/s will update with the feature within several days.

Run the following Azure PowerShell to configure the Azure Firewall Premium performance boost:

```azurepowershell
Connect-AzAccount  

Select-AzSubscription -Subscription "subscription_id or subscription_name"

Register-AzProviderFeature -FeatureName AFWEnableAccelnet  -ProviderNamespace Microsoft.Network  
```

Run the following Azure PowerShell to turn it off:

```azurepowershell
Unregister-AzProviderFeature -FeatureName AFWEnableAccelnet  -ProviderNamespace Microsoft.Network 
```



## Next steps

- Learn how to [deploy and configure an Azure Firewall](tutorial-firewall-deploy-portal.md).