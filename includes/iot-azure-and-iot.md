# Azure and IoT

Welcome to Microsoft Azure and the Internet of Things (IoT). This article introduces a typical IoT solution architecture that describes the common characteristics of an IoT solution you might deploy using Azure services. A typical IoT solution requires secure, bidirectional communication between devices, possibly numbering in the millions, and a solution backend that, for example, uses automated, predictive analytics to uncover insights from your device-to-cloud event stream.

## IoT solution architecture

The following diagram shows a typical IoT solution architecture. Note that it does not include the names of any specific Azure services, but describes the key elements in a generic IoT solution architecture. The following sections provide more information about the elements in this solution.

![IoT solution architecture][img-solution-architecture]

### Device connectivity

In a typical IoT scenario, devices send telemetry, such as temperature readings, to a cloud endpoint for storage and processing. Devices can also receive and respond to cloud-to-device commands by reading messages from a cloud endpoint. For example, a device might retrieve a command that instructs it to change the frequency at which it samples data.

One of the biggest challenges facing IoT projects is how to reliably and securely connect devices to the solution backend. Typically, IoT devices have different characteristics as compared to other clients such as browsers and mobile apps. IoT devices:

- Are often embedded systems with no human operator.
- Can be located in remote locations, where physical access is very expensive.
- May only be reachable through the solution backend.
- May have limited power and processing resources.
- May have intermittent, slow, or expensive network connectivity.
- May need to use proprietary, custom, or industry specific application protocols.
- Can be created using a large set of popular hardware and software platforms.

In addition to the requirements above, any IoT solution must also deliver scale, security, and reliability. The resulting set of connectivity requirements is hard and time-consuming to implement using traditional technologies such as web containers and messaging brokers.

A device can communicate directly with a cloud gateway endpoint, or if the device cannot use any of the communications protocols that the cloud gateway supports, it can connect through an intermediate gateway that performs protocol translation.

### Data processing and analytics

In the cloud, an IoT solution backend:

- Receives telemetry at scale from your devices and determines how to process and store that data. 
- May also enable you to send commands from the cloud to specific device.
- Provides device registration capabilities that enable you to provision devices and to control which devices are permitted to connect to your infrastructure.
- Enables you to track the state of your devices and monitor their activities.

IoT solutions can include automatic feedback loops. For example, a machine learning module in the backend can identify from telemetry that the temperature of a specific device is above normal operating levels and then send a command to the device, enabling it to take corrective action.

### Presentation

Many IoT solutions enable users to view and analyze the data collected from their devices. These views can take the form of dashboards or BI reports.

[img-solution-architecture]: ./media/iot-azure-and-iot/iot-reference-architecture.png

[lnk-machinelearning]: http://azure.microsoft.com/services/machine-learning/
[Azure IoT Suite]: http://azure.microsoft.com/solutions/iot
