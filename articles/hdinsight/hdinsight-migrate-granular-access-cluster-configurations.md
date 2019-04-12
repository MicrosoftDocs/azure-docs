---
title: Changes coming to cluster configuration access 
description: Learn about the changes to accessing sensitive cluster configuration fields.
author: tylerfox
ms.author: tyfox
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 04/12/2019
---
    
# Changes coming to cluster configuration access

The latest release of the Azure HDInsight SDK brings some important changes to allow for more fine-grained role-based access to obtain sensitive credentials. As part of these changes, some **action may be required**  if you are using one of the affected methods.

## SDK for .NET 5.0.0

1. [`ConfigurationOperationsExtensions.Get`](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.hdinsight.configurationsoperationsextensions.get?view=azure-dotnet) will **no longer return sensitive parameters** like storage keys (core-site) or HTTP credentials (gateway).
    - To retrieve all configurations, including sensitive parameters, use `ConfigurationOperationsExtensions.List` going forward.  Note that users with the 'Reader' role will not be able to use this method. This allows for granular control over which users can access cluster secrets. 
    - To retrieve just HTTP gateway credentials, use `ClusterOperationsExtensions.GetGatewaySettings`. 
2. [`ConfigurationsOperationsExtensions.Update`](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.hdinsight.configurationsoperationsextensions.update?view=azure-dotnet) is now deprecated and has been replaced by `ClusterOperationsExtensions.UpdateGatewaySettings`. 
3. [`ConfigurationsOperationsExtensions.EnableHttp`](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.hdinsight.configurationsoperationsextensions.enablehttp?view=azure-dotnet) and [`DisableHttp`](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.hdinsight.configurationsoperationsextensions.disablehttp?view=azure-dotnet) are now deprecated. HTTP is now always enabled, so these methods are no longer needed.

## SDK for .NET 2.1.0

1. `ClusterOperationsExtensions.GetClusterConfigurations` will **no longer return sensitive parameters** like storage keys (core-site) or HTTP credentials (gateway).
    - To retrieve all configurations, including sensitive parameters, use `ClusterOperationsExtensions.ListConfigurations` going forward.  Note that users with the 'Reader' role will not be able to use this method. This allows for granular control over which users can access cluster secrets.
    - To retrieve just HTTP gateway credentials, use `ClusterOperationsExtensions.GetGatewaySettings`.

2. ClusterOperationsExtensions.GetConnectivitySettings is now deprecated and has been replaced by `ClusterOperationsExtensions.GetGatewaySettings`.

3. ClusterOperationsExtensions.ConfigureHttpSettings is now deprecated and has been replaced by `ClusterOperationsExtensions.UpdateGatewaySettings`.

4. `ConfigurationsOperationsExtensions.EnableHttp` and `DisableHttp` are now deprecated. HTTP is now always enabled, so these methods are no longer needed.


## More Information Coming Soon

Check this page for updates.