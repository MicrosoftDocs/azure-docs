---
title: Connect a device using C on Windows | Microsoft Docs
description: Describes how to connect a device to the Azure IoT Suite preconfigured remote monitoring solution using an application written in C running on Windows.
services: ''
suite: iot-suite
documentationcenter: na
author: dominicbetts
manager: timlt
editor: ''

ms.assetid: 34e39a58-2434-482c-b3fa-29438a0c05e8
ms.service: iot-suite
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/17/2017
ms.author: dobett

---
# Connect your device to the remote monitoring preconfigured solution (Windows)
[!INCLUDE [iot-suite-selector-connecting](../../includes/iot-suite-selector-connecting.md)]

## Create a C sample solution on Windows
The following steps show you how to use Visual Studio to create a client application written in C that communicates with the remote monitoring preconfigured solution.

Create a starter project in Visual Studio 2015 and add the IoT Hub device client NuGet packages:

1. In Visual Studio 2015, create a C console application using the Visual C++ **Win32 Console Application** template. Name the project **RMDevice**.
2. On the **Applications Settings** page in the **Win32 Application Wizard**, ensure that **Console application** is selected, and uncheck **Precompiled header** and **Security Development Lifecycle (SDL) checks**.
3. In **Solution Explorer**, delete the files stdafx.h, targetver.h, and stdafx.cpp.
4. In **Solution Explorer**, rename the file RMDevice.cpp to RMDevice.c.
5. In **Solution Explorer**, right-click on the **RMDevice** project and then click **Manage NuGet packages**. Click **Browse**, then search for and install the following NuGet packages into the project:
   
   * Microsoft.Azure.IoTHub.Serializer
   * Microsoft.Azure.IoTHub.IoTHubClient
   * Microsoft.Azure.IoTHub.MqttTransport
6. In **Solution Explorer**, right-click on the **RMDevice** project and then click **Properties** to open the project's **Property Pages** dialog box. For details, see [Setting Visual C++ Project Properties][lnk-c-project-properties]. 
7. Click the **Linker** folder, then click the **Input** property page.
8. Add **crypt32.lib** to the **Additional Dependencies** property. Click **OK** and then **OK** again to save the project property values.

Add the Parson json library to the **RMDevice** project:

1. In a suitable folder on your computer, clone the Parson GitHub repository using the following command:

    ```
    git clone https://github.com/kgabis/parson.git
    ```

1. Copy the parson.h and parson.c files from the local copy of the Parson repository to the **RMDevice** project folder.

1. In Visual Studio, right-click the **RMDevice** project, click **Add**, and then click **Existing Item**.

1. In the **Add Existing Item** dialog, select the parson.h and parson.c files in the **RMDevice** project folder. Then click **Add** to add these two files to your project.

## Specify the behavior of the IoT Hub device
The IoT Hub client libraries use a model to specify the format of the messages the device exchanges with IoT Hub.

1. In Visual Studio, open the RMDevice.c file. Replace the existing `#include` statements with the following code:
   
    ```
    #include "iothubtransportmqtt.h"
    #include "schemalib.h"
    #include "iothub_client.h"
    #include "serializer_devicetwin.h"
    #include "schemaserializer.h"
    #include "azure_c_shared_utility/threadapi.h"
    #include "azure_c_shared_utility/platform.h"
    #include "parson.h"
    ```

    > [!NOTE]
    > You can verify that your project now has the correct dependencies by building it.

2. Add the following variable declarations after the `#include` statements. Replace the placeholder values [Device Id] and [Device Key] with values you noted for your device in the remote monitoring solution dashboard. Use the IoT Hub Hostname from the solution dashboard to replace [IoTHub Name]. For example, if your IoT Hub Hostname is **contoso.azure-devices.net**, replace [IoTHub Name] with **contoso**:
   
    ```
    static const char* deviceId = "[Device Id]";
    static const char* connectionString = "HostName=[IoTHub Name].azure-devices.net;DeviceId=[Device Id];SharedAccessKey=[Device Key]";
    ```
