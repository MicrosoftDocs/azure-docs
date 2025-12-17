---
title: What are the Azure IoT Operations SDKs?
description: Learn about Azure IoT Operations SDKs and how to use it to develop highly available edge applications.
author: dominicbetts
ms.author: dobett
ms.topic: concept-article
ms.date: 05/27/2025

#CustomerIntent: As a developer, I want to know why use Azure IoT Operations SDKs to develop highly available edge applications.
---

# What are the Azure IoT Operations SDKs?

The Azure IoT Operations SDKs are a suite of tools and libraries across multiple languages designed to aid the development of edge applications for Azure IoT Operations. The focus of the SDKs is to assist customers in developing edge applications by providing the following features:

| Feature | Description |
|---------|---------|
| **Highly available** | Provides infrastructure and guidance to build high availability into your applications. |
| **Choice of language** | The SDKs target multiple languages to support any development environment. The languages supported today are C#, Go and Rust. |
| **Secure** | Uses the latest crypto libraries and protocols. |
| **Zero data loss** | Builds on MQTT broker to remove data loss due to application failure. |
| **Low latency** | Optimized layering and tight MQTT client coupling minimized overheads. |
| **Integration with Azure IoT Operations services** | Libraries provide access to services such as state store. |
| **Simplify complex messaging** | Provide support for communication between applications via MQTT v5 using a remote procedure call (RPC) implementation. |
| **Support** | A dedicated team at Microsoft maintains and supports the SDKs. |

The SDKs are open source and available on GitHub:

- [Azure IoT Operations .NET SDK](https://github.com/Azure/iot-operations-sdks/tree/main/dotnet)
- [Azure IoT Operations Go SDK](https://github.com/Azure/iot-operations-sdks/tree/main/go)
- [Azure IoT Operations Rust SDK](https://github.com/Azure/iot-operations-sdks/tree/main/rust)

## Benefits of the SDKs

Compared to using an MQTT client directly, the SDKs provide an application framework that abstracts MQTT concepts, exposes a clean API surface, and supports the *Protocol Compiler (codegen)* to generate client and server code from [Digital Twins Definition Language (DTDL)](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/README.md) models. The SDKs can be used to build highly available applications at the edge, that interact with Azure IoT Operations to perform operations such as **asset discovery**, **protocol translation** and **data transformation**.

The key benefits of using the SDKs include:

- **Connectivity**: Maintain a secure connection to the MQTT Broker, including rotating server certificates and authentication keys.
- **Security**: Support SAT or X.509 certificate authentication with credential rotation.
- **Configuration**: Configure the MQTT Broker connection through the file system, environment, or connection string.
- **Services**: Provides client libraries to Azure IoT Operations services for simplified development.
- **Protocol Compiler (codegen)**: Provides contract guarantees between client and servers via RPC and Telemetry.
- **High availability**: Building blocks for building highly available apps via state store and lease lock.
- **Payload formats**: Supports multiple serialization formats, built in when using codegen.


## Components of the SDKs

The SDKs provide many components available for simplicity and ease of use:

* A **session client** that augments the MQTT client adding reconnection and authentication to provide a seamless connectivity experience.

* A set of protocol primitives, designed to help creating applications, built on the fundamental protocol implementations: **Commands** and **Telemetry**. 

* A set of clients providing integration with Azure IoT Operations services such as **state store**, **lease lock**, **Azure Device Registry**, and **schema registry**.

* A **Protocol Compiler (codegen)**, that allows clients and servers to communicate via a schema contract. First describe the communication (using **Telemetry** and **Commands**) with DTDL, then generate a set of client libraries and server library stubs across the supported programming languages.

Read further about the underlying terminology and different components of the SDKs:

* [Components](https://github.com/Azure/iot-operations-sdks/blob/main/doc/components.md) - An outline of each component and their function.

## Applications types

The SDKs supports the following application types:

| Application type | Description |
|-|-|
| [Edge application](https://github.com/Azure/iot-operations-sdks/blob/main/doc/edge_application/README.md) | Generic edge applications that need to interface with various Azure IoT Operations services such as the MQTT broker and state store. The SDKs provide convenient clients to simplify the development experience. </br></br>*An Edge application is a customer managed artifact, including deployment to the cluster and monitoring execution.* |
| [Akri connector](../discover-manage-assets/overview-akri.md#connectors)| Specialized edge applications deployed by the _Akri operator_ service and designed to interface with on-premises devices. An Akri connector is responsible for securing connections to southbound devices and assets using their native protocols, sending telemetry and data to upstream Azure IoT Operations components, and optionally detecting assets for onboarding into Azure Device Registry. </br></br>*An Akri connector's deployment is managed automatically by the Akri operator service.* |

## Samples and tutorials

Review the [samples](https://github.com/Azure/iot-operations-sdks/tree/main/samples) directory for samples about creating applications for Azure IoT Operation on the supported languages.

To deploy a fully functional application to a cluster and see the SDKs in action, follow the [Tutorial: Build an event-driven app](https://github.com/Azure/iot-operations-sdks/blob/main/samples/event_driven_app/README.md).

## SDKs reference documentation

For documentation related to the implementation of the SDKs, it's fundamentals primitives and protocols as well as the underlying topic and payload structure used for communication over MQTT, see [Azure IoT Operations SDKs GitHub documentation](https://github.com/Azure/iot-operations-sdks/tree/main/doc).

## Next step

Try the [Quickstart: Start developing with the Azure IoT Operations SDKs](quickstart-get-started-sdks.md)
