---
title: Frequently asked questions about Azure Spring Apps | Microsoft Docs
description: This article answers frequently asked questions about Azure Spring Apps.
author: karlerickson
ms.service: spring-apps
ms.topic: conceptual
ms.date: 09/08/2020
ms.author: karler
ms.custom: devx-track-java, event-tier1-build-2022, ignite-2022
zone_pivot_groups: programming-languages-spring-apps
---

# Azure Spring Apps FAQ

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This article answers frequently asked questions about Azure Spring Apps.

## General

### Why Azure Spring Apps?

Azure Spring Apps provides a platform as a service (PaaS) for Spring developers. Azure Spring Apps manages your application infrastructure so that you can focus on application code and business logic. Core features built into Azure Spring Apps include Eureka, Config Server, Service Registry Server, VMware Tanzu® Build Service™, Blue-green deployment, and more. This service also enables developers to bind their applications with other Azure services, such as Azure Cosmos DB, Azure Database for MySQL, and Azure Cache for Redis.

Azure Spring Apps enhances the application diagnostics experience for developers and operators by integrating Azure Monitor, Application Insights, and Log Analytics.

### How secure is Azure Spring Apps?

Security and privacy are among the top priorities for Azure and Azure Spring Apps customers. Azure helps ensure that only customers have access to application data, logs, or configurations by securely encrypting all of this data.

* The service instances in Azure Spring Apps are isolated from each other.
* Azure Spring Apps provides complete TLS/SSL and certificate management.
* Critical security patches for OpenJDK and Spring runtimes are applied to Azure Spring Apps as soon as possible.

### How does Azure Spring Apps host my applications?

Each service instance in Azure Spring Apps is backed by Azure Kubernetes Service with multiple worker nodes. Azure Spring Apps manages the underlying Kubernetes cluster for you, including high availability, scalability, Kubernetes version upgrade, and so on.

Azure Spring Apps intelligently schedules your applications on the underlying Kubernetes worker nodes. To provide high availability, Azure Spring Apps distributes applications with 2 or more instances on different nodes.

### In which regions is Azure Spring Apps Basic/Standard tier available?

