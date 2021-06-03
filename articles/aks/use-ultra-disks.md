---
title: Enable Ultra Disk support on Azure Kubernetes Service (AKS)
description: Learn how to enable and configure Ultra Disks in an Azure Kubernetes Service (AKS) cluster
services: container-service
ms.topic: article
ms.date: 07/10/2020

---

# Use Azure ultra disks on Azure Kubernetes Service (preview)

[Azure ultra disks](../virtual-machines/disks-enable-ultra-ssd.md) offer high throughput, high IOPS, and consistent low latency disk storage for your stateful applications. One major benefit of ultra disks is the ability to dynamically change the performance of the SSD along with your workloads without the need to restart your agent nodes. Ultra disks are suited for data-intensive workloads.

## Before you begin

This feature can only be set at cluster creation or node pool creation time.

> [!IMPORTANT]
> Azure ultra disks require nodepools deployed in availability zones and regions that support these disks as well as only specific VM series. See the [**Ultra disks GA scope and limitations**](../virtual-machines/disks-enable-ultra-ssd.md#ga-scope-and-limitations).

### Register the `EnableUltraSSD` preview feature

To create an AKS cluster or a node pool that can leverage Ultra disks, you must enable the `EnableUltraSSD` feature flag on your subscription.

Register the `EnableUltraSSD` feature flag using the [az feature register][az-feature-register] command as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "EnableUltraSSD"
```

It takes a few minutes for the status to show *Registered*. You can check on the registration status using the [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/EnableUltraSSD')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the *Microsoft.ContainerService* resource provider using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

### Install aks-preview CLI extension

To create an AKS cluster or a node pool that can use Ultra Disks, you need the latest *aks-preview* CLI extension. Install the *aks-preview* Azure CLI extension using the [az extension add][az-extension-add] command, or install any available updates using the [az extension update][az-extension-update] command:

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview
``` 

### Limitations
- See the [**Ultra disks GA scope and limitations**](../virtual-machines/disks-enable-ultra-ssd.md#ga-scope-and-limitations)
- The supported size range for a Ultra disks is between 100 and 1500

## Create a new cluster that can use Ultra disks

Create an AKS cluster that is able to leverage Ultra Disks by using the following CLI commands. Use the `--aks-custom-headers` flag to set the `EnableUltraSSD` feature.

Create an Azure resource group:

```azurecli-interactive
# Create an Azure resource group
az group create --name myResourceGroup --location westus2
```

Create the AKS cluster with support for Ultra Disks.

```azurecli-interactive
# Create an AKS-managed Azure AD cluster
az aks create -g MyResourceGroup -n MyManagedCluster -l westus2 --node-vm-size Standard_L8s_v2 --zones 1 2 --node-count 2 --aks-custom-headers EnableUltraSSD=true
```

If you want to create clusters without ultra disk support, you can do so by omitting the custom `--aks-custom-headers` parameter.

## Enable Ultra disks on an existing cluster

You can enable ultra disks on existing clusters by adding a new node pool to your cluster that support ultra disks. Configure a new node pool to use ultra disks by using the `--aks-custom-headers` flag.

```azurecli
az aks nodepool add --name ultradisk --cluster-name myAKSCluster --resource-group myResourceGroup --node-vm-size Standard_L8s_v2 --zones 1 2 --node-count 2 --aks-custom-headers EnableUltraSSD=true
```

If you want to create new node pools without support for ultra disks, you can do so by omitting the custom `--aks-custom-headers` parameter.

## Use ultra disks dynamically with a storage class

To use ultra disks in our deployments or stateful sets you can use a [storage class for dynamic provisioning](azure-disks-dynamic-pv.md).

### Create the storage class

A storage class is used to define how a unit of storage is dynamically created with a persistent volume. For more information on Kubernetes storage classes, see [Kubernetes Storage Classes][kubernetes-storage-classes].

In this case, we'll create a storage class that references ultra disks. Create a file named `azure-ultra-disk-sc.yaml`, and copy in the following manifest.

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: ultra-disk-sc
provisioner: kubernetes.io/azure-disk
volumeBindingMode: WaitForFirstConsumer # optional, but recommended if you want to wait until the pod that will use this disk is created 
parameters:
  skuname: UltraSSD_LRS
  kind: managed
  cachingmode: None
  diskIopsReadWrite: "2000"  # minimum value: 2 IOPS/GiB 
  diskMbpsReadWrite: "320"   # minimum value: 0.032/GiB
```

Create the storage class with the [kubectl apply][kubectl-apply] command and specify your *azure-ultra-disk-sc.yaml* file:

```console
$ kubectl apply -f azure-ultra-disk-sc.yaml


storageclass.storage.k8s.io/ultra-disk-sc created
```

## Create a persistent volume claim

A persistent volume claim (PVC) is used to automatically provision storage based on a storage class. In this case, a PVC can use the previously created storage class to create an ultra disk.

Create a file named `azure-ultra-disk-pvc.yaml`, and copy in the following manifest. The claim requests a disk named `ultra-disk` that is *1000 GB* in size with *ReadWriteOnce* access. The *ultra-disk-sc* storage class is specified as the storage class.

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

Create the persistent volume claim with the [kubectl apply][kubectl-apply] command and specify your *azure-ultra-disk-pvc.yaml* file:

```console
$ kubectl apply -f azure-ultra-disk-pvc.yaml

persistentvolumeclaim/ultra-disk created
```

## Use the persistent volume

Once the persistent volume claim has been created and the disk successfully provisioned, a pod can be created with access to the disk. The following manifest creates a basic NGINX pod that uses the persistent volume claim named *ultra-disk* to mount the Azure disk at the path `/mnt/azure`.

Create a file named `nginx-ultra.yaml`, and copy in the following manifest.

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

Create the pod with the [kubectl apply][kubectl-apply] command, as shown in the following example:

```console
$ kubectl apply -f nginx-ultra.yaml

pod/nginx-ultra created
```

You now have a running pod with your Azure disk mounted in the `/mnt/azure` directory. This configuration can be seen when inspecting your pod via `kubectl describe pod nginx-ultra`, as shown in the following condensed example:

```console
$ kubectl describe pod nginx-ultra

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


## Next steps

- For more about ultra disks, see [Using Azure ultra disks](../virtual-machines/disks-enable-ultra-ssd.md).
- For more about storage best practices, see [Best practices for storage and backups in Azure Kubernetes Service (AKS)][operator-best-practices-storage]

<!-- LINKS - external -->
[access-modes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/#access-modes
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubernetes-storage-classes]: https://kubernetes.io/docs/concepts/storage/storage-classes/
[kubernetes-volumes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/
[managed-disk-pricing-performance]: https://azure.microsoft.com/pricing/details/managed-disks/

<!-- LINKS - internal -->
[azure-disk-volume]: azure-disk-volume.md
[azure-files-pvc]: azure-files-dynamic-pv.md
[premium-storage]: ../virtual-machines/disks-types.md
[az-disk-list]: /cli/azure/disk#az_disk_list
[az-snapshot-create]: /cli/azure/snapshot#az_snapshot_create
[az-disk-create]: /cli/azure/disk#az_disk_create
[az-disk-show]: /cli/azure/disk#az_disk_show
[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[install-azure-cli]: /cli/azure/install-azure-cli
[operator-best-practices-storage]: operator-best-practices-storage.md
[concepts-storage]: concepts-storage.md
[storage-class-concepts]: concepts-storage.md#storage-classes
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-provider-register]: /cli/azure/provider#az_provider_register
