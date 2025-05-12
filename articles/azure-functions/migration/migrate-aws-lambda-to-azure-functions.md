---
title: Migrate AWS Lambda Workloads to Azure Functions
description: Learn how to migrate workloads from AWS Lambda to Azure Functions. Compare functionality and optimize workloads on Azure.
author: MadhuraBharadwaj-MSFT
ms.author: mabhar
ms.service: azure-functions
ms.collection: 
 - migration
 - aws-to-azure
ms.date: 03/18/2025
ms.topic: conceptual
#customer intent: As a developer, I want to learn how to migrate serverless applications from AWS Lambda to Azure Functions so that I can make the transition efficiently.
---

# Migrate AWS Lambda workloads to Azure Functions

Migrating a serverless workload that uses Amazon Web Services (AWS) Lambda to Azure Functions requires careful planning and implementation. This article provides essential guidance to help you:

- Perform a discovery process on your existing workload.
- Learn how to perform key migration activities like premigration planning and workload assessment.
- Evaluate and optimize a migrated workload.

## Scope

This article describes the migration of an AWS Lambda instance to Azure Functions.

This article doesn't address:

- Migration to your own container hosting solution, such as through Azure Container Apps.
- Hosting AWS Lambda containers in Azure.
- Fundamental Azure adoption approaches by your organization, such as [Azure landing zones](/azure/cloud-adoption-framework/ready/landing-zone/) or other topics addressed in the Cloud Adoption Framework [migrate methodology](/azure/cloud-adoption-framework/migrate/).

### Compare functionality

This article maps AWS Lambda features to Azure Functions equivalents to help ensure compatibility.

> [!IMPORTANT]
> You might choose to include optimization in your migration plan, but Microsoft recommends a two-step process. Migrate "like-to-like" functionalities first, and then evaluate optimization opportunities on Azure.
>
> Optimization efforts should be continuous and run through your workload team's change control processes. A migration that adds more capabilities during a migration incurs risk and unnecessarily extends the process.

### Workload perspective

This article focuses on how to migrate an AWS Lambda workload to Azure Functions and the common dependencies for serverless workloads. This process might involve several services because workloads comprise many resources and processes to manage those resources. 
To have a comprehensive strategy, you must combine the recommendations presented in this article with a larger plan that includes the other components and processes in your workload.

## Perform a discovery process on your existing workload

The first step is to conduct a detailed discovery process to evaluate your existing AWS Lambda workload. The goal is to understand which AWS features and services your workload relies on. Compile a comprehensive inventory of your AWS Lambda functions by using AWS tooling like service-specific SDKs, APIs, CloudTrail, and AWS CLI to assess the workload on AWS. You should understand the following key aspects of your AWS Lambda inventory:

- Use cases
- Configurations
- Security and networking setups
- Tooling, monitoring, logging, and observability mechanisms
- Dependencies
- Reliability objectives and current reliability status
- Cost of ownership
- Performance targets and current performance

## Perform premigration planning

Before you start migrating your workload, you must map AWS Lambda features to Azure Functions to ensure compatibility and develop a migration plan. Then you can select key workloads for a proof of concept.

You also need to [map the AWS services](/azure/architecture/aws-professional) that Lambda depends on to the equivalent dependencies in Azure.

## Map AWS Lambda features to Azure Functions

The following tables compare AWS Lambda concepts, resources, and properties with their corresponding equivalents on Azure Functions, specifically, the Flex Consumption hosting plan.

