---
title: Release notes for Azure Container Storage
description: Release notes for Azure Container Storage
author: denisacatalinastan
ms.service: azure-container-storage
ms.topic: release-notes
ms.date: 11/26/2024
ms.author: dstan
---
# Release notes for Azure Container Storage

This article provides the release notes for Azure Container Storage. It's important to note that minor releases introduce new functionalities in a backward-compatible manner (for example, 1.3.0 Minor Release). Patch releases focus on bug fixes, security updates, and smaller improvements (for example, 1.2.1).

## Supported versions

The following Azure Container Storage versions are supported: 

| Milestone | Status |
|----|----------------| 
|1.3.0- Minor Release | Supported | 
|1.2.1- Patch Release | Supported |
|1.2.0- Minor Release | Supported |
|1.1.2- Patch Release | Supported |
|1.1.1- Patch Release | Supported |
|1.1.0- General Availability| Supported | 

## Unsupported versions

The following Azure Container Storage versions are no longer supported: 1.0.6-preview, 1.0.3-preview, 1.0.2-preview, 1.0.1-preview, 1.0.0-preview. See [Upgrade a preview installation to GA](#upgrade-a-preview-installation-to-ga) for upgrading guidance.

## Major vs. minor vs. patch releases

A **major release** introduces significant changes, often including new features, architectural updates, or breaking changes; for example, moving from version 1.1.0 to 2.0.0. A **minor release** adds enhancements or new functionality that are backward-compatible, such as moving from version 1.2.0 to 1.3.0. Lastly, a **patch release** focuses on resolving critical bugs, security issues, or minor optimizations while maintaining backward compatibility, such as moving from version 1.1.1 to 1.1.2, and is intended to ensure stability and reliability without introducing new features.

## Version 1.3.0 

### Improvements and issues that are fixed

- **Bug fixes-Prometheus Operator**: In previous versions, some customers faced difficulties disabling Azure Container Storage’s default Prometheus operator when using a custom Prometheus deployment. This issue has now been fixed, allowing users to successfully turn off the built-in operator without conflict.  
- **Performance Tuning for SQL-based Databases**: Running MySQL and PostgreSQL on Azure Container Storage is up to 5x faster on ephemeral disks. For more information and examples, refer to the [PostgreSQL on AKS deployment guide](/azure/aks/postgresql-ha-overview).
  
## Version 1.2.1 

### Improvements and issues that are fixed

- **Bug fixes and performance improvements**: The version improved security and resilience by addressing vulnerabilities, updating Azure Linux base images, and reinforcing container security. These updates enhance threat mitigation and compliance. 
- **Node taints toleration**: Node taints can prevent pods from being deployed on a node pool. See more information in [AKS Node Taints](/azure/aks/use-node-taints). When node taints are configured on the node pool, the installation of Azure Container Storage components is blocked. With node taints toleration, Azure Container Storage component pods can be deployed successfully without the need to temporarily remove the taints as a mitigation. This feature is built-in without configuration, and is supported **only for ephemeral storage pools**.

## Version 1.2.0 

### Improvements and issues that are fixed

- **Bug fixes and performance improvements**: We've made general stability improvements to address key recovery issues, especially during upgrade scenarios. These updates are designed to ensure more reliable recovery processes and prevent unexpected service interruptions, delivering a smoother and more consistent experience.  
- **Ephemeral Disk Performance Enhancements**: We improved overall performance for Azure Container Storage with ephemeral NVMe disks as the backing storage option, delivering up to a 100% increase in write IOPS in setups with replication enabled. For more details, read about ephemeral disk performance [using local NVMe](/azure/storage/container-storage/use-container-storage-with-local-disk#optimize-performance-when-using-local-nvme) and [using local NVMe with replication](/azure/storage/container-storage/use-container-storage-with-local-nvme-replication#optimize-performance-when-using-local-nvme).

## Version 1.1.2 

### Improvements and issues that are fixed

- **Bug fixes and performance improvements**: We improved the overall system stability by fixing general bugs and optimizing performance.
- **Security Enhancements**: This release improves security by updating package dependencies and Microsoft container images and improving container image builds to reduce dependencies.
- **Volume attachment fixes**: We also resolved an issue where volumes remained in a published state on nodes that were no longer present in the cluster, causing volume mounts to fail. This fix ensures that volumes are properly detached and reattached, allowing workloads to continue without interruptions. 

## Version 1.1.1

### Improvements and issues that are fixed

- This patch release addresses specific issues that some customers experienced during the creation of Azure Elastic SAN storage pools. It resolves exceptions that were causing disruptions in the setup process, enabling smoother and more reliable storage pool creation.
- We've also made improvements to cluster restart scenarios. Previously, some corner-case situations caused cluster restarts to fail. This update ensures that cluster restarts are more reliable and resilient.

## Version 1.1.0

### Improvements and issues that are fixed

- **Security Enhancements**: This update addresses vulnerabilities in container environments, enhancing security enforcement to better protect workloads. 
- **Data plane stability**: We've also improved the stability of data-plane components, ensuring more reliable access to Azure Container Storage volumes and storage pools. This also enhances the management of data replication between storage nodes.
- **Volume management improvements**: The update resolves issues with volume detachment during node drain scenarios, ensuring that volumes are safely and correctly detached, and allowing workloads to migrate smoothly without interruptions or data access issues.

## Azure Container Storage support policy

Azure Container Storage follows a transparent and predictable support lifecycle which is aligned with the overall AKS extension guidance on product lifecycle and support plan. In this way, we ensure you can plan your deployments and upgrades effectively. This section outlines the lifecycle, support commitment, and Kubernetes version compatibility for each Azure Container Storage release. 

### Lifecycle and patch support

- **Major/minor releases**: Supported for 12 months from the release date. 
- **Patch releases**: Have the same end of life as the subsequent major/minor release.  

| Release version | Release Date  | End of Life | Supported Kubernetes Versions |
|----|----------------| ------------| -------- |
|1.3.0- Minor Release | 04/28/2025 | 04/27/2026 | 1.32, 1.31, 1.30 | 
|1.2.1- Patch Release| 02/10/2025 | 11/10/2025| 1.30, 1.29, 1.28| 
|1.2.0- Minor Release | 11/11/2024 | 11/10/2025 | 1.30, 1.29, 1.28 | 
|1.1.2- Patch Release | 10/16/2024 | 07/29/2025 | 1.29, 1.28, 1.27 |
|1.1.1- Patch Release | 09/20/2024 | 07/29/2025 | 1.29, 1.28, 1.27 | 
|1.1.0- General Availability| 07/30/2024 | 07/29/2025 | 1.29, 1.28, 1.27 | 

### Kubernetes version compatibility

Azure Container Storage aligns with AKS support for Kubernetes versions using the N-2 practice. When releasing a major or minor version, Azure Container Storage validates the latest three available Kubernetes versions in AKS and updates the supported Kubernetes versions accordingly. For each release:

- It supports the latest Kubernetes version generally available with AKS and the two prior versions. 
- If compatibility isn't possible due to deprecation or breaking API changes, the release notes will explicitly call out these exceptions.

Before upgrading the Kubernetes version in your AKS cluster, we recommend checking if the version is included in the Azure Container Storage version support list. If the latest Azure Container Storage version doesn't yet support it, consider deferring the upgrade. As a general best practice, validate your workloads with the new version of Kubernetes or the new version of dependent components in a staging environment before upgrading in the production environment. 

### Important guidance for version synchronization 

To maintain compatibility and avoid unvalidated combinations of Azure Container Storage and AKS: 

- All patch releases within a minor version (for example, 1.1.x) will support the same Kubernetes versions as the initial minor release (for example, 1.2.1). 

- New minor releases (for example, 1.2.0 and subsequent 1.2.x) will support a sliding window of Kubernetes versions, advancing to the next version with each new minor release (for example, 1.2.0 supports 1.28, 1.29, and 1.30). 

## Upgrade a preview installation to GA

If you already have a preview instance of Azure Container Storage running on your cluster, we recommend updating to the latest generally available (GA) version by running the following command: 

```azurecli-interactive
az k8s-extension update --cluster-type managedClusters --cluster-name <cluster-name> --resource-group <resource-group> --name azurecontainerstorage --version <version> --release-train stable
```

Remember to replace `<cluster-name>` and `<resource-group>` with your own values and `<version>` with the desired supported version. 

Please note that preview versions are no longer supported, and customers should promptly upgrade to the GA versions to ensure continued stability and access to the latest features and fixes. If you're installing Azure Container Storage for the first time on the cluster, proceed instead to [Install Azure Container Storage and create a storage pool](container-storage-aks-quickstart.md#install-azure-container-storage-and-create-a-storage-pool). You can also [Install Azure Container Storage on specific node pools](container-storage-aks-quickstart.md#install-azure-container-storage-on-specific-node-pools).

## Auto-upgrade policy

To receive the latest features and fixes for Azure Container Storage in future versions, you can enable auto-upgrade. However, please note that this might result in a brief interruption in the I/O operations of applications using PVs with Azure Container Storage during the upgrade process. To minimize potential impact, we recommend setting the auto-upgrade window to a time period with low activity or traffic, ensuring that upgrades occur during less critical times.  

To enable auto-upgrade, run the following command:

```azurecli-interactive
az k8s-extension update --cluster-name <cluster name> --resource-group <resource-group> --cluster-type managedClusters --auto-upgrade-minor-version true -n azurecontainerstorage
```

If you would like to disable auto-upgrades, run the following command:

```azurecli-interactive
az k8s-extension update --cluster-name <cluster name> --resource-group <resource-group> --cluster-type managedClusters --auto-upgrade-minor-version false -n azurecontainerstorage
```
