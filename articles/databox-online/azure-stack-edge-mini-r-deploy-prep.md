---
title: Tutorial to prepare Azure portal, datacenter environment to deploy Azure Stack Edge Mini R device | Microsoft Docs
description: The first tutorial about deploying Azure Stack Edge Mini R device involves preparing the Azure portal.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.custom: devx-track-azurecli
ms.topic: tutorial
ms.date: 02/23/2022
ms.author: alkohli
# Customer intent: As an IT admin, I need to understand how to prepare the portal to deploy Azure Stack Edge Mini R device so I can use it to transfer data to Azure.
---

# Tutorial: Prepare to deploy Azure Stack Edge Mini R

This tutorial is the first in the series of deployment tutorials that are required to completely deploy an Azure Stack Edge Mini R device. This tutorial describes how to prepare the Azure portal to deploy an Azure Stack Edge resource.

You need administrator privileges to complete the setup and configuration process. The portal preparation takes less than 10 minutes.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a new resource
> * Get the activation key

### Get started

To deploy Azure Stack Edge Mini R, refer to the following tutorials in the prescribed sequence.

| Step | Description |
| --- | --- |
| **Preparation** |These steps must be completed in preparation for the upcoming deployment. |
| **[Deployment configuration checklist](#deployment-configuration-checklist)** |Use this checklist to gather and record information before and during the deployment. |
| **[Deployment prerequisites](#prerequisites)** |These prerequisites validate that the environment is ready for deployment. |
|  | |
|**Deployment tutorials** |These tutorials are required to deploy your Azure Stack Edge Mini R device in production. |
|**[1. Prepare the Azure portal for device](azure-stack-edge-mini-r-deploy-prep.md)** |Create and configure your Azure Stack Edge resource before you install the physical device. |
|**[2. Install the device](azure-stack-edge-mini-r-deploy-install.md)**|Inspect and cable your physical device.  |
|**[3. Connect to the device](azure-stack-edge-mini-r-deploy-connect.md)** |Once the device is installed, connect to device local web UI.  |
|**[4. Configure network settings](azure-stack-edge-mini-r-deploy-configure-network-compute-web-proxy.md)** |Configure network including the compute network and web proxy settings for your device.   |
|**[5. Configure device settings](azure-stack-edge-mini-r-deploy-set-up-device-update-time.md)** |Assign a device name and DNS domain, configure update server and device time. |
|**[6. Configure security settings](azure-stack-edge-mini-r-deploy-configure-certificates-vpn-encryption.md)** |Configure certificates using your own certificates, set up VPN, and configure encryption-at-rest for your device.   |
|**[7. Activate the device](azure-stack-edge-mini-r-deploy-activate.md)** |Use the activation key from service to activate the device. The device is ready to set up SMB or NFS shares or connect via REST. |
|**[8. Configure compute](azure-stack-edge-gpu-deploy-configure-compute.md)** |Configure the compute role on your device. A Kubernetes cluster is also created. |

You can now begin to set up the Azure portal.

## Deployment configuration checklist

Before you deploy your device, you need to collect information to configure the software on your Azure Stack Edge Mini R device. Preparing some of this information ahead of time helps streamline the process of deploying the device in your environment. Use the [Azure Stack Edge Mini R deployment configuration checklist](azure-stack-edge-mini-r-deploy-checklist.md) to note down the configuration details as you deploy your device.

## Prerequisites

Following are the configuration prerequisites for your Azure Stack Edge resource, your Azure Stack Edge device, and the datacenter network.

### For the Azure Stack Edge resource

[!INCLUDE [Azure Stack Edge resource prerequisites](../../includes/azure-stack-edge-gateway-resource-prerequisites.md)]

### For the Azure Stack Edge device

Before you deploy a physical device, make sure that:

- You've [run the Azure Stack Network Readiness Checker tool](azure-stack-edge-deploy-check-network-readiness.md) to check network readiness for your Azure Stack Edge device. You can use the tool to check whether your firewall rules are blocking access to any essential URLs for the service and verify custom URLs, among other tests. For more information, see [Check network readiness for your Azure Stack Edge device](azure-stack-edge-deploy-check-network-readiness.md).

- You've reviewed the safety information for this device at [Safety guidelines for your Azure Stack Edge device](azure-stack-edge-mini-r-safety.md).
[!INCLUDE [Azure Stack Edge device prerequisites](../../includes/azure-stack-edge-gateway-device-prerequisites.md)] 

### For the datacenter network

Before you begin, make sure that:

- The network in your datacenter is configured per the networking requirements for your Azure Stack Edge device. For more information, see [Azure Stack Edge Mini R system requirements](azure-stack-edge-mini-r-system-requirements.md).

- For normal operating conditions of your Azure Stack Edge, you have:

    - A minimum of 10-Mbps download bandwidth to ensure the device stays updated.
    - A minimum of 20-Mbps dedicated upload and download bandwidth to transfer files.

## Create a new resource

If you have an existing Azure Stack Edge resource to manage your physical device, skip this step and go to [Get the activation key](#get-the-activation-key).

### [Azure Edge Hardware Center (Preview)](#tab/azure-edge-hardware-center)

Azure Edge Hardware Center (Preview) lets you explore and order a variety of hardware from the Azure hybrid portfolio including Azure Stack Edge Pro devices.

When you place an order through the Azure Edge Hardware Center, you can order multiple devices, to be shipped to more than one address, and you can reuse ship to addresses from other orders.

Ordering through Azure Edge Hardware Center will create an Azure resource that will contain all your order-related information. One resource each will be created for each of the units ordered. You will have to create an Azure Stack Edge resource after you receive the device to activate and manage it.

[!INCLUDE [Create order in Azure Edge Hardware Center](../../includes/azure-edge-hardware-center-new-order.md)]

#### Create a management resource for each device

To manage devices that are ordered through the Azure Edge Hardware Center, you'll create a management resource for each device in Azure Stack Edge. When the device is activated, the management resource is associated with an order item. You'll be able to open the order item from the management resource and open the management resource from the order item. 

After a device is delivered, a **Configure hardware** link is added to the order item detail, giving you a direct way to open a wizard for creating a management resource. You can also use the **Create management resource** option in Azure Stack Edge.

[!INCLUDE [Create management resource](../../includes/azure-edge-hardware-center-create-management-resource.md)]

### [Azure CLI](#tab/azure-cli)

If necessary, prepare your environment for Azure CLI.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

To create an Azure Stack Edge resource, run the following commands in Azure CLI.

1. Create a resource group by using the [az group create](/cli/azure/group#az-group-create) command, or use an existing resource group:

   ```azurecli
   az group create --name myasepgpu1 --location eastus
   ```

1. To create a device, use the [az databoxedge device create](/cli/azure/databoxedge/device#az-databoxedge-device-create) command:

   ```azurecli
   az databoxedge device create --resource-group myasepgpu1 \
      --device-name myasegpu1 --location eastus --sku EdgeMR_Mini
   ```

   Choose a location closest to the geographical region where you want to deploy your device. The region stores only the metadata for device management. The actual data can be stored in any storage account.

   For a list of all the regions where the Azure Stack Edge resource is available, see [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=databox&regions=all). If using Azure Government, all the government regions are available as shown in the [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/).

1. To create an order, run the [az databoxedge order create](/cli/azure/databoxedge/order#az-databoxedge-order-create) command:

   ```azurecli
   az databoxedge order create --resource-group myasepgpu1 \
      --device-name myasegpu1 --company-name "Contoso" \
      --address-line1 "1020 Enterprise Way" --city "Sunnyvale" \
      --state "California" --country "United States" --postal-code 94089 \
      --contact-person "Gus Poland" --email-list gus@contoso.com --phone 4085555555
   ```

The resource creation takes a few minutes. Run the [az databoxedge order show](/cli/azure/databoxedge/order#az-databoxedge-order-show) command to see the order:

```azurecli
az databoxedge order show --resource-group myasepgpu1 --device-name myasegpu1 
```

After you place an order, Microsoft reviews the order and contacts you by email with shipping details.

---

## Get the activation key

After the Azure Stack Edge resource is up and running, you'll need to get the activation key. This key is used to activate and connect your Azure Stack Edge Mini R device with the resource. You can get this key now while you are in the Azure portal.

1. Select the resource you created, and select **Overview**.

   ![Screenshot of the Overview pane for an Azure Stack Edge resource.](media/azure-stack-edge-mini-r-deploy-prep/azure-stack-edge-resource-2.png)

2. On the **Activate** tile, provide a name for the Azure Key Vault, or accept the default name. The key vault name can be between 3 and 24 characters. 

    A key vault is created for each Azure Stack Edge resource that is activated with your device. The key vault lets you store and access secrets. For example, the Channel Integrity Key (CIK) for the service is stored in the key vault.

    Once you've specified a key vault name, select **Generate activation key** to create an activation key.

    [![Screenshot of Overview pane for newly created Azure Stack Edge resource, with a key vault name entry. The entry and the Generate Activation Key button are highlighted.](media/azure-stack-edge-mini-r-deploy-prep/azure-stack-edge-resource-3.png)](media/azure-stack-edge-mini-r-deploy-prep/azure-stack-edge-resource-3.png#lightbox)

    Wait a few minutes while the key vault and activation key are created. Select the copy icon to copy the key and save it for later use.

> [!IMPORTANT]
> - The activation key expires three days after it is generated.
> - If the key has expired, generate a new key. The older key is not valid.

## Next steps

In this tutorial, you learned about Azure Stack Edge topics such as:

> [!div class="checklist"]
> * Create a new resource
> * Get the activation key

Advance to the next tutorial to learn how to install Azure Stack Edge.

> [!div class="nextstepaction"]
> [Install Azure Stack Edge](./azure-stack-edge-mini-r-deploy-install.md)
