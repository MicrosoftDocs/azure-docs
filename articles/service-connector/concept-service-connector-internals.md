---
title: Service Connector internals
description: Learn about Service Connector internals, including the architecture, service connections, network solutions, and authentication.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: concept-article
ms.date: 07/13/2026
---
# Service Connector internals

Service Connector is an Azure extension resource provider designed to provide a simple way to create and manage connections between Azure services.

Service Connector offers the following features:

- Lets you connect Azure services together with a single Azure CLI command or in a few steps using the Azure portal.
- Supports an increasing number of databases, storage, real-time services, state, and secret stores that are used with your cloud native application.
- Configures network settings, authentication, and manages connection environment variables or properties for you.
- Validates connections and provides suggestions to fix faulty connections.

## Service connection overview

The concept of *service connection* is a key concept in the resource model of Service Connector. A service connection represents an abstraction of the link between two services. Service connections have the following properties:

| Property            | Description                                                                                                                                                                                                                                  |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Connection name     | The unique name of the service connection.                                                                                                                                                                                                   |
| Source service type | Source services are services you can connect to target services. They're usually Azure compute services, and they include Azure App Service, Azure Functions, Azure Kubernetes Service (AKS), and Azure Spring Apps.                                     |
| Target service type | Target services are backing services or dependency services that your compute services connect to. Service Connector supports various target service types including major databases, storage, real-time services, state, and secret stores. |
| Client type         | Client type refers to your compute runtime stack, development framework, or specific type of client library that accepts the specific format of the connection environment variables or properties.                                          |
| Authentication type | The authentication type used for the service connection. It can be a secret or connection string, a managed identity, or a service principal.                                                                                                 |

Source services and target services support multiple simultaneous service connections, which means that you can connect each resource to multiple resources.

Service Connector manages connections in the properties of the source instance. Creating, getting, updating and deleting connections is done directly by opening the source service instance in the Azure portal, or by using the CLI commands of the source service.

Connections can be made across subscriptions or tenants, meaning that source and target services can belong to different subscriptions or tenants. When you create a new service connection, the connection resource is created in the same region as your compute service instance by default.

## Service connection creation and update

Service Connector runs multiple tasks while creating or updating service connections, including:

