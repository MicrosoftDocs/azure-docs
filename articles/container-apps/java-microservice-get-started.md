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

Create a bash script to store the environment variables for your Azure resources. 

```bash
touch setup-env-variables-azure.sh
```

Copy the following environment variables to your script, and customize the top three variables `RESOURCE_GROUP`, `LOCATION`, and `CONTAINER_APP_ENVIRONMENT` as you need:

```bash
#!/usr/bin/env bash

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
export CUSTOMERS_SERVICE_IMAGE=ghcr.io/azure-samples/spring-petclinic-customers-service:main
export VETS_SERVICE_IMAGE=ghcr.io/azure-samples/spring-petclinic-vets-service:main
export VISITS_SERVICE_IMAGE=ghcr.io/azure-samples/spring-petclinic-visits-service:main
export API_GATEWAY_IMAGE=ghcr.io/azure-samples/spring-petclinic-api-gateway:main
```

Then, set the environment variables:

```bash
source setup-env-variables-azure.sh
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
  --name $ADMIN_SERVER_COMPONENT \
  --bind $EUREKA_SERVER_COMPONENT
```

## Deploy Java microservice apps to Azure Container Apps

Deploy the Java microservice apps to Azure Container Apps via our prebuilt images, and bind the Java components to your apps.

```azurecli
az containerapp create \
  --name $CUSTOMERS_SERVICE \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINER_APP_ENVIRONMENT \
  --image $CUSTOMERS_SERVICE_IMAGE \
  --bind $CONFIG_SERVER_COMPONENT $EUREKA_SERVER_COMPONENT

az containerapp create \
  --name $VETS_SERVICE \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINER_APP_ENVIRONMENT \
  --image $VETS_SERVICE_IMAGE \
  --bind $CONFIG_SERVER_COMPONENT $EUREKA_SERVER_COMPONENT

az containerapp create \
  --name $VISITS_SERVICE \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINER_APP_ENVIRONMENT \
  --image $VISITS_SERVICE_IMAGE \
  --bind $CONFIG_SERVER_COMPONENT $EUREKA_SERVER_COMPONENT

az containerapp create \
  --name $API_GATEWAY \
  --resource-group $RESOURCE_GROUP \
  --environment $CONTAINER_APP_ENVIRONMENT \
  --image $API_GATEWAY_IMAGE \
  --bind $CONFIG_SERVER_COMPONENT $EUREKA_SERVER_COMPONENT \
  --ingress external \
  --target-port 8080 \
  --query properties.configuration.ingress.fqdn 
```

## Verify app status

In this example, the `containerapp create` command for the API gateway includes the `--query properties.configuration.ingress.fqdn` argument, which returns the fully qualified domain name (FQDN), also known as the app's URL.

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

## Optional: Customize the code and use your own images

In the above steps, you're using our [built images](https://github.com/orgs/Azure-Samples/packages?repo_name=azure-container-apps-java-samples) for the [Spring Petclinic microservice apps](https://github.com/spring-petclinic/spring-petclinic-microservices). If you want to customize the sample code and use your own images, you can follow the steps.

1. Fork your own copy of [Azure-samples/azure-container-apps-java-samples](https://github.com/Azure-Samples/azure-container-apps-java-samples) by clicking the Fork button in the upper right corner of the repository.

2. Fork your own copy of [spring-petclinic/spring-petclinic-microservices](https://github.com/spring-petclinic/spring-petclinic-microservices) by clicking the Fork button in the upper right corner of the repository. And clone the repository to your local machine.

3. Modify the code in your forked repository and push to your forked repository.

4. Go to your forked `azure-container-apps-java-samples` repository, navigate to the `GitHub Actions` tab, choose `Publish Petclinic images` workflow, and click `Run workflow`, then fill in the repository url of Spring Pet clinic microservices with your forked Petclinic repository url. 

   :::image type="content" source="media/java-deploy-war-file/build-your-own-images.png" alt-text="Screenshot of build customized images.":::

5. After the workflow finished, go to the `Code` tab of your `azure-container-apps-java-samples` repository, click the `Packages` button at the right bottom corner to see the built images.

   :::image type="content" source="media/java-deploy-war-file/github-package-button.png" alt-text="Screenshot of GitHub packages.":::

6. There should be four packages in the list, one for each of the Java microservice apps. Click on the package name to see the details of the package. We use [Artifact attestations](https://docs.github.com/actions/security-for-github-actions/using-artifact-attestations/using-artifact-attestations-to-establish-provenance-for-builds) to increase the security of the images, that's why you see multiple images in the package details. Click the one named as your branch name (should be `main` by default) you shall see the image tag. Update or create your container apps with these tags instead of the image environment variables `$CUSTOMERS_SERVICE_IMAGE`, `$VETS_SERVICE_IMAGE`, `$VISITS_SERVICE_IMAGE`, and `$API_GATEWAY_IMAGE`.  

## Clean up resources

The resources created in this tutorial have an effect on your Azure bill. If you aren't going to use these services long-term, run the following command to remove everything created in this tutorial.

```azurecli
az group delete --resource-group $RESOURCE_GROUP
```

## Related content

- [Config server for Java component](java-config-server-usage.md)

- [Eureka server for Java component](java-eureka-server-usage.md)

- [Admin for Java component](java-admin-for-spring-usage.md)

