---
title: How to implement IoT Edge observability using monitoring and troubleshooting
description: Learn how to build an observability solution for an IoT Edge System
author: eedorenko
ms.author: iefedore
ms.date: 04/01/2022
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# How to implement IoT Edge observability using monitoring and troubleshooting

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

In this article, you'll learn the concepts and techniques of implementing both observability dimensions *measuring and monitoring* and *troubleshooting*. You'll learn about the following topics:
* Define what indicators of the service performance to monitor 
* Measure service performance indicators with metrics 
* Monitor metrics and detect issues with Azure Monitor workbooks  
* Perform basic troubleshooting with the curated workbooks
* Perform deeper troubleshooting with distributed tracing and correlated logs
* Optionally, deploy a sample scenario to Azure to reproduce what you learned


## Scenario 

In order to go beyond abstract considerations, we'll use a *real-life* scenario collecting ocean surface temperatures from sensors into Azure IoT.

### La Niña

:::image type="content" source="media/how-to-observability/la-nina-high-level.png" alt-text="Illustration of La Niña solution collecting surface temperature from sensors into Azure I o T Edge.":::

The La Niña service measures surface temperature in Pacific Ocean to predict La Niña winters. There is a number of buoys in the ocean with IoT Edge devices that send the surface temperature to Azure Cloud. The telemetry data with the temperature is pre-processed by a custom module on the IoT Edge device before sending it to the cloud. In the cloud, the data is processed by backend Azure Functions and saved to Azure Blob Storage. The clients of the service (ML inference workflows, decision making systems, various UIs, etc.) can pick up messages with temperature data from the Azure Blob Storage.

## Measuring and monitoring

Let's build a measuring and monitoring solution for the La Niña service focusing on its business value.

### What do we measure and monitor

To understand what we're going to monitor, we must understand what the service actually does and what the service clients expect from the system. In this scenario, the expectations of a common La Niña service consumer may be categorized by the following factors:

* **_Coverage_**. The data is coming from most installed buoys
* **_Freshness_**. The data coming from the buoys is fresh and relevant
* **_Throughput_**. The temperature data is delivered from the buoys without significant delays
* **_Correctness_**. The ratio of lost messages (errors) is small

The satisfaction regarding these factors means that the service works according to the client's expectations.

The next step is to define instruments to measure values of these factors. This job can be done by the following Service Level Indicators (SLI):

|**Service Level Indicator** | **Factors** |
|----------|------|
|Ratio of on-line devices to the total number of devices| Coverage|
|Ratio of devices reporting frequently to the number of reporting devices| Freshness, Throughput|
|Ratio of devices successfully delivering messages to the total number of devices|Correctness|
|Ratio of devices delivering messages fast to the total number of devices| Throughput | 

With that done, we can apply a sliding scale on each indicator and define exact threshold values that represent what it means for the client to be "satisfied". For this scenario, we have selected sample threshold values as laid out in the table below with formal Service Level Objectives (SLOs):

|**Service Level Objective**|**Factor**|
|-------------|----------|
|90% of devices reported metrics no longer than 10 mins ago (were online) for the observation interval| Coverage |
|95% of online devices send temperature 10 times per minute for the observation interval| Freshness, Throughput |
|99% of online devices deliver messages successfully with less than 5% of errors for the observation interval| Correctness |
|95% of online devices deliver 90th percentile of messages within 50 ms for the observation interval|Throughput|

SLOs definition must also describe the approach of how the indicator values are measured:

- Observation interval: 24 hours. SLO statements have been true for the last 24 hours. Which means that if an SLI goes down and breaks a corresponding SLO, it will take 24 hours after the SLI has been fixed to consider the SLO good again.
- Measurements frequency: 5 minutes. We do the measurements to evaluate SLI values every 5 minutes.
- What is measured: interaction between IoT Device and the cloud, further consumption of the temperature data is out of scope.


### How do we measure

