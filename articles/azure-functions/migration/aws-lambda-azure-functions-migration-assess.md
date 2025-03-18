---
title: AWS Lambda to Azure Functions Migration Assess Stage
description: Learn about the steps that you need to take during the assess stage of your AWS Lambda to Azure Functions migration.
author: MadhuraBharadwaj-MSFT
ms.author: mabhar
ms.service: azure-functions
ms.topic: how-to
ms.date: 03/18/2025
#customer intent: As a developer, I want to learn about the assess stage of migration so that I can migrate serverless applications from AWS Lambda to Azure Functions efficiently.
--- 

# AWS Lambda to Azure Functions migration assess stage

In this stage, since we just conducted the discovery process to inventory the AWS environment, it's time to map AWS Lambda features to Azure Functions and develop a migration plan. The goal is to understand the AWS services and features your Lambda functions depend on and find their Azure equivalents. Then, you will select key workloads for a proof of concept. 

## AWS Lambda to Azure Functions Mapping 

- Map AWS services & features to Azure equivalents
   - Understand the specific properties and configurations of Lambda functions and find the equivalents in Azure Functions.
   - [Compare AWS services](/azure/architecture/aws-professional) used by your Lambda functions with corresponding Azure counterparts. For example, AWS S3 to Azure Blob Storage.
  
- Map AWS Lambda features to Azure Functions equivalents
   - Understand the specific properties and configurations of Lambda functions and find the equivalents in Azure Functions
   - Azure Functions offers core serverless capabilities equivalent to AWS Lambda, while also offering unique advantages such as a unique programming model with triggers and bindings that simplify development, configurable concurrency per compute instance, Durable Functions for built-in orchestration, and built-in integration with Azure OpenAI Services enabling advanced AI-driven solutions. 

For a detailed comparison of AWS Lambda concepts, resources, properties, and their corresponding equivalents on Azure Functions, see below.  

### Supported Languages

