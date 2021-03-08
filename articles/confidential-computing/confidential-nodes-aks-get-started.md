---
title: 'Quickstart: Deploy an Azure Kubernetes Service (AKS) cluster by using Azure CLI with confidential computing nodes'
description: Learn to create an AKS cluster with confidential nodes and deploy a hello world app using the Azure CLI.
author: agowdamsft
ms.service: container-service
ms.topic: quickstart
ms.date: 2/25/2020
ms.author: amgowda
---

# Quickstart: Deploy an Azure Kubernetes Service (AKS) cluster with confidential computing nodes (DCsv2) using Azure CLI

This quickstart is intended for developers or cluster operators who want to quickly create an AKS cluster and deploy an application to monitor applications using the managed Kubernetes service in Azure. You can also provision the cluster and add confidential computing nodes from Azure portal.

## Overview

In this quickstart, you'll learn how to deploy an Azure Kubernetes Service (AKS) cluster with confidential computing nodes using the Azure CLI and run a simple hello world application in an enclave. AKS is a managed Kubernetes service that lets you quickly deploy and manage clusters. Read more about AKS [here](../aks/intro-kubernetes.md).

> [!NOTE]
> Confidential computing DCsv2 VMs leverage specialized hardware that is subject to higher pricing and region availability. For more information, see the virtual machines page for [available SKUs and supported regions](virtual-machine-solutions.md).

### Confidential computing node features (DC<x>s-v2)

1. Linux Worker Nodes supporting Linux Containers
1. Generation 2 VM with Ubuntu 18.04 Virtual Machines Nodes
1. Intel SGX-based CPU with Encrypted Page Cache Memory (EPC). Read more [here](./faq.md)
1. Supporting Kubernetes version 1.16+
1. Intel SGX DCAP Driver pre-installed on the AKS Nodes. Read more [here](./faq.md)

## Deployment prerequisites
The deployment tutorial requires the below :

1. An active Azure Subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin
1. Azure CLI version 2.0.64 or later installed and configured on your deployment machine (Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](../container-registry/container-registry-get-started-azure-cli.md)
1. Minimum of six **DC<x>s-v2** cores available in your subscription for use. By default, the VM cores quota for the confidential computing per Azure subscription 8 cores. If you plan to provision a cluster that requires more than 8 cores, follow [these](../azure-portal/supportability/per-vm-quota-requests.md) instructions to raise a quota increase ticket

## Creating new AKS cluster with confidential computing nodes and add-on
Follow the below instructions to add confidential computing capable nodes with add-on.

### Step 1: Creating an AKS cluster with system node pool

