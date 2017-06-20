# Overview
## [Azure and IoT](iot-hub-what-is-azure-iot.md)
## [What is Azure IoT Hub?](iot-hub-what-is-iot-hub.md)
## [Overview of device management](iot-hub-device-management-overview.md)

# [Get Started](iot-hub-get-started.md)

## Setup your device
### Use a simulated device
#### [.NET](iot-hub-csharp-csharp-getstarted.md)
#### [Java](iot-hub-java-java-getstarted.md)
#### [Node.js](iot-hub-node-node-getstarted.md)
#### [Python](iot-hub-python-getstarted.md)

### Use a simulated gateway 
#### [Simulation on Linux](iot-hub-linux-gateway-sdk-get-started.md)
#### [Simulation on Windows](iot-hub-windows-gateway-sdk-get-started.md)

### Use a physical device
#### [Raspberry Pi with Node.js](iot-hub-raspberry-pi-kit-node-get-started.md)
#### [Raspberry Pi with C](iot-hub-raspberry-pi-kit-c-get-started.md)

#### [Intel Edison with Node.js](iot-hub-intel-edison-kit-node-get-started.md)
#### [Intel Edison with C](iot-hub-intel-edison-kit-c-get-started.md)

#### [Adafruit Feather HUZZAH ESP8266 with Arduino IDE](iot-hub-arduino-huzzah-esp8266-get-started.md)
#### [Sparkfun ESP8266 Thing Dev with Arduino IDE](iot-hub-sparkfun-esp8266-thing-dev-get-started.md)
#### [Adafruit Feather M0 with Arduino IDE](iot-hub-adafruit-feather-m0-wifi-kit-arduino-get-started.md)

#### Use the IoT Gateway Starter Kit
##### [Set up Intel NUC as an IoT gateway](iot-hub-gateway-kit-c-lesson1-set-up-nuc.md)
##### [Connect IoT gateway to IoT Hub](iot-hub-gateway-kit-c-iot-gateway-connect-device-to-cloud.md)
##### [Use IoT gateway for data conversion](iot-hub-gateway-kit-c-use-iot-gateway-for-data-conversion.md)

## [Manage cloud device messaging with iothub-explorer](iot-hub-explorer-cloud-device-messaging.md)
## [Save IoT Hub messages to Azure data storage](iot-hub-store-data-in-azure-table-storage.md)
## [Data Visualization in Power BI](iot-hub-live-data-visualization-in-power-bi.md)
## [Data Visualization with Web Apps](iot-hub-live-data-visualization-in-web-apps.md)
## [Weather forecast using Azure Machine Learning](iot-hub-weather-forecast-machine-learning.md)
## [Device management with iothub-explorer](iot-hub-device-management-iothub-explorer.md)
## [Remote monitoring and notifications with ​Logic ​Apps](iot-hub-monitoring-notifications-with-azure-logic-apps.md)

