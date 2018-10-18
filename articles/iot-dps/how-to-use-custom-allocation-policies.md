---
title: How to use custom allocation policies with the Azure IoT Hub Device Provisioning Service | Microsoft Docs
description: How to use custom allocation policies with the Azure IoT Hub Device Provisioning Service
author: wesmc7777
ms.author: wesmc
ms.date: 08/15/2018
ms.topic: conceptual
ms.service: iot-dps
services: iot-dps
manager: timlt
---


# How to use custom allocation policies


A custom allocation policy gives you more control over how devices are assigned to an IoT hub. This is accomplished by using custom code in an [Azure Function](../azure-functions/functions-overview.md) to assign devices to an IoT hub. The device provisioning service calls your Azure Function code providing all relevant information about the device and the enrollment. Your function code is executed and returns the IoT hub information used to provisioning the device.

By using custom allocation policies you define your own allocation policies when the policies provided by the Device Provisioning Service do not meet the requirements of your scenario.

For example, maybe you want to examine the certificate a device is using during provisioning, and assign the device to an IoT hub based on a certificate property. Maybe you may have information stored in a database for your devices and need to query the database to determine which IoT hub a device should be assigned to.


This article demonstrates a custom allocation policy using an Azure Function written in C#. Two new IoT hubs are created representing a *Contoso Toasters Division* and a *Contoso Heat Pumps Division*. Devices requesting provisioning must have a registration ID with one of the following suffixes to be accepted for provisioning:

- **-contoso-tstrsd-007**: Contoso Toasters Division
- **-contoso-hpsd-088**: Contoso Heat Pumps Division

The devices will be provisioned based on one of these required suffixes on the registration ID. These devices will be simulated using a provisioning sample included in the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c). 

You will perform the following steps in this article:

* Use the Azure CLI to create two Contoso division IoT hubs (**Contoso Toasters Division** and **Contoso Heat Pumps Division**)
* Create a new group enrollment using an Azure Function for the custom allocation policy
* Create device keys for two device simulations.
* Set up the development environment for the Azure IoT C SDK
* Simulate the devices to see that they are provisioned according to the example code of the custom allocation policy


