---
title: Build a Container Image from JAR or WAR
description: Describes how to build a container image from a built JAR or WAR file.
author: KarlErickson
ms.author: dixue
ms.service: azure-spring-apps
ms.topic: upgrade-and-migration-article
ms.date: 01/29/2025
ms.custom: devx-track-java, devx-track-extended-java
---

# Build a container image from a JAR or WAR

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Basic/Standard ✅ Enterprise

This article provides guidance on how to package your Java application from a JAR or WAR file into a container image.

The Azure Spring Apps Standard plan enables you to upload a JAR or WAR file, which it automatically packages into a managed container image. Similarly, Azure Container Apps and Azure Kubernetes Service (AKS) also support deploying a container app directly from a JAR or WAR file.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/).
- An existing container registry for container images storage. For Azure Container Registry, you can set it up using the [Azure portal](/azure/container-registry/container-registry-get-started-portal) or via the [Azure CLI](/azure/container-registry/container-registry-get-started-azure-cli).

## Build a container image

If you want to create a container image that's consistent with the one used in Azure Spring Apps, you can build the image yourself. To build a JAR file, WAR file, or Java source code into a container image, use the following general steps:

1. Build your Java source code into a JAR file or a WAR file.
1. Create a Dockerfile and perform the following actions:
    1. (For WAR files only) Download Tomcat and configure it.
    1. Copy your JAR file or WAR file into the container image.
    1. Specify the entry point of the container image.
1. Create a container image by running the `docker build` command with the Dockerfile created in the previous step.
1. Push the container image to a public or private container registry, so you can deploy it in an Azure Container Apps environment or an Azure Kubernetes Service (AKS) cluster later.

The following sections describe these steps in more detail.

## Build a JAR file

We recommend using [Container images for the Microsoft Build of OpenJDK](/java/openjdk/containers) if your application is running smoothly on Azure Spring Apps. If your requirements change, you can choose other container images that better suit your needs.

To determine JDK version used in your deployment running in Azure Spring Apps, use the following command:

```azurecli
az spring app deployment show \
    --app <app-name> \
    --name <deployment-name> \
    --resource-group <resource-group> \
    --service <service-name> \
    --query properties.source.runtimeVersion
```

The following example Dockerfile is based on JDK 17:

```dockerfile
# filename: JAR.dockerfile

FROM mcr.microsoft.com/openjdk/jdk:17-mariner

ARG JAR_FILENAME

COPY $JAR_FILENAME /opt/app/app.jar
ENTRYPOINT ["java", "-jar", "/opt/app/app.jar"]
```

To build your container image with this Dockerfile, use the following command:

```bash
docker build -t <image-name>:<image-tag> \
    -f JAR.dockerfile \
    --build-arg JAR_FILENAME=<path-to-jar> \
    .
```

For information about customizing JVM options, see [JVM Options](./migrate-to-azure-container-apps-application-overview.md#jvm-options).

## Build a WAR file

Before you build a WAR file, you need to decide which versions of the JDK and Tomcat to use.

To determine the Tomcat version used in your deployment running in Azure Spring Apps, use the following command:

```azurecli
az spring app deployment show \
    --app <app-name> \
    --name <deployment-name> \
    --resource-group <resource-group> \
    --service <service-name> \
    --query properties.source.serverVersion
```

The following example shows a Dockerfile based on JDK 17:

```dockerfile
# filename: WAR.dockerfile

FROM mcr.microsoft.com/openjdk/jdk:17-mariner

ARG TOMCAT_VERSION
ARG TOMCAT_MAJOR_VERSION
ARG WAR_FILENAME
ARG TOMCAT_HOME=/opt/tomcat

# Set up Tomcat
ADD https://archive.apache.org/dist/tomcat/tomcat-$TOMCAT_MAJOR_VERSION/v$TOMCAT_VERSION/bin/apache-tomcat-$TOMCAT_VERSION.tar.gz \
    $TOMCAT_HOME/apache-tomcat-$TOMCAT_VERSION.tar.gz
RUN tdnf update -y \
    && tdnf install -y tar \
    && tar -zxf $TOMCAT_HOME/apache-tomcat-$TOMCAT_VERSION.tar.gz -C $TOMCAT_HOME --strip-components 1 \
    && rm $TOMCAT_HOME/apache-tomcat-$TOMCAT_VERSION.tar.gz \
    && rm -r $TOMCAT_HOME/webapps/*

COPY $WAR_FILENAME $TOMCAT_HOME/webapps/app.war
ENTRYPOINT ["/bin/sh", "-c" , "/opt/tomcat/bin/catalina.sh run"]
```

To build your container image with this Dockerfile, use the following command:

```bash
docker build -t <image-name>:<image-tag> \
    -f WAR.dockerfile \
    --build-arg WAR_FILENAME=<path-to-war> \
    --build-arg TOMCAT_VERSION=<version> \
    --build-arg TOMCAT_MAJOR_VERSION=<major-version> \
    .
```

## Multi-stage builds

The two approaches mentioned previously are package-only builds. They rely on your local build tool to manage the build process and package the result into a JAR or WAR file.

If you prefer not to install a build tool or JDK on the host machine, but you want consistent results across different machines, you can use an alternative method by defining multiple build stages in a Dockerfile. One stage is dedicated to compilation and packaging, and another stage handles the image building process. For more information, see [Multi-stage builds](https://docs.docker.com/build/building/multi-stage/).

## Azure Container Registry Tasks

If you have an Azure Container Registry instance, you can build, push, and run a container image using Azure Container Registry Tasks. For more information, see [Quickstart: Build and run a container image using Azure Container Registry Tasks](/azure/container-registry/container-registry-quickstart-task-cli).
