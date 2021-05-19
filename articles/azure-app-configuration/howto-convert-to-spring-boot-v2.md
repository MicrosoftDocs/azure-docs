---
title: Convert to New App Configuration Spring Boot Library
titleSuffix: Azure App Configuration
description: Learn how to convert to the new App Configuration Spring Boot Library from the previous version.
ms.service: azure-app-configuration
author: AlexandraKemperMS
ms.author: alkemper
ms.topic: conceptual
ms.date: 11/20/2020
---

# Convert to New App Configuration Spring Boot Library

A new version of the App Configuration library for Spring Boot isn't backwards compatible with all configurations setups used with the pervious version. Each section will go over a different breaking change and how to migrate to the new version.

## Group and Artifact ID Changed

All of the Azure Spring Boot libraries have had there Group and Artifact Ids updated to match a new format. The new package names are:

```xml
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>azure-spring-cloud-appconfiguration-config</artifactId>
    <version>2.0.0-beta.2</version>
</dependency>
<dependency>
    <groupId>com.azure.spring</groupId>
    <artifactId>azure-spring-cloud-appconfiguration-config-web</artifactId>
    <version>2.0.0-beta.2</version>
</dependency>
```

## Use of Spring Profiles

In the previous release Spring Profiles were used as part of the configuration to match the format of the configuration files. i.e.

```properties
/<application name>_dev/config.message
```

This has been changed so the default label(s) in a query are the Spring Profiles. So the format should now be:

```properties
/application/config.message
```

with a label that matches the Spring Profile. To convert to the new format you can run a command similar to:

```azurecli
az appconfig kv export -n your-stores-name -d file --format properties --key /application_dev* --prefix /application_dev/ --path convert.properties --skip-features --yes
az appconfig kv import -n your-stores-name -s file --format properties --label dev --prefix /application/ --path convert.properties --skip-features --yes
```

or use the Import/Export feature in the portal.

When you are completly moved to the new version you can removed the old keys by running:

```azurecli
az appconfig kv delete -n ConversionTest --key /application_dev/*
```

This command will list all of the keys you are about to delete so you can verify no unexpected keys will be removed. Keys can also be deleted in the portal, but they have to be done one at a time.

## Which Configurations are Loaded

The default case of all configuration matching `/applicaiton/*` being loaded hasn't changed. It is no longer the case that `/${spring.application.name}/*` will be used in addition if set.

To do this you can use the new Selects configuration.

```properties
spring.cloud.azure.appconfiguration.stores[0].selects[0].key-filter=/${spring.application.name}/
```

## Configuration Reloading

The monitoring of all configuration stores is now disabled by default. A new configuration has been added to each config store to enable monitoring. In addition cache-expiration has been renamed to refresh-interval and has also been changed to be per config store. Also if monitoring of a config store is enabled at least one watched key is no required, with an optional label.

```properties
spring.cloud.azure.appconfiguration.stores[0].monitoring.enabled
spring.cloud.azure.appconfiguration.stores[0].monitoring.refresh-interval
spring.cloud.azure.appconfiguration.stores[0].monitoring.trigger[0].key
spring.cloud.azure.appconfiguration.stores[0].monitoring.trigger[0].label
```

There has been no change to how the refresh-interval works, the change is clarifying functionality. The requirement of a watched key makes sure that when configurations are being changed the library will not attempt to load the configurations until all changes are done.

## Feature Flag Loading

By default loading of feature flags is now disabled. In addition Feature Flags now have a label filter in addition to a refresh-interval.

```properties
spring.cloud.azure.appconfiguration.stores[0].feature-flags.enable
spring.cloud.azure.appconfiguration.stores[0].feature-flags.label-filter
spring.cloud.azure.appconfiguration.stores[0].monitoring.feature-flag-refresh-interval
```
