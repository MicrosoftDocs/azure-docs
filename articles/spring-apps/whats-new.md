---
title: What's new in Azure Spring Apps
description: Learn about the new features and recent improvements in Azure Spring Apps.
author: KarlErickson
ms.author: hangwan
ms.service: spring-apps
ms.topic: conceptual
ms.custom: devx-track-java
ms.date: 05/23/2023
---

# What's new in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

Azure Spring Apps is improved on an ongoing basis. To help you stay up to date with the most recent developments, this article provides you with information about the latest releases.

This article is updated quarterly, so revisit it regularly. You can also visit [Azure updates](https://azure.microsoft.com/updates/?query=azure%20spring), where you can search for updates or browse by category.

## Q3 2023

The following updates are now available in the Enterprise plan:

- **Spring Cloud Gateway enables you to set log level per logger name**: Spring Cloud Gateway now supports precise control over the generation of log messages and their respective verbosity levels. This enhancement enables you to concentrate your attention on specific areas within the codebase that warrant closer inspection and monitoring. For more information, see the [Configure log levels](how-to-configure-enterprise-spring-cloud-gateway.md#configure-log-levels) section of [Configure VMware Spring Cloud Gateway](how-to-configure-enterprise-spring-cloud-gateway.md) and [Troubleshoot VMware Spring Cloud Gateway](how-to-troubleshoot-enterprise-spring-cloud-gateway.md).

- **Spring Cloud Gateway supports a restart operation using the Azure portal and the Azure CLI**: This enhancement enables you to initiate a restart of Spring Cloud Gateway conveniently, either through the Azure portal or by using Azure CLI commands, in alignment with your preferred schedule. For more information, see the [Restart VMware Spring Cloud Gateway](how-to-configure-enterprise-spring-cloud-gateway.md#restart-vmware-spring-cloud-gateway) section of [Configure VMware Spring Cloud Gateway](how-to-configure-enterprise-spring-cloud-gateway.md).

- **Spring Cloud Gateway supports Cross-Origin Resource Sharing (CORS)**: Spring Cloud Gateway now enables you to restrict access to resources to specific domains by using Cross-Origin Resource Sharing (CORS). For more information, see the [Configure cross-origin resource sharing](how-to-configure-enterprise-spring-cloud-gateway.md#configure-cross-origin-resource-sharing) section of [Configure VMware Spring Cloud Gateway](how-to-configure-enterprise-spring-cloud-gateway.md).

- **Spring Cloud Gateway exposes addon properties**: This update enables you to configure advanced properties of Spring Cloud Gateway that serve specific use cases that might not be universally recommended. This capability brings you the flexibility to fine-tune Spring Cloud Gateway to address particular scenarios and requirements. For more information, see the [Update add-on configuration](how-to-configure-enterprise-spring-cloud-gateway.md#update-add-on-configuration) section of [Configure VMware Spring Cloud Gateway](how-to-configure-enterprise-spring-cloud-gateway.md).

- **API Portal supports single sign-on with multiple replicas**: This update removes the restriction that prevents you from getting better reliability by configuring multiple replicas of your API Portal instance when single sign-on is enabled. For more information, see the [Configure single sign-on (SSO)](how-to-use-enterprise-api-portal.md#configure-single-sign-on-sso) section of [Use API portal for VMware Tanzu](how-to-use-enterprise-api-portal.md).

- **Accelerator supports Git repositories in Azure DevOps**: Application Accelerator maintains ready-made, enterprise-conformant code and configurations in Git repositories. Now, Application Accelerator enables loading accelerators directly from Git repositories hosted in Azure DevOps. For more information, see the [Manage your own accelerators](how-to-use-accelerator.md#manage-your-own-accelerators) section of [Use VMware Tanzu Application Accelerator with the Azure Spring Apps Enterprise plan](how-to-use-accelerator.md).

- **Accelerator supports fragments and sub paths**: Application Accelerator supports fragments, enabling the efficient reuse of sections within an accelerator. This functionality saves you effort when you add new accelerators. For more information, see the [Reference a fragment in your own accelerators](how-to-use-accelerator.md#reference-a-fragment-in-your-own-accelerators) section of [Use VMware Tanzu Application Accelerator with the Azure Spring Apps Enterprise plan](how-to-use-accelerator.md).

- **Native image support**: Native images generally have smaller memory footprints and quicker startup times when compared to their JVM counterparts. With this feature, you can deploy Spring Boot native image applications using the `java-native-image` buildpack. For more information, see the [Deploy Java Native Image applications](how-to-enterprise-deploy-polyglot-apps.md#deploy-java-native-image-applications-preview) section of [How to deploy polyglot apps in the Azure Spring Apps Enterprise plan](how-to-enterprise-deploy-polyglot-apps.md).

- **Support for the PHP Buildpack**: You can use the PHP buildpack with PHP runtimes. For more information, see the [Deploy PHP applications](how-to-enterprise-deploy-polyglot-apps.md#deploy-php-applications) section of [How to deploy polyglot apps in the Azure Spring Apps Enterprise plan](how-to-enterprise-deploy-polyglot-apps.md).

- **New Relic APM support for .NET apps**: New Relic is a software analytics tool suite to measure and monitor performance bottlenecks, throughput, service health, and more. This update enables you to bind your .NET application with New Relic Application Performance Monitoring (APM). For more information, see the [Supported APM types](how-to-enterprise-configure-apm-integration-and-ca-certificates.md#supported-apm-types) section of [How to configure APM integration and CA certificates](how-to-enterprise-configure-apm-integration-and-ca-certificates.md).

The following update is now available in the Standard consumption and dedicated plan:

- **JHipster Azure Spring Apps**: With the collaboration between the [JHipster](https://www.jhipster.tech/azure/) and Azure Spring Apps teams, JHipster Azure Spring Apps is designed to streamline your full-stack Spring application development and deployment from end to end. For more information, see [Build and deploy your full-stack Spring app with JHipster Azure Spring Apps](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/build-and-deploy-your-full-stack-spring-app-with-jhipster-azure/ba-p/3923268).

## Q2 2023

The following update announces a new plan:

- **Azure Spring Apps Consumption and Dedicated plan**: This plan offers you customizable compute options (including memory optimization), single tenancy, and high availability to help you achieve price predictability, cost savings, and performance for running Spring applications at scale. For more information, see [Unleash Spring apps in a flex environment with Azure Spring Apps Consumption and Dedicated plans](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/unleash-spring-apps-in-a-flex-environment-with-azure-spring-apps/ba-p/3828232).

The following update is now available in all plans:

- **Azure Migrate for Spring Apps**: Discover and assess your Spring workloads for cloud readiness and get a price estimate for Azure Spring Apps using Azure Migrate. For more information, see [Discover and Assess Spring Apps with Azure Migrate - Preview Sign-Up](https://aka.ms/discover-spring-apps).

The following update is now available in the Consumption and Basic/Standard plans:

- **Azure Developer CLI (azd) for Azure Spring Apps**: Azure Developer CLI (azd) is an open-source tool that accelerates the time it takes for you to get your application from local development environment to Azure. You can now initialize, package, provision, and deploy a Spring application to Azure Spring Apps with only a few commands. Try it out using [Quickstart: Deploy your first web application to Azure Spring Apps](quickstart-deploy-web-app.md).

The following updates are now available in the Enterprise plan:

- **Shareable build result among Azure Spring Apps Enterprise instances (preview)**: This update enables you to have full visibility for Azure Spring Apps built images through bring-your-own Azure Container Registry (ACR) to support the following scenarios:

  - Build and test in a PREPROD environment and deploy to multiple PROD environments with the verified images.
  - Orchestrate a secure CICD pipeline to plug in any steps between build and deploy actions.

  For more information, see [How to deploy polyglot apps in the Azure Spring Apps Enterprise plan](how-to-enterprise-deploy-polyglot-apps.md) and [Use Azure Spring Apps CI/CD with GitHub Actions](how-to-github-actions.md?pivots=programming-language-java).

- **High Availability support for App Accelerator and App Live View**: App Accelerator and App Live View now support multiple replicas to offer high availability. For more information, see [Configure Tanzu Dev Tools in the Azure Spring Apps Enterprise plan](how-to-use-dev-tool-portal.md).

- **Spring Cloud Gateway auto scaling**: Spring Cloud Gateway now supports auto scaling to better serve the elastic traffic without the hassle of manual scaling. For more information, see the [Set up autoscale settings](how-to-configure-enterprise-spring-cloud-gateway.md?tabs=Azure-portal#set-up-autoscale-settings) section of [Configure VMware Spring Cloud Gateway](how-to-configure-enterprise-spring-cloud-gateway.md).

- **Application Configuration Service – polyglot support**: This update enables you to use Application Configuration Service to manage external configurations for any polyglot app, such as .NET, Go, and so on. For more information, see the [Polyglot support](how-to-enterprise-application-configuration-service.md#polyglot-support) section of [Use Application Configuration Service for Tanzu](how-to-enterprise-application-configuration-service.md).

- **Application Configuration Service – enhanced performance and security**: This update provides a dramatic performance enhancement in Git monitoring operations. This enhancement enables faster updates for configuration and certification verification over TLS between Application Configuration Service and Git repos. For more information, see [Use Application Configuration Service for Tanzu](how-to-enterprise-application-configuration-service.md).

- **1000 app instance support (preview)**: We've increased the maximum app instance count for one Azure Spring Apps Enterprise service instance to 1000 to support large-scale microservice clusters. For more information, see [Quotas and service plans for Azure Spring Apps](quotas.md).

- **App Accelerator certificate verification**: This update provides certification verification over TLS between App Accelerator and Git repos. For more information, see the [Configure accelerators with a self-signed certificate](how-to-use-accelerator.md#configure-accelerators-with-a-self-signed-certificate) section of [Use VMware Tanzu Application Accelerator with the Azure Spring Apps Enterprise plan](how-to-use-accelerator.md).

## Q1 2023

The following updates are now available in both the Basic/Standard and Enterprise plans:

- **Source code assessment for migration**: Assess your existing on-premises Spring applications for their readiness to migrate to Azure Spring Apps with Cloud Suitability Analyzer. This tool provides information on what types of changes are needed for migration, and how much effort is involved. For more information, see [Assess Spring applications with Cloud Suitability Analyzer](/azure/developer/java/migration/cloud-suitability-analyzer).

The following updates are now available in the Enterprise plan:

- **More options for build pools and enable queueing of build jobs**: Build service now supports a large build agent pool and enables at most one pool-sized build task to build, and twice the pool-sized build tasks to queue. For more information, see the [Build agent pool](how-to-enterprise-build-service.md#build-agent-pool) section of [Use Tanzu Build Service](how-to-enterprise-build-service.md).

- **Improved SLA support**: Improved SLA for mission-critical workloads. For more information, see [SLA for Azure Spring Apps](https://azure.microsoft.com/support/legal/sla/spring-apps).

- **High vCPU and memory app support**: Deployment support for large CPU and memory applications to support CPU intensive or memory intensive workloads. For more information, see [Deploy large CPU and memory applications in Azure Spring Apps in the Enterprise plan](how-to-enterprise-large-cpu-memory-applications.md).

- **SCG APM & certificate verification support**: You can enable the configuration of APM and TLS certificate verification between Spring Cloud Gateway and applications. For more information, see the [Configure application performance monitoring](how-to-configure-enterprise-spring-cloud-gateway.md#configure-application-performance-monitoring) section of [Configure VMware Spring Cloud Gateway](how-to-configure-enterprise-spring-cloud-gateway.md).

- **Tanzu Components on demand**: You can enable or disable Tanzu components after service provisioning. You can also learn how to do that per Tanzu component doc. For more information, see the [Enable/disable Application Configuration Service after service creation](how-to-enterprise-application-configuration-service.md#enabledisable-application-configuration-service-after-service-creation) section of [Use Application Configuration Service for Tanzu](how-to-enterprise-application-configuration-service.md).

## Q4 2022

The following updates are now available in both the Basic/Standard and Enterprise plans:

- **Ingress Settings**: With ingress settings, you can manage Azure Spring Apps traffic on the application level. This capability includes protocol support for gRPC, WebSocket and RSocket-on-WebSocket, session affinity, and send/read timeout. For more information, see [Customize the ingress configuration in Azure Spring Apps](how-to-configure-ingress.md).

- **Remote debugging**: Now, you can remotely debug your apps in Azure Spring Apps using IntelliJ or VS Code. For security reasons, by default, Azure Spring Apps disables remote debugging. You can enable remote debugging for your apps using Azure portal or Azure CLI and start debugging. For more information, see [Debug your apps remotely in Azure Spring Apps](how-to-remote-debugging-app-instance.md).

- **Connect to app instance shell environment for troubleshooting**: Azure Spring Apps offers many ways to troubleshoot your applications. For developers who like to inspect an app instance running environment, you can connect to the app instance’s shell environment and troubleshoot it. For more information, see [Connect to an app instance for troubleshooting](how-to-connect-to-app-instance-for-troubleshooting.md).

The following updates are now available in the Enterprise plan:

- **New managed Tanzu component - Application Live View from Tanzu Application Platform**: a lightweight insight and troubleshooting tool based on Spring Boot Actuators that helps app developers and app operators look inside running apps. Applications provide information from inside the running processes using HTTP endpoints. Application Live View uses those endpoints to retrieve and interact with the data from applications. For more information, see [Use Application Live View with the Azure Spring Apps Enterprise plan](how-to-use-application-live-view.md).

- **New managed Tanzu component – Application Accelerators from Tanzu Application Platform**: can speed up the process of building and deploying applications. They help you to bootstrap your applications and deploy them in a discoverable and repeatable way. For more information, see [Use VMware Tanzu Application Accelerator with the Azure Spring Apps Enterprise plan](how-to-use-accelerator.md).

- **Directly deploy static files**: If you have applications that have only static files such as HTML, you can directly deploy them with an automatically configured web server such as HTTPD and NGINX. This deployment capability includes front-end applications built with a JavaScript framework of your choice. You can do this deployment by using Tanzu Web Servers buildpack in behind. For more information, see [Deploy web static files](how-to-enterprise-deploy-static-file.md).

- **Managed Spring Cloud Gateway enhancement**: We have newly added app-level routing rule support to simplify your routing rule configuration and TLS support from the gateway to apps in managed Spring Cloud Gateway. For more information, see [Use Spring Cloud Gateway](how-to-use-enterprise-spring-cloud-gateway.md).

## Q3 2022

The following updates are now available to help customers reduce adoption barriers and pricing frictions to take full advantage of the capabilities offered by Azure Spring Apps Enterprise.

- **Price Reduction**: We have reduced the base unit of Azure Spring Apps Standard and Enterprise to 6 vCPUs and 12 GB of Memory and reduced the overage prices for vCPU and Memory. For more information, see [Azure Spring Apps pricing](https://azure.microsoft.com/pricing/details/spring-apps/)

- **Monthly Free Grant**: The first 50 vCPU-hours and 100 memory GB hours are free each month. For more information, see [Azure Spring Apps pricing](https://azure.microsoft.com/pricing/details/spring-apps/)

You can compare the price change from [Price Reduction - Azure Spring Apps does more, costs less!](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/price-reduction-azure-spring-apps-does-more-costs-less/ba-p/3614058).

## See also

For older updates, see [Azure updates](https://azure.microsoft.com/updates/?query=azure%20spring).