- Configuring the network and firewall settings.
   [Learn more](#service-network-solution) about network solutions.
- Configuring connection information.
   [Learn more](#connection-configurations) about connection configurations.
- Configuring authentication information.
   Service Connector supports all available authentication types between source services and target services.
   - **System-assigned managed identity**. Service Connector enables the system-assigned managed identity on source services if it isn't already enabled, then grants RBAC roles of target services to the managed identity. You can specify the roles to grant.
   - **User-assigned managed identity**. Service Connector enables the user-assigned managed identity on source services if it isn't already enabled, then grants RBAC roles of target services to the managed identity. You can specify the roles to grant.
   - **Connection string**. Service Connector retrieves connection strings directly from target services, such as Azure Storage, or constructs them from your input for services such as Azure SQL Database.
   - **Service principal**. Service Connector grants RBAC roles of target services to the managed identity. You can specify the roles to grant.
   
   Service Connector saves corresponding authentication configurations to source services, for example, saving AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_STORAGEACCOUNT_ENDPOINT for Azure Storage with authentication type user-assigned managed identity.
- Rolling back the connection if a failure occurs during creation or update

If a step fails during this process, Service Connector rolls back all previous steps to keep the initial settings in the source and target instances.

## Resource provider

[!INCLUDE [Service Connector MicrosoftServiceLinker](../../includes/service-connector-service-linker.md)]

## Connection configurations

Connection configurations are set in the source service.

In the Azure portal, open a source service and navigate to **Service Connector**. Expand each connection and view the connection configurations.

:::image type="content" source="media/internals/connection-details.png" alt-text="Screenshot of the Azure portal showing service connection details.":::

In the CLI, use the `list-configuration` command to get the connection configurations.

```azurecli
az webapp connection list-configuration --resource-group <source-service-resource-group> --name <source-service-name> --connection <connection-name>
```

```azurecli
az spring connection list-configuration --resource-group <source-service-resource-group> --name <source-service-name> --connection <connection-name>
```


## Configuration naming convention

Service Connector sets the connection configuration when creating a connection. The environment variable key-value pairs are determined based on your client type and authentication type. For example, using the Azure SDK with a managed identity requires a client ID, client secret, etc. Using a JDBC driver requires a database connection string. Follow these conventions to name the configurations:

- Spring Boot client: the Spring Boot library for each target service has its own naming convention. For example, MySQL connection settings would be `spring.datasource.url`, `spring.datasource.username`, `spring.datasource.password`. Kafka connection settings would be `spring.kafka.properties.bootstrap.servers`.
- Other clients:

  - The key name of the first connection configuration uses the format `<Cloud>_<Type>_<Name>`. For example, `AZURE_STORAGEBLOB_RESOURCEENDPOINT`, `CONFLUENTCLOUD_KAFKA_BOOTSTRAPSERVER`.
  - For the same type of target resource, the key name of the second connection configuration uses the format `<Cloud>_<Type>_<Connection Name>_<Name>`. For example, `AZURE_STORAGEBLOB_CONN2_RESOURCEENDPOINT`, `CONFLUENTCLOUD_KAFKA_CONN2_BOOTSTRAPSERVER`.

## Service network solution

Service Connector offers three network solutions to choose from when creating a connection: [Firewall](#firewall), [service endpoint](#service-endpoint), and [private endpoint](#private-endpoint). These solutions facilitate secure and efficient communication between resources.

### Firewall

This solution allows connection through the public network, with the compute resource accessing the target resource using a public IP address. When you select this option, Service Connector verifies the target resource's firewall settings and adds a rule to allow connections from the source resource's public IP address. If the target resource's firewall supports allowing all Azure resources to access it, Service Connector enables this setting. However, if the target resource denies all public network traffic by default, Service Connector doesn't modify this setting. In this case, choose another option or update the network settings manually before trying again.

### Service endpoint

This solution enables the compute resource to connect to target resources through a virtual network, ensuring that connection traffic doesn't pass through the public network. It's only available if certain preconditions are met:

- The compute resource must have virtual network integration enabled. For Azure App Service, you can configure this setting in its networking settings. For Azure Spring Apps, set virtual network injection during the resource creation stage.
- The target service must support service endpoints. For a list of supported services, see [Virtual Network service endpoints](/azure/virtual-network/virtual-network-service-endpoints-overview).

When you select this option, Service Connector adds the private IP address of the compute resource in the virtual network to the target resource's virtual network rules, and enables the service endpoint in the source resource's subnet configuration. If you lack sufficient permissions or the resource's SKU or region doesn't support service endpoints, connection creation fails.

### Private endpoint

This solution is the recommended way to connect resources through a virtual network. It's only available if certain preconditions are met:

- The compute resource must have virtual network integration enabled. For Azure App Service, you can configure this setting in its networking settings. For Azure Spring Apps, set virtual network injection during the resource creation stage.
- The target service must support private endpoints. For a list of supported services, see [Private-link resource](/azure/private-link/private-endpoint-overview#private-link-resource).

When you select this option, Service Connector doesn't perform any more configurations in the compute or target resources. Instead, it verifies the existence of a valid private endpoint and fails the connection if none is found. For convenience, you can select the **New Private Endpoint** checkbox in the Azure portal when creating a connection. By using it, Service Connector automatically creates all related resources for the private endpoint in the proper sequence, simplifying the connection creation process.



## Service connection validation

When validating a connection, Service Connector checks the following elements:

- The source and target resources exist.
- Source: correct connection information is registered.
- Target: correct network and firewall settings are registered.
- Source and target resources: correct authentication information is registered.

## Connection deletion

When a service connection is deleted, the connection information is also deleted.

## Next steps

See the following concept article to learn more about Service Connector.

> [!div class="nextstepaction"]
> [High availability](./concept-availability.md)
