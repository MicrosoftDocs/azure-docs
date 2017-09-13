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

# How to use different Hardware Security Modules with Device Provisioning Service Client SDK
These steps show how to use different [Hardware Security Module (HSM)](https://azure.microsoft.com/blog/azure-iot-supports-new-security-hardware-to-strengthen-iot-security/) with Device Provisioning Service Client SDK in C using physical device and simulator.  The provisioning service supports two authentication modes: X**.**509 and Trusted Platform Module (TPM).

## Prerequisites

Prepare your development environment according to the section titled "Prepare the development environment" in the [Create and provision simulated device] (./quick-create-simulated-device.md) guide.

## Enable authentication with different HSMs

Authentication mode (X**.**509 or TPM) must be enabled for physical device or simulator before they can be enrolled in Azure Portal.  Navigate to the root folder for azure-iot-sdk-c.  Run the specified command depending on the authentication mode you choose.

### Use X**.**509 with simulator

The provisioning service ships with a Device Identity Composition Engine (DICE) emulator that generates a X**.**509 certificate for authenticating the device.  Run the following command to enable X**.**509 authentication:

```
cmake -Ddps_auth_type=x509 ..
```

Information regarding hardware with DICE can be found [here](https://azure.microsoft.com/blog/azure-iot-supports-new-security-hardware-to-strengthen-iot-security/).

### Use X**.**509 with hardware

The provisioning service can be used with X**.**509 on other hardware.  An interface between hardware and the SDK is needed to establish connection.  Talk to your HSM manufacturer for information on the interface.

### Use TPM

The provisioning service can connect to Windows and Linux hardware TPM chips with SAS Token.  Run the following command to enable TPM authentication:

```
cmake -Ddps_auth_type=tpm ..
```

### Use TPM with simulator

If you don't have a device with TPM chips, you can use a simulator for development purpose on Windows OS.  Run the following command to enable TPM authentication and run the TPM simulator:

```
cmake -Ddps_auth_type=tpm_simulator ..
```

## Build the SDK
Build the SDK prior to creating device enrollment.

### Linux
- To build the SDK in Linux:
    ```
    cd azure-iot-sdk-c
    mkdir cmake
    cd cmake
    cmake ..
    cmake --build .  # append '-- -j <n>' to run <n> jobs in parallel
    ```
- To build Debug binaries, add the corresponding CMake option to the project generation command, for example:
    ```
    cmake -DCMAKE_BUILD_TYPE=Debug ..
    ```

- There are many [CMake configuration options](https://cmake.org/cmake/help/v3.6/manual/cmake.1.html) available for building the SDK. For example, you can disable one of the available protocol stacks by adding an argument to the CMake project generation command:
    ```
    cmake -Duse_amqp=OFF ..
    ```
- You can also build and run unit test:
    ```
    cmake -Drun_unittests=ON ..
    cmake --build .
    ctest -C "debug" -V
    ```

### Windows
- To build the SDK in Windows, take the following steps to generate project files:
    - Open a "Developer Command Prompt for VS2015"
    - Run the following CMake commands from the root of the repository:
      ```
      cd azure-iot-sdk-c
      mkdir cmake
      cd cmake
      cmake -G "Visual Studio 14 2015" ..
      ```
    This command builds x86 libraries. To build for x64, modify the cmake generator argument: 
      ```
      cmake .. -G "Visual Studio 14 2015 Win64"
      ```

- If project generation completes successfully, you should see a Visual Studio solution file (.sln) under the `cmake` folder. To build the SDK:
    - Open **cmake\azure_iot_sdks.sln** in Visual Studio and build it, **OR**
    - Run the following command in the command prompt you used to generate the project files:
      ```
      cmake --build . -- /m /p:Configuration=Release
      ```
- To build Debug binaries, use the corresponding MSBuild argument: 
    ```
    cmake --build . -- /m /p:Configuration=Debug`
    ```
- There are many CMake configuration options available for building the SDK. For example, you can disable one of the available protocol stacks by adding an argument to the CMake project generation command:
    ```
    cmake -G "Visual Studio 14 2015" -Duse_amqp=OFF ..
    ```
- Also, you can build and run unit tests:
    ```
    cmake -G "Visual Studio 14 2015" -Drun_unittests=ON ..
    cmake --build . -- /m /p:Configuration=Debug
    ctest -C "debug" -V
    ```
  
### Libraries to include
- These libraries should be included in your SDK:
    - The provisioning service: dps_http_transport, dps_client, dps_security_client
    - IoTHub Security: iothub_security_client

## Create a device enrollment entry in DPS

### TPM
If you are using TPM, follow instructions in ["Create and provision a simulated device using IoT Hub Device Provisioning Service"](./quick-create-simulated-device.md) to create a device enrollment entry in DPS and simulate first boot.

### X**.**509
1. To enroll a device in the provisioning service, you need note down the Endorsement Key and Registration ID for each device, which are displayed in the Provisioning Tool provided by Client SDK. Run the following command to print out the root CA certificate (for enrollment groups) and the signer certificate (for individual enrollment):
      ```
      ./azure-iot-sdk-c/dps_client/tools/x509_device_provision/x509_device_provision.exe
      ```
2. Log in to the Azure Portal, click on the **All resources** button on the left-hand menu and open your DPS service.
   - X**.**509 Individual Enrollment: On the provisioning service summary blade, select **Manage enrollments**. Select **Individual Enrollments** tab and click the **Add** button at the top. Select **X**.**509** as the identity attestation *Mechanism*, upload the signer certificate as required by the blade. Once complete, click the **Save** button. 
   - X**.**509 Group Enrollment: On the provisioning service  summary blade, select **Manage enrollments**. Select **Group Enrollments** tab and click the **Add** button at the top. Select **X**.**509** as the identity attestation *Mechanism*, enter a group name and certification name, upload the root CA certificate as required by the blade. Once complete, click the **Save** button. 

## Connecting to IoT Hub after provisioning

Once the device has been provisioned with the provisioning service, this API uses the HSM authentication mode to connect with IoT Hub: 
  ```
  IOTHUB_CLIENT_LL_HANDLE handle = IoTHubClient_LL_CreateFromDeviceAuth(iothub_uri, device_id, iothub_transport);
  ```
