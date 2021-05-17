---
title: Quickstart create an Azure IoT Edge device on Linux | Microsoft Docs 
description: In this quickstart, learn how to create an IoT Edge device on Linux and then deploy prebuilt code remotely from the Azure portal. 
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 04/07/2021
ms.topic: quickstart
ms.service: iot-edge
services: iot-edge
ms.custom: mvc, devx-track-azurecli
---

# Quickstart: Deploy your first IoT Edge module to a virtual Linux device

[!INCLUDE [iot-edge-version-201806-or-202011](../../includes/iot-edge-version-201806-or-202011.md)]

Test out Azure IoT Edge in this quickstart by deploying containerized code to a virtual Linux IoT Edge device. IoT Edge allows you to remotely manage code on your devices so that you can send more of your workloads to the edge. For this quickstart, we recommend using an Azure virtual machine for your IoT Edge device, which allows you to quickly create a test machine and then delete it when you're finished.

In this quickstart you learn how to:

* Create an IoT Hub.
* Register an IoT Edge device to your IoT hub.
* Install and start the IoT Edge runtime on a virtual device.
* Remotely deploy a module to an IoT Edge device.

![Diagram - Quickstart architecture for device and cloud](./media/quickstart-linux/install-edge-full.png)

This quickstart walks you through creating a Linux virtual machine that's configured to be an IoT Edge device. Then, you deploy a module from the Azure portal to your device. The module used in this quickstart is a simulated sensor that generates temperature, humidity, and pressure data. The other Azure IoT Edge tutorials build upon the work you do here by deploying additional modules that analyze the simulated data for business insights.

If you don't have an active Azure subscription, create a [free account](https://azure.microsoft.com/free) before you begin.

## Prerequisites

Prepare your environment for the Azure CLI.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](../../includes/azure-cli-prepare-your-environment-no-header.md)]

Cloud resources:

* A resource group to manage all the resources you use in this quickstart. We use the example resource group name **IoTEdgeResources** throughout this quickstart and the following tutorials.

   ```azurecli-interactive
   az group create --name IoTEdgeResources --location westus2
   ```

## Create an IoT hub

Start the quickstart by creating an IoT hub with Azure CLI.

![Diagram - Create an IoT hub in the cloud](./media/quickstart-linux/create-iot-hub.png)

The free level of IoT Hub works for this quickstart. If you've used IoT Hub in the past and already have a hub created, you can use that IoT hub.

The following code creates a free **F1** hub in the resource group **IoTEdgeResources**. Replace `{hub_name}` with a unique name for your IoT hub. It might take a few minutes to create an IoT Hub.

   ```azurecli-interactive
   az iot hub create --resource-group IoTEdgeResources --name {hub_name} --sku F1 --partition-count 2
   ```

   If you get an error because there's already one free hub in your subscription, change the SKU to **S1**. Each subscription can only have one free IoT hub. If you get an error that the IoT Hub name isn't available, it means that someone else already has a hub with that name. Try a new name.

## Register an IoT Edge device

Register an IoT Edge device with your newly created IoT hub.

![Diagram - Register a device with an IoT Hub identity](./media/quickstart-linux/register-device.png)

Create a device identity for your IoT Edge device so that it can communicate with your IoT hub. The device identity lives in the cloud, and you use a unique device connection string to associate a physical device to a device identity.

Since IoT Edge devices behave and can be managed differently than typical IoT devices, declare this identity to be for an IoT Edge device with the `--edge-enabled` flag.

1. In the Azure Cloud Shell, enter the following command to create a device named **myEdgeDevice** in your hub.

   ```azurecli-interactive
   az iot hub device-identity create --device-id myEdgeDevice --edge-enabled --hub-name {hub_name}
   ```

   If you get an error about iothubowner policy keys, make sure that your Cloud Shell is running the latest version of the azure-iot extension.

2. View the connection string for your device, which links your physical device with its identity in IoT Hub. It contains the name of your IoT hub, the name of your device, and then a shared key that authenticates connections between the two. We'll refer to this connection string again in the next section when you set up your IoT Edge device.

   ```azurecli-interactive
   az iot hub device-identity connection-string show --device-id myEdgeDevice --hub-name {hub_name}
   ```

   ![View connection string from CLI output](./media/quickstart/retrieve-connection-string.png)

