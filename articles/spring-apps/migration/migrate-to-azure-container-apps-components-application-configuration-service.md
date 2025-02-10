---
title: Migrate Application Configuration Service to Config Server for Spring in Azure Container Apps
description: Describes how to migrate Application Configuration Service and Config Server to Config Server for Spring in Azure Container Apps.
author: KarlErickson
ms.author: dixue
ms.service: azure-spring-apps
ms.topic: upgrade-and-migration-article
ms.date: 01/29/2025
ms.custom: devx-track-java, devx-track-extended-java
---

# Migrate Application Configuration Service to Config Server for Spring in Azure Container Apps

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ❎ Basic/Standard ✅ Enterprise

This article describes how to migrate Application Configuration Service (ACS) and Config Server to Config Server for Spring in Azure Container Apps. Azure Container Apps manages Config Server for Spring, which has similar functions as ACS or Spring Cloud Config Server in Azure Spring Apps.

## Prerequisites

- An Azure Spring Apps Enterprise plan instance with Application Configuration Service enabled.
- An Azure Container Apps environment for Config Server and an Azure Container Apps instance.

[!INCLUDE [migrate-to-azure-container-apps-config-server-create](includes/migrate-to-azure-container-apps-config-server-create.md)]

## Configure Config Server

Select one Git repository from Application Configuration Service (ACS) as the default repository in Config Server, and other repositories as additional repositories.

The following table provides a mapping between the properties in ACS and the corresponding configurations in Config Server:

| Property name in ACS | `CONFIGURATION_KEY`                                                                                                            | `CONFIGURATION_VALUE`                                                                                                                                                                          |
|----------------------|--------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `name`               | You don't need to map this value to Config Server.                                                                             |                                                                                                                                                                                                |
| `pattern`            | You don't need to map this value to Config Server.                                                                             |                                                                                                                                                                                                |
| `uri`                | `spring.cloud.config.server.git.uri` <br/> `spring.cloud.config.server.git.repos.{repoName}.uri`                               | The URI of the remote repository.                                                                                                                                                              |
| `search path`        | `spring.cloud.config.server.git.search-paths` <br/> `spring.cloud.config.server.git.repos.{repoName}.search-paths`             | The search paths to use within the local working copy. By default, searches only the root.                                                                                                     |
| `label`              | `spring.cloud.config.server.git.default-label` <br/> `spring.cloud.config.server.git.repos.{repoName}.default-label`           | The label used for Git.                                                                                                                                                                        |
| `username`           | `spring.cloud.config.server.git.username` <br/> `spring.cloud.config.server.git.repos.{repoName}.username`                     | The username for authentication with the remote repository if the authentication type is `HTTP Basic`.                                                                                         |
| `password`           | `spring.cloud.config.server.git.password` <br/> `spring.cloud.config.server.git.repos.{repoName}.password`                     | The password for authentication with the remote repository if the authentication type is `HTTP Basic`.                                                                                         |
| `private key`        | `spring.cloud.config.server.git.private-key` <br/> `spring.cloud.config.server.git.repos.{repoName}.private-key`               | A valid SSH private key if the authentication type is `SSH`.                                                                                                                                   |
| `host key`           | `spring.cloud.config.server.git.host-key` <br/> `spring.cloud.config.server.git.repos.{repoName}.host-key`                     | A valid SSH host key if the authentication type is `SSH`. Must be set if `host-key-algorithm` is also set.                                                                                     |
| `host key algorithm` | `spring.cloud.config.server.git.host-key-algorithm` <br/> `spring.cloud.config.server.git.repos.{repoName}.host-key-algorithm` | One of `ssh-dss`, `ssh-rsa`, `ssh-ed25519`, `ecdsa-sha2-nistp256`, `ecdsa-sha2-nistp384`, or `ecdsa-sha2-nistp521` if the authentication type is `SSH`. Must be set if `host-key` is also set. |

For more Config Server properties, see the [Configuration options](../../container-apps/java-config-server.md#configuration-options) section of [Connect to a managed Config Server for Spring in Azure Container Apps](../../container-apps/java-config-server.md).

For example, suppose you have the following configuration in ACS:

```json
"settings": {
    "gitProperty": {
        "repositories": [
            {
                "name": "r1",
                "patterns": [
                    "application"
                ],
                "label": "master",
                "uri": "https://github.com/Azure-Samples/spring-petclinic-microservices-config"
            },
            {
                "name": "r2",
                "patterns": [
                    "customers-service"
                ],
                "label": "master",
                "uri": "https://github.com/Azure-Samples/spring-petclinic-microservices-config"
            },
            {
                "name": "r3",
                "patterns": [
                    "payment"
                ],
                "label": "main",
                "uri": "https://github.com/Azure-Samples/acme-fitness-store-config"
            }
        ]
    }
}
```

With this ACS configuration, you can migrate to Config Server for Spring with the following configurations:

```properties
spring.cloud.config.server.git.uri=https://github.com/Azure-Samples/spring-petclinic-microservices-config
spring.cloud.config.server.git.default-label=master
spring.cloud.config.server.git.repos.repo1.uri=https://github.com/Azure-Samples/acme-fitness-store-config
spring.cloud.config.server.git.repos.repo1.default-label=main
```

## Change the application configuration

After you provision and configure the Config Server for Spring, use the following steps to adjust your application configuration to use it effectively:

1. Update Spring Boot dependencies. Add the following Spring Cloud Config dependencies to your **pom.xml** for Maven or **build.gradle** for Gradle.

   ### [Maven](#tab/maven)

   ```xml
   <dependency>
       <groupId>org.springframework.cloud</groupId>
       <artifactId>spring-cloud-starter-config</artifactId>
   </dependency>
   ```

   ### [Gradle](#tab/gradle)

   ```gradle
   dependencies {
       implementation 'org.springframework.cloud:spring-cloud-starter-config'
   }
   ```

1. Configure a profile. The profile for ACS is provided as patterns in an Azure Spring Apps deployment, while in Config Server, the profile is configured in the application's source code.

   Ensure your application uses the correct profiles - `dev`, `prod`, and so on - so that the Config Server can serve environment-specific configurations.

   Update the **bootstrap.yml** or **application.yml** file in your application with the correct configuration properties to point to the Config Server, as shown in the following example:

   ```yaml
   spring:
     cloud:
       config:
         profile: dev
   ```

1. Configure a refresh interval. If you set a refresh interval in ACS, you can also specify the corresponding value in the `spring.cloud.config.server.git.refreshRate` configuration of Config Server for Spring. This value determines how frequently Config Server for Spring fetches updated configuration data from the Git backend.

   To load property changes in your application's code, using the following steps:

   1. Register a scheduled task to refresh the context in a given interval.
   1. Enable `autorefresh` and set the appropriate refresh interval in your **application.yml** file.
   1. Add `@RefreshScope` to your code.

   For more information, see [Refresh Config Server](../basic-standard/how-to-config-server.md#refresh-config-server).

[!INCLUDE [migrate-to-azure-container-apps-config-server-deploy-troubleshoot](includes/migrate-to-azure-container-apps-config-server-deploy-troubleshoot.md)]

## Known limitation

Migrating ACS to Config Server for Spring only applies for Java applications. Because ACS manages configuration by using the Kubernetes-native `ConfigMap`. This method enables dynamic configuration updates in Kubernetes environments, making it versatile for different applications with multiple programming languages. While Spring Cloud Config Server is primarily designed for Java applications, using Spring Framework features, and thus only supports configuration management for Java.
