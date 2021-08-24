---
title: Set up advanced network settings on the Azure Percept DK
description: This article walks user through the Advanced Network Settings during the Azure Percept DK setup experience
author: mimcco
ms.author: mimcco
ms.service: azure-percept
ms.topic: how-to
ms.date: 7/19/2021
ms.custom: template-how-to 
---

# Set up Advanced Network Settings on the Azure Percept DK

The Azure Percept DK allows you to control various networking components on the dev kit. This is done via the Advanced Networking Settings in the setup experience. To access these settings, you must [start the setup experience](./quickstart-percept-dk-set-up.md) and select **Access advanced network settings** on the **Network connection** page.

:::image type="content" source="media/how-to-set-up-advanced-network-settings/advanced-ns-entry.png" alt-text="Launch the advanced network settings from the Network connections page":::

## Select the security setting
IPv4 and IPv6 are both supported on the Azure Percept DK for local connectivity.

> [!NOTE]
> Azure IoTHub [does not supports IPv6](https://docs.microsoft.com/azure/iot-hub/iot-hub-understand-ip-address#support-for-ipv6). IPv4 must be used to communicate with IoTHub.
1. Select the IPv4 radio button and then select an item under Network Settings to change its IPv4 settings
1. Select the IPv6 radio button and then select an item under Network Settings to change its IPv6 settings
1. The **Network setting** options may change depending on your selection

:::image type="content" source="media/how-to-set-up-advanced-network-settings/advanced-ns-security.png" alt-text="Select a security protocol to see the list of network options":::

## Define a Static IP Address

1. From the **Advanced network settings** page, select **Define a static IP address** from the list
1. Select your **Network interface** from the drop-down menu
1. Uncheck **Dynamic IP address**
1. Enter your static IP address
1. Enter your subnet IP address (also known as your subnet mask)
1. Enter your gateway IP address (also known as your default gateway)
1. If applicable, enter your DNS address
1. Select **Save**
1. Select **Back** to return to the main **Advanced networking settings** page

## Define DNS server for Docker
These settings allow you to modify or add new Docker DNS IP addresses.

> [!NOTE]
> The Docker service is configured to only accept IPv4 DNS entries.  Entries added from the IPv6 screens will be ignored.

1. From the **Advanced network settings** page, select **Define DNS server for Docker** from the list
1. Enter your Docker IPv4 DNS address
1. Select **Save**
1. Select **Back** to return to the main **Advanced networking settings** page

## Define Bridge Internet Protocol for Docker
The Bridge Internet Protocol screens allow you to change the IPv4 address space for Docker containers.

If your device’s IP address shares the same route as the Azure Percept Devkit’s Docker service (172.17.x.x), then you'll need to change Docker’s Bridge to something else to allow communications between Docker containers and Azure IoTHub.  

1. From the **Advanced network settings** page, select **Define Bridge Internet Protocol for Docker** from the list
1. Type in the Docker Bridge Internet Protocol IPv4 address (BIP)
1. Select **Save**
1. Select **Back** to return to the main **Advanced networking settings** page

## Define an internet proxy server
This option allows you to define a proxy server.    

1. From the **Advanced network settings** page, select **Define an internet proxy server** from the list
1. Check the **Use a proxy server** box to enable this option.
1. Enter the **HTTP address** of your proxy server (if applicable)
1. Enter the **HTTPS address** of your proxy server (if applicable)
1. Enter the **FTP address** of your proxy server (if applicable)
1. In the **No proxy addresses** box, enter any IP addresses that the proxy server shouldn't be used for
1. Select **Save**
1. Select **Back** to return to the main **Advanced networking settings** page

## Setup Zero Touch Provisioning

> [!IMPORTANT]
> The **Setup Zero Touch Provisioning** setting are not currently functional

This option allows you to turn your Azure Percept DK into a [Wi-Fi Easy Connect<sup>TM</sup> Bulk Configurator](https://techcommunity.microsoft.com/t5/internet-of-things/simplify-wi-fi-iot-device-onboarding-with-zero-touch/ba-p/2161129#:~:text=A%20Wi-Fi%20Easy%20Connect%E2%84%A2%20Configurator%2C%20paired%20with%20the,device%20to%20any%20WPA2-Personal%20or%20WPA3-Personal%20wireless%20LAN.) for onboarding multiple devices at once to your Wi-Fi infrastructure.  

## Define access point passphrase 
This option allows you to update the Azure Percept DK Wi-Fi access point passphrase.  

> [!CAUTION]
> You will be immediately disconnected from the Wi-Fi access point after saving your new passphrase.  Please reconnect using the new passphrase to regain access.  

Passphrase requirements:
- Must be between 12 and 123 characters long
- Must contain at least one lower case, one upper case, one number, and one special character.

1. From the **Advanced network settings** page, select **Define access point passphrase** from the list
1. Enter a new passphrase
1. Select **Save**
1. Select **Back** to return to the main **Advanced networking settings** page

## Next steps
After you have finished making changes in **Advanced network settings**, select the **Back** button to [continue through the Azure Percept DK setup experience](./quickstart-percept-dk-set-up.md).

