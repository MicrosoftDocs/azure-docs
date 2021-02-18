---
title: Create WiFi profiles for Azure Stack Edge Mini R devices
description: Describes how to create Wi-Fi profiles for Azure Stack Edge Mini R devices in high-security enterprise networks and simple home networks.
services: databox
author: v-dalc@microsoft.com

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 02/18/2021
ms.author: alkohli
---

# Create a Wi-Fi profile to use with Azure Stack Edge Mini R devices

This article describes how to create wireless network (Wi-Fi) profiles for Azure Stack Edge Mini R devices. You may do most of your work on devices over a wired network, but you'll probably need one or more wireless connections for secondary work locations or work away from the office.

You'll need to add a Wi-Fi profile for each wireless network to your device. On a simple home network, you may be able to download and use an existing Wi-Fi profile.

In a high-security enterprise environment, each client computer will have a distinct profile and/or authentication, and you'll need to work with the network administrators to determine the required configuration. 

In either case, it's very important to make sure the Wi-Fi profile complies with the security requirements of your organization before you test or use the profile with your device. <!--Terminology issue: "Profile" - Call is a Wi-Fi profile consistently? In Windows exports, it's spoken of in terms of "a profile" (could be a user profile or a group policy profile) on the Wi-Fi interface."-->

## About Wi-Fi profiles

A wireless network (Wi-Fi) profile contains the SSID (network name), password key, and security information to be able to connect your Azure Stack Edge Mini R device to a wireless network. The following code snippet shows basic settings for a typical wireless network.<!--Gloss: SSID, Profile name, Network name, Autoconnect, Autoswitch.-->

```html
<?xml version="1.0"?>
<WLANProfile xmlns="http://www.microsoft.com/networking/WLAN/profile/v1">
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

For more information about Wi-Fi profile settings, see **Enterprise profile** in [Add settings for Windows 10 and later Wi-Fi](/mem/intune/configuration/wifi-settings-windows#enterprise-profile) and [Configure a Cisco wireless controller and access point on your device](./azure-stack-edge-mini-r-manage-wifi.md#configure-cisco-wifi-profile).

To enable wireless connections, you configure the Wi-Fi port on your device, add the Wi-Fi profile(s), and connect to the networks. For more information, see [Manage wireless connectivity on your Azure Stack Edge Mini R](./azure-stack-edge-mini-r-manage-wifi.md).

### Profile for home network

On a typical home network, different devices - such as a laptop and a mobile phone connected to the network - may use identical profiles and the same passwords.

For example, a Windows 10 client can generate a runtime profile for you. When you log onto the Wi-Fi network, you're prompted for the Wi-Fi password and, once you provide that password, you're connected. No network information is needed except the password.

On this type of home network, you may be able to export a Wi-Fi profile from your laptop, and then import it to your device.<!--How much editing do we assume they need to do? Are they editing the profile or updating security on their wireless network?--> 

> [!IMPORTANT] 
> Before you create a Wi-Fi profile for your Azure Stack Edge Mini R device, contact your network administrator to find out the organization's security requirements for wireless networking. You shouldn't test or use any Wi-Fi profile on your device until you know the wireless network meets requirements.

### Profiles for high-security enterprise networks

If you're preparing a Wi-Fi profile to use in a high-security enterprise environment, you'll need to work with the network administrators to find out the settings that the wireless network connections require.

On a high-security enterprise network, different devices may use different profiles to connect to the network. A radius server typically does server-side authentication. The network then generates a distinct profile and/or authentication for each client computer that accesses the server. The profiles and authentication have a machine-specific component.<!--Add a code snippet from -->

Before you create a Wi-Fi profile for your Azure Stack Edge Mini R device, you need to get the following information from your network administrator:<!--Make this a "Before your begin item?-->

- Does the network generate profiles/authentication for each client? If so, the network controls all of this information.

- What Wi-Fi protocol (for example, OneX) and group policies are implemented on the network?

- What IT tooling is used to manage these policies?<!--What does "IT tooling" entail? Can we just say "How are group policies being managed?" Would the network admin share this type of information with the end use for this procedure, or would they just provide explicit instructions - or tell them whom to request group membership from?-->

- Does your organization use different wireless networks in different locations? Do you need multiple wireless profiles on your device?<!--Link to new procedure, below.-->

Use this information to create the wireless profiles and certificates that you need for the workplace.

> [!NOTE]
> If other people in your organization are connecting to their Azure Stack Edge devices over a wireless network, you may be able to use the Wi-Fi profile on their device as a template. For more information, see [Download Wi-Fi profile](./azure-stack-edge-mini-r-manage-wifi.md#download-wi-fi-profile).

### Download a Wi-Fi profile

To export a Wi-Fi profile and add it to your Azure Stack Edge Mini R device, do these steps:

1. To see the wireless profiles on your computer, on the **Start** menu, open **Command prompt** (cmd.exe), and enter this command:

   `netsh wlan show profiles`

   The output will look something like this:

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

2. To export a profile, enter the following command:

   `netsh wlan export profile name=”<profileName>” folder=”<path>\<profileName>"`

   For example, the following command saves the ContosoFTINET profile in XML format to the Downloads folder for the user named `gusp`.

   ```dos
   C:\Users\gusp>netsh wlan export profile name="ContosoFTINET" folder=c:Downloads

   Interface profile "ContosoFTINET" is saved in file "c:Downloads\ContosoFTINET.xml" successfully.
   ```

