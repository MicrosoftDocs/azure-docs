---
title: Quickstart - Use symmetric key to provision a device to Azure IoT Hub using C#
description: In this quickstart, you will use the C# device SDK for the Device Provisioning Service (DPS) to provision a symmetric key device to an IoT hub
author: wesmc7777
ms.author: wesmc
ms.date: 10/21/2020
ms.topic: quickstart
ms.service: iot-dps
services: iot-dps 
manager: eliotgra
ms.custom: mvc
#Customer intent: As a new IoT developer, I want provision a symmetric key to an IoT hub using DPS and C#.
---

# Quickstart: Provision a symmetric key device using C#

In this quickstart, you will learn how to provision a Windows development machine as a device to an IoT hub using C#. This device will use a symmetric key and an individual enrollment to authenticate with a Device Provisioning Service (DPS) instance in order to be assigned to an IoT hub. Sample code from the [Azure IoT Samples for C#](https://github.com/Azure-Samples/azure-iot-samples-csharp) will be used to provision the device. 

Although this article demonstrates provisioning with an individual enrollment, you can also use enrollment groups. There are some differences when using enrollment groups. For example, you must use a derived device key with a unique registration ID for the device. [Provision devices with symmetric keys](how-to-legacy-device-symm-key.md) provides an enrollment group example. For more information on enrollment groups, see [Group Enrollments for Symmetric Key Attestation](concepts-symmetric-key-attestation.md#group-enrollments).

If you're unfamiliar with the process of auto-provisioning, review the [provisioning](about-iot-dps.md#provisioning-process) overview. 

Also, make sure you've completed the steps in [Set up IoT Hub Device Provisioning Service with the Azure portal](./quick-setup-auto-provision.md) before continuing with this quickstart. This quickstart requires you to have already created your Device Provisioning Service instance.

This article is oriented toward a Windows-based workstation. However, you can perform the procedures on Linux. For a Linux example, see [Provision for multitenancy](how-to-provision-multitenant.md).


[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]


## Prerequisites

* Make sure you have [.NET Core 2.1 SDK](https://dotnet.microsoft.com/download) or later installed on your Windows-based machine.

* Latest version of [Git](https://git-scm.com/download/) installed.

<a id="setupdevbox"></a>


## Create a device enrollment

1. Sign in to the [Azure portal](https://portal.azure.com), select the **All resources** button on the left-hand menu and open your Device Provisioning service (DPS) instance.

2. Select the **Manage enrollments** tab, and then select the **Add individual enrollment** button at the top. 

3. In the **Add Enrollment** panel, enter the following information, and press the **Save** button.

   - **Mechanism**: Select **Symmetric Key** as the identity attestation *Mechanism*.

   - **Auto-generate keys**: Check this box.

   - **Registration ID**: Enter a registration ID to identify the enrollment. Use only lowercase alphanumeric and dash ('-') characters. For example, **symm-key-csharp-device-01**.

   - **IoT Hub Device ID:** Enter a device identifier. For example, **csharp-device-01**.

     ![Add individual enrollment for symmetric key attestation in the portal](./media/quick-create-device-symmetric-key-csharp/create-individual-enrollment-csharp.png)

4. Once you have saved your enrollment, the **Primary Key** and **Secondary Key** will be generated and added to the enrollment entry. Your symmetric key device enrollment appears as **symm-key-csharp-device-01** under the *Registration ID* column in the *Individual Enrollments* tab. 

5. Open the enrollment and copy the value of your generated **Primary Key** and **Secondary Key**. You will use this key value and the **Registration ID** later when you add environment variables for use with the device provisioning sample code.



## Prepare the C# environment 

1. Open a Git CMD or Git Bash command line environment. Clone the [Azure IoT Samples for C#](https://github.com/Azure-Samples/azure-iot-samples-csharp) GitHub repository using the following command:

    ```cmd
    git clone https://github.com/Azure-Samples/azure-iot-samples-csharp.git
    ```



<a id="firstbootsequence"></a>

## Prepare the device provisioning code

In this section, you will add the following four environment variables that will be used as parameters for the device provisioning sample code to provision your symmetric key device. 

* `DPS_IDSCOPE`
* `PROVISIONING_REGISTRATION_ID`
* `PRIMARY_SYMMETRIC_KEY`
* `SECONDARY_SYMMETRIC_KEY`

The provisioning code will contact the DPS instance based on these variables in order to authenticate your device. The device will then be assigned to an IoT hub already linked to the DPS instance based on the individual enrollment configuration. Once provisioned, the sample code will send some test telemetry to the IoT hub.

1. In the [Azure portal](https://portal.azure.com), on your Device Provisioning Service menu, select **Overview** and copy your _Service Endpoint_ and _ID Scope_. You will use these values for the `PROVISIONING_HOST` and `DPS_IDSCOPE` environment variables.

    ![Service information](./media/quick-create-device-symmetric-key-csharp/extract-dps-endpoints.png)

2. Open a command prompt and navigate to the *SymmetricKeySample* in the cloned samples repository:

    ```cmd
    cd provisioning\Samples\device\SymmetricKeySample
    ```

3. In the *SymmetricKeySample* folder, open *Program.cs* in a text editor and find the lines of code that set the `individualEnrollmentPrimaryKey` and `individualEnrollmentSecondaryKey` strings. Update those lines of code as follows so that the environment variables are used instead of hard coding the keys.
 
    ```csharp
        //These are the two keys that belong to your individual enrollment. 
        // Leave them blank if you want to try this sample for an individual enrollment instead
        //private const string individualEnrollmentPrimaryKey = "";
        //private const string individualEnrollmentSecondaryKey = "";

        private static string individualEnrollmentPrimaryKey = Environment.GetEnvironmentVariable("PRIMARY_SYMMETRIC_KEY");;
        private static string individualEnrollmentSecondaryKey = Environment.GetEnvironmentVariable("SECONDARY_SYMMETRIC_KEY");;
    ```

    Also, find the line of code that sets the `registrationId` string and update it as follows to also use an environment variable as follows:

    ```csharp
        //This field is mandatory to provide for this sample
        //private static string registrationId = "";

        private static string registrationId = Environment.GetEnvironmentVariable("PROVISIONING_REGISTRATION_ID");;
    ```

    Save the changes to *Program.cs*.

3. In your command prompt, add the environment variables for the ID Scope, registration ID, primary, and secondary symmetric keys you copied from the individual enrollment in the previous section.  

    The following commands are examples to show command syntax. Make sure to use your correct values.

    ```console
    set DPS_IDSCOPE=0ne00000A0A
    ```

    ```console
    set PROVISIONING_REGISTRATION_ID=symm-key-csharp-device-01
    ```

    ```console
    set PRIMARY_SYMMETRIC_KEY=sbDDeEzRuEuGKag+kQKV+T1QGakRtHpsERLP0yPjwR93TrpEgEh/Y07CXstfha6dhIPWvdD1nRxK5T0KGKA+nQ==
    ```

    ```console
    set SECONDARY_SYMMETRIC_KEY=Zx8/eE7PUBmnouB1qlNQxI7fcQ2HbJX+y96F1uCVQvDj88jFL+q6L9YWLLi4jqTmkRPOulHlSbSv2uFgj4vKtw==
    ```


4. Build and run the sample code using the following command.

    ```console
    dotnet run
    ```

5. The expected output should look similar to the following which shows the linked IoT hub that the device was assigned to based on the individual enrollment settings. An example "TestMessage" string is sent to the hub as a test:

    ```output
    D:\azure-iot-samples-csharp\provisioning\Samples\device\SymmetricKeySample>dotnet run
    RegistrationID = symm-key-csharp-device-01
    ProvisioningClient RegisterAsync . . . Assigned
    ProvisioningClient AssignedHub: docs-test-iot-hub.azure-devices.net; DeviceID: csharp-device-01
    Creating Symmetric Key DeviceClient authentication
    DeviceClient OpenAsync.
    DeviceClient SendEventAsync.
    DeviceClient CloseAsync.
    Enter any key to exit
    ```
    
6. In the Azure portal, navigate to the IoT hub linked to your provisioning service and open the **IoT devices** blade. After successfully provisioning the symmetric key device to the hub, the device ID is shown with *STATUS* as **enabled**. You might need to press the **Refresh** button at the top if you already opened the blade prior to running the device sample code. 

    ![Device is registered with the IoT hub](./media/quick-create-device-symmetric-key-csharp/hub-registration-csharp.png) 

> [!NOTE]
> If you changed the *initial device twin state* from the default value in the enrollment entry for your device, it can pull the desired twin state from the hub and act accordingly. For more information, see [Understand and use device twins in IoT Hub](../iot-hub/iot-hub-devguide-device-twins.md).
>


## Clean up resources

If you plan to continue working on and exploring the device client sample, do not clean up the resources created in this quickstart. If you do not plan to continue, use the following steps to delete all resources created by this quickstart.

1. From the left-hand menu in the Azure portal, select **All resources** and then select your Device Provisioning service. Open **Manage Enrollments** for your service, and then select the **Individual Enrollments** tab. Select the check box next to the *REGISTRATION ID* of the device you enrolled in this quickstart, and press the **Delete** button at the top of the pane. 
1. From the left-hand menu in the Azure portal, select **All resources** and then select your IoT hub. Open **IoT devices** for your hub, select the check box next to the *DEVICE ID* of the device you registered in this quickstart, and then press the **Delete** button at the top of the pane.

## Next steps

In this quickstart, you provisioned a Windows-based symmetric key device to your IoT hub using the IoT Hub Device Provisioning Service. To learn how to provision X.509 certificate devices using C#, continue with the quickstart below for X.509 devices. 

> [!div class="nextstepaction"]
> [Azure quickstart - Provision X.509 devices using DPS and C#](quick-create-simulated-device-x509-csharp.md)
