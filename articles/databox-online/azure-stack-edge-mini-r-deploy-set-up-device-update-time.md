---
title: Tutorial to set up device, update, time for Azure Stack Edge Mini R device in Azure portal
description: Tutorial to deploy Azure Stack Edge Mini R instructs you to set up device, update and time settings for your physical device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: tutorial
ms.date: 10/14/2020
ms.author: alkohli
# Customer intent: As an IT admin, I need to understand how to connect and activate Azure Stack Edge Mini R  so I can use it to transfer data to Azure. 
---
# Tutorial: Configure the device settings for Azure Stack Edge Mini R

This tutorial describes how you configure device related settings for your Azure Stack Edge Mini R  device with an onboard GPU. You can set up your device name, update server, and time server via the local web UI.

The device settings can take around 5-7 minutes to complete.

In this tutorial, you learn about:

> [!div class="checklist"]
>
> * Prerequisites
> * Configure device settings
> * Configure update 
> * Configure time

## Prerequisites

Before you configure device related settings on your Azure Stack Edge Mini R device with GPU, make sure that:

* For your physical device:

    - You've installed the physical device as detailed in [Install Azure Stack Edge Mini R ](azure-stack-edge-mini-r-deploy-install.md).
    - You've configured network and enabled and configured compute network on your device as detailed in [Tutorial: Configure network for Azure Stack Edge Mini R  with GPU](azure-stack-edge-mini-r-deploy-configure-network-compute-web-proxy.md).


## Configure device settings

Follow these steps to configure device related settings:

1. On the **Device** page, take the following steps:

    1. Enter a friendly name for your device. The friendly name must contain from 1 to 13 characters and can have letter, numbers, and hyphens.

    2. Provide a **DNS domain** for your device. This domain is used to set up the device as a file server.

    3. To validate and apply the configured device settings, select **Apply**.

        ![Local web UI "Device" page 1](./media/azure-stack-edge-mini-r-deploy-set-up-device-update-time/set-up-device-1.png)

        If you have changed the device name and the DNS domain, the self-signed certificates that existed on the device will not work. 

        ![Local web UI "Device" page 2](./media/azure-stack-edge-mini-r-deploy-set-up-device-update-time/set-up-device-2.png)

        You need to choose one of the following options when you configure certificates: 
        
        - Generate and download the device certificates. 
        - Bring your own certificates for the device including the signing chain.
    

    4. When the device name and the DNS domain are changed, the SMB endpoint is created.  

        ![Local web UI "Device" page 3](./media/azure-stack-edge-mini-r-deploy-set-up-device-update-time/set-up-device-3.png)

    5. After the settings are applied, select **Next: Update server**.


## Configure update

1. On the **Update** page, you can now configure the location from where to download the updates for your device.  

    - You can get the updates directly from the **Microsoft Update server**.

        ![Local web UI "Update Server" page](./media/azure-stack-edge-mini-r-deploy-set-up-device-update-time/update-server-1.png)

        You can also choose to deploy updates from the **Windows Server Update services** (WSUS). Provide the path to the WSUS server.
        
        ![Local web UI "Update Server" page 2](./media/azure-stack-edge-mini-r-deploy-set-up-device-update-time/update-server-2.png)

        > [!NOTE] 
        > If a separate Windows Update server is configured and if you choose to connect over *https* (instead of *http*), then signing chain certificates required to connect to the update server are needed. For information on how to create and upload certificates, go to [Manage certificates](azure-stack-edge-gpu-manage-certificates.md). 
        > For working in a disconnected mode such as your Azure Stack Edge device tiering to Modular Data Center, enable WSUS option. During activation, the device scans for updates and if the server is not set up, then the activation will fail. 

2. Select **Apply**.
3. After the update server is configured, select **Next: Time**.
    

## Configure time

Follow these steps to configure time settings on your device. 

> [!IMPORTANT]
> Though the time settings are optional, we strongly recommend that you configure a primary NTP and a secondary NTP server on the local network for your device. If local server is not available, public NTP servers can be configured.

NTP servers are required because your device must synchronize time so that it can authenticate with your cloud service providers.

1. On the **Time** page, you can select the time zone, and the primary and secondary NTP servers for your device.  
    
    1. In the **Time zone** drop-down list, select the time zone that corresponds to the geographic location in which the device is being deployed.
        The default time zone for your device is PST. Your device will use this time zone for all scheduled operations.

    2. In the **Primary NTP server** box, enter the primary server for your device or accept the default value of time.windows.com.  
        Ensure that your network allows NTP traffic to pass from your datacenter to the internet.

    3. Optionally, in the **Secondary NTP server** box, enter a secondary server for your device.

    4. To validate and apply the configured time settings, select **Apply**.

        ![Local web UI "Time" page](./media/azure-stack-edge-mini-r-deploy-set-up-device-update-time/time-settings-1.png)

2. After the settings are applied, select **Next: Certificates**.


## Next steps

In this tutorial, you learn about:

> [!div class="checklist"]
>
> * Prerequisites
> * Configure device settings
> * Configure update 
> * Configure time

To learn how to configure certificates for your Azure Stack Edge Mini R device, see:

> [!div class="nextstepaction"]
> [Configure certificates](./azure-stack-edge-mini-r-deploy-configure-certificates-vpn-encryption.md)
