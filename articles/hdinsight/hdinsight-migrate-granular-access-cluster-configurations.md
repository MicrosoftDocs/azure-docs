---
title: Migrate to granular role-based access for cluster configurations - Azure HDInsight
description: Learn about the changes needed to migrate to granular role-based access for cluster configurations.
author: tylerfox
ms.author: tyfox
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 04/16/2019
---
    
# Migrate to granular role-based access for cluster configurations

We are introducing some important changes to support more fine-grained role-based access to obtain sensitive information. As part of these changes, some **action may be required** if you are using one of the [affected entities/scenarios](#am-i-affected-by-these-changes).

## What is changing?

Previously, secrets could be obtained via the HDInsight API by cluster users
possessing the Owner, Contributor, or Reader [RBAC
roles](https://docs.microsoft.com/azure/role-based-access-control/rbac-and-directory-admin-roles).
Going forward, these secrets will no longer be accessible to users with the
Reader role. We are also be introducing a new ‘HDInisght Cluster Operator’ Role
that is be able to retrieve secrets without being granted the administrative
permissions of Contributor or Owner. To summarize:

| Role                                  | Previously                                                                                       | Now       |
|---------------------------------------|--------------------------------------------------------------------------------------------------|-----------|
| Reader                                | - Read access, including secrets                                                                   | - Read access, **excluding** secrets |           |   |   |
| HDInsight Cluster Operator<br>(New Role) | N/A                                                                                              | - Read/write access, including secrets         |   |   |
| Contributor                           | - Read/write access, including secrets<br>- Create and manage all of types of Azure resources.     | No change |
| Owner                                 | - Read/write access including secrets<br>- Full access to all resources<br>- Delegate access to others | No change |

## Am I affected by these changes?

The following entities and scenarios are affected:

- [API](#api): Users using the `/configurations` or `/configurations/{configurationName}` endpoints.
- [Azure HDInsight Tools for Visual Studio Code](#azure-hdinsight-tools-for-visual-studio-code) version ___ and below.
- [Azure Toolkit for IntelliJ](#azure-toolkit-for-intellij) version __ and below.
- [Azure Toolkit for Eclipse](#azure-toolkit-for-eclipse) version __ and below.
- [SDK for .NET](#sdk-for-net)
    - [versions 1.x or 2.x](#versions-1x-and-2x): Users using the `GetClusterConfigurations`, `GetConnectivitySettings`, `ConfigureHttpSettings`, `EnableHttp` or `DisableHttp` methods from the ConfigurationsOperationsExtensions class.
    - [versions 3.x and up](#versions-3x-and-up): Users using the `EnableHttp`, `DisableHttp`, `Update`, or `Get` methods from the `ConfigurationsOperationsExtensions` class.
- [SDK for Python](#sdk-for-python): Users using the `get` or `update` methods from the ConfigurationsOperations class.
- [SDK for Java](#sdk-for-java): Users using the `update` or `get` methods from the ConfigurationsInner class.
- [SDK for Go](#sdk-for-go): Users using the `Get` or `Update` methods from the ConfigurationsClient struct.

See the below sections (or use the above links) to see the migration steps for your scenario.

## API

The following APIs will be changed or deprecated:

- [**GET /configurations/{configurationName}**](https://docs.microsoft.com/rest/api/hdinsight/hdinsight-cluster#get-configuration) (sensitive information removed)
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.HDInsight/clusters/{clusterName}/configurations/{configurationName}?api-version={api-version}
    - Previously used to obtain individual configuration types (including secrets).
    - This API call will now return individual configuration types with secrets omitted. To obtain all configurations, including secrets, use the new [POST /configurations]() call. To obtain just gateway settings, use the new [POST /getGatewaySettings]() call.
- [**GET /configurations**](https://docs.microsoft.com/rest/api/hdinsight/hdinsight-cluster#get-configurations) (deprecated)
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.HDInsight/clusters/{clusterName}/configurations?api-version={api-version}
    - Previously used to obtain all configurations (including secrets)
    - This API call will no longer be supported. To obtain all configurations going forward, use the new [POST /configurations]() call. To obtain configurations with sensitive parameters omitted, use the [GET /configurations/{configurationName}]() call.
- [**POST /configurations/{configurationName}**](https://docs.microsoft.com/rest/api/hdinsight/hdinsight-cluster#change-connectivity-settings) (deprecated)
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.HDInsight/clusters/{clusterName}/configurations/{configurationName}?api-version={api-version}
    - Previously used to update gateway credentials.
    - This API call will be deprecated and no longer supported. Use the new [POST /updateGatewaySettings]() instead.

The following replacement APIs have been added:</span>

- **POST /configurations**
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.HDInsight/clusters/{clusterName}/configurations?api-version={api-version}
    - Use this API to obtain all configurations, including secrets.
- **POST /getGatewaySettings**
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.HDInsight/clusters/{clusterName}/getGatewaySettings?api-version={api-version}
    - Use this API to obtain gateway settings.
- **POST /updateGatewaySettings**
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.HDInsight/clusters/{clusterName}/updateGatewaySettings?api-version={api-version}
    - Use this API to update gateway settings (username and/or password).

## Azure HDInsight Tools for Visual Studio Code

If you are using version _ or older of Azure HDInsight Tools for Visual Studio Code, please update to version _ to avoid interruptions.

## Azure Toolkit for IntelliJ

If you are using version _ or older of the Azure Toolkit for IntelliJ, please update to version _ to avoid interruptions.

## Azure Toolkit for Eclipse

If you are using version _ or older of the Azure Toolkit for Eclipse, please update to version _ to avoid interruptions.

## SDK for .NET

### Versions 1.x and 2.x

Please update to [version 2.1.0](https://www.nuget.org/packages/Microsoft.Azure.Management.HDInsight/2.1.0) of the HDInsight SDK for .NET. Minimal code modifications may be required if you are using a method affected by these changes:

- `ClusterOperationsExtensions.GetClusterConfigurations` will **no longer return sensitive parameters** like storage keys (core-site) or HTTP credentials (gateway).
    - To retrieve all configurations, including sensitive parameters, use `ClusterOperationsExtensions.ListConfigurations` going forward.  Note that users with the 'Reader' role will not be able to use this method. This allows for granular control over which users can access sensitive information for a cluster.
    - To retrieve just HTTP gateway credentials, use `ClusterOperationsExtensions.GetGatewaySettings`.

- `ClusterOperationsExtensions.GetConnectivitySettings` is now deprecated and has been replaced by `ClusterOperationsExtensions.GetGatewaySettings`.

- `ClusterOperationsExtensions.ConfigureHttpSettings` is now deprecated and has been replaced by `ClusterOperationsExtensions.UpdateGatewaySettings`.

- `ConfigurationsOperationsExtensions.EnableHttp` and `DisableHttp` are now deprecated. HTTP is now always enabled, so these methods are no longer needed.

### Versions 3.x and up

Please update to [version 5.0.0](https://www.nuget.org/packages/Microsoft.Azure.Management.HDInsight/5.0.0) of the HDInsight SDK for .NET. Minimal code modifications may be required if you are using a method affected by these changes:

- [`ConfigurationOperationsExtensions.Get`](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.hdinsight.configurationsoperationsextensions.get?view=azure-dotnet) will **no longer return sensitive parameters** like storage keys (core-site) or HTTP credentials (gateway).
    - To retrieve all configurations, including sensitive parameters, use `ConfigurationOperationsExtensions.List` going forward.  Note that users with the 'Reader' role will not be able to use this method. This allows for granular control over which users can access sensitive information for a cluster. 
    - To retrieve just HTTP gateway credentials, use `ClusterOperationsExtensions.GetGatewaySettings`. 
- [`ConfigurationsOperationsExtensions.Update`](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.hdinsight.configurationsoperationsextensions.update?view=azure-dotnet) is now deprecated and has been replaced by `ClusterOperationsExtensions.UpdateGatewaySettings`. 
- [`ConfigurationsOperationsExtensions.EnableHttp`](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.hdinsight.configurationsoperationsextensions.enablehttp?view=azure-dotnet) and [`DisableHttp`](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.hdinsight.configurationsoperationsextensions.disablehttp?view=azure-dotnet) are now deprecated. HTTP is now always enabled, so these methods are no longer needed.

## SDK for Python

Please update to [version 1.0.0](https://pypi.org/project/azure-mgmt-hdinsight/1.0.0/) of the HDInsight SDK for Python. Minimal code modifications may be required if you are using a method affected by these changes:

- [`ConfigurationsOperations.get`](https://docs.microsoft.com/python/api/azure-mgmt-hdinsight/azure.mgmt.hdinsight.operations.configurations_operations.configurationsoperations?view=azure-python#get-resource-group-name--cluster-name--configuration-name--custom-headers-none--raw-false----operation-config-) will **no longer return sensitive parameters** like storage keys (core-site) or HTTP credentials (gateway).
    - To retrieve all configurations, including sensitive parameters, use [`ConfigurationsOperations.list`](https://docs.microsoft.com/python/api/azure-mgmt-hdinsight/azure.mgmt.hdinsight.operations.configurations_operations.configurationsoperations?view=azure-python#list-resource-group-name--cluster-name--custom-headers-none--raw-false----operation-config-) going forward.  Note that users with the 'Reader' role will not be able to use this method. This allows for granular control over which users can access sensitive information for a cluster. 
    - To retrieve just HTTP gateway credentials, use [`ConfigurationsOperations.get_gateway_settings`](https://docs.microsoft.com/python/api/azure-mgmt-hdinsight/azure.mgmt.hdinsight.operations.clusters_operations.clustersoperations?view=azure-python#get-gateway-settings-resource-group-name--cluster-name--custom-headers-none--raw-false----operation-config-).
- [`ConfigurationsOperations.update`](https://docs.microsoft.com/python/api/azure-mgmt-hdinsight/azure.mgmt.hdinsight.operations.clusters_operations.clustersoperations?view=azure-python#update-resource-group-name--cluster-name--tags-none--custom-headers-none--raw-false----operation-config-) is now deprecated and has been replaced by [`ClusterOperationsExtensions.update_gateway_settings`](https://docs.microsoft.com/python/api/azure-mgmt-hdinsight/azure.mgmt.hdinsight.operations.clusters_operations.clustersoperations?view=azure-python#update-gateway-settings-resource-group-name--cluster-name--parameters--custom-headers-none--raw-false--polling-true----operation-config-).

## SDK For Java

Please update to [version 1.0.0](https://search.maven.org/artifact/com.microsoft.azure.hdinsight.v2018_06_01_preview/azure-mgmt-hdinsight/) of the HDInsight SDK for Java. Minimal code modifications may be required if you are using a method affected by these changes:

- [`ConfigurationsInner.get`](https://docs.microsoft.com/java/api/com.microsoft.azure.management.hdinsight.v2018__06__01__preview.implementation._configurations_inner.get) will **no longer return sensitive parameters** like storage keys (core-site) or HTTP credentials (gateway).
    - To retrieve all configurations, including sensitive parameters, use `ConfigurationsInner.list` going forward.  Note that users with the 'Reader' role will not be able to use this method. This allows for granular control over which users can access sensitive information for a cluster. 
    - To retrieve just HTTP gateway credentials, use `ConfigurationsOperations.get_gateway_settings`.
- [`ConfigurationsInner.update`](https://docs.microsoft.com/java/api/com.microsoft.azure.management.hdinsight.v2018__06__01__preview.implementation._configurations_inner.update) is now deprecated and has been replaced by `ClusterOperationsExtensions.update_gateway_settings`.

## SDK For Go

Please update to [version 27.1.0](https://github.com/Azure/azure-sdk-for-go/tree/master/services/preview/hdinsight/mgmt/2018-06-01-preview/hdinsight) of the HDInsight SDK for Go. Minimal code modifications may be required if you are using a method affected by these changes:

- [`ConfigurationsClient.get`](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/preview/hdinsight/mgmt/2018-06-01-preview/hdinsight#ConfigurationsClient.Get) will **no longer return sensitive parameters** like storage keys (core-site) or HTTP credentials (gateway).
    - To retrieve all configurations, including sensitive parameters, use [`ConfigurationsClient.list`](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/preview/hdinsight/mgmt/2018-06-01-preview/hdinsight#ConfigurationsClient.List) going forward.  Note that users with the 'Reader' role will not be able to use this method. This allows for granular control over which users can access sensitive information for a cluster. 
    - To retrieve just HTTP gateway credentials, use [`ClustersClient.get_gateway_settings`](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/preview/hdinsight/mgmt/2018-06-01-preview/hdinsight#ClustersClient.GetGatewaySettings).
- [`ConfigurationsClient.update`](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/preview/hdinsight/mgmt/2018-06-01-preview/hdinsight#ConfigurationsClient.Update) is now deprecated and has been replaced by [`ClustersClient.update_gateway_settings`](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/preview/hdinsight/mgmt/2018-06-01-preview/hdinsight#ClustersClient.UpdateGatewaySettings).