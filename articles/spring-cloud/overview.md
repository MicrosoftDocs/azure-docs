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

## Enterprise Tier overview

Based on our learnings, we built a new Azure Spring Cloud tier with commercially supported Spring runtime components to help enterprise customers to ship faster and unlock Spring’s full potential.

### Ship faster

#### Deploy and manage Spring and polyglot applications

The fully managed Tanzu Build Service in Azure Spring Cloud Enterprise automates container creation, management and governance at enterprise scale using open-source [Cloud Native Buildpacks](https://buildpacks.io/) and commercial [Tanzu Buildpacks](https://docs.pivotal.io/tanzu-buildpacks/). Tanzu Build Service offers a higher-level abstraction for building apps and provides a balance of control that reduces the operational burden on developers and supports enterprise IT operators who manage applications at scale. You can configure what buildpacks to apply and what shouldn't apply and build Spring application and polyglot applications which can run alongside Spring applications on Azure Spring Cloud.

Tanzu Buildpacks makes it easier to build Spring, Java, NodeJS, Python, Go and .NET Core applications and configure application performance monitoring agents such as Application Insights, New Relic, Dynatrace, AppDynamics and Elastic.

#### Route client requests to applications

You can manage and discover request routes and APIs exposed by applications using the fully managed Tanzu Spring Cloud Gateway and Tanzu API Portal.

Tanzu Spring Cloud Gateway effectively routes diverse client requests to applications in Azure Spring Cloud, Azure, and/or on-premises, and addresses cross-cutting concerns such as security, monitoring and metrics, and resiliency. In particular, you can effortlessly configure:

* Single sign-on integration with your preferred identity provider without any additional code or dependencies.
* Dynamic routing rules to applications without any application redeployment.
* Request throttling without any backing services.

API Portal for VMware Tanzu provides API consumers with the ability to find and view API route details exposed by Tanzu Spring Cloud Gateway and try out API requests.

#### Flexible and Configurable - VMware Tanzu components

With Azure Spring Cloud Enterprise, you can use the VMware Tanzu components on managed Azure infrastructure. Tanzu Build Service, Tanzu Spring Cloud Gateway, API Portal for VMware Tanzu, Tanzu Application Configuration Service, and Tanzu Service Registry are available during preview. You'll have the flexibility to select which Tanzu components you want during or after instance creation.

Tanzu components deliver increased value so you can:

* Grow your enterprise grade, application portfolio from a few applications to thousands with end-to-end observability while delegating operational complexity to Microsoft and VMware.
* Lift and shift Spring apps across Azure Spring Cloud and any other compute environment.
* Control your build dependencies, deploy polyglot applications, and deploy Spring Cloud middleware components as needed.

Microsoft and VMware will continue to add more Tanzu components such as Application Live View for Tanzu, Tanzu Application Accelerator, and Spring Cloud Data Flow. (Note, however, that the Azure Spring Cloud Enterprise roadmap is not confirmed and is subject to change.)

### Unlock Spring’s full potential with Long-Term Support (LTS)

Azure Spring Cloud Enterprise includes VMware Spring Runtime Support entitlement for application development and deployments. This support gives you access to Spring experts, enabling you to unlock the full potential of the Spring ecosystem and develop and deploy applications faster.

Typically, open-source Spring project minor releases are supported for a minimum of 12 months from the date of initial release. In Azure Spring Cloud Enterprise, Spring project minor releases will receive commercial support for a minimum of 24 months from the date of initial release through the VMware Spring Runtime Support entitlement. This extended support ensures the security and stability of your Spring application portfolio even after the open-source end-of-life dates.

### Fully integrated into the Azure and the Java ecosystem

Azure Spring Cloud, including Enterprise tier, runs on Azure in a fully managed environment. You get all the benefits of Azure and the Java ecosystem, and the experience is familiar and intuitive, as shown in the following table:

| Best practice | Ecosystem |
|---------------|-----------|
| Create your service instances using a provisioning tool of your choice. | Azure Portal, CLI, ARM Template, Bicep or Terraform |
| Automate environments and application deployments using an automation platform of your choice. | GitHub, Azure DevOps, GitLab and Jenkins |
| Monitor end-to-end using any tool and platform of your choice. | Application Insights, Azure Log Analytics, Splunk, Elastic, New Relic, Dynatrace or AppDynamics |
| Expand the capabilities of your applications on Azure using Spring on Azure integrations to connect and interact with your preferred cloud services. | Azure services for data, messaging, eventing, cache, storage, and directories |
| Securely load application secrets and certificates. | Azure Key Vault |
| Continue to use development tools that you're familiar with. | IntelliJ, VS Code, Eclipse, Spring Tool Suite, Maven or Gradle |

After you create your Enterprise service instance and deploy your applications, you can monitor with Application Insights or any other application performance management (APM) tools of your choice.

### Get started today

Azure Spring Cloud Enterprise delivers even more productivity, and you can leverage Spring experts to make your projects even more successful.

It's easy to get started. We'd love to see you try Enterprise and share your feedback – [start now](quickstart-provision-service-instance-enterprise.md).

You can also learn more about Azure Spring Cloud Enterprise Public Preview [announcement by VMware](https://aka.ms/vmware-azure-spring-cloud-enterprise-tier-public-preview).

## Documentation overview

This documentation includes sections that explain how to get started and leverage Azure Spring Cloud services.

* Get started with Basic/Standard tier

  * [Launch your first app](quickstart.md)
  * [Introduction to the sample app](quickstart-sample-app-introduction.md)
  * [Provision an Azure Spring Cloud service instance](quickstart-provision-service-instance.md)
  * [Set up the configuration server](quickstart-setup-config-server.md)
  * [Build and deploy apps](quickstart-deploy-apps.md)
  * [Set up Log Analytics](quickstart-setup-log-analytics.md)
  * [Use logs metrics and tracing](quickstart-logs-metrics-tracing.md)
  * [Integrate with Azure Database for MySQL](quickstart-integrate-azure-database-mysql.md)

* Get started with Enterprise tier

  * [Launch your first app](quickstart.md)
  * [Introduction to the sample app](enterprise/quickstart-sample-app-introduction-enterprise.md)
  * [Provision an Azure Spring Cloud instance using the Enterprise tier](quickstart-provision-service-instance-enterprise.md)
  * [Set up Application Configuration Service](quickstart-setup-application-configuration-service-enterprise.md)
  * [Build and deploy applications](quickstart-deploy-apps-enterprise.md)
  * [Set up Service Registry](quickstart-setup-service-registry-enterprise.md)
  * [Set up Log Analytics](quickstart-setup-log-analytics.md)
  * [Use logs, metrics and tracing](quickstart-logs-metrics-tracing.md)
  * [Integrate with Azure Database for MySQL](quickstart-integrate-azure-database-mysql.md)

* How-to

  * [Develop](how-to-prepare-app-deployment.md): Prepare an existing Java Spring application for deployment to Azure Spring Cloud. When configured properly, Azure Spring Cloud provides robust services to monitor, scale, and update Java Spring Cloud applications.
  * [Deploy](how-to-staging-environment.md): How to set up a staging deployment by using the blue-green deployment pattern in Azure Spring Cloud. Blue/green deployment is an Azure DevOps Continuous Delivery pattern that relies on keeping an existing (blue) version live, while a new (green) one is deployed.
  * [Configure apps](how-to-start-stop-delete.md):  Start, stop, and delete your application in Azure Spring Cloud. Change an application's state in Azure Spring Cloud by using either the Azure portal or the Azure CLI.
  * [Scale](how-to-scale-manual.md): Scale any Spring application using the Azure Spring Cloud dashboard in the Azure portal or using autoscale settings. Public IPs are available to communicate with external resources, such as databases, storage, and key vaults.
  * [Monitor apps](how-to-distributed-tracing.md): Distributed tracing tools to easily debug and monitor complex issues. Azure Spring Cloud integrates Spring Cloud Sleuth with Azure's Application Insights. This integration provides powerful distributed tracing capability from the Azure portal.
  * [Secure apps](how-to-enable-system-assigned-managed-identity.md): Azure resources provide an automatically managed identity in Azure Active Directory. You can use this identity to authenticate to any service that supports Azure AD authentication, without having credentials in your code.
  * [Integration with other Azure services](how-to-bind-cosmos.md): Instead of manually configuring your Spring Boot applications, you can automatically bind selected Azure services to your applications, for example, binding your application to an Azure Cosmos DB database.
  * [Automate](how-to-cicd.md): Continuous integration and continuous delivery tools let you quickly deploy updates to existing applications with minimal effort and risk. Azure DevOps helps organize and control these key tasks.
  * [Troubleshoot](how-to-self-diagnose-solve.md): Azure Spring Cloud diagnostics provide an interactive experience to help troubleshoot apps. No configuration is required. When you find issues, Azure Spring Cloud diagnostics identifies problems and guides you to information that helps troubleshoot and resolve issues.
  * [Migrate](/azure/developer/java/migration/migrate-spring-boot-to-azure-spring-cloud): How to migrate an existing Spring Cloud application or Spring Boot application to run on Azure Spring Cloud.

To get started, see:

> [!div class="nextstepaction"]
> [Spring Cloud quickstart](quickstart.md)

Samples are available on GitHub: [Azure Spring Cloud Samples](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples/tree/master/).
