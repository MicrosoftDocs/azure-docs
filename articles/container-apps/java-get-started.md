---
title: Launch your first Java microservice applications with managed Java components in Azure Container Apps
description: Learn how to deploy a java project in Azure Container Apps.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: devx-track-extended-java
ms.topic: quickstart
ms.date: 05/07/2024
ms.author: cshoe
zone_pivot_groups: container-apps-java-artifacts
---

# Quickstart: Launch your first Java microservice applications with managed Java components in Azure Container Apps

This article shows you how to deploy the Spring PetClinic Microservices sample to run on Azure Container Apps, and leverage the build-in Java components provided by Azure Container Apps to support your microservice applications without deploying them manually. Rather than manually creating a Dockerfile and directly using a container registry, you can deploy your Java applications directly from Java Archive (JAR) files or web application archive (WAR) files.

The Pet Clinic sample demonstrates the microservice architecture pattern. The following diagram shows the architecture of the PetClinic application on the Azure Container Apps.

The diagram shows the following architectural flows and relationships of the Pet Clinic sample:

- Uses Azure Container Apps to manage the frontend and backend apps. The backend apps are built with Spring Boot and each app uses HSQLDB as the persistent store. The reforged frontend app builds upon Pet Clinic API Gateway App with Node.js serving as a standalone frontend web application.
- Uses the managed Java components on Azure Container Apps, including Service Registry, Config Server, and Admin Server. The Application Configuration Service reads the Git repository configuration.
- Exposes the URL of Spring Cloud Gateway to route request to backend service apps.
- Exposes the URL of the Admin Server to monitor the backend apps.
- Exposes the URL of the Service Registry to discover the backend apps.
- Analyzes logs using the Log Analytics workspace.

:::image type="content" source="media/java-deploy-war-file/azure-container-apps-petclinic-arch.png" alt-text="Architecture of petclinic app.":::

By the end of this tutorial you deploy 1 web application and 3 backend applications, and configure 3 Java components in total, which you can manage through the Azure portal.

## Prerequisites

