---
 title: include file
 description: include file
 author: timlt
 ms.service: iot-develop
 ms.topic: include
 ms.date: 05/05/2021
 ms.author: timlt
 ms.custom: include file
---

## Prerequisites
- If you don't have an Azure subscription, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- [Git](https://git-scm.com/downloads).
- A development machine with Java SE Development Kit 8 or later. You can download the Java 8 (LTS) JDK for multiple platforms from [Download Zulu Builds of OpenJDK](https://www.azul.com/downloads/zulu-community/). In the installer, select the **Add to Path** option.
- [Apache Maven 3](https://maven.apache.org/download.cgi). After you extract the download to a local folder, add the full path to the Maven */bin* folder to the Windows PATH variable.
- Azure CLI. You have two options for running Azure CLI commands in this quickstart:
    - Use the Azure Cloud Shell, an interactive shell that runs CLI commands in your browser. This option is recommended because you don't need to install anything. If you're using Cloud Shell for the first time, log into the [Azure portal](https://portal.azure.com). Follow the steps in [Cloud Shell quickstart](/azure/cloud-shell/quickstart) to **Start Cloud Shell** and **Select the Bash environment**.
    - Optionally, run Azure CLI on your local machine. The quickstart requires Azure CLI version 2.0.76 or later. Run `az --version` to check the version. Follow the steps in [Install Azure CLI]( /cli/azure/install-azure-cli) to install or upgrade Azure CLI, run it, and log in. If you're prompted, install the Azure CLI extensions on first use.

[!INCLUDE [iot-hub-include-create-hub-cli](iot-hub-include-create-hub-cli.md)]

## Run a simulated device
In this section, you use the Java SDK to send messages from your simulated device to your IoT hub.

### Configure your environment
1. Open a console to install the Azure IoT Java device SDK, build, and run the code sample.
    > [!NOTE]
    > You should now have two console windows open: the one you just opened, and the Cloud Shell or CLI console that you used previously to enter CLI commands.
1. Set the following environment variables, to enable your simulated device to connect to Azure IoT.
    * Set an environment variable called `IOTHUB_DEVICE_CONNECTION_STRING`. For the variable value, use the device connection string that you saved in the previous section.
    * Set an environment variable called `IOTHUB_DEVICE_SECURITY_TYPE`. For the variable, use the literal string value `connectionString`.

    **CMD**

    ```console
    set IOTHUB_DEVICE_CONNECTION_STRING=<your connection string here>
    set IOTHUB_DEVICE_SECURITY_TYPE=connectionString
    ```
    > [!NOTE]
    > For Windows CMD there are no quotation marks surrounding the string values for each variable.

    **Bash**

    ```bash
    export IOTHUB_DEVICE_CONNECTION_STRING="<your connection string here>"
    export IOTHUB_DEVICE_SECURITY_TYPE="connectionString"
    ```

### Build the sample
1. In your console, clone the Azure IoT Java device SDK to your local machine:
    ```console
    git clone https://github.com/Azure/azure-iot-sdk-c.git
    ```
1. Navigate to the root folder of the SDK, and run the following command to build the SDK and update the samples.
    ```console
    cd azure-iot-sdk-java
    mvn install -T 2C -DskipTests
    ```
    This operation takes several minutes.

### Run the code
1. In your CLI app, run the [az iot hub monitor-events](/cli/azure/iot/hub#az_iot_hub_monitor_events) command to begin monitoring for events on your simulated IoT device.  Event messages print in the terminal as they arrive.

    ```azurecli-interactive
    az iot hub monitor-events --output table --hub-name {YourIoTHubName}
    ```
1. In your Java console, navigate to the samples directory.
    ```console
    cd device/iot-device-samples/pnp-device-sample/temperature-controller-device-sample
    ```
1. In your Java console, run the following code sample. The sample creates a simulated temperature controller with thermostat sensors.
    ```console
    mvn exec:java -Dexec.mainClass="samples.com.microsoft.azure.sdk.iot.device.TemperatureController"
    ```
    > [!NOTE]
    > This code sample uses Azure IoT Plug and Play, which lets you integrate smart devices into your solutions without any manual configuration.  By default, most samples in this documentation use IoT Plug and Play. To learn more about the advantages of IoT PnP, and cases for using or not using it, see [What is IoT Plug and Play?](../articles/iot-pnp/overview-iot-plug-and-play.md).

    After your simulated device connects to your IoT hub, it connects to the device instance you created in the application and begins to send telemetry. After some initial provisioning details, the console starts to output the telemetry for the temperature controller.
    
    ```output
    2021-05-13 22:11:05.639 DEBUG TemperatureController:518 - Telemetry - Response from IoT Hub: message Id=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx, status=OK_EMPTY
    2021-05-13 22:11:10.229 INFO  IotHubTransport:540 - Message was queued to be sent later ( Message details: Correlation Id [xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx] Message Id [xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx] )
    2021-05-13 22:11:10.229 INFO  IotHubTransport:1473 - Sending message ( Message details: Correlation Id [xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx] Message Id [xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx] )
    2021-05-13 22:11:10.231 DEBUG TemperatureController:465 - Telemetry: Sent - {"temperature": 22.8░C} with message Id xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.
    2021-05-13 22:11:10.234 INFO  IotHubTransport:540 - Message was queued to be sent later ( Message details: Correlation Id [xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx] Message Id [xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx] )
    2021-05-13 22:11:10.236 DEBUG TemperatureController:465 - Telemetry: Sent - {"temperature": 35.3░C} with message Id xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.
    ```