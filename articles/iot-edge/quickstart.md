---
title: Quickstart Azure IoT Edge + Windows | Microsoft Docs 
description: Try out Azure IoT Edge by running analytics on a simulated edge device
author: kgremban
manager: timlt
ms.author: kgremban
ms.date: 06/24/2018
ms.topic: quickstart
ms.service: iot-edge
services: iot-edge
ms.custom: mvc

experimental: true
experiment_id: 2c2f48c7-50a9-4e
---

# Quickstart: Deploy your first IoT Edge module from the Azure portal to a Windows device - preview

In this quickstart, use the Azure IoT Edge cloud interface to deploy prebuilt code remotely to an IoT Edge device. To accomplish this task, first use your Windows device to simulate an IoT Edge device, then you can deploy a module to it.

In this quickstart you learn how to:

1. Create an IoT Hub.
2. Register an IoT Edge device to your IoT hub.
3. Install and start the IoT Edge runtime on your device.
4. Remotely deploy a module to an IoT Edge device and send telemetry to IoT Hub.

![Tutorial architecture][2]

The module that you deploy in this quickstart is a simulated sensor that generates temperature, humidity, and pressure data. The other Azure IoT Edge tutorials build upon the work you do here by deploying modules that analyze the simulated data for business insights. 

>[!NOTE]
>The IoT Edge runtime on Windows is in [public preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

If you don't have an active Azure subscription, create a [free account][lnk-account] before you begin.

## Prerequisites

This quickstart turns your Windows computer or virtual machine into an IoT Edge device. If you're running Windows in a virtual machine, enable [nested virtualization][lnk-nested] and allocate at least 2GB memory. 

Have the following prerequisites ready on the machine that you're using for an IoT Edge device:

1. Make sure you're using a supported Windows version:
   * Windows 10 or newer
   * Windows Server 2016 or newer
2. Install [Docker for Windows][lnk-docker] and make sure it's running.
3. Configure Docker to use [Linux containers](https://docs.docker.com/docker-for-windows/#switch-between-windows-and-linux-containers)

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

You use the Azure CLI to complete many of the steps in this quickstart, and Azure IoT has an extension to enable additional functionality. 

Add the Azure IoT extension to the cloud shell instance.

   ```azurecli-interactive
   az extension add --name azure-cli-iot-ext
   ```

## Create an IoT hub

Start the quickstart by creating your IoT Hub in the Azure portal.
![Create IoT Hub][3]

The free level of IoT Hub works for this quickstart. If you've used IoT Hub in the past and already have a free hub created, you can use that IoT hub. Each subscription can only have one free IoT hub. 

1. In the Azure cloud shell, create a resource group. The following code creates a resource group called **IoTEdgeResources** in the **West US** region. By putting all the resources for the quickstarts and tutorials in a group, you can manage them together. 

   ```azurecli-interactive
   az group create --name IoTEdgeResources --location westus
   ```

1. Create an IoT hub in your new resource group. The following code creates a free **F1** hub in the resource group **IoTEdgeResources**. Replace *{hub_name}* with a unique name for your IoT hub.

   ```azurecli-interactive
   az iot hub create --resource-group IoTEdgeResources --name {hub_name} --sku F1 
   ```

## Register an IoT Edge device

Register an IoT Edge device with your newly created IoT Hub.
![Register a device][4]

Create a device identity for your simulated device so that it can communicate with your IoT hub. Since IoT Edge devices behave and can be managed differently than typical IoT devices, you declare this to be an IoT Edge device from the beginning. 

1. In the Azure cloud shell, enter the following command to create a device named **myEdgeDevice** in your hub.

   ```azurecli-interactive
   az iot hub device-identity create --device-id myEdgeDevice --hub-name {hub_name} --edge-enabled
   ```

1. Retrieve the connection string for your device, which links your physical device with its identity in IoT Hub. 

   ```azurecli-interactive
   az iot hub device-identity show-connection-string --device-id myEdgeDevice --hub-name {hub_name}
   ```

1. Copy the connection string and save it. You'll use this value to configure the IoT Edge runtime in the next section. 

## Install and start the IoT Edge runtime

Install and start the Azure IoT Edge runtime on your IoT Edge device. 
![Register a device][5]

The IoT Edge runtime is deployed on all IoT Edge devices. It has three components. The **IoT Edge security daemon** starts each time an Edge device boots and bootstraps the device by starting the IoT Edge agent. The **IoT Edge agent** facilitates deployment and monitoring of modules on the IoT Edge device, including the IoT Edge hub. The **IoT Edge hub** manages communications between modules on the IoT Edge device, and between the device and IoT Hub. 

>[!NOTE]
>The installation steps in this section are manual for now while an installation script is being developed. 

The instructions in this section configure the IoT Edge runtime with Linux containers. If you want to use Windows containers, see [Install Azure IoT Edge runtime on Windows to use with Windows containers](how-to-install-iot-edge-windows-with-windows.md).

### Download and install the IoT Edge service

1. On your IoT Edge device, run PowerShell as an administrator.

2. Download the IoT Edge service package.

   ```powershell
   Invoke-WebRequest https://aka.ms/iotedged-windows-latest -o .\iotedged-windows.zip
   Expand-Archive .\iotedged-windows.zip C:\ProgramData\iotedge -f
   Move-Item c:\ProgramData\iotedge\iotedged-windows\* C:\ProgramData\iotedge\ -Force
   rmdir C:\ProgramData\iotedge\iotedged-windows
   $sysenv = "HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Environment"
   $path = (Get-ItemProperty -Path $sysenv -Name Path).Path + ";C:\ProgramData\iotedge"
   Set-ItemProperty -Path $sysenv -Name Path -Value $path
   ```

3. Install the vcruntime.

  ```powershell
  Invoke-WebRequest -useb https://download.microsoft.com/download/0/6/4/064F84EA-D1DB-4EAA-9A5C-CC2F0FF6A638/vc_redist.x64.exe -o vc_redist.exe
  .\vc_redist.exe /quiet /norestart
  ```

4. Create and start the IoT Edge service.

   ```powershell
   New-Service -Name "iotedge" -BinaryPathName "C:\ProgramData\iotedge\iotedged.exe -c C:\ProgramData\iotedge\config.yaml"
   Start-Service iotedge
   ```

5. Add firewall exceptions for the ports that the IoT Edge service uses.

   ```powershell
   New-NetFirewallRule -DisplayName "iotedged allow inbound 15580,15581" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 15580-15581 -Program "C:\programdata\iotedge\iotedged.exe" -InterfaceType Any
   ```

6. Create a new file called **iotedge.reg** and open it with a text editor. 

7. Add the following content and save the file. 

   ```input
   Windows Registry Editor Version 5.00
   [HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\EventLog\Application\iotedged]
   "CustomSource"=dword:00000001
   "EventMessageFile"="C:\\ProgramData\\iotedge\\iotedged.exe"
   "TypesSupported"=dword:00000007
   ```

8. Navigate to your file in File Explorer and double-click it to import the changes to the Windows Registry. 

### Configure the IoT Edge runtime 

Configure the runtime with your IoT Edge device connection string that you copied when you registered a new device. Then, configure the runtime network. 

1. Open the IoT Edge configuration file, which is located at `C:\ProgramData\iotedge\config.yaml`. This file is protected, so run a text editor like Notepad as an administrator, then use the editor to open the file. 

2. Find the **provisioning** section and update the value of **device_connection_string** with the string that you copied from your IoT Edge device details. 

3. In your administrator PowerShell window, retrieve the hostname for your IoT Edge device and copy the output. 

   ```powershell
   hostname
   ```

4. In the configuration file, find the **Edge device hostname** section. Update the value of **hostname** with the hostname that you copied from PowerShell.

3. In your administrator PowerShell window, retrieve the IP address for your IoT Edge device. 

   ```powershell
   ipconfig
   ```

4. Copy the value for **IPv4 Address** in the **vEthernet (DockerNAT)** section of the output. 

5. Create an environment variable called **IOTEDGE_HOST**, replacing *\<ip_address\>* with the IP Address for your IoT Edge device. 

   ```powershell
   [Environment]::SetEnvironmentVariable("IOTEDGE_HOST", "http://<ip_address>:15580")
   ```

6. In the `config.yaml` file, find the **Connect settings** section. Update the **management_uri** and **workload_uri** values with your IP address and the ports that you opened in the previous section. Replace **\<GATEWAY_ADDRESS\>** with the DockerNAT IP address that you copied. 

   ```yaml
   connect: 
     management_uri: "http://<GATEWAY_ADDRESS>:15580"
     workload_uri: "http://<GATEWAY_ADDRESS>:15581"
   ```

7. Find the **Listen settings** section and add the same values for **management_uri** and **workload_uri**. 

   ```yaml
   listen:
     management_uri: "http://<GATEWAY_ADDRESS>:15580"
     workload_uri: "http://<GATEWAY_ADDRESS>:15581"
   ```

8. Find the **Moby Container Runtime settings** section and verify that the value for **network** is set to `nat`.

9. Save the configuration file. 

10. In PowerShell, restart the IoT Edge service.

   ```powershell
   Stop-Service iotedge -NoWait
   sleep 5
   Start-Service iotedge
   ```

### View the IoT Edge runtime status

Verify that the runtime was successfully installed and configured.

1. Check the status of the IoT Edge service.

   ```powershell
   Get-Service iotedge
   ```

2. If you need to troubleshoot the service, retrieve the service logs. 

   ```powershell
   # Displays logs from today, newest at the bottom.

   Get-WinEvent -ea SilentlyContinue `
    -FilterHashtable @{ProviderName= "iotedged";
      LogName = "application"; StartTime = [datetime]::Today} |
    select TimeCreated, Message |
    sort-object @{Expression="TimeCreated";Descending=$false} |
    format-table -autosize -wrap
   ```

3. View all the modules running on your IoT Edge device. Since the service just started for the first time, you should only see the **edgeAgent** module running. The edgeAgent module runs by default, and helps to install and start any additional modules that you deploy to your device. 

   ```powershell
   iotedge list
   ```

   ![View one module on your device](./media/quickstart/iotedge-list-1.png)

## Deploy a module

Manage your Azure IoT Edge device from the cloud to deploy a module that will send telemetry data to IoT Hub.
![Register a device][6]

[!INCLUDE [iot-edge-deploy-module](../../includes/iot-edge-deploy-module.md)]

## View generated data

In this quickstart, you created a new IoT Edge device and installed the IoT Edge runtime on it. Then, you used the Azure portal to push an IoT Edge module to run on the device without having to make changes to the device itself. In this case, the module that you pushed creates environmental data that you can use for the tutorials. 

Confirm that the module deployed from the cloud is running on your IoT Edge device. 

```powershell
iotedge list
```

   ![View three modules on your device](./media/quickstart/iotedge-list-2.png)

View the messages being sent from the tempSensor module to the cloud. 

```powershell
iotedge logs tempSensor -f
```

  ![View the data from your module](./media/quickstart/iotedge-logs.png)

You can also view the messages that are received by your IoT hub by using the [IoT Hub explorer tool][lnk-iothub-explorer] or the [Azure IoT Toolkit extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=vsciot-vscode.azure-iot-toolkit). 

## Clean up resources

If you want to continue on to the IoT Edge tutorials, you can use the device that you registered and set up in this quickstart. Otherwise, you can delete the Azure resources that you created and remove the IoT Edge runtime from your device. 

### Delete Azure resources

If you created your virtual machine and IoT hub in a new resource group, you can delete that group and all the associated resources. If there's anything in that resource group that you want to keep, then just delete the individual resources that you want to clean up. 

Remove the **IoTEdgeResources** group. 

   ```azurecli-interactive
   az group delete --name IoTEdgeResources 
   ```

### Remove the IoT Edge runtime

If you plan on using the IoT Edge device for future testing, but want to stop the tempSensor module from sending data to your IoT hub while not in use, use the following command to stop the IoT Edge service. 

   ```powershell
   Stop-Service iotedge -NoWait
   ```

You can restart the service when you're ready to start testing again

   ```powershell
   Start-Service iotedge
   ```

If you want to remove the installations from your device, use the following commands.  

Remove the IoT Edge runtime.

   ```powershell
   cmd /c sc delete iotedge
   rm -r c:\programdata\iotedge
   ```

When the IoT Edge runtime is removed, the containers that it created are stopped, but still exist on your device. View all containers.

   ```powershell
   docker ps -a
   ```

Delete the containers that were created on your device by the IoT Edge runtime. Change the name of the tempSensor container if you called it something different. 

   ```powershell
   docker rm -f tempSensor
   docker rm -f edgeHub
   docker rm -f edgeAgent
   ```
   
## Next steps

In this quickstart, you created a new IoT Edge device and used the Azure IoT Edge cloud interface to deploy code onto the device. Now, you have a test device generating raw data about its environment. 

You are ready to continue on to any of the other tutorials to learn how Azure IoT Edge can help you turn this data into business insights at the edge.

> [!div class="nextstepaction"]
> [Filter sensor data using an Azure Function](tutorial-deploy-function.md)


<!-- Images -->
[1]: ./media/quickstart/cloud-shell.png
[2]: ./media/quickstart/install-edge-full.png
[3]: ./media/quickstart/create-iot-hub.png
[4]: ./media/quickstart/register-device.png
[5]: ./media/quickstart/start-runtime.png
[6]: ./media/quickstart/deploy-module.png


<!-- Links -->
[lnk-docker]: https://docs.docker.com/docker-for-windows/install/ 
[lnk-iothub-explorer]: https://github.com/azure/iothub-explorer
[lnk-account]: https://azure.microsoft.com/free
[lnk-portal]: https://portal.azure.com
[lnk-nested]: https://docs.microsoft.com/virtualization/hyper-v-on-windows/user-guide/nested-virtualization
[lnk-delete]: https://docs.microsoft.com/cli/azure/iot/hub?view=azure-cli-latest#az_iot_hub_delete

<!-- Anchor links -->
[anchor-register]: #register-an-iot-edge-device
