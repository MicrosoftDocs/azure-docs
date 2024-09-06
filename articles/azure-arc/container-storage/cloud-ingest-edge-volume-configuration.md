---
title: Cloud Ingest Edge Volumes configuration
description: Learn about Cloud Ingest Edge Volumes configuration for Edge Volumes.
author: sethmanheim
ms.author: sethm
ms.topic: how-to
ms.custom: linux-related-content
ms.date: 08/26/2024
---

# Cloud Ingest Edge Volumes configuration

This article describes the configuration for *Cloud Ingest Edge Volumes* (blob upload with local purge).

## What is Cloud Ingest Edge Volumes?

*Cloud Ingest Edge Volumes* facilitates limitless data ingestion from edge to blob, including ADLSgen2. Files written to this storage type are seamlessly transferred to blob storage and once confirmed uploaded, are subsequently purged locally. This removal ensures space availability for new data. Moreover, this storage option supports data integrity in disconnected environments, which enables local storage and synchronization upon reconnection to the network.

For example, you can write a file to your cloud ingest PVC, and a process runs a scan to check for new files every minute. Once identified, the file is sent for uploading to your designated blob destination. Following confirmation of a successful upload, Cloud Ingest Edge Volume waits for five minutes, and then deletes the local version of your file.

## Prerequisites

1. Create a storage account [following the instructions here](/azure/storage/common/storage-account-create?tabs=azure-portal).

   > [!NOTE]
   > When you create your storage account, it's recommended that you create it under the same resource group and region/location as your Kubernetes cluster.

1. Create a container in the storage account that you created previously, [following the instructions here](/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container).

## Configure Extension Identity

Edge Volumes allows the use of a system-assigned extension identity for access to blob storage. This section describes how to use the system-assigned extension identity to grant access to your storage account, allowing you to upload cloud ingest volumes to these storage systems.

It's recommended that you use Extension Identity. If your final destination is blob storage or ADLSgen2, see the following instructions. If your final destination is OneLake, follow the instructions in [Configure OneLake for Extension Identity](alternate-onelake.md).

While it's not recommended, if you prefer to use key-based authentication, follow the instructions in [Key-based authentication](alternate-key-based.md).

### Obtain Extension Identity

#### [Azure portal](#tab/portal)

#### Azure portal

1. Navigate to your Arc-connected cluster.
1. Select **Extensions**.
1. Select your Azure Container Storage enabled by Azure Arc extension.
1. Note the Principal ID under **Cluster Extension Details**.
  
#### [Azure CLI](#tab/cli)

#### Azure CLI

In Azure CLI, enter your values for the exports (`CLUSTER_NAME`, `RESOURCE_GROUP`) and run the following command:

```bash
export CLUSTER_NAME = <your-cluster-name-here>
export RESOURCE_GROUP = <your-resource-group-here>
export EXTENSION_TYPE=${1:-"microsoft.arc.containerstorage"}
az k8s-extension list --cluster-name ${CLUSTER_NAME} --resource-group ${RESOURCE_GROUP} --cluster-type connectedClusters | jq --arg extType ${EXTENSION_TYPE} 'map(select(.extensionType == $extType)) | .[] | .identity.principalId' -r
```

---

### Configure blob storage account for Extension Identity

#### Add Extension Identity permissions to a storage account

1. Navigate to storage account in the Azure portal.
1. Select **Access Control (IAM)**.
1. Select **Add+ -> Add role assignment**.
1. Select **Storage Blob Data Owner**, then select **Next**.
1. Select **+Select Members**.
1. To add your principal ID to the **Selected Members:** list, paste the ID and select **+** next to the identity.
1. Click **Select**.
1. To review and assign permissions, select **Next**, then select **Review + Assign**.

## Create a Cloud Ingest Persistent Volume Claim (PVC)

1. Create a file named `cloudIngestPVC.yaml` with the following contents. Edit the `metadata::name` line and create a name for your Persistent Volume Claim. This name is referenced on the last line of `deploymentExample.yaml` in the next step. Also, update the `metadata::namespace` value with your intended consuming pod. If you don't have an intended consuming pod, the `metadata::namespace` value is `default`.

   [!INCLUDE [lowercase-note](includes/lowercase-note.md)]

   ```yaml
   kind: PersistentVolumeClaim
   apiVersion: v1
   metadata:
     ### Create a name for your PVC ###
     name: <create-persistent-volume-claim-name-here>
     ### Use a namespace that matched your intended consuming pod, or "default" ###
     namespace: <intended-consuming-pod-or-default-here>
   spec:
     accessModes:
       - ReadWriteMany
     resources:
       requests:
         storage: 2Gi
     storageClassName: cloud-backed-sc
   ```

1. To apply `cloudIngestPVC.yaml`, run:

    ```bash
    kubectl apply -f "cloudIngestPVC.yaml"
    ```

## Attach sub-volume to Edge Volume

To create a sub-volume using extension identity to connect to your storage account container, use the following process:

1. Get the name of your Edge Volume using the following command:

    ```bash
    kubectl get edgevolumes
    ```

