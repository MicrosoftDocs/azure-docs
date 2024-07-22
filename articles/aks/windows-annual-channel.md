---
title: Use Windows Annual Channel for Containers on Azure Kubernetes Service (AKS)
description: Learn about Windows Annual Channel for Containers for Windows containers on Azure Kubernetes Service (AKS).
ms.service: azure-kubernetes-service
ms.custom: windows-related-content
ms.author: allyford
author: schaffererin
ms.topic: how-to
ms.date: 07/01/2024
---

# Use Windows Annual Channel for Containers on Azure Kubernetes Service (AKS) (Preview)

AKS supports [Windows Server Annual Channel for Containers](https://techcommunity.microsoft.com/t5/windows-server-news-and-best/windows-server-annual-channel-for-containers/ba-p/3866248) in public preview. Each channel version is released annually and is supported for *two years*. This channel is beneficial if you require increased innovation cycles and portability.

Windows Annual Channel versions are based on the Kubernetes version of your node pool. To upgrade from one Annual Channel version to the next, you can [upgrade to a Kubernetes version][upgrade-aks-cluster] that supports the next Annual Channel version.

[!INCLUDE [preview features callout](~/reusable-content/ce-skilling/azure/includes/aks/includes/preview/preview-callout.md)]

## Supported Annual Channel releases

AKS releases support for new releases of Windows Server Annual Channel for Containers in alignment with Kubernetes versions. For the latest updates, see the [AKS release notes][release-notes]. The following table provides an estimated release schedule for upcoming Annual Channel releases:

|  K8s version | Annual Channel (host) version | Container image supported | End of support date |
|--------------|-------------------|-------------------|-------------------|
| 1.28 | 23H2 (preview only) | Windows Server 2022 | End of 1.30 support |
| 1.31 | 24H2 | Windows Server 2022 & Windows Server 2025 | End of 1.34 support |
| 1.35 | 25H2 | Windows Server 2025 | End of 1.38 support |

## Windows Annual Channel vs. Long Term Servicing Channel Releases (LTSC)

AKS supports Long Term Servicing Channel Releases (LTSC), including Windows Server 2022 and Windows Server 2019. These come from a different release channel than Windows Server Annual Channel for Containers. To view our current recommendations, see the [Windows best practices documentation][windows-best-practices].

> [!NOTE]
> Windows Server 2019 will retire after Kubernetes version 1.32 reaches end of life, and Windows Server 2022 will retire after Kubernetes version 1.34 reaches end of life. For more information, see the [AKS release notes][release-notes].

The following table compares Windows Annual Channel and Long Term Servicing Channel releases:

| Channel | Support | Upgrades |
|---------|---------|----------|
| Long Term Servicing Channel (LTSC) | LTSC channels are released every three years and are supported for five years. This channel is recommended for customers using Long Term Support. | To upgrade from one release to the next, you need to migrate your node pools to a new OS SKU option and rebuild your container images with the new OS version. |
| Annual Channel for Containers | Annual Channel releases occur annually and are supported for two years. | To upgrade to the latest release, you can upgrade the Kubernetes version of your node pool. |

## Before you begin

* You need the Azure CLI version 2.56.0 or later installed and configured to set `os-sku` to `WindowsAnnual` with the `az aks nodepool add` command. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

### Limitations

* Windows Annual Channel doesn't support Azure Network Policy Manager (NPM).

### Install the `aks-preview` Azure CLI extension

* Register or update the aks-preview extension using the [`az extension add`][az-extension-add] or [`az extension update`][az-extension-update] command.

    ```azurecli-interactive
    # Register the aks-preview extension
    az extension add --name aks-preview
    # Update the aks-preview extension
    az extension update --name aks-preview
    ```

### Register the `AKSWindowsAnnualPreview` feature flag

1. Register the `AKSWindowsAnnualPreview` feature flag using the [`az feature register`][az-feature-register] command.

    ```azurecli-interactive
    az feature register --namespace "Microsoft.ContainerService" --name "WindowsAnnualPreview"
    ```

    It takes a few minutes for the status to show *Registered*.

2. Verify the registration status using the [`az feature show`][az-feature-show] command.

    ```azurecli-interactive
    az feature show --namespace "Microsoft.ContainerService" --name "AKSWindowsAnnualPreview"
    ```

3. When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider using the [`az provider register`][az-provider-register] command.

    ```azurecli-interactive
    az provider register --namespace Microsoft.ContainerService
    ```

## Use Windows Annual Channel for Containers on AKS

To use Windows Annual Channel on AKS, specify the following parameters:

* `os-type` set to `Windows`
* `os-sku` set to `WindowsAnnual`

Windows Annual Channel versions are based on the Kubernetes version of your node pool. To check which release you'll get based on the Kubernetes version of your node pool, see the [supported Annual Channel releases](#supported-annual-channel-releases).

### Create a new Windows Annual Channel node pool

#### [Azure CLI](#tab/azure-cli)

* Create a Windows Annual Channel node pool using the [`az aks nodepool add`][az-aks-nodepool-add] command. The following example creates a Windows Annual Channel node pool with the 23H2 release:

    ```azurecli-interactive
    az aks nodepool add \
        --resource-group $RESOURCE_GROUP_NAME \
        --cluster-name $CLUSTER_NAME \
        --os-type Windows \
        --os-sku WindowsAnnual \
        --kubernetes-version 1.29
        --name $NODE_POOL_NAME \
        --node-count 1
    ```

    > [!NOTE]
    > If you don't specify the Kubernetes version during node pool creation, AKS uses the same Kubernetes version as your cluster.

#### [Azure PowerShell](#tab/azure-powershell)

* Create a Windows Annual Channel node pool using the [`New-AzAksNodePool`][new-azaksnodepool] cmdlet.

    ```azurepowershell
    New-AzAksNodePool -ResourceGroupName $RESOURCE_GROUP_NAME `
        -ClusterName $CLUSTER_NAME `
        -VmSetType VirtualMachineScaleSets `
        -OsType Windows `
        -OsSKU WindowsAnnual `
        -Name $NODE_POOL_NAME
    ```

---

### Verify Windows Annual Channel node pool creation

* Verify Windows Annual Channel node pool creation by checking the OS SKU of your node pool using `kubectl describe node` command.

    ```bash
    kubectl describe node $NODE_POOL_NAME
    ```

    If you successfully created a Windows Annual Channel node pool, you should see the following output:

    ```output
    Name:               npwin
    Roles:              agent
    Labels:             agentpool=npwin
    ...
                        kubernetes.azure.com/os=windows
    ...
                        kubernetes.azure.com/node-image-version=AKSWindows-23H2-gen2
    ...
                        kubernetes.azure.com/os-sku=WindowsAnnual
    ```

### Upgrade an existing node pool to Windows Annual Channel

You can upgrade an existing node pool from an LTSC release to Windows Annual Channel by following the guidance in [Upgrade the OS version for your Azure Kubernetes Service (AKS) Windows workloads][upgrade-windows-os].

To upgrade from one Annual Channel version to the next, you can [upgrade to a Kubernetes version][upgrade-aks-cluster] that supports the next Annual Channel version.

## Next steps

To learn more about Windows Containers on AKS, see the following resources:

> [!div class="nextstepaction"]
> [Windows best practices][windows-best-practices]
> [Windows FAQ][windows-faq]

<!--- LINKS --->
[windows-best-practices]: ./windows-best-practices.md
[windows-FAQ]: ./windows-faq.md
[upgrade-aks-cluster]: ./upgrade-aks-cluster.md
[upgrade-windows-os]: ./upgrade-windows-os.md
[install-azure-cli]: /cli/azure/install-azure-cli
[az-extension-add]: /cli/azure/azure-cli-extensions-overview#add-extensions
[az-extension-update]: /cli/azure/azure-cli-extensions-overview#update-extensions
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-show]: /cli/azure/feature#az_feature_show
[az-provider-register]: /cli/azure/provider#az_provider_register
[az-aks-nodepool-add]: /cli/azure/aks/nodepool#az-aks-nodepool-add
[new-azaksnodepool]: /powershell/module/az.aks/new-azaksnodepool
[release-notes]: https://github.com/Azure/AKS/releases
