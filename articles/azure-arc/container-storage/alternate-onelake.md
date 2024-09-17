---
title: Alternate OneLake configuration for Cloud Ingest Edge Volumes
description: Learn about an alternate Cloud Ingest Edge Volumes configuration.
author: sethmanheim
ms.author: sethm
ms.topic: how-to
ms.custom: linux-related-content
ms.date: 08/26/2024
---

# Alternate: OneLake configuration for Cloud Ingest Edge Volumes

This article describes an alternate configuration for [Cloud Ingest Edge Volumes](cloud-ingest-edge-volume-configuration.md) (blob upload with local purge) for OneLake Lakehouses.

This configuration is an alternative option that you can use with key-based authentication methods. You should review the recommended configuration using the system-assigned managed identities described in [Cloud Ingest Edge Volumes configuration](cloud-ingest-edge-volume-configuration.md).

## Configure OneLake for Extension Identity

### Add Extension Identity to OneLake workspace

1. Navigate to your OneLake portal; for example, `https://youraccount.powerbi.com`.
1. Create or navigate to your workspace.
   :::image type="content" source="media/onelake-workspace.png" alt-text="Screenshot showing workspace ribbon in portal." lightbox="media/onelake-workspace.png":::
1. Select **Manage Access**.
   :::image type="content" source="media/onelake-manage-access.png" alt-text="Screenshot showing manage access screen in portal." lightbox="media/onelake-manage-access.png":::
1. Select **Add people or groups**.
1. Enter your extension name from your Azure Container Storage enabled by Azure Arc installation. This must be unique within your tenant.
   :::image type="content" source="media/add-extension-name.png" alt-text="Screenshot showing add extension name screen." lightbox="media/add-extension-name.png":::
1. Change the drop-down for permissions from **Viewer** to **Contributor**.
   :::image type="content" source="media/onelake-set-contributor.png" alt-text="Screenshot showing set contributor screen." lightbox="media/onelake-set-contributor.png":::
1. Select **Add**.

### Create a Cloud Ingest Persistent Volume Claim (PVC)

1. Create a file named `cloudIngestPVC.yaml` with the following contents. Modify the `metadata::name` value with a name for your Persistent Volume Claim. This name is referenced on the last line of `deploymentExample.yaml` in the next step. You must also update the `metadata::namespace` value with your intended consuming pod. If you don't have an intended consuming pod, the `metadata::namespace` value is `default`.

   [!INCLUDE [lowercase-note](includes/lowercase-note.md)]

   ```yaml
   kind: PersistentVolumeClaim
   apiVersion: v1
   metadata:
     ### Create a nane for your PVC ###
     name: <create-a-pvc-name-here>
     ### Use a namespace that matches your intended consuming pod, or "default" ###
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

### Attach sub-volume to Edge Volume

You can use the following process to create a sub-volume using Extension Identity to connect to your OneLake LakeHouse.

1. Get the name of your Edge Volume using the following command:

   ```bash
   kubectl get edgevolumes
   ```

1. Create a file named `edgeSubvolume.yaml` and copy/paste the following contents. The following variables must be updated with your information:

   [!INCLUDE [lowercase-note](includes/lowercase-note.md)]

   - `metadata::name`: Create a name for your sub-volume.
   - `spec::edgevolume`: This name was retrieved from the previous step using `kubectl get edgevolumes`.
   - `spec::path`: Create your own subdirectory name under the mount path. Note that the following example already contains an example name (`exampleSubDir`). If you change this path name, line 33 in `deploymentExample.yaml` must be updated with the new path name. If you choose to rename the path, don't use a preceding slash.
   - `spec::container`: Details of your One Lake Data Lake Lakehouse (for example, `<WORKSPACE>/<DATA_LAKE>/Files`).
   - `spec::storageaccountendpoint`: Your storage account endpoint is the prefix of your Power BI web link. For example, if your OneLake page is `https://contoso-motors.powerbi.com/`, then your endpoint is `https://contoso-motors.dfs.fabric.microsoft.com`.

    ```yaml
    apiVersion: "arccontainerstorage.azure.net/v1"
    kind: EdgeSubvolume
    metadata:
      name: <create-a-subvolume-name-here>
    spec:
      edgevolume: <your-edge-volume-name-here>
      path: exampleSubDir # If you change this path, line 33 in deploymentExample.yaml must to be updated. Don't use a preceding slash.
      auth:
        authType: MANAGED_IDENTITY
      storageaccountendpoint: "https://<Your AZ Site>.dfs.fabric.microsoft.com/" # Your AZ site is the root of your Power BI OneLake interface URI, such as https://contoso-motors.powerbi.com
      container: "<WORKSPACE>/<DATA_LAKE>/Files" # Details of your One Lake Data Lake Lakehouse
      ingestPolicy: edgeingestpolicy-default # Optional: See the following instructions if you want to update the ingestPolicy with your own configuration
    ```

