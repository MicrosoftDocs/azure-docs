# Overview
## [Azure and IoT](iot-hub-what-is-azure-iot.md)
## [What is Azure IoT Hub?](iot-hub-what-is-iot-hub.md)
## [Overview of device management](iot-hub-device-management-overview.md)

# Get Started
## Get started with a simulated device
### [.NET](iot-hub-csharp-csharp-getstarted.md)
### [Java](iot-hub-java-java-getstarted.md)
### [Node.js](iot-hub-node-node-getstarted.md)
## Get started with a Raspberry Pi
### [Get Started with Raspberry Pi 3](iot-hub-raspberry-pi-kit-node-get-started.md)
### Lesson 1: Configure your device
#### [Configure your device](iot-hub-raspberry-pi-kit-node-lesson1-configure-your-device.md)
#### [Get the tools (Windows 7+)](iot-hub-raspberry-pi-kit-node-lesson1-get-the-tools-win32.md)
#### [Get the tools (Ubuntu 16.04)](iot-hub-raspberry-pi-kit-node-lesson1-get-the-tools-ubuntu.md)
#### [Get the tools (macOS 10.10)](iot-hub-raspberry-pi-kit-node-lesson1-get-the-tools-mac.md)
#### [Create and deploy the blink application](iot-hub-raspberry-pi-kit-node-lesson1-deploy-blink-app.md)
### Lesson 2: Create your IoT hub
#### [Get the Azure tools (Windows 7+)](iot-hub-raspberry-pi-kit-node-lesson2-get-azure-tools-win32.md)
#### [Get the Azure tools (Ubuntu 16.04)](iot-hub-raspberry-pi-kit-node-lesson2-get-azure-tools-ubuntu.md)
#### [Get the Azure tools (macOS 10.10)](iot-hub-raspberry-pi-kit-node-lesson2-get-azure-tools-mac.md)
#### [Create your IoT hub and register your Raspberry Pi](iot-hub-raspberry-pi-kit-node-lesson2-prepare-azure-iot-hub.md)
### Lesson 3: Send device-to-cloud messages
#### [Create an Azure function app and storage account](iot-hub-raspberry-pi-kit-node-lesson3-deploy-resource-manager-template.md)
#### [Run the sample application to send messages](iot-hub-raspberry-pi-kit-node-lesson3-run-azure-blink.md)
#### [Read messages persisted in storage](iot-hub-raspberry-pi-kit-node-lesson3-read-table-storage.md)
### Lesson 4: Send cloud-to-device messages
#### [Run the sample application to receive messages](iot-hub-raspberry-pi-kit-node-lesson4-send-cloud-to-device-messages.md)
#### [Optional: Change the LED behavior](iot-hub-raspberry-pi-kit-node-lesson4-change-led-behavior.md)
### [Troubleshoot](iot-hub-raspberry-pi-kit-node-troubleshooting.md)
## [Get started with the Gateway SDK (Linux)](iot-hub-linux-gateway-sdk-get-started.md)
## [Get started with the Gateway SDK (Windows)](iot-hub-windows-gateway-sdk-get-started.md)

