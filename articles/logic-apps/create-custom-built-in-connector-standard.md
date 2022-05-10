---
title: Create built-in connectors for Standard logic apps
description: Create your own custom built-in connectors for Standard workflows in single-tenant Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, daviburg, apseth, psrivas, azla
ms.topic: how-to
ms.date: 05/08/2022
# As a developer, I want learn how to create my own custom built-in connector operations to use and run in my Standard logic app workflows.
---

# Create custom built-in connectors for Standard logic apps in single-tenant Azure Logic Apps

If the connectors that you need aren't available for use in Standard logic app workflows, you can create your own custom built-in connectors with the same Azure Functions extensibility framework that's used by the built-in connectors available for Standard workflows in [single-tenant Azure Logic Apps](single-tenant-overview-compare.md).

This article shows how to create an example custom built-in connector using the Azure Functions extensibility framework and the sample built-in Azure Cosmos DB connector.

For more information about custom connectors, review [Custom connectors in Azure Logic Apps](custom-connector-overview.md) and [Azure Functions extensibility model](../azure-functions/functions-bindings-register.md).

## Prerequisites

* An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* Basic knowledge about single-tenant Azure Logic Apps, Standard logic app workflows, connectors, and how to use Visual Studio Code for creating single tenant-based workflows. If you're new to Azure Logic Apps, review the following documentation:

  * [What is Azure Logic Apps?](logic-apps-overview.md)

  * [Single-tenant versus multi-tenant and integration service environment for Azure Logic Apps](single-tenant-overview-compare.md)

  * [Create an integration workflow with single-tenant Azure Logic Apps (Standard) - Azure portal](create-single-tenant-workflows-azure-portal.md)

  * [Custom connectors for Standard logic apps](custom-connector-overview.md#custom-connector-standard)

* [Visual Studio Code with the Azure Logic Apps (Standard) extension and other prerequisites installed](create-single-tenant-workflows-azure-portal.md#prerequisites). Your installation should already include the [NuGet package for Microsoft.Azure.Workflows.WebJobs.Extension](https://www.nuget.org/packages/Microsoft.Azure.Workflows.WebJobs.Extension/).

* An Azure Cosmos account, database, and container or collection. For more information, review [Quickstart: Create an Azure Cosmos account, database, container and items from the Azure portal](../cosmos-db/sql/create-cosmosdb-resources-portal.md).

<a name="example-custom-built-in-connector"></a>

## Example custom built-in connector

This example creates a sample custom built-in Cosmos DB connector that has only one trigger and no actions. The trigger fires when a new document is added to the lease collection or container in Cosmos DB and then runs a workflow that uses the input payload as the Cosmos document.

| Operation | Operation details | Description |
|-----------|-------------------|-------------|
| Trigger | When a document is received | This trigger operation runs when an insert operation happens in the specified Cosmos DB database and collection. |
| Action | None | This connector doesn't define any action operations. |
||||

The sample connector uses the functionality from the [Azure Functions capability for the Cosmos DB trigger](../azure-functions/functions-bindings-cosmosdb-v2-trigger.md), based on the Azure Functions trigger binding. For the complete sample, review [Sample custom built-in Cosmos DB connector - Azure Logic Apps Connector Extensions](https://github.com/Azure/logicapps-connector-extensions/tree/CosmosDB/src/CosmosDB).

## Create your class library project

To create the sample built-in Cosmos DB connector, complete the following tasks:

1. In Visual Studio Code, create a .NET Core 3.1 class library project.

1. In your project, add the NuGet package named **Microsoft.Azure.Workflows.WebJobs.Extension** as a NuGet reference.

1. To provide the operations for the sample built-in connector, implement the service provider interface named **IServiceOperationsTriggerProvider**.

<a name="register-connector"></a>

## Register your connector

To load your custom built-in connector extension during the Azure Functions runtime start process, you have to add the Azure Functions extension registration as a startup job and register your connector as a service provider in service provider list. Based on the type of data that your built-in trigger needs as inputs, optionally add the converter. This example converts the **Document** data type for Cosmos DB Documents to a **JObject** array.

The following sections show how to register your custom built-in connector as an Azure Functions extension.

### 1. Create the startup job

1. Create a startup class by using the assembly attribute **[assembly:WebJobsStartup]**.

1. Implement the **IWebJobsStartup** interface.

1. In the **Configure()** method, register the extension and inject the service provider. For example, the following code snippet shows the startup class implementation for the sample custom built-in Cosmos DB connector:

   ```csharp
   using Microsoft.Azure.WebJobs;
   using Microsoft.Azure.WebJobs.Hosting;
   using Microsoft.Extensions.DependencyInjection.Extensions;

   [assembly: Microsoft.Azure.WebJobs.Hosting.WebJobsStartup(typeof(ServiceProviders.CosmosDb.Extensions.CosmosDbTriggerStartup))]

   namespace ServiceProviders.CosmosDb.Extensions
   {

      public class CosmosDbServiceProviderStartup : IWebJobsStartup
      {

         // Initialize the workflow service.
         public void Configure(IWebJobsBuilder builder)
         {

               // Register the extension.
               builder.AddExtension<CosmosDbServiceProvider>)();

               // Use dependency injection (DI) for the trigger service operation provider.
               builder.Services.TryAddSingleton<CosmosDbTriggerServiceOperationProvider>();

         }
      }
   }
   ```

   For more information, review [Register services - Use dependency injection in .NET Azure Functions](../azure-functions/functions-dotnet-dependency-injection.md#register-services).

### 2. Register the service provider

Now, register the service provider implementation as an Azure Functions extension. This example uses the built-in [Azure Cosmos DB trigger for Azure Functions](../azure-functions/functions-bindings-cosmosdb-v2-trigger.md?tabs=in-process%2Cfunctionsv2&pivots=programming-language-csharp) as a new trigger and registers the new Cosmos DB service provider for an existing list of service providers, which is already part of the Azure Logic Apps extension.

```csharp
using Microsoft.Azure.Documents;
using Microsoft.Azure.WebJobs.Description;
using Microsoft.Azure.WebJobs.Host.Config;
using Microsoft.Azure.Workflows.ServiceProviders.Abstractions;
using Microsoft.WindowsAzure.ResourceStack.Common.Extensions;
using Microsoft.WindowsAzure.ResourceStack.Common.Json;
using Microsoft.WindowsAzure.ResourceStack.Common.Storage.Cosmos;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;

namespace ServiceProviders.CosmosDb.Extensions
{

   [Extension("CosmosDbServiceProvider", configurationSection: "CosmosDbServiceProvider")]
   public class CosmosDbServiceProvider : IExtensionConfigProvider
   {

      // Initialize a new instance for the CosmosDbServiceProvider class.
      public CosmosDbServiceProvider(ServiceOperationsProvider serviceOperationsProvider, CosmosDbTriggerServiceOperationProvider operationsProvider)
      {

         serviceOperationsProvider.RegisterService(serviceName: CosmosDBServiceOperationProvider.ServiceName, serviceOperationsProviderId: CosmosDBServiceOperationProvider.ServiceId, serviceOperationsProviderInstance: operationsProvider);
      }

      // Convert the Cosmos Document array to a generic JObject array.
      public static JObject[] ConvertDocumentToJObject(IReadOnlyList<Document> data)
      {

         List<JObject> jobjects = new List<JObject>();

         foreach(var doc in data)
         {
            jobjects.Add((JObject)doc.ToJToken());
         }

         return jobjects.ToArray();

      }

      // In the Initialize method, you can add any custom implementation.
      public void Initialize(ExtensionConfigContext context)
      {

         // Convert the Cosmos Document list to a JObject array.
         context.AddConverter<IReadOnlyList<Document>, JObject[]>(ConvertDocumentToJObject);

      }

   }
}
```

### 3. Add a converter

Azure Logic Apps has a generic way to handle any Azure Functions built-in trigger by using the **JObject** array. However, if you want to convert the read-only list of Azure Cosmos DB documents into a **JObject** array, you can add a converter. When the converter is ready, register the converter as part of **ExtensionConfigContext** as shown earlier in this example:

```csharp
// Convert the Cosmos cocument list to a JObject array.
context.AddConverter<IReadOnlyList<Document>, JObject[]>(ConvertDocumentToJObject);
```

### Code map diagram for implemented classes

When you're done, review the following code map diagram that shows the implementation for all the classes in **Microsoft.Azure.Workflows.ServiceProvider.Extensions.CosmosDB**:

* **CosmosDbServiceProviderStartup**
* **CosmosDbServiceProvider**
* **CosmosDbServiceOperationProvider**

![Conceptual code map diagram that shows complete class implementation.](./media/create-custom-built-in-connector-standard/methods-implementation-code-map-diagram.png)

## Install your connector

To add the NuGet reference from the previous section, in the extension bundle named **Microsoft.Azure.Workflows.ServiceProvider.Extensions.CosmosDB**, update the **extensions.json** file. For more information, go to the Azure logicapps-connector-extensions repo, and review the PowerShell script named [**add-extension.ps1**](https://github.com/Azure/logicapps-connector-extensions/blob/main/src/Common/tools/add-extension.ps1).

1. Update the extension bundle to include the custom built-in connector.

1. In Visual Studio Code, which should have the **Azure Logic Apps (Standard) for Visual Studio Code** extension installed, create a logic app project, and install the extension package using the following command:

   ```powershell
   dotnet add package "Microsoft.Azure.Workflows.ServiceProvider.Extensions.CosmosDB" --version 1.0.0  --source $extensionPath
   ```

   Alternatively, in your logic app project's directory, run the PowerShell script named [**add-extension.ps1**](https://github.com/Azure/logicapps-connector-extensions/blob/main/src/Common/tools/add-extension.ps1):

   ```powershell
   powershell -file add-extension.ps1 {Cosmos-DB-output-bin-NuGet-folder-path} CosmosDB
   ```

   If the extension for your custom built-in connector was successfully installed, you get output that looks similar to the following example:

   ```output
   C:\Users\{your-user-name}\Desktop\demoproj\cdbproj>powershell - file C:\myrepo\github\logicapps-connector-extensions\src\Common\tools\add-extension.ps1 C:\myrepo\github\logicapps-connector-extensions\src\CosmosDB\bin\Debug\CosmosDB

   Nuget extension path is C:\myrepo\github\logicapps-connector-extensions\src\CosmosDB\bin\Debug\
   Extension dll path is C:\myrepo\github\logicapps-connector-extensions\src\CosmosDB\bin\Debug\netcoreapp3.1\Microsoft.Azure.Workflows.ServiceProvider.Extensions.CosmosDB.dll
   Extension bundle module path is C:\Users\{your-user-name}\.azure-functions-core-tools\Functions\ExtensionBundles\Microsoft.Azure.Functions.ExtensionBundle.Workflows1.1.9
   EXTENSION PATH is C:\Users\{your-user-name}\.azure-functions-core-tools\Functions\ExtensionBundles\Microsoft.Azure.Functions.ExtensionBundle.Workflows\1.1.9\bin\extensions.json and dll Path is C:\myrepo\github\logicapps-connector-extensions\src\CosmosDB\bin\Debug\netcoreapp3.1\Microsoft.Azure.Workflows.ServiceProvider.Extensions.CosmosDB.dll
   SUCCESS: The process "func.exe" with PID 26692 has been terminated.
      Determining projects to restore...
      Writing C:\Users\{your-user-name}\AppData\Local\Temp\tmpD343.tmp`<br>
   info : Adding PackageReference for package 'Microsoft.Azure.Workflows.ServiceProvider.Extensions.CosmosDB' into project 'C:\Users\{your-user-name}\Desktop\demoproj\cdbproj.csproj'.
   info : Restoring packages for C:\Users\{your-user-name}\Desktop\demoproj\cdbproj.csproj...
   info : Package 'Microsoft.Azure.Workflows.ServiceProvider.Extensions.CosmosDB' is compatible with all the specified frameworks in project 'C:\Users\{your-user-name}\Desktop\demoproj\cdbproj.csproj'.
   info : PackageReference for package 'Microsoft.Azure.Workflows.ServiceProvider.Extensions.CosmosDB' version '1.0.0' updated in file 'C:\Users\{your-user-name}\Desktop\demoproj\cdbproj.csproj'.
   info : Committing restore...
   info : Generating MSBuild file C:\Users\{your-user-name}\Desktop\demoproj\cdbproj\obj\cdbproj.csproj.nuget.g.props.
   info : Generating MSBuild file C:\Users\{your-user-name}\Desktop\demoproj\cdbproj\obj\cdbproj.csproj.nuget.g.targets.
   info : Writing assets file to disk. Path: C:\Users\{your-user-name}\Desktop\demoproj\cdbproj\obj\project.assets.json.
   log : Restored C:\Users\{your-user-name}\Desktop\demoproj\cdbproj\cdbproj.csproj (in 1.5 sec).
   Extension CosmosDB is successfully added.

   C:\Users\{your-user-name}\Desktop\demoproj\cdbproj\>
   ```

1. If any **func.exe** process is running, make sure to close or exit that process before you continue to the next step.

## Test your connector

1. In Visual Studio Code, open your Standard logic app and blank workflow in the designer.

1. On the designer surface, select **Choose an operation** to open the connector operations picker.

1. Under the operations search box, select **Built-in**. In the search box, enter **cosmos db**.

   The operations picker shows your custom built-in connector and trigger, for example:

   ![Screenshot showing Visual Studio Code and the designer for a Standard logic app workflow with the new custom built-in Cosmos DB connector.](./media/create-custom-built-in-connector-standard/visual-studio-code-built-in-connector-picker.png)

1. From the **Triggers** list, select your custom built-in trigger to start your workflow.

1. On the connection pane, provide the following property values to create a connection, for example:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Connection name** | Yes | <*Cosmos-DB-connection-name*> | The name for the Cosmos DB connection to create |
   | **Connection String** | Yes | <*Cosmos-DB-connection-string*> | The connection string for the Azure Cosmos DB database collection or lease collection where you want to add each new received document. |
   |||||

   ![Screenshot showing the connection pane when using the connector for the first time.](./media/create-custom-built-in-connector-standard/visual-studio-code-built-in-connector-create-connection.png)

1. When you're done, select **Create**.

1. On the trigger properties pane, provide the following property values for your trigger, for example:

   | Property | Required | Value | Description |
   |----------|----------|-------|-------------|
   | **Database name** | Yes | <*Cosmos-DB-database-name*> | The name for the Cosmos DB database to use |
   | **Collection name** | Yes | <*Cosmos-DB-collection-name*> | The name for the Cosmos DB collection where you want to add each new received document. |
   |||||

   ![Screenshot showing the trigger properties pane.](./media/create-custom-built-in-connector-standard/visual-studio-code-built-in-connector-trigger-properties.png)

   For this example, in code view, the workflow definition, which is in the **workflow.json** file, has a `triggers` JSON object that appears similar to the following sample:

   ```json
   {
      "definition": {
         "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
         "actions": {},
         "contentVersion": "1.0.0.0",
         "outputs": {},
         "triggers": {
            "When_a_document_is_received": {
               "inputs":{
                  "parameters": {
                     "collectionName": "States",
                     "databaseName": "SampleCosmosDB"
                  },
                  "serviceProviderConfiguration": {
                     "connectionName": "cosmosDb",
                     "operationId": "whenADocumentIsReceived",
                     "serviceProviderId": "/serviceProviders/CosmosDb"
                  },
                  "splitOn": "@triggerOutputs()?['body']",
                  "type": "ServiceProvider"
               }
            }
         }
      },
      "kind": "Stateful"
   }
   ```

   The connection definition, which is in the **connections.json** file, has a `serviceProviderConnections` JSON object that appears similar to the following sample:

   ```json
   {
      "serviceProviderConnections": {
         "cosmosDb": {
            "parameterValues": {
               "connectionString": "@appsetting('cosmosDb_connectionString')"
            },
            "serviceProvider": {
               "id": "/serviceProviders/CosmosDb"
            },
            "displayName": "myCosmosDbConnection"
         }
      },
      "managedApiConnections": {}
   }
   ```

1. In Visual Studio Code, on the **Run** menu, select **Start Debugging**. (Press F5)

1. To trigger your workflow, in the Azure portal, open your Azure Cosmos DB account. On the account menu, select **Data Explorer**. Browse to the database and collection that you specified in the trigger. Add an item to the collection.

   ![Screenshot showing the Azure portal, Cosmos DB account, and Data Explorer open to the specified database and collection.](./media/create-custom-built-in-connector-standard/cosmos-db-account-test-add-item.png)

## Next steps

* [Source for sample custom built-in Cosmos DB connector - Azure Logic Apps Connector Extensions](https://github.com/Azure/logicapps-connector-extensions/tree/CosmosDB/src/CosmosDB)

* [Built-in Service Bus trigger: batching and session handling](https://techcommunity.microsoft.com/t5/integrations-on-azure-blog/azure-logic-apps-running-anywhere-built-in-service-bus-trigger/ba-p/2079995)
