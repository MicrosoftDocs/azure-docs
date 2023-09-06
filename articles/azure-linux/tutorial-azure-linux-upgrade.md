---
title: Azure Linux Container Host for AKS tutorial - Upgrade Azure Linux Container Host nodes
description: In this Azure Linux Container Host for AKS tutorial, you will learn how to upgrade Azure Linux Container Host nodes.
author: htaubenfeld
ms.author: htaubenfeld
ms.service: microsoft-linux
ms.topic: tutorial
ms.date: 05/10/2023
---

# Tutorial: Upgrade Azure Linux Container Host nodes

The Azure Linux Container Host ships updates through two mechanisms: updated Azure Linux node images and automatic package updates.

As part of the application and cluster lifecycle, we recommend keeping your clusters up to date and secured by enabling upgrades for your cluster. To automatically keep your clusters up to date and secured, you can enable automatic node-image upgrades so your cluster will use the latest Azure Linux Container Host image when it scales up. Upgrading clusters can also be done manually.

In this tutorial, part five of five, you will learn how to:

> [!div class="checklist"]
> * Manually upgrade the node-image on a cluster.
> * Automatically upgrade an Azure Linux Container Host cluster.
> * Deploy Kured in an Azure Linux Container Host cluster.

> [!NOTE]
> Any upgrade operation, whether performed manually or automatically, will upgrade the node image version if not already on the latest. The latest version is contingent on a full AKS release, and can be determined by visiting the [AKS release tracker](../../articles/aks/release-tracker.md).

## Prerequisites

- In previous tutorials, you created and deployed an Azure Linux Container Host cluster. To complete this tutorial, you need an existing cluster. If you haven't done this step and would like to follow along, start with [Tutorial 1: Create a cluster with the Azure Linux Container Host for AKS](./tutorial-azure-linux-create-cluster.md).
- You need the latest version of Azure CLI. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Manually upgrade your cluster

To manually upgrade the node-image on a cluster, you can run `az aks nodepool upgrade`:

```azurecli
az aks nodepool upgrade \
    --resource-group testAzureLinuxResourceGroup \
    --cluster-name testAzureLinuxCluster \
    --name myAzureLinuxNodepool \
    --node-image-only
```

## Automatically upgrade your cluster

Auto-upgrade provides a set once and forget mechanism that yields tangible time and operational cost benefits. By enabling auto-upgrade, you can ensure your clusters are up to date and don't miss the latest Azure Linux Container Host features or patches from AKS and upstream Kubernetes.

Automatically completed upgrades are functionally the same as manual upgrades. The timing of upgrades is determined by the selected channel. When making changes to auto-upgrade, allow 24 hours for the changes to take effect.

To set the auto-upgrade channel on existing cluster, update the `--auto-upgrade-channel` parameter, similar to the following example which automatically upgrades the cluster to the latest supported patch release of a previous minor version.

```azurecli-interactive
az aks update --resource-group testAzureLinuxResourceGroup --name testAzureLinuxCluster --auto-upgrade-channel stable
```

For more information on upgrade channels, see [Using cluster auto-upgrade](../../articles/aks/auto-upgrade-cluster.md#use-cluster-auto-upgrade).

## Enable automatic package upgrades

Similar to setting your clusters to auto-upgrade, you can use the same set once and forget mechanism for package upgrades by enabling the node-os upgrade channel. If automatic package upgrades are enabled, the dnf-automatic systemd service runs daily and installs any updated packages that have been published.

To set the node-os upgrade channel on existing cluster, update the `--node-os-upgrade-channel` parameter, similar to the following example which automatically enables package upgrades. Note, that for some settings of [Node OS Upgrade Channel](../../articles/aks/auto-upgrade-node-image.md), `dnf-automatic` will be disabled by default.


```azurecli-interactive
az aks update --resource-group testAzureLinuxResourceGroup --name testAzureLinuxCluster --node-os-upgrade-channel Unmanaged
```

## Enable an automatic reboot daemon

To protect your clusters, security updates are automatically applied to Azure Linux nodes. These updates include OS security fixes, kernel updates, and package upgrades. Some of these updates require a node reboot to complete the process. AKS doesn't automatically reboot these nodes to complete the update process.

We recommend enabling an automatic reboot daemon such as [Kured](https://kured.dev/docs/) so that your cluster can reboot nodes that have taken kernel updates. To deploy the Kured DaemonSet in an Azure Linux Container Host cluster, see [Deploy kured in an AKS cluster](../../articles/aks/node-updates-kured.md#deploy-kured-in-an-aks-cluster)

## Clean up resources

As this tutorial is the last part of the series, you may want to delete your Azure Linux Container Host cluster. The Kubernetes nodes run on Azure virtual machines and continue incurring charges even if you don't use the cluster. Use the `az group delete` command to remove the resource group and all related resources. 

```azurecli-interactive
az group delete --name testAzureLinuxCluster --yes --no-wait
```

## Next steps

In this tutorial, you upgraded your Azure Linux Container Host cluster. You learned how to: 

> [!div class="checklist"]
> * Manually upgrade the node-image on a cluster.
> * Automatically upgrade an Azure Linux Container Host cluster.
> * Deploy kured in an Azure Linux Container Host cluster.

For more information on the Azure Linux Container Host, see the [Azure Linux Container Host overview](./intro-azure-linux.md).