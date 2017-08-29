# Overview
## [Azure and IoT](iot-hub-what-is-azure-iot.md)
## [What is Azure IoT Hub?](iot-hub-what-is-iot-hub.md)
## [Overview of device management](iot-hub-device-management-overview.md)

# [Get Started](iot-hub-get-started.md)

## Setup your device
### [Simulate a device on your PC](iot-hub-get-started-simulated.md)
#### [.NET](iot-hub-csharp-csharp-getstarted.md)
#### [Java](iot-hub-java-java-getstarted.md)
#### [Node.js](iot-hub-node-node-getstarted.md)
#### [Python](iot-hub-python-getstarted.md)

### [Use an online simulator](iot-hub-raspberry-pi-web-simulator-get-started.md)

### [Use a physical device](iot-hub-get-started-physical.md)
#### [Raspberry Pi with Node.js](iot-hub-raspberry-pi-kit-node-get-started.md)
#### [Raspberry Pi with C](iot-hub-raspberry-pi-kit-c-get-started.md)

#### [Intel Edison with Node.js](iot-hub-intel-edison-kit-node-get-started.md)
#### [Intel Edison with C](iot-hub-intel-edison-kit-c-get-started.md)

#### [Adafruit Feather HUZZAH ESP8266 with Arduino IDE](iot-hub-arduino-huzzah-esp8266-get-started.md)
#### [Sparkfun ESP8266 Thing Dev with Arduino IDE](iot-hub-sparkfun-esp8266-thing-dev-get-started.md)
#### [Adafruit Feather M0 with Arduino IDE](iot-hub-adafruit-feather-m0-wifi-kit-arduino-get-started.md)

#### Use the IoT Gateway Starter Kit
##### [Set up Intel NUC as a gateway](iot-hub-gateway-kit-c-lesson1-set-up-nuc.md)
##### [Connect the gateway to IoT Hub](iot-hub-gateway-kit-c-iot-gateway-connect-device-to-cloud.md)
##### [Use the gateway for data conversion](iot-hub-gateway-kit-c-use-iot-gateway-for-data-conversion.md)

## Extended IoT scenarios
### [Manage cloud device messaging with iothub-explorer](iot-hub-explorer-cloud-device-messaging.md)
### [Save IoT Hub messages to Azure data storage](iot-hub-store-data-in-azure-table-storage.md)
### [Data Visualization in Power BI](iot-hub-live-data-visualization-in-power-bi.md)
### [Data Visualization with Web Apps](iot-hub-live-data-visualization-in-web-apps.md)
### [Weather forecast using Azure Machine Learning](iot-hub-weather-forecast-machine-learning.md)
### [Device management with iothub-explorer](iot-hub-device-management-iothub-explorer.md)
### [Remote monitoring and notifications with ​Logic ​Apps](iot-hub-monitoring-notifications-with-azure-logic-apps.md)

