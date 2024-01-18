---
title: Trusted launch (preview) with Azure Kubernetes Service (AKS)
description: Learn how trusted launch (preview) protects the Azure Kubernetes Cluster (AKS) nodes against boot kits, rootkits, and kernel-level malware. 
ms.topic: article
ms.date: 01/17/2024

---

# Trusted launch (preview) for Azure Kubernetes Service (AKS)

[Trusted launch][trusted-launch-overview] (preview) improves the security of generation 2 virtual machines (VMs) by protecting against advanced and persistent attack techniques. It enables administrators to deploy AKS nodes, which contain the underlying virtual machines, with verified and signed bootloaders, OS kernels, and drivers. By leveraging secure and measured boot, administrators gain insights and confidence of the entire boot chain's integrity.

This article helps you understand this new feature, and how to implement it.

## Overview

Trusted launch is composed of several, coordinated infrastructure technologies that can be enabled independently. Each technology provides another layer of defense against sophisticated threats.

- **Secure Boot** - At the root of trusted launch is Secure Boot for your VM. This mode, which is implemented in platform firmware, protects against the installation of malware-based rootkits and boot kits. Secure Boot works to ensure that only signed operating systems and drivers can boot. It establishes a "root of trust" for the software stack on your VM. With Secure Boot enabled, all OS boot components (boot loader, kernel, kernel drivers) must be signed by trusted publishers. Both Windows and select Linux distributions support Secure Boot. If Secure Boot fails to authenticate that the image was signed by a trusted publisher, the VM will not be allowed to boot. For more information, see [Secure Boot][secure-boot-overview].
- **vTPM** - Trusted launch also introduces vTPM for Azure VMs. This is a virtualized version of a hardware [Trusted Platform Module][trusted-platform-module-overview], compliant with the TPM2.0 spec. It serves as a dedicated secure vault for keys and measurements. Trusted launch provides your VM with its own dedicated TPM instance, running in a secure environment outside the reach of any VM. The vTPM enables [attestation][attestation-overview] by measuring the entire boot chain of your VM (UEFI, OS, system, and drivers). Trusted launch uses the vTPM to perform remote attestation by the cloud. This is used for platform health checks and for making trust-based decisions. As a health check, trusted launch can cryptographically certify that your VM booted correctly. If the process fails, possibly because your VM is running an unauthorized component, [Microsoft Defender for Cloud][microsoft-defender-for-cloud-overview] issue sintegrity alerts. The alerts include details on which components failed to pass integrity checks.

## Prerequisites

- The Azure CLI version 2.44.1 or later. Run `az --version` to find the version, and run `az upgrade` to upgrade the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

- The `aks-preview` Azure CLI extension version 0.5.123 or later.

- Register the `TrustedLaunchPreview` feature in your Azure subscription.

- AKS supports trusted launch (preview) on version 1.25.2 and higher.

### Install the aks-preview Azure CLI extension

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

To install the aks-preview extension, run the following command:

```azurecli
az extension add --name aks-preview
```

Run the following command to update to the latest version of the extension released:

```azurecli
az extension update --name aks-preview
```

### Register the TrustedLaunchPreview feature flag

Register the `TrustedLaunchPreview` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "TrustedLaunchPreview"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature show][az-feature-show] command:

```azurecli-interactive
az feature show --namespace "Microsoft.ContainerService" --name "TrustedLaunchPreview"
```

