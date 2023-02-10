---
title: Microsoft Dev Box Preview Azure CLI Reference
titleSuffix: Microsoft Dev Box Preview
description: This article contains descriptions and definitions for a subset of the Dev Box Azure CLI extension.
services: dev-box
ms.service: dev-box
ms.topic: reference
ms.author: rosemalcolm
author: RoseHJM
ms.date: 10/12/2022
---
# Microsoft Dev Box Preview Azure CLI reference
This article contains descriptions and definitions for a subset of the Microsoft Dev Box Preview CLI extension. 

> [!NOTE]
> Microsoft Dev Box is currently in public preview. Features and commands may change. If you need additional assistance, contact the Dev Box team by using [Report a problem](https://aka.ms/devbox/report).

## Prerequisites
Install the Azure CLI and the Dev Box CLI extension as described here: [Microsoft Dev Box CLI](how-to-install-dev-box-cli.md)
## Commands

* [Azure Compute Gallery](#azure-compute-gallery)
* [DevCenter](#devcenter)
* [Project](#project)
* [Network Connection](#network-connection)
* [Dev Box Definition](#dev-box-definition)
* [Dev Box Pool](#dev-box-pool)
* [Dev Boxes](#dev-boxes)

### Azure Compute Gallery

#### Create an image definition that meets all requirements

```azurecli
az sig image-definition create --resource-group {resourceGroupName} `
--gallery-name {galleryName} --gallery-image-definition {definitionName} `
--publisher {publisherName} --offer {offerName} --sku {skuName} `
--os-type windows --os-state Generalized `
--hyper-v-generation v2 `
--features SecurityType=TrustedLaunch `
```

#### Attach a Gallery to the DevCenter

```azurecli
az devcenter admin gallery create -g demo-rg `
--devcenter-name contoso-devcenter -n SharedGallery `
--gallery-resource-id "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/galleries/{computeGalleryName}" `
```

### DevCenter

#### Create a DevCenter

```azurecli
az devcenter admin devcenter create -g demo-rg `
-n contoso-devcenter --identity-type UserAssigned `
--user-assigned-identity ` "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{managedIdentityName}" `
--location {regionName} `
```

### Project

#### Create a Project

```azurecli
az devcenter admin project create -g demo-rg `
-n ContosoProject `
--description "project description" `
--devcenter-id /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DevCenter/devcenters/{devCenterName} `
```

#### Delete a Project

```azurecli
az devcenter admin project delete `
-g {resourceGroupName} `
--project {projectName} `
```

### Network Connection

#### Create a native AADJ Network Connection

```azurecli
az devcenter admin network-connection create --location "centralus" `
--domain-join-type "AzureADJoin" `
--subnet-id "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ExampleRG/providers/Microsoft.Network/virtualNetworks/ExampleVNet/subnets/default" `
--name "{networkConnectionName}" --resource-group "rg1" `
```

#### Create a hybrid AADJ Network Connection

```azurecli
az devcenter admin network-connection create --location "centralus" `
--domain-join-type "HybridAzureADJoin" --domain-name "mydomaincontroller.local" `
--domain-password "Password value for user" --domain-username "testuser@mydomaincontroller.local" `
--subnet-id "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ExampleRG/providers/Microsoft.Network/virtualNetworks/ExampleVNet/subnets/default" `
--name "{networkConnectionName}" --resource-group "rg1" `
```

#### Attach a Network Connection to the DevCenter

```azurecli
az devcenter admin attached-network create --attached-network-connection-name westus3network `
--devcenter-name contoso-devcenter -g demo-rg `
--network-connection-id /subscriptions/f141e9f2-4778-45a4-9aa0-8b31e6469454/resourceGroups/demo-rg/providers/Microsoft.DevCenter/networkConnections/netset99 `
```

### Dev Box Definition

#### List Dev Box Definitions in a DevCenter

```azurecli
az devcenter admin devbox-definition list `
--devcenter-name "Contoso" --resource-group "rg1" `
```

#### List skus available in your subscription

```azurecli
az devcenter admin sku list 
```
#### Create a Dev Box Definition with a marketplace image

```azurecli
az devcenter admin devbox-definition create -g demo-rg `
--devcenter-name contoso-devcenter -n BaseImageDefinition `
--image-reference id="/subscriptions/{subscriptionId}/resourceGroups/demo-rg/providers/Microsoft.DevCenter/devcenters/contoso-devcenter/galleries/Default/images/MicrosoftWindowsDesktop_windows-ent-cpc_win11-21h2-ent-cpc-m365" `
--sku name="general_a_8c32gb_v1" `
```

#### Create a Dev Box Definition with a custom image

```azurecli
az devcenter admin devbox-definition create -g demo-rg `
--devcenter-name contoso-devcenter -n CustomDefinition `
--image-reference id="/subscriptions/{subscriptionId}/resourceGroups/demo-rg/providers/Microsoft.DevCenter/devcenters/contoso-devcenter/galleries/SharedGallery/images/CustomImageName" `
--os-storage-type "ssd_1024gb" --sku name=general_a_8c32gb_v1
```

### Dev Box Pool

#### Create a Pool

```azurecli
az devcenter admin pool create -g demo-rg `
--project-name ContosoProject -n MarketplacePool `
--devbox-definition-name Definition `
--network-connection-name westus3network `
--license-type Windows_Client --local-administrator Enabled `
```

#### Get Pool

```azurecli
az devcenter admin pool show --resource-group "{resourceGroupName}" `
--project-name {projectName} --name "{poolName}" `
```

#### List Pools

```azurecli
az devcenter admin pool list --resource-group "{resourceGroupName}" `
--project-name {projectName} `
```

#### Update Pool

Update Network Connection

```azurecli
az devcenter admin pool update `
--resource-group "{resourceGroupName}" `
--project-name {projectName} `
--name "{poolName}" `
--network-connection-name {networkConnectionName}
```

Update Dev Box Definition

```azurecli
az devcenter admin pool update `
--resource-group "{resourceGroupName}" `
--project-name {projectName} `
--name "{poolName}" `
--devbox-definition-name {devBoxDefinitionName} `
```

#### Delete Pool

```azurecli
az devcenter admin pool delete `
--resource-group "{resourceGroupName}" `
--project-name "{projectName}" `
--name "{poolName}" `
```

### Dev Boxes

#### List available Projects

```azurecli
az devcenter dev project list `
--devcenter {devCenterName}
```

#### List Pools in a Project

```azurecli
az devcenter dev pool list `
--devcenter {devCenterName} `
--project-name {ProjectName} `
```

#### Create a dev box

```azurecli
az devcenter dev dev-box create `
--devcenter {devCenterName} `
--project-name {projectName} `
--pool-name {poolName} `
-n {devBoxName} `
```

#### Get web connection URL for a dev box

```azurecli
az devcenter dev dev-box show-remote-connection `
--devcenter {devCenterName} `
--project-name {projectName} `
--user-id "me"
-n {devBoxName} `
```

#### List your Dev Boxes

```azurecli
az devcenter dev dev-box list --devcenter {devCenterName} `
```

#### View details of a Dev Box

```azurecli
az devcenter dev dev-box show `
--devcenter {devCenterName} `
--project-name {projectName} `
-n {devBoxName} 
```

#### Stop a Dev Box

```azurecli
az devcenter dev dev-box stop `
--devcenter {devCenterName} `
--project-name {projectName} `
--user-id "me" `
-n {devBoxName} `
```

#### Start a Dev Box

```azurecli
az devcenter dev dev-box start `
--devcenter {devCenterName} `
--project-name {projectName} `
--user-id "me" `
-n {devBoxName} `
```

## Next steps

Learn how to install the Azure CLI and the Dev Box CLI extension at:

- [Microsoft Dev Box CLI](./how-to-install-dev-box-cli.md)