East US, East US 2, Central US, South Central US, North Central US, West US, West US 2, West US 3, West Europe, North Europe, UK South, Southeast Asia, Australia East, Canada Central, Canada East, UAE North, Central India, Korea Central, East Asia, Japan East, South Africa North, Brazil South, France Central, Germany West Central, Switzerland North, China East 2 (Mooncake), China North 2 (Mooncake), and China North 3 (Mooncake). [Learn More](https://azure.microsoft.com/global-infrastructure/services/?products=spring-cloud)

### In which regions is Azure Spring Apps Enterprise tier available?

East US, East US 2, Central US, South Central US, North Central US, West US, West US 2, West US 3, West Europe, North Europe, UK South, Southeast Asia, Australia East, Canada Central, Canada East, UAE North, Central India, Korea Central, East Asia, Japan East, South Africa North, Brazil South, France Central, Germany West Central, and Switzerland North.

### Is any customer data stored outside of the specified region?

Azure Spring Apps is a regional service. All customer data in Azure Spring Apps is stored to a single, specified region. To learn more about geo and region, see [Data residency in Azure](https://azure.microsoft.com/global-infrastructure/data-residency/).

### What are the known limitations of Azure Spring Apps?

Azure Spring Apps has the following known limitations:

* `spring.application.name` will be overridden by the application name that's used to create each application.
* `server.port` defaults to port 1025. If any other value is applied, it will be overridden. Please also respect this setting and not specify server port in your code.
* The Azure portal, Azure Resource Manager templates, and Terraform do not support uploading application packages. You can upload application packages by deploying the application using the Azure CLI, Azure DevOps, Maven Plugin for Azure Spring Apps, Azure Toolkit for IntelliJ, and the Visual Studio Code extension for Azure Spring Apps.

### What pricing tiers are available?

Which one should I use and what are the limits within each tier?

* Azure Spring Apps offers three pricing tiers: Basic, Standard, and Enterprise. The Basic tier is targeted for Dev/Test and trying out Azure Spring Apps. The Standard tier is optimized to run general purpose production traffic. The Enterprise tier is for production workloads with VMware Tanzu components. See [Azure Spring Apps pricing details](https://azure.microsoft.com/pricing/details/spring-apps/) for limits and feature level comparison.

### What's the difference between Service Binding and Service Connector?

We are not actively developing additional capabilities for Service Binding in favor of the new Azure-wise solution named [Service Connector](../service-connector/overview.md). On the one hand, the new solution brings you consistent integration experience across App hosting services on Azure like App Service. On the other hand, it covers your needs better by starting with supporting 10+ most used target Azure services including MySQL, SQL DB, Azure Cosmos DB, Postgres DB, Redis, Storage and more. Service Connector is currently in Public Preview, we invite you to try out the new experience.

### How can I provide feedback and report issues?

If you encounter any issues with Azure Spring Apps, create an [Azure Support Request](../azure-portal/supportability/how-to-create-azure-support-request.md). To submit a feature request or provide feedback, go to [Azure Feedback](https://feedback.azure.com/d365community/forum/79b1327d-d925-ec11-b6e6-000d3a4f06a4).

### How do I get VMware Spring Runtime support (Enterprise tier only)

Enterprise tier has built-in VMware Spring Runtime Support, so you can open support tickets to [VMware](https://aka.ms/ascevsrsupport) if you think your issue is in the scope of VMware Spring Runtime Support. To better understand VMware Spring Runtime Support itself, see the [VMware Spring Runtime](https://tanzu.vmware.com/spring-runtime). To understand the details about how to register and use this support service, see the Support section in the [Enterprise tier FAQ from VMware](https://aka.ms/EnterpriseTierFAQ). For any other issues, open support tickets with Microsoft.

> [!IMPORTANT]
> After you create an Enterprise tier instance, your entitlement will be ready within ten business days. If you encounter any exceptions, raise a support ticket with Microsoft to get help with it.

## Development

### I am a Spring developer but new to Azure. What is the quickest way for me to learn how to develop an application in Azure Spring Apps?

For the quickest way to get started with Azure Spring Apps, follow the instructions in [Quickstart: Launch an application in Azure Spring Apps by using the Azure portal](./quickstart.md).

::: zone pivot="programming-language-java"
### Is Spring Boot 2.4.x supported?
We've identified an issue with Spring Boot 2.4 and are currently working with the Spring community to resolve it. In the meantime, please include these two dependencies to enable TLS authentication between your apps and Eureka.

```xml
<dependency>
    <groupId>com.sun.jersey</groupId>
    <artifactId>jersey-client</artifactId>
    <version>1.19.4</version>
</dependency>
<dependency>
    <groupId>com.sun.jersey.contribs</groupId>
    <artifactId>jersey-apache-client4</artifactId>
    <version>1.19.4</version>
</dependency>
```

::: zone-end

### Where can I view my Spring application logs and metrics?

Find metrics in the App Overview tab and the [Azure Monitor](../azure-monitor/essentials/data-platform-metrics.md#metrics-explorer) tab.

Azure Spring Apps supports exporting Spring application logs and metrics to Azure Storage, Event Hub, and [Log Analytics](../azure-monitor/logs/data-platform-logs.md). The table name in Log Analytics is *AppPlatformLogsforSpring*. To learn how to enable it, see [Diagnostic services](diagnostic-services.md).

### Does Azure Spring Apps support distributed tracing?

Yes. For more information, see [Tutorial: Use Distributed Tracing with Azure Spring Apps](./how-to-distributed-tracing.md).

::: zone pivot="programming-language-java"
### What resource types does Service Binding support?

Three services are currently supported:

* Azure Cosmos DB
* Azure Database for MySQL
* Azure Cache for Redis.
::: zone-end

### Can I view, add, or move persistent volumes from inside my applications?

Yes.

### How many outbound public IP addresses does an Azure Spring Apps instance have?

The number of outbound public IP addresses may vary according to the tiers and other factors.

| Azure Spring Apps instance type    | Default number of outbound public IP addresses |
|------------------------------------|------------------------------------------------|
| Basic tier instances               | 1                                              |
| Standard/Enterprise tier instances | 2                                              |
| VNet injection instances           | 1                                              |

### Can I increase the number of outbound public IP addresses?

Yes, you can open a [support ticket](https://azure.microsoft.com/support/faq/)  to request for more outbound public IP addresses.

### When I delete/move an Azure Spring Apps service instance, will its extension resources be deleted/moved as well?

It depends on the logic of resource providers that own the extension resources. The extension resources of a `Microsoft.AppPlatform` instance do not belong to the same namespace, so the behavior varies by resource provider. For example, the delete/move operation won't cascade to the **diagnostics settings** resources. If a new Azure Spring Apps instance is provisioned with the same resource ID as the deleted one, or if the previous Azure Spring Apps instance is moved back, the previous **diagnostics settings** resources continue extending it.

You can delete the Azure Spring Apps diagnostic settings by using Azure CLI:

```azurecli
 az monitor diagnostic-settings delete --name $DIAGNOSTIC_SETTINGS_NAME --resource $AZURE_SPRING_APPS_RESOURCE_ID
```

::: zone pivot="programming-language-java"
## Java runtime and OS versions

### Which versions of Java runtime are supported in Azure Spring Apps?

Azure Spring Apps supports Java LTS versions with the most recent builds, currently Java 8, Java 11, and Java 17 are supported. 

### For how long will Java 8, Java 11, and Java 17 LTS versions be supported?

See [Java long-term support for Azure and Azure Stack](/azure/developer/java/fundamentals/java-support-on-azure).

### What is the retire policy for older Java runtimes?

Public notice will be sent out at 12 months before any old runtime version is retired. You will have 12 months to migrate to a later version.

* Subscription admins will get email notification when we will retire a Java version.
* The retire information will be published in the documentation.

### How can I get support for issues at the Java runtime level?

See [Java long-term support for Azure and Azure Stack](/azure/developer/java/fundamentals/java-support-on-azure).

### What is the operation system to run my apps?

The most recent Ubuntu LTS version is used, currently [Ubuntu 20.04 LTS (Focal Fossa)](https://releases.ubuntu.com/focal/) is the default OS.

### How often are OS security patches applied?

Security patches applicable to Azure Spring Apps are rolled out to production on a monthly basis.
Critical security patches (CVE score >= 9) applicable to Azure Spring Apps are rolled out as soon as possible.
::: zone-end

## Deployment

### Does Azure Spring Apps support blue-green deployment?

Yes. For more information, see [Set up a staging environment](./how-to-staging-environment.md).

### Can I access Kubernetes to manipulate my application containers?

No.  Azure Spring Apps abstracts the developer from the underlying architecture, allowing you to concentrate on application code and business logic.

### Does Azure Spring Apps support building containers from source?

Yes. For more information, see [Quickstart: Deploy your first application to Azure Spring Apps](./quickstart.md).

### Does Azure Spring Apps support autoscaling in app instances?

Yes. For more information, see [Set up autoscale for applications](./how-to-setup-autoscale.md).

### How does Azure Spring Apps monitor the health status of my application?

Azure Spring Apps continuously probes port 1025 for customer's applications. These probes determine whether the application container is ready to start accepting traffic and whether Azure Spring Apps needs to restart the application container. Internally, Azure Spring Apps uses Kubernetes liveness and readiness probes to achieve the status monitoring.

>[!NOTE]
> Because of these probes, you currently can't launch applications in Azure Spring Apps without exposing port 1025.

### Whether and when will my application be restarted?

Yes. For more information, see [Monitor app lifecycle events using Azure Activity log and Azure Service Health](./monitor-app-lifecycle-events.md).

::: zone pivot="programming-language-java"
### What are the best practices for migrating existing Spring applications to Azure Spring Apps?

For more information, see [Migrate Spring applications to Azure Spring Apps](/azure/developer/java/migration/migrate-spring-cloud-to-azure-spring-apps).
::: zone-end

::: zone pivot="programming-language-csharp"
## .NET Core versions

### Which .NET Core versions are supported?

.NET Core 3.1 and later versions.

### How long will .NET Core 3.1 be supported?

Until Dec 3, 2022. See [.NET Core Support Policy](https://dotnet.microsoft.com/platform/support/policy/dotnet-core).
::: zone-end

## Troubleshooting

### What are the impacts of service registry rarely unavailable?

In some rarely happened scenario, you may see some errors like the following one from your application logs:

```output
RetryableEurekaHttpClient: Request execution failure with status code 401; retrying on another server if available
```

This issue is introduced by the Spring framework with very low rate due to network instability or other network issues.

There should be no impacts to user experience, eureka client has both heartbeat and retry policy to take care of this. You could consider it as one transient error and skip it safely.

We will enhance this part and avoid this error from users’ applications in short future.

## Next steps

If you have further questions, see the [Azure Spring Apps troubleshooting guide](./troubleshoot.md).
