---
title: Run Azure IoT Edge on Ubuntu Virtual Machines
description: How to run Azure IoT Edge on an Ubuntu virtual machine
author: PatAltimore
ms.service: iot-edge
ms.custom: devx-track-azurecli
services: iot-edge
ms.topic: how-to
ms.date: 06/03/2024
ms.author: pdecarlo
---
# Run Azure IoT Edge on Ubuntu Virtual Machines

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

The Azure IoT Edge runtime is what turns a device into an IoT Edge device. The runtime can be deployed on devices as small as a Raspberry Pi or as large as an industrial server. Once a device is configured with the IoT Edge runtime, you can start deploying business logic to it from the cloud.

To learn more about how the IoT Edge runtime works and what components are included, see [Understand the Azure IoT Edge runtime and its architecture](iot-edge-runtime.md).

This article lists the steps to deploy an Ubuntu virtual machine with the Azure IoT Edge runtime installed and configured using a presupplied device connection string. The deployment is accomplished using a [cloud-init](../virtual-machines/linux/using-cloud-init.md) based [Azure Resource Manager template](../azure-resource-manager/templates/overview.md) maintained in the [iotedge-vm-deploy](https://github.com/Azure/iotedge-vm-deploy) project repository.

On first boot, the virtual machine [installs the latest version of the Azure IoT Edge runtime via cloud-init](https://github.com/Azure/iotedge-vm-deploy/blob/main/cloud-init.txt). It also sets a supplied connection string before the runtime starts, allowing you to easily configure and connect the IoT Edge device without the need to start an SSH or remote desktop session.

## Deploy using Deploy to Azure Button

The [Deploy to Azure Button](../azure-resource-manager/templates/deploy-to-azure-button.md) allows for streamlined deployment of [Azure Resource Manager templates](../azure-resource-manager/templates/overview.md) maintained on GitHub. 
 This section demonstrates usage of the Deploy to Azure Button contained in the [iotedge-vm-deploy](https://github.com/Azure/iotedge-vm-deploy) project repository.

1. You will deploy an Azure IoT Edge enabled Linux VM using the iotedge-vm-deploy Azure Resource Manager template. To begin, select the following button:

   [![Deploy to Azure Button for iotedge-vm-deploy](https://aka.ms/deploytoazurebutton)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fazure%2Fiotedge-vm-deploy%2Fmain%2FedgeDeploy.json)

1. On the newly launched window, fill in the available form fields:

    > [!div class="mx-imgBorder"]

    > [![Screenshot showing the iotedge-vm-deploy template](./media/how-to-install-iot-edge-ubuntuvm/iotedge-vm-deploy-ubuntu2004.png)](./media/how-to-install-iot-edge-ubuntuvm/iotedge-vm-deploy-ubuntu2004.png)

   | Field | Description |
   | --------- | ----------- |
   | **Subscription** | The active Azure subscription to deploy the virtual machine into. |
   | **Resource group** | An existing or newly created Resource Group to contain the virtual machine and it's associated resources. |
   | **Region** | The [geographic region](https://azure.microsoft.com/global-infrastructure/locations/) to deploy the virtual machine into, this value defaults to the location of the selected Resource Group. |
   | **DNS Label Prefix** | A required value of your choosing that is used to prefix the hostname of the virtual machine. |
   | **Admin Username** | A username that is provided root privileges on deployment. |
   | **Device Connection String** | A [device connection string](./how-to-provision-single-device-linux-symmetric.md#view-registered-devices-and-retrieve-provisioning-information) for a device that was created within your intended [IoT Hub](../iot-hub/about-iot-hub.md). |
   | **VM Size** | The [size](../cloud-services/cloud-services-sizes-specs.md) of the virtual machine to be deployed. |
   | **Ubuntu OS Version** | The version of the Ubuntu OS to be installed on the base virtual machine. |
   | **Authentication Type** | Choose **sshPublicKey** or **password** depending on your preference. |
   | **Admin Password or Key** | The value of the SSH Public Key or the value of the password depending on the choice of Authentication Type. |

    Select `Next : Review + create` to review the terms and select **Create** to begin the deployment.

1. Verify that the deployment completed successfully. A virtual machine resource is deployed into the selected resource group. Take note of the machine name, this should be in the format `vm-0000000000000`. Also, take note of the associated **DNS Name**, which should be in the format `<dnsLabelPrefix>`.`<location>`.cloudapp.azure.com.

    The **DNS Name** can be obtained from the **Overview** section of the newly deployed virtual machine within the Azure portal.

    > [!div class="mx-imgBorder"]
    > [![Screenshot showing the dns name of the iotedge vm](./media/how-to-install-iot-edge-ubuntuvm/iotedge-vm-dns-name.png)](./media/how-to-install-iot-edge-ubuntuvm/iotedge-vm-dns-name.png)

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

   1. Copy the SubscriptionID field for the subscription you'd like to use.

   1. Set your working subscription with the ID that you copied:

      ```azurecli-interactive
      az account set -s <SubscriptionId>
      ```

1. Create a new resource group (or specify an existing one in the next steps):

   ```azurecli-interactive
   az group create --name IoTEdgeResources --location westus2
   ```

1. Create a new virtual machine:

   To use an **authenticationType** of `password`, see the following example:

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

1. Verify that the deployment completed successfully. A virtual machine resource should be deployed into the selected resource group.  Take note of the machine name, this should be in the format `vm-0000000000000`. Also, take note of the associated **DNS Name**, which should be in the format `<dnsLabelPrefix>`.`<location>`.cloudapp.azure.com.

    The **DNS Name** can be obtained from the JSON-formatted output of the previous step, within the **outputs** section as part of the **public SSH** entry.  The value of this entry can be used to SSH into to the newly deployed machine.

    ```bash
    "outputs": {
      "public SSH": {
        "type": "String",
        "value": "ssh <adminUsername>@<DNS_Name>"
      }
    }
    ```

    The **DNS Name** can also be obtained from the **Overview** section of the newly deployed virtual machine within the Azure portal.

    > [!div class="mx-imgBorder"]
    > [![Screenshot showing the dns name of the iotedge vm](./media/how-to-install-iot-edge-ubuntuvm/iotedge-vm-dns-name.png)](./media/how-to-install-iot-edge-ubuntuvm/iotedge-vm-dns-name.png)

1. If you want to SSH into this VM after setup, use the associated **DNS Name** with the command:
    `ssh <adminUsername>@<DNS_Name>`

## Next steps

Now that you have an IoT Edge device provisioned with the runtime installed, you can [deploy IoT Edge modules](how-to-deploy-modules-portal.md).

If you are having problems with the IoT Edge runtime installing properly, check out the [troubleshooting](troubleshoot.md) page.

To update an existing installation to the newest version of IoT Edge, see [Update the IoT Edge security daemon and runtime](how-to-update-iot-edge.md).

If you'd like to open up ports to access the VM through SSH or other inbound connections, refer to the Azure Virtual Machines documentation on [opening up ports and endpoints to a Linux VM](../virtual-machines/linux/nsg-quickstart.md).
