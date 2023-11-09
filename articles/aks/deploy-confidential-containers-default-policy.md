---
title: Deploy an AKS cluster with Confidential Containers (preview)
description: Learn how to create an Azure Kubernetes Service (AKS) cluster with Confidential Containers (preview) and a default security policy by using the Azure CLI.
ms.topic: quickstart
ms.date: 11/09/2023
ms.custom: devx-track-azurecli, ignite-fall-2023, mode-api, devx-track-linux
---

# Deploy an AKS cluster with Confidential Containers and a default policy

In this article, you'll use the Azure CLI to deploy an Azure Kubernetes Service (AKS) cluster and configure Confidential Containers (preview) with a default security policy. You'll then deploy an application as a Confidential container. To learn more, read the [overview of AKS Confidential Containers][overview-confidential-containers].

In general, getting started with AKS Confidential Containers involves the following steps.

* Deploy or upgrade an AKS cluster using the Azure CLI
* Add an annotation to your pod YAML manifest to mark the pod as being run as a confidential container
* Add a security policy to your pod YAML manifest
* Enable enforcement of the security policy
* Deploy your application in confidential computing

## Prerequisites

- The Azure CLI version 2.44.1 or later. Run `az --version` to find the version, and run `az upgrade` to upgrade the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

- The `aks-preview` Azure CLI extension version 0.5.169 or later.

- The `confcom` Confidential Container Security Policy Generator Azure CLI extension 2.62.2 or later. This is required to generate a [security policy][confidential-containers-security-policy].

- Register the `Preview` feature in your Azure subscription.

- AKS supports Confidential Containers (preview) on version 1.25.0 and higher.

- A workload identity and a federated identity credential. The workload identity credential enables Kubernetes applications access to Azure resources securely with Microsoft Entra ID based on annotated service accounts. If you aren't familiar with Microsoft Entra Workload ID, see the [Microsoft Entra Workload ID overview][entra-id-workload-identity-overview] and review how [Workload Identity works with AKS][aks-workload-identity-overview].

- The identity you're using to create your cluster has the appropriate minimum permissions. For more information about access and identity for AKS, see [Access and identity options for Azure Kubernetes Service (AKS)][cluster-access-and-identity-options].

- To manage a Kubernetes cluster, use the Kubernetes command-line client [kubectl][kubectl]. Azure Cloud Shell comes with `kubectl`. You can install kubectl locally using the [az aks install-cli][az-aks-install-cmd] command.

- Confidential containers on AKS provide a sidecar open source container for attestation and secure key release. The sidecar integrates with a Key Management Service (KMS), like Azure Key Vault, for releasing a key to the container group after validation is completed. Deploying an [Azure Key Vault Managed HSM][azure-key-vault-managed-hardware-security-module] (Hardware Security Module) is optional but recommended to support container-level integrity and attestation. See [Provision and activate a Managed HSM][create-managed-hsm] to deploy Managed HSM.

### Install the aks-preview Azure CLI extension

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

To install the aks-preview extension, run the following command:

```azurecli-interactive
az extension add --name aks-preview
```

Run the following command to update to the latest version of the extension released:

```azurecli-interactive
az extension update --name aks-preview
```

### Install the confcom Azure CLI extension

To install the confcom extension, run the following command:

```azurecli-interactive
az extension add --name confcom
```

Run the following command to update to the latest version of the extension released:

```azurecli-interactive
az extension update --name confcom
```

### Register the KataCcIsolationPreview feature flag

Register the `KataCcIsolationPreview` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "KataCcIsolationPreview"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature show][az-feature-show] command:

```azurecli-interactive
az feature show --namespace "Microsoft.ContainerService" --name "KataCcIsolationPreview"
```

When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace "Microsoft.ContainerService"
```

## Deploy a new cluster

1. Create an AKS cluster using the [az aks create][az-aks-create] command and specifying the following parameters:

   * **--workload-runtime**: Specify *KataCcIsolation* to enable the Confidential Containers feature on the node pool. With this parameter, these other parameters shall satisfy the following requirements. Otherwise, the command fails and reports an issue with the corresponding parameter(s).
    * **--os-sku**: *AzureLinux*. Only the Azure Linux os-sku supports this feature in this preview release.

   The following example updates the cluster named *myAKSCluster* and creates a single system node pool in the *myResourceGroup*:

   ```azurecli-interactive
   az aks create --resource-group myResourceGroup --name myAKSCluster --kubernetes-version <1.25.0 and above> --os-sku AzureLinux --workload-runtime KataCcIsolation --node-vm-size Standard_DC4as_cc_v5 --node-count 1 --enable-oidc-issuer --enable-workload-identity --generate-ssh-keys
   ```

   After a few minutes, the command completes and returns JSON-formatted information about the cluster. The cluster created in the previous step has a single node pool. In the next step, we add a second node pool to the cluster.

2. When the cluster is ready, get the cluster credentials using the [az aks get-credentials][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
    ```

