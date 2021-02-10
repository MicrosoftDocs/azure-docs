---
title: Use a sample WiFi profile to test wireless connectivity for an Azure Stack Edge Mini R Wi-Fi device
description: Describes how to use a sample WiFi profile to test wireless connectivity for a Azure Stack Edge Mini R device.
services: databox
author: v-dalc@microsoft.com

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 02/10/2021
ms.author: alkohli
---

# Use a sample WiFi profile to test wireless connectivity for your Azure Stack Edge Mini R device

This article describes how to test wireless network connectivity for an Azure Stack Edge Mini R device using a sample WiFi profile. 

You can use this profile for testing if your network administrator hasn't provided a wireless network (WiFi) profile for your environment. 

> [!IMPORTANT]
> - The sample profile is for testing purposes only. The profile won't work in all environments. Before you use the profile, make sure it complies with your organization's wireless networking guidelines.
> - If your network administrator has a WiFi profile available that meets your organization's security standards, you should use that profile instead and follow the steps in [Manage wireless connectivity on your Azure Stack Edge Mini R](./azure-stack-edge-mini-r-manage-wifi.md).

## About Wi-Fi profiles

A wireless network (WiFi) profile contains the SSID (network name), password key, and security information to be able to connect your Azure Stack Edge Mini R device to a wireless network. For more information, see [Manage wireless connectivity on your Azure Stack Edge Mini R](./azure-stack-edge-mini-r-manage-wifi.md).

To enable wireless networking, you configure the WiFi port, add the WiFi profile, and then connect to teh profile. TOO MUCH DETAIL?

## Prerequisites

- Complete the device configuration for your Azure Stack Edge Mini R device.
- Review wireless security policies for your organization.
- Can the network admin provide a standard WiFi profile for your organization?
- Collect the security key, SSID, etc. - Or just use the table in the "Sample script" section.


## Download wireless profile

If your organization doesn't have a standard wireless networking profile<!--This seems highly unlikely.-->, you can download and edit an existing profile.

To download a wireless networking profile, do these steps:

1. To see the wireless profiles on your computer, on the **Start** menu, open **Command prompt** (cmd.exe), and enter this command:<!--All Programs, then Accessories does not open a command prompt in the latest Windows build.-->

   `netsh wlan show profiles`

   The output will look something like this:<!--Output needs further editing. Profile names are too close to MSFT profile names.-->

   ```dos
   Profiles on interface Wi-Fi:

   Group policy profiles (read only)
   ---------------------------------
       <None>

   User profiles
   -------------
       All User Profile     : ContosoCONNECT
       All User Profile     : ContosoCORP
       All User Profile     : ContosoINET
       All User Profile     : CenturyLink7006
       All User Profile     : Boat
    ```

2. To export a profile, enter the following command:

   `netsh wlan export profile name=”<profileName>” folder=”<path>\<profileName>"

   For example, the following command saves the ContosoINET profile in XML format to gusp’s Downloads folder.

   ```dos
   C:\Users\gusp>netsh wlan export profile name="ContosoFTINET" folder=c:Downloads

   Interface profile "ContosoFTINET" is saved in file "c:Downloads\ContosoFTINET.xml" successfully.

   ```

If others in your org are using WiFi with their Mini R device, you can ask them to download the wireless networking profile they're using. See: https://docs.microsoft.com/en-us/azure/databox-online/azure-stack-edge-mini-r-manage-wifi#download-wi-fi-profile

## Edit wireless profile

If we expect them to edit the profile, what settings will they update for their environment?

## Sample WiFi profile

Describe the sample profile.

-- Sample text - from Shivani? --

Settings to update for their environment (table)

Before testing, make sure the profile complies with networking security requirements for your organization.

## Connect to profile from device

High-level instructions. For details/specifics, lnk to: /databox-online/azure-stack-edge-mini-r-manage-wifi#add-connect-to-wi-fi-profile. 

## Next steps

- Learn how to [Configure a Cisco wireless controller and access point on your device](./azure-stack-edge-mini-r-manage-wifi#configure-cisco-wi-fi-profile).
