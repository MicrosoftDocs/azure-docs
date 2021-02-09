---
title: Quickstart create an Azure IoT Edge device on Windows | Microsoft Docs
description: In this quickstart, learn how to create an IoT Edge device and then deploy prebuilt code remotely from the Azure portal.
author: rsameser
manager: kgremban
ms.author: riameser
ms.date: 01/20/2021
ms.topic: quickstart
ms.service: iot-edge
services: iot-edge
ms.custom: mvc, devx-track-azurecli
monikerRange: "=iotedge-2018-06"
---

# Quickstart: Deploy your first IoT Edge module to a Windows device (Preview)

Try out Azure IoT Edge in this quickstart by deploying containerized code to a Linux on Windows IoT Edge device. IoT Edge allows you to remotely manage code on your devices so that you can send more of your workloads to the edge. For this quickstart, we recommend using your own device to see how easy it is to use Azure IoT Edge for Linux on Windows.

In this quickstart you learn how to:

* Create an IoT hub.
* Register an IoT Edge device to your IoT hub.
* Install and start the IoT Edge for Linux on Windows runtime on your device.
* Remotely deploy a module to an IoT Edge device and send telemetry.

![Diagram - Quickstart architecture for device and cloud](./media/quickstart/install-edge-full.png)

This quickstart walks you through how to set up your Azure IoT Edge for Linux on Windows device. Then, you deploy a module from the Azure portal to your device. The module used in this quickstart is a simulated sensor that generates temperature, humidity, and pressure data. The other Azure IoT Edge tutorials build upon the work you do here by deploying additional modules that analyze the simulated data for business insights.

If you don't have an active Azure subscription, create a [free account](https://azure.microsoft.com/free) before you begin.

>[!NOTE]
>IoT Edge for Linux on Windows is in [public preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

Prepare your environment for the Azure CLI.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](../../includes/azure-cli-prepare-your-environment-no-header.md)]

Cloud resources:

* A resource group to manage all the resources you use in this quickstart.

   ```azurecli-interactive
   az group create --name IoTEdgeResources --location westus2
   ```

IoT Edge device:

* Your device needs to be a Windows PC or server, version 1809 or later
* At least 4 GB of memory, recommended 8 GB of memory
* 10 GB of free disk space

>[!NOTE]
>This quickstart uses Windows Admin Center to create a deployment of IoT Edge for Linux on Windows. You can also use PowerShell. If you wish to use PowerShell to create your deployment, follow the steps in the how-to guide on [installing and provisioning Azure IoT Edge for Linux on a Windows device](how-to-install-iot-edge-on-windows.md).

## Create an IoT hub

Start the quickstart by creating an IoT hub with Azure CLI.

![Diagram - Create an IoT hub in the cloud](./media/quickstart/create-iot-hub.png)

The free level of IoT Hub works for this quickstart. If you've used IoT Hub in the past and already have a hub created, you can use that IoT hub.

The following code creates a free **F1** hub in the resource group `IoTEdgeResources`. Replace `{hub_name}` with a unique name for your IoT hub. It might take a few minutes to create an IoT Hub.

   ```azurecli-interactive
   az iot hub create --resource-group IoTEdgeResources --name {hub_name} --sku F1 --partition-count 2
   ```

   If you get an error because there's already one free hub in your subscription, change the SKU to **S1**. If you get an error that the IoT Hub name isn't available, it means that someone else already has a hub with that name. Try a new name.

## Register an IoT Edge device

Register an IoT Edge device with your newly created IoT hub.

![Diagram - Register a device with an IoT Hub identity](./media/quickstart/register-device.png)

Create a device identity for your simulated device so that it can communicate with your IoT hub. The device identity lives in the cloud, and you use a unique device connection string to associate a physical device to a device identity.

Since IoT Edge devices behave and can be managed differently than typical IoT devices, declare this identity to be for an IoT Edge device with the `--edge-enabled` flag.

1. In the Azure Cloud Shell, enter the following command to create a device named **myEdgeDevice** in your hub.

   ```azurecli-interactive
   az iot hub device-identity create --device-id myEdgeDevice --edge-enabled --hub-name {hub_name}
   ```

   If you get an error about iothubowner policy keys, make sure that your Cloud Shell is running the latest version of the azure-iot extension.

