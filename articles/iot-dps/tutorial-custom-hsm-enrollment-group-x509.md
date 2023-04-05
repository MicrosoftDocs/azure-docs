---
title: Tutorial - Provision X.509 devices to Azure IoT Hub using a DPS enrollment group
description: This tutorial shows how to use X.509 certificates to provision multiple devices through an enrollment group in your Azure IoT Hub Device Provisioning Service (DPS) instance. 
author: kgremban
ms.author: kgremban
ms.date: 11/01/2022
ms.topic: tutorial
ms.service: iot-dps
services: iot-dps 
ms.custom: mvc
zone_pivot_groups: iot-dps-set1
#Customer intent: As a new IoT developer, I want provision groups of devices using X.509 certificate chains and the Azure IoT device SDK.
---

# Tutorial: Provision multiple X.509 devices using enrollment groups

In this tutorial, you'll learn how to provision groups of IoT devices that use X.509 certificates for authentication. Sample device code from the Azure IoT SDK will be executed on your development machine to simulate provisioning of X.509 devices. On real devices, device code would be deployed and run from the IoT device.

The Azure IoT Hub Device Provisioning Service supports two types of enrollments for provisioning devices:

* [Enrollment groups](concepts-service.md#enrollment-group): Used to enroll multiple related devices. This tutorial demonstrates provisioning with enrollment groups.
* [Individual Enrollments](concepts-service.md#individual-enrollment): Used to enroll a single device.

The Azure IoT Hub Device Provisioning Service supports three forms of authentication for provisioning devices:

* [X.509 certificates](concepts-x509-attestation.md). This tutorial demonstrates X.509 certificate attestation.
* [Trusted platform module (TPM)](concepts-tpm-attestation.md)
* [Symmetric keys](./concepts-symmetric-key-attestation.md)

::: zone pivot="programming-language-ansi-c"
This tutorial uses the [custom HSM sample](https://github.com/Azure/azure-iot-sdk-c/tree/master/provisioning_client/samples/custom_hsm_example), which provides a stub implementation for interfacing with hardware-based secure storage. A [Hardware Security Module (HSM)](./concepts-service.md#hardware-security-module) is used for secure, hardware-based storage of device secrets. An HSM can be used with symmetric key, X.509 certificate, or TPM attestation to provide secure storage for secrets. Hardware-based storage of device secrets isn't required, but it's strongly recommended to help protect sensitive information like your device certificate's private key.
::: zone-end

::: zone pivot="programming-language-csharp,programming-language-nodejs,programming-language-python,programming-language-java"
A [Hardware Security Module (HSM)](./concepts-service.md#hardware-security-module) is used for secure, hardware-based storage of device secrets. An HSM can be used with symmetric key, X.509 certificate, or TPM attestation to provide secure storage for secrets. Hardware-based storage of device secrets isn't required, but it's strongly recommended to help protect sensitive information like your device certificate's private key.
::: zone-end

In this tutorial, you'll complete the following objectives:

> [!div class="checklist"]
>
> * Create a certificate chain of trust to organize a set of devices using X.509 certificates.
> * Complete proof of possession with a signing certificate used with the certificate chain.
> * Create a new group enrollment that uses the certificate chain.
> * Set up the development environment.
> * Provision a device using the certificate chain using sample code in the Azure IoT device SDK.

## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

* Complete the steps in [Set up IoT Hub Device Provisioning Service with the Azure portal](./quick-setup-auto-provision.md).

::: zone pivot="programming-language-ansi-c"

The following prerequisites are for a Windows development environment used to simulate the devices. For Linux or macOS, see the appropriate section in [Prepare your development environment](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/devbox_setup.md) in the SDK documentation.

* Install [Visual Studio](https://visualstudio.microsoft.com/vs/) 2022 with the ['Desktop development with C++'](/cpp/ide/using-the-visual-studio-ide-for-cpp-desktop-development) workload enabled. Visual Studio 2015, Visual Studio 2017, and Visual Studio 19 are also supported.

* Install the latest [CMake build system](https://cmake.org/download/). Make sure you check the option that adds the CMake executable to your path.

    >[!IMPORTANT]
    >Confirm that the Visual Studio prerequisites (Visual Studio and the 'Desktop development with C++' workload) are installed on your machine, **before** starting the `CMake` installation. Once the prerequisites are in place, and the download is verified, install the CMake build system. Also, be aware that older versions of the CMake build system fail to generate the solution file used in this tutorial. Make sure to use the latest version of CMake.

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

    The steps in this tutorial assume that you're using a Windows machine and the OpenSSL installation that is installed as part of Git. You'll use the Git Bash prompt to issue OpenSSL commands and the Windows command prompt for everything else. If you're using Linux, you can issue all commands from a Bash shell.

## Prepare your development environment

::: zone pivot="programming-language-ansi-c"

In this section, you'll prepare a development environment used to build the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c). The SDK includes sample code and tools used by devices provisioning with DPS.

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

    When specifying the path used with `-Dhsm_custom_lib` in the command below, make sure to use the absolute path to the library in the `cmake` directory you previously created. The path shown below assumes that you cloned the C SDK in the root directory of the C drive. If you used another directory, adjust the path accordingly.

    ```cmd
    cmake -Duse_prov_client:BOOL=ON -Dhsm_custom_lib=c:/azure-iot-sdk-c/cmake/provisioning_client/samples/custom_hsm_example/Debug/custom_hsm_example.lib ..
    ```

    >[!TIP]
    >If `cmake` doesn't find your C++ compiler, you may get build errors while running the above command. If that happens, try running the command in the [Visual Studio command prompt](/dotnet/framework/tools/developer-command-prompt-for-vs).

7. When the build succeeds, the last few output lines look similar to the following output:

    ```output
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

## Create an X.509 certificate chain

In this section, you'll generate an X.509 certificate chain of three certificates for testing each device with this tutorial. The certificates have the following hierarchy.

:::image type="content" source="./media/tutorial-custom-hsm-enrollment-group-x509/example-device-cert-chain.png" alt-text="Diagram that shows relationship of root C A, intermediate C A, and device certificates." border="false":::

[Root certificate](concepts-x509-attestation.md#root-certificate): You'll complete [proof of possession](how-to-verify-certificates.md) to verify the root certificate. This verification enables DPS to trust that certificate and verify certificates signed by it.

[Intermediate certificate](concepts-x509-attestation.md#intermediate-certificate): It's common to use intermediate certificates to group devices logically by product lines, company divisions, or other criteria. This tutorial uses a certificate chain with one intermediate certificate, but in a production scenario you may have several. The intermediate certificate in this chain is signed by the root certificate. This certificate is provided to the enrollment group created in DPS to logically group a set of devices. This configuration allows managing a whole group of devices that have device certificates signed by the same intermediate certificate.

[Device certificates](concepts-x509-attestation.md#end-entity-leaf-certificate): The device certificates (sometimes called leaf certificates) will be signed by the intermediate certificate and stored on the device along with its private key. Ideally these sensitive items would be stored securely with an HSM. Each device presents its certificate and private key, along with the certificate chain, when attempting provisioning.

### Set up the X.509 OpenSSL environment

In this section, you'll create the Openssl configuration files, directory structure, and other files used by the Openssl commands.

1. In your Git Bash command prompt, navigate to a folder where you want to generate the X.509 certificates and keys for this tutorial.

1. Create an OpenSSL configuration file for your root CA certificate. OpenSSL configuration files contain policies and definitions that are consumed by OpenSSL commands. Copy and paste the following text into a file named *openssl_root_ca.cnf*:

    ```text
    # OpenSSL root CA configuration file.

    [ ca ]
    default_ca = CA_default

    [ CA_default ]
    # Directory and file locations.
    dir               = .
    certs             = $dir/certs
    crl_dir           = $dir/crl
    new_certs_dir     = $dir/newcerts
    database          = $dir/index.txt
    serial            = $dir/serial
    RANDFILE          = $dir/private/.rand

    # The root key and root certificate.
    private_key       = $dir/private/azure-iot-test-only.root.ca.key.pem
    certificate       = $dir/certs/azure-iot-test-only.root.ca.cert.pem

    # For certificate revocation lists.
    crlnumber         = $dir/crlnumber
    crl               = $dir/crl/azure-iot-test-only.intermediate.crl.pem
    crl_extensions    = crl_ext
    default_crl_days  = 30

    # SHA-1 is deprecated, so use SHA-2 instead.
    default_md        = sha256

    name_opt          = ca_default
    cert_opt          = ca_default
    default_days      = 375
    preserve          = no
    policy            = policy_loose

    [ policy_strict ]
    # The root CA should only sign intermediate certificates that match.
    countryName             = optional
    stateOrProvinceName     = optional
    organizationName        = optional
    organizationalUnitName  = optional
    commonName              = supplied
    emailAddress            = optional

    [ policy_loose ]
    # Allow the intermediate CA to sign a more diverse range of certificates.
    countryName             = optional
    stateOrProvinceName     = optional
    localityName            = optional
    organizationName        = optional
    organizationalUnitName  = optional
    commonName              = supplied
    emailAddress            = optional

    [ req ]
    default_bits        = 2048
    distinguished_name  = req_distinguished_name
    string_mask         = utf8only

    # SHA-1 is deprecated, so use SHA-2 instead.
    default_md          = sha256

    # Extension to add when the -x509 option is used.
    x509_extensions     = v3_ca

    [ req_distinguished_name ]
    # See <https://en.wikipedia.org/wiki/Certificate_signing_request>.
    countryName                     = Country Name (2 letter code)
    stateOrProvinceName             = State or Province Name
    localityName                    = Locality Name
    0.organizationName              = Organization Name
    organizationalUnitName          = Organizational Unit Name
    commonName                      = Common Name
    emailAddress                    = Email Address

    # Optionally, specify some defaults.
    countryName_default             = US
    stateOrProvinceName_default     = WA
    localityName_default            =
    0.organizationName_default      = My Organization
    organizationalUnitName_default  =
    emailAddress_default            =

    [ v3_ca ]
    # Extensions for a typical CA.
    subjectKeyIdentifier = hash
    authorityKeyIdentifier = keyid:always,issuer
    basicConstraints = critical, CA:true
    keyUsage = critical, digitalSignature, cRLSign, keyCertSign

    [ v3_intermediate_ca ]
    # Extensions for a typical intermediate CA.
    subjectKeyIdentifier = hash
    authorityKeyIdentifier = keyid:always,issuer
    basicConstraints = critical, CA:true
    keyUsage = critical, digitalSignature, cRLSign, keyCertSign

    [ usr_cert ]
    # Extensions for client certificates.
    basicConstraints = CA:FALSE
    nsComment = "OpenSSL Generated Client Certificate"
    subjectKeyIdentifier = hash
    authorityKeyIdentifier = keyid,issuer
    keyUsage = critical, nonRepudiation, digitalSignature, keyEncipherment
    extendedKeyUsage = clientAuth

    [ server_cert ]
    # Extensions for server certificates.
    basicConstraints = CA:FALSE
    nsComment = "OpenSSL Generated Server Certificate"
    subjectKeyIdentifier = hash
    authorityKeyIdentifier = keyid,issuer:always
    keyUsage = critical, digitalSignature, keyEncipherment
    extendedKeyUsage = serverAuth

    [ crl_ext ]
    # Extension for CRLs.
    authorityKeyIdentifier=keyid:always

    [ ocsp ]
    # Extension for OCSP signing certificates.
    basicConstraints = CA:FALSE
    subjectKeyIdentifier = hash
    authorityKeyIdentifier = keyid,issuer
    keyUsage = critical, digitalSignature
    extendedKeyUsage = critical, OCSPSigning
    ```

1. Create an OpenSSL configuration file to use for intermediate and device certificates. Copy and paste the following text into a file named *openssl_device_intermediate_ca.cnf*:

    ```text
    # OpenSSL root CA configuration file.

    [ ca ]
    default_ca = CA_default

    [ CA_default ]
    # Directory and file locations.
    dir               = .
    certs             = $dir/certs
    crl_dir           = $dir/crl
    new_certs_dir     = $dir/newcerts
    database          = $dir/index.txt
    serial            = $dir/serial
    RANDFILE          = $dir/private/.rand

    # The root key and root certificate.
    private_key       = $dir/private/azure-iot-test-only.intermediate.key.pem
    certificate       = $dir/certs/azure-iot-test-only.intermediate.cert.pem

    # For certificate revocation lists.
    crlnumber         = $dir/crlnumber
    crl               = $dir/crl/azure-iot-test-only.intermediate.crl.pem
    crl_extensions    = crl_ext
    default_crl_days  = 30

    # SHA-1 is deprecated, so use SHA-2 instead.
    default_md        = sha256

    name_opt          = ca_default
    cert_opt          = ca_default
    default_days      = 375
    preserve          = no
    policy            = policy_loose

    [ policy_strict ]
    # The root CA should only sign intermediate certificates that match.
    countryName             = optional
    stateOrProvinceName     = optional
    organizationName        = optional
    organizationalUnitName  = optional
    commonName              = supplied
    emailAddress            = optional

    [ policy_loose ]
    # Allow the intermediate CA to sign a more diverse range of certificates.
    countryName             = optional
    stateOrProvinceName     = optional
    localityName            = optional
    organizationName        = optional
    organizationalUnitName  = optional
    commonName              = supplied
    emailAddress            = optional

    [ req ]
    default_bits        = 2048
    distinguished_name  = req_distinguished_name
    string_mask         = utf8only

    # SHA-1 is deprecated, so use SHA-2 instead.
    default_md          = sha256

    # Extension to add when the -x509 option is used.
    x509_extensions     = v3_ca

    [ req_distinguished_name ]
    # See <https://en.wikipedia.org/wiki/Certificate_signing_request>.
    countryName                     = Country Name (2 letter code)
    stateOrProvinceName             = State or Province Name
    localityName                    = Locality Name
    0.organizationName              = Organization Name
    organizationalUnitName          = Organizational Unit Name
    commonName                      = Common Name
    emailAddress                    = Email Address

    # Optionally, specify some defaults.
    countryName_default             = US
    stateOrProvinceName_default     = WA
    localityName_default            =
    0.organizationName_default      = My Organization
    organizationalUnitName_default  =
    emailAddress_default            =

    [ v3_ca ]
    # Extensions for a typical CA.
    subjectKeyIdentifier = hash
    authorityKeyIdentifier = keyid:always,issuer
    basicConstraints = critical, CA:true
    keyUsage = critical, digitalSignature, cRLSign, keyCertSign

    [ v3_intermediate_ca ]
    # Extensions for a typical intermediate CA.
    subjectKeyIdentifier = hash
    authorityKeyIdentifier = keyid:always,issuer
    basicConstraints = critical, CA:true
    keyUsage = critical, digitalSignature, cRLSign, keyCertSign

    [ usr_cert ]
    # Extensions for client certificates.
    basicConstraints = CA:FALSE
    nsComment = "OpenSSL Generated Client Certificate"
    subjectKeyIdentifier = hash
    authorityKeyIdentifier = keyid,issuer
    keyUsage = critical, nonRepudiation, digitalSignature, keyEncipherment
    extendedKeyUsage = clientAuth

    [ server_cert ]
    # Extensions for server certificates.
    basicConstraints = CA:FALSE
    nsComment = "OpenSSL Generated Server Certificate"
    subjectKeyIdentifier = hash
    authorityKeyIdentifier = keyid,issuer:always
    keyUsage = critical, digitalSignature, keyEncipherment
    extendedKeyUsage = serverAuth

    [ crl_ext ]
    # Extension for CRLs.
    authorityKeyIdentifier=keyid:always

    [ ocsp ]
    # Extension for OCSP signing certificates.
    basicConstraints = CA:FALSE
    subjectKeyIdentifier = hash
    authorityKeyIdentifier = keyid,issuer
    keyUsage = critical, digitalSignature
    extendedKeyUsage = critical, OCSPSigning
    ```

1. Create the directory structure, the database file (index.txt), and the serial number file (serial) used by OpenSSL commands in this tutorial:

    ```bash
    mkdir certs csr newcerts private
    touch index.txt
    openssl rand -hex 16 > serial
    ```

### Create the root CA certificate

Run the following commands to create the root CA private key and the root CA certificate. You'll use this certificate and key to sign your intermediate certificate.

1. Create the root CA private key:

    ```bash
    openssl genrsa -aes256 -passout pass:1234 -out ./private/azure-iot-test-only.root.ca.key.pem 4096
    ```

1. Create the root CA certificate:

    # [Windows](#tab/windows)

    ```bash
    openssl req -new -x509 -config ./openssl_root_ca.cnf -passin pass:1234 -key ./private/azure-iot-test-only.root.ca.key.pem -subj '//CN=Azure IoT Hub CA Cert Test Only' -days 30 -sha256 -extensions v3_ca -out ./certs/azure-iot-test-only.root.ca.cert.pem
    ```

    > [!IMPORTANT]
    > The extra forward slash given for the subject name (`//CN=Azure IoT Hub CA Cert Test Only`) is only required to escape the string with Git on Windows platforms.

    # [Linux](#tab/linux)

    ```bash
    openssl req -new -x509 -config ./openssl_root_ca.cnf -passin pass:1234 -key ./private/azure-iot-test-only.root.ca.key.pem -subj '/CN=Azure IoT Hub CA Cert Test Only' -days 30 -sha256 -extensions v3_ca -out ./certs/azure-iot-test-only.root.ca.cert.pem
    ```

    ---

1. Examine the root CA certificate:

    ```bash
    openssl x509 -noout -text -in ./certs/azure-iot-test-only.root.ca.cert.pem
    ```

    Observe that the **Issuer** and the **Subject** are both the root CA.

    ```output
    Certificate:
        Data:
            Version: 3 (0x2)
            Serial Number:
                1d:93:13:0e:54:07:95:1d:8c:57:4f:12:14:b9:5e:5f:15:c3:a9:d4
            Signature Algorithm: sha256WithRSAEncryption
            Issuer: CN = Azure IoT Hub CA Cert Test Only
            Validity
                Not Before: Jun 20 22:52:23 2022 GMT
                Not After : Jul 20 22:52:23 2022 GMT
            Subject: CN = Azure IoT Hub CA Cert Test Only
            Subject Public Key Info:
                Public Key Algorithm: rsaEncryption
                    RSA Public-Key: (4096 bit)
    ```

### Create the intermediate CA certificate

Run the following commands to create the intermediate CA private key and the intermediate CA certificate. You'll use this certificate and key to sign your device certificate(s).

1. Create the intermediate CA private key:

    ```bash
    openssl genrsa -aes256 -passout pass:1234 -out ./private/azure-iot-test-only.intermediate.key.pem 4096
    ```

1. Create the intermediate CA certificate signing request (CSR):

    # [Windows](#tab/windows)

    ```bash
    openssl req -new -sha256 -passin pass:1234 -config ./openssl_device_intermediate_ca.cnf -subj '//CN=Azure IoT Hub Intermediate Cert Test Only' -key ./private/azure-iot-test-only.intermediate.key.pem -out ./csr/azure-iot-test-only.intermediate.csr.pem
    ```

    > [!IMPORTANT]
    > The extra forward slash given for the subject name (`//CN=Azure IoT Hub Intermediate Cert Test Only`) is only required to escape the string with Git on Windows platforms.

    # [Linux](#tab/linux)

    ```bash
    openssl req -new -sha256 -passin pass:1234 -config ./openssl_device_intermediate_ca.cnf -subj '/CN=Azure IoT Hub Intermediate Cert Test Only' -key ./private/azure-iot-test-only.intermediate.key.pem -out ./csr/azure-iot-test-only.intermediate.csr.pem
    ```

    ---

1. Sign the intermediate certificate with the root CA certificate

    ```bash
    openssl ca -batch -config ./openssl_root_ca.cnf -passin pass:1234 -extensions v3_intermediate_ca -days 30 -notext -md sha256 -in ./csr/azure-iot-test-only.intermediate.csr.pem -out ./certs/azure-iot-test-only.intermediate.cert.pem
    ```

1. Examine the intermediate CA certificate:

    ```bash
    openssl x509 -noout -text -in ./certs/azure-iot-test-only.intermediate.cert.pem
    ```

    Observe that the **Issuer** is the root CA, and the **Subject** is the intermediate CA.

    ```output
    Certificate:
        Data:
            Version: 3 (0x2)
            Serial Number:
                d9:55:87:57:41:c8:4c:47:6c:ee:ba:83:5d:ae:db:39
            Signature Algorithm: sha256WithRSAEncryption
            Issuer: CN = Azure IoT Hub CA Cert Test Only
            Validity
                Not Before: Jun 20 22:54:01 2022 GMT
                Not After : Jul 20 22:54:01 2022 GMT
            Subject: CN = Azure IoT Hub Intermediate Cert Test Only
            Subject Public Key Info:
                Public Key Algorithm: rsaEncryption
                    RSA Public-Key: (4096 bit)
     ```

### Create the device certificates

In this section, you create two device certificates and their full chain certificates. The full chain certificate contains the device certificate, the intermediate CA certificate, and the root CA certificate. The device must present its full chain certificate when it registers with DPS.

1. Create the first device private key.

    ```bash
    openssl genrsa -out ./private/device-01.key.pem 4096
    ```

1. Create the device certificate CSR.

    The subject common name (CN) of the device certificate must be set to the [registration ID](./concepts-service.md#registration-id) that your device will use to register with DPS. The registration ID is a case-insensitive string of alphanumeric characters plus the special characters: `'-'`, `'.'`, `'_'`, `':'`. The last character must be alphanumeric or dash (`'-'`). The common name must adhere to this format. DPS supports registration IDs up to 128 characters long; however, the maximum length of the subject common name in an X.509 certificate is 64 characters. The registration ID, therefore, is limited to 64 characters when using X.509 certificates. For group enrollments, the registration ID is also used as the device ID in IoT Hub.

    The subject common name is set using the `-subj` parameter. In the following command, the common name is set to **device-01**.

    # [Windows](#tab/windows)

    ```bash
    openssl req -config ./openssl_device_intermediate_ca.cnf -key ./private/device-01.key.pem -subj '//CN=device-01' -new -sha256 -out ./csr/device-01.csr.pem
    ```

    > [!IMPORTANT]
    > The extra forward slash given for the subject name (`//CN=device-01`) is only required to escape the string with Git on Windows platforms.

    # [Linux](#tab/linux)

    ```bash
    openssl req -config ./openssl_device_intermediate_ca.cnf -key ./private/device-01.key.pem -subj '/CN=device-01' -new -sha256 -out ./csr/device-01.csr.pem
    ```

    ---

1. Sign the device certificate.

    ```bash
    openssl ca -batch -config ./openssl_device_intermediate_ca.cnf -passin pass:1234 -extensions usr_cert -days 30 -notext -md sha256 -in ./csr/device-01.csr.pem -out ./certs/device-01.cert.pem
    ```

1. Examine the device certificate:

    ```bash
    openssl x509 -noout -text -in ./certs/device-01.cert.pem
    ```

    Observe that the **Issuer** is the intermediate CA, and the **Subject** is the device registration ID, `device-01`.

    ```output
    Certificate:
        Data:
            Version: 3 (0x2)
            Serial Number:
                d9:55:87:57:41:c8:4c:47:6c:ee:ba:83:5d:ae:db:3a
            Signature Algorithm: sha256WithRSAEncryption
            Issuer: CN = Azure IoT Hub Intermediate Cert Test Only
            Validity
                Not Before: Jun 20 22:55:39 2022 GMT
                Not After : Jul 20 22:55:39 2022 GMT
            Subject: CN = device-01
            Subject Public Key Info:
                Public Key Algorithm: rsaEncryption
                    RSA Public-Key: (4096 bit)
     ```

1. The device must present the full certificate chain when it authenticates with DPS. Use the following command to create the certificate chain:

    ```bash
    cat ./certs/device-01.cert.pem ./certs/azure-iot-test-only.intermediate.cert.pem ./certs/azure-iot-test-only.root.ca.cert.pem > ./certs/device-01-full-chain.cert.pem
    ```  

1. Open the certificate chain file, *./certs/device-01-full-chain.cert.pem*, in a text editor to examine it. The certificate chain text contains the full chain of all three certificates. You'll use this certificate chain later in this tutorial to provision `device-01`.

    The full chain text has the following format:

    ```output
    -----BEGIN CERTIFICATE-----
        <Text for the device certificate includes public key>
    -----END CERTIFICATE-----
    -----BEGIN CERTIFICATE-----
        <Text for the intermediate certificate includes public key>
    -----END CERTIFICATE-----
    -----BEGIN CERTIFICATE-----
        <Text for the root certificate includes public key>
    -----END CERTIFICATE-----
    ```

1. To create the private key, X.509 certificate, and full chain certificate for the second device, copy and paste this script into your Git Bash command prompt. To create certificates for more devices, you can modify the `registration_id` variable declared at the beginning of the script.

    # [Windows](#tab/windows)

    ```bash
    registration_id=device-02
    echo $registration_id
    openssl genrsa -out ./private/${registration_id}.key.pem 4096
    openssl req -config ./openssl_device_intermediate_ca.cnf -key ./private/${registration_id}.key.pem -subj "//CN=$registration_id" -new -sha256 -out ./csr/${registration_id}.csr.pem
    openssl ca -batch -config ./openssl_device_intermediate_ca.cnf -passin pass:1234 -extensions usr_cert -days 30 -notext -md sha256 -in ./csr/${registration_id}.csr.pem -out ./certs/${registration_id}.cert.pem
    cat ./certs/${registration_id}.cert.pem ./certs/azure-iot-test-only.intermediate.cert.pem ./certs/azure-iot-test-only.root.ca.cert.pem > ./certs/${registration_id}-full-chain.cert.pem
    ```

    # [Linux](#tab/linux)

    ```bash
    registration_id=device-02
    echo $registration_id
    openssl genrsa -out ./private/${registration_id}.key.pem 4096
    openssl req -config ./openssl_device_intermediate_ca.cnf -key ./private/${registration_id}.key.pem -subj "/CN=$registration_id" -new -sha256 -out ./csr/${registration_id}.csr.pem
    openssl ca -batch -config ./openssl_device_intermediate_ca.cnf -passin pass:1234 -extensions usr_cert -days 30 -notext -md sha256 -in ./csr/${registration_id}.csr.pem -out ./certs/${registration_id}.cert.pem
    cat ./certs/${registration_id}.cert.pem ./certs/azure-iot-test-only.intermediate.cert.pem ./certs/azure-iot-test-only.root.ca.cert.pem > ./certs/${registration_id}-full-chain.cert.pem
    ```

    ---

    >[!NOTE]
    > This script uses the registration ID as the base filename for the private key and certificate files. If your registration ID contains characters that aren't valid filename characters, you'll need to modify the script accordingly.

    > [!WARNING]
    > The text for the certificates only contains public key information.
    >
    > However, the device must also have access to the private key for the device certificate. This is necessary because the device must perform verification using that key at runtime when it attempts to provision. The sensitivity of this key is one of the main reasons it is recommended to use hardware-based storage in a real HSM to help secure private keys.

You'll use the following files in the rest of this tutorial:

|   Certificate                 |  File  | Description |
| ---------------------------- | --------- | ---------- |
| root CA certificate.              | *certs/azure-iot-test-only.root.ca.cert.pem* | Will be uploaded to DPS and verified. |
| intermediate CA certificate   | *certs/azure-iot-test-only.intermediate.cert.pem* | Will be used to create an enrollment group in DPS. |
| device-01 private key          | *private/device-01.key.pem* | Used by the device to verify ownership of the device certificate during authentication with DPS. |
| device-01 full chain certificate  | *certs/device-01-full-chain.cert.pem* | Presented by the device to authenticate and register with DPS. |
| device-02 private key          | *private/device-02.key.pem* | Used by the device to verify ownership of the device certificate during authentication with DPS. |
| device-02 full chain certificate  | *certs/device-02-full-chain.cert.pem* | Presented by the device to authenticate and register with DPS. |

## Verify ownership of the root certificate

For DPS to be able to validate the device's certificate chain during authentication, you must upload and verify ownership of the root CA certificate. Because you created the root CA certificate in the last section, you'll auto-verify that it's valid when you upload it. Alternatively, you can do manual verification of the certificate if you're using a CA certificate from a 3rd-party. To learn more about verifying CA certificates, see [How to do proof-of-possession for X.509 CA certificates](how-to-verify-certificates.md).

To add the root CA certificate to your DPS instance, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com), select the **All resources** button on the left-hand menu and open your Device Provisioning Service instance.

1. Open **Certificates** from the left-hand menu and then select **+ Add** at the top of the panel to add a new certificate.

1. Enter a friendly display name for your certificate. Browse to the location of the root CA certificate file `certs/azure-iot-test-only.root.ca.cert.pem`. Select **Upload**.

1. Select the box next to **Set certificate status to verified on upload**.

    :::image type="content" source="./media/tutorial-custom-hsm-enrollment-group-x509/add-root-certificate.png" alt-text="Screenshot that shows adding the root C A certificate and the set certificate status to verified on upload box selected.":::

1. Select **Save**.

1. Make sure your certificate is shown in the certificate tab with a status of *Verified*.
  
    :::image type="content" source="./media/tutorial-custom-hsm-enrollment-group-x509/verify-root-certificate.png" alt-text="Screenshot that shows the verified root C A certificate in the list of certificates.":::

## (Optional) Manual verification of root certificate
If you didn't choose to automatically verify the certificate during upload, you manually prove possession:

1. Select the new CA certificate.

1. Select Generate Verification Code in the Certificate Details dialog.

1. Create a certificate that contains the verification code. For example, if you're using the Bash script supplied by Microsoft, run `./certGen.sh create_verification_certificate "<verification code>"` to create a certificate named `verification-code.cert.pem`, replacing `<verification code>` with the previously generated verification code. For more information, you can download the [files](https://github.com/Azure/azure-iot-sdk-c/tree/main/tools/CACertificates) relevant to your system to a working folder and follow the instructions in the [Managing CA certificates readme](https://github.com/Azure/azure-iot-sdk-c/blob/main/tools/CACertificates/CACertificateOverview.md) to perform proof-of-possession on a CA certificate.
 
1. Upload `verification-code.cert.pem` to your provisioning service in the Certificate Details dialog.

1. Select Verify.

## Update the certificate store on Windows-based devices

On non-Windows devices, you can pass the certificate chain from the code as the certificate store.

On Windows-based devices, you must add the signing certificates (root and intermediate) to a Windows [certificate store](/windows/win32/secauthn/certificate-stores). Otherwise, the signing certificates won't be transported to DPS by a secure channel with Transport Layer Security (TLS).

> [!TIP]
> It's also possible to use OpenSSL instead of secure channel (Schannel) with the C SDK. For more information on using OpenSSL, see [Using OpenSSL in the SDK](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/devbox_setup.md#using-openssl-in-the-sdk).

To add the signing certificates to the certificate store in Windows-based devices:

1. In a Git bash prompt, convert your signing certificates to `.pfx` as follows.

    Root CA certificate:

    ```bash
    openssl pkcs12 -inkey ./private/azure-iot-test-only.root.ca.key.pem -in ./certs/azure-iot-test-only.root.ca.cert.pem -export -passin pass:1234 -passout pass:1234 -out ./certs/root.pfx
    ```

    Intermediate CA certificate:

    ```bash
    openssl pkcs12 -inkey ./private/azure-iot-test-only.intermediate.key.pem -in ./certs/azure-iot-test-only.intermediate.cert.pem -export -passin pass:1234 -passout pass:1234 -out ./certs/intermediate.pfx
    ```

2. Right-click the Windows **Start** button. Then select **Run**. Enter *certmgr.msc* and select **Ok** to start certificate manager MMC snap-in.

3. In certificate manager, under **Certificates - Current User**, select **Trusted Root Certification Authorities**. Then on the menu, select **Action** > **All Tasks** > **Import** to import `root.pfx`.

    * Make sure to search by **Personal information Exchange (.pfx)**
    * Use `1234` as the password.
    * Place the certificate in the **Trusted Root Certification Authorities** certificate store.

4. In certificate manager, under **Certificates - Current User**, select **Intermediate Certification Authorities**. Then on the menu, select **Action** > **All Tasks** > **Import** to import `intermediate.pfx`.

    * Make sure to search by **Personal information Exchange (.pfx)**
    * Use `1234` as the password.
    * Place the certificate in the **Intermediate Certification Authorities** certificate store.

Your signing certificates are now trusted on the Windows-based device and the full chain can be transported to DPS.

## Create an enrollment group

<!-- INCLUDE -->
[!INCLUDE [iot-dps-enrollment-group-x509.md](../../includes/iot-dps-enrollment-group-x509.md)]

## Prepare and run the device provisioning code

In this section, you update the sample code with your Device Provisioning Service instance information. If a device is authenticated, it will be assigned to an IoT hub linked to the Device Provisioning Service instance configured in this section.

::: zone pivot="programming-language-ansi-c"

In this section, you'll use your Git Bash prompt and the Visual Studio IDE.

### Configure the provisioning device code

In this section, you update the sample code with your Device Provisioning Service instance information.

1. In the Azure portal, select the **Overview** tab for your Device Provisioning Service instance and note the **ID Scope** value.

    :::image type="content" source="./media/tutorial-custom-hsm-enrollment-group-x509/copy-id-scope.png" alt-text="Screenshot that shows the ID scope on the DPS overview pane.":::

2. Launch Visual Studio and open the new solution file that was created in the `cmake` directory you created in the root of the azure-iot-sdk-c git repository. The solution file is named `azure_iot_sdks.sln`.

3. In Solution Explorer for Visual Studio, navigate to **Provision_Samples > prov_dev_client_sample > Source Files** and open *prov_dev_client_sample.c*.

4. Find the `id_scope` constant, and replace the value with your **ID Scope** value that you copied earlier. For example:

    ```c
    static const char* id_scope = "0ne00000A0A";
    ```

5. Find the definition for the `main()` function in the same file. Make sure the `hsm_type` variable is set to `SECURE_DEVICE_TYPE_X509` and that all other `hsm_type` lines are commented out. For example:

    ```c
    SECURE_DEVICE_TYPE hsm_type;
    //hsm_type = SECURE_DEVICE_TYPE_TPM;
    hsm_type = SECURE_DEVICE_TYPE_X509;
    //hsm_type = SECURE_DEVICE_TYPE_SYMMETRIC_KEY;
    ```

6. Save your changes.

7. Right-click the **prov\_dev\_client\_sample** project and select **Set as Startup Project**.

### Configure the custom HSM stub code

The specifics of interacting with actual secure hardware-based storage vary depending on the device hardware. The certificate chains used by the simulated devices in this tutorial will be hardcoded in the custom HSM stub code. In a real-world scenario, the certificate chain would be stored in the actual HSM hardware to provide better security for sensitive information. Methods similar to the stub methods used in this sample would then be implemented to read the secrets from that hardware-based storage.

While HSM hardware isn't required, it's recommended to protect sensitive information like the certificate's private key. If an actual HSM was being called by the sample, the private key wouldn't be present in the source code. Having the key in the source code exposes the key to anyone that can view the code. This is only done in this tutorial to assist with learning.

To update the custom HSM stub code to simulate the identity of the device with ID `device-01`:

1. In Solution Explorer for Visual Studio, navigate to **Provision_Samples > custom_hsm_example > Source Files** and open *custom_hsm_example.c*.

2. Update the string value of the `COMMON_NAME` string constant using the common name you used when generating the device certificate.

    ```c
    static const char* const COMMON_NAME = "device-01";
    ```

3. Update the string value of the `CERTIFICATE` constant string using the certificate chain you saved in *./certs/device-01-full-chain.cert.pem* after generating your certificates.

    The syntax of certificate text must follow the pattern below with no extra spaces or parsing done by Visual Studio.

    ```c
    // <Device/leaf cert>
    // <intermediates>
    // <root>
    static const char* const CERTIFICATE = "-----BEGIN CERTIFICATE-----\n"
    "MIIFOjCCAyKgAwIBAgIJAPzMa6s7mj7+MA0GCSqGSIb3DQEBCwUAMCoxKDAmBgNV\n"
        ...
    "MDMwWhcNMjAxMTIyMjEzMDMwWjAqMSgwJgYDVQQDDB9BenVyZSBJb1QgSHViIENB\n"
    "-----END CERTIFICATE-----\n"
    "-----BEGIN CERTIFICATE-----\n"
    "MIIFPDCCAySgAwIBAgIBATANBgkqhkiG9w0BAQsFADAqMSgwJgYDVQQDDB9BenVy\n"
        ...
    "MTEyMjIxMzAzM1owNDEyMDAGA1UEAwwpQXp1cmUgSW9UIEh1YiBJbnRlcm1lZGlh\n"
    "-----END CERTIFICATE-----\n"
    "-----BEGIN CERTIFICATE-----\n"
    "MIIFOjCCAyKgAwIBAgIJAPzMa6s7mj7+MA0GCSqGSIb3DQEBCwUAMCoxKDAmBgNV\n"
        ...
    "MDMwWhcNMjAxMTIyMjEzMDMwWjAqMSgwJgYDVQQDDB9BenVyZSBJb1QgSHViIENB\n"
    "-----END CERTIFICATE-----";        
    ```

    Updating this string value manually can be prone to error. To generate the proper syntax, you can copy and paste the following command into your **Git Bash prompt**, and press **ENTER**. This command generates the syntax for the `CERTIFICATE` string constant value and writes it to the output.

    ```Bash
    sed -e 's/^/"/;$ !s/$/""\\n"/;$ s/$/"/' ./certs/device-01-full-chain.cert.pem
    ```

    Copy and paste the output certificate text for the constant value.

4. Update the string value of the `PRIVATE_KEY` constant with the private key for your device certificate.

    The syntax of the private key text must follow the pattern below with no extra spaces or parsing done by Visual Studio.

    ```c
    static const char* const PRIVATE_KEY = "-----BEGIN RSA PRIVATE KEY-----\n"
    "MIIJJwIBAAKCAgEAtjvKQjIhp0EE1PoADL1rfF/W6v4vlAzOSifKSQsaPeebqg8U\n"
        ...
    "X7fi9OZ26QpnkS5QjjPTYI/wwn0J9YAwNfKSlNeXTJDfJ+KpjXBcvaLxeBQbQhij\n"
    "-----END RSA PRIVATE KEY-----";
    ```

    Updating this string value manually can be prone to error. To generate the proper syntax, you can copy and paste the following command into your **Git Bash prompt**, and press **ENTER**. This command generates the syntax for the `PRIVATE_KEY` string constant value and writes it to the output.

    ```Bash
    sed -e 's/^/"/;$ !s/$/""\\n"/;$ s/$/"/' ./private/device-01.key.pem
    ```

    Copy and paste the output private key text for the constant value.

5. Save your changes.

6. Right-click the **custom_hsm_example** project and select **Build**.

    > [!IMPORTANT]
    > You must build the **custom_hsm_example** project before you build the rest of the solution in the next section.

### Run the sample

1. On the Visual Studio menu, select **Debug** > **Start without debugging** to run the solution. When prompted to rebuild the project, select **Yes** to rebuild the project before running.

    The following output is an example of simulated device `device-01` successfully booting up and connecting to the provisioning service. The device was assigned to an IoT hub and registered:

    ```output
    Provisioning API Version: 1.8.0

    Registering Device

    Provisioning Status: PROV_DEVICE_REG_STATUS_CONNECTED
    Provisioning Status: PROV_DEVICE_REG_STATUS_ASSIGNING

    Registration Information received from service: contoso-hub-2.azure-devices.net, deviceId: device-01
    Press enter key to exit:
    ```

1. Repeat the steps in [Configure the custom HSM stub code](#configure-the-custom-hsm-stub-code) for your second device (`device-02`) and run the sample again. Use the following values for that device:

    |   Description                 |  Value  |
    | :---------------------------- | :--------- |
    | Common name                | `"device-02"` |
    | Full certificate chain        | Generate the text using *./certs/device-02-full-chain.cert.pem* |
    | Private key                   | Generate the text using  *./private/device-02.key.pem* |

    The following output is an example of simulated device `device-02` successfully booting up, and connecting to the provisioning service. The device was assigned to an IoT hub and registered:

    ```output
    Provisioning API Version: 1.8.0

    Registering Device

    Provisioning Status: PROV_DEVICE_REG_STATUS_CONNECTED
    Provisioning Status: PROV_DEVICE_REG_STATUS_ASSIGNING

    Registration Information received from service: contoso-hub-2.azure-devices.net, deviceId: device-02
    Press enter key to exit:
    ```

::: zone-end

::: zone pivot="programming-language-csharp"

The C# sample code is set up to use X.509 certificates that are stored in a password-protected PKCS#12 formatted file (.pfx). The full chain certificates you created previously are in the PEM format. To convert the full chain certificates to PKCS#12 format, enter the following commands in your Git Bash prompt from the directory where you previously ran the OpenSSL commands.

* device-01

    ```bash
    openssl pkcs12 -inkey ./private/device-01.key.pem -in ./certs/device-01-full-chain.cert.pem -export -passin pass:1234 -passout pass:1234 -out ./certs/device-01-full-chain.cert.pfx
    ```

* device-02

    ```bash
    openssl pkcs12 -inkey ./private/device-02.key.pem -in ./certs/device-02-full-chain.cert.pem -export -passin pass:1234 -passout pass:1234 -out ./certs/device-02-full-chain.cert.pfx
    ```

In the rest of this section, you'll use your Windows command prompt.

1. In the Azure portal, select the **Overview** tab for your Device Provisioning Service.

2. Copy the **ID Scope** value.

    :::image type="content" source="./media/quick-create-simulated-device-x509/copy-id-scope.png" alt-text="Screenshot of the ID scope on Azure portal.":::

3. In your Windows command prompt, change to the X509Sample directory. This directory is located in the *.\azure-iot-sdk-csharp\provisioning\device\samples\Getting Started\X509Sample* directory off the directory where you cloned the samples on your computer.

4. Enter the following command to build and run the X.509 device provisioning sample (replace `<id-scope>` with the ID Scope that you copied in step 2. Replace `<your-certificate-folder>` with the path to the folder where you ran your OpenSSL commands.

    ```cmd
    dotnet run -- -s <id-scope> -c <your-certificate-folder>\certs\device-01-full-chain.cert.pfx -p 1234
    ```

   The device connects to DPS and is assigned to an IoT hub. Then, the device sends a telemetry message to the IoT hub. You should see output similar to the following:

    ```output
    Loading the certificate...
    Found certificate: 3E5AA3C234B2032251F0135E810D75D38D2AA477 CN=Azure IoT Hub CA Cert Test Only; PrivateKey: False
    Found certificate: 81FE182C08D18941CDEEB33F53F8553BA2081E60 CN=Azure IoT Hub Intermediate Cert Test Only; PrivateKey: False
    Found certificate: 5BA1DB226D50EBB7A6A6071CED4143892855AE43 CN=device-01; PrivateKey: True
    Using certificate 5BA1DB226D50EBB7A6A6071CED4143892855AE43 CN=device-01
    Initializing the device provisioning client...
    Initialized for registration Id device-01.
    Registering with the device provisioning service...
    Registration status: Assigned.
    Device device-01 registered to contoso-hub-2.azure-devices.net.
    Creating X509 authentication for IoT Hub...
    Testing the provisioned device with IoT Hub...
    Sending a telemetry message...
    Finished.
    ```

   >[!NOTE]
   > If you don't specify certificate and password on the command line, the certificate file will default to *./certificate.pfx* and you'll be prompted for your password.
   >
   > Additional parameters can be passed to change the TransportType (-t) and the GlobalDeviceEndpoint (-g). For a full list of parameters type `dotnet run -- --help`.

5. To register your second device, rerun the sample using its full chain certificate.

    ```cmd
    dotnet run -- -s <id-scope> -c <your-certificate-folder>\certs\device-02-full-chain.cert.pfx -p 1234
    ```

::: zone-end

::: zone pivot="programming-language-nodejs"

In the following steps, use your Windows command prompt.

1. In the Azure portal, select the **Overview** tab for your Device Provisioning Service.

1. Copy the **ID Scope** value.

    :::image type="content" source="./media/tutorial-custom-hsm-enrollment-group-x509/copy-id-scope.png" alt-text="Screenshot of the ID scope in the Azure portal.":::

1. In your Windows command prompt, go to the sample directory, and install the packages needed by the sample. The path shown is relative to the location where you cloned the SDK.

    ```cmd
    cd .\azure-iot-sdk-node\provisioning\device\samples
    npm install
    ```

1. In the *provisioning\device\samples* folder, open *register_x509.js* and review the code.

    The sample defaults to MQTT as the transport protocol. If you want to use a different protocol, comment out the following line and uncomment the line for the appropriate protocol.

    ```javascript
    var ProvisioningTransport = require('azure-iot-provisioning-device-mqtt').Mqtt;
    ```

    The sample uses five environment variables to authenticate and provision an IoT device using DPS. These environment variables are:

    | Variable name              | Description                                     |
    | :------------------------- | :---------------------------------------------- |
    | `PROVISIONING_HOST`        |  The endpoint to use for connecting to your DPS instance. For this tutorial, use the global endpoint, `global.azure-devices-provisioning.net`. |
    | `PROVISIONING_IDSCOPE`     |  The ID Scope for your DPS instance. |
    | `PROVISIONING_REGISTRATION_ID` |  The registration ID for your device. It must match the subject common name in the device certificate. |
    | `CERTIFICATE_FILE`           |  The path to your device full chain certificate file. |
    | `KEY_FILE`            |  The path to your device certificate private key file. |

    The `ProvisioningDeviceClient.register()` method attempts to register your device.

1. Add environment variables for the global device endpoint and ID scope. Replace `<id-scope>` with the value you copied in step 2.

    ```cmd
    set PROVISIONING_HOST=global.azure-devices-provisioning.net
    set PROVISIONING_IDSCOPE=<id-scope>
    ```

1. Set the environment variable for the device registration ID. The registration ID for the IoT device must match subject common name on its device certificate. For this tutorial, *device-01* is both the subject name and the registration ID for the device.

    ```cmd
    set PROVISIONING_REGISTRATION_ID=device-01
    ```

1. Set the environment variables for the device full chain certificate and device private key files you generated previously. Replace `<your-certificate-folder>` with the path to the folder where you ran your OpenSSL commands.

    ```cmd
    set CERTIFICATE_FILE=<your-certificate-folder>\certs\device-01-full-chain.cert.pem
    set KEY_FILE=<your-certificate-folder>\private\device-01.key.pem
    ```

1. Run the sample and verify that the device was provisioned successfully.

    ```cmd
    node register_x509.js
    ```

    You should see output similar to the following:

    ```output
    registration succeeded
    assigned hub=contoso-hub-2.azure-devices.net
    deviceId=device-01
    Client connected
    send status: MessageEnqueued
    ```

1. Update the environment variables for your second device (`device-02`) according to the table below and run the sample again.

    |   Environment Variable        |  Value  |
    | :---------------------------- | :--------- |
    | PROVISIONING_REGISTRATION_ID  | `device-02` |
    | CERTIFICATE_FILE              | *\<your-certificate-folder\>\certs\device-02-full-chain.cert.pem* |
    | KEY_FILE                      | *\<your-certificate-folder\>\private\device-02.key.pem* |

::: zone-end

::: zone pivot="programming-language-python"

In the following steps, use your Windows command prompt.

1. In the Azure portal, select the **Overview** tab for your Device Provisioning Service.

1. Copy the **ID Scope**.

    :::image type="content" source="./media/tutorial-custom-hsm-enrollment-group-x509/copy-id-scope.png" alt-text="Screenshot of the ID scope in the Azure portal.":::

1. In your Windows command prompt, go to the directory of the [provision_x509.py](https://github.com/Azure/azure-iot-sdk-python/blob/main/samples/async-hub-scenarios/provision_x509.py) sample. The path shown is relative to the location where you cloned the SDK.

    ```cmd
    cd .\azure-iot-sdk-python\samples\async-hub-scenarios
    ```

    This sample uses six environment variables to authenticate and provision an IoT device using DPS. These environment variables are:

    | Variable name              | Description                                     |
    | :------------------------- | :---------------------------------------------- |
    | `PROVISIONING_HOST`        |  The endpoint to use for connecting to your DPS instance. For this tutorial, use the global endpoint, `global.azure-devices-provisioning.net`. |
    | `PROVISIONING_IDSCOPE`     |  The ID Scope for your DPS instance. |
    | `DPS_X509_REGISTRATION_ID` |  The registration ID for your device. It must match the subject common name in the device certificate. |
    | `X509_CERT_FILE`           |  The path to your device full chain certificate file. |
    | `X509_KEY_FILE`            |  The path to your device certificate private key file. |
    | `PASS_PHRASE`              |  The pass phrase used to encrypt the private key file (if used). Not needed for this tutorial. |

1. Add the environment variables for the global device endpoint and ID Scope. You copied the ID scope for your instance in step 2.

    ```cmd
    set PROVISIONING_HOST=global.azure-devices-provisioning.net
    set PROVISIONING_IDSCOPE=<ID scope for your DPS resource>
    ```

1. Set the environment variable for the device registration ID. The registration ID for the IoT device must match subject common name on its device certificate. For this tutorial, *device-01* is both the subject name and the registration ID for the device.

    ```cmd
    set DPS_X509_REGISTRATION_ID=device-01
    ```

1. Set the environment variables for the device full chain certificate and device private key files you generated previously. Replace `<your-certificate-folder>` with the path to the folder where you ran your OpenSSL commands.

    ```cmd
    set X509_CERT_FILE=<your-certificate-folder>\certs\device-01-full-chain.cert.pem
    set X509_KEY_FILE=<your-certificate-folder>\private\device-01.key.pem
    ```

1. Review the code for [provision_x509.py](https://github.com/Azure/azure-iot-sdk-python/blob/main/samples/async-hub-scenarios/provision_x509.py). If you're not using **Python version 3.7** or later, make the [code change mentioned here](https://github.com/Azure/azure-iot-sdk-python/tree/main/samples/async-hub-scenarios#advanced-iot-hub-scenario-samples-for-the-azure-iot-hub-device-sdk) to replace `asyncio.run(main())`.

1. Run the sample. The sample connects to DPS, which will provision the device to an IoT hub. After the device is provisioned, the sample sends some test messages to the IoT hub.

    ```cmd
    python provision_x509.py
    ```

    You should see output similar to the following:

    ```output
    The complete registration result is
    device-01
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

1. Update the environment variables for your second device (`device-02`) according to the table below and run the sample again.

    |   Environment Variable        |  Value  |
    | :---------------------------- | :--------- |
    | DPS_X509_REGISTRATION_ID      | `device-02` |
    | X509_CERT_FILE                | *\<your-certificate-folder\>\certs\device-02-full-chain.cert.pem* |
    | X509_KEY_FILE                 | *\<your-certificate-folder\>\private\device-02.key.pem* |

::: zone-end

::: zone pivot="programming-language-java"

In the following steps, you'll use both your Windows command prompt and your Git Bash prompt.

1. In the Azure portal, select the **Overview** tab for your Device Provisioning Service.

1. Copy the **ID Scope**.

    :::image type="content" source="./media/tutorial-custom-hsm-enrollment-group-x509/copy-id-scope.png" alt-text="Screenshot of the ID scope in the Azure portal.":::

1. In your Windows command prompt, navigate to the sample project folder. The path shown is relative to the location where you cloned the SDK

    ```cmd
    cd .\azure-iot-sdk-java\provisioning\provisioning-samples\provisioning-X509-sample
    ```

1. Enter the provisioning service and X.509 identity information in the sample code. This is used during provisioning, for attestation of the simulated device, prior to device registration.

    1. Open the file `.\src\main\java\samples\com/microsoft\azure\sdk\iot\ProvisioningX509Sample.java` in your favorite editor.

    1. Update the following values. For `idScope`, use the **ID Scope** that you copied previously. For global endpoint, use the  **Global device endpoint**. This endpoint is the same for every DPS instance, `global.azure-devices-provisioning.net`.

        ```java
        private static final String idScope = "[Your ID scope here]";
        private static final String globalEndpoint = "[Your Provisioning Service Global Endpoint here]";
        ```

    1. The sample defaults to using HTTPS as the transport protocol. If you want to change the protocol, comment out the following line, and uncomment the line for the protocol you want to use.

        ```java
        private static final ProvisioningDeviceClientTransportProtocol PROVISIONING_DEVICE_CLIENT_TRANSPORT_PROTOCOL = ProvisioningDeviceClientTransportProtocol.HTTPS;
        ```

    1. Update the value of the `leafPublicPem` constant string with the value of your device certificate, *device-01.cert.pem*.

        The syntax of certificate text must follow the pattern below with no extra spaces or characters.

        ```java
        private static final String leafPublicPem = "-----BEGIN CERTIFICATE-----\n"
        "MIIFOjCCAyKgAwIBAgIJAPzMa6s7mj7+MA0GCSqGSIb3DQEBCwUAMCoxKDAmBgNV\n"
            ...
        "MDMwWhcNMjAxMTIyMjEzMDMwWjAqMSgwJgYDVQQDDB9BenVyZSBJb1QgSHViIENB\n"
        "-----END CERTIFICATE-----";        
        ```

        Updating this string value manually can be prone to error. To generate the proper syntax, you can copy and paste the following command into your **Git Bash prompt**, and press **ENTER**. This command  will generate the syntax for the `leafPublicPem` string constant value and write it to the output.

        ```Bash
        sed 's/^/"/;$ !s/$/\\n" +/;$ s/$/"/' ./certs/device-01.cert.pem
        ```

        Copy and paste the output certificate text for the constant value.

    1. Update the string value of the `leafPrivateKey` constant with the unencrypted private key for your device certificate, *unencrypted-device-key.pem*.

        The syntax of the private key text must follow the pattern below with no extra spaces or characters.

        ```java
        private static final String leafPrivateKey = "-----BEGIN PRIVATE KEY-----\n" +
        "MIIJJwIBAAKCAgEAtjvKQjIhp0EE1PoADL1rfF/W6v4vlAzOSifKSQsaPeebqg8U\n" +
            ...
        "X7fi9OZ26QpnkS5QjjPTYI/wwn0J9YAwNfKSlNeXTJDfJ+KpjXBcvaLxeBQbQhij\n" +
        "-----END PRIVATE KEY-----";
        ```

        To generate the proper syntax, you can copy and paste the following command into your **Git Bash prompt**, and press **ENTER**. This command will generate the syntax for the `leafPrivateKey` string constant value and write it to the output.

        ```Bash
        sed 's/^/"/;$ !s/$/\\n" +/;$ s/$/"/' ./private/device-01.key.pem
        ```

        Copy and paste the output private key text for the constant value.

    1. Add a `rootPublicPem` constant string with the value of your root CA certificate, *azure-iot-test-only.root.ca.cert.pem*. You can add it just after the `leafPrivateKey` constant.

        The syntax of certificate text must follow the pattern below with no extra spaces or characters.

        ```java
        private static final String rootPublicPem = "-----BEGIN CERTIFICATE-----\n"
        "MIIFOjCCAyKgAwIBAgIJAPzMa6s7mj7+MA0GCSqGSIb3DQEBCwUAMCoxKDAmBgNV\n"
            ...
        "MDMwWhcNMjAxMTIyMjEzMDMwWjAqMSgwJgYDVQQDDB9BenVyZSBJb1QgSHViIENB\n"
        "-----END CERTIFICATE-----";        
        ```

        To generate the proper syntax, you can copy and paste the following command into your **Git Bash prompt**, and press **ENTER**. This command  will generate the syntax for the `rootPublicPem` string constant value and write it to the output.

        ```Bash
        sed 's/^/"/;$ !s/$/\\n" +/;$ s/$/"/' ./certs/azure-iot-test-only.root.ca.cert.pem
        ```

        Copy and paste the output certificate text for the constant value.

    1. Add an `intermediatePublicPem` constant string with the value of your intermediate CA certificate, *azure-iot-test-only.intermediate.cert.pem*. You can add it just after the previous constant.

        The syntax of certificate text must follow the pattern below with no extra spaces or characters.

        ```java
        private static final String intermediatePublicPem = "-----BEGIN CERTIFICATE-----\n"
        "MIIFOjCCAyKgAwIBAgIJAPzMa6s7mj7+MA0GCSqGSIb3DQEBCwUAMCoxKDAmBgNV\n"
            ...
        "MDMwWhcNMjAxMTIyMjEzMDMwWjAqMSgwJgYDVQQDDB9BenVyZSBJb1QgSHViIENB\n"
        "-----END CERTIFICATE-----";        
        ```

        To generate the proper syntax, you can copy and paste the following command into your **Git Bash prompt**, and press **ENTER**. This command  will generate the syntax for the `intermediatePublicPem` string constant value and write it to the output.

        ```Bash
        sed 's/^/"/;$ !s/$/\\n" +/;$ s/$/"/' ./certs/azure-iot-test-only.intermediate.cert.pem
        ```

        Copy and paste the output certificate text for the constant value.

    1. Find the following lines in the `main` method.

        ```java
        // For group enrollment uncomment this line
        //signerCertificatePemList.add("<Your Signer/intermediate Certificate Here>");
        ```

        Add these two lines directly beneath them to add your intermediate and root CA certificates to the signing chain. Your signing chain should include the whole certificate chain up to and including a certificate that you've verified with DPS.

        ```java
        signerCertificatePemList.add(intermediatePublicPem);
        signerCertificatePemList.add(rootPublicPem);
        ```

        > [!NOTE]
        > The order that the signing certificates are added is important. The sample will fail if it's changed.

    1. Save your changes.

1. Build the sample, and then go to the `target` folder.

    ```cmd
    mvn clean install
    cd target
    ```

1. The build outputs .jar file in the `target` folder with the following file format: `provisioning-x509-sample-{version}-with-deps.jar`; for example: `provisioning-x509-sample-1.8.1-with-deps.jar`. Execute the .jar file. You may need to replace the version in the command below.

    ```cmd
    java -jar ./provisioning-x509-sample-1.8.1-with-deps.jar
    ```

    The sample will connect to DPS, which will provision the device to an IoT hub. After the device is provisioned, the sample will send some test messages to the IoT hub.

    ```output
    Starting...
    Beginning setup.
    WARNING: sun.reflect.Reflection.getCallerClass is not supported. This will impact performance.
    2022-10-21 10:41:20,476 DEBUG (main) [com.microsoft.azure.sdk.iot.provisioning.device.ProvisioningDeviceClient] - Initialized a ProvisioningDeviceClient instance using SDK version 2.0.2
    2022-10-21 10:41:20,479 DEBUG (main) [com.microsoft.azure.sdk.iot.provisioning.device.ProvisioningDeviceClient] - Starting provisioning thread...
    Waiting for Provisioning Service to register
    2022-10-21 10:41:20,482 INFO (global.azure-devices-provisioning.net-4f8279ac-CxnPendingConnectionId-azure-iot-sdk-ProvisioningTask) [com.microsoft.azure.sdk.iot.provisioning.device.internal.task.ProvisioningTask] - Opening the connection to device provisioning service...
    2022-10-21 10:41:20,652 INFO (global.azure-devices-provisioning.net-4f8279ac-Cxn4f8279ac-azure-iot-sdk-ProvisioningTask) [com.microsoft.azure.sdk.iot.provisioning.device.internal.task.ProvisioningTask] - Connection to device provisioning service opened successfully, sending initial device registration message
    2022-10-21 10:41:20,680 INFO (global.azure-devices-provisioning.net-4f8279ac-Cxn4f8279ac-azure-iot-sdk-RegisterTask) [com.microsoft.azure.sdk.iot.provisioning.device.internal.task.RegisterTask] - Authenticating with device provisioning service using x509 certificates
    2022-10-21 10:41:21,603 INFO (global.azure-devices-provisioning.net-4f8279ac-Cxn4f8279ac-azure-iot-sdk-ProvisioningTask) [com.microsoft.azure.sdk.iot.provisioning.device.internal.task.ProvisioningTask] - Waiting for device provisioning service to provision this device...
    2022-10-21 10:41:21,605 INFO (global.azure-devices-provisioning.net-4f8279ac-Cxn4f8279ac-azure-iot-sdk-ProvisioningTask) [com.microsoft.azure.sdk.iot.provisioning.device.internal.task.ProvisioningTask] - Current provisioning status: ASSIGNING
    2022-10-21 10:41:24,868 INFO (global.azure-devices-provisioning.net-4f8279ac-Cxn4f8279ac-azure-iot-sdk-ProvisioningTask) [com.microsoft.azure.sdk.iot.provisioning.device.internal.task.ProvisioningTask] - Device provisioning service assigned the device successfully
    IotHUb Uri : contoso-hub-2.azure-devices.net
    Device ID : device-01
    2022-10-21 10:41:30,514 INFO (main) [com.microsoft.azure.sdk.iot.device.transport.ExponentialBackoffWithJitter] - NOTE: A new instance of ExponentialBackoffWithJitter has been created with the following properties. Retry Count: 2147483647, Min Backoff Interval: 100, Max Backoff Interval: 10000, Max Time Between Retries: 100, Fast Retry Enabled: true
    2022-10-21 10:41:30,526 INFO (main) [com.microsoft.azure.sdk.iot.device.transport.ExponentialBackoffWithJitter] - NOTE: A new instance of ExponentialBackoffWithJitter has been created with the following properties. Retry Count: 2147483647, Min Backoff Interval: 100, Max Backoff Interval: 10000, Max Time Between Retries: 100, Fast Retry Enabled: true
    2022-10-21 10:41:30,533 DEBUG (main) [com.microsoft.azure.sdk.iot.device.DeviceClient] - Initialized a DeviceClient instance using SDK version 2.1.2
    2022-10-21 10:41:30,590 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.mqtt.MqttIotHubConnection] - Opening MQTT connection...
    2022-10-21 10:41:30,625 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.mqtt.Mqtt] - Sending MQTT CONNECT packet...
    2022-10-21 10:41:31,452 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.mqtt.Mqtt] - Sent MQTT CONNECT packet was acknowledged
    2022-10-21 10:41:31,453 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.mqtt.Mqtt] - Sending MQTT SUBSCRIBE packet for topic devices/device-01/messages/devicebound/#
    2022-10-21 10:41:31,523 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.mqtt.Mqtt] - Sent MQTT SUBSCRIBE packet for topic devices/device-01/messages/devicebound/# was acknowledged
    2022-10-21 10:41:31,525 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.mqtt.MqttIotHubConnection] - MQTT connection opened successfully
    2022-10-21 10:41:31,528 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.IotHubTransport] - The connection to the IoT Hub has been established
    2022-10-21 10:41:31,531 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.IotHubTransport] - Updating transport status to new status CONNECTED with reason CONNECTION_OK
    2022-10-21 10:41:31,532 DEBUG (main) [com.microsoft.azure.sdk.iot.device.DeviceIO] - Starting worker threads
    2022-10-21 10:41:31,535 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.IotHubTransport] - Invoking connection status callbacks with new status details
    2022-10-21 10:41:31,536 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.IotHubTransport] - Client connection opened successfully
    2022-10-21 10:41:31,537 INFO (main) [com.microsoft.azure.sdk.iot.device.DeviceClient] - Device client opened successfully
    Sending message from device to IoT Hub...
    2022-10-21 10:41:31,539 DEBUG (main) [com.microsoft.azure.sdk.iot.device.transport.IotHubTransport] - Message was queued to be sent later ( Message details: Correlation Id [0d143280-dbc7-405f-a61e-fcc7a1d80b87] Message Id [4d8d39c8-5a38-4299-8f07-3ae02cdc3218] )
    Press any key to exit...
    2022-10-21 10:41:31,540 DEBUG (contoso-hub-2.azure-devices.net-device-01-d7c67552-Cxn0bd73809-420e-46fe-91ee-942520b775db-azure-iot-sdk-IotHubSendTask) [com.microsoft.azure.sdk.iot.device.transport.IotHubTransport] - Sending message ( Message details: Correlation Id [0d143280-dbc7-405f-a61e-fcc7a1d80b87] Message Id [4d8d39c8-5a38-4299-8f07-3ae02cdc3218] )
    2022-10-21 10:41:31,844 DEBUG (MQTT Call: device-01) [com.microsoft.azure.sdk.iot.device.transport.IotHubTransport] - IotHub message was acknowledged. Checking if there is record of sending this message ( Message details: Correlation Id [0d143280-dbc7-405f-a61e-fcc7a1d80b87] Message Id [4d8d39c8-5a38-4299-8f07-3ae02cdc3218] )
    2022-10-21 10:41:31,846 DEBUG (contoso-hub-2.azure-devices.net-device-01-d7c67552-Cxn0bd73809-420e-46fe-91ee-942520b775db-azure-iot-sdk-IotHubSendTask) [com.microsoft.azure.sdk.iot.device.transport.IotHubTransport] - Invoking the callback function for sent message, IoT Hub responded to message ( Message details: Correlation Id [0d143280-dbc7-405f-a61e-fcc7a1d80b87] Message Id [4d8d39c8-5a38-4299-8f07-3ae02cdc3218] ) with status OK
    Message sent!
    ```

1. Update the constants for your second device (`device-02`) according to the table below, rebuild, and run the sample again.

    |   Constant        |  File to use |
    | :---------------- | :--------- |
    | `leafPublicPem`   | *./certs/device-02.cert.pem* |
    | `leafPrivateKey`  | *./private/device-02.key.pem* |

::: zone-end

## Confirm your device provisioning registration

Examine the registration records of the enrollment group to see the registration details for your devices:

1. In the Azure portal, go to your Device Provisioning Service instance.

1. In the **Settings** menu, select **Manage enrollments**.

1. Select **Enrollment groups**. The X.509 enrollment group entry that you created previously should appear in the list.

1. Select the enrollment entry. Then select **Details** next to the **Registration status** to see the devices that have been registered through the enrollment group. The IoT hub that each of your devices was assigned to, their device IDs, and the dates and times they were registered appear in the list.

    :::image type="content" source="./media/how-to-unprovision-devices/view-registration-records.png" alt-text="Screenshot that shows the registration status details for the enrollment group on Azure portal.":::

1. You can select one of the devices to see further details for that device.

To verify the devices on your IoT hub:

1. In Azure portal, go to the IoT hub that your device was assigned to.

1. In the **Device management** menu, select **Devices**.

1. If your devices were provisioned successfully, their device IDs, *device-01* and *device-02*, should appear in the list, with **Status** set as *enabled*. If you don't see your devices, select **Refresh**.

    :::image type="content" source="./media/tutorial-custom-hsm-enrollment-group-x509/hub-provisioned-custom-hsm-x509-device.png" alt-text="Screenshot that shows the devices are registered with the I o T hub in Azure portal.":::

## Clean up resources

When you're finished testing and exploring this device client sample, use the following steps to delete all resources created by this tutorial.

1. Close the device client sample output window on your machine.

### Delete your enrollment group

1. From the left-hand menu in the Azure portal, select **All resources**.

1. Select your DPS instance.

1. In the **Settings** menu, select **Manage enrollments**.

1. Select the **Enrollment groups** tab.

1. Select the enrollment group you used for this tutorial.

1. On the **Enrollment details** page, select **Details** next to the **Registration status**. Then select the check box next to the **Device Id** column header to select all of the registration records for the enrollment group. Select **Delete** at the top of the page to delete the registration records.

    > [!IMPORTANT]
    > Deleting an enrollment group doesn't delete the registration records associated with it. These orphaned records will count against the [registrations quota](about-iot-dps.md#quotas-and-limits) for the DPS instance. For this reason, it's a best practice to delete all registration records associated with an enrollment group before you delete the enrollment group itself.

1. Go back to the **Manage enrollments** page and make sure the **Enrollment groups** tab is selected.

1. Select the check box next to the group name of the enrollment group you used for this tutorial.

1. At the top of the page, select  **Delete**.

### Delete registered CA certificates from DPS

1. Select **Certificates** from the left-hand menu of your DPS instance. For each certificate you uploaded and verified in this tutorial, select the certificate and select **Delete** and confirm your choice to remove it.

### Delete device registration(s) from IoT Hub

1. From the left-hand menu in the Azure portal, select **All resources**.

2. Select your IoT hub.

3. In the **Explorers** menu, select **IoT devices**.

4. Select the check box next to the device ID of the devices you registered in this tutorial. For example, *device-01* and *device-02*.

5. At the top of the page, select  **Delete**.

## Next steps

In this tutorial, you provisioned multiple X.509 devices to your IoT hub using an enrollment group. Next, learn how to provision IoT devices across multiple hubs.

> [!div class="nextstepaction"]
> [Use custom allocation policies](tutorial-custom-allocation-policies.md)