| Programming Language  | [AWS Lambda Supported versions](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html#runtimes-supported)  | [Azure Functions Supported versions](/azure/azure-functions/supported-languages)    |
|-----------------------|--------------------------------|---------------------------------------|
| Node.js               | 22, 18, 20                     | 22, 20, 18                            |
| Python                | 3.13, 3.12, 3.11, 3.10, 3.9    | 3.9, 3.10, 3.11                       |
| Java                  | 21, 17, 11, 8                  | 21, 17, 11, 8                         |
| PowerShell            | Not supported                  | 7.4                                   |
| .NET                  | .NET 8                         | .NET 9, .NET 8, .NET Framework 4.8.1  |
| Ruby                  | 3.3, 3.2                       | [Custom Handlers](/azure/azure-functions/functions-custom-handlers)                       |
| Go                    | [OS-only Runtime](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-provided.html)                | [Custom Handlers](/azure/azure-functions/functions-custom-handlers)                       |
| Rust                  | [OS-only Runtime](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-provided.html)                | [Custom Handlers](/azure/azure-functions/functions-custom-handlers)                       |

### Programming model 

| Concept  | AWS Lambda feature  | Azure Functions feature   |
|---|---|---|
| Triggers  | Integrates with other AWS services via event sources. Offers automatic and programmatic ways to link Lambda functions with event sources.    | Azure Functions Triggers initiate function execution based on specific events, such as updates in a database or a new message in a queue. For instance, a Cosmos DB trigger allows functions to automatically respond to inserts and updates in a Cosmos DB container, enabling real-time processing of data changes.    Functions also integrates with Azure Event Grid, allowing them to process events from a wide variety of Azure services (e.g., Storage, Media Services) and external event sources. Event Grid serves as a centralized, extensible event routing service that complements Function triggers, enabling high scalability and broad event-source coverage.  |
| Bindings  | Does not have bindings. Uses AWS SDKs within Lambda functions to manually manage interactions with other AWS services.  | Bindings, configured as input or output, enable declarative connections to services, minimizing the need for explicit SDK code. For example, you can configure bindings to read from Blob Storage, write to Azure Cosmos DB, or send emails via SendGrid without manually managing the integrations.  |

### Event triggers & bindings

| AWS Lambda Trigger/Service  | [Azure Functions trigger](/azure/azure-functions/functions-triggers-bindings)  |  Description  |
|---|---|---|
| API Gateway: HTTP requests  | [HTTP Trigger](/azure/azure-functions/functions-bindings-http-webhook-trigger)  | Azure Functions' HTTP Trigger allows you to handle HTTP requests directly, just like API Gateway.  |
| SQS (Simple Queue Service)  | [Azure Queue Storage Trigger](/azure/azure-functions/functions-bindings-storage-queue-trigger) / [Azure Service Bus Trigger](/azure/azure-functions/functions-bindings-service-bus-trigger) | Azure Queue Storage or Service Bus Trigger can process messages in queues, similar to SQS.  |
| SNS (Simple Notification Service)  | [Azure Event Grid Trigger](/azure/azure-functions/functions-bindings-event-grid-trigger) / [Azure Service Bus Topic Trigger](/azure/azure-functions/functions-bindings-service-bus-trigger)  | Event Grid or Service Bus Topic Triggers enable processing of notifications like SNS topics.  |
| Kinesis (Data Streams)  | [Azure Event Hubs Trigger](/azure/azure-functions/functions-bindings-event-hubs-trigger)  | Event Hubs Trigger is the Azure equivalent for consuming data streams, similar to Kinesis.  |
| DynamoDB (Table Changes)  | [Azure Cosmos DB Change Feed Trigger](/azure/azure-functions/functions-bindings-cosmosdb-v2-trigger)  | Cosmos DB Change Feed Trigger listens for changes in Azure Cosmos DB tables, akin to DynamoDB.  |
| CloudWatch Events/ EventBridge Scheduler  | [Timer Trigger](/azure/azure-functions/functions-bindings-timer)  | Timer Trigger in Azure Functions handles scheduled or time-based triggers like CloudWatch Events.  |
| S3 (Object Events)  | [Azure Blob Storage Trigger](/azure/azure-functions/functions-bindings-storage-blob-trigger)  | Blob Storage Trigger reacts to events in Blob storage, like S3 object events.  |
| Amazon RDS (Relational Database Service)  | [Azure SQL Trigger](/azure/azure-functions/functions-bindings-azure-sql-trigger)  | SQL Trigger reacts to database changes in SQL Database, like RDS database events.  |
|  MSK (Managed Streaming for Apache Kafka)  | [Apache Kafka Trigger](/azure/azure-functions/functions-bindings-kafka-trigger)  | AWS Kafka Trigger reacts to Kafka topic messages, like MSK Kafka topic messages.  |
| Amazon ElastiCache  | [Azure Redis Trigger](/azure/azure-functions/functions-bindings-cache)  | Azure Redis Trigger reacts to messages in Redis, offering similar functionality to Elasticache (Redis).  |
| Amazon MQ  | [RabbitMQ trigger](/azure/azure-functions/functions-bindings-rabbitmq-trigger)  | Azure RabbitMQ Trigger reacts to messages in RabbitMQ, like Amazon MQ (RabbitMQ) messages.  |

### Permissions

| AWS Lambda feature  | Azure Functions feature   |
|---|---|
| Lambda execution role - grants Lambda functions permissions to interact with other AWS services. Each Lambda function has an associated IAM role that determines the permissions the function has during execution.  | Managed Identities - Provides an identity for your Azure Function app, allowing it to authenticate with other Azure services without storing credentials in the code. Role-Based Access Control (RBAC) is used to assign appropriate roles to the managed identity in Azure Active Directory (Azure AD) to grant access to the required resources.  |
| Resource based policy statements:   AWSLambda_FullAccess (Full access to all Lambda operations, including creating, updating, and deleting functions)  AWSLambda_ReadOnlyAccess(Read-only access to view Lambda functions and their configurations) or Custom IAM Policies  | Resource based built-in roles:  Owner role (Full access including managing access permissions)  Contributor role (Can manage everything except access, like creating and deleting function apps, configuring settings, and deploying code)  Monitoring reader role (grant read-only access to monitoring data and settings).  Can also allocate custom roles.  |

### Function URL 

| AWS Lambda feature  | Azure Functions feature   |
|---|---|
| `https://<url-id>.lambda-url.<region>.on.aws`  | - `<appname>.azurewebsites.net` (original, global default hostname) </br> - `<appname>-<randomhash>.<Region>.azurewebsites.net` (new, unique default hostname)  |

### Networking 

| AWS Lambda feature  | Azure Functions feature   |
|---|---|
| All Lambda functions run securely inside a default system-managed virtual private cloud (VPC). You can also configure your Lambda function to access resources in a custom VPC.  |    Function apps can be network secured and can access other services inside the network. Inbound Network access: Inbound access can be restricted to only a firewall list of IP addresses, and to a specific virtual network via service endpoints or private endpoints.  Outbound Network access: This is enabled through the VNet integration feature. Function App can have all its traffic restricted to a virtual network’s subnet, and can also access other services inside that virtual network.  |

### Observability & Monitoring 

| AWS Lambda feature  | Azure Functions feature   |
|---|---|
| Amazon CloudWatch helps with monitoring and observability by collecting and tracking metrics, aggregating and analyzing logs, setting alarms, creating custom dashboards, and implementing automated responses to changes in resource performance and metrics.  | Azure Monitor, the equivalent of CloudWatch, provides comprehensive monitoring and observability for Azure Functions, particularly through its Application Insights feature. Application Insights collects telemetry data such as request rates, response times, and failure rates, visualizes application component relationships, monitors real-time performance, logs detailed diagnostics, and allows custom metric tracking. These capabilities help maintain the performance, availability, and reliability of Azure Functions, while enabling custom dashboards, alerts, and automated responses.  |
| AWS Lambda generates telemetry data from your function executions and can export this data using OpenTelemetry semantics. You can configure your Lambda functions to send this telemetry data to any OpenTelemetry-compliant endpoint, allowing for correlation of traces and logs, consistent standards-based telemetry data, and integration with other observability tools that support OpenTelemetry.  | OpenTelemetry Support - Configure your Azure Functions app to export log and trace data in an OpenTelemetry format. You can choose to export telemetry data using OpenTelemetry to any compliant endpoint. Enabling OpenTelemetry provides benefits such as correlation of traces and logs, consistent standards-based telemetry data, and integration with other providers. OpenTelemetry can be enabled at the function app level in the host configuration and in your code project, offering an optimized experience for exporting data from your function code.  [Learn more](/azure/azure-functions/opentelemetry-howto)  |

### Scaling and Concurrency 

| AWS Lambda feature  |  Azure Functions feature   |
|---|---|
| On demand scaling model - Automatically scale your function execution in response to demand. Concurrency (number of requests handled by an instance) is always 1  | Instances are dynamically added and removed based on the number of incoming events and configured concurrency per instance. [Concurrency setting](/azure/azure-functions/flex-consumption-how-to#set-http-concurrency-limits) is configurable to your desired value.      |
| Concurrency is always 1.  | Concurrency is configurable (>1)     |
| Supports scaling to 0  | Supports scaling to 0  |

### Cold Start protection  

 | AWS Lambda feature  | Azure Functions feature   |
|---|---|
| Provisioned concurrency - reduce latency and ensure predictable function performance by pre-initializing a requested number of function instances    Provisioned concurrency is useful for latency-sensitive applications and is priced separately from standard concurrency.    | Function apps allow for the configuration of concurrency per instance, which drives its scale. This means that multiple executions can happen in parallel in the same instance of the app and those subsequent executions in the instance do not incur the initial cold start.    Function Apps also has Always Ready instances – customers can specify number of pre-warmed instances to eliminate cold start latency and ensure consistent performance. Function App also scales out to additional instances based on demand, while maintaining the Always Ready instances.     |
| Reserved concurrency - specifies the maximum number of concurrent instances a function can have, ensuring that a portion of your account's concurrency quota is set aside exclusively for that function. AWS Lambda dynamically scales out to handle incoming requests even when reserved concurrency is set, as long as the requests do not exceed the specified reserved concurrency limit. The lower limit for reserved concurrency in AWS Lambda is 1. The upper limit for reserved concurrency in AWS Lambda is determined by the account's regional concurrency quota. By default, this limit is 1,000 concurrent executions per region.  |  Azure Functions does not have an equivalent feature to reserved concurrency in AWS Lambda. To achieve similar functionality, isolate specific functions into separate function apps and set the maximum scale-out limit for each app. Azure Functions dynamically scale out (add more instances) and scale in (remove instances) within the scale-out limit set. By default, apps running in a Flex Consumption plan start with a configurable limit of 100 overall instances. The lowest maximum instance count value is 40, and the highest supported maximum instance count value is 1000.  [Regional subscription memory quotas](/azure/azure-functions/flex-consumption-plan#regional-subscription-memory-quotas) can also limit the scale out of function apps but this quota can be increased via a support call.  |

### Pricing 

| AWS Lambda feature  | Azure Functions feature   |
|---|---|
| Pay per use for total execution count, and for GB/s for each instance (with fixed concurrency of 1)  1ms increments  400K Gb/s free tier    | .Pay per use for total execution count, and for GB/s of each instance (with configurable concurrent executions)  100ms increments  100K Gb/s free tier  [Read more](/azure/azure-functions/functions-consumption-costs#consumption-based-costs)  |
 
### Source Code Storage 

| AWS Lambda feature  | Azure Functions feature   |
|---|---|
| AWS Lambda manages the storage of your function code in its own managed storage system without requiring users to supply additional storage.  | Requires a customer-supplied Blob Storage container to maintain the deployment package containing your app's code. You can configure settings for using the same or a different storage account for deployments and manage authentication methods for accessing the container.  |
 
### Local development 

| AWS Lambda feature  | Azure Functions feature   |
|---|---|
| SAM CLI, [LocalStack](https://github.com/localstack/localstack)  | Azure Functions Core Tools, Visual Studio Code, Visual Studio, GitHub Codespaces, VSCode.dev, Maven  [Learn More](/azure/azure-functions/functions-develop-local)  |
 
### Deployment 

| Concept  | AWS Lambda feature  | Azure Functions feature  |
|---|---|---|
| Deployment package  | ZIP file, container image  | ZIP file    *For container image deployment, use the dedicated or premium SKU  |
| ZIP File Size (Console)  | Max 50 MB  | Max 500 MB (ZIP Deployment)  |
| ZIP File Size (CLI/SDK)    | Max 250 MB (unzipped up to 500 MB)  | Max 500 MB (ZIP Deployment)  |
| Container Image Size  | Max 10 GB  | Container support with flexible storage via Azure  |
| Large Artifact Handling  | Use container images for larger deployments  | Attach Azure Blob Storage or Azure File shares to access large files from the app  |
| Packaging common dependencies to functions  | Layers  |  Deployment .Zip, on demand from storage, or containers *(ACA, dedicated, EP SKUs only)  |
| Blue green deployment/Function versioning  | Function Qualifiers allow you to reference a specific state of your function using either a version number or an alias name, enabling version management and gradual deployment strategies.  |   Use CI-CD systems for blue-green deployment.  |
 
### Timeout and memory limits 

| Concept   | AWS Lambda limits  | Azure Functions limits   |
|---|---|---|
| Execution timeout  | 900 seconds (15 minutes)  | Default Timeout: 30 minutes.  Maximum Timeout: Unbounded. However, the grace period given to a function execution is 60 minutes during scale-in and 10 minutes during platform updates. [Learn more](/azure/azure-functions/functions-scale#timeout)  |
| Configurable memory  | 128 MB to 10,240 MB, in 64 MB increments  |  Functions supports [2GB and 4GB](/azure/azure-functions/functions-scale#service-limits) instance sizes. Each region in a given subscription has a memory limit of 512,000 MB for all instances of apps, which can be raised with a support call. The total memory usage of all instances across all function apps in a region must stay within this quota. While 2GB and 4GB are the options for instance sizes right now, it's important to note that the concurrency per instance can be higher than 1. This means that a single instance can handle multiple concurrent executions, depending on the configuration. Configuring concurrency appropriately can help optimize resource utilization and manage performance. By balancing memory allocation and concurrency settings, you can effectively manage the resources allocated to your function apps, ensuring efficient performance and cost control. [Learn more](/azure/azure-functions/flex-consumption-plan#regional-subscription-memory-quotas)  |
 
### Secret Management 

| AWS Lambda feature  | Azure Functions feature   |
|---|---|
| AWS Secrets Manager allows you to store, manage, and retrieve secrets such as database credentials, API keys, and other sensitive information. Lambda functions can retrieve secrets using the AWS SDK.  |   Azure Functions recommends using secretless approaches like Managed Identities, enabling secure access to Azure resources without hardcoding credentials. When secrets are required—such as for third-party or legacy systems—Azure Key Vault provides a secure solution to store and manage secrets, keys, and certificates.  |
| AWS Systems Manager Parameter Store: A service for storing configuration data and secrets. Parameters can be encrypted using AWS KMS and retrieved by Lambda functions using the AWS SDK.    Environment Variables: Lambda functions can store configuration settings in environment variables. Sensitive data can be encrypted with a KMS key for secure access.    | Environment Variables and Application Settings: Azure Functions use application settings to store configuration data, which are directly mapped to environment variables for ease of use within the function. These settings can be encrypted and securely stored in the Azure App Service configuration.    Azure App Configuration (optional): For more advanced scenarios, Azure App Configuration provides robust features for managing multiple configurations, enabling feature flagging, and supporting dynamic updates across services.    |

### State management 

| AWS Lambda feature  | Azure Functions feature  |
|---|---|
| AWS Lambda handles simple state management by leveraging services like Amazon S3 for object storage, DynamoDB for fast and scalable NoSQL state storage, and SQS for message queue handling. These services ensure data persistence and consistency across Lambda function executions.  | Azure Functions uses AzureWebJobsStorage to manage state by enabling bindings and triggers with Azure Storage services like Blob, Queue, and Table Storage, allowing functions to easily read and write state. For more complex state management, Durable Functions provide advanced workflow orchestration and state persistence capabilities, leveraging Azure Storage.  |
 
### Stateful Orchestration 

| AWS Lambda feature  | Azure Functions feature   |
|---|---|
| No native state orchestration; use AWS Step Functions for workflows  | Durable Functions help with complex state management by providing durable workflow orchestration and stateful entities, allowing for long-running operations, automatic checkpointing, and reliable state persistence. These features enable building intricate workflows, ensuring fault tolerance, and scalability for stateful applications.  |

### Other differences/considerations 

| Concept  | AWS Lambda feature  | Azure Functions feature  |
|---|---|---|
| Grouping Functions  | Each AWS Lambda function is an independent entity.  | A Function App acts as a container for multiple functions. It provides a shared execution context and configuration for the functions it contains.     This simplifies the deployment and management of functions by handling them as a single entity.    Functions also has the concept of per-function scaling strategy, where each function is scaled independently, except for HTTP, Blob, and Durable Functions triggered functions which scale in their own groups.  |
| Custom Domains  | Enabled via API Gateway  | [Can be configured directly on Function App or on APIM](/azure/app-service/app-service-web-tutorial-custom-domain)   |
| Custom Container Support   | Supports custom containers via Lambda Container Image  | [Supports custom containers via Azure Functions running in Azure Container Apps](/azure/azure-functions/functions-how-to-custom-container)   |
 

## Create a Migration Plan

- Select Key Workloads for Proof of Concept
   - Start by selecting 1-2 medium-sized, non-critical workloads from your total inventory. These will serve as the foundation for your proof-of-concept migration. This allows you to test the process and identify potential challenges without risking major disruption to your operations.

- Iterative Testing and Feedback
   - Use the proof of concept to gather feedback, identify gaps, and fine-tune the process before scaling to larger workloads. This iterative approach ensures that by the time you move to full-scale migration, you have addressed potential challenges and refined the process. 

By the end of this stage, you will have mapped AWS Lambda features and services to their Azure Functions equivalents, selected key workloads for a proof of concept. This detailed mapping and migration plan will serve as the foundation for the next stage, where you will execute the migration.

## Next step

> [!div class="nextstepaction"]
> [Migrate stage](aws-lambda-azure-functions-migration-migrate.md)