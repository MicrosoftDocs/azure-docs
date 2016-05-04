<properties
 pageTitle="Remote Monitoring preconfigured solution walkthrough | Microsoft Azure"
 description="A description of the Azure IoT preconfigured solution remote monitoring and its architecture."
 services=""
 suite="iot-suite"
 documentationCenter=""
 authors="stevehob"
 manager="timlt"
 editor=""/>

<tags
 ms.service="iot-suite"
 ms.devlang="na"
 ms.topic="get-started-article"
 ms.tgt_pltfrm="na"
 ms.workload="na"
 ms.date="03/02/2016"
 ms.author="stevehob"/>

# Remote monitoring preconfigured solution walkthrough

## Introduction

The IoT Suite remote monitoring preconfigured solution is a base end-to-end monitoring solution for a business scenario that operates multiple machines in remote locations. The solution combines key Azure IoT Suite services to provide a generic implementation of the business scenario and is a starting point for customers who plan to implement this type of IoT solution to meet their own specific business requirements.

## Logical architecture

The following diagram outlines the logical components of the preconfigured solution:

![](media/iot-suite-remote-monitoring-sample-walkthrough/remote-monitoring-architecture.png)


### Simulated devices

In the preconfigured solution, the simulated device represents a cooling device (such as a building air conditioner or facility air handling unit). Each simulated device sends the following telemetry messages to IoT Hub:


| Message  | Description |
|----------|-------------|
| Startup  | When the device starts, it sends a **device-info** message containing information about itself such as its device id, device metadata, a list of commands the device supports, and the current configuration of the device. |


The simulated devices send the following device properties as metadata:

| Property               |  Purpose |
|------------------------|--------- |
| Device ID              | Id that is either provided or assigned when a device is created in the solution. |
| Manufacturer           | Device manufacturer |
| Model Number           | Model number of the device |
| Serial Number          | Serial number of the device |
| Firmware               | Current version of firmware on the device |
| Platform               | Platform architecture of the device |
| Processor              | Processor running the device |
| Installed RAM          | Amount of RAM installed on the device |
| Hub Enabled State      | IoT Hub state property of the device |
| Created Time           | Time the device was created in the solution |
| Updated Time           | Last time properties were updated for the device |
| Latitude               | Latitude location of the device |
| Longitude              | Longitude location of the device |

The simulator seeds these properties in simulated devices with sample values.  Each time the simulator initializes a simulated device, the device posts the pre-defined metadata to IoT Hub. Note that this overwrites any metadata updates made in the device portal.


The simulated devices can handle the following commands sent from an IoT hub:

| Command                | Description                                         |
|------------------------|-----------------------------------------------------|
| PingDevice             | Sends a _ping_ to the device to check it is alive   |
| StartTelemetry         | Starts the device sending telemetry 				   |
| StopTelemetry          | Stops the device from sending telemetry             |
| ChangeSetPointTemp     | Changes the set point value around which the random data is generated |
| DiagnosticTelemetry    | Triggers the device simulator to send an additional telemetry value (externalTemp) |
| ChangeDeviceState      | Changes an extended state property for the device and sends the device info message from  the device |


The device command acknowledgment is provided through the IoT hub.


### Azure Stream Analytics jobs


**Job 1: Device Info** filters device information messages from the incoming message stream and sends them to an Event Hub endpoint. A device sends device information messages at start up and in response to a **SendDeviceInfo** command. This job uses the following query definition:

```
SELECT * FROM DeviceDataStream Partition By PartitionId WHERE  ObjectType = 'DeviceInfo'
```

**Job 2: Rules** evaluates incoming temperature and humidity telemetry values against per-device thresholds. Threshold values are set in the rules editor included in the solution. Each device/value pair is stored by timestamp in a blob which is read into Stream Analytics as **Reference Data**. The job compares any non-empty value against the set threshold for the device. If it exceeds the '>' condition, the job will output an **alarm** event that indicates that the threshold was exceeded and provides the device, value, and timestamp values. This job uses the following query definition:

```
WITH AlarmsData AS 
(
SELECT
     Stream.DeviceID,
     'Temperature' as ReadingType,
     Stream.Temperature as Reading,
     Ref.Temperature as Threshold,
     Ref.TemperatureRuleOutput as RuleOutput,
     Stream.EventEnqueuedUtcTime AS [Time]
FROM IoTTelemetryStream Stream
JOIN DeviceRulesBlob Ref ON Stream.DeviceID = Ref.DeviceID
WHERE
     Ref.Temperature IS NOT null AND Stream.Temperature > Ref.Temperature

UNION ALL

SELECT
     Stream.DeviceID,
     'Humidity' as ReadingType,
     Stream.Humidity as Reading,
     Ref.Humidity as Threshold,
     Ref.HumidityRuleOutput as RuleOutput,
     Stream.EventEnqueuedUtcTime AS [Time]
FROM IoTTelemetryStream Stream
JOIN DeviceRulesBlob Ref ON Stream.DeviceID = Ref.DeviceID
WHERE
     Ref.Humidity IS NOT null AND Stream.Humidity > Ref.Humidity
)

SELECT *
INTO DeviceRulesMonitoring
FROM AlarmsData

SELECT *
INTO DeviceRulesHub
FROM AlarmsData
```

**Job 3: Telemetry** operates on the incoming device telemetry stream in two ways. The first sends all telemetry messages from the devices to persistent blob storage. The second computes average, minimum, and maximum humidity values over a five minute sliding window. This data is also sent to blob storage. This job uses the following query definition:

```
WITH 
    [StreamData]
AS (
    SELECT
        *
    FROM 
      [IoTHubStream] 
    WHERE
        [ObjectType] IS NULL -- Filter out device info and command responses
) 

SELECT
    *
INTO
    [Telemetry]
FROM
    [StreamData]

SELECT
    DeviceId,
    AVG (Humidity) AS [AverageHumidity], 
    MIN(Humidity) AS [MinimumHumidity], 
    MAX(Humidity) AS [MaxHumidity], 
    5.0 AS TimeframeMinutes 
INTO
    [TelemetrySummary]
FROM
    [StreamData]
WHERE
    [Humidity] IS NOT NULL
GROUP BY
    DeviceId, 
    SlidingWindow (mi, 5)
```

### Event Processor

The **Event Processor** handles device information messages and command responses. It uses:

- Device information messages to update the device registry (stored in the DocumentDB database) with the current device information.
- Command response messages to update the device command history (stored in the DocumentDB database).

## Let's start walking

This section walks you through the components of the solution, describes the intended use case, and provides examples.

### Remote Monitoring Dashboard
This page in the web application uses PowerBI javascript controls (See [PowerBI-visuals repo](https://www.github.com/Microsoft/PowerBI-visuals)) to visualize the output data from the Stream Analytics jobs in blob storage.


### Device Administration Portal

This web app enables you to:

- Provision a new device which sets the unique device id and generates the authentication key.
- Manage device properties which includes viewing existing properties and updating with new properties.
- Send commands to a device.
- View the command history for a device.

### Observing the behavior of the cloud solution
You can view your provisioned resources by going to the [Azure portal](https://portal.azure.com) and navigating to the resource group with the solution name you specified.

![](media/iot-suite-remote-monitoring-sample-walkthrough/azureportal_01.png)

When you first run the sample, there are four preconfigured, simulated devices:

![](media/iot-suite-remote-monitoring-sample-walkthrough/solutionportal_01.png)

You can use the Device Administration portal to add a new simulated device:

![](media/iot-suite-remote-monitoring-sample-walkthrough/solutionportal_02.png)

Initially, the status of the new device in the Device Administration portal is **Pending**:

![](media/iot-suite-remote-monitoring-sample-walkthrough/solutionportal_03.png)

When the app has finished deploying the simulated device, you will see the status of the device change to **Running** in the Device Administration portal as shown in the following screenshot. The **DeviceInfo** Stream Analytics job sends device status information from the device to the Device Administration portal.

![](media/iot-suite-remote-monitoring-sample-walkthrough/solutionportal_04.png)

Using the solution portal you can send commands such as **ChangeSetPointTemp** to the device:

![](media/iot-suite-remote-monitoring-sample-walkthrough/solutionportal_05.png)

When the device reports that it has executed the command successfully, the status changes to **Success**:

![](media/iot-suite-remote-monitoring-sample-walkthrough/solutionportal_06.png)

Using the solution portal you can search for devices with specific characteristics such as a model number:

![](media/iot-suite-remote-monitoring-sample-walkthrough/solutionportal_07.png)

You can disable a device, and after it is disabled you can remove it:

![](media/iot-suite-remote-monitoring-sample-walkthrough/solutionportal_08.png)


## Next steps

The following TechNet blog posts provide additional detail about the remote monitoring preconfigured solution:

- [IoT Suite - Under The Hood - Remote Monitoring](http://social.technet.microsoft.com/wiki/contents/articles/32941.iot-suite-under-the-hood-remote-monitoring.aspx)
- [IoT Suite - Remote Monitoring - Adding Live and Simulated Devices](http://social.technet.microsoft.com/wiki/contents/articles/32975.iot-suite-remote-monitoring-adding-live-and-simulated-devices.aspx)