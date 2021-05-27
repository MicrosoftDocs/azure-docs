---
title: Manually create Azure Files share
titleSuffix: Azure Kubernetes Service
description: Learn how to manually create a volume with Azure Files for use with multiple concurrent pods in Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.date: 03/01/2019


#Customer intent: As a developer, I want to learn how to manually create and attach storage using Azure Files to a pod in AKS.

---

# Manually create and use a volume with Azure Files share in Azure Kubernetes Service (AKS)

Container-based applications often need to access and persist data in an external data volume. If multiple pods need concurrent access to the same storage volume, you can use Azure Files to connect using the [Server Message Block (SMB) protocol][smb-overview]. This article shows you how to manually create an Azure Files share and attach it to a pod in AKS.

For more information on Kubernetes volumes, see [Storage options for applications in AKS][concepts-storage].

## Before you begin

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli] or [using the Azure portal][aks-quickstart-portal].

You also need the Azure CLI version 2.0.59 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

## Create an Azure file share

Before you can use Azure Files as a Kubernetes volume, you must create an Azure Storage account and the file share. The following commands create a resource group named *myAKSShare*, a storage account, and a Files share named *aksshare*:

```azurecli-interactive
# Change these four parameters as needed for your own environment
AKS_PERS_STORAGE_ACCOUNT_NAME=mystorageaccount$RANDOM
AKS_PERS_RESOURCE_GROUP=myAKSShare
AKS_PERS_LOCATION=eastus
AKS_PERS_SHARE_NAME=aksshare

# Create a resource group
az group create --name $AKS_PERS_RESOURCE_GROUP --location $AKS_PERS_LOCATION

# Create a storage account
az storage account create -n $AKS_PERS_STORAGE_ACCOUNT_NAME -g $AKS_PERS_RESOURCE_GROUP -l $AKS_PERS_LOCATION --sku Standard_LRS

# Export the connection string as an environment variable, this is used when creating the Azure file share
export AZURE_STORAGE_CONNECTION_STRING=$(az storage account show-connection-string -n $AKS_PERS_STORAGE_ACCOUNT_NAME -g $AKS_PERS_RESOURCE_GROUP -o tsv)

# Create the file share
az storage share create -n $AKS_PERS_SHARE_NAME --connection-string $AZURE_STORAGE_CONNECTION_STRING

# Get storage account key
STORAGE_KEY=$(az storage account keys list --resource-group $AKS_PERS_RESOURCE_GROUP --account-name $AKS_PERS_STORAGE_ACCOUNT_NAME --query "[0].value" -o tsv)

# Echo storage account name and key
echo Storage account name: $AKS_PERS_STORAGE_ACCOUNT_NAME
echo Storage account key: $STORAGE_KEY
```

Make a note of the storage account name and key shown at the end of the script output. These values are needed when you create the Kubernetes volume in one of the following steps.

## Create a Kubernetes secret

Kubernetes needs credentials to access the file share created in the previous step. These credentials are stored in a [Kubernetes secret][kubernetes-secret], which is referenced when you create a Kubernetes pod.

Use the `kubectl create secret` command to create the secret. The following example creates a shared named *azure-secret* and populates the *azurestorageaccountname* and *azurestorageaccountkey* from the previous step. To use an existing Azure storage account, provide the account name and key.

```console
kubectl create secret generic azure-secret --from-literal=azurestorageaccountname=$AKS_PERS_STORAGE_ACCOUNT_NAME --from-literal=azurestorageaccountkey=$STORAGE_KEY
```

## Mount file share as an inline volume
> Note: starting from 1.18.15, 1.19.7, 1.20.2, 1.21.0, secret namespace in inline `azureFile` volume can only be set as `default` namespace, to specify a different secret namespace, please use below persistent volume example instead.

To mount the Azure Files share into your pod, configure the volume in the container spec. Create a new file named `azure-files-pod.yaml` with the following contents. If you changed the name of the Files share or secret name, update the *shareName* and *secretName*. If desired, update the `mountPath`, which is the path where the Files share is mounted in the pod. For Windows Server containers, specify a *mountPath* using the Windows path convention, such as *'D:'*.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - image: mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine
    name: mypod
    resources:
      requests:
        cpu: 100m
        memory: 128Mi
      limits:
        cpu: 250m
        memory: 256Mi
    volumeMounts:
      - name: azure
        mountPath: /mnt/azure
  volumes:
  - name: azure
    azureFile:
      secretName: azure-secret
      shareName: aksshare
      readOnly: false
