---
title: Tutorial - Provision devices using a symmetric key enrollment group in DPS
description: This tutorial shows how to use symmetric keys to provision devices through an enrollment group in your Device Provisioning Service (DPS) instance.
author: SoniaLopezBravo

ms.author: sonialopez
ms.date: 03/12/2024
ms.topic: tutorial
ms.service: azure-iot-hub
ms.custom: devx-track-extended-java, devx-track-python, devx-track-js
zone_pivot_groups: iot-dps-set1
ms.subservice: azure-iot-hub-dps
---

# Tutorial: Provision devices using symmetric key enrollment groups

This tutorial shows how to securely provision multiple simulated symmetric key devices to a single IoT Hub using an enrollment group.

The Azure IoT Hub Device Provisioning Service supports two types of enrollments for provisioning devices:

* *Enrollment groups*: Used to enroll multiple related devices. **This tutorial demonstrates provisioning with enrollment groups.**
* *Individual enrollments*: Used to enroll a single device.

The Azure IoT Hub Device Provisioning Service supports three forms of authentication for provisioning devices:

* X.509 certificates
* Trusted platform module (TPM)
* Symmetric keys - **This tutorial demonstrates symmetric key attestation**

Some devices might not have a certificate, TPM, or any other security feature that can be used to securely identify the device. For such devices, the Azure IoT Hub Device Provisioning Service (DPS) includes [symmetric key attestation](concepts-symmetric-key-attestation.md). Symmetric key attestation can be used to identify a device based on unique information like the MAC address or a serial number.

In this tutorial, you complete the following objectives:

> [!div class="checklist"]
>
> * Define a unique registration ID for each device.
> * Create an enrollment group that uses symmetric key attestation.
> * Produce a device key for each device using its unique registration ID and shared enrollment group key.
> * Provision devices using the device key and sample code in the Azure IoT device SDKs.

This tutorial is oriented toward a Windows-based workstation. However, you can perform the procedures on Linux. For a Linux example, see [Tutorial: Provision for geo latency](how-to-provision-multitenant.md).

>[!NOTE]
> If you've previously completed [Quickstart: Provision a simulated symmetric key device](quick-create-simulated-device-symm-key.md) and still have your Azure resources and development environment set up, you can proceed to [Create a symmetric key enrollment group](#create-a-symmetric-key-enrollment-group) in this tutorial.

## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

* Complete the steps in [Set up IoT Hub Device Provisioning Service with the Azure portal](./quick-setup-auto-provision.md).
::: zone pivot="programming-language-ansi-c"

* If you're using a Windows development environment, install [Visual Studio](https://visualstudio.microsoft.com/vs/) 2022 with the ['Desktop development with C++'](/cpp/ide/using-the-visual-studio-ide-for-cpp-desktop-development) workload enabled. Visual Studio 2019, Visual Studio 2017, and Visual Studio 2015 are also supported. For Linux or macOS, see the appropriate section in [Prepare your development environment](https://github.com/Azure/azure-iot-sdk-c/blob/main/doc/devbox_setup.md) in the SDK documentation.

