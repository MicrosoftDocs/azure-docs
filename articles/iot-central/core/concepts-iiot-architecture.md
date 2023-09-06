---
title: Industrial IoT patterns with Azure IoT Central
description: This article introduces common Industrial IoT patterns that you can implement using Azure IoT Central
author: dominicbetts
ms.author: dobett
ms.date: 11/28/2022
ms.topic: conceptual
ms.service: iot-central
services: iot-central
---

# Industrial IoT (IIoT) architecture patterns with Azure IoT Central

:::image type="content" source="media/concepts-iiot-architecture/industrial-iot-architecture.svg" alt-text="Diagram of high-level industrial IoT architecture." border="false":::

IoT Central lets you evaluate your IIoT scenario by using the following built-in capabilities:

- Connect industrial assets either directly or through a gateway device
- Collect data at scale from your industrial assets
- Manage your connected industrial assets in bulk using jobs
- Model and organize the data from your industrial assets and use the built-in analytics and monitoring capabilities
- Integrate and extend your solution by connecting to first and third party applications and services

By using the Azure IoT platform, IoT Central lets you evaluate solutions that are scalable and secure.

## Connect your industrial assets

Operational technology (OT) is the hardware and software that monitors and controls the equipment and infrastructure in industrial facilities. There are four ways to connect your industrial assets to Azure IoT Central:

- Proxy through on-premises partner solutions that have built-in support to connect to Azure IoT Central.

- Use IoT Plug and Play support to simplify the connectivity and asset modeling experience in Azure IoT Central.

- Proxy through on-premises Microsoft solutions from the Azure IoT Edge marketplace that have built-in support to connect to Azure IoT Central.

- Proxy through on-premises partner solutions from the Azure IoT Edge marketplace that have built-in support to connect to Azure IoT Central.

## Manage your industrial assets

Manage industrial assets and perform software updates to OT using features such as Azure IoT Central jobs. Jobs enable you to remotely:

- Update asset configurations.
- Manage asset properties.
- Command and control your assets.
- Update Microsoft-provided, partner-provided, or custom software modules that run on Azure IoT Edge devices.

## Monitor and analyze your industrial assets

View the health of your industrial assets in real-time with customizable dashboards:

:::image type="content" source="media/concepts-iiot-architecture/iiot-dashboard.png" alt-text="Screenshot of an I I O T dashboard in I O T Central.":::

Drill in telemetry using queries in the IoT Central **Data Explorer**:

:::image type="content" source="media/concepts-iiot-architecture/iiot-analytics.png" alt-text="Screenshot of an I I O T data explorer query in I O T Central.":::

## Integrate data into applications

Extend your IIoT solution by using the following IoT Central features:

- Use IoT Central rules to deliver instant alerts and insights. Enable industrial assets operators to take actions based on the condition of your industrial assets by using IoT Central rules and alerts.

- Use the REST APIs to extend your solution in companion experiences and to automate interactions.

- Use data export to stream data from your industrial assets to other services. Data export can enrich messages, use filters, and transform the data. These capabilities can deliver business insights to industrial operators.

:::image type="content" source="media/concepts-iiot-architecture/iiot-export.png" alt-text="Diagram that shows the I O T Central data export process." border="false":::

## Secure your solution

Secure your IIoT solution by using the following IoT Central features:

- Use organizations to create boundaries around industrial assets. Organizations let you control which assets and data an operator can view.

- Create private endpoints to limit and secure industrial assets/gateway connectivity to your Azure IoT Central application with Private Link.

- Ensure safe, secure data exports with Azure Active Directory managed identities.

- Use audit logs to track activity in your IoT Central application.

## Patterns

:::image type="content" source="media/concepts-iiot-architecture/automation-pyramid.svg" alt-text="Diagram that shows the five levels of the automation pyramid." border="false":::

The automation pyramid represents the layers of automation in a typical factory:

