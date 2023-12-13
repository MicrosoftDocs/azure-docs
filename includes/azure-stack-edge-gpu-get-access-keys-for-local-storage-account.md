---
author: alkohli
ms.service: databox  
ms.topic: include
ms.date: 04/15/2022
ms.author: alkohli
---

To get the access keys for an existing local storage account that you have created, provide the associated resource group name and the local storage account name. 

### [Az](#tab/az)

```powershell
Get-AzStorageAccountKey
``` 

Here's an example output:

```output
PS C:\WINDOWS\system32> Get-AzStorageAccountKey
    
cmdlet Get-AzStorageAccountKey at command pipeline position 1
Supply values for the following parameters:
(Type !? for Help.)
ResourceGroupName: myaseazrg
Name: myaseazsa
    
KeyName    Value                                                                                       Permissions
-------    -----                                                                                       ------
key1       gv3OF57tuPDyzBNc1M7fhil2UAiiwnhTT6zgiwE3TlF/CD217Cvw2YCPcrKF47joNKRvzp44leUe5HtVkGx8RQ==    Full
key2       kmEynIs3xnpmSxWbU41h5a7DZD7v4gGV3yXa2NbPbmhrPt10+QmE5PkOxxypeSqbqzd9si+ArNvbsqIRuLH2Lw==    Full
    
PS C:\WINDOWS\system32>
```

### [AzureRM](#tab/azure-rm)

To get the storage account key, run the `Get-AzureRmStorageAccountKey` command. Here's some example output:

```output
PS C:\windows\system32> Get-AzureRmStorageAccountKey

cmdlet Get-AzureRmStorageAccountKey at command pipeline position 1
Supply values for the following parameters:
(Type !? for Help.)
ResourceGroupName: my-resource-ase
Name:myasestoracct

KeyName Value
------- -----
key1 /IjVJN+sSf7FMKiiPLlDm8mc9P4wtcmhhbnCa7...
key2 gd34TcaDzDgsY9JtDNMUgLDOItUU0Qur3CBo6Q...
```
---