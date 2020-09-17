---
title: 'Quickstart: Deploy an Azure Kubernetes Service (AKS) cluster by using Azure CLI with confidential computing nodes'
description: Learn to create an AKS cluster with confidential nodes and deploy a simple hello world app using the Azure CLI.
author: agowdamsft
ms.service: container-compute
ms.topic: quickstart
ms.date: 9/22/2020
ms.author: amgowda
---

# Quickstart: Deploy an Azure Kubernetes Service (AKS) cluster with confidential computing nodes using Azure CLI 

Customer intent: As a developer or cluster operator, I want to quickly create an AKS cluster and deploy an application so that I can see how to run and monitor applications using the managed Kubernetes service in Azure.

In this quickstart, you will learn how to deploy an Azure Kubernetes Service (AKS) cluster with confidential computing nodes using the Azure CLI and run an hello world application in an enclave. AKS is a managed Kubernetes service that lets you quickly deploy and manage clusters. Read more about AKS [here](https://docs.microsoft.com/azure/aks/intro-kubernetes).

> [!NOTE]
> Confidential computing DCSv2 VMs leverage specialized hardware that is subject to higher pricing and region availability. For more information, see the virtual machines page for [available SKUs and supported regions](virtual-machine-solutions.md).

## Before you begin

Confidential computing nodes on AKS supports:

1. Linux Worker Nodes and Linux Containers Only
1. Ubuntu Generation 2 18.04 Virtual Machines
1. Has Encrypted Page Cache Memory (EPC) available for application scheduling. Read more [here](https://docs.microsoft.com/azure/confidential-computing/faq)
1. Kubernetes version 1.16+
1. Leverages [DCSv2 SKUs](https://docs.microsoft.com/azure/virtual-machines/dcv2-series) in the [supported regions](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines&regions=all)
1. You have an active Azure Subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin
1. You have the Azure CLI version 2.0.64 or later installed and configured (Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](#install-cli)
1. Pre-installed Intel SGX DCAP Driver. Read more [here](https://docs.microsoft.com/azure/confidential-computing/faq)
1. Have a minimum of six DCSv2 cores available in your subscription for use
1. Provisioning only through CLI during preview

> [!NOTE]
> By default, the quota for the confidential computing VM cores per Azure subscription 8 cores. If you plan to provision a cluster that requires more than 8 cores then please follow [these](https://docs.microsoft.com/azure/azure-portal/supportability/per-vm-quota-requests) instructions to raise a quota increase ticket.


## Installing the CLI pre-requisites<a id="install-cli"></a>

1. The Azure CLI, version 2.8.0 or later installed
1. The aks-preview extension version 0.4.53 or later
1. The Gen2VMPreview feature flag registered
1. The ConfCom feature flag registered

To install the aks-preview 0.4.62 extension or later, use the following Azure CLI commands:

```azurecli-interactive
az extension add --name aks-preview
az extension list
```
To update the aks-preview CLI extension, use the following Azure CLI commands:

```azurecli-interactive
az extension update --name aks-preview
```

Register the Gen2VMPreview and ConfCom features:

```azurecli-interactive
az feature register --name Gen2VMPreview --namespace Microsoft.ContainerService
az feature register --name ConfCom --namespace Microsoft.ContainerService
```
It might take several minutes for the status to show as Registered. You can check the registration status by using the 'az feature list' command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/Gen2VMPreview')].{Name:name,State:properties.state}"
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/ConfCom')].{Name:name,State:properties.state}"
```
When the status shows as registered, refresh the registration of the Microsoft.ContainerService resource provider by using the 'az provider register' command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

## Create an AKS cluster

If you already have an AKS cluster that meets the above requirements, [skip to the existing cluster section](#existing-cluster) to add a new confidential computing node pool.

First, create a resource group for the cluster using the az group create command. The following example creates a resource group name *myResourceGroup* in the *westus2* region:

```azurecli-interactive
az group create --name myResourceGroup --location westus2
```

Now create an AKS cluster using the az aks create command. The following example creates a cluster with a single node of size `Standard_DC2s_v2`. You can choose other supported list of DCsv2 SKUs from [here](https://docs.microsoft.com/azure/virtual-machines/dcv2-series):

```azurecli-interactive
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --node-vm-size Standard_DC2s_v2 \
    --node-count 3
    --addon confcom
    --network-plugin azure
    --vm-set-type VirtualMachineScaleSets
    --aks-custom-headers usegen2vm=true,confcom
```
The above command should provision a new AKS cluster with DCSv2 node pools and automatically install two daemon sets - ([SGX Device Plugin](confidential-nodes-aks-overview.md#sgx-plugin) & [SGX Quote Helper](#confidential-nodes-aks-overview.md#sgx-quote))

Get the credentials for your AKS cluster using the az aks get-credentials command:

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```
Verify the nodes are created properly and the SGX-related daemon sets are running on DCSv2 node pools using kubectl get pods & nodes command as shown below:

```console
$ kubectl get pods --all-namespaces

output
kube-system     sgx-device-plugin-xxxx     1/1     Running
```
If the output matches to the above, then your AKS cluster is now ready to run confidential applications.

Go to [Hello World from Enclave](#hello-world) deployment section to test an app in an enclave. Alternatively, follow the below instructions to add additional node pools on AKS (AKS supports mixing SGX node pools and non-SGX node pools)

>If the SGX related daemon sets are not installed on your DCSv2 node pools then run the below.

```azurecli-interactive
az aks enable-addons --addons confcom --resource-group myResourceGroup --name myAKSCluster
```

## Adding confidential computing node to existing AKS cluster<a id="existing-cluster"></a>

This section assumes you have an AKS cluster running already that meets the criteria listed in the pre-requisites section.

First, lets enable the confidential computing related AKS add-ons on the existing cluster:

```azurecli-interactive
az aks enable-addons --addons confcom --resource-group myResourceGroup --name myAKSCluster
```
Now add a DCSv2 node pool to the cluster

```azurecli-interactive
az aks nodepool add --cluster-name myAKSCluster --name confcompool1 --resource-group myResourceGroup --node-count 1 --node-vm-size Standard_DC4s_v2 --aks-custom-headers usegen2vm=true,confcom

output node pool added

Verify

az aks nodepool list --cluster-name myAKSCluster --resource-group myResourceGroup
```

```console
kubectl get nodes
```
The output should show the newly added confcompool1 on the AKS cluster.

```console
$ kubectl get pods --all-namespaces

output
kube-system     sgx-device-plugin-xxxx     1/1     Running
```
If the output matches to the above then your AKS cluster is now ready to run confidential applications.

## Hello World From the Enclave Deployment <a id="hello-world"></a>
Create a file named *hello-world-enclave.yaml* and paste the following YAML manifest. This Open Enclave based sample application code can be found in the [Open Enclave project](https://github.com/openenclave/openenclave/tree/master/samples/helloworld).

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
            kubernetes.azure.com/sgx_epc_mem_in_MiB: 10 # This limit will automatically place the job into confidential computing node. Alternatively you can target deployment to nodepools
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

Run confidential container sample applications by visiting [confidential container samples](https://github.com/Azure-Samples/confidential-container-samples).

Run Enclave aware applications by visiting [Enclave Aware Azure Container Samples](https://github.com/Azure-Samples/enclave-aware-container-samples).

<!-- LINKS - external -->
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubeflow-labs]: https://github.com/Azure/kubeflow-labs
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe
[kubectl-logs]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#logs
[kubectl delete]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#delete
[kubectl-create]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#create
[azure-pricing]: https://azure.microsoft.com/pricing/
[azure-availability]: https://azure.microsoft.com/global-infrastructure/services/
[nvidia-github]: https://github.com/NVIDIA/k8s-device-plugin

<!-- LINKS - internal -->
[az-group-create]: /cli/azure/group#az-group-create
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials

