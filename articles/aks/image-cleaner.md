---
title: Use Image Cleaner on Azure Kubernetes Service (AKS)
description: Learn how to use Image Cleaner to clean up stale images on Azure Kubernetes Service (AKS)
ms.author: nickoman
author: nickomang
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 10/22/2023
---

# Use Image Cleaner to clean up stale images on your Azure Kubernetes Service (AKS) cluster

It's common to use pipelines to build and deploy images on Azure Kubernetes Service (AKS) clusters. While great for image creation, this process often doesn't account for the stale images left behind and can lead to image bloat on cluster nodes. These images might contain vulnerabilities, which might create security issues. To remove security risks in your clusters, you can clean these unreferenced images. Manually cleaning images can be time intensive. Image Cleaner performs automatic image identification and removal, which mitigates the risk of stale images and reduces the time required to clean them up.

> [!NOTE]
> Image Cleaner is a feature based on [Eraser](https://eraser-dev.github.io/eraser).
> On an AKS cluster, the feature name and property name is `Image Cleaner`, while the relevant Image Cleaner pods' names contain `Eraser`.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
* Azure CLI version 2.49.0 or later. Run `az --version` to find your version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

## Limitations

Image Cleaner doesn't yet support Windows node pools or AKS virtual nodes.

## How Image Cleaner works

After you enable Image Cleaner, there will be a controller manager pod named `eraser-controller-manager` deployed to your cluster.

:::image type="content" source="./media/image-cleaner/Image-cleaner-1015.png" alt-text="Screenshot of a diagram showing ImageCleaner's workflow. The ImageCleaner pods running on the cluster can generate an ImageList, or manual input can be provided.":::

With Image Cleaner, you can choose between manual and automatic mode and the following configuration options:

## Configuration options

|Name|Description|Required|
|----|-----------|--------|
|`--enable-image-cleaner`|Enable the Image Cleaner feature for an AKS cluster|Yes, unless disable is specified|
|`--disable-image-cleaner`|Disable the Image Cleaner feature for an AKS cluster|Yes, unless enable is specified|
|`--image-cleaner-interval-hours`|This parameter determines the interval time (in hours) Image Cleaner uses to run. The default value for Azure CLI is one week, the minimum value is 24 hours and the maximum is three months.|Not required for Azure CLI, required for ARM template or other clients|

### Automatic mode
Once `eraser-controller-manager` is deployed,

  - it will start first time's clean up immediately and create worker pods per node named like `eraser-aks-xxxxx`
  - inside each worker pod, there are 3 containers:
    - collector: collect unused images
    - trivy-scanner: leverage [trivy](https://github.com/aquasecurity/trivy) to scan image vulnerabilities
    - remover: remove unused images with vulnerabilities 
  - after clean up, worker pod will be deleted and its next schedule up is after the `--image-cleaner-interval-hours` you have set

### Manual mode

You can also manually trigger the clean up by defining a CRD object `ImageList`. Then `eraser-contoller-manager` will create worker pod per node as well to finish manual removal.

> [!NOTE]
> After disabling Image Cleaner, the old configuration still exists. This means if you enable the feature again without explicitly passing configuration, the existing value is used instead of the default.

## Enable Image Cleaner on your AKS cluster

### Enable Image Cleaner on a new cluster

* Enable Image Cleaner on a new AKS cluster using the [`az aks create`][az-aks-create] command with the `--enable-image-cleaner` parameter.

    ```azurecli-interactive
    az aks create \
      --resource-group myResourceGroup \
      --name myManagedCluster \
      --enable-image-cleaner
    ```

### Enable Image Cleaner on an existing cluster

* Enable Image Cleaner on an existing AKS cluster using the [`az aks update`][az-aks-update] command.

    ```azurecli-interactive
    az aks update \
      --resource-group myResourceGroup \
      --name myManagedCluster \
      --enable-image-cleaner
    ```

### Update the Image Cleaner interval on a new or existing cluster

* Update the Image Cleaner interval on a new or existing AKS cluster using the  `--image-cleaner-interval-hours` parameter.

    ```azurecli-interactive
    # Create a new cluster with specifying the interval
    az aks create \
      --resource-group myResourceGroup \
      --name myManagedCluster \
      --enable-image-cleaner \
      --image-cleaner-interval-hours 48

    # Update the interval on an existing cluster
    az aks update \
      --resource-group myResourceGroup \
      --name myManagedCluster \
      --enable-image-cleaner \
      --image-cleaner-interval-hours 48
    ```

## Manually remove images using Image Cleaner

* Example to manually remove image `docker.io/library/alpine:3.7.3` if it is unused.

    ```bash
    cat <<EOF | kubectl apply -f -
    apiVersion: eraser.sh/v1
    kind: ImageList
    metadata:
      name: imagelist
    spec:
      images:
        - docker.io/library/alpine:3.7.3
    EOF
    ```

## Image exclusion list

Images specified in the exclusion list aren't removed from the cluster. Image Cleaner supports system and user-defined exclusion lists. It's not supported to edit the system exclusion list.

### Check the system exclusion list

* Check the system exclusion list using the following `kubectl get` command.

     ```bash
    kubectl get -n kube-system configmap eraser-system-exclusion -o yaml
    ```

### Create a user-defined exclusion list

1. Create a sample JSON file to contain excluded images.

    ```bash
    cat > sample.json <<EOF
    {"excluded": ["excluded-image-name"]}
    EOF
    ```

2. Create a `configmap` using the sample JSON file using the following `kubectl create` and `kubectl label` command.

    ```bash
    kubectl create configmap excluded --from-file=sample.json --namespace=kube-system
    kubectl label configmap excluded eraser.sh/exclude.list=true -n kube-system
    ```

## Disable Image Cleaner

* Disable Image Cleaner on your cluster using the [`az aks update`][az-aks-update] command with the `--disable-image-cleaner` parameter.

    ```azurecli-interactive
    az aks update \
      --resource-group myResourceGroup \
      --name myManagedCluster \
      --disable-image-cleaner
    ```

## FAQ

### How to check eraser version is using?
```
kubectl get configmap -n kube-system eraser-manager-config | grep tag -C 3
```

### Does Image Cleaner support other vulnerability scanners besides trivy-scanner?
No.

### Can I specify vulnerability levels for images to clean?
Currently no. The default settings for vulnerablity levels are:
- `LOW`
- `MEDIUM`
- `HIGH`
- `CRITICAL`

And they cannot be customized.

### How to review images were cleaned up by Image Cleaner?

Image logs are stored in worker pod - `eraser-aks-xxxxx` and

- when `eraser-aks-xxxxx` is alive, you can run below commands to view deletion logs.
```bash
kubectl logs -n kube-system <worker-pod-name> -c collector
kubectl logs -n kube-system <worker-pod-name> -c trivy-scanner
kubectl logs -n kube-system <worker-pod-name> -c remover
```

- when `eraser-aks-xxxxx` was deleted, you can follow these steps to enable the [Azure Monitor add-on](./monitor-aks.md) and use the Container Insights pod log table to view historical pod logs.
  1. Ensure Azure Monitoring is enabled on your cluster. For detailed steps, see [Enable Container Insights on AKS clusters](../azure-monitor/containers/container-insights-enable-aks.md#existing-aks-cluster).

  2. Get the Log Analytics resource ID using the [`az aks show`][az-aks-show] command.

     ```azurecli
     az aks show -g myResourceGroup -n myManagedCluster
     ```

     After a few minutes, the command returns JSON-formatted information about the solution, including the workspace resource ID.

     ```json
     "addonProfiles": {
       "omsagent": {
         "config": {
           "logAnalyticsWorkspaceResourceID": "/subscriptions/<WorkspaceSubscription>/resourceGroups/<DefaultWorkspaceRG>/providers/Microsoft.OperationalInsights/workspaces/<defaultWorkspaceName>"
         },
         "enabled": true
       }
     }
     ```

  3. In the Azure portal, search for the workspace resource ID, then select **Logs**.

  4. Copy this query into the table, replacing `name` with `eraser-aks-xxxxx` (worker pod name).

     ```kusto
     let startTimestamp = ago(1h);
     KubePodInventory
     | where TimeGenerated > startTimestamp
     | project ContainerID, PodName=Name, Namespace
     | where PodName contains "name" and Namespace startswith "kube-system"
     | distinct ContainerID, PodName
     | join
     (
         ContainerLog
         | where TimeGenerated > startTimestamp
     )
     on ContainerID
     // at this point before the next pipe, columns from both tables are available to be "projected". Due to both
     // tables having a "Name" column, we assign an alias as PodName to one column which we actually want
     | project TimeGenerated, PodName, LogEntry, LogEntrySource
     | summarize by TimeGenerated, LogEntry
     | order by TimeGenerated desc
     ```

  5. Select **Run**. Any deleted image logs appear in the **Results** area.

     :::image type="content" source="media/image-cleaner/eraser-log-analytics.png" alt-text="Screenshot showing deleted image logs in the Azure portal." lightbox="media/image-cleaner/eraser-log-analytics.png":::

<!-- LINKS -->

[azure-cli-install]: /cli/azure/install-azure-cli
[az-aks-create]: /cli/azure/aks#az_aks_create
[az-aks-update]: /cli/azure/aks#az_aks_update
[trivy]: https://github.com/aquasecurity/trivy
[az-aks-show]: /cli/azure/aks#az_aks_show
