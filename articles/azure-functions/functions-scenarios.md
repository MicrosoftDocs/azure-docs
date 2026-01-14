---
title: Azure Functions Scenarios 
description: Identify key scenarios that use Azure Functions to provide serverless compute resources in aa Azure cloud-based topology. 
ms.topic: conceptual
ms.custom:
  - devx-track-extended-java
  - devx-track-js
  - devx-track-python
  - build-2025
ms.collection: 
  - ce-skilling-ai-copilot
ms.date: 04/29/2025
ms.update-cycle: 180-days
zone_pivot_groups: programming-languages-set-functions
---

# Azure Functions scenarios

Often, you build systems that react to a series of critical events. Whether you're building a web API, responding to database changes, or processing event streams or messages, you can use Azure Functions to implement these systems.

In many cases, a function [integrates with an array of cloud services](functions-triggers-bindings.md) to provide feature-rich implementations. The following list shows common (but by no means exhaustive) scenarios for Azure Functions.

Select your development language at the top of the article.

## Process file uploads

You can use functions in several ways to process files into or out of a blob storage container. To learn more about options for triggering on a blob container, see [Working with blobs](./storage-considerations.md#working-with-blobs) in the best practices documentation.

For example, in a retail solution, a partner system can submit product catalog information as files into blob storage. You can use a blob triggered function to validate, transform, and process the files into the main system as you upload them. 

:::image type="content" source="media/functions-scenarios/process-file-uploads.png" alt-text="Diagram of a file upload process using Azure Functions." lightbox="media/functions-scenarios/process-file-uploads-expanded.png":::

The following tutorials use a Blob trigger (Event Grid based) to process files in a blob container:

::: zone pivot="programming-language-csharp" 

For example, use the blob trigger with an event subscription on blob containers:
    
```csharp
[FunctionName("ProcessCatalogData")]
public static async Task Run([BlobTrigger("catalog-uploads/{name}", Source = BlobTriggerSource.EventGrid, Connection = "<NAMED_STORAGE_CONNECTION>")] Stream myCatalogData, string name, ILogger log)
{
    log.LogInformation($"C# Blob trigger function Processed blob\n Name:{name} \n Size: {myCatalogData.Length} Bytes");

    using (var reader = new StreamReader(myCatalogData))
    {
        var catalogEntry = await reader.ReadLineAsync();
        while(catalogEntry !=null)
        {
            // Process the catalog entry
            // ...

            catalogEntry = await reader.ReadLineAsync();
        }
    }
}
```

+ [Quickstart: Respond to blob storage events by using Azure Functions](scenario-blob-storage-events.md)
+ [Sample: Blob trigger with the Event Grid source type quickstart sample)](https://github.com/Azure-Samples/functions-quickstart-dotnet-azd-eventgrid-blob)
+ [Tutorial (events): Trigger Azure Functions on blob containers using an event subscription](functions-event-grid-blob-trigger.md)
+ [Tutorial (polling): Upload and analyze a file with Azure Functions and Blob Storage](../storage/blobs/blob-upload-function-trigger.md)
::: zone-end

::: zone pivot="programming-language-python" 
+ [Quickstart: Respond to blob storage events by using Azure Functions](scenario-blob-storage-events.md)
+ [Sample: Blob trigger with the Event Grid source type quickstart sample)](https://github.com/Azure-Samples/functions-quickstart-python-azd-eventgrid-blob)
+ [Tutorial: Trigger Azure Functions on blob containers using an event subscription](functions-event-grid-blob-trigger.md?pivots=programming-language-python)
::: zone-end

::: zone pivot="programming-language-javascript" 
+ [Quickstart: Respond to blob storage events by using Azure Functions](scenario-blob-storage-events.md)
+ [Sample: Blob trigger with the Event Grid source type quickstart sample)](https://github.com/Azure-Samples/functions-quickstart-javascript-azd-eventgrid-blob)
+ [Tutorial (events): Trigger Azure Functions on blob containers using an event subscription](functions-event-grid-blob-trigger.md?pivots=programming-language-javascript)
+ [Tutorial (polling): Upload and analyze a file with Azure Functions and Blob Storage](../storage/blobs/blob-upload-function-trigger-javascript.md)
::: zone-end

::: zone pivot="programming-language-powershell" 
+ [Quickstart: Respond to blob storage events by using Azure Functions](scenario-blob-storage-events.md)
+ [Sample: Blob trigger with the Event Grid source type quickstart sample)](https://github.com/Azure-Samples/functions-quickstart-powershell-azd-eventgrid-blob)
+ [Tutorial: Trigger Azure Functions on blob containers using an event subscription](functions-event-grid-blob-trigger.md?pivots=programming-language-powershell)
::: zone-end

::: zone pivot="programming-language-typescript"
+ [Quickstart: Respond to blob storage events by using Azure Functions](scenario-blob-storage-events.md)
+ [Sample: lob trigger with the Event Grid source type quickstart sample)](https://github.com/Azure-Samples/functions-quickstart-typescript-azd-eventgrid-blob)
+ [Tutorial: Trigger Azure Functions on blob containers using an event subscription](functions-event-grid-blob-trigger.md?pivots=programming-language-typescript)
::: zone-end

::: zone pivot="programming-language-java" 
+ [Quickstart: Respond to blob storage events by using Azure Functions](scenario-blob-storage-events.md)
+ [Sample: Blob trigger with the Event Grid source type quickstart sample)](https://github.com/Azure-Samples/functions-quickstart-java-azd-eventgrid-blob)
+ [Tutorial: Trigger Azure Functions on blob containers using an event subscription](functions-event-grid-blob-trigger.md?pivots=programming-language-java)
::: zone-end

## Real-time stream and event processing

Cloud applications, IoT devices, and networking devices generate and collect a large amount of telemetry. Azure Functions can process that data in near real-time as the hot path, then store it in [Azure Cosmos DB](/azure/cosmos-db/introduction) for use in an analytics dashboard.

Your functions can also use low-latency event triggers, like Event Grid, and real-time outputs like SignalR to process data in near-real-time.  

:::image type="content" source="media/functions-scenarios/real-time-stream-processing.png" alt-text="Diagram of a real-time stream process using Azure Functions." lightbox="media/functions-scenarios/real-time-stream-processing-expanded.png":::

::: zone pivot="programming-language-csharp" 

For example, you can use the event hubs trigger to read from an event hub and the output binding to write to an event hub after debatching and transforming the events:
    
```csharp
[FunctionName("ProcessorFunction")]
public static async Task Run(
    [EventHubTrigger(
        "%Input_EH_Name%",
        Connection = "InputEventHubConnectionSetting",
        ConsumerGroup = "%Input_EH_ConsumerGroup%")] EventData[] inputMessages,
    [EventHub(
        "%Output_EH_Name%",
        Connection = "OutputEventHubConnectionSetting")] IAsyncCollector<SensorDataRecord> outputMessages,
    PartitionContext partitionContext,
    ILogger log)
{
    var debatcher = new Debatcher(log);
    var debatchedMessages = await debatcher.Debatch(inputMessages, partitionContext.PartitionId);

    var xformer = new Transformer(log);
    await xformer.Transform(debatchedMessages, partitionContext.PartitionId, outputMessages);
}
```
+ [Streaming at scale with Azure Event Hubs, Functions and Azure SQL](https://github.com/Azure-Samples/streaming-at-scale/tree/main/eventhubs-functions-azuresql)
+ [Streaming at scale with Azure Event Hubs, Functions and Cosmos DB](https://github.com/Azure-Samples/streaming-at-scale/tree/main/eventhubs-functions-cosmosdb)
+ [Streaming at scale with Azure Event Hubs with Kafka producer, Functions with Kafka trigger and Cosmos DB](https://github.com/Azure-Samples/streaming-at-scale/tree/main/eventhubskafka-functions-cosmosdb)
+ [Streaming at scale with Azure IoT Hub, Functions and Azure SQL](https://github.com/Azure-Samples/streaming-at-scale/tree/main/iothub-functions-azuresql)
+ [Azure Event Hubs trigger for Azure Functions](functions-bindings-event-hubs-trigger.md?pivots=programming-language-csharp)
+ [Apache Kafka trigger for Azure Functions](functions-bindings-kafka-trigger.md?pivots=programming-language-csharp)
::: zone-end

::: zone pivot="programming-language-python" 
+ [Azure Event Hubs trigger for Azure Functions](functions-bindings-event-hubs-trigger.md?pivots=programming-language-python)
+ [Apache Kafka trigger for Azure Functions](functions-bindings-kafka-trigger.md?pivots=programming-language-python)
::: zone-end

::: zone pivot="programming-language-javascript" 
+ [Azure Event Hubs trigger for Azure Functions](functions-bindings-event-hubs-trigger.md?pivots=programming-language-javascript)
+ [Apache Kafka trigger for Azure Functions](functions-bindings-kafka-trigger.md?pivots=programming-language-javascript)
::: zone-end

::: zone pivot="programming-language-powershell" 
+ [Azure Event Hubs trigger for Azure Functions](functions-bindings-event-hubs-trigger.md?pivots=programming-language-powershell)
+ [Apache Kafka trigger for Azure Functions](functions-bindings-kafka-trigger.md?pivots=programming-language-powershell)
::: zone-end

::: zone pivot="programming-language-java"
+ [Azure Functions Kafka trigger Java Sample](https://github.com/azure/azure-functions-kafka-extension/tree/main/samples/WalletProcessing_KafkademoSample)
+ [Azure Event Hubs trigger for Azure Functions](functions-bindings-event-hubs-trigger.md?pivots=programming-language-java)
+ [Apache Kafka trigger for Azure Functions](functions-bindings-kafka-trigger.md?pivots=programming-language-java)
::: zone-end

## Machine learning and AI

Azure Functions provides serverless compute resources that integrate with AI and Azure services to streamline building cloud-hosted intelligent applications. You can use the Functions programming model to create and host remote Model Content Protocol (MCP) servers and implement various AI tools. For more information, see [Tools and MCP servers](functions-create-ai-enabled-apps.md#tools-and-mcp-servers).

The [Azure OpenAI binding extension](./functions-bindings-openai.md) lets you integrate AI features and behaviors of the [Azure OpenAI service](/azure/ai-services/openai/overview), such as retrieval-augmented generation (RAG), into your function code executions. For more information, see [Retrieval-augmented generation](functions-create-ai-enabled-apps.md#retrieval-augmented-generation).

A function might also call a TensorFlow model or Azure AI services to process and classify a stream of images.

:::image type="content" source="media/functions-scenarios/machine-learning-and-ai.png" alt-text="Diagram of a machine learning and AI process using Azure Functions." lightbox="media/functions-scenarios/machine-learning-and-ai-expanded.png":::

::: zone pivot="programming-language-csharp" 
### [Tools and MCP servers](#tab/mcp-tools)   

+ [Quickstart: Build a custom remote MCP server using Azure Functions](scenario-custom-remote-mcp-server.md)
+ [Quickstart: Host servers built with MCP SDKs on Azure Functions](scenario-host-mcp-server-sdks.md)
+ [Sample: Getting Started with Remote MCP Servers using Azure Functions](https://github.com/Azure-Samples/remote-mcp-functions-dotnet)
+ [Sample: Host remote MCP servers built with official MCP SDKs on Azure Functions](https://github.com/Azure-Samples/mcp-sdk-functions-hosting-dotnet)

### [Azure OpenAI service](#tab/open-ai)

+ [Tutorial: Text completion using Azure OpenAI](functions-add-openai-text-completion.md?pivots=programming-language-csharp)
+ [Sample: Upload text files and access data using various OpenAI features](https://github.com/azure-samples/azure-functions-openai-demo) 
+ [Sample: Text summarization using AI Cognitive Language Service](https://github.com/Azure-Samples/function-csharp-ai-textsummarize)
+ [Sample: Text completion using Azure OpenAI](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/textcompletion/csharp-ooproc)
+ [Sample: Provide assistant skills to your model](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/assistant/csharp-ooproc)
+ [Sample: Generate embeddings](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/embeddings/csharp-ooproc/Embeddings)
+ [Sample: Leverage semantic search](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/rag-aisearch/csharp-ooproc)

--- 
::: zone-end  
::: zone pivot="programming-language-java"  
### [Tools and MCP servers](#tab/mcp-tools)   

+ [Quickstart: Build a custom remote MCP server using Azure Functions](scenario-custom-remote-mcp-server.md)
+ [Sample: Getting Started with Remote MCP Servers using Azure Functions](https://github.com/Azure-Samples/remote-mcp-functions-java)

### [Azure OpenAI service](#tab/open-ai)

+ [Tutorial: Text completion using Azure OpenAI](functions-add-openai-text-completion.md?pivots=programming-language-java)
+ [Sample: Text completion using Azure OpenAI](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/textcompletion/java)
+ [Sample: Provide assistant skills to your model](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/assistant/java)
+ [Sample: Generate embeddings](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/embeddings/java)
+ [Sample: Leverage semantic search](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/rag-aisearch/java)

---
::: zone-end
::: zone pivot="programming-language-javascript"  
+ [Tutorial: Text completion using Azure OpenAI](functions-add-openai-text-completion.md?pivots=programming-language-javascript)
+ [Training: Create a custom skill for Azure AI Search](/training/modules/create-enrichment-pipeline-azure-cognitive-search)
+ [Sample: Chat using ChatGPT](https://github.com/Azure-Samples/function-javascript-ai-openai-chatgpt)
+ [Sample: Upload text files and access data using various OpenAI features](https://github.com/azure-samples/azure-functions-openai-demo)
::: zone-end
::: zone pivot="programming-language-typescript"  
### [Tools and MCP servers](#tab/mcp-tools)   

+ [Quickstart: Build a custom remote MCP server using Azure Functions](scenario-custom-remote-mcp-server.md)
+ [Quickstart: Host servers built with MCP SDKs on Azure Functions](scenario-host-mcp-server-sdks.md)
+ [Sample: Getting Started with Remote MCP Servers using Azure Functions](https://github.com/Azure-Samples/remote-mcp-functions-typescript)
+ [Sample: Host remote MCP servers built with official MCP SDKs on Azure Functions](https://github.com/Azure-Samples/mcp-sdk-functions-hosting-node)

### [Azure OpenAI service](#tab/open-ai)

+ [Tutorial: Text completion using Azure OpenAI](functions-add-openai-text-completion.md?pivots=programming-language-typescript)
+ [Training: Create a custom skill for Azure AI Search](/training/modules/create-enrichment-pipeline-azure-cognitive-search)
+ [Sample: Chat using ChatGPT](https://github.com/Azure-Samples/function-javascript-ai-openai-chatgpt)
+ [Sample: Upload text files and access data using various OpenAI features](https://github.com/azure-samples/azure-functions-openai-demo)

---
::: zone-end  
::: zone pivot="programming-language-python"  
### [Tools and MCP servers](#tab/mcp-tools-2)   

+ [Quickstart: Build a custom remote MCP server using Azure Functions](scenario-custom-remote-mcp-server.md)
+ [Quickstart: Host servers built with MCP SDKs on Azure Functions](scenario-host-mcp-server-sdks.md)

### [Azure OpenAI service](#tab/open-ai-2)

+ [Tutorial: Text completion using Azure OpenAI](functions-add-openai-text-completion.md?pivots=programming-language-python)
+ [Sample: Text completion using Azure OpenAI](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/textcompletion/python)
+ [Sample: Provide assistant skills to your model](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/assistant/python)
+ [Sample: Generate embeddings](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/embeddings/python)
+ [Sample: Leverage semantic search](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/rag-aisearch/python)
+ [Sample: Chat using ChatGPT](https://github.com/Azure-Samples/function-python-ai-openai-chatgpt)
+ [Sample: LangChain with Azure OpenAI and ChatGPT](https://github.com/Azure-Samples/function-python-ai-langchain)

### [Data models](#tab/data-models)

+ [Tutorial: Apply machine learning models in Azure Functions with Python and TensorFlow](./functions-machine-learning-tensorflow.md)
+ [Tutorial: Deploy a pretrained image classification model to Azure Functions with PyTorch](./machine-learning-pytorch.md)

---


::: zone-end  
::: zone pivot="programming-language-powershell"  
+ [Tutorial: Text completion using Azure OpenAI](functions-add-openai-text-completion.md?pivots=programming-language-powershell)
+ [Sample: Text completion using Azure OpenAI](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/textcompletion/powershell)
+ [Sample: Provide assistant skills to your model](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/assistant/powershell)
+ [Sample: Generate embeddings](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/embeddings/powershell)
+ [Sample: Leverage semantic search](https://github.com/Azure/azure-functions-openai-extension/tree/main/samples/rag-aisearch/powershell)
::: zone-end

For more information, see [Use AI tools and models in Azure Functions](functions-create-ai-enabled-apps.md). 

## Run scheduled tasks 

Functions enables you to run your code based on a [cron schedule](./functions-bindings-timer.md#usage) that you define. 

See [Create a function in the Azure portal that runs on a schedule](./functions-create-scheduled-function.md).

For example, you might analyze a financial services customer database for duplicate entries every 15 minutes to avoid multiple communications going out to the same customer. 

:::image type="content" source="media/functions-scenarios/scheduled-task.png" alt-text="Diagram of a scheduled task where a function cleans a database every 15 minutes deduplicating entries based on business logic." lightbox="media/functions-scenarios/scheduled-task-expanded.png":::

For examples, see these code snippets:
::: zone pivot="programming-language-csharp" 

```csharp
[FunctionName("TimerTriggerCSharp")]
public static void Run([TimerTrigger("0 */15 * * * *")]TimerInfo myTimer, ILogger log)
{
    if (myTimer.IsPastDue)
    {
        log.LogInformation("Timer is running late!");
    }
    log.LogInformation($"C# Timer trigger function executed at: {DateTime.Now}");

    // Perform the database deduplication
}
```
+ [Quickstart: Azure Functions Timer trigger](scenario-scheduled-tasks.md?pivots=programming-language-csharp)
::: zone-end

::: zone pivot="programming-language-python" 
+ [Quickstart: Azure Functions Timer trigger](scenario-scheduled-tasks.md?pivots=programming-language-python)
::: zone-end
<!-- replace when these langs are fully supported by the quickstart
::: zone pivot="programming-language-javascript" 
+ Quickstart: [Azure Functions Timer trigger](scenario-scheduled-tasks.md?pivots=programming-language-javascript)
::: zone-end

::: zone pivot="programming-language-powershell" 
+ Quickstart: [Azure Functions Timer trigger](scenario-scheduled-tasks.md?pivots=programming-language-powershell)
::: zone-end

::: zone pivot="programming-language-java" 
+ [Timer trigger for Azure Functions](functions-bindings-timer.md?pivots=programming-language-java)
::: zone-end-->

## Build a scalable web API

An HTTP triggered function defines an HTTP endpoint. These endpoints run function code that can connect to other services directly or by using binding extensions. You can compose the endpoints into a web-based API. 

You can also use an HTTP triggered function endpoint as a webhook integration, such as GitHub webhooks. In this way, you can create functions that process data from GitHub events. For more information, see [Monitor GitHub events by using a webhook with Azure Functions](/training/modules/monitor-github-events-with-a-function-triggered-by-a-webhook/).

:::image type="content" source="media/functions-scenarios/scalable-web-api.png" alt-text="Diagram of processing an HTTP request using Azure Functions." lightbox="media/functions-scenarios/scalable-web-api-expanded.png":::

For examples, see these code snippets:
::: zone pivot="programming-language-csharp" 

```csharp
[FunctionName("InsertName")]
public static async Task<IActionResult> Run(
    [HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequest req,
    [CosmosDB(
        databaseName: "my-database",
        collectionName: "my-container",
        ConnectionStringSetting = "CosmosDbConnectionString")]IAsyncCollector<dynamic> documentsOut,
    ILogger log)
{
    string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
    dynamic data = JsonConvert.DeserializeObject(requestBody);
    string name = data?.name;

    if (name == null)
    {
        return new BadRequestObjectResult("Please pass a name in the request body json");
    }

    // Add a JSON document to the output container.
    await documentsOut.AddAsync(new
    {
        // create a random ID
        id = System.Guid.NewGuid().ToString(), 
        name = name
    });

    return new OkResult();
}
```
+ [Quickstart: Azure Functions HTTP trigger](create-first-function-azure-developer-cli.md?pivots=programming-language-csharp)
+ [Article: Create serverless APIs in Visual Studio using Azure Functions and API Management integration](./openapi-apim-integrate-visual-studio.md) 
+ [Training: Expose multiple function apps as a consistent API by using Azure API Management](/training/modules/build-serverless-api-with-functions-api-management/)
+ [Sample: Web application with a C# API and Azure SQL DB on Static Web Apps and Functions](/samples/azure-samples/todo-csharp-sql-swa-func/todo-csharp-sql-swa-func/)
::: zone-end

::: zone pivot="programming-language-python" 
+ [Quickstart: Azure Functions HTTP trigger](create-first-function-azure-developer-cli.md?pivots=programming-language-python)
::: zone-end

::: zone pivot="programming-language-javascript" 
+ [Quickstart: Azure Functions HTTP trigger](create-first-function-azure-developer-cli.md?pivots=programming-language-javascript)
::: zone-end

::: zone pivot="programming-language-powershell" 
+ [Quickstart: Azure Functions HTTP trigger](create-first-function-azure-developer-cli.md?pivots=programming-language-powershell)
::: zone-end

::: zone pivot="programming-language-typescript" 
+ [Quickstart: Azure Functions HTTP trigger](create-first-function-azure-developer-cli.md?pivots=programming-language-typescript)
::: zone-end

::: zone pivot="programming-language-java"
+ [Quickstart: Azure Functions HTTP trigger](create-first-function-azure-developer-cli.md?pivots=programming-language-java)
::: zone-end  

## Build a serverless workflow

Functions often serve as the compute component in a serverless workflow topology, such as a Logic Apps workflow. You can also create long-running orchestrations by using the Durable Functions extension. For more information, see [Durable Functions overview](./durable/durable-functions-overview.md).

:::image type="content" source="media/functions-scenarios/build-a-serverless-workflow.png" alt-text="A combination diagram of a series of specific serverless workflows using Azure Functions." lightbox="media/functions-scenarios/build-a-serverless-workflow-expanded.png":::

::: zone pivot="programming-language-csharp" 
+ [Tutorial: Create a function to integrate with Azure Logic Apps](./functions-twitter-email.md)
+ [Quickstart: Create your first durable function in Azure using C#](./durable/durable-functions-isolated-create-first-csharp.md)
+ [Training: Deploy serverless APIs with Azure Functions, Logic Apps, and Azure SQL Database](/training/modules/deploy-backend-apis/)
::: zone-end

::: zone pivot="programming-language-javascript" 
+ [Quickstart: Create your first durable function in Azure using JavaScript](./durable/quickstart-js-vscode.md)
+ [Training: Deploy serverless APIs with Azure Functions, Logic Apps, and Azure SQL Database](/training/modules/deploy-backend-apis/)
::: zone-end

::: zone pivot="programming-language-typescript" 
+ [Quickstart: Create your first durable function in Azure using JavaScript](./durable/quickstart-ts-vscode.md)
+ [Training: Deploy serverless APIs with Azure Functions, Logic Apps, and Azure SQL Database](/training/modules/deploy-backend-apis/)
::: zone-end

::: zone pivot="programming-language-python" 
+ [Quickstart: Create your first durable function in Azure using Python](./durable/quickstart-python-vscode.md)
+ [Training: Deploy serverless APIs with Azure Functions, Logic Apps, and Azure SQL Database](/training/modules/deploy-backend-apis/)
::: zone-end

::: zone pivot="programming-language-java" 
+ [Quickstart: Create your first durable function in Azure using Java](./durable/quickstart-java.md)
::: zone-end

::: zone pivot="programming-language-powershell" 
+ [Quickstart: Create your first durable function in Azure using PowerShell](./durable/quickstart-powershell-vscode.md)
::: zone-end

## Respond to database changes

Some processes need to log, audit, or perform other operations when stored data changes. Functions triggers provide a good way to get notified of data changes to initial such an operation.

:::image type="content" source="media/functions-scenarios/respond-to-database-changes.png" alt-text="Diagram of a function being used to respond to database changes." lightbox="media/functions-scenarios/respond-to-database-changes-expanded.png":::

::: zone pivot="programming-language-csharp,programming-language-typescript,programming-language-python" 
Consider these examples:

+ [Quickstart: Respond to database changes in Azure Cosmos DB using Azure Functions](scenario-database-changes-azure-cosmosdb.md)

+ [Quickstart: Respond to database changes in Azure SQL Database using Azure Functions](scenario-database-changes-azure-sqldb.md)
::: zone-end  
::: zone pivot="programming-language-csharp" 
+ [Sample: Azure Functions with Azure Cosmos DB (trigger)](https://github.com/Azure-Samples/functions-quickstart-dotnet-azd-cosmosdb)

+ [Sample: Azure Functions with Azure SQL Database (trigger)](https://github.com/Azure-Samples/functions-quickstart-dotnet-azd-sql)  
::: zone-end  
::: zone pivot="programming-language-typescript" 
+ [Sample: Azure Functions with Azure Cosmos DB Trigger](https://github.com/Azure-Samples/functions-quickstart-typescript-azd-cosmosdb)

+ [Sample: Azure Functions with Azure SQL Database (trigger)](https://github.com/Azure-Samples/functions-quickstart-typescript-azd-sql)  
::: zone-end
::: zone pivot="programming-language-python" 
+ [Sample: Azure Functions with Azure Cosmos DB Trigger](https://github.com/Azure-Samples/functions-quickstart-python-azd-cosmosdb)

+ [Sample: Azure Functions with Azure SQL Database (trigger)](https://github.com/Azure-Samples/functions-quickstart-python-azd-sql)  
::: zone-end

## Create reliable message systems 

You can use Functions with Azure messaging services to create advanced event-driven messaging solutions. 

For example, you can use triggers on Azure Storage queues as a way to chain together a series of function executions. Or use service bus queues and triggers for an online ordering system.

:::image type="content" source="media/functions-scenarios/create-reliable-message-systems.png" alt-text="Diagram of Azure Functions in a reliable message system." lightbox="media/functions-scenarios/create-reliable-message-systems-expanded.png":::

These articles show how to write output to a storage queue:

::: zone pivot="programming-language-csharp" 
+ [Article: Connect Azure Functions to Azure Storage using Visual Studio Code](functions-add-output-binding-storage-queue-vs-code.md?pivots=programming-language-csharp&tabs=isolated-process)
+ [Article: Create a function triggered by Azure Queue storage (Azure portal)](functions-create-storage-queue-triggered-function.md)
::: zone-end

::: zone pivot="programming-language-javascript" 
+ [Article: Connect Azure Functions to Azure Storage using Visual Studio Code](functions-add-output-binding-storage-queue-vs-code.md?pivots=programming-language-javascript)
+ [Article: Create a function triggered by Azure Queue storage (Azure portal)](functions-create-storage-queue-triggered-function.md)
+ [Training: Chain Azure Functions together using input and output bindings](/training/modules/chain-azure-functions-data-using-bindings/)
::: zone-end

::: zone pivot="programming-language-python" 
+ [Article: Connect Azure Functions to Azure Storage using Visual Studio Code](functions-add-output-binding-storage-queue-vs-code.md?pivots=programming-language-python)
+ [Article: Create a function triggered by Azure Queue storage (Azure portal)](functions-create-storage-queue-triggered-function.md)
::: zone-end

::: zone pivot="programming-language-java" 
+ [Article: Connect Azure Functions to Azure Storage using Visual Studio Code](functions-add-output-binding-storage-queue-vs-code.md?pivots=programming-language-java)
+ [Article: Create a function triggered by Azure Queue storage (Azure portal)](functions-create-storage-queue-triggered-function.md)
::: zone-end

::: zone pivot="programming-language-powershell" 
+ [Article: Connect Azure Functions to Azure Storage using Visual Studio Code](functions-add-output-binding-storage-queue-vs-code.md?pivots=programming-language-powershell)
+ [Article: Create a function triggered by Azure Queue storage (Azure portal)](functions-create-storage-queue-triggered-function.md)
+ [Training: Chain Azure Functions together using input and output bindings](/training/modules/chain-azure-functions-data-using-bindings/)
::: zone-end

These articles show how to trigger from an Azure Service Bus queue or topic.

::: zone pivot="programming-language-csharp" 
+ [Azure Service Bus trigger for Azure Functions](functions-bindings-service-bus-trigger.md?pivots=programming-language-csharp)
::: zone-end

::: zone pivot="programming-language-javascript" 
+ [Azure Service Bus trigger for Azure Functions](functions-bindings-service-bus-trigger.md?pivots=programming-language-javascript)
::: zone-end
::: zone pivot="programming-language-typescript" 
+ [Azure Service Bus trigger for Azure Functions](functions-bindings-service-bus-trigger.md?pivots=programming-language-typescript)
::: zone-end
::: zone pivot="programming-language-python" 
+ [Azure Service Bus trigger for Azure Functions](functions-bindings-service-bus-trigger.md?pivots=programming-language-python)
::: zone-end

::: zone pivot="programming-language-java" 
+ [Azure Service Bus trigger for Azure Functions](functions-bindings-service-bus-trigger.md?pivots=programming-language-java)
::: zone-end

::: zone pivot="programming-language-powershell" 
+ [Azure Service Bus trigger for Azure Functions](functions-bindings-service-bus-trigger.md?pivots=programming-language-powershell)
::: zone-end

## Next steps

> [!div class="nextstepaction"]
> [Getting started with Azure Functions](./functions-get-started.md)
