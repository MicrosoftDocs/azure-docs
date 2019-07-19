---
title: View relative latencies to Azure regions from specific locations | Microsoft Docs
description: Learn how to view relative latencies across Internet providers to Azure regions from specific locations.
services: network-watcher
documentationcenter: ''
author: KumudD
manager: twooley
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-network
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 12/14/2017
ms.author: kumud
ms.custom: 

---
# View relative latency to Azure regions from specific locations

In this tutorial, learn how to use the Azure [Network Watcher](network-watcher-monitoring-overview.md) service to help you decide what Azure region to deploy your application or service in, based on your user demographic. Additionally, you can use it to help evaluate service providers’ connections to Azure.  
        

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Create a network watcher

If you already have a network watcher in at least one Azure [region](https://azure.microsoft.com/regions), you can skip the tasks in this section. Create a resource group for the network watcher. In this example, the resource group is created in the East US region, but you can create the resource group in any Azure region.

```powershell
New-AzResourceGroup -Name NetworkWatcherRG -Location eastus
```

Create a network watcher. You must have a network watcher created in at least one Azure region. In this example, a network watcher is created in the East US Azure region.

```powershell
New-AzNetworkWatcher -Name NetworkWatcher_eastus -ResourceGroupName NetworkWatcherRG -Location eastus
```

## Compare relative network latencies to a single Azure region from a specific location

Evaluate service providers, or troubleshoot a user reporting an issue such as “the site was slow,” from a specific location to the azure region where a service is deployed. For example, the following command returns the average relative Internet service provider latencies between the state of Washington in the United States and the West US 2 Azure region between December 13-15, 2017:

```powershell
Get-AzNetworkWatcherReachabilityReport `
  -NetworkWatcherName NetworkWatcher_eastus `
  -ResourceGroupName NetworkWatcherRG `
  -Location "West US 2" `
  -Country "United States" `
  -State "washington" `
  -StartTime "2017-12-13" `
  -EndTime "2017-12-15"
```

> [!NOTE]
> The region you specify in the previous command doesn't need to be the same as the region you specified when you retrieved the network watcher. The previous command simply requires that you specify an existing network watcher. The network watcher can be in any region. If you specify values for `-Country` and `-State`, they must be valid. The values are case-sensitive. Data is available for a limited number of countries/regions, states, and cities. Run the commands in [View available countries/regions, states, cities, and providers](#view-available) to view a list of available countries/regions, cities, and states to use with the previous command. 

> [!WARNING]
> You must specify a date within the past 30 days for `-StartTime` and `-EndTime`. Specifying a prior date will result in no data being returned.

The output from the previous command follows:

```powershell
AggregationLevel   : State
ProviderLocation   : {
                       "Country": "United States",
                       "State": "washington"
                     }
ReachabilityReport : [
                       {
                         "Provider": "Qwest Communications Company, LLC - ASN 209",
                         "AzureLocation": "West US 2",
                         "Latencies": [
                           {
                             "TimeStamp": "2017-12-14T00:00:00Z",
                             "Score": 92
                           },
                           {
                             "TimeStamp": "2017-12-13T00:00:00Z",
                             "Score": 92
                           }
                         ]
                       },
                       {
                         "Provider": "Comcast Cable Communications, LLC - ASN 7922",
                         "AzureLocation": "West US 2",
                         "Latencies": [
                           {
                             "TimeStamp": "2017-12-14T00:00:00Z",
                             "Score": 96
                           },
                           {
                             "TimeStamp": "2017-12-13T00:00:00Z",
                             "Score": 96
                           }
                         ]
                       }
                     ]
```

In the returned output, the value for **Score** is the relative latency across regions and providers. A score of 1 is the worst (highest) latency, whereas 100 is the lowest latency. The relative latencies are averaged for the day. In the previous example, while it's clear that the latencies were the same both days and that there is a small difference between the latency of the two providers, it's also clear that the latencies for both providers are low on the 1-100 scale. While this is expected, since the state of Washington in the United States is physically close to the West US 2 Azure region, sometimes results aren't as expected. The larger the date range you specify, the more you can average latency over time.

## Compare relative network latencies across Azure regions from a specific location

If, instead of specifying the relative latencies between a specific location and a specific Azure region using `-Location`, you wanted to determine the relative latencies to all Azure regions from a specific physical location, you can do that too. For example, the following command helps you evaluate what azure region to deploy a service in if your primary users are Comcast users located in Washington state:

```powershell
Get-AzNetworkWatcherReachabilityReport `
  -NetworkWatcherName NetworkWatcher_eastus `
  -ResourceGroupName NetworkWatcherRG `
  -Provider "Comcast Cable Communications, LLC - ASN 7922" `
  -Country "United States" `
  -State "washington" `
  -StartTime "2017-12-13" `
  -EndTime "2017-12-15"
```

> [!NOTE]
> Unlike when you specify a single location, if you don't specify a location, or specify multiple locations, such as "West US2", "West US", you must specify an Internet service provider when running the command. 

## <a name="view-available"></a>View available countries/regions, states, cities, and providers

Data is available for specific Internet service providers, countries/regions, states, and cities. To view a list of all available Internet service providers, countries/regions, states, and cities, that you can view data for, enter the following command:

```powershell
Get-AzNetworkWatcherReachabilityProvidersList -NetworkWatcherName NetworkWatcher_eastus -ResourceGroupName NetworkWatcherRG
```

Data is only available for the countries/regions, states, and cities returned by the previous command. The previous command requires you to specify an existing network watcher. The example specified the *NetworkWatcher_eastus* network watcher in a resource group named *NetworkWatcherRG*, but you can specify any existing network watcher. If you don't have an existing network watcher, create one by completing the tasks in [Create a network watcher](#create-a-network-watcher). 

After running the previous command, you can filter the output returned by specifying valid values for **Country**, **State**, and **City**, if desired.  For example, to view the list of Internet service providers available in Seattle, Washington, in the United States, enter the following command:

```powershell
Get-AzNetworkWatcherReachabilityProvidersList `
  -NetworkWatcherName NetworkWatcher_eastus `
  -ResourceGroupName NetworkWatcherRG `
  -City Seattle `
  -Country "United States" `
  -State washington
```

> [!WARNING]
> The value specified for **Country** must be upper and lowercase. The values specified for **State** and **City** must be lowercase. The values must be listed in the output returned after running the command with no values for **Country**, **State**, and **City**. If you specify the incorrect case, or specify a value for **Country**, **State**, or **City** that is not in the output returned after running the command with no values for these properties, the returned output is empty.