When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace "Microsoft.ContainerService"
```

## Limitations

- Cluster nodes running Windows Server 2019 and higher operating system are not supported.

## Deploy new cluster

Perform the following steps to deploy an AKS cluster using the Azure CLI.

1. Create an AKS cluster using the [az aks create][az-aks-create] command. Before running the command, review the following parameters:

   * **--name**: Enter a unique name for the AKS cluster, such as *myAKSCluster*.
   * **--resource-group**: Enter the name of an existing resource group to create the AKS cluster in.
   * **--enable-secure-boot**: Enables Secure Boot to authenticate that the image was signed by a trusted publisher.
   * **--enable-vtpm**: Enables vTPM and performs attestation by measuring the entire boot chain of your VM.

   The following example creates a cluster named *myAKSCluster* with one node in the *myResourceGroup* and enables Secure Boot:

    ```azurecli
    az aks create --name myAKSCluster --resource-group myResourceGroup --enable-secure-boot --enable-managed-identity --generate-ssh-keys
    ```

   The following example creates a cluster named *myAKSCluster* with one node in the *myResourceGroup*, and enables Secure Boot and vTPM:

    ```azurecli
    az aks create --name myAKSCluster --resource-group myResourceGroup --enable-secure-boot --enable-vtpm --enable-managed-identity --generate-ssh-keys
    ```

2. Run the following command to get access credentials for the Kubernetes cluster. Use the [az aks get-credentials][az-aks-get-credentials] command and replace the values for the cluster name and the resource group name.

    ```azurecli
    az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
    ```

## Add a node pool with trusted launch enabled

Deploy a node pool with trusted launch enabled using the [az aks nodepool add][az-aks-nodepool-add] command. Before running the command, review the following parameters:

   * **--cluster-name**: Enter the name of the AKS cluster.
   * **--resource-group**: Enter the name of an existing resource group that the AKS cluster is created in.
   * **--name**: Enter a unique name for the node pool. The name of a node pool may only contain lowercase alphanumeric characters and must begin with a lowercase letter. For Linux node pools, the length must be between 1-11 characters.
   * **--node-count**: The number of nodes in the Kubernetes agent pool. Default is 3.
   * **--enable-secure-boot**: Enables Secure Boot to authenticate that the image was signed by a trusted publisher.
   * **--enable-vtpm**: Enables vTPM and performs attestation by measuring the entire boot chain of your VM.

The following example deploys a node pool with vTMP enabled on a cluster named *myAKSCluster* with three nodes:

```azurecli-interactive
az aks nodepool add –resource-group myResourceGroup –cluster-name myAKSCluster –name mynodepool –node-count 3 –enable-vtpm  
```

The following example deploys a node pool with vTPM and Secure Boot enabled on a cluster named *myAKSCluster* with three nodes:

```azurecli-interactive
az aks nodepool add –resource-group myResourceGroup –cluster-name myAKSCluster –name mynodepool –node-count 3 –enable-vtpm –enable-secure-boot
```

## Update cluster and enable trusted launch

Update a node pool with trusted launch enabled using the [az aks nodepool update][az-aks-nodepool-update] command. Before running the command, review the following parameters:

   * **--resource-group**: Enter the name of an existing resource group hosting your existing AKS cluster.
   * **--cluster-name**: Enter a unique name for the AKS cluster, such as *myAKSCluster*.
   * **--name**: Enter the name of your node pool, such as *mynodepool*.
   * **--enable-secure-boot**: Enables Secure Boot to authenticate that the image was signed by a trusted publisher.
   * **--enable-vtpm**: Enables vTPM and performs attestation by measuring the entire boot chain of your VM.

The following example updates the node pool *mynodepool* on the *myAKSCluster* in the *myResourceGroup* and enables Secure Boot:

```azurecli-interactive
az aks nodepool update --cluster-name myCluster --resource-group myResourceGroup --name mynodepool --enable-secure-boot 
```

The following example updates the node pool *mynodepool* on the *myAKSCluster* in the *myResourceGroup*, and enables Secure Boot and vTPM:

```azurecli-interactive
az aks nodepool update --cluster-name myCluster --resource-group myResourceGroup --name mynodepool --enable-secure-boot --enable-vtpm 
```

## Disable Secure Boot

To disable Secure Boot on an AKS cluster, run the following command:

```azurecli-interactive
az aks nodepool update –cluster-name myCluster –g myResourceGroup –n mynodepool –disable-secure-boot 
```

> [!NOTE]
> Updates do not automatically kickoff node reimage. You need to restart nodes for the update process to complete.

## Disable vTPM

To disable vTPM on an AKS cluster, run the following command:

```azurecli-interactive
az aks nodepool update –cluster-name myCluster –g myResourceGroup –n mynodepool –disable-secure-boot –disable-vtpm
```

## Next steps

In this article, you learned how to enable trusted launch. Learn more about [trusted launch][trusted-launch-overview] and [Boot integrity monitoring][boot-integrity-monitoring] VMs.

<!-- EXTERNAL LINKS -->

<!-- INTERNAL LINKS -->
[install-azure-cli]: /cli/azu
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[trusted-launch-overview]: ../virtual-machines/trusted-launch.md
[secure-boot-overview]: /windows-hardware/design/device-experiences/oem-secure-boot
[trusted-platform-module-overview]: /windows/security/information-protection/tpm/trusted-platform-module-overview
[attestation-overview]: /windows/security/information-protection/tpm/tpm-fundamentals#measured-boot-with-support-for-attestation
[microsoft-defender-for-cloud-overview]: ../defender-for-cloud/defender-for-cloud-introduction.md
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-nodepool-update]: /cli/azure/aks/nodepool#az-aks-nodepool-update
[boot-integrity-monitoring]: ../virtual-machines/boot-integrity-monitoring-overview.md