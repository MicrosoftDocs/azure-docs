---
title: Perform Azure Queue storage actions in PowerShell
description: How to perform operations on Azure Queue storage with PowerShell
author: mhopkins-msft

ms.author: mhopkins
ms.date: 05/15/2019
ms.service: storage
ms.subservice: queues
ms.topic: conceptual
ms.reviewer: cbrooks
---

# Perform Azure Queue storage operations with Azure PowerShell

Azure Queue storage is a service for storing large numbers of messages that can be accessed from anywhere in the world via HTTP or HTTPS. For detailed information, see [Introduction to Azure Queues](storage-queues-introduction.md). This how-to article covers common Queue storage operations. You learn how to:

> [!div class="checklist"]
>
> * Create a queue
> * Retrieve a queue
> * Add a message
> * Read a message
> * Delete a message
> * Delete a queue

This how-to requires the Azure PowerShell module Az version 0.7 or later. Run `Get-Module -ListAvailable Az` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-Az-ps).

There are no PowerShell cmdlets for the data plane for queues. To perform data plane operations such as add a message, read a message, and delete a message, you have to use the .NET storage client library as it is exposed in PowerShell. You create a message object and then you can use commands such as AddMessage to perform operations on that message. This article shows you how to do that.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Sign in to Azure

Sign in to your Azure subscription with the `Connect-AzAccount` command and follow the on-screen directions.

```powershell
Connect-AzAccount
```

## Retrieve list of locations

If you don't know which location you want to use, you can list the available locations. After the list is displayed, find the one you want to use. This exercise will use **eastus**. Store this in the variable **location** for future use.

```powershell
Get-AzLocation | Select-Object Location
$location = "eastus"
```

## Create resource group

Create a resource group with the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) command.

An Azure resource group is a logical container into which Azure resources are deployed and managed. Store the resource group name in a variable for future use. In this example, a resource group named *howtoqueuesrg* is created in the *eastus* region.

```powershell
$resourceGroup = "howtoqueuesrg"
New-AzResourceGroup -ResourceGroupName $resourceGroup -Location $location
```

## Create storage account

Create a standard general-purpose storage account with locally redundant storage (LRS) using [New-AzStorageAccount](/powershell/module/az.storage/New-azStorageAccount). Get the storage account context that defines the storage account to be used. When acting on a storage account, you reference the context instead of repeatedly providing the credentials.

```powershell
$storageAccountName = "howtoqueuestorage"
$storageAccount = New-AzStorageAccount -ResourceGroupName $resourceGroup `
  -Name $storageAccountName `
  -Location $location `
  -SkuName Standard_LRS

$ctx = $storageAccount.Context
```

## Create a queue

The following example first establishes a connection to Azure Storage using the storage account context, which includes the storage account name and its access key. Next, it calls [New-AzStorageQueue](/powershell/module/az.storage/New-AzStorageQueue) cmdlet to create a queue named 'queuename'.

```powershell
$queueName = "howtoqueue"
$queue = New-AzStorageQueue –Name $queueName -Context $ctx
```

For information on naming conventions for Azure Queue Service, see [Naming Queues and Metadata](https://msdn.microsoft.com/library/azure/dd179349.aspx).

## Retrieve a queue

You can query and retrieve a specific queue or a list of all the queues in a Storage account. The following examples demonstrate how to retrieve all queues in the storage account, and a specific queue; both commands use the [Get-AzStorageQueue](/powershell/module/az.storage/Get-AzStorageQueue) cmdlet.

```powershell
# Retrieve a specific queue
$queue = Get-AzStorageQueue –Name $queueName –Context $ctx
# Show the properties of the queue
$queue

# Retrieve all queues and show their names
Get-AzStorageQueue -Context $ctx | Select-Object Name
```

## Add a message to a queue

Operations that impact the actual messages in the queue use the .NET storage client library as exposed in PowerShell. To add a message to a queue, create a new instance of the message object, [Microsoft.Azure.Storage.Queue.CloudQueueMessage](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.queue._cloud_queue_message) class. Next, call the [AddMessage](https://docs.microsoft.com/java/api/com.microsoft.azure.storage.queue._cloud_queue.addmessage) method. A CloudQueueMessage can be created from either a string (in UTF-8 format) or a byte array.

The following example demonstrates how to add a message to your queue.

```powershell
# Create a new message using a constructor of the CloudQueueMessage class
$queueMessage = [Microsoft.Azure.Storage.Queue.CloudQueueMessage]::new("This is message 1")

# Add a new message to the queue
$queue.CloudQueue.AddMessageAsync($QueueMessage)

