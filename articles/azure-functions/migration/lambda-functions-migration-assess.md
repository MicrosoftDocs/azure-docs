---
title: Assess Workloads to Migrate from AWS Lambda to Azure Functions
description: Learn how to map AWS Lambda features to Azure Functions and develop a plan for your AWS Lambda to Azure Functions migration.
author: MadhuraBharadwaj-MSFT
ms.author: mabhar
ms.service: azure-functions
ms.topic: how-to
ms.date: 03/18/2025
#customer intent: As a developer, I want to ensure compatibility between features and create a detailed migration plan so that I can migrate serverless applications from AWS Lambda to Azure Functions efficiently.
--- 

# Assess workloads to migrate from AWS Lambda to Azure Functions

In this stage, you map AWS Lambda features to Azure Functions and develop a migration plan. The goal is to understand the AWS services and features that your Lambda functions depend on and find their Azure equivalents. Then you can select key workloads for a proof of concept.

## Map AWS services to their Azure Functions equivalents

To ensure compatibility, you need to understand the specific properties and configurations of Lambda functions and find their equivalents in Azure Functions. Both services provide core serverless capabilities. Azure Functions also provides the following unique features:
- A unique programming model that has triggers and bindings for simplified development
- Configurable concurrency for each compute instance
- The Durable Functions extension for built-in orchestration
- Built-in integration with Azure OpenAI Service to enable advanced AI-driven solutions

You also need to [map the AWS services](/azure/architecture/aws-professional), like Amazon S3, that Lambda depends on to corresponding Azure services, like Azure Blob Storage.

The following tables compare AWS Lambda concepts, resources, and properties with their corresponding equivalents on Azure Functions.

### Supported languages

| Programming language  | [AWS Lambda supported versions](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html#runtimes-supported)  | [Azure Functions supported versions](/azure/azure-functions/supported-languages) |
|---|---|---|
| Node.js | 18, 20, 22 | 18, 20, 22 |
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
| Amazon CloudWatch helps with monitoring and observability by collecting and tracking metrics, aggregating and analyzing logs, setting alarms, creating custom dashboards, and implementing automated responses to changes in resource performance and metrics.  | Azure Monitor provides comprehensive monitoring and observability for Azure Functions, particularly through its Application Insights feature. <br> Application Insights collects telemetry data such as request rates, response times, and failure rates. It visualizes application component relationships, monitors real-time performance, logs detailed diagnostics, and allows custom metric tracking. These capabilities help maintain the performance, availability, and reliability of Azure Functions, while enabling custom dashboards, alerts, and automated responses.  |
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
| Custom domains  | Enabled via API Gateway  | [Can be configured directly on a function app or on Azure API Management](/azure/app-service/app-service-web-tutorial-custom-domain)   |
| Custom container support   | Supports custom containers via Lambda Container Image  | [Supports custom containers via Azure Functions running in Azure Container Apps](/azure/azure-functions/functions-how-to-custom-container)   |
 
## Create a migration plan

- Select key workloads for a proof of concept.

   Start by selecting one to two medium-sized, noncritical workloads from your total inventory. These workloads serve as the foundation for your proof-of-concept migration. You can test the process and identify potential challenges without risking major disruption to your operations.

- Test iteratively and gather feedback.

   Use the proof of concept to gather feedback, identify gaps, and fine-tune the process before you scale to larger workloads. This iterative approach ensures that by the time you move to full-scale migration, you address potential challenges and refine the process.

By the end of this stage, you've mapped AWS Lambda features and services to their Azure Functions equivalents and selected key workloads for a proof of concept. This detailed mapping and migration plan serves as the foundation for the next stage, where you complete the migration.

## Next step

> [!div class="nextstepaction"]
> [Migrate stage](lambda-functions-migration-migrate.md)