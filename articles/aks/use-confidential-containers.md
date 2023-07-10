---
title: Confidential containers (preview) with Azure Kubernetes Service (AKS)
description: Learn about and deploy confidential containers (preview) on an Azure Kubernetes Service (AKS) cluster to maintain security and protect sensitive information.
ms.topic: article
ms.date: 07/10/2023
---

# Confidential containers (preview) with Azure Kubernetes Service (AKS)

To help secure and protect your container workloads from untrusted or potentially malicious code, as part of our Zero trust cloud architecture, AKS includes confidential containers (preview) on Azure Kubernetes Service. Confidential containers is based on Kata confidential containers to encrypt container memory, and prevent data in memory during computation from being in clear text, readable format. Together with [Pod Sandboxing][pod-sandboxing-overview], you can run sensitive workloads at this isolation level in Azure to achieve the following security goals:

* Helps application owners protect data by enforcing application security requirements (for example, deny access to Azure tenant admin, Kubernetes admin, etc).
* Help protects your data from Cloud Service Providers (CSPs)

Together with other security measures or data protection controls, as part of your overall architecture, helps you meet regulatory, industry, or governance compliance requirements for securing sensitive information.

This article helps you understand this new feature, and how to implement it.

## Supported scenarios

Confidential containers (preview) are appropriate for deployment scenarios that involve sensitive data, for instance, personally identifiable information (PII) or any data with strong security needed for regulatory compliance. Some examples of common scenarios with containers are:

- Privacy preserving big data analytics using Apache Spark analytics job for fraud pattern recognition in the financial sector.
- Running self-hosted GitHub runners to secure code signing as part of Continuous Integration and Continuous Deployment (CI/CD) DevOps practices.
- Machine Learning inferencing and training of ML models, using an encrypted data set from a trusted source and only decrypting inside a confidential container environment, for purposes of privacy preserving ML inference.
- Building big data clean rooms for ID matching as part of multi-party computation in industries like retail with digital advertising.
- Building confidential computing zero trust landing zones to meet privacy regulations for application migrations to cloud.

## Prerequisites

- The Azure CLI version 2.44.1 or later. Run `az --version` to find the version, and run `az upgrade` to upgrade the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

- The `aks-preview` Azure CLI extension version 0.5.123 or later.

- Register the `Preview` feature in your Azure subscription.

- AKS supports Confidential Containers (preview) on version 1.24.0 and higher.

- To manage a Kubernetes cluster, use the Kubernetes command-line client [kubectl][kubectl]. Azure Cloud Shell comes with `kubectl`. You can install kubectl locally using the [az aks install-cli][az-aks-install-cmd] command.

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

### Register the <namePreview> feature flag

Register the `namePreview` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "namePreview"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature show][az-feature-show] command:

```azurecli-interactive
az feature show --namespace "Microsoft.ContainerService" --name "namePreview"
```

When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace "Microsoft.ContainerService"
```

## Limitations

The following are constraints with this preview of Confidential Containers (preview):

* 

## How it works


## Deploy new cluster

Perform the following steps to deploy an AKS cluster using the Azure CLI.

1. Create an AKS cluster using the [az aks create][az-aks-create] command and specifying the following parameters:

   * **--workload-runtime**: Specify *KataCcIsolation* to enable the Confidential Containers feature on the node pool. With this parameter, these other parameters shall satisfy the following requirements. Otherwise, the command fails and reports an issue with the corresponding parameter(s).
    * **--os-sku**: *Mariner*. Only the Mariner os-sku supports this feature in this preview release.
    * **--node-vm-size**: Any Azure VM size that is a generation 2 VM and supports nested virtualization works. For example, [Dsv3][dv3-series] VMs.

   The following example creates a cluster named *myAKSCluster* with one node in the *myResourceGroup*:

    ```azurecli-interactive
    az aks create --resource-group myResourceGroup --name myManagedCluster –kubernetes-version <1.24.0 and above> --os-sku Mariner –-node-vm-size <VM sizes capable of nested SNP VM> --workload-runtime <kataCcIsolation>
    ```

2. Run the following command to get access credentials for the Kubernetes cluster. Use the [az aks get-credentials][aks-get-credentials] command and replace the values for the cluster name and the resource group name.

    ```azurecli-interactive
    az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
    ```

3. List all Pods in all namespaces using the [kubectl get pods][kubectl-get-pods] command.

    ```bash
    kubectl get pods --all-namespaces
    ```

## Deploy to an existing cluster

To use this feature with an existing AKS cluster, the following requirements must be met:

* Follow the steps to [register the namePreview][register-the-name-preview-feature-flag] feature flag.
* Verify the cluster is running Kubernetes version 1.24.0 and higher.

Use the following command to enable Confidential Containers (preview) by creating a node pool to host it.

1. Add a node pool to your AKS cluster using the [az aks nodepool add][az-aks-nodepool-add] command. Specify the following parameters:

   * **--resource-group**: Enter the name of an existing resource group to create the AKS cluster in.
   * **--cluster-name**: Enter a unique name for the AKS cluster, such as *myAKSCluster*.
   * **--name**: Enter a unique name for your clusters node pool, such as *nodepool2*.
   * **--workload-runtime**: Specify *KataMshvVmIsolation* to enable the Pod Sandboxing feature on the node pool. Along with the `--workload-runtime` parameter, these other parameters shall satisfy the following requirements. Otherwise, the command fails and reports an issue with the corresponding parameter(s).
     * **--os-sku**: *NestedSNPACCVM*. Only the Azure Linux os-sku supports this feature in the preview release.

   The following example adds a node pool to *myAKSCluster* with one node in *nodepool2* in the *myResourceGroup*:

    ```azurecli-interactive
    az aks nodepool add --resource-group myResourceGroup --name myManagedCluster –-cluster-name myCluster --os-sku NestedSNPACCVM SKU
    ```

2. Run the [az aks update][az-aks-update] command to enable pod sandboxing (preview) on the cluster.

    ```azurecli-interactive
    az aks update --name myAKSCluster --resource-group myResourceGroup
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
[kata-containers-overview]: https://katacontainers.io/
[kubectl]: https://kubernetes.io/docs/reference/kubectl/
[azurerm-azurelinux]: https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/kubernetes_cluster_node_pool#os_sku
[kubectl-get-pods]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubectl-exec]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#exec
[container-resource-manifest]: https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/
[kubectl-delete-pod]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#delete
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kata-network-limitations]: https://github.com/kata-containers/kata-containers/blob/main/docs/Limitations.md#host-network
[cloud-hypervisor]: https://www.cloudhypervisor.org
[kata-container]: https://katacontainers.io 

<!-- INTERNAL LINKS -->
[pod-sandboxing-overview]: use-pod-sandboxing.md
