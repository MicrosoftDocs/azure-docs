---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 03/25/2020
ms.author: glenga
---
You can view the queue in the [Azure portal](../articles/storage/queues/storage-quickstart-queues-portal.md) or in the  [Microsoft Azure Storage Explorer](https://storageexplorer.com/). You can also view the queue in the Azure CLI, as described in the following steps:

1. Open the function project's *local.setting.json* file and copy the connection string value. In a terminal or command window, run the following command to create an environment variable named `AZURE_STORAGE_CONNECTION_STRING`, pasting your specific connection string in place of  `<MY_CONNECTION_STRING>`. (This environment variable means you don't need to supply the connection string to each subsequent command using the `--connection-string` argument.)

    # [bash](#tab/bash)
    
    ```bash
    AZURE_STORAGE_CONNECTION_STRING="<MY_CONNECTION_STRING>"
    ```
    
    # [PowerShell](#tab/powershell)
    
    ```powershell
    $env:AZURE_STORAGE_CONNECTION_STRING = "<MY_CONNECTION_STRING>"
    ```
    
    # [Azure CLI](#tab/cmd)
    
    ```azurecli
    set AZURE_STORAGE_CONNECTION_STRING="<MY_CONNECTION_STRING>"
    ```
    
    ---
    
1. (Optional) Use the [`az storage queue list`](/cli/azure/storage/queue#az-storage-queue-list) command to view the Storage queues in your account. The output from this command should include a queue named `outqueue`, which was created when the function wrote its first message to that queue.
    
    ```azurecli
    az storage queue list --output tsv
    ```

1. Use the [`az storage message get`](/cli/azure/storage/message#az-storage-message-get) command to read the message from this queue, which should be the first name you used when testing the function earlier. The command reads and removes the first message from the queue. 

    # [bash](#tab/bash)
    
    ```bash
    echo `echo $(az storage message get --queue-name outqueue -o tsv --query '[].{Message:content}') | base64 --decode`
    ```
    
    # [PowerShell](#tab/powershell)
    
    ```powershell
    [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($(az storage message get --queue-name outqueue -o tsv --query '[].{Message:content}')))
    ```
    
    # [Azure CLI](#tab/cmd)
    
    ```azurecli
    az storage message get --queue-name outqueue -o tsv --query [].{Message:content} > %TEMP%out.b64 && certutil -decode -f %TEMP%out.b64 %TEMP%out.txt > NUL && type %TEMP%out.txt && del %TEMP%out.b64 %TEMP%out.txt /q
    ```

    This script uses certutil to decode the base64-encoded message collection from a local temp file. If there's no output, try removing `> NUL` from the script to stop suppressing certutil output, in case there's an error. 
    
    ---
    
    Because the message body is stored [base64 encoded](../articles/azure-functions/functions-bindings-storage-queue-trigger.md#encoding), the message must be decoded before it's displayed. After you execute `az storage message get`, the message is removed from the queue. If there was only one message in `outqueue`, you won't retrieve a message when you run this command a second time and instead get an error.