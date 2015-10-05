# Microsoft Azure and the Internet of Things (IoT)

A typical IoT solution requires secure, bidirectional communication between devices, possibly numbering in the millions, and an application back end. Examples of application back end functionality might include processing device-to-cloud events to uncover insights using automated and predictive analytics.

Microsoft provides a set of libraries (that support multiple languages and hardware platforms) that you can use to develop client applications to run on an IoT device. To implement your IoT back end application, you can combine multiple Azure services or use one of the preconfigured solutions available through Microsoft IoT Suite. To better understand how Azure enables this IoT infrastructure, it's useful to consider a typical IoT solution architecture.

## IoT solution architecture

The following diagram shows a typical IoT solution architecture. Note that it does not include the names of any specific Azure services, but describes the key elements in a generic IoT solution architecture. The following sections provide more information about the elements in this solution.

![IoT solution architecture][img-solution-architecture]

### Device connectivity

In a typical IoT scenario, devices send device-to-cloud telemetry data such as temperature readings to a cloud end-point for storage and processing. Devices can also receive and respond to cloud-to-device commands by reading messages from a cloud endpoint. For example, a device might retrieve a command that instructs it to change the frequency at which it samples data.

A device or data source in an IoT solution can range from a simple network-connected sensor to a powerful, standalone, computing device. A device may have limited processing capability, memory, communication bandwidth, and communication protocol support.

A device can communicate directly with an end-point of a cloud gateway using a communication protocol such as AMQP or HTTP, or through some intermediary such as a field gateway that provides a service such as protocol translation.

### Data processing and analytics

In the cloud, a stream event processor receives device-to-cloud messages at scale from your devices and determines how to process and store those messages. A solution for connected devices enables you to send cloud-to-device data in the form of commands to specific devices. Device registration with the IoT solution enables you to provision devices and to control which devices are permitted to connect to your infrastructure. The back end enables you to track the state of your devices and monitor their activities.

IoT solutions may include automatic feedback loops. For example, a machine learning module can identify from device-to-cloud telemetry data that the temperature of a specific device is above normal operating levels and then send a command to the device enabling it to take corrective action.

### Presentation

Many IoT solutions enable users to view and analyze the data collected from their devices. These visualizations may take the form of dashboards or BI reports.

[img-solution-architecture]: media/iot-azure-and-iot/iot-reference-architecture.png

[lnk-machinelearning]: http://azure.microsoft.com/services/machine-learning/
