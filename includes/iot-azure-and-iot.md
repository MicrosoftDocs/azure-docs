# Azure and Internet of Things

Welcome to Microsoft Azure and the Internet of Things (IoT). This article introduces an IoT solution architecture that describes the common characteristics of an IoT solution you might deploy using Azure services. IoT solutions require secure, bidirectional communication between devices, possibly numbering in the millions, and a solution back end that, for example, uses automated, predictive analytics to uncover insights from your device-to-cloud event stream.

Azure IoT Hub is a key building block when you implement this IoT solution architecture using Azure services, and IoT Suite provides complete, end-to-end, implementations of this architecture for specific IoT scenarios such as *remote monitoring* and *predictive maintenance*.

## IoT solution architecture

The following diagram shows a typical IoT solution architecture. Note that it does not include the names of any specific Azure services, but describes the key elements in a generic IoT solution architecture. In this architecture, IoT devices collect data which they send to a cloud gateway. The cloud gateway makes the data available for processing by other back-end services from where data is delivered to other line-of-business applications or to human operators through a dashboard or other presentation device.

![IoT solution architecture][img-solution-architecture]

> [AZURE.NOTE] For an in-depth discussion of IoT architecture see the [Microsoft Azure IoT services: Reference Architecture][lnk-refarch].

### Device connectivity

In this IoT solution architecture, devices send telemetry, such as temperature readings, to a cloud endpoint for storage and processing. Devices can also receive and respond to cloud-to-device commands by reading messages from a cloud endpoint. For example, a device might retrieve a command that instructs it to change the frequency at which it samples data.

One of the biggest challenges facing IoT projects is how to reliably and securely connect devices to the solution back end. IoT devices have different characteristics as compared to other clients such as browsers and mobile apps. IoT devices:

- Are often embedded systems with no human operator.
- Can be located in remote locations, where physical access is very expensive.
- May only be reachable through the solution back end. There is no other way to interact with the device.
- May have limited power and processing resources.
- May have intermittent, slow, or expensive network connectivity.
- May need to use proprietary, custom, or industry specific application protocols.
- Can be created using a large set of popular hardware and software platforms.

In addition to the requirements above, any IoT solution must also deliver scale, security, and reliability. The resulting set of connectivity requirements is hard and time-consuming to implement using traditional technologies such as web containers and messaging brokers. Azure IoT Hub and the IoT Device SDKs make it easier to implement solutions that meet these requirements.

A device can communicate directly with a cloud gateway endpoint, or if the device cannot use any of the communications protocols that the cloud gateway supports, it can connect through an intermediate gateway, such as the [IoT Hub protocol gateway][lnk-protocol-gateway], that performs protocol translation. The 

### Data processing and analytics

In the cloud, an IoT solution back end is where most of the data processing in the solution occurs, in particular filtering and aggregating telemetry and routing it to other services. The IoT solution back end:

- Receives telemetry at scale from your devices and determines how to process and store that data. 
- May enable you to send commands from the cloud to specific device.
- Provides device registration capabilities that enable you to provision devices and to control which devices are permitted to connect to your infrastructure.
- Enables you to track the state of your devices and monitor their activities.

IoT solutions can include automatic feedback loops. For example, an analytics module in the back end can identify from telemetry that the temperature of a specific device is above normal operating levels and then send a command to the device, enabling it to take corrective action.

### Presentation and business connectivity

The presentation and business connectivity layer allows end users to interact with the IoT solution and the devices. It enables users to view and analyze the data collected from their devices. These views can take the form of dashboards or BI reports. For example, an operator can check on the status of particular shipping trucks and see any alerts raised by the system. This layer also allows integration of the IoT solution back end with existing line-of-business applications to tie into enterprise business processes or workflows.

[img-solution-architecture]: ./media/iot-azure-and-iot/iot-reference-architecture.png

[lnk-machinelearning]: http://azure.microsoft.com/services/machine-learning/
[Azure IoT Suite]: http://azure.microsoft.com/solutions/iot
[lnk-protocol-gateway]:  iot-hub-protocol-gateway.md
[lnk-refarch]: http://download.microsoft.com/download/A/4/D/A4DAD253-BC21-41D3-B9D9-87D2AE6F0719/Microsoft_Azure_IoT_Reference_Architecture.pdf
