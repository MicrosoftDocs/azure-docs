---
title: Frequently asked questions for Azure Container Storage
description: Get answers to Azure Container Storage frequently asked questions (FAQ).
author: khdownie
ms.service: azure-container-storage
ms.date: 10/15/2024
ms.author: kendownie
ms.topic: faq
ms.custom: references_regions
---

# Frequently asked questions (FAQ) about Azure Container Storage

[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers.

## General questions

* <a id="azure-container-storage-vs-csi-drivers"></a>
  **What's the difference between Azure Container Storage and Azure CSI drivers?**  
  Azure Container Storage is built natively for containers and provides a storage solution that's optimized for creating and managing volumes for running production-scale stateful container applications. Other Azure CSI drivers provide a standard storage solution that can be used with different container orchestrators and support the specific type of storage solution per CSI driver definition.

* <a id="azure-container-storage-regions"></a>
  **In which Azure regions is Azure Container Storage available?**  
  [!INCLUDE [container-storage-regions](../../../includes/container-storage-regions.md)]

* <a id="azure-container-storage-update"></a>
  **If I already have Azure Container Storage preview installed on my AKS cluster, how can I update to the latest GA version?**  
  If you have auto-upgrade turned on, Azure Container Storage will update to the latest version automatically. If you don't have auto-upgrade turned on, we recommend updating to the latest generally available (GA) version by running the following command. Remember to replace `<cluster-name>` and `<resource-group>` with your own values.

  ```azurecli-interactive
  az k8s-extension update --cluster-type managedClusters --cluster-name <cluster-name> --resource-group <resource-group> --name azurecontainerstorage --version 1.1.0 --auto-upgrade false --release-train stable
  ```

* <a id="azure-container-storage-autoupgrade"></a>
  **Is there any performance impact when upgrading to a new version of Azure Container Storage?**  
  If you leave auto-upgrade turned on (recommended), you might experience temporary I/O latency during the upgrade process. If you turn off auto-upgrade and install the new version manually, there won't be any impact; however, you won't get the benefit of automatic upgrades and instant access to new features.

* <a id="storage-pool-parameters"></a>
  **What parameters can I specify for the storage pool that's created when Azure Container Storage is installed with the `az aks create` command?**  
  Refer to [this article](container-storage-storage-pool-parameters.md) for the mandatory and optional storage pool parameters, along with their default values.

* <a id="azure-container-storage-limitations"></a>
  **Which other Azure services does Azure Container Storage support?**  
  Currently, Azure Container Storage supports only Azure Kubernetes Service (AKS) with storage pools provided by Azure Disks, Ephemeral Disk, or Azure Elastic SAN.

* <a id="azure-container-storage-rwx"></a>
  **Does Azure Container Storage support read-write-many (RWX) workloads?**  
  Azure Container Storage doesn't support RWX workloads. However, Azure's first-party Files and Blob CSI drivers are great alternatives and fully supported.

* <a id="azure-container-storage-remove"></a>
  **How do I remove Azure Container Storage?**  
  See [Remove Azure Container Storage](remove-container-storage.md).

* <a id="azure-container-storage-containeros"></a>
  **Does Azure Container Storage support Windows containers on AKS?**  
  No, Azure Container Storage only supports AKS containers running on Ubuntu and Azure Linux nodes.

* <a id="azure-container-storage-ephemeralosdisk"></a>
  **Does Azure Container Storage use the capacity from Ephemeral OS disks for ephemeral disk storage pool?**  
  No, Azure Container Storage only discovers and uses the capacity from ephemeral data disks for ephemeral disk storage pool.

* <a id="azure-container-storage-endpoints"></a>
  **What endpoints need to be allowlisted in the Azure Firewall for Azure Container Storage to work?**

  To ensure Azure Container Storage functions correctly, you must allowlist specific endpoints in your Azure Firewall. These endpoints are required for Azure 
  Container Storage components to communicate with necessary Azure services. Failure to allowlist these endpoints can cause installation or runtime issues.
 
  Endpoints to Allowlist:

  `linuxgeneva-microsoft.azurecr.io`,
  `eus2azreplstore137.blob.core.windows.net`,
  `eus2azreplstore70.blob.core.windows.net`,
  `eus2azreplstore155.blob.core.windows.net`,
  `eus2azreplstore162.blob.core.windows.net`,
  `*.hcp.eastus2.azmk8s.io`,
  `management.azure.com`,
  `login.microsoftonline.com`,
  `packages.microsoft.com`,
  `acs-mirror.azureedge.net`,
  `eastus2.dp.kubernetesconfiguration.azure.com`,
  `mcr.microsoft.com`.

  For additional details, refer to the [Outbound network and FQDN rules for Azure Kubernetes Service (AKS) clusters](/azure/aks/outbound-rules-control-egress) documentation and [Azure Arc-enabled Kubernetes network requirements.](/azure/azure-arc/kubernetes/network-requirements?tabs=azure-cloud)

## See also

- [What is Azure Container Storage?](container-storage-introduction.md)
