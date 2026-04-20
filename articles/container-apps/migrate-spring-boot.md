---
title: Migrate Spring Boot applications to Azure Container Apps
description: Learn how to assess, migrate, and optimize an existing Spring Boot application for Azure Container Apps.
ms.author: deepganguly
author: deepganguly
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 03/11/2026
---

# Migrate Spring Boot applications to Azure Container Apps

This guide walks you through the process of migrating an existing Spring Boot application to Azure Container Apps. It covers pre-migration assessment, the migration itself, and post-migration optimization.

## Prerequisites

- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- [Azure CLI](/cli/azure/install-azure-cli) installed, or access to the [Azure portal](https://portal.azure.com).
- Familiarity with Spring Boot application development and Docker containers.
- A supported JDK version (8, 11, 17, or 21). For more information, see [Java on Azure Container Apps overview](java-overview.md).

## pre-migration assessment

Before you start the migration, complete the assessment and inventory steps described in the following sections.

### Identify local state

In a platform as a service (PaaS) environment, no application guarantees that it runs as exactly one instance at any given time. Even if you configure a single instance, a duplicate instance can be created when:

- The system must relocate the application to a physical host due to failure or system update.
- The system updates the application.

In both cases, the original instance remains running until the new instance finishes starting. This behavior has the following implications for your application:

- You can't guarantee that any [singleton](https://en.wikipedia.org/wiki/Singleton_pattern) is truly single.
- You're likely to lose any data not persisted to external storage.

Before migrating to Azure Container Apps, ensure that your code doesn't contain local state that must not be lost or duplicated. If local state exists, refactor the code to store that state externally. Cloud-ready applications typically store state in one of the following locations:

- [Azure Cache for Redis](/azure/azure-cache-for-redis/cache-java-get-started)
- [Azure Cosmos DB](/azure/cosmos-db/create-sql-api-java)
- An external database, such as [Azure SQL](/azure/azure-sql/azure-sql-iaas-vs-paas-what-is-overview), [Azure Database for MySQL](/azure/mysql/overview), or [Azure Database for PostgreSQL](/azure/postgresql/overview)
- [Azure Storage](/azure/storage/blobs) for unstructured data or serialized objects

### Review file system usage

[!INCLUDE [migrate-java-pre-migration-file-system](includes/migrate-java-pre-migration-file-system.md)]

### Check for OS-specific code

[!INCLUDE [migrate-java-pre-migration-os-code](includes/migrate-java-pre-migration-os-code.md)]

### Verify platform compatibility

[!INCLUDE [migrate-java-pre-migration-platform](includes/migrate-java-pre-migration-platform.md)]

#### Identify your Spring Boot version

[!INCLUDE [migrate-java-pre-migration-spring-boot-version](includes/migrate-java-pre-migration-spring-boot-version.md)]

### Identify scheduled jobs

Ephemeral applications such as Unix cron jobs or short-lived applications based on the Spring Batch framework should run as a job on Azure Container Apps. For more information, see [Jobs in Azure Container Apps](jobs.md).

If your application is long-running and executes tasks regularly by using a scheduling framework (such as Quartz or Spring Batch), you can host it on Azure Container Apps. However, the application must handle scaling appropriately to avoid race conditions where the same task runs more than once per scheduled period during scale-out or rolling upgrades.

Take inventory of any scheduled tasks running on the production servers, inside or outside your application code.

### Inventory external resources

Identify external resources, such as data sources, JMS message brokers, and URLs of other services. In Spring Boot applications, you typically find the configuration for such resources in the *src/main/resources* folder, in a file typically called *application.properties* or *application.yml*.

#### Databases

[!INCLUDE [migrate-java-pre-migration-databases](includes/migrate-java-pre-migration-databases.md)]

#### JMS message brokers

[!INCLUDE [migrate-java-pre-migration-jms](includes/migrate-java-pre-migration-jms.md)]

#### External caches

[!INCLUDE [migrate-java-pre-migration-caches](includes/migrate-java-pre-migration-caches.md)]

#### Identity providers

Identify any identity providers that your application uses. For information on how to configure identity providers, see the following resources:

- For OAuth2 configuration, see the [Spring Security reference](https://docs.spring.io/spring-security/reference/index.html).
- For Auth0 Spring Security configuration, see the [Auth0 Spring Security documentation](https://auth0.com/docs/quickstart/backend/java-spring-security5).
- For PingFederate Spring Security configuration, see the [Auth0 PingFederate instructions](https://auth0.com/authenticate/java-spring-security/ping-federate/).

#### Nonstandard ports

By using Azure Container Apps, you can expose ports based on your container app resource configuration. A Spring Boot application listens on port 8080 by default, but you can change this port by using `server.port` or the `SERVER_PORT` environment variable.

#### All other external resources

This guide can't document every possible external dependency. After the migration, verify that you can satisfy every external dependency of your application.

### Inventory configuration, secrets, and certificates

#### Passwords and secure strings

Check all properties, configuration files, and environment variables in the production deployments for any secret strings and passwords. In a Spring Boot application, you typically find these strings in the *application.properties* or *application.yml* file.

#### Certificates

[!INCLUDE [migrate-java-pre-migration-certificates](includes/migrate-java-pre-migration-certificates.md)]

### Assess logging and APM

Identify any log aggregation solutions that the applications you're migrating use. You need to configure diagnostic settings during migration to make logged events available for consumption. For more information, see the [Configure logging and diagnostics](#configure-logging-and-diagnostics) section.

Identify any application performance management (APM) agents that your applications use. Azure Container Apps doesn't offer built-in APM support. You need to prepare your container image or integrate the APM tool directly into your code. If you want to measure your application's performance but didn't integrate any APM yet, consider using Azure Application Insights. For more information, see the [Integrate application performance monitoring](#integrate-application-performance-monitoring) section.

### Document deployment architecture

Document the following information for your Spring Boot application:

- The number of instances running.
- The number of CPUs allocated to each instance.
- The amount of RAM allocated to each instance.

Also determine whether you're currently distributing your application instances among several regions or data centers. Document the uptime requirements and SLA for the applications you're migrating.

## Migration

### Create a Container Apps environment

Create a Container Apps environment in your Azure subscription. For more information, see [Quickstart: Deploy your first container app using the Azure portal](quickstart-portal.md).

### Configure logging and diagnostics

Configure your logging to route all output to the console instead of to files.

After you deploy the application to Azure Container Apps, you can configure the logging options within your Container Apps environment to define one or more log destinations. These destinations can include Azure Monitor Log Analytics, Azure Event Hubs, or non-Microsoft monitoring solutions. You can also disable log data storage and view logs only at runtime. For configuration instructions, see [Log storage and monitoring options in Azure Container Apps](log-options.md).

### Configure persistent storage

If any part of your application reads or writes to the local file system, configure persistent storage to replace it. Specify the path to mount in the container through the app settings and align it with the path your application uses. For more information, see [Use storage mounts in Azure Container Apps](storage-mounts.md).

### Migrate certificates to Azure Key Vault

Azure Container Apps supports secure communication between apps. Your application doesn't need to manage the process of establishing secure communication. You can upload a private certificate to Azure Container Apps or use a free managed certificate. Using Azure Key Vault to manage certificates is the recommended approach. For more information, see [Certificates in Azure Container Apps](certificates-overview.md).

### Integrate application performance monitoring

Whether you deploy your app from a container image or from code, Azure Container Apps doesn't interfere with your image or code. Integrating your application with an APM tool depends on your preferences and implementation.

If your application isn't using a supported APM, consider Azure Application Insights. For more information, see [Using Azure Monitor Application Insights with Spring Boot](/azure/azure-monitor/app/java-spring-boot).

### Deploy the application

Deploy each of your migrated microservices (not including Spring Cloud Config Server and Spring Cloud Service Registry), as described in [Deploy Azure Container Apps with the `az containerapp up` command](containerapp-up.md).

### Configure secrets and environment variables

You can inject configuration settings into each application as environment variables. Set these variables as manual entries or as references to secrets. For more information, see [Manage environment variables on Azure Container Apps](environment-variables.md).

### Set up identity and authentication

If any of your Spring Boot applications require authentication or authorization, ensure they're configured to access the identity provider:

- If the identity provider is Microsoft Entra ID, don't make any changes.
- If the identity provider is an on-premises Active Directory forest, consider implementing a hybrid identity solution with Microsoft Entra ID. For more information, see the [Hybrid identity documentation](/azure/active-directory/hybrid/).

- If the identity provider is another on-premises solution, such as PingFederate, see [Custom installation of Microsoft Entra Connect](/azure/active-directory/hybrid/how-to-connect-install-custom) to configure federation with Microsoft Entra ID.

Alternatively, consider using Spring Security to use your identity provider through [OAuth2/OpenID Connect](https://docs.spring.io/spring-security/reference/index.html) or [SAML](https://docs.spring.io/spring-security/reference/index.html).

### Expose the application

By default, an application deployed to Azure Container Apps is accessible through an application URL. If you deploy your app in a managed environment with its own virtual network, determine the app's accessibility level to allow public ingress or ingress from your virtual network only. For more information, see [Networking in Azure Container Apps environment](networking.md).

## Post-migration

After you complete the migration, verify that your application works as expected. The following sections describe recommendations for making your application more cloud-native and operationally robust.

### Optimize for cloud-native patterns

The following recommendations help you adopt Spring Cloud components and Azure Container Apps managed Java components to make your application more cloud-native.

[!INCLUDE [migrate-java-post-migration-spring-components](includes/migrate-java-post-migration-spring-components.md)]

### Improve operational readiness

The following recommendations help you strengthen reliability, observability, and deployment practices for your migrated application.

[!INCLUDE [migrate-java-post-migration-operations](includes/migrate-java-post-migration-operations.md)]

## Related content

- [Java on Azure Container Apps overview](java-overview.md)
- [Quickstart: Deploy your first container app using the Azure portal](quickstart-portal.md)
- [Migrate Spring Cloud applications to Azure Container Apps](migrate-spring-cloud.md)
- [Migrate Tomcat applications to Azure Container Apps](migrate-tomcat.md)
