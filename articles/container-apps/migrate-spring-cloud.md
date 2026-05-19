---
title: Migrate Spring Cloud applications to Azure Container Apps
description: Learn what you should be aware of when you want to migrate an existing Spring Cloud application to run on Azure Container Apps.
ms.author: deepganguly
author: deepganguly
ms.service: azure-container-apps
ms.topic: conceptual
ms.date: 03/09/2026
---

# Migrate Spring Cloud applications to Azure Container Apps

This guide describes what you should be aware of when you migrate an existing Spring Cloud application to run on Azure Container Apps.

## Pre-migration

To ensure a successful migration, complete the assessment and inventory steps described in the following sections before you start.

If you can't meet any of these pre-migration requirements, see the following companion migration guides:

- Migrate executable JAR applications to containers on Azure Kubernetes Service (guidance planned)
- Migrate executable JAR applications to Azure Virtual Machines (guidance planned)

### Inspect application components

#### Determine whether and how the file system is used

[!INCLUDE [migrate-java-pre-migration-file-system](includes/migrate-java-pre-migration-file-system.md)]

#### Determine whether any of the services contain OS-specific code

[!INCLUDE [migrate-java-pre-migration-os-code](includes/migrate-java-pre-migration-os-code.md)]

#### Switch to a supported platform

[!INCLUDE [migrate-java-pre-migration-platform](includes/migrate-java-pre-migration-platform.md)]

#### Identify Spring Boot versions

[!INCLUDE [migrate-java-pre-migration-spring-boot-version](includes/migrate-java-pre-migration-spring-boot-version.md)]

#### Identify Spring Cloud versions

Examine the dependencies of each application you're migrating to determine the version of the Spring Cloud components it uses.

##### Maven

In Maven projects, set the Spring Cloud version in the `spring-cloud.version` property:

```xml
  <properties>
    <spring-cloud.version>2023.0.2</spring-cloud.version>
  </properties>
```

##### Gradle

In Gradle projects, set the Spring Cloud version in the "extra properties" block:

```gradle
ext {
  set('springCloudVersion', "2023.0.2")
}
```

