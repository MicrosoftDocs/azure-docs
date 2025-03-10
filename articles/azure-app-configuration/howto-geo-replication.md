---
title: Enable geo-replication
description: Learn how to use Azure App Configuration geo replication to create, delete, and manage replicas of your configuration store. 
services: azure-app-configuration
author: zhiyuanliang-ms
ms.service: azure-app-configuration
ms.devlang: csharp
# ms.devlang: csharp, java, python, javascript
ms.topic: how-to
ms.date: 01/13/2025
ms.author: zhiyuanliang
ms.custom: devx-track-azurecli

#Customer intent: I want to be able to list, create, and delete the replicas of my configuration store. 
---

# Enable geo-replication

This article covers replication of Azure App Configuration stores. You learn about how to create, use, and delete a replica in your configuration store.

To learn more about the concept of geo-replication, see [Geo-replication in Azure App Configuration](./concept-geo-replication.md).

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free)
- We assume you already have an App Configuration store. If you want to create one, [create an App Configuration store](quickstart-aspnet-core-app.md).

## Create and list a replica

To create a replica of your configuration store in the portal, follow the steps below.

> [!NOTE]
> Creating a replica for an App Configuration store with private endpoints configured with Static IP is not supported. If you prefer a private endpoint with Static IP configuration, replicas must be created before any private endpoint is added to a store.

<!-- ### [Portal](#tab/azure-portal) -->

1. In your App Configuration store, under **Settings**, select **Geo-replication**.
1. Under **Replica(s)**, select **Create**. Choose the location of your new replica in the dropdown, then assign the replica a name. This replica name must be unique.

    :::image type="content" source="./media/how-to-geo-replication-create-flow.png" alt-text="Screenshot of the Geo Replication button being highlighted as well as the create button for a replica.":::

1. Select **Create**.
1. You should now see your new replica listed under Replica(s). Check that the status of the replica is "Succeeded", which indicates that it was created successfully.

    :::image type="content" source="media/how-to-geo-replication-created-replica-successfully.png" alt-text="Screenshot of the list of replicas that have been created for the configuration store.":::

<!-- ### [Azure CLI](#tab/azure-cli)

1. In the CLI, run the following code to create a replica of your configuration store. 

    ```azurecli-interactive
    az appconfig replica create --store-name MyConfigStoreName --name MyNewReplicaName --location MyNewReplicaLocation
    ```

1. Verify that the replica was created successfully by listing all replicas of your configuration store. 

    ```azurecli-interactive
      az appconfig replica list --store-name MyConfigStoreName 
    ```
--- -->

## Delete a replica

To delete a replica in the portal, follow the steps below.

<!-- ### [Portal](#tab/azure-portal) -->

1. In your App Configuration store, under **Settings**, select **Geo-replication**.
1. Under **Replica(s)**, select the **...** to the right of the replica you want to delete. Select **Delete** from the dropdown.

    :::image type="content" source="./media/how-to-geo-replication-delete-flow.png" alt-text=" Screenshot showing the three dots on the right of the replica being selected, showing you the delete option.":::

1. Verify the name of the replica to be deleted and select **OK** to confirm.
1. Once the process is complete, check the list of replicas that the correct replica has been deleted.

<!-- ### [Azure CLI](#tab/azure-cli)

1. In the CLI, run the following code. 

    ```azurecli-interactive
    az appconfig replica delete --store-name MyConfigStoreName --name MyNewReplicaName 
    ```
1. Verify that the replica was deleted successfully by listing all replicas of your configuration store. 

    ```azurecli-interactive
    az appconfig replica list --store-name MyConfigStoreName 
    ```

--- -->

## Automatic replica discovery

The App Configuration providers can automatically discover any replicas from a given App Configuration endpoint and attempt to connect to them. This feature allows you to benefit from geo-replication without having to change your code or redeploy your application. This means you can enable geo-replication or add extra replicas even after your application has been deployed.

Automatic replica discovery is enabled by default, but you can refer to the following sample code to disable it (not recommended).

### [.NET](#tab/dotnet)

Edit the call to the `AddAzureAppConfiguration` method, which is often found in the `program.cs` file of your application.

```csharp
configurationBuilder.AddAzureAppConfiguration(options =>
{
    // Disable automatic replica discovery
    options.ReplicaDiscoveryEnabled = false;

    // Other changes to options
});
```

> [!NOTE]
> The automatic replica discovery support is available if you use version **7.1.0** or later of any of the following packages.
> - `Microsoft.Extensions.Configuration.AzureAppConfiguration`
> - `Microsoft.Azure.AppConfiguration.AspNetCore`
> - `Microsoft.Azure.AppConfiguration.Functions.Worker`

