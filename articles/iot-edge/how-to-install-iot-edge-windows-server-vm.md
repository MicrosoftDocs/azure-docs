---
title: Run Azure IoT Edge on Windows Server Virtual Machines | Microsoft Docs
description: Azure IoT Edge setup instructions on Windows Server Marketplace Virtual Machines
author: gregman-msft
manager: arjmands
# this is the PM responsible
ms.reviewer: kgremban
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 06/12/2019
ms.author: philmea
---
# Run Azure IoT Edge on Windows Server Virtual Machines

The Azure IoT Edge runtime is what turns a device into an IoT Edge device. The runtime can be deployed on devices as small as a Raspberry Pi or as large as an industrial server. Once a device is configured with the IoT Edge runtime, you can start deploying business logic to it from the cloud.

To learn more about how the IoT Edge runtime works and what components are included, see [Understand the Azure IoT Edge runtime and its architecture](iot-edge-runtime.md).

This article lists the steps to run the Azure IoT Edge runtime on a Windows Server 2019 virtual machine using the [Windows Server](https://www.microsoft.com/cloud-platform/windows-server-pricing) Azure Marketplace offer. Follow the instructions at [Install the Azure IoT Edge runtime](how-to-install-iot-edge-windows.md) on Windows for use with other versions.

## Deploy from the Azure Marketplace

1. Navigate to the [Windows Server](https://www.microsoft.com/cloud-platform/windows-server-pricing) Azure Marketplace offer or by searching “Windows Server” on [Azure Marketplace](https://azuremarketplace.microsoft.com/)
2. Select **GET IT NOW**
3. In **Software plan**, find "Windows Server 2019 Datacenter Server Core with Containers" and then select **Continue** on the next dialog.
    * You can also use these instructions for other versions of Windows Server with Containers
4. Once in the Azure portal, select **Create** and follow the wizard to deploy the VM.
    * If it’s your first time trying out a VM, it’s easiest to use a password and to enable RDP and SSH in the public inbound port menu.
    * If you have a resource intensive workload, you should upgrade the virtual machine size by adding more CPUs and/or memory.
5. Once the virtual machine is deployed, configure it to connect to your IoT Hub:
    1. Copy your device connection string from your IoT Edge device created in your IoT Hub. See the procedure [Retrieve the connection string in the Azure portal](how-to-register-device.md#retrieve-the-connection-string-in-the-azure-portal).
    1. Select your newly created virtual machine resource from the Azure portal and open the **run command** option
    1. Select the **RunPowerShellScript** option
    1. Copy this script into the command window with your device connection string:

        ```powershell
        . {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; `
        Install-IoTEdge -Manual -DeviceConnectionString '<connection-string>'
        ```

    1. Execute the script to install the IoT Edge runtime and set your connection string by selecting **Run**
    1. After a minute or two, you should see a message that the Edge runtime was installed and provisioned successfully.

## Deploy from the Azure portal

1. From the Azure portal, search for “Windows Server” and select **Windows Server 2019 Datacenter** to begin the VM creation workflow.
2. From **Select a software plan** choose "Windows Server 2019 Datacenter Server Core with Containers", then select **Create**
3. Complete step 5 in the "Deploy from the Azure Marketplace" instructions above.

## Deploy from Azure CLI

1. If you’re using Azure CLI on your desktop, start by logging in:

   ```azurecli-interactive
   az login
   ```

1. If you have multiple subscriptions, select the subscription you’d like to use:
   1. List your subscriptions:

      ```azurecli-interactive
      az account list --output table
      ```

   1. Copy the SubscriptionID field for the subscription you’d like to use
   1. Run this command with the ID you copied:

      ```azurecli-interactive
      az account set -s {SubscriptionId}
      ```

1. Create a new resource group (or specify an existing one in the next steps):

   ```azurecli-interactive
   az group create --name IoTEdgeResources --location westus2
   ```

1. Create a new virtual machine:

   ```azurecli-interactive
   az vm create -g IoTEdgeResources -n EdgeVM --image MicrosoftWindowsServer:WindowsServer:2019-Datacenter-Core-with-Containers:latest  --admin-username azureuser --generate-ssh-keys --size Standard_DS1_v2
   ```

   * This command will prompt you for a password, but you can add the option `--admin-password` to set it more easily in a script
   * The Windows Server Core image has command line support only with remote desktop, so if you'd like the full desktop experience, specify `MicrosoftWindowsServer:WindowsServer:2019-Datacenter-with-Containers:latest` as the image

1. Set the device connection string (You can follow the [Retrieve the connection string with Azure CLI](how-to-register-device.md#retrieve-the-connection-string-with-the-azure-cli) procedure if you’re not familiar with this process):

   ```azurecli-interactive
   az vm run-command invoke -g IoTEdgeResources -n EdgeVM --command-id RunPowerShellScript --script ". {Invoke-WebRequest -useb aka.ms/iotedge-win} | Invoke-Expression; `Install-IoTEdge -Manual -DeviceConnectionString '<connection-string>'"
   ```

## Next steps

Now that you have an IoT Edge device provisioned with the runtime installed, you can [deploy IoT Edge modules](how-to-deploy-modules-portal.md).

If you're having problems with the Edge runtime installing properly, check out the [troubleshooting](troubleshoot.md) page.

To update an existing installation to the newest version of IoT Edge, see [Update the IoT Edge security daemon and runtime](how-to-update-iot-edge.md).

Learn more about using Windows virtual machines at the [Windows Virtual Machines documentation](https://docs.microsoft.com/azure/virtual-machines/windows/).

If you want to SSH into this VM after setup, follow the [Installation of OpenSSH for Windows Server](https://docs.microsoft.com/windows-server/administration/openssh/openssh_install_firstuse#installing-openssh-with-powershell) guide using remote desktop or remote powershell.