You need to update all applications to use supported versions of Spring Cloud. For supported versions, see the [Spring Cloud](https://spring.io/projects/spring-cloud#overview) documentation.

#### Identify log aggregation solutions

Identify any log aggregation solutions that the applications you're migrating use. You need to configure diagnostic settings in migration to make logged events available for consumption. For more information, see the [Ensure console logging and configure diagnostic settings](#ensure-console-logging-and-configure-diagnostic-settings) section.

#### Identify application performance management (APM) agents

Identify any application performance management agents that your applications use. Azure Container Apps doesn't offer built-in support for APM integration. You need to prepare your container image or integrate APM tool directly into your code. If you want to measure your application's performance but didn't integrate any APM yet, consider using Azure Application Insights. For more information, see the [Migration](#migration) section.

### Inventory external resources

Identify external resources, such as data sources, JMS message brokers, and URLs of other services. In Spring Cloud applications, you typically find the configuration for such resources in one of the following locations:

- In the *src/main/resources* folder, in a file typically called *application.properties* or *application.yml*.
- In the Spring Cloud Config Server repository that you identified in the previous step.

#### Databases

[!INCLUDE [migrate-java-pre-migration-databases](includes/migrate-java-pre-migration-databases.md)]

#### JMS message brokers

[!INCLUDE [migrate-java-pre-migration-jms](includes/migrate-java-pre-migration-jms.md)]

#### Identify external caches

[!INCLUDE [migrate-java-pre-migration-caches](includes/migrate-java-pre-migration-caches.md)]

#### Identity providers

Identify all identity providers and all Spring Cloud applications that require authentication and authorization. For information on how you can configure identity providers, see the following resources:

- For OAuth2 configuration, see the [Spring Cloud Security quickstart](https://spring.io/projects/spring-cloud-security).
- For Auth0 Spring Security configuration, see the [Auth0 Spring Security documentation](https://auth0.com/docs/quickstart/backend/java-spring-security5).
- For PingFederate Spring Security configuration, see the [Auth0 PingFederate instructions](https://auth0.com/authenticate/java-spring-security/ping-federate/).

#### Resources configured through VMware Tanzu Application Service (TAS) (formerly Pivotal Cloud Foundry)

For applications managed with TAS, you often configure external resources, including the resources described earlier, through TAS service bindings. To examine the configuration for such resources, use the [TAS (Cloud Foundry) CLI](https://docs.cloudfoundry.org/cf-cli/) to view the `VCAP_SERVICES` variable for the application.

```bash
# Log into TAS, if needed (enter credentials when prompted)
cf login -a <API endpoint>

# Set the organization and space containing the application, if not already selected during login.
cf target org <organization name>
cf target space <space name>

# Display variables for the application
cf env <Application Name>
```

Examine the `VCAP_SERVICES` variable for configuration settings of external services bound to the application. For more information, see the [TAS (Cloud Foundry) documentation](https://docs.cloudfoundry.org/devguide/deploy-apps/environment-variable.html#VCAP-SERVICES).

#### All other external resources

It's not feasible for this guide to document every possible external dependency. After the migration, you need to verify that you can satisfy every external dependency of your application.

### Inventory configuration sources and secrets

#### Inventory passwords and secure strings

Check all properties, configuration files, and environment variables in the production deployments for any secret strings and passwords. In a Spring Cloud application, you typically find these strings in the *application.properties* or *application.yml* file in individual services or in the Spring Cloud Config Server repository.

#### Inventory certificates

[!INCLUDE [migrate-java-pre-migration-certificates](includes/migrate-java-pre-migration-certificates.md)]

#### Determine whether Spring Cloud Vault is used

If you use Spring Cloud Vault to store and access secrets, identify the backing secret store - for example, HashiCorp Vault or CredHub. Then identify all the secrets that the application code uses.

#### Locate the configuration server source

If your application uses a [Spring Cloud Config Server](https://docs.spring.io/spring-cloud-config/docs/current/reference/html/#_spring_cloud_config_server), identify where the configuration is stored. You typically find this setting in the *bootstrap.yml* or *bootstrap.properties* file, or sometimes in the *application.yml* or *application.properties* file. The setting looks like the following example:

```properties
spring.cloud.config.server.git.uri: file://${user.home}/spring-cloud-config-repo
```

While git is most commonly used as Spring Cloud Config Server's backing datastore, as shown earlier, your application might use one of the other possible backends. Consult the [Spring Cloud Config Server documentation](https://docs.spring.io/spring-cloud-config/docs/current/reference/html/#_environment_repository) for information on other backends, such as [Relational Database (JDBC)](https://docs.spring.io/spring-cloud-config/docs/current/reference/html/#_jdbc_backend), [SVN](https://docs.spring.io/spring-cloud-config/docs/current/reference/html/#_version_control_backend_filesystem_use), and [the local file system](https://docs.spring.io/spring-cloud-config/docs/current/reference/html/#_file_system_backend).

### Inspect the deployment architecture

#### Document hardware requirements for each service

For each of your Spring Cloud services (not including the configuration server, registry, or gateway), document the following information:

- The number of instances running.
- The number of CPUs allocated to each instance.
- The amount of RAM allocated to each instance.

#### Document geo-replication and distribution

Determine whether the Spring Cloud applications are currently distributed among several regions or data centers. Document the uptime requirements and SLA for the applications you're migrating.

#### Identify clients that bypass the service registry

Identify any client applications that invoke any of the services to be migrated without using the Spring Cloud Service Registry. After the migration, such invocations are no longer possible. Update these clients to use [Spring Cloud OpenFeign](https://spring.io/projects/spring-cloud-openfeign) before migration.

## Migration

### Remove restricted configurations

The Azure Container Apps environment offers managed Eureka Server, Spring Cloud Config Server, and Admin. When you bind an application to the Java component, Azure Container Apps injects related properties as system environment variables. According to the [Spring Boot Externalized Configuration](https://docs.spring.io/spring-boot/reference/features/external-config.html) design, system environment variables overwrite application properties defined in your code or packaged in artifacts.

If you set one of the following properties through a command-line argument, a Java system property, or the container's environment variable, remove it to avoid conflicts and unexpected behavior:

- `SPRING_CLOUD_CONFIG_COMPONENT_URI`
- `SPRING_CLOUD_CONFIG_URI`
- `SPRING_CONFIG_IMPORT`
- `eureka.client.fetch-registry`
- `eureka.client.service-url.defaultZone`
- `eureka.instance.prefer-ip-address`
- `eureka.client.register-with-eureka`
- `SPRING_BOOT_ADMIN_CLIENT_INSTANCE_PREFER-IP`
- `SPRING_BOOT_ADMIN_CLIENT_URL`

### Create an Azure Container Apps managed environment and apps

Provision an Azure Container Apps app in your Azure subscription on an existing managed environment or create a new one for every service you're migrating. You don't need to create apps that run as Spring Cloud registry and Configuration servers. For more information, see [Quickstart: Deploy your first container app using the Azure portal](quickstart-portal.md).

### Prepare the Spring Cloud Config Server

Configure the Config server in your Azure Container Apps for Spring component. For more information, see [Configure settings for the Config Server for Spring component in Azure Container Apps](java-config-server.md).

> [!NOTE]
> If your current Spring Cloud Config repository is on the local file system or on-premises, you first need to migrate or replicate your configuration files to a cloud-based repository, such as GitHub, Azure Repos, or BitBucket.

### Ensure console logging and configure diagnostic settings

Configure your logging to ensure that all output goes to the console rather than to files.

After you deploy an application to Azure Container Apps, you can configure the logging options within your Container Apps environment to define one or more destinations for the logs. These destinations can include Azure Monitor Log Analytics, Azure Event Hubs, or even other third-party monitoring solutions. You can also disable log data and view logs only at runtime. For detailed configuration instructions, see [Log storage and monitoring options in Azure Container Apps](log-options.md).

### Configure persistent storage

If any part of your application reads or writes to the local file system, you need to configure persistent storage to replace the local file system. You can specify the path to mount in the container through the app settings and align it with the path your app is using. For more information, see [Use storage mounts in Azure Container Apps](storage-mounts.md).

### Migrate Spring Cloud Vault secrets to Azure Key Vault

You can inject secrets directly into applications through Spring by using the Azure Key Vault Spring Boot Starter. For more information, see [How to use the Spring Boot Starter for Azure Key Vault](/azure/developer/java/spring-framework/configure-spring-boot-starter-java-app-with-azure-key-vault).

> [!NOTE]
> Migration might require you to rename some secrets. Update your application code accordingly.

### Migrate all certificates to Key Vault

Azure Container Apps supports secure communication between apps. Your application doesn't need to manage the process of establishing secure communication. You can upload the private certificate to Azure Container Apps or use a free managed certificate provided by Azure Container Apps. Using Azure Key Vault to manage certificates is a recommended approach. For more information, see [Certificates in Azure Container Apps](certificates-overview.md).

### Configure application performance management (APM) integrations

If you already configured APM-related variables within the container, ensure that you can connect to the target APM platform. If the APM configuration references environment variables from the container, set the runtime environment variables accordingly on Azure Container Apps. Handle sensitive information, such as the connection string, securely. You can either specify it as a secret or reference a secret stored in Azure Key Vault.

### Configure per-service secrets and externalized settings

You can inject configuration settings into each container as environment variables. Any changes in the variables create a new revision for the existing app. Secrets are key-value pairs and remain valid across all revisions.

### Migrate and enable the identity provider

If any of the Spring Cloud applications require authentication or authorization, use the following guidelines to ensure that they're configured to access the identity provider:

- If the identity provider is Microsoft Entra ID, don't make any changes.
- If the identity provider is an on-premises Active Directory forest, consider implementing a hybrid identity solution with Microsoft Entra ID. For guidance, see the [Hybrid identity documentation](/azure/active-directory/hybrid/).
- If the identity provider is another on-premises solution, such as PingFederate, consult the [Custom installation of Microsoft Entra Connect](/azure/active-directory/hybrid/how-to-connect-install-custom) topic to configure federation with Microsoft Entra ID. Alternatively, consider using Spring Security to use your identity provider through [OAuth2/OpenID Connect](https://docs.spring.io/spring-security/reference/index.html) or [SAML](https://docs.spring.io/spring-security/reference/index.html).

### Update client applications

Update the configuration of all client applications to use the published Azure Container Apps endpoints for migrated applications.

## Post-migration

After you complete the migration, verify that your application works as expected. The following sections describe recommendations for making your application more cloud-native and operationally robust.

### Optimize for cloud-native patterns

The following recommendations help you adopt Spring Cloud components and Azure Container Apps managed Java components to make your application more cloud-native.

[!INCLUDE [migrate-java-post-migration-spring-components](includes/migrate-java-post-migration-spring-components.md)]

### Improve operational readiness

The following recommendations help you strengthen reliability, observability, and deployment practices for your migrated application.

[!INCLUDE [migrate-java-post-migration-operations](includes/migrate-java-post-migration-operations.md)]

### Replace legacy Spring Cloud Netflix components

If your applications use legacy Spring Cloud Netflix components, consider replacing them with current alternatives, as shown in the following table:

| Legacy component | Current alternative |
| --- | --- |
| Spring Cloud Eureka | Spring Cloud Service Registry |
| Spring Cloud Netflix Zuul | Spring Cloud Gateway |
| Spring Cloud Netflix Archaius | Spring Cloud Config Server |
| Spring Cloud Netflix Ribbon | Spring Cloud Load Balancer (client-side load balancer) |
| Spring Cloud Hystrix | Spring Cloud Circuit Breaker + Resilience4J |
| Spring Cloud Netflix Turbine | Micrometer + Prometheus |
