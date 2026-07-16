---
title: How Service Connector Helps Azure Functions Connect to Services
description: Learn about the relationship between Service Connector and Azure Functions bindings, and how to connect functions to other Azure services.
author: houk-ms
ms.service: service-connector
ms.topic: concept-article
ms.date: 09/18/2025
ms.author: honc
#customer intent: As a developer who uses Azure Functions, I want to connect to other Azure services by using Service Connector to simplify configuration.
---
# How Service Connector helps Azure Functions connect to services

Azure Functions is one of the compute services supported by Service Connector. We recommend using bindings to connect Azure Functions with other services. You can also use client SDKs. This article aims to help you understand:

- The relationship between Service Connector and Azure Functions bindings.
- The process used by Service Connector to connect Functions to other Azure services using bindings or the SDK.
- The responsibilities carried by Service Connector and the users respectively in each scenario.

## Prerequisites

- This guide assumes that you know the [basic concepts of Service Connector](concept-service-connector-internals.md).
- This guide assumes you know the concepts presented in the [Azure Functions developer guide](../azure-functions/functions-reference.md) and [how to connect a function to Azure services](../azure-functions/add-bindings-existing-function.md).

## Service Connector and Azure Functions bindings

### Bindings in Azure Functions

A *binding* is a concept used by Azure Functions. It aims to provide a simple way of connecting functions to services without having to work with client SDKs in function codes.

Binding can support inputs, outputs, and triggers. Bindings let you configure the connection to services so that the Functions host can handle the data access for you. For more information, see [Azure Functions triggers and bindings concepts](../azure-functions/functions-triggers-bindings.md).

Azure Functions bindings support both secret (connection string) and identity-based authentication.

### Service Connector

Service Connector is an Azure service that helps developers easily connect compute services to target backing services. Azure Functions is one of the [compute services supported by Service Connector](./overview.md#what-services-are-supported-by-service-connector).

Compared to a function binding, which is more like a logically abstracted concept, Service Connector is an Azure service that you can directly operate on. It provides APIs for the whole lifecycle of a connection, like `create`, `delete`, `validate health`, and `list configurations`.

Service Connector also supports both secret/connection string and identity based authentication types.

### Connection in an Azure Functions binding

In Azure Functions bindings, the `connection` property is defined in a binding file in your function folder. This file is usually the `function.json` file. It defines the app settings name or prefix that the binding runtime uses to authenticate to target services.

### Connection in Service Connector

A `connection` in Service Connector refers to a specific Azure resource that belongs to Service Connector.

The `connection` used by Azure Functions bindings corresponds to the `configuration name` used by Service Connector. The configuration name refers to the app setting key names that Service Connect saves into the compute services' configurations.

## Connecting Azure Functions to other cloud services using Service Connector

Service Connector reduces the amount of effort needed to connect Azure Functions to cloud services using bindings or SDKs. It takes over cloud resource configurations like App Settings, network, identity, and permission assignment. Users can focus on function business logics. The following sections describe how Service Connector helps simplify function connections with different connection mechanisms and authentication methods.

### Binding

- Secret/connection string

| Scenario       | Operation              | Description                                                                                                                                         | Without Service Connector | With Service Connector |
| -------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ---------------------- |
| Local project  | Add binding            | Add a binding in a function according to the target service type and binding type (in/out/trigger).                                               | User                      | User                   |
|                | Consume binding        | Set a connection string for authentication in `local.settings.json`, and change the function code to consume the variable defined in the binding. | User                      | User                   |
| Cloud resource | Configure app settings | Configure connection string as an app setting in function resource's configurations.                                                               | User                      | Service Connector      |
|                | Configure network      | Make sure the target service's network configuration allow access from function resource.                                                           | User                      | Service Connector      |

- Identity based authentication

| Scenario       | Operation              | Description                                                                                                                                           | Without Service Connector | With Service Connector |
| -------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ---------------------- |
| Local project  | Add binding            | Add a binding in a function according to the target service type and binding type (in/out/trigger).                                                | User                      | User                   |
|                | Consume binding        | Set a connection string for authentication in `local.settings.json`, and change the function code to consume the variable defined in the binding. | User                      | User                   |
| Cloud resource | Configure app settings | Configure the Azure Function's identity settings, such as service endpoints.                                                                      | User                      | Service Connector      |
|                | Configure network      | Make sure the target service's network configuration allows access from the function resource.                                                        | User                      | Service Connector      |
|                | Configure identity     | Make sure system identity is enabled when using system identity to authenticate.                                                                      | User                      | Service Connector      |
|                | Permission assignment  | Assign the identity necessary roles so that it can access the target service.                                                                     | User                      | Service Connector      |

When you use Service Connector with function bindings, pay special attention to the function's key name configured by Service Connector. Make sure it's the same key name as the one defined in `connection` property in the binding file. If it's different, change the name in the binding file or use Service Connector's `customize keys` feature to customize [Service Connector&#39;s default configuration names](./how-to-integrate-storage-blob.md).

### SDK

- Secret/connection string

| Scenario       | Operation              | Description                                                                                                                     | Without Service Connector | With Service Connector |
| -------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ---------------------- |
| Local project  | Add dependency         | Add dependency package according to the target service and your runtime.                                                       | User                      | User                   |
|                | Initiate SDK client    | Set connection string for authentication in `local.settings.json`. Initiate the target service SDK using a connection string. | User                      | User                   |
| Cloud resource | Configure app settings | Configure a connection string as an app setting in the function's configuration.                                                | User                      | Service Connector      |
|                | Configure network      | Make sure the target service's network configuration allow access from function resource.                                       | User                      | Service Connector      |

- Identity based authentication

| Scenario       | Operation              | Description                                                                                                                     | Without Service Connector | With Service Connector |
| -------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ---------------------- |
| Local project  | Add dependency         | Add dependency package according to the target service and your runtime.                                                       | User                      | User                   |
|                | Initiate SDK client    | Set connection string for authentication in `local.settings.json`. Initiate the target service SDK using a connection string. | User                      | User                   |
| Cloud resource | Configure app settings | Configure a connection string as an app setting in the function's configuration.                                                | User                      | Service Connector      |
|                | Configure network      | Make sure the target service's network configuration allows access from the function resource.                                  | User                      | Service Connector      |
|                | Configure identity     | Make sure system identity is enabled when using system identity to authenticate.                                                | User                      | Service Connector      |
|                | Permission assignment  | Assign the identity necessary roles so that it can access the target service.                                               | User                      | Service Connector      |

## Next step

Learn how to integrate different target services and read about their configuration settings and authentication methods.

> [!div class="nextstepaction"]
> [Learn about how to integrate storage blob](./how-to-integrate-storage-blob.md)
