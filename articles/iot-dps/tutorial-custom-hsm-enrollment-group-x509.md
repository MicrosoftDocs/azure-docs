---
title: Tutorial - Provision X.509 devices to Azure IoT Hub using a custom Hardware Security Module (HSM)
description: This tutorial uses enrollment groups. In this tutorial, you learn how to provision X.509 devices using a custom Hardware Security Module (HSM) and the C device SDK for Azure IoT Hub Device Provisioning Service (DPS).
author: wesmc7777
ms.author: wesmc
ms.date: 01/28/2021
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


In this tutorial you will complete the following objectives:

> [!div class="checklist"]
> * Create a certificate chain of trust to organize a set of devices using X.509 certificates.
> * Complete proof of possession with a signing certificate used with the certificate chain.
> * Create a new group enrollment that uses the certificate chain
> * Set up the development environment for provisioning a device using code from the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c)
> * Provision a device using the certificate chain with the custom Hardware Security Module (HSM) sample in the SDK.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

The following prerequisites are for a Windows development environment used to simulate the devices. For Linux or macOS, see the appropriate section in [Prepare your development environment](https://github.com/Azure/azure-iot-sdk-c/blob/master/doc/devbox_setup.md) in the SDK documentation.

* [Visual Studio](https://visualstudio.microsoft.com/vs/) 2019 with the ['Desktop development with C++'](/cpp/ide/using-the-visual-studio-ide-for-cpp-desktop-development) workload enabled. Visual Studio 2015 and Visual Studio 2017 are also supported. 

    Visual Studio is used in this article to build the device sample code that would be deployed to IoT devices.  This does not imply that Visual Studio is required on the device itself.

* Latest version of [Git](https://git-scm.com/download/) installed.

## Prepare the Azure IoT C SDK development environment

In this section, you will prepare a development environment used to build the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c). The SDK includes sample code and tools used by X.509 devices provisioning with DPS.

1. Download the [CMake build system](https://cmake.org/download/).

    It is important that the Visual Studio prerequisites ([Visual Studio](https://visualstudio.microsoft.com/vs/) and the ['Desktop development with C++'](/cpp/ide/using-the-visual-studio-ide-for-cpp-desktop-development) workload) are installed on your machine, **before** starting the `CMake` installation. Once the prerequisites are in place, and the download is verified, install the CMake build system.

2. Find the tag name for the [latest release](https://github.com/Azure/azure-iot-sdk-c/releases/latest) of the Azure IoT C SDK.

3. Open a command prompt or Git Bash shell. Run the following commands to clone the latest release of the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c) GitHub repository. Use the tag you found in the previous step as the value for the `-b` parameter:

    ```cmd/sh
    git clone -b <release-tag> https://github.com/Azure/azure-iot-sdk-c.git
    cd azure-iot-sdk-c
    git submodule update --init
    ```

    You should expect this operation to take several minutes to complete.

4. Create a `cmake` subdirectory in the root directory of the git repository, and navigate to that folder. 

    ```cmd/sh
    mkdir cmake
    cd cmake
    ```

5. The `cmake` directory you created will contain the custom HSM sample, and the sample device provisioning code that uses the custom HSM to provide X.509 authentication. 

    Run the following command in your `cmake` directory to build a version of the SDK specific to your development platform. The build will include a reference to the custom HSM sample. 

    When specifying the path used with `-Dhsm_custom_lib` below, make sure to use the path relative to the `cmake` directory you previously created. The relative path shown below is only an example.

    ```cmd
    $ cmake -Duse_prov_client:BOOL=ON -Dhsm_custom_lib=/d/azure-iot-sdk-c/cmake/provisioning_client/samples/custom_hsm_example/Debug/custom_hsm_example.lib ..
    ```

    If `cmake` does not find your C++ compiler, you might get build errors while running the above command. If that happens, try running this command in the [Visual Studio command prompt](/dotnet/framework/tools/developer-command-prompt-for-vs).

    Once the build succeeds, a Visual Studio solution will be generated in your `cmake` directory. The last few output lines look similar to the following output:

    ```cmd/sh
    $ cmake -Duse_prov_client:BOOL=ON -Dhsm_custom_lib=/d/azure-iot-sdk-c/cmake/provisioning_client/samples/custom_hsm_example/Debug/custom_hsm_example.lib ..
    -- Building for: Visual Studio 16 2019
    -- The C compiler identification is MSVC 19.23.28107.0
    -- The CXX compiler identification is MSVC 19.23.28107.0

    ...

    -- Configuring done
    -- Generating done
    -- Build files have been written to: D:/azure-iot-sdk-c/cmake
    ```

## Create an X.509 certificate chain

In this section you, will generate an X.509 certificate chain of three certificates for testing each device with this tutorial. The certificates will have the following hierarchy.

![Tutorial device certificate chain](./media/tutorial-custom-hsm-enrollment-group-x509/example-device-cert-chain.png#lightbox)

[Root certificate](concepts-x509-attestation.md#root-certificate): You will complete [proof of possession](how-to-verify-certificates.md) to verify the root certificate. This verification will enable DPS to trust that certificate and verify certificates signed by it.

[Intermediate Certificate](concepts-x509-attestation.md#intermediate-certificate): It's common for intermediate certificates to be used to group devices logically by product lines, company divisions, or other criteria. This tutorial will use a certificate chain composed of one intermediate certificate. The intermediate certificate will be signed by the root certificate. This certificate will also be used on the enrollment group created in DPS to logically group a set of devices. This configuration allows managing a whole group of devices that have device certificates signed by the same intermediate certificate. You can create enrollment groups for enabling or disabling a group of devices. For more information on disabling a group of devices, see [Disallow an X.509 intermediate or root CA certificate by using an enrollment group](how-to-revoke-device-access-portal.md#disallow-an-x509-intermediate-or-root-ca-certificate-by-using-an-enrollment-group)

[Device certificates](concepts-x509-attestation.md#end-entity-leaf-certificate): The device (leaf) certificates will be signed by the intermediate certificate and stored on the device along with its private key. Ideally these sensitive items would be stored securely with an HSM. Each device will present its certificate and private key, along with the certificate chain when attempting provisioning. 

#### Create root and intermediate certificates

To create the root and intermediate portions of the certificate chain:

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

4. Repeat steps 1-3 for a second device with device ID `custom-hsm-device-02`. Use the following values for that device:

    |   Description                 |  Value  |
    | :---------------------------- | :--------- |
    | Subject Name                  | `custom-hsm-device-02` |
    | Full certificate chain file   | *./certs/new-device-02-full-chain.cert.pem* |
    | Private key filename          | *private/new-device-02.key.pem* |
    

## Verify ownership of the root certificate

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

2. Right-click the Windows **Start** button. Then left-click **Run**. Enter *certmgr.mcs* and click **Ok** to start certificate manager MMC snap-in.

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

1. Sign in to the Azure portal, select the **All resources** button on the left-hand menu and open your Device Provisioning service.

2. Select the **Manage enrollments** tab, then select the **Add enrollment group** button at the top.

3. In the **Add Enrollment Group** panel, enter the following information, then press the **Save** button.

      ![Add enrollment group for X.509 attestation in the portal](./media/tutorial-custom-hsm-enrollment-group-x509/custom-hsm-enrollment-group-x509.png#lightbox)

    | Field        | Value           |
    | :----------- | :-------------- |
    | **Group name** | For this tutorial, enter **custom-hsm-x509-devices** |
    | **Attestation Type** | Select **Certificate** |
    | **IoT Edge device** | Select **False** |
    | **Certificate Type** | Select **Intermediate Certificate** |
    | **Primary certificate .pem or .cer file** | Navigate to the intermediate you created earlier (*./certs/azure-iot-test-only.intermediate.cert.pem*) |


## Configure the provisioning device code

In this section, you update the sample code with your Device Provisioning Service instance information. If a device is authenticated, it will be assigned to an IoT hub linked to the Device Provisioning Service instance configured in this section.

1. In the Azure portal, select the **Overview** tab for your Device Provisioning service and note the **_ID Scope_** value.

    ![Extract Device Provisioning Service endpoint information from the portal blade](./media/quick-create-simulated-device-x509/extract-dps-endpoints.png) 

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

The specifics of interacting with actual secure hardware-based storage vary depending on the hardware. As a result, the certificate chains used by the simulated devices in this tutorial will be hardcoded in the custom HSM stub code. In a real-world scenario, the certificate chain would be stored in the actual HSM hardware to provide better security for sensitive information. Methods similar to the stub methods used in this sample would then be implemented to read the secrets from that hardware-based storage. 

While HSM hardware is not required, it is recommended to protect sensitive information, like the certificate's private key. If an actual HSM was being called by the sample, the private key would not be present in the source code. Having the key in the source code exposes the key to anyone that can view the code. This is only done in this article to assist with learning.

To update the custom HSM stub code to simulate the identity of the device with ID `custom-hsm-device-01`, perform the following steps:

1. In Solution Explorer for Visual Studio, navigate to **Provisioning_Samples > custom_hsm_example > Source Files** and open *custom_hsm_example.c*.

2. Update the string value of the `COMMON_NAME` string constant using the common name you used when generating the device certificate.

    ```c
    static const char* const COMMON_NAME = "custom-hsm-device-01";
    ```

3. In the same file, you need to update the string value of the `CERTIFICATE` constant string using your certificate chain text you saved in *./certs/new-device-01-full-chain.cert.pem* after generating your certificates.

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


4. In the same file, the string value of the `PRIVATE_KEY` constant must also be updated with the private key for your device certificate.

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

5. Save *custom_hsm_example.c*.

6. On the Visual Studio menu, select **Debug** > **Start without debugging** to run the solution. When prompted to rebuild the project, select **Yes** to rebuild the project before running.

    The following output is an example of simulated device `custom-hsm-device-01` successfully booting up, and connecting to the provisioning service. The device was assigned to an IoT hub and registered:

    ```cmd
    Provisioning API Version: 1.3.9
    
    Registering Device
    
    Provisioning Status: PROV_DEVICE_REG_STATUS_CONNECTED
    Provisioning Status: PROV_DEVICE_REG_STATUS_ASSIGNING
    
    Registration Information received from service: test-docs-hub.azure-devices.net, deviceId: custom-hsm-device-01
    Press enter key to exit:
    ```

7. In the portal, navigate to the IoT hub linked to your provisioning service and select the **IoT devices** tab. On successful provisioning of the X.509 device to the hub, its device ID appears on the **IoT devices** blade, with *STATUS* as **enabled**. You might need to press the **Refresh** button at the top. 

    ![Custom HSM device is registered with the IoT hub](./media/tutorial-custom-hsm-enrollment-group-x509/hub-provisioned-custom-hsm-x509-device.png) 

8. Repeat steps 1-7 for a second device with device ID `custom-hsm-device-02`. Use the following values for that device:

    |   Description                 |  Value  |
    | :---------------------------- | :--------- |
    | `COMMON_NAME`                 | `"custom-hsm-device-02"` |
    | Full certificate chain        | Generate the text using `input="./certs/new-device-02-full-chain.cert.pem"` |
    | Private key                   | Generate the text using `input="./private/new-device-02.key.pem"` |

    The following output is an example of simulated device `custom-hsm-device-02` successfully booting up, and connecting to the provisioning service. The device was assigned to an IoT hub and registered:

    ```cmd
    Provisioning API Version: 1.3.9
    
    Registering Device
    
    Provisioning Status: PROV_DEVICE_REG_STATUS_CONNECTED
    Provisioning Status: PROV_DEVICE_REG_STATUS_ASSIGNING
    
    Registration Information received from service: test-docs-hub.azure-devices.net, deviceId: custom-hsm-device-02
    Press enter key to exit:
    ```


## Clean up resources

When you're finished testing and exploring this device client sample, use the following steps to delete all resources created by this tutorial.

1. Close the device client sample output window on your machine.
1. From the left-hand menu in the Azure portal, select **All resources** and then select your Device Provisioning service. Open **Manage Enrollments** for your service, and then select the **Enrollment Groups** tab. Select the check box next to the *Group Name* of the device group you created in this tutorial, and press the **Delete** button at the top of the pane. 
1. Click **Certificates** in DPS. For each certificate you uploaded and verified in this tutorial, click the certificate and click the **Delete** button to remove it.
1. From the left-hand menu in the Azure portal, select **All resources** and then select your IoT hub. Open **IoT devices** for your hub. Select the check box next to the *DEVICE ID* of the device that you registered in this tutorial. Click the **Delete** button at the top of the pane.

## Next steps

In this tutorial, you provisioned an X.509 device using a custom HSM to your IoT hub. To learn how to provision IoT devices to multiple hubs continue to the next tutorial. 

> [!div class="nextstepaction"]
> [Tutorial: Provision devices across load-balanced IoT hubs](tutorial-provision-multiple-hubs.md)