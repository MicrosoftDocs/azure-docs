---
title: Perform operations on Azure Queue storage with PowerShell | Microsoft Docs
description: How to perform operations on Azure Queue storage with PowerShell
services: storage
author: roygara

ms.service: storage
ms.topic: how-to
ms.date: 09/14/2017
ms.author: rogarana
ms.component: queues
---

# Perform Azure Queue storage operations with Azure PowerShell

Azure Queue storage is a service for storing large numbers of messages that can be accessed from anywhere in the world via HTTP or HTTPS. For detailed information, see [Introduction to Azure Queues](storage-queues-introduction.md). This how-to article covers common Queue storage operations. You learn how to:

> [!div class="checklist"]
> * Create a queue
> * Retrieve a queue
> * Add a message
> * Read a message
> * Delete a message 
> * Delete a queue

This how-to requires the Azure PowerShell module version 3.6 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps).

There are no PowerShell cmdlets for the data plane for queues. To perform data plane operations such as add a message, read a message, and delete a message, you have to use the .NET storage client library as it is exposed in PowerShell. You create a message object and then you can use commands such as AddMessage to perform operations on that message. This article shows you how to do that.

## Sign in to Azure

Log in to your Azure subscription with the `Connect-AzureRmAccount` command and follow the on-screen directions.

```powershell
Connect-AzureRmAccount
```

## Retrieve list of locations

If you don't know which location you want to use, you can list the available locations. After the list is displayed, find the one you want to use. This exercise will use **eastus**. Store this in the variable **location** for future use.

```powershell
Get-AzureRmLocation | select Location 
$location = "eastus"
```

## Create resource group

Create a resource group with the [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) command. 

An Azure resource group is a logical container into which Azure resources are deployed and managed. Store the resource group name in a variable for future use. In this example, a resource group named *howtoqueuesrg* is created in the *eastus* region.

```powershell
$resourceGroup = "howtoqueuesrg"
New-AzureRmResourceGroup -ResourceGroupName $resourceGroup -Location $location
```

## Create storage account

Create a standard general-purpose storage account with locally-redundant storage (LRS) using [New-AzureRmStorageAccount](/powershell/module/azurerm.storage/New-AzureRmStorageAccount). Get the storage account context that defines the storage account to be used. When acting on a storage account, you reference the context instead of repeatedly providing the credentials.

```powershell
$storageAccountName = "howtoqueuestorage"
$storageAccount = New-AzureRmStorageAccount -ResourceGroupName $resourceGroup `
  -Name $storageAccountName `
  -Location $location `
  -SkuName Standard_LRS

$ctx = $storageAccount.Context
```

## Create a queue

The following example first establishes a connection to Azure Storage using the storage account context, which includes the storage account name and its access key. Next, it calls [New-AzureStorageQueue](/powershell/module/azure.storage/new-azurestoragequeue) cmdlet to create a queue named 'queuename'.

```powershell
$queueName = "howtoqueue"
$queue = New-AzureStorageQueue –Name $queueName -Context $ctx
```

For information on naming conventions for Azure Queue Service, see [Naming Queues and Metadata](http://msdn.microsoft.com/library/azure/dd179349.aspx).

## Retrieve a queue

You can query and retrieve a specific queue or a list of all the queues in a Storage account. The following examples demonstrate how to retrieve all queues in the storage account, and a specific queue; both commands use the [Get-AzureStorageQueue](/powershell/module/azure.storage/get-azurestoragequeue) cmdlet.

```powershell
# Retrieve a specific queue
$queue = Get-AzureStorageQueue –Name $queueName –Context $ctx
# Show the properties of the queue
$queue

# Retrieve all queues and show their names
Get-AzureStorageQueue -Context $ctx | select Name
```

## Add a message to a queue

Operations that impact the actual messages in the queue use the .NET storage client library as exposed in PowerShell. To add a message to a queue, create a new instance of the message object, [Microsoft.WindowsAzure.Storage.Queue.CloudQueueMessage](http://msdn.microsoft.com/library/azure/jj732474.aspx) class. Next, call the [AddMessage](http://msdn.microsoft.com/library/azure/microsoft.windowsazure.storage.queue.cloudqueue.addmessage.aspx) method. A CloudQueueMessage can be created from either a string (in UTF-8 format) or a byte array.

The following example demonstrates how to add a message to your queue.

```powershell
# Create a new message using a constructor of the CloudQueueMessage class
$queueMessage = New-Object -TypeName Microsoft.WindowsAzure.Storage.Queue.CloudQueueMessage `
  -ArgumentList "This is message 1"
# Add a new message to the queue
$queue.CloudQueue.AddMessage($QueueMessage)

# Add two more messages to the queue 
$queueMessage = New-Object -TypeName Microsoft.WindowsAzure.Storage.Queue.CloudQueueMessage `
  -ArgumentList "This is message 2"
