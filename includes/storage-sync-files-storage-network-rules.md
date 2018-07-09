---
 title: include file
 description: include file
 services: storage
 author: wmgries
 ms.service: storage
 ms.topic: include
 ms.date: 07/08/2018
 ms.author: wgries
 ms.custom: include file
---
# [Portal](#tab/portal)
1. Once in the storage account, select **Firewalls and virtual networks** on the left-hand side of the storage account.
2. Inside the storage account, the **Allow access from all networks** radio button should be selected.
    ![A screenshot showing the storage account firewall and network rules disabled.](media/storage-sync-files-storage-network-rules/file-share-inaccessible-2.png)

# [PowerShell](#tab/powershell)
```PowerShell
if ($storageAccount.NetworkRuleSet.DefaultAction -ne 
    [Microsoft.Azure.Commands.Management.Storage.Models.PSNetWorkRuleDefaultActionEnum]::Allow) {
    Write-Host ("The storage account referenced contains network " + `
        "rules which are not currently supported by Azure File Sync.")
}
```
---