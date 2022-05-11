---
title: Quickstart - Provision an X.509 certificate simulated device to Microsoft Azure IoT Hub
description: Learn how to provision a simulated device that authenticates with an X.509 certificate in the Azure IoT Hub Device Provisioning Service
author: kgremban
ms.author: kgremban
ms.date: 09/07/2021
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

This quickstart demonstrates a solution for a Windows-based workstation. However, you can also perform the procedures on Linux. For a Linux example, see [How to provision for multitenancy](how-to-provision-multitenant.md).

## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

* Complete the steps in [Set up IoT Hub Device Provisioning Service with the Azure portal](./quick-setup-auto-provision.md).

The following prerequisites are for a Windows development environment. For Linux or macOS, see the appropriate section in [Prepare your development environment](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/devbox_setup.md) in the SDK documentation.

* Install the latest version of [Git](https://git-scm.com/download/). Make sure that Git is added to the environment variables accessible to the command window. See [Software Freedom Conservancy's Git client tools](https://git-scm.com/download/) for the latest version of `git` tools to install, which includes *Git Bash*, the command-line app that you can use to interact with your local Git repository.

::: zone pivot="programming-language-ansi-c"

* Install [Visual Studio](https://visualstudio.microsoft.com/vs/) 2019 with the ['Desktop development with C++'](/cpp/ide/using-the-visual-studio-ide-for-cpp-desktop-development) workload enabled. Visual Studio 2015 and Visual Studio 2017 are also supported. For Linux or macOS, see the appropriate section in [Prepare your development environment](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/devbox_setup.md) in the SDK documentation.

::: zone-end

::: zone pivot="programming-language-csharp"

* Install [.NET SDK 6.0](https://dotnet.microsoft.com/download) or later on your Windows-based machine. You can use the following command to check your version.

    ```cmd
    dotnet --info
    ```

* Make sure [OpenSSL](https://www.openssl.org/) is installed on your machine. On Windows, your installation of Git includes an installation of OpenSSL. You can access OpenSSL from the Git Bash command prompt. To verify that OpenSSL is installed, open a Git Bash command prompt and enter `openssl version`.

  >[!NOTE]
  > Unless you're familiar with OpenSSL and already have it installed on your Windows machine, we recommend using OpenSSL from the Git Bash prompt. Alternatively, you can choose to download the source code and build OpenSSL. To learn more, see the [OpenSSL Downloads](https://www.openssl.org/source/) page. Or, you can download OpenSSL pre-built from a third-party. To learn more, see the [OpenSSL wiki](https://wiki.openssl.org/index.php/Binaries). Microsoft makes no guarantees about the validity of packages downloaded from third-parties. If you do choose to build or download OpenSSL make sure that the OpenSSL binary is accessible in your path and that the `OPENSSL_CNF` environment variable is set to the path of your *openssl.cnf* file.

::: zone-end

::: zone pivot="programming-language-nodejs"

* Install [Node.js v4.0 or above](https://nodejs.org) on your machine.

* Make sure [OpenSSL](https://www.openssl.org/) is installed on your machine. On Windows, your installation of Git includes an installation of OpenSSL. You can access OpenSSL from the Git Bash command prompt. To verify that OpenSSL is installed, open a Git Bash command prompt and enter `openssl version`.

  >[!NOTE]
  > Unless you're familiar with OpenSSL and already have it installed on your Windows machine, we recommend using OpenSSL from the Git Bash prompt. Alternatively, you can choose to download the source code and build OpenSSL. To learn more, see the [OpenSSL Downloads](https://www.openssl.org/source/) page. Or, you can download OpenSSL pre-built from a third-party. To learn more, see the [OpenSSL wiki](https://wiki.openssl.org/index.php/Binaries). Microsoft makes no guarantees about the validity of packages downloaded from third-parties. If you do choose to build or download OpenSSL make sure that the OpenSSL binary is accessible in your path and that the `OPENSSL_CNF` environment variable is set to the path of your *openssl.cnf* file.

::: zone-end

::: zone pivot="programming-language-python"

* [Python 3.6 or later](https://www.python.org/downloads/) on your machine.

* Make sure [OpenSSL](https://www.openssl.org/) is installed on your machine. On Windows, your installation of Git includes an installation of OpenSSL. You can access OpenSSL from the Git Bash command prompt. To verify that OpenSSL is installed, open a Git Bash command prompt and enter `openssl version`.

  >[!NOTE]
  > Unless you're familiar with OpenSSL and already have it installed on your Windows machine, we recommend using OpenSSL from the Git Bash prompt. Alternatively, you can choose to download the source code and build OpenSSL. To learn more, see the [OpenSSL Downloads](https://www.openssl.org/source/) page. Or, you can download OpenSSL pre-built from a third-party. To learn more, see the [OpenSSL wiki](https://wiki.openssl.org/index.php/Binaries). Microsoft makes no guarantees about the validity of packages downloaded from third-parties. If you do choose to build or download OpenSSL make sure that the OpenSSL binary is accessible in your path and that the `OPENSSL_CNF` environment variable is set to the path of your *openssl.cnf* file.

::: zone-end

::: zone pivot="programming-language-java"

* Install the [Java SE Development Kit 8](/azure/developer/java/fundamentals/java-support-on-azure) or later on your machine.

* Download and install [Maven](https://maven.apache.org/install.html).

::: zone-end

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

1. Open a Git Bash command line environment.

2. Clone the [Azure IoT Samples for C#](https://github.com/Azure-Samples/azure-iot-samples-csharp) GitHub repository using the following command:

    ```cmd
    git clone https://github.com/Azure-Samples/azure-iot-samples-csharp.git
    ```

::: zone-end

::: zone pivot="programming-language-nodejs"

1. Open a Git Bash command line environment.

2. Clone the [Azure IoT Samples for Node.js](https://github.com/Azure/azure-iot-sdk-node.git) GitHub repository using the following command:

    ```cmd
    git clone https://github.com/Azure/azure-iot-sdk-node.git
    ```

::: zone-end

::: zone pivot="programming-language-python"

1. Open Git Bash command line environment.

2. Clone the [Azure IoT Samples for Python](https://github.com/Azure/azure-iot-sdk-node.git) GitHub repository using the following command:

    ```cmd
    git clone https://github.com/Azure/azure-iot-sdk-python.git --recursive
    ```

::: zone-end

::: zone pivot="programming-language-java"

1. Open a Git CMD or Git Bash command line environment.

2. Clone the [Azure IoT Samples for Java](https://github.com/Azure/azure-iot-sdk-java.git) GitHub repository using the following command:

    ```cmd
    git clone https://github.com/Azure/azure-iot-sdk-java.git --recursive
    ```

3. Go to the root `azure-iot-sdk-`java` directory and build the project to download all needed packages.

   ```cmd/sh
   cd azure-iot-sdk-java
   mvn install -DskipTests=true
   ```

4. Go to the certificate generator project and build the project.

    ```cmd/sh
    cd azure-iot-sdk-java/provisioning/provisioning-tools/provisioning-x509-cert-generator
    mvn clean install
    ```

::: zone-end

## Create a self-signed X.509 device certificate

::: zone pivot="programming-language-java"

In this section, you'll use sample code from the Azure IoT SDK to create a self-signed X.509 certificate. This certificate must be uploaded to your provisioning service, and verified by the service.

> [!CAUTION]
> Use certificates created with the SDK tooling for development testing only.
> Do not use these certificates in production.
> The SDK generated certificates contain hard-coded passwords, such as *1234*, and expire after 30 days.
> To learn about obtaining certificates suitable for production use, see [How to get an X.509 CA certificate](../iot-hub/iot-hub-x509ca-overview.md#how-to-get-an-x509-ca-certificate) in the Azure IoT Hub documentation.
>

To create the X.509 certificate:

::: zone-end

::: zone pivot="programming-language-ansi-c,programming-language-python,programming-language-csharp,programming-language-nodejs"

In this section, you'll use OpenSSL to create a self-signed X.509 certificate. This certificate must be uploaded to your provisioning service, and verified by the service.

> [!CAUTION]
> Use certificates created in this quickstart with OpenSSL for development testing only.
> Do not use these certificates in production.
> These certificates contain hard-coded passwords, such as *1234*, and expire after 30 days.
> To learn about obtaining certificates suitable for production use, see [How to get an X.509 CA certificate](../iot-hub/iot-hub-x509ca-overview.md#how-to-get-an-x509-ca-certificate) in the Azure IoT Hub documentation.
>

To create the X.509 certificate:

::: zone-end

::: zone pivot="programming-language-ansi-c"

1. On Windows, open a Git Bash prompt. On Linux, you can use a regular Bash prompt.

1. Create and navigate to a directory where you'd like to create your certificates.

1. Run the following command:

    # [Windows](#tab/windows)

    ```bash
    winpty openssl req -outform PEM -x509 -sha256 -newkey rsa:4096 -keyout ./device-key.pem -out ./device-cert.pem -days 30 -extensions usr_cert -addext extendedKeyUsage=clientAuth -subj "//CN=my-x509-device"
    ```

    > [!IMPORTANT]
    > The extra forward slash given for the subject name (`//CN=my-x509-device`) is only required to escape the string with Git on Windows platforms.

    # [Linux](#tab/linux)

    ```bash
    openssl req -outform PEM -x509 -sha256 -newkey rsa:4096 -keyout ./device-key.pem -out ./device-cert.pem -days 30 -extensions usr_cert -addext extendedKeyUsage=clientAuth -subj "/CN=my-x509-device"
    ```

    ---

1. When asked to **Enter PEM pass phrase:**, use the pass phrase `1234`.

1. When asked **Verifying - Enter PEM pass phrase:**, use the pass phrase `1234` again.

    A test certificate file (*device-cert.pem*) and private key file (*device-key.pem*) should now be generated in the directory where you ran the `openssl` command.

    The certificate file has its subject common name (CN) set to `my-x509-device`. For an X.509-based enrollments, the [Registration ID](./concepts-service.md#registration-id) is set to the common name. The registration ID is a case-insensitive string (up to 128 characters long) of alphanumeric characters plus the special characters: `'-'`, `'.'`, `'_'`, `':'`. The last character must be alphanumeric or dash (`'-'`). The common name must adhere to this format.

1. To view the common name (CN) and other properties of the certificate file, enter the following command:

    # [Windows](#tab/windows)

    ```bash
    winpty openssl x509 -in ./device-cert.pem -text -noout
    ```

    # [Linux](#tab/linux)

    ```bash
    openssl x509 -in ./device-cert.pem -text -noout
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

::: zone-end

::: zone pivot="programming-language-csharp"

The sample code is set up to use X.509 certificates that are stored within a password-protected PKCS12 formatted file (`certificate.pfx`). Additionally, you'll need a public key certificate file (`device-cert.pem`) to create an individual enrollment later in this quickstart.

1. On Windows, open a Git Bash prompt. On Linux, you can use a regular Bash prompt.\

1. Change directories to the project directory for the X.509 device provisioning sample.

    ```bash
    cd ./azure-iot-samples-csharp/provisioning/Samples/device/X509Sample
    ```

1. Run the following command:

    # [Windows](#tab/windows)

    ```bash
    winpty openssl req -outform PEM -x509 -sha256 -newkey rsa:4096 -keyout ./device-key.pem -out ./device-cert.pem -days 30 -extensions usr_cert -addext extendedKeyUsage=clientAuth -subj "//CN=my-x509-device"
    ```

    > [!IMPORTANT]
    > The extra forward slash given for the subject name (`//CN=my-x509-device`) is only required to escape the string with Git on Windows platforms.

    # [Linux](#tab/linux)

    ```bash
    openssl req -outform PEM -x509 -sha256 -newkey rsa:4096 -keyout ./device-key.pem -out ./device-cert.pem -days 30 -extensions usr_cert -addext extendedKeyUsage=clientAuth -subj "/CN=my-x509-device"
    ```

    ---

1. When asked to **Enter PEM pass phrase:**, use the pass phrase `1234`.

1. When asked **Verifying - Enter PEM pass phrase:**, use the pass phrase `1234` again.

    A test certificate file (*device-cert.pem*) and private key file (*device-key.pem*) should now be generated in the directory where you ran the `openssl` command.

    The certificate file has its subject common name (CN) set to `my-x509-device`. For an X.509-based enrollments, the [Registration ID](./concepts-service.md#registration-id) is set to the common name. The registration ID is a case-insensitive string (up to 128 characters long) of alphanumeric characters plus the special characters: `'-'`, `'.'`, `'_'`, `':'`. The last character must be alphanumeric or dash (`'-'`). The common name must adhere to this format.

1. To view the common name (CN) and other properties of the certificate file, enter the following command:

    # [Windows](#tab/windows)

    ```bash
    winpty openssl x509 -in ./python-device-cert.pem -text -noout
    ```

    # [Linux](#tab/linux)

    ```bash
    openssl x509 -in ./python-device-cert.pem -text -noout
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

::: zone-end

::: zone pivot="programming-language-nodejs"

1. On Windows, open a Git Bash prompt. On Linux, you can use a regular Bash prompt.

1. From the location where you downloaded the SDK, go to the sample directory:

    ```bash
    cd ./azure-iot-sdk-node/provisioning/device/samples
    ```

1. Run the following command:

    # [Windows](#tab/windows)

    ```bash
    winpty openssl req -outform PEM -x509 -sha256 -newkey rsa:4096 -keyout ./device-key.pem -out ./device-cert.pem -days 30 -extensions usr_cert -addext extendedKeyUsage=clientAuth -subj "//CN=my-x509-device"
    ```

    > [!IMPORTANT]
    > The extra forward slash given for the subject name (`//CN=my-x509-device`) is only required to escape the string with Git on Windows platforms.

    # [Linux](#tab/linux)

    ```bash
    openssl req -outform PEM -x509 -sha256 -newkey rsa:4096 -keyout ./device-key.pem -out ./device-cert.pem -days 30 -extensions usr_cert -addext extendedKeyUsage=clientAuth -subj "/CN=my-x509-device"
    ```

    ---

1. When asked to **Enter PEM pass phrase:**, use the pass phrase `1234`.

1. When asked **Verifying - Enter PEM pass phrase:**, use the pass phrase `1234` again.

    A test certificate file (*device-cert.pem*) and private key file (*device-key.pem*) should now be generated in the directory where you ran the `openssl` command.

    The certificate file has its subject common name (CN) set to `my-x509-device`. For an X.509-based enrollments, the [Registration ID](./concepts-service.md#registration-id) is set to the common name. The registration ID is a case-insensitive string (up to 128 characters long) of alphanumeric characters plus the special characters: `'-'`, `'.'`, `'_'`, `':'`. The last character must be alphanumeric or dash (`'-'`). The common name must adhere to this format.

1. To view the common name (CN) and other properties of the certificate file, enter the following command:

    # [Windows](#tab/windows)

    ```bash
    winpty openssl x509 -in ./device-cert.pem -text -noout
    ```

    # [Linux](#tab/linux)

    ```bash
    openssl x509 -in ./device-cert.pem -text -noout
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

::: zone-end

::: zone pivot="programming-language-python"

1. On Windows, open a Git Bash prompt. On Linux, you can use a regular Bash prompt.

1. Run the following command:

    # [Windows](#tab/windows)

    ```bash
    winpty openssl req -outform PEM -x509 -sha256 -newkey rsa:4096 -keyout ./python-device-key.pem -out ./python-device-cert.pem -days 30 -extensions usr_cert -addext extendedKeyUsage=clientAuth -subj "//CN=my-x509-device"
    ```

    > [!IMPORTANT]
    > The extra forward slash given for the subject name (`//CN=my-x509-device`) is only required to escape the string with Git on Windows platforms.

    # [Linux](#tab/linux)

    ```bash
    openssl req -outform PEM -x509 -sha256 -newkey rsa:4096 -keyout ./python-device-key.pem -out ./python-device-cert.pem -days 30 -extensions usr_cert -addext extendedKeyUsage=clientAuth -subj "/CN=my-x509-device"
    ```

    ---

1. When asked to **Enter PEM pass phrase:**, use the pass phrase `1234`.

1. When asked **Verifying - Enter PEM pass phrase:**, use the pass phrase `1234` again.

    A test certificate file (*python-device-cert.pem*) and private key file (*python-device-key.pem*) should now be generated in the directory where you ran the `openssl` command.

    The certificate file has its subject common name (CN) set to `my-x509-device`. For an X.509-based enrollments, the [Registration ID](./concepts-service.md#registration-id) is set to the common name. The registration ID is a case-insensitive string (up to 128 characters long) of alphanumeric characters plus the special characters: `'-'`, `'.'`, `'_'`, `':'`. The last character must be alphanumeric or dash (`'-'`). The common name must adhere to this format.

1. To view the common name (CN) and other properties of the certificate file, enter the following command:

    # [Windows](#tab/windows)

    ```bash
    winpty openssl x509 -in ./python-device-cert.pem -text -noout
    ```

    # [Linux](#tab/linux)

    ```bash
    openssl x509 -in ./python-device-cert.pem -text -noout
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

::: zone-end

::: zone pivot="programming-language-java"

1. On Windows, open a Git Bash prompt. On Linux, you can use a regular Bash prompt.

1. Run the following command:

    # [Windows](#tab/windows)

    ```bash
    winpty openssl req -outform PEM -x509 -sha256 -newkey rsa:4096 -keyout ./python-device-key.pem -out ./python-device-cert.pem -days 30 -extensions usr_cert -addext extendedKeyUsage=clientAuth -subj "//CN=my-x509-device"
    ```

    > [!IMPORTANT]
    > The extra forward slash given for the subject name (`//CN=my-x509-device`) is only required to escape the string with Git on Windows platforms.

    # [Linux](#tab/linux)

    ```bash
    openssl req -outform PEM -x509 -sha256 -newkey rsa:4096 -keyout ./python-device-key.pem -out ./python-device-cert.pem -days 30 -extensions usr_cert -addext extendedKeyUsage=clientAuth -subj "/CN=my-x509-device"
    ```

    ---

1. When asked to **Enter PEM pass phrase:**, use the pass phrase `1234`.

1. When asked **Verifying - Enter PEM pass phrase:**, use the pass phrase `1234` again.

    A test certificate file (*python-device-cert.pem*) and private key file (*python-device-key.pem*) should now be generated in the directory where you ran the `openssl` command.

    The certificate file has its subject common name (CN) set to `my-x509-device`. For an X.509-based enrollments, the [Registration ID](./concepts-service.md#registration-id) is set to the common name. The registration ID is a case-insensitive string (up to 128 characters long) of alphanumeric characters plus the special characters: `'-'`, `'.'`, `'_'`, `':'`. The last character must be alphanumeric or dash (`'-'`). The common name must adhere to this format.

1. To view the common name (CN) and other properties of the certificate file, enter the following command:

    # [Windows](#tab/windows)

    ```bash
    winpty openssl x509 -in ./python-device-cert.pem -text -noout
    ```

    # [Linux](#tab/linux)

    ```bash
    openssl x509 -in ./python-device-cert.pem -text -noout
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
    * **Primary certificate .pem or .cer file:** Choose **Select a file** to select the certificate file, *device-cert.pem* that you created in the previous section.
    * Leave **IoT Hub Device ID:** blank. Your device will be provisioned with its device ID set to the common name (CN) in the X.509 certificate, *my-x509-device*. This common name will also be the name used for the registration ID for the individual enrollment entry.
    * Optionally, you can provide the following information:
        * Select an IoT hub linked with your provisioning service.
        * Update the **Initial device twin state** with the desired initial configuration for the device.

    :::image type="content" source="./media/quick-create-simulated-device-x509/device-enrollment.png" alt-text="Add device as individual enrollment with X.509 attestation.":::

::: zone-end

::: zone pivot="programming-language-csharp"

6. In the **Add Enrollment** page, enter the following information.

    * **Mechanism:** Select **X.509** as the identity attestation *Mechanism*.
    * **Primary certificate .pem or .cer file:** Choose **Select a file** to select the certificate file, *device-cert.pem* that you created in the previous section.
    * Leave **IoT Hub Device ID:** blank. Your device will be provisioned with its device ID set to the common name (CN) in the X.509 certificate, *my-x509-device*. This common name will also be the name used for the registration ID for the individual enrollment entry.
    * Optionally, you can provide the following information:
        * Select an IoT hub linked with your provisioning service.
        * Update the **Initial device twin state** with the desired initial configuration for the device.

    :::image type="content" source="./media/quick-create-simulated-device-x509/device-enrollment.png" alt-text="Add device as individual enrollment with X.509 attestation.":::

::: zone-end

::: zone pivot="programming-language-nodejs"

6. In the **Add Enrollment** page, enter the following information.

    * **Mechanism:** Select **X.509** as the identity attestation *Mechanism*.
    * **Primary certificate .pem or .cer file:** Choose **Select a file** to select the certificate file, *device-cert.pem* that you created in the previous section.
    * Optionally, you can provide the following information:
        * Select an IoT hub linked with your provisioning service.
        * Enter a unique device ID. Make sure to avoid sensitive data while naming your device.
        * Update the **Initial device twin state** with the desired initial configuration for the device.
    :::image type="content" source="./media/quick-create-simulated-device-x509/device-enrollment.png" alt-text="Add device as individual enrollment with X.509 attestation.":::

::: zone-end

::: zone pivot="programming-language-python"

6. In the **Add Enrollment** page, enter the following information.

    * **Mechanism:** Select **X.509** as the identity attestation *Mechanism*.
    * **Primary certificate .pem or .cer file:** Choose **Select a file** to select the certificate file, *python-device-cert.pem* if you are using the test certificate created earlier.
    * Optionally, you can provide the following information:
        * Select an IoT hub linked with your provisioning service.
        * Update the **Initial device twin state** with the desired initial configuration for the device.

    :::image type="content" source="./media/quick-create-simulated-device-x509/device-enrollment.png" alt-text="Add device as individual enrollment with X.509 attestation.":::

::: zone-end

::: zone pivot="programming-language-java"

6. In the **Add Enrollment** panel, enter the following information:
   * Select **X.509** as the identity attestation *Mechanism*.
   * Under the *Primary certificate .pem or .cer file*, choose *Select a file* to select the certificate file *X509individual.pem* created in the previous steps.
   * Optionally, you may provide the following information:
     * Select an IoT hub linked with your provisioning service.
     * Enter a unique device ID. Make sure to avoid sensitive data while naming your device.
     * Update the **Initial device twin state** with the desired initial configuration for the device.

    :::image type="content" source="./media/quick-create-simulated-device-x509/device-enrollment.png" alt-text="Add device as individual enrollment with X.509 attestation.":::

::: zone-end

7. Select **Save**. You'll be returned to **Manage enrollments**.

8. Select **Individual Enrollments**. Your X.509 enrollment entry should appear in the registration table.

## Prepare and run the device provisioning code

::: zone pivot="programming-language-ansi-c"

In this section, we'll update the sample code to send the device's boot sequence to your Device Provisioning Service instance. This boot sequence will cause the device to be recognized and assigned to an IoT hub linked to the Device Provisioning Service instance.

### Configure the provisioning device code

In this section, you update the sample code with your Device Provisioning Service instance information. 

1. In the Azure portal, select the **Overview** tab for your Device Provisioning Service.

1. Copy the **_ID Scope_** value.

    :::image type="content" source="./media/quick-create-simulated-device-x509/copy-id-scope.png" alt-text="Copy ID Scope from the portal.":::

1. Launch Visual Studio and open the new solution file that was created in the `cmake` directory you created in the root of the azure-iot-sdk-c git repository. The solution file is named `azure_iot_sdks.sln`.

1. In Solution Explorer for Visual Studio, navigate to **Provisioning_Samples > prov_dev_client_sample > Source Files** and open *prov_dev_client_sample.c*.

1. Find the `id_scope` constant, and replace the value with your **ID Scope** value that you copied in step 2.

    ```c
    static const char* id_scope = "0ne00000A0A";
    ```

1. Find the definition for the `main()` function in the same file. Make sure the `hsm_type` variable is set to `SECURE_DEVICE_TYPE_X509` as shown below.

    ```c
    SECURE_DEVICE_TYPE hsm_type;
    //hsm_type = SECURE_DEVICE_TYPE_TPM;
    hsm_type = SECURE_DEVICE_TYPE_X509;
    //hsm_type = SECURE_DEVICE_TYPE_SYMMETRIC_KEY;
    ```

1. Right-click the **prov\_dev\_client\_sample** project and select **Set as Startup Project**.

### Configure the custom HSM stub code

The specifics of interacting with actual secure hardware-based storage vary depending on the hardware. As a result, the certificate and private key used by the simulated device in this quickstart will be hardcoded in the custom Hardware Security Module (HSM) stub code.

To update the custom HSM stub code to simulate the identity of the device with ID `my-x509-device`:

1. In Solution Explorer for Visual Studio, navigate to **Provisioning_Samples > custom_hsm_example > Source Files** and open *custom_hsm_example.c*.

1. Update the string value of the `COMMON_NAME` string constant using the common name you used when generating the device certificate, `my-x509-device`.

    ```c
    static const char* const COMMON_NAME = "my-x509-device";
    ```

1. In the same file, you need to update the string value of the `CERTIFICATE` constant string using your certificate chain text you saved in *./certs/new-device-01-full-chain.cert.pem* after generating your certificates.

    The syntax of certificate text must follow the pattern below with no extra spaces or parsing done by Visual Studio.

    ```c
    // <Device/leaf cert>
    // <intermediates>
    // <root>
    static const char* const CERTIFICATE = "-----BEGIN CERTIFICATE-----\n"
    "MIIFOjCCAyKgAwIBAgIJAPzMa6s7mj7+MA0GCSqGSIb3DQEBCwUAMCoxKDAmBgNV\n"
        ...
    "MDMwWhcNMjAxMTIyMjEzMDMwWjAqMSgwJgYDVQQDDB9BenVyZSBJb1QgSHViIENB\n"
    "-----END CERTIFICATE-----";        
    ```

    Updating this string value correctly in this step can be very tedious and subject to error. To generate the proper syntax in your Git Bash prompt, copy and paste the following bash shell commands into your Git Bash command prompt, and press **ENTER**. These commands will generate the syntax for the `CERTIFICATE` string constant value.

    ```Bash
    input="./certs/new-device-01-full-chain.cert.pem"
    bContinue=true
    prev=
    while $bContinue; do
        if read -r next; then
          if [ -n "$prev" ]; then	
            echo "\"$prev\\n\""
          fi
          prev=$next  
        else
          echo "\"$prev\";"
          bContinue=false
        fi	
    done < "$input"
    ```

    Copy and paste the output certificate text for the new constant value.

1. In the same file, the string value of the `PRIVATE_KEY` constant must also be updated with the private key for your device certificate.

    The syntax of the private key text must follow the pattern below with no extra spaces or parsing done by Visual Studio.

    ```c
    static const char* const PRIVATE_KEY = "-----BEGIN RSA PRIVATE KEY-----\n"
    "MIIJJwIBAAKCAgEAtjvKQjIhp0EE1PoADL1rfF/W6v4vlAzOSifKSQsaPeebqg8U\n"
        ...
    "X7fi9OZ26QpnkS5QjjPTYI/wwn0J9YAwNfKSlNeXTJDfJ+KpjXBcvaLxeBQbQhij\n"
    "-----END RSA PRIVATE KEY-----";
    ```

    Updating this string value correctly in this step can also be very tedious and subject to error. To generate the proper syntax in your Git Bash prompt, copy and paste the following bash shell commands, and press **ENTER**. These commands will generate the syntax for the `PRIVATE_KEY` string constant value.

    ```Bash
    input="./private/new-device-01.key.pem"
    bContinue=true
    prev=
    while $bContinue; do
        if read -r next; then
          if [ -n "$prev" ]; then	
            echo "\"$prev\\n\""
          fi
          prev=$next  
        else
          echo "\"$prev\";"
          bContinue=false
        fi	
    done < "$input"
    ```

    Copy and paste the output private key text for the new constant value. 

1. Save *custom_hsm_example.c*.

### Run the sample

1. On the Visual Studio menu, select **Debug** > **Start without debugging** to run the solution. When prompted to rebuild the project, select **Yes** to rebuild the project before running.

    The following output is an example of simulated device `custom-hsm-device-01` successfully booting up, and connecting to the provisioning service. The device was assigned to an IoT hub and registered:

    ```cmd
    Provisioning API Version: 1.3.9
    
    Registering Device
    
    Provisioning Status: PROV_DEVICE_REG_STATUS_CONNECTED
    Provisioning Status: PROV_DEVICE_REG_STATUS_ASSIGNING
    
    Registration Information received from service: test-docs-hub.azure-devices.net, deviceId: custom-hsm-device-01
    Press enter key to exit:
    ```

::: zone-end

::: zone pivot="programming-language-csharp"

1. In the Azure portal, select the **Overview** tab for your Device Provisioning Service.

2. Copy the **_ID Scope_** value.

    :::image type="content" source="./media/quick-create-simulated-device-x509/copy-id-scope.png" alt-text="Copy ID Scope from the portal.":::

3. Open a command prompt and change to the X509Sample directory. This is located in the*.\azure-iot-samples-csharp\provisioning\Samples\device\X509Sample* directory off the directory where you cloned the samples on your computer.

4. Type the following command to build and run the X.509 device provisioning sample (replace the `<IDScope>` value with the ID Scope that you copied in the previous section.). The certificate file will default to *./certificate.pfx* and prompt for the .pfx password. Type in your password.

    ```cmd/sh
    dotnet run -- -s <IDScope>
    ```

    If you want to pass everything as a parameter, you can use the following example format.

    ```cmd/sh
    dotnet run -- -s 0ne00000A0A -c certificate.pfx -p 1234
    ```

5. The device will now connect to DPS and be assigned to an IoT Hub. Then, the device will send a telemetry message to the hub.

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

1. In the Azure portal, select the **Overview** tab for your Device Provisioning Service.

1. Copy the **_ID Scope_** and **Global device endpoint** values.

    :::image type="content" source="./media/quick-create-simulated-device-x509/copy-id-scope-and-global-device-endpoint.png" alt-text="Copy ID Scope from the portal.":::

1. In a command window, from the location where you downloaded the SDK, go to the sample directory, and build the project:

    ```cmd/sh
    cd ./azure-iot-sdk-node/provisioning/device/samples
    npm install
    ```

5. Edit the **register_x509.js** file amd make the following changes:

    * Replace `provisioning host` with the **_Global Device Endpoint_** noted in **Step 1** above.
    * Replace `id scope` with the **_ID Scope_** noted in **Step 1** above.
    * Replace `registration id` with the **_Registration ID_** noted in the previous section.
    * Replace `cert filename` and `key filename` with the files you generated previously, *device-cert.pem* and *device-key.pem*.

6. Save the file.

7. Run the script and verify that the device was provisioned successfully.

    ```cmd/sh
    node register_x509.js
    ```

>[!TIP]
>The [Azure IoT Hub Node.js Device SDK](https://github.com/Azure/azure-iot-sdk-node) provides an easy way to simulate a device. For more information, see [Device concepts](./concepts-service.md).

::: zone-end

::: zone pivot="programming-language-python"

The Python provisioning sample, [provision_x509.py](https://github.com/Azure/azure-iot-sdk-python/blob/main/azure-iot-device/samples/async-hub-scenarios/provision_x509.py) is located in the `azure-iot-sdk-python/azure-iot-device/samples/async-hub-scenarios` directory. This sample uses six environment variables to authenticate and provision an IoT device using DPS. These environment variables are:

| Variable name              | Description                                     |
| :------------------------- | :---------------------------------------------- |
| `PROVISIONING_HOST`        |  This value is the global endpoint used for connecting to your DPS resource |
| `PROVISIONING_IDSCOPE`     |  This value is the ID Scope for your DPS resource |
| `DPS_X509_REGISTRATION_ID` |  This value is the ID for your device. It must also match the subject name on the device certificate |
| `X509_CERT_FILE`           |  Your device certificate filename |
| `X509_KEY_FILE`            |  The private key filename for your device certificate |
| `PASS_PHRASE`              |  The pass phrase you used to encrypt the certificate and private key file (`1234`). |

1. In the Azure portal, select the **Overview** tab for your Device Provisioning Service.

2. Copy the **_ID Scope_** and **Global device endpoint** values.

    :::image type="content" source="./media/quick-create-simulated-device-x509/copy-id-scope-and-global-device-endpoint.png" alt-text="Copy ID Scope from the portal.":::

3. In your Git Bash prompt, use the following commands to add the environment variables for the global device endpoint and ID Scope.

    ```bash
    $export PROVISIONING_HOST=global.azure-devices-provisioning.net
    $export PROVISIONING_IDSCOPE=<ID scope for your DPS resource>
    ```

4. The registration ID for the IoT device must match subject name on its device certificate. If you generated a self-signed test certificate, `my-x509-device` is both the subject name and the registration ID for the device.

5. In the Git Bash prompt, set the environment variable for the registration ID as follows:

    ```bash
    $export DPS_X509_REGISTRATION_ID=my-x509-device
    ```

6. In the Git Bash prompt, set the environment variables for the certificate file, private key file, and pass phrase.

    ```bash
    $export X509_CERT_FILE=./python-device-cert.pem
    $export X509_KEY_FILE=./python-device-key.pem
    $export PASS_PHRASE=1234
    ```

7. Review the code for [provision_x509.py](https://github.com/Azure/azure-iot-sdk-python/blob/main/azure-iot-device/samples/async-hub-scenarios/provision_x509.py). If you're not using **Python version 3.7** or later, make the [code change mentioned here](https://github.com/Azure/azure-iot-sdk-python/tree/main/azure-iot-device/samples/async-hub-scenarios#advanced-iot-hub-scenario-samples-for-the-azure-iot-hub-device-sdk) to replace `asyncio.run(main())`.

8. Save your changes.

9. Run the sample. The sample will connect, provision the device to a hub, and send some test messages to the hub.

    ```bash
    $ winpty python azure-iot-sdk-python/azure-iot-device/samples/async-hub-scenarios/provision_x509.py
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

1. In the Azure portal, select the **Overview** tab for your Device Provisioning Service.

2. Copy the **_ID Scope_** and **Global device endpoint** values.

    :::image type="content" source="./media/quick-create-simulated-device-x509/copy-id-scope-and-global-device-endpoint.png" alt-text="Copy ID Scope from the portal.":::

3. Open a command prompt. Navigate to the sample project folder of the Java SDK repository.

    ```cmd/sh
    cd azure-iot-sdk-java/provisioning/provisioning-samples/provisioning-X509-sample
    ```

4. Enter the provisioning service and X.509 identity information in your code. This is used during provisioning, for attestation of the simulated device, prior to device registration:

   * Edit the file `/src/main/java/samples/com/microsoft/azure/sdk/iot/ProvisioningX509Sample.java`, to include your _ID Scope_ and _Provisioning Service Global Endpoint_ as noted previously. Also include _Client Cert_ and _Client Cert Private Key_ as noted in the previous section.

      ```java
      private static final String idScope = "[Your ID scope here]";
      private static final String globalEndpoint = "[Your Provisioning Service Global Endpoint here]";
      private static final ProvisioningDeviceClientTransportProtocol PROVISIONING_DEVICE_CLIENT_TRANSPORT_PROTOCOL = ProvisioningDeviceClientTransportProtocol.HTTPS;
      private static final String leafPublicPem = "<Your Public PEM Certificate here>";
      private static final String leafPrivateKey = "<Your Private PEM Key here>";
      ```

   * Use the following format when copying/pasting your certificate and private key:

      ```java
      private static final String leafPublicPem = "-----BEGIN CERTIFICATE-----\n" +
        "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
        "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
        "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
        "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
        "+XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
        "-----END CERTIFICATE-----\n";
      private static final String leafPrivateKey = "-----BEGIN PRIVATE KEY-----\n" +
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
            "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
            "XXXXXXXXXX\n" +
            "-----END PRIVATE KEY-----\n";
      ```

5. Build the sample, and then go to the `target` folder and execute the created .jar file.

    ```cmd/sh
    mvn clean install
    cd target
    java -jar ./provisioning-x509-sample-{version}-with-deps.jar
    ```

    The sample will connect, provision the device to a hub, and send some test messages to the IoT hub.

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
> [Azure quickstart - Enroll X.509 devices to Azure IoT Hub Device Provisioning Service](quick-enroll-device-x509.md)
