## Sign in to Azure

Sign in to your Azure subscription with the `Connect-AzureRmAccount` command and follow the on-screen directions.

```powershell
Connect-AzureRmAccount
```

If you don't know which location you want to use, you can list the available locations. After the list is displayed, find the one you want to use. This example uses **eastus**. Store this in a variable and use the variable so you can change it in one place.

```powershell
Get-AzureRmLocation | select Location 
$location = "eastus"
```

## Create a resource group

Create an Azure resource group with [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed. 

```powershell
$resourceGroup = "myResourceGroup"
New-AzureRmResourceGroup -Name $resourceGroup -Location $location 
```

## Create a storage account

Create a standard general-purpose storage account with LRS replication using [New-AzureRmStorageAccount](/powershell/module/azurerm.storage/New-AzureRmStorageAccount), then retrieve the storage account context that defines the storage account to be used. When acting on a storage account, you reference the context instead of repeatedly providing the credentials. This example creates a storage account called *mystorageaccount* with locally redundant storage(LRS) and blob encryption (enabled by default).

```powershell
$storageAccount = New-AzureRmStorageAccount -ResourceGroupName $resourceGroup `
  -Name "mystorageaccount" `
  -Location $location `
  -SkuName Standard_LRS `
  -Kind Storage

$ctx = $storageAccount.Context
```
