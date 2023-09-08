---
title: Enable soft delete policy
description: Learn how to enable a soft delete policy in your Azure Container Registry for recovering accidentally deleted artifacts for a set retention period.
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 04/19/2022
ms.author: tejaswikolli
---

# Enable soft delete policy in Azure Container Registry (Preview)

Azure Container Registry (ACR) allows you to enable the *soft delete policy* to recover any accidentally deleted artifacts for a set retention period.


:::image type="content" source="./media/container-registry-delete/02-soft-delete.png" alt-text="Diagram of soft delete artifacts lifecycle.":::


This feature is available in all the service tiers (also known as SKUs). For information about registry service tiers, see [Azure Container Registry service tiers](container-registry-skus.md).

> [!NOTE]
>The soft deleted artifacts are billed as per active sku pricing for storage.

The article gives you an overview of the soft delete policy and walks you through the step by step process to enable the soft delete policy using Azure CLI and Azure portal.

You can use the Azure Cloud Shell or a local installation of the Azure CLI to run the command examples in this article. If you'd like to use it locally, version 2.0.74 or later is required. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

## Prerequisites   

* The user will require following permissions (at registry level) to perform soft delete operations:

  | Permission | Description |
  |---|---|
  | Microsoft.ContainerRegistry/registries/deleted/read | List soft-deleted artifacts |
  | Microsoft.ContainerRegistry/registries/deleted/restore/action | Restore soft-deleted artifact |

## About soft delete policy 

The soft delete policy can be enabled/disabled at your convenience. 

Once you enable the soft delete policy, ACR manages the deleted artifacts as the soft deleted artifacts with a set retention period. Thereby you have ability to list, filter, and restore the soft deleted artifacts. Once the retention period is complete, all the soft deleted artifacts are auto-purged. 

## Retention period

The default retention period is seven days. It's possible to set the retention period value between one to 90 days. The user can set, update and change the retention policy value. The soft deleted artifacts will expire once the retention period is complete. 

## Auto-purge

The auto-purge runs every 24 hours. The auto-purge always considers the current value of `retention days` before permanently deleting the soft deleted artifacts. 
For example, after five days of soft deleting the artifact, if the user changes the value of retention days from seven to 14 days, the artifact will only expire after 14 days from the initial soft delete.

## Preview limitations 

* ACR currently doesn't support manually purging soft deleted artifacts. 
* The soft delete policy doesn't support a geo-replicated registry.
* ACR doesn't allow enabling both the retention policy and the soft delete policy. See [retention policy for untagged manifests.](container-registry-retention-policy.md)

## Known issues

>* Enabling the soft delete policy with Availability Zones through ARM template leaves the registry stuck in the `creation` state. If you see this error, please delete and recreate the registry disabling Geo-replication on the registry.
>* Accessing the manage deleted artifacts blade after disabling the soft delete policy will throw an error message with 405 status.
>* The customers with restrictions on permissions to restore, will see an issue as File not found.
## Enable soft delete policy for registry - CLI

1. Update soft delete policy for a given `MyRegistry` ACR with a retention period set between 1 to 90 days.

    ```azurecli-interactive
    az acr config soft-delete update -r MyRegistry --days 7 --status <enabled/disabled>
    ```

2. Show configured soft delete policy for a given `MyRegistry` ACR.

    ```azurecli-interactive
    az acr config soft-delete show -r MyRegistry 
    ```

### List the soft-delete artifacts- CLI

The `az acr repository list-deleted` commands enable fetching and listing of the soft deleted repositories. For more information use `--help`.

1. List the soft deleted repositories in a given `MyRegistry` ACR.

    ```azurecli-interactive
    az acr repository list-deleted -n MyRegistry
    ```

The `az acr manifest list-deleted` commands enable fetching and listing of the soft delete manifests.

2. List the soft deleted manifests of a `hello-world` repository in a given `MyRegistry` ACR.

    ```azurecli-interactive
    az acr manifest list-deleted -r MyRegistry -n hello-world
    ```

The `az acr manifest list-deleted-tags` commands  enable fetching and listing of the soft delete tags.

3. List the soft delete tags of a `hello-world` repository in a given `MyRegistry` ACR.

    ```azurecli-interactive
    az acr manifest list-deleted-tags -r MyRegistry -n hello-world
    ```

4. Filter the soft delete tags of a `hello-world` repository to match tag `latest` in a given `MyRegistry` ACR.

    ```azurecli-interactive
    az acr manifest list-deleted-tags -r MyRegistry -n hello-world:latest
    ```

### Restore the soft delete artifacts - CLI

The `az acr manifest restore` commands restore a single image by tag and digest. 

1. Restore the image of a `hello-world` repository by tag `latest`and digest `sha256:abc123` in a given `MyRegistry` ACR.

    ```azurecli-interactive
    az acr manifest restore -r MyRegistry -n hello-world:latest -d sha256:abc123
    ```

