---
title: 'Quickstart: Deploy an AKS cluster with Enclave Confidential Container Intel SGX nodes by using the Azure CLI'
description: Learn how to create an Azure Kubernetes Service (AKS) cluster with enclave confidential containers a Hello World app by using the Azure CLI.
author: angarg05
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.topic: quickstart
ms.date: 11/06/2023
ms.author: ananyagarg
ms.custom: devx-track-azurecli, mode-api
---

# Quickstart: Deploy an AKS cluster with confidential computing Intel SGX agent nodes by using the Azure CLI

In this quickstart, you'll use the Azure CLI to deploy an Azure Kubernetes Service (AKS) cluster with enclave-aware (DCsv2/DCSv3) VM nodes. You'll then run a simple Hello World application in an enclave. You can also provision a cluster and add confidential computing nodes from the Azure portal, but this quickstart focuses on the Azure CLI.

AKS is a managed Kubernetes service that enables developers or cluster operators to quickly deploy and manage clusters. To learn more, read the [AKS introduction](../aks/intro-kubernetes.md) and the [overview of AKS confidential nodes](confidential-nodes-aks-overview.md).

Features of confidential computing nodes include:

- Linux worker nodes supporting Linux containers.
- Generation 2 virtual machine (VM) with Ubuntu 18.04 VM nodes.
- Intel SGX capable CPU to help run your containers in confidentiality protected enclave leveraging Encrypted Page Cache Memory (EPC). For more information, see [Frequently asked questions for Azure confidential computing](./confidential-nodes-aks-faq.yml).
- Intel SGX DCAP Driver preinstalled on the confidential computing nodes. For more information, see [Frequently asked questions for Azure confidential computing](./confidential-nodes-aks-faq.yml).

> [!NOTE]
> DCsv2/DCsv3 VMs use specialized hardware that's subject region availability. For more information, see the [available SKUs and supported regions](virtual-machine-solutions-sgx.md).

## Prerequisites

This quickstart requires:

- A minimum of eight DCsv2/DCSv3/DCdsv3 cores available in your subscription.

  By default, there is no pre-assigned quota for Intel SGX VM sizes for your Azure subscriptions. You should follow [these instructions](../azure-portal/supportability/per-vm-quota-requests.md) to request for VM core quota for your subscriptions.

## Create an AKS cluster with enclave-aware confidential computing nodes and Intel SGX add-on

Use the following instructions to create an AKS cluster with the Intel SGX add-on enabled, add a node pool to the cluster, and verify what you created with hello world enclave application.

### Create an AKS cluster with a system node pool and AKS Intel SGX Addon

