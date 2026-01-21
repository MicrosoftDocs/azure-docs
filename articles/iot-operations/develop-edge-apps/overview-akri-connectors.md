---
title: Akri connectors
description: Learn about Akri connectors and the options to create custom connectors.
author: dominicbetts
ms.author: dobett
ms.topic: concept-article
ms.date: 01/12/2026

#CustomerIntent: As a developer, I want to understand how to use Akri connectors and create custom connectors for my edge applications.

---

# Akri connectors

Akri connectors are custom software components that enable Azure IoT Operations to discover, connect to, and communicate with edge devices and assets. They act as protocol adapters that translate between device-specific communication protocols and the standardized Azure IoT Operations data model.

For more information about Akri services and how they relate to Azure IoT Operations, see [What are Akri services](../discover-manage-assets/overview-akri.md).

### Key concepts

Understanding these core concepts is essential for developing custom Akri connectors:

- **Akri connector**: A custom software component that acts as a protocol adapter, enabling Azure IoT Operations to discover, connect to, and communicate with physical devices. The connector translates between device-specific protocols and the standardized Azure IoT Operations data model.
- **Connector metadata**: A JSON file that describes the connector's configuration options, capabilities, and UI schemas. The metadata defines how the connector appears and behaves when you:
    - Create connector template instances in the Azure portal.
    - Configure devices and assets in the operations experience UI.
- **Connector template**: A reusable configuration template that defines how a connector type should be deployed and configured. The connector template serves as a blueprint that operators can use to create multiple device connections with consistent settings.
- **Connector instance**: A deployed instance of a connector template that manages connections to specific devices, running as a containerized application within the Kubernetes cluster to handle real-time device communication.
- **Discovery protocol**: The mechanism by which connectors automatically find and identify compatible devices on the network. The connector for ONVIF can discover ONVIF assets and media devices available at the endpoint. The OPC UA connector discovers assets at the endpoint and creates assets in the Azure Device Registry.
- **Devices and assets**: Logical entities that connectors interact with. Devices and device inbound endpoints define where connectors receive data from. Assets define what data to collect. Some connectors, such as the connector for OPC UA, enable a two-way flow of data, receiving messages from the endpoint and sending commands to the endpoint.
- **Datasets and data points**: Structured representations of telemetry data collected from assets, where datasets group related data points and data points define individual telemetry values and configuration parameters. The dataset defines where the received data is sent. For example, a dataset can specify an MQTT topic to publish to. The sample polling HTTP connector in the Azure IoT Operations .NET SDK shows how to use datasets.
- **Event groups and events**: Structured representations of events and status information sent by assets, where event groups group related events and events define individual values and configuration parameters. The event group defines where the received data is sent. For example, an event group can specify an MQTT topic to publish to. The sample event-driven TCP connector in the Azure IoT Operations .NET SDK shows how to use event groups.
- **Message schemas**: Definitions that describe the structure and format of data messages exchanged between connectors and other Azure IoT Operations such as the MQTT broker. A connector can [register a message schema](../connect-to-cloud/concept-schema-registry.md) for each dataset and event group, enabling any receiving component to understand the format of the messages by fetching the corresponding schema. For example, the connector for OPC UA automatically registers schemas for incoming messages.

## Connector development workflow

The development and deployment of Akri connectors follows a structured workflow involving three key roles:

### Developer role

**Objective**: Create and package custom connectors

- **Build the connector**: Use the Azure IoT Operations SDK, templates, or VS Code extension to develop connector logic that implements:
    - Connectivity to a physical device.
    - Authentication to a physical device.
    - Data exchange with the physical device.
    - Optionally, device and asset discovery.
    - Delivery of the data to a destination in the cluster.
- **Create connector metadata**: Define the `connector-metadata.json` file that specifies:
  - Configuration options for connector template instances in the Azure portal.
  - Asset configuration schemas for the operations experience portal.
  - Dataset, data point, event group, and event definitions.
  - UI rendering instructions for configuration forms.
- **Package for deployment**: Prepare the connector and metadata as Open Container Initiative (OCI) artifacts.

### Administrator role

**Objective**: Deploy and manage connector types

- **Upload to container registry**: Push the connector and `connector-metadata.json` to an Azure Container Registry or compatible registry.
- **Register connector type**: The Azure portal makes the connector type available for creating connector template instances.
- **Manage connector templates**: Create and configure connector template instances that operators can use for device connections.

### Operator role

**Objective**: Configure devices and assets by using available connectors

- **Create devices**: Use connector template instances available in the operations experience to define new devices.
- **Configure inbound endpoints**: Add inbound templates to devices, selecting from available connector template instances.
- **Define assets**: Use the configuration options from the `connector-metadata.json` to:
  - Select the inbound endpoint for the asset to use.
  - Configure dataset and data point options.
  - Configure event group definitions and event options.
- **Deploy and monitor**: The Akri services automatically download connectors from the registry and deploy instances to establish connections with physical devices.

## Deployment flow

When an asset is created using a connector:

1. **Asset configuration**: The operator defines the asset using configuration options specified in the connector metadata, including datasets, data points, event groups, and the inbound endpoint to use. The configuration determines how the connector interacts with the physical device.
1. **Connector deployment**: Akri services download the connector container image from the registry and create the necessary Kubernetes resources to run the connector instance in the cluster.
1. **Device discovery (optional)**: The connector uses its discovery protocol to locate and identify compatible physical devices on the network, automatically detecting available endpoints and their capabilities according to the connector's implementation.
1. **Connection establishment**: The connector establishes communication with the target physical device by using the appropriate protocol, authentication method, and connection parameters specified in the configuration.
1. **Data flow**: The connector receives data from the physical device and publishes it to a destination such as an MQTT topic. The connector can also handle commands or configuration changes and route them to the physical device.

## Integration with Azure IoT Operations

Akri connectors integrate seamlessly with the broader Azure IoT Operations environment:

- **Operations experience**: Provides the user interface for configuring devices and assets.
- **Azure Device Registry**: Maintains information about discovered and configured devices and assets.
- **MQTT broker**: A common destination for messages from a connector.
- **Message schemas**: Define the structure of data exchanged between connectors and the platform.

## Related content

- [What are Akri services?](../discover-manage-assets/overview-akri.md)
- [Build and deploy Akri connectors](howto-develop-akri-connectors.md)
- [Build Akri connectors with the VS Code extension](howto-build-akri-connectors-vscode.md)