## Configure your IoT Edge device

Create a virtual machine with the Azure IoT Edge runtime on it.

![Diagram - Start the runtime on device](./media/quickstart-linux/start-runtime.png)

The IoT Edge runtime is deployed on all IoT Edge devices. It has three components. The *IoT Edge security daemon* starts each time an IoT Edge device boots and bootstraps the device by starting the IoT Edge agent. The *IoT Edge agent* facilitates deployment and monitoring of modules on the IoT Edge device, including the IoT Edge hub. The *IoT Edge hub* manages communications between modules on the IoT Edge device, and between the device and IoT Hub.

During the runtime configuration, you provide a device connection string. This is the string that you retrieved from the Azure CLI. This string associates your physical device with the IoT Edge device identity in Azure.

### Deploy the IoT Edge device

This section uses an Azure Resource Manager template to create a new virtual machine and install the IoT Edge runtime on it. If you want to use your own Linux device instead, you can follow the installation steps in [Install the Azure IoT Edge runtime](how-to-install-iot-edge.md), then return to this quickstart.

<!-- 1.1 -->
:::moniker range="iotedge-2018-06"

Use the following CLI command to create your IoT Edge device based on the prebuilt [iotedge-vm-deploy](https://github.com/Azure/iotedge-vm-deploy) template.

* For bash or Cloud Shell users, copy the following command into a text editor, replace the placeholder text with your information, then copy into your bash or Cloud Shell window:

   ```azurecli-interactive
   az deployment group create \
   --resource-group IoTEdgeResources \
   --template-uri "https://aka.ms/iotedge-vm-deploy" \
   --parameters dnsLabelPrefix='<REPLACE_WITH_VM_NAME>' \
   --parameters adminUsername='azureUser' \
   --parameters deviceConnectionString=$(az iot hub device-identity connection-string show --device-id myEdgeDevice --hub-name <REPLACE_WITH_HUB_NAME> -o tsv) \
   --parameters authenticationType='password' \
   --parameters adminPasswordOrKey="<REPLACE_WITH_PASSWORD>"
   ```

* For PowerShell users, copy the following command into your PowerShell window, then replace the placeholder text with your own information:

   ```azurecli
   az deployment group create `
   --resource-group IoTEdgeResources `
   --template-uri "https://aka.ms/iotedge-vm-deploy" `
   --parameters dnsLabelPrefix='<REPLACE_WITH_VM_NAME>' `
   --parameters adminUsername='azureUser' `
   --parameters deviceConnectionString=$(az iot hub device-identity connection-string show --device-id myEdgeDevice --hub-name <REPLACE_WITH_HUB_NAME> -o tsv) `
   --parameters authenticationType='password' `
   --parameters adminPasswordOrKey="<REPLACE_WITH_PASSWORD>"
   ```

:::moniker-end
<!-- end 1.1 -->

<!-- 1.2 -->
:::moniker range=">=iotedge-2020-11"

Use the following CLI command to create your IoT Edge device based on the prebuilt [iotedge-vm-deploy](https://github.com/Azure/iotedge-vm-deploy/tree/1.2.0) template.

* For bash or Cloud Shell users, copy the following command into a text editor, replace the placeholder text with your information, then copy into your bash or Cloud Shell window:

   ```azurecli-interactive
   az deployment group create \
   --resource-group IoTEdgeResources \
   --template-uri "https://raw.githubusercontent.com/Azure/iotedge-vm-deploy/1.2.0/edgeDeploy.json" \
   --parameters dnsLabelPrefix='<REPLACE_WITH_VM_NAME>' \
   --parameters adminUsername='azureUser' \
   --parameters deviceConnectionString=$(az iot hub device-identity connection-string show --device-id myEdgeDevice --hub-name <REPLACE_WITH_HUB_NAME> -o tsv) \
   --parameters authenticationType='password' \
   --parameters adminPasswordOrKey="<REPLACE_WITH_PASSWORD>"
   ```

* For PowerShell users, copy the following command into your PowerShell window, then replace the placeholder text with your own information:

   ```azurecli
   az deployment group create `
   --resource-group IoTEdgeResources `
   --template-uri "https://raw.githubusercontent.com/Azure/iotedge-vm-deploy/1.2.0/edgeDeploy.json" `
   --parameters dnsLabelPrefix='<REPLACE_WITH_VM_NAME>' `
   --parameters adminUsername='azureUser' `
   --parameters deviceConnectionString=$(az iot hub device-identity connection-string show --device-id myEdgeDevice --hub-name <REPLACE_WITH_HUB_NAME> -o tsv) `
   --parameters authenticationType='password' `
   --parameters adminPasswordOrKey="<REPLACE_WITH_PASSWORD>"
   ```
:::moniker-end
<!-- end 1.2 -->

This template takes the following parameters:

| Parameter | Description |
| --------- | ----------- |
| **resource-group** | The resource group in which the resources will be created. Use the default **IoTEdgeResources** that we've been using throughout this article or provide the name of an existing resource group in your subscription. |
| **template-uri** | A pointer to the Resource Manager template that we're using. |
| **dnsLabelPrefix** | A string that will be used to create the virtual machine's hostname. Replace the placeholder text with a name for your virtual machine. |
| **adminUsername** | A username for the admin account of the virtual machine. Use the example **azureUser** or provide a new username. |
| **deviceConnectionString** | The connection string from the device identity in IoT Hub, which is used to configure the IoT Edge runtime on the virtual machine. The CLI command within this parameter grabs the connection string for you. Replace the placeholder text with your IoT hub name. |
| **authenticationType** | The authentication method for the admin account. This quickstart uses **password** authentication, but you can also set this parameter to **sshPublicKey**. |
| **adminPasswordOrKey** | The password or value of the SSH key for the admin account. Replace the placeholder text with a secure password. Your password must be at least 12 characters long and have three of four of the following: lowercase characters, uppercase characters, digits, and special characters. |

Once the deployment is complete, you should receive JSON-formatted output in the CLI that contains the SSH information to connect to the virtual machine. Copy the value of the **public SSH** entry of the **outputs** section:

   ![Retrieve public ssh value from output](./media/quickstart-linux/outputs-public-ssh.png)

### View the IoT Edge runtime status

The rest of the commands in this quickstart take place on your IoT Edge device itself, so that you can see what's happening on the device. If you're using a virtual machine, connect to that machine now using the admin username that you set up and the DNS name that was output by the deployment command. You can also find the DNS name on your virtual machine's overview page in the Azure portal. Use the following command to connect to your virtual machine. Replace `{admin username}` and `{DNS name}` with your own values.

   ```console
   ssh {admin username}@{DNS name}
   ```

Once connected to your virtual machine, verify that the runtime was successfully installed and configured on your IoT Edge device.

<!--1.1 -->
:::moniker range="iotedge-2018-06"

1. Check to see that the IoT Edge security daemon is running as a system service.

   ```bash
   sudo systemctl status iotedge
   ```

   ![See the IoT Edge daemon running as a system service](./media/quickstart-linux/iotedged-running.png)

   >[!TIP]
   >You need elevated privileges to run `iotedge` commands. Once you sign out of your machine and sign back in the first time after installing the IoT Edge runtime, your permissions are automatically updated. Until then, use `sudo` in front of the commands.

2. If you need to troubleshoot the service, retrieve the service logs.

   ```bash
   journalctl -u iotedge
   ```

3. View all the modules running on your IoT Edge device. Since the service just started for the first time, you should only see the **edgeAgent** module running. The edgeAgent module runs by default and helps to install and start any additional modules that you deploy to your device.

   ```bash
   sudo iotedge list
   ```

   ![View one module on your device](./media/quickstart-linux/iotedge-list-1.png)
:::moniker-end
<!-- end 1.1 -->

<!-- 1.2 -->
:::moniker range=">=iotedge-2020-11"

1. Check to see that IoT Edge is running. The following command should return a status of **Ok** if IoT Edge is running, or provide any service errors.

   ```bash
   sudo iotedge system status
   ```

   >[!TIP]
   >You need elevated privileges to run `iotedge` commands. Once you sign out of your machine and sign back in the first time after installing the IoT Edge runtime, your permissions are automatically updated. Until then, use `sudo` in front of the commands.

2. If you need to troubleshoot the service, retrieve the service logs.

   ```bash
   sudo iotedge system logs
   ```

3. View all the modules running on your IoT Edge device. Since the service just started for the first time, you should only see the **edgeAgent** module running. The edgeAgent module runs by default and helps to install and start any additional modules that you deploy to your device.

   ```bash
   sudo iotedge list
   ```

:::moniker-end
<!-- end 1.2 -->

Your IoT Edge device is now configured. It's ready to run cloud-deployed modules.

## Deploy a module

Manage your Azure IoT Edge device from the cloud to deploy a module that will send telemetry data to IoT Hub.

![Diagram - deploy module from cloud to device](./media/quickstart-linux/deploy-module.png)

<!-- [!INCLUDE [iot-edge-deploy-module](../../includes/iot-edge-deploy-module.md)]

Include content included below to support versioned steps in Linux quickstart. Can update include file once Windows quickstart supports v1.2 -->

One of the key capabilities of Azure IoT Edge is deploying code to your IoT Edge devices from the cloud. *IoT Edge modules* are executable packages implemented as containers. In this section, you'll deploy a pre-built module from the [IoT Edge Modules section of Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/internet-of-things?page=1&subcategories=iot-edge-modules) directly from Azure IoT Hub.

The module that you deploy in this section simulates a sensor and sends generated data. This module is a useful piece of code when you're getting started with IoT Edge because you can use the simulated data for development and testing. If you want to see exactly what this module does, you can view the [simulated temperature sensor source code](https://github.com/Azure/iotedge/blob/027a509549a248647ed41ca7fe1dc508771c8123/edge-modules/SimulatedTemperatureSensor/src/Program.cs).

Follow these steps to start the **Set Modules** wizard to deploy your first module from Azure Marketplace.

1. Sign in to the [Azure portal](https://portal.azure.com) and go to your IoT hub.

1. From the menu on the left, under **Automatic Device Management**, select **IoT Edge**.

1. Select the device ID of the target device from the list of devices.

1. On the upper bar, select **Set Modules**.

   ![Screenshot that shows selecting Set Modules.](./media/quickstart/select-set-modules.png)

### Modules

The first step of the wizard is to choose which modules you want to run on your device.

Under **IoT Edge Modules**, open the **Add** drop-down menu, and then select **Marketplace Module**.

   ![Screenshot that shows the Add drop-down menu.](./media/quickstart/add-marketplace-module.png)

In **IoT Edge Module Marketplace**, search for and select the `Simulated Temperature Sensor` module. The module is added to the IoT Edge Modules section with the desired **running** status.

<!-- 1.2 -->
:::moniker range=">=iotedge-2020-11"

Select **Runtime Settings** to open the settings for the edgeHub and edgeAgent modules. This settings section is where you can manage the runtime modules by adding environment variables or changing the create options.

Update the **Image** field for both the edgeHub and edgeAgent modules to use the version tag 1.2. For example:

* `mcr.microsoft.com/azureiotedge-hub:1.2`
* `mcr.microsoft.com/azureiotedge-agent:1.2`

Select **Save** to apply your changes to the runtime modules.

:::moniker-end
<!--end 1.2-->

Select **Next: Routes** to continue to the next step of the wizard.

   ![Screenshot that shows continuing to the next step after the module is added.](./media/quickstart/view-temperature-sensor-next-routes.png)

### Routes

On the **Routes** tab, remove the default route, **route**, and then select **Next: Review + create** to continue to the next step of the wizard.

   >[!Note]
   >Routes are constructed by using name and value pairs. You should see two routes on this page. The default route, **route**, sends all messages to IoT Hub (which is called `$upstream`). A second route, **SimulatedTemperatureSensorToIoTHub**, was created automatically when you added the module from Azure Marketplace. This route sends all messages from the simulated temperature module to IoT Hub. You can delete the default route because it's redundant in this case.

   ![Screenshot that shows removing the default route then moving to the next step.](./media/quickstart/delete-route-next-review-create.png)

### Review and create

Review the JSON file, and then select **Create**. The JSON file defines all of the modules that you deploy to your IoT Edge device. You'll see the **SimulatedTemperatureSensor** module and the two runtime modules, **edgeAgent** and **edgeHub**.

   >[!Note]
   >When you submit a new deployment to an IoT Edge device, nothing is pushed to your device. Instead, the device queries IoT Hub regularly for any new instructions. If the device finds an updated deployment manifest, it uses the information about the new deployment to pull the module images from the cloud then starts running the modules locally. This process can take a few minutes.

After you create the module deployment details, the wizard returns you to the device details page. View the deployment status on the **Modules** tab.

You should see three modules: **$edgeAgent**, **$edgeHub**, and **SimulatedTemperatureSensor**. If one or more of the modules has **YES** under **SPECIFIED IN DEPLOYMENT** but not under **REPORTED BY DEVICE**, your IoT Edge device is still starting them. Wait a few minutes, and then refresh the page.

   ![Screenshot that shows Simulated Temperature Sensor in the list of deployed modules.](./media/quickstart/view-deployed-modules.png)

## View generated data

In this quickstart, you created a new IoT Edge device and installed the IoT Edge runtime on it. Then, you used the Azure portal to deploy an IoT Edge module to run on the device without having to make changes to the device itself.

In this case, the module that you pushed generates sample environment data that you can use for testing later. The simulated sensor is monitoring both a machine and the environment around the machine. For example, this sensor might be in a server room, on a factory floor, or on a wind turbine. The message includes ambient temperature and humidity, machine temperature and pressure, and a timestamp. The IoT Edge tutorials use the data created by this module as test data for analytics.

Open the command prompt on your IoT Edge device again, or use the SSH connection from Azure CLI. Confirm that the module deployed from the cloud is running on your IoT Edge device:

   ```bash
   sudo iotedge list
   ```

<!-- 1.1 -->
:::moniker range="iotedge-2018-06"
   ![View three modules on your device](./media/quickstart-linux/iotedge-list-2-version-201806.png)
:::moniker-end

<!-- 1.2 -->
:::moniker range=">=iotedge-2020-11"
   ![View three modules on your device](./media/quickstart-linux/iotedge-list-2-version-202011.png)
:::moniker-end

View the messages being sent from the temperature sensor module:

   ```bash
   sudo iotedge logs SimulatedTemperatureSensor -f
   ```

   >[!TIP]
   >IoT Edge commands are case-sensitive when referring to module names.

   ![View the data from your module](./media/quickstart-linux/iotedge-logs.png)

You can also watch the messages arrive at your IoT hub by using the [Azure IoT Hub extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit).

## Clean up resources

If you want to continue on to the IoT Edge tutorials, you can use the device that you registered and set up in this quickstart. Otherwise, you can delete the Azure resources that you created to avoid charges.

If you created your virtual machine and IoT hub in a new resource group, you can delete that group and all the associated resources. Double check the contents of the resource group to make sure that there's nothing you want to keep. If you don't want to delete the whole group, you can delete individual resources instead.

> [!IMPORTANT]
> Deleting a resource group is irreversible.

Remove the **IoTEdgeResources** group. It might take a few minutes to delete a resource group.

```azurecli-interactive
az group delete --name IoTEdgeResources --yes
```

You can confirm the resource group is removed by viewing the list of resource groups.

```azurecli-interactive
az group list
```

## Next steps

In this quickstart, you created an IoT Edge device and used the Azure IoT Edge cloud interface to deploy code onto the device. Now, you have a test device generating raw data about its environment.

The next step is to set up your local development environment so that you can start creating IoT Edge modules that run your business logic.

> [!div class="nextstepaction"]
> [Start developing IoT Edge modules for Linux devices](tutorial-develop-for-linux.md)
