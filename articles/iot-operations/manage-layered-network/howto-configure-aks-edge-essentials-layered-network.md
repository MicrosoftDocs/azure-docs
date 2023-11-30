---
title: Configure Layered Network Management service to enable Azure IoT Operations in an isolated network
titleSuffix: Azure IoT Layered Network Management
description: Configure Layered Network Management service to enable Azure IoT Operations in an isolated network.
author: PatAltimore
ms.subservice: layered-network-management
ms.author: patricka
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 11/15/2023

#CustomerIntent: As an operator, I want to Azure Arc enable AKS Edge Essentials clusters using Layered Network Management so that I have secure isolate devices.
---

# Configure Layered Network Management service to enable Azure IoT Operations in an isolated network

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

This walkthrough is an example of deploying Azure IoT Operations to a special environment that's different than the default [Azure IoT Operations scenario](../get-started/quickstart-deploy.md). By default, Azure IoT Operations is deployed to an Arc-enabled cluster that has direct internet access. In this scenario, you deploy Azure IoT Operations to an isolated network environment. The hardware and cluster must meet the prerequisites of Azure IoT Operations and there are additional configurations for the network, host OS, and cluster. As a result, the Azure IoT Operations components run and connect to Arc through the Azure IoT Layered Network Management service.

>[!IMPORTANT]
> This is an advanced scenario for Azure IoT Operations. You should complete the following quickstarts to get familiar with the basic concepts before you start this advanced scenario.
> - [Deploy Azure IoT Layered Network Management to an AKS cluster](howto-deploy-aks-layered-network.md)
> - [Quickstart: Deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster](../get-started/quickstart-deploy.md)
>
> You can't migrate a previously deployed Azure IoT Operations from its original network to an isolated network. For this scenario, follow the steps to begin with creating new clusters.

In this example, you Arc-enable AKS Edge Essentials or K3S clusters in the isolated layer of an ISA-95 network environment using the Layered Network Management service running in one level above.
The network and cluster architecture are described as follows:
- A level 4 single-node cluster running on a host machine with:
    - Direct access to the internet.
    - A secondary network interface card (NIC) connected to the local network. The secondary NIC makes the level 4 cluster visible to the level 3 local network.
- A custom DNS in the local network. See the [Configure custom DNS](howto-configure-layered-network.md#configure-custom-dns) for the options. To set up the environment quickly, you should use the *CoreDNS* approach instead of a DNS server.
- The level 3 cluster connects to the Layered Network Management service as a proxy for all the Azure Arc related traffic.

![Diagram showing a level 4 and level 3 AKS Edge Essentials network.](./media/howto-configure-aks-edge-essentials-layered-network/arc-enabled-aks-edge-essentials-cluster.png)

### Configure level 4 AKS Edge Essentials and Layered Network Management

After you configure the network, you need to configure the level 4 Kubernetes cluster. Complete the steps in [Configure IoT Layered Network Management level 4 cluster](./howto-configure-l4-cluster-layered-network.md). In the article, you:

- Set up a Windows 11 machine and configure AKS Edge Essentials.
- Deploy and configure the Layered Network Management service to run on the cluster.

You need to identify the **local IP** of the host machine. In later steps, you direct traffic from level 3 to this IP address with a custom DNS.

After you complete this section, the Layered Network Management service is ready for forwarding network traffic from level 3 to Azure.

### Configure the custom DNS

In the local network, you need to set up the mechanism to redirect all the network traffic to the Layered Network Management service. Use the steps in [Configure custom DNS](howto-configure-layered-network.md#configure-custom-dns). In the article:
    - If you choose the *CoreDNS* approach, you can skip to *Configure and Arc enable level 3 cluster* and configure the CoreDNS before your Arc-enable the level 3 cluster.
    - If you choose to use a *DNS server*, follow the steps to set up the DNS server before you move to the next section in this article.

### Configure and Arc enable level 3 cluster

The next step is to set up an Arc-enabled cluster in level 3 that's compatible for deploying Azure IoT Operations. Follow the steps in [Configure level 3 cluster in an isolated network](./howto-configure-l3-cluster-layered-network.md). You can choose either the AKS Edge Essentials or K3S as the Kubernetes platform.

When completing the steps, you need to:
- Install all the optional software.
- For the DNS setting, provide the local network IP of the DNS server that you configured in the earlier step.
- Complete the steps to connect the cluster to Azure Arc.

### Verification

Once the Azure Arc enablement of the level 3 cluster is complete, navigate to your resource group in the Azure portal. You should see a **Kubernetes - Azure Arc** resource with the name you specified.

1. Open the resource overview page. 
1. Verify **status** of the cluster is **online**.

For more information, see [Access Kubernetes resources from Azure portal](/azure/azure-arc/kubernetes/kubernetes-resource-view).

## Deploy Azure IoT Operations

Once your level 3 cluster is Arc-enabled, you can deploy IoT Operations to the cluster. All IoT Operations components are deployed to the level 3 cluster and connect to Arc through the Layered Network Management service. The data pipeline also routes through the Layered Network Management service.

![Network diagram that shows IoT Operations running on a level 3 cluster.](./media/howto-configure-aks-edge-essentials-layered-network/iot-operations-level-3-cluster.png)

Follow the steps in [Quickstart: Deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster](../get-started/quickstart-deploy.md) to deploy IoT Operations to the level 3 cluster.

- In earlier steps, you completed the [prerequisites](../get-started/quickstart-deploy.md#prerequisites) and [connected your cluster to Azure Arc](../get-started/quickstart-deploy.md#connect-a-kubernetes-cluster-to-azure-arc) for Azure IoT Operations. You can review these steps to make sure nothing is missing. 

- Start from the [Configure cluster and deploy Azure IoT Operations](../get-started/quickstart-deploy.md#configure-cluster-and-deploy-azure-iot-operations) and complete all the further steps.


## Next steps

Once IoT Operations is deployed, you can try the following quickstarts. The Azure IoT Operations in your level 3 cluster works as described in the quickstarts.

- [Quickstart: Add OPC UA assets to your Azure IoT Operations cluster](../get-started/quickstart-add-assets.md)
- [Quickstart: Use Data Processor pipelines to process data from your OPC UA assets](../get-started/quickstart-process-telemetry.md)
