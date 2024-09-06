---
title: Alternate key-based configuration for Cloud Ingest Edge Volumes
description: Learn about an alternate key-based configuration for Cloud Ingest Edge Volumes.
author: sethmanheim
ms.author: sethm
ms.topic: how-to
ms.custom: linux-related-content
ms.date: 08/26/2024
---

# Alternate: Key-based authentication configuration for Cloud Ingest Edge Volumes

This article describes an alternate configuration for [Cloud Ingest Edge Volumes](cloud-ingest-edge-volume-configuration.md) (blob upload with local purge) with key-based authentication.

This configuration is an alternative option for use with key-based authentication methods. You should review the recommended configuration using system-assigned managed identities in [Cloud Ingest Edge Volumes configuration](cloud-ingest-edge-volume-configuration.md).

## Prerequisites

1. Create a storage account [following these instructions](/azure/storage/common/storage-account-create?tabs=azure-portal).

   > [!NOTE]
   > When you create a storage account, it's recommended that you create it under the same resource group and region/location as your Kubernetes cluster.

1. Create a container in the storage account that you created in the previous step, [following these instructions](/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container).

## Create a Kubernetes secret

Edge Volumes supports the following three authentication methods:

- Shared Access Signature (SAS) Authentication (recommended)
- Connection String Authentication
- Storage Key Authentication

