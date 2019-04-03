---
title: Tutorial - Create an Azure storage queue, and insert, get, and delete messages | Microsoft Docs
description: A tutorial on how to use the Azure Queue service to create queues, and insert, get, and delete messages.
services: storage
author: mhopkins-msft
ms.author: mhopkins
ms.service: storage
ms.subservice: queues
ms.topic: tutorial
ms.date: 03/23/2019
#Customer intent: As a developer, I want to use queues in my app so that my service will scale automatically during high demand times without losing data.
---

# Tutorial: Create an Azure storage queue, and insert, get, and delete messages

Queues let your application scale automatically and immediately when demand changes. This makes them useful for critical business data that would be damaging to lose. A queue increases resiliency by temporarily storing waiting messages. At times of low or normal demand, the size of the queue remains small because the destination component removes messages from the queue faster than they are added. At times of high demand, the queue may increase in size, but messages are not lost. The destination component can catch up and empty the queue as demand returns to normal. The article demonstrates the basic steps for creating an Azure storage queue.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Create an Azure storage queue
> - Create the app
> - Get your connection string
> - Insert messages into the queue
> - Get messages from the queue
> - Delete messages from the queue

## Prerequisites

- This tutorial assumes you have an Azure subscription. If you don’t have a current Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- This tutorial also assumes you have Visual Studio Code installed. If you don't already have it, get your free copy of [Visual Studio Code](https://code.visualstudio.com/download).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com/).

## Create an Azure storage account

The first step in creating a queue is to create the Azure Storage Account that will store our data. There are several options you can supply when you create the account, most of which you can use the default selection. See the [Create a storage account](../common/storage-quickstart-create-account.md?toc=%2Fazure%2Fstorage%2Fqueues%2Ftoc.json) quickstart for a step-by-step guide to creating a storage account.

## Create the app

We'll create a .NET Core application that you can run on Linux, macOS, or Windows. Let's name it **QueueApp**. For simplicity, we'll use a single app that will both send and receive messages through our queue.

1. Use the `dotnet new` command to create a new console app with the name **QueueApp**. You can type commands into the Cloud Shell on the right, or if you are working locally, in a terminal/console window. This command creates a simple app with a single source file: `Program.cs`.

```azurecli
dotnet new console -n QueueApp
```

1. Switch to the newly created `QueueApp` folder and build the app to verify that all is well.

```azurecli
cd QueueApp
```

```azurecli
dotnet build
```


## Get your connection string

The client library uses a **connection string** to establish your connection. Your connection string is available in the **Settings** section of your Storage Account in the Azure portal. Click the **Copy** button to the right of the **Connection string** field.

![Connection string](media/storage-tutorial-queues/get-connection-string.png)

The connection string will look something like this:

```csharp
const string connectionString = "DefaultEndpointsProtocol=https;AccountName=<your storage account name>;AccountKey=<your key>;EndpointSuffix=core.windows.net"
```

### Add the connection string to the app

Add the connection string into the app so it can access the storage account.



## Insert messages into the queue

Include a sentence or two to explain only what is needed to complete the procedure.

1. Step 1 of the procedure
2. Step 2 of the procedure
3. Step 3 of the procedure

## Get messages from the queue

Include a sentence or two to explain only what is needed to complete the
procedure.
<!---Code requires specific formatting. Here are a few useful examples of
commonly used code blocks. Make sure to use the interactive functionality
where possible.

For the CLI or PowerShell based procedures, don't use bullets or
numbering.
--->

Here is an example of a code block for Java:

```java
cluster = Cluster.build(new File("src/remote.yaml")).create();
...
client = cluster.connect();
```

or a code block for Azure CLI:

```azurecli-interactive
az vm create --resource-group myResourceGroup --name myVM --image win2016datacenter --admin-username azureuser --admin-password myPassword12
```

or a code block for Azure PowerShell:

```azurepowershell-interactive
New-AzureRmContainerGroup -ResourceGroupName myResourceGroup -Name mycontainer -Image microsoft/iis:nanoserver -OsType Windows -IpAddressType Public
```

## Delete messages from the queue

Include a sentence or two to explain only what is needed to complete the procedure.

1. Step 1 of the procedure
1. Step 2 of the procedure
1. Step 3 of the procedure

## Clean up resources

If you're not going to continue to use this application, delete resources with the following steps:

1. From the left-hand menu...
2. ...click Delete, type...and then click Delete

<!---Required:
To avoid any costs associated with following the tutorial procedure, a
Clean up resources (H2) should come just before Next steps (H2)
--->

## Next steps

Advance to the next article to learn how to create...
> [!div class="nextstepaction"]
> [Next steps](storage-quickstart-queues-portal.md)

<!--- Required:
Tutorials should always have a Next steps H2 that points to the next
logical tutorial in a series, or, if there are no other tutorials, to
some other cool thing the customer can do. A single link in the blue box
format should direct the customer to the next article - and you can
shorten the title in the boxes if the original one doesn’t fit.
Do not use a "More info section" or a "Resources section" or a "See also
section". --->