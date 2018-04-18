---
title: Use Azure IoT Hub device twin properties (Python) | Microsoft Docs
description: How to use Azure IoT Hub device twins to configure devices. You use the Azure IoT SDKs for Python to implement a simulated device app and a service app that modifies a device configuration using a device twin.
services: iot-hub
documentationcenter: .net
author: kgremban
manager: timlt
editor: ''

ms.assetid: d0bcec50-26e6-40f0-8096-733b2f3071ec
ms.service: iot-hub
ms.devlang: python
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/12/2018
ms.author: kgremban

---
# Use desired properties to configure devices (Python)
[!INCLUDE [iot-hub-selector-twin-how-to-configure](../../includes/iot-hub-selector-twin-how-to-configure.md)]

At the end of this tutorial, you will have two Python console apps:

* **SimulateDeviceConfiguration.py**, a simulated device app that waits for a desired configuration update and reports the status of a simulated configuration update process.
* **SetDesiredConfigurationAndQuery.py**, a Python back-end app, which sets the desired configuration on a device and queries the configuration update process.

> [!NOTE]
> The article [Azure IoT SDKs][lnk-hub-sdks] provides information about the Azure IoT SDKs that you can use to build both device and back-end apps.
> 
> 

To complete this tutorial you need the following:

* [Python 2.x or 3.x][lnk-python-download]. Make sure to use the 32-bit or 64-bit installation as required by your setup. When prompted during the installation, make sure to add Python to your platform-specific environment variable. If you are using Python 2.x, you may need to [install or upgrade *pip*, the Python package management system][lnk-install-pip].
* If you are using Windows OS, then [Visual C++ redistributable package][lnk-visual-c-redist] to allow the use of native DLLs from Python.
* An active Azure account. (If you don't have an account, you can create a [free account][lnk-free-trial] in just a couple of minutes.)

If you followed the [Get started with device twins][lnk-twin-tutorial] tutorial, you already have an IoT hub and a device identity called **myDeviceId**; and you can skip to the [Create the simulated device app][lnk-how-to-configure-createapp] section.

[!INCLUDE [iot-hub-get-started-create-hub](../../includes/iot-hub-get-started-create-hub.md)]

[!INCLUDE [iot-hub-get-started-create-device-identity-portal](../../includes/iot-hub-get-started-create-device-identity-portal.md)]

## Create the simulated device app
In this section, you create a Python console app that connects to your hub as **myDeviceId**, waits for a desired configuration update and then reports updates on the simulated configuration update process.

1. Install the **Azure IoT Python Device SDK** using the following command at your command prompt:
   
    ```cmd/sh
    pip install azure-iothub-device-client
    ```

1. Using a text editor, create a new **SimulateDeviceConfiguration.py** file.

1. Add the following code to the **SimulateDeviceConfiguration.py** file, and substitute the **{device connection string}** placeholder with the device connection string you copied when you created the **myDeviceId** device identity:

    ```python   
    import time
    import sys

    import iothub_client
    from iothub_client import IoTHubClient, IoTHubClientError, IoTHubTransportProvider, IoTHubClientResult, IoTHubError

    CONNECTION_STRING = "{deviceConnectionString}"
    PROTOCOL = IoTHubTransportProvider.MQTT

    CLIENT = IoTHubClient(CONNECTION_STRING, PROTOCOL)

    WAIT_COUNT = 5

    TWIN_CONTEXT = 0
    SEND_REPORTED_STATE_CONTEXT = 0

    TWIN_CALLBACKS = 0
    SEND_REPORTED_STATE_CALLBACKS = 0

    CONFIG_ID = "1"
    TWIN_PAYLOAD = "{\"configId\":" + CONFIG_ID + ",\"sendFrequency\":\"24h\"}"
    ```

    The **CLIENT** object exposes all the methods required to interact with device twins from the device. In further code, you will attach a handler for the update on desired properties, then add an additional handler to verify that there is an actual configuration change request by comparing the configIds, which then invokes a method that starts the configuration change. For the sake of simplicity, the previous code uses a hard-coded default for the initial configuration. A real app would probably load that configuration from a local storage.
   
   > [!IMPORTANT]
   > Desired property change events are always emitted once at device connection, make sure to check that there is an actual change in the desired properties before performing any action.
   > 

1. Add the following code to the end of the **SimulateDeviceConfiguration.py** file:

    ```python
    def device_twin_callback(update_state, payload, user_context):
        global TWIN_CALLBACKS
        global CONFIG_ID

        desired_configId = payload[payload.find("configId")+11:payload.find("configId")+12]
        if CONFIG_ID != desired_configId:
            print ( "" )
            print ( "Reported pending config change: %s" % payload)
		
            desired_sendFrequency = payload[payload.find("sendFrequency")+17:payload.find("sendFrequency")+19]
            print ( "...desired configId: " + desired_configId)
            print ( "...desired sendFrequency: " + desired_sendFrequency)
            new_payload = "{\"configId\":" + desired_configId + ",\"sendFrequency\":\"" + desired_sendFrequency + "\"}"
            CLIENT.send_reported_state(new_payload, len(new_payload), send_reported_state_callback, SEND_REPORTED_STATE_CONTEXT)
		
        CONFIG_ID = desired_configId
	
    def send_reported_state_callback(status_code, user_context):
        global SEND_REPORTED_STATE_CALLBACKS
	
        print ( "" )
        print ( "Device twins updated." )
    ```
   
    The **device_twin_callback** method updates reported properties on the local device twin object with the configuration update request and sets the _configId_. After successfully updating the device twin, it prints an update message. To save bandwidth, reported properties are updated by specifying only the properties to be modified (named **TWIN_PAYLOAD** in the above code), instead of replacing the whole document.
   
   > [!NOTE]
   > This tutorial does not simulate any behavior for concurrent configuration updates. Some configuration update processes might be able to accommodate changes of target configuration while the update is running, others might have to queue them, and others could reject them with an error condition. Make sure to consider the desired behavior for your specific configuration process, and add the appropriate logic before initiating the configuration change.
   > 

1. Add the following code to the end of the **SimulateDeviceConfiguration.py** file: 

    ```python
    def iothub_client_init():
        if CLIENT.protocol == IoTHubTransportProvider.MQTT or client.protocol == IoTHubTransportProvider.MQTT_WS:
            CLIENT.set_device_twin_callback(device_twin_callback, TWIN_CONTEXT)

    def iothub_client_sample_run():
        try:
            iothub_client_init()
		
            CLIENT.send_reported_state(TWIN_PAYLOAD, len(TWIN_PAYLOAD), send_reported_state_callback, SEND_REPORTED_STATE_CONTEXT)

            while True:
                print ( "IoTHubClient waiting for commands, press Ctrl-C to exit" )

                status_counter = 0
                while status_counter <= WAIT_COUNT:
                    time.sleep(10)
                    status_counter += 1

        except IoTHubError as iothub_error:
            print ( "Unexpected error %s from IoTHub" % iothub_error )
            return
        except KeyboardInterrupt:
            print ( "IoTHubClient sample stopped" )

    if __name__ == '__main__':
        print ( "Starting the IoT Hub Python sample..." )
        print ( "    Protocol %s" % PROTOCOL )
        print ( "    Connection string=%s" % CONNECTION_STRING )

        iothub_client_sample_run()
    ```

1. Run the device app:
   
    ```cmd/sh
    node SimulateDeviceConfiguration.py
    ```
   
    You should see the message `Device twins updated.`. Keep the app running.


## Create the service app
In this section, you will create a Python console app that updates the *desired properties* on the device twin associated with **myDeviceId** with a new telemetry configuration object. It then queries the device twins stored in the IoT hub and shows the difference between the desired and reported configurations of the device.

1. Install the **Azure IoT Python Service SDK** using the following command at your command prompt:
   
    ```cmd/sh
    pip install azure-iothub-service-client
    ```

1. Using a text editor, create a new **SetDesiredAndQuery.py** file.

1. Add the following code to the **SetDesiredAndQuery.py** file, and substitute the **{IoTHubConnectionString}** placeholder with the IoT Hub connection string you copied when you created your hub and the **{deviceId}** placeholder with the name of your device:

    ```python
    import sys, time
    import iothub_service_client

    from iothub_service_client import IoTHubError, IoTHubDeviceTwin

    CONNECTION_STRING = "{IoTHubConnectionString}"
    DEVICE_ID = "{deviceId}"

    UPDATE_JSON = "{\"properties\":{\"desired\":{\"configId\":3, \"sendFrequency\":\"" + sys.argv[1:][0] + "\"}}}"
    TIMEOUT = 60
    WAIT_COUNT = 10
    ```

1. Add the following code to the end of the **SetDesiredAndQuery.py** file:

    ```python
    def iothub_devicetwin_sample_run():
        try:
            iothub_twin_method = IoTHubDeviceTwin(CONNECTION_STRING)
		
            twin_info = iothub_twin_method.get_twin(DEVICE_ID)
            print ( "" )
            print ( "Device Twin before update    :" )
            print ( "{0}".format(twin_info) )

            twin_info = iothub_twin_method.update_twin(DEVICE_ID, UPDATE_JSON)
            print ( "" )
            print ( "Device Twin after update     :" )
            print ( "{0}".format(twin_info) )
		
            while True:
                time.sleep(10)

                twin_info = iothub_twin_method.get_twin(DEVICE_ID)
                print ( "" )
                print ( "Device Twin after client change initiated    :" )
                print ( "{0}".format(twin_info) )
		
                print ( "" )
                print ( "IoT Hub service sample complete, press Ctrl-C to exit" )

                status_counter = 0
                while status_counter <= WAIT_COUNT:
                    time.sleep(30)
				
                    status_counter += 1

        except IoTHubError as iothub_error:
            print ( "" )
            print ( "Unexpected error {0}".format(iothub_error) )
            return
        except KeyboardInterrupt:
            print ( "" )
            print ( "IoTHubDeviceMethod sample stopped" )

    if __name__ == '__main__':
        print ( "Starting the IoT Hub Service Client DeviceTwins Python sample..." )
        print ( "    Connection string = {0}".format(CONNECTION_STRING) )
        print ( "    Device ID         = {0}".format(DEVICE_ID) )

        iothub_devicetwin_sample_run()
    ```

1. With **SimulateDeviceConfiguration.py** running, run the application in a new command prompt with:

    ```cmd/sh
    python SetDesiredAndQuery.py 5m
    ```
   
    You should see the reported configuration ID change from **1** to **2** with the new active send frequency of five minutes instead of 24 hours.


## Next steps
In this tutorial, you set a desired configuration as *desired properties* from a back-end app, and wrote a simulated device app to detect that change and simulate an update process reporting its status as *reported properties* to the device twin.

Use the following resources to learn how to:

* Send telemetry from devices with the [Get started with IoT Hub][lnk-iothub-getstarted] tutorial,
* Schedule or perform operations on large sets of devices see the [Schedule and broadcast jobs][lnk-schedule-jobs] tutorial.
* Control devices interactively (such as turning on a fan from a user-controlled app), with the [Use direct methods][lnk-methods-tutorial] tutorial.

<!-- links -->
[lnk-python-download]: https://www.python.org/downloads/
[lnk-visual-c-redist]: http://www.microsoft.com/download/confirmation.aspx?id=48145
[lnk-install-pip]: https://pip.pypa.io/en/stable/installing/

[lnk-hub-sdks]: iot-hub-devguide-sdks.md
[lnk-free-trial]: http://azure.microsoft.com/pricing/free-trial/

[lnk-devguide-jobs]: iot-hub-devguide-jobs.md
[lnk-query]: iot-hub-devguide-query-language.md
[lnk-twin-notifications]: iot-hub-devguide-device-twins.md#back-end-operations
[lnk-methods]: iot-hub-devguide-direct-methods.md
[lnk-dm-overview]: iot-hub-device-management-overview.md
[lnk-twin-tutorial]: iot-hub-python-twin-getstarted.md
[lnk-schedule-jobs]: iot-hub-node-node-schedule-jobs.md
[lnk-dev-setup]: https://github.com/Azure/azure-iot-sdk-node/blob/master/doc/node-devbox-setup.md
[lnk-connect-device]: https://azure.microsoft.com/develop/iot/
[lnk-device-management]: iot-hub-node-node-device-management-get-started.md
[lnk-iot-edge]: iot-hub-linux-iot-edge-get-started.md
[lnk-iothub-getstarted]: iot-hub-python-getstarted.md
[lnk-methods-tutorial]: iot-hub-python-python-direct-methods.md

[lnk-guid]: https://en.wikipedia.org/wiki/Globally_unique_identifier

[lnk-how-to-configure-createapp]: iot-hub-node-node-twin-how-to-configure.md#create-the-simulated-device-app
