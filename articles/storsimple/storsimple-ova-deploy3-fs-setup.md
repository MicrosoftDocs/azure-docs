<properties
   pageTitle="Deploy StorSimple Virtual Array 3 - Set up the virtual device as file server"
   description="This third tutorial in StorSimple Virtual Array deployment instructs you to set up a virtual device as file server."
   services="storsimple"
   documentationCenter="NA"
   authors="alkohli"
   manager="carmonm"
   editor=""/>

<tags
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="05/26/2016"
   ms.author="alkohli"/>

# Deploy StorSimple Virtual Array - Set up as file server

![](./media/storsimple-ova-deploy3-fs-setup/fileserver4.png)

## Introduction 

This article applies to Microsoft Azure StorSimple Virtual Array (also known as the StorSimple on-premises virtual device or StorSimple virtual device) running March 2016 general availability (GA) release. This article describes how to perform initial setup, register your StorSimple file server, complete the device setup, and create and connect to SMB shares. This is the last article in the series of deployment tutorials required to completely deploy your virtual array as a file server or an iSCSI server.

The setup and configuration process can take around 10 minutes to complete.


## Setup prerequisites

Before you configure and set up your StorSimple virtual device, make sure that:

-   You have provisioned a virtual device and connected to it as detailed in the [Provision a StorSimple Virtual Array in Hyper-V](storsimple-ova-deploy2-provision-hyperv.md) or [Provision a StorSimple Virtual Array in VMware](storsimple-ova-deploy2-provision-vmware.md).

