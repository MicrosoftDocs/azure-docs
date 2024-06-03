---
title: How to use Azure Queue Storage from PowerShell
titleSuffix: Azure Storage
description: Perform operations on Azure Queue Storage via PowerShell. With Azure Queue Storage, you can store large numbers of messages that are accessible by HTTP or HTTPS.
author: stevenmatthew
ms.author: shaas
ms.reviewer: dineshm 
ms.date: 05/21/2024
ms.topic: how-to
ms.service: azure-queue-storage
ms.custom: devx-track-azurepowershell
---

# How to use Azure Queue Storage from PowerShell

Azure Queue Storage is a service for storing large numbers of messages that can be accessed from anywhere in the world via HTTP or HTTPS. For detailed information, see [Introduction to Azure Queue Storage](storage-queues-introduction.md). This how-to article covers common Queue Storage operations. You learn how to:

> [!div class="checklist"]
>
> - Create a queue
> - Retrieve a queue
> - Add messages
> - Retrieve messages
> - Delete a messages
> - Delete a queue

This how-to guide requires the Azure PowerShell (`Az`) module v12.0.0. Run `Get-Module -ListAvailable Az` to find the currently installed version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell).

There are no PowerShell cmdlets for the data plane for queues. To perform data plane operations such as add a message, read a message, and delete a message, you have to use the .NET storage client library as it is exposed in PowerShell. You create a message object and then you can use commands such as `AddMessage` to perform operations on that message. This article shows you how to do that.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Sign in to Azure

Sign in to your Azure subscription with the `Connect-AzAccount` command and follow the on-screen directions. If needed, you can specify a subscription by adding the `TenantId` and `Subscription` parameters, and including the respective values.

```powershell
Connect-AzAccount
```

## Retrieve a list of locations

If you don't know which location you want to use, you can list the available locations using the [`Get-AzLocation`](/powershell/module/az.resources/get-azlocation) cmdlet as shown in the example provided. After the list is displayed, choose a location and store it in the `location` variable for future use. The examples in this exercise use the `eastus` location.

```powershell
Get-AzLocation | Select-Object Location
$location = "eastus"
```

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed. Choose a name for your resource group and store it in the `resourceGroup` variable for future use. This example uses the name `howtoqueuesrg`.

Create a resource group by calling the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) cmdlet and providing the name and location to the `ResourceGroupName` parameter as shown.

```powershell
$resourceGroup = "howtoqueuesrg"
New-AzResourceGroup -ResourceGroupName $resourceGroup -Location $location
```

## Create a storage account

An Azure storage account is a uniquely named resource that contains all of your data objects as blobs, files, queues, and tables.

Choose a name for your storage account and store it in the `storageAccountName` variable for future use. This example uses the name `howtoqueuestorage`.

Next, create a standard general-purpose storage account with locally redundant storage (LRS) using the [New-AzStorageAccount](/powershell/module/az.storage/new-azstorageaccount) cmdlet. Finally, set the storage account context that defines the storage account, saving it to the `ctx` variable. Referencing the context with the variable allows you to perform operations against a storage account without repeatedly providing credentials.

```powershell
$storageAccountName = "howtoqueuestorage"

$storageAccount = New-AzStorageAccount -ResourceGroupName $resourceGroup `
  -Name $storageAccountName `
  -Location $location `
  -SkuName Standard_LRS

$ctx = $storageAccount.Context
```

## Create a queue

First, choose a name for your storage account and store it in the `queueName` variable. This example uses the name `howtoqueuestorage`. Next, create a queue using the [New-AzStorageQueue](/powershell/module/az.storage/new-azstoragequeue) cmdlet and passing the `queueName` and `ctx` variables to the `Name` and `Context` parameters as shown.

```powershell
$queueName = "howtoqueue"
$queue = New-AzStorageQueue -Name $queueName -Context $ctx
```

For information on naming conventions for Azure Queue Storage, see [Naming queues and metadata](/rest/api/storageservices/naming-queues-and-metadata).

## Retrieve a queue

You can use the [Get-AzStorageQueue](/powershell/module/az.storage/get-azstoragequeue) cmdlet to retrieve a specific queue, or a list of all queues within a storage account. The following examples demonstrate how to retrieve all queues by using the `Get-AzStorageQueue` cmdlet, and how to specify a queue by using `Name` parameter.

```powershell
# Retrieve all queues and show their names
Get-AzStorageQueue -Context $ctx | Select-Object Name

# Retrieve a specific queue
$queue = Get-AzStorageQueue -Name $queueName -Context $ctx

# Show the properties of the queue
$queue
```

## Add messages to a queue

Operations that impact the messages in a queue use the .NET storage client library as exposed in PowerShell. To add a message to a queue, pass your message as a string to the [`QueueClient`](/dotnet/api/azure.storage.queues.queueclient) class's [`SendMessage`](/dotnet/api/azure.storage.queues.queueclient.sendmessage) method. 

Your message string must be in UTF-8 format.

The following example demonstrates how to add messages to your queue.

```powershell
# Create a new message using a constructor of the CloudQueueMessage class
$queueMessage = "This is message 1"

# Add a new message to the queue
$queue.QueueClient.AddMessageAsync($queueMessage)