### [Java Spring](#tab/spring)

Specify the `replicaDiscoveryEnabled` property in the `bootstrap.properties` file of your application.

```properties
spring.cloud.azure.appconfiguration.stores[0].replica-discovery-enabled=false
```

> [!NOTE]
> The automatic replica discovery support is available if you use version **5.11.0** or later of any of the following packages.
> - `spring-cloud-azure-appconfiguration-config`
> - `spring-cloud-azure-appconfiguration-config-web`
> - `spring-cloud-azure-starter-appconfiguration-config`

### [Kubernetes](#tab/kubernetes)

Update the `AzureAppConfigurationProvider` resource of your Azure App Configuration Kubernetes Provider. Add a `replicaDiscoveryEnabled` property and set it to `false`.

```yaml
apiVersion: azconfig.io/v1
kind: AzureAppConfigurationProvider
metadata:
  name: appconfigurationprovider-sample
spec:
  endpoint: <your-app-configuration-store-endpoint>
  replicaDiscoveryEnabled: false
  target:
    configMapName: configmap-created-by-appconfig-provider
```

> [!NOTE]
> The automatic replica discovery and failover support is available if you use version **1.3.0** or later of [Azure App Configuration Kubernetes Provider](./quickstart-azure-kubernetes-service.md).

### [Python](#tab/python)

Specify the `replica_discovery_enabled` property when loading the configuration store and set it to `False`.


```python
config = load(endpoint=endpoint, credential=credential, replica_discovery_enabled=False)
```

> [!NOTE]
> The automatic replica discovery support is available if you use version **1.3.0** or later.

### [JavaScript](#tab/javascript)

Specify the `AzureAppConfigurationOptions.replicaDiscoveryEnabled` property when loading the configuration store and set it to `false`.


```javascript
const config = load(endpoint, credential, {
    replicaDiscoveryEnabled: false
});
```

