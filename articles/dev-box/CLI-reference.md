---
title: CLI reference
description: Command line reference for Microsoft Dev Box. 
services: dev-box
ms.service: dev-box
ms.topic: reference
ms.author: rosemalcolm
author: RoseHJM
ms.date: 03/21/2022
adobe-target: true
---

# CLI Reference

During the Preview, in addition to the Azure admin portal and the Dev Box user portal, you can use the Microsoft Dev Azure CLI Extension to create resources.

## Setup

1. [Download and install the Az CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)

1. Install the Fidalgo AZ CLI extension -

    **Option 1**: 
    using https://aka.ms/fidalgo/Install-FidalgoCli.ps1 - this will uninstall any existing fidalgo extension and install the latest version.

    To execute the script directly in PowerShell:
   ```
   iex "& { $(irm https://aka.ms/fidalgo/Install-FidalgoCli.ps1 ) }"
   ```
    > Note - Ensure 'source' in above command is pointed to the downloaded file
    **Option 2**: manually run this command in the CLI
    ```
    az extension add --source https://fidalgosetup.blob.core.windows.net/cli-extensions/fidalgo-0.3.2-py3-none-any.whl
    ```

1. Login to Azure CLI with your work account.
    ```
    az login
    ```

1. Set your default subscription to the sub where you will be creating your specific Fidalgo resources
    ```
    az account set --subscription {subscriptionId}
    ```

1. Set default resource group (which means no need to pass into each command)
    ```
    az configure --defaults group={resourceGroupName}
    ```

1. Get Help for a command
    ```
    az fidalgo admin --help
    ```

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

```
az sig image-definition create --resource-group {resourceGroupName} `
--gallery-name {galleryName} --gallery-image-definition {definitionName} `
--publisher {publisherName} --offer {offerName} --sku {skuName} `
--os-type windows --os-state Generalized `
--hyper-v-generation v2 `
--features SecurityType=TrustedLaunch `
```
#### Attach a Gallery to the DevCenter
```
az fidalgo admin gallery create -g demo-rg `
--dev-center-name contoso-devcenter -n SharedGallery `
--gallery-resource-id "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/galleries/{computeGalleryName}" `
```

### DevCenter

#### Create a DevCenter in West US 3
```
az fidalgo admin dev-center create -g demo-rg `
-n contoso-devcenter --identity-type UserAssigned `
--user-assigned-identity ` "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{managedIdentityName}" `
--location westus3 `
```
### Project

#### Create a Project
```
az fidalgo admin project create -g demo-rg `
-n ContosoProject `
--description "project description" `
--dev-center-id /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Fidalgo/devcenters/{devCenterName} `
```

#### Delete a Project
```
az fidalgo admin project delete `
-g {resourceGroupName} `
--project {projectName} `
```

### Network Connection

#### Create a native AADJ Network Connection
```
az fidalgo admin network-setting create --location "centralus" `
--domain-join-type "AzureADJoin" --networking-resource-group-id "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ExampleRG" `
--subnet-id "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ExampleRG/providers/Microsoft.Network/virtualNetworks/ExampleVNet/subnets/default" `
--name "{networkSettingName}" --resource-group "rg1" `
```
#### Create a hybrid AADJ Network Connection
```
az fidalgo admin network-setting create --location "centralus" `
--domain-join-type "HybridAzureADJoin" --domain-name "mydomaincontroller.local" `
--domain-password "Password value for user" --domain-username "testuser@mydomaincontroller.local" `
--networking-resource-group-id "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ExampleRG" `
--subnet-id "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ExampleRG/providers/Microsoft.Network/virtualNetworks/ExampleVNet/subnets/default" `
--name "{networkSettingName}" --resource-group "rg1" `
```

#### Attach a Network Connection to the DevCenter
```
az fidalgo admin attached-network create --attached-network-connection-name westus3network `
--dev-center-name contoso-devcenter -g demo-rg `
--network-connection-resource-id /subscriptions/f141e9f2-4778-45a4-9aa0-8b31e6469454/resourceGroups/demo-rg/providers/Microsoft.Fidalgo/networksettings/netset99 `
```
### Dev Box Definition

#### List Dev Box Definitions in a DevCenter
```
az fidalgo admin devbox-definition list `
--dev-center-name "Contoso" --resource-group "rg1" `
```

#### Create a Dev Box Definition with a marketplace image
```
az fidalgo admin devbox-definition create -g demo-rg `
--dev-center-name contoso-devcenter -n BaseImageDefinition `
--image-reference id="/subscriptions/{subscriptionId}/resourceGroups/demo-rg/providers/Microsoft.Fidalgo/devcenters/contoso-devcenter/galleries/Default/images/MicrosoftWindowsDesktop_windows-ent-cpc_win11-21h2-ent-cpc-m365" `
--sku-name "PrivatePreview" `
```
#### Create a Dev Box Definition with a custom image
```
az fidalgo admin devbox-definition create -g demo-rg `
--dev-center-name contoso-devcenter -n CustomDefinition `
--image-reference id="/subscriptions/{subscriptionId}/resourceGroups/demo-rg/providers/Microsoft.Fidalgo/devcenters/contoso-devcenter/galleries/SharedGallery/images/CustomImageName" `
--sku-name "PrivatePreview" `
```

### Dev Box Pool

#### Create a Pool
```
az fidalgo admin pool create -g demo-rg `
--project-name ContosoProject -n MarketplacePool `
--dev-box-definition-name Definition `
--network-connection-name westus3network
```

#### Get Pool
```
az fidalgo admin pool show --resource-group "{resourceGroupName}" `
--project-name {projectName} --name "{poolName}" `
```

#### List Pools
```
az fidalgo admin pool list --resource-group "{resourceGroupName}" `
--project-name {projectName} `
```

#### Update Pool
Update Network Connection
```
az fidalgo admin pool update `
--resource-group "{resourceGroupName}" `
--project-name {projectName} `
--name "{poolName}" `
--network-connection-name {networkConnectionName}
```
Update Dev Box Definition
```
az fidalgo admin pool update `
--resource-group "{resourceGroupName}" `
--project-name {projectName} `
--name "{poolName}" `
--devbox-definition {machineDefinitionId} `
```

#### Delete Pool
```
az fidalgo admin pool delete `
--resource-group "{resourceGroupName}" `
--project-name "{projectName}" `
--name "{poolName}" `
```



### Dev Boxes

#### List available Projects
```
az fidalgo dev project list `
--dev-center {devCenterName}
```

#### List Pools in a Project
```
az fidalgo dev pool list
--dev-center {devCenterName}
--project-name {ProjectName}
```

#### Create a dev box
```
az fidalgo dev virtual-machine create `
--dev-center {devCenterName} `
--project-name {projectName} `
--pool-name {poolName} `
-n {vmName} `
```

#### Get web connection URL for a dev box
```
az fidalgo dev virtual-machine get-remote-connection `
--dev-center {devCenterName} --project-name {projectName} `
-n {vmName} `
```

#### List your Dev Boxes
```
az fidalgo dev virtual-machine list --dev-center {devCenterName} `
```

#### View details of a Dev Box
```
az fidalgo dev virtual-machine show `
--dev-center {devCenterName} `
--project-name {projectName} `
-n {vmName} 
```
	
#### Stop a Dev Box
```
az fidalgo dev virtual-machine stop `
--dev-center {devCenterName} `
--project-name {projectName} `
-n {VMName} `
```

#### Start a Dev Box
```
az fidalgo dev virtual-machine start `
--dev-center {devCenterName} `
--project-name {projectName} `
-n {VMName} `
```