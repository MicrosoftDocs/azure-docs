---
title: Relocate an Azure Container Registry to another region
description: This article shows you how to relocate an Azure Container Registry to another region. 
ms.topic: how-to
ms.custom: devx-track-azurecli
author: anaharris-ms
ms.author: anaharris
ms.date: 07/29/2024
ms.service: container-registry
---

# Relocate an Azure Container Registry to another region

This article shows you how to relocate Azure Container Registry resources to another region in the same subscription of the Active Directory tenant. 

[!INCLUDE [container-registry-geo-replication-include](../../includes/container-registry-geo-replication-include.md)]

## Prerequisites


- You can only relocate a registry within the same Active Directory tenant. This limitation applies to registries that are encrypted and unencrypted with a [customer-managed key](../container-registry/tutorial-enable-customer-managed-keys.md). 

- If the source registry has [availability zones](../reliability/availability-zones-overview.md) enabled, then the target region must also support availability zones. For more information on availability zone support for Azure Container Registry, see [Enable zone redundancy in Azure Container Registry](../container-registry/zone-redundancy.md).

    

## Considerations for Service Endpoints

The virtual network service endpoints for Azure Container Registry restrict access to a specified virtual network. The endpoints can also restrict access to a list of IPv4 (internet protocol version 4) address ranges. Any user connecting to the registry from outside those sources is denied access. If Service endpoints were configured in the source region for the registry resource, the same would need to be done in the target one. The steps for this scenario are mentioned below:

- For a successful recreation of the registry to the target region, the VNet and Subnet must be created beforehand. If the move of these two resources is being carried out with the Azure Resource Mover tool, the service endpoints won’t be configured automatically and so you'll need to provide manual configuration. 

- Secondly, changes need to be made in the IaC of the Azure Container Registry. In `networkAcl` section, under `virtualNetworkRules`, add the rule for the target subnet. Ensure that the `ignoreMissingVnetServiceEndpoint` flag is set to False, so that the IaC fails to deploy the Azure Container Registry in case the service endpoint isn’t configured in the target region. This will ensure that the prerequisites in the target region are met


[!INCLUDE [considerations-for-private-endpoint](includes/private-endpoint-include.md)]


- Azure Container Registry must be configured in the target region with premium tier.

- When public network access to a registry is disabled, registry access by certain trusted services - including Azure Security Center -  requires enabling a network setting to bypass the network rules.

- If the registry has an approved private endpoint and public network access is disabled, repositories and tags can’t be listed outside the virtual network using the Azure portal, Azure CLI, or other tools.

- In case the case of a new replica, its imperative to manually add a new DNS record for the data endpoint in the target region.

## Downtime

To understand the possible downtimes involved, see [Cloud Adoption Framework for Azure: Select a relocation method](/azure/cloud-adoption-framework/relocate/select#select-a-relocation-method).



## Prepare

>[!NOTE]
>If you only want to relocate a Container Registry that doesn't hold any client specific data and is to be moved alone, you can simply redeploy the registry by using [Bicep](/azure/templates/microsoft.containerregistry/registries?tabs=bicep&pivots=deployment-language-arm-template) or [JSON](/azure/templates/microsoft.containerregistry/registries?tabs=json&pivots=deployment-language-arm-template).
>
>To view other availability configuration templates, go to [Define resources with Bicep, ARM templates, and Terraform AzAPI provider](/azure/templates/)

**To prepare for relocation with data migration:**

1. Create a dependency map with all the Azure services used by the registry. For the services that are in scope of the relocation, you must choose the appropriate relocation strategy. 

1. Identify the source networking layout for Azure Container Registry (ACR) like firewall and network isolation.

1. Retrieve any required images from the source registry for import into the target registry. To retrieve the images, run the following command:

    ```azurecli
    
    Get-AzContainerRegistryRepository -RegistryName registry
    
    ```

1. Use [ACR Tasks](../container-registry/container-registry-tasks-overview.md) to retrieve automation configurations of the source registry for import into the target registry. 


### Export template

To get started, export a Resource Manager template. This template contains settings that describe your Container Registry. For more information on how to use exported templates, see [Use exported template from the Azure portal](../azure-resource-manager/templates/template-tutorial-Azure portale.md) and the [template reference](/azure/templates/microsoft.containerregistry/registries).


1. In the [Azure portal](https://portal.azure.com), navigate to your source registry.
1. In the menu, under **Automation**, select **Export template** > **Download**.

    :::image type="content" source="media/relocation/container-registry/export-template.png" alt-text="Screenshot of export template for container registry.":::

1. Locate the .zip file that you downloaded from the portal, and unzip that file to a folder of your choice.

   This zip file contains the .json files that include the template and scripts to deploy the template.


### Modify template

Inspect the registry properties in the template JSON file you downloaded, and make necessary changes. At a minimum:

- Change the registry name's `defaultValue` to the desired name of the target registry
- Update the `location` to the desired Azure region for the target registry

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
        ...
        }
    ]
}
```

- Validate all the associated resources detail in the downloaded template such as Registry scopeMaps, replications configuration, Diagnostic settings like log analytics.

- If the source registry is encrypted, then [encrypt the target registry using a customer-managed key](../container-registry/tutorial-enable-customer-managed-keys.md#enable-a-customer-managed-key-by-using-a-resource-manager-template) and update the template with settings for the required managed identity, key vault, and key.  You can only enable the customer-managed key when you deploy the registry.



### Create resource group

Create a resource group for the target registry using the [az group create](/cli/azure/group#az-group-create). The following example creates a resource group named *myResourceGroup* in the *eastus* location. 

```azurecli
az group create --name myResourceGroup --location eastus
```

## Redeploy

Use the [az deployment group create](/cli/azure/deployment/group#az-deployment-group-create) command to deploy the target registry, using the template:

```azurecli
az deployment group create --resource-group myResourceGroup \
   --template-file template.json --name mydeployment
