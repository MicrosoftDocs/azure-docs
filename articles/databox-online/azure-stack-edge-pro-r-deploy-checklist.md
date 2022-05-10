---
title: Predeployment checklist to deploy Azure Stack Edge Pro R device | Microsoft Docs
description: This article describes the information that can be gathered before you deploy your Azure Stack Edge Pro R device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 03/22/2022
ms.author: alkohli 
---
# Deployment checklist for your Azure Stack Edge Pro R device  

This article describes the information that can be gathered ahead of the actual deployment of your Azure Stack Edge Pro R device. 

Use the following checklist to ensure you have this information after you have placed an order for an Azure Stack Edge Pro R device and before you have received the device. 

## Deployment checklist 

| Stage                             | Parameter                                                                                                                                                                                                                           | Details                                                                                                           |
|-----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| Device   management               | <ul><li>Azure subscription</li><li>Resource providers registered</li><li>Azure Storage account</li></ul>|<ul><li>Enabled for Azure Stack Edge Pro/Data Box Gateway, owner or contributor access.</li><li>In Azure portal, go to **Home > Subscriptions > Your-subscription > Resource providers**. Search for `Microsoft.DataBoxEdge` and register. Repeat for `Microsoft.Devices` if deploying IoT workloads.</li><li>Need access credentials.</li></ul> |
| Device installation               | Power cables in the package. <br>For US, an SVE 18/3 cable rated for 125 V and 15 Amps with a NEMA 5-15P to C13 (input to output) connector is shipped. | For more information, see the list of [Supported power cords by country](azure-stack-edge-technical-specifications-power-cords-regional.md).  |
|                                   | <ul><li>At least 1 X 1-GbE RJ-45 network cable for Port 1  </li><li> At least 1 X 25-GbE SFP+ copper cable for Port 3, Port 4</li><ul>| Customer needs to procure these cables.<br>For a full list of supported network cables, switches, and transceivers for device network cards, see [Cavium FastlinQ 41000 Series Interoperability Matrix](https://www.marvell.com/documents/xalflardzafh32cfvi0z/) and [Mellanox dual port 25G ConnectX-4 channel network adapter compatible products](https://docs.mellanox.com/display/ConnectX4LxFirmwarev14271016/Firmware+Compatible+Products).| 
| Network readiness                 | Check to see how ready your network is for the deployment of an Azure Stack Edge device. | [Use the Azure Stack Network Readiness Checker](azure-stack-edge-deploy-check-network-readiness.md) to test all needed connections. |
| First-time device connection      | Laptop whose IPv4 settings can be changed. This laptop connects to Port 1 via a switch or a USB to Ethernet adaptor. <!--<li> A minimum of 1 GbE switch must be used for the device once the initial setup is complete. The local web UI will not be accessible if the connected switch is not at least 1 Gbe.</li>-->|   |
| Device sign-in                      | Device administrator password, between 8 and 16 characters, including three of the following character types: uppercase, lowercase, numeric, and special characters.                                            | Default password is *Password1*, which expires at first sign-in.                                                     |
| Network settings                  | Device comes with 2 x 1-GbE, 4 x 25-GbE network ports. <ul><li>Port 1 is used to configure management settings only. One or more data ports can be connected and configured. </li><li> At least one data network interface from among Port 2 - Port 6 needs to be connected to the Internet (with connectivity to Azure).</li><li> DHCP and static IPv4 configuration supported.</li></ul> | Static IPv4 configuration requires IP, DNS server, and default gateway.   |
| Compute network settings     | <ul><li>Require 2 free, static, contiguous IPs for Kubernetes nodes, and 1 static IP for IoT Edge service.</li><li>Require one additional IP for each extra service or module that you'll deploy.</li></ul>| Only static IPv4 configuration is supported.|
| (Optional) Web proxy settings     | <ul><li>Web proxy server IP/FQDN, port </li><li>Web proxy username, password</li></ul> |  |
| Firewall and port settings        | If using firewall, make sure the [listed URLs patterns and ports](azure-stack-edge-system-requirements.md#networking-port-requirements) are allowed for device IPs. |  |
| (Recommended) Time settings       | Configure time zone, primary NTP server, secondary NTP server. | Configure primary and secondary NTP server on local network.<br>If local server is not available, public NTP servers can be   configured.                                                    |
| (Optional) Update server settings | Require update server IP address on local network, path to WSUS server. | By default, public Windows update server is used.|
| Device settings | <ul><li>Device fully qualified domain name (FQDN) </li><li>DNS domain</li></ul> | |
| (Optional) Certificates  | If you bring your own certificates including the signing chain(s), [Add certificates](azure-stack-edge-pro-r-deploy-configure-certificates-vpn-encryption.md#bring-your-own-certificates) in appropriate format.| Configure certificates only if you change device name and/or DNS domain. |
| VPN  | <!--Need VPN certificate, VPN gateway, firewall setup in Azure,  passphrase and region info VPN scripts. -->   | |
| Encryption-at-rest  | Recommend using automatically generated encryption key.   |If using your own key, you need a 32 character long Base-64 encoded key.  |
| Activation  | Require activation key from the Azure Stack Edge Pro/ Data Box Gateway resource.    | Once generated, the key expires in 3 days. |

<!--
| (Optional) MAC Address            | If MAC address needs to be approved, get the address of the connected port from local UI of the device. |                                                                                                                   |
| (Optional) Network switch port    | Device hosts Hyper-V VMs for compute. Some network switch port configurations don’t accommodate these setups by default.                                                                                                        |                                                                                                                   |-->


## Next steps

- Prepare to deploy your [Azure Stack Edge Pro device](azure-stack-edge-pro-r-deploy-prep.md).
- Use the [Azure Stack Edge Network Readiness Tool](azure-stack-edge-deploy-check-network-readiness.md) to verify your network settings.
