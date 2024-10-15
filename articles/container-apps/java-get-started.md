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
---

# Quickstart: Launch your first Java microservice applications with managed Java components in Azure Container Apps

This guide demonstrates how to deploy the Spring PetClinic Microservices sample on Azure Container Apps. It uses the built-in Java components provided by Azure Container Apps to support your microservice applications, eliminating the need for manual deployment. Instead of manually creating a Dockerfile and using a container registry, you can deploy your Java applications directly from Java Archive (JAR) or Web Application Archive (WAR) files.

The PetClinic sample illustrates the microservice architecture pattern. The following diagram depicts the architecture of the PetClinic application on Azure Container Apps.

The diagram illustrates the architectural flows and relationships of the PetClinic sample:

- Builds the frontend app as a standalone web application on the API Gateway App with Node.js, exposing the URL of the API Gateway to route requests to backend service apps.
- Builds the backend apps with Spring Boot, each utilizing HSQLDB as the persistent store.
- Uses managed Java components on Azure Container Apps, including Service Registry, Config Server, and Admin Server.
- Reads configurations of the config server from a Git repository.
- Exposes the URL of the Admin Server to monitor backend apps.
- Exposes the URL of the Service Registry to discover backend apps.
- Analyzes logs using the Log Analytics workspace.

:::image type="content" source="media/java-deploy-war-file/azure-container-apps-petclinic-arch.png" alt-text="Architecture of pet clinic app.":::

By the end of this tutorial, you will deploy one web application and three backend applications, and configure three Java components. These components can be managed through the Azure portal.

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
git clone https://github.com/yiliuTo/spring-petclinic-microservices && cd spring-petclinic-microservices
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

Log in to the Azure CLI and choose your active subscription.

```azurecli
az login
```

Create a resource group to contain your Azure Container App services.

```azurecli
az group create --name $RESOURCE_GROUP --location $LOCATION
```

Create your Container Apps Environment, this environment is used to host both Java components and your Container Apps.

```azurecli
az containerapp env create --name $CONTAINER_APP_ENVIRONMENT --resource-group $RESOURCE_GROUP --location $LOCATION
```


## Create the Java components

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
  --bind $CONFIG_SERVER_COMPONENT $EUREKA_SERVER_COMPONENT \
  --query properties.configuration.ingress.fqdn 
```

## Verify app status

In this example, `containerapp up` command includes the `--query properties.configuration.ingress.fqdn` argument, which returns the fully qualified domain name (FQDN), also known as the app's URL.

View the application by pasting this URL into a browser. Your app should resemble the following screenshot.

:::image type="content" source="media/java-deploy-war-file/azure-container-apps-petclinic-warfile.png" alt-text="Screenshot of pet clinic application.":::

You can also get the URL of the Eureka Server and Admin for Spring dashboard and view your apps' status.

```azurecli
az containerapp env java-component eureka-server-for-spring show \
  --environment $CONTAINER_APP_ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --name $EUREKA_SERVER_COMPONENT \
  --query properties.ingress.fqdn

az containerapp env java-component admin-for-spring show \
  --environment $CONTAINER_APP_ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --name $ADMIN_SERVER_COMPONENT \
  --query properties.ingress.fqdn
```

The dashboard of your Eureka and Admin servers should resemble the following screenshots.

:::image type="content" source="media/java-deploy-war-file/azure-container-apps-petclinic-eureka.png" alt-text="Screenshot of pet clinic application Eureka Server.":::

:::image type="content" source="media/java-deploy-war-file/azure-container-apps-petclinic-admin.png" alt-text="Screenshot of pet clinic application Admin.":::

## Clean up resources

The resources created in this tutorial have an effect on your Azure bill. If you aren't going to use these services long-term, run the following command to remove everything created in this tutorial.

```azurecli
az group delete \
  --resource-group $RESOURCE_GROUP
```

## Related content

- [Config server for Java component](java-config-server-usage.md)

- [Eureka server for Java component](java-eureka-server-usage.md)

- [Admin for Java component](java-admin-for-spring-usage.md)

- [Java build environment variables](java-build-environment-variables.md)
