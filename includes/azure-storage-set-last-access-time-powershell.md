---
 author: normesta
 ms.service: storage
 ms.topic: include
 ms.date: 05/02/2024
 ms.author: normesta
---

To enable last access time tracking with PowerShell, call the [Enable-AzStorageBlobLastAccessTimeTracking](/powershell/module/az.storage/enable-azstoragebloblastaccesstimetracking) command, as shown in the following example. Remember to replace placeholder values in angle brackets with your own values:

```powershell
# Initialize these variables with your values.
$rgName = "<resource-group>"
$accountName = "<storage-account>"

Enable-AzStorageBlobLastAccessTimeTracking  -ResourceGroupName $rgName `
    -StorageAccountName $accountName `
    -PassThru
```