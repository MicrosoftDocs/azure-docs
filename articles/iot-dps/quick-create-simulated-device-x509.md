---
title: Quickstart - Provision an X.509 certificate simulated device to Microsoft Azure IoT Hub
description: Learn how to provision a simulated device that authenticates with an X.509 certificate in the Azure IoT Hub Device Provisioning Service
author: kgremban
ms.author: kgremban
ms.date: 11/01/2022
ms.topic: quickstart
ms.service: iot-dps
services: iot-dps
manager: lizross
ms.custom: mvc, mode-other
zone_pivot_groups: iot-dps-set1
#Customer intent: As a new IoT developer, I want to simulate an X.509 certificate device using the SDK, to learn how secure provisioning works.
---

# Quickstart: Provision an X.509 certificate simulated device

In this quickstart, you'll create a simulated device on your Windows machine. The simulated device will be configured to use the [X.509 certificate attestation](concepts-x509-attestation.md) mechanism for authentication. After you've configured your device, you'll then provision it to your IoT hub using the Azure IoT Hub Device Provisioning Service.

If you're unfamiliar with the process of provisioning, review the [provisioning](about-iot-dps.md#provisioning-process) overview.  Also make sure you've completed the steps in [Set up IoT Hub Device Provisioning Service with the Azure portal](./quick-setup-auto-provision.md) before continuing.

This quickstart demonstrates a solution for a Windows-based workstation. However, you can also perform the procedures on Linux. For a Linux example, see [Tutorial: Provision for geolatency](how-to-provision-multitenant.md).

## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

* Complete the steps in [Set up IoT Hub Device Provisioning Service with the Azure portal](./quick-setup-auto-provision.md).

::: zone pivot="programming-language-ansi-c"

The following prerequisites are for a Windows development environment. For Linux or macOS, see the appropriate section in [Prepare your development environment](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/devbox_setup.md) in the SDK documentation.

