---
title: Configure Your Managed Spring Cloud Config Server
titleSuffix: Azure Spring Apps
description: Learn how to configure a managed Spring Cloud Config Server in Azure Spring Apps on the Azure portal
author: KarlErickson
ms.author: guitarsheng
ms.service: azure-spring-apps
ms.topic: how-to
ms.date: 06/10/2024
ms.custom: devx-track-java, devx-track-extended-java, devx-track-azurecli
zone_pivot_groups: spring-apps-tier-selection
---

# Configure a managed Spring Cloud Config Server in Azure Spring Apps

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Java ✅ C#

**This article applies to:** ✅ Standard consumption and dedicated (Preview) ✅ Basic/Standard ✅ Enterprise

This article shows you how to configure a managed Spring Cloud Config Server in Azure Spring Apps.

Spring Cloud Config Server provides server and client-side support for an externalized configuration in a distributed system. The Spring Cloud Config Server instance provides a central place to manage external properties for applications across all environments. For more information, see [Spring Cloud Config](https://spring.io/projects/spring-cloud-config).

::: zone pivot="sc-standard"

> [!NOTE]
> To use config server in the Standard consumption and dedicated plan, you must enable it first. For more information, see [Enable and disable Spring Cloud Config Server in Azure Spring Apps](../consumption-dedicated/quickstart-standard-consumption-config-server.md).

::: zone-end

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

::: zone pivot="sc-standard"

- An already provisioned and running Azure Spring Apps service instance using the Basic or Standard plan. To set up and launch an Azure Spring Apps service, see [Quickstart: Deploy your first application to Azure Spring Apps](quickstart.md?pivots=sc-standard).

::: zone-end

::: zone pivot="sc-enterprise"

- An already provisioned and running Azure Spring Apps service instance. To set up and launch an Azure Spring Apps service, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise plan](quickstart.md?pivots=sc-enterprise).

::: zone-end