# Add two more messages to the queue
$queueMessages = @("This is message 2","This is message 3")
$queueMessages | foreach {$queue.QueueClient.AddMessageAsync($_)}
```

If you use the [Azure Storage Explorer](https://storageexplorer.com), you can connect to your Azure account and view the queues in the storage account, and drill down into a queue to view the messages on the queue.

## Retrieve messages from a queue

Though not always guaranteed, messages are retrieved from a queue in *best-try*, *first-in-first-out* order. 

Depending on your use case, you can retrieve one or more messages from a queue. You can also modify the visibility of the messages, either permitting or preventing other processes from accessing the same message.

There are two ways to retrieve messages from a queue:

- **Receive**: Retrieving a message using `Receive` dequeues the message and increments its `DequeueCount` property. Unless a message is deleted, it's reinserted in the queue to be processed again.
- **Peek**: Retrieving a message using `Peek` allows you to "preview" messages from the queue. `Peek` doesn't dequeue the message or increment its `DequeueCount` property.

### Receive messages

When you *read* a message from a queue using a method such as [`ReceiveMessage`](/dotnet/api/azure.storage.queues.queueclient.receivemessage), the message is temporarily dequeued and becomes temporarily invisible to other processes. This **visibility timeout** defines how long the message remains invisible. The default visibility timeout is 30 seconds. 

If the message isn't processed before the visibility timeout passes, its `DequeueCount` property is incremented and it's reinserted at the end of the queue. Reinserting the same message ensures that another process can retrieve the same message and try again.

The following example sets the invisibleTimeout variable to 10 seconds, then reads two messages from the queue.

```powershell
# Set the amount of time you want to entry to be invisible after read from the queue
# If it is not deleted by the end of this time, it will show up in the queue again
$visibilityTimeout = [System.TimeSpan]::FromSeconds(10)

# Read the message from the queue, then show the contents of the message. 
# Read the next message, too.
$queueMessage = $queue.QueueClient.ReceiveMessage($visibilityTimeout)
$queueMessage.Value
$queueMessage = $queue.QueueClient.ReceiveMessage($visibilityTimeout)
$queueMessage.Value
```

You can retrieve multiple messages from the queue simultaneously by using the `ReceiveMessages` method and passing and integer value to specify the maximum number of messages to return. 

```powershell
# Set the amount of time you want to entry to be invisible after read from the queue
# If it is not deleted by the end of this time, it will show up in the queue again
$visibilityTimeout = [System.TimeSpan]::FromSeconds(10)

# Read the messages from the queue, then show the contents of the messages.
$queueMessage = $queue.QueueClient.ReceiveMessages(5,$visibilityTimeout)
$queueMessage.Value
```

### Peek messages

For use cases that might involve shared queues or previewing messages without altering their visibility, you can use the [`PeekMessage`](/dotnet/api/azure.storage.queues.queueclient.peekmessage) and [`PeekMessages`](/dotnet/api/azure.storage.queues.queueclient.peekmessages) methods. As with the previous [`ReceiveMessages`](#receive-messages) example, multiple messages can be peeked simultaneously by passing an integer value to specify the maximum number of messages. 

The following examples use both the `PeekMessage` and `PeekMessages` methods to retrieve messages from a queue.

```powershell
# Read the message from the queue, then show the contents of the message. 
$queueMessage = $queue.QueueClient.PeekMessage()
$queueMessage.Value

# Read the next four messages, then show the contents of the messages.
$queueMessage = $queue.QueueClient.PeekMessages(4)
$queueMessage.Value
```

## Delete messages from a queue

To prevent accidental deletion, both the `MessageId` and `PopReceipt` properties must be supplied before permanently deleting a message. Because of this requirement, it's easiest to delete a message using a two-step process. 

First, fetch the next message in the queue by calling the [`ReceiveMessage`](/dotnet/api/azure.storage.queues.queueclient.receivemessage) or [`ReceiveMessages`](/dotnet/api/azure.storage.queues.queueclient.receivemessages) methods. To finish removing the message from the queue, pass the values obtained from the message to the [`DeleteMessage`](/dotnet/api/azure.storage.queues.queueclient.deletemessage) method. 

This process is illustrated in the following examples. 

```PowerShell
# Set the amount of time you want to entry to be invisible after read from the queue
# If it is not deleted by the end of this time, it will show up in the queue again
$visibilityTimeout = [System.TimeSpan]::FromSeconds(10)

# Receive one message from the queue, then delete the message. 
$queueMessage = $queue.QueueClient.ReceiveMessage($visibilityTimeout)
$queue.QueueClient.DeleteMessage($queueMessage.Value.MessageId, $queueMessage.Value.PopReceipt)

# Receive four message from the queue, then delete the messages. 
$queueMessage = $queue.QueueClient.ReceiveMessages(4,$visibilityTimeout)
$queueMessage.Value | foreach { $queue.QueueClient.DeleteMessage($_.MessageId, $_.PopReceipt)}
```

## Delete a queue

To delete a queue and all the messages contained in it, call the [`QueueClient`](/dotnet/api/azure.storage.queues.queueclient) class's [`Delete`](/dotnet/api/azure.storage.queues.queueclient.delete) method. The following example shows how to delete the specific queue used in this exercise.

```powershell
# Delete the queue
Remove-AzStorageQueue -Name $queueName -Context $ctx
```

## Clean up resources

Remove the resource group to delete the assets and resources created in this exercise. In this case, the storage account and the resource group itself are also deleted.

```powershell
Remove-AzResourceGroup -Name $resourceGroup
```

## Next steps

In this how-to article, you learned about basic Queue Storage management with PowerShell, including how to:

> [!div class="checklist"]
>
> - Create a queue
> - Retrieve a queue
> - Add messages
> - Read messages
> - Delete messages
> - Delete a queue

### Microsoft Azure PowerShell storage cmdlets

- [Storage PowerShell cmdlets](/powershell/module/az.storage)

### Microsoft Azure Storage Explorer

- [Microsoft Azure Storage Explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md?toc=/azure/storage/queues/toc.json) is a free, standalone app from Microsoft that enables you to work visually with Azure Storage data on Windows, macOS, and Linux.
