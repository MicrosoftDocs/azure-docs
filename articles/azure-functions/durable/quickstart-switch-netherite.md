---
title: Configure Storage Provider - Netherite
description: Configure a Durable Functions app to use Netherite
author: sebastianburckhardt, dajusto
ms.topic: quickstart
ms.date: 11/14/2022
ms.reviewer: azfuncdf
---

# Switch to the Netherite Backend

Durable Functions offers several [storage providers](durable-functions-storage-providers.md), also called "backends" for short, each with their own [design characteristics](https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-storage-providers#comparing-storage-providers). By default, new projects are configured to use the Azure Storage provider. In this article, we walk through how to configure an existing Durable Functions app to utilize the [Netherite storage provider](durable-functions-storage-providers.md#netherite).

Netherite was designed and developed by [Microsoft Research](https://www.microsoft.com/research). Relative to other backends, Netherite may enable [significantly higher throughput](https://microsoft.github.io/durabletask-netherite/#/scenarios): in some [benchmarks](https://microsoft.github.io/durabletask-netherite/#/throughput?id=multi-node-throughput), throughput increased by more than an order of magnitude when compared to the default Azure Storage provider.

## Note on data migration

We do not currently support the migration of [Task Hub data](durable-functions-task-hubs.md) across storage providers. This means that your application will need to start with a fresh, empty Task Hub after changing the provider to Netherite. Similarly, the task hub contents created while running Netherite cannot be preserved when switching to a different backend, such as Azure Storage, or the MSSQL backend.

> [!NOTE] Changing your storage provider is a kind of breaking change as pre-existing data will not be transferred over. You can review the Durable Functions [versioning docs](durable-functions-versioning.md) for guidance on how to make these changes.

## Prerequisites

We assume that you are starting with an existing Durable Functions app, and are familiar with how to operate it. 

In particular, we expect that you have already:
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

## Add Netherite to the project

### Install the NuGet package (only for C#)

>![NOTE] If you are are not a C# user, you can ignore this section as [Extension Bundles](/articles/azure/azure-functions/functions-bindings-register#extension-bundles) removes the need for manual Nuget package installations. If you use Extension Bundles, please skip to the next section on updating your host.json.

Using the NuGet package manager, install the latest version of the [Microsoft.Azure.DurableTask.Netherite.AzureFunctions](https://www.nuget.org/packages/Microsoft.Azure.DurableTask.Netherite.AzureFunctions) package into your functions project. There is another package with a similar but shorter name, make sure to import the correct one.

For more information about how to install NuGet packages in Visual Studio, see the [documentation](/articles/nuget/consume-packages/install-use-packages-visual-studio).

### Update host.json

Edit the storage provider section of your `durableTask` config in `host.json` to specify `type` as `Netherite`.

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

The snippet above is just a *minimal* configuration. You can find further configuration options in the Netherite [external docs](https://microsoft.github.io/durabletask-netherite/#/settings?id=typical-configuration).

### Configure local.settings.json for local development

During local development, you may choose to run Netherite without Event Hubs, which minimizes costs. To do this, please set the the value of `EventHubsConnection` in `local.settings.json` to `MemoryF` as shown below:

```json
    "EventHubsConnection": "MemoryF",
```

For example, if using C#, your local.settings.json file may look something like [this](https://github.com/microsoft/durabletask-netherite/blob/main/samples/Hello_Netherite_with_DotNetCore/local.settings.json).

### Test Netherite locally

Netherite is now ready for local development: You can start the Function app to test it.

While Netherite is running, it publishes load information about its active partitions to an Azure Storage table named "DurableTaskPartitions". You can inspect this table using the [Azure Storage Explorer](/articles/vs-azure-tools-storage-manage-with-storage-explorer?tabs=windows) to verify that Netherite is working correctly. For a quick sanity check, it suffices just to see any data on this table; for example you may see something like this:

![Data on the "DurableTaskPartitions" table in the Azure Storage Explorer.](./media/quickstart-netherite/partitiontable.png)

Each row corresponds to one Netherite partition, and there are 12 partitions by default. The `Timestamp` column shows the last time the row was updated, which happens continuously while a partition is active (or was recently active). For more information on the contents of this table, see the [Partition Table](https://microsoft.github.io/durabletask-netherite/#/ptable) article.

## Part 2: Set up Event Hubs

To run Netherite in Azure, or if you prefer to use Event Hubs during local development, you need to will need to set up an Event Hubs namespace in Azure.

> [!NOTE] An Event Hubs namespace incurs an ongoing cost, whether or not it is being used by Netherite.

### Create an Event Hubs namespace

To create an Event Hubs namespace in the Azure Portal, you can follow [these steps](/articles/event-hubs/event-hubs-create#create-an-event-hubs-namespace). When creating the namespace, you may be prompted to:

1. Choose a *resource group*. A typical choice is to use the same resource group as the Function app to facilitate group manamgement operations, like deletion.
2. Choose a *plan* and provision *throughput units*. These choices determine the cost incurred. For the purpose of this guide, using the defaults is fine as this setting can be change later.
3. Choose the *retention* time. This setting is irrelevant to Netherite (contents are also stored in storage), so the default setting of one day is appropriate.

Alternatively, you can use the Azure CLI to quickly create a namespace with all the default settings as follows:

```cmd
az eventhubs namespace create --name $namespaceName --resource-group $groupName 
```

### Obtain the connection string

To obtain the connection string for your Event Hubs namespace, go to  the Azure portal under the setting "Shared access policites", and then select "RootManagedSharedAccessKey" which should reveal a field named "Connection string-primary key". That field's value is the connection string.

Below we show a few guiding screenshots on how to find this data in the portal:

![Select "Shared access policies"](./media/quickstart-netherite/namespace-connection-string-1.png)
![Select RootManageSharedAccessKey and Connection string-primary key](./media/quickstart-netherite/namespace-connection-string-2.png)

Alternatively, you can use the Azure CLI to obtain the connection string as follows:

```cmd
az eventhubs namespace authorization-rule keys list --name RootManageSharedAccessKey --namespace-name $namespaceName --resource-group $groupName 
```

## Part 3: Configure the app in Azure

Finally, assuming you have target app in Azure for deployment, there are a few more steps required to configure it correctly for running Netherite. For this quickstart, you probably only need to do the first one, but we list them all here for reference.

### Configure the EventHubsConnection setting

In Azure, you need to assign the `EventHubsConnection` setting to your Event Hubs connection string.

To do this through the Azure portal, first go to your Function App view. Then, go under "Configuration", select "New application setting" and there you can configure the name "EventHubsConnection" to map to your connection string as its value. Below are some guiding images.

![In the Function App view, go under "configuration" to select "new application setting."](./media/quickstart-netherite/add-configuration.png)
![Enter `EventHubsConnection` as the name, and the connection string as its value.](./media/quickstart-netherite/enter-configuration.png)

Alternatively, you can use the Azure CLI to assign this setting in Azure as follows:

```cmd
az functionapp config appsettings set -n $functionAppName -g  $groupName --settings EventHubsConnection=$eventHubsConnectionString
```

### (Premium Plans) Enable runtime scaling

If you are running on the Elastic Premium Plan, we recommend that you enable runtime scale monitoring for better scaling. To do this, go to "Configuration", select "Function runtime settings" and toggle "Runtime Scale Monitoring" to "On".

![How to enable Runtime Scale Monitoring in the portal.](./media/quickstart-netherite/runtime-scale-monitoring.png)

### (Older runtimes) Configure for 64 bit

On Function runtime versions older than V4, you need to run on a 64 bit architechture for Netherite to work.
You can update this setting in the portal: under "Configuration", select "General Settings" and then ensure the "Platform" field is set to "64 Bit".

> [!NOTE] This is only required for runtime versions older than V4. For V4 onwards, no action is required.

![Configure runtime to use 64 bit in the portal.](./media/quickstart-netherite/64bit.png)

## Deploy and enjoy

You can now deploy your code to the cloud, and then run your tests or workload on it. To validate that Netherite is correctly configured, you can review the metrics for Event Hubs in the portal to ensure that there's activity.

And that's it for this walkthrough!

For more information about the Netherite architecture, configuration, and workload behavior, including performance benchmarks, we recommend you take a look at the [Netherite documentation](https://microsoft.github.io/durabletask-netherite/#/).