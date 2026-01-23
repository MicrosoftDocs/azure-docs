---
title: Developer guide for Azure IoT Operations
description: Learn about Azure IoT Operations SDKs and other tools that let you develop custom Azure IoT Operations solutions.
author: dominicbetts
ms.author: dobett
ms.topic: concept-article
ms.date: 12/17/2025

#CustomerIntent: As a developer, I want to know why use Azure IoT Operations SDKs to develop highly available edge applications.
---

# Developer guide for Azure IoT Operations

You can extend the capabilities of Azure IoT Operations by developing custom edge applications and connectors that interact with Azure IoT Operations services. This article provides an overview of the tools, extension points, and SDKs available to help you build these solutions.

## Common scenarios for custom development

You can develop custom solutions to address a variety of scenarios with Azure IoT Operations, including:

- Custom connectors for integrating with proprietary or specialized devices and protocols by using the Akri services. To learn more, see:
    - [What are Akri services](../discover-manage-assets/overview-akri.md)
    - [Build Akri connectors in VS Code](howto-build-akri-connectors-vscode.md)

- Edge applications that perform data processing, transformation, and analytics at the edge by using WebAssembly (WASM) modules. Data flow graphs with WASM modules let you build custom data processing pipelines. To learn more about using and building WASM modules, see:
    - [Use a data flow graph with WebAssembly modules](../connect-to-cloud/howto-dataflow-graph-wasm.md)
    - [Transform incoming data with WebAssembly modules](../discover-manage-assets/howto-use-http-connector.md#transform-incoming-data)
    - [Build WASM modules for data flows in VS Code](howto-build-wasm-modules-vscode.md)
    - [Develop WASM modules and graph definitions for data flow graphs](howto-develop-wasm-modules.md)

- Extend the capabilities of data flows by using the state store for maintaining application state. The state store is also accessible from WASM modules. To learn more, see:
    - [Enrich data by using data flows](../connect-to-cloud/concept-dataflow-enrich.md)
    - [State store support for WASM operators](howto-build-wasm-modules-vscode.md#state-store-support-for-wasm-operators)

- Build highly available applications that programmatically interact with the MQTT broker for reliable communication with Azure IoT Operations services. For example, the OPC UA connector enables you to control connected OPC UA servers by sending commands through the MQTT broker. The protocol compiler tool in the SDK lets you generate client code from DTDL models to simplify the development of such applications. To learn more, see:
    - [Protocol compiler](https://github.com/Azure/iot-operations-sdks/blob/main/codegen/README.md)
    - [OPC UA sample application](../discover-manage-assets/howto-control-opc-ua.md#sample-application)

- Programmatically manage devices and assets by using the Azure Device Registry service and the schema registry. To learn more, see the following samples in the SDK repository:
    - [Service samples (.NET)](https://github.com/Azure/iot-operations-sdks/blob/main/dotnet/samples/README.md#services)
    - [Service samples (Rust)](https://github.com/Azure/iot-operations-sdks/blob/main/rust/azure_iot_operations_services/README.md)

## Overview of Azure IoT Operations SDKs

The [Azure IoT Operations SDKs](https://github.com/Azure/iot-operations-sdks/blob/main/README.md) are a suite of tools and libraries across multiple languages designed to help you develop for Azure IoT Operations. The SDKs are open source and available on GitHub:

- [Azure IoT Operations .NET SDK](https://github.com/Azure/iot-operations-sdks/tree/main/dotnet/README.md)
- [Azure IoT Operations Rust SDK](https://github.com/Azure/iot-operations-sdks/tree/main/rust/README.md)

To learn more about the SDKs, see:

- [Components of the SDKS](https://github.com/Azure/iot-operations-sdks/blob/main/doc/components.md)
- [Tools included in the SDKs](https://github.com/Azure/iot-operations-sdks/blob/main/tools/README.md)
- [Samples and tutorials](https://github.com/Azure/iot-operations-sdks/blob/main/samples/README.md)

## VS Code extensions for Azure IoT Operations

The following VS Code extensions help you develop custom solutions for Azure IoT Operations:

- [Azure IoT Operations Akri connectors](https://marketplace.visualstudio.com/items?itemName=ms-azureiotoperations.azure-iot-operations-akri-connectors-vscode) VS Code extension: This extension provides templates and tools to help you build custom Akri connectors for Azure IoT Operations using either .NET or the Rust programming language. To learn more, see [Build Akri connectors in VS Code](howto-build-akri-connectors-vscode.md).
- [Azure IoT Operations WASM modules](https://marketplace.visualstudio.com/items?itemName=ms-azureiotoperations.azure-iot-operations-data-flow-vscode) VS Code extension: This extension provides templates and tools to help you build WebAssembly (WASM) modules for data flow graphs and connectors in Azure IoT Operations using either the Python or Rust programming language. To learn more, see [Build WASM modules for data flows in VS Code](howto-build-wasm-modules-vscode.md).

## Next step

Try the [Quickstart: Start developing with the Azure IoT Operations SDKs](quickstart-get-started-sdks.md).
