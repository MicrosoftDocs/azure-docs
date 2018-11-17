---
title: Tutorial on prepare Azure portal to deploy Data Box Gateway | Microsoft Docs
description: First tutorial to deploy Azure Data Box Gateway involves preparing the Azure portal.
services: databox-edge-gateway
author: alkohli

ms.service: databox
ms.subservice: gateway
ms.topic: tutorial
ms.date: 09/24/2018
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to prepare the portal to deploy Data Box Gateway so I can use it to transfer data to Azure. 
---
# Tutorial: Prepare to deploy Azure Data Box Gateway (Preview)


This is the first tutorial in the series of deployment tutorials required to completely deploy your Azure Data Box Gateway. This tutorial describes how to prepare the Azure portal to deploy Data Box Gateway resource. 

You need administrator privileges to complete the setup and configuration process. The portal preparation takes less than 10 minutes.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a new resource
> * Download the virtual device image
> * Get the activation key

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.


> [!IMPORTANT]
> - Data Box Gateway is in preview. Review the [Azure terms of service for preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) before you order and deploy this solution. 

### Get started

To deploy your Data Box Gateway, refer to the following tutorials in the prescribed sequence.

| **#** | **In this step** | **Use these documents** |
| --- | --- | --- | 
| 1. |**[Prepare the Azure portal for Data Box Gateway](data-box-gateway-deploy-prep.md)** |Create and configure your Data Box Gateway resource prior to provisioning a Data Box Gateway virtual device. |
| 2. |**[Provision the Data Box Gateway in Hyper-V](data-box-gateway-deploy-provision-hyperv.md)** <br><br><br>**[Provision the Data Box Gateway in VMware](data-box-gateway-deploy-provision-vmware.md)**|For Hyper-V, provision and connect to a Data Box Gateway virtual device on a host system running Hyper-V on Windows Server 2016 or Windows Server 2012 R2. <br><br><br> For VMware, provision and connect to a Data Box Gateway virtual device on a host system running VMware ESXi 6.0 or 6.5.<br></br> |
| 3. |**[Connect, set up, activate the Data Box Gateway](data-box-gateway-deploy-connect-setup-activate.md)** |Connect to the local web UI, complete the device setup, and activate the device. You can then provision SMB shares.  |
| 4. |**[Transfer data with Data Box Gateway](data-box-gateway-deploy-add-shares.md)** |Add shares, connect to shares via SMB or NFS. |

You can now begin to set up the Azure portal.

## Prerequisites

Here you find the configuration prerequisites for your Data Box Gateway resource, your Data Box Gateway device, and the datacenter network.

### For the Data Box Gateway resource

Before you begin, make sure that:

* Your Microsoft Azure subscription should be enabled for Data Box Gateway resource.
* You have your Microsoft Azure storage account with access credentials.

### For the Data Box Gateway device

Before you deploy a virtual device, make sure that:

* You have access to a host system running Hyper-V on Windows Server 2012 R2 or later or VMware (ESXi 6.0 or 6.5) that can be used to a provision a device.
* The host system is able to dedicate the following resources to provision your Data Box virtual device:
  
  * A minimum of 4 cores.
  * At least 8 GB of RAM. 
  * One network interface.
  * A 250 GB OS disk.
  * A 2 TB virtual disk for system data.

### For the datacenter network

Before you begin, make sure that:

* The network in your datacenter is configured as per the networking requirements for your Data Box Gateway device. For more information, see the [Data Box Gateway System Requirements](data-box-gateway-system-requirements.md).

* Your Data Box Gateway has a dedicated 20 Mbps Internet bandwidth (or more) available at all times. This bandwidth should not be shared with any other applications. If using network throttling, then for throttling to work, we recommend that you use 32 Mbps Internet bandwidth or more.

## Create a new resource

Perform the following steps to create a new Data Box Gateway resource. 

If you have an existing Data Box Gateway resource to manage your virtual devices, skip this step and go to [Get the activation key](#get-the-activation-key).

Perform the following steps in the Azure portal to create a Data Box resource.
1. Use your Microsoft Azure credentials to log into Azure preview portal at this URL: [https://aka.ms/databox-edge](https://aka.ms/databox-edge). 

2. Pick the subscription that you want to use for Data Box Edge preview. Select the region where you want to deploy the Data Box Edge resource. In the **Data Box Gateway** option, click **Create**.

    ![Search Data Box Gateway service](media/data-box-gateway-deploy-prep/data-box-gateway-edge-sku.png)

3. For the new resource, enter or select the following information.
    
    |Setting  |Value  |
    |---------|---------|
    |Resource name   | A friendly name to identify the resource.<br>The name has between 2 and 50 characters containing letter, numbers, and hyphens.<br> Name starts and ends with a letter or a number.        |
    |Subscription    |Subscription is linked to your billing account. |
    |Resource group  |Select an existing group or create a new group.<br>Learn more about [Azure Resource Groups](../azure-resource-manager/resource-group-overview.md).     |
    |Location     |For this release, East US, West US 2, South East Asia, and West Europe are available. <br> Choose a location closest to the geographical region where you want to deploy your device.|
    
    ![Create Data Box Gateway resource](media/data-box-gateway-deploy-prep/data-box-gateway-resource.png)
    
4. Click **OK**.
 
The resource creation takes a few minutes. After the resource is successfully created, you are notified appropriately.


## Download the virtual device image

After the Data Box Gateway resource is created, download the appropriate virtual device image to provision a virtual device on your host system. The virtual device images are operating system specific and can be downloaded from the **Quickstart** blade of your resource in the Azure portal.

> [!IMPORTANT]
> The software running on the Data Box Gateway may only be used with the Data Box Gateway resource.


Perform the following steps in the [Azure portal](https://portal.azure.com/).

1. Click the resource that you created and then click **Overview**. If you have an existing Azure Data Box Gateway resource, click on the resource and go to **Overview**.

    ![New Data Box Gateway resource](media/data-box-gateway-deploy-prep/data-box-gateway-resource-created.png)

4. In the quickstart in the right pane, click the link corresponding to the image that you want to download. The image files are approximately 4.8 GB.
   
   * [VHDX for Hyper-V on Windows Server 2012 R2 and later](https://aka.ms/dbe-vhdx-2012).
   * [VMDK for VMWare ESXi 6.0 or 6.5](https://aka.ms/dbe-vmdk).

5. Download and unzip the file to a local drive, making a note of where the unzipped file is located.


## Get the activation key

After the Data Box Gateway resource is up and running, you will need to get the activation key. This key is used to activate and connect your Data Box Gateway device with the resource.

The activation key is used to register all the Data Box Gateway devices that need to activate with your Data Box Gateway resource. You can get this key now while you are in the Azure portal.

1. Click the resource that you created and then click **Overview**.

    ![New Data Box Gateway resource](media/data-box-gateway-deploy-prep/data-box-gateway-resource-created.png)

2. Click **Generate key** to create an activation key. Click copy icon to copy the key and save it for later use.

    ![Get activation key](media/data-box-gateway-deploy-prep/get-activation-key.png)

> [!IMPORTANT]
> - The activation key expires 3 days after it is generated. 
> - If the key has epxired, generate a new key. The older key is not valid.

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


