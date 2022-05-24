---
title: Introduction to Azure Spring Cloud
description: Learn the features and benefits of Azure Spring Cloud to deploy and manage Java Spring applications in Azure.
author: karlerickson
ms.service: spring-cloud
ms.topic: overview
ms.date: 03/09/2021
ms.author: karler
ms.custom: devx-track-java, contperf-fy21q2
#Customer intent: As an Azure Cloud user, I want to deploy, run, and monitor Spring applications.
---

# What is Azure Spring Cloud?

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

Azure Spring Cloud makes it easy to deploy Spring Boot applications to Azure without any code changes. The service manages the infrastructure of Spring Cloud applications so developers can focus on their code. Azure Spring Cloud provides lifecycle management using comprehensive monitoring and diagnostics, configuration management, service discovery, CI/CD integration, blue-green deployments, and more.

The following video shows an app composed of Spring Boot applications running on Azure using Azure Spring Cloud.

<br>

> [!VIDEO https://www.youtube.com/embed/1jOXMFc1oRg]

## Why use Azure Spring Cloud?

Deployment of applications to Azure Spring Cloud has many benefits. You can:

* Efficiently migrate existing Spring apps and manage cloud scaling and costs.
* Modernize apps with Spring Cloud patterns to improve agility and speed of delivery.
* Run Java at cloud scale and drive higher usage without complicated infrastructure.
* Develop and deploy rapidly without containerization dependencies.
* Monitor production workloads efficiently and effortlessly.

Azure Spring Cloud supports both Java [Spring Boot](https://spring.io/projects/spring-boot) and ASP.NET Core [Steeltoe](https://steeltoe.io/) apps. Steeltoe support is currently offered as a public preview. Public preview offerings let you experiment with new features prior to their official release.

## Service overview

As part of the Azure ecosystem, Azure Spring Cloud allows easy binding to other Azure services including storage, databases, monitoring, and more.

![Azure Spring Cloud overview](media/spring-cloud-principles/azure-spring-cloud-overview.png)

* Azure Spring Cloud is a fully managed service for Spring Boot apps that lets you focus on building and running apps without the hassle of managing infrastructure.

* Simply deploy your JARs or code for your Spring Boot app or Zip for your Steeltoe app, and Azure Spring Cloud will automatically wire your apps with Spring service runtime and built-in app lifecycle.

* Monitoring is simple. After deployment you can monitor app performance, fix errors, and rapidly improve applications.

* Full integration to Azure's ecosystems and services.

* Azure Spring Cloud is enterprise ready with fully managed infrastructure, built-in lifecycle management, and ease of monitoring.

### Get started with Azure Spring Cloud

The following quickstarts will help you get started:

* [Launch your first app](quickstart.md)
* [Introduction to the sample app](quickstart-sample-app-introduction.md)

The following quickstarts apply to Basic/Standard tier only. For Enterprise tier quickstarts, see the next section.

* [Provision an Azure Spring Cloud service instance](quickstart-provision-service-instance.md)
* [Set up the configuration server](quickstart-setup-config-server.md)
* [Build and deploy apps](quickstart-deploy-apps.md)

## Enterprise Tier overview

Based on our learnings from customer engagements, we built Azure Spring Cloud Enterprise tier with commercially supported Spring runtime components to help enterprise customers to ship faster and unlock Spring’s full potential.

The following video introduces Azure Spring Cloud Enterprise tier.

<br>

> [!VIDEO https://www.youtube.com/embed/CLvtz8SkrMA]

### Deploy and manage Spring and polyglot applications

The fully managed VMware Tanzu® Build Service™ in Azure Spring Cloud Enterprise tier automates container creation, management and governance at enterprise scale using open-source [Cloud Native Buildpacks](https://buildpacks.io/) and commercial [VMware Tanzu® Buildpacks](https://docs.pivotal.io/tanzu-buildpacks/). Tanzu Build Service offers a higher-level abstraction for building apps and provides a balance of control that reduces the operational burden on developers and supports enterprise IT operators who manage applications at scale. You can configure what Buildpacks to apply and build Spring applications and polyglot applications that run alongside Spring applications on Azure Spring Cloud.

Tanzu Buildpacks makes it easier to build Spring, Java, NodeJS, Python, Go and .NET Core applications and configure application performance monitoring agents such as Application Insights, New Relic, Dynatrace, AppDynamics, and Elastic.

### Route client requests to applications

You can manage and discover request routes and APIs exposed by applications using the fully managed Spring Cloud Gateway for VMware Tanzu® and API portal for VMware Tanzu®.

Spring Cloud Gateway for Tanzu effectively routes diverse client requests to applications in Azure Spring Cloud, Azure, and on-premises, and addresses cross-cutting considerations for applications behind the Gateway such as securing, routing, rate limiting, caching, monitoring, resiliency and hiding applications. You can configure:

* Single sign-on integration with your preferred identity provider without any additional code or dependencies.
* Dynamic routing rules to applications without any application redeployment.
* Request throttling without any backing services.

API Portal for VMware Tanzu provides API consumers with the ability to find and view API route details exposed by Spring Cloud Gateway for Tanzu and test API requests.

### Use flexible and configurable VMware Tanzu components

With Azure Spring Cloud Enterprise tier, you can use fully managed VMware Tanzu components on Azure. You can select which VMware Tanzu components you want to use in your environment during Enterprise instance creation. Tanzu Build Service, Spring Cloud Gateway for Tanzu, API Portal for VMware Tanzu, Application Configuration Service for VMware Tanzu®, and VMware Tanzu® Service Registry are available during public preview.

VMware Tanzu components deliver increased value so you can:

* Grow your enterprise grade application portfolio from a few applications to thousands with end-to-end observability while delegating operational complexity to Microsoft and VMware.
* Lift and shift Spring applications across Azure Spring Cloud and any other compute environment.
* Control your build dependencies, deploy polyglot applications, and deploy Spring Cloud middleware components as needed.

Microsoft and VMware will continue to add more enterprise-grade features, including Tanzu components such as Application Live View for VMware Tanzu®, Application Accelerator for VMware Tanzu®, and Spring Cloud Data Flow for VMware Tanzu®, although the Azure Spring Cloud Enterprise tier roadmap is not confirmed and is subject to change.

### Unlock Spring’s full potential with Long-Term Support (LTS)

Azure Spring Cloud Enterprise tier includes VMware Spring Runtime Support for application development and deployments. This support gives you access to Spring experts, enabling you to unlock the full potential of the Spring ecosystem to develop and deploy applications faster.

Typically, open-source Spring project minor releases are supported for a minimum of 12 months from the date of initial release. In Azure Spring Cloud Enterprise, Spring project minor releases will receive commercial support for a minimum of 24 months from the date of initial release through the VMware Spring Runtime Support entitlement. This extended support ensures the security and stability of your Spring application portfolio even after the open source end of life dates. For more information, see [Spring Boot support](https://spring.io/projects/spring-boot#support).

### Fully integrate into the Azure and Java ecosystems

Azure Spring Cloud, including Enterprise tier, runs on Azure in a fully managed environment. You get all the benefits of Azure and the Java ecosystem, and the experience is familiar and intuitive, as shown in the following table:

| Best practice                                                      | Ecosystem |
|--------------------------------------------------------------------|-----------|
| Create service instances using a provisioning tool.                | Azure Portal, CLI, ARM Template, Bicep, or Terraform |
| Automate environments and application deployments.                 | GitHub, Azure DevOps, GitLab, and Jenkins |
| Monitor end-to-end using any tool and platform.                    | Application Insights, Azure Log Analytics, Splunk, Elastic, New Relic, Dynatrace, or AppDynamics |
| Connect Spring applications and interact with your cloud services. | Spring integration with Azure services for data, messaging, eventing, cache, storage, and directories |
| Securely load app secrets and certificates.                        | Azure Key Vault |
| Use familiar development tools.                                    | IntelliJ, VS Code, Eclipse, Spring Tool Suite, Maven, or Gradle |

After you create your Enterprise tier service instance and deploy your applications, you can monitor with Application Insights or any other application performance management tools of your choice.

### Get started with Enterprise tier

The following quickstarts will help you get started using the Enterprise tier:

* [View Enterprise Tier offering](how-to-enterprise-marketplace-offer.md)
* [Introduction to Fitness Store sample](quickstart-sample-app-acme-fitness-store-introduction.md)
* [Build and deploy apps](quickstart-deploy-apps-enterprise.md)
* [Configure single sign-on](quickstart-configure-single-sign-on-enterprise.md)
* [Integrate Azure Database for PostgreSQL and Azure Cache for Redis](quickstart-integrate-azure-database-and-redis-enterprise.md)
* [Securely load application secrets using Key Vault](quickstart-key-vault-enterprise.md)
* [Monitor applications end-to-end](quickstart-monitor-end-to-end-enterprise.md)
* [Set request rate limits](quickstart-set-request-rate-limits-enterprise.md)
* [Automate deployments](quickstart-automate-deployments-github-actions-enterprise.md)

Most of the Azure Spring Cloud documentation applies to all tiers. Some articles apply only to Enterprise tier or only to Basic/Standard tier, as indicated at the beginning of each article.

As a quick reference, the articles listed above and the articles in the following list apply to Enterprise tier only, or contain significant content that applies only to Enterprise tier:

* [Use Application Configuration Service for Tanzu](how-to-enterprise-application-configuration-service.md)
* [Use Tanzu Build Service](how-to-enterprise-build-service.md)
* [Use Tanzu Service Registry](how-to-enterprise-service-registry.md)
* [Use API portal for VMware Tanzu](how-to-use-enterprise-api-portal.md)
* [Use Spring Cloud Gateway for Tanzu](how-to-use-enterprise-spring-cloud-gateway.md)
* [Deploy non-Java enterprise applications](how-to-enterprise-deploy-non-java-apps.md)
* [Enable system-assigned managed identity](how-to-enable-system-assigned-managed-identity.md?pivots=sc-enterprise-tier)
* [Application Insights using Java In-Process Agent](how-to-application-insights.md?pivots=sc-enterprise-tier)

## Next steps

> [!div class="nextstepaction"]
> [Spring Cloud quickstart](quickstart.md)

Samples are available on GitHub. See [Azure Spring Cloud Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples/tree/master/).
