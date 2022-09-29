---
title: Microsoft Dev Box Azure CLI Reference
description: This article contains descriptions and definitions for a subset of the Dev Box Azure CLI extension. It's intended to help users adopt the CLI during public preview.
services: dev-box
ms.service: dev-box
ms.topic: reference
ms.author: rosemalcolm
author: RoseHJM
ms.date: 09/29/2022
---

# Microsoft Dev Box Azure CLI Reference

In addition to the Azure admin portal and the Dev Box user portal, you can use Dev Box's Azure CLI Extension to create resources.

## Setup

1. Download and install the [Azure CLI](/cli/azure/install-azure-cli).

2. Install the Microsoft Dev Box AZ CLI extension:
    #### [Install by using a PowerShell script](#tab/Option1/)
 
    Using <https://aka.ms/DevCenter/Install-DevCenterCli.ps1> uninstalls any existing Microsoft Dev Box CLI extension and installs the latest version.

    ```azurepowershell
    write-host "Setting Up DevCenter CLI"
    
    # Get latest version
    $indexResponse = Invoke-WebRequest -Method Get -Uri "https://fidalgosetup.blob.core.windows.net/cli-extensions/index.json" -UseBasicParsing
    $index = $indexResponse.Content | ConvertFrom-Json
    $versions = $index.extensions.devcenter
    $latestVersion = $versions[0]
    if ($latestVersion -eq $null) {
        throw "Could not find a valid version of the CLI."
    }
    
    # remove existing
    write-host "Attempting to remove existing CLI version (if any)"
    az extension remove -n devcenter
    
    # Install new version
    $downloadUrl = $latestVersion.downloadUrl
    write-host "Installing from url " $downloadUrl
    az extension add --source=$downloadUrl -y
    ```

    To execute the script directly in PowerShell:

   ```azurecli
   iex "& { $(irm https://aka.ms/DevCenter/Install-DevCenterCli.ps1 ) }"
   ```

    The final line of the script enables you to specify the location of the source file to download. If you want to access the file from a different location, update 'source' in the script to point to the downloaded file in the new location.

    #### [Install manually](#tab/Option2/)
  
    Manually run this command in the CLI:

    ```azurecli
    az extension add --source https://fidalgosetup.blob.core.windows.net/cli-extensions/devcenter-0.1.0-py3-none-any.whl
    ```

    ---

3. Log in to Azure CLI with your work account.

    ```azurecli
    az login
    ```

4. Set your default subscription to the sub where you'll be creating your specific Dev Box resources

    ```azurecli
    az account set --subscription {subscriptionId}
    ```

5. Set default resource group (which means no need to pass into each command)

    ```azurecli
    az configure --defaults group={resourceGroupName}
    ```

6. Get Help for a command

    ```azurecli
    az devcenter admin --help
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
--dev-center-name contoso-devcenter -n SharedGallery `
--gallery-resource-id "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/galleries/{computeGalleryName}" `
```

### DevCenter

#### Create a DevCenter in West US 3

```azurecli
az devcenter admin dev-center create -g demo-rg `
-n contoso-devcenter --identity-type UserAssigned `
--user-assigned-identity ` "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{managedIdentityName}" `
--location westus3 `
```

### Project

#### Create a Project

```azurecli
az devcenter admin project create -g demo-rg `
-n ContosoProject `
--description "project description" `
--dev-center-id /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.DevCenter/devcenters/{devCenterName} `
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
--domain-join-type "AzureADJoin" --networking-resource-group-id "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ExampleRG" `
--subnet-id "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ExampleRG/providers/Microsoft.Network/virtualNetworks/ExampleVNet/subnets/default" `
--name "{networkSettingName}" --resource-group "rg1" `
```

#### Create a hybrid AADJ Network Connection

```azurecli
az devcenter admin network-connection create --location "centralus" `
--domain-join-type "HybridAzureADJoin" --domain-name "mydomaincontroller.local" `
--domain-password "Password value for user" --domain-username "testuser@mydomaincontroller.local" `
--networking-resource-group-id "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ExampleRG" `
--subnet-id "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/ExampleRG/providers/Microsoft.Network/virtualNetworks/ExampleVNet/subnets/default" `
--name "{networkSettingName}" --resource-group "rg1" `
```

#### Attach a Network Connection to the DevCenter

```azurecli
az devcenter admin attached-network create --attached-network-connection-name westus3network `
--dev-center-name contoso-devcenter -g demo-rg `
--network-connection-id /subscriptions/f141e9f2-4778-45a4-9aa0-8b31e6469454/resourceGroups/demo-rg/providers/Microsoft.DevCenter/networksettings/netset99 `
```

### Dev Box Definition

#### List Dev Box Definitions in a DevCenter

```azurecli
az devcenter admin devbox-definition list `
--dev-center-name "Contoso" --resource-group "rg1" `
```

#### Create a Dev Box Definition with a marketplace image

```azurecli
az devcenter admin devbox-definition create -g demo-rg `
--dev-center-name contoso-devcenter -n BaseImageDefinition `
--image-reference id="/subscriptions/{subscriptionId}/resourceGroups/demo-rg/providers/Microsoft.DevCenter/devcenters/contoso-devcenter/galleries/Default/images/MicrosoftWindowsDesktop_windows-ent-cpc_win11-21h2-ent-cpc-m365" `
--sku name="PrivatePreview" `
```

#### Create a Dev Box Definition with a custom image

```azurecli
az devcenter admin devbox-definition create -g demo-rg `
--dev-center-name contoso-devcenter -n CustomDefinition `
--image-reference id="/subscriptions/{subscriptionId}/resourceGroups/demo-rg/providers/Microsoft.DevCenter/devcenters/contoso-devcenter/galleries/SharedGallery/images/CustomImageName" `
--sku name="PrivatePreview" `
```

### Dev Box Pool

#### Create a Pool

```azurecli
az devcenter admin pool create -g demo-rg `
--project-name ContosoProject -n MarketplacePool `
--devbox-definition-name Definition `
--network-connection-name westus3network `
--license-type Windows_Client --local-administrator
       Enabled
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
--devbox-definition-name {machineDefinitionName} `
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
--dev-center {devCenterName}
```

#### List Pools in a Project

```azurecli
az devcenter dev pool list
--dev-center {devCenterName}
--project-name {ProjectName}
```

#### Create a dev box

```azurecli
az devcenter dev dev-box create `
--dev-center {devCenterName} `
--project-name {projectName} `
--pool-name {poolName} `
-n {vmName} `
```

#### Get web connection URL for a dev box

```azurecli
az devcenter dev dev-box show-remote-connection `
--dev-center {devCenterName} --project-name {projectName} `
-n {vmName} `
```

#### List your Dev Boxes

```azurecli
az devcenter dev dev-box list --dev-center {devCenterName} `
```

#### View details of a Dev Box

```azurecli
az devcenter dev dev-box show `
--dev-center {devCenterName} `
--project-name {projectName} `
-n {vmName} 
```

#### Stop a Dev Box

```azurecli
az devcenter dev dev-box stop `
--dev-center {devCenterName} `
--project-name {projectName} `
-n {VMName} `
```

#### Start a Dev Box

```azurecli
az devcenter dev dev-box start `
--dev-center {devCenterName} `
--project-name {projectName} `
-n {VMName} `
 --user-id "me" 
```
