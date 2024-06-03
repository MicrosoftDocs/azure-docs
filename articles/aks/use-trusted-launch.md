---
title: Trusted launch (preview) with Azure Kubernetes Service (AKS)
description: Learn how trusted launch (preview) protects the Azure Kubernetes Cluster (AKS) nodes against boot kits, rootkits, and kernel-level malware. 
ms.topic: article
ms.custom: devx-track-azurecli
ms.subservice: aks-security
ms.date: 03/08/2024
---

# Trusted launch (preview) for Azure Kubernetes Service (AKS)

[Trusted launch][trusted-launch-overview] (preview) improves the security of generation 2 virtual machines (VMs) by protecting against advanced and persistent attack techniques. It enables administrators to deploy AKS nodes, which contain the underlying virtual machines, with verified and signed bootloaders, OS kernels, and drivers. By using secure and measured boot, administrators gain insights and confidence of the entire boot chain's integrity.

This article helps you understand this new feature, and how to implement it.

## Overview

Trusted launch is composed of several, coordinated infrastructure technologies that can be enabled independently. Each technology provides another layer of defense against sophisticated threats.

- **vTPM** - Trusted launch introduces a virtualized version of a hardware [Trusted Platform Module][trusted-platform-module-overview] (TPM), compliant with the TPM 2.0 specification. It serves as a dedicated secure vault for keys and measurements. Trusted launch provides your VM with its own dedicated TPM instance, running in a secure environment outside the reach of any VM. The vTPM enables [attestation][attestation-overview] by measuring the entire boot chain of your VM (UEFI, OS, system, and drivers). Trusted launch uses the vTPM to perform remote attestation by the cloud. It is used for platform health checks and for making trust-based decisions. As a health check, trusted launch can cryptographically certify that your VM booted correctly. If the process fails, possibly because your VM is running an unauthorized component, [Microsoft Defender for Cloud][microsoft-defender-for-cloud-overview] issues integrity alerts. The alerts include details on which components failed to pass integrity checks.

- **Secure Boot** - At the root of trusted launch is Secure Boot for your VM. This mode, which is implemented in platform firmware, protects against the installation of malware-based rootkits and boot kits. Secure Boot works to ensure that only signed operating systems and drivers can boot. It establishes a "root of trust" for the software stack on your VM. With Secure Boot enabled, all OS boot components (boot loader, kernel, kernel drivers) must be signed by trusted publishers. Both Windows and select Linux distributions support Secure Boot. If Secure Boot fails to authenticate an image signed by a trusted publisher, the VM isn't allowed to boot. For more information, see [Secure Boot][secure-boot-overview].

## Before you begin

- The Azure CLI version 2.44.1 or later. Run `az --version` to find the version, and run `az upgrade` to upgrade the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

- The `aks-preview` Azure CLI extension version 1.0.0b6 or later.

- Register the `TrustedLaunchPreview` feature in your Azure subscription.

- AKS supports trusted launch (preview) on version 1.25.2 and higher.

- Trusted Launch only supports [Azure Generation 2 VMs][azure-generation-two-virtual-machines].

- Secure Boot requires signed boot loaders, OS kernels, and drivers.

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

- Cluster nodes running Windows Server operating system aren't supported.
- Trusted launch (preview) doesn't support node pools with FIPS enabled or based on ARM64.
- Availability sets aren't supported, only Virtual Machine Scale Sets.
- To enable Secure Boot on GPU node pools, you need to skip installing the GPU driver. For more information, see[Skip GPU driver installation][skip-gpu-driver-install].
- Ephemeral OS disks can be created with Trusted launch and all regions are supported. However, not all virtual machines sizes are supported. For more information, see [Trusted launch ephemeral OS sizes][tusted-launch-ephemeral-os-sizes].

## Deploy new cluster

Perform the following steps to deploy an AKS cluster using the Azure CLI.

1. Create an AKS cluster using the [az aks create][az-aks-create] command. Before running the command, review the following parameters:

   * **--name**: Enter a unique name for the AKS cluster, such as *myAKSCluster*.
   * **--resource-group**: Enter the name of an existing resource group to host the AKS cluster resource.
   * **--enable-secure-boot**: Enables Secure Boot to authenticate an image signed by a trusted publisher.
   * **--enable-vtpm**: Enables vTPM and performs attestation by measuring the entire boot chain of your VM.

   > [!NOTE]
   > Secure Boot requires signed boot loaders, OS kernels, and drivers. If after enabling Secure Boot your nodes don't start, you can verify which boot components are responsible for Secure Boot failures within an Azure Linux Virtual Machine. See [verify Secure Boot failures][verify-secure-boot-failures].

   The following example creates a cluster named *myAKSCluster* with one node in the *myResourceGroup*, and enables Secure Boot and vTPM:

    ```azurecli
    az aks create --name myAKSCluster --resource-group myResourceGroup --node-count 1 --enable-secure-boot --enable-vtpm --enable-managed-identity --generate-ssh-keys
    ```

2. Run the following command to get access credentials for the Kubernetes cluster. Use the [az aks get-credentials][az-aks-get-credentials] command and replace the values for the cluster name and the resource group name.

    ```azurecli
    az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
    ```

## Add a node pool with trusted launch enabled

