---
title: Frequently Asked Questions for Azure Spring Cloud | Microsoft Docs
description: An FAQ of Azure Spring Cloud, which automates many aspects of deploying Java microservice applications made in Spring and provides tools for managing others.
services: spring-cloud
author: v-vasuke
manager: jeconnoc
editor: ''

ms.service: spring-cloud
ms.topic: quickstart
ms.date: 07/17/2019
ms.author: v-vasuke

---

# Frequently Asked Questions

## General
### Why Azure Spring Cloud?
Azure Spring Cloud manages the Spring Cloud infrastructure for Spring developers, including Eureka, Config Server, Pivotal Build Service, built-in Blue-Green deployment and more coming. Azure Spring Cloud is more like a SaaS service, and our goal is to take care of the scaffolding works from the developers as much as possible so they can focus on their business logics and binding them with Azure services, for example, CosmosDB, MySQL, Azure Cache for Redis, etc.

With Azure Spring Cloud, The application diagnostics experience for the developers and operators is also enhanced by leveraging Azure Monitor, Application Insights, and Log Analytics.

Azure Spring Cloud is secured, all application and configuration data are stored under the EU General Data Protection Regulation (GDPR). Please refer to [How secure is Azure Spring Cloud](#how-secure-is-azure-spring-cloud) for more details.

### What service plans does Azure Spring Cloud offer?
First, Azure Spring Cloud is free for private preview.

There is only one service plan for private preview:

Resource | Amount
------- | -------
vCPU | 4
Memory | 8 GBytes
App instances per Spring application | 20
Total app instances per Azure Spring Cloud service instance | 50 (_500 after public preview_) *
Azure Spring Cloud service instances per region per subscription | 2 (_10 after public preview_) *
Persistent volumes | 10 x 50 GBytes

*_Open a [support ticket](https://azure.microsoft.com/support/faq/) to raise the limit._

However we don't have support plan before public preview. For more details, please refer to [Azure Support FAQs](https://azure.microsoft.com/support/faq/).

### How to get access to Azure Spring Cloud?
The private preview is currently under NDA and "Invitation Only", so only select customers will be provided access. To contact us, please submit [Azure Spring Cloud (Private Preview) - Interest Form](https://aka.ms/AzureSpringCloudInterest).

### How secure is Azure Spring Cloud?
Security and privacy are one of the top priorities for Azure and Azure Spring Cloud customers. Microsoft has no access to application data, logs or configurations as they are encrypted in Azure. All the service instances in Azure Spring Cloud are completely isolated to each other.

Azure Spring Cloud provides complete solution of SSL and certificate management.

Critical security patches for OpenJDK and Spring Cloud runtimes are applied to Azure Spring Cloud as soon as they are available.

### Which regions Azure Spring Cloud are available?
In private preview, we only support East US and Western Europe.

### What are the known limitations in private preview?
- `spring.application.name` will be overriden by the application name used to create each application.
- `server.port` is not allowed in configuration file from Git repo. It will likely to cause your application not reachable from other applications or internet.
- Portal and ARM template do not support uploading application packages. This can only be done via application deployment by Az CLI.
- For quota limitations, please refer to [What service plans does Azure Spring Cloud offer](#what-service-plans-does-azure-spring-cloud-offer).

### How can I provide feedback and report issues?
If you have created your Spring service instances in Azure Spring Cloud, you can create an [Azure Support Request](https://docs.microsoft.com/azure/azure-supportability/how-to-create-azure-support-request). If you have not yet onboarded to Azure Spring Cloud, you can go to [Azure Feedback](https://feedback.azure.com/) to request features or provide feedback.

## Developement
### I am a Spring developer but new to Azure, what is the quickest way for me to learn developing Azure Spring Cloud applications?
Regardless of to create a new application or to migrate an existing one to Azure Spring Cloud, we suggest you to firstly go through [Getting-Started guide of Azure Spring Cloud](../README.md). From there you can go to many directions shown in [How-To guide of using Azure Spring Cloud](how-to.md).

### What Java runtime does Azure Spring Cloud support?
Azure Spring Cloud officially support [Azule Zulu OpenJDK](https://www.azul.com/partners/microsoft-azure/), 8 and 11.

### Where can I see my Spring application logs and metrics?
The metrics can be found at [App Overview](metrics.md) blade and [Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/data-platform-metrics#interacting-with-azure-monitor-metrics) blade.

Azure Spring Cloud supports exporting your Spring application logs and metrics to Azure Storage, EventHub, and [Log Analytics](https://docs.microsoft.com/azure/azure-monitor/platform/data-platform-logs#log-queries). The table name in Log Analytics is `AppPlatformLogsforSpring`. To enable it, please go through [Diagnostic settings Guide](diagnostic-settings-guide.md).

### Does Azure Spring Cloud support distributed tracing?
Yes, please visit [Distributed Tracing](distributed-tracing.md) for more details.

### What resource types does Service Binding support?
In private preview, 3 services are supported: Azure Cosmos DB, Azure Database for MySQL and Azure Cache for Redis. Please visit [Service Binding](service-binding.md) for more details.

### Can I view/add/move persistent volumes from inside of my applications?
Yes.

### Does Azure Spring Cloud support Windows Server containers?
No.

## Deployment
### Does Azure Spring Cloud support Blue-green deployment?
Yes, please visit [Blue-green Deployment Guide](blue-green-deployment-guide.md) for more details.

### Can I move/migrate an Azure Spring Cloud resource between resource groups and/or subscriptions?
Yes.

### Can I move/migrate an Azure Spring Cloud resource between tenants?
No.

### Can I access Kubernetes to manipulate my application containers?
No.

### Does Azure Spring Cloud support building containers from the source?
Yes, please visit [Deploy from source](deploy-an-app.md#deploy-from-source) for more details.

### Does Azure Spring Cloud support autoscaling in app instances?
Not yet, but please stay tuned.

### What are the best practices for migrating existing Spring microservices to Azure Spring Cloud?
Before migrating existing Spring microservices to Azure Spring Cloud,
- you need to have the knowledge of minimum requirement for starting them.
- you need to have the configuration entries, environment variables and JVM parameters ready so you can compare them with the deployment in Azure Spring Cloud later.
- if you want to use Service Binding, please go through your Azure services to be bound. Your applications need to have proper privileges to access them.
- it is recommended to remove or disable embedded services that might conflict with services managed by Azure Spring Cloud, for example, Eureka, Config Server, etc.
- it is recommended to use official and stable Pivotal Spring libraries. Unofficial, beta or forked version of Pivotal Spring libraries have no SLA supports.

After the migration, please monitor CPU/RAM metrics and network traffics to make sure the app instances have a right scale.

### Does Azure Spring Cloud support CI and CD?
Not yet, but please stay tuned.

### Can I rename my applications after deployment?
No.
