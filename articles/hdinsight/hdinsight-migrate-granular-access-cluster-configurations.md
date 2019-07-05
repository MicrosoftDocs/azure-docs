---
title: Migrate to granular role-based access for cluster configurations - Azure HDInsight
description: Learn about the changes required as part of the migration to granular role-based access for HDInsight cluster configurations.
author: tylerfox
ms.author: tyfox
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.date: 06/03/2019
---
    
# Migrate to granular role-based access for cluster configurations

We are introducing some important changes to support more fine-grained role-based access to obtain sensitive information. As part of these changes, some **action may be required** if you are using one of the [affected entities/scenarios](#am-i-affected-by-these-changes).

## What is changing?

Previously, secrets could be obtained via the HDInsight API by cluster users
possessing the Owner, Contributor, or Reader [RBAC
roles](https://docs.microsoft.com/azure/role-based-access-control/rbac-and-directory-admin-roles), as they were available to anyone with the `*/read` permission.
Going forward, accessing these secrets will require the `Microsoft.HDInsight/clusters/configurations/*` permission, meaning they can no longer be accessed by users with the
Reader role. Secrets are defined as values that could be used to obtain more elevated access than a user's role should allow. These include values such as cluster gateway HTTP credentials, storage account keys, and database credentials.

We are also introducing a new [HDInsight Cluster Operator](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#hdinsight-cluster-operator) role
that will be able to retrieve secrets without being granted the administrative
permissions of Contributor or Owner. To summarize:

| Role                                  | Previously                                                                                       | Going Forward       |
|---------------------------------------|--------------------------------------------------------------------------------------------------|-----------|
| Reader                                | - Read access, including secrets                                                                   | - Read access, **excluding** secrets |           |   |   |
| HDInsight Cluster Operator<br>(New Role) | N/A                                                                                              | - Read/write access, including secrets         |   |   |
| Contributor                           | - Read/write access, including secrets<br>- Create and manage all of types of Azure resources.     | No change |
| Owner                                 | - Read/write access including secrets<br>- Full access to all resources<br>- Delegate access to others | No change |

For information on how to add the HDInsight Cluster Operator role assignment to a user to grant them read/write access to cluster secrets, see the below section, [Add the HDInsight Cluster Operator role assignment to a user](#add-the-hdinsight-cluster-operator-role-assignment-to-a-user).

## Am I affected by these changes?

The following entities and scenarios are affected:

- [API](#api): Users using the `/configurations` or `/configurations/{configurationName}` endpoints.
- [Azure HDInsight Tools for Visual Studio Code](#azure-hdinsight-tools-for-visual-studio-code) version 1.1.1 or below.
- [Azure Toolkit for IntelliJ](#azure-toolkit-for-intellij) version 3.20.0 or below.
- [Azure Data Lake and Stream Analytics Tools for Visual Studio](#azure-data-lake-and-stream-analytics-tools-for-visual-studio) below version 2.3.9000.1.
- [Azure Toolkit for Eclipse](#azure-toolkit-for-eclipse) version 3.15.0 or below.
- [SDK for .NET](#sdk-for-net)
    - [versions 1.x or 2.x](#versions-1x-and-2x): Users using the `GetClusterConfigurations`, `GetConnectivitySettings`, `ConfigureHttpSettings`, `EnableHttp` or `DisableHttp` methods from the ConfigurationsOperationsExtensions class.
    - [versions 3.x and up](#versions-3x-and-up): Users using the `Get`, `Update`, `EnableHttp`, or `DisableHttp` methods from the `ConfigurationsOperationsExtensions` class.
- [SDK for Python](#sdk-for-python): Users using the `get` or `update` methods from the `ConfigurationsOperations` class.
- [SDK for Java](#sdk-for-java): Users using the `update` or `get` methods from the `ConfigurationsInner` class.
- [SDK for Go](#sdk-for-go): Users using the `Get` or `Update` methods from the `ConfigurationsClient` struct.
- [Az.HDInsight PowerShell](#azhdinsight-powershell) below version 2.0.0.
See the below sections (or use the above links) to see the migration steps for your scenario.

### API

The following APIs will be changed or deprecated:

- [**GET /configurations/{configurationName}**](https://docs.microsoft.com/rest/api/hdinsight/hdinsight-cluster#get-configuration) (sensitive information removed)
    - Previously used to obtain individual configuration types (including secrets).
    - This API call will now return individual configuration types with secrets omitted. To obtain all configurations, including secrets, use the new POST /configurations call. To obtain just gateway settings, use the new POST /getGatewaySettings call.
- [**GET /configurations**](https://docs.microsoft.com/rest/api/hdinsight/hdinsight-cluster#get-configuration) (deprecated)
    - Previously used to obtain all configurations (including secrets)
    - This API call will no longer be supported. To obtain all configurations going forward, use the new POST /configurations call. To obtain configurations with sensitive parameters omitted, use the GET /configurations/{configurationName} call.
- [**POST /configurations/{configurationName}**](https://docs.microsoft.com/rest/api/hdinsight/hdinsight-cluster#update-gateway-settings) (deprecated)
    - Previously used to update gateway credentials.
    - This API call will be deprecated and no longer supported. Use the new POST /updateGatewaySettings instead.

The following replacement APIs have been added:</span>

- [**POST /configurations**](https://docs.microsoft.com/rest/api/hdinsight/hdinsight-cluster#list-configurations)
    - Use this API to obtain all configurations, including secrets.
- [**POST /getGatewaySettings**](https://docs.microsoft.com/rest/api/hdinsight/hdinsight-cluster#get-gateway-settings)
    - Use this API to obtain gateway settings.
- [**POST /updateGatewaySettings**](https://docs.microsoft.com/rest/api/hdinsight/hdinsight-cluster#update-gateway-settings)
    - Use this API to update gateway settings (username and/or password).

### Azure HDInsight Tools for Visual Studio Code

If you are using version 1.1.1 or below, update to the [latest version of Azure HDInsight Tools for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=mshdinsight.azure-hdinsight&ssr=false) to avoid interruptions.

### Azure Toolkit for IntelliJ

If you are using version 3.20.0 or below, update to the [latest version of the Azure Toolkit for IntelliJ plugin](https://plugins.jetbrains.com/plugin/8053-azure-toolkit-for-intellij) to avoid interruptions.

### Azure Data Lake and Stream Analytics Tools for Visual Studio

Update to version 2.3.9000.1 or later of [Azure Data Lake and Stream Analytics Tools for Visual Studio](https://marketplace.visualstudio.com/items?itemName=ADLTools.AzureDataLakeandStreamAnalyticsTools&ssr=false#overview) to avoid interruptions.  For help with updating, see our documentation, [Update Data Lake Tools for Visual Studio](https://docs.microsoft.com/azure/hdinsight/hadoop/apache-hadoop-visual-studio-tools-get-started#update-data-lake-tools-for-visual-studio).

### Azure Toolkit for Eclipse

If you are using version 3.15.0 or below, update to the [latest version of the Azure Toolkit for Eclipse](https://marketplace.eclipse.org/content/azure-toolkit-eclipse) to avoid interruptions.

### SDK for .NET

#### Versions 1.x and 2.x

Update to [version 2.1.0](https://www.nuget.org/packages/Microsoft.Azure.Management.HDInsight/2.1.0) of the HDInsight SDK for .NET. Minimal code modifications may be required if you are using a method affected by these changes:

- `ClusterOperationsExtensions.GetClusterConfigurations` will **no longer return sensitive parameters** like storage keys (core-site) or HTTP credentials (gateway).
    - To retrieve all configurations, including sensitive parameters, use `ClusterOperationsExtensions.ListConfigurations` going forward.  Note that users with the 'Reader' role will not be able to use this method. This allows for granular control over which users can access sensitive information for a cluster.
    - To retrieve just HTTP gateway credentials, use `ClusterOperationsExtensions.GetGatewaySettings`.

- `ClusterOperationsExtensions.GetConnectivitySettings` is now deprecated and has been replaced by `ClusterOperationsExtensions.GetGatewaySettings`.

- `ClusterOperationsExtensions.ConfigureHttpSettings` is now deprecated and has been replaced by `ClusterOperationsExtensions.UpdateGatewaySettings`.

- `ConfigurationsOperationsExtensions.EnableHttp` and `DisableHttp` are now deprecated. HTTP is now always enabled, so these methods are no longer needed.

#### Versions 3.x and up

Update to [version 5.0.0](https://www.nuget.org/packages/Microsoft.Azure.Management.HDInsight/5.0.0) or later of the HDInsight SDK for .NET. Minimal code modifications may be required if you are using a method affected by these changes:

- [`ConfigurationOperationsExtensions.Get`](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.hdinsight.configurationsoperationsextensions.get?view=azure-dotnet) will **no longer return sensitive parameters** like storage keys (core-site) or HTTP credentials (gateway).
    - To retrieve all configurations, including sensitive parameters, use [`ConfigurationOperationsExtensions.List`](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.hdinsight.configurationsoperationsextensions.list?view=azure-dotnet) going forward.  Note that users with the 'Reader' role will not be able to use this method. This allows for granular control over which users can access sensitive information for a cluster. 
    - To retrieve just HTTP gateway credentials, use [`ClusterOperationsExtensions.GetGatewaySettings`](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.hdinsight.clustersoperationsextensions.getgatewaysettings?view=azure-dotnet). 
- [`ConfigurationsOperationsExtensions.Update`](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.hdinsight.configurationsoperationsextensions.update?view=azure-dotnet) is now deprecated and has been replaced by [`ClusterOperationsExtensions.UpdateGatewaySettings`](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.hdinsight.clustersoperationsextensions.updategatewaysettings?view=azure-dotnet). 
- [`ConfigurationsOperationsExtensions.EnableHttp`](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.hdinsight.configurationsoperationsextensions.enablehttp?view=azure-dotnet) and [`DisableHttp`](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.hdinsight.configurationsoperationsextensions.disablehttp?view=azure-dotnet) are now deprecated. HTTP is now always enabled, so these methods are no longer needed.

### SDK for Python

Update to [version 1.0.0](https://pypi.org/project/azure-mgmt-hdinsight/1.0.0/) or later of the HDInsight SDK for Python. Minimal code modifications may be required if you are using a method affected by these changes:

- [`ConfigurationsOperations.get`](https://docs.microsoft.com/python/api/azure-mgmt-hdinsight/azure.mgmt.hdinsight.operations.configurationsoperations#get-resource-group-name--cluster-name--configuration-name--custom-headers-none--raw-false----operation-config-) will **no longer return sensitive parameters** like storage keys (core-site) or HTTP credentials (gateway).
    - To retrieve all configurations, including sensitive parameters, use [`ConfigurationsOperations.list`](https://docs.microsoft.com/python/api/azure-mgmt-hdinsight/azure.mgmt.hdinsight.operations.configurationsoperations#list-resource-group-name--cluster-name--custom-headers-none--raw-false----operation-config-) going forward.  Note that users with the 'Reader' role will not be able to use this method. This allows for granular control over which users can access sensitive information for a cluster. 
    - To retrieve just HTTP gateway credentials, use [`ClusterOperations.get_gateway_settings`](https://docs.microsoft.com/python/api/azure-mgmt-hdinsight/azure.mgmt.hdinsight.operations.clustersoperations#get-gateway-settings-resource-group-name--cluster-name--custom-headers-none--raw-false----operation-config-).
- [`ConfigurationsOperations.update`](https://docs.microsoft.com/python/api/azure-mgmt-hdinsight/azure.mgmt.hdinsight.operations.configurationsoperations#update-resource-group-name--cluster-name--configuration-name--parameters--custom-headers-none--raw-false--polling-true----operation-config-) is now deprecated and has been replaced by [`ClusterOperations.update_gateway_settings`](https://docs.microsoft.com/python/api/azure-mgmt-hdinsight/azure.mgmt.hdinsight.operations.clustersoperations#update-gateway-settings-resource-group-name--cluster-name--parameters--custom-headers-none--raw-false--polling-true----operation-config-).

### SDK For Java

Update to [version 1.0.0](https://search.maven.org/artifact/com.microsoft.azure.hdinsight.v2018_06_01_preview/azure-mgmt-hdinsight/) or later of the HDInsight SDK for Java. Minimal code modifications may be required if you are using a method affected by these changes:

- [`ConfigurationsInner.get`](https://docs.microsoft.com/java/api/com.microsoft.azure.management.hdinsight.v2018__06__01__preview.implementation._configurations_inner.get) will **no longer return sensitive parameters** like storage keys (core-site) or HTTP credentials (gateway).
    - To retrieve all configurations, including sensitive parameters, use [`ConfigurationsInner.list`](https://docs.microsoft.com/java/api/com.microsoft.azure.management.hdinsight.v2018_06_01_preview.implementation.configurationsinner.list?view=azure-java-stable) going forward.  Note that users with the 'Reader' role will not be able to use this method. This allows for granular control over which users can access sensitive information for a cluster. 
    - To retrieve just HTTP gateway credentials, use [`ClustersInner.getGatewaySettings`](https://docs.microsoft.com/java/api/com.microsoft.azure.management.hdinsight.v2018_06_01_preview.implementation.clustersinner.getgatewaysettings?view=azure-java-stable).
- [`ConfigurationsInner.update`](https://docs.microsoft.com/java/api/com.microsoft.azure.management.hdinsight.v2018__06__01__preview.implementation._configurations_inner.update) is now deprecated and has been replaced by [`ClustersInner.updateGatewaySettings`](https://docs.microsoft.com/java/api/com.microsoft.azure.management.hdinsight.v2018_06_01_preview.implementation.clustersinner.updategatewaysettings?view=azure-java-stable).

### SDK For Go

Update to [version 27.1.0](https://github.com/Azure/azure-sdk-for-go/tree/master/services/preview/hdinsight/mgmt/2018-06-01-preview/hdinsight) or later of the HDInsight SDK for Go. Minimal code modifications may be required if you are using a method affected by these changes:

- [`ConfigurationsClient.get`](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/preview/hdinsight/mgmt/2018-06-01-preview/hdinsight#ConfigurationsClient.Get) will **no longer return sensitive parameters** like storage keys (core-site) or HTTP credentials (gateway).
    - To retrieve all configurations, including sensitive parameters, use [`ConfigurationsClient.list`](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/preview/hdinsight/mgmt/2018-06-01-preview/hdinsight#ConfigurationsClient.List) going forward.  Note that users with the 'Reader' role will not be able to use this method. This allows for granular control over which users can access sensitive information for a cluster. 
    - To retrieve just HTTP gateway credentials, use [`ClustersClient.get_gateway_settings`](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/preview/hdinsight/mgmt/2018-06-01-preview/hdinsight#ClustersClient.GetGatewaySettings).
- [`ConfigurationsClient.update`](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/preview/hdinsight/mgmt/2018-06-01-preview/hdinsight#ConfigurationsClient.Update) is now deprecated and has been replaced by [`ClustersClient.update_gateway_settings`](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/preview/hdinsight/mgmt/2018-06-01-preview/hdinsight#ClustersClient.UpdateGatewaySettings).

### Az.HDInsight PowerShell
Update to [Az PowerShell version 2.0.0](https://www.powershellgallery.com/packages/Az) or later to avoid interruptions.  Minimal code modifications may be required if you are using a method affected by these changes.
- `Grant-AzHDInsightHttpServicesAccess` is now deprecated and has been replaced by the new `Set-AzHDInsightGatewayCredential` cmdlet.
- `Get-AzHDInsightJobOutput` has been updated to support granular role-based access to the storage key.
    - Users with HDInsight Cluster Operator, Contributor, or Owner roles will not be affected.
    - Users with only the Reader role will need to specify the `DefaultStorageAccountKey` parameter explicitly.
- `Revoke-AzHDInsightHttpServicesAccess` is now deprecated. HTTP is now always enabled, so this cmdlet is no longer needed.
 See the [az.HDInsight migration guide](https://github.com/Azure/azure-powershell/blob/master/documentation/migration-guides/Az.2.0.0-migration-guide.md#azhdinsight) for more details.

## Add the HDInsight Cluster Operator role assignment to a user

A user with the [Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#contributor) or [Owner](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#owner) role can assign the [HDInsight Cluster Operator](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#hdinsight-cluster-operator) role to users that you would want to have read/write access to sensitive HDInsight cluster configuration values (such as cluster gateway credentials and storage account keys).

### Using the Azure CLI

The simplest way to add this role assignment is by using the `az role assignemnt create` command in Azure CLI.

> [!NOTE]
> This command must be run by a user with the Contributor or Owner roles, as only they can grant these permissions. The `--assignee` is the email address of the user to whom you want to assign the HDInsight Cluster Operator role.

#### Grant role at the resource (cluster) level

```azurecli-interactive
az role assignment create --role "HDInsight Cluster Operator" --assignee <user@domain.com> --scope /subscriptions/<SubscriptionId>/resourceGroups/<ResourceGroupName>/providers/Microsoft.HDInsight/clusters/<ClusterName>
```

#### Grant role at the resource group level

```azurecli-interactive
az role assignment create --role "HDInsight Cluster Operator" --assignee user@domain.com -g <ResourceGroupName>
```

#### Grant role at the subscription level

```azurecli-interactive
az role assignment create --role "HDInsight Cluster Operator" --assignee user@domain.com
```

### Using the Azure portal

You can alternatively use the Azure portal to add the HDInsight Cluster Operator role assignment to a user. See the documentation, [Manage access to Azure resources using RBAC and the Azure portal - Add a role assignment](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal#add-a-role-assignment).
