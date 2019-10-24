---
title: Set up your Config Server in Azure Spring Cloud | Microsoft Docs
description: In this tutorial, you learn how to set up a Spring Cloud Config Server for your Azure Spring Cloud on the Azure portal
services: spring-cloud
ms.service: spring-cloud
ms.topic: tutorial
ms.reviewer: jeconnoc
ms.author: v-vasuke
author: v-vasuke
ms.date: 08/08/2019
---

# Tutorial: Set up a Spring Cloud Config Server for your service

This tutorial will show you how to connect a Spring Cloud Config Server to your Azure Spring Cloud service.

Spring Cloud Config provides server and client-side support for externalized configuration in a distributed system. With the Config Server, you have a central place to manage external properties for applications across all environments.​ To learn more, visit the [Spring Cloud Config Server reference](https://spring.io/projects/spring-cloud-config).

## Prerequisites
* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin. 
* An already provisioned and running Azure Spring Cloud service.  Complete [this quickstart](spring-cloud-quickstart-launch-app-cli.md) to provision and launch an Azure Spring Cloud service.


## Restriction

There are some restrictions when you use __Config Server__ with a git backend. Some properties will automatically be injected to your application environment to access __Config Server__ and __Service Discovery__. If you also configure those properties from your **Config Server** files, you may experience conflicts and unexpected behavior.  The properties include: 

```yaml
eureka.client.service-url.defaultZone
eureka.client.tls.keystore
server.port
spring.cloud.config.tls.keystore
spring.application.name
```
> [!CAUTION]
> We strongly suggest you __DO NOT__ put the above properties in your __Config Server__  application files.

## Create your Config Server files

Azure Spring Cloud supports Azure DevOps, GitHub, GitLab, and Bitbucket for storing your Config Server files.  When you have your repository ready, make the configuration files with the instructions below and store them there.

Furthermore, some configurable properties are only available for some types. The following subsections list the properties for each repository type.


### Public repository

When using a public repository, your configurable properties will be more limited.

All configurable properties used to set up the public `Git` repository are listed below.

> [!NOTE]
> Only hyphen ("-") the separated words naming convention is supported for now. For example, you use `default-label` but not `defaultLabel`.

| Property        | Required | Feature                                                      |
| :-------------- | -------- | ------------------------------------------------------------ |
| `uri`           | `yes`    | The `uri` of `Git` repository used as the config server backend, should be started with `http://`, `https://`, `git@`, or `ssh://`. |
| `default-label` | `no`     | The default label of `Git` repository, should be `branch name`, `tag name` or `commit-id` of repository. |
| `search-paths`  | `no`     | An array of strings used to search subdirectories of `Git` repository. |

------

### Private repository with SSH authentication

All configurable properties used to set up private `Git` repository with `Ssh` are listed below.

> [!NOTE]
> Only hyphen ("-") the separated words naming convention is supported for now. For example, you use `default-label` but not `defaultLabel`.

| Property                   | Required | Feature                                                      |
| :------------------------- | -------- | ------------------------------------------------------------ |
| `uri`                      | `yes`    | The `uri` of `Git` repository used as the config server backend, should be started with `http://`, `https://`, `git@` or `ssh://`. |
| `default-label`            | `no`     | The default label of `Git` repository, should be `branch name`, `tag name` or `commit-id` of repository. |
| `search-paths`             | `no`     | An array of string used to search subdirectories of `Git` repository. |
| `private-key`              | `no`     | The `Ssh` private key to access `Git` repository, __required__ when `uri` started with `git@` or `ssh://`. |
| `host-key`                 | `no`     | The host key of the Git repository server, should not include the algorithm prefix as covered by `host-key-algorithm`. |
| `host-key-algorithm`       | `no`     | The host key algorithm, should be one of `ssh-dss`. `ssh-rsa`, `ecdsa-sha2-nistp256`, `ecdsa-sha2-nistp384` and `ecdsa-sha2-nistp521`. Only required if `host-key` exists. |
| `strict-host-key-checking` | `no`     | Indicates whether the config server will fail to start when leverage the provide `host-key`, should be `true` (default value) or `false`. |

-----

### Private repository with basic authentication

All configurable properties used to set up private Git repository with basic authentication are listed below.

> [!NOTE]
> Only hyphen ("-") the separated words naming convention is supported for now. For example, you can use `default-label` but not `defaultLabel`.

| Property        | Required | Feature                                                      |
| :-------------- | -------- | ------------------------------------------------------------ |
| `uri`           | `yes`    | The `uri` of `Git` repository used as the config server backend, should be started with `http://`, `https://`, `git@` or `ssh://`. |
| `default-label` | `no`     | The default label of `Git` repository, should be `branch name`, `tag name` or `commit-id` of repository. |
| `search-paths`  | `no`     | An array of string used to search subdirectories of `Git` repository. |
| `username`      | `no`     | The `username` used to access `Git` repository server, __required__ `Git` repository server support `Http Basic Authentication`. |
| `password`      | `no`     | The password used to access `Git` repository server, __required__ `Git` repository server support `Http Basic Authentication`. |

> [!NOTE]
> Some `Git` repository servers, like GitHub, support a "personal-token" or "access-token" as a password for `HTTP Basic Authentication`. You can use that kind of token as password here too, and the "personal-token" or "access-token" will not expire. But for Git repository servers like BitBucket and Azure DevOps, the token will expire in one or two hours, which make that option unviable for using with Azure Spring Cloud.

### Git repositories with pattern

All configurable properties used to set up Git repositories with pattern are listed below.

> [!NOTE]
> Only hyphen ("-") the separated words naming convention is supported for now. For example, you can use `default-label` but not `defaultLabel`.

| Property                           | Required         | Feature                                                      |
| :--------------------------------- | ---------------- | ------------------------------------------------------------ |
| `repos`                            | `no`             | A map consists of `Git` repositories settings with given name. |
| `repos."uri"`                      | `yes` on `repos` | The `uri` of `Git` repository used as the config server backend, should be started with `http://`, `https://`, `git@` or `ssh://`. |
| `repos."name"`                     | `yes` on `repos` | A name to identify of one `Git` Repository, __required__ only if `repos` exists. For example from above, `team-A`, `team-B`. |
| `repos."pattern"`                  | `no`             | An array of string used to match application name, for each pattern take `{application}/{profile}` format with wildcards. |
| `repos."default-label"`            | `no`             | The default label of `Git` repository, should be `branch name`, `tag name` or `commit-id` of repository. |
| `repos."search-paths`"             | `no`             | An array of string used to search subdirectories of `Git` repository. |
| `repos."username"`                 | `no`             | The `username` used to access `Git` repository server, __required__ `Git` repository server support `Http Basic Authentication`. |
| `repos."password"`                 | `no`             | The password used to access `Git` repository server, __required__ `Git` repository server support `Http Basic Authentication`. |
| `repos."private-key"`              | `no`             | The `Ssh` private key to access `Git` repository, __required__ when `uri` started with `git@` or `ssh://`. |
| `repos."host-key"`                 | `no`             | The host key of the Git repository server, should not include the algorithm prefix as covered by `host-key-algorithm`. |
| `repos."host-key-algorithm"`       | `no`             | The host key algorithm, should be one of `ssh-dss`. `ssh-rsa`, `ecdsa-sha2-nistp256`, `ecdsa-sha2-nistp384` and `ecdsa-sha2-nistp521`. Only __required__ if `host-key` exists. |
| `repos."strict-host-key-checking"` | `no`             | Indicates whether the config server will fail to start when leverage the provide `host-key`, should be `true` (default value) or `false`. |

### Import `application.yml` file from Spring Cloud Config

You can import some default config server settings directly from the [Spring Cloud Config](https://spring.io/projects/spring-cloud-config) website. You can do this directly from the Azure portal, so you don't need to take any steps now to prepare your config server files or repository.

## Attaching your Config Server repository to Azure Spring Cloud

Now that you have your configuration files saved in a repository, you need to connect Azure Spring Cloud to it.

1. Log in to the [Azure portal](https://portal.azure.com).

1. Navigate to your Azure Spring Cloud **Overview** page.

1. Go to the **Config Server** tab under the **Settings** heading in the menu on the left side.

### Public repository

If your repository is public, simply click the **Public** button and paste the URL.

### Private Repository

Azure Spring Cloud supports SSH authentication. Follow the instructions on the Azure portal for adding the public key to your repository. Then, be sure to include your private key in the configuration file.

Click **Apply** to finish setting up your Config Server.


## Delete your app configuration

Once you've saved a configuration file, the **Delete app configuration** button will appear in the **Configuration** tab. This will erase your existing settings completely. You should do this if you wish to connect your config server to another source, such as moving from GitHub to Azure DevOps.

## Next steps

In this tutorial, you learned how to enable and configure the Config Server. 
 To learn more about managing your application, continue to the tutorial for manually scaling your app.

> [!div class="nextstepaction"]
> [Learn how to manually scale your Azure Spring Cloud application](spring-cloud-tutorial-scale-manual.md).

