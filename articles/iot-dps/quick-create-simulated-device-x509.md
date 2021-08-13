---
title: Quickstart:Provision an X.509 certificate device
description: Learn how to provision a device that authenticates with an X.509 certificate in the Azure IoT Hub Device Provisioning Service (DPS)
author: anastasia-ms
ms.author: v-stharr
ms.date: 08/13/2021
ms.topic: quickstart
ms.service: iot-dps
services: iot-dps 
manager: lizross
ms.custom: mvc
zone_pivot_groups: iot-dps-set1

#Customer intent: As a new IoT developer, I want to simulate an X.509 certificate device using the SDK, to learn how secure provisioning works.
---

# Quickstart: Provision an X.509 certificate device

In this quickstart, you'll create a simulated device on your Windows machine. The simulated device will be configured to use the [X.509 certificate attestation](concepts-x509-attestation.md) mechanism for authentication. After you've configured your device, you'll then provision it to your IoT hub using the Azure IoT Hub Device Provisioning Service.

If you're unfamiliar with the process of provisioning, review the [provisioning](about-iot-dps.md#provisioning-process) overview.

This quickstart demonstrates a solution for a Windows-based workstation. However, you can also perform the procedures on Linux. For a Linux example, see [How to provision for multitenancy](how-to-provision-multitenant.md).

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

::: zone pivot="programming-language-nodejs"

