---
 title: include file
 description: include file
 services: storage
 author: khdownie
 ms.service: azure-storage
 ms.topic: include
 ms.date: 6/2/2020
 ms.author: kendownie
 ms.custom: include file, devx-track-azurepowershell
---
The following PowerShell command will deny all traffic to the storage account's public endpoint. Note that this command has the `-Bypass` parameter set to `AzureServices`. This will allow trusted first party services such as Azure File Sync to access the storage account via the public endpoint.

```PowerShell
# This assumes $storageAccount is still defined from the beginning of this of this guide.
$storageAccount | Update-AzStorageAccountNetworkRuleSet `
        -DefaultAction Deny `
        -Bypass AzureServices `
        -WarningAction SilentlyContinue `
        -ErrorAction Stop | `
    Out-Null
```
