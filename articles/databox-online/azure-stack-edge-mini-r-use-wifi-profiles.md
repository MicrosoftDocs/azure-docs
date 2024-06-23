---
title: Use Wi-Fi profiles with Azure Stack Edge Mini R devices
description: Describes how to create Wi-Fi profiles for Azure Stack Edge Mini R devices on high-security enterprise networks and personal networks.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 11/10/2023
ms.author: alkohli
#Customer intent: As an IT pro or network administrator, I need to give users secure wireless access to their Azure Stack Edge Mini R devices.    
---

# Use Wi-Fi profiles with Azure Stack Edge Mini R devices

This article describes how to use wireless network (Wi-Fi) profiles with your Azure Stack Edge Mini R devices.

> [!NOTE]
> On Azure Stack Edge 2309 and later, Wi-Fi functionality for Azure Stack Edge Mini R has been deprecated. Wi-Fi is no longer supported on the Azure Stack Edge Mini R device.

How you prepare the Wi-Fi profile depends on the type of wireless network:

- On a Wi-Fi Protected Access 2 (WPA2) personal network, you can download and use an existing wireless profile with the same password you use with other devices.

- In a high-security enterprise environment, access your device over a WPA2 enterprise network. On this type of network, each client computer has a distinct Wi-Fi profile and is authenticated via certificates. Work with your network administrator to determine the required configuration.

Before you test or use the profile with your device, ensure that the profile meets the security requirements of your organization.

## About Wi-Fi profiles

A Wi-Fi profile contains the SSID (service set identifier, or **network name**), password key, and security information to connect your Azure Stack Edge Mini R device to a wireless network.

The following code example shows basic settings for a profile to use with a typical wireless network:

* `SSID` is the network name.

* `name` is the user-friendly name for the Wi-Fi connection that users see when they browse available connections on their device.

* The profile is configured to automatically connect the computer to the wireless network when it's within range of the network (`connectionMode` = `auto`).

```html
<?xml version="1.0"?>
<WLANProfile xmlns="http://www.contoso.com/networking/WLAN/profile/v1">
	<name>ContosoWIFICORP</name>
	<SSIDConfig>
		<SSID>
			<hex>1A234561234B5012</hex>
		</SSID>
		<nonBroadcast>false</nonBroadcast>
	</SSIDConfig>
	<connectionType>ESS</connectionType>
	<connectionMode>auto</connectionMode>
	<autoSwitch>false</autoSwitch>
```

