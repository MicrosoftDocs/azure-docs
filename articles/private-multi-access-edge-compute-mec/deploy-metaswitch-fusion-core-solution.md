---
title: 'Deploy Fusion Core on an Azure Stack Edge device'
description: Learn how to deploy cloud solutions from Microsoft Azure and Metaswitch Networks that can help future-proof your network, drive down costs, and create new business models and revenue streams.

author: djrmetaswitch
ms.service: private-multi-access-edge-compute-mec
ms.topic: how-to
ms.date: 06/16/2021
ms.author: drichards

---
# Deploy Fusion Core on an Azure Stack Edge device

This article provides a high-level overview of the process of deploying Fusion Core on an Azure Stack Edge device.

## Collect required Azure resources

You must have the following:

- A fully deployed Azure Stack Edge Pro with GPU. The device's ports must be connected as follows.

  - Port 5 - LAN
  - Port 6 - WAN
  - One port connected to your management network. You can choose any port from 1 to 4. You must have enabled your chosen port for compute, as described in the Enable compute network step of [Tutorial: Configure network for Azure Stack Edge Pro with GPU](../databox-online/azure-stack-edge-gpu-deploy-configure-network-compute-web-proxy.md).
- An Azure account with an active subscription and access to the following.

  - The Azure Network Function Manager service. This has the resource provider namespace Microsoft.HybridNetwork. For more information, see [What is Azure Network Function Manager?](../network-function-manager/overview.md).
  - The Fusion Core - 5G packet core managed application. You must request access by visiting [https://azuremarketplace.microsoft.com/marketplace/apps/metaswitch.fusioncore_0-1-0?tab=Overview](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/metaswitch.fusioncore_0-1-0?tab=Overview) and using the **CONTACT ME** button. Our sales representatives will provide you with information on how you can evaluate or buy Fusion Core. Once you have selected one of these options, we will provide you with access to the managed application.
  - The built-in **Owner** role at the subscription scope. If this is not possible at your organization, contact your Metaswitch support representative.
- A configured **Azure Network Function Manager - Device** object representing the Azure Stack Edge device.

## Deploy Fusion Core

The following diagram shows the process of deploying Fusion Core, including the objects you will create and the methods for ongoing management after installation.

:::image type="content" source="./media/deploy-metaswitch-solution/fusion-core-on-azure-stack-edge-deployment-process.png" alt-text="Fusion Core deployment process":::  

After selecting Fusion Core for ASE from the Azure Marketplace, you will deploy a named instance of the Fusion Core Managed Application in the Resource Group of your choice in your Azure Subscription.

The Fusion Core Managed Application creates a Managed Resource Group containing Packet Core Network Function and Relay resources to be installed on your Azure Stack Edge (ASE) device.

- The Packet Core Network Function resource defines the Fusion Core Base VM version and its configuration parameters. It is hidden in the Azure portal by default.
- The Relay resource contains a number of Hybrid Connections that provide the necessary connectivity for installation and remote access to monitoring interfaces.

Fusion Core is then automatically deployed on to your ASE device as follows.

1. The ASE device downloads and starts the Fusion Core Base VM.
1. The Metaswitch Service Management application installs and provisions Fusion Core onto the Kubernetes cluster within the Fusion Core Base VM.

In addition to coordinating the installation of Fusion Core, the Metaswitch Service Management application allows Metaswitch support representatives to monitor the health of the system and access diagnostics.


## Next steps
- For step-by-step instructions about deploying Fusion Core on an Azure Stack Edge device, [Download the Private 5G Edge Fusion Core Solution Guide](https://go.microsoft.com/fwlink/?linkid=2165096).
- Learn more about [Private 5G Edge Fusion Core](metaswitch-fusion-core-overview.md)