```

> [!NOTE]
> If you see errors during deployment, you might need to update certain configurations in the template file and retry the command.

### Import registry content in target registry

After creating the registry in the target region:

1. Use the [az acr import](/cli/azure/acr#az-acr-import) command, or the equivalent PowerShell command `Import-AzContainerImage`, to import images and other artifacts you want to preserve from the source registry to the target registry. For command examples, see [Import container images to a container registry](../container-registry/container-registry-import-images.md).

1. Use the Azure CLI commands [az acr repository list](/cli/azure/acr/repository#az-acr-repository-list) and [az acr repository show-tags](/cli/azure/acr/repository#az-acr-repository-show-tags), or Azure PowerShell equivalents, to help enumerate the contents of your source registry.

1. Run the import command for individual artifacts, or script it to run over a list of artifacts.

The following sample Azure CLI script enumerates the source repositories and tags and then imports the artifacts to a target registry in the same Azure subscription. Modify as needed to import specific repositories or tags. To import from a registry in a different subscription or tenant, see examples in [Import container images to a container registry](../container-registry/container-registry-import-images.md).

```azurecli
#!/bin/bash
# Modify registry names for your environment
SOURCE_REG=myregistry
TARGET_REG=targetregistry

# Get list of source repositories
REPO_LIST=$(az acr repository list \
    --name $SOURCE_REG --output tsv)

# Enumerate tags and import to target registry
for repo in $REPO_LIST; do
    TAGS_LIST=$(az acr repository show-tags --name $SOURCE_REG --repository $repo --output tsv);
    for tag in $TAGS_LIST; do
        echo "Importing $repo:$tag";
        az acr import --name $TARGET_REG --source $SOURCE_REG.azurecr.io/$repo":"$tag;
    done
done
```
1. Associate the dependent resources to the target Azure Container Registry such as log analytics workspace in Diagnostic settings.

1. Configure Azure Container Registry integration with both type of AKS clusters, provisioned or yet to be provisioned by running the following command:


```azurecli

Set-AzAksCluster -Name myAKSCluster -ResourceGroupName myResourceGroup -AcrNameToAttach <acr-name>

```

1. Make the necessary changes to the Kubernetes manifest file to integrate same with relocated Azure Container Registry (ACR).

1. Update development and deployment systems to use the target registry instead of the source registry.

1. Update any client firewall rules to allow access to the target registry.


## Verify

Confirm the following information in your target registry:

* Registry settings such as the registry name, service tier, public access, and replications
* Repositories and tags for content that you want to preserve.


## Delete original registry

After you have successfully deployed the target registry, migrated content, and verified registry settings, you may delete the source registry.

## Related content

- To move registry resources to a new resource group either in the same subscription or a [new subscription], see [Move Azure resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md).


* Learn more about [importing container images](../container-registry/container-registry-import-images.md) to an Azure container registry from a public registry or another private registry. 

* See the [Resource Manager template reference](/azure/templates/microsoft.containerregistry/registries) for Azure Container Registry.
