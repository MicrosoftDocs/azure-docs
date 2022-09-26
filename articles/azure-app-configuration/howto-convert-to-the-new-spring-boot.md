---
title: Convert to the Spring Boot Library
titleSuffix: Azure App Configuration
description: Learn how to convert to the new App Configuration Spring Boot Library from the previous version.
ms.service: azure-app-configuration
ms.devlang: java
author: mrm9084
ms.author: mametcal
ms.topic: how-to
ms.date: 05/02/2022
---

# Convert to new App Configuration Spring Boot library

A new version of the App Configuration library for Spring Boot is now available. The version introduces new features such as Push refresh, but also a number of breaking changes. These changes aren't backwards compatible with configuration setups that were using the previous library version. For the following topics.

* Group and Artifact Ids
* Spring Profiles
* Configuration loading and reloading
* Feature flag loading

this article provides a reference on the change and actions needed to migrate to the new library version.

## Group and Artifact ID changed

All of the Azure Spring Boot libraries have had their Group and Artifact IDs updated to match a new format. The new package names are:

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>azure-spring-cloud-appconfiguration-config</artifactId>
    <version>2.6.0</version>
</dependency>
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>azure-spring-cloud-appconfiguration-config-web</artifactId>
    <version>2.6.0</version>
</dependency>
```

## Use of Spring Profiles

In the previous release, Spring Profiles were used as part of the configuration so they could match the format of the configuration files. For example,

```properties
/<application name>_dev/config.message
```

This has been changed so the default label(s) in a query are the Spring Profiles with the following format, with a label that matches the Spring Profile:

```properties
/application/config.message
```

 To convert to the new format, you can run the bellow commands with your store name:

```azurecli
az appconfig kv export -n your-stores-name -d file --format properties --key /application_dev* --prefix /application_dev/ --path convert.properties --skip-features --yes
az appconfig kv import -n your-stores-name -s file --format properties --label dev --prefix /application/ --path convert.properties --skip-features --yes
```

or use the Import/Export feature in the portal.

When you are completely moved to the new version, you can remove the old keys by running:

```azurecli
az appconfig kv delete -n ConversionTest --key /application_dev/*
```

This command will list all of the keys you are about to delete so you can verify no unexpected keys will be removed. Keys can also be deleted in the portal.

## Which configurations are loaded

The default case of loading configuration matching `/application/*` hasn't changed. The change is that `/${spring.application.name}/*` will not be used in addition automatically anymore unless set. Instead, to use `/${spring.application.name}/*` you can use the new Selects configuration.

```properties
spring.cloud.azure.appconfiguration.stores[0].selects[0].key-filter=/${spring.application.name}/*
```

## Configuration reloading

The monitoring of all configuration stores is now disabled by default. A new configuration has been added to the library to allow config stores to have monitoring enabled. In addition, cache-expiration has been renamed to refresh-interval and has also been changed to be per config store. Also if monitoring of a config store is enabled at least one watched key is required to be configured, with an optional label.

```properties
spring.cloud.azure.appconfiguration.stores[0].monitoring.enabled
spring.cloud.azure.appconfiguration.stores[0].monitoring.refresh-interval
spring.cloud.azure.appconfiguration.stores[0].monitoring.trigger[0].key
spring.cloud.azure.appconfiguration.stores[0].monitoring.trigger[0].label
```

There has been no change to how the refresh-interval works, the change is renaming the configuration to clarify functionality. The requirement of a watched key makes sure that when configurations are being changed the library will not attempt to load the configurations until all changes are done.

## Feature flag loading

By default, loading of feature flags is now disabled. In addition, Feature Flags now have a label filter as well as a refresh-interval.

```properties
spring.cloud.azure.appconfiguration.stores[0].feature-flags.enable
spring.cloud.azure.appconfiguration.stores[0].feature-flags.label-filter
spring.cloud.azure.appconfiguration.stores[0].monitoring.feature-flag-refresh-interval
```
