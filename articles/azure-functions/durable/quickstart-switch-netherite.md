---
title: Walkthrough for switching to the Netherite Storage Provider
description: Configure a Durable Functions Project to use the Netherite Storage Provider
author: sebastianburckhardt
ms.topic: quickstart
ms.date: 11/04/2022
ms.reviewer: azfuncdf
---

# Walkthrough: Switch to Netherite

Durable Functions allows you to choose from several [storage providers](durable-functions-storage-providers.md) (sometimes called "backends") with different characteristics. By default, new projects are configured to use the Azure Table Storage provider. In this article, we walk through how to configure an existing Durable Functions project to utilize the [Netherite storage provider](durable-functions-storage-providers.md#netherite).

Netherite was designed and developed by [Microsoft Research](https://www.microsoft.com/research). It uses [Azure Event Hubs](../../event-hubs/event-hubs-about.md) to distribute task hub partitions over the workers, and [optimizes the storage accesses of each partition using commit logs and checkpointing](https://www.vldb.org/pvldb/vol15/p1591-burckhardt.pdf). Relative to other provides, this architecture enables [significantly higher throughput](https://microsoft.github.io/durabletask-netherite/#/scenarios) when processing orchestrations and entities. In some [benchmarks](https://microsoft.github.io/durabletask-netherite/#/throughput?id=multi-node-throughput), throughput increased by more than an order of magnitude when compared to the default Azure Storage provider.

## Compatibility

Netherite provides the same programming model, so it is not necessary to change the code that defines the orchestration, entity, and activity functions. However, the [data representation in storage](durable-functions-task-hubs.md#representation-in-storage) is different. We do not currently support migration of any [task hub contents](durable-functions-task-hubs.md). Your application will need to start with a fresh, empty task hub after changing the provider to Netherite. Similarly, the task hub contents created while running Netherite cannot be preserved when switching to a different provider, such as the Azure Storage provider, or the MSSQL storage provider.

## Prerequisites

We are assume you are starting with an existing Durable Functions app, and are familiar with how to compile, deploy, and operate it.
In particular, we expect that you have already

1. Created a Functions project on your local machine.
1. Added Durable Functions to your project.
1. Configured the project for local debugging.
1. Deployed the local project to a Function app that runs in the cloud.

If this is not the case, we suggest you start with one of the following articles, which provides detailed instructions on how to achieve all the requirements above:

- [Create your first durable function - C#](durable-functions-create-first-csharp.md)
- [Create your first durable function - JavaScript](quickstart-js-vscode.md)
- [Create your first durable function - Python](quickstart-python-vscode.md)
- [Create your first durable function - PowerShell](quickstart-powershell-vscode.md)
- [Create your first durable function - Java](quickstart-java.md)

## Part 1: Add Netherite to the project

### Only for C# users - Install the NuGet package

We need to install the Netherite NuGet package and update the host.json configuration file as described below.

>![NOTE] If you are are not a C# user, you can ignore this section as [Extension Bundles](/articles/azure/azure-functions/functions-bindings-register#extension-bundles) removes the need for manual Nuget package installations. If you use Extension Bundles, please skip to the next section on updating your host.json.

Using the NuGet package manager, install the latest version of the [Microsoft.Azure.DurableTask.Netherite.AzureFunctions](https://www.nuget.org/packages/Microsoft.Azure.DurableTask.Netherite.AzureFunctions) package into your functions project. There is another package with a similar but shorter name, make sure to import the correct one.

For more information about how to install NuGet packages in Visual Studio, see the [documentation](/articles/nuget/consume-packages/install-use-packages-visual-studio).

### Update host.json

Edit the storage provider section of the `host.json` file so it sets the `type` to `Netherite`.

```json
{
  ...
  "extensions": {
    "durableTask": {
      "storageProvider": {
        "type" : "Netherite"
      }
    }
  }
}    
```

The above snippet is a *minimal* configuration. Later, you may want to configure additional [optional parameters](https://microsoft.github.io/durabletask-netherite/#/settings?id=typical-configuration) for performance tuning.

### Update local.settings.json for local testing

To configure Netherite to run locally without requiring an Azure Event Hubs resource (useful during development and testing) add the following setting to your `local.settings.json`:

```json
    "EventHubsConnection": "SingleHost",
```

For example, if using C#, your local.settings.json file may look something like [this](https://github.com/microsoft/durabletask-netherite/blob/main/samples/Hello_Netherite_with_DotNetCore/local.settings.json).

### Test Netherite locally

Netherite is now ready for local operation: You can start the function app locally to test it.
While Netherite is running, it publishes load information about each of its partitions that is currently active to a Azure Storage table.
You can inspect this table in the [Azure Storage Explorer](/articles/vs-azure-tools-storage-manage-with-storage-explorer?tabs=windows) to
verify that Netherite has started correctly and is executing normally. You should see something like this:

![Partition Table](./media/quickstart-netherite/partitiontable.png)

Each row corresponds to one Netherite partition, and there are 12 partitions by default. The Timestamp shows the last time the row was updated, which happens continuously while a partition is active (or was recently active). For more information on the contents of this table, see the [Partition Table](https://microsoft.github.io/durabletask-netherite/#/ptable) article.

## Part 2: Event Hubs configuration

To run Netherite in a cloud deployment, or if you prefer to not use an emulation during local testing, you need to configure Netherite so it can use (Azure Event Hubs)[https://azure.microsoft.com/products/event-hubs/]. Netherite automatically creates the required resources inside the Event Hubs namespace, but it does not create the namespace itself, So you have to create a namespace first.

> ![NOTE] An Event Hubs namespace incurs an ongoing cost, whether or not it is being used by Netherite.

### Create an Event Hubs namespace

To create an Azure Event Hubs namespace in the Azure Management Portal, you can follow [these steps](/articles/event-hubs/event-hubs-create#create-an-event-hubs-namespace). When creating the namespace, you may be prompted to

1. choose a *resource group*. A typical choice is to use the same resource group as the Function app and storage account, because it makes it easy to delete all resources at once later on.
2. choose a *plan* and provision *throughput units*. These choices determine the cost incurred. For the purpose of this quick start, using the defaults is fine. The allocated throughput units can be changed at any time; so you can raise this setting later.
3. choose the *retention* time. This setting is irrelevant to Netherite because all the contents are also stored in storage, so the default setting of one day is appropriate.

Alternatively, you can use the Azure CLI to quickly create a namespace with all the default settings as follows:

```cmd
az eventhubs namespace create --name $namespaceName --resource-group $groupName 
```

### Obtain the connection string

To obtain the connection string for the Event Hubs namespace, you can access it in the Azure portal:

![Select "Shared access policies"](./media/quickstart-netherite/namespace-connection-string-1.png)
![Select RootManageSharedAccessKey and Connection string-primary key](./media/quickstart-netherite/namespace-connection-string-2.png)

Alternatively, you can use the Azure CLI to find the connection string as follows:

```cmd
az eventhubs namespace authorization-rule keys list --name RootManageSharedAccessKey --namespace-name $namespaceName --resource-group $groupName 
```

## Part 3: Configure the Function App

Finally, once you have created the Function app in Azure, there are a few more steps required to configure it correctly for running Netherite. For this quick start, you probably only need to do the first one, but we list them all here for future reference.

### Set the EventHubsConnection

You can set the EventHubsConnection parameter to the connection string in the Azure portal, under Configuration:

![Add application configuration setting](./media/quickstart-netherite/add-configuration.png)
![Enter application configuration setting](./media/quickstart-netherite/enter-configuration.png)

Or, you can use the Azure CLI to set the connection string as follows:

```cmd
az functionapp config appsettings set -n $functionAppName -g  $groupName --settings EventHubsConnection=$eventHubsConnectionString
```

### (Premium Plans) Enable runtime scaling

If you are running on the Elastic Premium Plan, we recommend that you enable runtime scale monitoring for a better scaling response. In that case, you can turn on
runtime scaling in the Portal here:

![Enable runtime scale monitoring](./media/quickstart-netherite/runtime-scale-monitoring.png)

### (Older runtimes) Configure for 64 bit

If you are running a Function app with a runtime version prior to 4.x, ensure that it is set to run on 64 bit.
You can update this setting in the portal as shown below, but only if you are running on an older runtime. Otherwise, no action is required.

![Configure runtime to use 64 bit](./media/quickstart-netherite/64bit.png)

## Part 4: Deploy and enjoy

You can now deploy your code to the cloud, and then run your tests or workload on it. To validate that Netherite is correctly configured, you can do the a review the metrics for Event Hubs in the portal to ensure that there's activity.

And that's it for this walkthrough!

For more information about the Netherite architecture, configuration, and workload behavior, including performance benchmarks, we recommend you take a look at the [Netherite documentation](https://microsoft.github.io/durabletask-netherite/#/).