---
title: Tutorial to connect to, configure, activate Azure Stack Edge device in Azure portal | Microsoft Docs
description: Tutorial to deploy Azure Stack Edge instructs you to connect, set up, and activate your physical device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: tutorial
ms.date: 12/06/2019
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
* You have a Base-64 encoded 32 character key that will be needed to configure double encryption for data-at-rest.
* Except for Azure public cloud, you will also need a signing chain certificate befre you can activate your device. For details on certificate, go to [Manage certificates](azure-stack-edge-r-series-manage-certificates.md).

## Connect to the local web UI setup 

1. Configure the Ethernet adapter on your computer to connect to the Azure Stack Edge device with a static IP address of 192.168.100.5 and subnet 255.255.255.0.

2. Connect the computer to PORT 1 on your device. Use the following illustration to identify PORT 1 on your device.

    ![Backplane of a cabled device](./media/azure-stack-edge-r-series-deploy-install/backplane-cabled.png)

3. Open a browser window and access the local web UI of the device at `https://192.168.100.10`.  
    This action may take a few minutes after you've turned on the device.

    You see an error or a warning indicating that there is a problem with the website’s security certificate. 
   
    ![Website security certificate error message](./media/azure-stack-edge-r-series-deploy-connect-setup-activate/connect-web-ui-1.png)

4. Select **Continue to this webpage**.  
    These steps might vary depending on the browser you're using.

    ![Website security certificate error message](./media/azure-stack-edge-r-series-deploy-connect-setup-activate/connect-web-ui-2.png)   

5. Sign in to the web UI of your device. The default password is *Password1*.
   
    ![Azure Stack Edge device sign-in page](./media/azure-stack-edge-r-series-deploy-connect-setup-activate/connect-web-ui-3.png)

6. At the prompt, change the device administrator password.  
    The new password must contain between 8 and 16 characters. It must contain three of the following characters: uppercase, lowercase, numeric, and special characters.

    ![Azure Stack Edge password change](./media/azure-stack-edge-r-series-deploy-connect-setup-activate/connect-web-ui-4.png)

You're now at the dashboard of your device.

## Set up and activate the physical device
 
Your **Get started** page displays the various settings that are required to configure and register the physical device with the Azure Stack Edge service. Of these settings, the **Network settings**, **Web proxy settings**, and **Time settings** are optional. The only required settings are **Device** and **Cloud settings**.

1. In the local web UI of your device, go to the **Get started** page.  

    ![Local web UI "Get started" page](./media/azure-stack-edge-r-series-deploy-connect-setup-activate/set-up-device-1.png)

2. (Optional) On the **Network settings** tile, select **Configure**.  
    
    ![Local web UI "Network settings" tile](./media/azure-stack-edge-r-series-deploy-connect-setup-activate/set-up-device-3.png)

    On your physical device, there are four network interfaces. PORT 1 and PORT 2 are 1-Gbps network interfaces. PORT 3 and PORT 4 are all 10-Gbps network interfaces. PORT 1 is automatically configured as a management-only port, and PORT 2 to PORT 4 are all data ports. The **Network settings** page is as shown below.
    
    ![Local web UI "Network settings" page](./media/azure-stack-edge-r-series-deploy-connect-setup-activate/set-up-device-2.png)
   
    To change the network settings, select a port and in the right pane that appears, modify the IP address, subnet, gateway, primary DNS, and secondary DNS. If you select Port 1, you can see that it is preconfigured as static. 

    ![Local web UI "Port 1 Network settings"](./media/azure-stack-edge-r-series-deploy-connect-setup-activate/set-up-device-4.png)

    If you select Port 2, Port 3, or Port 4, all of these ports are configured as DHCP by default.

    ![Local web UI "Port 3 Network settings"](./media/azure-stack-edge-r-series-deploy-connect-setup-activate/set-up-device-5.png)

    As you configure the network settings, keep in mind:

   - If DHCP is enabled in your environment, network interfaces are automatically configured. An IP address, subnet, gateway, and DNS are automatically assigned.
   - If DHCP isn't enabled, you can assign static IPs if needed.
   - You can configure your network interface as IPv4.
   - On the 25-Gbps interfaces, you can set the RDMA (Remote Direct Access Memory) mode to iWarp or RoCE (RDMA over Converged Ethernet). Where low latencies are the primary requirement and scalability is not a concern, use RoCE. When latency is a key requirement, but ease-of-use and scalability are also high priorities, iWARP is the best candidate. 
   - Serial number for any port corresponds to the node serial number. For a 1-node system, only one serial number is displayed.

     >[!NOTE] 
     > We recommend that you do not switch the local IP address of the network interface from static to DCHP, unless you have another IP address to connect to the device. If using one network interface and you switch to DHCP, there would be no way to determine the DHCP address. If you want to change to a DHCP address, wait until after the device has registered with the service, and then change. You can then view the IPs of all the adapters in the **Device properties** in the Azure portal for your service.

     After you have configured and applied the network settings, go back to **Get started**.

