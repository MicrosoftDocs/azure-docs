---
title: 'Quickstart: Deploy an AKS cluster with confidential computing nodes by using the Azure CLI'
description: Learn how to create an Azure Kubernetes Service (AKS) cluster with confidential nodes and deploy a Hello World app by using the Azure CLI.
author: agowdamsft
ms.service: container-service
ms.subservice: confidential-computing
ms.topic: quickstart
ms.date: 04/08/2021
ms.author: amgowda
ms.custom: contentperf-fy21q3, devx-track-azurecli
---

# Quickstart: Deploy an AKS cluster with confidential computing nodes by using the Azure CLI

In this quickstart, you'll use the Azure CLI to deploy an Azure Kubernetes Service (AKS) cluster with confidential computing (DCsv2) nodes. You'll then run a simple Hello World application in an enclave. You can also provision a cluster and add confidential computing nodes from the Azure portal, but this quickstart focuses on the Azure CLI.

AKS is a managed Kubernetes service that enables developers or cluster operators to quickly deploy and manage clusters. To learn more, read the [AKS introduction](../aks/intro-kubernetes.md) and the [overview of AKS confidential nodes](confidential-nodes-aks-overview.md).

Features of confidential computing nodes include:

- Linux worker nodes supporting Linux containers.
- Generation 2 virtual machine (VM) with Ubuntu 18.04 VM nodes.
- Intel SGX capable CPU to help run your containers in confidentiality protected enclave leveraging Encrypted Page Cache Memory (EPC). For more information, see [Frequently asked questions for Azure confidential computing](./faq.yml).
- Intel SGX DCAP Driver preinstalled on the confidential computing nodes. For more information, see [Frequently asked questions for Azure confidential computing](./faq.yml).

> [!NOTE]
> DCsv2 VMs use specialized hardware that's subject to higher pricing and region availability. For more information, see the [available SKUs and supported regions](virtual-machine-solutions.md).

## Prerequisites

This quickstart requires:

- An active Azure subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Azure CLI version 2.0.64 or later installed and configured on your deployment machine. 

  Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](../container-registry/container-registry-get-started-azure-cli.md).
- A minimum of six DCsv2 cores available in your subscription. 

  By default, the quota for confidential computing per Azure subscription is eight VM cores. If you plan to provision a cluster that requires more than eight cores, follow [these instructions](../azure-portal/supportability/per-vm-quota-requests.md) to raise a quota-increase ticket.

## Create an AKS cluster with confidential computing nodes and add-on

Use the following instructions to create an AKS cluster with the confidential computing add-on enabled, add a node pool to the cluster, and verify what you created.

### Create an AKS cluster with a system node pool