-   You have the service registration key from the StorSimple Manager service that you created to manage StorSimple virtual devices. For more information, see [Step 2: Get the service registration key](storsimple-ova-deploy1-portal-prep.md#step-2-get-the-service-registration-key) for StorSimple Virtual Array.

-   If this is the second or subsequent virtual device that you are registering with an existing StorSimple Manager service, you should have the service data encryption key. This key was generated when the first device was successfully registered with this service. If you have lost this key, see [Get the service data encryption key](storsimple-ova-web-ui-admin.md#get-the-service-data-encryption-key) for your StorSimple Virtual Array.

## Step-by-step setup

Use the following step-by-step instructions to set up and configure your StorSimple virtual device.

## Step 1: Complete the local web UI setup and register your device 


#### To complete the setup and register the device

1.  Open a browser window and connect to the local web UI.Type:	

    `https://<ip-address of network interface>`

	Use the connection URL noted in the previous step. You will see an error indicating that there is a problem with the website’s security certificate. Click **Continue to this webpage**.

	![](./media/storsimple-ova-deploy3-fs-setup/image2.png)

1.  Sign in to the web UI of your virtual device as **StorSimpleAdmin**. Enter the device administrator password that you changed in Step 3: Start the virtual device in [Provision a StorSimple Virtual Array in Hyper-V](storsimple-ova-deploy2-provision-hyperv.md) or in [Provision a StorSimple Virtual Array in VMware](storsimple-ova-deploy2-provision-vmware.md).

	![](./media/storsimple-ova-deploy3-fs-setup/image3.png)

1.  You will be taken to the **Home** page. This page describes the various settings required to configure and register the virtual device with the StorSimple Manager service. Note that the **Network settings**, **Web proxy settings**, and **Time settings** are optional. The only required settings are **Device settings** and **Cloud settings**.

	![](./media/storsimple-ova-deploy3-fs-setup/image4.png)

1.  In the **Network settings** page under **Network interfaces**, DATA 0 will be automatically configured for you. Each network interface is set by default to get IP address automatically (DHCP). Hence, an IP address, subnet, and gateway will be automatically assigned (for both IPv4 and IPv6).

	![](./media/storsimple-ova-deploy3-fs-setup/image5.png)

	If you added more than one network interface during the provisioning of the device, you can configure them here. Note you can configure your network interface as IPv4 only or as both IPv4 and IPv6. IPv6 only configurations are not supported.

1.  DNS servers are required because they are used when your device attempts to communicate with your cloud storage service providers or to resolve your device by name when configured as a file server. In the **Network settings** page under the **DNS servers**:

    1.  A primary and secondary DNS server will be automatically configured. If you choose to configure static IP addresses, you can specify DNS servers. For high availability, we recommend that you configure a primary and a secondary DNS server.

    2.  Click **Apply**. This will apply and validate the network settings.

2.  In the **Device settings** page:

    1.  Assign a unique **Name** to your device. This name can be 1-15 characters and can contain letter, numbers and hyphens.

    2.  Click the **File server** icon ![](./media/storsimple-ova-deploy3-fs-setup/image6.png) for the **Type** of device that you are creating. A file server will allow you to create shared folders.

    3.  As your device is a file server, you will need to join the device to a domain. Enter a **Domain name**.

	1.  Click **Apply**.

2.  A dialog box will appear. Enter your domain credentials in the specified format. Click the check icon. The domain credentials will be verified. You will see an error message if the credentials are incorrect.

	![](./media/storsimple-ova-deploy3-fs-setup/image7.png)

1.  Click **Apply**. This will apply and validate the device settings.

	![](./media/storsimple-ova-deploy3-fs-setup/image8.png)

	> [AZURE.NOTE]
	> 
	> Ensure that your virtual array is in its own organizational unit (OU) for Active Directory and no group policy objects 
	> (GPO) are applied to it or inherited. Group policy may install applications such as anti-virus software on the StorSimple Virtual Array. Installing additional software is not supported and could lead to data corruption. 

1.  (Optionally) configure your web proxy server. Although web proxy configuration is optional, be aware that if you use a web proxy, you can only configure it here.

	![](./media/storsimple-ova-deploy3-fs-setup/image9.png)

	In the **Web proxy** page:

	1.  Supply the **Web proxy URL** in this format: *http://&lt;host-IP address or FDQN&gt;:Port number*. Note that HTTPS URLs are not supported.

	2.  Specify **Authentication** as **Basic** or **None**.

	3.  If using authentication, you will also need to provide a **Username** and **Password**.

	4.  Click **Apply**. This will validate and apply the configured web proxy settings.

1.  (Optionally) configure the time settings for your device, such as time zone and the primary and secondary NTP servers. NTP servers are required because your device must synchronize time so that it can authenticate with your cloud service providers.

	![](./media/storsimple-ova-deploy3-fs-setup/image10.png)

	In the **Time settings** page:

	1.  From the dropdown list, select the **Time zone** based on the geographic location in which the device is being deployed. The default time zone for your device is PST. Your device will use this time zone for all scheduled operations.

	2.  Specify a **Primary NTP server** for your device or accept the default value of time.windows.com. Ensure that your network allows NTP traffic to pass from your datacenter to the Internet.

	3.  Optionally specify a **Secondary NTP server** for your device.

	4.  Click **Apply**. This will validate and apply the configured time settings.

1.  Configure the cloud settings for your device. In this step, you will complete the local device configuration and then register the device with your StorSimple Manager service.

    1.  Enter the **Service registration key** that you got in [Step 2: Get the service registration key](storsimple-ova-deploy1-portal-prep.md#step-2-get-the-service-registration-key) for StorSimple Virtual Array.

    2.  Skip this step if this is your first device registering with this service and go to the next step. If this is not the first device that you are registering with this service, you will need to provide the **Service data encryption key**. This key is required with the service registration key to register additional devices with the StorSimple Manager service. For more information, refer to get the [service data encryption key](storsimple-ova-web-ui-admin.md#get-the-service-data-encryption-key) on your local web UI.

    3.  Click **Register**. This will restart the device. You may need to wait for 2-3 minutes before the device is successfully registered. After the device has restarted, you will be taken to the sign in page.

		![](./media/storsimple-ova-deploy3-fs-setup/image13.png)
	

1.  Return to the Azure classic portal. On the **Devices** page, verify that the device has successfully connected to the service by looking up the status. The device status should be **Active**.

![](./media/storsimple-ova-deploy3-fs-setup/image12.png)

## Step 2: Complete the required device setup

To complete the device configuration of your StorSimple device, you need to:

-   Select a storage account to associate with your device.

-   Choose encryption settings for the data that is sent to cloud.

Perform the following steps in the [Azure classic portal](https://manage.windowsazure.com/) to complete the required device setup.

#### To complete the minimum device setup

1.  From the **Devices** page, select the device you just created. This device would show up as **Active**. Click the arrow against the device name and then click **Quick Start**.

2.  Click **complete device setup** to start the Configure device wizard.

3.  In the Configure device wizard on the **Basic Settings** page, do the following:

	1.  Specify a storage account to be used with your device. You can select an existing storage account in this subscription from the dropdown list or specify **Add more** to choose an account from a different subscription.

	2.  Define the encryption settings for all the data-at-rest (AES encryption) that will be sent to the cloud. To encrypt your data, check the combo box to **enable cloud storage encryption key**. Enter a cloud storage encryption that contains 32 characters. Reenter the key to confirm it. A 256-bit AES key will be used with the user-defined key for encryption.

	3.  Click the check icon ![](./media/storsimple-ova-deploy3-fs-setup/image15.png).

		![](./media/storsimple-ova-deploy3-fs-setup/image16.png)

The settings will now be updated. After settings are updated successfully, the complete device setup button will be grayed out. You will return to the device **Quick Start** page.

 ![](./media/storsimple-ova-deploy3-fs-setup/image17.png)


> [AZURE.NOTE]                                                              
>
> You can modify all the other device settings at any time by accessing the **Configure** page.

## Step 3: Add a share

Perform the following steps in the [Azure classic portal](https://manage.windowsazure.com/) to create a share.

#### To create a share

1.  On the device **Quick Start** page, click **Add a share**. This starts the Add a share wizard.

	![](./media/storsimple-ova-deploy3-fs-setup/image17.png)

1.  On the **Basic Settings** page, do the following:

    1.  Specify a unique name for your share. The name must be a string that contains 3 to 127 characters.

    2.  (Optional) Provide a description for the share. The description will help identify the share owners.

    3.  Select a usage type for the share. The usage type can be **Tiered** or **Locally pinned**, with tiered being the default. For workloads that require local guarantees, low latencies, and higher performance, select a **Locally pinned** share. For all other data, select a **Tiered** share.

	A locally pinned share is thickly provisioned and ensures that the primary data on the share stays local to the device and does not spill to the cloud. A tiered share on the other hand is thinly provisioned. When you create a tiered share, 10% of the space is provisioned on the local tier and 90% of the space is provisioned in the cloud. For instance, if you provisioned a 1 TB volume, 100 GB would reside in the local space and 900 GB would be used in the cloud when the data tiers. This in turn implies that if you run out of all the local space on the device, you cannot provision a tiered share.

1.  Specify the provisioned capacity for your share. Note that the specified capacity should be smaller than the available capacity. If using a tiered share, the share size should be between 500 GB and 20 TB. For a locally pinned share, specify a share size between 50 GB and 2 TB. Use the available capacity as a guide to provision a share. If the available local capacity is 0 GB, then you will not be allowed to provision local or tiered shares.

	![](./media/storsimple-ova-deploy3-fs-setup/image18.png)

1.  Click the arrow icon ![](./media/storsimple-ova-deploy3-fs-setup/image19.png) to go to the next page.

1.  In the **Additional Settings** page, assign the permissions to the user or the group that will be accessing this share. Specify the name of the user or the user group in *<john@contoso.com>* format. We recommend that you use a user group (instead of a single user) to allow admin privileges to access these shares. After you have assigned the permissions here, you can then use Windows Explorer to modify these permissions.

	![](./media/storsimple-ova-deploy3-fs-setup/image20.png)

1.  Click the check icon ![](./media/storsimple-ova-deploy3-fs-setup/image21.png). A share will be created with the specified settings. By default, monitoring and backup will be enabled for the share.

## Step 4: Connect to the share

You will now need to connect to the share(s) that you created in the previous step. Perform these steps on your Windows Server host.

#### To connect to the share

1.  Press ![](./media/storsimple-ova-deploy3-fs-setup/image22.png) + R. In the Run window, specify the *\\<file server name>* as the path, replacing *file server name* with the device name that you assigned to your file server. Click **OK**.

	![](./media/storsimple-ova-deploy3-fs-setup/image23.png)

2.  This will open up Explorer. You should now be able to see the shares that you created as folders. Select and double-click a share (folder) to view the content.

	![](./media/storsimple-ova-deploy3-fs-setup/image24.png)

3.  You can now add files to these shares and take a backup.

![video icon](./media/storsimple-ova-deploy3-fs-setup/video_icon.png) **Video available**

Watch the video to see how you can configure and register a StorSimple Virtual Array as a file server.

> [AZURE.VIDEO configure-a-storsimple-virtual-array]

## Next steps

Learn how to use the local web UI to [administer your StorSimple Virtual Array](storsimple-ova-web-ui-admin.md).
