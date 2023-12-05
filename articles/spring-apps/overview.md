---
title: Introduction to Azure Spring Apps
description: Learn the features and benefits of Azure Spring Apps to deploy and manage Java Spring applications in Azure.
author: KarlErickson
ms.service: spring-apps
ms.topic: overview
ms.date: 05/23/2023
ms.author: karler
ms.custom: devx-track-java, devx-track-extended-java, contperf-fy21q2, event-tier1-build-2022
#Customer intent: As an Azure Cloud user, I want to deploy, run, and monitor Spring applications.
---

# What is Azure Spring Apps?

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Enterprise ✔️ Standard consumption and dedicated (Preview) ✔️ Basic/Standard

Azure Spring Apps makes it easy to deploy Spring Boot applications to Azure without any code changes. The service manages the infrastructure of Spring applications so developers can focus on their code. Azure Spring Apps provides lifecycle management using comprehensive monitoring and diagnostics, configuration management, service discovery, CI/CD integration, blue-green deployments, and more.

The following video shows an app composed of Spring Boot applications running on Azure using Azure Spring Apps.

<br>

> [!VIDEO https://www.youtube.com/embed/1jOXMFc1oRg]

## Why use Azure Spring Apps?

You get the following benefits when you deploy applications to Azure Spring Apps:

* Efficiently migrate existing Spring apps and manage cloud scaling and costs.
* Modernize apps with Spring Cloud patterns to improve agility and speed of delivery.
* Run Java at cloud scale and drive higher usage without complicated infrastructure.
* Develop and deploy rapidly without containerization dependencies.
* Monitor production workloads efficiently and effortlessly.

Azure Spring Apps supports both Java [Spring Boot](https://spring.io/projects/spring-boot) and ASP.NET Core [Steeltoe](https://steeltoe.io/) apps. Steeltoe support is currently offered as a public preview. With public preview offerings, you can experiment with new features prior to their official release.

## Service overview

As part of the Azure ecosystem, Azure Spring Apps allows easy binding to other Azure services including storage, databases, monitoring, and more, as shown in the following diagram:

:::image type="content" source="media/overview/overview.png" alt-text="Diagram showing an overview of how Azure Spring Apps interacts with other services and tools." lightbox="media/overview/overview.png" border="false":::

Azure Spring Apps provides you with the following capabilities:

* A fully managed service for Spring Boot apps that lets you focus on building and running apps without the hassle of managing infrastructure.

* Automatic wiring of your apps with the Spring service runtime and built-in app lifecycle support when you deploy your JARs or code for your Spring Boot app, or zip file for your Steeltoe app.

* Ease of monitoring. After deployment, you can monitor app performance, fix errors, and rapidly improve applications.

* Full integration to Azure's ecosystems and services.

* Enterprise readiness with fully managed infrastructure and built-in lifecycle management.

### Get started with Azure Spring Apps

The following articles help you get started:

* [Deploy your first application to Azure Spring Apps](quickstart.md)
* [Introduction to the sample app](quickstart-sample-app-introduction.md)

The following articles help you migrate existing Spring Boot apps to Azure Spring Apps:

* [Migrate Spring Boot applications to Azure Spring Apps](/azure/developer/java/migration/migrate-spring-boot-to-azure-spring-apps)
* [Migrate Spring Cloud applications to Azure Spring Apps](/azure/developer/java/migration/migrate-spring-cloud-to-azure-spring-apps?pivots=sc-standard-tier)

The following quickstarts apply to the Basic/Standard plan only. For Enterprise quickstarts, see the [Get started with the Enterprise plan](#get-started-with-the-enterprise-plan) section.

* [Provision an Azure Spring Apps service instance](quickstart-provision-service-instance.md)
* [Set up Spring Cloud Config Server for Azure Spring Apps](quickstart-setup-config-server.md)
* [Build and deploy apps to Azure Spring Apps](quickstart-deploy-apps.md)

## Enterprise plan

The Enterprise plan provides commercially supported Tanzu components with SLA assurance. For more information, see the [SLA for Azure Spring Apps](https://azure.microsoft.com/support/legal/sla/spring-apps). This support helps enterprise customers ship faster for mission-critical workloads with peace of mind. The Enterprise plan helps unlock Spring’s full potential while including feature parity and region parity with the Standard plan.

The following video introduces the Azure Spring Apps Enterprise plan.

<br>

> [!VIDEO https://www.youtube.com/embed/CLvtz8SkrMA]

### Deploy and manage Spring and polyglot applications

The Azure Spring Apps Enterprise plan provides the fully managed VMware® Tanzu Build Service. The Tanzu Build Service automates the creation, management, and governance of containers at enterprise scale with the following buildpack options:

* Open-source [Cloud Native Buildpacks](https://buildpacks.io/)
* Commercial [Language Family Buildpacks for VMware Tanzu](https://docs.vmware.com/en/VMware-Tanzu-Buildpacks/index.html).

Tanzu Build Service offers a higher-level abstraction for building applications. Tanzu Build Service also provides a balance of control that reduces the operational burden on developers, and supports enterprise IT operators who manage applications at scale. You can configure what Tanzu Buildpacks to apply and build polyglot applications that run alongside Spring applications on Azure Spring Apps.

Tanzu Buildpacks makes it easier to build Spring, Java, NodeJS, Python, Go and .NET Core applications. You can also use Tanzu Buildpacks to configure application performance monitoring agents such as Application Insights, New Relic, Dynatrace, AppDynamics, and Elastic.

### Route client requests to applications

You can manage and discover request routes and APIs exposed by applications using the fully managed Spring Cloud Gateway for VMware Tanzu and API portal for VMware Tanzu.

Spring Cloud Gateway for Tanzu effectively routes diverse client requests to applications in Azure Spring Apps, Azure, and on-premises. Spring Cloud Gateway also addresses cross-cutting considerations for applications behind the Gateway. These considerations include securing, routing, rate limiting, caching, monitoring, resiliency and hiding applications. You can make the following configurations to Spring Cloud Gateway:

* Single sign-on integration with your preferred identity provider without any extra code or dependencies.
* Dynamic routing rules to applications without any application redeployment.
* Request throttling without any backing services.

API Portal for VMware Tanzu provides API consumers with the ability to find and view API route details exposed by Spring Cloud Gateway for Tanzu and test API requests.

### Use flexible and configurable VMware Tanzu components

With the Azure Spring Apps Enterprise plan, you can use fully managed VMware Tanzu components on Azure without operational hassle. You can select which VMware Tanzu components you want to use in your environment, either during or after Enterprise instance creation. The following components are available:

* [Tanzu Build Service](how-to-enterprise-build-service.md)
* [Spring Cloud Gateway for Tanzu](how-to-configure-enterprise-spring-cloud-gateway.md)
* [API Portal for VMware Tanzu](how-to-use-enterprise-api-portal.md)
* [Application Configuration Service for VMware Tanzu](how-to-enterprise-application-configuration-service.md)
* [VMware Tanzu Service Registry](how-to-enterprise-service-registry.md)
* [Application Live View for VMware Tanzu](how-to-use-application-live-view.md)
* [Application Accelerator for VMware Tanzu](how-to-use-accelerator.md)

VMware Tanzu components deliver increased value so you can accomplish the following tasks:

* Grow your enterprise grade application portfolio from a few applications to thousands with end-to-end observability while delegating operational complexity to Microsoft and VMware.
* Lift and shift Spring applications across Azure Spring Apps and any other compute environment.
* Control your build dependencies, deploy polyglot applications, and deploy Spring Cloud middleware components as needed.

### Unlock Spring’s full potential with Long-Term Support (LTS)

The Azure Spring Apps Enterprise plan includes VMware Spring Runtime Support for application development and deployments. This support gives you access to Spring experts, enabling you to unlock the full potential of the Spring ecosystem to develop and deploy applications faster.

Typically, open-source Spring project minor releases receive support for a minimum of 12 months from the date of initial release. In the Azure Spring Apps Enterprise plan, Spring project minor releases receive commercial support for a minimum of 24 months from the date of initial release. This extended support is available through the VMware Spring Runtime Support entitlement and ensures the security and stability of your Spring application portfolio, even after the open source end of life dates. For more information, see [Spring Boot](https://spring.io/projects/spring-boot#support).

### Fully integrate into the Azure and Java ecosystems

Azure Spring Apps, including the Enterprise plan, runs on Azure in a fully managed environment. You get all the benefits of Azure and the Java ecosystem, and the experience is familiar and intuitive as described in the following table:

| Best practice                                                      | Ecosystem                                                                                             |
|--------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|
| Create service instances using a provisioning tool.                | Azure portal, CLI, ARM Template, Bicep, or Terraform                                                  |
| Automate environments and application deployments.                 | GitHub, Azure DevOps Server, GitLab, and Jenkins                                                      |
| Monitor end-to-end using any tool and platform.                    | Application Insights, Azure Log Analytics, Splunk, Elastic, New Relic, Dynatrace, or AppDynamics      |
| Connect Spring applications and interact with cloud services.      | Spring integration with Azure services for data, messaging, eventing, cache, storage, and directories |
| Securely load app secrets and certificates.                        | Azure Key Vault                                                                                       |
| Use familiar development tools.                                    | IntelliJ, Visual Studio Code, Eclipse, Spring Tool Suite, Maven, or Gradle                            |

After you create your Enterprise plan service instance and deploy your applications, you can monitor with Application Insights or any other application performance management tools of your choice.

### Get started with the Enterprise plan

The following articles help you get started using the Enterprise plan:

* [The Enterprise plan in Azure Marketplace](how-to-enterprise-marketplace-offer.md)
* [Introduction to Fitness Store sample app](quickstart-sample-app-acme-fitness-store-introduction.md)
* [Build and deploy apps to Azure Spring Apps using the Enterprise plan](quickstart-deploy-apps-enterprise.md)
* [Configure single sign-on for applications using Azure Spring Apps Enterprise plan](quickstart-configure-single-sign-on-enterprise.md)
* [Integrate with Azure Database for PostgreSQL and Azure Cache for Redis](quickstart-integrate-azure-database-and-redis-enterprise.md)
* [Load application secrets using Key Vault](quickstart-key-vault-enterprise.md)
* [Monitor applications end-to-end](quickstart-monitor-end-to-end-enterprise.md)
* [Set request rate limits](quickstart-set-request-rate-limits-enterprise.md)
* [Automate deployments](quickstart-automate-deployments-github-actions-enterprise.md)

Most of the Azure Spring Apps documentation applies to all the service plans. Some articles apply only to the Enterprise plan or only to the Basic/Standard plan, as indicated at the beginning of each article.

As a quick reference, the articles listed previously and the articles in the following list apply only to the Enterprise plan, or contain significant content that applies only to the Enterprise plan:

* [Use Application Configuration Service for Tanzu](how-to-enterprise-application-configuration-service.md)
* [Use Tanzu Build Service](how-to-enterprise-build-service.md)
* [Use Tanzu Service Registry](how-to-enterprise-service-registry.md)
* [Use API portal for VMware Tanzu](how-to-use-enterprise-api-portal.md)
* [Use Spring Cloud Gateway](how-to-use-enterprise-spring-cloud-gateway.md)
* [Deploy polyglot apps in Azure Spring Apps Enterprise plan](how-to-enterprise-deploy-polyglot-apps.md)
* [Enable system-assigned managed identity for an application in Azure Spring Apps](how-to-enable-system-assigned-managed-identity.md?pivots=sc-enterprise-tier)
* [Use Application Insights Java In-Process Agent in Azure Spring Apps](how-to-application-insights.md?pivots=sc-enterprise-tier)

## Standard consumption and dedicated plan

The Standard consumption and dedicated plan provides a hybrid pricing solution that combines the best of pay-as-you-go and resource-based pricing. With this comprehensive package, you have the flexibility to pay only for compute time as you get started, while enjoying enhanced cost predictability and significant savings when your resources scale up.

When you create a Standard consumption and dedicated plan, a consumption workload profile is always created by default. You can additionally add dedicated workload profiles to the same plan to fit the requirements of your workload.

Workload profiles determine the amount of compute and memory resources available to Spring apps deployed in the Standard consumption and dedicated plan. There are different machine sizes and characteristics with different workload profiles. For more information, see [Workload profiles in Consumption + Dedicated plan structure environments in Azure Container Apps (preview)](../container-apps/workload-profiles-overview.md).

You can run your apps in any combination of consumption or dedicated workload profiles. Consider using the consumption workload profile when your applications need to start from and scale to zero. Use the dedicated workload profile when you need dedicated hardware for single tenancy, and for customizable compute as with a memory optimized machine. You can also use the dedicated workload profile to optimize for cost savings when resources are running at scale.

The Standard consumption and dedicated plan simplifies the virtual network experience for running polyglot applications. In the Standard consumption and dedicated plan, when you deploy frontend applications as containers in Azure Container Apps, all your applications share the same virtual network in the same Azure Container Apps environment. There's no need to create disparate subnets and Network Security Groups for frontend apps, Spring apps, and the Spring service runtime.

The following diagram shows the architecture of a virtual network in Azure Spring Apps:

:::image type="content" source="media/overview/standard-consumption-plan.png" alt-text="Diagram showing app architecture with Azure Spring Apps standard consumption and dedicated plan." lightbox="media/overview/standard-consumption-plan.png" border="false":::

### Get started with the Standard consumption and dedicated plan

The following articles help you get started using the Standard consumption and dedicated plan:

* [Provision an Azure Spring Standard consumption and dedicated plan service instance](quickstart-provision-standard-consumption-service-instance.md)
* [Create an Azure Spring Apps Standard consumption and dedicated plan instance in an Azure Container Apps environment with a virtual network](quickstart-provision-standard-consumption-app-environment-with-virtual-network.md)
* [Access applications using Azure Spring Apps Standard consumption and dedicated plan in a virtual network](quickstart-access-standard-consumption-within-virtual-network.md)
* [Deploy an event-driven application to Azure Spring Apps](quickstart-deploy-event-driven-app.md)
* [Set up autoscale for applications in Azure Spring Apps Standard consumption and dedicated plan](quickstart-apps-autoscale-standard-consumption.md)
* [Map a custom domain to Azure Spring Apps with the Standard consumption and dedicated plan](quickstart-standard-consumption-custom-domain.md)
* [Analyze logs and metrics in the Azure Spring Apps Standard consumption and dedicated plan](quickstart-analyze-logs-and-metrics-standard-consumption.md)
* [Enable your own persistent storage in Azure Spring Apps with the Standard consumption and dedicated plan](how-to-custom-persistent-storage-with-standard-consumption.md)
* [Customer responsibilities for Azure Spring Apps Standard consumption and dedicated plan in a virtual network](standard-consumption-customer-responsibilities.md)

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Deploy your first application to Azure Spring Apps](quickstart.md)

Samples are available on GitHub. See [Azure Spring Apps Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples/tree/master/).

For feature updates about Azure Spring Apps, see [Azure updates](https://azure.microsoft.com/updates/?query=spring).
