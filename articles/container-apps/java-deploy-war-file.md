---
title: Deploy a WAR file on Tomcat in Azure Container Apps
description: Learn how to deploy a WAR file on Tomcat in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.custom: devx-track-extended-java
ms.topic: tutorial
ms.date: 02/27/2024
ms.author: cshoe
---

# Tutorial: Deploy a WAR file on Tomcat in Azure Container Apps

Rather than manually creating a Dockerfile and directly using a container registry, you can deploy your Java application directly from a web application archive (WAR) file. This article demonstrates how to deploy a Java application on Tomcat using a WAR file to Azure Container Apps.

By the end of this tutorial you deploy an application on Container Apps that displays the home page of the Spring PetClinic sample application.

:::image type="content" source="media/java-deploy-war-file/azure-container-apps-petclinic-warfile.png" alt-text="Screenshot of petclinic app.":::

> [!NOTE]
> If necessary, you can specify the Tomcat version in the build environment variables.

## Prerequisites

| Requirement  | Instructions |
|--|--|
| Azure account | If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).<br<br>You need the *Contributor* or *Owner* permission on the Azure subscription to proceed. <br><br>Refer to [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md?tabs=current) for details. |
| GitHub Account | Get one for [free](https://github.com/join). |
| git | [Install git](https://git-scm.com/downloads) |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|
| Java | Install the [Java Development Kit](/java/openjdk/install). Use version 17 or later. |
| Maven | Install the [Maven](https://maven.apache.org/download.cgi).|

## Deploy a WAR file on Tomcat

1. Get the sample application.

    Clone the Spring PetClinic sample application to your machine.

    ```bash
    git clone https://github.com/spring-petclinic/spring-framework-petclinic.git
    ```

1. Build the WAR package.

    First, change into the *spring-framework-petclinic* folder.

    ```bash
    cd spring-framework-petclinic
    ```

    Then, clean the Maven build area, compile the project's code, and create a WAR file, all while skipping any tests.

    ```bash
    mvn clean package -DskipTests
    ```

    After you execute the build command, a file named *petclinic.war* is generated in the */target* folder.
  
1. Deploy the WAR package to Azure Container Apps.

    Now you can deploy your WAR file with the `az containerapp up` CLI command.

    ```azurecli
    az containerapp up \
      --name <YOUR_CONTAINER_APP_NAME> \
      --resource-group <YOUR_RESOURCE_GROUP> \
      --subscription <YOUR_SUBSCRIPTION>\
      --location <LOCATION> \
      --environment <YOUR_ENVIRONMENT_NAME> \
      --artifact <YOUR_WAR_FILE_PATH> \
      --build-env-var BP_TOMCAT_VERSION=10.* \
      --ingress external \
      --target-port 8080 \
      --query properties.configuration.ingress.fqdn
    ```

    > [!NOTE]
    > The default Tomcat version is 9. If you need to change the Tomcat version for compatibility with your application, you can use the `--build-env-var BP_TOMCAT_VERSION=<YOUR_TOMCAT_VERSION>` argument to adjust the version number.

    In this example, the Tomcat version is set to `10` (including any minor versions) by setting the `BP_TOMCAT_VERSION=10.*` environment variable.

    You can find more applicable build environment variables in [Java build environment variables](java-build-environment-variables.md)

1. Verify the app status.

    In this example, `containerapp up` command includes the `--query properties.configuration.ingress.fqdn` argument, which returns the fully qualified domain name (FQDN), also known as the app's URL.

    View the application by pasting this URL into a browser. Your app should resemble the following screenshot.

    :::image type="content" source="media/java-deploy-war-file/azure-container-apps-petclinic-warfile.png" alt-text="Screenshot of petclinic application.":::

## Next steps

> [!div class="nextstepaction"]
> [Java build environment variables](java-build-environment-variables.md)
