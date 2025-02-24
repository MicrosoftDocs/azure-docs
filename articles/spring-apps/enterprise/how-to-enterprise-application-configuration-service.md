---
title: Use Application Configuration Service for Tanzu
titleSuffix: Azure Spring Apps Enterprise plan
description: Learn how to use Application Configuration Service for Tanzu with the Azure Spring Apps Enterprise plan.
author: KarlErickson
ms.author: xiading
ms.service: azure-spring-apps
ms.topic: how-to
ms.date: 03/27/2024
ms.custom: devx-track-java, devx-track-extended-java, engagement-fy23, devx-track-azurecli
---

# Use Application Configuration Service for Tanzu

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

> [!NOTE]
> Application Configuration Service for VMware Tanzu reaches the end of support on August 31, 2025. We recommend migrating it to managed [Spring Cloud Config Server](../basic-standard/how-to-config-server.md). For more information on how to perform the migration, see [Migrate Application Configuration Service to managed Spring Cloud Config Server](../migration/migrate-enterprise-application-configuration-service.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json).

**This article applies to:** ❎ Basic/Standard ✅ Enterprise

This article shows you how to use Application Configuration Service for VMware Tanzu with the Azure Spring Apps Enterprise plan.

[Application Configuration Service for VMware Tanzu](https://docs.vmware.com/en/Application-Configuration-Service-for-VMware-Tanzu/2.3/acs/GUID-overview.html) is one of the commercial VMware Tanzu components. It enables the management of Kubernetes-native `ConfigMap` resources that are populated from properties defined in one or more Git repositories.

With Application Configuration Service, you have a central place to manage external properties for applications across all environments. To understand the differences from Spring Cloud Config Server in the Basic and Standard plans, see the [Use Application Configuration Service for external configuration](../basic-standard/how-to-migrate-standard-tier-to-enterprise-tier.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json#use-application-configuration-service-for-external-configuration) section of [Migrate an Azure Spring Apps Basic or Standard plan instance to the Enterprise plan](../basic-standard/how-to-migrate-standard-tier-to-enterprise-tier.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json).

Application Configuration Service is offered in two versions: Gen1 and Gen2. The Gen1 version mainly serves existing customers for backward compatibility purposes, and is supported only until April 30, 2024. New service instances should use Gen2. The Gen2 version uses [flux](https://fluxcd.io/) as the backend to communicate with Git repositories, and provides better performance compared to Gen1.

The following table shows the subcomponent relationships:

| Application Configuration Service generation | Subcomponents                                                      |
|----------------------------------------------|--------------------------------------------------------------------|
| Gen1                                         | `application-configuration-service`                                |
| Gen2                                         | `application-configuration-service` <br/> `flux-source-controller` |

The following table shows some benchmark data for your reference. However, the Git repository size is a key factor with significant impact on the performance data. We recommend that you store only the necessary configuration files in the Git repository in order to keep it small.

| Application Configuration Service generation | Duration to refresh under 100 patterns | Duration to refresh under 250 patterns | Duration to refresh under 500 patterns |
|----------------------------------------------|----------------------------------------|----------------------------------------|----------------------------------------|
| Gen1                                         | 330 s                                  | 840 s                                  | 1500 s                                 |
| Gen2                                         | 13 s                                   | 100 s                                  | 378 s                                  |

Gen2 also provides more security verifications when you connect to a remote Git repository. Gen2 requires a secure connection if you're using HTTPS, and verifies the correct host key and host algorithm when using an SSH connection.

You can choose the version of Application Configuration Service when you create an Azure Spring Apps Enterprise service instance. The default version is Gen1. You can also upgrade to Gen2 after the instance is created, but downgrade isn't supported. The upgrade is zero downtime, but we still recommend that you to test in a staging environment before moving to a production environment.

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise plan instance with Application Configuration Service enabled. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise plan](quickstart-deploy-apps-enterprise.md).

## Manage Application Configuration Service settings

Application Configuration Service supports Azure DevOps, GitHub, GitLab, and Bitbucket for storing your configuration files.

To manage the service settings, open the **Settings** section. In this section, you can configure the following key aspects:

- **Generation**: Upgrade the service generation.
- **Refresh Interval**: Adjust the frequency at which the service checks for updates from Git repositories.
- **Repositories**: Add new entries, or modify existing ones. This function enables you to control which repositories the service monitors use to pull data.

:::image type="content" source="media/how-to-enterprise-application-configuration-service/configuration-service-settings.png" alt-text="Screenshot of the Azure portal that shows the Application Configuration Service page with the Settings tab highlighted." lightbox="media/how-to-enterprise-application-configuration-service/configuration-service-settings.png":::

If your current service generation is **Gen1**, you can upgrade to **Gen2** for better performance. For more information, see the [Upgrade from Gen1 to Gen2](#upgrade-from-gen1-to-gen2) section.

The **Refresh Interval** specifies the frequency in seconds for checking updates in the repository. The minimum value is **0**, which disables automatic refresh. For optimal performance, set this interval to a minimum value of 60 seconds.

The following table describes the properties for each repository entry:

| Property      | Required? | Description                                                                                                                                                                                                                                                                                        |
|---------------|-----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Name`        | Yes       | A unique name to label each Git repository.                                                                                                                                                                                                                                                        |
| `Patterns`    | Yes       | The patterns to search for in Git repositories. For each pattern, use a format such as **{application}** or **{application}/{profile}** rather than **{application}-{profile}.yml**. Separate the patterns with commas. For more information, see the [Pattern](#pattern) section of this article. |
| `URI`         | Yes       | A Git URI - for example, `https://github.com/Azure-Samples/piggymetrics-config` or `git@github.com:Azure-Samples/piggymetrics-config`.                                                                                                                                                             |
| `Label`       | Yes       | The branch name to search for in the Git repository.                                                                                                                                                                                                                                               |
| `Search path` | No        | Optional search paths, separated by commas, for searching subdirectories of the Git repository.                                                                                                                                                                                                    |

### Pattern

Configuration is pulled from Git backends using what you define in a pattern. A pattern is a combination of **{application}/{profile}** as described in the following guidelines:

- **{application}** - The name of an application whose configuration you're retrieving. The value `application` is considered the default application and includes configuration information shared across multiple applications. Any other value refers to a specific application and includes properties for both the specific application and shared properties for the default application.
- **{profile}** - Optional. The name of a profile whose properties you can retrieve. An empty value, or the value `default`, includes properties that are shared across profiles. Non-default values include properties for the specified profile and properties for the default profile.

### Authentication

The following screenshot shows the three types of repository authentication supported by Application Configuration Service:

:::image type="content" source="media/how-to-enterprise-application-configuration-service/configuration-service-authentication.png" alt-text="Screenshot of the Azure portal that shows the Application Configuration Service page with the Authentication type menu highlighted." lightbox="media/how-to-enterprise-application-configuration-service/configuration-service-authentication.png":::

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
   | `Host key`                 | No for Gen1 <br> Yes for Gen2 | The host key of the Git server. If you connect to the server via Git on the command line, the host key is in your **.ssh/known_hosts** file. Don't include the algorithm prefix, because it's specified in `Host key algorithm`.      |
   | `Host key algorithm`       | No for Gen1 <br> Yes for Gen2 | The algorithm for `hostKey`: one of `ssh-dss`, `ssh-rsa`, `ecdsa-sha2-nistp256`, `ecdsa-sha2-nistp384`, and `ecdsa-sha2-nistp521`. Required if you supply `Host key`.                                                              |
   | `Strict host key checking` | No                            | Optional value that indicates whether the backend should be ignored if it encounters an error when using the provided `Host key`. Valid values are `true` and `false`. The default value is `true`.                                 |

To validate access to the target URI, select **Validate**. After validation completes successfully, select **Apply** to update the configuration settings.

## Upgrade from Gen1 to Gen2

Application Configuration Service Gen2 provides better performance compared to Gen1, especially when you have a large number of configuration files. We recommend using Gen2, especially because Gen1 is being retired soon. The upgrade from Gen1 to Gen2 is zero downtime, but we still recommend that you test in a staging environment before moving to a production environment.

Gen2 requires more configuration properties than Gen1 when using SSH authentication. You need to update the configuration properties in your application to make it work with Gen2. The following table shows the required properties for Gen2 when using SSH authentication:

| Property             | Description                                                                                                                                                                                                                         |
|----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Host key`           | The host key of the Git server. If you connect to the server via Git on the command line, the host key is in your **.ssh/known_hosts** file. Don't include the algorithm prefix, because it's specified in `Host key algorithm`.      |
| `Host key algorithm` | The algorithm for `hostKey`: one of `ssh-dss`, `ssh-rsa`, `ecdsa-sha2-nistp256`, `ecdsa-sha2-nistp384`, or `ecdsa-sha2-nistp521`.                                                                                                   |

Use the following steps to upgrade from Gen1 to Gen2:

1. In the Azure portal, navigate to the Application Configuration Service page for your Azure Spring Apps service instance.

1. Select the **Settings** section and then select  **Gen2** in the **Generation** dropdown menu.

   :::image type="content" source="media/how-to-enterprise-application-configuration-service/configuration-server-upgrade-gen2.png" alt-text="Screenshot of the Azure portal that shows the Application Configuration Service page with the Settings tab showing and the Generation menu open." lightbox="media/how-to-enterprise-application-configuration-service/configuration-server-upgrade-gen2.png":::

1. Select **Validate** to validate access to the target URI. After validation completes successfully, select **Apply** to update the configuration settings.

   :::image type="content" source="media/how-to-enterprise-application-configuration-service/configuration-server-upgrade-gen2-settings.png" alt-text="Screenshot of the Azure portal that shows the Application Configuration Service page and the Settings tab with the Validate button highlighted." lightbox="media/how-to-enterprise-application-configuration-service/configuration-server-upgrade-gen2-settings.png":::

## Polyglot support

The Application Configuration Service works seamlessly with Spring Boot applications. The properties generated by the service are imported as external configurations by Spring Boot and injected into the beans. You don't need to write extra code. You can consume the values by using the `@Value` annotation, accessed through Spring's Environment abstraction, or you can bind them to structured objects by using the `@ConfigurationProperties` annotation.

The Application Configuration Service also supports polyglot apps like dotNET, Go, Python, and so on. To access config files that you specify to load during polyglot app deployment in the apps, try to access a file path that you can retrieve through an environment variable with a name such as `AZURE_SPRING_APPS_CONFIG_FILE_PATH`. You can access all your intended config files under that path. To access the property values in the config files, use the existing read/write file libraries for your app.

## Refresh strategies

When you modify and commit your configurations in a Git repository, several steps are involved before these changes are reflected in your applications. This process, though automated, involves the following distinct stages and components, each with its own timing and behavior:

- Polling by Application Configuration Service: The Application Configuration Service regularly polls the backend Git repositories to detect any changes. This polling occurs at a set frequency, defined by the refresh interval. When a change is detected, Application Configuration Service updates the Kubernetes `ConfigMap`.
- `ConfigMap` update and interaction with kubelet cache: In Azure Spring Apps, this `ConfigMap` is mounted as a data volume to the relevant application. However, there's a natural delay in this process due to the frequency at which the kubelet refreshes its cache to recognize changes in `ConfigMap`.
- Application reads updated configuration: Your application running in the Azure Spring Apps environment can access the updated configuration values. The existing beans in the Spring Context aren't automatically refreshed to use the updated configurations.

These stages are summarized in the following diagram:

:::image type="content" source="media/how-to-enterprise-application-configuration-service/acs-refresh-lifecycle.png" alt-text="Diagram that shows the lifecycle of the refresh process of Application Configuration Service." lightbox="media/how-to-enterprise-application-configuration-service/acs-refresh-lifecycle.png":::

You can adjust the polling refresh interval of the Application Configuration Service to align with your specific needs. To apply the updated configurations in your application, a restart or refresh action is necessary.

In Spring applications, properties are held or referenced as beans within the Spring Context. To load new configurations, consider using the following methods:

- Restart the application. Restarting the application always loads the new configuration.

- Call the `/actuator/refresh` endpoint exposed on the config client via the Spring Actuator.

  To use this method, add the following dependency to your configuration client's **pom.xml** file:

  ```xml
  <dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-actuator</artifactId>
  </dependency>
  ```

  You can also enable the actuator endpoint by adding the following configuration:

  ```properties
  management.endpoints.web.exposure.include=refresh, bus-refresh, beans, env
  ```

  After you reload the property sources by calling the `/actuator/refresh` endpoint, the attributes bound with `@Value` in the beans having the annotation `@RefreshScope` are refreshed.

  ```java
  @Service
  @Getter @Setter
  @RefreshScope
  public class MyService {
     @Value
     private Boolean activated;
  }
  ```

  Use curl with the application endpoint to refresh the new configuration, as shown in the following example:

  ```bash
  curl -X POST http://{app-endpoint}/actuator/refresh
  ```

- Use `FileSystemWatcher` to watch the file change and refresh the context on demand. `FileSystemWatcher` is a class shipped with `spring-boot-devtools` that watches specific directories for file changes, or you can use another utility with similar function. The previous option requires users to initiate the refresh actively, while the latter can monitor for file changes and automatically invoke the refresh upon detecting updates. You can retrieve the file path by using the environment variable `AZURE_SPRING_APPS_CONFIG_FILE_PATH`, as mentioned in the [Polyglot support](#polyglot-support) section.

## Configure Application Configuration Service settings

### [Azure portal](#tab/Portal)

Use the following steps to configure Application Configuration Service:

1. Select **Application Configuration Service**.

1. Select **Overview** to view the running state and resources allocated to Application Configuration Service.

   :::image type="content" source="media/how-to-enterprise-application-configuration-service/configuration-service-overview.png" alt-text="Screenshot of the Azure portal that shows the Application Configuration Service page with Overview tab highlighted." lightbox="media/how-to-enterprise-application-configuration-service/configuration-service-overview.png":::

1. Select **Settings** and add a new entry in the **Repositories** section with the Git backend information.

1. Select **Validate** to validate access to the target URI. After validation completes successfully, select **Apply** to update the configuration settings.

   :::image type="content" source="media/how-to-enterprise-application-configuration-service/configuration-service-settings-validate.png" alt-text="Screenshot of the Azure portal that shows the Application Configuration Service page with the Settings tab and Validate button highlighted." lightbox="media/how-to-enterprise-application-configuration-service/configuration-service-settings-validate.png":::

### [Azure CLI](#tab/Azure-CLI)

Use the following command to configure Application Configuration Service:

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

You need to upload the certificate to Azure Spring Apps first. For more information, see the [Import a certificate](../basic-standard/how-to-use-tls-certificate.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json#import-a-certificate) section of [Use TLS/SSL certificates in your application in Azure Spring Apps](../basic-standard/how-to-use-tls-certificate.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json).

### [Azure portal](#tab/Portal)

Use the following steps to configure the TLS certificate:

1. Navigate to your service resource and then select **Application Configuration Service**.
1. Select **Settings** and add or update a new entry in the **Repositories** section with the Git backend information.

   :::image type="content" source="media/how-to-enterprise-application-configuration-service/ca-certificate.png" alt-text="Screenshot of the Azure portal that shows the Application Configuration Service page with the Settings tab showing." lightbox="media/how-to-enterprise-application-configuration-service/ca-certificate.png":::

### [Azure CLI](#tab/Azure-CLI)

Use the following command to configure the TLS certificate:

```azurecli
az spring application-configuration-service git repo add \
    --name <entry-name> \
    --patterns <patterns> \
    --uri <git-backend-uri> \
    --label <git-branch-name> \
    --ca-cert-name <ca-certificate-name>
```

---

## Use Application Configuration Service with applications

When you use Application Configuration Service with a Git back end and use the centralized configurations, you must bind the app to Application Configuration Service.

### [Azure portal](#tab/Portal)

Use the following steps to use Application Configuration Service with applications:

1. Open the **App binding** tab.

1. Select **Bind app** and choose one app from the dropdown. Select **Apply** to bind.

   :::image type="content" source="media/how-to-enterprise-application-configuration-service/configuration-service-app-bind-dropdown.png" alt-text="Screenshot of the Azure portal that shows the Application Configuration Service page with the App binding tab highlighted." lightbox="media/how-to-enterprise-application-configuration-service/configuration-service-app-bind-dropdown.png":::

   > [!NOTE]
   > When you change the bind/unbind status, you must restart or redeploy the app to for the binding to take effect.

1. In the navigation menu, select **Apps** to view the list of all the apps.

1. Select the target app to configure patterns for the `name` column.

1. In the navigation pane, select **Configuration** and then select **General settings**.

1. In the **Config file patterns** dropdown, choose one or more patterns from the list. For more information, see the [Pattern](#pattern) section.

   :::image type="content" source="media/how-to-enterprise-application-configuration-service/configuration-service-pattern.png" alt-text="Screenshot of the Azure portal that shows the App Configuration page with the General settings tab and api-gateway options highlighted." lightbox="media/how-to-enterprise-application-configuration-service/configuration-service-pattern.png":::

1. Select **Save**.

### [Azure CLI](#tab/Azure-CLI)

Use the following command to use Application Configuration Service with applications:

```azurecli
az spring application-configuration-service bind --app <app-name>
az spring app deploy \
    --name <app-name> \
    --artifact-path <path-to-your-JAR-file> \
    --config-file-pattern <config-file-pattern>
```

---

## Bind an app to the Application Configuration Service

You can now choose to bind your application to the Application Configuration Service when creating a new app.

### [Azure portal](#tab/Portal)

Use the following steps to create a new app and bind it to the Application Configuration Service:

1. In the navigation pane, select **Apps** to see all your apps.

1. Select **Create App** to create a new app.

1. Enter a name for your new app.

1. Select the **Bind** tab and then select **Application Configuration Service** from the dropdown.

   :::image type="content" source="media/how-to-enterprise-application-configuration-service/configuration-service-bind-app-when-creation.png" alt-text="Screenshot of the Azure portal that shows the Create App page with the Bind dropdown highlighted." lightbox="media/how-to-enterprise-application-configuration-service/configuration-service-bind-app-when-creation.png":::

1. Select **Create** to finish creating your app and binding it to the Application Configuration Service.

### [Azure CLI](#tab/Azure-CLI)

Use the following command to create a new app and bind it to the Application Configuration Service:

```azurecli
az spring app create \
    --resource-group <resource-group> \
    --service <service-name> \
    --name <app-name> \
    --bind-application-configuration-service
```

---

## Enable/disable Application Configuration Service after service creation

You can enable and disable Application Configuration Service after service creation using the Azure portal or the Azure CLI. Before disabling Application Configuration Service, you're required to unbind all of your apps from it.

### [Azure portal](#tab/Portal)

Use the following steps to enable or disable Application Configuration Service:

1. Navigate to your service resource and then select **Application Configuration Service**.
1. Select **Manage**.
1. Select or unselect **Enable Application Configuration Service** and then select **Save**.
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

## Examine configuration file in ConfigMap

The following section shows you how to examine the content of the configuration file pulled by Application Configuration Service from upstream Git repositories in the related Kubernetes `ConfigMap`. For more information, see the [Refresh strategies](#refresh-strategies) section of this article.

### Assign an Azure role

First, you must have the Azure role `Azure Spring Apps Application Configuration Service Config File Pattern Reader Role` assigned to you.

#### [Azure portal](#tab/azure-Portal)

Use the following steps to assign an Azure role:

1. Open the [Azure portal](https://portal.azure.com) and go to your Azure Spring Apps service instance.

1. In the navigation pane, select **Access Control (IAM)**.

1. On the **Access Control (IAM)** page, select **Add**, and then select **Add role assignment**.

   :::image type="content" source="media/how-to-enterprise-application-configuration-service/add-role-assignment.png" alt-text="Screenshot of the Azure portal that shows the Access Control (IAM) page for an Azure Spring Apps instance with the Add role assignment option highlighted." lightbox="media/how-to-enterprise-application-configuration-service/add-role-assignment.png":::

1. On the **Add role assignment** page, in the **Name** list, search for and select the target role, and then select **Next**.

   :::image type="content" source="media/how-to-enterprise-application-configuration-service\application-configuration-service-config-pattern-file-reader-role.png" alt-text="Screenshot of the Azure portal that shows the Add role assignment page for an Azure Spring Apps instance with the Azure Spring Apps Application Configuration Service Config File Pattern Reader Role name highlighted." lightbox="media/how-to-enterprise-application-configuration-service\application-configuration-service-config-pattern-file-reader-role.png":::

1. Select **Members** and then search for and select your username.

1. Select **Review + assign**.

#### [Azure CLI](#tab/azure-CLI)

Use the following command to assign an Azure role:

```azurecli
az role assignment create \
    --role "Azure Spring Apps Application Configuration Service Config File Pattern Reader Role" \
    --scope "<service-instance-resource-id>" \
    --assignee "<your-identity>"
```

---

### Examine configuration file with the Azure CLI

Use the following command to view the content of the configuration file by [Pattern](#pattern):

```azurecli
az spring application-configuration-service config show \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --config-file-pattern <pattern>
```

This command produces JSON output similar to the following example:

```json
{
  "configurationFiles": {
    "application.properties": [
      "example.property.application.name: example-service",
      "example.property.cloud: Azure"
    ]
  },
  "metadata": {
    "gitRevisions": "[{\"url\":\"{gitRepoUrl}\",\"revision\":\"{revisionInfo}\"}]"
  }
}
```

> [!NOTE]
> The `metadata` and `gitRevisions` properties aren't available for the Gen1 version of Application Configuration Service.

You can also use this command with the `--export-path <path-to-target-folder>` parameter to export the configuration file to the specified folder. It supports both relative paths and absolute paths. If you don't specify the path, the command uses the path of the current directory by default.

## Examine configuration file in the app

After you bind the app to the Application Configuration Service and set the [Pattern](#pattern) for the app deployment, as described in the [Use Application Configuration Service with applications](#use-application-configuration-service-with-applications) section of this article, the `ConfigMap` containing the configuration file for the pattern should be mounted to the application container. Use the following steps to check the configuration files in each instance of the app deployment:

1. Connect to one of the application instances. For more information, see [Connect to an app instance for troubleshooting](../basic-standard/how-to-connect-to-app-instance-for-troubleshooting.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json).

1. Use the `echo $AZURE_SPRING_APPS_CONFIG_FILE_PATH` command to find the folders containing the configuration files. A list of locations shows up separated by commas, as shown in the following example:

   ```output
   $ echo $AZURE_SPRING_APPS_CONFIG_FILE_PATH
   /etc/azure-spring-cloud/configmap/acs-default-payment-default-e9d46,/etc/azure-spring-cloud/configmap/acs-default-catalog-default-616f4
   ```

1. Check the content of the configuration file using commands such as `cat`.

> [!NOTE]
> The Git revision information isn't available in the app.

## Check logs

The following sections show you how to view application logs by using either the Azure CLI or the Azure portal.

### Use real-time log streaming

You can stream logs in real time with the Azure CLI. For more information, see [Stream Azure Spring Apps managed component logs in real time](./how-to-managed-component-log-streaming.md). The following examples show how you can use Azure CLI commands to continuously stream new logs for `application-configuration-service` and `flux-source-controller` subcomponents.

Use the following command to stream logs for `application-configuration-service`:

```azurecli
az spring component logs \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name application-configuration-service \
    --all-instances \
    --follow
```

Use the following command to stream logs for `flux-source-controller`:

```azurecli
az spring component logs \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name flux-source-controller \
    --all-instances \
    --follow
```

### Use Log Analytics

The following sections show you how to turn on and view System Logs using Log Analytics.

#### Diagnostic settings for Log Analytics

You must turn on System Logs and send the logs to your Log Analytics instance before you query the logs for Application Configuration Service. To enable System Logs in the Azure portal, use the following steps:

1. Open your Azure Spring Apps instance.
1. In the navigation pane, select **Diagnostics settings**.
1. Select **Add diagnostic setting** or select **Edit setting** for an existing setting.
1. In the **Logs** section, select the **System Logs** category.
1. In the **Destination details** section, select **Send to Log Analytics workspace** and then select your workspace.
1. Select **Save** to update the setting.

#### Check logs in Log Analytics

To check the logs of `application-configuration-service` and `flux-source-controller` using the Azure portal, use the following steps:

1. Make sure you turned on **System Logs**. For more information, see the [Diagnostic settings for Log Analytics](#diagnostic-settings-for-log-analytics) section.

1. Open your Azure Spring Apps instance.

1. In the navigation menu, select **Logs** and then select **Overview**.

1. Use the following sample queries in the query edit pane. Adjust the time range then select **Run** to search for logs.

   - To view the logs for `application-configuration-service`, use the following query:

     ```kusto
     AppPlatformSystemLogs
     | where LogType in ("ApplicationConfigurationService")
     | project TimeGenerated , ServiceName , LogType, Log , _ResourceId
     | limit 100
     ```

     :::image type="content" source="media/how-to-enterprise-application-configuration-service/query-logs-application-configuration-service.png" alt-text="Screenshot of the Azure portal that shows the query result of logs for application-configuration-service." lightbox="media/how-to-enterprise-application-configuration-service/query-logs-application-configuration-service.png":::

   - To view the logs for `flux-source-controller`, use the following query:

     ```kusto
     AppPlatformSystemLogs
     | where LogType in ("Flux")
     | project TimeGenerated , ServiceName , LogType, Log , _ResourceId
     | limit 100
     ```

     :::image type="content" source="media/how-to-enterprise-application-configuration-service/query-logs-flux-source-controller.png" alt-text="Screenshot of the Azure portal that shows the query result of logs for flux-source-controller." lightbox="media/how-to-enterprise-application-configuration-service/query-logs-flux-source-controller.png":::

> [!NOTE]
> There might be a few minutes delay before the logs are available in Log Analytics.

## Examine Git revisions of the configuration files

You can find the Git revision of the configuration file of the [Pattern](#pattern) in the logs of Application Configuration Service. The following example log indicates that the configuration file for the `payment/default` pattern is pulled with `example-commit-id` from the `main` branch of the `https://github.com/Azure-Samples/acme-fitness-store-config` repository. You can learn how to query logs in the [Check logs](#check-logs) section.

```output
Applied ConfigMap ({config-map-name}) for content (payment/default) from Git repositories https://github.com/Azure-Samples/acme-fitness-store-config@main@sha1:{example-commit-id}
```

You can also find the Git revision by using the Azure CLI. For more information, see the [Examine configuration file with the Azure CLI](#examine-configuration-file-with-the-azure-cli) section.

> [!NOTE]
> Git revision isn't available for the Gen1 version of Application Configuration Service.

## Troubleshoot known issues

If the latest changes aren't reflected in the applications, check the following items based on the [Refresh strategies](#refresh-strategies) section:

- Confirm that the Git repo is updated correctly by checking the following items:
  - Confirm that the branch of the desired config file changes is updated.
  - Confirm that the pattern configured in the Application Configuration Service matches the updated config files.
  - Confirm that the application is bound to the Application Configuration Service.
- Confirm that the Application Configuration Service is using the correct Git revisions as described in the [Examine Git revisions of the configuration files](#examine-git-revisions-of-the-configuration-files) section.
- Confirm that the `ConfigMap` containing the configuration file for the [Pattern](#pattern) used by the application is updated, as described in the [Examine configuration file in ConfigMap](#examine-configuration-file-in-configmap) section of this article. If it isn't updated, raise a ticket.
- Confirm that the `ConfigMap` is mounted to the application as a file, as described in the [Examine configuration file in the app](#examine-configuration-file-in-the-app) section of this article. If the file isn't updated, wait for the Kubernetes refresh interval - one minute - or force a refresh by restarting the application.

After checking these items, the applications should be able to read the updated configurations. If the applications still aren't updated, raise a ticket.

## Related content

[Azure Spring Apps](index.yml)
