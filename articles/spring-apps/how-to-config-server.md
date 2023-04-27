---
title: Configure your managed Spring Cloud Config Server in Azure Spring Apps
description: Learn how to configure a managed Spring Cloud Config Server in Azure Spring Apps on the Azure portal
ms.service: spring-apps
ms.topic: how-to
ms.author: karler
author: karlerickson
ms.date: 12/10/2021
ms.custom: devx-track-java, event-tier1-build-2022
---

# Configure a managed Spring Cloud Config Server in Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ✔️ Basic/Standard tier ❌ Enterprise tier

This article shows you how to configure a managed Spring Cloud Config Server in Azure Spring Apps service.

Spring Cloud Config Server provides server and client-side support for an externalized configuration in a distributed system. The Config Server instance provides a central place to manage external properties for applications across all environments. For more information, see the [Spring Cloud Config documentation](https://spring.io/projects/spring-cloud-config).

> [!NOTE]
> The Config Server feature for the Standard consumption plan is currently under private preview. To sign up for this feature, fill in the form at [Azure Spring Apps Consumption - Fully Managed Spring Eureka & Config - Private Preview](https://aka.ms/asa-consumption-middleware-signup).

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- An already provisioned and running Azure Spring Apps service of basic or standard tier. To set up and launch an Azure Spring Apps service, see [Quickstart: Deploy your first application to Azure Spring Apps](./quickstart.md). Spring Cloud Config Server isn't applicable to enterprise tier.

## Restriction

There are some restrictions when you use Config Server with a Git back end. The following properties are automatically injected into your application environment to access Config Server and Service Discovery. If you also configure those properties from your Config Server files, you might experience conflicts and unexpected behavior.

```yaml
eureka.client.service-url.defaultZone
eureka.client.tls.keystore
eureka.instance.preferIpAddress
eureka.instance.instance-id
server.port
spring.cloud.config.tls.keystore
spring.config.import
spring.application.name
spring.jmx.enabled
management.endpoints.jmx.exposure.include
```

> [!CAUTION]
> Don't put these properties in your Config Server application files.

## Create your Config Server files

Azure Spring Apps supports Azure DevOps, GitHub, GitLab, and Bitbucket for storing your Config Server files. When your repository is ready, you can create the configuration files and store them there.

Some configurable properties are available only for certain types. The following sections describe the properties for each repository type.

> [!NOTE]
> Config Server takes `master` (on Git) as the default label if you don't specify one. However, GitHub has recently changed the default branch from `master` to `main`. To avoid Azure Spring Apps Config Server failure, be sure to pay attention to the default label when setting up Config Server with GitHub, especially for newly-created repositories.

### Public repository

When you use a public repository, your configurable properties are more limited than with a private repository.

The following table lists the configurable properties that you can use to set up a public Git repository.

> [!NOTE]
> Using a hyphen (-) to separate words is the only naming convention that's currently supported. For example, you can use *default-label*, but not *defaultLabel*.

| Property        | Required | Feature                                                                                                                         |
|:----------------|----------|---------------------------------------------------------------------------------------------------------------------------------|
| `uri`           | Yes      | The URI of the Git repository that's used as the Config Server back end. Should begin with `http://`, `https://`, `git@`, or `ssh://`. |
| `default-label` | No       | The default label of the Git repository. Should be the branch name, tag name, or commit ID of the repository.             |
| `search-paths`  | No       | An array of strings that are used to search subdirectories of the Git repository.                                               |

### Private repository with SSH authentication

The following table lists the configurable properties that you can use to set up a private Git repository with SSH.

> [!NOTE]
> Using a hyphen (-) to separate words is the only naming convention that's currently supported. For example, you can use *default-label*, but not *defaultLabel*.

| Property                   | Required | Feature                                                                                                                                                              |
|:---------------------------|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `uri`                      | Yes      | The URI of the Git repository used as the Config Server back end. Should begin with `http://`, `https://`, `git@`, or `ssh://`.                                 |
| `default-label`            | No       | The default label of the Git repository. Should be the branch name, tag name, or commit ID of the repository.                                                  |
| `search-paths`             | No       | An array of strings used to search subdirectories of the Git repository.                                                                                             |
| `private-key`              | No       | The SSH private key to access the Git repository. Required when the URI starts with `git@` or `ssh://`.                                                            |
| `host-key`                 | No       | The host key of the Git repository server. Shouldn't include the algorithm prefix as covered by `host-key-algorithm`.                                                 |
| `host-key-algorithm`       | No       | The host key algorithm. Should be *ssh-dss*, *ssh-rsa*, *ecdsa-sha2-nistp256*, *ecdsa-sha2-nistp384*, or *ecdsa-sha2-nistp521*. Required only if `host-key` exists. |
| `strict-host-key-checking` | No       | Indicates whether the Config Server instance will fail to start when using the private `host-key`. Should be *true* (default value) or *false*.                      |

> [!NOTE]
> Config Server uses RSA keys with SHA-1 signatures for now. If you're using GitHub, for RSA public keys added to GitHub before November 2, 2021, the corresponding private key is supported. For RSA public keys added to GitHub after November 2, 2021, the corresponding private key is not supported, and we suggest using basic authentication instead.

### Private repository with basic authentication

The following table lists the configurable properties that you can use to set up a private Git repository with basic authentication. 

> [!NOTE]
> Using a hyphen (-) to separate words is the only naming convention that's currently supported. For example, use *default-label*, not *defaultLabel*.

| Property        | Required | Feature                                                                                                                                                         |
|:----------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `uri`           | Yes      | The URI of the Git repository that's used as the Config Server back end. Should begin with `http://`, `https://`, `git@`, or `ssh://`.                      
| `default-label` | No       | The default label of the Git repository. Should be the *branch name*, *tag name*, or *commit-id* of the repository.                                             |
| `search-paths`  | No       | An array of strings used to search subdirectories of the Git repository.                                                                                        |
| `username`      | No       | The username that's used to access the Git repository server. Required when the Git repository server supports HTTP basic authentication.                   |
| `password`      | No       | The password or personal access token used to access the Git repository server. Required when the Git repository server supports HTTP basic authentication. |

> [!NOTE]
> Many Git repository servers support the use of tokens rather than passwords for HTTP basic authentication. Some repositories allow tokens to persist indefinitely. However, some Git repository servers, including Azure DevOps Server, force tokens to expire in a few hours. Repositories that cause tokens to expire shouldn't use token-based authentication with Azure Spring Apps.
>
> GitHub has removed support for password authentication, so you'll need to use a personal access token instead of password authentication for GitHub. For more information, see [Token authentication requirements for Git operations](https://github.blog/2020-12-15-token-authentication-requirements-for-git-operations/).

### Other Git repositories

The following table lists the configurable properties you can use to set up Git repositories with a pattern.

> [!NOTE]
> Using a hyphen (-) to separate words is the only naming convention that's currently supported. For example, use *default-label*, not *defaultLabel*.

| Property                           | Required       | Feature                                                                                                                                                            |
|:-----------------------------------|----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `repos`                            | No             | A map consisting of the settings for a Git repository with a given name.                                                                                           |
| `repos."uri"`                      | Yes on `repos` | The URI of the Git repository that's used as the Config Server back end. Should begin with `http://`, `https://`, `git@`, or `ssh://`.                         |
| `repos."name"`                     | Yes on `repos` | A name to identify the repository; for example, *team-A* or *team-B*. Required only if `repos` exists.                                                        |
| `repos."pattern"`                  | No             | An array of strings used to match an application name. For each pattern, use the format *{application}/{profile}* format with wildcards.                                  |
| `repos."default-label"`            | No             | The default label of the Git repository. Should be the branch name, tag name, or commit IOD of the repository.                                                 |
| `repos."search-paths`"             | No             | An array of strings used to search subdirectories of the Git repository.                                                                                           |
| `repos."username"`                 | No             | The username used to access the Git repository server. Required when the Git repository server supports HTTP basic authentication.                      |
| `repos."password"`                 | No             | The password or personal access token used to access the Git repository server. Required when the Git repository server supports HTTP basic authentication.      |
| `repos."private-key"`              | No             | The SSH private key to access Git repository. Required when the URI begins with `git@` or `ssh://`.                                                                |
| `repos."host-key"`                 | No             | The host key of the Git repository server. Shouldn't include the algorithm prefix as covered by `host-key-algorithm`.                                               |
| `repos."host-key-algorithm"`       | No             | The host key algorithm. Should be *ssh-dss*, *ssh-rsa*, *ecdsa-sha2-nistp256*, *ecdsa-sha2-nistp384*, or *ecdsa-sha2-nistp521*. Required only if `host-key` exists. |
| `repos."strict-host-key-checking"` | No             | Indicates whether the Config Server instance will fail to start when using the private `host-key`. Should be *true* (default value) or *false*.                    |

The following table shows some examples of patterns for configuring your service with an optional additional repository. For more information, see the [Additional repositories section](#additional-repositories) and the [Pattern Matching and Multiple Repositories section](https://cloud.spring.io/spring-cloud-config/reference/html/#_pattern_matching_and_multiple_repositories) of the Spring documentation.

| Patterns                        | Description                                                                                                            |
|:--------------------------------|------------------------------------------------------------------------------------------------------------------------|
| *test-config-server-app-0/\**   | The pattern and repository URI matches a Spring boot application named `test-config-server-app-0` with any profile.    |
| *test-config-server-app-1/dev*  | The pattern and repository URI matches a Spring boot application named `test-config-server-app-1` with a dev profile.  |
| *test-config-server-app-2/prod* | The pattern and repository URI matches a Spring boot application named `test-config-server-app-2` with a prod profile. |

:::image type="content" source="media/how-to-config-server/additional-repositories.png" lightbox="media/how-to-config-server/additional-repositories.png" alt-text="Screenshot of Azure portal showing the Config Server page with the Patterns column of the 'Additional repositories' table highlighted.":::

## Attach your Config Server repository to Azure Spring Apps

Now that your configuration files are saved in a repository, use the following steps to connect Azure Spring Apps to the repository.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to your Azure Spring Apps **Overview** page.

1. Select **Config Server** in the left navigation pane.

1. In the **Default repository** section, set **URI** to `https://github.com/Azure-Samples/piggymetrics-config`.

1. Select **Validate**.

   :::image type="content" source="media/how-to-config-server/portal-config.png" lightbox="media/how-to-config-server/portal-config.png" alt-text="Screenshot of Azure portal showing the Config Server page.":::

1. When validation is complete, select **Apply** to save your changes.

   :::image type="content" source="media/how-to-config-server/validate-complete.png" lightbox="media/how-to-config-server/validate-complete.png" alt-text="Screenshot of Azure portal showing Config Server page with Apply button highlighted.":::

Updating the configuration can take a few minutes. You should get a notification when the configuration is complete.

### Enter repository information directly to the Azure portal

You can enter repository information for the default repository and, optionally, for additional repositories.

#### Default repository

Use the steps in this section to enter repository information for a public or private repository.

- **Public repository**: In the **Default repository** section, in the **Uri** box, paste the repository URI. Enter *config* for the **Label** setting. Ensure that the **Authentication** setting is *Public*, and then select **Apply**.

- **Private repository**: Azure Spring Apps supports basic password/token-based authentication and SSH.

   - **Basic Authentication**: In the **Default repository** section, in the **Uri** box, paste the repository URI, and then select the setting under **Authentication** to open the **Edit Authentication** pane. In the **Authentication type** drop-down list, select **HTTP Basic**, and then enter your username and password/token to grant access to Azure Spring Apps. Select **OK**, and then select **Apply** to finish setting up your Config Server instance.

   :::image type="content" source="media/how-to-config-server/basic-auth.png" lightbox="media/how-to-config-server/basic-auth.png" alt-text="Screenshot of the Default repository section showing authentication settings for Basic authentication.":::

   > [!NOTE]
   > Many Git repository servers support the use of tokens rather than passwords for HTTP basic authentication. Some repositories allow tokens to persist indefinitely. However, some Git repository servers, including Azure DevOps Server, force tokens to expire in a few hours. Repositories that cause tokens to expire shouldn't use token-based authentication with Azure Spring Apps.
   >
   > GitHub has removed support for password authentication, so you'll need to use a personal access token instead of password authentication for GitHub. For more information, see [Token authentication requirements for Git operations](https://github.blog/2020-12-15-token-authentication-requirements-for-git-operations/).

   - **SSH**: In the **Default repository** section, in the **Uri** box, paste the repository URI, and then select the setting under **Authentication** to open the **Edit Authentication** pane. In the **Edit Authentication** pane, in the **Authentication type** drop-down list, select **SSH**, and then enter your private key. Optionally, specify your host key and host key algorithm. Include your public key in your Config Server repository. Select **OK**, and then select **Apply** to finish setting up your Config Server instance.

   :::image type="content" source="media/how-to-config-server/ssh-auth.png" lightbox="media/how-to-config-server/ssh-auth.png" alt-text="Screenshot of the Default repository section showing authentication settings for SSH authentication.":::

#### Additional repositories

If you want to configure your service with an optional additional repository, specify the **Uri** and **Authentication** settings as you did for the default repository. Be sure to include a **Name** setting for your pattern, and then select **Apply** to attach it to your instance.

### Enter repository information into a YAML file

If you've written a YAML file with your repository settings, you can import the file directly from your local machine to Azure Spring Apps. The following example shows a simple YAML file for a private repository with basic authentication.

```yaml
spring:
    cloud:
        config:
            server:
                git:
                    uri: https://github.com/azure-spring-cloud-samples/config-server-repository.git
                    username: <username>
                    password: <password/token>

```

Select the **Import settings** button, and then select the YAML file from your project directory. Select **Import**.

:::image type="content" source="media/how-to-config-server/import-settings.png" lightbox="media/how-to-config-server/import-settings.png" alt-text="Screenshot of the Config Server Import settings pane.":::

Your **Notifications** displays an `async` operation. Config Server should report success after 1-2 minutes. The information from your YAML file displays in the Azure portal. Select **Apply** to finish the import.

## Use Azure Repos for Azure Spring Apps configuration

Azure Spring Apps can access Git repositories that are public, secured by SSH, or secured using HTTP basic authentication. HTTP basic authentication is the easiest of the options for creating and managing repositories with Azure Repos.

### Get repo URL and credentials

Use the following steps to get your repo URL and credentials.

1. In the Azure Repos portal for your project, select the **Clone** button:

1. Copy the clone URL from the textbox. This URL will typically be in the following form:

   ```text
   https://<organization name>@dev.azure.com/<organization name>/<project name>/_git/<repository name>
   ```

   Remove everything after `https://` and before `dev.azure.com`, including the `@` symbol. The resulting URL should be in the following form:

   ```text
   https://dev.azure.com/<organization name>/<project name>/_git/<repository name>
   ```

   Save this URL for use in the next section.

1. Select **Generate Git Credentials** to display a username and password, which should be saved for use in the following section.

### Configure Azure Spring Apps to access the Git repository

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to your Azure Spring Apps **Overview** page.

1. Select the service to configure.

1. In the left pane of the service page under **Settings**, select the **Config Server** tab. Configure the repository you created, as follows:

   - Add the repository URI that you saved in the previous section.
   - Select the setting under **Authentication** to open the **Edit Authentication** pane.
   - For **Authentication type**, select **HTTP Basic**.
   - For **Username**, specify the user name that you saved in the previous section.
   - For **Password**, specify the password that you saved in the previous section.
   - Select **OK**, and then wait for the operation to complete.

   :::image type="content" source="media/how-to-config-server/config-server-azure-repos.png" lightbox="media/how-to-config-server/config-server-azure-repos.png" alt-text="Screenshot of repository configuration settings.":::

## Delete your configuration

Select **Reset** on the **Config Server** tab to erase your existing settings. Delete the config server settings if you want to connect your Config Server instance to another source, such as when you're moving from GitHub to Azure DevOps.

## Config Server refresh

When properties are changed, services consuming those properties must be notified before changes can be made. The default solution for Spring Cloud Config Server is to manually trigger the refresh event, which may not be feasible if there are many app instances. For more information, see [Centralized Configuration](https://spring.io/guides/gs/centralized-configuration/)

Instead, you can automatically refresh values from Config Server by letting the config client poll for changes based on a refresh internal. Use the following steps to automatically refresh values from Config Server.

1. Register a scheduled task to refresh the context in a given interval, as shown in the following example.

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

1. Enable auto-refresh and set the appropriate refresh interval in your *application.yml* file. In the following example, the client polls for config changes every 60 seconds, which is the minimum value you can set for a refresh interval.

   By default, auto-refresh is set to *false* and the refresh-interval is set to *60 seconds*.

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

1. Add @RefreshScope in your code. In the following example, the variable `connectTimeout` is automatically refreshed every 60 seconds.

   ```java
   @RestController
   @RefreshScope
   public class HelloController {
       @Value("${timeout:4000}")
       private String connectTimeout;
   }
   ```

For more information, see the [config-client-polling sample](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples/tree/master/config-client-polling).

## Next steps

In this article, you learned how to enable and configure your Spring Cloud Config Server instance. To learn more about managing your application, see [Scale an application in Azure Spring Apps](./how-to-scale-manual.md).
