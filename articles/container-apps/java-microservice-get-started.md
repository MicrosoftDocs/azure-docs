---
title: Launch your first Java microservice applications with managed Java components in Azure Container Apps
description: Learn how to deploy a java microservice project in Azure Container Apps with managed java components.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: devx-track-extended-java
ms.topic: quickstart
ms.date: 05/07/2024
ms.author: cshoe
zone_pivot_groups: azure-cli-or-portal
---

# Quickstart: Launch your first Java microservice applications with managed Java components in Azure Container Apps

This guide demonstrates how to deploy the Spring PetClinic Microservices sample on Azure Container Apps. It uses the built-in Java components provided by Azure Container Apps to support your microservice applications, eliminating the need for manual deployment. 

The PetClinic sample illustrates the microservice architecture pattern. The following diagram depicts the architecture of the PetClinic application on Azure Container Apps.

:::image type="content" source="media/java-deploy-war-file/azure-container-apps-petclinic-arch.png" alt-text="Architecture of pet clinic app.":::

- Builds the frontend app as a standalone web application on the API Gateway App with Node.js, exposing the URL of the API Gateway to route requests to backend service apps.
- Builds the backend apps with Spring Boot, each utilizing HSQLDB as the persistent store.
- Uses managed Java components on Azure Container Apps, including Service Registry, Config Server, and Admin Server.
- Reads configurations of the config server from a Git repository.
- Exposes the URL of the Admin Server to monitor backend apps.
- Exposes the URL of the Service Registry to discover backend apps.
- Analyzes logs using the Log Analytics workspace.

By the end of this tutorial, you deploy one web application and three backend applications, and configure three Java components. These components can be managed through the Azure portal.

## Prerequisites

| Requirement  | Instructions |
|--|--|
| Azure account | If you don't have one, [create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).<br><br>You need the *Contributor* or *Owner* permission on the Azure subscription to proceed. <br><br>Refer to [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml?tabs=current) for details. |
| Azure CLI | Install the [Azure CLI](/cli/azure/install-azure-cli).|
| Container Apps CLI extension | Use version `0.3.47` or higher. Use the `az extension add --name containerapp --upgrade --allow-preview` command to install the latest version. |

## Prepare Azure resources

Set the following environment variables in your machine, and customize the top three variables `RESOURCE_GROUP`, `LOCATION`, and `CONTAINER_APP_ENVIRONMENT` as you need:

```bash
export RESOURCE_GROUP=rg-petclinic # customize this
export LOCATION=eastus # customize this
export CONTAINER_APP_ENVIRONMENT=petclinic-env # customize this

export CONFIG_SERVER_COMPONENT=configserver
export ADMIN_SERVER_COMPONENT=admin
export EUREKA_SERVER_COMPONENT=eureka
export CONFIG_SERVER_URI=https://github.com/spring-petclinic/spring-petclinic-microservices-config.git
export CUSTOMERS_SERVICE=customers-service
export VETS_SERVICE=vets-service
export VISITS_SERVICE=visits-service
export API_GATEWAY=api-gateway
export CUSTOMERS_SERVICE_IMAGE=ghcr.io/azure-samples/javaaccelerator/spring-petclinic-customers-service:latest
export VETS_SERVICE_IMAGE=ghcr.io/azure-samples/javaaccelerator/spring-petclinic-vets-service:latest
export VISITS_SERVICE_IMAGE=ghcr.io/azure-samples/javaaccelerator/spring-petclinic-visits-service:latest
export API_GATEWAY_IMAGE=ghcr.io/azure-samples/javaaccelerator/spring-petclinic-api-gateway:latest
```

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


## Create Java components

::: zone pivot="azure-cli"

Create the Config Server for Java component.

```azurecli
az containerapp env java-component config-server-for-spring create \
  --environment $CONTAINER_APP_ENVIRONMENT \
  --resource-group $RESOURCE_GROUP \
  --name $CONFIG_SERVER_COMPONENT \
  --configuration spring.cloud.config.server.git.uri=$CONFIG_SERVER_URI
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
  --name $ADMIN_SERVER_COMPONENT
```
::: zone-end

::: zone pivot="azure-portal"

Go to your Container Apps Environment on Azure Portal, select the **Service** in the left menu, and click **Configure** and choose **Java component** to create a new Java component. In this section, you need to create three components in total.

:::image type="content" source="media/java-deploy-war-file/configure-java-component.png" alt-text=Configure java component.":::

Create the Config Server component: Select `Config Server for Spring` as the **Java component type**, and fill in the **Java component name** with `configserver` which is the value of the environment variable `$CONFIG_SERVER_COMPONENT` you set before. Then in the **Git repositories** section, click **Add** to add a new Git repository with the **URI** `https://github.com/spring-petclinic/spring-petclinic-microservices-config.git`. Click **Add**, then **Next** to the Review page, and click **Configure** to finish the configuration of Java component.

