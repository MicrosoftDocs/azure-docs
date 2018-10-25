---
title: Connect to, configure, and activate Azure Data Box Edge in Azure portal | Microsoft Docs
description: Third tutorial to deploy Data Box Edge instructs you to connect, set up, and activate your physical device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 10/08/2018
ms.author: alkohli
Customer intent: As an IT admin, I need to understand how to connect and activate Data Box Edge so I can use it to transfer data to Azure. 
---
# Tutorial: Connect, set up, activate Azure Data Box Edge (Preview) 

This tutorial describes how to connect to, set up, and activate your Data Box Edge device using the local web UI. 

The setup and activation process can take around 20 minutes to complete. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Connect to physical device
> * Set up and activate physical device

> [!IMPORTANT]
> Data Box Edge is in preview. Review the [Azure terms of service for preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) before you order and deploy this solution. 


## Prerequisites

Before you configure and set up your Data Box Edge, make sure that:

* You have installed the physical device as detailed in [Install Data Box Edge](data-box-edge-deploy-install.md).
* You have the activation key from the Data Box Edge service that you created to manage the Data Box Edge device. For more information, go to [Prepare to deploy Azure Data Box Edge](data-box-edge-deploy-prep.md).

## Connect to the local web UI setup 

1. Configure the Ethernet adapter on the computer you are using to connect to the Edge device with a static IP address of 192.168.100.5 and subnet 255.255.255.0.
2. Connect the computer to PORT 1 on your device. 
3. Open a browser window and access the local web UI of the device at https://192.168.100.10. This action may take a few minutes after you have turned on the device. 
4. You see an error or a warning indicating that there is a problem with the website’s security certificate. Click **Continue to this webpage**. (These steps may be different based on the browser used.)
   
    ![](./media/data-box-edge-deploy-connect-setup-activate/image2.png)

2. Sign in to the web UI of your device. The default password is *Password1*. 
   
    ![](./media/data-box-edge-deploy-connect-setup-activate/image3.png)

3. You're prompted to change the device administrator password. Type in a new password that contains between 8 and 16 characters. The password must contain 3 of the following characters: uppercase, lowercase, numeric, and special characters.

You're now at the **Dashboard** of your device.

## Set up and activate the physical device
 
1. From the dashboard, you can go to various settings required to configure and register the physical device with the Data Box Edge service. The **Device name**, **Network settings**, **Web proxy settings**, and **Time settings** are optional. The only required settings are **Cloud settings**.
   
    ![](./media/data-box-edge-deploy-connect-setup-activate/set-up-activate-1.png)

2. In the **Device name** page, configure a friendly name for your device. The friendly name can be 1 to 15 characters long and can contain letter, numbers, and hyphens.

    ![](./media/data-box-edge-deploy-connect-setup-activate/set-up-activate-2.png)

3. (Optionally) configure your **Network settings**. On your physical device, you'll see six network interfaces. PORT 1 and PORT 2 are 1-Gbps network interfaces. PORT 3, PORT 4, PORT 5, and PORT 6 are all 25-Gbps network interfaces. PORT 1 is automatically configured as management-only port while PORT 2 to PORT 6 are all data ports. The **Network settings** page as shown below.
    
    ![](./media/data-box-edge-deploy-connect-setup-activate/set-up-activate-3.png)
   
    When configuring network settings, keep in mind:

    - If DHCP is enabled in your environment, network interfaces are automatically configured. An IP address, subnet, gateway, and DNS are automatically assigned.
    - If DHCP isn't enabled, you can assign static IPs if needed.
    - You can configure your network interface as IPv4.
   
4. (Optionally) configure your web proxy server. Although web proxy configuration is optional, if you use a web proxy, you can only configure it here.
   
   ![](./media/data-box-edge-deploy-connect-setup-activate/set-up-activate-4.png)
   
   In the **Web proxy** page:
   
   1. Supply the **Web proxy URL** in this format: `http://host-IP address or FDQN:Port number`. HTTPS URLs are not supported.
   2. Specify **Authentication** as **Basic** or **None**.
   3. If using authentication, you'll also need to provide a **Username** and **Password**.
   4. Click **Apply** to validate and apply the configured web proxy settings.

5. (Optionally) configure the time settings for your device, such as time zone and the primary and secondary NTP servers. NTP servers are required because your device must synchronize time so that it can authenticate with your cloud service providers.
    
    ![](./media/data-box-edge-deploy-connect-setup-activate/set-up-activate-5.png)
    
    In the **Time settings** page:
    
    1. From the dropdown list, select the **Time zone** based on the geographic location in which the device is being deployed. The default time zone for your device is PST. Your device will use this time zone for all scheduled operations.
    2. Specify a **Primary NTP server** for your device or accept the default value of time.windows.com. Ensure that your network allows NTP traffic to pass from your datacenter to the Internet.
    3. Optionally specify a **Secondary NTP server** for your device.
    4. Click **Apply** to validate and apply the configured time settings.

6. In the **Cloud settings** page, activate your device with the Data Box Edge service in Azure portal.
    
    1. Enter the **Activation key** that you got in [Get the activation key](data-box-edge-deploy-prep.md#get-the-activation-key) for Data Box Edge.

    2. Click **Apply**. 
       
         ![](./media/data-box-edge-deploy-connect-setup-activate/set-up-activate-6.png)
    
    3. After the device is successfully activated, you're presented with connectivity mode options. These settings are configured if you need to work with the device in partially disconnected or disconnected mode. 

        ![](./media/data-box-edge-deploy-connect-setup-activate/set-up-activate-7.png)    

The device setup is complete. You can now add shares on your device.


## Next steps

In this tutorial, you learned about Data Box Edge topics such as:

> [!div class="checklist"]
> * Connect to physical device
> * Set up and activate physical device


Advance to the next tutorial to learn how to transfer data with your Data Box Edge.

> [!div class="nextstepaction"]
> [Transfer data with Data Box Edge](./data-box-edge-deploy-add-shares.md).