# How To
## Plan
### [Comparison of IoT Hub to Event Hubs](iot-hub-compare-event-hubs.md)
### [Scale your solution](iot-hub-scaling.md)
### [High availability and disaster recovery](iot-hub-ha-dr.md)
### [Supporting additional protocols](iot-hub-protocol-gateway.md)
## Develop
### Process device-to-cloud messages
#### [.NET](iot-hub-csharp-csharp-process-d2c.md)
#### [Java](iot-hub-java-java-process-d2c.md)
### [Upload files from devices](iot-hub-csharp-csharp-file-upload.md)
### Send cloud-to-device messages
#### [.NET](iot-hub-csharp-csharp-c2d.md)
#### [Java](iot-hub-java-java-c2d.md)
#### [Node.js](iot-hub-node-node-c2d.md)
### Get started with device twins
#### [Node.js back-end app/Node.js device app](iot-hub-node-node-twin-getstarted.md)
#### [.NET back-end app/Node.js device app](iot-hub-csharp-node-twin-getstarted.md)
### Use direct methods
#### [Node.js back-end app/Node.js device app](iot-hub-node-node-direct-methods.md)
#### [.NET back-end app/Node.js device app](iot-hub-csharp-node-direct-methods.md)
### Get started with device management
#### [Node.js back-end app/Node.js device app](iot-hub-node-node-device-management-get-started.md)
#### [.NET back-end app/Node.js device app](iot-hub-csharp-node-device-management-get-started.md)
### How to use twin properties
#### [Node.js back-end app/Node.js device app](iot-hub-node-node-twin-how-to-configure.md)
#### [.NET back-end app/Node.js device app](iot-hub-csharp-node-twin-how-to-configure.md)
### Use device jobs to update device firmware
#### [Node.js back-end app/Node.js device app](iot-hub-node-node-firmware-update.md)
#### [.NET back-end app/Node.js device app](iot-hub-csharp-node-firmware-update.md)
### Schedule and broadcast jobs
#### [Node.js back-end app/Node.js device app](iot-hub-node-node-schedule-jobs.md)
#### [.NET back-end app/Node.js device app](iot-hub-csharp-node-schedule-jobs.md)
### Developer guide
#### [Introduction](iot-hub-devguide.md)
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
## Manage
### Create an IoT hub 
#### [Use the portal](iot-hub-create-through-portal.md)
#### [Use the CLI 2.0 Preview](iot-hub-create-using-cli.md)
#### [Use the CLI](iot-hub-create-using-cli-nodejs.md)
#### [Use the REST API](iot-hub-rm-rest.md)
#### [Use Powershell](iot-hub-rm-template-powershell.md)
#### [Use a template from .NET](iot-hub-rm-template.md)
### [Configure file upload](iot-hub-configure-file-upload.md)
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
### [Simulate a device with the Gateway SDK tutorial (Linux)](iot-hub-linux-gateway-sdk-simulated-device.md)
### [Simulate a device with the Gateway SDK tutorial (Windows)](iot-hub-windows-gateway-sdk-simulated-device.md)
### [Send messages from a real device with the Gateway SDK tutorial](iot-hub-gateway-sdk-physical-device.md)

# Reference
## [Azure CLI](https://docs.microsoft.com/cli/azure)
## [Java](https://docs.microsoft.com/java/api)
## [.NET API](https://docs.microsoft.com/dotnet/api)
## [Azure IoT SDKs](http://azure.github.io/azure-iot-sdks/)
## [Gateway SDK API](http://azure.github.io/azure-iot-gateway-sdk)
## [Resource Provider REST API](https://docs.microsoft.com/rest/api/iothub/resourceprovider/iot-hub-resource-provider-rest)
## [Device Identities REST API](https://docs.microsoft.com/rest/api/iothub/device-identities-rest)
## [Device Messaging REST API](https://docs.microsoft.com/rest/api/iothub/device-messaging-rest-apis)
## [Introduction to the Azure IoT device SDK for C](iot-hub-device-sdk-c-intro.md)
## [IoT device SDK for C: more about IoTHubClient](iot-hub-device-sdk-c-iothubclient.md)
## [IoT device SDK for C: more about serializer](iot-hub-device-sdk-c-serializer.md)

# Related
## [Azure IoT Suite](https://azure.microsoft.com/documentation/suites/iot-suite/)
## [Azure Event Hubs](https://azure.microsoft.com/documentation/services/event-hubs/)
## [Stream Analytics](https://azure.microsoft.com/documentation/services/stream-analytics/)
## [Machine Learning](https://azure.microsoft.com/documentation/services/machine-learning/)

# Resources
## [Pricing](https://azure.microsoft.com/pricing/details/iot-hub/)
## [MSDN forum](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=azureiothub)
## [Stack Overflow](http://stackoverflow.com/questions/tagged/azure-iot-hub)
## [Videos](https://azure.microsoft.com/documentation/videos/index/?services=iot-hub)
## [Service updates](https://azure.microsoft.com/updates/?product=iot-hub)
## [Learning path](https://azure.microsoft.com/documentation/learning-paths/iot-hub/)
## [Azure IoT Developer Center](https://azure.microsoft.com/develop/iot/)
## [Azure Certified for IoT device catalog](https://catalog.azureiotsuite.com/)
