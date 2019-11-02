---
title: Frequently asked questions for Azure Spring Cloud | Microsoft Docs
description: Review the FAQ for Azure Spring Cloud
services: spring-cloud
author: v-vasuke
manager: jeconnoc
editor: ''

ms.service: spring-cloud
ms.topic: quickstart
ms.date: 10/07/2019
ms.author: v-vasuke

---

# Frequently Asked Questions

This article addresses frequent questions about Azure Spring Cloud. 

## General

### Why Azure Spring Cloud?

Azure Spring Cloud provides a Platform as a Service (PaaS) for Spring developers. Azure Spring Cloud manages your application infrastructure so you can focus on application code and business logic. Core features built into Azure Spring Cloud, include Eureka, Config Server, Service Registry Server, Pivotal Build Service, Blue-Green deployments, and more. This service also enables developers to bind their applications with Azure services such as CosmosDB, MySQL, and Azure Cache for Redis.

Azure Spring Cloud enhances the application diagnostics experience for the developers and operators by integrating Azure Monitor, Application Insights, and Log Analytics.

### What service plans does Azure Spring Cloud offer?

Azure Spring Cloud offers one service plan during the preview period.  A Spring Cloud deployment contains 16 vCPU cores and 32GB of memory.  The upper bound for each microservice instance within a deployment is 4 vCPU cores with 8GB of memory.

Resource | Amount
------- | -------
App instances per Spring application | 20
Total app instances per Azure Spring Cloud service instance | 50*
Azure Spring Cloud service instances per region per subscription | 2*
Persistent volumes | 10 x 50 GBytes

*_Open a [support ticket](https://azure.microsoft.com/support/faq/) to raise the limit._

For more details, please refer to [Azure Support FAQs](https://azure.microsoft.com/support/faq/).

### How secure is Azure Spring Cloud?

Security and privacy are one of the top priorities for Azure and Azure Spring Cloud customers. Azure ensures that only the customer has access to application data, logs, or configurations by securely encrypting all of this data. All the service instances in Azure Spring Cloud are isolated from each other.

Azure Spring Cloud provides complete SSL and certificate management.

Critical security patches for OpenJDK and Spring Cloud runtimes are applied to Azure Spring Cloud as soon as possible.

### Which regions Azure Spring Cloud are available?

East US, West US 2, West Europe, and Southeast Asia.

### What are the known limitations of Azure Spring Cloud

Here are the known limitations of Azure Spring Cloud while the service is in preview.

* `spring.application.name` will be overridden by the application name used to create each application.
* `server.port` is not allowed in configuration file from Git repo. Adding it to the configuration file will likely to cause your application not reachable from other applications or internet.
* The Azure portal and Resource Manager templates do not support uploading application packages. This can only be done via application deployment by Azure CLI.
* For quota limitations, refer to [What service plans does Azure Spring Cloud offer](#what-service-plans-does-azure-spring-cloud-offer).

### How can I provide feedback and report issues?

If you encounter any issues with Azure Spring Cloud, please create an [Azure Support Request](https://docs.microsoft.com/azure/azure-supportability/how-to-create-azure-support-request). For feature requests, please go to  [Azure Feedback](https://feedback.azure.com/forums/34192--general-feedback) to request features or to provide feedback.

## Development

### I am a Spring developer but new to Azure, what is the quickest way for me to learn how to develop aAzure Spring Cloud application?

The quickest way to get started with Azure Spring Cloud is to follow [this quickstart](spring-cloud-quickstart-launch-app-portal.md).

### What Java runtime does Azure Spring Cloud support?

Azure Spring Cloud supports Java 8 and 11.

### Where can I see my Spring application logs and metrics?

Find metrics in the App Overview tab and the [Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/data-platform-metrics#interacting-with-azure-monitor-metrics) tab.

Azure Spring Cloud supports exporting your Spring application logs and metrics to Azure Storage, EventHub, and [Log Analytics](https://docs.microsoft.com/azure/azure-monitor/platform/data-platform-logs#log-queries). The table name in Log Analytics is `AppPlatformLogsforSpring`. To enable it, review this article about our [Diagnostic services](diagnostic-services.md).

### Does Azure Spring Cloud support distributed tracing?

Yes, visit [Distributed Tracing](spring-cloud-tutorial-distributed-tracing.md) for more details.

### What resource types does Service Binding support?

Three services are currently supported: Azure Cosmos DB, Azure Database for MySQL and Azure Cache for Redis.

### Can I view/add/move persistent volumes from inside my applications?
Yes.

## Deployment

### Does Azure Spring Cloud support Blue-green deployment?
Yes, visit the [staging environment guide](spring-cloud-howto-staging-environment.md) for more details.

### Can I access Kubernetes to manipulate my application containers?

No.  Azure Spring Cloud abstracts the developer from the underlying architecture, allowing you to concentrate on application code and business logic.

### Does Azure Spring Cloud support building containers from source?

Yes, visit [Deploy from source](spring-cloud-launch-from-source.md) for more details.

### Does Azure Spring Cloud support autoscaling in app instances?

No.

### What are the best practices for migrating existing Spring microservices to Azure Spring Cloud?

Before migrating existing Spring microservices to Azure Spring Cloud,
* All application dependencies need to be resolved.
* Prepare your configuration entries, environment variables, and JVM parameters so you can compare them with the deployment in Azure Spring Cloud.
* If you want to use Service Binding, go through your Azure services and ensure that you have set appropriate access permissions.
* We recommend you remove or disable embedded services that might conflict with services managed by Azure Spring Cloud such as our Service Discovery service, Config Server, etc..
*-* We recommend you use official and stable Pivotal Spring libraries. Unofficial, beta, or forked versions of Pivotal Spring libraries have no SLA support.

After the migration, monitor CPU/RAM metrics and network traffic to ensure the application instances are scaled appropriately.

## Next steps

[Check out the troubleshooting guide if you have more questions](spring-cloud-troubleshoot.md).