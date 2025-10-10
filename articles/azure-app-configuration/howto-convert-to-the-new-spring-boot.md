---
title:  Upgrade Spring Boot applications to use App Configuration libraries version 6
titleSuffix: Azure App Configuration
description: Learn how to upgrade Spring Boot applications to use App Configuration libraries version 6 from the previous version.
ms.service: azure-app-configuration
ms.devlang: java
author: mrm9084
ms.author: mametcal
ms.topic: how-to
ms.date: 10/09/2025
---

# Upgrade Spring Boot applications to use App Configuration libraries version 6

Version 6 of the Azure App Configuration library for Spring Boot introduces features such as Spring Cloud Azure global properties, but also some breaking changes. These changes aren't backward compatible with configuration setups that used the previous library version.

This article provides a reference on the changes and the actions needed to upgrade to version 6 libraries.

## Configuration properties file name

The `spring-cloud-azure-appconfiguration-config` library uses the latest Spring configuration, which requires changing your `bootstrap.properties` or `bootstrap.yml` file to `application.properties` or `application.yml`.

In addition, the property `spring.config.import=azureAppConfiguration` is now required to import the Azure App Configuration.

## Possible conflicts with Spring Cloud Azure global properties

[Spring Cloud Azure common configuration properties](/azure/developer/java/spring-framework/configuration) enable you to customize your connections to Azure services. The App Configuration library picks up any global or App Configuration setting that's configured with Spring Cloud Azure common configuration properties. Your connection to App Configuration changes if the configurations are set for another Spring Cloud Azure library.

You can override this behavior by using `ConfigurationClientCustomizer`/`SecretClientCustomizer` to modify the clients.

> [!WARNING]
> Spring Cloud Azure global properties might provide more than one connection method as they automatically pick up credentials, such as environment variables, and use them to connect to Azure services. This behavior can cause problems if you're using a different connection method, such as a managed identity, and the global properties are overriding it.
