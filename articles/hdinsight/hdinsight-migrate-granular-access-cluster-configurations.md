---
title: Changes to cluster configuration access - Azure HDInsight
description: Learn about the changes to accessing sensitive cluster configuration fields.
author: tylerfox
ms.author: tyfox
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 04/12/2019
---
    
# Changes to cluster configuration access

The latest release of the Azure HDInsight SDK brings some important changes to support more fine-grained role-based access to obtain sensitive information. As part of these changes, some **action may be required**  if you are using one of the affected methods.

## SDK for .NET 5.0.0

- [`ConfigurationOperationsExtensions.Get`](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.hdinsight.configurationsoperationsextensions.get?view=azure-dotnet) will **no longer return sensitive parameters** like storage keys (core-site) or HTTP credentials (gateway).
    - To retrieve all configurations, including sensitive parameters, use `ConfigurationOperationsExtensions.List` going forward.  Note that users with the 'Reader' role will not be able to use this method. This allows for granular control over which users can access sensitive information for a cluster. 
    - To retrieve just HTTP gateway credentials, use `ClusterOperationsExtensions.GetGatewaySettings`. 
- [`ConfigurationsOperationsExtensions.Update`](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.hdinsight.configurationsoperationsextensions.update?view=azure-dotnet) is now deprecated and has been replaced by `ClusterOperationsExtensions.UpdateGatewaySettings`. 
- [`ConfigurationsOperationsExtensions.EnableHttp`](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.hdinsight.configurationsoperationsextensions.enablehttp?view=azure-dotnet) and [`DisableHttp`](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.hdinsight.configurationsoperationsextensions.disablehttp?view=azure-dotnet) are now deprecated. HTTP is now always enabled, so these methods are no longer needed.