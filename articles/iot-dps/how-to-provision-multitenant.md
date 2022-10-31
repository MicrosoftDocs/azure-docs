---
title: Tutorial - Provision devices for geolatency in Azure IoT Hub Device Provisioning Service
description: This tutorial shows how to provision devices for geolocation/geolatency with your Device Provisioning Service (DPS) instance
author: kgremban
ms.author: kgremban
ms.topic: tutorial
ms.date: 08/24/2022
ms.service: iot-dps
services: iot-dps
---

# Tutorial: Provision for geolatency

This tutorial shows how to securely provision multiple simulated symmetric key devices to a group of IoT Hubs using an [allocation policy](concepts-service.md#allocation-policy). IoT Hub Device Provisioning Service (DPS) supports a variety of allocation scenarios through its built-in allocation policies and its support for custom allocation policies.

Provisioning for **Geolocation/ GeoLatency** is a common allocation scenario. As a device moves between locations, network latency is improved by having the device provisioned to the IoT hub that's closest to each location. In this scenario, a group of IoT hubs, which span across regions, are selected for enrollments. The built-in **Lowest latency** allocation policy is selected for these enrollments. This policy causes the Device Provisioning Service to evaluate device latency and determine the closet IoT hub out of the group of IoT hubs.

This tutorial uses a simulated device sample from the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c) to demonstrate how to provision devices across regions. You'll perform the following steps in this tutorial:

> [!div class="checklist"]
> * Use the Azure CLI to create two regional IoT hubs (**West US 2** and **East US**)
> * Create an enrollment that provisions devices based on geolocation (lowest latency)
> * Use the Azure CLI to create two regional Linux VMs to act as devices in the same regions (**West US 2** and **East US**)
> * Set up the development environment for the Azure IoT C SDK on both Linux VMs
> * Simulate the devices and verify that they're provisioned to the IoT hub in the closest region.

>[!IMPORTANT]
> Some regions may, from time to time, enforce restrictions on the creation of Virtual Machines. At the time of writing this guide, the *westus2* and *eastus* regions permitted the creation of VMs. If you're unable to create in either one of those regions, you can try a different region. To learn more about choosing Azure geographical regions when creating VMs, see [Regions for virtual machines in Azure](../virtual-machines/regions.md)

## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

* Complete the steps in [Set up IoT Hub Device Provisioning Service with the Azure portal](./quick-setup-auto-provision.md).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](../../includes/azure-cli-prepare-your-environment-no-header.md)]

## Create two regional IoT hubs

In this section, you'll create an Azure resource group, and two new regional IoT hub resources. One IoT hub will be for the **West US 2** region and the other will be for the **East US** region.

>[!IMPORTANT]
>It's recommended that you use the same resource group for all resources created in this tutorial. This will make clean up easier after you're finished.

