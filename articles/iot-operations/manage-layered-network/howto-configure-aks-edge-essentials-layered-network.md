---
title: Configure Layered Network Management (preview) to use Azure IoT Operations in an isolated network
description: Configure Azure IoT Layered Network Management (preview) service to enable Azure IoT Operations in an isolated network.
author: PatAltimore
ms.subservice: layered-network-management
ms.author: patricka
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 12/12/2024

#CustomerIntent: As an operator, I want to Azure Arc enable AKS Edge Essentials clusters using Layered Network Management so that I have secure isolate devices.
ms.service: azure-iot-operations
---

# Configure Layered Network Management (preview) to use Azure IoT Operations in an isolated network

This walkthrough is an example of deploying Azure IoT Operations to a special environment that's different than the default [Azure IoT Operations scenario](../get-started-end-to-end-sample/quickstart-deploy.md). By default, Azure IoT Operations is deployed to an Arc-enabled cluster that has direct internet access. In this scenario, you deploy Azure IoT Operations to an isolated network environment. The hardware and cluster must meet the prerequisites of Azure IoT Operations and there are extra configurations for the network, host OS, and cluster. As a result, the Azure IoT Operations components run and connect to Arc through the Azure IoT Layered Network Management (preview) service.

>[!IMPORTANT]
> This is an advanced scenario for Azure IoT Operations. You should complete the following steps to get familiar with the basic concepts before you start this advanced scenario.
> - [Deploy Azure IoT Layered Network Management to an AKS cluster](howto-deploy-aks-layered-network.md)
> - [Deployment overview - Azure IoT Operations](../deploy-iot-ops/overview-deploy.md)
> - [Prepare your Kubernetes cluster - Azure IoT Operations](../deploy-iot-ops/howto-prepare-cluster.md)
> - [Deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster - Azure IoT Operations](../deploy-iot-ops/howto-deploy-iot-operations.md)
>     - You can reuse the cloud dependencies you create for this trial to reduce the complexity when setting up Azure IoT Operations in a Purdue Network environment. For example, **Key vault**, **Managed Identity**, and **Storage account**.
>
> You can't migrate a previously deployed Azure IoT Operations from its original network to an isolated network. For this scenario, follow the steps to begin with creating new clusters.

In this example, you Arc-enable AKS Edge Essentials or K3S clusters in the isolated layer of an ISA-95 network environment using the Layered Network Management service running in one level above.
The network and cluster architecture are described as follows:
- A level 4 single-node cluster running on a host machine with direct access to the internet.
- A custom DNS in the local network. See the [Configure custom DNS](howto-configure-layered-network.md#configure-custom-dns) for the options. To set up the environment quickly, you should use the *CoreDNS* approach instead of a DNS server.
- The level 3 cluster that is blocked from accessing internet. It connects to the Layered Network Management service as a proxy for all the Azure Arc related traffic.

For more information, see [Example of logical segmentation with minimum hardware](howto-configure-layered-network.md#example-of-logical-segmentation-with-minimum-hardware).

![Diagram of a logical isolated network configuration.](./media/howto-configure-layered-network/logical-network-segmentation.png)


### Configure level 4 Kubernetes cluster and Layered Network Management

After you configure the network, you need to configure the level 4 Kubernetes cluster. Complete the steps in [Configure IoT Layered Network Management level 4 cluster](./howto-configure-l4-cluster-layered-network.md). In the article, you:

- Set up a Windows 11 machine and configure AKS Edge Essentials or set up K3S Kubernetes on an Ubuntu machine.
- Deploy and configure the Layered Network Management service to run on the cluster.

You need to identify the **local IP** of the host machine. In later steps, you direct traffic from level 3 to this IP address with a custom DNS.

After you complete this section, the Layered Network Management service is ready for forwarding network traffic from level 3 to Azure.

### Configure the custom DNS

In the local network, you need to set up the mechanism to redirect all the network traffic to the Layered Network Management service. Use the steps in [Configure custom DNS](howto-configure-layered-network.md#configure-custom-dns). In the article: 
- If you choose the *CoreDNS* approach (only applicable for K3s cluster in L3), you can skip to *Configure and Arc enable level 3 cluster* and configure the CoreDNS before your Arc-enable the level 3 cluster.
- If you choose to use a *DNS server*, follow the steps to set up the DNS server before you move to the next section in this article.

### Configure and Arc enable level 3 cluster

The next step is to set up an Arc-enabled cluster in level 3 that's compatible for deploying Azure IoT Operations. You can choose either the AKS Edge Essentials or K3S as the Kubernetes platform.

# [K3S Cluster](#tab/k3s)

Follow the [Prepare your Azure Arc-enabled Kubernetes cluster](../deploy-iot-ops/howto-prepare-cluster.md) to set up and Arc-enable your K3s cluster.

1. Prepare your K3s cluster with internet access.
1. It's recommended to install the kubectl client with [these steps](/azure/azure-arc/kubernetes/troubleshooting#azure-cli) to ensure kubectl client is installed properly for Arc-enablement.
1. Proceed to Arc-enable the cluster.
1. Before you disable internet access of your cluster, you also need to complete the [Prerequisites for deploying Azure IoT Operations](/azure/iot-operations/deploy-iot-ops/howto-deploy-iot-operations#prerequisites).
1. After installing the required software components and setting up the K3s cluster, you can restrict the internet access for this cluster and configure the [CoreDNS](howto-configure-layered-network.md#configure-custom-dns) to redirect network traffic to your Layered Network Management service at level 4.

# [AKS Edge Essentials](#tab/aksee)

Follow the [Prepare your Azure Arc-enabled Kubernetes cluster](../deploy-iot-ops/howto-prepare-cluster.md) to set up and Arc-enable your AKS Edge Essentials cluster.

1. Prepare the AKS Edge Essentials with internet access.
1. Before you disable internet access of your cluster, you also need to complete the [Prerequisites for deploying Azure IoT Operations](/azure/iot-operations/deploy-iot-ops/howto-deploy-iot-operations#prerequisites).
1. After setting up the AKS Edge Essentials cluster, you can restrict the internet access for this cluster and rely on the **DNS server** that is prepared from earlier steps to redirect the network traffic to the Layered Network Management service at level 4. 

---

### Verification

Once the Azure Arc enablement of the level 3 cluster is complete, go to your resource group in the Azure portal. You should see a **Kubernetes - Azure Arc** resource with the name you specified.

1. Open the resource overview page. 
1. Verify **status** of the cluster is **online**.

For more information, see [Access Kubernetes resources from Azure portal](/azure/azure-arc/kubernetes/kubernetes-resource-view).

## Deploy Azure IoT Operations

Once your level 3 cluster is Arc-enabled, you can deploy IoT Operations to the cluster. All IoT Operations components are deployed to the level 3 cluster and connect to Arc through the Layered Network Management service. The data pipeline also routes through the Layered Network Management service.

You can now follow the steps in [Deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster](../deploy-iot-ops/howto-deploy-iot-operations.md) to deploy IoT Operations to the level 3 cluster.

![Network diagram that shows IoT Operations running on a level 3 cluster.](./media/howto-configure-layered-network/logical-network-segmentation-2.png)

## Next steps

Once IoT Operations is deployed, you can try the following tutorials. The Azure IoT Operations in your level 3 cluster works as described in the tutorials.

- [Tutorial: Add OPC UA assets to your Azure IoT Operations cluster](../end-to-end-tutorials/tutorial-add-assets.md)
- [Tutorial: Send asset telemetry to the cloud using the data lake connector for MQTT broker](../end-to-end-tutorials/tutorial-upload-telemetry-to-cloud.md)
