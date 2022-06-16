---
title: Tutorial - Provision X.509 devices to Azure IoT Hub using a custom Hardware Security Module (HSM)
description: This tutorial uses enrollment groups. In this tutorial, you learn how to provision X.509 devices using a custom Hardware Security Module (HSM) and the C device SDK for Azure IoT Hub Device Provisioning Service (DPS).
author: kgremban
ms.author: kgremban
ms.date: 05/24/2021
ms.topic: tutorial
ms.service: iot-dps
services: iot-dps 
ms.custom: mvc
#Customer intent: As a new IoT developer, I want provision groups of devices using X.509 certificate chains and the C SDK.
---

# Tutorial: Provision multiple X.509 devices using enrollment groups

In this tutorial, you will learn how to provision groups of IoT devices that use X.509 certificates for authentication. Sample device code from the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c) will be executed on your development machine to simulate provisioning of X.509 devices. On real devices, device code would be deployed and run from the IoT device.

Make sure you've at least completed the steps in [Set up IoT Hub Device Provisioning Service with the Azure portal](quick-setup-auto-provision.md) before continuing with this tutorial. Also, if you're unfamiliar with the process of autoprovisioning, review the [provisioning](about-iot-dps.md#provisioning-process) overview. 

The Azure IoT Device Provisioning Service supports two types of enrollments for provisioning devices:

* [Enrollment groups](concepts-service.md#enrollment-group): Used to enroll multiple related devices.
* [Individual Enrollments](concepts-service.md#individual-enrollment): Used to enroll a single device.

This tutorial is similar to the previous tutorials demonstrating how to use enrollment groups to provision sets of devices. However, X.509 certificates will be used in this tutorial instead of symmetric keys. Review the previous tutorials in this section for a simple approach using [symmetric keys](./concepts-symmetric-key-attestation.md).

This tutorial will demonstrate the [custom HSM sample](https://github.com/Azure/azure-iot-sdk-c/tree/master/provisioning_client/samples/custom_hsm_example) that provides a stub implementation for interfacing with hardware-based secure storage. A [Hardware Security Module (HSM)](./concepts-service.md#hardware-security-module) is used for secure, hardware-based storage of device secrets. An HSM can be used with symmetric key, X.509 certificate, or TPM attestation to provide secure storage for secrets. Hardware-based storage of device secrets is not required, but strongly recommended to help protect sensitive information like your device certificate's private key.

In this tutorial you'll complete the following objectives:

> [!div class="checklist"]
> * Create a certificate chain of trust to organize a set of devices using X.509 certificates.
> * Complete proof of possession with a signing certificate used with the certificate chain.
> * Create a new group enrollment that uses the certificate chain
> * Set up the development environment for provisioning a device using code from the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c)
> * Provision a device using the certificate chain with the custom Hardware Security Module (HSM) sample in the SDK.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

The following prerequisites are for a Windows development environment used to simulate the devices. For Linux or macOS, see the appropriate section in [Prepare your development environment](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/devbox_setup.md) in the SDK documentation.

* Install [Visual Studio](https://visualstudio.microsoft.com/vs/) 2022 with the ['Desktop development with C++'](/cpp/ide/using-the-visual-studio-ide-for-cpp-desktop-development) workload enabled. Visual Studio 2015, Visual Studio 2017, and Visual Studio 19 are also supported. For Linux or macOS, see the appropriate section in [Prepare your development environment](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/devbox_setup.md) in the SDK documentation.

* Install the latest [CMake build system](https://cmake.org/download/). Make sure you check the option that adds the CMake executable to your path.

    >[!IMPORTANT]
    >Confirm that the Visual Studio prerequisites (Visual Studio and the 'Desktop development with C++' workload) are installed on your machine, **before** starting the `CMake` installation. Once the prerequisites are in place, and the download is verified, install the CMake build system. Also, be aware that older versions of the CMake build system fail to generate the solution file used in this article. Make sure to use the latest version of CMake.

* Install the latest version of [Git](https://git-scm.com/download/). Make sure that Git is added to the environment variables accessible to the command window. See [Software Freedom Conservancy's Git client tools](https://git-scm.com/download/) for the latest version of `git` tools to install, which includes *Git Bash*, the command-line app that you can use to interact with your local Git repository.

* Make sure [OpenSSL](https://www.openssl.org/) is installed on your machine. On Windows, your installation of Git includes an installation of OpenSSL. You can access OpenSSL from the Git Bash prompt. To verify that OpenSSL is installed, open a Git Bash prompt and enter `openssl version`.

  >[!NOTE]
  > Unless you're familiar with OpenSSL and already have it installed on your Windows machine, we recommend using OpenSSL from the Git Bash prompt. Alternatively, you can choose to download the source code and build OpenSSL. To learn more, see the [OpenSSL Downloads](https://www.openssl.org/source/) page. Or, you can download OpenSSL pre-built from a third-party. To learn more, see the [OpenSSL wiki](https://wiki.openssl.org/index.php/Binaries). Microsoft makes no guarantees about the validity of packages downloaded from third-parties. If you do choose to build or download OpenSSL make sure that the OpenSSL binary is accessible in your path and that the `OPENSSL_CNF` environment variable is set to the path of your *openssl.cnf* file.

* Open both a Windows command prompt and a Git Bash prompt.

    The steps in this tutorial assume that you're using a Windows machine and the OpenSSL installation that is installed as part of Git. You'll use the Git Bash prompt to issue OpenSSL commands and the Windows command prompt for everything else. If you're using Linux, you can issue all commands from a Bash shell.

## Prepare the Azure IoT C SDK development environment

In this section, you'll prepare a development environment used to build the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c). The SDK includes sample code and tools used by X.509 devices provisioning with DPS.

1. Open a web browser, and go to the [Release page of the Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c/releases/latest).

2. Select the **Tags** tab at the top of the page.

3. Copy the tag name for the latest release of the Azure IoT C SDK.

4. In your Windows command prompt, run the following commands to clone the latest release of the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c) GitHub repository. (replace `<release-tag>` with the tag you copied in the previous step).

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
    >If `cmake` does not find your C++ compiler, you may get build errors while running the above command. If that happens, try running the command in the [Visual Studio command prompt](/dotnet/framework/tools/developer-command-prompt-for-vs).

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

## Create an X.509 certificate chain

In this section you, will generate an X.509 certificate chain of three certificates for testing each device with this tutorial. The certificates will have the following hierarchy.

![Tutorial device certificate chain](./media/tutorial-custom-hsm-enrollment-group-x509/example-device-cert-chain.png#lightbox)

[Root certificate](concepts-x509-attestation.md#root-certificate): You will complete [proof of possession](how-to-verify-certificates.md) to verify the root certificate. This verification will enable DPS to trust that certificate and verify certificates signed by it.

[Intermediate Certificate](concepts-x509-attestation.md#intermediate-certificate): It's common for intermediate certificates to be used to group devices logically by product lines, company divisions, or other criteria. This tutorial will use a certificate chain composed of one intermediate certificate. The intermediate certificate will be signed by the root certificate. This certificate will also be used on the enrollment group created in DPS to logically group a set of devices. This configuration allows managing a whole group of devices that have device certificates signed by the same intermediate certificate. You can create enrollment groups for enabling or disabling a group of devices. For more information on disabling a group of devices, see [Disallow an X.509 intermediate or root CA certificate by using an enrollment group](how-to-revoke-device-access-portal.md#disallow-an-x509-intermediate-or-root-ca-certificate-by-using-an-enrollment-group)

[Device certificates](concepts-x509-attestation.md#end-entity-leaf-certificate): The device (leaf) certificates will be signed by the intermediate certificate and stored on the device along with its private key. Ideally these sensitive items would be stored securely with an HSM. Each device will present its certificate and private key, along with the certificate chain when attempting provisioning.

### Set up the X.509 OpenSSL environment

1. In your Git Bash command prompt, navigate to a folder where you want to generate the X.509 certificates and keys you'll use in this tutorial.

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
    nsCertType = client, email
    nsComment = "OpenSSL Generated Client Certificate"
    subjectKeyIdentifier = hash
    authorityKeyIdentifier = keyid,issuer
    keyUsage = critical, nonRepudiation, digitalSignature, keyEncipherment
    extendedKeyUsage = clientAuth, emailProtection

    [ server_cert ]
    # Extensions for server certificates.
    basicConstraints = CA:FALSE
    nsCertType = server
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
    nsCertType = client, email
    nsComment = "OpenSSL Generated Client Certificate"
    subjectKeyIdentifier = hash
    authorityKeyIdentifier = keyid,issuer
    keyUsage = critical, nonRepudiation, digitalSignature, keyEncipherment
    extendedKeyUsage = clientAuth, emailProtection

    [ server_cert ]
    # Extensions for server certificates.
    basicConstraints = CA:FALSE
    nsCertType = server
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

1. Create the directory structure, the index file, and the serial number file used by OpenSSL commands in this article:

    ```bash
    mkdir certs csr intermediateCerts newcerts private
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

    ```bash
    openssl req -new -x509 -config ./openssl_root_ca.cnf -passin pass:1234 -key ./private/azure-iot-test-only.root.ca.key.pem -subj '//CN=Azure IoT Hub CA Cert Test Only' -days 30 -sha256 -extensions v3_ca -out ./certs/azure-iot-test-only.root.ca.cert.pem
    ```

### Create the intermediate CA certificate

Run the following commands to create the intermediate CA private key and the intermediate CA certificate. You'll use this certificate and key to sign your device certificate(s).

1. Create the intermediate CA private key:

    ```bash
    openssl genrsa -aes256 -passout pass:1234 -out ./private/azure-iot-test-only.intermediate.key.pem 4096
    ```

1. Create the intermediate CA certificate signing request (CSR):

    ```bash
    openssl req -new -sha256 -passin pass:1234 -config ./openssl_device_intermediate_ca.cnf -subj '//CN=Azure IoT Hub Intermediate Cert Test Only' -key ./private/azure-iot-test-only.intermediate.key.pem -out ./csr/azure-iot-test-only.intermediate.csr.pem
    ```

1. Sign the intermediate certificate with the root CA certificate

    ```bash
    openssl ca -batch -config ./openssl_root_ca.cnf -passin pass:1234 -extensions v3_intermediate_ca -days 30 -notext -md sha256 -in ./csr/azure-iot-test-only.intermediate.csr.pem -out ./certs/azure-iot-test-only.intermediate.cert.pem
    ```

### Create the device certificates

In this section you create the device certificates and the full chain device certificates. The full chain certificate contains the device certificate, the intermediate CA certificate, and the root CA certificate. The device must present its full chain certificate when it registers with DPS.

1. Create the device private key.

    ```bash
    openssl genrsa -out ./private/device-01.key.pem 4096
    ```

1. Create the device certificate CSR.

    The subject common name (CN) of the device certificate must be set to the [Registration ID](./concepts-service.md#registration-id) that your device will use to register with DPS. The registration ID is a case-insensitive string (up to 128 characters long) of alphanumeric characters plus the special characters: `'-'`, `'.'`, `'_'`, `':'`. The last character must be alphanumeric or dash (`'-'`). The common name must adhere to this format. For group enrollments, the registration ID is also used as the device ID in IoT Hub. The subject common name is set in the `-subj` parameter in the following command.

    ```bash
    openssl req -config ./openssl_device_intermediate_ca.cnf -key ./private/device-01.key.pem -subj //CN=device-01 -new -sha256 -out ./csr/device-01.csr.pem
    ```

1. Sign the device certificate.

    ```bash
    openssl ca -batch -config ./openssl_device_intermediate_ca.cnf -passin pass:1234 -extensions usr_cert -days 30 -notext -md sha256 -in ./csr/device-01.csr.pem -out ./certs/device-01.cert.pem
    ```

1. The device must present the full certificate chain when it authenticates with DPS. Replace all instances of `new-device` in the command with the device file name root that you chose previously.

    ```bash
    cat ./certs/device-01.cert.pem ./certs/azure-iot-test-only.intermediate.cert.pem ./certs/azure-iot-test-only.root.ca.cert.pem > ./certs/device-01-full-chain.cert.pem
    ```  

    Use a text editor and open the certificate chain file, *./certs/device-01-full-chain.cert.pem*. The certificate chain text contains the full chain of all three certificates. You will use this text as the certificate chain with in the custom HSM device code later in this tutorial for `custom-hsm-device-01`.

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

1. To create the private key, X.509 certificate, and full chain certificate for the second device, copy and paste this script into your GitBash command prompt. To create additional devices, you can modify the `registration_id` variable declared at the beginning of the script.

    ```bash
    registration_id=device-02
    echo $registration_id
    openssl genrsa -out ./private/${registration_id}.key.pem 4096
    openssl req -config ./openssl_device_intermediate_ca.cnf -key ./private/${registration_id}.key.pem -subj "//CN=$registration_id" -new -sha256 -out ./csr/${registration_id}.csr.pem
    openssl ca -batch -config ./openssl_device_intermediate_ca.cnf -passin pass:1234 -extensions usr_cert -days 30 -notext -md sha256 -in ./csr/${registration_id}.csr.pem -out ./certs/${registration_id}.cert.pem
    cat ./certs/${registration_id}.cert.pem ./certs/azure-iot-test-only.intermediate.cert.pem ./certs/azure-iot-test-only.root.ca.cert.pem > ./certs/${registration_id}-full-chain.ca.cert.pem
    ```

    >[NOTE!]
    > This script uses the registration ID as the base filename for the private key and certificate files. If your registration ID contains characters that aren't valid filename characters, you'll need to modify it accordingly.

### Create root CA and intermediate CA certificates

To create the root CA and intermediate CA certificates of the certificate chain:

1. Open a Git Bash command prompt. Complete steps 1 and 2 using the Bash shell instructions that are located in [Managing test CA certificates for samples and tutorials](https://github.com/Azure/azure-iot-sdk-c/blob/master/tools/CACertificates/CACertificateOverview.md#managing-test-ca-certificates-for-samples-and-tutorials).

    This creates a working directory for the certificate scripts, and generates the example root and intermediate certificate for the certificate chain using openssl. 
    
2. Notice in the output showing the location of the self-signed root certificate. This certificate will go through [proof of possession](how-to-verify-certificates.md) to verify ownership later.

    ```output
    Creating the Root CA Certificate
    CA Root Certificate Generated At:
    ---------------------------------
        ./certs/azure-iot-test-only.root.ca.cert.pem
    
    Certificate:
        Data:
            Version: 3 (0x2)
            Serial Number:
                fc:cc:6b:ab:3b:9a:3e:fe
        Signature Algorithm: sha256WithRSAEncryption
            Issuer: CN=Azure IoT Hub CA Cert Test Only
            Validity
                Not Before: Oct 23 21:30:30 2020 GMT
                Not After : Nov 22 21:30:30 2020 GMT
            Subject: CN=Azure IoT Hub CA Cert Test Only
    ```        
    
3. Notice in the output showing the location of the intermediate certificate that is signed/issued by the root certificate. This certificate will be used with the enrollment group you will create later.

    ```output
    Intermediate CA Certificate Generated At:
    -----------------------------------------
        ./certs/azure-iot-test-only.intermediate.cert.pem
    
    Certificate:
        Data:
            Version: 3 (0x2)
            Serial Number: 1 (0x1)
        Signature Algorithm: sha256WithRSAEncryption
            Issuer: CN=Azure IoT Hub CA Cert Test Only
            Validity
                Not Before: Oct 23 21:30:33 2020 GMT
                Not After : Nov 22 21:30:33 2020 GMT
            Subject: CN=Azure IoT Hub Intermediate Cert Test Only
    ```    
    
#### Create device certificates

To create the device certificates signed by the intermediate certificate in the chain:

1. Run the following command to create a new device/leaf certificate with a subject name you give as a parameter. Use the example subject name given for this tutorial, `custom-hsm-device-01`. This subject name will be the device ID for your IoT device. 

    > [!WARNING]
    > Don't use a subject name with spaces in it. This subject name is the device ID for the IoT device being provisioned. 
    > It must follow the rules for a device ID. For more information, see [Device identity properties](../iot-hub/iot-hub-devguide-identity-registry.md#device-identity-properties).

    ```cmd
    ./certGen.sh create_device_certificate_from_intermediate "custom-hsm-device-01"
    ```

    Notice the following output showing where the new device certificate is located. The device certificate is signed (issued) by the intermediate certificate.

    ```output
    -----------------------------------
    ./certs/new-device.cert.pem: OK
    Leaf Device Certificate Generated At:
    ----------------------------------------
        ./certs/new-device.cert.pem
    
    Certificate:
        Data:
            Version: 3 (0x2)
            Serial Number: 9 (0x9)
        Signature Algorithm: sha256WithRSAEncryption
            Issuer: CN=Azure IoT Hub Intermediate Cert Test Only
            Validity
                Not Before: Nov 10 09:20:33 2020 GMT
                Not After : Dec 10 09:20:33 2020 GMT
            Subject: CN=custom-hsm-device-01
    ```    
    
2. Run the following command to create a full certificate chain .pem file that includes the new device certificate for `custom-hsm-device-01`.

    ```Bash
    cd ./certs && cat new-device.cert.pem azure-iot-test-only.intermediate.cert.pem azure-iot-test-only.root.ca.cert.pem > new-device-01-full-chain.cert.pem && cd ..
    ```

    Use a text editor and open the certificate chain file, *./certs/new-device-01-full-chain.cert.pem*. The certificate chain text contains the full chain of all three certificates. You will use this text as the certificate chain with in the custom HSM device code later in this tutorial for `custom-hsm-device-01`.

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

3. Notice the private key for the new device certificate is written to *./private/new-device.key.pem*. Rename this key file *./private/new-device-01.key.pem* for the `custom-hsm-device-01` device. The text for this key will be needed by the device during provisioning. The text will be added to the custom HSM example later.

    ```bash
    $ mv private/new-device.key.pem private/new-device-01.key.pem
    ```

    > [!WARNING]
    > The text for the certificates only contains public key information. 
    >
    > However, the device must also have access to the private key for the device certificate. This is necessary because the device must perform verification using that key at runtime when attempting provisioning. The sensitivity of this key is one of the main reasons it is recommended to use hardware-based storage in a real HSM to help secure private keys.

4. Delete *./certs/new-device.cert.pem*, and repeat steps 1-3 for a second device with device ID `custom-hsm-device-02`. You must delete *./certs/new-device.cert.pem* or certificate generation will fail for the second device. Only the full chain certificate files will be used by this article. Use the following values for the second device:

    |   Description                 |  Value  |
    | :---------------------------- | :--------- |
    | Subject Name                  | `custom-hsm-device-02` |
    | Full certificate chain file   | *./certs/new-device-02-full-chain.cert.pem* |
    | Private key filename          | *private/new-device-02.key.pem* |
    

## Verify ownership of the root certificate

> [!NOTE]
> As of July 1st, 2021, you can perform automatic verification of certificate via [automatic verification](how-to-verify-certificates.md#automatic-verification-of-intermediate-or-root-ca-through-self-attestation)
>

1. Using the directions from [Register the public part of an X.509 certificate and get a verification code](how-to-verify-certificates.md#register-the-public-part-of-an-x509-certificate-and-get-a-verification-code), upload the root certificate (`./certs/azure-iot-test-only.root.ca.cert.pem`) and get a verification code from DPS.

2. Once you have a verification code from DPS for the root certificate, run the following command from your certificate script working directory to generate a verification certificate.
 
    The verification code given here is only an example. Use the code you generated from DPS.    

    ```Bash
    ./certGen.sh create_verification_certificate 1B1F84DE79B9BD5F16D71E92709917C2A1CA19D5A156CB9F    
    ```    

    This script creates a certificate signed by the root certificate with subject name set to the verification code. This certificate allows DPS to verify you have access to the private key of the root certificate. Notice the location of the verification certificate in the output of the script. This certificate is generated in `.pfx` format.

    ```output
    Leaf Device PFX Certificate Generated At:
    --------------------------------------------
        ./certs/verification-code.cert.pfx
    ```

3. As mentioned in [Upload the signed verification certificate](how-to-verify-certificates.md#upload-the-signed-verification-certificate), upload the verification certificate, and click **Verify** in DPS to complete proof of possession for the root certificate.


## Update the certificate store on Windows-based devices

On non-Windows devices, you can pass the certificate chain from the code as the certificate store.

On Windows-based devices, you must add the signing certificates (root and intermediate) to a Windows [certificate store](/windows/win32/secauthn/certificate-stores). Otherwise, the signing certificates won't be transported to DPS by a secure channel with Transport Layer Security (TLS).

> [!TIP]
> It is also possible to use OpenSSL instead of secure channel (Schannel) with the C SDK. For more information on using OpenSSL, see [Using OpenSSL in the SDK](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/devbox_setup.md#using-openssl-in-the-sdk).

To add the signing certificates to the certificate store in Windows-based devices:

1. In a Git bash prompt, navigate to the `certs` subdirectory that contains your signing certificates and convert them to `.pfx` as follows.

    root certificate:

    ```bash
    winpty openssl pkcs12 -inkey ../private/azure-iot-test-only.root.ca.key.pem -in ./azure-iot-test-only.root.ca.cert.pem -export -out ./root.pfx
    ```
    
    intermediate certificate:   

    ```bash
    winpty openssl pkcs12 -inkey ../private/azure-iot-test-only.intermediate.key.pem -in ./azure-iot-test-only.intermediate.cert.pem -export -out ./intermediate.pfx
    ```

2. Right-click the Windows **Start** button. Then left-click **Run**. Enter *certmgr.msc* and click **Ok** to start certificate manager MMC snap-in.

3. In certificate manager, under **Certificates - Current User**, click **Trusted Root Certification Authorities**. Then on the menu, click **Action** > **All Tasks** > **Import** to import `root.pfx`.

    * Make sure to search by **Personal information Exchange (.pfx)**
    * Use `1234` as the password.
    * Place the certificate in the **Trusted Root Certification Authorities** certificate store.

4. In certificate manager, under **Certificates - Current User**, click **Intermediate Certification Authorities**. Then on the menu, click **Action** > **All Tasks** > **Import** to import `intermediate.pfx`.

    * Make sure to search by **Personal information Exchange (.pfx)**
    * Use `1234` as the password.
    * Place the certificate in the **Intermediate Certification Authorities** certificate store.

Your signing certificates are now trusted on the Windows-based device and the full chain can be transported to DPS.

## Create an enrollment group

1. Sign in to the Azure portal, select the **All resources** button on the left-hand menu and open your Device Provisioning Service.

2. Select the **Manage enrollments** tab, then select the **Add enrollment group** button at the top.

3. In the **Add Enrollment Group** panel, enter the following information, then press the **Save** button.

      ![Add enrollment group for X.509 attestation in the portal](./media/tutorial-custom-hsm-enrollment-group-x509/custom-hsm-enrollment-group-x509.png#lightbox)

    | Field        | Value           |
    | :----------- | :-------------- |
    | **Group name** | For this tutorial, enter **custom-hsm-x509-devices**. The enrollment group name is a case-insensitive string (up to 128 characters long) of alphanumeric characters plus the special characters: `'-'`, `'.'`, `'_'`, `':'`. The last character must be alphanumeric or dash (`'-'`). |
    | **Attestation Type** | Select **Certificate** |
    | **IoT Edge device** | Select **False** |
    | **Certificate Type** | Select **Intermediate Certificate** |
    | **Primary certificate .pem or .cer file** | Navigate to the intermediate you created earlier (*./certs/azure-iot-test-only.intermediate.cert.pem*). This intermediate certificate is signed by the root certificate that you already uploaded and verified. DPS trusts that root once it is verified. DPS can verify the intermediate provided with this enrollment group is truly signed by the trusted root. DPS will trust each intermediate truly signed by that root certificate, and therefore be able to verify and trust leaf certificates signed by the intermediate.  |

## Configure the provisioning device code

In this section, you update the sample code with your Device Provisioning Service instance information. If a device is authenticated, it will be assigned to an IoT hub linked to the Device Provisioning Service instance configured in this section.

1. In the Azure portal, select the **Overview** tab for your Device Provisioning Service and note the **_ID Scope_** value.

    ![Extract Device Provisioning Service endpoint information from the portal blade](./media/quick-create-simulated-device-x509/copy-id-scope.png) 

2. Launch Visual Studio and open the new solution file that was created in the `cmake` directory you created in the root of the azure-iot-sdk-c git repository. The solution file is named `azure_iot_sdks.sln`.

3. In Solution Explorer for Visual Studio, navigate to **Provisioning_Samples > prov_dev_client_sample > Source Files** and open *prov_dev_client_sample.c*.

4. Find the `id_scope` constant, and replace the value with your **ID Scope** value that you copied earlier. 

    ```c
    static const char* id_scope = "0ne00000A0A";
    ```

5. Find the definition for the `main()` function in the same file. Make sure the `hsm_type` variable is set to `SECURE_DEVICE_TYPE_X509` as shown below.

    ```c
    SECURE_DEVICE_TYPE hsm_type;
    //hsm_type = SECURE_DEVICE_TYPE_TPM;
    hsm_type = SECURE_DEVICE_TYPE_X509;
    //hsm_type = SECURE_DEVICE_TYPE_SYMMETRIC_KEY;
    ```

6. Right-click the **prov\_dev\_client\_sample** project and select **Set as Startup Project**.

## Configure the custom HSM stub code

The specifics of interacting with actual secure hardware-based storage vary depending on the device hardware. The certificate chains used by the simulated devices in this tutorial will be hardcoded in the custom HSM stub code. In a real-world scenario, the certificate chain would be stored in the actual HSM hardware to provide better security for sensitive information. Methods similar to the stub methods used in this sample would then be implemented to read the secrets from that hardware-based storage.

While HSM hardware is not required, it is recommended to protect sensitive information, like the certificate's private key. If an actual HSM was being called by the sample, the private key would not be present in the source code. Having the key in the source code exposes the key to anyone that can view the code. This is only done in this article to assist with learning.

To update the custom HSM stub code to simulate the identity of the device with ID `device-01`, perform the following steps:

1. In Solution Explorer for Visual Studio, navigate to **Provisioning_Samples > custom_hsm_example > Source Files** and open *custom_hsm_example.c*.

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

    Updating this string value manually can be prone to error. To generate the proper syntax, you can copy and paste the following command into your **Git Bash prompt**, and press **ENTER**. This command will generate the syntax for the `CERTIFICATE` string constant value and write it to the output.

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

    Updating this string value manually can be prone to error. To generate the proper syntax, you can copy and paste the following command into your **Git Bash prompt**, and press **ENTER**. This command  will generate the syntax for the `PRIVATE_KEY` string constant value and write it to the output.

    ```Bash
    sed -e 's/^/"/;$ !s/$/""\\n"/;$ s/$/"/' ./private/device-01.key.pem
    ```

    Copy and paste the output private key text for the constant value.

5. Save *custom_hsm_example.c*.

6. On the Visual Studio menu, select **Debug** > **Start without debugging** to run the solution. When prompted to rebuild the project, select **Yes** to rebuild the project before running.

    The following output is an example of simulated device `device-01` successfully booting up, and connecting to the provisioning service. The device was assigned to an IoT hub and registered:

    ```cmd
    Provisioning API Version: 1.3.9
    
    Registering Device
    
    Provisioning Status: PROV_DEVICE_REG_STATUS_CONNECTED
    Provisioning Status: PROV_DEVICE_REG_STATUS_ASSIGNING
    
    Registration Information received from service: test-docs-hub.azure-devices.net, deviceId: device-01
    Press enter key to exit:
    ```

7. In the portal, navigate to the IoT hub linked to your provisioning service and select the **IoT devices** tab. On successful provisioning of the X.509 device to the hub, its device ID appears on the **IoT devices** blade, with *STATUS* as **enabled**. You might need to press the **Refresh** button at the top.

    ![Custom HSM device is registered with the IoT hub](./media/tutorial-custom-hsm-enrollment-group-x509/hub-provisioned-custom-hsm-x509-device.png) 

8. Repeat steps 1-7 for a second device with device ID `custom-hsm-device-02`. Use the following values for that device:

    |   Description                 |  Value  |
    | :---------------------------- | :--------- |
    | `COMMON_NAME`                 | `"device-02"` |
    | Full certificate chain        | Generate the text using *./certs/new-device-02-full-chain.cert.pem* |
    | Private key                   | Generate the text using  *./private/new-device-02.key.pem* |

    The following output is an example of simulated device `device-02` successfully booting up, and connecting to the provisioning service. The device was assigned to an IoT hub and registered:

    ```cmd
    Provisioning API Version: 1.3.9
    
    Registering Device
    
    Provisioning Status: PROV_DEVICE_REG_STATUS_CONNECTED
    Provisioning Status: PROV_DEVICE_REG_STATUS_ASSIGNING
    
    Registration Information received from service: test-docs-hub.azure-devices.net, deviceId: device-02
    Press enter key to exit:
    ```


## Clean up resources

When you're finished testing and exploring this device client sample, use the following steps to delete all resources created by this tutorial.

1. Close the device client sample output window on your machine.
1. From the left-hand menu in the Azure portal, select **All resources** and then select your Device Provisioning Service. Open **Manage Enrollments** for your service, and then select the **Enrollment Groups** tab. Select the check box next to the *Group Name* of the device group you created in this tutorial, and press the **Delete** button at the top of the pane. 
1. Click **Certificates** in DPS. For each certificate you uploaded and verified in this tutorial, click the certificate and click the **Delete** button to remove it.
1. From the left-hand menu in the Azure portal, select **All resources** and then select your IoT hub. Open **IoT devices** for your hub. Select the check box next to the *DEVICE ID* of the device that you registered in this tutorial. Click the **Delete** button at the top of the pane.

## Next steps

In this tutorial, you provisioned an X.509 device using a custom HSM to your IoT hub. To learn how to provision IoT devices to multiple hubs continue to the next tutorial. 

> [!div class="nextstepaction"]
> [Tutorial: Provision devices across load-balanced IoT hubs](tutorial-provision-multiple-hubs.md)