If you already have an AKS cluster that meets the above requirements, [skip to the existing cluster section](#existing-cluster) to add a new confidential computing node pool.

First, create a resource group for the cluster using the az group create command. The following example creates a resource group name *myResourceGroup* in the *westus2* region:

```azurecli-interactive
az group create --name myResourceGroup --location westus2
```

Now create an AKS cluster using the az aks create command.

```azurecli-interactive
# Create a new AKS cluster with system node pool with Confidential Computing addon enabled
az aks create -g myResourceGroup --name myAKSCluster --generate-ssh-keys --enable-addon confcom
```
The above creates a new AKS cluster with system node pool with the add-on enabled. Now proceed adding a user node of Confidential Computing Nodepool type on AKS (DCsv2)

### Step 2: Adding confidential computing node pool to AKS cluster 

Run the below command to an user nodepool of `Standard_DC2s_v2` size with 3 nodes. You can choose other supported list of DCsv2 SKUs and regions from [here](../virtual-machines/dcv2-series.md):

```azurecli-interactive
az aks nodepool add --cluster-name myAKSCluster --name confcompool1 --resource-group myResourceGroup --node-vm-size Standard_DC2s_v2
```
The above command is complete a new node pool with **DC<x>s-v2** should be visible with Confidential computing add-on daemonsets ([SGX Device Plugin](confidential-nodes-aks-overview.md#sgx-plugin)
 
### Step 3: Verify the node pool and add-on
Get the credentials for your AKS cluster using the az aks get-credentials command:

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```
Verify the nodes are created properly and the SGX-related daemonsets are running on **DC<x>s-v2** node pools using kubectl get pods & nodes command as shown below:

```console
$ kubectl get pods --all-namespaces

output
kube-system     sgx-device-plugin-xxxx     1/1     Running
```
If the output matches to the above, then your AKS cluster is now ready to run confidential applications.

Go to [Hello World from Enclave](#hello-world) deployment section to test an app in an enclave. Or follow the below instructions to add additional node pools on AKS (AKS supports mixing SGX node pools and non-SGX node pools)

## Adding confidential computing node pool to existing AKS cluster<a id="existing-cluster"></a>

This section assumes you have an AKS cluster running already that meets the criteria listed in the prerequisites section (applies to add-on).

### Step 1: Enabling the confidential computing AKS add-on on the existing cluster

Run the below command to enable the confidential computing add-on

```azurecli-interactive
az aks enable-addons --addons confcom --name MyManagedCluster --resource-group MyResourceGroup 
```
### Step 2: Add **DC<x>s-v2** user node pool to the cluster
    
> [!NOTE]
> To use the confidential computing capability your existing AKS cluster need to have at minimum one **DC<x>s-v2** VM SKU based node pool. Learn more on confidential computing DCsv2 VMs SKU's here [available SKUs and supported regions](virtual-machine-solutions.md).
    
  ```azurecli-interactive
az aks nodepool add --cluster-name myAKSCluster --name confcompool1 --resource-group myResourceGroup --node-count 1 --node-vm-size Standard_DC4s_v2

output node pool added

Verify

az aks nodepool list --cluster-name myAKSCluster --resource-group myResourceGroup
```
the above command should list the recent node pool you added with the name confcompool1.

### Step 3: Verify that daemonsets are running on confidential node pools

Login to your existing AKS cluster to perform the below verification. 

```console
kubectl get nodes
```
The output should show the newly added confcompool1 on the AKS cluster.

```console
$ kubectl get pods --all-namespaces

output (you may also see other daemonsets along SGX daemonsets as below)
kube-system     sgx-device-plugin-xxxx     1/1     Running
```
If the output matches to the above, then your AKS cluster is now ready to run confidential applications. Please follow the below test application deployment.

## Hello World from isolated enclave application <a id="hello-world"></a>
Create a file named *hello-world-enclave.yaml* and paste the following YAML manifest. This Open Enclave based sample application code can be found in the [Open Enclave project](https://github.com/openenclave/openenclave/tree/master/samples/helloworld). The below deployment assumes you have deployed the addon "confcom".

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
            kubernetes.azure.com/sgx_epc_mem_in_MiB: 5 # This limit will automatically place the job into confidential computing node. Alternatively you can target deployment to nodepools
      restartPolicy: Never
  backoffLimit: 0
  ```

Now use the kubectl apply command to create a sample job that will launch in a secure enclave, as shown in the following example output:

```console
$ kubectl apply -f hello-world-enclave.yaml

job "sgx-test" created
```

You can confirm that the workload successfully created a Trusted Execution Environment (Enclave) by running the following commands:

```console
$ kubectl get jobs -l app=sgx-test
```

```console
$ kubectl get jobs -l app=sgx-test
NAME       COMPLETIONS   DURATION   AGE
sgx-test   1/1           1s         23s
```

```console
$ kubectl get pods -l app=sgx-test
```

```console
$ kubectl get pods -l app=sgx-test
NAME             READY   STATUS      RESTARTS   AGE
sgx-test-rchvg   0/1     Completed   0          25s
```

```console
$ kubectl logs -l app=sgx-test
```

```console
$ kubectl logs -l app=sgx-test
Hello world from the enclave
Enclave called into host to print: Hello World!
```

## Clean up resources

To remove the associated node pools or delete the AKS cluster, use the below commands:

Deleting the AKS cluster
``````azurecli-interactive
az aks delete --resource-group myResourceGroup --name myAKSCluster
```
Removing the confidential computing node pool

``````azurecli-interactive
az aks nodepool delete --cluster-name myAKSCluster --name myNodePoolName --resource-group myResourceGroup
``````

## Next steps

Run Python, Node etc. Applications confidentially through confidential containers by visiting [confidential container samples](https://github.com/Azure-Samples/confidential-container-samples).

Run Enclave aware applications by visiting [Enclave Aware Azure Container Samples](https://github.com/Azure-Samples/confidential-computing/blob/main/containersamples/).
