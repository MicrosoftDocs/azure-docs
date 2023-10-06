---
author: dominicbetts
ms.author: dobett
ms.service: iot-develop
ms.topic: include
ms.date: 06/06/2023
---

[![Browse code](../articles/iot-central/core/media/common/browse-code.svg)](https://github.com/Azure/azure-iot-sdk-java/tree/main/iothub/device/iot-device-samples/pnp-device-sample)

## Prerequisites

To complete the steps in this article, you need the following resources:

[!INCLUDE [iot-central-prerequisites-basic](iot-central-prerequisites-basic.md)]

- A development machine with Java SE Development Kit 8 or later. For more information, see [Install the JDK](/azure/developer/java/fundamentals/java-jdk-install).

- [Apache Maven 3](https://maven.apache.org/download.cgi).

- A local copy of the [Microsoft Azure IoT SDK for Java](https://github.com/Azure/azure-iot-sdk-java) GitHub repository that contains the sample code. Use this link to download a copy of the repository: [Download ZIP](https://github.com/Azure/azure-iot-sdk-java/archive/main.zip). Then unzip the file to a suitable location on your local machine.

## Review the code

In the copy of the Microsoft Azure IoT SDK for Java you downloaded previously, open the *azure-iot-sdk-java/iothub/device/iot-device-samples/pnp-device-sample/temperature-controller-device-sample/src/main/java/samples/com/microsoft/azure/sdk/iot/device/TemperatureController.java* file in a text editor.

The sample implements the multiple-component [Temperature Controller](https://github.com/Azure/opendigitaltwins-dtdl/blob/master/DTDL/v2/samples/TemperatureController.json) Digital Twin Definition Language model.

When you run the sample to connect to IoT Central, it uses the Device Provisioning Service (DPS) to register the device and generate a connection string. The sample retrieves the DPS connection information it needs from the command-line environment.

The `main` method:

* Calls `initializeAndProvisionDevice` to set the `dtmi:com:example:TemperatureController;2` model ID, use DPS to provision and register the device, create a **DeviceClient** instance, and connect to your IoT Central application. IoT Central uses the model ID to identify or generate the device template for this device. To learn more, see [Assign a device to a device template](../articles/iot-central/core/concepts-device-templates.md#assign-a-device-to-a-device-template).
* Creates command handlers for the `getMaxMinReport` and `reboot` commands.
* Creates property update handlers for the writable `targetTemperature` properties.
* Sends initial values for the properties in the **Device Information** interface and the **Device Memory** and **Serial Number** properties.
* Starts a thread to send temperature telemetry from the two thermostats and update the `maxTempSinceLastReboot` property every five seconds.

```java
public static void main(String[] args) throws Exception {

  // ...
  
  switch (deviceSecurityType.toLowerCase())
  {
    case "dps":
    {
      if (validateArgsForDpsFlow())
      {
        initializeAndProvisionDevice();
        break;
      }
      throw new IllegalArgumentException("Required environment variables are not set for DPS flow, please recheck your environment.");
    }
    case "connectionstring":
    {
      // ...
    }
    default:
    {
      // ...
    }
  }
  
  deviceClient.subscribeToMethods(new MethodCallback(), null);
  
  deviceClient.subscribeToDesiredPropertiesAsync(
  {
  (twin, context) ->
      TwinCollection desiredProperties = twin.getDesiredProperties();
      for (String desiredPropertyKey : desiredProperties.keySet())
      {
          TargetTemperatureUpdateCallback.onPropertyChanged(new Property(desiredPropertyKey, desiredProperties.get(desiredPropertyKey)), null);
      }
  },
  null,
  (exception, context) ->
  {
      if (exception == null)
      {
          log.info("Successfully subscribed to desired properties. Getting initial state");
          deviceClient.getTwinAsync(
              (twin, getTwinException, getTwinContext) ->
              {
                  log.info("Initial twin state received");
                  log.info(twin.toString());
              },
              null);
      }
      else
      {
          log.info("Failed to subscribe to desired properties. Error code {}", exception.getStatusCode());
          System.exit(-1);
      }
  },
  null);

  updateDeviceInformation();
  sendDeviceMemory();
  sendDeviceSerialNumber();
  
  final AtomicBoolean temperatureReset = new AtomicBoolean(true);
  maxTemperature.put(THERMOSTAT_1, 0.0d);
  maxTemperature.put(THERMOSTAT_2, 0.0d);
  
  new Thread(new Runnable() {
    @SneakyThrows({InterruptedException.class, IOException.class})
    @Override
    public void run() {
      while (true) {
        if (temperatureReset.get()) {
          // Generate a random value between 5.0°C and 45.0°C for the current temperature reading for each "Thermostat" component.
          temperature.put(THERMOSTAT_1, BigDecimal.valueOf(random.nextDouble() * 40 + 5).setScale(1, RoundingMode.HALF_UP).doubleValue());
          temperature.put(THERMOSTAT_2, BigDecimal.valueOf(random.nextDouble() * 40 + 5).setScale(1, RoundingMode.HALF_UP).doubleValue());
        }

        sendTemperatureReading(THERMOSTAT_1);
        sendTemperatureReading(THERMOSTAT_2);

        temperatureReset.set(temperature.get(THERMOSTAT_1) == 0 && temperature.get(THERMOSTAT_2) == 0);
        Thread.sleep(5 * 1000);
      }
    }
  }).start();
}
```

The `initializeAndProvisionDevice` method shows how the device uses DPS to register and connect to IoT Central. The payload includes the model ID that IoT Central uses to [assign a device to a device template](../articles/iot-central/core/concepts-device-templates.md#assign-a-device-to-a-device-template):

```java
private static void initializeAndProvisionDevice() throws Exception {
  SecurityProviderSymmetricKey securityClientSymmetricKey = new SecurityProviderSymmetricKey(deviceSymmetricKey.getBytes(), registrationId);
  ProvisioningDeviceClient provisioningDeviceClient;
  ProvisioningStatus provisioningStatus = new ProvisioningStatus();

  provisioningDeviceClient = ProvisioningDeviceClient.create(globalEndpoint, scopeId, provisioningProtocol, securityClientSymmetricKey);

  AdditionalData additionalData = new AdditionalData();
  additionalData.setProvisioningPayload(com.microsoft.azure.sdk.iot.provisioning.device.plugandplay.PnpHelper.createDpsPayload(MODEL_ID));

  ProvisioningDeviceClientRegistrationResult registrationResult = provisioningDeviceClient.registerDeviceSync(additionalData);

    ClientOptions options = ClientOptions.builder().modelId(MODEL_ID).build();
    if (registrationResult.getProvisioningDeviceClientStatus() == ProvisioningDeviceClientStatus.PROVISIONING_DEVICE_STATUS_ASSIGNED) {
        System.out.println("IotHUb Uri : " + registrationResult.getIothubUri());
        System.out.println("Device ID : " + registrationResult.getDeviceId());
        String iotHubUri = registrationResult.getIothubUri();
        String deviceId = registrationResult.getDeviceId();
        log.debug("Opening the device client.");
        deviceClient = new DeviceClient(iotHubUri, deviceId, securityClientSymmetricKey, IotHubClientProtocol.MQTT, options);
        deviceClient.open(true);
    }
}
```

The `sendTemperatureTelemetry` method shows how the device sends the temperature telemetry from a component to IoT Central. This method uses the `PnpConvention` class to create the message:

```java
  private static void sendTemperatureTelemetry(String componentName) {
    String telemetryName = "temperature";
    double currentTemperature = temperature.get(componentName);

    Message message = PnpConvention.createIotHubMessageUtf8(telemetryName, currentTemperature, componentName);
    deviceClient.sendEventAsync(message, new MessageIotHubEventCallback(), message);

    // Add the current temperature entry to the list of temperature readings.
    Map<Date, Double> currentReadings;
    if (temperatureReadings.containsKey(componentName)) {
      currentReadings = temperatureReadings.get(componentName);
    } else {
      currentReadings = new HashMap<>();
    }
    currentReadings.put(new Date(), currentTemperature);
    temperatureReadings.put(componentName, currentReadings);
  }
```

The `updateMaxTemperatureSinceLastReboot` method sends a `maxTempSinceLastReboot` property update from a component to IoT Central. This method uses the `PnpConvention` class to create the patch:

```java
private static void updateMaxTemperatureSinceLastReboot(String componentName) throws IOException {
  String propertyName = "maxTempSinceLastReboot";
  double maxTemp = maxTemperature.get(componentName);

  TwinCollection reportedProperty = PnpConvention.createComponentPropertyPatch(propertyName, maxTemp, componentName);
  deviceClient.updateReportedPropertiesAsync(reportedProperty, sendReportedPropertiesResponseCallback, null);
  log.debug("Property: Update - {\"{}\": {}°C} is {}.", propertyName, maxTemp, StatusCode.COMPLETED);
}
```

The `TargetTemperatureUpdateCallback` class contains the `onPropertyChanged` method to handle writable property updates to a component from IoT Central. This method uses the `PnpConvention` class to create the response:

```java
private static class TargetTemperatureUpdateCallback
{
    final static String propertyName = "targetTemperature";
    @SneakyThrows(InterruptedException.class)
    public static void onPropertyChanged(Property property, Object context) {
        String componentName = (String) context;
        if (property.getKey().equalsIgnoreCase(componentName)) {
            double targetTemperature = (double) ((TwinCollection) property.getValue()).get(propertyName);
            log.debug("Property: Received - component=\"{}\", {\"{}\": {}°C}.", componentName, propertyName, targetTemperature);
            TwinCollection pendingPropertyPatch = PnpConvention.createComponentWritablePropertyResponse(
                    propertyName,
                    targetTemperature,
                    componentName,
                    StatusCode.IN_PROGRESS.value,
                    property.getVersion().longValue(),
                    null);
            deviceClient.updateReportedPropertiesAsync(pendingPropertyPatch, sendReportedPropertiesResponseCallback, null);
            log.debug("Property: Update - component=\"{}\", {\"{}\": {}°C} is {}", componentName, propertyName, targetTemperature, StatusCode.IN_PROGRESS);
            // Update temperature in 2 steps
            double step = (targetTemperature - temperature.get(componentName)) / 2;
            for (int i = 1; i <=2; i++) {
                temperature.put(componentName, BigDecimal.valueOf(temperature.get(componentName) + step).setScale(1, RoundingMode.HALF_UP).doubleValue());
                Thread.sleep(5 * 1000);
            }
            TwinCollection completedPropertyPatch = PnpConvention.createComponentWritablePropertyResponse(
                    propertyName,
                    temperature.get(componentName),
                    componentName,
                    StatusCode.COMPLETED.value,
                    property.getVersion().longValue(),
                    "Successfully updated target temperature.");
            deviceClient.updateReportedPropertiesAsync(completedPropertyPatch, sendReportedPropertiesResponseCallback, null);
            log.debug("Property: Update - {\"{}\": {}°C} is {}", propertyName, temperature.get(componentName), StatusCode.COMPLETED);
        } else {
            log.debug("Property: Received an unrecognized property update from service.");
        }
    }
}
```

The `MethodCallback` class contains the `onMethodInvoked` method to handle component commands called from IoT Central:

```java
private static class MethodCallback implements com.microsoft.azure.sdk.iot.device.twin.MethodCallback
{
    final String reboot = "reboot";
    final String getMaxMinReport1 = "thermostat1*getMaxMinReport";
    final String getMaxMinReport2 = "thermostat2*getMaxMinReport";
    @SneakyThrows(InterruptedException.class)
    @Override
    public DirectMethodResponse onMethodInvoked(String methodName, DirectMethodPayload methodData, Object context) {
        String jsonRequest = methodData.getPayload(String.class);
        switch (methodName) {
            case reboot:
                int delay = getCommandRequestValue(jsonRequest, Integer.class);
                log.debug("Command: Received - Rebooting thermostat (resetting temperature reading to 0°C after {} seconds).", delay);
                Thread.sleep(delay * 1000L);
                temperature.put(THERMOSTAT_1, 0.0d);
                temperature.put(THERMOSTAT_2, 0.0d);
                maxTemperature.put(THERMOSTAT_1, 0.0d);
                maxTemperature.put(THERMOSTAT_2, 0.0d);
                temperatureReadings.clear();
                return new DirectMethodResponse(StatusCode.COMPLETED.value, null);
            case getMaxMinReport1:
            case getMaxMinReport2:
                String[] words = methodName.split("\\*");
                String componentName = words[0];
                if (temperatureReadings.containsKey(componentName)) {
                    Date since = getCommandRequestValue(jsonRequest, Date.class);
                    log.debug("Command: Received - component=\"{}\", generating min, max, avg temperature report since {}", componentName, since);
                    Map<Date, Double> allReadings = temperatureReadings.get(componentName);
                    Map<Date, Double> filteredReadings = allReadings.entrySet().stream()
                            .filter(map -> map.getKey().after(since))
                            .collect(Collectors.toMap(Entry::getKey, Entry::getValue));
                    if (!filteredReadings.isEmpty()) {
                        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
                        double maxTemp = Collections.max(filteredReadings.values());
                        double minTemp = Collections.min(filteredReadings.values());
                        double avgTemp = filteredReadings.values().stream().mapToDouble(Double::doubleValue).average().orElse(Double.NaN);
                        String startTime =  sdf.format(Collections.min(filteredReadings.keySet()));
                        String endTime =  sdf.format(Collections.max(filteredReadings.keySet()));
                        String responsePayload = String.format(
                                "{\"maxTemp\": %.1f, \"minTemp\": %.1f, \"avgTemp\": %.1f, \"startTime\": \"%s\", \"endTime\": \"%s\"}",
                                maxTemp,
                                minTemp,
                                avgTemp,
                                startTime,
                                endTime);
                        log.debug("Command: MaxMinReport since {}: \"maxTemp\": {}°C, \"minTemp\": {}°C, \"avgTemp\": {}°C, \"startTime\": {}, \"endTime\": {}",
                                since,
                                maxTemp,
                                minTemp,
                                avgTemp,
                                startTime,
                                endTime);
                        return new DirectMethodResponse(StatusCode.COMPLETED.value, responsePayload);
                    }
                    log.debug("Command: component=\"{}\", no relevant readings found since {}, cannot generate any report.", componentName, since);
                    return new DirectMethodResponse(StatusCode.NOT_FOUND.value, null);
                }
                log.debug("Command: component=\"{}\", no temperature readings sent yet, cannot generate any report.", componentName);
                return new DirectMethodResponse(StatusCode.NOT_FOUND.value, null);
            default:
                log.debug("Command: command=\"{}\" is not implemented, no action taken.", methodName);
                return new DirectMethodResponse(StatusCode.NOT_FOUND.value, null);
        }
    }
}
```

## Get connection information

[!INCLUDE [iot-central-connection-configuration](iot-central-connection-configuration.md)]

On Windows, navigate to the root folder of the Azure IoT SDK for Java repository you downloaded.

Run the following command to build the sample application:

```cmd/sh
mvn install -T 2C -DskipTests
```

## Run the code

To run the sample application, open a command-line environment and navigate to the folder *azure-iot-sdk-java/iothub/device/iot-device-samples/pnp-device-sample/temperature-controller-device-sample* folder that contains the *src* folder with the *TemperatureController.java* sample file.

[!INCLUDE [iot-central-connection-environment](iot-central-connection-environment.md)]

Run the sample:

```cmd/sh
mvn exec:java -Dexec.mainClass="samples.com.microsoft.azure.sdk.iot.device.TemperatureController"
```

The following output shows the device registering and connecting to IoT Central. The sample starts sending telemetry:

```output
2021-03-30 15:33:25.138 DEBUG TemperatureController:123 - Initialize the device client.
Waiting for Provisioning Service to register
Waiting for Provisioning Service to register
IotHUb Uri : iotc-60a.....azure-devices.net
Device ID : sample-device-01
2021-03-30 15:33:38.294 DEBUG TemperatureController:247 - Opening the device client.
2021-03-30 15:33:38.307 INFO  ExponentialBackoffWithJitter:98 - NOTE: A new instance of ExponentialBackoffWithJitter has been created with the following properties. Retry Count: 2147483647, Min Backoff Interval: 100, Max Backoff Interval: 10000, Max Time Between Retries: 100, Fast Retry Enabled: true
2021-03-30 15:33:38.321 INFO  ExponentialBackoffWithJitter:98 - NOTE: A new instance of ExponentialBackoffWithJitter has been created with the following properties. Retry Count: 2147483647, Min Backoff Interval: 100, Max Backoff Interval: 10000, Max Time Between Retries: 100, Fast Retry Enabled: true
2021-03-30 15:33:38.427 DEBUG MqttIotHubConnection:274 - Opening MQTT connection...
2021-03-30 15:33:38.427 DEBUG Mqtt:123 - Sending MQTT CONNECT packet...
2021-03-30 15:33:44.628 DEBUG Mqtt:126 - Sent MQTT CONNECT packet was acknowledged
2021-03-30 15:33:44.630 DEBUG Mqtt:256 - Sending MQTT SUBSCRIBE packet for topic devices/sample-device-01/messages/devicebound/#
2021-03-30 15:33:44.731 DEBUG Mqtt:261 - Sent MQTT SUBSCRIBE packet for topic devices/sample-device-01/messages/devicebound/# was acknowledged
2021-03-30 15:33:44.733 DEBUG MqttIotHubConnection:279 - MQTT connection opened successfully
2021-03-30 15:33:44.733 DEBUG IotHubTransport:302 - The connection to the IoT Hub has been established
2021-03-30 15:33:44.734 INFO  IotHubTransport:1429 - Updating transport status to new status CONNECTED with reason CONNECTION_OK
2021-03-30 15:33:44.735 DEBUG IotHubTransport:1439 - Invoking connection status callbacks with new status details
2021-03-30 15:33:44.739 DEBUG IotHubTransport:394 - Client connection opened successfully
2021-03-30 15:33:44.740 INFO  DeviceClient:438 - Device client opened successfully
2021-03-30 15:33:44.740 DEBUG TemperatureController:152 - Set handler for "reboot" command.
2021-03-30 15:33:44.742 DEBUG TemperatureController:153 - Set handler for "getMaxMinReport" command.
2021-03-30 15:33:44.774 INFO  IotHubTransport:489 - Message was queued to be sent later ( Message details: Correlation Id [029d30d4-acbd-462d-b155-82d53ce7786c] Message Id [1b2adf93-ba81-41e4-b8c7-7c90c8b0d6a1] Device Operation Type [DEVICE_OPERATION_METHOD_SUBSCRIBE_REQUEST] )
2021-03-30 15:33:44.774 DEBUG TemperatureController:156 - Set handler to receive "targetTemperature" updates.
2021-03-30 15:33:44.775 INFO  IotHubTransport:1344 - Sending message ( Message details: Correlation Id [029d30d4-acbd-462d-b155-82d53ce7786c] Message Id [1b2adf93-ba81-41e4-b8c7-7c90c8b0d6a1] Device Operation Type [DEVICE_OPERATION_METHOD_SUBSCRIBE_REQUEST] )
2021-03-30 15:33:44.779 DEBUG Mqtt:256 - Sending MQTT SUBSCRIBE packet for topic $iothub/methods/POST/#
2021-03-30 15:33:44.793 INFO  IotHubTransport:489 - Message was queued to be sent later ( Message details: Correlation Id [f2f9ed95-9778-44f2-b9ec-f60c84061251] Message Id [0d5abdb2-6460-414c-a10e-786ee24cacff] Device Operation Type [DEVICE_OPERATION_TWIN_SUBSCRIBE_DESIRED_PROPERTIES_REQUEST] )
2021-03-30 15:33:44.794 INFO  IotHubTransport:489 - Message was queued to be sent later ( Message details: Correlation Id [417d659a-7324-43fa-84eb-8a3f3d07963c] Message Id [55532cad-8a5a-489f-9aa8-8f0e5bc21541] Request Id [0] Device Operation Type [DEVICE_OPERATION_TWIN_GET_REQUEST] )
2021-03-30 15:33:44.819 INFO  IotHubTransport:489 - Message was queued to be sent later ( Message details: Correlation Id [d46a0d8a-8a18-4014-abeb-768bd9b17ad2] Message Id [780abc81-ce42-4e5f-aa80-e4785883604e] Device Operation Type [DEVICE_OPERATION_TWIN_SUBSCRIBE_DESIRED_PROPERTIES_REQUEST] )
2021-03-30 15:33:44.881 DEBUG Mqtt:261 - Sent MQTT SUBSCRIBE packet for topic $iothub/methods/POST/# was acknowledged
2021-03-30 15:33:44.882 INFO  IotHubTransport:1344 - Sending message ( Message details: Correlation Id [f2f9ed95-9778-44f2-b9ec-f60c84061251] Message Id [0d5abdb2-6460-414c-a10e-786ee24cacff] Device Operation Type [DEVICE_OPERATION_TWIN_SUBSCRIBE_DESIRED_PROPERTIES_REQUEST] )
2021-03-30 15:33:44.882 DEBUG Mqtt:256 - Sending MQTT SUBSCRIBE packet for topic $iothub/twin/res/#
2021-03-30 15:33:44.893 INFO  IotHubTransport:489 - Message was queued to be sent later ( Message details: Correlation Id [a77b1c02-f043-4477-b610-e31a774772c0] Message Id [2e2f6bee-c480-42cf-ac31-194118930846] Request Id [1] Device Operation Type [DEVICE_OPERATION_TWIN_UPDATE_REPORTED_PROPERTIES_REQUEST] )
2021-03-30 15:33:44.904 DEBUG TemperatureController:423 - Property: Update - component = "deviceInformation" is COMPLETED.
2021-03-30 15:33:44.915 INFO  IotHubTransport:489 - Message was queued to be sent later ( Message details: Correlation Id [bbb7e3cf-3550-4fdf-90f9-0787740f028a] Message Id [e06ac385-ae0d-46dd-857a-d9725707527a] )
2021-03-30 15:33:44.915 DEBUG TemperatureController:434 - Telemetry: Sent - {"workingSet": 1024.0KiB }
2021-03-30 15:33:44.915 INFO  IotHubTransport:489 - Message was queued to be sent later ( Message details: Correlation Id [6dbef765-cc9a-4e72-980a-2fe5b0cd77e1] Message Id [49bbad33-09bf-417a-9d6e-299ba7b7c562] Request Id [2] Device Operation Type [DEVICE_OPERATION_TWIN_UPDATE_REPORTED_PROPERTIES_REQUEST] )
2021-03-30 15:33:44.916 DEBUG TemperatureController:442 - Property: Update - {"serialNumber": SR-123456} is COMPLETED
2021-03-30 15:33:44.927 INFO  IotHubTransport:489 - Message was queued to be sent later ( Message details: Correlation Id [86787c32-87a5-4c49-9083-c7f2b17446a7] Message Id [0a45fa0c-a467-499d-b214-9bb5995772ba] )
2021-03-30 15:33:44.927 DEBUG TemperatureController:461 - Telemetry: Sent - {"temperature": 5.8°C} with message Id 0a45fa0c-a467-499d-b214-9bb5995772ba.
```

[!INCLUDE [iot-central-monitor-thermostat](iot-central-monitor-thermostat.md)]

You can see how the device responds to commands and property updates:

```output
2021-03-30 15:43:57.133 DEBUG TemperatureController:309 - Command: Received - component="thermostat1", generating min, max, avg temperature report since Tue Mar 30 06:00:00 BST 2021
2021-03-30 15:43:57.153 DEBUG TemperatureController:332 - Command: MaxMinReport since Tue Mar 30 06:00:00 BST 2021: "maxTemp": 35.6°C, "minTemp": 35.6°C, "avgTemp": 35.6°C, "startTime": 2021-03-30T15:43:41Z, "endTime": 2021-03-30T15:43:56Z
2021-03-30 15:43:57.394 DEBUG TemperatureController:502 - Command - Response from IoT Hub: command name=null, status=OK_EMPTY


...

2021-03-30 15:48:47.808 DEBUG TemperatureController:372 - Property: Received - component="thermostat2", {"targetTemperature": 67.0°C}.
2021-03-30 15:48:47.837 DEBUG TemperatureController:382 - Property: Update - component="thermostat2", {"targetTemperature": 67.0°C} is IN_PROGRESS

```
