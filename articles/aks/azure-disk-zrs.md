---
title: Configure zone-redundant storage with Azure Kubernetes Service (AKS)
description: Learn how to configure zone-redundant storage with Azure disks for use with a pod in Azure Kubernetes Service (AKS) to increase its availability.
services: container-service
ms.topic: article
ms.date: 05/20/2022

---

# Create a static volume with Azure disks in Azure Kubernetes Service (AKS)

The Azure disk CSI driver v2 (preview) enhances the Azure disk CSI driver to improve scalability and reduce pod failover latency. It uses shared disks to provision attachment replicas on multiple cluster nodes and integrates with the pod scheduler to ensure a node with an attachment replica is chosen on pod failover. It is beneficial for both a single zone and multi-zone scenario using [Zone Redundant Disks](../virtual-machines/disks-redundancy.md#zone-redundant-storage-for-managed-disks).This article covers how to deploy a disk that uses zone-redundant storage (ZRS) as a redundancy option with your Azure Kubernetes Service cluster.

## Before you begin

This article assumes that you have an existing AKS cluster with 1.21 or later version. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli], [using Azure PowerShell][aks-quickstart-powershell], or [using the Azure portal][aks-quickstart-portal].

## Configure zone-redundant storage class

1. Identify the resource group name using the [az aks show][az-aks-show] command and add the `--query nodeResourceGroup` parameter. The following example gets the node resource group for the AKS cluster name *myAKSCluster* in the resource group name *myResourceGroup*:

    ```azurecli
    $ az aks show --resource-group myResourceGroup --name myAKSCluster --query nodeResourceGroup -o tsv
    
    MC_myResourceGroup_myAKSCluster_eastus
    ```

2. Get the credential for the AKS cluster using the [az aks get-credential][az-aks-get-credentials] command.

    ````azurecli
    az aks get-credentials -n $AKS_CLUSTER_NAME -g $RG
    ```

3. Confirm access to the cluster by running the following `kubectl` command:

    ```bash
    kubectl get nodes  

    NAME                                STATUS   ROLES   AGE   VERSION
    aks-nodepool1-20996793-vmss000000   Ready    agent   77s   v1.21.2
    aks-nodepool1-20996793-vmss000001   Ready    agent   72s   v1.21.2
    aks-nodepool1-20996793-vmss000002   Ready    agent   79s   v1.21.2
    ```

4. Install the Azure disk CSI driver v2 (preview) side-by-side with the v1 driver using Helm.  

    ```bash
    helm repo add azuredisk-csi-driver https://raw.githubusercontent.com/kubernetes-sigs/azuredisk-csi-driver/master/charts
    
    helm install azuredisk-csi-driver-v2 azuredisk-csi-driver/azuredisk-csi-driver \
      --namespace kube-system \
      --version v2.0.0-alpha.1 \
      --values=https://raw.githubusercontent.com/kubernetes-sigs/azuredisk-csi-driver/master/charts/v2.0.0-alpha.1/azuredisk-csi-driver/side-by-side-values.yaml
    ```

5. Verify the new storage classes were created by running the following `kubectl` command:

    ```bash
    
    kubectl get storageclasses.storage.k8s.io 
    
    NAME                    PROVISIONER                RECLAIMPOLICY   VOLUMEBINDINGMODE      ALLOWVOLUMEEXPANSION   AGE
    azuredisk-premium-ssd-lrs      disk2.csi.azure.com        Delete          WaitForFirstConsumer   true                   2m20s
    azuredisk-premium-ssd-zrs      disk2.csi.azure.com        Delete          Immediate              true                   2m20s
    azuredisk-standard-hdd-lrs     disk2.csi.azure.com        Delete          WaitForFirstConsumer   true                   2m20s
    azuredisk-standard-ssd-lrs     disk2.csi.azure.com        Delete          WaitForFirstConsumer   true                   2m20s
    azuredisk-standard-ssd-zrs     disk2.csi.azure.com        Delete          Immediate              true                   2m20s
    azurefile                      kubernetes.io/azure-file   Delete          Immediate              true                   2m30s
    azurefile-csi                  file.csi.azure.com         Delete          Immediate              true                   2m30s
    azurefile-csi-premium          file.csi.azure.com         Delete          Immediate              true                   2m30s
    azurefile-premium              kubernetes.io/azure-file   Delete          Immediate              true                   2m30s
    default (default)              disk.csi.azure.com         Delete          WaitForFirstConsumer   true                   2m30s
    managed                        kubernetes.io/azure-disk   Delete          WaitForFirstConsumer   true                   2m30s
    managed-csi-premium            disk.csi.azure.com         Delete          WaitForFirstConsumer   true                   2m30s
    managed-premium                kubernetes.io/azure-disk   Delete          WaitForFirstConsumer   true                   2m30s
    ```

6. To achieve faster pod failover and benefit from the replica mount feature of the Azure disk CSI driver v2 (preview), create a new storage class that sets the parameter for `maxShares` **> 1**. Create a YAML configuration file named *zrs-replicas-storageclass.yaml* to reference this configuration.

    ```yaml
    apiVersion: storage.k8s.io/v1
    kind: StorageClass
    metadata:
      name: azuredisk-standard-ssd-zrs-replicas
    parameters:
      cachingmode: None
      skuName: StandardSSD_ZRS
      maxShares: "2"
    provisioner: disk2.csi.azure.com
    reclaimPolicy: Delete
    volumeBindingMode: Immediate
    allowVolumeExpansion: true
    ```

7. Run the following `kubectl` command to create the zone-redundant storage class and then verify it was created. You'll reference the YAML configuration file created in the previous step:

    ```bash
    ## Create ZRS storage class 
    kubectl apply -f zrs-replicas-storageclass.yaml
    ##validate that it was created
    kubectl get sc | grep azuredisk
    ```