For more information about Wi-Fi profile settings, see **Enterprise profile** in [Add Wi-Fi settings for Windows 10 and newer devices](/mem/intune/configuration/wi-fi-settings-windows#enterprise-profile), and see [Configure Cisco Wi-Fi profile](azure-stack-edge-mini-r-manage-wifi.md#configure-cisco-wi-fi-profile).

To enable wireless connections on an Azure Stack Edge Mini R device, configure the Wi-Fi port on your device, and then add the Wi-Fi profile(s) to the device. On an enterprise network, also upload certificates to the device. You can then connect to a wireless network from the local web UI for the device. For more information, see [Manage wireless connectivity on your Azure Stack Edge Mini R](./azure-stack-edge-mini-r-manage-wifi.md).

## Profile for WPA2 - Personal network

On a Wi-Fi Protected Access 2 (WPA2) personal network, like a home network or Wi-Fi open hotspot, multiple devices can use the same profile and the same password. On your home network, your mobile phone and laptop use the same wireless profile and password to connect to the network.

For example, a Windows 10 client can generate a runtime profile for you. When you sign in to the wireless network, you're prompted for the Wi-Fi password and, once you provide that password, you're connected. No certificate is needed in this environment.

On this type of network, you can export a Wi-Fi profile from your laptop, and then add it to your Azure Stack Edge Mini R device. For deteild steps, see [Export a Wi-Fi profile](#export-a-wi-fi-profile), below.

> [!IMPORTANT]
> Before you create a Wi-Fi profile for your Azure Stack Edge Mini R device, contact your network administrator about security requirements for wireless networking. You shouldn't test or use any Wi-Fi profile on your device until you know the wireless network meets requirements.

## Profiles for WPA2 - Enterprise network

On a Wireless Protected Access 2 (WPA2) enterprise network, work with your network administrator to get Wi-Fi profile and certificate details to connect your Azure Stack Edge Mini R device to the network.

For highly secure networks, the Azure device can use Protected Extensible Authentication Protocol (PEAP) with Extensible Authentication Protocol-Transport Layer Security (EAP-TLS). PEAP with EAP-TLS uses machine authentication where the client and server use certificates to verify their identities to each other.

> [!NOTE]
> * User authentication using PEAP Microsoft Challenge Handshake Authentication Protocol version 2 (PEAP MSCHAPv2) is not supported on Azure Stack Edge Mini R devices.
> * EAP-TLS authentication is required to access Azure Stack Edge Mini R functionality. A wireless connection that you set up using Active Directory won't work.

The network administrator will generate a unique Wi-Fi profile and a client certificate for each computer. The network administrator decides whether to use a separate certificate or a shared certificate for each device.

If you work in more than one physical location at the workplace, the network administrator can provide more than one site-specific Wi-Fi profile and certificate for your wireless connections.

On an enterprise network, we recommend that you don't change settings in the Wi-Fi profiles that your network administrator provides. The only adjustment you can make is to automatic connection settings. For more information, see [Basic profile](/mem/intune/configuration/wi-fi-settings-windows#basic-profile) in Wi-Fi settings for Windows 10 and newer devices.

In a high-security enterprise environment, you can use an existing wireless network profile as a template:

* You can download the corporate wireless network profile from your work computer. For instructions, see [Export a Wi-Fi profile](#export-a-wi-fi-profile), below.

* If others in your organization are already connecting to their Azure Stack Edge Mini R devices over a wireless network, they can download the Wi-Fi profile from their device. For instructions, see [Download Wi-Fi profile](azure-stack-edge-mini-r-manage-wifi.md#download-wi-fi-profile).

## Export a Wi-Fi profile

Use the following steps to export a profile for the Wi-Fi interface on your computer:

1. Make sure the computer you use to export the wireless profile can connect to the Wi-Fi network that your device will use.

1. To see the wireless profiles on your computer, on the **Start** menu, open **Command prompt** (cmd.exe), and enter this command:

   `netsh wlan show profiles`

   Example output:

   ```dos
   Profiles on interface Wi-Fi:

   Group policy profiles (read only)
   ---------------------------------
       <None>

   User profiles
   -------------
       All User Profile     : ContosoCORP
       All User Profile     : ContosoFTINET
       All User Profile     : GusIS2809
       All User Profile     : GusGuests
       All User Profile     : SeaTacGUEST
       All User Profile     : Boat
   ```

1. To export a profile, run the following command:

   `netsh wlan export profile name=”<profileName>” folder=”<path>\<profileName>" key=clear`

   For example, the following command saves the ContosoFTINET profile in XML format to the Downloads folder for the user named `gusp`.

   ```dos
   C:\Users\gusp>netsh wlan export profile name="ContosoFTINET" folder=c:Downloads key=clear

   Interface profile "ContosoFTINET" is saved in file "c:Downloads\ContosoFTINET.xml" successfully.
   ```

## Add certificate, Wi-Fi profile to device

When you have the Wi-Fi profiles and certificates that you need, use the following steps to configure your Azure Stack Edge Mini R device for wireless connections:

1. For a WPA2 - Enterprise network, upload required certificates to the device following the guidance in [Upload certificates](./azure-stack-edge-gpu-manage-certificates.md#upload-certificates).

1. Upload the Wi-Fi profile(s) to the Mini R device and then connect to it by following the guidance in [Add, connect to Wi-Fi profile](./azure-stack-edge-mini-r-manage-wifi.md#add-connect-to-wi-fi-profile).

## Next steps

- Learn how to [Configure network for Azure Stack Edge Mini R](azure-stack-edge-mini-r-deploy-configure-network-compute-web-proxy.md).
- Learn how to [Manage Wi-Fi on your Azure Stack Edge Mini R](azure-stack-edge-mini-r-manage-wifi.md).
