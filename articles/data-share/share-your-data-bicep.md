---
title: 'Share outside your org (Bicep) - Azure Data Share quickstart'
description: Learn how to share data with customers and partners using Azure Data Share and Bicep.
author: schaffererin
ms.author: v-eschaffer
ms.service: data-share
ms.topic: quickstart
ms.date: 03/16/2022
ms.custom: subject-armqs, devx-track-azurepowershell, mode-arm
---

# Quickstart: Share data using Azure Data Share and Bicep

Learn how to set up a new Azure Data Share from an Azure storage account by using a Bicep file, and start sharing your data with customers and partners outside of your Azure organization. For a list of the supported data stores, see [Supported data stores in Azure Data Share](./supported-data-stores.md).

[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## Review the Bicep file

The Bicep file used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/data-share-share-storage-account/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.datashare/data-share-share-storage-account/main.bicep":::

The following resources are defined in the Bicep file:

* [Microsoft.Storage/storageAccounts](/azure/templates/microsoft.storage/storageaccounts):
* [Microsoft.Storage/storageAccounts/blobServices/containers](/azure/templates/microsoft.storage/storageaccounts/blobservices/containers)
* [Microsoft.DataShare/accounts](/azure/templates/microsoft.datashare/accounts)
* [Microsoft.DataShare/accounts/shares](/azure/templates/microsoft.datashare/accounts/shares)
* [Microsoft.Storage/storageAccounts/providers/roleAssignments](/azure/templates/microsoft.authorization/roleassignments)
* [Microsoft.DataShare/accounts/shares/dataSets](/azure/templates/microsoft.datashare/accounts/shares/datasets)
* [Microsoft.DataShare/accounts/shares/invitations](/azure/templates/microsoft.datashare/accounts/shares/invitations)
* [Microsoft.DataShare/accounts/shares/synchronizationSettings](/azure/templates/microsoft.datashare/accounts/shares/synchronizationsettings)

The Bicep file performs the following tasks:

* Create a storage account and a container used as the Data share data source.
* Create a Data share account and a Data share.
* Create a role assignment to grant the Storage Blob Data Reader role to the source data share resource. See [Roles and requirements for Azure Data Share](./concepts-roles-permissions.md).
* Add a dataset to the Date share.
* Add recipients to the Data share.
* Enable a snapshot schedule for the Data share.

This Bicep file is created for learning purposes. In practice, you usually have some data in an existing storage account. You would need to create the role assignment before running a Bicep file or a script to create the dataset. Sometimes, you might get the following error message when you deploy the Bicep file:

```plaintext
"Missing permissions for DataShareAccount on resource 'subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP NAME>/providers/Microsoft.Storage/storageAccounts/<STORAGE ACCOUNT NAME>' (Code: 5006)"
```

It's because the deployment is trying to create the dataset before the Azure role assignment gets finalized. Despite the error message, the deployment could be successful. You would still be able to walk through [Review deployed resources](#review-deployed-resources).

## Deploy the template

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters projectName=<project-name> invitationEmail=<invitation-email>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -projectName "<project-name>" -invitationEmail "<invitation-email>
    ```

    ---

    > [!NOTE]
    > Replace **\<project-name\>** with a project name that is used to generate resource names. Replace **\<invitation-email\>** with an email address for receiving data share invitations.

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Review deployed resources

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

## Clean up resources

When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to delete all of the resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

In this quickstart, you learned how to create an Azure data share and invite recipients. To learn more about how a data consumer can accept and receive a data share, continue to the [accept and receive data](subscribe-to-data-share.md) tutorial.