| Requirement  | Instructions |
|--|--|
| Azure account | If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).<br><br>You need the *Contributor* or *Owner* permission on the Azure subscription to proceed. <br><br>Refer to [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml?tabs=current) for details. |
| GitHub Account | Get one for [free](https://github.com/join). |
| git | [Install git](https://git-scm.com/downloads) |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|
| Container Apps CLI extension | Use version `0.3.47` or higher. Use the `az extension add --name containerapp --upgrade --allow-preview` command to install the latest version. |
| Java | Install the [Java Development Kit](/java/openjdk/install). Use version 17 or later. |
| Apache Maven | Download and install [Apache Maven](https://maven.apache.org/download.cgi).|

## Prepare the project

Clone the Spring PetClinic Microservices sample to your machine and change into the *spring-petclinic-microservices* folder.

```bash
git clone https://github.com/yiliuTo/spring-petclinic-microservices & cd spring-petclinic-microservices
```

Create a bash script with environment variables by making a copy of the supplied template:

```bash
cp .scripts/setup-env-variables-azure-template.sh .scripts/setup-env-variables-azure.sh
```

Open `.scripts/setup-env-variables-azure.sh` and customize the following 3 variables as you need:

```bash
# ==== Resource Group ====
export RESOURCE_GROUP=rg-petclinic # customize this
export LOCATION=eastus # customize this

# ==== Environment and App Instances ====
export CONTAINER_APP_ENVIRONMENT=petclinic-env # customize this
...
```

Then, set the environment variables:

```bash
source .scripts/setup-env-variables-azure.sh
```

## Prepare the Container App Environment

Login to the Azure CLI and choose your active subscription.

```azurecli
az login
```

Create a resource group to contain your Azure Container App services.

```azurecli
az group create --name $RESOURCE_GROUP --location $LOCATION
```

Create your container apps environment, this environment is used to host both Java components and your container apps.

```azurecli
az containerapp env create --name $CONTAINER_APP_ENVIRONMENT --resource-group $RESOURCE_GROUP --location $LOCATION
```

# Create the Java components

Create the Config Server for Java component.

```azurecli
az containerapp env java-component config-server-for-spring create \
  --environment $CONTAINER_APP_ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --name $CONFIG_SERVER_COMPONENT \
  --configuration spring.cloud.config.server.git.uri=$CONFIG_SERVER_URI spring.cloud.config.server.git.default-label=$CONFIG_SERVER_LABEL
```

Create the Eureka Server for Java component.

```azurecli
az containerapp env java-component eureka-server-for-spring create \
  --environment $CONTAINER_APP_ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --name $EUREKA_SERVER_COMPONENT
```

Create the Admin Server for Java component.

```azurecli
az containerapp env java-component admin-for-spring create \
  --environment $CONTAINER_APP_ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --name $ADMIN_SERVER_COMPONENT \
  --bind $EUREKA_SERVER_COMPONENT
```

## Build and deploy the project to Azure Container Apps

Clean the Maven build area, compile the project's code, and create JAR files, all while skipping any tests.

```bash
mvn clean package -DskipTests
```

Deploy the JAR packages to Azure Container Apps.

> [!NOTE]
> If necessary, you can specify the JDK version in the [Java build environment variables](java-build-environment-variables.md).

Now you can deploy your JAR files with the `az containerapp up` CLI command.

```azurecli
az containerapp up \
  --name $CUSTOMERS_SERVICE \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --environment $CONTAINER_APP_ENVIRONMENT \
  --artifact $CUSTOMERS_SERVICE_JAR

az containerapp up \
  --name $VETS_SERVICE \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --environment $CONTAINER_APP_ENVIRONMENT \
  --artifact $VETS_SERVICE_JAR

az containerapp up \
  --name $VISITS_SERVICE \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --environment $CONTAINER_APP_ENVIRONMENT \
  --artifact $VISITS_SERVICE_JAR

az containerapp up \
  --name $API_GATEWAY \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --environment $CONTAINER_APP_ENVIRONMENT \
  --artifact $API_GATEWAY_JAR \
  --ingress external \
  --target-port 8080 \
  --query properties.configuration.ingress.fqdn 
```

> [!NOTE]
> The default JDK version is 17. If you need to change the JDK version for compatibility with your application, you can use the `--build-env-vars BP_JVM_VERSION=<YOUR_JDK_VERSION>` argument to adjust the version number.
>
> You can find more applicable build environment variables in [Java build environment variables](java-build-environment-variables.md).

Bind the Java components to the container apps

```azurecli
az containerapp update \
  --name $CUSTOMERS_SERVICE \
  --resource-group $RESOURCE_GROUP \
  --bind $CONFIG_SERVER_COMPONENT $EUREKA_SERVER_COMPONENT

az containerapp update \
  --name $VETS_SERVICE \
  --resource-group $RESOURCE_GROUP \
  --bind $CONFIG_SERVER_COMPONENT $EUREKA_SERVER_COMPONENT

az containerapp update \
  --name $VISITS_SERVICE \
  --resource-group $RESOURCE_GROUP \
  --bind $CONFIG_SERVER_COMPONENT $EUREKA_SERVER_COMPONENT

az containerapp update \
  --name $API_GATEWAY \
  --resource-group $RESOURCE_GROUP \
  --bind $CONFIG_SERVER_COMPONENT $EUREKA_SERVER_COMPONENT
```

## Verify app status

In this example, `containerapp up` command includes the `--query properties.configuration.ingress.fqdn` argument, which returns the fully qualified domain name (FQDN), also known as the app's URL.

View the application by pasting this URL into a browser. Your app should resemble the following screenshot.

:::image type="content" source="media/java-deploy-war-file/azure-container-apps-petclinic-warfile.png" alt-text="Screenshot of petclinic application.":::

## Next steps

> [!div class="nextstepaction"]
> [Config server for Java component](java-config-server-usage.md)
> [Eureka server for Java component](java-eureka-server-usage.md)
> [Admin for Java component](java-admin-for-spring-usage.md)
> [Java build environment variables](java-build-environment-variables.md)
