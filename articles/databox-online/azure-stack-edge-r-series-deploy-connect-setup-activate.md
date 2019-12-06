---
title: Tutorial to connect to, configure, activate Azure Stack Edge device in Azure portal | Microsoft Docs
description: Tutorial to deploy Azure Stack Edge instructs you to connect, set up, and activate your physical device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: tutorial
ms.date: 11/16/2019
ms.author: alkohli
Customer intent: As an IT admin, I need to understand how to connect and activate Azure Stack Edge so I can use it to transfer data to Azure. 
---
# Tutorial: Connect, set up, and activate Azure Stack Edge 

This tutorial describes how you can connect to, set up, and activate your Azure Stack Edge device by using the local web UI.

The setup and activation process can take around 20 minutes to complete.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Connect to a physical device
> * Set up and activate the physical device

## Prerequisites

Before you configure and set up your Azure Stack Edge device, make sure that:

* You've installed the physical device as detailed in [Install Azure Stack Edge](azure-stack-edge-r-series-deploy-install.md).
* You have the activation key from the Azure Stack Edge service that you created to manage the Azure Stack Edge device. For more information, go to [Prepare to deploy Azure Stack Edge](azure-stack-edge-r-series-deploy-prep.md).

## Connect to the local web UI setup 

1. Configure the Ethernet adapter on your computer to connect to the Azure Stack Edge device with a static IP address of 192.168.100.5 and subnet 255.255.255.0.

2. Connect the computer to PORT 1 on your device. Use the following illustration to identify PORT 1 on your device.

    ![Backplane of a cabled device](./media/azure-stack-edge-r-series-deploy-install/backplane-cabled.png)


3. Open a browser window and access the local web UI of the device at `https://192.168.100.10`.  
    This action may take a few minutes after you've turned on the device.

    You see an error or a warning indicating that there is a problem with the website’s security certificate. 
   
    <!--![Website security certificate error message](./media/data-box-edge-deploy-connect-setup-activate/image2.png)-->

4. Select **Continue to this webpage**.  
    These steps might vary depending on the browser you're using.

5. Sign in to the web UI of your device. The default password is *Password1*.
   
    <!--![Azure Stack Edge device sign-in page](./media/data-box-edge-deploy-connect-setup-activate/image3.png)-->

6. At the prompt, change the device administrator password.  
    The new password must contain between 8 and 16 characters. It must contain three of the following characters: uppercase, lowercase, numeric, and special characters.

You're now at the dashboard of your device.

## Set up and activate the physical device
 
Your **Get started** page displays the various settings that are required to configure and register the physical device with the Azure Stack Edge service. Of these settings, the **Network settings**, **Web proxy settings**, and **Time settings** are optional. The only required settings are **Device** and **Cloud settings**.

1. In the local web UI of your device, go to the **Get started** page.  

    <!--![Local web UI "Get started" page](./media/data-box-edge-deploy-connect-setup-activate/set-up-activate-1.png)-->

2. (Optional) On the **Network settings** tile, select **Configure**.  
    
    <!--![Local web UI "Network settigs" tile](./media/data-box-edge-deploy-connect-setup-activate/set-up-activate-1.png)-->

    On your physical device, there are four network interfaces. PORT 1 and PORT 2 are 1-Gbps network interfaces. PORT 3 and PORT 4 are all 10-Gbps network interfaces. PORT 1 is automatically configured as a management-only port, and PORT 2 to PORT 4 are all data ports. The **Network settings** page is as shown below.
    
    <!--![Local web UI "Network settings" page](./media/data-box-edge-deploy-connect-setup-activate/set-up-activate-3.png)-->
   
    To change the network settings, select a port and in the right pane that appears, modify the IP address, subnet, gateway, primary DNS, and secondary DNS. If you select Port 1, you can see that it is preconfigured as static. 

    <!--![Local web UI "Port 1 Network settings"](./media/data-box-edge-deploy-connect-setup-activate/set-up-activate-3.png)-->

    If you select Port 2, Port 3, or Port 4, all of these ports are configured as DHCP by default.

    <!--![Local web UI "Port 2 Network settings"](./media/data-box-edge-deploy-connect-setup-activate/set-up-activate-3.png)-->

    As you configure the network settings, keep in mind:

   - If DHCP is enabled in your environment, network interfaces are automatically configured. An IP address, subnet, gateway, and DNS are automatically assigned.
   - If DHCP isn't enabled, you can assign static IPs if needed.
   - You can configure your network interface as IPv4.

     >[!NOTE] 
     > We recommend that you do not switch the local IP address of the network interface from static to DCHP, unless you have another IP address to connect to the device. If using one network interface and you switch to DHCP, there would be no way to determine the DHCP address. If you want to change to a DHCP address, wait until after the device has registered with the service, and then change. You can then view the IPs of all the adapters in the **Device properties** in the Azure portal for your service.

     After you have configured and applied the network settings, go back to **Get started**.

3. (Optional) On the Web proxy & time tile, configure your web proxy server settings. Although web proxy configuration is optional, if you use a web proxy, you can configure it on this page only.
   
   <!--![Local web UI "Web proxy settings" page](./media/data-box-edge-deploy-connect-setup-activate/set-up-activate-4.png)-->
   
   On the **Web proxy settings** page, do the following:
   
   a. In the **Web proxy URL** box, enter the URL in this format: `http://host-IP address or FQDN:Port number`. HTTPS URLs are not supported.

   b. Under **Authentication**, select **None** or **NTLM**.

   c. If you're using authentication, enter a username and password.

   d. To validate and apply the configured web proxy settings, select **Apply**.
   
   e. After the settings are applied, go back to **Get started**.

