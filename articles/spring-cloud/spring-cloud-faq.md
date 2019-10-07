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
Azure Spring Cloud is a Platform as a Service (PaaS) for Spring developers. Our goal is to automatically and easily manage infrastructural issues so that developers can focus on their application code and business logic. We have several features built into Azure Spring Cloud, including Eureka, Config Server, Pivotal Build Service, Blue-Green deployments, and more. This service also enables developers to bind their applications with Azure services such as CosmosDB, MySQL, Azure Cache for Redis, and more.

With Azure Spring Cloud, the application diagnostics experience for the developers and operators is also enhanced by integrating Azure Monitor, Application Insights, and Log Analytics.


### What service plans does Azure Spring Cloud offer?
Azure Spring Cloud is free right now.

Resource | Amount
------- | -------
vCPU | 4
Memory | 8 GBytes
App instances per Spring application | 20
Total app instances per Azure Spring Cloud service instance | 50*
Azure Spring Cloud service instances per region per subscription | 2*
Persistent volumes | 10 x 50 GBytes

*_Open a [support ticket](https://azure.microsoft.com/support/faq/) to raise the limit._

For more details, please refer to [Azure Support FAQs](https://azure.microsoft.com/support/faq/).

### How secure is Azure Spring Cloud?
Azure Spring Cloud is secured, all application and configuration data are stored under the EU General Data Protection Regulation (GDPR).

Security and privacy are one of the top priorities for Azure and Azure Spring Cloud customers. Microsoft has no access to application data, logs, or configurations as they are encrypted in Azure. All the service instances in Azure Spring Cloud are isolated from each other.

Azure Spring Cloud provides complete solution of SSL and certificate management.

Critical security patches for OpenJDK and Spring Cloud runtimes are applied to Azure Spring Cloud as soon as possible.

### Which regions Azure Spring Cloud are available?
East US, West US 2, West Europe, and Southeast Asia.

### What are the known limitations right now?
- `spring.application.name` will be overridden by the application name used to create each application.
- `server.port` is not allowed in configuration file from Git repo. Adding it to the configuration file will likely to cause your application not reachable from other applications or internet.
- The Azure portal and ARM templates do not support uploading application packages. This can only be done via application deployment by Azure CLI.
- For quota limitations, refer to [What service plans does Azure Spring Cloud offer](#what-service-plans-does-azure-spring-cloud-offer).

### How can I provide feedback and report issues?
If you have created your Spring service instances in Azure Spring Cloud, you can create an [Azure Support Request](https://docs.microsoft.com/azure/azure-supportability/how-to-create-azure-support-request). If you have not yet onboarded to Azure Spring Cloud, you can go to [Azure Feedback](https://feedback.azure.com/) to request features or provide feedback.

## Development
### I am a Spring developer but new to Azure, what is the quickest way for me to learn developing Azure Spring Cloud applications?
Regardless of to create a new application or to migrate an existing one to Azure Spring Cloud, we suggest you to firstly go through [Getting-Started guide of Azure Spring Cloud](spring-cloud-quickstart-launch-app-portal.md).

### What Java runtime does Azure Spring Cloud support?
Azure Spring Cloud officially supports Java 8 and 11.

### Where can I see my Spring application logs and metrics?
The metrics can be found at App Overview tab and [Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/data-platform-metrics#interacting-with-azure-monitor-metrics) tab.

Azure Spring Cloud supports exporting your Spring application logs and metrics to Azure Storage, EventHub, and [Log Analytics](https://docs.microsoft.com/azure/azure-monitor/platform/data-platform-logs#log-queries). The table name in Log Analytics is `AppPlatformLogsforSpring`. To enable it, go through [Diagnostic settings Guide](spring-cloud-tutorial-diagnostics.md).

### Does Azure Spring Cloud support distributed tracing?
Yes, visit [Distributed Tracing](spring-cloud-tutorial-distributed-tracing.md) for more details.

### What resource types does Service Binding support?
Three services are currently supported: Azure Cosmos DB, Azure Database for MySQL and Azure Cache for Redis.

### Can I view/add/move persistent volumes from inside of my applications?
Yes.

## Deployment
### Does Azure Spring Cloud support Blue-green deployment?
Yes, please visit [staging environment guide](spring-cloud-howto-staging-environment.md) for more details.

### Can I access Kubernetes to manipulate my application containers?
No.

### Does Azure Spring Cloud support building containers from the source?
Yes, please visit [Deploy from source](spring-cloud-launch-from-source.md) for more details.

### Does Azure Spring Cloud support autoscaling in app instances?
No.

### What are the best practices for migrating existing Spring microservices to Azure Spring Cloud?
Before migrating existing Spring microservices to Azure Spring Cloud,
- You need to have the knowledge of minimum requirement for starting them.
- You need to have the configuration entries, environment variables and JVM parameters ready so you can compare them with the deployment in Azure Spring Cloud later.
- If you want to use Service Binding, go through your Azure services to be bound. Your applications need to have proper privileges to access them.
- We recommend you remove or disable embedded services that might conflict with services managed by Azure Spring Cloud such as Eureka, Config Server, etc.
- We recommend you use official and stable Pivotal Spring libraries. Unofficial, beta, or forked versions of Pivotal Spring libraries have no SLA supports.

After the migration, monitor CPU/RAM metrics and network traffics to make sure the app instances have a right scale.

## Next steps

[Check out the troubleshooting guide if you have more questions](spring-cloud-troubleshooting.md).