* Install the latest [CMake build system](https://cmake.org/download/). Make sure you check the option that adds the CMake executable to your path.

    >[!IMPORTANT]
    >Confirm that the Visual Studio prerequisites (Visual Studio and the 'Desktop development with C++' workload) are installed on your machine, **before** starting the `CMake` installation. Once the prerequisites are in place, and the download is verified, install the CMake build system. Also, be aware that older versions of the CMake build system fail to generate the solution file used in this article. Make sure to use the latest version of CMake.

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

* Install the latest version of [Git](https://git-scm.com/downloads). Make sure that Git is added to the environment variables accessible to the command window. See [Software Freedom Conservancy's Git client tools](https://git-scm.com/downloads) for the latest version of `git` tools to install, which includes *Git Bash*, the command-line app that you can use to interact with your local Git repository.

## Prepare your development environment

::: zone pivot="programming-language-ansi-c"

In this section, you prepare a development environment to build the [Azure IoT Device SDK for C](https://github.com/Azure/azure-iot-sdk-c). The sample code provisions the device during the device's boot sequence.

1. In a web browser, go to the [Release page of the Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c/releases/latest).

1. Copy the tag name for the latest release of the Azure IoT C SDK, for example: `lts_03_2024`.

1. Open a Windows command prompt and run the following commands to clone the latest release of the [Azure IoT Device SDK for C](https://github.com/Azure/azure-iot-sdk-c) GitHub repository. Replace `<release-tag>` with the tag you copied in the previous step.

    ```cmd
    git clone -b <release-tag> https://github.com/Azure/azure-iot-sdk-c.git
    cd azure-iot-sdk-c
    git submodule update --init
    ```

    This operation could take several minutes to complete.

1. When the operation is complete, run the following commands from the `azure-iot-sdk-c` directory:

    ```cmd
    mkdir cmake
    cd cmake
    ```

1. The code sample uses a symmetric key to provide attestation. Run the following command to build a version of the SDK specific to your development client platform that includes the device provisioning client:

    ```cmd
    cmake -Dhsm_type_symm_key:BOOL=ON -Duse_prov_client:BOOL=ON  ..
    ```

    >[!TIP]
    >If `cmake` does not find your C++ compiler, you may get build errors while running the above command. If that happens, try running the command in the [Visual Studio command prompt](/dotnet/framework/tools/developer-command-prompt-for-vs).

1. When the build completes successfully, the last few output lines look similar to the following output:

    ```output
    $ cmake -Dhsm_type_symm_key:BOOL=ON -Duse_prov_client:BOOL=ON  ..
    -- Building for: Visual Studio 16 2019
    -- Selecting Windows SDK version 10.0.19041.0 to target Windows 10.0.22621.
    -- The C compiler identification is MSVC 19.29.30146.0
    -- The CXX compiler identification is MSVC 19.29.30146.0

    ...

    -- Configuring done
    -- Generating done
    -- Build files have been written to: C:/azure-iot-sdk-c/cmake
    ```

::: zone-end

::: zone pivot="programming-language-csharp"

1. Open a command prompt or Git Bash terminal.

2. Clone the [Azure IoT SDK for C#](https://github.com/Azure/azure-iot-sdk-csharp) GitHub repository using the following command:

    ```cmd
    git clone https://github.com/Azure/azure-iot-sdk-csharp.git
    ```

::: zone-end

::: zone pivot="programming-language-nodejs"

1. Open a command prompt or Git Bash terminal.

2. Clone the [Azure IoT SDK for Node.js](https://github.com/Azure/azure-iot-sdk-node) GitHub repository using the following command:

    ```cmd
    git clone https://github.com/Azure/azure-iot-sdk-node.git --recursive
    ```

::: zone-end

::: zone pivot="programming-language-python"

1. Open a command prompt or Git Bash terminal.

2. Clone the [Azure IoT Device SDK for Python](https://github.com/Azure/azure-iot-sdk-python/tree/v2) GitHub repository using the following command:

   ```cmd
   git clone -b v2 https://github.com/Azure/azure-iot-sdk-python.git --recursive
   ```

   >[!NOTE]
   >The samples used in this tutorial are in the **v2** branch of the azure-iot-sdk-python repository. V3 of the Python SDK is available to use in beta. For information about updating V2 code samples to use a V3 release of the Python SDK, see [Azure IoT Device SDK for Python migration guide](https://github.com/Azure/azure-iot-sdk-python/blob/v3/migration_guide_provisioning.md).

::: zone-end

::: zone pivot="programming-language-java"

1. Open a command prompt or Git Bash terminal.

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

## Create a symmetric key enrollment group

[!INCLUDE [iot-dps-enrollment-group-key.md](../../includes/iot-dps-enrollment-group-key.md)]

When you create the enrollment group, DPS generates a **primary key** and **secondary key**, then adds them to the enrollment entry. Your symmetric key enrollment group appears under the **Group name** column in the **Enrollment Groups** tab.

Open the enrollment and copy the value of the **Primary Key**. This key is your group key.

## Choose a unique registration ID for the device

A unique registration ID must be defined to identify each device. You can use the MAC address, serial number, or any unique information from the device.

In this example, we use a combination of a MAC address and serial number forming the following string for a registration ID.

```text
sn-007-888-abc-mac-a1-b2-c3-d4-e5-f6
```

Create unique registration IDs for each device. The registration ID is a case-insensitive string (up to 128 characters long) of alphanumeric characters plus the following special characters: `- . _ :`. The last character must be alphanumeric or dash (`-`).

## Derive a device key

To generate device keys, use the enrollment group primary key to compute an [HMAC-SHA256](https://wikipedia.org/wiki/HMAC) hash of the registration ID for each device. The result is then converted into Base 64 format for each device.

> [!WARNING]
> Your device code for each device should only include the derived device key for that device. Do not include your group primary key in your device code. 
> A compromised group key has the potential to compromise the security of all devices being authenticated with it.

# [Azure CLI](#tab/azure-cli)

The IoT extension for the Azure CLI provides the [az iot dps enrollment-group compute-device-key](/cli/azure/iot/dps/enrollment-group#az-iot-dps-enrollment-group-compute-device-key) command for generating derived device keys. This command can be used from both Windows-based and Linux systems.

Replace the value of the `--key` parameter with the **Primary Key** from your enrollment group.

Replace the value of the `--registration-id` parameter with your registration ID.

```azurecli
az iot dps enrollment-group compute-device-key --key <group_primary_key> --registration-id <device_registration_id>
```

Example result:

```azurecli
"Jsm0lyGpjaVYVP2g3FnmnmG9dI/9qU24wNoykUmermc="
```
# [Windows](#tab/windows)

On Windows, you can use PowerShell to generate your derived device key as shown in the following example.

Replace the value of `KEY` with the **Primary Key** from your enrollment group.

Replace the value of `REG_ID` with your registration ID.

```powershell
$KEY='<group_primary_key>'
$REG_ID='<device_registration_id>'

$hmacsha256 = New-Object System.Security.Cryptography.HMACSHA256
$hmacsha256.key = [Convert]::FromBase64String($KEY)
$sig = $hmacsha256.ComputeHash([Text.Encoding]::ASCII.GetBytes($REG_ID))
$derivedkey = [Convert]::ToBase64String($sig)
echo "`n$derivedkey`n"
```

Example result:

```powershell
Jsm0lyGpjaVYVP2g3FnmnmG9dI/9qU24wNoykUmermc=
```

# [Linux](#tab/linux)

On Linux, you can use openssl to generate your derived device key as shown in the following example.

Replace the value of `KEY` with the **Primary Key** from your enrollment group.

Replace the value of `REG_ID` with your registration ID.

```bash
KEY=<group_primary_key>
REG_ID=<device_registration_id>

keybytes=$(echo $KEY | base64 --decode | xxd -p -u -c 1000)
echo -n $REG_ID | openssl sha256 -mac HMAC -macopt hexkey:$keybytes -binary | base64
```

Example result:

```bash
Jsm0lyGpjaVYVP2g3FnmnmG9dI/9qU24wNoykUmermc=
```

---

Each device uses its derived device key and unique registration ID to perform symmetric key attestation with the enrollment group during provisioning.

## Prepare and run the device provisioning code

::: zone pivot="programming-language-ansi-c"

In this section, you update the device sample code to send the device's boot sequence to your Device Provisioning Service instance. This boot sequence causes the device to be recognized, authenticated, and assigned to an IoT hub linked to the Device Provisioning Service instance.

The sample provisioning code accomplishes the following tasks, in order:

1. Authenticates your device with your Device Provisioning resource using the following three parameters:

    * The ID Scope of your Device Provisioning Service
    * The registration ID for your device.
    * The derived device key for your device.

2. Assigns the device to the IoT hub already linked to your Device Provisioning Service instance.

To update and run the provisioning sample with your device information:

1. In the main menu of your Device Provisioning Service, select **Overview**.

2. Copy the **ID Scope** value.

    :::image type="content" source="./media/how-to-legacy-device-symm-key/copy-id-scope.png" alt-text="Screenshot that shows copying the ID scope from the DPS overview pane.":::

3. In Visual Studio, open the *azure_iot_sdks.sln* solution file that was generated by running CMake. The solution file should be in the following location:

    ```output

    \azure-iot-sdk-c\cmake\azure_iot_sdks.sln

    ```

    >[!TIP]
    >If the file was not generated in your cmake directory, make sure you used a recent version of the CMake build system.

4. In Visual Studio's *Solution Explorer* window, go to the **Provision\_Samples** folder. Expand the sample project named **prov\_dev\_client\_sample**. Expand **Source Files**, and open **prov\_dev\_client\_sample.c**.

5. Find the `id_scope` constant, and replace the value with the **ID Scope** value that you copied from the Azure portal.

    ```c
    static const char* id_scope = "0ne00002193";
    ```

6. Find the definition for the `main()` function in the same file. Make sure the `hsm_type` variable is set to `SECURE_DEVICE_TYPE_SYMMETRIC_KEY` as shown below:

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

    Uncomment the function call and replace the placeholder values (including the angle brackets) with the registration ID you chose in [Choose a unique registration ID for the device](#choose-a-unique-registration-id-for-the-device) and the derived device key that you generated in [Derive a device key](#derive-a-device-key).

    ```c
    // Set the symmetric key if using they auth type
    prov_dev_set_symmetric_key_info("sn-007-888-abc-mac-a1-b2-c3-d4-e5-f6", "Jsm0lyGpjaVYVP2g3FnmnmG9dI/9qU24wNoykUmermc=");
    ```

    > [!CAUTION]
    > Be aware that this step leaves the derived device key included as part of the image for each device, which isn't a recommended security best practice. This is one reason why security and ease-of-use are often tradeoffs. You must fully review the security of your devices based on your own requirements.

8. Save the file.

9. Right-click the **prov\_dev\_client\_sample** project and select **Set as Startup Project**.

10. On the Visual Studio menu, select **Debug** > **Start without debugging** to run the solution. In the rebuild the project prompt, select **Yes** to rebuild the project before running.

    The following output is an example of the device successfully connecting to the provisioning Service instance to be assigned to an IoT hub:

    ```output
    Provisioning API Version: 1.9.1

    Registering Device

    Provisioning Status: PROV_DEVICE_REG_STATUS_CONNECTED
    Provisioning Status: PROV_DEVICE_REG_STATUS_ASSIGNING

    Registration Information received from service: contoso-hub-2.azure-devices.net, deviceId: sn-007-888-abc-mac-a1-b2-c3-d4-e5-f6
    Press enter key to exit:
    ```

::: zone-end

::: zone pivot="programming-language-csharp"

The sample provisioning code accomplishes the following tasks:

1. Authenticates your device with your Device Provisioning resource using the following three parameters:

    * The ID Scope of your Device Provisioning Service
    * The registration ID for your device.
    * The derived device key for your device.

2. Assigns the device to the IoT hub already linked to your Device Provisioning Service instance.

3. Sends a test message to the IoT hub.

To update and run the provisioning sample with your device information:

1. In the main menu of your Device Provisioning Service, select **Overview**.

2. Copy the **ID Scope** value.

    :::image type="content" source="./media/how-to-legacy-device-symm-key/copy-id-scope.png" alt-text="Screenshot that shows copying the ID scope from the DPS overview pane.":::

3. Open a command prompt and go to the *SymmetricKeySample* in the cloned SDK repository:

    ```cmd
    cd .\azure-iot-sdk-csharp\provisioning\device\samples\how to guides\SymmetricKeySample
    ```

4. In the *SymmetricKeySample* folder, open *Parameters.cs* in a text editor. This file shows the parameters referenced by the sample. Only the first three required parameters are used in this article when running the sample. Review the code in this file. No changes are needed.

    | Parameter                         | Required | Description     |
    | :-------------------------------- | :------- | :-------------- |
    | `--i` or `--IdScope`              | True     | The ID Scope of the DPS instance |
    | `--r` or `--RegistrationId`       | True     | The registration ID for the device. The registration ID is a case-insensitive string (up to 128 characters long) of alphanumeric characters plus the special characters: `'-'`, `'.'`, `'_'`, `':'`. The last character must be alphanumeric or dash (`'-'`). |
    | `--p` or `--PrimaryKey`           | True     | The primary key of an individual enrollment or the derived device key of a group enrollment. |
    | `--g` or `--GlobalDeviceEndpoint` | False    | The global endpoint for devices to connect to. Defaults to `global.azure-devices-provisioning.net` |
    | `--t` or `--TransportType`        | False    | The transport to use to communicate with the device provisioning instance. Defaults to `Mqtt`. Possible values include `Mqtt`, `Mqtt_WebSocket_Only`, `Mqtt_Tcp_Only`, `Amqp`, `Amqp_WebSocket_Only`, `Amqp_Tcp_only`, and `Http1`.|

5. In the *SymmetricKeySample* folder, open *ProvisioningDeviceClientSample.cs* in a text editor. This file shows how the [SecurityProviderSymmetricKey](/dotnet/api/microsoft.azure.devices.shared.securityprovidersymmetrickey?view=azure-dotnet&preserve-view=true) class works with the [ProvisioningDeviceClient](/dotnet/api/microsoft.azure.devices.provisioning.client.provisioningdeviceclient?view=azure-dotnet&preserve-view=true) class to provision your simulated symmetric key device. Review the code in this file. No changes are needed.

6. Build and run the sample code using the following command:

    * Replace `<id-scope>` with the **ID Scope** that you copied from the Azure portal.
    * Replace `<registration-id>` with the registration ID that you chose in [Choose a unique registration ID for the device](#choose-a-unique-registration-id-for-the-device).
    * Replace `<primarykey>` with the derived device key that you generated.

    ```cmd
    dotnet run --i <id-scope> --r <registration-id> --p <primarykey>
    ```

7. You should see something similar to the following output. A "TestMessage" string is sent to the hub as a test message.

     ```output
    D:\azure-iot-sdk-csharp\provisioning\device\samples\how to guides\SymmetricKeySample>dotnet run --i 0ne00000A0A --r sn-007-888-abc-mac-a1-b2-c3-d4-e5-f6 --p sbDDeEzRuEuGKag+kQKV+T1QGakRtHpsERLP0yPjwR93TrpEgEh/Y07CXstfha6dhIPWvdD1nRxK5T0KGKA+nQ==

    Initializing the device provisioning client...
    Initialized for registration Id sn-007-888-abc-mac-a1-b2-c3-d4-e5-f6.
    Registering with the device provisioning service...
    Registration status: Assigned.
    Device sn-007-888-abc-mac-a1-b2-c3-d4-e5-f6 registered to contoso-hub-2.azure-devices.net.
    Creating symmetric key authentication for IoT Hub...
    Testing the provisioned device with IoT Hub...
    Sending a telemetry message...
    Finished.
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

2. Copy the **ID Scope** value.

    :::image type="content" source="./media/how-to-legacy-device-symm-key/copy-id-scope.png" alt-text="Screenshot that shows copying the ID scope from the DPS overview pane.":::

3. Open a command prompt for executing Node.js commands, and go to the following directory:

    ```cmd
    cd azure-iot-sdk-node\provisioning\device\samples
    ```

4. In the *provisioning/device/samples* folder, open *register_symkey.js* and review the code.

    The sample defaults to MQTT as the transport protocol. If you want to use a different protocol, comment out the following line and uncomment the line for the appropriate protocol.

    ```javascript
    var ProvisioningTransport = require('azure-iot-provisioning-device-mqtt').Mqtt;
    ```

    Notice, also, that the sample code sets a custom payload:

    ```nodejs
    provisioningClient.setProvisioningPayload({a: 'b'});
    ```

    You may comment out this code, as it's not needed with for this tutorial. You can use a custom payload when you use a custom allocation webhook to assign your device to an IoT Hub. For more information, see [Tutorial: Use custom allocation policies](tutorial-custom-allocation-policies.md).

    The `provisioningClient.register()` method attempts the registration of your device.

5. In the command prompt, run the following commands to set environment variables used by the sample:

    * The first command sets the `PROVISIONING_HOST` environment variable to the **Global device endpoint**. This endpoint is the same for all DPS instances.
    * Replace `<id-scope>` with the **ID Scope** that you copied from the Azure portal.
    * Replace `<registration-id>` with the registration ID that you chose in [Choose a unique registration ID for the device](#choose-a-unique-registration-id-for-the-device).
    * Replace `<derived-device-key>` with the derived device key that you generated in [Derive a device key](#derive-a-device-key).

    ```cmd
    set PROVISIONING_HOST=global.azure-devices-provisioning.net
    ```

    ```cmd
    set PROVISIONING_IDSCOPE=<id-scope>
    ```

    ```cmd
    set PROVISIONING_REGISTRATION_ID=<registration-id>
    ```

    ```cmd
    set PROVISIONING_SYMMETRIC_KEY=<derived-device-key>
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
    registration succeeded
    assigned hub=contoso-hub-2.azure-devices.net
    deviceId=sn-007-888-abc-mac-a1-b2-c3-d4-e5-f6
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

3. Sends a test message to the IoT hub.

To update and run the provisioning sample with your device information:

1. In the main menu of your Device Provisioning Service, select **Overview**.

2. Copy the **ID Scope** value.

    :::image type="content" source="./media/how-to-legacy-device-symm-key/copy-id-scope.png" alt-text="Screenshot that shows copying the ID scope from the DPS overview pane.":::

3. Open a command prompt and go to the directory where the sample file, _provision_symmetric_key.py_, is located.

   ```cmd
   cd azure-iot-sdk-python\samples\async-hub-scenarios
   ```

4. In the command prompt, run the following commands to set environment variables used by the sample:

    * The first command sets the `PROVISIONING_HOST` environment variable to the **Global device endpoint**. This endpoint is the same for all DPS instances.
    * Replace `<id-scope>` with the **ID Scope** that you copied from the Azure portal.
    * Replace `<registration-id>` with the registration ID that you chose in [Choose a unique registration ID for the device](#choose-a-unique-registration-id-for-the-device).
    * Replace `<derived-device-key>` with the derived device key that you generated in [Derive a device key](#derive-a-device-key).

    ```cmd
    set PROVISIONING_HOST=global.azure-devices-provisioning.net
    ```

    ```cmd
    set PROVISIONING_IDSCOPE=<id-scope>
    ```

    ```cmd
    set PROVISIONING_REGISTRATION_ID=<registration-id>
    ```

    ```cmd
    set PROVISIONING_SYMMETRIC_KEY=<derived-device-key>
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
    The complete registration result is
    sn-007-888-abc-mac-a1-b2-c3-d4-e5-f6
    contoso-hub-2.azure-devices.net
    initialAssignment
    null
    Will send telemetry from the provisioned device
    sending message #1
    sending message #2
    sending message #3
    sending message #4
    sending message #5
    sending message #6
    sending message #7
    sending message #8
    sending message #9
    sending message #10
    done sending message #1
    done sending message #2
    done sending message #3
    done sending message #4
    done sending message #5
    done sending message #6
    done sending message #7
    done sending message #8
    done sending message #9
    done sending message #10
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

3. Sends a test message to the IoT hub.

To update and run the provisioning sample with your device information:

1. In the main menu of your Device Provisioning Service, select **Overview**.

2. Copy the **ID Scope** value.

    :::image type="content" source="./media/how-to-legacy-device-symm-key/copy-id-scope.png" alt-text="Screenshot that shows copying the ID scope from the DPS overview pane.":::

3. Open the Java device sample code for editing. The full path to the device sample code is:

    `azure-iot-sdk-java/provisioning/provisioning-samples/provisioning-symmetrickey-individual-sample/src/main/java/samples/com/microsoft/azure/sdk/iot/ProvisioningSymmetricKeyIndividualEnrollmentSample.java`

4. Set the value of the following variables for your DPS and device enrollment:

    * Replace `[Your scope ID here]` with the **ID Scope** that you copied from the Azure portal.
    * Replace `[Your Provisioning Service Global Endpoint here]` with the **Global device endpoint**: global.azure-devices-provisioning.net. This endpoint is the same for all DPS instances.
    * Replace `[Enter your Symmetric Key here]` with the derived device key that you generated in [Derive a device key](#derive-a-device-key).
    * Replace `[Enter your Registration ID here]` with the registration ID that you chose in [Choose a unique registration ID for the device](#choose-a-unique-registration-id-for-the-device).

    ```java
    private static final String SCOPE_ID = "[Your scope ID here]";
    private static final String GLOBAL_ENDPOINT = "[Your Provisioning Service Global Endpoint here]";
    private static final String SYMMETRIC_KEY = "[Enter your Symmetric Key here]";
    private static final String REGISTRATION_ID = "[Enter your Registration ID here]";
    ```

    > [!CAUTION]
    > Be aware that this step leaves the derived device key included as part of the image for each device, which isn't a recommended security best practice. This is one reason why security and ease-of-use are often tradeoffs. You must fully review the security of your devices based on your own requirements.

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
    WARNING: sun.reflect.Reflection.getCallerClass is not supported. This will impact performance.
    2022-10-07 18:14:48,388 DEBUG (main) [com.microsoft.azure.sdk.iot.provisioning.device.ProvisioningDeviceClient] - Initialized a ProvisioningDeviceClient instance using SDK version 2.0.2
    2022-10-07 18:14:48,390 DEBUG (main) [com.microsoft.azure.sdk.iot.provisioning.device.ProvisioningDeviceClient] - Starting provisioning thread...
    Waiting for Provisioning Service to register
    2022-10-07 18:14:48,392 INFO (global.azure-devices-provisioning.net-002edcf5-CxnPendingConnectionId-azure-iot-sdk-ProvisioningTask) [com.microsoft.azure.sdk.iot.provisioning.device.internal.task.ProvisioningTask] - Opening the connection to device provisioning service...
    2022-10-07 18:14:48,518 INFO (global.azure-devices-provisioning.net-002edcf5-Cxn002edcf5-azure-iot-sdk-ProvisioningTask) [com.microsoft.azure.sdk.iot.provisioning.device.internal.task.ProvisioningTask] - Connection to device provisioning service opened successfully, sending initial device registration message
    2022-10-07 18:14:48,521 INFO (global.azure-devices-provisioning.net-002edcf5-Cxn002edcf5-azure-iot-sdk-RegisterTask) [com.microsoft.azure.sdk.iot.provisioning.device.internal.task.RegisterTask] - Authenticating with device provisioning service using symmetric key
    2022-10-07 18:14:49,252 INFO (global.azure-devices-provisioning.net-002edcf5-Cxn002edcf5-azure-iot-sdk-ProvisioningTask) [com.microsoft.azure.sdk.iot.provisioning.device.internal.task.ProvisioningTask] - Waiting for device provisioning service to provision this device...
    2022-10-07 18:14:49,253 INFO (global.azure-devices-provisioning.net-002edcf5-Cxn002edcf5-azure-iot-sdk-ProvisioningTask) [com.microsoft.azure.sdk.iot.provisioning.device.internal.task.ProvisioningTask] - Current provisioning status: ASSIGNING
    2022-10-07 18:14:52,459 INFO (global.azure-devices-provisioning.net-002edcf5-Cxn002edcf5-azure-iot-sdk-ProvisioningTask) [com.microsoft.azure.sdk.iot.provisioning.device.internal.task.ProvisioningTask] - Device provisioning service assigned the device successfully
    IotHUb Uri : contoso-hub-2.azure-devices.net
    Device ID : sn-007-888-abc-mac-a1-b2-c3-d4-e5-f6
    2022-10-07 18:14:58,424 INFO (main) [com.microsoft.azure.sdk.iot.device.transport.ExponentialBackoffWithJitter] - NOTE: A new instance of ExponentialBackoffWithJitter has been created with the following properties. Retry Count: 2147483647, Min Backoff Interval: 100, Max Backoff Interval: 10000, Max Time Between Retries: 100, Fast Retry Enabled: true
    2022-10-07 18:14:58,436 INFO (main) [com.microsoft.azure.sdk.iot.device.transport.ExponentialBackoffWithJitter] - NOTE: A new instance of ExponentialBackoffWithJitter has been created with the following properties. Retry Count: 2147483647, Min Backoff Interval: 100, Max Backoff Interval: 10000, Max Time Between Retries: 100, Fast Retry Enabled: true
    2022-10-07 18:14:58,440 DEBUG (main) [com.microsoft.azure.sdk.iot.device.DeviceClient] - Initialized a DeviceClient instance using SDK version 2.1.1
    2022-10-07 18:14:58,450 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.mqtt.MqttIotHubConnection] - Opening MQTT connection...
    2022-10-07 18:14:58,471 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.mqtt.Mqtt] - Sending MQTT CONNECT packet...
    2022-10-07 18:14:59,314 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.mqtt.Mqtt] - Sent MQTT CONNECT packet was acknowledged
    2022-10-07 18:14:59,315 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.mqtt.Mqtt] - Sending MQTT SUBSCRIBE packet for topic devices/sn-007-888-abc-mac-a1-b2-c3-d4-e5-f6/messages/devicebound/#
    2022-10-07 18:14:59,378 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.mqtt.Mqtt] - Sent MQTT SUBSCRIBE packet for topic devices/sn-007-888-abc-mac-a1-b2-c3-d4-e5-f6/messages/devicebound/# was acknowledged
    2022-10-07 18:14:59,379 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.mqtt.MqttIotHubConnection] - MQTT connection opened successfully
    2022-10-07 18:14:59,381 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.IotHubTransport] - The connection to the IoT Hub has been established
    2022-10-07 18:14:59,383 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.IotHubTransport] - Updating transport status to new status CONNECTED with reason CONNECTION_OK
    2022-10-07 18:14:59,389 DEBUG (main) [com.microsoft.azure.sdk.iot.device.DeviceIO] - Starting worker threads
    2022-10-07 18:14:59,392 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.IotHubTransport] - Invoking connection status callbacks with new status details
    2022-10-07 18:14:59,395 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.IotHubTransport] - Client connection opened successfully
    2022-10-07 18:14:59,404 INFO (main) [com.microsoft.azure.sdk.iot.device.DeviceClient] - Device client opened successfully
    Sending message from device to IoT Hub...
    2022-10-07 18:14:59,408 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.IotHubTransport] - Message was queued to be sent later ( Message details: Correlation Id [aaaa0000-bb11-2222-33cc-444444dddddd] Message Id [aaaa0000-bb11-2222-33cc-444444dddddd] )
    Press any key to exit...
    2022-10-07 18:14:59,409 DEBUG (contoso-hub-2.azure-devices.net-sn-007-888-abc-mac-a1-b2-c3-d4-e5-f6-c32c76d0-Cxn0e70bbf7-8476-441d-8626-c17250585ee6-azure-iot-sdk-IotHubSendTask) [com.microsoft.azure.sdk.iot.device.transport.IotHubTransport] - Sending message ( Message details: Correlation Id [aaaa0000-bb11-2222-33cc-444444dddddd] Message Id [aaaa0000-bb11-2222-33cc-444444dddddd] )
    2022-10-07 18:14:59,777 DEBUG (MQTT Call: sn-007-888-abc-mac-a1-b2-c3-d4-e5-f6) [com.microsoft.azure.sdk.iot.device.transport.IotHubTransport] - IotHub message was acknowledged. Checking if there is record of sending this message ( Message details: Correlation Id [aaaa0000-bb11-2222-33cc-444444dddddd] Message Id [aaaa0000-bb11-2222-33cc-444444dddddd] )
    2022-10-07 18:14:59,779 DEBUG (contoso-hub-2.azure-devices.net-sn-007-888-abc-mac-a1-b2-c3-d4-e5-f6-c32c76d0-Cxn0e70bbf7-8476-441d-8626-c17250585ee6-azure-iot-sdk-IotHubSendTask) [com.microsoft.azure.sdk.iot.device.transport.IotHubTransport] - Invoking the callback function for sent message, IoT Hub responded to message ( Message details: Correlation Id [aaaa0000-bb11-2222-33cc-444444dddddd] Message Id [aaaa0000-bb11-2222-33cc-444444dddddd] ) with status OK
    Message received! Response status: OK
    ```

::: zone-end

## Confirm your device provisioning registration

In this tutorial, you used the *Static configuration* allocation policy to assign devices that register through the enrollment group to the same IoT hub. However, for allocations where a device might be provisioned to one of several IoT hubs, you can examine the enrollment group's registration records to see which IoT hub the device was provisioned to:

1. In the Azure portal, go to your DPS instance.

1. In the **Settings** menu, select **Manage enrollments**.

1. Select **Enrollment groups**.

1. Select the enrollment group you created for this tutorial.

1. On the **Enrollment Group Details** page, select **Registration status**.

1. Find the device ID for your device **Device Id** column and note down the IoT hub in the **Assigned IoT hub** column.

   You can select the device record to see more details like the initial twin assigned to the device.

To verify the device on your IoT hub:

1. In the Azure portal, go to the IoT hub that your device was assigned to.

1. In the **Device management** menu, select **Devices**.

1. If your device was provisioned successfully, its device ID should appear in the list, with **Status** set as *enabled*. If you don't see your device, select **Refresh**.

    :::image type="content" source="./media/how-to-legacy-device-symm-key/hub-registration.png" alt-text="Device is registered with the IoT hub":::

> [!NOTE]
> If you changed the *initial device twin state* from the default value in the enrollment group, a device can pull the desired twin state from the hub and act accordingly. For more information, see [Understand and use device twins in IoT Hub](../iot-hub/iot-hub-devguide-device-twins.md).

## Provision more devices

To provision more devices through the enrollment group, follow the steps in the preceding sections to:

1. [Choose a unique registration ID for the device](#choose-a-unique-registration-id-for-the-device).

1. [Derive a device key](#derive-a-device-key). As you did previously, use the primary key for the enrollment group as the group key.

1. [Run the device provisioning code](#prepare-and-run-the-device-provisioning-code). Replace the necessary artifacts with your new derived device key and registration ID.

## Clean up resources

If you plan to continue working on and exploring the device client sample, don't clean up the resources created in this tutorial. If you don't plan to continue, use the following steps to delete all resources created in this tutorial.

### Delete your enrollment group

Deleting an enrollment group doesn't delete the registration records associated with it. These orphaned records count against the [registrations quota](about-iot-dps.md#quotas-and-limits) for the DPS instance. For this reason, it's a best practice to delete all registration records associated with an enrollment group before you delete the enrollment group itself.

1. In the Azure portal, go to your DPS instance.

1. In the **Settings** menu, select **Manage enrollments**.

1. Select the **Enrollment groups** tab.

1. Select the name of the enrollment group you used for this tutorial to open its details page.

1. On the **Enrollment details** page, select **Registration status**. Then select the check box next to the **Device Id** column header to select all of the registration records for the enrollment group. Select **Delete** at the top of the page to delete the registration records.

1. Go back to the **Manage enrollments** page.

1. Select the check box next to the name of the enrollment group you used for this tutorial.

1. At the top of the page, select  **Delete**.

### Delete device registrations from IoT Hub

1. In the Azure portal, go to the IoT hub that your device was assigned to.

1. Select **Devices** from the **Device management** section of the navigation menu.

1. Select the check box next to the device ID of the devices you registered in this tutorial.

1. At the top of the page, select  **Delete**.

## Next steps

In this tutorial, you provisioned multiple devices to a single IoT hub using an enrollment group. Next, learn how to provision IoT devices across multiple hubs.

> [!div class="nextstepaction"]
> [Tutorial: Manage IoT hub assignment with custom allocation policies](tutorial-custom-allocation-policies.md)
