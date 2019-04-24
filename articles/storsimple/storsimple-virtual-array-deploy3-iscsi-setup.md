---
title: Microsoft Azure StorSimple Virtual Array iSCSI server setup | Microsoft Docs
description: Describes how to perform initial setup, register your StorSimple iSCSI server, and complete device setup.
services: storsimple
documentationcenter: NA
author: alkohli
manager: carmonm
editor: ''

ms.assetid: 4db116d1-978b-48e8-b572-a719a8425dbc
ms.service: storsimple
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: TBD
ms.date: 02/27/2017
ms.author: alkohli
---
# Deploy StorSimple Virtual Array – Set up as an iSCSI server via Azure portal

![iscsi setup process flow](./media/storsimple-virtual-array-deploy3-iscsi-setup/iscsi4.png)

## Overview

This deployment tutorial applies to the Microsoft Azure StorSimple Virtual Array. This tutorial describes how to perform the initial setup, register your StorSimple iSCSI server, complete the device setup, and then create, mount, initialize, and format volumes on your StorSimple Virtual Array configured as an iSCSI server. 

The procedures described here take approximately 30 minutes to 1 hour to complete. The information published in this article applies to StorSimple Virtual Arrays only.

## Setup prerequisites

Before you configure and set up your StorSimple Virtual Array, make sure that:

* You have provisioned a virtual array and connected to it as described in [Deploy StorSimple Virtual Array - Provision a virtual array in Hyper-V](storsimple-ova-deploy2-provision-hyperv.md) or [Deploy StorSimple Virtual Array  - Provision a virtual array in VMware](storsimple-virtual-array-deploy2-provision-vmware.md).
* You have the service registration key from the StorSimple Device Manager service that you created to manage your StorSimple Virtual Arrays. For more information, see **Step 2: Get the service registration key** in [Deploy StorSimple Virtual Array - Prepare the portal](storsimple-virtual-array-deploy1-portal-prep.md#step-2-get-the-service-registration-key).
* If this is the second or subsequent virtual array that you are registering with an existing StorSimple Device Manager service, you should have the service data encryption key. This key was generated when the first device was successfully registered with this service. If you have lost this key, see **Get the service data encryption key** in [Use the Web UI to administer your StorSimple Virtual Array](storsimple-ova-web-ui-admin.md#get-the-service-data-encryption-key).

## Step-by-step setup

Use the following step-by-step instructions to set up and configure your StorSimple Virtual Array:

* [Step 1: Complete the local web UI setup and register your device](#step-1-complete-the-local-web-ui-setup-and-register-your-device)
* Step 2: Complete the required device setup
* [Step 3: Add a volume](#step-3-add-a-volume)
* [Step 4: Mount, initialize, and format a volume](#step-4-mount-initialize-and-format-a-volume)

## Step 1: Complete the local web UI setup and register your device

#### To complete the setup and register the device

1. Open a browser window. To connect to the web UI type:
   
    `https://<ip-address of network interface>`
   
    Use the connection URL noted in the previous step. You will see an error notifying you that there is a problem with the website’s security certificate. Click **Continue to this web page**.
   
    ![security certificate error](./media/storsimple-virtual-array-deploy3-iscsi-setup/image3.png)
2. Sign in to the web UI of your virtual device as **StorSimpleAdmin**. Enter the device administrator password that you changed in Step 3: Start the virtual device in [Deploy StorSimple Virtual Array - Provision a virtual device in Hyper-V](storsimple-virtual-array-deploy2-provision-hyperv.md) or [Deploy StorSimple Virtual Array - Provision a virtual device in VMware](storsimple-virtual-array-deploy2-provision-vmware.md).
   
    ![Sign-in page](./media/storsimple-virtual-array-deploy3-iscsi-setup/image4.png)
3. You will be taken to the **Home** page. This page describes the various settings required to configure and register the virtual device with the StorSimple Device Manager service. Note that the **Network settings**, **Web proxy settings**, and **Time settings** are optional. The only required settings are **Device settings** and **Cloud settings**.
   
    ![Home page](./media/storsimple-virtual-array-deploy3-iscsi-setup/image5.png)
4. On the **Network settings** page under **Network interfaces**, DATA 0 will be automatically configured for you. Each network interface is set by default to get an IP address automatically (DHCP). Therefore, an IP address, subnet, and gateway will be automatically assigned (for both IPv4 and IPv6).
   
    As you plan to deploy your device as an iSCSI server (to provision block storage), we recommend that you disable the **Get IP address automatically** option and configure static IP addresses.
   
    ![Network settings page](./media/storsimple-virtual-array-deploy3-iscsi-setup/image6.png)
   
    If you added more than one network interface during the provisioning of the device, you can configure them here. Note you can configure your network interface as IPv4 only or as both IPv4 and IPv6. IPv6 only configurations are not supported.
5. DNS servers are required because they are used when your device attempts to communicate with your cloud storage service providers or to resolve your device by name if it is configured as a file server. On the **Network settings** page under the **DNS servers**:
   
   1. A primary and secondary DNS server will be automatically configured. If you choose to configure static IP addresses, you can specify DNS servers. For high availability, we recommend that you configure a primary and a secondary DNS server.
   2. Click **Apply**. This will apply and validate the network settings.
6. On the **Device settings** page:
   
   1. Assign a unique **Name** to your device. This name can be 1-15 characters and can contain letter, numbers and hyphens.
   2. Click the **iSCSI server** icon ![iSCSI server icon](./media/storsimple-virtual-array-deploy3-iscsi-setup/image7.png) for the **Type** of device that you are creating. An iSCSI server will allow you to provision block storage.
   3. Specify if you want this device to be domain-joined. If your device is an iSCSI server, then joining the domain is optional. If you decide to not join your iSCSI server to a domain, click **Apply**, wait for the settings to be applied and then skip to the next step.
      
       If you want to join the device to a domain. Enter a **Domain name**, and then click **Apply**.
      
      > [!NOTE]
      > If joining your iSCSI server to a domain, ensure that your virtual  array is in its own organizational unit (OU) for Microsoft Azure Active Directory and no group policy objects (GPO) are applied to it.
      > 
      > 
   4. A dialog box will appear. Enter your domain credentials in the specified format. Click the check icon ![check icon](./media/storsimple-virtual-array-deploy3-iscsi-setup/image15.png). The domain credentials will be verified. You will see an error message if the credentials are incorrect.
      
       ![credentials](./media/storsimple-virtual-array-deploy3-iscsi-setup/image8.png)
   5. Click **Apply**. This will apply and validate the device settings.
7. (Optionally) configure your web proxy server. Although web proxy configuration is optional, be aware that if you use a web proxy, you can only configure it here.
   
    ![configure web proxy](./media/storsimple-virtual-array-deploy3-iscsi-setup/image9.png)
   
    On the **Web proxy** page:
   
   1. Supply the **Web proxy URL** in this format: *http:\//host-IP address* or *FQDN:Port number*. Note that HTTPS URLs are not supported.
   2. Specify **Authentication** as **Basic** or **None**.
   3. If you are using authentication, you will also need to provide a **Username** and **Password**.
   4. Click **Apply**. This will validate and apply the configured web proxy settings.
8. (Optionally) configure the time settings for your device, such as time zone and the primary and secondary NTP servers. NTP servers are required because your device must synchronize time so that it can authenticate with your cloud service providers.
   
    ![Time settings](./media/storsimple-virtual-array-deploy3-iscsi-setup/image10.png)
   
    On the **Time settings** page:
   
   1. From the drop-down list, select the **Time zone** based on the geographic location in which the device is being deployed. The default time zone for your device is PST. Your device will use this time zone for all scheduled operations.
   2. Specify a **Primary NTP server** for your device or accept the default value of time.windows.com. Ensure that your network allows NTP traffic to pass from your datacenter to the Internet.
   3. Optionally specify a **Secondary NTP server** for your device.
   4. Click **Apply**. This will validate and apply the configured time settings.
9. Configure the cloud settings for your device. In this step, you will complete the local device configuration and then register the device with your StorSimple Device Manager service.
   
   1. Enter the **Service registration key** that you got in **Step 2: Get the service registration key** in [Deploy StorSimple Virtual Array - Prepare the Portal](storsimple-virtual-array-deploy1-portal-prep.md#step-2-get-the-service-registration-key).
   2. If this is not the first device that you are registering with this service, you will need to provide the **Service data encryption key**. This key is required with the service registration key to register additional devices with the StorSimple Device Manager service. For more information, refer to [Get the service data encryption key](storsimple-ova-web-ui-admin.md#get-the-service-data-encryption-key) on your local web UI.
   3. Click **Register**. This will restart the device. You may need to wait for 2-3 minutes before the device is successfully registered. After the device has restarted, you will be taken to the sign in page.
      
      ![Register device](./media/storsimple-virtual-array-deploy3-iscsi-setup/image11.png)
10. Return to the Azure portal.
11. Navigate to the **Devices** blade of your service. If you have a lot of resources, click **All resources**, click your service name (search for it if necessary), and then click **Devices**.
12. On the **Devices** blade, verify that the device has successfully connected to the service by looking up the status. The device status should be **Ready to set up**.
    
    ![Register device](./media/storsimple-virtual-array-deploy3-iscsi-setup/deployis1m.png)

## Step 2: Configure the device as iSCSI server

Perform the following steps in the Azure portal to complete the required device setup.

#### To configure the device as iSCSI server

1. Go to your StorSimple Device Manager service and then go to **Management > Devices**. In the **Devices** blade, select the device you just created. This device would show up as **Ready to set up**.
   
    ![Configure device as iSCSI server](./media/storsimple-virtual-array-deploy3-iscsi-setup/deployis1m.png) 
2. Click the device and you will see a banner message indicating that the device is ready to setup.
   
    ![Configure device as iSCSI server](./media/storsimple-virtual-array-deploy3-iscsi-setup/deployis2m.png)  
3. Click **Configure** on the device command bar. This opens up the **Configure** blade. In the **Configure** blade, do the following:
   
   * The iSCSI server name is automatically populated.
   * Make sure the cloud storage encryption is set to **Enabled**. This ensures that the data sent from the device to the cloud is encrypted.
   * Specify a 32-character encryption key and record it in a key management app for future reference.
   * Select a storage account to be used with your device. In this subscription, you can select an existing storage account, or you can click **Add** to choose an account from a different subscription.
     
     ![Configure device as iSCSI server](./media/storsimple-virtual-array-deploy3-iscsi-setup/deployis4m.png)
4. Click **Configure** to complete setting up the iSCSI server.
   
    ![Configure device as iSCSI server](./media/storsimple-virtual-array-deploy3-iscsi-setup/deployis5m.png) 
5. You will be notified that the iSCSI server creation is in progress. After the iSCSI server is successfully created, the **Devices** blade is updated and the corresponding device status is **Online**.
   
    ![Configure device as iSCSI server](./media/storsimple-virtual-array-deploy3-iscsi-setup/deployis9m.png)

## Step 3: Add a volume

1. In the **Devices** blade, select the device you just configured as an iSCSI server. Click **...** (alternatively right-click in this row) and from the context menu, select **Add volume**. You can also click **+ Add volume** from the command bar. This opens up the **Add volume** blade.
   
    ![Add a volume](./media/storsimple-virtual-array-deploy3-iscsi-setup/deployis10m.png)
2. In the **Add volume** blade, do the following:
   
   * In the **Volume name** field, enter a unique name for your volume. The name must be a string that contains 3 to 127 characters.
   * In the **Type** dropdown list, specify whether to create a **Tiered** or **Locally pinned** volume. For workloads that require local guarantees, low latencies, and higher performance, select **Locally pinned** **volume**. For all other data, select **Tiered** **volume**.
   * In the **Capacity** field, specify the size of the volume. A tiered volume must be between 500 GB and 5 TB and a locally pinned volume must be between 50 GB and 500 GB.
     
     A locally pinned volume is thickly provisioned and ensures that the primary data in the volume stays on the device and does not spill to the cloud.
     
     A tiered volume on the other hand is thinly provisioned. When you create a tiered volume, approximately 10% of the space is provisioned on the local tier and 90% of the space is provisioned in the cloud. For example, if you provisioned a 1 TB volume, 100 GB would reside in the local space and 900 GB would be used in the cloud when the data tiers. This in turn implies is that if you run out of all the local space on the device, you cannot provision a tiered share (because the 10% will not be available).
     
     ![Add a volume](./media/storsimple-virtual-array-deploy3-iscsi-setup/deployis12.png)
   * Click **Connected hosts**, select an access control record (ACR) corresponding to the iSCSI initiator that you want to connect to this volume, and then click **Select**. <br><br> 
3. To add a new connected host, click **Add new**, enter a name for the host and its iSCSI Qualified Name (IQN), and then click **Add**. If you don't have the IQN, go to [Appendix A: Get the IQN of a Windows Server host](#appendix-a-get-the-iqn-of-a-windows-server-host).
   
      ![Add a volume](./media/storsimple-virtual-array-deploy3-iscsi-setup/deployis15m.png)
4. When you're finished configuring your volume, click **OK**. A volume will be created with the specified settings and you will see a notification. By default, monitoring and backup will be enabled for the volume.
   
     ![Add a volume](./media/storsimple-virtual-array-deploy3-iscsi-setup/deployis18m.png)
5. To confirm that the volume was successfully created, go to the **Volumes** blade. You should see the volume listed.
   
   ![Add a volume](./media/storsimple-virtual-array-deploy3-iscsi-setup/deployis20m.png)

## Step 4: Mount, initialize, and format a volume

Perform the following steps to mount, initialize, and format your StorSimple volumes on a Windows Server host.

#### To mount, initialize, and format a volume

1. Open the **iSCSI initiator** app on the appropriate server.
2. In the **iSCSI Initiator Properties** window, on the **Discovery** tab, click **Discover Portal**.
   
    ![discover portal](./media/storsimple-virtual-array-deploy3-iscsi-setup/image22.png)
3. In the **Discover Target Portal** dialog box, supply the IP address of your iSCSI-enabled network interface, and then click **OK**.
   
    ![IP address](./media/storsimple-virtual-array-deploy3-iscsi-setup/image23.png)
4. In the **iSCSI Initiator Properties** window, on the **Targets** tab, locate the **Discovered targets**. (Each volume will be a discovered target.) The device status should appear as **Inactive**.
   
    ![discovered targets](./media/storsimple-virtual-array-deploy3-iscsi-setup/image24.png)
5. Select a target device and then click **Connect**. After the device is connected, the status should change to **Connected**. (For more information about using the Microsoft iSCSI initiator, see [Installing and Configuring Microsoft iSCSI Initiator][1].
   
    ![select target device](./media/storsimple-virtual-array-deploy3-iscsi-setup/image25.png)
6. On your Windows host, press the Windows Logo key + X, and then click **Run**.
7. In the **Run** dialog box, type **Diskmgmt.msc**. Click **OK**, and the **Disk Management** dialog box will appear. The right pane will show the volumes on your host.
8. In the **Disk Management** window, the mounted volumes will appear as shown in the following illustration. Right-click the discovered volume (click the disk name), and then click **Online**.
   
    ![disk management](./media/storsimple-virtual-array-deploy3-iscsi-setup/image26.png)
9. Right-click and select **Initialize Disk**.
   
    ![initialize disk 1](./media/storsimple-virtual-array-deploy3-iscsi-setup/image27.png)
10. In the dialog box, select the disk(s) to initialize, and then click **OK**.
    
    ![initialize disk 2](./media/storsimple-virtual-array-deploy3-iscsi-setup/image28.png)
11. The New Simple Volume wizard starts. Select a disk size, and then click **Next**.
    
    ![new volume wizard 1](./media/storsimple-virtual-array-deploy3-iscsi-setup/image29.png)
12. Assign a drive letter to the volume, and then click **Next**.
    
    ![new volume wizard 2](./media/storsimple-virtual-array-deploy3-iscsi-setup/image30.png)
13. Enter the parameters to format the volume. **On Windows Server, only NTFS is supported.** Set the allocation unit size to 64K. Provide a label for your volume. It is a recommended best practice for this name to be identical to the volume name you provided on your StorSimple Virtual Array. Click **Next**.
    
    ![new volume wizard 3](./media/storsimple-virtual-array-deploy3-iscsi-setup/image31.png)
14. Check the values for your volume, and then click **Finish**.
    
    ![new volume wizard 4](./media/storsimple-virtual-array-deploy3-iscsi-setup/image32.png)
    
    The volumes will appear as **Online** on the **Disk Management** page.
    
    ![volumes online](./media/storsimple-virtual-array-deploy3-iscsi-setup/image33.png)

## Next steps

Learn how to use the local web UI to [administer your StorSimple Virtual Array](storsimple-ova-web-ui-admin.md).

## Appendix A: Get the IQN of a Windows Server host

Perform the following steps to get the iSCSI Qualified Name (IQN) of a Windows host that is running Windows Server 2012.

#### To get the IQN of a Windows host

1. Start the Microsoft iSCSI initiator on your Windows host.
2. In the **iSCSI Initiator Properties** window, on the **Configuration** tab, select and copy the string from the **Initiator Name** field.
   
    ![iSCSI initiator properties](./media/storsimple-virtual-array-deploy3-iscsi-setup/image34.png)
3. Save this string.

<!--Reference link-->
[1]: https://technet.microsoft.com/library/ee338480(WS.10).aspx