3. Add the following code to define the model that enables the device to communicate with IoT Hub. This model specifies that the device:

   - Can send temperature, external temperature, humidity, and a device id as telemetry.
   - Can send metadata about the device to IoT Hub, including a list of commands that the device supports. This device responds to the commands **SetTemperature** and **SetHumidity**.
   - Can send reported properties, to the device twin in IoT Hub. These reported properties are grouped into configuration, location, and system properties.
   - Can receive and act on desired properties sent from the device twin in IoT Hub.
   - Can respond to the **Reboot** and **FirmwareUpdate** direct methods invoked through the device twin in the IoT Hub. The device sends information about the direct methods it supports using reported properties.
   
    ```
    // Define the Model
    BEGIN_NAMESPACE(Contoso);

    DECLARE_STRUCT(SystemProperties,
      ascii_char_ptr, Manufacturer,
      ascii_char_ptr, FirmwareVersion,
      ascii_char_ptr, InstalledRAM,
      ascii_char_ptr, ModelNumber,
      ascii_char_ptr, Platform,
      ascii_char_ptr, Processor,
      ascii_char_ptr, SerialNumber
    );

    DECLARE_STRUCT(DeviceProperties,
      ascii_char_ptr, DeviceID,
      _Bool, HubEnabledState
    );

    DECLARE_STRUCT(LocationProperties,
      double, Latitude,
      double, Longitude
    );

    DECLARE_MODEL(DesiredProperties,
      WITH_DESIRED_PROPERTY(double, SetPointTemp, onDesiredSetPointTemp),
      WITH_DESIRED_PROPERTY(uint8_t, TelemetryInterval, onDesiredTelemetryInterval)
    );

    DECLARE_MODEL(ConfigProperties,
      WITH_REPORTED_PROPERTY(double, SetPointTemp),
      WITH_REPORTED_PROPERTY(uint8_t, TelemetryInterval)
    );

    DECLARE_MODEL(MethodProperties,
      WITH_REPORTED_PROPERTY(ascii_char_ptr, Name),
      WITH_REPORTED_PROPERTY(ascii_char_ptr_no_quotes, Parameters),
      WITH_REPORTED_PROPERTY(ascii_char_ptr, Description)
    );

    DECLARE_MODEL(SupportedMethodProperties,
      WITH_REPORTED_PROPERTY(MethodProperties, Reboot),
      WITH_REPORTED_PROPERTY(MethodProperties, FirmwareUpdate)
      );


    DECLARE_DEVICETWIN_MODEL(Thermostat,
      /* Event data (temperature, external temperature and humidity) */
      WITH_DATA(double, Temperature),
      WITH_DATA(double, ExternalTemperature),
      WITH_DATA(double, Humidity),
      WITH_DATA(ascii_char_ptr, DeviceId),

      /* Device Info - This is command metadata + some extra fields */
      WITH_DATA(ascii_char_ptr, ObjectType),
      WITH_DATA(_Bool, IsSimulatedDevice),
      WITH_DATA(ascii_char_ptr, Version),
      WITH_DATA(DeviceProperties, DeviceProperties),
      WITH_DATA(ascii_char_ptr_no_quotes, Commands),
      /* Commands implemented by the device */
      WITH_ACTION(SetTemperature, double, Temperature),
      WITH_ACTION(SetHumidity, double, Humidity),

      /* Device twin properties */
      WITH_REPORTED_PROPERTY(ConfigProperties, Config),
      WITH_REPORTED_PROPERTY(LocationProperties, Location),
      WITH_REPORTED_PROPERTY(SystemProperties, System),

      WITH_DESIRED_PROPERTY(double, SetPointTemp, onDesiredSetPointTemp),
      WITH_DESIRED_PROPERTY(uint8_t, TelemetryInterval, onDesiredTelemetryInterval),
      WITH_DESIRED_PROPERTY(double, Latitude, onDesiredLatitude),

      /* Direct methods implemented by the device */
      WITH_METHOD(Reboot),
      WITH_METHOD(FirmwareUpdate, ascii_char_ptr, FWPackageURI),

      /* Register direct methods */
      WITH_REPORTED_PROPERTY(SupportedMethodProperties, SupportedMethods)

    );

    END_NAMESPACE(Contoso);

    ```

## Implement the behavior of the device
Now add code that implements the behavior defined in the model.