2. To apply `edgeSubvolume.yaml`, run:

   ```bash
   kubectl apply -f "edgeSubvolume.yaml"
   ```

#### Optional: Modify the `ingestPolicy` from the default

1. If you want to change the `ingestPolicy` from the default `edgeingestpolicy-default`, create a file named `myedgeingest-policy.yaml` with the following contents. The following variables must be updated with your preferences:

   [!INCLUDE [lowercase-note](includes/lowercase-note.md)]

   - `metadata::name`: Create a name for your `ingestPolicy`. This name must be updated and referenced in the `spec::ingestPolicy` section of your `edgeSubvolume.yaml`.
   - `spec::ingest::order`: The order in which dirty files are uploaded. This is best effort, not a guarantee (defaults to `oldest-first`). Options for order are: `oldest-first` or `newest-first`.
   - `spec::ingest::minDelaySec`: The minimum number of seconds before a dirty file is eligible for ingest (defaults to 60). This number can range between 0 and 31536000.
   - `spec::eviction::order`: How files are evicted (defaults to `unordered`). Options for eviction order are: `unordered` or `never`.
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

1. To configure a generic single pod (Kubernetes native application) against the Persistent Volume Claim (PVC), create a file named `deploymentExample.yaml` with the following contents. Replace the values for `containers::name` and `volumes::persistentVolumeClaim::claimName` with your own. If you updated the path name from `edgeSubvolume.yaml`, `exampleSubDir` on line 33 must be updated with your new path name.

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
               ### This name must match the following volumes::name attribute ###
               - name: wyvern-volume
                 ### This mountPath is where the PVC is attached to the pod's filesystem ###
                 mountPath: "/data"
         volumes:
            ### User-defined name that's used to link the volumeMounts. This name must match volumeMounts::name as previously specified. ###
           - name: wyvern-volume
             persistentVolumeClaim:
               ### This claimName must refer to your PVC metadata::name
               claimName: <your-pvc-metadata-name-from-line-5-of-pvc-yaml>
   ```

1. To apply `deploymentExample.yaml`, run:

   ```bash
   kubectl apply -f "deploymentExample.yaml"
   ```

1. Use `kubectl get pods` to find the name of your pod. Copy this name, as you need it in the next step.

   > [!NOTE]
   > Because `spec::replicas` from `deploymentExample.yaml` was specified as `2`, two pods appear using `kubectl get pods`. You can choose either pod name to use for the next step.

1. Run the following command and replace `POD_NAME_HERE` with your copied value from the previous step:

   ```bash
   kubectl exec -it POD_NAME_HERE -- sh
   ```

1. Change directories into the `/data` mount path as specified in `deploymentExample.yaml`.

1. You should see a directory with the name you specified as your `path` in Step 2 of the [Attach sub-volume to Edge Volume](#attach-sub-volume-to-edge-volume) section. Now, `cd` into `/YOUR_PATH_NAME_HERE`, replacing `YOUR_PATH_NAME_HERE` with your details.

1. As an example, create a file named `file1.txt` and write to it using `echo "Hello World" > file1.txt`.

1. In the Azure portal, navigate to your storage account and find the container specified from step 2 of [Attach sub-volume to Edge Volume](#attach-sub-volume-to-edge-volume). When you select your container, you should find `file1.txt` populated within the container. If the file hasn't yet appeared, wait approximately 1 minute; Edge Volumes waits a minute before uploading.

## Next steps

After you complete these steps, begin monitoring your deployment using Azure Monitor and Kubernetes Monitoring, or 3rd-party monitoring with Prometheus and Grafana.

[Monitor Your Deployment](monitor-deployment-edge-volumes.md)
