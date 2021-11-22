---
title: Predeployment checklist to deploy Azure Stack Edge Pro 2 device | Microsoft Docs
description: This article describes the information that can be gathered before you deploy your Azure Stack Edge Pro 2 device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 11/22/2021
ms.author: alkohli 
---
# Deployment checklist for your Azure Stack Edge Pro 2 device  

This article describes the information that can be gathered ahead of the actual deployment of your Azure Stack Edge Pro 2 device. 

Use the following checklist to ensure you have this information after you have placed an order for an Azure Stack Edge Pro 2 device and before you have received the device. 

## Deployment checklist 

| Stage                             | Parameter                                                                                                                                                                                                                           | Details                                                                                                           |
|-----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| Device   management               | <li>Azure subscription</li><li>Resource providers registered</li><li>Azure Storage account</li>|<li>Enabled for Azure Stack Edge, owner or contributor access.</li><li>In Azure portal, go to **Home > Subscriptions > Your-subscription > Resource providers**. Search for `Microsoft.DataBoxEdge` and register. Repeat for `Microsoft.Devices` if deploying IoT workloads.</li><li>Need access credentials</li> |
| Device installation               | One power cable in the package. <!--<br>For US, an SVE 18/3 cable rated for 125 V and 15 Amps with a NEMA 5-15P to C13 (input to output) connector is shipped.--> | For more information, see the list of [Supported power cords by country](azure-stack-edge-pro2-technical-specifications-power-cords-regional.md)  |
|                                   | <li>At least 1 X 1-GbE RJ-45 network cable for Port 1  </li><li> At least 100-GbE QSFP28 Passive Direct Attached Cable (tested in-house) for each data network interface Port 3 and Port 4 to be configured. </li><li>At least one 100-GbE network switch to connect a 1-GbE or a 100-GbE network interface to the Internet for data.</li>| Customer needs to procure these cables.<br>For a full list of supported cables, modules, and switches, see [Connect-X6 DX adapter card compatible firmware](https://docs.mellanox.com/display/ConnectX6DxFirmwarev22271016/Firmware Compatible Products).| 
| First-time device connection      | <li>Laptop whose IPv4 settings can be changed. This laptop connects to Port 1 via a switch or a USB to Ethernet adapter.  </li><!--<li> A minimum of 1 GbE switch must be used for the device once the initial setup is complete. The local web UI will not be accessible if the connected switch is not at least 1 Gbe.</li>-->|   |
| Device sign-in                      | Device administrator password, between 8 and 16 characters, including three of the following character types: uppercase, lowercase, numeric, and special characters.                                            | Default password is *Password1*, which expires at first sign-in.                                                     |
| Network settings                  | Device comes with 2 x 10/1-GbE, 2 x 100-GbE network ports. <li>Port 1 is used to configure management settings only. One or more data ports can be connected and configured. </li><li> At least one data network interface from among Port 2 - Port 4 needs to be connected to the Internet (with connectivity to Azure).</li><li> DHCP and static IPv4 configuration supported. | Static IPv4 configuration requires IP, DNS server, and default gateway.   |
| Compute network settings     | <li>Require 2 free, static, contiguous IPs for Kubernetes nodes, and 1 static IP for IoT Edge service.</li><li>Require one additional IP for each extra service or module that you'll deploy.</li>| Only static IPv4 configuration is supported.|
| (Optional) Web proxy settings     | <li>Web proxy server IP/FQDN, port </li><li>Web proxy username, password</li> |  |
| Firewall and port settings        | If using firewall, make sure the [listed URLs patterns and ports](azure-stack-edge-system-requirements.md#networking-port-requirements) are allowed for device IPs. |  |
| (Recommended) Time settings       | Configure time zone, primary NTP server, secondary NTP server. | Configure primary and secondary NTP server on local network.<br>If local server is not available, public NTP servers can be configured.                                                    |
| (Optional) Update server settings | <li>Require update server IP address on local network, path to WSUS server. </li> | By default, public windows update server is used.|
| Device settings | <li>Device fully qualified domain name (FQDN) </li><li>DNS domain</li> | |
| (Optional) Certificates  | To test non-production workloads, use [Generate certificates option](azure-stack-edge-gpu-deploy-configure-certificates.md#generate-device-certificates) <br><br> If you bring your own certificates including the signing chain(s), [Add certificates](azure-stack-edge-gpu-deploy-configure-certificates.md#bring-your-own-certificates) in appropriate format.| Configure certificates only if you change the device name and/or DNS domain. |
| Activation  | Require activation key from the Azure Stack Edge resource.    | Once generated, the key expires in 3 days. |

<!--
| (Optional) MAC Address            | If MAC address needs to be on the allowed list, get the address of the connected port from local UI of the device. |                                                                                                                   |
| (Optional) Network switch port    | Device hosts Hyper-V VMs for compute. Some network switch port configurations don’t accommodate these setups by default.                                                                                                        |                                                                                                                   |-->


## Next steps

Prepare to deploy your [Azure Stack Edge Pro device](azure-stack-edge-pro2-deploy-prep.md).