1. Add the following functions that execute when the device receives the **SetTemperature** and **SetHumidity** commands from the solution dashboard:
   
    ```
    EXECUTE_COMMAND_RESULT SetTemperature(Thermostat* thermostat, int temperature)
    {
      (void)printf("Received temperature %d\r\n", temperature);
      thermostat->Temperature = temperature;
      return EXECUTE_COMMAND_SUCCESS;
    }
   
    EXECUTE_COMMAND_RESULT SetHumidity(Thermostat* thermostat, int humidity)
    {
      (void)printf("Received humidity %d\r\n", humidity);
      thermostat->Humidity = humidity;
      return EXECUTE_COMMAND_SUCCESS;
    }
    ```

1. Add the following functions that handle the desired properties set in the solution dashboard. These desired properties are defined in the model:

    ```
    void onDesiredLatitude(void* argument)
    {
      Thermostat* thermostat = argument;
      printf("Received a new desired_Latitude = %f\r\n", thermostat->Latitude);
    }

    void onDesiredSetPointTemp(void* argument)
    {
      Thermostat* thermostat = argument;
      printf("Received a new desired_SetPointTemp = %f\r\n", thermostat->SetPointTemp);
    }

    void onDesiredTelemetryInterval(void* argument)
    {
      Thermostat* thermostat = argument;
      printf("Received a new desired_TelemetryInterval = %d\r\n", thermostat->TelemetryInterval);
    }
    ```

1. Add the following functions that handle thedirect methods invoked through the IoT hub. These direct methods are defined in the model:

    ```
    METHODRETURN_HANDLE Reboot(Thermostat* thermostat)
    {
      (void)(thermostat);

      METHODRETURN_HANDLE result = MethodReturn_Create(201, "\"Rebooting\"");
      printf("Received reboot request\r\n");
      return result;
    }

    METHODRETURN_HANDLE FirmwareUpdate(Thermostat* thermostat, ascii_char_ptr FWUpdateURI)
    {
      (void)(thermostat);

      METHODRETURN_HANDLE result = MethodReturn_Create(201, "\"Processing Firmware Update\"");
      printf("Recieved firmware update request. Use package at: %s\r\n", FWUpdateURI);
      return result;
    }
    ```

1. Add the following function that sends a message to preconfigured solution:
   
    ```
    static void sendMessage(IOTHUB_CLIENT_HANDLE iotHubClientHandle, const unsigned char* buffer, size_t size)
    {
      IOTHUB_MESSAGE_HANDLE messageHandle = IoTHubMessage_CreateFromByteArray(buffer, size);
      if (messageHandle == NULL)
      {
        printf("unable to create a new IoTHubMessage\r\n");
      }
      else
      {
        if (IoTHubClient_SendEventAsync(iotHubClientHandle, messageHandle, NULL, NULL) != IOTHUB_CLIENT_OK)
        {
          printf("failed to hand over the message to IoTHubClient");
        }
        else
        {
          printf("IoTHubClient accepted the message for delivery\r\n");
        }
   
        IoTHubMessage_Destroy(messageHandle);
      }
    free((void*)buffer);
    }
    ```

1. Add the following callback handler that runs when the device has sent new reported property values to the preconfigured solution:

    ```
    void deviceTwinCallback(int status_code, void* userContextCallback)
    {
      (void)(userContextCallback);
      printf("IoTHub: reported properties delivered with status_code = %u\n", status_code);
    }
    ```

1. Add the following function that hooks up your device code with the serialization library in the SDK:

    ```
    static IOTHUBMESSAGE_DISPOSITION_RESULT IoTHubMessage(IOTHUB_MESSAGE_HANDLE message, void* userContextCallback)
    {
      IOTHUBMESSAGE_DISPOSITION_RESULT result;
      const unsigned char* buffer;
      size_t size;
      if (IoTHubMessage_GetByteArray(message, &buffer, &size) != IOTHUB_MESSAGE_OK)
      {
        printf("unable to IoTHubMessage_GetByteArray\r\n");
        result = EXECUTE_COMMAND_ERROR;
      }
      else
      {
        /*buffer is not zero terminated*/
        char* temp = malloc(size + 1);
        if (temp == NULL)
        {
          printf("failed to malloc\r\n");
          result = EXECUTE_COMMAND_ERROR;
        }
        else
        {
          memcpy(temp, buffer, size);
          temp[size] = '\0';
          EXECUTE_COMMAND_RESULT executeCommandResult = EXECUTE_COMMAND(userContextCallback, temp);
          result =
            (executeCommandResult == EXECUTE_COMMAND_ERROR) ? IOTHUBMESSAGE_ABANDONED :
            (executeCommandResult == EXECUTE_COMMAND_SUCCESS) ? IOTHUBMESSAGE_ACCEPTED :
            IOTHUBMESSAGE_REJECTED;
          free(temp);
        }
      }
      return result;
    }
    ```

