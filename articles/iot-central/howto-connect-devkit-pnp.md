# Connect an MXChip IoT DevKit device to your Azure IoT Central application via IoT Plug and Play

This article describes how to connect MXChip IoT DevKit as a certified PnP device to Azure IoT Central.

## What you learn

- Add and configure a real device in IoT Central application.
- Prepare the device connect to IoT Central.
- View the telemetry and properties from the device, and send commands to the device.

## What you need

To complete the steps in this article, you need the following resources:

1. An MXChip IoT DevKit. [Get it now](https://aka.ms/iot-devkit-purchase).
1. An IoT Central application created from the **PnP application template**. You can follow the steps in [Create an PnP application](#/).

## Add a real device

### Create and configure a device template

1. In your Azure IoT Central application, select **Device templates** tab, click **New** and choose **MXChip IoT DevKit** from pre-certified device catalog to create a new device template.

   ![Create device template](media/howto-connect-devkit-pnp/create-template.png)

1. Choose **MXChip IoT DevKit** template, you can see all the capabilities in your device template.

1. Select **View**, you can add and configure dashboard view in this pane. Click **Editing Device and Cloud Data**, to create a form to edit writable properties.

   ![Edit data view](media/howto-connect-devkit-pnp/edit-data-view.png)

1. Expand **Properties**, drag the labels which you want to edit or view to the blank canvas on the right. In this tutorial, you drag all the labels to the canvas, and click **Save**. Then click **Publish** button on the upper right corner.

   ![Drag property labels](media/howto-connect-devkit-pnp/drag-property-labels.png)

### Get your device connection details

1. Select **Devices** tab, choose **MXChip IoT DevKit**, and then click **New** to create a new device under the DevKit device template you just created.

   Enter a unique Device ID and Device Name. Then create a real device.

   ![Create new device](media/howto-connect-devkit-pnp/create-new-device2.png)

2. Select the device you created, and click **Connect** to view the device connection details. Make a note of the **Scope ID**, **Device ID**, and **Primary key**.

   ![IoT Central device connection info](media/howto-connect-devkit-pnp/device-connection.png)

## Prepare th DevKit device

1. Download the latest [pre-built Azure IoT Central firmware](https://github.com/MXCHIP/IoTDevKit/raw/master/pnp/iotc_devkit/bin/iotc_devkit.bin) for the MXChip from GitHub.

1. Connect the DevKit device to your development machine using a USB cable. In Windows, a file explorer window opens on a drive mapped to the storage on the DevKit device. For example, the drive might be called **AZ3166 (D:)**.

1. Drag the **iotc_devkit.bin** file onto the drive window. When the copying is complete, the device reboots with the new firmware.

1. On the DevKit, hold down **button B**, push and release the **Reset** button, and then release **button B**. The device is now in access point (AP) mode. To confirm, the screen displays "IoT DevKit - AP" and configuration portal IP address.

1. On your computer or tablet connect to the WiFi network name shown on the screen of the device. The WiFi network starts with **AZ-** followed by the MAC address. When you connect to this network, you don't have internet access. This state is expected, and you're only connected to this network for a short time while you configure the device.

1. Open your web browser and navigate to [http://192.168.0.1/](http://192.168.0.1/). The following web page displays:

    ![Config UI](media/howto-connect-devkit-pnp/config-ui.jpg)

    On the web page, enter:

    - The name of your WiFi network (SSID)
    - Your WiFi network password
    - The connection details **Scope ID**, **Registration ID** (Device ID), and **Symmetric key** of your device (you should have already saved this following the steps)

    > [!NOTE]
    > Currently, the IoT DevKit only can connect to 2.4 GHz Wi-Fi, 5 GHz is not supported due to hardware restrictions.

1. After choose **Save**, the DevKit will reboot and runs the application.

    ![Reboot UI](media/howto-connect-devkit-pnp/reboot-ui.png)

Now the DevKit starts sending data to your IoT Central application. You can open serial monitor to see the device output log.

1. Download the serial client such as [Tera Term](https://tera-term.en.lo4d.com/windows).

1. Connect the DevKit to your computer by USB.

1. Open Tera Term, select **serial**, and then expand the port. The device should appear as an STMicroelectronics device. Choose **STMicroelectronics STLink Virtual COM Port**. Click OK.

   ![Select COM poart](media/howto-connect-devkit-pnp/select-port.png)

1. Click **Setup** on the menu bar, select **serial port**, and configure the connection speed to **115200** baud. Then choose **OK** to open the serial monitor.

   ![Select COM speed](media/howto-connect-devkit-pnp/configure-speed.png)

1. You can see the output log in the Window.

    ![Serial monitor output](media/howto-connect-devkit-pnp/serial-message.png)

## View the telemetry in IoT Central

In this step, you view the telemetry and reported property values, and send commands in Azure IoT Central.

1. In your IoT Central application, select **Devices** tab, select the device you added. In the **Overview** tab, you can see the telemetry coming from the DevKit.

   ![IoT Central device overview](media/howto-connect-devkit-pnp/overview-page.png)

1. In the **About** tab, you can view the properties reported by the DevKit.

   ![IoT Central device property](media/howto-connect-devkit-pnp/property-page.png)

1. In the **Form** tab, you can set **Current**, **Fan Speed**, **Voltage** and **IR**, which are writable properties.

   ![IoT Central device form](media/howto-connect-devkit-pnp/form-page.png)

1. In the **Commands** page, you can call the commands to execute actions on the DevKit. For example, you run **turnOnLED** command.

   ![Turn on LED](media/howto-connect-devkit-pnp/turn-on-LED.png)

   On the device, view command executed successfully log in the serial monitor. To confirm, see the **User LED** on DevKit board on.

   ![Turn on LED output](media/howto-connect-devkit-pnp/turnon-output.png)

## Download the source code

If you want to explore and modify the device code, you can download it from GitHub. If you plan to modify the code, you should follow these instructions to [prepare the development environment](https://docs.microsoft.com/azure/iot-hub/iot-hub-arduino-iot-devkit-az3166-get-started#prepare-the-development-environment) for your desktop operating system.

1. To download sample code for DevKit, run the following command on your desktop machine.

   ```cmd/sh
   git clone https://github.com/MXCHIP/IoTDevKit.git
   ```

    > [!TIP]
    > If **git** is not installed in your development environment, you can download it from [https://git-scm.com/download](https://git-scm.com/download).

1. The source code is located in `pnp/iotc_devkit` folder.

## Review the code

Open repository folder, navigate to pnp/iotc_devkit, then open **iotc_devkit.code-workspace** file with VS Code.

![open-workspace](media/howto-connect-devkit-pnp/open-workspace.png)

To see how the telemetry is sent to the Azure IoT Central application, open the sensor_interface.c file.

- The function `SensorsInterface_Telemetry_SendAll` sends multiple telemetries including humidity, temperature, pressure, magnetometer, gyroscope and accelerometer .
- The functions `Sensors_Serialize{XXXX}` in digitaltwin_serializer.c create the telemetry payload, using `Sensors_Telemetry_Read{XXXX}`functions in mxchip_iot_devkit_impl.c to get data from the sensors on the DevKit device.

To see how property values are reported to the Azure IoT Central application, open the deviceinfo_interface.c file.

- The function `DeviceinfoInterface_Property_ReportAll` sends properties including manufacturer, device model, software version, operating system name, processor architecture, processor manufacturer, total storage and total memory.
- The functions from line 213 to 419 in digitaltwin_serializer.c create the property payload.

To see how the DevKit device responds to commands for LED actions called from the IoT Central application, open the leds_interface.c file.

- The function `LedsInterface_Command_TurnOnLedCallback` processes the turnOnLed command. It uses `Leds_Command_TurnOnLed` function in mxchip_iot_devkit_impl.c to turn on the User LED.
- The function `LedsInterface_Command_BlinkCallback` processes the blink command. It uses `Leds_Command_Blink` function in mxchip_iot_devkit_impl.c to blink the RGB LED.

## MXChip Device template details

A device created from the MXChip IoT DevKit device template has the following characteristics:

### Telemetry

Field name|Units|Minimum|Maximum|Decimal places
-|-|-|-|-|-
humidity|%|0|100|0
temp|°C|-40|120|0
pressure|hPa|260|1260|0
magnetometerX|mgauss|-1000|1000|0
magnetometerY|mgauss|-1000|1000|0
magnetometerZ|mgauss|-1000|1000|0
accelerometerX|mg|-2000|2000|0
accelerometerY|mg|-2000|2000|0
accelerometerZ|mg|-2000|2000|0
gyroscopeX|mdps|-2000|2000|0
gyroscopeY|mdps|-2000|2000|0
gyroscopeZ|mdps|-2000|2000|0

### Properties

Display name|Field name|Data type|Writable/Read only
-|-|-|-
Manufacturer|manufacturer|string|Read only
Device model|model|string|Read only
Software version|swVersion|string|Read only
Operating system name|osName|string|Read only
Processor architecture|processorArchitecture|string|Read only
Processor manufacturer|processorManufacturer|string|Read only
Total storage|totalStorage|long|Read only
Total memory|totalMemory|long|Read only
Fan Speed|fanSpeed|double|Writable
Voltage|voltage|double|Writable
Current|current|double|Writable
IR|irSwitch|boolean|Writable

### Commands

Field name|Input field name|Input field type
-|-|-|-|-
blink|interval|long
turnOnLed|/|/
turnOffLed|/|/
echo|text|string
countdown|number|integer

## Next steps

Now that you've learned how to connect a MXChip IoT DevKit to your Azure IoT Central application via IoT Plug and Play, the suggested next step is to learn how to [set up a custom device template](https://docs.microsoft.com/azure/iot-central/howto-set-up-template) for your own IoT device.