* Install [Visual Studio](https://visualstudio.microsoft.com/vs/) 2022 with the ['Desktop development with C++'](/cpp/ide/using-the-visual-studio-ide-for-cpp-desktop-development) workload enabled. Visual Studio 2015, Visual Studio 2017, and Visual Studio 19 are also supported. For Linux or macOS, see the appropriate section in [Prepare your development environment](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/devbox_setup.md) in the SDK documentation.

* Install the latest [CMake build system](https://cmake.org/download/). Make sure you check the option that adds the CMake executable to your path.

    >[!IMPORTANT]
    >Confirm that the Visual Studio prerequisites (Visual Studio and the 'Desktop development with C++' workload) are installed on your machine, **before** starting the `CMake` installation. Once the prerequisites are in place, and the download is verified, install the CMake build system. Also, be aware that older versions of the CMake build system fail to generate the solution file used in this article. Make sure to use the latest version of CMake.

::: zone-end

::: zone pivot="programming-language-csharp"

The following prerequisites are for a Windows development environment. For Linux or macOS, see the appropriate section in [Prepare your development environment](https://github.com/Azure/azure-iot-sdk-csharp/blob/main/doc/devbox_setup.md) in the SDK documentation.

* Install [.NET SDK 6.0](https://dotnet.microsoft.com/download) or later on your Windows-based machine. You can use the following command to check your version.

    ```cmd
    dotnet --info
    ```

::: zone-end

::: zone pivot="programming-language-nodejs"

The following prerequisites are for a Windows development environment. For Linux or macOS, see the appropriate section in [Prepare your development environment](https://github.com/Azure/azure-iot-sdk-node/blob/main/doc/node-devbox-setup.md) in the SDK documentation.

* Install [Node.js v4.0 or above](https://nodejs.org) on your machine.

::: zone-end

::: zone pivot="programming-language-python"

The following prerequisites are for a Windows development environment.

* [Python 3.6 or later](https://www.python.org/downloads/) on your machine.

::: zone-end

::: zone pivot="programming-language-java"

The following prerequisites are for a Windows development environment. For Linux or macOS, see the appropriate section in [Prepare your development environment](https://github.com/Azure/azure-iot-sdk-java/blob/main/doc/java-devbox-setup.md) in the SDK documentation.

* Install the [Java SE Development Kit 8](/azure/developer/java/fundamentals/java-support-on-azure) or later on your machine.

* Download and install [Maven](https://maven.apache.org/install.html).

::: zone-end

* Install the latest version of [Git](https://git-scm.com/download/). Make sure that Git is added to the environment variables accessible to the command window. See [Software Freedom Conservancy's Git client tools](https://git-scm.com/download/) for the latest version of `git` tools to install, which includes *Git Bash*, the command-line app that you can use to interact with your local Git repository.

* Make sure [OpenSSL](https://www.openssl.org/) is installed on your machine. On Windows, your installation of Git includes an installation of OpenSSL. You can access OpenSSL from the Git Bash prompt. To verify that OpenSSL is installed, open a Git Bash prompt and enter `openssl version`.

  >[!NOTE]
  > Unless you're familiar with OpenSSL and already have it installed on your Windows machine, we recommend using OpenSSL from the Git Bash prompt. Alternatively, you can choose to download the source code and build OpenSSL. To learn more, see the [OpenSSL Downloads](https://www.openssl.org/source/) page. Or, you can download OpenSSL pre-built from a third-party. To learn more, see the [OpenSSL wiki](https://wiki.openssl.org/index.php/Binaries). Microsoft makes no guarantees about the validity of packages downloaded from third-parties. If you do choose to build or download OpenSSL make sure that the OpenSSL binary is accessible in your path and that the `OPENSSL_CNF` environment variable is set to the path of your *openssl.cnf* file.

* Open both a Windows command prompt and a Git Bash prompt.

    The steps in this quickstart assume that you're using a Windows machine and the OpenSSL installation that is installed as part of Git. You'll use the Git Bash prompt to issue OpenSSL commands and the Windows command prompt for everything else. If you're using Linux, you can issue all commands from a Bash shell.

## Prepare your development environment

::: zone pivot="programming-language-ansi-c"

In this section, you'll prepare a development environment that's used to build the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c). The sample code attempts to provision the device, during the device's boot sequence.

1. Open a web browser, and go to the [Release page of the Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c/releases/latest).

2. Select the **Tags** tab at the top of the page.

3. Copy the tag name for the latest release of the Azure IoT C SDK.

4. In your Windows command prompt, run the following commands to clone the latest release of the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c) GitHub repository. Replace `<release-tag>` with the tag you copied in the previous step.

    ```cmd
    git clone -b <release-tag> https://github.com/Azure/azure-iot-sdk-c.git
    cd azure-iot-sdk-c
    git submodule update --init
    ```

    This operation could take several minutes to complete.

5. When the operation is complete, run the following commands from the `azure-iot-sdk-c` directory:

    ```cmd
    mkdir cmake
    cd cmake
    ```

6. The code sample uses an X.509 certificate to provide attestation via X.509 authentication. Run the following command to build a version of the SDK specific to your development platform that includes the device provisioning client. A Visual Studio solution for the simulated device is generated in the `cmake` directory.

    When specifying the path used with `-Dhsm_custom_lib` in the following command, make sure to use the absolute path to the library in the `cmake` directory you previously created. The path shown assumes that you cloned the C SDK in the root directory of the C drive. If you used another directory, adjust the path accordingly.

    ```cmd
    cmake -Duse_prov_client:BOOL=ON -Dhsm_custom_lib=c:/azure-iot-sdk-c/cmake/provisioning_client/samples/custom_hsm_example/Debug/custom_hsm_example.lib ..
    ```

    >[!TIP]
    >If `cmake` doesn't find your C++ compiler, you may get build errors while running the above command. If that happens, try running the command in the [Visual Studio command prompt](/dotnet/framework/tools/developer-command-prompt-for-vs).

7. When the build succeeds, the last few output lines look similar to the following output:

    ```cmd
    cmake -Duse_prov_client:BOOL=ON -Dhsm_custom_lib=c:/azure-iot-sdk-c/cmake/provisioning_client/samples/custom_hsm_example/Debug/custom_hsm_example.lib ..
    -- Building for: Visual Studio 17 2022
    -- Selecting Windows SDK version 10.0.19041.0 to target Windows 10.0.22000.
    -- The C compiler identification is MSVC 19.32.31329.0
    -- The CXX compiler identification is MSVC 19.32.31329.0
    
    ...

    -- Configuring done
    -- Generating done
    -- Build files have been written to: C:/azure-iot-sdk-c/cmake
    ```

::: zone-end

::: zone pivot="programming-language-csharp"

In your Windows command prompt, clone the [Azure IoT SDK for C#](https://github.com/Azure/azure-iot-sdk-csharp) GitHub repository using the following command:

```cmd
git clone https://github.com/Azure/azure-iot-sdk-csharp.git
```

::: zone-end

::: zone pivot="programming-language-nodejs"

In your Windows command prompt, clone the [Azure IoT Samples for Node.js](https://github.com/Azure/azure-iot-sdk-node.git) GitHub repository using the following command:

```cmd
git clone https://github.com/Azure/azure-iot-sdk-node.git
```

::: zone-end

::: zone pivot="programming-language-python"

In your Windows command prompt, clone the [Azure IoT Samples for Python](https://github.com/Azure/azure-iot-sdk-python.git) GitHub repository using the following command:

```cmd
git clone https://github.com/Azure/azure-iot-sdk-python.git --recursive
```

::: zone-end

::: zone pivot="programming-language-java"

1. In your Windows command prompt, clone the [Azure IoT Samples for Java](https://github.com/Azure/azure-iot-sdk-java.git) GitHub repository using the following command:

    ```cmd
    git clone https://github.com/Azure/azure-iot-sdk-java.git --recursive
    ```

2. Go to the root `azure-iot-sdk-java` directory and build the project to download all needed packages.

   ```cmd
   cd azure-iot-sdk-java
   mvn install -DskipTests=true
   ```

::: zone-end

## Create a self-signed X.509 device certificate

In this section, you'll use OpenSSL to create a self-signed X.509 certificate and a private key. This certificate will be uploaded to your provisioning service instance and verified by the service.

> [!CAUTION]
> Use certificates created with OpenSSL in this quickstart for development testing only.
> Do not use these certificates in production.
> These certificates expire after 30 days and may contain hard-coded passwords, such as *1234*.
> To learn about obtaining certificates suitable for use in production, see [How to get an X.509 CA certificate](../iot-hub/iot-hub-x509ca-overview.md#get-an-x509-ca-certificate) in the Azure IoT Hub documentation.
>

Perform the steps in this section in your Git Bash prompt.

1. In your Git Bash prompt, navigate to a directory where you'd like to create your certificates.

2. Run the following command:

    # [Windows](#tab/windows)

    ```bash
    winpty openssl req -outform PEM -x509 -sha256 -newkey rsa:4096 -keyout device-key.pem -out device-cert.pem -days 30 -extensions usr_cert -addext extendedKeyUsage=clientAuth -subj "//CN=my-x509-device"
    ```

    > [!IMPORTANT]
    > The extra forward slash given for the subject name (`//CN=my-x509-device`) is only required to escape the string with Git on Windows platforms.

    # [Linux](#tab/linux)

    ```bash
    openssl req -outform PEM -x509 -sha256 -newkey rsa:4096 -keyout device-key.pem -out device-cert.pem -days 30 -extensions usr_cert -addext extendedKeyUsage=clientAuth -subj "/CN=my-x509-device"
    ```

    ---

3. When asked to **Enter PEM pass phrase:**, use the pass phrase `1234`.

4. When asked **Verifying - Enter PEM pass phrase:**, use the pass phrase `1234` again.

    A public key certificate file (*device-cert.pem*) and private key file (*device-key.pem*) should now be generated in the directory where you ran the `openssl` command.

    The certificate file has its subject common name (CN) set to `my-x509-device`. For X.509-based enrollments, the [Registration ID](./concepts-service.md#registration-id) is set to the common name. The registration ID is a case-insensitive string of alphanumeric characters plus the special characters: `'-'`, `'.'`, `'_'`, `':'`. The last character must be alphanumeric or dash (`'-'`). The common name must adhere to this format. DPS supports registration IDs up to 128 characters long; however, the maximum length of the subject common name in an X.509 certificate is 64 characters. The registration ID, therefore, is limited to 64 characters when using X.509 certificates.

5. The certificate file is Base64 encoded. To view the subject common name (CN) and other properties of the certificate file, enter the following command:

    # [Windows](#tab/windows)

    ```bash
    winpty openssl x509 -in device-cert.pem -text -noout
    ```

    # [Linux](#tab/linux)

    ```bash
    openssl x509 -in device-cert.pem -text -noout
    ```

    ---

    ```output
    Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number:
            77:3e:1d:e4:7e:c8:40:14:08:c6:09:75:50:9c:1a:35:6e:19:52:e2
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: CN = my-x509-device
        Validity
            Not Before: May  5 21:41:42 2022 GMT
            Not After : Jun  4 21:41:42 2022 GMT
        Subject: CN = my-x509-device
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                RSA Public-Key: (4096 bit)
                Modulus:
                    00:d2:94:37:d6:1b:f7:43:b4:21:c6:08:1a:d6:d7:
                    e6:40:44:4e:4d:24:41:6c:3e:8c:b2:2c:b0:23:29:
                    ...
                    23:6e:58:76:45:18:03:dc:2e:9d:3f:ac:a3:5c:1f:
                    9f:66:b0:05:d5:1c:fe:69:de:a9:09:13:28:c6:85:
                    0e:cd:53
                Exponent: 65537 (0x10001)
        X509v3 extensions:
            X509v3 Basic Constraints:
                CA:FALSE
            Netscape Comment:
                OpenSSL Generated Certificate
            X509v3 Subject Key Identifier:
                63:C0:B5:93:BF:29:F8:57:F8:F9:26:44:70:6F:9B:A4:C7:E3:75:18
            X509v3 Authority Key Identifier:
                keyid:63:C0:B5:93:BF:29:F8:57:F8:F9:26:44:70:6F:9B:A4:C7:E3:75:18

            X509v3 Extended Key Usage:
                TLS Web Client Authentication
    Signature Algorithm: sha256WithRSAEncryption
         82:8a:98:f8:47:00:85:be:21:15:64:b9:22:b0:13:cc:9e:9a:
         ed:f5:93:b9:4b:57:0f:79:85:9d:89:47:69:95:65:5e:b3:b1:
         ...
         cc:b2:20:9a:b7:f2:5e:6b:81:a1:04:93:e9:2b:92:62:e0:1c:
         ac:d2:49:b9:36:d2:b0:21
    ```

::: zone pivot="programming-language-ansi-c"

6. The sample code requires a private key that isn't encrypted. Run the following command to create an unencrypted private key:

    # [Windows](#tab/windows)

    ```bash
    winpty openssl rsa -in device-key.pem -out unencrypted-device-key.pem
    ```

    # [Linux](#tab/linux)

    ```bash
    openssl rsa -in device-key.pem -out unencrypted-device-key.pem
    ```

    ---

7. When asked to **Enter pass phrase for device-key.pem:**, use the same pass phrase you did previously, `1234`.

Keep the Git Bash prompt open. You'll need it later in this quickstart.

::: zone-end

::: zone pivot="programming-language-csharp"

The C# sample code is set up to use X.509 certificates that are stored in a password-protected PKCS#12 formatted file (`certificate.pfx`). You'll still need the PEM formatted public key certificate file (`device-cert.pem`) that you just created to create an individual enrollment entry later in this quickstart.

1. To generate the PKCS12 formatted file expected by the sample, enter the following command:

    # [Windows](#tab/windows)

    ```bash
    winpty openssl pkcs12 -inkey device-key.pem -in device-cert.pem -export -out certificate.pfx
    ```

    # [Linux](#tab/linux)

    ```bash
    openssl pkcs12 -inkey device-key.pem -in device-cert.pem -export -out certificate.pfx
    ```

    ---

1. When asked to **Enter pass phrase for device-key.pem:**, use the same pass phrase you did previously, `1234`.

1. When asked to **Enter Export Password:**, use the password `1234`.

1. When asked **Verifying - Enter Export Password:**, use the password `1234` again.

    A PKCS12 formatted certificate file (*certificate.pfx*) should now be generated in the directory where you ran the `openssl` command.

1. Copy the PKCS12 formatted certificate file to the project directory for the X.509 device provisioning sample. The path given is relative to the location where you downloaded the sample repo.

    ```bash
    cp certificate.pfx ./azure-iot-sdk-csharp/provisioning/device/samples/"Getting Started"/X509Sample
    ```

You won't need the Git Bash prompt for the rest of this quickstart. However, you may want to keep it open to check your certificate if you have problems in later steps.

::: zone-end

::: zone pivot="programming-language-nodejs"

6. The sample code requires a private key that isn't encrypted. Run the following command to create an unencrypted private key:

    # [Windows](#tab/windows)

    ```bash
    winpty openssl rsa -in device-key.pem -out unencrypted-device-key.pem
    ```

    # [Linux](#tab/linux)

    ```bash
    openssl rsa -in device-key.pem -out unencrypted-device-key.pem
    ```

    ---

7. When asked to **Enter pass phrase for device-key.pem:**, use the same pass phrase you did previously, `1234`.

8. Copy the device certificate and unencrypted private key to the project directory for the X.509 device provisioning sample. The path given is relative to the location where you downloaded the SDK.

    ```bash
    cp device-cert.pem ./azure-iot-sdk-node/provisioning/device/samples
    cp unencrypted-device-key.pem ./azure-iot-sdk-node/provisioning/device/samples
    ```

You won't need the Git Bash prompt for the rest of this quickstart. However, you may want to keep it open to check your certificate if you have problems in later steps.

::: zone-end

::: zone pivot="programming-language-python"

6. Copy the device certificate and private key to the project directory for the X.509 device provisioning sample. The path given is relative to the location where you downloaded the SDK.

    ```bash
    cp device-cert.pem ./azure-iot-sdk-python/samples/async-hub-scenarios
    cp device-key.pem ./azure-iot-sdk-python/samples/async-hub-scenarios
    ```

You won't need the Git Bash prompt for the rest of this quickstart. However, you may want to keep it open to check your certificate if you have problems in later steps.

::: zone-end
::: zone pivot="programming-language-java"

6. The Java sample code requires a private key that isn't encrypted. Run the following command to create an unencrypted private key:

    # [Windows](#tab/windows)

    ```bash
    winpty openssl pkey -in device-key.pem -out unencrypted-device-key.pem
    ```

    # [Linux](#tab/linux)

    ```bash
    openssl pkey -in device-key.pem -out unencrypted-device-key.pem
    ```

    ---

7. When asked to **Enter pass phrase for device-key.pem:**, use the same pass phrase you did previously, `1234`.

Keep the Git Bash prompt open. You'll need it later in this quickstart.

::: zone-end

## Create a device enrollment

The Azure IoT Device Provisioning Service supports two types of enrollments:

* [Enrollment groups](concepts-service.md#enrollment-group): Used to enroll multiple related devices.
* [Individual enrollments](concepts-service.md#individual-enrollment): Used to enroll a single device.

This article demonstrates an individual enrollment for a single device to be provisioned with an IoT hub.

<!-- INCLUDE -->
[!INCLUDE [iot-dps-individual-enrollment-x509.md](../../includes/iot-dps-individual-enrollment-x509.md)]

## Prepare and run the device provisioning code

In this section, you update the sample code to send the device's boot sequence to your Device Provisioning Service instance. This boot sequence causes the device to be recognized and assigned to an IoT hub linked to the DPS instance.

::: zone pivot="programming-language-ansi-c"

In this section, you use your Git Bash prompt and the Visual Studio IDE.

### Configure the provisioning device code

In this section, you update the sample code with your Device Provisioning Service instance information.

1. In the Azure portal, select the **Overview** tab for your Device Provisioning Service.

1. Copy the **ID Scope** value.

    :::image type="content" source="./media/quick-create-simulated-device-x509/copy-id-scope.png" alt-text="Screenshot of the ID scope on Azure portal.":::

1. Launch Visual Studio and open the new solution file that was created in the `cmake` directory you created in the root of the azure-iot-sdk-c git repository. The solution file is named `azure_iot_sdks.sln`.

1. In Solution Explorer for Visual Studio, navigate to **Provision_Samples > prov_dev_client_sample > Source Files** and open *prov_dev_client_sample.c*.

1. Find the `id_scope` constant, and replace the value with your **ID Scope** value that you copied in step 2.

    ```c
    static const char* id_scope = "0ne00000A0A";
    ```

1. Find the definition for the `main()` function in the same file. Make sure the `hsm_type` variable is set to `SECURE_DEVICE_TYPE_X509`.

    ```c
    SECURE_DEVICE_TYPE hsm_type;
    //hsm_type = SECURE_DEVICE_TYPE_TPM;
    hsm_type = SECURE_DEVICE_TYPE_X509;
    //hsm_type = SECURE_DEVICE_TYPE_SYMMETRIC_KEY;
    ```

1. Save your changes.

1. Right-click the **prov_dev_client_sample** project and select **Set as Startup Project**.

### Configure the custom HSM stub code

The specifics of interacting with actual secure hardware-based storage vary depending on the hardware. As a result, the certificate and private key used by the simulated device in this quickstart will be hardcoded in the custom Hardware Security Module (HSM) stub code.

To update the custom HSM stub code to simulate the identity of the device with ID `my-x509-device`:

1. In Solution Explorer for Visual Studio, navigate to **Provision_Samples > custom_hsm_example > Source Files** and open *custom_hsm_example.c*.

1. Update the string value of the `COMMON_NAME` string constant using the common name you used when generating the device certificate, `my-x509-device`.

    ```c
    static const char* const COMMON_NAME = "my-x509-device";
    ```

1. Update the string value of the `CERTIFICATE` constant string using the device certificate, *device-cert.pem*, that you generated previously.

    The syntax of certificate text in the sample must follow the following pattern with no extra spaces or parsing done by Visual Studio.

    ```c
    static const char* const CERTIFICATE = "-----BEGIN CERTIFICATE-----\n"
    "MIIFOjCCAyKgAwIBAgIJAPzMa6s7mj7+MA0GCSqGSIb3DQEBCwUAMCoxKDAmBgNV\n"
        ...
    "MDMwWhcNMjAxMTIyMjEzMDMwWjAqMSgwJgYDVQQDDB9BenVyZSBJb1QgSHViIENB\n"
    "-----END CERTIFICATE-----";        
    ```

    Updating this string value manually can be prone to error. To generate the proper syntax, you can copy and paste the following command into your **Git Bash prompt**, and press **ENTER**. This command will generate the syntax for the `CERTIFICATE` string constant value and write it to the output.

    ```Bash
    sed -e 's/^/"/;$ !s/$/""\\n"/;$ s/$/"/' device-cert.pem
    ```

    Copy and paste the output certificate text for the constant value.

1. Update the string value of the `PRIVATE_KEY` constant with the unencrypted private key for your device certificate, *unencrypted-device-key.pem*.

    The syntax of the private key text must follow the following pattern with no extra spaces or parsing done by Visual Studio.

    ```c
    static const char* const PRIVATE_KEY = "-----BEGIN RSA PRIVATE KEY-----\n"
    "MIIJJwIBAAKCAgEAtjvKQjIhp0EE1PoADL1rfF/W6v4vlAzOSifKSQsaPeebqg8U\n"
        ...
    "X7fi9OZ26QpnkS5QjjPTYI/wwn0J9YAwNfKSlNeXTJDfJ+KpjXBcvaLxeBQbQhij\n"
    "-----END RSA PRIVATE KEY-----";
    ```

    Updating this string value manually can be prone to error. To generate the proper syntax, you can copy and paste the following command into your **Git Bash prompt**, and press **ENTER**. This command  will generate the syntax for the `PRIVATE_KEY` string constant value and write it to the output.

    ```Bash
    sed -e 's/^/"/;$ !s/$/""\\n"/;$ s/$/"/' unencrypted-device-key.pem
    ```

    Copy and paste the output private key text for the constant value.

1. Save your changes.

1. Right-click the **custom_hsm_-_example** project and select **Build**.

    > [!IMPORTANT]
    > You must build the **custom_hsm_example** project before you build the rest of the solution in the next section.

### Run the sample

1. On the Visual Studio menu, select **Debug** > **Start without debugging** to run the solution. If you're prompted to rebuild the project, select **Yes** to rebuild the project before running.

    The following output is an example of the simulated device `my-x509-device` successfully booting up, and connecting to the provisioning service. The device is assigned to an IoT hub and registered:

    ```output
    Provisioning API Version: 1.8.0
    
    Registering Device
    
    Provisioning Status: PROV_DEVICE_REG_STATUS_CONNECTED
    Provisioning Status: PROV_DEVICE_REG_STATUS_ASSIGNING
    
    Registration Information received from service: contoso-iot-hub-2.azure-devices.net, deviceId: my-x509-device
    Press enter key to exit:
    ```

::: zone-end

::: zone pivot="programming-language-csharp"

In this section, you'll use your Windows command prompt.

1. In the Azure portal, select the **Overview** tab for your Device Provisioning Service.

2. Copy the **ID Scope** value.

    :::image type="content" source="./media/quick-create-simulated-device-x509/copy-id-scope.png" alt-text="Screenshot of the ID scope on Azure portal.":::

3. In your Windows command prompt, change to the X509Sample directory. This directory is located in the *.\azure-iot-sdk-csharp\provisioning\device\samples\Getting Started\X509Sample* directory off the directory where you cloned the samples on your computer.

4. Enter the following command to build and run the X.509 device provisioning sample (replace the `<IDScope>` value with the ID Scope that you copied in the previous section. The certificate file will default to *./certificate.pfx* and prompt for the .pfx password.

    ```cmd
    dotnet run -- -s <IDScope>
    ```

    If you want to pass the certificate and password as a parameter, you can use the following format.
    
   >[!NOTE]
   >Additional parameters can be passed along while running the application to change the TransportType (-t) and the GlobalDeviceEndpoint (-g).

    ```cmd
    dotnet run -- -s 0ne00000A0A -c certificate.pfx -p 1234
    ```

5. The device connects to DPS and is assigned to an IoT hub. Then, the device will send a telemetry message to the IoT hub.

    ```output
    Loading the certificate...
    Enter the PFX password for certificate.pfx:
    ****
    Found certificate: A33DB11B8883DEE5B1690ACFEAAB69E8E928080B CN=my-x509-device; PrivateKey: True
    Using certificate A33DB11B8883DEE5B1690ACFEAAB69E8E928080B CN=my-x509-device
    Initializing the device provisioning client...
    Initialized for registration Id my-x509-device.
    Registering with the device provisioning service...
    Registration status: Assigned.
    Device my-x509-device registered to MyExampleHub.azure-devices.net.
    Creating X509 authentication for IoT Hub...
    Testing the provisioned device with IoT Hub...
    Sending a telemetry message...
    Finished.
    ```

::: zone-end

::: zone pivot="programming-language-nodejs"

In this section, you'll use your Windows command prompt.

1. In the Azure portal, select the **Overview** tab for your Device Provisioning Service.

1. Copy the **ID Scope** value.

    :::image type="content" source="./media/quick-create-simulated-device-x509/copy-id-scope.png" alt-text="Screenshot of the ID scope on Azure portal.":::

1. In your Windows command prompt, go to the sample directory, and install the packages needed by the sample. The path shown is relative to the location where you cloned the SDK.

    ```cmd
    cd .\azure-iot-sdk-node\provisioning\device\samples
    npm install
    ```

    The sample uses five environment variables to authenticate and provision an IoT device using DPS. These environment variables are:

    | Variable name              | Description                                     |
    | :------------------------- | :---------------------------------------------- |
    | `PROVISIONING_HOST`        |  The endpoint to use for connecting to your DPS instance. For this quickstart, use the global endpoint, `global.azure-devices-provisioning.net`. |
    | `PROVISIONING_IDSCOPE`     |  The ID Scope for your DPS instance. |
    | `PROVISIONING_REGISTRATION_ID` |  The registration ID for your device. It must match the subject common name in the device certificate. |
    | `CERTIFICATE_FILE`         |  The path to your device certificate file. |
    | `KEY_FILE`                 |  The path to your device private key file. |

1. Add environment variables for the global device endpoint and ID scope. Replace `<id-scope>` with the value you copied in step 2.

    ```cmd
    set PROVISIONING_HOST=global.azure-devices-provisioning.net
    set PROVISIONING_IDSCOPE=<id-scope>
    ```

1. Set the environment variable for the device registration ID. The registration ID for the IoT device must match subject common name on its device certificate. If you followed the steps in this quickstart to generate a self-signed test certificate, `my-x509-device` is both the subject name and the registration ID for the device.

    ```cmd
    set PROVISIONING_REGISTRATION_ID=my-x509-device
    ```

1. Set the environment variables for the device certificate and (unencrypted) device private key files.

    ```cmd
    set CERTIFICATE_FILE=.\device-cert.pem
    set KEY_FILE=.\unencrypted-device-key.pem
    ```

1. Run the sample and verify that the device was provisioned successfully.

    ```cmd
    node register_x509.js
    ```

    You should see output similar to the following example:

    ```output
    registration succeeded
    assigned hub=contoso-hub-2.azure-devices.net
    deviceId=my-x509-device
    Client connected
    send status: MessageEnqueued
    ```

::: zone-end

::: zone pivot="programming-language-python"

In this section, you'll use your Windows command prompt.

1. In the Azure portal, select the **Overview** tab for your Device Provisioning Service.

1. Copy the **ID Scope** and **Global device endpoint** values.

    :::image type="content" source="./media/quick-create-simulated-device-x509/copy-id-scope-and-global-device-endpoint.png" alt-text="Screenshot of the ID scope and global device endpoint on Azure portal.":::

1. In your Windows command prompt, go to the directory of the [provision_x509.py](https://github.com/Azure/azure-iot-sdk-python/blob/main/samples/async-hub-scenarios/provision_x509.py) sample. The path shown is relative to the location where you cloned the SDK.

    ```cmd
    cd ./azure-iot-sdk-python/samples/async-hub-scenarios
    ```

    This sample uses six environment variables to authenticate and provision an IoT device using DPS. These environment variables are:

    | Variable name              | Description                                     |
    | :------------------------- | :---------------------------------------------- |
    | `PROVISIONING_HOST`        |  The global endpoint used for connecting to your DPS instance. |
    | `PROVISIONING_IDSCOPE`     |  The ID Scope for your DPS instance. |
    | `DPS_X509_REGISTRATION_ID` |  The registration ID for your device. It must also match the subject name on the device certificate. |
    | `X509_CERT_FILE`           |  The path to your device certificate file. |
    | `X509_KEY_FILE`            |  The path to your device certificate private key file. |
    | `PASS_PHRASE`              |  The pass phrase you used to encrypt the certificate and private key file (`1234`). |

1. Add the environment variables for the global device endpoint and ID Scope.

    ```cmd
    set PROVISIONING_HOST=global.azure-devices-provisioning.net
    set PROVISIONING_IDSCOPE=<ID scope for your DPS resource>
    ```

1. Set the environment variable for the registration ID. The registration ID for the IoT device must match subject name on its device certificate. If you followed the steps in this quickstart to generate a self-signed test certificate, `my-x509-device` is both the subject name and the registration ID for the device.

    ```cmd
    set DPS_X509_REGISTRATION_ID=my-x509-device
    ```

1. Set the environment variables for the certificate file, private key file, and pass phrase.

    ```cmd
    set X509_CERT_FILE=./device-cert.pem
    set X509_KEY_FILE=./device-key.pem
    set PASS_PHRASE=1234
    ```

1. Review the code for [provision_x509.py](https://github.com/Azure/azure-iot-sdk-python/blob/main/samples/async-hub-scenarios/provision_x509.py). If you're not using **Python version 3.7** or later, make the [code change mentioned here](https://github.com/Azure/azure-iot-sdk-python/tree/main/samples/async-hub-scenarios#advanced-iot-hub-scenario-samples-for-the-azure-iot-hub-device-sdk) to replace `asyncio.run(main())` and save your changes.

1. Run the sample. The sample connects to DPS, which will provision the device to an IoT hub. After the device is provisioned, the sample will send some test messages to the IoT hub.

    ```cmd
    $ python azure-iot-sdk-python/samples/async-hub-scenarios/provision_x509.py
    RegistrationStage(RequestAndResponseOperation): Op will transition into polling after interval 2.  Setting timer.
    The complete registration result is
    my-x509-device
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

In this section, you use both your Windows command prompt and your Git Bash prompt.

1. In the Azure portal, select the **Overview** tab for your Device Provisioning Service.

1. Copy the **ID Scope** and **Global device endpoint** values.

    :::image type="content" source="./media/quick-create-simulated-device-x509/copy-id-scope-and-global-device-endpoint.png" alt-text="Screenshot of the ID scope and global device endpoint on Azure portal.":::

1. In your Windows command prompt, navigate to the sample project folder. The path shown is relative to the location where you cloned the SDK

    ```cmd
    cd .\azure-iot-sdk-java\provisioning\provisioning-samples\provisioning-X509-sample
    ```

1. Enter the provisioning service and X.509 identity information in the sample code. This information is used during provisioning, for attestation of the simulated device, prior to device registration.

    1. Open the file `.\src\main\java\samples\com/microsoft\azure\sdk\iot\ProvisioningX509Sample.java` in your favorite editor.

    1. Update the following values with the **ID Scope** and **Provisioning Service Global Endpoint** that you copied previously.

        ```java
        private static final String idScope = "[Your ID scope here]";
        private static final String globalEndpoint = "[Your Provisioning Service Global Endpoint here]";
        private static final ProvisioningDeviceClientTransportProtocol PROVISIONING_DEVICE_CLIENT_TRANSPORT_PROTOCOL = ProvisioningDeviceClientTransportProtocol.HTTPS;

    1. Update the value of the `leafPublicPem` constant string with the value of your certificate, *device-cert.pem*.

        The syntax of certificate text must follow the following pattern with no extra spaces or characters.

        ```java
        private static final String leafPublicPem = "-----BEGIN CERTIFICATE-----\n" +
        "MIIFOjCCAyKgAwIBAgIJAPzMa6s7mj7+MA0GCSqGSIb3DQEBCwUAMCoxKDAmBgNV\n" +
            ...
        "MDMwWhcNMjAxMTIyMjEzMDMwWjAqMSgwJgYDVQQDDB9BenVyZSBJb1QgSHViIENB\n" +
        "-----END CERTIFICATE-----";        
        ```

        Updating this string value manually can be prone to error. To generate the proper syntax, you can copy and paste the following command into your **Git Bash prompt**, and press **ENTER**. This command  will generate the syntax for the `leafPublicPem` string constant value and write it to the output.

        ```Bash
        sed 's/^/"/;$ !s/$/\\n" +/;$ s/$/"/' device-cert.pem
        ```

        Copy and paste the output certificate text for the constant value.

    1. Update the string value of the `leafPrivateKey` constant with the unencrypted private key for your device certificate, *unencrypted-device-key.pem*.

        The syntax of the private key text must follow the following pattern with no extra spaces or characters.

        ```java
        private static final String leafPrivateKey = "-----BEGIN PRIVATE KEY-----\n" +
        "MIIJJwIBAAKCAgEAtjvKQjIhp0EE1PoADL1rfF/W6v4vlAzOSifKSQsaPeebqg8U\n" +
            ...
        "X7fi9OZ26QpnkS5QjjPTYI/wwn0J9YAwNfKSlNeXTJDfJ+KpjXBcvaLxeBQbQhij\n" +
        "-----END PRIVATE KEY-----";
        ```

        Updating this string value manually can be prone to error. To generate the proper syntax, you can copy and paste the following command into your **Git Bash prompt**, and press **ENTER**. This command will generate the syntax for the `leafPrivateKey` string constant value and write it to the output.

        ```Bash
        sed 's/^/"/;$ !s/$/\\n" +/;$ s/$/"/' unencrypted-device-key.pem
        ```

        Copy and paste the output private key text for the constant value.

    1. Save your changes.

1. Build the sample, and then go to the `target` folder.

    ```cmd
    mvn clean install
    cd target
    ```

1. The build outputs .jar file in the `target` folder with the following file format: `provisioning-x509-sample-{version}-with-deps.jar`; for example: `provisioning-x509-sample-1.8.1-with-deps.jar`. Execute the .jar file. You may need to replace the version in the following command.

    ```cmd
    java -jar ./provisioning-x509-sample-1.8.1-with-deps.jar
    ```

    The sample connects to DPS, which will provision the device to an IoT hub. After the device is provisioned, the sample will send some test messages to the IoT hub.

    ```output
    Starting...
    Beginning setup.
    WARNING: sun.reflect.Reflection.getCallerClass is not supported. This will impact performance.
    2022-05-11 09:42:05,025 DEBUG (main) [com.microsoft.azure.sdk.iot.provisioning.device.ProvisioningDeviceClient] - Initialized a ProvisioningDeviceClient instance using SDK version 2.0.0
    2022-05-11 09:42:05,027 DEBUG (main) [com.microsoft.azure.sdk.iot.provisioning.device.ProvisioningDeviceClient] - Starting provisioning thread...
    Waiting for Provisioning Service to register
    2022-05-11 09:42:05,030 INFO (global.azure-devices-provisioning.net-6255a8ba-CxnPendingConnectionId-azure-iot-sdk-ProvisioningTask) [com.microsoft.azure.sdk.iot.provisioning.device.internal.task.ProvisioningTask] - Opening the connection to device provisioning service...
    2022-05-11 09:42:05,252 INFO (global.azure-devices-provisioning.net-6255a8ba-Cxn6255a8ba-azure-iot-sdk-ProvisioningTask) [com.microsoft.azure.sdk.iot.provisioning.device.internal.task.ProvisioningTask] - Connection to device provisioning service opened successfully, sending initial device registration message
    2022-05-11 09:42:05,286 INFO (global.azure-devices-provisioning.net-6255a8ba-Cxn6255a8ba-azure-iot-sdk-RegisterTask) [com.microsoft.azure.sdk.iot.provisioning.device.internal.task.RegisterTask] - Authenticating with device provisioning service using x509 certificates
    2022-05-11 09:42:06,083 INFO (global.azure-devices-provisioning.net-6255a8ba-Cxn6255a8ba-azure-iot-sdk-ProvisioningTask) [com.microsoft.azure.sdk.iot.provisioning.device.internal.task.ProvisioningTask] - Waiting for device provisioning service to provision this device...
    2022-05-11 09:42:06,083 INFO (global.azure-devices-provisioning.net-6255a8ba-Cxn6255a8ba-azure-iot-sdk-ProvisioningTask) [com.microsoft.azure.sdk.iot.provisioning.device.internal.task.ProvisioningTask] - Current provisioning status: ASSIGNING
    Waiting for Provisioning Service to register
    2022-05-11 09:42:15,685 INFO (global.azure-devices-provisioning.net-6255a8ba-Cxn6255a8ba-azure-iot-sdk-ProvisioningTask) [com.microsoft.azure.sdk.iot.provisioning.device.internal.task.ProvisioningTask] - Device provisioning service assigned the device successfully
    IotHUb Uri : MyExampleHub.azure-devices.net
    Device ID : java-device-01
    2022-05-11 09:42:25,057 INFO (main) [com.microsoft.azure.sdk.iot.device.transport.ExponentialBackoffWithJitter] - NOTE: A new instance of ExponentialBackoffWithJitter has been created with the following properties. Retry Count: 2147483647, Min Backoff Interval: 100, Max Backoff Interval: 10000, Max Time Between Retries: 100, Fast Retry Enabled: true
    2022-05-11 09:42:25,080 INFO (main) [com.microsoft.azure.sdk.iot.device.transport.ExponentialBackoffWithJitter] - NOTE: A new instance of ExponentialBackoffWithJitter has been created with the following properties. Retry Count: 2147483647, Min Backoff Interval: 100, Max Backoff Interval: 10000, Max Time Between Retries: 100, Fast Retry Enabled: true
    2022-05-11 09:42:25,087 DEBUG (main) [com.microsoft.azure.sdk.iot.device.DeviceClient] - Initialized a DeviceClient instance using SDK version 2.0.3
    2022-05-11 09:42:25,129 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.mqtt.MqttIotHubConnection] - Opening MQTT connection...
    2022-05-11 09:42:25,150 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.mqtt.Mqtt] - Sending MQTT CONNECT packet...
    2022-05-11 09:42:25,982 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.mqtt.Mqtt] - Sent MQTT CONNECT packet was acknowledged
    2022-05-11 09:42:25,983 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.mqtt.Mqtt] - Sending MQTT SUBSCRIBE packet for topic devices/java-device-01/messages/devicebound/#
    2022-05-11 09:42:26,068 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.mqtt.Mqtt] - Sent MQTT SUBSCRIBE packet for topic devices/java-device-01/messages/devicebound/# was acknowledged
    2022-05-11 09:42:26,068 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.mqtt.MqttIotHubConnection] - MQTT connection opened successfully
    2022-05-11 09:42:26,070 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.IotHubTransport] - The connection to the IoT Hub has been established
    2022-05-11 09:42:26,071 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.IotHubTransport] - Updating transport status to new status CONNECTED with reason CONNECTION_OK
    2022-05-11 09:42:26,071 DEBUG (main) [com.microsoft.azure.sdk.iot.device.DeviceIO] - Starting worker threads
    2022-05-11 09:42:26,073 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.IotHubTransport] - Invoking connection status callbacks with new status details
    2022-05-11 09:42:26,074 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.IotHubTransport] - Client connection opened successfully
    2022-05-11 09:42:26,075 INFO (main) [com.microsoft.azure.sdk.iot.device.DeviceClient] - Device client opened successfully
    Sending message from device to IoT Hub...
    2022-05-11 09:42:26,077 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.IotHubTransport] - Message was queued to be sent later ( Message details: Correlation Id [54d9c6b5-3da9-49fe-9343-caa6864f9a02] Message Id [28069a3d-f6be-4274-a48b-1ee539524eeb] )
    Press any key to exit...
    2022-05-11 09:42:26,079 DEBUG (MyExampleHub.azure-devices.net-java-device-01-ee6c362d-Cxn7a1fb819-e46d-4658-9b03-ca50c88c0440-azure-iot-sdk-IotHubSendTask) [com.microsoft.azure.sdk.iot.device.transport.IotHubTransport] - Sending message ( Message details: Correlation Id [54d9c6b5-3da9-49fe-9343-caa6864f9a02] Message Id [28069a3d-f6be-4274-a48b-1ee539524eeb] )
    2022-05-11 09:42:26,422 DEBUG (MQTT Call: java-device-01) [com.microsoft.azure.sdk.iot.device.transport.IotHubTransport] - IotHub message was acknowledged. Checking if there is record of sending this message ( Message details: Correlation Id [54d9c6b5-3da9-49fe-9343-caa6864f9a02] Message Id [28069a3d-f6be-4274-a48b-1ee539524eeb] )
    2022-05-11 09:42:26,425 DEBUG (MyExampleHub.azure-devices.net-java-device-01-ee6c362d-Cxn7a1fb819-e46d-4658-9b03-ca50c88c0440-azure-iot-sdk-IotHubSendTask) [com.microsoft.azure.sdk.iot.device.transport.IotHubTransport] - Invoking the callback function for sent message, IoT Hub responded to message ( Message details: Correlation Id [54d9c6b5-3da9-49fe-9343-caa6864f9a02] Message Id [28069a3d-f6be-4274-a48b-1ee539524eeb] ) with status OK
    Message sent!
    ```

::: zone-end

## Confirm your device provisioning registration

To see which IoT hub your device was provisioned to, examine the registration details of the individual enrollment you created previously:

1. In Azure portal, go to your Device Provisioning Service.

1. In the **Settings** menu, select **Manage enrollments**.

1. Select **Individual Enrollments**. The X.509 enrollment entry that you created previously, *my-x509-device*, should appear in the list.

1. Select the enrollment entry. The IoT hub that your device was assigned to and its device ID appears under **Registration status**.

To verify the device in your IoT hub:

1. In Azure portal, go to the IoT hub that your device was assigned to.

1. In the **Device management** menu, select **Devices**.

1. If your device was provisioned successfully, its device ID, *my-x509-device*, should appear in the list, with **Status** set as *enabled*. If you don't see your device, select **Refresh**.

    :::image type="content" source="./media/quick-create-simulated-device-x509/iot-hub-registration.png" alt-text="Screenshot that shows the device is registered with the IoT hub in Azure portal.":::

::: zone pivot="programming-language-csharp,programming-language-nodejs,programming-language-python,programming-language-java"

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

To learn how to provision multiple X.509 devices using an enrollment group:

> [!div class="nextstepaction"]
> [Tutorial: Provision multiple X.509 devices using an enrollment group](tutorial-custom-hsm-enrollment-group-x509.md)
