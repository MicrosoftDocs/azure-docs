---
title: Run Azure IoT Edge on Ubuntu VMs by using Bicep
description: Learn how to run Azure IoT Edge on Ubuntu virtual machines by deploying and provisioning using Bicep.
author: sethmanheim
ms.author: sethm
ms.service: azure-iot-edge
services: iot-edge
ms.topic: how-to
ms.date: 07/21/2025
ms.custom:
  - devx-track-azurecli
  - devx-track-bicep
  - sfi-image-nochange
  - sfi-ropc-nochange
---
# Run Azure IoT Edge on Ubuntu virtual machines by using Bicep

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

The Azure IoT Edge runtime turns a device into an IoT Edge device. You can deploy the runtime on devices as small as a Raspberry Pi or as large as an industrial server. After you set up the IoT Edge runtime, deploy business logic to the device from the cloud.

To learn more about how the IoT Edge runtime works and what components it includes, see [Understand the Azure IoT Edge runtime and its architecture](iot-edge-runtime.md).

## Deploy from Azure CLI

You can't deploy a remote Bicep file. Save a copy of the [Bicep file](https://raw.githubusercontent.com/Azure/iotedge-vm-deploy/main/edgeDeploy.bicep) locally as **main.bicep**.

1. Ensure that you installed the Azure CLI iot extension with:

   ```azurecli
   az extension add --name azure-iot
   ```

1. Next, if you're using Azure CLI on your desktop, start by logging in:

   ```azurecli
   az login
   ```

1. If you have multiple subscriptions, select the subscription you'd like to use:
   1. List your subscriptions:

      ```azurecli
      az account list --output table
      ```

   1. Copy the *SubscriptionID* field for the subscription you want to use.

   1. Set your working subscription with the ID you copied:

      ```azurecli
      az account set -s <SubscriptionId>
      ```

1. Create a new resource group (or specify an existing one in the next steps):

   ```azurecli
   az group create --name IoTEdgeResources --location westus2
   ```

1. Create a new virtual machine:

   To use an **authenticationType** of `password`, see the following example:

   ```azurecli
   az deployment group create \
   --resource-group IoTEdgeResources \
   --template-file "main.bicep" \
   --parameters dnsLabelPrefix='my-edge-vm1' \
   --parameters deviceConnectionString=$(az iot hub device-identity connection-string show --device-id <REPLACE_WITH_DEVICE-NAME> --hub-name <REPLACE-WITH-HUB-NAME> -o tsv) \
   --parameters authenticationType='password' \
   --parameters adminUsername='<REPLACE_WITH_USERNAME>' \
   --parameters adminPasswordOrKey="<REPLACE_WITH_SECRET_PASSWORD>"
   ```

   To authenticate with an SSH key, specify an **authenticationType** of `sshPublicKey`, then provide the value of the SSH key in the `adminPasswordOrKey` parameter. For example:

   ```azurecli
   #Generate the SSH Key
   ssh-keygen -m PEM -t rsa -b 4096 -q -f ~/.ssh/iotedge-vm-key -N ""

   #Create a VM using the iotedge-vm-deploy script
   az deployment group create \
   --resource-group IoTEdgeResources \
   --template-file "main.bicep" \
   --parameters dnsLabelPrefix='my-edge-vm1' \
   --parameters deviceConnectionString=$(az iot hub device-identity connection-string show --device-id <REPLACE_WITH_DEVICE-NAME> --hub-name <REPLACE-WITH-HUB-NAME> -o tsv) \
   --parameters authenticationType='sshPublicKey' \
   --parameters adminUsername='<REPLACE_WITH_USERNAME>' \
   --parameters adminPasswordOrKey="$(< ~/.ssh/iotedge-vm-key.pub)"
   ```

1. Check that the deployment completed successfully. A virtual machine resource is deployed into the selected resource group. Note the machine name, which is in the format `vm-0000000000000`. Also, note the associated **DNS Name**, which is in the format `<dnsLabelPrefix>`.`<location>`.cloudapp.azure.com.

    You can get the **DNS Name** from the JSON-formatted output of the previous step, in the **outputs** section as part of the **public SSH** entry. Use this value to SSH into the newly deployed machine.

    ```bash
    "outputs": {
      "public SSH": {
        "type": "String",
        "value": "ssh <adminUsername>@<DNS_Name>"
      }
    }
    ```

    You can also get the **DNS Name** from the **Overview** section of the newly deployed virtual machine in the Azure portal.

    :::image type="content" source="./media/how-to-install-iot-edge-ubuntuvm/iotedge-vm-dns-name.png" alt-text="Screenshot showing the DNS name of the IoT Edge virtual machine." lightbox="./media/how-to-install-iot-edge-ubuntuvm/iotedge-vm-dns-name.png":::

1. If you want to SSH into this VM after setup, use the associated **DNS Name** with the command:
    `ssh <adminUsername>@<DNS_Name>`

## Next steps

Now that you have an IoT Edge device provisioned with the runtime installed, you can [deploy IoT Edge modules](how-to-deploy-modules-portal.md).

If you're having problems with the IoT Edge runtime installing properly, check out the [troubleshooting](troubleshoot.md) page.

To update an existing installation to the newest version of IoT Edge, see [Update the IoT Edge security daemon and runtime](how-to-update-iot-edge.md).

If you'd like to open up ports to access the VM through SSH or other inbound connections, refer to the Azure Virtual Machines documentation on [opening up ports and endpoints to a Linux VM](/azure/virtual-machines/linux/nsg-quickstart).
