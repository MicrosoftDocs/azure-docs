---
title: Remove Azure Container Storage
description: Remove Azure Container Storage by deleting the extension instance for Azure Kubernetes Service (AKS). To clean up resources, optionally delete the AKS cluster or entire resource group.
author: khdownie
ms.service: azure-container-storage
ms.date: 10/30/2026
ms.author: kendownie
ms.topic: how-to
# Customer intent: "As a cloud administrator, I want to remove Azure Container Storage from my AKS environment, so that I can clean up resources and ensure no unnecessary costs are incurred for unused components."
---

# Remove Azure Container Storage

This article shows how to remove Azure Container Storage components from your Azure Kubernetes Service (AKS) cluster. To clean up resources, you can also delete the AKS cluster or the entire resource group.

> [!IMPORTANT]
> This article applies to [Azure Container Storage (version 2.x.x)](container-storage-introduction.md). If you have Azure Container Storage (version 1.x.x) installed on your AKS cluster, remove it by following [these steps](remove-container-storage-version-1.md).

<a id="remove-distributed-accelerator-for-cloud-storage"></a>

## Remove distributed accelerator for cloud storage

Before removing distributed accelerator for cloud storage:

1. Stop or reconfigure workloads that use the cache discovery service.
1. Confirm that authoritative model files and datasets are present in Azure Blob Storage.
1. Stop or wait for active warm-up workloads.
1. Record diagnostics if you're removing distributed accelerator for cloud storage because of a failure.

Delete each Cache resource while the controller is still running so that it can clean up the cache-server resources. Replace the values with the cache you want to remove, and repeat for every Cache resource before removing the controller:

```bash
CACHE_NAMESPACE=<cache-namespace>
CACHE_NAME=<cache-name>

kubectl delete cache "$CACHE_NAME" --namespace "$CACHE_NAMESPACE" --wait=true
kubectl get cache --namespace "$CACHE_NAMESPACE"
kubectl get pods --namespace "$CACHE_NAMESPACE" --selector app=cacheserver
```

Confirm that all Cache resources and cache-server pods are removed before disabling the managed extension. Don't uninstall the extension's Helm release directly.

### Disable the managed extension

The extension manages the NVMe prerequisite DaemonSet. Don't remove that DaemonSet separately; disabling DACS removes it.

Disable only distributed accelerator for cloud storage while leaving Azure Container Storage persistent-volume storage types installed:

```azurecli
az aks update \
    --name <cluster-name> \
    --resource-group <resource-group> \
    --disable-azure-container-storage distributedAccelerator
```

Disabling DACS removes its managed extension, controller, and extension-managed NVMe prerequisite DaemonSet in `kube-system`, but retains the Cache CRD.

### Verify removal

This cleanup removes ephemeral cached copies and DACS components. It doesn't delete source model files or datasets in Azure Blob Storage.

Verify that no Cache resources or cache-server pods remain and that the controller and managed prerequisite DaemonSet are removed:

```bash
kubectl get cache -A
kubectl get pods -A --selector app=cacheserver
kubectl get deployment dacs-manager --namespace kube-system --ignore-not-found
kubectl get daemonset dacs-prereq --namespace kube-system --ignore-not-found
```

Confirm that no extension named `distributedaccelerator` remains:

```azurecli
az k8s-extension list \
    --cluster-type managedClusters \
    --cluster-name <cluster-name> \
    --resource-group <resource-group> \
    --query "[?name=='distributedaccelerator'].{name:name,state:provisioningState}" \
    --output table
```

> [!WARNING]
> Don't delete the DACS custom resource definition (CRD) manually unless Azure Support directs you to do so. Deleting the CRD deletes every Cache resource in the cluster.

After removal, delete DACS-only node labels, identities, role assignments, secrets, and monitoring rules that aren't used by another workload. Don't remove shared identities or Blob role assignments without checking their other uses.

Delete the cache namespace only if it was dedicated to DACS and contains no resources you need to keep.

## Remove the entire Azure Container Storage installation (installer and CSI drivers)

Delete all persistent volume claims (PVCs) and persistent volumes (PVs) before uninstalling the extension. Removing Azure Container Storage without cleaning up these resources can disrupt running workloads. Ensure no workloads or StorageClass objects rely on Azure Container Storage before you continue. 

Remove Azure Container Storage entirely by running the following Azure CLI command. Replace `<cluster-name>` and `<resource-group>` with your own values.

```azurecli-interactive
az aks update -n <cluster-name> -g <resource-group> --disable-azure-container-storage
```

### Remove the extension with Terraform

If you provisioned Azure Container Storage with Terraform, remove the corresponding extension resource from your configuration and apply the change so the result matches the CLI workflow.

1. Delete the `azurerm_kubernetes_cluster_extension` block (or set `count = 0`) in your Terraform configuration and save the file.

1. Review the plan to confirm Terraform destroys only the extension resource.

    ```bash
    terraform plan
    ```

1. Apply the plan to delete the extension. Terraform displays the same outcome as the CLI command: the extension resource is removed and AKS no longer reports Azure Container Storage as enabled.

    ```bash
    terraform apply
    ```

## Re-enable Azure Container Storage

If you previously removed CSI drivers for one or more storage types, you can re-enable the storage type by running the following Azure CLI command.

```azurecli
az aks update -n <cluster-name> -g <resource-group> --enable-azure-container-storage <storage-type>
```

Expected behavior:

- Specifying a storage type is optional. When no storage type is provided, only the Azure Container Storage installer component is installed, if it isn't already present.
- When a storage type is specified, the corresponding CSI driver is installed. If a StorageClass for that storage type already exists, only the driver is installed; otherwise, a default StorageClass is created as part of the installation.

## Delete the AKS cluster

To delete an AKS cluster and all persistent volumes, run the following Azure CLI command. Replace `<resource-group>` and `<cluster-name>` with your own values.

```azurecli
az aks delete --resource-group <resource-group> --name <cluster-name>
```

AKS normally deletes its managed node resource group when it deletes the cluster. If a separate check of that group's absence returns `Forbidden`, record that verification is incomplete: the error proves neither presence nor absence. Have an administrator with read access to that node resource group verify removal if needed. An empty inventory of the cluster's resource group doesn't verify the separate node resource group's absence.

If the AKS cluster was created with Terraform, you can also remove it by running the following command.

```azurecli
terraform destroy
```

This command deletes all resources that Terraform manages in the current working directory. This includes the cluster, the resource group, and the Azure Container Storage extension. Run this command only when you intend to remove the entire deployment.

## Delete the resource group

You can also use the [`az group delete`](/cli/azure/group) command to delete the resource group and all resources it contains. Replace `<resource-group>` with your resource group name.

```azurecli
az group delete --name <resource-group>
```

## See also

- [What is Azure Container Storage?](container-storage-introduction.md)
- [Use Azure Container Storage with local NVMe](use-container-storage-with-local-disk.md)
- [Use Azure Container Storage with Elastic SAN](use-container-storage-with-elastic-san.md)
