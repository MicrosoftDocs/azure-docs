<properties 
   pageTitle="Complete minimum device setup"
   description="Describes how to complete the minimum StorSimple device configuration."
   services="storsimple"
   documentationCenter="NA"
   authors="SharS"
   manager="adinah"
   editor="tysonn" />
<tags 
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="TBD"
   ms.date="08/07/2015"
   ms.author="v-sharos" />

#### To complete the minimum StorSimple device setup

1. In the **Devices** page, select the device, click the arrow against the device name to go to the specific device page. 

	![Devices page with device online](./media/storsimple-complete-minimum-device-setup/HCS_DevicesPageM-include.png) 

2. Click quick start icon ![Quick Start Icon](./media/storsimple-complete-minimum-device-setup/HCS_QuickStartIcon-include.png) to access the device quick start page. Click **Complete device setup** to start the **Configure device** wizard.

	![Device quick start page](./media/storsimple-complete-minimum-device-setup/Device_Quick_Start_page_1M.png)

2. On the **Basic Settings** page, do the following:
  1. Supply a **friendly name** for your device. The default device name reflects information such as the device model and serial number. You can assign a friendly name of up to 64 characters to manage your device.
  2. Set the **time zone** based on the geographic location in which the device is being deployed. Your device will use this time zone for all scheduled operations.
  3. Under **DNS Settings**, provide an address for your **Secondary DNS Server**. If you are using IPv6, the field will be populated based on the IPv6 prefix provided in the Windows PowerShell interface. 
  If the secondary DNS server is not configured, you will not be allowed to save your device configuration.
  4. Under iSCSI enabled interfaces, enable at least one network for iSCSI. At least one network interface needs to be cloud-enabled and one interface needs to be iSCSI-enabled. DATA 0 is automatically cloud-enabled.
 
      ![StorSimple minimum device setup basic settings](./media/storsimple-complete-minimum-device-setup/HCS_MinDeviceSetupBasicSettings1-include.png)

3. Click the arrow icon. ![StorSimple arrow icon](./media/storsimple-complete-minimum-device-setup/HCS_ArrowIcon-include.png)

4. On the **Network Interfaces** page, provide the fixed IP addresses for Controller 0 and Controller 1. If the DATA 0 interface was configured for IPv4, the fixed IP addresses need to be provided in the IPv4 format. If you provided a prefix for IPv6 configuration, the fixed IP addresses will be populated automatically in these fields.


	> [AZURE.NOTE] 
 	> 
 	> - The controller fixed IP addresses need to be free IPs within the subnet accessible by the device IP address.
 	> - The fixed IP addresses for the controller are used for servicing the updates to the device, and therefore the fixed IPs must be routable and able to connect to the Internet.

    ![StorSimple minimum device setup network interfaces](./media/storsimple-complete-minimum-device-setup/HCS_MinDeviceSetupNetworkInterfaces2-include.png)

5. Click the check icon ![StorSimple check icon](./media/storsimple-complete-minimum-device-setup/HCS_CheckIcon-include.png).
  You will return to the device **Quick Start** page.

 > [AZURE.NOTE] You can modify all the other device settings at any time by accessing the **Configure** page.
