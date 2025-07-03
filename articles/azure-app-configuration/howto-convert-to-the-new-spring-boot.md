---
title: Convert to the new Spring Boot library
titleSuffix: Azure App Configuration
description: Learn how to convert to the new App Configuration library for Spring Boot from the previous version.
ms.service: azure-app-configuration
ms.devlang: java
author: mrm9084
ms.author: mametcal
ms.topic: how-to
ms.date: 07/03/2025
---

# Convert to the new App Configuration library for Spring Boot

A new version of the Azure App Configuration library for Spring Boot is available. The version introduces new features such as Spring Cloud Azure global properties, but also some breaking changes. These changes aren't backward compatible with configuration setups that used the previous library version.

This article provides a reference on the changes and the actions needed to migrate to the new library version.

## Group and artifact IDs changed

All of the group and artifact IDs in the Azure libraries for Spring Boot are updated to match a new format. The new package names are:

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-appconfiguration-config</artifactId>
    <version>6.0.0-beta.1</version>
</dependency>
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-appconfiguration-config-web</artifactId>
    <version>6.0.0-beta.1</version>
</dependency>
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-feature-management</artifactId>
    <version>6.0.0-beta.1</version>
</dependency>
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-feature-management-web</artifactId>
    <version>6.0.0-beta.1</version>
</dependency>
```

## New configuration properties file name

The `spring-cloud-azure-appconfiguration-config` library uses the latest Spring configuration, which requires changing your `bootstrap.properties` or `bootstrap.yml` file to `application.properties` or `application.yml`.

In addition, now the property `spring.config.import=azureAppConfiguration` is required to import the Azure App Configuration.

## Possible conflicts with Spring Cloud Azure global properties

[Spring Cloud Azure common configuration properties](/azure/developer/java/spring-framework/configuration) enable you to customize your connections to Azure services. The new App Configuration library picks up any global or App Configuration setting that's configured with Spring Cloud Azure common configuration properties. Your connection to App Configuration changes if the configurations are set for another Spring Cloud Azure library.

You can override this behavior by using `ConfigurationClientCustomizer`/`SecretClientCustomizer` to modify the clients.

> [!WARNING]
> Spring Cloud Azure global properties might provide more than one connection method as they automatically pick up credentials, such as environment variables, and use them to connect to Azure services. This behavior can cause problems if you're using a different connection method, such as a managed identity, and the global properties are overriding it.
