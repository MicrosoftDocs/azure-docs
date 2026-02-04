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

This article shows you how to remove Azure Container Storage by deleting the extension instance for Azure Kubernetes Service (AKS). To clean up resources, you can also delete the AKS cluster or entire resource group.

> [!IMPORTANT]
> This article applies to [Azure Container Storage (version 2.x.x)](container-storage-introduction.md). If you have Azure Container Storage (version 1.x.x) installed on your AKS cluster, remove it by following [these steps](remove-container-storage-version-1.md).

## Delete extension instance

Follow these steps to remove Azure Container Storage from your AKS cluster.

1. Delete all Persistent Volume Claims (PVCs) and Persistent Volumes (PVs) before uninstalling the extension. Removing Azure Container Storage without cleaning up these resources could disrupt your running workloads. To avoid disruptions, ensure that there are no existing workloads or storage classes relying on Azure Container Storage.

1. Delete the extension by running the following Azure CLI command. Be sure to replace `<cluster-name>` and `<resource-group>` with your own values.

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

## Delete AKS cluster

To delete an AKS cluster and all persistent volumes, run the following Azure CLI command. Replace `<resource-group>` and `<cluster-name>` with your own values.

```azurecli
az aks delete --resource-group <resource-group> --name <cluster-name>
```

If the AKS cluster was created with Terraform, you can also remove it by running the following command.

```bash
terraform destroy
```

This command deletes all resources that Terraform manages in the current working directory. This includes the cluster, the resource group, and the Azure Container Storage extension. Run this command only when you intend to remove the entire deployment.

## Delete resource group

You can also use the [`az group delete`](/cli/azure/group) command to delete the resource group and all resources it contains. Replace `<resource-group>` with your resource group name.

```azurecli
az group delete --name <resource-group>
```

## See also

- [What is Azure Container Storage?](container-storage-introduction.md)
