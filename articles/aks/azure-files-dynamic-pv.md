---
title: Dynamically create a Files volume for multiple pods in Azure Kubernetes Service (AKS)
description: Learn how to dynamically create a persistent volume with Azure Files for use with multiple concurrent pods in Azure Kubernetes Service (AKS)
services: container-service
author: iainfoulds

ms.service: container-service
ms.topic: article
ms.date: 10/08/2018
ms.author: iainfou
---

# Dynamically create and use a persistent volume with Azure Files in Azure Kubernetes Service (AKS)

A persistent volume represents a piece of storage that has been provisioned for use with Kubernetes pods. A persistent volume can be used by one or many pods, and can be dynamically or statically provisioned. If multiple pods need concurrent access to the same storage volume, you can use Azure Files to connect using the [Server Message Block (SMB) protocol][smb-overview]. This article shows you how to dynamically create an Azure Files share for use by multiple pods in an Azure Kubernetes Service (AKS) cluster.

For more information on Kubernetes persistent volumes, see [Kubernetes persistent volumes][kubernetes-volumes].

## Before you begin

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli] or [using the Azure portal][aks-quickstart-portal].

You also need the Azure CLI version 2.0.46 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Create a storage account

When you dynamically create an Azure Files share as a Kubernetes volume, any storage account can be used as long as it is in the AKS **node** resource group. This group is the one with the *MC_* prefix that was created by the provisioning of the resources for the AKS cluster. Get the resource group name with the [az aks show][az-aks-show] command.

```azurecli
$ az aks show --resource-group myResourceGroup --name myAKSCluster --query nodeResourceGroup -o tsv

MC_myResourceGroup_myAKSCluster_eastus
```

Use the [az storage account create][az-storage-account-create] command to create the storage account.

Update `--resource-group` with the name of the resource group gathered in the last step, and `--name` to a name of your choice. Provide your own unique storage account name:

```azurecli
az storage account create --resource-group MC_myResourceGroup_myAKSCluster_eastus --name mystorageaccount --sku Standard_LRS
```

> [!NOTE]
> Azure Files currently only work with Standard storage. If you use Premium storage, the volume fails to provision.

## Create a storage class

A storage class is used to define how an Azure file share is created. A storage account can be specified in the class. If a storage account is not specified, a *skuName* and *location* must be specified, and all storage accounts in the associated resource group are evaluated for a match. For more information on Kubernetes storage classes for Azure Files, see [Kubernetes Storage Classes][kubernetes-storage-classes].

Create a file named `azure-file-sc.yaml` and copy in the following example manifest. Update the *storageAccount* value with the name of your storage account created in the previous step. For more information on *mountOptions*, see the [Mount options][mount-options] section.

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: azurefile
provisioner: kubernetes.io/azure-file
mountOptions:
  - dir_mode=0777
  - file_mode=0777
  - uid=1000
  - gid=1000
parameters:
  skuName: Standard_LRS
  storageAccount: mystorageaccount
```

Create the storage class with the [kubectl apply][kubectl-apply] command:

```console
kubectl apply -f azure-file-sc.yaml
```

## Create a cluster role and binding

AKS clusters use Kubernetes role-based access control (RBAC) to limit actions that can be performed. *Roles* define the permissions to grant, and *bindings* apply them to desired users. These assignments can be applied to a given namespace, or across the entire cluster. For more information, see [Using RBAC authorization][kubernetes-rbac].

To allow the Azure platform to create the required storage resources, create a *ClusterRole* and *ClusterRoleBinding*. Create a file named `azure-pvc-roles.yaml` and copy in the following YAML:

```yaml
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: system:azure-cloud-provider
rules:
- apiGroups: ['']
  resources: ['secrets']
  verbs:     ['get','create']
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: system:azure-cloud-provider
roleRef:
  kind: ClusterRole
  apiGroup: rbac.authorization.k8s.io
  name: system:azure-cloud-provider
subjects:
- kind: ServiceAccount
  name: persistent-volume-binder
  namespace: kube-system
```

Assign the permissions with the [kubectl apply][kubectl-apply] command:

```console
kubectl apply -f azure-pvc-roles.yaml
```

## Create a persistent volume claim

A persistent volume claim (PVC) uses the storage class object to dynamically provision an Azure file share. The following YAML can be used to create a persistent volume claim *5GB* in size with *ReadWriteMany* access. For more information on access modes, see the [Kubernetes persistent volume][access-modes] documentation.

Now create a file named `azure-file-pvc.yaml` and copy in the following YAML. Make sure that the *storageClassName* matches the storage class created in the last step:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: azurefile
spec:
  accessModes:
    - ReadWriteMany
  storageClassName: azurefile
  resources:
    requests:
      storage: 5Gi
```

Create the persistent volume claim with the [kubectl apply][kubectl-apply] command:

```console
kubectl apply -f azure-file-pvc.yaml
```

