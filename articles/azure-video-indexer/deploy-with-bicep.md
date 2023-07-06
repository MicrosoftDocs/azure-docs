---
title:  Deploy Azure AI Video Indexer by using Bicep
description: Learn how to create an Azure AI Video Indexer account by using a Bicep file.
ms.topic: tutorial
ms.custom: devx-track-bicep
ms.date: 06/06/2022
ms.author: jgao
---

# Tutorial: deploy Azure AI Video Indexer by using Bicep

In this tutorial, you create an Azure AI Video Indexer account by using [Bicep](../azure-resource-manager/bicep/overview.md).

> [!NOTE]
> This sample is *not* for connecting an existing Azure AI Video Indexer classic account to an ARM-based Azure AI Video Indexer account.
> For full documentation on Azure AI Video Indexer API, visit the [developer portal](https://aka.ms/avam-dev-portal) page.
> For the latest API version for Microsoft.VideoIndexer, see the [template reference](/azure/templates/microsoft.videoindexer/accounts?tabs=bicep).

## Prerequisites

* An Azure Media Services (AMS) account. You can create one for free through the [Create AMS Account](/azure/media-services/latest/account-create-how-to).

## Review the Bicep file

One Azure resource is defined in the bicep file:

```bicep
param location string = resourceGroup().location

@description('The name of the AVAM resource')
param accountName string

@description('The managed identity Resource Id used to grant access to the Azure Media Service (AMS) account')
param managedIdentityResourceId string

@description('The media Service Account Id. The Account needs to be created prior to the creation of this template')
param mediaServiceAccountResourceId string

@description('The AVAM Template')
resource avamAccount 'Microsoft.VideoIndexer/accounts@2022-08-01' = {
  name: accountName
  location: location
  identity:{
    type: 'UserAssigned'
    userAssignedIdentities : {
      '${managedIdentityResourceId}' : {}
    }
  }
  properties: {
    mediaServices: {
      resourceId: mediaServiceAccountResourceId
      userAssignedIdentity: managedIdentityResourceId
    }
  }
}
```

Check [Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates) for more updated Bicep samples.

## Deploy the sample

1. Save the Bicep file as main.bicep to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters accountName=<account-name> managedIdentityResourceId=<managed-identity> mediaServiceAccountResourceId=<media-service-account-resource-id>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -accountName "<account-name>" -managedIdentityResourceId "<managed-identity>" -mediaServiceAccountResourceId "<media-service-account-resource-id>"
    ```

    ---

    The location must be the same location as the existing Azure media service. You need to provide values for the parameters:

    * Replace **\<account-name\>** with the name of the new Azure AI Video Indexer account.
    * Replace **\<managed-identity\>** with the managed identity used to grant access between Azure Media Services(AMS).
    * Replace **\<media-service-account-resource-id\>** with the existing Azure media service.

## Reference documentation

If you're new to Azure AI Video Indexer, see:

* [The Azure AI Video Indexer documentation](./index.yml)
* [The Azure AI Video Indexer developer portal](https://api-portal.videoindexer.ai/)
* After completing this tutorial, head to other Azure AI Video Indexer samples, described on [README.md](https://github.com/Azure-Samples/media-services-video-indexer/blob/master/README.md)

If you're new to Bicep deployment, see:

* [Azure Resource Manager documentation](../azure-resource-manager/index.yml)
* [Deploy Resources with Bicep and Azure PowerShell](../azure-resource-manager/bicep/deploy-powershell.md)
* [Deploy Resources with Bicep and Azure CLI](../azure-resource-manager/bicep/deploy-cli.md)

## Next steps

[Connect an existing classic paid Azure AI Video Indexer account to ARM-based account](connect-classic-account-to-arm.md)
