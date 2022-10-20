---
title: Prepare to deploy a private mobile network
titleSuffix: Azure Private 5G Core Preview
description: Learn how to complete the prerequisite tasks for deploying a private mobile network with Azure Private 5G Core Preview. 
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to 
ms.date: 12/22/2021
ms.custom: template-how-to
---

# Complete the prerequisite tasks for deploying a private mobile network

In this how-to guide, you'll carry out each of the tasks you need to complete before you can deploy a private mobile network using Azure Private 5G Core Preview.

## Get access to Azure Private 5G Core for your Azure subscription

Contact your trials engineer and ask them to register your Azure subscription for access to Azure Private 5G Core. If you don't already have a trials engineer and are interested in trialing Azure Private 5G Core, contact your Microsoft account team, or express your interest through the [partner registration form](https://aka.ms/privateMECMSP).

Once your trials engineer has confirmed your access, register the Mobile Network resource provider (Microsoft.MobileNetwork) for your subscription, as described in [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md).

## Choose the core technology type (5G or 4G)

Choose whether each site in the private mobile network should provide coverage for 5G or 4G user equipment (UEs). A single site can't support 5G and 4G UEs simultaneously. If you're deploying multiple sites, you can choose to have some sites support 5G UEs and others support 4G UEs.

## Allocate subnets and IP addresses

Azure Private 5G Core requires a management network, access network, and data network. These networks can all be part of the same, larger network, or they can be separate. The approach you use depends on your traffic separation requirements.

For each of these networks, allocate a subnet and then identify the listed IP addresses. If you're deploying multiple sites, you'll need to collect this information for each site.

### Management network

