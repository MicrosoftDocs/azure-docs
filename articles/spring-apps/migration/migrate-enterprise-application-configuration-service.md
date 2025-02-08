---
title: Migrate Application Configuration Service to Managed Spring Cloud Config Server
description: Learn the migration path from Application Configuration Service to managed Spring Cloud Config Server.
author: KarlErickson
ms.author: ninpan
ms.service: azure-spring-apps
ms.topic: overview
ms.date: 01/29/2025
ms.custom: devx-track-java, devx-track-extended-java
---

# Migrate Application Configuration Service to managed Spring Cloud Config Server

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ❎ Basic/Standard ✅ Enterprise

This article describes how to migrate from Application Configuration Service (ACS) to Spring Cloud Config Server when using the Azure Spring Apps Enterprise plan with Java applications.

Spring Cloud Config Server provides a centralized configuration service that applications can use to fetch configuration properties from external sources, like Git repositories.

## Provision Spring Cloud Config Server

If you have an Azure Spring Apps Enterprise plan instance with Application Configuration Service enabled, the first step in migrating from ACS to Spring Cloud Config Server is to provision the Config Server in your Azure Spring Apps environment. You can provision it using the Azure portal or the Azure CLI.

### [Azure portal](#tab/Portal)

Use the following steps to provision Spring Cloud Config Server:

- Navigate to your Azure Spring Apps enterprise instance in the Azure portal.
- In the menu, select **Spring Cloud Config Server**.
- Select **Manage** to see if **Spring Cloud Config Server** is enabled. If it isn't, enable it and then select **Apply** to save.
- After updating successfully, you can see the **Provisioning State** of config server is **Succeeded** in the **Overview** tab.

### [Azure CLI](#tab/Azure-CLI)

1. Use the following commands to sign in to the Azure CLI and choose the subscription of your Azure Spring Apps service:

   ```azurecli
   az login
   az account list --output table
   az account set --subscription <subscription-ID>
   ```

1. Use the following command to provision Spring Cloud Config Server:

   ```azurecli
   az spring config-server create \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name>
   ```

---

## Configure Spring Cloud Config Server

After you provision the Spring Cloud Config Server, the next step is to configure it for your application to ensure a smooth migration.

### [Azure portal](#tab/Portal)

Use the following steps to configure Spring Cloud Config Server in the Azure portal:

1. In your Azure Spring Apps instance, navigate to **Spring Cloud Config Server**.
1. In the **Settings** tab, map the configurations of all repositories of ACS to Spring Cloud Config Server.

   If you only have one repository in ACS, map it to the default repository for Spring Cloud Config Server without name and patterns. If you have multiple repositories in ACS, choose one repository as the default repository for Spring Cloud Config Server, and use others as additional repositories. Migrate properties including `uri`, `label`, `search path`, `name`, and `authentication` from ACS to Spring Cloud Config Server.

   :::image type="content" source="media/migrate-enterprise-application-configuration-service/migrate-config-server.png" alt-text="Screenshot of the Azure portal that shows the Spring Cloud Config Server page." lightbox="media/migrate-enterprise-application-configuration-service/migrate-config-server.png":::

1. After mapping configurations, select **Validate** to verify the configuration.
1. After successful validation, select **Apply** to finish configuration of Spring Cloud Config Server.
1. To apply the changes, in the **App binding** tab, select **Bind app**, and then select all the apps to use Spring Cloud Config Server.

### [Azure CLI](#tab/Azure-CLI)

1. Use the following command to set the Git property of Spring Cloud Config Server. The values of properties are reference from ACS.

   ```azurecli
   az spring config-server git set \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> \
       --uri <uri-of-git-repository> \
       --label <label-of-git-repository>
   ```

   If you're using basic authentication or SSH authentication for your Git repository, use the parameters `--password` and `private-key`.

1. If you have more than one repository in ACS, you can add more Git repositories in Spring Cloud Config Server with the command:

   ```azurecli
   az spring config-server git repo add \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> \
       --repo-name <repo-name> \
       --uri <uri-of-git-repository> \
       --label <label-of-git-repository>
   ```

