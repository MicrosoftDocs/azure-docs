---
title: Add correlation IDs to IoT messages with distributed tracing (preview)
description: 
author: jlian
manager: briz
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 02/06/2019
ms.author: jlian
---

# Add correlation IDs to Azure IoT device-to-cloud messages with distributed tracing support for IoT Hub (preview)

Microsoft Azure IoT Hub currently supports distributed tracing as a [preview feature](https://azure.microsoft.com/en-us/support/legal/preview-supplemental-terms/).

IoT Hub is one of the first Azure services to support distributed tracing. As more Azure services support distributed tracing, you will be able trace IoT messages throughout the Azure services involved in your solution. For a background on distributed tracing see, [What is Distributed tracing?](../azure-monitor/app/distributed-tracing.md).

Enabling distributed tracing for IoT Hub, gives you the ability to:

- Add a [trace context](https://github.com/w3c/trace-context) to your IoT device messages. This trace context includes correlation IDs that allow you to correlate events from one component with events from another component. This trace context is configured on a [device twin](iot-hub-devguide-device-twins.md), and can be applied for subsets, or all IoT device messages.
- Automatically log the trace context to [Azure Monitor diagnostic logs](iot-hub-monitor-resource-health.md).
- Measure and understand message flow and latency from devices to IoT Hub and routing endpoints.
- Start considering how you will implement distributed tracing for the non-Azure services in your IoT solution

## Prerequisites

- This article assumes that you have already created an IoT hub, and that you are familiar with sending telemetry messages to your IoT hub. Make sure you have completed one of the [5-minute Quickstarts](https://docs.microsoft.com/azure/iot-hub/) for your preferred development environment.

## Configure IoT Hub

In this section, you configure an IoT Hub to include distributed tracing attributes (correlation IDs and timestamps).

1. Navigate to your IoT hub in the Azure portal.

1. In the left pane for your IoT hub, scroll down to the **Monitoring** section and click **Diagnostics settings**.

1. If diagnostic settings are not already turned on, click **Turn on diagnostics**. If you have already enabled diagnostic settings, click **Add diagnostic setting**.

1. In the **Name** field, enter a name for a new diagnostic setting. For example, **DistributedTracingSettings**.

1. Choose one or more of the following options that determine where the logging will be sent:

    - **Archive to a storage account**: Configure a storage account to contain the logging information.
    - **Stream to an event hub**: Configure an event hub to contain the logging information.
    - **Send to Log Analytics**: Configure a log analytics workspace to contain the logging information.

1. In the **Log** section, select the operations that you want logging information for.

    Make sure to include **DistributedTracing**, and configure a **Retention** for how many days you want the logging retained.

    ![Screenshot showing where the DistributedTracing category is for IoT diagnostic settings](./media/iot-hub-distributed-tracing/diag-settings.png)

1. Click **Save** for the new setting.

1. (Optional) To see the messages flow to different places, set up [routing rules to at least two different end points](iot-hub-devguide-messages-d2c.md).

Once the logging is turned on, IoT Hub records logs when messages containing valid trace properties arrive at the gateway, enter the IoT Hub, and (if enabled) are routed to endpoints. To learn more about logs and their schemas, see [Azure IoT Hub diagnostic logs](iot-hub-monitor-resource-health.md#distributed-tracing-preview).

## Set up device

### **Bug bash**

For bug bash, we prepared a Windows executable that you can run without having to build the whole SDK and modify code.

1. Download the [iothub_ll_telemetry_sample.exe](https://microsoft.sharepoint-df.com/teams/AzureIoTBugbashes/Shared%20Documents/Distributed%20Tracing%20Public%20Preview%20Bug%20Bash/iothub_ll_telemetry_sample.exe) that we've compiled for Windows.

1. Open a command prompt, and go to the folder where you downloaded the exe

1. Run the sample with a device connection string.

	```cmd
	iothub_ll_telemetry_sample.exe -c:<Device Connection String> -p:mqtt
	```
	You can also change the `mqtt` to `amqp`.

1. Keep the program running, and move on to [Update sampling options](#update-sampling-options)

### Build your own

If you don't want to run the exe, modify and build the sample according to instructions:

1. Install ["Desktop development with C++" workload](https://docs.microsoft.com/cpp/build/vscpp-step-0-installation?view=vs-2017) for either Visual Studio 2015 or 2017

1. Install [CMake](https://cmake.org/). Make sure it is in your `PATH` by typing `cmake -version` from a command prompt.

1. Clone the private (you must [join the Azure organization on Github](https://repos.opensource.microsoft.com/Azure)) C SDK repo. This takes a few minutes. Or just download the [zip from the Teams channel]()

	```bash
	git clone --recursive https://github.com/Azure/azure-iot-sdk-c-e2e-diag.git
	```

1. Create a `cmake` subdirectory  in the root directory of the C SDK repo you just cloned, and initialize it

	```bash	
	cd azure-iot-sdk-c-e2e-diag
	mkdir cmake 
	cd cmake 
	cmake .. -G "Visual Studio 15 2017"
	```

1. **Bug Bash** Please download [iothub_ll_telemetry_sample.c](https://microsoft.sharepoint-df.com/teams/AzureIoTBugbashes/Shared%20Documents/Distributed%20Tracing%20Public%20Preview%20Bug%20Bash/iothub_ll_telemetry_sample.c) to replace
`iothub_client/samples/iothub_ll_telemetry_sample/iothub_ll_telemetry_sample.c`, edit the source file to provide your device connection string

	```c
	/* Paste in the your iothub connection string  */ 
	static const char* connectionString = "[device connection string]";
	```

1. (Optional) If you want to use AMQP, modify line 29 to 31 to comment out MQTT and uncomment AMQP

	```c
	//#define SAMPLE_MQTT
	//#define SAMPLE_MQTT_OVER_WEBSOCKETS
	#define SAMPLE_AMQP
	```
1. Change the message count to 50000, change the ThreadAPI_Sleep to 1000

1. Compile the application from the cmake folder

	```bash
	cmake --build . -- /m /p:Configuration=Release
	```

1. Run the application. The device starts to listen for instructions on how often to add trace properties to messages (sampling) via the device twin.

	```cmd
	cd cmake\iothub_client\samples\iothub_ll_telemetry_sample\Release\
	start iothub_ll_telemetry_sample.exe 
	```

1. Keep the app running. Optionally observe the message being sent to IoT Hub by looking at the console window.

<!-- For a client app that can receive sampling decisions from the cloud, check out [this sample](https://aka.ms/iottracingCsample).  -->

If you're not using the C SDK, and still would like preview distributed tracing for IoT Hub, construct the message to contain a `tracestate` application property with the creation time of the message in the unix timestamp format. For example, `tracestate=timestamp=1539243209`. To control the percentage of messages containing this property, implement logic to listen to cloud-initiated events such as twin updates.

## Update sampling options 

To limit or control the percentage of messages to be traced from the cloud, update the twin. You can use whatever way you like (JSON editor in portal, IoT Hub service SDK, etc.) to update it. 

### Update using the portal

1. **Bug bash**: Go to Azure portal, then open up your browser dev tools (F12 in most browsers) and paste this into the console:

	```
	MsPortalImpl.Extension.registerTestExtension({name:"Microsoft_Azure_IotHub",uri:"https://distributedtracingbugbash.azurewebsites.net/"});
	```

1. **Bug bash**: Then you'll need to reload the portal with this URL:
https://portal.azure.com/?feature.canmodifyextensions=true 

1. Select **Allow** when the warning shows up

1. Navigate to your IoT hub in Azure portal, then click **IoT devices**

1. Click your device

1. Look for **Enable distributed tracing (preview)**, then select **Enable**

    ![Enable distributed tracing in Azure portal](./media/iot-hub-distributed-tracing/azure-portal.png)

1. Choose a **Sampling rate** between 0% and 100%.

1. Click **Save**

1. Wait a few seconds, and hit **Refresh**, then if successfully acknowledged by device, a sync icon with a checkmark appears. 

1. Go back to the console window from the telemetry message app. You start seeing messages being sent with `tracestate` in the application properties. 

1. (Optional) Change the sampling rate to a different value, and observe the different amount of messages that have `tracestate` in the application properties.

    ![Trace state](./media/iot-hub-distributed-tracing/MicrosoftTeams-image.png)

This doesn't do anything unless your device is set up to listen to twin changes by following the [Deploy client application to your IoT device](#deploy-client-application-to-your-IoT-device) section.

To update the distributed tracing sampling configuration for multiple devices, use [automatic device configuration](iot-hub-auto-device-config.md). Make sure you follow this twin schema:

```json
"desired": {
	"azureiot*com^dtracing^1*0*0": {
		"sampling_mode": 1,
		"sampling_rate": 100
	},
```

| Element name | Required | Type | Description |
|-----------------|----------|---------|-----------------------------------------------------|
| `sampling_mode` | Yes | Integer | Two possible values where `1` is On and `2` is Off |
| `sampling_rate` | Yes | Integer | Only values from 0 to 100 permitted (inclusive) |

### Update using Azure IoT Hub Toolkit for VS Code

1. Install VS Code, then download the preview version of Azure IoT Hub Toolkit for VS Code from [here](https://microsoft.sharepoint-df.com/teams/AzureIoTBugbashes/Shared%20Documents/Distributed%20Tracing%20Public%20Preview%20Bug%20Bash/azure-iot-toolkit-2.1.9.vsix), and install it ([how to install from a VSIX](https://code.visualstudio.com/docs/editor/extension-gallery#_install-from-a-vsix))

1. Open VS Code, set up IoT Hub connection string for your IoT Hub just created. You may refer to [how to set up IoT Hub connection string](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit#user-content-prerequisites)

1. Expand the device just created, click context menu *Update Distributed Tracing Setting (Preview)* of sub node Distributed Tracing Setting (Preview)

    ![Enable distributed tracing in Azure IoT Hub Toolkit](./media/iot-hub-distributed-tracing/update-distributed-tracing-setting-1.png)

1. In popup window, select 'Enable' first, then press Enter to confirm 100 as sampling rate

    ![Update sampling mode](./media/iot-hub-distributed-tracing/update-distributed-tracing-setting-2.png)

    ![Update sampling rate ](./media/iot-hub-distributed-tracing/update-distributed-tracing-setting-3.png)

## Query and visualize

To see the all the traces logged by IoT Hub, query the log store that you selected in diagnostic settings. This section walks through a couple different options.

### Query using Log Analytics

If you've set up [Log Analytics with diagnostic logs](../azure-monitor/platform/diagnostic-logs-stream-log-store.md), query by looking for logs in the `DistributedTracing` category. For example, this query shows all the traces logged:

```Kusto
// All distributed traces 
AzureDiagnostics 
| where Category == "DistributedTracing" 
| project TimeGenerated, Category, OperationName, Level, CorrelationId, DurationMs, properties_s 
| order by TimeGenerated asc  
```

Example logs as shown by Log Analytics:

| TimeGenerated | OperationName | Category | Level | CorrelationId | DurationMs | Properties |
|--------------------------|---------------|--------------------|---------------|---------------------------------------------------------|------------|------------------------------------------------------------------------------------------------------------------------------------------|
| 2018-02-22T03:28:28.633Z | DiagnosticIoTHubD2C | DistributedTracing | Informational | 00-8cd869a412459a25f5b4f31311223344-0144d2590aacd909-01 |  | {"deviceId":"AZ3166","messageSize":"96","callerLocalTimeUtc":"2018-02-22T03:27:28.633Z","calleeLocalTimeUtc":"2018-02-22T03:27:28.687Z"} |
| 2018-02-22T03:28:38.633Z | DiagnosticIoTHubIngress | DistributedTracing | Informational | 00-8cd869a412459a25f5b4f31311223344-349810a9bbd28730-01 | 20 | {"isRoutingEnabled":"false","parentSpanId":"0144d2590aacd909"} |
| 2018-02-22T03:28:48.633Z | DiagnosticIoTHubEgress | DistributedTracing | Informational | 00-8cd869a412459a25f5b4f31311223344-349810a9bbd28730-01 | 23 | {"endpointType":"EventHub","endpointName":"myEventHub", "parentSpanId":"0144d2590aacd909"} |

To understand the different types of logs, see [Azure IoT Hub diagnostic logs](iot-hub-monitor-resource-health.md#distributed-tracing-preview).

### Application Map

To visualize the flow of IoT messages participating distributed tracing, set up the Application Map sample app. It works by piping data from IoT Hub to Azure Monitor, which pipes to Event Hub, then to [Application Map](../application-insights/app-insights-app-map.md).

For example, this is what distributed tracing in App Map looks like with 3 routing endpoints.

![IoT distributed tracing in App Map](./media/iot-hub-distributed-tracing/app-map.png)

> [!div class="button"]
<a href="https://github.com/Azure-Samples/e2e-diagnostic-provision-cli" target="_blank">Get the sample on Github</a>

## **Bug bash:** Clean up

1. Stop the telemetry app that was running

1. Please delete IoT Hub, Storage Account, Event Hub, or Log Analytics Workspace you created for bug bash

1. Uninstall preview version of Azure IoT Hub Toolkit and re-install official version from Extension tab if necessary

1. You should paste this in your browser console to remove the sideloaded portal extension:

```
MsPortalImpl.Extension.unregisterTestExtension("Microsoft_Azure_IotHub")
```

## Understand Azure IoT distributed tracing (work in progress)

### Context

Many IoT solutions, including our own [reference architecture](https://aka.ms/iotrefarchitecture) (English only), generally follow a variant of the [microservice architecture](https://docs.microsoft.com/azure/architecture/microservices/). As such an IoT solution grows more complex, you end up using a dozen or more microservices, either from Azure or not. Pinpointing where IoT messages are dropping or slowing down can become very challenging. For example, you have an IoT solution that uses 5 different Azure services and 1500 active devices. Each device is programmed to send 10 device-to-cloud messages/second (for a total of 15000 messages/second), but you notice that your web app sees only 10000 messages/second - where is the issue? How do you find the culprit?

### Distributed tracing pattern in microservice architecture

To reconstruct the flow of a IoT message across the different services, each service should propagate a *correlation ID* that uniquely identifies the message. Once collected in a centralized system, the set of correlation IDs enable you to see the message flow. This method is called the [distributed tracing pattern](https://docs.microsoft.com/azure/architecture/microservices/logging-monitoring#distributed-tracing).

Microsoft is supporting wider adoption for distributed tracing in the industry by contributing to a [W3C standard proposal](https://w3c.github.io/trace-context/).

### IoT Hub support

Once enabled, distributed tracing support for IoT Hub works like this:

1. A message is generated on the IoT device
1. The IoT device decides (with help from cloud) that this message should be assigned with a trace context
1. The SDK adds a `tracestate` to the message application property, containing the message creation timestamp
1. The IoT device sends the message to IoT Hub
1. The message arrives at IoT hub gateway
1. IoT Hub looks for the `tracestate` in the message application properties, and checks to see if it's in the correct format
1. If so, IoT Hub logs the `trace-id` and `span-id` to Azure Monitor diagnostic logs
1. Repeat steps 2 through 6 for each message generated

## Limits of the public preview 

- Proposal for W3C Trace Context standard is still in draft.
- The only language supported by client SDK is C for now.
- For Basic SKUs, the cloud-to-device twin capability is not available. However, IoT Hub will still log to Azure Monitor if it sees a properly composed trace context header.
- We will be implementing an explicit throttle control to prevent abuse

## Next steps

* To learn more about the general distributed tracing pattern in microservices, see [Microservice architecture pattern: distributed tracing](https://microservices.io/patterns/observability/distributed-tracing.html).
* To set up configuration to apply distributed tracing settings to a large number of devices, see [Configure and monitor IoT devices at scale](iot-hub-auto-device-config.md).
* To learn more about Azure Monitor, see [What is Azure Monitor?](../azure-monitor/overview.md)