2. View the connection string for your device, which links your physical device with its identity in IoT Hub. It contains the name of your IoT hub, the name of your device, and then a shared key that authenticates connections between the two.

   ```azurecli-interactive
   az iot hub device-identity connection-string show --device-id myEdgeDevice --hub-name {hub_name}
   ```

3. Copy the value of the `connectionString` key from the JSON output and save it. This value is the device connection string. You'll use this connection string to configure the IoT Edge runtime in the next section.

   ![Retrieve connection string from CLI output](./media/quickstart/retrieve-connection-string.png)

## Install and start the IoT Edge runtime

Install IoT Edge for Linux on Windows on your device, and configure it with a device connection string.

![Diagram - Start the IoT Edge runtime on device](./media/quickstart/start-runtime.png)

1. [Download Windows Admin Center](https://aka.ms/WACDownloadEFLOW).

1. Follow the installation wizard to set up Windows Admin Center on your device.

1. Once you are in Windows Admin Center, on the top right of the screen, select the **Settings Gear Icon**

1. From the settings menu, under Gateway, select **Extensions**

1. Select the **Feeds** tab and select **Add**.

1. Enter https://aka.ms/wac-insiders-feed into the text box and select **Add**.

1. After the feed has been added, navigate to the **Available extensions** tab. It may take a moment to update the extensions list.

1. From the list of **Available extensions** select **Azure IoT Edge**

1. **Install** the extension

1. Once the extension has been installed navigate to the main dashboard page by selecting **Windows Admin Center** on top left hand corner your screen.

1. You will see the local host connection representing the PC where you are running Windows Admin Center.

   :::image type="content" source="media/quickstart/windows-admin-center-start-page.png" alt-text="Screenshot - Windows Admin Start Page":::

1. Select **Add**.

   :::image type="content" source="media/quickstart/windows-admin-center-start-page-add.png" alt-text="Screenshot - Windows Admin Start Page Add Button":::

1. Locate the Azure IoT Edge tile, and select **Create new**. This will start the installation wizard.

    :::image type="content" source="media/quickstart/select-tile-screen.png" alt-text="Screenshot - Azure IoT Edge For Linux on Windows Tile":::

1. Proceed through the installation wizard to accept the EULA and choose **Next**

    :::image type="content" source="media/quickstart/wizard-welcome-screen.png" alt-text="Screenshot - Wizard Welcome":::

1. Choose the **Optional diagnostic data** to provide extended diagnostics data which helps Microsoft monitor and maintain quality of service, and click **Next: Deploy**

    :::image type="content" source="media/quickstart/diagnostic-data-screen.png" alt-text="Screenshot - Diagnostic Data":::

1. On the **Select target device** screen, select your desired target device to validate that it meets the minimum requirements. For this quickstart, we're installing IoT Edge on the local device, so choose the localhost connection. Once confirmed, choose **Next** to continue

    :::image type="content" source="media/quickstart/wizard-select-target-device-screen.png" alt-text="Screenshot - Select Target Device":::

1. ​Accept the default settings by choosing **Next**.

1. The deployment screen shows the process of downloading the package, installing the package, configuring the host and final setting up the Linux VM​.  A successful deployment will look as follows:

    :::image type="content" source="media/quickstart/wizard-deploy-success-screen.png" alt-text="Screenshot - Wizard Deploy Success":::

1. Click **Next: Connect** to continue to the final step to provision your Azure IoT Edge device with its device ID from your IoT hub instance.

1. Copy the connection string from your device in Azure IoT Hub and paste it into the device connection string field. Then choose **Provisioning with the selected method**​.

    > [!NOTE]
    > Refer to step 3 in the previous section, [Register an IoT Edge device](#register-an-iot-edge-device), to retrieve your connection string.

    :::image type="content" source="media/quickstart/wizard-provision.png" alt-text="Screenshot - Wizard Provisioning":::

1. Once provisioning is complete, select **Finish** to complete and return to the Windows Admin Center start screen. You should now be able to see your device listed as an IoT Edge Device.

    :::image type="content" source="media/quickstart/windows-admin-center-device-screen.png" alt-text="Screenshot - Windows Admin Center Azure IoT Edge Device":::

1. Select your Azure IoT Edge device to view its dashboard​. You should see that the workloads from your device twin in Azure IoT Hub have been deployed. The **IoT Edge Module List** should show one module running, **edgeAgent**, and the **IoT Edge Status** should show **active (running)**.
​
Your IoT Edge device is now configured. It's ready to run cloud-deployed modules.

## Deploy a module

Manage your Azure IoT Edge device from the cloud to deploy a module that sends telemetry data to IoT Hub.

![Diagram - deploy module from cloud to device](./media/quickstart/deploy-module.png)

[!INCLUDE [iot-edge-deploy-module](../../includes/iot-edge-deploy-module.md)]

## View generated data

In this quickstart, you created a new IoT Edge device and installed the IoT Edge runtime on it. Then, you used the Azure portal to deploy an IoT Edge module to run on the device without having to make changes to the device itself.

In this case, the module that you pushed generates sample environment data that you can use for testing later. The simulated sensor is monitoring both a machine and the environment around the machine. For example, this sensor might be in a server room, on a factory floor, or on a wind turbine. The message includes ambient temperature and humidity, machine temperature and pressure, and a timestamp. The IoT Edge tutorials use the data created by this module as test data for analytics.

Confirm that the module deployed from the cloud is running on your IoT Edge device by navigating to the Command Shell in Windows Admin Center.

1. Connect to your newly created IoT Edge Device

   :::image type="content" source="media/quickstart/connect-edge-screen.png" alt-text="Screenshot - Connect Device":::

2. On the **Overview** page you will see the **IoT Edge Module List** and **IoT Edge Status** where you can see the various modules that have been deployed as well as the device status.  

3. Under **Tools** select **Command Shell**. The command shell is a PowerShell terminal that automatically uses ssh (secure shell) to connect to your Azure IoT Edge device's Linux VM on your Windows PC.

   :::image type="content" source="media/quickstart/command-shell-screen.png" alt-text="Screenshot - Command Shell":::

4. To verify the three modules on your device, run the following **bash command**:

   ```bash
   sudo iotedge list
   ```

   :::image type="content" source="media/quickstart/iotedge-list-screen.png" alt-text="Screenshot - Command Shell List":::

5. View the messages being sent from the temperature sensor module to the cloud.

   ```bash
   iotedge logs SimulatedTemperatureSensor -f
   ```

   >[!TIP]
   >IoT Edge commands are case-sensitive when referring to module names.

   :::image type="content" source="media/quickstart/temperature-sensor-screen.png" alt-text="Screenshot - Temperature Sensor":::

You can also watch the messages arrive at your IoT hub by using the [Azure IoT Hub extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit).

## Clean up resources

If you want to continue on to the IoT Edge tutorials, you can use the device that you registered and set up in this quickstart. Otherwise, you can delete the Azure resources that you created to avoid charges.

If you created your virtual machine and IoT hub in a new resource group, you can delete that group and all the associated resources. Double check the contents of the resource group to make sure that there's nothing you want to keep. If you don't want to delete the whole group, you can delete individual resources instead.

> [!IMPORTANT]
> Deleting a resource group is irreversible.

Remove the **IoTEdgeResources** group. It might take a few minutes to delete a resource group.

```azurecli-interactive
az group delete --name IoTEdgeResources
```

You can confirm the resource group is removed by viewing the list of resource groups.

```azurecli-interactive
az group list
```

### Clean removal of Azure IoT Edge for Linux on Windows

You can uninstall Azure IoT Edge for Linux on Windows from your IoT Edge device through the dashboard extension in Windows Admin Center.

1. Connect to the Azure IoT Edge for Linux on Windows device connection in Windows Admin Center. The Azure dashboard tool extension will load.
2. Select **Uninstall**. Once Azure IoT Edge for Linux on Windows is removed, Windows Admin Center will navigate to the start page and remove the Azure IoT Edge device connection entry from the list.

Another way to remove Azure IoT Edge from your Windows system is to go to **Start** > **Settings** > **Apps** > **Azure IoT Edge** > **Uninstall** on your IoT Edge device. This will remove Azure IoT Edge from your IoT Edge device, but leave the connection behind in Windows Admin Center. Windows Admin Center can be uninstalled from the Settings menu as well.

## Next steps

In this quickstart, you created an IoT Edge device and used the Azure IoT Edge cloud interface to deploy code onto the device. Now, you have a test device generating raw data about its environment.

The next step is to set up your local development environment so that you can start creating IoT Edge modules that run your business logic.

> [!div class="nextstepaction"]
> [Start developing IoT Edge modules](tutorial-develop-for-linux.md)