# Add two more messages to the queue
$queueMessage = [Microsoft.Azure.Storage.Queue.CloudQueueMessage]::new("This is message 2")
$queue.CloudQueue.AddMessageAsync($QueueMessage)

$queueMessage = [Microsoft.Azure.Storage.Queue.CloudQueueMessage]::new("This is message 3")
$queue.CloudQueue.AddMessageAsync($QueueMessage)
```

If you use the [Azure Storage Explorer](https://storageexplorer.com), you can connect to your Azure account and view the queues in the storage account, and drill down into a queue to view the messages on the queue.

## Read a message from the queue, then delete it

Messages are read in best-try first-in-first-out order. This is not guaranteed. When you read the message from the queue, it becomes invisible to all other processes looking at the queue. This ensures that if your code fails to process the message due to hardware or software failure, another instance of your code can get the same message and try again.  

This **invisibility timeout** defines how long the message remains invisible before it is available again for processing. The default is 30 seconds.

Your code reads a message from the queue in two steps. When you call the [Microsoft.Azure.Storage.Queue.CloudQueue.GetMessage](/dotnet/api/microsoft.azure.storage.queue.cloudqueue.getmessage) method, you get the next message in the queue. A message returned from **GetMessage** becomes invisible to any other code reading messages from this queue. To finish removing the message from the queue, you call the [Microsoft.Azure.Storage.Queue.CloudQueue.DeleteMessage](/dotnet/api/microsoft.azure.storage.queue.cloudqueue.deletemessage) method.

In the following example, you read through the three queue messages, then wait 10 seconds (the invisibility timeout). Then you read the three messages again, deleting the messages after reading them by calling **DeleteMessage**. If you try to read the queue after the messages are deleted, $queueMessage will be returned as NULL.

```powershell
# Set the amount of time you want to entry to be invisible after read from the queue
# If it is not deleted by the end of this time, it will show up in the queue again
$invisibleTimeout = [System.TimeSpan]::FromSeconds(10)

# Read the message from the queue, then show the contents of the message. Read the other two messages, too.
$queueMessage = $queue.CloudQueue.GetMessageAsync($invisibleTimeout,$null,$null)
$queueMessage.Result
$queueMessage = $queue.CloudQueue.GetMessageAsync($invisibleTimeout,$null,$null)
$queueMessage.Result
$queueMessage = $queue.CloudQueue.GetMessageAsync($invisibleTimeout,$null,$null)
$queueMessage.Result

# After 10 seconds, these messages reappear on the queue.
# Read them again, but delete each one after reading it.
# Delete the message.
$queueMessage = $queue.CloudQueue.GetMessageAsync($invisibleTimeout,$null,$null)
$queueMessage.Result
$queue.CloudQueue.DeleteMessageAsync($queueMessage.Result.Id,$queueMessage.Result.popReceipt)
$queueMessage = $queue.CloudQueue.GetMessageAsync($invisibleTimeout,$null,$null)
$queueMessage.Result
$queue.CloudQueue.DeleteMessageAsync($queueMessage.Result.Id,$queueMessage.Result.popReceipt)
$queueMessage = $queue.CloudQueue.GetMessageAsync($invisibleTimeout,$null,$null)
$queueMessage.Result
$queue.CloudQueue.DeleteMessageAsync($queueMessage.Result.Id,$queueMessage.Result.popReceipt)
```

## Delete a queue

To delete a queue and all the messages contained in it, call the Remove-AzStorageQueue cmdlet. The following example shows how to delete the specific queue used in this exercise using the Remove-AzStorageQueue cmdlet.

```powershell
# Delete the queue
Remove-AzStorageQueue –Name $queueName –Context $ctx
```

## Clean up resources

To remove all of the assets you have created in this exercise, remove the resource group. This also deletes all resources contained within the group. In this case, it removes the storage account created and the resource group itself.

```powershell
Remove-AzResourceGroup -Name $resourceGroup
```

## Next steps

In this how-to article, you learned about basic Queue storage management with PowerShell, including how to:

> [!div class="checklist"]
>
> * Create a queue
> * Retrieve a queue
> * Add a message
> * Read the next message
> * Delete a message
> * Delete a queue

### Microsoft Azure PowerShell Storage cmdlets

* [Storage PowerShell cmdlets](/powershell/module/az.storage)

### Microsoft Azure Storage Explorer

* [Microsoft Azure Storage Explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md?toc=%2fazure%2fstorage%2fqueues%2ftoc.json) is a free, standalone app from Microsoft that enables you to work visually with Azure Storage data on Windows, macOS, and Linux.
