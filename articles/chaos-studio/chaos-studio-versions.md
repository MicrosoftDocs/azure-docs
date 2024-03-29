---
title: Azure Chaos Studio compatibility
description: Understand the compatibility of Azure Chaos Studio with operating systems and tools.
services: chaos-studio
author: rsgel 
ms.topic: overview
ms.date: 01/26/2024
ms.author: abbyweisberg
ms.reviewer: carlsonr
ms.service: chaos-studio
---

# Azure Chaos Studio version compatibility

The following reference shows relevant version support and compatibility for features within Chaos Studio. 

## Operating systems supported by the agent

The Chaos Studio agent is tested for compatibility with the following operating systems on Azure virtual machines. This testing involves deploying an Azure virtual machine with the specified SKU, installing the agent as a virtual machine extension, and validating the output of the available agent-based faults.

| Operating system | Chaos agent compatibility | Notes |
|:---:|:---:|:---:|
| Windows Server 2019             | ✓ |   |
| Windows Server 2016             | ✓ |   |
| Windows Server 2012 R2          | ✓ |   |
| Azure Linux (Mariner)           | ✓ | Installing `stress-ng` [manually](https://github.com/ColinIanKing/stress-ng) required for CPU Pressure, Physical Memory Pressure, Disk I/O Pressure, and Stress-ng faults |
| Red Hat Enterprise Linux 8      | ✓ | Currently tested up to 8.9 |
| openSUSE Leap 15.2              | ✓ |   |
| Debian 10 Buster                | ✓ | Installation of `unzip` utility required |
| Oracle Linux 8.3                | ✓ |   |
| Ubuntu Server 18.04 LTS         | ✓ |   |

The agent isn't currently tested against custom Linux distributions or hardened Linux distributions (for example, FIPS or SELinux).

If an operating system isn't currently listed, you may still attempt to install, use, and troubleshoot the virtual machine extension, agent, and agent-based capabilities, but Chaos Studio cannot guarantee behavior or support for an unlisted operating system.

To request validation and support on more operating systems or versions, use the [Chaos Studio Feedback Community](https://aka.ms/ChaosStudioFeedback).

## Chaos Mesh compatibility

Faults within Azure Kubernetes Service resources currently integrate with the open-source project [Chaos Mesh](https://chaos-mesh.org/), which is part of the [Cloud Native Computing Foundation](https://www.cncf.io/projects/chaosmesh/). Review [Create a chaos experiment that uses a Chaos Mesh fault to kill AKS pods with the Azure portal](chaos-studio-tutorial-aks-portal.md) for more details on using Azure Chaos Studio with Chaos Mesh.

Find Chaos Mesh's support policy and release dates here: [Supported Releases](https://chaos-mesh.org/supported-releases/).

Chaos Studio currently tests with the following version combinations. 

| Chaos Studio fault version | Kubernetes version | Chaos Mesh version | Notes |
|:---:|:---:|:---:|:---:|
| 2.1 | 1.27 | 2.6.3 | |
| 2.1 | 1.25.11 | 2.5.1 | |

The *Chaos Studio fault version* column refers to the individual fault version for each AKS Chaos Mesh fault used in the experiment JSON, for example `urn:csci:microsoft:azureKubernetesServiceChaosMesh:podChaos/2.1`. If a past version of the corresponding Chaos Studio fault remains available from the Chaos Studio API (for example, `...podChaos/1.0`), it is within support.

## Browser compatibility

Review the Azure portal documentation on [Supported devices](../azure-portal/azure-portal-supported-browsers-devices.md) for more information on browser support.
