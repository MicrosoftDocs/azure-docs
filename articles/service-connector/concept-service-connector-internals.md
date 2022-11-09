---
title: Service Connector internals
description: Learn about Service Connector internals, the architecture, the connections and how data is transmitted.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.custom: event-tier1-build-2022
ms.topic: conceptual
ms.date: 05/03/2022
---

# Service Connector internals

Service Connector is an extension resource provider that provides an easy way to create and manage connections between services.
- Support major databases, storage, real-time services, state, and secret stores that are used together with your cloud native application (the list is actively expanding).
- Configure network settings, authentication, and manage connection environment variables or properties by creating a service connection with just a single command or a few steps.
- Validate connections and find corresponding suggestions to fix a service connection. 

## Service connection overview

Service connection is the key concept in the resource model of Service Connector. In Service Connector, a service connection represents an abstraction of the link between two services. The following properties are defined on service connection.

| Property | Description |
|--------|-----------|
| Connection Name | The unique name of the service connection.  |
| Source Service Type | Source services are usually Azure compute services. Service Connector functionalities can be found in supported compute services by extending these Azure compute service providers.  |
| Target Service Type | Target services are backing services or dependency services that your compute services connect to. Service Connector supports various target service types including major databases, storage, real-time services, state, and secret stores. |
| Client Type | Client type refers to your compute runtime stack, development framework, or specific client library type, which accepts the specific format of the connection environment variables or properties. |
| Authentication Type | The authentication type used of service connection. It could be pure secret/connection string, Managed Identity, or Service Principal. |

You can create multiple service connections from one source service instance if your instance needs to connect multiple target resources. And the same target resource can be connected from multiple source instances. Service Connector will manage all connections in the properties of their source instance. It means that you can create, get, update, and delete the connections in the Azure portal or using CLI commands of the source service instance. 

Connections can be made across subscriptions or tenants. Source and target services can belong to different subscriptions or tenants. When you create a new service connection, the connection resource is in the same region as your compute service instance by default.

## Create or update a service connection

Service Connector will run multiple tasks while creating or updating a connection, including:

- Configure target resource network and firewall settings, making sure source and target services can talk to each other on the network level.
- Configure connection information on source resource
- Configure authentication information on source and target if needed
- Create or update connection support rollback in case of failure.

Creating and updating a connection contains multiple steps. If a step fails, Service Connector will roll back all previous steps to keep the initial settings in the source and target instances.

## Connection configurations

Once a service connection is created, the connection configuration will be set to the source service.

In the Azure portal, navigate to **Service Connector**. You can expand each connection and view the connection configurations.

:::image type="content" source="media/tutorial-java-spring-confluent-kafka/portal-list-connection-config.png" alt-text="List portal configuration":::

In the CLI, you can use the `list-configuration` command to view the connection configuration.

```azurecli
az webapp connection list-configuration -g {webapp_rg} -n {webapp_name} --connection {service_connection_name}
```

```azurecli
az spring-cloud connection list-configuration -g {spring_cloud_rg} -n {spring_cloud_name} --connection {service_connection_name}
```

## Configuration naming convention

Service Connector sets the configuration (environment variables or Spring Boot configurations) when creating a connection. The environment variable key-value pair(s) are determined by your client type and authentication type. For example, using the Azure SDK with managed identity requires a client ID, client secret, etc. Using JDBC driver requires a database connection string. Follow this convention to name the configuration:

If you're using **Spring Boot** as the client type:

* Spring Boot library for each target service has its own naming convention. For example, MySQL connection settings would be `spring.datasource.url`, `spring.datasource.username`, `spring.datasource.password`. Kafka connection settings would be `spring.kafka.properties.bootstrap.servers`.

If you're using **other client types**, except for Spring Boot:

* When connect to a target service, the key name of the first connection configuration is in format as `{Cloud}_{Type}_{Name}`. For example, `AZURE_STORAGEBLOB_RESOURCEENDPOINT`, `CONFLUENTCLOUD_KAFKA_BOOTSTRAPSERVER`. 
* For the same type of target resource, the key name of the second connection configuration will be format as `{Cloud}_{Type}_{Connection Name}_{Name}`. For example, `AZURE_STORAGEBLOB_CONN2_RESOURCEENDPOINT`, `CONFLUENTCLOUD_KAFKA_CONN2_BOOTSTRAPSERVER`.

## Validate a service connection
The following items will be checked while validating the connection:

* Validate whether source and target resources exist
* Validate target resource network and firewall settings
* Validate connection information on source resource
* Validate authentication information on source and target if needed

## Delete connection

The connection information on source resource will be deleted when deleting connection. 
