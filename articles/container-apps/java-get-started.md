---
title: Launch Your First Java Application in Azure Container Apps with a WAR or JAR File
description: Learn how to deploy a java project in Azure Container Apps with a WAR or JAR file.
services: container-apps
author: KarlErickson
ms.service: azure-container-apps
ms.custom: devx-track-java, devx-track-extended-java
ms.topic: quickstart
ms.date: 02/18/2025
ms.author: cshoe
zone_pivot_groups: container-apps-java-artifacts
---

# Quickstart: Launch your first Java application in Azure Container Apps with a WAR or JAR file

This article shows you how to deploy the Spring PetClinic sample application to run on Azure Container Apps with a web application by using a WAR or JAR file.

[!INCLUDE [java-get-started-introduction-and-prerequisites-and-install-azure-container-apps-cli-extension](includes/java-get-started-introduction-and-prerequisites-and-install-azure-container-apps-cli-extension.md)]

## Build the project

Build the project by using the following steps:

::: zone pivot="jar"

1. Clone the Spring PetClinic sample application to your machine by using the following command:

    ```bash
    git clone https://github.com/Azure-Samples/azure-container-apps-java-samples.git
    ```

::: zone-end

::: zone pivot="war"

1. Clone the Spring PetClinic application to your machine by using the following command:

    ```bash
    git clone https://github.com/spring-petclinic/spring-framework-petclinic.git
    ```

::: zone-end

::: zone pivot="jar"

1. Navigate to the **spring-petclinic** folder by using the following command:

    ```bash
    cd azure-container-apps-java-samples/spring-petclinic/spring-petclinic/
    ```

1. Initialize and update the PetClinic to the latest version by using the following command:

    ```bash
    git submodule update --init --recursive
    ```

1. Clean the Maven build area, compile the project's code, create a JAR file, and skip all tests during this process, by using the following command:

    ```bash
    mvn clean verify
    ```

You now have a **/target/petclinic.jar** file.

::: zone-end

::: zone pivot="war"

> [!NOTE]
> If necessary, you can specify the Tomcat version in the [Java build environment variables](java-build-environment-variables.md).

1. Navigate to the **spring-framework-petclinic** folder by using the following command:

    ```bash
    cd spring-framework-petclinic
    ```

1. Clean the Maven build area, compile the project's code, create a JAR file, and skip all tests during this process, by using the following command:

    ```bash
    mvn clean verify
    ```

You now have a **/target/petclinic.war** file.

::: zone-end

## Deploy the project

::: zone pivot="jar"

Deploy the JAR package to Container Apps by using the following command:

> [!NOTE]
> If necessary, you can specify the JDK version in the [Java build environment variables](java-build-environment-variables.md).

```azurecli
az containerapp up \
    --name <CONTAINER_APP_NAME> \
    --resource-group <RESOURCE_GROUP> \
    --subscription <SUBSCRIPTION_ID>\
    --location <LOCATION> \
    --environment <ENVIRONMENT_NAME> \
    --artifact <JAR_FILE_PATH_AND_NAME> \
    --ingress external \
    --target-port 8080 \
    --query properties.configuration.ingress.fqdn
```

> [!NOTE]
> The default JDK version is 17. If you need to change the JDK version for compatibility with your application, you can use the `--build-env-vars BP_JVM_VERSION=<YOUR_JDK_VERSION>` argument to adjust the version number.

You can find more applicable build environment variables in [Java build environment variables](java-build-environment-variables.md).

::: zone-end

::: zone pivot="war"

Deploy the WAR package to Azure Container Apps.

Now you can deploy your WAR file with the `az containerapp up` CLI command.

```azurecli
az containerapp up \
  --name <CONTAINER_APP_NAME> \
  --resource-group <RESOURCE_GROUP> \
  --subscription <SUBSCRIPTION>\
  --location <LOCATION> \
  --environment <ENVIRONMENT_NAME> \
  --artifact <WAR_FILE_PATH_AND_NAME> \
  --build-env-vars BP_TOMCAT_VERSION=10.* \
  --ingress external \
  --target-port 8080 \
  --query properties.configuration.ingress.fqdn
```

> [!NOTE]
> The default Tomcat version is 9. If you need to change the Tomcat version for compatibility with your application, you can use the `--build-env-vars BP_TOMCAT_VERSION=<YOUR_TOMCAT_VERSION>` argument to adjust the version number.

In this example, the Tomcat version is set to `10` (including any minor versions) by setting the `BP_TOMCAT_VERSION=10.*` environment variable.

You can find more applicable build environment variables in [Java build environment variables](java-build-environment-variables.md).

::: zone-end

[!INCLUDE [java-get-started-verify-app-status-and-cleanup-and-next-steps](includes/java-get-started-verify-app-status-and-cleanup-and-next-steps.md)]
