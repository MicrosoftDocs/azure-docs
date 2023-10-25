---
title: Troubleshooting Azure Linux Container Host for AKS kernel version issues
description: How to troubleshoot Azure Linux Container Host for AKS kernel version issues.
author: htaubenfeld
ms.author: htaubenfeld
ms.service: microsoft-linux
ms.topic: troubleshooting
ms.date: 04/18/2023
---

# Troubleshoot outdated kernel versions in Azure Linux Container Host node images
During migration or when adding new node pools to your Azure Linux Container Host, you may encounter issues with outdated kernel versions. [Azure Kubernetes Service (AKS)](../../articles/aks/intro-kubernetes.md) releases a new Azure Linux node-image every week, which is used for new node pools and as the starting image for scaling up. However, older node pools may not be updating their kernel versions as expected.

To check the KERNEL-VERSION of your node pools run: 

```azurecli-interactive
    kubectl get nodes -o wide
```

Then, compare the kernel version of your node pools with the latest kernel published on [packages.microsoft.com](https://packages.microsoft.com/cbl-mariner/).

## Symptom

A common symptom of this issue includes:
- Azure Linux nodes aren't using the latest kernel version.

## Causes

There are two primary causes for this issue: 
1. Automatic node-image upgrades weren't enabled when the node pool was created.
1. The base image that AKS uses to start clusters runs two weeks behind the latest kernel versions due to their rollout procedure.

## Solution

You can enable automatic upgrades using [GitHub Actions](../../articles/aks/node-upgrade-github-actions.md) and reboot the nodes to resolve this issue.

### Enable automatic node-image upgrades by using Azure CLI

To enable automatic node-image upgrades when deploying a cluster from az-cli, add the parameter `--auto-upgrade-channel node-image`. 

```azurecli-interactive
az aks create --name testAzureLinuxCluster --resource-group testAzureLinuxResourceGroup --os-sku AzureLinux --auto-upgrade-channel node-image
```

### Enable automatic node-image upgrades by using ARM templates

To enable automatic node-image upgrades when using an ARM template you can set the [upgradeChannel](/azure/templates/microsoft.containerservice/managedclusters?tabs=bicep&pivots=deployment-language-bicep#managedclusterautoupgradeprofile) property in `autoUpgradeProfile` to `node-image`.

```json
    autoUpgradeProfile: {
      upgradeChannel: 'node-image'
    }
```

<!--### Enable automatic node-image upgrades by using Terraform

To enable automatic node-image upgrades when using a Terraform template, you can set the [automatic_channel_upgrade](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/kubernetes_cluster#automatic_channel_upgrade) property in `azurerm_kubernetes_cluster` to `node-image`.

```json
    resource "azurerm_kubernetes_cluster" "example" {
        name                = "example-azurelinuxaks1"
        [...]
        automatic_channel_upgrade = "node-image"
        [...]
    }
```
-->
### Reboot the nodes

When updating the kernel version, you need to reboot the node to use the new kernel version. We recommend that you set up the [kured daemonset](../../articles/aks/node-updates-kured.md). [Kured](https://github.com/kubereboot/kured) to monitor your nodes for the `/var/run/reboot-required` file, drain the workload, and reboot the nodes.

## Workaround: Manual upgrades
If you need a quick workaround, you can manually upgrade the node-image on a cluster using [az aks nodepool upgrade](../../articles/aks/node-image-upgrade.md#upgrade-a-specific-node-pool). This can be done by running 

```azurecli
az aks nodepool upgrade \
    --resource-group testAzureLinuxResourceGroup \
    --cluster-name testAzureLinuxCluster \
    --name myAzureLinuxNodepool \
    --node-image-only
```

## Next steps

If the preceding steps don't resolve the issue, open a [support ticket](https://azure.microsoft.com/support/).