---
title: Azure How to - Use different HSM with the Device Provisioning Service Client SDK | Microsoft Docs
description: Azure How to - Use different HSM with physical devices and simulators with Device Provisioning Service Client SDK
services: iot-dps 
keywords: 
author: yzhong94
ms.author: yizhon
ms.date: 08/28/2017
ms.topic: hero-article
ms.service: iot-dps

documentationcenter: ''
manager: 
ms.devlang: na
ms.custom: mvc
---

# How to use different Hardware Security Module with Device Provisioning Service Client SDK
These steps show how to use different [Hardware Security Module (HSM)](https://azure.microsoft.com/blog/azure-iot-supports-new-security-hardware-to-strengthen-iot-security/) with Device Provisioning Service Client SDK in C using physical device and simulator.  DPS supports two authentication modes: X509 and Trusted Platform Module (TPM).

## Prerequisites

Prepare your development environment according to the section titled "Prepare the development environment" in the [Create and provision simulated device] (./quick-create-simulated-device.md) guide.

## Enable authentication with different HSM

Authentication mode (X509 or TPM) must be enabled for physical device or simulator before they can be enrolled in Azure Portal.  Navigate to the root folder for azure-iot-device-auth.  Run the specified command depending on the authentication mode you choose.

### Use X509 with simulator

DPS ships with a Device Identity Composition Engine (DICE) emulator that generates a X509 certificate for authenticating the device.  Run the following command to enable X509 authentication:

```
cmake -Ddps_auth_type=x509 ..
```

Information regarding hardware with DICE can be found [here](https://azure.microsoft.com/blog/azure-iot-supports-new-security-hardware-to-strengthen-iot-security/)

### Use X509 with hardware

DPS can be used with X509 on other hardware.  An interface between hardware and the SDK is needed to establish connection.  Talk to your HSM manufacturer for information on the interface.

### Use TPM

DPS can connect to Windows and Linus hardware TPM chips with SAS Token.  Run the following command to enable TPM authentication:

```
cmake -Ddps_auth_type=tpm ..
```

### Use TPM with simulator

If you don't have a device with TPM chips, you can use a simulator for development purpose on Windows OS.  Run the following command to enable TPM authentication and run the TPM simulator:

```
cmake -Ddps_auth_type=tpm_simulator ..
```

## Build the SDK
You need to build the SDK prior to creating device enrollment.

### Linux
- To build the SDK in Linux:
  ```
  cd azure-iot-sdk-c
  mkdir cmake
  cd cmake
  cmake ..
  cmake --build .  # append '-- -j <n>' to run <n> jobs in parallel
  ```
  To build Debug binaries, add the corresponding CMake option to the project generation command above, for example:
  ```
  cmake -DCMAKE_BUILD_TYPE=Debug ..
  ```

  There are many CMake configuration options available for building the SDK. For example, you can disable one of the available protocol stacks by adding an argument to the CMake project generation command:
  ```
  cmake -Duse_amqp=OFF ..
  ```
  You can also build and run unit test:
  ```
  cmake -Drun_unittests=ON ..
  cmake --build .
  ctest -C "debug" -V
  ```

### Windows
- To build the SDK in Windows, take the following steps to generate project files:
    - Open a "Developer Command Prompt for VS2015".
    - Run the following CMake commands from the root of the repository:
    ```
    cd azure-iot-sdk-c
    mkdir cmake
    cd cmake
    cmake -G "Visual Studio 14 2015" ..
    ```
    This builds x86 libraries. To build for x64, modify the cmake generator argument: `cmake .. -G "Visual Studio 14 2015 Win64"`

- If project generation completes successfully, you should see a Visual Studio solution file (.sln) under the `cmake` folder. To build the SDK, do one of the following:
    - Open **cmake\azure_iot_sdks.sln** in Visual Studio and build it, **OR**
    - Run the following command in the command prompt you used to generate the project files:
    ```
    cmake --build . -- /m /p:Configuration=Release
    ```
    To build Debug binaries, use the corresponding MSBuild argument: `cmake --build . -- /m /p:Configuration=Debug`

    There are many CMake configuration options available for building the SDK. For example, you can disable one of the available protocol stacks by adding an argument to the CMake project generation command:
    ```
    cmake -G "Visual Studio 14 2015" -Duse_amqp=OFF ..
    ```
    Also, you can build and run unit tests:
    ```
    cmake -G "Visual Studio 14 2015" -Drun_unittests=ON ..
    cmake --build . -- /m /p:Configuration=Debug
    ctest -C "debug" -V
    ```
  
### Libraries to include
- These libraries should be included in your SDK:
    - DPS: dps_http_transport, dps_client, dps_security_client
    - IoTHub Security: iothub_security_client

## Create a device enrollment entry in DPS

1. To enroll a device in DPS, you need note down the Endorsement Key and Registration ID for each device, which are displayed in the Provisioning Tool provided by Client SDK. 

    * For TPM, run the following command to print out Endorsement Key and Registration ID:
        ```
        ./azure-iot-sdk-c/dps_client/tools/tpm_device_provision/tpm_device_provision.exe
        ```
    * For X509, run the following command to print out the root CA certificate (for enrollment groups) and the signer certificate (for individual enrollment):
        ```Shell
        ./azure-iot-sdk-c/dps_client/tools/x509_device_provision/x509_device_provision.exe
        ```
2. Log in to the Azure portal, click on the **All resources** button on the left-hand menu and open your DPS service.
    - TPM: On the DPS summary blade, select **Manage enrollments**. Select **Individual Enrollments** tab and click the **Add** button at the top. Select **TPM** as the identity attestation *Mechanism*, and enter the *Registration Id* and *Endorsement key* as required by the blade. Once complete, click the **Save** button. 
        ![Enter device enrollment information in the portal blade](./media/quick-create-simulated-device/enter-device-enrollment.png)  
   
   - X509 Individual Enrollment: On the DPS summary blade, select **Manage enrollments**. Select **Individual Enrollments** tab and click the **Add** button at the top. Select **X509** as the identity attestation *Mechanism*, upload the signer certificate as required by the blade. Once complete, click the **Save** button. 
   - X509 Group Enrollment: On the DPS summary blade, select **Manage enrollments**. Select **Group Enrollments** tab and click the **Add** button at the top. Select **X509** as the identity attestation *Mechanism*, enter a group name and certification name, upload the root CA certificate as required by the blade. Once complete, click the **Save** button. 

## Simulate first boot sequence for the device

If you are using a simulator for development purpose, you can simulate the first boot sequence for the device.  Refer to this [quickstart](./quick-create-simulated-device.md) guide for more details.

1. In Azure portal, select the **Overview** blade for your DPS service and note down the **_Service endpoint_** and the **_Origin namespace_** values.

    ![Extract DPS endpoint information from the portal blade](./media/quick-create-simulated-device/extract-dps-endpoints.png) 

2. In Visual Studio on your machine, select the sample project named **dps_client_sample** and open the file **dps_client_sample.c**.

3. Assign the _Service endpoint_ value to the `dps_uri` variable. Assign the _ID Scope_ value to the `dps_scope_id` variable. 

    ```
    static const char* dps_uri = "[device provisioning uri]";
    static const char* dps_scope_id = "[dps scope id]";
    ```

4. Right click the **dps_client_sample** project and select **Set as Startup Project**. Run the sample. Notice the messages that simulate the device booting and connecting to the DPS to get your IoT hub information.


## Connecting to IoT Hub after provisioning

Once the device has been provisioned with DPS, this API will use the HSM authentication mode to connect with IoT Hub:
    
    ```
    IOTHUB_CLIENT_LL_HANDLE handle = IoTHubClient_LL_CreateFromDeviceAuth(iothub_uri, device_id, iothub_transport);
    ```

## Clean up resources

If you plan to continue working on and exploring the device client sample, do not clean up the resources created in this quickstart. If you do not plan to continue, use the following steps to delete all resources created by this quickstart.

1. Close the device client sample output window on your machine.
2. Close the TPM simulator window on your machine if you are using TPS simulator.
3. In the Azure portal left-hand menu, click **Resource groups** and then click **myResourceGroup**. 
4. On your resource group page, click **Delete**, type **myResourceGroup** in the text box, and then click **Delete**.

## Next steps

In this quickstart, you’ve learned how to use different authentication modes supported by DPS and provision simulated and physical device to your IoT hub using Azure IoT Hub Device Provisioning Service. 
