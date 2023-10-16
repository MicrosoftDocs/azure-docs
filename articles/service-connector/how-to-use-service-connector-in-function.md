---
title: How Service Connector helps Azure Functions connect to services
description: Learn how to use Service Connector to connect to services in Azure Functions. 
author: houk-ms
ms.service: service-connector
ms.topic: conceptual
ms.date: 09/18/2023
ms.author: honc
---
# How Service Connector helps Azure Functions connect to services

Azure Functions is one of the compute services supported by Service Connector. We recommend using bindings to connect Azure Functions with other services, although you can also use client SDKs. This article aims to help you understand:

* The relationship between Service Connector and Functions bindings.
* The process used by Service Connector to connect Functions to other Azure services using bindings or the SDK.
* The responsibilities carried by Service Connector and the users respectively in each scenario.

## Prerequisites

* This guide assumes that you already know the [basic concepts of Service Connector](concept-service-connector-internals.md).
* This guide assumes you know the concepts presented in the [Azure Functions developer guide](../azure-functions/functions-reference.md) and [how to connect a function to Azure services](../azure-functions/add-bindings-existing-function.md).

## Service Connector and Azure Functions bindings

### Bindings in Azure Functions

A binding is a concept used by Azure Functions, aiming to provide a simple way of connecting functions to services without having to work with client SDKs in function codes.

Binding can support inputs, outputs, and triggers. Bindings let you configure the connection to services so that the Functions host can handle the data access for you. For more information, see [Azure Functions triggers and bindings concepts](../azure-functions/functions-triggers-bindings.md).

Function binding supports both secret/connection string and identity based authentication types.

### Service Connector

Service Connector is an Azure service that helps developers easily connect compute services to target backing services. Azure Functions is one of the [compute services supported by Service Connector](./overview.md#what-services-are-supported-in-service-connector).

Compared to a function binding, which is more like a logically abstracted concept, Service Connector is an Azure service that you can directly operate on. It provides APIs for the whole lifecycle of a connection, like `create`, `delete`, `validate` health and `list configurations`.

Service Connector also supports both secret/connection string and identity based authentication types.

### Connection in an Azure Functions binding

In Functions bindings, `connection` is a property defined in a binding file (usually the  `function.json` file) in your function folder. It defines the app settings name or prefix that will be used by the binding runtime to authenticate to target services.

### Connection in Service Connector

A `connection` in Service Connector refers to a specific Azure resource that belongs to Service Connector.

The `connection` used by Azure Functions bindings corresponds to the `configuration name` used by Service Connector. The configuration name refers to the app setting key names that Service Connect saves into the compute services' configurations.

## Connecting Azure Functions to other cloud services using Service Connector

Service Connector reduces the amount of efforts needed to connect Azure Functions to cloud services using bindings or SDKs. It takes over cloud resource configurations like App Settings, network, identity and permission assignment, so that users can focus on function business logics. The following sections describe how Service Connector helps simplify function connections with different connection mechanisms and authentication methods.

### Binding

* Secret/connection string

| Scenario       | Works                  | Description                                                                                                                                | Without Service Connector | With Service Connector |
| -------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- | ---------------------- |
| Local Porject  | Add binding            | Add a binding in function according to target service type and binding type (in/out/trigger).                                            | User                      | User                   |
|                | Consume binding        | Set connection string for authentication in `local.settings.json`, and change function codes to consume the variable defined in binding. | User                      | User                   |
| Cloud Resource | Configure App Settings | Configure connection string as an App Setting in function resource's configurations.                                                      | User                      | Service Connector      |
|                | Configure Network      | Make sure the target service's network configuration allow access from function resource.                                                  | User                      | Service Connector      |

* Identity based authentication

| Scenario       | Works                  | Description                                                                                                                                | Without Service Connector | With Service Connector |
| -------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- | ---------------------- |
| Local Project  | Add binding            | Add a binding in function according to target service type and binding type (in/out/trigger).                                            | User                      | User                   |
|                | Consume binding        | Set connection string for authentication in `local.settings.json`, and change function codes to consume the variable defined in binding. | User                      | User                   |
| Cloud Resource | Configure App Settings | Configure identity related App Settings (like service endpoint) in function resource's configurations.                                    | User                      | Service Connector      |
|                | Configure Network      | Make sure the target service's network configuration allow access from function resource.                                                  | User                      | Service Connector      |
|                | Configure Identity     | Make sure system identity is enabled when using system identity to authenticate.                                                           | User                      | Service Connector      |
|                | Permission Assignment  | Assign the identity necessary AAD roles so that it can access the target service.                                                          | User                      | Service Connector      |

When using Service Connector with function bindings, pay special attention to the function's key name configured by Service Connector. Make sure it's the same key name as the one defined in `connection` property in the binding file. If it's different, change the name in the binding file or use Service Connector's `customize keys` feature to customize [Service Connector&#39;s default configuration names](./how-to-integrate-storage-blob.md).

### SDK

* Secret/connection string

| Scenario       | Works                  | Description                                                                                                                | Without Service Connector | With Service Connector |
| -------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ---------------------- |
| Local Project | Add dependency         | Add dependency package according to the target service and your runtime.                                                  | User                      | User                   |
|                | Initiate SDK Client    | Set connection string for authentication in `local.settings.json`. Initiate the target service SDK by connection string. | User                      | User                   |
| Cloud Resource | Configure App Settings | Configure connection string as an App Setting in function resource's configurations.                                      | User                      | Service Connector      |
|                | Configure Network      | Make sure the target service's network configuration allow access from function resource.                                  | User                      | Service Connector      |

* Identity based authentication

| Scenario        | Works                  | Description                                                                                                                | Without Service Connector | With Service Connector |
| --------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ---------------------- |
| Local Project  | Add dependency         | Add dependency package according to the target service and your runtime.                                                  | User                      | User                   |
|                 | Initiate SDK Client    | Set connection string for authentication in `local.settings.json`. Initiate the target service SDK by connection string. | User                      | User                   |
| Cloud Resource | Configure App Settings | Configure connection string as an App Setting in function resource's configurations.                                      | User                      | Service Connector      |
|                 | Configure Network      | Make sure the target service's network configuration allow access from function resource.                                  | User                      | Service Connector      |
|                 | Configure Identity     | Make sure system identity is enabled when using system identity to authenticate.                                           | User                      | Service Connector      |
|                 | Permission Assignment  | Assign the identity necessary AAD roles so that it can access the target service.                                          | User                      | Service Connector      |

## Next steps

Learn how to integrate different target services and read about the their configuration settings and authentication methods.

> [!div class="nextstepaction"]
> [Learn about how to integrate storage blob](./how-to-integrate-storage-blob.md)
