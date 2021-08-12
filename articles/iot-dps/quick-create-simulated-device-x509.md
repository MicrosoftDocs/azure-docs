---
title: Quickstart - Provision an X.509 certificate device
description: Learn how to provision a device that authenticates with an X.509 certificate in the Azure IoT Hub Device Provisioning Service (DPS)
author: anastasia-ms
ms.author: v-stharr
ms.date: 08/12/2021
ms.topic: quickstart
ms.service: iot-dps
services: iot-dps 
manager: lizross
ms.custom: mvc
zone_pivot_groups: iot-dps-set1

#Customer intent: As a new IoT developer, I want to simulate an X.509 certificate device using the SDK, to learn how secure provisioning works.
---

# Quickstart: Provision an X.509 certificate device

In this quickstart, you'll create a simulated device on your Windows machine. The simulated device will be configured to use the [X.509 certificate attestation](concepts-x509-attestation.md) mechanism for authentication. After you've configured your device, you'll then provision it to your IoT hub using the Azure IoT Hub Device Provisioning service.

If you're unfamiliar with the process of provisioning, review the [provisioning](about-iot-dps.md#provisioning-process) overview.

This quickstart demonstrates a solution for a Windows-based workstation. However, you can also perform the procedures on Linux. For a Linux example, see [How to provision for multitenancy](how-to-provision-multitenant.md).

