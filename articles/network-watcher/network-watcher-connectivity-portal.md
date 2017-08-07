---
title: Check connectivity with Azure Network Watcher - Azure portal | Microsoft Docs
description: This page explains how to use connectivity check with Network Watcher using the Azure portal
services: network-watcher
documentationcenter: na
author: georgewallace
manager: timlt
editor: 

ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 08/03/2017
ms.author: gwallace
---

# Check connectivity with Azure Network Watcher using the Azure portal

> [!div class="op_single_selector"]
> - [Portal](network-watcher-connectivity-portal.md)
> - [PowerShell](network-watcher-connectivity-powershell.md)
> - [CLI 2.0](network-watcher-connectivity-cli.md)
> - [Azure REST API](network-watcher-connectivity-rest.md)

Learn how to use connectivity to verify if a direct TCP connection from a virtual machine to a given endpoint can be established.

This article takes you through some connectivity check scenarios.

* [Check connectivity to a virtual machine](#check-connectivity-to-a-virtual-machine)
* [Validate routing issues](#validate-routing-issues)
* [Check website latency](#check-website-latency)
* [Check connectivity to a storage endpoint](#check-connectivity-to-a-storage-endpoint)

## Before you begin

This article assumes you have the following resources:

* An instance of Network Watcher in the region you want to check connectivity.

* Virtual machines to check connectivity with.

[!INCLUDE [network-watcher-preview](../../includes/network-watcher-public-preview-notice.md)]

> [!IMPORTANT]
> Connectivity check requires a virtual machine extension `AzureNetworkWatcherExtension`. For installing the extension on a Windows VM visit [Azure Network Watcher Agent virtual machine extension for Windows](../virtual-machines/windows/extensions-nwa.md) and for Linux VM visit [Azure Network Watcher Agent virtual machine extension for Linux](../virtual-machines/linux/extensions-nwa.md).

## Register the preview capability

Connectivity is currently in public preview, to use this feature it needs to be registered. To do this, run the following PowerShell sample:

```powershell
Register-AzureRmProviderFeature -FeatureName AllowNetworkWatcherConnectivityCheck  -ProviderNamespace Microsoft.Network
Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Network
```

To verify the registration was successful, run the following Powershell sample:

```powershell
Get-AzureRmProviderFeature -FeatureName AllowNetworkWatcherConnectivityCheck  -ProviderNamespace  Microsoft.Network
```

If the feature was properly registered, the output should match the following:

```
FeatureName         ProviderName      RegistrationState
-----------         ------------      -----------------
AllowNetworkWatcherConnectivityCheck  Microsoft.Network Registered
```

## Check connectivity to a virtual machine

This example checks connectivity to a destination virtual machine over port 80.

Navigate to your Network Watcher and click **Connectivity check (Preview)**. Select the virtual machine to check connectivity from. In the **Destination** section choose **Select a virtual machine** and choose the correct virtual machine and port to test.

Once you click **Check**, the connectivity between the virtual machines on the port specified are checked. In the example, the destination VM is unreachable, a listing of hops are shown.

![Check connectivity results for a virtual machine][1]

## Check website latency

To verify the latency, choose the **Specify manually** radio button in the **Destination** section, input the url and the port and click **Check**

![Check connectivity results for a web site][2]

## Check connectivity to a storage endpoint

The following example checks the connectivity from a virtual machine to a blog storage account.

### Example

```azurecli
az network watcher test-connectivity --resource-group ContosoRG --source-resource MultiTierApp0 --dest-address https://contosoexamplesa.blob.core.windows.net/
```

### Response

The following json is the example response from running the previous cmdlet. As the check is successful, the `connectionStatus` property shows as **Reachable**.  You are provided the details regarding the number of hops required to reach the storage blob and latency.

```json
{
  "avgLatencyInMs": 1,
  "connectionStatus": "Reachable",
  "hops": [
    {
      "address": "10.1.1.4",
      "id": "5136acff-bf26-4c93-9966-4edb7dd40353",
      "issues": [],
      "nextHopIds": [
        "f8d958b7-3636-4d63-9441-602c1eb2fd56"
      ],
      "resourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ContosoRG/providers/Microsoft.Network/networkInterfaces/appNic0/ipConfigurations/ipconfig1",
      "type": "Source"
    },
    {
      "address": "1.2.3.4",
      "id": "f8d958b7-3636-4d63-9441-602c1eb2fd56",
      "issues": [],
      "nextHopIds": [],
      "resourceId": "Internet",
      "type": "Internet"
    }
  ],
  "maxLatencyInMs": 7,
  "minLatencyInMs": 0,
  "probesFailed": 0,
  "probesSent": 100
}
```

## Next steps

Learn how to automate packet captures with Virtual machine alerts by viewing [Create an alert triggered packet capture](network-watcher-alert-triggered-packet-capture.md)

Find if certain traffic is allowed in or out of your VM by visiting [Check IP flow verify](network-watcher-check-ip-flow-verify-portal.md)

[1]: ./media/network-watcher-connectivity-portal/figure1.png
[2]: ./media/network-watcher-connectivity-portal/figure2.png