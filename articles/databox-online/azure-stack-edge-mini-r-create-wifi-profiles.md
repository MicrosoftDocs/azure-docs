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

This article describes how to create wireless network (Wi-Fi) profiles for Azure Stack Edge Mini R devices. You'll need to add a profile to your Azure Stack Edge Mini R device for each wireless network you use to connect to the device.

On a simple home network, you may be able to download and use an existing profile. In a high-security enterprise environment, each client computer will have a distinct profile and/or authentication, and you'll need to work with the network administrators to determine the required configuration.

In either case, it's very important to make sure the profile complies with the security requirements of your organization before you test or use the profile with your device.

## About Wi-Fi profiles

A wireless network (Wi-Fi) profile contains the SSID (service set identifier, or **network name**), password key, and security information to be able to connect your Azure Stack Edge Mini R device to a wireless network.

The following code example shows basic settings for a profile for a typical wireless network:

* `SSID` is the network name.<!--This is a hexadecimal value? Always?-->  

* `name` is the user-friendly name for the Wi-Fi connection. This is the name users will see when they browse the available connections on their device.<!--Needs verification.-->

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

For more information about Wi-Fi profile settings, see **Enterprise profile** in [Add settings for Windows 10 and later Wi-Fi](/mem/intune/configuration/wifi-settings-windows#enterprise-profile) and [Configure a Cisco wireless controller and access point on your device](./azure-stack-edge-mini-r-manage-wifi.md#configure-cisco-wifi-profile).

To enable wireless connections, you configure the Wi-Fi port on your device, and then add the Wi-Fi profile(s) to the device. You can then connect to a wireless network from the local web UI for the device. For more information, see [Manage wireless connectivity on your Azure Stack Edge Mini R](./azure-stack-edge-mini-r-manage-wifi.md).

### Profile for home network

On a typical home network, different devices - such as a laptop and a mobile phone connected to the network - may use identical profiles and the same passwords.

For example, a Windows 10 client can generate a runtime profile for you. When you log onto the Wi-Fi network, you're prompted for the Wi-Fi password and, once you provide that password, you're connected. No network information is needed except the password.

On this type of home network, you may be able to export a Wi-Fi profile from your laptop, and then import it to your device.<!--How much editing do we assume they need to do? Are they editing the profile or updating security on their wireless network?--> 

> [!IMPORTANT] 
> Before you create a Wi-Fi profile for your Azure Stack Edge Mini R device, contact your network administrator to find out the organization's security requirements for wireless networking. You shouldn't test or use any Wi-Fi profile on your device until you know the wireless network meets requirements.

### Profiles for high-security enterprise networks

If you're preparing a Wi-Fi profile to use in a high-security enterprise environment, you'll need to work with the network administrators to find out the settings that the wireless network connections require.

On a high-security enterprise network, different devices may use different profiles to connect to the network. A radius server typically does server-side authentication. The network then generates a distinct profile with different authentication for each client computer that accesses the server.

The profile will have a machine-specific component that looks similar to the code in the following example. In the `Security` section, the authentication mode (`authMode`) for the `OneX` Wi-Fi protocol is set to `machine`. The Extensible Authentication Protocol (EAP) configuration that follows (`eapConfig` component) is unique to that computer.<!--This needs verification. Not sure about the placement. It was buried in the "Check for machine-specific profiles" section, but it feels like a major interruption here.-->

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
   				<EAPConfig>

   -----CUT-----CUT-----CUT-----CUT-----CUT-----CUT-----CUT-----CUT----- 
   
                </EAPConfig>
			</OneX>
		</security>
	</MSM>

  ```

Before you create a Wi-Fi profile for your Azure Stack Edge Mini R device, you need to get the following information from your network administrator:

- Does the network generate profiles/authentication for each client? If so, the network controls all of this information.

- What Wi-Fi protocol (for example, OneX) and group policies are implemented on the network?

- How are group policies managed?

- Does your organization use different wireless networks in different locations? Will you need multiple Wi-Fi profiles on your device?

Use this information to create the wireless profiles and certificates that you'll need for the workplace.

You may be able to use an existing wireless network profile as a template:

* You can download the corporate wireless network profile from your work computer. For instructions, see [Download a Wi-Fi profile](#download-a-wi-fi-profile),below.

* If others in your organization are already connecting to their Azure Stack Edge Mini R devices over a wireless network, they can download the Wi-Fi profile from their device. For instructions, see **Download Wi-Fi profile** in [Manage Wi-Fi](./azure-stack-edge-mini-r-manage-wifi.md#download-wi-fi-profile).

## Export a Wi-Fi profile

To export a profile for the Wi-Fi interface on your computer, do these steps:

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

## Check for site-specific profiles

If your Azure Stack Edge Mini R device will move between sites in your workplace - say, between Site A and Site B - and the sites have different WiFi networks, each network will have a distinct SSID, and you'll need a different profile for each site.<!--Discussion moves from site-specific to machine-specific. How are they linked?-->

To find out whether you need a different Wi-Fi profile for each site, do these steps:

1. Connect your laptop to the wireless network from Site A.

1. From a command line, run the `netsh export` command to export the profile for that wireless network. For steps and command parameters, see [Download a Wi-Fi profile](#download-a-wifi-profile), above.  

1. Check the profile for any settings that are specific to the client computer. For example, the authentication mode (`authMode`) for the Wi-Fi protocol is is `machine`, as shown above, in [Profiles for high-security enterprise networks](#profiles-for-high-security-enterprise-networks).

   - If the profile doesn't have any machine-specific component, you can use the same profile for Site B.

   - If the profile has a machine-specific component, you'll need to get multiple profiles from the network administrators.

     You may be able to set **Autoconnect** (`connectionMode` = `auto`) on multiple wireless networks if the device won't be on more than one of those networks at the same time.

## Add Wi-Fi profiles to device

When you have the Wi-Fi profiles and certificates that you need, do these steps to configure your Azure Stack Edge Mini R device for wireless connections:

1.  Go to the local web UI of your Azure Stack Edge Mini R device.

1. For a high-security enterprise network, upload the needed certificates to the device following the guidance in [Upload certificates](./azure-stack-edge-gpu-manage-certificates.md#upload-certificates).<!--Is this the correct topic to site? At this point, they have their certs, so we point directly to uploading?-->

1. Upload the Wi-Fi profile(s) to the Mini R device following the guidance in [Add, connect to new profile](./azure-stack-edge-mini-r-manage-wifi.md#add-connect-to-wi-fi-profile).

## Next steps

- Learn how to [Configure network for Azure Stack Edge Mini R](azure-stack-edge-mini-r-deploy-configure-network-compute-web-proxy.md)
- Learn how to [Manage Wi-Fi on your Azure Stack Edge Mini R](azure-stack-edge-mini-r-manage-wifi.md).
