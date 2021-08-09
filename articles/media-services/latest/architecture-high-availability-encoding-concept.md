---
title: High Availability with Media Services Video on Demand
description: This article is an overview of the Azure services you can use to facilitate high availability for the VOD application.
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''
ms.service: media-services
ms.subservice: 
ms.workload: 
ms.topic: conceptual
ms.custom: 
ms.date: 08/31/2020
ms.author: inhenkel
---

# High Availability with Media Services and Video on Demand (VOD)

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

## High availability for VOD

There is a high availability design pattern called [Geodes](/azure/architecture/patterns/geodes) in the Azure Architecture documentation. It describes how duplicate resources are deployed to different geographic regions to provide scalability and resiliency.  You can use Azure services to create such an architecture to cover many high availability design considerations such as redundancy, health monitoring, load balancing, and data backup and recovery.  One such architecture is described below with details on each service used in the solution as well as how the individual services can be used to create a high availability architecture for your VOD application.

### Sample

There is a sample available for you to use to become familiar with high availability with Media Services and Video on Demand (VOD). It also goes into more detail about how the services are used for a VOD scenario.  The sample is not intended to be used in production in its current form.  Carefully review the sample code and the readme, particularly the section on [Failure Modes](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/master/HighAvailabilityEncodingStreaming) before integrating it into a production application.  A production implementation of high availability for Video on Demand (VOD) should also carefully review their Content Delivery Network (CDN) strategy.  Check out the [code on GitHub](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/master/HighAvailabilityEncodingStreaming).

## Overview of services

The services used in this example architecture include:

| Icon | Name | Description |
| :--: | ---- | ----------- |
|![This is the Media services account icon.](./media/architecture-high-availability-encoding-concept/azure-media-services.svg)| Media services account | **Description:**<br>A Media Services account is the starting point for managing, encrypting, encoding, analyzing, and streaming media content in Azure. It is associated with an Azure Storage account resource. The account and all associated storage must be in the same Azure subscription.<br><br>**VOD use:**<br>These are the services you use to encode and deliver your video and audio assets.  For high availability, you would set up at least two Media Services accounts, each in a different region. [Learn more about Azure Media Services](media-services-overview.md). |
|![This is the Storage account icon.](./media/architecture-high-availability-encoding-concept/storage-account.svg)| Storage account | **Description:**<br>An Azure storage account contains all your Azure Storage data objects: blobs, files, queues, tables, and disks. Data is accessible from anywhere in the world over HTTP or HTTPS.<br><br>Each Media Services account, in each region would have a storage account in the same region.<br><br>**VOD use:**<br>You can store input and output data for VOD processing and streaming. [Learn more about Azure Storage](../../storage/common/storage-introduction.md). |
|![This is the Azure Storage Queue icon.](./media/architecture-high-availability-encoding-concept/storage-account-queue.svg)| Azure Storage Queue | **Description:**<br>Azure Queue storage is a service for storing large numbers of messages that can be accessed from anywhere in the world via authenticated calls using HTTP or HTTPS.<br><br>**VOD use:**<br>Queues can be used to send and receive messages to coordinate activities among different modules. The sample uses an Azure Storage Queue but Azure provides other types of queues such as Service Bus and Service Fabric Reliable Queues which may better fit your needs. [Learn more about Azure Queue](../../storage/queues/storage-queues-introduction.md). |
|![This is the Azure Cosmos DB icon.](./media/architecture-high-availability-encoding-concept/azure-cosmos-db.svg)| Azure Cosmos DB  | **Description:**<br>Azure Cosmos DB is Microsoft's globally distributed, multi-model database service that independently scales throughput and storage across any number of Azure regions worldwide.<br><br>**VOD use:**<br>Tables can be used to store job output status records and to track health state of each Media Services instance. You can also track/record the status of each call to the Media Services API. [Learn more about Azure Cosmos DB](../../cosmos-db/introduction.md).  |
|![This is the Managed identity icon.](./media/architecture-high-availability-encoding-concept/managed-identity.svg)| Managed Identity | **Description:**<br>Managed identity is a feature of Azure AD that provides an automatically managed identity in Azure AD. It can be used to authenticate to any service that supports Azure AD authentication, including Key Vault, without storing credentials in code.<br><br>**VOD use:**<br>Azure Functions can use Managed Identity to authenticate to Media Services instances to connect to Key Vault. [Learn more about Managed Identity](../../active-directory/managed-identities-azure-resources/overview.md). |
|![This is the Key Vault icon.](./media/architecture-high-availability-encoding-concept/key-vault.svg)| Key Vault | **Description:**<br>Azure Key Vault can be used to securely store and tightly control access to tokens, passwords, certificates, API keys, and other secrets. It can also be used as a Key Management solution. Azure Key Vault makes it easy to create and control the encryption keys used to encrypt your data. It can easily provision, manage, and deploy public and private Transport Layer Security/Secure Sockets Layer (TLS/SSL) certificates for use with Azure and internal connected resources. Secrets and keys can be protected either by software or FIPS 140-2 Level 2 validated HSMs.<br><br>**VOD use:**<br>Key Vault can be used to set up access policies for the service principal for your application.  It can be used to store the connection string to storage accounts. We use Key Vault to store connection strings to storage accounts and cosmos db. You can also use Key Vault to store overall cluster configuration. For each Media Service Instance you can store subscription ID, resource group name and account name. For more details, see how it is used in the sample. [Learn more about Key Vault](../../key-vault/general/overview.md). |
|![This is the Azure Functions icon.](./media/architecture-high-availability-encoding-concept/function-app.svg)| Azure Functions | **Description:**<br>Run small pieces of code (called "functions") without worrying about application infrastructure with Azure Functions. [Learn more about Azure Functions](../../azure-functions/functions-overview.md).<br><br>**VOD use:**<br>Azure Functions can be used to store host the modules of your VOD application.  Modules for a VOD application could include:<br><br>**Job Scheduling Module**<br>The job scheduling module would be for submitting new jobs to a Media Services cluster (two or more instances in different regions). It would track the health status of each Media Services instance and would submit a new job to the next healthy instance.<br><br>**Job Status Module**<br>The job status module would be listening to job output status events coming from Azure Event Grid service. It would store events to event store to minimize the number of calls to Media Services APIs by rest of the modules.<br><br>**Instance Health Module**<br>This module would track submitted jobs and determine the health status for each Media Services instance. It would track finished jobs, failed jobs and jobs that never finished.<br><br>**Provisioning Module**<br>This module would provision processed assets. It would copy asset data to all Media Services instances and set up Azure Front Door service to ensure that assets could be streamed even if some Media Services instances weren’t available. It would also set up streaming locators.<br><br>**Job Verification Module**<br>This module would track each submitted job, resubmit failed jobs and perform job data clean up once a job is successfully finished.  |
|![This is the App Service icon.](./media/architecture-high-availability-encoding-concept/application-service.svg)| App Service (and plan)  | **Description:**<br>Azure App Service is an HTTP-based service for hosting web applications, REST APIs, and mobile back ends. It supports .NET, .NET Core, Java, Ruby, Node.js, PHP, or Python. Applications run and scale on both Windows and Linux-based environments.<br><br>**VOD use:**<br>Each module would be hosted by an App Service. [Learn more about App Service](../../app-service/overview.md). |
|![This is the Azure Front Door icon.](./media/architecture-high-availability-encoding-concept/azure-front-door.svg)| Azure Front Door | **Description:**<br>Azure Front Door is used to define, manage, and monitor the global routing of web traffic by optimizing for best performance and quick global failover for high availability.<br><br>**VOD use:**<br>Azure Front Door could be used to route traffic to streaming endpoints. [Learn more about Azure Front Door](../../frontdoor/front-door-overview.md).  |
|![This is the Azure Event Grid icon.](./media/architecture-high-availability-encoding-concept/event-grid-subscription.svg)| Azure Event Grid | **Description:**<br>Created for event-based architectures, Event Grid has built-in support for events coming from Azure services, like storage blobs and resource groups. It also has support for custom topic events. Filters can be used to route specific events to different endpoints, multicast to multiple endpoints, and to make sure events are reliably delivered. It maximizes availability by natively spreading across multiple fault domains in every region, and across availability zones.<br><br>**VOD use:**<br>Event Grid can be used to track all application events and store them to persist job status. [Learn more about Azure Event Grid](../../event-grid/overview.md). |
|![This is the Application Insights icon.](./media/architecture-high-availability-encoding-concept/application-insights.svg)| Application Insights | **Description:** <br>Application Insights, a feature of Azure Monitor, is an extensible Application Performance Management (APM) service for developers and DevOps professionals. It is used to monitor live applications. It detects performance anomalies, and includes analytics tools to diagnose issues and to understand what users do with an app. It's designed to help you continuously improve performance and usability.<br><br>**VOD use:**<br>All logs can be sent to Application Insights. It would be possible to see what instance processed each job by searching for successfully created job messages. It could contain all submitted job metadata including the unique identifier and instance name information. [Learn more about Application Insights](../../azure-monitor/app/app-insights-overview.md). |
## Architecture

