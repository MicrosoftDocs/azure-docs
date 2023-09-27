---
title: Service Connector internals
description: Learn about Service Connector internals, the architecture, the connections and how data is transmitted.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.custom: event-tier1-build-2022, engagement-fy23
ms.topic: conceptual
ms.date: 01/17/2023
---

# Service Connector internals

Service Connector is an Azure extension resource provider designed to provide a simple way to create and manage connections between Azure services.

Service Connector offers the following features:

- Lets you connect Azure services together with a single Azure CLI command or in a few steps using the Azure portal.
- Supports an increasing number of databases, storage, real-time services, state, and secret stores that are used with your cloud native application.
- Configures network settings, authentication, and manages connection environment variables or properties for you.
- Validates connections and provides suggestions to fix faulty connections.

## Service connection overview

The concept of *service connection* is a key concept in the resource model of Service Connector. A service connection represents an abstraction of the link between two services.  Service connections have the following properties:

| Property            | Description                                                                                                                                                                                                                                  |
|---------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Connection Name     | The unique name of the service connection.                                                                                                                                                                                                   |
| Source Service Type | Source services are usually Azure compute services. These are the services you can connect to target services. Source services include Azure App Service, Azure Container Apps and Azure Spring Apps.                                                       |
| Target Service Type | Target services are backing services or dependency services that your compute services connect to. Service Connector supports various target service types including major databases, storage, real-time services, state, and secret stores. |
| Client Type         | Client type refers to your compute runtime stack, development framework, or specific type of client library that accepts the specific format of the connection environment variables or properties.                                           |
| Authentication Type | The authentication type used for the service connection. It could be a secret/connection string, a managed identity, or a service principal.                                                                                                 |

Source services and target services support multiple simultaneous service connections, which means that you can connect each resource to multiple resources.

Service Connector manages connections in the properties of the source instance. Creating, getting, updating, and deleting connections is done directly by opening the source service instance in the Azure portal or by using the CLI commands of the source service.

Connections can be made across subscriptions or tenants, meaning that source and target services can belong to different subscriptions or tenants. When you create a new service connection, the connection resource is created in the same region as your compute service instance by default.

## Service connection creation and update

Service Connector runs multiple tasks while creating or updating service connections, including:

- Configuring the network and firewall settings
- Configuring connection information
- Configuring authentication information
- Creating or updating connection rollback if failure occurs

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

```azurecli
az containerapp connection list-configuration --resource-group <source-service-resource-group> --name <source-service-name> --connection <connection-name>
```

## Configuration naming convention

Service Connector sets the connection configuration when creating a connection. The environment variable key-value pairs are determined by your client type and authentication type. For example, using the Azure SDK with a managed identity requires a client ID, client secret, etc. Using a JDBC driver requires a database connection string. Follow these conventions to name the configurations:

- Spring Boot client: the Spring Boot library for each target service has its own naming convention. For example, MySQL connection settings would be `spring.datasource.url`, `spring.datasource.username`, `spring.datasource.password`. Kafka connection settings would be `spring.kafka.properties.bootstrap.servers`.

- Other clients:
  - The key name of the first connection configuration uses the format `<Cloud>_<Type>_<Name>`. For example, `AZURE_STORAGEBLOB_RESOURCEENDPOINT`, `CONFLUENTCLOUD_KAFKA_BOOTSTRAPSERVER`.
  - For the same type of target resource, the key name of the second connection configuration uses the format `<Cloud>_<Type>_<Connection Name>_<Name>`. For example, `AZURE_STORAGEBLOB_CONN2_RESOURCEENDPOINT`, `CONFLUENTCLOUD_KAFKA_CONN2_BOOTSTRAPSERVER`.

## Service network solution

Service Connector offers three network solutions for users to choose from when creating a connection. These solutions are designed to facilitate secure and efficient communication between resources.

1. **Firewall**: This solution allows connection through public network and compute resource will access target resource with public IP address. When selecting this option, Service Connector verifies the target resource's firewall settings and adds a rule to allow connections from the source resource's public IP address. If the resource's firewall has an option to allow all Azure resources accessing, Service Connector enables this setting. However, if the target resource denies all public network traffic by default, Service Connector doesn't modify this setting. In this case, you should choose another option or update the network settings manually before trying again.

2. **Service Endpoint**: This solution enables compute resource to connect to target resources via a virtual network, ensuring that connection traffic doesn't pass through the public network. Its only available if certain preconditions are met:
   - The compute resource must have virtual network integration enabled. For Azure App Service, this can be configured in its networking settings; for Azure Spring Apps, users must set VNet injection during the resource creation stage.
   - The target service must support Service Endpoint. For a list of supported services, refer to [Virtual Network service endpoints](/azure/virtual-network/virtual-network-service-endpoints-overview).

	When selecting this option, Service Connector adds the private IP address of the compute resource in the virtual network to the target resource's Virtual Network rules and enables the service endpoint in the source resource's subnet configuration. If the user lacks sufficient permissions or the resource's SKU or region doesn't support service endpoints, connection creation fails.

3. **Private Endpoint**: This solution is a recommended way to connect resources via a virtual network and is only available if certain preconditions are met:
- The compute resource must have virtual network integration enabled. For Azure App Service, this can be configured in its networking settings; for Azure Spring Apps, users must set VNet injection during the resource creation stage.
- The target service must support private endpoints. For a list of supported services, refer to [Private-link resource](/azure/private-link/private-endpoint-overview#private-link-resource).

	When selecting this option, Service Connector doesn't perform any more configurations in the compute or target resources. Instead, it verifies the existence of a valid private endpoint and fails the connection if not found. For convenience, users can select the "New Private Endpoint" checkbox in the Azure Portal when creating a connection. With it, Service Connector will automatically create all related resources for the private endpoint in the proper sequence, simplifying the connection creation process.



## Service connection validation

When validating a connection, Service connector checks the following elements:

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
