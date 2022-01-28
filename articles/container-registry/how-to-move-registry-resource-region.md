---
title: How to move Azure Container Registry to another region |Microsoft Docs
titleSuffix: 
description: Learn how to move Azure Container Registry resources to another region
author:  Tejaswi Kolli
ms.author: Tejaswi Kolli
ms.service: 
ms.topic: how-to-move-container-registry-resources-across-regions
ms.date: 01/20/2022
ms.custom: subject-moving-resources
---

# Move Azure Container Registry Resources to another region

Learn to manually move the Azure container registry and its resources from one region to another.(This will allow you to run a development pipeline or host a new deployment target in a different region.Resources like Container Images and Helm Charts can be imported to Target region.)_

In this article, you'll learn how to:

> [!div class="checklist"]
>
> - Export a template from source container registry. 
> - Modify the template by adding the target region and container registry name.
> - Deploy the template to create target container registry.
> - Configure the new container registry.
> - Write a script to list repositories and images.
> - Invoke import the container registry.
> - Verify target container registry.
> - Update their deployment scripts to use the new registry and credentials.
> - Delete the resources in the source region.

## Prerequisites

- Ensure that the target region facilitates the features,services and subscriptions.
 
- [Prepare your Azure CLI environment](../../includes/azure-cli-prepare-your-environment-no-header.md)

## Considerations

- You can use this article to move resources of the container registry to a different region in the same Azure subscription.

- You have to apply additional configuration changes to move the container registry to a different Azure subscription in the same Active Directory tenant.

-  You cannot move resources to a different Active Directory tenant. This limitation applies to both registries encrypted with a customer-managed key and un-encrypted registries.

### Export a template from source container registry.

This template contains settings that describe your container registry.

# [Portal](#tab/azure-portal)

To export a template by using Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Select **All resources** and then select your storage account.

3. Select > **Automation** > **Export template**.

4. Choose **Download** in the **Export template** blade.

5. Locate the .zip file that you downloaded from the portal, and unzip that file to a folder of your choice.

   This zip file contains the .json files that comprise the template and scripts to deploy the template.

# [PowerShell](#tab/azure-powershell)

To export a template by using PowerShell:

1. Sign in to your Azure subscription with the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) command and follow the on-screen directions:

   ```azurepowershell-interactive
   Connect-AzAccount
   ```

2. If your identity is associated with more than one subscription, then set your active subscription to subscription of the storage account that you want to move.

   ```azurepowershell-interactive
   $context = Get-AzSubscription -SubscriptionId <subscription-id>
   Set-AzContext $context
   ```

3. Export the template of your source container registry. These commands save a json template to your current directory.

   ```azurepowershell-interactive
   $resource = Get-AzResource `
     -ResourceGroupName <resource-group-name> `
     -ResourceName <Container-registry-name> `
     -ResourceType Microsoft.ContainerRegistry/registries/Export-AzResourceGroup `
     -ResourceGroupName <resource-group-name> `
     -Resource $resource.ResourceId
   ```

# [Azure CLI](#tab/azure-cli) 

To export a template by using AzureCLI:

1. Sign in to your Azure subscription using the [az acr login][az-acr-login] command.Specify only the registry resource name when logging in with the Azure CLI.

   ```azurecli-interactive
   az acr login --name <registry-name>
   ```

The command returns a `Login Succeeded` message once completed.

2. If your identity is associated with more than one subscription, then set your active subscription to subscription of the container registry that you want to move.

   ```azurecli-interactive
   az account set -s "<YourSubscriptionName>"
   ```

3. Export the template of your source container registry. These commands save a json template to your current directory.

   ```azurecli-interactive
   $containerRegistryID=$(az resource show 
      --resource-group <resource-group-name> 
      --name <Container-registry-name>
      --resource-type Microsoft.ContainerRegistry/registries 
      --query id 
      --output tsv)
    az group export 
      --resource-group <resource-group-name>  
      --resource-ids $containerRegistryID
   ```

---


### Modify the template

Modify the template by changing the target region and container registry name

# [Portal](#tab/azure-portal)

To deploy the template by using Azure portal:

1. In the Azure portal, select **Create a resource**.

2. In **Search the Marketplace**, type **template deployment**, and then press **ENTER**.

3. Select **Template deployment**.

    ![Azure Resource Manager templates library](./media/storage-account-move/azure-resource-manager-template-library.png)

4. Select **Create**.

5. Select **Build your own template in the editor**.

6. Select **Load file**, and then follow the instructions to load the **template.json** file that you downloaded in the last section.

7. In the **template.json** file, name the target container registry by setting the default value of the container registry name. This example sets the default value of the container registry  name to `mytargetaccount`.

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
        }
    ]
}
[...]
```

8. Edit the **location** property in the **template.json** file to the target region. This example sets the target region to `centralus`.

    ```json
    "resources": [{
            "type": "Microsoft.ContainerRegistry/registries",
            "apiVersion": "2020-11-01-preview",
            "name": "[parameters('myregistry_name')]",
            "location": "centralus",
         }]          
    ```

    To obtain region location codes, see [Azure Locations](https://azure.microsoft.com/global-infrastructure/locations/).  The code for a region is the region name with no spaces, **Central US** = **centralus**.

# [PowerShell](#tab/azure-powershell)

To deploy the template by using PowerShell:

1. In the **template.json** file, name the target storage account by setting the default value of the storage account name. This example sets the default value of the storage account name to `mytargetregistryaccount`.

    ```json
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "registries_myregistry_name": {
            "defaultValue": "mytargetregistryaccount",
            "type": "String"
        }
    },
    ```

2. Edit the **location** property in the **template.json** file to the target region. This example sets the target region to `eastus`.

    ```json
    "resources": [{
         "type": "Microsoft.ContainerRegistry/registries",
         "apiVersion": "2019-04-01",
         "name": "[parameters('registries_myregistry_name')]",
         "location": "eastus"
         }]          
    ```

    You can obtain region codes by running the [Get-AzLocation](/powershell/module/az.resources/get-azlocation) command.

    ```azurepowershell-interactive
    Get-AzLocation | format-table 
    ```

---

<a id="move"></a>