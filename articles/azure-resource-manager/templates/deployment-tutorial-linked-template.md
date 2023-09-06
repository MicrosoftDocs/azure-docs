---
title: Tutorial - Deploy a linked template
description: Learn how to deploy a linked template
ms.date: 05/22/2023
ms.topic: tutorial
ms.custom: devx-track-azurepowershell
---

# Tutorial: Deploy a linked template

In the [previous tutorials](./deployment-tutorial-local-template.md), you learned how to deploy a template that is stored in your local computer. To deploy complex solutions, you can break a template into many templates, and deploy these templates through a main template. In this tutorial, you learn how to deploy a main template that contains the reference to a linked template. When the main template gets deployed, it triggers the deployment of the linked template. You also learn how to store and secure the templates by using SAS token. It takes about **12 minutes** to complete.

## Prerequisites

We recommend that you complete the previous tutorial, but it's not required.

## Review template

In the previous tutorials, you deploy a template that creates a storage account, App Service plan, and web app. The template used was:

:::code language="json" source="~/resourcemanager-templates/get-started-deployment/local-template/azuredeploy.json":::

## Create a linked template

You can separate the storage account resource into a linked template:

:::code language="json" source="~/resourcemanager-templates/get-started-deployment/linked-template/linkedStorageAccount.json":::

The following template is the main template. The highlighted `Microsoft.Resources/deployments` object shows how to call a linked template. The linked template cannot be stored as a local file or a file that is only available on your local network. You can either provide a URI value of the linked template that includes either HTTP or HTTPS,  or use the _relativePath_ property to deploy a remote linked template at a location relative to the parent template. One option is to place both the main template and the linked template in a storage account.

:::code language="json" source="~/resourcemanager-templates/get-started-deployment/linked-template/azuredeploy.json" highlight="34-52":::

## Store the linked template

Both of the main template and the linked template are stored in GitHub:

The following PowerShell script creates a storage account, creates a container, and copies the two templates from a GitHub repository to the container. These two templates are:

- The main template: https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/get-started-deployment/linked-template/azuredeploy.json
- The linked template: https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/get-started-deployment/linked-template/linkedStorageAccount.json

Select **Try-it** to open the Cloud Shell, select **Copy** to copy the PowerShell script, and right-click the shell pane to paste the script:

> [!IMPORTANT]
> Storage account names must be unique, between 3 and 24 characters in length, and use **numbers** and **lowercase** letters only. The sample template's `storageAccountName` variable combines the `projectName` parameter's maximum of 11 characters with a [uniqueString](./template-functions-string.md#uniquestring) value of 13 characters.

```azurepowershell-interactive
$projectName = Read-Host -Prompt "Enter a project name:"   # This name is used to generate names for Azure resources, such as storage account name.
$location = Read-Host -Prompt "Enter a location (i.e. centralus)"

$resourceGroupName = $projectName + "rg"
$storageAccountName = $projectName + "store"
$containerName = "templates" # The name of the Blob container to be created.

$mainTemplateURL = "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/get-started-deployment/linked-template/azuredeploy.json"
$linkedTemplateURL = "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/get-started-deployment/linked-template/linkedStorageAccount.json"

$mainFileName = "azuredeploy.json" # A file name used for downloading and uploading the main template.Add-PSSnapin
$linkedFileName = "linkedStorageAccount.json" # A file name used for downloading and uploading the linked template.

# Download the templates
Invoke-WebRequest -Uri $mainTemplateURL -OutFile "$home/$mainFileName"
Invoke-WebRequest -Uri $linkedTemplateURL -OutFile "$home/$linkedFileName"

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

# Upload the templates
Set-AzStorageBlobContent `
    -Container $containerName `
    -File "$home/$mainFileName" `
    -Blob $mainFileName `
    -Context $context

Set-AzStorageBlobContent `
    -Container $containerName `
    -File "$home/$linkedFileName" `
    -Blob $linkedFileName `
    -Context $context

Write-Host "Press [ENTER] to continue ..."
```

## Deploy template

To deploy templates in a storage account, generate a SAS token and supply it to the _-QueryString_ parameter. Set the expiry time to allow enough time to complete the deployment. The blobs containing the templates are accessible to only the account owner. However, when you create a SAS token for a blob, the blob is accessible to anyone with that SAS token. If another user intercepts the URI and the SAS token, that user is able to access the template. A SAS token is a good way of limiting access to your templates, but you should not include sensitive data like passwords directly in the template.

If you haven't created the resource group, see [Create resource group](./deployment-tutorial-local-template.md#create-resource-group).

> [!NOTE]
> In the below Azure CLI code, `date` parameter `-d` is an invalid argument in macOS. So macOS users, to add 2 hours to current time in terminal on macOS you should use `-v+2H`.

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive

$projectName = Read-Host -Prompt "Enter the same project name:"   # This name is used to generate names for Azure resources, such as storage account name.

$resourceGroupName="${projectName}rg"
$storageAccountName="${projectName}store"
$containerName = "templates"

$key = (Get-AzStorageAccountKey -ResourceGroupName $resourceGroupName -Name $storageAccountName).Value[0]
$context = New-AzStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $key

$mainTemplateUri = $context.BlobEndPoint + "$containerName/azuredeploy.json"
$sasToken = New-AzStorageContainerSASToken `
    -Context $context `
    -Container $containerName `
    -Permission r `
    -ExpiryTime (Get-Date).AddHours(2.0)
$newSas = $sasToken.substring(1)


New-AzResourceGroupDeployment `
  -Name DeployLinkedTemplate `
  -ResourceGroupName $resourceGroupName `
  -TemplateUri $mainTemplateUri `
  -QueryString $newSas `
  -projectName $projectName `
  -verbose

Write-Host "Press [ENTER] to continue ..."
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
echo "Enter a project name that is used to generate resource names:" &&
read projectName &&

resourceGroupName="${projectName}rg" &&
storageAccountName="${projectName}store" &&
containerName="templates" &&

key=$(az storage account keys list -g $resourceGroupName -n $storageAccountName --query [0].value -o tsv) &&

sasToken=$(az storage container generate-sas \
  --account-name $storageAccountName \
  --account-key $key \
  --name $containerName \
  --permissions r \
  --expiry `date -u -d "120 minutes" '+%Y-%m-%dT%H:%MZ'`) &&
sasToken=$(echo $sasToken | sed 's/"//g')&&

blobUri=$(az storage account show -n $storageAccountName -g $resourceGroupName -o tsv --query primaryEndpoints.blob) &&
templateUri="${blobUri}${containerName}/azuredeploy.json" &&

az deployment group create \
  --name DeployLinkedTemplate \
  --resource-group $resourceGroupName \
  --template-uri $templateUri \
  --parameters projectName=$projectName \
  --query-string $sasToken \
  --verbose
```

---

## Clean up resources

Clean up the resources you deployed by deleting the resource group.

1. From the Azure portal, select **Resource group** from the left menu.
2. Enter the resource group name in the **Filter by name** field.
3. Select the resource group name.
4. Select **Delete resource group** from the top menu.

## Next steps

You learned how to deploy a linked template. In the next tutorial, you learn how to create a DevOps pipeline to deploy a template.

> [!div class="nextstepaction"]
> [Create a pipeline](./deployment-tutorial-pipeline.md)
