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
1. Click **Access control (IAM)** on the left-hand table of contents to navigate to the list of users and applications (*service principals*) which have access to your storage account.
2. Verify **Hybrid File Sync Service** appears in the list with the **Reader and Data Access** role. 
    ![A screen shot of the Hybrid File Sync Service service principal in the access control tab of the storage account](media/storage-sync-files-access-control/file-share-inaccessible-3.png)

# [PowerShell](#tab/powershell)
```PowerShell    
$foundSyncPrincipal = $false
Get-AzureRmRoleAssignment -Scope $storageAccount.Id | ForEach-Object { 
    if ($_.DisplayName -eq "Hybrid File Sync Service") {
        $foundSyncPrincipal = $true
        if ($_.RoleDefinitionName -ne "Reader and Data Access") {
            Write-Host ("The storage account has the Azure File Sync " + `
                "service principal authorized to do something other than access the data " + `
                "within the referenced Azure file share.")
        }

        break
    }
}

if (!$foundSyncPrincipal) {
    Write-Host ("The storage account does not have the Azure File Sync " + `
                "service principal authorized to access the data within the " + ` 
                "referenced Azure file share.")
}
```
---