---
title: Convert to the new Spring Boot library
titleSuffix: Azure App Configuration
description: Learn how to convert to the new App Configuration library for Spring Boot from the previous version.
ms.service: azure-app-configuration
ms.devlang: java
author: mrm9084
ms.author: mametcal
ms.topic: how-to
ms.date: 01/13/2024
---

# Convert to the new App Configuration library for Spring Boot

A new version of the Azure App Configuration library for Spring Boot is available. The version introduces new features such as Spring Cloud Azure global properties, but also some breaking changes. These changes aren't backward compatible with configuration setups that used the previous library version.

This article provides a reference on the changes and the actions needed to migrate to the new library version.

## Group and artifact IDs changed

All of the group and artifact IDs in the Azure libraries for Spring Boot are updated to match a new format. The new package names are:

### [Spring Boot 3](#tab/spring-boot-3)

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-appconfiguration-config</artifactId>
</dependency>
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-appconfiguration-config-web</artifactId>
</dependency>
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-feature-management</artifactId>
</dependency>
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-feature-management-web</artifactId>
</dependency>

<dependencyManagement>
    <dependencies>
        <dependency>
        <groupId>com.azure.spring</groupId>
        <artifactId>spring-cloud-azure-dependencies</artifactId>
        <version>5.8.0</version>
        <type>pom</type>
        <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

### [Spring Boot 2](#tab/spring-boot-2)

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-appconfiguration-config</artifactId>
</dependency>
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-appconfiguration-config-web</artifactId>
</dependency>
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-feature-management</artifactId>
</dependency>
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>spring-cloud-azure-feature-management-web</artifactId>
</dependency>

<dependencyManagement>
    <dependencies>
        <dependency>
        <groupId>com.azure.spring</groupId>
        <artifactId>spring-cloud-azure-dependencies</artifactId>
        <version>4.14.0</version>
        <type>pom</type>
        <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

---


The 4.7.0 version is the first 4.x version of the library. It matches the version of the other Spring Cloud Azure libraries.

As of the 4.7.0 version, the App Configuration and feature management libraries are part of the `spring-cloud-azure-dependencies` bill of materials (BOM). The BOM file ensures that you no longer need to specify the version of the libraries in your project. The BOM automatically manages the version of the libraries.

---

## Package paths renamed

The package paths for the `spring-cloud-azure-feature-management` and `spring-cloud-azure-feature-management-web` libraries have been renamed from `com.azure.spring.cloud.feature.manager` to `com.azure.spring.cloud.feature.management` and `com.azure.spring.cloud.feature.management.web`.

## Classes renamed

The following classes have changed:

* `ConfigurationClientBuilderSetup` has been renamed to `ConfigurationClientCustomizer`. Its `setup` method has been renamed to `customize`.
* `SecretClientBuilderSetup` has been renamed to `SecretClientCustomizer`. Its `setup` method has been renamed to `customize`.
* `AppConfigurationCredentialProvider` and `KeyVaultCredentialProvider` have been removed. Instead, you can use [Spring Cloud Azure common configuration properties](/azure/developer/java/spring-framework/configuration) or modify the credentials by using `ConfigurationClientCustomizer` or `SecretClientCustomizer`.

## Feature flag loading

Feature flags now support loading via multiple key/label filters:

```properties
spring.cloud.azure.appconfiguration.stores[0].feature-flags.enable
spring.cloud.azure.appconfiguration.stores[0].feature-flags.selects[0].key-filter
spring.cloud.azure.appconfiguration.stores[0].feature-flags.selects[0].label-filter
spring.cloud.azure.appconfiguration.stores[0].monitoring.feature-flag-refresh-interval
```

The property `spring.cloud.azure.appconfiguration.stores[0].feature-flags.label` has been removed. Instead, you can use `spring.cloud.azure.appconfiguration.stores[0].feature-flags.selects[0].label-filter` to specify a label filter.

## Using Client Customizers

`ConfigurationClientCustomizer` and `SecretClientCustomizer` are used to customize the `ConfigurationClient` and `SecretClient` instances. You can use them to modify the clients before they're used to connect to App Configuration. This allows for using any credential type supported by the [Azure Identity library](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/identity/azure-identity/README.md#credential-classes). You can also modify the clients to set a custom `HttpClient` or `HttpPipeline`.

```java
import com.azure.core.credential.TokenCredential;
import com.azure.data.appconfiguration.ConfigurationClientBuilder;
import com.azure.identity.AzureCliCredential;
import com.azure.identity.AzureCliCredentialBuilder;
import com.azure.identity.ChainedTokenCredential;
import com.azure.identity.ChainedTokenCredentialBuilder;
import com.azure.identity.EnvironmentCredentialBuilder;
import com.azure.identity.ManagedIdentityCredential;
import com.azure.identity.ManagedIdentityCredentialBuilder;
import com.azure.spring.cloud.appconfiguration.config.ConfigurationClientCustomizer;

public class ConfigurationClientCustomizerImpl implements ConfigurationClientCustomizer {

    @Override
    public void customize(ConfigurationClientBuilder builder, String endpoint) {
        AzureCliCredential cliCredential = new AzureCliCredentialBuilder().build();
        String managedIdentityClientId = System.getenv("MANAGED_IDENTITY_CLIENT_ID");
        ManagedIdentityCredential managedIdentityCredential = new ManagedIdentityCredentialBuilder()
            .clientId(managedIdentityClientId).build();
        ChainedTokenCredential credential = new ChainedTokenCredentialBuilder().addLast(cliCredential)
            .addLast(managedIdentityCredential).build();
        builder.credential(credential);
    }
}
```

## Possible conflicts with Spring Cloud Azure global properties

[Spring Cloud Azure common configuration properties](/azure/developer/java/spring-framework/configuration) enable you to customize your connections to Azure services. The new App Configuration library picks up any global or App Configuration setting that's configured with Spring Cloud Azure common configuration properties. Your connection to App Configuration changes if the configurations are set for another Spring Cloud Azure library.

You can override this behavior by using `ConfigurationClientCustomizer`/`SecretClientCustomizer` to modify the clients.

> [!WARNING]
> Spring Cloud Azure global properties might provide more than one connection method as they automatically pick up credentials, such as environment variables, and use them to connect to Azure services. This behavior can cause problems if you're using a different connection method, such as a managed identity, and the global properties are overriding it.