* Install [Node.js v4.0 or above](https://nodejs.org) or later on your machine.

* Install [OpenSSL](https://www.openssl.org/) on your machine and is added to the environment variables accessible to the command window. This library can either be built and installed from source or downloaded and installed from a [third party](https://wiki.openssl.org/index.php/Binaries) such as [this](https://sourceforge.net/projects/openssl/).

::: zone-end

::: zone pivot="programming-language-python"

* [Python 3.6 or later](https://www.python.org/downloads/) or later on your machine.

* Install [OpenSSL](https://www.openssl.org/) on your machine and is added to the environment variables accessible to the command window. This library can either be built and installed from source or downloaded and installed from a [third party](https://wiki.openssl.org/index.php/Binaries) such as [this](https://sourceforge.net/projects/openssl/).

::: zone-end

::: zone pivot="programming-language-java"

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

::: zone pivot="programming-language-nodejs"

1. Open a Git CMD or Git Bash command line environment.

2. Clone the [Azure IoT Samples for Node.js](https://github.com/Azure/azure-iot-sdk-node.git) GitHub repository using the following command:

    ```cmd
    git clone https://github.com/Azure/azure-iot-sdk-node.git
    ```

::: zone-end

::: zone pivot="programming-language-python"

1. Open a Git CMD or Git Bash command line environment.

2. Clone the [Azure IoT Samples for Python](https://github.com/Azure/azure-iot-sdk-node.git) GitHub repository using the following command:

    ```cmd
    git clone https://github.com/Azure/azure-iot-sdk-python.git --recursive
    ```

::: zone-end

::: zone pivot="programming-language-java"


::: zone-end

## Create a self-signed X.509 device certificate

In this section, you'll use sample code from the Azure IoT SDK to create a self-signed X.509 certificate. This certificate will then be used to authenticate the device with its individual enrollment entry.

It is important to note that:

* Self-signed certificates are for testing only, and should not be used in production.

* The default expiration date for a self-signed certificate is one year.

::: zone pivot="programming-language-csharp"

* The device ID of the IoT device will be the subject common name on the certificate. Make sure to use a subject name that complies with the [Device ID string requirements](../iot-hub/iot-hub-devguide-identity-registry.md#device-identity-properties).

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

::: zone pivot="programming-language-csharp"

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

::: zone pivot="programming-language-nodejs"

1. Open a command prompt, and go to the certificate generator script and build the project:

    ```cmd/sh
    cd azure-iot-sdk-node/provisioning/tools
    npm install
    ```

2. Create a _leaf_ X.509 certificate by running the script using your own _certificate-name_. The leaf certificate's common name becomes the [Registration ID](./concepts-service.md#registration-id) so be sure to only use lower-case alphanumerics and hyphens.

    ```cmd/sh
    node create_test_cert.js device {certificate-name}
    ```

::: zone-end

::: zone pivot="programming-language-python"

1. In thew Git Bash prompt, run the folllowing command:

    # [Windows](#tab/windows)
    
    ```bash
    winpty openssl req -outform PEM -x509 -sha256 -newkey rsa:4096 -keyout ./python-device.key.pem -out ./python-device.pem -days 365 -extensions usr_cert -subj "//CN=Python-device-01"
    ```

    > [!IMPORTANT]
    > The extra forward slash given for the subject name (`//CN=Python-device-01`) is only required to escape the string with Git on Windows platforms.

    # [Linux](#tab/linux)
    
    ```bash
    openssl req -outform PEM -x509 -sha256 -newkey rsa:4096 -keyout ./python-device.key.pem -out ./python-device.pem -days 365 -extensions usr_cert -subj "/CN=Python-device-01"
    ```

    ---
    
2. When asked to **Enter PEM pass phrase:**, use the pass phrase `1234`.

3. When asked **Verifying - Enter PEM pass phrase:**, use the pass phrase `1234` again.

A test certificate file (*python-device.pem*) and private key file (*python-device.key.pem*) should now be generated in the directory where you ran the `openssl` command.

::: zone-end

::: zone pivot="programming-language-java"

::: zone-end

## Create a device enrollment

The Azure IoT Device Provisioning Service supports two types of enrollments:

* [Enrollment groups](concepts-service.md#enrollment-group): Used to enroll multiple related devices.
* [Individual enrollments](concepts-service.md#individual-enrollment): Used to enroll a single device.

This article demonstrates an individual enrollment for a single device to be provisioned with an IoT hub.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. On the left-hand menu or on the portal page, select **All resources**.

3. Select your Device Provisioning Service.

4. In the **Settings** menu, select **Manage enrollments**.

5. At the top of the page, select **+ Add individual enrollment**.

::: zone pivot="programming-language-ansi-c"

6. In the **Add Enrollment** page, enter the following information.

    * **Mechanism:** Select **X.509** as the identity attestation *Mechanism*.
    * **Primary certificate .pem or .cer file:** Choose **Select a file** to select the certificate file, *X509testcert.pem* that you created in the previous section.
    * **IoT Hub Device ID:** Enter *test-docs-cert-device* to give the device an ID.

::: zone-end

::: zone pivot="programming-language-csharp"

6. In the **Add Enrollment** page, enter the following information.

    * **Mechanism:** Select **X.509** as the identity attestation *Mechanism*.
    * **Primary certificate .pem or .cer file:** Choose **Select a file** to select the certificate file, *certificate.cer* that you created in the previous section.
    * Leave **IoT Hub Device ID:** blank. Your device will be provisioned with its device ID set to the common name (CN) in the X.509 certificate, *iothubx509device1*. This common name will also be the name used for the registration ID for the individual enrollment entry.
    * Optionally, you can provide the following information:
        * Select an IoT hub linked with your provisioning service.
        * Update the **Initial device twin state** with the desired initial configuration for the device.

::: zone-end

::: zone pivot="programming-language-nodejs"

6. In the **Add Enrollment** page, enter the following information.

    * **Mechanism:** Select **X.509** as the identity attestation *Mechanism*.
    * **Primary certificate .pem or .cer file:** Choose **Select a file** to select the certificate file, *{certificate-name}_cert.pem* that you created in the previous section.
    * Optionally, you can provide the following information:
        * Select an IoT hub linked with your provisioning service.
        * Enter a unique device ID. Make sure to avoid sensitive data while naming your device.
        * Update the **Initial device twin state** with the desired initial configuration for the device.

::: zone-end

::: zone pivot="programming-language-python"

6. In the **Add Enrollment** page, enter the following information.

    * **Mechanism:** Select **X.509** as the identity attestation *Mechanism*.
    * **Primary certificate .pem or .cer file:** Choose **Select a file** to select the certificate file, *python-device.pem* if you are using the test certificate created earlier.
    * Optionally, you can provide the following information:
        * Select an IoT hub linked with your provisioning service.
        * Update the **Initial device twin state** with the desired initial configuration for the device.

::: zone-end

::: zone pivot="programming-language-java"


::: zone-end

    :::image type="content" source="./media/quick-create-simulated-device-x509/device-enrollment.png" alt-text="Add device as individual enrollment with X.509 attestation.":::

7. Select **Save**. You'll be returned to **Manage enrollments**.

8. Select **Individual Enrollments**. Your X.509 enrollment entry should appear in the registration table.

## Prepare and run the device provisioning code

::: zone pivot="programming-language-ansi-c"

In this section, we'll update the sample code to send the device's boot sequence to your Device Provisioning Service instance. This boot sequence will cause the device to be recognized and assigned to an IoT hub linked to the Device Provisioning Service instance.

1. In the Azure portal, select the **Overview** tab for your Device Provisioning Service.

2. Copy the **_ID Scope_** value.

    :::image type="content" source="./media/quick-create-simulated-device-x509/copy-id-scope.png" alt-text="Copy ID Scope from the portal.":::

3. In Visual Studio's *Solution Explorer* window, navigate to the **Provision\_Samples** folder. Expand the sample project named **prov\_dev\_client\_sample**. Expand **Source Files**, and open **prov\_dev\_client\_sample.c**.

4. Find the `id_scope` constant, and replace the value with your **ID Scope** value that you copied earlier. 

    ```c
    static const char* id_scope = "0ne00002193";
    ```

5. Find the definition for the `main()` function in the same file. Make sure the `hsm_type` variable is set to `SECURE_DEVICE_TYPE_X509` instead of `SECURE_DEVICE_TYPE_TPM` as shown below.

    ```c
    SECURE_DEVICE_TYPE hsm_type;
    //hsm_type = SECURE_DEVICE_TYPE_TPM;
    hsm_type = SECURE_DEVICE_TYPE_X509;
    ```

6. Right-click the **prov\_dev\_client\_sample** project and select **Set as Startup Project**.

7. On the Visual Studio menu, select **Debug** > **Start without debugging** to run the solution. In the prompt to rebuild the project, select **Yes** to rebuild the project before running.

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

1. In the Azure portal, select the **Overview** tab for your Device Provisioning Service.

2. Copy the **_ID Scope_** value.

    :::image type="content" source="./media/quick-create-simulated-device-x509/copy-id-scope.png" alt-text="Copy ID Scope from the portal.":::

3. Open a command prompt window.

4. Type the following command to build and run the X.509 device provisioning sample (replace the `<IDScope>` value with the ID Scope that you copied in the previous section.). The certificate file will default to *./certificate.pfx* and prompt for the .pfx password. Type in your password.

    ```powershell
    dotnet run -- -s <IDScope>
    ```

    If you want to pass everything as a parameter, you can use the following example format.

    ```powershell
    dotnet run -- -s 0ne00000A0A -c certificate.pfx -p 1234
    ```

5. The device will now connect to DPS and be assigned to an IoT Hub. Then, the device will send a telemetry message to the hub.

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

::: zone pivot="programming-language-nodejs"

1. In the Azure portal, select the **Overview** tab for your Device Provisioning Service.

2. Copy the **_ID Scope_** value.

    :::image type="content" source="./media/quick-create-simulated-device-x509/copy-id-scope.png" alt-text="Copy ID Scope from the portal.":::

3. Copy your _certificate_ and _key_ to the sample folder.

    ```cmd/sh
    copy .\{certificate-name}_cert.pem ..\device\samples\{certificate-name}_cert.pem
    copy .\{certificate-name}_key.pem ..\device\samples\{certificate-name}_key.pem
    ```

4. Navigate to the device test script and build the project.

    ```cmd/sh
    cd ..\device\samples
    npm install
    ```

5. Edit the **register\_x509.js** file with the following changes:

    * Replace `provisioning host` with the **_Global Device Endpoint_** noted in **Step 1** above.
    * Replace `id scope` with the **_ID Scope_** noted in **Step 1** above. 
    * Replace `registration id` with the **_Registration ID_** noted in the previous section.
    * Replace `cert filename` and `key filename` with the files you copied in **Step 2** above.

6. Save the file.

7. Execute the script and verify that the device was provisioned successfully.

    ```cmd/sh
    node register_x509.js
    ``` 

>[!TIP]
>The [Azure IoT Hub Node.js Device SDK](https://github.com/Azure/azure-iot-sdk-node) provides an easy way to simulate a device. For more information, see [Device concepts](./concepts-service.md).

::: zone-end

::: zone pivot="programming-language-python"

The Python provisioning sample, [provision_x509.py](https://github.com/Azure/azure-iot-sdk-python/blob/master/azure-iot-device/samples/async-hub-scenarios/provision_x509.py) is located in the `azure-iot-sdk-python/azure-iot-device/samples/async-hub-scenarios` directory. This sample uses six environment variables to authenticate and provision an IoT device using DPS. These environment variables are:

| Variable name              | Description                                     |
| :------------------------- | :---------------------------------------------- |
| `PROVISIONING_HOST`        |  This value is the global endpoint used for connecting to your DPS resource |    
| `PROVISIONING_IDSCOPE`     |  This value is the ID Scope for your DPS resource |    
| `DPS_X509_REGISTRATION_ID` |  This value is the ID for your device. It must also match the subject name on the device certificate |    
| `X509_CERT_FILE`           |  Your device certificate filename |    
| `X509_KEY_FILE`            |  The private key filename for your device certificate |
| `PASS_PHRASE`              |  The pass phrase you used to encrypt the certificate and private key file (`1234`). |    

1. In the Azure portal, select the **Overview** tab for your Device Provisioning Service. Copy the **_ID Scope_** and **Global device endpoint** values.

    :::image type="content" source="./media/quick-create-simulated-device-x509/copy-id-scope-and-global-device-endpoint.png" alt-text="Copy ID Scope from the portal.":::

2. In your Git Bash prompt, use the following commands to add the environment variables for the global device endpoint and ID Scope.

    ```bash
    $export PROVISIONING_HOST=global.azure-devices-provisioning.net
    $export PROVISIONING_IDSCOPE=<ID scope for your DPS resource>
    ```

3. The registration ID for the IoT device must match subject name on its device certificate. If you generated a self-signed test certificate, `Python-device-01` is both the subject name and the registration ID for the device.

    If you already have a device certificate, you can use `certutil` to verify the subject common name used for your device, as shown below:

    ```bash
    $ certutil python-device.pem
    X509 Certificate:
    Version: 3
    Serial Number: fa33152fe1140dc8
    Signature Algorithm:
        Algorithm ObjectId: 1.2.840.113549.1.1.11 sha256RSA
        Algorithm Parameters:
        05 00
    Issuer:
        CN=Python-device-01
      Name Hash(sha1): 1dd88de40e9501fb64892b698afe12d027011000
      Name Hash(md5): a62c784820daa931b9d3977739b30d12
    
     NotBefore: 1/29/2021 7:05 PM
     NotAfter: 1/29/2022 7:05 PM
    
    Subject:
        ===> CN=Python-device-01 <===
      Name Hash(sha1): 1dd88de40e9501fb64892b698afe12d027011000
      Name Hash(md5): a62c784820daa931b9d3977739b30d12
    ```

4. In the Git Bash prompt, set the environment variable for the registration ID as follows:

    ```bash
    $export DPS_X509_REGISTRATION_ID=Python-device-01
    ```

5. In the Git Bash prompt, set the environment variables for the certificate file, private key file, and pass phrase.

    ```bash
    $export X509_CERT_FILE=./python-device.pem
    $export X509_KEY_FILE=./python-device.key.pem
    $export PASS_PHRASE=1234
    ```

5. Review the code for [provision_x509.py](https://github.com/Azure/azure-iot-sdk-python/blob/master/azure-iot-device/samples/async-hub-scenarios/provision_x509.py). If you're not using **Python version 3.7** or later, make the [code change mentioned here](https://github.com/Azure/azure-iot-sdk-python/tree/master/azure-iot-device/samples/async-hub-scenarios#advanced-iot-hub-scenario-samples-for-the-azure-iot-hub-device-sdk) to replace `asyncio.run(main())`.

6. Save your changes.

7. Run the sample. The sample will connect, provision the device to a hub, and send some test messages to the hub.

    ```bash
    $ winpty python azure-iot-sdk-python/azure-iot-device/samples/async-hub-scenarios/provision_x509.py
    RegistrationStage(RequestAndResponseOperation): Op will transition into polling after interval 2.  Setting timer.
    The complete registration result is
    Python-device-01
    TestHub12345.azure-devices.net
    initialAssignment
    null
    Will send telemetry from the provisioned device
    sending message #4
    sending message #7
    sending message #2
    sending message #8
    sending message #5
    sending message #9
    sending message #1
    sending message #6
    sending message #10
    sending message #3
    done sending message #4
    done sending message #7
    done sending message #2
    done sending message #8
    done sending message #5
    done sending message #9
    done sending message #1
    done sending message #6
    done sending message #10
    done sending message #3
    ```

::: zone-end

::: zone pivot="programming-language-java"

::: zone-end

## Confirm your device provisioning registration

1. Go to the [Azure portal](https://portal.azure.com).

2. On the left-hand menu or on the portal page, select **All resources**.

3. Select the IoT hub to which your device was assigned.

4. In the **Explorers** menu, select **IoT Devices**.

5. If your device was provisioned successfully, the device ID should appear in the list, with **Status** set as *enabled*. If you don't see your device, select **Refresh** at the top of the page.

   :::zone pivot="programming-language-ansi-c"

    :::image type="content" source="./media/quick-create-simulated-device-x509/hub-registration.png" alt-text="Device is registered with the IoT hub":::

    ::: zone-end
    :::zone pivot="programming-language-csharp"

    :::image type="content" source="./media/quick-create-simulated-device-x509/hub-registration-csharp.png" alt-text="CSharp device is registered with the IoT hub":::

    ::: zone-end

    :::zone pivot="programming-language-nodejs"

    :::image type="content" source="./media/quick-create-simulated-device-x509/hub-registration-nodejs.png" alt-text="Node.js device is registered with the IoT hub":::

    ::: zone-end

    :::zone pivot="programming-language-python"

    :::image type="content" source="./media/quick-create-simulated-device-x509/hub-registration-python.png" alt-text="Python device is registered with the IoT hub":::

    ::: zone-end

    ::: zone pivot="programming-language-java"

    :::image type="content" source="./media/quick-create-simulated-device-x509/hub-registration-java.png" alt-text="Java device is registered with the IoT hub":::

    ::: zone-end


::: zone pivot="programming-language-csharp,programming-language-nodejs"

>[!IMPORTANT]
>If you changed the *initial device twin state* from the default value in the enrollment entry for your device, it can pull the desired twin state from the hub and act accordingly. For more information, see [Understand and use device twins in IoT Hub](../iot-hub/iot-hub-devguide-device-twins.md)

::: zone-end

## Clean up resources

If you plan to continue working on and exploring the device client sample, don't clean up the resources created in this quickstart. If you don't plan to continue, use the following steps to delete all resources created by this quickstart.

### Delete your device enrollment

1. Close the device client sample output window on your machine.

2. From the left-hand menu in the Azure portal, select **All resources**.

3. Select your Device Provisioning Service.

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