1. In the Azure Cloud Shell, create a resource group with the following [az group create](/cli/azure/group#az-group-create) command:

    ```azurecli-interactive
    az group create --name contoso-us-resource-group --location eastus
    ```

2. Create an IoT hub in the *eastus* location, and add it to the resource group you created with the following [az iot hub create](/cli/azure/iot/hub#az-iot-hub-create) command(replace `{unique-hub-name}` with your own unique name):

    ```azurecli-interactive
    az iot hub create --name {unique-hub-name} --resource-group contoso-us-resource-group --location eastus --sku S1
    ```

    This command may take a few minutes to complete.

3. Now, create an IoT hub in the *westus2* location, and add it to the resource group you created with the following [az iot hub create](/cli/azure/iot/hub#az-iot-hub-create) command(replace `{unique-hub-name}` with your own unique name):

    ```azurecli-interactive
    az iot hub create --name {unique-hub-name} --resource-group contoso-us-resource-group --location westus2 --sku S1
    ```

    This command may take a few minutes to complete.

## Create an enrollment for geolatency

In this section, you'll create a new enrollment group for the your devices.  

For simplicity, this tutorial uses [Symmetric key attestation](concepts-symmetric-key-attestation.md) with the enrollment. For a more secure solution, consider using [X.509 certificate attestation](concepts-x509-attestation.md) with a chain of trust.

1. In the Azure portal, select your Device Provisioning Service.

2. In the **Settings** menu, select **Manage enrollments**.

3. Select **+ Add enrollment group**.

4. On the **Add Enrollment Group** page, enter the following information:

    **Group name**: Enter *contoso-us-devices*. The enrollment group name is a case-insensitive string (up to 128 characters long) of alphanumeric characters plus the special characters: `'-'`, `'.'`, `'_'`, `':'`. The last character must be alphanumeric or dash (`'-'`).

    **Attestation Type**: Select *Symmetric Key*.

    **Auto Generate Keys**: This checkbox should already be checked.

    **Select how you want to assign devices to hubs**: Select *Lowest latency*.

5. Select **Link a new IoT Hub**

    :::image type="content" source="./media/how-to-provision-multitenant/create-multitenant-enrollment.png" alt-text="Add enrollment group for symmetric key attestation and lowest latency.":::

6. On the **Add link to IoT hub** page, enter the following information:

    **Subscription**: If you have multiple subscriptions, choose the subscription where you created the regional IoT hubs.

    **IoT hub**: Select the IoT hub that you created for the *eastus* location.

    **Access Policy**: Select *iothubowner*.

    :::image type="content" source="./media/how-to-provision-multitenant/link-regional-hubs.png" alt-text="Link the regional IoT hubs with the provisioning service.":::

7. Select **Save**.

8. Repeat Steps 5 through 7 for the second IoT hub that you created for the *westgus* location.

9. Select the two IoT Hubs you created in the **Select the IoT hubs this group can be assigned to** drop down.

    :::image type="content" source="./media/how-to-provision-multitenant/enrollment-regional-hub-group.png" alt-text="Select the linked IoT hubs.":::

10. Select **Save**

11. Select *contoso-us-devices* in the enrollment groups list.

12. Copy the *Primary Key*. This key will be used later to generate unique device keys for both simulated devices.

    :::image type="content" source="./media/how-to-provision-multitenant/copy-primary-key.png" alt-text="Copy the primary key.":::

## Create regional Linux VMs

In this section, you'll create two regional Linux virtual machines (VMs). These VMs will run a device simulation sample from each region to demonstrate device provisioning for devices from both regions.

To make clean-up easier, these VMs will be added to the same resource group that contains the IoT hubs that were created, *contoso-us-resource-group*. However, the VMs will run in separate regions (**West US 2** and **East US**).

1. In the Azure Cloud Shell, run the following command to create an **East US** region VM after making the following parameter changes in the command:

    **--name**: Enter a unique name for your **East US** regional device VM.

    **--admin-username**: Use your own admin user name.

    **--admin-password**: Use your own admin password.

    ```azurecli-interactive
    az vm create \
    --resource-group contoso-us-resource-group \
    --name ContosoSimDeviceEast \
    --location eastus \
    --image Canonical:UbuntuServer:18.04-LTS:18.04.201809110 \
    --admin-username contosoadmin \
    --admin-password myContosoPassword2018 \
    --authentication-type password
    --public-ip-sku Standard
    ```

    This command will take a few minutes to complete. 

2. Once the command has completed, copy the **publicIpAddress** value for your East US region VM.

3. In the Azure Cloud Shell, run the command to create a **West US 2** region VM after making the following parameter changes in the command:

    **--name**: Enter a unique name for your **West US 2** regional device VM. 

    **--admin-username**: Use your own admin user name.

    **--admin-password**: Use your own admin password.

    ```azurecli-interactive
    az vm create \
    --resource-group contoso-us-resource-group \
    --name ContosoSimDeviceWest2 \
    --location westus2 \
    --image Canonical:UbuntuServer:18.04-LTS:18.04.201809110 \
    --admin-username contosoadmin \
    --admin-password myContosoPassword2018 \
    --authentication-type password
    --public-ip-sku Standard
    ```

    This command will take a few minutes to complete.

4. Once the command has completed, copy the **publicIpAddress** value for your West US 2 region VM.

5. Open two command-line shells.

6. Connect to one of the regional VMs in each shell using SSH.

    Pass your admin username and the public IP address that you copied as parameters to SSH. Enter the admin password when prompted.

    ```bash
    ssh contosoadmin@1.2.3.4

    contosoadmin@ContosoSimDeviceEast:~$
    ```

    ```bash
    ssh contosoadmin@5.6.7.8

    contosoadmin@ContosoSimDeviceWest:~$
    ```

## Prepare the Azure IoT C SDK development environment

In this section, you'll clone the Azure IoT C SDK on each VM. The SDK contains a sample that simulates a device provisioning from each region.

For each VM:

1. Install **CMake**, **g++**, **gcc**, and [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) using the following commands:

    ```bash
    sudo apt-get update
    sudo apt-get install cmake build-essential libssl-dev libcurl4-openssl-dev uuid-dev git-all
    ```

2. Find and copy the tag name for the [latest release](https://github.com/Azure/azure-iot-sdk-c/releases/latest) of the SDK.

3. Clone the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c) on both VMs.  Use the tag you found in the previous step as the value for the `-b` parameter:

    ```bash
    git clone -b <release-tag> https://github.com/Azure/azure-iot-sdk-c.git
    cd azure-iot-sdk-c
    git submodule update --init
    ```

    You should expect this operation to take several minutes to complete.

4. Create a new **cmake** folder inside the repository and change to that folder.

    ```bash
    mkdir ~/azure-iot-sdk-c/cmake
    cd ~/azure-iot-sdk-c/cmake
    ```

5. Run the following command, which builds a version of the SDK specific to your development client platform:

    ```bash
    cmake -Dhsm_type_symm_key:BOOL=ON -Duse_prov_client:BOOL=ON  ..
    ```

6. Once the build succeeds, the last few output lines will look similar to the following output:

    ```bash
    -- IoT Client SDK Version = 1.7.0
    -- Provisioning SDK Version = 1.7.0
    -- Looking for include file stdint.h
    -- Looking for include file stdint.h - found
    -- Looking for include file stdbool.h
    -- Looking for include file stdbool.h - found
    -- target architecture: x86_64
    -- Performing Test CXX_FLAG_CXX11
    -- Performing Test CXX_FLAG_CXX11 - Success
    -- Found OpenSSL: /usr/lib/x86_64-linux-gnu/libcrypto.so (found version "1.1.1")
    -- Found CURL: /usr/lib/x86_64-linux-gnu/libcurl.so (found version "7.58.0")
    -- Found CURL: /usr/lib/x86_64-linux-gnu/libcurl.so
    -- target architecture: x86_64
    -- iothub architecture: x86_64
    -- Configuring done
    -- Generating done
    -- Build files have been written to: /home/contosoadmin/azure-iot-sdk-c/azure-iot-sdk-c
    ```

## Derive unique device keys

When using symmetric key attestation with group enrollments, you don't use the enrollment group keys directly. Instead, you derive a unique key from the enrollment group key for each device. For more information, see [Group Enrollments with symmetric keys](concepts-symmetric-key-attestation.md#group-enrollments).

In this part of the tutorial, you'll generate a device key from the you group master key to compute an [HMAC-SHA256](https://wikipedia.org/wiki/HMAC) of the unique registration ID for the device. The result will then be converted into Base64 format.

>[!IMPORTANT]
>Don't include your group master key in your device code.

For **both** *eastus* and *westus 2* devices:

1. Generate your unique key using **openssl**. You'll use the following Bash shell script (replace `{primary-key}` with the enrollment group's **Primary Key** that you copied earlier and replace `{contoso-simdevice}`with your own unique registration ID for each device. The registration ID is a case-insensitive string (up to 128 characters long) of alphanumeric characters plus the special characters: `'-'`, `'.'`, `'_'`, `':'`. The last character must be alphanumeric or dash (`'-'`).

    ```bash
    KEY={primary-key}
    REG_ID={contoso-simdevice}
    
    keybytes=$(echo $KEY | base64 --decode | xxd -p -u -c 1000)
    echo -n $REG_ID | openssl sha256 -mac HMAC -macopt hexkey:$keybytes -binary | base64
    ```

2. The script will output something like the following key:

    ```bash
    p3w2DQr9WqEGBLUSlFi1jPQ7UWQL4siAGy75HFTFbf8=
    ```

3. Now each device has its own derived device key and unique registration ID to perform symmetric key attestation with the enrollment group during the provisioning process.

## Simulate the devices from each region

In this section, you'll update a provisioning sample in the Azure IoT C SDK for both of the regional VMs. 

The sample code simulates a device boot sequence that sends the provisioning request to your Device Provisioning Service instance. The boot sequence causes the device to be recognized and assigned to the IoT hub that is closest based on latency.

1. In the Azure portal, select the **Overview** tab for your Device Provisioning Service and note down the **_ID Scope_** value.

    :::image type="content" source="./media/how-to-provision-multitenant/copy-id-scope.png" alt-text="Extract Device Provisioning Service endpoint information from the portal blade.":::

2. On both VMS, open **~/azure-iot-sdk-c/provisioning\_client/samples/prov\_dev\_client\_sample/prov\_dev\_client\_sample.c** for editing.

    ```bash
    vi ~/azure-iot-sdk-c/provisioning_client/samples/prov_dev_client_sample/prov_dev_client_sample.c
    ```

3. On both VMs, find the `id_scope` constant, and replace the value with your **ID Scope** value that you copied earlier. 

    ```c
    static const char* id_scope = "0ne00002193";
    ```

4. On both VMs, find the definition for the `main()` function in the same file. Make sure the `hsm_type` variable is set to `SECURE_DEVICE_TYPE_SYMMETRIC_KEY` as shown below to match the enrollment group attestation method. 

    Save your changes to the files on both VMs.

    ```c
    SECURE_DEVICE_TYPE hsm_type;
    //hsm_type = SECURE_DEVICE_TYPE_TPM;
    //hsm_type = SECURE_DEVICE_TYPE_X509;
    hsm_type = SECURE_DEVICE_TYPE_SYMMETRIC_KEY;
    ```

5. On both VMs, find the call to `prov_dev_set_symmetric_key_info()` in **prov\_dev\_client\_sample.c** which is commented out.

    ```c
    // Set the symmetric key if using they auth type
    //prov_dev_set_symmetric_key_info("<symm_registration_id>", "<symmetric_Key>");
    ```

    Uncomment the function calls, and replace the placeholder values (including the angle brackets) with the unique registration IDs and derived device keys for each device that you derived in the previous section. The keys shown below are for example purposes only. Use the keys you generated earlier.

    East US:
    ```c
    // Set the symmetric key if using they auth type
    prov_dev_set_symmetric_key_info("contoso-simdevice-east", "p3w2DQr9WqEGBLUSlFi1jPQ7UWQL4siAGy75HFTFbf8=");
    ```

    West US:
    ```c
    // Set the symmetric key if using they auth type
    prov_dev_set_symmetric_key_info("contoso-simdevice-west", "J5n4NY2GiBYy7Mp4lDDa5CbEe6zDU/c62rhjCuFWxnc=");
    ```

6. On both VMs, save the file.

7. On both VMs, navigate to the sample folder shown below, and build the sample.

    ```bash
    cd ~/azure-iot-sdk-c/cmake/provisioning_client/samples/prov_dev_client_sample/
    cmake --build . --target prov_dev_client_sample --config Debug
    ```

8. Once the build succeeds, run **prov\_dev\_client\_sample.exe** on both VMs to simulate a device from each region. Notice that each device is allocated to the IoT hub closest to the simulated device's region.

    Run the simulation:
    ```bash
    ~/azure-iot-sdk-c/cmake/provisioning_client/samples/prov_dev_client_sample/prov_dev_client_sample
    ```

    Example output from the East US VM:

    ```bash
    contosoadmin@ContosoSimDeviceEast:~/azure-iot-sdk-c/cmake/provisioning_client/samples/prov_dev_client_sample$ ./prov_dev_client_sample
    Provisioning API Version: 1.2.9

    Registering Device

    Provisioning Status: PROV_DEVICE_REG_STATUS_CONNECTED
    Provisioning Status: PROV_DEVICE_REG_STATUS_ASSIGNING
    Provisioning Status: PROV_DEVICE_REG_STATUS_ASSIGNING

    Registration Information received from service: contoso-east-hub.azure-devices.net, deviceId: contoso-simdevice-east
    Press enter key to exit:

    ```

    Example output from the West US VM:
    ```bash
    contosoadmin@ContosoSimDeviceWest:~/azure-iot-sdk-c/cmake/provisioning_client/samples/prov_dev_client_sample$ ./prov_dev_client_sample
    Provisioning API Version: 1.2.9

    Registering Device

    Provisioning Status: PROV_DEVICE_REG_STATUS_CONNECTED
    Provisioning Status: PROV_DEVICE_REG_STATUS_ASSIGNING
    Provisioning Status: PROV_DEVICE_REG_STATUS_ASSIGNING

    Registration Information received from service: contoso-west-hub.azure-devices.net, deviceId: contoso-simdevice-west
    Press enter key to exit:
    ```

## Clean up resources

If you plan to continue working with resources created in this tutorial, you can leave them. Otherwise, use the following steps to delete all resources created by this tutorial to avoid unnecessary charges.

The steps here assume that you created all resources in this tutorial as instructed in the same resource group named **contoso-us-resource-group**.

> [!IMPORTANT]
> Deleting a resource group is irreversible. The resource group and all the resources contained in it are permanently deleted. Make sure that you don't accidentally delete the wrong resource group or resources. If you created the IoT Hub inside an existing resource group that contains resources you want to keep, only delete the IoT Hub resource itself instead of deleting the resource group.
>

To delete the resource group by name:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Select **Resource groups**.

3. In the **Filter by name...** textbox, type the name of the resource group containing your resources, **contoso-us-resource-group**.

4. To the right of your resource group in the result list, click **...** then **Delete resource group**.

5. You'll be asked to confirm the deletion of the resource group. Type the name of your resource group again to confirm, and then select **Delete**. After a few moments, the resource group and all of its contained resources are deleted.

## Next steps

* To learn more about reprovisioning, see:

> [!div class="nextstepaction"]
> [IoT Hub Device reprovisioning concepts](concepts-device-reprovision.md)

* To learn more about deprovisioning, see
> [!div class="nextstepaction"]
> [How to deprovision devices that were previously auto-provisioned](how-to-unprovision-devices.md)