# How To
## Plan
### [Comparison of IoT Hub to Event Hubs](iot-hub-compare-event-hubs.md)
### [Scale your solution](iot-hub-scaling.md)
### [High availability and disaster recovery](iot-hub-ha-dr.md)
### [Supporting additional protocols](iot-hub-protocol-gateway.md)
## [Develop](iot-hub-how-to.md)
### [Developer guide](iot-hub-devguide.md)
#### [Device-to-cloud feature guide](iot-hub-devguide-d2c-guidance.md)
#### [Cloud-to-device feature guide](iot-hub-devguide-c2d-guidance.md)
#### [Send and receive messages](iot-hub-devguide-messaging.md)
##### [Send device-to-cloud messages to IoT Hub](iot-hub-devguide-messages-d2c.md)
##### [Read device-to-cloud messages from the built-in endpoint](iot-hub-devguide-messages-read-builtin.md)
##### [Use custom endpoints and routing rules for device-to-cloud messages](iot-hub-devguide-messages-read-custom.md)
##### [Send cloud-to-device messages from IoT Hub](iot-hub-devguide-messages-c2d.md)
##### [Create and read IoT Hub messages](iot-hub-devguide-messages-construct.md)
##### [Choose a communication protocol](iot-hub-devguide-protocols.md)
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
#### [.NET back end/.NET device](iot-hub-csharp-csharp-twin-getstarted.md)
### Use direct methods
#### [Node.js back end/Node.js device](iot-hub-node-node-direct-methods.md)
#### [.NET back end/Node.js device](iot-hub-csharp-node-direct-methods.md)
#### [Java back end/Java device](iot-hub-java-java-direct-methods.md)
### Get started with device management
#### [Node.js back end/Node.js device](iot-hub-node-node-device-management-get-started.md)
#### [.NET back end/Node.js device](iot-hub-csharp-node-device-management-get-started.md)
#### [Java back end/Java device](iot-hub-java-java-device-management-getstarted.md)
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
#### [Use CLI 2.0](iot-hub-configure-file-upload-cli.md)
### [Bulk manage IoT devices](iot-hub-bulk-identity-mgmt.md)
### [Usage metrics](iot-hub-metrics.md)
### [Operations monitoring](iot-hub-operations-monitoring.md)
### [Configure IP filtering](iot-hub-ip-filtering.md)
## Secure
### [Security from the ground up](iot-hub-security-ground-up.md)
### [Security best practices](iot-hub-security-best-practices.md)
### [Security architecture](iot-hub-security-architecture.md)
### [Secure your IoT deployment](iot-hub-security-deployment.md)
## Azure IoT Edge
### [Overview](iot-hub-iot-edge-overview.md)
### Get started
#### [Linux](iot-hub-linux-iot-edge-get-started.md)
#### [Windows](iot-hub-windows-iot-edge-get-started.md)
### Simulate a device
#### [Linux](iot-hub-linux-iot-edge-simulated-device.md)
#### [Windows](iot-hub-windows-iot-edge-simulated-device.md)
### [Use a real device](iot-hub-iot-edge-physical-device.md)
### Create a module
#### [Java](iot-hub-iot-edge-create-module-java.md)
#### [.NET Framework](https://github.com/Azure-Samples/iot-edge-samples#how-to-run-the-net-module-sample-windows-10)
#### [.NET Standard](iot-hub-iot-edge-create-module-dotnet-core.md)
#### [Node.js](iot-hub-iot-edge-create-module-js.md)
### Build
#### [.NET Framework](https://github.com/Azure/iot-edge/tree/master/samples/dotnet_binding_sample)
#### [.NET Core module](https://github.com/Azure/iot-edge/tree/master/samples/dotnet_core_module_sample)
#### [.NET Core managed gateway](https://github.com/Azure/iot-edge/tree/master/samples/dotnet_core_managed_gateway)
#### [Java](https://github.com/Azure/iot-edge/tree/master/samples/java_sample)
#### [Node.js](https://github.com/Azure/iot-edge/tree/master/samples/nodejs_simple_sample)
#### [Add module dynamically](https://github.com/Azure/iot-edge/tree/master/samples/dynamically_add_module_sample)
#### [Out-of-process proxy module](https://github.com/Azure/iot-edge/tree/master/samples/proxy_sample)
#### [Native module host](https://github.com/Azure/iot-edge/tree/master/samples/native_module_host_sample)

# Reference
## [Azure CLI](/cli/azure/iot)
## [.NET (Service)](/dotnet/api/microsoft.azure.devices)
## [.NET (Devices)](/dotnet/api/microsoft.azure.devices.client)
## [Java (Service)](/java/api/com.microsoft.azure.sdk.iot.service)
## [Java (Devices)](/java/api/com.microsoft.azure.sdk.iot.device)
## [Node.js SDKs](http://azure.github.io/azure-iot-sdk-node/)
## [C device SDK](https://azure.github.io/azure-iot-sdk-c/index.html)
## [Azure IoT Edge](http://azure.github.io/iot-edge/)
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
## [Azure Certified for IoT device catalog](https://catalog.azureiotsuite.com/)
## [Azure IoT Developer Center](https://azure.microsoft.com/develop/iot/)
## [Azure Roadmap](https://azure.microsoft.com/roadmap/)
## [DeviceExplorer tool](https://github.com/Azure/azure-iot-sdk-csharp/tree/master/tools/DeviceExplorer)
## [iothub-diagnostics tool](https://github.com/Azure/iothub-diagnostics)
## [iothub-explorer tool](https://github.com/Azure/iothub-explorer)
## [Learning path](https://azure.microsoft.com/documentation/learning-paths/iot-hub/)
## [MSDN forum](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=azureiothub)
## [Pricing](https://azure.microsoft.com/pricing/details/iot-hub/)
## [Service updates](https://azure.microsoft.com/updates/?product=iot-hub)
## [Stack Overflow](http://stackoverflow.com/questions/tagged/azure-iot-hub)
## [Technical case studies](https://microsoft.github.io/techcasestudies/#technology=IoT&sortBy=featured)
## [Videos](https://azure.microsoft.com/documentation/videos/index/?services=iot-hub)
