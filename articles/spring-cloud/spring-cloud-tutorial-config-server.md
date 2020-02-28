---
title: Tutorial - Set up your Config Server instance in Azure Spring Cloud
description: In this tutorial, you learn how to set up a Spring Cloud Config Server instance for your Azure Spring Cloud on the Azure portal
ms.service: spring-cloud
ms.topic: tutorial
ms.author: brendm
author: bmitchell287
ms.date: 10/18/2019
---

# Tutorial: Set up a Spring Cloud Config Server instance for your service

This article shows you how to connect a Spring Cloud Config Server instance to your Azure Spring Cloud service.

Spring Cloud Config provides server and client-side support for an externalized configuration in a distributed system. With the Config Server instance, you have a central place to manage external properties for applications across all environments.​ For more information, see [Spring Cloud Config Server reference](https://spring.io/projects/spring-cloud-config).

## Prerequisites
* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 
* An already provisioned and running Azure Spring Cloud service. To set up and launch an Azure Spring Cloud service, see [Quickstart: Launch a Java Spring application by using the Azure CLI](spring-cloud-quickstart-launch-app-cli.md).

## Restriction

There are some restrictions when you use Config Server with a Git back end. Some properties are automatically injected into your application environment to access Config Server and Service Discovery. If you also configure those properties from your Config Server files, you might experience conflicts and unexpected behavior. The properties include: 

```yaml
eureka.client.service-url.defaultZone
eureka.client.tls.keystore
server.port
spring.cloud.config.tls.keystore
spring.application.name
```

> [!CAUTION]
> We strongly recommend that you _do not_ put the above properties in your Config Server application files.

## Create your Config Server files

Azure Spring Cloud supports Azure DevOps, GitHub, GitLab, and Bitbucket for storing your Config Server files. When you have your repository ready, create the configuration files with the following instructions and store them there.

Additionally, some configurable properties are available only for certain types. The following subsections list the properties for each repository type.

### Public repository

When you use a public repository, your configurable properties are more limited.

All configurable properties that are used to set up the public Git repository are listed in the following table:

> [!NOTE]
> Using a hyphen (-) to separate words is the only naming convention that's currently supported. For example, you can use *default-label*, but not *defaultLabel*.

| Property        | Required | Feature                                                      |
| :-------------- | -------- | ------------------------------------------------------------ |
| `uri`           | Yes    | The URI of the Git repository that's used as the Config Server back end begins with *http://*, *https://*, *git@*, or *ssh://*. |
| `default-label` | No     | The default label of the Git repository, should be the *branch name*, *tag name*, or *commit-id* of the repository. |
| `search-paths`  | No     | An array of strings that are used to search subdirectories of the Git repository. |

------

### Private repository with SSH authentication

All configurable properties used to set up private Git repository with SSH are listed in the following table:

> [!NOTE]
> Using a hyphen (-) to separate words is the only naming convention that's currently supported. For example, you can use *default-label*, but not *defaultLabel*.

| Property                   | Required | Feature                                                      |
| :------------------------- | -------- | ------------------------------------------------------------ |
| `uri`                      | Yes    | The URI of the Git repository used as the Config Server back end, should be started with *http://*, *https://*, *git@*, or *ssh://*. |
| `default-label`            | No     | The default label of the Git repository, should be the *branch name*, *tag name*, or *commit-id* of the repository. |
| `search-paths`             | No     | An array of strings used to search subdirectories of the Git repository. |
| `private-key`              | No     | The SSH private key to access the Git repository, _required_ when the URI starts with *git@* or *ssh://*. |
| `host-key`                 | No     | The host key of the Git repository server, should not include the algorithm prefix as covered by `host-key-algorithm`. |
| `host-key-algorithm`       | No     | The host key algorithm, should be *ssh-dss*, *ssh-rsa*, *ecdsa-sha2-nistp256*, *ecdsa-sha2-nistp384*, or *ecdsa-sha2-nistp521*. *Required* only if `host-key` exists. |
| `strict-host-key-checking` | No     | Indicates whether the Config Server instance will fail to start when leveraging the private `host-key`. Should be *true* (default value) or *false*. |

-----

### Private repository with basic authentication

All configurable properties used to set up private Git repository with basic authentication are listed below.

> [!NOTE]
> Using a hyphen (-) to separate words is the only naming convention that's currently supported. For example, use *default-label*, not *defaultLabel*.

| Property        | Required | Feature                                                      |
| :-------------- | -------- | ------------------------------------------------------------ |
| `uri`           | Yes    | The URI of the Git repository that's used as the Config Server back end should be started with *http://*, *https://*, *git@*, or *ssh://*. |
| `default-label` | No     | The default label of the Git repository, should be the *branch name*, *tag name*, or *commit-id* of the repository. |
| `search-paths`  | No     | An array of strings used to search subdirectories of the Git repository. |
| `username`      | No     | The username that's used to access the Git repository server, _required_ when the Git repository server supports `Http Basic Authentication`. |
| `password`      | No     | The password used to access the Git repository server, _required_ when the Git repository server supports `Http Basic Authentication`. |

> [!NOTE]
> Many `Git` repository servers support the use of tokens rather than passwords for HTTP Basic Authentication. Some repositories, such as GitHub, allow tokens to persist indefinitely. However, some Git repository servers, including Azure DevOps, force tokens to expire in a few hours. Repositories that cause tokens to expire should not use token-based authentication with Azure Spring Cloud.

### Git repositories with pattern

All configurable properties used to set up Git repositories with pattern are listed below.

> [!NOTE]
> Using a hyphen (-) to separate words is the only naming convention that's currently supported. For example, use *default-label*, not *defaultLabel*.

| Property                           | Required         | Feature                                                      |
| :--------------------------------- | ---------------- | ------------------------------------------------------------ |
| `repos`                            | No             | A map consisting of the settings for a Git repository with a given name. |
| `repos."uri"`                      | Yes on `repos` | The URI of the Git repository that's used as the Config Server back end should be started with *http://*, *https://*, *git@*, or *ssh://*. |
| `repos."name"`                     | Yes on `repos` | A name to identify on the Git repository, _required_ only if `repos` exists. For example, *team-A*, *team-B*. |
| `repos."pattern"`                  | No             | An array of strings used to match an application name. For each pattern, use the `{application}/{profile}` format with wildcards. |
| `repos."default-label"`            | No             | The default label of the Git repository, should be the *branch name*, *tag name*, or *commit-id* of the repository. |
| `repos."search-paths`"             | No             | An array of strings used to search subdirectories of the Git repository. |
| `repos."username"`                 | No             | The username that's used to access the Git repository server, _required_ when the Git repository server supports `Http Basic Authentication`. |
| `repos."password"`                 | No             | The password used to access the Git repository server, _required_ when the Git repository server supports `Http Basic Authentication`. |
| `repos."private-key"`              | No             | The SSH private key to access Git repository, _required_ when the URI starts with *git@* or *ssh://*. |
| `repos."host-key"`                 | No             | The host key of the Git repository server, should not include the algorithm prefix as covered by `host-key-algorithm`. |
| `repos."host-key-algorithm"`       | No             | The host key algorithm, should be *ssh-dss*, *ssh-rsa*, *ecdsa-sha2-nistp256*, *ecdsa-sha2-nistp384*, or *ecdsa-sha2-nistp521*. *Required* only if `host-key` exists. |
| `repos."strict-host-key-checking"` | No             | Indicates whether the Config Server instance will fail to start when leveraging the private `host-key`. Should be *true* (default value) or *false*. |

## Attach your Config Server repository to Azure Spring Cloud

Now that your configuration files are saved in a repository, you need to connect Azure Spring Cloud to it.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Go to your Azure Spring Cloud **Overview** page.

1. Select the service to configure.

1. In the left pane of the service page, under **Settings**, select the **Config Server** tab.

![The Config Server window](media/spring-cloud-tutorial-config-server/portal-config-server.png)

### Enter repository information directly to the Azure portal

#### Default repository

* **Public repository**: In the **Default repository** section, in the **Uri** box, paste the repository URI.  Set the **Label** to **config**. Ensure that the **Authentication** setting is **Public**, and then select **Apply** to finish. 

* **Private repository**: Azure Spring Cloud supports basic password/token-based authentication and SSH.

    * **Basic Authentication**: In the **Default repository** section, in the **Uri** box, paste the repository URI, and then select the **Authentication** ("pencil" icon) button. In the **Edit Authentication** pane, in the **Authentication type** drop-down list, select **HTTP Basic**, and then enter your username and password/token to grant access to Azure Spring Cloud. Select **OK**, and then select **Apply** to finish setting up your Config Server instance.

    ![The Edit Authentication pane](media/spring-cloud-tutorial-config-server/basic-auth.png)
    
    > [!CAUTION]
    > Some Git repository servers, such as GitHub, use a *personal-token* or an *access-token*, such as a password, for **Basic Authentication**. You can use that kind of token as a password in Azure Spring Cloud, because it will never expire. But for other Git repository servers, such as Bitbucket and Azure DevOps, the *access-token* expires in one or two hours. This means that the option isn't viable when you use those repository servers with Azure Spring Cloud.

    * **SSH**: In the **Default repository** section, in the **Uri** box, paste the repository URI, and then select the **Authentication** ("pencil" icon) button. In the **Edit Authentication** pane, in the **Authentication type** drop-down list, select **SSH**, and then enter your **Private key**. Optionally, specify your **Host key** and **Host key algorithm**. Be sure to include your public key in your Config Server repository. Select **OK**, and then select **Apply** to finish setting up your Config Server instance.

    ![The Edit Authentication pane](media/spring-cloud-tutorial-config-server/ssh-auth.png)

#### Pattern repository

If you want to use an optional **Pattern repository** to configure your service, specify the **URI** and **Authentication** the same way as the **Default repository**. Be sure to include a **Name** for your pattern, and then select **Apply** to attach it to your instance. 

### Enter repository information into a YAML file

If you have written a YAML file with your repository settings, you can import the file directly from your local machine to Azure Spring Cloud. A simple YAML file for a private repository with basic authentication would look like this:

```yml
spring:
    cloud:
        config:
            server:
                git:
                    uri: https://github.com/azure-spring-cloud-samples/config-server-repository.git
                    username: <username>
                    password: <password/token>

```

Select the **Import settings** button, and then select the YAML file from your project directory. Select **Import**, and then an `async` operation from your **Notifications** will pop up. After 1-2 minutes, it should report success.

![The Config Server Notifications pane](media/spring-cloud-tutorial-config-server/local-yml-success.png)


The information from your YAML file should be displayed in the Azure portal. Select **Apply** to finish. 


## Delete your app configuration

After you've saved a configuration file, the **Delete app configuration** button appears in the **Configuration** tab. Selecting this button will erase your existing settings completely. You should select it if you want to connect your Config Server instance to another source, such as moving from GitHub to Azure DevOps.



## Next steps

In this tutorial, you learned how to enable and configure your Spring Cloud Config Server instance. To learn more about managing your application, continue to the tutorial about manually scaling your app.

> [!div class="nextstepaction"]
> [Tutorial: Scale an application in Azure Spring Cloud](spring-cloud-tutorial-scale-manual.md)
