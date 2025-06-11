---
title: Run Azure IoT Edge on Ubuntu Virtual Machines
description: How to run Azure IoT Edge on an Ubuntu virtual machine
author: PatAltimore
ms.service: azure-iot-edge
ms.custom: devx-track-azurecli
services: iot-edge
ms.topic: how-to
ms.date: 06/09/2025
ms.author: patricka
---
# Run Azure IoT Edge on Ubuntu Virtual Machines

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

The Azure IoT Edge runtime turns a device into an IoT Edge device. Deploy the runtime on devices as small as a Raspberry Pi or as large as an industrial server. After you set up the IoT Edge runtime, deploy business logic to the device from the cloud.

To learn more about how the IoT Edge runtime works and its components, see [understand the Azure IoT Edge runtime and its architecture](iot-edge-runtime.md).

This article lists the steps to deploy an Ubuntu virtual machine with the Azure IoT Edge runtime installed and configured using a provided device connection string. The deployment uses a [cloud-init](/azure/virtual-machines/linux/using-cloud-init) based [Azure Resource Manager template](../azure-resource-manager/templates/overview.md) from the [iotedge-vm-deploy](https://github.com/Azure/iotedge-vm-deploy) project repository.

On first boot, the virtual machine [installs the latest version of the Azure IoT Edge runtime using cloud-init](https://github.com/Azure/iotedge-vm-deploy/blob/main/cloud-init.txt). It also sets a provided connection string before the runtime starts, so you can quickly set up and connect the IoT Edge device without starting an SSH or remote desktop session.

## Deploy using Deploy to Azure Button

The [Deploy to Azure Button](../azure-resource-manager/templates/deploy-to-azure-button.md) lets you quickly deploy [Azure Resource Manager templates](../azure-resource-manager/templates/overview.md) from GitHub.
This section shows how to use the **Deploy to Azure** button in the [iotedge-vm-deploy](https://github.com/Azure/iotedge-vm-deploy) project repository.

1. Deploy an Azure IoT Edge-enabled Linux VM by using the iotedge-vm-deploy Azure Resource Manager template. To start, select the following button:

   [![Deploy to Azure button for iotedge-vm-deploy](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fazure%2Fiotedge-vm-deploy%2Fmain%2FedgeDeploy.json)

1. In the new window, enter values for the available form fields:

    :::image type="content" source="./media/how-to-install-iot-edge-ubuntuvm/iotedge-vm-deploy-ubuntu2004.png" alt-text="Screenshot showing the iotedge-vm-deploy template." lightbox="./media/how-to-install-iot-edge-ubuntuvm/iotedge-vm-deploy-ubuntu2004.png":::


   | Field | Description |
   | --------- | ----------- |
   | **Subscription** | The active Azure subscription to deploy the virtual machine into. |
   | **Resource group** | An existing or new resource group to contain the virtual machine and its associated resources. |
   | **Region** | The [geographic region](https://azure.microsoft.com/global-infrastructure/locations/) where you deploy the virtual machine. This value defaults to the location of the selected resource group. |
   | **DNS Label Prefix** | A required value you choose to prefix the hostname of the virtual machine. |
   | **Admin Username** | A username with root privileges on deployment. |
   | **Device Connection String** | A [device connection string](./how-to-provision-single-device-linux-symmetric.md#view-registered-devices-and-retrieve-provisioning-information) for a device you created in your [IoT hub](../iot-hub/about-iot-hub.md). |
   | **VM Size** | The [size](../cloud-services/cloud-services-sizes-specs.md) of the virtual machine to deploy. |
   | **Ubuntu OS Version** | The version of Ubuntu OS to install on the base virtual machine. |
   | **Authentication Type** | Choose **sshPublicKey** or **password** based on your preference. |
   | **Admin Password or Key** | The SSH public key or password value, depending on the authentication type you choose. |

    Select `Next : Review + create` to review the terms, and then select **Create** to start the deployment.

1. Check that the deployment completes successfully. The virtual machine resource is deployed into the selected resource group. Note the machine name, which is in the format `vm-0000000000000`. Also, note the associated **DNS Name**, which is in the format `<dnsLabelPrefix>`.`<location>`.cloudapp.azure.com.

    You can find the **DNS Name** in the **Overview** section of the new virtual machine in the Azure portal.

    :::image type="content" source="./media/how-to-install-iot-edge-ubuntuvm/iotedge-vm-dns-name.png" alt-text="Screenshot showing the dns name of the IoT Edge VM." lightbox="./media/how-to-install-iot-edge-ubuntuvm/iotedge-vm-dns-name.png":::

1. If you want to SSH into this VM after setup, use the associated **DNS Name** with the command:
    `ssh <adminUsername>@<DNS_Name>`

## Deploy from Azure CLI

1. Ensure that you installed the Azure CLI iot extension with:

   ```azurecli-interactive
   az extension add --name azure-iot
   ```

1. Next, if you're using Azure CLI on your desktop, start by logging in:

   ```azurecli-interactive
   az login
   ```

1. If you have multiple subscriptions, select the subscription you'd like to use:
   1. List your subscriptions:

      ```azurecli-interactive
      az account list --output table
      ```

   1. Copy the SubscriptionID field for the subscription you want to use.

   1. Set your working subscription with the ID you copied:

      ```azurecli-interactive
      az account set -s <SubscriptionId>
      ```

1. Create a new resource group (or specify an existing one in the next steps):

   ```azurecli-interactive
   az group create --name IoTEdgeResources --location westus2
   ```

1. Create a new virtual machine:

   To use an **authenticationType** of `password`, use the following example:

   ```azurecli-interactive
   az deployment group create \
   --resource-group IoTEdgeResources \
   --template-uri "https://raw.githubusercontent.com/Azure/iotedge-vm-deploy/main/edgeDeploy.json" \
   --parameters dnsLabelPrefix='my-edge-vm1' \
   --parameters adminUsername='<REPLACE_WITH_USERNAME>' \
   --parameters deviceConnectionString=$(az iot hub device-identity connection-string show --device-id <REPLACE_WITH_DEVICE-NAME> --hub-name <REPLACE-WITH-HUB-NAME> -o tsv) \
   --parameters authenticationType='password' \
   --parameters adminPasswordOrKey="<REPLACE_WITH_SECRET_PASSWORD>"
   ```

   To authenticate with an SSH key, specify an **authenticationType** of `sshPublicKey`, then provide the value of the SSH key in the **adminPasswordOrKey** parameter. See the following example:

   ```azurecli-interactive
   #Generate the SSH Key
   ssh-keygen -m PEM -t rsa -b 4096 -q -f ~/.ssh/iotedge-vm-key -N ""

   #Create a VM using the iotedge-vm-deploy script
   az deployment group create \
   --resource-group IoTEdgeResources \
   --template-uri "https://raw.githubusercontent.com/Azure/iotedge-vm-deploy/main/edgeDeploy.json" \
   --parameters dnsLabelPrefix='my-edge-vm1' \
   --parameters adminUsername='<REPLACE_WITH_USERNAME>' \
   --parameters deviceConnectionString=$(az iot hub device-identity connection-string show --device-id <REPLACE_WITH_DEVICE-NAME> --hub-name <REPLACE-WITH-HUB-NAME> -o tsv) \
   --parameters authenticationType='sshPublicKey' \
   --parameters adminPasswordOrKey="$(< ~/.ssh/iotedge-vm-key.pub)"
   ```

1. Verify that the deployment completed successfully. A virtual machine resource should be deployed into the selected resource group. Take note of the machine name, it's in the format `vm-0000000000000`. Also, take note of the associated **DNS Name**, which is in the format `<dnsLabelPrefix>`.`<location>`.cloudapp.azure.com.

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

    :::image type="content" source="./media/how-to-install-iot-edge-ubuntuvm/iotedge-vm-dns-name.png" alt-text="Screenshot showing the dns name of the IoT Edge VM." lightbox="./media/how-to-install-iot-edge-ubuntuvm/iotedge-vm-dns-name.png":::

1. If you want to SSH into this VM after setup, use the associated **DNS Name** with the command:
    `ssh <adminUsername>@<DNS_Name>`

## Next steps

Now that you provisioned an IoT Edge device with the runtime installed, deploy [IoT Edge modules](how-to-deploy-modules-portal.md).

If you have problems installing the IoT Edge runtime, see the [troubleshooting](troubleshoot.md) page.

To update an existing installation to the latest version of IoT Edge, see [Update the IoT Edge security daemon and runtime](how-to-update-iot-edge.md).

If you want to open ports to access the VM through SSH or other inbound connections, see the Azure Virtual Machines documentation on [opening ports and endpoints to a Linux VM](/azure/virtual-machines/linux/nsg-quickstart).
