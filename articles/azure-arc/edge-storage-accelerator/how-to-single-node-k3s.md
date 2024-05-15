---
title: Install Edge Storage Accelerator (ESA) on a single-node K3s cluster using Ubuntu or AKS Edge Essentials (preview)
description: Learn how to create a single-node K3s cluster for Edge Storage Accelerator and install Edge Storage Accelerator on your Ubuntu or Edge Essentials environment.
author: sethmanheim
ms.author: sethm
ms.topic: how-to
ms.date: 04/08/2024

---

# Install Edge Storage Accelerator on a single-node K3s cluster (preview)

This article shows how to set up a single-node [K3s cluster](https://docs.k3s.io/) for Edge Storage Accelerator (ESA) using Ubuntu or [AKS Edge Essentials](/azure/aks/hybrid/aks-edge-overview), based on the instructions provided in the Edge Storage Accelerator documentation.

## Prerequisites

Before you begin, ensure you have the following prerequisites in place:

- A machine capable of running K3s, meeting the minimum system requirements.
- Basic understanding of Kubernetes concepts.

Follow these steps to create a single-node K3s cluster using Ubuntu or Edge Essentials.

## Step 1: Create and configure a K3s cluster on Ubuntu

Follow the [Azure IoT Operations K3s installation instructions](/azure/iot-operations/get-started/quickstart-deploy?tabs=linux#connect-a-kubernetes-cluster-to-azure-arc) to install K3s on your machine.

## Step 2: Prepare Linux using a single-node cluster

See [Prepare Linux using a single-node cluster](single-node-cluster.md) to set up a single-node K3s cluster.

## Step 3: Install Edge Storage Accelerator

Follow the instructions in [Install Edge Storage Accelerator](install-edge-storage-accelerator.md) to install Edge Storage Accelerator on your single-node Ubuntu K3s cluster.

## Step 4: Create Persistent Volume (PV)

Create a Persistent Volume (PV) by following the steps in [Create a PV](create-pv.md).

## Step 5: Create Persistent Volume Claim (PVC)

To bind with the PV created in the previous step, create a Persistent Volume Claim (PVC). See [Create a PVC](create-pvc.md) for guidance.

## Step 6: Attach application to Edge Storage Accelerator

Follow the instructions in [Edge Storage Accelerator: Attach your app](attach-app.md) to attach your application.

## Next steps

- [K3s Documentation](https://k3s.io/)
- [Azure IoT Operations K3s installation instructions](/azure/iot-operations/get-started/quickstart-deploy?tabs=linux#connect-a-kubernetes-cluster-to-azure-arc)
- [Azure Arc documentation](/azure/azure-arc/)
