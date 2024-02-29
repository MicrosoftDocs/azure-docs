---
title: Predeployment checklist to deploy Azure Stack Edge Pro 2 device | Microsoft Docs
description: This article describes the information that can be gathered before you deploy your Azure Stack Edge Pro 2 device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 03/22/2022
ms.author: alkohli 
zone_pivot_groups: azure-stack-edge-device-deployment
---
# Deployment checklist for your Azure Stack Edge Pro 2 device  

This article describes the information that can be gathered ahead of the actual deployment of your Azure Stack Edge Pro 2 device. 

Use the following checklist to ensure you have this information after you’ve placed an order for an Azure Stack Edge Pro 2 device and before you’ve received the device. 

## Deployment checklist

::: zone pivot="single-node" 

| Stage                             | Parameter                                  | Details                                            |
|-----------------------------------|-------------------------------------------------|-----------------------------------------------|
| Device   management               | - Azure subscription. <br> - Resource providers registered. <br> - Azure Storage account.|- Enabled for Azure Stack Edge, owner or contributor access. <br> - In Azure portal, go to **Home > Subscriptions > Your-subscription > Resource providers**. Search for `Microsoft.EdgeOrder` and register. Repeat for `Microsoft.Devices` if deploying IoT workloads. <br> - Need access credentials. |
| Device installation               | One power cable in the package. <!--<br>For US, an SVE 18/3 cable rated for 125 V and 15 Amps with a NEMA 5-15P to C13 (input to output) connector is shipped.--> | For more information, see the list of [Supported power cords by country](azure-stack-edge-technical-specifications-power-cords-regional.md)  |
|                                   | - At least one X 1-GbE RJ-45 network cable for Port 1.  <br> - At least 100-GbE QSFP28 Passive Direct Attached Cable (tested in-house) for each data network interface Port 3 and Port 4 to be configured. <br> - At least one 100-GbE network switch to connect a 1 GbE or a 100-GbE network interface to the Internet for data.| Customer needs to procure these cables.| 
| First-time device connection      | Laptop whose IPv4 settings can be changed. This laptop connects to Port 1 via a switch or a USB to Ethernet adapter.  </li><!--<li> A minimum of 1 GbE switch must be used for the device once the initial setup is complete. The local web UI will not be accessible if the connected switch is not at least 1 Gbe.</li>-->|   |
| Device sign-in                      | Device administrator password, between 8 and 16 characters, including three of the following character types: uppercase, lowercase, numeric, and special characters.                                            | Default password is *Password1*, which expires at first sign-in.                                                     |
| Network settings                  | Device comes with 2 x 10/1-GbE, 2 x 100-GbE network ports. <br> - Port 1 is used to configure management settings only. One or more data ports can be connected and configured. <br> -  At least one data network interface from among Port 2 to Port 4 needs to be connected to the Internet (with connectivity to Azure). <br> - DHCP and static IPv4 configuration supported. | Static IPv4 configuration requires IP, DNS server, and default gateway.   |
| Advanced networking settings     | - Require 2 free, static, contiguous IPs for Kubernetes nodes, and one static IP for IoT Edge service. <br> - Require one additional IP for each extra service or module that you'll deploy.| Only static IPv4 configuration is supported.|
| (Optional) Web proxy settings     |Web proxy server IP/FQDN, port  |HTTPS URLs are not supported.  |
| Firewall and port settings        | If using firewall, make sure the [listed URLs patterns and ports](azure-stack-edge-pro-2-system-requirements.md#url-patterns-for-firewall-rules) are allowed for device IPs. |  |
| (Recommended) Time settings       | Configure time zone, primary NTP server, secondary NTP server. | Configure primary and secondary NTP server on local network. <br> - If local server isn’t available, public NTP servers can be configured.                                                    |
| (Optional) Update server settings | Require update server IP address on local network, path to WSUS server. | By default, public windows update server is used.|
| Device settings | - Device fully qualified domain name (FQDN). <br> - DNS domain. | |
| (Optional) Certificates  | To test non-production workloads, use [Generate certificates option](azure-stack-edge-gpu-deploy-configure-certificates.md#generate-device-certificates) <br><br> If you bring your own certificates including the signing chain(s), [Add certificates](azure-stack-edge-gpu-deploy-configure-certificates.md#bring-your-own-certificates) in appropriate format.| Configure certificates only if you change the device name and/or DNS domain. |
| Activation  | Require activation key from the Azure Stack Edge resource.    | Once generated, the key expires in three days. |

::: zone-end

::: zone pivot="two-node"

| Stage                             | Parameter                                  | Details                                            |
|-----------------------------------|-------------------------------------------------|-----------------------------------------------|
| Device   management               | - Azure subscription <br> - Resource providers registered <br> - Azure Storage account|Enabled for Azure Stack Edge, owner or contributor access. <br> - In Azure portal, go to **Home > Subscriptions > Your-subscription > Resource providers**. Search for `Microsoft.EdgeOrder` and register. Repeat for `Microsoft.Devices` if deploying IoT workloads. <br> - Need access credentials</li> |
| Device installation               | One power cable in the package per device node. <!--<br>For US, an SVE 18/3 cable rated for 125 V and 15 Amps with a NEMA 5-15P to C13 (input to output) connector is shipped.--> | For more information, see the list of [Supported power cords by country](azure-stack-edge-technical-specifications-power-cords-regional.md)  |
|                                   | <br> - At least two 1-GbE RJ-45 network cables for Port 1 on the two device nodes  <br> -  You would need two 1-GbE network cables to connect Port 2 on each device node to the internet. Depending on the network topology you wish to deploy, you may also need at least one 100-GbE QSFP28 Passive Direct Attached Cable (tested in-house) to connect Port 3 and Port 4 across the device nodes. <br> -  You would also need at least one 10/1-GbE network switch to connect Port 1 and Port 2. You would need a 100/10-GbE switch to connect Port 3 or Port 4 network interface to the Internet for data.| Customer needs to procure these cables and switches. Exact number of cables and switches would depend on the network topology that you deploy.| 
| First-time device connection      | Via a laptop whose IPv4 settings can be changed. This laptop connects to Port 1 via a switch or a USB to Ethernet adapter.    |
| Device sign-in                      | Device administrator password, between 8 and 16 characters, including three of the following character types: uppercase, lowercase, numeric, and special characters.                                            | Default password is *Password1*, which expires at first sign-in.                                                     |
| Network settings                  | Device comes with 2 x 10/1-GbE network ports, Port 1 and Port 2. Device also has 2 x 100-GbE network ports, Port 3 and Port 4. <br> - Port 1 is used for initial configuration. Port 2, Port 3, and Port 4 are also connected and configured. <br> -  At least one data network interface from among Port 2 - Port 4 needs to be connected to the Internet (with connectivity to Azure). <br> -  DHCP and static IPv4 configuration supported. | Static IPv4 configuration requires IP, DNS server, and default gateway.   |
| Advanced networking settings      | <br> - Require 3 free, static, contiguous IPs for Kubernetes nodes, and one static IP for IoT Edge service. <br> - Require one additional IP for each extra service or module that you'll deploy.| Only static IPv4 configuration is supported.|
| (Optional) Web proxy settings     | Web proxy server IP/FQDN, port| HTTPS URLs are not supported. |
| Firewall and port settings        | If using firewall, make sure the [listed URLs patterns and ports](azure-stack-edge-pro-2-system-requirements.md#url-patterns-for-firewall-rules) are allowed for device IPs. |  |
| (Recommended) Time settings       | Configure time zone, primary NTP server, secondary NTP server. | Configure primary and secondary NTP server on local network.<br>If local server isn’t available, public NTP servers can be configured.                                                    |
| (Optional) Update server settings | Require update server IP address on local network, path to WSUS server.  | By default, public windows update server is used.|
| Device settings | <br> - Device fully qualified domain name (FQDN) <br> - DNS domain| |
| (Optional) Certificates  | To test non-production workloads, use [Generate certificates option](azure-stack-edge-gpu-deploy-configure-certificates.md#generate-device-certificates) <br><br> If you bring your own certificates including the signing chain(s), [Add certificates](azure-stack-edge-gpu-deploy-configure-certificates.md#bring-your-own-certificates) in appropriate format.| Configure certificates only if you change the device name and/or DNS domain. |
| Activation  | Require activation key from the Azure Stack Edge resource.    | Once generated, the key expires in three days. |

::: zone-end

## Next steps

Prepare to deploy your [Azure Stack Edge Pro device](azure-stack-edge-pro-2-deploy-prep.md).
