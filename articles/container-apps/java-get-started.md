---
title: Launch Your First Java Application in Azure Container Apps with a WAR or JAR File
description: Learn how to deploy a java project in Azure Container Apps with WAR or JAR.
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

This article shows you how to deploy the Spring PetClinic sample application to run on Azure Container Apps with a web application using a WAR or JAR file.

[!INCLUDE [introduction-to-pet-clinic-deployment](includes/introduction-to-pet-clinic-deployment.md)]

## Prepare the project

Clone the Spring PetClinic sample application to your machine.

::: zone pivot="jar"

```bash
git clone https://github.com/Azure-Samples/azure-container-apps-java-samples.git
```

::: zone-end

::: zone pivot="war"

```bash
git clone https://github.com/spring-petclinic/spring-framework-petclinic.git
```

::: zone-end

## Build the project

::: zone pivot="jar"


Change into the *spring-petclinic* folder.

```bash
cd azure-container-apps-java-samples/spring-petclinic/spring-petclinic/
```

Init and update the PetClinc to the latest version.

```bash
git submodule update --init --recursive
```

Clean the Maven build area, compile the project's code, and create a JAR file, all while skipping any tests.

```bash
mvn clean verify
```

After you execute the build command, a file named *petclinic.jar* is generated in the */target* folder.

::: zone-end

::: zone pivot="war"

> [!NOTE]
> If necessary, you can specify the Tomcat version in the [Java build environment variables](java-build-environment-variables.md).

Change into the *spring-framework-petclinic* folder.

```bash
cd spring-framework-petclinic
```

Clean the Maven build area, compile the project's code, and create a WAR file, all while skipping any tests.

```bash
mvn clean verify
```

After you execute the build command, a file named *petclinic.war* is generated in the */target* folder.

::: zone-end

## Deploy the project

::: zone pivot="jar"

Deploy the JAR package to Azure Container Apps.

> [!NOTE]
> If necessary, you can specify the JDK version in the [Java build environment variables](java-build-environment-variables.md).

Now you can deploy your WAR file with the `az containerapp up` CLI command.

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

## Verify app status

In this example, `containerapp up` command includes the `--query properties.configuration.ingress.fqdn` argument, which returns the fully qualified domain name (FQDN), also known as the app's URL.

View the application by pasting this URL into a browser. Your app should resemble the following screenshot.

:::image type="content" source="media/java-deploy-war-file/validation.png" alt-text="Screenshot of validation.":::

## Next steps

> [!div class="nextstepaction"]
> [Launch your first Java microservice application with managed Java components](java-microservice-get-started.md)
> [Launch your first Java AI application](first-java-ai-application.md)
> [Java build environment variables](java-build-environment-variables.md)