> [!NOTE]
> The automatic replica discovery support is available if you use version **2.0.0** or later of [@azure/app-configuration-provider](https://www.npmjs.com/package/@azure/app-configuration-provider).
> The feature is not available for browser-based applications due to the restriction of browser security sandbox.

---

## Scale and failover with replicas

Each replica you create has its dedicated endpoint. If your application resides in multiple geo-locations, you can update each deployment of your application in a location to connect to the replica closer to that location, which helps minimize the network latency between your application and App Configuration. Since each replica has its separate request quota, this setup also helps the scalability of your application while it grows to a multi-region distributed service.

When geo-replication is enabled, and if one replica isn't accessible, you can let your application failover to another replica for improved resiliency. App Configuration providers have built-in failover support through user provided replicas and/or additional automatically discovered replicas. You can provide a list of your replica endpoints in the order of the most preferred to the least preferred endpoint. When the current endpoint isn't accessible, the provider will fail over to a less preferred endpoint, but it tries to connect to the more preferred endpoints from time to time. If all user provided replicas aren't accessible, the automatically discovered replicas will be randomly selected and used. When a more preferred endpoint becomes available, the provider will switch to it for future requests.

Assuming you have an application using Azure App Configuration, you can update it as the following sample code to take advantage of the failover feature. You can either provide a list of endpoints for Microsoft Entra authentication or a list of connection strings for access key-based authentication.

### [.NET](#tab/dotnet)

Edit the call to the `AddAzureAppConfiguration` method, which is often found in the `program.cs` file of your application.

**Connect with Microsoft Entra ID**

```csharp
configurationBuilder.AddAzureAppConfiguration(options =>
{
    // Provide an ordered list of replica endpoints
    var endpoints = new Uri[] {
        new Uri("<first-replica-endpoint>"),
        new Uri("<second-replica-endpoint>") };
    
    // Connect to replica endpoints using Microsoft Entra authentication
    options.Connect(endpoints, new DefaultAzureCredential());

    // Other changes to options
});
```

**Connect with Connection String**

```csharp
configurationBuilder.AddAzureAppConfiguration(options =>
{
    // Provide an ordered list of replica connection strings
    var connectionStrings = new string[] {
        Environment.GetEnvironmentVariable("FIRST_REPLICA_CONNECTION_STRING"),
        Environment.GetEnvironmentVariable("SECOND_REPLICA_CONNECTION_STRING") };
    
    // Connect to replica endpoints using connection strings
    options.Connect(connectionStrings);

    // Other changes to options
});
```

> [!NOTE]
> The failover support is available if you use version **6.0.0** or later of any of the following packages.
> - `Microsoft.Extensions.Configuration.AzureAppConfiguration`
> - `Microsoft.Azure.AppConfiguration.AspNetCore`
> - `Microsoft.Azure.AppConfiguration.Functions.Worker`

### [Java Spring](#tab/spring)

Edit the `endpoints` or `connection-strings` properties in the `bootstrap.properties` file of your application.

**Connect with Microsoft Entra ID**

```properties
spring.cloud.azure.appconfiguration.stores[0].endpoints[0]="<first-replica-endpoint>"
spring.cloud.azure.appconfiguration.stores[0].endpoints[1]="<second-replica-endpoint>"
```

**Connect with Connection String**

```properties
spring.cloud.azure.appconfiguration.stores[0].connection-strings[0]="${FIRST_REPLICA_CONNECTION_STRING}"
spring.cloud.azure.appconfiguration.stores[0].connection-strings[1]="${SECOND_REPLICA_CONNECTION_STRING}"
```

> [!NOTE]
> The failover support is available if you use version **4.7.0** or later of any of the following packages.
> - `spring-cloud-azure-appconfiguration-config`
> - `spring-cloud-azure-appconfiguration-config-web`
> - `spring-cloud-azure-starter-appconfiguration-config`

### [Kubernetes](#tab/kubernetes)

The Azure App Configuration Kubernetes Provider supports failover with automatically discovered replicas by default, as long as automatic replica discovery isn't disabled. It doesn't support or require user-provided replicas.

### [Python](#tab/python)

The Azure App Configuration Python Provider supports failover with automatically discovered replicas by default, as long as automatic replica discovery isn't disabled. It doesn't support or require user-provided replicas.

### [JavaScript](#tab/javascript)

The Azure App Configuration JavaScript Provider supports failover with automatically discovered replicas by default, as long as automatic replica discovery isn't disabled. It doesn't support or require user-provided replicas.

---

The failover may occur if the App Configuration provider observes the following conditions.
- Receives responses with service unavailable status (HTTP status code 500 or above).
- Experiences with network connectivity issues.
- Requests are throttled (HTTP status code 429).

The failover won't happen for client errors like authentication failures.

## Load balance with replicas

By default, your application always sends requests to the most preferred endpoint you provide, except in the event of a failover. However, in addition to failover, replicas can also be used to balance the load of requests. By proactively distributing requests across any available replicas over time, you can avoid exhausting the request quota of a single replica and improve the overall scalability of your application.

The App Configuration providers offer built-in support for load balancing across replicas, whether provided in code or discovered automatically. You can use the following code samples to enable this feature in your application (recommended).

### [.NET](#tab/dotnet)

Edit the call to the `AddAzureAppConfiguration` method, which is often found in the `program.cs` file of your application.

```csharp
configurationBuilder.AddAzureAppConfiguration(options =>
{
    // Enable load balancing
    options.LoadBalancingEnabled = true;

    // Other changes to options
});
```

> [!NOTE]
> Load balancing support is available if you use version **8.0.0** or later of any of the following packages.
> - `Microsoft.Extensions.Configuration.AzureAppConfiguration`
> - `Microsoft.Azure.AppConfiguration.AspNetCore`
> - `Microsoft.Azure.AppConfiguration.Functions.Worker`

### [Java Spring](#tab/spring)

This feature isn't yet supported in the Azure App Configuration Java Spring Provider.

### [Kubernetes](#tab/kubernetes)

Update the `AzureAppConfigurationProvider` resource of your Azure App Configuration Kubernetes Provider. Add a `loadBalancingEnabled` property and set it to `true`.

```yaml
apiVersion: azconfig.io/v1
kind: AzureAppConfigurationProvider
metadata:
  name: appconfigurationprovider-sample
spec:
  endpoint: <your-app-configuration-store-endpoint>
  loadBalancingEnabled: true
  target:
    configMapName: configmap-created-by-appconfig-provider
```

> [!NOTE]
> Load balancing support is available if you use version **2.1.0** or later of [Azure App Configuration Kubernetes Provider](./quickstart-azure-kubernetes-service.md).

### [Python](#tab/python)

This feature isn't yet supported in the Azure App Configuration Python Provider.

### [JavaScript](#tab/javascript)

Set `AzureAppConfigurationOptions.loadBalancingEnabled` to `true` while loading configuration from App Configuration.

```javascript
const config = load(endpoint, credential, {
    loadBalancingEnabled: true
});
```

> [!NOTE]
> Load balancing support is available if you use version **2.0.0** or later of [@azure/app-configuration-provider](https://www.npmjs.com/package/@azure/app-configuration-provider).

---

## Next steps

> [!div class="nextstepaction"]
> [Geo-replication concept](./concept-geo-replication.md)
