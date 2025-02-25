---
title: Integrate Application Performance Monitoring into Container Images
description: Describes how to integrate application performance monitoring into container images.
author: KarlErickson
ms.author: dixue
ms.service: azure-spring-apps
ms.topic: upgrade-and-migration-article
ms.date: 01/29/2025
ms.custom: devx-track-java, devx-track-extended-java
---

# Integrate application performance monitoring into container images

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Basic/Standard ✅ Enterprise

This article explains how to integrate the Application Insights Java agent into your container image. In a similar way, you can also integrate other application performance monitoring (APM) agents into your container image, including AppDynamics, New Relic, and Dynatrace.

Azure Spring Apps integrates smoothly with APM agents. When migrating applications to Azure Container Apps or Azure Kubernetes Service (AKS), you need to integrate with APM while building the image. The process is similar to the approach used by Azure Spring Apps. You can also add an APM agent in a separate init-container and inject it into a container app during its initialization.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Pack CLI](https://buildpacks.io/docs/for-platform-operators/how-to/integrate-ci/pack/)

## Choose the Application Insights Java agent

Azure Spring Apps currently uses Application Insights Java agent 3.5.2. You can choose another version depending on your needs. You can find all versions on the [Application Insights Java releases page](https://github.com/microsoft/ApplicationInsights-Java/releases).

You can find the Application Insights connection string in the Azure portal on the **Overview** pane of your Application Insights instance. This string is required for the instructions in this article.

There are some configuration options for Application Insights Java agent, such as sampling percentage and cloud role name. For more information, see [Configuration options of Application Insights for Java](/azure/azure-monitor/app/java-standalone-config).

If you're using a Dockerfile to build a container image, see the [Use Dockerfile](#use-dockerfile) section. If you're using Paketo Buildpacks to build a container image, see the [Use Paketo Buildpacks](#use-paketo-buildpacks) section.

## Use Dockerfile

Use the following steps to modify your Dockerfile:

1. Download the Application Insights Java agent and create a configuration file for it, called **applicationinsights.json**.
1. Add the `-javaagent` option to the entry point of the container image.

To learn more about building JAR file or WAR file with a Dockerfile, see [Build a container image from a JAR or WAR](./migrate-to-azure-container-apps-build-artifacts.md).

### Build a JAR file

The following example Dockerfile builds a JAR file with the previous changes:

```dockerfile
FROM mcr.microsoft.com/openjdk/jdk:17-mariner

ARG APP_INSIGHTS_VERSION
ARG APP_INSIGHTS_CONNECTION_STRING
ARG JAR_FILENAME

# Set up Application Insights agent
ADD https://github.com/microsoft/ApplicationInsights-Java/releases/download/${APP_INSIGHTS_VERSION}/applicationinsights-agent-${APP_INSIGHTS_VERSION}.jar \
  /java-agent/applicationinsights-agent.jar
RUN echo "{\"connectionString\": \"${APP_INSIGHTS_CONNECTION_STRING}\"}" > applicationinsights.json \
    && mv applicationinsights.json /java-agent/applicationinsights.json

COPY $JAR_FILENAME /opt/app/app.jar

# Add -javaagent option
ENTRYPOINT ["java", "-javaagent:/java-agent/applicationinsights-agent.jar", "-jar", "/opt/app/app.jar"]
```

When you build a container image with this Dockerfile, you need to add build arguments using `--build-arg`, as shown in the following example:

```bash
docker build -t <image-name>:<image-tag> \
    -f JAR.dockerfile \
    --build-arg APP_INSIGHTS_VERSION=3.5.2 \
    --build-arg APP_INSIGHTS_CONNECTION_STRING="<connection-string>" \
    --build-arg JAR_FILENAME=<path-to-jar> \
    .
```

### Build a WAR file

The following example Dockerfile builds a WAR file with the previous changes:

```dockerfile
FROM mcr.microsoft.com/openjdk/jdk:17-mariner

ARG TOMCAT_VERSION
ARG TOMCAT_MAJOR_VERSION
ARG APP_INSIGHTS_VERSION
ARG APP_INSIGHTS_CONNECTION_STRING
ARG WAR_FILENAME
ARG TOMCAT_HOME=/opt/tomcat

# Set up Application Insights agent
ADD https://github.com/microsoft/ApplicationInsights-Java/releases/download/${APP_INSIGHTS_VERSION}/applicationinsights-agent-${APP_INSIGHTS_VERSION}.jar \
  /java-agent/applicationinsights-agent.jar
RUN echo "{\"connectionString\": \"${APP_INSIGHTS_CONNECTION_STRING}\"}" > applicationinsights.json \
    && mv applicationinsights.json /java-agent/applicationinsights.json

# Set up Tomcat
ADD https://archive.apache.org/dist/tomcat/tomcat-$TOMCAT_MAJOR_VERSION/v$TOMCAT_VERSION/bin/apache-tomcat-$TOMCAT_VERSION.tar.gz \
    $TOMCAT_HOME/apache-tomcat-$TOMCAT_VERSION.tar.gz
RUN tdnf update -y \
    && tdnf install -y tar \
    && tar -zxf $TOMCAT_HOME/apache-tomcat-$TOMCAT_VERSION.tar.gz -C $TOMCAT_HOME --strip-components 1 \
    && rm $TOMCAT_HOME/apache-tomcat-$TOMCAT_VERSION.tar.gz \
    && rm -r $TOMCAT_HOME/webapps/*

COPY $WAR_FILENAME $TOMCAT_HOME/webapps/app.war

# Add the -javaagent option
ENTRYPOINT ["/bin/sh", "-c" , "export CATALINA_OPTS=-javaagent:/java-agent/applicationinsights-agent.jar && /opt/tomcat/bin/catalina.sh run"]
```

When you build a container image with this Dockerfile, you need to add build arguments using `--build-arg`, as shown in the following example:

```bash
docker build -t <image-name>:<image-tag> \
    -f WAR.dockerfile \
    --build-arg APP_INSIGHTS_VERSION=3.5.2 \
    --build-arg APP_INSIGHTS_CONNECTION_STRING="<connection-string>" \
    --build-arg WAR_FILENAME=<path-to-war> \
    --build-arg TOMCAT_VERSION=<version> \
    --build-arg TOMCAT_MAJOR_VERSION=<major-version> \
    .
```

### Integrate other application performance monitoring agents using Dockerfile

You can integrate other application performance monitoring (APM) agents in a similar way. The following list shows a few other APM agents, along with a brief description on how to integrate them. For download instructions, see the APM official documentation.

- Dynatrace
  - Download the Dynatrace agent in the Dockerfile.
  - Set the following environment variables at runtime:
    - `LD_PRELOAD=<path-to-agent>`
    - `DT_TENANT=<tenant>`
    - `DT_TENANTTOKEN=<token>`
    - `DT_CONNECTION_POINT=<connection-point>`
    - `DT_LOGLEVELCON=info`
    For more information, see [Set up OneAgent on containers for application-only monitoring](https://docs.dynatrace.com/docs/ingest-from/setup-on-container-platforms/docker/set-up-oneagent-on-containers-for-application-only-monitoring).
- AppDynamics
   - Download the AppDynamics agent in the Dockerfile.
   - Add `-javaagent:<path-to-agent>` to the JVM options.
   - Set the required environment variables, including `APPDYNAMICS_AGENT_ACCOUNT_NAME`, `APPDYNAMICS_AGENT_ACCOUNT_ACCESS_KEY`, and so on, at runtime. For a complete list of configuration properties, see [AppDynamics Java Agent Configuration Properties](https://docs.appdynamics.com/appd/23.x/latest/en/application-monitoring/install-app-server-agents/java-agent/administer-the-java-agent/java-agent-configuration-properties).
- New Relic
  - Download the New Relic agent in the Dockerfile. If you have a New Relic Java agent config file, copy it from local machine to your container. For more information about config files, see [Java agent configuration: Config file](https://docs.newrelic.com/docs/apm/agents/java-agent/configuration/java-agent-configuration-config-file/).
  - Add `-javaagent:<path-to-agent>` to the JVM options.
  - Set the environment variables `NEW_RELIC_LICENSE_KEY=<license-key>` and `NEW_RELIC_APP_NAME=<app-name>` at runtime, if you haven't set them in a config file or you want to override the values in a config file.

There's another approach to integrate an APM agent, which is to prebuild a container image for the APM agent and run it as an init container. For more information about this approach, see [Tutorial: Configure the Application Performance Management (APM) Java agent with init containers in Azure Container Apps](../../container-apps/java-application-performance-management-config.md).

## Use Paketo Buildpacks

To integrate the Application Insights agent in your container image, you need a binding. For more information about bindings, see [Bindings](https://paketo.io/docs/howto/configuration/#bindings) in the Paketo documentation.

First, use the following commands to create a binding named **application-insights** in the **bindings** directory on your local machine. The binding consists of only one file, named **type**. The content of the **type** file is the text `ApplicationInsights`, indicating an Application Insights binding.

```bash
mkdir -p bindings/application-insights
echo "ApplicationInsights" > bindings/application-insights/type
```

The following diagram shows the directory structure:

```
bindings
└── application-insights
    └── type
```

Then, use the following command to build the image. Provide the binding to your build by using the `--volume` option. The pack CLI mounts the binding directory into the build container. Then, the Application Insights buildpack detects it and participates in the build process.

```bash
pack build <image-name>:<image-tag> \
    --volume $(pwd)/bindings/application-insights:/platform/bindings/application-insights" \
    --path <path-to-source-root> \
    --builder <builder-name>
```

To deploy the container image in an Azure Container Apps environment, you can use the Azure CLI. For more information, see [Deploy Azure Container Apps with the az containerapp up command](../../container-apps/containerapp-up.md). There are two approaches to pass the Application Insights connection string to the Application Insights agent at runtime. One approach is to pass the connection string as an environment variable. For more information, see the [Configure with environment variables](#configure-with-environment-variables) section. The other approach is to pass the connection string via bindings. For more information, see the [Configure with Bindings](#configure-with-bindings) section.

### Configure with environment variables

To pass a connection string to Application Insights, specify `APPLICATIONINSIGHTS_CONNECTION_STRING` in the `--env-vars` option, as shown in the following example. You can specify other environment variables if you want to pass more configuration options to the agent.

```azurecli
az containerapp up \
    --name <container-app-name> \
    --image <image-name>:<image-tag> \
    --resource-group <resource-group> \
    --environment <environment-name> \
    --location <location> \
    --env-vars "APPLICATIONINSIGHTS_CONNECTION_STRING=<connection-string>"
```

### Configure with bindings

To configure the Application Insights agent with bindings, you can store the Application Insights connection string, binding type, and any other configurations as secrets in your container app. Mount the secrets in a volume so that the Application Insights buildpack can read them at runtime.

With the following command, you declare two secrets at the application level: `type` and `connection-string`. They're mounted to **/bindings/application-insights** in the container. The buildpack searches for bindings in the **/bindings** directory because the `SERVICE_BINDING_ROOT` environment variable is set.

```azurecli
az containerapp create \
    --name <container-app-name> \
    --image <image-name>:<image-tag> \
    --resource-group <resource-group> \
    --environment <environment-name> \
    --secrets "type=ApplicationInsights" "connection-string=<connection-string>" \
    --secret-volume-mount "/bindings/application-insights" \
    --env-vars "SERVICE_BINDING_ROOT=/bindings"
```

Alternatively, you can store the connection string in Azure Key Vault and reference it in secrets. For more information, see [Manage secrets in Azure Container Apps](../../container-apps/manage-secrets.md).

To deploy the container image to Azure Kubernetes Service, see [How to use buildpacks in Kubernetes for Java](https://github.com/paketo-buildpacks/azure-application-insights/blob/main/docs/how-to-use-buildpacks-in-kubernetes-for-java.md#runtime-phase).

### Integrate other application performance monitoring agents using Paketo Buildpacks

There are buildpacks for various APM agents, including the following agents. For more information about binding setup and configurations, see the documentation for each agent.

- [Dynatrace](https://github.com/paketo-buildpacks/dynatrace)
- [AppDynamics](https://github.com/paketo-buildpacks/appdynamics)
- [New Relic](https://github.com/paketo-buildpacks/new-relic)
