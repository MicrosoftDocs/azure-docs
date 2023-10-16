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

Azure Functions is one of Service Connector supported compute services. Bindings is the recommended way by Azure Functions to talk to other services, although you can also work with client SDKs. This article aims to help you understand

* What's the relationship between Service Connector and Function Bindings?
* How Service Connector helps Functions connect to services in both Bindings and SDK scenarios?
* What are the responsibilities of Service Connector and Users respectively in these scenarios?

## Prerequisites

* This guide assumes that you already know the [basics concepts of Service Connector](concept-service-connector-internals.md).
* This guide assumes you know [Functions developer guide](../azure-functions/functions-reference.md) and [how to connect to services in Functions](../azure-functions/add-bindings-existing-function.md).

## Service Connector and Function Bindings

### Function Bindings

Bindings is an Azure Functions concept that helps to make it easier for users to connect to services without having to work with client SDKs in function codes.

Binding can support inputs, outputs, and triggers. Bindings let you configure the connection to services so that the Functions host can handle the data access for you. For more information, see [Azure Functions triggers and bindings concepts](../azure-functions/functions-triggers-bindings.md).

Function binding supports both secret/connection string and identity based authentication types.

### Service Connector

Service Connector is an Azure service that helps developers easily connect compute service to target backing services. Azure Functions is one of the [Service Connector supported compute services](./overview.md#what-services-are-supported-in-service-connector).

Compared to function binding, which is more like a logically abstracted concept, Service Connector is an Azure service that you can directly operate on. It provides APIs for the whole lifecycle of a connection, like `create`, `delete`, `validate` health and `list configurations`.

Service Connector also supports both secret/connection string and identity based authentication types.

### Connection in Binding

The `connection` concept in Function Binding is a property defined in binding file (usually the  `function.json` file) in your function folder. It defines the App Setting name or prefix that will be used by binding runtime to authenticate to target services.

### Connection in Service Connector

The `connection` concept in Service Connector refers to a specific Azure resource that belongs to Service Connector service.

In Service Connector, the corresponding concept for `connection` in binding is `configuration name`, which refers to the App Setting key names that Service Connect help save into the compute services' configurations.

## Connecting to services with Service Connector in Functions

Service Connector saves users' efforts connecting to services in Azure Functions both in bindings and SDK scenarios. It takes over cloud resource configurations like App Settings, network, identity and permission assignment, so that users can focus on function business logics. The following sections describe how Service Connector help simplify function connection with different connection mechanisms and authentication types.

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

When using Service Connector with function bindings, pay special attention to the function App Settings' key name configured by Service Connector. Make sure it's same with the name defined in `connection` property in the binding file. If it's different, change the name in the binding file or use Service Connector `customize keys` feature to customize [Service Connector&#39;s default configuration names](./how-to-integrate-storage-blob.md).

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

Read how to integrate with target service to learn the different configurations needed by different target services and authentication types.

> [!div class="nextstepaction"]
> [Learn about how to integrate storage blob](./how-to-integrate-storage-blob.md)