4. (Optional) On the Web proxy & time tile, configure your **Time settings**. You can select the time zone, and the primary and secondary NTP servers for your device.  
    NTP servers are required because your device must synchronize time so that it can authenticate with your cloud service providers.
       
    On the **Time settings** page, do the following:
    
    1. In the **Time zone** drop-down list, select the time zone that corresponds to the geographic location in which the device is being deployed.
        The default time zone for your device is PST. Your device will use this time zone for all scheduled operations.

    2. In the **Primary NTP server** box, enter the primary server for your device or accept the default value of time.windows.com.  
        Ensure that your network allows NTP traffic to pass from your datacenter to the internet.

    3. Optionally, in the **Secondary NTP server** box, enter a secondary server for your device.

    4. To validate and apply the configured time settings, select **Apply**.

        <!--![Local web UI "Time settings" page](./media/data-box-edge-deploy-connect-setup-activate/set-up-activate-5.png)-->

    5. After the settings are applied, go back to **Get started**.

5. On the **Device and DNS domain** tile, select **Configure**. On the **Device** page, take the following steps: 
    
    1. Enter a friendly name for your device. The friendly name must contain from 1 to 15 characters and have letter, numbers, and hyphens.

    2. Provide a **DNS domain** for your device. This domain is used to set up the device as a file server.

    3. You can connect to this device using SMB, NFS, and REST protocols. If using REST to connect to the blob storage, select an **Azure consistent services network** from the dropdown list (that shows the available cluster networks available for the device). If using NFS (Linux clients) to connect to the device, select an **NFS network**. 

    4. To validate and apply the configured device settings, select **Apply**.

        <!--![Local web UI "Device" page](./media/data-box-edge-deploy-connect-setup-activate/set-up-activate-5.png)-->

    5. After the settings are applied, go back to **Get started**.

6. On the **Security** tile, select **Configure** for VPN. 

7. On the **Security** tile, select **Configure** for encryption-at-rest. This is a required setting and until this is successfully configured, the activate option is grayed out. 

    At the factory, once the devices are imaged, the volume level BitLocker encryption is enabled. After you receive the device, you need to configure the encryption-at-rest. The storage pool and volumes are recreated and you can provide BitLocker keys to enable encryption-at-rest.

    1. In the **Encryption-at-rest** pane, enter a 32 binary-byte key. This is a one-time configuration and this key is used to protect the actual encryption key.
    
    2. Select **Apply**. This operation takes several minutes and the status of operation is displayed as *running* on the **Security** tile.

7. On the **Activation** tile, select **Activate**. The activate option is grayed out until the encryption-at-rest is successfully configured. 
    
    1. In the **Activate** pane, enter the **Activation key** that you got in [Get the activation key for Azure Stack Edge](data-box-edge-deploy-prep.md#get-the-activation-key).

    2. Select **Apply**.
       
        <!--![Local web UI "Cloud settings" page](./media/data-box-edge-deploy-connect-setup-activate/set-up-activate-6.png)-->

    3. First the device is activated. The device is then scanned for any critical updates and if available, the updates are automatically applied. You see a notification to that effect. Monitor the update progress via the Azure portal.

        The dialog also has a recovery key that you should copy and save it in a safe location. This key is used to recover your data in the event the device can't boot up.

        <!--![Local web UI "Cloud settings" page updated](./media/data-box-edge-deploy-connect-setup-activate/set-up-activate-7.png)-->

    4. You may need to wait several minutes after the update is successfully completed. The page updates to indicate that the device is successfully activated.

        <!--![Local web UI "Cloud settings" page updated](./media/data-box-edge-deploy-connect-setup-activate/set-up-activate-8.png)-->

    5. Select download key file and save the *keys.json* file in a safe location. This key file contains the recovery keys for the OS disk, data disks, and for the BIOS on your device. Here are the contents of the *keys.json* file:

        {
          "Id": "64e48903-6bf3-47ca-a181-5ee233394c11",
          "DataVolumeBitLockerExternalKeys": {
            "hcsinternal": "f05SlTUY4B1UmOY7eXZ8knth/CJ612hZSvv6lIQkgl0=",
            "hcsdata": "ScPvR4XQWvc6EXyCmKMbRGkH2sgTia7eeUrChbM1W5Y="
          },
          "SystemVolumeBitLockerRecoveryKey": "224543-654797-504592-272668-019118-436392-381216-575960"
        }
 
        The following table explains the various keys here:       
        
        |Field  |Description  |
        |---------|---------|
        |`Id`    | This is the ID for the device        |
        |`DataVolumeBitLockerExternalKeys`<br>`Hcsinternal`<br>`hcsdata`|These are the BitLockers keys for the data disks. These keys are used to recover the local data on your device.|
        |`SystemVolumeBitLockerRecoveryKey`| This is the BitLocker key for the system volume. This key helps with the recovery of the system configuration and system data for your device. |
        |`ServiceEncryptionKey`| This key protects the data flowing through the Azure service. This key ensures that a compromise of the Azure service will not result in a compromise of stored information. |


The device setup is complete. You can now add shares on your device.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Connect to a physical device
> * Set up and activate the physical device

To learn how to transfer data with your Azure Stack Edge device, see:

> [!div class="nextstepaction"]
> [Transfer data with Azure Stack Edge](./azure-stack-edge-r-series-deploy-add-shares.md).
