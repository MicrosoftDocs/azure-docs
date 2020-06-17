---
title: Frequently asked questions about Azure Spring Cloud | Microsoft Docs
description: This article answers frequently asked questions about Azure Spring Cloud.
author: bmitchell287
ms.service: spring-cloud
ms.topic: conceptual
ms.date: 10/07/2019
ms.author: brendm

---

# Azure Spring Cloud FAQ

This article answers frequently asked questions about Azure Spring Cloud.

## General

### Why Azure Spring Cloud?

Azure Spring Cloud provides a platform as a service (PaaS) for Spring Cloud developers. Azure Spring Cloud manages your application infrastructure so that you can focus on application code and business logic. Core features built into Azure Spring Cloud include Eureka, Config Server, Service Registry Server, Pivotal Build Service, Blue-green deployments, and more. This service also enables developers to bind their applications with other Azure services, such as Azure Cosmos DB, Azure Database for MySQL, and Azure Cache for Redis.

Azure Spring Cloud enhances the application diagnostics experience for developers and operators by integrating Azure Monitor, Application Insights, and Log Analytics.

### What service plans does Azure Spring Cloud offer?

Azure Spring Cloud offers one service plan during the preview period.  A Spring Cloud deployment contains 16 vCPU cores and 32 gigabytes (GB) of memory.  The upper bound for each microservice instance within a deployment is 4 vCPU cores with 8 GB of memory.

Resource | Amount
------- | -------
App instances per Spring application | 20
Total app instances per Azure Spring Cloud service instance | 500
Azure Spring Cloud service instances per region per subscription | 10
Persistent volumes | 10 x 50 GBytes

\* _To raise the limit, open a [support ticket](https://azure.microsoft.com/support/faq/)._

For more information, see [Azure Support FAQ](https://azure.microsoft.com/support/faq/).

### How secure is Azure Spring Cloud?

Security and privacy are among the top priorities for Azure and Azure Spring Cloud customers. Azure helps ensure that only customers have access to application data, logs, or configurations by securely encrypting all of this data. All the service instances in Azure Spring Cloud are isolated from each other.

Azure Spring Cloud provides complete TLS/SSL and certificate management.

Critical security patches for OpenJDK and Spring Cloud runtimes are applied to Azure Spring Cloud as soon as possible.

### In which regions is Azure Spring Cloud available?

East US, West US 2, West Europe, and Southeast Asia.

### What are the known limitations of Azure Spring Cloud?

During preview release, Azure Spring Cloud has the following known limitations:

* `spring.application.name` will be overridden by the application name that's used to create each application.
* `server.port` is not allowed in the configuration file from the Git repo. Adding it to the configuration file will likely render your application unreachable from other applications or the internet.
* The Azure portal and Azure Resource Manager templates do not support uploading application packages. You can upload application packages only by deploying the application via the Azure CLI.

### What pricing tiers are available? 
Which one should I use and what are the limits within each tier?
* Azure Spring Cloud offers two pricing tiers: Basic and Standard. The Basic tier is targeted for Dev/Test and trying out Azure Spring Cloud. The Standard tier is optimized to run general purpose production traffic. See [Azure Spring Cloud pricing details](placeholder: link to ACOM page) for limits and feature level comparison.

### How can I provide feedback and report issues?

If you encounter any issues with Azure Spring Cloud, create an [Azure Support Request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request). To submit a feature request or provide feedback, go to [Azure Feedback](https://feedback.azure.com/forums/34192--general-feedback).

## Development

### I am a Spring Cloud developer but new to Azure. What is the quickest way for me to learn how to develop an Azure Spring Cloud application?

For the quickest way to get started with Azure Spring Cloud, follow the instructions in [Quickstart: Launch an Azure Spring Cloud application by using the Azure portal](spring-cloud-quickstart-launch-app-portal.md).

### What Java runtime does Azure Spring Cloud support?

Azure Spring Cloud supports Java 8 and 11.

### Where can I view my Spring Cloud application logs and metrics?

Find metrics in the App Overview tab and the [Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/data-platform-metrics#interacting-with-azure-monitor-metrics) tab.

Azure Spring Cloud supports exporting Spring Cloud application logs and metrics to Azure Storage, EventHub, and [Log Analytics](https://docs.microsoft.com/azure/azure-monitor/platform/data-platform-logs#log-queries). The table name in Log Analytics is *AppPlatformLogsforSpring*. To learn how to enable it, see [Diagnostic services](diagnostic-services.md).

### Does Azure Spring Cloud support distributed tracing?

Yes. For more information, see [Tutorial: Use Distributed Tracing with Azure Spring Cloud](spring-cloud-tutorial-distributed-tracing.md).

### What resource types does Service Binding support?

Three services are currently supported: Azure Cosmos DB, Azure Database for MySQL, and Azure Cache for Redis.

### Can I view, add, or move persistent volumes from inside my applications?

Yes.

### When I delete/move an Azure Spring Cloud service instance, will its extension resources be deleted/moved as well?

It depends on the logics of resource providers where the extension resources belong to. The extension resources of a `Microsoft.AppPlatform` instance do not belong to the same namespace, so the behaviors vary according to different resource providers. For example, the delete/move operation will not cascade to the **diagnostics settings** resources. If a new Azure Spring Cloud instance is provisioned with the same resource ID as the deleted one, or if the previous Azure Spring Cloud instance is moved back, the previous **diagnostics settings** resources continue extending it.

## Deployment

### Does Azure Spring Cloud support blue-green deployment?
Yes. For more information, see [Set up a staging environment](spring-cloud-howto-staging-environment.md).

### Can I access Kubernetes to manipulate my application containers?

No.  Azure Spring Cloud abstracts the developer from the underlying architecture, allowing you to concentrate on application code and business logic.

### Does Azure Spring Cloud support building containers from source?

Yes. For more information, see [Launch your Spring Cloud application from source code](spring-cloud-launch-from-source.md).

### Does Azure Spring Cloud support autoscaling in app instances?

No.

### What are the best practices for migrating existing Spring Cloud microservices to Azure Spring Cloud?

As you're migrating existing Spring Cloud microservices to Azure Spring Cloud, it's a good idea to observe the following best practices:
* All application dependencies need to be resolved.
* Prepare your configuration entries, environment variables, and JVM parameters so that you can compare them with the deployment in Azure Spring Cloud.
* If you want to use Service Binding, go through your Azure services and ensure that you've set the appropriate access permissions.
* We recommend that you remove or disable any embedded services that might conflict with services that are managed by Azure Spring Cloud, such as our Service Discovery service, Config Server, and so on.
* We recommend that you use official, stable Pivotal Spring libraries. Unofficial, beta, or forked versions of Pivotal Spring libraries have no service-level agreement (SLA) support.

After the migration, monitor your CPU/RAM metrics and network traffic to ensure that the application instances are scaled appropriately.

## Next steps

If you have further questions, see the [Azure Spring Cloud troubleshooting guide](spring-cloud-troubleshoot.md).
