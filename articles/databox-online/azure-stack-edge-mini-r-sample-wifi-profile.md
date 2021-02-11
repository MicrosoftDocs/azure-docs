---
title: Use a sample WiFi profile to test wireless connectivity for an Azure Stack Edge Mini R Wi-Fi device
description: Describes how to use a sample WiFi profile to test wireless connectivity for a Azure Stack Edge Mini R device.
services: databox
author: v-dalc@microsoft.com

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 02/11/2021
ms.author: alkohli
#Customer intent: As an IT administrator, I want to have a WiFi profile that I can give to users to use with their Azure Stack Edge Pro Mini R devices.
---

# Use a sample WiFi profile to test wireless connectivity for your Azure Stack Edge Mini R device

This article describes how to test wireless network connectivity for an Azure Stack Edge Mini R device using a sample WiFi profile.

You can use this profile for testing if your network administrator hasn't provided a wireless network (WiFi) profile for your environment. User scenario: HAVE A WIFI PROFILE AT THE READY TO USE WITH StorSimple DEVICES.

> [!IMPORTANT]
> - The sample profile is for testing purposes only. The profile won't work in all environments. Before you use the profile, make sure it complies with your organization's wireless networking guidelines.
> - If your network administrator has a WiFi profile available that meets your organization's security standards, you should use that profile instead and follow the steps in [Manage wireless connectivity on your Azure Stack Edge Mini R](./azure-stack-edge-mini-r-manage-wifi.md).

## About Wi-Fi profiles

A wireless network (WiFi) profile contains the SSID (network name), password key, and security information to be able to connect your Azure Stack Edge Mini R device to a wireless network. For more information, see [Manage wireless connectivity on your Azure Stack Edge Mini R](./azure-stack-edge-mini-r-manage-wifi.md).

To enable wireless networking, you configure the WiFi port, add the WiFi profile, and then connect to the profile.

## Download a wireless profile

WiFi profiles vary widely. When you create a standard WiFi profile for your Azure Stack Edge Pro R Mini devices, you'll want to start from a profile that your organization uses. You can easily download a WiFi profile to work from.

To download a wireless networking profile, do these steps:

1. To see the wireless profiles on your computer, on the **Start** menu, open **Command prompt** (cmd.exe), and enter this command:

   `netsh wlan show profiles`

   The output will look something like this:<!--Output needs further editing. I just replaced "MS with "Contoso". Too close to home.-->

   ```dos
   Profiles on interface Wi-Fi:

   Group policy profiles (read only)
   ---------------------------------
       <None>

   User profiles
   -------------
       All User Profile     : ContosoCONNECT
       All User Profile     : ContosoCORP
       All User Profile     : ContosoFTINET
       All User Profile     : CenturyLink7006
       All User Profile     : Boat
    ```

2. To export a profile, enter the following command:

   `netsh wlan export profile name=”<profileName>” folder=”<path>\<profileName>"

   For example, the following command saves the ContosoFTINET profile in XML format to gusp’s Downloads folder.

   ```dos
   C:\Users\gusp>netsh wlan export profile name="ContosoFTINET" folder=c:Downloads

   Interface profile "ContosoFTINET" is saved in file "c:Downloads\ContosoFTINET.xml" successfully.

   ```

## Sample WiFi profile

The following sample WiFi profile is designed for testing WiFi over Cisco wireless networking devices.


```xml
<?xml version="1.0"?>
<WLANProfile xmlns="http://www.microsoft.com/networking/WLAN/profile/v1">
	<name>Cisco_Test</name>
	<SSIDConfig>
		<SSID>
			<hex>123456712A3B45671234</hex>       
			<name>Cisco_Test</name>
		</SSID>
	</SSIDConfig>
	<connectionType>ESS</connectionType>
	<connectionMode>auto</connectionMode>
	<MSM>
		<security>
			<authEncryption>
				<authentication>WPA2PSK</authentication>
				<encryption>AES</encryption>
				<useOneX>false</useOneX>
			</authEncryption>
			<sharedKey>
				<keyType>passPhrase</keyType>
				<protected>false</protected>
				<keyMaterial>StorSim1</keyMaterial>
			</sharedKey>
		</security>
	</MSM>
	<MacRandomization xmlns="http://www.microsoft.com/networking/WLAN/profile/v3">
		<enableRandomization>false</enableRandomization>
	</MacRandomization>
</WLANProfile>

```

Settings to update for their environment (table)

For more information about WiFi settings, see **Enterprise profile** in [Add settings for Windows 10 and later WiFi](/mem/intune/configuration/wi-fi-settings-windows#enterprise-profile) and [Configure a Cisco wireless controller and access point on your device](./azure-stack-edge-mini-r-manage-wifi.md#configure-cisco-wi-fi-profile).

Make sure the profile complies with networking security requirements for your organization.

## Connect to profile from device

High-level instructions. For details/specifics, lnk to: /databox-online/azure-stack-edge-mini-r-manage-wifi#add-connect-to-wi-fi-profile. 

## Next steps

- Learn how to [Configure network for Azure Stack Edge Mini R](azure-stack-edge-mini-r-deploy-configure-network-compute-web-proxy.md)
- Learn how to [Manage WiFi on your Azure Stack Edge Mini R](azure-stack-edge-mini-r-manage-wifi.md).
