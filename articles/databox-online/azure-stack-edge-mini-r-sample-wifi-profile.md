---
title: Use a sample WiFi profile to test wireless connectivity for an Azure Stack Edge Mini R Wi-Fi device
description: Describes how to use a sample WiFi profile to test wireless connectivity for a Azure Stack Edge Mini R device.
services: databox
author: v-dalc@microsoft.com

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 02/09/2021
ms.author: alkohli
---

# Use a sample WiFi profile to test wireless connectivity for your Azure Stack Edge Mini R device

This article describes how to test wireless network connectivity for an Azure Stack Edge Mini R device using a sample WiFi profile. 

You can use this profile for testing if your network administrator hasn't provided a WiFi profile for your environment. 

> [!IMPORTANT]
> The sample profile is for testing purposes only. The profile won't work in all environments. Before you use the profile, make sure it complies with your organization's wireless networking guidelines.

## About Wi-Fi profiles

A wireless network (WiFi) profile contains the SSID (network name), password key, and security information to be able to connect your Azure Stack Edge Mini R device to a wireless network. For more information, see [Manage wireless connectivity on your Azure Stack Edge Mini R](./azure-stack-edge-mini-r-manage-wifi.md).

To enable wireless networking, you configure the WiFi port, add the WiFi profile, and then connect to teh profile. TOO MUCH DETAIL?

## Prerequisites

- Complete the device configuration.

- Collect the security key, SSID, etc. - Or just use the table in the "Sample script" section.

Nothing to download? How will we provide the profile? Sample text in the article only?

## Sample WiFi profile

Introduce/describe the sample profile.

--Sample text--

Table: Settings to update for their environment

If others in your org are using WiFi with their Mini R device, ask them to download the WiFi profile they are using. See: https://docs.microsoft.com/en-us/azure/databox-online/azure-stack-edge-mini-r-manage-wifi#download-wi-fi-profile

Before testing, make sure the profile complies with networking security requirements for your organization.

## Add and connect to profile

Very high-level instructions. For details/specifics, lnk to: /databox-online/azure-stack-edge-mini-r-manage-wifi#add-connect-to-wi-fi-profile. 

## Next steps

- Learn how to [Configure a Cisco wireless controller and access point on your device](./azure-stack-edge-mini-r-manage-wifi#configure-cisco-wi-fi-profile).
