---
title: Build a Container Image by Using Paketo Buildpacks
description: Describes how to build a container image by using Paketo Buildpacks.
author: KarlErickson
ms.author: dixue
ms.service: azure-spring-apps
ms.topic: upgrade-and-migration-article
ms.date: 01/29/2025
ms.custom: devx-track-java, devx-track-extended-java
---

# Containerize an application by using Paketo Buildpacks

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Basic/Standard ✅ Enterprise

This article describes how to build a container image by using Paketo Buildpacks.

Azure Spring Apps service supports building an image from source code without using Dockerfiles. It isn't limited to Java applications but extends to other programming languages and even static web content. In the Standard plan, the service uses open-source [Paketo Buildpacks](https://paketo.io/), while in Enterprise plan, it uses VMware Tanzu Buildpacks. If Tanzu Buildpacks are unavailable or there's no online service for using Paketo, you can switch to local Paketo Buildpacks to build images. Then deploy them to Azure Container Registry or other Docker registries.

This article shows you how to create a builder with a TOML file, and then build your source code or artifact file with the builder. For more information, see [builder.toml](https://buildpacks.io/docs/reference/config/builder-config/). To understand the build image, run image, and stack, see [What are base images](https://buildpacks.io/docs/for-app-developers/concepts/base-images/).

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Pack CLI](https://buildpacks.io/docs/for-platform-operators/how-to/integrate-ci/pack/)

## Standard plan

The Azure Spring Apps Standard plan comes with a built-in builder, which you can't customize. If you use the Standard plan, you need to create a TOML file called **standard-builder.toml** with the following content. With this file, you can create a builder equivalent to the one available in the Azure Spring Apps Standard plan.

```toml
# filename: standard-builder.toml

[[buildpacks]]
uri = "docker://docker.io/paketobuildpacks/java-azure:12.0.0"
id = "paketo-buildpacks/java-azure"

[[buildpacks]]
uri = "docker://docker.io/paketobuildpacks/java-native-image:9.8.0"
id = "paketo-buildpacks/java-native-image"

[[buildpacks]]
uri = "docker://docker.io/paketobuildpacks/dotnet-core:0.48.3"
id = "paketo-buildpacks/dotnet-core"

[[order]]
[[order.group]]
id = "paketo-buildpacks/java-azure"

[[order]]
[[order.group]]
id = "paketo-buildpacks/java-native-image"

[[order]]
[[order.group]]
id = "paketo-buildpacks/dotnet-core"

[build]
image = "paketobuildpacks/build-jammy-base:0.1.129"

[run]
[[run.images]]
image = "paketobuildpacks/run-jammy-base:0.1.129"
```

To create a builder with this TOML file, use the following command:

```bash
pack builder create <builder-name> --config ./standard-builder.toml
```

You can inspect the builder by using the following command:

```bash
pack builder inspect <builder-name>
```

To build your Java source code or .NET source code to a container image with this builder, use the following command:

```bash
pack build <image-name> \
    --path <path-to-source-root> \
    --builder <builder-name>
```

To build an artifact - such as a JAR or WAR file - to a container image with the builder, use the following command:

```bash
pack build <image-name> \
    --path <path-to-artifact> \
    --builder <builder-name>
```

## Enterprise plan

The Azure Spring Apps Enterprise plan uses VMware Tanzu Buildpacks to build source code to container images. Tanzu Buildpacks is built on top of open-source Paketo Buildpacks. So, it's probably impossible to find a Paketo buildpack exactly equivalent to a Tanzu one.

In this section, you can see how to create a builder with Paketo Buildpacks that's close to, but not exactly the same as, the one in the Enterprise plan. It's your responsibility to run tests or look into buildpacks to confirm compatibility of the build in your Enterprise plan and your own builder on your local machine.

The Enterprise plan comes with a default builder, which consists of the following components:

- OS Stack: io.buildpacks.stacks.jammy-base
- Buildpacks:
    - tanzu-buildpacks/java-azure
    - tanzu-buildpacks/dotnet-core
    - tanzu-buildpacks/go
    - tanzu-buildpacks/web-servers
    - tanzu-buildpacks/nodejs
    - tanzu-buildpacks/python

Using the pack CLI, you can create a similar builder with the Paketo OS stack and Paketo Buildpacks on your local machine. Then you can use this newly created builder to build your application source code.

If you're using a builder other than the default one, you need to check its configuration - OS stack and buildpacks - and then create a Paketo builder similar to it. To check a builder's configuration, go to the Azure portal, find your Azure Spring Apps instance, and then view the **Build Service** pane. Find the builder, and then select **Edit Builder**. Alternatively, you can use the Azure CLI command `az spring build-service builder show`.

The following table shows the Paketo OS stack equivalents to the OS stacks used in the Enterprise plan:

| OS stack in the Enterprise plan                     | Paketo OS stack                                                                                                                                                                          |
|-----------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `io.buildpacks.stacks.jammy-base`                   | [paketobuildpacks/jammy-base-stack](https://github.com/paketo-buildpacks/jammy-base-stack)<br>Build: `paketobuildpacks/build-jammy-base`<br/>Run: `paketobuildpacks/run-jammy-base`      |
| `io.buildpacks.stacks.jammy-full`                   | [paketobuildpacks/jammy-full-stack](https://github.com/paketo-buildpacks/jammy-full-stack)<br/>Build: `paketobuildpacks/build-jammy-full`<br/>Run: `paketobuildpacks/run-jammy-full`     |
| `io.buildpacks.stacks.jammy-tiny`                   | [paketobuildpacks/jammy-tiny-stack](https://github.com/paketo-buildpacks/jammy-tiny-stack)<br/>Build: `paketobuildpacks/build-jammy-tiny`<br/>Run: `paketobuildpacks/run-jammy-tiny`     |
| `io.buildpacks.stacks.bionic-base (End of support)` | [paketobuildpacks/bionic-base-stack](https://github.com/paketo-buildpacks/bionic-base-stack)<br/>Build: `paketobuildpacks/build-bionic-base`<br/>Run: `paketobuildpacks/run-bionic-base` |
| `io.buildpacks.stacks.bionic-full (End of support)` | [paketobuildpacks/bionic-full-stack](https://github.com/paketo-buildpacks/bionic-full-stack)<br/>Build: `paketobuildpacks/build-bionic-full`<br/>Run: `paketobuildpacks/run-bionic-full` |

The following table shows the Paketo Buildpack equivalents to the buildpacks used in the Enterprise plan:

| Buildpack in the Enterprise plan     | Paketo Buildpack                                                                              |
|--------------------------------------|-----------------------------------------------------------------------------------------------|
| `tanzu-buildpacks/dotnet-core`       | [paketo-buildpacks/dotnet-core](https://github.com/paketo-buildpacks/dotnet-core)             |
| `tanzu-buildpacks/go`                | [paketo-buildpacks/go](https://github.com/paketo-buildpacks/go)                               |
| `tanzu-buildpacks/java-azure`        | [paketo-buildpacks/java-azure](https://github.com/paketo-buildpacks/java-azure)               |
| `tanzu-buildpacks/java-native-image` | [paketo-buildpacks/java-native-image](https://github.com/paketo-buildpacks/java-native-image) |
| `tanzu-buildpacks/nodejs`            | [paketo-buildpacks/nodejs](https://github.com/paketo-buildpacks/nodejs)                       |
| `tanzu-buildpacks/php`               | [paketo-buildpacks/php](https://github.com/paketo-buildpacks/php)                             |
| `tanzu-buildpacks/python`            | [paketo-buildpacks/python](https://github.com/paketo-buildpacks/python)                       |
| `tanzu-buildpacks/web-servers`       | [paketo-buildpacks/web-servers](https://github.com/paketo-buildpacks/web-servers)             |

Take the default builder in the Enterprise plan as an example. With the following TOML file, named **enterprise-builder.toml**, you can create a similar builder on your local machine:

```toml
# filename: enterprise-builder.toml

[[buildpacks]]
uri = "docker://docker.io/paketobuildpacks/java-azure:latest"
id = "paketo-buildpacks/java-azure"

[[buildpacks]]
uri = "docker://docker.io/paketobuildpacks/dotnet-core:latest"
id = "paketo-buildpacks/dotnet-core"

[[buildpacks]]
uri = "docker://docker.io/paketobuildpacks/go:latest"
id = "paketo-buildpacks/go"

[[buildpacks]]
uri = "docker://docker.io/paketobuildpacks/web-servers:latest"
id = "paketo-buildpacks/web-servers"

[[buildpacks]]
uri = "docker://docker.io/paketobuildpacks/nodejs:latest"
id = "paketo-buildpacks/nodejs"

[[buildpacks]]
uri = "docker://docker.io/paketobuildpacks/python:latest"
id = "paketo-buildpacks/python"

[[order]]
[[order.group]]
id = "paketo-buildpacks/java-azure"

[[order]]
[[order.group]]
id = "paketo-buildpacks/dotnet-core"

[[order]]
[[order.group]]
id = "paketo-buildpacks/go"

[[order]]
[[order.group]]
id = "paketo-buildpacks/web-servers"

[[order]]
[[order.group]]
id = "paketo-buildpacks/nodejs"

[[order]]
[[order.group]]
id = "paketo-buildpacks/python"

[build]
image = "paketobuildpacks/build-jammy-base:latest"

[run]
[[run.images]]
image = "paketobuildpacks/run-jammy-base:latest"
```

To create a build with this TOML file, use the following command:

```bash
pack builder create <builder-name> --config ./enterprise-builder.toml
```

You can inspect the builder by using the following command:

```bash
pack builder inspect <builder-name>
```

Now you have a builder similar to the default builder in Azure Spring Apps Enterprise plan. With this builder, you can use the following command to build your JAR file, WAR file, Java source code, .NET source code, Golang source code, NodeJS source code, or Python source code to a container image:

```bash
pack build <image-name> \
    --path <path-to-source-root> \
    --builder <builder-name>
```

To build an artifact - such as a JAR or WAR file -  to a container image with the builder, use the following command:

```bash
pack build <image-name> \
    --path <path-to-artifact> \
    --builder <builder-name>
```

You can also customize **enterprise-builder.toml** by adding or removing buildpacks, then updating your existing builder or creating a new builder with it.

## Customization

Buildpacks provide a way to customize various configurations. The following examples show common scenarios for building your container image with specific requirements:

- To customize the JDK for Java source code, see [paketo-buildpacks/microsoft-openjdk](https://github.com/paketo-buildpacks/microsoft-openjdk?tab=readme-ov-file#configuration).
- To customize Tomcat for WARs, see [paketo-buildpacks/apache-tomcat](https://github.com/paketo-buildpacks/apache-tomcat?tab=readme-ov-file#configuration).
- To add CA certificates to the system trust store at build and runtime, see [paketo-buildpacks/ca-certificates](https://github.com/paketo-buildpacks/ca-certificates).

For more information on properties and configurations, see [How to Build Java Apps with Paketo Buildpacks](https://paketo.io/docs/howto/java/#build-an-app-as-a-traditional-java-war-or-jar) and [Java Buildpack Reference](https://paketo.io/docs/reference/java-reference/).