3. Add a user node pool to *myAKSCluster* with two nodes in *nodepool2* in the *myResourceGroup* using the [az aks nodepool add][az-aks-nodepool-add] command.

    ```azurecli-interactive
    az aks nodepool add --resource-group myResourceGroup --name nodepool2 --cluster-name myAKSCluster --node-count 2 --os-sku AzureLinux --node-vm-size Standard_DC4as_cc_v5 
    ```

After a few minutes, the command completes and returns JSON-formatted information about the cluster.

## Deploy to an existing cluster

To use this feature with an existing AKS cluster, the following requirements must be met:

* Follow the steps to [register the KataCcIsolationPreview](#register-the-kataccisolationpreview-feature-flag) feature flag.
* Verify the cluster is running Kubernetes version 1.25.0 and higher.
* [Enable workload identity][upgrade-cluster-enable-workload-identity] on the cluster if it isn't already.

Use the following command to enable Confidential Containers (preview) by creating a node pool to host it.

1. Add a node pool to your AKS cluster using the [az aks nodepool add][az-aks-nodepool-add] command. Specify the following parameters:

   * **--resource-group**: Enter the name of an existing resource group to create the AKS cluster in.
   * **--cluster-name**: Enter a unique name for the AKS cluster, such as *myAKSCluster*.
   * **--name**: Enter a unique name for your clusters node pool, such as *nodepool2*.
   * **--workload-runtime**: Specify *KataCcIsolation* to enable the feature on the node pool. Along with the `--workload-runtime` parameter, these other parameters shall satisfy the following requirements. Otherwise, the command fails and reports an issue with the corresponding parameter(s).
     * **--os-sku**: **AzureLinux*. Only the Azure Linux os-sku supports this feature in this preview release.
   * **--node-vm-size**: Any Azure VM size that is a generation 2 VM and supports nested virtualization works. For example, [Standard_DC8as_cc_v5][DC8as-series] VMs.

   The following example adds a user node pool to *myAKSCluster* with two nodes in *nodepool2* in the *myResourceGroup*:

    ```azurecli-interactive
    az aks nodepool add --resource-group myResourceGroup --name nodepool2 –-cluster-name myAKSCluster --node-count 2 --os-sku AzureLinux --node-vm-size Standard_DC4as_cc_v5 --workload-runtime KataCcIsolation
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

2. Run the [az aks update][az-aks-update] command to enable Confidential Containers (preview) on the cluster.

    ```azurecli-interactive
    az aks update --name myAKSCluster --resource-group myResourceGroup
    ```

    After a few minutes, the command completes and returns JSON-formatted information about the cluster.

3. When the cluster is ready, get the cluster credentials using the [az aks get-credentials][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
    ```

## Pod manifest to test kata-cc runtime

The following is an example manifest YAML of a pod which consists of a container running busybox using the kata-cc runtime. This example is used later to create a pod and test functionality.

1. Create a file named *busybox.yaml*, and copy in the following manifest.

    ```yml
    apiVersion: v1
    kind: Pod
    metadata:
      labels:
        run: busybox
      name: busybox-cc
    spec:
      containers:
      - image: docker.io/library/busybox:latest
        name: busybox
      runtimeClassName: kata-cc-isolation
    ```

2. Create the pod with the [`kubectl apply`][kubectl-appy] command, as shown in the following example:

    ```bash
    kubectl apply -f busybox.yaml
    ```

## Configure container

Before you configure access to the Azure Key Vault Managed HSM and secret, and deploy an application as a Confidential container, you need to complete the configuration of the workload identity.

To configure the workload identity, perform the following steps described in the [Deploy and configure workload identity][deploy-and-configure-workload-identity] article:

* Retrieve the OIDC Issuer URL
* Create a managed identity
* Create Kubernetes service account
* Establish federated identity credential
* Deploy the sample quickstart pod application

1. After completing the steps to configure a workload identity, create a runtime class resource by copying the following YAML manifest and saving it as `kata-cc-runtime.yaml`.

    ```yml
    kind: RuntimeClass
    apiVersion: node.k8s.io/v1
    metadata:
      name: kata-cc-isolation1
      labels:
        addonmanager.kubernetes.io/mode: "Reconcile"
    handler: kata-cc
    overhead:
      podFixed:
        memory: "2Gi"
        # cpu: "250m"
    scheduling:
      nodeSelector:
        kubernetes.azure.com/kata-cc-isolation: "true"
    ```

1. Enable the cluster autoscaler feature on the cluster using the [`az aks update`][az-aks-update] commamd and scale the cluster with three nodes.

   ```azurecli-interactive
   az aks update --resource-group myResourceGroup --name myAKSCluster --enable-cluster-autoscaler --min-count 1 --max-count 3
   ```

1. Deploy the runtime class resource by running the ['kubectl apply'][kubectl-apply] command.

    ```bash
    kubectl apply -f kata-cc-runtime.yaml
    ```

1. Create a stress deployment spec by copying the following YAML manifest and saving it as `stressdeployment.yaml`. It creates a ReplicaSet to bring up four pods with the stress-ng tool.

    ```yml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: normal-deployment
      labels:
        app: normal-stress
    spec:
      replicas: 4
      selector:
        matchLabels:
          app: normal-stress
      template:
        metadata:
          name: normal-stress
          labels:
            app: normal-stress
        spec:
          runtimeClassName: kata-cc-isolation1
          containers:
          - name: normal-stress-ctr
            image: polinux/stress
            resources:
              # requests:
              #  memory: "20M"
              limits:
                cpu: 200m
                memory: "100M"
            command: ["stress"]
            args: ["--cpu","1", "--vm", "1", "--vm-bytes", "50M", "--vm-hang", "1"]
    ```

1. Create the stress deployment containers by running the [`kubectl-apply`][kubectl-apply] command.

    ```bash
    kubectl apply -f stressdeployment.yaml
    ```

1. Verify all pods are running and Kata-cc containers' resource request can trigger Kata-cc node pool auto scale using the [kubectl scale][kubectl-scale] command.

    ```bash
    kubectl scale deployment normal-deployment --replicas=10
    ```

## Cleanup

When you're finished evaluating this feature, to avoid Azure charges, clean up your unnecessary resources. If you deployed a new cluster as part of your evaluation or testing, you can delete the cluster using the [az aks delete][az-aks-delete] command.

```azurecli-interactive
az aks delete --resource-group myResourceGroup --name myAKSCluster 
```

If you enabled Confidential Containers (preview) on an existing cluster, you can remove the pod(s) using the [kubectl delete pod][kubectl-delete-pod] command.

```bash
kubectl delete pod pod-name
```

## Next steps

* Learn more about [Azure Dedicated hosts][azure-dedicated-hosts] for nodes with your AKS cluster to use hardware isolation and control over Azure platform maintenance events.

<!-- EXTERNAL LINKS -->
[kubectl-delete-pod]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#delete
[kubectl]: https://kubernetes.io/docs/reference/kubectl/
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-scale]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#scale

