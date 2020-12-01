---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 08/17/2020
ms.author: inhenkel
ms.custom: CLI
---

<!-- ### Upload files with the CLI -->

The following command uploads a single file.  

Change the following values:

1. Change `/path/to/file` to your local path of the file.  
1. Change `MyContainer` to an asset that you previously created using the asset ID (not the name).
1. Change `MyBlob` to the name you want to use for the uploaded file.
1. Change `MyStorageAccountName` to the name of the storage account you are using.
1. Change `MyStorageAccountKey` to the access key for your storage account.

    ```azurecli
    az storage blob upload -f /path/to/file -c MyContainer -n MyBlob --acount-name MyStorageAccountName --account-key MyStorageAccountKey
    ```