Once completed, the file share will be created. A Kubernetes secret is also created that includes connection information and credentials. You can use the [kubectl get][kubectl-get] command to view the status of the PVC:

```
$ kubectl get pvc azurefile

NAME        STATUS    VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
azurefile   Bound     pvc-8436e62e-a0d9-11e5-8521-5a8664dc0477   5Gi        RWX            azurefile      5m
```

## Use the persistent volume

The following YAML creates a pod that uses the persistent volume claim *azurefile* to mount the Azure file share at the */mnt/azure* path.

Create a file named `azure-pvc-files.yaml`, and copy in the following YAML. Make sure that the *claimName* matches the PVC created in the last step.

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: nginx:1.15.5
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
        claimName: azurefile
```

Create the pod with the [kubectl apply][kubectl-apply] command.

```console
kubectl apply -f azure-pvc-files.yaml
```

You now have a running pod with your Azure disk mounted in the */mnt/azure* directory. This configuration can be seen when inspecting your pod via `kubectl describe pod mypod`. The following condensed example output shows the volume mounted in the container:

```
Containers:
  mypod:
    Container ID:   docker://053bc9c0df72232d755aa040bfba8b533fa696b123876108dec400e364d2523e
    Image:          nginx:1.15.5
    Image ID:       docker-pullable://nginx@sha256:d85914d547a6c92faa39ce7058bd7529baacab7e0cd4255442b04577c4d1f424
    State:          Running
      Started:      Wed, 15 Aug 2018 22:22:27 +0000
    Ready:          True
    Mounts:
      /mnt/azure from volume (rw)
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-8rv4z (ro)
[...]
Volumes:
  volume:
    Type:       PersistentVolumeClaim (a reference to a PersistentVolumeClaim in the same namespace)
    ClaimName:  azurefile
    ReadOnly:   false
[...]
```

## Mount options

Default *fileMode* and *dirMode* values differ between Kubernetes versions as described in the following table.

| version | value |
| ---- | ---- |
| v1.6.x, v1.7.x | 0777 |
| v1.8.0-v1.8.5 | 0700 |
| v1.8.6 or above | 0755 |
| v1.9.0 | 0700 |
| v1.9.1 or above | 0755 |

If using a cluster of version 1.8.5 or greater and dynamically creating the persistent volume with a storage class, mount options can be specified on the storage class object. The following example sets *0777*:

```yaml
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: azurefile
provisioner: kubernetes.io/azure-file
mountOptions:
  - dir_mode=0777
  - file_mode=0777
  - uid=1000
  - gid=1000
parameters:
  skuName: Standard_LRS
```

If using a cluster of version 1.8.5 or greater and statically creating the persistent volume object, mount options need to be specified on the *PersistentVolume* object. for more information on statically creating a persistent volume, see [Static Persistent Volumes][pv-static].

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: azurefile
spec:
  capacity:
    storage: 5Gi
  accessModes:
    - ReadWriteMany
  azureFile:
    secretName: azure-secret
    shareName: azurefile
    readOnly: false
  mountOptions:
  - dir_mode=0777
  - file_mode=0777
  - uid=1000
  - gid=1000
```

If using a cluster of version 1.8.0 - 1.8.4, a security context can be specified with the *runAsUser* value set to *0*. For more information on Pod security context, see [Configure a Security Context][kubernetes-security-context].

## Next steps

Learn more about Kubernetes persistent volumes using Azure Files.

> [!div class="nextstepaction"]
> [Kubernetes plugin for Azure Files][kubernetes-files]

<!-- LINKS - external -->
[access-modes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes
[kubectl-apply]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#apply
[kubectl-describe]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#describe
[kubectl-get]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#get
[kubernetes-files]: https://github.com/kubernetes/examples/blob/master/staging/volumes/azure_file/README.md
[kubernetes-secret]: https://kubernetes.io/docs/concepts/configuration/secret/
[kubernetes-security-context]: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/
[kubernetes-storage-classes]: https://kubernetes.io/docs/concepts/storage/storage-classes/#azure-file
[kubernetes-volumes]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/
[pv-static]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/#static
[kubernetes-rbac]: https://kubernetes.io/docs/reference/access-authn-authz/rbac/
[smb-overview]: /windows/desktop/FileIO/microsoft-smb-protocol-and-cifs-protocol-overview

<!-- LINKS - internal -->
[az-group-create]: /cli/azure/group#az-group-create
[az-group-list]: /cli/azure/group#az-group-list
[az-resource-show]: /cli/azure/aks#az-aks-show
[az-storage-account-create]: /cli/azure/storage/account#az-storage-account-create
[az-storage-create]: /cli/azure/storage/account#az-storage-account-create
[az-storage-key-list]: /cli/azure/storage/account/keys#az-storage-account-keys-list
[az-storage-share-create]: /cli/azure/storage/share#az-storage-share-create
[mount-options]: #mount-options
[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[install-azure-cli]: /cli/azure/install-azure-cli
[az-aks-show]: /cli/azure/aks#az-aks-show
