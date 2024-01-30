---
title: Quickstart - Provision a simulated symmetric key device to Microsoft Azure IoT Hub
description: Learn how to provision a device that authenticates with a symmetric key in the Azure IoT Hub Device Provisioning Service (DPS)
author: kgremban
ms.author: kgremban
ms.date: 04/06/2023
ms.topic: quickstart
ms.service: iot-dps
services: iot-dps
manager: lizross
ms.custom: mvc, mode-other, devx-track-extended-java, devx-track-python
zone_pivot_groups: iot-dps-set1
#Customer intent: As a new IoT developer, I want to connect a device to an IoT hub using the SDK, to learn how secure provisioning works with symmetric keys.
---

# Quickstart: Provision a simulated symmetric key device

In this quickstart, you create a simulated device on your Windows machine. The simulated device is configured to use the [symmetric key attestation](concepts-symmetric-key-attestation.md) mechanism for authentication. After you've configured your device, you then provision it to your IoT hub using the Azure IoT Hub Device Provisioning Service.

If you're unfamiliar with the process of provisioning, review the [provisioning](about-iot-dps.md#provisioning-process) overview.

This quickstart demonstrates a solution for a Windows-based workstation. However, you can also perform the procedures on Linux. For a Linux example, see [Tutorial: provision for geo latency](how-to-provision-multitenant.md).

## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

* Complete the steps in [Set up IoT Hub Device Provisioning Service with the Azure portal](./quick-setup-auto-provision.md).
::: zone pivot="programming-language-ansi-c"

* If you're using a Windows development environment, install [Visual Studio](https://visualstudio.microsoft.com/vs/) 2019 with the ['Desktop development with C++'](/cpp/ide/using-the-visual-studio-ide-for-cpp-desktop-development) workload enabled. Visual Studio 2015 and Visual Studio 2017 are also supported. For Linux or macOS, see the appropriate section in [Prepare your development environment](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/devbox_setup.md) in the SDK documentation.

::: zone-end

::: zone pivot="programming-language-csharp"