4. Add the following function to connect to the preconfigured solution in the cloud, and exchange data. This function performs the following steps:

    - Initializes the platform.
    - Registers the Contoso namespace with the serialization library.
    - Initializes the client with the device connection string.
    - Creates and sends reported property values.
    - Sends metadata and information about supported commands.
    - Creates a loop to send telemetry every second.
    - Deinitializes all resources.

      ```
      void remote_monitoring_run(void)
      {
        if (platform_init() != 0)
        {
          printf("Failed to initialize the platform.\n");
        }
        else
        {
          if (SERIALIZER_REGISTER_NAMESPACE(Contoso) == NULL)
          {
            LogError("unable to SERIALIZER_REGISTER_NAMESPACE");
          }
          else
          {
            IOTHUB_CLIENT_HANDLE iotHubClientHandle = IoTHubClient_CreateFromConnectionString(connectionString, MQTT_Protocol);
            if (iotHubClientHandle == NULL)
            {
              (void)printf("Failure in IoTHubClient_CreateFromConnectionString");
            }
            else
            {
              Thermostat* thermostat = IoTHubDeviceTwin_CreateThermostat(iotHubClientHandle);
              if (thermostat == NULL)
              {
                printf("Failure in IoTHubDeviceTwin_CreateThermostat");
              }
              else
              {
                thermostat->Config.SetPointTemp = 55.5;
                thermostat->Config.TelemetryInterval = 3;
                thermostat->Location.Latitude = 47.642877;
                thermostat->Location.Longitude = -122.125497;
                thermostat->System.Manufacturer = "Domco Inc.";
                thermostat->System.FirmwareVersion = "2.22";
                thermostat->System.InstalledRAM = "8 MB";
                thermostat->System.ModelNumber = "DB-14";
                thermostat->System.Platform = "Plat 9.75";
                thermostat->System.Processor = "i3-7";
                thermostat->System.SerialNumber = "SER21";
                thermostat->SupportedMethods.Reboot.Name = "Reboot";
                thermostat->SupportedMethods.Reboot.Description = "Reboot the device";
                thermostat->SupportedMethods.Reboot.Parameters = "{}";
                thermostat->SupportedMethods.FirmwareUpdate.Name = "FirmwareUpdate";
                thermostat->SupportedMethods.FirmwareUpdate.Description = "Provide URI for firmware update package";
                thermostat->SupportedMethods.FirmwareUpdate.Parameters = "{\"FWPackageURI\": {\"Name\": \"FWPackageURI\", \"Type\": \"string\"}}";

                if (IoTHubDeviceTwin_SendReportedStateThermostat(thermostat, deviceTwinCallback, NULL) != IOTHUB_CLIENT_OK)
                {
                  (void)printf("Failed sending serialized reported state\n");
                }
                else
                {
                  printf("Reported state will be sent to IoTHub\n");
  
                  STRING_HANDLE commandsMetadata;

                  if (IoTHubClient_SetMessageCallback(iotHubClientHandle, IoTHubMessage, thermostat) != IOTHUB_CLIENT_OK)
                  {
                    printf("unable to IoTHubClient_SetMessageCallback\r\n");
                  }
                  else
                  {
                    thermostat->ObjectType = "DeviceInfo";
                    thermostat->IsSimulatedDevice = 0;
                    thermostat->Version = "1.0";
                    thermostat->DeviceProperties.HubEnabledState = 1;
                    thermostat->DeviceProperties.DeviceID = (char*)deviceId;

                    commandsMetadata = STRING_new();
                    if (commandsMetadata == NULL)
                    {
                      (void)printf("Failed on creating string for commands metadata\r\n");
                    }
                    else
                    {
                      if (SchemaSerializer_SerializeCommandMetadata(GET_MODEL_HANDLE(Contoso, Thermostat), commandsMetadata) != SCHEMA_SERIALIZER_OK)
                      {
                        (void)printf("Failed serializing commands metadata\r\n");
                      }
                      else
                      {
                        unsigned char* buffer;
                        size_t bufferSize;
                        thermostat->Commands = (char*)STRING_c_str(commandsMetadata);

                        if (SERIALIZE(&buffer, &bufferSize, thermostat->ObjectType, thermostat->Version, thermostat->IsSimulatedDevice, thermostat->DeviceProperties, thermostat->Commands) != CODEFIRST_OK)
                        {
                          (void)printf("Failed serializing\r\n");
                        }
                        else
                        {
                          sendMessage(iotHubClientHandle, buffer, bufferSize);
                        }

                      }

                      STRING_delete(commandsMetadata);
                    }

                    thermostat->Temperature = 50;
                    thermostat->ExternalTemperature = 55;
                    thermostat->Humidity = 50;
                    thermostat->DeviceId = (char*)deviceId;

                    while (1)
                    {
                      unsigned char*buffer;
                      size_t bufferSize;

                      (void)printf("Sending sensor value Temperature = %f, Humidity = %f\r\n", thermostat->Temperature, thermostat->Humidity);

                      if (SERIALIZE(&buffer, &bufferSize, thermostat->DeviceId, thermostat->Temperature, thermostat->Humidity, thermostat->ExternalTemperature) != CODEFIRST_OK)
                      {
                        (void)printf("Failed sending sensor value\r\n");
                      }
                      else
                      {
                        sendMessage(iotHubClientHandle, buffer, bufferSize);
                      }

                      ThreadAPI_Sleep(1000);
                    }
                  }
                  IoTHubDeviceTwin_DestroyThermostat(thermostat);
                }
              }
              IoTHubClient_Destroy(iotHubClientHandle);
            }
            serializer_deinit();
          }
        }
        platform_deinit();
      }
      ```
   
    For reference, here is a sample **DeviceInfo** message sent to the preconfigured solution at startup:
   
    ```
    {
      "ObjectType":"DeviceInfo",
      "Version":"1.0",
      "IsSimulatedDevice":false,
      "DeviceProperties":
      {
        "DeviceID":"mydevice01", "HubEnabledState":true
      }, 
      "Commands":
      [
        {"Name":"SetHumidity", "Parameters":[{"Name":"humidity","Type":"double"}]},
        { "Name":"SetTemperature", "Parameters":[{"Name":"temperature","Type":"double"}]}
      ]
    }
    ```
   
    For reference, here is a sample **Telemetry** message sent to the preconfigured solution:
   
    ```
    {"DeviceId":"mydevice01", "Temperature":50, "Humidity":50, "ExternalTemperature":55}
    ```
   
    For reference, here is a sample **Command** received from the preconfigured solution:
   
    ```
    {
      "Name":"SetHumidity",
      "MessageId":"2f3d3c75-3b77-4832-80ed-a5bb3e233391",
      "CreatedTime":"2016-03-11T15:09:44.2231295Z",
      "Parameters":{"humidity":23}
    }
    ```
5. Replace the **main** function with following code to invoke the **remote_monitoring_run** function:
   
    ```
    int main()
    {
      remote_monitoring_run();
      return 0;
    }
    ```
6. Click **Build** and then **Build Solution** to build the device application.
7. In **Solution Explorer**, right-click the **RMDevice** project, click **Debug**, and then click **Start new instance** to run the sample. The console displays messages as the application sends sample telemetry to the preconfigured solution, receives desired property values set in the solution dashboard, and responds to methods invoked from the solution dashboard.

[!INCLUDE [iot-suite-visualize-connecting](../../includes/iot-suite-visualize-connecting.md)]

[lnk-c-project-properties]: https://msdn.microsoft.com/library/669zx6zc.aspx