- Production floor (level one) represents sensors and related technologies such as flow meters, valves, pumps that keep variables such as flow, heat and pressure under allowable parameters.

- Control or programmable logic controller (PLC) layer (level two) is the brains behind shop floor processes that help monitor the sensors and maintain parameters throughout the production lines.

- Supervisory control and data acquisition layer, SCADA (level three) provides human machine interfaces (HMI) as process data is monitored and controlled through human interactions and stored in databases.

You can adapt the following architecture patterns to implement your IIoT solutions:

### Azure IoT first-party connectivity solutions that run as Azure IoT Edge modules that connect to Azure IoT Central

Azure IoT first-party edge modules connect to OPC UA Servers and publish OPC UA data values in OPC UA Pub/Sub compatible format. These modules enable customers to connect to existing OPC UA servers to IoT Central. These modules publish data from these servers to IoT Central in an OPC UA pub/sub JSON format.

:::image type="content" source="media/concepts-iiot-architecture/first-party-connectivity.svg" alt-text="Diagram that shows first-party connectivity option." border="false":::

### Connectivity partner OT solutions with direct connectivity to Azure IoT Central

Connectivity partner solutions from manufacturing specific solution providers can simplify and speed up connecting manufacturing equipment to the cloud. Connectivity partner solutions may include software to support level four, level three and connectivity into level two of the automatic pyramid.

Connectivity partner solutions provide driver software to connect into level two of the automation pyramid to help connect to your manufacturing equipment and retrieve meaningful data.

Connectivity partner solutions may do protocol translation to enable data to be sent to the cloud. For example, from Ethernet IP or Modbus TCP into OPCUA or MQTT.

:::image type="content" source="media/concepts-iiot-architecture/third-party-connectivity-1.svg" alt-text="Diagram that shows the standard third-party connectivity option." border="false":::

Alternate versions include:

:::image type="content" source="media/concepts-iiot-architecture/third-party-connectivity-2.svg" alt-text="Diagram that shows the first alternate third-party connectivity option." border="false":::

:::image type="content" source="media/concepts-iiot-architecture/third-party-connectivity-3.svg" alt-text="Diagram that shows the second alternate third-party connectivity option." border="false":::

### Connectivity partner OT solutions that run as Azure IoT Edge modules that connect to Azure IoT Central

Connectivity partner third-party IoT Edge modules help connect to PLCs and publish JSON data to Azure IoT Central:

:::image type="content" source="media/concepts-iiot-architecture/third-party-connectivity-modules.svg" alt-text="Diagram that shows the third-party I O T Edge module connectivity option." border="false":::

### Connectivity partner OT solutions that connect to Azure IoT Central through an Azure IoT Edge device

Connectivity partner third-party solutions help connect to PLCs and publish JSON data through IoT Edge to Azure IoT Central:

:::image type="content" source="media/concepts-iiot-architecture/third-party-connectivity-iot-edge.svg" alt-text="Diagram that shows the third-party I O T Edge connectivity option." border="false":::

## Industrial network protocols

Industrial networks are crucial to the working of a manufacturing facility. With thousands of end nodes aggregated for control and monitoring, often operating under harsh environments, the industrial network is characterized by strict requirements for connectivity and communication. The stringent demands of industrial networks have historically driven the creation of a wide variety of proprietary and application specific protocols. Wired and wireless networks each have their own protocol sets. Examples include:

- **Wired (Fieldbus)**: Profibus, Modbus, DeviceNET, CC-Link, AS-I, InterBus, ControlNet.
- **Wired (Industrial Ethernet)**: Profinet, Ethernet/IP, Ethernet CAT, Modbus TCP.
- **Wireless**: 802.15.4, 6LoWPAN, Bluetooth/LE, Cellular, LoRA, Wi-Fi, WirelessHART, ZigBee.

## Next steps

Now that you've learned about IIoT architecture patterns with Azure IoT Central, the suggested next step is to learn about [device connectivity](overview-iot-central-developer.md) in Azure IoT Central.

