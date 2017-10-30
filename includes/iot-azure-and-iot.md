
# Azure and Internet of Things

Welcome to Microsoft Azure and the Internet of Things (IoT). This article introduces the common characteristics of an IoT solution that you might deploy using Azure services. IoT solutions require secure, bidirectional communication between large numbers of devices and a solution back end. The solution back end might use automated, predictive analytics to uncover insights from your device-to-cloud event stream.

[Azure IoT Hub][lnk-iot-hub] is a key building block of any IoT solution using Azure services. IoT Hub is a fully managed service that enables reliable and secure bidirectional communications between millions of IoT devices and a solution back end. 

[Azure IoT Suite][lnk-iot-suite] provides complete, end-to-end implementations of this architecture for specific IoT scenarios. For example:

* The *remote monitoring* solution enables you to monitor the status of devices such as vending machines.
* The *predictive maintenance* solution helps you to anticipate maintenance needs of devices, like pumps in remote pumping stations, and avoid unscheduled downtime.
* The *connected factory* solution helps you to connect and monitor your industrial devices.

## IoT solution architecture

The following diagram shows a typical IoT solution architecture. The diagram does not include the names of any specific Azure services, but describes the key elements in a generic IoT solution architecture. In this architecture, IoT devices collect data that they send to a cloud gateway. The cloud gateway makes the data available for processing by other back-end services. The solution back end delivers data to line-of-business applications or to human operators through a dashboard or report.

![IoT solution architecture][img-solution-architecture]

> [!NOTE]
> For an in-depth discussion of IoT architecture, see the [Microsoft Azure IoT Reference Architecture][lnk-refarch].

### Device connectivity

In this IoT solution, devices send telemetry, such as sensor readings from a pumping station, to a cloud endpoint for storage and processing. In a predictive maintenance scenario, the solution back end might use the stream of sensor data to determine when a specific pump requires maintenance. Devices can also receive and respond to cloud-to-device messages by reading messages from a cloud endpoint. For example, in the predictive maintenance scenario the solution back end might send messages to other pumps in the pumping station to begin rerouting flows just before maintenance is due to start. This procedure would make sure the maintenance engineer could start fixing the problem immediately.

One of the biggest challenges facing IoT projects is how to reliably and securely connect devices to the solution back end. IoT devices have different characteristics as compared to other clients such as browsers and mobile apps. IoT devices:

* Are often embedded systems with no human operator.
* Can be deployed in remote locations, where physical access is expensive.
* May only be reachable through the solution back end. There is no other way to interact with the device.
* May have limited power and processing resources.
* May have intermittent, slow, or expensive network connectivity.
* May need to use proprietary, custom, or industry-specific application protocols.
* Can be created using a large set of popular hardware and software platforms.

In addition to the requirements above, any IoT solution must also deliver scale, security, and reliability. The resulting set of connectivity requirements is hard and time-consuming to implement using traditional technologies such as web containers and messaging brokers. Azure IoT Hub and the Azure IoT device SDKs make it easier to implement solutions that meet these requirements.

A device can communicate directly with a cloud gateway endpoint. If the device cannot use any of the communications protocols that the cloud gateway supports, it can connect through an intermediate gateway. For example, the [Azure IoT protocol gateway][lnk-protocol-gateway] can perform protocol translation if devices cannot use any of the protocols that IoT Hub supports.

### Data processing and analytics

In the cloud, an IoT solution back end is where most of the data processing occurs. The IoT solution back end:

* Receives telemetry at scale from your devices and determines how to process and store that data. 
* May enable you to send commands from the cloud to specific devices.
* Provides device registration capabilities that enable you to provision devices and to control which devices can connect to your infrastructure.
* Enables you to track the state of your devices and monitor their activities.

In the predictive maintenance scenario, the solution back end stores historical telemetry data. The solution back end can use this data to identify patterns that indicate maintenance is due on a specific pump.

IoT solutions can include automatic feedback loops. For example, an analytics module in the solution back end can identify from telemetry that the temperature of a specific device is above normal operating levels. The solution can then send a command to the device, instructing it to take corrective action.

### Presentation and business connectivity

The presentation and business connectivity layer allows end users to interact with the IoT solution and the devices. It enables users to view and analyze the data collected from their devices. These views can take the form of dashboards or reports that can display both historical data or near real-time data. For example, an operator can check on the status of a particular pumping station and see any alerts raised by the system. This layer also allows integration of the IoT solution back end with existing line-of-business applications to tie into enterprise business processes or workflows. For example, the predictive maintenance solution can integrate with a scheduling system. When the solution identifies a pump in need of maintenance, the scheduling system books an engineer to visit the pumping station.

![IoT solution dashboard][img-dashboard]

[img-solution-architecture]: ./media/iot-azure-and-iot/iot-reference-architecture.png
[img-dashboard]: ./media/iot-azure-and-iot/iot-suite.png

[lnk-iot-hub]: ../articles/iot-hub/iot-hub-what-is-iot-hub.md
[lnk-iot-suite]: ../articles/iot-suite/iot-suite-overview.md
[lnk-machinelearning]: http://azure.microsoft.com/documentation/services/machine-learning/
[Azure IoT Suite]: http://azure.microsoft.com/solutions/iot
[lnk-protocol-gateway]:  ../articles/iot-hub/iot-hub-protocol-gateway.md
[lnk-refarch]: http://download.microsoft.com/download/A/4/D/A4DAD253-BC21-41D3-B9D9-87D2AE6F0719/Microsoft_Azure_IoT_Reference_Architecture.pdf
