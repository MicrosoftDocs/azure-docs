---
title: Prepare to deploy a private mobile network
titlesuffix: Azure Private 5G Core Preview
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

## Complete the prerequisite tasks

You must do the following before you can deploy a private mobile network. Detailed instructions for how to carry out each step are included in the **Detailed instructions** column where applicable.

| Step No. | Description | Detailed instructions |
|--|--|--|
| 1. | Contact your support representative and ask them to register your Azure subscription for access to Azure Private 5G Core. |  |
| 2. | Once your support representative has confirmed your access, register the Mobile Network resource provider (Microsoft.MobileNetwork) for your subscription, as described in [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types). |  |
| 3. | Order and prepare your Azure Stack Edge Pro device. | [Tutorial: Prepare to deploy Azure Stack Edge Pro with GPU](/azure/databox-online/azure-stack-edge-gpu-deploy-prep?tabs=azure-portal) |
| 4. | <p>Rack and cable your Azure Stack Edge Pro device.</p><p>When carrying out this procedure, you must ensure that the device has its ports connected as follows.</p><ul><li>Port 5 - LAN</li><li>Port 6 - WAN</li></ul><p>Additionally, you must have a port connected to your management network. You can choose any port from 2 to 4.</p> | [Tutorial: Install Azure Stack Edge Pro with GPU](/azure/databox-online/azure-stack-edge-gpu-deploy-install) |
| 5. | Connect to your Azure Stack Edge Pro device using the local web UI. | [Tutorial: Connect to Azure Stack Edge Pro with GPU](/azure/databox-online/azure-stack-edge-gpu-deploy-connect) |
| 6. | Configure the network for your Azure Stack Edge Pro device. When carrying out the *Enable compute network* step of this procedure, ensure you use the port you've connected to your management network. | [Tutorial: Configure network for Azure Stack Edge Pro with GPU](/azure/databox-online/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy) |
| 7. | Configure a name, Domain Name System (DNS) name, and (optionally) time settings. | [Tutorial: Configure the device settings for Azure Stack Edge Pro with GPU](/azure/databox-online/azure-stack-edge-gpu-deploy-set-up-device-update-time) |
| 8. | Configure certificates for your Azure Stack Edge Pro device. | [Tutorial: Configure certificates for your Azure Stack Edge Pro with GPU](/azure/databox-online/azure-stack-edge-gpu-deploy-configure-certificates) |
| 9. | Activate your Azure Stack Edge Pro device. | [Tutorial: Activate Azure Stack Edge Pro with GPU](/azure/databox-online/azure-stack-edge-gpu-deploy-activate) |
| 10. | <p>Run the diagnostics tests for the Azure Stack Edge Pro device in the local web UI, and verify they all pass.</p><p>You may see a warning about a disconnected, unused port. If the warning relates to any of these ports, you should fix the issue.</p><ul><li>Port 5.</li><li>Port 6.</li><li>The port you chose to connect to the management network in Step 4.</li></ul><p>For all other ports, you can ignore the warning.</p><p>If there are any errors, resolve them before continuing with the remaining steps. This includes any errors related to invalid gateways on unused ports. In this case, either delete the gateway IP address or set it to a valid gateway for the subnet. | [Run diagnostics, collect logs to troubleshoot Azure Stack Edge device issues](/azure/databox-online/azure-stack-edge-gpu-troubleshoot)</p> |
| 11. | <p>Deploy an Azure Kubernetes Service on Azure Stack HCI (AKS-HCI) cluster on your Azure Stack Edge Pro device. At the end of this step, the Kubernetes cluster will be connected to Azure Arc and ready to host a packet core instance. During this step, you'll need to decide on the following information for your private mobile network.</p><ul><li>IP addresses for the packet core instance's N2 signaling, N3, and N6 interfaces.</li><li>Network addresses and default gateways for the access and data subnets.</li> | Contact your support representative for detailed instructions. |


## Next steps

You can now collect the information you'll need to deploy your own private mobile network.

- [Collect the required information to deploy your own private mobile network](collect-required-information-for-private-mobile-network.md)
