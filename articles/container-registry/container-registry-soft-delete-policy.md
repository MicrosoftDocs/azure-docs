---
title: Enable soft delete policy
description: The overview of soft delete policy in your Azure container registry. How to recover any accidentally deleted artifacts in the Azure Container Registry.
ms.topic: article
ms.date: 04/19/2022
ms.author: tejaswikolli
---

# Enable soft-delete in Azure Container Registry(Preview)

The Azure Container Registry(ACR) introduces the soft-delete feature to fetch and restore any accidentally deleted artifacts.

If a user, a purge policy, or an indirect user event deletes the artifact, the soft-delete feature helps filter, fetch, and restore the artifact within a set retention period.

:::image type="content" source="./media/container-registry-delete/02-soft-delete.png" alt-text="soft-delete-artifacts-lifecycle":::

## Prerequisites   

* Install [Azure CLI](/cli/azure/install-azure-cli)
* The user will require following permissions (at registry level) to perform soft-delete operations:

  | Permission | Description |
  |---|---|
  | Microsoft.ContainerRegistry/registries/deleted/read | List soft-deleted artifacts |
  | Microsoft.ContainerRegistry/registries/deleted/restore/action | Restore soft-deleted artifact |
  |	Microsoft.ContainerRegistry/registries/deleted/purge/action | Purge soft-deleted artifacts |
  
## Soft-delete features

* The soft-delete feature can be enabled/disabled at any time.
* The soft-delete feature is available in all the service tiers (also known as SKUs).
* The soft-delete feature is available through the REST API and the Azure CLI interfaces.
* The soft-deleted artifacts are billed as per active sku pricing for storage.
* The deleted artifacts are listed as the soft-deleted artifacts, once you enable the soft-delete policy.
* The soft-delete feature enables fetching/listing of soft-deleted artifacts and thereby the ability to restore them.
* The soft-deleted artifacts are auto purged after a set retention period.

## Retention period

The default retention period is seven days. It's possible to set the retention period value between one to 90 days. The user can set and change the retention policy value using Azure CLI. The soft-deleted artifacts will be automatically purged once the retention period is complete. 

## Enable soft-delete policy for registry - CLI

1. Update soft-delete policy for a given `MyRegistry` ACR with a retention period set between 1 to 90 days.

```azurecli-interactive
az acr config soft-delete update -r MyRegistry --days 7 --status <enabled/disabled>
```

2. Show configured soft-delete policy for a given `MyRegistry` ACR.

```azurecli-interactive
az acr config soft-delete show -r MyRegistry 
```

## List the soft-delete artifacts- CLI

The `az acr repository list-deleted` commands enable fetching and listing of the soft-deleted repositories. For more information use `--help`.

1. List the soft-deleted repositories in a given `MyRegistry` ACR.

```azurecli-interactive
az acr repository list -n MyRegistry
```

The `az acr manifest list-deleted` commands enable fetching and listing of the soft-delete manifests.

2. List the soft-deleted manifests of a `hello-world` repository in a given `MyRegistry` ACR.

```azurecli-interactive
az acr manifest list-deleted -r MyRegistry -n hello-world
```

The `az acr manifest list-deleted-tags` commands  enable fetching and listing of the soft-delete tags.

3. List the soft-delete tags of a `hello-world` repository in a given `MyRegistry` ACR.

```azurecli-interactive
az acr manifest list-deleted-tags -r MyRegistry -n hello-world
```

4. Filter the soft-delete tags of a `hello-world` repository to match tag `latest` in a given `MyRegistry` ACR.

```azurecli-interactive
az acr manifest list-deleted-tags -r MyRegistry -n hello-world:latest
```

## Restore the soft-delete artifacts - CLI

The `az acr manifest restore` commands restore a single image by tag and digest. 

1. Restore the image of a `hello-world` repository by tag `latest`and digest `sha256:abc123` in a given `MyRegistry` ACR.

```azurecli-interactive
az acr manifest restore -r MyRegistry -n hello-world:latest -d sha256:abc123
```

2. Restore the most recently deleted manifest of a `hello-world` repository by tag `latest` in a given `MyRegistry` ACR.

```azurecli-interactive
az acr manifest restore -r MyRegistry -n hello-world:latest
```

Force restore will overwrite the existing tag with same name in the repository. The overwritten tag will be soft-deleted if the soft-delete policy is enabled during force restore. You can force restore with specific arguments `--force, -f`. 

