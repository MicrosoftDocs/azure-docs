---
title: Use Azure File with AKS | Microsoft Docs
description: Use Azure Disks with AKS
services: container-service
documentationcenter: ''
author: neilpeterson
manager: timlt
editor: ''
tags: aks, azure-container-service
keywords: ''

ms.service: container-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/30/2017
ms.author: nepeters
ms.custom: mvc

---


# Using Azure Files with Kubernetes

Applications often need to access or persist external state that lives beyond the lifetime of a given pod. Kubernetes supports mounting [Volumes](https://kubernetes.io/docs/concepts/storage/volumes/) into your container from Azure Files in the following modes

* ReadWriteOnce - read-write for a single node
* ReadOnlyMany - read-only for many nodes
* ReadWriteMany - read-write for many nodes

> [!NOTE]
> The [Azure Files and Azure Disks comparison](/azure/storage/common/storage-decide-blobs-files-disks#comparison-files-and-disks) can help you choose the appropriate storage technology for your application

## Creating a file share

To use an Azure Files volume, you can use a file share that already exists, or [create a new file share](/azure/storage/files/storage-how-to-create-file-share).

## Creating a Secret

Kubernetes needs credentials to access the file share in order to read and write files. Rather than storing the storage account name and key with each pod, it is stored once in a [Secret](https://kubernetes.io/docs/concepts/configuration/secret/) and referenced by each Azure Files volume.

The values in the secret need to be base64 encoded. Use the following commands to get the values you'll need for the secret definition.

```azurecli-interactive
# Format the value for 'azurestorageaccountname'
echo -n mystorageaccount | base64

# Format the value for 'azurestorageaccountkey'
echo -n `az storage account keys list -n mystorageaccount -g myResourceGroup --query '[0].value' -o tsv` | base64 -w 0
```

Create a file named `azure-secret.yml` and save it with the following YAML, inserting the values for your own storage account as appropriate.

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: azure-secret
type: Opaque
data:
  # Replace with the values for your storage account
  azurestorageaccountname: <base64_encoded_storage_account_name>
  azurestorageaccountkey: <base64_encoded_storage_account_key>
```

Use the [kubectl apply](https://kubernetes.io/docs/user-guide/kubectl/v1.8/#apply) command to create the secret.

```azurecli-interactive
kubectl apply -f azure-secret.yml
```

Output:

```bash
secret "azure-secret" created
```

## Mounting an Azure file share as a volume

You can mount your Azure file share into your pod by configuring the volume in its spec. Create a new file named `azure-files-pod.yml` with the following contents.

```yaml
apiVersion: v1
kind: Pod
metadata:
 name: azure-files-pod
spec:
 containers:
  - image: kubernetes/pause
    name: azure
    volumeMounts:
      - name: azure
        mountPath: /mnt/azure
 volumes:
  - name: azure
    azureFile:
      secretName: azure-secret
      # Replace with the name of your Azure file share
      shareName: k8stest
      readOnly: false
```

Use kubectl to create a pod

```azurecli-interactive
kubectl apply -f azure-files-pod.yml
```

Output:

```bash
pod "azure-files-pod" created
```

You now have a running container with your Azure file share mounted in the `/mnt/azure` directory. You can see your volume mounts when inspecting your pod via `kubectl describe pod azure-files-pod`.


## Next steps

* Learn more about [Kubernetes volumes]