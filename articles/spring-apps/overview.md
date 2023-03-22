---
title: Introduction to Azure Spring Apps
description: Learn the features and benefits of Azure Spring Apps to deploy and manage Java Spring applications in Azure.
author: karlerickson
ms.service: spring-apps
ms.topic: overview
ms.date: 03/21/2023
ms.author: karler
ms.custom: devx-track-java, contperf-fy21q2, event-tier1-build-2022
#Customer intent: As an Azure Cloud user, I want to deploy, run, and monitor Spring applications.
---

# What is Azure Spring Apps?

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Standard consumption (Preview) ✔️ Basic/Standard ✔️ Enterprise

Azure Spring Apps makes it easy to deploy Spring Boot applications to Azure without any code changes. The service manages the infrastructure of Spring applications so developers can focus on their code. Azure Spring Apps provides lifecycle management using comprehensive monitoring and diagnostics, configuration management, service discovery, CI/CD integration, blue-green deployments, and more.

The following video shows an app composed of Spring Boot applications running on Azure using Azure Spring Apps.

<br>

> [!VIDEO https://www.youtube.com/embed/1jOXMFc1oRg]

## Why use Azure Spring Apps?

Deployment of applications to Azure Spring Apps has many benefits. You can:

* Efficiently migrate existing Spring apps and manage cloud scaling and costs.
* Modernize apps with Spring Cloud patterns to improve agility and speed of delivery.
* Run Java at cloud scale and drive higher usage without complicated infrastructure.
* Develop and deploy rapidly without containerization dependencies.
* Monitor production workloads efficiently and effortlessly.

Azure Spring Apps supports both Java [Spring Boot](https://spring.io/projects/spring-boot) and ASP.NET Core [Steeltoe](https://steeltoe.io/) apps. Steeltoe support is currently offered as a public preview. Public preview offerings let you experiment with new features prior to their official release.

## Service overview

As part of the Azure ecosystem, Azure Spring Apps allows easy binding to other Azure services including storage, databases, monitoring, and more.

:::image type="content" source="media/overview/overview.png" alt-text="Diagram showing an overview of how Azure Spring Apps interacts with other services and tools." lightbox="media/overview/overview.png" border="false":::

* Azure Spring Apps is a fully managed service for Spring Boot apps that lets you focus on building and running apps without the hassle of managing infrastructure.

* Simply deploy your JARs or code for your Spring Boot app or Zip for your Steeltoe app, and Azure Spring Apps will automatically wire your apps with Spring service runtime and built-in app lifecycle.

* Monitoring is simple. After deployment you can monitor app performance, fix errors, and rapidly improve applications.

* Full integration to Azure's ecosystems and services.

* Azure Spring Apps is enterprise ready with fully managed infrastructure, built-in lifecycle management, and ease of monitoring.

### Get started with Azure Spring Apps

The following quickstarts will help you get started:

* [Launch your first app](quickstart.md)
* [Introduction to the sample app](quickstart-sample-app-introduction.md)

The following documents will help you migrate existing Spring Boot apps to Azure Spring Apps:

* [Migrate Spring Boot applications to Azure Spring Apps](/azure/developer/java/migration/migrate-spring-boot-to-azure-spring-apps)
* [Migrate Spring Cloud applications to Azure Spring Apps](/azure/developer/java/migration/migrate-spring-cloud-to-azure-spring-apps?pivots=sc-standard-tier)

The following quickstarts apply to Basic/Standard only. For Enterprise quickstarts, see the next section.

* [Provision an Azure Spring Apps service instance](quickstart-provision-service-instance.md)
* [Set up the configuration server](quickstart-setup-config-server.md)
* [Build and deploy apps](quickstart-deploy-apps.md)

## Standard consumption plan

The Standard consumption plan provides a flexible billing model where you pay only for compute time used instead of provisioning resources. Start with as little as 0.25 vCPU and dynamically scale out based on HTTP or events powered by Kubernetes Event-Driven Autoscaling (KEDA). You can also scale your app instance to zero and stop all charges related to the app when there are no requests to process.

Standard consumption simplifies the virtual network experience for running polyglot apps. All your apps will share the same virtual network when you deploy frontend apps as containers in Azure Container Apps and Spring apps in Standard consumption, in the same Azure Container Apps environment. There's no need to create disparate subnets and Network Security Groups for frontend apps, Spring apps, and the Spring service runtime.

:::image type="content" source="media/overview/standard-consumption-plan.png" alt-text="Diagram showing app architecture with Azure Spring Apps standard consumption plan." lightbox="media/overview/standard-consumption-plan.png" border="false":::

## Enterprise plan

Based on our learnings from customer engagements, we built Azure Spring Apps Enterprise tier with commercially supported Spring runtime components to help enterprise customers to ship faster and unlock Spring’s full potential, including feature parity and region parity with Standard tier.

The following video introduces Azure Spring Apps Enterprise tier.

<br>

> [!VIDEO https://www.youtube.com/embed/CLvtz8SkrMA]

### Deploy and manage Spring and polyglot applications

The fully managed VMware Tanzu® Build Service™ in Azure Spring Apps Enterprise tier automates container creation, management and governance at enterprise scale using open-source [Cloud Native Buildpacks](https://buildpacks.io/) and commercial [VMware Tanzu® Buildpacks](https://docs.pivotal.io/tanzu-buildpacks/). Tanzu Build Service offers a higher-level abstraction for building apps and provides a balance of control that reduces the operational burden on developers and supports enterprise IT operators who manage applications at scale. You can configure what Buildpacks to apply and build Spring applications and polyglot applications that run alongside Spring applications on Azure Spring Apps.

Tanzu Buildpacks makes it easier to build Spring, Java, NodeJS, Python, Go and .NET Core applications and configure application performance monitoring agents such as Application Insights, New Relic, Dynatrace, AppDynamics, and Elastic.

### Route client requests to applications

You can manage and discover request routes and APIs exposed by applications using the fully managed Spring Cloud Gateway for VMware Tanzu® and API portal for VMware Tanzu®.

Spring Cloud Gateway for Tanzu effectively routes diverse client requests to applications in Azure Spring Apps, Azure, and on-premises, and addresses cross-cutting considerations for applications behind the Gateway such as securing, routing, rate limiting, caching, monitoring, resiliency and hiding applications. You can configure:

* Single sign-on integration with your preferred identity provider without any additional code or dependencies.
* Dynamic routing rules to applications without any application redeployment.
* Request throttling without any backing services.

API Portal for VMware Tanzu provides API consumers with the ability to find and view API route details exposed by Spring Cloud Gateway for Tanzu and test API requests.

### Use flexible and configurable VMware Tanzu components

With Azure Spring Apps Enterprise tier, you can use fully managed VMware Tanzu components on Azure. You can select which VMware Tanzu components you want to use in your environment during Enterprise instance creation. Tanzu Build Service, Spring Cloud Gateway for Tanzu, API Portal for VMware Tanzu, Application Configuration Service for VMware Tanzu®, and VMware Tanzu® Service Registry are available during public preview.

VMware Tanzu components deliver increased value so you can:

* Grow your enterprise grade application portfolio from a few applications to thousands with end-to-end observability while delegating operational complexity to Microsoft and VMware.
* Lift and shift Spring applications across Azure Spring Apps and any other compute environment.
* Control your build dependencies, deploy polyglot applications, and deploy Spring Cloud middleware components as needed.

Microsoft and VMware will continue to add more enterprise-grade features, including Tanzu components such as Application Live View for VMware Tanzu®, Application Accelerator for VMware Tanzu®, and Spring Cloud Data Flow for VMware Tanzu®, although the Azure Spring Apps Enterprise tier roadmap is not confirmed and is subject to change.

### Unlock Spring’s full potential with Long-Term Support (LTS)

Azure Spring Apps Enterprise tier includes VMware Spring Runtime Support for application development and deployments. This support gives you access to Spring experts, enabling you to unlock the full potential of the Spring ecosystem to develop and deploy applications faster.

Typically, open-source Spring project minor releases are supported for a minimum of 12 months from the date of initial release. In Azure Spring Apps Enterprise, Spring project minor releases will receive commercial support for a minimum of 24 months from the date of initial release through the VMware Spring Runtime Support entitlement. This extended support ensures the security and stability of your Spring application portfolio even after the open source end of life dates. For more information, see [Spring Boot support](https://spring.io/projects/spring-boot#support).

### Fully integrate into the Azure and Java ecosystems

Azure Spring Apps, including Enterprise tier, runs on Azure in a fully managed environment. You get all the benefits of Azure and the Java ecosystem, and the experience is familiar and intuitive, as shown in the following table:

| Best practice                                                      | Ecosystem                                                                                             |
|--------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|
| Create service instances using a provisioning tool.                | Azure portal, CLI, ARM Template, Bicep, or Terraform                                                  |
| Automate environments and application deployments.                 | GitHub, Azure DevOps, GitLab, and Jenkins                                                             |
| Monitor end-to-end using any tool and platform.                    | Application Insights, Azure Log Analytics, Splunk, Elastic, New Relic, Dynatrace, or AppDynamics      |
| Connect Spring applications and interact with your cloud services. | Spring integration with Azure services for data, messaging, eventing, cache, storage, and directories |
| Securely load app secrets and certificates.                        | Azure Key Vault                                                                                       |
| Use familiar development tools.                                    | IntelliJ, Visual Studio Code, Eclipse, Spring Tool Suite, Maven, or Gradle                            |

After you create your Enterprise tier service instance and deploy your applications, you can monitor with Application Insights or any other application performance management tools of your choice.

### Get started with the Standard consumption plan

The following quickstarts and articles will help you get started using the Standard consumption plan:

* [Provision a service instance](quickstart-provision-standard-consumption-service-instance.md)
* [Provision in an Azure Container Apps environment with a virtual network](quickstart-provision-standard-consumption-app-environment-with-virtual-network.md)
* [Access apps in a virtual network](quickstart-access-standard-consumption-within-virtual-network.md)
* [Deploy an event-driven app](quickstart-deploy-event-driven-app-standard-consumption.md)
* [Set up autoscale](quickstart-apps-autoscale-standard-consumption.md)
* [Map a custom domain to Azure Spring Apps](quickstart-standard-consumption-custom-domain.md)
* [Analyze logs and metrics](quickstart-analyze-logs-and-metrics-standard-consumption.md)
* [Enable your own persistent storage](how-to-custom-persistent-storage-with-standard-consumption.md)
* [Customer responsibilities for Standard consumption plan in a virtual network](standard-consumption-customer-responsibilities.md)

### Get started with Enterprise tier

The following quickstarts will help you get started using the Enterprise tier:

* [Enterprise Tier in Azure Marketplace](how-to-enterprise-marketplace-offer.md)
* [Introduction to Fitness Store sample](quickstart-sample-app-acme-fitness-store-introduction.md)
* [Build and deploy apps](quickstart-deploy-apps-enterprise.md)
* [Configure single sign-on](quickstart-configure-single-sign-on-enterprise.md)
* [Integrate Azure Database for PostgreSQL and Azure Cache for Redis](quickstart-integrate-azure-database-and-redis-enterprise.md)
* [Load application secrets using Key Vault](quickstart-key-vault-enterprise.md)
* [Monitor applications end-to-end](quickstart-monitor-end-to-end-enterprise.md)
* [Set request rate limits](quickstart-set-request-rate-limits-enterprise.md)
* [Automate deployments](quickstart-automate-deployments-github-actions-enterprise.md)

Most of the Azure Spring Apps documentation applies to all tiers. Some articles apply only to Enterprise tier or only to Basic/Standard tier, as indicated at the beginning of each article.

As a quick reference, the articles listed above and the articles in the following list apply to Enterprise tier only, or contain significant content that applies only to Enterprise tier:

* [Use Application Configuration Service for Tanzu](how-to-enterprise-application-configuration-service.md)
* [Use Tanzu Build Service](how-to-enterprise-build-service.md)
* [Use Tanzu Service Registry](how-to-enterprise-service-registry.md)
* [Use API portal for VMware Tanzu](how-to-use-enterprise-api-portal.md)
* [Use Spring Cloud Gateway for Tanzu](how-to-use-enterprise-spring-cloud-gateway.md)
* [Deploy polyglot enterprise applications](how-to-enterprise-deploy-polyglot-apps.md)
* [Enable system-assigned managed identity](how-to-enable-system-assigned-managed-identity.md?pivots=sc-enterprise-tier)
* [Application Insights using Java In-Process Agent](how-to-application-insights.md?pivots=sc-enterprise-tier)

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Deploy your first application to Azure Spring Apps](quickstart.md)

Samples are available on GitHub. See [Azure Spring Apps Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples/tree/master/).

For feature updates about Azure Spring Apps, see [Azure updates](https://azure.microsoft.com/updates/?query=spring).
