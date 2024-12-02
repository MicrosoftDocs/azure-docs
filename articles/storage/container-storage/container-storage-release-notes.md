---
title: Release notes for Azure Container Storage
description: Release notes for Azure Container Storage
author: denisacatalinastan
ms.service: azure-container-storage
ms.topic: release-notes
ms.date: 09/20/2024
ms.author: dstan
---
# Release notes for Azure Container Storage

This article provides the release notes for Azure Container Storage. It's important to note that minor releases introduce new functionalities in a backward-compatible manner (for example, 1.1.0 GA). Patch releases focus on bug fixes, security updates, and smaller improvements (for example, 1.1.2).

## Supported versions

The following Azure Container Storage versions are supported: 

| Milestone | Status |
|----|----------------| 
|1.1.2- Patch Release | Supported |
|1.1.1- Patch Release | Supported |
|1.1.0- General Availability| Supported | 

## Unsupported versions

The following Azure Container Storage versions are no longer supported: 1.0.6-preview, 1.0.3-preview, 1.0.2-preview, 1.0.1-preview, 1.0.0-preview. See [Upgrade a preview installation to GA](#upgrade-a-preview-installation-to-ga) for upgrading guidance.

## Minor vs. patch versions

Minor versions introduce small improvements, performance enhancements, or minor new features without breaking existing functionality. For example, version 1.1.0 would move to 1.2.0. Patch versions are released more frequently than minor versions. They focus solely on bug fixes and security updates. For example, version 1.1.2 would be updated to 1.1.3.

## Version 1.1.2 

### Improvements and issues that are fixed 
- **Bug fixes and performance improvements**: We improved the overall system stability by fixing general bugs and optimizing performance.
- **Security Enhancements**: This release improves security by updating package dependencies and Microsoft container images and improving container image builds to reduce dependencies.
- **Volume attachment fixes**: We also resolved an issue where volumes remained in a published state on nodes that were no longer present in the cluster, causing volume mounts to fail. This fix ensures that volumes are properly detached and reattached, allowing workloads to continue without interruptions. 


## Version 1.1.1

### Improvements and issues that are fixed

- This minor release addresses specific issues that some customers experienced during the creation of Azure Elastic SAN storage pools. It resolves exceptions that were causing disruptions in the setup process, ensuring smoother and more reliable storage pool creation.
- We've also made improvements to cluster restart scenarios. Previously, some corner-case situations caused cluster restarts to fail. This update ensures that cluster restarts are more reliable and resilient.

## Version 1.1.0

### Improvements and issues that are fixed

- **Security Enhancements**: This update addresses vulnerabilities in container environments, enhancing security enforcement to better protect workloads. 
- **Data plane stability**: We've also improved the stability of data-plane components, ensuring more reliable access to Azure Container Storage volumes and storage pools. This also enhances the management of data replication between storage nodes.
- **Volume management improvements**: The update resolves issues with volume detachment during node drain scenarios, ensuring that volumes are safely and correctly detached, and allowing workloads to migrate smoothly without interruptions or data access issues.

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