Deploy a node pool with trusted launch enabled using the [az aks nodepool add][az-aks-nodepool-add] command. Before running the command, review the following parameters:

   * **--cluster-name**: Enter the name of the AKS cluster.
   * **--resource-group**: Enter the name of an existing resource group to host the AKS cluster resource.
   * **--name**: Enter a unique name for the node pool. The name of a node pool may only contain lowercase alphanumeric characters and must begin with a lowercase letter. For Linux node pools, the length must be between 1-11 characters.
   * **--node-count**: The number of nodes in the Kubernetes agent pool. Default is 3.
   * **--enable-secure-boot**: Enables Secure Boot to authenticate image signed by a trusted publisher.
   * **--enable-vtpm**: Enables vTPM and performs attestation by measuring the entire boot chain of your VM.

> [!NOTE]
> Secure Boot requires signed boot loaders, OS kernels, and drivers. If after enabling Secure Boot your nodes don't start, you can verify which boot components are responsible for Secure Boot failures within an Azure Linux Virtual Machine. See [verify Secure Boot failures][verify-secure-boot-failures].

The following example deploys a node pool with vTPM enabled on a cluster named *myAKSCluster* with three nodes:

```azurecli-interactive
az aks nodepool add --resource-group myResourceGroup -–cluster-name myAKSCluster --name mynodepool --node-count 3 --enable-vtpm  
```

The following example deploys a node pool with vTPM and Secure Boot enabled on a cluster named *myAKSCluster* with three nodes:

```azurecli-interactive
az aks nodepool add --resource-group myResourceGroup --cluster-name myAKSCluster --name mynodepool --node-count 3 --enable-vtpm --enable-secure-boot
```

## Update cluster and enable trusted launch

Update a node pool with trusted launch enabled using the [az aks nodepool update][az-aks-nodepool-update] command. Before running the command, review the following parameters:

   * **--resource-group**: Enter the name of an existing resource group hosting your existing AKS cluster.
   * **--cluster-name**: Enter a unique name for the AKS cluster, such as *myAKSCluster*.
   * **--name**: Enter the name of your node pool, such as *mynodepool*.
   * **--enable-secure-boot**: Enables Secure Boot to authenticate that the image was signed by a trusted publisher.
   * **--enable-vtpm**: Enables vTPM and performs attestation by measuring the entire boot chain of your VM.

> [!NOTE]
> The existing nodepool must be using a trusted launch image in order to enable on an existing node pool. Hence, for the nodepools created before registering the `TrustedLaunchPreview` feature, you cannot update them with trusted launch enabled.
> 
> By default, creating a node pool with a TL-compatible configuration and the feature flag registered results in a trusted launch image. Without specifying `--enable-vtpm` or `--enable-secure-boot` parameters, they are disabled by default and you can enable later using `az aks nodepool update` command.


> [!NOTE]
> Secure Boot requires signed boot loaders, OS kernels, and drivers. If after enabling Secure Boot your nodes don't start, you can verify which boot components are responsible for Secure Boot failures within an Azure Linux Virtual Machine. See [verify Secure Boot failures][verify-secure-boot-failures].

The following example updates the node pool *mynodepool* on the *myAKSCluster* in the *myResourceGroup*, and enables Secure Boot and vTPM:

```azurecli-interactive
az aks nodepool update --cluster-name myCluster --resource-group myResourceGroup --name mynodepool --enable-secure-boot --enable-vtpm 
```

## Assign pods to nodes with trusted launch enabled

You can constrain a pod and restrict it to run on a specific node or nodes, or preference to nodes with trusted launch enabled. You can control this using the following node pool selector in your pod manifest.

For a node pool running vTPM, apply the following:

```yml
spec:
  nodeSelector:
        kubernetes.azure.com/trusted-launch: true
```

For a node pool running Secure Boot, apply the following:

```yml
spec:
  nodeSelector:
        kubernetes.azure.com/secure-boot: true
```

## Disable Secure Boot

To disable Secure Boot on an AKS cluster, run the following command:

```azurecli-interactive
az aks nodepool update --cluster-name myCluster --resource-group myResourceGroup --name mynodepool --disable-secure-boot 
```

> [!NOTE]
> Updates automatically kickoff a node reimage and this operation can take several minutes per node.

## Disable vTPM

To disable vTPM on an AKS cluster, run the following command:

```azurecli-interactive
az aks nodepool update --cluster-name myCluster --resource-group myResourceGroup --name mynodepool --disable-vtpm
```

## Next steps

In this article, you learned how to enable trusted launch. Learn more about [trusted launch][trusted-launch-overview].

<!-- EXTERNAL LINKS -->

<!-- INTERNAL LINKS -->
[install-azure-cli]: /cli/azure/install-azure-cli
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
[az-aks-nodepool-add]: /cli/azure/aks/nodepool#az-aks-nodepool-add
[az-aks-nodepool-update]: /cli/azure/aks/nodepool#az-aks-nodepool-update
[azure-generation-two-virtual-machines]: ../virtual-machines/generation-2.md
[verify-secure-boot-failures]: ../virtual-machines/trusted-launch-faq.md#verifying-secure-boot-failures
[tusted-launch-ephemeral-os-sizes]: ../virtual-machines/ephemeral-os-disks.md#trusted-launch-for-ephemeral-os-disks
[skip-gpu-driver-install]: gpu-cluster.md#skip-gpu-driver-installation-preview