* Install [.NET SDK 6.0](https://dotnet.microsoft.com/download) or later on your Windows-based machine. You can use the following command to check your version.

    ```cmd
    dotnet --info
    ```

::: zone-end

::: zone pivot="programming-language-nodejs"

* Install [Node.js v4.0+](https://nodejs.org).

::: zone-end

::: zone pivot="programming-language-python"

* Install [Python 3.7](https://www.python.org/downloads/) or later installed on your Windows-based machine. You can check your version of Python by running `python --version`.

::: zone-end

::: zone pivot="programming-language-java"

* Install [Java SE Development Kit 8](/azure/developer/java/fundamentals/java-support-on-azure) or later installed on your machine.

* Download and install [Maven](https://maven.apache.org/install.html).

::: zone-end

* Install the latest version of [Git](https://git-scm.com/download/). Make sure that Git is added to the environment variables accessible to the command window. See [Software Freedom Conservancy's Git client tools](https://git-scm.com/download/) for the latest version of `git` tools to install, which includes *Git Bash*, the command-line app that you can use to interact with your local Git repository.


<a id="setupdevbox"></a>

## Prepare your development environment

::: zone pivot="programming-language-ansi-c"

In this section, you prepare a development environment that's used to build the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c). The sample code attempts to provision the device, during the device's boot sequence.

1. Download the latest [CMake build system](https://cmake.org/download/).

    >[!IMPORTANT]
    >Confirm that the Visual Studio prerequisites (Visual Studio and the 'Desktop development with C++' workload) are installed on your machine, **before** starting the `CMake` installation. Once the prerequisites are in place, and the download is verified, install the CMake build system. Also, be aware that older versions of the CMake build system fail to generate the solution file used in this article. Make sure to use the latest version of CMake.

2. Open a web browser, and go to the [Release page of the Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c/releases/latest).

3. Select the **Tags** tab at the top of the page.

4. Copy the tag name for the latest release of the Azure IoT C SDK.

5. Open a command prompt or Git Bash shell. Run the following commands to clone the latest release of the [Azure IoT Device SDK for C](https://github.com/Azure/azure-iot-sdk-c) GitHub repository. Replace `<release-tag>` with the tag you copied in the previous step, for example: `lts_01_2023`.

    ```cmd
    git clone -b <release-tag> https://github.com/Azure/azure-iot-sdk-c.git
    cd azure-iot-sdk-c
    git submodule update --init
    ```

    This operation could take several minutes to complete.

6. When the operation is complete, run the following commands from the `azure-iot-sdk-c` directory:

    ```cmd
    mkdir cmake
    cd cmake
    ```

7. The code sample uses a symmetric key to provide attestation. Run the following command to build a version of the SDK specific to your development client platform that includes the device provisioning client:

    ```cmd
    cmake -Dhsm_type_symm_key:BOOL=ON -Duse_prov_client:BOOL=ON  ..
    ```

    >[!TIP]
    >If `cmake` does not find your C++ compiler, you may get build errors while running the above command. If that happens, try running the command in the [Visual Studio command prompt](/dotnet/framework/tools/developer-command-prompt-for-vs).

8. When the build completes successfully, the last few output lines look similar to the following output:

    ```output
    $ cmake -Dhsm_type_symm_key:BOOL=ON -Duse_prov_client:BOOL=ON  ..
    -- Building for: Visual Studio 16 2019
    -- Selecting Windows SDK version 10.0.19041.0 to target Windows 10.0.19042.
    -- The C compiler identification is MSVC 19.29.30040.0
    -- The CXX compiler identification is MSVC 19.29.30040.0

    ...

    -- Configuring done
    -- Generating done
    -- Build files have been written to: E:/IoT Testing/azure-iot-sdk-c/cmake
    ```

::: zone-end

::: zone pivot="programming-language-csharp"

1. Open a Git CMD or Git Bash command-line environment.

2. Clone the [Azure IoT SDK for C#](https://github.com/Azure/azure-iot-sdk-csharp) GitHub repository using the following command:

    ```cmd
    git clone https://github.com/Azure/azure-iot-sdk-csharp.git
    ```

::: zone-end

::: zone pivot="programming-language-nodejs"

1. Open a Git CMD or Git Bash command-line environment.

2. Clone the [Azure IoT SDK for Node.js](https://github.com/Azure/azure-iot-sdk-node) GitHub repository using the following command:

    ```cmd
    git clone https://github.com/Azure/azure-iot-sdk-node.git --recursive
    ```

::: zone-end

::: zone pivot="programming-language-python"

1. Open a Git CMD or Git Bash command-line environment.

2. Clone the [Azure IoT SDK for Python](https://github.com/Azure/azure-iot-sdk-python/tree/v2) GitHub repository using the following command:

   ```cmd
   git clone -b v2 https://github.com/Azure/azure-iot-sdk-python.git --recursive
   ```

   >[!NOTE]
   >The samples used in this tutorial are in the **v2** branch of the azure-iot-sdk-python repository. V3 of the Python SDK is available to use in beta. 

::: zone-end

::: zone pivot="programming-language-java"

1. Open a Git CMD or Git Bash command-line environment.

2. Clone the [Azure IoT SDK for Java](https://github.com/Azure/azure-iot-sdk-java) GitHub repository using the following command:

    ```cmd
    git clone https://github.com/Azure/azure-iot-sdk-java.git --recursive
    ```

3. Go to the root `azure-iot-sdk-java` directory and build the project to download all needed packages. This step can take several minutes to complete.

   ```cmd
   cd azure-iot-sdk-java
   mvn install -DskipTests=true
   ```

::: zone-end

## Create a device enrollment

The Azure IoT Device Provisioning Service supports two types of enrollments:

* [Enrollment groups](concepts-service.md#enrollment-group): Used to enroll multiple related devices.
* [Individual enrollments](concepts-service.md#individual-enrollment): Used to enroll a single device.

This article demonstrates an individual enrollment for a single device to be provisioned with an IoT hub.

<!-- INCLUDE -->
[!INCLUDE [iot-dps-individual-enrollment-key.md](../../includes/iot-dps-individual-enrollment-key.md)]

Once you create the individual enrollment, a **primary key** and **secondary key** are generated and added to the enrollment entry. You use the primary key in the device sample later in this quickstart.

1. To view your simulated symmetric key device enrollment, select the **Individual enrollments** tab.

1. Select your device's registration ID from the list of individual enrollments.

1. Copy the value of the generated **Primary key**.

    :::image type="content" source="./media/quick-create-simulated-device-symm-key/copy-device-enrollment-primary-key.png" alt-text="Screenshot showing the enrollment details, highlighting the Copy button for the primary key of the device enrollment":::

<a id="firstbootsequence"></a>

## Prepare and run the device provisioning code

::: zone pivot="programming-language-ansi-c"

In this section, you update the device sample code to send the device's boot sequence to your Device Provisioning Service instance. This boot sequence causes the device to be recognized, authenticated, and assigned to an IoT hub linked to the Device Provisioning Service instance.

The sample provisioning code accomplishes the following tasks, in order:

1. Authenticates your device with your Device Provisioning resource using the following three parameters:

    * The ID Scope of your Device Provisioning Service
    * The registration ID for your device enrollment.
    * The primary symmetric key for your device enrollment.

2. Assigns the device to the IoT hub already linked to your Device Provisioning Service instance.

To update and run the provisioning sample with your device information:

1. In the main menu of your Device Provisioning Service, select **Overview**.

2. Copy the **ID Scope** value.

    :::image type="content" source="./media/quick-create-simulated-device-symm-key/extract-dps-endpoints.png" alt-text="Screenshot showing the overview of the Device Provisioning Service instance, highlighting the ID Scope value for the instance.":::

3. In Visual Studio, open the *azure_iot_sdks.sln* solution file that was generated by running CMake. The solution file should be in the following location:

    ```output

    \azure-iot-sdk-c\cmake\azure_iot_sdks.sln

    ```

    >[!TIP]
    >If the file was not generated in your cmake directory, make sure you used a recent version of the CMake build system.

4. In Visual Studio's *Solution Explorer* window, go to the **Provision\_Samples** folder. Expand the sample project named **prov\_dev\_client\_sample**. Expand **Source Files**, and open **prov\_dev\_client\_sample.c**.

5. Find the `id_scope` constant, and replace the value with the **ID Scope** value that you copied in step 2.

    ```c
    static const char* id_scope = "0ne00002193";
    ```

6. Find the definition for the `main()` function in the same file. Make sure the `hsm_type` variable is set to `SECURE_DEVICE_TYPE_SYMMETRIC_KEY` as shown in the following example:

    ```c
    SECURE_DEVICE_TYPE hsm_type;
    //hsm_type = SECURE_DEVICE_TYPE_TPM;
    //hsm_type = SECURE_DEVICE_TYPE_X509;
    hsm_type = SECURE_DEVICE_TYPE_SYMMETRIC_KEY;
    ```

7. Find the call to `prov_dev_set_symmetric_key_info()` in **prov\_dev\_client\_sample.c** that is commented out.

    ```c
    // Set the symmetric key if using they auth type
    //prov_dev_set_symmetric_key_info("<symm_registration_id>", "<symmetric_Key>");
    ```

    Uncomment the function call, and replace the placeholder values (including the angle brackets) with your device's registration ID and the primary key value you copied earlier.

    ```c
    // Set the symmetric key if using they auth type
    prov_dev_set_symmetric_key_info("symm-key-device-007", "your primary key here");
    ```

8. Save the file.

9. Right-click the **prov\_dev\_client\_sample** project and select **Set as Startup Project**.

10. On the Visual Studio menu, select **Debug** > **Start without debugging** to run the solution. In the rebuild the project prompt, select **Yes** to rebuild the project before running.

    The following output is an example of the device successfully connecting to the provisioning Service instance to be assigned to an IoT hub:

    ```output
    Provisioning API Version: 1.2.8

    Registering Device

    Provisioning Status: PROV_DEVICE_REG_STATUS_CONNECTED
    Provisioning Status: PROV_DEVICE_REG_STATUS_ASSIGNING

    Registration Information received from service:
    test-docs-hub.azure-devices.net, deviceId: device-007
    Press enter key to exit:
    ```

::: zone-end

::: zone pivot="programming-language-csharp"

The sample provisioning code accomplishes the following tasks:

1. Authenticates your device with your Device Provisioning resource using the following three parameters:

    * The ID Scope of your Device Provisioning Service
    * The registration ID for your device enrollment.
    * The primary symmetric key for your device enrollment.

2. Assigns the device to the IoT hub already linked to your Device Provisioning Service instance.

3. Sends a test telemetry message to the IoT hub.

To update and run the provisioning sample with your device information:

1. In the main menu of your Device Provisioning Service, select **Overview**.

2. Copy the **ID Scope** value.

    :::image type="content" source="./media/quick-create-simulated-device-symm-key/extract-dps-endpoints.png" alt-text="Screenshot showing the overview of the Device Provisioning Service instance, highlighting the ID Scope value for the instance.":::

3. Open a command prompt and go to the *SymmetricKeySample* in the cloned sdk repository:

    ```cmd
    cd '.\azure-iot-sdk-csharp\provisioning\device\samples\how to guides\SymmetricKeySample\'
    ```

4. In the *SymmetricKeySample* folder, open *Parameters.cs* in a text editor. This file shows the available parameters for the sample. Only the first three required parameters are used in this article when running the sample. Review the code in this file. No changes are needed.

    | Parameter                         | Required | Description     |
    | :-------------------------------- | :------- | :-------------- |
    | `--i` or `--IdScope`              | True     | The ID Scope of the DPS instance |
    | `--r` or `--RegistrationId`       | True     | The registration ID is a case-insensitive string (up to 128 characters long) of alphanumeric characters plus the special characters: `'-'`, `'.'`, `'_'`, `':'`. The last character must be alphanumeric or dash (`'-'`). |
    | `--p` or `--PrimaryKey`           | True     | The primary key of the individual enrollment or the derived device key of the group enrollment. See the [ComputeDerivedSymmetricKeySample](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/provisioning/device/samples/getting%20started/ComputeDerivedSymmetricKeySample) for how to generate the derived key. |
    | `--g` or `--GlobalDeviceEndpoint` | False    | The global endpoint for devices to connect to. Defaults to `global.azure-devices-provisioning.net` |
    | `--t` or `--TransportType`        | False    | The transport to use to communicate with the device provisioning instance. Defaults to `Mqtt`. Possible values include `Mqtt`, `Mqtt_WebSocket_Only`, `Mqtt_Tcp_Only`, `Amqp`, `Amqp_WebSocket_Only`, `Amqp_Tcp_only`, and `Http1`.|

5. In the *SymmetricKeySample* folder, open *ProvisioningDeviceClientSample.cs* in a text editor. This file shows how the [SecurityProviderSymmetricKey](/dotnet/api/microsoft.azure.devices.shared.securityprovidersymmetrickey?view=azure-dotnet&preserve-view=true) class is used along with the [ProvisioningDeviceClient](/dotnet/api/microsoft.azure.devices.provisioning.client.provisioningdeviceclient?view=azure-dotnet&preserve-view=true) class to provision your simulated symmetric key device. Review the code in this file.  No changes are needed.

6. Build and run the sample code using the following command:

    * Replace `<id-scope>` with the **ID Scope** that you copied in step 2.
    * Replace `<registration-id>` with the **Registration ID** that you provided for the device enrollment.
    * Replace `<primarykey>` with the **Primary Key** that you copied from the device enrollment.

    ```cmd
    dotnet run --i <id-scope> --r <registration-id> --p <primarykey>
    ```

7. You should now see something similar to the following output. A "TestMessage" string is sent to the hub as a test message.

     ```output
    D:\azure-iot-sdk-csharp\provisioning\device\samples\how to guides\SymmetricKeySample>dotnet run --i 0ne00000A0A --r symm-key-csharp-device-01 --p sbDDeEzRuEuGKag+kQKV+T1QGakRtHpsERLP0yPjwR93TrpEgEh/Y07CXstfha6dhIPWvdD1nRxK5T0KGKA+nQ==

    Initializing the device provisioning client...
    Initialized for registration Id symm-key-csharp-device-01.
    Registering with the device provisioning service...
    Registration status: Assigned.
    Device csharp-device-01 registered to ExampleIoTHub.azure-devices.net.
    Creating symmetric key authentication for IoT Hub...
    Testing the provisioned device with IoT Hub...
    Sending a telemetry message...
    Finished.
    Enter any key to exit.
    ```

::: zone-end

::: zone pivot="programming-language-nodejs"

The sample provisioning code accomplishes the following tasks, in order:

1. Authenticates your device with your Device Provisioning resource using the following four parameters:
    * `PROVISIONING_HOST`
    * `PROVISIONING_IDSCOPE`
    * `PROVISIONING_REGISTRATION_ID`
    * `PROVISIONING_SYMMETRIC_KEY`

2. Assigns the device to the IoT hub already linked to your Device Provisioning Service instance.

3. Sends a test telemetry message to the IoT hub.

To update and run the provisioning sample with your device information:

1. In the main menu of your Device Provisioning Service, select **Overview**.

2. Copy the **ID Scope** and **Global device endpoint** values.

    :::image type="content" source="./media/quick-create-simulated-device-symm-key/copy-id-scope-and-global-device-endpoint.png" alt-text="Screenshot showing the overview of the Device Provisioning Service instance, highlighting the global device endpoint and ID Scope values for the instance.":::

3. Open a command prompt for executing Node.js commands, and go to the following directory:

    ```cmd
    cd azure-iot-sdk-node/provisioning/device/samples
    ```

4. In the *provisioning/device/samples* folder, open *register_symkey.js* and review the code. Notice that the sample code sets a custom payload:

    ```nodejs
    provisioningClient.setProvisioningPayload({a: 'b'});
    ```

    You may comment out this code, as it's not needed with for this quickstart. A custom payload would be required you wanted to use a custom allocation function to assign your device to an IoT hub. For more information, see [Tutorial: Use custom allocation policies](tutorial-custom-allocation-policies.md).

     The `provisioningClient.register()` method attempts the registration of your device.

    No further changes are needed.

5. In the command prompt, run the following commands to set environment variables used by the sample:

    * Replace `<provisioning-global-endpoint>` with the **Global device endpoint** that you copied in step 2.
    * Replace `<id-scope>` with the **ID Scope** that you copied in step 2.
    * Replace `<registration-id>` with the **Registration ID** that you provided for the device enrollment.
    * Replace `<primarykey>` with the **Primary Key** that you copied from the device enrollment.

    ```cmd
    set PROVISIONING_HOST=<provisioning-global-endpoint>
    ```

    ```cmd
    set PROVISIONING_IDSCOPE=<id-scope>
    ```

    ```cmd
    set PROVISIONING_REGISTRATION_ID=<registration-id>
    ```

    ```cmd
    set PROVISIONING_SYMMETRIC_KEY=<primarykey>
    ```

6. Build and run the sample code using the following commands:

   ```cmd
    npm install
    ```

    ```cmd
    node register_symkey.js
    ```

7. You should now see something similar to the following output. A "Hello World" string is sent to the hub as a test message.

     ```output
    D:\azure-iot-samples-csharp\provisioning\device\samples>node register_symkey.js
    registration succeeded
    assigned hub=ExampleIoTHub.azure-devices.net
    deviceId=nodejs-device-01
    payload=undefined
    Client connected
    send status: MessageEnqueued
    ```

::: zone-end

::: zone pivot="programming-language-python"

The sample provisioning code accomplishes the following tasks, in order:

1. Authenticates your device with your Device Provisioning resource using the following four parameters:

    * `PROVISIONING_HOST`
    * `PROVISIONING_IDSCOPE`
    * `PROVISIONING_REGISTRATION_ID`
    * `PROVISIONING_SYMMETRIC_KEY`

2. Assigns the device to the IoT hub already linked to your Device Provisioning Service instance.

3. Sends a test telemetry message to the IoT hub.

To update and run the provisioning sample with your device information:

1. In the main menu of your Device Provisioning Service, select **Overview**.

2. Copy the **ID Scope** and **Global device endpoint** values.

    :::image type="content" source="./media/quick-create-simulated-device-symm-key/copy-id-scope-and-global-device-endpoint.png" alt-text="Screenshot showing the overview of the Device Provisioning Service instance, highlighting the global device endpoint and ID Scope values for the instance.":::

3. Open a command prompt and go to the directory where the sample file, _provision_symmetric_key.py_, is located.

   ```cmd
   cd azure-iot-sdk-python\samples\async-hub-scenarios
   ```

4. In the command prompt, run the following commands to set environment variables used by the sample:

    * Replace `<provisioning-global-endpoint>` with the **Global device endpoint** that you copied in step 2.
    * Replace `<id-scope>` with the **ID Scope** that you copied in step 2.
    * Replace `<registration-id>` with the **Registration ID** that you provided for the device enrollment.
    * Replace `<primarykey>` with the **Primary Key** that you copied from the device enrollment.

    ```cmd
    set PROVISIONING_HOST=<provisioning-global-endpoint>
    ```

    ```cmd
    set PROVISIONING_IDSCOPE=<id-scope>
    ```

    ```cmd
    set PROVISIONING_REGISTRATION_ID=<registration-id>
    ```

    ```cmd
    set PROVISIONING_SYMMETRIC_KEY=<primarykey>
    ```

5. Install the _azure-iot-device_ library by running the following command.

    ```cmd
    pip install azure-iot-device
    ```

6. Run the Python sample code in *_provision_symmetric_key.py_*.

    ```cmd
    python provision_symmetric_key.py
    ```

7. You should now see something similar to the following output. Some example wind speed telemetry messages are also sent to the hub as a test.

     ```output
    D:\azure-iot-sdk-python\samples\async-hub-scenarios>python provision_symmetric_key.py
    RegistrationStage(RequestAndResponseOperation): Op will transition into polling after interval 2.  Setting timer.
    The complete registration result is
    python-device-008
    docs-test-iot-hub.azure-devices.net
    initialAssignment
    null
    Will send telemetry from the provisioned device
    sending message #8
    sending message #9
    sending message #3
    sending message #10
    sending message #4
    sending message #2
    sending message #6
    sending message #7
    sending message #1
    sending message #5
    done sending message #8
    done sending message #9
    done sending message #3
    done sending message #10
    done sending message #4
    done sending message #2
    done sending message #6
    done sending message #7
    done sending message #1
    done sending message #5
    ```

::: zone-end

::: zone pivot="programming-language-java"

The sample provisioning code accomplishes the following tasks, in order:

1. Authenticates your device with your Device Provisioning resource using the following four parameters:

    * `GLOBAL_ENDPOINT`
    * `SCOPE_ID`
    * `REGISTRATION_ID`
    * `SYMMETRIC_KEY`

2. Assigns the device to the IoT hub already linked to your Device Provisioning Service instance.

3. Sends a test telemetry message to the IoT hub.

To update and run the provisioning sample with your device information:

1. In the main menu of your Device Provisioning Service, select **Overview**.

2. Copy the **ID Scope** and **Global device endpoint** values. These values are your `SCOPE_ID` and `GLOBAL_ENDPOINT` parameters, respectively.

    :::image type="content" source="./media/quick-create-simulated-device-symm-key/copy-id-scope-and-global-device-endpoint.png" alt-text="Screenshot showing the overview of the Device Provisioning Service instance, highlighting the global device endpoint and ID Scope values for the instance.":::

3. Open the Java device sample code for editing. The full path to the device sample code is:

    `azure-iot-sdk-java/provisioning/provisioning-device-client-samples/provisioning-symmetrickey-individual-sample/src/main/java/samples/com/microsoft/azure/sdk/iot/ProvisioningSymmetricKeyIndividualEnrollmentSample.java`

4. Set the value of the following variables for your DPS and device enrollment:

    * Replace `<id-scope>` with the **ID Scope** that you copied in step 2.
    * Replace `<provisioning-global-endpoint>` with the **Global device endpoint** that you copied in step 2.
    * Replace `<registration-id>` with the **Registration ID** that you provided for the device enrollment.
    * Replace `<primarykey>` with the **Primary Key** that you copied from the device enrollment.

    ```java
    private static final String SCOPE_ID = "<id-scope>";
    private static final String GLOBAL_ENDPOINT = "<provisioning-global-endpoint>";
    private static final String SYMMETRIC_KEY = "<primarykey>";
    private static final String REGISTRATION_ID = "<registration-id>";
    ```

5. Open a command prompt for building. Go to the provisioning sample project folder of the Java SDK repository.

    ```cmd
    cd azure-iot-sdk-java\provisioning\provisioning-device-client-samples\provisioning-symmetrickey-individual-sample
    ```

6. Build the sample.

    ```cmd
    mvn clean install
    ```

7. Go to the `target` folder and execute the created `.jar` file. In the `java` command, replace the `{version}` placeholder with the version in the `.jar` filename on your machine.

    ```cmd
    cd target
    java -jar ./provisioning-symmetrickey-individual-sample-{version}-with-deps.jar
    ```

8. You should now see something similar to the following output.

    ```output
    Starting...
    Beginning setup.
    Initialized a ProvisioningDeviceClient instance using SDK version 1.11.0
    Starting provisioning thread...
    Waiting for Provisioning Service to register
    Opening the connection to device provisioning service...
    Connection to device provisioning service opened successfully, sending initial device registration message
    Authenticating with device provisioning service using symmetric key
    Waiting for device provisioning service to provision this device...
    Current provisioning status: ASSIGNING
    Device provisioning service assigned the device successfully
    IotHUb Uri : <Your IoT hub name>.azure-devices.net
    Device ID : java-device-007
    Sending message from device to IoT Hub...
    Press any key to exit...
    Message received! Response status: OK_EMPTY
    ```

::: zone-end

## Confirm your device provisioning registration

1. Go to the [Azure portal](https://portal.azure.com).

2. On the left-hand menu or on the portal page, select **All resources**.

3. Select the IoT hub to which your device was assigned.

4. In the **Device management** menu, select **Devices**.

5. If your device was provisioned successfully, the device ID should appear in the list, with **Status** set as *Enabled*. If you don't see your device, select **Refresh** at the top of the page.

    :::zone pivot="programming-language-ansi-c"

    :::image type="content" source="./media/quick-create-simulated-device-symm-key/hub-registration.png" alt-text="Screenshot showing that the device is registered with the IoT hub and enabled for the C example.":::

    ::: zone-end
    :::zone pivot="programming-language-csharp"

    :::image type="content" source="./media/quick-create-simulated-device-symm-key/hub-registration-csharp.png" alt-text="Screenshot showing that the device is registered with the IoT hub and enabled for the C# example.":::

    ::: zone-end

    :::zone pivot="programming-language-nodejs"

    :::image type="content" source="./media/quick-create-simulated-device-symm-key/hub-registration-nodejs.png" alt-text="Screenshot showing that the device is registered with the IoT hub and enabled for the Node.js example.":::

    ::: zone-end

    :::zone pivot="programming-language-python"

    :::image type="content" source="./media/quick-create-simulated-device-symm-key/hub-registration-python.png" alt-text="Screenshot showing that the device is registered with the IoT hub and enabled for the Python example.":::

    ::: zone-end

    ::: zone pivot="programming-language-java"

    :::image type="content" source="./media/quick-create-simulated-device-symm-key/hub-registration-java.png" alt-text="Screenshot showing that the device is registered with the IoT hub and enabled for the Java example.":::

    ::: zone-end

> [!NOTE]
> If you changed the *initial device twin state* from the default value in the enrollment entry for your device, it can pull the desired twin state from the hub and act accordingly. For more information, see [Understand and use device twins in IoT Hub](../iot-hub/iot-hub-devguide-device-twins.md).
>

## Clean up resources

If you plan to continue working on and exploring the device client sample, don't clean up the resources created in this quickstart. If you don't plan to continue, use the following steps to delete all resources created by this quickstart.

### Delete your device enrollment

1. Close the device client sample output window on your machine.

2. From the left-hand menu in the Azure portal, select **All resources**.

3. Select your Device Provisioning Service.

4. In the **Settings** menu, select **Manage enrollments**.

5. Select the **Individual enrollments** tab.

6. Select the check box next to the registration ID of the device you enrolled in this quickstart.

7. At the top of the page, select  **Delete**.

### Delete your device registration from IoT Hub

1. From the left-hand menu in the Azure portal, select **All resources**.

2. Select your IoT hub.

3. In the **Explorers** menu, select **IoT devices**.

4. Select the check box next to the device ID of the device you registered in this quickstart.

5. At the top of the page, select  **Delete**.

## Next steps

Provision multiple symmetric key devices using an enrollment group:

> [!div class="nextstepaction"]
> [Tutorial: Provision devices using symmetric key enrollment groups](how-to-legacy-device-symm-key.md)
