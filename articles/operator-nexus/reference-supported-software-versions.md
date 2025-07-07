---
title: Supported software versions in Azure Operator Nexus 
description: Learn about supported software versions in Azure Operator Nexus. 
ms.topic: article
ms.date: 07/18/2024
author: scottsteinbrueck
ms.author: ssteinbrueck
ms.service: azure-operator-nexus
---

# Supported Kubernetes versions in Azure Operator Nexus

This document provides the list of software versioning supported in Release 2407.1 of Azure Operator Nexus.

## Supported software versions

| **Software**            | **Version(s)**                           | **Nexus Network Fabric Run-time Version** |
|-------------------------|-----------------------------------------|------------------------------------------|
| **Arista Firmware**     | 4.30.0F-30849330.bhimarel               | 1.0.0 *(NOTE: This runtime version is not supported for fresh deployments.)* |
|                         | MD5 checksum: c52cff01ed950606d36f433470110dca |                                          |
|                         | **4.30.3M**                              | 2.0.0                                    |
|                         | MD5 checksum: 53899348f586d95effb8ab097837d32d |                                          |
|                         | **4.31.2FX-NX**                          | 3.0.0                                    |
|                         | MD5 checksum: e5ee34d50149749c177bbeef3d10e363 |                                          |
|                         | **4.32.2FX-NX**                          | 4.0.0                                    |
|                         | MD5 checksum: c02f7cd5429c9aa0e4109b542388eb31 |                                          |
|                         | **EOS-4.33.1F**                          | 5.0.0                                    |
|                         | **32bit version EOS-4.33.1F.swi:** MD5 Checksum 92bd63991108dbfb6f8ef3d2c15e9028<br> **64bit version EOS64-4.33.1F.swi:** MD5 Checksum 108401f80963ebbf764d4fd1a6273a52 |                                          |
| **Instance Cluster AKS** | NC4.1.4                                  | NC Runtime is 1.30.7                                  |
| **Azure Linux (aka Mariner)** | NC4.1.4                          | NC Runtime is 3.0.20250102                             |
| **Purity**              | 6.5.1, 6.5.4, 6.5.6, 6.5.8               |                                          |

> [!Note]
> Management Switches (Arista devices) support only 32bit OS images and all other devices support only 64 bits OS images.

### Supported K8S versions
Versioning schema used for the Operator Nexus Kubernetes service, including the supported Kubernetes versions, are listed at [Supported Kubernetes versions in Azure Operator Nexus Kubernetes service](./reference-nexus-kubernetes-cluster-supported-versions.md).