3. Force restore the image of a `hello-world` repository by tag `latest`and digest `sha256:abc123` in a given `MyRegistry` ACR.

```azurecli-interactive
az acr manifest restore -r MyRegistry -n hello-world:latest -d sha256:abc123 -f
```

Restoring a [manifest list](push-multi-architecture-images.md#manifest-list) won't recursively restore any underlying soft-deleted manifests.
If you're restoring soft-deleted [ORAS artifacts](container-registry-oras-artifacts.md), then restoring a subject doesn't recursively restore the referrer chain. Also, the subject has to be restored first, only then a referrer manifest is allowed to restore. Otherwise it throws an error.

## Enable soft-delete policy for registry - Portal

You can also set a registry's soft- delete policy in the [Azure portal](https://portal.azure.com). 

1. Navigate to your Azure container registry. 
1. Under the **Overview tab**, see the status of the **Soft Delete**(Preview).
1. If the **Status** is **Disabled**, select **Update**.

:::image type="content" source="./media/container-registry-soft-delete/01-soft-delete-disable.png" alt-text="-enable-soft-delete-policy":::

1. Select the checkbox to **Enable Soft Delete**.
1. Select a number of days between `0` and `30` days to retain the soft deleted artifacts. Select **Save**.

:::image type="content" source="./media/container-registry-soft-delete/02-soft-delete-policy.png" alt-text="soft-delete-policy":::

## Restore the soft deleted artifacts - Portal

1. Navigate to your Azure container registry.
1. Under the **Menu** section, find **Services**, and Select **Repositories**.
1. Under the **Repositories**, Select your preferred **Repository**.
1.  Click on the **Manage deleted artifacts** to see all the soft deleted artifacts.

:::image type="content" source="./media/container-registry-soft-delete/03-soft-delete-manage-deleted-artifacts.png" alt-text="soft-delete-artifacts":::

1.  Filter the deleted artifact you have to restore, click on the **Restore** on the right column and a **Restore Artifact** window pops up.

:::image type="content" source="./media/container-registry-soft-delete/04-managed-deleted-artifacts.png" alt-text="soft-delete-artifacts-restore":::

1. Select the tag to restore, here you have an option to choose, and recover any additional tags.
1. Click on **Restore**. 

:::image type="content" source="./media/container-registry-soft-delete/05-restore-artifact.png" alt-text="soft-delete-restore-artifacts":::

## Restore from soft deleted repositories - Portal

1. Navigate to your Azure container registry.
1. Under the **Menu** section, find **Services**, and Select **Repositories**.
1. On the **Repositories** tab, click on **Manage Deleted Repositories**.

:::image type="content" source="./media/container-registry-soft-delete/06-soft-delete-manage-repositories.png" alt-text="soft-delete-repositories":::

1. Filter the deleted repository in the **Soft Deleted Repositories**(Preview).
1. Select the deleted repository, filter the deleted artifact from  on the **Manage deleted artifacts**, click on the **Restore** on the right column and a **Restore Artifact** window pops up.

:::image type="content" source="./media/container-registry-soft-delete/07-soft-delete-artifacts-restore.png" alt-text="soft-delete-restore-repositories":::

1. Select the tag to restore, here you have an option to choose, and recover any additional tags.
1. Click on **Restore**. 

:::image type="content" source="./media/container-registry-soft-delete/08-soft-delete-restore.png" alt-text="soft-delete-repositories-artifacts-restore":::

## Pushing an image

* Pushing an image to a repository that is soft-deleted will restore the repository.
* Pushing an image with a same manifest digest that is soft-deleted isn't allowed. Instead restore the soft-deleted image.

> [!NOTE]
> Importing a soft-delete image both at source and target is blocked.
## Auto purge

The auto-purge always considers the current value of `retentionDays` to purge soft-deleted artifacts. For example, if after say five days, the policy gets changed by a user from seven to 14 days. All artifacts will be auto purged after 14 days from the time the artifact is soft-deleted. The auto-purge runs every 24 hours.

## Preview limitations

* ACR currently don't support manually purging soft-deleted artifacts. 
* The soft-delete policy doesn't support a geo-replicated registry.
* The retention policy will be ineffective, if the soft-delete policy is enabled. See [retention policy for untagged manifests.](container-registry-retention-policy.md)