After you complete authentication for one of these methods, proceed to the [Create a Cloud Ingest Persistent Volume Claim (PVC)](#create-a-cloud-ingest-persistent-volume-claim-pvc) section.

### [Shared Access Signature (SAS) authentication](#tab/sas)

### Create a Kubernetes secret using Shared Access Signature (SAS) authentication

You can configure SAS authentication using YAML and `kubectl`, or by using the Azure CLI.

To find your `storageaccountsas`, perform the following procedure:

1. Navigate to your storage account in the Azure portal.
1. Expand **Security + networking** on the left blade and then select **Shared access signature**.
1. Under **Allowed resource types**, select **Service > Container > Object**.
1. Under **Allowed permissions**, unselect **Immutable storage** and **Permanent delete**.
1. Under **Start and expiry date/time**, choose your desired end date and time.
1. At the bottom, select **Generate SAS and connection string**.
1. The values listed under **SAS token** are used for the `storageaccountsas` variables in the next section.

#### Shared Access Signature (SAS) authentication using YAML and `kubectl`

1. Create a file named `sas.yaml` with the following contents. Replace `metadata::name`, `metadata::namespace`, and `storageaccountconnectionstring` with your own values.

   [!INCLUDE [lowercase-note](includes/lowercase-note.md)]

   ```yaml
   apiVersion: v1
   kind: Secret
   metadata:
     ### This name should look similar to "kharrisStorageAccount-secret" where "kharrisStorageAccount" is replaced with your storage account name
     name: <your-storage-acct-name-secret>
     # Use a namespace that matches your intended consuming pod, or "default" 
     namespace: <your-intended-consuming-pod-or-default>
   stringData:
     authType: SAS
     # Container level SAS (must have ? prefixed)
     storageaccountsas: "?..."
   type: Opaque
   ```

1. To apply `sas.yaml`, run:

   ```bash
   kubectl apply -f "sas.yaml"
   ```

#### Shared Access Signature (SAS) authentication using CLI

- If you want to scope SAS authentication at the container level, use the following commands. You must update `YOUR_CONTAINER_NAME` from the first command and `YOUR_NAMESPACE`, `YOUR_STORAGE_ACCT_NAME`, and `YOUR_SECRET` from the second command:

   ```bash
   az storage container generate-sas [OPTIONAL auth via --connection-string "..."] --name YOUR_CONTAINER_NAME --permissions acdrw --expiry '2025-02-02T01:01:01Z'
   kubectl create secret generic -n "YOUR_NAMESPACE" "YOUR_STORAGE_ACCT_NAME"-secret --from-literal=storageaccountsas="YOUR_SAS" 
   ```

### [Connection string authentication](#tab/connectionstring)

### Create a Kubernetes secret using connection string authentication

You can configure connection string authentication using YAML and `kubectl`, or by using Azure CLI.

To find your `storageaccountconnectionstring`, perform the following procedure:

1. Navigate to your storage account in the Azure portal.
1. Expand **Security + networking** on the left blade and then select **Shared access signature**.
1. Under **Allowed resource types**, select **Service > Container > Object**.
1. Under **Allowed permissions**, unselect **Immutable storage** and **Permanent delete**.
1. Under **Start and expiry date/time**, choose your desired end date and time.
1. At the bottom, select **Generate SAS and connection string**.
1. The values listed under **Connection string** are used for the `storageaccountconnectionstring` variables in the next section..

For more information, see [Create a connection string using a shared access signature](/azure/storage/common/storage-configure-connection-string?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json&bc=%2Fazure%2Fstorage%2Fblobs%2Fbreadcrumb%2Ftoc.json#create-a-connection-string-using-a-shared-access-signature).

#### Connection string authentication using YAML and `kubectl`

1. Create a file named `connectionString.yaml` with the following contents. Replace `metadata::name`, `metadata::namespace`, and `storageaccountconnectionstring` with your own values.

   [!INCLUDE [lowercase-note](includes/lowercase-note.md)]

   ```yaml
   apiVersion: v1
   kind: Secret
   metadata:
     ### This name should look similar to "kharrisStorageAccount-secret" where "kharrisStorageAccount" is replaced with your storage account name
     name: <your-storage-acct-name-secret>
     # Use a namespace that matches your intended consuming pod or "default" 
     namespace: <your-intended-consuming-pod-or-default>
   stringData:
     authType: CONNECTION_STRING
     # Connection string which can contain a storage key or SAS.
     # Depending on your decision on using storage key or SAS, comment out the undesired storageaccoutnconnectionstring.
     # ---- Storage key example ---- 
     storageaccountconnectionstring: "DefaultEndpointsProtocol=https;AccountName=YOUR_ACCT_NAME_HERE;AccountKey=YOUR_ACCT_KEY_HERE;EndpointSuffix=core.windows.net"
     # ---- SAS example ----
     storageaccountconnectionstring: "BlobEndpoint=https://YOUR_BLOB_ENDPOINT_HERE;SharedAccessSignature=YOUR_SHARED_ACCESS_SIG_HERE"
   type: Opaque
   ```

1. To apply `connectionString.yaml`, run:

   ```bash
   kubectl apply -f "connectionString.yaml"
   ```

#### Connection string authentication using CLI

A connection string can contain a storage key or SAS.

- For a storage key connection string, run the following commands. You must update the `your_storage_acct_name` value from the first command, and the `your_namespace`, `your_storage_acct_name`, and `your_secret` values from the second command:

   ```bash
   az storage account show-connection-string --name YOUR_STORAGE_ACCT_NAME --output tsv
   kubectl create secret generic -n "your_namespace" "your_storage_acct_name"-secret --from-literal=storageaccountconnectionstring="your_secret" 
   ```

- For a SAS connection string, run the following commands. You must update the `your_storage_acct_name` and `your_sas_token` values from the first command, and the `your_namespace`, `your_storage_acct_name`, and `your_secret` values from the second command:

   ```bash
   az storage account show-connection-string --name your_storage_acct_name --sas-token "your_sas_token" -output tsv
   kubectl create secret generic -n "your_namespace" "your_storage_acct_name"-secret --from-literal=storageaccountconnectionstring="your_secret" 
   ```

### [Storage key authentication](#tab/storagekey)

### Create a Kubernetes secret using storage key authentication

1. Create a file named `add-key.sh` with the following contents. No edits to the contents are necessary:

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
    
   kubectl create secret generic -n "${NAMESPACE}" "${STORAGE_ACCOUNT}"-secret --from-literal=storageaccountkey="${SECRET}" --from-literal=storageaccountname="${STORAGE_ACCOUNT}"
   ```

1. Once you create the file, change the write permissions on the file and execute the shell script using the following commands. Running these commands creates a secret named `{your_storage_account}-secret`. This secret name is used for the `secretName` value when you configure the Persistent Volume (PV).

   ```bash
   chmod +x add-key.sh
   ./add-key.sh -g "$your_resource_group_name" -s "$your_storage_account_name" -n "$your_kubernetes_namespace"
   ```

---

## Create a Cloud Ingest Persistent Volume Claim (PVC)

1. Create a file named `cloudIngestPVC.yaml` with the following contents. You must edit the `metadata::name` value, and add a name for your Persistent Volume Claim. This name is referenced on the last line of `deploymentExample.yaml` in the next step. You must also update the `metadata::namespace` value with your intended consuming pod. If you don't have an intended consuming pod, the `metadata::namespace` value is `default`:

   [!INCLUDE [lowercase-note](includes/lowercase-note.md)]

   ```yml
   kind: PersistentVolumeClaim
   apiVersion: v1
   metadata:
     ### Create a name for the PVC ###
     name: <your-storage-acct-name-secret>
     ### Use a namespace that matches your intended consuming pod, or "default" ###
     namespace: <your-intended-consuming-pod-or-default>
   spec:
     accessModes:
       - ReadWriteMany
     resources:
       requests:
         storage: 2Gi
     storageClassName: cloud-backed-sc
   ```

2. To apply `cloudIngestPVC.yaml`, run:

   ```bash
   kubectl apply -f "cloudIngestPVC.yaml"
   ```

## Attach sub-volume to Edge Volume

1. Get the name of your Edge Volume using the following command:

   ```bash
   kubectl get edgevolumes
   ```

1. Create a file named `edgeSubvolume.yaml` and copy the following contents. Update the variables with your information:

   [!INCLUDE [lowercase-note](includes/lowercase-note.md)]

   - `metadata::name`: Create a name for your sub-volume.
   - `spec::edgevolume`: This name was retrieved from the previous step using `kubectl get edgevolumes`.
   - `spec::path`: Create your own subdirectory name under the mount path. Note that the following example already contains an example name (`exampleSubDir`). If you change this path name, line 33 in `deploymentExample.yaml` must be updated with the new path name. If you choose to rename the path, don't use a preceding slash.
   - `spec::auth::authType`: Depends on what authentication method you used in the previous steps. Accepted inputs include `sas`, `connection_string`, and `key`.
   - `spec::auth::secretName`: If you used storage key authentication, your `secretName` is `{your_storage_account_name}-secret`. If you used connection string or SAS authentication, your `secretName` was specified by you.
   - `spec::auth::secretNamespace`: Matches your intended consuming pod, or `default`.
   - `spec::container`: The container name in your storage account.
   - `spec::storageaccountendpoint`: Navigate to your storage account in the Azure portal. On the **Overview** page, near the top right of the screen, select **JSON View**. You can find the `storageaccountendpoint` link under **properties::primaryEndpoints::blob**. Copy the entire link (for example, `https://mytest.blob.core.windows.net/`).

    ```yaml
    apiVersion: "arccontainerstorage.azure.net/v1"
    kind: EdgeSubvolume
    metadata:
      name: <create-a-subvolume-name-here>
    spec:
      edgevolume: <your-edge-volume-name-here>
      path: exampleSubDir # If you change this path, line 33 in deploymentExample.yaml must be updated. Don't use a preceding slash.
      auth:
        authType: MANAGED_IDENTITY
        secretName: <your-secret-name>
        secretNamespace: <your_namespace>
      storageaccountendpoint: <your_storage_account_endpoint>
      container: <your-blob-storage-account-container-name>
      ingestPolicy: edgeingestpolicy-default # Optional: See the following instructions if you want to update the ingestPolicy with your own configuration
    ```

2. To apply `edgeSubvolume.yaml`, run:

   ```bash
   kubectl apply -f "edgeSubvolume.yaml"
   ```

### Optional: Modify the `ingestPolicy` from the default

1. If you want to change the `ingestPolicy` from the default `edgeingestpolicy-default`, create a file named `myedgeingest-policy.yaml` with the following contents. Update the following variables with your preferences.

   [!INCLUDE [lowercase-note](includes/lowercase-note.md)]

   - `metadata::name`: Create a name for your **ingestPolicy**. This name must be updated and referenced in the spec::ingestPolicy section of your `edgeSubvolume.yaml`.
   - `spec::ingest::order`: The order in which dirty files are uploaded. This is best effort, not a guarantee (defaults to **oldest-first**). Options for order are: **oldest-first** or **newest-first**.
   - `spec::ingest::minDelaySec`: The minimum number of seconds before a dirty file is eligible for ingest (defaults to 60). This number can range between 0 and 31536000.
   - `spec::eviction::order`: How files are evicted (defaults to **unordered**). Options for eviction order are: **unordered** or **never**.
   - `spec::eviction::minDelaySec`: The number of seconds before a clean file is eligible for eviction (defaults to 300). This number can range between 0 and 31536000.

    ```yaml
    apiVersion: arccontainerstorage.azure.net/v1
    kind: EdgeIngestPolicy
    metadata:
      name: <create-a-policy-name-here> # This will need to be updated and referenced in the spec::ingestPolicy section of the edgeSubvolume.yaml
    spec:
      ingest:
        order: <your-ingest-order>
        minDelaySec: <your-min-delay-sec>
      eviction:
        order: <your-eviction-order>
        minDelaySec: <your-min-delay-sec>
    ```

1. To apply `myedgeingest-policy.yaml`, run:

   ```bash
   kubectl apply -f "myedgeingest-policy.yaml"
   ```

## Attach your app (Kubernetes native application)

1. To configure a generic single pod (Kubernetes native application) against the Persistent Volume Claim (PVC), create a file named `deploymentExample.yaml` with the following contents. Replace `containers::name` and `volumes::persistentVolumeClaim::claimName` with your values. If you updated the path name from `edgeSubvolume.yaml`, `exampleSubDir` on line 33 must be updated with your new path name.

   [!INCLUDE [lowercase-note](includes/lowercase-note.md)]

   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: cloudingestedgevol-deployment ### This will need to be unique for every volume you choose to create
   spec:
     replicas: 2
     selector:
       matchLabels:
         name: wyvern-testclientdeployment
     template:
       metadata:
         name: wyvern-testclientdeployment
         labels:
           name: wyvern-testclientdeployment
       spec:
         affinity:
           podAntiAffinity:
             requiredDuringSchedulingIgnoredDuringExecution:
             - labelSelector:
                 matchExpressions:
                 - key: app
                   operator: In
                   values:
                   - wyvern-testclientdeployment
               topologyKey: kubernetes.io/hostname
         containers:
           ### Specify the container in which to launch the busy box. ###
           - name: <create-a-container-name-here>
             image: mcr.microsoft.com/azure-cli:2.57.0@sha256:c7c8a97f2dec87539983f9ded34cd40397986dcbed23ddbb5964a18edae9cd09
             command:
               - "/bin/sh"
               - "-c"
               - "dd if=/dev/urandom of=/data/exampleSubDir/esaingesttestfile count=16 bs=1M && while true; do ls /data &>/dev/null || break; sleep 1; done"
             volumeMounts:
               ### This name must match the following volumes::name attribute ###
               - name: wyvern-volume
                 ### This mountPath is where the PVC will be attached to the pod's filesystem ###
                 mountPath: "/data"
         volumes:
            ### User-defined 'name' that is used to link the volumeMounts. This name must match volumeMounts::name as previously specified. ###
           - name: wyvern-volume
             persistentVolumeClaim:
               ### This claimName must refer to your PVC metadata::name
               claimName: <your-pvc-metadata-name-from-line-5-of-pvc-yaml>
   ```

1. To apply `deploymentExample.yaml`, run:

   ```bash
   kubectl apply -f "deploymentExample.yaml"
   ```

1. Use `kubectl get pods` to find the name of your pod. Copy this name; you use it in the next step.

   > [!NOTE]
   > Because `spec::replicas` from `deploymentExample.yaml` was specified as `2`, two pods will appear using `kubectl get pods`. You can choose either pod name to use for the next step.

1. Run the following command and replace `POD_NAME_HERE` with your copied value from the last step:

   ```bash
   kubectl exec -it pod_name_here -- sh
   ```

1. Change directories (`cd`) into the `/data` mount path as specified in your `deploymentExample.yaml`.

1. You should see a directory with the name you specified as your `path` in Step 2 of the [Attach sub-volume to Edge Volume](#attach-sub-volume-to-edge-volume) section. Now, `cd` into `/your_path_name_here`, and replace `your_path_name_here` with your respective details.

1. As an example, create a file named `file1.txt` and write to it using `echo "Hello World" > file1.txt`.

1. In the Azure portal, navigate to your storage account and find the container specified from Step 2 of [Attach sub-volume to Edge Volume](#attach-sub-volume-to-edge-volume). When you select your container, you should see `file1.txt` populated within the container. If the file hasn't yet appeared, wait approximately 1 minute; Edge Volumes waits a minute before uploading.

## Next steps

After completing these steps, begin monitoring your deployment using Azure Monitor and Kubernetes Monitoring, or 3rd party monitoring with Prometheus and Grafana.

[Monitor your deployment](monitor-deployment-edge-volumes.md)