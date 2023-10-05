---
title: Install the Kubernetes Event-driven Autoscaling (KEDA) add-on using an ARM template
description: Use an ARM template to deploy the Kubernetes Event-driven Autoscaling (KEDA) add-on to Azure Kubernetes Service (AKS).
author: jahabibi
ms.topic: article
ms.custom: devx-track-azurecli, devx-track-arm-template
ms.date: 09/26/2023
ms.author: jahabibi
---

# Install the Kubernetes Event-driven Autoscaling (KEDA) add-on using an ARM template

This article shows you how to deploy the Kubernetes Event-driven Autoscaling (KEDA) add-on to Azure Kubernetes Service (AKS) using an [ARM template](../azure-resource-manager/templates/index.yml).

[!INCLUDE [Current version callout](./includes/keda/current-version-callout.md)]

## Before you begin

- You need an Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
- You need the [Azure CLI installed](/cli/azure/install-azure-cli).
- This article assumes you have an existing Azure resource group. If you don't have an existing resource group, you can create one using the [`az group create`][az-group-create] command.
- Ensure you have firewall rules configured to allow access to the Kubernetes API server. For more information, see [Outbound network and FQDN rules for Azure Kubernetes Service (AKS) clusters][aks-firewall-requirements].
- [Install the `aks-preview` Azure CLI extension](#install-the-aks-preview-azure-cli-extension).
- [Register the `AKS-KedaPreview` feature flag](#register-the-aks-kedapreview-feature-flag).
- [Create an SSH key pair](#create-an-ssh-key-pair).

### Install the `aks-preview` Azure CLI extension

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

1. Install the `aks-preview` extension using the [`az extension add`][az-extension-add] command.

    ```azurecli-interactive
    az extension add --name aks-preview
    ```

2. Update to the latest version of the `aks-preview` extension using the [`az extension update`][az-extension-update] command.

    ```azurecli-interactive
    az extension update --name aks-preview
    ```

### Register the `AKS-KedaPreview` feature flag

1. Register the `AKS-KedaPreview` feature flag using the [`az feature register`][az-feature-register] command.

    ```azurecli-interactive
    az feature register --namespace "Microsoft.ContainerService" --name "AKS-KedaPreview"
    ```

    It takes a few minutes for the status to show *Registered*.

2. Verify the registration status using the [`az feature show`][az-feature-show] command.

    ```azurecli-interactive
    az feature show --namespace "Microsoft.ContainerService" --name "AKS-KedaPreview"
    ```

3. When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider using the [`az provider register`][az-provider-register] command.

    ```azurecli-interactive
    az provider register --namespace Microsoft.ContainerService
    ```

### Create an SSH key pair

1. Navigate to the [Azure Cloud Shell](https://shell.azure.com/).
2. Create an SSH key pair using the [`az sshkey create`][az-sshkey-create] command.

    ```azurecli-interactive
    az sshkey create --name <sshkey-name> --resource-group <resource-group-name>
    ```

## Enable the KEDA add-on with an ARM template

1. Deploy the [ARM template for an AKS cluster](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.kubernetes%2Faks%2Fazuredeploy.json).
2. Select **Edit template**.
3. Enable the KEDA add-on by specifying the `workloadAutoScalerProfile` field in the ARM template, as shown in the following example:

    ```json
        "workloadAutoScalerProfile": {
            "keda": {
                "enabled": true
            }
        }
    ```

4. Select **Save**.
5. Update the required values for the ARM template:

    - **Subscription**: Select the Azure subscription to use for the deployment.
    - **Resource group**: Select the resource group to use for the deployment.
    - **Region**: Select the region to use for the deployment.
    - **Dns Prefix**: Enter a unique DNS name to use for the cluster.
    - **Linux Admin Username**: Enter a username for the cluster.
    - **SSH public key source**: Select **Use existing key stored in Azure**.
    - **Store Keys**: Select the key pair you created earlier in the article.

6. Select **Review + create** > **Create**.

## Connect to your AKS cluster

To connect to the Kubernetes cluster from your local device, you use [kubectl][kubectl], the Kubernetes command-line client.

If you use the Azure Cloud Shell, `kubectl` is already installed. You can also install it locally using the [`az aks install-cli`][az-aks-install-cli] command.

- Configure `kubectl` to connect to your Kubernetes cluster using the [`az aks get-credentials`][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials --resource-group <resource-group-name> --name <cluster-name>
    ```

## Start scaling apps with KEDA

You can autoscale your apps with KEDA using custom resource definitions (CRDs). For more information, see the [KEDA documentation][keda-scalers].

## Remove resources

- Remove the resource group and all related resources using the [`az group delete`][az-group-delete] command.

    ```azurecli-interactive
    az group delete --name <resource-group-name>
    ```

## Next steps

This article showed you how to install the KEDA add-on on an AKS cluster, and then verify that it's installed and running. With the KEDA add-on installed on your cluster, you can [deploy a sample application][keda-sample] to start scaling apps.

For information on KEDA troubleshooting, see [Troubleshoot the Kubernetes Event-driven Autoscaling (KEDA) add-on][keda-troubleshoot].

<!-- LINKS - internal -->
[az-group-delete]: /cli/azure/group#az-group-delete
[keda-troubleshoot]: /troubleshoot/azure/azure-kubernetes/troubleshoot-kubernetes-event-driven-autoscaling-add-on?context=/azure/aks/context/aks-context
[aks-firewall-requirements]: outbound-rules-control-egress.md#azure-global-required-network-rules
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[az-sshkey-create]: /cli/azure/ssh#az-sshkey-create
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[az-aks-install-cli]: /cli/azure/aks#az-aks-install-cli
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[az-group-create]: /cli/azure/group#az-group-create

<!-- LINKS - external -->
[kubectl]: https://kubernetes.io/docs/reference/kubectl/
[keda-scalers]: https://keda.sh/docs/scalers/
[keda-sample]: https://github.com/kedacore/sample-dotnet-worker-servicebus-queue