> [!NOTE]
> If you already have an AKS cluster that meets the prerequisite criteria listed earlier, [skip to the next section](#add-a-user-node-pool-with-confidential-computing-capabilities-to-the-aks-cluster) to add a confidential computing node pool.

First, create a resource group for the cluster by using the [az group create][az-group-create] command. The following example creates a resource group named *myResourceGroup* in the *westus2* region:

```azurecli-interactive
az group create --name myResourceGroup --location westus2
```

Now create an AKS cluster, with the confidential computing add-on enabled, by using the [az aks create][az-aks-create] command:

```azurecli-interactive
az aks create -g myResourceGroup --name myAKSCluster --generate-ssh-keys --enable-addons confcom
```

### Add a user node pool with confidential computing capabilities to the AKS cluster 

Run the following command to add a user node pool of `Standard_DC2s_v2` size with three nodes to the AKS cluster. You can choose another SKU from the [list of supported DCsv2 SKUs and regions](../virtual-machines/dcv2-series.md).

```azurecli-interactive
az aks nodepool add --cluster-name myAKSCluster --name confcompool1 --resource-group myResourceGroup --node-vm-size Standard_DC2s_v2
```

After you run the command, a new node pool with DCsv2 should be visible with confidential computing add-on DaemonSets ([SGX device plug-in](confidential-nodes-aks-overview.md#confidential-computing-add-on-for-aks)).

### Verify the node pool and add-on

Get the credentials for your AKS cluster by using the [az aks get-credentials][az-aks-get-credentials] command:

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```

Use the `kubectl get pods` command to verify that the nodes are created properly and the SGX-related DaemonSets are running on DCsv2 node pools:

```console
$ kubectl get pods --all-namespaces

kube-system     sgx-device-plugin-xxxx     1/1     Running
```

If the output matches the preceding code, your AKS cluster is now ready to run confidential applications.

You can go to the [Deploy Hello World from an isolated enclave application](#hello-world) section in this quickstart to test an app in an enclave. Or use the following instructions to add more node pools on AKS. (AKS supports mixing SGX node pools and non-SGX node pools.)

## Add a confidential computing node pool to an existing AKS cluster<a id="existing-cluster"></a>

This section assumes you're already running an AKS cluster that meets the prerequisite criteria listed earlier in this quickstart.

### Enable the confidential computing AKS add-on on the existing cluster

Run the following command to enable the confidential computing add-on:

```azurecli-interactive
az aks enable-addons --addons confcom --name MyManagedCluster --resource-group MyResourceGroup 
```

### Add a DCsv2 user node pool to the cluster

> [!NOTE]
> To use the confidential computing capability, your existing AKS cluster needs to have a minimum of one node pool that's based on a DCsv2 VM SKU. To learn more about DCs-v2 VMs SKUs for confidential computing, see the [available SKUs and supported regions](virtual-machine-solutions.md).

Run the following command to create a node pool:

```azurecli-interactive
az aks nodepool add --cluster-name myAKSCluster --name confcompool1 --resource-group myResourceGroup --node-count 1 --node-vm-size Standard_DC4s_v2
```

Verify that the new node pool with the name *confcompool1* has been created:

```azurecli-interactive
az aks nodepool list --cluster-name myAKSCluster --resource-group myResourceGroup
```

### Verify that DaemonSets are running on confidential node pools

Sign in to your existing AKS cluster to perform the following verification:

```console
kubectl get nodes
```

The output should show the newly added *confcompool1* pool on the AKS cluster. You might also see other DaemonSets.

```console
$ kubectl get pods --all-namespaces

kube-system     sgx-device-plugin-xxxx     1/1     Running
```

If the output matches the preceding code, your AKS cluster is now ready to run confidential applications. 

## Deploy Hello World from an isolated enclave application <a id="hello-world"></a>
You're now ready to deploy a test application. 

Create a file named *hello-world-enclave.yaml* and paste in the following YAML manifest. You can find this sample application code in the [Open Enclave project](https://github.com/openenclave/openenclave/tree/master/samples/helloworld). This deployment assumes that you've deployed the *confcom* add-on.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: sgx-test
  labels:
    app: sgx-test
spec:
  template:
    metadata:
      labels:
        app: sgx-test
    spec:
      containers:
      - name: sgxtest
        image: oeciteam/sgx-test:1.0
        resources:
          limits:
            sgx.intel.com/epc: 5Mi # This limit will automatically place the job into a confidential computing node and mount the required driver volumes. Alternatively, you can target deployment to node pools with node selector.
      restartPolicy: Never
  backoffLimit: 0
  ```

Now use the `kubectl apply` command to create a sample job that will open in a secure enclave, as shown in the following example output:

```console
$ kubectl apply -f hello-world-enclave.yaml

job "sgx-test" created
```

You can confirm that the workload successfully created a Trusted Execution Environment (enclave) by running the following commands:

```console
$ kubectl get jobs -l app=sgx-test

NAME       COMPLETIONS   DURATION   AGE
sgx-test   1/1           1s         23s
```

```console
$ kubectl get pods -l app=sgx-test

NAME             READY   STATUS      RESTARTS   AGE
sgx-test-rchvg   0/1     Completed   0          25s
```

```console
$ kubectl logs -l app=sgx-test

Hello world from the enclave
Enclave called into host to print: Hello World!
```

## Clean up resources

To remove the confidential computing node pool that you created in this quickstart, use the following command: 

```azurecli-interactive
az aks nodepool delete --cluster-name myAKSCluster --name confcompool1 --resource-group myResourceGroup
```

To delete the AKS cluster, use the following command: 

```azurecli-interactive
az aks delete --resource-group myResourceGroup --cluster-name myAKSCluster
```

## Next steps

* Run Python, Node, or other applications through confidential containers by using the [confidential container samples in GitHub](https://github.com/Azure-Samples/confidential-container-samples).

* Run enclave-aware applications by using the [enclave-aware Azure container samples in GitHub](https://github.com/Azure-Samples/confidential-computing/blob/main/containersamples/).

<!-- LINKS -->
[az-group-create]: /cli/azure/group#az_group_create
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
