---
title: Enable geo-replication
description: Learn how to use Azure App Configuration geo replication to create, delete, and manage replicas of your configuration store. 
services: azure-app-configuration
author: mrm9084
ms.service: azure-app-configuration
ms.devlang: csharp, java
ms.topic: how-to
ms.date: 03/20/2023
ms.author: mametcal
ms.custom: devx-track-azurecli

#Customer intent: I want to be able to list, create, and delete the replicas of my configuration store. 
---

# Enable geo-replication

This article covers replication of Azure App Configuration stores. You'll learn about how to create, use and delete a replica in your configuration store.

To learn more about the concept of geo-replication, see [Geo-replication in Azure App Configuration](./concept-geo-replication.md).

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free)
- We assume you already have an App Configuration store. If you want to create one, [create an App Configuration store](quickstart-aspnet-core-app.md).

## Create and list a replica

To create a replica of your configuration store in the portal, follow the steps below.

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

## Use replicas

Each replica you create has its dedicated endpoint. If your application resides in multiple geolocations, you can update each deployment of your application in a location to connect to the replica closer to that location, which helps minimize the network latency between your application and App Configuration. Since each replica has its separate request quota, this setup also helps the scalability of your application while it grows to a multi-region distributed service.

When geo-replication is enabled, and if one replica isn't accessible, you can let your application failover to another replica for improved resiliency. App Configuration provider libraries have built-in failover support by accepting multiple replica endpoints. You can provide a list of your replica endpoints in the order of the most preferred to the least preferred endpoint. When the current endpoint isn't accessible, the provider library will fail over to a less preferred endpoint, but it will try to connect to the more preferred endpoints from time to time. When a more preferred endpoint becomes available, it will switch to it for future requests.

Assuming you have an application using Azure App Configuration, you can update it as the following sample code to take advantage of the failover feature. You can either provide a list of endpoints for Azure Active Directory (Azure AD) authentication or a list of connection strings for access key-based authentication.

### [.NET](#tab/dotnet)

Edit the call to the `AddAzureAppConfiguration` method, which is often found in the `program.cs` file of your application.

**Connect with Azure AD**

```csharp
configurationBuilder.AddAzureAppConfiguration(options =>
{
    // Provide an ordered list of replica endpoints
    var endpoints = new Uri[] {
        new Uri("<first-replica-endpoint>"),
        new Uri("<second-replica-endpoint>") };
    
    // Connect to replica endpoints using Azure AD authentication
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

**Connect with Azure AD**

```properties
spring.cloud.azure.appconfiguration.stores[0].endpoints[0]="<first-replica-endpoint>"
spring.cloud.azure.appconfiguration.stores[0].endpoints[1]="<second-replica-endpoint>"
```


> [!NOTE]
> The failover support is available if you use version of **4.0.0-beta.1** or later of any of the following packages.
> - `spring-cloud-azure-appconfiguration-config`
> - `spring-cloud-azure-appconfiguration-config-web`
> - `spring-cloud-azure-starter-appconfiguration-config`

---

The failover may occur if the App Configuration provider observes the following conditions.
- Receives responses with service unavailable status (HTTP status code 500 or above).
- Experiences with network connectivity issues.
- Requests are throttled (HTTP status code 429).

The failover won't happen for client errors like authentication failures.

## Next steps

> [!div class="nextstepaction"]
> [Geo-replication concept](./concept-geo-replication.md)
