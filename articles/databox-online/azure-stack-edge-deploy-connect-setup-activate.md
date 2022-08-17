---
title: Tutorial to connect to, configure, activate Azure Stack Edge Pro FPGA device in Azure portal
description: Tutorial to deploy Azure Stack Edge Pro FPGA instructs you to connect, set up, and activate your physical device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: tutorial
ms.date: 03/28/2019
ms.author: alkohli
# Customer intent: As an IT admin, I need to understand how to connect and activate Azure Stack Edge Pro FPGA so I can use it to transfer data to Azure. 
---
# Tutorial: Connect, set up, and activate Azure Stack Edge Pro FPGA 

This tutorial describes how you can connect to, set up, and activate your Azure Stack Edge Pro FPGA device by using the local web UI.

The setup and activation process can take around 20 minutes to complete.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Connect to a physical device
> * Set up and activate the physical device

## Prerequisites

Before you configure and set up your Azure Stack Edge Pro FPGA device, make sure that:

* You've installed the physical device as detailed in [Install Azure Stack Edge Pro FPGA](azure-stack-edge-deploy-install.md).
* You have the activation key from the Azure Stack Edge service that you created to manage the Azure Stack Edge Pro FPGA device. For more information, go to [Prepare to deploy Azure Stack Edge Pro FPGA](azure-stack-edge-deploy-prep.md).

## Connect to the local web UI setup

1. Configure the Ethernet adapter on your computer to connect to the Azure Stack Edge Pro FPGA device with a static IP address of 192.168.100.5 and subnet 255.255.255.0.

2. Connect the computer to PORT 1 on your device. Use the following illustration to identify PORT 1 on your device.

    ![Backplane of a cabled device](./media/azure-stack-edge-deploy-install/backplane-cabled.png)

3. Open a browser window and access the local web UI of the device at `https://192.168.100.10`.  
    This action may take a few minutes after you've turned on the device.

    You see an error or a warning indicating that there is a problem with the website's security certificate.
   
    ![Website security certificate error message](./media/azure-stack-edge-deploy-connect-setup-activate/image2.png)

4. Select **Continue to this webpage**.  
    These steps might vary depending on the browser you're using.

5. Sign in to the web UI of your device. The default password is *Password1*. 
   
    ![Azure Stack Edge Pro FPGA device sign-in page](./media/azure-stack-edge-deploy-connect-setup-activate/image3.png)

6. At the prompt, change the device administrator password.  
    The new password must contain between 8 and 16 characters. It must contain three of the following characters: uppercase, lowercase, numeric, and special characters.

You're now at the dashboard of your device.

## Set up and activate the physical device
 
Your dashboard displays the various settings that are required to configure and register the physical device with the Azure Stack Edge service. The **Device name**, **Network settings**, **Web proxy settings**, and **Time settings** are optional. The only required settings are **Cloud settings**.
   
![Local web UI "Dashboard" page](./media/azure-stack-edge-deploy-connect-setup-activate/set-up-activate-1.png)

1. In the left pane, select **Device name**, and then enter a friendly name for your device.  
    The friendly name must contain from 1 to 15 characters and have letters, numbers, and hyphens.

    ![Local web UI "Device name" page](./media/azure-stack-edge-deploy-connect-setup-activate/set-up-activate-2.png)

2. (Optional) In the left pane, select **Network settings** and then configure the settings.  
    On your physical device, there are six network interfaces. PORT 1 and PORT 2 are 1-Gbps network interfaces. PORT 3, PORT 4, PORT 5, and PORT 6 are all 25-Gbps network interfaces that can also serve as 10-Gbps network interfaces. PORT 1 is automatically configured as a management-only port, and PORT 2 to PORT 6 are all data ports. The **Network settings** page is as shown below.
    
    ![Local web UI "Network settings" page](./media/azure-stack-edge-deploy-connect-setup-activate/set-up-activate-3.png)
   
    As you configure the network settings, keep in mind:

   - If DHCP is enabled in your environment, network interfaces are automatically configured. An IP address, subnet, gateway, and DNS are automatically assigned.
   - If DHCP isn't enabled, you can assign static IPs if needed.
   - You can configure your network interface as IPv4.

     >[!NOTE] 
     > We recommend that you do not switch the local IP address of the network interface from static to DCHP, unless you have another IP address to connect to the device. If using one network interface and you switch to DHCP, there would be no way to determine the DHCP address. If you want to change to a DHCP address, wait until after the device has registered with the service, and then change. You can then view the IPs of all the adapters in the **Device properties** in the Azure portal for your service.

