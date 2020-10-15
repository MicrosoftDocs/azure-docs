---
title: Tutorial to prepare Azure portal, datacenter environment to deploy Azure Stack Edge Pro R
description: The first tutorial about deploying Azure Stack Edge Pro R involves preparing the Azure portal.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: tutorial
ms.date: 10/15/2020
ms.author: alkohli
Customer intent: As an IT admin, I need to understand how to prepare the portal to deploy Azure Stack Edge Pro R so I can use it to transfer data to Azure. 
---
# Tutorial: Prepare to deploy Azure Stack Edge Pro R

This is the first tutorial in the series of deployment tutorials that are required to completely deploy Azure Stack Edge Pro R. This tutorial describes how to prepare the Azure portal to deploy an Azure Stack Edge resource. The tutorial uses a 1-node Azure Stack Edge Pro R device shipped with an Uninterruptible Power Supply (UPS).

You need administrator privileges to complete the setup and configuration process. The portal preparation takes less than 10 minutes.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Create a new resource
> * Get the activation key

### Get started

To deploy Azure Stack Edge Pro R, refer to the following tutorials in the prescribed sequence.

| To do this step | Use these documents |
| --- | --- |
| **Preparation** |These steps must be completed in preparation for the upcoming deployment. |
| **[Deployment configuration checklist](#deployment-configuration-checklist)** |Use this checklist to gather and record information before and during the deployment. |
| **[Deployment prerequisites](#prerequisites)** |These validate the environment is ready for deployment. |
|  | |
|**Deployment tutorials** |These tutorials are required to deploy your Azure Stack Edge Pro R device in production. |
|**[1. Prepare the Azure portal for device](azure-stack-edge-pro-r-deploy-prep.md)** |Create and configure your Azure Stack Edge resource before you install an Azure Stack Box Edge physical device. |
|**[2. Install the device](azure-stack-edge-mini-r-deploy-install.md)**|Unpack, rack, and cable your physical device.  |
|**[3. Connect to the device](azure-stack-edge-pro-r-deploy-connect.md)** |Once the device is installed, connect to device local web UI.  |
|**[4. Configure network settings](azure-stack-edge-pro-r-deploy-configure-network-compute-web-proxy.md)** |Configure network including the compute network and web proxy settings for your device.   |
|**[5. Configure device settings](azure-stack-edge-pro-r-deploy-set-up-device-update-time.md)** |Assign a device name and DNS domain, configure update server and device time. |
|**[6. Configure security settings](azure-stack-edge-pro-r-deploy-configure-certificates.md)** |Configure certificates, VPN, encryption-at-rest for your device. Use device generated certificates or bring your own certificates.   |
|**[7. Activate the device](azure-stack-edge-pro-r-deploy-activate.md)** |Use the activation key from service to activate the device. The device is ready to set up SMB or NFS shares or connect via REST. |
|**[8. Configure compute](azure-stack-edge-gpu-deploy-configure-compute.md)** |Configure the compute role on your device. This will also create a Kubernetes cluster. |

You can now begin to set up the Azure portal.

## Prerequisites

Following are the configuration prerequisites for your Azure Stack Edge resource, your Azure Stack Edge device, and the datacenter network.

### For the Azure Stack Edge resource

[!INCLUDE [Azure Stack Edge resource prerequisites](../../includes/azure-stack-edge-gateway-resource-prerequisites.md)]

### For the Azure Stack Edge device

Before you deploy a physical device, make sure that:

- You've reviewed the safety information for this device at: [Safety guidelines for your Azure Stack Edge device](azure-stack-edge-j-series-safety.md).
[!INCLUDE [Azure Stack Edge device prerequisites](../../includes/azure-stack-edge-gateway-device-prerequisites.md)] 



### For the datacenter network

Before you begin, make sure that:

- The network in your datacenter is configured per the networking requirements for your Azure Stack Edge device. For more information, see [Azure Stack Edge Pro R System Requirements](azure-stack-edge-pro-r-system-requirements.md).

- For normal operating conditions of your device, you have:

    - A minimum of 10-Mbps download bandwidth to ensure the device stays updated.
    - A minimum of 20-Mbps dedicated upload and download bandwidth to transfer files.

## Create a new resource

If you have an existing Azure Stack Edge resource to manage your physical device, skip this step and go to [Get the activation key](#get-the-activation-key).

To create a Azure Stack Edge resource, take the following steps in the Azure portal.

1. Use your Microsoft Azure credentials to sign in to: 
    
    - The Azure portal at this URL: [https://portal.azure.com](https://portal.azure.com).
    - Or, the Azure Government portal at this URL: [https://portal.azure.us](https://portal.azure.us). For more details, go to [Connect to Azure Government using the portal](../azure-government/documentation-government-get-started-connect-with-portal.md).

2. In the left-pane, select **+ Create a resource**. 

    ![Create new resource](media/azure-stack-edge-j-series-deploy-prep/order-1.png)

3. Search for **Azure Stack Edge**. Select **Azure Stack Edge**. 

    ![Search Data Box Edge/ Data Box Gateway service](media/azure-stack-edge-j-series-deploy-prep/order-2.png)

4. Select **Create**.

    <!--![Select create](media/azure-stack-edge-j-series-deploy-prep/order-3.png)-->

5. Pick the subscription that you want to use for the Azure Stack Edge device. Select the region where you want to deploy the Azure Stack Edge resource. For this release, East US, West US2, and South Central US are available. 

    Choose a location closest to the geographical region where you want to deploy your device. The region stores only the metadata for device management. The actual data can be stored in any storage account. 
    
    Select **Apply**.

    ![Pick subscription, location, country](media/azure-stack-edge-j-series-deploy-prep/order-4.png)

5. Select your Azure Stack Edge device. In this example, **Azure Stack Edge Rugged J-series** was selected.

    ![Pick Azure Stack Edge device](media/azure-stack-edge-j-series-deploy-prep/order-5.png)

3. On the **Basics** tab, enter or select the following **Project details**.
    
    |Setting  |Value  |
    |---------|---------|
    |Subscription    |This is automatically populated based on the earlier selection. Subscription is linked to your billing account. |
    |Resource group  |Select an existing group or create a new group.<br>Learn more about [Azure Resource Groups](../azure-resource-manager/resource-group-overview.md).     |

4. Enter or select the following **Instance details**.

    |Setting  |Value  |
    |---------|---------|
    |Name   | A friendly name to identify the resource.<br>The name has between 2 and 50 characters containing letter, numbers, and hyphens.<br> Name starts and ends with a letter or a number.        |
    |Region     |For this release, East US, West US2, and South Central US are available to deploy your resource. If using Azure Government, all the government regions are available as shown in the [Azure regions](https://azure.microsoft.com/global-infrastructure/regions/).<br> Choose a location closest to the geographical region where you want to deploy your device.|
    |Configuration   | Choose the appropriate configuration for your device. The following configurations are available: <ul><li>1-node device</li><li> 1-node device with UPS.</li><li>1-node device with UPS and heater</li><li>4-node device</li><li>4-node device with UPS</li><li>4-node device with UPS and heater</li></ul>       |

    ![Choose configuration](media/azure-stack-edge-j-series-deploy-prep/order-7.png)

    The **Basics** tab should look like the following screenshot: 

    ![Basics tab](media/azure-stack-edge-j-series-deploy-prep/order-8.png)
 

5. Select **Next: Shipping address**.

    - If you already have a device, select the combo box for **I have an Azure Stack Edge device**.

        ![Check existing device](media/azure-stack-edge-j-series-deploy-prep/order-9.png)

    - If this is the new device that you are ordering, enter the contact name, company, address to ship the device, and contact information.

        ![Shipping address for new device](media/azure-stack-edge-j-series-deploy-prep/order-10.png)

6. Select **Next: Review + create**.

7. On the **Review + create** tab, review the **Pricing details**, **Terms of use**, and the details for your resource. Select the combo box for **I have reviewed the privacy terms**.

    ![Review Azure Stack Edge resource details and privacy terms](media/azure-stack-edge-j-series-deploy-prep/order-12.png)

8. Select **Create**.

The resource creation takes a few minutes. After the resource is successfully created and deployed, you're notified. Select **Go to resource**.

![Go to the Azure Stack Edge resource](media/azure-stack-edge-j-series-deploy-prep/order-13.png)

You device is now ready for setup and activation.

## Get the activation key

After the Azure Stack Edge resource is up and running, you'll need to get the activation key. This key is used to activate and connect your Azure Stack Edge device with the resource. You can get this key now while you are in the Azure portal.

1. Select the resource that you created. Select **Overview** and then select **Device setup**.

    ![Select Device setup](media/azure-stack-edge-j-series-deploy-prep/get-activation-key-1.png)

2. On the **Activate** tile, select **Generate key** to create an activation key. Select the copy icon to copy the key and save it for later use.

    ![Get activation key](media/azure-stack-edge-j-series-deploy-prep/get-activation-key-2.png)

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
> [Install Azure Stack Edge](./azure-stack-edge-j-series-deploy-install.md)



