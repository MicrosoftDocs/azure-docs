---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 09/26/2019
ms.author: glenga
---

### Query the Storage queue

You can use the [`az storage queue list`](/cli/azure/storage/queue#az_storage_queue_list) command to view the Storage queues in your account, as in the following example:

```azurecli-interactive
az storage queue list --output tsv
```

The output from this command includes a queue named `outqueue`, which is the queue that was created when the function ran.

Next, use the [`az storage message peek`](/cli/azure/storage/message#az_storage_message_peek) command to view the messages in this queue, as in this example:

```azurecli-interactive
echo `echo $(az storage message peek --queue-name outqueue -o tsv --query '[].{Message:content}') | base64 --decode`
```

The string returned should be the same as the message you sent to test the function.

> [!NOTE]  
> The previous example decodes the returned string from base64. This is because the Queue storage bindings write to and read from Azure Storage as [base64 strings](../articles/azure-functions/functions-bindings-storage-queue-trigger.md#encoding).