>[!NOTE]
>The Azure IoT Device Provisioning Service supports two types of enrollments:
>
>* [Enrollment groups](concepts-service.md#enrollment-group): Used to enroll multiple related devices.
>* [Individual Enrollments](concepts-service.md#individual-enrollment): Used to enroll a single device.
>
>This quickstart demonstrates individual enrollments.

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

* Complete the steps in [Set up IoT Hub Device Provisioning Service with the Azure portal](./quick-setup-auto-provision.md).

The following prerequisites are for a Windows development environment. For Linux or macOS, see the appropriate section in [Prepare your development environment](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/devbox_setup.md) in the SDK documentation.

::: zone pivot="programming-language-ansi-c"

* If you're using a Windows development environment, install [Visual Studio](https://visualstudio.microsoft.com/vs/) 2019 with the ['Desktop development with C++'](/cpp/ide/using-the-visual-studio-ide-for-cpp-desktop-development) workload enabled. Visual Studio 2015 and Visual Studio 2017 are also supported. For Linux or macOS, see the appropriate section in [Prepare your development environment](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/devbox_setup.md) in the SDK documentation.

::: zone-end

::: zone pivot="programming-language-csharp"

* Install [.NET Core 3.1 SDK or later](https://dotnet.microsoft.com/download) or later on your Windows-based machine. You can use the following command to check your version.

    ```bash
    dotnet --info
    ```

::: zone-end

* Install the latest version of [Git](https://git-scm.com/download/). Make sure that Git is added to the environment variables accessible to the command window. See [Software Freedom Conservancy's Git client tools](https://git-scm.com/download/) for the latest version of `git` tools to install, which includes *Git Bash*, the command-line app that you can use to interact with your local Git repository.

## Prepare your development environment

::: zone pivot="programming-language-ansi-c"

In this section, you'll prepare a development environment that's used to build the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c). The sample code attempts to provision the device, during the device's boot sequence.

1. Download the latest [CMake build system](https://cmake.org/download/).

    >[!IMPORTANT]
    >Confirm that the Visual Studio prerequisites (Visual Studio and the 'Desktop development with C++' workload) are installed on your machine, **before** starting the `CMake` installation. Once the prerequisites are in place, and the download is verified, install the CMake build system. Also, be aware that older versions of the CMake build system fail to generate the solution file used in this article. Make sure to use the latest version of CMake.

2. Open a web browser, and go to the [Release page of the Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c/releases/latest).

3. Select the **Tags** tab at the top of the page.

4. Copy the tag name for the latest release of the Azure IoT C SDK.

5. Open a command prompt or Git Bash shell. Run the following commands to clone the latest release of the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c) GitHub repository. (replace `<release-tag>` with the tag you copied in the previous step).

    ```cmd/sh
    git clone -b <release-tag> https://github.com/Azure/azure-iot-sdk-c.git
    cd azure-iot-sdk-c
    git submodule update --init
    ```

    This operation could take several minutes to complete.

6. When the operation is complete, run the following commands from the `azure-iot-sdk-c` directory:

    ```cmd/sh
    mkdir cmake
    cd cmake
    ```

7. The code sample uses an X.509 certificate to provide attestation via X.509 authentication. Run the following command to build a version of the SDK specific to your development platform that includes the device provisioning client. A Visual Studio solution for the simulated device is generated in the `cmake` directory.

    ```cmd
    cmake -Duse_prov_client:BOOL=ON ..
    ```

    >[!TIP]
    >If `cmake` does not find your C++ compiler, you may get build errors while running the above command. If that happens, try running the command in the [Visual Studio command prompt](/dotnet/framework/tools/developer-command-prompt-for-vs).

8. When the build succeeds, the last few output lines look similar to the following output:

    ```cmd/sh
    $ cmake -Duse_prov_client:BOOL=ON ..
    -- Building for: Visual Studio 16 2019
    -- The C compiler identification is MSVC 19.23.28107.0
    -- The CXX compiler identification is MSVC 19.23.28107.0

    ...

    -- Configuring done
    -- Generating done
    -- Build files have been written to: C:/code/azure-iot-sdk-c/cmake
    ```

::: zone-end

::: zone pivot="programming-language-csharp"

1. Open a Git CMD or Git Bash command line environment.

2. Clone the [Azure IoT Samples for C#](https://github.com/Azure-Samples/azure-iot-samples-csharp) GitHub repository using the following command:

    ```cmd
    git clone https://github.com/Azure-Samples/azure-iot-samples-csharp.git
    ```

::: zone-end

## Create a self-signed X.509 device certificate

In this section, you'll use sample code from the Azure IoT SDK to create a self-signed X.509 certificate. This certificate will then be used to authenticate the device with its individual enrollment entry.

>[!IMPORTANT]
>
>* Self-signed certificates are for testing only, and should not be used in production.
>* The default expiration date for a self-signed certificate is one year.
::: zone pivot="programming-language-csharp"
>* The device ID of the IoT device will be the subject common name on the certificate. Make sure to use a subject name that complies with the [Device ID string requirements](../iot-hub/iot-hub-devguide-identity-registry.md#device-identity-properties).
::: zone-end

To create the X.509 certificate:

::: zone pivot="programming-language-ansi-c"

1. In Visual Studio, open `azure_iot_sdks.sln`. This solution file is located in the `cmake` folder you previously created in the root of the azure-iot-sdk-c git repository.

2. On the Visual Studio menu, select **Build** > **Build Solution** to build all projects in the solution.

3. In Visual Studio's *Solution Explorer* window, navigate to the **Provision\_Tools** folder. Right-click the **dice\_device\_enrollment** project and select **Set as Startup Project**.

4. On the Visual Studio menu, select **Debug** > **Start without debugging** to run the solution. In the output window, enter **i** for individual enrollment when prompted.

    The output window displays a locally generated self-signed X.509 certificate for your simulated device. Copy the output to clipboard, starting from **-----BEGIN CERTIFICATE-----** and ending with the first **-----END CERTIFICATE-----**, making sure to include both of these lines as well. You need only the first certificate from the output window.

5. Using a text editor, save the certificate to a new file named *_X509testcert.pem_*.

::: zone-end

::: zone pivot="programming-language-ansi-c"

1. In a PowerShell prompt, change directories to the project directory for the X.509 device provisioning sample.

    ```powershell
    cd .\azure-iot-samples-csharp\provisioning\Samples\device\X509Sample
    ```

2. The sample code is set up to use X.509 certificates that are stored within a password-protected PKCS12 formatted file (`certificate.pfx`). Additionally, you'll need a public key certificate file (`certificate.cer`) to create an individual enrollment later in this quickstart. To generate the self-signed certificate and its associated `.cer` and `.pfx` files, run the following command:

    ```powershell
    PS D:\azure-iot-samples-csharp\provisioning\Samples\device\X509Sample> .\GenerateTestCertificate.ps1 iothubx509device1
    ```

3. The script prompts you for a PFX password. Remember this password, as you will use it later when you run the sample. Optionally, you can run `certutil` to dump the certificate and verify the subject name.

    ```powershell
    PS D:\azure-iot-samples-csharp\provisioning\Samples\device\X509Sample> certutil .\certificate.pfx
    Enter PFX password:
    ================ Certificate 0 ================
    ================ Begin Nesting Level 1 ================
    Element 0:
    Serial Number: 7b4a0e2af6f40eae4d91b3b7ff05a4ce
    Issuer: CN=iothubx509device1, O=TEST, C=US
     NotBefore: 2/1/2021 6:18 PM
     NotAfter: 2/1/2022 6:28 PM
    Subject: CN=iothubx509device1, O=TEST, C=US
    Signature matches Public Key
    Root Certificate: Subject matches Issuer
    Cert Hash(sha1): e3eb7b7cc1e2b601486bf8a733887a54cdab8ed6
    ----------------  End Nesting Level 1  ----------------
      Provider = Microsoft Strong Cryptographic Provider
    Signature test passed
    CertUtil: -dump command completed successfully.    
    ```

::: zone-end

## Create a device enrollment

1. Sign in to the [Azure portal](https://portal.azure.com).

2. On the left-hand menu or on the portal page, select **All resources**.

3. Select your Device Provisioning service.

4. In the **Settings** menu, select **Manage enrollments**.

5. At the top of the page, select **+ Add individual enrollment**.

6. In the **Add Enrollment** page, enter the following information.

    * **Mechanism:** Select **X.509** as the identity attestation *Mechanism*.
    * **Primary certificate .pem or .cer file:** Choose **Select a file** to select the certificate file, *X509testcert.pem*, you created earlier.

::: zone pivot="programming-language-ansi-c"

* **IoT Hub Device ID:** Enter *test-docs-cert-device* to give the device an ID.

    [![Add individual enrollment for X.509 attestation in the portal](./media/quick-create-simulated-device-x509/device-enrollment.png)](./media/quick-create-simulated-device-x509/device-enrollment.png#lightbox)

    Upon successful enrollment, your X.509 device appears as **riot-device-cert** under the *Registration ID* column in the *Individual Enrollments* tab.

::: zone-end

::: zone pivot="programming-language-csharp"
    * Leave **Device ID** blank. Your device will be provisioned with its device ID set to the common name (CN) in the X.509 certificate, **iothubx509device1**. This common name will also be the name used for the registration ID for the individual enrollment entry. 

    * Optionally, you can provide the following information:

       - Select an IoT hub linked with your provisioning service.
       - Update the **Initial device twin state** with the desired initial configuration for the device.
   
     [![Add individual enrollment for X.509 attestation in the portal](./media/quick-create-simulated-device-x509-csharp/device-enrollment.png)](./media/quick-create-simulated-device-x509-csharp/device-enrollment.png#lightbox)

   On successful enrollment, your X.509 enrollment entry appears as **iothubx509device1** under the *Registration ID* column in the *Individual Enrollments* tab.
::: zone-end

7. Select **Save**.

## Prepare and run the device provisioning code

::: zone pivot="programming-language-ansi-c"

In this section, update the sample code to send the device's boot sequence to your Device Provisioning Service instance. This boot sequence will cause the device to be recognized and assigned to an IoT hub linked to the Device Provisioning Service instance.

1. In the Azure portal, select the **Overview** tab for your Device Provisioning service and note the **_ID Scope_** value.

    ![Extract Device Provisioning Service endpoint information from the portal blade](./media/quick-create-simulated-device-x509/extract-dps-endpoints.png) 

2. In Visual Studio's *Solution Explorer* window, navigate to the **Provision\_Samples** folder. Expand the sample project named **prov\_dev\_client\_sample**. Expand **Source Files**, and open **prov\_dev\_client\_sample.c**.

3. Find the `id_scope` constant, and replace the value with your **ID Scope** value that you copied earlier. 

    ```c
    static const char* id_scope = "0ne00002193";
    ```

4. Find the definition for the `main()` function in the same file. Make sure the `hsm_type` variable is set to `SECURE_DEVICE_TYPE_X509` instead of `SECURE_DEVICE_TYPE_TPM` as shown below.

    ```c
    SECURE_DEVICE_TYPE hsm_type;
    //hsm_type = SECURE_DEVICE_TYPE_TPM;
    hsm_type = SECURE_DEVICE_TYPE_X509;
    ```

5. Right-click the **prov\_dev\_client\_sample** project and select **Set as Startup Project**.

6. On the Visual Studio menu, select **Debug** > **Start without debugging** to run the solution. In the prompt to rebuild the project, select **Yes** to rebuild the project before running.

    The following output is an example of the provisioning device client sample successfully booting up, and connecting to the provisioning Service instance to get IoT hub information and registering:

    ```cmd
    Provisioning API Version: 1.2.7

    Registering... Press enter key to interrupt.

    Provisioning Status: PROV_DEVICE_REG_STATUS_CONNECTED
    Provisioning Status: PROV_DEVICE_REG_STATUS_ASSIGNING
    Provisioning Status: PROV_DEVICE_REG_STATUS_ASSIGNING

    Registration Information received from service:
    test-docs-hub.azure-devices.net, deviceId: test-docs-cert-device
    ```

::: zone-end

::: zone pivot="programming-language-csharp"

1. From the **Overview** blade for your provisioning service, note the **_ID Scope_** value.

    ![Extract Device Provisioning Service endpoint information from the portal blade](./media/quick-create-simulated-device-x509-csharp/copy-scope.png) 

2. Type the following command to build and run the X.509 device provisioning sample. Replace the `<IDScope>` value with the ID Scope for your provisioning service. 

    The certificate file will default to *./certificate.pfx* and prompt for the .pfx password.  

    ```powershell
    dotnet run -- -s <IDScope>
    ```

    If you want to pass everything as a parameter, you can use the following example format.

    ```powershell
    dotnet run -- -s 0ne00000A0A -c certificate.pfx -p 1234
    ```

3. The device will connect to DPS and be assigned to an IoT Hub. The device will send a telemetry message to the hub.

    ```output
    Loading the certificate...
    Found certificate: 10952E59D13A3E388F88E534444484F52CD3D9E4 CN=iothubx509device1, O=TEST, C=US; PrivateKey: True
    Using certificate 10952E59D13A3E388F88E534444484F52CD3D9E4 CN=iothubx509device1, O=TEST, C=US
    Initializing the device provisioning client...
    Initialized for registration Id iothubx509device1.
    Registering with the device provisioning service...
    Registration status: Assigned.
    Device iothubx509device2 registered to sample-iot-hub1.azure-devices.net.
    Creating X509 authentication for IoT Hub...
    Testing the provisioned device with IoT Hub...
    Sending a telemetry message...
    Finished.
    ```

::: zone-end

## Confirm your device provisioning registration

1. Go to the [Azure portal](https://portal.azure.com).

2. On the left-hand menu or on the portal page, select **All resources**.

3. Select the IoT hub to which your device was assigned.

4. In the **Explorers** menu, select **IoT Devices**.

5. If your device was provisioned successfully, the device ID should appear in the list, with **Status** set as *enabled*. If you don't see your device, select **Refresh** at the top of the page.

    :::image type="content" border="false" source="./media/quick-create-simulated-device-x509/hub-registration.png" alt-text="[Device is registered with the IoT hub":::


::: zone pivot="programming-language-csharp"

>[!IMPORTANT]
>If you changed the *initial device twin state* from the default value in the enrollment entry for your device, it can pull the desired twin state from the hub and act accordingly. For more information, see [Understand and use device twins in IoT Hub](../iot-hub/iot-hub-devguide-device-twins.md)

::: zone-end

## Clean up resources

If you plan to continue working on and exploring the device client sample, don't clean up the resources created in this quickstart. If you don't plan to continue, use the following steps to delete all resources created by this quickstart.

### Delete your device enrollment

1. Close the device client sample output window on your machine.

2. From the left-hand menu in the Azure portal, select **All resources**.

3. Select your Device Provisioning service.

4. In the **Settings** menu, select **Manage enrollments**.

5. Select the **Individual Enrollments** tab.

6. Select the check box next to the *REGISTRATION ID* of the device you enrolled in this quickstart.

7. At the top of the page, select  **Delete**.

### Delete your device registration from IoT Hub

1. From the left-hand menu in the Azure portal, select **All resources**.

2. Select your IoT hub.

3. In the **Explorers** menu, select **IoT devices**.

4. Select the check box next to the *DEVICE ID* of the device you registered in this quickstart.

5. At the top of the page, select  **Delete**.

## Next steps

To learn how to enroll your X.509 device programmatically:

> [!div class="nextstepaction"]
> [Azure quickstart - Enroll X.509 devices to Azure IoT Hub Device Provisioning Service](quick-enroll-device-x509-java.md)