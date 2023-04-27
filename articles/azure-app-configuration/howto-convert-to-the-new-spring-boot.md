---
title: Convert to the Spring Boot Library
titleSuffix: Azure App Configuration
description: Learn how to convert to the new App Configuration Spring Boot Library from the previous version.
ms.service: azure-app-configuration
ms.devlang: java
author: mrm9084
ms.author: mametcal
ms.topic: how-to
ms.date: 04/11/2023
---

# Convert to new App Configuration Spring Boot library

A new version of the App Configuration library for Spring Boot is now available. The version introduces new features such as Azure Spring global properties, but also some breaking changes. These changes aren't backwards compatible with configuration setups that were using the previous library version. For the following topics:

* Group and Artifact Ids
* Package path renamed
* Classes renamed
* Feature flag loading
* Possible conflicts with Azure Spring global properties

this article provides a reference on the change and actions needed to migrate to the new library version.

## Group and Artifact ID changed

All of the Azure Spring Boot libraries have had their Group and Artifact IDs updated to match a new format. The new package names are:

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-appconfiguration-config</artifactId>
    <version>4.7.0</version>
</dependency>
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-appconfiguration-config-web</artifactId>
    <version>4.7.0</version>
</dependency>
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-feature-management</artifactId>
    <version>4.7.0</version>
</dependency>
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-feature-management-web</artifactId>
    <version>4.7.0</version>
</dependency>
```

> [!NOTE]
> The 4.7.0 version is the first 4.x version of the library. This is to match the version of the other Spring Cloud Azure libraries.

As of the 4.7.0 version, the App Configuration and Feature Management libraries are now part of the spring-cloud-azure-dependencies BOM. The BOM file makes it so that you no longer need to specify the version of the libraries in your project. The BOM automatically manages the version of the libraries.

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-dependencies</artifactId>
    <version>4.7.0</version>
    <type>pom</type>
</dependency>
```

## Package path renamed

The package path for the `spring-cloud-azure-feature-managment` and `spring-cloud-azure-feature-management-web` libraries have been renamed from `com.azure.spring.cloud.feature.manager` to `com.azure.spring.cloud.feature.management` and `com.azure.spring.cloud.feature.management.web`.

## Classes renamed

* `ConfigurationClientBuilderSetup` has been renamed to `ConfigurationClientCustomizer` and its `setup` method has been renamed to `customize`
* `SecretClientBuilderSetup` has been renamed to `SecretClientCustomizer` and its `setup` method has been renamed to `customize`
* `AppConfigurationCredentialProvider` and `KeyVaultCredentialProvider` have been removed. Instead you can use [Azure Spring common configuration properties](/azure/developer/java/spring-framework/configuration) or modify the credentials using `ConfigurationClientCustomizer`/`SecretClientCustomizer`.

## Feature flag loading

Feature flags now support loading using multiple key/label filters. 

```properties
spring.cloud.azure.appconfiguration.stores[0].feature-flags.enable
spring.cloud.azure.appconfiguration.stores[0].feature-flags.selects[0].key-filter
spring.cloud.azure.appconfiguration.stores[0].feature-flags.selects[0].label-filter
spring.cloud.azure.appconfiguration.stores[0].monitoring.feature-flag-refresh-interval
```

> [!NOTE]
> The property `spring.cloud.azure.appconfiguration.stores[0].feature-flags.label` has been removed. Instead you can use `spring.cloud.azure.appconfiguration.stores[0].feature-flags.selects[0].label-filter` to specify a label filter.

## Possible conflicts with Azure Spring global properties

[Azure Spring common configuration properties](/azure/developer/java/spring-framework/configuration) enables you to customize your connections to Azure services. The new App Configuration library will picks up any global or app configuration setting configured with Azure Spring common configuration properties. Your connection to app configuration will change if the configurations have been set for another Azure Spring library.

> [!NOTE]
> You can override this by using `ConfigurationClientCustomizer`/`SecretClientCustomizer` to modify the clients.

> [!WARNING]
> You may now run into an issue where more than one connection method is provided as Azure Spring global properties will automatically pick up credentials, such as Environment Variables, and use them to connect to Azure services. This can cause issues if you are using a different connection method, such as Managed Identity, and the global properties are overriding it.