:::image type="content" source="media/java-deploy-war-file/configure-configserver.png" alt-text=Configure config server.":::

Create the Eureka component: Select `Eureka Server for Spring` as the **Java component type**, and fill in the **Java component name** with `eureka` which is the value of the environment variable `$EUREKA_SERVER_COMPONENT` you set before. Click **Next** to the Review page, then click **Configure** to finish the configuration of Java component.

:::image type="content" source="media/java-deploy-war-file/configure-eureka.png" alt-text=Configure Eureka.":::

Create the Admin component: Select `Admin for Spring` as the **Java component type**, and fill in the **Java component name** with `admin` which is the value of the environment variable `$ADMIN_SERVER_COMPONENT` you set before. Click **Next** to the Review page, then click **Configure** to finish the configuration of Java component.

:::image type="content" source="media/java-deploy-war-file/configure-admin.png" alt-text=Configure Admin.":::

::: zone-end

## Deploy Java microservice apps to Azure Container Apps

Deploy the Java microservice apps to Azure Container Apps via our prebuilt images.

```azurecli
az containerapp create \
  --name $CUSTOMERS_SERVICE \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINER_APP_ENVIRONMENT \
  --image $CUSTOMERS_SERVICE_IMAGE
  
az containerapp create \
  --name $VETS_SERVICE \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINER_APP_ENVIRONMENT \
  --image $VETS_SERVICE_IMAGE
  
az containerapp create \
  --name $VISITS_SERVICE \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINER_APP_ENVIRONMENT \
  --image $VISITS_SERVICE_IMAGE
  
az containerapp create \
  --name $API_GATEWAY \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINER_APP_ENVIRONMENT \
  --image $API_GATEWAY_IMAGE \
  --ingress external \
  --target-port 8080 \
  --query properties.configuration.ingress.fqdn 
```

## Bind Azure Container Apps Java components

Bind your Container Apps to Java components.

::: zone pivot="azure-cli"

```azurecli
az containerapp update \
  --name $CUSTOMERS_SERVICE \
  --resource-group $RESOURCE_GROUP \
  --bind $CONFIG_SERVER_COMPONENT $EUREKA_SERVER_COMPONENT $ADMIN_SERVER_COMPONENT

az containerapp update \
  --name $VETS_SERVICE \
  --resource-group $RESOURCE_GROUP \
  --bind $CONFIG_SERVER_COMPONENT $EUREKA_SERVER_COMPONENT $ADMIN_SERVER_COMPONENT

az containerapp update \
  --name $VISITS_SERVICE \
  --resource-group $RESOURCE_GROUP \
  --bind $CONFIG_SERVER_COMPONENT $EUREKA_SERVER_COMPONENT $ADMIN_SERVER_COMPONENT

az containerapp update \
  --name $API_GATEWAY \
  --resource-group $RESOURCE_GROUP \
  --bind $CONFIG_SERVER_COMPONENT $EUREKA_SERVER_COMPONENT $ADMIN_SERVER_COMPONENT \
  --query properties.configuration.ingress.fqdn 
```

::: zone-end

::: zone pivot="azure-portal"

Navigate to your Java components on Azure Portal, click each of the three components you created in the above steps, go to the **Bindings** section, and add the four apps you created in the above steps to the bindings.

:::image type="content" source="media/java-deploy-war-file/bind-apps.png" alt-text=Bind apps.":::

::: zone-end

## Verify app status

In this example, the `containerapp create` and `containerapp update` command for the API gateway includes the `--query properties.configuration.ingress.fqdn` argument, which returns the fully qualified domain name (FQDN), also known as the app's URL.

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

## Optional: configure Java components

The Java components you created in this tutorial can be configured through the Azure portal. You can go to the **Configurations** section and add or update configurations for your Java components. 

:::image type="content" source="media/java-deploy-war-file/java-component-configurations.png" alt-text="Screenshot of pet clinic application Admin.":::

The supported configurations for each Java component are listed in the following links.

- [Config server for Java component](java-config-server-usage.md#configuration-options)

- [Eureka server for Java component](java-eureka-server-usage.md#allowed-configuration-list-for-your-eureka-server-for-spring)

- [Admin for Java component](java-admin-for-spring-usage.md#allowed-configuration-list-for-your-admin-for-spring)

## Clean up resources

The resources created in this tutorial have an effect on your Azure bill. If you aren't going to use these services long-term, run the following command to remove everything created in this tutorial.

```azurecli
az group delete --resource-group $RESOURCE_GROUP
```


