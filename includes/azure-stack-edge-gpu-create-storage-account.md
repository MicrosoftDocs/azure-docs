---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 04/13/2022
ms.author: alkohli
---

Create a new local storage account by using an existing resource group. Use this local storage account to upload the virtual disk image when creating a VM.

Before you create a local storage account, you must configure your client to connect to the device via Azure Resource Manager over Azure PowerShell. For detailed instructions, see [Connect to Azure Resource Manager on your Azure Stack Edge device](../articles/databox-online/azure-stack-edge-gpu-connect-resource-manager.md).

### [Az](#tab/az)

1. Set some parameters.

    ```powershell
    $StorageAccountName = "<Storage account name>"    
    ```

1. Create a new local storage account on your device.

    ```powershell
    New-AzStorageAccount -Name $StorageAccountName -ResourceGroupName $ResourceGroupName -Location DBELocal -SkuName Standard_LRS
    ```
    
    > [!NOTE]
    > By using Azure Resource Manager, you can create only local storage accounts, such as locally redundant storage (standard or premium). To create tiered storage accounts, see [Tutorial: Transfer data via storage accounts with Azure Stack Edge Pro with GPU](../articles/databox-online/azure-stack-edge-gpu-deploy-add-storage-accounts.md).

    Here's an example output:
    
    ```output
    PS C:\WINDOWS\system32> New-AzStorageAccount -Name myaseazsa -ResourceGroupName myaseazrg -Location DBELocal -SkuName Standard_LRS
    
    StorageAccountName ResourceGroupName PrimaryLocation SkuName      Kind    AccessTier CreationTime
    ------------------ ----------------- --------------- -------      ----    ---------- ------------
    myaseazsa          myaseazrg         DBELocal        Standard_LRS Storage            6/10/2021 11:45...
    
    PS C:\WINDOWS\system32>
    ```

### [AzureRM](#tab/azure-rm)

```powershell
New-AzureRmStorageAccount -Name <Storage account name> -ResourceGroupName <Resource group name> -Location DBELocal -SkuName Standard_LRS
```

> [!NOTE]
> By using Azure Resource Manager, you can create only local storage accounts, such as locally redundant storage (standard or premium). To create tiered storage accounts, see [Tutorial: Transfer data via storage accounts with Azure Stack Edge Pro with GPU](../articles/databox-online/azure-stack-edge-gpu-deploy-add-storage-accounts.md).

Here's some example output:

```output
New-AzureRmStorageAccount -Name sa191113014333  -ResourceGroupName rg191113014333 -SkuName Standard_LRS -Location DBELocal

ResourceGroupName      : rg191113014333
StorageAccountName     : sa191113014333
Id                     : /subscriptions/.../resourceGroups/rg191113014333/providers/Microsoft.Storage/storageaccounts/sa191113014333
Location               : DBELocal
Sku                    : Microsoft.Azure.Management.Storage.Models.Sku
Kind                   : Storage
Encryption             : Microsoft.Azure.Management.Storage.Models.Encryption
AccessTier             :
CreationTime           : 11/13/2019 9:43:49 PM
CustomDomain           :
Identity               :
LastGeoFailoverTime    :
PrimaryEndpoints       : Microsoft.Azure.Management.Storage.Models.Endpoints
PrimaryLocation        : DBELocal
ProvisioningState      : Succeeded
SecondaryEndpoints     :
SecondaryLocation      :
StatusOfPrimary        : Available
StatusOfSecondary      :
Tags                   :
EnableHttpsTrafficOnly : False
NetworkRuleSet         :
Context                : Microsoft.WindowsAzure.Commands.Common.Storage.LazyAzureStorageContext
ExtendedProperties     : {}
```
---
