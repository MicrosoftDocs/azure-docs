---
title: Launch your First Java Application in Azure Container Apps by Using a GitHub Repository
description: Learn how to deploy a java project in Azure Container Apps by using a GitHub Repository.
services: container-apps
author: KarlErickson
ms.service: azure-container-apps
ms.custom: devx-track-java, devx-track-extended-java
ms.topic: quickstart
ms.date: 02/18/2025
ms.author: hangwan
---

# Quickstart: Launch your first Java application in Azure Container Apps by using a GitHub Repository

This article shows you how to deploy the Spring PetClinic sample application to run on Azure Container Apps by using a Github Repository.

[!INCLUDE [introduction-to-pet-clinic-deployment](includes/introduction-to-pet-clinic-deployment.md)]

## Prepare the project

In a browser window, go to the GitHub reposity for [Azure Container Apps Java Samples](https://github.com/Azure-Samples/azure-container-apps-java-samples.git), and fork the reposity.

Select the `Fork` button at the top of the repo to fork the repo to your account. Then copy the repo URL to use it in the next step.

## Deploy the project

You can define the environment variables that are used throughout this article.

```bash
export RESOURCE_GROUP="petclinic-containerapps"
export LOCATION="canadacentral"
export ENVIRONMENT="env-petclinic-containerapps"
export CONTAINER_APP_NAME="petclinic"
```

If you haven't sign in to Azure from CLI, check the [Setup](quickstart-code-to-cloud.md?tabs=bash%2Cjava#setup) section of [Build and deploy from local source code to Azure Container Apps](quickstart-code-to-cloud.md) for more details.

Build and deploy your first Spring Boot app with the `containerapp up` command.

This command will:

 - Create the resource group.
 - Create an Azure Container Registry.
 - Build the container image and push it to the registry.
 - Create the Container Apps environment with a Log Analytics workspace.
 - Create and deploy the container app using the built container image.

 ```azurecli
az containerapp up \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --environment $ENVIRONMENT \
  --context-path ./spring-petclinic \
  --repo <YOUR_GITHUB_REPOSITORY_NAME>
```

When you push new code to the repository, the GitHub Action will:

- Build the container image and push it to the Azure Container Registry
- Deploy the container image to the created container app

## Verify app status

Once the deployment is done, you can go to the overview page of your container app and click on the **Application Url**, you should be able to see the project running on the cloud.

:::image type="content" source="media/java-deploy-war-file/validation.png" alt-text="Screenshot of validation.":::

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When you no longer need the resources, you can clean up unnecessary resources to avoid Azure charges.

```azurecli
az group delete --name $RESOURCE_GROUP
```

## Next steps

> [!div class="nextstepaction"]
> [Launch your first Java microservice application with managed Java components](java-microservice-get-started.md)
> [Launch your first Java AI application](first-java-ai-application.md)
> [Java build environment variables](java-build-environment-variables.md)

