---
title: Granular role-based access Azure HDInsight cluster configurations
description: Learn about the changes required as part of the migration to granular role-based access for HDInsight cluster configurations.
ms.service: hdinsight
ms.topic: conceptual
ms.date: 09/19/2023
---

# Migrate to granular role-based access for cluster configurations

We are introducing some important changes to support more fine-grained role-based access to obtain sensitive information. As part of these changes, some action may be required **by September 3, 2019** if you are using one of the [affected entities/scenarios](#am-i-affected-by-these-changes).

## What is changing?

Previously, secrets could be obtained via the HDInsight API by cluster users
possessing the Owner, Contributor, or Reader [Azure
roles](../role-based-access-control/rbac-and-directory-admin-roles.md), as they were available to anyone with the `*/read` permission. Secrets are defined as values that could be used to obtain more elevated access than a user's role should allow. These include values such as cluster gateway HTTP credentials, storage account keys, and database credentials.

Beginning on September 3, 2019, accessing these secrets will require the `Microsoft.HDInsight/clusters/configurations/action` permission, user cannot access it with the Reader role. The roles that have this permission are Contributor, Owner, and the new HDInsight Cluster Operator role.

We are also introducing a new [HDInsight Cluster Operator](../role-based-access-control/built-in-roles.md#hdinsight-cluster-operator) role that able to retrieve secrets without being granted the administrative permissions of Contributor or Owner. To summarize:

| Role                                  | Previously                                                                                       | Going Forward       |
|---------------------------------------|--------------------------------------------------------------------------------------------------|-----------|
| Reader                                | - Read access, including secrets.                                                                   | - Read access, **excluding** secrets | 
| HDInsight Cluster Operator<br>(New Role) | N/A                                                                                              | - Read/write access, including secrets         | 
| Contributor                           | - Read/write access, including secrets.<br>- Create and manage all of types of Azure resources.<br>- Execute script actions.     | No change |
| Owner                                 | - Read/write access including secrets.<br>- Full access to all resources<br>- Delegate access to others.<br>- Execute script actions. | No change |

For information on how to add the HDInsight Cluster Operator role assignment to a user to grant them read/write access to cluster secrets, see the below section, [Add the HDInsight Cluster Operator role assignment to a user](#add-the-hdinsight-cluster-operator-role-assignment-to-a-user).

## Am I affected by these changes?

The following entities and scenarios are affected:

- [API](#api): Users using the `/configurations` or `/configurations/{configurationName}` endpoints.
- [Azure HDInsight Tools for Visual Studio Code](#azure-hdinsight-tools-for-visual-studio-code) version 1.1.1 or below.
- [Azure Toolkit for IntelliJ](#azure-toolkit-for-intellij) version 3.20.0 or below.
- [Azure Data Lake and Stream Analytics Tools for Visual Studio](#azure-data-lake-and-stream-analytics-tools-for-visual-studio) version 2.3.9000.1.
- [Azure Toolkit for Eclipse](#azure-toolkit-for-eclipse) version 3.15.0 or below.
- [SDK for .NET](#sdk-for-net)
    - [versions 1.x or 2.x](#versions-1x-and-2x): Users using the `GetClusterConfigurations`, `GetConnectivitySettings`, `ConfigureHttpSettings`, `EnableHttp` or `DisableHttp` methods from the ConfigurationsOperationsExtensions class.
    - [versions 3.x and up](#versions-3x-and-up): Users using the `Get`, `Update`, `EnableHttp`, or `DisableHttp` methods from the `ConfigurationsOperationsExtensions` class.
- [SDK for Python](#sdk-for-python): Users using the `get` or `update` methods from the `ConfigurationsOperations` class.
- [SDK for Java](#sdk-for-java): Users using the `update` or `get` methods from the `ConfigurationsInner` class.
- [SDK for Go](#sdk-for-go): Users using the `Get` or `Update` methods from the `ConfigurationsClient` struct.
- [Az.HDInsight PowerShell](#azhdinsight-powershell) version 2.0.0.
See the below sections (or use the above links) to see the migration steps for your scenario.

### API

The following APIs are changed or deprecated:

- [**GET /configurations/{configurationName}**](/rest/api/hdinsight/hdinsight-cluster#get-configuration) (sensitive information removed)
    - Previously used to obtain individual configuration types (including secrets).
    - Beginning on September 3, 2019, this API call will now return individual configuration types with secrets omitted. To obtain all configurations, including secrets, use the new POST /configurations call. To obtain just gateway settings, use the new POST /getGatewaySettings call.
- [**GET /configurations**](/rest/api/hdinsight/hdinsight-cluster#get-configuration) (deprecated)
    - Previously used to obtain all configurations (including secrets)
    - Beginning on September 3, 2019, this API call will be deprecated and no longer be supported. To obtain all configurations going forward, use the new POST /configurations call. To obtain configurations with sensitive parameters omitted, use the GET /configurations/{configurationName} call.
- [**POST /configurations/{configurationName}**](/rest/api/hdinsight/hdinsight-cluster#update-gateway-settings) (deprecated)
    - Previously used to update gateway credentials.
    - Beginning on September 3, 2019, this API call will be deprecated and no longer supported. Use the new POST /updateGatewaySettings instead.

The following replacement APIs have been added:</span>

- [**POST /configurations**](/rest/api/hdinsight/hdinsight-cluster#list-configurations)
    - Use this API to obtain all configurations, including secrets.
- [**POST /getGatewaySettings**](/rest/api/hdinsight/hdinsight-cluster#get-gateway-settings)
    - Use this API to obtain gateway settings.
- [**POST /updateGatewaySettings**](/rest/api/hdinsight/hdinsight-cluster#update-gateway-settings)
    - Use this API to update gateway settings (username and/or password).

### Azure HDInsight Tools for Visual Studio Code

If you are using version 1.1.1 or below, update to the [latest version of Azure HDInsight Tools for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=mshdinsight.azure-hdinsight&ssr=false) to avoid interruptions.

### Azure Toolkit for IntelliJ

If you are using version 3.20.0 or below, update to the [latest version of the Azure Toolkit for IntelliJ plugin](https://plugins.jetbrains.com/plugin/8053-azure-toolkit-for-intellij) to avoid interruptions.

### Azure Data Lake and Stream Analytics Tools for Visual Studio

Update to version 2.3.9000.1 or later of [Azure Data Lake and Stream Analytics Tools for Visual Studio](https://marketplace.visualstudio.com/items?itemName=ADLTools.AzureDataLakeandStreamAnalyticsTools&ssr=false#overview) to avoid interruptions.  For help with updating, see our documentation, [Update Data Lake Tools for Visual Studio](./hadoop/apache-hadoop-visual-studio-tools-get-started.md#update-data-lake-tools-for-visual-studio).

### Azure Toolkit for Eclipse

If you are using version 3.15.0 or below, update to the [latest version of the Azure Toolkit for Eclipse](https://marketplace.eclipse.org/content/azure-toolkit-eclipse) to avoid interruptions.

### SDK for .NET

#### Versions 1.x and 2.x

Update to [version 2.1.0](https://www.nuget.org/packages/Microsoft.Azure.Management.HDInsight/2.1.0) of the HDInsight SDK for .NET. Minimal code modifications may be required if you are using a method affected by these changes:

- `ClusterOperationsExtensions.GetClusterConfigurations` will **no longer return sensitive parameters** like storage keys (core-site) or HTTP credentials (gateway).
    - To retrieve all configurations, including sensitive parameters, use `ClusterOperationsExtensions.ListConfigurations` going forward.  Users with the 'Reader' role are not able to use this method. It allows for granular control over which users can access sensitive information for a cluster.
    - To retrieve just HTTP gateway credentials, use `ClusterOperationsExtensions.GetGatewaySettings`.

- `ClusterOperationsExtensions.GetConnectivitySettings` is now deprecated and has been replaced by `ClusterOperationsExtensions.GetGatewaySettings`.

- `ClusterOperationsExtensions.ConfigureHttpSettings` is now deprecated and has been replaced by `ClusterOperationsExtensions.UpdateGatewaySettings`.

- `ConfigurationsOperationsExtensions.EnableHttp` and `DisableHttp` are now deprecated. HTTP is now always enabled, so these methods are no longer needed.

#### Versions 3.x and up

Update to [version 5.0.0](https://www.nuget.org/packages/Microsoft.Azure.Management.HDInsight/5.0.0) or later of the HDInsight SDK for .NET. Minimal code modifications may be required if you are using a method affected by these changes:

- [`ConfigurationOperationsExtensions.Get`](/dotnet/api/microsoft.azure.management.hdinsight.configurationsoperationsextensions.get) will **no longer return sensitive parameters** like storage keys (core-site) or HTTP credentials (gateway).
    - To retrieve all configurations, including sensitive parameters, use [`ConfigurationOperationsExtensions.List`](/dotnet/api/microsoft.azure.management.hdinsight.configurationsoperationsextensions.list) going forward.  Users with the 'Reader' role are not able to use this method. It allows for granular control over which users can access sensitive information for a cluster. 
    - To retrieve just HTTP gateway credentials, use [`ClusterOperationsExtensions.GetGatewaySettings`](/dotnet/api/microsoft.azure.management.hdinsight.clustersoperationsextensions.getgatewaysettings). 
- [`ConfigurationsOperationsExtensions.Update`](/dotnet/api/microsoft.azure.management.hdinsight.configurationsoperationsextensions.update) is now deprecated and has been replaced by [`ClusterOperationsExtensions.UpdateGatewaySettings`](/dotnet/api/microsoft.azure.management.hdinsight.clustersoperationsextensions.updategatewaysettings). 
- [`ConfigurationsOperationsExtensions.EnableHttp`](/dotnet/api/microsoft.azure.management.hdinsight.configurationsoperationsextensions.enablehttp) and [`DisableHttp`](/dotnet/api/microsoft.azure.management.hdinsight.configurationsoperationsextensions.disablehttp) are now deprecated. HTTP is now always enabled, so these methods are no longer needed.

### SDK for Python

Update to [version 1.0.0](https://pypi.org/project/azure-mgmt-hdinsight/1.0.0/) or later of the HDInsight SDK for Python. Minimal code modifications may be required if you are using a method affected by these changes:

- [`ConfigurationsOperations.get`](/python/api/azure-mgmt-hdinsight/azure.mgmt.hdinsight.operations.configurationsoperations#get-resource-group-name--cluster-name--configuration-name--custom-headers-none--raw-false----operation-config-) will **no longer return sensitive parameters** like storage keys (core-site) or HTTP credentials (gateway).
    - To retrieve all configurations, including sensitive parameters, use [`ConfigurationsOperations.list`](/python/api/azure-mgmt-hdinsight/azure.mgmt.hdinsight.operations.configurationsoperations#list-resource-group-name--cluster-name--custom-headers-none--raw-false----operation-config-) going forward.  Users with the 'Reader' role are not able to use this method. It allows for granular control over which users can access sensitive information for a cluster. 
    - To retrieve just HTTP gateway credentials, use [`ClusterOperations.get_gateway_settings`](/python/api/azure-mgmt-hdinsight/azure.mgmt.hdinsight.operations.clustersoperations#get-gateway-settings-resource-group-name--cluster-name--custom-headers-none--raw-false----operation-config-).
- [`ConfigurationsOperations.update`](/python/api/azure-mgmt-hdinsight/azure.mgmt.hdinsight.operations.configurationsoperations#update-resource-group-name--cluster-name--configuration-name--parameters--custom-headers-none--raw-false--polling-true----operation-config-) is now deprecated and has been replaced by [`ClusterOperations.update_gateway_settings`](/python/api/azure-mgmt-hdinsight/azure.mgmt.hdinsight.operations.clustersoperations#update-gateway-settings-resource-group-name--cluster-name--parameters--custom-headers-none--raw-false--polling-true----operation-config-).

### SDK For Java

Update to [version 1.0.0](https://search.maven.org/artifact/com.microsoft.azure.hdinsight.v2018_06_01_preview/azure-mgmt-hdinsight/1.0.0/jar) or later of the HDInsight SDK for Java. Minimal code modifications may be required if you are using a method affected by these changes:

- `ConfigurationsInner.get` will **no longer return sensitive parameters** like storage keys (core-site) or HTTP credentials (gateway).
- `ConfigurationsInner.update` is now deprecated.

### SDK For Go

Update to [version 27.1.0](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/resourcemanager/hdinsight) or later of the HDInsight SDK for Go. Minimal code modifications may be required if you are using a method affected by these changes:

- [`ConfigurationsClient.get`](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/preview/hdinsight/mgmt/2015-03-01-preview/hdinsight#ConfigurationsClient.Get) will **no longer return sensitive parameters** like storage keys (core-site) or HTTP credentials (gateway).
    - To retrieve all configurations, including sensitive parameters, use [`ConfigurationsClient.list`](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/preview/hdinsight/mgmt/2015-03-01-preview/hdinsight#ConfigurationsClient.List) going forward. Users with the 'Reader' role are not able to use this method. It allows for granular control over which users can access sensitive information for a cluster. 
    - To retrieve just HTTP gateway credentials, use [`ClustersClient.get_gateway_settings`](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/preview/hdinsight/mgmt/2015-03-01-preview/hdinsight#ClustersClient.GetGatewaySettings).
- [`ConfigurationsClient.update`](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/preview/hdinsight/mgmt/2015-03-01-preview/hdinsight#ConfigurationsClient.Update) is now deprecated and has been replaced by [`ClustersClient.update_gateway_settings`](https://godoc.org/github.com/Azure/azure-sdk-for-go/services/preview/hdinsight/mgmt/2015-03-01-preview/hdinsight#ClustersClient.UpdateGatewaySettings).

### Az.HDInsight PowerShell
Update to [Az PowerShell version 2.0.0](https://www.powershellgallery.com/packages/Az) or later to avoid interruptions.  Minimal code modifications may be required if you are using a method affected by these changes.
- `Grant-AzHDInsightHttpServicesAccess` is now deprecated and has been replaced by the new `Set-AzHDInsightGatewayCredential` cmdlet.
- `Get-AzHDInsightJobOutput` has been updated to support granular role-based access to the storage key.
    - Users with HDInsight Cluster Operator, Contributor, or Owner roles are not affected.
    - Users with only the Reader role need to specify the `DefaultStorageAccountKey` parameter explicitly.
- `Revoke-AzHDInsightHttpServicesAccess` is now deprecated. HTTP is now always enabled, so this cmdlet is no longer needed.
 See the [az.HDInsight migration guide](https://github.com/Azure/azure-powershell/blob/master/documentation/migration-guides/Az.2.0.0-migration-guide.md#azhdinsight) for more details.

## Add the HDInsight Cluster Operator role assignment to a user

A user with the [Owner](../role-based-access-control/built-in-roles.md#owner) role can assign the [HDInsight Cluster Operator](../role-based-access-control/built-in-roles.md#hdinsight-cluster-operator) role to users that you would want to have read/write access to sensitive HDInsight cluster configuration values (such as cluster gateway credentials and storage account keys).

### Using the Azure CLI

The simplest way to add this role assignment is by using the `az role assignment create` command in Azure CLI.

> [!NOTE]
> This command must be run by a user with the Owner role, as only they can grant these permissions. The `--assignee` is the name of the service principal or email address of the user to whom you want to assign the HDInsight Cluster Operator role. If you receive an insufficient permissions error, see the FAQ.

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

You can alternatively use the Azure portal to add the HDInsight Cluster Operator role assignment to a user. See the documentation, [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

## FAQ

### Why am I seeing a 403 (Forbidden) response after updating my API requests and/or tool?

Cluster configurations are now behind granular role-based access control and require the `Microsoft.HDInsight/clusters/configurations/*` permission to access them. To obtain this permission, assign the HDInsight Cluster Operator, Contributor, or Owner role to the user or service principal trying to access configurations.

### Why do I see "Insufficient privileges to complete the operation" when running the Azure CLI command to assign the HDInsight Cluster Operator role to another user or service principal?

In addition to having the Owner role, the user or service principal executing the command needs to have sufficient Azure AD permissions to look up the object IDs of the assignee. This message indicates insufficient Azure AD permissions. Try replacing the `-–assignee` argument with `–assignee-object-id` and provide the object ID of the assignee as the parameter instead of the name (or the principal ID in the case of a managed identity). See the optional parameters section of the [az role assignment create documentation](/cli/azure/role/assignment#az-role-assignment-create) for more info.

If it still does not work, contact your Azure AD admin to acquire the correct permissions.

### What will happen if I take no action?

Beginning on September 3, 2019, `GET /configurations` and `POST /configurations/gateway` calls will no longer return any information and the `GET /configurations/{configurationName}` call will no longer return sensitive parameters, such as storage account keys or the cluster password. The same is true of corresponding SDK methods and PowerShell cmdlets.

If you are using an older version of one of the tools for Visual Studio, VSCode, IntelliJ or Eclipse mentioned, it is no longer function until you update.

For more detailed information, see the corresponding section of this document for your scenario.