2. Restore the most recently deleted manifest of a `hello-world` repository by tag `latest` in a given `MyRegistry` ACR.

    ```azurecli-interactive
    az acr manifest restore -r MyRegistry -n hello-world:latest
    ```

Force restore will overwrite the existing tag with the same name in the repository. If the soft delete policy is enabled during force restore. The overwritten tag will be soft deleted. You can force restore with specific arguments `--force, -f`.  

3. Force restore the image of a `hello-world` repository by tag `latest`and digest `sha256:abc123` in a given `MyRegistry` ACR.

    ```azurecli-interactive
    az acr manifest restore -r MyRegistry -n hello-world:latest -d sha256:abc123 -f
    ```

> [!IMPORTANT]
>* Restoring a [manifest list](push-multi-architecture-images.md#manifest-list) won't recursively restore any underlying soft deleted manifests.
>* If you're restoring soft deleted [ORAS artifacts](container-registry-oras-artifacts.md), then restoring a subject doesn't recursively restore the referrer chain. Also, the subject has to be restored first, only then a referrer manifest is allowed to restore. Otherwise it throws an error.

## Enable soft delete policy for registry - Portal

You can also enable a registry's soft delete policy in the [Azure portal](https://portal.azure.com). 

1. Navigate to your Azure Container Registry. 
2. In the **Overview tab**, verify the status of the **Soft Delete** (Preview).
3. If the **Status** is **Disabled**, Select **Update**.



:::image type="content" source="./media/container-registry-soft-delete/01-soft-delete-disable.png" alt-text="Screenshot to view the soft delete policy.":::



4. Select the checkbox to **Enable Soft Delete**.
5. Select the number of days between `0` and `90` days to retain the soft deleted artifacts.
6.  Select **Save** to save your changes.



:::image type="content" source="./media/container-registry-soft-delete/02-soft-delete-policy.png" alt-text="Screenshot to enable soft delete policy.":::



### Restore the soft deleted artifacts - Portal

1. Navigate to your Azure Container Registry.
2. In the **Menu** section, Select **Services**, and Select **Repositories**.
3. In the **Repositories**, Select your preferred **Repository**.
4. Click on the **Manage deleted artifacts** to see all the soft deleted artifacts.

> [!NOTE]
> Once you enable the soft delete policy and perform actions such as untag a manifest or delete an artifact, You will be able to find these tags and artifacts in the Managed delete artifacts before the number of retention days expire.



:::image type="content" source="./media/container-registry-soft-delete/03-soft-delete-manage-deleted-artifacts.png" alt-text="Screenshot of manage deleted artifacts.":::



5.  Filter the deleted artifact you have to restore
6.  Select the artifact, and Click on the **Restore** in the right column.
7.  A **Restore Artifact** window pops up.



:::image type="content" source="./media/container-registry-soft-delete/04-managed-deleted-artifacts.png" alt-text="Screenshot to restore soft delete artifacts.":::



8. Select the tag to restore, here you have an option to choose, and recover any additional tags.
9. Click on **Restore**. 



:::image type="content" source="./media/container-registry-soft-delete/05-restore-artifact.png" alt-text="Screenshot of restore window.":::



### Restore from soft deleted repositories - Portal

1. Navigate to your Azure Container Registry.
2. In the **Menu** section, Select **Services**,
3. In the **Services** tab, Select **Repositories**.
4. In the **Repositories** tab, Click on **Manage Deleted Repositories**.



:::image type="content" source="./media/container-registry-soft-delete/06-manage-delete-repositories.png" alt-text="Screenshot of manage delete repositories.":::



5. Filter the deleted repository in the **Soft Deleted Repositories**(Preview).



:::image type="content" source="./media/container-registry-soft-delete/07-soft-delete-repositories.png" alt-text="Screenshot of soft delete repositories.":::



6. Select the deleted repository, filter the deleted artifact from  on the **Manage deleted artifacts**.
7. Select the artifact, and Click on the **Restore** in the right column.
8.  A **Restore Artifact** window pops up.



:::image type="content" source="./media/container-registry-soft-delete/08-soft-delete-repository-artifacts.png" alt-text="Screenshot to restore soft delete repositories.":::



9. Select the tag to restore, here you have an option to choose, and recover any additional tags.
10. Click on **Restore**. 



:::image type="content" source="./media/container-registry-soft-delete/09-soft-delete-restore.png" alt-text="Screenshot of restore window for soft delete repositories.":::



> [!IMPORTANT]
>*  Importing a soft deleted image at both source and target resources is blocked.
>*  Pushing an image to the soft deleted repository will restore the soft deleted repository.
>*  Pushing an image that shares a same manifest digest with the soft deleted image is not allowed. Instead restore the soft deleted image.

## Next steps

* Learn more about options to [delete images and repositories](container-registry-delete.md) in Azure Container Registry.
