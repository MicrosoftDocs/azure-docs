---
title: Remove Azure Container Storage
description: Remove Azure Container Storage by deleting the extension instance for Azure Kubernetes Service (AKS). To clean up resources, optionally delete the AKS cluster or entire resource group.
author: khdownie
ms.service: azure-container-storage
ms.date: 09/10/2025
ms.author: kendownie
ms.topic: how-to
# Customer intent: "As a cloud administrator, I want to remove Azure Container Storage from my AKS environment, so that I can clean up resources and ensure no unnecessary costs are incurred for unused components."
---

# Remove Azure Container Storage

This article shows how to remove Azure Container Storage components from your Azure Kubernetes Service (AKS) cluster. To clean up resources, you can also delete the AKS cluster or the entire resource group.

> [!IMPORTANT]
> This article applies to [Azure Container Storage (version 2.x.x)](container-storage-introduction.md). If you have Azure Container Storage (version 1.x.x) installed on your AKS cluster, remove it by following [these steps](remove-container-storage-version-1.md).

## Remove the entire Azure Container Storage installation (installer and CSI drivers)

Delete all persistent volume claims (PVCs) and persistent volumes (PVs) before uninstalling the extension. Removing Azure Container Storage without cleaning up these resources can disrupt running workloads. Ensure no workloads or StorageClass objects rely on Azure Container Storage before you continue. 

Remove Azure Container Storage entirely by running the following Azure CLI command. Replace `<cluster-name>` and `<resource-group>` with your own values.

```azurecli
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
