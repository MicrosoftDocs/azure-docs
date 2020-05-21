---
title: Tutorial - Deploy a linked template
description: Learn how to deploy a linked template
ms.date: 03/13/2020
ms.topic: tutorial
ms.author: jgao
---

# Tutorial: Deploy a linked template

In the [previous tutorials](./deployment-tutorial-local-template.md), you learned how to deploy a template that is stored in your local computer. To deploy complex solutions, you can break a template into many templates, and deploy these templates through a main template. In this tutorial, you learn how to deploy a main template that contains the reference to a linked template. When the main template gets deployed, it triggers the deployment of the linked template. You also learn how to store and secure the linked template by using SAS token. It takes about **12 minutes** to complete.

## Prerequisites

We recommend that you complete the previous tutorial, but it's not required.

## Review template

In the previous tutorials, you deploy a template that creates a storage account, App Service plan, and web app. The template used was:

:::code language="json" source="~/resourcemanager-templates/get-started-deployment/local-template/azuredeploy.json":::

## Create a linked template

You can separate the storage account resource into a linked template:

:::code language="json" source="~/resourcemanager-templates/get-started-deployment/linked-template/linkedStorageAccount.json":::

The following template is the main template.  The highlighted **Microsoft.Resources/deployments** object shows how to call a linked template. The linked template cannot be stored as a local file or a file that is only available on your local network. You can only provide a URI value that includes either *http* or *https*. Resource Manager must be able to access the template. One option is to place your linked template in a storage account, and use the URI for that item. The URI is passed to template using a parameter. See the highlighted parameter definition.

:::code language="json" source="~/resourcemanager-templates/get-started-deployment/linked-template/azuredeploy.json" highlight="27-32,40-58":::

Save a copy of the main template to your local computer with the .json extension, for example, azuredeploy.json. You don't need to save a copy of the linked template.  The linked template will be copied from a GitHub repository to a storage account.

## Store the linked template

The following PowerShell script creates a storage account, creates a container, and copies the linked template from a GitHub repository to the container. A copy of the linked template is stored in [GitHub](https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/get-started-deployment/linked-template/linkedStorageAccount.json).

Select **Try-it** to open the Cloud Shell, select **Copy** to copy the PowerShell script, and right-click the shell pane to paste the script:

> [!IMPORTANT]
> Storage account names must be between 3 and 24 characters in length and use numbers and lower-case letters only. The name must be unique. In the template, the storage account name is the project name with "store" appended, and the project name must be between 3 and 11 characters. So the project name must meet the storage account name requirements and has less than 11 characters.

```azurepowershell-interactive
$projectName = Read-Host -Prompt "Enter a project name:"   # This name is used to generate names for Azure resources, such as storage account name.
$location = Read-Host -Prompt "Enter a location (i.e. centralus)"

$resourceGroupName = $projectName + "rg"
$storageAccountName = $projectName + "store"
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

Write-Host "Press [ENTER] to continue ..."
```

## Deploy template

To deploy a private template in a storage account, generate a SAS token and include it in the URI for the template. Set the expiry time to allow enough time to complete the deployment. The blob containing the template is accessible to only the account owner. However, when you create a SAS token for the blob, the blob is accessible to anyone with that URI. If another user intercepts the URI, that user is able to access the template. A SAS token is a good way of limiting access to your templates, but you should not include sensitive data like passwords directly in the template.

If you haven't created the resource group, see [Create resource group](./deployment-tutorial-local-template.md#create-resource-group).

> [!NOTE]
> In the below Azure CLI code, date parameter -d would be an invalid argument in macOS. So macOS users, to add 2 hrs to current time in terminal on macOS you should use -v+2H.

# [PowerShell](#tab/azure-powershell)

```azurepowershell

$projectName = Read-Host -Prompt "Enter a project name:"   # This name is used to generate names for Azure resources, such as storage account name.
$templateFile = Read-Host -Prompt "Enter the main template file and path"

$resourceGroupName="${projectName}rg"
$storageAccountName="${projectName}store"
$containerName = "templates"
$fileName = "linkedStorageAccount.json" # A file name used for downloading and uploading the linked template.

$key = (Get-AzStorageAccountKey -ResourceGroupName $resourceGroupName -Name $storageAccountName).Value[0]
$context = New-AzStorageContext -StorageAccountName $storageAccountName -StorageAccountKey $key

# Generate a SAS token
$linkedTemplateUri = New-AzStorageBlobSASToken `
    -Context $context `
    -Container $containerName `
    -Blob $fileName `
    -Permission r `
    -ExpiryTime (Get-Date).AddHours(2.0) `
    -FullUri

# Deploy the template
New-AzResourceGroupDeployment `
  -Name DeployLinkedTemplate `
  -ResourceGroupName $resourceGroupName `
  -TemplateFile $templateFile `
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

resourceGroupName="${projectName}rg"
storageAccountName="${projectName}store"
containerName="templates"
fileName="linkedStorageAccount.json"

key=$(az storage account keys list -g $resourceGroupName -n $storageAccountName --query [0].value -o tsv)

linkedTemplateUri=$(az storage blob generate-sas \
  --account-name $storageAccountName \
  --account-key $key \
  --container-name $containerName \
  --name $fileName \
  --permissions r \
  --expiry `date -u -d "120 minutes" '+%Y-%m-%dT%H:%MZ'` \
  --full-uri)

linkedTemplateUri=$(echo $linkedTemplateUri | sed 's/"//g')
az deployment group create \
  --name DeployLinkedTemplate \
  --resource-group $resourceGroupName \
  --template-file $templateFile \
  --parameters projectName=$projectName linkedTemplateUri=$linkedTemplateUri \
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

You learned how to deploy a linked template. In the next tutorial, you learn how to create a DevOp pipeline to deploy a template.

> [!div class="nextstepaction"]
> [Create a pipeline](./deployment-tutorial-pipeline.md)