## Site-specific profiles needed?

If your Azure Stack Edge Mini R device will move between sites - say, between Site A and Site B - and the sites have different WiFi networks, each network will have a distinct SSID, and you'll need a different profile for each site.<!--The link between client-specific and site-specific is not clear.-->

To find out whether you need a different Wi-Fi profile for each site, do these steps:

1. Connect your laptop to the Wi-Fi from Site A.

1. From a command line, run the `netsh export` command to export the profile for that wireless network. For steps, see [Download a Wi-Fi profile](#download-a-wifi-profile).  

1. Check the profile for any settings that are specific to the client computer. The client-specific information will look similar to the sample XML below. In the `Security` section, the authentication mode (`authMode`) for the `OneX` Wi-Fi protocol is set to `machine`.<!--May need to pull a larger sample, but there's no stopping point in the following lines.-->

   ```html
   	<MSM>
   		<security>
   			<authEncryption>
   				<authentication>WPA2</authentication>
   				<encryption>AES</encryption>
   				<useOneX>true</useOneX>
   			</authEncryption>
   			<PMKCacheMode>enabled</PMKCacheMode>
   			<PMKCacheTTL>720</PMKCacheTTL>
   			<PMKCacheSize>128</PMKCacheSize>
   			<preAuthThrottle>3</preAuthThrottle>
   			<OneX xmlns="http://www.microsoft.com/networking/OneX/v1">
   				<maxAuthFailures>1</maxAuthFailures>
   				<authMode>machine</authMode>
  ```

   - If the profile doesn't have any client-specific component, you can use the same profile for Site B.

   - If the profile has a client-specific component, you'll need to get multiple profiles from the network administrators.

1. Enable **Autoconnect** on each network you want to connect to automatically.

   You may be able to set **Autoconnect** on multiple networks if the device won't be on more than one of those networks at the same time.

For more information about Wi-Fi profile settings, see **Enterprise profile** in [Add settings for Windows 10 and later Wi-Fi](/mem/intune/configuration/wifi-settings-windows#enterprise-profile) and [Configure a Cisco wireless controller and access point on your device](./azure-stack-edge-mini-r-manage-wifi.md#configure-cisco-wifi-profile).

## Add Wi-Fi profiles to device

When you have the Wi-Fi profiles and certificates that you need, do these steps to configure your Azure Stack Edge Mini R device for wireless connections:

1.  Go to the local web UI of your Azure Stack Edge Mini R device.

1. For a high-security enterprise network, upload the needed certificates to the device following the guidance in [Upload certificates](./azure-stack-edge-gpu-manage-certificates.md#upload-certificates).<!--Is this the correct topic to site? At this point, they have their certs, so we point directly to uploading?-->

1. Upload the Wi-Fi profile(s) to the Mini R device following the guidance in [Manage Wi-Fi](./azure-stack-edge-mini-r-manage-wifi.md#add-connect-to-wi-fi-profile).

## Next steps

- Learn how to [Configure network for Azure Stack Edge Mini R].(azure-stack-edge-mini-r-deploy-configure-network-compute-web-proxy.md)
- Learn how to [Manage Wi-Fi on your Azure Stack Edge Mini R](azure-stack-edge-mini-r-manage-wifi.md).
