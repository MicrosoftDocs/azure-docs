---
title: Azure Container Storage Release Notes
description: Release notes for Azure Container Storage
author: khdownie
ms.service: azure-container-storage
ms.topic: release-notes
ms.date: 01/30/2026
ms.author: kendownie
# Customer intent: "As a cloud administrator, I want to review the latest release notes for Azure Container Storage so that I can stay informed about new features, bug fixes, and support status for proper planning and management of my storage deployments."
---
# Azure Container Storage release notes

This article provides the release notes for Azure Container Storage. It's important to note that minor releases introduce new functionalities in a backward-compatible manner (for example, 1.3.0 Minor Release). Patch releases focus on bug fixes, security updates, and smaller improvements (for example, 1.2.1).

## Supported versions

The following Azure Container Storage versions are supported:

| Milestone | Status |
|-----------|--------|
|2.1.0 - Minor Release | Supported |
|2.0.1 - Patch Release | Supported |
|2.0.0 - Major Release | Supported |
|1.4.0 - Minor Release | Supported |
|1.3.2 - Patch Release | Supported |
|1.3.1 - Patch Release | Supported |
|1.3.0 - Minor Release | Supported |

## Unsupported versions

The following Azure Container Storage versions are no longer supported: 1.0.6-preview, 1.0.3-preview, 1.0.2-preview, 1.0.1-preview, 1.0.0-preview. See [Upgrade a preview installation to GA](#upgrade-a-preview-installation-to-ga) for upgrading guidance.

## Major vs. minor vs. patch releases

A **major release** introduces significant changes, often including new features, architectural updates, or breaking changes; for example, moving from version 1.1.0 to 2.0.0. A **minor release** adds enhancements or new functionality that are backward-compatible, such as moving from version 1.2.0 to 1.3.0. Lastly, a **patch release** focuses on resolving critical bugs, security issues, or minor optimizations while maintaining backward compatibility, such as moving from version 1.1.1 to 1.1.2, and is intended to ensure stability and reliability without introducing new features.

## Version 2.1.0

### Improvements and new features

- **Elastic SAN integration**: Added [Elastic SAN](../elastic-san/elastic-san-introduction.md) as a supported storage type.
- **Modular installation**: Users can now selectively deploy the components required for their selected storage type. This reduces Azure Container Storage's install times and cluster footprint.
- **Node selector support**: Added node selector support for Azure Container Storage components so users can control placement on dedicated storage node pools or mixed topologies.

## Version 2.0.1

### Improvements and issues that are fixed

- Addressed a vulnerability where full customer pod details including potentially sensitive data passed through environment variables were being logged. Logging has now been restricted to pod name only to prevent exposure of sensitive information.

## Version 2.0.0

### Breaking changes

- **StoragePool custom resource removed**: Azure Container Storage version 2.0.0 eliminates the StoragePool custom resource. Users now create standard Kubernetes StorageClasses directly, aligning with native Kubernetes patterns. Existing StoragePools from version 1.x.x needs to be migrated to StorageClasses.
- **CSI driver naming changes**: The CSI driver provisioner is changed from `containerstorage.csi.azure.com` to `localdisk.csi.acstor.io` for local NVMe storage. Existing PVCs using the old provisioner needs to be recreated.
- **Annotation changes**: The ephemeral storage annotation is changed from `acstor.azure.com/accept-ephemeral-storage: "true"` to `localdisk.csi.acstor.io/accept-ephemeral-storage: "true"`.
- **No built-in Prometheus Operator**: We removed the bundled Prometheus operator to avoid conflicts with existing monitoring setups. Azure Monitor or existing Prometheus instances can now scrape metrics exposed by Azure Container Storage without deploying its own monitoring components.

### Improvements and new features

- **Improved performance with reduced resource usage**: Azure Container Storage version 2.0.0 delivers improved local NVMe performance without the need for users to configure performance tiers.
- **Smaller cluster support**: Azure Container Storage now supports clusters with just one or two nodes, removing the previous requirement of a minimum of three nodes for ephemeral drives.
- **Simplified deployment**: Azure Container Storage now runs in the kube-system namespace and no longer depends on cert-manager for webhooks, using a built-in certificate approach instead.

### Migration guidance

There are significant breaking changes in version 2.0.0. Users looking to migrate from version 1.x.x to version 2.0.0 should completely [remove prior versions](remove-container-storage-version-1.md) of Azure Container Storage and review the new setup guides to get started.

## Version 1.4.0

### Improvements and issues that are fixed

- Resolved security vulnerabilities through component updates.
- Introduced pre-upgrade and post-upgrade hooks for the Azure SAN CSI driver to better manage the CSI driver and volume attachments, ensuring seamless upgrades and preventing resource leaks.
- Fixed an issue with the etcd watcher that could cause disk pools to remain in the "Creating" status after an upgrade.
- Renamed mutating and validating webhooks to more specific names to avoid potential naming conflicts.
- Extended end-of-life support for the v1.x release series.

## Version 1.3.2

### Improvements and issues that are fixed

- Addressed security vulnerabilities with component updates.
- Cleaned dirty flag once snapshot deletion is failed.
- Fixed IO errors during detach when a pod that mounts with mountPropagation set to None restarts.
- Added enhancements of volume handling in cluster restart scenario.

## Version 1.3.1

### Improvements and issues that are fixed

- **Bug fixes and recovery improvements**: We made important updates to make etcd recovery stable and reliable. Now, the process includes enhanced retries making cluster restoration smoother and easier to manage. We fixed bugs in Azure Disks and Azure Elastic SAN storage pool creation and addressed upgrade failures caused by Kubernetes job name length limits. To improve reliability, this release fixes a failure during Azure Container Storage extension installation with Azure Elastic SAN. The issue was caused by a missing etcd certificate. Now, etcd components are only deployed when needed.
- **Expanded platform compatibility and scheduling fixes**: To improve scheduling accuracy, this release ensures Azure Container Storage pods are no longer placed on Windows nodes in mixed OS clusters. We fixed this issue by enforcing node affinity rules. Additionally, we added support for Elastic SAN on Azure Linux 3.0 nodes.
- **Safeguards to prevent storage pool deletion**: Measures are implemented to prevent the deletion of storage pools with existing persistent volumes when created through custom storage classes.
  
## Version 1.3.0

### Improvements and issues that are fixed

- **Bug fixes-Prometheus Operator**: In previous versions, some customers faced difficulties disabling Azure Container Storage’s default Prometheus operator when using a custom Prometheus deployment. This issue is fixed, allowing users to successfully turn off the built-in operator without conflict.
- **Performance Tuning for SQL-based Databases**: Running MySQL and PostgreSQL on Azure Container Storage is up to 5x faster on ephemeral disks. For more information and examples, see [PostgreSQL on AKS deployment guide](/azure/aks/postgresql-ha-overview).
  
## Version 1.2.1

### Improvements and issues that are fixed

- **Bug fixes and performance improvements**: The version improved security and resilience by addressing vulnerabilities, updating Azure Linux base images, and reinforcing container security. These updates enhance threat mitigation and compliance. 
- **Node taints toleration**: Node taints can prevent pods from being deployed on a node pool. See more information in [AKS Node Taints](/azure/aks/use-node-taints). When node taints are configured on the node pool, the installation of Azure Container Storage components is blocked. With node taints toleration, Azure Container Storage component pods can be deployed successfully without the need to temporarily remove the taints as a mitigation. This feature is built in without configuration, and is supported **only for ephemeral storage pools**.

## Version 1.2.0

### Improvements and issues that are fixed

- **Bug fixes and performance improvements**: We made general stability improvements to address key recovery issues, especially during upgrade scenarios. These updates are designed to ensure more reliable recovery processes and prevent unexpected service interruptions, delivering a smoother and more consistent experience.  
- **Ephemeral Disk Performance Enhancements**: We improved overall performance for Azure Container Storage with ephemeral NVMe disks as the backing storage option, delivering up to a 100% increase in write IOPS in setups with replication enabled. For more details, read about ephemeral disk performance [using local NVMe](/azure/storage/container-storage/use-container-storage-with-local-disk#optimize-performance-when-using-local-nvme) and [using local NVMe with replication](/azure/storage/container-storage/use-container-storage-with-local-nvme-replication#optimize-performance-when-using-local-nvme).

## Version 1.1.2

### Improvements and issues that are fixed

- **Bug fixes and performance improvements**: We improved the overall system stability by fixing general bugs and optimizing performance.
- **Security Enhancements**: This release improves security by updating package dependencies and Microsoft container images and improving container image builds to reduce dependencies.
- **Volume attachment fixes**: We also resolved an issue where volumes remained in a published state on nodes that were no longer present in the cluster, causing volume mounts to fail. This fix ensures that volumes are properly detached and reattached, allowing workloads to continue without interruptions. 

## Version 1.1.1

### Improvements and issues that are fixed

- This patch release addresses specific issues that some customers experienced during the creation of Azure Elastic SAN storage pools. It resolves exceptions that were causing disruptions in the setup process, enabling smoother and more reliable storage pool creation.
- We made improvements to cluster restart scenarios. Previously, some corner-case situations caused cluster restarts to fail. This update ensures that cluster restarts are more reliable and resilient.

## Version 1.1.0

### Improvements and issues that are fixed

- **Security Enhancements**: This update addresses vulnerabilities in container environments, enhancing security enforcement to better protect workloads. 
- **Data plane stability**: We improved the stability of data-plane components, ensuring more reliable access to Azure Container Storage volumes and storage pools. It also enhances the management of data replication between storage nodes.
- **Volume management improvements**: To improve workload stability, this update fixes volume detachment issues during node drain. Volumes now detach safely, so workloads can move without disruption or data loss.

## Azure Container Storage support policy

Azure Container Storage follows a transparent and predictable support lifecycle, which is aligned with the overall AKS extension guidance on product lifecycle and support plan. In this way, we ensure you can plan your deployments and upgrades effectively. This section outlines the lifecycle, support commitment, and Kubernetes version compatibility for each Azure Container Storage release. 

### Lifecycle and patch support

- **Major/minor releases**: Supported for 12 months from the release date. 
- **Patch releases**: Have the same end of life as the subsequent major/minor release.  

| Release version | Release Date  | End of Life | Supported Kubernetes Versions |
|-----------------|---------------|-------------|-------------------------------|
|2.1.0 - Minor Release | 02/03/2026 | 02/02/2027 | 1.33, 1.32, 1.31 |
|2.0.1 - Patch Release | 12/16/2025 | 09/09/2026 | 1.33, 1.32, 1.31 |
|1.4.0 - Minor Release | 12/16/2025 | 12/15/2026 | 1.33, 1.32, 1.31 |
|2.0.0 - Major Release | 09/10/2025 | 09/09/2026 | 1.33, 1.32, 1.31 |
|1.3.2 - Patch Release | 09/15/2025 | 04/27/2026 | 1.32, 1.31, 1.30 |
|1.3.1 - Patch Release | 07/02/2025 | 04/27/2026 | 1.32, 1.31, 1.30 |
|1.3.0 - Minor Release | 04/28/2025 | 04/27/2026 | 1.32, 1.31, 1.30 |
|1.2.1 - Patch Release | 02/10/2025 | 11/10/2025 | 1.30, 1.29, 1.28 |
|1.2.0 - Minor Release | 11/11/2024 | 11/10/2025 | 1.30, 1.29, 1.28 |
|1.1.2 - Patch Release | 10/16/2024 | 07/29/2025 | 1.29, 1.28, 1.27 |
|1.1.1 - Patch Release | 09/20/2024 | 07/29/2025 | 1.29, 1.28, 1.27 |
|1.1.0 - General Availability | 07/30/2024 | 07/29/2025 | 1.29, 1.28, 1.27 |

### Kubernetes version compatibility

Azure Container Storage aligns with AKS support for Kubernetes versions using the N-2 practice. When releasing a major or minor version, Azure Container Storage validates the latest three available Kubernetes versions in AKS and updates the supported Kubernetes versions accordingly. For each release:

- It supports the latest Kubernetes version generally available with AKS and the two prior versions. 
- If compatibility isn't possible due to deprecation or breaking API changes, the release notes explicitly call out these exceptions.

Before upgrading the Kubernetes version in your AKS cluster, we recommend checking if the version is included in the Azure Container Storage version support list. If the latest Azure Container Storage version doesn't yet support it, consider deferring the upgrade. Before upgrading in production, test your workloads with the new version of Kubernetes or its components in a staging environment.

### Important guidance for version synchronization

To maintain compatibility and avoid unvalidated combinations of Azure Container Storage and AKS: 

- All patch releases within a minor version (for example, 1.1.x) support the same Kubernetes versions as the initial minor release (for example, 1.2.1). 

- New minor releases (for example, 1.2.0 and subsequent 1.2.x) support a sliding window of Kubernetes versions, advancing to the next version with each new minor release (for example, 1.2.0 supports 1.28, 1.29, and 1.30). 

## Upgrade a preview installation to GA

If you already have a preview instance of Azure Container Storage running on your cluster, we recommend updating to the latest generally available (GA) version by running the following command: 

```azurecli-interactive
az k8s-extension update --cluster-type managedClusters --cluster-name <cluster-name> --resource-group <resource-group> --name azurecontainerstorage --version <version> --release-train stable
```

Remember to replace `<cluster-name>` and `<resource-group>` with your own values and `<version>` with the desired supported version. 

Note that preview versions are no longer supported, and customers should promptly upgrade to the GA versions to ensure continued stability and access to the latest features and fixes. If you're installing Azure Container Storage for the first time on the cluster, proceed instead to [Install Azure Container Storage and create a storage pool](container-storage-aks-quickstart-version-1.md#install-azure-container-storage-and-create-a-storage-pool). You can also [Install Azure Container Storage on specific node pools](container-storage-aks-quickstart-version-1.md#install-azure-container-storage-on-specific-node-pools).

## Auto-upgrade policy

To receive the latest features and fixes for Azure Container Storage in future versions, you can enable auto-upgrade. However, it might result in a brief interruption in the I/O operations of applications using persistent volumes with Azure Container Storage during the upgrade process. To minimize potential impact, we recommend setting the auto-upgrade window to a time period with low activity or traffic, ensuring that upgrades occur during less critical times.  

To enable auto-upgrade, run the following command:

```azurecli
# For v1.x, use azurecontainerstorage for extension name
az k8s-extension update --cluster-name <cluster name> --resource-group <resource-group> --cluster-type managedClusters --auto-upgrade-minor-version true -n azurecontainerstorage

# For v2.x, use acstor for extension name
az k8s-extension update --cluster-name <cluster name> --resource-group <resource-group> --cluster-type managedClusters --auto-upgrade-minor-version true -n acstor
```

If you'd like to disable auto-upgrades, run the following command:

```azurecli
# For v1.x, use azurecontainerstorage for extension name
az k8s-extension update --cluster-name <cluster name> --resource-group <resource-group> --cluster-type managedClusters --auto-upgrade-minor-version false -n azurecontainerstorage

# For v2.x, use acstor for extension name
az k8s-extension update --cluster-name <cluster name> --resource-group <resource-group> --cluster-type managedClusters --auto-upgrade-minor-version false -n acstor
```
