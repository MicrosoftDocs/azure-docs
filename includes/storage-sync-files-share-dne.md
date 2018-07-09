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
1. Click **Overview** on the left-hand table of contents to return to the main storage account page.
2. Select **Files** to view the list of file shares.
3. Verify the file share referenced by the cloud endpoint appears in the list of file shares (you should have noted this in step 1 above).

# [PowerShell](#tab/powershell)
```PowerShell
$fileShare = Get-AzureStorageShare -Context $storageAccount.Context | Where-Object {
    $_.Name -eq $cloudEndpoint.StorageAccountShareName -and
    $_.IsSnapshot -eq $false
}

if ($fileShare -eq $null) {
    Write-Host "The Azure file share referenced by the cloud endpoint does not exist"
}
```
---