---
title: Migrate Spring Cloud Config Server from Azure Spring Apps to Azure Container Apps
description: Describes how to migrate Spring Cloud Config Server to Config Server for Spring in Azure Container Apps.
author: KarlErickson
ms.author: dixue
ms.service: azure-spring-apps
ms.topic: upgrade-and-migration-article
ms.date: 01/29/2025
ms.custom: devx-track-java, devx-track-extended-java
---

# Migrate Spring Cloud Config Server from Azure Spring Apps to Azure Container Apps

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Basic/Standard ✅ Enterprise

This article describes how to migrate Spring Cloud Config Server to Config Server for Spring in Azure Container Apps. Azure Container Apps manages Config Server for Spring, which has similar functions as Spring Cloud Config Server in Azure Spring Apps.

## Prerequisites

- An Azure Spring Apps instance with Configure Server enabled.
- An Azure Container Apps Environment for Config Server and an Azure Container Apps instance.

[!INCLUDE [migrate-to-azure-container-apps-config-server-create](includes/migrate-to-azure-container-apps-config-server-create.md)]

## Configure Config Server

Map the default Git repository and additional repositories configured in the Spring Cloud Config Server within Azure Spring Apps to the default and other repositories in the Config Server for Spring deployed in Azure Container Apps. The following table shows the mapping relationships for properties:

| Property name in Azure Spring Apps    | `CONFIGURATION_KEY`                                                                                                             | `CONFIGURATION_VALUE`                                                                                                                                                                        |
|---------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `uri`                                 | `spring.cloud.config.server.git.uri` <br/> `spring.cloud.config.server.git.repos.{repoName}.uri`                                | The `uri` of the remote repository.                                                                                                                                                          |
| `search path`                         | `spring.cloud.config.server.git.search-paths` <br/> `spring.cloud.config.server.git.repos.{repoName}.search-paths`              | Search paths to use within the local working copy. By default, searches only the root.                                                                                                       |
| `label`                               | `spring.cloud.config.server.git.default-label`  <br/> `spring.cloud.config.server.git.repos.{repoName}.default-label`           | The label used for Git.                                                                                                                                                                      |
| `name` in additional repositories     | `{repoName}` in the following configurations.                                                                                   |                                                                                                                                                                                              |
| `Patterns` in additional repositories | `spring.cloud.config.server.git.repos.{repoName}.pattern`                                                                       |                                                                                                                                                                                              |
| `username`                            | `spring.cloud.config.server.git.username` <br/> `spring.cloud.config.server.git.repos.{repoName}.username`                      | Enter the `username` for authentication with remote repository if the authentication type is `HTTP Basic`.                                                                                   |
| `password`                            | `spring.cloud.config.server.git.password` <br/> `spring.cloud.config.server.git.repos.{repoName}.password`                      | Enter the `password` for authentication with remote repository if the authentication type is `HTTP Basic`.                                                                                   |
| `private key`                         | `spring.cloud.config.server.git.private-key` <br/> `spring.cloud.config.server.git.repos.{repoName}.private-key`                | Valid SSH private key if the authentication type is `SSH`.                                                                                                                                   |
| `host key`                            | `spring.cloud.config.server.git.host-key` <br/> `spring.cloud.config.server.git.repos.{repoName}.host-key`                      | Valid SSH host key if the authentication type is `SSH`. Must be set if `host-key-algorithm` is also set.                                                                                     |
| `host key algorithm`                  | `spring.cloud.config.server.git.host-key-algorithm`  <br/> `spring.cloud.config.server.git.repos.{repoName}.host-key-algorithm` | One of `ssh-dss`, `ssh-rsa`, `ssh-ed25519`, `ecdsa-sha2-nistp256`, `ecdsa-sha2-nistp384`, or `ecdsa-sha2-nistp521` if the authentication type is `SSH`. Must be set if host-key is also set. |

For more Config Server properties, see the [Configuration options](../../container-apps/java-config-server.md#configuration-options) section of [Connect to a managed Config Server for Spring in Azure Container Apps](../../container-apps/java-config-server.md).

[!INCLUDE [migrate-to-azure-container-apps-config-server-deploy-troubleshoot](includes/migrate-to-azure-container-apps-config-server-deploy-troubleshoot.md)]