```

Use the `kubectl` command to create the pod.

```console
kubectl apply -f azure-files-pod.yaml
```

You now have a running pod with an Azure Files share mounted at */mnt/azure*. You can use `kubectl describe pod mypod` to verify the share is mounted successfully. The following condensed example output shows the volume mounted in the container:

```
Containers:
  mypod:
    Container ID:   docker://86d244cfc7c4822401e88f55fd75217d213aa9c3c6a3df169e76e8e25ed28166
    Image:          mcr.microsoft.com/oss/nginx/nginx:1.15.5-alpine
    Image ID:       docker-pullable://nginx@sha256:9ad0746d8f2ea6df3a17ba89eca40b48c47066dfab55a75e08e2b70fc80d929e
    State:          Running
      Started:      Sat, 02 Mar 2019 00:05:47 +0000
    Ready:          True
    Mounts:
      /mnt/azure from azure (rw)
      /var/run/secrets/kubernetes.io/serviceaccount from default-token-z5sd7 (ro)
[...]
Volumes:
  azure:
    Type:        AzureFile (an Azure File Service mount on the host and bind mount to the pod)
    SecretName:  azure-secret
    ShareName:   aksshare
    ReadOnly:    false
  default-token-z5sd7:
    Type:        Secret (a volume populated by a Secret)
    SecretName:  default-token-z5sd7
[...]
```

## Mount file share as an persistent volume
 - Mount options

The default value for *fileMode* and *dirMode* is *0777* for Kubernetes version 1.15 and above. The following example sets *0755* on the *PersistentVolume* object:

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
    secretNamespace: default
    shareName: aksshare
    readOnly: false
  mountOptions:
  - dir_mode=0755
  - file_mode=0755
  - uid=1000
  - gid=1000
  - mfsymlinks
  - nobrl
```

To update your mount options, create a *azurefile-mount-options-pv.yaml* file with a *PersistentVolume*. For example:

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
    shareName: aksshare
    readOnly: false
  mountOptions:
  - dir_mode=0777
  - file_mode=0777
  - uid=1000
  - gid=1000
  - mfsymlinks
  - nobrl
```

Create a *azurefile-mount-options-pvc.yaml* file with a *PersistentVolumeClaim* that uses the *PersistentVolume*. For example:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: azurefile
spec:
  accessModes:
    - ReadWriteMany
  storageClassName: ""
  resources:
    requests:
      storage: 5Gi
```

Use the `kubectl` commands to create the *PersistentVolume* and *PersistentVolumeClaim*.

```console
kubectl apply -f azurefile-mount-options-pv.yaml
kubectl apply -f azurefile-mount-options-pvc.yaml
```

Verify your *PersistentVolumeClaim* is created and bound to the *PersistentVolume*.

```console
$ kubectl get pvc azurefile

NAME        STATUS   VOLUME      CAPACITY   ACCESS MODES   STORAGECLASS   AGE
azurefile   Bound    azurefile   5Gi        RWX            azurefile      5s
```

Update your container spec to reference your *PersistentVolumeClaim* and update your pod. For example:

```yaml
...
  volumes:
  - name: azure
    persistentVolumeClaim:
      claimName: azurefile
```

## Next steps

For associated best practices, see [Best practices for storage and backups in AKS][operator-best-practices-storage].

For more information about AKS clusters interact with Azure Files, see the [Kubernetes plugin for Azure Files][kubernetes-files].

For storage class parameters, see [Static Provision(bring your own file share)](https://github.com/kubernetes-sigs/azurefile-csi-driver/blob/master/docs/driver-parameters.md#static-provisionbring-your-own-file-share).

<!-- LINKS - external -->
[kubectl-create]: https://kubernetes.io/docs/user-guide/kubectl/v1.8/#create
[kubernetes-files]: https://github.com/kubernetes/examples/blob/master/staging/volumes/azure_file/README.md
[kubernetes-secret]: https://kubernetes.io/docs/concepts/configuration/secret/
[kubernetes-volumes]: https://kubernetes.io/docs/concepts/storage/volumes/
[smb-overview]: /windows/desktop/FileIO/microsoft-smb-protocol-and-cifs-protocol-overview
[kubernetes-security-context]: https://kubernetes.io/docs/tasks/configure-pod-container/security-context/

<!-- LINKS - internal -->
[az-group-create]: /cli/azure/group#az_group_create
[az-storage-create]: /cli/azure/storage/account#az_storage_account_create
[az-storage-key-list]: /cli/azure/storage/account/keys#az_storage_account_keys_list
[az-storage-share-create]: /cli/azure/storage/share#az_storage_share_create
[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[install-azure-cli]: /cli/azure/install-azure-cli
[operator-best-practices-storage]: operator-best-practices-storage.md
[concepts-storage]: concepts-storage.md
