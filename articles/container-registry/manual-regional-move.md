---
title: Move Azure container registry to another region
description: Manually move Azure container registry settings and data to another Azure region.
ms.topic: article
ms.date: 06/03/2021
---

# Manually move a container registry to another region

You might need to move an Azure container registry from one Azure region to another. For example, you might want to move your registry to a region used for a development pipeline or a deployment target.

While [Azure Resource Mover](../resource-mover/overview.md) can't currently automate a move for an Azure container registry, you can manually move a container registry to a different region:

* Export a Resource Manager template containing registry settings from a source registry
* Use the template to deploy the target registry in a different Azure region. 
* Import registry content from the source registry to the target registry


[!INCLUDE [container-registry-geo-replication-include](../../includes/container-registry-geo-replication-include.md)]

## Prerequisites

Azure CLI

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](../../includes/azure-cli-prepare-your-environment-no-header.md)]

## Scenario

* The source registry can be in the same or a different Azure subscription or Active Directory tenant as the target registry. Steps in this article show moving the registry within the same subscription.
* Certain registry properties may need to be modified in the deployment template used to move the registry: encryption with a customer-managed key, managed identities, private endpoints (?)

## Export template from source registry 

Use the Azure portal, Azure CLI, Azure PowerShell, or other Azure tools to export a resource manager template. To use the Azure portal:

1. In the [Azure portal](https://portal.azure.com), navigate to your source registry.
1. In the menu, under **Automation**, select **Export template** > **Download**.

    :::image type="content" source="media/manual-regional-move/export-template.png" alt-text="Export template for container registry":::

## Redeploy target registry in new region

### Modify template

Inspect the registry properties in the exported template JSON file, and make necessary changes. At a minimum, update:

* The registry name `defaultValue` to the desired name of the target registry
* The `location` to desired Azure region for the target registry

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "registries_myregistry_name": {
            "defaultValue": "myregistry",
            "type": "String"
        }
    },
    "variables": {},
    "resources": [
        {
            "type": "Microsoft.ContainerRegistry/registries",
            "apiVersion": "2020-11-01-preview",
            "name": "[parameters('myregistry_name')]",
            "location": "centralus",
[...]
```

### Create resource group 

Create a resource group for the target registry using the [az group create](/cli/azure/group#az_group_create). The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli
az group create --name myResourceGroup --location eastus
```

### Deploy target registry in new region

Use the [az deployment group create](/cli/azure/deployment/group#az_deployment_group_create) command to deploy the target registry, using the template exported from the source registry:

```azurecli
az deployment group --resource-group myResourceGroup \
   --template-file template.json --name mydeployment
```

## Import registry content in target registry

Use the [az acr import](/cli/azure/acr#az_acr_import) command to import images and other artifacts you want to keep from the source registry to the target registry. For command examples, see [Import container images to a container registry](container-registry-import-images.md).

* Use the Azure CLI commands [az acr repository list](/cli/azure/acr/repository#az_acr_repository_list) and [az acr repository show-tags](/cli/azure/acr/repository#az_acr_repository_show_tags), or Azure PowerShell equivalents, to help enumerate the contents of your source registry.
* Run the `az acr import` command for individual artifacts, or script it to run over a list of artifacts.


The following sample Azure CLI script enumerates the source repositories and tags and then imports the artifacts to a target registy. Modify as needed to import specific repositories or tags.

```azurecli
#!/bin/bash
# Modify registry names for your environment
SOURCE_REG=mysourceregistry
TARGET_REG=mytargetregistry

# Get list of source repositories
REPO_ARRAY=$(az acr repository list --name $SOURCE_REG --output tsv)

# Enumerate tags and import to target registry
for repo in $REPO_ARRAY; do
    TAGS_ARRAY=$(az acr repository show-tags --name $SOURCE_REG --repository $repo --output tsv);
    for tag in $TAGS_ARRAY; do
        echo "Importing $repo:$tag";
        az acr import --name $TARGET_REG --source $SOURCE_REG.azurecr.io/$repo":"$tag;
    done
done
```


For an Azure PowerShell script to import a list of artifacts from a source registry to a target registry, see [Link to Matt's script]

## Verify target registry

Confirm the following information in your target registry:

* Registry settings such as the registry name, service tier, public access, and replications
* Repositories and tags for content that you want to move.

### Additional configuration

* Manually configure registry settings that weren't created during the deployment of the target registry, including:

  * Registry encryption settings
  * User-assigned and system-assigned identities
* Private endpoints

* Update development and deployment systems to use the target registy instead of the source registry.

## Delete original registry

After you have successfully deployed the target registry, migrated content, and verified development and deployment settings, you may delete the source registry, if it is no longer in use.

## Next steps

* Learn more about [importing container images](container-registry-import-images.md) to an Azure container registry from a public registry or another private registry. 

<!-- LINKS - Internal -->
[az-login]: /cli/azure/reference-index#az_login
[az-acr-import]: /cli/azure/acr#az_acr_import
[azure-cli]: /cli/azure/install-azure-cli