> [!NOTE]
> If you already have an AKS cluster that meets the prerequisite criteria listed earlier, [skip to the next section](#add-a-user-node-pool-with-confidential-computing-capabilities-to-the-aks-cluster) to add a confidential computing node pool.

Intel SGX AKS Addon "confcom" exposes the Intel SGX device drivers to your containers to avoid added changes to your pod yaml.

First, create a resource group for the cluster by using the [az group create][az-group-create] command. The following example creates a resource group named *myResourceGroup* in the *eastus2* region:

```azurecli-interactive
az group create --name myResourceGroup --location eastus2
```

Now create an AKS cluster, with the confidential computing add-on enabled, by using the [az aks create][az-aks-create] command:

```azurecli-interactive
az aks create -g myResourceGroup --name myAKSCluster --generate-ssh-keys --enable-addons confcom
```

The above command will deploy a new AKS cluster with system node pool of non confidential computing node. Confidential computing Intel SGX nodes are not recommended for system node pools.

### Add a user node pool with confidential computing capabilities to the AKS cluster<a id="add-a-user-node-pool-with-confidential-computing-capabilities-to-the-aks-cluster"></a>

Run the following command to add a user node pool of `Standard_DC4s_v3` size with three nodes to the AKS cluster. You can choose another larger sized SKU from the [list of supported DCsv2/DCsv3 SKUs and regions](../virtual-machines/dcv3-series.md).

```azurecli-interactive
az aks nodepool add --cluster-name myAKSCluster --name confcompool1 --resource-group myResourceGroup --node-vm-size Standard_DC4s_v3 --node-count 2
```

After you run the command, a new node pool with DCsv3 should be visible with confidential computing add-on DaemonSets ([SGX device plug-in](confidential-nodes-aks-overview.md#confidential-computing-add-on-for-aks)).

### Verify the node pool and add-on

Get the credentials for your AKS cluster by using the [az aks get-credentials][az-aks-get-credentials] command:

```azurecli-interactive
az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
```

Use the `kubectl get pods` command to verify that the nodes are created properly and the SGX-related DaemonSets are running on DCsv2 node pools:

```bash
kubectl get pods --all-namespaces
```

```output
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

### Add a DCsv3 user node pool to the cluster

> [!NOTE]
> To use the confidential computing capability, your existing AKS cluster needs to have a minimum of one node pool that's based on a DCsv2/DCsv3 VM SKU. To learn more about DCs-v2/Dcs-v3 VMs SKUs for confidential computing, see the [available SKUs and supported regions](virtual-machine-solutions-sgx.md).

Run the following command to create a node pool:

```azurecli-interactive
az aks nodepool add --cluster-name myAKSCluster --name confcompool1 --resource-group myResourceGroup --node-count 2 --node-vm-size Standard_DC4s_v3
```

Verify that the new node pool with the name *confcompool1* has been created:

```azurecli-interactive
az aks nodepool list --cluster-name myAKSCluster --resource-group myResourceGroup
```

### Verify that DaemonSets are running on confidential node pools

Sign in to your existing AKS cluster to perform the following verification:

```bash
kubectl get nodes
```

The output should show the newly added *confcompool1* pool on the AKS cluster. You might also see other DaemonSets.

```bash
kubectl get pods --all-namespaces
```

```output
kube-system     sgx-device-plugin-xxxx     1/1     Running
```

If the output matches the preceding code, your AKS cluster is now ready to run confidential applications.

## Deploy Hello World from an isolated enclave application <a id="hello-world"></a>

You're now ready to deploy a test application.

Create a file named *hello-world-enclave.yaml* and paste in the following YAML manifest. You can find this sample application code in the [Open Enclave project](https://github.com/openenclave/openenclave/tree/master/samples/helloworld). This deployment assumes that you've deployed the *confcom* add-on.

> [!NOTE]
> The following example pulls a public container image from Docker Hub. We recommend that you set up a pull secret to authenticate using a Docker Hub account instead of making an anonymous pull request. To improve reliability when working with public content, import and manage the image in a private Azure container registry. [Learn more about working with public images.](../container-registry/buffer-gate-public-content.md)

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: oe-helloworld
  namespace: default
spec:
  template:
    metadata:
      labels:
        app: oe-helloworld
    spec:
      containers:
      - name: oe-helloworld
        image: mcr.microsoft.com/acc/samples/oe-helloworld:latest
        resources:
          limits:
            sgx.intel.com/epc: "10Mi"
          requests:
            sgx.intel.com/epc: "10Mi"
        volumeMounts:
        - name: var-run-aesmd
          mountPath: /var/run/aesmd
      restartPolicy: "Never"
      volumes:
      - name: var-run-aesmd
        hostPath:
          path: /var/run/aesmd
  backoffLimit: 0
```

Alternatively you can also do a node pool selection deployment for your container deployments as shown below

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: oe-helloworld
  namespace: default
spec:
  template:
    metadata:
      labels:
        app: oe-helloworld
    spec:
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
            - matchExpressions:
              - key: agentpool
                operator: In
                values:
                - acc # this is the name of your confidential computing nodel pool
                - acc_second # this is the name of your confidential computing nodel pool
      containers:
      - name: oe-helloworld
        image: mcr.microsoft.com/acc/samples/oe-helloworld:latest
        resources:
          limits:
            sgx.intel.com/epc: "10Mi"
          requests:
            sgx.intel.com/epc: "10Mi"
        volumeMounts:
        - name: var-run-aesmd
          mountPath: /var/run/aesmd
      restartPolicy: "Never"
      volumes:
      - name: var-run-aesmd
        hostPath:
          path: /var/run/aesmd
  backoffLimit: 0
```

Now use the `kubectl apply` command to create a sample job that will open in a secure enclave, as shown in the following example output:

```bash
kubectl apply -f hello-world-enclave.yaml
```

```output
job "oe-helloworld" created
```

You can confirm that the workload successfully created a Trusted Execution Environment (enclave) by running the following commands:

```bash
kubectl get jobs -l app=oe-helloworld
```

```output
NAME       COMPLETIONS   DURATION   AGE
oe-helloworld   1/1           1s         23s
```

```bash
kubectl get pods -l app=oe-helloworld
```

```output
NAME             READY   STATUS      RESTARTS   AGE
oe-helloworld-rchvg   0/1     Completed   0          25s
```

```bash
kubectl logs -l app=oe-helloworld
```

```output
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

- Run Python, Node, or other applications through confidential containers using ISV/OSS SGX wrapper software. Review [confidential container samples in GitHub](https://github.com/Azure-Samples/confidential-container-samples).

- Run enclave-aware applications by using the [enclave-aware Azure container samples in GitHub](https://github.com/Azure-Samples/confidential-computing/blob/main/containersamples/).

<!-- LINKS -->
[az-group-create]: /cli/azure/group#az_group_create
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-get-credentials]: /cli/azure/aks#az_aks_get_credentials
