---
title:  Deploy Azure Video Indexer by using Bicep
description: Learn how to create an Azure Video Indexer account by using a Bicep file.
ms.topic: tutorial
ms.date: 06/06/2022
ms.author: jgao
---

# Tutorial: deploy Azure Video Indexer by using Bicep

In this tutorial, you create an Azure Video Indexer account by using [Bicep](../azure-resource-manager/bicep/overview.md).

> [!NOTE]
> This sample is *not* for connecting an existing Azure Video Indexer classic account to an ARM-based Azure Video Indexer account.
> For full documentation on Azure Video Indexer API, visit the [Developer portal](https://aka.ms/avam-dev-portal) page.
> For the latest API version for Microsoft.VideoIndexer, see the [template reference](/azure/templates/microsoft.videoindexer/accounts?tabs=bicep).

## Prerequisites

* An Azure Media Services (AMS) account. You can create one for free through the [Create AMS Account](/azure/media-services/latest/account-create-how-to).

## Review the Bicep file

The Bicep file used in this tutorial is:

:::code language="bicep" source="~/media-services-video-indexer/ARM-Quick-Start/avam.template.bicep":::

One Azure resource is defined in the bicep file:

* [Microsoft.videoIndexer/accounts](/azure/templates/microsoft.videoindexer/accounts?tabs=bicep)

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

    * Replace **\<account-name\>** with the name of the new Azure video indexer account.
    * Replace **\<managed-identity\>** with the managed identity used to grant access between Azure Media Services(AMS).
    * Replace **\<media-service-account-resource-id\>** with the existing Azure media service.

## Reference documentation

If you're new to Azure Video Indexer, see:

* [Azure Video Indexer Documentation](./index.yml)
* [Azure Video Indexer Developer Portal](https://api-portal.videoindexer.ai/)
* After completing this tutorial, head to other Azure Video Indexer samples, described on [README.md](https://github.com/Azure-Samples/media-services-video-indexer/blob/master/README.md)

If you're new to Bicep deployment, see:

* [Azure Resource Manager documentation](../azure-resource-manager/index.yml)
* [Deploy Resources with Bicep and Azure PowerShell](../azure-resource-manager/bicep/deploy-powershell.md)
* [Deploy Resources with Bicep and Azure CLI](../azure-resource-manager/bicep/deploy-cli.md)

## Next steps

[Connect an existing classic paid Azure Video Indexer account to ARM-based account](connect-classic-account-to-arm.md)
