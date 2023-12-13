---
title: Tutorial to connect, configure, activate Azure Stack Edge Pro 2 device 
description: Tutorial to deploy Azure Stack Edge Pro 2 instructs you to configure device settings including device name, update server, and time server via the local web UI
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: tutorial
ms.date: 10/26/2022
ms.author: alkohli
# Customer intent: As an IT admin, I need to understand how to set up device name, update server and time server via the local web UI of Azure Stack Edge Pro 2 so I can use the device to transfer data to Azure. 
---
# Tutorial: Configure the device settings for Azure Stack Edge Pro 2

This tutorial describes how you configure device-related settings for your Azure Stack Edge Pro 2 device. You can set up your device name, update server, and time server via the local web UI.


The device settings can take around 5-7 minutes to complete.

In this tutorial, you learn about:

> [!div class="checklist"]
>
> * Prerequisites
> * Configure device settings
> * Configure update 
> * Configure time

## Prerequisites


Before you configure device-related settings on your Azure Stack Edge Pro 2, make sure that:

* For your physical device:

    - You've installed the physical device as detailed in [Install Azure Stack Edge Pro 2](azure-stack-edge-pro-2-deploy-install.md).
    - You've configured network and enabled and configured compute network on your device as detailed in [Tutorial: Configure network for Azure Stack Edge Pro 2](azure-stack-edge-pro-2-deploy-configure-network-compute-web-proxy.md).


## Configure device settings

Follow these steps to configure device-related settings:

1. On the **Device** page of the local web UI of your device, take the following steps:

    1. Enter a friendly name for your device. The friendly name must contain from 1 to 13 characters and can have letter, numbers, and hyphens.

    2. Provide a **DNS domain** for your device. This domain is used to set up the device as a file server.

    3. To validate and apply the configured device settings, select **Apply**.

        ![Screenshot of the Device page in the local web UI of an Azure Stack Edge device. The Apply button is highlighted.](./media/azure-stack-edge-pro-2-deploy-set-up-device-update-time/device-1.png)

        If you’ve changed the device name and the DNS domain, the automatically generated self-signed certificates on the device won’t work. You'll see a warning to this effect.
    

        ![Screenshot of the Warning in the Device page of local web UI of an Azure Stack Edge device. The OK button is highlighted.](./media/azure-stack-edge-pro-2-deploy-set-up-device-update-time/device-2.png)

    4. When the device name and the DNS domain are changed, the SMB endpoint is created.  

    5. After the settings are applied, select **Next: Update server**.

        ![Screenshot of the Device page in the local web UI of an Azure Stack Edge device. The SMB server and Next: Update server > is highlighted.](./media/azure-stack-edge-pro-2-deploy-set-up-device-update-time/device-3.png)

## Configure update server

1. On the **Update server** page of the local web UI of your device, you can now configure the location from where to download the updates for your device.  

    - You can get the updates directly from the **Microsoft Update server**.

        ![Screenshot of the Update server page with Microsoft update server configured in the local web UI of an Azure Stack Edge device. The Apply button is highlighted.](./media/azure-stack-edge-pro-2-deploy-set-up-device-update-time/update-1.png)

        You can also choose to deploy updates from the **Windows Server Update services** (WSUS). Provide the path to the WSUS server.
        
        ![Screenshot of the Update server page with Windows Server Update Services configured in the local web UI of an Azure Stack Edge device. The Apply button is highlighted.](./media/azure-stack-edge-pro-2-deploy-set-up-device-update-time/update-2.png)

        > [!NOTE] 
        > If a separate Windows Update server is configured and if you choose to connect over *https* (instead of *http*), then signing chain certificates required to connect to the update server are needed. For information on how to create and upload certificates, go to [Manage certificates](azure-stack-edge-gpu-manage-certificates.md). 

2. Select **Apply**.
3. After the update server is configured, select **Next: Time**.
    

## Configure time

Follow these steps to configure time settings on your device. 

> [!IMPORTANT]
> Though the time settings are optional, we strongly recommend that you configure a primary NTP and a secondary NTP server on the local network for your device. If a local server is not available, you can configure a public NTP server.

NTP servers are required because your device must synchronize time so that it can authenticate with your cloud service providers.

1. On the **Time** page of the local web UI of your device, you can select the time zone, and the primary and secondary NTP servers for your device.  
    
    1. In the **Time zone** drop-down list, select the time zone that corresponds to the geographic location in which the device is being deployed.
        The default time zone for your device is PST. Your device will use this time zone for all scheduled operations.

    2. In the **Primary NTP server** box, enter the primary server for your device or accept the default value of time.windows.com.  
        Ensure that your network allows NTP traffic to pass from your datacenter to the internet.

    3. Optionally, in the **Secondary NTP server** box, enter a secondary server for your device.

    4. To validate and apply the configured time settings, select **Apply**.

        ![Screenshot of the Time page in the local web UI of an Azure Stack Edge device. The Apply button is highlighted.](./media/azure-stack-edge-pro-2-deploy-set-up-device-update-time/time-1.png)

2. After the settings are applied, select **Next: Certificates**.


## Next steps

In this tutorial, you learn about:

> [!div class="checklist"]
>
> * Prerequisites
> * Configure device settings
> * Configure update 
> * Configure time

To learn how to configure certificates for your Azure Stack Edge Pro 2 device, see:

> [!div class="nextstepaction"]
> [Configure certificates](./azure-stack-edge-pro-2-deploy-configure-certificates.md)