At this point, it's clear what we're going to measure and what threshold values we're going to use to determine if the service performs according to the expectations.  

It's a common practice to measure service level indicators, like the ones we've defined, by the means of **_metrics_**. This type of observability data is considered to be relatively small in values. It's produced by various system components and collected in a central observability backend to be monitored with dashboards, workbooks and alerts.

Let's clarify what components the La Niña service consists of:

:::image type="content" source="media/how-to-observability/la-nina-metrics.png" alt-text="Diagram of La Niña components including I o T Edge device and Azure Services":::

There is an IoT Edge device with `Temperature Sensor` custom module (C#) that generates some temperature value and sends it upstream with a telemetry message. This message is routed to another custom module `Filter` (C#). This module checks the received temperature against a threshold window (0-100 degrees Celsius). If the temperature is within the window, the FilterModule sends the telemetry message to the cloud.

In the cloud, the message is processed by the backend. The backend consists of a chain of two Azure Functions and storage account. 
Azure .NET Function picks up the telemetry message from the IoT Hub events endpoint, processes it and sends it to Azure Java Function. The Java function saves the message to the storage account blob container.

An IoT Hub device comes with system modules `edgeHub` and `edgeAgent`. These modules expose through a Prometheus endpoint [a list of built-in metrics](how-to-access-built-in-metrics.md). These metrics are collected and pushed to Azure Monitor Log Analytics service by the [metrics collector module](how-to-collect-and-transport-metrics.md) running on the IoT Edge device. In addition to the system modules, the `Temperature Sensor` and `Filter` modules can be instrumented with some business specific metrics too. However, the service level indicators that we've defined can be measured with the built-in metrics only. So, we don't really need to implement anything else at this point. 

In this scenario, we have a fleet of 10 buoys. One of the buoys has been intentionally set up to malfunction so that we can demonstrate the issue detection and the follow-up troubleshooting. 

### How do we monitor

We're going to monitor Service Level Objectives (SLO) and corresponding Service Level Indicators (SLI) with Azure Monitor Workbooks. This scenario deployment includes the *La Nina SLO/SLI* workbook assigned to the IoT Hub. 

:::image type="content" source="media/how-to-observability/dashboard-path.png" alt-text="Screenshot of I o T Hub monitoring showing the Workbooks. From the Gallery in the Azure portal.":::

To achieve the best user experience the workbooks are designed to follow the _glance_ -> _scan_ -> _commit_ concept:

#### Glance
 
At this level, we can see the whole picture at a single glance. The data is aggregated and represented at the fleet level:

:::image type="content" source="media/how-to-observability/glance.png" alt-text="Screenshot of the monitoring summary report in the Azure portal showing an issue with device coverage and data freshness.":::

From what we can see, the service is not functioning according to the expectations. There is a violation of the *Data Freshness* SLO.
Only 90% of the devices send the data frequently, and the service clients expect 95%.

All SLO and threshold values are configurable on the workbook settings tab:

:::image type="content" source="media/how-to-observability/workbook-settings.png" alt-text="Screenshot of the workbook settings in the Azure portal.":::

#### Scan

By clicking on the violated SLO, we can drill down to the *scan* level and see how the devices contribute to the aggregated SLI value. 

:::image type="content" source="media/how-to-observability/scan.png" alt-text="Screenshot of message frequency of different devices.":::

There is a single device (out of 10) that sends the telemetry data to the cloud "rarely". In our SLO definition, we've stated that "frequently" means at least 10 times per minute. The frequency of this device is way below that threshold.

#### Commit

By clicking on the problematic device, we're drilling down to the *commit* level. This is a curated workbook *Device Details* that comes out of the box with IoT Hub monitoring offering. The *La Nina SLO/SLI* workbook reuses it to bring the details of the specific device performance. 

:::image type="content" source="media/how-to-observability/commit.png" alt-text="Screenshot of messaging telemetry for a device in the Azure portal.":::

## Troubleshooting

*Measuring and monitoring* lets us observe and predict the system behavior, compare it to the defined expectations and ultimately detect existing or potential issues. The *troubleshooting*, on the other hand, lets identify and locate the cause of the issue.

### Basic troubleshooting

The *commit* level workbook gives a lot of detailed information about the device health. That includes resources consumption at the module and device level, message latency, frequency, QLen, etc. In many cases, this information may help locate the root of the issue. 

In this scenario, all parameters of the trouble device look normal and it's not clear why the device sends messages less frequent than expected. This fact is also confirmed by the *messaging* tab of the device-level workbook:

:::image type="content" source="media/how-to-observability/messages.png" alt-text="Screenshot of sample messages in the Azure portal.":::

The `Temperature Sensor` (tempSensor) module produced 120 telemetry messages, but only 49 of them went upstream to the cloud.

The first step we want to do is to check the logs produced by the `Filter` module. Click the **Troubleshoot live!** button and select the `Filter` module.

:::image type="content" source="media/how-to-observability/basic-logs.png" alt-text="Screenshot of the filter module log in the Azure portal.":::

Analysis of the module logs doesn't discover the issue. The module receives messages, there are no errors. Everything looks good here.

### Deep troubleshooting

There are two observability instruments serving the deep troubleshooting purposes: *traces* and *logs*. In this scenario, traces show how a telemetry message with the ocean surface temperature is traveling from the sensor to the storage in the cloud, what is invoking what and with what parameters. Logs give information on what is happening inside each system component during this process. The real power of *traces* and *logs* comes when they're correlated. With that it's possible to read the logs of a specific system component, such as a module on IoT device or a backend function, while it was processing a specific telemetry message.

The La Niña service uses [OpenTelemetry](https://opentelemetry.io) to produce and collect traces and logs in Azure Monitor.

:::image type="content" source="media/how-to-observability/la-nina-detailed.png" alt-text="Diagram illustrating an I o T Edge device sending telemetry data to Azure Monitor.":::

IoT Edge modules `Temperature Sensor` and `Filter` export the logs and tracing data via OTLP (OpenTelemetry Protocol) to the [OpenTelemetryCollector](https://opentelemetry.io/docs/collector/) module, running on the same edge device. The `OpenTelemetryCollector` module, in its turn, exports logs and traces to Azure Monitor Application Insights service.

The Azure .NET Function sends the tracing data to Application Insights with [Azure Monitor Open Telemetry direct exporter](../azure-monitor/app/opentelemetry-enable.md). It also sends correlated logs directly to Application Insights with a configured ILogger instance.

The Java backend function uses [OpenTelemetry auto-instrumentation Java agent](../azure-monitor/app/opentelemetry-enable.md?tabs=java) to produce and export tracing data and correlated logs to the Application Insights instance.

By default, IoT Edge modules on the devices of the La Niña service are configured to not produce any tracing data and the [logging level](/aspnet/core/fundamentals/logging) is set to `Information`. The amount of produced tracing data is regulated by a [ratio based sampler](https://github.com/open-telemetry/opentelemetry-dotnet/blob/main/src/OpenTelemetry/Trace/TraceIdRatioBasedSampler.cs#L35). The sampler is configured with a desired [probability](https://github.com/open-telemetry/opentelemetry-dotnet/blob/bdcf942825915666dfe87618282d72f061f7567e/src/OpenTelemetry/Trace/TraceIdRatioBasedSampler.cs#L35) of a given activity to be included in a trace. By default, the probability is set to 0. With that in place, the devices don't flood the Azure Monitor with the detailed observability data if it's not requested.

We've analyzed the `Information` level logs of the `Filter` module and realized that we need to dive deeper to locate the cause of the issue. We're going to update properties in the `Temperature Sensor` and `Filter` module twins and increase the `loggingLevel` to `Debug` and change the `traceSampleRatio` from `0` to `1`:

:::image type="content" source="media/how-to-observability/update-twin.png" alt-text="Screenshot of module troubleshooting showing how to update the FilterModule twin properties.":::

With that in place, we have to restart the `Temperature Sensor` and `Filter` modules:

:::image type="content" source="media/how-to-observability/restart-module.png" alt-text="Screenshot of module troubleshooting showing the Restart FilterModule button.":::

In a few minutes, the traces and detailed logs will arrive to Azure Monitor from the trouble device. The entire end-to-end message flow from the sensor on the device to the storage in the cloud will be available for monitoring with *application map* in Application Insights:

:::image type="content" source="media/how-to-observability/application-map.png" alt-text="Screenshot of the application map in Application Insights.":::

From this map we can drill down to the traces and we can see that some of them look normal and contain all the steps of the flow, and some of them, are very short, so nothing happens after the `Filter` module. 

:::image type="content" source="media/how-to-observability/traces.png" alt-text="Screenshot of monitoring traces.":::

Let's analyze one of those short traces and find out what was happening in the `Filter` module, and why it didn't send the message upstream to the cloud. 

Our logs are correlated with the traces, so we can query logs specifying the `TraceId` and `SpanId` to retrieve logs corresponding exactly to this execution instance of the `Filter` module:

:::image type="content" source="media/how-to-observability/logs.png" alt-text="Sample trace query filtering based on Trace I D and Span I D.":::

The logs show that the module received a message with 70.465-degrees temperature. But the filtering threshold configured on this device is 30 to 70. So the message simply didn't pass the threshold. Apparently, this specific device was configured wrong. This is the cause of the issue we detected while monitoring the La Niña service performance with the workbook.

Let's fix the `Filter` module configuration on this device by updating properties in the module twin. We also want to reduce back the `loggingLevel` to `Information` and `traceSampleRatio` to `0`: 

:::image type="content" source="media/how-to-observability/fix-issue.png" alt-text="Sample JSON showing the logging level and trace sample ratio values.":::

Having done that, we need to restart the module. In a few minutes, the device reports new metric values to Azure Monitor. It reflects in the workbook charts:

:::image type="content" source="media/how-to-observability/fixed-workbook.png" alt-text="Screenshot of the Azure Monitor workbook chart.":::

We see that the message frequency on the problematic device got back to normal. The overall SLO value will become green again, if nothing else happens, in the configured observation interval:

:::image type="content" source="media/how-to-observability/green-workbook.png" alt-text="Screenshot of the monitoring summary report in the Azure portal.":::

## Try the sample

At this point, you might want to deploy the scenario sample to Azure to reproduce the steps and play with your own use cases. 

In order to successfully deploy this solution, you need the following:

- [PowerShell](/powershell/scripting/install/installing-powershell).
- [Azure CLI](/cli/azure/install-azure-cli).
- An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free).

1. Clone the [IoT Elms](https://github.com/Azure-Samples/iotedge-logging-and-monitoring-solution) repository.

   ```sh
   git clone https://github.com/Azure-Samples/iotedge-logging-and-monitoring-solution.git
1. Open a PowerShell console and run the `deploy-e2e-tutorial.ps1` script.


   ```powershell
   ./Scripts/deploy-e2e-tutorial.ps1

## Next steps

In this article, you have set up a solution with end-to-end observability capabilities for monitoring and troubleshooting. The common challenge in such solutions for IoT systems is delivering observability data from the devices to the cloud. The devices in this scenario are supposed to be online and have a stable connection to Azure Monitor, which is not always the case in real life. 

Advance to follow up articles such as [Distributed Tracing with IoT Edge](https://github.com/Azure-Samples/iotedge-logging-and-monitoring-solution/blob/main/docs/iot-edge-distributed-tracing.md) with the recommendations and techniques to handle scenarios when the devices are normally offline or have limited or restricted connection to the observability backend in the cloud. 