$queue.CloudQueue.AddMessage($QueueMessage)
$queueMessage = New-Object -TypeName Microsoft.WindowsAzure.Storage.Queue.CloudQueueMessage `
  -ArgumentList "This is message 3"
$queue.CloudQueue.AddMessage($QueueMessage)
```

If you use the [Azure Storage Explorer](http://storageexplorer.com), you can connect to your Azure account and view the queues in the storage account, and drill down into a queue to view the messages on the queue. 

## Read a message from the queue, then delete it

Messages are read in best-try first-in-first-out order. This is not guaranteed. When you read the message from the queue, it becomes invisible to all other processes looking at the queue. This ensures that if your code fails to process the message due to hardware or software failure, another instance of your code can get the same message and try again.  

This **invisibility timeout** defines how long the message remains invisible before it is available again for processing. The default is 30 seconds. 

Your code reads a message from the queue in two steps. When you call the [Microsoft.WindowsAzure.Storage.Queue.CloudQueue.GetMessage](http://msdn.microsoft.com/library/azure/microsoft.windowsazure.storage.queue.cloudqueue.getmessage.aspx) method, you get the next message in the queue. A message returned from **GetMessage** becomes invisible to any other code reading messages from this queue. To finish removing the message from the queue, you call the [Microsoft.WindowsAzure.Storage.Queue.CloudQueue.DeleteMessage](http://msdn.microsoft.com/library/azure/microsoft.windowsazure.storage.queue.cloudqueue.deletemessage.aspx) method. 

In the following example, you read through the three queue messages, then wait 10 seconds (the invisibility timeout). Then you read the three messages again, deleting the messages after reading them by calling **DeleteMessage**. If you try to read the queue after the messages are deleted, $queueMessage will be returned as NULL.

```powershell
# Set the amount of time you want to entry to be invisible after read from the queue
# If it is not deleted by the end of this time, it will show up in the queue again
$invisibleTimeout = [System.TimeSpan]::FromSeconds(10)

# Read the message from the queue, then show the contents of the message. Read the other two messages, too.
$queueMessage = $queue.CloudQueue.GetMessage($invisibleTimeout)
$queueMessage 
$queueMessage = $queue.CloudQueue.GetMessage($invisibleTimeout)
$queueMessage 
$queueMessage = $queue.CloudQueue.GetMessage($invisibleTimeout)
$queueMessage 

# After 10 seconds, these messages reappear on the queue. 
# Read them again, but delete each one after reading it.
# Delete the message.
$queueMessage = $queue.CloudQueue.GetMessage($invisibleTimeout)
$queue.CloudQueue.DeleteMessage($queueMessage)
$queueMessage = $queue.CloudQueue.GetMessage($invisibleTimeout)
$queue.CloudQueue.DeleteMessage($queueMessage)
$queueMessage = $queue.CloudQueue.GetMessage($invisibleTimeout)
$queue.CloudQueue.DeleteMessage($queueMessage)
```

## Delete a queue
To delete a queue and all the messages contained in it, call the Remove-AzureStorageQueue cmdlet. The following example shows how to delete the specific queue used in this exercise using the Remove-AzureStorageQueue cmdlet.

```powershell
# Delete the queue 
Remove-AzureStorageQueue –Name $queueName –Context $ctx
```

## Clean up resources

To remove all of the assets you have created in this exercise, remove the resource group. This also deletes all resources contained within the group. In this case, it removes the storage account created and the resource group itself.

```powershell
Remove-AzureRmResourceGroup -Name $resourceGroup
```

## Next steps

In this how-to article, you learned about basic Queue storage management with PowerShell, including how to:

> [!div class="checklist"]
> * Create a queue
> * Retrieve a queue
> * Add a message
> * Read the next message
> * Delete a message 
> * Delete a queue

### Microsoft Azure PowerShell Storage cmdlets
* [Storage PowerShell cmdlets](/powershell/module/azurerm.storage#storage)

### Microsoft Azure Storage Explorer
* [Microsoft Azure Storage Explorer](../../vs-azure-tools-storage-manage-with-storage-explorer.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) is a free, standalone app from Microsoft that enables you to work visually with Azure Storage data on Windows, macOS, and Linux.
