---
title: Create a persistent volume
description: Learn about creating persistent volumes.
author: sethmanheim
ms.author: sethm
ms.topic: how-to
ms.date: 02/06/2024
zone_pivot_groups: identity-select

---

# Create a persistent volume

This article describes how to create a persistent volume using either storage key authentication or workload identity.

## Prerequisites

This section describes the prerequisites for creating a persistent volume (PV).

1. Create a storage account [following the instructions here](/azure/storage/common/storage-account-create?tabs=azure-portal).

   When you create your storage account, create it under the same resource group and region/location as your Kubernetes cluster.

1. Create a container in the storage account that you created in the previous step, [following the instructions here](/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container).

::: zone pivot="storage-key"
## Storage key authentication (recommended)

This article describes how to configure storage key authentication, which is the recommended method.

### Storage key authentication configuration

1. Create a file named **add-key.sh**. This file creates a secret named `{YOUR_STORAGE_ACCOUNT}-secret`. This secret is used when you configure your Persistent Volume (PV).

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

1. After you create the file, change the write permissions on the file and execute the shell script using:

   ```bash
   chmod +x add-key.sh
   ./add-key.sh -g "$YOUR_RESOURCE_GROUP_NAME" -s "$YOUR_STORAGE_ACCOUNT_NAME" -n "$YOUR_KUBERNETES_NAMESPACE"
   ```

### Create Persistent Volume (PV)

You must create a Persistent Volume (PV) for the Edge Storage Accelerator to create a local instance and bind to a remote BLOB storage account.  

Note the name (`esa4` in this example), as you need to specify it in the `spec::volumeName` of the PVC that binds to it. Use your storage account and container that you created as part of the [prerequisites](#prerequisites).

1. Create a file named **pv.yaml**:

   ```yaml
   apiVersion: v1
   kind: PersistentVolume
   metadata:
       ### CREATE A NAME HERE ###
       name: CREATE_A_NAME_HERE
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
           ### Make sure this volumeid is unique in the cluster. You will need to specify it in the spec::volumeName of the PVC. ###
           volumeHandle: YOUR_NAME_FROM_METADATA_NAME_IN_LINE_4_HERE
           volumeAttributes:
               protocol: edgecache
               edgecache-storage-auth: AccountKey
               ### FILL IN THE NEXT TWO/THREE VALUES WITH YOUR INFORMATION ###
               secretName: YOUR_SECRET_NAME_HERE
               ### If you use a non-default namespace, uncomment the following line and add your namespace. ###
               #secretNamespace: YOUR_NAMESPACE_HERE
               containerName: YOUR_CONTAINER_NAME_HERE
   ```

1. To apply this .yaml file, run:

   ```bash
   kubectl apply -f "pv.yaml"
   ```

::: zone-end

::: zone pivot="workload-identity"
## Workload identity configuration

This article describes how to configure workload identity.

### Configure the workload identity

1. Download the **connectedk8s** CLI version **1.6.0_private** **.whl** file using the following command:

   ```bash
   curl -o connectedk8s-1.6.0_private-py2.py3-none-any.whl -L https://workloadidentityclirepo.blob.core.windows.net/connectedk8swhl/connectedk8s-1.6.0_private-py2.py3-none-any.whl
   ```

1. Remove the existing **connectedk8s** cli (if any) using:

   ```azurecli
   az extension remove --name connectedk8s
   ```

1. Add the new **connectedk8s** cli source using:

   ```azurecli
   az extension add --source connectedk8s-1.6.0_private-py2.py3-none-any.whl
   ```

1. Connect it to Arc with the workload identity feature enabled using this command:

   ```azurecli
   az connectedk8s update -g <resource_group_name> -n <cluster_name> --enable-oidc-issuer
   ```

1. Enable the workload identity webhook. Replace `TenantID` if you're not using an MSFT AIRS subscription:

    ```bash
    export PATH_TO_CHART="oci://testpublic.azurecr.io/helm/workload-identity-webhook"
    helm pull oci://testpublic.azurecr.io/helm/workload-identity-webhook --version 1.0.0
    helm upgrade workload-identity-webhook $PATH_TO_CHART --install --create-namespace --namespace azure-workload-identity-system --set azureTenantID="72f988bf-86f1-41af-91ab-2d7cd011db47" --set isArcEnabledCluster="true"
    ```

1. Use `setup-workload-identity.sh` script from the `esa_bicep.tgz` to configure workload identity using:

    ```bash
    $issuer_url=`az connectedk8s show-issuer-url`
    setup-workload-identity.sh -r <rg_name> -i ${issuer_url} -n azure-workload-identity-system
    ```

::: zone-end

## Next steps

[Create a persistent volume claim](create-pvc.md)
