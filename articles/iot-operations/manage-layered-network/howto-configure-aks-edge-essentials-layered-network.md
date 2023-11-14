---
title: Configure Layered Network Management service to enable Azure IoT Operations in an isolated network
# titleSuffix: Azure IoT Layered Network Management
description: Configure Layered Network Management service to enable Azure IoT Operations in an isolated network.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 10/30/2023

#CustomerIntent: As an operator, I want to Azure Arc enable AKS Edge Essentials clusters using Layered Network Management so that I have secure isolate devices.
---

# Configure Layered Network Management service to enable Azure IoT Operations in an isolated network

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

You can Arc-enable AKS Edge Essentials or K3S clusters in an ISA-95 network environment* using the Azure IoT Layered Network Management service. In this article, you deploy an example level 4 cluster that can:
- Directly access the internet
- A dual network interface card (NIC) host that allows the level 4 cluster to be visible to the level 3 local network
- A custom DNS that resolves the DNS server in the local network
- The level 3 Azure AKS Edge Essentials cluster connects to the Layered Network Management service as a proxy for all the Azure Arc related traffic.

![Diagram showing a level 4 and level 3 AKS Edge Essentials network.](./media/howto-configure-aks-edge-essentials-layered-network/arc-enabled-aks-edge-essentials-cluster.png)

## Arc-enable Cluster in isolated network

To use the IoT Operation features, the level 3 cluster must be Arc-enabled.

### Configure network environment

Complete the steps in [Configure isolated network with physical segmentation](./howto-configure-layered-network.md#configure-isolated-network-with-physical-segmentation) to configure your Wi-Fi access point, local network, and DNS server.

When configuring the DNS server, you need to point the Arc related domains to **local network IP of the level 4 machine**. For example:

```
address=/.login.microsoft.com/<local network IP of the level 4 machine>
```

### Configure level 4 AKS Edge Essentials and Layered Network Management

Complete the steps in [Configure IoT Layered Network Management level 4 cluster](./howto-configure-l4-cluster-layered-network.md). When following the steps in the document, you need to:
- Configure the level 4 AKS Edge Essentials
- Complete the steps to deploy the Layered Network Management service.

After you complete the steps, the Layered Network Management service should be configured and running. The service is ready for forwarding network traffic from level 3.

### Configure and Arc enable level 3 cluster

Complete the steps in [Configure IoT Layered Network Management level 3 cluster](./howto-configure-l3-cluster-layered-network.md). Choose either the AKS Edge Essentials or K3S for Kubernetes cluster setup.

When following the steps in the document, you need to:
- Install all the optional software mentioned in the instructions.
- For the DNS server setting, provide the local network IP of the DNS server that you configured in the earlier step.
- Complete the steps to connect the cluster to Azure Arc.

### Verification

Once the Azure Arc enablement of the level 3 cluster is complete, Navigate to your resource group in the Azure portal. You should see a **Kubernetes - Azure Arc** resource with the name you specified.

1. Open the resource overview page. 
1. Verify **status** of the cluster is **online**.

For more information, see [Access Kubernetes resources from Azure portal](/azure/azure-arc/kubernetes/kubernetes-resource-view).

## Deploy Azure IoT Operations

Once your level 3 cluster is Arc-enabled, you can deploy IoT Operations to the cluster. All IoT Operations components are deployed to the level 3 cluster and connect to Arc through the Layered Network Management service. The data pipeline also routes through the Layered Network Management service.

![Network diagram that shows IoT Operations running on a level 3 cluster.](./media/howto-configure-aks-edge-essentials-layered-network/iot-operations-level-3-cluster.png)

Follow the steps in [Deploy Azure IoT Operations extensions to a Kubernetes cluster](../deploy-iot-ops/howto-deploy-iot-operations.md) to deploy IoT Operations to the level 3 cluster. You need to follow the steps in [Prepare your Azure Arc-enabled Kubernetes cluster](../deploy-iot-ops/howto-prepare-cluster.md) for enabling custom location support.

## Next steps

Once the IoT Operations is deployed, you can try the following quickstarts. The Alice Springs in your level 3 cluster shall be capable to work as described in the quickstarts.

- [Quickstart: Add OPC UA assets to your Azure IoT Operations cluster](../get-started/quickstart-add-assets.md)
- [Process telemetry](../get-started/quickstart-process-telemetry.md)
