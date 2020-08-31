---
title: Predeployment checklist to deploy Azure Stack Edge GPU device | Microsoft Docs
description: This article describes the information that can be gathered before you deploy your Azure Stack Edge GPU device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 08/31/2020
ms.author: alkohli 
---
# Deployment checklist for your Azure Stack Edge GPU device  

This article describes the information that can be gathered ahead of the actual deployment of your Azure Stack Edge device. 

Use the following checklist to ensure you have this information after you have placed an order for an Azure Stack Edge device and before you have received the device. 

## Deployment checklist 

| Stage                             | Parameter                                                                                                                                                                                                                           | Details                                                                                                           |
|-----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------|
| Device   management               | <li>Microsoft Azure   subscription</li><li>Azure Active Directory Graph API</li><li>Microsoft Azure Storage account</li>|<li>Enabled for Azure Stack Edge/Data Box Gateway, contributor permissions</li><li>Ensure admin or user access</li><li>Need access credentials</li> |
| Device installation               | Power cables in the package. <br>For US, an SVE 18/3 cable rated for 125 V and 15 Amps with a NEMA 5-15P to C13 (input to output) connector is shipped.                                                                                                                                                                                                          | Provided with the device.<br>For more information, see the list of [Supported power cords by country](azure-stack-edge-technical-specifications-power-cords-regional.md)                                                                                        |
|                                   | <li>At least  1 X 1-GbE RJ-45 network cable for Port 1  </li><li> At least 1 X 25-GbE SFP+ copper cable for Port 3, Port 4, Port 5, or Port 6</li>| Customer needs to procure these cables.<br>For a full list of supported network cables, switches, and transceivers for device network cards, see [Cavium FastlinQ 41000 Series Interoperability Matrix](https://www.marvell.com/documents/xalflardzafh32cfvi0z/) and [Mellanox dual port 25G ConnectX-4 channel network adapter compatible products](https://docs.mellanox.com/display/ConnectX4LxFirmwarev14271016/Firmware+Compatible+Products).| 
| First time device connection      | Port 1 has a fixed IP (192.168.100.10/24) for initial connection. <li>Require a laptop for direct  connection to Port 1, with an IP address on 192.168.100.0/24 network.</li><li> Use local UI of the device at: `https://192.168.100.10` for further configuration.</li><li> A minimum of 1 GbE switch must be used for the device once the initial setup is complete. The local web UI will not be accessible if the connected switch is not at least 1 Gbe.</li>|                                                                                                                   |
| Device logon                      | Device administrator password must have between 8 and 16 characters. <br>It must contain three of the following characters: uppercase, lowercase, numeric, and special characters.                                            | Default password is *Password1* which expires at first sign in.                                                     |
| Network settings                  | Device comes with 2 x 1 GbE, 4 x 25 GbE network ports. <li>Port 1 is used to configure management settings only. One or more data ports can be connected and configured. </li><li> At least one data network interface from among Port 2 - Port 6 needs to be connected to the Internet (with connectivity to Azure).</li><li> IP settings support DHCP/static IPv4 configuration. | Static IPv4 configuration requires IP, DNS server, and default gateway.                                                                                                                  |
| Compute network settings     | <li>Require 2 static public IPs for Kubernetes nodes, and at least 1 static IP for Azure Stack Edge Hub service to access compute modules.</li><li>Require one IP for each extra service or container that needs to be accessed externally from outside the Kubernetes cluster.</li>                                                                                                                       | Only static IPv4 configuration is supported.                                                                      |
| (Optional) Web proxy settings     | <li>Web proxy server IP/FQDN, port </li><li>Web proxy username, password</li>                                                                                                                                                                                                    | Currently not supported with compute setup.                                                                     |
| Firewall and port settings        | Use the [listed URLs patterns and ports](azure-stack-edge-system-requirements.md#networking-port-requirements) to be allowed for device IPs.                                                                                                                                                  |                                                                                                                   |
| (Optional) MAC Address            | If MAC address needs to be whitelisted, get the address of the connected port from local UI of the device. |                                                                                                                   |
| (Optional) Network switch port    | Device hosts Hyper-V VMs for compute. Some network switch port configurations don’t accommodate these setups by default.                                                                                                        |                                                                                                                   |
| (Recommended) Time settings       | Configure time zone, primary NTP server, secondary NTP server.                                                                                                                                                                    | Configure primary and secondary NTP server on local network.<br>If local server is not available, public NTP servers can be   configured.                                                    |
| (Optional) Update server settings | <li>Require update server IP address on local network, path to WSUS server. </li> | By default, public windows update server is used.|
| Device settings                   | <li>Device name registered within DNS organization </li><li>DNS domain</li> |                                                                                                                   |
| (Optional) Certificates                      | Use the certificates generated by the device <br><br> If bringing your own certificates, you need: <li>Trusted root signing certificate in DER format with *.cer* </li><li>Endpoint certificates in *pfx* format</li>|Endpoint certificates include for Azure Resource Manager, Blob storage, Local web UI.                                                                                                                   |
| Activation                        | Require activation key from the Azure Stack Edge/ Data Box Gateway resource.                                                                                                                                                       | Once generated, the key expires in 3 days.                                                                        |


## Next steps

Prepare to deploy your [Azure Stack Edge device](azure-stack-edge-gpu-deploy-prep.md).



