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

Contact your support representative and ask them to register your Azure subscription for access to Azure Private 5G Core.

Once your support representative has confirmed your access, register the Mobile Network resource provider (Microsoft.MobileNetwork) for your subscription, as described in [Azure resource providers and types](../azure-resource-manager/management/resource-providers-and-types.md).

## Allocate subnets and IP addresses

For each of the following networks, allocate a subnet and then identify the listed IP addresses. If you're deploying multiple sites, you'll need to collect this information for each site.

### Management network

- Network address in Classless Inter-Domain Routing (CIDR) notation. 
- Default gateway. 
- One IP address for the Azure Stack Edge Pro device's management port. 
- Three sequential IP addresses for the Azure Kubernetes Service on Azure Stack HCI (AKS-HCI) cluster nodes.
- One IP address for accessing local monitoring tools for the packet core instance.

### Access network

- Network address in CIDR notation. 
- Default gateway. 
- One IP address for port 5 on the Azure Stack Edge Pro device. 
- One IP address for the packet core instance's N2 signaling interface. 
- One IP address for the packet core instance's N3 interface.

### Data network

- Network address in CIDR notation.
- Default gateway.
- One IP address for port 6 on the Azure Stack Edge Pro device.
- One IP address for the packet core instance's N6 interface.

## Allocate user equipment (UE) IP address pools

Azure Private 5G Core supports the following IP address allocation methods for UEs.

- Dynamic. Dynamic IP address allocation automatically assigns a new IP address to a UE each time it connects to the private mobile network. 

- Static. Static IP address allocation ensures that a UE receives the same IP address every time it connects to the private mobile network. This is useful when you want Internet of Things (IoT) applications to be able to consistently connect to the same device. For example, you may configure a video analysis application with the IP addresses of the cameras providing video streams. If these cameras have static IP addresses, you will not need to reconfigure the video analysis application with new IP addresses each time the cameras restart. You'll allocate static IP addresses to a UE as part of [provisioning its SIM](provision-sims-azure-portal.md).

You can choose to support one or both of these methods for each site in your private mobile network. 

For each site you're deploying, do the following:

- Decide which IP address allocation methods you want to support.
- For each method you want to support, identify an IP address pool from which IP addresses can be allocated to UEs. You'll need to provide each IP address pool in CIDR notation. 

    If you decide to support both methods for a particular site, ensure that the IP address pools are of the same size and do not overlap. 

## Order and set up your Azure Stack Edge Pro device(s)

Do the following for each site you want to add to your private mobile network. Detailed instructions for how to carry out each step are included in the **Detailed instructions** column where applicable.

| Step No. | Description | Detailed instructions |
|--|--|--|
| 1. | Order and prepare your Azure Stack Edge Pro device. | [Tutorial: Prepare to deploy Azure Stack Edge Pro with GPU](../databox-online/azure-stack-edge-gpu-deploy-prep.md?tabs=azure-portal) |
| 2. | Rack and cable your Azure Stack Edge Pro device. </br></br>When carrying out this procedure, you must ensure that the device has its ports connected as follows:</br></br>- Port 5 - access network</br>- Port 6 - data network</br></br>Additionally, you must have a port connected to your management network. You can choose any port from 2 to 4. | [Tutorial: Install Azure Stack Edge Pro with GPU](../databox-online/azure-stack-edge-gpu-deploy-install.md) |
| 3. | Connect to your Azure Stack Edge Pro device using the local web UI. | [Tutorial: Connect to Azure Stack Edge Pro with GPU](../databox-online/azure-stack-edge-gpu-deploy-connect.md) |
| 4. | Configure the network for your Azure Stack Edge Pro device. When carrying out the *Enable compute network* step of this procedure, ensure you use the port you've connected to your management network. | [Tutorial: Configure network for Azure Stack Edge Pro with GPU](../databox-online/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy.md) |
| 5. | Configure a name, Domain Name System (DNS) name, and (optionally) time settings. | [Tutorial: Configure the device settings for Azure Stack Edge Pro with GPU](../databox-online/azure-stack-edge-gpu-deploy-set-up-device-update-time.md) |
| 6. | Configure certificates for your Azure Stack Edge Pro device. | [Tutorial: Configure certificates for your Azure Stack Edge Pro with GPU](../databox-online/azure-stack-edge-gpu-deploy-configure-certificates.md) |
| 7. | Activate your Azure Stack Edge Pro device. | [Tutorial: Activate Azure Stack Edge Pro with GPU](../databox-online/azure-stack-edge-gpu-deploy-activate.md) |
| 8. | Run the diagnostics tests for the Azure Stack Edge Pro device in the local web UI, and verify they all pass. </br></br>You may see a warning about a disconnected, unused port. You should fix the issue if the warning relates to any of these ports:</br></br>- Port 5.</br>- Port 6.</br>- The port you chose to connect to the management network in Step 2.</br></br>For all other ports, you can ignore the warning.</br></br>If there are any errors, resolve them before continuing with the remaining steps. This includes any errors related to invalid gateways on unused ports. In this case, either delete the gateway IP address or set it to a valid gateway for the subnet. | [Run diagnostics, collect logs to troubleshoot Azure Stack Edge device issues](../databox-online/azure-stack-edge-gpu-troubleshoot.md) |
| 9. | Deploy an Azure Kubernetes Service on Azure Stack HCI (AKS-HCI) cluster on your Azure Stack Edge Pro device. At the end of this step, the Kubernetes cluster will be connected to Azure Arc and ready to host a packet core instance. During this step, you'll need to use the information you collected in [Allocate subnets and IP addresses](#allocate-subnets-and-ip-addresses). | Contact your support representative for detailed instructions. |


## Next steps

You can now collect the information you'll need to deploy your own private mobile network.

- [Collect the required information to deploy your own private mobile network](collect-required-information-for-private-mobile-network.md)