3. (Optional) On the **Network settings** tile, configure your web proxy server settings. Although web proxy configuration is optional, if you use a web proxy, you can configure it on this page only.
   
   ![Local web UI "Web proxy settings" page](./media/azure-stack-edge-r-series-deploy-connect-setup-activate/set-up-device-6.png)
   
   On the **Web proxy settings** page, take the following steps:
   
   a. In the **Web proxy URL** box, enter the URL in this format: `http://host-IP address or FQDN:Port number`. HTTPS URLs are not supported.

   b. Under **Authentication**, select **None** or **NTLM**.

   c. If you're using authentication, enter a username and password.

   d. To validate and apply the configured web proxy settings, select **Apply**.
   
   e. After the settings are applied, go back to **Get started**.

   ![Local web UI "Web proxy settings" page](./media/azure-stack-edge-r-series-deploy-connect-setup-activate/set-up-device-7.png)

4. On the **Device setup** tile, for **Device**, select **Configure**. On the **Device** page, take the following steps: 
    
    1. Enter a friendly name for your device. The friendly name must contain from 1 to 15 characters and have letter, numbers, and hyphens.

    2. Provide a **DNS domain** for your device. This domain is used to set up the device as a file server.

    3. You can connect to this device using SMB, NFS, and REST protocols. If using REST to connect to the blob storage, select an **Azure consistent services network** from the dropdown list (that shows the available cluster networks available for the device). If using NFS (Linux clients) to connect to the device, select an **NFS network**. 

    4. To validate and apply the configured device settings, select **Apply**.

        ![Local web UI "Device" page](./media/azure-stack-edge-r-series-deploy-connect-setup-activate/set-up-device-9.png)

        If you have changed the device name and the DNS domain, the automatically generated self-signed certificates on the device will not work. You must bring your own certificates for the device.
        
        ![Local web UI "Device" page](./media/azure-stack-edge-r-series-deploy-connect-setup-activate/set-up-device-10.png)

    5. After the settings are applied, go back to **Get started**. 

5. On the **Device setup** tile, for **Update**, select **Configure**. You can now configure the location from where to download the updates for your device.  

    - You can get the updates directly from the **Microsoft Update server**. 

        ![Local web UI "Update Server" page](./media/azure-stack-edge-r-series-deploy-connect-setup-activate/set-up-device-8.png)

        You can also choose to deploy updates from the **Windows Server Update services** (WSUS). Provide the path to the WSUS server.

        > [!NOTE] 
        > If a separate Windows Update server is configured, then signing chain certificates required to connect to the update server are needed.

    - Select **Apply**.
    - The updates will be applied to the device. Because your device is a 1-node device, when the updates are applied, the device will experience a down time.
    - After the updates are applied, go back to **Get started**.

6. (Optional) On the **Device setup** tile, configure your **Time settings**. You can select the time zone, and the primary and secondary NTP servers for your device.  
    
    NTP servers are required because your device must synchronize time so that it can authenticate with your cloud service providers.

    ![Local web UI "Time settings" page](./media/azure-stack-edge-r-series-deploy-connect-setup-activate/set-up-device-8.png)
       
    On the **Time settings** page, do the following:
    
    1. In the **Time zone** drop-down list, select the time zone that corresponds to the geographic location in which the device is being deployed.
        The default time zone for your device is PST. Your device will use this time zone for all scheduled operations.

    2. In the **Primary NTP server** box, enter the primary server for your device or accept the default value of time.windows.com.  
        Ensure that your network allows NTP traffic to pass from your datacenter to the internet.

    3. Optionally, in the **Secondary NTP server** box, enter a secondary server for your device.

    4. To validate and apply the configured time settings, select **Apply**.

        ![Local web UI "Time settings" page](./media/azure-stack-edge-r-series-deploy-connect-setup-activate/set-up-device-5.png)

    5. After the settings are applied, go back to **Get started**.

