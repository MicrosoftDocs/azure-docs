---
title: Azure Container Storage enabled by Azure Arc using Azure Arc Jumpstart (preview)
description: Learn about Azure Arc Jumpstart and Azure Container Storage enabled by Azure Arc.
author: sethmanheim
ms.author: sethm
ms.topic: overview
ms.date: 08/26/2024

---

# Azure Arc Jumpstart and Azure Container Storage enabled by Azure Arc

Azure Container Storage enabled by Azure Arc partnered with [Azure Arc Jumpstart](https://azurearcjumpstart.com/) to produce both a new Arc Jumpstart scenario and Azure Arc Jumpstart Drops, furthering the capabilities of edge computing solutions. This partnership led to an innovative scenario in which a computer vision AI model detects defects in bolts from real-time video streams, with the identified defects securely stored using Azure Container Storage enabled by Azure Arc on an AKS Edge Essentials instance. This scenario showcases the powerful integration of Azure Arc with AI and edge storage technologies.

Additionally, Azure Container Storage enabled by Azure Arc contributed to Azure Arc Jumpstart Drops, a curated collection of resources that simplify deployment and management for developers and IT professionals. These tools, including Kubernetes files and scripts, are designed to streamline edge storage solutions and demonstrate the practical applications of Microsoft's cutting-edge technology.

## Azure Arc Jumpstart scenario using Azure Container Storage enabled by Azure Arc

Azure Container Storage enabled by Azure Arc collaborated with the [Azure Arc Jumpstart](https://azurearcjumpstart.com/) team to implement a scenario in which a computer vision AI model detects defects in bolts by analyzing video from a supply line video feed streamed over Real-Time Streaming Protocol (RTSP). The identified defects are then stored in a container within a storage account using Azure Container Storage enabled by Azure Arc.

In this automated setup, Azure Container Storage enabled by Azure Arc is deployed on an [AKS Edge Essentials](/azure/aks/hybrid/aks-edge-overview) single-node instance, running in an Azure virtual machine. An Azure Resource Manager template is provided to create the necessary Azure resources and configure the **LogonScript.ps1** custom script extension. This extension handles AKS Edge Essentials cluster creation, Azure Arc onboarding for the Azure VM and AKS Edge Essentials cluster, and Azure Container Storage enabled by Azure Arc deployment. Once AKS Edge Essentials is deployed, Azure Container Storage enabled by Azure Arc is installed as a Kubernetes service that exposes a CSI driven storage class for use by applications in the Edge Essentials Kubernetes cluster.

For more information, see the following articles:

- [Watch the Jumpstart scenario on YouTube](https://youtu.be/Qnh2UH1g6Q4).
- [See the Jumpstart documentation](https://aka.ms/esajumpstart).
- [See the Jumpstart architecture diagrams](https://aka.ms/arcposters).

## Azure Arc Jumpstart Drops for Azure Container Storage enabled by Azure Arc

Azure Container Storage enabled by Azure Arc created Jumpstart Drops as part of another collaboration with [Azure Arc Jumpstart](https://azurearcjumpstart.com/).

[Jumpstart Drops](https://aka.ms/jumpstartdrops) is a curated online collection of tools, scripts, and other assets that simplify the daily tasks of developers, IT, OT, and day-2 operations professionals. Jumpstart Drops is designed to showcase the power of Microsoft's products and services and promote mutual support and knowledge sharing among community members.

For more information, see the article [Create an Azure Container Storage enabled by Azure Arc instance on a Single Node Ubuntu K3s system](https://arcjumpstart.com/create_an_edge_storage_accelerator_(esa)_instance_on_a_single_node_ubuntu_k3s_system).

This Jumpstart Drop provides Kubernetes files to create an Azure Container Storage enabled by Azure Arc Cache Volumes instance on an install on Ubuntu with K3s.

## Next steps

- [Azure Container Storage enabled by Azure Arc overview](overview.md)
- [AKS Edge Essentials overview](/azure/aks/hybrid/aks-edge-overview)