- Network address in Classless Inter-Domain Routing (CIDR) notation. 
- Default gateway. 
- One IP address for the Azure Stack Edge Pro device's management port. You'll choose a port between 2 and 4 to use as the management port as part of [setting up your Azure Stack Edge Pro device](#order-and-set-up-your-azure-stack-edge-pro-devices). 
- Three sequential IP addresses for the Azure Kubernetes Service on Azure Stack HCI (AKS-HCI) cluster nodes.
- One IP address for accessing local monitoring tools for the packet core instance.

### Access network

- Network address in CIDR notation. 
- Default gateway. 
- One IP address for port 5 on the Azure Stack Edge Pro device. 
- One IP address for the control plane interface. For 5G, this interface is the N2 interface, whereas for 4G, it's the S1-MME interface.
- One IP address for the user plane interface. For 5G, this interface is the N3 interface, whereas for 4G, it's the S1-U interface. 

### Data network

- Network address in CIDR notation.
- Default gateway.
- One IP address for port 6 on the Azure Stack Edge Pro device.
- One IP address for the user plane interface. For 5G, this interface is the N6 interface, whereas for 4G, it's the SGi interface.

## Allocate user equipment (UE) IP address pools

Azure Private 5G Core supports the following IP address allocation methods for UEs.

- Dynamic. Dynamic IP address allocation automatically assigns a new IP address to a UE each time it connects to the private mobile network. 

- Static. Static IP address allocation ensures that a UE receives the same IP address every time it connects to the private mobile network. This is useful when you want Internet of Things (IoT) applications to be able to consistently connect to the same device. For example, you may configure a video analysis application with the IP addresses of the cameras providing video streams. If these cameras have static IP addresses, you won't need to reconfigure the video analysis application with new IP addresses each time the cameras restart. You'll allocate static IP addresses to a UE as part of [provisioning its SIM](provision-sims-azure-portal.md).

You can choose to support one or both of these methods for each site in your private mobile network. 

For each site you're deploying, do the following:

- Decide which IP address allocation methods you want to support.
- For each method you want to support, identify an IP address pool from which IP addresses can be allocated to UEs. You'll need to provide each IP address pool in CIDR notation. 

    If you decide to support both methods for a particular site, ensure that the IP address pools are of the same size and don't overlap.

- Decide whether you want to enable Network Address and Port Translation (NAPT) for the data network. NAPT allows you to translate a large pool of private IP addresses for UEs to a small number of public IP addresses. The translation is performed at the point where traffic enters the data network, maximizing the utility of a limited supply of public IP addresses.

## Configure Domain Name System (DNS) servers

> [!IMPORTANT]
> If you don't configure DNS servers for a data network, all UEs using that network will be unable to resolve domain names.

DNS allows the translation between human-readable domain names and their associated machine-readable IP addresses. Depending on your requirements, you have the following options for configuring a DNS server for your data network:

- If you need the UEs connected to this data network to resolve domain names, you must configure one or more DNS servers. You must use a private DNS server if you need DNS resolution of internal hostnames. If you're only providing internet access to public DNS names, you can use a public or private DNS server.
- If you don't need the UEs to perform DNS resolution, or if all UEs in the network will use their own locally configured DNS servers (instead of the DNS servers signaled to them by the packet core), you can omit this configuration.

## Prepare your networks

For each site you're deploying, do the following. 

- Ensure you have at least one network switch with at least three ports available. You'll connect each Azure Stack Edge Pro device to the switch(es) in the same site as part of the instructions in [Order and set up your Azure Stack Edge Pro device(s)](#order-and-set-up-your-azure-stack-edge-pro-devices).
- If you're not enabling NAPT as described in [Allocate user equipment (UE) IP address pools](#allocate-user-equipment-ue-ip-address-pools), configure the data network to route traffic destined for the UE IP address pools via the IP address you allocated to the packet core instance's user plane interface on the data network.

### Ports required for local access

The following table contains the ports you need to open for Azure Private 5G Core local access. This includes local management access and control plane signaling.

You should set these up in addition to the [ports required for Azure Stack Edge (ASE)](../databox-online/azure-stack-edge-gpu-system-requirements.md#networking-port-requirements).

| Port | ASE interface | Description|
|--|--|--|
| TCP 443 Inbound      | Management (LAN)        | Access to local monitoring tools (packet core dashboards and distributed tracing). |
| SCTP 38412 Inbound   | Port 5 (Access network) | Control plane access signaling (N2 interface). </br>Only required for 5G deployments. |
| SCTP 36412 Inbound   | Port 5 (Access network) | Control plane access signaling (S1-MME interface). </br>Only required for 4G deployments. |
| UDP 2152 In/Outbound | Port 5 (Access network) | Access network user plane data (N3 interface for 5G, S1-U for 4G). |
| All IP traffic       | Port 6 (Data network)   | Data network user plane data (N6 interface for 5G, SGi for 4G). |

## Order and set up your Azure Stack Edge Pro device(s)

Do the following for each site you want to add to your private mobile network. Detailed instructions for how to carry out each step are included in the **Detailed instructions** column where applicable.

| Step No. | Description | Detailed instructions |
|--|--|--|
| 1. | Complete the Azure Stack Edge Pro deployment checklist. | [Deployment checklist for your Azure Stack Edge Pro GPU device](../databox-online/azure-stack-edge-gpu-deploy-checklist.md)|
| 2. | Order and prepare your Azure Stack Edge Pro device. | [Tutorial: Prepare to deploy Azure Stack Edge Pro with GPU](../databox-online/azure-stack-edge-gpu-deploy-prep.md?tabs=azure-portal) |
| 3. | Rack and cable your Azure Stack Edge Pro device. </br></br>When carrying out this procedure, you must ensure that the device has its ports connected as follows:</br></br>- Port 5 - access network</br>- Port 6 - data network</br></br>Additionally, you must have a port connected to your management network. You can choose any port from 2 to 4. | [Tutorial: Install Azure Stack Edge Pro with GPU](../databox-online/azure-stack-edge-gpu-deploy-install.md) |
| 4. | Connect to your Azure Stack Edge Pro device using the local web UI. | [Tutorial: Connect to Azure Stack Edge Pro with GPU](../databox-online/azure-stack-edge-gpu-deploy-connect.md) |
| 5. | Configure the network for your Azure Stack Edge Pro device. When carrying out the *Enable compute network* step of this procedure, ensure you use the port you've connected to your management network. | [Tutorial: Configure network for Azure Stack Edge Pro with GPU](../databox-online/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy.md) |
| 6. | Configure a name, DNS name, and (optionally) time settings. | [Tutorial: Configure the device settings for Azure Stack Edge Pro with GPU](../databox-online/azure-stack-edge-gpu-deploy-set-up-device-update-time.md) |
| 7. | Configure certificates for your Azure Stack Edge Pro device. | [Tutorial: Configure certificates for your Azure Stack Edge Pro with GPU](../databox-online/azure-stack-edge-gpu-deploy-configure-certificates.md) |
| 8. | Activate your Azure Stack Edge Pro device. | [Tutorial: Activate Azure Stack Edge Pro with GPU](../databox-online/azure-stack-edge-gpu-deploy-activate.md) |
| 9. | Run the diagnostics tests for the Azure Stack Edge Pro device in the local web UI, and verify they all pass. </br></br>You may see a warning about a disconnected, unused port. You should fix the issue if the warning relates to any of these ports:</br></br>- Port 5.</br>- Port 6.</br>- The port you chose to connect to the management network in Step 3.</br></br>For all other ports, you can ignore the warning. </br></br>If there are any errors, resolve them before continuing with the remaining steps. This includes any errors related to invalid gateways on unused ports. In this case, either delete the gateway IP address or set it to a valid gateway for the subnet. | [Run diagnostics, collect logs to troubleshoot Azure Stack Edge device issues](../databox-online/azure-stack-edge-gpu-troubleshoot.md) |
| 10. | Deploy an Azure Kubernetes Service on Azure Stack HCI (AKS-HCI) cluster on your Azure Stack Edge Pro device. At the end of this step, the Kubernetes cluster will be connected to Azure Arc and ready to host a packet core instance. During this step, you'll need to use the information you collected in [Allocate subnets and IP addresses](#allocate-subnets-and-ip-addresses). | Contact your trials engineer for detailed instructions. |

## Next steps

You can now collect the information you'll need to deploy your own private mobile network.

- [Collect the required information to deploy your own private mobile network](collect-required-information-for-private-mobile-network.md)
