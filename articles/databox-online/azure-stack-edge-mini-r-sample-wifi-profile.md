---
title: Create a WiFi profile to use with Azure Stack Edge Mini R devices
description: Describes how to create WiFi profiles for Azure Stack Edge Mini R devices in enterprise environments and on home networks.
services: databox
author: v-dalc@microsoft.com

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 02/18/2021
ms.author: alkohli
---

# Create a WiFi profile to use with Azure Stack Edge Mini R devices

This article describes how to create wireless network (WiFi) profiles for Azure Stack Edge Mini R devices. You may do most of your work on Min R devices over a wired network, but you'll probably need one or more wireless connections for secondary work locations or work away from the office.

You'll need to add a WiFi profile for each wireless network to your Mini R device. On a simple home network, you may be able to download and use an existing WiFi profile.

In a high-security enterprise environment, each client computer will have a distinct profile and/or authentication, and you'll need to work with the network administrators to determine the required configuration. 

In either case, it's very important to make sure the WiFi profile complies with the security requirements of your organization before you test or use the profile with your Mini R device. <!--Terminology issue: "Profile" - Call is a WiFi profile consistently? In Windows exports, it's spoken of in terms of "a profile" (could be a user profile or a group policy profile) on the WiFi interface."-->

## About Wi-Fi profiles

A wireless network (WiFi) profile contains the SSID (network name), password key, and security information to be able to connect your Azure Stack Edge Mini R device to a wireless network.

To enable wireless connections, you configure the WiFi port on your Mini R device, add the WiFi profile(s), and connect to the networks.

For more information, see [Manage wireless connectivity on your Azure Stack Edge Mini R](./azure-stack-edge-mini-r-manage-wifi.md).

## Profile for home network

On a typical home network, different devices - such as a laptop and a mobile phone connected to the network - may use identical profiles and the same passwords.

For example, a Windows 10 client can generate a runtime profile for you. When you log onto the WiFi network, you're prompted for the WiFi password and, once you provide that password, you're connected. No network information is needed except the password.

On this type of home network, you may be able to export a WiFi profile from your laptop, and then import it to your Mini R device.<!--How much editing do we assume they need to do? Are they editing the profile or updating security on their wireless network?--> 

> [!IMPORTANT] 
> Before you create a WiFi profile for your Mini R device, contact your network administrator to find out the organization's security requirements for wireless networking. You shouldn't test or use any WiFi profile on your device until you know the wireless network meets requirements.

### Download a WiFi profile

To export a WiFi profile and add it to your Azure Stack Edge Mini R device, do these steps:

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

3. Edit the profile as needed.<!--What editing do we expect? Do they need to collect info from the device settings on their Mini R device?-->

4. Upload the WiFi profile to the Mini R device following the guidance in [Manage WiFi](./azure-stack-edge-mini-r-manage-wifi.md#add-connect-to-wi-fi-profile).

> [!IMPORTANT]
> Before you use a WiFi profile with your Azure Stack Edge Mini R device, make sure the network meets security requirements of your organization.

## Profile for high-security enterprise network

If you're preparing a WiFi profile to use in a high-security enterprise environment, you'll need to work with the network administrators to find out the settings that the wireless network connections require.<!--Is the audience here an administrator wanting to create a standard profile that staff can use whenever they configure a new Mini R device, or is the person only interested in creating profile(s) for their own use?-->

On a high-security enterprise network, different devices may use different profiles to connect to the network. A radius server typically does server-side authentication. The network then generates a distinct profile and/or authentication for each client computer that accesses the server. The profiles and authentication have a machine-specific component.<!--By "component," we literally are talking about a group of settings identified by an ID for the computer in the profile?-->

> [!NOTE]
> If other people in your organization are connecting to their Azure Stack Edge devices over a wireless network, you may be able to use the WiFi profile on their device as a template. For more information, see [Download Wi-Fi profile](./azure-stack-edge-mini-r-manage-wifi.md#download-wi-fi-profile).

### Create WiFi profiles for an enterprise network

To create WiFi profiles for an enterprise network, do these steps:

1. Before you create a WiFi profile for you Mini R device, you need to get the following information from your network administrator:<!--Make this a "Before your begin item?-->

   - Does the network generate profiles/authentication for each client? If so, the network controls all of this information.<!--Practical application needed. How do they get this information, and how is it added to the profile?-->

   - What WiFi protocol (for example, OneX) and group policies are implemented on the network?

   - What IT tooling is used to manage these policies?<!--What does "IT tooling" entail? Can we just say "How are group policies being managed?" Would the network admin share this type of information with the end use for this procedure, or would they just provide explicit instructions - or tell them whom to request group membership from?-->

 2. Based on this information, generate the wireless profiles and certificates that are needed for your network.
 
    Enable **Autoconnect** on each network you want to connect to automatically.

    For more information about WiFi settings, see **Enterprise profile** in [Add settings for Windows 10 and later WiFi](/mem/intune/configuration/wi-fi-settings-windows#enterprise-profile) and [Configure a Cisco wireless controller and access point on your device](./azure-stack-edge-mini-r-manage-wifi.md#configure-cisco-wi-fi-profile).

3. If your Mini R device will move between sites - say, between Site A and Site B - and the sites have different WiFi networks, each network will have a distinct SSID, and you'll need a different profile for each site.<!--Should we make this a separate procedure and section?-->
 
   To find out whether you need a different WiFi profile for each site, do these steps:

   1. Connect your laptop to the WiFi from Site A.

   1. From a command line, run the `netsh export` command to export the profile for that wireless network. For steps, see [Download a WiFi profile](#download-a-wifi-profile).  

   1. Check the profile for any settings that are specific to the client computer. For example, ...XXX.<!--How do they identify a client-specific component? Provide an example.--> 

      - If the profile doesn't have any client-specific component, you can use the same profile for Site B.

      - If the profile has a client-specific component, you'll need to get multiple profiles from your network administrator.

   1. Enable **Autoconnect** on each network you want to connect to automatically.

      You may be able to set **Autoconnect** on multiple networks if the device won't be on more than one of those networks at the same time.

5. When you have the WiFi profiles and certificates that you need, go to the local web UI of your Mini R device, and do the following tasks:

   1. Upload the certificates to the Mini R device following the guidance in [Upload certificates](./azure-stack-edge-gpu-manage-certificates.md#upload-certificates).<!--Is this the correct topic to site? At this point, they have their certs, so we point directly to uploading?-->

   1. Upload the WiFi profile(s) to the Mini R device following the guidance in [Manage WiFi](./azure-stack-edge-mini-r-manage-wifi.md#add-connect-to-wi-fi-profile).

## Next steps

- Learn how to [Configure network for Azure Stack Edge Mini R].(azure-stack-edge-mini-r-deploy-configure-network-compute-web-proxy.md)
- Learn how to [Manage WiFi on your Azure Stack Edge Mini R](azure-stack-edge-mini-r-manage-wifi.md).
