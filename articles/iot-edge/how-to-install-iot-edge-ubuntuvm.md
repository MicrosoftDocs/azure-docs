---
title: Run Azure IoT Edge on Ubuntu Virtual Machines | Microsoft Docs
description: Azure IoT Edge setup instructions on Ubuntu 16.04 Azure Marketplace Virtual Machines
author: gregman-msft
manager: arjmands
# this is the PM responsible
ms.reviewer: kgremban
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 07/09/2019
ms.author: gregman
---
# Run Azure IoT Edge on Ubuntu Virtual Machines

The Azure IoT Edge runtime is what turns a device into an IoT Edge device. The runtime can be deployed on devices as small as a Raspberry Pi or as large as an industrial server. Once a device is configured with the IoT Edge runtime, you can start deploying business logic to it from the cloud.

To learn more about how the IoT Edge runtime works and what components are included, see [Understand the Azure IoT Edge runtime and its architecture](iot-edge-runtime.md).

This article lists the steps to run the Azure IoT Edge runtime on an Ubuntu 16.04 Virtual Machine using the preconfigured [Azure IoT Edge on Ubuntu Azure Marketplace offer](https://aka.ms/azure-iot-edge-ubuntuvm). 

On first boot, the Azure IoT Edge on Ubuntu VM preinstalls the latest version of the Azure IoT Edge runtime. It also includes a script to set the connection string and then restart the runtime, which can be triggered remotely through the Azure VM portal or Azure command line, allowing you to easily configure and connect the IoT Edge device without starting an SSH or remote desktop session. This script will wait to set the connection string until the IoT Edge client is fully installed so that you don’t have to build that into your automation.

## Deploy from the Azure Marketplace
1.	Navigate to the [Azure IoT Edge on Ubuntu](https://aka.ms/azure-iot-edge-ubuntuvm) Marketplace offer or by searching “Azure IoT Edge on Ubuntu” on [the Azure Marketplace](https://azuremarketplace.microsoft.com/)
2.	Select **GET IT NOW** and then **Continue** on the next dialog.
3.	Once in the Azure portal, select **Create** and follow the wizard to deploy the VM. 
    *	If it’s your first time trying out a VM, it’s easiest to use a password and to enable the SSH in the public inbound port menu. 
    *	If you have a resource intensive workload, you should upgrade the virtual machine size by adding more CPUs and/or memory.
4.	Once the virtual machine is deployed, configure it to connect to your IoT Hub:
    1.	Copy your device connection string from your IoT Edge device created in your IoT Hub (You can follow the [Register a new Azure IoT Edge device from the Azure portal](how-to-register-device-portal.md) how-to guide if you aren’t familiar with this process)
    1.	Select your newly created virtual machine resource from the Azure portal and open the **run command** option
    1.	Select the **RunShellScript** option
    1.	Execute the script below via the command window with your device connection string: 
    `/etc/iotedge/configedge.sh “{device_connection_string}”`
    1.	Select **Run**
    1.	Wait a few moments, and the screen should then provide a success message indicating the connection string was set successfully.


## Deploy from the Azure portal
From the Azure portal, search for “Azure IoT Edge” and select **Ubuntu Server 16.04 LTS + Azure IoT Edge runtime** to begin the VM creation workflow. From there, complete steps 3 and 4 in the "Deploy from the Azure Marketplace" instructions above.

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
    
   1. Copy the SubscriptionID field for the subscription you’d like to use.

   1. Set your working subscription with the ID that you just copied:
    
      ```azurecli-interactive 
      az account set -s {SubscriptionId}
      ```
    
1. Create a new resource group (or specify an existing one in the next steps):

   ```azurecli-interactive
   az group create --name IoTEdgeResources --location westus2
   ```

1. Accept the terms of use for the virtual machine. If you want to review the terms first, follow the steps in [Deploy from the Azure Marketplace](#deploy-from-the-azure-marketplace).

   ```azurecli-interactive
   az vm image accept-terms --urn microsoft_iot_edge:iot_edge_vm_ubuntu:ubuntu_1604_edgeruntimeonly:latest
   ```

1. Create a new virtual machine:

   ```azurecli-interactive
   az vm create --resource-group IoTEdgeResources --name EdgeVM --image microsoft_iot_edge:iot_edge_vm_ubuntu:ubuntu_1604_edgeruntimeonly:latest --admin-username azureuser --generate-ssh-keys
   ```

1. Set the device connection string (You can follow the [Register a new Azure IoT Edge device with Azure CLI](how-to-register-device-cli.md) how-to guide if you’re not familiar with this process):

   ```azurecli-interactive
   az vm run-command invoke -g IoTEdgeResources -n EdgeVM --command-id RunShellScript --script "/etc/iotedge/configedge.sh '{device_connection_string}'"
   ```

If you want to SSH into this VM after setup, use the publicIpAddress with the command: 
    `ssh azureuser@{publicIpAddress}`


## Next steps

Now that you have an IoT Edge device provisioned with the runtime installed, you can [deploy IoT Edge modules](how-to-deploy-modules-portal.md).

If you are having problems with the IoT Edge runtime installing properly, check out the [troubleshooting](troubleshoot.md) page.

To update an existing installation to the newest version of IoT Edge, see [Update the IoT Edge security daemon and runtime](how-to-update-iot-edge.md).