[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

* Completion of the [Set up IoT Hub Device Provisioning Service with the Azure portal](./quick-setup-auto-provision.md) quickstart.
* Visual Studio 2015 or [Visual Studio 2017](https://www.visualstudio.com/vs/) with the ['Desktop development with C++'](https://www.visualstudio.com/vs/support/selecting-workloads-visual-studio-2017/) workload enabled.
* Latest version of [Git](https://git-scm.com/download/) installed.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Create two divisional IoT hubs

In this section, you will use the Azure Cloud Shell to create two new IoT hubs representing the **Contoso Toasters Division** and the **Contoso Heat Pumps division**.

1. Use the Azure Cloud Shell to create a resource group with the [az group create](/cli/azure/group#az-group-create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. 

    The following example creates a resource group named *contoso-us-resource-group* in the *eastus* region. It is recommended that you use this group for all resources created in this article. This approach will make clean up easier after you are finished.

    ```azurecli-interactive 
    az group create --name contoso-us-resource-group --location eastus
    ```

2. Use the Azure Cloud Shell to create the **Contoso Toasters Division** IoT hub with the [az iot hub create](/cli/azure/iot/hub#az-iot-hub-create) command. The IoT hub will be added to *contoso-us-resource-group*.

    The following example creates an IoT hub named *contoso-toasters-hub-1098* in the *eastus* location. You must use your own unique hub name. Make up your own suffix in the hub name in place of **1098**. The example code for the custom allocation policy requires `-toasters-` in the hub name.

    ```azurecli-interactive 
    az iot hub create --name contoso-toasters-hub-1098 --resource-group contoso-us-resource-group --location eastus --sku S1
    ```
    
    This command may take a few minutes to complete.

3. Use the Azure Cloud Shell to create the **Contoso Heat Pumps Division** IoT hub with the [az iot hub create](/cli/azure/iot/hub#az-iot-hub-create) command. This IoT hub will also be added to *contoso-us-resource-group*.

    The following example creates an IoT hub named *contoso-heatpumps-hub-1098* in the *eastus* location. You must use your own unique hub name. Make up your own suffix in the hub name in place of **1098**. The example code for the custom allocation policy requires `-heatpumps-` in the hub name.

    ```azurecli-interactive 
    az iot hub create --name contoso-heatpumps-hub-1098 --resource-group contoso-us-resource-group --location eastus --sku S1
    ```
    
    This command may also take a few minutes to complete.




## Create the enrollment

In this section, you will create a new enrollment group that uses the custom allocation policy. For simplicity, this article uses [Symmetric key attestation](concepts-symmetric-key-attestation.md) with the enrollment. For a more secure solution, consider using [X.509 certificate attestation](concepts-security.md#x509-certificates) with a chain of trust.

1. Sign in to the [Azure portal](http://portal.azure.com), and open your Device Provisioning Service instance.

2. Select the **Manage enrollments** tab, and then click the **Add enrollment group** button at the top of the page. 

3. On **Add Enrollment Group**, enter the following information, and click the **Save** button.

    **Group name**: Enter **contoso-custom-allocated-devices**.

    **Attestation Type**: Select **Symmetric Key**.

    **Auto Generate Keys**: This checkbox should already be checked.

    **Select how you want to assign devices to hubs**: Select **Custom (Use Azure Function)**.

    ![Add custom allocation enrollment group for symmetric key attestation](./media/how-to-use-custom-allocation-policies/create-custom-allocation-enrollment.png)


4. On **Add Enrollment Group**, click **Link a new IoT hub** to link both of your new divisional IoT hubs. 

    You must execute this step for both of your divisional IoT hubs.

    **Subscription**: If you have multiple subscriptions, choose the subscription where you created the divisional IoT hubs.

    **IoT hub**: Select one of the divisional hubs you created.

    **Access Policy**: Choose **iothubowner**.

    ![Link the divisional IoT hubs with the provisioning service](./media/how-to-use-custom-allocation-policies/link-divisional-hubs.png)


5. On **Add Enrollment Group**, once both divisional IoT hubs have been linked, you must select them as the IoT Hub group for the enrollment group as shown below:

    ![Create the divisional hub group for the enrollment](./media/how-to-use-custom-allocation-policies/enrollment-divisional-hub-group.png)


6. On **Add Enrollment Group**, scroll down to the **Select Azure Function** section and click **Create a new function app**.

7. On **Function App** create page that opens, enter the following settings for your new function and click **Create**:

    **App name**: Enter a unique function app name. **contoso-function-app-1098** is shown as an example.

    **Resource Group**: Select **Use existing** and the **contoso-us-resource-group** to keep all resources created in this article together.

    **Application Insights**: For this exercise you can turn this off.

    ![Create the function app](./media/how-to-use-custom-allocation-policies/function-app-create.png)


8. Back on your **Add Enrollment Group** page, make sure your new function app is selected. You may have to re-select the subscription to refresh the function app list.

    Once your new function app is selected, click **Create a new function**.

    ![Create the function app](./media/how-to-use-custom-allocation-policies/click-create-new-function.png)

    your new function app will be opened.

9. On your function app, click to create a new function

    ![Create the function app](./media/how-to-use-custom-allocation-policies/new-function.png)

    For the new function, use the default settings to create a new **Webhook + API** using the **CSharp** language. Click **Create this function**.

    This creates a new C# function named **HttpTriggerCSharp1**.

10. Replace the code for the new C# function with the following code and click **Save**:    

    ```C#
    #r "Newtonsoft.Json"
    using System.Net;
    using System.Text;
    using Newtonsoft.Json;

    public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
    {
        // Just some diagnostic logging
        log.Info("C# HTTP trigger function processed a request.");
        log.Info("Request.Content:...");    
        log.Info(req.Content.ReadAsStringAsync().Result);

        // Get request body
        dynamic data = await req.Content.ReadAsAsync<object>();

        // Get registration ID of the device
        string regId = data?.deviceRuntimeContext?.registrationId;

        string message = "Uncaught error";
        bool fail = false;
        ResponseObj obj = new ResponseObj();

        if (regId == null)
        {
            message = "Registration ID not provided for the device.";
            log.Info("Registration ID : NULL");
            fail = true;
        }
        else
        {
            string[] hubs = data?.linkedHubs.ToObject<string[]>();

            // Must have hubs selected on the enrollment
            if (hubs == null)
            {
                message = "No hub group defined for the enrollment.";
                log.Info("linkedHubs : NULL");
                fail = true;
            }
            else
            {
                // This is a Contoso Toaster Model 007
                if (regId.Contains("-contoso-tstrsd-007"))
                {
                    //Find the "-toasters-" IoT hub configured on the enrollment
                    foreach(string hubString in hubs)
                    {
                        if (hubString.Contains("-toasters-"))
                            obj.iotHubHostName = hubString;
                    }

                    if (obj.iotHubHostName == null)
                    {
                        message = "No toasters hub found for the enrollment.";
                        log.Info(message);
                        fail = true;
                    }
                }
                // This is a Contoso Heat pump Model 008
                else if (regId.Contains("-contoso-hpsd-088"))
                {
                    //Find the "-heatpumps-" IoT hub configured on the enrollment
                    foreach(string hubString in hubs)
                    {
                        if (hubString.Contains("-heatpumps-"))
                            obj.iotHubHostName = hubString;
                    }

                    if (obj.iotHubHostName == null)
                    {
                        message = "No heat pumps hub found for the enrollment.";
                        log.Info(message);
                        fail = true;
                    }
                }
                // Unrecognized device.
                else
                {
                    fail = true;
                    message = "Unrecognized device registration.";
                    log.Info("Unknown device registration");
                }
            }
        }

        return (fail)
            ? req.CreateResponse(HttpStatusCode.BadRequest, message)
            : new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(JsonConvert.SerializeObject(obj, Formatting.Indented), Encoding.UTF8, "application/json")
            };
    }    

    public class DeviceTwinObj
    {
        public string deviceId {get; set;}
    }

    public class ResponseObj
    {
        public string iotHubHostName {get; set;}
        public string IoTHub {get; set;}
        public DeviceTwinObj initialTwin {get; set;}
        public string[] linkedHubs {get; set;}
        public string enrollment {get; set;}
    }
    ```


11. Return to your **Add Enrollment Group** page, and make sure the new function is selected. You may have to re-select the function app to refresh the functions list.

    Once your new function is selected, click **Save** to save the enrollment group.

    ![Finally save the enrollment group](./media/how-to-use-custom-allocation-policies/save-enrollment.png)


12. After saving the enrollment, reopen it and make a note of the **Primary Key**. You must save the enrollment first to have the keys generated. This key will be used to generate unique device keys for simulated devices later.


## Derive unique device keys

In this section, you will create two unique device keys. One key will be used for a simulated toaster device. The other key will be used for a simulated heat pump device.

To generate the device key, you will use the **Primary Key** you noted earlier to compute the [HMAC-SHA256](https://wikipedia.org/wiki/HMAC) of the device registration ID for each device and convert the result into Base64 format. For more information on creating derived device keys with enrollment groups, see the group enrollments section of [Symmetric key attestation](concepts-symmetric-key-attestation.md).

For the example in this article, use the following two device registration IDs and compute a device key for both devices. Both registration IDs have a valid suffix to work with the example code for the custom allocation policy:

- **breakroom499-contoso-tstrsd-007**
- **mainbuilding167-contoso-hpsd-088**

#### Linux workstations

If you are using a Linux workstation, you can use openssl to generate your derived device keys as shown in the following example.

1. Replace the value of **KEY** with the **Primary Key** you noted earlier.

    ```bash
    KEY=oiK77Oy7rBw8YB6IS6ukRChAw+Yq6GC61RMrPLSTiOOtdI+XDu0LmLuNm11p+qv2I+adqGUdZHm46zXAQdZoOA==

    REG_ID1=breakroom499-contoso-tstrsd-007
    REG_ID2=mainbuilding167-contoso-hpsd-088

    keybytes=$(echo $KEY | base64 --decode | xxd -p -u -c 1000)
    devkey1=$(echo -n $REG_ID1 | openssl sha256 -mac HMAC -macopt hexkey:$keybytes -binary | base64)
    devkey2=$(echo -n $REG_ID2 | openssl sha256 -mac HMAC -macopt hexkey:$keybytes -binary | base64)

    echo -e $"\n\n$REG_ID1 : $devkey1\n$REG_ID2 : $devkey2\n\n"
    ```

    ```bash
    breakroom499-contoso-tstrsd-007 : JC8F96eayuQwwz+PkE7IzjH2lIAjCUnAa61tDigBnSs=
    mainbuilding167-contoso-hpsd-088 : 6uejA9PfkQgmYylj8Zerp3kcbeVrGZ172YLa7VSnJzg=
    ```


#### Windows-based workstations

If you are using a Windows-based workstation, you can use PowerShell to generate your derived device key as shown in the following example.

1. Replace the value of **KEY** with the **Primary Key** you noted earlier.

    ```PowerShell
    $KEY='oiK77Oy7rBw8YB6IS6ukRChAw+Yq6GC61RMrPLSTiOOtdI+XDu0LmLuNm11p+qv2I+adqGUdZHm46zXAQdZoOA=='

    $REG_ID1='breakroom499-contoso-tstrsd-007'
    $REG_ID2='mainbuilding167-contoso-hpsd-088'

    $hmacsha256 = New-Object System.Security.Cryptography.HMACSHA256
    $hmacsha256.key = [Convert]::FromBase64String($key)
    $sig1 = $hmacsha256.ComputeHash([Text.Encoding]::ASCII.GetBytes($REG_ID1))
    $sig2 = $hmacsha256.ComputeHash([Text.Encoding]::ASCII.GetBytes($REG_ID2))
    $derivedkey1 = [Convert]::ToBase64String($sig1)
    $derivedkey2 = [Convert]::ToBase64String($sig2)

    echo "`n`n$REG_ID1 : $derivedkey1`n$REG_ID2 : $derivedkey2`n`n"
    ```

    ```PowerShell
    breakroom499-contoso-tstrsd-007 : JC8F96eayuQwwz+PkE7IzjH2lIAjCUnAa61tDigBnSs=
    mainbuilding167-contoso-hpsd-088 : 6uejA9PfkQgmYylj8Zerp3kcbeVrGZ172YLa7VSnJzg=
    ```


The simulated devices will use the derived device keys with each registration ID to perform symmetric key attestation.




## Prepare an Azure IoT C SDK development environment

In this section, you will prepare a development environment used to build the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c). The SDK includes the sample code for the simulated device. This simulated device will attempt provisioning during the device's boot sequence.

This section is oriented toward a Windows-based workstation. For a Linux example, see the set-up of the VMs in [How to provision for multitenancy](how-to-provision-multitenant.md).



1. Download the version 3.11.4 of the [CMake build system](https://cmake.org/download/). Verify the downloaded binary using the corresponding cryptographic hash value. The following example used Windows PowerShell to verify the cryptographic hash for version 3.11.4 of the x64 MSI distribution:

    ```PowerShell
    PS C:\Downloads> $hash = get-filehash .\cmake-3.11.4-win64-x64.msi
    PS C:\Downloads> $hash.Hash -eq "56e3605b8e49cd446f3487da88fcc38cb9c3e9e99a20f5d4bd63e54b7a35f869"
    True
    ```
    
    The following hash values for version 3.11.4 were listed on the CMake site at the time of this writing:

    ```
    6dab016a6b82082b8bcd0f4d1e53418d6372015dd983d29367b9153f1a376435  cmake-3.11.4-Linux-x86_64.tar.gz
    72b3b82b6d2c2f3a375c0d2799c01819df8669dc55694c8b8daaf6232e873725  cmake-3.11.4-win32-x86.msi
    56e3605b8e49cd446f3487da88fcc38cb9c3e9e99a20f5d4bd63e54b7a35f869  cmake-3.11.4-win64-x64.msi
    ```

    It is important that the Visual Studio prerequisites (Visual Studio and the 'Desktop development with C++' workload) are installed on your machine, **before** starting the `CMake` installation. Once the prerequisites are in place, and the download is verified, install the CMake build system.

2. Open a command prompt or Git Bash shell. Execute the following command to clone the Azure IoT C SDK GitHub repository:
    
    ```cmd/sh
    git clone https://github.com/Azure/azure-iot-sdk-c.git --recursive
    ```
    The size of this repository is currently around 220 MB. You should expect this operation to take several minutes to complete.


3. Create a `cmake` subdirectory in the root directory of the git repository, and navigate to that folder. 

    ```cmd/sh
    cd azure-iot-sdk-c
    mkdir cmake
    cd cmake
    ```

4. Run the following command, which builds a version of the SDK specific to your development client platform. A Visual Studio solution for the simulated device will be generated in the `cmake` directory. 

    ```cmd
    cmake -Duse_prov_client:BOOL=ON ..
    ```
    
    If `cmake` does not find your C++ compiler, you might get build errors while running the above command. If that happens, try running this command in the [Visual Studio command prompt](https://docs.microsoft.com/dotnet/framework/tools/developer-command-prompt-for-vs). 

    Once the build succeeds, the last few output lines will look similar to the following output:

    ```cmd/sh
    $ cmake -Duse_prov_client:BOOL=ON ..
    -- Building for: Visual Studio 15 2017
    -- Selecting Windows SDK version 10.0.16299.0 to target Windows 10.0.17134.
    -- The C compiler identification is MSVC 19.12.25835.0
    -- The CXX compiler identification is MSVC 19.12.25835.0

    ...

    -- Configuring done
    -- Generating done
    -- Build files have been written to: E:/IoT Testing/azure-iot-sdk-c/cmake
    ```




## Simulate the devices

In this section, you will update a provisioning sample named **prov\_dev\_client\_sample** located in the Azure IoT C SDK you set up earlier. 

This sample code simulates a device boot sequence that sends the provisioning request to your Device Provisioning Service instance. The boot sequence will cause the toaster device to be recognized and assigned to the IoT hub using the custom allocation policy.

1. In the Azure portal, select the **Overview** tab for your Device Provisioning service and note down the **_ID Scope_** value.

    ![Extract Device Provisioning Service endpoint information from the portal blade](./media/quick-create-simulated-device-x509/extract-dps-endpoints.png) 

2. In Visual Studio, open the **azure_iot_sdks.sln** solution file that was generated by running CMake earlier. The solution file should be in the following location:

    ```
    \azure-iot-sdk-c\cmake\azure_iot_sdks.sln
    ```

3. In Visual Studio's *Solution Explorer* window, navigate to the **Provision\_Samples** folder. Expand the sample project named **prov\_dev\_client\_sample**. Expand **Source Files**, and open **prov\_dev\_client\_sample.c**.

4. Find the `id_scope` constant, and replace the value with your **ID Scope** value that you copied earlier. 

    ```c
    static const char* id_scope = "0ne00002193";
    ```

5. Find the definition for the `main()` function in the same file. Make sure the `hsm_type` variable is set to `SECURE_DEVICE_TYPE_SYMMETRIC_KEY` as shown below:

    ```c
    SECURE_DEVICE_TYPE hsm_type;
    //hsm_type = SECURE_DEVICE_TYPE_TPM;
    //hsm_type = SECURE_DEVICE_TYPE_X509;
    hsm_type = SECURE_DEVICE_TYPE_SYMMETRIC_KEY;
    ```

6. Right-click the **prov\_dev\_client\_sample** project and select **Set as Startup Project**. 

#### Simulate the Contoso toaster device

1. In Visual Studio's *Solution Explorer* window, navigate to the **hsm\_security\_client** project and expand it. Expand **Source Files**, and open **hsm\_client\_key.c**. 

    Find the declaration of the `REGISTRATION_NAME` and `SYMMETRIC_KEY_VALUE` constants. Make the following changes to the file and save the file.

    Update the value of the `REGISTRATION_NAME` constant with the registration ID for the toaster device **breakroom499-contoso-tstrsd-007**.
    
    Update the value of the `SYMMETRIC_KEY_VALUE` constant with the device key you generated for the toaster device. The value **JC8F96eayuQwwz+PkE7IzjH2lIAjCUnAa61tDigBnSs=** is only given as an example.

    ```c
    static const char* const REGISTRATION_NAME = "breakroom499-contoso-tstrsd-007";
    static const char* const SYMMETRIC_KEY_VALUE = "JC8F96eayuQwwz+PkE7IzjH2lIAjCUnAa61tDigBnSs=";
    ```

2. On the Visual Studio menu, select **Debug** > **Start without debugging** to run the solution. In the prompt to rebuild the project, click **Yes**, to rebuild the project before running.

    The following output is an example of the simulated toaster device successfully booting up, and connecting to the provisioning Service instance to be assigned to the toasters IoT hub by the custom allocation policy:

    ```cmd
    Provisioning API Version: 1.2.9

    Registering Device

    Provisioning Status: PROV_DEVICE_REG_STATUS_CONNECTED
    Provisioning Status: PROV_DEVICE_REG_STATUS_ASSIGNING
    Provisioning Status: PROV_DEVICE_REG_STATUS_ASSIGNING

    Registration Information received from service: contoso-toasters-hub-1098.azure-devices.net, deviceId: breakroom499-contoso-tstrsd-007

    Press enter key to exit:
    ```


#### Simulate the Contoso heat pump device

1. Back in Visual Studio's *Solution Explorer* window, navigate to the **hsm\_security\_client** project and expand it. Expand **Source Files**, and open **hsm\_client\_key.c**. 

    Find the declaration of the `REGISTRATION_NAME` and `SYMMETRIC_KEY_VALUE` constants. Make the following changes to the file and save the file.

    Update the value of the `REGISTRATION_NAME` constant with the registration ID for the heat pump device **mainbuilding167-contoso-hpsd-088**.
    
    Update the value of the `SYMMETRIC_KEY_VALUE` constant with the device key you generated for the toaster device. The value **6uejA9PfkQgmYylj8Zerp3kcbeVrGZ172YLa7VSnJzg=** is only given as an example.

    ```c
    static const char* const REGISTRATION_NAME = "mainbuilding167-contoso-hpsd-088";
    static const char* const SYMMETRIC_KEY_VALUE = "6uejA9PfkQgmYylj8Zerp3kcbeVrGZ172YLa7VSnJzg=";
    ```

7. On the Visual Studio menu, select **Debug** > **Start without debugging** to run the solution. In the prompt to rebuild the project, click **Yes**, to rebuild the project before running.

    The following output is an example of the simulated heat pump device successfully booting up, and connecting to the provisioning Service instance to be assigned to the Contoso heat pumps IoT hub by the custom allocation policy:

    ```cmd
    Provisioning API Version: 1.2.9

    Registering Device

    Provisioning Status: PROV_DEVICE_REG_STATUS_CONNECTED
    Provisioning Status: PROV_DEVICE_REG_STATUS_ASSIGNING
    Provisioning Status: PROV_DEVICE_REG_STATUS_ASSIGNING

    Registration Information received from service: contoso-heatpumps-hub-1098.azure-devices.net, deviceId: mainbuilding167-contoso-hpsd-088

    Press enter key to exit:
    ```




## Troubleshooting custom allocation policies

The following table shows expected scenarios and the results error codes you might encounter. Use this table to help troubleshoot custom allocation policy failures with your Azure Functions.


| Scenario | Registration result from Provisioning Service | Provisioning SDK Results |
| -------- | --------------------------------------------- | ------------------------ |
| The webhook returns 200 OK with ‘iotHubHostName’ set to a valid IoT hub host name | Result status: Assigned  | SDK returns PROV_DEVICE_RESULT_OK along with hub information |
| The webhook returns 200 OK with ‘iotHubHostName’ present in the response, but set to an empty string or null | Result status: Failed<br><br> Error code: CustomAllocationIotHubNotSpecified (400208) | SDK returns PROV_DEVICE_RESULT_HUB_NOT_SPECIFIED |
| The webhook returns 401 Unauthorized | Result status: Failed<br><br>Error code: CustomAllocationUnauthorizedAccess (400209) | SDK returns PROV_DEVICE_RESULT_UNAUTHORIZED |
| An Individual Enrollment was created to disable the device | Result status: Disabled | SDK returns PROV_DEVICE_RESULT_DISABLED |
| The webhook returns error code >= 429 | DPS’ orchestration will retry a number of times. The retry policy is currently:<br><br>&nbsp;&nbsp;- Retry count: 10<br>&nbsp;&nbsp;- Initial interval: 1s<br>&nbsp;&nbsp;- Increment: 9s | SDK will ignore error and submit another get status message in the specified time |
| The webhook returns any other status code | Result status: Failed<br><br>Error code: CustomAllocationFailed (400207) | SDK returns PROV_DEVICE_RESULT_DEV_AUTH_ERROR |


## Clean up resources

If you plan to continue working with resources created in this article, you can leave them. If you do not plan to continue using the resource, use the following steps to delete all resources created by this article to avoid unnecessary charges.

The steps here assume you created all resources in this article as instructed in the same resource group named **contoso-us-resource-group**.

> [!IMPORTANT]
> Deleting a resource group is irreversible. The resource group and all the resources contained in it are permanently deleted. Make sure that you do not accidentally delete the wrong resource group or resources. If you created the IoT Hub inside an existing resource group that contains resources you want to keep, only delete the IoT Hub resource itself instead of deleting the resource group.
>

To delete the resource group by name:

1. Sign in to the [Azure portal](https://portal.azure.com) and click **Resource groups**.

2. In the **Filter by name...** textbox, type the name of the resource group containing your resources, **contoso-us-resource-group**. 

3. To the right of your resource group in the result list, click **...** then **Delete resource group**.

4. You will be asked to confirm the deletion of the resource group. Type the name of your resource group again to confirm, and then click **Delete**. After a few moments, the resource group and all of its contained resources are deleted.

## Next steps

- To learn more Reprovisioning, see [IoT Hub Device reprovisoning concepts](concepts-device-reprovision.md) 
- To learn more Deprovisioning, see [How to deprovision devices that were previously auto-provisioned ](how-to-unprovision-devices.md) 











