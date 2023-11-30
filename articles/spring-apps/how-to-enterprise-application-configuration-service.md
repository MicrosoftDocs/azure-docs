---
title: Use Application Configuration Service for Tanzu with the Azure Spring Apps Enterprise plan
titleSuffix: Azure Spring Apps Enterprise plan
description: Learn how to use Application Configuration Service for Tanzu with the Azure Spring Apps Enterprise plan.
author: KarlErickson
ms.author: xiading
ms.service: spring-apps
ms.topic: how-to
ms.date: 02/09/2022
ms.custom: devx-track-java, devx-track-extended-java, event-tier1-build-2022, engagement-fy23, devx-track-azurecli
---

# Use Application Configuration Service for Tanzu

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard ✔️ Enterprise

This article shows you how to use Application Configuration Service for VMware Tanzu with the Azure Spring Apps Enterprise plan.

[Application Configuration Service for VMware Tanzu](https://docs.vmware.com/en/Application-Configuration-Service-for-VMware-Tanzu/2.0/acs/GUID-overview.html) is one of the commercial VMware Tanzu components. It enables the management of Kubernetes-native `ConfigMap` resources that are populated from properties defined in one or more Git repositories.

With Application Configuration Service for Tanzu, you have a central place to manage external properties for applications across all environments. To understand the differences from Spring Cloud Config Server in Basic/Standard, see the [Use Application Configuration Service for external configuration](./how-to-migrate-standard-tier-to-enterprise-tier.md#use-application-configuration-service-for-external-configuration) section of [Migrate an Azure Spring Apps Basic or Standard plan instance to the Enterprise plan](./how-to-migrate-standard-tier-to-enterprise-tier.md).

Application Configuration Service is offered in two versions: Gen1 and Gen2. The Gen1 version mainly serves existing customers for backward compatibility purposes, and is supported only until April 30, 2024. New service instances should use Gen2. The Gen2 version uses [flux](https://fluxcd.io/) as the backend to communicate with Git repositories, and provides better performance compared to Gen1.

The following table shows some benchmark data for your reference. However, the Git repository size is a key factor with significant impact on the performance data. We recommend that you store only the necessary configuration files in the Git repository in order to keep it small.

| Application Configuration Service generation | Duration to refresh under 100 patterns | Duration to refresh under 250 patterns | Duration to refresh under 500 patterns |
|----------------------------------------------|----------------------------------------|----------------------------------------|----------------------------------------|
| Gen1                                         | 330 s                                  | 840 s                                  | 1500 s                                 |
| Gen2                                         | 13 s                                   | 100 s                                  | 378 s                                  |

Gen2 also provides more security verifications when you connect to a remote Git repository. Gen2 requires a secure connection if you're using HTTPS, and verifies the correct host key and host algorithm when using an SSH connection.

You can choose the version of Application Configuration Service when you create an Azure Spring Apps Enterprise service instance. The default version is Gen1. You can also upgrade to Gen2 after the instance is created, but downgrade isn't supported. The upgrade is zero downtime, but we still recommend that you to test in a staging environment before moving to a production environment.

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise plan instance with Application Configuration Service for Tanzu enabled. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise plan](quickstart-deploy-apps-enterprise.md).

  > [!NOTE]
  > To use Application Configuration Service for Tanzu, you must enable it when you provision your Azure Spring Apps service instance. You can't enable it after you provision the instance.

## Manage Application Configuration Service for Tanzu settings

Application Configuration Service for Tanzu supports Azure DevOps, GitHub, GitLab, and Bitbucket for storing your configuration files.

To manage the service settings, open the **Settings** section and add a new entry under the **Repositories** section.

:::image type="content" source="media/how-to-enterprise-application-configuration-service/config-service-settings-repositories.png" alt-text="Screenshot of the Azure portal showing the Application Configuration Service page with the Settings tab and Repositories section highlighted." lightbox="media/how-to-enterprise-application-configuration-service/config-service-settings-repositories.png":::

The following table describes the properties for each entry.

| Property      | Required? | Description                                                                                                                                                                                                                                                                                                                                  |
|---------------|-----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Name`        | Yes       | A unique name to label each Git repository.                                                                                                                                                                                                                                                                                                  |
| `Patterns`    | Yes       | Patterns to search in Git repositories. For each pattern, use a format such as *{application}* or *{application}/{profile}* rather than *{application}-{profile}.yml*. Separate the patterns with commas. For more information, see the [Pattern](./how-to-enterprise-application-configuration-service.md#pattern) section of this article. |
| `URI`         | Yes       | A Git URI (for example, `https://github.com/Azure-Samples/piggymetrics-config` or `git@github.com:Azure-Samples/piggymetrics-config`)                                                                                                                                                                                                        |
| `Label`       | Yes       | The branch name to search in the Git repository.                                                                                                                                                                                                                                                                                             |
| `Search path` | No        | Optional search paths, separated by commas, for searching subdirectories of the Git repository.                                                                                                                                                                                                                                              |

### Pattern

Configuration is pulled from Git backends using what you define in a pattern. A pattern is a combination of *{application}/{profile}* as described in the following guidelines.

- *{application}* - The name of an application whose configuration you're retrieving. The value `application` is considered the default application and includes configuration information shared across multiple applications. Any other value refers to a specific application and includes properties for both the specific application and shared properties for the default application.
- *{profile}* - Optional. The name of a profile whose properties you may be retrieving. An empty value, or the value `default`, includes properties that are shared across profiles. Non-default values include properties for the specified profile and properties for the default profile.

### Authentication

The following screenshot shows the three types of repository authentication supported by Application Configuration Service for Tanzu.

:::image type="content" source="media/how-to-enterprise-application-configuration-service/config-service-auth.png" alt-text="Screenshot of the Azure portal showing the Application Configuration Service page with the Authentication type menu highlighted." lightbox="media/how-to-enterprise-application-configuration-service/config-service-auth.png":::

The following list describes the three authentication types:

- Public repository.

   You don't need any extra authentication configuration when you use a public repository. Select **Public** in the **Authentication** form.

   The following table shows the configurable property you can use to set up a public Git repository:

   | Property         | Required? | Description                                                         |
   |------------------|-----------|---------------------------------------------------------------------|
   | `CA certificate` | No        | Required only when a self-signed cert is used for the Git repo URL. |

- Private repository with basic authentication.

   The following table shows the configurable properties you can use to set up a private Git repository with basic authentication:

   | Property         | Required? | Description                                                         |
   |------------------|-----------|---------------------------------------------------------------------|
   | `username`       | Yes       | The username used to access the repository.                         |
   | `password`       | Yes       | The password used to access the repository.                         |
   | `CA certificate` | No        | Required only when a self-signed cert is used for the Git repo URL. |

- Private repository with SSH authentication.

   The following table shows the configurable properties you can use to set up a private Git repository with SSH:

   | Property                   | Required?                     | Description                                                                                                                                                                                                                         |
   |----------------------------|-------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
   | `Private key`              | Yes                           | The private key that identifies the Git user. Passphrase-encrypted private keys aren't supported.                                                                                                                                   |
   | `Host key`                 | No for Gen1 <br> Yes for Gen2 | The host key of the Git server. If you've connected to the server via Git on the command line, the host key is in your *.ssh/known_hosts* file. Don't include the algorithm prefix, because it's specified in `Host key algorithm`. |
   | `Host key algorithm`       | No for Gen1 <br> Yes for Gen2 | The algorithm for `hostKey`: one of `ssh-dss`, `ssh-rsa`, `ecdsa-sha2-nistp256`, `ecdsa-sha2-nistp384`, and `ecdsa-sha2-nistp521`. (Required if supplying `Host key`).                                                              |
   | `Strict host key checking` | No                            | Optional value that indicates whether the backend should be ignored if it encounters an error when using the provided `Host key`. Valid values are `true` and `false`. The default value is `true`.                                 |

To validate access to the target URI, select **Validate**. After validation completes successfully, select **Apply** to update the configuration settings.

## Upgrade from Gen1 to Gen2

Application Configuration Service Gen2 provides better performance compared to Gen1, especially when you have a large number of configuration files. We recommend using Gen2, especially because Gen1 is being retired soon. The upgrade from Gen1 to Gen2 is zero downtime, but we still recommend that you test in a staging environment before moving to a production environment.

Gen2 requires more configuration properties than Gen1 when using SSH authentication. You need to update the configuration properties in your application to make it work with Gen2. The following table shows the required properties for Gen2 when using SSH authentication:

| Property             | Description                                                                                                                                                                                                                         |
|----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Host key`           | The host key of the Git server. If you've connected to the server via Git on the command line, the host key is in your *.ssh/known_hosts* file. Don't include the algorithm prefix, because it's specified in `Host key algorithm`. |
| `Host key algorithm` | The algorithm for `hostKey`: one of `ssh-dss`, `ssh-rsa`, `ecdsa-sha2-nistp256`, `ecdsa-sha2-nistp384`, or `ecdsa-sha2-nistp521`.                                                                                                   |

Use the following steps to upgrade from Gen1 to Gen2:

1. In the Azure portal, navigate to the Application Configuration Service page for your Azure Spring Apps service instance.

1. Select the **Settings** section, and then select  **Gen 2** in the **Generation** dropdown menu.

   :::image type="content" source="media/how-to-enterprise-application-configuration-service/config-server-upgrade-gen2.png" alt-text="Screenshot of the Azure portal showing the Application Configuration Service page with the Settings tab showing and the Generation menu open." lightbox="media/how-to-enterprise-application-configuration-service/config-server-upgrade-gen2.png":::

1. Select **Validate** to validate access to the target URI. After validation completes successfully, select **Apply** to update the configuration settings.

   :::image type="content" source="media/how-to-enterprise-application-configuration-service/config-server-upgrade-gen2-settings.png" alt-text="Screenshot of the Azure portal showing the Application Configuration Service page with the Settings tab showing and the Validate button highlighted." lightbox="media/how-to-enterprise-application-configuration-service/config-server-upgrade-gen2-settings.png":::

## Polyglot support

The Application Configuration Service for Tanzu works seamlessly with Spring Boot applications. The properties generated by the service are imported as external configurations by Spring Boot and injected into the beans. You don't need to write extra code. You can consume the values by using the `@Value` annotation, accessed through Spring's Environment abstraction, or you can bind them to structured objects by using the `@ConfigurationProperties` annotation.

The Application Configuration Service also supports polyglot apps like dotNET, Go, Python, and so on. To access config files that you specify to load during polyglot app deployment in the apps, try to access a file path that you can retrieve through an environment variable with a name such as `AZURE_SPRING_APPS_CONFIG_FILE_PATH`. You can access all your intended config files under that path. To access the property values in the config files, use the existing read/write file libraries for your app.

## Refresh strategies

Use the following steps to refresh your Java Spring Boot application configuration after you update the configuration file in the Git repository.

1. Load the configuration to Application Configuration Service for Tanzu.

   Azure Spring Apps manages the refresh frequency, which is set to 60 seconds.

1. Load the configuration to your application.

A Spring application holds the properties as the beans of the Spring Application Context via the Environment interface. The following list shows several ways to load the new configurations:

- Restart the application. Restarting the application always loads the new configuration.

- Call the `/actuator/refresh` endpoint exposed on the config client via the Spring Actuator.

   To use this method, add the following dependency to your configuration client’s *pom.xml* file.

   ``` xml
   <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-actuator</artifactId>
   </dependency>
   ```

   You can also enable the actuator endpoint by adding the following configurations:

   ```properties
   management.endpoints.web.exposure.include=refresh, bus-refresh, beans, env
   ```

   After you reload the property sources by calling the `/actuator/refresh` endpoint, the attributes bound with `@Value` in the beans having the annotation `@RefreshScope` are refreshed.

   ``` java
   @Service
   @Getter @Setter
   @RefreshScope
   public class MyService {
      @Value
      private Boolean activated;
   }
   ```

   Use curl with the application endpoint to refresh the new configuration.

   ``` bash
   curl -X POST http://{app-endpoint}/actuator/refresh
   ```

## Configure Application Configuration Service for Tanzu settings

### [Azure portal](#tab/Portal)

Use the following steps to configure Application Configuration Service for Tanzu:

1. Select **Application Configuration Service**.
1. Select **Overview** to view the running state and resources allocated to Application Configuration Service for Tanzu.

   :::image type="content" source="media/how-to-enterprise-application-configuration-service/config-service-overview.png" alt-text="Screenshot of the Azure portal showing the Application Configuration Service page with Overview tab highlighted." lightbox="media/how-to-enterprise-application-configuration-service/config-service-overview.png":::

1. Select **Settings** and add a new entry in the **Repositories** section with the Git backend information.

1. Select **Validate** to validate access to the target URI. After validation completes successfully, select **Apply** to update the configuration settings.

   :::image type="content" source="media/how-to-enterprise-application-configuration-service/config-service-settings-validate.png" alt-text="Screenshot of the Azure portal showing the Application Configuration Service page with the Settings tab and Validate button highlighted." lightbox="media/how-to-enterprise-application-configuration-service/config-service-settings-validate.png":::

### [Azure CLI](#tab/Azure-CLI)

Use the following command to configure Application Configuration Service for Tanzu:

```azurecli
az spring application-configuration-service git repo add \
    --name <entry-name> \
    --patterns <patterns> \
    --uri <git-backend-uri> \
    --label <git-branch-name>
```

---

## Configure the TLS certificate to access the Git backend with a self-signed certificate for Gen2

This step is optional. If you use a self-signed certificate for the Git backend, you must configure the TLS certificate to access the Git backend.

You need to upload the certificate to Azure Spring Apps first. For more information, see the [Import a certificate](how-to-use-tls-certificate.md#import-a-certificate) section of [Use TLS/SSL certificates in your application in Azure Spring Apps](how-to-use-tls-certificate.md).

### [Azure portal](#tab/Portal)

Use the following steps to configure the TLS certificate:

1. Navigate to your service resource, and then select **Application Configuration Service**.
1. Select **Settings** and add or update a new entry in the **Repositories** section with the Git backend information.

   :::image type="content" source="media/how-to-enterprise-application-configuration-service/ca-certificate.png" alt-text="Screenshot of the Azure portal showing the Application Configuration Service page with the Settings tab showing." lightbox="media/how-to-enterprise-application-configuration-service/ca-certificate.png":::

### [Azure CLI](#tab/Azure-CLI)

Use the following Azure CLI commands to configure the TLS certificate:

```azurecli
az spring application-configuration-service git repo add \
    --name <entry-name> \
    --patterns <patterns> \
    --uri <git-backend-uri> \
    --label <git-branch-name> \
    --ca-cert-name <ca-certificate-name>
```

---

## Use Application Configuration Service for Tanzu with applications using the portal

## Use Application Configuration Service for Tanzu with applications

When you use Application Configuration Service for Tanzu with a Git back end and use the centralized configurations, you must bind the app to Application Configuration Service for Tanzu.

### [Azure portal](#tab/Portal)

Use the following steps to use Application Configuration Service for Tanzu with applications:

1. Open the **App binding** tab.

1. Select **Bind app** and choose one app in the dropdown. Select **Apply** to bind.

   :::image type="content" source="media/how-to-enterprise-application-configuration-service/config-service-app-bind-dropdown.png" alt-text="Screenshot of the Azure portal showing the Application Configuration Service page with the App binding tab highlighted." lightbox="media/how-to-enterprise-application-configuration-service/config-service-app-bind-dropdown.png":::

   > [!NOTE]
   > When you change the bind/unbind status, you must restart or redeploy the app to for the binding to take effect.

1. In the navigation menu, select **Apps** to view the list all the apps.

1. Select the target app to configure patterns for from the `name` column.

1. In the navigation pane, select **Configuration**, and then select **General settings**.

1. In the **Config file patterns** dropdown, choose one or more patterns from the list. For more information, see the [Pattern](./how-to-enterprise-application-configuration-service.md#pattern) section.

   :::image type="content" source="media/how-to-enterprise-application-configuration-service/config-service-pattern.png" alt-text="Screenshot of the Azure portal showing the App Configuration page with the General settings tab and api-gateway options highlighted." lightbox="media/how-to-enterprise-application-configuration-service/config-service-pattern.png":::

1. Select **Save**

### [Azure CLI](#tab/Azure-CLI)

Use the following command to use Application Configuration Service for Tanzu with applications:

```azurecli
az spring application-configuration-service bind --app <app-name>
az spring app deploy \
    --name <app-name> \
    --artifact-path <path-to-your-JAR-file> \
    --config-file-pattern <config-file-pattern>
```

---

## Enable/disable Application Configuration Service after service creation

You can enable and disable Application Configuration Service after service creation using the Azure portal or Azure CLI. Before disabling Application Configuration Service, you're required to unbind all of your apps from it.

### [Azure portal](#tab/Portal)

Use the following steps to enable or disable Application Configuration Service:

1. Navigate to your service resource, and then select **Application Configuration Service**.
1. Select **Manage**.
1. Select or unselect **Enable Application Configuration Service**, and then select **Save**.
1. You can now view the state of Application Configuration Service on the **Application Configuration Service** page.

### [Azure CLI](#tab/Azure-CLI)

Use the following commands to enable or disable Application Configuration Service:

```azurecli
az spring application-configuration-service create \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name>
```

```azurecli
az spring application-configuration-service delete \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name>
```

---

## Next steps

- [Azure Spring Apps](index.yml)
