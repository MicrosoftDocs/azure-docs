---
title: Launch Your First Java Application in Azure Container Apps with a WAR or JAR File
description: Shows how to deploy a Java project in Azure Container Apps with a WAR or JAR file.
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

This article shows you how to use a WAR or JAR file to deploy the Spring PetClinic sample application to Azure Container Apps.

[!INCLUDE [java-get-started-introduction-and-prerequisites-and-install-azure-container-apps-cli-extension](includes/java-get-started-introduction-and-prerequisites-and-install-azure-container-apps-cli-extension.md)]

## Build the project

Build the project by using the following steps:

::: zone pivot="jar"

1. Clone the [Azure Container Apps Java Samples](https://github.com/Azure-Samples/azure-container-apps-java-samples) repo by using the following command:

    ```bash
    git clone https://github.com/Azure-Samples/azure-container-apps-java-samples.git
    ```

::: zone-end

::: zone pivot="war"

1. Clone the [Spring PetClinic Sample Application](https://github.com/spring-petclinic/spring-framework-petclinic) repo by using the following command:

    ```bash
    git clone https://github.com/spring-petclinic/spring-framework-petclinic.git
    ```

::: zone-end

::: zone pivot="jar"

2. Navigate to the **spring-petclinic** folder by using the following command:

    ```bash
    cd azure-container-apps-java-samples/spring-petclinic/spring-petclinic/
    ```

1. Initialize and update the **Spring PetClinic Sample Application** repo to the latest version by using the following command:

    ```bash
    git submodule update \ 
        --init \
        --recursive
    ```

1. Use the following command to clean the Maven build area, compile the project's code, create a JAR file, and skip all tests during these processes:

    ```bash
    mvn clean verify
    ```

You now have a **/target/petclinic.jar** file.

::: zone-end

::: zone pivot="war"

2. Navigate to the **spring-framework-petclinic** folder by using the following command:

    ```bash
    cd spring-framework-petclinic
    ```

1. Clean the Maven build area, compile the project's code, create a JAR file, and skip all tests during these processes, by using the following command:

    ```bash
    mvn clean verify
    ```

You now have a **/target/petclinic.war** file.

::: zone-end

## Deploy the project

::: zone pivot="jar"

Deploy the JAR package to Container Apps by using the following command:

> [!NOTE]
> The default JDK version is 17. You have the option of specifying the version by using environment variables. To change the JDK version for compatibility with your application, use the `--build-env-vars BP_JVM_VERSION=<YOUR_JDK_VERSION>` argument. For more information, see [Build environment variables for Java in Azure Container Apps (preview)](java-build-environment-variables.md).

```azurecli
az containerapp up \
    --resource-group <RESOURCE_GROUP> \
    --name <CONTAINER_APP_NAME> \
    --subscription <SUBSCRIPTION_ID>\
    --location <LOCATION> \
    --environment <ENVIRONMENT_NAME> \
    --artifact <JAR_FILE_PATH_AND_NAME> \
    --ingress external \
    --target-port 8080 \
    --query properties.configuration.ingress.fqdn
```

::: zone-end

::: zone pivot="war"

Deploy the WAR file to Azure Container Apps by using the following command:

> [!NOTE]
> The default Tomcat version is 9. To change the version for compatibility with your application, use the `--build-env-vars BP_TOMCAT_VERSION=<YOUR_TOMCAT_VERSION>` argument. In this example, the Tomcat version is set to 10 (including any minor versions) by setting `BP_TOMCAT_VERSION=10.*`. For more information, see [Build environment variables for Java in Azure Container Apps (preview)](java-build-environment-variables.md).

```azurecli
az containerapp up \
    --resource-group <RESOURCE_GROUP> \
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

::: zone-end

[!INCLUDE [java-get-started-verify-app-status-and-cleanup-and-next-steps](includes/java-get-started-verify-app-status-and-cleanup-and-next-steps.md)]