<!-- INTERNAL LINKS -->
[upgrade-cluster-enable-workload-identity]: workload-identity-deploy-cluster.md#update-an-existing-aks-cluster
[deploy-and-configure-workload-identity]: workload-identity-deploy-cluster.md
[install-azure-cli]: /cli/azure/install-azure-cli
[entra-id-workload-identity-overview]: ../active-directory/workload-identities/workload-identities-overview.md
[aks-workload-identity-overview]: workload-identity-overview.md
[cluster-access-and-identity-options]: concepts-identity.md
[DC8as-series]: ../virtual-machines/dcasccv5-dcadsccv5-series.md
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[az-aks-nodepool-add]: /cli/azure/aks/nodepool#az_aks_nodepool_add
[az-aks-delete]: /cli/azure/aks#az_aks_delete
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-update]: /cli/azure/aks#az_aks_update
[az-aks-install-cmd]: /cli/azure/aks#az-aks-install-cli
[overview-confidential-containers]: confidential-containers-overview.md
[azure-key-vault-managed-hardware-security-module]: ../key-vault/managed-hsm/overview.md
[create-managed-hsm]: ../key-vault/managed-hsm/quick-create-cli.md
[entra-id-workload-identity-prerequisites]: ../active-directory/workload-identities/workload-identity-federation-create-trust-user-assigned-managed-identity.md
[confidential-containers-security-policy]: ../confidential-computing/confidential-containers-aks-security-policy.md
[confidential-containers-considerations]: confidential-containers-overview.md#considerations
[azure-dedicated-hosts]: ../virtual-machines/dedicated-hosts.md