This high-level diagram shows the architecture of the sample provided to get you started with high availability and media services.

[ ![Video on Demand (VOD) High Level Architecture Diagram](media/architecture-high-availability-encoding-concept/high-availability-architecture.svg) ](./media/architecture-high-availability-encoding-concept/high-availability-architecture.svg#lightbox)

## Best practices

### Regions

* [Create](./account-create-how-to.md) two (or more) Azure Media Services accounts. The two accounts need to be in different regions. For more information, see [Regions in which the Azure Media Services service is deployed](https://azure.microsoft.com/global-infrastructure/services/?products=media-services).
* Upload your media to the same region from which you are planning to submit the job. For more information about how to start encoding, see [Create a job input from an HTTPS URL](./job-input-from-http-how-to.md) or [Create a job input from a local file](./job-input-from-local-file-how-to.md).
* If you then need to resubmit the [job](./transform-jobs-concept.md) to another region, you can use `JobInputHttp` or use `Copy-Blob` to copy the data from the source Asset container to an Asset container in the alternate region.

### Monitoring

* Subscribe for `JobStateChange` messages in each account via Azure Event Grid.
    * [Register for events](./reacting-to-media-services-events.md) via the Azure portal or the CLI (you can also do it with the Event Grid Management SDK)
    * Use the [Microsoft.Azure.EventGrid SDK](https://www.nuget.org/packages/Microsoft.Azure.EventGrid/) (which supports Media Services events natively).
    * You can also consume Event Grid events via Azure Functions.

    For more information:

    * See the [Audio Analytics sample](./transform-jobs-concept.md) which shows how to monitor a job with Azure Event Grid including adding a fallback in case the Azure Event Grid messages are delayed for some reason.
    * Take a look at the [Azure Event Grid schemas for Media Services events](./media-services-event-schemas.md).

* When you create a [job](./transform-jobs-concept.md):
    * Randomly select an account from the list of currently used accounts (this list will normally contain both accounts but if issues are detected it may contain only one account). If the list is empty, raise an alert so an operator can investigate.
    * Create a record to keep track of each inflight job and the region/account used.
* When your `JobStateChange` handler gets a notification that a job has reached the scheduled state, record the time it enters the scheduled state and the region/account used.
* When your `JobStateChange` handler gets a notification that a job has reached the processing state, mark the record for the job as processing and record the time it enters the processing state.
* When your `JobStateChange` handler gets a notification that a job has reached a final state (Finished/Errored/Canceled), mark the record for the job appropriately.
* Have a separate process that periodically looks at your records of the jobs
    * If you have jobs in the scheduled state that haven't advanced to the processing state in a reasonable amount of time for a given region, remove that region from your list of currently used accounts. Depending on your business requirements, you could decide to cancel those jobs right away and resubmit them to the other region. Or, you could give them some more time to move to the next state.
    * If a region was removed from the account list, monitor it for recovery before adding it back to the list. The regional health can be monitored via the existing jobs on the region (if they weren't canceled and resubmitted), by adding the account back to the list after a period of time, and by operators monitoring Azure communications about outages that may be affecting Azure Media Services.

## Next steps

* Check out [code samples](/samples/browse/?products=azure-media-services)