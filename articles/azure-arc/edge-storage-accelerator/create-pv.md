---
title: Create a persistent volume (preview)
description: Learn about creating persistent volumes in Edge Storage Accelerator.
author: sethmanheim
ms.author: sethm
ms.topic: how-to
ms.date: 04/08/2024

---

# Create a persistent volume (preview)

This article describes how to create a persistent volume using storage key authentication.

## Prerequisites

This section describes the prerequisites for creating a persistent volume (PV).

1. Create a storage account [following the instructions here](/azure/storage/common/storage-account-create?tabs=azure-portal).

    > [!NOTE]
    > When you create your storage account, create it under the same resource group and region/location as your Kubernetes cluster.

1. Create a container in the storage account that you created in the previous step, [following the instructions here](/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container).

## Storage key authentication configuration

1. Create a file named **add-key.sh** with the following contents. No edits or changes are necessary:

   ```bash
   #!/usr/bin/env bash
    
   while getopts g:n:s: flag
   do
       case "${flag}" in
           g) RESOURCE_GROUP=${OPTARG};;
           s) STORAGE_ACCOUNT=${OPTARG};;
           n) NAMESPACE=${OPTARG};;
       esac
   done
    
   SECRET=$(az storage account keys list -g $RESOURCE_GROUP -n $STORAGE_ACCOUNT --query [0].value --output tsv)
    
   kubectl create secret generic -n "${NAMESPACE}" "${STORAGE_ACCOUNT}"-secret --from-literal=azurestorageaccountkey="${SECRET}" --from-literal=azurestorageaccountname="${STORAGE_ACCOUNT}"
   ```

1. After you create the file, change the write permissions on the file and execute the shell script using the following commands. Running these commands creates a secret named `{YOUR_STORAGE_ACCOUNT}-secret`. This secret name is used for the `secretName` value when configuring your PV:

   ```bash
   chmod +x add-key.sh
   ./add-key.sh -g "$YOUR_RESOURCE_GROUP_NAME" -s "$YOUR_STORAGE_ACCOUNT_NAME" -n "$YOUR_KUBERNETES_NAMESPACE"
   ```

## Create Persistent Volume (PV)

You must create a Persistent Volume (PV) for the Edge Storage Accelerator to create a local instance and bind to a remote BLOB storage account.  

Note the `metadata: name:` as you must specify it in the `spec: volumeName` of the PVC that binds to it. Use your storage account and container that you created as part of the [prerequisites](#prerequisites).

1. Create a file named **pv.yaml**:

   ```yaml
   apiVersion: v1
   kind: PersistentVolume
   metadata:
       ### Create a name here ###
       name: CREATE_A_NAME_HERE
       ### Use a namespace that matches your intended consuming pod, or "default" ###
       namespace: INTENDED_CONSUMING_POD_OR_DEFAULT_HERE
   spec:
       capacity:
           ### This storage capacity value is not enforced at this layer. ###
           storage: 10Gi
       accessModes:
           - ReadWriteMany
       persistentVolumeReclaimPolicy: Retain
       storageClassName: esa
       csi:
           driver: edgecache.csi.azure.com
           readOnly: false
           ### Make sure this volumeid is unique in the cluster. You must specify it in the spec:volumeName of the PVC. ###
           volumeHandle: YOUR_NAME_FROM_METADATA_NAME_IN_LINE_4_HERE
           volumeAttributes:
               protocol: edgecache
               edgecache-storage-auth: AccountKey
               ### Fill in the next two/three values with your information. ###
               secretName: YOUR_SECRET_NAME_HERE ### From the previous step, this name is "{YOUR_STORAGE_ACCOUNT}-secret" ###
               ### If you use a non-default namespace, uncomment the following line and add your namespace. ###
               ### secretNamespace: YOUR_NAMESPACE_HERE
               containerName: YOUR_CONTAINER_NAME_HERE
   ```

1. To apply this .yaml file, run:

   ```bash
   kubectl apply -f "pv.yaml"
   ```

## Next steps

- [Create a persistent volume claim](create-pvc.md)
- [Edge Storage Accelerator overview](overview.md)
