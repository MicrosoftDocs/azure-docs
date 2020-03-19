---
title: Run Azure IoT Edge on Ubuntu Virtual Machines | Microsoft Docs
description: Azure IoT Edge setup instructions for Ubuntu 18.04 LTS Virtual Machines
author: pdecarlo
manager: veyalla
# this is the PM responsible
ms.reviewer: kgremban
ms.service: iot-edge
services: iot-edge
ms.topic: conceptual
ms.date: 03/19/2020
ms.author: philmea
---
# Run Azure IoT Edge on Ubuntu Virtual Machines

The Azure IoT Edge runtime is what turns a device into an IoT Edge device. The runtime can be deployed on devices as small as a Raspberry Pi or as large as an industrial server. Once a device is configured with the IoT Edge runtime, you can start deploying business logic to it from the cloud.

To learn more about how the IoT Edge runtime works and what components are included, see [Understand the Azure IoT Edge runtime and its architecture](iot-edge-runtime.md).

This article lists the steps to deploy an Ubuntu 18.04 LTS Virtual Machine with the Azure IoT Edge runtime installed and configured using a pre-supplied device connection string. This is accomplished using a [cloud-init](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/using-cloud-init
) based [ARM template](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/) maintained in the [iotedge-vm-deploy](https://github.com/Azure/iotedge-vm-deploy) project repository.

On first boot, the Ubuntu 18.04 LTS Virtual Machine [installs the latest version of the Azure IoT Edge runtime via cloud-init](https://github.com/Azure/iotedge-vm-deploy/blob/master/cloud-init.txt). It also sets a supplied connection string before the runtime starts, allowing you to easily configure and connect the IoT Edge device without starting an SSH or remote desktop session. 

## Deploy using Deploy to Azure Button

The [Deploy to Azure Button](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/deploy-to-azure-button) allows for streamlined deployment of ARM templates maintained on GitHub.  This section will demonstrate usage of the Deploy to Azure Button contained in the [iotedge-vm-deploy](https://github.com/Azure/iotedge-vm-deploy) project repository.  


1. We will deploy an Azure IoT Edge enabled Linux VM using the iotedge-vm-deploy ARM Template.  To begin, click the button below:

    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fazure%2Fiotedge-vm-deploy%2Fms-learn%2FedgeDeploy.json" target="_blank">
        <img src="https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/1-CONTRIBUTION-GUIDE/images/deploytoazure.png" />
    </a>

1. On the newly launched window, fill in the available form fields:

    [![Screenshot showing the iotedge-vm-deploy template](./media/iot-edge-runtime/iotedge-vm-deploy.png)](./media/iot-edge-runtime/iotedge-vm-deploy.png)

    **Subscription**: The active Azure subscription to deploy the Virtual Machine into.

    **DNS Label Prefix**: The value used to prefix the hostname of the Virtual Machine.

    **Resource group**: An existing or newly created Resource Group to contain the Virtual Machine and it's associated resources.

    **Admin Username**: A username which will be provided root privileges on deployment.

    **Device Connection String**: A [Device Connection string](https://docs.microsoft.com/en-us/azure/iot-edge/how-to-register-device) for a device that was created within your intended [IoT Hub](https://docs.microsoft.com/en-us/azure/iot-hub/).

    **VM Size**: The [size](https://docs.microsoft.com/en-us/azure/cloud-services/cloud-services-sizes-specs) of the Virtual Machine to be deployed

    **Ubuntu OS Version**: The version of the Ubuntu OS to be installed on the base Virtual Machine.

    **Location**: The [geographic region](https://azure.microsoft.com/en-us/global-infrastructure/locations/) to deploy the Virtual Machine into, this defaults to the location of the selected Resource Group.

    **Authentication Type**: Choose "sshPublicKey" or "password" depending on your preference.

    **Admin Password or Key**: The location of the SSH Public Key or the value of the password depending on the choice of Authentication Type.

    When all fields have been filled in, select the checkbox at the bottom of the page to accept the terms and select "Purchase" to begin the deployment.

1. Verify that the deployment has completed successfully.  A Virtual machine resource should have been deployed into the selected resource group.  Take note of the machine name which should be in the following format `vm-0000000000000`.

## Deploy from Azure CLI

1. If you're using Azure CLI on your desktop, start by logging in:

   ```azurecli-interactive
   az login
   ```

1. If you have multiple subscriptions, select the subscription you'd like to use:
   1. List your subscriptions:

      ```azurecli-interactive
      az account list --output table
      ```

   1. Copy the SubscriptionID field for the subscription you'd like to use.

   1. Set your working subscription with the ID that you just copied:

      ```azurecli-interactive
      az account set -s {SubscriptionId}
      ```

1. Create a new resource group (or specify an existing one in the next steps):

   ```azurecli-interactive
   az group create --name IoTEdgeResources --location westus2
   ```

1. Create a new virtual machine:

   ```azurecli-interactive
   az group deployment create \
   --name edgeVm \
   --resource-group IoTEdgeResources \
   --template-uri "https://aka.ms/iotedge-vm-deploy" \
   --parameters dnsLabelPrefix='my-edge-vm1' \
   --parameters adminUsername='azureuser' \
   --parameters deviceConnectionString=$(az iot hub device-identity show-connection-string --device-id replace-with-device-name --hub-name replace-with-hub-name -o tsv) \
   --parameters authenticationType='password' \
   --parameters adminPasswordOrKey="YOUR_SECRET_PASSWORD"
   ```

If you want to SSH into this VM after setup, use the publicIpAddress with the command:
    `ssh azureuser@{publicIpAddress}`

## Next steps

Now that you have an IoT Edge device provisioned with the runtime installed, you can [deploy IoT Edge modules](how-to-deploy-modules-portal.md).

If you are having problems with the IoT Edge runtime installing properly, check out the [troubleshooting](troubleshoot.md) page.

To update an existing installation to the newest version of IoT Edge, see [Update the IoT Edge security daemon and runtime](how-to-update-iot-edge.md).

If you'd like to open up ports to access the VM through SSH or other inbound connections, refer to the Azure Virtual Machine documentation on [opening up ports and endpoints to a Linux VM](../virtual-machines/linux/nsg-quickstart.md)
