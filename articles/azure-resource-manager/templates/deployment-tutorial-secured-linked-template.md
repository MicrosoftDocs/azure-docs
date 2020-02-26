---
title: Tutorial - Secure a linked template
description: Learn how to secure a linked template
ms.date: 02/18/2020
ms.topic: tutorial
ms.author: jgao
---

# Tutorial: Secure a linked template

In the [previous tutorial](./deployment-tutorial-linked-template.md), you deploy a main template and a linked template. The linked template was stored in a storage account with public access. In this tutorial, you use SAS to grant limited access to the linked template file in your own Azure Storage account. For more information about SAS, see [Using shared access signatures (SAS)](../../storage/common/storage-sas-overview.md). It takes about **12 minutes** to complete.

## Prerequisites

We recommend that you complete the [tutorial about deploying a linked template](./deployment-tutorial-linked-template.md), but it's not required.

## Review templates

In the previous tutorial, you had a main template and a linked template.  Both templates deployed a storage account, App Service plan, and web app.

The linked template was:

:::code language="json" source="~/resourcemanager-templates/get-started-deployment/linked-template/linkedStorageAccount.json":::

The main template was:

:::code language="json" source="~/resourcemanager-templates/get-started-deployment/linked-template/azuredeploy.json" highlight="32-37,43-61":::

The highlighted portions show how to pass the linked template URI and how to call a linked template.

Save a copy of the main template to your local computer.

## Store and share the template

The following PowerShell script creates a storage account, creates a container, copies the linked template from a github repository to the container . At the end of the execution, the script returns the URI of the template with SAS token. You need the URI when you deploy the template.

> [!NOTE]
> The script limits the SAS token to be used within eight hours. If you need more time to complete this tutorial, increase the expiry time.

Select **Try-it** to open the cloud shell, select **Copy** to copy the PowerShell script, and right-click the shell pane to paste the script:

```azurepowershell-interactive
$projectNamePrefix = Read-Host -Prompt "Enter a project name:"   # This name is used to generate names for Azure resources, such as storage account name.
$location = Read-Host -Prompt "Enter a location (i.e. centralus)"

$resourceGroupName = $projectNamePrefix + "rg"
$storageAccountName = $projectNamePrefix + "store"
$containerName = "templates" # The name of the Blob container to be created.

$linkedTemplateURL = "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/get-started-deployment/linked-template/linkedStorageAccount.json" # A completed linked template used in this tutorial.
$fileName = "linkedStorageAccount.json" # A file name used for downloading and uploading the linked template.

# Download the template
Invoke-WebRequest -Uri $linkedTemplateURL -OutFile "$home/$fileName"

# Create a resource group
New-AzResourceGroup -Name $resourceGroupName -Location $location

# Create a storage account
$storageAccount = New-AzStorageAccount `
    -ResourceGroupName $resourceGroupName `
    -Name $storageAccountName `
    -Location $location `
    -SkuName "Standard_LRS"

$context = $storageAccount.Context

# Create a container
New-AzStorageContainer -Name $containerName -Context $context -Permission Container

# Upload the template
Set-AzStorageBlobContent `
    -Container $containerName `
    -File "$home/$fileName" `
    -Blob $fileName `
    -Context $context

# Generate a SAS token
$templateURI = New-AzStorageBlobSASToken `
    -Context $context `
    -Container $containerName `
    -Blob $fileName `
    -Permission r `
    -ExpiryTime (Get-Date).AddHours(8.0) `
    -FullUri

Write-Host "You need the following values later in the tutorial:"
Write-Host "Resource Group Name: $resourceGroupName"
Write-Host "Linked template URI with SAS token: $templateURI"
Write-Host "Press [ENTER] to continue ..."
```

Make a note of the linked template URI.

## Deploy template

Use either Azure CLI or Azure PowerShell to deploy a template.

If you haven't created the resource group, see [Create resource group](deployment-tutorial-local-template.md#create-resource-group). The example assumes you've set the **templateFile** variable to the path to the template file, as shown in the [first tutorial](deployment-tutorial-local-template.md#deploy-template).

# [PowerShell](#tab/azure-powershell)

```azurepowershell

$projectName = Read-Host -Prompt "Enter a project name that is used to generate resource names"
$templateFile = Read-Host -Prompt "Enter the main template file"
$linkedTemplateUri = Read-Host -Prompt "Enter the linked template URI"

New-AzResourceGroupDeployment `
  -Name SecureLinkedTemplate `
  -ResourceGroupName myResourceGroup `
  -TemplateUri $templateUri `
  -projectName $projectName `
  -linkedTemplateUri $linkedTemplateUri `
  -verbose
```

# [Azure CLI](#tab/azure-cli)

```azurecli

echo "Enter a project name that is used to generate resource names:"
read projectName
echo "Enter the main template file:"
read templateFile
echo "Enter the linked template URI:"
read linkedTemplateUri

az group deployment create \
  --name SecureLinkedTemplate \
  --resource-group myResourceGroup \
  --template-uri $templateFile \
  --parameters projectName=$projectName linkedTemplateUri=$linkedTemplateUri \
  --verbose
```

---

## Clean up resources

Clean up the resources you deployed by deleting the resource groups.

1. From the Azure portal, select **Resource group** from the left menu.
2. Enter the resource group name in the **Filter by name** field.
3. Select the resource group name.
4. Select **Delete resource group** from the top menu.

## Next steps

Congratulations, you've finished this introduction to deploying templates to Azure. Let us know if you have any comments and suggestions in the feedback section. Thanks!

You're ready to jump into more advanced concepts about templates. The next tutorial goes into more detail about using template reference documentation to help with defining resources to deploy.
Utilize template reference

> [!div class="nextstepaction"]
> [Utilize template reference](./template-tutorial-create-encrypted-storage-accounts.md)