- [Supported languages](#supported-languages)
- [Programming model](#programming-model)
- [Event triggers and bindings](#event-triggers-and-bindings)
- [Permissions](#permissions)
- [Function URL](#function-url)
- [Networking](#networking)
- [Observability and monitoring](#observability-and-monitoring)
- [Scaling and concurrency](#scaling-and-concurrency)
- [Cold-start protection](#cold-start-protection)
- [Pricing](#pricing)
- [Source code storage](#source-code-storage)
- [Local development](#local-development)
- [Deployment](#deployment)
- [Time-out and memory limits](#time-out-and-memory-limits)
- [Secret management](#secret-management)
- [State management](#state-management)
- [Stateful orchestration](#stateful-orchestration)
- [Other differences and considerations](#other-differences-and-considerations)

### Supported languages

| Programming language  | [AWS Lambda supported versions](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html#runtimes-supported)  | [Azure Functions supported versions](/azure/azure-functions/supported-languages) |
|---|---|---|
| Node.js | 20, 22 | 20, 22 |
| Python | 3.9, 3.10, 3.11, 3.12, 3.13 | 3.9, 3.10, 3.11 |
| Java | 8, 11, 17, 21 | 8, 11, 17, 21 |
| PowerShell | Not supported | 7.4 |
| .NET | .NET 8 | .NET 8, .NET 9, .NET Framework 4.8.1 |
| Ruby | 3.2, 3.3 | [Custom handlers](/azure/azure-functions/functions-custom-handlers) |
| Go | [OS-only runtime](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-provided.html) | [Custom handlers](/azure/azure-functions/functions-custom-handlers) |
| Rust | [OS-only runtime](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-provided.html) | [Custom handlers](/azure/azure-functions/functions-custom-handlers) |

### Programming model

| Feature  | AWS Lambda  | Azure Functions   |
|---|---|---|
| Triggers  | Integrates with other AWS services via event sources. Provides automatic and programmatic ways to link Lambda functions with event sources.    | Triggers a function based on specific events, such as updates in a database or a new message in a queue. For example, an Azure Cosmos DB trigger allows functions to automatically respond to inserts and updates in an Azure Cosmos DB container. This action enables real-time processing of data changes. <br><br> Functions also integrates with Azure Event Grid, so it can process events from Azure services, like Azure Storage and Azure Media Services, and external event sources. Event Grid serves as a centralized, extensible event routing service that complements Functions triggers and enables high scalability and broad event-source coverage.  |
| Bindings  | Doesn't have bindings. Uses AWS SDKs within Lambda functions to manually manage interactions with other AWS services.  | Bindings, configured as input or output, enable declarative connections to services, which minimize the need for explicit SDK code. For example, you can configure bindings to read from Blob Storage, write to Azure Cosmos DB, or send emails via SendGrid without manually managing the integrations.  |

### Event triggers and bindings

| AWS Lambda trigger or service  | [Azure Functions trigger](/azure/azure-functions/functions-triggers-bindings)  |  Description  |
|---|---|---|
| API Gateway: HTTP requests  | [HTTP trigger](/azure/azure-functions/functions-bindings-http-webhook-trigger)  | These triggers allow you to handle HTTP requests directly.  |
| Simple Queue Service (SQS)  | [Azure Queue Storage trigger](/azure/azure-functions/functions-bindings-storage-queue-trigger) or [Azure Service Bus trigger](/azure/azure-functions/functions-bindings-service-bus-trigger) | These triggers can process messages in queues.  |
| Simple Notification Service (SNS)  | [Event Grid trigger](/azure/azure-functions/functions-bindings-event-grid-trigger) or [Service Bus trigger](/azure/azure-functions/functions-bindings-service-bus-trigger)  | These triggers enable notification processing.  |
| Kinesis (data streams)  | [Event Hubs trigger](/azure/azure-functions/functions-bindings-event-hubs-trigger)  | These triggers consume data streams.  |
| DynamoDB (table changes)  | [Azure Cosmos DB change feed trigger](/azure/azure-functions/functions-bindings-cosmosdb-v2-trigger)  | These triggers listen for changes in tables.  |
| CloudWatch Events or EventBridge Scheduler  | [Timer trigger](/azure/azure-functions/functions-bindings-timer)  | These triggers handle scheduled or time-based functions.  |
| S3 (object events)  | [Blob Storage trigger](/azure/azure-functions/functions-bindings-storage-blob-trigger)  | These triggers react to events in blob storage.  |
| Amazon Relational Database Service (RDS)  | [Azure SQL trigger](/azure/azure-functions/functions-bindings-azure-sql-trigger)  | These triggers react to database changes.  |
|  Managed Streaming for Apache Kafka (MSK)  | [Apache Kafka trigger](/azure/azure-functions/functions-bindings-kafka-trigger)  | These triggers react to Kafka topic messages.  |
| Amazon ElastiCache  | [Azure Redis trigger](/azure/azure-functions/functions-bindings-cache)  | These triggers react to messages in Redis.  |
| Amazon MQ  | [RabbitMQ trigger](/azure/azure-functions/functions-bindings-rabbitmq-trigger)  | These triggers react to messages in RabbitMQ.  |

### Permissions

| AWS Lambda  | Azure Functions   |
|---|---|
| The Lambda execution role grants Lambda functions permissions to interact with other AWS services. Each Lambda function has an associated identity and access management (IAM) role that determines its permissions while it runs.  | Managed identities provide an identity for your function app that allows it to authenticate with other Azure services without storing credentials in the code. Role-based access control assigns appropriate roles to the managed identity in Microsoft Entra ID to grant access to the resources that it requires.  |
| Resource-based policy statements: <br><br> - AWSLambda_FullAccess gives full access to all Lambda operations, including creating, updating, and deleting functions. <br><br> - AWSLambda_ReadOnlyAccess gives read-only access to view Lambda functions and their configurations. <br><br> - Custom IAM policies.  | Resource-based built-in roles: <br><br> - The Owner role gives full access, including access permissions management. <br><br> - The Contributor role can create and delete function apps, configure settings, and deploy code. It can't manage access. <br><br> - The Monitoring Reader role can grant read-only access to monitoring data and settings. It can also allocate custom roles.  |

### Function URL

| AWS Lambda  | Azure Functions   |
|---|---|
| `https://<url-id>.lambda-url.<region>.on.aws`  | - `<appname>.azurewebsites.net` (original, global default hostname) </br><br> - `<appname>-<randomhash>.<Region>.azurewebsites.net` (new, unique default hostname)  |

### Networking

| AWS Lambda  | Azure Functions   |
|---|---|
| All Lambda functions run securely inside a default system-managed virtual private cloud (VPC). You can also configure your Lambda function to access resources in a custom VPC.  |    Function apps can be network secured and can access other services inside the network. Inbound network access can be restricted to only a firewall list of IP addresses and to a specific virtual network via service endpoints or private endpoints. Outbound network access is enabled through the virtual network integration feature. The function app can have all its traffic restricted to a virtual network's subnet and can also access other services inside that virtual network.  |

### Observability and monitoring

| AWS Lambda  | Azure Functions   |
|---|---|
| Amazon CloudWatch helps with monitoring and observability by collecting and tracking metrics, aggregating and analyzing logs, setting alarms, creating custom dashboards, and implementing automated responses to changes in resource performance and metrics.  | Azure Monitor provides comprehensive monitoring and observability for Azure Functions, particularly through its Application Insights feature. <br><br> Application Insights collects telemetry data such as request rates, response times, and failure rates. It visualizes application component relationships, monitors real-time performance, logs detailed diagnostics, and allows custom metric tracking. These capabilities help maintain the performance, availability, and reliability of Azure Functions, while enabling custom dashboards, alerts, and automated responses.  |
| AWS Lambda generates telemetry data from your function invocations and can export this data by using OpenTelemetry semantics. You can configure your Lambda functions to send this telemetry data to any OpenTelemetry-compliant endpoint. This action allows for correlation of traces and logs, consistent standards-based telemetry data, and integration with other observability tools that support OpenTelemetry.  | Configure your functions app to export log and trace data in an OpenTelemetry format. You can export telemetry data to any compliant endpoint by using OpenTelemetry. OpenTelemetry provides benefits such as correlation of traces and logs, consistent standards-based telemetry data, and integration with other providers. You can enable OpenTelemetry at the function app level in the host configuration and in your code project to optimize data exportation from your function code. For more information, see [Use OpenTelemetry with Azure Functions](/azure/azure-functions/opentelemetry-howto).  |

### Scaling and concurrency

| AWS Lambda  |  Azure Functions   |
|---|---|
| AWS uses an on-demand scaling model. Automatically scale your function operation in response to demand. Concurrency, or the number of requests handled by an instance, is always 1.  | Instances are dynamically added and removed based on the number of incoming events and the configured concurrency for each instance. You can configure the [concurrency setting](/azure/azure-functions/flex-consumption-how-to#set-http-concurrency-limits) to your desired value.      |
| Concurrency is always 1.  | Concurrency is configurable (>1).     |
| Supports scaling to 0.  | Supports scaling to 0.  |

### Cold-start protection

 | AWS Lambda  | Azure Functions   |
|---|---|
| Provisioned concurrency reduces latency and ensures predictable function performance by pre-initializing a requested number of function instances. Provisioned concurrency suits latency-sensitive applications and is priced separately from standard concurrency.    | Function apps allow you to configure concurrency for each instance, which drives its scale. Multiple jobs can run in parallel in the same instance of the app, and subsequent jobs in the instance don't incur the initial cold start. Function apps also have *always ready* instances. Customers can specify a number of prewarmed instances to eliminate cold-start latency and ensure consistent performance. Function apps also scale out to more instances based on demand, while maintaining the always ready instances.     |
| Reserved concurrency specifies the maximum number of concurrent instances that a function can have. This limit ensures that a portion of your account's concurrency quota is set aside exclusively for that function. AWS Lambda dynamically scales out to handle incoming requests even when reserved concurrency is set, as long as the requests don't exceed the specified reserved concurrency limit. The lower limit for reserved concurrency in AWS Lambda is 1. The upper limit for reserved concurrency in AWS Lambda is determined by the account's regional concurrency quota. By default, this limit is 1,000 concurrent operations for each region. | Azure Functions doesn't have an equivalent feature to reserved concurrency. To achieve similar functionality, isolate specific functions into separate function apps and set the maximum scale-out limit for each app. Azure Functions dynamically scales out, or adds more instances, and scales in, or removes instances, within the scale-out limit set. By default, apps that run in a Flex Consumption plan start with a configurable limit of 100 overall instances. The lowest maximum instance count value is 40, and the highest supported maximum instance count value is 1,000.  [Regional subscription memory quotas](/azure/azure-functions/flex-consumption-plan#regional-subscription-memory-quotas) can also limit how much function apps can scale out, but you can increase this quota by calling support. |

### Pricing

| AWS Lambda  | Azure Functions   |
|---|---|
| - Pay per use for the total invocation count and for the GB/s for each instance (with a fixed concurrency of 1) <br><br> - 1 ms increments <br><br> - 400,000 Gbps free tier    | - Pay per use for the total invocation count and for the GB/s of each instance (with configurable concurrent invocations) <br><br> - 100 ms increments <br><br> - 100,000 Gbps free tier <br><br> - [Consumption-based costs](/azure/azure-functions/functions-consumption-costs#consumption-based-costs)  |
 
### Source code storage

| AWS Lambda  | Azure Functions   |
|---|---|
| AWS Lambda manages the storage of your function code in its own managed storage system. You don't need to supply more storage.  | Functions requires a customer-supplied Blob Storage container to maintain the deployment package that contains your app's code. You can configure the settings to use the same or a different storage account for deployments and manage authentication methods for accessing the container.  |
 
### Local development

| AWS Lambda feature  | Azure Functions feature   |
|---|---|
| - SAM CLI <br><br> - [LocalStack](https://github.com/localstack/localstack)  | - Azure Functions Core Tools <br><br> - Visual Studio Code <br><br> - Visual Studio <br><br> - GitHub Codespaces <br><br> - VSCode.dev <br><br> - Maven <br><br> - [Code and test Azure Functions locally](/azure/azure-functions/functions-develop-local)  |
 
### Deployment

| Feature  | AWS Lambda  | Azure Functions  |
|---|---|---|
| Deployment package  | - ZIP file <br><br> - Container image  | ZIP file (For container image deployment, use the dedicated or premium SKU.)  |
| ZIP file size (console)  | 50 MB maximum  | 500 MB maximum for ZIP deployment |
| ZIP file size (CLI/SDK)    | 250 MB maximum for ZIP deployment, 500 MB maximum for unzipped | 500 MB maximum for ZIP deployment  |
| Container image size  | 10 GB maximum | Container support with flexible storage via Azure  |
| Large artifact handling  | Use container images for larger deployments.  | Attach Blob Storage or Azure Files shares to access large files from the app.  |
| Packaging common dependencies to functions  | Layers  |  Deployment .Zip, on demand from storage, or containers (ACA, dedicated, EP SKUs only)  |
| Blue-green deployment or function versioning  | Use function qualifiers to reference a specific state of your function by using either a version number or an alias name. Qualifiers enable version management and gradual deployment strategies.  |   Use continuous integration and continuous delivery systems for blue-green deployments.  |
 
### Time-out and memory limits

| Feature   | AWS Lambda limits  | Azure Functions limits   |
|---|---|---|
| Execution time-out  | 900 seconds (15 minutes)  | The default time-out is 30 minutes. The maximum time-out is unbounded. However, the grace period given to a function execution is 60 minutes during scale-in and 10 minutes during platform updates. For more information, see [Function app time-out duration](/azure/azure-functions/functions-scale#timeout).  |
| Configurable memory | 128 MB to 10,240 MB, in 64-MB increments | Functions supports [2-GB and 4-GB](/azure/azure-functions/functions-scale#service-limits) instance sizes. Each region in a given subscription has a memory limit of 512,000 MB for all instances of apps, which you can increase by calling support. The total memory usage of all instances across all function apps in a region must stay within this quota. <br><br> Although 2 GB and 4 GB are the instance size options, the concurrency for each instance can be higher than 1. Therefore, a single instance can handle multiple concurrent executions, depending on the configuration. Configuring concurrency appropriately can help optimize resource usage and manage performance. By balancing memory allocation and concurrency settings, you can effectively manage the resources allocated to your function apps and ensure efficient performance and cost control. For more information, see [Regional subscription memory quotas](/azure/azure-functions/flex-consumption-plan#regional-subscription-memory-quotas). |
 
### Secret management 

| AWS Lambda  | Azure Functions   |
|---|---|
| AWS Secrets Manager allows you to store, manage, and retrieve secrets such as database credentials, API keys, and other sensitive information. Lambda functions can retrieve secrets by using the AWS SDK.  |   We recommend that you use secretless approaches like managed identities to enable secure access to Azure resources without hardcoding credentials. When secrets are required, such as for partner or legacy systems, Azure Key Vault provides a secure solution to store and manage secrets, keys, and certificates.  |
| AWS Systems Manager Parameter Store is a service that stores configuration data and secrets. Parameters can be encrypted by using AWS KMS and retrieved by Lambda functions by using the AWS SDK. <br> Lambda functions can store configuration settings in environment variables. Sensitive data can be encrypted with a KMS key for secure access.    | Azure Functions uses application settings to store configuration data. These settings map directly to environment variables for ease of use within the function. These settings can be encrypted and securely stored in the Azure App Service configuration. <br> For more advanced scenarios, Azure App Configuration provides robust features for managing multiple configurations. It enables feature flagging and supports dynamic updates across services.    |

### State management

| AWS Lambda  | Azure Functions  |
|---|---|
| AWS Lambda handles simple state management by using services like Amazon S3 for object storage, DynamoDB for fast and scalable NoSQL state storage, and SQS for message queue handling. These services ensure data persistence and consistency across Lambda function executions.  | Azure Functions uses `AzureWebJobsStorage` to manage state by enabling bindings and triggers with Azure Storage services like Blob Storage, Queue Storage, and Table Storage. It allows functions to easily read and write state. For more complex state management, Durable Functions provides advanced workflow orchestration and state persistence capabilities by using Azure Storage.  |
 
### Stateful orchestration

| AWS Lambda  | Azure Functions   |
|---|---|
| No native state orchestration. Use AWS Step Functions for workflows.  | Durable Functions helps with complex state management by providing durable workflow orchestration and stateful entities. It enables long-running operations, automatic checkpointing, and reliable state persistence. These features enable building intricate workflows to ensure fault tolerance and scalability for stateful applications.  |

### Other differences and considerations

| Feature  | AWS Lambda  | Azure Functions  |
|---|---|---|
| Grouping functions  | Each AWS Lambda function is an independent entity.  | A function app serves as a container for multiple functions. It provides a shared execution context and configuration for the functions that it contains. Treating multiple functions as a single entity simplifies deployment and management. Functions also uses a per-function scaling strategy, where each function is scaled independently, except for HTTP, Blob Storage, and Durable Functions triggers. These triggered functions scale in their own groups.  |
| Custom domains  | Enabled via API Gateway  | You can [configure custom domains](/azure/app-service/app-service-web-tutorial-custom-domain) directly on a function app or on Azure API Management.  |
| Custom container support   | Supports custom containers via Lambda Container Image  | Azure Functions supports [custom containers that run in an Container Apps environment](/azure/azure-functions/functions-how-to-custom-container).  |

## Create a migration plan

1. Select key workloads for a proof of concept.

   Start by selecting one to two medium-sized, noncritical workloads from your total inventory. These workloads serve as the foundation for your proof-of-concept migration. You can test the process and identify potential challenges without risking major disruption to your operations.

1. Test iteratively and gather feedback.

   Use the proof of concept to gather feedback, identify gaps, and fine-tune the process before you scale to larger workloads. This iterative approach ensures that by the time you move to full-scale migration, you address potential challenges and refine the process.

## Build the migration assets

This step is a transitional development phase. During this phase, you build source code, infrastructure as code (IaC) templates, and deployment pipelines to represent the workload in Azure. You must adapt function code for compatibility and best practices before you can perform the migration.

- [Adapt function code, configuration files, and infrastructure as code files](#adapt-function-code-configuration-files-and-infrastructure-as-code-files)
- [Adjust configuration settings](#adjust-configuration-settings)
- [Generate IaC files](#generate-iac-files)
- [Use tools for refactoring](#use-tools-for-refactoring)

### Adapt function code, configuration files, and infrastructure as code files

To update code for Azure Functions runtime requirements:

   - Modify your code to adhere to the Azure Functions programming model. For instance, adapt your function signatures to match the format that Azure Functions requires. For more information about function definition and execution context, see [Azure Functions developer guides](/azure/azure-functions/functions-reference-node).

   - Use the [Azure Functions extensions bundle](/azure/azure-functions/functions-bindings-register) to handle various bindings and triggers that are similar to AWS services. For .NET applications, you should use the appropriate NuGet packages instead of the extensions bundle.

   - Use the extensions bundle to integrate with other Azure services such as Azure Storage, Azure Service Bus, and Azure Cosmos DB without needing to manually configure each binding through SDKs. For more information, see [Connect functions to Azure services by using bindings](/azure/azure-functions/add-bindings-existing-function) and [Azure Functions binding expression patterns](/azure/azure-functions/functions-bindings-expressions-patterns).

The following snippets are examples of common SDK code. The AWS Lambda code maps to the corresponding triggers, bindings, or SDK code snippets in Azure Functions.

**Reading from Amazon S3 versus Azure Blob Storage**

:::row:::
   :::column span="":::
      
      AWS Lambda code (SDK)

      ```
      const AWS = require('aws-sdk');
      const s3 = new AWS.S3();

      exports.handler = async (event) => {
       const params = {
        Bucket: 'my-bucket',
        Key: 'my-object.txt',
       };
       const data = await
      s3.getObject(params).promise();
       console.log('File content:',
      data.Body.toString());
      };       
      ```

   :::column-end:::
   :::column span="":::
      
      Azure Functions code (trigger)

      ```
      import { app } from '@azure/functions';

      app.storageblob('blobTrigger', { 
       path: 'my-container/{blobName}',
       connection: 'AzureWebJobsStorage',
      }, async (context, myBlob) => { 
       context.log(`Blob content:
      ${myBlob.toString()}`);
      });
      ```

   :::column-end:::
:::row-end:::

**Writing to Amazon Simple Queue Service (SQS) versus Azure Queue Storage**

:::row:::
   :::column span="":::

      AWS Lambda code (SDK)

      ```
      const AWS = require('aws-sdk');
      const sqs = new AWS.SQS(); 

      exports.handler = async (event) => {
       const params = {
        QueueUrl:
      'https://sqs.amazonaws.com/123456789012/MyQueue',
         MessageBody: 'Hello, world!',
       };
        await
      sqs.sendMessage(params).promise();
      };
      ```    

   :::column-end:::
   :::column span="":::

      Azure Functions code (trigger)

      ```
      import { app } from '@azure/functions';

      app.queue('queueTrigger', { 
       queueName: 'myqueue-items',
       connection: 'AzureWebJobsStorage',
      }, async (context, queueMessage) => {
        context.log(`Queue message: 
      ${queueMessage}`);
      }); 
      ```

   :::column-end:::
:::row-end:::

**Writing to DynamoDB versus Azure Cosmos DB**

:::row:::
   :::column span="":::

      AWS Lambda code (SDK)

      ```
      const AWS = require('aws-sdk'); 
      const dynamoDb = new AWS.DynamoDB.DocumentClient();   

      exports.handler = async (event) => { 
      const params = { 
       TableName: 'my-table', 
       Key: { id: '123' }, 
      }; 
       const data = await dynamoDb.get(params).promise(); 
        console.log('DynamoDB record:', data.Item); 
      }; 
      ```

   :::column-end:::
   :::column span="":::

      Azure Functions code (trigger)
      
      ```
      import { app } from '@azure/functions';  

      app.cosmosDB('cosmosTrigger', { 
       connectionStringSetting: 'CosmosDBConnection', 
       databaseName: 'my-database', 
       containerName: 'my-container', 
       leaseContainerName: 'leases', 
      }, async (context, documents) => { 
       documents.forEach(doc => { 
       context.log(`Cosmos DB document: ${JSON.stringify(doc)}`); 
       }); 
      }); 
      ```

   :::column-end:::
:::row-end:::

**Amazon CloudWatch Events versus an Azure timer trigger**

:::row:::
   :::column span="":::

      AWS Lambda code (SDK)

      ```
      exports.handler = async (event) => {
       console.log('Scheduled event:', event); 
      }; 
      ```

   :::column-end:::
   :::column span="":::

      Azure Functions code (trigger)

      ```
      import { app } from '@azure/functions'; 
       
      app.timer('timerTrigger', { schedule: '0 */5 * * * *', // Runs every 5 minutes }, async (context, myTimer) => { if (myTimer.isPastDue) { context.log('Timer is running late!'); } context.log(Timer function executed at: ${new Date().toISOString()}); });
      ```

   :::column-end:::
:::row-end:::

**Amazon Simple Notification Service (SNS) versus an Azure Event Grid trigger**

:::row:::
   :::column span="":::

      AWS Lambda code (SDK)

      ```
      const AWS = require('aws-sdk'); 
      const sns = new AWS.SNS();   

      exports.handler = async (event) => { 
       const params = { 
        Message: 'Hello, Event Grid!', 
        TopicArn: 'arn:aws:sns:us-east-1:123456789012:MyTopic', 
       }; 
       await sns.publish(params).promise(); 
      }; 
      ```

   :::column-end:::
   :::column span="":::

      Azure Functions code (trigger)

      ```
      import { app } from '@azure/functions'; 

      app.eventGrid('eventGridTrigger', {}, 
      async (context, eventGridEvent) => { 

       context.log(`Event Grid event: 
      ${JSON.stringify(eventGridEvent)}`); 

      }); 
      ```

   :::column-end:::
:::row-end:::

**Amazon Kinesis versus an Azure Event Hubs trigger**

:::row:::
   :::column span="":::

      AWS Lambda code (SDK)

      ```
      const AWS = require('aws-sdk'); 
      const kinesis = new AWS.Kinesis();   

      exports.handler = async (event) => { 
       const records = 
      event.Records.map(record => 
      Buffer.from(record.kinesis.data, 
      'base64').toString()); 
        console.log('Kinesis records:', records); 
      }; 
      ```

   :::column-end:::
   :::column span="":::

      Azure Functions code (trigger)

      ```
      import { app } from '@azure/functions'; 
      app.eventHub('eventHubTrigger', {  
       connection: 'EventHubConnection',  
       eventHubName: 'my-event-hub',  
      }, async (context, eventHubMessages) => 
      {  
       eventHubMessages.forEach(message => 
      {  
       context.log(`Event Hub message: 
      ${message}`);  
       });  
      });
      ```

   :::column-end:::
:::row-end:::

See the following GitHub repositories to compare AWS Lambda code and Azure Functions code:

- [AWS Lambda code](https://github.com/MadhuraBharadwaj-MSFT/TestLambda)
- [Azure Functions code](https://github.com/MadhuraBharadwaj-MSFT/TestAzureFunction)
- [Azure samples repository](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples), which includes starter, IaC, and end-to-end samples for Azure Functions

### Adjust configuration settings

Ensure that your function's time-out and [memory](/azure/azure-functions/flex-consumption-how-to#configure-instance-memory) settings are compatible with Azure Functions. For more information about configurable settings, see [host.json reference for Azure Functions](/azure/azure-functions/functions-host-json).

Follow the recommended best practices for permissions, access, networking, and deployment configurations. 
 
#### Configure permissions

Follow best practices when you set up permissions on your function apps. For more information, see [Configure your function app and storage account with managed identity](https://eng.ms/docs/cloud-ai-platform/devdiv/serverless-paas-balam/serverless-paas-vikr/app-service-web-apps/app-service-team-documents/functionteamdocs/faqs/tutorial-secretless-mi#configure-your-function-app-and-storage-account-with-managed-identity).

**main.bicep** 

```
// User-assigned managed identity that the function app uses to reach Storage and Service Bus
module processorUserAssignedIdentity './core/identity/userAssignedIdentity.bicep' = {
  name: 'processorUserAssignedIdentity'
  scope: rg
  params: {
    location: location
    tags: tags
    identityName: !empty(processorUserAssignedIdentityName) ? processorUserAssignedIdentityName : '${abbrs.managedIdentityUserAssignedIdentities}processor-${resourceToken}'
  }
}
```

For more information, see [userAssignedIdentity.bicep](https://github.com/Azure-Samples/functions-quickstart-javascript-azd/blob/main/infra/core/identity/userAssignedIdentity.bicep).

#### Configure network access

Azure Functions supports [virtual network integration](/azure/azure-functions/functions-networking-options#virtual-network-integration), which gives your function app access to resources in your virtual network. After integration, your app routes outbound traffic through the virtual network. Then your app can access private endpoints or resources by using rules that only allow traffic from specific subnets. If the destination is an IP address outside of the virtual network, the source IP address is one of the addresses listed in your app's properties, unless you configure a NAT gateway.

When you enable [virtual network integration](/azure/azure-functions/flex-consumption-how-to#enable-virtual-network-integration) for your function apps, 
follow the best practices in [TSG for virtual network integration for web apps and function apps](https://eng.ms/docs/cloud-ai-platform/devdiv/serverless-paas-balam/serverless-paas-vikr/app-service-web-apps/app-service-team-documents/functionteamdocs/faqs/tsg-vnet-integration).

**main.bicep**

```
// Virtual network and private endpoint
module serviceVirtualNetwork 'app/vnet.bicep' = {
  name: 'serviceVirtualNetwork'
  scope: rg
  params: {
    location: location
    tags: tags
    vNetName: !empty(vNetName) ? vNetName : '${abbrs.networkVirtualNetworks}${resourceToken}'
  }
}  

module servicePrivateEndpoint 'app/storage-PrivateEndpoint.bicep' = {
  name: 'servicePrivateEndpoint'
  scope: rg
  params: {
    location: location
    tags: tags
    virtualNetworkName: !empty(vNetName) ? vNetName : '${abbrs.networkVirtualNetworks}${resourceToken}'
    subnetName: serviceVirtualNetwork.outputs.peSubnetName
    resourceName: storage.outputs.name
  }
}
```

For more information, see [VNet.bicep](https://github.com/Azure-Samples/functions-quickstart-javascript-azd/blob/main/infra/app/vnet.bicep) and [storage-PrivateEndpoint.bicep](https://github.com/Azure-Samples/functions-quickstart-javascript-azd/blob/main/infra/app/storage-PrivateEndpoint.bicep).

#### Configure deployment settings

Deployments follow a single path. After you build your project code and zip it into an application package, deploy it to a Blob Storage container. When it starts, your app gets the package and runs your function code from it. By default, the same storage account that stores internal host metadata, such as `AzureWebJobsStorage`, also serves as the deployment container. However, you can use an alternative storage account or choose your preferred authentication method by configuring your app's deployment settings. For more information, see [Deployment technology details](/azure/azure-functions/functions-deployment-technologies#deployment-technology-details) and [Configure deployment settings](/azure/azure-functions/flex-consumption-how-to#configure-deployment-settings).
 
### Generate IaC files

- Use tools like Bicep, Azure Resource Manager templates, or Terraform to create IaC files to deploy Azure resources.

- Define resources such as Azure Functions, storage accounts, and networking components in your IaC files.

- Use this [IaC samples repository](https://github.com/Azure-Samples/azure-functions-flex-consumption-samples/tree/main/IaC) for samples that use Azure Functions recommendations and best practices.

### Use tools for refactoring

Use tools like GitHub Copilot in VS Code for help with code refactoring, manual refactoring for specific changes, or other migration aids.

> [!NOTE]
> Use *Agent mode* in GitHub Copilot in VS Code.

The following articles provide specific examples and detailed steps to facilitate the migration process:

- [Azure for AWS professionals](/azure/architecture/aws-professional)
- [Develop Azure Functions locally by using Core Tools](/azure/azure-functions/functions-run-local)

## Develop a step-by-step process for Day-0 migration

Develop failover and failback strategies for your migration and thoroughly test them in a preproduction environment. We recommend that you perform end-to-end testing before you finally transition from AWS Lambda to Azure Functions.

- Validate functionality

   - [Code and test Azure Functions locally](/azure/azure-functions/functions-develop-local).

   - Test each function thoroughly to ensure that it works as expected. These tests should include input/output, event triggers, and bindings verification.

   - Use tools like curl or [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extensions on VS Code to send HTTP requests for HTTP-triggered functions.

   - For other triggers, such as timers or queues, ensure that the triggers fire correctly and the functions run as expected.

- Validate performance

   - Conduct performance testing to compare the new Azure Functions deployment with the previous AWS Lambda deployment.

   - Monitor metrics like response time, run time, and resource consumption.

   - Use Application Insights for [monitoring, log analysis, and troubleshooting](/azure/azure-functions/functions-monitoring) during the testing phase.

- Troubleshoot by using the diagnose and solve problems feature

   Use the [diagnose and solve problems](/azure/app-service/overview-diagnostics) feature in the Azure portal to troubleshoot your function app. This tool provides a set of diagnostics features that can help you quickly identify and resolve common problems, such as application crashes, performance degradation, and configuration problems. Follow the guided troubleshooting steps and recommendations that the tool provides to address problems that you identify.

## Evaluate the end state of the migrated workload

Before you decommission resources in AWS, you need to be confident that the platform meets current workload expectations and that nothing blocks workload maintenance or further development.

Deploy and test functions to validate their performance and correctness.

### Deploy to Azure

Deploy workloads by using the [VS Code](/azure/azure-functions/functions-develop-vs-code#publish-to-azure) publish feature. You can also deploy workloads from the command line by using [Azure Functions Core Tools](/azure/azure-functions/functions-run-local#project-file-deployment) or the [Azure CLI](/cli/azure/functionapp/deployment/source#az-functionapp-deployment-source-config-zip). [Azure DevOps](/azure/azure-functions/functions-how-to-azure-devops#deploy-your-app) and [GitHub Actions](/azure/azure-functions/functions-how-to-github-actions) also use One Deploy.

- Azure Functions Core Tools: [Deploy your function app](/azure/azure-functions/flex-consumption-how-to#deploy-your-code-project) by using [Azure Functions Core Tools](/azure/azure-functions/functions-run-local) with the `func azure functionapp publish <FunctionAppName>` command.

- Continuous integration and continuous deployment (CI/CD) pipelines: Set up a CI/CD pipeline by using services like GitHub Actions, Azure DevOps, or another CI/CD tool.

   For more information, see [Continuous delivery by using GitHub Actions](/azure/azure-functions/functions-how-to-github-actions) or [Continuous delivery with Azure Pipelines](/azure/azure-functions/functions-how-to-azure-devops).

## Explore sample migration scenarios

Use the [MigrationGetStarted repo](https://github.com/MadhuraBharadwaj-MSFT/MigrationGetStarted) as a template to begin your proof of concept. This repo includes a ready-to-deploy Azure Functions project that has the infrastructure and source code files to help you get started.

If you prefer to use Terraform, use [MigrationGetStarted-Terraform](https://github.com/MadhuraBharadwaj-MSFT/MigrationGetStarted-Terraform) instead.

## Optimize and monitor the application's performance on Azure

After you migrate your workload, we recommend that you explore more features on Azure. These features might help you fulfill future workload requirements and help close gaps.

### Use Application Insights for monitoring and troubleshooting

Enable [Application Insights](/azure/azure-functions/functions-monitoring) for your function app to collect detailed telemetry data for monitoring and troubleshooting. You can enable Application Insights through the Azure portal or in the function app's host.json configuration file. After you enable Application Insights, you can:

- Collect telemetry data. Application Insights provides various telemetry data such as request logs, performance metrics, exceptions, and dependencies.

- Analyze logs and metrics. Access the Application Insights dashboard from the Azure portal to visualize and analyze logs, metrics, and other telemetry data. Use the built-in tools to create custom queries and visualize data to gain insights into the performance and behavior of your function app. 

- Set up alerts. Configure alerts in Application Insights to notify you of critical problems, performance degradation, or specific events. These alerts help you proactively monitor and quickly respond to problems.

### Optimize for cost and performance

- Scaling and performance optimization:

   - Use autoscaling features to handle varying workloads efficiently.

   - Optimize function code to improve performance by reducing run time, optimizing dependencies, and using efficient coding practices.

   - Implement caching strategies to reduce repeated processing and latency for frequently accessed data. 

- Cost management:

   - Use [Microsoft Cost Management](/azure/cost-management-billing/cost-management-billing-overview) tools to monitor and analyze your Azure Functions costs.

   - Set up budgeting and cost alerts to manage and predict expenses effectively.

<!--
## Next step

Start the pre-migration evaluation with:

> [!div class="nextstepaction"]
> [Article name](file-name.md)
-->