# How To
## Plan
### [Comparison of IoT Hub to Event Hubs](iot-hub-compare-event-hubs.md)
### [Scale your solution](iot-hub-scaling.md)
### [High availability and disaster recovery](iot-hub-ha-dr.md)
### [Supporting additional protocols](iot-hub-protocol-gateway.md)
## [Develop](iot-hub-how-to.md)
### [Developer guide](iot-hub-devguide.md)
#### [Send and receive messages](iot-hub-devguide-messaging.md)
#### [Device-to-cloud feature guide](iot-hub-devguide-d2c-guidance.md)
#### [Cloud-to-device feature guide](iot-hub-devguide-c2d-guidance.md)
#### [Upload files from a device](iot-hub-devguide-file-upload.md)
#### [Manage device identities](iot-hub-devguide-identity-registry.md)
#### [Control access to IoT Hub](iot-hub-devguide-security.md)
#### [Understand device twins](iot-hub-devguide-device-twins.md)
#### [Invoke direct methods on a device](iot-hub-devguide-direct-methods.md)
#### [Schedule jobs on multiple devices](iot-hub-devguide-jobs.md)
#### [IoT Hub endpoints](iot-hub-devguide-endpoints.md)
#### [Query language](iot-hub-devguide-query-language.md)
#### [Quotas and throttling](iot-hub-devguide-quotas-throttling.md)
#### [Pricing examples](iot-hub-devguide-pricing.md)
#### [Device and service SDKs](iot-hub-devguide-sdks.md)
#### [MQTT support](iot-hub-mqtt-support.md)
#### [Glossary](iot-hub-devguide-glossary.md)
### [Use the IoT device SDK for C](iot-hub-device-sdk-c-intro.md)
#### [Use the IoTHubClient](iot-hub-device-sdk-c-iothubclient.md)
#### [Use the serializer](iot-hub-device-sdk-c-serializer.md)
### Process device-to-cloud messages
#### [.NET](iot-hub-csharp-csharp-process-d2c.md)
#### [Java](iot-hub-java-java-process-d2c.md)
### Send cloud-to-device messages
#### [.NET](iot-hub-csharp-csharp-c2d.md)
#### [Java](iot-hub-java-java-c2d.md)
#### [Node.js](iot-hub-node-node-c2d.md)
### [Upload files from devices](iot-hub-csharp-csharp-file-upload.md)
### Get started with device twins
#### [Node.js back end/Node.js device](iot-hub-node-node-twin-getstarted.md)
#### [.NET back end/Node.js device](iot-hub-csharp-node-twin-getstarted.md)
### Use direct methods
#### [Node.js back end/Node.js device](iot-hub-node-node-direct-methods.md)
#### [.NET back end/Node.js device](iot-hub-csharp-node-direct-methods.md)
#### [Java back end/Java device](iot-hub-java-java-direct-methods.md)
### Get started with device management
#### [Node.js back end/Node.js device](iot-hub-node-node-device-management-get-started.md)
#### [.NET back end/Node.js device](iot-hub-csharp-node-device-management-get-started.md)
### How to use twin properties
#### [Node.js back end/Node.js device](iot-hub-node-node-twin-how-to-configure.md)
#### [.NET back end/Node.js device](iot-hub-csharp-node-twin-how-to-configure.md)
### Use device jobs to update device firmware
#### [Node back end/Node device](iot-hub-node-node-firmware-update.md)
#### [.NET back end/Node.js device](iot-hub-csharp-node-firmware-update.md)
### Schedule and broadcast jobs
#### [Node.js back end/Node.js device](iot-hub-node-node-schedule-jobs.md)
#### [.NET back end/Node.js device](iot-hub-csharp-node-schedule-jobs.md)
## Manage
### Create an IoT hub 
#### [Use the portal](iot-hub-create-through-portal.md)
#### [Use PowerShell](iot-hub-create-using-powershell.md)
#### [Use CLI 2.0](iot-hub-create-using-cli.md)
#### [Use CLI](iot-hub-create-using-cli-nodejs.md)
#### [Use the REST API](iot-hub-rm-rest.md)
#### [Use a template from PowerShell](iot-hub-rm-template-powershell.md)
#### [Use a template from .NET](iot-hub-rm-template.md)
### Configure file upload
#### [Use the portal](iot-hub-configure-file-upload.md)
#### [Use PowerShell](iot-hub-configure-file-upload-powershell.md)
### [Bulk manage IoT devices](iot-hub-bulk-identity-mgmt.md)
### [Usage metrics](iot-hub-metrics.md)
### [Operations monitoring](iot-hub-operations-monitoring.md)
### [Configure IP filtering](iot-hub-ip-filtering.md)
## Secure
### [Security from the ground up](iot-hub-security-ground-up.md)
### [Security best practices](iot-hub-security-best-practices.md)
### [Security architecture](iot-hub-security-architecture.md)
### [Secure your IoT deployment](iot-hub-security-deployment.md)
## Gateway SDK
### Simulate a device
#### [Linux](iot-hub-linux-gateway-sdk-simulated-device.md)
#### [Windows](iot-hub-windows-gateway-sdk-simulated-device.md)
### [Use a real device](iot-hub-gateway-sdk-physical-device.md)

# Reference
## [Azure CLI 2.0 Preview](/cli/azure/iot)
## [.NET (Service)](/dotnet/api/microsoft.azure.devices)
## [.NET (Devices)](/dotnet/api/microsoft.azure.devices.client)
## [Java (Service)](/java/api/com.microsoft.azure.sdk.iot.service)
## [Java (Devices)](/java/api/com.microsoft.azure.sdk.iot.device)
## [Azure IoT SDKs](http://azure.github.io/azure-iot-sdks/)
## [Gateway SDK](http://azure.github.io/azure-iot-gateway-sdk)
## [REST (Resource Provider)](https://docs.microsoft.com/rest/api/iothub/iothubresource)
## [REST (Device Identities)](https://docs.microsoft.com/rest/api/iothub/deviceapi)
## [REST (Device Twins)](https://docs.microsoft.com/rest/api/iothub/devicetwinapi)
## [REST (Device Messaging)](https://docs.microsoft.com/rest/api/iothub/httpruntime)
## [REST (Jobs)](https://docs.microsoft.com/rest/api/iothub/jobapi)

# Related
## [Azure IoT Suite](https://azure.microsoft.com/documentation/suites/iot-suite/)
## [Azure Event Hubs](https://azure.microsoft.com/documentation/services/event-hubs/)
## [Stream Analytics](https://azure.microsoft.com/documentation/services/stream-analytics/)
## [Machine Learning](https://azure.microsoft.com/documentation/services/machine-learning/)

# Resources
## [iothub-explorer tool](https://github.com/Azure/iothub-explorer)
## [iothub-diagnostics tool](https://github.com/Azure/iothub-diagnostics)
## [DeviceExplorer tool](https://github.com/Azure/azure-iot-sdk-csharp/tree/master/tools/DeviceExplorer)
## [Pricing](https://azure.microsoft.com/pricing/details/iot-hub/)
## [MSDN forum](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=azureiothub)
## [Stack Overflow](http://stackoverflow.com/questions/tagged/azure-iot-hub)
## [Videos](https://azure.microsoft.com/documentation/videos/index/?services=iot-hub)
## [Service updates](https://azure.microsoft.com/updates/?product=iot-hub)
## [Learning path](https://azure.microsoft.com/documentation/learning-paths/iot-hub/)
## [Azure IoT Developer Center](https://azure.microsoft.com/develop/iot/)
## [Azure Certified for IoT device catalog](https://catalog.azureiotsuite.com/)
