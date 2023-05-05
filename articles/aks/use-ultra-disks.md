---
title: Enable Ultra Disk support on Azure Kubernetes Service (AKS)
description: Learn how to enable and configure Ultra Disks in an Azure Kubernetes Service (AKS) cluster
ms.topic: article
ms.date: 03/28/2023

---

# Use Azure ultra disks on Azure Kubernetes Service

[Azure ultra disks](../virtual-machines/disks-enable-ultra-ssd.md) offer high throughput, high IOPS, and consistent low latency disk storage for your stateful applications. With ultra disks, you can dynamically change the performance of the SSD along with your workloads without the need to restart your agent nodes. Ultra disks are suited for data-intensive workloads.

## Before you begin

This feature can only be set at cluster or node pool creation time.

> [!IMPORTANT]
> Azure ultra disks require node pools deployed in availability zones and regions that support these disks and specific VM series. For more information, see the [**Ultra disks GA scope and limitations**](../virtual-machines/disks-enable-ultra-ssd.md#ga-scope-and-limitations).

### Limitations

- Ultra disks can't be used with certain features, such as availability sets or Azure Disk encryption. Review [**Ultra disks GA scope and limitations**](../virtual-machines/disks-enable-ultra-ssd.md#ga-scope-and-limitations) before proceeding.
- The supported size range for ultra disks is between *100* and *1500*.

## Create a cluster that can use ultra disks

Create an AKS cluster that can use ultra disks by enabling the `EnableUltraSSD` feature.

1. Create an Azure resource group using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    az group create --name myResourceGroup --location westus2
    ```

2. Create an AKS-managed Azure AD cluster with support for ultra disks using the [`az aks create`][az-aks-create] command with the `--enable-ultra-ssd` flag.

    ```azurecli-interactive
    az aks create -g MyResourceGroup -n myAKSCluster -l westus2 --node-vm-size Standard_D2s_v3 --zones 1 2 --node-count 2 --enable-ultra-ssd
    ```

## Enable ultra disks on an existing cluster

You can enable ultra disks on existing clusters by adding a new node pool to your cluster that support ultra disks.

- Configure a new node pool to use ultra disks using the [`az aks nodepool add`][az-aks-nodepool-add] command with the `--enable-ultra-ssd` flag.

    ```azurecli
    az aks nodepool add --name ultradisk --cluster-name myAKSCluster --resource-group myResourceGroup --node-vm-size Standard_D2s_v3 --zones 1 2 --node-count 2 --enable-ultra-ssd
    ```

## Use ultra disks dynamically with a storage class

To use ultra disks in your deployments or stateful sets, you can use a [storage class for dynamic provisioning][azure-disk-volume].

### Create the storage class

A storage class is used to define how a unit of storage is dynamically created with a persistent volume. For more information on Kubernetes storage classes, see [Kubernetes storage classes][kubernetes-storage-classes]. In this case, we'll create a storage class that references ultra disks.

1. Create a file named `azure-ultra-disk-sc.yaml` and copy in the following manifest:

    ```yaml
    kind: StorageClass
    apiVersion: storage.k8s.io/v1
    metadata:
      name: ultra-disk-sc
    provisioner: disk.csi.azure.com # replace with "kubernetes.io/azure-disk" if aks version is less than 1.21
    volumeBindingMode: WaitForFirstConsumer # optional, but recommended if you want to wait until the pod that will use this disk is created 
    parameters:
      skuname: UltraSSD_LRS
      kind: managed
      cachingMode: None
      diskIopsReadWrite: "2000"  # minimum value: 2 IOPS/GiB 
      diskMbpsReadWrite: "320"   # minimum value: 0.032/GiB
    ```

2. Create the storage class using the [`kubectl apply`][kubectl-apply] command and specify your `azure-ultra-disk-sc.yaml` file.

    ```console
    kubectl apply -f azure-ultra-disk-sc.yaml
    ```

    Your output should resemble the following example output:

    ```console
    storageclass.storage.k8s.io/ultra-disk-sc created
    ```

## Create a persistent volume claim

A persistent volume claim (PVC) is used to automatically provision storage based on a storage class. In this case, a PVC can use the previously created storage class to create an ultra disk.

1. Create a file named `azure-ultra-disk-pvc.yaml` and copy in the following manifest:

    ```yaml
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: ultra-disk
    spec:
      accessModes:
     - ReadWriteOnce
      storageClassName: ultra-disk-sc
      resources:
        requests:
          storage: 1000Gi
    ```

    The claim requests a disk named `ultra-disk` that is *1000 GB* in size with *ReadWriteOnce* access. The *ultra-disk-sc* storage class is specified as the storage class.

2. Create the persistent volume claim using the [`kubectl apply`][kubectl-apply] command and specify your `azure-ultra-disk-pvc.yaml` file.

    ```console
    kubectl apply -f azure-ultra-disk-pvc.yaml
    ```

    Your output should resemble the following example output:

    ```console
    persistentvolumeclaim/ultra-disk created
    ```

## Use the persistent volume

Once the persistent volume claim has been created and the disk successfully provisioned, a pod can be created with access to the disk. The following manifest creates a basic NGINX pod that uses the persistent volume claim named *ultra-disk* to mount the Azure disk at the path `/mnt/azure`.

1. Create a file named `nginx-ultra.yaml` and copy in the following manifest:

    ```yaml
    kind: Pod
    apiVersion: v1
    metadata:
      name: nginx-ultra
    spec:
      containers:
     - name: nginx-ultra
        image: mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 250m
            memory: 256Mi
        volumeMounts:
        - mountPath: "/mnt/azure"
          name: volume
      volumes:
        - name: volume
          persistentVolumeClaim:
            claimName: ultra-disk
    ```

2. Create the pod using [`kubectl apply`][kubectl-apply] command and specify your `nginx-ultra.yaml` file.

    ```console
    kubectl apply -f nginx-ultra.yaml
    ```

    Your output should resemble the following example output:

    ```console
    pod/nginx-ultra created
    ```

    You now have a running pod with your Azure disk mounted in the `/mnt/azure` directory.

3. See your configuration details using the `kubectl describe pod` command and specify your `nginx-ultra.yaml` file.

    ```console
    kubectl describe pod nginx-ultra
    ```

    Your output should resemble the following example output:

    ```console
    [...]
    Volumes:
      volume:
        Type:       PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)
        ClaimName:  azure-managed-disk
        ReadOnly:   false
      default-token-smm2n:
        Type:        Secret (a volume populated by a Secret)
        SecretName:  default-token-smm2n
        Optional:    false
    [...]
    Events:
      Type    Reason                 Age   From                               Message
      ----    ------                 ----  ----                               -------
      Normal  Scheduled              2m    default-scheduler                  Successfully assigned mypod to aks-nodepool1-79590246-0
      Normal  SuccessfulMountVolume  2m    kubelet, aks-nodepool1-79590246-0  MountVolume.SetUp succeeded for volume "default-token-smm2n"
      Normal  SuccessfulMountVolume  1m    kubelet, aks-nodepool1-79590246-0  MountVolume.SetUp succeeded for volume "pvc-faf0f176-8b8d-11e8-923b-deb28c58d242"
    [...]
    ```

## Using Azure tags

For more details on using Azure tags, see [Use Azure tags in AKS][use-tags].

## Next steps

- For more about ultra disks, see [Using Azure ultra disks](../virtual-machines/disks-enable-ultra-ssd.md).
- For more about storage best practices, see [Best practices for storage and backups in AKS][operator-best-practices-storage].

<!-- LINKS - external -->
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubernetes-storage-classes]: https://kubernetes.io/docs/concepts/storage/storage-classes/

<!-- LINKS - internal -->
[azure-disk-volume]: azure-disk-csi.md
[operator-best-practices-storage]: operator-best-practices-storage.md
[use-tags]: use-tags.md
[az-group-create]: /cli/azure/group#az_group_create
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-nodepool-add]: /cli/azure/aks/nodepool#az_aks_nodepool_add
