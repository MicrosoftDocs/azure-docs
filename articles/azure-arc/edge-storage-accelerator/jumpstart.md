---
title: Azure Arc Jumpstart scenario using Edge Storage Accelerator (preview)
description: Learn about an Azure Arc Jumpstart scenario that uses Edge Storage Accelerator.
author: sethmanheim
ms.author: sethm
ms.topic: overview
ms.date: 04/18/2024

---

# Azure Arc Jumpstart scenario using Edge Storage Accelerator

Edge Storage Accelerator (ESA) collaborated with the [Azure Arc Jumpstart](https://azurearcjumpstart.com/) team to implement a scenario in which a computer vision AI model detects defects in bolts by analyzing video from a supply line video feed streamed over Real-Time Streaming Protocol (RTSP). The identified defects are then stored in a container within a storage account using Edge Storage Accelerator.

## Scenario description

In this automated setup, ESA is deployed on an [AKS Edge Essentials](/azure/aks/hybrid/aks-edge-overview) single-node instance, running in an Azure virtual machine. An Azure Resource Manager template is provided to create the necessary Azure resources and configure the **LogonScript.ps1** custom script extension. This extension handles AKS Edge Essentials cluster creation, Azure Arc onboarding for the Azure VM and AKS Edge Essentials cluster, and Edge Storage Accelerator deployment. Once AKS Edge Essentials is deployed, ESA is installed as a Kubernetes service that exposes a CSI driven storage class for use by applications in the Edge Essentials Kubernetes cluster.

For more information, see the following articles:

- [Watch the ESA Jumpstart scenario on YouTube](https://youtu.be/Qnh2UH1g6Q4)
- [Visit the ESA Jumpstart documentation](https://aka.ms/esajumpstart)
- [Visit the ESA Jumpstart architecture diagrams](https://aka.ms/arcposters)

## Next steps

- [Edge Storage Accelerator overview](overview.md)
- [AKS Edge Essentials overview](/azure/aks/hybrid/aks-edge-overview)