1. Create a file named `edgeSubvolume.yaml` and copy the following contents. These variables must be updated with your information:

   [!INCLUDE [lowercase-note](includes/lowercase-note.md)]

   - `metadata::name`: Create a name for your sub-volume.
   - `spec::edgevolume`: This name was retrieved from the previous step using `kubectl get edgevolumes`.
   - `spec::path`: Create your own subdirectory name under the mount path. Note that the following example already contains an example name (`exampleSubDir`). If you change this path name, line 33 in `deploymentExample.yaml` must be updated with the new path name. If you choose to rename the path, don't use a preceding slash.
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
      storageaccountendpoint: "https://<STORAGE ACCOUNT NAME>.blob.core.windows.net/"
      container: <your-blob-storage-account-container-name>
      ingestPolicy: edgeingestpolicy-default # Optional: See the following instructions if you want to update the ingestPolicy with your own configuration
    ```

2. To apply `edgeSubvolume.yaml`, run:

   ```bash
   kubectl apply -f "edgeSubvolume.yaml"
   ```

### Optional: Modify the `ingestPolicy` from the default

1. If you want to change the `ingestPolicy` from the default `edgeingestpolicy-default`, create a file named `myedgeingest-policy.yaml` with the following contents. The following variables must be updated with your preferences:

   [!INCLUDE [lowercase-note](includes/lowercase-note.md)]

   - `metadata::name`: Create a name for your **ingestPolicy**. This name must be updated and referenced in the `spec::ingestPolicy` section of your `edgeSubvolume.yaml`.
   - `spec::ingest::order`: The order in which dirty files are uploaded. This is best effort, not a guarantee (defaults to **oldest-first**). Options for order are: **oldest-first** or **newest-first**.
   - `spec::ingest::minDelaySec`: The minimum number of seconds before a dirty file is eligible for ingest (defaults to 60). This number can range between 0 and 31536000.
   - `spec::eviction::order`: How files are evicted (defaults to **unordered**). Options for eviction order are: **unordered** or **never**.
   - `spec::eviction::minDelaySec`: The number of seconds before a clean file is eligible for eviction (defaults to 300). This number can range between 0 and 31536000.

    ```yaml
    apiVersion: arccontainerstorage.azure.net/v1
    kind: EdgeIngestPolicy
    metadata:
      name: <create-a-policy-name-here> # This must be updated and referenced in the spec::ingestPolicy section of the edgeSubvolume.yaml
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

1. To configure a generic single pod (Kubernetes native application) against the Persistent Volume Claim (PVC), create a file named `deploymentExample.yaml` with the following contents. Modify the `containers::name` and `volumes::persistentVolumeClaim::claimName` values. If you updated the path name from `edgeSubvolume.yaml`, `exampleSubDir` on line 33 must be updated with your new path name.

   [!INCLUDE [lowercase-note](includes/lowercase-note.md)]

   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: cloudingestedgevol-deployment ### This must be unique for each deployment you choose to create.
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
               ### This name must match the volumes::name attribute below ###
               - name: wyvern-volume
                 ### This mountPath is where the PVC is attached to the pod's filesystem ###
                 mountPath: "/data"
         volumes:
            ### User-defined 'name' that's used to link the volumeMounts. This name must match volumeMounts::name as previously specified. ###
           - name: wyvern-volume
             persistentVolumeClaim:
               ### This claimName must refer to your PVC metadata::name (Line 5)
               claimName: <your-pvc-metadata-name-from-line-5-of-pvc-yaml>
   ```

1. To apply `deploymentExample.yaml`, run:

   ```bash
   kubectl apply -f "deploymentExample.yaml"
   ```

1. Use `kubectl get pods` to find the name of your pod. Copy this name to use in the next step.

   > [!NOTE]
   > Because `spec::replicas` from `deploymentExample.yaml` was specified as `2`, two pods appear using `kubectl get pods`. You can choose either pod name to use for the next step.

1. Run the following command and replace `POD_NAME_HERE` with your copied value from the last step:

   ```bash
   kubectl exec -it POD_NAME_HERE -- sh
   ```

1. Change directories into the `/data` mount path as specified from your `deploymentExample.yaml`.

1. You should see a directory with the name you specified as your `path` in Step 2 of the [Attach sub-volume to Edge Volume](#attach-sub-volume-to-edge-volume) section. Change directories into `/YOUR_PATH_NAME_HERE`, replacing the `YOUR_PATH_NAME_HERE` value with your details.

1. As an example, create a file named `file1.txt` and write to it using `echo "Hello World" > file1.txt`.

1. In the Azure portal, navigate to your storage account and find the container specified from Step 2 of [Attach sub-volume to Edge Volume](#attach-sub-volume-to-edge-volume). When you select your container, you should find `file1.txt` populated within the container. If the file hasn't yet appeared, wait approximately 1 minute; Edge Volumes waits a minute before uploading.

## Next steps

After you complete these steps, you can begin monitoring your deployment using Azure Monitor and Kubernetes Monitoring or 3rd-party monitoring with Prometheus and Grafana.

[Monitor your deployment](monitor-deployment-edge-volumes.md)
