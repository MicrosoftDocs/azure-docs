---
title: Frequently asked questions (FAQ) for Azure Container Storage
description: Get answers to Azure Container Storage frequently asked questions.
author: khdownie
ms.service: storage
ms.date: 03/06/2023
ms.author: kendownie
ms.subservice: container-storage
ms.topic: conceptual
---

# Frequently asked questions (FAQ) about Azure Container Storage
Azure Container Storage is a cloud-based volume management offering built natively for containers. 

## General questions

* <a id="azure-container-storage-vs-csi-drivers"></a>
  **What's the difference between Azure Container Storage and Azure CSI drivers?**  
    Azure Container Storage is built natively for containers and provides a storage solution that's optimized for creating and managing volumes for running production-scale stateful container applications. Other Azure CSI drivers provide a more general storage solution that can be used with different container orchestrators and support the specific type of storage solution per CSI driver definition.

* <a id="azure-container-storage-regions"></a>
  **In which Azure regions is Azure Container Storage available?**  
    See [Azure products available by region](https://azure.microsoft.com/global-infrastructure/services/?products). 

* <a id="azure-container-storage-preview-limitations"></a>
**Which other Azure services does Azure Container Storage support?**
    During public preview, Azure Container Storage supports only Azure Kubernetes Service (AKS).

## See also
* [What is Azure Container Storage?](container-storage-introduction.md)

