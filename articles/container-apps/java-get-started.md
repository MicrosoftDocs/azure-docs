---
title: Launch Your First Java Application in Azure Container Apps using a WAR or JAR File
description: Shows how to deploy a Java project in Azure Container Apps using a WAR or JAR file.
services: container-apps
author: KarlErickson
ms.author: karler
ms.reviewer: cshoe
ms.service: azure-container-apps
ms.custom: devx-track-java, devx-track-extended-java
ms.topic: quickstart
ms.date: 03/05/2025
zone_pivot_groups: container-apps-java-artifacts
---

# Quickstart: Launch your first Java application in Azure Container Apps using a WAR or JAR file

This article shows you how to deploy the Spring PetClinic sample application to Azure Container Apps using a web application archive (WAR) file or a Java Archive (JAR) file.

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
    git submodule update --init --recursive
    ```

1. Use the following command to clean the Maven build area, compile the project's code, and create a JAR file, skipping all tests during these processes:

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

1. Use the following command to clean the Maven build area, compile the project's code, and create a JAR file, skipping all tests during these processes:

    ```bash
    mvn clean verify
    ```

You now have a **/target/petclinic.war** file.

::: zone-end

## Deploy the project

::: zone pivot="jar"

Deploy the JAR package to Azure Container Apps by using the following command:

> [!NOTE]
> The default JDK version is 17. You have the option of specifying the version by using environment variables. To change the JDK version for compatibility with your application, use the `--build-env-vars BP_JVM_VERSION=<your-JDK-version>` argument. For more information, see [Build environment variables for Java in Azure Container Apps (preview)](java-build-environment-variables.md).

```azurecli
az containerapp up \
    --resource-group <resource-group> \
    --name <container-app-name> \
    --subscription <subscription-ID>\
    --location <location> \
    --environment <environment-name> \
    --artifact <JAR-file-path-and-name> \
    --ingress external \
    --target-port 8080 \
    --query properties.configuration.ingress.fqdn
```

::: zone-end

::: zone pivot="war"

Deploy the WAR file to Azure Container Apps by using the following command:

> [!NOTE]
> The default Tomcat version is 9. To change the version for compatibility with your application, use the `--build-env-vars BP_TOMCAT_VERSION=<your-Tomcat-version>` argument. In this example, the Tomcat version is set to 10 - including any minor versions - by setting `BP_TOMCAT_VERSION=10.*`. For more information, see [Build environment variables for Java in Azure Container Apps (preview)](java-build-environment-variables.md).

```azurecli
az containerapp up \
    --resource-group <resource-group> \
    --name <container-app-name> \
    --subscription <subscription>\
    --location <location> \
    --environment <environment-name> \
    --artifact <WAR-file-path-and-name> \
    --build-env-vars BP_TOMCAT_VERSION=10.* \
    --ingress external \
    --target-port 8080 \
    --query properties.configuration.ingress.fqdn
```

::: zone-end

## Verify the app status

In this example, `containerapp up` command includes the `--query properties.configuration.ingress.fqdn` argument, which returns the fully qualified domain name (FQDN), also known as the app's URL.

View the application by pasting this URL into a browser.

## Clean up resources

If you plan to continue working with more quickstarts and tutorials, you might want to leave these resources in place. When you no longer need the resources, you can remove them to avoid Azure charges, by using the following command:

```azurecli
az group delete --name <resource-group>
```

[!INCLUDE [java-get-started-next-steps](includes/java-get-started-next-steps.md)]
