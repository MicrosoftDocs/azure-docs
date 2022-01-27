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

You must do the following before you can deploy a private mobile network. Detailed instructions for how to carry out each step are included in the **Detailed instructions** column where applicable.  You will use information collected in [Collect the required information to deploy a private mobile network - Azure portal](collect-required-information-for-private-mobile-network.md) during this process.

| Step No. | Description | Detailed instructions |
|--|--|--|
| 1. | <p>Contact your support representative and ask them to register your Azure subscription for access to the following.</p><ul><li>The Azure Network Function Manager CNF feature.</li><li>The Mobile Network feature.</li><ul> |  |
| 2. | Once your support representative has confirmed your access, register the Mobile Network resource provider (Microsoft.MobileNetwork) for your subscription, as described in [Azure resource providers and types](/azure/azure-resource-manager/management/resource-providers-and-types). |  |
| 3. | Order and prepare your Azure Stack Edge Pro device. | [Tutorial: Prepare to deploy Azure Stack Edge Pro with GPU](/azure/databox-online/azure-stack-edge-gpu-deploy-prep?tabs=azure-portal) |
| 4. | <p>Rack and cable your Azure Stack Edge Pro device.</p><p>When carrying out this procedure, you must ensure that the device has its ports connected as follows.</p><ul><li>Port 5 - LAN</li><li>Port 6 - WAN</li></ul><p>Additionally, you must have a port connected to your management network. You can choose any port from 2 to 4.</p> | [Tutorial: Install Azure Stack Edge Pro with GPU](/azure/databox-online/azure-stack-edge-gpu-deploy-install) |
| 5. | Connect to your Azure Stack Edge Pro device using the local web UI. | [Tutorial: Connect to Azure Stack Edge Pro with GPU](/azure/databox-online/azure-stack-edge-gpu-deploy-connect) |
| 6. | Configure the network for your Azure Stack Edge Pro device. When carrying out the *Enable compute network* step of this procedure, ensure you use the port you've connected to your management network. | [Tutorial: Configure network for Azure Stack Edge Pro with GPU](/azure/databox-online/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy) |
| 7. | Configure a name, DNS name, and (optionally) time settings. | [Tutorial: Configure the device settings for Azure Stack Edge Pro with GPU](/azure/databox-online/azure-stack-edge-gpu-deploy-set-up-device-update-time) |
| 8. | Configure certificates for your Azure Stack Edge Pro device. | [Tutorial: Configure certificates for your Azure Stack Edge Pro with GPU](/azure/databox-online/azure-stack-edge-gpu-deploy-configure-certificates) |
| 9. | Activate your Azure Stack Edge Pro device. | [Tutorial: Activate Azure Stack Edge Pro with GPU](/azure/databox-online/azure-stack-edge-gpu-deploy-activate) |
| 10. | <p>Run the diagnostics tests for the Azure Stack Edge Pro device in the local web UI, and verify they all pass.</p><p>If you see a warning about a disconnected, unused port that *does not* relate to Port 5, Port 6, or the port you chose to connect to the management network in Step 4, this is expected.</p><p>If there are any errors, you must resolve them before continuing with the remaining steps. This includes any errors related to invalid gateways on unused ports. In this case, either delete the gateway IP address or set it to a valid gateway for the subnet. | [Run diagnostics, collect logs to troubleshoot Azure Stack Edge device issues](/azure/databox-online/azure-stack-edge-gpu-troubleshoot)</p> |
| 11. | Deploy an AKS-HCI cluster on your Azure Stack Edge Pro device.  At the end of this step the cluster should be ARC connected ready for the mobile network to be deployed on it. |  |


## Next steps

You can either try deploying an example private mobile network, or you can jump straight in to collecting the information you'll need to deploy your own private mobile network.

- [Quickstart: Deploy an example private mobile network](quickstart-deploy-a-private-mobile-network-azure-portal.md)
- [Collect the required information to deploy your own private mobile network](collect-required-information-for-private-mobile-network.md)