1. Bind your apps to use Spring Cloud Config Server with the following command:

   ```azurecli
   az spring config-server bind \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> \
       --app <app-name>
   ```

---

To migrate the property `pattern` of ACS, it's important to ensure that your app's name of Azure Spring Apps matches the configuration file name in the Git repository.
- If the app name of Azure Spring Apps matches the file name of configuration file, Spring Cloud Config Server automatically applies the configuration file with the matching name to the app, without requiring extra configuration.
- If the names don't match, you need to create a new app with the name as the configuration file name.

For more configurations, see [Spring Cloud Config Server document](https://docs.spring.io/spring-cloud-config/docs/current/reference/html/#_spring_cloud_config_server).

## Update your application configuration

Due to the differences in the implementation mechanisms between ACS and Config Server, some app configuration changes are required to adapt to the way configurations are fetched.

After you provision and configure Spring Cloud Config Server, you need to adjust your configuration by using the following steps:

1. Update the Spring Boot dependencies by adding the following required Spring Cloud Config dependencies to your **pom.xml** file for Maven or **build.gradle** file for Gradle.

   ### [Maven](#tab/maven)

   ```xml
   <dependency>
       <groupId>org.springframework.cloud</groupId>
       <artifactId>spring-cloud-starter-config</artifactId>
   </dependency>
   ```

   ### [Gradle](#tab/gradle)

   ```json
   dependencies {
       implementation 'org.springframework.cloud:spring-cloud-starter-config'
   }
   ```

1. Configure the profile.

   In ACS, you provide the profile as patterns in an Azure Spring Apps deployment, while in Spring Cloud Config Server, you configure the profile in an application's source code.

   Ensure your application uses the correct profiles - `dev`, `prod`, and so on - so that the Spring Cloud Config Server can serve environment-specific configurations.

   Update the **bootstrap.yml** or **application.yml** file in your application with the correct configuration properties to point to the Spring Cloud Config Server, as shown in the following example:

   ```yaml
   spring:
     cloud:
       config:
         profile: dev
   ```

   Make sure the app name of Azure Spring Apps matches the configuration file name in your git repository. Also, avoid configuring `spring.application.name` in your application's code.

## Redeploy the application

After testing the application locally, you can redeploy it in Azure Spring Apps to use Spring Cloud Config Server by using the following Azure CLI command:

```azurecli
az spring app deploy \
    --name <app-name> \
    --artifact-path <path-to-your-app> \
    --config-file-patterns '""'
```

With `--config-file-patterns '""'` parameter, it cleans up the reference of Application Configuration Service from your application. The application consumes the configuration through Spring Cloud Config Server rather than Application Configuration Service.

## Disable Application Configuration Service

After all applications finish migrating to Spring Cloud Config Server, you can unbind those applications to Application Configuration Service and disable ACS.

### [Azure portal](#tab/Portal)

1. In your Azure Spring Apps instance, navigate to **Application Configuration Service**
1. Open the **App binding** tab, then select each bound application to unbind.
1. After all applications are unbound, select **Manage** to disable Application Configuration Service.

### [Azure CLI](#tab/Azure-CLI)

1. To unbind applications from ACS, use the following command:

   ```azurecli
   az spring application-configuration-service unbind \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name> \
       --app <application-name>
   ```

1. After all applications are unbound, disable ACS by using the following command:

   ```azurecli
   az spring application-configuration-service delete \
       --resource-group <resource-group-name> \
       --service <Azure-Spring-Apps-service-instance-name>
   ```

---

By carefully following these steps, you can ensure a smooth migration and use the benefits of Spring Cloud Config Server within Azure Spring Apps.

## Known limitation

Migrating ACS to Spring Cloud Config Server only applies for Java applications because ACS manages configuration by using the Kubernetes-native `ConfigMap`. This method enables dynamic configuration updates in Kubernetes environments, making it versatile for different applications with multiple programming languages. Spring Cloud Config Server is primarily designed for Java applications, using Spring Framework features, so it only supports configuration management for Java.