3. (Optional) In the left pane, select **Web proxy settings**, and then configure your web proxy server. Although web proxy configuration is optional, if you use a web proxy, you can configure it on this page only.
   
   ![Local web UI "Web proxy settings" page](./media/azure-stack-edge-deploy-connect-setup-activate/set-up-activate-4.png)
   
   On the **Web proxy settings** page, do the following:
   
   a. In the **Web proxy URL** box, enter the URL in this format: `http://host-IP address or FQDN:Port number`. HTTPS URLs are not supported.

   b. Under **Authentication**, select **None** or **NTLM**. If you enable compute and use IoT Edge module on your Azure Stack Edge Pro FPGA device, we recommend you set web proxy authentication to **None**. **NTLM** is not supported.

   c. If you're using authentication, enter a username and password.

   d. To validate and apply the configured web proxy settings, select **Apply settings**.

   > [!NOTE]
   > Proxy-auto config (PAC) files are not supported. A PAC file defines how web browsers and other user agents can automatically choose the appropriate proxy server (access method) for fetching a given URL.
   > Proxies that try to intercept and read all the traffic (then re-sign everything with their own certification) aren't compatible since the proxy's cert is not trusted.
   > Typically transparent proxies work well with Azure Stack Edge Pro FPGA.

4. (Optional) In the left pane, select **Time settings**, and then configure the time zone and the primary and secondary NTP servers for your device.  
    NTP servers are required because your device must synchronize time so that it can authenticate with your cloud service providers.
       
    On the **Time settings** page, do the following:
    
    1. In the **Time zone** drop-down list, select the time zone that corresponds to the geographic location in which the device is being deployed.
        The default time zone for your device is PST. Your device will use this time zone for all scheduled operations.

    2. In the **Primary NTP server** box, enter the primary server for your device or accept the default value of time.windows.com.  
        Ensure that your network allows NTP traffic to pass from your datacenter to the internet.

    3. Optionally, in the **Secondary NTP server** box, enter a secondary server for your device.

    4. To validate and apply the configured time settings, select **Apply settings**.

        ![Local web UI "Time settings" page](./media/azure-stack-edge-deploy-connect-setup-activate/set-up-activate-5.png)

5. (Optional) In the left pane, select **Storage settings** to configure the storage resiliency on your device. This feature is currently in preview. By default, the storage on the device is not resilient and there is data loss if a data disk fails on the device. When you enable the Resilient option, the storage on the device will be reconfigured and the device can withstand the failure of one data disk with no data loss. Configuring the storage as resilient will reduce the usable capacity of your device.

    > [!IMPORTANT] 
    > The resiliency can only be configured before you activate the device. 

    ![Local web UI "Storage settings" page](./media/azure-stack-edge-deploy-connect-setup-activate/storage-settings.png)

6. In the left pane, select **Cloud settings**, and then activate your device with the Azure Stack Edge service in the Azure portal.
    
    1. In the **Activation key** box, enter the activation key that you got in [Get the activation key](azure-stack-edge-deploy-prep.md#get-the-activation-key) for Azure Stack Edge Pro FPGA.
    2. Select **Apply**.
       
        ![Local web UI "Cloud settings" page](./media/azure-stack-edge-deploy-connect-setup-activate/set-up-activate-6.png)

    3. First the device is activated. The device is then scanned for any critical updates and if available, the updates are automatically applied. You see a notification to that effect.

        The dialog also has a recovery key that you should copy and save it in a safe location. This key is used to recover your data in the event the device can't boot up.

        ![Local web UI "Cloud settings" page updated](./media/azure-stack-edge-deploy-connect-setup-activate/set-up-activate-7.png)

    4. You may need to wait several minutes after the update is successfully completed. The page updates to indicate that the device is successfully activated.

        ![Local web UI "Cloud settings" page updated 2](./media/azure-stack-edge-deploy-connect-setup-activate/set-up-activate-8.png)

The device setup is complete. You can now add shares on your device.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Connect to a physical device
> * Set up and activate the physical device

To learn how to transfer data with your Azure Stack Edge Pro FPGA device, see:

> [!div class="nextstepaction"]
> [Transfer data with Azure Stack Edge Pro FPGA](./azure-stack-edge-deploy-add-shares.md).