- [Git](https://git-scm.com/downloads).

::: zone pivot="sc-enterprise"

## Enable Spring Cloud Config Server

You can enable Spring Cloud Config Server when you provision an Azure Spring Apps Enterprise plan service instance. If you already have an Azure Spring Apps Enterprise plan instance, see the [Manage Spring Cloud Config Server in an existing Enterprise plan instance](#manage-spring-cloud-config-server-in-an-existing-enterprise-plan-instance) section in this article.

You can enable Spring Cloud Config Server using the Azure portal or Azure CLI.

### [Azure portal](#tab/Portal)

Use the following steps to enable Spring Cloud Config Server:

1. Open the [Azure portal](https://portal.azure.com).

1. On the **Basics** tab, select **Enterprise tier** in the **Pricing** section and specify the required information. Then, select **Next: Managed components**.

1. On the **Managed components** tab, select **Enable Spring Cloud Config Server**.

   :::image type="content" source="media/how-to-config-server/create-instance.png" alt-text="Screenshot of the Azure portal that shows the VMware Tanzu settings tab with the Enable Spring Cloud Config Server checkbox highlighted." lightbox="media/how-to-config-server/create-instance.png":::

1. Specify other settings, and then select **Review and Create**.

1. On the **Review an create** tab, make sure that **Enable Spring Cloud Config Server** is set to **Yes**. Select **Create** to create the Enterprise plan instance.

### [Azure CLI](#tab/Azure-CLI)

Use the following steps to provision an Azure Spring Apps service instance with Spring Cloud Config Server enabled.

1. Use the following commands to sign in to the Azure CLI and choose your active subscription:

   ```azurecli
   az login
   az account list --output table
   az account set --subscription <subscription-ID>
   ```

1. Use the following commands to accept the legal terms and privacy statements for the Azure Spring Apps Enterprise plan. This step is necessary only if your subscription has never been used to create an Enterprise plan instance of Azure Spring Apps.

   ```azurecli
   az provider register --namespace Microsoft.SaaS
   az term accept \
       --publisher vmware-inc \
       --product azure-spring-cloud-vmware-tanzu-2 \
       --plan asa-ent-hr-mtr
   ```

1. Select a location. The location must support the Azure Spring Apps Enterprise plan. For more information, see the [Azure Spring Apps FAQ](faq.md).

1. Use the following command to create a resource group:

   ```azurecli
   az group create \
       --name <resource-group-name> \
       --location <location>
   ```

   For more information about resource groups, see [What is Azure Resource Manager?](../../azure-resource-manager/management/overview.md)

1. Prepare a name for your Azure Spring Apps service instance. The name must be between 4 and 32 characters long and can contain only lowercase letters, numbers, and hyphens. The first character of the service name must be a letter and the last character must be either a letter or a number.

1. Use the following command to create an Azure Spring Apps service instance with Spring Cloud Config Server enabled:

   ```azurecli
   az spring create \
       --resource-group <resource-group-name> \
       --name <Azure-Spring-Apps-service-instance-name> \
       --sku enterprise \
       --enable-config-server
   ```

---

::: zone-end

## Restrictions

There are some restrictions when you use Config Server with a Git back end. The following properties are automatically injected into your application environment to access Config Server and Service Discovery. If you also configure those properties from your Config Server files, you might experience conflicts and unexpected behavior.

- `eureka.client.service-url.defaultZone`
- `eureka.client.tls.keystore`
- `eureka.instance.preferIpAddress`
- `eureka.instance.instance-id`
- `server.port`
- `spring.cloud.config.tls.keystore`
- `spring.config.import`
- `spring.application.name`
- `spring.jmx.enabled`
- `management.endpoints.jmx.exposure.include`

> [!CAUTION]
> Avoid putting these properties in your Config Server application files.

## Create your Config Server files

Azure Spring Apps supports Azure DevOps Server, GitHub, GitLab, and Bitbucket for storing your Config Server files. When your repository is ready, you can create the configuration files and store them there.

Some configurable properties are available only for certain types. The following sections describe the properties for each repository type.

> [!NOTE]
> Config Server takes `master` (on Git) as the default label if you don't specify one. However, GitHub has recently changed the default branch from `master` to `main`. To avoid Azure Spring Apps Config Server failure, be sure to pay attention to the default label when setting up Config Server with GitHub, especially for newly created repositories.
>
> Using a hyphen (-) to separate words is the only property naming convention currently supported. For example, you can use `default-label`, but not `defaultLabel`.

### Public repository

When you use a public repository, your configurable properties are more limited than they are with a private repository.

The following table lists the configurable properties you can use to set up a public Git repository:

| Property        | Required | Feature                                                                                                                         |
|:----------------|----------|---------------------------------------------------------------------------------------------------------------------------------|
| `uri`           | Yes      | The URI of the Git repository used as the Config Server back end. Should begin with `http://`, `https://`, `git@`, or `ssh://`. |
| `default-label` | No       | The default label of the Git repository. Should be a branch name, tag name, or commit ID in the repository.                     |
| `search-paths`  | No       | An array of strings that are used to search subdirectories of the Git repository.                                               |

### Private repository with SSH authentication

The following table lists the configurable properties you can use to set up a private Git repository with SSH:

| Property                   | Required | Feature                                                                                                                                                             |
|:---------------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `uri`                      | Yes      | The URI of the Git repository used as the Config Server back end. Should begin with `http://`, `https://`, `git@`, or `ssh://`.                                     |
| `default-label`            | No       | The default label of the Git repository. Should be the branch name, tag name, or commit ID of the repository.                                                       |
| `search-paths`             | No       | An array of strings used to search subdirectories of the Git repository.                                                                                            |
| `private-key`              | No       | The SSH private key to access the Git repository. Required when the URI starts with `git@` or `ssh://`.                                                             |
| `host-key`                 | No       | The host key of the Git repository server. Shouldn't include the algorithm prefix as covered by `host-key-algorithm`.                                               |
| `host-key-algorithm`       | No       | The host key algorithm. Should be `ssh-dss`, `ssh-rsa`, `ecdsa-sha2-nistp256`, `ecdsa-sha2-nistp384`, or `ecdsa-sha2-nistp521`. Required only if `host-key` exists. |
| `strict-host-key-checking` | No       | The Config Server indicator that shows whether it fails to start when using the private `host-key`. Should be `true` (default value) or `false`.                    |

### Private repository with basic authentication

The following table lists the configurable properties you can use to set up a private Git repository with basic authentication:

| Property        | Required | Feature                                                                                                                                                     |
|:----------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `uri`           | Yes      | The URI of the Git repository used as the Config Server back end. Should begin with `http://`, `https://`, `git@`, or `ssh://`.                             |
| `default-label` | No       | The default label of the Git repository. Should be a branch name, tag name, or commit-id in the repository.                                                 |
| `search-paths`  | No       | An array of strings used to search subdirectories of the Git repository.                                                                                    |
| `username`      | No       | The username used to access the Git repository server. Required when the Git repository server supports HTTP basic authentication.                          |
| `password`      | No       | The password or personal access token used to access the Git repository server. Required when the Git repository server supports HTTP basic authentication. |

> [!NOTE]
> Many Git repository servers support the use of tokens rather than passwords for HTTP basic authentication. Some repositories allow tokens to persist indefinitely. However, some Git repository servers, including Azure DevOps Server, force tokens to expire in a few hours. Repositories that cause tokens to expire shouldn't use token-based authentication with Azure Spring Apps. If you use such a token, remember to update it before it expires.
>
> GitHub has removed support for password authentication, so you need to use a personal access token instead of password authentication for GitHub. For more information, see [Token authentication requirements for Git operations](https://github.blog/2020-12-15-token-authentication-requirements-for-git-operations/).

### Other Git repositories

The following table lists the configurable properties you can use to set up Git repositories with a pattern:

| Property                           | Required       | Feature                                                                                                                                                             |
|:-----------------------------------|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `repos`                            | No             | A map consisting of the settings for a Git repository with a given name.                                                                                            |
| `repos."uri"`                      | Yes on `repos` | The URI of the Git repository used as the Config Server back end. Should begin with `http://`, `https://`, `git@`, or `ssh://`.                                     |
| `repos."name"`                     | Yes on `repos` | A name to identify the repository; for example, `team-A` or `team-B`. Required only if `repos` exists.                                                              |
| `repos."pattern"`                  | No             | An array of strings used to match an application name. For each pattern, use the format `{application}/{profile}` with wildcards.                                   |
| `repos."default-label"`            | No             | The default label of the Git repository. Should be the branch name, tag name, or commit IOD of the repository.                                                      |
| `repos."search-paths`"             | No             | An array of strings used to search subdirectories of the Git repository.                                                                                            |
| `repos."username"`                 | No             | The username used to access the Git repository server. Required when the Git repository server supports HTTP basic authentication.                                  |
| `repos."password"`                 | No             | The password or personal access token used to access the Git repository server. Required when the Git repository server supports HTTP basic authentication.         |
| `repos."private-key"`              | No             | The SSH private key to access Git repository. Required when the URI begins with `git@` or `ssh://`.                                                                 |
| `repos."host-key"`                 | No             | The host key of the Git repository server. Shouldn't include the algorithm prefix as covered by `host-key-algorithm`.                                               |
| `repos."host-key-algorithm"`       | No             | The host key algorithm. Should be `ssh-dss`, `ssh-rsa`, `ecdsa-sha2-nistp256`, `ecdsa-sha2-nistp384`, or `ecdsa-sha2-nistp521`. Required only if `host-key` exists. |
| `repos."strict-host-key-checking"` | No             | Indicates whether the Config Server instance fails to start when using the private `host-key`. Should be `true` (default value) or `false`.                         |

The following table shows some examples of patterns for configuring your service with an optional extra repository. For more information, see the [Extra repositories](#extra-repositories) section in this article and the [Pattern Matching and Multiple Repositories](https://cloud.spring.io/spring-cloud-config/reference/html/#_pattern_matching_and_multiple_repositories) section of [Spring Cloud Config](https://spring.io/projects/spring-cloud-config).

| Patterns                        | Description                                                                                                            |
|:--------------------------------|------------------------------------------------------------------------------------------------------------------------|
| `test-config-server-app-0/*`    | The pattern and repository URI matches a Spring boot application named `test-config-server-app-0` with any profile.    |
| `test-config-server-app-1/dev`  | The pattern and repository URI matches a Spring boot application named `test-config-server-app-1` with a dev profile.  |
| `test-config-server-app-2/prod` | The pattern and repository URI matches a Spring boot application named `test-config-server-app-2` with a prod profile. |

::: zone pivot="sc-standard"

:::image type="content" source="media/how-to-config-server/additional-repositories-standard.png" alt-text="Screenshot of the Azure portal that shows the Config Server page with the Patterns column of the Additional repositories table highlighted." lightbox="media/how-to-config-server/additional-repositories-standard.png":::

::: zone-end

::: zone pivot="sc-enterprise"

:::image type="content" source="media/how-to-config-server/additional-repositories.png" alt-text="Screenshot of the Azure portal that shows the Config Server page with the Patterns column of the Additional repositories table highlighted." lightbox="media/how-to-config-server/additional-repositories.png":::

::: zone-end

## Configure a Git repository against Config Server

After you save your configuration files in a repository, use the following steps to connect Azure Spring Apps to the repository:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to your Azure Spring Apps **Overview** page.

1. Select **Spring Cloud Config Server** in the navigation pane.

1. In the **Default repository** section, set **URI** to `https://github.com/Azure-Samples/piggymetrics-config`.

1. Select **Validate**.

   ::: zone pivot="sc-standard"

   :::image type="content" source="media/how-to-config-server/portal-config-standard.png" alt-text="Screenshot of the Azure portal that shows the Config Server page." lightbox="media/how-to-config-server/portal-config-standard.png":::

   ::: zone-end

   ::: zone pivot="sc-enterprise"

   :::image type="content" source="media/how-to-config-server/portal-config.png" alt-text="Screenshot of the Azure portal that shows the Config Server page." lightbox="media/how-to-config-server/portal-config.png":::

   ::: zone-end

1. When validation is complete, select **Apply** to save your changes.

   ::: zone pivot="sc-standard"

   :::image type="content" source="media/how-to-config-server/validate-complete-standard.png" alt-text="Screenshot of the Azure portal that shows the Config Server page with Apply button highlighted." lightbox="media/how-to-config-server/validate-complete-standard.png":::

   ::: zone-end

   ::: zone pivot="sc-enterprise"

   :::image type="content" source="media/how-to-config-server/validate-complete.png" alt-text="Screenshot of the Azure portal that shows the Config Server page with Apply button highlighted." lightbox="media/how-to-config-server/validate-complete.png":::

   ::: zone-end

Updating the configuration can take a few minutes. You should get a notification when the configuration is complete.

### Enter repository information directly to the Azure portal

You can enter repository information for the default repository and, optionally, for extra repositories.

#### Default repository

This section shows you how to enter repository information for a public or private repository. For a private repo, you can use Basic authentication or SSH.

Use the following steps to enter repo information for a public repository:

1. In the **Default repository** section, in the **Uri** box, paste the repository URI.
1. For the **Label** setting, enter **config**.
1. Ensure that the **Authentication** setting is **Public**.
1. Select **Apply**.

Use the following steps to enter repo information for a private repository using basic password/token-based authentication:

1. In the **Default repository** section, in the **Uri** box, paste the repository URI.
1. Under **Authentication**, select **Edit Authentication**.
1. In the **Edit Authentication** pane, on the **Authentication type** drop-down list, select **HTTP Basic**.
1. Enter your username and password/token to grant access to Azure Spring Apps.
1. Select **OK**, and then select **Apply** to finish setting up your Config Server instance.

   :::image type="content" source="media/how-to-config-server/basic-auth.png" alt-text="Screenshot of the Azure portal that shows the Default repository section of the authentication settings for Basic authentication." lightbox="media/how-to-config-server/basic-auth.png":::

   > [!NOTE]
   > Many Git repository servers support the use of tokens rather than passwords for HTTP basic authentication. Some repositories allow tokens to persist indefinitely. However, some Git repository servers, including Azure DevOps Server, force tokens to expire in a few hours. Repositories that cause tokens to expire shouldn't use token-based authentication with Azure Spring Apps. If you use such a token, remember to update it before it expires.
   >
   > GitHub has removed support for password authentication, so you need to use a personal access token instead of password authentication for GitHub. For more information, see [Token authentication requirements for Git operations](https://github.blog/2020-12-15-token-authentication-requirements-for-git-operations/).

Use the following steps to enter repo information for a private repository using SSH:

1. In the **Default repository** section, in the **Uri** box, paste the repository URI.
1. Under **Authentication**, select **Edit Authentication**.
1. On the **Edit Authentication** pane, in the **Authentication type** drop-down list, select **SSH**.
1. Enter your private key. Optionally, specify your host key and host key algorithm.
1. Include your public key in your Config Server repository.
1. Select **OK**, and then select **Apply** to finish setting up your Config Server instance.

   :::image type="content" source="media/how-to-config-server/ssh-auth.png" alt-text="Screenshot of the Azure portal that shows the Default repository section of the authentication settings for SSH authentication." lightbox="media/how-to-config-server/ssh-auth.png":::

#### Extra repositories

If you want to configure your service with an optional extra repository, use the following steps:

1. Specify the **Uri** and **Authentication** settings as you did for the default repository. Be sure to include a **Name** setting for your pattern.
1. Select **Apply** to attach the repository to your instance.

### Configure a Git repository by importing a YAML file

If you wrote a YAML file with your repository settings, you can import the file directly from your local machine to Azure Spring Apps. The following example shows a simple YAML file for a private repository with basic authentication:

```yaml
spring:
  cloud:
    config:
      server:
        git:
          uri: https://github.com/azure-spring-apps-samples-pr/config-server-repository.git
          username: <username>
          password: <password/token>
```

Use the following steps to import a YAML file:

1. Select **Import settings** and then select the YAML file from your project directory. Select **Import**.

   ::: zone pivot="sc-standard"

   :::image type="content" source="media/how-to-config-server/import-settings-standard.png" alt-text="Screenshot of the Azure portal that shows the Config Server Import settings pane." lightbox="media/how-to-config-server/import-settings-standard.png":::

   ::: zone-end

   ::: zone pivot="sc-enterprise"

   :::image type="content" source="media/how-to-config-server/import-settings.png" alt-text="Screenshot of the Azure portal that shows the Config Server Import settings pane." lightbox="media/how-to-config-server/import-settings.png":::

   ::: zone-end

   The **Notifications** pane displays an `async` operation. Config Server should report success after 1-2 minutes. The information from your YAML file displays in the Azure portal.

1. Select **Apply** to finish the import.

## Configure Azure Repos against Config Server

Azure Spring Apps can access Git repositories that are public, secured by SSH, or secured using HTTP basic authentication. HTTP basic authentication is the easiest of the options for creating and managing repositories with Azure Repos.

### Get the repo URL and credentials

Use the following steps to get your repo URL and credentials:

1. In the Azure Repos portal for your project, select **Clone**.

1. Copy the clone URL from the textbox. This URL is typically in the following form:

   ```text
   https://<organization name>@dev.azure.com/<organization name>/<project name>/_git/<repository name>
   ```

   Remove everything after `https://` and before `dev.azure.com`, including the `@` symbol. The resulting URL should be in the following form:

   ```text
   https://dev.azure.com/<organization name>/<project name>/_git/<repository name>
   ```

   Save this URL to use later.

1. Select **Generate Git Credentials** to display a username and password. Save this username and password to use in the following section.

### Configure a Git repository against Config Server

Use the following steps to configure the repo:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to your Azure Spring Apps **Overview** page.

1. Select the service to configure.

1. In the left pane of the service page under **Settings**, select the **Spring Cloud Config Server** tab. 

1. Use the following steps to configure the repository you created:

   - Add the repository URI that you saved earlier.
   - Select the setting under **Authentication** to open the **Edit Authentication** pane.
   - For **Authentication type**, select **HTTP Basic**.
   - For **Username**, specify the user name that you saved earlier.
   - For **Password**, specify the password that you saved earlier.
   - Select **OK**, and then wait for the operation to complete.

   :::image type="content" source="media/how-to-config-server/config-server-azure-repos.png" alt-text="Screenshot of the Azure portal that shows the default repository configuration settings with the Uri and Authentication Type highlighted." lightbox="media/how-to-config-server/config-server-azure-repos.png":::

::: zone pivot="sc-enterprise"

### Bind an app to Spring Cloud Config Server

Use the following command to bind an app to Spring Cloud Config Server, enabling the app to pull configurations from Config Server.

```azurecli
az spring config-server bind \
    --resource-group <resource-group> \
    --service <service-name> \
    --app <app-name>
```

You can also set up the app binding from the Azure portal, as shown in the following screenshot:

:::image type="content" source="media/how-to-config-server/spring-cloud-config-server-bind-app.png" alt-text="Screenshot of the Azure portal that shows the Spring Cloud Config Server page with the App binding dropdown highlighted." lightbox="media/how-to-config-server/spring-cloud-config-server-bind-app.png":::

> [!NOTE]
> These changes take a few minutes to propagate to all applications when the config server status changes.
>
> If you change the binding/unbinding status, you need to restart or redeploy the application.

You can now choose to bind your application to the Spring Cloud Config Server directly when creating a new app by using the following command:

```azurecli
az spring app create \ 
    --resource-group <resource-group> \ 
    --service <service-name> \ 
    --name <app-name> \ 
    --bind-config-server
```

You can also bind your application to the Spring Cloud Config Server from the Azure portal, as shown in the following screenshot:

:::image type="content" source="media/how-to-config-server/spring-cloud-config-server-bind-app-when-creation.png" alt-text="Screenshot of the Azure portal that shows the Create App page with the Bind dropdown highlighted." lightbox="media/how-to-config-server/spring-cloud-config-server-bind-app-when-creation.png":::

::: zone-end

## Delete your configuration

Select **Reset** on the **Spring Cloud Config Server** tab to erase your existing settings. Delete the config server settings if you want to connect your Config Server instance to another source, such as when you're moving from GitHub to Azure DevOps Server.

## Refresh Config Server

When properties are changed, services consuming those properties must be notified before changes can be made. The default solution for Spring Cloud Config Server is to manually trigger the refresh event, which might not be feasible if there are many app instances. For more information, see [Centralized Configuration](https://spring.io/guides/gs/centralized-configuration/)

Instead, you can automatically refresh values from Config Server by letting the config client poll for changes based on a refresh internal. 

Use the following steps to automatically refresh values from Config Server:

1. Register a scheduled task to refresh the context in a given interval, as shown in the following example:

   ```java
   @ConditionalOnBean({RefreshEndpoint.class})
   @Configuration
   @AutoConfigureAfter({RefreshAutoConfiguration.class, RefreshEndpointAutoConfiguration.class})
   @EnableScheduling
   public class ConfigClientAutoRefreshConfiguration implements SchedulingConfigurer {
       @Value("${spring.cloud.config.refresh-interval:60}")
       private long refreshInterval;
       @Value("${spring.cloud.config.auto-refresh:false}")
       private boolean autoRefresh;
       private RefreshEndpoint refreshEndpoint;
       public ConfigClientAutoRefreshConfiguration(RefreshEndpoint refreshEndpoint) {
           this.refreshEndpoint = refreshEndpoint;
       }
       @Override
       public void configureTasks(ScheduledTaskRegistrar scheduledTaskRegistrar) {
           if (autoRefresh) {
               // set minimal refresh interval to 5 seconds
               refreshInterval = Math.max(refreshInterval, 5);
               scheduledTaskRegistrar.addFixedRateTask(() -> refreshEndpoint.refresh(), refreshInterval * 1000);
           }
       }
   }
   ```

1. Enable autorefresh and set the appropriate refresh interval in your **application.yml** file. In the following example, the client polls for configuration changes every 60 seconds, which is the minimum value you can set for a refresh interval.

   By default, autorefresh is set to `false` and the refresh-interval is set to `60 seconds`.

   ```yaml
   spring:
       cloud:
            config:
             auto-refresh: true
             refresh-interval: 60
   management:
       endpoints:
            web:
             exposure:
               include:
                 - refresh
   ```

1. Add `@RefreshScope` to your code. In the following example, the variable `connectTimeout` is automatically refreshed every 60 seconds.

   ```java
   @RestController
   @RefreshScope
   public class HelloController {
       @Value("${timeout:4000}")
       private String connectTimeout;
   }
   ```

For more information, see the [config-client-polling](https://github.com/Azure-Samples/azure-spring-apps-samples/tree/main/config-client-polling) sample.

::: zone pivot="sc-enterprise"

## Manage Spring Cloud Config Server in an existing Enterprise plan instance

You can enable and disable Spring Cloud Config Server after service creation using the Azure portal or Azure CLI. Before disabling Spring Cloud Config Server, you're required to unbind all of your apps from it.

### [Azure portal](#tab/Portal)

Use the following steps to enable or disable Spring Cloud Config Server:

1. Navigate to your service instance and then select **Spring Cloud Config Server**.

1. Select **Manage**.

1. Select or unselect **Enable Spring Cloud Config Server**, and then select **Save**.

   :::image type="content" source="media/how-to-config-server/enable-config-server.png" alt-text="Screenshot of the Azure portal that shows the Manage pane with the Enable Config Server option highlighted." lightbox="media/how-to-config-server/enable-config-server.png":::

1. You can now view the state of Spring Cloud Config Server on the **Spring Cloud Config Server** page.

### [Azure CLI](#tab/Azure-CLI)

Use the following Azure CLI commands to enable or disable Spring Cloud Config Server:

```azurecli
az spring config-server create \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name>
```

```azurecli
az spring config-server delete \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-service-instance-name>
```

---

::: zone-end

## Related content

[Azure Spring Apps](index.yml)