7. On the **Security** tile, select **Configure** for certificates. The device has automatically generated self-signed certificates to begin with.

    You can bring your own signed endpoint certificates and the corresponding signing chains. You first add the signing chain and then upload the endpoint certificates. For more information on how to create and upload certificates, go to [Manage certificates on your Azure Stack Edge device](azure-stack-edge-r-series-manage-certificates.md).

    1. To upload certificate, on the **Certificate** page, select **+ Add certificate**. 

        ![Local web UI "Certificates" page](./media/azure-stack-edge-r-series-deploy-connect-setup-activate/set-up-device-20.png)

    2. Upload the signing chain first and select **Validate & add**.

        ![Local web UI "Certificates" page](./media/azure-stack-edge-r-series-deploy-connect-setup-activate/set-up-device-21.png)

    3. Now you can upload other certificates. For example, you can upload the Azure Resource Manager and Blob storage endpoint certificates.

        ![Local web UI "Certificates" page](./media/azure-stack-edge-r-series-deploy-connect-setup-activate/set-up-device-22.png)

        You can also upload the local web UI certificate. After you upload this certificate, you will be required to start your browser and clear the cache. You will then need to connect to the device local web UI.  

        ![Local web UI "Certificates" page](./media/azure-stack-edge-r-series-deploy-connect-setup-activate/set-up-device-23.png)

    4. You will now be at the **Get started** page. Go to the **Certificates** page again to verify that all the certificates that you uploaded show up on this page.

        ![Local web UI "Certificates" page](./media/azure-stack-edge-r-series-deploy-connect-setup-activate/set-up-device-24.png)

        > [!NOTE]
        > Except for Azure public cloud, signing chain certificates are needed to be brought in before activation for all cloud configurations (Azure Government or Azure Stack).

8. On the **Security** tile, select **Configure** for VPN. 

9. On the **Security** tile, select **Configure** for encryption-at-rest. This is a required setting and until this is successfully configured, you can't activate the device. 

    At the factory, once the devices are imaged, the volume level BitLocker encryption is enabled. After you receive the device, you need to configure the encryption-at-rest. The storage pool and volumes are recreated and you can provide BitLocker keys to enable encryption-at-rest and thus create a second layer of encryption for your data-at-rest.

    1. In the **Encryption-at-rest** pane, enter a 32 character long Base-64 encoded key. This is a one-time configuration and this key is used to protect the actual encryption key.

        ![Local web UI "Encryption at rest" page](./media/azure-stack-edge-r-series-deploy-connect-setup-activate/set-up-device-25.png)

    2. Select **Apply**. This operation takes several minutes and the status of operation is displayed on the **Security** tile.

        ![Local web UI "Encryption at rest" page](./media/azure-stack-edge-r-series-deploy-connect-setup-activate/set-up-device-26.png)

    3. After the status shows as Completed, go back to **Get started**.

7. On the **Activation** tile, select **Activate**. You can't activate the device until the encryption-at-rest is successfully configured. 
    
    1. In the **Activate** pane, enter the **Activation key** that you got in [Get the activation key for Azure Stack Edge](azure-stack-edge-r-series-deploy-prep.md#get-the-activation-key).

    2. Select **Apply**.
       
        ![Local web UI "Cloud settings" page](./media/azure-stack-edge-r-series-deploy-connect-setup-activate/set-up-device-27.png)

    3. First the device is activated. The device is then scanned for any critical updates and if available, the updates are automatically applied. You see a notification to that effect. Monitor the update progress via the Azure portal.

        ![Local web UI "Cloud settings" page updated](./media/azure-stack-edge-r-series-deploy-connect-setup-activate/set-up-device-17.png)

    4. You may need to wait several minutes after the update is successfully completed. The page updates to indicate that the device is successfully activated.

        ![Local web UI "Cloud settings" page updated](./media/azure-stack-edge-r-series-deploy-connect-setup-activate/set-up-device-18.png)

    5. You are then prompted to select the key file. Select download key file and save the *keys.json* file in a safe location outside of the device. This key file contains the recovery keys for the OS disk and data disks on your device. Here are the contents of the *keys.json* file:

        
        ```json
        {
                  "Id": "851c14e4-a04a-4d08-a476-db0ed10b2b53",
                  "DataVolumeBitLockerExternalKeys": {
                    "hcsinternal": "MTIzNDU2NzgxMjM0NTY3ODEyMzQ1Njc4MTIzNDU2Nzg=",
                    "hcsdata": "MTIzNDU2NzgxMjM0NTY3ODEyMzQ1Njc4MTIzNDU2Nzg=",
                    "servicefabric": "MTIzNDU2NzgxMjM0NTY3ODEyMzQ1Njc4MTIzNDU2Nzg="
                  },
                  "SEDEncryptionExternalKey": "MnFCij2r7GxgJZSdtgNBlaKqvbgdEpk4y9LlrlNM6Ao=",
                  "ServiceEncryptionKey": "T/RfCdRXTUOUggiNJkbVoA=="
                }
        ```
        
 
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
