
# Azure and the Internet of Things

Welcome to Microsoft Azure and the Internet of Things (IoT). This article describes the common characteristics of an IoT solution in the cloud. IoT solutions require secure, bidirectional communication between devices, possibly numbering in the millions, and a solution back-end. For example, a solution might use automated, predictive analytics to uncover insights from your device-to-cloud event stream.

## IoT solution architecture

The following diagram shows the key elements of a typical IoT solution architecture. This diagram is agnostic of the specific implementation details, i.e, which Azure services, devices OS, etc. In this architecture, IoT devices collect data that they send to a cloud gateway. The cloud gateway makes the data available for processing by other back-end services from where data is delivered to other line-of-business applications or to human operators through a dashboard or other presentation device.

![IoT solution architecture][img-solution-architecture]

> [!NOTE]
> For an in-depth discussion of IoT architecture, see the [Microsoft Azure IoT Reference Architecture][lnk-refarch].

### Device connectivity

In an IoT solution architecture, devices usually send telemetry to the cloud for storage and processing. For example, in a predictive maintenance scenario, the solution back-end might use the stream of sensor data to determine when a specific pump requires maintenance. Devices can also receive and respond to cloud-to-device messages by reading messages from a cloud endpoint. In the same example, the solution back-end might send messages to other pumps in the pumping station to begin re-routing flows just before maintenance is due to start. This procedure would make sure the maintenance engineer could get started as soon as she arrives.

Connecting devices securely and reliably is often the biggest challenge in IoT solutions. This is mainly because IoT devices have different characteristics as compared to other clients such as browsers and mobile apps. Specifically, IoT devices:

* Are often embedded systems with no human operator (unlike a phone).
* Can be deployed in remote locations, where physical access is expensive.
* May only be reachable through the solution back-end. There is no other way to interact with the device.
* May have limited power and processing resources.
* May have intermittent, slow, or expensive network connectivity.
* May need to use proprietary, custom, or industry-specific application protocols.
* Can be created using a large set of popular hardware and software platforms.

In addition to the constrains above, any IoT solution must also deliver scale, security, and reliability. 

Finally, depending on the communication protocol and network availability, a device can communicate directly with the cloud or use an intermediate gateway. IoT architectures tend to have a mix of these communication patterns. 

### Data processing and analytics

In modern IoT solutions, data processing can occur in the cloud or in the devices. Device processing is usally referred as "Edge computing". Choosing where to process data depends on a number of factors such as:

* Network constrains, if there is not a lot of bandwith between the deevices and the cloud, there could be an incentive to do more edge processing.
* Response time, if there is a need to act on a device in near-real time, it may be better to process the response in the device itself (think of a robot arm that needs to be stopped in an emergency).
* Regulatory enviromment, where not all the data can be sent to the cloud.

In general, data processing (both in the edge and in the cloud) is generally a combination of the following:

* Receiving telemetry at scale from your devices and determine how to process and store that data. 
* Analyzing that telemetry to provide insights, whether they are in real time or after the fact. 
* Sending commands from the cloud or a gateway device to a specific device.

Additionally, an IoT cloud back-end should provide:
* Device registration capabilities that enable you to provision devices and to control which devices are permitted to connect to your infrastructure.
* Device management to control the state of your devices and monitor their activities.

For example, in a predictive maintenance scenario, the cloud back-end stores historical telemetry data, using it to identify potential anomalous behavior on specific pumps before they cause a real problem. Using data analytics, it can identify that the preventitive solution is to send a command back to the device to take a corrective action. This generates an automated feedback loop between the device and the cloud that greatly increases the solution efficiency.

### Presentation and business connectivity

The presentation and business connectivity layer allows end users to interact with the IoT solution and the devices. It enables users to view and analyze the data collected from their devices. These views can take the form of dashboards or BI reports that can display both historical data or near real-time data. For example, an operator can check on the status of particular pumping station and see any alerts raised by the system. This layer also allows integration of the IoT solution back-end with existing line-of-business applications to tie into enterprise business processes or workflows. For example, in a predictive maintenance solution can integrate with a scheduling system that books an engineer to visit a pumping station when the solution identifies a pump in need of maintenance.

<!--We should remove the predictive maintenance screenshots, If you want to use screen shots, slighly change the predictive maintenance scenarios to align with the new RM. Otherwise, we can just create some ad hoc diagrams-->

[img-solution-architecture]: ./media/iot-azure-and-iot/iot-reference-architecture.png
[img-dashboard]: ./media/iot-azure-and-iot/iot-suite.png

[lnk-machinelearning]: http://azure.microsoft.com/documentation/services/machine-learning/
[Azure IoT Suite]: http://azure.microsoft.com/solutions/iot
[lnk-protocol-gateway]:  ../articles/iot-hub/iot-hub-protocol-gateway.md
[lnk-refarch]: http://download.microsoft.com/download/A/4/D/A4DAD253-BC21-41D3-B9D9-87D2AE6F0719/Microsoft_Azure_IoT_Reference_Architecture.pdf
