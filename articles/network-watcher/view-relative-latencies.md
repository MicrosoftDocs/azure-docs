---
title: View relative latencies to Azure regions from specific locations | Microsoft Docs
description: Learn how to view relative latencies across Internet providers to Azure regions from specific locations.
services: network-watcher
documentationcenter: ''
author: jimdial
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 12/14/2017
ms.author: jdial
ms.custom: 

---
# View relative latency to Azure regions from specific locations

In this tutorial, learn how to use the Azure [Network Watcher](network-watcher-monitoring-overview.md) service to view relative latencies across Internet service providers to Azure regions, from specific locations.

## Register for the preview 

> [!NOTE]
> This tutorial utilizes features that are currently in preview release. Features in preview release do not have the same availability and reliability as features in general release.

Install and configure [PowerShell](/powershell/azure/install-azurerm-ps?toc=%2fazure%2fnetwork-watcher%2ftoc.json). Ensure you have version 5.1.1 or higher of the AzureRm module installed. You can check your currently installed version by entering the `Get-Module -ListAvailable AzureRM` command. If you need to install or upgrade, install the latest version of the AzureRM module from the [PowerShell Gallery](https://www.powershellgallery.com/packages/AzureRM). 

In a PowerShell session, log in to Azure with your [Azure account](../azure-glossary-cloud-terminology.md?toc=%2fazure%2fnetwork-watcher%2ftoc.json#account) using the `login-azurermaccount` command. Register for the preview by entering the following commands:
    
```powershell
Register-AzureRmProviderFeature -FeatureName AllowNetworkWatcherAzureReachabilityReport -ProviderNamespace Microsoft.Network
Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Network
``` 

Confirm that you are registered for the preview by entering the following command:

```powershell
Get-AzureRmProviderFeature -FeatureName AllowNetworkWatcherAzureReachabilityReport -ProviderNamespace Microsoft.Network
```

> [!WARNING]
> Registration can take up to an hour to complete. Do not continue with the remaining steps until *Registered* appears for **RegistrationState** in the output returned from the previous command. If you continue before you're registered, remaining steps fail.
        
## Create a network watcher

If you already have a network watcher in at least one Azure [region](https://azure.microsoft.com/regions), you can skip the tasks in this section. Create a resource group for the network watcher. In this example, the resource group is created in the East US region, but you can create the resource group in any Azure region.

```powershell
New-AzureRmResourceGroup -Name NetworkWatcherRG -Location eastus
```

Create a network watcher. You must have a network watcher created in at least one Azure region. In this example, a network watcher is created in the East US Azure region.

```powershell
New-AzureRmNetworkWatcher -Name NetworkWatcher_eastus -ResourceGroupName NetworkWatcherRG -Location eastus
```

## View relative provider latencies between a location and Azure regions

Retrieve a network watcher. The network watcher can be from any region.

```powershell
$nw = Get-AzureRmNetworkWatcher -Name NetworkWatcher_eastus -ResourceGroupName NetworkWatcherRG
```

View the relative Internet service provider latencies from a specific location to an Azure region. For example, the following command returns the average relative Internet service provider latencies between the state of Washington in the United States and the West US Azure region for December 1, 2017:

```powershell
Get-AzureRmNetworkWatcherReachabilityReport -NetworkWatcher $nw -Location "West US" -Country "United States" -State "washington" -StartTime "2017-12-01" -EndTime "2017-12-02"
```

> [!NOTE]
> The region you specify in the previous command doesn't need to be the same as the region you specified when you retrieved the network watcher. The previous command simply requires that you specify an existing network watcher. The network watcher can be in any region. If you specify values for `-Country` and `-State`, they must be valid. The values are case-sensitive. For a list of valid values, run the commands in [View available countries, states, cities, and providers](#view-available). 

> [!WARNING]
> You must specify a date after November 14, 2017 for `-StartTime` and `-EndTime`. Specifying a date prior to November 14, 2017 returns no data.

The following output is returned from the previous command:

```json
AggregationLevel   : State
ProviderLocation   : {
                       "Country": "United States",
                       "State": "washington"
                     }
ReachabilityReport : [
                       {
                         "Provider": "<Provider 1>",
                         "AzureLocation": "West US",
                         "Latencies": [
                           {
                             "TimeStamp": "2017-12-01T00:00:00Z",
                             "Score": 91
                           }
                         ]
                       },
                       {
                         "Provider": "<Provider 2>",
                         "AzureLocation": "West US",
                         "Latencies": [
                           {
                             "TimeStamp": "2017-12-01T00:00:00Z",
                             "Score": 94
                           }
                         ]
                       }
                     ]
```

In the returned output, the value for **Score** is the relative latency across regions and providers. A score of 1 is the worst (highest) latency, whereas 100 is the lowest latency. The relative latencies are averaged for the day. In the previous example, while it's clear that there is a small difference between the latency of the two providers, it's also clear that the latencies for both providers are low on the 1-100 scale. 

Running the previous command using *East US*, instead of *West US* for the `-Location` parameter returns the following output:

```json
AggregationLevel   : State
ProviderLocation   : {
                       "Country": "United States",
                       "State": "washington"
                     }
ReachabilityReport : [
                       {
                         "Provider": "<Provider 1>",
                         "AzureLocation": "East US",
                         "Latencies": [
                           {
                             "TimeStamp": "2017-12-01T00:00:00Z",
                             "Score": 83
                           }
                         ]
                       },
                       {
                         "Provider": "<Provider 2>",
                         "AzureLocation": "East US",
                         "Latencies": [
                           {
                             "TimeStamp": "2017-12-01T00:00:00Z",
                             "Score": 84
                           }
                         ]
                       }
                     ]
```

Similar to the first example, there is a small difference in the latency between the two providers. Comparing the output returned in the two examples though, you can see that for the specified date range, latency for both providers is relatively higher to the *East US* Azure region than it is to the *West US* region when communication comes from the state of Washington. This result is expected, since the West US region is physically closer to the state of Washington than the East US region is. 

Though the date range specified is only for one day in the previous example, you could run the command against larger date ranges to determine average relative latencies over time. If you know where your users are coming from, this information can help you determine the optimal region to deploy your Azure services in, if minimizing latency between your users and Azure services is your goal.

## <a name="view-available"></a>View available countries, states, cities, and providers

To view a list of all available countries, states, cities, and internet service providers, enter the following command:

```powershell
Get-AzureRmNetworkWatcherReachabilityProvidersList -NetworkWatcherName NetworkWatcher_eastus -ResourceGroupName NetworkWatcherRG
```

The previous command requires you to specify an existing network watcher. The example specified the *NetworkWatcher_eastus* network watcher in a resource group named *NetworkWatcherRG*, but you can specify any existing network watcher. If you don't have an existing network watcher, create one by completing the tasks in [Create a network watcher](#create-a-network-watcher). 

You can filter the output returned by specifying valid values for **Country**, **State**, and **City**, if desired.  For example, to view the list of providers available in Seattle, Washington, in the United States, enter the following command:

```powershell
Get-AzureRmNetworkWatcherReachabilityProvidersList `
  -NetworkWatcherName NetworkWatcher_eastus `
  -ResourceGroupName NetworkWatcherRG `
  -City seattle `
  -Country "United States" `
  -State washington
```

> [!WARNING]
> The value specified for **Country** must be upper and lowercase. The values specified for **State** and **City** must be lowercase. The values must be listed in the output returned after running the command with no values for **Country**, **State**, and **City**. If you specify the incorrect case, or specify a value for **Country**, **State**, or **City** that is not in the output returned after running the command with no values for these properties, the returned output is empty.
