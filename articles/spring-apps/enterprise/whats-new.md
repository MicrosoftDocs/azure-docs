---
title: What's New in Azure Spring Apps?
description: Learn about the new features and recent improvements in Azure Spring Apps.
author: KarlErickson
ms.author: hangwan
ms.service: azure-spring-apps
ms.topic: conceptual
ms.custom: devx-track-java
ms.date: 07/29/2024
---

# What's new in Azure Spring Apps?

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

Azure Spring Apps is improved on an ongoing basis. To help you stay up to date with the most recent developments, this article provides you with information about the latest releases.

This article is updated quarterly, so revisit it regularly. You can also visit [Azure updates](https://azure.microsoft.com/updates/?query=azure%20spring), where you can search for updates or browse by category.

## Q3 2024

The following updates are now available:

- **Conveniently access app logs in the Azure portal**: We now offer a more convenient and efficient way to query app logs and do log streaming on the Azure portal. This new approach supplements manually composing queries to fetch application logs from the Log Analytics workspace and accessing the log stream through the Azure CLI. For more information, see the [Stream logs](../basic-standard/how-to-log-streaming.md?tabs=azure-portal&toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json#stream-logs) section of [Stream Azure Spring Apps application console logs in real time](../basic-standard/how-to-log-streaming.md?tabs=azure-portal&toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json).

- **Regular infrastructure maintenance in the Enterprise plan**:
  - Regular upgrade to keep managed components up-to-date:
    - Service Registry: upgraded to 1.3.1.
    - Application Configuration Service: upgraded to 2.3.1, including a critical fix of missing content details in the logging for ConfigMap and secret creation.
    - Spring Cloud Gateway: upgraded to 2.2.5, including a critical fix for a routing rule persistence issue.
    - API Portal: upgraded to 1.5.0.
    - App Live View: upgraded to 1.8.0.
    - App Accelerator: upgraded to 1.8.1.
    - Build service:
      - Go buildpack: added support for Go 1.22, deprecated Go 1.20, changed default version from Go 1.20 to Go 1.21.
      - NodeJS buildpack: changed default version from Node.js 19 to Node.js 20.
      - Java Native Image buildpack: deprecated Java 20, added Java 21.
      - PHP buildpack: added PHP 8.3
  - Regular upgrade to keep Azure Kubernetes Service up-to-date: upgraded to 1.29.7.

- **Regular infrastructure maintenance in the Basic and Standard plans**:
  - Regular upgrade to keep managed components up-to-date:
    - Config server image: upgraded to 1.0.20240930.
    - Eureka server image: upgraded to 1.0.20240930.
    - Base image for apps: upgraded to Azure Linux 2.0.20231130.
  - Regular upgrade to keep Azure Kubernetes Service up-to-date: upgraded to 1.29.7.

## Q2 2024

The following updates are now available in the Enterprise plan:

- **Richer log of Application Configuration Service**: The Git revision is a crucial piece of information that indicates the recency of configuration files. Currently, the Application Configuration Service logs the Git revision to enhance troubleshooting efficiency. For more information, see the [Examine Git revisions of the configuration files](how-to-enterprise-application-configuration-service.md#examine-git-revisions-of-the-configuration-files) section of [Use Application Configuration Service for Tanzu](how-to-enterprise-application-configuration-service.md).

- **Managed OSS Spring Cloud Config Server (preview)**: The open-source version of Spring Cloud Config Server provides a native Spring experience to developers. Now we offer managed Spring Cloud Config Server to dynamically retrieve configuration properties from central repositories. For more information, see [Configure a managed Spring Cloud Config Server in Azure Spring App](../basic-standard/how-to-config-server.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json).

- **Custom actuator endpoint support**: Users might want to use a different port or path for the actuator due to security concerns, but this choice can result in the Application Live View being unable to connect to the app. This feature enables Application Live View to work with apps that have a non-default port or path for the actuator. For more information, see the [Configure customized Spring Boot actuator](how-to-use-application-live-view.md#configure-customized-spring-boot-actuator) section of [Use Application Live View with the Azure Spring Apps Enterprise plan](how-to-use-application-live-view.md).

- **Disable basic auth for the test endpoint of an app**: Azure Spring Apps provides basic authentication to protect the test endpoint of an application instance. When a user's app is integrated with their auth server, this basic authentication becomes unnecessary. If the user has a good understanding of the application's security, this feature lets them disable the basic authentication provided by the Azure Spring Apps service, making the tests against the application closer to a real-world environment. For more information, see the second tip in [Set up a staging environment in Azure Spring Apps](../basic-standard/how-to-staging-environment.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json).

- **Private storage access for virtual network injection**: The private storage access feature enables routing of traffic through a private network for backend storage hosting application assets like JAR files and logs. This feature enhances security and can potentially improve performance for users. For more information, see [Configure private network access for backend storage in your virtual network (Preview)](../basic-standard/how-to-private-network-access-backend-storage.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json).

- **Support Job (preview) in Azure Spring Apps**: This feature enables customers to run their ephemeral applications in Azure Spring Apps natively. It offers batch job management and execution, along with integration with managed components. For more information, see [Job in Azure Spring Apps (Preview)](concept-job.md).

## Q1 2024

The following updates are now available in the Enterprise plan:

- **Save up to 47%: Azure Spring Apps Enterprise is now eligible for Azure savings plan**: All Azure Spring Apps regions under the Enterprise plan are eligible for substantial cost savings – 20% for one year and 47% for three years – when you commit to the Azure savings plan. For more information, see [Azure Spring Apps Enterprise is now eligible for Azure savings plan for compute](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/azure-spring-apps-enterprise-is-now-eligible-for-azure-savings/ba-p/4021532).

- **Azure CLI supports log streaming for Spring Cloud Gateway**: This feature enables you to fetch the Spring Cloud Gateway log in real time for diagnosis purposes. For more information, see the [Use real-time log streaming](how-to-troubleshoot-enterprise-spring-cloud-gateway.md#use-real-time-log-streaming) section of [Troubleshoot VMware Spring Cloud Gateway](how-to-troubleshoot-enterprise-spring-cloud-gateway.md).

- **Azure CLI supports log streaming for Application Configuration Service**: The feature enables you to retrieve the Application Configuration Service log using the Azure CLI, making it possible to detect any configuration updates. For more information, see the [Use real-time log streaming](how-to-enterprise-application-configuration-service.md#use-real-time-log-streaming) section of [Use Application Configuration Service for Tanzu](how-to-enterprise-application-configuration-service.md).

- **Shows buildpack versions**: The latest feature added to buildpacks assists you in comprehending the version used and diagnosing issues associated with the build process.

- **Enhanced troubleshooting of Application Configuration Service**: Now you can directly view the linked `configMap` for your apps to further assist in troubleshooting issues with unrefreshed configurations. You can also export configuration files pulled by the Application Configuration Service from upstream Git repositories to your local environment through the Azure CLI. This process helps you examine the content and use configuration files for local development. For more information, see the [Examine configuration file in ConfigMap](how-to-enterprise-application-configuration-service.md#examine-configuration-file-in-configmap) section of [Use Application Configuration Service for Tanzu](how-to-enterprise-application-configuration-service.md).

## Q4 2023

The following updates are now available in the Enterprise plan:

- **Spring Cloud Gateway supports a response cache**: The response cache enables services and clients to efficiently store and reuse responses to HTTP requests. You can configure the memory size and the time-to-live of the cache and apply settings at the route-level or globally. For more information, see the [Configure the response cache](how-to-configure-enterprise-spring-cloud-gateway.md?tabs=Azure-portal#configure-the-response-cache) section of [Configure VMware Spring Cloud Gateway](how-to-configure-enterprise-spring-cloud-gateway.md).

- **API Portal supports enable/disable of the try-out option**: The try-out feature enables you to try out APIs through the centric view of API Portal. You can now easily turn this feature off if there's any security concern. For more information, see the [Try out APIs in API portal](how-to-use-enterprise-api-portal.md?tabs=Portal#try-out-apis-in-api-portal) section of [Use API portal for VMware Tanzu](how-to-use-enterprise-api-portal.md).

- **Service connector supports application-level settings**: This update enables you to efficiently configure common settings across deployments within one application. For more information, see the following articles:
  - [Connect an Azure Cosmos DB database to your application in Azure Spring Apps](../basic-standard/how-to-bind-cosmos.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json?tabs=Java%2CService-Connector)
  - [Connect Azure Cache for Redis to your application in Azure Spring Apps](../basic-standard/how-to-bind-redis.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json?tabs=Java%2CService-Connector)
  - [Connect an Azure Database for MySQL instance to your application in Azure Spring Apps](../basic-standard/how-to-bind-mysql.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json?tabs=Java%2CService-Connector)
  - [Bind an Azure Database for PostgreSQL to your application in Azure Spring Apps](../basic-standard/how-to-bind-postgres.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json?tabs=JavaFlex%2CPasswordlessflex%2CJavaSingle%2CPasswordlessSingle&pivots=postgresql-passwordless-single-server)

- **Richer information in the build history**: To help you better troubleshoot build-related issues for your apps, the build history now presents richer information for all builds. For more information, see the [Build history](how-to-enterprise-build-service.md?tabs=azure-portal#build-history) section of [Use Tanzu Build Service](how-to-enterprise-build-service.md).

The following update is now available in the Enterprise and Basic/Standard plans:

- **Planned maintenance (public preview)**: Azure Spring Apps regularly patches server-side components that your applications depend on to make sure they are secure and up to date. These components include the JDK, Spring Cloud middleware, APM, base OS image, and runtime infrastructure. For such patches to take effect, you need to restart your applications. With planned maintenance, you can schedule a time on a specific day for such mandatory restarts. For more information, see [How to configure planned maintenance (preview)](../basic-standard/how-to-configure-planned-maintenance.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json).

- **Auto sync of certificates**: Some Azure Spring Apps features secure your applications with certificates of your choice. With auto sync of certificates, you can now rotate your certificates in Azure Key Vault and they automatically sync to Azure Spring Apps. This enhancement makes it easier for you to manage features such as custom domain and TLS/SSL settings. For more information, see the [Auto sync certificate](../basic-standard/how-to-custom-domain.md?tabs=Azure-portal&toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json#auto-sync-certificate) section of [Map an existing custom domain to Azure Spring Apps](../basic-standard/how-to-custom-domain.md?tabs=Azure-portal&toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json).

## Q3 2023

The following updates are now available in the Enterprise plan:

- **Spring Cloud Gateway enables you to set log level per logger name**: Spring Cloud Gateway now supports precise control over the generation of log messages and their respective verbosity levels. This enhancement enables you to concentrate your attention on specific areas within the codebase that warrant closer inspection and monitoring. For more information, see the [Configure log levels](how-to-configure-enterprise-spring-cloud-gateway.md#configure-log-levels) section of [Configure VMware Spring Cloud Gateway](how-to-configure-enterprise-spring-cloud-gateway.md) and [Troubleshoot VMware Spring Cloud Gateway](how-to-troubleshoot-enterprise-spring-cloud-gateway.md).

- **Spring Cloud Gateway supports a restart operation using the Azure portal and the Azure CLI**: This enhancement enables you to initiate a restart of Spring Cloud Gateway conveniently, either through the Azure portal or by using Azure CLI commands, in alignment with your preferred schedule. For more information, see the [Restart VMware Spring Cloud Gateway](how-to-configure-enterprise-spring-cloud-gateway.md#restart-vmware-spring-cloud-gateway) section of [Configure VMware Spring Cloud Gateway](how-to-configure-enterprise-spring-cloud-gateway.md).

- **Spring Cloud Gateway supports Cross-Origin Resource Sharing (CORS)**: Spring Cloud Gateway now enables you to restrict access to resources to specific domains by using Cross-Origin Resource Sharing (CORS). For more information, see the [Configure cross-origin resource sharing](how-to-configure-enterprise-spring-cloud-gateway.md#configure-cross-origin-resource-sharing) section of [Configure VMware Spring Cloud Gateway](how-to-configure-enterprise-spring-cloud-gateway.md).

- **Spring Cloud Gateway exposes addon properties**: This update enables you to configure advanced properties of Spring Cloud Gateway that serve specific use cases that might not be universally recommended. This capability brings you the flexibility to fine-tune Spring Cloud Gateway to address particular scenarios and requirements. For more information, see the [Update add-on configuration](how-to-configure-enterprise-spring-cloud-gateway.md#update-add-on-configuration) section of [Configure VMware Spring Cloud Gateway](how-to-configure-enterprise-spring-cloud-gateway.md).

- **API Portal supports single sign-on with multiple replicas**: This update removes the restriction that prevents you from getting better reliability by configuring multiple replicas of your API Portal instance when single sign-on is enabled. For more information, see the [Configure single sign-on (SSO)](how-to-use-enterprise-api-portal.md#configure-single-sign-on-sso) section of [Use API portal for VMware Tanzu](how-to-use-enterprise-api-portal.md).

- **App Accelerator supports Git repositories in Azure DevOps**: Application Accelerator maintains ready-made, enterprise-conformant code and configurations in Git repositories. Now, Application Accelerator enables loading accelerators directly from Git repositories hosted in Azure DevOps. For more information, see the [Manage your own accelerators](how-to-use-accelerator.md#manage-your-own-accelerators) section of [Use VMware Tanzu Application Accelerator with the Azure Spring Apps Enterprise plan](how-to-use-accelerator.md).

- **App Accelerator supports fragments and sub paths**: Application Accelerator supports fragments, enabling the efficient reuse of sections within an accelerator. This functionality saves you effort when you add new accelerators. For more information, see the [Reference a fragment in your own accelerators](how-to-use-accelerator.md#reference-a-fragment-in-your-own-accelerators) section of [Use VMware Tanzu Application Accelerator with the Azure Spring Apps Enterprise plan](how-to-use-accelerator.md).

- **Java native image support (preview)**: Native images generally have smaller memory footprints and quicker startup times when compared to their JVM counterparts. With this feature, you can deploy Spring Boot native image applications using the `java-native-image` buildpack. For more information, see the [Deploy Java Native Image applications](how-to-enterprise-deploy-polyglot-apps.md#deploy-java-native-image-applications-preview) section of [How to deploy polyglot apps in the Azure Spring Apps Enterprise plan](how-to-enterprise-deploy-polyglot-apps.md).

- **Support for the PHP Buildpack**: You can deploy PHP apps directly from source code and receive continuous maintenance (CVE fixes) for the automatic built images. For more information, see the [Deploy PHP applications](how-to-enterprise-deploy-polyglot-apps.md#deploy-php-applications) section of [How to deploy polyglot apps in the Azure Spring Apps Enterprise plan](how-to-enterprise-deploy-polyglot-apps.md).

- **New Relic APM support for .NET apps**: New Relic is a software analytics tool suite to measure and monitor performance bottlenecks, throughput, service health, and more. This update enables you to bind your .NET application with New Relic Application Performance Monitoring (APM). For more information, see the [Supported APM types](how-to-enterprise-configure-apm-integration-and-ca-certificates.md#supported-apm-types) section of [How to configure APM integration and CA certificates](how-to-enterprise-configure-apm-integration-and-ca-certificates.md).

The following update is now available in the Standard consumption and dedicated plan:

- **JHipster Azure Spring Apps**: With the collaboration between the [JHipster](https://www.jhipster.tech/azure/) and Azure Spring Apps teams, JHipster Azure Spring Apps is designed to streamline your full-stack Spring application development and deployment from end to end. For more information, see [Build and deploy your full-stack Spring app with JHipster Azure Spring Apps](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/build-and-deploy-your-full-stack-spring-app-with-jhipster-azure/ba-p/3923268).

## Q2 2023

The following update announces a new plan:

- **Azure Spring Apps Consumption and Dedicated plan**: This plan offers you customizable compute options (including memory optimization), single tenancy, and high availability to help you achieve price predictability, cost savings, and performance for running Spring applications at scale. For more information, see [Unleash Spring apps in a flex environment with Azure Spring Apps Consumption and Dedicated plans](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/unleash-spring-apps-in-a-flex-environment-with-azure-spring-apps/ba-p/3828232).

The following update is now available in all plans:

- **Azure Migrate for Spring Apps**: Discover and assess your Spring workloads for cloud readiness and get a price estimate for Azure Spring Apps using Azure Migrate. For more information, see [Discover and Assess Spring Apps with Azure Migrate - Preview Sign-Up](https://aka.ms/discover-spring-apps).

The following update is now available in the Consumption and Basic/Standard plans:

- **Azure Developer CLI (azd) for Azure Spring Apps**: Azure Developer CLI (azd) is an open-source tool that accelerates the time it takes for you to get your application from local development environment to Azure. You can now initialize, package, provision, and deploy a Spring application to Azure Spring Apps with only a few commands. Try it out using [Quickstart: Deploy your first web application to Azure Spring Apps](../basic-standard/quickstart-deploy-web-app.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json).

The following updates are now available in the Enterprise plan:

- **Shareable build result among Azure Spring Apps Enterprise instances (preview)**: This update enables you to have full visibility for Azure Spring Apps built images through bring-your-own Azure Container Registry (ACR) to support the following scenarios:

  - Build and test in a PREPROD environment and deploy to multiple PROD environments with the verified images.
  - Orchestrate a secure CICD pipeline to plug in any steps between build and deploy actions.

  For more information, see [How to deploy polyglot apps in the Azure Spring Apps Enterprise plan](how-to-enterprise-deploy-polyglot-apps.md) and [Use Azure Spring Apps CI/CD with GitHub Actions](../basic-standard/how-to-github-actions.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json?pivots=programming-language-java).

- **High Availability support for App Accelerator and App Live View**: App Accelerator and App Live View now support multiple replicas to offer high availability. For more information, see [Configure Tanzu Dev Tools in the Azure Spring Apps Enterprise plan](how-to-use-dev-tool-portal.md).

- **Spring Cloud Gateway auto scaling**: Spring Cloud Gateway now supports auto scaling to better serve the elastic traffic without the hassle of manual scaling. For more information, see the [Set up autoscale settings](how-to-configure-enterprise-spring-cloud-gateway.md?tabs=Azure-portal#set-up-autoscale-settings) section of [Configure VMware Spring Cloud Gateway](how-to-configure-enterprise-spring-cloud-gateway.md).

- **Application Configuration Service – polyglot support**: This update enables you to use Application Configuration Service to manage external configurations for any polyglot app, such as .NET, Go, and so on. For more information, see the [Polyglot support](how-to-enterprise-application-configuration-service.md#polyglot-support) section of [Use Application Configuration Service for Tanzu](how-to-enterprise-application-configuration-service.md).

- **Application Configuration Service – enhanced performance and security**: This update provides a dramatic performance enhancement in Git monitoring operations. This enhancement enables faster updates for configuration and certification verification over TLS between Application Configuration Service and Git repos. For more information, see [Use Application Configuration Service for Tanzu](how-to-enterprise-application-configuration-service.md).

- **1000 app instance support (preview)**: We've increased the maximum app instance count for one Azure Spring Apps Enterprise service instance to 1000 to support large-scale microservice clusters. For more information, see [Quotas and service plans for Azure Spring Apps](../basic-standard/quotas.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json).

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

- **Ingress Settings**: With ingress settings, you can manage Azure Spring Apps traffic on the application level. This capability includes protocol support for gRPC, WebSocket and RSocket-on-WebSocket, session affinity, and send/read timeout. For more information, see [Customize the ingress configuration in Azure Spring Apps](../basic-standard/how-to-configure-ingress.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json).

- **Remote debugging**: Now, you can remotely debug your apps in Azure Spring Apps using IntelliJ or VS Code. For security reasons, by default, Azure Spring Apps disables remote debugging. You can enable remote debugging for your apps using Azure portal or Azure CLI and start debugging. For more information, see [Debug your apps remotely in Azure Spring Apps](../basic-standard/how-to-remote-debugging-app-instance.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json).

- **Connect to app instance shell environment for troubleshooting**: Azure Spring Apps offers many ways to troubleshoot your applications. For developers who like to inspect an app instance running environment, you can connect to the app instance's shell environment and troubleshoot it. For more information, see [Connect to an app instance for troubleshooting](../basic-standard/how-to-connect-to-app-instance-for-troubleshooting.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json).

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
