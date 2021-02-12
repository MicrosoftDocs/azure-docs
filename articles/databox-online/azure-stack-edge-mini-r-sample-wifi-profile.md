---
title: Create a WiFi profile to use with Azure Stack Edge Mini R devices
description: Describes how to create WiFi profiles for Azure Stack Edge Mini R devices in enterprise environments and on home networks.
services: databox
author: v-dalc@microsoft.com

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 02/12/2021
ms.author: alkohli
#Customer intent: As an IT administrator, I want to have WiFi profiles for staff to use for their Azure Stack Edge Pro Mini R devices.
---

# Create a WiFi profile to use with Azure Stack Edge Mini R devices

This article describes how to create WiFi profiles for wireless connectivity of Azure Stack Edge Mini R devices. MORE LATER...
<!--Terminology issue: "Profile" - Call is a WiFi profile consistently? In Windows exports, its spoken of in terms of "a profile (could be a user profile or a group policy profile) on the WiFi interface."--> 

## About Wi-Fi profiles

A wireless network (WiFi) profile contains the SSID (network name), password key, and security information to be able to connect your Azure Stack Edge Mini R device to a wireless network. For more information, see [Manage wireless connectivity on your Azure Stack Edge Mini R](./azure-stack-edge-mini-r-manage-wifi.md).

To enable wireless networking, you configure the WiFi port, add the WiFi profile, and then connect to the profile.

## Profile for home network

On a simple home network, different devices (for example a laptop and a mobile phone connected to the network) may use identical profiles and the same passwords.

For example, a Windows 10 client can generate a runtime profile for you. When you log onto the WiFi network, you're prompted for the WiFi password and, once you provide that password, you're connected. No network information is needed except the password.

### Download a WiFi profile

On a simple home network, you can export a WiFi profile from your laptop and then import it to your ASE device.<!--Revisit placement. I think it's good here, but they will use the same procedure to download their enterprise profiles.-->

To export a WiFi profile and add it to your Azure Stack Edge Mini R device, do these steps:

1. To see the wireless profiles on your computer, on the **Start** menu, open **Command prompt** (cmd.exe), and enter this command:

   `netsh wlan show profiles`

   The output will look something like this:<!--Rework example with typical home computer example. I will try exporting something from my personal laptop.-->

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

   `netsh wlan export profile name=”<profileName>” folder=”<path>\<profileName>"`

   For example, the following command saves the ContosoFTINET profile in XML format to gusp’s Downloads folder.<!--Save Gus for the office? Get examples from my own laptop - more realistic for a home environment.-->

   ```dos
   C:\Users\gusp>netsh wlan export profile name="ContosoFTINET" folder=c:Downloads

   Interface profile "ContosoFTINET" is saved in file "c:Downloads\ContosoFTINET.xml" successfully.

   ```

3. Add the WiFi profile to your Azure Stack Edge Mini R device. Follow the steps in [Manage wireless connectivity on your Azure Stack Edge Mini R](azure-stack-edge-mini-r-manage-wifi.md).

> [!IMPORTANT]
> Before you use a WiFi profile with your Azure Stack Edge Mini R device, make sure the network meets security requirements of your organization.

## Profile for high-security enterprise network

In an enterprise network, different devices may use different profiles to connect to the network.

Usually in such networks, a radius server may do server-side authentication. The network then generates a distinct profile and/or authentication for each client that accesses the server. The profiles/authentication have a machine-specific component.

To generate WiFi profiles for enterprise networks, do these steps:

1. Get the following info from your network admin:
   - Does the network generate profiles/authentication for each client? If so, the network controls all of this information.
   - What WiFi protocol (for example, OneX) and group policies have the network administrators implemented? 
   - What IT tooling is the network administrators using to manage these policies?<!--What does "network tooling" entail? Too general? Provide an example?-->
   <!--Presumably, the network admin will provide certs also, or we are assuming they will be asked to generate their own certs? Add a bullet?-->

   Based on this information, you'll be able to generate the wireless profiles and certificates that are needed for your network.

2. If your Mini R will move between sites, and the sites have different WiFi networks, you'll need a profile for each network because each network will have a distinct Service Set Identifier (SSID).<!--Simplify this sentence.-->
 
   You may need more than one profile. For example, if your Mini R is moving between two sites, Site A and Site B, and the sites have two different WiFi networks, those networks will have two distinct SSIDs, and you'll need a profile for each SSID.<!--Save some words?-->

   To find out whether you need different WiFi profiles for each site, do these steps:

   1. Connect your laptop to the WiFi at Site A.

   1. From a command line, run the `netsh export` command to export the profile.

   1. Check the profile for any settings that are specific to the client. For example...XXX.<!--How do they identify a client-specific component? Provide an example?--> 

      - If the profile doesn't have any client-specific component, you can use this profile on Site B. 

      - If the profile has a client-specific component, you'll need to get multiple profiles from your admin.

3. Enable **Autoconnect** on each network you want to connect to automatically.<!--Is there a standard field name for Autoconnect? Is it safe to link to "Enterprise profiles" in the Intune WiFi article for instructions?-->

   You may be able to set **Autoconnect** on multiple networks if the device won't be on more than one of those networks at the same time.

4. When you have the profiles and certificates you need, go to the local UI of your Mini R device, and upload those certs on the Mini R device.<!--1) Do they upload certs as part of the "Manage WiFi" procedure, or in another area of the local Web UI? 2) Where in this procedure do they get their certs? Is it assumed that the network admin gives it in Step 1?-->

<!--REPOSITION - For more information about WiFi settings, see **Enterprise profile** in [Add settings for Windows 10 and later WiFi](/mem/intune/configuration/wi-fi-settings-windows#enterprise-profile) and [Configure a Cisco wireless controller and access point on your device](./azure-stack-edge-mini-r-manage-wifi.md#configure-cisco-wi-fi-profile).-->

## Connect to profile from device

High-level instructions. For details/specifics, lnk to: /databox-online/azure-stack-edge-mini-r-manage-wifi#add-connect-to-wi-fi-profile. 

## Next steps

- Learn how to [Configure network for Azure Stack Edge Mini R](azure-stack-edge-mini-r-deploy-configure-network-compute-web-proxy.md)
- Learn how to [Manage WiFi on your Azure Stack Edge Mini R](azure-stack-edge-mini-r-manage-wifi.md).
