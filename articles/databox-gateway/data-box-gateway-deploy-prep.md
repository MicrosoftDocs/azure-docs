---
title: Tutorial on prepare Azure portal to deploy Data Box Gateway | Microsoft Docs
description: First tutorial to deploy Azure Data Box Gateway involves preparing the Azure portal.
services: databox-edge-gateway
author: shaas

ms.service: databox
ms.subservice: gateway
ms.topic: tutorial
ms.date: 12/21/2023
ms.author: shaas
#Customer intent: As an IT admin, I need to understand how to prepare the portal to deploy Data Box Gateway so I can use it to transfer data to Azure.  
---

# Tutorial: Prepare to deploy Azure Data Box Gateway

This is the first tutorial in the series of deployment tutorials required to completely deploy your Azure Data Box Gateway. This tutorial describes how to prepare the Azure portal to deploy Data Box Gateway resource.

You need administrator privileges to complete the setup and configuration process. The portal preparation takes less than 10 minutes.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Create a new resource
> * Download the virtual device image
> * Get the activation key

## Get started

To deploy your Data Box Gateway, refer to the following tutorials in the prescribed sequence.

| **#** | **In this step** | **Use these documents** |
| --- | --- | --- | 
| 1. |**[Prepare the Azure portal for Data Box Gateway](data-box-gateway-deploy-prep.md)** |Create and configure your Data Box Gateway resource prior to provisioning a Data Box Gateway virtual device. |
| 2. |**[Provision the Data Box Gateway in Hyper-V](data-box-gateway-deploy-provision-hyperv.md)** <br><br><br>**[Provision the Data Box Gateway in VMware](data-box-gateway-deploy-provision-vmware.md)**|For Hyper-V, provision and connect to a Data Box Gateway virtual device on a host system running Hyper-V on Windows Server 2016 or Windows Server 2012 R2. <br><br><br> For VMware, provision and connect to a Data Box Gateway virtual device on a host system running VMware ESXi 6.7, 7.0, or 8.0.<br></br> |
| 3. |**[Connect, set up, activate the Data Box Gateway](data-box-gateway-deploy-connect-setup-activate.md)** |Connect to the local web UI, complete the device setup, and activate the device. You can then provision SMB shares.  |
| 4. |**[Transfer data with Data Box Gateway](data-box-gateway-deploy-add-shares.md)** |Add shares, connect to shares via SMB or NFS. |

You can now begin to set up the Azure portal.

## Prerequisites

Here you find the configuration prerequisites for your Data Box Gateway resource, your Data Box Gateway device, and the datacenter network.

### For the Data Box Gateway resource

Before you begin, make sure that:

* Your Microsoft Azure subscription is enabled for an Azure Stack Edge resource. Make sure that you used a supported subscription such as [Microsoft Enterprise Agreement (EA)](https://azure.microsoft.com/overview/sales-number/), [Cloud Solution Provider (CSP)](/partner-center/azure-plan-lp), or [Microsoft Azure Sponsorship](https://azure.microsoft.com/offers/ms-azr-0036p/).
* You have owner or contributor access at resource group level for the Azure Stack Edge / Data Box Gateway, IoT Hub, and Azure Storage resources.
    - To create any Azure Stack Edge / Data Box Gateway resource, you should have permissions as a contributor (or higher) scoped at resource group level. You also need to make sure that the `Microsoft.DataBoxEdge` provider is registered. For information on how to register, go to [Register resource provider](data-box-gateway-manage-access-power-connectivity-mode.md#register-resource-providers).
    - To create a Storage account resource, again you need contributor or higher access scoped at the resource group level. Azure Storage is by default a registered resource provider.
- You have admin or user access to Microsoft Graph API. For more information, see [Microsoft Graph permissions reference](/graph/permissions-reference).
- You have your Microsoft Azure storage account with access credentials.

### For the Data Box Gateway device

Before you deploy a virtual device, make sure that:

- You have access to a host system running Hyper-V on Windows Server 2012 R2 or later or VMware ESXi 6.7, 7.0, or 8.0 that can be used to a provision a device.
- The host system is able to dedicate the following resources to provision your Data Box virtual device:
  
  - A minimum of 4 virtual processors.
  - At least 8 GB of RAM. We strongly recommend at least 16 GB of RAM.
  - One network interface.
  - A 250 GB OS disk.
  - A 2 TB virtual disk for system data.

### For the datacenter network

Before you begin, make sure that:

- The network in your datacenter is configured as per the networking requirements for your Data Box Gateway device. For more information, see the [Data Box Gateway system requirements](data-box-gateway-system-requirements.md).

- For normal operating conditions of your Data Box Gateway, you should have a:

    - A minimum of 10-Mbps download bandwidth to ensure the device stays updated.
    - A minimum of 20-Mbps dedicated upload and download bandwidth to transfer files.

## Create a new resource

If you have an existing Data Box Gateway resource to manage your virtual devices, skip this step and go to [Get the activation key](#get-the-activation-key).

To create a Data Box Gateway resource, take the following steps in the Azure portal.

1. Use your Microsoft Azure credentials to sign in to either of these portals:

    - The Azure portal at this URL: [https://portal.azure.com](https://portal.azure.com).
    - The Azure Government portal at this URL: [https://portal.azure.us](https://portal.azure.us). For details, go to [Connect to Azure Government using the portal](../azure-government/documentation-government-get-started-connect-with-portal.md).

1. Select **+ Create a resource**.

    :::image type="content" source="media/data-box-gateway-deploy-prep/data-box-gateway-create-a-resource-sml.png" alt-text="Screenshot of Azure Data Box Gateway's Create a Resource button." lightbox="media/data-box-gateway-deploy-prep/data-box-gateway-create-a-resource.png":::

1. Type **Data Box Gateway** in the search box, and press Enter.

    :::image type="content" source="media/data-box-gateway-deploy-prep/data-box-gateway-search-box.png" alt-text="Screenshot showing the location of the Search box for the Data Box Gateway service.":::

    Next, select **Azure Data Box Gateway**.

    :::image type="content" source="media/data-box-gateway-deploy-prep/data-box-gateway-sku-sml.png" alt-text="Screenshot showing the Azure Data Box Gateway included in the Azure search results." lightbox="media/data-box-gateway-deploy-prep/data-box-gateway-sku.png":::

1. Select **Create**.

    :::image type="content" source="media/data-box-gateway-deploy-prep/data-box-gateway-create.png" alt-text="Screenshot showing the location of the Create button used to create the Data Box Gateway resource.":::

1. On the **Basics** tab:

    Enter or select the following **Project details**.

    |Setting  |Value  |
    |---------|---------|
    |Subscription    |Pick the subscription that you want to use for your Data Box Gateway device. The subscription is linked to your billing account.|
    |Resource group  |Select an existing group or create a new group.<br>Learn more about [Azure Resource Groups](../azure-resource-manager/management/overview.md).|

   Enter or select the following **Instance details**.

    |Setting  |Value  |
    |---------|---------|
    |Name   |A friendly name to identify the resource.<br>The name has between 2 and 50 characters containing letters, numbers, and hyphens. <br> The name must start and end with a letter or a number. |
    |Region  |Select the region where you want to deploy your resource. Choose a location close to the geographic region where you want to deploy your device. <br> For a list of all regions where Data Base Gateway/Azure Stack Edge resources are available, see [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=databox&regions=all). <br> For the Azure Government, all the government regions listed in the [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/) are available.|

   Finally, select **Review + create** to review your order.

    :::image type="content" source="media/data-box-gateway-deploy-prep/data-box-gateway-basics-sml.png" alt-text="Sreenshot of a Project and Instance detail entry for a Data Box Gateway order." lightbox="media/data-box-gateway-deploy-prep/data-box-gateway-basics.png":::

1. On the **Review + create** tab, review the **Pricing details**, **Terms of use**, and the details for your resource. Select **Create**.

    :::image type="content" source="media/data-box-gateway-deploy-prep/data-box-gateway-resource-review-create.png" alt-text="Screenshot of the Data Box Gateway resource details displayed for review.":::

The resource creation takes a few minutes. After the resource is successfully created and deployed, you're notified. Select **Go to resource**.

:::image type="content" source="media/data-box-gateway-deploy-prep/data-box-gateway-completed-order-sml.png" alt-text="Screenshot of a completed Data Box Gateway order" lightbox="media/data-box-gateway-deploy-prep/data-box-gateway-completed-order.png":::

## Download the virtual device image

After the Data Box Gateway resource is created, download the appropriate virtual device image to provision a virtual device on your host system. The virtual device images are specific to an operating system.

> [!IMPORTANT]
> The software running on the Data Box Gateway may only be used with the Data Box Gateway resource.

Follow these steps in the [Azure portal](https://portal.azure.com/) to download a virtual device image.

1. In the resource that you created and then select **Overview**. If you have an existing Azure Data Box Gateway resource, select the resource and go to **Overview**. Select **Device setup**.

    :::image type="content" source="media/data-box-gateway-deploy-prep/data-box-gateway-resource-created-sml.png" alt-text="Screenshot of a new Data Box Gateway resource." lightbox="media/data-box-gateway-deploy-prep/data-box-gateway-resource-created.png":::

1. On the **Download image** tile, select the virtual device image corresponding to the operating system on the host server used to provision the VM. The image files are approximately 5.6 GB.

   * [VHDX for Hyper-V on Windows Server 2012 R2 and later](https://aka.ms/dbe-vhdx-2012).
   * [VMDK for VMware ESXi 6.7, 7.0, or 8.0](https://aka.ms/dbg-rel-vmdk).

    :::image type="content" source="media/data-box-gateway-deploy-prep/data-box-gateway-download-image-sml.png" alt-text="Screenshot showing the location of the link used to download a Data Box Gateway virtual device image." lightbox="media/data-box-gateway-deploy-prep/data-box-gateway-download-image.png":::

1. Download and unzip the file to a local drive, making a note of where the unzipped file is located.

## Get the activation key

After the Data Box Gateway resource is up and running, you'll need to get the activation key. This key is used to activate and connect your Data Box Gateway device with the resource. You can get this key now while you are in the Azure portal.

1. Select the resource that you created, and then select **Overview**. In the **Device setup**, go to the **Configure and activate** tile.

    :::image type="content" source="media/data-box-gateway-deploy-prep/data-box-gateway-configure-activate-sml.png" alt-text="Screenshot illustrating the location of the Configure and activate tile." lightbox="media/data-box-gateway-deploy-prep/data-box-gateway-configure-activate.png":::

2. Select **Generate key** to create an activation key. Select the copy icon to copy the key and save it for later use.

    :::image type="content" source="media/data-box-gateway-deploy-prep/get-activation-key-sml.png" alt-text="Screenshot showing the location of the Activation key after it has been generated." lightbox="media/data-box-gateway-deploy-prep/get-activation-key.png":::

> [!IMPORTANT]
> - The activation key expires three days after it is generated.
> - If the key has expired, generate a new key. The older key is not valid.

## Next steps

In this tutorial, you learned about Data Box Gateway topics such as:

> [!div class="checklist"]
> * Create a new resource
> * Download the virtual device image
> * Get the activation key

Advance to the next tutorial to learn how to provision a virtual machine for your Data Box Gateway. Depending on your host operating system, see the detailed instructions in:

> [!div class="nextstepaction"]
> [Provision a Data Box Gateway in Hyper-V](./data-box-gateway-deploy-provision-hyperv.md)

OR

> [!div class="nextstepaction"]
> [Provision a Data Box Gateway in VMware](./data-box-gateway-deploy-provision-vmware.md)